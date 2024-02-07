const mongoose = require('mongoose');


const specialitySchema = new mongoose.Schema({  // con el Schema tenemos acceso a utilizar middleware. para las paswoords
    name:{
        type:String,
        required:true,
        uppercase:true,

    },
    description:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true
    }
})

const Speciality = mongoose.model('Speciality',specialitySchema); 

module.exports = Speciality