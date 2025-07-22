const express = require('express')
const { expressjwt: expressJwt } = require('express-jwt')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// Contraseña inicial ya hasheada
const initialPassword = bcrypt.hashSync('chanchitoFeliz', 10)

let users = [
    {
        id: 1,
        name: 'Oscar',
        email: 'opalma@dev.com',
        password: initialPassword
    }
]

const secret_key = 'MI_CLAVE_SECRETA'

// Middleware para validar el token JWT
const validateJwt = expressJwt({ secret: secret_key, algorithms: ['HS256'] })

// Genera el token firmado
const signToken = _id => jwt.sign({ _id }, secret_key, { expiresIn: '1h' })

// Asigna el usuario al request si el token es válido
const findAndAssignUser = (req, res, next) => {
    try {
        const user = users.find(u => u.id === req.auth._id)
        if (!user) return res.status(401).json({ message: 'Usuario no encontrado' }).end()
        req.user = user
        next()
    } catch (err) {
        next(err)
    }
}

// Middleware completo de autenticación
const isAuthenticated = [
    validateJwt,
    findAndAssignUser
]

const User = {
    login: async (req, res) => {
        const body = req.body
        try {
            const userFound = users.find(u => u.email === body.email)
            if (!userFound) return res.status(401).json({ message: 'Email incorrecto' })

            const isMatch = await bcrypt.compare(body.password, userFound.password)
            if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' })

            const signed = signToken(userFound.id)
            res.status(200).json({ token: signed })
        } catch (err) {
            console.error(err)
            res.status(500).json(err)
        }
    },

    register: async (req, res) => {
        const body = req.body
        try {
            const userFound = users.find(u => u.email === body.email)
            if (userFound) return res.status(409).json({ message: 'Email ya registrado' })

            const salt = await bcrypt.genSalt()
            const hashedPass = await bcrypt.hash(body.password, salt)

            const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0
            const newUser = {
                id: maxId + 1,
                email: body.email,
                name: body.name,
                password: hashedPass
            }

            users.push(newUser)
            const signed = signToken(newUser.id)
            res.status(201).json({ token: signed })
        } catch (err) {
            console.error(err)
            res.status(500).json(err)
        }
    }
}

module.exports = { User, isAuthenticated }
