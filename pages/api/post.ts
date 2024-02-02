import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import prisma from "@/lib/prisma"
//Ce code définit une fonction asynchrone appelée "handler" qui gère différentes méthodes HTTP (POST et GET) pour un point de terminaison API. Il utilise le ORM Prisma pour interagir avec une base de données, et inclut une logique pour créer des publications, gérer des réponses, récupérer des publications et les données utilisateur associées. Il gère également l'authentification en utilisant une session serveur. Si une erreur se produit, il enregistre l'erreur et renvoie un statut 201 avec un message d'erreur.
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
        res.status(401).json({ msg: "You must be logged in." })
    }
    try {
        if (req.method == "POST") {
            const post = await prisma.post.create({
                data: req.body
            })
            if (req.body.parentId) {
                // this is a reply
                const parent = await prisma.post.findUnique({
                    where: {
                        id: req.body.parentId
                    }
                })
                if (parent?.commentIds.includes(post.id)) {

                } else {
                    if (parent) {
                        const updatedParent = await prisma.post.update({
                            where: {
                                id: parent.id
                            },
                            data: {
                                commentIds: [...parent.commentIds, post.id]
                            }
                        })
                    }
                }
            }
            res.status(200).json({ msg: "done", post })
            return
        }
        if (req.method == "GET") {
            const posts = await prisma.post.findMany({
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