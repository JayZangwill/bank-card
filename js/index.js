$(function() {
	var idCardCheck = /^\d{17}(\d|X)$/,
		passCheck = /\w{6,}/,
		space = /\s/g;
	$("#registerBtn").on("click", function() {
		var height;
		$("#logCantainer").animate({
			height: "0",
			padding: "0"
		}, 500);
		if($(window).width() < 768) {
			height = "400px";
		} else {
			height = "300px";
		}
		$("#regCantainer").delay(500).animate({
			height: height,
			padding: "30px"
		}, 500);
		setTimeout(function() {
			$("#logCantainer").parent().addClass("hidden");
			$("#hidden").removeClass("hidden");
		}, 500)
	});
	$("#back").on("click", function() {
		var height;
		if($(window).width() > 768) {
			height = "270px";
		} else {
			height = "300px";
		}
		$("#logCantainer").delay(500).animate({
			height: height,
			padding: "30px"
		}, 500);
		$("#regCantainer").animate({
			height: "0px",
			padding: "0px"
		}, 500);
		setTimeout(function() {
			$("#logCantainer").parent().removeClass("hidden");
			$("#hidden").addClass("hidden");
		}, 500);
	});
	//登录框身份证验证
	idCheck("#idCard", "#idError");
	focu("#idCard", "#idError");
	focu("#idCard", "#nofound");
	//注册框身份证验证
	idCheck("#regIdCard", "#regIdError");
	focu("#regIdCard", "#regIdError");
	focu("#regIdCard", "#repeat");
	//登录框密码验证
	passwordCheck("#password", "#passError");
	focu("#password", "#passError");
	focu("#password", "#nopass");
	//注册框密码验证
	passwordCheck("#regPassword", "#regPassError");
	focu("#regPassword", "#regPassError");
	//确认密码验证
	$("#conPassword").on("blur", function() {
		if($(this).val() === $("#regPassword").val()) {
			$("#conPassError").fadeOut();
			$(this).parents(".relative").removeClass("has-error").addClass("has-success");
		} else {
			$("#conPassError").fadeIn();
			$(this).parents(".relative").removeClass("has-success").addClass("has-error");
		}
	});
	focu("#conPassword", "#conPassError");
	//当用选中文本框时，提示框消失
	function focu(input, error) {
		$(input).on("focus", function() {
			$(error).fadeOut();
		});
	}
	//检查身份证
	function idCheck(input, error) {
		$(input).on("blur", function() {
			var value = parseInt($(this).val());
			if(idCardCheck.test(value)) {
				$(error).fadeOut();
				$(this).parents(".relative").removeClass("has-error").addClass("has-success");
			} else {
				$(error).fadeIn();
				$(this).parents(".relative").removeClass("has-success").addClass("has-error");
			}
		});
	}
	//检查密码
	function passwordCheck(input, error) {
		$(input).on("blur", function() {
			var value = $(this).val();
			if(passCheck.test(value) && !space.test(value)) {
				$(error).fadeOut()
				$(this).parents(".relative").removeClass("has-error").addClass("has-success");
			} else {
				$(error).fadeIn();
				$(this).parents(".relative").removeClass("has-success").addClass("has-error");
			}
		});
	}
	//注册框提交数据
	$("#regGo").on("click", function() {
		var regIdOk = $("#regIdCard").trigger("blur").parents(".relative").hasClass("has-error"),
			regPassOk = $("#regPassword").trigger("blur").parents(".relative").hasClass("has-error"),
			conPassOk = $("#conPassword").trigger("blur").parents(".relative").hasClass("has-error");
		if(regIdOk || regPassOk || conPassOk) {
			return;
		} else {
			var idValue = $("#regIdCard").val(),
				passwordValue = $("#conPassword").val(),
				data = "idCard=" + idValue + "&" + "password=" + passwordValue + "&" + "money=0";
			$.post("http://localhost/reg", data, function(message) {
				if(message.message === "repeat") {
					$("#repeat").fadeIn();
				} else if(message.message === "success") {
					window.location = "home.html";
				}
			});
		}
	});
	//登录框提交数据
	$("#go").on("click", function() {
		var idOk = $("#idCard").trigger("blur").parents(".relative").hasClass("has-error"),
			passOk = $("#password").trigger("blur").parents(".relative").hasClass("has-error");
		if(idOk || passOk) {
			return;
		} else {
			var idValue = $("#idCard").val(),
				passwordValue = $("#password").val(),
				data = "idCard=" + idValue + "&" + "password=" + passwordValue;
			$.post("http://localhost/log", data, function(message) {
				if(message.message == "nofound") {
					$("#nofound").fadeIn();
				} else if(message.message === "password error") {
					$("#nopass").fadeIn();
				} else if(message.message === "success") {
					window.location = "home.html";
				}
			});
		}
	});
	$("#logCantainer").on("keyup",function(e){
		if(e.keyCode===13){
			$("#go").trigger("click");
		}
	});
	$("#regCantainer").on("keyup",function(e){
		if(e.keyCode===13){
			$("#regGo").trigger("click");
		}
	});
});