import { Box } from '@mui/material';
import { Container } from '@mui/system'
import Head from 'next/head';
import React, { use, useEffect } from 'react'
import Navbar from './Navbar';


function Homepage() {

  useEffect(() => {
    document.body.style.margin = 0
    document.body.style.height = "100px"
    document.body.style.background = "rgb(30, 200, 150)"
  }, []);

  return (
    <>
      <Head>
        <title>Home</title>
        <meta name="description" content="Game Servers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Box>
        Hello3
      </Box>
    </>
  )
}

export default Homepage