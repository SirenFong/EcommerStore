import mongoose, { model, Schema, models } from "mongoose";

/**Tạo cấu trúc Json để lưu vào Database thông qua mongoose */
const ProductSchema = new Schema(
  {
    title: { type: String, require: true },
    description: String,
    qty: { type: Number, require: true },
    price: { type: Number, require: true },
    images: [{ type: String }],
    discount: { type: Number, require: true },
    finalPrice: { type: Number },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    properties: [{ type: Object }],
  },
  {
    //Thuộc tính mới thêm vào ở V9
    timestamps: true,
  }
);

export const Product = models?.Product || model("Product", ProductSchema);
