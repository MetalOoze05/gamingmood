import { type NextPage } from "next";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import React from 'react';
import Link from "next/link";
import Image from "next/image";

import { trpc } from "../utils/trpc";
import Modal from "../components/Modal";

import { type Response } from "../server/router/game";

const Form: React.FC<{ session: any, ctx: any }> = ({ session, ctx }) => {
    const [gameName, setGameName] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState(false);

    const mutation = trpc.useMutation(["game.getSongs"]);

    const handleSubmit = () => {
        setLoading(true);
        
        if (gameName.length === 0) {
            setSubmitted(false);
            setError("❌ Please enter a valid game's name!");
            setLoading(false);
            return;
        } else {            
            mutation.mutate({ gameName });
            setLoading(false);
            setSubmitted(true);
        }
    }


    if (submitted) {      
        const data = mutation.data?.data;  
        
        if (mutation.isLoading) {
            return (
                <>  
                    <div className="animate-pulse flex flex-col gap-5">
                        <p className="text-neutral-500">hang on... the 👨‍🍳 chef&apos;s still cooking..</p>
                        <div className="h-20 rounded-md w-full max-w-5xl bg-neutral-800"></div>                    
                        <div className="h-10 rounded-md w-full max-w-4xl bg-neutral-800"></div>                    
                        <div className="h-5 rounded-md w-full max-w-sm bg-neutral-800"></div>                    
                    </div>
                </>
            )
        }

        return (
            <>
                <h1 className="max-w-4xl font-bold text-5xl leading-relaxed">Here is your generated playlist for {gameName}!</h1>
                <button onClick={() => setSubmitted(false)} className="max-w-fit text-neutral-500 underline">i want to play another game</button>
                <p className="text-yellow-500 max-w-2xl text-xs">⚠ Sometimes our AI might not give you the perfect results, kindly re-generate songs if you are not satisfied enough!</p>
                {data?.map((song: Response, index: number) => (
                    <div key={index} className="p-6 bg-neutral-900 rounded-md flex flex-row gap-5 justify-start items-center">
                        <Image className="rounded-md" src={song.video.thumbnail.url} height={144} width={256} alt={song.video.title} />
                        <div className="flex flex-col gap-2 justify-center">
                            <h1 className="font-bold text-xl">{song.audio.name}</h1>
                            <p className="font-medium text-neutral-500 text-sm">{song.audio.artist?.name}</p>
                            <Link className="text-sm text-green-400" href={"https://youtube.com/watch?v=" + song.video.id}>Listen on Spotify!</Link>
                        </div>
                    </div>
                ))}
            </>
        )
    }
    
    return (
        <>
            <h1 className="max-w-4xl font-bold text-5xl leading-relaxed">Which game are you currently playing?</h1>
            <input 
                type="text" 
                name="gameName" 
                id="gameName" 
                placeholder="Minecraft" 
                onChange={(e) => setGameName(e.target.value)}
                value={gameName}

                className="max-w-lg px-6 py-4 bg-neutral-900 placeholder:text-neutral-600 rounded-md border-2 border-neutral-900 hover:border-neutral-800 focus:border-neutral-700 outline-none"
            />

            <p className="text-xs text-yellow-500 max-w-2xl leading-relaxed">⚠ Please write the game&apos;s name accurately, or else we won&apos;t be able to get the correct data and generate songs of the correct vibe</p>
            <p className="text-xs text-red-500 max-w-2xl leading-relaxed">{error}</p>
        
            <button
                type="submit"
                onClick={() => handleSubmit()}
                disabled={loading}

                className="
                    max-w-fit px-4 py-2 
                    border-2 border-green-500 disabled:border-green-500 
                    text-green-500 rounded-md hover:bg-green-500 disabled:bg-green-500
                    font-medium hover:text-black disabled:text-black

                    disabled:cursor-not-allowed
                "
            >
                Start Cooking Playlist
            </button>
        </>
    )
}

const Generate: NextPage = () => {
    const { data: session } = useSession();

    const ctx = trpc.useContext();

    return (
        <>
            <Modal session={session} />
            <div className="flex flex-col justify-center gap-5 py-10 mt-40">
                <div className="flex flex-col gap-5">
                    <h1 className="font-medium text-xl leading-relaxed">Hey there {session?.user?.name}!</h1>

                    <Form session={session} ctx={ctx} />
                </div>
            </div>
        </>
    )
}

export default Generate;