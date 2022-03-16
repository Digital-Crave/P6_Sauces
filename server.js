require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const path = require('path')
const bodyParser = require('body-parser')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");

app.use(mongoSanitize());
app.use(helmet.xssFilter());

path.join(__dirname)
app.use("/images", express.static(path.join(__dirname, 'images')))

app.use(bodyParser.json());
app.use(cors())
app.use(express.json())

module.exports = { app, express }