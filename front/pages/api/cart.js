import { mongooseConnect } from "@component/lib/mongoose";
import { Product } from "@component/models/Product";

export default async function handle(req, res) {
  await mongooseConnect();
  const ids = req.body.ids;
  res.json(await Product.find({ _id: ids }));
}
