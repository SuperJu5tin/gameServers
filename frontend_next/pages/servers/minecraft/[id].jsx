import Navbar from '@/pages/Navbar';
import { Button, ButtonGroup, Container, Input, Typography } from '@mui/material';
import { Box } from '@mui/system';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client';

const MinecraftServer = ( props ) => {

  const router = useRouter()
  const { id } = router.query
  const serverName = id
  // const secret = process.env.REACT_PUBLIC_SECRET
  const [error, setError] = useState("")
  const [serverLogs, setServerLogs] = useState(props.logs)
  const [isServerRunning, setIsServerRunning] = useState(props.isRunning)

  let placeholder = ""

  const socket = io("http://localhost:5000")  

  // background

  useEffect(() => {
    console.log(props)
    document.body.style.margin = 0
    document.body.style.background = "#756049"
    document.body.style.color = "white"
  }, []);

  // Server Logs through socket

  // useEffect(() => {
  //   socket.on(`minecraft-${serverName}-logs`, data => {
  //     console.log(data.currentLog)
  //     console.log(serverLogs[serverLogs.length -1])
  //     if (data.currentLog !== placeholder ) {
  //       setServerLogs(oldArray => [...oldArray, data.currentLog])
  //       placeholder = data.currentLog
  //     }
  //   })
  //   socket.on(`minecraft-${serverName}-status`, data => {
  //     setIsServerRunning(data)
  //   })
  // }, [])

  // useEffect(() => {
  //   setServerLogs(oldArray => [...oldArray, placeholder])
  // }, [placeholder])

  const capitalizeFirstLetter = (string) => {
    if (string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }

  const startServer = () => {
    fetch(`/api/servers/minecraft/${serverName}/start`, {
      method:'POST',
    })
  }

  const getServerLogs = async () => {
    const response = await fetch(`/api/servers/minecraft/${serverName}/logs`, {
      method:'POST',
    })

    const resJson = await response.json()

    return await resJson
  }

  const updateServerLogs = async () => {
    const newLogs = await getServerLogs("logs")
    setServerLogs(newLogs)
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
      fetch(`/api/servers/minecraft/${serverName}/command`, options)
      updateServerLogs()
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
          <Button onClick={updateServerLogs}>Sdas</Button>
        </ButtonGroup>
      </Box>
      <Box sx={{
        borderRadius:"30px",
        alightItems:"center",
        margin:"auto",
        marginTop:"30px",
        background:"#7a6a51",
        height:"10vh",
        width:"80vw",
      }}>
        <Typography sx={{
          display:"flex",
          justifyContent: "center",
          alignItems: 'center',
          flexWrap: 'wrap',
        }}> Sever Running: {isServerRunning ? <CheckBoxOutlinedIcon /> : <CheckBoxOutlineBlankOutlinedIcon />} </Typography>
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
        marginTop:"30px",
        marginBottom:"5vh"
      }}>
        <Box sx={{
          display:"grid",
          justifyItems:"left",
          borderRadius:"30px 30px 0 0",
          background:"#7a6a51",
          marginBottom:".5vh",
          paddingTop:"1vh",
          paddingBottom:".5vh",
          paddingLeft:"1vw",
          paddingRight:"1vw",
          height:"40vh",
          overflowY:"auto",
        }}>
          {(typeof serverLogs === []) ? (""): (serverLogs ? (
            serverLogs.map((serverLog, i) => (
              <p key={i}>{serverLog}</p>
            ))
          ): (""))}
        </Box>
        <Box sx={{
          display:"grid"
        }}>
          <Input onKeyDown={KeyboardCommand} placeholder="Type a Command..." disableUnderline={true} sx={{
            height:"40px",
            width:"97%",
            marginLeft:"10px",
          }} />
        </Box>
        {/* scheduled command */}
      </Box>
    </>
    
  )
}

export const getStaticProps = async (id) => {
  // Fetch data from external API
  const serverName = "minecraft_hub"

  const secret = process.env.REACT_PUBLIC_SECRET
  
  const response1 = await fetch(`http://localhost:5000/minecraft/${serverName}/check/${secret}`, {
    method:'POST',
  })

  const isRunning = await response1.json()
  let logs = [""]
  
  if (isRunning) {
    const response2 = await fetch(`http://localhost:5000/minecraft/${serverName}/logs/${secret}`, {
      method:'POST',
    })

    logs = await response2.json()
  }

  // Pass data to the page via props
  return { props: {
    isRunning,
    logs,
  }}
}

export const getStaticPaths = async () => {

  const secret = process.env.REACT_PUBLIC_SECRET
  
  const response1 = await fetch(`http://localhost:5000/server_list/${secret}`, {
    method:'POST',
  })

  const server_list = await response1.json()

  const paths = server_list.map(post => {
    return {
      params: {
        id: `${post.serverName}`
      }
    }
  })

  return {
    paths,
    fallback: false, // false or "blocking"
  };
};

export default MinecraftServer