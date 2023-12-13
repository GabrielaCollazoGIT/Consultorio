const mongoose = require('mongoose');


const turnSchema = new mongoose.Schema({  
    date:{type:Date, required:true,},
    hour:{type:Date, required:true},
    disponible:{type:Boolean, required:true},
    speciality:{type:mongoose.Types.ObjectId, required:true, ref:'Speciality'},
    doctor: { type: mongoose.Types.ObjectId, required:true, ref: 'Doctor'}, 
    user:{type:mongoose.Types.ObjectId, required:true, ref:'User'}
})

const Turn = mongoose.model('Turn',turnSchema); 

module.exports = Turn

