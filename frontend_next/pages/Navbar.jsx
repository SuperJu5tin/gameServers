import { Box, Button, ButtonGroup } from '@mui/material'
import React from 'react'

function Navbar() {
  return (
    <Box sx={{
        margin:"auto",
        textAlign:"center",
        padding:"5px",
        background:"black",
        color:"white"
    }}>
        <ButtonGroup variant='text'>
          <Button href='/'> Home </Button>
          <Button href='/servers/minecraft/stuff'> test </Button>
          <Button href='/servers/terraria/stuff'> terraria </Button>
        </ButtonGroup>
    </Box> 
  )
}

export default Navbar