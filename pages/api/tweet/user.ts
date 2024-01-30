import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/lib/prisma"
//Ce extrait de code définit une fonction asynchrone appelée "handler" qui gère les requêtes HTTP. Elle vérifie la session de l'utilisateur, et si l'utilisateur n'est pas connecté, elle retourne un code d'état 401. Si la méthode de la requête est "GET", elle récupère des publications et des données utilisateur à partir d'une base de données en utilisant Prisma et les renvoie dans la réponse. Si la méthode de la requête n'est pas "GET", elle renvoie un code d'état 201 avec un message "requête incorrecte".
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