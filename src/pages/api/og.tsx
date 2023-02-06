/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ImageResponse } from "@vercel/og";
import type { NextRequest, NextResponse } from "next/server";

export const config = {
    runtime: 'experimental-edge'
};

export default async (req: NextRequest, res: NextResponse) => {
    const font = fetch(new URL('../../../public/assets/Poppins-Black.ttf', import.meta.url))
        .then((res) => res.arrayBuffer());

    try {
        const fontData = await font;
        const { searchParams } = new URL(req.url);

        const hasTitle = searchParams.has('title');
        const title = hasTitle ? searchParams.get('title')?.slice(0, 100) : "Create the perfect playlist for the game you're playing!";

        return new ImageResponse(
            (
                <div
                    style={{
                        backgroundImage: 'radial-gradient(circle at 25px 25px, #171717 2%, transparent 0%), radial-gradient(circle at 75px 75px, #171717 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                    }}

                    tw="bg-black h-full w-full flex flex-col items-center justify-center"
                >
                    <div tw="flex flex-col items-center justify-center">
                        <div tw="flex flex-row justify-center items-center">
                            {/* <img tw="shadow-lg shadow-purple-500/50 h-20 w-20 rounded-lg" src="https://avatars.githubusercontent.com/u/38457291?v=4" alt="face" /> */}
                            <h1 tw="text-center text-neutral-100 text-3xl font-medium">gamingmood</h1>
                        </div>
                        <h2 tw="mt-16 text-center text-neutral-200 text-5xl">{title}</h2>
                    </div>
                </div>
            ),
            {
                width: 1920,
                height: 1080,
                fonts: [
                    {
                        name: 'Poppins',
                        data: fontData,
                        style: 'normal'
                    }
                ]
            }
        )
    } catch (e) {

    }
};