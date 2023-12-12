const mongoose = require('mongoose');


const turnSchema = new mongoose.Schema({  // con el Schema tenemos acceso a utilizar middleware. para las paswoords
    date:{
        type:Date,
        required:true,
    },
doctor: { type: mongoose.Types.ObjectId, required:true, ref: 'Doctor'} 
})

const Turn = mongoose.model('Turn',turnSchema); 

module.exports = Turn

