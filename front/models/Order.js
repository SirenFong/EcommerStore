import mongoose, { model, Schema, models } from "mongoose";

/**Tạo cấu trúc Json để lưu vào Database thông qua mongoose */
const OrderSchema = new Schema({
    _id: { type: String, unique: true },
    userEmail: String,
    line_items: Object,
    name: String,
    phone: String,
    email: String,
    postalcode: String,
    address: String,
    paid: Boolean,
    paymentmethods: { type: Object },
    status: Number,

}, {
    timestamps: true,
});

export const Order = models?.Order || model("Order", OrderSchema);
