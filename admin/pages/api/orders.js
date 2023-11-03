import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);
  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Order.findOne({ _id: req.query.id }));
    } else {
      res.json(await Order.find().sort({ createdAt: -1 }));
    }
  }

  if (method === "PUT") {
    const { status, _id } = req.body;
    await Order.updateOne(
      { _id },
      {
        status,
      }
    );
    res.json(true);
  }
}
