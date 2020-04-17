// convert the clients Set into array for JSON serialization
let toArray = require("../utils/toArray")
var express = require('express');
var router = express.Router();

/* GET clients pipes */

router.get('/', (req, res) => {
    let clients = global.wss.clients[toArray]()
    console.log(`connected clients: ${clients.length}`)
    return res.send(clients);
});
router.post('/', (req, res) => {
    return res.send('Received a POST HTTP method');
});
router.put('/', (req, res) => {
    return res.send('Received a PUT HTTP method');
});
router.delete('/', (req, res) => {
    return res.send('Received a DELETE HTTP method');
});

module.exports = router;


