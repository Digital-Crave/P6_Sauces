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
    const { body, file } = req

    const sauce = JSON.parse(body.sauce);

    const { name, manufacturer, description, mainPepper, heat, userId } = sauce

    const { fileName } = file

    const product = new Product({
        userId: userId,
        name: name,
        manufacturer: manufacturer,
        description: description,
        mainPepper: mainPepper,
        imageUrl: req.protocol + "://" + req.get("host") + "/images/" + fileName,
        heat: heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    })
    await product
        .save()
        .catch(console.error)
}

module.exports = { getSauces, createSauces }