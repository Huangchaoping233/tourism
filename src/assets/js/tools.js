/**
 * 初始化'距离'(路程花费时间)的函数
 */
export default {


    initDistance(arr){
        var Distance = [] //初始化Distance为二维数组
        for(var i = 0;i < arr.length;i++){
            var Distance2 = []
            Distance[i] = Distance2
        }

        // 每条数据搜索完毕调用的函数 为Distance赋值
        var searchComplete = function (results){
            // console.log(results)
            var k = arr.findIndex(function(item){
                if(item.point.lat == results.Rv.point.lat && item.point.lng == results.Rv.point.lng){
                    return item
                }

            })
            var m = arr.findIndex(function(item){
                if(item.point.lat == results.cv.point.lat && item.point.lng == results.cv.point.lng){
                    return item
                }      
            })
            // console.log(k)
            // console.log(m)
            var duration = results.getPlan(0).getDuration(false);
            Distance[k][m] = duration;
            Distance[m][k] = duration;

            global.count += 2;
            // console.log(count)
        }
        var transit = new BMap.DrivingRoute('厦门',{
            onSearchComplete: searchComplete,
        });
        
        for(var i = 0;i < arr.length;i++){
            var Distance2 = []
            for(var j = i;j < arr.length ;j++){
                if(i == j){
                    Distance2[j] = 0
                }
                else{
                    var start = new BMap.Point(arr[i].point.lng,arr[i].point.lat);
                    var end = new BMap.Point(arr[j].point.lng,arr[j].point.lat);
                    Distance2[j] = transit.search(start,end)
                }
            }
            Distance[i] = Distance2
        }

        return Distance
    }

}

// function testDistance(){
//     var arr = ['香港特别行政区','上海市','北京市','深圳市','广州市','苏州市','青岛市','温州市','宁波市','大连市']

//     var Distance = [] //初始化Distance为二维数组
//     for(var i = 0;i < arr.length;i++){
//         var Distance2 = []
//         Distance[i] = Distance2
//     }
//     var searchComplete = function (results){
//         var regQ = new RegExp(results.Qv.title,i)
//         var regb = new RegExp(results.bv.title,i)
//         var k = arr.indexOf(regQ)
//         var m = arr.indexOf(regb)
//         console.log('ij:'+k+ ' '+ m)
//         var duration = results.getPlan(0).getDuration(false);
//         Distance[k][m] = duration;
//         Distance[m][k] = duration;
//     }
//     var transit = new BMap.DrivingRoute('厦门',{
//         onSearchComplete: searchComplete,
//     });
    
//     for(let i = 0;i < arr.length;i++){
//         var Distance2 = []
//         for(let j = i;j < arr.length ;j++){
//             if(i == j){
//                 Distance2[j] = 0
//             }
//             else{
//                 Distance2[j] = transit.search(arr[i],arr[j])
//             }
//         }
//         Distance[i] = Distance2
//     }
    
//     setTimeout(function(){
//         console.log(Distance)
//     },10000)           

//     // return Distance
// }