import Navbar from '@/pages/Navbar';
import { Button, ButtonGroup, Container, Input } from '@mui/material';
import { Box } from '@mui/system';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';

const MinecraftServer = () => {

  const router = useRouter()
  const { id } = router.query
  const server = id
  const secret = process.env.REACT_PUBLIC_SECRET
  const [serverLogs, setServerLogs] = useState([])
  const [isServerRunning, setIsServerRunning] = useState(false)

  const socket = io("http://localhost:5000")  

  useEffect(() => {
    document.body.style.margin = 0
    document.body.style.background = "#756049"
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

  const KeyboardCommand = () => {
    
  }

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
        background:"linear-gradient(rgb(30, 200, 150), #756049)",
      }}>
        <ButtonGroup variant='contained'>
          <Button>Start Server</Button>
          <Button>Sdas</Button>
        </ButtonGroup>
      </Box>
      <Box sx={{
        borderRadius:"30px 30px 30px 0",
        margin:"auto",
        background:"#867861",
        textAlign:"center",
        width:"80vw",
        marginTop:"5vh",
        marginBottom:"5vh"
      }}>
        <Box sx={{
          borderRadius:"30px 30px 0 0",
          background:"#7a6a51",
          margin:"auto",
          marginBottom:".5vh",
          paddingTop:"1vh",
          paddingBottom:".5vh",
          paddingLeft:"1vw",
          paddingRight:"1vw",
        }}>
          <p>aStuff adnt he things are here in this little space and this is where I like to vibe just right here in this little box this little box is a nice little box and is where I am able to vibe without fear of making others dissapointed yk its kinda nice to just vibedslkfj</p>
          <p>aStuff adnt he things are here in this little space and this is where I like to vibe just right here in this little box</p>
          <p>aStuff adnt he things are here in this little space and this is where I like to vibe just right here in this little box</p>
          <p>aStuff adnt he things are here in this little space and this is where I like to vibe just right here in this little box</p>
          <p>aStuff adnt he things are here in this little space and this is where I like to vibe just right here in this little box</p>
          <p>{serverLogs}</p>
        </Box>
        <Box sx={{
          display:"grid"
        }}>
          <Input placeholder="Type a Command..." fullWidth disableUnderline={true} sx={{
            height:"40px",
            width:"97%",
            marginLeft:"10px",
          }} />
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