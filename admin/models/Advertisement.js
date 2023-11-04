import { Schema, model, models } from "mongoose";

const advertisementSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    value: { type: Object },
  },
  { timestamps: true }
);

export const Advertisement = models?.Advertisement || model("Advertisement", advertisementSchema);
