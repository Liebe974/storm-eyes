import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/lib/prisma"
//Ce code TypeScript définit une fonction de gestionnaire d'API utilisant Next.js. Il vérifie d'abord une session utilisateur, puis gère les requêtes GET pour récupérer des publications et des données utilisateur à partir d'une base de données en utilisant Prisma. Pour d'autres méthodes de requête, il renvoie un message "requête incorrecte" avec le code d'état 201.
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        res.status(401).json({ msg: "You must be logged in." })
    }
    if (req.method == "GET") {
        const email = req.query.email as string
        const posts = await prisma.post.findMany({
            where: {
                userEmail: email
            }
        })
        let userData = []
        for (let i = 0; i < posts.length; i++) {
            const user = await prisma.user.findUnique({
                where: {
                    email: posts[i].userEmail
                }
            })
            userData.push(user)
        }
        res.status(200).json({ posts, userData })
        return
    }
    res.status(201).json({ msg: "incorrect request" })
}