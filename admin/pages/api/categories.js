import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";


export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();
    //Hàm lấy giá trị "Get" của HTTP xác nhận giá trị của tất cả loại sản phẩm
    //Category.findone để tìm 1 loại sản phẩm thông qua id
    //Category.find tìm tất cả sản phẩm có trong cửa hàng
    //res.json để xác định hàm update loại sản phẩm có thành công hay không
    if (method === "GET") {
        if (req.query?.id) {
            res.json(await Category.findOne({ _id: req.query.id }));
        } else {
            res.json(await Category.find());
        }
    }
    //Hàm nhập vào "POST" của HTTP dùng để tạo 1 loại sản phẩm mới với 
    //Category.create để tạo loại sản phẩm mới
    //res.json để xác định hàm POST loại sản phẩm có thành công hay không
    if (method === "POST") {
        const { name } = req.body;
        const categoryDoc = await Category.create({
            name
        });
        res.json(categoryDoc);
    }


}

