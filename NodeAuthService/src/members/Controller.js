const Model = require("./Model");
const { jwtVerify, jwtPwdReset, jwtEmailConfirm, jwtCustomTokenVerify } = require("../utils/jwt");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const sendEmail = async (data) => {
	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PWD,
		},
	});
	let infos = await transporter.sendMail(data);

	return infos;
};

module.exports = {
	getUser: async (req, res) => {
		try {
			let user = await Model.findOne({_id: req.user_id});
			if (!user) return res.sendStatus(404);
			return res.send(user);
		} catch(e) {
			console.error(e);
			return res.sendStatus(500);
		}
	},
	updateProfil: async (req, res) => {
		try {
			let r_email = /^([a-zA-Z0-9]+)\.{0,1}[a-zA-Z0-9_-]+@{1}([a-zA-Z0-9_-]{3,})(\.[a-zA-Z]{2,5})$/;
			let r_phone = /^0([0-9]{9})$/
			if (req.body.email && !r_email.test(req.body.email)) return res.status(400).send({msg: "Invalid email !"});
			if (req.body.phoneNumber && !r_phone.test(req.body.phoneNumber)) return res.status(400).send({msg: "Invalid Phone Number !"});
			let user = await Model.findOneAndUpdate({_id: req.user_id}, req.body, {new: true});
			if (!user) return res.sendStatus(404);
			return res.send({...user._doc, success: true});
		} catch(e) {
			console.error(e);
			return res.sendStatus(500);
		}
	},
	deleteProfil: async (req, res) => {
		try {
			let user = await Model.findOneAndDelete({_id: req.user_id});
			if (!user) return res.status(404).send({success: false});
			return res.send({success: true});
		} catch(e) {
			console.error(e);
			return res.sendStatus(500);
		}
	},
	forgotPwd: async (req, res) => {
		try {
			const { email } = req.body;
			if (!email) return res.sendStatus(400);
			let user = await Model.findOne({email}, {_id: 1, email: 1});
			if (!user || !user._id) return res.sendStatus(404);
			const url_token = jwtPwdReset(user);
			let msg = await sendEmail({
				from: process.env.SMTP_USER,
				to: user.email,
				subject: "Reset Your Password",
				text: `Copy this link : https://${process.env.DOMAIN_NAME}/reset-password?url_token=${url_token}`,
				html: `<a href=\"https://${process.env.DOMAIN_NAME}/reset-password?url_token=${url_token}\">
							Click Here to reset password
						</a>
						<p>Or copy this link : https://${process.env.DOMAIN_NAME}/reset-password?url_token=${url_token}</p>`,
			});
			return res.send({msg});
		} catch(e) {
			console.error(e);
			return res.sendStatus(404);
		}
	},
	resetPwd: async (req, res) => {
		const { password, url_token } = req.body;
		try {
			let decoded = jwtCustomTokenVerify(url_token);
			const limit = decoded.iat+((60*1000) * 15);
			if (!password || password.length < 8) return res.sendStatus(400);
			else if (limit < Date.now()) return res.status(403).send({msg: "Token expired !"});
			let user = await Model.findOneAndUpdate({ _id: decoded.r_sub }, {password: bcrypt.hashSync(password, 12)});
			if (!user) return res.sendStatus(404);
			return res.send(user);
		} catch (e) {
			console.error(e);
			return res.sendStatus(500);
		}
	},
	getConfirmation: async (req, res) => {
		try {
			let user = await Model.findOne({ _id: req.user_id }, {_id: 1, email: 1, confirmed: 1});
			if (!user || !user._id) res.sendStatus(404);
			else if (user.confirmed) return res.status(400).send({message: "Email already confirmed", success: false });
			let url_token = jwtEmailConfirm(user);
			await sendEmail({
				from: process.env.SMTP_USER,
				to: user.email,
				subject: "Email Confirmation",
				text: `Copy this link : https://${process.env.DOMAIN_NAME}/verify-email?url_token=${url_token}`,
				html: `<a href=\"https://${process.env.DOMAIN_NAME}/verify-email?url_token=${url_token}\">
							Click Here to confirm
						</a>
						<p>Or copy this link : https://${process.env.DOMAIN_NAME}/verify-email?url_token=${url_token}</p>`,
			});
			return res.send({message: "Confirmation email sended, don't forget to check your spam !", success: true});
		} catch(e) {
			console.error(e);
			return res.sendStatus(500);
		}
	},
	verifyEmail: async (req, res) => {
		try {
			const { url_token } = req.query;
			if (!url_token) return res.status(400).send({message: "Url token is missing."});
			const decoded = jwtCustomTokenVerify(url_token);
			if (!decoded) return res.status(401).send({message: "Invalid token."});
			else if (decoded.exp < Date.now()) return res.status(403).send({message: "Token expired."});
			const user = await Model.findByIdAndUpdate({_id: decoded.e_sub}, { confirmed: true }, {new: true});
			if (!user) return res.status(404).send({message: "User not found."});
			return res.send({confirmed: user.confirmed, message: "Email confirmation succeeded."});
		} catch(e) {
			console.error(e);
			return res.status(500).send({message: "Unexcepted error."});
		}
	},
	ping: (req, res) => {
		return res.send({ success: true });
	}
};
