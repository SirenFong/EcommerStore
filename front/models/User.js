import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = models?.User || model("User", userSchema);