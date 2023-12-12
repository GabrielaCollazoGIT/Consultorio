const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({  // con el Schema tenemos acceso a utilizar middleware. para las paswoords
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
            if(!value.toLowerCase().includes('password')){
                throw new Error( 'Password canot contain "password"');
            }
        }

    },
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }],
},{
    timestamps:true // es sierve para hacer un historico de cuando se crea el usuario y cuando es actualizado(createdAt,updatedAt)
})
                    // nos permite acceder a las propiedades, y es virtual porque no se cambia nada, es solo para saber sus relaciones
    // necesita 2 arg el 1° es como lo voy a llamar('tasks', serian las tareas del usuario, es como un array virtual)
userSchema.virtual('role',{// esto no es data guardada en db, es una relacion entre 2 entities
    ref:'Role', // hago la referncia a la otra tabla...
    localField: '_id',  // es el id del usuario, que es lo que esta asociado al rol
    foreignField: 'user' //  es el nombre de la propiedad en Role que hace la asociacion con User
}) 

////////////////////HASHH PASSWORD ANTES DE GUARDAR///////////////////
// pre hace algo antes, entonces el proposito es hacer algo antes de guardar al usuario
// el primer argumento es lo q determina q se debe hacer antes, el segundo es la funcion 
userSchema.pre('save', async function(next){ // siempre se llama a next cuando la funcion termina
    const user = this

    // es un metodo de mongoose para saber si la contraseña es la misma o la modifico
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8); // sobreescribo el valor de la antigua contraseña
    }

    console.log("despues de guardar al usuario");


    next(); // si no llamamos a next, se va a quedar estancado pensando que seguimos corriendo codigo despues que guardemos al usuario, 
    // y creyendo que nunca guaramos al usuario
})


const User = mongoose.model('User',userSchema ); 

module.exports = User