const express = require("express");
const router = express.Router()
const UserController = require('./user.controller')

router.post('/', UserController.getAllUsers)
router.post('/users/register', UserController.createUser)
router.post('/users/login', UserController.loginUsers)

module.exports = router