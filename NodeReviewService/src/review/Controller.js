const { Model, UserModel } = require("./Model");
const { jwtVerify } = require("../utils/jwt");

module.exports = {
    getComments: async (req, res) => {
        let { id } = req.params;
        let comments = await Model.find({product_id: id});
        if (!comments) return res.sendStatus(500);
        return res.send(comments);
    },
    postComment: async (req, res) => {
        try {
            let { comment, rate, product_id } = req.body;
            let decoded = jwtVerify(req.headers.authorization.split(" ")[1]);
            if (!comment || !rate || !product_id) return res.sendStatus(400);
            else if (!decoded) return res.sendStatus(401);
            let user = await UserModel.findOne({_id: decoded.sub});
            if (!user) return res.sendStatus(404);
            let review = new Model({
                comment,
                rate,
                product_id,
                username: `${user.firstname} ${user.lastname.toUpperCase()[0]}`
            });
            review = await review.save();
            return res.status(201).send(review);
        } catch(e) {
            return res.sendStatus(500);
        }
    },
    deleteComment: async (req, res) => {
        let { id } = req.params;
        let comment = await Model.findOneAndDelete({_id: id});
        return res.send(comment);
    }
}