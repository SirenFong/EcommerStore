import mongoose, { model, Schema, models } from "mongoose";

const CouponSchema = new Schema(
  {
    name: { type: String, required: true },
    percent_off: { type: Number },
    duration: { type: String },
  },
  {
    //Thuộc tính mới thêm vào ở V9
    timestamps: true,
  }
);

export const Coupon = models?.Coupon || model("Coupon", CouponSchema);
