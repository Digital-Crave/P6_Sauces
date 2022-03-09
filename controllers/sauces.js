const fs = require('fs')
const Product = require('../models/sauces')

async function getSauces(req, res) {
    try {
        const sauces = await Product.find({})
        res.send(sauces)
    } catch (error) {
        res.status(500).send(error)
    }
}

async function getSaucesById(req, res) {
    try {
        const { id } = req.params
        if (!req.params.id) {
            res.status(404).send({ error: "Invalid id provided" })
        } else {
            const sauce = await Product.findById(id)
            if (!sauce) {
                res.status(404).send({ message: "nothing was found in database" })
            } else {
                res.send(sauce)
            }
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

async function modifySauces(req, res, next) {
    const { params: { id } } = req


    const hasNewImage = req.file != null
    const payload = addPayload(hasNewImage, req)

    try {
        const product = await Product.findByIdAndUpdate(id, payload)
        if (product == null) {
            res.status(404).send({ message: "nothing was found" })
        } else {
            if (req.file != null) {
                res.status(200).send({ message: "update done" })
                deleteImage(product)
            } else {
                res.status(200).send({ message: "update done" })
            }
        }
    } catch (err) {
        console.error("error while updating", err)
    }
}


function deleteImage(product) {
    if (product == null) {
        return
    }

    const imageToDelete = product.imageUrl.split("/images")[1]

    fs.unlink(`images/${imageToDelete}`, (err) => {
        if (err)
            throw err;
    })
}


function addPayload(hasNewImage, req) {
    if (!hasNewImage) return req.body
    const payload = JSON.parse(req.body.sauce)
    payload.imageUrl = req.protocol + "://" + req.get("host") + "/images/" + req.file.fileName
    return payload
}


async function createSauces(req, res) {
    const { body, file } = req

    const sauce = JSON.parse(body.sauce)

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
    try {
        const message = await product.save()
        res.status(201).send({ message: message })
    } catch (error) {
        res.status(500).send(error)
    }
}


async function deleteSauces(req, res) {
    const { id } = req.params

    try {
        const product = await Product.findByIdAndDelete(id)
        if (product == null) {
            res.status(404).send({ message: "nothing was found in database" })
        } else {
            res.status(200).send({ message: "update done" })
        }
    } catch (err) {
        res.status(500).send({ message: err })
    }
}


module.exports = { getSauces, createSauces, getSaucesById, deleteSauces, modifySauces }