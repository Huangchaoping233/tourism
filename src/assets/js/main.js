// 按钮返回特效
$('body').on('mouseenter','.light',function(){
    var height =  $(this).height()
    var width = $(this).width()
    // console.log($(this).height())
    $('<div></div>').css({
        'width':'7px',
        height: height *Math.sqrt(2)+20+'px',
        transform: 'rotate(45deg)',
        'transform-origin': '20px 0px',
        'background-color':'white',
        opacity: '0.5',
        position:'absolute',
        right: -height+'px',
        top:'0',
    })
    .appendTo(this)
    .animate({
        right: width+ 'px',
    },{
        duration:500,
        complete:function(){
            $(this).remove()
        }
    })
})

//导航栏 按下按钮样式切换
// console.log($('#app').html())
// $('body').on('click','.nav ul li',function(){
//     $(this).addClass('active')
//     .siblings().removeClass('active')  
// })

