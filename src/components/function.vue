<template>
    <div id="function">
        <a class="fun-item glass light" :href="item.to" v-for="item in list">{{item.name}}</a>
    </div>
    
</template>
<script>
    export default {
        data(){
            return {
                list:[
                    {name:'查询景点',to:'#/query'},
                    {name:'规划路线',to:'#/plan'},    
                    {name:'查看路线',to:'#/check'},
                    {name:'更多功能',to:'#/more'}
                ]
            }
        },
        created(){
            if(!$.cookie('userid')){
                this.$message('请先登录')
                this.$router.push({name:'Login'})
            }
        }
    }
</script>
<style>
.fun-item{
    display: block;
    width: 46%;
    height: 300px;
    margin-bottom: 40px;
    float: left;
    text-align: center;
    font-size: 24px;
    color:#666;
    border-radius: 50px;
    box-sizing: border-box;
    padding: 20px;
}
.fun-item:nth-child(2n+1){
    margin-right: 8%;
}
a.fun-item:hover{
    background-color:#ccffff;
}
a.fun-item:active{
    position: relative;
    top:10px;
    background-color:aquamarine;
}
</style>