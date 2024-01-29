import Link from "next/link"
import React from "react"
import { ArrowLeftOnRectangleIcon, BookmarkIcon, HomeIcon, UserIcon } from "@heroicons/react/24/outline"
import { HomeIcon as HomeIconSolid, BookmarkIcon as BookmarkIconSolid, UserIcon as UserIconSolid } from "@heroicons/react/24/solid"
import { useRouter } from "next/router"
import { signOut } from "next-auth/react"
import storm from "../public/storm.png"
import stormName from "../public/Stormname.png"

const TwitterSVG = () => (
   <div className="flex gap-2">
       <img className="h-10 w-10" src={storm.src} />
       <img className="h-10 w-10" src={stormName.src} />
   </div>
)

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    // router.pathname == "/login"
    if (router.pathname == "/login") {
        return <div>{children}</div>
    }
    return <main className="w-full h-screen flex">
        <div className="w-20 lg:w-1/4 shrink-0 grow-0 border-r border-neutral-600 bg-black text-white h-screen">
            <div className="h-screen flex flex-col space-y-6 p-4">
                <div className="flex w-full justify-center lg:justify-end">
                    <div className="w-60 flex flex-col items-center lg:items-start gap-6">
                        <div className="px-0 lg:px-8">
                            <TwitterSVG />
                        </div>
                        <Link className="flex items-center gap-4 px-0 lg:px-8" href="/">
                            {router.pathname == "/" ? <HomeIconSolid className="h-6 w-6" /> : <HomeIcon className="h-6 w-6" />}
                            <p className={`text-lg hidden lg:inline-flex ${router.pathname == "/" ? "font-bold" : "font-light"}`}>Home</p>
                        </Link>
                        <Link className="flex items-center gap-4 px-0 lg:px-8" href="/bookmarks">
                            {router.pathname == "/bookmarks" ? <BookmarkIconSolid className="h-6 w-6" /> : <BookmarkIcon className="h-6 w-6" />}
                            <p className={`text-lg hidden lg:inline-flex ${router.pathname == "/bookmarks" ? "font-bold" : "font-light"}`}>Bookmarks</p>
                        </Link>
                        <Link className="flex items-center gap-4 px-0 lg:px-8" href="/profile">
                            {router.pathname == "/profile" ? <UserIconSolid className="h-6 w-6" /> : <UserIcon className="h-6 w-6" />}
                            <p className={`text-lg hidden lg:inline-flex ${router.pathname == "/profile" ? "font-bold" : "font-light"}`}>Profile</p>
                        </Link>
                        <button className="flex items-center gap-4 px-0 lg:px-8" onClick={() => signOut()}>
                            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                            <p className="text-lg hidden lg:inline-flex font-light">Logout</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {children}
    </main>
}