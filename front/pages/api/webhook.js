import { mongooseConnect } from "@component/lib/mongoose";
import { Order } from "@component/models/Order";
import { buffer } from "micro";
const stripe = require("stripe")(process.env.STRIPE_SK);

const endpointSecret =
  "whsec_0ea94497f6583d6fb22478a2b1ee2921efa7b72738ccff612767953fb30bdbdc";
// This is your Stripe CLI webhook secret for testing your endpoint locally.
export default async function handler(req, res) {
  await mongooseConnect();
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await buffer(req),
      sig,
      endpointSecret
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const data = event.data.object;
      const orderId = data.metadata.orderId;
      const paid = data.payment_status === "paid";
      if (orderId && paid) {
        await Order.findByIdAndUpdate(orderId, {
          paid: true,
        });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).send("ok");
}

export const config = {
  api: { bodyParser: false },
};
///virtue-like-winner-evenly
//acct_1Nw7HzDuZCOl5dk9
//gssu-kfxt-zjip-znsu-cqom
