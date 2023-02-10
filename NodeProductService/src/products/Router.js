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
const { isAdmin, verifyPKCE } = require("../utils/middleware");

router.get('/', mainPage);
router.get('/categories', listCategories);
router.get('/category/:categoryTag', productsByCategory);
router.get('/:category/:product', getProduct);
router.post('/', isAdmin, verifyPKCE, addProduct);
router.post('/category', isAdmin, verifyPKCE, addCategory);
router.post('/category/:name', isAdmin, verifyPKCE, addSubCategory);
router.delete('/category', isAdmin, verifyPKCE, deleteCategory);
router.delete('/category/:name', isAdmin, verifyPKCE, deleteSubCat)
router.delete('/', isAdmin, verifyPKCE, deleteProduct);

module.exports = router;