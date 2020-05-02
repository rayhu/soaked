// Convert the clients Set into array for JSON serialization
const toArray = require('../utils/toArray')
const express = require('express')
const router = express.Router() /* GET clients pipes */
router.get('/', (req, res) => {
    const clients = global.wss.clients[toArray]()
    console.log(`connected clients: ${clients.length}`)
    return res.send({clients: clients})
})
router.post('/', (req, res) => res.send('Received a POST HTTP method'))
router.put('/', (req, res) => res.send('Received a PUT HTTP method'))
router.delete('/', (req, res) => res.send('Received a DELETE HTTP method'))

module.exports = router
