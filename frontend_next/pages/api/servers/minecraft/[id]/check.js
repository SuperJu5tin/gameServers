
const handler = async (req, res) => {
    const { query } = req
    const secret = process.env.REACT_PUBLIC_SECRET
  
    const response = await fetch(`http://localhost:5000/minecraft/${query.id}/check/${secret}`, {
      method:'POST',
    })
  
    const resJson =  await response.json()
  
    res.status(200).json(resJson)
    // console.log(resJson)
  }
  export default handler
    
  export const config = {
    api: {
      responseLimit: false,
    },
  };