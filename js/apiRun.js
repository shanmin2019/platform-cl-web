//参数填写的折叠效果
$('.paramcom-interrun').on('click', '.icon-arrow', function () {
	$(this).toggleClass('active');
	if ($(this).hasClass('active')) {
		$(this).parent().siblings().addClass('active');
	} else {
		$(this).parent().siblings().removeClass('active');
	}
});
//设置环境下拉框
$('.iptenvir-interrun').click(function () {
	$(this).toggleClass('active');
	if ($(this).hasClass('active')) {
		$(this).siblings().addClass('active');
	} else {
		$(this).siblings().removeClass('active');
	}
});
$(document).click(function (e) {
	if (!$(e.target).closest('.iptenvir-interrun').length) {
		$('.envirlist-interrun').removeClass('active');
	}
});
//添加环境列表
$('body').last().on('click', '.toplist-layer .icon-add', function () {
	$('.envirlist-layer ul').last().prepend('<li>新环境<i class="icon icon-delete"></i></li>')
});
//删除环境列表
$('body').last().on('click', '.envirlist-layer .icon-delete', function () {
	$(this).parent().remove();
})
//高级参数设置展示更多
$('body').on('click', '.morelist-layer', function () {
	$(this).addClass('active').siblings().addClass('active');
})
//高级参数设置-添加方法的整列
$('body').on('click', '.paramslist-layer ul li', function () {
	$(this).addClass('active').siblings().removeClass('active');
	var text = $('.pcAlert').last().find('.paramslist-layer ul li.active span');
	var htmlArr = [];
	$.each(text, function (i, v) {
		htmlArr.push($(v).html());
	});
	var index = $(this).parents('.paramslist-layer').index();
	var length = $(this).parents('.paramslist-layer').siblings().length;
	var length2 = $('.pcAlert').last().find('.paramsdel-layer .paramslist-layer').length;
	$('.psmodexp-layer').last().html('{{ ' + htmlArr.join(' | ') + ' }}');
	if (index != length) return;
	if (index == 1 && length == 1 && length2 != 2 && $(this).parents('.paramscom-layer').length) return;
	$('.paramsdel-layer').last().append($('.paramslist-layer').first().clone());
})

//选择添加到集合
$('body').on('click', '.sellist-addass li', function () {
	$(this).toggleClass('active').siblings().removeClass('active');
});
//添加新集合展开收起
$('body').on('click', '.comtop-comdul', function () {
	$(this).toggleClass('active');
	if ($(this).hasClass('active')) {
		$(this).siblings().addClass('active');
	} else {
		$(this).siblings().removeClass('active');
	}
});
//确认添加新集合
$('body').on('click', '.add-ass', function () {
	var ifViladate = true;
	var $form = $('.pcAlert').last().find('#addAssParams');
	ifViladate = $form.validate('submitValidate');
	if (!ifViladate) return;
	var html = '<li><i class="icon-file"></i>' + $('.pcAlert #addAssParams').serializeArray()[0].value + '</li>';
	$(this).parents('.new-addass').siblings('.sellist-addass').children('ul').append(html);
})
$(function () {
	//共选择的集合
	var url = lemon.config.global.admin + "/suite/listAll";
	$.ajax({
		url: url,
		headers: { "Authorization": $.cookie("sessionId") },
		data: { "projectId": sessionStorage.getItem("projectId") },
		success: function (ret) {
			if (ret.data != null) {
				var suites = "";
				$.each(ret.data, function (ind, ele) {
					if (ind == 0) {
						suites += ("<li class='active' value='" + ele.id + "'><i class='icon-file'></i>" + ele.name + "</li>");
					} else {
						suites += ("<li class='' value='" + ele.id + "'><i class='icon-file'></i>" + ele.name + "</li>");
					}
				})
				$(".sellist-addass ul").append(suites);
			}
		}
	}),

		//环境设置弹框
		$('.envirlist-interrun').on('click', '#btnEnvirSet', function () {
			var _this = this;
			var dialog = jqueryAlert({
				'style': 'pc',
				'title': '环境设置',
				'content': $('#envirSetLayer'),
				'modal': true,
				'contentTextAlign': 'left',
				'width': '800px',
				'animateType': 'linear',
				'buttons': {
				}
			})
		});
	//高级参数设置弹框
	$('.paramline-interrun').on('click', '.edit-interrun', function () {
		var _this = this;
		var dialog = jqueryAlert({
			'style': 'pc',
			'title': '高级参数设置',
			'content': $('#paramSetLayer'),
			'modal': true,
			'contentTextAlign': 'left',
			'width': '1050px',
			'animateType': 'linear',
			'buttons': {
				'取消': function () {
					dialog.close();
				},
				'插入': function () {
					var rule = $('.psmodexp-layer').last().html();
					var value = $(_this).siblings('input').val();
					$(_this).siblings('input').val(rule + value);
					dialog.close();
				}
			}
		})
	});

	//单击保存,添加到集合
	$('#btnSaveInter').on('click', function () {
		var _this = this;
		var dialog = jqueryAlert({
			'style': 'pc',
			'title': '添加到集合',
			'content': $('#addAssemble'),
			'modal': true,
			'contentTextAlign': 'left',
			'width': '520px',
			'animateType': 'linear',
			'buttons': {
				'取消': function () {
					dialog.close();
				},
				'确定': function () {
					var $form = $('.pcAlert').last().find("[name='addSuiteForm']");
					ifViladate = $form.validate('submitValidate');
					console.info("ifViladate=" + ifViladate);
					if (!ifViladate) return false;
					var suiteId = $('.pcAlert').last().find(".sellist-addass").find("li.active").val();
					var name = $('.pcAlert').last().find("[name='name']").val();
					var url = lemon.config.global.admin + "/cases/add?name=" + name + "&suiteId=" + suiteId;
					$.ajax({
						url: url,
						headers: { "Authorization": $.cookie("sessionId") },
						data: $("[name='apiRunForm']").serialize(),
						type: 'post',
						dataType: 'json',
						async: false,
						success: function (ret) {
							alert(ret.message);
							dialog.close();
						}
					});

				}
			}
		})
	});

	$('#addAssParams').validate({
		onFocus: function () {
			this.parent().addClass('active');
			return false;
		},
		onBlur: function () {
			var $parent = this.parent();
			var _status = parseInt(this.attr('data-status'));
			$parent.removeClass('active');
			if (!_status) {
				$parent.addClass('error');
			}
			return false;
		}
	});

	$(".btn-send").click(function () {

		// $RM.request({
			
		// 	api:qccr.config.global.rootUrl+"/api/run",
		// 	headers: { "Authorization": $.cookie("sessionId") },
		// 	// data: $("[name='apiRunForm']").serialize(),
		// 	// data: JSON.stringify(this.apiRunForm),
		// 	type: 'post',
		// 	dataType: "json",
		// 	params: {
		// 		username: "18757187348",
		// 		password: "6c29a87c496864594985daba5d0b65d4"
		// 	},
		// 	result: function (ret) {
		// 		if (ret.status == "1") {
		// 			var ret_json = JSON.stringify(ret.data, null, 4);//将json转换为字符串
		// 			var body_json_str = JSON.parse(ret.data.body); //将json格式的body字符串转换成json对象
		// 			var body_json = JSON.stringify(body_json_str, null, 4);
		// 			var headers_json_str = JSON.parse(ret.data.headers); //将json格式的字符串转换成json对象
		// 			var headers_json = JSON.stringify(headers_json_str, null, 4);
		// 			$("[name='responseHeader']").html("<pre>" + headers_json + "</pre>");
		// 			$("[name='responseBody']").html("<pre>" + body_json + "</pre>");

		// 		}
		// 	}, fail: function (e) {
		// 		//self.error=e.msg;
		// 		console.log("页面callback fail:" + JSON.stringify(e));
		// 	}
		// });
		$.ajax({
			url:lemon.config.global.admin+"/api/apiRun",
			headers: { "Authorization": $.cookie("sessionId") },
			data:$("[name='apiRunForm']").serialize(),
			type:'post',
			dataType:'json',
			success:function(ret){
				if(ret.status=="1"){
					var ret_json = JSON.stringify(ret.data,null,4);//将json转换为字符串
					var body_json_str = JSON.parse(ret.data.body); //将json格式的body字符串转换成json对象
					var body_json= JSON.stringify(body_json_str,null,4);
					var headers_json_str = JSON.parse(ret.data.headers); //将json格式的字符串转换成json对象
					var headers_json= JSON.stringify(headers_json_str,null,4);
					$("[name='responseHeader']").html("<pre>"+headers_json+"</pre>");
					$("[name='responseData']").html("<pre>"+body_json+"</pre>");
					//自动换行-->style='while-space: pre-wrap; word-wrap:break-word;
				}else{
					alert(ret.message);

				}
			}
		});
	});
});