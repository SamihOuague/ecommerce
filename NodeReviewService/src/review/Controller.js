const { Model, UserModel } = require("./Model");

module.exports = {
    getComments: async (req, res) => {
        try {
            let { id } = req.params;
            let comments = await Model.find({ product_id: id });
            if (!comments) return res.sendStatus(404);
            return res.send(comments);
        } catch (e) {
            return res.sendStatus(500);
        }
    },
    postComment: async (req, res) => {
        try {
            let { comment, rate, product_id } = req.body;
            if (!comment || !rate || !product_id) return res.sendStatus(400);
            let user = await UserModel.findOne({ _id: req.user_id });
            if (!user) return res.sendStatus(404);
            let review = new Model({
                comment,
                rate,
                product_id,
                username: `${user.firstname} ${user.lastname.toUpperCase()[0]}`
            });
            review = await review.save();
            return res.status(201).send(review);
        } catch (e) {
            return res.sendStatus(500);
        }
    },
    deleteComment: async (req, res) => {
        try {
            let { id } = req.params;
            let comment = await Model.findOneAndDelete({ _id: id });
            return res.send(comment);
        } catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }
    }
}