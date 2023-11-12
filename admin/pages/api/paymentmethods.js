import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { PaymentMethod } from "@/models/PaymentMethod";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();

  await isAdminRequest(req, res);

  if (method === "GET") {
    if (req.query?.id) {
      res.json(await PaymentMethod.findOne({ _id: req.query.id }));
    } else {
      res.json(await PaymentMethod.find());
    }
  }

  if (method === "POST") {
    const { paymentName, paymentKey, paymentDescription, isDeleted } = req.body;
    console.log(req.body);
    const paymentDoc = await PaymentMethod.create({
      paymentName,
      paymentKey,
      paymentDescription,
      isDeleted,
    });
    res.json(paymentDoc);
    console.log(paymentDoc);
  }

  if (method === "PUT") {
    const { paymentName, paymentKey, paymentDescription, isDeleted, _id } =
      req.body;
    await PaymentMethod.updateOne(
      { _id },
      { paymentName, paymentKey, paymentDescription, isDeleted }
    );
    res.json(true);
  }
  if (method === "DELETE") {
    const { _id } = req.query;
    console.log({ _id });
    await PaymentMethod.updateOne(
      { _id },
      {
        isDeleted: true,
      }
    );
  }
}
