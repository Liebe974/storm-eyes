import TweetBox from "@/components/TweetBox"
import { ArrowLeftIcon, CameraIcon } from "@heroicons/react/24/outline"
import { Post, User } from "@prisma/client"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
//Ce snippet de code définit un composant React appelé Profile. Il inclut des fonctions pour mettre à jour le profil de l'utilisateur, récupérer les tweets de l'utilisateur et obtenir les détails de l'utilisateur depuis le serveur. Il gère également les événements de dépôt de fichiers et utilise le crochet useDropzone. Le composant affiche un message de chargement pendant le chargement des données, puis affiche les détails du profil de l'utilisateur et ses tweets une fois les données chargées.
export default function Profile() {
    const router = useRouter()
    const { data: session, status } = useSession({ required: true })
    const [userTweets, setUserTweets] = useState<Array<Post>>([])
    const [userTweetsUserData, setUserTweetsUserData] = useState<Array<User>>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [base64, setBase64] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [updating, setUpdating] = useState<boolean>(false)
//Ce code est une fonction asynchrone qui met à jour le profil de l'utilisateur. Elle définit un état de chargement, envoie une requête POST à l'endpoint "/api/user" avec l'email de l'utilisateur et les données de l'image de profil, puis déclenche une fonction pour récupérer les tweets de l'utilisateur avant de réinitialiser l'état de chargement.
    async function updateProfile() {
        setUpdating(true)
        const response = await fetch("/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: session?.user?.email as string,
                profileImage: base64,
            })
        })
        await getUserTweets()
        setUpdating(false)
    }
//Ce code définit une fonction asynchrone getUserTweets qui récupère les tweets d'un utilisateur en fonction de son email. Il construit une URL avec l'email de l'utilisateur en tant que paramètre de requête, envoie une requête au serveur, et traite la réponse si elle est réussie, mettant à jour les tweets de l'utilisateur et les données utilisateur associées. Enfin, il défini l'état de chargement sur false.
    async function getUserTweets() {
        const params = new URLSearchParams({
            email: session?.user?.email as string
        })
        const response = await fetch("/api/tweet/user?" + params)
        if (response.status == 200) {
            const data = await response.json()
            setUserTweets(data.posts)
            setUserTweetsUserData(data.userData)
        }
        setLoading(false)
    }
//Ce code définit une fonction asynchrone getUserDetails qui envoie une requête GET à "/api/user" avec l'e-mail de l'utilisateur comme paramètre de requête. Si le statut de la réponse est 200, il traite les données JSON en définissant l'image de profil encodée en base64, le nom et le nom d'utilisateur.
    async function getUserDetails() {
        const params = new URLSearchParams({
            email: session?.user?.email as string
        })
        const response = await fetch("/api/user?" + params)
        if (response.status == 200) {
            const data = await response.json()
            setBase64(data.user.profileImage)
            setName(data.user.name)
            setUsername(data.user.username)
        }
    }
//Ce snippet de code définit une fonction handleDrop qui prend un tableau d'objets File en argument. Il sélectionne le premier fichier du tableau, crée un nouveau FileReader, met en place un rappel pour quand le fichier est lu, puis commence à lire le fichier en tant qu'URL de données. Lorsque le fichier est lu, la représentation base64 du fichier est stockée à l'aide de la fonction setBase64.
    function handleDrop(files: File[]) {
        const file = files[0]
        const reader = new FileReader()
        reader.onload = (event: any) => {
            setBase64(event.target.result) // base64 string
        }
        reader.readAsDataURL(file)
    }

    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        onDrop: handleDrop,
        accept: {
            'image/jpeg': [],
            'image/png': []
        }
    })

    useEffect(() => {
        // Ce code est une fonction TypeScript qui récupère les détails d'un tweet et ses réponses si la session est authentifiée. Elle définit le chargement à vrai, puis appelle de manière asynchrone les fonctions pour obtenir les détails de l'utilisateur et les tweets de l'utilisateur.
        async function f() {
            if (session && status == "authenticated") {
                setLoading(true)
                await getUserDetails()
                await getUserTweets()
            }
        }
        f()
    }, [status, session])

    if (status == "loading") return <div>loading...</div>

    if (loading) return <div className="h-screen overflow-y-scroll flex-grow bg-black text-white">
        <header className='sticky top-0 flex w-full z-10'>
            <div className="backdrop-blur-sm w-full lg:w-3/5 h-16 flex gap-4 items-center border-b border-neutral-600 px-4">
                <button onClick={() => router.back()} className="rounded-full p-1 hover:bg-white hover:bg-opacity-10"><ArrowLeftIcon className="h-5 w-5" /></button>
                <h1 className='text-lg font-bold'>Profile</h1>
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
                <h1 className='text-lg font-bold'>Profile</h1>
            </div>
            <div className='hidden lg:inline-flex lg:flex-grow self-stretch border-l border-neutral-600'></div>
        </header>
        <div className='relative -top-16 w-full flex'>
            <div className='w-full lg:w-3/5 grow-0 shrink-0'>
                <div className='flex flex-col pt-16 min-h-screen'>
                    {/* profile details */}
                    <div className="border-b border-neutral-600 p-4">
                        <div className="relative mb-8 flex justify-between items-start">
                            <div {...getRootProps({ className: "absolute top-9 left-9 hover:bg-neutral-900 hover:bg-opacity-30 rounded-full p-2 cursor-pointer w-fit" })}>
                                <input {...getInputProps()} />
                                <CameraIcon className="h-6 w-6 text-white" />
                            </div>
                            <Image
                                src={base64}
                                alt="profile picture"
                                width={1000}
                                height={1000}
                                className="w-28 h-28 rounded-full"
                            />
                            <button onClick={updateProfile} className="w-24 h-10 flex items-center justify-center bg-red-500 rounded-full">
                                {updating ? <div className='border-2 w-5 h-5 border-white border-t-transparent animate-spin rounded-full'></div> : "Save"}
                            </button>
                        </div>
                        <div>
                            <p className="text-xl font-bold mb-1">{name}</p>
                            <p className="text-neutral-400">@{username}</p>
                        </div>
                    </div>
                    {/* user tweets */}
                    {userTweets.map((post: Post, index: number) => (
                        <TweetBox
                            key={post.id}
                            post={post}
                            userData={userTweetsUserData[index]}
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