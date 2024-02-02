import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/lib/prisma"

//Ce code définit une fonction de gestionnaire asynchrone pour un point de terminaison API. Il vérifie la session d'un utilisateur, et si l'utilisateur n'est pas connecté, il renvoie un code d'état 401. Si la méthode de la requête est POST, il met à jour un article dans la base de données et renvoie un code d'état 200 avec l'article mis à jour. Sinon, il renvoie un code d'état 201 avec un message indiquant une demande incorrecte.
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        res.status(401).json({ msg: "You must be logged in." })
    }
    if (req.method == "POST") {
        const post = await prisma.post.update({
            where: {
                id: req.body.id
            },
            data: {
                likedUserEmails: req.body.likedUserEmails
            }
        })
        res.status(200).json({ msg: "done", post })
    }
    res.status(201).json({ msg: "incorrect request" })
}