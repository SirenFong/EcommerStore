import mongoose, { model, Schema, models } from "mongoose";

/**Tạo cấu trúc Json để lưu vào Database thông qua mongoose */
const PaymentTypeSchema = new Schema({
    paymentName: { type: String, require: true },
    paymentKey: { type: String, require: true },
    paymentDescription: String,
    isDeleted: { type: Boolean, require: true },
}
    , {
        //Thuộc tính mới thêm vào ở V9
        timestamps: true,
    });

export const PaymentType = models.PaymentType || model("PaymentType", PaymentTypeSchema);
