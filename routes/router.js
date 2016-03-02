var express = require('express');
var router = express.Router();


var handlers = require('../requestHandlers');

router.get('/',handlers.index);

router.post('/authentication',handlers.login);
router.post('/decision',handlers.decision);
router.post('/test',handlers.test);
module.exports = router;
