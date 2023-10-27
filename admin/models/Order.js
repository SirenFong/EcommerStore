import mongoose, { model, Schema, models } from "mongoose";

/**Tạo cấu trúc Json để lưu vào Database thông qua mongoose */
const OrderSchema = new Schema({
    line_items: Object,
    name: String,
    phone: String,
    mail: String,
    postalcode: String,
    address: String,
    paid: Boolean,
    paymentmethods: { type: Object },
    status: {
        type: Number,
        default: "1",
        enum: ["0", "1", "2", "3", "4"]

    },
}, {
    timestamps: true,
});

export const Order = models?.Order || model("Order", OrderSchema);
