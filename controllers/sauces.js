const { param } = require('express/lib/request')
const fs = require('fs')
const Product = require('../models/sauces')

function updateDone(res) {
    res.status(200).send({ message: "update done" })
}

async function getSauces(req, res) {
    try {
        const sauces = await Product.find({})
        res.send(sauces)
    } catch (error) {
        res.status(500).send({ message: "error" })
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
        res.status(500).send({ message: "error" })
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
                updateDone(res)
                deleteImage(product)
            } else {
                updateDone(res)
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
            deleteImage(product)
            updateDone(res)
        }
    } catch (err) {
        res.status(500).send({ message: err })
    }
}

function likeSauce(req, res) {
    if (![1, -1, 0].includes(req.body.like)) {
        return res.status(403).send({ message: "Invalid like value" })
    } else {
        addLike(req, res)
        addDislike(req, res)
        removeLike(req, res)
    }
}

async function addLike(req, res) {
    if (req.body.like === 1) {
        try {
            await Product.findOneAndUpdate({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } })
            return res.status(200).send({ message: "Like ajouté !" })
        } catch (error) {
            res.status(400).send({ error })
        }
    }
}

async function addDislike(req, res) {
    if (req.body.like === -1) {
        try {
            await Product.findOneAndUpdate({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } })
            return res.status(200).send({ message: "Dislike ajouté !" })
        } catch (error) {
            res.status(400).send({ error })
        }
    }
}

function removeLike(req, res) {
    Product.findOne({ _id: req.params.id }).then((resultat) => {
        if (resultat.usersLiked.includes(req.body.userId)) {
            Product.findOneAndUpdate({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } })
                .then(() => res.status(200).send({ message: "Like retiré !" }))
                .catch((error) => res.status(400).send({ error }));
        } else if (resultat.usersDisliked.includes(req.body.userId)) {
            Product.findOneAndUpdate({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } })
                .then(() => res.status(200).send({ message: "Dislike retiré !" }))
                .catch((error) => res.status(400).send({ error }));
        }
    });
}


module.exports = { getSauces, createSauces, getSaucesById, deleteSauces, modifySauces, likeSauce }