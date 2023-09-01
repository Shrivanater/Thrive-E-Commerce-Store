import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
const stripe = require("stripe")(process.env.STRIPE_SK);

export default async function handle(req, res) {
    if (req.method !== "POST") {
        res.json("should be a POST request");
        return;
    }

    const { name, email, city, postalCode, address, country, cartProducts } =
        req.body;

    await mongooseConnect;

    const productsIds = cartProducts;
    const uniqueIds = [...new Set(productsIds)];
    const productInfos = await Product.find({ _id: uniqueIds });

    let line_items = [];
    for (const productId of uniqueIds) {
        const productInfo = productInfos.find(
            (p) => p._id.toString() === productId
        );
        const quantity =
            productsIds.filter((id) => id === productId)?.length || 0;
        if (quantity > 0 && productInfo) {
            line_items.push({
                quantity,
                price_data: {
                    currency: "inr",
                    product_data: { name: productInfo.title },
                    unit_amount: productInfo.price * 100,
                },
            });
        }
    }

    const orderDoc = await Order.create({
        line_items,
        name,
        email,
        city,
        postalCode,
        address,
        country,
        paid: false,
    });

    const session = await stripe.checkout.sessions.create({
        line_items,
        mode: "payment",
        customer_email: email,
        success_url: process.env.PUBLIC_URL + "/cart?success=true",
        cancel_url: process.env.PUBLIC_URL + "/cart?cancelled=true",
        metadata: { orderId: orderDoc._id.toString(), test: "ok" },
    });

    res.json({
        url: session.url,
    });
}