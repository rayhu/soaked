var express = require('express');
var router = express.Router();

/* GET clients pipes */

router.get('/', (req, res) => {
    return res.send(global.ws_server);
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


