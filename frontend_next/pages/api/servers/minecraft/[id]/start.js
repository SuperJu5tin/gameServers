export default function handler(req, res) {
  const { query } = req
  const secret = process.env.REACT_PUBLIC_SECRET

  fetch(`http://localhost:5000/minecraft/${query.id}/start/${secret}`, {
    method:'POST',
  })

  res.status(200).json({response:true})
  // console.log(query.id, secret, `http://localhost:5000/minecraft/${query.id}/start/${secret}`)
}

export const config = {
  api: {
    responseLimit: false,
  },
};