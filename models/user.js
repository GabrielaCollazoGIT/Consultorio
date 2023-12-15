const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({  // con el Schema tenemos acceso a utilizar middleware. para las paswoords
    userName:{
        type:String,
        required:true,
        unique:true
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
    password:{
        type:String,
        required:true,
        minlength:7,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error( 'Password canot contain "password"');
            }
        }

    },
    rol:{
        type:String,
        required:true,
        uppercase: true,
    },
    dni:{
            type:Number,
            required: true
        }
},{
    timestamps:true // es sirve para hacer un historico de cuando se crea el usuario y cuando es actualizado(createdAt,updatedAt)
})

const User = mongoose.model('User',userSchema ); 

module.exports = User