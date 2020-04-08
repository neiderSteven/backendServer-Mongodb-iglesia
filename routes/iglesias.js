//requires
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

//inicializar variables
var app = express();

var Iglesias = require('../models/iglesias');

//---------------------------------------------------------
// obtener todas las iglesias 
//--------------------------------------------------------
app.get('/', (req, res, next) => {

    Iglesias.find({})
        //.populate('usuario', 'nombre email')
        //.populate('hospital')
        .exec(
            (err, iglesias) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error iglesias',
                        errors: err
                    });
                }

                Iglesias.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        iglesias: iglesias
                    });
                });

            })
});

//---------------------------------------------------------
// crear una nueva iglesia
//--------------------------------------------------------
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var iglesia = new Iglesias({
        nombre: body.nombre,
        direccion: body.direccion,
        anciano: body.anciano,
        telefono: body.telefono,
        numeroMiembros: body.numeroMiembros,
        pastor: req.usuario._id
    });

    iglesia.save((err, iglesiaGuardada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear iglesia',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            iglesia: iglesiaGuardada,
            iglesiaToken: req.iglesia
        });

    });
});

//---------------------------------------------------------
// traer unica iglesia 
//--------------------------------------------------------
app.get('/:id', (req, res) => {

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
});

//---------------------------------------------------------
// actualizar iglesia
//--------------------------------------------------------
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Iglesias.findById(id, (err, iglesia) => {

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

        iglesia.nombre = body.nombre;
        iglesia.direccion = body.direccion;
        iglesia.anciano = body.anciano;
        iglesia.telefono = body.telefono;
        iglesia.numeroMiembros = body.numeroMiembros;
        //iglesia.pastor = req.usuario._id;

        iglesia.save((err, iglesiaGuardada) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actualizar iglesia',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                iglesia: iglesiaGuardada
            });
        });
    });
});

//---------------------------------------------------------
// eliminar iglesia
//--------------------------------------------------------
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Iglesias.findByIdAndDelete(id, (err, iglesiaEliminada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar iglesia',
                errors: err
            });
        }

        if (!iglesiaEliminada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una iglesia con ese ID',
                errors: { message: 'no existe iglesia con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            iglesia: iglesiaEliminada
        });
    });
});

module.exports = app;