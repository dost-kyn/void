const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });
const path = require("path");
const cors = require('cors')
app.use(cors())




const errorHandler = require("./middlewear/errorHandler");
const userRoutes = require('./features/users/user.routers')
const PostRouters = require('./features/posts/posts.routers')
const CategoriesRouters = require('./features/categories/categories.routers')

app.use(express.json());


app.get('/api/categories/test-simple', (req, res) => {
    console.log('✅ Test route called!');
    res.json({ 
        message: 'Simple test works!', 
        timestamp: new Date(),
        data: [
            { id: 1, name: 'Тестовая категория 1' },
            { id: 2, name: 'Тестовая категория 2' }
        ]
    });
});
console.log('✅ CategoriesRouters loaded:', !!CategoriesRouters);

app.use('/posts', PostRouters);
app.use('/users', userRoutes)
app.use('/api/categories', CategoriesRouters)
app.use(errorHandler)





app.listen(process.env.PORT, () => {
  console.log("сервер запущен на порту " + process.env.PORT);
});
