import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "@/pages/api/auth/[...nextauth]";
import { Coupon } from "@/models/Coupon";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await Coupon.findOne({ _id: req.query.id }));
    } else {
      res.json(await Coupon.find());
    }
  }

  if (method === "POST") {
    const { name, percent_off, duration } = req.body;
    const couponDoc = await Coupon.create({
      name,
      percent_off,
      duration,
    });
    res.json(couponDoc);
  }

  if (method === "PUT") {
    const { name, percent_off, duration, _id } = req.body;
    await Coupon.updateOne({ _id }, { name, percent_off, duration });
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Coupon.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
