var express = require('express');
var router = express.Router();


var handlers = require('../requestHandlers');
router.get('/',handlers.autoLogin);
router.get('/',handlers.index.bind(handlers));
router.post('/authentication',handlers.authentication.bind(handlers));
router.all('/decision',handlers.autoLogin);
router.post('/decision',handlers.decision);

router.all('/fireType',handlers.autoLogin);
router.get('/fireType',handlers.fireType.get.bind(handlers));
router.post('/fireType',handlers.fireType.post.bind(handlers));

router.all('/fireLevel',handlers.autoLogin);
router.get('/fireLevel',handlers.fireLevel.get.bind(handlers));
router.post('/fireLevel',handlers.fireLevel.post.bind(handlers));

router.all('/dispatch',handlers.autoLogin);
router.get('/dispatch',handlers.dispatch.get.bind(handlers));
router.post('/dispatch',handlers.dispatch.post.bind(handlers));

router.all('/learnrule',handlers.autoLogin);
router.get('/learnrule',handlers.learnRule.get.bind(handlers));
router.post('/learnrule',handlers.learnRule.post.bind(handlers));

module.exports = router;
