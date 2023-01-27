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
    video: {
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
        artist?: {
            name: string,
        },
        id: string,
        images?: [],
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
                let obj: Response[] = [];

                const response = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: `Can you suggest 10 songs which matches the vibe of the game "${input.gameName}", kinda include those songs which i can listen to while playing the game. Format the ourput like this "1: Song Name by Artist". Try to include new songs too!`,
                    temperature: 0.7,
                    max_tokens: 256,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                });

                const songs = response.data.choices.map((ch) => ch.text?.toString().slice(2));
                let lines = songs?.toString().split("\n");
                
                const user = await ctx.prisma.account.findFirst({
                    where: {
                        userId: ctx.session?.user?.id
                    }
                });

                for (let line of lines) {
                    const data = await getYtSong(line);
                    const spotifyData = await getSpotifyTrack(line, user?.access_token);
                    
                    obj.push({
                        audio: {
                            artist: {
                                name: spotifyData.artist.items.name || "undefined",
                            },
                            id: spotifyData.tracks.items.id,
                            name: spotifyData.tracks.items.name,
                            type: spotifyData.tracks.items.type,
                            preview_url: spotifyData.tracks.items.preview_url
                        },
                        video: {
                            id: data.video.id as string,
                            title: data.video.title as string,
                            duration: data.video.duration as unknown as string,
                            uploadedAt: data.video.uploadedAt as string,
    
                            thumbnail: {
                                id: data.video.thumbnail?.id as string,
                                width: data.video.thumbnail?.width as number,
                                height: data.video.thumbnail?.height as number,
                                url: data.video.thumbnail?.url as string,
                            },
    
                            channel: {
                                name: data.video.channel?.name as string,
                                id: data.video.channel?.id as string
                            },
                        }
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