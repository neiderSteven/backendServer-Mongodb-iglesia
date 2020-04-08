//requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//inicializar variables
var app = express();

//cors
app.use(function (req, res, next) {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    /*res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Contro-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS")*/
    next();
});

//body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//importar rutas
var appRoutes = require('./routes/app');
var usuariosRoutes = require('./routes/usuarios');
var iglesiasRoutes = require('./routes/iglesias');
var visitasRoutes = require('./routes/visitas');
var loginRoutes = require('./routes/login');
var busquedaRoutes = require('./routes/busqueda');
var uploaddaRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
//var usuarioRoutes = require('./routes/usuario');
//var hospitalRoutes = require('./routes/hospital');
//var medicoRoutes = require('./routes/medico');

//conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log('base de datos: online');
});

//server index config para mostrar imagenes 
/*var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));*/

//rutas
app.use('/usuarios', usuariosRoutes);
app.use('/iglesias', iglesiasRoutes);
app.use('/visitas', visitasRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploaddaRoutes);
app.use('/img', imagenesRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);
//app.use('/usuario', usuarioRoutes);
//app.use('/hospital', hospitalRoutes);
//app.use('/medico', medicoRoutes);

//escuchar peticiones
app.listen(3000, () => {
    console.log('puerto 3000: online');
});