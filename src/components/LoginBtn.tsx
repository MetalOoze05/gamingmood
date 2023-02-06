/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { signIn, signOut } from 'next-auth/react';

import Image from 'next/image';

const LoginBtn: React.FC<{ session: any }> = ({ session }) => {
    if (session) {
        return (
            <>
                <div className='flex flex-row justify-center gap-2 items-center border px-3 py-2 rounded-md'>
                    <Image 
                        loading='lazy'

                        src={session.user?.image}
                        alt={session.user?.name || "idk" }

                        width={35}
                        height={35}

                        className="rounded-md" 
                    />
                    <div className="flex flex-col">
                        <h2 className='text-sm'>{session.user?.name}</h2>
                        <button className='text-xs text-red-500' onClick={() => signOut()}>Log out</button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <button 
            className='px-4 py-2 text-xs md:text-md font-medium border rounded-md bg-transparent hover:bg-white hover:text-black' 
            onClick={() => signIn("spotify")}
        >
            Login
        </button>
    )
}

export default LoginBtn;