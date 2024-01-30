/* eslint-disable react-hooks/exhaustive-deps */
import TweetBox from "@/components/TweetBox"
import TweetForm from "@/components/TweetForm"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { Post, User } from "@prisma/client"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
//Ce code définit un composant React appelé TweetDetails qui gère l'état à l'aide du crochet useState. Il utilise également le crochet useEffect pour récupérer des données et inclut des fonctions pour gérer les réponses, obtenir les détails d'un tweet et récupérer les données de l'utilisateur. Le composant rend également une interface utilisateur pour afficher les tweets, soumettre des réponses et afficher les réponses.
export default function TweetDetails() {
    const router = useRouter()
    const { tid } = router.query
    const { data: session, status } = useSession({ required: true })
    const [post, setPost] = useState<Post>()
    const [userData, setUserData] = useState<User>()
    const [profileImage, setProfileImage] = useState<string>("/blank_pp.webp")
    const [base64, setBase64] = useState<string>("") // image that gets uploaded in new tweet
    const [txt, setTxt] = useState<string>("") // body of the new tweet
    const [key, setKey] = useState<number>(0) // key of the tweet form component
    const [replies, setReplies] = useState<Array<Post>>([])
    const [replyUserData, setReplyUserData] = useState<Array<User>>([])
    const [loading, setLoading] = useState<boolean>(true)

    //Ce extrait de code définit une fonction asynchrone appelée reply qui envoie une requête POST à "/api/post" avec un corps en format JSON. Si le statut de la réponse est 200, alors il récupère les réponses et les détails du tweet, efface certains états, et met à jour le composant.

    async function reply() {
        const response = await fetch("/api/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                body: txt,
                userEmail: session?.user?.email,
                image: base64,
                parentId: tid
            })
        })
        if (response.status == 200) {
            // fetch the tweets
            await getReplies()
            await getTweetDetails()
            setBase64("")
            setKey(key + 1)

        }
    }
//Ce code définit une fonction asynchrone getReplies qui envoie une requête GET à /api/comment avec un paramètre tid. Si le statut de la réponse est 200, il définit les réponses et les données utilisateur de la réponse comme variables d'état, puis définit l'état de chargement sur false.
    async function getReplies() {
        const params = new URLSearchParams({
            tid: tid as string
        })
        const response = await fetch("/api/comment?" + params)
        if (response.status == 200) {
            const data = await response.json()
            setReplies(data.posts)
            setReplyUserData(data.userData)
        }
        setLoading(false)
    }
//Ce snippet de code définit une fonction asynchrone getCurrentUser qui envoie une requête GET à "/api/user" avec l'e-mail en tant que paramètre de requête. Si le statut de la réponse est 200, il analyse la réponse JSON et définit l'image de profil si le message est "utilisateur trouvé".
    async function getCurrentUser() {
        const params = new URLSearchParams({
            email: session?.user?.email as string
        })
        const response = await fetch("/api/user?" + params)
        if (response.status == 200) {
            const data = await response.json()
            if (data.msg == "user found") {
                setProfileImage(data.user.profileImage)
            }
        }
    }

    // tid -> obtenir des données de la base de données en utilisant une API
    //Ce code définit une fonction asynchrone getTweetDetails qui récupère les détails d'un tweet depuis une base de données en utilisant une API. Elle envoie une requête à /api/tweet/{tid}, vérifie le statut de la réponse, et si elle est réussie, définit les données du post et de l'utilisateur en fonction des données JSON reçues.
    async function getTweetDetails() {
        const response = await fetch(`/api/tweet/${tid}`)
        if (response.status == 200) {
            const data = await response.json()
            if (data.msg == "done") {
                setPost(data.post)
                setUserData(data.user)
            }
        }
    }
//Ce code définit une fonction asynchrone qui récupère les détails d'un post et ses réponses si la session est authentifiée et qu'un identifiant de post est présent. Il définit l'état de chargement à vrai, puis attend l'exécution de trois fonctions asynchrones différentes pour récupérer les détails d'un tweet, les informations de l'utilisateur actuel et les réponses.
    useEffect(() => {
        // récupérer les détails du post et les réponse
        async function f() {
            if (session && status == "authenticated" && tid) {
                setLoading(true)
                await getTweetDetails()
                await getCurrentUser()
                await getReplies()
            }
        }
        f()
    }, [status, session, tid, getTweetDetails, getCurrentUser, getReplies])

    if (status == "loading") return <div>loading...</div>

    return <div className="h-screen overflow-y-scroll flex-grow bg-black text-white">
        <header className='sticky top-0 flex w-full z-10'>
            <div className="backdrop-blur-sm w-full lg:w-3/5 h-16 flex gap-4 items-center border-b border-neutral-600 px-4">
                <button onClick={() => router.back()} className="rounded-full p-1 hover:bg-white hover:bg-opacity-10"><ArrowLeftIcon className="h-5 w-5" /></button>
                <h1 className='text-lg font-bold'>Tweet</h1>
            </div>
            <div className='hidden lg:inline-flex lg:flex-grow self-stretch border-l border-neutral-600'></div>
        </header>
        <div className='relative -top-16 w-full flex'>
            <div className='w-full lg:w-3/5 grow-0 shrink-0'>
                <div className='flex flex-col pt-16 min-h-screen'>
                    {/* tweet */}
                    {post && userData ? <TweetBox
                        post={post}
                        userData={userData}
                        onClick={() => { }}
                        userEmail={session.user?.email as string}
                    /> : null}
                    {/* tweet form for replies */}
                    <TweetForm
                        onSubmit={reply}
                        key={key}
                        txt={txt}
                        setTxt={setTxt}
                        base64={base64}
                        setBase64={setBase64}
                        profileImage={profileImage}
                        label="Reply"
                    />
                    {/* replies */}
                    {replies.map((post: Post, index: number) => (
                        <TweetBox
                            key={post.id}
                            post={post}
                            userData={replyUserData[index]}
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