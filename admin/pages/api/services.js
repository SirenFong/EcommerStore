import { mongooseConnect } from "@/lib/mongoose";

// import { getServerSession } from "next-auth";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Service } from "@/models/Service";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    ////Câu lệnh thêm vô ở admin security
    await isAdminRequest(req, res);

    //Hàm lấy giá trị "Get" của HTTP xác nhận giá trị của tất cả loại sản phẩm
    //Category.findone để tìm 1 loại sản phẩm thông qua id
    //Category.find tìm tất cả sản phẩm có trong cửa hàng
    if (method === "GET") {
        if (req.query?.id) {
            res.json(await Service.findOne({ _id: req.query.id }));
        } else {
            res.json(await Service.find());
        }
    }
    //Hàm nhập vào "POST" của HTTP dùng để tạo 1 loại sản phẩm mới với
    //Category.create để tạo loại sản phẩm mới
    if (method === "POST") {
        const { name, value } = req.body;
        const serviceDoc = await Service.create({
            name,
            value,
        });
        res.json(serviceDoc);
    }
    if (method === "PUT") {
        const { name, value, _id } = req.body;
        const serviceDoc = await Service.updateOne(
            { _id },
            {
                name,
                value,
            }
        );
        res.json(serviceDoc);
    }
    if (method === "DELETE") {
        const { _id } = req.query;
        await Service.deleteOne({ _id });
        res.json("ok");
    }
}
