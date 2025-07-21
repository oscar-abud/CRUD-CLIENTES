const express = require('express')
const morgan = require('morgan')
const app = express()
const port = 3000

const Clients = require('./clients.controller.js')

app.use(express.json())
app.use(morgan('dev'))

app.get('/clients', Clients.list)
app.post('/client', Clients.create)
app.get('/client/:id', Clients.get)
app.put('/client/:id', Clients.update)
app.patch('/client/:id', Clients.update)
app.delete('/client/:id', Clients.destroy)

// Error de 404
app.use((req, res) => {
    res.status(404).json({ message: "Página no encontrada" })
})

app.listen(port, () => {
    console.log(`Server is listen on port ${port}`)
})