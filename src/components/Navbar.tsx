import React from 'react';
import Link from 'next/link';
import LoginBtn from './LoginBtn';
import { useSession } from 'next-auth/react';

const Navbar = () => {
    const { data: session } = useSession();

    return (
        <header className='absolute left-0 top-0 w-full z-10 px-10'>
            <div className="py-5 flex flex-row gap-5 border-white">
                <div className="w-full flex justify-between items-center">
                    <div className="flex gap-5">
                        <Link className='font-bold text-lg' href={"/"}>gamingmood.</Link>
                    </div>
                    <div className="flex gap-5">
                        <LoginBtn session={session} />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar;