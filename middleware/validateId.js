require('dotenv').config();
const jwt = require('jsonwebtoken');
const Product = require('../models/sauces');

async function validateId(req, res) {
    try {
        const product = await Product.findOne({ _id: req.params.id })
        // recup le token qui identifie
        const token = req.headers.authorization.split(' ')[1];
        // on le décode
        const decodedToken = jwt.verify(token, process.env.JWT_PASSWORD);
        // on recup l'userId du token
        const userId = decodedToken.userId;
        // on compare l'user id de la sauce et de celui du token
        if (product.userId && product.userId === userId) {
            res.status(403).json({ message: 'Requête non autorisée' });
        } else {
            res.status(202).json({ message: 'Requête autorisée' })
        }
    } catch (error) {
        res.status(401).json({ error })
    }
}

module.exports = { validateId }