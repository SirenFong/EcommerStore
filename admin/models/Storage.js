import mongoose, { model, Schema, models } from "mongoose";

/**Tạo cấu trúc Json để lưu vào Database thông qua mongoose */
const StorageSchema = new Schema(
    {

        quantityentered: { type: Number, required: true },
        quantitysold: { type: Number, require: true },
        price: { type: Number, require: true },

        product: {
            type: mongoose.Types.ObjectId,
            ref: "Product",
        },

    },
    {
        //Thuộc tính mới thêm vào ở V9
        timestamps: true,
    }
);

export const Storage = models.Storage || model("Storage", StorageSchema);
