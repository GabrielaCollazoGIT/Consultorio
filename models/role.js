const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({  // con el Schema tenemos acceso a utilizar middleware. para las paswoords
    name:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId, // esto me dice que lo que guardo en owner es un objectId
        required:true,
        ref: 'User'// referencia de este campo con otro modelo, es decir a la Tabla User, tiene que ser el mismo nombre con el que lo exportamos
    }
})

const Role = mongoose.model('Role',roleSchema); 

module.exports = Role