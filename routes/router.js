var express = require('express');
var router = express.Router();


var handlers = require('../requestHandlers');

router.get('/',handlers.index);

router.post('/authentication',handlers.login);

//router.get('/hello', function (req, res, next) {
//    res.render('index', {title: '222'});
//});
//router.get('/a/:username', function (req, res) {
//    res.send('user: ' + req.params.username);
//});

module.exports = router;
