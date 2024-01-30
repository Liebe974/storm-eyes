/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { signIn } from "next-auth/react"
//Ce code définit un composant fonctionnel appelé Login, qui rend un bouton pour se connecter avec Google. Lorsque le bouton est cliqué, il déclenche la fonction signIn avec le fournisseur "google" et redirige vers l'URL "/" après une connexion réussie.
export default function Login() {
    return <div className="w-full h-screen flex items-center justify-center">
        <button className="flex text-white rounded-sm border border-blue-500" onClick={() => signIn("google", { callbackUrl: "/" })}>
            <div className="w-12 h-12 bg-white flex items-center justify-center">
                <img className="h-5 w-5" src='https://developers.google.com/identity/images/g-logo.png' />
            </div>
            <div className="bg-blue-500 px-2 flex items-center self-stretch font-medium">
                Sign in with Google
            </div>
        </button>
    </div>
}