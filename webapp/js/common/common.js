$(function(){
	$(document).ajaxStart(function(e) {
		loading('start', e);
	});
	$(document).ajaxStop(function(e) {
		loading('stop', e);
	});
});

/**
 ********  공통 transaction **********
 * @param url
 * @param data
 * @param callBack
 * @param errorCallback
 * @param postAction
 */
function fn_transCall(url, data, callBack, errorCallback, postAction){

	let tranId 				= url.split('/').reverse()[0];
	let objCallBack 		= callBack;
	let objErrorCallback 	= errorCallback;
	let objPostAction 	= postAction;
	let contentType		= "application/x-www-form-urlencoded; charset=utf-8";
	
	if(typeof data === "string"){
		contentType = "application/json; charset=utf-8";
	}
	
	if(!isEmpty(data) && !isEmpty(data.contentType)){
		contentType = data.contentType;
	}

	$.ajax({
		type : "post",
		url : url,
		data : data,
		cache: false,
		dataType:  'json',		
		async: false,
		contentType: contentType,
		beforeSend : function(xhr, set) {
			let token = $("meta[name='_csrf']").attr("content");
			let header = $("meta[name='_csrf_header']").attr("content");
			xhr.setRequestHeader(header, token);
		},
		success : function(result, status, xhr) {
			if(typeof objCallBack == 'function'){
				objCallBack(tranId, result, status, data);
			}else{
				fn_callBack(tranId, result, status, data);
			}
		},
		error: function(xhr, status, error){
			switch(xhr.status){
			case 0:
				console.log('status : '+xhr.status);
				break;
			case 403:			
			case 404:
				setTimeout(function(){ 
					popalarm({
						msg : "잘못된 접근입니다. 다시 시도해 주세요.",
						cfrmYn : false
					}); }, 10);
				break;
			case 400:					
			case 401:					
			case 500:
			default:				
				if(typeof objErrorCallback == 'function'){
					objErrorCallback(tranId, xhr, status, error);
				}else{
					setTimeout(function(){ 
						popalarm({
							msg : "오류가 발생하였습니다. 다시 시도해 주세요.",
							cfrmYn : false
						}); }, 10);
					console.log(xhr.statusText);
				}
			break;
			}
		},
		complete: function(xhr, status){
			loading('stop');
			if(typeof objPostAction == 'function'){
				objPostAction(tranId, xhr, status);
			}
		}
	});
};

/**
 * form submit transaction
 * @param opt= { 
 * url
 * id : form id
 * type : "multipart/form-data"인경우 false
 * callBack: 성공콜백
 * errorCallback: 에러콜백
 * complete: 콜백후처리
 * }
 */
function fn_transFormSubmit(opt){
	
	let url 				= opt.url;
	let formId 			= opt.formId;
	let type				= opt.type;
	let callBack			= opt.callBack;
	let errorCallback	= opt.callBack;
	let postAction		= opt.callBack;
	let tranId 				= url.split('/').reverse()[0];
	
	if(isEmpty(type)){
		type = false;
	}
	
	$('#'+formId).ajaxSubmit({
		url:  url,
		type: "POST",
		enctype: (type === true ? !type : "multipart/form-data"),
		dataType : 'json',
		processData : type,
		contentType : (type === true ? "application/x-www-form-urlencoded; charset=utf-8" : !type),
		cache: false,
		timeout:600000,
		success : function(result, status, xhr) {
			if(typeof callBack == 'function'){
				callBack(tranId, result, status, data);
			}else{
				fn_callBack(tranId, result, status, data);
			}
		},
		error: function(xhr, status, error){
			switch(xhr.status){
			case 400:					
			case 401:					
			case 404:
			case 500:
//				location.href = '/error/error.jsp';
//				break;				
			default:				
				if(typeof errorCallback == 'function'){
					errorCallback(tranId, xhr, status, error);
				}else{
					let opt = {};
					if(!type){
						opt.msg = "정상적으로 첨부되지 않았습니다. 다시 한번 진행해 주세요.";
					}else{
						opt.msg = "오류가 발생하였습니다. 다시 시도해 주세요.";
					}
					opt.cfrmYn =  false;
					setTimeout(function(){ popalarm(opt); }, 10);
					console.log(xhr.responseText);
				}
				break;
			}
		},
		complete: function(xhr, status){
			loading('stop');
			if(typeof postAction == 'function'){
				postAction(tranId, xhr, status);
			}
		}
	});
};

//로그아웃 버튼 클릭
function layerLogout(){
	popalarm({
		msg : "로그아웃 하시겠습니까?",
		cfrmYn : true,
		okCallback : logout
	});
};

//로그아웃
function logout() {
	$.ajax({
	    url:  '/system/login/logoutAction',
	    type: 'POST',
		beforeSend : function(xhr, set) {
			let token = $("meta[name='_csrf']").attr("content");
			let header = $("meta[name='_csrf_header']").attr("content");
			xhr.setRequestHeader(header, token);
		},
	    success: function(data) {
	    	location.replace('/system/login/logout');
	    },
	    error: function(e) {
			console.log(e.responseText.trim());
	    },
	    complete: function() {}
	});
}

//KBPLUS 로그아웃
function kbplusLogout() {
	$.ajax({
		url:  '/system/login/logoutAction',
		type: 'POST',
		beforeSend : function(xhr, set) {
			let token = $("meta[name='_csrf']").attr("content");
			let header = $("meta[name='_csrf_header']").attr("content");
			xhr.setRequestHeader(header, token);
		},
		success: function(data) {
            kbplusEvent();
		},
		error: function(e) {
			console.log(e.responseText.trim());
		},
		complete: function() {}
	});
}

// KBPLUS 이벤트
function kbplusEvent() {
    console.log('[kbplusLogout Success]');
    if(getOsInfo().indexOf('app') != -1){
	    callAppService({
			action_code : 'A0314',	// genKey
	    });

	    if(location.href.indexOf('ssoBridge') > -1){
	        ssoLogoutCallback();
	    }else{
	        location.replace('/');
	    }

	}else{
	    if(location.href.indexOf('ssoBridge') > -1){
            ssoLogoutCallback();
	    }
	}
}

//메인페이지로 이동
function goToMain() {
	if(getOsInfo() === 'android_app'){
		callAppService({
			action_code : 'A0315',	// history삭제
		});
	}
	location.replace('/');
}

function goLogin(url){
	if(getOsInfo().indexOf('app') != -1){
		getDeviceInfo();
		// APP 로그인
		setTimeout(()=>{
			callAppService({
				action_code : 'A0105',
				action_param : 
				{
					c_login : (isEmpty(sessionStorage.getItem('c_login')) ? "" : sessionStorage.getItem('c_login')),
					redirectUrl : (isEmpty(url) ? "" : url)
				}  
			});
			sessionStorage.removeItem('c_login');
		}, 100);
	}else{
		if(isEmpty(url)){
			location.replace("/system/login/login");
		}else{
			location.replace("/system/login/login?redirectUrl="+url);
		}
	}
};

/**
 * loading...
 * @param state
 */
function loading(state, e) {

	if(location.href.indexOf('/support/customer/usim-search') != -1){	// 유심 찾기 제외
		return;
	}
	if(location.href.indexOf('/membership/place-search') != -1){		// 멤버십 찾기 제외
		return;
	}
	if(location.href.indexOf('event-firstLogin') != -1 && isEmpty(e)){		// 룰렛이벤트는 로딩이미지 제외
		return;
	}
	if(location.href.indexOf('search/result') != -1){	// 통합검색 로딩이미지 제외
		return;
	}
	if(location.href.indexOf('/open/open-request-new') != -1
	    || location.href.indexOf('/open/open-request-transfer') != -1
	    || location.href.indexOf('/open/desire-number') != -1
	    || location.href.indexOf('join/open/checkSelfNp') != -1
	    || location.href.indexOf('/open/transfer-agree') != -1){         // 셀프개통 제외
		return;
	}
	if(getOsInfo().indexOf('app') != -1){		// APP 로딩이미지 제외
		if (state == 'start'){
			callAppService({
				action_code : 'A0312',	// APP 로딩 ON
			});
		}else 	if (state == 'stop'){
			callAppService({
				action_code : 'A0313',	// APP 로딩 OFF
			});
		}
		return;
	}
	if (state == 'start' && !$('.loading_wrap > div').hasClass('dimmed')) {
		$('body').addClass('no_scroll');
		$('.loading_wrap').append('<div class="dimmed"></div><div class="lottie"><lottie-player src="/img/common/loading.json" background="transparent" speed="1" loop autoplay></lottie-player></div>');
	} else if (state == 'stop' && $('.loading_wrap > div').hasClass('dimmed')) {
		$('body').removeClass('no_scroll');
		$('.loading_wrap').empty();
	}
};

/**
 * Page Header Button제어
 * @param t
 *  sub: 서브타이틀
 *  detail: 상세타이틀
 *  join: 가입/개통
 */
function setHeaderType(t){
	if(t == 'sub'){
		$('.back_area').show();
		$('#btnHeaderHome').show();
		$('#btnHeaderSearch').show();
		$('#btnHeaderMenu').show();
		$('#btnHeaderClose').hide();
	}else if(t == 'detail'){
		$('.back_area').hide();
		$('#btnHeaderHome').hide();
		$('#btnHeaderSearch').hide();
		$('#btnHeaderMenu').hide();
		$('#btnHeaderClose').show();
	}else if(t == 'join'){
		$('.back_area').show();
		$('#btnHeaderHome').hide();
		$('#btnHeaderSearch').hide();
		$('#btnHeaderMenu').hide();
		$('#btnHeaderClose').show();
	}

    // 스타뱅킹 테마서비스 인앱브라우저 관련 버튼 재정의
	if(!isEmpty(sessionStorage.getItem('inPath'))){
	    if(sessionStorage.getItem('inPath') == "kbbank"){
            //스타뱅킹 웹뷰에서 메인을 통해 화면 이동했다면 헤더 버튼 제어를 하지 않는다.
            if(document.referrer == "http://" + location.host + "/" || document.referrer == "https://" + location.host + "/"){
                sessionStorage.setItem('inPath', 'kbbank_main');
                return;
            }else{
                $('.back_area').hide();
                $('#btnHeaderHome').show();
                $('#btnHeaderSearch').hide();
                $('#btnHeaderMenu').hide();
                $('#btnHeaderClose').hide();

                if(t == 'join'){
                    $('#btnHeaderHome').hide();
                    if(location.href.indexOf('join-supplies') === -1 && location.href.indexOf('self-open-guide') === -1){
                        $('.back_area').show();
                    }
                }
            }
         }
    }
};

/**
 * 앱 서비스 연동
 * @param opt {
 * action_code : 앱서비스 code
 * action_param : param (JSON)
 * callBack : 콜백 (문자열)
 * }
 */
function callAppService(opt){
	if(getOsInfo() === 'ios_app'){
		window.webkit.messageHandlers.webAction.postMessage(opt);
	}else if(getOsInfo() === 'android_app'){
		window.android.webAction(JSON.stringify(opt));
	}
};

/**
 * 디바이스정보 호출
 */
function getDeviceInfo(){
	callAppService({
		action_code : 'A0301',
		callBack : 'fn_callbackDeviceInfo' 
	});
};

/**
 * 디바이스정보 생성
 * @param _d
 */
function fn_callbackDeviceInfo(_d){
	let _data = JSON.parse(_d);
	for(key in _data){
		sessionStorage.setItem(key,  _data[key]);
	}
}


/**
 * APP GNB ON/OFF
 * @returns
 */
function fn_gnbOnOff(_p){
	if(getOsInfo().indexOf("app") !== -1){
		if(isEmpty(_p)){
			_p = location.href;
		}

		if(_p.indexOf("/system/main/appMenu") != -1){
			return;
		}
		if(_p.indexOf("/system/gnbbar/kbPlus") != -1){
			return;
		}
		if(_p.indexOf("/system/main/ssoBridge") != -1){
			return;
		}
		if((_p === "http://"+location.host+"/"
		|| _p === "https://"+location.host+"/"
		|| _p.indexOf("/system/main/main") != -1)){
			return;
		}

		if(_p.indexOf("/rateplan/plans/products") != -1
			|| _p.indexOf("/info/mypage/join-info") != -1){
			callAppService({
				action_code : 'A0204',	// APP GNB ON
			});
		}else{
			callAppService({
				action_code : 'A0205',	// APP GNB OFF
			});
		}
	}
}

/**
 * url filter
 * @param url
 * @returns
 */
function urlFilter(url){
	if(url.indexOf('/biz/') == 0){
		return url;
	}else if(url.indexOf('/error/') == 0){
		return url;
	}else if(url.indexOf('/info/') == 0){
		return url;
	}else if(url.indexOf('/join/') == 0){
		return url;
	}else if(url.indexOf('/mypage/') == 0){
		return url;
	}else if(url.indexOf('/rateplan/') == 0){
		return url;
	}else if(url.indexOf('/service/') == 0){
		return url;
	}else if(url.indexOf('/support/') == 0){
		return url;
	}else if(url.indexOf('/system/') == 0){
		return url;
	}else if(url.indexOf('/search/') == 0){
		return url;
	}else{
		return "/error/error";
	}
}

/**
 * history.back()
 * @returns
 */
function goPrevPage(){
	if(getOsInfo() === 'android_app'){
		try{
			if(johyLayer.instances.length > 0){
				modalLayer.hide()
				return;
			}
		}catch(e){ console.log(e); }
	}
	if(document.referrer === "http://"+location.host+"/"
			|| document.referrer === "https://"+location.host+"/"
			|| document.referrer.indexOf("/system/main/main") != -1){
		goToMain();
	}else{
		fn_gnbOnOff(document.referrer);
		history.back();
	}
}

/**
 * 안드로이드 팝업닫기
 * @returns
 */
function closePopup(){
	if(getOsInfo() === 'android_app'){
		try{
			if(johyLayer.instances.length > 0){
				modalLayer.hide()
				return;
			}
		}catch(e){ console.log(e); }
		
		callAppService({
			action_code : 'A0211'	// 팝업닫기
		});
	}
}

/**
 * 안드로이드 빽버튼 메뉴닫기 이벤트
 * @returns
 */
function closeMenu(){
	fn_gnbOnOff();
	_aside.close();
}

/**
 * 안드로이드 메인화면 빽버튼 이벤트
 * @returns {Boolean}
 */
function btnMainBack(){
	if(getOsInfo() === 'android_app'){
		let yn = 'N';
		if($(document).find('.header').find('.aside_wrap').hasClass('on')){
			_aside.close();
			callAppService({
				action_code : 'A0204',	// APP GNB ON
			});
			yn = 'Y';
		}

		//팝업 창이 1개인 경우일 때만 
		//팝업이 2개 떠있는 경우가 있음 * 긴급점검 팝업
		if(johyLayer.instances.length == 1){
			modalLayer.hide();
			
			callAppService({
				action_code : 'A0204',	// APP GNB ON
			});
 
			yn = 'Y';
		}
		callAppService({
			action_code : 'A0319',	// 메인화면 빽버튼
			action_param : { execYn : yn}	// 웹에서 버튼 이벤트 수행시 'Y' 아닐시 'N' 
		});
	}
}

//IOS 카메라 권한 동의 여부 체크 호출
function callIosCameraAuth(){
	callAppService({
		action_code : 'A0320',
		callBack : 'callbackIosCameraAuth' 
	});	

	//*호출화면 마다 하단 콜백 함수 작성 필요
	//callbackIosCameraAuth
}

// KB Liiv M 챗봇 상담이동
function goLiivMChatBotPage() {
	
	if(getOsInfo().indexOf("app") != -1) {
		
		callAppService({
			action_code : 'A0213'
		});	
		
	} else {
		// 모바일웹 : KB Liiv M 챗봇 상담이동 
		var properties = "width="+screen.width+",height="+screen.height+",fullscreen=yes";
		
		var LiivMChatbotWindow = window.open('about:blank', 'LiivMChatbotWindow', properties);

		var eleChat = document.createElement('a');
		eleChat.target = "LiivMChatbotWindow";
		eleChat.href= "/support/customer/chatbot";
		eleChat.click();
	}
}

var dLiivMChatbotMessage = function(e){	
	if(getOsInfo().indexOf("app") === -1) {
		var data = e.data;
		if(e.origin == "https://dliivmchatbot.kbstar.com:27443") {
			//개발    
			if( data.exec == "login.complete" ) {
				setTimeout(function(){
					location.reload();
				},2000);
			}
		} else if( e.origin == "https://tliivmchatbot.kbstar.com:7443" ) {
			//스테이지
			if( data.exec == "login.complete" ) {
				setTimeout(function(){
					location.reload();
				},2000);
			}
		} else if( e.origin == "https://liivmchatbot.kbstar.com" ) {
			//운영
			if( data.exec == "login.complete" ) {
				setTimeout(function(){
					location.reload();
				},2000);
			}
		}
	}
};
window.addEventListener("message", dLiivMChatbotMessage);
