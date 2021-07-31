//添加host的弹窗
	$('.btn-addhost').click(function(){
		var dialog = jqueryAlert({
			'style'   : 'pc',
			'title'   : '添加host',
			'content' :  $('#addForm2'), //$("#alert-blockquote")
			'modal'   : true,
			'contentTextAlign' : 'left',
			'width'   : '620px',
			'animateType' : 'linear',
			'buttons' :{
				'取消' : function(){
					dialog.close();
				},
				'提交':function(){
					var ifViladate = true;
					var $form = $('.pcAlert').last().find('#addForm2');
					ifViladate = $form.validate('submitValidate');
					if(!ifViladate)return;
					let projectId = sessionStorage.getItem("projectId");
					$.ajax({
						url:qccr.config.global.admin+"/project/host/addHost?projectId="+projectId,
						headers:{"Authorization":$.cookie("sessionId")},
						data:$form.serialize(),
						type:'post',
						dataType:'json',
						async:false,
						success:function(ret){
							if(ret.status=="1"){
								dialog.close();
								window.location.reload();
							}
						}
					});

				}
			}
		})
	});

	// //添加接口的弹窗
	// $('.btn-addinter').click(function(){
	// 	var projectId = sessionStorage.getItem("projectId");
	// 	var url = qccr.config.global.rootUrl+"/apiClassification/findAll";
	// 	//准备分类下拉框数据
	// 	$.ajax({
	// 		headers: { "Authorization": $.cookie("sessionId") },
	// 		data:"projectId="+projectId,
	// 		url: url,
	// 		type: "GET",
	// 		success: function (ret) {
	// 			$(".desctit-interlist span").text("("+ret.data.length+")");
	// 			if(ret.status=="1"){
	// 				var options = "";
	// 				//select--options 项下面有很多数据进行拼接，把接口id作为value可以给其他业务用，唯一性
	// 				$.each(ret.data,function(ind,ele){
	// 					options+=("<option value='"+ele.id+"'>"+ele.name+"</option>");
	// 				});
	// 				//此处要与pojo的属性名一致
	// 				$("[name='apiClassificationId']").html();
	// 				//两种方式均可，第二个是根据父类->子类->名字
	// 				$(".line-addinter select[name='apiClassificationId']").html(options);
	// 			}
	// 		}
	// 	})
	// });
