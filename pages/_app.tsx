import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import Layout from '@/components/Layout'
//Ce code définit une fonction par défaut App qui prend Component et pageProps en paramètres. Ensuite, il utilise SessionProvider pour fournir la session à l'application, enveloppe le Component avec un composant Layout, et étale les pageProps dans le Component.
export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return <SessionProvider session={session}>
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </SessionProvider>
}
