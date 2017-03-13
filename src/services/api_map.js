export default {
    //初始化地图
    initMap(map) {
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
        // map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
        map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
        map.enableScrollWheelZoom(true);
    },
    //获得用户地址
    location(map) {
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function (r) {
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                var mk = new BMap.Marker(r.point);
                map.addOverlay(mk);
                map.panTo(r.point);
                
                alert('您的位置：' + r.point.lng + ',' + r.point.lat);
            }
            else {
                alert('failed' + this.getStatus());
            }
        }, { enableHighAccuracy: true })

    },
    //显示城市列表控件
    showCityList(map) {
        map.enableScrollWheelZoom();
        // map.addControl(new BMap.NavigationControl());
        map.enableInertialDragging();
        map.enableContinuousZoom();

        var size = new BMap.Size(10, 20);
        map.addControl(new BMap.CityListControl({
            anchor: BMAP_ANCHOR_TOP_LEFT,
            offset: size,
            // 切换城市之间事件
            // onChangeBefore: function(){
            //    alert('before');
            // },
            // 切换城市之后事件
            // onChangeAfter:function(){
            //   alert('after');
            // }
        }));
    },
    //点击获取坐标
    getCoordinatesClick(map){       
        //单击获取点击的经纬度
        
    },
    //关键字搜索
    searchByKey(key,map,callback){
        var local = new BMap.LocalSearch(map, {
            renderOptions:{
                map: map,
                panel: "r-result",
                
            },
            onSearchComplete:function(results){
                callback(results.xr)
            }
        });
        local.clearResults()
        local.search(key);

        function SearchComplete(results){
            conosle.log(111)
            
        }
    },
    setRoute(map,list,SeE){
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);
        map.enableScrollWheelZoom(true);
        // console.log(list)
        var arr = []
        var p1 = '' //起点
        var p2 = '' //终点
        list.forEach(function(item,index){
            if(index === 0){
                p1 = new BMap.Point(item.point.lng,item.point.lat)
            }
            else if(index === list.length - 1 && SeE === false){
                p2 = new BMap.Point(item.point.lng,item.point.lat)
            }
            else{
                arr.push(new BMap.Point(item.point.lng,item.point.lat))
            }   
        })
        var driving = new BMap.DrivingRoute(map, {renderOptions:{map: map, autoViewport: true}});
        if(SeE){
            driving.search(p1, p1,{waypoints:arr});
        }
        else{
            driving.search(p1, p2,{waypoints:arr});
        }
        
    }

}