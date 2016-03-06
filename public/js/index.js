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
            knowledge: $('.knowledge'),
            decision: $('.decision'),
            system: $('.system'),
            logout: $('nav button.logout'),
            login: $('nav button.login'),
            tools: $('.tools button'),
            inputArea: $('.information button')
        },
        resultText: $('.content .result textarea')
    };
    var controller = {
        component: {
            popLogin: function () {
                if (component.loginArea.attr('data-login') === 'false') {
                    component.loginArea.show();
                    component._window.trigger('resize');
                }
            },
            addEventListener: function () {
                //点击确认键
                component.buttons.inputArea.eq(0).click(function () {
                    var str = '',
                        i = 0,
                        input = controller.component.getInput();


                    for (; i < input.length; i++) {
                        var obj = input[i];
                        str += i + ': ' + obj.title + obj.kind + ', ' + obj.truth + '\n';
                    }

                    component.resultText.text(str + 'computing...\n');

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
                                component.resultText.text(str + '\n 结果如下： \n' + data.returnMsg + '\n');
                            }
                        },
                        error: function () {
                            console.log('fail');
                        }
                    });
                });

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
            },
            loginFirst: function () {
                component.popup.tip.text('请先登录');
                component.loginArea.show();
                component.popup.tip.show();

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
                console.log(input);
                return input;
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
        //controller.map.mapInit();
    };
})