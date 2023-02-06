import React from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

const Modal: React.FC<{ session: unknown }> = ({ session }) => {
    if (!session) {
        return (
            <>
                <div className="
                    absolute top-0 left-0 w-full h-screen z-10 
                    bg-black bg-opacity-50 backdrop-blur-md
                    flex flex-col justify-center items-center
                    p-5
                    scroll-none
                ">
                    <div className="px-8 py-6 flex flex-col justify-center items-center gap-5 bg-neutral-900 rounded-md">
                        <h1 className="font-bold text-center text-2xl leading-relaxed">Please login in order to continue!</h1>
                        <button
                            onClick={() => signIn("spotify")}
                            className="max-w-fit px-4 py-2 rounded-md font-medium border border-white text-white hover:bg-white hover:text-black"
                        >
                            Login with Spotify
                        </button>
                        <Link className='text-xs text-neutral-500 underline' href="/">nevermind</Link>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className='hidden'>

            </div>
        </>
    )
}

export default Modal;