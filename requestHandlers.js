/**
 * Created by 58 on 2016/3/1 0001.
 */
var express = require('express');
var db = require('./db');
var app = express();

module.exports = {
    login:function (req, res, next) {

        var username = req.body.username;
        var password = req.body.password;

        db.query(
            'SELECT * FROM ' + db.TEST_TABLE + ' where username ="'+ username + '" and password = "'+password+'"',
            function selectCb(err, results) {
                if (err) {
                    res.status(200).send({returnState: false});
                    throw err;
                }
                if (results.length>0) {
                    res.status(200).send({returnState: true});
                }
                else{
                    res.status(200).send({returnState: false});
                }
                //client.end();
            }
        );
    },
    index: function (req, res, next) {
        res.render('index', {loginDisplay: 'none'});

        //res.status(200).sendFile(app.get( 'views')+'/index.html');
    }
};
