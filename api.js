const express = require('express')
const morgan = require('morgan')
const app = express()
const port = 3000
const cors = require('cors')

// Importando el controlador de clientes
const Clients = require('./clients.controller.js')
// Importando el controlador de usuarios
// y el middleware de autenticación
const { User, isAuthenticated } = require('./user.controller.js')

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

// Rutas de clientes
app.get('/clients', isAuthenticated, Clients.list)
app.post('/clients', isAuthenticated, Clients.create)
app.get('/clients/:id', isAuthenticated, Clients.get)
app.put('/clients/:id', isAuthenticated, Clients.update)
app.patch('/clients/:id', isAuthenticated, Clients.update)
app.delete('/clients/:id', isAuthenticated, Clients.destroy)

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