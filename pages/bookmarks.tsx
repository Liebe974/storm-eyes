import TweetBox from "@/components/TweetBox"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { Post, User } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
//Ce code définit un composant fonctionnel appelé "Bookmarks" qui récupère et affiche les tweets mis en signet par l'utilisateur. Il utilise le hook useRouter de Next.js pour obtenir l'objet router, le hook useSession pour obtenir la session de l'utilisateur, et useState pour gérer l'état de bookmarkedTweets, bookmarkedTweetsUserData et loading. Il définit également une fonction asynchrone getBookmarks pour récupérer les données des tweets mis en signet et définir l'état en conséquence. Le composant utilise useEffect pour appeler getBookmarks lorsque le statut de la session change. L'interface utilisateur rend conditionnellement le chargement ou les tweets mis en signet en fonction du statut de la session et de l'état de chargement.
export default function Bookmarks() {
    const router = useRouter()
    const { data: session, status } = useSession({ required: true })
    const [bookmarkedTweets, setBookmarkedTweets] = useState<Array<Post>>([])
    const [bookmarkedTweetsUserData, setBookmarkedTweetsUserData] = useState<Array<User>>([])
    const [loading, setLoading] = useState<boolean>(true)
//Ce extrait de code définit une fonction asynchrone getBookmarks qui envoie une requête pour récupérer les signets du serveur. Il construit un paramètre de requête avec l'e-mail de l'utilisateur, envoie une requête GET à "/api/bookmark" avec le paramètre construit, et traite la réponse en définissant les tweets mis en signet et les données utilisateur. Enfin, il définit l'état de chargement sur faux.
    async function getBookmarks() {
        const params = new URLSearchParams({
            email: session?.user?.email as string
        })
        const response = await fetch("/api/bookmark?" + params)
        if (response.status == 200) {
            const data = await response.json()
            setBookmarkedTweets(data.posts)
            setBookmarkedTweetsUserData(data.userData)
        }
        setLoading(false)
    }

    useEffect(() => {
       // Ce extrait de code est une fonction asynchrone qui récupère les détails d'un tweet et ses réponses. Elle vérifie d'abord si la session existe et si le statut est "authentifié", puis elle définit le chargement à vrai et appelle la fonction getBookmarks.
        async function f() {
            if (session && status == "authenticated") {
                setLoading(true)
                await getBookmarks()
            }
        }
        f()
    }, [status, session])

    if (status == "loading") return <div>loading...</div>

    if (loading) return <div className="h-screen overflow-y-scroll flex-grow bg-black text-white">
        <header className='sticky top-0 flex w-full z-10'>
            <div className="backdrop-blur-sm w-full lg:w-3/5 h-16 flex gap-4 items-center border-b border-neutral-600 px-4">
                <button onClick={() => router.back()} className="rounded-full p-1 hover:bg-white hover:bg-opacity-10"><ArrowLeftIcon className="h-5 w-5" /></button>
                <h1 className='text-lg font-bold'>Bookmarks</h1>
            </div>
            <div className='hidden lg:inline-flex lg:flex-grow self-stretch border-l border-neutral-600'></div>
        </header>
        <div className="w-full flex relative -top-16">
            <div className="w-full lg:w-3/5 grow-0 shrink-0 p-8 min-h-screen flex items-center justify-center">Loading...</div>
            <div className='border-l border-neutral-600 flex-grow self-stretch relative top-16'></div>
        </div>
    </div>

    return <div className="h-screen overflow-y-scroll flex-grow bg-black text-white">
        <header className='sticky top-0 flex w-full z-10'>
            <div className="backdrop-blur-sm w-full lg:w-3/5 h-16 flex gap-4 items-center border-b border-neutral-600 px-4">
                <button onClick={() => router.back()} className="rounded-full p-1 hover:bg-white hover:bg-opacity-10"><ArrowLeftIcon className="h-5 w-5" /></button>
                <h1 className='text-lg font-bold'>Bookmarks</h1>
            </div>
            <div className='hidden lg:inline-flex lg:flex-grow self-stretch border-l border-neutral-600'></div>
        </header>
        <div className='relative -top-16 w-full flex'>
            <div className='w-full lg:w-3/5 grow-0 shrink-0'>
                <div className='flex flex-col pt-16 min-h-screen'>
                    {/* bookmarks */}
                    {bookmarkedTweets.map((post: Post, index: number) => (
                        <TweetBox
                            key={post.id}
                            post={post}
                            userData={bookmarkedTweetsUserData[index]}
                            onClick={() => { }}
                            userEmail={session.user?.email as string}
                        />
                    ))}
                </div>
            </div>
            <div className='border-l border-neutral-600 flex-grow self-stretch relative top-16'></div>
        </div>
    </div>
}