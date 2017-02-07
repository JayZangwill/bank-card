$(function() {
	var num = /^\d+$/,
		space = /\s/,
		/*匹配标点符号和中文*/
		illegal = /[\u4E00-\u9FA5|\|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?|\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5|\s]/,
		time;
	$("body").animate({
		paddingTop: "150px"
	}, 800);
	$("#container").animate({
		opacity: 1
	}, 800);
	/*查询余额*/
	$("#search").on("show.bs.modal", function() {
		$.get("http://www.jayzangwill.cn:1337/findmoney", function(message) {
			if(message.message === "nologin") {
				$("#search .modal-body").html("您还没登陆,请返回登录");
				$("#search").on("hidden.bs.modal", function() {
					window.location = "http://www.jayzangwill.cn/bank-card/index.html";
				});
				return;
			}
			$("#search .modal-body").html("您的余额还剩：" + message.message + " 元");
		})
	});
	focu("#depositCount", "#errorDeposit", "#warnDeposit");
	focu("#drawCount", "#errorDraw", "#warnDraw");
	unFocu("#depositCount", "#errorDeposit", "#warnDeposit");
	unFocu("#drawCount", "#errorDraw", "#warnDraw");
	/*存钱*/
	$("#saveMoney").on("click", function() {
		var depOk = $("#depositCount").trigger("blur").parents(".relative").hasClass("has-error");
		if(!depOk) {
			var money = $("#depositCount").val(),
				data = "money=" + money;
			clearTimeout(time);
			$.post("http://www.jayzangwill.cn:1337/deposit", data, function(message) {
				if(message.message === "nologin") {
					alert("您还没登录,请返回登录!");
					window.location = "http://www.jayzangwill.cn/bank-card/index.html";
					return;
				}
				$("#deposit #success").html("您已成功存取" + message.message + "元,点击存储继续存钱").fadeIn();
				time = setTimeout(function() {
					$("#deposit #success").fadeOut();
				}, 1500);
			});
		} else {
			return;
		}
	});
	/*取钱*/
	$("#getMoney").on("click", function() {
		var depOk = $("#drawCount").trigger("blur").parents(".relative").hasClass("has-error");
		if(!depOk) {
			var money = $("#drawCount").val(),
				data = "money=" + money;
			clearTimeout(time);
			$.post("http://www.jayzangwill.cn:1337/draw", data, function(message) {
					if(message.message === "nologin") {
						alert("您还没登录,请返回登录!");
						window.location = "http://www.jayzangwill.cn/bank-card/index.html";
						return;
					}
				if(typeof message.message === "number") {
					$("#draw #success").html("您已成功取出" + message.message + "元,点击存储继续存钱").fadeIn();
					time = setTimeout(function() {
						$("#draw #success").fadeOut();
					}, 1500);
				} else {
					$("#more").html("您的银行卡里没这么多钱").fadeIn();
					time = setTimeout(function() {
						$("#more").fadeOut();
					}, 1500);
				}
			});
		} else {
			return;
		}
	});
	$("#out").on("click", function() {
		window.location = "index.html";
	});
	//用户激活某个输入框时
	function focu(input, error, warn) {
		$(input).on("focus", function() {
			$(error).fadeOut();
			$(warn).fadeIn();
		});
	}
	//用户反激活某个输入框时判断用户的输入
	function unFocu(input, error, warn) {
		$(input).on("blur", function() {
			if(illegal.test($(this).val()) || $(this).val() === "") {
				$(warn).fadeOut();
				$(error).fadeIn();
				$(this).parents(".relative").removeClass("has-success").addClass("has-error");
				return;
			}
			var money = parseInt($(input).val());
			if(!isNaN(money) && num.test(money) && money <= 10000 && money > 0) {
				$(this).parents(".relative").removeClass("has-error").addClass("has-success");
			} else {
				$(warn).fadeOut();
				$(error).fadeIn();
				$(this).parents(".relative").removeClass("has-success").addClass("has-error");
			}
			$(warn).fadeOut(); //当用户什么也没有输入时让警告框消失
		});
	}
});