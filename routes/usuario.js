// npm install bcryptjs -save = encriptar contraseña

//requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

//inicializar variables
var app = express();

var Usuario = require('../models/usuario');

//---------------------------------------------------------
// obtener todos los usuarios
//--------------------------------------------------------
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuarios) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error usuarios',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuario: usuarios
                });
            })
});

//---------------------------------------------------------
// crear un nuevo usuario
//--------------------------------------------------------
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear usuarios',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });

    });
});

//---------------------------------------------------------
// actualizar usuario
//--------------------------------------------------------
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {

        console.log('u: ' + usuario);

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuarios',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el usuario ' + id + ' no existe',
                errors: { message: 'no existe el usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actualizar usuarios',
                    errors: err
                });
            }

            usuarioGuardado.password = ':P';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

//---------------------------------------------------------
// eliminar usuario
//--------------------------------------------------------
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: { message: 'no existe usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioEliminado
        });
    });
});

module.exports = app;