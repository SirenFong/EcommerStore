import mongoose, { model, Schema, models } from "mongoose";

const AddressSchema = new Schema({
  userEmail: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  phone: String,
  email: String,
  postalcode: String,
  address: String,
});

export const Address = models?.Address || model("Address", AddressSchema);
