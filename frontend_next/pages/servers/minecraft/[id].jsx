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
  const serverName = id
  const secret = process.env.REACT_PUBLIC_SECRET
  const [error, setError] = useState("")
  const [serverLogs, setServerLogs] = useState([])
  const [isServerRunning, setIsServerRunning] = useState(false)

  const socket = io("http://localhost:5000")  

  // background

  useEffect(() => {
    document.body.style.margin = 0
    document.body.style.background = "#756049"
    document.body.style.color = "white"
  }, []);

  // Server Logs through socket

  useEffect(() => {
    socket.on(`minecraft-${serverName}-logs`, data => {
      console.log(data.currentLog)
      console.log(serverLogs)
      if (data.currentLog !== serverLogs[serverLogs.length -1] ) {
        setServerLogs(oldArray => [...oldArray, data.currentLog])
      }
    })
    socket.on(`minecraft-${serverName}-status`, data => {
      setIsServerRunning(data)
    })
  }, [socket])

  const capitalizeFirstLetter = (string) => {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  const startServer = () => {
    fetch(`/api/servers/minecraft/test/start`, {
      method:'POST',
    })
  }

  const updateServerLogs = (option) => {
    return fetch(`http://localhost:5000/minecraft/${serverName}/${option}/${secret}`, {
      method:'POST',
    }).then((response) => {
      return response.json()
    })
  }

  const KeyboardCommand =  async (event) => {
    if (event.key !== "Enter") {
      return 
    }

    event.preventDefault()

    if (isServerRunning) {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({response:event.target.value}),
      };
      fetch(`minecraft/${serverName}/command/${secret}`, options)
      setServerLogs(await updateServerLogs("logs"))
      console.log('test3')
    } else {
      setError("Server Not Up")
    }
    
    event.target.value = ""
  }

  return (
    <>
      <Head>
        <title>{capitalizeFirstLetter(serverName)}</title>
        <meta name="description" content="Game Servers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/minecraftLogo.jpg" />
      </Head>
      <Navbar />
      <Box sx={{
        padding:"7vh",
        display:"flex",
        justifyContent:"center",
        background:"linear-gradient(rgb(30, 200, 150), #756049)",
      }}>
        <ButtonGroup variant='contained'>
          <Button onClick={startServer}>Start Server</Button>
          <Button>Sdas</Button>
        </ButtonGroup>
      </Box>
      <Box sx={{
        textAlign:"center",
        color:"red"
      }}>
        <h1>{error}</h1>
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
          <Input onKeyDown={KeyboardCommand} placeholder="Type a Command..." fullWidth disableUnderline={true} sx={{
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