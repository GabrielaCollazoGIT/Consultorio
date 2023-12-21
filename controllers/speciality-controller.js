const { default: mongoose } = require("mongoose");
const HttpError = require('../middleweare/http-error'); 
const Speciality = require('../models/speciality');


///// ALL speciality//// chek
const getSpecialities = async (request,response,next) =>{
    let specialities;
    try {
        specialities = await Speciality.find().limit(request.query.limit);;      
    
} catch (error) {

    const err = new HttpError('Find Specialities failed, please try again later', 500);
        return next(err);
    }

    if(!specialities|| specialities.length === 0){
        const error = new HttpError('Could not find any Speciality',404); 
        return next(error); 
    }

    response.status(200).json(specialities);
}
///// speciality BY Id
const getSpecialityById = async (request,response,next) =>{
    const specialityId = request.params.id;

    let speciality;                        
        try {
            speciality = await Speciality.findById(specialityId);
            
        } catch (error) {
            const err = new HttpError('Something went wrong, couldn´t not find a Speciality', 500);
            return next(err);
        }
    if(!speciality){
        const error = new HttpError('Could not find a speciality for the provided id',404); 
        return next(error); 
    }

    response.status(200).json(speciality); 

};
////// Create speciality
const createSpeciality = async (request,response,next) =>{

    const  {name,description} = request.body;  
let existingSpeciality;

    try {                           
        existingSpeciality = await Speciality.findOne({name: name.toUpperCase()});
        console.log(existingSpeciality+'ver si machea x nombre')
    } catch (error) {
        const err = new HttpError('failed, please try again later', 500);
        return next(err);
    }      
    
        if(existingSpeciality){
            const error = new HttpError('Speciality exist already, please choose another instead',422);
            return next(error);
        }
        
    const createSpeciality = new Speciality({
        name,
        description

    });
    console.log(createSpeciality);
    try {
        await createSpeciality.save(); 
    } catch (err) {
        const error = new HttpError('Save Speciality failded please try again...',500);

        return next(error);
    }
                            
    response.status(201).json({speciality: createSpeciality});
};
/// Update speciality

const updateSpeciality = async (request,response,next) =>{

    console.log('request in Update');

    const specialityId = request.params.id;
    console.log(specialityId);
    const { description, name} = request.body;
    
    let speciality;                                               
        try {
            speciality = await Speciality.findById(specialityId);  
            } catch (error) {
                console.log(error);
            const err = new HttpError('Something went wrong, could not update speciality',500);        
            return next(err);    
        }                                

        speciality.name = name;
        speciality.description = description;
                                                

    try {
        await speciality.save();
    } catch (error) {
        console.log(error);
        const err = new HttpError('Something went wrong, could not update speciality',500);        
            return next(err); 
    }
    response.status(200).json(speciality);
};
/////// Delete speciality
const deleteSpeciality = async (request,response,next) =>{
    const specialityId = request.params.id;


    let speciality;                                    
    try {                                           
        speciality = await Speciality.findById(specialityId)

    } catch (error) {
        const err = new HttpError('Something went wrong, could not delete speciality',500);        
            return next(err); 
    } 

    if(!speciality){
        const err = new HttpError('Could not find speciality for this id',404);        
        return next(err);
    }


    try {
        await speciality.deleteOne();
        
    } catch (error) {
        const err = new HttpError('Something went wrong, could not delete speciality',500);        
        return next(err); 
    }        
    response.status(200).json({message:'Deleted speciality...'});
}

exports.getSpecialities = getSpecialities;
exports.getSpecialityById = getSpecialityById;
exports.createSpeciality= createSpeciality;
exports.updateSpeciality= updateSpeciality;
exports.deleteSpeciality= deleteSpeciality;
