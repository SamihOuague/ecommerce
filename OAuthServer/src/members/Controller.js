const jwt = require("./middleware/jwt");

module.exports = {
    ping: async (req, res) => {
        try {
            const authorization = req.headers.authorization;
            const token = jwt.verifyToken(authorization.split(" ")[1], process.env.SECRET_KEY);
            if (!token) return res.status(401).send({success: false, message: "Invalid token."});
            else if (token.exp < Date.now()) return res.status(401).send({success: false, message: "Expired token."});
            return res.send({...token, success: true});
        } catch {
            return res.status(401).send({ success: false, message: "Invalid barear."});
        }
    },
    getAccessToken: async (req, res) => {
        try {
            const { user_id, role } = req.query;
            if (!user_id) return res.status(400).send({success: false, message: "User Id is required."});
            return res.send({ success: true, token: jwt.signToken({ sub: user_id, role: role || 0 }, process.env.SECRET_KEY, (1000 * 60 * 60))});
        } catch {
            return res.status(500).send({success: false});
        }
    },
}