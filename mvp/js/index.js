$(function(){
    register();
    loginBox();

// 楼梯

var timer = null;
var startMove = function (argument) {
    var louti = document.getElementById("louti");
    //  console.log(louti)
    clearInterval(timer);
    timer = setInterval(function () {
        var speed = (argument - louti.offsetTop) / 4;
        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
        if (argument == louti.offsetTop) {
            clearInterval(timer);
        } else {
            louti.style.top = louti.offsetTop + speed + "px";
        }
    }, 10);
};
startMove();

var scrollMove = function () {
    window.onscroll = window.onload = function () {
        var louti = document.getElementById("louti");
        var scrolltop =
            document.body.scrollTop || document.documentElement.scrollTop;
        startMove(
            parseInt(
                (document.documentElement.clientHeight -
                    louti.offsetHeight) / 2 + scrolltop
            )
        );
    };
};
scrollMove();

var remainplace = function () {
    var text = $(".price_desc i");

        $.ajax({
            contentType:'application/json;charset=UTF-8',
            url: "/es/index_product/type_product/7a549d1cf63641f7955d4064676c9aa7",//获取课程详情
            type: "GET",
            dataType: "json",
            success: function (data) {
                var num = 20 - data._source.type_product_salesVolume;
                var salenumber = "仅剩" + num + "名额";
                if (num <= 0) {
                    $(".nav_price")[0].style.display = "block";
                    $(".price")[0].style.display = "none";
                } else {
                    $(".nav_price")[0].style.display = "none";
                    $(".price")[0].style.display = "block";
                }
                text.html(salenumber);
               
            },
            error: function(data){
                
            }
        })
    
}
remainplace();

//立即购买
$(".buy_btn").click(function(){
    var classId = $(this).attr("data-id");
    $.ajax({
        contentType:'application/json;charset=UTF-8',
        url: "/api/party/user/v2/user/session",// 获取登录信息
        type: "GET",
        dataType: "json",
        success: function(result) {
            // console.log(result);
            if(result.status == "888"){
                $(".gray").show();
                $(".register").show();
            }else{
                // $(".registera").html("已登录")
                // $(".registera").unbind("click")
                // $(".quit").show();
                
                window.location.href="http://www.iqihang.com/buy?courseId="+classId;
            }		
        },
        error: function(result){
            // console.log(result)
        }
    })
})


     // 以下登陆注册    
     function enroll(){
        $.ajax({
            contentType:'application/json;charset=UTF-8',
            url: "/api/party/nologin/v2/user/verifyImage?width=100&height=50",//注册接口
            type: "get",
            dataType: "json",
            success: function(result) {
                //console.log(result.verifyImage);
                $('.txyz-btn').attr("src",result.verifyImage)
            },
            error: function(result){
                // console.log(result)
            }
        })
    }
    enroll();
    $('.txyz-btn').click(function () {
        enroll()
    });
    //获取短信验证
    function note() {
        var enrollPhone = $('#enroll-phone').val();//电话号码
        var yzm = $('#yzm').val();//图形验证码
        var enrollPassword = $('#enroll-password').val();//密码
        // var phoneYzm = $('#phone-yzm').val();//手机验证码

        if(enrollPhone === ''){
            alert('手机号不能为空')
        }else if(!(/^1(3|4|5|7|8|6|9)\d{9}$/.test(enrollPhone))){
            alert('请输入正确的手机号')
        }else {
            if(enrollPassword === ''){
                alert("密码不能为空")
            }else{
                if(yzm === ''){
                    alert("图形验证码不能为空")
                }else{
                    $.ajax({
                        contentType:'application/json;charset=UTF-8',
                        url: "/api/party/nologin/v2/user/sendSms?phone="+enrollPhone+"&cmd=9&verifyCode="+yzm,
                        type: "get",
                        dataType: "json",
                        success: function(result) {
                            console.log(result);
                            if(result.status == '1'){
                                //已注册
                                alert('验证码发送频繁，请稍后再试')
                            }else if(result.status == '0'){
                                var t = 60;
                                function w() {
                                    $('.phone-btn').html(t + 's');
                                    // alert(t)
                                    t--;
                                    if(t == 0){
                                        $('.phone-btn').html('重新验证')
                                    }else {
                                        setTimeout(w,1000);
                                    }
                                }
                                w();
                                alert("短信已发送至您的手机")

                            }
                        },
                        error: function(result){
                            console.log(result);
                            // alert(result)
                        }
                    })
                }
            }
        }
    }
    $('.phone-btn').click(function () {
        note()
    });
    //点击下一步
    function next() {
        var enrollPhone = $('#enroll-phone').val();//电话号码
        var yzm = $('#yzm').val();//图形验证码
        var enrollPassword = $('#enroll-password').val();//密码
        var phoneYzm = $('.phone-yzm').val();//手机验证码

        sessionStorage.setItem('enrollPhone', enrollPhone);
        sessionStorage.setItem('yzm', yzm);
        sessionStorage.setItem('enrollPassword', enrollPassword);
        sessionStorage.setItem('phoneYzm', phoneYzm);

        if(enrollPhone === ''){
            alert('手机号不能为空')
        }else if(!(/^1(3|4|5|7|8)\d{9}$/.test(enrollPhone))){
            alert('请输入正确的手机号')
        }else {
            if(enrollPassword === ''){
                alert("密码不能为空")
            }else{
                if(yzm === ''){
                    alert("图形验证码不能为空")
                }else{
                    if(phoneYzm === ''){
                        alert("手机验证码不能为空")
                    }else {
                        $.ajax({
                            contentType:'application/json;charset=UTF-8',
                            url: "/api/party/nologin/v2/user/checkVerifyCode?verifyCode="+phoneYzm,
                            type: "get",
                            success: function(result) {
                                console.log(result);
                                if(result.status == '1'){
                                    alert(result.msg)
                                }else {
                                    //正确
                                // window.location.replace("successfully.html");
                                    $('.major').show();
                                    $('.register').hide();
                                    // window.location.reload();
                                }
                            },
                            error: function(result){
                                console.log(result);

                            }
                        });
                    }
                }
            }
        }
    }
    $(function(){
        $('.next-btn').click(function () {
            next()
        });
    })


    //选择课程接口
    function selectCourse() {
        //alert(1)
        $.ajax({
            url: "/es/index_catalog/type_catalog/_search",// 接口
            type: "POST",
            dataType: "json",
            data: JSON.stringify({
                "query": {
                    "bool": {
                        "must": [
                            {
                                "term": {
                                    "type_catalog_datatype": "exam"
                                }
                            },{
                                "term":{"type_catalog_businessId":"1001"}
                            }
                        ]
                    }
                },
                "from":0,
                "size":10,
                "sort":{
                    "type_catalog_sort":{
                        "order":"asc"
                    }
                }
            }),
            success: function (result) {
                // console.log(result);
                //type_catalog_businessId
                for (var  i = 0; i < result.hits.hits.length; i++) {
                    $('section ul').append('' +
                        '<li><input type="radio" name="radio" ' +
                        'value='+result.hits.hits[i]._source.type_catalog_name+
                        ' data-id="'+result.hits.hits[i]._id+'">'
                        + result.hits.hits[i]._source.type_catalog_name+ '</li>')
                }
                $("section li:eq(0)").find("input").attr("checked",true)//默认选择第一个
            },
            error: function(result) {
                // console.log(result);
            }
        });

    }
    selectCourse();

    //完成注册
    function compvareRegister() {
        var enrollPhone = sessionStorage.getItem('enrollPhone');
        var yzm = sessionStorage.getItem('yzm');
        var enrollPassword = sessionStorage.getItem('enrollPassword');
        var phoneYzm = sessionStorage.getItem('phoneYzm');

        var dataId = $('input[name=radio]:checked').attr('data-id');
        var dataVal = $('input[name=radio]:checked').val();

        $.ajax({
            contentType:'application/json;charset=UTF-8',
            url: "/api/party/nologin/v2/user/reg",
            type: "POST",
            dataType: "json",
            data: JSON.stringify({
                'username':enrollPhone,
                'phone':enrollPhone,
                'password':enrollPassword,
                'verifyCodePic':yzm,
                'verifyCodeTel':phoneYzm,
                'examId':dataId,//id
                'examName':dataVal,//考试类型
                'source':'PC',
                'businessId':1001
            }),
            success: function(result) {
                // console.log(result);
                if(result.status == '3'){
                    //错误提示
                    alert('请输入正确的手机验证码');
                    //window.location.replace("enroll.html");
                }else if(result.status == '4'){
                    alert(result.msg);
                    window.location.replace("enroll.html");
                }  else{
                    setTimeout(function () {
                        //注册成功之后调用接口
                        $.ajax({
                            contentType:'application/json;charset=UTF-8',
                            url: "/api/party/nologin/v2/user/login?routingPorts=PC",
                            type: "POST",
                            dataType: "json",
                            data: JSON.stringify({
                                "username":enrollPhone,
                                "password":enrollPassword
                            }),
                            success: function(result) {
                                console.log(result);
                                if(result.status == 403){
                                    //密码错误
                                    alert(result.mag)
                                }else {
                                    //登录成功
                                    $('.gray').hide();
                                    $('.major').hide();
                                }
                            },
                            error: function(result){
                                // console.log(result)
                            }
                        })
                    },1000)
                }
            },
            error: function(result){
                console.log(result)
            }
        })
    }

    $('.affirm-btn').click(function () {
        compvareRegister()
    });



    //登录弹窗
    function register(){
        $('.registera').click(function () {
            // console.log($('.registera'))
            $('.gray').show();
            $('.register').show();
            $("#body").css("overflow","hidden");
        });
    
        $('.register-title li').click(function () {
            // console.log($('.register-title li'))
            var index = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $('.register-content .register-input').addClass('active').eq(index).siblings().removeClass('active');
        });
    
        $('.close-btn').click(function () {
            $('.register').hide();
            $('.gray').hide();
            $("#body").css("overflow","visible")
    
        })
    }
        


    //登录弹窗接口
    function loginBox(){
        $('.register-btn').click(function () {
            // console.log("clicked")
            var userNumber = $('#user-number').val();
            var userPassword = $('#user-password').val();

            var js = {"username":userNumber,"password":userPassword};
            var json = JSON.stringify(js);
            
            $.ajax({
                contentType:'application/json;charset=UTF-8',
                url: "/api/party/nologin/v2/user/login?routingPorts=PC",
                type: "POST",
                dataType: "json",
                data: json,
                success: function(result) {
                    //console.log(result);
                    if(result.status == 403){
                        //密码错误
                        alert(result.msg)
                    }else {
                        //登录成功
                        window.location.reload();
                        $('.registera').html('已登录');
                        $('.gray').hide();
                        $('.register').hide();
                        $("#body").css("overflow","visible");
                        
                    }
                },
                error: function(result){
                    // console.log(result)
                }
            })
        });

    }

})

