
/**
 * 保存数据到服务器
 * 需要保存的数据 data
 * 请求成功的回调函数 callback
 */
export default {
    /**
     * 用户注册
     */
    register(data,callback){
        $.ajax({
            url:`${global.ApiUrl}users/reg`,
            data:data,
            method:'POST',
            success:function(res){
                $.cookie('224','222')
                callback(res)
            },
            error:function(err){
                console.log(err)
            }
        })
    },
    /**
     * 用户登录
     */
    login(data,callback){
        $.ajax({
            url:`${global.ApiUrl}users/login`,
            data:data,
            method:'POST',
            success:function(res){
                console.log(res)
                callback(res)
            },
            error:function(err){
                console.log(err)
            }
        })
    },
    getDataById(id,callback){
        $.ajax({
            url:`${global.ApiUrl}users/${id}`,
            method:'get',
            success:function(res){
                console.log(res)
                callback(res)
            },
            error:function(err){
                console.log(err)
            }
        })
    }
    ,
    //根据id修改指定的记录数据
    updateById(id,data,callback){
        $.ajax({
            url:`${global.ApiUrl}users/update/${id}`,
            data:data,
            method:'POST',
            success:function(res){
                callback(res)
            },
            error:function(err){
                console.log(err)
            }
        })
    }
}