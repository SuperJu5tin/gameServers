import Navbar from '@/pages/Navbar';
import { Button, ButtonGroup, Container } from '@mui/material';
import { Box } from '@mui/system';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';

const MinecraftServer = () => {

  const router = useRouter()
  const { id } = router.query
  const server = id
  const [serverLogs, setServerLogs] = useState([])
  const [isServerRunning, setIsServerRunning] = useState(false)

  const socket = io("http://localhost:5000")  

  useEffect(() => {
    document.body.style.margin = 0
    document.body.style.background = "rgb(77, 46, 18)"
    document.body.style.color = "white"
  }, []);

  useEffect(() => {
    socket.on("hi", data => {
      console.log(data.content)
      console.log(serverLogs)
      if (data.content !== serverLogs[serverLogs.length -1] ) {
        setServerLogs(oldArray => [...oldArray, data.content])
      }
    })
    socket.on(`${server}Status`, data => {
      setIsServerRunning(data)
    })
  }, [socket])

  return (
    <>
      <Head>
        <title>{server}</title>
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
        <ButtonGroup variant='contained'>
          <Button>Start Server</Button>
          <Button>Sdas</Button>
        </ButtonGroup>
      </Box>
      <Box sx={{
        borderRadius:"30px",
        margin:"auto",
        background:"green",
        textAlign:"center",
        width:"80vw",
        padding:"1vw",
        marginTop:"5vh",
      }}>
        <Box sx={{
          borderRadius:"30px",
          background:"red"
        }}>
          s
        </Box>
        <Box sx={{
          margin:"0",
          background:"blue",
        }}>
          <h4>{serverLogs}</h4>
        </Box>
      </Box>
    </>
    
  )
}

// export const getServerSideProps = async (context) => {
//   // Fetch data from external API
//   const res = await fetch(`http://localhost:5000/${context.query.id}`)
//   const data = await res.json()

//   // Pass data to the page via props
//   return { props: { data } }
// }

export default MinecraftServer