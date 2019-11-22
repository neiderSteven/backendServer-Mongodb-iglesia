// npm install bcryptjs -save = encriptar contraseña

//requires
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

//inicializar variables
var app = express();

var Hospital = require('../models/hospital');

//---------------------------------------------------------
// obtener todos los hospitales
//--------------------------------------------------------
app.get('/', (req, res, next) => {

    Hospital.find({})
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error hospitales',
                        errors: err
                    });
                }

                Hospital.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        hospitales: hospitales
                    });
                });

            })
});

//---------------------------------------------------------
// crear un nuevo hospital
//--------------------------------------------------------
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear hospitales',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            hospitalToken: req.hospital
        });

    });
});

//---------------------------------------------------------
// actualizar hospital
//--------------------------------------------------------
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar hospitales',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el hospital ' + id + ' no existe',
                errors: { message: 'no existe el hospital con ese ID' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.email = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actualizar hospitales',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });
        });
    });
});

//---------------------------------------------------------
// eliminar hospital
//--------------------------------------------------------
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalEliminado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar hospital',
                errors: err
            });
        }

        if (!hospitalEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese ID',
                errors: { message: 'no existe hospital con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalEliminado
        });
    });
});

module.exports = app;