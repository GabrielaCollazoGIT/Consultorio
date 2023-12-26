const HttpError = require('../middleweare/http-error');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (request, response, next) => {

    if(request.method === 'OPTIONS'){
        return next(); // // esto es para que el flujo siga, y no se detenga
    }
    let token
    try {        
        console.log(request.headers.reset);
        if(request.headers.reset){
            token = request.headers.reset;
        }else{
            console.log(request.headers.authorization);                                 // usamos el split para separar lo que viene en el array, separado por el espacio, el barer y el token, y accedemos al segundo elemento [1]
            token = request.headers.authorization.split(' ')[1]; // en el Cors los aceptamos, accedemos a extraer datos y obtenemos el token ... Authorization : 'Bearer TOKEN' 
        }
    

    if(!token){
        throw new Error('Authentication falied!'); 
    }
            //payload
    const decodedToken = jwt.verify(token,process.env.SECRET_KEY);//verificamos el token, 1° argumento el token de la request y el segundo el exacto token que le puse al controller de user ('supersecret_dont_share)
            // el decodedToken tiene el userId, el email y el rol
            //request.userData = {userId: decodedToken.userId, }
            // es el usuario que genero el turno, y esta autencado, y me lo devuelven los haders 
            const user = await User.findOne({_id: decodedToken.userId}); 
            console.log('aca es el undefinded?... en chech uth'+user);
            // esta info es para las rutas que siguen el flujo y necesitan esta info
            request.userToken = token 
            request.user = user;
            
            next();// lo agrego para que  continue con el trayecto y vayan a otras rutas cdonde requieren autentication
} catch (err) {
    console.log(err);
        const error = new HttpError('Authetication failed, no token....', 401);
        return next(error);
        }
    
};

module.exports = auth;