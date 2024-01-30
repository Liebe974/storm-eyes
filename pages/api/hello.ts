// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
//Cette définition de classe crée un alias de type appelé Data qui représente un objet avec une propriété name de type chaîne de caractères.Data: Définit un alias de type représentant un objet avec une propriété name de type chaîne de caractères.
type Data = {
  name: string
}
//Ce code définit une fonction par défaut appelée "handler" qui prend une requête (req) de type NextApiRequest et une réponse (res) de type NextApiResponse. À l'intérieur de la fonction, il définit le statut de la réponse à 200 et envoie un objet JSON avec le nom "John Doe".
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' })
}
