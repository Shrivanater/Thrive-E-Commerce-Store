import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
const stripe = require("stripe")(process.env.STRIPE_SK);
import { buffer } from "micro";

const endpointSecret =
    "whsec_f013583539d6f36c0ceb0d4b56e816ebfc33363f1205a4b890f0759de7c0f0e9";

export default async function handle(req, res) {
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

//bonus-fair-wise-jovial
//acct_1ND9v7SIGegpsG0g
