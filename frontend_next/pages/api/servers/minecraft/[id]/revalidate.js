export default async function handler(req, res) {
   
    const { query } = req

    await res.revalidate(`/severs/minecraft/${query.id}`)

    try {
      // this should be the actual path not a rewritten path
      // e.g. for "/blog/[slug]" this should be "/blog/post-1"
      await res.revalidate(`/severs/minecraft/${query.id}`);
      return res.json({ revalidated: true });
    } catch (err) {
      // If there was an error, Next.js will continue
      // to show the last successfully generated page
      return res.status(500).send('Error revalidating');
    }
  }