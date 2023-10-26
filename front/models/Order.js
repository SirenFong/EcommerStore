import mongoose, { model, Schema, models } from "mongoose";

/**Tạo cấu trúc Json để lưu vào Database thông qua mongoose */
const OrderSchema = new Schema({
    userEmail: String,
    line_items: Object,
    name: String,
    phone: String,
    email: String,
    postalcode: String,
    address: String,
    paid: Boolean,
    status: {
        type: Number,
        default: "1",
        enum: ["1", "2", "3", "4"]

    },

}, {
    timestamps: true,
});

export const Order = models?.Order || model("Order", OrderSchema);
