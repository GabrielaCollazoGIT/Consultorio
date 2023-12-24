const adminValidate = async (request, response, next) => {
    console.log(request.user);
    const {rol} = request.user;
    if(!request.user){
        return response.status(401).send({message: 'Invalid token'});
    }

    if(rol !== 'ADMIN') {
        return response.status(403).send({message: 'Forbidden access'});

    }
    next();
};

const userValidate = async (request, response, next) => {
    console.log(request.user);
    //const {rol} = request.user;
    if(!request.user){
        
        return response.status(401).send({message: 'Invalid token'});
    }
// if(rol !== 'USER'||rol !=='PATIENT') {
    if(rol !== 'USER') {
        return response.status(403).send({message: 'Forbidden access'});

    }
    next();
};
module.exports = {adminValidate, userValidate};