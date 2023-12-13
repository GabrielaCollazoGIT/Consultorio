const { default: mongoose } = require("mongoose");
const HttpError = require('../middleweare/http-error'); 
const {validationResult} = require('express-validator');
const Doctor = require('../models/doctor');
const Speciality = require('../models/speciality');

///// ALL Doctors//// chek
const getDoctors = async (request,response,next) =>{
    let doctors;
    try {
        doctors = await Doctor.find().populate('speciality');      
    
} catch (error) {

    const err = new HttpError('Find Doctors failed, please try again later', 500);
    console.log(error);    
    return next(err);
    }
    response.send(doctors);
}
///// doctor BY Id
const getDoctorById = async (request,response,next) =>{
    const doctorId = request.params.id;

    let doctor;                        
        try {
            doctor = await Doctor.findById(doctorId).populate('speciality');
            
        } catch (error) {
            const err = new HttpError('Something went wrong, couldn´t not find a doctor', 500);
            return next(err);
        }
    if(!doctor){
        const error = new HttpError('Could not find a doctor for the provided id',404); 
        return next(error); 
    }

                    // convierto a javascript object y agrego getters, porque mongoose tiene metodos geters para acceder al id, como un string sin el _id                                                               // si el nombre de la variable es igua al de la propiedad lo invoco directamente {place} =>{place:place}       //.Json lo manda a los headers  como Content-Type: application/json
    response.send(doctor); 

};
////// Create doctor
const createDoctor = async (request,response,next) =>{

    const  {name,lastname,dni,email,telephone,nacionality,speciality} = request.body;  
let existingDoctor;

let specialityFind; 
try {
    specialityFind= await Speciality.findById(speciality); // accedemos a la propiedad de la categoria(el id), para saber si ya esta guardada en la bd(si existe ya)

} catch (error) {
    console.log(error);
    const err = new HttpError('Creating doctor failed, please try again',500);        
        return next(err); 
}

    try {                           
        existingDoctor = await Doctor.findOne({dni: dni});
    } catch (error) {
        const err = new HttpError('failed, please try again later', 500);
        return next(err);
    }      
    
        if(existingDoctor){
            const error = new HttpError('doctor exist already, please choose another instead',422);
            return next(error);
        }
        
    const createDoctor = new Doctor({
        name,
        lastname,
        dni,
        email,
        telephone,
        nacionality,
        speciality:specialityFind,
        active:true

    });
    console.log(createDoctor);
    try {
        await createDoctor.save(); 
    } catch (err) {
        const error = new HttpError('Save doctor failded please try again...',500);

        return next(error);
    }
                            
    response.status(201).send(createDoctor);
};
/// Update doctor

const updateDoctor = async (request,response,next) =>{
    
    
    console.log('request in Update');

    const doctorId = request.params.id;
    console.log(doctorId);
    const {email,telephone,speciality}= request.body;

let specialityFind;

try {
    specialityFind= await Speciality.findById(speciality);

} catch (error) {
    console.log(error);
    const err = new HttpError('Updating doctor failed, please try again',500);        
        return next(err); 
}

    let doctor;                                               
        try {
            doctor = await Doctor.findById(doctorId).populate('speciality');  
            } catch (error) {
                console.log(error);
            const err = new HttpError('Something went wrong, could not update doctor',500);        
            return next(err);    
        }                                
        doctor.email = email;
        doctor.telephone = telephone;
        doctor.speciality.push(specialityFind);
                        
    try {
        await doctor.save();
    } catch (error) {
        console.log(error);
        const err = new HttpError('Something went wrong, could not update doctor',500);        
            return next(err); 
    }
  
    response.status(200).send(doctor);
};


exports.getDoctors = getDoctors;
exports.getDoctorById = getDoctorById;
exports.createDoctor= createDoctor;
exports.updateDoctor= updateDoctor;
