import { mongooseConnect } from "@component/lib/mongoose";
import { Product } from "@component/models/Product";

export default async function handle(req, res) {
    await mongooseConnect();
    const category = req.body.category;
    console.log(category)
    const ObjectId = require('mongodb').ObjectId;
    res.json(await Product.find());
    // console.log(res);
}