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
            'SELECT * FROM user where username ="' + username + '" and password = "' + password + '"',
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

        this.autoLogin(req, function () {
            res.render('index', {login: true});
        }, function () {
            res.render('index', {login: false});
        });
    },
    //test: function (req, res, next) {
    //    db.query(
    //        'SELECT * FROM  user where username ="' + '1' + '" and md = "' + '2' + '"',
    //        function selectCb(err, results) {
    //            if (err) {
    //                console.log('select md5值失败', err.message);
    //                res.status(200).render('index', {loginDisplay: 'block'});
    //                return;
    //            }
    //            if (results.length > 0) { //登录成功
    //                success();
    //            }
    //            else {
    //                res.status(200).send({returnState: -1});
    //            }
    //        });
    //},
    autoLogin: function (req, success, fail) { //自动登录——从cookie中读取用户名和密码以尝试登录，失败则显示登录窗口
        //读取cookie
        var authentication = req.cookies.authentication;
        if (!authentication) {
            fail();
            return false;
        }

        var username = authentication.username,
            password = authentication.password;

        //尝试登录
        db.query(
            'SELECT * FROM  user where username ="' + username + '" and md = "' + password + '"',
            function selectCb(err, results) {
                if (err) {
                    console.log('select md5值失败', err.message);
                    res.status(200).render('index', {loginDisplay: 'block'});
                    return;
                }
                if (results.length > 0) { //登录成功
                    success();
                }
                else {
                    fail();
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
                            res.status(200).send({returnState: -1});
                            console.log(err.message);
                            breakLoop = true;
                            return
                        }
                        if (results.length > 0) { //查询成功
                            var ComburentId = tools.getValFromResults(results, 'ComburentId', true)[0];

                            db.query('SELECT * FROM t_firetype where FireTypeId ="' + ComburentId + '"',
                                function selectCb(err, results) {
                                    if (err) {
                                        res.status(200).send({returnState: -1});
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
        db.query('update user set md="' + mdPassword + '" where username ="' + username + '"', function (err, result) {
            if (err) {
                console.log('update md5值失败 ', err.message);
            }
        });
    }
};


