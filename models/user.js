const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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
            if(!value.toLowerCase().includes('password')){
                throw new Error( 'Password canot contain "password"');
            }
        }

    },
    rol:{
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }],
},{
    timestamps:true // es sirve para hacer un historico de cuando se crea el usuario y cuando es actualizado(createdAt,updatedAt)
})
                    // nos permite acceder a las propiedades, y es virtual porque no se cambia nada, es solo para saber sus relaciones
    // necesita 2 arg el 1° es como lo voy a llamar('tasks', serian las tareas del usuario, es como un array virtual)
userSchema.virtual('role',{// esto no es data guardada en db, es una relacion entre 2 entities
    ref:'Role', // hago la referncia a la otra tabla...
    localField: '_id',  // es el id del usuario, que es lo que esta asociado al rol
    foreignField: 'user' //  es el nombre de la propiedad en Role que hace la asociacion con User
}) 



//------------------Metodo para genenrar un token para el login-------------------------
        // methods es accesible para las instancias
        userSchema.methods.generateAuthToken = async function(){
            const user = this;
                                    // es toString() xq el id es un objeto...!!! imp
            const token = jwt.sign({_id: user._id.toString()},'secret');
            user.tokens = user.tokens.concat({token}); // agrego el toquen al array
        
                await user.save(); // despues de generar el token lo guardo en la base de datos
            return token;
        }
        



//-------------- Este metodo es para encontrar un usuario por email y contraseña y usarlo en el router---------------
        // es estatico para acceder dieractamente al modulo una vez que tenga acceso
        userSchema.static.findByCredentials = async (email,password) =>{
            const user = await User.findOne({email})
    
            if(!user){
                throw new Error('Uneable to login');
            }
    
                const isMatch = await bcrypt.compare(password, user.password);
    
                if(!isMatch){
                    throw new Error('Uneable to login');
                }
        return user;
    
        }


const User = mongoose.model('User',userSchema ); 

module.exports = User