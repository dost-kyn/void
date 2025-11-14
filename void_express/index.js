const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const path = require("path");
const errorHandler = require("./middlewear/errorHandler");

const PostRouters = require('./features/posts/posts.routers')

app.use(express.json());

app.use('/posts', PostRouters);



app.use(errorHandler)


app.listen(process.env.PORT, () => {
  console.log("сервер запущен на порту " + process.env.PORT);
});
