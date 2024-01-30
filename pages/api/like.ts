import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/lib/prisma"
//Ce extrait de code exporte une fonction asynchrone appelée handler qui prend req (un objet NextApiRequest) et res (un objet NextApiResponse) en tant que paramètres.Il récupère d'abord la session en utilisant la fonction getServerSession, et s'il n'y a pas de session, il renvoie un statut 401 avec un message indiquant que l'utilisateur doit être connecté.Si la méthode de la requête HTTP est "POST", il met à jour un post en utilisant l'objet prisma et renvoie un statut 200 avec un message et le post mis à jour. Sinon, il renvoie un statut 201 avec un message "requête incorrecte".
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