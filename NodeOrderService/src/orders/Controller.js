let Model = require("./Model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
module.exports = {
    newOrder: async (req, res) => {
        const { firstname, lastname, email, phoneNumber, address, zipcode, city } = req.body;
        if (!firstname && !lastname && !email && !phoneNumber && !address && !zipcode && !city) return res.sendStatus(400);
        let order = new Model({
            firstname,
            lastname,
            email,
            phoneNumber,
            address,
            zipcode,
            city,
        });
        order = await order.save();
        if (!order) return res.sendStatus(500);
        return res.status(201).send(order);
    },
    getOrders: async (req, res) => {
        let orders = await Model.find({});
        if (!orders) return res.sendStatus(500); 
        return res.send({});
    },
    getOrder: async (req, res) => {
        const { order_id } = req.params;
        let order = await Model.findOne({_id: order_id});
        if (!order) return res.sendStatus(404);
        return res.send(order);
    },
    getConfig: (req, res) => {
        return res.send({
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        });
    },
    createPayment: async (req, res) => {
        const { cart } = req.body;
        try {
            let amount = 0;
            if (cart && cart.length > 0) {
                amount = cart.map((v) => Math.round(v.price * 100) * Number(v.qt)).reduce((a, c) => a + c);
            }
            const paymentIntent = await stripe.paymentIntents.create({
                currency: "eur",
                amount,
                automatic_payment_methods: {
                    enabled: true,
                }

            }); 
            return res.send({ clientSecret: paymentIntent.client_secret, amount, cart });
        } catch (e) {
            return res.status(400).send({ 
                error: {
                    message: e.message,
                }
            });
        }
    }
}