require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000

console.log("Variable environnement:", process.env.PASSWORD)

require("./mongo")

const { createUser, userLog } = require('./controllers/Users')
const { getSauces, createSauces } = require('./controllers/sauces')

app.use(cors())
app.use(express.json());
const { authenticatedUser } = require('./middleware/authentification')

app.post('/api/auth/signup', createUser)
app.post('/api/auth/login', userLog)
app.get('/api/sauces', authenticatedUser, getSauces)
app.post('/api/sauces', authenticatedUser, createSauces)
app.get('/', (req, res) =>
    res.send('Hello World!')
)

app.listen(port, () => {
    console.log(`Sauce app listening on port ${port}`)
})



