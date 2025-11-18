const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });
const path = require("path");
const multer = require('multer');
const cors = require('cors')
app.use(cors())

// Настройка multer для загрузки фото
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/posts/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'post-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Можно загружать только изображения!'), false);
        }
    }
});


const errorHandler = require("./middlewear/errorHandler");

const userRoutes = require('./features/users/user.routers')
const PostRouters = require('./features/posts/posts.routers')
const CategoriesRouters = require('./features/categories/categories.routers')
const friendsRouter = require('./features/friends/friends.routers');

app.use(express.json());



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/posts', PostRouters);
app.use('/api/users', userRoutes)
app.use('/api/categories', CategoriesRouters)
app.use('/api/friends', friendsRouter);
app.use(errorHandler)





app.listen(process.env.PORT, () => {
  console.log("сервер запущен на порту " + process.env.PORT);
});
