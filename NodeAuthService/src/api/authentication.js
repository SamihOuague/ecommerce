const Model = require('../members/Model');

module.exports = {
	signIn: async (req, res, next) => {
		try {
			const { email, password } = req.body;
			let regex = /^([a-zA-Z0-9]+)\.{0,1}[a-zA-Z0-9_-]+@{1}([a-zA-Z0-9_-]{3,})(\.[a-zA-Z]{2,5})$/;
			if (!email || !password) { return res.status(400).send({ message: 'Credentials is required !' }); }
			else if (!regex.test(email)) return res.status(401).send({ message: "Invalid email !" });
			let user = await Model.findOne({ email });
			if (!user || !user._id) return res.status(404).send({ message: 'Username does not exist !' });
			else if (!user.comparePwd(password)) return res.status(401).send({ message: 'Invalid password !' });
			req.user_id = user._id;
			next();
		} catch (e) {
			return res.status(500).send({ success: false, message: e.code });
		}
	},
	signUp: async (req, res, next) => {
		try {
			const { password, email } = req.body;
			let regex = /^([a-zA-Z0-9]+)\.{0,1}[a-zA-Z0-9_-]+@{1}([a-zA-Z0-9_-]{3,})(\.[a-zA-Z]{2,5})$/;
			if (!password || !email) return res.status(401).send({ message: 'Something is wrong !' });
			else if (!regex.test(email)) return res.status(400).send({ message: "Invalid email !" });
			else if (password.length < 8) return res.status(400).send({ message: "Invalid password !" });
			let user = new Model({
				password: password,
				email: email,
				role: 0,
			});
			user = await user.save();
			if (!user || !user._id) return res.status(500).send(user);
			req.user_id = user._id;
			next();
		} catch (e) {
			if (e && e.code == 11000) return res.status(401).send({ success: false, message: "Email already used." });
			return res.status(500).send({ success: false, message: e.code });
		}
	}
};
