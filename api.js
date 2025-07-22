const express = require('express')
const morgan = require('morgan')
const app = express()
const port = 3000

// Importando el controlador de clientes
const Clients = require('./clients.controller.js')
// Importando el controlador de usuarios
// y el middleware de autenticación
const { User, isAuthenticated } = require('./user.controller.js')

app.use(express.json())
app.use(morgan('dev'))

// Rutas de clientes
app.get('/clients', isAuthenticated, Clients.list)
app.post('/client', isAuthenticated, Clients.create)
app.get('/client/:id', isAuthenticated, Clients.get)
app.put('/client/:id', isAuthenticated, Clients.update)
app.patch('/client/:id', isAuthenticated, Clients.update)
app.delete('/client/:id', isAuthenticated, Clients.destroy)

// Login y SignUp
app.post('/login', User.login)
app.post('/register', User.register)

// Error de 404
app.use((req, res) => {
    res.status(404).json({ message: "Página no encontrada" })
})

app.listen(port, () => {
    console.log(`Server is listen on port ${port}`)
})