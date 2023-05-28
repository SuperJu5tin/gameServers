export default function handler(req, res) {
  const { query } = req
  const secret = process.env.REACT_PUBLIC_SECRET

  const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({response:req.body.response}),
    };
  fetch(`localhost:3000/minecraft/${query.id}/command/${secret}`, options)

  res.status(200)
}

export const config = {
  api: {
    responseLimit: false,
  },
};