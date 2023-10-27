import mongoose, { model, Schema, models } from "mongoose";

/**Tạo cấu trúc Json để lưu vào Database thông qua mongoose */
const PaymentMethodSchema = new Schema({
    paymentName: { type: String, require: true },
    paymentKey: { type: String, require: true },
    paymentDescription: String,
    isDeleted: { type: Boolean, require: true },
}
    , {
        //Thuộc tính mới thêm vào ở V9
        timestamps: true,
    });

export const PaymentMethod = models.PaymentMethod || model("PaymentMethod", PaymentMethodSchema);
