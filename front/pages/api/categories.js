import { mongooseConnect } from "@component/lib/mongoose";
import { Category } from "@component/models/Category";
import { Product } from "@component/models/Product";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Category.findOne({ _id: req.query.id }));
    } else {
      res.json(await Category.find().populate("parent"));
    }
  }
}
