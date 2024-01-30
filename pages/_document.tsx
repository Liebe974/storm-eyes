import { Html, Head, Main, NextScript } from 'next/document'
//Ce code snippet est un composant React appelé Document qui représente la structure d'un document HTML. Il utilise JSX pour définir la structure HTML avec des composants tels que Html, Head, Main et NextScript. Ce composant est généralement utilisé dans Next.js pour personnaliser la structure du document de l'application.
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
