const { request } = require("express");
const router = express.Router()
const UserController = require('./user.controller')

router.post('/', UserController.getAllUsers)
router.post('/reg', UserController.createUser)
router.post('/login', UserController.loginUsers)

module.exports = router