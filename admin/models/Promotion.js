import mongoose, { model, Schema, models } from "mongoose";

/**Tạo cấu trúc Json để lưu vào Database thông qua mongoose */
const PromotionSchema = new Schema(
  {
    title: { type: String, require: true },
    status: { type: Boolean, require: true },
    start: { type: String, require: true },
    end: { type: String, require: true },
    condition: [{ type: Object }],
  },
  {
    //Thuộc tính mới thêm vào ở V9
    timestamps: true,
  }
);

export const Promotion =
  models?.Promotion || model("Promotion", PromotionSchema);
