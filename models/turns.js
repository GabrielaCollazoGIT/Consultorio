const mongoose = require('mongoose');


const turnSchema = new mongoose.Schema({  
    date:{type:Date, required:true,},
    hour:{type:String, required:true},
    speciality:{type:mongoose.Types.ObjectId, required:true, ref:'Speciality'},
    doctor: { type: mongoose.Types.ObjectId, required:true, ref: 'Doctor'}, 
   // user:{type:mongoose.Types.ObjectId, required:true, ref:'User'},
    dni:{type:String, require: true, default:undefined},
    //cancelations: [{ date: { type: Date, default: Date.now }, user:{type:String}, status:{type:String, default:"Cancelled"} }],
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

