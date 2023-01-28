import { type NextPage } from "next";

import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex flex-col justify-center gap-5 py-10 h-screen">
        <div className="flex flex-col gap-5">
          <h1 className="md:max-w-5xl font-bold text-4xl md:text-5xl md:leading-relaxed">Create the perfect playlist for the game you&apos;re playing!</h1>
          <p className="text-neutral-400 md:max-w-4xl font-medium text-xs md:text-lg md:leading-relaxed">We use artificial intelligence to find you the perfect songs to match the vibes of the game you&apos;re currently playing. You can even make a spotify playlist with one fking click.</p>
          <Link href="/generate" className="max-w-fit text-xs md:text-md px-4 py-2 font-medium border rounded-md bg-transparent hover:bg-white hover:text-black">
            Get Started
          </Link>
        </div>
      </div>
    </>
  )
}

export default Home;