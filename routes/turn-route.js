const express = require('express'); 
const turnController = require('../controllers/turn-controller');
const auth = require('../middleweare/check.auth');
const validateRol = require('../middleweare/validate.rol');

const router = express.Router();
router.use(auth);

//router.use(validateRol.userValidate);
router.get('/patient/cancelations',turnController.getCancelationsByUser); // turnos en estado cancelado...
router.get('/patient/turns/',turnController.getTurnsByPatiens); // ver si es la lista de turnos de todos los pacientes o la lista de ese paciente.
router.patch('/reserv/:id',validateRol.userValidate ,turnController.reservTurn); // reserva de turno, pasar datos del paciente y cambiar a estado reservado
router.patch('/cancel/:dni',validateRol.userValidate ,turnController.canceledTurn); // reserva de turno, pasar datos del paciente y cambiar a estado cancelado
router.get('/',turnController.getAllTurns);
router.get('/:id',turnController.getTurnById);


//router.use(validateRol.adminValidate);

router.get('/doctor/:id',validateRol.adminValidate,turnController.getTurnByDoctors);// ver turnos solo como admin, preguntar si es con las reservas hechas(creo q si)               
router.post('/new',validateRol.adminValidate,turnController.createTurn);// solo admin disponible en el sistema
router.patch('/:id',validateRol.adminValidate ,turnController.updateTurn); // solo admin  disponible en el sistema
router.delete('/:id',validateRol.adminValidate,turnController.deleteTurn); // solo admin
router.delete('/delete/:id',validateRol.adminValidate, turnController.deleteConfirmedTurn );
module.exports = router;