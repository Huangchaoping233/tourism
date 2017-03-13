<template>
  <div id="app">
    <div class="nav">
      <div class="container">
        <ul>
          <li class="active glass light"><a href="#/">首页</a></li>
          <li class="glass light"><a href="#/function">功能</a></li>
          <li class="glass light"><a href="#/help">帮助</a></li>
          <li class="glass light"><a :href='"#/"+(isLogin?"center":"login")'>{{isLogin?"个人中心":"登录"}}</a></li>
        </ul>
      </div>
    </div>
    <router-view class="view container"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data(){
    return {
      isLogin:false
    }
  },
  watch:{//监控路由
    $route:function(){
      if($.cookie('userid') && $.cookie('userid') != ''){
        this.isLogin = true;
      }
      else{
        this.isLogin = false;
      }
      
      $('a[href="#'+this.$router.currentRoute.fullPath+'"]').parent().addClass('active')
      .siblings().removeClass('active')
    }
  },
  created(){
    // console.log($.cookie('userid'))
    if($.cookie('userid')){
        this.isLogin = true;
      }
  }
  

}

</script>

<style>
body,html{
  margin: 0;
  padding: 0;
  height: 100%;
  color:#666;
 
}
#app{
  height: 100%;
  background-color: #FFE7BA;
}
ul,li{
  margin: 0;
  padding: 0;
  list-style-type: none;
}
a{
  text-decoration: none;
}
.nav{
  padding-top:5px;
  height: 100px;
  /*background-color:white;*/
}
.container{
  width:1200px;
  margin: 0 auto;
  /*background-color:rgba(255, 228, 196, 0.7);*/
}
.nav .container ul li{
  float: left;
  width:19%;
  line-height: 100px;
  text-align: center;
  font-size: 24px;
  margin-right: 8%;
  background-color:transparent;
  border-radius: 10px;
  
}
.glass{
  box-shadow: 10px 10px 20px rgba(255, 255, 255, 0.6) inset,
  -10px -10px 20px rgba(255, 255, 255, 0.6) inset;
  position: relative;
  overflow:hidden;
}
.nav .container ul li:last-child{
  margin-right: 0;
}
.nav .container ul li a{
  display: inline-block;
  width:100%;
  height: 100%; 
  color:#666;
}
.nav .container ul li:hover{
  background-color:rgba(255, 228, 196, 1);
}
.nav .container ul li:active{
  position:relative;
  top:10px;
}
.nav .container ul li.active{
  background-color:aquamarine;
}

.view{
  padding-top: 50px;
  height: calc(100% - 160px);
}
input.el-input__inner{
    border:none;
    background-color: transparent;
    box-shadow: 10px 10px 20px rgba(255, 255, 255, 0.6) inset,
    -10px -10px 20px rgba(255, 255, 255, 0.6) inset;
    position: relative;
    width:100%;
    height: 60px;
    font-size: 20px;
    // border-radius: 15px;
    text-align: center;
    color:#666;

}
input.el-input__inner:focus{
  border:none;
}
.el-form-item__content{
  height:100px;
  text-align:center;
}
.noEle button.el-button{
  box-shadow: 10px 10px 20px rgba(255, 255, 255, 0.6) inset,
    -10px -10px 20px rgba(255, 255, 255, 0.6) inset;
  width:200px;
  height: 60px;
  border-radius:15px;
  border:none;
  background-color: transparent;
  font-size: 24px;
  color:#666;
  position: absolute;
  right:0;
}
.noEle button.el-button:focus{
  color:#666;
}
.noEle button.el-button:active{
  background-color:aquamarine;
  top:10px;
}
.noEle button.el-button:hover{
  border:none;
  color:#666;
}
.el-form-item__error{
  color:red;
}
#r-result>div{
    border:none !important;
}
#r-result>div>div:nth-of-type(2){
  margin-top:0 !important;
}
.el-message {
    box-shadow: 0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04);
    min-width: 300px;
    padding: 10px 12px;
    box-sizing: border-box;
    border-radius: 2px;
    position: fixed;
    left: 50%;
    top: 20px;
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
    background-color: #fff;
    transition: opacity .3s,transform .4s;
    overflow: hidden;
    z-index:1000;
    font-size:16px;
}
.el-message__img {
    width: 40px;
    height: 40px;
    position: absolute;
    left: 0;
    top: 0;
}
.el-message__group p {
    font-size: 14px;
    margin: 0 34px 0 0;
    white-space: nowrap;
    color: #8391a5;
    text-align: center;
}
</style>
