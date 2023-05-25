/**
 * CertManager 2017
 * @class:인증서 관리 컨드롤
 * @author FINGER Inc.
 * @version 1.0
 * @since 2011.09.01
 */
var plugin = {};
plugin.CertManager = function() {
};

/**
 * 인증서 로그인
 */
plugin.CertManager.prototype.requestCertLogin = function(data, success, fail){
    kbstar.exec(function(data){
        //success(data);
    	window.SPA_COMMON.callbackWithSPA(success, data);
    }, fail, "CertManager", "requestCertLogin", { data : data } );
};


/**
 * 인증서 전자서명
 */
plugin.CertManager.prototype.requestCertSign = function(keys, values, formats, delimeter, data, digiSuccessCallback, digiFailCallback){
    var params = {
            keys : keys, 
            values : values,
            formats : formats, 
            delimeter : delimeter, 
            data : data
    };    
    
    kbstar.exec(function(data){
        //digiSuccessCallback(data);
        window.SPA_COMMON.callbackWithSPA(digiSuccessCallback, data);
    }, digiFailCallback, "CertManager", "requestCertSign", params);
};

/**
 * 인증서 전자서명_NO확인창 - 2017.08.31 신규 추가 - jim
 */
plugin.CertManager.prototype.requestCertSignNoMsg = function(keys, values, formats, delimeter, data, digiSuccessCallback, digiFailCallback){
    var params = {
            keys : keys, 
            values : values,
            formats : formats, 
            delimeter : delimeter, 
            data : data
    };    
    
    kbstar.exec(function(data){
        //digiSuccessCallback(data);
    	window.SPA_COMMON.callbackWithSPA(digiSuccessCallback, data);
    }, digiFailCallback, "CertManager", "requestCertSignNoMsg", params);
};

/**
 * KB인증서 전자서명 - 2010.05.27 신규 추가 - KDS
 */
plugin.CertManager.prototype.requestKBCertSign = function(keys, values, formats, delimeter, data, authType, signType, digiSuccessCallback, digiFailCallback){
	var params = {
			keys : keys, 
			values : values,
			formats : formats, 
			delimeter : delimeter, 
			data : data,
			authType : authType,
			signType : signType
	};    
	
	kbstar.exec(function(data){
		//digiSuccessCallback(data);
		window.SPA_COMMON.callbackWithSPA(digiSuccessCallback, data);
	}, digiFailCallback, "KBSignManager", "requestKBCertSign", params);
};

/**
 * KB인증서 전자서명_NO확인창 - 2010.05.27 신규 추가 - KDS
 */
plugin.CertManager.prototype.requestKBCertSignNoMsg = function(keys, values, formats, delimeter, data, authType, signType, digiSuccessCallback, digiFailCallback, info){
	if(info == undefined){
		info = "";
    }
	var params = {
			keys : keys, 
			values : values,
			formats : formats, 
			delimeter : delimeter, 
			data : data,
			authType : authType,
			signType : signType,
			info : info
	};    
	
	kbstar.exec(function(data){
		//digiSuccessCallback(data);
		window.SPA_COMMON.callbackWithSPA(digiSuccessCallback, data);
	}, digiFailCallback, "KBSignManager", "requestKBCertSignNoMsg", params);
};

/**
 * 비로그인 인증서 전자서명
 */
plugin.CertManager.prototype.requestExtraCertSign = function(keys, values, formats, delimeter, data, certIndex, certConformYN, digiSuccessCallback, digiFailCallback){
    var params = {
            keys : keys, 
            values : values,
            formats : formats, 
            delimeter : delimeter, 
            data : data,
            certIndex : certIndex,
            certConformYN : certConformYN
    };    
    
    kbstar.exec(function(data){
        //digiSuccessCallback(data);
    	window.SPA_COMMON.callbackWithSPA(digiSuccessCallback, data);
    }, digiFailCallback, "CertManager", "requestExtraCertSign", params);
};


/**
 * 인증서 목록 가져오기
 * @param certCode 인증서 타입 코드
 * @param bOnlyKbCert KB스타뱅킹앱내 인증서 여부 - Y:KB앱내 인증서, N:설정에 따른 인증서 (올레 또는 KB앱내 인증서)
 */
plugin.CertManager.prototype.requestCertList = function(requestCertCallbackSuccess, requestCertCallbackFail, certCode, bOnlyKbCert) {
 if (bOnlyKbCert == undefined) {
  bOnlyKbCert = "N";
 } 
  
 kbstar.exec(requestCertCallbackSuccess, requestCertCallbackFail, "CertManager", "requestCertList", { certCode : certCode, bOnlyKbCert : bOnlyKbCert } );
};
/**
 * 인증서 상세 가져오기(2021.05.24 신규)
 * 이 값을 가져오기 위해서는 사용하는 page 에서 certificate_data.json 를 종속파일로 설정해야만 인증기관과 등록기관을 정상적으로 가져올 수 있다.
 */
plugin.CertManager.prototype.requestCertInfo = function(requestCertCallbackSuccess, requestCertCallbackFail, idx) {
    kbstar.exec(requestCertCallbackSuccess, requestCertCallbackFail, "CertManager", "requestCertInfo", { idx : idx } );
};

/**
 * 인증서 비밀번호 요청
 */
plugin.CertManager.prototype.requestCertPassword = function(requestCertCallbackSuccess, requestCertCallbackFail, idx) {
    kbstar.exec(requestCertCallbackSuccess, requestCertCallbackFail, "CertManager", "requestCertPassword", { idx : idx } );
};

/**
 * 인증서 갱신 요청
 */
plugin.CertManager.prototype.requestCertRenew = function(requestCertCallbackSuccess, requestCertCallbackFail, oldPassword, newPassword1, newPassword2) {
    var params = {
    	      oldPassword : oldPassword , 
    	      newPassword1 : newPassword1,
    	      newPassword2 : newPassword2
    	    };
    
    kbstar.exec(requestCertCallbackSuccess, requestCertCallbackFail, "CertManager", "requestCertRenew", params);
};

/**
 * 인증서 비밀번호 변경/삭제
 */
plugin.CertManager.prototype.showCertDelete = function(requestCertCallbackSuccess, requestCertCallbackFail, idx) {
    kbstar.exec(requestCertCallbackSuccess, requestCertCallbackFail, "CertManager", "showCertDelete", { idx : idx } );
};

/**
 * PC에서 인증서 가져오기
 */
plugin.CertManager.prototype.showCertImportPC = function(requestCertCallbackSuccess, requestCertCallbackFail) {
    kbstar.exec(requestCertCallbackSuccess, requestCertCallbackFail, "CertManager", "showCertImportPC");
};

/**
 * 스마트폰에서 인증서 가져오기
 */
plugin.CertManager.prototype.showCertImportSmart = function(requestCertCallbackSuccess, requestCertCallbackFail) {
    kbstar.exec(requestCertCallbackSuccess, requestCertCallbackFail, "CertManager", "showCertImportSmart");
};

/**
 * Olleh 인증서 가져오기
 */
plugin.CertManager.prototype.showCertImportOlleh = function(requestCertCallbackSuccess, requestCertCallbackFail) {
    kbstar.exec(requestCertCallbackSuccess, requestCertCallbackFail, "CertManager", "showCertImportOlleh");
};

/**
 * PC에서 인증서 내보내기
 */
plugin.CertManager.prototype.showCertExportPC = function(requestCertCallbackSuccess, requestCertCallbackFail, idx, password) {
    kbstar.exec(requestCertCallbackSuccess, requestCertCallbackFail, "CertManager", "showCertExportPC", { idx : idx, password : password } );
};

/**
 * 스마트폰에서 인증서 내보내기
 */
plugin.CertManager.prototype.showCertExportSmart = function(requestCertCallbackSuccess, requestCertCallbackFail, idx, password) {
	 
    kbstar.exec(requestCertCallbackSuccess, requestCertCallbackFail, "CertManager", "showCertExportSmart", { idx : idx, password : password } );
};

/**
 * Olleh 인증서 내보내기
 */
plugin.CertManager.prototype.showCertExportOlleh = function(requestCertCallbackSuccess, requestCertCallbackFail, idx) {
    kbstar.exec(requestCertCallbackSuccess, requestCertCallbackFail, "CertManager", "showCertExportOlleh", { idx : idx } );
};


/**
 * 인증서 발급
 */
plugin.CertManager.prototype.requestCertIssue = function(requestCertCallbackSuccess, requestCertCallbackFail, retNo, permitCode, password1, password2) {
    var params = {
        retNo : retNo, 
        permitCode : permitCode, 
        password1 : password1,
        password2 : password2
    };
    kbstar.exec(requestCertCallbackSuccess, requestCertCallbackFail, "CertManager", "requestCertIssue", params);
};


/**
 * 인증서 이용위치 설정(아이폰 전용)
 */
plugin.CertManager.prototype.setCertType = function(requestCertCallbackSuccess, requestCertCallbackFail, key, value) {
    kbstar.exec(requestCertCallbackSuccess, requestCertCallbackFail, "CertManager", "setCertType", { key : key, value : value } );
};

/**
 * 인증서 비밀번호 변경
 */
plugin.CertManager.prototype.requestCertChangePasswd = function(requestCertCallbackSuccess, requestCertCallbackFail, idx, oldPassword , newPassword1, newPassword2) {
    var params = {
      idx : idx, 
      oldPassword : oldPassword , 
      newPassword1 : newPassword1,
      newPassword2 : newPassword2
    };
    kbstar.exec(requestCertCallbackSuccess, requestCertCallbackFail, "CertManager", "requestCertChangePasswd", params);
};

/**
 * 전자등기용 전자서명
 * @param {string}    data         서명데이터
 * @param {string}    certIndex       공동인증서 인덱스
 * @param {string}    digiSuccessCallback   성공시 callback
 * @param {string}    digiFailCallback     실패시 callback
 */
plugin.CertManager.prototype.requestCertSignHash = function(data, certIndex, digiSuccessCallback, digiFailCallback){
    var params = {
            data : data,
            certIndex : certIndex
    };    
    
    kbstar.exec(function(data){
        //digiSuccessCallback(data);
    	window.SPA_COMMON.callbackWithSPA(digiSuccessCallback, data);
    }, digiFailCallback, "CertManager", "requestCertSignHash", params);
};

/**
 * 릴레이인증 인증서 전자서명 - 2018.08.22 신규추가 - 조현준
 */
plugin.CertManager.prototype.requestRelayCertSign = function(certIndex, pin, digiSuccessCallback, digiFailCallback){
    var params = {
            certIndex : certIndex,
            pin : pin 
    };    
    
    kbstar.exec(function(data){
    	//digiSuccessCallback(data);
    	window.SPA_COMMON.callbackWithSPA(digiSuccessCallback, data);
    }, digiFailCallback, "CertManager", "requestRelayCertSign", params);
};

kbstar.addConstructor(function() {
    window.certManager = new plugin.CertManager();
});

/**
 * ConfigManager
 */
plugin.ConfigManager = function() {
};

 /**
  * plugin.ConfigManager.prototype.requestCertLogin
  * 로그인 요청
  * @param {String} nextPageId 로그인후 이동해야 하는 페이지,"stay_on_page" 일 경우 로그인후 제자리에 머무른다.
  * @param {String} nextParam 페이지 이동할때 파라미터
  */
plugin.ConfigManager.prototype.requestCertLogin =  function(nextPageId, nextParam) {
    if(!device.platform.match(/Orchestra Simulator/)) {    
        if(nextPageId == undefined){
            nextPageId= "";
        }
        if(nextParam == undefined){
            nextParam= "";
        }
        kbstar.exec(null, null, "ConfigManager", "requestCertLogin", { nextPageId : nextPageId, nextParam : nextParam } );
    }
};
/**
 * 로그아웃 요청 
 * @param {string}    nextPageId            로그아웃 후 홈으로 이동은 "", 페이지 유지는 "stay_on_page", 페이지 이동은 "이동할 페이지 아이디"
 * @param {string}    logoutDialogFlag    0:다이얼로그 SKIP, 1:기본 다이얼로그 호출, 2:비정상 로그아웃 메세지 다이얼로그 호출
 * @param {string} 	  historyclear     Y: 히스토리 삭제, N: 히스토리 삭제 안함.
 * @param {string}    nextParam        nextPageId 호출을 위한 파라메터 key1=value1&key2=value2 형태
 */
plugin.ConfigManager.prototype.requestLogout =  function(nextPageId, logoutDialogFlag, historyclear, nextParam) {
    if(!device.platform.match(/Orchestra Simulator/)) {    
        if(nextPageId == undefined){
            nextPageId= "";
        }
        if(logoutDialogFlag == undefined){
            logoutDialogFlag= "";
        }
        if(historyclear == undefined){
            historyclear = "Y";
        }
        var params = {
            nextPageId : nextPageId, 
            logoutDialogFlag : logoutDialogFlag, 
            historyclear : historyclear,
            nextParam : nextParam || ''
        };
        kbstar.exec(null, null, "ConfigManager", "requestLogout", params);
    }
};

/**
 * plugin.ConfigManager.prototype.executeNativeQRreader
 * QR Reader 호출
 */
plugin.ConfigManager.prototype.executeNativeQRreader =  function() {
    kbstar.exec(null, null, "ConfigManager", "executeNativeQRreader");
};

/**
 * plugin.ConfigManager.prototype.executeNativeAnimalFarm
 * 동물농장 호출
 * @param {String} accno 계좌번호를 파라미터로 넘길시 특정 페이지로 이동, 빈값은 동물농장 메인
 */
plugin.ConfigManager.prototype.executeNativeAnimalFarm =  function(accno) {
    var _accno = "";
    if(accno != undefined){
        _accno = accno;
    }
    kbstar.exec(null, null, "ConfigManager", "executeNativeAnimalFarm", { _accno : _accno } );
};

/**
 * plugin.ConfigManager.prototype.moveToBankHome
 * 홈으로 이동 
 */
plugin.ConfigManager.prototype.moveToBankHome =  function() {
    if(device.platform.match(/Orchestra Simulator/)) {    
        var pageUrl = "/mquics?page=C053245";
        window.navi.navigate(pageUrl,"",function(){});
    } else {
        kbstar.exec(function() {}, function() {}, "ConfigManager", "moveToBankHome");
    }    
};

/**
 * plugin.ConfigManager.prototype.requestTransMsg
 * 송금(이체)메세지 보내기
 * @param {String} msg 
 */
plugin.ConfigManager.prototype.requestTransMsg =  function(msg) {
    kbstar.exec(null, null, "ConfigManager", "requestTransMsg", { msg : msg } );
};

/**
 * plugin.ConfigManager.prototype.requestAccountBook
 * 가계부 전송(StarPlus 앱으로 전송)
 */
plugin.ConfigManager.prototype.requestAccountBook =  function(transactionInfo) {
    kbstar.exec(null, null, "ConfigManager", "requestAccountBook", { transactionInfo : JSON.stringify(transactionInfo) } );
};

 /**
  * plugin.ConfigManager.prototype.appLink
  * 타APP 연동 기능 및 Store 연동 API (APP설치 확인 포함)
  * @param {String} androidpkg 안드로이드 패키지명
  * @param {String} iospkg IOS 스키마
  * @param {String} andriodStoreUrl 안드로이드 스토어 URL
  * @param {String} iosStoreUrl IOS 스토어 URL
  * @param {String} appname APP 앱링크하기전 확인창에 들어갈 앱 이름
  */
plugin.ConfigManager.prototype.appLink =  function(androidpkg, iospkg, andriodStoreUrl, iosStoreUrl, appname) {
    if(!device.platform.match(/Orchestra Simulator/)) {            
        var storeURL;
        var apppkg;
        
        if("ios" == window.COMMON.getUserAgent()) {
            storeURL = iosStoreUrl;
            apppkg = iospkg;
        } else {
            storeURL = andriodStoreUrl;
            apppkg = androidpkg;
        }
        
        var params = {
            apppkg : apppkg, 
            storeURL : storeURL, 
            appname : appname
        };
        kbstar.exec(null, null, "ConfigManager", "appLink", params);
    }    
};

 /**
  * plugin.ConfigManager.prototype.appLinkWithScheme
  * 타APP 연동 기능 및 Store 연동 API (APP설치 확인 포함)
  * @param {String} androidpkg 안드로이드 패키지명
  * @param {String} iospkg IOS 스키마
  * @param {String} andriodStoreUrl 안드로이드 스토어 URL
  * @param {String} iosStoreUrl IOS 스토어 URL
  * @param {String} appname APP 앱링크하기전 확인창에 들어갈 앱 이름
  * @param {String} urlscheme APP 앱을 호출하기위한 표준Scheme
  */
plugin.ConfigManager.prototype.appLinkWithScheme =  function(androidpkg, iospkg, andriodStoreUrl, iosStoreUrl, appname, urlscheme) {
    if(!device.platform.match(/Orchestra Simulator/)) {            
        var storeURL;
        var apppkg;
        
        if("ios" == window.COMMON.getUserAgent()) {
            storeURL = iosStoreUrl;
            apppkg = iospkg;
        } else {
            storeURL = andriodStoreUrl;
            apppkg = androidpkg;
        }
        
        var params = {
            apppkg : apppkg, 
            appname : appname,
            storeURL : storeURL,
            urlscheme : urlscheme
        };
        kbstar.exec(null, null, "ConfigManager", "appLinkWithScheme", params);
    }    
};

/**
  * plugin.ConfigManager.prototype.marketLink
  * Store 연동 API (APP설치 여부 상관없이 market 이동)
  * @param {String} androidpkg 안드로이드 패키지명
  * @param {String} iospkg IOS 스키마
  * @param {String} andriodStoreUrl 안드로이드 스토어 URL
  * @param {String} iosStoreUrl IOS 스토어 URL
  * @param {String} appname APP 앱링크하기전 확인창에 들어갈 앱 이름
  */
plugin.ConfigManager.prototype.marketLink =  function(androidpkg, iospkg, andriodStoreUrl, iosStoreUrl, appname) {
    if(!device.platform.match(/Orchestra Simulator/)) {            
        var storeURL;
        var apppkg;
        
        if("ios" == window.COMMON.getUserAgent()) {
            storeURL = iosStoreUrl;
            apppkg = iospkg;
        } else {
            storeURL = andriodStoreUrl;
            apppkg = androidpkg;
        }
        
        var params = {
            apppkg : apppkg, 
            storeURL : storeURL, 
            appname : appname
        };
        kbstar.exec(null, null, "ConfigManager", "marketLink", params);
    }    
};

/**
 * plugin.ConfigManager.prototype.requestPushDialog
 *  스마트 알리미 알림 수신 동의 팝업 호출
 */
plugin.ConfigManager.prototype.requestPushDialog =  function() {
    if(!device.platform.match(/Orchestra Simulator/)) {            
        kbstar.exec(null, null, "ConfigManager", "requestPushDialog");
    }    
};

/**
 * plugin.ConfigManager.prototype.showMobileWeb
 * 스타뱅킹2.0의 특정 페이지를 모바일웹 화면으로 웹뷰에 띄워주는 기능
 * 앱 링크전 연결여부 확인창에서 앱 이름을 보여주기 위해 사용
 * param (String)full url
 */
plugin.ConfigManager.prototype.showMobileWeb =  function(fullurl, name) {
    if(!device.platform.match(/Orchestra Simulator/)) {            
        var _name = "";
        if(name != undefined){
            _name = name;
        }
        kbstar.exec(null, null, "ConfigManager", "showMobileWeb", { fullurl : fullurl, _name : _name } );
    }    
};

/**
 * plugin.ConfigManager.prototype.pushTotalCnt
 * OS ICON PUSH 개수 COUNT 하는 함수
 */
plugin.ConfigManager.prototype.pushTotalCnt =  function() {
    if(!device.platform.match(/Orchestra Simulator/)) {            
        kbstar.exec(null, null, "ConfigManager", "pushTotalCnt");
    }    
};
/**
 * plugin.ConfigManager.prototype.playMovie
 * Android 전용 동영상 플레이 API
 * param (string) url
 */
plugin.ConfigManager.prototype.playMovie =  function(url) {
    if(!device.platform.match(/Orchestra Simulator/)) {            
        if(window.COMMON.getUserAgent() == "android"){
            kbstar.exec(null, null, "ConfigManager", "playMovie", { url : url } );
        }
    }
};

/**
 * 앱 설치여부 체크
 * @param successCallback 성공콜백
 * @param failCallback 실패콜백
 * @param androidPkg : 안드로이드 패키지
 * @param iosPkg : iOS 패키지
 * 
 */
plugin.ConfigManager.prototype.findApp = function(successCallback, failCallback, androidPkg, iosPkg) {
	if(!device.platform.match(/Orchestra Simulator/)) {     
		var params = {
			"androidPkg" : androidPkg,
			"iosPkg" : iosPkg
		};
	
		kbstar.exec(successCallback, failCallback, "ConfigManager", "findApp", params);
	}
};

/**
 * 기기 설정화면 이동
 * 
 */
plugin.ConfigManager.prototype.appSetting = function() {
 kbstar.exec(null, null, "ConfigManager", "appSetting");
};

kbstar.addConstructor(function() {
    window.configManager = new plugin.ConfigManager();
});

var goDigitSign = "";
/**
 * SecureKeypad
 * @class 보안 키패드
 * @author revol04.
 * @version 2.0
 * @since 2013.08.26
 */
plugin.SecureKeypad = function() {
};

/**
 * plugin.SecureKeypad.prototype.showSecureKeypad
 * 보안키패드 표시
 * @param {String} type num:숫자키패드, char:일반키패드
 * @param {int} name 고유 키패드 번호
 * @param {String} title 키패드의 타이틀
 * @param {int} len 입력 길이 제한
 * @param {String} callback SuccessCallback
 * @param {String} upercase 대문자 여부(기본:"N")
 * @param {String} decryptY 복호화여부
 * @param {String} autopas 자동확인 여부(기본:"N")
 * @param {String} place_holder 입력내용 설명(기본:"")
 * @param {String} calbackFail 실패 콜백
 * @param {String} subtitle 키패드의 서브타이틀 (값이 있을때만 표시) - tag처리가능
 * @param {String} linkName 링크버튼이름 (값이 있을때만 표시) - text만가능
 * @param {String} linkPage 이동할페이지 및 페이지 전달 파라미터(page=pageid&key=value,key=value)
 * @param {String} confirmBtn 액션페이지 및 페이지 전달 파라미터(QAction=QActionPageid&key=value,key=value)
 */
plugin.SecureKeypad.prototype.showSecureKeypad = function( type, name, title, len, callback, upercase, decryptY, autopass, place_holder, calbackFail, certIdx, subtitle, linkName, linkPage, confirmBtn ){
    if(!device.platform.match(/Orchestra Simulator/)) {
        $(this).prop("readonly",true);
        
        
        
        var _upercase = "N";
        if(upercase != undefined){
            _upercase = upercase;
        }
        var _autopass = "N";	//2018.03.09 추가
		if(autopass != undefined){
			_autopass = autopass;
		} 
		var _certIdx = "";
		if(certIdx != undefined){
			_certIdx = certIdx;
		} 

		showSecureKeypadFlag = true;
        window.secureKeypad.callback = callback;
        
        
        if ((typeof calbackFail) == "undefined") {
            window.secureKeypad.callbackFail = -1;
        }
        else {
            window.secureKeypad.callbackFail = calbackFail;
        }
        
        var params = {
        	"title" : title,
        	"subtitle" : subtitle != undefined ? subtitle : "",
        	"name" : name,
            "type" : type, 
            "len" : len, 
            "autopass" : _autopass,
            "_upercase" : _upercase,
            "place_holder" : (place_holder != undefined) ? place_holder : "",
			"decryptY" : decryptY,
			"linkName" : linkName != undefined ? linkName : "",
			"linkPage" : linkPage != undefined ? linkPage : "",
			"confirmBtn" : confirmBtn != undefined ? confirmBtn : "",
			"certIdx" : _certIdx
        };
        kbstar.exec(showSecureKeypadCallback, showSecureKeypadCallback, "SecureKeypad", "showSecureKeypad", params);
    }
};

function showSecureKeypadCallback(data){
    try {
        if (data.result == "true") {
			if((typeof data.origin64) != "undefined"){
				data.origin = atob(data.origin64);
			}

			if(typeof window.secureKeypad.callback == "function"){
				window.SPA_COMMON.callbackWithSPA(window.secureKeypad.callback, data.result, data.index, data.origin, data.leng, data.encode, data.dummyData);
			}else{
				alert("callback 함수명:["+typeof window.secureKeypad.callback+"]");
				
			}
        	if(goDigitSign!=null&&goDigitSign!="")
        		(new Function(goDigitSign))();
        }
        else {
        	if (window.secureKeypad.callbackFail != -1) {
                window.SPA_COMMON.callbackWithSPA(window.secureKeypad.callbackFail, data.result);
        	}
        }
    } catch (e) {
        kbstar.alert("error in showKeypadCallback :: " + e);
    }
};

/**
 * plugin.SecureKeypad.prototype.showSecureKeypadForView
 * 보안키패드 표시(반키패드)
 * @param {String} type num:숫자키패드, char:일반키패드
 * @param {int} name 고유 키패드 번호
 * @param {String} title 키패드의 타이틀
 * @param {int} len 입력 길이 제한
 * @param {String} callback SuccessCallback
 * @param {String} upercase 대문자 여부(기본:"N")
 * @param {String} decryptY 복호화여부
 * @param {String} autopas 자동확인 여부(기본:"Y")
 * @param {String} subtitle 키패드의 서브타이틀 (값이 있을때만 표시) - tag처리가능
 * @param {String} linkName 링크버튼이름 (값이 있을때만 표시) - text만가능
 * @param {String} linkPage 이동할페이지 및 페이지 전달 파라미터(page=pageid&key=value,key=value)
 * @param {String} confirmBtn 액션페이지 및 페이지 전달 파라미터(QAction=QActionPageid&key=value,key=value)
 */
plugin.SecureKeypad.prototype.showSecureKeypadForView = function(type, name, title, len, callback, upercase, decryptY, autopass, subtitle, linkName, linkPage, confirmBtn, failcallback) {
    if(!device.platform.match(/Orchestra Simulator/)) {
        $(this).prop("readonly",true);
        var _upercase = "N";
        if(upercase != undefined){
            _upercase = upercase;
        }
        var _autopass = "N";
        if(autopass != undefined){
            _autopass = autopass;
        }


        showSecureKeypadFlag = true;
        window.secureKeypad.callback = callback;
        var params = {
            "type" : type, 
            "name" : name,
            "title" : title, 
            "len" : len, 
            "_upercase" : _upercase,
			"decryptY" : decryptY,
			"autopass" : _autopass,
			"subtitle" : subtitle,
			"linkName" : linkName,
			"linkPage" : linkPage,
			"confirmBtn" : confirmBtn
        };

        kbstar.exec(showSecureKeypadCallback, failcallback, "SecureKeypad", "showSecureKeypadForView", params);
    }
};

/**
 * plugin.SecureKeypad.prototype.showSecureKeypadQAction
 * 보안키패드 표시
 * @param {String}	title			키패	드의 타이틀
 * @param {String}	subtitle		키패드의 서브타이틀 (값이 있을때만 표시) - tag처리가능
 * @param {int}		name			고유 키패드 번호
 * @param {String}	type			num:숫자키패드, char:일반키패드
 * @param {int}		len				입력 길이 제한
 * @param {String}	autopa   		자동확인 여부(기본:"N")
 * @param {String}	upercase		대문자 여부(기본:"N")
 * @param {String}	decryptY		복호화여부
 * @param {String}	place_holder	입력내용 설명(기본:"")
 * @param {String}	linkName		링크버튼이름 (값이 있을때만 표시) - text만가능
 * @param {String}	linkPage		이동할페이지 및 페이지 전달 파라미터(page=pageid&key=value,key=value)
 * @param {String}	confirmBtn		액션페이지 및 페이지 전달 파라미터(QAction=QActionPageid&key=value,key=value)
 * @param {String}	certIdx			선택된 인증서의 Index
 * @param {String}	callback		성공 콜백
 * @param {String}	failCalback		실패 콜백
 */
plugin.SecureKeypad.prototype.showSecureKeypadQAction = function(title, subtitle, name, type, len, autopass, upercase, decryptY, place_holder, linkName, linkPage, confirmBtn, certIdx, callback, failCalback) {
    if(!device.platform.match(/Orchestra Simulator/)) {
        $(this).prop("readonly",true);

		showSecureKeypadFlag = true;
        window.secureKeypad.callback = callback;
        
        var params = {
    		"title" : title,
        	"subtitle" : subtitle,
        	"name" : name,
            "type" : type, 
            "len" : len, 
            "autopass" : autopass,
            "_upercase" : upercase,
            "place_holder" : (place_holder != undefined) ? place_holder : "",
			"decryptY" : decryptY,
			"linkName" : linkName,
			"linkPage" : linkPage,
			"confirmBtn" : confirmBtn,
			"certIdx" : certIdx
        };
        kbstar.exec(showSecureKeypadCallback, failCalback, "SecureKeypad", "showSecureKeypad", params);
    }
};

/**
 * plugin.SecureKeypad.prototype.showKeypad
 * 보안키패드 표시
 * @param {String} type num:숫자키패드, char:일반키패드
 * @param {int} name 고유 키패드 번호
 * @param {String} title 키패드의 타이틀
 * @param {int} len 입력 길이 제한
 * @param {String} callback SuccessCallback
 */
plugin.SecureKeypad.prototype.showKeypad = function(type, name, title, len, callback, upercase, certIdx , autopass) {
    if(!device.platform.match(/Orchestra Simulator/)) {
        $(this).prop("readonly",true);
        var _upercase = "N";
        if(upercase != undefined){
            _upercase = upercase;
        }
        var _certIdx = "";
        if(certIdx != undefined){
        	_certIdx = certIdx;
        }

        showSecureKeypadFlag = true;
        window.secureKeypad.callback = callback;

        var params = {
    		"title" : title, 
       		"subtitle" : "", 
       		"name" : name,
            "type" : type, 
            "len" : len, 
            "autopass" : (autopass != undefined) ? autopass : "N",
            "_upercase" : _upercase,
            "linkName" : "",
            "linkPage" : "",
            "confirmBtn" : "",
            "certIdx" : _certIdx
        };
        kbstar.exec(showKeypadCallback, showKeypadCallback, "SecureKeypad", "showKeypad", params);
    }
};

function showKeypadCallback(data){
    try {
		if((typeof data.origin64) != "undefined"){
			data.origin = atob(data.origin64);
		}
		
        window.SPA_COMMON.callbackWithSPA(window.secureKeypad.callback, data.result, data.index, data.origin, data.leng, data.encode);
    	if(goDigitSign!=null&&goDigitSign!="")
    		(new Function(goDigitSign))();
    } catch (e) {
        kbstar.alert("error in showKeypadCallback :: " + e);
    }
};

/**
 * plugin.SecureKeypad.prototype.showKeypadQAction
 * 보안키패드 표시
 * @param {String}	title			키패드의 타이틀
 * @param {String}	subtitle		키패드의 서브타이틀 (값이 있을때만 표시) - tag처리가능
 * @param {int}		name			고유 키패드 번호
 * @param {String}	type			num:숫자키패드, char:일반키패드
 * @param {int}		len				입력 길이 제한
 * @param {String}	autopa   		자동확인 여부(기본:"N")
 * @param {String}	upercase		대문자 여부(기본:"N")
 * @param {String}	linkName		링크버튼이름 (값이 있을때만 표시) - text만가능
 * @param {String}	linkPage		이동할페이지 및 페이지 전달 파라미터(page=pageid&key=value,key=value)
 * @param {String}	confirmBtn		액션페이지 및 페이지 전달 파라미터(QAction=QActionPageid&key=value,key=value)
 * @param {String}	certIdx			인증서 index
 * @param {String}	callback		성공 콜백
 * @param {String}	failCalback		실패 콜백
 */
plugin.SecureKeypad.prototype.showKeypadQAction = function(title, subtitle, name, type, len, autopass, upercase, linkName, linkPage, confirmBtn, certIdx, callback) {
	if( !device.platform.match(/Orchestra Simulator/) ){
		$(this).prop("readonly",true);

		showSecureKeypadFlag = true;
		window.secureKeypad.callback = callback;

		var params = {
				"title" : title,
				"subtitle" : subtitle,
				"name" : name,
				"type" : type,
				"len" : len,
				"autopass" : autopass,
				"_upercase" : upercase,
				"linkName" : linkName,
				"linkPage" : linkPage,
				"confirmBtn" : confirmBtn,
				"certIdx" : certIdx
		};
		kbstar.exec(showKeypadCallback, showKeypadCallback, "SecureKeypad", "showKeypad", params);
	}
};

/**
 * 보안키패드표시 - 보안카드
 * @param {String} type card: 보안카드
 * @param {int} name 고유키패드번호
 * @param {String} title 키패드의타이틀
 * @param {int} len입력길이제한
 * @param {String} 좌측 보안카드 앞 두자리
 * @param {String} 우측 보안카드 뒷 두자리
 * @param {String} callback SuccessCallback
 */
plugin.SecureKeypad.prototype.showKeypadCard = function(type, name, title, len, strcard1, strcard2, callback) {
    if(!device.platform.match(/Orchestra Simulator/)) {
        $(this).prop("readonly",true);
        showSecureKeypadFlag = true;
        window.secureKeypad.callback = callback;
        var params = {
            "type" : type, 
            "name" : name, 
            "title" : title, 
            "len" : len, 
            "strcard1" : strcard1, 
            "strcard2" : strcard2,
            "autopass" : "N",
            "confirmBtn" : ""
        };
        kbstar.exec(showKeypadCardCallback, showKeypadCardCallback, "SecureKeypad", "showCardKeypad", params);
    }
};

function showKeypadCardCallback(data){
    try {
		if((typeof data.plainText1_64) != "undefined"){
			data.plainText1 = atob(data.plainText1_64);
		}
		if((typeof data.plainText2_64) != "undefined"){
			data.plainText2 = atob(data.plainText2_64);
		}
        window.SPA_COMMON.callbackWithSPA(window.secureKeypad.callback,data.result, data.idx, data.enc1, data.len1, data.plainText1, data.enc2, data.len2, data.plainText2);
    	if(goDigitSign!=null&&goDigitSign!="")
    		(new Function(goDigitSign))();
    } catch (e) {
        kbstar.alert("error in showKeypadCallback :: " + e);
    }
};

/**
 * 보안키패드표시 - 보안카드
 * @param {String}	type		card: 보안카드
 * @param {int}		name		고유키패드번호
 * @param {String}	title		키패드의타이틀
 * @param {int}		len			입력길이제한
 * @param {String}	strcard1	좌측 보안카드 앞 두자리
 * @param {String}	strcard2	우측 보안카드 뒷 두자리
 * @param {String}	autopa	    자동확인 여부(기본:"N")
 * @param {String}	confirmBtn	액션페이지 및 페이지 전달 파라미터(QAction=QActionPageid&key=value,key=value)
 * @param {String}	callback	성공 콜백
 */
plugin.SecureKeypad.prototype.showCardKeypadQAction = function(type, name, title, len, strcard1, strcard2, autopass, confirmBtn, callback) {
    if(!device.platform.match(/Orchestra Simulator/)) {
        $(this).prop("readonly",true);
        showSecureKeypadFlag = true;
        window.secureKeypad.callback = callback;
        var params = {
            "type" : type, 
            "name" : name, 
            "title" : title, 
            "len" : len, 
            "strcard1" : strcard1, 
            "strcard2" : strcard2,
            "autopass" : autopass,
            "confirmBtn" : confirmBtn
        };
        kbstar.exec(showKeypadCardCallback, showKeypadCardCallback, "SecureKeypad", "showCardKeypad", params);
    }
};

/**
 * 헤더 "MDIwGhMAPP" 추가된 암호문 생성
 * @param {function}	callback(String[])	성공 콜백
 * @param {String[]}	data		원문 문자열 배열
 */
plugin.SecureKeypad.prototype.getLocalEncdataWithHeader = function(callback, data) {
    if(!device.platform.match(/Orchestra Simulator/)) {
        if (typeof data != 'object') {
        	data = JSON.parse(data);
        }
        let params = {
            "data" : data
        };
        kbstar.exec(callback, null, "SecureKeypad", "getLocalEncdataWithHeader", params);
    }
};

kbstar.addConstructor(function() {
    window.secureKeypad = new plugin.SecureKeypad();
    window.secureKeypad.callback = -1;    
    window.secureKeypad.callbackFail = -1;    
});


if (!kbstar.hasResource("Keypad")) {
    kbstar.addResource("Keypad");

    var Keypad = function(){};
    
    /**
     * 키패드
     * @param successCallback 성공Callback
     * @param failCallback    실패Callback
     * @param params          
     */
    Keypad.prototype.showCustomKeypad = function( successCallback, failCallback, params ) {
    	kbstar.exec( successCallback, failCallback, "Keypad", "showCustomKeypad", params );        
    };

    kbstar.addConstructor(function() {
    	window.Keypad = new Keypad();
    });
}

/**
 * SotpManager
 * @class 스마트OTP 컨트롤
 * @author 에이티솔루션즈
 * @version 1.0
 * @since 2015.04.22
 */
plugin.SotpManager = function() {
};

/**
 * 스마트OTP 입력
 */
plugin.SotpManager.prototype.inputSmartOtp = function(successCallback){
    kbstar.exec( function(data){ successCallback(data); }, null, "SmartOtp", "inputSmartOtp");
};

/**
 * 스마트OTP 인증폰 등록
 */
plugin.SotpManager.prototype.registerCertDevice = function(successCallback, failCallback){
    kbstar.exec(successCallback, failCallback, "SmartOtp", "registerCertDevice");
};

/**
 * 스마트OTP  인증폰 해지/변경
 */
plugin.SotpManager.prototype.unregisterCertDevice = function(successCallback, failCallback, spin){
    //kbstar.exec(successCallback, failCallback, "SmartOtp", "unregisterCertDevice", { spin : spin } );
	//2021.07.05 정역화
	kbstar.exec(successCallback, failCallback, "SmartOtp", "unregisterCertDevice", spin );
};

/**
 * 스마트OTP OPIN 오류초기화
 */
plugin.SotpManager.prototype.resetOpinError = function(successCallback, failCallback, spin){
   // kbstar.exec(successCallback, failCallback, "SmartOtp", "resetOpinError", { spin : spin });
	 //2021.07.05 정역화
	 kbstar.exec(successCallback, failCallback, "SmartOtp", "resetOpinError", spin);
};

/**
 * 스마트OTP NFC설정이동
 */
plugin.SotpManager.prototype.showNfcSetupMenu = function(){
    kbstar.exec(null, null, "SmartOtp", "showNfcSetupMenu");
};

/**
 * 스마트OTP 가이드화면
 */
plugin.SotpManager.prototype.showSmartOtpGuide = function(){
    kbstar.exec(null, null, "SmartOtp", "showSmartOtpGuide");
};

/**
 * 스마트OTP OPIN 자동전송
 */
plugin.SotpManager.prototype.executeSmartOneOtp = function(successCallback, failCallback, data){
    kbstar.exec(successCallback, failCallback, "SmartOtp", "executeSmartOneOtp", data);
};

/**
 * 스마트OTP 원터치로그인 설정(공인인증서)
 */
plugin.SotpManager.prototype.setOneTouchLoginCert = function(successCallback, failCallback, data){
    kbstar.exec(successCallback, failCallback, "SmartOtp", "setOneTouchLoginCert", data);
};

/**
 * 스마트OTP 원터치로그인 설정(IC카드인증서)
 */
plugin.SotpManager.prototype.setOneTouchLoginICCard = function(successCallback, failCallback, data){
    kbstar.exec(successCallback, failCallback, "SmartOtp", "setOneTouchLoginICCard", data);
};

kbstar.addConstructor(function() {
    window.sotpManager = new plugin.SotpManager();
});


/**
 * CertSOtp
 * @class IC카드인증서 컨트롤
 * @author 에이티솔루션즈
 * @version 1.0
 * @since 2016.1.20
 */
plugin.CertSOtp = function() {
};

/**
 * [네이티브화면] 인증서 보기/삭제
 */
plugin.CertSOtp.prototype.showCertSOtpList = function(){
	kbstar.exec(null, null, "CertSOtp", "showCertSOtpList");
};

/**
 * [네이티브화면] PIN 번호 변경
 */
plugin.CertSOtp.prototype.showCertSOtpPinChange = function(){
	kbstar.exec(null, null, "CertSOtp", "showCertSOtpPinChange");
};

/** 
 * [공통] 과금여부체크
 * @param {String} otpSn OTP일련번호
 * @param {String} nextPage 과금 성공시 이동할 페이지ID
 * @param {String} currentPage 현재 페이지ID
 */
plugin.CertSOtp.prototype.getChargeInfo = function(successCallback, failCallback, otpSn, nextPage, currentPage){
	var alertMessage = "";
	if( currentPage == "C052309" ) {
		alertMessage = "가입이 완료 되지 않았습니다.\n다시 진행하시겠습니까?\n(외부 브라우저로 이동)";
	} else {
		alertMessage = "IC카드인증서 가입/발급후,\n모든 KB 전자서명 업무는\nIC카드인증서를 사용해야 가능합니다.\n서비스 가입을 위해서 외부 브라우저로 이동합니다.";
	}
	
	//과금페이지 오픈(외부브라우저)
	var openCertSOtpChargePage = function(url) {
		var urlparam = encodeURIComponent("nextPage:" + nextPage + ",currentPage:" + currentPage + ",otpSn:" + otpSn);
		var host = encodeURIComponent("call?cmd=move_to&id=web&url=/quics?page=C052309&urlparam=" + urlparam);
		if( confirm(alertMessage) ) {	
			window.appManager.openURL(url + "?siteCd=065004&scheme=kbbank&host=" + host + "&otpSn=" + otpSn);
		} else {
			window.navi.navigateWithInit('/mquics?page=C052275', "",function(){});
		}
	};
	
	//과금 체크 요청
	kbstar.exec(
			function(data) {
				//과금 체크 성공
				if( data.billingFlag == 'Y' ) { // 과금 OK
					if(typeof successCallback == "function") { successCallback(data); }
				} else { // 과금 NOT
					openCertSOtpChargePage(data.billingJoinUrl); //외부브라우저 오픈
				}
			}, 
			function(data) {
				//과금체크 실패
				if(typeof failCallback == "function") { failCallback(data); }
			},
			"CertSOtp", "getChargeInfo", {otpSn: otpSn});
};

/**
 * [인증서 이동] PIN검증 및 인증서 이동
 * @param {String} pin PIN번호(등록/검증용)
 * @param {String} mainCert 주사용인증서 여부
 * @param {String} type 검증/등록 여부 (등록"init", 검증"auth")
 * @param {String} otpSn OTP일련번호
 */
plugin.CertSOtp.prototype.requestCertSOtpMove = function(successCallback, failCallback, pin, mainCert, type, otpSn){
	var param = { 
			pin: pin,
            type : type, 
			mainCert: mainCert, 
			otpSn: otpSn  
		};
    kbstar.exec(successCallback, failCallback, "CertSOtp", "requestCertSOtpMove", param);
};

/**
 * [인증서 이동] 공인인증서 비밀번호 검증 및 pfx파일 생성
 * @param {int} idx 인증서 인덱스 번호
 */
plugin.CertSOtp.prototype.requestCertPasswordForMove = function(successCallback, failCallback, idx){
    kbstar.exec(successCallback, failCallback, "CertSOtp", "requestCertPasswordForMove", { idx: idx });
};

/**
 * [인증서 발급] PIN등록 및 인증서CMP발급
 * @param {String} retNo 참조번호
 * @param {String} permitCode 인가코드
 * @param {String} usn 주민번호 
 * @param {String} pin PIN번호
 * @param {String} mainCert 주사용인증서 여부 ("Y","N")
 * @param {String} type 검증/등록 여부 (등록"init", 검증"auth")
 * @param {String} otpSn OTP일련번호
 */
plugin.CertSOtp.prototype.requestCertSOtpIssue = function(successCallback, failCallback, retNo, permitCode, usn, pin, mainCert, type, otpSn){
    var param = {
            retNo : retNo, 
            permitCode : permitCode, 
            usn: usn,
            pin : pin,
            mainCert: mainCert,
            type : type, 
			otpSn: otpSn  
        };
    kbstar.exec(successCallback, failCallback, "CertSOtp", "requestCertSOtpIssue", param);
};

/**
 * [PIN오류 초기화] PIN 재설정
 * @param {String} pin PIN번호
 * @param {String} otpSn OTP일련번호
 */
plugin.CertSOtp.prototype.requestCertSOtpPinReset = function(successCallback, failCallback, pin, otpSn){
    kbstar.exec(successCallback, failCallback, "CertSOtp", "requestCertSOtpPinReset", {pin: pin, otpSn: otpSn});
};

/**
 * [인증서 갱신] 갱신대상 인증서 목록조회(NFC태깅화면 호출)
 */
plugin.CertSOtp.prototype.getCertSOtpList = function(successCallback, failCallback){
    kbstar.exec(successCallback, failCallback, "CertSOtp", "getCertSOtpList", { certCode : "11" });
};

/**
 * [인증서 갱신] 갱신대상 인증서 비밀번호 검증
 */
plugin.CertSOtp.prototype.requestCertSOtpSignForRenew = function(successCallback, failCallback, idx){
    kbstar.exec(successCallback, failCallback, "CertSOtp", "requestCertSOtpSignForRenew", { idx : idx });
};

/**
 * [인증서 갱신] 핀검증 및 인증서갱신 요청
 * @param {String} pin 기존 PIN번호(검증용)
 * @param {String} newPin 새로운 PIN번호(등록용)
 * @param {String} mainCert 주 사용인증서 여부
 * @param {String} usn 주민번호
 * @param {String} otpSn OTP일련번호
 */
plugin.CertSOtp.prototype.requestCertSOtpRenew = function(successCallback, failCallback, pin, newPin, mainCert, usn, otpSn){
	var param = {
			pin: pin,
			newPin: newPin,
			mainCert: mainCert,
			usn: usn, 
			otpSn: otpSn
	};
    kbstar.exec(successCallback, failCallback, "CertSOtp", "requestCertSOtpRenew", param);
};

/**
 * IC카드인증서 스마트원 전자서명
 */
plugin.CertSOtp.prototype.requestCertSOtpSign = function(keys, values, formats, delimeter, data, digiSuccessCallback, digiFailCallback){
    var params = {
            keys : keys, 
            values : values,
            formats : formats, 
            delimeter : delimeter, 
            data : data
    };
    kbstar.exec(function(data){
		$("#OTP비밀번호").val( data.data.OTP_PWD);
		digiSuccessCallback(data);
	},
	function(data) {
		data.msg.common.errorpopup = "0";
		data.msg.common.errorbutton = "1";
		caq.error.caq_printError(data);
		digiFailCallback(data);
	}, 
	"CertSOtp", "requestCertSOtpSign", params);
};

/**
 * PIN설정 여부 체크
 * @param {checkPinSetting: "Y", preKeyPairCount: "Y"} checkPinSetting:핀설정여부 체크, preKeyPairCount: 키쌍 생성여부 체크
 * @resutn {checkPinSetting: "Y", preKeyPairCount: "Y"}
 */
plugin.CertSOtp.prototype.getCertSOtpInfo = function(successCallback, failCallback, param){
    kbstar.exec(successCallback, failCallback, "CertSOtp", "getCertSOtpInfo", param);
};

/**
 * 스마트OTP 원터치로그인 설정(공인인증서)
 */
plugin.CertSOtp.prototype.setOneTouchLoginCert = function(successCallback, failCallback, data){
    kbstar.exec(successCallback, failCallback, "CertSOtp", "setOneTouchLoginCert", data);
};

/**
 * 스마트OTP 원터치로그인 설정(IC카드인증서)
 */
plugin.CertSOtp.prototype.setOneTouchLoginICCard = function(successCallback, failCallback, data){
    kbstar.exec(successCallback, failCallback, "CertSOtp", "setOneTouchLoginICCard", data);
};

kbstar.addConstructor(function() {
    window.CertSOtp = new plugin.CertSOtp();
});


/**
 * SmartPass
 * @class 간편인증 컨트롤
 * @author 에이티솔루션즈
 * @version 1.0
 * @since 2016.11.04
 */
plugin.SmartPass = function() {};

/**
 * 간편인증Agent앱 설치 여부 체크 
 * @param sAgentInstalled 앱설치여부  조회(조회"Y"/해당사항없음"N")
 * @param sSerialNumber 일련번호 조회 조회(조회"Y"/해당사항없음"N")
 * @param sMediaType 매체코드 조회 조회(조회"Y"/해당사항없음"N")
 */
plugin.SmartPass.prototype.getSmartPassInfo = function(successCallback, failCallback, sAgentInstalled, sSerialNumber, sMediaType){
	if(sAgentInstalled==null || sAgentInstalled == '') sAgentInstalled = 'N';
	if(sSerialNumber==null || sSerialNumber == '') sSerialNumber = 'N';
	if(sMediaType==null || sMediaType == '') sMediaType = 'N';
    kbstar.exec(successCallback, failCallback, "SmartPass", "getSmartPassInfo", { agentInstalled: sAgentInstalled, serialNumber: sSerialNumber, mediaType: sMediaType });
};

/**
 * 간편인증 발급 요청
 * @param sPassword	간편인증 PIN번호(6~8자리)
 */
plugin.SmartPass.prototype.requestSmartPassIssue = function(successCallback, failCallback, sPassword){
	kbstar.exec(successCallback, failCallback, "SmartPass", "requestSmartPassIssue", { pin : sPassword } );
};

/**
 * 간편인증 재발급 요청
 * @param sSerialNumber	간편인증 일련번호 
 * @param sPassword	간편인증 기존 PIN번호(6~8자리)
 */
plugin.SmartPass.prototype.requestSmartPassReIssue = function(successCallback, failCallback, sSerialNumber, sPassword){
	kbstar.exec(successCallback, failCallback, "SmartPass", "requestSmartPassReIssue", { sn : sSerialNumber, pin : sPassword } );
};

/**
 * 간편인증 서명(확인창O)
 */
plugin.SmartPass.prototype.requestCertSpassSign = function(keys, values, formats, delimeter, data, digiSuccessCallback, digiFailCallback){
    var params = {
            keys : keys, 
            values : values,
            formats : formats, 
            delimeter : delimeter, 
            data : data
    };    
    
    kbstar.exec(function(data){
        digiSuccessCallback(data);
    }, digiFailCallback, "SmartPass", "requestSmartPassSign", params);
};

/**
 * 간편인증 서명(확인창x)
 */
plugin.SmartPass.prototype.requestCertSpassSignNoMsg = function(keys, values, formats, delimeter, data, digiSuccessCallback, digiFailCallback){
    var params = {
            keys : keys, 
            values : values,
            formats : formats, 
            delimeter : delimeter, 
            data : data
    };    
    
    kbstar.exec(function(data){
        digiSuccessCallback(data);
    }, digiFailCallback, "SmartPass", "requestSmartPassSignNoMsg", params);
};

/**
 * 간편인증 삭제 요청
 * @param sSerialNumber	간편인증 일련번호 
 */
plugin.SmartPass.prototype.requestSmartPassDissue = function(successCallback, failCallback, sSerialNumber){
	kbstar.exec(successCallback, failCallback, "SmartPass", "requestSmartPassDissue", { sn : sSerialNumber } );
};

/**
 * 간편인증 기기 변경 요청
 * @param sSerialNumber	간편인증 일련번호 
 * @param sPassword	간편인증 기존 PIN번호(6~8자리)
 */
plugin.SmartPass.prototype.requestSmartPassChangeDevice = function(successCallback, failCallback, sSerialNumber, sPassword){
	kbstar.exec(successCallback, failCallback, "SmartPass", "requestSmartPassChangeDevice", { sn : sSerialNumber, pin : sPassword } );
};

kbstar.addConstructor(function() {
    window.SmartPass = new plugin.SmartPass();
});

/**
 * FidoManager
 */
plugin.FidoManager = function() {
};

/**
 * FIDO등록여부확인
 * 
 * @param successCallback
 *            성공콜백
 * @param failCallback
 *            실패콜백
 * @param fidoType :
 *            F(FIDO), KF(KFIDO), IF(IresFIDO)
 * @param authCode
 *            (인증수단코드) : 0(지문), 1(홍채), 2(삼성홍채)
 */
plugin.FidoManager.prototype.getUserID = function(successCallback,
		failCallback, fidoType, authCode) {

	var params = {
		"fidoType" : fidoType,
       "authCode" : authCode
	};

	kbstar.exec(successCallback, failCallback, "FidoManager", "getUserID",
			params);
};

/**
 * FIDO등록-재등록요청
 * 
 * @param successCallback
 *            성공콜백
 * @param failCallback
 *            실패콜백
 * @param kbpin
 *            (KB-PIN) : 10자리(FIDO), 15자리(KFIDO)
 * @param fidoType :
 *            F(FIDO), KF(KFIDO), IF(IresFIDO)
 * @param authCode
 *            (인증수단코드) : 0(지문), 1(홍채), 2(삼성홍채)
 * @param refNumber
 *            참조번호(fidoType이 IF인 경우 사용)
 * @param refAuthentication
 *            인가코드(fidoType이 IF인 경우 사용)
 */
plugin.FidoManager.prototype.registration = function(successCallback,
		failCallback, kbpin, fidoType, authCode, refNumber, refAuthentication, ver) {

	var params = {
		"kbpin" : kbpin,
		"fidoType" : fidoType,
		"authCode" : authCode,
		"refNumber" : refNumber,
		"refAuthentication" : refAuthentication,
		"ver" : ver
	};

	kbstar.exec(successCallback, failCallback, "FidoManager", "registration",
			params);
};

/**
 * FIDO인증요청
 * 
 * @param successCallback
 *            성공콜백
 * @param failCallback
 *            실패콜백
 * @param kbpin
 *            (KB-PIN) : 10자리(FIDO), 15자리(KFIDO)
 * @param fidoType :
 *            F(FIDO), KF(KFIDO), IF(IresFIDO)
 * @param authCode
 *            (인증수단코드) : 0(지문), 1(홍채)
 * @param authRequest :
 *            Auth.request(JSON)
 * 
 */
plugin.FidoManager.prototype.authentication = function(successCallback,
		failCallback, kbpin, fidoType, authCode, authRequest, ver) {

	var params = {
		"kbpin" : kbpin,
		"fidoType" : fidoType,
		"authCode" : authCode,
		"authRequest" : authRequest,
		"ver" : ver
	};

	kbstar.exec(successCallback, failCallback, "FidoManager", "authentication",
			params);
};

/**
 * FIDO거래확인요청
 * 
 * @param successCallback
 *            성공콜백
 * @param failCallback
 *            실패콜백
 * @param kbpin
 *            (KB-PIN) : 10자리(FIDO), 15자리(KFIDO)
 * @param fidoType :
 *            F(FIDO), KF(KFIDO), IF(IresFIDO)
 * @param authCode
 *            (인증수단코드) : 0(지문), 1(홍채)
 * @param orgTxt :
 *            거래원문
 * 
 */
plugin.FidoManager.prototype.transactionConfirm = function(successCallback,
		failCallback, kbpin, fidoType, authCode, orgTxt, orgType, ver) {

	var params = {
		"kbpin" : kbpin,
		"fidoType" : fidoType,
		"authCode" : authCode,
		"orgTxt" : orgTxt,
		"orgType" : orgType,
		"ver" : ver
	};

	kbstar.exec(successCallback, failCallback, "FidoManager",
			"transactionConfirm", params);
};

/**
 * FIDO해지
 * 
 * @param successCallback
 *            성공콜백
 * @param failCallback
 *            실패콜백
 * @param kbpin
 *            (KB-PIN) : 10자리(FIDO), 15자리(KFIDO)
 * @param fidoType :
 *            F(FIDO), KF(KFIDO), IF(IresFIDO)
 * @param authCode
 *            (인증수단코드) : 0(지문), 1(홍채)
 * 
 */
plugin.FidoManager.prototype.deregistration = function(successCallback,
		failCallback, kbpin, fidoType, authCode, ver) {

	var params = {
		"kbpin" : kbpin,
		"fidoType" : fidoType,
		"authCode" : authCode,
		"ver" : ver
	};

	kbstar.exec(successCallback, failCallback, "FidoManager", "deregistration",
			params);
};

/**
 * 전화번호 저장
 * 
 * @param successCallback
 *            성공콜백
 * @param failCallback
 *            실패콜백
 * @param telNo
 *            전화번호
 * 
 */
plugin.FidoManager.prototype.setMDN = function(successCallback, failCallback,
		telNo) {

	var params = {
		"telNo" : telNo
	};

	kbstar.exec(successCallback, failCallback, "FidoManager", "setMDN", params);
};

/**
 * 전화번호 요청
 * 
 * @param successCallback
 *            성공콜백
 * @param failCallback
 *            실패콜백
 * @param telNo
 *            전화번호
 * 
 */
plugin.FidoManager.prototype.getMDN = function(successCallback, failCallback) {

	var params = {};

	kbstar.exec(successCallback, failCallback, "FidoManager", "getMDN", params);
};

/**
 * K-FIDO 전자서명태그 호출
 * 
 * @param keys
 * @param values
 * @param formats
 * @param delimeter
 * @param data
 * @param digiSuccessCallback
 * @param digiFailCallback
 */
plugin.FidoManager.prototype.requestCertKFidoSign = function(keys, values, formats, delimeter, data, digiSuccessCallback, digiFailCallback) {
	var params = {
		keys : keys,
		values : values,
		formats : formats,
		delimeter : delimeter,
		data : data
	};

	kbstar.exec(function(data) {
		digiSuccessCallback(data);
	}, digiFailCallback, "FidoManager", "requestCertKFidoSign", params);
};

/**
 * 홍채인증 전자서명태그 호출
 * 
 * @param keys
 * @param values
 * @param formats
 * @param delimeter
 * @param data
 * @param digiSuccessCallback
 * @param digiFailCallback
 */
plugin.FidoManager.prototype.requestCertIrisSign = function(keys, values, formats, delimeter, data, digiSuccessCallback, digiFailCallback) {
	var params = {
		keys : keys,
		values : values,
		formats : formats,
		delimeter : delimeter,
		data : data
	};

	kbstar.exec(function(data) {
		digiSuccessCallback(data);
	}, digiFailCallback, "FidoManager", "requestCertIrisSign", params);
};

kbstar.addConstructor(function() {
	window.FidoManager = new plugin.FidoManager();
});

//--------------------------------------------------------------------------------------------------------
/**
 * FidoManagerInApp (바이오인증 내재화)
 */
plugin.FidoManagerInApp = function() {
};

/**
 * FIDO등록여부확인
 * 
 * @param successCallback
 *            성공콜백
 * @param failCallback
 *            실패콜백
 * @param fidoType :
 *            F(FIDO), KF(KFIDO), IF(IresFIDO)
 * @param authCode
 *            (인증수단코드) : 0(지문), 1(홍채), 2(삼성홍채)
 */
plugin.FidoManagerInApp.prototype.getUserID = function(successCallback,
		failCallback, fidoType, authCode) {

	var params = {
		"fidoType" : fidoType,
       "authCode" : authCode
	};

	kbstar.exec(successCallback, failCallback, "FidoManagerInApp", "getUserID",
			params);
};

/**
 * FIDO등록-재등록요청
 * 
 * @param successCallback
 *            성공콜백
 * @param failCallback
 *            실패콜백
 * @param kbpin
 *            (KB-PIN) : 10자리(FIDO)_<인증수단코드>, 15자리(KFIDO)_<인증수단코드>
 * @param fidoType :
 *            F(FIDO), KF(KFIDO), IF(IresFIDO)
 * @param authCode
 *            (인증수단코드) : 0(지문), 1(홍채), 2(삼성홍채)
 * @param refNumber
 *            참조번호(fidoType이 IF인 경우 사용)
 * @param refAuthentication
 *            인가코드(fidoType이 IF인 경우 사용)
 * @param passwd
 *            인증서비밀번호(fidoType이 KF인 경우 사용)
 */
plugin.FidoManagerInApp.prototype.registration = function(successCallback,
		failCallback, kbpin, fidoType, authCode, refNumber, refAuthentication, passwd, ver) {

	var params = {
		"kbpin" : kbpin,
		"fidoType" : fidoType,
		"authCode" : authCode,
		"refNumber" : refNumber,
		"refAuthentication" : refAuthentication,
		"passwd" : passwd,
		"ver" : ver
	};

	kbstar.exec(successCallback, failCallback, "FidoManagerInApp", "registration",
			params);
};

/**
 * FIDO인증요청
 * 
 * @param successCallback
 *            성공콜백
 * @param failCallback
 *            실패콜백
 * @param kbpin
 *            (KB-PIN) : 10자리(FIDO)_<인증수단코드>, 15자리(KFIDO)_<인증수단코드>
 * @param fidoType :
 *            F(FIDO), KF(KFIDO), IF(IresFIDO)
 * @param authCode
 *            (인증수단코드) : 0(지문), 1(홍채)
 * @param authRequest :
 *            Auth.request(JSON)
 * 
 */
plugin.FidoManagerInApp.prototype.authentication = function(successCallback,
		failCallback, kbpin, fidoType, authCode, authRequest, ver) {

	var params = {
		"kbpin" : kbpin,
		"fidoType" : fidoType,
		"authCode" : authCode,
		"authRequest" : authRequest,
		"ver" : ver
	};

	kbstar.exec(successCallback, failCallback, "FidoManagerInApp", "authentication",
			params);
};

/**
 * FIDO거래확인요청
 * 
 * @param successCallback
 *            성공콜백
 * @param failCallback
 *            실패콜백
 * @param kbpin
 *            (KB-PIN) : 10자리(FIDO)_<인증수단코드>, 15자리(KFIDO)_<인증수단코드>
 * @param fidoType :
 *            F-IN(FIDO 내재화), KF-IN(KFIDO 내재화), IF-IN(IresFIDO 내재화)
 * @param authCode
 *            (인증수단코드) : 0(지문), 1(홍채)
 * @param orgTxt :
 *            거래원문
 * 
 */
plugin.FidoManagerInApp.prototype.transactionConfirm = function(successCallback,
		failCallback, kbpin, fidoType, authCode, orgTxt, orgType, ver) {

	var params = {
		"kbpin" : kbpin,
		"fidoType" : fidoType,
		"authCode" : authCode,
		"orgTxt" : orgTxt,
		"orgType" : orgType,
		"ver" : ver
	};

	kbstar.exec(successCallback, failCallback, "FidoManagerInApp",
			"transactionConfirm", params);
};

/**
 * FIDO해지
 * 
 * @param successCallback
 *            성공콜백
 * @param failCallback
 *            실패콜백
 * @param kbpin
 *            (KB-PIN) : 10자리(FIDO)_<인증수단코드>, 15자리(KFIDO)_<인증수단코드>
 * @param fidoType :
 *            F(FIDO), KF(KFIDO), IF(IresFIDO)
 * @param authCode
 *            (인증수단코드) : 0(지문), 1(홍채)
 * 
 */
plugin.FidoManagerInApp.prototype.deregistration = function(successCallback,
		failCallback, kbpin, fidoType, authCode, ver) {

	var params = {
		"kbpin" : kbpin,
		"fidoType" : fidoType,
		"authCode" : authCode,
		"ver" : ver
	};

	kbstar.exec(successCallback, failCallback, "FidoManagerInApp", "deregistration", params);
};

/**
 * 전화번호 저장
 * 
 * @param successCallback
 *            성공콜백
 * @param failCallback
 *            실패콜백
 * @param telNo
 *            전화번호
 * 
 */
plugin.FidoManagerInApp.prototype.setMDN = function(successCallback, failCallback,
		telNo) {

	var params = {
		"telNo" : telNo
	};

	kbstar.exec(successCallback, failCallback, "FidoManagerInApp", "setMDN", params);
};

/**
 * 전화번호 요청
 * 
 * @param successCallback
 *            성공콜백
 * @param failCallback
 *            실패콜백
 * @param telNo
 *            전화번호
 * 
 */
plugin.FidoManagerInApp.prototype.getMDN = function(successCallback, failCallback) {

	var params = {};

	kbstar.exec(successCallback, failCallback, "FidoManagerInApp", "getMDN", params);
};

/**
 * K-FIDO 전자서명태그 호출(전자서명 확인창 노출)
 * 
 * @param keys
 * @param values
 * @param formats
 * @param delimeter
 * @param data
 * @param digiSuccessCallback
 * @param digiFailCallback
 */
plugin.FidoManagerInApp.prototype.requestCertKFidoSign = function(keys, values, formats, delimeter, data, digiSuccessCallback, digiFailCallback) {
	var params = {
		keys : keys,
		values : values,
		formats : formats,
		delimeter : delimeter,
		data : data
	};

	kbstar.exec(function(data) {
		digiSuccessCallback(data);
	}, digiFailCallback, "FidoManagerInApp", "requestCertKFidoSign", params);
};

/**
 * K-FIDO 전자서명태그 호출(전자서명 확인창 미노출)
 * 
 * @param keys
 * @param values
 * @param formats
 * @param delimeter
 * @param data
 * @param digiSuccessCallback
 * @param digiFailCallback
 */
plugin.FidoManagerInApp.prototype.requestCertKFidoSignNoMsg = function(keys, values, formats, delimeter, data, digiSuccessCallback, digiFailCallback) {
	var params = {
		keys : keys,
		values : values,
		formats : formats,
		delimeter : delimeter,
		data : data
	};

	kbstar.exec(function(data) {
		digiSuccessCallback(data);
	}, digiFailCallback, "FidoManagerInApp", "requestCertKFidoSignNoMsg", params);
};

/**
 * 홍채인증 전자서명태그 호출(전자서명 확인창 노출)
 * 
 * @param keys
 * @param values
 * @param formats
 * @param delimeter
 * @param data
 * @param digiSuccessCallback
 * @param digiFailCallback
 */
plugin.FidoManagerInApp.prototype.requestCertIrisSign = function(keys, values, formats, delimeter, data, digiSuccessCallback, digiFailCallback) {
	var params = {
		keys : keys,
		values : values,
		formats : formats,
		delimeter : delimeter,
		data : data
	};

	kbstar.exec(function(data) {
		digiSuccessCallback(data);
	}, digiFailCallback, "FidoManagerInApp", "requestCertIrisSign", params);
};

/**
 * 홍채인증 전자서명태그 호출(전자서명 확인창 미노출)
 * 
 * @param keys
 * @param values
 * @param formats
 * @param delimeter
 * @param data
 * @param digiSuccessCallback
 * @param digiFailCallback
 */
plugin.FidoManagerInApp.prototype.requestCertIrisSignNoMsg = function(keys, values, formats, delimeter, data, digiSuccessCallback, digiFailCallback) {
	var params = {
		keys : keys,
		values : values,
		formats : formats,
		delimeter : delimeter,
		data : data
	};

	kbstar.exec(function(data) {
		digiSuccessCallback(data);
	}, digiFailCallback, "FidoManagerInApp", "requestCertIrisSignNoMsg", params);
};

/**
 * 지문인증서 상세 정보 얻기
 * 
 * @param successCallback
 * @param failCallback
 * 
 * successCallback(certInfo)
 * @return certInfo
 * failCallback()
 */
plugin.FidoManagerInApp.prototype.getFingerCertDetailInfo = function(successCallback, failCallback) {
	var params = {};

	kbstar.exec(successCallback, failCallback, "FidoManagerInApp", "getFingerCertDetailInfo", params);
};

/**
 * 홍채인증서 상세 정보 얻기
 * 
 * @param successCallback
 * @param failCallback
 * 
 * successCallback(certInfo)
 * @return certInfo
 * failCallback()
 */
plugin.FidoManagerInApp.prototype.getIrisCertDetailInfo = function(successCallback, failCallback) {
	var params = {};

	kbstar.exec(successCallback, failCallback, "FidoManagerInApp", "getIrisCertDetailInfo", params);
};

/**
 * FIDO 환경설정 확인
 * 
 * @param successCallback
 * @param failCallback
 * @param fidoType :
 *            F(FIDO), KF(KFIDO), IF(IresFIDO)
 * @param authCode
 *            (인증수단코드) : 0(지문), 1(홍채), 2(삼성홍채)
 * @성공응답: successCallback()
 * @실패응답: failCallback()
 */
plugin.FidoManagerInApp.prototype.checkFidoEnv = function(successCallback, failCallback, fidoType, authCode) {
	var params = {
		"fidoType" : fidoType,
		"authCode" : authCode
	};

	kbstar.exec(successCallback, failCallback, "FidoManagerInApp", "checkFidoEnv", params);
};

/**
 * FIDO 생채인증가능여부 확인
 * 
 * @param successCallback
 * @성공응답: successCallback(
 * @phoneModel
 * @phoneType
 * @osVersion
 * @인증수단0
 * @인증수단1
 * @인증수단2
 * @인증수단3
 * @인증수단4
 * @인증수단5
 * @인증수단6
 * @인증수단7
 * @인증수단8
 * @인증수단9
 * @appVersionCode
 * )
 */
plugin.FidoManagerInApp.prototype.checkDevice = function(successCallback) {

	kbstar.exec(successCallback, function() {}, "FidoManagerInApp", "checkDevice", {});
};

kbstar.addConstructor(function() {
	window.FidoManagerInApp = new plugin.FidoManagerInApp();
});

//--------------------------------------------------------------------------------------------------------

//(로그인) LoginManager
if(!kbstar.hasResource("LoginManager")) {
  kbstar.addResource("LoginManager");
  var LoginManager = function() {
  };
  
  // LoginManager
  /**
   * 
   * @param {Function} successCallback 성공콜백
   * @param {Function} failCallback 실패콜백
   * @param {String} loginType 로그인유형
   * @param {Object} params 세부 인자값
   */
  LoginManager.prototype.login = function(successCallback, failCallback, loginType, params) {
//		  alert("LoginManager.login");
       if(!device.platform.match(/Orchestra Simulator/)){
           kbstar.exec(successCallback, failCallback, "LoginManager", "login", {"loginType":loginType, "params":params});
       }
   };
   
  /**
   * 
   * @param {Function} successCallback 성공콜백
   * @param {Function} failCallback 실패콜백
   * @param {String} loginType 로그인유형 : "KF", "KF-IN"
   * @param {Object} params 세부 인자값
   */
  LoginManager.prototype.checkRegistration = function(successCallback, failCallback, loginType) {
//		  alert("LoginManager.checkRegistration");
       if(!device.platform.match(/Orchestra Simulator/)){
           kbstar.exec(successCallback, failCallback, "LoginManager", "checkRegistration", {"loginType":loginType});
       }
   };

 /**
   * 핀번호 형태 지정
   * @param {Function} successCallback 성공콜백
   *  - [String] type
   *      1: 1,2
   *      2: 2,3
   *      3: 3,4
   *      4: 1,2,3,4 (reserved)
   * @param {Function} failCallback 실패콜백
   */
  LoginManager.prototype.pinTypeForSmartpass = function(successCallback, failCallback) {
//		  alert("LoginManager.pinTypeForSmartpass");
       if(!device.platform.match(/Orchestra Simulator/)){
           kbstar.exec(successCallback, failCallback, "LoginManager", "pinTypeForSmartpass", {});
       }
   };
   
 /**
   * 사설인증서 다운로드
   * @param {Function} successCallback 성공콜백
   * @param {Function} failCallback 실패콜백
   * @param [String]serialNum : 일련번호
   */
  LoginManager.prototype.generateCertFile = function(successCallback, failCallback, serialNum) {
//		  alert("LoginManager.generateCertFile");
       if(!device.platform.match(/Orchestra Simulator/)){
           kbstar.exec(successCallback, failCallback, "LoginManager", "generateCertFile", {"serialNum":serialNum});
       }
   };

 /**
   * 인증서와 시리얼번호가 없는 경우 앱에서 체크
   * @param {Function} successCallback 성공콜백
   *  - [String] cert: "Y" or "N"
   *  - [String] serial: "실제값" or "N"
   *  - [String]isExpired: "Y" or "N"
   * @param {Function} failCallback 실패콜백
   */
  LoginManager.prototype.checkToSmartpass = function(successCallback, failCallback) {
//		  alert("LoginManager.checkToSmartpass");
       if(!device.platform.match(/Orchestra Simulator/)){
           kbstar.exec(successCallback, failCallback, "LoginManager", "checkToSmartpass", {});
       }
   };

   /**
    * 인증서 유효기간 만료시 유효기간 연장 처리 (재발급)
	   *    [String]pin : 간편비밀번호
	   *    [String]pinType
	   *      00 : 1,2,3,4,5,6 ~ 8
	   *    [String]serialNum : 일련번호
    * @param {Function} successCallback 성공콜백
    * @param {Function} failCallback 실패콜백
    */
   LoginManager.prototype.updateExpiredDate = function(successCallback, failCallback, pin, pinType, serialNum) {
//		  alert("LoginManager.updateExpiredDate");
        if(!device.platform.match(/Orchestra Simulator/)){
            kbstar.exec(successCallback, failCallback, "LoginManager", "updateExpiredDate", {"pin":pin, "pinType":pinType, "serialNum":serialNum});
        }
    };

   /**
    * 올레인증서 호출(인증서는 메모리에 저장됨)
    * @param {Function} successCallback 성공콜백
    *  - [String] status: 0
    * @param {Function} failCallback 실패콜백
    *  - [String] status: -1: 올레인증서가 설치되지 않은 경우
    *                     -2: 올레인증서를 선택하지 않은 경우
    */
   LoginManager.prototype.getOllehCert = function(successCallback, failCallback) {
//		  alert("LoginManager.getOllehCert");
        if(!device.platform.match(/Orchestra Simulator/)){
            kbstar.exec(successCallback, failCallback, "LoginManager", "getOllehCert", {});
        }
    };
    
    /**
     * 로그인 전문 처리 웹 인터페이스
     * @param {Function} successCallback 성공콜백
     * @param {Function} failCallback 실패콜백
     * @param {String} loginType 로그인 타입
     * @param {Object} params 로그인 타입별 파라미터
	 * @param {Object} nextPage 로그인 후 타겟페이지
     */
    LoginManager.prototype.requestLoginRes = function(successCallback, failCallback, loginType, params, nextPage) {
        kbstar.exec(successCallback, failCallback, "LoginManager", "requestLoginRes", {"loginType":loginType, "params":params, "nextPage":nextPage});
    }
    
    /**
     *  자동로그인 토큰 저장 웹 인터페이스
     * @param {Function} successCallback 성공콜백
     * @param {Function} failCallback 실패콜백
     * @param {String} kbpin KBPIN
     * @param {String} token 자동로그인 토큰
     */
    LoginManager.prototype.setAutoLoginToken = function(successCallback, failCallback, kbpin, token , mserno) {
        kbstar.exec(successCallback, failCallback, "LoginManager", "setAutoLoginToken", { "kbpin": kbpin, "token": token });
    }
    
    /**
     *  자동로그인 토큰 해제 웹 인터페이스
     * @param {Function} successCallback 성공콜백
     * @param {Function} failCallback 실패콜백
     * @param {String} kbpin KBPIN
     * @param {String} token 자동로그인 토큰
     */
    LoginManager.prototype.autoLoginTokenRevoke = function(successCallback, failCallback) {
        kbstar.exec(successCallback, failCallback, "LoginManager", "setAutoLoginToken", { "kbpin": "", "token": ""});
    }

	/**
     *  자동로그인 요청 웹 인터페이스
     * @param {Function} failCallback 실패콜백
     */
    LoginManager.prototype.requestAutoLogin = function(failCallback) {
        kbstar.exec(null, failCallback, "LoginManager", "requestAutoLogin", {});
    }
    

   kbstar.addConstructor(function() {
       window.LoginManager = new LoginManager();
   });

}

/**
 * FIDO거래확인요청(버전 분기 추가)
 * 
 * @param successCallback
 *            성공콜백
 * @param failCallback
 *            실패콜백
 * @param kbpin
 *            (KB-PIN) : 10자리(FIDO), 15자리(KFIDO)
 * @param fidoType :
 *            F(FIDO), F-IN(FIDO 내재화), KF(KFIDO), KF-IN(KFIDO 내재화), IF(IresFIDO), IF-IN(IresFIDO 내재화)
 * @param authCode
 *            (인증수단코드) : 0(지문), 1(홍채)
 * @param orgTxt :
 *            거래원문
 * 
 */
function transactionConfirm(successCallback, failCallback, kbpin, fidoType, authCode, orgTxt, orgType, ver) {
	if (typeof compareVersion == "function" && compareVersion(device.appVersion, '5.1.0') >= 0) {
		if (fidoType == "KF") {
			fidoType = "KF-IN";
		}
		else if (fidoType == "IF") {
			fidoType = "IF-IN";
		}
	}
	window.LoginManager.checkRegistration(function(result) {
		if (typeof compareVersion == "function" && compareVersion(device.appVersion, '5.1.0') >= 0) {
            if (typeof(result.loginType) !== "undefined") {
            	fidoType = result.loginType;
            }
			if (fidoType == "KF-IN" || fidoType == "IF-IN") {
				window.FidoManagerInApp.transactionConfirm(successCallback, failCallback, kbpin, fidoType, authCode, orgTxt, orgType, ver);
			}
			else {
		    	window.FidoManager.transactionConfirm(successCallback, failCallback, kbpin, fidoType, authCode, orgTxt, orgType, ver);
			}
		}
		else {
	    	window.FidoManager.transactionConfirm(successCallback, failCallback, kbpin, fidoType, authCode, orgTxt, orgType, ver);    
		}
	}, function() {}, fidoType);
}

/**
 * KBSignManager
 */
plugin.KBSignManager = function() {
};

/**
 * KB모바일인증서 발급 과정중 통신사 본인인증 시 Tap, Usim 타입 여부 설정 (G5.4.6 이상에서만 사용)
key : storeType
value: USIM or TAP 
 */
plugin.KBSignManager.prototype.requestInitKBSignStore = function(successCallback, failCallback , param){
    kbstar.exec(successCallback, failCallback, "KBSignManager", "requestInitKBSignStore", param);
};

/**
 * 인증서 발급
 *	issueType : 인증서발급타입
 *	refValue : 참조번호
 *	authCode : 인가코드
 *	pin : 핀번호
 *	pattern : 패턴내용
 *	name : 사용자명
 *	info : 국민인증서 Lite 정보
 */
plugin.KBSignManager.prototype.requestCertIssue = function(successCallback, failCallback, issueType, refValue, authCode, pin, pattern, name, info){
	if(info == undefined){
		info = "";
    }
	var param = {};
	param.issueType = issueType;//인증서발급타입
	param.refValue = refValue;	//참조번호
	param.authCode = authCode;	//인가코드
	param.pin		= pin;		//핀번호
	param.pattern	= pattern;	//패턴내용
	param.name		= name;		//사용자명
	param.info		= info;		//국민인증서 Lite 정보
    kbstar.exec(successCallback, failCallback, "KBSignManager", "requestCertIssue", param);
};

/**
 * 시스템에 생체 등록 가능 확인
 *	displayPermission : 퍼미션 확인
 */
plugin.KBSignManager.prototype.requestCertIssue = function(successCallback, failCallback, displayPermission){
	var param = {};
	param.displayPermission = displayPermission;//퍼미션 확인
    kbstar.exec(successCallback, failCallback, "KBSignManager", "requestAvailableBiometrics", param);
};

/**
 * NonceMac 요청
 * authType : 인증 타입
 * kbsignNonce : kbSignNonce 값
 * info : 국민인증서 Lite 정보
 */
plugin.KBSignManager.prototype.requestGeneratorNonceMac = function(successCallback, failCallback, authType, kbsignNonce, info){
	if(info == undefined){
		info = "";
    }
	var param = {};
	param.authType = authType;
	param.kbsignNonce = kbsignNonce;
	param.info = info;
    kbstar.exec(successCallback, failCallback, "KBSignManager", "requestGeneratorNonceMac", param);
};

/**
 * 인증서 삭제
 * authType : 인증 타입
 * kbsignNonce : kbSignNonce 값
 * pin : pin 값
 * info : 국민인증서 Lite 정보
 */
plugin.KBSignManager.prototype.requestRemove = function(successCallback, failCallback, authType, kbsignNonce, pin, info){
	if(info == undefined){
		info = "";
    }
	var param = {};
	param.authType = authType;
	param.kbsignNonce = kbsignNonce;
	param.pin = pin;
	param.info = info;	
    kbstar.exec(successCallback, failCallback, "KBSignManager", "requestRemove", param);
};

/**
 * 인증서 폐기
 * pin : pin 값
 * info : 국민인증서 Lite 정보
 */
plugin.KBSignManager.prototype.requestRevoke = function(successCallback, failCallback, pin, info){
	if(info == undefined){
		info = "";
    }
	var param = {};
	param.pin = pin;
	param.info = info;	
    kbstar.exec(successCallback, failCallback, "KBSignManager", "requestRevoke", param);
};

/**
 * 인증서 정보 조회
 * info : 국민인증서 Lite 정보
 */
plugin.KBSignManager.prototype.requestCertInfo = function(successCallback, failCallback, info){
	if(info == undefined){
		info = "";
    }
	var param = {};
	param.info = info;	
    kbstar.exec(successCallback, failCallback, "KBSignManager", "requestCertInfo", param);
};

/**
 * 핀 번호 변경 요청
 * pin : 이전 pin
 * newPin : 신규 pin
 * info : 국민인증서 Lite 정보
 */
plugin.KBSignManager.prototype.requestChangePIN = function(successCallback, failCallback, pin, newPin, info){
	if(info == undefined){
		info = "";
    }
	var param = {};
	param.pin = pin;
	param.newPin = newPin;
	param.info = info;	
    kbstar.exec(successCallback, failCallback, "KBSignManager", "requestChangePIN", param);
};

/**
 * 초기 store 설정
 * storeType : store 형태
 */
plugin.KBSignManager.prototype.requestInitKBSignStore = function(successCallback, failCallback, storeType){
	var param = {};
	param.storeType = storeType;
    kbstar.exec(successCallback, failCallback, "KBSignManager", "requestInitKBSignStore", param);
};

/**
 * 생체 등록 요청
 * storeType : store 형태
 * info : 국민인증서 Lite 정보
 */
plugin.KBSignManager.prototype.requestRegisterBiometrics = function(successCallback, failCallback, insertType, pin, info){
	if(info == undefined){
		info = "";
    }
	var param = {};
	param.insertType = insertType;
	param.pin = pin;
	param.info = info;
    kbstar.exec(successCallback, failCallback, "KBSignManager", "requestRegisterBiometrics", param);
};

/**
 * 패턴 등록 요청
 * pin : pin
 * pattern : pattern
 * info : 국민인증서 Lite 정보
 */
plugin.KBSignManager.prototype.requestRegisterPattern = function(successCallback, failCallback, pin, pattern, info){
	if(info == undefined){
		info = "";
    }
	var param = {};
	param.pin = pin;
	param.pattern = pattern;
	param.info = info;
    kbstar.exec(successCallback, failCallback, "KBSignManager", "requestRegisterPattern", param);
};

/**
 * 생체 해제 요청
 * info : 국민인증서 Lite 정보
 */
plugin.KBSignManager.prototype.requestUnregisterBiometrics = function(successCallback, failCallback, info){
    if(info == undefined){
		info = "";
    }
	var param = {};
	param.info = info;
	kbstar.exec(successCallback, failCallback, "KBSignManager", "requestUnregisterBiometrics", param);
};

kbstar.addConstructor(function() {
    window.KBSignManager = new plugin.KBSignManager();
});

/**
 * 다중인증(모바일인증서)
 * @param {string}    authType         pin(핀번호),pattern(패턴),biometrics(지문)
 * @param {Json[]}    data    인증원문
 * @param {string}    digiSuccessCallback   성공시 callback
 * @param {string}    digiFailCallback     실패시 callback
 */
plugin.KBSignManager.prototype.requestKBCertSignForMulti = function(authType, data, digiSuccessCallback, digiFailCallback){
    var params = {
            authType : authType,
            data : data
    };    
        
    kbstar.exec(digiSuccessCallback, digiFailCallback, "KBSignManager", "requestKBCertSignForMulti", params);
};
    
kbstar.addConstructor(function() {
    window.KBSignManager = new plugin.KBSignManager();
});
