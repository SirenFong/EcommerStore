
import { mongooseConnect } from "@component/lib/mongoose";
import { PaymentType } from "@component/models/PaymentType";
export default async function handle(req, res) {
    await mongooseConnect();
    const ids = req.body.ids;
    res.json(await PaymentType.find({ _id: ids }));
}