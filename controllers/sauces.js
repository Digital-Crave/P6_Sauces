const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: Number,
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String]
})

const Product = mongoose.model("Product", productSchema)


function getSauces(req, res) {
    Product.find({}).then(products => res.send(products))
    //res.send({ message: [{ sauce: "sauce1" }, { sauce: "sauce2" }] })
}

async function createSauces(req, res) {
    const product = new Product({
        userId: "test",
        name: "test",
        manufacturer: "test",
        description: "test",
        mainPepper: "test",
        imageUrl: "test",
        heat: 2,
        likes: 2,
        dislikes: 2,
        usersLiked: ["test"],
        usersDisliked: ["test"]
    })
    await product.save().catch(console.error)
}

module.exports = { getSauces, createSauces }