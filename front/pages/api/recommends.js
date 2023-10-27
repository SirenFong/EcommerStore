
import { mongooseConnect } from "@component/lib/mongoose";

export default async function handle(req, res) {
    await mongooseConnect();
    const ids = req.body.ids;

}