/**
 * Created by 58 on 2016/3/1 0001.
 */
var express = require('express');
var db = require('./db');
var dbConfig = require('./dbconfig');
var tools = require('./tools');
var app = express();
var crypto = require('crypto');


module.exports = {
    authentication: function (req, res, next) {
        var username = req.body.username;
        var password = req.body.password;

        var login = function (req, res, suc) {
            db.query(
                'SELECT * FROM t_operator where name ="' + username + '" and password = "' + password + '"',
                function selectCb(err, results) {
                    if (err) {
                        res.status(200).send({returnState: false, returnMsg: err.message});
                        console.log('明文登录失败', err.message);
                        return;
                    }
                    if (results.length > 0) {   //登录成功
                        suc();
                    }
                    else {  //登录失败
                        res.status(200).send({returnState: false});
                    }
                }
            );
        };

        if (req.body.method === 'login') {
            login(req, res, function () {

                //设置cookie
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
                res.status(200).send({returnState: true});
            });
        }
        else if (req.body.method === 'modiPwd') {
            var newPwd = req.body.newPwd;

            login(req, res, function () {
                db.query(
                    'update t_operator set password="' + newPwd + '" where name ="' + username + '" and password = "' + password + '"',
                    function selectCb(err, results) {
                        if (err) {
                            res.status(200).send({returnState: false, returnMsg: err.message});
                            console.log('设置密码失败失败', err.message);
                            return;
                        }
                        else {
                            res.status(200).send({returnState: true});
                        }
                    }
                );
                res.status(200).send({returnState: true});
            });
        }


    },
    index: function (req, res, next) { //每次访问主页时触发


    },

    autoLogin: function (req, res, next) { //自动登录——从cookie中读取用户名和密码以尝试登录，失败则显示登录窗口
        var successHandler,
            failHandler;

        if (req.url === '/') {
            successHandler = function () {
                res.render('index', {login: true});
            }
            failHandler = function () {
                res.render('index', {login: false});
                return false;
            };
        } else {

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
            return false;
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

    commonGet: function (req, res, next, table) {
        db.query(
            'SELECT * FROM ' + table,
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
    commonPost: function (req, res, next, table) {
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
                sqlStatement = 'insert into ' + table + '(' + arr1.join(',') + ') values(' + arr2.join(',') + ')';
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
                sqlStatement = 'update ' + table + ' set ' + arr.join(',') + ' where ' + arr[0] + '';
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
                sqlStatement = 'delete from ' + table + ' where  ' + arr[0] + '';
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
            default :
                break;
        }


    },
    fireType: {
        get: function (req, res, next) {
            this.commonGet(req, res, next, 't_firetype');
        },
        post: function (req, res, next) {
            this.commonPost(req, res, next, 't_firetype');
        }
    },

    fireLevel: {
        get: function (req, res, next) {
            this.commonGet(req, res, next, 't_firelevel');
        },
        post: function (req, res, next) {
            this.commonPost(req, res, next, 't_firelevel');
        }
    },
    dispatch: {
        get: function (req, res, next) {
            this.commonGet(req, res, next, 't_dispatch');
        },
        post: function (req, res, next) {
            this.commonPost(req, res, next, 't_dispatch');
        }
    },
    learnRule: {
        get: function (req, res, next) {
            this.commonGet(req, res, next, 't_learn');
        },
        post: function (req, res, next) {
            this.commonPost(req, res, next, 't_learn');
        }
    },
    autoGenerateDispatch: {
        get: function (req, res, next) {
            var learnResult = null,
                similarityResult = null,
                resultNum = 0;

            function sendController() {
                if (resultNum === 2) {
                    res.status(200).send({
                        returnState: 1,
                        learnResult: learnResult,
                        similarityResult: similarityResult
                    });

                }
            };

            db.query(
                'SELECT * FROM ' + 't_learn',
                function selectCb(err, results) {
                    if (err) {
                        res.status(200).send({returnState: -1, returnMsg: err.message});

                        return;
                    }
                    if (results.length > 0) {
                        learnResult = results;
                        resultNum++;
                        sendController();
                    }
                    else {  //失败
                        res.status(200).send({returnState: 0});

                    }
                }
            );
            db.query(
                'SELECT * FROM ' + 't_similarity',
                function selectCb(err, results) {
                    if (err) {
                        res.status(200).send({returnState: -1, returnMsg: err.message});

                        return;
                    }
                    if (results.length > 0) {
                        similarityResult = results;
                        resultNum++;
                        sendController();
                    }
                    else {  //失败
                        res.status(200).send({returnState: 0});
                    }
                }
            );
        }
    },
    getoptions: function (req, res, next) {     //将数据库各火灾详细选项传给前端
        var result = {},
            resultNum = 0,
            detailLength = 0;

        for (var name in dbConfig.detail) {
            detailLength++;
        }

        function sendController() {
            if (resultNum === detailLength) {
                res.status(200).send({
                    returnState: 1,
                    result: result
                });
            }
        };
        for (var name in dbConfig.detail) {
            var obj = {
                name: name,
                selectCb: function (err, results) {

                    if (err) {
                        res.status(200).send({returnState: -1, returnMsg: err.message});
                        return;
                    }
                    if (results.length > 0) {
                        var arr = [];
                        for (var i = 0, j = results.length; i < j; i++) {
                            for (var name in results[i]) {
                                if (arr.indexOf(results[i][name]) < 0) {
                                    arr[arr.length] = results[i][name];
                                }
                            }

                        }
                        result[this.name] = arr;

                        resultNum++;
                        sendController();
                    }
                    else {  //失败
                        res.status(200).send({returnState: 0});
                    }
                }
            }

            db.query('SELECT ' + dbConfig.detail[name][1] + ' FROM ' + name, obj.selectCb.bind(obj));
        }


    },
    decision: function (req, res, next) {
        var inputArr = JSON.parse(req.body.data),
            str = '',
            i = 0,
            tipStr = '';


        db.query('delete from mconclusion;')    //清空mconclusion

        for (; i < inputArr.length; i++) {
            var obj = inputArr[i],
                title = obj.title.split('：')[0],
                detail = obj.detail,
                truth = obj.truth,
                id = obj.id;
            obj.truth1 = truth.split('(')[1].split(',')[0];
            obj.truth0 = truth.split(')')[0].split(',')[1];


            if (Array.isArray(dbConfig.detail[id]) && detail) {
                var dbStr = "select FireLevelid,FireLevelName from t_firelevel where " + dbConfig.detail[id][0] +
                    " IN (select " + dbConfig.detail[id][0] + "  from " + id + " where " +
                    dbConfig.detail[id][1] + "='" + detail + "')";
                var objbind = {
                    input: obj,
                    selectCb: function (err, results) {
                        if (err) {
                            res.status(200).send({returnState: -1, returnMsg: err.message});
                            console.log(err.message);
                            breakLoop = true;
                            return
                        }

                        if (results.length > 0) { //查询成功
                            for (var i = 0; i < results.length; i++) {
                                console.log(results[i]);
                                var fireLevelId = results[i]['FireLevelid'];
                                var fireLevelName = results[i]['FireLevelName'],
                                    f = this.input.truth1,
                                    c = this.input.truth0;
                                //设置详细显示
                                tipStr = '（$事件*[' + this.input.detail + ']→' + this.input.title + '=> $事件→([' +
                                    fireLevelName.split('火灾')[0] + '] &火灾)  (' +
                                    f + ',' + (0.9 * c) + ')\n';

                                console.log(tipStr)

                                // 插进中间结论表---------
                                var sql = "select * from mConclusion where conclusion = " + fireLevelId;

                                db.query(sql, function (err, results) {
                                    if (err) {
                                        res.status(200).send({returnState: -1, returnMsg: err.message});
                                        console.log(err.message);
                                        breakLoop = true;
                                        return
                                    }
                                    console.log(fireLevelId+' '+results.length )

                                    if (results.length > 0) { //查询成功
                                        var f1 = results[0]['f'],
                                            c1 = results[0]['c'];

                                        f = f * 1.0;
                                        c = ( c * 0.9 * 1.0 * f);


                                        console.log("f=" + f + " c=" + c + "   f1:" + f1 + " c1=" + c1);

                                        f = (f * c * (1 - c1) + f1 * c1 * (1 - c)) / (c * (1 -
                                            c1) + c1 * (1 - c));
                                        c = (c * (1 - c1) + c1 * (1 - c)) / (c * (1 - c1) + c1 * (1 -
                                            c) + (1 - c) * (1 - c1));

                                        db.query("update mConclusion" + " set f=" + f +
                                            ",c=" + c + " where conclusion = " + fireLevelId, function (err, results) {
                                            if (err) {
                                                res.status(200).send({returnState: -1, returnMsg: err.message});
                                                console.log(err.message);
                                                breakLoop = true;
                                                return
                                            }
                                        });
                                    } else {
                                        db.query("insert into mConclusion(conclusion) values(" +
                                            fireLevelId + ")", function (err, results) {
                                            if (err) {
                                                res.status(200).send({returnState: -1, returnMsg: err.message});
                                                console.log(err.message);
                                                breakLoop = true;
                                                return
                                            }
                                        });

                                        f = f * 1.0;
                                        c = ( c * 0.9 * 1.0 * f);

                                        db.query("update mConclusion" + " set f=" + f + ",c=" +
                                            c + " where conclusion = " + fireLevelId, function (err, results) {
                                            if (err) {
                                                res.status(200).send({returnState: -1, returnMsg: err.message});
                                                console.log(err.message);
                                                breakLoop = true;
                                                return
                                            }
                                        });
                                    }

                                });
                            }
                        }
                        else {
                            res.status(200).send({returnState: 0, returnMsg: id + '无法识别'});
                            breakLoop = true;
                        }
                    }
                }

                db.query(dbStr, objbind.selectCb.bind(objbind));

            }
        }
    }
};


//if (id==='t_pos') {  //确定事件类型
//
//    db.query('SELECT * FROM t_comburent where ComburentName ="' + detail + '"',
//        function selectCb(err, results) {
//            if (err) {
//                res.status(200).send({returnState: -1, returnMsg: err.message});
//                console.log(err.message);
//                breakLoop = true;
//                return
//            }
//            if (results.length > 0) { //查询成功
//                var ComburentId = tools.getValFromResults(results, 'ComburentId', true)[0];
//
//                db.query('SELECT * FROM t_firetype where FireTypeId ="' + ComburentId + '"',
//                    function selectCb(err, results) {
//                        if (err) {
//                            res.status(200).send({returnState: -1, returnMsg: err.message});
//                            console.log(err.message);
//                            breakLoop = true;
//                            return
//                        }
//                        if (results.length > 0) { //查询成功
//                            var fireType = tools.getValFromResults(results, 'FireTypeName', false, true)[0];
//                            var msg = (fireType.id + (fireType.truth0 * truth0) + ' ' + (fireType.truth1 * truth1))
//                            res.status(200).send({returnState: 1, returnMsg: msg});
//
//                        }
//                        else {
//                            res.status(200).send({returnState: 0, returnMsg: '"发生地点"无法识别'});
//                            breakLoop = true;
//                        }
//                    });
//
//            }
//            else {
//                res.status(200).send({returnState: 0, returnMsg: '"发生地点"无法识别'});
//                breakLoop = true;
//            }
//        });
//}
