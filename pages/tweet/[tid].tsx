import TweetBox from "@/components/TweetBox";
import TweetForm from "@/components/TweetForm";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Post, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function TweetDetails() {
  const router = useRouter();
  const { tid } = router.query;
  const { data: session, status } = useSession({ required: true });
  const [post, setPost] = useState<Post>();
  const [userData, setUserData] = useState<User>();
  const [profileImage, setProfileImage] = useState<string>("/blank_pp.webp");
  const [base64, setBase64] = useState<string>(""); // image that gets uploaded in new tweet
  const [txt, setTxt] = useState<string>(""); // body of the new tweet
  const [key, setKey] = useState<number>(0); // key of the tweet form component
  const [replies, setReplies] = useState<Array<Post>>([]);
  const [replyUserData, setReplyUserData] = useState<Array<User>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  //Ce code est une fonction asynchrone qui effectue une requête POST vers "/api/post" avec une charge JSON. Ensuite, il vérifie si le statut de la réponse est 200, et si c'est le cas, il récupère certains tweets, met à jour certaines variables d'état, et définit la clé.
  async function reply() {
    const response = await fetch("/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        body: txt,
        userEmail: session?.user?.email,
        image: base64,
        parentId: tid,
      }),
    });
    if (response.status == 200) {
      // fetch the tweets
      await getReplies();
      await getTweetDetails();
      setBase64("");
      setKey(key + 1);
    }
  }
  //Ce code définit une fonction asynchrone getReplies qui envoie une requête GET à "/api/comment" avec un paramètre tid. Si le statut de la réponse est 200, il définit les données récupérées aux variables d'état replies et replyUserData, puis définit loading à false.
  async function getReplies() {
    const params = new URLSearchParams({
      tid: tid as string,
    });
    const response = await fetch("/api/comment?" + params);
    if (response.status == 200) {
      const data = await response.json();
      setReplies(data.posts);
      setReplyUserData(data.userData);
    }
    setLoading(false);
  }
  //Ce code définit une fonction asynchrone getCurrentUser qui envoie une requête vers l'endpoint "/api/user" avec l'email de l'utilisateur actuel en tant que paramètre de requête. Si le statut de la réponse est 200, il analyse la réponse en tant que JSON et définit l'image de profil de l'utilisateur si le message est "user found".
  async function getCurrentUser() {
    const params = new URLSearchParams({
      email: session?.user?.email as string,
    });
    const response = await fetch("/api/user?" + params);
    if (response.status == 200) {
      const data = await response.json();
      if (data.msg == "user found") {
        setProfileImage(data.user.profileImage);
      }
    }
  }
  //Ce extrait de code définit une fonction asynchrone getTweetDetails qui récupère des données à partir d'un point d'API /api/tweet/{tid}. Ensuite, il vérifie si le statut de la réponse est 200, et si c'est le cas, il traite les données JSON en définissant le post et les données utilisateur.
  //tid -> obtenir des données de la base de données en utilisant une API
  async function getTweetDetails() {
    const response = await fetch(`/api/tweet/${tid}`);
    if (response.status == 200) {
      const data = await response.json();
      if (data.msg == "done") {
        setPost(data.post);
        setUserData(data.user);
      }
    }
  }

  useEffect(() => {
//Ce morceau de code est une fonction asynchrone qui récupère les détails d'un tweet ainsi que ses réponses si la session est authentifiée et qu'un ID de tweet est disponible. Il définit l'état de chargement sur true, puis attend l'exécution de trois fonctions asynchrones distinctes pour obtenir les détails du tweet, l'utilisateur actuel et les réponses.
    async function f() {
      if (session && status == "authenticated" && tid) {
        setLoading(true);
        await getTweetDetails();
        await getCurrentUser();
        await getReplies();
      }
    }
    f();
  }, [status, session, tid]);

  if (status == "loading") return <div>loading...</div>;

  return (
    <div className="h-screen overflow-y-scroll flex-grow bg-black text-white">
      <header className="sticky top-0 flex w-full z-10">
        <div className="backdrop-blur-sm w-full lg:w-3/5 h-16 flex gap-4 items-center border-b border-neutral-600 px-4">
          <button
            onClick={() => router.back()}
            className="rounded-full p-1 hover:bg-white hover:bg-opacity-10"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold">Tweet</h1>
        </div>
        <div className="hidden lg:inline-flex lg:flex-grow self-stretch border-l border-neutral-600"></div>
      </header>
      <div className="relative -top-16 w-full flex">
        <div className="w-full lg:w-3/5 grow-0 shrink-0">
          <div className="flex flex-col pt-16 min-h-screen">
            {/* post */}
            {post && userData ? (
              <TweetBox
                post={post}
                userData={userData}
                onClick={() => {}}
                userEmail={session.user?.email as string}
              />
            ) : null}
            {/* formulaire de reponse du post */}
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
            {/* réponses */}
            {replies.map((post: Post, index: number) => (
              <TweetBox
                key={post.id}
                post={post}
                userData={replyUserData[index]}
                onClick={() => {}}
                userEmail={session.user?.email as string}
              />
            ))}
          </div>
        </div>
        <div className="border-l border-neutral-600 flex-grow self-stretch relative top-16"></div>
      </div>
    </div>
  );
}
