import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";
import { OpenAIApi, Configuration } from "openai";

import { getYtSong } from "../../utils/ytsr";
import { getSpotifyTrack } from "../../utils/spotify";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export type Response = {
    video?: {
        id: string,
        title: string,
        duration: string,
        uploadedAt: string,

        thumbnail: {
            id: string,
            width: number,
            height: number,
            url: string,
        },

        channel: {
            name: string,
            id: string
        }
    },
    audio: {
        artist: {
            name: string,
            link: string,
            id: string,
            image_url: string,
        },
        id: string,
        image_url: string,
        name: string,
        type: string,
        artists?: [object],
        external_url?: string,
        preview_url: string
    }
}

export const gameRouter = createRouter()
    .mutation('getSongs', {
        input: z.object({
            gameName: z.string(),
        }),
        async resolve({ ctx, input }) {            
            try {
                const obj: Response[] = [];

                const response = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: `Can you suggest 10 songs which matches the vibe of the game "${input.gameName}", kinda include those songs which i can listen to while playing the game. Format the ourput like this "1: Song Name by Artist". Try to include new songs too!`,
                    temperature: 0.7,
                    max_tokens: 256,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                });

                const songs = await response.data.choices.map((ch) => ch.text?.toString().slice(2));
                const lines = await songs?.toString().split("\n");
                                
                const user = await ctx.prisma.account.findFirst({
                    where: {
                        userId: ctx.session?.user?.id
                    }
                });

                for (const line of lines) {
                    const l = line.slice(3);

                    // const data = await getYtSong(l);
                    const spotifyData = await getSpotifyTrack(l, user?.access_token);
                    
                    // console.log(spotifyData.tracks.items.name, spotifyData.tracks.items.album.images[0])
                    // console.log(spotifyData.artist.items.images[0].url)

                    await obj.push({
                        audio: {
                            artist: {
                                name: spotifyData.artist.items?.name as string,
                                id: spotifyData.artist.items?.id as string,
                                link: spotifyData.artist.items?.external_url?.spotify as string,
                                image_url: spotifyData.artist.items?.images[0]?.url ? spotifyData.artist.items?.images[0]?.url : "https://cdn.wallpapersafari.com/15/64/s0zmcy.jpg",
                            },
                            id: spotifyData.tracks.items?.id as string,
                            name: spotifyData.tracks.items?.name as string,
                            type: spotifyData.tracks.items?.type as string,
                            image_url: spotifyData.tracks.items?.album.images[0]?.url ? spotifyData.tracks.items?.album.images[0]?.url : "https://cdn.wallpapersafari.com/15/64/s0zmcy.jpg",
                            preview_url: spotifyData.tracks.items?.preview_url as string
                        },
                        // video: {
                        //     id: data.video.id as string,
                        //     title: data.video.title as string,
                        //     duration: data.video.duration as unknown as string,
                        //     uploadedAt: data.video.uploadedAt as string,
    
                        //     thumbnail: {
                        //         id: data.video.thumbnail?.id as string,
                        //         width: data.video.thumbnail?.width as number,
                        //         height: data.video.thumbnail?.height as number,
                        //         url: data.video.thumbnail?.url as string,
                        //     },
    
                        //     channel: {
                        //         name: data.video.channel?.name as string,
                        //         id: data.video.channel?.id as string
                        //     },
                        // }
                    })
                }
                
                return { data: obj }

            } catch (e) {
                console.error(e);
            }
        }
    })
    .middleware(async ({ ctx, next }) => {
        if (!ctx.session) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return next();
    })