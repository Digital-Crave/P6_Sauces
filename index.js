const http = require('http');
const { app } = require('./server')
const { router } = require('./routers/sauce.routers')
const { userRouter } = require('./routers/user.routers')

app.use('/api/sauces', router)
app.use('/api/auth', userRouter)

require('./mongo')

const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


// La fonction errorHandler cherche les différentes erreurs et s'en occupent. Pour ensuite les enregistrées dans le serveur. 

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
        default:
            throw error;
    }
};

// Création du serveur

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);