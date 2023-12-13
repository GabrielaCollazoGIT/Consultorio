const { default: mongoose } = require("mongoose");
const User = require('../models/user');


/// ruta publica para hacer un usuario nuevo
const signup = async (request,response)=>{

    const user = new User(request.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        response.status(201).send({user,token});
    } catch (error) {
        return response.status(400).send(error);
    }

}



// es para logguerse con las credenciales correctas, es una ruta publica
// esto me va a devolver un token (JWT- JasonWebToken) de autenticacion
const login = async (request,response)=>{
    try {
        
        const user = await User.findByCredentials(request.body.email, request.body.password) // es un metodo personalizado para buscar por esos 2 atributos
        // esta funcion me va a devolver el token del usuario encontrado en la funcion de arriba
        const token = await user.generateAuthToken()
        // la respuesta va a ser restringida con este metodo oculto la password y lo que quiera que no se vea en la rta.
        //response.send({user: user.getPublicProfile(),token});

        // esta es la segunda forma
        response.send({user,token});

    } catch (error) {
        return response.status(400).send();
    }
}

exports.login = login;
exports.signup = signup;