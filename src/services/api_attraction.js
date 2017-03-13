
/**
 * 保存数据到服务器
 * 需要保存的数据 data
 * 请求成功的回调函数 callback
 */
export default {
    save(id,attractions,callback){
        $.ajax({
            url:`${global.ApiUrl}attractions/save_more_data`,
            data:{
                attractions:JSON.stringify(attractions),
                userid:id
            },
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
    getAttractions(id,callback){
        // console.log(id)
        $.ajax({
            url:`${global.ApiUrl}attractions/get_data`,
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
    del(delSavedList,callback){
        $.ajax({
            url:`${global.ApiUrl}attractions/del`,
            data:{
                attractions:JSON.stringify(delSavedList)
            },
            method:'post',
            success:function(res){
                console.log(res)
                callback(res)
            },
            error:function(err){
                console.log(err)
            }
        })
    }

}