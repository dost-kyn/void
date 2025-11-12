
const express = require('express')
const app = express()
const dotenv = require("dotenv");
dotenv.config();   
const path = require('path')



app.use(express.json())





app.listen(process.env.PORT, () => {
    console.log('сервер запущен на порту ' + process.env.PORT)
})