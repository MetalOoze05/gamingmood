import React from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

const LoginBtn: React.FC<{ session: any }> = ({ session }) => {
    if (session) {
        return (
            <>
                <div className='flex flex-row justify-center gap-5 items-center border px-4 py-2 rounded-md'>
                    <Image 
                        loading='lazy'

                        src={session.user?.image}
                        alt={session.user?.name || "idk" }

                        width={35}
                        height={35}

                        className="rounded-full" 
                    />
                    <div className="flex flex-col">
                        <h2 className='text-sm'>{session.user?.name}</h2>
                        <button className='max-w-fit text-xs text-red-500' onClick={() => signOut()}>Log out</button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <button 
            className='px-4 py-2 font-medium border rounded-md bg-transparent hover:bg-white hover:text-black' 
            onClick={() => signIn("discord")}
        >
            Login
        </button>
    )
}

export default LoginBtn;