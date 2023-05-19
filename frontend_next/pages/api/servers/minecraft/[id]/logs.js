
const handler = async (req, res) => {
  const { query } = req
  const secret = process.env.REACT_PUBLIC_SECRET

  const response = await fetch(`http://localhost:5000/minecraft/${query.id}/logs/${secret}`, {
    method:'POST',
  }).then((response) => {
    return response.json()
  })

  res.status(200).json(response)
  console.log(response)
}
export default handler
  
export const config = {
  api: {
    responseLimit: false,
  },
};