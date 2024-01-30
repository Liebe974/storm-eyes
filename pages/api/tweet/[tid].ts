import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/lib/prisma"
//Ce code définit une fonction asynchrone qui gère une requête et une réponse dans une route API Next.js. Elle récupère d'abord la session de l'utilisateur, puis vérifie si l'utilisateur est connecté. Si l'utilisateur est connecté, elle récupère un article depuis une base de données en utilisant l'identifiant de l'article fourni et renvoie l'article et l'utilisateur associé. Si l'article ou l'utilisateur n'est pas trouvé, elle renvoie un message d'erreur approprié avec le code d'état correspondant.
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