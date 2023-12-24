
const HttpError = require('../middleweare/http-error'); 
const Patient = require('../models/patient');


///// ALL Patient//// chek
const getPatients = async (request,response,next) =>{
    let patients;
    try {
        patients = await Patient.find().limit(request.query.limit);;      
    
} catch (error) {

    const err = new HttpError('Find Patients failed, please try again later', 500);
        return next(err);
    }

    if(!patients|| patients.length === 0){
        const error = new HttpError('Could not find any Patient',404); 
        return next(error); 
    }

    response.status(200).json(patients);
}
///// Patient BY Id
const getPatientById = async (request,response,next) =>{
    const patientId = request.params.id;

    let patient;                        
        try {
            patient = await Patient.findById(patientId);
            
        } catch (error) {
            const err = new HttpError('Something went wrong, couldn´t not find a Patient', 500);
            return next(err);
        }
    if(!patient){
        const error = new HttpError('Could not find a Patient for the provided id',404); 
        return next(error); 
    }

    response.status(200).json(patient); 

};
////// Create Patient
const createPatient = async (request,response,next) =>{


    const  {name,email,dni,telephone} = request.body;  
let existingPatient;

    try {                           
        existingPatient = await Patient.findOne({dni: dni});
        console.log(existingPatient+'ver si machea x nombre')
    } catch (error) {
        const err = new HttpError('failed, please try again later', 500);
        return next(err);
    }      
    
        if(existingPatient){
            const error = new HttpError('Patient exist already, please choose another instead',422);
            return next(error);
        }
        
    const createPatient = new Patient({
        
        name,
        email,
        dni,
        telephone

    });
    console.log(createPatient);
    try {
        await createPatient.save(); 
    } catch (err) {
        const error = new HttpError('Save Patient failded please try again...',500);

        return next(error);
    }
                            
    response.status(201).json({patient: createPatient});
};
/// Update Patient

const updatePatient = async (request,response,next) =>{

    console.log('request in Update');

    const patientId = request.params.id;
    console.log(patientId);
    const  {name,email,dni,telephone} = request.body;  
    
    let patient;                                               
        try {
            patient = await Patient.findById(patientId);  
            } catch (error) {
                console.log(error);
            const err = new HttpError('Something went wrong, could not update Patient',500);        
            return next(err);    
        }                                

        patient.name = name;
        patient.email=email;
        patient.dni = dni;
        patient.telephone = telephone;
    
    try {
        await patient.save();
    } catch (error) {
        console.log(error);
        const err = new HttpError('Something went wrong, could not update Patient',500);        
            return next(err); 
    }
    response.status(200).json(patient);
};
/////// Delete Patient
const deletePatient = async (request,response,next) =>{
    const patientId = request.params.id;

    let patient;                                    
    try {                                           
        patient = await Patient.findOneAndDelete(patientId)
        response.status(200).json({message:'Deleted Patient...'});
    } catch (error) {
        const err = new HttpError('Something went wrong, could not delete Patient',500);        
            return next(err); 
    } 
}

exports.getPatients = getPatients;
exports.getPatientById = getPatientById;
exports.createPatient= createPatient;
exports.updatePatient= updatePatient;
exports.deletePatient= deletePatient;
