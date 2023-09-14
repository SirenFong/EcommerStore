import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      res.json(await Product.find());
    }
  }

  if (method === "POST") {
    const { title, description, price, images } = req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      images
    });
    res.json(productDoc);
  }
  //Hàm nhập vào "PUT" của HTTP xác nhận giá trị thông qua _id của 1 sản phẩm
  //Product.updateOne để cập nhật 1 sản phẩm theo id và các biến giá trị title,des,price
  //res.json để xác định hàm update sản phẩm có thành công hay không
  if (method === "PUT") {
    const { title, description, price, images, _id } = req.body;
    await Product.updateOne({ _id }, { title, description, price, images });
    res.json(true);
  }
  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id })
      res.json(true)
    }
  }
}

