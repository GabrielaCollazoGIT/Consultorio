const express = require('express'); 
const doctorController = require('../controllers/doctor-controller');


const router = express.Router();

router.get('/',doctorController.getDoctors);

router.get('/:id',doctorController.getDoctorById);

//router.get('/:id',doctorController.getDoctorByIdAndTurnsAvailables);
                
router.post('/new', doctorController.createDoctor);

router.patch('/:id', doctorController.updateDoctor);  
                    


module.exports = router;

