import Navbar from '@/pages/Navbar'
import { Box } from '@mui/material';
import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect } from 'react'

const Loader = () => {
  
}

const TerrariaServer = () => {

  useEffect(() => {
    document.body.style.margin = 0
    document.body.style.color = "white"
  }, []);

  return (
    <>
      <Head>
        <title>Terraria Server</title>
        <meta name="description" content="Game Servers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div style={{
        zIndex: -1,
        position: "fixed",
        width: "100vw",
        height: "100vh"
      }}>
        <Image 
        src='/terrariaBackground.png'
        layout='fill'
        objectFit='cover'
        />
      </div>
      <Box sx={{
        margin:"auto"
      }}>
        Men
      </Box>
    </>
    
  )
}

export default TerrariaServer