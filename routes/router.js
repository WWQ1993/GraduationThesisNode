var express = require('express');
var router = express.Router();


var handlers = require('../requestHandlers');

router.get('/',handlers.index);

router.post('/authentication',handlers.login);
router.post('/decision',handlers.decision);

module.exports = router;
