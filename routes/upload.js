// npm install express-fileupload --save = para cargar imagenes
// npm install serve-index --save = desplegar imagenes

var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

//inicializar variables
var app = express();

var Usuarios = require('../models/usuarios');
var Iglesias = require('../models/iglesias');
//var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());

//rutas
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de coleccion
    var tiposValidos = ['iglesias', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'tipo de coleccion no es valida',
            errors: { mensaje: 'tipo de coleccion no es valida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { mensaje: 'debe seleccionar una imagen' }
        });
    }

    //obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //solo estas extensiones permitimos
    var extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'extension no valida',
            errors: { mensaje: 'extensiones validas' + extensionesValidas.join(', ') }
        });
    }

    // nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // mover el archivo a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        /*res.status(200).json({
            ok: true,
            mensaje: 'archivo movido',
            nombreCortado: extensionArchivo
        });*/
    });

});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuarios.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'no existe usuario',
                    errors: { mensaje: 'usuario no existe' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            //si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ';)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        });
    }

    if (tipo === 'iglesias') {

        Iglesias.findById(id, (err, iglesia) => {

            var pathViejo = './uploads/iglesias/' + iglesia.img;

            //si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            iglesia.img = nombreArchivo;

            iglesia.save((err, iglesiaActualizada) => {

                if (!iglesia) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'no existe iglesia',
                        errors: { mensaje: 'no iglesia' }
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de iglesia actualizada',
                    iglesia: iglesiaActualizada
                });
            });
        });
    }

    /*if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            var pathViejo = './uploads/hospitales/' + hospital.img;

            //si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {

                if (!hospital) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'no existe hospital',
                        errors: { mensaje: 'hospital no existe' }
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });
            });
        });
    }*/
}

module.exports = app;