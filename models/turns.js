const mongoose = require('mongoose');


const turnSchema = new mongoose.Schema({  
    date:{type:Date, required:true,},
    hour:{type:Date, required:true},
    speciality:{type:mongoose.Types.ObjectId, required:true, ref:'Speciality'},
    doctor: { type: mongoose.Types.ObjectId, required:true, ref: 'Doctor'}, 
   // user:{type:mongoose.Types.ObjectId, required:true, ref:'User'},
    dni:{type:Number, required:false},
    status: {
        type: String,
        enum: [
            "available",
            "confirmed",
            "pending",
            "served",
            "cancelled",
            
            ],
            default: "available",
        },
},{
    timestamps:true // es sirve para hacer un historico de cuando se crea  y cuando es actualizado(createdAt,updatedAt)
})

const Turn = mongoose.model('Turn',turnSchema); 

module.exports = Turn

