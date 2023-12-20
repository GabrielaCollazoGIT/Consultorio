const bcrypt = require('bcryptjs'); //npm install --save bcryptjs // passwords encriptadas// hashPasswords
const jwt = require('jsonwebtoken'); //npm install --save jsonwebtoken // me genera un token para la password encryptada// la importo y por convencion empieza con mayuscula
const User = require('../models/user');
const HttpError = require('../middleweare/http-error');
const nodemailer = require('nodemailer'); 

const getUsers = async (request,response,next) =>{
    //llaves abiertas y - el campo no quiero ver quiero que me devuevla todo menos la contraseña
    let users;
    try {
    users = await User.find({},'-password').limit(request.query.limit);  

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
    response.status(201).json(createUser);

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

    response.status(200).json({userId: existingUser.id,rol:existingUser.rol, email:existingUser.email, token: token});

};

const forgotPassword = async (request,response,next) => {

    const { email } = request.body;

        try {
    
        const user = await User.findOne({ email });
    
        if (!user) {
            return res.status(404).json({ message: 'User not fount' });
        }
    
        const resetToken = jwt.sign({ userId: user._id }, 'SECRET_KEY', { expiresIn: '1h' });
    
        const transporter = nodemailer.createTransport({
            service: 'hotmail',
            auth: {   
                user: 'vortex_envio@hotmail.com',
                pass: 'vortex632056'
                }
            });

        const resetLink = `http://localhost:5000/api/users/new-password/${resetToken}`;
        const mailOptions = {
        from: 'vortex_envio@hotmail.com',
        to: email,
        subject: 'Password recovery',
        text: `Click in this link for reset your password: ${resetLink}`,
        html: `Click <a href="${resetLink}">here</a> for reset your password.`
        };
    
        await transporter.sendMail(mailOptions);
    
        response.status(200).json({ message: 'Check your email for a link to reset your password', link:resetLink});
        } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Internal server error'});
        }
    };
    





const recoveryPassword = async (request,response,next) => {

    const { newPassword , confirmPassword } = request.body;
    const resetToken = request.headers.reset;

    if(!(resetToken && newPassword && confirmPassword)){
        response.status(400).json({message:'All fields are required'});
    }

    const decodedToken = jwt.verify(resetToken, 'SECRET_KEY');
        try {
        
        // Verificar el token
        const user = await User.findById(decodedToken.userId);
    
        if (!user) {
            return response.status(404).json({ message: 'User not fount' });
        }
    
        if(newPassword !== confirmPassword){
            return response.status(404).json({ message: 'error... the passwords don´t match' });
        }
        // Actualizar la contraseña y responder con éxito
        user.password = await bcrypt.hash(newPassword, 8);
        await user.save();
    
        response.status(200).json({ message: 'reset password succefully...' });
        } catch (error) {
        console.error(error + 'aca sera el error?');
        response.status(500).json({ message: 'Error interno del servidor' });
        }
};




exports.signUp = signUp;
exports.login = login;
exports.forgotPassword = forgotPassword;
exports.recoveryPassword = recoveryPassword;
exports.getUsers = getUsers;


