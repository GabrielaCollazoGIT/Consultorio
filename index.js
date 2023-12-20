const express = require('express');
const mongoose = require('mongoose');
const specialityRoutes = require('./routes/speciality-route');
const doctorRoutes = require('./routes/doctor-route');
const userRoutes = require('./routes/user-route');
const turnRoutes = require('./routes/turn-route');
const HttpError = require('./middleweare/http-error');

const app = express();
app.use(express.json());


app.use('/api/speciality',specialityRoutes);
app.use('/api/doctors',doctorRoutes);
app.use('/api/users',userRoutes);
app.use('/api/turns',turnRoutes);

app.use((err, req, res, next) => {
    if (err instanceof HttpError) {
        res.status(err.code).json({ error: err.message });
    } else {
    
        res.status(500).json({ error: 'Internal server error' });
    }
});



mongoose.connect('mongodb+srv://consultorio:vortex1234@cluster0.k7wyhqz.mongodb.net/consultorio?retryWrites=true&w=majority')
.then(() =>{
    app.listen(5000);
})
.catch(err =>{
    console.log(err);
});







