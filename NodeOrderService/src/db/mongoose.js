const mongoose = require("mongoose");

(async () => {
    await mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGODB_URL);
})();