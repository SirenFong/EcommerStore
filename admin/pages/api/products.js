import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";


export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  //Hàm lấy giá trị "Get" của HTTP xác nhận giá trị của tất cả  sản phẩm
  //Product.findone để tìm 1  sản phẩm thông qua id
  //Product.find tìm tất cả sản phẩm có trong cửa hàng
  //res.json để xác định hàm update  sản phẩm có thành công hay không
  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {

      res.json(await Product.aggregate([
        {
          $lookup:
          {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category'
          }
        }
      ]));



    }
  }
  //Hàm nhập vào "POST" của HTTP dùng để tạo 1  sản phẩm mới với
  //Product.create để tạo  sản phẩm mới
  //res.json để xác định hàm POST  sản phẩm có thành công hay không
  if (method === "POST") {
    const { title, description, price, qty, images, category, properties } =
      req.body;

    const productDoc = await Product.create({
      title,
      description,
      price,
      qty,
      images,
      category,
      properties,
    });
    res.json(productDoc);
  }
  //Hàm nhập vào "PUT" của HTTP xác nhận giá trị thông qua _id của 1 sản phẩm
  //Product.updateOne để cập nhật 1 sản phẩm theo id và các biến giá trị title,des,price
  //res.json để xác định hàm update sản phẩm có thành công hay không
  if (method === "PUT") {
    const {
      title,
      description,
      price,
      qty,
      images,
      category,
      properties,
      _id,
    } = req.body;

    // Update the properties along with other fields
    await Product.updateOne(
      { _id },
      { title, description, price, qty, images, category, properties }
    );
    res.json(true);
  }
  //Hàm nhập vào "DELETE" của HTTP xác nhận giá trị thông qua _id của 1 sản phẩm
  //Product.deleteOne để xóa 1 sản phẩm theo id
  //res.json để xác định hàm delete  sản phẩm có thành công hay không
  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
