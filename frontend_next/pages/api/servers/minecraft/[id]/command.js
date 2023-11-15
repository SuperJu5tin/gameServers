export default function handler(req, res) {
  const { query } = req
  const secret = process.env.REACT_PUBLIC_SECRET

  // console.log(req.body.response)

  const options = {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({response:req.body.response}),
  };
  // console.log(`localhost:5000/minecraft/${query.id}/command/${secret}`, options)
  fetch(`http://localhost:5000/minecraft/${query.id}/command/${secret}`, options)

  res.status(200).json(true)
}

export const config = {
  api: {
    responseLimit: false,
  },
};