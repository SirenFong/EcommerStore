import { Schema } from "mongoose";

/**Tạo cấu trúc Json để lưu vào Database thông qua mongoose */
export const ProductSchema = new Schema({
    title: { type: String, require: true },
    description: String,
    qty: { type: Number, require: true },
    price: { type: Number, require: true },
    images: [{ type: String }],
    category: {
        type: mongoose.Types.ObjectId,
        ref: "Category"
    },
});