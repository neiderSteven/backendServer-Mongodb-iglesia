var moongose = require('mongoose');
var Schema = moongose.Schema;

var visitasSchema = new Schema({

    nombre: { type: String, required: [true, 'el nombre es necesario'] },
    telefono: { type: String, required: [true, 'el telefono es necesario'] },
    direccion: { type: String, required: [true, 'la direccion es necesario'] },
    estudios: { type: Number, required: [true, 'los estudios son necesario'] },
    bautizada: { type: String, required: [true, 'el estado de bautizmo es necesario'] },
    iglesia: {
        type: Schema.Types.ObjectId,
        ref: 'Iglesias', required: false
    }
});

module.exports = moongose.model('Visitas', visitasSchema);