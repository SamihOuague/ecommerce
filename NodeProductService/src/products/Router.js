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
const { isAdmin } = require("../utils/allowedUser");

router.get('/', mainPage);
router.get('/categories', listCategories);
router.get('/category/:categoryTag', productsByCategory);
router.get('/:category/:product', getProduct);
router.post('/', isAdmin, addProduct);
router.post('/category', isAdmin, addCategory);
router.post('/category/:name', isAdmin, addSubCategory);
router.delete('/category', isAdmin, deleteCategory);
router.delete('/category/:name', isAdmin, deleteSubCat)
router.delete('/', isAdmin, deleteProduct);

module.exports = router;