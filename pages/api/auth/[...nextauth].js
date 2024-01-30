import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
//Ce extrait de code configure des fournisseurs d'authentification et met en place NextAuth avec les options spécifiées. Il utilise des variables d'environnement pour des informations sensibles telles que l'identifiant client Google, le secret client, et le secret JWT. La fonction NextAuth est utilisée pour initialiser l'authentification avec les options fournies.
export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        // ...add more providers here
    ],
    secret: process.env.JWT_SECRET,
    pages: {
        signIn: "/login"
    }
}

export default NextAuth(authOptions)