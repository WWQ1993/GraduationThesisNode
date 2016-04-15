/**
 * Created by 58 on 2016/3/1 0001.
 */
var express = require('express');
var db = require('./db');
var dbConfig = require('./dbconfig');
var tools = require('./tools');
var app = express();
var crypto = require('crypto');
var async = require('async');
var EventProxy = require('eventproxy');

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
                        console.log(err.message)
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
            tipStr = '',
            midResult = [],
            midCounter = 0,
            midCounter2 = 0,
            inputArrLength = inputArr.length;


        async.series([
            function (cb) {
                db.query('call clearConclusion()', function (err) {   //清空之前记录
                    if (err) {
                        console.log(err.message);
                        return
                    }
                    cb();
                })
            },
            function (cb) {
                db.query('insert into tempLearn select * from t_learn', function (err) {   //清空之前记录
                    if (err) {
                        console.log(err.message);
                        return
                    }
                    cb();
                })
            },
            function (cb) {
                db.query('insert into tempSimilarity select * from t_similarity', function (err) {   //清空之前记录
                    if (err) {
                        console.log(err.message);
                        return
                    }
                    cb();
                })
            }
        ], function () {
            console.log('清除之前记录完毕')

            var inputDetailArr = [];

            for (; i < inputArrLength; i++) {

                var func = function (cb) {
                    var i = arguments.callee.i;
                    var obj = inputArr[i],
                        title = obj.title.split('：')[0],
                        detail = obj.detail,
                        truth = obj.truth,
                        name = obj.name;
                    obj.truth1 = truth.split('(')[1].split(',')[0];
                    obj.truth0 = truth.split(')')[0].split(',')[1];


                    if ('t_firetype' !== name && detail && Array.isArray(dbConfig.detail[name])) {

                        db.query("select " + dbConfig.detail[name][0] + "  from " + name + " where " +
                            dbConfig.detail[name][1] + "='" + detail + "'", function (err, results) {
                            if (err) {
                                res.status(200).send({returnState: -1, returnMsg: err.message});
                                console.log(err.message);
                                return
                            }
                            var eachIdArr = [];
                            for (var j = 0; j < results.length; j++) {  //由detail搜出的每条id有：
                                var id = results[j][dbConfig.detail[name][0]];

                                var eachIdfunc = function (eachIdCb) {
                                    id = arguments.callee.id;

                                    async.series([
                                        function (callback) {   //插入t_input
                                            db.query('insert into t_input(input,f,c,description) values(' + id + ',' + obj.truth1 + ',' + obj.truth0 + ',"' + detail + '")', function (err, results) {
                                                if (err) {
                                                    res.status(200).send({returnState: -1, returnMsg: err.message});
                                                    console.log(err.message + '   this');
                                                    return
                                                }
                                                callback();

                                            });
                                        },
                                        function (callback) {   //根据id在firelevel表中获取火灾等级
                                            db.query('select FireLevelid,FireLevelName from t_firelevel where ' + dbConfig.detail[name][0] +
                                                ' = ' + id + ';', function (err, results) {
                                                if (err) {
                                                    res.status(200).send({returnState: -1, returnMsg: err.message});
                                                    console.log(err.message);
                                                    return;
                                                }
                                                var fireLevelId = results[0]['FireLevelid'],
                                                    fireLevelName = results[0]['FireLevelName']
                                                fireLevelIdOuter = fireLevelId;

                                                console.log(name + ': ' + fireLevelName);
                                                tipStr += '（$事件*[' + detail + ']→' + title + '=> $事件→([' +
                                                    fireLevelName.split('火灾')[0] + '] &火灾)  (' + obj.truth1 + ',' + (0.9 * obj.truth0 ) + ')</br>';

                                                var m_conclusion = function () {
                                                    db.query('select * from mConclusion where conclusion = ' + fireLevelId, function (err, results) {
                                                        if (err) {
                                                            res.status(200).send({
                                                                returnState: -1,
                                                                returnMsg: err.message
                                                            });
                                                            console.log(err.message);
                                                            return;
                                                        }
                                                        console.log('mConclusion result length: ' + results.length);
                                                        if (results.length > 0) {
                                                            var f1 = 1.0 * obj.truth1,
                                                                c1 = (obj.truth0 * 0.9 * 1.0 * obj.truth1),
                                                                f2 = results[0]['f'],
                                                                c2 = results[0]['c'],
                                                                f3 = (f1 * c1 * (1 - c2) + f2 * c2 * (1 - c1)) / (c1 * (1 - c2) + c2 * (1 - c1)),
                                                                c3 = (c1 * (1 - c2) + c2 * (1 - c1)) / (c1 * (1 - c2) + c2 * (1 - c1) + (1 - c1) * (1 - c2));
                                                            db.query("update mConclusion" +
                                                                " set f=" + f3 + ",c=" + c3 + " where conclusion = " + fireLevelId, function () {
                                                                callback();

                                                            });
                                                        }
                                                        else {

                                                            var f3 = 1.0 * obj.truth1,
                                                                c3 = (obj.truth0 * 0.9 * 1.0 * obj.truth1);
                                                            db.query('insert into mConclusion(conclusion,f,c) values(' + fireLevelId + ',' + f3 + ',' + c3 + ')', function () {
                                                                callback();
                                                            });

                                                        }
                                                    })

                                                }

                                                if (dbConfig.learnAndSimiLater.indexOf(name) < 0) {
                                                    learnAndSimi(fireLevelId, id, detail, function () {
                                                        console.log('learnAndSimiBefore')
                                                        m_conclusion();
                                                    })
                                                }
                                                else {

                                                    console.log('learnAndSimiLater')
                                                    m_conclusion();
                                                    learnAndSimi(fireLevelId, id, detail, function () {
                                                        callback();
                                                    })
                                                }
                                            })

                                        },
                                    ], function (err, values) {
                                        console.log('done an item')
                                        eachIdCb();

                                    });
                                };
                                eachIdfunc.id = id;

                                eachIdArr[eachIdArr.length] = eachIdfunc;

                            }

                            async.series(eachIdArr, function (err, values) {   //遍历每一项火情输入
                                console.log('done a detail')
                                cb();
                            })
                        });
                    }
                    else {
                        cb();
                    }
                }

                func.i = i;
                inputDetailArr[inputDetailArr.length] = func;
            }


            async.series(inputDetailArr, function (err, values) {   //遍历每一项火情输入
                console.log('遍历每一项火情输入完毕');

                //res.status(200).send({
                //    returnState: -1
                //});


            })
        });

        var learnAndSimi = function (fireLevelId, id, detail, cb) {
            console.log('--learnAndSimi input:  ' + fireLevelId + ' ' + id + ' ' + detail);
            var f1 = 0,
                f2 = 0,
                c1 = 0,
                c2 = 0;
            async.series([
                function (cab) {
                    console.log("###update t_input" + " set conclusion=" + fireLevelId + " where input = " + id);
                    db.query("update t_input" +
                        " set conclusion = " + fireLevelId + " where input = " + id, function (err, results) {
                        if (err) {
                            res.status(200).send({
                                returnState: -1,
                                returnMsg: err.message
                            });
                            console.log(err.message);
                            return;
                        }
                        cab();
                    });
                },
                function (cab) {
                    db.query("select * from t_input where conclusion =" + fireLevelId + " AND input = " + id, function (err, results) {
                        if (err) {
                            res.status(200).send({
                                returnState: -1,
                                returnMsg: err.message
                            });
                            console.log(err.message);
                            return;
                        }
                        f1 = results[0]['f'];
                        c1 = results[0]['c'];
                        console.log("f1:" + f1 + "c1:" + c1);
                        cab();
                    });
                },
                function (cab) {
                    db.query("select * from tempLearn where Condition1 = " + id + " or Condition2 = " + id, function (err, results) {
                        if (err) {
                            res.status(200).send({
                                returnState: -1,
                                returnMsg: err.message
                            });
                            console.log(err.message);
                            return;
                        }
                        var resultArrFunc = [];

                        for (var ind = 0; ind < results.length; ind++) {
                            var resultFunc = function (resultFuncCb) {
                                var ind = arguments.callee.ind,
                                    f = results[ind]['f'],
                                    c = results[ind]['c'],
                                    othierCdt = results[ind]["Condition2"],
                                    conclusion = results[ind]["Condition"]
                                if (c > 0.5) {
                                    f = f1 * f;//f值更新为输入的f值和规则的f值的运算结果
                                    c = c1 * c * f1 * f;
                                    db.query("select * from mConclusion where conclusion = " + conclusion, function (err, results) {
                                        if (err) {
                                            res.status(200).send({
                                                returnState: -1,
                                                returnMsg: err.message
                                            });
                                            console.log(err.message);
                                            return;
                                        }
                                        if (results.length > 0) {
                                            f1 = f;
                                            c1 = c;

                                            f2 = results[0]("f");
                                            c2 = results[0]("c");

                                            var f3 = (f1 * c1 * (1 - c2) + f2 * c2 * (1 - c1)) / (c1 * (1 - c2) + c2 * (1 - c1));
                                            var c3 = (c1 * (1 - c2) + c2 * (1 - c1)) / (c1 * (1 - c2) + c2 * (1 - c1) + (1 - c1) * (1 - c2));
                                            db.query("update mConclusion" + " set f=" + f3 + ",c=" + c3 + " where conclusion = " + conclusion, function (err, results) {
                                                if (err) {
                                                    res.status(200).send({
                                                        returnState: -1,
                                                        returnMsg: err.message
                                                    });
                                                    console.log(err.message);
                                                    return;
                                                }
                                                resultFuncCb();
                                            });
                                        }
                                        else {
                                            db.query("insert into mConclusion(conclusion) values(" + conclusion + ")", function (err, results) {
                                                if (err) {
                                                    res.status(200).send({
                                                        returnState: -1,
                                                        returnMsg: err.message
                                                    });
                                                    console.log(err.message);
                                                    return;
                                                }

                                                var f3 = f;
                                                var c3 = c;
                                                db.query("update mConclusion" +
                                                    " set f=" + f3 + ",c=" + c3 + " where conclusion = " + conclusion, function (err, results) {
                                                    if (err) {
                                                        res.status(200).send({
                                                            returnState: -1,
                                                            returnMsg: err.message
                                                        });
                                                        console.log(err.message);
                                                        return;
                                                    }
                                                    resultFuncCb();

                                                });

                                            });
                                        }
                                    });
                                }
                            };
                            resultFunc.ind = ind;
                            resultArrFunc[resultArrFunc.length] = resultFunc;
                        }
                        async.series(resultArrFunc, function () {
                            cab();
                        })

                    });

                },
                function (cab) {

                    db.query("select * from t_input where conclusion = " + fireLevelId + " AND description <> '" + detail + "'", function (err, results) {
                        if (err) {
                            console.log(err.message);
                            return;
                        }
                        var f3 = 0,
                            c3 = 0,
                            resultArrFunc = [];

                        for (var ind = 0; ind < results.length; ind++) {
                            var resultFunc = function (resultFuncCb) {
                                var ind = arguments.callee.ind;
                                f2 = results[ind]['f'];
                                c2 = results[ind]['c'];
                                f3 = f2;
                                c3 = (f1 * c1 * c2) / (f1 * c1 * c2 + 1);

                                db.query("select * from t_learn where (Condition1 = " + results[ind]["input"] + " and Condition2 = " + id + ") or (Condition1 = " + id + " and Condition2 = " + results[ind]["input"] + ")", function (err, res) {
                                    if (err) {
                                        console.log(err.message);
                                        return;
                                    }
                                    if (res.length > 0) {
                                        f1 = f3;
                                        c1 = c3;
                                        f2 = res[0]["Frequency"];
                                        c2 = res[0]["Confidence"];
                                        f3 = (f1 * c1 * (1 - c2) + f2 * c2 * (1 - c1)) / (c1 * (1 - c2) + c2 * (1 - c1));
                                        c3 = (c1 * (1 - c2) + c2 * (1 - c1)) / (c1 * (1 - c2) + c2 * (1 - c1) + (1 - c1) * (1 - c2));
                                        db.query("update t_learn set Frequency = " + f3 + ",Confidence = " + c3 + " where Condition1 = " + res[0]["Condition1"] + " and  Condition2 = " + res[0]["Condition2"], function (err) {
                                            if (err) {
                                                console.log(err.message);
                                                return;
                                            }
                                            resultFuncCb();
                                        });
                                    }
                                    else {
                                        db.query("insert into t_learn(Condition1,Description1,Condition2,Description2,Conclusion,Frequency,Confidence) " +
                                            "values(" + results[ind]["input"] + ",'" + results[ind]["description"] + "'," + id + ",'" + detail + "'," + fireLevelId + "," + f3 + "," + c3 + ")", function (err) {
                                            if (err) {
                                                console.log(err.message);
                                                return;
                                            }
                                            resultFuncCb();
                                        });
                                    }
                                });
                            }
                            resultFunc.ind = ind;
                            resultArrFunc[resultArrFunc.length] = resultFunc;
                        }
                        async.series(resultArrFunc, function () {
                            cab();
                        })
                    })
                },
                function (cab) {    //1574
                    db.query("select * from t_input where conclusion <> " + fireLevelId + " AND description = '" + detail + "'", function (err, results) {
                        if (err) {
                            console.log(err.message);
                            return;
                        }

                        for (var ind = 0; ind < results.length; ind++) {
                            var resultFunc = function (resultFuncCb) {
                                var ind = arguments.callee.ind,
                                    f2 = results[ind]['f'],
                                    c2 = results[ind]['c'],
                                    des1 = "",
                                    des2 = "",
                                    f3 = (f1 * f2) / (f1 + f2 - f1 * f2),
                                    c3 = ((f1 + f2 - f1 * f2) * c1 * c2) / ((f1 + f2 - f1 * f2) * c1 * c2 + 1);

                                async.series([
                                    function (cb) {//1585
                                        db.query("select FireLevelName from t_firelevel where FireLevelid = " +
                                            results[ind]["conclusion"], function (err, results) {

                                            if (err) {
                                                console.log(err.message);
                                                return;
                                            }
                                            des1 = results[results.length - 1]["FireLevelName"];
                                            cb();
                                        });
                                    },
                                    function (cb) {//1590
                                        db.query("select FireLevelName from t_firelevel where FireLevelid = " +
                                            fireLevelId, function (err, results) {

                                            if (err) {
                                                console.log(err.message);
                                                return;
                                            }
                                            des2 = results[results.length - 1]["FireLevelName"];
                                            cb();
                                        });
                                    },
                                    function (cb) {//1596
                                        db.query("select * from t_similarity where (Level1 = " + results[ind]["conclusion"] + " and Level2 = " + fireLevelId + ") or (Level1 = " + fireLevelId + " and Level2 = " + results[ind]["conclusion"] + ")", function (err, res) {
                                            if (err) {
                                                console.log(err.message);
                                                return;
                                            }
                                            if (res.length > 0) {
                                                f1 = f3;
                                                c1 = c3;
                                                f2 = res[0]["Frequency"];
                                                c2 = res[0]["Confidence"];
                                                f3 = (f1 * c1 * (1 - c2) + f2 * c2 * (1 - c1)) / (c1 * (1 - c2) + c2 * (1 - c1));
                                                c3 = (c1 * (1 - c2) + c2 * (1 - c1)) / (c1 * (1 - c2) + c2 * (1 - c1) + (1 - c1) * (1 - c2));
                                                db.query("update t_similarity set Frequency = " + f3 + ",Confidence = " + c3 + " where Level1 = " + res[0]["Level1"] + " and  Level2 = " + res[0]["Level2"], function (err) {
                                                    if (err) {
                                                        console.log(err.message);
                                                        return;
                                                    }
                                                    cb();
                                                });

                                            }
                                            else {
                                                db.query("insert into t_similarity(Level1,Description1,Level2,Description2,Frequency,Confidence) values(" + results[ind]["conclusion"] + ",'" + des1 + "'," + fireLevelId + ",'" + des2 + "'," + f3 + "," + c3 + ")", function (err) {
                                                    if (err) {
                                                        console.log(err.message);
                                                        return;
                                                    }
                                                    cb();
                                                });
                                            }
                                        });
                                    }
                                ], function () {
                                    resultFuncCb();
                                })


                            }
                            resultFunc.ind = ind;
                            resultArrFunc[resultArrFunc.length] = resultFunc;
                        }
                        async.series(resultArrFunc, function () {
                            cab();
                        })

                    });
                }
            ], function () {
                cb();
            })


        }


        //
        //
        //for (; i < inputArrLength; i++) {
        //
        //        var obj = inputArr[i],
        //            title = obj.title.split('：')[0],
        //            detail = obj.detail,
        //            truth = obj.truth,
        //            id = obj.id;
        //        obj.truth1 = truth.split('(')[1].split(',')[0];
        //        obj.truth0 = truth.split(')')[0].split(',')[1];
        //
        //
        //        if ('t_firetype' !== id && Array.isArray(dbConfig.detail[id]) && detail) {
        //            midCounter2++;
        //            var dbStr = "select FireLevelid,FireLevelName from t_firelevel where " + dbConfig.detail[id][0] +
        //                " IN (select " + dbConfig.detail[id][0] + "  from " + id + " where " +
        //                dbConfig.detail[id][1] + "='" + detail + "')";
        //            var objbind = {
        //                input: obj,
        //                selectCb: function (err, results) {
        //                    if (err) {
        //                        res.status(200).send({returnState: -1, returnMsg: err.message});
        //                        console.log(err.message);
        //                        return
        //                    }
        //                    console.log(this.input)
        //
        //                    if (results.length > 0) { //查询成功
        //                        var arr = [];
        //
        //                        for (var i = 0; i < results.length; i++) {
        //                            arr.push(results[i]);   //储存搜索结果
        //                        }
        //
        //                        midResult.push({resultArr: arr, obj: this.input});
        //
        //                    }
        //                    midCounter++;
        //                    midHandler();
        //                }
        //            }
        //            db.query(dbStr, objbind.selectCb.bind(objbind));
        //        }
        //    }
        //
        //
        //    function midHandler() {
        //        if (midCounter === midCounter2) {
        //            console.log('\n');
        //            console.log(midResult);
        //
        //            function outer(index) {
        //                if (index >= midResult.length) {
        //                    decideTypeLevel();
        //                    return;
        //                }
        //                console.log('outer')
        //
        //                var obj = midResult[index],
        //                    resultArr = obj['resultArr'],
        //                    inputObj = obj['obj'];
        //
        //                function inner(ind) {
        //                    if (ind >= resultArr.length) {
        //                        outer(index + 1);
        //                        return;
        //                    }
        //                    console.log('inner')
        //
        //                    var resultObj = resultArr[ind];
        //                    var fireLevelId = resultObj['FireLevelid'];
        //                    var fireLevelName = resultObj['FireLevelName'],
        //                        f = inputObj.truth1,
        //                        c = inputObj.truth0;
        //                    //设置详细显示
        //                    tipStr += '（$事件*[' + inputObj.detail + ']→' + inputObj.title + '=> $事件→([' +
        //                        fireLevelName.split('火灾')[0] + '] &火灾)  (' + f + ',' + (0.9 * c) + ')</br>';
        //
        //
        //                    // 插进中间结论表---------
        //                    var sql = "select * from mConclusion where conclusion = " + fireLevelId;
        //
        //                    db.query(sql, function (err, results) {
        //                        if (err) {
        //                            res.status(200).send({returnState: -1, returnMsg: err.message});
        //                            console.log(err.message);
        //                            return
        //                        }
        //
        //                        if (results.length > 0) { //查询成功
        //                            var f2 = results[0]['f'],
        //                                c2 = results[0]['c'],
        //                                f1 = f * 1.0,
        //                                c1 = ( c * 0.9 * 1.0 * f);
        //
        //                            console.log("f=" + f + " c=" + c + "   f1:" + f1 + " c1=" + c1);
        //
        //                            f = (f1 * c1 * (1 - c2) + f2 * c2 * (1 - c1)) / (c1 * (1 - c2) + c2 * (1 - c1));
        //                            c = (c1 * (1 - c2) + c2 * (1 - c1)) / (c1 * (1 - c2) + c2 * (1 - c1) + (1 - c1) * (1 - c2));
        //
        //                            db.query("update mConclusion" + " set f=" + f +
        //                                ",c=" + c + " where conclusion = " + fireLevelId, function (err, results) {
        //                                if (err) {
        //                                    res.status(200).send({returnState: -1, returnMsg: err.message});
        //                                    console.log(err.message);
        //                                    return
        //                                }
        //                                inner(ind + 1);
        //                            });
        //                        } else {
        //                            db.query("insert into mConclusion(conclusion) values(" +
        //                                fireLevelId + ")", function (err, results) {
        //                                if (err) {
        //                                    res.status(200).send({returnState: -1, returnMsg: err.message});
        //                                    console.log(err.message);
        //                                    return
        //                                }
        //
        //                                f = f * 1.0;
        //                                c = ( c * 0.9 * 1.0 * f);
        //
        //                                db.query("update mConclusion" + " set f=" + f + ",c=" +
        //                                    c + " where conclusion = " + fireLevelId, function (err, results) {
        //                                    if (err) {
        //                                        res.status(200).send({returnState: -1, returnMsg: err.message});
        //                                        console.log(err.message);
        //                                        return
        //                                    }
        //                                    inner(ind + 1);
        //                                });
        //                            });
        //                        }
        //                    });
        //                }
        //
        //                inner(0)
        //            };
        //            outer(0);
        //        }
        //    }
        //
        //    function decideTypeLevel() {
        //        var f = 0,
        //            c = 0,
        //            f1 = 0,
        //            c1 = 0,
        //            type = '',
        //            typeId = 0;
        //        console.log(inputArr[1]['detail'] + '   34567')
        //        !function getType() {
        //            if (inputArr[1]['detail']) {
        //                type = inputArr[1]['detail'];
        //
        //                sql = "select FireTypeId  from t_firetype where FireTypeName='"
        //                    + type + "'";
        //                db.query(sql, function (err, results) {
        //                    if (err) {
        //                        console.log(err.message);
        //                        return
        //                    }
        //                    typeId = results[0]['FireTypeId'];
        //                    c = inputArr[1]['truth0'];
        //                    f = inputArr[1]['truth1'];
        //                    f1 = f = (f * 1.0);
        //                    c1 = c = (c * 0.9 * 1.0 * f);
        //                    console.log(('type= ' + type + " f=" + f + " c=" + c + ' typeId:' + typeId))
        //                    getLevel();
        //                })
        //            }
        //
        //        }();
        //        function getLevel() {
        //
        //            db.query('call findMax()', function (err, results) {
        //                if (err) {
        //                    console.log(err.message);
        //                    return
        //                }
        //                db.query("select * from t_conclusion ", function (err, results) {
        //                    if (err) {
        //                        console.log(err.message);
        //                        return
        //                    }
        //                    var f2 = results[0]['f'],
        //                        c2 = results[0]['c'],
        //                        id = results[0]['conclusion']
        //
        //                    console.log("最终级别：LevelId=" + id);
        //                    f = f1 * f2;
        //                    c = c1 * c2;
        //
        //                    sql = "select * from t_dispatch " + "where TypeId = " + typeId
        //                        + " AND LevelId = " + id + ";";
        //
        //                    db.query(sql, function (err, rs) {
        //                        if (err) {
        //                            console.log(err.message);
        //                            return
        //                        }
        //                        console.log(sql)
        //                        var conclu = rs[0]["DispatchId"],
        //                            FireFighterNum = rs[0]["FireFighterNum"],
        //                            Equipment = rs[0]["Equipment"],
        //                            resultStr = '\n' + "$事件→[火灾类别:" + typeId + " ]+[火灾级别:"
        //                                + id + " ] => $事件→(出动人数:" + FireFighterNum
        //                                + ")+(设备数目:" + Equipment + ")（"
        //                                + (1.0 * f) + "," + (0.9 * c)
        //                                + "）";
        //                        console.log(resultStr)
        //                        res.status(200).send({returnState: 1, dispatch: resultStr, tipStr: tipStr});
        //                        db.query("insert into t_conclusion values("
        //                            + conclu + "," + f + "," + c + ")", function (err) {
        //                            if (err) {
        //                                console.log(err.message);
        //                                return
        //                            }
        //                        });
        //
        //                    })
        //                })
        //
        //            })
        //        };
        //    }
        //


    }
};
