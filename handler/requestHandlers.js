/**
 * Created by 58 on 2016/3/1 0001.
 */
var express = require('express');
var db = require('./db');
var dbConfig = require('./dbconfig');
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
        console.log('start-------------------------------------------------')
        var inputArr = JSON.parse(req.body.data),
            str = '',
            i = 0,
            tipStr = '',
            dispatchStr = '',
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
            ],
            function () {
                console.log('清除之前记录完毕')

                var inputDetailArr = [];

                for (; i < inputArrLength; i++) {

                    var func = function (inputArrLengthcb) {
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
                                        var id = arguments.callee.id;

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

                                                    console.log(name + ': ' + fireLevelName);
                                                    tipStr += '（$事件*[' + detail + ']→' + title + '=> $事件→([' +
                                                        fireLevelName.split('火灾')[0] + '] &火灾)  (' + obj.truth1 + ',' + (0.9 * obj.truth0 ) + ')</br>';

                                                    var m_conclusion = function (ccb) {
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
                                                                var f = 1.0 * obj.truth1,
                                                                    c = (obj.truth0 * 0.9 * 1.0 * obj.truth1),
                                                                    f1 = results[0]['f'],
                                                                    c1 = results[0]['c'];
                                                                f = (f * c * (1 - c1) + f1 * c1 * (1 - c)) / (c * (1 - c1) + c1 * (1 - c));
                                                                c = (c * (1 - c1) + c1 * (1 - c)) / (c * (1 - c1) + c1 * (1 - c) + (1 - c) * (1 - c1));
                                                                db.query("update mConclusion" +
                                                                    " set f=" + f + ",c=" + c + " where conclusion = " + fireLevelId, function () {
                                                                    ccb();

                                                                });
                                                            }
                                                            else {

                                                                var f3 = 1.0 * obj.truth1,
                                                                    c3 = (obj.truth0 * 0.9 * 1.0 * obj.truth1);
                                                                db.query('insert into mConclusion(conclusion,f,c) values(' + fireLevelId + ',' + f3 + ',' + c3 + ')', function () {
                                                                    ccb();
                                                                });

                                                            }
                                                        })

                                                    }

                                                    if (dbConfig.learnAndSimiLater.indexOf(name) < 0) {
                                                        learnAndSimi(fireLevelId, id, detail, function () {
                                                            console.log('learnAndSimiBefore')
                                                            m_conclusion(callback);
                                                        })
                                                    }
                                                    else {

                                                        console.log('learnAndSimiLater')
                                                        m_conclusion(function () {
                                                            learnAndSimi(fireLevelId, id, detail, function () {
                                                                callback();
                                                            })
                                                        });

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
                                    inputArrLengthcb();
                                })
                            });
                        }
                        else {
                            console.log('done a detail')
                            inputArrLengthcb();
                        }
                    }

                    func.i = i;
                    inputDetailArr[inputDetailArr.length] = func;
                }


                async.series(inputDetailArr, function (err, values) {
                    console.log('遍历所有火情输入完毕');
                    var f = 0,
                        c = 0,
                        f1 = 0,
                        c1 = 0,
                        fireTypeId = 0,
                        typeId = 0,
                        LevelId = 0;

                    async.series([
                        function getType(cb) {
                            var fireTypeInput = inputArr[1]['detail'],
                                truth = inputArr[1].truth,
                                f = truth.split('(')[1].split(',')[0],
                                c = truth.split(')')[0].split(',')[1];

                            db.query("select FireTypeId  from t_firetype where FireTypeName='" + fireTypeInput + "'", function (err, results) {
                                if (err) {
                                    console.log(err.message);
                                    return
                                }

                                fireTypeId = results[0]['FireTypeId'];
                                typeId = fireTypeId;

                                tipStr += "{" + inputArr[0]['detail'] + "}" + "*" + "[" + fireTypeInput + "]" + "→火灾类别" + "=> {" + inputArr[0]['detail'] + "}→"
                                    + "(" + fireTypeInput + ")（" + (1.0 * f) + "," + (0.9 * c) + "）</br>"

                                f = (f * 1.0);
                                c = (c * 0.9 * 1.0 * f);
                                f1 = f;
                                c1 = c;

                                console.log("f=" + f + " c=" + c + '  typeId:  ' + fireTypeId);
                                cb();
                            })
                        },
                        function getConclusionFromMconclusion(cb) {
                            db.query("select * from mconclusion", function (err, results) {
                                if (err) {
                                    console.log(err.message);
                                    return
                                }
                                var funcArr = [];
                                for (var ind = 0; ind < results.length; ind++) {

                                    var func = function (cab) {
                                        var ind = arguments.callee.ind;
                                        var f = results[ind]['f'],
                                            c = results[ind]['c'],
                                            mconclu = results[ind]['conclusion'];

                                        function commonFunc(levelSql, levelGet, callback) {
                                            db.query("select * from tempSimilarity where " + levelSql + "=" + mconclu, function (err, res) {
                                                if (err) {
                                                    console.log(err.message);
                                                    return
                                                }
                                                var funcTempArr = [];
                                                for (var indTemp = 0; indTemp < res.length; indTemp++) {//1382

                                                    var funcTemp = function (cabTemp) {
                                                        var indTemp = arguments.callee.indTemp,
                                                            levelDetail = res[indTemp][levelGet],
                                                            tf = res[indTemp]['Frequency'],
                                                            tc = res[indTemp]['Confidence']

                                                        if (tc > 0.5) {
                                                            f = f * tf;//根据已有中间结论和 中间结论推理规则 计算新的f值
                                                            c = c * tc * f * tf;

                                                            //插进中间结论表---------
                                                            var newId = levelDetail;
                                                            db.query("select * from mConclusion where conclusion = " + newId, function (err, resu) {
                                                                if (err) {
                                                                    console.log(err.message);
                                                                    return
                                                                }
                                                                if (resu.length > 0) {
                                                                    var f1 = f,
                                                                        c1 = c,
                                                                        f2 = resu[0]["f"],
                                                                        c2 = resu[0]["c"],
                                                                        f3 = (f1 * c1 * (1 - c2) + f2 * c2 * (1 - c1)) / (c1 * (1 - c2) + c2 * (1 - c1)),
                                                                        c3 = (c1 * (1 - c2) + c2 * (1 - c1)) / (c1 * (1 - c2) + c2 * (1 - c1) + (1 - c1) * (1 - c2));

                                                                    db.query("update mConclusion" +
                                                                        " set f=" + f3 + ",c=" + c3 + " where conclusion = " + newId, function (err) {
                                                                        if (err) {
                                                                            console.log(err.message);
                                                                            return
                                                                        }
                                                                        cabTemp();
                                                                    });


                                                                } else {
                                                                    var f3 = f,
                                                                        c3 = c;
                                                                    db.query("insert into mConclusion(conclusion,f,c) values(" + newId + ", " + f3 + "," + c3 + ")", function (err) {
                                                                        if (err) {
                                                                            console.log(err.message);
                                                                            return
                                                                        }
                                                                        cabTemp();

                                                                    });
                                                                }
                                                            });

                                                        } else {
                                                            cabTemp();
                                                        }

                                                    }
                                                    funcTemp.indTemp = indTemp;
                                                    funcTempArr[funcTempArr.length] = funcTemp;
                                                }
                                                async.series(funcTempArr, function () {
                                                    callback();
                                                });
                                            });

                                        };

                                        async.series([
                                                function (callback) {
                                                    //1380
                                                    commonFunc("Level1", "Level2", callback)
                                                },
                                                function (callback) {
                                                    //1426
                                                    commonFunc("Level2", "Level1", callback)
                                                }
                                            ],
                                            function () {
                                                cab();
                                            })


                                    }
                                    func.ind = ind;
                                    funcArr[funcArr.length] = func;

                                }
                                async.series(funcArr, function () {
                                    cb();
                                });

                            });
                        },
                        function getLevel(cb) { //1262
                            async.series([
                                    function (cab) {//调用存储过程    1265
                                        console.log('findmaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
                                        db.query("call findMax()", function (err, results) {
                                            if (err) {
                                                console.log(err.message);
                                                return;
                                            }
                                            cab();
                                        });
                                    },
                                    function (cab) {    //1270
                                        db.query("select * from t_conclusion", function (err, results) {
                                            if (err) {
                                                console.log(err.message);
                                                return;
                                            }
                                            var funcArr = [];
                                            for (var ind = 0; ind < results.length; ind++) {
                                                var func = function (calb) {
                                                    var ind = arguments.callee.ind,
                                                        f2 = results[ind]['f'],
                                                        c2 = results[ind]['c'],
                                                        fireLevelDes = '';
                                                    LevelId = results[ind]['conclusion'];
                                                    switch (parseInt(LevelId)) {
                                                        case 11:
                                                            fireLevelDes = "一级";
                                                            break;
                                                        case 12:
                                                            fireLevelDes = "二级";
                                                            break;
                                                        case 13:
                                                            fireLevelDes = "三级";
                                                            break;
                                                        case 14:
                                                            fireLevelDes = "四级";
                                                            break;
                                                        case 15:
                                                            fireLevelDes = "五级";
                                                            break;
                                                        default:
                                                            fireLevelDes = "";
                                                    }
                                                    console.log(("最终级别Dao：LevelId=" + LevelId));
                                                    //交集运算
                                                    f = f1 * f2;
                                                    c = c1 * c2;

                                                    db.query("select * from t_dispatch " +
                                                        "where TypeId = " + typeId + " AND LevelId = " + LevelId + ";", function (err, results) {
                                                            if (err) {
                                                                console.log(err.message);
                                                                return;
                                                            }
                                                            if (results.length > 0) {
                                                                var conclu = results[0]["DispatchId"],
                                                                    FireFighterNum = results[0]["FireFighterNum"],
                                                                    Equipment = results[0]["Equipment"];
                                                                tipStr += "{" + inputArr[0]['detail'] + "}DAO" +
                                                                    "→[火灾类别 " + inputArr[1]['detail'] + "]+[火灾级别 " + fireLevelDes + "] =>" + "{" + inputArr[0]['detail'] + "}" + "→(出动人数:" + FireFighterNum + ")+(设备数目:" + Equipment + ")（" + (1.0 * f) + "," + (0.9 * c) + "）</br>";

                                                                dispatchStr += "出动人数:" + FireFighterNum + "\n设备数目:" + Equipment +
                                                                    '\n' + "（Frequency=" + (1.0 * f) + ",Confidence=" + (0.9 * c) + "）</br>";
                                                                console.log(dispatchStr);

                                                                db.query("insert into t_conclusion values(" + conclu + "," + f + "," + c + ")", function (err, results) {
                                                                    if (err) {
                                                                        console.log(err.message);
                                                                        return;
                                                                    }
                                                                    calb();
                                                                });

                                                            }
                                                            else {
                                                                console.log('未找到派遣方案\n\n' + LevelId)
                                                                dispatchStr = '未找到派遣方案————火灾类别： ' + typeId + '  火灾级别: ' + LevelId;
                                                                calb();
                                                            }
                                                        }
                                                    )

                                                };
                                                func.ind = ind;
                                                funcArr[funcArr.length] = func;
                                            }
                                            async.series(funcArr, function () {
                                                cab();
                                            })
                                        });

                                    },
                                    function (cab) {//1346
                                        db.query("select * from t_learn where Condition1 in(select input from t_input) AND Condition2 in(select input from t_input)", function (err, results) {
                                            if (err) {
                                                console.log(err.message);
                                                return;
                                            }
                                            var funcArr = [];
                                            for (var ind = 0; ind < results.length; ind++) {
                                                var func = function (calb) {
                                                    var ind = arguments.callee.ind,
                                                        des1 = results[ind]["Description1"],
                                                        des2 = results[ind]["Description2"];

                                                    f = results[ind]["Frequency"];
                                                    c = results[ind]["Confidence"];

                                                    tipStr += "{$事件}→([" + des1 + "])=> {$事件}→([" + des2 + "](" + f + "," + c + ")</br>" /*"新习得知识："+des1+"+"+des2+"("+f+","+c+")"*/;
                                                    calb();
                                                };
                                                func.ind = ind;
                                                funcArr[funcArr.length] = func;
                                            }
                                            async.series(funcArr, function () {
                                                cab();
                                            })
                                        });

                                    },
                                    function (cab) {//1355
                                        db.query("select * from t_similarity where Level1 in (select conclusion from t_input) AND Level2 in(select conclusion from t_input)", function (err, results) {
                                            if (err) {
                                                console.log(err.message);
                                                return;
                                            }
                                            var funcArr = [];
                                            for (var ind = 0; ind < results.length; ind++) {
                                                var func = function (calb) {
                                                    var ind = arguments.callee.ind,
                                                        des1 = results[ind]["Description1"],
                                                        des2 = results[ind]["Description2"];

                                                    f = results[ind]["Frequency"];
                                                    c = results[ind]["Confidence"];

                                                    tipStr += "{$事件}→([" + des1 + "])=> {$事件}→([" + des2 + "](" + f + "," + c + ")</br>" /*"新习得知识："+des1+"+"+des2+"("+f+","+c+")"*/;
                                                    calb();
                                                };
                                                func.ind = ind;
                                                funcArr[funcArr.length] = func;
                                            }
                                            async.series(funcArr, function () {
                                                cab();
                                            })
                                        });
                                    }
                                ],
                                function () {
                                    cb();
                                })
                        }

                    ], function () {
                        console.log('all done\n' + tipStr + '\n\n' + dispatchStr);

                        res.status(200).send({returnState: 1, dispatch: dispatchStr, tipStr: tipStr});
                    })
                })
            });


        function learnAndSimi(fireLevelId, id, detail, cback) {
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
                                            var f3 = f;
                                            var c3 = c;
                                            db.query("insert into mConclusion(conclusion,f,c) values(" + conclusion + "," + f3 + "," + c3 + ")", function (err, results) {
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
                                    });
                                }
                                else {
                                    resultFuncCb();
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
                        var resultArrFunc = [];

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
                console.log('learnandSimi完毕')
                cback();
            })
        }
    }
};
