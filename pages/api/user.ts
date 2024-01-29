import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/lib/prisma"

// Ce code TypeScript définit une fonction de gestionnaire d'API à l'aide de Next.js. Il vérifie une session utilisateur et effectue différentes actions en fonction de la méthode HTTP (GET ou POST) et de la présence d'un paramètre email dans la requête. Si la méthode est GET, il recherche un utilisateur par email et renvoie l'utilisateur s'il est trouvé. Si la méthode est POST, il crée ou met à jour un utilisateur en fonction de la présence de l'e-mail dans le corps de la requête. Si des erreurs surviennent, elles sont consignées et renvoient un statut 201 avec un message d'erreur.
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
            const email = req.query.email as string
            if (email) {
                const currentUser = await prisma.user.findUnique({
                    where: {
                        email: email
                    }
                })
                if (!currentUser) {
                    res.status(200).json({ msg: "new user" })
                    return
                }
                res.status(200).json({ msg: "user found", user: currentUser })
                return
            }
            res.status(200).json({ msg: "no email" })
        }
        if (req.method == "POST") {
            const email = req.body.email as string
            if (email) {
                const currentUser = await prisma.user.findUnique({
                    where: {
                        email: email
                    }
                })
                if (!currentUser) {
                    // create
                    const user = await prisma.user.create({
                        data: req.body
                    })
                    res.status(200).json({ msg: "done", user })
                    return
                } else {
                    // update
                    const user = await prisma.user.update({
                        where: {
                            email: email
                        },
                        data: req.body
                    })
                    res.status(200).json({ msg: "done", user })
                    return
                }
            }
            res.status(200).json({ msg: "no email" })
            return
        }
    } catch (error) {
        console.log(error)
        res.status(201).json({ msg: "error" })
    }
}