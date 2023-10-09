import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { Order } from "@component/models/Order";
import { mongooseConnect } from "@component/lib/mongoose";

export default async function handle(req, res) {
  await mongooseConnect();
  const { user } = await getServerSession(req, res, authOptions);
  res.json(await Order.find({ userEmail: user.email }));
}
