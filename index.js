const express = require('express');
const mongoose = require('mongoose');



const app = express();
app.use(express.json());





mongoose.connect('mongodb+srv://consultorio:vortex1234@cluster0.k7wyhqz.mongodb.net/consultorioretryWrites=true&w=majority')
.then(() =>{
    app.listen(5000);
})
.catch(err =>{
    console.log(err);
});







