const mongoose = require('mongoose');


const historySchema = new mongoose.Schema({  
    speciality:{type:String, required:true},
    doctor: { type:String, required:true}, 
    dni:{type:String, require: true, default:undefined},
    date:{type:String, require:true},
    hour:{type:String, require:true},
    status: {type: String, default: "cancelled"},
},{
    timestamps:true 
})
const History = mongoose.model('History',historySchema); 

module.exports = History

