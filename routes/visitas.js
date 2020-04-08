var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

//inicializar variables
var app = express();

var Visitas = require('../models/visitas');

//---------------------------------------------------------
// obtener todas las visitas 
//--------------------------------------------------------
app.get('/', (req, res, next) => {

    Visitas.find({})
        //.populate('usuario', 'nombre email')
        //.populate('hospital')
        .exec(
            (err, visitas) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error de visitas',
                        errors: err
                    });
                }

                Visitas.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        visitas: visitas
                    });
                });

            })
});

//---------------------------------------------------------
// crear una nueva visita
//--------------------------------------------------------
app.post('/:id', (req, res) => {

    var body = req.body;
    var _id = req.params.id;

    var visita = new Visitas({
        nombre: body.nombre,
        telefono: body.telefono,
        direccion: body.direccion,
        estudios: body.estudios,
        bautizada: body.bautizada,
        iglesia: _id
    });

    visita.save((err, visitaGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear visita',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            visita: visitaGuardada,
            visitaToken: req.visita
        });
    });
});

//---------------------------------------------------------
// traer unica iglesia 
//--------------------------------------------------------
/*app.get('/:id', (req, res) => {

    var id = req.params.id;

    Iglesias.findById(id)
        .exec((err, iglesia) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al buscar iglesias',
                    errors: err
                });
            }

            if (!iglesia) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'la iglesia ' + id + ' no existe',
                    errors: { message: 'no existe la iglesia con ese ID' }
                });
            }

            res.status(200).json({
                ok: true,
                iglesia: iglesia
            });
        });
});*/

//---------------------------------------------------------
// actualizar visita
//--------------------------------------------------------
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Visitas.findById(id, (err, visita) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar visitas',
                errors: err
            });
        }

        if (!visita) {
            return res.status(400).json({
                ok: false,
                mensaje: 'la visita ' + id + ' no existe',
                errors: { message: 'no existe la visita con ese ID' }
            });
        }

        visita.nombre = body.nombre;
        visita.telefono = body.telefono;
        visita.direccion = body.direccion;
        visita.estudios = body.estudios;
        visita.bautizada = body.bautizada;

        visita.save((err, visitaGuardada) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actualizar visita',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                visita: visitaGuardada
            });
        });
    });
});

//---------------------------------------------------------
// eliminar iglesia
//--------------------------------------------------------
app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Visitas.findByIdAndDelete(id, (err, visitaEliminada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar visita',
                errors: err
            });
        }

        if (!visitaEliminada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una visita con ese ID',
                errors: { message: 'no existe visita con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            visita: visitaEliminada
        });
    });
});

module.exports = app;