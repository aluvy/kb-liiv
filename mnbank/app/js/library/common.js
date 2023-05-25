var kbstarCommon = {
    _DOMAIN : "https://mnbank.kbstar.com",
    _PDF_DOMAIN : "https://mnbank.kbstar.com",
    _MOBILEWEB_DOMAIN : "https://mnbank.kbstar.com",
    showSecureKeypadFlag : false,
    _BROWSER_TEST_PATTERN : /Orchestra Simulator/,
    asisPageInfo : "",
    globalEvalPage: ['D000860','D000857','D000885','D000884','D000885','D002348','D002349','D000874','D000875','D004513','D000957','D004259','D005085','D005049'], // 전역 eval을 실행할 화면ID 배열로 등록(모듈화되지 않은 js를 import 했을 경우)
    closeProgressFlag: true,    //통신후 프로그레스바를 닫을지 여부
    showProgressFlag: true  // Ajax 네트워크 프로그레스바를 보여줄지 여부
};
var FinCert;
var kbstar = {
    debugAlert : false, // alert 출력 여부
    debugConsole : false, // console log 출력 여부
    temp_string : '', // string 임시 저장 변수
    temp_form : $("<form></form>"), // form 임시 저장 변수
    include_obj_arr : [], // include 파일 임시 저장 변수
    commitReq : true, // interface 요청상태 flag
    callOnParamFlag : false, // 시뮬레이터에서 최초 로딩 확인을 위한 flag
    callScript : 'T',			// showErrDialog interface 에서 사용하는 변수(기본 : T. F 일 경우 콜백함수 호출하지 않고 에러창만 닫음.)
    callScript_kbSign : 'F',	// kbSignErrorCheck - showErrDialog interface 에서 사용하는 변수(기본 : T. F 일 경우 콜백함수 호출하지 않고 에러창만 닫음.)
    showError : true, // 에러창 출력여부.
    errorParam : {}, // 에러가 났을 경우 이동할 페이지로 보낼 parameter
    bParam : {}, // 이전페이지에서 넘어온 param 저장 변수
    backFlag : false, // 정방향 이동 false, 역방향(뒤로가기, 백버튼) 이동 true - Navite에서 docReadyFragment.html 에 셋팅해주는 값.
    isCancel : false, // 취소기능으로 이동한 경우 true  - Navite에서 docReadyFragment.html 에 셋팅해주는 값.
    callbackId : 0,
    callbacks : {},
    callbackStatus : {
        NO_RESULT : 0,
        OK : 1,
        CLASS_NOT_FOUND_EXCEPTION : 2,
        ILLEGAL_ACCESS_EXCEPTION : 3,
        INSTANTIATION_EXCEPTION : 4,
        MALFORMED_URL_EXCEPTION : 5,
        IO_EXCEPTION : 6,
        INVALID_ACTION : 7,
        JSON_EXCEPTION : 8,
        ERROR : 9
    },
    doubleSchemeReq : {
        serviceName : "",
        actionName : "",
        navigateUrl : "",
        params : {},
        actionTime : 0
    },
    doubleSchemeFlag : false,
    resources : {
        base : true
    },
    alert : function(arg){
        if(this.debugAlert){
            alert(arg);
        }
        if(this.debugConsole){
        }
    },
    hasResource : function(name) {
        return kbstar.resources[name];
    },
    addResource : function(name) {
        kbstar.resources[name] = true;
    },
    addConstructor : function(f){
        f.call();
    },
    createUUID : function() {
        return kbstar.UUIDcreatePart(4) + '-'
                + kbstar.UUIDcreatePart(2) + '-'
                + kbstar.UUIDcreatePart(2) + '-'
                + kbstar.UUIDcreatePart(2) + '-'
                + kbstar.UUIDcreatePart(6);
    },
    UUIDcreatePart : function(length) {
        var uuidpart = "";
        var i, uuidchar;
        for (i = 0; i < length; i++) {
            uuidchar = parseInt((Math.random() * 256), 0).toString(16);
            if (uuidchar.length === 1) {
                uuidchar = "0" + uuidchar;
            }
            uuidpart += uuidchar;
        }
        return uuidpart;
    },
    /**
     * page ID로 이동하는 기능을 제외한 native interface method
     * @param {successCallback}  성공 시 사용 될 callback function
     * @param {failCallback}     실패 시 사용 될 callback function
     * @param {serviceName} native에서 사용 될 service name
     * @param {actionName} native에서 사용 될 action name
     * @param {params} native에서 넘길 parameters
     * @param {doubleSchemePass} doubleSchemeFlag 사용여부
     **/
    exec : function(successCallback, failCallback, serviceName, actionName, params, doubleSchemePass) {
        try {   
        	var bDoubleSchemePassFlag = ((typeof doubleSchemePass) == "undefined") ? true : doubleSchemePass;
        	if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
        		// Native 데이터 서버 요청(UserID 제외)  
        		window.SPA_COMMON.getNativeTestData(serviceName, actionName, successCallback, failCallback); 
        	} else {
	            //var targetURL = window.COMMON.makeSendMethodRequestURL(successCallback, failCallback, serviceName, actionName, params);
	            var compareParams = (typeof params == "object") ? JSON.stringify(params) : params;
	            if(serviceName == kbstar.doubleSchemeReq.serviceName
	                    && actionName == kbstar.doubleSchemeReq.actionName
	                    && compareParams == kbstar.doubleSchemeReq.params
	                    && Number(new Date().getTime()) - Number(kbstar.doubleSchemeReq.actionTime) < 500
	                    && bDoubleSchemePassFlag){
	                kbstar.doubleSchemeFlag = true;
	            }
	            kbstar.doubleSchemeReq.serviceName = serviceName;
	            kbstar.doubleSchemeReq.actionName = actionName;
	            kbstar.doubleSchemeReq.params = (typeof params == "object") ? JSON.stringify(params) : params;
	            kbstar.doubleSchemeReq.actionTime = new Date().getTime();
	            var callbackId="";
	            if (successCallback || failCallback) {
	                callbackId = serviceName + kbstar.callbackId++;
	                kbstar.callbacks[callbackId] = {
	                    success : successCallback,
	                    fail : failCallback
	                };
	            }
	
	            if(!kbstar.doubleSchemeFlag){
		            if(params == undefined || params == null) {
		                params = "";
		            }
		            var data = {
		                "service" : serviceName,
		                "func": actionName,
		                "params": params
		            }
		            var naiveParam = {
		                cmd : "method",
		                calbackId : callbackId, 
		                body : {
		                    params: data
		                }
		            }
		            var jsonStr = JSON.stringify(naiveParam) || '';
		            var urlEncodeStr = encodeURIComponent(jsonStr);
		            var base64Str = window.btoa(urlEncodeStr);
		
		            if ("android" == window.COMMON.getUserAgent()) {		// android 호출
		                window.kbAppBridge.postMessage(base64Str);
		            } else if("ios" == window.COMMON.getUserAgent()) {	    // ios 호출
		                window.webkit.messageHandlers.kbAppBridge.postMessage(base64Str);
		            }
	            } else {
	            	kbstar.doubleSchemeFlag = false;
	            }
        	}
        } catch (e) {
            kbstar.alert("kbstar exec Error : " + e);
        }
    },
    returnCallback : function(callbackId, args) { // callbackSuccess
        if (this.callbacks[callbackId]) {
            var data = args.body;
            var isSuccess = args.head.isSuccess;
            
            // callback 호출 페이지가 현재 페이지인지 체크
            //if(this.callbacks[callbackId].pageId == window.SPA.currentPageId) {
            if(isSuccess.toLowerCase() == "true"){ 
                try {    
                    this.callbacks[callbackId].success(data);                
                } catch (e) {
                    kbstar.alert("Success True Error in kbstar callbackSuccess: " + callbackId + " = " + e);
                }
            } else {
                try {
                    this.callbacks[callbackId].fail(data);
                } catch (e) {
                    kbstar.alert("Success False Error in kbstar callbackSuccess: " + callbackId + " = " + e);
                }
            }
            //if (!args.keepCallback) {
            //    delete this.callbacks[callbackId];
            //}
            if (!args.head.keepCallback) {
                delete this.callbacks[callbackId];
                if(args.head.removeCallbacks) {
                    args.head.removeCallbacks.forEach(id=>{
                        delete this.callbacks[id];
                    })
                }
            }
        }
    },
    /**
     * page ID로 이동하는 native interface method
     * @param {page} 이동 할 page ID
     * @param {method} method (ex. POST, GET, PUT, DELETE ...)
     * @param {params}  native에게 넘길 parameters
     * @param {pageData}  native에게 넘길 pageData
     * @param {isAnimation}  native에게 넘길 animation 여부 : "0" - 끄기, "1" - 켜기
     **/
    submit : function(page, method, params, pageData, isAnimation){
        try {
            if(method == null){
                method="POST";
            }
            // 20210623 신재현: 불필요한 인코딩 제거
            if(pageData == undefined || pageData == null) { 
                pageData = {};
            }
            var jsonToUrl = window.COMMON.convertJSONtoURL(params);
            var data = {
                "action": page,
                "method": method,
                "params": jsonToUrl
            }
            var naiveParam = {
                cmd : "submit",
                animation : isAnimation,                        // submit 콜백 사용하지 않음
                body : {
                    params: data,
                    pageData : pageData
                }
            }
            var jsonStr = JSON.stringify(naiveParam) || '';
            var urlEncodeStr = encodeURIComponent(jsonStr);
            var base64Str = window.btoa(urlEncodeStr);

            if ("android" == window.COMMON.getUserAgent()) {		// android 호출
                window.kbAppBridge.postMessage(base64Str);
            } else if("ios" == window.COMMON.getUserAgent()) {	    // ios 호출
                window.webkit.messageHandlers.kbAppBridge.postMessage(base64Str);
            }
        } catch (e) {
            kbstar.alert("kbstar submit Error : " + e);
        }
    },
    /**
    * native interface 요청 완료 후 호출 function 
    **/
    receiveACK : function(){
        this.commitReq = true;
        window.HTTP.commitRequestQueue();
    },
    /**
     * kbstar.commonSuccess 공통 SuccessCallback navigate 네이티브 통신후
     * 네이티브에서 호출하는 콜백
     * 
     * @param {JSON}
     *            data
     * @returns {JSON} callback function with JSON data
     */
    commonSuccess : function(json) {
        var isIncludeFiles = false; //onGoBack 지연 호출을 위해 pageInclude가 있는지 확인하는 플래그
        try {
            var data = json.data;
            var msg = data.msg;
            var common = msg.common;
            
            if (common.status == "S") {
                if (msg.servicedata != undefined) {
                    // 서버에서 데이터가 내려오지 않은 경우 caq_successCallback 호출하지 않음.
                    if(msg.servicedata.showloading != undefined && msg.servicedata.showloading == "false"){
                        return;
                    }
                    // PAGE ID 설정
                    kbstarCommon.asisPageInfo = window.SPA.getCurrentPageId();

                    // 페이지 타이틀 설정
                    var pageTitle = msg.servicedata.pageTitle;
                    if (pageTitle != undefined) {
                        window.COMMON.setTitleName(pageTitle);
                    }
                    // 별찾기
                    /*
                    var s_point = msg.servicedata.S_STAR_FIND || "pagecodenone";
                    var s_pointHTML = '<div id="s_pointHTML" class="star_pileup"><div class="btn_wrap_star_pileup"><a href="" class="starclose" onclick="javascript:$("#s_pointHTML").hide();return false;">닫기</a><p class="btn_star_pileup"><a href="" onclick="window.COMMON.s_point_action();return false;"><span>★별 적립하기</span></a></p></div></div>';
                    if (s_point == msg.servicedata.page) {
                        if ($("#s_pointHTML")) {
                            $("#s_pointHTML").remove();
                        }
                        $('body').prepend(s_pointHTML);
                    }
                    // 별적립
                    window.AppInfoManager.requestLoginStatus(function(ret) {
                        if (ret == "02" || ret == "03") {
                            var s_search = msg.servicedata.S_STAR_FUND || "pagecodenone";
                            var s_searchHTML = '<div id="s_searchHTML" class="star_pileup_box_wrap"><div class="star_pileup_box"><p class="tit">★이 적립되는 메뉴입니다.  </p><p class="mt5">My★조회에서 상세내역을 확인하실 수 있습니다.</p><p class="mt5"><button id="btn_star_search" type="button" class="btn06" style="display:none;" onclick="window.COMMON.s_search_action();">My★조회</button></p></div><p class="item_desc"><span>*</span>디바이스 및 시스템 상황에 따라 반영 시간의 차이가 있을 수 있습니다. </p></div>';
                            if (s_search == msg.servicedata.page) {
                                if ($("#s_searchHTML")) {
                                    $("#s_searchHTML").remove();
                                }
                                $('body').append(s_searchHTML);
                                //kbstar.alert("msg.servicedata.loyaltyCode : button show : 001 - " + msg.servicedata.loyaltyCode);
                                if (msg.servicedata.loyaltyCode != "001") {
                                    $("#btn_star_search").show();
                                }
                            }
                        }
                    });
                    */
                    // 공지 팝업 처리
                    var popupHTML = msg.servicedata.popup;

                    if (popupHTML != undefined) {
                    	
                        var popnum = popupHTML.substring(popupHTML.indexOf("pid_") + 4, popupHTML.indexOf("pid_") + 4 + 7);
                        if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
                            var temp_cookie = document.cookie;
                            if (temp_cookie.indexOf("notOpen_" + popnum) == -1) {
                                window.COMMON.insertPopupHTML(popupHTML);
                            }
                        } else {
                            window.UserPreference.getValue(function(ret) {
                                var pop_expiredays = ret;
                                
                                var today = new Date();
                                var temp_yyyy  = today.getFullYear();
                                var temp_mm  = today.getMonth()+1;
                                if(temp_mm < 10) temp_mm = "0" + temp_mm;
                                
                                var temp_dd = today.getDate().toString();
                                if(temp_dd.length == 1) temp_dd = "0" + temp_dd;

                                var toyyyyMMdd = "" + temp_yyyy + temp_mm + temp_dd;
                                if (pop_expiredays <= toyyyyMMdd || pop_expiredays == undefined || pop_expiredays == "") {
                                	
                                    var temp_popupHTML = popupHTML.replace(/_tab_/gi, "\t\t");
                                    var temp_popupHTML2 = temp_popupHTML.replace(/_enter_/gi, "\r\n");
                                    popupHTML = temp_popupHTML2;
                                    window.COMMON.insertPopupHTML(popupHTML);
                                }
                            }, function() {
                            }, "notOpen_" + popnum);
                        }
                    }
                    
                    var flbnDataObj = msg.servicedata.strFlbnJsonData;
                    if(typeof flbnDataObj != "undefined") {
                    	
                    	window.SPA_COMMON.callbackWithSPA("flbn_successCallback", flbnDataObj);
                    }
                    
                }
                kbstar.include_obj_arr = [];
                kbstar.DataBinder.quicsDataBinding(json);

                if (kbstar.include_obj_arr.length == 0) {
                    window.SPA_COMMON.callbackWithSPA("caq_successCallback", json);
                } else {
                    isIncludeFiles = true;
                    var max_include_setInterval = 0;
                    var include_obj_arr_length = 0;
                    var include_setInterval = -1;
                    
                    include_setInterval = setInterval(
                        function() {
                            include_obj_arr_length = 0;
                            max_include_setInterval++;
                            // 60초동안 약관 파일을 가져 오지 못했을 경우
                            // 오류 메시지 출력후 디바이스에 따라 홈또는 이전화면으로 이동
                            if (max_include_setInterval == 60) {
                                clearInterval(include_setInterval);
                                kbstar.include_obj_arr = [];
                                //alert("약관파일을 가져오지 못했습니다.\n다시 시도해 주세요."); 
                                if (device.devicetype == "tablet") {
                                    window.configManager.moveToBankHome();
                                    return;
                                } else {
                                    window.navi.goBackWithCount();
                                    return;
                                }
                            }
                            // 60초동안 약관 파일을 가져 오지 못했을 경우
                            // 오류 메시지 출력후 디바이스에 따라 홈또는 이전화면으로 이동
                            for ( var i in kbstar.include_obj_arr) {
                                if (kbstar.include_obj_arr[i].text() != "") {
                                    include_obj_arr_length++;
                                    if (kbstar.include_obj_arr.length == include_obj_arr_length) {
                                        clearInterval(include_setInterval);
                                        kbstar.include_obj_arr = [];
                                        window.SPA_COMMON.callbackWithSPA("caq_successCallback", json);
                                        // caq_successCallback 호출 이후 onGoBack 호출
                                        if(kbstar.backFlag) {
                                            window.navi.onGoBack();
                                        }
                                    }
                                }
                            }
                        }, 1000);
                }
            }
        } catch (e) {
            kbstar.alert("CommonSuccess Error : " + e);
        }
        return isIncludeFiles
    },
    /**
     * kbstar.submit 공통 FailCallBack
     * 
     * @param {JSON}
     *            data
     */
    commonFail : function(json) {
        
        var data = json.data;
        try {
        	window.SPA_COMMON.callbackWithSPA("caq_navigateFailCallback", json);
                
            var errCode = "";;
            var errMSG = "";
            var errLinkTxt = "";
            var errLinkUrl = "";
            var errLinkImgUrl = "";
            var errUrl = "";
            var QPageStart = "";;
            var QPageStartTitle = "";;
            
            if(typeof data.msg.servicedata != 'undefined' ){
                errCode = data.msg.servicedata.ERR_CODE;
                errMSG = data.msg.servicedata.ERR_MSG;
                errUrl = data.msg.servicedata.ERR_URL;
                errLinkTxt = data.msg.servicedata.ERR_LNKTXT;
                errLinkUrl = data.msg.servicedata.ERR_LNKURL;
                errLinkImgUrl = data.msg.servicedata.ERR_LNKIMGURL;
                QPageStart = data.msg.servicedata.QPageStart;
                QPageStartTitle = data.msg.servicedata.QPageStartTitle;
            }
            
            if(kbstar.showError){
                if('@1000' == errUrl){
                    $(window).scrollTop(0);
                    if(typeof caqtel.failCallBack == 'function'){
                        try{
                            caqtel.failCallBack();
                        }catch(e){
                            kbstar.alert("[보안매체]Fail:: caqtel.failCallBack()");
                        }
                    }
                    kbstar.callScript = "F";
                }
                // nfilter 오류인 경우(서버에서 키 생성후 키를 write)
                if(errCode == "CBP2001" || errCode == "UCBP0006") {
                    kbstar.connect.request('/mquics?QAction=1033457&page=D002561', {}
                    , function(returnData) {
                        var publickey = returnData.data.msg.servicedata.publicKey;
                        window.AppInfoManager.setPublicKey(publickey);
                    }
                    , true);
                }
                var params = {
                    errCode : errCode,
                    errMSG : errMSG,
                    errUrl : errUrl,
                    errcustlinktxt : errLinkTxt,
                    errcustlinkurl : errLinkUrl,
                    errcustlinkimgurl : errLinkImgUrl,
                    QPageStart : QPageStart,
                    QPageStartTitle : QPageStartTitle,
                    callScript : kbstar.callScript
                };
                
                window.appManager.showErrDialog(function(returnData){
                    if((typeof returnData.ERR_URL == 'string') && returnData.ERR_URL.length > 0){
                        if(returnData.ERR_URL == 'onClose'){
                        	window.appManager.closePopupWebView('');

                        }else{
                            window.navi.navigateWithInit(returnData.ERR_URL, kbstar.errorParam, function(){});
                        }
                    }else{
                        window.LocalStorage.getItem("QPageStart", function(returnUrl){
                            if(returnUrl == 'main') {
                                window.configManager.moveToBankHome();
                            } else if(returnUrl == 'logout') {    
                                window.configManager.requestLogout("","0");
                            } else if(returnUrl != null && returnUrl != ""){
                                window.navi.navigateWithInit('/mquics?page='+returnUrl, kbstar.errorParam, function(){});
                            }
                        });
                    }
                }, params);
            }
        } catch (e) {
            kbstar.alert("CommonFail Error : " + e);
        }
    }
};

if (!kbstar.hasResource("COMMON")) {
    kbstar.addResource("COMMON");

    var COMMON = function() {
    }

    /**
     * Native webview 여부 
     */
    COMMON.prototype.isNative = function() {
        return navigator.userAgent.toLowerCase().indexOf('delfino-starbank') > -1
    }
        
    /**
     * Device의 OS 타입 조회
     * @returns {String} android ,IOS - ios else
     */
    COMMON.prototype.getUserAgent = function() { 
        var device = navigator.userAgent.toLowerCase();
        var return_value;
        if (/android/.test(device)) {
            return_value = "android";
        } else if (/ipad|ipod|iphone|mac/.test(device)) {
            return_value = "ios";
        } else {
            return_value = "else";
        }
        return return_value;
    };
    
    /**
     * 버전 문자열 비교 함수. 앞에 있는 버전 구분자(영문)는 무시하고 뒤에 오는 버전(Major.Minor.Build)만 비교함.
     * @param ver1 버전 문자열1
     * @param ver2 버전 문자열2
     * @return 0:같다, 1:ver1이 크다, -1:ver2가 크다
     * @예제
     * @ compareVersion('G5.0.0', 'G5.0.0') : 0
     * @ compareVersion('G5.0.1', 'G5.0.0') : 1
     * @ compareVersion('G5.0.0', 'G5.0.1') : -1
    */  
    COMMON.prototype.compareVersion = function(ver1, ver2) {
        var verArr1;
        var verArr2;
        // 버전 문자열을 '.'로 분리
        if (ver1.charAt(0) > '9') { // 첫 문자가 영문인 경우 영문자를 제외
            verArr1 = ver1.substring(1).split(".");
        } else {
            verArr1 = ver1.split(".");
        }
        if (ver2.charAt(0) > '9') { // 첫 문자가 영문인 경우 영문자를 제외
            verArr2 = ver2.substring(1).split(".");
        } else {
            verArr2 = ver2.split(".");
        }

        // 숫자로 변환 후에 비트 연산(32비트)
        var a1 = (verArr1[0] * 1) << 20;
        var b1 = (verArr1[1] * 1) << 10;
        var c1 = (verArr1[2] * 1) << 0;
        var a2 = (verArr2[0] * 1) << 20;
        var b2 = (verArr2[1] * 1) << 10;
        var c2 = (verArr2[2] * 1) << 0;	
        var appVer1 = a1 + b1 + c1;
        var appVer2 = a2 + b2 + c2;
    
        // 숫자 버전 비교	
        if(appVer1 > appVer2) {
            return 1;
        } else if(appVer1 < appVer2) {
            return -1;
        }
        return 0;
    }
    
    COMMON.prototype.keypadChk = function(args){
        if (typeof args == 'object') {
            // nFilter 암호화된 경우 nFilterType=T 전송 처리
            if (kbstarCommon.showSecureKeypadFlag) {
                args.nFilterType = "T";
            }
            args.action_time = new Date().getTime();
        } else {
            try {
                  args = JSON.parse(args);
                  args._action_time = new Date().getTime();
            } catch (eNavigate) {
                if (args == "") {
                    args = "t=" + new Date().getTime();
                } else {
                    args += "&t=" + new Date().getTime();
                }
            }
        }
        return args;
    };
    
    /**
    * iOS UrlDecoding 에러 방지
     **/
    COMMON.prototype.urlEncodingForIOS = function(data) {
        if (window.COMMON.getUserAgent() == "ios") {
            if(typeof data == 'object'){
                var temp = JSON.stringify(data);
                temp = temp.replace(/\%(?![0-9a-fA-F]{2})/g, "%25");
                data = JSON.parse(temp);
            } else if(typeof data == 'string'){
                    data = data.replace(/\%(?![0-9a-fA-F]{2})/g, "%25");
            }
        }
        return data;
    };


    
    /**
     * JSON 데이터를 form or key=value&.. 형식으로 바꿔주는 재귀함수
     * 
     * @param {JSON}  data
     * @param {String}  flag - form 형식의 리턴일경우 "form", string 형식의 리턴일 경우 "string"
     * @returns {Object or String}  data
     **/ 
    COMMON.prototype.recursion = function(data, flag) {
        var i = 0;
        for ( var name in data) {
            var value = data[name] || "";
            var type = typeof (value);
            var type2 = Object.prototype.toString.call(value);
            if (type != "function") {
                window.COMMON.make_data(name, value, flag);
                if (type == "object" && value) {
                    if (type2 != "[object Array]") {
                        window.COMMON.recursion(value, flag);
                    } else {
                        if (Object.prototype.toString.call(value[0]) == '[object Object]') {
                            window.COMMON.recursion(value, flag);
                        }
                    }
                }
                i++;
            }
        }
    };
    
    // convertJSONtoURL 데이터 생성 함수
    COMMON.prototype.make_data = function(name, value, flag) {
        if (flag == "string") {
            var type = Object.prototype.toString.call(value);
            if (type == "[object String]") {
                if (value != "" && value.indexOf("<br />") != -1) {
                    value = value.replace('/'+'<br />'+'/g', "\n");
                }else if (value != "" && value.indexOf("<br>") != -1) {
                    value = value.replace('/'+'<br>'+'/g', "\n");
                }else if (value != "" && value.indexOf("<br/>") != -1) {
                    value = value.replace('/'+'<br/>'+'/g', "\n");
                }
                kbstar.temp_string += encodeURIComponent(name) + "=" + encodeURIComponent(value) + "&";
            } else if (type == "[object Array]") {
                var type2 = Object.prototype.toString.call(value[0]);
                if (type2 != '[object Object]') {
                    for ( var i in value) {
                        var value2 = value[i] || "";
                        kbstar.temp_string += encodeURIComponent(name) + "=" + encodeURIComponent(value2) + "&";
                    }
                }
            } else if(type == "[object Number]") {
                kbstar.temp_string += encodeURIComponent(name) + "=" + encodeURIComponent(value) + "&";
            }
        } else if (flag == "form") {
            var type = Object.prototype.toString.call(value);
            if (type == "[object String]") {
                var _outObj = $('<input type="hidden" />').attr({
                    "name" : name,
                    "value" : value
                });
                kbstar.temp_form.append(_outObj);
            } else if (type == "[object Array]") {
                var type2 = Object.prototype.toString.call(value[0]);
                if (type2 != '[object Object]') {
                    for ( var i in value) {
                        var _outObj = $('<input type="hidden" />').attr({
                            "name" : name,
                            "value" : value[i]
                        });
                        kbstar.temp_form.append(_outObj);
                    }
                }
            }
        }
    };
    
    // Json to String
    COMMON.prototype.convertJSONtoURL = function(args){
        var params = "";
        if (typeof args == 'object') {
            window.COMMON.recursion(args, "string");
        }
        params = kbstar.temp_string;
        kbstar.temp_string = "";
            
        return params;
    };
    
    COMMON.prototype.makeSendMethodRequestURL = function(successCallback, failCallback, serviceName, actionName, params){
        var compareParams = (typeof params == "object") ? JSON.stringify(params) : params;
        if(serviceName == kbstar.doubleSchemeReq.serviceName
                && actionName == kbstar.doubleSchemeReq.actionName
                && compareParams == kbstar.doubleSchemeReq.params
                && Number(new Date().getTime()) - Number(kbstar.doubleSchemeReq.actionTime) < 500){
            kbstar.doubleSchemeFlag = true;
        }
        kbstar.doubleSchemeReq.serviceName = serviceName;
        kbstar.doubleSchemeReq.actionName = actionName;
        kbstar.doubleSchemeReq.params = (typeof params == "object") ? JSON.stringify(params) : params;
        kbstar.doubleSchemeReq.actionTime = new Date().getTime();
        var callbackId="";
        if (successCallback || failCallback) {
            callbackId = serviceName + kbstar.callbackId++;
            kbstar.callbacks[callbackId] = {
                success : successCallback,
                fail : failCallback
            };
        }

        var jsonToUrl = window.COMMON.convertJSONtoURL(params);
        jsonToUrl = jsonToUrl.replace(/\+/gi, "%20");
        var data = "{\"params\":\""+encodeURIComponent(jsonToUrl)+"\"}";
        var targetURL = "kbbank://call?cmd=method&name="+serviceName+"."+actionName+"&callbackId="+callbackId+"&params="+encodeURIComponent(data);    
        return targetURL;
    };

    
    /**
     * setTitleName html head 영역에 title 입력
     * 
     * @param {}
     *            txt
     */
    COMMON.prototype.setTitleName = function(txt) {
        if (txt != null && txt != "") {
            var pageTitle = txt.substring(txt.indexOf("[") + 1, txt.indexOf("]"));
            $("title").text(pageTitle);
        }
    };
    /**
     * insertPopupHTML body 앞에 html 추가
     * 
     * @param {String}
     *            txt
     */
    COMMON.prototype.insertPopupHTML = function(txt) {
        if (txt != null && txt != "") {
            if($("#insertPopupHtmlArea").length > 0){
        		$("#insertPopupHtmlArea").remove();
        	}
            $("body").prepend("<div id='insertPopupHtmlArea'>" + txt + "</div>");
        }
    };
    
    /**
     * caq_doLogin 공인인증 로그인 처리
     * 
     * @param form
     *            html의 form
     * @callback callback 처리 후 호출 될 Callback
     */
    COMMON.prototype.caq_doLogin = function(form, callback) {
        window.certManager.requestCertLogin(formdata, successCallback, failCallback);	// native
    };
    
    /**
     * caq_doSign 전자서명
     * (HTML에서 caq_doSign()만 호출할 경우, 전자서명 확인창 나오지 않음)
     * 
     * @param keys
     *            서명의 키
     * @param labels
     *            서명의 라벨
     * @callback callback 처리 후 호출 될 Callback
     */
    COMMON.prototype.caq_doSign = function(keys, labels, callback) {
        //window.COMMON.caq_doSignWithOption("1", keys, labels, callback);
        window.COMMON.caq_doSignWithOption("0", keys, labels, callback);
    };
    
    /**
     * caq_doSignWithOption 전자서명
     * 
     * @param options
     *            옵션(전자서명 확인창 유무) ( 0 : 전자서명 확인창 X / 1 : 전자서명 확인창 O )
     * @param keys
     *            서명의 키
     * @param labels
     *            서명의 라벨
     * @callback callback 처리 후 호출 될 Callback
     */
    COMMON.prototype.caq_doSignWithOption = function(options, keys, labels, callback) {
        var delimeter = ":";
                
        if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative() ) {
            // web browser
        	window.COMMON.digiSign(keys, labels, callback); // wizbera
        } else {
            // native dream security
            var values = $("input[name='hi_encryptData']").val();
                
            window.COMMON.caq_makeValue(options, keys, values, labels, delimeter, function(returnData) {
                $("input[name='signed_msg']").val(returnData.data.PKCS7);
                window.SPA_COMMON.callbackWithSPA(callback, returnData);
            }, function(returnData) {
                $("input[name='signed_msg']").val("");
                    
                if($("#CERT_MEDIA_TYPE").val() != undefined && ($("#CERT_MEDIA_TYPE").val().toUpperCase()).indexOf("K") != -1) {
                    window.COMMON.kbSignErrorCheck(returnData, callback);
                } else {
                    window.SPA_COMMON.callbackWithSPA(callback, returnData);
                }

            });
        }
    };
    
    COMMON.prototype.kbSignErrorCheck = function(signErrorData, callback) {
        // 서버에러 메시지 맵핑
        kbstar.connect.request('/mquics?QAction=1025210', signErrorData, function(){
        	if( kbstar.callScript_kbSign == 'T'){
        		window.SPA_COMMON.callbackWithSPA(callback, signErrorData);
        	}
        }, function(sdata) {
            var params = {
                    errCode : sdata.msg.servicedata.ERR_CODE,
                    errMSG : sdata.msg.servicedata.ERR_MSG,
                    errUrl : sdata.msg.servicedata.ERR_URL,
                    errcustlinktxt : sdata.msg.servicedata.ERR_LNKTXT,
                    errcustlinkurl : sdata.msg.servicedata.ERR_LNKURL,
                    errcustlinkimgurl : sdata.msg.servicedata.ERR_LNKIMGURL,
                    QPageStart : sdata.msg.servicedata.QPageStart,
                    QPageStartTitle : sdata.msg.servicedata.QPageStartTitle,
                    callScript : kbstar.callScript_kbSign
                };
                
            if(signErrorData.errorCode == 17015 || signErrorData.errorCode == 18329) {
                window.appManager.showErrDialog(function(){
                	window.SPA_COMMON.callbackWithSPA(callback, signErrorData);
                }, params);
            } else if(signErrorData.errorCode == 17008 || signErrorData.errorCode == 17020) {
                window.appManager.showErrDialog(function(){
                        
                    if($("#IS_OPEN_API").val() == undefined || $("#IS_OPEN_API").val() == "") {
                        window.configManager.requestLogout("","0");
                    } else {
                        window.SPA_COMMON.callbackWithSPA(callback, signErrorData);
                    }
                }, params);
            } else {
                window.SPA_COMMON.callbackWithSPA(callback, signErrorData);
            }		
        }, true);        
    }
    
    COMMON.prototype.caq_makeValue = function(options, keys, values, formats, delimeter, digiSuccessCallback, digiFailCallback) {
        if (keys == null) {
            alert("keys can NOT be null");
            return;
        }
        if (delimeter == null) {
            alert("delimeter can NOT be null");
            return;
        }
        var keyArray = keys.split(delimeter);
        var valueArray = values.split(delimeter);
    
        var formatArray = null;
        if (formats != null && formats.length > 0) {
            formatArray = formats.split(delimeter);
        }
    
        if (keyArray.length != valueArray.length
                || (formatArray != null && valueArray.length != formatArray.length)) {
            alert("signKeyValue invalid argument");
            return;
        }
    
        var data = "";
        var format = "";
        for ( var i = 0; i < keyArray.length; i++) {
            if (data.length > 0) {
                    data += "&";
            }
            data += encodeURIComponent(keyArray[i]);
            data += "=";
            data += encodeURIComponent(valueArray[i]);
    
            if (format.length > 0) {
                format += "&";
            }
    
            if (formatArray != null) {
                format += encodeURIComponent(keyArray[i]);
                format += "=";
                format += encodeURIComponent(formatArray[i]);
            }
        }
    
        if (format.length > 0) {
            if($("#CERT_MEDIA_TYPE").val() != undefined && ($("#CERT_MEDIA_TYPE").val().toUpperCase()).indexOf("K") != -1) {
                if($("#KBSIGN_SIGN_TYPE").val() != "signature") {
                    data = data + "&" + "__USER_CONFIRM_FORMAT=" + encodeURIComponent(format);
                }
            } else {
                data = data + "&" + "__USER_CONFIRM_FORMAT=" + encodeURIComponent(format);
            }     
        }
            
        if($("#CERT_MEDIA_TYPE").val() != undefined && ($("#CERT_MEDIA_TYPE").val().toUpperCase()).indexOf("K") != -1) {
            var signType = "sign";
            var isOpenApi = "N";
            var mediaType = $("#CERT_MEDIA_TYPE").val().toUpperCase();
            var authType = "";
            try {
                signType = $("#KBSIGN_SIGN_TYPE").val();
                isOpenApi = $("#IS_OPEN_API").val();
            } catch(e) {
            }
            if(signType == undefined || signType == "") {
                signType = "sign";
            }
            if(isOpenApi == undefined || isOpenApi == "") {
                isOpenApi = "N";
            }
                
            if(isOpenApi == "N") {
                mediaType = "K1";
            }
        //  alert(signType);
        //  alert(isOpenApi);
        //  alert(mediaType);
            if(signType != "signature") // 축약서명에서는 생략한다.
                data = data + "&" + "__CERT_STORE_MEDIA_TYPE=" + mediaType;
                
            if(mediaType == "K1") {
                authType = 'pin';
            } else if(mediaType == "K2") {
                authType = 'pattern';
            } else if(mediaType == "K3") {
                authType = 'biometrics';
            } else if(mediaType == "K4") {
                authType = 'biometrics';
            }
                
            if(options == "1") {
                //기존 전자서명(확인창O)
                window.certManager.requestKBCertSign(keys, values, formats, delimeter, data, authType, signType, digiSuccessCallback, digiFailCallback);
            } else {
                // 전자서명(확인창x)
                window.certManager.requestKBCertSignNoMsg(keys, values, formats, delimeter, data, authType, signType, digiSuccessCallback, digiFailCallback);
            }
        } else if($("#CERT_MEDIA_TYPE").val() == "Y1") {
            // 금융인증서 전자서명
            var data = {};
            for ( var i = 0; i < keyArray.length; i++) {
                var chkVal = data[keyArray[i]];
                if( chkVal == undefined || chkVal == null){
                    data[keyArray[i]] = valueArray[i];
                }else if(chkVal.push){
                    data[keyArray[i]].push(valueArray[i]);
                }else{
                    data[keyArray[i]] = [chkVal, valueArray[i]];
                }
            }
            data["__USER_CONFIRM_FORMAT"] = format;
            var _digiSuccessCallback = function(result){
                if(result.code){
                    //window.COMMON.digiFailCallback(result);
                	window.SPA_COMMON.callbackWithSPA(digiFailCallback, result);
                }
                var pkcs7 = result.signedVals[0];
                var returnData = {data:{PKCS7:pkcs7}};

                //window.COMMON.digiSuccessCallback(returnData);
                window.SPA_COMMON.callbackWithSPA(digiSuccessCallback, returnData);
            }
            var param = {
                type : "04",  // 01:네이티브로그인 02:네이티브전자서명 03:웹로그인 04:웹전자서명
                options : options,
                keys : keys, 
                values : encodeURIComponent(JSON.stringify(data))
            };
            window.appManager.openWebViewWithPopup('/mquics?page=D004041', param, _digiSuccessCallback);
        } else {
            if(options == "1") {
                //기존 전자서명(확인창O)
                window.certManager.requestCertSign(keys, values, formats, delimeter, data, digiSuccessCallback, digiFailCallback);
            } else {
                // 전자서명(확인창x)
                window.certManager.requestCertSignNoMsg(keys, values, formats, delimeter, data, digiSuccessCallback, digiFailCallback);
            }
        }
    };
    
    /**
     * 팝업 close시 쿠키설정 함수
     */
    COMMON.prototype.setOpenCookie = function(name, value, expiredays) {
        var today = new Date();
        today.setDate(today.getDate() + expiredays);
        document.cookie = name + "=" + escape(value)
                    + "; domain=kbstar.com; path=/; expires=" + today.toGMTString()
                    + ";";
     };
    /**
     * 팝업 close 함수 공지 팝업에만 사용하는 함수 류충환과장 요청 추가
     */
    COMMON.prototype.closeOpenPopupWin = function(popupId, cookieName, notOpenToday) {
        // noOpenToday가 0이아니면 쿠키설정
        if (notOpenToday != 0) {
            // 체크박스가 체크되었을때만 쿠키저장.
            if ($("#checkbox_" + popupId).attr("checked") == "checked") {
            	if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative() ) {
                    window.COMMON.setOpenCookie(cookieName, "checked", notOpenToday);
                    $("#pid_" + popupId).remove();
                } else {
                    var today = new Date();
                    var expiredays = today.setDate(today.getDate() + notOpenToday);
                    window.UserPreference.setValue(function() {
                        $("#pid_" + popupId).remove();
                    }, function() {
                    }, cookieName, expiredays);
                }
            } else {
                $("#pid_" + popupId).remove();
            }
        } else {
            $("#pid_" + popupId).remove();
        }
    };
    
    /**
    * 팝업(슬라이드) close 함수 공지 팝업에만 사용하는 함수 류충환과장 요청 추가
         */
    COMMON.prototype.closeSlidePopupWin = function(popupId, cookieName, notOpenToday) {
        // noOpenToday가 0이아니면 쿠키설정
        if (notOpenToday != 0) {
            // 체크박스가 체크되었을때만 쿠키저장.
            if ($("#checkbox_" + popupId).attr("checked") == "checked") {
            	if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative() ) {
                    window.COMMON.setOpenCookie(cookieName, "checked", notOpenToday);
                    $("#pid_" + popupId).remove();
                } else {
                    var today = new Date();
                    var expiredays = today.setDate(today.getDate() + notOpenToday);
                    window.UserPreference.setValue(function() {
                        $("#pid_" + popupId).remove();
                    }, function() {
                    }, cookieName, expiredays);
                }
            } else {
                $("#pid_" + popupId).slideUp(300);
            }
        } else {
            $("#pid_" + popupId).slideUp(300);
        }
    };
    /**
     * includeDelfino 웹에서 위즈베라 전자서명 호출을 위한 JS include
     * 
     * @param {String}
     *            filename
     */
    COMMON.prototype.includeDelfino = function(filename) {
        if (filename == undefined || filename == "") {
            filename = "config.js";
        }

        var TEMPLATE_PATH_SERVER = "";
        var href = location.href;
        // 해당 URL 수정필요(?)
        if (href.indexOf("/mnbank/") > -1) {
            var temp_href = href.substring(href.indexOf('mnbank/'), href.length);
            var href_stepLength = (temp_href.split("/")).length;
            for ( var i = 0; i < href_stepLength - 2; i++) {
                TEMPLATE_PATH_SERVER += "../";
            }
        }
        TEMPLATE_PATH_SERVER += "js/";

        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        //script.src = TEMPLATE_PATH_SERVER + filename;
        script.src = "/common/js/" + filename;
        head.appendChild(script);
    };

    /**
     * s_search_action 별프로젝트- 별 조회 화면으로 이동
     */
    //COMMON.prototype.s_search_action = function() {
    //    window.navi.navigateWithInit('/mquics?page=C052796', '', function() {});
    //};
    /**
     * s_point_action 별프로젝트- 별 적립 sendrequest
     */
    /*
    COMMON.prototype.s_point_action = function() {
        window.AppInfoManager.requestLoginStatus(function(ret) {
            if (ret == "00") {
                window.configManager.requestCertLogin("stay_on_page", "");
            } else {
                var param = {
                    "tryStarFund" : "1"
                };
                kbstar.connect.request('/mquics?QAction=694394', param, function(data) {
                    $('#s_pointHTML').remove();
                    alert("★ 별을 찾으셨습니다. 적립여부는\nMY★조회에서 확인해 주세요. ");
                }, function(data) {
    //                data.msg.common.errorpopup = "0";
    //                data.msg.common.errorbutton = "1";
                    caq.error.caq_printError(data);
                }, true);
            }
        });
    };
	*/
    /**
     * SMSsend SMS 보내기 - 안드로이드, IOS 의 API 형식에 맞춰 분기
     * 
     * @param successCallback
     * @param failCallback
     * @param message
     * @param phoneNumbers
     *            JSON 배열 ex)var phoneNumbers = [a,b];
     */
    COMMON.prototype.SMSsend = function(successCallback, failCallback, message, phoneNumbers) {
        window.SNSManager.sendSMS(successCallback, failCallback, message, phoneNumbers);
    };

    /**
     * getAppStartMessage Main화면의 구동 공지 팝업
     * 
     * @param {JSON}
     *            onParam호출 시 전달되는 파라미터 그대로 전달
     */
    COMMON.prototype.getAppStartMessage = function(param) {
        if (param == null || typeof param == 'undefined') {
            return;
        } else {
            if ("1" == param.isFirst) {
                setTimeout(
                        function() {
                            kbstar.connect.request('/mquics?QAction=694504', param, function(data) {
                                var msg = data.data.msg;
                                if (msg.servicedata.구동공지대상여부 == '1') {
                                    var appStartMsg = msg.servicedata.구동공지;
                                    if (appStartMsg != undefined) {
                                        // 구동공지 팝업을 띄워야 할 내용이 있는 경우 띄운다
                                        $('body').append('<div id="id_appStartMsgWrapDiv"></div>');
                                        $('#id_appStartMsgWrapDiv').html(appStartMsg.팝업내용);
                                    }
                                }
                            },
                            function(data) {}, true, false, false, false, true);
                        }, 0);
            } else {
                return;
            }
        }
    };
    /**
     * fnComLayerPopUi layerpop.js add 20131125 레이어 팝업 함수
     * 
     * @param {String}
     *            strId popup Element Id
     * @returns {}
     */
    COMMON.prototype.fnComLayerPopUi = function(strId) {
        if (strId == null || strId === undefined || strId == "") {
            return false;
        }

        var maskHeight = $(document).height();
        var maskWidth = $(window).width();

        $('body').append('<div id="layermask"></div>');
        $('#layermask').css({
            'width' : maskWidth,
            'height' : maskHeight
        });

        $('#layermask').show();

        var winH = $(window).height();
        var winW = $(window).width();

        if (winH > $(strId).height()) {
            $(strId).css('top', window.pageYOffset + (winH / 2 - $(strId).height() / 2) - device.tabbarHeight / 2);
        } else {
            $(strId).css('top', window.pageYOffset).css('padding-bottom','70px');
        }
        $(strId).css('left', winW / 2 - $(strId).width() / 2);

        $(strId).fadeIn(100);

        return true;
    };

    COMMON.prototype.getUrlParameter = function() {
        var parameterObject = new Object();
        var locate = location.href;

        if (locate.indexOf("?") == -1) {
            return parameterObject;
        }

        var parameter = locate.split("?")[1];
        var paramArray = parameter.split("&");
        for ( var i = 0; i < paramArray.length; i++) {
            parameterObject[paramArray[i]] = "";
        }
        window.COMMON.getUrlParameter = function() {
            return parameterObject;
        };
        return parameterObject;
    };

    /**
     * onLoading
     */
    COMMON.prototype.onLoading = function() {
    };

    /**
     * onDeviceReady 운영과 테스트 서버의 도메인 설정.
     */
    COMMON.prototype.onDeviceReady = function(){
        // 초기화로 처리...
        //kbstarCommon._DOMAIN = window.device.starbank_domain;
        //kbstarCommon._PDF_DOMAIN = window.device.starbank_domain;
        //kbstarCommon._MOBILEWEB_DOMAIN = window.device.mobileweb_domain;
        // 팝업 보기 실행...
        $('.layerpop').click(
                function(e) {
                    e.preventDefault();

                    var id = $(this).attr('href');
                    var ids = $(this).attr('rel');
                    var maskHeight = $(document).height();
                    var maskWidth = $(window).width();

                    $('body').append('<div id="layermask"></div>');
                    $('#layermask').css({
                        'width' : maskWidth,
                        'height' : maskHeight
                    });
                    $('#layermask').show();

                    var winH = $(window).height();
                    var winW = $(window).width();
                    if (winH > $(id).height()) {
                        $(id).css('top', window.pageYOffset + (winH / 2 - $(id).height() / 2) - device.tabbarHeight / 2);
                    } else {
                        $(id).css('top', window.pageYOffset).css('padding-bottom','70px');
                    }

                    $(id).css('left', winW / 2 - $(id).width() / 2);
                    $(id).show();

                    if (winH > $(ids).height()) {
                        $(ids).css('top', window.pageYOffset + (winH / 2 - $(ids).height() / 2) - device.tabbarHeight / 2);
                    } else {
                        $(ids).css('top', window.pageYOffset).css('padding-bottom','70px');
                    }
                    $(ids).css('left', winW / 2 - $(ids).width() / 2);
                    $(ids).show();

                });

        $('.layerwrap .close,.layerwrap .btn_close').click(function(e) {
            e.preventDefault();
            $('#layermask').hide();
            $('.layerwrap').hide();
        });

        $('.layerwrap01 .close,.layerwrap01 .btn_close').click(function() {
            $('.layerwrap01').hide();
            $('.layerbg').hide();
        });

        $('.layer_btn').click(function() {
            $('.layerwrap01').show();
            $('.layerbg').show();
        });
        // layerpop.js add 20131125
        if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative() ) {
            //window.COMMON.onLoading();    // onLoading 두번 부르는 경우가 있어서 코멘트 처리
        } else {
            try {
                if (window.COMMON.getUserAgent() == "ios") {
                    setTimeout(function() {
                        $('.security_keypad').attr("readonly", "readonly");
                    }, 200);
                } else {
    //                $("#wrap").hide();
                    setTimeout(function() {
    //                    $("#wrap").show();
                        $('.security_keypad').attr("readonly", "readonly");
                    }, 200);
                }
            } catch (e) {
            }
        }
        /**
         * 추가인증 아이폰 SMS 인증 없애기 위한 변수 설정
         */
        if(typeof AddTemplate != 'undefined'){
            if("ios" == window.COMMON.getUserAgent()){
                AddTemplate.SMS_CONFIRM = false;
            }
        }
    };

    /**
     * Layer popup event 설정.
     */
    COMMON.prototype.onLayerSet = function() {
        $(window).resize(function() {
            var box = $('.layerwrap');
            var maskHeight = $(document).height();
            var maskWidth = $(window).width();
            $('#layermask').css({
                'width' : maskWidth,
                'height' : maskHeight
            });

            var winH = $(window).height();
            var winW = $(window).width();

            if (winH > $(box).height()) {
                $(box).css('top', window.pageYOffset + (winH / 2 - $(box).height() / 2) - device.tabbarHeight / 2);
            } else {
                $(box).css('top', window.pageYOffset).css('padding-bottom','70px');
            }
            box.css('left', winW / 2 - box.width() / 2);
        });
    };



    /**
    * 데이터 바인딩전 Element uridec 속성에 따라 decodeURlComponent 적용
    */
   COMMON.prototype.decUriCompData = function(data, element) {
        var $elementObj = element;
        var resultData = "";

        if ("on" == $($elementObj).attr("uridec")) {
            resultData = decodeURIComponent(data);
        } else {
            resultData = data;
        }

        if (resultData == undefined) {
            if (element != undefined) {
                var key = Object.keys(JSON.parse($(element).attr("data-quics")));
                var column = JSON.parse($(element).attr("data-quics"))[Object.keys(JSON.parse($(element).attr("data-quics")))];
                if ("get" == key && "" == column) {
                    resultData = "";
                }
            }
        }
        return resultData;
    };

    /**
    * 웹접근성 적용
    */
   COMMON.prototype.setWebAccessibilityTag = function(data, element, index) {
        if (data != undefined) {
            var common = data.common != undefined ? data.common : {};
            var servicedata = data.servicedata != undefined ? data.servicedata : {};
            index = index == undefined ? 0 : index;

            if (element != undefined) {
                var $watElement = element;
                $watElement.each(function() {
                    if ($(this).attr("data-wat") != undefined) {
                        var _quicsjson = JSON.parse($(this).attr("data-wat"));
                        var _arrtString = _quicsjson.attrString;
                        var _txtString = _quicsjson.txtString || "";
                        var _keyString = _quicsjson.keyString || "";

                        if (_arrtString != undefined) {
                            if (_txtString.indexOf("%S") > -1) {
                                if (_keyString != undefined) {
                                    var _keyArray = _keyString.split(",");
                                    for ( var i = 0; i < _keyArray.length; i++) {
                                        var replaceStr = "";
                                        if (_keyArray[i] == "index") {
                                            replaceStr = index + "";
                                        } else {
                                            if (data[_keyArray[i]] != undefined) {
                                                replaceStr = data[_keyArray[i]] + "";
                                            }
                                        }
                                        _txtString = _txtString.replace("%S", replaceStr);
                                    }
                                    _txtString = _txtString.replace("()", ""); // 빈 ()를 공백으로 치환함. 계좌 별명이 없을 때에 대한 처리
                                }
                            }
                            if (_arrtString == "html") {
                                $(this).html(_txtString);
                            } else {
                                $(this).attr(_arrtString, _txtString);
                            }
                        }
                    }
                });
            }
        }
    };

    /**
    * quicsIncludeFile file Include(jsp)바인딩
    * 
    * @param {Element}
    *            htmlElement
    * @param {String}
    *            fileInfo jsp file code(id)
    */
   COMMON.prototype.quicsIncludeFile = function(htmlElement, fileInfo) {
        try {
            var $qelement = htmlElement;
            var TEMPLATE_PATH_SERVER = "/mquics?asfilecode=" + fileInfo;
            //kbstar.alert("#### TEMPLATE_PATH_SERVER :: " + TEMPLATE_PATH_SERVER);
            kbstar.connect.request(TEMPLATE_PATH_SERVER, '', function(src) {
                kbstar.alert("############## kbstar.DataBinder.quicsIncludeFile :: success!!!!!!");
                //kbstar.alert("############## kbstar.DataBinder.quicsIncludeFile :: src - " + JSON.stringify(src));
                var includeString = "";
                src = src.data;
                src = decodeURIComponent(src);
                $($.parseHTML(src)).find("#content").addBack().each(function() {
                    if ("content" == $(this).attr("id")) {
                        includeString = $(this).html().toString();
                    }
                });
                if (includeString == undefined || includeString == null || includeString == "") {
                    $qelement.html(window.SPA_COMMON.changeVar(src));
                } else {
                    $qelement.html(includeString);
                }
                //window.uicontrols.showLoading(false, true);
            },
            function(p) {
                kbstar.alert("############## kbstar.DataBinder.quicsIncludeFile :: FAIL!!!!!!");
                //window.uicontrols.showLoading(false, true);
            }, false, false, false, true);
        } catch (e) {
            kbstar.alert("quicsIncludeFile : " + e);
        }
    };

    /**
    * quicsIncludeGetFile file Include(jsp)바인딩
    * 
    * @param {Element}
    *            htmlElement
    * @param {String}
    *            fileInfo jsp file code(id)
    */
   COMMON.prototype.quicsIncludeGetFile = function(htmlElement, fileInfo) {
        try {
            var $qelement = htmlElement;

            // Orchestra Simulator : froxy 서버 관련으로 도메인 제거
            //var TEMPLATE_PATH_SERVER = kbstarCommon._DOMAIN + "/mquics?asfilecode=" + fileInfo;
            var TEMPLATE_PATH_SERVER = "";
            if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative() ) {
                var TEMPLATE_PATH_SERVER = "/mquics?asfilecode=" + fileInfo;
            } else {
                var TEMPLATE_PATH_SERVER = kbstarCommon._DOMAIN + "/mquics?asfilecode=" + fileInfo;
            }
            $.get(TEMPLATE_PATH_SERVER, function(src) {
                var includeString = "";
                $($.parseHTML(src)).find("#content").addBack().each(function() {
                    if ("content" == $(this).attr("id")) {
                        includeString = $(this).html().toString();
                    }
                });
                if (includeString == undefined || includeString == null
                        || includeString == "") {
                    $qelement.html(window.SPA_COMMON.changeVar(src));
                } else {
                    $qelement.html(includeString);
                }
            }, "text");
        } catch (e) {
            kbstar.alert("kbstar.DataBinder.quicsIncludeFile error : " + e);
        }
    };

    /**
    * page Include param(Element) htmlElement 파일이 하나일경우 파일코드 하나, 여러개일경우 배열로 받는다.
    * param(String) pageInfo 파일이 하나일경우 파일코드 하나, 여러개일경우 배열로 받는다.
    * ex)$("#pageinclude_C033310") param(Function) callback callback 파일인클루드가 끝나고
    * callback 함수 param(Boolean) loading_flag 로딩이 필요할시 true 반대 경우 넣지 않거나 false
    */
    COMMON.prototype.quicsIncludePage = function(htmlElement, pageInfo, callback, loading_flag) {
        try {
            if (loading_flag != undefined && loading_flag == true) {
                window.uicontrols.showLoading(true, false);
            }
            var pageInfo_type = typeof pageInfo;
            var $qelement = htmlElement;
            var use_pageInfo = "";

            if (pageInfo_type == "string") {
                use_pageInfo = pageInfo;
            } else if (pageInfo_type == "object") {
                use_pageInfo = pageInfo[0];
            }
            if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative() ) {
                //var TEMPLATE_PATH_SERVER = kbstarCommon._DOMAIN + "/mquics?QAction=1034972"; 
                var TEMPLATE_PATH_SERVER = "/mquics?QAction=1034972";    // Orchestra Simulator : froxy 서버 관련으로 도메인 제거
                $.get(TEMPLATE_PATH_SERVER, {
                    "includePage" : use_pageInfo
                }, function(data) {
                    var jsonData = JSON.parse(data);
                    //if(jsonData.hasOwnProperty("servicedata")) { // 체크 필요 (?)
                    //} else {
                    //}
                    var src = jsonData.msg.servicedata.resultHtml;
                    var includeString = "";
                    $($.parseHTML(src)).find("#content").addBack().each(function() {
                        if ("content" == $(this).attr("id")) {
                            includeString = $(this).html().toString();
                        }
                    });

                    if (includeString == undefined || includeString == null
                            || includeString == "") {
                        if (pageInfo_type == "string") {
                            $qelement.html(window.SPA_COMMON.changeVar(src));
                            if (callback != undefined) {
                                if (typeof callback == "function") {

                                    callback(window.SPA_COMMON.changeVar(src));
                                }
                            }
                        } else if (pageInfo_type == "object") {
                            if (callback != undefined) {
                                if (typeof callback == "function") {

                                    window.COMMON.common_IncludePageSuccess(htmlElement, pageInfo, callback, src);
                                }
                            }
                        }
                    } else {
                        if (pageInfo_type == "string") {
                            $qelement.html(includeString);

                            if (callback != undefined) {
                                if (typeof callback == "function") {
                                    callback(includeString);
                                }
                            }
                        } else if (pageInfo_type == "object") {
                            if (callback != undefined) {
                                if (typeof callback == "function") {
                                    window.COMMON.common_IncludePageSuccess(htmlElement, pageInfo, callback, includeString);
                                }
                            }
                        }
                    }
                }, "text");
            }else{
                window.HTTP.addRequestFileQueue(function(data){
                    var src = decodeURIComponent(data);
                    var includeString = "";
                    $($.parseHTML(src)).find("#content").addBack().each(function() {
                        if ("content" == $(this).attr("id")) {
                            includeString = $(this).html().toString();
                        }
                    });
                    if (includeString == undefined || includeString == null
                            || includeString == "") {
                        if (pageInfo_type == "string") {
                            $qelement.html(window.SPA_COMMON.changeVar(src));
                            if (callback != undefined) {
                                if (typeof callback == "function") {
                                    callback(window.SPA_COMMON.changeVar(src));
                                }
                            }
                        } else if (pageInfo_type == "object") {
                            if (callback != undefined) {
                                if (typeof callback == "function") {
                                    window.COMMON.common_IncludePageSuccess(htmlElement, pageInfo, callback, src);
                                }
                            }
                        }
                    } else {
                        if (pageInfo_type == "string") {
                            $qelement.html(includeString);
                            if (callback != undefined) {
                                if (typeof callback == "function") {
                                    callback(includeString);
                                }
                            }
                        } else if (pageInfo_type == "object") {
                            if (callback != undefined) {
                                if (typeof callback == "function") {
                                    window.COMMON.common_IncludePageSuccess(htmlElement, pageInfo, callback, includeString);
                                }
                            }
                        }
                    }
                    if(iscroll) iscroll.refresh();
                }, function(data){
                    alert("약관파일을 가져오지 못했습니다.\n다시 시도해 주세요.");
                    if (device.devicetype == "tablet") {
                        window.configManager.moveToBankHome();
                    } else {
                        window.navi.goBackWithCount();
                    }
                }, "file://"+use_pageInfo, "GET");
            }
        } catch (e) {
            kbstar.alert("quicsIncludePage error : " + e);
        }
    };
    /**
    * page Include SuccessCallback
    */
    COMMON.prototype.common_IncludePageSuccess = function(htmlElement, pageInfo, callback, text) {
        htmlElement[0].html(text);
        var temp_pageInfo = pageInfo.splice(1, pageInfo.length);
        var temp_htmlElement = htmlElement.splice(1, htmlElement.length);
        if (temp_pageInfo.length == 0) {
            window.uicontrols.showLoading(false, false);
            callback();
        } else {
            window.COMMON.quicsIncludePage(temp_htmlElement, temp_pageInfo, callback);
        }
    };

    /**
    * page Include param(Element) htmlElement 파일이 하나일경우 파일코드 하나, 여러개일경우 배열로 받는다.
    * param(String) pageInfo 파일이 하나일경우 파일코드 하나, 여러개일경우 배열로 받는다.
    * ex)$("#pageinclude_C033310") param(Function) callback callback 파일인클루드가 끝나고
    * callback 함수 param(Boolean) loading_flag 로딩이 필요할시 true 반대 경우 넣지 않거나 false
    */
    COMMON.prototype.quicsIncludePageWithDataBinding = function(htmlElement, pageInfo, callback, loading_flag) {
        try {
            if (loading_flag != undefined && loading_flag == true) {
                window.uicontrols.showLoading(true, false);
            }
            var pageInfo_type = typeof pageInfo;
            var $qelement = htmlElement;
            var use_pageInfo = "";

            if (pageInfo_type == "string") {
                use_pageInfo = pageInfo;
            } else if (pageInfo_type == "object") {
                use_pageInfo = pageInfo[0];
            }
            if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative() ) {
                //var TEMPLATE_PATH_SERVER = kbstarCommon._DOMAIN + "/mquics?QAction=1034972";
                var TEMPLATE_PATH_SERVER = "/mquics?QAction=1034972";    // Orchestra Simulator : froxy 서버 관련으로 도메인 제거
                $.get(TEMPLATE_PATH_SERVER, {
                    "includePage" : use_pageInfo
                }, function(data) {
                    var jsonData = JSON.parse(data);
                    var src = jsonData.msg.servicedata.resultHtml;
                    var includeString = "";
                    $($.parseHTML(src)).find("#content").addBack().each(function() {
                        if ("content" == $(this).attr("id")) {
                            includeString = $(this).html().toString();
                        }
                    });
                    if (includeString == undefined || includeString == null
                            || includeString == "") {
                        if (pageInfo_type == "string") {
                            $qelement.html(window.SPA_COMMON.changeVar(src));
                            if (callback != undefined) {
                                if (typeof callback == "function") {
                                    callback(window.SPA_COMMON.changeVar(src));
                                }
                            }
                        } else if (pageInfo_type == "object") {
                            if (callback != undefined) {
                                if (typeof callback == "function") {
                                    window.COMMON.common_IncludePageSuccess(htmlElement, pageInfo, callback, src);
                                }
                            }
                        }
                    } else {
                        if (pageInfo_type == "string") {
                            $qelement.html(includeString);
                            if (callback != undefined) {
                                if (typeof callback == "function") {
                                    callback(includeString);
                                }
                            }
                        } else if (pageInfo_type == "object") {
                            if (callback != undefined) {
                                if (typeof callback == "function") {
                                    window.COMMON.common_IncludePageSuccess(htmlElement, pageInfo, callback, includeString);
                                }
                            }
                        }
                    }
                }, "text");
            }else{
                window.HTTP.addRequestFileQueue(function(data){
                    var src = decodeURIComponent(data);
                    var includeString = "";
                    $($.parseHTML(src)).find("#content").addBack().each(function() {
                        if ("content" == $(this).attr("id")) {
                            includeString = $(this).html().toString();
                        }
                    });
                    
                    if (includeString == undefined || includeString == null
                            || includeString == "") {
                        if (pageInfo_type == "string") {
                            $qelement.html(window.SPA_COMMON.changeVar(src));
                            kbstar.DataBinder.quicsDataBindingWithInclude($qelement);
                            if (callback != undefined) {
                                if (typeof callback == "function") {
                                    callback(window.SPA_COMMON.changeVar(src));
                                }
                            }
                        } else if (pageInfo_type == "object") {
                            if (callback != undefined) {
                                if (typeof callback == "function") {
                                    window.COMMON.common_IncludePageWithDataBindingSuccess(htmlElement, pageInfo, callback, src);
                                }
                            }
                        }
                    } else {
                        if (pageInfo_type == "string") {
                            $qelement.html(includeString);
                            kbstar.DataBinder.quicsDataBindingWithInclude($qelement);
                            if (callback != undefined) {
                                if (typeof callback == "function") {
                                    callback(includeString);
                                }
                            }
                        } else if (pageInfo_type == "object") {
                            if (callback != undefined) {
                                if (typeof callback == "function") {
                                    window.COMMON.common_IncludePageWithDataBindingSuccess(htmlElement, pageInfo, callback, includeString);
                                }
                            }
                        }
                    }
                    if(iscroll) iscroll.refresh();
                }, function(data){
                    alert("약관파일을 가져오지 못했습니다.\n다시 시도해 주세요.");
                    if (device.devicetype == "tablet") {
                        window.configManager.moveToBankHome();
                    } else {
                        window.navi.goBackWithCount();
                    }
                }, "file://"+use_pageInfo, "GET");
            }
        } catch (e) {
            kbstar.alert("quicsIncludePage error : " + e);
        }
    };

    /**
    * page Include SuccessCallback
    */
    COMMON.prototype.common_IncludePageWithDataBindingSuccess = function(htmlElement, pageInfo, callback, text) {
        htmlElement[0].html(text);
        kbstar.DataBinder.quicsDataBindingWithInclude($qelement);
        var temp_pageInfo = pageInfo.splice(1, pageInfo.length);
        var temp_htmlElement = htmlElement.splice(1, htmlElement.length);
        if (temp_pageInfo.length == 0) {
            window.uicontrols.showLoading(false, false);
            callback();
        } else {
            window.COMMON.quicsIncludePage(temp_htmlElement, temp_pageInfo, callback);
        }
    };

    kbstar.addConstructor(function() {
        window.COMMON = new COMMON();
    });
}

if (!kbstar.hasResource("device")) {
    kbstar.addResource("device");
    if ("android" == window.COMMON.getUserAgent() || "ios" == window.COMMON.getUserAgent()) {
        var Device = function() {
            this.platform = '';
            this.version = '';
            this.name = '';
            this.phonegap = '';
            this.uuid = '';
            this.devicetype = '';
            this.servermode = '';
            this.tabbarHeight = 0;
            this.starbank_domain = '';
            this.mobileweb_domain = '';
            this.model = '';
            this.targetLoginLevel = '';
            this.appVersion = '';
            this.isVoiceOverRunning = false;
        };
        
        Device.prototype.setDeviceInfo = function(deviceInfo){
            try {
                this.platform = deviceInfo.platform;
                this.version = deviceInfo.version;
                this.name = deviceInfo.name;
                this.phonegap = deviceInfo.gap;
                this.uuid = deviceInfo.uuid;
                this.devicetype = deviceInfo.devicetype;
                this.servermode = deviceInfo.servermode;
                this.tabbarHeight = deviceInfo.tabbarHeight;
                this.starbank_domain = typeof deviceInfo.starbank_domain == 'undefined' ? "https://mnbank.kbstar.com" : deviceInfo.starbank_domain;
                this.mobileweb_domain = typeof deviceInfo.mobileweb_domain == 'undefined' ? "https://obank.kbstar.com" : deviceInfo.mobileweb_domain;;
                this.model = deviceInfo.model;
                this.targetLoginLevel = typeof deviceInfo.mobileweb_domain == 'undefined' ? "" : deviceInfo.targetLoginLevel;
                this.appVersion = deviceInfo.appVersion;
                this.isVoiceOverRunning = typeof deviceInfo.isVoiceOverRunning == 'undefined' ? false : deviceInfo.isVoiceOverRunning;
            } catch (e) {
            }
            this.available = kbstar.available = this.uuid != null;
        };
        
        kbstar.addConstructor(function() {
            navigator.device = window.device = new Device();
        });
    }else{
        // this represents the mobile device, and provides properties for inspecting
        // the model, version, UUID of the phone, etc. 
        // @constructor
        var Device = function() {
            this.available = kbstar.available;
            this.platform = null;
            this.version = null;
            this.name = null;
            this.gap = null;
            this.uuid = null;
            this.devicetype = null;
            this.servermode = null;
            this.starbank_domain = '';
            this.mobileweb_domain = '';
            this.model = '';
            this.targetLoginLevel = '';
            this.appVersion = '';
            this.isVoiceOverRunning = false;
            try {
                if (window.DroidGap) {
                    this.available = true;
                    this.uuid = window.DroidGap.getUuid();
                    this.version = window.DroidGap.getOSVersion();
                    this.gapVersion = window.DroidGap.getVersion();
                    this.platform = window.DroidGap.getPlatform();
                    this.name = window.DroidGap.getProductName();
                    this.devicetype = window.DroidGap.devicetype();
                    this.servermode = window.DroidGap.servermode();
                    this.starbank_domain =  window.DroidGap.starbank_domain();
                    this.mobileweb_domain =  window.DroidGap.mobileweb_domain();
                    this.model = window.DroidGap.getModel();
                    this.targetLoginLevel = window.DroidGap.targetLoginLevel();
                    this.appVersion = window.DroidGap.appVersion();
                    this.isVoiceOverRunning = window.DroidGap.isVoiceOverRunning();
                }
            } catch (e) {
                this.available = false;
            }
        };
    
        kbstar.addConstructor(function() {
            navigator.device = window.device = new Device();
            window.device.available = true;
            window.device.uuid = "";
            window.device.version = "2.0";
            window.device.platform = "Orchestra Simulator";
            window.device.name = "Orchestra";
            window.device.devicetype = "web";
            window.device.servermode = "test";
            window.device.starbank_domain = "https://zmnbank.kbstar.com";    // zmnbank.kbstar.com  zmbank.kbstar.com
            window.device.mobileweb_domain = "https://zobank.kbstar.com";   // zobank.kbstar.com
            window.device.model = "";
            window.device.targetLoginLevel = "";
            window.device.appVersion = "";
            window.device.isVoiceOverRunning = false;
        });
    }
};

if (!kbstar.hasResource("geolocation")) {
    kbstar.addResource("geolocation");

    /**
     * This class provides access to device GPS data.
     * 
     * @constructor
     */
    var Geolocation = function() {
        // The last known GPS position.
        this.lastPosition = null;
        this.listener = null;
        this.timeoutTimerId = 0;

    };

    /**
     * Asynchronously aquires the current position.
     * 
     * @param {Function}
     *            successCallback The function to call when the position
     *            data is available
     * @param {Function}
     *            errorCallback The function to call when there is an error
     *            getting the position data.
     * @param {PositionOptions}
     *            options The options for getting the position data such as
     *            timeout. PositionOptions.forcePrompt:Bool default false, -
     *            tells iPhone to prompt the user to turn on location
     *            services. - may cause your app to exit while the user is
     *            sent to the Settings app
     *            PositionOptions.distanceFilter:double aka Number - used to
     *            represent a distance in meters. PositionOptions {
     *            desiredAccuracy:Number - a distance in meters < 10 = best
     *            accuracy ( Default value ) < 100 = Nearest Ten Meters <
     *            1000 = Nearest Hundred Meters < 3000 = Accuracy Kilometers
     *            3000+ = Accuracy 3 Kilometers
     * 
     * forcePrompt:Boolean default false ( iPhone Only! ) - tells iPhone to
     * prompt the user to turn on location services. - may cause your app to
     * exit while the user is sent to the Settings app
     * 
     * distanceFilter:Number - The minimum distance (measured in meters) a
     * device must move laterally before an update event is generated. -
     * measured relative to the previously delivered location - default
     * value: null ( all movements will be reported )
     *  }
     * 
     */
    Geolocation.prototype.getCurrentPosition = function(callbackFunc, errorCallback, options) {
        var win = callbackFunc;
        if (!win || typeof (win) != 'function') {
            win = function(position) {
            };
        }

        // create an always valid local error callback
        var fail = errorCallback;
        if (!fail || typeof (fail) != 'function') {
            fail = function(positionError) {
            };
        }
        // set params to our default values
        var params = new PositionOptions();

        if (options) {
            if (options.maximumAge) {
                // special case here if we have a cached value that is
                // younger than maximumAge
                if (this.lastPosition) {
                    var now = new Date().getTime();
                    if (now - this.lastPosition.timestamp < options.maximumAge) {
                        win(this.lastPosition); // send cached position
                                                // immediately
                        return; // Note, execution stops here -jm
                    }
                }
                params.maximumAge = options.maximumAge;
            }
            if (options.enableHighAccuracy) {
                params.enableHighAccuracy = (options.enableHighAccuracy == true);
            }
            if (options.timeout) {
                params.timeout = options.timeout;
            }
        }

        this.listener = {
            "success" : win,
            "fail" : fail
        };

        kbstar.exec(navigator._geo.setLocation, navigator._geo.setError, "GeoLocation", "getCurrentLocation", { args : params });

        if ("ios" == window.COMMON.getUserAgent()){
            var onTimeout = function() {
                navigator._geo.setError(new PositionError(PositionError.TIMEOUT, "Geolocation Error: Timeout."));
            };
            this.timeoutTimerId = setTimeout(onTimeout, params.timeout);
        }
    };

    /**
     * Called by the geolocation framework when the current location is
     * found.
     * 
     * @param {PositionOptions}
     *            position The current position.
     */
    Geolocation.prototype.setLocation = function(position) {
        var _position = new Position(position.coords, position.timestamp);

        if (this.timeoutTimerId) {
            clearTimeout(this.timeoutTimerId);
            navigator._geo.timeoutTimerId = 0;
        }

        navigator._geo.lastError = null;
        navigator._geo.lastPosition = _position;

        if (navigator._geo.listener && typeof (navigator._geo.listener.success) == 'function') {
            navigator._geo.listener.success(_position);
        }
        navigator._geo.listener = null;
    };

    /**
     * Called by the geolocation framework when an error occurs while
     * looking up the current position.
     * 
     * @param {String}
     *            message The text of the error message.
     */
    Geolocation.prototype.setError = function(error) {
        var _error = new PositionError(error.code, error.message);

        if (navigator._geo.timeoutTimerId) {
            clearTimeout(navigator._geo.timeoutTimerId);
            navigator._geo.timeoutTimerId = 0;
        }

        navigator._geo.lastError = _error;
        // call error handlers directly
        if (navigator._geo.listener && typeof (navigator._geo.listener.fail) == 'function') {
            navigator._geo.listener.fail(_error);
        }
        navigator._geo.listener = null;
    };

    kbstar.addConstructor(function() {
        navigator._geo = new Geolocation();
    });
};
if (!kbstar.hasResource("position")) {
    kbstar.addResource("position");

    Position = function(coords, timestamp) {
        this.coords = Coordinates.cloneFrom(coords);
        this.timestamp = timestamp || new Date().getTime();
    };

    Position.prototype.equals = function(other) {
        return (this.coords && other && other.coords
                && this.coords.latitude == other.coords.latitude && this.coords.longitude == other.coords.longitude);
    };

    Position.prototype.clone = function() {
        return new Position(this.coords ? this.coords.clone() : null,
                this.timestamp ? this.timestamp : new Date().getTime());
    };

    Coordinates = function(lat, lng, alt, acc, head, vel, altAcc) {
        /**
         * The latitude of the position.
         */
        this.latitude = lat;
        /**
         * The longitude of the position,
         */
        this.longitude = lng;
        /**
         * The altitude of the position.
         */
        this.altitude = alt;
        /**
         * The accuracy of the position.
         */
        this.accuracy = acc;
        /**
         * The direction the device is moving at the position.
         */
        this.heading = head;
        /**
         * The velocity with which the device is moving at the position.
         */
        this.speed = vel;
        /**
         * The altitude accuracy of the position.
         */
        this.altitudeAccuracy = (altAcc != 'undefined') ? altAcc : null;
    };

    Coordinates.prototype.clone = function() {
        return new Coordinates(this.latitude, this.longitude,
                this.altitude, this.accuracy, this.heading, this.speed,
                this.altitudeAccuracy);
    };

    Coordinates.cloneFrom = function(obj) {
        return new Coordinates(obj.latitude, obj.longitude, obj.altitude,
                obj.accuracy, obj.heading, obj.speed, obj.altitudeAccuracy);
    };

    /**
     * This class specifies the options for requesting position data.
     * 
     * @constructor
     */
    PositionOptions = function(enableHighAccuracy, timeout, maximumAge) {
        /**
         * Specifies the desired position accuracy.
         */
        this.enableHighAccuracy = enableHighAccuracy || false;
        /**
         * The timeout after which if position data cannot be obtained the
         * errorCallback is called.
         */
        this.timeout = timeout || 10000;
        /**
         * The age of a cached position whose age is no greater than the
         * specified time in milliseconds.
         */
        this.maximumAge = maximumAge || 0;
    };

    /**
     * This class contains information about any GPS errors.
     * 
     * @constructor
     */
    PositionError = function(code, message) {
        this.code = code || 0;
        this.message = message || "";
    };

    PositionError.UNKNOWN_ERROR = 0;
    PositionError.PERMISSION_DENIED = 1;
    PositionError.POSITION_UNAVAILABLE = 2;
    PositionError.TIMEOUT = 3;
};
//-------------------------------------------------------------------------------------------
//Custom LocalStorage - start(android kitcat버전 이하에서 localstorage 지원하지 않는 문제로 사용함
//-------------------------------------------------------------------------------------------
if (!kbstar.hasResource("LocalStorage")) {
  kbstar.addResource("LocalStorage");
  var LocalStorage = {
      // Use this in javascript to request native code => call : function call(url, callback) {
      call : function call(actionname, key, value, callback) {    
          try {
              let hasCallback = callback && typeof callback == "function";

	            let callbackId="";
              if (hasCallback) {
	                callbackId = "LocalStorage" + kbstar.callbackId++;
	                kbstar.callbacks[callbackId] = {
	                    success : callback,
	                    fail : null
	                };
              }
  
              let data = {
                  "action": actionname,
                  "key": key,
                  "value": value
              }
              let naiveParam = {
                  cmd : "localStorage",
                  calbackId : callbackId,
                  body : {
                      params: data,
                  }
              }
              let jsonStr = JSON.stringify(naiveParam) || '';
              let urlEncodeStr = encodeURIComponent(jsonStr);
              let base64Str = window.btoa(urlEncodeStr);

              if ("android" == window.COMMON.getUserAgent()) {		// android 호출
                  window.kbAppBridge.postMessage(base64Str);
              } else if("ios" == window.COMMON.getUserAgent()) {	    // ios 호출
                  window.webkit.messageHandlers.kbAppBridge.postMessage(base64Str);
              } else {
              
              }
          } catch (e) {
              kbstar.alert("LocalStorage " + actionname + " Call error : " + e);
          }
      },      
      // localStorage interfaces implement
      setItem : function setItem(key, value, callback) {
      	if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
              localStorage.setItem(key, value);
          } else {
              LocalStorage.call("setItem", key, value, callback);
          }
      },
      removeItem : function removeItem(key, callback) {
      	if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
              localStorage.removeItem(key);
          } else {
              LocalStorage.call("removeItem", key, "", callback);
          }
      },
      clear : function clear() {
      	if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
              localStorage.clear();
          } else {
              LocalStorage.call("clear", "", "", callback);
          }
      },
      getItem : function getItem(key, callback) {
      	if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
              if (callback != undefined)
                  callback(localStorage.getItem(key));
          } else {
              LocalStorage.call("getItem", key, "", callback);
          }
      },
      length : function length(callback) {
      	if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
              if (callback != undefined)
                  callback(localStorage.length);
          } else {
              LocalStorage.call("length", "", "", callback);
          }
      },
      key : function key(index, callback) {
      	if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
              if (callback != undefined)
                  callback(localStorage.key(index));
          } else {
              LocalStorage.call("key", index, "", callback);
          }
      }
  };
  kbstar.addConstructor(function() {
      window.LocalStorage = LocalStorage;
  });
};

/**
 * HTTP - 통신처리의 기능
 * 
 * @class 통신처리
 * @author FINGER Inc.
 * @version 1.0
 * @since 2011.10.13
 **/
if (!kbstar.hasResource("HTTP")) {
    kbstar.addResource("HTTP");

    var HTTP = function() {
        this.requestQueue=[];
        this.commitCallback={};
    };

    HTTP.prototype.addQueue = function(targetURL){
        this.requestQueue.push(targetURL);
    };
    
    /* 사용안함 : 2021.07.16
    HTTP.prototype.addRequestQActionQueue = function(url, param, successCallback, failCallback, unbind, loadingFlag, noreturn, fileInclude, loadingFlag_false) {
        try {
            if (url.indexOf("file://") == -1) {
                url = kbstarCommon._DOMAIN + url;
            }
            var params = "";
            if (typeof param == 'object') {
                window.COMMON.recursion(param, "string");
            }
            params = kbstar.temp_string || param;
            kbstar.temp_string = "";

            var _params = {
                url : url,
                method : "POST",
                params : params,
                division : "divisioin",
                bShowProgressFlag : ((typeof loadingFlag) == "undefined") ? true : ""+loadingFlag
            };
            //var targetURL = window.COMMON.makeSendMethodRequestURL(successCallback, failCallback, "HTTP", "sendRequestTo", _params);
            //this.requestQueue.push(targetURL);
            kbstar.exec(successCallback, failCallback, "HTTP", "sendRequestTo", _params);          
        } catch (e) {
            kbstar.alert("addRequestQActionQueue Error : " + e);
        }
    };
    */
    
    HTTP.prototype.addRequestFileQueue = function(successCallback, failCallback, url, method) {
        var _params = {
            url : url,
            method : method
        };
        //var targetURL = window.COMMON.makeSendMethodRequestURL(successCallback, failCallback, "HTTP", "sendRequestTo", _params);
        //this.requestQueue.push(targetURL);
        kbstar.exec(successCallback, failCallback, "HTTP", "sendRequestTo", _params);
    };
    
    HTTP.prototype.requestTagTemplate = function(successCallback, fileName){
        if(device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative() || device.platform.match(/browser/)){
            var href = location.href;
            var templatePath = '';
            if(href.indexOf("/app/") > -1) {
                templatePath = href.substring(0, href.indexOf("/app/")) + "/app/html/caq/template/";
            } else {
                // 해당 URL 수정필요(?)
                templatePath = "/mnbank/app/html/caq/template/";
            }
            $.get(templatePath + "" + fileName, function(src) {
                successCallback(src);
            },"text");   
        }else{
            var _params = {
                url : 'file://' + fileName,
                method : 'GET'
            };
            kbstar.exec(successCallback, null, "HTTP", "sendRequestTo", _params);
        }
    };
    
    HTTP.prototype.commitRequestQueue = function(commitRequestQueueCallback){
        try{
            if(this.requestQueue.length == 0){
                if(typeof commitRequestQueueCallback == 'function'){
                    commitRequestQueueCallback();
                }
                return;
            }

            window.HTTP.commitCallback = (typeof commitRequestQueueCallback == 'function') ? commitRequestQueueCallback : function(){};
            queueSuccessCallback = function(){
                window.HTTP.commitCallback();
            };
        
            var _params = {
                method : "GET", 
                params : JSON.stringify(this.requestQueue)
            };

            kbstar.exec(queueSuccessCallback, null, "HTTP", "requestQueue", _params);
            this.requestQueue=[];
        }catch(e){
            kbstar.alert('HTTP.prototype.commitRequestQueue exception = ' + e);
        }
    };
    
    /**
     * HTTP 통신 수행하는 기능
     * 
     * @param {Function}
     *            successCallback 에러코드에 상관없이 통신이 완료됐을 때의 callback function
     * @param {Function}
     *            failCallback 통신이 불가능할 때의 callback function
     * @param {string}
     *            url URL
     * @param {string}
     *            method GET, POST, DELETE, PUT 중 하나
     * @param {Object}
     *            body GET의 경우 무시
     * @param {string}
     *            division body의 타입이 String의 경우 1, Data의 경우 무시
     * @param {Boolean}
     *            bShowProgressFlag ProgressBar를 보여줄지 여부 - true:보임(기본), false:안보임
     **/
     //use
    HTTP.prototype.sendRequest = function(successCallback, failCallback, url, method, body, division, bShowProgressFlag) {
        body = window.COMMON.keypadChk(body); 
//        kbstar.alert("kbstar.HTTP.prototype.sendRequest URL :"+url);
        if(device.platform.match(/Mobile Web/)) {
            alert("Native 기능입니다.");
        }else if(device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative() || device.platform.match(/browser/)){
            window.SPA.loadingLayerAdd();
            $.ajax({
                type: method, // method
                url: url, //url
                traditional: true,
                contentType: 'application/x-www-form-urlencoded;  charset=utf-8',
                data: body, // body
                timeout: 180000,
                success: function(data) {
                    var _tempJsonData = "";
                    var returnData;
                    if(data == undefined || data == "" || data == null) {
                        _tempJsonData = "";
                        returnData = {"data":_tempJsonData};
                    } else {
                        if(kbstar.connect.fileInclude == true){
                            returnData = data;
                            if(typeof kbstar.connect.successCallback == "function"){
                                kbstar.connect.successCallback(returnData);
                            };
                            return false;
                        }else{
                            if(typeof data == 'object') {
                                _tempJsonData = data;
                            } else {
                                _tempJsonData = JSON.parse(data);
                            }
                            returnData = {"data":_tempJsonData};
                        }
                    }
                    kbstar.connect.commonSuccess(returnData);
                    window.SPA.loadingLayerRemove();
                } ,
                error: function(jqXHR, textStatus, errorThrown) {
                    kbstar.connect.commonFail(jqXHR, textStatus, errorThrown);
                    window.SPA.loadingLayerRemove();
                }
            });    
        }else{
            if(url.indexOf("file://") == -1){
                url = kbstarCommon._DOMAIN + url;
            }
            var params = "";
            if(typeof body == 'object') {
                window.COMMON.recursion(body,"string");
            }
            params = kbstar.temp_string || body;
            kbstar.temp_string = "";
            var _params = {
                url : url, 
                method : method, 
                params : params, 
                division : division,
                bShowProgressFlag : ((typeof bShowProgressFlag) == "undefined") ? true : bShowProgressFlag
            };

            kbstar.exec(successCallback, failCallback, "HTTP", "sendRequestTo", _params);
        }
    };
    
    /**
     * HTTP 통신 수행하는 기능
     * 
     * @param {Function}
     *            successCallback 에러코드에 상관없이 통신이 완료됐을 때의 callback function
     * @param {Function}
     *            failCallback 통신이 불가능할 때의 callback function
     * @param {string}
     *            url URL
     * @param {string}
     *            method GET, POST, DELETE, PUT 중 하나
     * @param {Object}
     *            body GET의 경우 무시
     * @param {string}
     *            division body의 타입이 String의 경우 1, Data의 경우 무시
     * @param {Boolean}
     *            bShowProgressFlag ProgressBar를 보여줄지 여부 - true:보임(기본), false:안보임
     **/
     //use
    HTTP.prototype.asyncSendRequest = function(successCallback, failCallback, url, method, body, division, tempFileInclude, bShowProgressFlag) {
        body = window.COMMON.keypadChk(body); 

        if(device.platform.match(/Mobile Web/)) {
            alert("Native 기능입니다.");
        }else if(device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative() || device.platform.match(/browser/)){
            //window.SPA.loadingLayerAdd();
            $.ajax({
                type: method, // method
                url: url, //url
                contentType: 'application/x-www-form-urlencoded;  charset=utf-8',
                data: body, // body
                timeout: 180000,
                success: function(data) {
                    var _tempJsonData = "";
                    var returnData;
                    if(data == undefined || data == "" || data == null) {
                        _tempJsonData = "";
                        returnData = {"data":_tempJsonData};
                    } else {
                        if(tempFileInclude == true){
                            returnData = data;
                            if(typeof successCallback == "function"){
                                successCallback(returnData);
                            };
                            return false;
                        }else{
                            if(typeof data == 'object') {
                                _tempJsonData = data;
                            } else {
                                _tempJsonData = JSON.parse(data);
                            }
                            returnData = {"data":_tempJsonData};
                        }
                    }
                    successCallback(returnData);
                } ,
                error: function(jqXHR, textStatus, errorThrown) {
                	failCallback(jqXHR, textStatus, errorThrown);
                }
            });    
        }else{
            if(url.indexOf("file://") == -1){
                url = kbstarCommon._DOMAIN + url;
            }
            var params = "";
            if(typeof body == 'object') {
                window.COMMON.recursion(body,"string");
            }
            params = kbstar.temp_string || body;
            kbstar.temp_string = "";
            var _params = {
                url : url, 
                method : method, 
                params : params, 
                division : division,
                bShowProgressFlag : ((typeof bShowProgressFlag) == "undefined") ? true : bShowProgressFlag
            };

            kbstar.exec(successCallback, failCallback, "HTTP", "sendRequestTo", _params);
        }
    };
    
    kbstar.addConstructor(function() {
        navigator.HTTP = window.HTTP = new HTTP();
    });
}

// -------------------------------------------------------------------------------------------
// Native API - start
// -------------------------------------------------------------------------------------------
/**
 * Naivigator - 화면 이동 및 앱 종료의 기능
 * 
 * @class 화면 이동에 관한 기능 및 화면 이동에 에니메이션 설정, 앱 종료의 기능
 * @author FINGER Inc.
 * @version 1.0
 * @since 2011.09.01
 */
if (!kbstar.hasResource("navi")) {
    kbstar.addResource("navi");
    var navi = function() {
    };  

    /**
     * 이전 화면으로 돌아가는 기능
     * 
     * @param {Object}
     *            ret 이전 페이지에 보낼 데이터
     * @param {String}
     * 			  bClearPageData 이전 pageData를 초기화 여부 (Y: 초기화, N: 안함)
     */
    navi.prototype.goBack = function(ret, bClearPageData) {
        if (typeof ret == 'object') {
            ret = JSON.stringify(ret);
        }
        if (bClearPageData == undefined) {
        	bClearPageData = "N";
        }
        if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
        	// 2021-06-23 신재현 현재 페이지의 onBack 호출 : 취소여부 확인 요청
        	if (window.SPA_COMMON.callbackWithSPA('onBack', ret)) {
        		window.SPA_COMMON.historyGoback();
        	}
        } else {
        	// 2021-06-23 신재현 현재 페이지의 onBack 호출 : 취소여부 확인 요청
        	if (window.SPA_COMMON.callbackWithSPA('onBack', ret)) {
                kbstar.exec(null, null, "Navigator", "goBack", { ret : ret, bClearPageData : bClearPageData });
        	}
        }
    };
    /**
     * 정해진 페이지 만큼 이전 화면으로 돌아가는 기능
     * 
     * @param {int}
     *            count 돌아갈 이전 페이지 수
     * @param {Object}
     *            ret 돌아갈 이전 페이지에 보낼 데이터
     * @param {String}
     * 			  bClearPageData 이전 pageData를 초기화 여부 (Y: 초기화, N: 안함)
     */
    navi.prototype.goBackWithCount = function(count, ret, bClearPageData) {
        if (typeof ret == 'object') {
            ret = JSON.stringify(ret);
        }
        if (bClearPageData == undefined) {
        	bClearPageData = "N";
        }
        if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
        	// 2021-06-23 신재현 현재 페이지의 onBack 호출 : 취소여부 확인 요청
        	if (window.SPA_COMMON.callbackWithSPA('onBack', ret)) {
        		window.SPA_COMMON.historyGoback(count * 2);
        	}
        } else {
        	// 2021-06-23 신재현 현재 페이지의 onBack 호출 : 취소여부 확인 요청
        	if (window.SPA_COMMON.callbackWithSPA('onBack', ret)) {
        		kbstar.exec(null, null, "Navigator", "goBackWithCount", { count : count, ret : ret, bClearPageData : bClearPageData });
        	}
        }
    };
    
    /**
     * 페이지 이동시 변경된 페이지로 변경하는 함수
     * 
     * @param {string}
     *            url 이동할 페이지의 경로
     * @return {string}
     *            return 변경된 페이지 경로
     */
    navi.prototype.getRedirectPageURL = async function(url) {
    	var find = "page=";
    	var sp = url.indexOf(find);
    	if (sp > -1) {
        	var mapTable = {
        			//"C038921":"C053213", // [보안카드 이용안내]
        			//"C038922":"C053214", // [Security Card Guide]
        			//"C038926":"C053221", // [스마트OTP입력]스마트OTP입력안내(팝)
        			//"C038928":"C053222", // [타행(기관)발급스마트OTP안내]타행스마트OTP입력안내(팝)
        			//"C037304":"C050562", // [자주쓰는계좌등록/삭제]자주쓰는계좌등록
        			//"C038742":"C052899", // [810-683]자주쓰는계좌등록
        			//"C038830":"C053016", // [자주쓰는입금계좌]자주쓰는입금계좌(팝)
        			//"C038694":"C052825", // [810-683]자주쓰는입금계좌
        			//"C037297":"C050554", // [입금계좌등록/삭제]입금계좌등록
        			//"C038835":"C053020", // [등록된입금계좌]등록된입금계좌(팝)
        			//"C038697":"C052828", // [164-006]등록된입금계좌
        			//"C039306":"C053029", // [입금은행]입금은행선택
        			//"C037370":"C050714", // [인증폰 등록]
        			//"C049294":"C052360", // [KB든든간편인증 오류안내] 신규 가입
        			//"C056754":"C056752",  // [KB굿잡정회원전환]
        			//"C038919":"C053211"  // [OTP이용안내]만료일
        			"C052215":"D001024", // [인증서발급/재발급]
        			"C065957":"D003616", // [신탁영상통화  LMS]
        			"C061972":"D001099", // [UKFK0167 에러발생시 링크] 보안카드 비밀번호 오류해제 
        			"C050750":"D001206", // [UCWB0118 에러발생시 링크] 안심서비스조회/변경
        			"C054784":"D005187" // [실명인증 영상통화 LMS]
            };
               
        	var key = url.substring(sp + find.length);
        	var ep = key.indexOf("&");
            
            if (ep > -1) {
        		key = key.substring(0, ep);
            }
            
            var value = mapTable[key];
            var tobePageId = undefined;

            if (value != undefined) {
                tobePageId = value;
        	} else {
                if(key.startsWith('C')) {
                    tobePageId = await this.getAjaxRedirectPageURL(key);
        		}
            }
            if(tobePageId) {
                url = url.replace(key, tobePageId);
            }
    	}
    	return url;
    };

    
    /**
     * 페이지 이동시 변경된 페이지로 변경하는 함수
     * 
     * @param {string}
     *            url 이동할 페이지의 경로
     * @return {string} + kbstarCommon.asisPageInfo
     *            return 변경된 페이지 경로
     */
    navi.prototype.getAjaxRedirectPageURL = async function(url) {
    	var param = {"OLD_PAGE" : url};
    	var resUrl = url;

        var data = await $.ajax({
            type: 'post', // method
            url: kbstarCommon._DOMAIN + '/mquics?QAction=1053981&page='+ kbstarCommon.asisPageInfo, //url
            traditional: true,
            contentType: 'application/x-www-form-urlencoded;  charset=utf-8',
            data: param, // body
            timeout: 180000,
            success: function(data) {
                return data;
            } ,
            error: function(jqXHR, textStatus, errorThrown) {
                return undefined;
            }
        });        

        if(data) {
            resUrl = data.msg.servicedata.pagecode;
        }
        return resUrl;
    };
    
    /**
     * 다른 페이지로 이동하는 기능
     * 
     * @param {String}   url 이동할 페이지의 경로(ex. /mquics?page={pageID})
     * @param {JSON}     args 이동할 페이지에 보낼 데이터 Json Objec
     * @param {Function} onBack 이전 페이지에 대한 CallBankFunction
     * @param {JSON}     tablet_param {"menuMove":"Y"} or {"menuMove":"N"} 테블릿 대메뉴가 바뀌는 화면이동일 경우 메뉴페이지를 변경할지 여부
     * @param {String}   method post or get 웹테스트 버젼에서만 사용
     * @param {true/false(0/1)}  isAnimation native에게 넘길 animation 여부 : 0 - 끄기, 1 - 켜기, true/false
     */
    navi.prototype.navigate = async function(url, args, onBack, tablet_param, method, isAnimation) {
        url = await this.getRedirectPageURL(url);
        var compareParams = (typeof args == "object") ? JSON.stringify(args) : args;
        if(url == kbstar.doubleSchemeReq.navigateUrl
                && compareParams == kbstar.doubleSchemeReq.params
                && Number(new Date().getTime()) - Number(kbstar.doubleSchemeReq.actionTime) < 500){
            kbstar.doubleSchemeFlag = true;
        }
        kbstar.doubleSchemeReq.navigateUrl = url;
        kbstar.doubleSchemeReq.params = (typeof params == "object") ? JSON.stringify(args) : args;
        kbstar.doubleSchemeReq.actionTime = new Date().getTime();   

        if(!kbstar.doubleSchemeFlag){
            args = window.COMMON.keypadChk(args);     
            //애니메이션 처리
            var strAnimation;
            if(isAnimation == undefined || isAnimation == null || isAnimation != 0) { 
                strAnimation = "1";
            } else {
                strAnimation = "0";
            }    

            var oriParam = {};     

            // $("input[type!='password'][name],select").each(function(index){
            $("input[type!='hidden'][type!='password'][name],select,textarea[name]").each(function(index){
                var element = $(this);
                var elementType = element.attr('type');   
                if(elementType == "radio"){
                    if(element.prop("checked")){
                      oriParam[element.attr('name')] = element.val();
                    }
                }
                // else if(elementType == "checkbox") {
                //     if(element.prop("checked")){
                //         oriParam[element.attr('name')] = element.val();
                //     }                    
                // }
                else{
                    oriParam[element.attr('name')] = element.val();
                }
            });
            if (url.indexOf("?") > -1) {
                var urlParam = url.substring(url.indexOf("?") + 1);
                var obj = urlParam.split('&');
                var tmp = null;
                for ( var i = 0; i < obj.length; i++) {
                    if ($.trim(obj[i]) == '') {
                        continue;
                    } else {
                        tmp = obj[i].split('=');
                        if (tmp.length == 2) {
                            oriParam[tmp[0]] = tmp[1];
                        }
                    }
                }
            }
            // bottomSheet onGoback 처리를 위한 선택값 유지
            var selectBtns = [];
            Array.from(document.querySelectorAll('button.select_btn')).forEach(sel=>{
                let dataObj = Object.assign({}, $(sel).data());
                dataObj['id'] = sel.id;
                selectBtns.push(dataObj);
            });            
            oriParam['selectBtns'] = selectBtns;

            if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
                var _form = $("<form></form>");
        
                if (typeof args == 'object') {
                    window.COMMON.recursion(args, "form");
                }
                _form = kbstar.temp_form;
                kbstar.temp_form = $("<form></form>");
                if (url.indexOf("mquics?") > -1) {
                    if (url.indexOf("QCH") < 0) {
                        url = url + "&QCH=N";
                    }
                }
                // animation 추가하기
                if (typeof args == 'object') {
                    args.animation = strAnimation;
                } else {
                    args = args + "&animation=" + strAnimation;  
                }
                // 웹서비스를 호출하고 서버에서 받은 payLoad 데이터에 따라 window.SPA.loadPage 호출
                let pageId = url.split('?')[1].split('&')[0].split('=')[1];              
                window.SPA.goPage(pageId, args, undefined, false, false, oriParam);
            } else {

                if (typeof args != 'object') {
                    args = {};
                }
                    
                // TODO 저장할 input tag 확인필요
                //LocalStorage.setItem("_data", JSON.stringify(oriParam));   
                // 2021.06.23 신재현 메모리에 계속 누적 되므로 삭제함
                //LocalStorage.setItem(kbstarCommon.asisPageInfo + "_data", JSON.stringify(oriParam));          

                if (tablet_param != undefined) {
                    args["menuMove"] = tablet_param["menuMove"];
                } else {
                    args["menuMove"] = "Y";
                }          
                args["navigateFlag"] = "navigate";
               
                // 20210623 불필요한 String연산 제거
                //kbstar.submit(url, null, args, JSON.stringify(oriParam), strAnimation);            
                kbstar.submit(url, null, args, oriParam, strAnimation);
            }
        
            // 2021-06-23 신재현 붚필요한 코드 삭제 : 뒤로 오는 경우 현재 페이지의 onGoback()이 호출됨.
            //window.navi.onBack = function(ret) {
            //    if (onBack && typeof onBack == 'function') {
            //        onBack(ret);
            //    }
            //};
        }else{
            kbstar.doubleSchemeFlag = false;
        }
    };
    
    /**
     * 히스토리(스택)를 전체 제거 후 다음 페이지로 이동하는 기능
     * 
     * @param {String}   url 이동할 페이지의 경로(ex. /mquics?page={pageID})
     * @param {JSON}     args 이동할 페이지에 보낼 데이터 Json Objec
     * @param {Function} onBack 이전 페이지에 대한 CallBankFunction
     * @param {JSON}     tablet_param {"menuMove":"Y"} or {"menuMove":"N"} 테블릿 대메뉴가 바뀌는 화면이동일 경우 메뉴페이지를 변경할지 여부
     * @param {String}   method post or get 웹테스트 버젼에서만 사용
     * @param {true/false(0/1)}  isAnimation native에게 넘길 animation 여부 : 0 - 끄기, 1 - 켜기, true/false
     */
    navi.prototype.navigateWithInit = async function(url, args, onBack, tablet_param, method, isAnimation) {
    	url = await this.getRedirectPageURL(url);
        var compareParams = (typeof args == "object") ? JSON.stringify(args) : args;
        if(url == kbstar.doubleSchemeReq.navigateUrl
                && compareParams == kbstar.doubleSchemeReq.params
                && Number(new Date().getTime()) - Number(kbstar.doubleSchemeReq.actionTime) < 500){
            kbstar.doubleSchemeFlag = true;
        }
        kbstar.doubleSchemeReq.navigateUrl = url;
        kbstar.doubleSchemeReq.params = (typeof params == "object") ? JSON.stringify(args) : args;
        kbstar.doubleSchemeReq.actionTime = new Date().getTime();
        
        if(!kbstar.doubleSchemeFlag){
            args = window.COMMON.keypadChk(args);
            //애니메이션 처리
            var strAnimation;
            if(isAnimation == undefined || isAnimation == null || isAnimation != 0) { 
                strAnimation = "1";
            } else {
                strAnimation = "0";
            }
            if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
                var _form = $("<form></form>");
        
                if (typeof args == 'object') {
                    window.COMMON.recursion(args, "form");
                }
                _form = kbstar.temp_form;
                kbstar.temp_form = $("<form></form>");
                if (url.indexOf("mquics?") > -1) {
                    if (url.indexOf("QCH") < 0) {
                        url = url + "&QCH=N";
                    }
                }       
                // animation 추가하기
                if (typeof args == 'object') {
                    args.animation = strAnimation;
                } else {
                    args = args + "&animation=" + strAnimation;  
                }
                // 웹서비스를 호출하고 서버에서 받은 payLoad 데이터에 따라 window.SPA.loadPage 호출
                let pageId = url.split('?')[1].split('&')[0].split('=')[1];             
                window.SPA.goPage(pageId, args, undefined, false, true, {});
            } else {
                if (typeof args != 'object') {
                    args = {};
                }
                if (tablet_param != undefined) {
                    args["menuMove"] = tablet_param["menuMove"];
                } else {
                    args["menuMove"] = "Y";
                }
                args["navigateFlag"] = "navigateWithInit";
                
                kbstar.submit(url, method, args, null, strAnimation);
            }
        
            // 2021-06-23 신재현 붚필요한 코드 삭제 : 뒤로 오는 경우 현재 페이지의 onGoback()이 호출됨.
            //window.navi.onBack = function(ret) {
            //    if (onBack && typeof onBack == 'function') {
            //        onBack(ret);
            //    }
            //};
        }else{
            kbstar.doubleSchemeFlag = false;
        }
    };
    
    /**
     * 히스토리(스택)를 이전의 하나 제거 후 다음 페이지로 이동하는 기능 
     * @param {String}   url 이동할 페이지의 경로(ex. /mquics?page={pageID})
     * @param {JSON}     args 이동할 페이지에 보낼 데이터 Json Objec
     * @param {Function} onBack 이전 페이지에 대한 CallBankFunction
     * @param {JSON}     tablet_param {"menuMove":"Y"} or {"menuMove":"N"} 테블릿 대메뉴가 바뀌는 화면이동일 경우 메뉴페이지를 변경할지 여부
     * @param {String}   method post or get 웹테스트 버젼에서만 사용
     * @param {true/false(0/1)}  isAnimation native에게 넘길 animation 여부 : 0 - 끄기, 1 - 켜기, true/false
     */
    navi.prototype.navigateWithCurrPageHistoryRemove = async function(url, args, onBack, tablet_param, method, isAnimation) {
    	url = await this.getRedirectPageURL(url);
        args = window.COMMON.keypadChk(args);
        //애니메이션 처리
        var strAnimation;
        if(isAnimation == undefined || isAnimation == null || isAnimation != 0) { 
            strAnimation = "1";
        } else {
            strAnimation = "0";
        }
        if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
            var _form = $("<form></form>");
    
            if (typeof args == 'object') {
                window.COMMON.recursion(args, "form");
            }
            _form = kbstar.temp_form;
            kbstar.temp_form = $("<form></form>");
            if (url.indexOf("mquics?") > -1) {
                if (url.indexOf("QCH") < 0) {
                    url = url + "&QCH=N";
                }
            } 
            // animation 추가하기
            if (typeof args == 'object') {
                args.animation = strAnimation;
            } else {
                args = args + "&animation=" + strAnimation;  
            }
            // 웹서비스를 호출하고 서버에서 받은 payLoad 데이터에 따라 window.SPA.loadPage 호출
            let pageId = url.split('?')[1].split('&')[0].split('=')[1];  
            window.SPA.goPage(pageId, args, undefined, true, false, {});
        } else {
            if (typeof args != 'object') {
                args = {};
            }
            if (tablet_param != undefined) {
                args["menuMove"] = tablet_param["menuMove"];
            } else {
                args["menuMove"] = "Y";
            }
            
            args["navigateFlag"] = "navigateWithCurrPageHistoryRemove";

            kbstar.submit(url, method, args, null, strAnimation);
        }
    
        // 2021-06-23 신재현 붚필요한 코드 삭제 : 뒤로 오는 경우 현재 페이지의 onGoback()이 호출됨.
        //window.navi.onBack = function(ret) {
        //    if (onBack && typeof onBack == 'function') {
        //        $("#wrap").hide();
        //        $("#wrap").show();
        //        onBack(ret);
        //    }
        //};
    };
    
    /**
     * 오픈된 팝업을 닫은 후 다음 페이지로 이동하는 기능
     * @param {String}   url 이동할 페이지의 경로(ex. /mquics?page={pageID})
     * @param {JSON}     args 이동할 페이지에 보낼 데이터 Json Objec
     * @param {Function} onBack 이전 페이지에 대한 CallBankFunction
     * @param {JSON}     tablet_param {"menuMove":"Y"} or {"menuMove":"N"} 테블릿 대메뉴가 바뀌는 화면이동일 경우 메뉴페이지를 변경할지 여부
     * @param {String}   method post or get 웹테스트 버젼에서만 사용
     * @param {true/false(0/1)}  isAnimation native에서 넘길 animation 여부 : 0 - 끄기, 1 - 켜기, true/false
     */
    navi.prototype.navigateWithClose = async function(url, args, onBack, tablet_param, method, isAnimation) {
    	url = await this.getRedirectPageURL(url);
        args = window.COMMON.keypadChk(args);
        //애니메이션 처리
        var strAnimation;
        if(isAnimation == undefined || isAnimation == null || isAnimation != 0) { 
            strAnimation = "1";
        } else {
            strAnimation = "0";
        }
        if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
            var _form = $("<form></form>");
    
            if (typeof args == 'object') {
                window.COMMON.recursion(args, "form");
            }
            _form = kbstar.temp_form;
            kbstar.temp_form = $("<form></form>");
            if (url.indexOf("mquics?") > -1) {
                if (url.indexOf("QCH") < 0) {
                    url = url + "&QCH=N";
                }
            }
            // animation 추가하기
            if (typeof args == 'object') {
                args.animation = strAnimation;
            } else {
                args = args + "&animation=" + strAnimation;  
            }
            // 웹서비스를 호출하고 서버에서 받은 payLoad 데이터에 따라 window.SPA.loadPage 호출
            let pageId = url.split('?')[1].split('&')[0].split('=')[1];           
            window.SPA.goPage(pageId, args, undefined, false, false, {});
        } else {
            if (typeof args != 'object') {
                args = {};
            }       

            if (tablet_param != undefined) {
                args["menuMove"] = tablet_param["menuMove"];
            } else {
                args["menuMove"] = "Y";
            }
            
            args["navigateFlag"] = "navigateWithClose";

            kbstar.submit(url, method, args, null, strAnimation);
        }
    
        // 2021-06-23 신재현 붚필요한 코드 삭제 : 뒤로 오는 경우 현재 페이지의 onGoback()이 호출됨.
        //window.navi.onBack = function(ret) {
        //    if (onBack && typeof onBack == 'function') {
        //        $("#wrap").hide();
        //        $("#wrap").show();
        //        onBack(ret);
        //    }
        //};
    };
    
    /**
     * 오픈된 모든 팝업을 닫은 후 다음 페이지로 이동하는 기능
     * @param {String}   url 이동할 페이지의 경로(ex. /mquics?page={pageID})
     * @param {JSON}     args 이동할 페이지에 보낼 데이터 Json Objec
     * @param {Function} onBack 이전 페이지에 대한 CallBankFunction
     * @param {JSON}     tablet_param {"menuMove":"Y"} or {"menuMove":"N"} 테블릿 대메뉴가 바뀌는 화면이동일 경우 메뉴페이지를 변경할지 여부
     * @param {String}   method post or get 웹테스트 버젼에서만 사용
     * @param {true/false(0/1)}  isAnimation native에서 넘길 animation 여부 : 0 - 끄기, 1 - 켜기, true/false
     */
    navi.prototype.navigateWithAllClose = async function(url, args, onBack, tablet_param, method, isAnimation) {
    	url = await this.getRedirectPageURL(url);
        args = window.COMMON.keypadChk(args);
        //애니메이션 처리
        var strAnimation;
        if(isAnimation == undefined || isAnimation == null || isAnimation != 0) { 
            strAnimation = "1";
        } else {
            strAnimation = "0";
        }
        if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
            var _form = $("<form></form>");
    
            if (typeof args == 'object') {
                window.COMMON.recursion(args, "form");
            }
            _form = kbstar.temp_form;
            kbstar.temp_form = $("<form></form>");
            if (url.indexOf("mquics?") > -1) {
                if (url.indexOf("QCH") < 0) {
                    url = url + "&QCH=N";
                }
            }
            // animation 추가하기
            if (typeof args == 'object') {
                args.animation = strAnimation;
            } else {
                args = args + "&animation=" + strAnimation;  
            }
            // 웹서비스를 호출하고 서버에서 받은 payLoad 데이터에 따라 window.SPA.loadPage 호출
            let pageId = url.split('?')[1].split('&')[0].split('=')[1];           
            window.SPA.goPage(pageId, args, undefined, false, false, {});
        } else {
            if (typeof args != 'object') {
                args = {};
            }       

            if (tablet_param != undefined) {
                args["menuMove"] = tablet_param["menuMove"];
            } else {
                args["menuMove"] = "Y";
            }
            
            args["navigateFlag"] = "navigateWithAllClose";

            kbstar.submit(url, method, args, null, strAnimation);
        }
    
        // 2021-06-23 신재현 붚필요한 코드 삭제 : 뒤로 오는 경우 현재 페이지의 onGoback()이 호출됨.
        //window.navi.onBack = function(ret) {
        //    if (onBack && typeof onBack == 'function') {
        //        $("#wrap").hide();
        //        $("#wrap").show();
        //        onBack(ret);
        //    }
        //};
    };
    
    /**
     * 전체메뉴 보이기
     */
    navi.prototype.viewTotalMenu = function(url) {
    
    	if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
        } else {
        	var args = {};

            args["menuMove"] = "Y";
            args["navigateFlag"] = "viewTotalMenu";

            kbstar.submit(url, "POST", args);
        }
    };
    
    /**
     * 메뉴검색 보이기
     */
    navi.prototype.viewSearchMenu = function(url) {
    
    	if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
        } else {
        	var args = {};

            args["menuMove"] = "Y";
            args["navigateFlag"] = "viewTotalMenu";
            args["function"] = "search_Menu";
            
            kbstar.submit(url, "POST", args);
        }
    };
    /**
     * 디바이스 시작하기 아이폰만 적용
     */
    navi.prototype.onDevReady = function() {
    	if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
            window.COMMON.onLoading({});
        } else {
            kbstar.exec(null, null, "Navigator", "devReady");
        }
    };
    
    /**
     * 로그인후 홈화면에서 로딩이 끊겼다 도는 현상을 제어하기위한 아이폰 함수
     */
    navi.prototype.loadingComplete = function(param) {
        // Page 이동  완료시 호출
        if(!param) {
            param = null;
        }
        kbstar.exec(null, null, "Navigator", "loadingComplete", param);
        setTimeout(()=>{
        	// 페이지에 afterLoaingComplete 함수 호출 (페이지 로딩 완료 후 추가 Ajax 호출 용도)
            //window.SPA_COMMON.callbackWithSPA('afterLoadingComplete');
		}, 0);
    };
    
    
    /**
     * 화면 Histrory 개수 조회
     */
    navi.prototype.getHistoryCount = function(successCallback, failCallback) {
    	if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {

        } else {
            kbstar.exec(successCallback, failCallback, "Navigator", "getHistoryCount");
        }
    };
    
    navi.prototype.onParam = function(p, back, prev) {
        if(typeof onParam == 'function'){
            onParam(p, back, prev);
        }
    };
    
    navi.prototype.onGoBack = function() {
// 20210623 onGoBack 호출 안되어 변경    	
//        if (typeof onGoBack == 'function') {
//            onGoBack();
//        }
    	window.SPA_COMMON.callbackWithSPA('onGoback');  

    };
    
    /**
     * Histrory에서 뒤에서 시작되는 인덱스 조회
     */
    navi.prototype.getPageIndex = function(pageId, callback) {
        kbstar.exec(callback, null, "Navigator", "getPageIndex", { pageId : pageId });
    };
    
    kbstar.addConstructor(function() {
        navigator.navi = window.navi = new navi();
        
        document.addEventListener("backbutton", function() {
            window.navi.goBackWithCount('');
        }, false);
    });
    
}

/**
 * UI Control 네이티브 UI 컨트롤의 기능
 * 
 * @class 아이폰, 안드로이드 네이티브 UI 컨트롤
 * @author FINGER Inc.
 * @version 1.0
 * @since 2011.09.01
 */
if (!kbstar.hasResource("UIControls")) {
    kbstar.addResource("UIControls");
    var UIControls = function() {
        m_callbackGetBusyFlag: null; // getBusyFlag 요청을 중복 처리 하지 않기 위해 설정
    };
    
    /**
     * 로딩페이지의 기능
     * 
     * @param {boolean}
     *            loadingFlag 스위치 [true:보임, false: 숨김]
     * @param {boolean}
     *            bgLoadingFlag 스위치 [true:보임, false: 숨김]
     */
    UIControls.prototype.showLoading = function(loadingFlag, bgLoadingFlag) {
    	//kbstar.exec(null, null, "UIControls", "showLoading", { loadingFlag : loadingFlag, bgLoadingFlag : bgLoadingFlag });
    };

    /**
     * 통신후 프로그레스바를 닫을지 여부값 설정 
     * @param {boolean}
     *            bCloseProgressFlag 스위치 [true:닫기(기본), false: 유지]
     */
    UIControls.prototype.setCloseProgressFlag = function(bCloseProgressFlag) {
        if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative() ) {
            kbstarCommon.closeProgressFlag = bCloseProgressFlag;
        } else {
        	kbstarCommon.closeProgressFlag = bCloseProgressFlag;
            kbstar.exec(function(){}, function(){}, "UIControls", "setCloseProgressFlag", {"bCloseProgressFlag" : ""+bCloseProgressFlag});
        }
    };

    /**
     * Ajax 네트워크 프로그레스바를 보여줄지 여부값 설정 
     * @param {boolean}
     *            bShowProgressFlag 스위치 [true:보임(기본), false: 숨김]
     */
    /* 삭제 : 2021.07.06
    UIControls.prototype.setShowProgressFlag = function(bShowProgressFlag) {
        if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative() ) {
            kbstarCommon.showProgressFlag = bShowProgressFlag;
        } else {
            kbstar.exec(function(){}, function(){}, "UIControls", "setShowProgressFlag", {"bShowProgressFlag" : ""+bShowProgressFlag});
        }
    };
    */


    /**
      * Ajax 네트워크 프로그레스바 보이기 
      * @param {fuction}
      *            successCallback(void) 프로그레스바를 띄운 후 호출되는 callback function
      * @param {boolean}
      *            bShowProgress [true:보임, false: 숨김]
      */
     UIControls.prototype.showProgress = function(successCallback, bShowProgress) {
         if (!device.platform.match(/Orchestra Simulator/)) {
             kbstar.exec(successCallback, function(){}, "UIControls", "showProgress", {"bShowProgress" : ""+bShowProgress});
         }
     };
    
     /**
      * 중복 거래 방지를 위한 플래그 값 얻기 
      * param function successCallback(flag)
      */
     UIControls.prototype.getBusyFlag = function(successCallback) {
         if (!device.platform.match(/Orchestra Simulator/)) {
       	     if (this.m_callbackGetBusyFlag == null) {
        		 this.m_callbackGetBusyFlag = successCallback; // 중복 요청을 막기 위해 콜백 함수를 저장한다.
                 kbstar.exec(function(flag) {
                     if (window.uicontrols.m_callbackGetBusyFlag && typeof window.uicontrols.m_callbackGetBusyFlag == 'function') {
                    	 window.uicontrols.m_callbackGetBusyFlag(flag);
                     }
                     window.uicontrols.m_callbackGetBusyFlag = null; // 다음 요청을 위해 초기화 한다.
                 }, function(){
                	 alert("getBusyFlag Fail!");
                     window.uicontrols.m_callbackGetBusyFlag = null; // 다음 요청을 위해 초기화 한다.
                 }, "UIControls", "getBusyFlag", {});
        	 }
         }
     };
    
     /**
      * 중복 거래 방지 기능을 사용한 거래 처리 
      * param function process(void)
      */
     UIControls.prototype.singleTransaction = function(process) {
      window.uicontrols.getBusyFlag(function(flag){ // 중복 요청에 대한 방지 코드 필요
       if (flag != "true") {
    	window.uicontrols.setCloseProgressFlag(false);
        window.uicontrols.showProgress(process, true);// 클릭 방지를 위해 프로그레스바 UI를 생성 후 콜백에서 전문을 요청
       }
      });
     };

     /**
      * 프로그레스 문구 설정
      * param {String} text 표시할 문구
      */
     UIControls.prototype.setProgressText = function(text) {
    	 if(!device.platform.match(/Orchestra Simulator/)) {
     	 	kbstar.exec(null, null, "UIControls", "setProgressText", {"text" : ""+text});
    	 }
     };
     
    /**
     * Ajax 네트워크 요청시 입력중인 키패드를 보여줄지 여부값 설정 
     * @param {boolean}
     *            bShowKeypadFlag 스위치 [true:보임, false: 숨김(기본)]
     */
    UIControls.prototype.setShowKeypadFlag = function(bShowKeypadFlag) {
    	kbstar.exec(function(){}, function(){}, "UIControls", "setShowKeypadFlag", {"bShowKeypadFlag" : ""+bShowKeypadFlag});
    };
    

    /**
     * 금액입력 바텀시트 기능 호출 
     * @param tag {String} "send" - 바텀시트 식별자 ? default : Null
     * @param title {String} "이체금액" ? 화면상단에 보여질 문구 defult = ""
     * @param confirmTitle {String} "보내기" ? 하단 확인버튼 title ? default : "확인"
     * @param buttonArray {Array<json>} "이체금액" ? [{title:"만원",value:"10000"},{title:"오천원",value:"5000"},{title:"천원",value:"1000"}, {title:"전액",value:"121241",clear:"true"}] ? 금액버튼(만원, 오천원, 천원 …)  최대 5개 ? default : 버튼영역 숨김 -clear = true 로 넣어줄경우 입력필드를 지우고 값을 적용
     * @param holder {String} "금액" - 입력전에 보여줄 text ? default : 인풋영역 숨김
     * @param changeFunc {String} "changeValue" ? 변경되는 값을 받을 script function 이름값이 변경될시 응답값과 tag를 스크립트 호출을 통하여 호출
     * @param value	{String} "125000" ? 화면에 기본으로 셋팅될 value  ? default : ""
     * @param maxLen {String} "10" - 최대 입력 길이("0" 길이제한없음) ? default: "0"
     * @param unitText {String} "원" - 단위 (만원, 원) ? default: "원"
     */
    UIControls.prototype.showAmountBottomSheet = function(successCallback, tag, title, confirmTitle, buttonArray, holder, changeFunc, value, maxLen, unitText) {
    	let params = {
    		"tag" : tag,
    		"title" : title,
    		"confirmTitle" : confirmTitle,
    		"buttonArray" : buttonArray,
    		"holder" : holder,
    		"changeFunc" : changeFunc,
    		"value" : value,
    		"maxLen": maxLen,
    		"unitText" : unitText || "원"
    	};
    	
    	kbstar.exec(successCallback, function(){}, "UIControls", "showAmountBottomSheet", params);
    };
    
    /**
     * 숫자입력 바텀시트 기능 호출 
     * @param tag {String} "send" - 바텀시트 식별자 ? default : Null
     * @param title {String} "휴대폰번호 입력" ? 화면 상단에 보여질 문구, defult : ""
     * @param confirmTitle {String} "확인" ? 하단 확인버튼 title ? default : "확인"
     * @param holder {String} "전화번호" - 입력전에 보여줄 text ? default : ""
     * @param value	{String} "01088887777" ? 화면에 기본으로 셋팅될 value  ? default : ""
     * @param maxLen {String} "10" - 최대 입력 길이("0" 길이제한없음) ? default: "0"
     * @param changeFunc {String} "" - 최대 입력 길이("0" 길이제한없음) ? default: ""
     * @param buttonArray {Array<json>} "개월" ? [{title:"1개월",value:"1"},{title:"3개월",value:"3"},{title:"6개월",value:"6"}, {title:"12개월",value:"12"] ? 개월버튼(1개월, 2개월, 3개월 …)  최대 5개 ? default : 버튼영역 숨김, 입력필드를 지우고 값을 적용
     */
    UIControls.prototype.showNumBottomSheet = function(successCallback, tag, title, confirmTitle, holder, value, maxLen, changeFunc, buttonArray) {
    	let params = {
    		"tag" : tag,
    		"title" : title,
    		"confirmTitle" : confirmTitle,
    		"holder" : holder,
    		"value" : value,
    		"maxLen": maxLen,
    		"changeFunc":changeFunc,
			"buttonArray" : buttonArray
    	};
    	
    	kbstar.exec(successCallback, function(){}, "UIControls", "showNumBottomSheet", params);
    };
    
    /**
     * 날짜선택 바텀시트 기능 호출
     * @param tag {String} "send" - 바텀시트 식별자 ? default : Null
     * @param title {String} "이체일 선택" ? 입력화면 상단 title ? default : ""
     * @param confirmTitle {String} "확인" ? 하단 확인버튼 title ? default : "확인"
     * @param type {String} "YMD"/"YM"/"D" ?입력화면 형태(년월일) ? default : "YMD"
     * @param defaultDate {String} "20210407" ? 입력화면에 최초 설정될 날짜 ? default : 당일날짜
     * @param minDate	{String} "20200407" ? 입력가능한 과거 날짜
     * @param maxDate {String} "20210407" ? 입력가능한 미래 날짜
     */
    UIControls.prototype.showDatePickerBottomSheet = function(successCallback, tag, title, confirmTitle, type, defaultDate, minDate, maxDate) {
    	let params = {
    		"tag" : tag,
    		"title" : title,
    		"confirmTitle" : confirmTitle,
    		"type" : type,
    		"defaultDate" : defaultDate,
    		"minDate" : minDate,
    		"maxDate": maxDate
    	};
    	
    	kbstar.exec(successCallback, function(){}, "UIControls", "showDatePickerBottomSheet", params);
    };

    /**
     * 서버에서 넘겨준 목록을 보여주고 선택하는 바텀시트 기능 호출
     * @param tag {String} "send" - 바텀시트 식별자 ? default : Null
     * @param title {String} "지역선택" ? 상단 title
     * @param columnTitle {Array<String>} ["지역","구","역"] ? 선택목록 Title 최대 3 해당필드로 column UI가 결정됨 ? ["","",""] 빈 문자열이 들어올경우 타이틀영역 숨김
     * @param columnDefault {Array<String>} ["지역","구","역"] ? 선택목록 Title 최대 3 해당필드로 column UI가 결정됨 ? ["","",""] 빈 문자열이 들어올경우 타이틀영역 숨김
     * @param values {Object} ? 화면에 보여줄 값들의 json Array 다음 예시 참조
     * - Column이 3개일경우
     * {
     *    "tag":"input1",
     *    "confirmTitle":"확인",
     *    "title":"지역선택",
     *    "columnTitle":["지역","구","역"],
     *    "columnDefault":["0","0","0"],
     *    "values":[{"title":"선택없음","values":[{"title":"선택없음","values":[{"title":"선택없음"}]}]},
     *                 {"title":"서울",
     *                  "values"[{"title":"선택없음","values":[{"title":"선택없음"}]},
     *                              {"title":"마포구",
     *                               "values"[{"title":"선택없음"},
     *                                           {"title":"홍대입구역"},
     *                                           {"title":"신촌로터리역"}]
     *                             },
     *                              {"title":"서대문구",
     *                               "values"[{"title":"선택없음"},
     *                                           {"title":"서대문역"},
     *                                           {"title":"광화문역"}]
     *                             }]
     *                },
     *                 {"title":"대전",
     *                  "values"[{"title":"선택없음","values":[{"title":"선택없음"}]},
     *                              {"title":"중구",
     *                               "values"[{"title":"선택없음"},
     *                                           {"title":"대전역"},
     *                                           {"title":"중앙로역"}]
     *                             }]
     *                }]
     * }
     * 
     * - Column이 2개일경우
     * {
     *    "tag":"input1",
     *    "confirmTitle":"확인",
     *    "title":" 지역선택",
     *    "columnTitle":["지역","구"],
     *    "columnDefault":["0","0"],
     *    "values":[{"title":"선택없음","values":[{"title":"선택없음"}]},
     *                 {"title":"서울",
     *                  "values"[{"title":"선택없음"},
     *                              {"title":"마포구"},
     *                              {"title":"서대문구"}]
     *                },
     *                 {"title":"대전",
     *                  "values"[{"title":"선택없음"},
     *                              {"title":"중구"}]
     *                }]
     * }
     * 
     * - Column이 1개일경우
     * {
     *    "tag":"input1",
     *    "confirmTitle":"확인",
     *    "title":" 지역선택",
     *    "columnTitle":["지역"],
     *    "columnDefault":["0"],
     *    "values":[{"title":"선택없음"},
     *                 {"title":"서울"},
     *                 {"title":"대전"}]
     * }
     * 
     */
    UIControls.prototype.showCustomPickerBottomSheet = function(successCallback, tag, title, confirmTitle, columnTitle, columnDefault, values) {
    	let params = {
    		"tag" : tag,
    		"title" : title,
    		"confirmTitle" : confirmTitle,
    		"columnTitle" : columnTitle,
    		"columnDefault" : columnDefault,
    		"values" : values
    	};
    	
    	kbstar.exec(successCallback, function(){}, "UIControls", "showCustomPickerBottomSheet", params);
    };
    
	/**
     * iOS 이전 앱으로 돌아가기 버튼 밑 툴팁 추가 ( safearea 바로 밑 추가 ) 
     * @param message {String} : 화면에 보여줄 메시지
     */
    UIControls.prototype.showBackPreviousAppAlert = function(message) {
    	let params = {
    		"message" : message
    	};
    	if((window.COMMON.getUserAgent() == "ios")) {
	    	kbstar.exec(null, null, "UIControls", "showBackPreviousAppAlert", params);
		}
    };

    kbstar.addConstructor(function() {
        window.uicontrols = navigator.uicontrols = new UIControls();
    });
}

/**
 * AppManager - 앱 시작 및 브라우져를 컨트롤 하는 기능
 * 
 * @class 다른 앱의 기동 및 기본 브라우져 기동, 브라우져의 컨트롤의 기능
 * @author FINGER Inc.
 * @version 1.0
 * @since 2011.10.21
 */
if (!kbstar.hasResource("AppManager")) {
    kbstar.addResource("AppManager");
    var AppManager = function() {
        onDataReturnCallback: null;
        mOpener: null;
    };
    
    /**
     * kbstar.AppManager.prototype.runV3 V3 실행 인터페이스
     * 여러번 호출하여도 앱 구동 후 1회 실행
     */
    AppManager.prototype.runV3 = async function() {
    	if((window.COMMON.getUserAgent() == "android") && (window.COMMON.compareVersion('G6.2.1', device.appVersion) <= 0)) {
    		kbstar.exec(null, null, "AppManager", "runV3");
        }
    }
    
    /**
     * kbstar.AppManager.prototype.checkFdsMobile 유심복제탐지를 위한 통신사 연결여부 체크 인터페이스
     */
    AppManager.prototype.checkFdsMobile = function() {
    	if((window.COMMON.getUserAgent() == "android") && (window.COMMON.compareVersion('G6.2.4', device.appVersion) <= 0)) {
    		kbstar.exec(null, null, "AppManager", "checkFdsMobile");
        }
    }
    
    /**
     * kbstar.AppManager.prototype.openWebViewWithPopup 웹뷰 형태로 프로그램 안에서 웹 브라우져를
     * 실행하는 기능 (클로즈 이벤트가 포함되어 있음)
     * 
     * @param {string}
     *            url URL
     * @param {Function}
     *            onDataReturnCallback 웹 브라우져에서 수신된 데이터 처리
     * @param {Function}
     *            onCloseCallback 웹 브라우져가 클로즈될때 처리
     */
    AppManager.prototype.openWebViewWithPopup = async function(url, param, onDataReturnCallback) {
    	url = await window.navi.getRedirectPageURL(url);
        var iParam = param == null ? {} : param;
    
        this.onDataReturnCallback = onDataReturnCallback;
    
        if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
            this.mOpener = window;
            var _jsonParam = null;
            if (typeof iParam == "object") {
                _jsonParam = iParam;
            } else {
                _jsonParam = JSON.parse(iParam);
            }
            var key = Object.keys(_jsonParam);
            var _opjParam = "";
            for (key in _jsonParam) {
                _opjParam += "&" + key + "=" + _jsonParam[key];
            }
            if (url.indexOf("mquics?") > -1) {
                if (url.indexOf("QCH") < 0) {
                    url = url + "&QCH=N";
                }
            }
            caq.popup.iFrameShow("mnbankPop", caq.util.encodeURI(url + _opjParam), null);
        } else {
            var params = "";
            var _jsonParam = {};
            //2021.08.03 TheK 웹스피어 전환이후 발생되었던 iOS의 urlDecode 에러 방지를 위한 로직 제거(urlEncodingForIOS)
			//iParam = window.COMMON.urlEncodingForIOS(iParam);
            if (typeof iParam == 'object') {
                _jsonParam = iParam;
                window.COMMON.recursion(iParam, "string");
            } else {
                _jsonParam = JSON.parse(iParam);
                window.COMMON.recursion(_jsonParam, "string");
            }
            params = kbstar.temp_string;
            kbstar.temp_string = "";
            if (_jsonParam.errCode == undefined || _jsonParam.errCode == "") {
                kbstar.exec(null, null, "AppManager", "openWebViewWithPopup", { url : url, params : params, display : "full", close : "close" });
            } else {
                kbstar.exec(null, null, "AppManager", "openWebView", { url : url, params : params, display : "full" });
            }
            window.appManager.onClose = function(ret) {
                if (ret != "noSendData") {
                    if (this.onDataReturnCallback && typeof this.onDataReturnCallback == 'function')
                        this.onDataReturnCallback(ret);
                }
            };
    
        }
    };
    
    /**
     * kbstar.AppManager.prototype.closePopupWebView 현재 팝업 웹뷰 닫을 때 호출
     * 
     * @param {JSONString}
     *            ret
     * @returns {JSON} data
     */
    AppManager.prototype.closePopupWebView = function(ret) {
    	if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
            var rtnVar;
            if(typeof ret == 'object'){
                rtnVar = ret;
            }else if(typeof ret == 'string' && ret != ''){
                rtnVar = JSON.parse(ret);
            }else{
                rtnVar = {};
            }
            if (parent.appManager.onDataReturnCallback
                && typeof parent.appManager.onDataReturnCallback == 'function') {
                    parent.appManager.onDataReturnCallback(rtnVar);
            }                    
            parent.caq.popup.iFrameHide('mnbankPop');            
    	
        } else {
            kbstar.exec(null, null, "AppManager", "closePopupWebView", { ret : ret });
        }
    };
    
    /**
     * kbstar.AppManager.prototype.closeAllPopupWebView 전체 팝업 웹뷰 닫을 때 호출
     * 
     * @param {JSONString}
     *            ret
     * @returns {JSON} data
     */
    AppManager.prototype.closeAllPopupWebView = function(ret) {
    	if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
            var rtnVar;
            if(typeof ret == 'object'){
                rtnVar = ret;
            }else if(typeof ret == 'string' && ret != ''){
                rtnVar = JSON.parse(ret);
            }else{
                rtnVar = {};
            }
            if (window.top.appManager.onDataReturnCallback
                && typeof window.top.appManager.onDataReturnCallback == 'function') {
                    window.top.appManager.onDataReturnCallback(rtnVar);
            }                    
            window.top.caq.popup.iFrameHide('mnbankPop');

        } else {
            kbstar.exec(null, null, "AppManager", "closeAllPopupWebView", { ret : ret });
        }
    };
    
    /**
     * kbstar.AppManager.prototype.requestDeleteAllCookies 쿠키 삭제
     */
    AppManager.prototype.requestDeleteAllCookies = function(callBack) {
    	kbstar.exec(callBack, null, "AppManager", "requestDeleteAllCookies");
    };
    
    /**
     * kbstar.AppManager.prototype.requestDeleteAllCache 캐쉬 삭제
     */
    AppManager.prototype.requestDeleteAllCache = function(callBack) {
    	kbstar.exec(callBack, null, "AppManager", "requestDeleteAllCache");
    };
    
	/**
     * kbstar.AppManager.prototype.exitApp" 앱 종료
     */
    AppManager.prototype.exitApp = function() {
    	kbstar.exec(null, null, "AppManager", "exitApp");
    };

    /**
     * kbstar.AppManager.prototype.openURL URL의 경로로 기본 웹 브라우져를 실행하는 기능
     * 
     * @param {string}
     *            url URL
     */
    AppManager.prototype.openURL = function(url) {
    	if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
            window.open(url);
        } else {
            kbstar.exec(null, null, "AppManager", "openURL", { url : url });
        }
    };
    
    /**
     * kbstar.AppManager.prototype.getPageInfo Page 정보
     * 
     * @param {function}
     *            pageInfoCallback
     */
    AppManager.prototype.getPageInfo = function(pageInfoCallback) {
        kbstar.exec(pageInfoCallback, null, "AppManager", "getPageInfo");
    };
    
    /**
     * kbstar.AppManager.prototype.getLocalPathNames
     * 리소스의 로컬 파일경로 얻기
     * @param {function}
     *            successCallback(data) : return data.path[]
     * @param {String Array}
     *            path[]
     */
    AppManager.prototype.getLocalPathNames = function(successCallback, path) {
     let param = { path : path };
        kbstar.exec(successCallback, null, "AppManager", "getLocalPathNames", param);
    };

    /**
     * kbstar.AppManager.prototype.requestAllMenu 20131128 ios의 경우 Native API
     * 비동기로 호출시 충돌나는 현상으로 인해 전체메뉴 페이지 호출함수 생성 iPhone만 적용
     */
    AppManager.prototype.requestAllMenu = function() {
    	kbstar.exec(null, null, "AppManager", "requestAllMenu", []);
    };
    
    /**
     * orchestra.AppManager.prototype.showErrDialog 오류 팝업 생성 요청
     * 
     * @param {function} successCallback callback at success
     * @param {String} errCode error code
     * @param {String} errMSG error message 
     **/
    AppManager.prototype.showErrDialog = function(successCallback, params) {

    	if (device.platform.match(_BROWSER_TEST_PATTERN) || !window.COMMON.isNative() ) {
    		window.SPA.loadingLayerRemove();
    		kbstar.alert(" error code: " + params.errCode + "\n error msg : " +params.errMSG);
    	} else {
    		kbstar.exec(successCallback, null, "AppManager", "showErrDialog",  params);
    	}
        
    };
    
    /**
     * AppManager.prototype.showConfirm 커스텀 Confirm 화면 생성 요청
     * 2021-06-16 신재현 이사님 삭제요청
     * @param {function} okCallback callback at ok
     * @param {String} msg confirm message 
     * @param {String} btnOk text of Ok button
     * @param {String} btnCancel text of Cancel button
     **/
    //AppManager.prototype.showConfirm = function(okCallback, cancelCallback, msg, btnOk, btnCancel) {
    //    var _params = {
    //            msg : msg,
    //           btnOk : btnOk,
    //            btnCancel : btnCancel
    //    };
    //    kbstar.exec(okCallback, cancelCallback, "AppManager", "showConfirm",  _params);
    //};
    
    /**
     * kbstar.AppManager.prototype.requestCaptureOff
     * 특정 하이브리드 페이지 캡쳐방지
     */
    AppManager.prototype.requestCaptureOff = function(callBack) {
        kbstar.exec(callBack, null, "AppManager", "requestCaptureOff", []);
    };

    /**
     * kbstar.AppManager.prototype.closeHybridBottomSheet
     * 2022.03.15 하이브리드 바텀시트 os백버튼 적용
     */
    AppManager.prototype.closeHybridBottomSheet = function(closeFuntn) {
        kbstar.exec(null, null, "AppManager", "closeHybridBottomSheet", { closeFuntn : closeFuntn });
    };

    /**
     * kbstar.AppManager.prototype.screenRotate
     * 화면 회전 인터페이스
     * 
     * @param {String} mode
     * 			"LS" 가로, "PR" 세로, "LS|PR" 자동회전
     */
    AppManager.prototype.screenRotate = function(mode) {
    	kbstar.exec(null, null, "AppManager","screenRotate",{ mode : mode }); 
    };
    
    /**
     * kbstar.AppManager.prototype.showClipboardBasedTransferAlert
     * 문자기반 이체 실행
     * 
     * @param 
     */
    AppManager.prototype.showClipboardBasedTransferAlert = function(successCallback, failCallback) {
    	var data = {
            pageId   : "D000047",
    		bankInfo : getBankInfoList()
    	}
    	
    	kbstar.exec(successCallback, failCallback, "AppManager","showClipboardBasedTransferAlert", data); 
    };

    /**
     * kbstar.AppManager.prototype.transferClipboard
     * 클립보드에 저장된 계좌 정보 전달(문자기반 이체 alert없는 버전)
     * 
     * @param 
     */
    AppManager.prototype.transferClipboard = function(successCallback, failCallback) {
    	var data = {
    		bankInfo : getBankInfoList()
    	}
    	
    	kbstar.exec(successCallback, failCallback, "AppManager","transferClipboard", data); 
    };

    /**
     * 20220919 추가
     * kbstar.AppManager.prototype.showClipboardAlert
     * 계좌복사붙여넣기
     * 
     * @param title - 타이틀명, message - 팝업내용, btnRight - 우측버튼명, btnLeft - 좌측버튼명
     */
    AppManager.prototype.showClipboardAlert = function(successCallback, failCallback, title, message, btnRight, btnLeft) {
		var data = {
    		bankInfo : getBankInfoList(),
    		title    : title,
    		message  : message,
    		btnRight : btnRight,
			btnLeft  : btnLeft
    	}
    	
    	kbstar.exec(successCallback, failCallback, "AppManager","showClipboardAlert", data); 
    };
    
    kbstar.addConstructor(function() {
        navigator.appManager = window.appManager = new AppManager();
    });
}

if (!kbstar.hasResource("AppInfoManager")) {
    kbstar.addResource("AppInfoManager");
    var AppInfoManager = function() {
        callback: null;
    };
    /**
     * kbstar.AppInfoManager.prototype.requestUniqueDeviceInfo
     * requestUniqueDeviceInfo 유니크 디바이스 정보 가져오는 함수
     * 
     * @param ret 유니크 디바이스 정보
     */
    AppInfoManager.prototype.requestUniqueDeviceInfo = function(callback) {
    	if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
            uniqueDeviceInfo = "Simulator";
            callback(uniqueDeviceInfo);
        } else {
            kbstar.exec(callback, null, "AppInfoManager", "requestUniqueDeviceInfo");
        }
    };
    
    /**
     * kbstar.AppInfoManager.prototype.openPdfViewer PDF Viewer
     * 
     * @param {string}
     *            url URL
     * @param {string}
     *            type Y(url형식 다를경우)
     */
    AppInfoManager.prototype.openPdfViewer = function(url, flag) {
    	var _flag = flag != undefined ? flag : "";
        kbstar.exec(null, null, "AppInfoManager", "openPdfViewer", { url : url, flag : _flag });
    };
    
    /**
     * kbstar.AppInfoManager.prototype.openPdf PDF Viewer
     * 
     * @param {string}
     *            pdfData
     */
    AppInfoManager.prototype.openPdf = function(successCallback, failCallback, pdfData) {
		var params = {
				pdfData : pdfData
		};    
        kbstar.exec(successCallback, failCallback, "AppInfoManager", "openPdf", params);
    };
    /**
     * kbstar.AppInfoManager.prototype.requestFileDownload File Download
     * 
     * @param {string}
     *            url URL. 콤마(,)로 구별하여 다건 전송 가능.
     */
    AppInfoManager.prototype.requestFileDownload = function(url) {
    	kbstar.exec(null, null, "AppInfoManager", "requestFileDownload", { url : url });
    };
    
    /**
     * kbstar.AppInfoManager.prototype.requestChangedLocale 언어 변환
     * 
     * @param {string}
     *            locale locale "ko" or "en"
     */
    AppInfoManager.prototype.requestChangedLocale = function(locale) {
    	kbstar.exec(null, null, "AppInfoManager", "requestChangedLocale", { locale : locale });
    };
    
    
    /**
     * kbstar.AppInfoManager.prototype.getMenuStatistics 메뉴통계정보 얻기
     * 전달(화면->네이티브)
     * @param {String} parentId : 상위페이지 ID
     * @param {function} callback([{name:"", title:""}])
     */
    AppInfoManager.prototype.getMenuStatistics = function(parentId, callback) {
    	kbstar.exec(callback, null, "AppInfoManager", "getMenuStatistics", { parentId : parentId });
    };
    
    /**
     * kbstar.AppInfoManager.prototype.getPhishingChangeInfo 피싱방지 데이터
     * 전달(화면->네이티브)
     */
    AppInfoManager.prototype.getPhishingChangeInfo = function() {
    	kbstar.exec(null, null, "AppInfoManager", "getPhishingChangeInfo");
    };
    
    /**
     * kbstar.AppInfoManager.prototype.requestLoginStatus 현재 로그인상태값 가져오는 함수
     * 
     * @return {String} "00":비로그인, "02":인증서로그인 "03":ID/PASSWORD
     */
    AppInfoManager.prototype.requestLoginStatus = function(callback) {
    	// Page 이동 시 호출
    	//if (!device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) && window.COMMON.isNative()) {
    		kbstar.exec(callback, null, "AppInfoManager", "requestLoginStatus");
    	//}
    };
    
    /**
     * kbstar.AppInfoManager.prototype.setPublicKey Publickey set
     * 
     * @param {String}
     *            PublicKey
     * @returns {}
     */
    AppInfoManager.prototype.setPublicKey = function(value) {
    	kbstar.exec(null, null, "AppInfoManager", "setPublicKey", { value : value });
    };
    
    /**
     * kbstar.AppInfoManager.prototype.getPublickey getPublickey
     * 
     * @param {}
     * @returns {String} PublicKey
     */
    AppInfoManager.prototype.getPublicKey = function(successcallback) {
        kbstar.exec(successcallback, null, "AppInfoManager", "getPublicKey");
    };
    
    /**
     * 전체 메뉴 닫기 closeAllMenu
     */
    AppInfoManager.prototype.closeAllMenu = function() {
    	kbstar.exec(null, null, "AppInfoManager", "closeAllMenu");
    };
    
     /**
     * kbstar.AppInfoManager.prototype.setDarkTheme 다크테마 적용
     * 
     * @param {string}
     *            _KB_DARKTHEME_USE_YN "Y" or "N"
     */
    AppInfoManager.prototype.setDarkTheme = function(successCallback, failCallback, value) {
    	kbstar.exec(successCallback, failCallback, "AppInfoManager", "setDarkTheme", { "_KB_DARKTHEME_USE_YN" : value });
    };
    
    kbstar.addConstructor(function() {
        navigator.AppInfoManager = window.AppInfoManager = new AppInfoManager();
    });
}

/**
 * SystemInfoManager - 디바이스의 정보를 관리하는 기능
 * 
 * @class 디바이스의 정보를 제공하는 기능
 * @author FINGER Inc.
 * @version 1.0
 * @since 2011.10.13
 */
if (!kbstar.hasResource("SystemInfoManager")) {
    kbstar.addResource("SystemInfoManager");
    var SystemInfoManager = function() {
    };
    
    /**
     * kbstar.SystemInfoManager.prototype.deviceOwnerAuthentication 기기 잠금 설정여부
     * 
     * @param {function}
     *            callbackSuccess 기기 잠금 설정여부 (result : Y, N)
     */
    SystemInfoManager.prototype.deviceOwnerAuthentication = function(callbackSuccess, callbackFail) {
       kbstar.exec(callbackSuccess, callbackFail, "SystemInfoManager", "deviceOwnerAuthentication", {});
    };

     /**
     * kbstar.SystemInfoManager.prototype.getSystemInfo System 정보
     * 
     * @param {function}
     *            callback System 정보 확인 후 호출되는 파라미터를 한 개 가지고 있는 콜백함수. 파라미터는 hash
     *            <p>
     *            hash에 들어가는 key : value<br> - osVersion : os버젼 - phoneModel : 기기
     *            Model명 - native_appVersion : App version
     *	       permission : 실시간 퍼미션 알림 여부 true, false (default : true)
     */
    SystemInfoManager.prototype.getSystemInfo = function(systemInfoCallback, perm) {
        if (perm == undefined) perm = "true";
        if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
            systemInfo = {
                "osVersion" : "",
                "phoneModel" : "",
                "native_appVersion" : ""
            };
            systemInfoCallback(systemInfo);
        } else {
            kbstar.exec(systemInfoCallback, null, "SystemInfoManager", "getSystemInfo", {permission : perm}, false);
        }
    };

	 /**
     * kbstar.SystemInfoManager.prototype.getSystemInfoForUsim System 정보
     * 안드로이드Q(10) 이상에서도 USIM 정보를 추출하기 위해 사용
     * @param {function}
     *            callback System 정보 확인 후 호출되는 파라미터를 한 개 가지고 있는 콜백함수. 파라미터는 hash
     *            <p>
     *            hash에 들어가는 key : value<br> - osVersion : os버젼 - phoneModel : 기기
     *            Model명 - native_appVersion : App version
     *			permission : 실시간 퍼미션 알림 여부 true, false (default : true)
	 *			안드로이드 G5.4.4 이상일때만 동작
	 *			이하면 업데이트 유도
	 *			IOS는 기존 getSystemInfo로 동작
     */
    SystemInfoManager.prototype.getSystemInfoForUsim = function(systemInfoCallback, perm) {
        if (perm == undefined) perm = "true";

        if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
            systemInfo = {
                "osVersion" : "",
                "phoneModel" : "",
                "native_appVersion" : ""
            };
            systemInfoCallback(systemInfo);
        } else {
			if(window.COMMON.getUserAgent() == "android"){
				if(window.COMMON.compareVersion('10.0.0', device.version) > 0){ // Android && os10 미만 버전
					kbstar.exec(systemInfoCallback, null, "SystemInfoManager", "getSystemInfo", {permission : perm});
				} else {  // Android && os10 이상 버전
					if(window.COMMON.compareVersion('G5.4.4', device.appVersion) <= 0){  // Android && os10 이상 && 앱버전 G5.4.4 이상 
						kbstar.exec(function(data){
								if(data.status == "18"){
									alert("휴대폰 인증서비스 업데이트로 인한 초기화가 필요합니다. 기기 전원 재부팅 후 다시 시도해주세요.");
								}
								if(typeof systemInfoCallback == 'function') systemInfoCallback(data);
							}, null, "SystemInfoManager", "getSystemInfoForUsim", {permission : perm});
					} else {
						var url = "https://play.google.com/store/apps/details?id=com.kbstar.kbbank";
				
						var storeConfirm = confirm("구글 안드로이드 정책변경에 따라 원활한 서비스 이용을 위해 앱 업데이트가 필요합니다. 확인 버튼을 클릭하시면 플레이스토어로 이동합니다");

						if(storeConfirm){
							kbstar.exec(null, null, "AppManager", "openURL", { url : url });
						} 
					}
				}
			} else {
				kbstar.exec(systemInfoCallback, null, "SystemInfoManager", "getSystemInfo", {permission : perm});
			}
		}
	};

    /**
	* kbstar.SystemInfoManager.prototype.isPushOn 현재 푸시서비스 설정상태를 확인
	*
	* @param {Function}
	 *			callbackSuccess(isPushOn) : Y or N
	 * @param {Function}
	 *			callbackFail
	 */
    SystemInfoManager.prototype.isPushOn = function(callbackSuccess, callbackFail) {
		kbstar.exec(callbackSuccess, callbackFail, "SystemInfoManager", "isPushOn");
	};

	/**
	* kbstar.SystemInfoManager.prototype.isVoiceOn voiceOver/talkback on여부
	*
	* @param {Function}
	 *			callbackSuccess
	 * @param {Function}
	 *			callbackFail
	 */
	 SystemInfoManager.prototype.isVoiceOn = function(callbackSuccess, callbackFail) {
		kbstar.exec(callbackSuccess, callbackFail, "SystemInfoManager", "isVoiceOn");
	};
    
    kbstar.addConstructor(function() {
        navigator.SystemInfoManager = window.SystemInfoManager = new SystemInfoManager();
    });
}

/**
 * 사용자 정의 정보 설정
 */
if (!kbstar.hasResource("UserPreference")) {
    kbstar.addResource("UserPreference");
    var UserPreference = function() {
    };
    
    /**
     * kbstar.UserPreference.prototype.setValue 사용자 정의 정보 설정
     * 
     * @param {function}
     *            callback
     * @param {string}
     *            key
     * @param {string}
     *            value
     */
    UserPreference.prototype.setValue = function(callbackSuccess, callbackFail, key, value) {
    	if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
            callbackSuccess();
        } else {
            kbstar.exec(callbackSuccess, callbackFail, "UserPreference", "setValue", { key : key, value : value });
        }
    };
    
    /**
     * kbstar.UserPreference.prototype.getValue 사용자 정의 정보 설정 값 조회 - 빠른 로그인 [key :
     * "fastLogin"] - 빠른 메뉴 [key : "fastMenu"] - 인증서 이용 위치(iphone only) [key :
     * "OllehCertEnabled"] - 사용자명 [key : "userName"] - 이용폰 지정 여부 [key :
     * "isUsePhone"] - 시간 정보 조회 [key : "currentTime"]
     * 
     * @param {function}
     *            callback
     * @param {string}
     *            key
     */
    UserPreference.prototype.getValue = function(callbackSuccess, callbackFail, key) {
    	if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
            callbackSuccess();
        } else {
            kbstar.exec(callbackSuccess, callbackFail, "UserPreference", "getValue", { key : key });
        }
    };
    
    /**
     * kbstar.UserPreference.prototype.encValue 사용자 정의 정보 설정(암호화)
     * 
     * @param {function}
     *            callback
     * @param {string}
     *            key
     * @param {string}
     *            value
     */
    UserPreference.prototype.encValue = function(callbackSuccess, callbackFail, key, value) {
     if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
            callbackSuccess();
        } else {
            kbstar.exec(callbackSuccess, callbackFail, "UserPreference", "encValue", { key : key, value : value });
        }
    };
    
    /**
     * kbstar.UserPreference.prototype.decValue 사용자 정의 정보 설정 값 조회(복호화)
     * 
     * @param {function}
     *            callback
     * @param {string}
     *            key
     */
    UserPreference.prototype.decValue = function(callbackSuccess, callbackFail, key) {
     if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
            callbackSuccess();
        } else {
            kbstar.exec(callbackSuccess, callbackFail, "UserPreference", "decValue", { key : key });
        }
    };


    
    kbstar.addConstructor(function() {
        navigator.UserPreference = window.UserPreference = new UserPreference();
    });
}

if (!kbstar.hasResource("SNSManager")) {
    kbstar.addResource("SNSManager");
    
    var SNSManager = function() {
        
    };
	/**
     * kbstar.SNSManager.prototype.requestStartSmsRetriever 리트리버 서비스 요청
     * 
     * @param {Function}
	 *
     * @returns {} 
     */
    SNSManager.prototype.requestStartSmsRetriever = function() {
    	// android 버전 G5.4.13 이상일 때
    	if((window.COMMON.getUserAgent() == "android") && (window.COMMON.compareVersion('G5.4.13', device.appVersion) <= 0)) {
			kbstar.exec(null, null, "SNSManager", "requestStartSmsRetriever");
        }
    };
    /**
     * kbstar.SNSFaceBook.prototype.postMessage FaceBook 글게시
     * 
     * @param {Function}
     *            callback
     * @param {String}
     *            message 1. message 가 있을경우 메시지 보내는 기능, 2. message 가 "login" 일 경우
     *            로그인 기능만 제공
     * @returns {String} loginID 로그인 기능으로만 호출시 로그인한 아이디값 리턴
     */
    SNSManager.prototype.postMessage = function(callbackSuccess, callbackFail, message) {
        kbstar.exec(callbackSuccess, callbackFail, "SNSManager", "postMessage", { message : message });
    };
    /**
     * kbstar.SNSFaceBook.prototype.requestFaceBookLogout SNSFaceBook 페이스북 로그아웃
     * 
     * @param {Function}
     *            callbackSuccess
     * @returns {}
     */
    SNSManager.prototype.requestFaceBookLogout = function(callbackSuccess, callbackFail) {
        kbstar.exec(callbackSuccess, callbackFail, "SNSManager", "requestFaceBookLogout");
    };
    /**
     * kbstar.KakaoLink.prototype.sendMsgToKakao KakaoTalk Message send
     * 
     * @param {Function}
     *            kakaoCallback 실패콜백
     * @param {String}
     *            message 보낼 메시지
     * @returns {}
     */
	SNSManager.prototype.sendMsgToKakao = function(kakaoCallback, message) {
	    // android 버전 G5.0.12 이상일 때
		if((window.COMMON.getUserAgent() == "android") && (window.COMMON.compareVersion('G5.0.12', device.appVersion) <= 0)) {  
			SNSManager.sendToKakaoV2(kakaoCallback, message, "", "", "", "", "", "", "9612");
		} 
		// ios 버전 I5.0.8 이상일 때
		else if ((window.COMMON.getUserAgent() == "ios") && (window.COMMON.compareVersion('I5.0.8', device.appVersion) <= 0)) {
			SNSManager.sendToKakaoV2(kakaoCallback, message, "", "", "", "", "", "", "9612");						
		}
		else {               
            //안드로이드, iOS URL 구분
			if (window.COMMON.getUserAgent() == "android") {  
				var url = "https://play.google.com/store/apps/details?id=com.kbstar.kbbank";
			} 
			else if (window.COMMON.getUserAgent() == "ios") {
				var url = "https://itunes.apple.com/kr/app/kbseutabaengking/id373742138?mt=8";
			}

            var storeConfirm = confirm("카카오링크 서비스 기능 업그레이드로 인하여 앱 업데이트가 필요합니다. 확인 버튼을 클릭하시면 스토어로 이동합니다.");

			if(storeConfirm){
                kbstar.exec(null, null, "AppManager", "openURL", { url : url });
			}
		}
	};

    /**
     * kbstar.KakaoLink.prototype.sendToKakao KakaoTalk Message send
     * 
     * @param {Function}
     *            kakaoCallback 실패콜백
     * @param {String}
     *            msg 보낼 메시지
     * @param {String}
     *            btnName 버튼이름
     * @param {String}
     *            pageId 페이지ID
     * @param {String}
     *            param 페이지로 넘길 파라메터
     * @param {String}
     *            imgUrl 이미지 URL
     * @param {String}
     *            imgWidth 이미지 Width
     * @param {String}
     *            imgHeight 이미지 Height
     * @returns {}
     */
    SNSManager.prototype.sendToKakao = function(kakaoCallback, msg, btnName, pageId, param, imgUrl, imgWidth, imgHeight) {
		var params = "pageId=" + pageId + param;
	    if (msg == null)
            msg = "";
        if (btnName == null)
            btnName = ""; 
        if (imgUrl == null)
            imgUrl = "";
        var message = {
            "msg" : msg,
            "btnName" : btnName,
            "params" : params,
            "img" : JSON.stringify({
                "imgUrl" : imgUrl,
                "imgWidth" : imgWidth,
                "imgHeight" : imgHeight
            })
        };
        // android 버전 G5.0.12 이상일 때
		if((window.COMMON.getUserAgent() == "android") && (window.COMMON.compareVersion('G5.0.12', device.appVersion) <= 0)) {
			SNSManager.sendToKakaoV2(kakaoCallback, msg, btnName, pageId, param, imgUrl, imgWidth, imgHeight, "9612");		
		}
		// ios 버전 I5.0.8 이상일 때
		else if ((window.COMMON.getUserAgent() == "ios") && (window.COMMON.compareVersion('I5.0.8', device.appVersion) <= 0)) {
			SNSManager.sendToKakaoV2(kakaoCallback, msg, btnName, pageId, param, imgUrl, imgWidth, imgHeight, "9612");				
		}
		else {			
            //안드로이드, iOS URL 구분
			if (window.COMMON.getUserAgent() == "android") {  
				var url = "https://play.google.com/store/apps/details?id=com.kbstar.kbbank";
			} 
			else if (window.COMMON.getUserAgent() == "ios") {
				var url = "https://itunes.apple.com/kr/app/kbseutabaengking/id373742138?mt=8";
			}

            var storeConfirm = confirm("카카오링크 서비스 기능 업그레이드로 인하여 앱 업데이트가 필요합니다. 확인 버튼을 클릭하시면 스토어로 이동합니다.");

			if(storeConfirm){
                kbstar.exec(null, null, "AppManager", "openURL", { url : url });
			} 
		}
	};

	//카카오링크 V2 서비스, (스타뱅킹)커스텀 템플릿1 ID : 9612
	SNSManager.prototype.sendToKakaoV2 = function(kakaoCallback, msg, btnName, pageId, param, imgUrl, imgWidth, imgHeight, templateId) {
	    var params = "pageId=" + pageId + param;
	    if (msg == null) {
	    	msg = "";
	    } else {
	    	if (msg.indexOf("https:") > -1) {
	    		msg = msg+"&iskakao=Y";
	    	}
	    }
        if (btnName == null)
            btnName = "";
        if (imgUrl == null)
            imgUrl = "";
		if (templateId == null)
            templateId = "9612";
		var message = {
			"templateId" : templateId,
			"msg" : msg,
            "btnName" : btnName,
            "params" : params,
            "img" : JSON.stringify({
                "imgUrl" : imgUrl,
                "imgWidth" : imgWidth,
                "imgHeight" : imgHeight
            })
        };            
		kbstar.exec(null, kakaoCallback, "SNSManager", "sendToKakaoV2",  message);
	};
     
	//카카오링크 V2 서비스 - 웹링크
	SNSManager.prototype.sendToKakaoV2ForWeb = function(kakaoCallback, msg, btnName, url, param, imgUrl, imgWidth, imgHeight, templateId) {
	    var params = url + param;
	    if (msg == null)
            msg = "";
        if (btnName == null)
            btnName = "";
        if (imgUrl == null)
            imgUrl = "";
		if (templateId == null)
            templateId = "9612";
		var message = {
			"templateId" : templateId,
			"msg" : msg,
            "btnName" : btnName,
            "params" : params,   
            "img" : JSON.stringify({
                "imgUrl" : imgUrl,
                "imgWidth" : imgWidth,
                "imgHeight" : imgHeight
            })
        };            
		kbstar.exec(null, kakaoCallback, "SNSManager", "sendToKakaoV2", message);
	 };

    /**
     * 리브똑똑 공유하기(리브똑똑 전송하기)
     * 
     * @param {Function}
     *            callback
     * @param {Object}
     *            TODO 개발 완료 후 수정할 것 인자값
     */
	SNSManager.prototype.sendMsgToLiivtalk = function(callbackSuccess, callbackFail, imgurl, message, weblink, applink) {
		kbstar.exec(callbackSuccess, callbackFail, "SNSManager", "sendMsgToLiivtalk", {"imgurl":imgurl, "message":message, "weblink":weblink, "applink":applink});
	};

    /**
     * Twitter 전송하기
     * 
     * @param {Function}
     *            callback
     * @param {String}
     *            message 보낼 메시지
     */
	SNSManager.prototype.sendTwitter = function(callbackSuccess, callbackFail, message) {
		kbstar.exec(callbackSuccess, callbackFail, "SNSManager", "sendTwitter", { message : message });
	};
	
    /**
     * SMS 전송(IOS)
     * 
     * @param {Function}
     *            successCallback
     * @param {Function}
     *            failCallback
     * @param {String}
     *            content
     * @param {Array}
     *            phoneNumbers JSON 배열 ex)var phoneNumbers = [a,b];
     */
    SNSManager.prototype.sendSMS = function(successCallback, failCallback, content, phone) {
        kbstar.exec(successCallback, failCallback, "SNSManager", "sendSMS", { content : content, phone : JSON.stringify(phone) });
    };
    /**
     * Email 전송
     * 
     * @param {string}
     *            title 전송할 메세지 Title
     * @param {string}
     *            content 전송할 메세지
     */
    SNSManager.prototype.requestSendEmail = function(title, content) {
        kbstar.exec(null, null, "SNSManager", "requestSendEmail", { title : title, content : content });
    };
    kbstar.addConstructor(function() {
        navigator.SNSManager = window.SNSManager = new SNSManager();
    });
}

if (!kbstar.hasResource("DataBinder")) {
    kbstar.addResource("DataBinder");
    
    var DataBinder = function() {
        
    };
    
    /**
    * kbstar.DataBinder.quicsDataBinding param {JSON} 바인딩할 JSON데이터
    */
    DataBinder.prototype.quicsDataBinding = function(jsondata) {
        try {
            if (jsondata) {
                $jsonData = jsondata.data.msg;
            }
            // 웹 접근성 적용
            var $ptPage = $('.pt-page').length > 1 ? $('.pt-page').eq(1) : $('.pt-page');
            var $watElement = $ptPage.find("*[data-wat]");
            if ($watElement != undefined) {
                window.COMMON.setWebAccessibilityTag($jsonData, $watElement);
            }
            var $quicsElement = $ptPage.find("*[data-quics]");
            $quicsElement.each(function() { 
                var attrVal = $(this).attr("data-quics");
                var _quicsjson = JSON.parse(attrVal);
                var key = Object.keys(_quicsjson);

                //alert("value:"+_quicsjson[key]);
                if ("tag" == key && kbstar.connect.isQAction == false) {
                    $(this).html($jsonData.servicedata[_quicsjson[key]]);
                } else if ("paging" == key) {
                    var decodeObj = $jsonData.servicedata;
                    WebPagingTag.loadData(decodeObj, _quicsjson[key]);
                } else if ("qpagestart" == key) {
                    var decodeObj = $jsonData.servicedata;
                    WebQPageStart.loadData(decodeObj, _quicsjson[key]);
                }
                // Dynamic Field Binding 1
                else if ("visiable" == key) {
                    kbstar.DataBinder.quicsDataVisiable($(this), _quicsjson[key], $jsonData);
                }
                // Dynamic Field Binding 2
                else if ("start" == key) {
                    if ("if-getList" != _quicsjson[key]) {
                        kbstar.DataBinder.quicsDataIfStart($(this), $jsonData);
                        $(this).show();
                    }
                }
                // Single Field Binding
                else if ("get" == key) {
                    var elementType = this.type;
                    if (elementType != undefined && elementType != null){
                        elementType = elementType.toLowerCase();
                    }
                    if (elementType == "text" || elementType == "hidden"
                            || elementType == "textarea"
                            || elementType == "password"
                            || elementType == "tel" || elementType == "url"
                            || elementType == "email"
                            || elementType == "search") {
                        $(this).val(window.COMMON.decUriCompData($jsonData.servicedata[_quicsjson[key]]));
                    } else {
                        if (elementType == 'radio' || elementType == 'checkbox') {
                            if ($(this).val() == $jsonData.servicedata[_quicsjson[key]]){
                                $(this).attr('checked', true);
                            }
                        } else if (elementType == 'select-one') {
                            if ($jsonData.servicedata[_quicsjson[key]] != undefined) {
                                if ($jsonData.servicedata[_quicsjson[key]].indexOf("<option") == -1) {
                                    $(this).val($jsonData.servicedata[_quicsjson[key]]);
                                } else {
                                    $(this).html($jsonData.servicedata[_quicsjson[key]]);
                                }
                            }
                        } else {
                            $(this).html(window.COMMON.decUriCompData($jsonData.servicedata[_quicsjson[key]]));
                        }
                    }
                }
                // Single Field Value Binding
                else if ("setValue" == key) {
                    var elementType = this.type;
                    if (elementType != undefined && elementType != null){
                        elementType = elementType.toLowerCase();
                    }
                    if (elementType == "text" || elementType == "hidden"
                            || elementType == "textarea"
                            || elementType == "password"
                            || elementType == "tel" || elementType == "url"
                            || elementType == "email"
                            || elementType == "button"
                            || elementType == "search") {
                        $(this).attr("value", window.COMMON.decUriCompData($jsonData.servicedata[_quicsjson[key]]));
                    } else if (elementType == 'radio' || elementType == 'checkbox') {
                        $(this).attr("value", $jsonData.servicedata[_quicsjson[key]]);
                    }
                }
                // Array Field Binding
                else if ("getList" == key) {
                    var $listData = $jsonData.servicedata[_quicsjson[key]];
                    kbstar.DataBinder.quicsArrData($(this), $listData, $jsonData);
                    $(this).show();
                }
                // More Array Field Binding
                else if ("getListMore" == key) {
                    var $listData = $jsonData.servicedata[_quicsjson[key]];
                    kbstar.DataBinder.quicsArrDataMore($(this),$listData, $jsonData);
                    $(this).show();
                } else if ("select" == key) {
                    var $listData = $jsonData.servicedata[_quicsjson[key]];
                    kbstar.DataBinder.quicsArrData_select($(this), $listData);
                    $(this).show();
                }
                // radio list Field Binding
                else if ("radio" == key) {
                    var $listData = $jsonData.servicedata[_quicsjson[key]];
                    kbstar.DataBinder.quicsArrData_radio($(this), $listData);
                    $(this).show();
                }
                // checkbox list Field Binding
                else if ("checkbox" == key) {
                    var $listData = $jsonData.servicedata[_quicsjson[key]];
                    kbstar.DataBinder.quicsArrData_checkbox($(this), $listData);
                    $(this).show();
                }
                // file text(html) Binding
                else if ("fileinclude" == key) {
                    kbstar.DataBinder.quicsIncludeFile($(this));
                    $(this).show();
                }
                // page text(html) Binding
                else if ("pageinclude" == key) {
                    kbstar.DataBinder.quicsIncludePage($(this));
                    $(this).show();
                }
            });
        } catch (e) {
            kbstar.alert("kbstar.DataBinder.prototype.quicsDataBind error : " + e);
        }
    };
    
    /**
     * kbstar.DataBinder.quicsDataBinding
     * param {STRING} 바인딩할 html tag
     * param {JSON} 바인딩할 JSON데이터
     */
     DataBinder.prototype.quicsDataBindingWithInclude = function(htmlEle) {
         try {
             var bindingJson = window.SPA_COMMON.getDocReadyData();
             var $jsonData = bindingJson.data.msg;
             var common = $jsonData == null || $jsonData == undefined ? {} : $jsonData.common;
             
             if (common.status == "S") {
                 // 웹 접근성 적용
                 var $watElement = htmlEle.find("*[data-wat]");
                 if ($watElement != undefined) {
                    window.COMMON.setWebAccessibilityTag($jsonData, $watElement);
                 }
                 var $quicsElement = htmlEle.find("*[data-quics]");
                 $quicsElement.each(function() {
                     var attrVal = $(this).attr("data-quics");
                     var _quicsjson = JSON.parse(attrVal);
                     var key = Object.keys(_quicsjson);
             
                     if ("tag" == key && kbstar.connect.isQAction == false) {
                         $(this).html($jsonData.servicedata[_quicsjson[key]]);
                     } else if ("paging" == key) {
                         var decodeObj = $jsonData.servicedata;
                         WebPagingTag.loadData(decodeObj, _quicsjson[key]);
                     } else if ("qpagestart" == key) {
                         var decodeObj = $jsonData.servicedata;
                         WebQPageStart.loadData(decodeObj, _quicsjson[key]);
                     }
                     // Dynamic Field Binding 1
                     else if ("visiable" == key) {
                         kbstar.DataBinder.quicsDataVisiable($(this), _quicsjson[key], $jsonData);
                     }
                     // Dynamic Field Binding 2
                     else if ("start" == key) {
                         if ("if-getList" != _quicsjson[key]) {
                             kbstar.DataBinder.quicsDataIfStart($(this), $jsonData);
                             $(this).show();
                         }
                     }
                     // Single Field Binding
                     else if ("get" == key) {
                         var elementType = this.type;
                         if (elementType != undefined && elementType != null){
                             elementType = elementType.toLowerCase();
                         }
                         if (elementType == "text" || elementType == "hidden"
                                 || elementType == "textarea"
                                 || elementType == "password"
                                 || elementType == "tel" || elementType == "url"
                                 || elementType == "email"
                                 || elementType == "search") {
                             $(this).val(window.COMMON.decUriCompData($jsonData.servicedata[_quicsjson[key]]));
                         } else {
                             if (elementType == 'radio' || elementType == 'checkbox') {
                                 if ($(this).val() == $jsonData.servicedata[_quicsjson[key]]){
                                     $(this).attr('checked', true);
                                 }
                             } else if (elementType == 'select-one') {
                                 if ($jsonData.servicedata[_quicsjson[key]] != undefined) {
                                     if ($jsonData.servicedata[_quicsjson[key]].indexOf("<option") == -1) {
                                         $(this).val($jsonData.servicedata[_quicsjson[key]]);
                                     } else {
                                         $(this).html($jsonData.servicedata[_quicsjson[key]]);
                                     }
                                 }
                             } else {
                                 $(this).html(window.COMMON.decUriCompData($jsonData.servicedata[_quicsjson[key]]));
                             }
                         }
                     }
                     // Single Field Value Binding
                     else if ("setValue" == key) {
                         var elementType = this.type;
                         if (elementType != undefined && elementType != null){
                             elementType = elementType.toLowerCase();
                         }
                         if (elementType == "text" || elementType == "hidden"
                                 || elementType == "textarea"
                                 || elementType == "password"
                                 || elementType == "tel" || elementType == "url"
                                 || elementType == "email"
                                 || elementType == "button"
                                 || elementType == "search") {
                             $(this).attr("value", window.COMMON.decUriCompData($jsonData.servicedata[_quicsjson[key]]));
                         } else if (elementType == 'radio' || elementType == 'checkbox') {
                             $(this).attr("value", $jsonData.servicedata[_quicsjson[key]]);
                         }
                     }
                     // Array Field Binding
                     else if ("getList" == key) {
                         var $listData = $jsonData.servicedata[_quicsjson[key]];
                         kbstar.DataBinder.quicsArrData($(this), $listData, $jsonData);
                         $(this).show();
                     }
                     // More Array Field Binding
                     else if ("getListMore" == key) {
                         var $listData = $jsonData.servicedata[_quicsjson[key]];
                         kbstar.DataBinder.quicsArrDataMore($(this),$listData, $jsonData);
                         $(this).show();
                     } else if ("select" == key) {
                         var $listData = $jsonData.servicedata[_quicsjson[key]];
                         kbstar.DataBinder.quicsArrData_select($(this), $listData);
                         $(this).show();
                     }
                     // radio list Field Binding
                     else if ("radio" == key) {
                         var $listData = $jsonData.servicedata[_quicsjson[key]];
                         kbstar.DataBinder.quicsArrData_radio($(this), $listData);
                         $(this).show();
                     }
                     // checkbox list Field Binding
                     else if ("checkbox" == key) {
                         var $listData = $jsonData.servicedata[_quicsjson[key]];
                         kbstar.DataBinder.quicsArrData_checkbox($(this), $listData);
                         $(this).show();
                     }
                     // file text(html) Binding
                     else if ("fileinclude" == key) {
                         kbstar.DataBinder.quicsIncludeFile($(this));
                         $(this).show();
                     }
                     // page text(html) Binding
                     else if ("pageinclude" == key) {
                         kbstar.DataBinder.quicsIncludePage($(this));
                         $(this).show();
                     }
                 });
                 
                 if(typeof caq_includeWithDataBindingSucc == 'function') caq_includeWithDataBindingSucc(bindingJson);
             }
         } catch (e) {
             kbstar.alert("kbstar.DataBinder.prototype.quicsDataBindingWithInclude error : " + e);
         }
     };

    /**
    * kbstar.DataBinder.quicsDataVisiable Visiable 바인딩
    * 
    * @param {Element}
    *            htmlElement
    * @param {String}
    *            quicsdata
    * @param {JSON}
    *            data
    */
    DataBinder.prototype.quicsDataVisiable = function(htmlElement, quicsdata, data) {
        try {
            var common = data.common;
            var servicedata = data.servicedata;

            var returns = eval(quicsdata);

            if (returns == true) {
                htmlElement.show();
            } else {
                htmlElement.hide();
            }
        } catch (e) {
            kbstar.alert("kbstar.DataBinder.prototype.quicsDataVisiable error : " + e);
        }
    };
    /**
    * kbstar.DataBinder.quicsDataIfStart if/else if/else 바인딩
    * 
    * @param {Element}
    *            htmlElement
    * @param {JSON}
    *            data
    */
    DataBinder.prototype.quicsDataIfStart = function(htmlElement, data) {
        try {
            var common = data.common;
            var servicedata = data.servicedata;

            var if_division = false;
            var $qe = htmlElement;
            $qe.find(">*[data-quics]").each(function() {
                var _quicsjson = JSON.parse($(this).attr("data-quics"));
                var key = Object.keys(_quicsjson);

                if ("if" == key) {
                    var returns = eval(_quicsjson[key]);
                    if (returns) {
                        if_division = true;
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                } else if ("elseif" == key) {
                    var returns = eval(_quicsjson[key]);

                    if (returns && !if_division) {
                        if_division = true;
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                } else if ("else" == key) {
                    if (!if_division) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                }
            });

        } catch (e) {
            kbstar.alert("kbstar.DataBinder.quicsDataif error : " + e);
        }
    };
    /**
    * kbstar.DataBinder.quicsArrData 반복 바인딩
    * 
    * @param {Element}
    *            htmlElement
    * @param {JSON}
    *            data - listdata
    * @param {JSON}
    *            jsonData - totaldata
    */
    DataBinder.prototype.quicsArrData = function(htmlElement, data, jsonData) {
        try {
            var $qelement = htmlElement;
            var $listData = data;
            var $jsonData = jsonData;
            var $serviceData = null;
            if ($jsonData != undefined && $jsonData.servicedata != undefined) {
                $serviceData = $jsonData.servicedata;
            }
            var $targetObj = $qelement.children().first();
            var hasNoDataView = false;
            var $hasNoDataObj = null;

            if ($qelement.children().length > 1) {
                if ($qelement.children().last().attr("data-quics") != undefined) {
                    var _quicsjson = JSON.parse($qelement.children().last().attr("data-quics"));
                    var key = Object.keys(_quicsjson);
                    if ("hasNoData" == key) {
                        hasNoDataView = true;
                        $hasNoDataObj = $qelement.children().last();
                    }
                }
            }
            $qelement.children("*:gt(0)").remove();
            $targetObj.attr("data-index", "");
            if ($listData != undefined) {
                if (hasNoDataView) {
                    if ($listData.length == 0) {
                        $targetObj.attr('style', 'display:none;');
                        $hasNoDataObj.attr('style', 'display:;');
                        $qelement.append($targetObj);
                    } else {
                        $targetObj.attr('style', 'display:;');
                        $hasNoDataObj.attr('style', 'display:none;');
                    }
                }
                $.each($listData, function(i, val) {
                    if (0 < i) {
                        $targetObj = $qelement.children().first().clone();
                    }
                    $targetObj.attr("data-index", i);

                    // 웹접근성 적용
                    window.COMMON.setWebAccessibilityTag(val, $targetObj.find("[data-wat]").addBack(), i + 1);
                    $targetObj.find("[data-quics]")
                        .addBack()
                        .each(function(idx) {
                            if ($(this).attr("data-quics") != undefined) {
                                var _quicsjson = JSON.parse($(this).attr("data-quics"));
                                var key = Object.keys(_quicsjson);
                                if ("arrVisiable" == key) {
                                    kbstar.DataBinder.quicsDataVisiable($(this), _quicsjson[key], val);
                                } else if ("visiable" == key) {
                                    if ($jsonData != undefined) {
                                        kbstar.DataBinder.quicsDataVisiable($(this), _quicsjson[key], $jsonData);
                                    }
                                } else if ("start" == key) {
                                    kbstar.DataBinder.quicsDataIfStart($(this), val);
                                    $(this).show();
                                }
                                var elementType = this.type;
                                if (elementType != undefined && elementType != null){
                                    elementType = elementType.toLowerCase();
                                }
                                var elementName = this.tagName;
                                if (elementName != undefined && elementName != null){
                                    elementName = elementName.toLowerCase();
                                }
                                if ("get" == key) {
                                    if ($serviceData != undefined && $serviceData != null) {
                                        if (elementType == "text"
                                                || elementType == "hidden"
                                                || elementType == "textarea"
                                                || elementType == "password"
                                                || elementType == "tel"
                                                || elementType == "url"
                                                || elementType == "email"
                                                || elementType == "search") {
                                            $(this).val(window.COMMON.decUriCompData($serviceData[_quicsjson[Object.keys(_quicsjson)]], $(this)));
                                        } else {
                                            if (elementType == 'radio' || elementType == 'checkbox') {
                                                if ($(this).val() == $serviceData[_quicsjson[Object.keys(_quicsjson)]]){
                                                    $(this).attr('checked', true);
                                                }
                                            } else if (elementType == 'select-one') {
                                                if ($serviceData[_quicsjson[key]] != undefined) {
                                                    if ($serviceData[_quicsjson[key]].indexOf("<option") == -1) {
                                                        $(this).val($serviceData[_quicsjson[Object.keys(_quicsjson)]]);
                                                    } else {
                                                        $(this).html($serviceData[_quicsjson[Object.keys(_quicsjson)]]);
                                                    }
                                                }
                                            } else {
                                                $(this).html(window.COMMON.decUriCompData($serviceData[_quicsjson[Object.keys(_quicsjson)]], $(this)));
                                            }
                                        }
                                    }
                                } else {
                                    if (elementType == "text"
                                            || elementType == "hidden"
                                            || elementType == "textarea"
                                            || elementType == "password"
                                            || elementType == "tel"
                                            || elementType == "url"
                                            || elementType == "email"
                                            || elementType == "search") {
                                        $(this).val(window.COMMON.decUriCompData(val[_quicsjson[Object.keys(_quicsjson)]], $(this)));
                                    } else {
                                        if (elementType == 'radio'
                                                || elementType == 'checkbox') {
                                            if (typeof (_quicsjson) == 'string') {
                                                if (key == "value") {
                                                    if (val[_quicsjson[Object.keys(_quicsjson)]] == "index") {
                                                        $(this).attr("value", i);
                                                    } else {
                                                        $(this).attr("value", val[_quicsjson[Object.keys(_quicsjson)]]);
                                                    }
                                                } else {
                                                    if ($(this).val() == val[_quicsjson[Object.keys(_quicsjson)]]) {
                                                        $(this).attr('checked', true);
                                                    } else {
                                                        $(this).attr('checked', false);
                                                    }
                                                }
                                            } else {
                                                if (_quicsjson.value == "index") {
                                                    $(this).attr("value", i);
                                                } else {
                                                    $(this).attr("value", val[_quicsjson.value]);
                                                }
                                                if ($(this).val() == val[_quicsjson.attr]) {
                                                    $(this).attr('checked', true);
                                                } else {
                                                    $(this).attr('checked', false);
                                                }
                                            }
                                        } else if (elementType == 'select-one') {
                                            if ($serviceData != undefined
                                                    && $serviceData != null) {
                                                if ($serviceData[_quicsjson[key]] != undefined) {
                                                    if ($serviceData[_quicsjson[key]].indexOf("<option") == -1) {
                                                        $(this).val(val[_quicsjson[Object.keys(_quicsjson)]]);
                                                    } else {
                                                        $(this).html(val[_quicsjson[Object.keys(_quicsjson)]]);
                                                    }
                                                }
                                            }
                                        } else {
                                            if (elementName
                                                    .toLowerCase() == "img") {
                                                $(this).attr("src", val[_quicsjson[Object.keys(_quicsjson)]]);
                                            } else {
                                                $(this).html(window.COMMON.decUriCompData(val[_quicsjson[Object.keys(_quicsjson)]], $(this)));
                                            }
                                        }
                                    }
                                }

                                if (null != $(this).attr("onclick")) {
                                    $(this).attr("data-index", i);
                                }
                            }
                        });
                    $qelement.append($targetObj);
                });
            } else {
                if (hasNoDataView) {
                    $targetObj.attr('style', 'display:none;');
                    $hasNoDataObj.attr('style', 'display:;');
                    $qelement.append($targetObj);
                }
            }
            if (hasNoDataView) {
                $qelement.append($hasNoDataObj);
            }
        } catch (e) {
            kbstar.alert("kbstar.DataBinder.quicsArrData error : " + e);
        }
    };
    /**
    * kbstar.DataBinder.quicsArrDataMore 반복 바인딩(더보기기능시)
    * 
    * @param {Element}
    *            htmlElement
    * @param {JSON}
    *            data - listdata
    * @param {JSON}
    *            jsonData - totaldata
    */
    DataBinder.prototype.quicsArrDataMore = function(htmlElement, data, jsonData) {
        try {
            var $qelement = htmlElement;
            var $listData = data;
            var $jsonData = jsonData;
            var $serviceData = null;
            if ($jsonData != undefined && $jsonData.servicedata != undefined) {
                $serviceData = $jsonData.servicedata;
            }
            var hasNoDataView = false;
            var $hasNoDataObj = null;
            if ($qelement.children().length > 1) {
                if ($qelement.children().last().attr("data-quics") != undefined) {
                    var _quicsjson = JSON.parse($qelement.children().last().attr("data-quics"));
                    var key = Object.keys(_quicsjson);
                    if ("hasNoData" == key) {
                        hasNoDataView = true;
                        $hasNoDataObj = $qelement.children().last();
                        $qelement.children().last().remove();
                    }
                }
            }
            var $targetObj = $qelement.children().last();
            var _index = Number($targetObj.attr("data-index")) || 0;
            if ($listData != undefined) {
                if (hasNoDataView) {
                    if ($listData.length == 0) {
                        if (isNaN($targetObj.attr("data-index"))
                                || $targetObj.attr("data-index") == "") {
                            $targetObj.attr('style', 'display:none;');
                            $hasNoDataObj.attr('style', 'display:;');
                            $qelement.append($targetObj);
                        }
                    } else {
                        $targetObj.attr('style', 'display:;');
                        $hasNoDataObj.attr('style', 'display:none;');
                    }
                }
                $.each($listData, function(i, val) {
                    if (0 < i) {
                        $targetObj = $qelement.children().last().clone();
                        _index = _index + 1;
                    } else {
                        if ($qelement.children().length > 1) {
                            $targetObj = $qelement.children().last().clone();
                            _index = _index + 1;
                        } else {
                            if (_index == 0) {
                                if (!isNaN($targetObj.attr("data-index")) && $targetObj.attr("data-index") != "") {
                                    $targetObj = $qelement.children().last().clone();
                                    _index = _index + 1;
                                }
                            }
                        }
                    }
                    $targetObj.attr("data-index", _index);
            
                    // 웹접근성 적용
                    window.COMMON.setWebAccessibilityTag(val, $targetObj.find(
                            "[data-wat]").addBack(), _index + 1);
            
                    $targetObj.find("[data-quics]").addBack().each(function(idx) {
                        if ($(this).attr("data-quics") != undefined) {
                            var _quicsjson = JSON.parse($(this).attr("data-quics"));
                            var key = Object.keys(_quicsjson);
                            if ("arrVisiable" == key) {
                                kbstar.DataBinder.quicsDataVisiable($(this), _quicsjson[key], val);
                            } else if ("visiable" == key) {
                                if ($serviceData != undefined) {
                                    kbstar.DataBinder.quicsDataVisiable($(this), _quicsjson[key], $jsonData);
                                }
                            } else if ("start" == key) {
                                kbstar.DataBinder.quicsDataIfStart($(this), val);
                                $(this).show();
                            }
                            var elementType = this.type;
                            if (elementType != undefined && elementType != null)
                                elementType = elementType.toLowerCase();
                            var elementName = this.tagName;
                            if (elementName != undefined && elementName != null)
                                elementName = elementName.toLowerCase();
                            if ("get" == key) {
                                if ($serviceData != undefined && $serviceData != null) {
                                    if (elementType == "text"
                                            || elementType == "hidden"
                                            || elementType == "textarea"
                                            || elementType == "password"
                                            || elementType == "tel"
                                            || elementType == "url"
                                            || elementType == "email"
                                            || elementType == "search") {
                                        $(this).val(window.COMMON.decUriCompData($serviceData[_quicsjson[Object.keys(_quicsjson)]], $(this)));
                                    } else {
                                        if (elementType == 'radio' || elementType == 'checkbox') {
                                            if ($(this).val() == $serviceData[_quicsjson[Object.keys(_quicsjson)]])
                                                $(this).attr('checked', true);
                                        } else if (elementType == 'select-one') {
                                            if ($serviceData[_quicsjson[key]] != undefined) {
                                                if ($serviceData[_quicsjson[key]].indexOf("<option") == -1) {
                                                    $(this).val($serviceData[_quicsjson[Object.keys(_quicsjson)]]);
                                                } else {
                                                    $(this).html($serviceData[_quicsjson[Object.keys(_quicsjson)]]);
                                                }
                                            }
                                        } else {
                                            $(this).html(window.COMMON.decUriCompData($serviceData[_quicsjson[Object.keys(_quicsjson)]], $(this)));
                                        }
                                    }
                                }
                            } else {
                                if (elementType == "text"
                                        || elementType == "hidden"
                                        || elementType == "textarea"
                                        || elementType == "password"
                                        || elementType == "tel"
                                        || elementType == "url"
                                        || elementType == "email"
                                        || elementType == "search") {
                                    $(this).val(window.COMMON.decUriCompData(val[_quicsjson[Object.keys(_quicsjson)]], $(this)));
                                } else {
                                    if (elementType == 'radio' || elementType == 'checkbox') {
                                        if (typeof (_quicsjson) == 'string') {
                                            if (key == "value") {
                                                if (val[_quicsjson[Object.keys(_quicsjson)]] == "index") {
                                                    $(this).attr("value", _index);
                                                } else {
                                                    $(this).attr("value", val[_quicsjson[Object.keys(_quicsjson)]]);
                                                }
                                            } else {
                                                if ($(this).val() == val[_quicsjson[Object.keys(_quicsjson)]]) {
                                                    $(this).attr('checked', true);
                                                } else {
                                                    $(this).attr('checked', false);
                                                }
                                            }
                                        } else {
                                            if (_quicsjson.value == "index") {
                                                $(this).attr("value", _index);
                                            } else {
                                                $(this).attr("value", val[_quicsjson.value]);
                                            }
                                            if ($(this).val() == val[_quicsjson.attr]) {
                                                $(this).attr('checked', true);
                                            } else {
                                                $(this).attr('checked', false);
                                            }
                                        }
                                    } else if (elementType == 'select-one') {
                                        if ($serviceData != undefined
                                                && $serviceData != null) {
                                            if ($serviceData[_quicsjson[key]] != undefined) {
                                                if ($serviceData[_quicsjson[key]].indexOf("<option") == -1) {
                                                    $(this).val(val[_quicsjson[Object.keys(_quicsjson)]]);
                                                } else {
                                                    $(this).html(val[_quicsjson[Object.keys(_quicsjson)]]);
                                                }
                                            }
                                        }
                                    } else {
                                        if (elementName == "img") {
                                            $(this).attr("src",val[_quicsjson[Object.keys(_quicsjson)]]);
                                        } else {
                                            $(this).html(window.COMMON.decUriCompData(val[_quicsjson[Object.keys(_quicsjson)]], $(this)));
                                        }
                                    }
                                }
                            }
                            if (null != $(this).attr("onclick")) {
                                $(this).attr("data-index", i);
                            }
                        }
                    });
                    $qelement.append($targetObj);
                });
            } else {
                if (hasNoDataView && (isNaN($targetObj.attr("data-index")) || $targetObj.attr("data-index") == "")) {
                    $targetObj.attr('style', 'display:none;');
                    $hasNoDataObj.attr('style', 'display:block;');
                    $qelement.append($targetObj);
                }
            }
            if (hasNoDataView) {
                $qelement.append($hasNoDataObj);
            }
        } catch (e) {
            kbstar.alert("kbstar.DataBinder.quicsArrDataMore error : " + e);
        }
    };
    /**
    * kbstar.DataBinder.quicsArrData_select selectbox 바인딩
    * 
    * @param {Element}
    *            htmlElement
    * @param {JSON}
    *            data - listdata
    */
    DataBinder.prototype.quicsArrData_select = function(htmlElement, data) {
        try {
            // if(data != undefined){
            var $qelement = htmlElement;
            var $listData = data;
            var $targetObj = $qelement.children().first();
            var option = $targetObj.attr("data-quics");
            var firstoption = "";
            var html = "";

            $qelement.find("option").remove();

            if ($listData == undefined || $listData.length == 0) {
                $qelement.children().remove();
                var _quicsjson = JSON.parse(option);
                if (_quicsjson.firstoption != "") {
                    firstoption = _quicsjson.firstoption;
                } else {
                    html = html + "<option data-quics='" + option + "'></option>";
                }
            } else {
                $.each($listData, function(i, val) {
                    if (null != $qelement.attr("onchange")) {
                        $qelement.attr("data-index", i);
                    }
                    // 웹접근성 적용
                    window.COMMON.setWebAccessibilityTag(val, $targetObj.find("[data-wat]").addBack(), i + 1);
                    $targetObj.find("[data-quics]").addBack().each(function(idx) {
                        var _quicsjson = JSON.parse($(this).attr("data-quics"));

                        if (idx == 0 && _quicsjson.firstoption != "")
                            firstoption = _quicsjson.firstoption;

                        var html_flag = false;
                        if (val[_quicsjson.chkflag] == true || val[_quicsjson.chkflag] == "selected") {
                            html_flag = "selected='selected'";
                        } else {
                            html_flag = "";
                        }
                        html = html + "<option data-quics='" + option
                                + "' value='" + val[_quicsjson.value]
                                + "' " + html_flag + " >"
                                + val[_quicsjson.disvalue] + "</option>";
                    });
                });
            }
            if (firstoption != "") {
                html = firstoption + html;
            }
            $qelement.append(html);
            $qelement.find("option:first").attr("data-quics", option);
        } catch (e) {
            kbstar.alert("kbstar.DataBinder.quicsArrData_select error : " + e);
        }
    };
    /**
    * kbstar.DataBinder.quicsArrData_radio radiobox 바인딩
    * 
    * @param {Element}
    *            htmlElement
    * @param {JSON}
    *            data - listdata
    */
    DataBinder.prototype.quicsArrData_radio = function(htmlElement, data) {
        try {
            var $qelement = htmlElement;
            var $listData = data;
            var $baseObj = $qelement.children();
            $qelement.children().remove();
            $.each($listData, function(i, val) {
                var $targetObj = $baseObj.clone();

                // 웹접근성 적용
                window.COMMON.setWebAccessibilityTag(val, $targetObj.find("[data-wat]").addBack(), i + 1);

                $targetObj.find("[data-quics]").addBack().each(function(idx) {
                    var _quicsjson = JSON.parse($(this).attr("data-quics"));
                    var elementType = this.type;
                    if (elementType != undefined && elementType != null)
                        elementType = elementType.toLowerCase();
                    if (elementType == 'radio') {
                        $(this).attr("value", val[_quicsjson.value]);
                        if (val[_quicsjson.flag] == true) {
                            $(this).attr("checked", "checked");
                        }
                        $(this).attr("data-index", i);
                    } else {
                        $(this).html(window.COMMON.decUriCompData(val[_quicsjson[Object.keys(_quicsjson)]], $(this)));
                    }
                });
                $qelement.append($targetObj);
            });
        } catch (e) {
            kbstar.alert("kbstar.DataBinder.quicsArrData_radio error : " + e);
        }
    };
    /**
    * kbstar.DataBinder.quicsArrData_checkbox checkbox 바인딩
    * 
    * @param {Element}
    *            htmlElement
    * @param {JSON}
    *            data - listdata
    */
    DataBinder.prototype.quicsArrData_checkbox = function(htmlElement, data) {
        try {
            var $qelement = htmlElement;
            var $listData = data;
            var $baseObj = $qelement.children();
            $qelement.children().remove();
            $.each($listData, function(i, val) {
                var $targetObj = $baseObj.clone();
                // 웹접근성 적용
                window.COMMON.setWebAccessibilityTag(val, $targetObj.find("[data-wat]").addBack(), i + 1);

                $targetObj.find("[data-quics]").addBack().each(function(idx) {
                    var _quicsjson = JSON.parse($(this).attr("data-quics"));
                    var elementType = this.type;
                    if (elementType != undefined && elementType != null)
                        elementType = elementType.toLowerCase();
                    if (elementType == 'checkbox') {
                        $(this).attr("value", val[_quicsjson.value]);
                        if (val[_quicsjson.flag] == true) {
                            $(this).attr("checked", "checked");
                        }
                        $(this).attr("data-index", i);
                    } else {
                        $(this).html(window.COMMON.decUriCompData(val[_quicsjson[Object.keys(_quicsjson)]], $(this)));
                    }
                });
                $qelement.append($targetObj);
            });
        } catch (e) {
            kbstar.alert("kbstar.DataBinder.quicsArrData_checkbox error : " + e);
        }
    };
    /**
    * kbstar.DataBinder.quicsIncludeFile file Include(jsp)바인딩
    * 
    * @param {Element}
    *            htmlElement
    */
    DataBinder.prototype.quicsIncludeFile = function(htmlElement) {
        try {
            var $qelement = htmlElement;
            /*
             * 구속성 상품 가입으로 인해 수정된 부분
             */
            kbstar.include_obj_arr.push($qelement);
            /*
             * \구속성 상품 가입으로 인해 수정된 부분
             */
            var TEMPLATE_PATH_SERVER = "";

            var _quicsjson = JSON.parse($qelement.attr("data-quics"));

            var fileInfo = _quicsjson.fileinclude;

            // Orchestra Simulator : froxy 서버 관련으로 도메인 제거
            if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
                if (fileInfo.indexOf("html") > -1) {
                    TEMPLATE_PATH_SERVER = "/mnbank/app/html/" + fileInfo;
                } else {
                    TEMPLATE_PATH_SERVER = "/mquics?asfilecode=" + fileInfo;
                }
            } else {
                if (fileInfo.indexOf("html") > -1) {
                    TEMPLATE_PATH_SERVER = kbstarCommon._DOMAIN + "/mnbank/app/html/" + fileInfo;
                } else {
                    TEMPLATE_PATH_SERVER = kbstarCommon._DOMAIN + "/mquics?asfilecode=" + fileInfo;
                }
            }
            
            $.get(TEMPLATE_PATH_SERVER, function(src) {
                var includeString = "";
                $($.parseHTML(src)).find("#content").addBack().each(function() {
                    if ("content" == $(this).attr("id")) {
                        includeString = $(this).html().toString();
                    }
                });
                if (includeString == undefined || includeString == null
                        || includeString == "") {
                    $qelement.html(window.SPA_COMMON.changeVar(src));
                } else {
                    $qelement.html(includeString);
                }
            }, "text");
        } catch (e) {
            kbstar.alert("kbstar.DataBinder.quicsIncludeFile error : " + e);
        }
    };
    /**
    * kbstar.DataBinder.quicsIncludePage page Include 바인딩
    * 
    * @param {Element}
    *            htmlElement
    */
    DataBinder.prototype.quicsIncludePage = function(htmlElement) {
        try {
            var $qelement = htmlElement;

            /*
             * 구속성 상품 가입으로 인해 수정된 부분
             */
            kbstar.include_obj_arr.push($qelement);
            /*
             * \구속성 상품 가입으로 인해 수정된 부분
             */

            var _quicsjson = JSON.parse($qelement.attr("data-quics"));
            var pageInfo = _quicsjson.pageinclude;
            
            if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
                //var TEMPLATE_PATH_SERVER = kbstarCommon._DOMAIN + "/mquics?QAction=1034972";
                var TEMPLATE_PATH_SERVER = "/mquics?QAction=1034972";    // Orchestra Simulator : froxy 서버 관련으로 도메인 제거
                $.get(TEMPLATE_PATH_SERVER, {
                    "includePage" : pageInfo
                }, function(data) {
                    var jsonData = JSON.parse(data);
                    var src = jsonData.msg.servicedata.resultHtml;
                    var includeString = "";
                    $($.parseHTML(src)).find("#content").addBack().each(function() {
                        if ("content" == $(this).attr("id")) {
                            includeString = $(this).html().toString();
                        }
                    });
                    if (includeString == undefined || includeString == null || includeString == "") {
                        $qelement.html(window.SPA_COMMON.changeVar(src));
                    } else {
                        $qelement.html(includeString);
                    }
                }, "text");
            }else{
                window.HTTP.addRequestFileQueue(function(data){
                    var src = decodeURIComponent(data);
                    var includeString = "";
                    $($.parseHTML(src)).find("#content").addBack().each(function() {
                        if ("content" == $(this).attr("id")) {
                            includeString = $(this).html().toString();
                        }
                    });
                    if (includeString == undefined || includeString == null || includeString == "") {
                        $qelement.html(window.SPA_COMMON.changeVar(src));
                    } else {
                        $qelement.html(includeString);
                    }
                    iscroll.refresh();
                }, function(data){
                    alert("약관파일을 가져오지 못했습니다.\n다시 시도해 주세요.");
                    if (device.devicetype == "tablet") {
                        window.configManager.moveToBankHome();
                    } else {
                        window.navi.goBackWithCount();
                    }
                }, "file://"+pageInfo, "GET");
            }
        } catch (e) {
            kbstar.alert("kbstar.DataBinder.quicsIncludePage error : " + e);
        }
    };
    var orchestra = {};
    kbstar.addConstructor(function() {
        orchestra.DataBinder = kbstar.DataBinder = window.DataBinder = new DataBinder();
    });
}
if (!kbstar.hasResource("ContactsManager")) {
    kbstar.addResource("ContactsManager");
    
    var ContactsManager = function() {
    };

    // 2021.06.22 신재현 중복으로인한 삭제 요청
    //ContactsManager.prototype.getContacts = function(contactsCallback) {
    //	kbstar.exec(contactsCallback, null, "ContactsManager", "requestContacts");
    //};

    ContactsManager.prototype.requestContacts = function(contactsCallback) {
    	kbstar.exec(contactsCallback, null, "ContactsManager", "requestContacts");
    };

    kbstar.addConstructor(function() {
        window.ContactsManager = new ContactsManager();
    });
}

/**
 * adbrixManager - Adbrix 함수
 * 
 * @class Adbrix 서버에 값 전송
 * @author 한용희
 * @version 1.0
 * @since 2021.07.06
 */
if (!kbstar.hasResource("adbrixManager")) {
    kbstar.addResource("adbrixManager");

    var adbrixManager = function() {
    };
    
	/**
     * kbstar.adbrixManager.prototype.setAdbrixEvent
     * setAdbrixEvent AdbrixEvent 세팅 함수
     * 
     * @param eventname adbrix에 올릴 이벤트이름
	 * @param data eventname에 같이 올릴 데이터 파일들 ex) {"user":"user", "abc" : "abc"...} 
     */
    adbrixManager.prototype.setAdbrixEvent = function(eventname, data) {
		var params = {
			eventname : eventname,
			data : data
		}
        if (!device.platform.match(/Orchestra Simulator/)) {
            kbstar.exec(null, null, "AdbrixManager", "setAdbrixEvent", params);
        }
    };

	kbstar.addConstructor(function() {
        window.adbrixManager = new adbrixManager();
    });
}

/**
 * class MobileOtpManager
 */
if (!kbstar.hasResource("MobileOtpManager")) {
    kbstar.addResource("MobileOtpManager");

    var MobileOtpManager = function() {
    };
    
	/**
     * 모바일OTP SafeBox 버전정보 및 발급된 OTP일련번호 조회
     * 
     * @param successCallback
	 * @param failCallback
     */
    MobileOtpManager.prototype.getAllInfo = function(successCallback, failCallback) {
        if (!device.platform.match(/Orchestra Simulator/)) {
            kbstar.exec(successCallback, failCallback, "MobileOtpManager", "getAllInfo");
        }
    };

	/**
     * 모바일OTP 발급
     * 
     * @param successCallback
	 * @param failCallback
	 * @param otpAlias			OTP일련번호
	 * @param otpKey1
     * @param otpKey2
	 */
	MobileOtpManager.prototype.issue = function(successCallback, failCallback, otpAlias, otpKey1, otpKey2) {
		var params = {
			otpAlias : otpAlias,
			otpKey1 : otpKey1,
			otpKey2 : otpKey2
		};
        if (!device.platform.match(/Orchestra Simulator/)) {
            kbstar.exec(successCallback, failCallback, "MobileOtpManager", "issue", params);
        }
    };

	/**
     * 모바일OTP 생성
     * 
     * @param successCallback
	 * @param failCallback
	 * @param otpAlias		 OTP일련번호
     * @param otpTime	   암호화된 OTP Time
	 * @param hti			   해싱된 거래정보 (64자리)
	 * @param isEncrypt		 암호화여부, 자동:Y 수동:N
	 */
	MobileOtpManager.prototype.generate = function(successCallback, failCallback, otpAlias, otpTime, hti, isEncrypt) {
    	var _hti = hti;
        if (_hti == undefined || _hti == "")
        	_hti = "0000000000000000000000000000000000000000000000000000000000000000"; // hti 값이 없을 때 0으로 채워줌
		var params = {
			otpAlias : otpAlias,
			otpTime : otpTime,
			hti : _hti,
			isEncrypt : isEncrypt
		};
        if (!device.platform.match(/Orchestra Simulator/)) {
            kbstar.exec(successCallback, failCallback, "MobileOtpManager", "generate", params);
        }
    };

	/**
     * 모바일OTP 폐기
     * 
     * @param successCallback
	 * @param failCallback
	 * @param otpAlias			OTP일련번호
	 */
	MobileOtpManager.prototype.disuse = function(successCallback, failCallback, otpAlias) {
        if (!device.platform.match(/Orchestra Simulator/)) {
            kbstar.exec(successCallback, failCallback, "MobileOtpManager", "disuse", {otpAlias : otpAlias});
        }
    };

	kbstar.addConstructor(function() {
        window.mobileOtpManager = new MobileOtpManager();
    });

}

if (!kbstar.hasResource("ExtendPlatformManager")) {
    kbstar.addResource("ExtendPlatformManager");
    
    /**
     * class ExtendPlatformManager
     */
    var ExtendPlatformManager = function() {
        onCloseCallback: null;
        mOpener: null;
    };

   /**
     * 확장형플랫폼 웹뷰 열기
     * @param url {String}: 접속 URL
     * @param icon {String}: 계열사 아이콘 이미지
     * @param title {String}: 타이틀
     * @param param {Object}: 파라메터
     * @param onCloseData {Object}: 네이티브의 상단 닫기 버튼을 눌렀을 때 호출한 페이지로 전달할 데이터
     * @param onCloseCallback {function}: 확장형플랫폼 웹뷰를 닫을 때 호출될 콜백함수
     * @param isMinimum {String}: 확장형플랫폼 웹뷰 창간 최소화 가능여부 
     */
    ExtendPlatformManager.prototype.openExtendWebView = function(url, icon, title, onCloseData, onCloseCallback, isMinimum) {
        this.onCloseCallback = onCloseCallback;

        if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
            this.mOpener = window;

            var key = Object.keys(_params);
            var _opjParam = "";
            for (key in _params) {
                _opjParam += "&" + key + "=" + _params[key];
            }
            caq.popup.iFrameShow("extendPop", caq.util.encodeURI(url + _opjParam), null);
        } else {
        	// 창간 최소화 가능 여부(default : Y)
        	if(isMinimum == undefined || isMinimum != "N") {
        		isMinimum = "Y";
        	}
        	
            let local_params = {
                "url" : url,
                "icon" : icon,
                "title" : title,
                "isMinimum" : isMinimum, 	// 창간 최소화 가능 여부
                "onCloseData" : onCloseData
            }
            
            kbstar.exec(null, null, "ExtendPlatformManager", "openExtendWebView", local_params);

            window.ExtendPlatformManager.onClose = function(ret) {
                if (ret != "noSendData") {
                    if (this.onCloseCallback && typeof this.onCloseCallback == 'function')
                        this.onCloseCallback(ret);
                }
            };
        }
    };

    /**
     * 확장형플랫폼 웹뷰 닫기
     * 
     * @param returnData {JSONString}:
     *            호출한 하이브리드 페이지의 콜백함수에 전달할 데이터 객체
     */
    ExtendPlatformManager.prototype.closeExtendWebView = function(returnData) {
        if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
            var rtnVar;
            if(typeof returnData == 'object'){
                rtnVar = returnData;
            }else if(typeof ret == 'string' && ret != ''){
                rtnVar = JSON.parse(returnData);
            }else{
                rtnVar = {};
            }
            if (this.mOpener == window) {
                if (this.onCloseCallback
                        && typeof this.onCloseCallback == 'function')
                    this.onCloseCallback(rtnVar);
                caq.popup.iFrameHide();
            } else {
                if(window.location != window.parent.location) {
                    parent.window.appManager.closeExtendWebView(rtnVar);
                }
            }
        
        } else {
            kbstar.exec(null, null, "ExtendPlatformManager", "closeExtendWebView", { "returnData" : returnData });
        }
    };

    /**
     * 닫기 데이터 얻기
     * 
     * @param successCallback {function}:
     *            성공콜백
     */
    ExtendPlatformManager.prototype.getCloseData = function(successCallback) {
        kbstar.exec(successCallback, null, "ExtendPlatformManager", "getCloseData", {});
    };

    /**
     * 확장형플랫폼 데이터 저장
     * 
     * @param successCallback {function}:
     *            성공콜백
     * @param failCallback {function}:
     *            실패콜백
     * @param data {Object}:
     *            data
     */
    ExtendPlatformManager.prototype.setExtendData = function(successCallback, failCallback, data) {
        kbstar.exec(successCallback, failCallback, "ExtendPlatformManager", "setExtendData", { "data" : data });
    };

    /**
     * 확장형플랫폼 데이터 저장
     * 
     * @param successCallback {function}:
     *            성공콜백
     * @param failCallback {function}:
     *            실패콜백
     */
    ExtendPlatformManager.prototype.getExtendData = function(successCallback, failCallback) {
        kbstar.exec(successCallback, failCallback, "ExtendPlatformManager", "getExtendData", {});
    };

    /**
     * 내장 브라우저로 링크 호출
     * 
     * @param url {String}:
     *            접속 URL
     * @param params {Object}:
     *            파라메터
     */
    ExtendPlatformManager.prototype.openExternalLink = function(url, params) {
        let _params = {
            "url" : url,
            "params" : params == null ? "" : params
        }
        kbstar.exec(null, null, "ExtendPlatformManager", "openExternalLink", _params);
    };

    /**
     * 확장형플랫폼 데이터 서명
     * 
     * @param successCallback {function}:
     *            성공콜백
     * @param failCallback {function}:
     *            실패콜백
     * @param serNo {String}:
     *            원문 시리얼 넘버
     * @param orgCtnt {String}:
     *            원문 내용
     * @param authType {String}:
     *            인증 타입 - 1(PIN), 2(Pattern+Bio), 3(Pattern), 4(PIN+Bio)-기본
     */
    ExtendPlatformManager.prototype.requestKBCertSign = function(successCallback, failCallback, serNo, orgCtnt, authType) {
        let params = {
            "serNo" : serNo,
            "orgCtnt" : orgCtnt == null ? "" : orgCtnt,
            "authType" : authType == null ? "4" : authType
        }
        kbstar.exec(successCallback, failCallback, "ExtendPlatformManager", "requestKBCertSign", params);
    };

    kbstar.addConstructor(function() {
        window.ExtendPlatformManager = new ExtendPlatformManager();
    });
}

kbstar.connect = {
    successCallback : -1,
    failCallback : -1,
    unbinding : false,
    noreturn : false,
    fileInclude : false,
    isQAction : false,
    QAction_flag : false,
    loadingFlag_false : false,
    sendrequest_able_flag : true,
    
    /**
     * Q Action 통신 함수
     * 
     * @param (String)url
     * @param (JSON)param
     * @param (Function)success
     * @param (Function)fail
     * @param (Boolean)unbind
     *            바인딩이 필요 없는경우 true
     * @param (Boolean)loadingFlag
     *            로딩이 필요 없는 경우 true
     * @param (Boolean)noreturn
     *            콜백이나 데이터를 받을 필요 없는경우 true
     * @param (Boolean)fileInclude
     *            fileInclude에서 호출했을 경우 true
     * @param (Boolean)loadingFlag_false
     *            통신후 로딩뷰를 닫고 싶지 않을 경우true
     * @param (Boolean)showProgressFlag
     *            Ajax요청 네트워크 프로그레스바를 보여줄지 여부값[true:보임(기본), false: 숨김]
     * @param (Boolean)showKeypadFlag
     *            Ajax요청 네트워크 요청시 입력중인 키패드를 보여줄지 여부값 [true:보임, false: 숨김(기본)]
     * @param (Boolean)timeOutFlag
     *            Ajax요청 네트워크 요청시 2초 Timeout 여부 [true:사용, false: 사용안함]
     */
    request : function(url, param, success, fail, unbind,
            loadingFlag, noreturn, fileInclude, loadingFlag_false,
            showProgressFlag, showKeypadFlag, timeoutFlag) {
        try {
        	let bTimeoutFlag = ((typeof timeoutFlag) == "undefined") ? true : timeoutFlag;
            let bShowProgressFlag = ((typeof showProgressFlag) == "undefined") ? true : showProgressFlag;
        	if(bTimeoutFlag) {
        		
	            if (true/*kbstar.connect.sendrequest_able_flag*/) {
	            	kbstar.connect.sendrequest_able_flag = false;
	                setTimeout(function() {
	                    kbstar.connect.sendrequest_able_flag = true;
	                }, 2000);
	                
	                kbstar.connect.successCallback = success;
	                kbstar.connect.failCallback = fail;
	                kbstar.connect.unbinding = unbind || false;
	                kbstar.connect.noreturn = noreturn || false;
	                kbstar.connect.fileInclude = fileInclude || false;
	                kbstar.connect.loadingFlag_false = loadingFlag_false || false;
	                var bLoadingFlag = true;
	                if (loadingFlag != undefined) {
	                    bLoadingFlag = loadingFlag;
	                }
	                if (-1 < url.indexOf('QAction')) {
	                    kbstar.connect.isQAction = true;
	                } else {
	                    kbstar.connect.isQAction = false;
	                }
	
	                // 이부분 사용할 지 여부 체크 필요 : ShowProgressFlag
	                //if (bLoadingFlag) {
	                //    window.uicontrols.showLoading(true, false);
	                //}
	
	                var bShowKeypadFlag = ((typeof showKeypadFlag) == "undefined") ? false : showKeypadFlag;
	                window.uicontrols.setShowKeypadFlag(bShowKeypadFlag);
	
	                window.HTTP.sendRequest(kbstar.connect.commonSuccess, kbstar.connect.commonFail, url, "POST", param, "divisioin", ""+bShowProgressFlag);
	            } else {
	            }
            
        	} else {
        		window.HTTP.asyncSendRequest(success, fail, url, "POST", param, "divisioin",fileInclude, ""+bShowProgressFlag);
        	}
        } catch (e) {
            kbstar.alert("kbstar.connect.request Error : " + e);
        }
    },

    /**
     * kbstar.connect.commonSuccess 공통 SuccessCallback QAction 네이티브 통신후
     * 네이티브에서 호출하는 콜백
     * 
     * @param {JSON}
     *            data
     * @returns {JSON} callback function with JSON data
     */
    commonSuccess : function(data) {
        try {
            kbstar.connect.sendrequest_able_flag = true;
            if (kbstar.connect.noreturn == true
                    || kbstar.connect.fileInclude == true) {
                if (typeof kbstar.connect.successCallback == "function") {
                    kbstar.connect.successCallback(data);
                }
                return false;
            }
            if (data != undefined) {
                kbstar.connect.commonData(data);
            }
        } catch (e) {
            kbstar.alert("CommonSuccess Error : " + e);
        }
    },
    /**
     * kbstar.connect.commonFail 공통 FailCallBack
     * @param {JSON}
     *            data
     */
    commonFail : function(data) {
        kbstar.connect.sendrequest_able_flag = true;
        try {
            if (typeof kbstar.connect.failCallback == "function") {
                kbstar.connect.failCallback(data.data);
            }
        } catch (e) {
            kbstar.alert("kbstar.connect.commonFail Error : " + e);
        }
    },
    commonData : function(json) {
        try {

            var msg = json.data.msg;
            var common = msg.common;

            if (common.status == "S") {
                if (msg.servicedata != undefined) {
                    // PAGE ID 설정
                    kbstarCommon.asisPageInfo = window.SPA.getCurrentPageId();

                    // 페이지 타이틀 설정
                    var pageTitle = msg.servicedata.pageTitle;
                    if (pageTitle != undefined) {
                        window.COMMON.setTitleName(pageTitle);
                    }
                    // 별찾기
                    /*
                    var s_point = msg.servicedata.S_STAR_FIND || "pagecodenone";
                    var s_pointHTML = '<div id="s_pointHTML" class="star_pileup"><div class="btn_wrap_star_pileup"><a href="" class="starclose" onclick="javascript:$("#s_pointHTML").hide();return false;">닫기</a><p class="btn_star_pileup"><a href="" onclick="window.COMMON.s_point_action();return false;"><span>★별 적립하기</span></a></p></div></div>';
                    if (s_point == msg.servicedata.page) {
                        if ($("#s_pointHTML")) {
                            $("#s_pointHTML").remove();
                        }
                        $('body').prepend(s_pointHTML);
                    }
                    // 별적립
                    window.AppInfoManager.requestLoginStatus(function(ret) {
                        if (ret == "02" || ret == "03") {
                            var s_search = msg.servicedata.S_STAR_FUND || "pagecodenone";
                            var s_searchHTML = '<div id="s_searchHTML" class="star_pileup_box_wrap"><div class="star_pileup_box"><p class="tit">★이 적립되는 메뉴입니다.  </p><p class="mt5">My★조회에서 상세내역을 확인하실 수 있습니다.</p><p class="mt5"><button id="btn_star_search" type="button" class="btn06" style="display:none;" onclick="window.COMMON.s_search_action();">My★조회</button></p></div><p class="item_desc"><span>*</span>디바이스 및 시스템 상황에 따라 반영 시간의 차이가 있을 수 있습니다. </p></div>';
                            if (s_search == msg.servicedata.page) {
                                if ($("#s_searchHTML")) {
                                    $("#s_searchHTML").remove();
                                }
                                $('body').append(s_searchHTML);
//                                kbstar.alert("msg.servicedata.loyaltyCode : button show : 001 - " + msg.servicedata.loyaltyCode);
                                if (msg.servicedata.loyaltyCode != "001") {
                                    $("#btn_star_search").show();
                                }
                            }
                        }
                    });
                    */
                    // 공지 팝업 처리
                    var popupHTML = msg.servicedata.popup;

                    if (popupHTML != undefined) {
                        var popnum = popupHTML.substring(popupHTML.indexOf("pid_") + 4, popupHTML.indexOf("pid_") + 4 + 7);
//                        kbstar.alert("팝업 ID :" + popnum);
                        if (device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()) {
                            var temp_cookie = document.cookie;

                            if (temp_cookie.indexOf("notOpen_" + popnum) == -1) {
                                window.COMMON.insertPopupHTML(popupHTML);
                            }
                        } else {
                            window.UserPreference.getValue(function(ret) {
//                                kbstar.alert("팝업 expiredays 가져오기 완료 : " + ret);
                                var pop_expiredays = ret;
                                var today = new Date();
                                var crnt_time = today.setDate(today.getDate());
                                if (pop_expiredays <= crnt_time || pop_expiredays == undefined || pop_expiredays == "") {
                                    var temp_popupHTML = popupHTML.replace(/_tab_/gi, "\t\t");
                                    var temp_popupHTML2 = temp_popupHTML.replace(/_enter_/gi, "\r\n");
                                    popupHTML = temp_popupHTML2;
                                    window.COMMON.insertPopupHTML(popupHTML);
                                }
                            }, function() {
                            }, "notOpen_" + popnum);
                        }
                    }
                }
                if (kbstar.connect.unbinding == false) {
                    kbstar.DataBinder.quicsDataBinding(json);
                }

                if (typeof kbstar.connect.successCallback == "function") {
                    kbstar.connect.successCallback(json);
                }
            } else {
                // 리다이렉트 오류코드
                if (common.errorcode == "CAQ20041") {
                    if (common.errorurl != undefined) {
                        var pageid = '';;
                        var pageParam = '';;
                        var pageMove = '';;
                        var errorurl = common.errorurl.split(",");
                        for ( var i = 0; i < errorurl.length; i++) {
                            var temp = errorurl[i].split(':');
                            if (temp.length == 2) {
                                if (temp[0] == "pageCd") {
                                    pageid = temp[1];
                                } else if (temp[0] == "pageParam") {
                                    var pageObj = temp[1].split("&");
                                    var retObj = "";
                                    for ( var j = 0; j < pageObj.length; j++) {
                                        var _tmp = pageObj[j].split('=');
                                        if (_tmp.length == 2) {
                                            retObj += ',"' + _tmp[0] + '":"' + _tmp[1] + '"';
                                        }
                                    }
                                    retObj = '{' + retObj.substring(1) + '}';
                                    if (retObj.length > 0) {
                                        try {
                                            pageParam = JSON.parse(retObj);
                                        } catch (e) {
                                            pageParam = new Object();
                                        }
                                    } else {
                                        pageParam = new Object();
                                    }
                                } else if (temp[0] == "pageMove") {
                                    pageMove = temp[1];
                                }
                            }
                        }
                        if (pageMove != undefined && pageMove == "Y") {
                            var pageUrl = "/mquics?page=" + pageid;
                            window.navi.navigate(pageUrl, pageParam, function() {});
                        } else {
                            if (typeof kbstar.connect.failCallback == "function") {
                                kbstar.connect.failCallback(json.data);
                            }
                        }
                    }
                } else {
                    if (typeof kbstar.connect.failCallback == "function") {
                        kbstar.connect.failCallback(json.data);
                    }
                    
                }
            }
        } catch (e) {
        }
    }
};


/**
 * $(document).ready html 로드시 호출 처리
 */
$(document).ready(function() {
    if(device != undefined && device.platform != undefined && device.platform.match(kbstarCommon._BROWSER_TEST_PATTERN) || !window.COMMON.isNative()){
        window.COMMON.onDeviceReady();
        window.COMMON.onLayerSet();
    }
});


/**
* Mask Description d Day of the month as digits; no leading zero for
* single-digit days. dd Day of the month as digits; leading zero for
* single-digit days. ddd Day of the week as a three-letter abbreviation. dddd
* Day of the week as its full name. m Month as digits; no leading zero for
* single-digit months. mm Month as digits; leading zero for single-digit
* months. mmm Month as a three-letter abbreviation. mmmm Month as its full
* name. yy Year as last two digits; leading zero for years less than 10. yyyy
* Year represented by four digits. h Hours; no leading zero for single-digit
* hours (12-hour clock). hh Hours; leading zero for single-digit hours (12-hour
* clock). H Hours; no leading zero for single-digit hours (24-hour clock). HH
* Hours; leading zero for single-digit hours (24-hour clock). M Minutes; no
* leading zero for single-digit minutes. Uppercase M unlike CF timeFormat's m
* to avoid conflict with months. MM Minutes; leading zero for single-digit
* minutes. Uppercase MM unlike CF timeFormat's mm to avoid conflict with
* months. s Seconds; no leading zero for single-digit seconds. ss Seconds;
* leading zero for single-digit seconds. l or L Milliseconds. l gives 3 digits.
* L gives 2 digits. t Lowercase, single-character time marker string: a or p.
* No equivalent in CF. tt Lowercase, two-character time marker string: am or
* pm. No equivalent in CF. T Uppercase, single-character time marker string: A
* or P.Uppercase T unlike CF's t to allow for user-specified casing. TT
* Uppercase, two-character time marker string: AM or PM. Uppercase TT unlike
* CF's tt to allow for user-specified casing. Z US timezone abbreviation, e.g.
* EST or MDT. With non-US timezones or in the Opera browser, the GMT/UTC offset
* is returned, e.g. GMT-0500 No equivalent in CF. o GMT/UTC timezone offset,
* e.g. -0500 or +0230. No equivalent in CF. S The date's ordinal suffix (st,
* nd, rd, or th). Works well with d. No equivalent in CF. '…' or "…" Literal
* character sequence. Surrounding quotes are removed. No equivalent in CF. UTC:
* Must be the first four characters of the mask. Converts the date from local
* time to UTC/GMT/Zulu time before applying the mask. The "UTC:" prefix is
* removed. No equivalent in CF.
*/
var dateFormat = function() {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g, timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g, timezoneClip = /[^-+\dA-Z]/g, pad = function(val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len)
            val = "0" + val;
        return val;
    };

    // Regexes and supporting functions are cached through closure
    return function(date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask
        // prefix)
        if (arguments.length == 1
                && Object.prototype.toString.call(date) == "[object String]"
                && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date))
            throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get", d = date[_ + "Date"](), D = date[_
                + "Day"](), m = date[_ + "Month"](), y = date[_ + "FullYear"](), H = date[_
                + "Hours"](), M = date[_ + "Minutes"](), s = date[_ + "Seconds"]
                (), L = date[_ + "Milliseconds"](), o = utc ? 0 : date.getTimezoneOffset(), flags = {
            d : d,
            dd : pad(d),
            ddd : dF.i18n.dayNames[D],
            dddd : dF.i18n.dayNames[D + 7],
            m : m + 1,
            mm : pad(m + 1),
            mmm : dF.i18n.monthNames[m],
            mmmm : dF.i18n.monthNames[m + 12],
            yy : String(y).slice(2),
            yyyy : y,
            h : H % 12 || 12,
            hh : pad(H % 12 || 12),
            H : H,
            HH : pad(H),
            M : M,
            MM : pad(M),
            s : s,
            ss : pad(s),
            l : pad(L, 3),
            L : pad(L > 99 ? Math.round(L / 10) : L),
            t : H < 12 ? "a" : "p",
            tt : H < 12 ? "am" : "pm",
            T : H < 12 ? "A" : "P",
            TT : H < 12 ? "AM" : "PM",
            Z : utc ? "UTC" : (String(date).match(timezone) || [ "" ]).pop()
                    .replace(timezoneClip, ""),
            o : (o > 0 ? "-" : "+")
                    + pad(
                            Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o)
                                    % 60, 4),
            S : [ "th", "st", "nd", "rd" ][d % 10 > 3 ? 0
                    : (d % 100 - d % 10 != 10) * d % 10]
        };

        return mask.replace(token, function($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

//Some common format strings
dateFormat.masks = {
    "default" : "ddd mmm dd yyyy HH:MM:ss",
    shortDate : "m/d/yy",
    mediumDate : "mmm d, yyyy",
    longDate : "mmmm d, yyyy",
    fullDate : "dddd, mmmm d, yyyy",
    shortTime : "h:MM TT",
    mediumTime : "h:MM:ss TT",
    longTime : "h:MM:ss TT Z",
    isoDate : "yyyy-mm-dd",
    isoTime : "HH:MM:ss",
    isoDateTime : "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime : "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

//Internationalization strings
dateFormat.i18n = {
    dayNames : [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday",
                 "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
    monthNames : [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
                   "Sep", "Oct", "Nov", "Dec", "January", "February", "March",
                   "April", "May", "June", "July", "August", "September", "October",
                   "November", "December" ]
};

//For convenience...
Date.prototype.format = function(mask, utc) {
    return dateFormat(this, mask, utc);
};

/**
 * @fileoverview Orchestra의 네이티브 기능과 JavaScript의 연결처리 기능
 * @author FINGER Inc.
 * @version 1.0
 * @since 2011.09.01
 */
// JSON for iOS 3.x
var JSON;
if (!JSON) {
    JSON = {};
}

(function() {
    "use strict";

    function f(n) {
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function(key) {

            return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-'
                    + f(this.getUTCMonth() + 1) + '-' + f(this.getUTCDate())
                    + 'T' + f(this.getUTCHours()) + ':'
                    + f(this.getUTCMinutes()) + ':' + f(this.getUTCSeconds())
                    + 'Z' : null;
        };

        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(
                key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = { // table
                                                                                                                                                                                                                                                                                        // of
                                                                                                                                                                                                                                                                                        // character
                                                                                                                                                                                                                                                                                        // substitutions
        '\b' : '\\b',
        '\t' : '\\t',
        '\n' : '\\n',
        '\f' : '\\f',
        '\r' : '\\r',
        '"' : '\\"',
        '\\' : '\\\\'
    }, rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"'
                + string.replace(escapable,
                        function(a) {
                            var c = meta[a];
                            return typeof c === 'string' ? c : '\\u'
                                    + ('0000' + a.charCodeAt(0).toString(16))
                                            .slice(-4);
                        }) + '"' : '"' + string + '"';
    }

    function str(key, holder) {
        var i, // The loop counter.
        k, // The member key.
        v, // The member value.
        length, mind = gap, partial, value = holder[key];

        if (value && typeof value === 'object'
                && typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        switch (typeof value) {
        case 'string':
            return quote(value);
        case 'number':
            return isFinite(value) ? String(value) : 'null';
        case 'boolean':
        case 'null':
            return String(value);
        case 'object':
            if (!value) {
                return 'null';
            }
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(value) === '[object Array]') {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }
                v = partial.length === 0 ? '[]' : gap ? '[\n' + gap
                        + partial.join(',\n' + gap) + '\n' + mind + ']' : '['
                        + partial.join(',') + ']';
                gap = mind;
                return v;
            }
            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }
            v = partial.length === 0 ? '{}' : gap ? '{\n' + gap
                    + partial.join(',\n' + gap) + '\n' + mind + '}' : '{'
                    + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function(value, replacer, space) {

            var i;
            gap = '';
            indent = '';

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

            } else if (typeof space === 'string') {
                indent = space;
            }

            rep = replacer;
            if (replacer
                    && typeof replacer !== 'function'
                    && (typeof replacer !== 'object' || typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            return str('', {'' : value});
        };
    }

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function(text, reviver) {

            var j;

            function walk(holder, key) {

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx,
                        function(a) {
                            return '\\u'
                                    + ('0000' + a.charCodeAt(0).toString(16))
                                            .slice(-4);
                        });
            }

            if (/^[\],:{}\s]*$/
                    .test(text
                            .replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                            .replace(
                                    /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                                    ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                j = eval('(' + text + ')');
                return typeof reviver === 'function' ? walk({
                    '' : j
                }, '') : j;
            }

            throw new SyntaxError('JSON.parse');
        };
    }
}());

_original_stringify = JSON.stringify;

_stringify = function(obj) {
    if (obj == null) {
        return "null";
    } else if ($.isArray(obj)) {
        str = "[";
        var f = true;
        for ( var i in obj) {
            if (f == true) {
                f = false;
            } else {
                str += ',';
            }
            str += _stringify(obj[i]);
        }
        str += "]";
        return str;
    } else if (typeof obj == 'object') {
        str = "{";
        var f = true;
        for ( var k in obj) {
            if (f == true) {
                f = false;
            } else {
                str += ",";
            }
            if ((typeof k) !== 'string' && (typeof k) !== 'number') {
                throw "object key must be string or number. cannot be "
                        + (typeof k);
            }
            str += _stringify(k);
            str += ":";
            str += _stringify(obj[k]);
        }
        str += "}";
        return str;
    } else if (typeof obj == 'string') {
        return "\"" + obj.replace(/\"/g, "\\\"") + "\"";
    } else if (typeof obj == 'number') {
        return "" + obj;
    } else if (typeof obj == 'boolean') {
        return "" + obj;
    } else if (typeof obj == 'function') {
        return _original_stringify(obj);
    }

    throw "UNKNOWN TYPE " + (typeof obj);
};

my_stringify = _stringify;

/**
 * 인증문자 적용 함수 (각페이지에 구현된 인증문자 적용 함수를 호출함.)
 * 
 * @param {String} authNum
 * 			인증번호
 */
window.setSMSAprval = function(authNum) {
	window.SPA_COMMON.callbackWithSPA('onSMSAprval', authNum);
};


/**
 * 은행 및 증권사 목록
 * 
 * @param 
 */
function getBankInfoList() {
	
	var bankInfo = [
		{"value":"218","name":"KB증권"              ,"desc":"KB증권"},
		{"value":"224","name":"BNK투자증권"         ,"desc":"BNK투자증권"},
		{"value":"225","name":"IBK투자"             ,"desc":"IBK투자증권"},
		{"value":"225","name":"IBK투자증권"         ,"desc":"IBK투자증권"},
		{"value":"227","name":"DAOL"                ,"desc":"DAOL투자증권"},
		{"value":"227","name":"DAOL투자증권"        ,"desc":"DAOL투자증권"},
		{"value":"227","name":"다올"                ,"desc":"DAOL투자증권"},
		{"value":"227","name":"다올투자"            ,"desc":"DAOL투자증권"},
		{"value":"227","name":"다올투자증권"        ,"desc":"DAOL투자증권"},
		{"value":"227","name":"KTB투자"             ,"desc":"DAOL투자증권"},
		{"value":"227","name":"KTB투자증권"         ,"desc":"DAOL투자증권"},
		{"value":"238","name":"미래에셋"            ,"desc":"미래에셋증권"},
		{"value":"238","name":"미래에셋증권"        ,"desc":"미래에셋증권"},
		{"value":"240","name":"삼성증권"            ,"desc":"삼성증권"},
		{"value":"243","name":"한국투자"            ,"desc":"한국투자증권"},
		{"value":"243","name":"한국투자증권"        ,"desc":"한국투자증권"},
		{"value":"247","name":"NH투자"              ,"desc":"NH투자증권"},
		{"value":"247","name":"NH투자증권"          ,"desc":"NH투자증권"},
		{"value":"261","name":"교보증권"            ,"desc":"교보증권"},
		{"value":"262","name":"하이투자"            ,"desc":"하이투자증권"},
		{"value":"262","name":"하이투자증권"        ,"desc":"하이투자증권"},
		{"value":"263","name":"현대차"              ,"desc":"현대차증권"},
		{"value":"263","name":"현대차증권"          ,"desc":"현대차증권"},
		{"value":"264","name":"키움"                ,"desc":"키움증권"},
		{"value":"264","name":"키움증권"            ,"desc":"키움증권"},
		{"value":"265","name":"이베스트증권"        ,"desc":"이베스트투자증권"},
		{"value":"265","name":"이베스트투자"        ,"desc":"이베스트투자증권"},
		{"value":"265","name":"이베스트투자증권"    ,"desc":"이베스트투자증권"},
		{"value":"266","name":"SK증권"              ,"desc":"SK증권"},
		{"value":"266","name":"에스케이증권"        ,"desc":"SK증권"},
		{"value":"267","name":"대신증권"            ,"desc":"대신증권"},
		{"value":"269","name":"한화증권"            ,"desc":"한화투자증권"},
		{"value":"269","name":"한화투자"            ,"desc":"한화투자증권"},
		{"value":"269","name":"한화투자증권"        ,"desc":"한화투자증권"},
		{"value":"270","name":"하나증권"            ,"desc":"하나증권"},
		{"value":"270","name":"하나투자"            ,"desc":"하나증권"},
		{"value":"270","name":"하나금융투자"        ,"desc":"하나증권"},
		{"value":"271","name":"토스증권"            ,"desc":"토스증권"},
        {"value":"278","name":"신한투자증권"        ,"desc":"신한투자증권"},
		{"value":"278","name":"신한증권"            ,"desc":"신한투자증권"},
		{"value":"278","name":"신한투자"            ,"desc":"신한투자증권"},
		{"value":"278","name":"신한금융투자"        ,"desc":"신한투자증권"},
		{"value":"279","name":"DB투자"              ,"desc":"DB금융투자"},
		{"value":"279","name":"DB금융투자"          ,"desc":"DB금융투자"},
		{"value":"280","name":"유진투자"            ,"desc":"유진투자증권"},
		{"value":"280","name":"유진투자증권"        ,"desc":"유진투자증권"},
		{"value":"287","name":"메리츠"              ,"desc":"메리츠증권"},
		{"value":"287","name":"메리츠증권"          ,"desc":"메리츠증권"},
		{"value":"288","name":"카카오페이증권"      ,"desc":"카카오페이증권"},
		{"value":"289","name":"NH농협증권"          ,"desc":"NH농협증권"},
		{"value":"289","name":"농협증권"            ,"desc":"NH농협증권"},
		{"value":"289","name":"NH증권"              ,"desc":"NH농협증권"},
		{"value":"290","name":"부국"                ,"desc":"부국증권"},
		{"value":"290","name":"부국증권"            ,"desc":"부국증권"},
		{"value":"291","name":"신영"                ,"desc":"신영증권"},
		{"value":"291","name":"신영증권"            ,"desc":"신영증권"},
		{"value":"004","name":"국민"                ,"desc":"KB국민"},
		{"value":"004","name":"KB"                  ,"desc":"KB국민"},
		{"value":"004","name":"KB국민"              ,"desc":"KB국민"},
		{"value":"004","name":"국민은행"            ,"desc":"KB국민"},
		{"value":"088","name":"신한"                ,"desc":"신한"},
		{"value":"088","name":"신한은행"            ,"desc":"신한"},
		{"value":"003","name":"기업"                ,"desc":"기업"},
		{"value":"003","name":"IBK"                 ,"desc":"기업"},
		{"value":"003","name":"IBK기업"             ,"desc":"기업"},
		{"value":"003","name":"기업은행"            ,"desc":"기업"},
		{"value":"011","name":"농협"                ,"desc":"농협"},
		{"value":"011","name":"NH"                  ,"desc":"농협"},
		{"value":"011","name":"NH농협"              ,"desc":"농협"},
		{"value":"011","name":"농협은행"            ,"desc":"농협"},
		{"value":"071","name":"우체국"              ,"desc":"우체국"},
		{"value":"023","name":"제일"                ,"desc":"SC제일"},
		{"value":"023","name":"SC"                  ,"desc":"SC제일"},
		{"value":"023","name":"SC제일"              ,"desc":"SC제일"},
		{"value":"023","name":"제일은행"            ,"desc":"SC제일"},
		{"value":"081","name":"하나"                ,"desc":"하나"},
		{"value":"081","name":"KEB"                 ,"desc":"하나"},
		{"value":"081","name":"KEB하나"             ,"desc":"하나"},
		{"value":"081","name":"하나은행"            ,"desc":"하나"},
		{"value":"081","name":"외환"                ,"desc":"하나"},
		{"value":"081","name":"외환은행"            ,"desc":"하나"},
		{"value":"027","name":"CITI"                ,"desc":"한국씨티"},
		{"value":"027","name":"씨티"                ,"desc":"한국씨티"},
		{"value":"027","name":"씨티은행"            ,"desc":"한국씨티"},
		{"value":"020","name":"우리"                ,"desc":"우리"},
		{"value":"020","name":"우리은행"            ,"desc":"우리"},
		{"value":"039","name":"경남"                ,"desc":"경남"},
		{"value":"039","name":"경남은행"            ,"desc":"경남"},
		{"value":"039","name":"BNK경남"             ,"desc":"경남"},
		{"value":"034","name":"광주"                ,"desc":"광주"},
		{"value":"034","name":"광주은행"            ,"desc":"광주"},
		{"value":"031","name":"대구"                ,"desc":"대구"},
		{"value":"031","name":"DGB"                 ,"desc":"대구"},
		{"value":"031","name":"DGB대구"             ,"desc":"대구"},
		{"value":"031","name":"대구은행"            ,"desc":"대구"},
		{"value":"032","name":"부산"                ,"desc":"부산"},
		{"value":"032","name":"BNK"                 ,"desc":"부산"},
		{"value":"032","name":"BNK부산"             ,"desc":"부산"},
		{"value":"032","name":"부산은행"            ,"desc":"부산"},
		{"value":"002","name":"산업"                ,"desc":"KDB산업은행"},
		{"value":"002","name":"KDB"                 ,"desc":"KDB산업은행"},
		{"value":"002","name":"KDB산업"             ,"desc":"KDB산업은행"},
		{"value":"002","name":"산업은행"            ,"desc":"KDB산업은행"},
		{"value":"007","name":"수협"                ,"desc":"수협"},
		{"value":"007","name":"Sh"                  ,"desc":"수협"},
		{"value":"007","name":"Sh수협"              ,"desc":"수협"},
		{"value":"007","name":"수협은행"            ,"desc":"수협"},
		{"value":"037","name":"전북"                ,"desc":"전북"},
		{"value":"037","name":"전북은행"            ,"desc":"전북"},
		{"value":"035","name":"제주"                ,"desc":"제주"},
		{"value":"035","name":"제주은행"            ,"desc":"제주"},
		{"value":"045","name":"새마을"              ,"desc":"새마을금고"},
		{"value":"045","name":"새마을금고"          ,"desc":"새마을금고"},
		{"value":"048","name":"신협"                ,"desc":"신협"},
		{"value":"048","name":"신협은행"            ,"desc":"신협"},
		{"value":"089","name":"케이"                ,"desc":"케이뱅크"},
		{"value":"089","name":"케뱅"                ,"desc":"케이뱅크"},
		{"value":"089","name":"K뱅크"               ,"desc":"케이뱅크"},
		{"value":"089","name":"케이뱅크"            ,"desc":"케이뱅크"},
		{"value":"090","name":"카카오"              ,"desc":"카카오뱅크"},
		{"value":"090","name":"카카오뱅크"          ,"desc":"카카오뱅크"},
		{"value":"090","name":"카뱅"                ,"desc":"카카오뱅크"},
		{"value":"050","name":"저축"                ,"desc":"저축"},
		{"value":"054","name":"HSBC"                ,"desc":"HSBC"},
		{"value":"054","name":"HSBC은행"            ,"desc":"HSBC"},
		{"value":"055","name":"도이치"              ,"desc":"도이치"},
		{"value":"055","name":"도이치은행"          ,"desc":"도이치"},
		{"value":"057","name":"JP모간"              ,"desc":"JP모간체이스"},
		{"value":"057","name":"JP모건"              ,"desc":"JP모간체이스"},
		{"value":"057","name":"JP모건체이스"        ,"desc":"JP모간체이스"},
		{"value":"057","name":"JP모간체이스"        ,"desc":"JP모간체이스"},
		{"value":"060","name":"BOA"                 ,"desc":"뱅크오브아메리카"},
		{"value":"060","name":"BOA은행"             ,"desc":"뱅크오브아메리카"},
		{"value":"060","name":"뱅크오브"            ,"desc":"뱅크오브아메리카"},
		{"value":"060","name":"뱅크오브아메리카"    ,"desc":"뱅크오브아메리카"},
		{"value":"060","name":"뱅크오브아메리카은행","desc":"뱅크오브아메리카"},
		{"value":"061","name":"BNP파리바은행"       ,"desc":"BNP파리바"},
		{"value":"061","name":"BNP파리바"           ,"desc":"BNP파리바"},
		{"value":"061","name":"BNP"                 ,"desc":"BNP파리바"},
		{"value":"062","name":"중국공상은행"        ,"desc":"중국공상은행"},
		{"value":"062","name":"중국공상"            ,"desc":"중국공상은행"},
		{"value":"062","name":"공상"                ,"desc":"중국공상은행"},
		{"value":"062","name":"공상은행"            ,"desc":"중국공상은행"},
		{"value":"063","name":"중국은행"            ,"desc":"중국은행"},
		{"value":"064","name":"산림조합"            ,"desc":"산림조합"},
		{"value":"064","name":"산림"                ,"desc":"산림조합"},
		{"value":"067","name":"중국건설은행"        ,"desc":"중국건설은행"},
		{"value":"067","name":"중국건설"            ,"desc":"중국건설은행"},
		{"value":"092","name":"토스"                ,"desc":"토스뱅크"},
		{"value":"092","name":"토스뱅크"            ,"desc":"토스뱅크"},
		{"value":"209","name":"유안타"              ,"desc":"유안타증권"},
		{"value":"209","name":"유안타증권"          ,"desc":"유안타증권"},
		{"value":"292","name":"케이프"              ,"desc":"케이프투자증권"},
		{"value":"292","name":"케이프투자"          ,"desc":"케이프투자증권"},
		{"value":"292","name":"케이프투자증권"      ,"desc":"케이프투자증권"}
	];
	
	return bankInfo;
};
