/**
 * Created by 58 on 2016/2/19 0019.
 */
define(function (require, exports, module) {

    var config = require('./config.js')

    var tableTitle = config['tableTitle'],
        thisPageName = '',
        component = {
            _window: $(window),
            loginArea: $('.loginArea'),
            popup: {
                main: $('.loginArea .popup'),   //弹窗本体
                closeBtn: $('.loginArea .popup .bar a'),//登录弹窗关闭按钮
                loginBtn: $('.loginArea .popup .buttons a').eq(0),  //登录按钮
                resetBtn: $('.loginArea .popup .buttons a').eq(1),  //重置按钮
                usernameInput: $('.loginArea .popup .username input'),  //用户名输入框
                pwdInput: $('.loginArea .popup .password input'),   //密码输入框
                tip: $('.loginArea .popup .tip')    //提示语输入框
            },
            popMsg: {
                main: $('.popArea'),
                text: $('.popArea .text'),
                close: $('.popArea .closeBtn'),
                icon: $('.popArea .icon')
            },
            buttons: {
                navBtns: $('nav>button'),
                knowledge: $('button.knowledge'),
                decision: $('button.decision'),
                system: $('button.system'),
                logout: $('nav button.logout'),
                login: $('nav button.login'),
                tools: $('.tools button')
            },
            page: {}
        },
        controller = {
            tools: {
                arrToTable: function (arr, orderArr) {

                    if (arr.length < 1) {
                        return '<table><tbody><tr><td style="font-size: 25px;color: red;line-height: 70px">查无此值</td></tr></tbody></table>';
                    }

                    var str = '<table>',
                        length = arr.length,
                        i = 0;
                    if (!orderArr) {
                        orderArr = [];
                        for (var name in arr[0]) {
                            orderArr.push(name);
                        }
                    }


                    for (var k = 0; k < orderArr.length; k++) {
                        str += '<th>' + tableTitle[thisPageName][orderArr[k]] + '</th>';
                    }

                    for (; i < length; i++) {
                        str += '<tr>';
                        for (var j = 0; j < orderArr.length; j++) {
                            str += '<td>' + arr[i][orderArr[j]] + '</td>';
                        }
                        str += '</tr>';
                    }

                    return str + '</table>';
                },
                loadImg: function (url, callback) {
                    var img = new Image();
                    img.src = url;
                    $(img).load(function () {
                        callback();
                    });
                }
            },

            component: {
                popMsg: function (type, text) { //设置某类型提示弹出框，显示传入文字

                    var centerShow = function (background, text, loading) {
                        var main = component.popMsg.main.clone(true);
                        $('body').append(main);
                        $('.text', main).text(text);

                        main.css({
                            top: (component._window.height() - component.popMsg.main.height()) / 2,
                            left: (component._window.width() - component.popMsg.main.width()) / 2,
                        });
                        $('.icon', main).css('background', background);
                        $('.closeBtn', main).hide();
                        if (!loading) {
                            main.slideDown(function () {
                                setTimeout(function () {
                                    main.slideUp(function () {
                                        main.remove();
                                    });
                                }, 500)
                            });
                        }
                        else if (loading) {
                            main.show();
                            return {
                                closeLoading: function () {
                                    main.remove();
                                }
                            }
                        }
                    };

                    var topShow = function (background, text) {
                        var main = component.popMsg.main.clone(true);
                        $('body').append(main);
                        $('.text', main).text(text).attr('title', text).css('font-size', '14px');
                        main.css({
                            top: -0,
                            left: (component._window.width() - component.popMsg.main.width()) / 2,
                        });
                        $('.icon', main).css('background', background);

                        main.slideDown();

                        setTimeout(function () {
                            main.slideUp(1000);
                        }, 5000)
                    }

                    switch (type) {
                        case 'success':
                            centerShow('url("../img/pop-mid.png") no-repeat center -17px', '操作成功');
                            break;
                        case 'fail':
                            topShow('url("../img/pop-mid.png") no-repeat center 9px', '操作失败：' + text);
                            break;
                        case 'loading':
                            return centerShow('url("../img/loading.gif") no-repeat center center', '请求中，请稍等', true);
                            break;
                        case 'error':
                            topShow('url("../img/pop-mid.png") no-repeat center 9px', '请检查网络连接');
                            break;
                        case 'loadingOther':
                            return centerShow('url("../img/loading.gif") no-repeat center center', text, true);
                            break;
                    }
                },
                popLogin: function () {
                    if (component.loginArea.attr('data-login') === 'false') {
                        component.loginArea.show();
                        component._window.trigger('resize');
                    }
                },
                addEventListener: function () {
                    component._window.bind('hashchange', function () {
                        console.log('df')
                        controller.page.switchPage(component._window[0].location.hash.split('#')[1])
                    });

                    component.popMsg.close.bind('click', function () {  //弹出消息框右上角按钮点击事件
                        $(this).parent().slideUp(function () {
                            $(this).remove();
                        })
                    });

                    component._window.bind('resize', function () {
                        component.popup.main.css({
                            top: (component._window.height() - component.popup.main.height()) / 2,
                            left: (component._window.width() - component.popup.main.width()) / 2,
                        });
                    });
                    component._window.bind('resize_resultPopDispatch', function () {

                        $('.resultPopDispatch').css({
                            top: (component._window.height() - $('.resultPopDispatch').height()) / 2,
                            left: (component._window.width() - $('.resultPopDispatch').width()) / 2,
                        });


                    });
                    component._window.bind('resize_resultPopExplain', function () {

                        $('.resultPopExplain').css({
                            top: (component._window.height() - $('.resultPopExplain').height()) / 2,
                            left: (component._window.width() - $('.resultPopExplain').width()) / 2,
                        });

                    });

                    component.popup.closeBtn.bind('click', function () {
                        component.loginArea.hide();
                    });
                    //登录键
                    component.popup.loginBtn.one('click', function login() {
                        var userName = component.popup.usernameInput.attr('value'),
                            pwd = component.popup.pwdInput.attr('value')

                        component.popup.tip.hide();

                        $.ajax({    //登录框点击登录
                            url: config.domain + 'authentication',
                            data: {method: 'login', username: userName, password: pwd},
                            type: 'POST',
                            dataType: 'json',
                            success: function (data) {
                                if (data.returnState) { //登录成功
                                    controller.component.popMsg('success');
                                    component.popup.tip.hide();
                                    component.loginArea.hide();
                                    component.buttons.login.hide();
                                    component.buttons.logout.show();
                                    window.location.reload();
                                } else {
                                    component.popup.tip.text('账号密码错误');
                                    component.popup.tip.show();
                                    component.popup.loginBtn.one('click', login);
                                }

                            },
                            error: function () {
                                component.popup.tip.text('请检查网络连接');
                                component.popup.tip.show();
                                component.popup.loginBtn.one('click', login);
                            }
                        })
                    });
                    component.popup.resetBtn.bind('click', function () {
                        component.popup.usernameInput.attr('value', '');
                        component.popup.pwdInput.attr('value', '');
                    });

                    component.buttons.login.bind('click', function () {
                        component.loginArea.show();
                    });
                    component.buttons.logout.bind('click', function () {
                        component.buttons.logout.text('注销中...');
                        component.buttons.logout.unbind();
                        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
                        if (keys) {
                            for (var i = keys.length; i--;)
                                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
                            window.location.reload();
                        }
                    });

                    component.buttons.navBtns.each(function () {
                        $(this).click(function (e) {
                            if ($(this).nextAll('div:eq(0)').css('display') === 'none') {
                                $('nav>div').each(function () {
                                    $(this).hide();
                                });
                                $('nav>div>div').each(function () {
                                    $(this).hide();
                                });
                                $(this).nextAll('div:eq(0)').show();
                            }
                            else {
                                $(this).nextAll('div:eq(0)').hide();
                            }
                            e.stopPropagation();

                        });
                    });

                    component._window.bind('click', function () {
                        $('nav>div').each(function () {
                            $(this).hide();
                        });
                    });
                    //含有二级选项的一级选项点击事件
                    $('nav>div>a:not(.btn21,.btn22,.btn31,.btn32,.btn33,.btn41,.btn42)').each(function () {
                        $(this).click(function (e) {
                            e.stopPropagation();
                        });
                        $(this).mouseover(function () {
                            $('nav>div>div').each(function () {
                                $(this).hide();
                            });
                            $(this).nextAll('div:eq(0)').show();
                        })
                    });
                    $('nav>div>div>a,nav>div>a.btn21,nav>div>a.btn22, nav>div>a.btn31,nav>div>a.btn32,nav>div>a.btn33, nav>div>a.btn41, nav>div>a.btn42').each(function () {
                        $(this).click(function (e) {
                            window.location.hash=($(this).attr('data-pageName'));
                        });
                    })


                },
                loginFirst: function () {
                    component.popup.tip.text('请先登录');
                    component.loginArea.show();
                    component.popup.tip.show();
                    component._window.trigger('resize');
                },
                getInput: function () { //辅助决策页面获得所有输入
                    var input = [];
                    $('.information .items .item').each(function (i) {
                        var options = $("option:selected", $(this));
                        input.push({
                            title: $('.tag', $(this)).text(),
                            detail: options.eq(1).text() ? options.eq(0).text() : $('input', $(this)).val(),
                            truth: options.eq(1).text() || options.eq(0).text(),
                            name: $('.tag', $(this)).attr('data-id')
                        });
                    });
                    return input;
                }
            },
            page: {
                getOptions: function () {   //生成派遣方案页面动态获取数据库选项数据
                    $.ajax({
                        url: config.domain + 'getoptions',
                        data: {},
                        type: "GET",
                        dataType: 'json',
                        success: function (data) {
                            var result = data['result'];
                            for (var name in result) {
                                var str = '<option></option>';
                                for (var i = 0, j = result[name].length; i < j; i++) {
                                    str += '<option>' + result[name][i] + '</option>';
                                }
                                $('span[data-id="' + name + '"]').siblings('.right').find('select:eq(0)').html(str)
                            }
                        },
                        error: function () {
                            controller.component.popMsg('error');
                        }
                    })
                },
                switchPage: function (pageName) {
                    thisPageName = pageName;
                    $('.content').html($('#' + pageName).text());
                    if (pageName.indexOf('add') > -1 || pageName.indexOf('modi') > -1) {
                        controller.page.initPage.commonInit();
                    }
                    else {
                        controller.page.initPage[pageName]();
                    }
                    // window.location.hash = pageName;
                   

                },

                initPage: {
                    index: function () {
                    },
                    firehouseConfig: function () {
                        {
                            // var map = new AMap.Map('container', {
                            //         zoom: 10,
                            //         center: [117.39, 39.1]
                            //     }),
                            //     inputPos = new AMap.LngLat(117.39, 39.1);
                            // console.log(inputPos)

                            // AMap.service(["AMap.PlaceSearch"], function () {
                            //     var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                            //         pageSize: 50,
                            //         type: '消防机关',
                            //         pageIndex: 1,
                            //         city: "022", //城市
                            //         citylimit: true,
                            //         map: map
                            //     });
                            //
                            //
                            //     placeSearch.searchNearBy('', inputPos, 50000, function (status, result) {
                            //         console.log(result)
                            //         var arr = result.poiList.pois;
                            //         for (var ind = 0, indj = arr.length; ind < indj; ind++) {
                            //             var obj = arr[ind];
                            //             console.log(obj.name);
                            //             $.ajax({
                            //                     url: config.domain + 'insertfirehouse',
                            //                     data: {obj:JSON.stringify(obj) },
                            //                     type: "POST",
                            //                     dataType: 'json',
                            //                     success: function (data) {
                            //                         console.log(data);
                            //
                            //                     }
                            //                 }
                            //             );
                            //
                            //         }
                            //     });
                            // });
                        }

                        var pop = controller.component.popMsg('loading');
                        $.ajax({    //获取消防站配置数据
                            url: config.domain + 'firehouse',
                            type: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                pop.closeLoading();
                                if (data.returnState === -2) {
                                    controller.component.loginFirst();
                                }
                                else if (data.returnState === 1) {

                                    var obj = data['data'],
                                        commonFunction = controller.page.initPage.commonFunction;

                                    $('.table').html(controller.tools.arrToTable(obj));
                                    commonFunction.filter(obj, true);

                                    commonFunction.addTitle();
                                    commonFunction.initBotInput(obj, {});
                                    commonFunction.submitBtnsInit('firehouse');
                                    commonFunction.tableChooseAble();
                                    $('.content .botInput>span:eq(1)>input').attr('readonly', "readonly");
                                    $('.content .botInput>span:eq(1)>input').css({
                                        'backgroundColor': 'rgb(226, 226, 226)',
                                        'color': 'rgb(120, 120, 120)',
                                        'cursor': 'no-drop'
                                    });
                                    $('.content .botInput>span:eq(2)>input').attr('readonly', "readonly");
                                    $('.content .botInput>span:eq(2)>input').css({
                                        'backgroundColor': 'rgb(226, 226, 226)',
                                        'color': 'rgb(120, 120, 120)',
                                        'cursor': 'no-drop'
                                    });

                                }
                            },
                            error: function () {
                                pop.closeLoading();
                                controller.component.popMsg('error');
                            }
                        })

                    },
                    textDispatch: function () {
                        $('.content .textDispatchBtns .back').click(function () {
                            window.location.hash=('index');
                        });
                        $('.content .textDispatchBtns .reset').click(function () {
                            controller.component.popMsg('success');
                            controller.page.switchPage('textDispatch');
                        });

                        var textArea = $('.textDispatch'),
                            arr = config.textDispatch,
                            i = 0,
                            str = '',
                            inputArr = [];

                        function showTipText(i) {

                            if (i === arr.length) {

                                if (inputArr.length < 3) {
                                    controller.component.popMsg('fail', '必须输入一项火灾详情，请重新输入！');
                                    return;
                                }
                                var pop = controller.component.popMsg('loading');
                                $.ajax({    //提交以决策
                                    url: config.domain + 'generatedispatch',
                                    data: {data: JSON.stringify(inputArr)},
                                    type: 'POST',
                                    dataType: 'json',
                                    success: function (data) {
                                        pop.closeLoading();
                                        if (data.returnState === -2) {
                                            controller.component.loginFirst();
                                        }
                                        else if (data.returnState === 1) {

                                            var dispatch = data.dispatch.replace(/<\/br>/g, '\n'),
                                                tipStr = data.tipStr.replace(/<\/br>/g, '\n');
                                            str += '\n决策方案如下：\n' + dispatch + '\n解释如下：\n' + tipStr;
                                            textArea.val(str);
                                            textArea[0].scrollTop = textArea[0].scrollHeight;
                                        }
                                    },
                                    erorr: function () {
                                        controller.component.popMsg('error');
                                        pop.closeLoading();
                                    }
                                });
                                $(window).unbind('keydown.textDispatch');
                                return;
                            }
                            str += '\n' + arr[i].text + '\n';
                            textArea.val(str);
                            textArea[0].scrollTop = textArea[0].scrollHeight;
                        };
                        showTipText(i);

                        $(window).bind('keydown.textDispatch', function (e) {
                            if (e.keyCode === 13) {
                                e.preventDefault();
                                var newTotalText = textArea.val();
                                var newText = newTotalText.split(str)[1]

                                if (!newText) {
                                    if (arr[i].name !== 't_firetype') {
                                        newTotalText += '已忽略该问题\n';
                                        textArea.val(newTotalText)
                                        str = newTotalText;
                                        showTipText(++i);
                                    }
                                    else {
                                        newTotalText += '此项必填\n';
                                        textArea.val(newTotalText)
                                        str = newTotalText;
                                        showTipText(i);
                                    }

                                }
                                else {

                                    if (newText.indexOf(arr[i].title) > -1 && newText.indexOf('[') > -1 && newText.indexOf(']') > -1 && newText.indexOf('{') > -1 && newText.indexOf('}') > -1) {
                                        var truths = newText.split(arr[i].title)[1].replace('\n', ''),
                                            detail = newText.split('[')[1].split(']')[0],
                                            pos = newText.split('{')[1].split('}')[0];

                                        inputArr[0] = {
                                            "title": "发生地点：",
                                            "detail": pos,
                                            "truth": "肯定(1.0,0.9)",
                                            "name": "t_pos"
                                        }
                                        inputArr.push({
                                            "title": arr[i].title + "：",
                                            "detail": detail,
                                            "truth": truths,
                                            "name": arr[i].name
                                        })
                                        var pop = controller.component.popMsg('loading');

                                        $.ajax({
                                            url: config.domain + 'textDispatch',
                                            data: {
                                                title: arr[i].title,
                                                detail: detail,
                                                truth: truths,
                                                name: arr[i].name,
                                                pos: pos
                                            },
                                            type: "POST",
                                            dataType: 'json',
                                            success: function (data) {
                                                pop.closeLoading();
                                                newTotalText += '\n' + data.data;
                                                textArea.val(newTotalText)
                                                str = newTotalText;
                                                showTipText(++i);
                                            },
                                            error: function () {
                                                controller.component.popMsg('error');
                                                pop.closeLoading();
                                            }
                                        });
                                    }
                                    else {
                                        newTotalText += '\n输入有误\n';
                                        textArea.val(newTotalText)
                                        str = newTotalText;
                                        showTipText(i);
                                    }
                                }
                            }
                        })

                    },
                    exportToWiki: function () {
                        var tables = config['exportToWiki'],
                            leftTableArea = $('#exportToWikiPad .leftPad .tableArea center'),
                            rightTableArea = $('#exportToWikiPad .rightPad .tableArea center'),
                            tableStrLeft = '<table><tr><th>表名</th><th>备注</th><th>导出页面名</th><th>操作</th></tr>';

                        function dealGet(data) {
                            controller.component.popMsg('success');
                            var tableStr = '<table><tr><th>页面名</th><th>操作</th></tr>';
                            for (var i = 0; i < data.length; i++) {
                                if (data[i]['title'] !== '首页') {
                                    var str = '<tr>';
                                    str += '<td class="tableName"><a style="text-decoration: underline;" target="_blank" href="http://localhost/mediawiki/index.php/' + data[i]['title'] + '">' + data[i]['title'] + '</a></td><td><a href="javascript:;" class="delete">删除</a></td>';
                                    str += '</tr>';
                                    tableStr += str;
                                }

                            }
                            tableStr += '</table>';

                            rightTableArea.html(tableStr);
                            $('.delete').each(function () {
                                $(this).click(function () {
                                    var title = $(this).parent().siblings('.tableName').text();
                                    var pop = controller.component.popMsg('loading');
                                    $.ajax({
                                        url: config.domain + 'exporttowiki',
                                        data: {type: 'delete', title: title},
                                        type: 'POST',
                                        dataType: 'json',
                                        success: function (e) {
                                            pop.closeLoading();
                                            if (e['returnState']) {
                                                dealGet(e['data'][1]);
                                            }
                                            else {
                                                controller.component.popMsg('fail', data.returnMsg);
                                            }
                                        },
                                        error: function () {
                                            controller.component.popMsg('error');
                                            pop.closeLoading();
                                        }
                                    });
                                })

                            });
                        }

                        var pop = controller.component.popMsg('loading');

                        $.ajax({
                            url: config.domain + 'exporttowiki',
                            data: {type: 'get'},
                            type: 'POST',
                            dataType: 'json',
                            success: function (e) {
                                pop.closeLoading();
                                if (e['returnState']) {
                                    dealGet(e['data'][1]);
                                }
                                else {
                                    controller.component.popMsg('fail', data.returnMsg);
                                }
                            },
                            error: function () {
                                controller.component.popMsg('error');
                                pop.closeLoading();
                            }
                        });

                        for (var tableName in tables) {
                            var str = '<tr>';
                            str += '<td class="tableName">' + tableName + '</td><td>' + tables[tableName] + '</td><td  class="title"><input placeholder="' + tables[tableName] + '"></td><td><a href="javascript:;" class="exportEach">导出</a></td>';
                            str += '</tr>';
                            tableStrLeft += str;
                        }
                        tableStrLeft += '</table>';

                        leftTableArea.html(tableStrLeft);

                        $('#exportToWikiPad .back').click(function () {
                            window.location.hash=('index');
                        });

                        $('.exportEach').each(function () {
                            $(this).click(function () {
                                var tableName = $(this).parent().siblings('.tableName').text(),
                                    title = $(this).parent().siblings('.title').find('input').val() ||
                                        $(this).parent().siblings('.title').find('input').attr('placeholder');
                                var pop = controller.component.popMsg('loading');
                                $.ajax({
                                    url: config.domain + 'exporttowiki',
                                    data: {type: 'add', num: 'one', tableName: tableName, title: title},
                                    type: 'POST',
                                    dataType: 'json',
                                    success: function (e) {
                                        pop.closeLoading();
                                        if (e['returnState']) {
                                            dealGet(e['data'][1]);
                                        }
                                        else {
                                            controller.component.popMsg('fail', data.returnMsg);
                                        }
                                    },
                                    error: function () {
                                        controller.component.popMsg('error');
                                        pop.closeLoading();
                                    }
                                });
                            })
                        });
                        $('.exportAll').click(function () {
                            var tableNameArr = [],
                                titleArr = [];

                            leftTableArea.find('tr').each(function (ind) {
                                if (ind) {
                                    tableNameArr[tableNameArr.length] = $(this).find('.tableName').text();
                                    titleArr[titleArr.length] = $(this).find('.title input').val() ||
                                        $(this).find('.title input').attr('placeholder');
                                }
                            });
                            var pop = controller.component.popMsg('loading');

                            $.ajax({
                                url: config.domain + 'exporttowiki',
                                data: {
                                    type: 'add',
                                    num: 'all',
                                    data: JSON.stringify({tableName: tableNameArr, title: titleArr})
                                },
                                type: 'POST',
                                dataType: 'json',
                                success: function (e) {
                                    pop.closeLoading();
                                    if (e['returnState']) {
                                        dealGet(e['data'][1]);
                                    }
                                    else {
                                        controller.component.popMsg('fail', data.returnMsg);
                                    }
                                },
                                error: function () {
                                    controller.component.popMsg('error');
                                    pop.closeLoading();
                                }
                            });
                        })

                    },
                    generateDispatch: function () {

                        controller.page.getOptions();

                        controller.map.mapInit();

                        !function initLeftRightBtn() {

                            console.log($('.leftRightBtn').width())
                            $('.leftRightBtn').css({
                                left: (40 - 50 * ($('.leftRightBtn').width() / $('.content').width())) + '%'
                            })
                            $('.leftRightBtn').bind('mousedown', function (e) {
                                e.preventDefault();
                                var pageX = e.pageX

                                console.log('down')
                                $(document).bind('mousemove.leftRightMove', function (e) {
                                    $('.leftRightBtn').animate({
                                        left: '+=' + (e.pageX - pageX)
                                    }, 0)
                                    pageX = e.pageX;

                                    var left = $('.leftRightBtn').offset().left - $('.leftRightBtn').parent().offset().left + 0.5 * $('.leftRightBtn').width()

                                    $('.content .information').width(left)
                                    $('.content .result').width(998 - left)
                                })
                                $(document).one('mouseup', function (em) {
                                    $(document).unbind('mousemove.leftRightMove');
                                    console.log(' ' + $('.leftRightBtn').offset().left)

                                })

                            });


                        }();


                        var resultPopDispatch = $('.result .resultPopDispatch');
                        resultPopDispatch.find('.bar a').click(function (e) {
                            resultPopDispatch.hide();
                            e.stopPropagation();
                        });

                        var resultPopExplain = $('.result .resultPopExplain');
                        resultPopExplain.find('.bar a').click(function (e) {
                            resultPopExplain.hide();
                            e.stopPropagation();
                        });

                        $('.content .result .bar').mousedown(function (e) {
                            var pageX = e.pageX,
                                pageY = e.pageY,
                                that = $(this);

                            $(window).one('mouseup', function () {
                                $(window).unbind('mousemove.resultPop')
                            });
                            $(window).bind('mousemove.resultPop', function (e) {
                                that.parent().animate({
                                    top: '+=' + (e.pageY - pageY),
                                    left: '+=' + (e.pageX - pageX)

                                }, 0)
                                pageX = e.pageX;
                                pageY = e.pageY;
                            });

                        });

                        $('.content .back').click(function () {
                            window.location.hash=('index');
                        })

                        $('.content .buttons .explain').click(function () {
                            if (resultPopExplain.find('.text').text()) {
                                $(window).trigger('resize_resultPopExplain');
                                resultPopExplain.show();
                            }
                            else {
                                controller.component.popMsg('fail', '请先提交派遣信息');

                            }
                        });


                        $('.dispatchShowArea .close').click(function () {
                            $('.dispatchShowArea').slideUp();
                        });


                        var thisPageComponent = component.page['generateDispatch'] || {};
                        thisPageComponent.inputArea = thisPageComponent.inputArea || $('.content .information .buttons button');
                        thisPageComponent.resultText = thisPageComponent['resultText'] || $('.content .result textarea');
                        component.page['generateDispatch'] = thisPageComponent;

                        //点击确认键
                        $('.content .information .buttons button').eq(0).click(function () {
                            var item = $('.information .items .item');
                            if (!item.eq(0).find('input').val()) {
                                controller.component.popMsg('fail', '请输入火灾发生地点');
                                return;
                            }
                            if (!item.eq(1).find('select:eq(0) option:selected').text()) {
                                controller.component.popMsg('fail', '请选择火灾类别');
                                return;
                            }
                            for (var ind = 2; ind < item.length; ind++) {
                                if (item.eq(ind).find('select:eq(0) option:selected').text()) {
                                    break;
                                }
                            }
                            if (ind === item.length) {
                                controller.component.popMsg('fail', '请选择火灾详情');
                                return;
                            }

                            var str = '',
                                i = 0,
                                input = controller.component.getInput();
                            for (; i < input.length; i++) {
                                var obj = input[i];
                                str += i + ': ' + obj.title + obj.kind + ', ' + obj.truth + '\n';
                            }
                            component.page['generateDispatch'].resultText.text(str + 'computing...\n');
                            var pop = controller.component.popMsg('loading');

                            $.ajax({    //提交以决策
                                url: config.domain + 'generatedispatch',
                                data: {data: JSON.stringify(input)},
                                type: 'POST',
                                dataType: 'json',
                                success: function (data) {
                                    pop.closeLoading();
                                    if (data.returnState === -2) {
                                        controller.component.loginFirst();
                                    }
                                    else if (data.returnState === 1) {
                                        // {   //结果弹窗
                                        //     resultPopDispatch.show();
                                        //     resultPopDispatch.find('.text').html(data['dispatch']);
                                        //     resultPopExplain.find('.text').html(data['tipStr']);
                                        //     $(window).trigger('resize_resultPopDispatch');
                                        // }

                                        $('.dispatchShowArea .dispatchText').html(data['dispatch']);

                                        $('.dispatchShowArea').slideDown(function () {
                                            $('#copyBtn').zclip({
                                                path: 'js/ZeroClipboard10.swf',
                                                copy: $('.dispatchShowArea .dispatchText').text(),
                                                afterCopy: function () {
                                                    controller.component.popMsg('success');

                                                }
                                            });

                                            var str = data['dispatch'].replace(/[<\/br>|' ']/g, '');


                                            controller.map.dispatchToMap($('.content .information .item input').eq(0).val(),
                                                parseInt(str.split('出动人数：')[1].split('名消防员设备数目')[0], 10),
                                                str.split('设备数目：')[1].split('事件频率')[0]);


                                        });


                                        resultPopExplain.find('.text').html(data['tipStr']);


                                    }
                                },
                                error: function () {
                                    controller.component.popMsg('error');
                                    pop.closeLoading();
                                }
                            });
                        });

                    },

                    commonInit: function () {
                        var type = thisPageName.indexOf('add') > -1 ? 'add' : 'modi',
                            path = '',
                            commonFunction = controller.page.initPage.commonFunction;
                        path = thisPageName.split(type)[1].toLowerCase();

                        var pop = controller.component.popMsg('loading');

                        if (type === 'add') {
                            $.ajax({    //获取初始add页面功能
                                url: config.domain + '' + path,
                                type: 'GET',
                                dataType: 'json',
                                success: function (data) {

                                    pop.closeLoading();

                                    if (data.returnState === -2) {
                                        controller.component.loginFirst();
                                    }
                                    else if (data.returnState === 1) {


                                        var selectFields = thisPageName.indexOf('Learn') > -1 ? {} : {
                                            Frequency: ['0.5', '0.6', '0.7', '0.8', '0.9', '1.0'],
                                            Confidence: ['0.5', '0.6', '0.7', '0.8', '0.9']
                                        }

                                        $('.table').html(controller.tools.arrToTable(data.data));

                                        commonFunction.addTitle();
                                        commonFunction.filter(data.data);
                                        commonFunction.initBotInput(data.data, selectFields);
                                        commonFunction.submitBtnsInit(path);
                                        commonFunction.tableChooseAble();

                                    }
                                },
                                error: function () {
                                    controller.component.popMsg('error');
                                    pop.closeLoading();

                                }
                            })
                        }
                        else if (type === 'modi') {

                            $.ajax({    //获取初始modi页面功能
                                url: config.domain + '' + path,
                                type: 'GET',
                                dataType: 'json',
                                success: function (data) {
                                    pop.closeLoading();

                                    if (data.returnState === -2) {
                                        controller.component.loginFirst();
                                    }
                                    else if (data.returnState === 1) {

                                        var selectFields = thisPageName.indexOf('Learn') > -1 ? {} : {
                                            Frequency: ['0.5', '0.6', '0.7', '0.8', '0.9', '1.0'],
                                            Confidence: ['0.5', '0.6', '0.7', '0.8', '0.9']
                                        }

                                        $('.table').html(controller.tools.arrToTable(data.data));
                                        commonFunction.addTitle();
                                        commonFunction.filter(data.data, true);
                                        commonFunction.initBotInput(data.data, selectFields);
                                        commonFunction.submitBtnsInit(path);
                                        commonFunction.tableChooseAble();

                                    }
                                },
                                error: function () {
                                    pop.closeLoading();

                                    controller.component.popMsg('error');
                                }
                            })
                        }
                    },
                    commonFunction: {
                        addTitle: function () { //添加窗口标题
                            var titleText = $('nav>div a[data-pageName=' + thisPageName + ']').text()
                            $('.content').prepend('<h1>' + titleText + '</h1>');
                        }
                        ,
                        tableChooseAble: function () {     //设置table可选中
                            var add = thisPageName.indexOf('add') > -1 ? true : false;

                            if (!add) {
                                //id input不可输入
                                $('.content .botInput>span:eq(0)>input').attr('readonly', "readonly");
                                $('.content .botInput>span:eq(0)>input').css({
                                    'backgroundColor': 'rgb(226, 226, 226)',
                                    'color': 'rgb(120, 120, 120)',
                                    'cursor': 'no-drop'
                                });
                            }
                            $('.table table').addClass('chooseAble');
                            //tr选中效果
                            $('.table tr:not(.table tr:first-child)').each(function () {
                                $(this).click(function () {
                                    if (!add) {
                                        $(this).siblings().removeClass('choosed');
                                        $(this).addClass('choosed');
                                    }
                                    //为下方输入框自动填充选中内容
                                    $('td', $(this)).each(function (i) {
                                        var thisTd = $(this);
                                        if ($('.content .botInput>span:eq(' + i + ')>input').length > 0) {
                                            $('.content .botInput>span:eq(' + i + ')>input').val($(this).text())
                                        }
                                        else {
                                            $('.content .botInput>span:eq(' + i + ')>select option').each(function () {
                                                if (parseFloat($(this).text()) === parseFloat(thisTd.text())) {
                                                    $(this)[0].selected = true;
                                                }
                                            })
                                        }
                                    })
                                });
                            });
                        }
                        ,
                        filter: function (originArr, tableChooseAble) {  //设置顶部过滤查询功能
                            !function initSelect() {
                                var str = '';
                                for (var name in originArr[0]) {
                                    str += '<option data-name="' + name + '">' + tableTitle[thisPageName][name] + '</option>';
                                }

                                $('.content .twoInputLine select').html(str)
                            }();


                            var input = $('.content .twoInputLine input');

                            $('.content .twoInputLine button').click(function () {
                                var condition = $('.content .twoInputLine option:selected').attr('data-name'), //查询条件
                                    value = input.val(),    //查询值
                                    arr = [];
                                if (value === '') { //值为空时显示所有
                                    $('.table').html(controller.tools.arrToTable(originArr));
                                    if (tableChooseAble) {
                                        controller.page.initPage.commonFunction.tableChooseAble();
                                    }
                                }
                                else {  //否则显示对应结果
                                    for (var i = 0; i < originArr.length; i++) {

                                        if (originArr[i][condition] == value) {
                                            arr.push(originArr[i]);
                                        }
                                    }
                                    $('.table').html(controller.tools.arrToTable(arr));
                                    if (tableChooseAble) {
                                        controller.page.initPage.commonFunction.tableChooseAble();
                                    }
                                }
                            })
                        }
                        ,
                        initBotInput: function (originArr, selectFields) {//设置底部输入框
                            var str = '';

                            for (var name in originArr[0]) {
                                if (name in selectFields) {
                                    var str2 = '';
                                    for (var i = 0; i < selectFields[name].length; i++) {
                                        str2 += '<option>' + selectFields[name][i] + '</option>';
                                    }
                                    str += '<span><span class="title" data-name="' + name + '">' + tableTitle[thisPageName][name] + ':</span><select>' + str2 + '</select></span>';
                                }
                                else {
                                    str += '<span><span class="title" data-name="' + name + '">' + tableTitle[thisPageName][name] + ':</span><input type="text"  ></span>';
                                }
                            }
                            $('.botInput').html(str);
                        }
                        ,
                        submitBtnsInit: function (path) {   //设置底部按钮功能
                            function listener(btn, type, method) {  //根据传入不同参数，请求提交不同请求数据给服务器
                                return function () {
                                    var inputArr = [];
                                    $('.content .botInput>span').each(function () {
                                        var attrName = $('.title', $(this)).attr('data-name');
                                        var value = '';

                                        if ($('select', $(this)).length > 0) {
                                            value = $('select option:selected', $(this)).text();
                                        }
                                        else {
                                            value = $('input', $(this)).val();
                                        }
                                        var obj = {};
                                        obj[attrName] = value;
                                        inputArr.push(obj);
                                    });

                                    var pop = controller.component.popMsg('loading');

                                    $.ajax({    //提交修改表格
                                        url: config.domain + '' + path,
                                        data: {data: JSON.stringify(inputArr), method: method},
                                        type: type,
                                        dataType: 'json',
                                        success: function (data) {
                                            pop.closeLoading();
                                            if (data.returnState === -2) {
                                                controller.component.loginFirst();
                                                btn.one('click', listener(btn, type, method));
                                            }
                                            else if (data.returnState === -1) {
                                                controller.component.popMsg('fail', data.returnMsg);
                                                btn.one('click', listener(btn, type, method));
                                            }
                                            else if (data.returnState === 1) {
                                                controller.component.popMsg('success');
                                                controller.page.switchPage(thisPageName);
                                            }
                                        },
                                        error: function () {
                                            controller.component.popMsg('error');
                                            pop.closeLoading();
                                            btn.one('click', listener(btn, type, method));
                                        }
                                    });
                                };
                            }

                            $('.content .botBtns .add').one('click', listener($('.content .botBtns .add'), 'POST', 'ADD'));
                            $('.content .botBtns .modi').one('click', listener($('.content .botBtns .modi'), 'POST', 'UPDATE'));
                            $('.content .botBtns .delete').one('click', listener($('.content .botBtns .delete'), 'POST', 'DELETE'));

                            $('.content .botBtns .back').click(function () {
                                window.location.hash='index';
                            })
                        }
                        ,

                    },
                    autoGenerateDispatch: function () {
                        var pop = controller.component.popMsg('loading');

                        $.ajax({    //获取数据
                            url: config.domain + 'autoGenerateDispatch',
                            type: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                pop.closeLoading();
                                if (data.returnState === -2) {
                                    controller.component.loginFirst();
                                }
                                else if (data.returnState === 1) {

                                    var learnResult = data['learnResult'],
                                        similarityResult = data['similarityResult'];


                                    $('.table').eq(0).html(controller.tools.arrToTable(data['learnResult']));
                                    $('.table').eq(1).html(controller.tools.arrToTable(data['similarityResult']));

                                    controller.page.initPage.commonFunction.addTitle();
                                    $('.content .botBtns .back').click(function () {
                                        window.location.hash=('index');
                                    })
                                }
                            },
                            error: function () {
                                pop.closeLoading();
                                controller.component.popMsg('error');
                            }
                        })
                    },
                    password: function () {
                        var username = '',
                            tip = $('.content .password .tip'),
                            submit = $('.content .password .submit'),
                            inputs = $('.content .password input')
                        tip.text('注：每个操作员只能修改自己的密码');

                        try {
                            username = JSON.parse(decodeURIComponent(document.cookie).split('=j:')[1]).username;
                        }
                        catch (e) {
                        }
                        if (!username) {
                            controller.component.loginFirst();
                            return;
                        }

                        $('.content .password .username>span:eq(1)').text(username);

                        $('.content .password .back').click(function () {
                            window.location.hash=('index');
                        });
                        $('.content .password .reset').click(function () {
                            inputs.each(function () {
                                $(this).val('');
                            })
                        });
                        submit.one('click', function clickFunc() {
                            var obj = {
                                method: 'modiPwd',
                                username: $('.content .password .username>span:last-child').text(),
                                password: inputs.eq(0).val(),
                                newPwd: inputs.eq(1).val(),
                                reNewPwd: inputs.eq(2).val(),
                            }
                            if (!obj.reNewPwd || !obj.password || !obj.reNewPwd) {
                                tip.text('请填入必填项');

                                submit.one('click', clickFunc);
                            }

                            else if (obj.reNewPwd !== obj.newPwd) {
                                tip.text('两次新密码不一致');
                                submit.one('click', clickFunc);
                            }
                            else if (obj.password === obj.newPwd) {
                                tip.text('新旧密码一致');
                                submit.one('click', clickFunc);
                            }
                            else {
                                tip.text('提交中···');
                                var pop = controller.component.popMsg('loading');

                                $.ajax({    //提交修改密码
                                    url: config.domain + 'authentication',
                                    data: obj,
                                    type: 'POST',
                                    dataType: 'json',
                                    success: function (data) {
                                        pop.closeLoading();
                                        if (data.returnState) { //登录成功
                                            controller.component.popMsg('success');
                                            tip.text('修改密码成功');
                                            setTimeout(function () {
                                                window.location.reload();
                                            }, 500);
                                        } else {
                                            tip.text('密码错误');
                                            submit.one('click', clickFunc);
                                        }
                                    },
                                    error: function () {
                                        pop.closeLoading();

                                        tip.text('请检查网络连接');
                                        submit.one('click', clickFunc);
                                    }
                                })
                            }
                        });
                    }
                }
            },

            map: {
                map: null,
                mapInit: function () {
                    //基本地图加载
                    // controller.map.map = new AMap.Map('container', {
                    //     zoom: 10,
                    //     center: [117.39, 39.1]
                    // });
                    controller.map.map = $('#gaodeMap').leafletmaps({centre: '天津'});

                },
                dispatchToMap: function (pos, requirePeopleNum, devices) {
                    //controller.map.map.clearMap();
                    var arr = devices.split('、'),
                        requireDevicesArr = [],
                        relativePosArr = [],
                        firehouseArr = [],
                        inputPos = null,
                        pois = null
                    //设备需求种类和数量确定
                    for (var i = 0; i < arr.length; i++) {
                        var arr2 = arr[i].split('辆');
                        requireDevicesArr.push({
                            type: arr2[1],
                            num: config.wordToNum(arr2[0])
                        })
                    }
                    console.log(requireDevicesArr)

                    $.ajax({    //获取消防站配置数据
                        url: config.domain + 'firehouse',
                        type: 'GET',
                        dataType: 'json',
                        success: function (data) {

                            if (data.returnState === -2) {
                                controller.component.loginFirst();
                            }
                            else if (data.returnState === 1) {

                                firehouseArr = data['data']
                                getDispatchWithMap();
                            }
                        }
                    });

                    function getDispatchWithMap() { //根据消防点情况进行具体决策并绘制到页面
                        if (relativePosArr.length > 0 && requireDevicesArr.length > 0 && firehouseArr.length > 0
                            && requirePeopleNum && pois && inputPos) {
                            var firehouseObj = {},
                                dispatch = [];

                            for (var i = 0; i < firehouseArr.length; i++) {
                                firehouseObj[firehouseArr[i].Id] = {
                                    address: firehouseArr[i].address,
                                    devices: firehouseArr[i].devices,
                                    name: firehouseArr[i].name,
                                    peopleNum: firehouseArr[i].peopleNum
                                }
                            }

                            !function () {  //compute requireNum
                                var i = 0,
                                    sumBefore = 0,
                                    sumPeople = 0;


                                for (; i < relativePosArr.length; i++) {
                                    if(!firehouseObj[relativePosArr[i]]){
                                        console.log('no data with: ')
                                        console.log( pois[i])
                                        // controller.component.popMsg('fail', '服务器暂时无此消防中心数据：');
                                        continue;
                                    }
                                    var currentFirehousePeople = firehouseObj[relativePosArr[i]].peopleNum
                                    dispatch[i] = dispatch[i] || {};
                                    sumPeople += currentFirehousePeople;
                                    if (sumPeople >= requirePeopleNum) {
                                        dispatch[i].people = requirePeopleNum - sumBefore;
                                        return;
                                    }
                                    else {
                                        dispatch[i].people = currentFirehousePeople
                                    }
                                    sumBefore = sumPeople;
                                }
                            }();

                            for (var j = 0; j < requireDevicesArr.length; j++) {
                                !function () {
                                    var i = 0,
                                        sumBefore = 0,
                                        sumDevice = 0,
                                        deviceRequireNum = requireDevicesArr[j].num,
                                        deviceRequireType = requireDevicesArr[j].type;
                                    dispatch['device' + j] = {};
                                    dispatch['device' + j].deviceRequireType = deviceRequireType;
                                    dispatch['device' + j].deviceRequireNum = deviceRequireNum;
                                    for (; i < relativePosArr.length; i++) {
                                        var currentFirehouseDeviceNum = 0;

                                        dispatch[i] = dispatch[i] || {};

                                        if(!firehouseObj[relativePosArr[i]]){
                                             continue;
                                        }
                                        if (firehouseObj[relativePosArr[i]].devices.indexOf(deviceRequireType) > -1) {
                                            currentFirehouseDeviceNum = parseInt(firehouseObj[relativePosArr[i]].devices.split(deviceRequireType + ':')[1].split(',')[0], 10);
                                        }

                                        sumDevice += currentFirehouseDeviceNum;
                                        if (sumDevice >= deviceRequireNum) {
                                            dispatch[i]['device' + j] = deviceRequireNum - sumBefore;

                                            return;
                                        }
                                        else {
                                            dispatch[i]['device' + j] = currentFirehouseDeviceNum
                                        }
                                        sumBefore = sumDevice;
                                    }
                                }();
                            }
                            console.log(dispatch);

                            var lnglats = [],
                                sum = 0;
                            AMap.service(["AMap.Driving"], function () {    //寻路

                                for (i = 0; i < dispatch.length; i++) {
                                    var breakMark = true;
                                    for (var prop in dispatch[i]) {
                                        if (dispatch[i][prop] > 0) {
                                            breakMark = false;

                                        }
                                    }
                                    if (breakMark) {
                                        continue;
                                    }

                                    var driving = new AMap.Driving({
                                        map: controller.map.map,
                                    });
                                    var arr = [pois[i].location.lng, pois[i].location.lat];
                                    arr.index = i
                                    lnglats.push(arr);
                                    sum++;
                                    driving.search(pois[i].location, inputPos, function () {
                                        sum--;
                                        if (!sum) {
                                            setMark();
                                        }
                                    });
                                }
                            });
                            function setMark() {    //设置点的注释

                                var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
                                for (var i = 0, marker; i < lnglats.length; i++) {
                                    var marker = new AMap.Marker({
                                        position: lnglats[i],
                                        map: controller.map.map
                                    });

                                    var index = lnglats[i].index,
                                        id = relativePosArr[index];

                                    var str = '名称：' + firehouseObj[id].name + '</br>地址：' + firehouseObj[id].address +
                                        '</br>出动消防员：' + (dispatch[index].people || 0) + '</br>出动设备：</br>'

                                    for (var name in dispatch[index]) {
                                        if (name !== 'people' && dispatch[index][name]) {
                                            str += "&nbsp;&nbsp;&nbsp;&nbsp;" + dispatch[index][name] + '辆' + dispatch[name]['deviceRequireType'] + '</br>';
                                        }
                                    }

                                    marker.content = str;
                                    marker.on('click', markerClick);
                                }
                                function markerClick(e) {
                                    infoWindow.setContent(e.target.content);
                                    infoWindow.open(controller.map.map, e.target.getPosition());
                                    return false;
                                }
                            }
                        }
                    }


                    controller.map.map.clearMap();
                    AMap.service('AMap.Geocoder', function () {//回调函数
                        var geocoder = null;
                        //实例化Geocoder
                        geocoder = new AMap.Geocoder({
                            city: "022"
                        });

                        geocoder.getLocation(pos, function (status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                AMap.service(["AMap.Driving"], function () {

                                    inputPos = result.geocodes[0].location;

                                    AMap.service(["AMap.PlaceSearch"], function () {
                                        var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                                            pageSize: 50,
                                            type: '消防机关',
                                            pageIndex: 1,
                                            city: "022" ,//城市
                                            citylimit: true,
                                        });

                                        placeSearch.searchNearBy('', inputPos, 50000, function (status, result) {

                                            pois = result.poiList.pois;

                                            for (var ind = 0, indj = pois.length; ind < indj; ind++) {
                                                relativePosArr.push(pois[ind].id);
                                            }
                                            console.log(pois)
                                            getDispatchWithMap();
                                        });
                                    });
                                });
                            } else {
                                controller.component.popMsg('fail', '发生地点无法识别');
                            }
                        });
                    });
                }
            }
        },
        static = {};

    exports.init = function () {
        controller.component.addEventListener();
        controller.component.popLogin();
        controller.page.switchPage('index');  //默认页
        thisPageName = 'index';
        window.location.hash = thisPageName;
        controller.tools.loadImg('../img/pop-mid.png', function () {
        });
        controller.tools.loadImg('../img/loading.gif', function () {
        });

    };
})