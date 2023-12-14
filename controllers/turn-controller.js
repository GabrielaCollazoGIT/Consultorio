const HttpError = require('../middleweare/http-error'); 
//const {validationResult} = require('express-validator');
const Doctor = require('../models/doctor');
const Speciality = require('../models/speciality');




// ver turnos solo como admin, preguntar si es con las reservas hechas(creo q si)
const getTurnByDoctors  = (request, response,next) => {

};           
// solo admin disponible en el sistema 
const createTurn  = (request, response,next) => {
    
};            
// solo admin  disponible en el sistema
const updateTurn = (request, response,next) => {
    
}; 

// solo admin
const deleteTurn = (request, response,next) => { 
    
}; 

// historial turnos en estado cancelado...
const getCancelationsByUser = (request, response,next) => {
    
};             

//  es  la lista de turnos de ese paciente.
const getTurnsByPatiens = (request, response,next) => {
    
};              

// reserva de turno, pasar datos del paciente y cambiar a estado reservado
const reservTurn  = (request, response,next) => {
    
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
