const express = require('express'); 
const {check} = require('express-validator');
const specialityController = require('../controllers/speciality-controller');

const router = express.Router();

router.get('/',specialityController.getSpecialities);

router.get('/:id',specialityController.getSpecialityById);
                
router.post('/new', specialityController.createSpeciality);

router.put('/:id', specialityController.updateSpeciality);  
                    
router.delete('/:id',specialityController.deleteSpeciality);


module.exports = router;