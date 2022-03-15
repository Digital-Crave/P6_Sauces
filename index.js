const { app, express } = require('./server')
const { router } = require('./routers/sauce.routers')
const { userRouter } = require('./routers/user.routers')
const bodyParser = require('body-parser')
const path = require('path')

const port = 3000

app.use('/api/sauces', router)
app.use('/api/auth', userRouter)

require('./mongo')

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

path.join(__dirname)
app.use("/images", express.static(path.join(__dirname, 'images')))

app.listen(port, () => {
    console.log(`Sauce app listening on port ${port}`)
})



