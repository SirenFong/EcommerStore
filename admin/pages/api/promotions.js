import { mongooseConnect } from "@/lib/mongoose";

import { isAdminRequest } from "./auth/[...nextauth]";
import { Promotion } from "@/models/Promotion";

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
      res.json(await Promotion.findOne({ _id: req.query.id }));
    } else {
      res.json(await Promotion.find({}));
    }
  }
  //Hàm nhập vào "POST" của HTTP dùng để tạo 1  sản phẩm mới với
  //Product.create để tạo  sản phẩm mới
  //res.json để xác định hàm POST  sản phẩm có thành công hay không
  if (method === "POST") {
    const { title, status, start, end, condition } = req.body;

    const productDoc = await Promotion.create({
      title,
      status,
      start,
      end,
      condition,
    });
    res.json(productDoc);
  }
  //Hàm nhập vào "PUT" của HTTP xác nhận giá trị thông qua _id của 1 sản phẩm
  //Product.updateOne để cập nhật 1 sản phẩm theo id và các biến giá trị title,des,price
  //res.json để xác định hàm update sản phẩm có thành công hay không

  if (method === "PUT") {
    const { title, status, start, end, condition, _id } = req.body;

    // Update the properties along with other fields
    await Promotion.updateOne(
      { _id },
      {
        title,
        status,
        start,
        end,
        condition,
      }
    );
    res.json(true);
  }
  //Hàm nhập vào "DELETE" của HTTP xác nhận giá trị thông qua _id của 1 sản phẩm
  //Product.deleteOne để xóa 1 sản phẩm theo id
  //res.json để xác định hàm delete  sản phẩm có thành công hay không
  if (method === "DELETE") {
    if (req.query?.id) {
      await Promotion.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
