<template>
    <div id="login">
        <h1>用户登录</h1>
        <div class="form noEle">
            <el-form :model="user" :rules="rules" ref="userForm" label-width="0px">
                <el-form-item label="" prop="email">
                    <el-input placeholder="请输入账号" v-model="user.email" icon="menu"></el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                    <el-input placeholder="请输入密码" type="password" v-model="user.password"></el-input>
                </el-form-item>
                <div>
                    <a href="#/register" class="btn glass light">去注册</a>
                    <a href="javascript:void(0)" class="btn glass light login-btn" @click="subHandle">登录</a>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
    import api from '../../services/api_user'
    import { Message } from 'element-ui'; //错误消息提示
    export default {
        data(){
            return {
                user: {
                    email: '',
                    password: ''
                },
                rules: {
                    email: [
                        { required: true, message: '账号不能为空'},
                        { type: 'email', message: '账号(邮箱)格式不正确' , trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空' },
                    ]
                }
            }
        },
        methods:{
            subHandle:function(){
                this.$refs['userForm'].validate(valid => {
                    if (valid) {
                        api.login(this.user, function (res) {
                            if (res.status == 'y') {
                                $.cookie('userid',res.userid,{path:'/'})
                                this.$message.success(res.msg)
                                this.$router.push({ name: 'Function' })
                            }
                            else {
                                this.$message.error(res.msg)
                            }
                        }.bind(this))
                    }
                    else {
                        console.log('vaildate error!')
                    }
                })
            }
        }
    }
</script>
<style scoped>
h1{
    text-align: center;
    margin-top: 100px;
    margin-bottom: 40px;
}
.form{
    width:50%;
    margin: 0 auto;
}
input{
    background-color:#FFE7BA;
    border:none;
    margin: 0 auto 40px;
    display: block;
    width:50%;
    height: 70px;
    line-height: 70px;
    font-size: 24px;
    padding:0 20px;
    border-radius: 10px;
    text-align: center;
    color: #666;
}
.login-btn{
    float:right;
}
a.btn{
    margin: 0 auto;
    display: inline-block;
    width: 200px;
    height: 60px;
    color:#666;
    border-radius: 15px;
    text-align: center;
    line-height: 70px;
    font-size: 24px;
    justify-content: space-between;
}
a.btn:active{
    position:relative;
    top:10px;
    background-color:aquamarine;
}

</style>