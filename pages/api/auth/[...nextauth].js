import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
//Ce code exporte un objet appelé authOptions qui contient des options de configuration pour les fournisseurs d'authentification et une clé secrète. Il exporte également une fonction par défaut qui utilise NextAuth avec les authOptions. L'objet authOptions spécifie un fournisseur d'authentification Google et définit la page de connexion sur "/login".
export const authOptions = {

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),

    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: "/login"
    }
}

export default NextAuth(authOptions)