/**
 * Created by 58 on 2016/2/19 0019.
 */
define(function (require, exports, module) {
    var $ = require('./jquery.js');
    var component = {
        _window: $(window),
        loginArea: $('.loginArea'),
        popup: {
            main: $('.loginArea .popup'),
            closeBtn: $('.loginArea .popup .bar a'),
            loginBtn: $('.loginArea .popup .buttons a').eq(0),
            resetBtn: $('.loginArea .popup .buttons a').eq(1),
            usernameInput: $('.loginArea .popup .username input'),
            pwdInput: $('.loginArea .popup .password input'),
            tip: $('.loginArea .popup .tip')
        }
    }

    exports.init = function () {
        addEventListener();
        popLogin();
        //  mapDemo();
        initBtn();
    };
    var initBtn = function () {
        btns.knowledge = $('.knowledge');
        btns.decision = $('.decision');
        btns.system = $('.system');
        btns.tools = $('.tools button');
        btns.inputArea = $('.information button');

        btns.inputArea.eq(0).click(function () {
            var input = [];
            $('.information .items .item').each(function (i) {
                var options = $("option:selected",$(this));
                input.push({
                    title:$('.tag',$(this)).text(),
                    kind:options.eq(0).text(),
                    truth:options.eq(1).text()
                });
            });
            console.log(input);
        })
    }

    var addEventListener = function () {
        component._window.bind('resize', function () {
            component.popup.main.css({
                top: (component._window.height() - component.popup.main.height()) / 2,
                left: (component._window.width() - component.popup.main.width()) / 2,
            })
        });

        component.popup.closeBtn.bind('click', function () {
            component.loginArea.hide();
        });

        component.popup.loginBtn.one('click', function login() {
            var userName = component.popup.usernameInput.attr('value'),
                pwd = component.popup.pwdInput.attr('value')

            component.popup.tip.hide();

            $.ajax({
                url: 'http://localhost:3000/authentication',
                data: {username: userName, password: pwd},
                type: 'POST',
                dataType:'json',
                success: function (data) {
                    if(data.returnState){
                        component.popup.tip.hide();
                        component.loginArea.hide();
                    }else{
                        component.popup.tip.text('账号密码错误');
                        component.popup.tip.show();
                        component.popup.loginBtn.one('click',login);
                    }

                },
                error: function () {
                    component.popup.tip.text('请检查网络连接');
                    component.popup.tip.show();
                    component.popup.loginBtn.one('click',login);
                }
            })
        });
        component.popup.resetBtn.bind('click', function () {
            component.popup.usernameInput.attr('value', '');
            component.popup.pwdInput.attr('value', '');
        });
    };
    var mapDemo = function () {
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
    };

    var popLogin = function () {
        //component.loginArea.show();
        component._window.trigger('resize');
    }
})