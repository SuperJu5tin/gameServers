// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
  console.log("test worked")
}

export const config = {
  api: {
    responseLimit: false,
  },
};