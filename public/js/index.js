/**
 * Created by 58 on 2016/2/19 0019.
 */
define(function (require, exports, module) {
    var $ = require('./jquery.js');

    var component = {
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
    };
    var controller = {
        tools: {
            arrToTable: function (arr, orderArr) {

                if (arr.length < 1) {
                    return '<table><tbody><tr><td>查无此值</td></tr></tbody></table>';
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


                for (var j = 0; j < orderArr.length; j++) {
                    str += '<th>' + [orderArr[j]] + '</th>';
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
        },

        component: {
            popLogin: function () {
                if (component.loginArea.attr('data-login') === 'false') {
                    component.loginArea.show();
                    component._window.trigger('resize');
                }
            },
            addEventListener: function () {

                component._window.bind('resize', function () {
                    component.popup.main.css({
                        top: (component._window.height() - component.popup.main.height()) / 2,
                        left: (component._window.width() - component.popup.main.width()) / 2,
                    })
                });

                component.popup.closeBtn.bind('click', function () {
                    component.loginArea.hide();
                });
                //登录键
                component.popup.loginBtn.one('click', function login() {
                    var userName = component.popup.usernameInput.attr('value'),
                        pwd = component.popup.pwdInput.attr('value')

                    component.popup.tip.hide();

                    $.ajax({
                        url: 'http://localhost:3000/authentication',
                        data: {username: userName, password: pwd},
                        type: 'POST',
                        dataType: 'json',
                        success: function (data) {
                            if (data.returnState) { //登录成功
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
                $('nav>div>a:not(.btn21,.btn22,.btn31)').each(function () {
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
                $('nav>div>div>a,nav>div>a.btn21,nav>div>a.btn22, nav>div>a.btn31').each(function () {
                    $(this).click(function (e) {
                        controller.page.switchPage($(this).attr('data-function'));
                    });
                })


            },
            loginFirst: function () {
                component.popup.tip.text('请先登录');
                component.loginArea.show();
                component.popup.tip.show();
                component._window.trigger('resize');
            },
            getInput: function () {
                var input = [];
                $('.information .items .item').each(function (i) {
                    var options = $("option:selected", $(this));
                    input.push({
                        title: $('.tag', $(this)).text(),
                        kind: options.eq(1).text() ? options.eq(0).text() : $('input', $(this)).val(),
                        truth: options.eq(1).text() || options.eq(0).text()
                    });
                });
                return input;
            }
        },
        page: {
            switchPage: function (pageName) {
                $('.content').html($('#' + pageName).text());

                controller.page.initPage.commonInit(pageName)

            },
            common: {
                tableChooseAble:function(){     //设置table可选中
                    //id input不可输入
                    $('.content .botInput>span:eq(0)>input').attr('readonly',"readonly");
                    $('.content .botInput>span:eq(0)>input').css('backgroundColor','#CCC');

                    //tr选中效果
                    $('.table table').addClass('chooseAble');
                    $('.table tr:not(.table tr:first-child)').each(function () {
                        $(this).click(function () {
                            $(this).siblings().removeClass('choosed');
                            $(this).addClass('choosed');
                            $('.choosed td').each(function (i) {
                                var thisTd = $(this);
                                if($('.content .botInput>span:eq('+i+')>input').length>0){
                                    $('.content .botInput>span:eq('+i+')>input').val($(this).text())
                                }
                                else{
                                    $('.content .botInput>span:eq('+i+')>select option').each(function () {
                                        if(parseFloat($(this).text()) ===parseFloat(thisTd.text())){
                                            $(this)[0].selected=true;
                                        }
                                    })
                                }


                            })

                        });
                    });
                },
                filter: function (originArr,tableChooseAble) {  //设置顶部过滤查询功能
                    var input = $('.content .twoInputLine input');

                    $('.content .twoInputLine button').click(function () {
                        var condition = $('.content .twoInputLine option:selected').text(), //查询条件
                            value = input.val(),    //查询值
                            arr = [];
                        if (value === '') { //值为空时显示所有
                            $('.table').html(controller.tools.arrToTable(originArr));
                            if(tableChooseAble){
                                controller.page.common.tableChooseAble();
                            }
                        }
                        else {  //否则显示对应结果
                            for (var i = 0; i < originArr.length; i++) {

                                if (originArr[i][condition] == value) {
                                    arr.push(originArr[i]);
                                }
                            }
                            $('.table').html(controller.tools.arrToTable(arr));
                            if(tableChooseAble){
                                controller.page.common.tableChooseAble();
                            }
                        }
                    })
                },
                initBotInput: function (originArr,selectFields) {//设置底部输入框
                    var str = ''

                    for (var name in originArr[0]) {
                        if (name in selectFields) {
                            var str2 = '';
                            for (var i = 0; i < selectFields[name].length; i++) {
                                str2 += '<option>' + selectFields[name][i] + '</option>';
                            }
                            str += '<span><span class="title">' + name + ':</span><select>' + str2 + '</select></span>';
                        }
                        else {
                            str += '<span><span class="title">' + name + ':</span><input type="text"  ></span>';
                        }
                    }
                    $('.botInput').html(str);
                },
                submitBtnsInit: function (pageName,path) {
                    function listener(btn,type,method){
                        return  function () {
                            var inputArr = [];
                            $('.content .botInput>span').each(function () {
                                var attrName = $('.title',$(this)).text();
                                var value = '';

                                if($('select',$(this)).length>0){
                                    value = $('select option:selected',$(this)).text();
                                }
                                else{
                                    value = $('input',$(this)).val();
                                }
                                var obj = {};
                                obj[attrName]=value;
                                inputArr.push(obj);
                            });

                            $.ajax({
                                url: 'http://localhost:3000/'+path,
                                data: {data: JSON.stringify(inputArr),method:method},
                                type: type,
                                dataType: 'json',
                                success: function (data) {
                                    if (data.returnState === -2) {
                                        controller.component.loginFirst();
                                        btn.one('click',listener(btn,type,method));
                                    }
                                    else if (data.returnState === -1) {
                                        alert(data.returnMsg);
                                        btn.one('click',listener(btn,type,method));
                                    }
                                    else if (data.returnState === 1) {
                                        controller.page.switchPage(pageName);
                                    }
                                },
                                error: function () {
                                    alert('请检查网络连接');
                                    btn.one('click',listener(btn,type,method));
                                }
                            });
                        };
                    }

                    $('.content .botBtns .add').one('click', listener($('.content .botBtns .add'),'POST','ADD'));
                    $('.content .botBtns .modi').one('click', listener($('.content .botBtns .modi'),'POST','UPDATE'));
                    $('.content .botBtns .delete').one('click', listener($('.content .botBtns .delete'),'POST','DELETE'));

                    $('.content .botBtns .back').click(function () {
                        controller.page.switchPage('index');
                    })
                },

            },
            initPage: {
                generateDispatch: function () {
                    var thisPageComponent = component.page['generateDispatch'] || {};
                    thisPageComponent.inputArea = thisPageComponent.inputArea || $('.content .information .buttons');
                    thisPageComponent.resultText = thisPageComponent['resultText'] || $('.content .result textarea');
                    component.page['generateDispatch'] = thisPageComponent;

                    //点击确认键
                    component.page['generateDispatch'].inputArea.eq(0).click(function () {
                        var str = '',
                            i = 0,
                            input = controller.component.getInput();
                        for (; i < input.length; i++) {
                            var obj = input[i];
                            str += i + ': ' + obj.title + obj.kind + ', ' + obj.truth + '\n';
                        }
                        component.page['generateDispatch'].resultText.text(str + 'computing...\n');
                        $.ajax({
                            url: 'http://localhost:3000/decision',
                            data: {data: JSON.stringify(input)},
                            type: 'POST',
                            dataType: 'json',
                            success: function (data) {
                                if (data.returnState === -2) {
                                    controller.component.loginFirst();
                                }
                                else if (data.returnState === 1) {
                                    component.page['generateDispatch'].resultText.text(str + '\n 结果如下： \n' + data.returnMsg + '\n');
                                }
                            },
                            error: function () {
                                alert('请检查网络连接');
                            }
                        });
                    });

                },

                commonInit: function (pageName){
                    var type=pageName.indexOf('add')>-1?'add':'modi',
                        path='';
                     path = pageName.split(type)[1].toLowerCase();

                    console.log(pageName+' '+pageName.indexOf('add')+' '+path);
                    if(type==='add'){
                        $.ajax({
                            url:  'http://localhost:3000/'+path,
                            type: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                if (data.returnState === -2) {
                                    controller.component.loginFirst();
                                }
                                else if (data.returnState === 1) {
                                    var  selectFields = {
                                        Frequency: ['0.5', '0.6', '0.7', '0.8', '0.9', '1.0'],
                                        Confidence: ['0.5', '0.6', '0.7', '0.8', '0.9']
                                    }

                                    $('.table').html(controller.tools.arrToTable(data.data));


                                    controller.page.common.filter(data.data);
                                    controller.page.common.initBotInput(data.data,selectFields);
                                    controller.page.common.submitBtnsInit(pageName,path);

                                }
                            },
                            error: function () {
                                alert('请检查网络连接')
                            }
                        })
                    }
                    else if(type==='modi'){
                        $.ajax({
                            url:  'http://localhost:3000/'+path,
                            type: 'GET',
                            dataType: 'json',
                            success: function (data) {
                                if (data.returnState === -2) {
                                    controller.component.loginFirst();
                                }
                                else if (data.returnState === 1) {
                                    var  selectFields = {
                                        Frequency: ['0.5', '0.6', '0.7', '0.8', '0.9', '1.0'],
                                        Confidence: ['0.5', '0.6', '0.7', '0.8', '0.9']
                                    }

                                    $('.table').html(controller.tools.arrToTable(data.data));

                                    controller.page.common.filter(data.data,true);
                                    controller.page.common.initBotInput(data.data,selectFields);
                                    controller.page.common.submitBtnsInit(pageName,path);
                                    controller.page.common.tableChooseAble();

                                }
                            },
                            error: function () {
                                alert('请检查网络连接')
                            }
                        })
                    }
                } ,


                generateDispatch: function () {

                },
                autoGenerateDispatch: function () {

                },
                modiPassword: function () {

                }

            }
        },

        map: {
            mapInit: function () {
                //基本地图加载
                var map = new AMap.Map('container');

                //步行导航
                AMap.service(["AMap.Driving"], function () {
                    var driving = new AMap.Driving({
                        map: map
                        //panel: "panel"
                    }); //构造路线导航类
                    // 根据起终点坐标规划步行路线
                    driving.search([
                        {keyword: '北京市地震局(公交站)'},
                        {keyword: '亦庄文化园(地铁站)'}
                    ]);
                });
            }
        }
    }

    exports.init = function () {
        controller.component.addEventListener();
        controller.component.popLogin();
        controller.page.switchPage('addFireLevel');  //默认页

        //controller.map.mapInit();
    };
})