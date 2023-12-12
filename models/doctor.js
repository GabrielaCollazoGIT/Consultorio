const mongoose = require('mongoose');
const validator = require('validator');



const doctorSchema = new mongoose.Schema({  // con el Schema tenemos acceso a utilizar middleware. para las paswoords
    name:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    dni:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error( ' Email is invalid');
            }
        }
    },
    speciality:[{
        type: mongoose.Types.ObjectId, required:true, ref: 'Speciality'
    }],
    telephone:{
        type:Number,
        required:true
    },
    nacionality:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        required:true
    },
    turns:[{
        type: mongoose.Types.ObjectId, required:true, ref: 'Turn'
    }],
})


const Doctor = mongoose.model('Doctor',doctorSchema); 

module.exports = Doctor