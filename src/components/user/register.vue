<template>
    <div id="register">
        <h1>用户注册</h1>
        <div class="form noEle">
            <el-form :model="user" :rules="rules" ref="userForm" label-width="0px">
                <el-form-item label="" prop="email">
                    <el-input placeholder="请输入邮箱,作为账号" v-model="user.email" icon="menu"></el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                    <el-input placeholder="请输入密码" type="password" v-model="user.password"></el-input>
                </el-form-item>
                <el-form-item label="" prop="password2">
                    <el-input placeholder="请确认密码" type="password" v-model="user.password2"></el-input>
                </el-form-item>
                <div>
                    <a class="glass light btn register-btn" @click="subHandle()">注册</a>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
    import api from '../../services/api_user'
    export default {
        data() {
            var validatePwd2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.user.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                user: {
                    email: '',
                    password: '',
                    password2: ''
                },
                rules: {
                    email: [
                        { required: true, message: '邮箱不能为空' },
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur'  }
                    ],
                    password: [
                        { required: true, message: '密码不能为空' },
                        { min: 6, message: '密码不能小于6位', trigger: 'blur' }
                    ],
                    password2: [
                        {validator:validatePwd2, trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            subHandle: function () {
                this.$refs['userForm'].validate(valid => {
                    if (valid) {
                        api.register(this.user, function (res) {
                            if (res.status == 'y') {
                                this.$message.success("用户注册成功")
                                this.$router.push({ name: 'Login' })
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
    h1 {
        text-align: center;
        margin-top: 100px;
        margin-bottom: 40px;
    }
    
    .form {
        width: 50%;
        margin: 0 auto;
    }
    
    .register-btn {
        float:right;
    }
    
    input.el-input__inner {
        border: none !important;
    }
    
    a.btn {
        margin: 0 auto;
        display: inline-block;
        width: 200px;
        height: 60px;
        color: #666;
        border-radius: 15px;
        text-align: center;
        line-height: 60px;
        font-size: 24px;
        justify-content: space-between;
    }
    
    a.btn:active {
        position: relative;
        top: 10px;
        background-color: aquamarine;
    }
    
</style>