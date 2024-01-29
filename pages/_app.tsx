import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Layout from '@/components/Layout'

/**
 * Rend le composant App avec les props fournies.
 *
 * @param {AppProps} Component - le composant à rendre
 * @param {AppProps} pageProps - les props à transmettre au composant
 * @return {JSX.Element} l'élément JSX rendu
 */
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return <SessionProvider session={session}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </SessionProvider>
}
