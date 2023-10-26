import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Order } from "@component/models/Order";
import { mongooseConnect } from "@component/lib/mongoose";
import { PaymentType } from "@component/models/PaymentType";

export default async function handle(req, res) {
  await mongooseConnect();
  if (req.method === 'GET') {

    res.json(await PaymentType.find({ isDeleted: false }));
  }
}
