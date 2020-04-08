var express = require('express');

var app = express();

//var Hospital = require('../models/hospital');
var Iglesias = require('../models/iglesias');
var Usuarios = require('../models/usuarios');

//------------------------------------------------------
// buesqueda especifica
//------------------------------------------------------
app.get('/:id/:tabla/:busqueda', (req, res) => {

    var id = req.params.id;
    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regexp = new RegExp(busqueda, 'i');

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regexp);
            break;
        case 'iglesias':
            promesa = buscarIglesias(busqueda, regexp);
            break;
        /*case 'hospitales':
            promesa = buscarHospitales(busqueda, regexp);
            break;*/
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'tipos de busqueda solo son:usuarios, iglesias, visitas',
                error: { mensaje: 'tipo de tabla/coleccion no valido' }
            });
            break;
    }

    promesa.then(data => {

        var datas = [];

        for (let index = 0; index < data.length; index++) {
            if (id == data[index].pastor) {
                datas.push(data[index]);
            }

        }

        res.status(200).json({
            ok: true,
            [tabla]: datas
        });
    });
});

//------------------------------------------------------
// buesqueda general
//------------------------------------------------------

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regexp = new RegExp(busqueda, 'i');

    Promise.all(
        [buscarUsuarios(busqueda, regexp),
        buscarHospitales(busqueda, regexp),
        buscarMedicos(busqueda, regexp)])

        .then(respuestas => {

            res.status(200).json({
                ok: true,
                usuarios: respuestas[0],
                hospitales: respuestas[1],
                medicos: respuestas[2]
            });
        });
});

function buscarHospitales(busqueda, regexp) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regexp })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarIglesias(busqueda, regexp) {

    return new Promise((resolve, reject) => {

        Iglesias.find({ nombre: regexp })
            //.populate('usuario', 'nombre email')
            //.populate('hospital')
            .exec((err, iglesias) => {

                if (err) {
                    reject('error al cargar iglesias', err);
                } else {
                    resolve(iglesias);
                }
            });
    });
}

function buscarUsuarios(busqueda, regexp) {

    return new Promise((resolve, reject) => {

        Usuarios.find({}, 'nombre email role')
            .or([{ 'nombre': regexp }, { 'email': regexp }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;