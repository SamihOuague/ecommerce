const Model = require("./Model");

module.exports = {
    getComments: async (req, res) => {
        let { id } = req.params;
        let comments = await Model.find({product_id: id});
        if (!comments) return res.sendStatus(500);
        return res.send(comments);
    },
    postComment: async (req, res) => {
        let { comment, rate, product_id } = req.body;
        if (!comment || !rate || !product_id) return res.sendStatus(400);
        let review = new Model({
            comment,
            rate,
            product_id,
        });
        review = await review.save();
        return res.status(201).send(review);
    },
    deleteComment: async (req, res) => {
        let { id } = req.params;
        let comment = await Model.findOneAndDelete({_id: id});
        return res.send(comment);
    }
}