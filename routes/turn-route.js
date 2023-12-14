const express = require('express'); 
const turnController = require('../controllers/turn-controller');
const auth = require('../middleweare/check.auth');
const validateRol = require('../middleweare/validate.rol');

const router = express.Router();

router.get('/:id',turnController.getCancelationsByUser); // turnos en estado cancelado...

router.get('/patient',turnController.getTurnsByPatiens); // ver si es la lista de turnos de todos los pacientes o la lista de ese paciente.

router.patch('/patient/turn/:id', turnController.reservTurn); // reserva de turno, pasar datos del paciente y cambiar a estado reservado

router.patch('/patient/turn/:id', turnController.canceledTurn); // reserva de turno, pasar datos del paciente y cambiar a estado cancelado

router.use(auth);
router.use(validateRol);
router.get('/doctor/:id',turnController.getTurnByDoctors);// ver turnos solo como admin, preguntar si es con las reservas hechas(creo q si)
                
router.post('/new', turnController.createTurn);// solo admin disponible en el sistema

router.patch('/:id', turnController.updateTurn); // solo admin  disponible en el sistema

router.delete('/:id',turnController.deleteTurn); // solo admin
module.exports = router;