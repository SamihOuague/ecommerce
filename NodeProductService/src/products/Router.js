const router = require('express').Router();
const { 
    mainPage,
    getProduct,
    addCategory, 
    addSubCategory, 
    listCategories, 
    addProduct, 
    deleteSubCat, 
    deleteCategory,
    deleteProduct,
    productsByCategory,
} = require("./Controller");
const { isAuth } = require("../utils/allowedUser");

router.get('/', mainPage);
router.get('/categories', listCategories);
router.get('/category/:categoryTag', productsByCategory);
router.get('/:category/:product', getProduct);
router.post('/', isAuth, addProduct);
router.post('/category', isAuth, addCategory);
router.post('/category/:name', isAuth, addSubCategory);
router.delete('/category', isAuth, deleteCategory);
router.delete('/category/:name', isAuth, deleteSubCat)
router.delete('/', isAuth, deleteProduct);

module.exports = router;