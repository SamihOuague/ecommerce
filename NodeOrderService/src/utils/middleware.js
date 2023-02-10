const { jwtVerify } = require('./jwt');

module.exports = {
	isAuth: async (req, res, next) => {
		try {
			const barear = req.headers.authorization;
			const token = barear.split(' ')[1];
			const verif = await jwtVerify(token);
			if (!verif || !verif.sub) { return res.status(401).send({ success: false, message: verif.message  }); }
			req.user_id = verif.sub;
			next();
		} catch (e) {
			console.error(e);
			return res.status(403).send({ success: false, message: "Access token is required" });
		}
	},
	isAdmin: async (req, res, next) => {
		try {
			const barear = req.headers.authorization;
			const token = barear.split(' ')[1];
			const verif = await jwtVerify(token);
			if (!verif || !verif.role || verif.role != 3) return res.status(401).send({ success: false, is_admin: false, message: verif.message });
			next();
		} catch (e) {
			console.error(e);
			return res.status(403).send({ success: false, is_admin: false, message: "Access token is required" });
		}
	},
	verifyPKCE: async (req, res, next) => {
		try {
			const { nonce, token } = req.body;
			if (!nonce || !token) return res.status(400).send({ success: false, message: "Nonce or Token is missing" });
			let r = await (await fetch("http://oauthserver:3000/verify-pkce", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": token,
				},
				body: JSON.stringify({ nonce }),
			})).json();
			if (!r || !r.success) return res.status(401).send(r);
			next();
		} catch (e) {
			console.error(e);
			return res.status(500).send({ success: false });
		}
	}
};