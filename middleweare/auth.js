const jwt = require('jsonwebtoken');
const User = require('../models/user');


const auth = async (request,response,next) =>{ // middleware
    try {
        // vamos a validaR  al usuario aca          como el token viene con la primera parte('Bearer) la reemplazamos con comillas simples
        const token = request.header('Authorization').replace('Bearer',''); // le paso el nombre exacto de la key del header;
        // Esta variable es para decodificar el token y ver si es valido
        const decoded = jwt.verify(token, 'secret'); // es el body decodificado del token // tengo que pasarle el mismo secret que declare en el model
        // si el token es valido lo busco en la base de datos, decoded tiene el id del usuario
        const user = await User.findOne({_id: decoded._id, 'tokens.token':token}); // si el usuario se desloguea este token es valido
        // tambien queremos verificar que el token es parte del tokens array, esto busca un token que machee en el array de tokens

        if(!user){
            throw new Error(); // va al catch....
        }
        // todos las rutas van a poder accedeer a el
        request.token = token;

        // LE damamos acceso a las rutas al usuario que encontramos en la db, como ya lo encontramos no es necesario que las rutas lo busquen nuevamente
        request.user = user; // asi el usuario es mismo para todas las rutas
        next(); // vamos a colocar que se sigan ejecutnado las rutas ya que el usuario esta correctamente authenticado
    } catch (error) {
        // enviamos un mensaje de respuesta con error de authenticacion(401)
        response.status(401).send({error: 'Please authenticate'});
    }
    next();
}

module.exports = auth


