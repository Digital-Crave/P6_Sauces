require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000

console.log("Variable environnement:", process.env.PASSWORD)

require("./mongo")

const { createUser } = require('./controllers/Users')

app.use(cors())
app.use(express.json());

app.post('/api/auth/signup', createUser)

app.get('/', (req, res) =>
    res.send('Hello World!')
)

app.listen(port, () => {
    console.log(`Sauce app listening on port ${port}`)
})



