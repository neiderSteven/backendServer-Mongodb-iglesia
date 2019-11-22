var moongose = require('mongoose');
var Schema = moongose.Schema;

var hospitalShema = new Schema({

    nombre: { type: String, required: [true, 'el nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, {
    collection: 'hospitales'
});

module.exports = moongose.model('Hospital', hospitalShema);