var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

//------------------------------------------------------
// buesqueda especifica
//------------------------------------------------------
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var tabla = req.params.tabla;
    var busqueda = req.params.busqueda;
    var regexp = new RegExp(busqueda, 'i');

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regexp);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regexp);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regexp);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'tipos de busqueda solo son:usuarios, medicos, hospitales',
                error: { mensaje: 'tipo de tabla/coleccion no valido' }
            });
            break;
    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
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

function buscarMedicos(busqueda, regexp) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regexp })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {

                if (err) {
                    reject('error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });
    });
}

function buscarUsuarios(busqueda, regexp) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
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