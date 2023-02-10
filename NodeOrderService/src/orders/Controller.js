const Model = require("./Model");
const mongoose = require("mongoose")
const User = mongoose.model("member", (new mongoose.Schema({ email: { type: String, required: true } }, { collection: "members" })));
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodemailer = require("nodemailer");

const sendEmail = async (data) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "",
            pass: "",
        },
    });
    let infos = await transporter.sendMail(data);
    return infos;
};



module.exports = {
    newOrder: async (req, res) => {
        const { firstname, lastname, email, phoneNumber, address, zipcode, city, bill } = req.body;
        try {
            let r_email = /^([a-zA-Z0-9]+)\.{0,1}[a-zA-Z0-9_-]+@{1}([a-zA-Z0-9_-]{3,})(\.[a-zA-Z]{2,5})$/;
            let r_zipcode = /^([0-9]{5})$/;
            if (!firstname || !lastname || !email || !phoneNumber || !address || !zipcode || !city || !bill) return res.sendStatus(400);
            else if (!r_email.test(email) || !r_zipcode.test(zipcode)) return res.sendStatus(400);
            let order = new Model({
                firstname,
                lastname,
                email,
                phoneNumber,
                address,
                zipcode,
                city,
                bill,
                user_id: req.user_id,
                created_at: Date.now(),
            });
            order = await order.save();
            if (!order) return res.sendStatus(400);
            return res.status(201).send(order);
        } catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }
    },
    getOrders: async (req, res) => {
        try {
            let orders = await Model.find({});
            if (!orders) return res.sendStatus(404);
            return res.send(orders);
        } catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }
    },
    getOrder: async (req, res) => {
        try {
            const { order_id } = req.params;
            let order = await Model.findOne({ _id: order_id });
            if (!order) return res.sendStatus(404);
            return res.send(order);
        } catch(e) {
            console.error(e);
            return res.sendStatus(500);
        }
    },
    getConfig: (req, res) => {
        return res.send({
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        });
    },
    deleteOrder: async (req, res) => {
        try {
            const { order_id } = req.body;
            let order = await Model.findOneAndDelete({ _id: order_id });
            if (!order) return res.sendStatus(404);
            return res.send(order);
        } catch(e) {
            console.error(e);
            return res.sendStatus(500);
        }
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
            console.error(e);
            return res.status(500);
        }
    },
    getUserOrders: async (req, res) => {
        try {
            let orders = await Model.find({ user_id: req.user_id, confirmed: true });
            if (!orders) return res.send(404);
            return res.send(orders);
        } catch (e) {
            console.log(e);
            return res.sendStatus(500);
        }
    },
    confirmOrder: async (req, res) => {
        try {
            const { order_id } = req.params;
            const { paymentIntent, paymentClientSecret } = req.body;
            if (!paymentIntent || !paymentClientSecret) return res.sendStatus(400);
            let p = await stripe.paymentIntents.retrieve(paymentIntent);
            if (!p) return res.status(404).send({confirmed: "Failed", message: "Payment not found"});
            else if (p.status != "succeeded") return res.send({ confirmed: p.status });
            let order = await Model.findOneAndUpdate({ _id: order_id, user_id: req.user_id }, { confirmed: true }, { new: true });
            let user = await User.findOne({ _id: req.user_id });
            if (!order || !user) return res.status(404).send({confirmed: "Failed", message: "Order or User not found."});
            //await sendEmail({
            //    from: "souaguen96@gmail.com",
            //    to: user.email,
            //    subject: "Checkout confirmation",
            //    text: `Congratulation ! Your payment order is confirmed.`,
            //    html: `<p>Congratulation ! Your payment order is confirmed.</p>`,
            //});
            //await sendEmail({
            //    from: "souaguen96@gmail.com",
            //    to: "souaguen96@gmail.com",
            //    subject: "New Order",
            //    text: `email : ${order.email}.\n
            //            fullname : ${order.firstname} ${order.lastname}\n`,
            //    html: `<p>email : ${order.email}.</p>
            //            <p>fullname : ${order.firstname} ${order.lastname}</p>`,
            //});
            return res.send(order);
        } catch (e) {
            return res.sendStatus(500);
        }
    }
}