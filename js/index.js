$(function() {
	// 高度计算
	function calcHeight() {
		var pageHeight = document.body.clientHeight
		var rightIframe = pageHeight - 185;
		$(".rightIframe").height(rightIframe);
		$(".left-interlist").height(rightIframe);
	}
	calcHeight();
	window.onresize = function() {
		calcHeight();
	}

	// 添加分类的弹窗
	$('#addfl').click(
			function() {
				var dialog = jqueryAlert({
					'style' : 'pc',
					'title' : '添加分类',
					'content' : $('#addClassification'), // $("#alert-blockquote")
					'modal' : true,
					'contentTextAlign' : 'left',
					'width' : '520px',
					'animateType' : 'linear',
					'buttons' : {
						'取消' : function() {
							dialog.close();
						},
						'提交' : function() {
							var projectId = sessionStorage.getItem("projectId", projectId);
							// $("[name='projectId']").val();
							var ifViladate = true;
							var $form = $('.pcAlert').last().find(
									'#addClassification');
							ifViladate = $form.validate('submitValidate');
							if (!ifViladate)
								return;
							$.ajax({
								url : lemon.config.global.admin
										+ "/apiClassification/"+projectId,
								headers:{"Authorization":$.cookie("sessionId")},
								data : $form.serialize(),
								type : 'post',
								dataType : 'json',
								async : false,
								success : function(ret) {
									if(ret.status=="1"){
										dialog.close();
										window.location.reload();
									}
								}
							});

						}
					}
				})
				// }

			});


	//添加集合的弹窗
	$('#addjh').click(
			function() {
				var dialog = jqueryAlert({
					'style' : 'pc',
					'title' : '添加集合',
					'content' : $('#addSuite'), // $("#alert-blockquote")
					'modal' : true,
					'contentTextAlign' : 'left',
					'width' : '520px',
					'animateType' : 'linear',
					'buttons' : {
						'取消' : function() {
							dialog.close();
						},
						'提交' : function() {
							var projectId = sessionStorage.getItem("projectId", projectId);
							var ifViladate = true;
							var $form = $('.pcAlert').last().find('#addSuite');
							ifViladate = $form.validate('submitValidate');
							if (!ifViladate)
								return;
							$.ajax({
								url : lemon.config.global.admin
										+ "/suite/add",
								headers:{"Authorization":$.cookie("sessionId")},
								data : $form.serialize()+"&projectId="+projectId,
								type : 'post',
								dataType : 'json',
								async : false,
								success : function(ret) {
									alert("新增成功~")
									dialog.close();
									window.location.reload();
								}
							});

						}
					}
				})
			});

});
