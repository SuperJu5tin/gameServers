import Head from 'next/head'
import Homepage from './Homepage'
import { useEffect } from 'react';


export default function Home() {

  useEffect(() => {
    document.body.style.margin = 0
  }, []);

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Game Servers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Homepage/>
    </>
  )
}
