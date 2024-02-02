import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Layout from '@/components/Layout'
//Ce code définit un composant React par défaut appelé App. Il prend Component et pageProps en tant que props, où pageProps inclut une propriété session. Le composant enveloppe Component dans un SessionProvider et un Layout.
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return <SessionProvider session={session}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </SessionProvider>
}
