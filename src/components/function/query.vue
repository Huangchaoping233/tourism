<template>
    <div id="query"> 
            <div class="glass tool">
                <div class="tool-item">
                    工具栏
                </div>
                <div class="tool-item">
                    <label class="tool-item1-label" for="isClick">获取坐标</label>
                    <input class="tool-item1-checkbox" title="点击地图获取坐标" type="checkbox" id="isClick" v-model="isAddClickEvent">
                </div>
                <!--<a class="tool-item glass btn attractions" @click="getLocation">显示当前</a>-->
                <a class="tool-item glass btn attractions" @click="getAttractions">搜索景点</a>
                <!--<a class="tool-item glass btn attractions" @click="reset">reset</a>-->
            </div>     
        <div class="query-div1 glass">
            <div class="query-div1-div1">  
                <a href="javascript:void(0)" data-list="list" class="cur" @click="setIsSaveTrue()">查询</a>
                <a href="javascript:void(0)" data-list="savedList" @click="getSavedList()">已保存</a>
            </div>
            <div>
                <ul class="list block">
                    <li v-for="(i,index) in place">{{i.title}} <span class="del" @click="delItem(index)"> x </span></li>
                </ul>                
                <ul class="savedList">
                    <li v-for="(i,index) in savedList" :class="{selected:i.selected}" @click="selectSavedListItem(i)">{{i.title}}</li>
                </ul>
            </div>
            <button href="javascript:void(0)" class="btn save-btn glass" @click="saveOrDelAttractions">{{isSave?'保存':'删除'}}</button>
        </div>
        <div class="query-div2 glass">
            <div id="allmap"></div>
        </div>
        <div class="query-div3 right">
            <el-row justify="space-between" type="flex">
                    <div class="query-input">
                        <input class="input glass" placeholder="请输入关键词" v-model="query.key"></input>
                    </div>
                    <div>
                        <a class="glass btn search-btn" @click="subHandle">搜</a>
                    </div>
                </el-form>
                <div class="clear"></div>
            </el-row>
            <div id="r-result" class="glass"></div>
        </div>
        
    </div>
    
</template>
<script>
    import api_map from '../../services/api_map.js'
    import api_attraction from '../../services/api_attraction.js'
    export default {
        data(){
            return {
                query:{//输入框的相关参数
                    key:'',//输入框的值
                    results:[]//输入框搜索后的结果
                },
                // data:{//未使用
                //     name:'',
                //     list:[]
                // },
                rules:{
                    key:[
                        {required:true,message:'不能为空',trigger: 'blur'}
                    ]
                },
                location:{// 当地地址
                    x:'',
                    y:''
                },
                map:'',//地图实例
                isAddClickEvent:false,
                btn:'',//收藏按钮对象,
                title:'',//要收藏的地点名
                CreatedEvent:false,//事件是否已经创建了
                place:[], //待收藏的地点数组
                // hasData:false,//控制按钮是否可用
                savedList:[],//已经保存的景点，用来查、删
                delSavedList:[],//删除已经保存的景点
                isSave:true //按钮是否为保存功能
            }
        },
        methods:{
            //搜索
            subHandle:function(){
                if(this.query.key == ''){
                    $('input.input').attr('placeholder','输入框不能为空')
                    return
                }
                this.map.clearOverlays() //删除地图上所有覆盖物
                var sel = this
                api_map.searchByKey(this.query.key,this.map,function(results){
                    sel.query.results = results
                    // console.log(results)
                    //点击地址事件 获得按钮
                    var btn = sel.btn
                    if(!sel.CreatedEvent){
                        $('body').on('click','#r-result li',function(event){
                            event.stopPropagation();
                            $(this).css('position','relative')
                            .append(btn)
                        })
                        //点击收藏
                        $('body').on('click','button.collect',function(event){
                            event.stopPropagation();
                            sel.title = $(this).parent().find('span').eq(2).text()
                            console.log(sel.title)
                            var myGeo = new BMap.Geocoder();
                            myGeo.getPoint(sel.title, function(point){
                            console.log(point)
                                if (point) {
                                    var item = {}
                                    item.point = point;
                                    item.title = sel.title;
                                    item.address = sel.title;
                                    sel.place.push(item);
                                }else{
                                    alert("您选择地址没有解析到结果!");
                                }
                            }, "厦门市");
                        })
                        sel.CreatedEvent = true;
                    }
                })
            },
            //获取当前位置，未使用
            getLocation(){
                api_map.location(this.map);
            },
            //点击地图，直接获取坐标的方法
            getCoordinates(event){
                var item = {}
                item.point = event.point;
                
                // alert(event.point.lng + "," + event.point.lat);
                var geoc = new BMap.Geocoder();
                geoc.getLocation(event.point, function(rs){
                    item.title = rs.address;
                    var addComp = rs.addressComponents
                    item.adress = addComp.province + "," + addComp.city + "," + addComp.district + "," + addComp.street + "," + addComp.streetNumber
                    this.place.push(item)
                }.bind(this));       
            },
            //初始化按钮，以供 显示选取景点用
            initBtn(){
                this.btn = $('<button>+</button>').css({
                    position:'absolute',
                    top:'calc(50% - '+ 20 +'px)',
                    right:'0px',
                    width:'30px',
                    height:'30px'
                }).addClass('glass light collect').eq(0)
                // console.log(this.btn)
            },
            //获取当前地区景点的快捷方式
            getAttractions(){
                this.query.key = '景点'
                this.subHandle()
            },
            //删除将要保存this.place中的数据
            delItem(index){
                this.place.splice(index,1)
            },
            //根据isSave，选择保存或者删除数据
            saveOrDelAttractions(){
                if(this.isSave){ //保存数据
                    if(this.place.length<=0){
                        this.$message('没有数据需要保存')
                        return;
                    }
                    api_attraction.save($.cookie('userid'),this.place,function(res){
                        if(res.status=="y"){
                            this.$message.success("数据保存成功")
                            this.place = []
                        }
                        
                    }.bind(this))
                }
                else{ //删除数据
                    if(this.delSavedList.length<=0){
                        this.$message('没有数据需要删除')
                        return;
                    }
                    api_attraction.del(this.delSavedList,function(res){
                        
                        if(res.status=="y"){
                            this.$message.success("数据删除成功")
                            this.getSavedList()
                        }
                        
                    }.bind(this))
                }
                
            },
            //获取已经保存的景点
            getSavedList(){
                this.isSave = false;
                api_attraction.getAttractions($.cookie('userid'),function(data){
                    data.forEach(function(item){
                        delete item.userid
                        delete item.__v
                        item.selected = false
                    })
                    this.savedList = data
                }.bind(this))
            },
            //选择要删除的数据，并保存到delSavedList
            selectSavedListItem(item){
                item.selected = !item.selected
                if(item.selected){
                    this.delSavedList.push(item)
                }
                else{
                    var index = this.delSavedList.findIndex(function(i){
                        return i == item
                    })
                    this.delSavedList.splice(index,1)
                }
            },
            //设置isSave为true
            setIsSaveTrue(){
                this.isSave = true;
            }
        },
        watch:{
            isAddClickEvent:function(value){
                if(value){
                    this.map.addEventListener("click",this.getCoordinates,false);
                }
                else{
                    this.map.removeEventListener("click",this.getCoordinates,false);
                }
                
            },
            title:function(value){
                if(value && this.query.results){
                    var data = this.query.results.filter(function(item){
                        if(item.title.indexOf(value) > -1)
                        return item
                    })[0]
                    var data2 = {}
                    data2.title = data.title
                    data2.point = data.point
                    data2.address = data.address
                    this.place.push(data2)
                }
            },
            place:function(value){
                if(value.length >= 15){
                    this.$message('最对保存15个')
                }
            }
        },
        created(){
            
            this.initBtn()
        },
        mounted(){
            var map = new BMap.Map("allmap");    // 创建Map实例
            this.map = map
            // this.getLocation(this.map)
            api_map.initMap(this.map)
            api_map.showCityList(this.map)

            $('.query-div1-div1').on('click','a',function(e){
                $(this).addClass('cur').siblings().removeClass('cur')
                $('.query-div1 ul.'+$(this).data('list')).addClass('block').siblings().removeClass('block')
            })

        }
    }
    
</script>
<style scoped>

.query-div{
    height:740px;
    background-color:transparent;
}
.right{
    min-height:740px;
}
.el-form{
    width:100%;
}
.el-button{
    width:100%;
}
#allmap{
    width:100%;
    height:100%;
}
#query>div{
    float:left;  
}
.query-div1{
    margin-right:20px;
    width:20%;
    height:740px;
    box-sizing:border-box;
    padding:20px;
    position:relative;
}
.clear{
    clear:both;
}
.query-div2{
    margin-right:20px;
    height:740px;
    width:calc(60% - 40px);
}
.query-div3{
    width:20%;
    margin-right:0px;
    min-height:740px;
}
.btn{
    background-color:transparent;
    border:none; 
    color:#666;
    text-align:center;
    cursor:pointer;
    
}

a.search-btn{
    float:left;
    display:inline-block;
    width:42px;
    height:42px;
    
    border-radius:50%;
    line-height:42px;
}
a.search-btn:active{
    top:10px;
}
.query-input{
    width:calc(100% - 42px);
    float:left;
}
input.input{
    height:40px;
    line-height:40px;
    font-size:16px;
    border:none;
    background-color:transparent;
    width:100%;
    text-align:center;
    color:#666;
}

.btn:active{
    background-color:aquamarine; 
}
.tool{
    padding:0;
    margin:0;
    position:absolute;
    top:110px;
    left:27%;
    z-index:5;
    background-color:transparent;
    border-radius:0 15px 15px 0;
}
.tool-item{
    height:40px;
    width:100px;
    float:left;
    text-align:center;
    border-right:1px solid #fff;
    line-height:40px;
}
.tool-item1-label{
    line-height:40px;

}
.attractions{
    height:40px;
    display:inline-block;
    line-height:40px;
}
.query-div1 .list{
    margin-top:30px;
}
.query-div1 .list li{
    line-height:40px;
    padding-left:10px;
    position:relative;
}
.query-div1 .savedList{
    margin-top:30px;
}
.query-div1 .savedList li{
    line-height:40px;
    padding-left:10px;
    position:relative;  
}
.del{
    display:inline-block;
    width:40px;
    height:40px;
    text-align:center;
    line-height:40px;
    cursor:pointer;
    border-radius:50%;
    position:absolute;
    right:-20px;
    top:0px;
}
.del:hover{
    background-color:rgba(255,255,255,0.4)
    
}
.save-btn{
    position:absolute;
    left:0px;
    bottom:0px;
    display:block;
    width:100%;
    height:40px;
    line-height:40px;
}
.query-div1-div1{
    position:absolute;
    top:0;
    left:0;
    width:100%;
}
.query-div1-div1>a{
    float:left;
    width:50%;
    text-align:center;
    color:#666;
    height:50px;
    line-height:50px;
    // border-bottom:1px solid white;
    box-sizing:border-box;
    background-color:rgba(255,255,255,0.5);
}
.query-div1-div1>a:nth-of-type(1){
    // border-right:1px solid white;
    
}
.query-div1-div1>a.cur{
    
    background-color:rgba(255,255,255,0.3);
    font-size:20px;
}
.query-div1 ul{
    display:none;

}
.query-div1 ul.savedList{
    height:650px;
   
    overflow:scroll;
    overflow-x: hidden;
    width:220px;   
}
.query-div1 ul.savedList li.selected{
    background-color:white;
}
.query-div1 ul.block{
    display:block;
}
</style>