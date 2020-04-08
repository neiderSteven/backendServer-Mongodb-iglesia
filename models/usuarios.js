var moongose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = moongose.Schema;

var cargosValidos = {
    values: ['PASTOR', 'SECRETARIO'],
    message: '{VALUE} no es un rol permitido'
}

var usuariosSchema = new Schema({

    nombre: { type: String, required: [true, 'el nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'el correo es necesario'] },
    password: { type: String, required: [true, 'la contraseña es necesario'] },
    telefono: { type: Number, required: [true, 'el telefono es necesario'] },
    distrito: { type: String, required: [true, 'el distrito es necesario'] },
    cargo: { type: String, default: 'PASTOR', enum: cargosValidos },
    img: { type: String, required: false },
    referencia: {
        type: Schema.Types.ObjectId,
        ref: 'Iglesias', required: false
    }
});

usuariosSchema.plugin(uniqueValidator, { message: 'el {PATH} debe ser unico' });

module.exports = moongose.model('Usuarios', usuariosSchema);