
/**
 * 保存数据到服务器
 * 需要保存的数据 data
 * 请求成功的回调函数 callback
 */
export default {
    save(data,callback){
        $.ajax({
            url:`${global.ApiUrl}plans`,
            data:data,
            method:'post',
            success:function(res){
                // console.log(res)
                callback(res)
            },
            error:function(err){
                console.log(err)
            }
        })
    },
    getData(id,callback){
        $.ajax({
            url:`${global.ApiUrl}plans/get_data`,
            data:{
                userid:id
            },
            method:'get',
            success:function(res){
                callback(res.data)
            },
            error:function(err){
                console.log(err)
            }
        })
    },
    delPlan(id,callback){
        $.ajax({
            url:`${global.ApiUrl}plans/del`,
            data:{
                id:id
            },
            method:'post',
            success:function(res){
                callback(res)
            },
            error:function(err){
                console.log(err)
            }
        })
    }

}