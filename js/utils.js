;
(function(win, undefined) {
    var utils = {
         set_cookie:function(name, value) {
            document.cookie = name +'='+ value +'; Path=/;';
         },
         // cookie立即失效
         delete_cookie:function(name) {
            document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
             if(urlbox.path){
                 document.cookie = name +'=; Path='+ urlbox.path +'; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
             }
             if(urlbox.path2){
                 document.cookie = name +'=; Path='+ urlbox.path2 +'; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
             }
         },
        //价格格式化
        formatMoney: function(number, places, symbol, thousand, decimal) {
            number = number || 0;
            places = !isNaN(places = Math.abs(places)) ? places : 2;
            // symbol = symbol !== undefined ? symbol : "$";
            symbol = symbol !== undefined ? symbol : "";
            thousand = thousand || ",";
            decimal = decimal || ".";
            var negative = number < 0 ? "-" : "",
                i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
                j = (j = i.length) > 3 ? j % 3 : 0;
            return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
        },
        // 判断是否为空对象
        isEmptyObject: function (obj) {
            var name ;
            for(name in obj) {
                return false;
            }
            return true;
        },
        //获取url参数
        getQueryString: function(name) {
            if (win.location.href.indexOf("?") != win.location.href.lastIndexOf("?"))
                var urls = win.location.href.replace(/\?/g, "&").replace(/^.*?&/, "")
            else
                var urls = win.location.href.replace(/^.*\?/, "");
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = ("?" + urls).substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        getUrlKeyVal: function(name) {
            var regex = new RegExp("[?&]" + encodeURIComponent(name) + "\\=([^&#]+)");
            var value = (location.search.match(regex) || ["", ""])[1];
            return decodeURIComponent(value);
        },
        //货币格式化
        currency: function(value, showSign, showUnit) {
            if (value != null) {
                var price = (Math.round(value * Math.pow(10, 2)) / Math.pow(10, 2)).toFixed(2);
                if (showSign) {
                    price = '￥' + price;
                }
                if (showUnit) {
                    price += '元';
                }
                return price;
            }
        },
        getScrollTop: function() {
            var scrollTop = 0;
            if (document.documentElement && document.documentElement.scrollTop) {
                scrollTop = document.documentElement.scrollTop;
            } else if (document.body) {
                scrollTop = document.body.scrollTop;
            }
            return scrollTop;
        },
        //封装ajax
        getJsonpData: function(typeMethod, url, data, callfunc, errfunc) {
            $.ajax({
                type: typeMethod ? typeMethod : "GET",
                url: url,
                data: data,
                dataType: "jsonp",
                jsonp: "callback",
                success: function(data) {
                    callfunc(data);
                    $('.load').hide();
                },
                error: function(data) {
                    if (errfunc)
                        errfunc(data);
                    else
                        callfunc(data);
                }
            });
        },
        ajaxData: function(opts, fnSuccess, fnError) {
            var that = this;
            $.ajax({
                type: opts.type,
                url: opts.url,
                cache: true,
                dataType: "jsonp",
                success: function(data) {
                    fnSuccess.call(that, data);
                },
                error: function(data) {
                    fnError.call(that, data);
                }
            });

        },
        //获取时间戳
        datetime_to_unix: function(datetime) {
            var tmp_datetime = datetime.replace(/:/g, '-');
            tmp_datetime = tmp_datetime.replace(/ /g, '-');
            var arr = tmp_datetime.split("-");
            var now = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
            return parseInt(now.getTime());
        },
        //重置rem值
        resizeRem: function() {
            window.remFontSize = document.documentElement.clientWidth / 10;
            document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + "px";
            $("body").append('<p id="remset" style="width:10rem;"></p>');
            var realrem = $("#remset").width() / 10;
            var rem = document.documentElement.clientWidth / 10;
            if (realrem != rem) {
                $("html").css('font-size', (rem * rem) / realrem + "px");
            }
            $("#remset").remove();
        },

        pm: function(text, fn) {
            $('body').append('<div id="pm_wrap"><div id="pm"><p>' + text + '</p></div></div>');
            var pmw = $("#pm_wrap");
            setTimeout(function() {
                pmw.remove();
                fn && fn();
            }, 1500)
        },
        getIMEI: function() {
            try {
                return toApp.getIMEI();
            } catch (e) {
                //出错
                return '';
            }
        },
        //获取B端userid
        getBUserId: function() {
            try {
                return toApp.getBUserId();
            } catch (e) {
                //出错
                return '';
            }
        },
        getCUserId: function() {
            try {
                return toApp.getPurchaseId();
            } catch (e) {
                //出错
                return '';
            }
        },
        //价格分转元
        formatPrice: function(realCost) {
            var _self = this;
            var lastCost = 0;
            if (realCost) {
                lastCost = parseInt(realCost) / 100;
            }
            return lastCost;
        },
        isShowLimited: function(val) {
            return val.substring(0, 2);
        },
        //http转https
        relativeHttp: function(obj) {
            var strObj = JSON.stringify(obj);
            var removeHttp = strObj.replace(/http:/g, "https:");
            return JSON.parse(removeHttp);
        },
        //判断是否为ios	
        isIOS: function() {
            var ua = navigator.userAgent.toLowerCase();
            if (/iphone|ipad|ipod/.test(ua)) return true;
        },
        //计时器
        countDown: function(now, callback) {
            var timer = null;
            timer = setInterval(function() {
                now += 1000;
                callback && callback();
            })
        },
        reLoadTitle: function() {

            var $body = $('body');
            var $iframe = $('<iframe src="./images/defalutPic.png" width="0" height="0"></iframe>');
            $iframe.on('load', function() {
                setTimeout(function() {
                    $iframe.off('load').remove();
                }, 0);
            }).appendTo($body);
        },
        //兼容PlaceHolder
        supportPlaceHolder: function() {
            var isSupportPlaceHolder = 'placeholder' in document.createElement('input');
            if (!isSupportPlaceHolder()) {
                $('[placeholder]').focus(function() {
                    var input = $(this);
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                        input.removeClass('placeholder');
                    }
                }).blur(function() {
                    var input = $(this);
                    if (input.val() == '' || input.val() == input.attr('placeholder')) {
                        input.addClass('placeholder');
                        input.val(input.attr('placeholder'));
                    }
                }).blur();
            };
        },
        getHost: function() {
            try {
                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                    return toApp.getHost().substr(6);
                } else if (/(Android)/i.test(navigator.userAgent)) {
                    return toApp.getHost().substr(5);
                }

            } catch (e) {
                return 'https://bpi.qichechaoren.com';
            }
        },
        toast: function(txt) {
            var ct = $("body"),
                timer = null;

            if (!$('.toast_box').length) {
                ct.append('<div class="toast_box"></div>');
            }
            var toast = $(".toast_box");
            toast.text(txt);
            toast.show();
            setTimeout(function() {
                toast.css("opacity", "1");
            }, 1);
            var wh = window.innerHeight,
                ww = window.document.body.clientWidth,
                max = Math.max(wh, document.body.clientHeight),
                toast_h = toast.height(),
                toast_w = toast.width(),
                top = (wh - toast_h) / 2,
                left = (ww - toast_w) / 2;

            toast.css({ "top": top + "px" });
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function() {
                toast.css("opacity", "0");
                setTimeout(function() {
                    toast.hide();
                }, 200);
            }, 2000);
        },
        goTop: function() {
            $(window).scroll(function() {
                if ($(window).scrollTop() > 200) {
                    $(".toTop").fadeIn(500);
                    $("body").on("click", ".toTop", function() {
                        $(window).scrollTo({
                            'toT': 0,
                            durTime: 1000
                        });
                    });
                } else {
                    $(".toTop").fadeOut(500);
                }
            });
        },
        trim: function(str) {
            return str.replace(/\s/g, "");
        },
        isEmptyObj: function(obj) { //判断是否为空对象
            if (obj) {
                var flag = true;
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        flag = false;
                        break;
                    }
                }
                return flag;
            } else {
                return true;
            }
        },
        store: function(itemName, obj) {
            if (obj) {
                try {
                    if (typeof obj == 'object') {
                        obj = JSON.stringify(obj);
                    }
                } catch (e) {
                    obj = obj;
                }
                try {
                    localStorage.setItem(itemName, obj);
                } catch (e) {
                    console.info('error Oops');
                }
            } else {
                var data = localStorage.getItem(itemName);
                data = utils.escapeQuery(data);
                if (typeof data != "string") {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        data = data;
                    }
                }
                return data;
            }
        },
        escapeQuery: function(str) { //参数处理
            if (!str) {
                //return "";
            }
            var _isObj = false;
            if (typeof str != "string") {
                try {
                    str = JSON.stringify(str);
                    _isObj = true;
                } catch (e) {}
            }
            var obj = {
                '<': '&lt;',
                '>': '&gt;'
            };
            str = str.replace(/(\<|\>)/ig, function(s, t) {
                return obj[t];
            });
            if (_isObj) {
                try {
                    str = JSON.parse(str);
                } catch (e) {}
            }
            return str;
        },
        getItem: function(itemName) {
            var _result = utils.store(itemName);
            if (typeof _result == "string") {
                _result = utils.escapeQuery(_result);
            } else {
                if (!utils.isEmptyObj(_result)) {
                    for (var prop in _result) {
                        if (_result.hasOwnProperty(prop)) {
                            _result[prop] = utils.escapeQuery(_result[prop]);
                        }
                    }
                }
            }
            return _result;
        },
        setItem: function(itemName, obj) {
            utils.store(itemName, obj);
            return this;
        },
        clearItem: function(itemName) {
            if (typeof itemName != 'undefined') {
                if (typeof itemName == 'string') {
                    localStorage.removeItem(itemName);
                }
                if (itemName.constructor === Array) {
                    for (var i = 0, len = itemName.length; i < len; i++) {
                        localStorage.removeItem(itemName[i]);
                    }
                }
            }
            return this;
        },
        getCookie: function(name) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr != null) return unescape(arr[2]); return null;
        },
        getCookie2:function(name) {
            if (name != null) {
                var value = new RegExp("(?:^|; )" + encodeURIComponent(String(name)) + "=([^;]*)").exec(document.cookie);
                return value ? decodeURIComponent(value[1]) : null;
            }
        },
        // 添加Cookie
        addCookie: function(name, value, options) {
            if (arguments.length > 1 && name != null) {
                if (options == null) {
                    options = {};
                }
                if (value == null) {
                    options.expires = -1;
                }
                if (typeof options.expires == "number") {
                    var time = options.expires;
                    var expires = options.expires = new Date();
                    expires.setTime(expires.getTime() + time * 1000);
                }
                if (options.path == null) {
                    options.path = "/";
                }
                if (options.domain == null) {
                    options.domain = ".qccr.com";
                }
                document.cookie = encodeURIComponent(String(name)) + "=" + encodeURIComponent(String(value)) + (options.expires != null ? "; expires=" + options.expires.toUTCString() : "") + ("; path=/") + ("; domain=" + options.domain) + (options.secure != null ? "; secure" : "");
            }
        },
        delCookieFn: function(name,domain) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = utils.getCookie(name);
            if (cval != null) {
                var domain = domain?domain:urlbox.domain;
                    //document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
                document.cookie = name + "=" + 0 + "; expires=" + exp.toUTCString() + ("; path=/") + ("; domain=" + domain);
            }
        },
        delCookie: function(name,domain) {
            if (typeof name != 'undefined') {
                if (typeof name == 'string') {
                    utils.delCookieFn(name,domain);
                }
                if (name.constructor === Array) {
                    for (var i = 0, len = name.length; i < len; i++) {
                        utils.delCookieFn(name[i],domain);
                    }
                }
            }
        },
        removeCookie: function (name, options) {
            //name ='SSHOP_'+name;
            utils.addCookie(name, null, options);
        }
    }

    if (typeof module != 'undefined' && module.exports) {
        module.exports = utils;
    } else if (typeof define == 'function' && define.amd) {
        define(function() {
            return utils;
        });
    } else {
        window.utils = utils;
    }
})(window);
//滚动
$.fn.scrollTo = function(options) {
    var defaults = {
        toT: 0,
        durTime: 300,
        delay: 30,
        callback: null
    };
    var opts = $.extend(defaults, options),
        timer = null,
        _this = this,
        curTop = _this.scrollTop(),
        subTop = opts.toT - curTop,
        index = 0,
        dur = Math.round(opts.durTime / opts.delay),
        smoothScroll = function(t) {
            index++;
            var per = Math.round(subTop / dur);
            if (index >= dur) {
                _this.scrollTop(t);
                window.clearInterval(timer);
                if (opts.callback && typeof opts.callback == 'function') {
                    opts.callback();
                }
                return;
            } else {
                _this.scrollTop(curTop + index * per);
            }
        };
    timer = window.setInterval(function() {
        smoothScroll(opts.toT);
    }, opts.delay);
    return _this;
};

// 懒加载图片
$.fn.picLazyLoad = function(settings) {
        var $this = $(this),
            _winScrollTop = 0,
            _winHeight = $(window).height();

        settings = $.extend({
            threshold: 0, // 提前高度加载
            placeholder: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
        }, settings || {});
        // 执行懒加载图片
        lazyLoadPic();

        // 滚动触发换图

        $(window).on('scroll', function() {
            _winScrollTop = $(window).scrollTop();
            lazyLoadPic();
        });


        function lazyLoadPic() {
            $this.each(function() {
                var $self = $(this);
                // 如果是img
                if ($self.is('img')) {
                    if ($self.attr('data-original')) {
                        var _offsetTop = $self.offset().top;

                        if ((_offsetTop - settings.threshold) <= (_winHeight + _winScrollTop)) {
                            $self.attr('src', $self.attr('data-original'));
                            $self.removeAttr('data-original');
                        }
                    }
                    // 如果是背景图
                } else {
                    if ($self.attr('data-original')) {
                        // 默认占位图片
                        if ($self.css('background-image') == 'none') {
                            $self.css('background-image', 'url(' + settings.placeholder + ')');
                        }
                        var _offsetTop = $self.offset().top;
                        if ((_offsetTop - settings.threshold) <= (_winHeight + _winScrollTop)) {
                            $self.css('background-image', 'url(' + $self.attr('data-original') + ')');
                            $self.removeAttr('data-original');
                        }
                    }
                }
            });
        }
    }
    //表单验证
var ruleObj = {
    isEmpty: function(value, errorMsg) {
        if (value === '') {
            return errorMsg;
        }
    },
    minLength: function(value, length, errorMsg) {
        if (value && value.length < length) {
            return errorMsg;
        }
    },
    isMobile: function(value, errorMsg) {
        if (value && value.length) {
            if (!/^1[3|5|7|8][0-9]{9}$/.test(value)) {
                return errorMsg;
            }
        } else {
            return;
        }

    },
    isUrl: function(value, errorMsg) {
        //console.log($('#titlePhotoPath').attr('src'))
        if (!$('#titlePhotoPath').hasClass('active')) {

            return errorMsg;
        }
    },
    idCardValidate: function(idCard, errorMsg) { /*身份证号验证*/
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (idCard && idCard.length) {
            if (reg.test(idCard) === false) {

                return errorMsg;
            }
        } else {
            return;
        }
    }
};
/*验证*/
var Validator = function() {
    this.cache = [];
}

Validator.prototype.add = function(dom, rules) {
    var that = this;
    for (var i = 0, rule; rule = rules[i++];) {
        (function(rule) {
            var strategyAry = rule.strategy.split(":");
            var errorMsg = rule.errorMsg;
            that.cache.push(function() {
                var strategy = strategyAry.shift();
                strategyAry.unshift(dom.val());
                strategyAry.push(errorMsg);
                return ruleObj[strategy].apply(dom, strategyAry);
            })
        })(rule)
    }
};

Validator.prototype.start = function() {
    for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
        var errorMsg = validatorFunc();
        if (errorMsg) {
            return errorMsg;
        }
    }
}
var uploadImgObj = {
    imageObj: undefined,
    uploadImage: function() {
        var me = this;
        if (window.toApp && window.toApp.selectPhoto) {
            $('.pic-box-item').each(function(index, el) {
                var $this = $(this);
                $this.attr('data-key', index);
                $(this).on("click", function() {

                    me.imageObj = $(this);
                    var key = $(this).attr('data-upload');
                    if ($('.upload-img-' + key).hasClass('active')) {
                        return;
                    } else {
                        toApp.selectPhoto(function(imageData) {
                            if (imageData != "") {
                                imageData = imageData.substr(5);
                                me.imageObj.closest('.pic-box-item').addClass('upload');
                                me.imageObj.find('.upload-img').attr('src', imageData).addClass('active').closest('.pic-box-item').removeClass('upload');
                                $('.upload-img-' + key).addClass('show').removeClass('hide').show();
                                $('.upload-img-' + key).siblings('.close-btn').show();

                            } else {
                                me.imageObj.closest('.pic-box-item').addClass('upload');
                                utils.pm('上传失败');
                            }

                        });

                    }

                    $('.close-btn').on('click', function(event) {
                        var key = $(this).attr('data-upload');
                        event.stopPropagation();
                        $('.upload-img-' + key).removeClass('active').attr('src', '')

                        $('.upload-img-' + key).addClass('hide').removeClass('show').hide();
                        $('.upload-img-' + key).siblings('.close-btn').hide();
                    });


                });

            })

        }
    }
};
function wAlert(text, time) {
    $(".alertm").remove();
    $("body").append('<div class="alertm">' + text + '</div>');
    if (time) {
        setTimeout(function() {
            $(".alertm").remove();
        }, time)
    } else {
        setTimeout(function() {
            $(".alertm").remove();
        }, 1500)
    }
}

function yAlert(text, time) {
    $(".alertm").remove();
    $("body").append('<div class="alertm yalertm">' + text + '</div>');
    if (time) {
        setTimeout(function() {
            $(".alertm").remove();
        }, time)
    } else {
        setTimeout(function() {
            $(".alertm").remove();
        }, 1500)
    }
}

function gAlert(text, time) {
    $(".alertm").remove();
    $("body").append('<div class="alertm galertm">' + text + '</div>');
    if (time) {
        setTimeout(function() {
            $(".alertm").remove();
        }, time)
    } else {
        setTimeout(function() {
            $(".alertm").remove();
        }, 1500)
    }

}
//登出
function logout() {
    var sessionId = $.cookie("sessionId");
    $RM.request({
        api: urlbox.ajaxUrl + "/superapi/bmerchantprod/logout",
        dataType: "jsonp",
        params: {
            sessionId: sessionId
        },
        result: function(e) {
            if (e.code == 0) {
                // $.cookie("sessionId","", urlbox.domain);
                // $.cookie("storeId","",urlbox.domain);
                // $.cookie("userId","",urlbox.domain);
                // $.cookie("username","",urlbox.domain);
                // $.cookie("shopId","",urlbox.domain);
                // $.cookie("storeName","",urlbox.domain);
                // $.cookie("u-session-id","",urlbox.domain);

                utils.delete_cookie("sessionId");
                utils.delete_cookie("storeId");
                utils.delete_cookie("userId");
                utils.delete_cookie("username");
                utils.delete_cookie("shopId");
                utils.delete_cookie("storeName");
                utils.delete_cookie("u-session-id");

                top.location.href = urlbox.urlhref + "login.html";
            }

        },
        fail: function(e) {
            console.log("页面callback fail:" + JSON.stringify(e));
            if (e.code == -9580108) {
                top.location.href = "login.html";
            }
        }
    });
}

//登录
function toLogin() {
    window.location.href = urlbox.toLoginURL;
}
//分享html
function sharehtml() {
    var sharehtml = '    <div id="copydia" class="sui-modal hide fade">' +
        '       <div class="modal-dialog">' +
        '        <div class="modal-content">' +
        '         <button type="button" class="sui-close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
        '         <div class="modal-body ">' +
        '          <h4></h4>' +
        '           <p><span id="tip">直接复制信息通过手机“微信”“QQ”“短信”等发送给客户</span></p>' +
        '          <div class="shareText">' +
        '           <p id="name">xiaoming</p>' +
        '           <p id="price">￥<span>xiaoming</span></p>' +
        '          <button type="button" class="sui-btn btn-large" data-ok="modal" id="okcopy" data-clipboard-text="1" tip="复制成功">复制商品信息</button>' +
        '           <div id="erwei"></div><p class="text">手机扫码分享</p> '+
        '          </div>' +
        '         </div>' +
        '        </div>' +
        '       </div>' +
        '    </div>';

    $("body").append(sharehtml);
}
/*复制插件调用*/
function ClipC() {
    var btn = document.getElementById('okcopy');
    var clipboard = new Clipboard(btn);
    clipboard.on('success', function(e) {
        var tip = $(e.trigger).attr("tip");
        wAlert(tip);
    });
    clipboard.on('error', function(e) {
        console.log(e);
    });
}
/**
 * 分享用一个弹框
 * **/
var shareall = function(title, name, price, url, page) {
    $("#erwei").html("");
    $('#erwei').qcode({
        text : url,
        type : 'cn',
        width : 500,
        height : 500
    });
    $("#copydia .modal-body h4").html(title);
    $("#copydia #name").html(name);
    if (price == '') {
        $("#copydia #price").hide();
    } else {
        $("#copydia #price").show();
        $("#copydia #price span").html(price.toFixed(2));
    }
    if (page == "店铺") {
        $("#okcopy").html("复制店铺信息");
    } else if (page == "订单") {
        $("#okcopy").html("复制订单信息");
        $("#copydia #price span").html((price / 100).toFixed(2));
    } else {
        $("#okcopy").html("复制商品信息");
    }
    $("#copydia #okcopy").attr("tip", page + "信息已复制到您的剪贴板！");
    $("#copydia #okcopy").attr("data-clipboard-text", url);
}
//左边栏
var leftManu = {
    template: '\
    <div class="nav">\
		<div class="nav_top">\
			<div class="web_logo">\
				<a class="icLogo"></a>\
			</div>\
		</div>\
		<div class="nav_bottom">\
			<ul class="nav_left">\
				<li class="sub1" v-for=" (it,index)it in list" :class="{\'cur\' : index == cur && !childcCur  }">\
					<a :href="it.url" :target="it.target" :class="it.class"><i></i>{{it.name}}<b v-if="it.chailList" :class="[cur==index ? \'el-icon-caret-top\':\'el-icon-caret-bottom\']"  style="margin-left: 5px;"></b></a>\
					<ul v-if="it.chailList" v-show="index == cur" :index="index" :cur="cur">\
						<li v-for="(item,ind) in it.chailList"><a :href="item.url" :target="item.target" :class="{\'childcur\' : (ind+1) == childcCur}"  :childCur="childcCur">{{item.name}}<span class="chartNum" v-show="chart > 0" v-if="item.name == \'购物车\'">{{chart}}</span></a></li>\
					</ul>\
				</li>\
			</ul>\
	   </div>\
	</div>',
    props: {
        list: {
            type: Array,
            default: function() {
                return [
                    { url:urlbox.urlIndex, name: "首页", class: "left_sublist0", target: "_self" },
                    { url: urlbox.urlhref + "good/goodsManage.html", name: "商品管理", class: "left_sublist1", target: "_self" 
                        
                    },
                    { url: urlbox.urlhref + "stock/goodsStock.html", name: "库存管理", class: "left_sublist6", target: "_self" ,
                        chailList:[
                           
                            {url: urlbox.urlhref + "stock/goodsStock.html", name: "商品库存", class: "mei", target: "_self"},
                            {url: urlbox.urlhref + "stock/check.html", name: "库存盘点", class: "mei", target: "_self"},
                            {url: urlbox.urlhref + "stock/inStock.html", name: "商品入库", class: "mei", target: "_self"},
                            {url: urlbox.urlhref + "stock/outStock.html", name: "商品出库", class: "mei", target: "_self"},
                            {url: urlbox.urlhref + "stock/stockManage.html", name: "仓库管理", class: "mei", target: "_self"}
                        ]
                    },
                    { url: urlbox.urlhref + "order/orderManager.html", name: "订单管理", class: "left_sublist2", target: "_self",
                        chailList:[

                            {url: urlbox.urlhref + "order/orderManager.html", name: "订单列表", class: "mei", target: "_self"},
                            {url: urlbox.urlhref + "order/afterService.html", name: "售后列表", class: "mei", target: "_self"},
                            {url: urlbox.urlhref + "order/orderManagerH.html", name: "历史订单", class: "mei", target: "_self"},

                        ]
                    },
                    { url: urlbox.urlhref + "client/clientManage.html", name: "客户管理", class: "left_sublist3", target: "_self",
                        chailList:[
                            {url: urlbox.urlhref + "client/clientManage.html", name: "客户列表", class: "mei", target: "_self"},
                            {url: urlbox.urlhref + "client/clientGroup.html", name: "客户分组", class: "mei", target: "_self"}
                        ]
                    },
                    { url: urlbox.urlhref + "purchase/productList.html", name: "我要采购", class: "left_sublist4", target: "_self" ,
                        chailList:[
                            {url: urlbox.urlhref + "purchase/productList.html", name: "商品列表", class: "mei", target: "_self"},
                            {url: urlbox.urlhref + "purchase/shoppingCart.html", name: "购物车", class: "mei", target: "_self"},
                            {url: urlbox.urlhref + "purchase/purchaseOrders.html", name: "采购订单", class: "mei", target: "_self"},
                            {url: urlbox.urlhref + "purchase/afterSaleOrders.html", name: "售后订单", class: "mei", target: "_self"}
                        ]
                    },
                    //{url:urlbox.urlhref+"award/award.html",name:"奖励政策",class:"left_sublist5",target:"_self"},
                    { url: urlbox.urlhref + "myProperty/index.html", name: "我的资产", class: "left_sublist4", target: "_self" ,
                        chailList:[
                        {url: urlbox.urlhref + "myProperty/index.html", name: "我的资金", class: "mei", target: "_self"},
                            {url: urlbox.urlhref + "myProperty/dealList.html", name: "交易记录", class: "mei", target: "_self"},
                            {url: urlbox.urlhref + "myProperty/incomeList.html", name: "收支明细", class: "mei", target: "_self"},
                            {url: urlbox.urlhref + "myProperty/cardManager.html", name: "银行卡管理", class: "mei", target: "_self"},
                            {url: urlbox.urlhref + "myProperty/clientCash.html", name: "客户欠款", class: "mei", target: "_self"},
                            {url: urlbox.urlhref + "myProperty/cashType.html", name: "收款方式设置", class: "mei", target: "_self"}
                        ]
                    }
                ]
            }
        },
        cur:{
            type: Number,
            default: 0
        },
        childcCur: {
            type: Number,
            default: 0
        },
        chart:{
            type: Number,
            default: 0
        }

    }
}

//头部
var topLine = {
    template:'<div class="box_top">'+
    '					<a data-toggle="modal" data-target="#copydia"  data-backdrop="static" @click="increment" class="shareIcon"></a>'+
    '					<div class="top_right">'+
    '						<div class="user_box">'+
    '							<ul>'+
    '								<li class="use_name" v-if="username">'+
    '									<span><b>你好，</b>{{username}}</span>'+
    '									<i>|</i>'+
    '								</li>								'+
    '								<li class="use_name" v-if="username">'+
    '									<a onclick="logout()">退出</a>'+
    '								</li>'+
    '								<li class="use_name" v-else="username!=\'\'">'+
// '									<a href="/Business/view/login.html">登录</a>'+
                                        '<a onclick="toLogin()">登录</a>'+
    '								</li>'+
    '							</ul>'+
    '						</div>'+
    '					</div>'+
    '				</div>',
    props:{
        username:[Number,String],
        storeName:[Number,String],
        storeId:[Number,String],
        shareUrl:[String]

    },
    methods: {
        increment: function () {
            shareall('店铺分享',this.storeName,'',this.shareUrl+'type=1&storeId='+this.storeId,'店铺');
            return false;
        }
    },
}
//footer
var footLine = {
    template:'<div class="footer">COPYRIGHT © 2015-2016 特维轮网络科技(杭州)有限公司版权所有 浙ICP备15012731号-7 </div>',
}
/*回车登录*/
var keyDown = function(callback) {  //回车提交事件
    $("body").keydown(function(e) {
        var e = e || event;
        var currentKey = e.keyCode || e.which || e.charCode;
        if (currentKey == 13) {
            callback();
        }
    });
};

//判断相同字符个数
function countChar(str, char) {
    var count = 0;
    for (var i = 0; i < str.length; i++) {
        if (str.charAt(i) == char) {
            count++;
        }
    }
    return count;
}
//移除cookie,如果接口
function recook(e) {
    if (e.code == -200) {
        top.location.href = urlbox.urlhref + "login.html";
    }
  if(!$.cookie("storeId")){
      top.location.href = urlbox.urlhref + "login.html";
  }

}
//只能输入价格保留两位小数
function num(obj){
    var e = (navigator.appname=="Netscape")?event.which:window.event.keyCode;
    if( (e != 37 || e == 39) && (e == 37 || e != 39) ){
        if(e != 67){
            if(e != 8){
                obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
                obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字
                obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
                obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
                obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
                if(obj.value>=10000000){
                    obj.value="";
                }
            }

        }

    }

}
function num0(obj){
    var reg=/^([1-9]\d*|[0]{1,1})$/; //含0正整数
    if(reg.test(obj.value)){
        obj.value =obj.value;
    }else{
        obj.value ="";
    }

}

function ChangeParam(name,value){
    var url=window.location.href ;
    var newUrl="";
    var reg = new RegExp("(^|)"+ name +"=([^&]*)(|$)");
    var tmp = name + "=" + value;
    if(url.match(reg) != null){
        newUrl= url.replace(eval(reg),tmp);
    }else{
        if(url.match("[\?]")){
            newUrl= url + "&" + tmp;
        }else{
            newUrl= url + "?" + tmp;
        }
    }
    location.href=newUrl;
}


function qcodetochar(str){
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
};
$.fn.qcode = function(options){
    if(options){
        var opt = {};
        if(typeof options == 'string'){
            opt.text = options;
        }else{
            if(options.text) opt.text = options.text;
            if(options.type && options.type == 'ch') opt.text = qcodetochar(opt.text);
            if(options.render && options.render == 'table') opt.render = options.render;
            if(options.width) opt.width = options.width;
            if(options.height) opt.height = options.height;
        }

        $(this).qrcode(opt);
    }
};

function tabSendUrl(data){
    /*    {
     ajaxUrl:ajaxUrl,
     params:params,
     result:result,
     fail:fail,
     tableId:tableId,
     isBtn: isBtn
     }*/
    var tableId=document.getElementById(data.tableId);
    var loading=document.getElementById("loading");
    var btnText ='';
    var isBtn = document.getElementById(data.isBtn);
    if(loading){
        loading.parentNode.removeChild(loading);
    }
    var loadingImg = urlbox.srchref + 'img/loading.gif';
    if(isBtn){
        btnText = isBtn.textContent;
        document.body.insertAdjacentHTML('afterBegin','<div id="unbindMask" style="position: fixed;top: 0;left: 0;width: 100%;height: 100%;overflow: hidden;z-index: 9999;opacity: 0;"></div>');
        isBtn.style="background: #EFF2F7;color: #4186F2; border: 1px solid #EFF2F7; ";
/*        var s = 0;
        setTime = setInterval(function(){
            s++;
            isBtn.innerHTML= '提交中('+ s +'s)';
        },1000);*/
        isBtn.innerHTML= '提交中...';
    }else{
        if(tableId){
            tableId.insertAdjacentHTML("afterend", "<div id='loading' style='text-align: center;background: #fff;'><img src='"+ loadingImg +"' style='width: 130px;'></div>");
        }
    }


    $RM.request({
        api: data.ajaxUrl,
        dataType: "jsonp",
        params: data.params,
        result: function(e) {
            var loading=document.getElementById("loading");
            var unbindMask = document.getElementById("unbindMask");
            if(loading){
                loading.style.display="none";
                loading.parentNode.removeChild(loading);
            }
            if(isBtn) {
                //clearInterval(setTime);
                isBtn.setAttribute("style","");
                if(unbindMask){
                    unbindMask.style.display="none";
                    unbindMask.parentNode.removeChild(unbindMask);
                }
                isBtn.innerHTML = btnText;
            }
            data.result(e);
        },
        fail: function(e) {
            var loading=document.getElementById("loading");
            var unbindMask = document.getElementById("unbindMask");
            if(loading){
                loading.style.display="none";
                loading.parentNode.removeChild(loading);
            }
            if(isBtn) {

                //clearInterval(setTime);
                isBtn.setAttribute("style","");
                if(unbindMask){
                    unbindMask.style.display="none";
                    unbindMask.parentNode.removeChild(unbindMask);
                }
                isBtn.innerHTML = btnText;
            }
            data.fail(e);

        }
    })
}

/**
 * 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
 *
 * @param num1加数1 | num2加数2
 */
function numAdd(num1, num2) {
    var baseNum, baseNum1, baseNum2;
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    return (num1 * baseNum + num2 * baseNum) / baseNum;
};
/**
 * 减法运算，避免数据相减小数点后产生多位数和计算精度损失。
 *
 * @param num1被减数  |  num2减数
 */
function numSub(num1, num2) {
    var baseNum, baseNum1, baseNum2;
    var precision;// 精度
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
    precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
    return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
};
/**
 * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
 *
 * @param num1被乘数 | num2乘数
 */
function numMulti(num1, num2) {
    var baseNum = 0;
    try {
        baseNum += num1.toString().split(".")[1].length;
    } catch (e) {
    }
    try {
        baseNum += num2.toString().split(".")[1].length;
    } catch (e) {
    }
    return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
};
/**
 * 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
 *
 * @param num1被除数 | num2除数
 */
function numDiv(num1, num2) {
    var baseNum1 = 0, baseNum2 = 0;
    var baseNum3, baseNum4;
    try {
        baseNum1 = num1.toString().split(".")[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split(".")[1].length;
    } catch (e) {
        baseNum2 = 0;
    }
    with (Math) {
        baseNum3 = Number(num1.toString().replace(".", ""));
        baseNum4 = Number(num2.toString().replace(".", ""));
        return (baseNum3 / baseNum4) * pow(10, baseNum2 - baseNum1);
    }
};