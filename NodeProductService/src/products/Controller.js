const { CategoriesModel, ProductModel, ReviewsModel } = require("./Model");

const sortBySwitch = (sortby) => {
    switch (sortby) {
        case "pricelow":
            return { price: 1 };
        case "pricehigh":
            return { price: -1 };
        case "alphaz":
            return { title: 1 };
        case "zalpha":
            return { title: -1 };
        default:
            return false;
    }
}

module.exports = {
    getProducts: async (req, res) => {
        try {
            const { categoryTag } = req.params;
            const { available, pricemin, pricemax, sortby } = req.query;
            let page = 0;
            let filter = {};
            if (categoryTag) filter.categoryTag = { $regex: new RegExp(`^${categoryTag}$`, "i") };
            const nb_prod = {
                in: await ProductModel.find({ ...filter, available: true }).countDocuments(),
                out: await ProductModel.find({ ...filter, available: false }).countDocuments(),
            };
            if (available == "out") filter.available = false;
            else if (available == "in") filter.available = true;
            if (pricemin && Number(pricemin)) filter.price = { "$gte": Number(pricemin) };
            if (pricemax && Number(pricemax)) {
                if (filter.price) filter.price = { ...filter.price, "$lte": Number(pricemax) };
                else filter.price = { "$lte": Number(f.pricemax) };
            }
            let prods = sortBySwitch(filter.sortby);
            if (prods) prods = await ProductModel.find(filter).sort(sortBySwitch(sortby)).skip(page).limit(6);
            else prods = await ProductModel.find(filter).skip(page).limit(6);
            console.log(prods, filter);
            let reviews = await ReviewsModel.find({ product_id: { "$in": prods.map((v) => v._id) } });
            let highestPrice = await ProductModel.find(filter, { price: 1 }).sort({ price: -1 }).limit(1);
            let cat = await CategoriesModel.find({});
            let rates = {};
            for (let i = 0; i < prods.length; i++) {
                let f = reviews.filter((v) => v.product_id == prods[i]._id).map((v) => v.rate);
                if (f.length) rates[prods[i]._id] = (f.reduce((a, c) => a + c, 0) / f.length);
                else rates[prods[i]._id] = 0;
            }
            return res.send({ prods, cat, rates, nb_prod, highestPrice: (highestPrice.length > 0) ? highestPrice[0] : { price: 0 } });
        } catch(e) {
            console.log(e);
            return res.status(500).send({message: "Server Error."})
        }
    },
    getProduct: async (req, res) => {
        try {
            let { category, product } = req.params;
            category = req.params.category.replaceAll("-", " ").toLowerCase();
            product = req.params.product.replaceAll("-", " ").toLowerCase()
            let prod = await ProductModel.findOne({
                title: {
                    $regex: new RegExp("^" + product, "i")
                },
                categoryTag: {
                    $regex: new RegExp("^" + category, "i")
                }
            });
            let prods = await ProductModel.find({}).limit(4);
            let reviews = await ReviewsModel.find({ product_id: { "$in": prods.map((v) => v._id) } });
            let rates = {};
            for (let i = 0; i < prods.length; i++) {
                let f = reviews.filter((v) => v.product_id == prods[i]._id).map((v) => v.rate);
                if (f.length) rates[prods[i]._id] = (f.reduce((a, c) => a + c, 0) / f.length);
                else rates[prods[i]._id] = 0;
            }
            if (!prod) return res.sendStatus(400);
            return res.send({ prod, recommended: prods, rates });
        } catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }
    },
    addProduct: async (req, res) => {
        const { title, weight, categoryTag, price, img, description, aroma } = req.body;
        if (!(title && weight && categoryTag && price && description)) return res.status(400).send({success: false, message: "Bad request"});
        try {
            let prod = new ProductModel({
                title,
                weight,
                categoryTag,
                price: Number(price),
                img,
                describ: description,
                aroma,
            });
            prod = await prod.save();
            return res.status(201).send({success: true, message: "Product created."});
        } catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const { name } = req.body;
            if (!name) return res.status(400).send({success: false});
            let prod = await ProductModel.findOneAndDelete({ title: name });
            if (!prod) return res.status(404).send({success: false});
            return res.status(200).send({success: true});
        } catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }
    },
    deleteSubCat: async (req, res) => {
        try {
            if (!req.body.name || !req.params.name) return res.status(400).send({success: false, message: "Category or Sub Category Name is missing"});
            let cat = await CategoriesModel.findOne({
                category: {
                    $regex: new RegExp("^" + req.params.name.replaceAll("-", " ").toLowerCase(), "i"),
                }
            });
            if (!cat) return res.status(404).send({success: false, message: "Sub Category not found."});
            cat.subcategory = cat.subcategory.filter((value) => {
                return value.name !== req.body.name;
            });
            await cat.save();
            return res.status(200).send({success: true, message: "Sub Category deleted."});
        } catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }
    },
    deleteCategory: async (req, res) => {
        try {
            if (!req.body.name) return res.sendStatus(400);
            let deletedCat = await CategoriesModel.findOneAndDelete({ category: req.body.name });
            if (!deletedCat) return res.status(404).send({success: false, message: "Category does not exists."});
            return res.send({success: true, message: "Category deleted."});
        } catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }
    },
    addCategory: async (req, res) => {
        try {
            if (!req.body.name) return res.status(400).send({ success: false, message: "Name is required." });
            let exist = await CategoriesModel.findOne({ category: req.body.name });
            if (exist) return res.status(400).send({ success: false, message: "Category already exists." });
            let cat = new CategoriesModel({
                category: req.body.name
            });
            cat = await cat.save();
            return res.status(201).send({...cat._doc, success: true});
        } catch (e) {
            return res.status(500).send({success: false, message: e.message});
        }
    },
    addSubCategory: async (req, res) => {
        try {
            if (!req.params.name || !req.body.name) return res.status(400).send({success: false, message: "Category or Sub Category name is missing."});
            let cat = await CategoriesModel.findOne({
                category: {
                    $regex: new RegExp("^" + req.params.name.replaceAll("-", " ").toLowerCase(), "i"),
                }
            });
            if (!cat) return res.status(404).send({success: false, message: "Category not found."});
            cat.subcategory.push({ name: req.body.name });
            await cat.save();
            return res.status(201).send({success: true, message: "Sub Category Created."});
        } catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }
    },
    listCategories: async (req, res) => {
        try {
            const cat = await CategoriesModel.find({});
            return res.send(cat);
        } catch(e) {
            console.error(e);
            return res.sendStatus(500);
        }
    }
};