import mongoose, { model, Schema, models } from "mongoose";

/**Tạo cấu trúc Json để lưu vào Database thông qua mongoose */
const ProductSchema = new Schema({
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

export const Product = models.Product || model("Product", ProductSchema);
