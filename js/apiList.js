
//接口数据分组处理
function interDataPaging(data,page){
	if(data.length <= page){
		return [data];
	}
	var arr,listArr = [];
	for(var i=0;i < data.length;i++){
		if(i % page == 0){
			arr  && listArr.push(arr);
			arr = [];
		}
		arr.push(data[i]);
	}
	listArr.push(arr);
	return listArr;
}

function showApi(apiId){
	// var baseUrl = qccr.config.global.rootUrl;
	// var menuFindurl = baseUrl+"/index/findApiSelectedMenu?apiId="+id;
	// var data = {"apiId":id};
	// var turn2Page = baseUrl+"/api/toApiView?apiId="+id;
	// //跳转到对应页面，并选中对应菜单
	// selectMenuAndTurn2Page(menuFindurl,data,turn2Page);
	sessionStorage.setItem("apiId",apiId);
}

//分页数据html生成
function pagingDataBuild(pagedata){
	var status = 1;
	var html = '';
	var baseUrl = lemon.config.global.rootUrl;
	for(var i=0;i<pagedata.length;i++){
		html += '<li><ul class="clearfix">';

		html += '<li><a href="apiView.html" onclick="showApi('+pagedata[i].id+')">'+pagedata[i].name+'</a></li>';

		html += '<li><i class="icon-badge">'+pagedata[i].method.toUpperCase()+'</i>'+pagedata[i].url+'</li>';
		html += '<li>'+pagedata[i].classificationName+'</li>';
		html += '</li>';
		html += '<li>';
		html += '<i class="icon-circle '+(status == 1 ? 'active' : '')+'"></i>'+(status == 1 ? '已完成' : '未完成');
		html += '</li>';
		html += '</ul></li>';
	}
	return html;
}

//分页数据显示
/*
	pagedata:分页的数据
	pageNum:每页显示多少条数据
 */
function pagingDataShow(pagedata,pageNum){
	var interDataGroup = interDataPaging(pagedata,pageNum);
	//分页
	$('#pagination').pagination({
	    totalData: pagedata.length,
	    showData: pageNum,
	    coping: true,
	    jump: true,
	    callback:function(api){
	    	$('#interData>ul').html(pagingDataBuild(interDataGroup[api.getCurrent()-1]));
	    }
	});
	//加载数据
	$('#interData>ul').html(pagingDataBuild(interDataGroup[0]));
}


$(function(){
	var projectId = sessionStorage.getItem("projectId");
	var apiClassificationId = sessionStorage.getItem("apiClassificationId");
	// var projectId = $("[name='projectId']").val();
	// var apiClassificationId = $("[name='apiClassificationId']").val()==undefined?"":$("[name='apiClassificationId']").val();
	var listUrl = "";
	//获取数据接口
	if(projectId!=""){
		listUrl = lemon.config.global.rootUrl+"/api/showApiListByProject?projectId="+projectId;
	}
	if(apiClassificationId!=''&& apiClassificationId!=null){
		listUrl = lemon.config.global.rootUrl+"/api/showApiListByClassificationId?apiClassificationId="+apiClassificationId;
	}
	let sessionId = $.cookie("sessionId");
	$.ajax({
		headers: { "Authorization": sessionId },
		url: listUrl,
		type: "GET",
		success: function (ret) {
			$(".desctit-interlist span").text("("+ret.data.length+")");
			if(ret!=null&&ret.data.length>0){
				//分页显示数据
				pagingDataShow(ret.data,3);
			}
			if (ret.status == 0 && ret.message == "账号未登录") {
				location.href = lemon.config.global.htmlUrl + "/html/login.html";
			}
		}
	})
	// $.post(listUrl,function(ret){
	// 	$(".desctit-interlist span").text("("+ret.data.length+")");
	// 	if(ret!=null&&ret.data.length>0){
	// 		//分页显示数据
	// 		pagingDataShow(ret.data,3);
	// 	}
	// 	//初始化分类信息
	// },'json');
	//接口列表分类下拉框显示隐藏
	$('#interData').on('click','.icon-droparr',function(){
		$(this).siblings('.dropcom-interlist').toggleClass('active');
		if($(this).siblings('.dropcom-interlist').hasClass('active')){
			$(this).addClass('active');
			return;
		}
		$(this).removeClass('active');
	});

	//接口列表状态下拉框显示隐藏
	$('#interDataTit').on('click','.icon-filter',function(){
		$(this).siblings().toggleClass('active');
		if($(this).siblings().hasClass('active')){
			$(this).addClass('active');
			return;
		}
		$(this).removeClass('active');
	});

	//添加接口的弹窗
	$('.btn-addinter').click(function(){
		let projectId = sessionStorage.getItem("projectId");
		var url = lemon.config.global.admin+"/apiClassification/findAll/"+projectId;
		//准备分类下拉框数据
		$.ajax({
			headers: { "Authorization": $.cookie("sessionId") },
			// data:"projectId="+projectId,
			url: url,
			type: "GET",
			success: function (ret) {
				$(".desctit-interlist span").text("("+ret.data.length+")");
				if(ret.status=="1"){
					var options = "";
					//select--options 项下面有很多数据进行拼接，把接口id作为value可以给其他业务用，唯一性
					$.each(ret.data,function(ind,ele){
						options+=("<option value='"+ele.id+"'>"+ele.name+"</option>");
					});
					//此处要与pojo的属性名一致
					$("[name='apiClassificationId']").html();
					//两种方式均可，第二个是根据父类->子类->名字
					$(".line-addinter select[name='apiClassificationId']").html(options);
				}
				var dialog = jqueryAlert({
					'style'   : 'pc',
					'title'   : '添加接口',
					'content' :  $('#addForm'), //$("#alert-blockquote")
					'modal'   : true,
					'contentTextAlign' : 'left',
					'width'   : '520px',
					'animateType' : 'linear',
					'buttons' :{
						'取消' : function(){
							dialog.close();
						},
						'提交':function(){
							var apiClassificationId = sessionStorage.getItem("apiClassificationId", apiClassificationId);
							var ifViladate = true;
							var $form = $('.pcAlert').last().find('#addForm');
							ifViladate = $form.validate('submitValidate');
							  if(!ifViladate)return;
							$.ajax({
						url:lemon.config.global.admin+"/api/addApi",
						headers:{"Authorization":$.cookie("sessionId")},

						data:$form.serialize(),
						type:'post',
						dataType:'json',
						async:false,
						success:function(ret){
							if(ret.status=="1"){
								dialog.close();
								window.location.reload();
							}else{
								alert(ret.message)
							}
						}
							});

						}
					}
				})
			}
		})
		// $.post(url,{"projectId":1},function(ret){


		// },'json');
	});

	$(document).click(function(e){
		if(!$(e.target).closest('#interData ul li li').length){
			$('.dropcom-interlist').removeClass('active').siblings('.icon-droparr').removeClass('active');
		}
		if(!$(e.target).closest('#interDataTit ul li').length){
			$('.statustit-interlist').removeClass('active').siblings('.icon-filter').removeClass('active');
		}
	});


	$('#addForm').validate({
	    onFocus: function() {
	      this.parent().addClass('active');
	      return false;
	    },
	    onBlur: function() {
	      var $parent = this.parent();
	      var _status = parseInt(this.attr('data-status'));
	      $parent.removeClass('active');
	      if (!_status) {
	        $parent.addClass('error');
	      }
	      return false;
	    }
  	});

	$("#suiteLink").click(function(){
		var rootUrl = lemon.config.global.rootUrl;
		var to = rootUrl+"/suite/findAll";
		window.location.href = to;
	});
});
