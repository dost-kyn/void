const express = require('express');
const router = express.Router()
const CategoryController = require('./categories.controller')

router.get('/', CategoryController.getAllCategories)
router.post('/create', CategoryController.createCategory)
router.put('/update/:id', CategoryController.updateCategory);
router.delete('/delete/:id', CategoryController.deleteCategory)

module.exports = router