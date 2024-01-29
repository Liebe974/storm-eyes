import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
// Ce extrait de code exporte un objet authOptions avec les propriétés providers, secret, et pages. Le tableau providers inclut un fournisseur d'authentification Google avec un ID client et un secret client provenant de variables d'environnement. La propriété secret contient un secret JWT provenant d'une variable d'environnement, et la propriété pages spécifie une page de connexion personnalisée.
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