import { PrismaClient } from "@prisma/client";
//Ce extrait de code déclare une variable globale nommée prisma de type PrismaClient ou undefined. Ensuite, il initialise un client en utilisant la variable globale prisma ou un nouveau PrismaClient si prisma est indéfini. Enfin, il exporte le client comme étant le défaut. Si le code ne s'exécute pas dans un environnement de production, il définit la variable globale prisma sur le client.
declare global {
    var prisma: PrismaClient | undefined
}

const client = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") globalThis.prisma = client

export default client