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
    mainPage: async (req, res) => {
        try {
            let page = 0;
            let f = {
                available: req.query.available,
                priceMin: req.query.pricemin,
                priceMax: req.query.pricemax,
                sortby: req.query.sortby
            };
            let filter = {};
            if (req.query.page && Number(req.query.page) && Number(req.query.page) > 0) page = (Number(req.query.page) - 1) * 6;
            const nb_prod = {
                in: await ProductModel.find({ available: true }).countDocuments(),
                out: await ProductModel.find({ available: false }).countDocuments(),
            };
            if (f.available == "out") filter.available = false;
            else if (f.available == "in") filter.available = true;
            if (f.priceMin && Number(f.priceMin)) filter.price = { "$gte": Number(f.priceMin) };
            if (f.priceMax && Number(f.priceMax)) {
                if (filter.price) filter.price = { ...filter.price, "$lte": Number(f.priceMax) };
                else filter.price = { "$lte": Number(f.priceMax) };
            }
            const cat = await CategoriesModel.find({});
            let prods = sortBySwitch(f.sortby);
            if (prods) prods = await ProductModel.find(filter).sort(sortBySwitch(f.sortby)).skip(page).limit(6);
            else prods = await ProductModel.find(filter).skip(page).limit(6);
            let reviews = await ReviewsModel.find({ product_id: { "$in": prods.map((v) => v._id) } });
            let rates = {};
            let highestPrice = await ProductModel.find(filter, { price: 1 }).sort({ price: -1 }).limit(1);
            for (let i = 0; i < prods.length; i++) {
                let f = reviews.filter((v) => v.product_id == prods[i]._id).map((v) => v.rate);
                if (f.length) rates[prods[i]._id] = (f.reduce((a, c) => a + c, 0) / f.length);
                else rates[prods[i]._id] = 0;
            }
            return res.send({ prods, cat, nb_prod, rates, highestPrice: (highestPrice.length > 0) ? highestPrice[0] : { price: 0 } });
        } catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }
    },
    productsByCategory: async (req, res) => {
        try {
            let { categoryTag } = req.params;
            const cat = await CategoriesModel.find({});
            let page = 0;
            categoryTag = categoryTag.replaceAll("-", " ").toLowerCase();
            const nb_prod = {
                in: await ProductModel.find({ available: true }).countDocuments(),
                out: await ProductModel.find({ available: false }).countDocuments(),
            };
            if (req.query.page && Number(req.query.page) && Number(req.query.page) > 0) page = (Number(req.query.page) - 1) * 6;
            let f = {
                available: req.query.available,
                priceMin: req.query.pricemin,
                priceMax: req.query.pricemax,
                sortby: req.query.sortby
            };
            const filter = {
                categoryTag: {
                    $regex: new RegExp(`^${categoryTag}$`, "i")
                },
            };
            if (f.available == "out") filter.available = false;
            else if (f.available == "in") filter.available = true;
            if (f.priceMin && Number(f.priceMin)) filter.price = { "$gte": Number(f.priceMin) };
            if (f.priceMax && Number(f.priceMax)) {
                if (filter.price) filter.price = { ...filter.price, "$lte": Number(f.priceMax) };
                else filter.price = { "$lte": Number(f.priceMax) };
            }
            const prods = await ProductModel.find(filter).skip(page).limit(6);
            let reviews = await ReviewsModel.find({ product_id: { "$in": prods.map((v) => v._id) } });
            let highestPrice = await ProductModel.find(filter, { price: 1 }).sort({ price: -1 }).limit(1);
            let rates = {};
            for (let i = 0; i < prods.length; i++) {
                let f = reviews.filter((v) => v.product_id == prods[i]._id).map((v) => v.rate);
                if (f.length) rates[prods[i]._id] = (f.reduce((a, c) => a + c, 0) / f.length);
                else rates[prods[i]._id] = 0;
            }
            return res.send({ prods, cat, rates, nb_prod, highestPrice: (highestPrice.length > 0) ? highestPrice[0] : { price: 0 } });
        } catch (e) {
            console.error(e);
            return res.sendStatus(500);
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
        } catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const { name } = req.body;
            if (!name) return res.sendStatus(400);
            let prod = await ProductModel.findOneAndDelete({ title: name });
            return res.status(200).send(prod);
        } catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }
    },
    deleteSubCat: async (req, res) => {
        try {
            if (!req.body.name || !req.params.name) return res.sendStatus(400);
            let cat = await CategoriesModel.findOne({
                category: {
                    $regex: new RegExp("^" + req.params.name.replaceAll("-", " ").toLowerCase(), "i"),
                }
            });
            if (!cat) return res.sendStatus(404);
            cat.subcategory = cat.subcategory.filter((value) => {
                return value.name !== req.body.name;
            });
            await cat.save();
            return res.status(200).send(cat);
        } catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }
    },
    deleteCategory: async (req, res) => {
        try {
            if (!req.body.name) return res.sendStatus(400);
            let deletedCat = await CategoriesModel.findOneAndDelete({ category: req.body.name });
            if (!deletedCat) return res.sendStatus(404);
            return res.send(deletedCat);
        } catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }
    },
    addCategory: async (req, res) => {
        try {
            if (!req.body.name) return res.sendStatus(400);
            let exist = await CategoriesModel.findOne({ category: req.body.name });
            if (exist) return res.sendStatus(400);
            let cat = new CategoriesModel({
                category: req.body.name
            });
            await cat.save();
            return res.status(201).send(cat);
        } catch (e) {
            console.error(e);
            return res.sendStatus(500);
        }
    },
    addSubCategory: async (req, res) => {
        try {
            if (!req.params.name || !req.body.name) return res.sendStatus(400);
            let cat = await CategoriesModel.findOne({
                category: {
                    $regex: new RegExp("^" + req.params.name.replaceAll("-", " ").toLowerCase(), "i"),
                }
            });
            if (!cat) return res.sendStatus(404);
            cat.subcategory.push({ name: req.body.name });
            await cat.save();
            return res.status(201).send(cat);
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