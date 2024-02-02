// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
//Le type Data est défini comme un objet avec une propriété name de type chaîne de caractères.
type Data = {
  name: string
}

//Ce code est un gestionnaire de route d'API Next.js. Il définit une fonction qui prend une requête (req) et une réponse (res) en tant que paramètres. Lorsque ce gestionnaire est appelé, il définit le statut de la réponse à 200 et envoie un objet JSON avec le nom 'John Doe'.
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}
