var express = require('express');
var router = express.Router();


var handlers = require('../requestHandlers');
router.get('/',handlers.autoLogin);
router.get('/',handlers.index.bind(handlers));
router.post('/authentication',handlers.login.bind(handlers));
router.all('/decision',handlers.autoLogin);
router.post('/decision',handlers.decision);


router.all('/fireType',handlers.autoLogin);
router.get('/fireType',handlers.fireType.get);
router.post('/fireType',handlers.fireType.post);
//router.post('/test',handlers.test);
module.exports = router;
