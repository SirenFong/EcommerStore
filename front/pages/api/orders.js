import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Order } from "@component/models/Order";
import { mongooseConnect } from "@component/lib/mongoose";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  const { user } = await getServerSession(req, res, authOptions);
  res.json(await Order.find({ userEmail: user.email }));
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
