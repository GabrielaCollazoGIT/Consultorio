const bcrypt = require('bcryptjs'); //npm install --save bcryptjs // passwords encriptadas// hashPasswords
const jwt = require('jsonwebtoken'); //npm install --save jsonwebtoken // me genera un token para la password encryptada// la importo y por convencion empieza con mayuscula
const User = require('../models/user');
const HttpError = require('../middleweare/http-error'); 

const getUsers = async (request,response,next) =>{
    //llaves abiertas y - el campo no quiero ver quiero que me devuevla todo menos la contraseña
    let users;
    try {
    users = await User.find({},'-password');  

} catch (error) {
    console.log(error);
    const err = new HttpError('Fetching users failed, please try again later', 500);
        return next(err);
    }
    response.send(users);
}

const signUp = async (request,response,next) =>{

    const  {userName,email,password,rol,dni} = request.body; 
let existingUser;

    try {                           
        existingUser = await User.findOne({email: email})    
    } catch (error) {
        const err = new HttpError('Signing up failed, please try again later', 500);
        return next(err);
    }      
    
        if(existingUser){
            const error = new HttpError('User exist already, please loging instead',422);
            return next(error);
        }
        
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password,8);

    } catch (err) {
        const error = new HttpError('Could not create User, please try again',500);
        return next(error);
    }
    const createUser = new User({
        userName,
        email,
        password: hashedPassword, // guardamos encriptada
        rol,
        dni
    });
    console.log(createUser);

    try {
        await createUser.save();
    } catch (err) {
        console.log(err);
        const error = new HttpError('Signing up failded please try again...',500);

        return next(error);// retornamos next() para parar la ejecucion del codigo en caso de que tengamos un error...
    }       
                      // esta es la respuesta que quiero devolver al frontEnd
    response.status(201).send({createUser});

};


const login = async (request,response,next) =>{
    const {email,password} = request.body; 

    let existingUser;

    try {                           
        existingUser = await User.findOne({email: email})    
    } catch (error) {                                                                       //const userAutentication = DUMMY_USERS.find(u =>u.email === email);
        const err = new HttpError('Loggin in failed, please try again later.', 500);
        return next(err);                                                                                  // if(!userAutentication || userAutentication.password !== password){
                                                                       //   throw new HttpError('Could identidy user, credentials seem to be wrong',401);// 401 autentication faild
    }                                                                                         // }
    if(!existingUser){
        const err = new HttpError('Invalid credentials, could not log you in.', 403);
        return next(err);
    }

    
let isValidPassword = false;
try {
    isValidPassword = await bcrypt.compare(password, existingUser.password); // comparamos la password de la request{que va asi}, con la del la base de datos q esta encriptada.       
} catch (error) {
    const err = new HttpError('Could not log you in, please check your credentiales and try again.', 500);
    return next(err);
}
    if(!isValidPassword){
        const err = new HttpError('Invalid User or Password, could not log you in.', 401);
        return next(err);
    }

    let token;  
    try {
                    // payload                                       // el 2° argumento es la key privada(que solo el servidor sabe), usar ma misma key, sino se generaran diferentes tokens
    token = jwt.sign({userId: existingUser.id,rol:existingUser.rol, email: existingUser.email},'SECRET_KEY',{expiresIn:'2h'} ); // devuelve un string q es el token, 1° argumento es el dato q quiero codificar en el token
        console.log(token);
    } catch (err) {
        console.log(err);
        const error = new HttpError('Login failded please try again, token error...',500);
        return next(error);
    } 

                                        // tengo que mapear el usuario a una propiedad, lo devuelvo en la respuesta para obtener el id y crear un place en el front
    response.json({userId: existingUser.id,rol:existingUser.rol, email:existingUser.email, token: token});

};



exports.signUp = signUp;
exports.login = login;
exports.getUsers = getUsers;


