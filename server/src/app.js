const express = require('express');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const path = require('path');
const createStaticDir = require('../src/service/createStaticDir');

const userRouter = require('../src/router/userRouter');
const entryRouter = require('../src/router/entriesRouter');

const cors = require('cors');
const server = express();

server.use(cors());
server.use(express.json())
server.use(express.urlencoded({extended: false}));
server.use(morgan('dev'));
server.use(fileupload());

const staticDir = path.join(__dirname,'uploads');

server.use(express.static(staticDir));

createStaticDir(staticDir); 

server.use(userRouter);
server.use(entryRouter);

server.use((err, _req, res, _next) => {
    console.log("ERROR: " + err.message);
    res.status(err.code ?? 500);
    res.send({
        status: "Error",
        message: `${err.message}`});
});

server.use((_req, res) => {
    res.status(404);
    res.send("Página no encontrada");
});

module.exports = server;