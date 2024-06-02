/* 
    Event Routes
    /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { validarJWT } = require('../middlewares/validar-jwt');
const { validarCampos } = require('../middlewares/validar-campos');
const { getEvento, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');

const router = Router();

// Todas tienen que pasar por la validacion del JWT

router.use( validarJWT ); // Cualquier peticion que se encuentre abajo de esto tendra que tener su token


// Obtener eventos
router.get('/', getEvento );

// Crear un nuevo evento
router.post(
    '/', 
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(), // Para make sure que siempre tenga informacion y no vacio
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalizacion es obligatoria').custom( isDate ),
        validarCampos
    ],
    crearEvento 
);

// Actualizar un evento
router.put('/:id', actualizarEvento );

// Eliminar un evento
router.delete('/:id', eliminarEvento );

module.exports = router;