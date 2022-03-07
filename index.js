require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const { upload } = require('./middleware/multer')
const { authenticatedUser } = require('./middleware/authentification')

const port = 3000


require("./mongo")

const { createUser, userLog } = require('./controllers/Users')
const { getSauces, createSauces, getSaucesById, deleteSauces, modifySauces } = require('./controllers/sauces')

app.use(cors())
app.use(express.json());
app.use(bodyParser.json());


app.post('/api/auth/signup', createUser)
app.post('/api/auth/login', userLog)
app.get('/api/sauces', authenticatedUser, getSauces)
app.get("/api/sauces/:id", authenticatedUser, getSaucesById)
app.delete("/api/sauces/:id", authenticatedUser, deleteSauces)
app.post('/api/sauces', authenticatedUser, upload.single("image"), createSauces)
app.put('/api/sauces/:id', authenticatedUser, upload.single("image"), modifySauces)
app.get('/', (req, res) =>
    res.send('Hello World!')
)

path.join(__dirname)
app.use("/images", express.static(path.join(__dirname, 'images')))

app.listen(port, () => {
    console.log(`Sauce app listening on port ${port}`)
})



