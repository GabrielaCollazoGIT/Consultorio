const bcrypt = require('bcryptjs'); //npm install --save bcryptjs // passwords encriptadas// hashPasswords
const jwt = require('jsonwebtoken'); //npm install --save jsonwebtoken // me genera un token para la password encryptada// la importo y por convencion empieza con mayuscula
const User = require('../models/user');
const HttpError = require('../middleweare/http-error'); 

const getUsers = async (request,response,next) =>{
    //llaves abiertas y - el campo no quiero ver quiero que me devuevla todo menos la contraseña
    let users;
    try {
    users = await User.find({},'-password -tokens');  

} catch (error) {
    console.log(error);
    const err = new HttpError('Fetching users failed, please try again later', 500);
        return next(err);
    }
    response.send(users);
}

const signUp = async (request,response,next) =>{

    const  {userName,email,password,rol} = request.body; 
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
        rol
    });
    console.log(createUser);

    
    let token;  
    try {
                                                           // el 2° argumento es la key privada(que solo el servido sabe)
    token = jwt.sign({userId: createUser.id,rol:createUser.rol, email: createUser.email},'SECRET_KEY',{expiresIn:'2h'} ); // devuelve un string q es el token, 1° argumento es el dato q quiero codificar en el token
        
    } catch (err) {
        
        const error = new HttpError('Signing up failded please try again, token error...',500);
        return next(error);
    }    
    createUser.tokens = createUser.tokens.concat({token}); 
    try {
        await createUser.save();
    } catch (err) {
        console.log(err);
        const error = new HttpError('Signing up failded please try again...',500);

        return next(error);// retornamos next() para parar la ejecucion del codigo en caso de que tengamos un error...
    }       
                      // esta es la respuesta que quiero devolver al frontEnd
    response.status(201).send({createUser,token});

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
    existingUser.tokens = existingUser.tokens.concat({token}); 
    try {
        await existingUser.save();
    } catch (err) {
        console.log(err);
        const error = new HttpError('Signing up failded please try again...',500);

        return next(error);// retornamos next() para parar la ejecucion del codigo en caso de que tengamos un error...
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
                                        // tengo que mapear el usuario a una propiedad, lo devuelvo en la respuesta para obtener el id y crear un place en el front
    response.json({userId: existingUser.id,rol:existingUser.rol, email:existingUser.email, token: token});

};


//este endpoint es para desloguarse y va a necesitar autenticacion para acerlo

const logout = async (request,response)=>{

    // necesito el token especifico para desloguearme, porqur puede ser que tenga mas de 1, cuando inicie sesion desde mi celular,tablet o pc
    // y no quiero desloguarme de todos ellos
   // console.log(request.userData.userId );
    console.log(request.userToken );
try {
    
    // como ya tengo acceso al usuario no tengo que hacer un fetch, lo tengo ya en la requesst
    // accedo al array de tokens
    console.log('en el logout controller   '+request.user);
    request.user.tokens = request.user.tokens.filter((token) => {
        //va a mandar true si no es igual y lo va a mantener en el array
        // va a mandar false si es igual, filtrandolo y eliminandolo
        return token.token !== request.userToken;
    })
    await request.user.save();
    response.send('Logging out....');
} catch (error) {
    console.log(error);
    response.status(500).send();
}

};

exports.signUp = signUp;
exports.login = login;
exports.logout = logout;
exports.getUsers = getUsers;


