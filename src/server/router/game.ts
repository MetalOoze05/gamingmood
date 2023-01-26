import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";
import { OpenAIApi, Configuration } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const gameRouter = createRouter()
    .mutation('getSongs', {
        input: z.object({
            gameName: z.string(),
        }),
        async resolve({ ctx, input }) {
            try {
                const response = await openai.createCompletion({
                    model: "text-babbage-001",
                    prompt: `suggest a song playlist containing 7 songs which matches the vibe of the game "${input.gameName}"`,
                    temperature: 0.7,
                    max_tokens: 256,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                });

                return {
                    songs: response.data.choices.map(ch => ch.text).toString().slice(2),
                }
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