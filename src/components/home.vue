<template>
    <div id="home">
        <h1>旅游路线规划系统</h1>
        <div class="glass">
            <dt>查询景点</dt>
            <dd>用户通过查询景点,可以将有意向取得旅游地添加到景点收集集合</dd>
        </div>
        <div class="glass">
            <dt>规划路线</dt>
            <dd>此功能是系统的核心功能,作用是在用户选择多个景点的情况下,为用户进行路线规划的系统</dd>
        </div>
        <div class="glass">
            <dt>查询路线</dt>
            <dd>对已经规划好的线路进行查询,并显示在地图上查看</dd>
        </div>
        <a class="glass btn light" href="#/login">去登录</a>
    </div>
</template>
<script>
    export default {

    }
    
</script>
<style scoped>
h1{
    text-align: center;
}
#home div{
    margin-top:50px;
    /*background-color:white;*/
    padding:24px;
    
}
dt{
    font-size: 24px;
}
dd{
    font-size: 20px;
}
a.btn{
    float: right;
    margin-top:50px;
    display: block;
    width: 160px;
    height: 50px;
    color:#666;
    border-radius: 15px;
    text-align: center;
    line-height: 50px;
}
a.btn:active{
    position:relative;
    top:10px;
    background-color:aquamarine;
}

</style>