/**
 * Created by 58 on 2016/3/1 0001.
 */
var express = require('express');
var db = require('./db');
var app = express();
var crypto = require('crypto');

module.exports = {
    login: function  (req, res, next) {

        var username = req.body.username;
        var password = req.body.password;

        db.query(
            'SELECT * FROM ' + db.TABLE + ' where username ="' + username + '" and password = "' + password + '"',
            function selectCb(err, results) {
                if (err) {
                    res.status(200).send({returnState: false});
                    console.log('select明文登录失败', err.message);
                    return;
                }
                if (results.length > 0) {   //登录成功

                    controller.setLoginCookie(res, username, password);

                    res.status(200).send({returnState: true});
                }
                else {  //登录失败
                    res.status(200).send({returnState: false});
                }
            }
        );
    },
    index: function (req, res, next) { //每次访问主页时触发
        controller.autoLogin(req, function () {
            res.render('index', {loginDisplay: 'none'});
        }, function () {
            res.render('index', {loginDisplay: 'block'});
        });
    }
};

var controller = {
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
            'SELECT * FROM ' + db.TABLE + ' where username ="' + username + '" and md = "' + password + '"',
            function selectCb(err, results) {
                if (err) {
                    res.status(200).send({returnState: false});
                    console.log('select md5值失败', err.message);
                    res.render('index', {loginDisplay: 'block'});
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
    setLoginCookie: function (res, username, password) {  //加密密码后设置cookie

        var md5 = crypto.createHash('md5');
        var mdPassword = md5.update(password).digest('base64');
        res.cookie('authentication', {
            username: username,
            password: mdPassword
        });

        //设置数据库中账户的密码加密值
        db.query('update ' + db.TABLE + ' set md="' + mdPassword + '" where username ="' + username + '"', function (err, result) {
            if (err) {
                console.log('update md5值失败 ', err.message);
            }
        });
    }
}
