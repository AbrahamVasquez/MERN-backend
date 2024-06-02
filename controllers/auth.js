const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async( req, res = response ) => {

    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email: email });
        
        if ( user ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El user ya existe con ese correo'
            });
        }

        user = new User( req.body );

        // Encryptar contrasena
        const salt = bcrypt.genSaltSync();
        user.password =  bcrypt.hashSync( password, salt );
    
        await user.save();

        // Generar JWT
        const token = await generarJWT( user.id, user.name );
    
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: 'Por favor contacta a tu administrador',
            error
        })
    }
};

const loginUsuario = async( req, res = response ) => {

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El user no existe con ese email'
            });
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, user.password );

        if (!validPassword ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Wrong password'
            });
        }

        // Generar nuestro JWT (Jason Web Token)
        const token = await generarJWT( user.id, user.name );


        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            mensaje: 'Por favor contacta a tu administrador',
            error
        })
    }

}

const revalidarToken = async( req, res = response ) => {

    const uid = req.uid;
    const name = req.name;

    const token = await generarJWT( uid, name ); 

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}