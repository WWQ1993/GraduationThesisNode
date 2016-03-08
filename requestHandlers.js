/**
 * Created by 58 on 2016/3/1 0001.
 */
var express = require('express');
var db = require('./db');
var tools = require('./tools');
var app = express();
var crypto = require('crypto');


module.exports = {
    login: function (req, res, next) {

        var username = req.body.username;
        var password = req.body.password;

        db.query(
            'SELECT * FROM t_operator where name ="' + username + '" and password = "' + password + '"',
            function selectCb(err, results) {
                if (err) {
                    res.status(200).send({returnState: false});
                    console.log('select明文登录失败', err.message);
                    return;
                }
                if (results.length > 0) {   //登录成功

                    this.setLoginCookie(res, username, password);

                    res.status(200).send({returnState: true});
                }
                else {  //登录失败
                    res.status(200).send({returnState: false});
                }
            }.bind(this)
        );
    },
    index: function (req, res, next) { //每次访问主页时触发


    },

    autoLogin: function (req, res, next) { //自动登录——从cookie中读取用户名和密码以尝试登录，失败则显示登录窗口
        var currentPage = '',
            successHandler,
            failHandler;
        if (req.url === '/') {

            currentPage = 'index';
            successHandler = function () {
                res.render('index', {login: true});
                next();
            }
            failHandler = function () {
                res.render('index', {login: false});
                return false;
            };
        } else {
            currentPage = 'decision';
            successHandler = function () {
                next();
            };
            failHandler = function () {
                res.status(200).send({returnState: -2});
                return false;
            };
        }
        //读取cookie
        var authentication = req.cookies.authentication;
        if (!authentication) {
            failHandler();
        }

        var username = authentication.username,
            password = authentication.password;

        //尝试登录
        db.query(
            'SELECT * FROM  t_operator where name ="' + username + '" and identityCard = "' + password + '"',
            function selectCb(err, results) {
                if (err) {
                    console.log('select md5值失败', err.message);
                    res.status(200).render('index', {loginDisplay: 'block'});
                    return;
                }
                if (results.length > 0) { //登录成功
                    successHandler();
                }
                else {
                    failHandler();
                }
            });
    },
    decision: function (req, res, next) {
        var input = JSON.parse(req.body.data),
            str = '',
            i = 0,
            breakLoop = false

        for (; i < input.length; i++) {
            var obj = input[i],
                title = obj.title,
                kind = obj.kind,
                truth = obj.truth,
                truth1 = truth.split('(')[1].split(',')[0],
                truth0 = truth.split(')')[0].split(',')[1],
                Searchfields = ['ComburentName',];
            if (i === 0) {  //确定事件类型

                db.query('SELECT * FROM t_comburent where ComburentName ="' + kind + '"',
                    function selectCb(err, results) {
                        if (err) {
                            res.status(200).send({returnState: -1, returnMsg: err.message});
                            console.log(err.message);
                            breakLoop = true;
                            return
                        }
                        if (results.length > 0) { //查询成功
                            var ComburentId = tools.getValFromResults(results, 'ComburentId', true)[0];

                            db.query('SELECT * FROM t_firetype where FireTypeId ="' + ComburentId + '"',
                                function selectCb(err, results) {
                                    if (err) {
                                        res.status(200).send({returnState: -1, returnMsg: err.message});
                                        console.log(err.message);
                                        breakLoop = true;
                                        return
                                    }
                                    if (results.length > 0) { //查询成功
                                        var fireType = tools.getValFromResults(results, 'FireTypeName', false, true)[0];
                                        var msg = (fireType.id + (fireType.truth0 * truth0) + ' ' + (fireType.truth1 * truth1))
                                        res.status(200).send({returnState: 1, returnMsg: msg});

                                    }
                                    else {
                                        res.status(200).send({returnState: 0, returnMsg: '"发生地点"无法识别'});
                                        breakLoop = true;
                                    }
                                });

                        }
                        else {
                            res.status(200).send({returnState: 0, returnMsg: '"发生地点"无法识别'});
                            breakLoop = true;
                        }
                    });
            }
            else if (!breakLoop) {

            }
            str += i + ': ' + obj.title + obj.kind + ', ' + obj.truth + '\n';
        }
    },
    setLoginCookie: function (res, username, password) {  //加密密码后设置cookie

        var md5 = crypto.createHash('md5');
        var mdPassword = md5.update(password).digest('base64');
        res.cookie('authentication', {
            username: username,
            password: mdPassword
        });

        //设置数据库中账户的密码加密值
        db.query('update t_operator set identityCard="' + mdPassword + '" where name ="' + username + '"', function (err, result) {
            if (err) {
                console.log('update md5值失败 ', err.message);
            }
        });
    },
    fireType: {
        get: function (req, res, next) {
            db.query(
                'SELECT * FROM t_firetype',
                function selectCb(err, results) {
                    if (err) {
                        res.status(200).send({returnState: -1, returnMsg: err.message});
                        console.log('get firetype fail', err.message);
                        return;
                    }
                    if (results.length > 0) {   //登录成功
                        res.status(200).send({returnState: 1, data: results});
                    }
                    else {  //失败
                        res.status(200).send({returnState: 0});
                    }
                }
            );
        },
        post: function (req, res, next) {
            var method = req.body.method,
                data = JSON.parse(req.body.data),
                sqlStatement = ''
            console.log(data);
            switch (method) {
                case 'ADD':
                    var arr1 = [],
                        arr2 = [];
                    for (var i = 0; i < data.length; i++) {
                        for (var name in data[i]) {
                            arr1.push(name.split(':')[0]);
                            arr2.push("'" + data[i][name] + "'");
                        }
                    }
                    sqlStatement = 'insert into t_firetype(' + arr1.join(',') + ') values(' + arr2.join(',') + ')';
                    db.query(sqlStatement, function selectCb(err, results) {
                            if (err) {
                                res.status(200).send({returnState: -1, returnMsg: err.message});
                                console.log(err.message);
                                return;
                            }
                            res.status(200).send({returnState: 1, data: results});
                        }
                    );
                    break;
                case 'UPDATE':
                    var value = '',
                        arr = []
                    for (var i = 0; i < data.length; i++) {
                        for (var name in data[i]) {
                            arr.push(name.split(':')[0] + '="' + data[i][name] + '"');
                        }
                    }
                    sqlStatement = 'update t_firetype set ' + arr.join(',') + ' where ' + arr[0] + '';
                    db.query(sqlStatement, function selectCb(err, results) {
                            if (err) {
                                res.status(200).send({returnState: -1, returnMsg: err.message});
                                console.log(err.message);
                                return;
                            }
                            res.status(200).send({returnState: 1, data: results});
                        }
                    );
                    break;
                case 'DELETE':
                    var value = '',
                        arr = []
                    for (var i = 0; i < data.length; i++) {
                        for (var name in data[i]) {
                            arr.push(name.split(':')[0] + '="' + data[i][name] + '"');
                        }
                    }
                    sqlStatement = 'delete from t_firetype where  ' + arr[0] + '';
                    console.log(sqlStatement)
                    db.query(sqlStatement, function selectCb(err, results) {
                            if (err) {
                                res.status(200).send({returnState: -1, returnMsg: err.message});
                                console.log(err.message);
                                return;
                            }
                            res.status(200).send({returnState: 1, data: results});
                        }
                    );
                    break;
                    break;
                default :
                    break;
            }


        }
    }
};


