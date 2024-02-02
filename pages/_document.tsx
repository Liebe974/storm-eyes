import { Html, Head, Main, NextScript } from 'next/document'
//Ce code snippet est un composant React appelé Document qui retourne une structure JSX représentant la structure de base d'un document HTML. Il inclut les composants Html, Head, Main, et NextScript.
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
