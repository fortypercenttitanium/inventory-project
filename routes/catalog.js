const express = require('express');
const router = express.Router();

const itemController = require('../controllers/itemController');
const categoryController = require('../controllers/categoryController');
const brandController = require('../controllers/brandController');

// Home page
router.get('/', itemController.index);

// Item routes
router.get('/item/create', itemController.item_create_get);
router.post('/item/create', itemController.item_create_post);
router.get('/item/:id/delete', itemController.item_delete_get);
router.post('/item/:id/delete', itemController.item_delete_post);
router.get('/item/:id/update', itemController.item_update_get);
router.post('/item/:id/update', itemController.item_update_post);
router.get('/item/:id', itemController.item_detail);
router.get('/items', itemController.item_list);

// Brand routes
router.get('/brand/create', brandController.brand_create_get);
router.post('/brand/create', brandController.brand_create_post);
router.get('/brand/:id/delete', brandController.brand_delete_get);
router.post('/brand/:id/delete', brandController.brand_delete_post);
router.get('/brand/:id/update', brandController.brand_update_get);
router.post('/brand/:id/update', brandController.brand_update_post);
router.get('/brand/:id', brandController.brand_detail);
router.get('/brands', brandController.brand_list);

// Category routes
router.get('/category/create', categoryController.category_create_get);
router.post('/category/create', categoryController.category_create_post);
router.get('/category/:id/delete', categoryController.category_delete_get);
router.post('/category/:id/delete', categoryController.category_delete_post);
router.get('/category/:id/update', categoryController.category_update_get);
router.post('/category/:id/update', categoryController.category_update_post);
router.get('/category/:id', categoryController.category_detail);
router.get('/categories', categoryController.category_list);

module.exports = router;
