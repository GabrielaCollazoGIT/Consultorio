const express = require('express');
const mongoose = require('mongoose');
const specialityRoutes = require('./routes/speciality-route');
const doctorRoutes = require('./routes/doctor-route');

const app = express();
app.use(express.json());

app.use('/api/speciality',specialityRoutes);
app.use('/api/doctor',doctorRoutes);


mongoose.connect('mongodb+srv://consultorio:vortex1234@cluster0.k7wyhqz.mongodb.net/consultorio?retryWrites=true&w=majority')
.then(() =>{
    app.listen(5000);
})
.catch(err =>{
    console.log(err);
});







