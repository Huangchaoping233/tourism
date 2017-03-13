<template>
    <div id="check">
        <div>
            <div class="glass plan" v-for="plan in plans" @click="showMap(plan)">
                <span v-for="(item,index) in plan.route">{{index==0?"":"("+plan.eachCost[index-1] +"分钟)"}}{{item.title}}{{index==plan.route.length - 1?'':">"}}</span>
            </div>      
        </div>
        <div id="pop">
            <div id="allmap"></div>
            <div id="resulte">
                <span>需花费时间：{{resulte}}</span>
                <button @click="delPlan()">删除</button>
                <button @click="closePop()">关闭</button>
            </div>
        </div>
        
    </div>
</template>
<script>
import api_map from '../../services/api_map.js' //地图api的请求
import api_plan from '../../services/api_plan.js' //路线的数据操作
export default{
    data(){
        return {
            plans:[], //路线数组
            resulte:'',
            delItemId:''
        }
    },
    created(){
        api_plan.getData($.cookie('userid'),function(data){
            data.forEach(function(item){
                delete item.userid
                delete item.__v
                item.route = JSON.parse(item.route)
                item.eachCost = JSON.parse(item.eachCost)
            })
            this.plans = data
            // console.log(data)
        }.bind(this))
    },
    methods:{
        showMap(plan){
            $("#pop").css('display','block')
            this.resulte = plan.cost
            this.draw(plan)
            this.delItemId = plan._id
        },
        draw(plan){
            var map = new BMap.Map("allmap");
            api_map.setRoute(map,plan.route,plan.SeE)
        },
        closePop(){
            $("#pop").css('display','none')
        },
        delPlan(){
            if(confirm('确认删除吗')){
                var that = this
                // console.log(this.delItemId)
                api_plan.delPlan(this.delItemId,function(res){
                    if(res.status=="y"){
                        $("#pop").css('display','none')
                        var index = that.plans.findIndex(function(item){
                            return item._id == that.delItemId;
                        })
                        that.plans.splice(index,1)
                        this.$message.success(res.msg)   
                    }
                })
            }
        }
    }
}
</script>
<style scoped>
#check{
    position:relative;
}
.plan{
    padding:20px;
    margin-bottom:20px;
}

#pop{
    position:absolute;
    width:700px;
    height:750px;
    top:calc(50% - 400px);
    left:calc(50% - 300px);
    background-color:white;
    display:none;

}
#allmap{
    width:100%;
    height:700px;
}
#resulte{
    width:100%;
    height:500px;
    text-align:center;
}
#resulte span{
    line-height:50px;
}
#resulte button{
    float:right;
    margin-top:15px;
    margin-right:15px;
}
</style>