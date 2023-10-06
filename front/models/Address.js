import mongoose, { model, Schema, models } from "mongoose";

const AddressSchema = new Schema({
    userEmail: { type: String, unique: true, required: true },
    name: String,
    phone: String,
    email: String,
    postalcode: String,
    address: String,
});

export const Address = models?.Address || model('Address', AddressSchema);