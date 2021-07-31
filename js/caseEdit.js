$(function(){
	$("#btnUApi").click(function(){
		$.ajax({
			url:lemon.config.global.rootUrl+"/cases/updateCases",
			headers: { "Authorization": $.cookie("sessionId") },
			data:$("[name='caseForm']").serialize(),
			type:'POST',
			dataType:'json',
			success:function(ret){
				if(ret!=null){
					alert(ret.message);
					if(ret.status=="1"){
						window.location.reload();
					}
				}
			}
		});
	});
	$(".btn-send").click(function(){
		
		$.ajax({
			url:lemon.config.global.admin+"/api/apiRun",
			headers: { "Authorization": $.cookie("sessionId") },
			data:$("[name='caseForm']").serialize(),
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
	
	$(".restit-interrun").find("div").click(function(){
		var index = $(this).index();
		$(this).css("border-bottom","2px solid #2395f1");
		$(this).css("color","#2395f1");
		$(this).siblings().css("border-bottom","");
		$(this).siblings().css("color","");
		if(index==0){
			//显示
			$(".reslist-interrun").show();
			//隐藏
			$(".testlist-interrun").hide();
		}else if(index==1){
			//显示
			$(".testlist-interrun").show();
			//隐藏
			$(".reslist-interrun").hide();
			// 找到表中配置的断言规则,用于数据回显
			// var url = lemon.config.global.rootUrl+"/suite/findCaseTestRule";
			// var caseId = $("[name='caseId']").val();
			// $.post(url,{"caseId":caseId},function(ret){
			// 	if(ret.status=="1"){
			// 		if(ret.data!==null){
			// 			//数据回填到页面
			// 			$("[name='caseTestRule.expression']").val(ret.data.expression);
			// 			$("[name='caseTestRule.expected']").val(ret.data.expected);
			// 		}
			// 	}else{
			// 		alert(ret.message);
			// 	}
			// },'json');
		}
	});
	
	$("#addRule").click(function(){
		let caseId = sessionStorage.getItem("caseId");
		var siblingsLength = $(this).siblings().length;
		var appendIndex = siblingsLength;
		var toAddHtml = '<div class="line-interedit line-com">'
		+'<input type="hidden" name="testRules['+appendIndex+'].caseId" value="'+caseId+'" style="width:30%;margin-left:5px" type="text">'
									+'<input placeholder="jsonpath表达式" name="testRules['+appendIndex+'].expression" value="" style="width:40%;margin-left:5px" type="text">'
									+'<select name="testRules['+appendIndex+'].operator" id="" style="width:10%;margin-left:10px">'
									+'<option value="=">=</option>'
									+'<option value="contains">contains</option>'
									+'</select>'
									+'<input placeholder="期望值" name="testRules['+appendIndex+'].expected" value="" style="width:30%;margin-left:5px" type="text">'
									+'<i class="icon icon-delete f-l"></i>'
									+'</div>';
		$(this).parent().append(toAddHtml);
	});
	
	//删除当前行参数
	$('.linebox-interedit').on('click','.line-interedit .icon-delete',function(){
		var siblings = $(this).parent().siblings("div");
		var appendIndex = siblings.length;
		$(this).parent().remove();
		if(appendIndex==0){
			return;
		}
		i=0;
		siblings.each(function(){
			var forms = $(this).children().not("i");//jQuery对象 点方法
			i++;
			$.each(forms,function(index,val){
				var str = val.name;//DOM 原生js对象 点属性
				//截取[]中的数据
				var str2 = str.substring(0,str.indexOf('[')+1).concat(i-1).concat(str.substring(str.indexOf(']')));
				val.name = str2;
			});
		})
	});
	
	$("[name='relatedApi']").click(function(){
		var baseUrl = lemon.config.global.rootUrl;
		//获取菜单的接口
		var menuFindurl = baseUrl+"/index/findApiSelectedMenu";
		var apiId = $("[name='apiId']").val();
		var projectId = $("[name='projectId']").val();
		var data = {"apiId":apiId};
		var turn2Page = baseUrl+"/index/toIndex?projectId="+projectId+"&tab=1";
		////跳转到对应页面，并选中对应菜单
		selectMenuAndTurn2Page(menuFindurl,data,turn2Page,"测试集合");
	});
});