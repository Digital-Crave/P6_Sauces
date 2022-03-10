const express = require('express');
const router = express.Router();
const { getSauces, createSauces, getSaucesById, deleteSauces, modifySauces, likeSauce } = require('../controllers/sauces')
const { upload } = require('../middleware/multer')
const { authenticatedUser } = require('../middleware/authentification')
const { validateId } = require('../middleware/validateId')
const bodyParser = require('body-parser')

router.use(bodyParser.json())

router.use(authenticatedUser)

router.get('', getSauces)

router.get("/:id", getSaucesById)

router.delete("/:id", validateId, deleteSauces)

router.post('', upload.single("image"), createSauces)

router.put('/:id', validateId, upload.single("image"), modifySauces)

router.post('/:id/like', likeSauce)


module.exports = { router }