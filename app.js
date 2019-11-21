//requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//inicializar variables
var app = express();

//body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

//conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('base de datos: online');
});

//rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

//escuchar peticiones
app.listen(3000, () => {
    console.log('puerto 3000: online');
});