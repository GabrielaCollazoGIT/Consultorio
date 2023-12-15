const adminValidate = async (request, response, next) => {
    const {rol} = request.user;
    if(!request.user){
        return response.status(500).send({message: 'Invalid token'});
    }

    if(rol !== 'ADMIN') {
        return response.status(403).send({message: 'Forbidden access'});

    }
    next();
};
module.exports = adminValidate;