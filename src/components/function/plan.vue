<template>
    <div id="plan">
        
        <div class="plan-div1">
            <div class="glass plan-div1-div1">
                <h3>景点</h3>
                <ul class="attractions">
                    <li v-for="item in attractions" @click="select(item)" :class="{selected:item.selected}">{{item.title}}</li>
                </ul>
            </div>
            <div class="glass plan-div1-div2">
                <h3>要规划景点</h3>
                <ul class="selected-attractions">
                    <li v-for="(item,index) in selectedAttractions" @click="selectOne(item,index)">{{item.title}}</li>
                </ul>
                <button id="calc" class="glass btn plan-btn" @click="startCalc()">开始规划</button>
            </div>
            <div class="plan-div1-div3">
                <div class="glass start" @click="setStart()">
                    <p>start</p>
                    <span>{{start.title}}</span>
                </div>
                <div class="glass end" @click="setEnd()">
                    <p>end</p>
                    <span>{{end.title}}</span>
                </div>
                <div class="glass SeE" title="勾选，终点即为起点">
                    <label for="SeE">回到起点</label>
                    <input type="checkbox" v-model="SeE" id="SeE">
                </div>
            </div>
        </div>
        <div class="glass plan-div2">
            <div class="plan-div2-div1" id="allmap">
            </div>
            <div class="plan-div2-div2">
                <span><b>规划的线路：</b></span>
                <span v-for="(item,index) in plan">{{index==0?"":"("+bestDistance[index-1] +"分钟)"}}{{item.title}}{{index==plan.length-1?'':">"}} </span>
                <p><b>路上总共花费：</b>{{bestTime}}</p>
                <button class="btn glass save-btn" @click="savePlan()">保存</button>
            </div>
        </div>
    </div>
    
</template>
<script>
    import api_map from '../../services/api_map.js' //地图api的请求
    import api_attraction from '../../services/api_attraction.js' //景点的数据操作
    import api_plan from '../../services/api_plan.js' //路线的数据操作
    import SAA from "../../assets/js/saa.js" //模拟退火算法
    import MyEnum from "../../assets/js/enum.js" //枚举
    import Tools from "../../assets/js/tools.js" //工具
    import { Message } from 'element-ui'; //错误消息提示
    export default {
        data(){
            return {
                attractions:[], //景点集合
                selectedAttractions:[], //要规划的景点集合
                start:'', //起点
                end:'', //终点
                SeE:false,//起点等于终点
                one:'', //选择要操作的元素
                Distance:[], //距离数组
                bestGhh:[], //最好的路线编码
                bestTime:'',//最好路线花费的时间
                plan:[], //规划后的路线
                bestDistance:[], // 规划后每个地点之间的花费时间
            }
        },
        methods:{
            
            getAttractions(){
                api_attraction.getAttractions($.cookie('userid'),function(data){
                    data.forEach(function(item){
                        delete item.userid
                        delete item.__v
                        item.selected = false
                    })
                    // console.log(data)
                    this.attractions = data
                }.bind(this))
            },
            select(item){
                item.selected = !item.selected
                if(item.selected){
                    this.selectedAttractions.push(item)
                }
                else{
                    var index = this.selectedAttractions.findIndex(function(i){
                        return i == item
                    })
                    this.selectedAttractions.splice(index,1)
                }
            },
            selectOne(item,index){
                // console.log(index)
                $('.selected-attractions li').eq(index)
                .siblings().removeClass('selectedOne')
                .end().addClass('selectedOne')
                this.one = item
            },
            setStart(){
                if(this.one){
                    if(this.start != this.one){
                        this.start = this.one
                    }
                    else{
                        this.start = ""
                    }                
                }
            },
            setEnd(){
                if(this.one){
                    if(this.end != this.one){
                        this.end = this.one
                    }
                    else{
                        this.end = ""
                    } 
                }
            },
            swap(value,i){
                var index = this.selectedAttractions.findIndex(function(item){
                    return item == value
                })
                var temp = this.selectedAttractions[i]
                this.selectedAttractions[i] = this.selectedAttractions[index]
                this.selectedAttractions[index] = temp
            },
            setPlace(bestGhh){
                this.plan = []
                for(var i=0;i < this.selectedAttractions.length;i++){
                    this.plan[i] = this.selectedAttractions[bestGhh[i]]
                }
                // console.dir(this.plan)
            },
            startCalc(){
                $('#calc').text('计算中');
                
                if(this.start != "" && this.start == this.end){
                    this.SeE = true;
                }
                var List = []
                if(this.start != ""){
                    this.swap(this.start,0)
                }
                if(this.SeE == false && this.end != ""){
                    this.swap(this.end,this.selectedAttractions.length-1)
                }
                List = this.selectedAttractions


                // var List =  ['香港特别行政区','上海市','北京市','深圳市','广州市','苏州市','青岛市','温州市','宁波市','大连市']

                // var count = 0 //计算距离请求完成总数
                global.count = 0
                var sum = List.length * List.length - List.length //需要完成总数
                // console.log(sum)
                console.log('initDistance开始')
                var Distance = Tools.initDistance(List)
                this.Distance = Distance
                var isStart = 0; // 0没起点 1有起点
                if(this.start != ""){
                    isStart = 1
                }
                var isEnd = 0; //0没终点 1有终点
                if(this.end != ""){
                    isEnd = 1
                }
                var isSeE = 0 // 0终点和起点一样 1终点和起点一样
                if(this.SeE){
                    isSeE = 1
                }
                var N = List.length - isStart - isSeE; // if(N>6)

                var that = this //作用域赋值给that
                var timer = setInterval(function(){
                    if(global.count >= sum){
                        console.log('initDistance结束') 
                        if(N>= 9){
                            console.log('计算开始了，使用saa计算')
                            console.time('saa')
                            var saa = new SAA(List,N*N*N,800+(N*20),Distance,isStart,isEnd,isSeE)
                            saa.run()
                            console.timeEnd('saa')
                            that.bestGhh = saa.bestGhh //最好路径编码赋值给this.bestGhh
                            that.bestTime = (saa.bestEvaluation /60).toFixed(1) + '分钟'//路上花费时间
                            that.setPlace(saa.bestGhh)
                        }
                        else{
                            console.log('计算开始了，使用enum计算')
                            console.time('enum')
                            var myEnum =new MyEnum(List,Distance,isStart,isEnd,isSeE)
                            myEnum.run()
                            console.timeEnd('enum')
                            that.bestGhh = myEnum.bestGhh //最好路径编码赋值给this.bestGhh
                            that.bestTime = (myEnum.bestEvaluate /60).toFixed(1) + '分钟' //路上花费时间
                            that.setPlace(myEnum.bestGhh) //设置plan
                        }
                        clearInterval(timer)
                        that.$message("路线已经规划好")
                        $('#calc').text('开始规划');
                        that.draw() // 地图上显示规划后的路线
                        that.getBestDistance() //获得各个地点之间花费的时间
                    } 
                },1000)
            },
            // 地图上显示规划后的路线
            draw(){
                var map = new BMap.Map("allmap");
                api_map.setRoute(map,this.plan,this.SeE)
            },
            //获得各个地点之间花费的时间
            getBestDistance(){
                var len = this.bestGhh.length
                for(var i = 0; i < len - 1 ;i++){
                    this.bestDistance.push(Number((this.Distance[this.bestGhh[i]][this.bestGhh[i+1]] /60).toFixed(1)))
                }
            },
            //保存规划好的路线
            savePlan(){
                var data = {
                    route:JSON.stringify(this.plan),
                    cost:this.bestTime,
                    eachCost:JSON.stringify(this.bestDistance),
                    userid:$.cookie('userid'),
                    SeE:this.SeE
                }
                api_plan.save(data,function(res){
                    if(res.status == 'y'){
                        this.$message.success("路线保存成功") 
                    }
                    else{
                        this.$message("路线保存失败") 
                    }
                    
                }.bind(this))

            }

        },
        created(){
            this.getAttractions()
        },
        watch:{
            attractions:function(value){
                
            },
            SeE:function(value){

            },
            start:function(value){
                if(value != ""){
                    if(value == this.end){
                        this.end = ""
                    }
                }
            },
            end:function(value){
                if(value != ""){
                    if(value == this.start){
                        // console.log(value)
                        this.end = ""
                    }
                }
            }

        }
    }
</script>
<style scoped>
#plan>div{
    float:left;

}
.plan-div1{
    width:40%;
    height:740px;
}
.plan-div1>div{
    width:96%;
    height:43%;
    margin-bottom:4%;
}
.plan-div1>div:nth-of-type(3){
    width:96%;
    height:10%;
}
.plan-div1>div:nth-of-type(3)>div{
    width:30%;
    height:100%;
    margin-right:5%;
    float:left;
}
.plan-div1>div>h3{
    text-align:center;
}

.plan-div1>div:nth-of-type(3)>div:nth-of-type(3){
    margin-right:0;
}
.plan-div1-div3{
    text-align:center;
}
.plan-div1-div3 p{
    margin:0;
}
.plan-div1-div3 .SeE label{
    line-height:74px;
}
.plan-div2{
    width:60%;
    height:740px;
}
.selected{
    background-color:white;
}
.attractions{
    text-align:center;
    overflow:scroll;
    height:297px;
    padding:20px 0;
}
.attractions li{
    width:50%;
    margin: 0 auto;
}
.selected-attractions li{
    width:50%;
    float:left;
    text-align:center;
}
.selectedOne{
    background-color:white;
}
.btn{
    background-color:transparent;
    border:none;
}
.plan-btn{
    width:30px;
    height:200px;
    border-radius:50%;
    position:absolute;
    top:calc(50% - 100px);
    right: 10px;
}
.plan-div2>div{
    width:100%;
}
.plan-div2-div1{
    height:80%;
    background-color:white;
}
.plan-div2-div2{
    height:20%;
    padding:20px;
    box-sizing:border-box;
    position:relative;
}
.plan-div2-div2 p{
    margin:5px 0;
}
.save-btn{
    width:100px;
    height:40px;
    line-height:40px;
    float:right;
    border-radius:15px;
    position:absolute;
    right:15px;
    bottom:15px;
}
.save-btn:active{
    background-color:aquamarine;
}
</style>