import { mongooseConnect } from "@component/lib/mongoose";
import { PaymentMethod } from "@component/models/PaymentMethod";

export default async function handle(req, res) {
  await mongooseConnect();
  if (req.method === "GET") {
    res.json(await PaymentMethod.find({ isDeleted: false }));
  }
}
