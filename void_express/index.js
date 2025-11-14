const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });
const path = require("path");
const cors = require('cors')
app.use(cors())




const errorHandler = require("./middlewear/errorHandler");
const userRoutes = require('./features/users/user.routers')






app.use(express.json());
app.use('/api', userRoutes)
app.use(errorHandler)





app.listen(process.env.PORT, () => {
  console.log("сервер запущен на порту " + process.env.PORT);
});
