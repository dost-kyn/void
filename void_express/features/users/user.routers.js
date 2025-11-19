const express = require("express");
const multer = require("multer");
const path = require('path'); 
const fs = require('fs');
const router = express.Router()
const upload = require('../../middlewear/upload');
const UserController = require('./user.controller')
const authMiddleware = require('../../middlewear/authenticate');

//  НАСТРОЙКА ХРАНЕНИЯ ФАЙЛОВ
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname); // .jpg, .png
        const safeFileName = 'avatar-' + uniqueSuffix + fileExtension;
        cb(null, safeFileName);
    }
});




router.get('/', UserController.getAllUsers)
router.post('/register', upload.single('avatar'), UserController.createUser) 
router.post('/login', UserController.loginUsers)   
router.get('/:id', UserController.getUserById)
router.delete('/:id', UserController.delProfile)   
router.patch('/:id', upload.single('photo'), UserController.updateUser);

router.post('/:id/ban', UserController.banUser);
router.post('/:id/unban', UserController.unbanUser);

module.exports = router