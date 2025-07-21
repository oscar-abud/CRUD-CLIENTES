
let clients = [
    {
        id: 1,
        name: 'Oscar',
        lastname: 'Abud',
        age: 23
    },
    {
        id: 2,
        name: 'Luis',
        lastname: 'Gonzalez',
        age: 28
    }
]

const Clients = {
    list: (req, res) => {
        res.json(clients)
    },
    get: (req, res) => {
        const clientFound = clients.find(c => c.id === parseInt(req.params.id))
        if (!clientFound) return res.status(404).json({ message: 'Cliente no encontrado' })
        res.json(clientFound)
    },
    create: (req, res) => {
        const maxId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) : 0
        const newClient = { id: maxId + 1, ...req.body }
        clients.push(newClient)
        res.status(201).json(newClient)
    },
    update: (req, res) => {
        const clientIndex = clients.findIndex(c => c.id === parseInt(req.params.id))
        if (!clientIndex) return res.status(404).json({ message: "Cliente no encontrado" })
        clients[clientIndex] = { ...clients[clientIndex], ...req.body } //Guardo el valor del indice del cliente y actualizo sus datos con los del body
        res.status(200).json(clients[clientIndex])
    },
    destroy: (req, res) => {
        const clientIndex = clients.filter(c => c.id !== parseInt(req.params.id))
        if (clientIndex.length === clients.length) return res.status(404).json({ message: "Cliente no encontrado" })
        clients = clientIndex
        res.status(200).json({ message: `Cliente con id '${req.params.id}' eliminado!` })
    },
}

module.exports = Clients