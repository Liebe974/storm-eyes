import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/lib/prisma"
//Ce code définit un gestionnaire de requêtes asynchrone utilisant les routes API de Next.js. Il récupère d'abord la session de l'utilisateur, puis vérifie si l'utilisateur est connecté. S'il est connecté, il récupère un article et son utilisateur associé depuis la base de données en utilisant Prisma. En fonction de l'existence de l'article et de l'utilisateur, il renvoie différentes réponses HTTP avec des messages et des données correspondants.
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        res.status(401).json({ msg: "You must be logged in." })
    }
    const { tid } = req.query
    const post = await prisma.post.findUnique({
        where: {
            id: tid as string
        }
    })
    if (post) {
        const user = await prisma.user.findUnique({
            where: {
                email: post.userEmail
            }
        })
        if (user) {
            res.status(200).json({ msg: "done", post, user })
            return
        }
        res.status(201).json({ msg: "post found. user not found" })
    } else {
        res.status(201).json({ msg: 'post not found' })
    }

}