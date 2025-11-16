const express = require("express");
const multer = require("multer");
const path = require('path'); 
const fs = require('fs');
const router = express.Router()
const upload = require('../../middlewear/upload');
const UserController = require('./user.controller')


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

// const upload = multer({ 
//     storage: storage,
//     limits: { fileSize: 5 * 1024 * 1024 },
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith('image/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Только изображения разрешены!'), false);
//         }
//     }
// });




router.get('/', UserController.getAllUsers)
router.post('/register', upload.single('avatar'), UserController.createUser) 
router.post('/login', UserController.loginUsers)   
router.get('/:id', UserController.getUserById)
router.delete('/:id', UserController.delProfile)   
router.patch('/:id', upload.single('photo'), UserController.updateUser);

module.exports = router