import Navbar from '@/pages/Navbar';
import { Button, ButtonGroup, Container } from '@mui/material';
import { Box } from '@mui/system';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect } from 'react'

function MinecraftServer() {

  useEffect(() => {
    document.body.style.margin = 0
    document.body.style.background = "rgb(77, 46, 18)"
    document.body.style.color = "white"
  }, []);

  return (
    <>
      <Head>
        <title>MinecraftServer</title>
        <meta name="description" content="Game Servers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Box sx={{
        padding:"7vh",
        display:"flex",
        justifyContent:"center",
        background:"linear-gradient(rgb(30, 200, 150), rgb(77, 46, 18))",
      }}>
      </Box>
    </>
    
  )
}

export default MinecraftServer