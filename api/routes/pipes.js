// Convert the clients Set into array for JSON serialization
const express = require('express')
const router = express.Router() /* GET clients pipes */

router.get('/', (req, res) => {
    let id1
    let id2
    for (let [key] of global.wss.clients.entries()) {
        if (key.client_id === req.body.client1) id1 = key
        if (key.client_id === req.body.client2) id2 = key
    }
    console.log(id1.listeners('message'))
    console.log(id2.listeners('message'))

    res.send(200)
    // const clients = global.wss.clients[toArray]()
    // console.log(`connected clients: ${clients.length}`)
    // return res.send({clients: clients})
})

router.post('/', (req, res) => res.send('Received a POST HTTP method'))

router.put('/', (req, res) => {
    let id1
    let id2
    for (let [key] of global.wss.clients.entries()) {
        if (key.client_id === req.body.client1) id1 = key
        if (key.client_id === req.body.client2) id2 = key
    }
    // if either id1 or id2 doesn't exist, then fail the request
    if (!id1 | !id2) {
        return res.status(500).send('client ids not found')
    }
    // if either id1 or id2 already have a pipeline, then fail the request
    if (
        id1.listenerCount('message') >= 2 ||
        id2.listenerCount('message') >= 2
    ) {
        return res
            .status(500)
            .send(
                `There is already pipelines on ${req.body.client1} or ${req.body.client2}`
            )
    }
    id1.on('message', (chunk) => {
        id2.send(chunk)
    })
    id2.on('message', (chunk) => {
        id1.send(chunk)
    })
    console.log(JSON.stringify(id1.listeners('message')))
    console.log(id2.listeners('message'))

    res.send(`Piped ${req.body.client1} with ${req.body.client2}`)
})

router.delete('/', (req, res) => res.send('Received a DELETE HTTP method'))

module.exports = router
