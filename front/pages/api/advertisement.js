import { mongooseConnect } from "@component/lib/mongoose";
import { Advertisement } from "@component/models/Advertisement";



export default async function handle(req, res) {
  await mongooseConnect();

  if (req.method === 'GET') {
    const { name } = req.query;
    res.json(await Advertisement.findOne({ name }));
  }
}