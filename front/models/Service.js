import { Schema, model, models } from "mongoose";

const serviceSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        value: { type: Object },
    },
    { timestamps: true }
);

export const Service = models?.Service || model("Service", serviceSchema);
