import { mongooseConnect } from "@/lib/mongoose";

import { isAdminRequest } from "./auth/[...nextauth]";
import { PaymentType } from "@/models/PaymentType";

export default async function handle(req, res) {
    const { method } = req;
    await mongooseConnect();


    await isAdminRequest(req, res);


    if (method === "GET") {
        if (req.query?.id) {
            res.json(await PaymentType.findOne({ _id: req.query.id }));
        } else {
            res.json(await PaymentType.find());
        }
    }

    if (method === "POST") {
        const { paymentName, paymentKey, paymentDescription, isDeleted } =
            req.body;
        console.log(req.body)
        const paymentDoc = await PaymentType.create({
            paymentName,
            paymentKey,
            paymentDescription,
            isDeleted,

        });
        res.json(paymentDoc);
        console.log(paymentDoc)
    }

    if (method === "PUT") {
        const {
            paymentName, paymentKey, paymentDescription, isDeleted,
            _id,
        } = req.body;
        await PaymentType.updateOne(
            { _id },
            { paymentName, paymentKey, paymentDescription, isDeleted }
        );
        res.json(true);
    }
    if (method === "DELETE") {
        const { _id } = req.query;
        console.log({ _id })
        await PaymentType.updateOne({ _id },
            {
                isDeleted: true,
            });
    }

}
