import { mongooseConnect } from "@component/lib/mongoose";
import { Product } from "@component/models/Product";

export default async function handle(req, res) {
  await mongooseConnect();
  const category = req.body.category;
  const products = await Product.find({ category: category });

  res.json(products);
}
