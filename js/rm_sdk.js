import $md5 from 'js-md5';
import $uuid from 'uuid';
import $conf from './config';

var w = window,
  d = document;

class $_RM_Main {
  constructor() {
    this._appkey = $conf.appkey //网关appkey
    this.secret = $conf.secret // 网关secret
    this.sessionId = "wx-" + $uuid.v4() // 会话ID wx+uuid
    this.version = '2.6.24' //版本
    this._getHtml = true
    //是否为B端或C端native判断
    this._isB = (typeof w.toApp == 'object' && w.toApp.nativeRequest)
    this._isC = (typeof w.webkit == 'object' && w.webkit.messageHandlers && w.webkit.messageHandlers.nativeRequest)
    this.isApp = (typeof w.toApp == 'object' && w.toApp.nativeRequest) && (typeof w.webkit == 'object' && w.webkit.messageHandlers && w.webkit.messageHandlers.nativeRequest)
    this._option = {} //$RM.request入参对象
    this._requestRepeatNum = 0 //请求重发计数
    this._rsTimestampNum = 0
    this._callbackName = "" //jsonp回调函数名
    this._callback = () => { } //成功回调函数,code = 0
    this._callbackFail = () => { } //失败回调函数,code != 0
    this._callbackRM = "" //风控请求回调函数,code为约定值
    this._responseText = {} //请求返回Text
    this._responseXML = {} //请求返回XML
    this.requestHeader = {} //设置的请求头，来自入参
    this._requestHeader = {} //SDK附加请求头
  }

  //格式化参数
  formatParams(data) {
    let arr = []
    for (let name in data) {
      arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]))
    }
    arr.push(("v=" + Math.random()).replace(".", ""))
    return arr.join("&")
  }

  //获取地址栏参数
  getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
    let r = w.location.search.substr(1).match(reg)
    if (r != null) return decodeURI(r[2])
    return null
  }

  //获取Cookie
  getCookie(c_name) {
    if (c_name != "") {
      if (d.cookie.length > 0) {
        var value = new RegExp("(?:^|; )" + escape(String(c_name)) + "=([^;]*)").exec(document.cookie);
        return value ? unescape(value[1]) : "";
      }
      if (localStorage[c_name]) {
        return localStorage[c_name];
      }
      return "";
    }
    return "";
  }

  autoStorageSet(name, value, expiredays) {
    localStorage[name] = value
    this.clearTimeout[name] && clearTimeout(this.clearTimeout[name]);
    expiredays = expiredays == 0 ? -1 : expiredays;
    if (expiredays) {
      this.clearTimeout[name] = setTimeout(() => {
        localStorage.removeItem(name)
      }, expiredays * 1000 * 60)
    }
  }

  //设置Cookie
  setCookie(c_name, value, expiredays) {
    let exdate = new Date()
    exdate.setTime(exdate.getTime() + expiredays * 60 * 1000)
    d.cookie = escape(c_name) + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ("; path=/");
    this.autoStorageSet(c_name, value, expiredays);
  }

  //设置请求头
  setRequestHeader(xhr, form) {
    for (let header in this.requestHeader) {
      !this._requestHeader[header] && xhr.setRequestHeader(header, this.requestHeader[header])
    }
    for (let _header in this._requestHeader) {
      xhr.setRequestHeader(_header, this._requestHeader[_header])
    }
    form && xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
  }

  //请求返回code处理
  setCode(json, xml) {
    if (typeof (json) == "string" && json.indexOf("{") > -1 && json.indexOf(":") > -1 && json.indexOf("}") > -1) json = eval("(" + json + ")");
    if (json.code == 0) {
      //业务请求正常返回
      this._responseText = json
      this._responseXML = xml
      //过滤返回数据中非业务数据
      this._responseText.ext && [delete this._responseText.ext];
      // this._responseText.traceId && [delete this._responseText.traceId];
      //如处于非风控组件回调状态下，则执行正常业务回调
      !this._callbackRM && this._callback(this._responseText, this._responseXML)
      //如存在风控组件回调状态，则执行风控组件回调
      this._callbackRM && this._callbackRM(this._responseText, this._responseXML)

    } else {
      //返回code ！= 0 时其他情况下执行fail回调
      this._responseText = json
      this._responseXML = xml
      this._responseText.ext && [delete this._responseText.ext];
      // this._responseText.traceId && [delete this._responseText.traceId];
      this._callbackFail && this._callbackFail(this._responseText, this._responseXML)
      console.warn(json.msg || "系统发生未知异常！")
    }
  }

  //ajax方法
  ajax(opt = {}) {
    let options = opt
    options.url = options._url || options.url
    options.type = (options.type || "GET").toUpperCase()
    options.dataType = options.dataType || "json"
    let params = this.formatParams(options.data)
    let xhr = {}

    //设置请求头
    options.requestHeader && [this.requestHeader = options.requestHeader]

    //创建 XMLHttpRequest
    if (w.XMLHttpRequest) {
      xhr = new XMLHttpRequest()
    } else {
      //创建 Microsoft.XMLHTTP
      xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }

    //接收监听
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        let status = xhr.status;
        if (status >= 200 && status < 300) {
          options.success && [this._callback = options.success]
          options.fail && [this._callbackFail = options.fail]
          this._responseText = xhr.responseText
          this._responseXML = xhr.responseXML
          this.setCode(xhr.responseText, xhr.responseXML)
        } else {
          options.fail && options.fail({
            msg: "error!",
            code: status
          })
        }
      }
    }

    //连接发送
    if (options.type == "GET") {
      xhr.open("GET", options.url + "?" + params, true)
      this.setRequestHeader(xhr)
      xhr.send(null)
    } else if (options.type == "POST") {
      xhr.open("POST", options.url, true)
      this.setRequestHeader(xhr, true)
      xhr.send(params)
    }
  }

  //jsonp方法
  jsonp(opt = {}) {
    let options = opt
    options.callback = options.callback || "callback"
    if (!options.url || !options.callback) {
      throw new Error("参数不合法")
    }
    //在页头创建 script
    let callbackName = this._callbackName
    let oHead = d.getElementsByTagName('head')[0]
    options.data[options.callback] = callbackName
    let params = this.formatParams(options.data)
    let oS = d.createElement('script')
    oHead.appendChild(oS)

    //创建 jsonp callback
    w[callbackName] = (json) => {
      oHead.removeChild(oS)
      clearTimeout(oS.timer)
      w[callbackName] = null
      options.success && [this._callback = options.success]
      options.fail && [this._callbackFail = options.fail]
      this._responseText = json
      this._responseXML = {}
      this.setCode(json, {})
    }

    //发送src协议请求
    oS.src = (options._url || options.url) + '?' + params
    //超时处理
    if (options.time) {
      oS.timer = setTimeout(() => {
        w[callbackName] = null
        oHead.removeChild(oS)
        options.fail && options.fail({
          msg: "jsonp 请求超时",
          code: -1
        })
      }, time)
    }
  }

  //request方法，对不同类型的请求进行统一管理
  request(opt = {}) {
    let {
      api,
      version,
      type,
      dataType,
      params,
      source,
      userAgent,
      result,
      fail,
      requestHeader
    } = opt
    let _params = {}
    let isJsonp = (dataType === "jsonp") ? true : false;
    !params && [params = {}];
    !params.__isRM && [this._option = opt];
    isJsonp && [this._callbackName = ('jsonp_' + Math.random()).replace(".", "")];
    params.mobilePhone && [this._mobilePhone = params.mobilePhone];
    (!params.authToken && params.type == "slider_validate") ? params.authToken = this.getCookie("$RM_session") : "";
    this._option = opt;

    //按字母排序
    _params.appkey = this._appkey;
    isJsonp && [_params.callback = this._callbackName];
    params && [_params.data = JSON.stringify(params)];
    _params["session-id"] = this.sessionId;
    source && [_params.source = source];
    this.timestamp = Date.parse(new Date());
    let timeDifference = localStorage._RmTimeDifference || 0;
    _params.timestamp = this.timestamp + parseInt(timeDifference);
    this.getCookie("u-session-id") && [_params["u-session-id"] = this.getCookie("u-session-id")];
    !isJsonp && [_params.userAgent = navigator.userAgent];
    isJsonp && userAgent && [_params["user-agent"] = navigator.userAgent];
    version && [_params.version = version];
    !version && [_params.version = "2.0"];

    //进行sign签名
    _params.sign = this.md5Encrypt(_params)

    delete _params.userAgent;

    //阻止验证回调函数覆盖业务回调函数，并将验证回调暂存到_callbackRM中
    if (params.__isRM && result) {
      this._callbackRM = result;
      result = '';
    } else {
      this._callbackRM = '';
    }

    //对不同环境，不同请求类型进行区分

    if (isJsonp) {
      this.jsonp({
        url: api,
        data: _params,
        success: result,
        fail
      })
    } else {
      this.ajax({
        url: api,
        type,
        data: _params,
        requestHeader,
        success: result,
        fail
      })
    }
  }

  //md5加签方法
  md5Encrypt(arg) {
    let param = '';
    for (let i in arg) {
      let key = i
      let val = arg[key]
      if (key == "userAgent") key = "user-agent"
      val && [param += key + val]
    }
    return $md5(this.secret + param).toUpperCase()
  }
}

//对外统一暴露$RM方法
class $_RM extends $_RM_Main {
  constructor() {
    super()
    this._appkey = '468291'
    this._requestRepeat = false
    this._mobilePhone = ''
    this._timeDifference = 0
    this.clearTimeout = {}
    this._debug = false
  }

  //对外统一暴露request方法
  request(opt) {
    //对每个request请求进行实例化
    let main = new $_RM_Main()
    main._appkey = this._appkey
    main.request(opt)
  }
}

export default new $_RM();


