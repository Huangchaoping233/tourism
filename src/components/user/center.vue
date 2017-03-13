<template>
    <div id="user">
        <div class="glass user-div">
            <h1>email:{{user.email}}</h1>
            <a class="glass light btn check-btn" href="#/check">查看保存的路线数据</a>
            <a class="glass light btn"  @click="loginout">退出登录</a>
        </div>
    </div>
</template>
<script>
    import api from '../../services/api_user'
    export default {
        data(){
            return {
                user: {}
            }
        },
        created(){
            if($.cookie('userid')){
                this.getUser()
            }
            
        },
        methods:{
            getUser:function(){
                api.getDataById($.cookie('userid'),function(data){
                    this.user = data.data
                }.bind(this))
            },
            loginout:function(){
                $.cookie('userid','',{path:'/',expiress:-1})
                this.$router.push({name:'Login'})
                this.$message.success("用户退出登录") 
            }
        }
    }
</script>
<style scoped>
div.user-div{
    background-color:transparent;
    width:50%;
    height:500px;
    margin: 0 auto;
    text-align:center;
    border-radius:15px;
    position:relative;
    padding:20px;
}
button.btn{
    border:none;
    background-color:transparent;
    height:60px;
    line-height:60px;
    font-size:20px;
    color:#666;
    padding:0 20px;
    border-radius:15px;
}
button.btn:active{
    background-color:aquamarine;
    position:relative;
    top:10px;
}
button.btn:focus{
    outline:none;
}
a.btn{
    margin: 0 auto;
    display: inline-block;
    width: 200px;
    height: 60px;
    color:#666;
    border-radius: 15px;
    text-align: center;
    line-height: 60px;
    justify-content: space-between;
}
</style>