import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  //Hàm lấy giá trị "Get" của HTTP xác nhận giá trị của tất cả loại sản phẩm
  //Category.findone để tìm 1 loại sản phẩm thông qua id
  //Category.find tìm tất cả sản phẩm có trong cửa hàng
  if (method === "GET") {

    res.json(await Category.find().populate('parent'));

  }
  //Hàm nhập vào "POST" của HTTP dùng để tạo 1 loại sản phẩm mới với
  //Category.create để tạo loại sản phẩm mới
  if (method === "POST") {
    const { name, parentCategory } = req.body;
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory,
    });
    res.json(categoryDoc);
  }
  if (method === "PUT") {
    const { name, parentCategory, _id } = req.body;
    const categoryDoc = await Category.updateOne({ _id }, {
      name,
      parent: parentCategory,
    });
    res.json(categoryDoc);
  }
  if (method === "DELETE") {
    const { _id } = req.query
    await Category.deleteOne({ _id })

    res.json('ok');
  }
}

