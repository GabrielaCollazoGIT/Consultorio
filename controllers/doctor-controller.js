//const { default: mongoose } = require("mongoose");
const HttpError = require('../middleweare/http-error'); 
//const {validationResult} = require('express-validator');

const Doctor = require('../models/doctor');
const Speciality = require('../models/speciality');
const Turn = require('../models/turns');

///// ALL Doctors//// chek
const getDoctors = async (request,response,next) =>{
    let doctors;
    try {   
        doctors = await Doctor.find().populate({
            path: 'speciality',
            select: '-_id -description -__v'
        }).limit(request.query.limit);       
    
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
            doctor = await Doctor.findById(doctorId).populate({
                path: 'speciality',
                select: '-_id -description -__v'
            });
            
        } catch (error) {
            console.log(error);
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
                                                    //timing
    const  {name,lastname,dni,email,telephone,nacionality,speciality,timing} = request.body;  
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
            const error = new HttpError('doctor exist already, please choose another instead',409);
            return next(error);
        }
        
    const createDoctor = new Doctor({
        name,
        lastname,
        dni,
        email,
        telephone,
        nacionality,
        image,
        speciality:specialityFind,
        //timing, es un array con la franja horaria disponible
        timing,
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
    const { email, telephone, speciality } = request.body;

    try {
    const specialityFind = await Speciality.findById(speciality);

    let doctor = await Doctor.findById(doctorId).lean();

    if (!doctor) {
        const err = new HttpError('Doctor not found', 404);
        return next(err);
    }

    doctor.email = email;
    doctor.telephone = telephone;
    doctor.image = image

    if (doctor.speciality.some((s) => s._id.toString() === specialityFind.id)) {
        const err = new HttpError('The Speciality already is saved in this Doctor, please try another', 409);
        return next(err);
    }

    doctor.speciality.push(specialityFind);

      await Doctor.findByIdAndUpdate(doctorId, { $set: doctor }); // Actualizar el doctor

    response.status(200).send(doctor);
    } catch (error) {
    console.log(error);
    const err = new HttpError('Something went wrong, could not update doctor', 500);
    return next(err);
    }

};
/// ver de que envie solo nombre, apellido y especialidad del medico
const getDoctorByIdAndTurnsAvailables = async (request,response,next) =>{
    const doctorId = request.params.id;

    let turns;                        
        try {
            turns = await Turn.find({doctor:doctorId, status:"available"}).populate({
                path: 'doctor',
                select: '-_id -dni -email -speciality -telephone -nacionality -active -timing'
            }).sort({ date: -1 , hour: 1}).limit(request.query.limit);
            
        } catch (error) {
            const err = new HttpError('Something went wrong, couldn´t not find a turns', 500);
            return next(err);
        }
    if(!turns|| turns.length === 0){
        const error = new HttpError('Could not find a turns for the provided id',404); 
        return next(error); 
    }

                    // convierto a javascript object y agrego getters, porque mongoose tiene metodos geters para acceder al id, como un string sin el _id                                                               // si el nombre de la variable es igua al de la propiedad lo invoco directamente {place} =>{place:place}       //.Json lo manda a los headers  como Content-Type: application/json
    response.send(turns); 
};

exports.getDoctors = getDoctors;
exports.getDoctorById = getDoctorById;
exports.createDoctor= createDoctor;
exports.updateDoctor= updateDoctor;
exports.getDoctorByIdAndTurnsAvailables = getDoctorByIdAndTurnsAvailables;
