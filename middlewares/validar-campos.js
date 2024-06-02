const { response } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = ( req, res = response, next ) => {

    const errors = validationResult( req );
    if ( !errors.isEmpty() ) { // Si hay errores haz esto...
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });  
    }

    next(); // Si no hay errores haz esto...
}

    module.exports = {
        validarCampos
    }
