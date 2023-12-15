const HttpError = require('../middleweare/http-error'); 
//const {validationResult} = require('express-validator');
const Doctor = require('../models/doctor');
const Speciality = require('../models/speciality');
const Turn = require('../models/turns');





// ver turnos solo como admin, preguntar si es con las reservas hechas(creo q si)
const getTurnByDoctors  = async (request, response,next) => {

    let turnsByDoctor;
    const doctorId = request.params.id;
try {
    turnsByDoctor = await Turn.findOne({doctor: doctorId }).populate('doctor'); // accedo a la propiedad que tiene ese id asociado         //DUMMY_PLACES.filter( p => { // este me vaa devolver una array  filtrando por todos los lugares que se correspondan al userId
    console.log(turnsByDoctor);
} catch (error) {
    const err = new HttpError('Fetching turns failed, please try again later',500);
    return next(err);
}

    if(!turnsByDoctor){
       return next( new HttpError('Could not find  turns for the provided doctor',404));  // con el return me aseguro que el bloque de codigo que sigue no se ejecute...
    } // uso el next cuando es async

    response.send(turnsByDoctor);

};     


// solo admin disponible en el sistema 
const createTurn = async (request, response,next) => {
const {date,hour,doctor,speciality} = request.body

let doctorFind; 
try {
    doctorFind = await Doctor.findById(doctor); // accedemos a la propiedad de la categoria(el id), para saber si ya esta guardada en la bd(si existe ya)

} catch (error) {
    console.log(error);
    const err = new HttpError('Creating Turn failed, please try again',500);        
        return next(err); 
}

let specialityFind; 
try {
    specialityFind= await Speciality.findById(speciality); // accedemos a la propiedad de la categoria(el id), para saber si ya esta guardada en la bd(si existe ya)
    console.log(specialityFind);
} catch (error) {
    console.log(error);
    const err = new HttpError('Creating Turn failed, please try again',500);        
        return next(err); 
}
if(specialityFind !== doctorFind.speciality){
    const error = new HttpError('this Doctor don´t have that speciality, please choose another instead',422);
    return next(error);
}

let existingTurn;
    try {                           
        existingTurn = await Turn.findOne({doctor: doctor, date:date, hour:hour });
    
    } catch (error) {
        console.log(error);
        const err = new HttpError('failed, please try again later', 500);
        return next(err);
    }      
    
        if(existingTurn){
            const error = new HttpError('turn exist already, please choose another instead',422);
            return next(error);
        }

    

        
    const createTurn = new Turn({
        date,
        hour,
        status:"available",
        speciality:specialityFind,
        doctor:doctorFind

    });
    console.log(createTurn);
    try {
        await createTurn.save(); 
    } catch (err) {
        const error = new HttpError('Save turn failded please try again...',500);

        return next(error);
    }
                            
    response.status(201).send(createTurn);


};            
// solo admin  disponible en el sistema
const updateTurn = (request, response,next) => {
    
}; 

// solo admin
const deleteTurn = async (request, response,next) => { 
    const turnId = request.params.id
    try {
        await Turn.findByIdAndDelete(turnId);
        response.status(200).json("Deleted Turn");
    } catch (error) {

        response.status(500).json(error);
        
    }
}; 

// historial turnos en estado cancelado...
const getCancelationsByUser = (request, response,next) => {
    
};             

//  es  la lista de turnos de ese paciente.
const getTurnsByPatiens = (request, response,next) => {


};              

// reserva de turno, pasar datos del paciente y cambiar a estado reservado
const reservTurn  = (request, response,next) => {
    const {date,hour,speciality,doctor} = request.body
};              
// reserva de turno, pasar datos del paciente y cambiar a estado cancelado|
const canceledTurn  = (request, response,next) => {
    
};              



exports.getTurnByDoctors = getTurnByDoctors;
exports.createTurn = createTurn;
exports.updateTurn= updateTurn;
exports.deleteTurn= deleteTurn;
exports.getCancelationsByUser= getCancelationsByUser;
exports.getTurnsByPatiens= getTurnsByPatiens;
exports.reservTurn= reservTurn;
exports.canceledTurn= canceledTurn;
