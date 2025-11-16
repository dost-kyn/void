const express = require('express');
const router = express.Router()
const CategoryController = require('./categories.controller')

router.post('/', CategoryController.getAllCategories)
router.post('/create', CategoryController.createCategory)


module.exports = router