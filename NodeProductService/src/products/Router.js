const router = require('express').Router();
const { 
    getProducts,
    getProduct,
    addCategory, 
    addSubCategory, 
    listCategories, 
    addProduct, 
    deleteSubCat, 
    deleteCategory,
    deleteProduct,
} = require("./Controller");
const { isAdmin, verifyPKCE } = require("../utils/middleware");

router.get('/', getProducts);
router.get('/categories', listCategories);
router.get('/category/:categoryTag', getProducts);
router.get('/:category/:product', getProduct);
router.post('/', isAdmin, verifyPKCE, addProduct);
router.post('/category', isAdmin, verifyPKCE, addCategory);
router.post('/category/:name', isAdmin, verifyPKCE, addSubCategory);
router.delete('/category', isAdmin, verifyPKCE, deleteCategory);
router.delete('/category/:name', isAdmin, verifyPKCE, deleteSubCat)
router.delete('/', isAdmin, verifyPKCE, deleteProduct);

module.exports = router;