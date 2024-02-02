import { signIn } from "next-auth/react"
//Ce code exporte une fonction par défaut appelée Login qui renvoie un élément JSX. L'élément JSX représente un formulaire de connexion avec un titre et un bouton. Lorsque le bouton est cliqué, il appelle la fonction signIn avec l'argument "google" et un objet avec une propriété callbackUrl définie sur "/". Le bouton affiche également un logo Google et le texte "Se connecter avec Google".
export default function Login() {
    return <div className="w-full h-screen flex flex-col gap-4 items-center justify-center">
        <div className="text-3xl font-bold">Connexion</div>
        <button className="flex text-white rounded-xl border border-blue-500" onClick={() => signIn("google", { callbackUrl: "/" })}>
            <div className="w-12 h-12 bg-white flex items-center justify-center">
                <img className="h-5 w-5" src='https://developers.google.com/identity/images/g-logo.png' />
            </div>
            <div className="bg-blue-500 px-2 flex items-center self-stretch font-medium">
                Se connecter avec Google
            </div>
        </button>
    </div>
}