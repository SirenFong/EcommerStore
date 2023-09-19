import { model, Schema, models } from "mongoose";

/**Tạo cấu trúc Json để lưu vào Database thông qua mongoose */
const CategorySchema = new Schema({
    name: { type: String, require: true },

});

export const Category = models.Category || model("Category", CategorySchema);