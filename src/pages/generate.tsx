import { type NextPage } from "next";
import { useState } from "react";
import { useSession } from "next-auth/react";

import React from 'react';
import { trpc } from "../utils/trpc";

import Modal from "../components/Modal";


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
            
            setSubmitted(true);
            setLoading(false);
        }
    }

    if (submitted) {
        const songs = mutation.data?.songs;
        let object = [];
        let lines = songs?.split("\n");

        if (lines) {
            for (let x of lines) {
                const t: any = x.split(". ")[1]?.replaceAll('"', "");
                const [song, by] = t.split("by").map((k: string) => k.trim());
    
                object.push({ song, by });
            }
        }

        return (
            <>
                <h1 className="max-w-4xl font-bold text-5xl leading-relaxed">Here is your generated playlist for {gameName}!</h1>
                <button onClick={() => setSubmitted(false)} className="max-w-fit text-neutral-500 underline">i want to play another game</button>
                {object?.map((song: any, index: number) => (
                    <h1 key={index} className="text-lg leading-relaxed">
                        {index+1}: {song.song}
                    </h1>
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

            {/* <div className="form-check flex flex-row gap-2">
                <input 
                    type="checkbox"
                    name="lofi"
                    id="lofi"

                    className="form-check-input h-5 w-5 appearance-none border border-neutral-800 rounded-full bg-neutral-900 checked:bg-green-500 checked:border-green-400 focus:outline-none"
                />

                <label htmlFor="lofi" className="form-check-label">
                    <p className="text-xs font-medium text-neutral-100 leading-relaxed">include lofi songs</p>
                </label>
            </div> */}

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