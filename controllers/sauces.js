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


async function getSauces(req, res) {
    try {
        const products = await Product.find({})
        res.send(products)
    } catch (error) {
        res.status(500).send(error)
    }
}

async function getSaucesById(req, res, next) {
    try {
        const { id } = req.params
        if (!req.params.id) next()
        else {
            const product = await Product.findById(id)
            res.send(product)
        }
    } catch (error) {
        res.status(500).send(error)
    }
}


function createSauces(req, res) {
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
    product
        .save()
        .then((message) => {
            res.status(201).send({ message: message })
        })
        .catch(console.error)
}

module.exports = { getSauces, createSauces, getSaucesById }