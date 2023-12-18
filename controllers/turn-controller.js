const HttpError = require('../middleweare/http-error'); 
//const {validationResult} = require('express-validator');
const Doctor = require('../models/doctor');
const Speciality = require('../models/speciality');
const Turn = require('../models/turns');



//GET TURNS BY DOCTOR ID... OK

// ver turnos solo como admin, preguntar si es con las reservas hechas(creo q si)
const getTurnByDoctors  = async (request, response,next) => {

    const doctorId = request.params.id;
    let turnsByDoctor;
try {
    turnsByDoctor = await Turn.find({doctor: doctorId });
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

//CREATE TURN---- FALTA
// solo admin disponible en el sistema  /// estudiar bien el tema de las fechas y horas...
const createTurn = async (request, response,next) => {
const {date,hour,doctor,speciality,dni} = request.body

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

doctorFind.speciality.forEach(speciality =>{
    if(specialityFind._id.toString() !== speciality._id.toString()){
        console.log('speciality._id'+speciality._id.toString());
        console.log('specialityfind_id'+specialityFind._id);
        const error = new HttpError('this Doctor don´t have that speciality, please choose another instead',422);
        return next(error);
    }
});

/* let existingTurn;
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
        } */

    

        
    const createTurn = new Turn({
        date,
        hour,
        speciality:specialityFind,
        doctor:doctorFind,
        dni
    

    });
    console.log(createTurn);
    try {
        await createTurn.save(); 
    } catch (err) {
        console.log(err);
        const error = new HttpError('Save turn failded please try again...',500);

        return next(error);
    }
                            
    response.status(201).send(createTurn);


};    
// UPDATE TURN --- FALTA        
// solo admin  disponible en el sistema
const updateTurn = async (request, response,next) => {
    try {
        const updatedTurn = await Turn.findByIdAndUpdate(
            request.params.id,
            {$set: request.body},
            {new: true}
        );
        response.status(200).json(updatedTurn);
    } catch (error) {
        console.log(error);
        next(error);
    }
}; 

// DELETE TURN --OK
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

// HISTORIAL TURNOS CANCELADOS---
// historial turnos en estado cancelado...
const getCancelationsByUser = async (request, response,next) => {
    const {dni} = request.body;
    let canceledTurns;
try {
    canceledTurns = await Turn.find({dni: dni,status:"cancelled" }).populate('doctor');
    console.log(canceledTurns);
} catch (error) {
    const err = new HttpError('Fetching turns failed, please try again later',500);
    return next(err);
}

    if(!canceledTurns){
       return next( new HttpError('Could not find cancelled turns for the provided patient',404));  // con el return me aseguro que el bloque de codigo que sigue no se ejecute...
    } // uso el next cuando es async

    response.status(200).send(canceledTurns);
    
};             

// TURNOS DEL PACIENTE--- 
//  es  la lista de turnos de ese paciente.
const getTurnsByPatiens = async (request, response,next) => {
    const {dni} = request.body;
    let turns;
try {
    turns = await Turn.find({dni: dni, status:"confirmed"}).populate('doctor');
    console.log(turns);
} catch (error) {
    const err = new HttpError('Fetching turns failed, please try again later',500);
    return next(err);
}

    if(!turns){
       return next( new HttpError('Could not find  turns for the provided patient',404));  // con el return me aseguro que el bloque de codigo que sigue no se ejecute...
    } // uso el next cuando es async

    response.status(200).send(turns);

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
