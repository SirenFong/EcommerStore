import { mongooseConnect } from "@component/lib/mongoose";
import { Service } from "@component/models/Service";




export default async function handle(req, res) {
    await mongooseConnect();

    if (req.method === 'GET') {
        if (req.query?.name) {
            const { name } = req.query;
            res.json(await Service.findOne({ name }));
        } else {
            res.json(await Service.find());
        }

    }
}