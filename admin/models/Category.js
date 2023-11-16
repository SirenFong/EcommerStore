import { model, Schema, models } from "mongoose";

/**Tạo cấu trúc Json để lưu vào Database thông qua mongoose */
const CategorySchema = new Schema({
  name: { type: String, require: true },
  parent: { type: String, require: true },

}, {
  //Thuộc tính mới thêm vào ở V9
  timestamps: true,
});

export const Category = models?.Category || model("Category", CategorySchema);
