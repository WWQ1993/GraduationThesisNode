/**
 * JavaScript for Leaflet in the Maps extension.
 * @see https://www.mediawiki.org/wiki/Extension:Maps
 *
 * @author Pavel Astakhov < pastakhov@yandex.ru >
 */


(function ($, mw) {
    $.fn.leafletmaps = function (options) {
        var map=null;
        var _this = this;
        // this.map = null;
        this.options = options;
		//console.log(options);
        /**
         * array point of all map elements (markers, lines, polygons, etc.)
         * for map fit
         */
        this.points = [];

        /**
         * Creates a new marker with the provided data,
         * adds it to the map, and returns it.
         * @param {Object} markerData Contains the fields lat, lon, title, text and icon
         * @return {L.Marker}
         */
        this.addMarker = function (properties) {
            this.points.push(new AMap.Marker(markerOptions));

            // if (properties.icon === '') {
            //     var icon = new L.Icon.Default();
            // } else {
            //     var icon = new L.Icon({
            //         iconUrl: properties.icon
            //     });
            // }

            var markerOptions = {
                title: properties.title,
                // icon: icon
                map: map,
                position: [properties.lat, properties.lon]
            };


            var marker = AMap.Marker(markerOptions);
            // if (properties.text.length > 0) marker.bindPopup(properties.text);
        };

        this.addLine = function (properties) {
            var options = {
                color: properties.strokeColor,
                weight: properties.strokeWeight,
                opacity: properties.strokeOpacity
            };

            var latlngs = [];
            for (var x = 0; x < properties.pos.length; x++) {
                latlngs.push([properties.pos[x].lat, properties.pos[x].lon]);
                this.points.push(new L.LatLng(properties.pos[x].lat, properties.pos[x].lon));
            }

            L.polyline(latlngs, options).addTo(this.map);
        };

        /**
         * TODO: check this
         */
        this.addPolygon = function (properties) {
            var options = {
                color: properties.strokeColor,
                weight: properties.strokeWeight,
                opacity: properties.strokeOpacity,
                fill: properties.fill !== false, // TODO: check this
                fillColor: properties.fillColor,
                fillOpacity: properties.fillOpacity
            };

            var latlngs = [];
            for (var x = 0; x < properties.pos.length; x++) {
                latlngs.push([properties.pos[x].lat, properties.pos[x].lon]);
                this.points.push(new L.LatLng(properties.pos[x].lat, properties.pos[x].lon));
            }

            L.Polygon(latlngs, options).addTo(this.map);
        };

        /**
         * TODO: check this
         */
        this.addCircle = function (properties) {
            this.points.push(new L.LatLng(properties.centre.lat - properties.radius, properties.centre.lon - properties.radius)); // TODO: check this
            this.points.push(new L.LatLng(properties.centre.lat + properties.radius, properties.centre.lon + properties.radius)); // TODO: check this

            var options = {
                color: properties.strokeColor,
                weight: properties.strokeWeight,
                opacity: properties.strokeOpacity,
                fill: properties.fill !== false, // TODO: check this
                fillColor: properties.fillColor,
                fillOpacity: properties.fillOpacity
            };

            L.Circle([properties.centre.lat, properties.centre.lon], properties.radius, options).addTo(this.map);
        };

        /**
         * TODO: check this
         */
        this.addRectangle = function (properties) {
            this.points.push(new L.LatLng(properties.sw.lat, properties.sw.lon));
            this.points.push(new L.LatLng(properties.ne.lat, properties.ne.lon));

            var options = {
                color: properties.strokeColor,
                weight: properties.strokeWeight,
                opacity: properties.strokeOpacity,
                fill: properties.fill !== false, // TODO: check this
                fillColor: properties.fillColor,
                fillOpacity: properties.fillOpacity
            };

            var bounds = [[properties.sw.lat, properties.sw.lon], [properties.ne.lat, properties.ne.lon]];

            L.rectangle(bounds, options).addTo(this.map);
        };

        this.setup = function () {


            var mapOptions = {
                zoom: 13,
            };
            /*-------------------------主界面----------------------------*/
            var div = this.get(0);
            div.id = "gaodeMap";
            var panel = document.createElement("div");
            panel.id = "panel";
            div.appendChild(panel);
            
            

            /*-------------------------右侧地图布局----------------------------*/

            var container = document.createElement("div");
            container.id = "container";
            div.appendChild(container);

            if (options.minzoom !== false) mapOptions.minZoom = options.minzoom;
            if (options.maxzoom !== false) mapOptions.maxZoom = options.maxzoom;

            map= new AMap.Map("container", mapOptions);

            this.map = map;
            map.plugin(["AMap.ToolBar"], function () {
                var type = new AMap.ToolBar();
                map.addControl(type);
            })


            //重加载地图函数
            function reLoadMap() {
                var cent = map.getCenter();
                var lang = map.getLang();
                var z = map.getZoom();
                map = new AMap.Map("container", {
                    center: [cent.lng, cent.lat]
                });
                map.setZoom(z);
                map.setLang(lang);
                map.addControl(new AMap.ToolBar());
            }


            /*-------------------------左侧主界面----------------------------*/
            var containerLeft = document.createElement("div");
            containerLeft.id = "left";
            div.appendChild(containerLeft);
            /*-----------------------------------------------------*/


            /*--------------------------地图基本功能---------------------------*/

            var text = document.createElement("h6");
            text.innerHTML = "地图基本功能";
            text.id = "text";
            containerLeft.appendChild(text);

            var div1 = document.createElement("div");
            div1.id = "div1";
            containerLeft.appendChild(div1);

//放大
            var bigger = document.createElement("input");
            bigger.type = "button";
            bigger.value = "地图放大";
            bigger.id = "big";
            bigger.class = "button";
            div1.appendChild(bigger);
            document.getElementById("big").addEventListener("click", function () {
                map.zoomIn();
            });

//缩小
            var small = document.createElement("input");
            small.type = "button";
            small.value = "地图缩小";
            small.id = "small";
            small.class = "button";
            div1.appendChild(small);
            document.getElementById("small").addEventListener("click", function () {
                map.zoomOut();
            });

//左移
//            var left = document.createElement("input");
//            left.type = "button";
//            left.value = "左移地图";
//            left.id = "leftpan";
//            div1.appendChild(left);
//            var timeLeft=null;
//            function Left() {
//                map.panBy(-100,0);
//                timeLeft=setTimeout(function () {
//                    Left();
//                },300)
//            }
//            document.getElementById("leftpan").addEventListener("mousedown", function () {
//                Left()
//            });
//            document.getElementById("leftpan").addEventListener("mouseup",function () {
//                clearTimeout(timeLeft);
//            })
//            document.getElementById("leftpan").addEventListener("mouseout",function () {
//                clearTimeout(timeLeft);
//            })
          
            
//鼠标画线
          var sbhuaxian = document.createElement("input");
          sbhuaxian.type = "button";
          sbhuaxian.value = "鼠标画线";
          sbhuaxian.id = "huaxian";
          div1.appendChild(sbhuaxian);
        
          AMap.event.addDomListener(document.getElementById("huaxian"), "click", function() {
        	  map.plugin(["AMap.MouseTool"],function(){
          	    var mousetool = new AMap.MouseTool(map);   	 
          	    	mousetool.polyline();
          	  });
        	   
        	}, false);
         

            

        //鼠标画面
          var sbhuamian = document.createElement("input");
          sbhuamian.type = "button";
          sbhuamian.value = "鼠标画面";
          sbhuamian.id = "huamian";
          div1.appendChild(sbhuamian);
        
          AMap.event.addDomListener(document.getElementById("huamian"), "click", function() {
        	  map.plugin(["AMap.MouseTool"],function(){
          	    var mousetool = new AMap.MouseTool(map);   	 
          	    	  mousetool.polygon();
          	    	  mousetool.measureArea();
          	  });
        	   
        	}, false);

        //测量距离
          var ceju = document.createElement("input");
          ceju.type = "button";
          ceju.value = "测量距离";
          ceju.id = "cj";
          div1.appendChild(ceju); 
          map.plugin(["AMap.RangingTool"],function(){
    		  ruler = new AMap.RangingTool(map);   
    	        AMap.event.addListener(ruler,"end",function(e){  
    	            ruler.turnOff();  
    	         });          
      	  });
          AMap.event.addDomListener(document.getElementById("cj"), "click", function() {
        	    ruler.turnOn();     	   
        	});

        //实时路况
            var sslk = document.createElement("input");
            sslk.id = "lk";
            sslk.type = "button";
            sslk.value = "实时路况";
            div1.appendChild(sslk);
           
            var trafficLayer = new AMap.TileLayer.Traffic({
                zIndex: 10
            });
            trafficLayer.setMap(map);
        	
            var isVisible = true;
            AMap.event.addDomListener(document.getElementById('lk'), 'click', function() {
                if (isVisible) {
                    trafficLayer.hide();
                    isVisible = false;
                } else {
                    trafficLayer.show();
                    isVisible = true;
                }
            }, false);   
            
            
        
            
//2D地图
            var square = document.createElement("input");
            square.type = "button";
            square.value = "平面地图";
            square.id = "square";
            div1.appendChild(square);

            document.getElementById("square").addEventListener("click", function () {
                map.plugin(["AMap.MapType"], function () {
                    var type = new AMap.MapType({
                        defaultType: 0,
                        // showTraffic:true,
                        // showRoad:true
                    });
                    map.addControl(type);
                    type.hide();
                });
            });

//卫星地图
            var stereo = document.createElement("input");
            stereo.type = "button";
            stereo.value = "卫星地图";
            stereo.id = "stereo";
            div1.appendChild(stereo);
            document.getElementById("stereo").addEventListener("click", function () {
                map.plugin(["AMap.MapType"], function () {
                    var type = new AMap.MapType({
                        defaultType: 1,
                        showTraffic: true,
                        showRoad: true
                    });
                    map.addControl(type);
                    type.hide();
                });
            });

//中文地图
            var zh_cn = document.createElement("input");
            zh_cn.type = "button";
            zh_cn.value = "中文地图";
            zh_cn.id = "zh_cn";
            div1.appendChild(zh_cn);


//英文地图
            var en = document.createElement("input");
            en.type = "button";
            en.value = "英文地图";
            en.id = "en";
            div1.appendChild(en);

//中英对照地图
            var zh_en = document.createElement("input");
            zh_en.type = "button";
            zh_en.value = "中英对照";
            zh_en.id = "zh_en";
            div1.appendChild(zh_en);

            ["zh_cn", "en", "zh_en"].forEach(function (btn) {
                var btn = document.getElementById(btn);
                btn.addEventListener("click", function () {
                    map.setLang(this.id);
                });
            });

//开始标记点
            var flag;
            var startMarker = document.createElement("input");
            startMarker.type = "button";
            startMarker.id = "startMarker";
            startMarker.value = "开始标记点";
            div1.appendChild(startMarker);
            document.getElementById("startMarker").addEventListener("click", function () {
                if (flag) {
                    AMap.event.removeListener(flag);//移除地图事件，以绑定时返回的对象作为参数
                }
                reLoadMap();
                flag = AMap.event.addListener(map, "click", function (e) {
                    new AMap.Marker({
                        position: e.lnglat,
                        map: map
                    });
                });
            });

//结束标记点
            var stopMarker = document.createElement("input");
            stopMarker.type = "button";
            stopMarker.id = "stopMarker";
            stopMarker.value = "结束标记点";
            div1.appendChild(stopMarker);


            AMap.event.addDomListener(document.getElementById("stopMarker"), "click", function () {
                AMap.event.removeListener(flag);
            });//给div绑定单击事件

//清空地图
            var clear = document.createElement("input");
            clear.type = "button";
            clear.id = "clear";
            clear.value = "清空地图";
            div1.appendChild(clear);
            document.getElementById("clear").addEventListener("click", function () {
                map.clearMap();
            });

//重加载地图
            var reLoad = document.createElement("input");
            reLoad.type = "button";
            reLoad.id = "reload";
            reLoad.value = "重新加载";
            div1.appendChild(reLoad);
            document.getElementById("reload").addEventListener("click", function () {
                reLoadMap();
            });


            /*---------------------------------------------------------------------*/


            /*-------------------------地图导航布局----------------------------*/

            var div = document.createElement('div');
            div.className='mapDrive';
            containerLeft.appendChild(div);

            var text2 = document.createElement("h6");
            text2.innerHTML = "地图导航";
            div.appendChild(text2);
            var div2 = document.createElement("div");
            div2.id = "div2";
            div.appendChild(div2);

//起点
            var start = document.createElement("input");
            start.type = "text";
            start.id = "start";
            start.placeholder = "输入起点";
            div2.appendChild(start);

//终点
            var destination = document.createElement("input");
            destination.type = "text";
            destination.id = "destination";
            destination.placeholder = "输入终点";
            div2.appendChild(destination);

//开始导航按钮
            var Driving = document.createElement("input");
            Driving.type = "button";
            Driving.id = "btnstart";
            Driving.value = "开始导航";
            div2.appendChild(Driving);

            var panel = document.createElement("div");
            panel.id = "panel";
            container.appendChild(panel);

//导航面板
            document.getElementById("btnstart").addEventListener("click", function () {
                var startCity = document.getElementById("start").value;
                var destinationCity = document.getElementById("destination").value;


                map = new AMap.Map("container", {});
                AMap.service(["AMap.Driving"], function () {
                    var driving = new AMap.Driving({
                        map: map,
                        panel: "panel"
                    });
                    driving.search([
                        {keyword: startCity},
                        {keyword: destinationCity}
                    ]);
                });
            });

//设置城市中心点
            var Center = document.createElement("input");
            Center.type = "text";
            Center.id = "centerCity";
            Center.placeholder = "输入城市名称，用空格隔开";
            div2.appendChild(Center);

            var centerBtn = document.createElement("input");
            centerBtn.type = "button";
            centerBtn.id = "centerBtn";
            centerBtn.value = "设置城市中心点(间隔1s)";
            div2.appendChild(centerBtn);

            document.getElementById("centerBtn").addEventListener("click", function () {
                var centerCity = document.getElementById("centerCity").value;
                if (!centerCity)
                    map.setCity('天津市');
                else {
                    // map.setCity(centerCity);
                    // document.write(centerCity);
                    var city = centerCity.split(" ");//用空格分割字符串
                    //
                    var i = 0;
                    // //第一种setTimeout方法
                    // function Set() {
                    //     if(i<city.length){
                    //         // document.write(city[i]);
                    //         map.setCity(city[i]);
                    //         setTimeout(function () {
                    //             Set();
                    //         },1000);
                    //         i++;
                    //     }
                    // }
                    // Set();

                    //第二种setInterval方法
                    var time = setInterval(function () {
                        if (i < city.length) {
                            map.setCity(city[i]);
                            i++;
                        }
                        else
                            clearInterval(time);
                    }, 1000);
                }
            });


            /*---------------------------------------------------------*/


            /*---------------------------地图查询------------------------------*/

            
            var div3 = document.createElement("div");
            div3.id = "div3";
            containerLeft.appendChild(div3);
            
            var findCity = document.createElement("input");
            findCity.type = "text";
            findCity.id = "findCity";
            findCity.placeholder = "城市";
            div3.appendChild(findCity);

            var find = document.createElement("input");
            find.id = "find";
            find.type = "text";
            div3.appendChild(find);

            var findBtn = document.createElement("input");
            findBtn.type = "button";
            findBtn.id = "findBtn"
            findBtn.value = "查询";
            div3.appendChild(findBtn);

//查询事件
            document.getElementById("findBtn").addEventListener("click", function () {
                var name = document.getElementById("find").value;
                var city = document.getElementById("findCity").value;
                AMap.service(["AMap.PlaceSearch"], function () {
                    var place = new AMap.PlaceSearch({
                        pageSize: 30,
                        map: map,
                        panel: "panel",
                        city: city
                    })
                    place.search(name);
                    
                })
                
            dituzhuose();
    	    function dituzhuose() {
    	        //加载行政区划插件
    	        AMap.service('AMap.DistrictSearch', function() {
    	            var opts = {
    	                subdistrict: 1,   //返回下一级行政区
    	                extensions: 'all',  //返回行政区边界坐标组等具体信息
    	                level: 'city'  //查询行政级别为 市
    	            };
    	            //实例化DistrictSearch
    	            district = new AMap.DistrictSearch(opts);
    	            district.setLevel('city');
    	            //行政区查询
    	            district.search(document.getElementById("find").value, function(status, result) {
    	                var bounds = result.districtList[0].boundaries;
    	                var polygons = [];
    	                if (bounds) {
    	                    for (var i = 0, l = bounds.length; i < l; i++) {
    	                        //生成行政区划polygon
    	                        var polygon = new AMap.Polygon({
    	                            map: map,
    	                            strokeWeight: 1,
    	                            path: bounds[i],
    	                            fillOpacity: 0.7,
    	                            fillColor: '#CCF3FF',
    	                            strokeColor: '#CC66CC'
    	                        });
    	                        polygons.push(polygon);
    	                    }
    	                    map.setFitView();//地图自适应
    	                }
    	            });
    	        });
    	    }
                                          
            });
            
      
            
//范围
            var Label = document.createElement("label");
            Label.id = "label";
            Label.innerHTML = "范围";
            div3.appendChild(Label);


            var Select = document.createElement("select");
            Select.id = "select";
            var option1 = document.createElement("option");
            var option2 = document.createElement("option");
            option1.innerHTML = "危险源";
            option2.innerHTML = "超市";
            Select.appendChild(option1);
            Select.appendChild(option2);
            div3.appendChild(Select);

            var div4 = document.createElement("div");
            div4.id = "div4";
            div3.appendChild(div4);


            /*---------------------------------------------------------*/


            /*---------------------------地图视野------------------------------*/

            var div = document.createElement('div');
            div.className='mapWatch';
            containerLeft.appendChild(div);

            var text4 = document.createElement("h6");
            text4.innerHTML = "地图视野";
            div.appendChild(text4);
            var div5 = document.createElement("div");
            div5.id = "div5";
            div.appendChild(div5);

            var btn1 = document.createElement("input");
            btn1.type = "button";
            btn1.id = "btn1";
            btn1.value = "世界视野";
            div5.appendChild(btn1);
            document.getElementById("btn1").addEventListener("click", function () {
                map.setZoom(3);
            });

            var btn2 = document.createElement("input");
            btn2.type = "button";
            btn2.id = "btn2";
            btn2.value = "县域视野";
            div5.appendChild(btn2);
            document.getElementById("btn2").addEventListener("click", function () {
                map.setZoom(12);

            });

            var btn3 = document.createElement("input");
            btn3.type = "button";
            btn3.id = "btn3";
            btn3.value = "中国视野";
            div5.appendChild(btn3);
            document.getElementById("btn3").addEventListener("click", function () {
                map.setCity('中国');
            });

            var btn4 = document.createElement("input");
            btn4.type = "button";
            btn4.id = "btn4";
            btn4.value = "街道乡镇";
            div5.appendChild(btn4);
            document.getElementById("btn4").addEventListener("click", function () {
                map.setZoom(15);
            });

            var btn5 = document.createElement("input");
            btn5.type = "button";
            btn5.id = "btn5";
            btn5.value = "省域视野";
            div5.appendChild(btn5);
            document.getElementById("btn5").addEventListener("click", function () {
                map.setZoom(7);
            });

            var btn6 = document.createElement("input");
            btn6.type = "button";
            btn6.id = "btn6";
            btn6.value = "社区村域";
            div5.appendChild(btn6);
            document.getElementById("btn6").addEventListener("click", function () {
                map.setZoom(13);
            });

            var btn7 = document.createElement("input");
            btn7.type = "button";
            btn7.id = "btn7";
            btn7.value = "地区视野";
            div5.appendChild(btn7);
            document.getElementById("btn7").addEventListener("click", function () {
                map.setZoom(11);
            });

            var btn8 = document.createElement("input");
            btn8.type = "button";
            btn8.id = "btn8";
            btn8.value = "房屋人员";
            div5.appendChild(btn8);
            document.getElementById("btn8").addEventListener("click", function () {
                map.setZoom(18);
            });


            /*---------------------------------------------------------*/


// var marker = new AMap.Marker({
//     position: [101.397428, 39.90923],
//     //draggable: true,
//     //cursor: 'move',
//     //raiseOnDrag: true
// });
// marker.setMap(map);
// marker.setLabel({
//     offset: new AMap.Pixel(20, 20),
//     content: "北京"
// });
// var marker1 = new AMap.Marker({
//     position: [116.405467, 39.907761],
//     draggable: true,
//     cursor: 'move',
//     raiseOnDrag: true
// });
// marker1.setMap(map);
// marker1.setLabel({
//     offset: new AMap.Pixel(20, 20),
//     content: "label of marker1"
// });
// var marker2 = new AMap.Marker({
//     position: [113.405467, 39.907761],
//     draggable: true,
//     cursor: 'move',
//     raiseOnDrag: true
// });
// marker2.setMap(map);
// marker2.setLabel({
//     offset: new AMap.Pixel(20, 20),
//     content: "label of marker2"
// });
// var marker3 = new AMap.Marker({
//     position: [116.405467, 37.907761],
//     draggable: true,
//     cursor: 'move',
//     raiseOnDrag: true
// });
// marker3.setMap(map);
// marker3.setLabel({
//     offset: new AMap.Pixel(20, 20),
//     content: "label of marker3"
// });
// var marker4 = new AMap.Marker({
//     position: [108.405467, 40.907761],
//     draggable: true,
//     cursor: 'move',
//     raiseOnDrag: true
// });
// marker4.setMap(map);
// marker4.setLabel({
//     offset: new AMap.Pixel(20, 20),
//     content: "label of marker4"
// });

// //起点
// document.write("<input type='text'  placeholder='输入起点' id='qidian' style='height: 26px;" +
//     "line-height: 26px;" +
//     "border: 1px;" +
//     "outline: none;" +
//     "border-radius: 3px;" +
//     "margin-bottom: 4px;" +
//     "z-index: 2;" +
//     "position: absolute;" +
//     "bottom: 100px;" +
//     "left: 160px;" +
//     "font-size: 12px;' />");
//
// //终点
// document.write("<input type='text'  placeholder='输入终点' id='zhongdian' style='height: 26px;" +
//     "line-height: 26px;" +
//     "border: 1px;" +
//     "outline: none;" +
//     "border-radius: 3px;" +
//     "margin-bottom: 4px;" +
//     "z-index: 2;" +
//     "position: absolute;" +
//     "bottom: 70px;" +
//     "left: 160px;" +
//     "font-size: 12px;' />");
//
// //开始导航按钮
// document.write("<input type='button' value='开始导航' id='btnstart' style='height: 40px;" +
//     "line-height: 26px;" +
//     "border: 1px;" +
//     "outline: none;" +
//     "border-radius: 3px;" +
//     "margin-bottom: 4px;" +
//     "cursor: pointer;" +
//     "z-index: 2;" +
//     "position: absolute;" +
//     "bottom: 20;" +
//     "left: 160px;" +
//     "font-size: 12px;" +
//     "color: #FFF;" +
//     "width: 150px;" +
//     "background-color: #0D9BF2;' />");
//
// AMap.event.addDomListener(document.getElementById('btnstart'), 'click', function () {
//     var start = document.getElementById('qidian').value;
//     var destination = document.getElementById('zhongdian').value;
//
//     map = new AMap.Map("container", {
//         resizeEnable: true
//     });
//
//     map.plugin(["AMap.ToolBar"], function () {
//         var tool = new AMap.ToolBar();
//         map.addControl(tool);
//     });
//
//     map.plugin(["AMap.Driving"], function () {
//         var driving = new AMap.Driving({
//             map: map,
//             panel: "panel",
//             hideMarkers: false
//         });
// // 根据起终点名称规划驾车导航路线
//         driving.search([
//             {keyword: start},
//             {keyword: destination}
//         ]);
//     });
// });

// //放大按钮
// document.write("<input id='big' type='button'  value='放大' style='height: 30px;" +
//     "line-height: 24px;" +
//     "background-color: #0D9BF2;" +
//     "color: #FFF;" +
//     "border: 0;" +
//     "outline: none;" +
//     "border-radius: 3px;" +
//     "margin-bottom: 6px;" +
//     "cursor: pointer;" +
//     "position: absolute;" +
//     "bottom: 20px;" +
//     "right: 100px;" +
//     "font-size: 30px;" +
//     "z-index:2;'/>");
//
// AMap.event.addDomListener(document.getElementById("big"), "click", function () {
//     map.setZoom(map.getZoom() + 1);
// });
//
// //缩小按钮
// document.write("<input id='small' type='button'  value='缩小' style='height: 30px;" +
//     "line-height: 24px;" +
//     "background-color: #0D9BF2;" +
//     "color: #FFF;" +
//     "border: 0;" +
//     "outline: none;" +
//     "border-radius: 3px;" +
//     "margin-bottom: 6px;" +
//     "cursor: pointer;" +
//     "position: absolute;" +
//     "bottom: 20px;" +
//     "right: 200px;" +
//     "font-size: 30px;" +
//     "z-index:2;'/>");
// AMap.event.addDomListener(document.getElementById("small"), "click", function () {
//     map.setZoom(map.getZoom() - 1);
// });

// var info = new AMap.InfoWindow();
// info.setContent("Beijing");
// info.open(map, new AMap.LngLat(116.397428, 39.90923));

// map.plugin(["AMap.MapType"], function () {
//     var type = new AMap.MapType({
//         defaultType: 0
//     });
//     map.addControl(type);
//     type.show();
// });

// document.write("<input id='cityName' type='text' placeholder='输入城市名称,用一个空格隔开' style='height: 30px;" +
//     "border: 0;" +
//     "outline: none;" +
//     "border-radius: 3px;" +
//     "margin-bottom: 6px;" +
//     "position: absolute;" +
//     "bottom: 440px;" +
//     "left: 160px;" +
//     "font-size: 12px;" +
//     "z-index:2;'/>");
// document.getElementById("cityName").style.width = "170px";
//
//
// document.write("<input id='cityStart' type='button'  value='设置中心点' style='height: 30px;" +
//     "line-height: 9px;" +
//     "background-color: #0D9BF2;" +
//     "color: #FFF;" +
//     "border: 0;" +
//     "outline: none;" +
//     "border-radius: 3px;" +
//     "margin-bottom: 6px;" +
//     "cursor: pointer;" +
//     "position: absolute;" +
//     "bottom: 400px;" +
//     "left: 160px;" +
//     "width: 130px;" +
//     "font-size: 13px;" +
//     "z-index:2;'/>");
//
// AMap.event.addDomListener(document.getElementById('cityStart'), 'click', function () {
//     var cityName = document.getElementById('cityName').value;
//     // document.write(cityName+'<br>');
//     var city = cityName.split(" ");
//     // map.setCity(city[1]);
//     // document.write(city[0]);
//     // document.write(city);
//     var i = 0;
//
//
//     //第一种setTimeout方法
//     // function Set() {//每隔一秒
//     //     if(i<city.length) {
//     //         map.setCity(city[i]);
//     //         // document.write(city[i] + '<br>');
//     //         setTimeout(function () {
//     //             Set();
//     //         }, 1000);
//     //         i++;
//     //     }
//     // }
//     // Set();
//
//     //第二种setInterval方法
//     if (i < city.length) {
//         setInterval(function () {
//             map.setCity(city[i++]);
//         }, 1000);
//     }
// // });
// new AMap.Marker({
// //新建对象map
//     map: map,
//
//     position: [116.405467, 39.907761],
// //给点标记确定位置
//     icon: new AMap.Icon({
//         size: new AMap.Size(40, 50),
//         //图标大小
//         image: "http://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png",
//
//
//         imageOffset: new AMap.Pixel(0, -60)
//     })
//
// });
// document.write(" <input id='en' type='button' class='button' value='显示英文底图' style='height: 28px;" +
//     //设置显示英文地图按钮，高度为28px
//     "line-height: 28px;" +
//     // 设置行高
//     "background-color: #0D9BF2;" +
//     //设置背景颜色
//     "outline: none;" +
//     //设置轮廓
//     "border-radius: 3px;" +
//     //设置边径
//     "position: absolute;" +
//     //设置绝对位置，使之不能变化
//     "bottom: 100px;" +
//     //设置底线位置
//     "width: 100px;" +
//     //设置宽度位置
//     "left: 1000px;" +
//     //设置左边位置
//     "z-index: 2;" +
//     //设置指数
//     "cursor: pointer;' />");
// //设置监视
// document.write(" <input id='zh_en' type='button' class='button' value='显示中英文对照底图' style='height: 28px;" +
//
//     "line-height: 30px;" +
//
//     "background-color: #0D9BF2;" +
//
//     "outline: none;" +
//
//     "border-radius: 3px;" +
//
//     "position: absolute;" +
//
//     "bottom: 100px;" +
//
//     "width: 100px;" +
//
//     "left: 1200px;" +
//
//     "z-index: 2;" +
//
//     "cursor: pointer;' />");
//
// document.write(" <input id='zh_cn' type='button' class='button' value='显示中文底图' style='height: 28px;" +
//
//     "line-height: 32px;" +

//     "background-color: #0D9BF2;" +
//
//     "outline: none;" +
//
//     "border-radius: 3px;" +
//
//     "position: absolute;" +
//
//     "bottom: 100px;" +
//
//     "width: 100px;" +
//
//     "left: 1400px;" +
//
//     "z-index: 2;" +
//
//     "cursor: pointer;' />");
//
// ['en', 'zh_en', 'zh_cn'].forEach(function (btn) {
//     //将三个按钮添加到地图中
//     var button = document.getElementById(btn);
//     //响应按钮
//     AMap.event.addDomListener(button, 'click', clickListener)
// //调用函数
// });

//             function clickListener() {
//                 //函数监听
//                 map.setLang(this.id);
// //调用setlang函数
//             }


            // body.appendChild(div);

            // var map = new AMap.Map("container", {
            // 	resizeEnable: true,
            // 	center: [116.397428, 39.90923],//地图中心点
            // 	zoom: 13 //地图显示的缩放级别
            // });

            // add an OpenStreetMap tile layer
            // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            // }).addTo(map);

            // if (options.resizable) {
            //     mw.loader.using('ext.maps.resizable', function () { //TODO: Fix moving map when resized
            //         _this.resizable();
            //     });
            // }
            //
            // if (!options.center) {
            //     options.center = [116.397428, 39.90923];
            // }
            // // Add the markers.
            // for (var i = options.locations.length - 1; i >= 0; i--) {
            //     this.addMarker(options.locations[i]);
            // }
            //
            // // Add lines
            // if (options.lines) {
            //     for (var i = 0; i < options.lines.length; i++) {
            //         this.addLine(options.lines[i]);
            //     }
            // }
            //
            // // Add polygons
            // if (options.polygons) {
            //     for (var i = 0; i < options.polygons.length; i++) {
            //         this.addPolygon(options.polygons[i]);
            //     }
            // }
            //
            // // Add circles
            // if (options.circles) {
            //     for (var i = 0; i < options.circles.length; i++) {
            //         this.addCircle(options.circles[i]);
            //     }
            // }
            //
            // // Add rectangles
            // if (options.rectangles) {
            //     for (var i = 0; i < options.rectangles.length; i++) {
            //         this.addRectangle(options.rectangles[i]);
            //     }
            // }

            // Set map position (centre and zoom)
            // var centre;
            // if (options.centre === false) {
            //     switch (this.points.length) {
            //         case 0:
            //             centre = new L.LatLng(0, 0);
            //             break;
            //         case 1:
            //             centre = this.points[0];
            //             break;
            //         default:
            //             var bounds = new L.LatLngBounds(this.points);
            //             if (options.zoom === false) {
            //                 map.fitBounds(bounds);
            //                 centre = false;
            //             } else {
            //                 centre = bounds.getCenter();
            //             }
            //             break;
            //     }
            // } else {
            //     centre = new L.LatLng(options.centre.lat, options.centre.lon);
            // }
            // if (centre) {
            //     map.setView(centre, options.zoom !== false ? options.zoom : options.defzoom);
            // }
        };

        this.setup();

        return map;

    };
})(jQuery, window.mediaWiki);
