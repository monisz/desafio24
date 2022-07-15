const express = require('express');
const { engine } = require('express-handlebars');
const { Server: HttpServer } = require('http');
const { Server: SocketServer } = require('socket.io');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const apiRoutes = require('./src/routes')
const tableProducts = require('./src/containers/productContainer_mysql');
const colMessages = require('./src/containers/messagesContainer_firebase');

const app = express();
const httpServer = new HttpServer(app);
const ioServer = new SocketServer(httpServer);

app.use(session({
    secret: 'desafio24',
    resave: true,
    rolling: true,
    cookie: {
        maxAge: 60000
    },
    saveUninitialized: false
}));

app.use(cookieParser());

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
    'hbs',
    engine({
      extname: '.hbs',
      defaultLayout: 'index.hbs',
    })
);

app.set('views', './public/views');
app.set('view engine', 'hbs');

app.use('/', apiRoutes);

app.post('/login', (req, res) => {
    const { userName } = req.body;
    req.session.userName = userName;
    console.log("req.session.userName en /login", req.session.userName)
    console.log("username", userName)

    res.render('main-products',  {userName});
})


/* app.post('/logout', (req, res, next) => { */
/*     const userName = req.session.userName */
/*     req.session.destroy((err) => { */
/*         console.log(err); */
/*         res.render('logout', {userName}) */
/*     }) */
/*     next(); */
/* }, (req, res) => { */
/*     setTimeout(() => { */
/*         console.log("en settimeout") */
/*         res.render('login') */
/*     }, 2000); */
/* }) */

app.post('/logout', (req, res) => {
    const userName = req.session.userName
    console.log("estoy en post logout")
    req.session.destroy((err) => {
        console.log(err);
        res.render('logout', {userName})
    })
})


//Ruta para test con Faker
app.get('/api/productos-test', async (req, res) => {
    const mocks = await tableProducts.generateMock();
    console.log(mocks)
    res.render('main-faker', {mocks})
})

app.use('/', (req, res) => {
    console.log(req.session.userName)
    console.log(!req.session.userName)
    if (!req.session?.userName) res.render('login');
});


// Para cualquier ruta no implementada
app.use((req, res) => {
    res.status(404).send("ruta no implementada");
});


httpServer.listen(8080, () => {
    console.log("escuchando desafio 24");
});


ioServer.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    /* socket.emit('user', userName) */
    const getTables = (async () => {
        socket.emit('messages', await colMessages.getAll());  
        socket.emit('products', await tableProducts.getAll());
    }) ();

    socket.on("newMessage", (message) => {
        const saveMessage = (async (message) => {
            const messagesNorm = await colMessages.save(message);
            ioServer.sockets.emit("messages", messagesNorm);
        }) (message);
    });
    socket.on('newProduct', (product) => {
        const getProducts = (async (product) => {
            await tableProducts.save(product);
            const allProducts = await tableProducts.getAll()
            ioServer.sockets.emit("products", allProducts);
        }) (product);
    });
    /* socket.on('logout', (userName) => { */
    /*     console.log("en socket", userName) */
    /*     const getTables = (async () => { */
    /*          */
    /*          */
    /*         socket.emit('logout', userName) */
    /*     }) (); */
    /* }); */
});
