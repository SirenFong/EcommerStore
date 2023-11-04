import { mongooseConnect } from "@/lib/mongoose";

import { isAdminRequest } from "./auth/[...nextauth]";
import { User } from "@/models/User";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    ////Câu lệnh thêm vô ở admin security

    await isAdminRequest(req, res);

    //Hàm lấy giá trị "Get" của HTTP xác nhận giá trị của tất cả  sản phẩm
    //Product.findone để tìm 1  sản phẩm thông qua id
    //Product.find tìm tất cả sản phẩm có trong cửa hàng
    //res.json để xác định hàm update  sản phẩm có thành công hay không
    if (method === "GET") {
        if (req.query?.id) {
            res.json(await User.findOne({ _id: req.query.id }));
        } else {
            res.json(await User.find());
        }
    }

}