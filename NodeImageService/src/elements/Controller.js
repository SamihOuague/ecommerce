const { writeFile, writeFileSync } = require("fs");
const uniqueStr = require("unique-slug");

module.exports = {
    upload: async (req, res) => {
        if (req.body.img.match(/^data:image\/[a-z]+;base64,/)) {
            const ext = req.body.img.split(",")[0].split("/")[1].split(";")[0];
            const randFileName = uniqueStr() + uniqueStr() + "." + ext;
            const { b64, path } = {
                b64: req.body.img.split(",")[1],
                path: "./public/images/" + randFileName,
            };
            await writeFileSync(path, b64, "base64");    
            return res.send({ message: randFileName });
        } else {
            return res.status(400).send({ err: "invalid file !" });
        }
    }
}