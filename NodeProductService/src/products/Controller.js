const { CategoriesModel, ProductModel, ReviewsModel } = require("./Model");

module.exports = {
    mainPage: async (req, res) => {
        let page = 0;
        let f = {
            available: req.query.available,
            priceMin: req.query.pricemin,
            priceMax: req.query.pricemax,
        };
        let filter = {};
        if (req.query.page && Number(req.query.page) && Number(req.query.page) > 0) page = (Number(req.query.page) - 1) * 6;
        const nb_prod = {
            in: await ProductModel.find({available: true}).countDocuments(),
            out: await ProductModel.find({available: false}).countDocuments(),
        }
        if (f.available == "out") filter.available = false;
        else if (f.available == "in") filter.available = true;
        if (f.priceMin && Number(f.priceMin)) filter.price = { "$gte": Number(f.priceMin) };
        if (f.priceMax && Number(f.priceMax)) {
            if (filter.price) filter.price = {...filter.price, "$lte": Number(f.priceMax) };
            else filter.price = { "$lte": Number(f.priceMax) };
        }
        const cat = await CategoriesModel.find({});
        let prods = await ProductModel.find(filter).skip(page).limit(6);
        let reviews = await ReviewsModel.find({product_id: {"$in": prods.map((v) => v._id)}});
        let rates = {};
        for (let i = 0; i < prods.length; i++) {
            let f = reviews.filter((v) => v.product_id == prods[i]._id).map((v) => v.rate);
            if (f.length) rates[prods[i]._id] = (f.reduce((a, c) => a + c, 0) / f.length);
            else rates[prods[i]._id] = 0;
        }
        return res.send({prods, cat, nb_prod, rates});
    },
    productsByCategory: async (req, res) => {
        let { categoryTag } = req.params;
        const cat = await CategoriesModel.find({});
        let page = 0;
        categoryTag = categoryTag.replaceAll("-", " ").toLowerCase();
        if (req.query.page && Number(req.query.page) && Number(req.query.page) > 0) page = (Number(req.query.page) - 1) * 6;
        const prods = await ProductModel.find({
            categoryTag: {
                $regex: new RegExp(`^${categoryTag}$`, "i")
            }
        }).skip(page).limit(6);
        let reviews = await ReviewsModel.find({product_id: {"$in": prods.map((v) => v._id)}});
        let rates = {};
        for (let i = 0; i < prods.length; i++) {
            let f = reviews.filter((v) => v.product_id == prods[i]._id).map((v) => v.rate);
            if (f.length) rates[prods[i]._id] = (f.reduce((a, c) => a + c, 0) / f.length);
            else rates[prods[i]._id] = 0;
        }
        return res.send({prods, cat, rates});
    },
    getProduct: async (req, res) => {
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
        let reviews = await ReviewsModel.find({product_id: {"$in": prods.map((v) => v._id)}});
        let rates = {};
        for (let i = 0; i < prods.length; i++) {
            let f = reviews.filter((v) => v.product_id == prods[i]._id).map((v) => v.rate);
            if (f.length) rates[prods[i]._id] = (f.reduce((a, c) => a + c, 0) / f.length);
            else rates[prods[i]._id] = 0;
        }
        if (!prod) return res.sendStatus(400);
        return res.send({prod, recommended: prods, rates});
    },
    addProduct: async (req, res) => {
        const { title, weight, categoryTag, price, img, description, aroma } = req.body;
        if (!(title && weight && categoryTag && price && description)) return res.sendStatus(400);
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
            return res.status(201).send(prod);
        } catch(e) {
            return res.sendStatus(400);
        }
    },
    deleteProduct: async (req, res) => {
        const { name } = req.body;
        if (!name) return res.sendStatus(400);
        let prod = await ProductModel.findOneAndDelete({title: name});
        return res.status(200).send(prod);
    },
    deleteSubCat: async (req, res) => {
        if (!req.body.name || !req.params.name) return res.sendStatus(400);
        let cat = await CategoriesModel.findOne({category: {
            $regex: new RegExp("^" + req.params.name.replaceAll("-", " ").toLowerCase(), "i"),
        }});
        if (!cat) return res.sendStatus(404);
        cat.subcategory = cat.subcategory.filter((value) => {
            return value.name !== req.body.name;
        });
        await cat.save();
        return res.status(200).send(cat);
    },
    deleteCategory: async (req, res) => {
        if (!req.body.name) return res.sendStatus(400);
        let deletedCat = await CategoriesModel.findOneAndDelete({category: req.body.name});
        if (!deletedCat) return res.sendStatus(404);
        return res.send(deletedCat);
    },
    addCategory: async (req, res) => {
        if (!req.body.name) return res.sendStatus(400);
        let exist = await CategoriesModel.findOne({category: req.body.name});
        if (exist) return res.sendStatus(400);
        let cat = new CategoriesModel({
            category: req.body.name
        });
        await cat.save();
        return res.status(201).send(cat);
    },
    addSubCategory: async (req, res) => {
        if (!req.params.name || !req.body.name) return res.sendStatus(400);
        let cat = await CategoriesModel.findOne({category: {
            $regex: new RegExp("^" + req.params.name.replaceAll("-", " ").toLowerCase(), "i"),
        }});
        if (!cat) return res.sendStatus(404);
        cat.subcategory.push({name: req.body.name});
        await cat.save();
        return res.status(201).send(cat);
    },
    listCategories: async (req, res) => {
        const cat = await CategoriesModel.find({});
        return res.send(cat);
    }
};