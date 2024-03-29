import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/lib/prisma"
//Ce snippet de code définit une fonction asynchrone appelée handler qui gère les requêtes HTTP dans une route API Next.js. Il vérifie d'abord la session utilisateur, puis traite les requêtes GET et POST pour récupérer ou modifier les données utilisateur en utilisant Prisma pour les opérations de base de données. Il gère également les réponses d'erreur.
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