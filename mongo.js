const mongoose = require('mongoose');
const password = process.env.DB_PASSWORD
const user = process.env.DB_USER
const uri = `mongodb+srv://${user}:${password}@cluster0.mtrqw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(uri)
    .then(() => console.log('Connect to Mongo !'))
    .catch((err) => console.error("Error connecting to Mongo", err));

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
})

const User = mongoose.model('User', userSchema)

module.exports = { mongoose, User }