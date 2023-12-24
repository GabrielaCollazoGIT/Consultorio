const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const dbConfig = require('./config/dbConfig');
const specialityRoutes = require('./routes/speciality-route');
const doctorRoutes = require('./routes/doctor-route');
const userRoutes = require('./routes/user-route');
const turnRoutes = require('./routes/turn-route');
const patientRoutes = require('./routes/patient-route')
const HttpError = require('./middleweare/http-error');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/speciality',specialityRoutes);
app.use('/api/doctors',doctorRoutes);
app.use('/api/users',userRoutes);
app.use('/api/turns',turnRoutes);
app.use('/api/patient',patientRoutes);

app.use((err, req, res, next) => {
    if (err instanceof HttpError) {
        res.status(err.code).json({ error: err.message });
    } else {
    
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(5000);

/* mongoose.connect('mongodb+srv://consultorio:vortex1234@cluster0.k7wyhqz.mongodb.net/consultorio?retryWrites=true&w=majority')
.then(() =>{
    app.listen(5000);
})
.catch(err =>{
    console.log(err);
}); */







