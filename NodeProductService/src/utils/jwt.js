const jwt = require('jsonwebtoken');

module.exports = {
    jwtVerify: async (token) => {
        return await (await fetch("http://oauthserver:3000/ping", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Barear ${token}`,
            }
        })).json();
    },
    jwtPwdReset: (user) => {
        const payload = {
            r_sub: user._id,
            iat: Date.now()
        };
        return jwt.sign(payload, process.env.SECRET_KEY);
    },
    jwtEmailConfirm: (user) => {
        const payload = {
            e_sub: user._id,
            iat: Date.now()
        };
        return jwt.sign(payload, process.env.SECRET_KEY);
    }
};