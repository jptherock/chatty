const{addMessage,getAllMessage} = require('../Controllers/messageControllers');
const express = require('express');

const router = express.Router();

router.post('/addmessage',addMessage);
router.get('/getallmessage',getAllMessage);

module.exports = router;  