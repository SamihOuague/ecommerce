let Model = require("./Model");

module.exports = {
    getMessages: async (req, res) => {
        let messages = await Model.find({});
        if (!messages) return res.sendStatus(404);
        return res.send(messages);
    },
    getMessage: async (req, res) => {
        let { id } = req.params;
        try {
            let message = await Model.findOne({_id: id});
            if (!message) return res.sendStatus(404);
            return res.send(message);
        } catch(err) {
            return res.sendStatus(404);
        }
        
    },
    sendMessage: async (req, res) => {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !message) return res.sendStatus(400);
        let model = new Model({
            name,
            email,
            subject,
            message,
        });
        model = await model.save();
        if (!model) return res.sendStatus(400);
        return res.status(201).send(model);
    }
}