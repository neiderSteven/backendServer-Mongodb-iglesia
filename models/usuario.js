var moongose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = moongose.Schema;

var rolesValidos = {
    values:['ADMIN_ROLE', 'USER_ROLE'],
    message:'{VALUE} no es un rol permitido' 
}

var usuarioSchema = new Schema({

    nombre: {type:String, required: [true, 'el nombre es necesario']},
    email: {type:String, unique:true, required: [true, 'el correo es necesario']},
    password: {type:String, required: [true, 'la contraseña es necesario']},
    img: {type:String, required: false},
    role: {type:String, required: true, default:'USER_ROLE', enum: rolesValidos},
});

usuarioSchema.plugin(uniqueValidator, {message:'el {PATH} debe ser unico'});

module.exports = moongose.model('Usuario', usuarioSchema);