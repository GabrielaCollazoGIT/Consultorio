const mongoose = require('mongoose');
const validator = require('validator');

const patientSchema = new mongoose.Schema({  // con el Schema tenemos acceso a utilizar middleware. para las paswoords
    name:{
        type:String,
        required:true,
        
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
    rol:{
        type:String,
        uppercase: true,
        default: "PATIENT" 
    },
    dni:{
            type:Number,
            required: true,
            unique:true
        },
    telephone:{
        type:Number,
        required: true
        },
    clinicalHistory:{
        type:String
    }
},{
    timestamps:true // es sirve para hacer un historico de cuando se crea el usuario y cuando es actualizado(createdAt,updatedAt)
})

const Patient = mongoose.model('Patient',patientSchema ); 

module.exports = Patient;