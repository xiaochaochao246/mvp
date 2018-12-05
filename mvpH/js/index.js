$(function(){
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

    $(".buy_btn").click(function(){
        var classId = $(this).attr("data-id");
		$.ajax({
			contentType:'application/json;charset=UTF-8',
			url: "/api/party/user/v2/user/session",// 获取登录信息
			type: "GET",
			dataType: "json",
			success: function(result) {
                // console.log(result);
                userId = result.data.userId;
				if(result.status == "888"){
					window.location.href = "http://mobile.iqihang.com/login?id=/zt/mvpH/index.html&zt=/zt/mvpH/index.html&zhuan=1"
				}else{
                    window.location.href = "http://mobile.iqihang.com/payment?paycid="+classId;

				}		
			},
			error: function(result){
				// console.log(result)
			}
		})
    })

})


