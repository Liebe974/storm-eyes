import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/lib/prisma"
//Ce code définit une fonction de gestionnaire asynchrone pour un point de terminaison API. Il vérifie d'abord une session utilisateur, puis traite les requêtes GET pour récupérer des articles et des données utilisateur à partir d'une base de données en utilisant Prisma. Si la méthode n'est pas GET, il renvoie un message "requête incorrecte". Si des erreurs surviennent pendant le traitement, il enregistre l'erreur et renvoie un message "erreur" avec le code d'état 201.
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        res.status(401).json({ msg: "You must be logged in." })
    }
    try {
        if (req.method == "GET") {
            const tid = req.query.tid as string
            const posts = await prisma.post.findMany({
                where: {
                    parentId: tid
                },
                orderBy: {
                    createdAt: "desc"
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
        res.status(200).json({ msg: "incorrect request" })
    } catch (error) {
        console.log(error)
        res.status(201).json({ msg: "error" })
    }
}