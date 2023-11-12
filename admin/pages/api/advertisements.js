import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Advertisement } from "@/models/Advertisement";
export default async function handle(req, res) {
  await mongooseConnect();
  const { method } = req;
  await isAdminRequest(req, res);
  if (req.method === "GET") {
    const { name } = req.query;
    res.json(await Advertisement.findOne({ name }));
  }
  if (req.method === "PUT") {
    const { name, value } = req.body;
    const advertisementDoc = await Advertisement.findOne({ name });
    if (advertisementDoc) {
      advertisementDoc.value = value;
      await advertisementDoc.save();
      res.json(advertisementDoc);
    } else {
      res.json(await Advertisement.create({ name, value }));
    }
  }
}
