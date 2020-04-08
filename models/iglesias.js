var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var iglesiaSchema = new Schema({

    id:{ type: String, required: false },
    nombre: { type: String, required: [true, 'el nombre es necesario'] },
    direccion: { type: String, required: [true, 'la direccion es necesaria'] },
    anciano: { type: String, required: [true, 'el nombre es necesario'] },
    telefono: { type: Number, required: [true, 'el numero es necesario'] },
    numeroMiembros: { type: Number, required: [true, 'el numero de miembros es necesario'] },
    img: { type: String, required: false },
    pastor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuarios', required: true
    }
});

module.exports = mongoose.model('Iglesias', iglesiaSchema);