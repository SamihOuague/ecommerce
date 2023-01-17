const { jwtVerify } = require("../utils/jwt");
let Model = require("./Model");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
    newOrder: async (req, res) => {
        const { firstname, lastname, email, phoneNumber, address, zipcode, city, bill } = req.body;
        try {
            let token = req.headers.authorization.split(" ")[1];
            let decoded = jwtVerify(token);
            if (!firstname || !lastname || !email || !phoneNumber || !address || !zipcode || !city || !bill) return res.sendStatus(400);
            let order = new Model({
                firstname,
                lastname,
                email,
                phoneNumber,
                address,
                zipcode,
                city,
                bill,
                user_id: decoded.sub,
                created_at: Date.now(),
            });
            order = await order.save();
            if (!order) return res.sendStatus(400);
            return res.status(201).send(order);
        } catch(e) {
            return res.sendStatus(500);
        }
    },
    getOrders: async (req, res) => {
        let orders = await Model.find({});
        if (!orders) return res.sendStatus(500); 
        return res.send(orders);
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
    deleteOrder: async (req, res) => {
        const { order_id } = req.body;
        let order = await Model.findOneAndDelete({_id: order_id});
        if (!order) return res.sendStatus(404);
        return res.send(order);
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
    },
    getUserOrders: async (req, res) => {
        try {
            let token = req.headers.authorization.split(" ")[1];
            let decoded = jwtVerify(token);
            if (!decoded) return res.sendStatus(401);
            let orders = await Model.find({user_id: decoded.sub});
            if (!orders) return res.send(404);
            return res.send(orders);
        } catch(e) {
            console.log(e);
            return res.sendStatus(400);
        }
    }
}