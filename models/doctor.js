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
        
    },
    nacionality:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        required:true
    },
    timing:{
        type:Array, //
        required:true
    },
  
})
    // necesita 2 arg el 1° es como lo voy a llamar('tasks', serian las tareas del usuario, es como un array virtual)
    doctorSchema.virtual('turns',{// esto no es data guardada en db, es una relacion entre 2 entities
        ref:'Turn', // hago la referncia a la otra tabla...
        localField: '_id',  // es el id del usuario, que es lo que esta asociado a la Task
        foreignField: 'doctor' //  es el nombre de la propiedad en Task que hace la asociacion con User
    }) 
    
const Doctor = mongoose.model('Doctor',doctorSchema); 

module.exports = Doctor