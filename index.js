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

//eviter les erreurs de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
});

app.get("/", (req, res) => res.send("Hello World!"))

path.join(__dirname)
app.use("/images", express.static(path.join(__dirname, 'images')))

app.listen(port, () => {
    console.log(`Sauce app listening on port ${port}`)
})



