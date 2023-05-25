/*
 * KB확장형플랫폼 사용을 위한 I/F js
 * 
 */
var expanPlfm = function(){

	
	var expanObj = new Object();
	var expanUrlQueryString = "";
	
	/**
	 * 
	 * 계열사간SSO 1번거래
	 * successCallback : 성공시 호출받을 return Function 명 
	 * groupCocd       : 그룹회사코드(KB0.....)
	 * appKnd          : 스타뱅킹(1), 그 뒤로는 논의해야함
	 * onCloseData     : 네이티브의 상단 닫기 버튼을 눌렀을 때 호출한 페이지로 전달할 데이터("action": "move_to", "page": "D000047", "params": "a=b&c=d")
	 * addParams       : domain 에 추가되는 값으로 get 으로 호출한다.
	 */
	function afltsso(successCallback,  groupCocd, appKnd, onCloseData, addParams) {  
		expanObj.successCallback = successCallback;
		expanObj.groupCocd = groupCocd;
		expanObj.appKnd = appKnd;
		expanObj.crtfiKndDstcd = "1";
		expanObj.calledAction = "1006911";
		expanObj.startCase = "0";
		expanObj.onCloseData = onCloseData;
		expanObj.addParams = addParams;
		
		if(expanObj.onCloseData != undefined){ 
			expanObj.defaultPage = expanObj.onCloseData.page;
			
		}
		
		if(expanObj.defaultPage == undefined){
			expanObj.defaultPage = "D001373";
		}
		
		checkUsimInfo();
		
		//임시로직 (웹 환경에서 정보를 가져올 수 없는 상황)
		//byPassLogin();
	}

	/**
	 * 계열사간SSO 2번거래
	 * successCallback : 성공시 호출받을 return Function 명 
	 * failCallback    : 실패시 호출받을 return Function 명
	 * ci              : 입력받는 값(CI)
	 * groupCocd       : 그룹회사코드(KB0.....)
	 * appKnd          : 스타뱅킹(1), 그 뒤로는 논의해야함
	 * appKey          : UDID값(deviceUniqueId)
	 * crtfiKndDstcd   : KB국민인증서(1) 
	 * kBCrtfiSerno    : KB국민인증서 Berry 값
	 */
	function ssoRegiInfo() {
		
		expanObj.calledAction = "1008297";

		doAjaxSSO();
	}
	
	/**
	 * 계열사간SSO 3번거래
	 * successCallback : 성공시 호출받을 return Function 명 
	 * failCallback    : 실패시 호출받을 return Function 명
	 * ci              : 입력받는 값(CI)
	 * groupCocd       : 그룹회사코드(KB0.....)
	 * appKnd          : 스타뱅킹(1), 그 뒤로는 논의해야함
	 * appKey          : UDID값(deviceUniqueId)
	 * crtfiKndDstcd   : KB국민인증서(1)
	 * kBCrtfiSerno    : KB국민인증서 Berry 값
	 * ssoSerNo        : 앞에 결과로부터 받은 sso일련번호 값
	 */
	function ssoLoginAndssoKey() {

		expanObj.calledAction = "1007997";

		doAjaxSSO();
	}
	
	/**
	 * 채널간 SSO 1번거래
	 * successCallback : 성공시 호출받을 return Function 명 
	 * failCallback    : 실패시 호출받을 return Function 명
	 * addData1        : 추가전송필요가 있을시 전송(String 값 정의)
	 * addData2        : 추가전송필요가 있을시 전송(String 값 정의)
	 * addData3        : 추가전송필요가 있을시 전송(String 값 정의)
	 * addData4        : 추가전송필요가 있을시 전송(String 값 정의)
	 * addData5        : 추가전송필요가 있을시 전송(String 값 정의)
	 * 채널간SSO 거래를 위해 KBPIN, 사용자명, 로그일시 의 값이 존재하나, 이는 로그인Session 값에서 가져오도록 한다.(비로그인 시 에러)
	 */
	function chanelsso(successCallback, failCallback, addData1 , addData2, addData3, addData4, addData5){
		
		expanObj.successCallback = successCallback;
		expanObj.failCallback = failCallback;
		expanObj.startCase = "0";
		
		if(addData1 == undefined) addData1 = ''; 
		if(addData2 == undefined) addData2 = '';
		if(addData3 == undefined) addData3 = '';
		if(addData4 == undefined) addData4 = '';
		if(addData5 == undefined) addData5 = '';
		
		
		var params= {
				addData1 : addData1,
				addData2 : addData2,
				addData3 : addData3,
				addData4 : addData4,
				addData5 : addData5 
		}

		kbstar.connect.request('/mquics?QAction=1033402', params , onChanelSuccessCallback, onCnstnCnfrmFail, true);
		
	}
	
	/**
	 * webBrowse 호출용 function(타이틀추가)
	 * closeCallback 	: 확장형 플랫폼을 닫을시 호출될 콜백 함수
	 * groupCocd  		: 그룹회사코드
	 * appKnd     		: 호출별로 정의된 코드
	 * onCloseData     	: 네이티브의 상단 닫기 버튼을 눌렀을 때 호출한 페이지로 전달할 데이터("action": "move_to", "page": "D000047", "params": "a=b&c=d", "isConfirm":"Y", "confirmMsg": '지금 닫으시면 입력하신 정보가 삭제됩니다. 정말 닫으시겠습니까?')
	 * pageTitle		: 확장형 플랫폼 타이틀명
	 * urls				: 이동할 URL 없으면 빈값 
	 * isMinimum		: 창간 최소화 가능 여부(default:Y)  
	 */
	function callWebBrowseSetTitle(closeCallback, groupCocd, appKnd, onCloseData, pageTitle, urls, isMinimum){
		//callWebBrowseSetTitle함수는 전달받은 텍스트를 웹뷰타이틀로 사용
		expanObj.pageTitle = pageTitle;
		expanObj.isMinimum = isMinimum;	// 창간이동 사용여부 
		expanObj.closeAction = onCloseData.action;	// 콜백함수 구분
		callWebBrowse(closeCallback, groupCocd, appKnd, onCloseData, urls, isMinimum);
	}
	
	/**
	 * webBrowse 호출용 function
	 * closeCallback 	: 확장형 플랫폼을 닫을시 호출될 콜백 함수
	 * groupCocd  		: 그룹회사코드
	 * appKnd     		: 호출별로 정의된 코드
	 * onCloseData     	: 네이티브의 상단 닫기 버튼을 눌렀을 때 호출한 페이지로 전달할 데이터("action": "move_to", "page": "D000047", "params": "a=b&c=d", "isConfirm":"Y", "confirmMsg": '지금 닫으시면 입력하신 정보가 삭제됩니다. 정말 닫으시겠습니까?')
	 * urls				: 이동할 URL 없으면 빈값 
	 * isMinimum		: 창간 최소화 가능 여부(default:Y)
	 */
	function callWebBrowse(closeCallback, groupCocd, appKnd, onCloseData, urls, isMinimum){
		//debugger;
		// 2022-06-07 P20222164743 창간이동끄기 여부 bit
		expanObj.isMinimum = isMinimum;	// 창간이동 사용여부  
		expanObj.closeAction = onCloseData.action;	// 콜백함수 구분
		expanObj.callUrl = urls;
		
		// urls - param 조회를 통해 가져와야 하는 경우는 빈값 
		if(expanObj.callUrl != undefined && expanObj.callUrl != '') {
			if(expanObj.successCallback == "" || expanObj.successCallback == undefined){
				expanObj.successCallback = closeCallback;
			}
			if(expanObj.groupCocd == "" || expanObj.groupCocd  == undefined){
				
				expanObj.groupCocd = groupCocd;
			}
			
			if(expanObj.onCloseData == "" || expanObj.onCloseData  == undefined){
				
				expanObj.onCloseData = onCloseData;
			}
			
			// urls - 따로 세팅을 해 놓은 경우
			getPrptyCompleteWithCheck("");
		} else {
			//alert("callWebBrowse in 그룹회사코드:["+groupCocd+"] , 앱종류:["+appKnd+"], closeData:["+onCloseData+"], callback:["+closeCallback+"]");
			
			if(groupCocd == undefined || groupCocd == ""){
				alert("그룹회사코드가 입력되지 않았습니다."); 
				return false;
			}
			if(appKnd == undefined || appKnd == "" ){
				alert("앱종류가 입력되지 않았습니다.");
				return false;
			}
			//alert("expanObj.successCallback:["+expanObj.successCallback+"] , expanObj.groupCocd :["+expanObj.groupCocd +"]");
			if(expanObj.successCallback == "" || expanObj.successCallback == undefined){
				expanObj.successCallback = closeCallback;
			}
			if(expanObj.groupCocd == "" || expanObj.groupCocd  == undefined){
				
				expanObj.groupCocd = groupCocd;
			}
			
			if(expanObj.onCloseData == "" || expanObj.onCloseData  == undefined){
				
				expanObj.onCloseData = onCloseData;
			}
	
			var params = {
							groupCoCd : groupCocd,
							upmuCd : appKnd
						};
			
			kbstar.connect.request('/mquics?QAction=1052089', params , getPrptyCompleteWithCheck, loginCheckFailCallback, true);
			
		}
		
	}
	
	function getPrptyCompleteWithCheck(data){
	
		try{
			var urls; 
			
			if(expanObj.callUrl != undefined && expanObj.callUrl != "") {
				// urls - 따로 세팅을 해 놓은 경우 
				urls = expanObj.callUrl;
			} else {
				// urls - param 조회를 통해 가져온 경우 
				urls = data.data.msg.servicedata.linkedUrl;
			}
			//window.ExtendPlatformManager.openExtendWebView(urls , expanObj.groupCocd, '', '', expanObj.onCloseData, window.SPA_COMMON.callbackWithSPA(expanObj.successCallback, data));
			if (expanObj.onCloseData != undefined) {
				expanObj.onCloseData.navigateFlag = expanObj.onCloseData.navigateFlag || "navigateWithCurrPageHistoryRemove";
			}
			//	2022-05-23 P20222164743 setUrlQueryString 관련 소스 수정 ==========> START
			//	setUrlQueryString 을 통해서 querystring을 저장한 경우
			//	urls 뒤에 querystring을 붙여준다
			if (expanUrlQueryString != '') {
				//	1. 마지막 문자가 ? 인지 체크
				if (urls.substring(urls.length-1, urls.length) != '?') {
					//	2. url 내에 ? 가 있는지 체크
					if (urls.indexOf('?') > -1) {
						urls = urls + '&' + expanUrlQueryString;
					} else {
						urls = urls + '?' + expanUrlQueryString;
					}
				} else {
					urls = urls + expanUrlQueryString;					
				}
			}
			
			//	setUrlQueryString 함수로 세팅한 경우 앞에 '&'를 붙여준다
			if(expanObj.addParams != undefined){
				if (expanUrlQueryString != '') {
					urls = urls+ '&' +expanObj.addParams;
				} else {
					urls = urls+ expanObj.addParams;
				}
			}
			
			//	url 세팅 후 querystring 값 초기화
			if (expanUrlQueryString != undefined && expanUrlQueryString != '') {
				expanUrlQueryString = '';
			}
			//	2022-05-23 P20222164743 setUrlQueryString 관련 소스 수정 ==========> END
			
			
			//전달받은 타이틀이 없는경우 ETC->KBO로 변경하여 네이티브를 호출(국민은행이미지노출됨)
			if(expanObj.pageTitle == "" || expanObj.pageTitle  == undefined){
				expanObj.pageTitle = "";
				if(expanObj.groupCocd == "ETC") {
					expanObj.groupCocd ="KB0";
				}
			}

			// 창간이동 bit 가 off이고 callback이 있을 경우 as-is
			// 그 외의 경우 to-be
			if(expanObj.isMinimum != undefined && expanObj.isMinimum == 'N' 
				&& expanObj.closeAction != undefined && expanObj.closeAction == 'callback') {
				// callback 적용 이전 
				window.ExtendPlatformManager.openExtendWebView(urls , expanObj.groupCocd, expanObj.pageTitle
						, expanObj.onCloseData, expanWebCloseCallback, expanObj.isMinimum);
			} else {
				// callback 적용 이후 
				// 2022-05-30 P20222164743 goBack 로직 분할 ==========================> START
				// callback이 있으면 oldVersion callback이 없으면 newVersion
				window.cmnExpanPlfm.openExtendWebView(urls, expanObj.groupCocd, expanObj.pageTitle, expanObj.onCloseData, expanObj.isMinimum);
				// 2022-05-30 P20222164743 goBack 로직 분할 ==========================> END
			}
			// callback 적용 이전 
			/*window.ExtendPlatformManager.openExtendWebView(urls , expanObj.groupCocd, expanObj.pageTitle
							, expanObj.onCloseData, expanWebCloseCallback);
			*/
		}catch(e){alert(e);}		 
	}
	
	
	/**
	 * (필수) 로그인 후 거래에서만 호출 해야합니다.(CI값을 로그인이 된 경우에만 보낼 수 있으므로)
	 * innerSSO 는 계열사SSO 거래에 대하여 기존 app To app 으로 호출하는 업무팀에서 사용시 편의를 제공하고자 만들어놓았다.
	 * 기존 확장형플랫폼의 경우는 1번 순서부터 진행하지만 appToapp 으로 호출되는 거래의 경우 1또는 2를 선택적으로 호출하므로  
	 * 내부적으로 deviceUniqueId 와 kBCrtfiSerno 를 추가로 받는다.
	 * 
	 */
	function innerSSO(successCallback,  groupCocd, appKey, appKnd, kBCrtfiSerno, startCase){
		expanObj.successCallback = successCallback;
		expanObj.failCallback = successCallback;
		expanObj.groupCocd = groupCocd;
		expanObj.appKnd = appKnd;
		expanObj.crtfiKndDstcd = "1";
		expanObj.appKey = appKey;
		expanObj.kBCrtfiSerno = kBCrtfiSerno;
		expanObj.startCase = startCase;
		
		if(startCase == "1") expanObj.calledAction = "1006911";
		else                 expanObj.calledAction = "1008297";
		
		doAjaxSSO();
	}
	
	function doAjaxSSO(){
		try{

			var params = setJsonData();
			
			
			//mnExpanCallApi.jsp
			kbstar.connect.request('/mquics?QAction=1052086', params , nextSuccess, loginCheckFailCallback, true);
			
		}catch(e){alert("doAjaxSSO 에러"+e)};		
	}
	
	// 내부에서만 처리하며 외부에 공유하지 않는다.
	function setJsonData(){
		var params = {};
		//alert("setJsonData : "+expanObj.calledAction);
		if(expanObj.calledAction == "1006911" || expanObj.calledAction == "1008297"){  //SSO동의체크, SSO동의등록
			
			params.API_groupCoCd = "KB0";
			params.API_appKnd = expanObj.appKnd;
			params.API_appKey = expanObj.appKey;
			params.API_crtfiKndDstcd = "01";
			params.API_kBCrtfiSerno = expanObj.kBCrtfiSerno;
			params.API_lginHMS = currentTime();
		
		}else if(expanObj.calledAction == "1007997" ){  //로그인확인및 SSO Key발행
			
			params.API_groupCoCd = "KB0";
			params.API_appKnd = expanObj.appKnd;
			params.API_appKey = expanObj.appKey;
			params.API_crtfiKndDstcd = "01";
			params.API_kBCrtfiSerno = expanObj.kBCrtfiSerno;
			params.API_serNo = expanObj.ssoSerNo;
			
		}else {}
		
		//공통 값
		setUrls();  //값 전달 후 url 값 들어옴
		params.calledAction = expanObj.calledAction;
		params.urls         = expanObj.openAPIUrl;
		
		return params;
	}
	
	// 내부에서만 처리하며 외부에 공유하지 않는다.
	function currentTime(){
		
		try{
			var nowTime;
			var currentTime = new Date();
			var hours = currentTime.getHours();
			var minutes = currentTime.getMinutes();
			var sec = currentTime.getSeconds();
			
			nowTime = hours +""+ minutes + ""+ sec; 
			return nowTime;
		}catch(e){alert(e)};
	}
	
	// 내부에서만 처리하며 외부에 공유하지 않는다.
	function setUrls(){
		if(expanObj.calledAction == "1006911") {
			expanObj.openAPIUrl = "/caq/kbsign/sso/check/ssoAgreeYNandRegister/ver1";
		}else if(expanObj.calledAction == "1008297") {
			expanObj.openAPIUrl = "/caq/kbsign/sso/store/ssoLoginInfo/ver1";
		}else if(expanObj.calledAction == "1007997") {
			expanObj.openAPIUrl = "/caq/kbsign/sso/confirmAndPub/ssoLoginAndSsoKey/ver1";
		}else if(expanObj.calledAction == "1008000") {
			expanObj.openAPIUrl = "/caq/kbsign/sso/confirmAndPub/ssoCustomerAndToken/ver1";             
		}else if(expanObj.calledAction == "1007261") {
			expanObj.openAPIUrl = "/caq/kbsign/sso/delivery/ssoLoginInfo/ver1";
		}
	}
	
	function onCnstnCnfrmFail(data){
		 
		try{
			expanObj.failCallback(data);
		}catch(e){
			alert(e);
		}
	}
	
	function onChanelSuccessCallback(data){
		try{
			
			window.SPA_COMMON.callbackWithSPA(expanObj.successCallback, data);
		}catch(e){
			alert(e);
		}
		
	}
	
	function nextSuccess(data) {
		try{
			
			
			var jsonData = data.data.msg.servicedata;
			
			var bodyData   = jsonData.dataBody;
			var headData   = jsonData.dataHeader;
			
			var successCode=	headData.successCode;
			var resultMessage = headData.resultMessage;

			
			if(expanObj.calledAction == "1006911"){
				if(successCode == 0){
					var cnsntYn = bodyData.sSOCnsntYn;
					//정상 처리 완료 
					if(cnsntYn == "1"){
						expanObj.ssoSerNo = bodyData.sSOSerno; 
						ssoLoginAndssoKey();
					}else{
						var stpulCtnt = bodyData.stpulCtnt;
						ssoRegiInfo();
					}
				}else{
					alert("거래 처리중 오류가 발생하였습니다.["+successCode+"]["+resultMessage+"]");
				}
				
			}else if(expanObj.calledAction == "1008297"){ //약관등록
				if(successCode == 0){
					var cnsntYn = bodyData.sSOCnsntYn;
					if(cnsntYn == 1){
						expanObj.ssoSerNo = bodyData.sSOSerno;
						ssoLoginAndssoKey();
					}
					
				}else{
					alert("거래 처리중 오류가 발생하였습니다.["+successCode+"]["+resultMessage+"]");
				}
			}else if(expanObj.calledAction == "1007997"){
				if(successCode == 0){
					var samlAssertion = bodyData.samlAssertion;
					
					
					var sParam = {
						"samlAssertion" : samlAssertion,
						"ssoSerno"      : expanObj.ssoSerNo,
						"encCI"         : jsonData.ci,
						"appKnd"        : expanObj.appKnd,
						"kBCrtfiSerno"  : jsonData.kbSerno
					};
					
					if(expanObj.startCase == "0"){
						window.ExtendPlatformManager.setExtendData(ssoCompleteSuccessCallback , ssoCompleteFailCallback, sParam);
					}else{
						//내부 계열사SSO로 호출하는경우(app To app case)
						window.SPA_COMMON.callbackWithSPA(expanObj.successCallback, sParam);	
					}
					       
				}else{
					alert("거래 처리중 오류가 발생하였습니다.["+successCode+"]["+resultMessage+"]");
				}
			}
			
		}catch(e){
			//alert(e);
			alert(e);
		}
	}
	
	function checkUsimInfo(){

		window.SystemInfoManager.getSystemInfoForUsim(checkKbSign);
	}
	
	function checkKbSign(data){
		expanObj.appKey = data.deviceUniqueId;
		
		//네이티브 인증서가 없을 경우 failCallback 으로 빠진다.
		window.KBSignManager.requestCertInfo(certSuccessCallBack, certFailCallBack);
	}
	
	function certSuccessCallBack(data){
		
		if(data == ""){
			certFailCallBack();
		}
		
		//임시로 평문 값을 넣어둔다.
		expanObj.kBCrtfiSerno = data.serialNumber;
		kbstar.connect.request('/mquics?QAction=1052087',"" , loginCheckSuccessCallback, loginCheckFailCallback, true);
	}
	
	function loginCheckSuccessCallback(data){
		
		var loginYn	= data.data.msg.servicedata.로그인여부;
		expanObj.accessMediaDstic	= data.data.msg.servicedata.매체구분;
		
		if(loginYn != "Y"){
			if(confirm("로그인 후 거래 바랍니다.")){
				window.configManager.requestCertLogin(expanObj.defaultPage, "0");
				return false;
			}
		}
		
		if(!(expanObj.accessMediaDstic.toLowerCase() == "k1" || expanObj.accessMediaDstic.toLowerCase() == "k2" || expanObj.accessMediaDstic.toLowerCase() =="k3")){

			if(confirm("KB국민인증서로 로그인 후 거래하시기 바랍니다.")){
				window.UserPreference.setValue(
		        		function(){ window.configManager.requestCertLogin(expanObj.defaultPage); },
		        		function(){}, 
		        		"LOGIN.NXT", 
		        		"KS"
		    		);
			}else{
				//
				window.navi.navigateWithCurrPageHistoryRemove('/mquics?page='+expanObj.defaultPage ,{},function(){});
			}
			return false;
		}
		doAjaxSSO();
		
	}
	
	/**
	 * 이 로직은 web에서 확인하는 임시로직임
	 */
	function byPassLogin(){
		expanObj.appKey = "asdafsdfasdfawewas";
		expanObj.kBCrtfiSerno  = "1003208";
		doAjaxSSO();
	}
	
	
	function loginCheckFailCallback(data){
		
		caq.error.caq_printError(data);   
	}
	function certFailCallBack(data){
		try{
			if(confirm("KB국민인증서 로그인이 필요한 서비스입니다. KB국민인증서를 발급하시겠습니까? ")){
				window.navi.navigate('/mquics?page=D000986',{},function(){});
			}else{
				window.navi.navigateWithCurrPageHistoryRemove('/mquics?page='+expanObj.defaultPage,{},function(){});
			}
		}catch(e){
			alert("certFailCallBack:"+e);
		}
	}
	
	function ssoCompleteSuccessCallback(data){

		callWebBrowse(expanObj.successCallback , expanObj.groupCocd, expanObj.appKnd , expanObj.onCloseData);
	}
	
	function ssoCompleteFailCallback(data){
		window.SPA_COMMON.callbackWithSPA(expanObj.failCallback, data);
		
	}
	
	//	2022-05-23 P20222164743 setUrlQueryString 관련 소스 수정 ==========> START
	/**
	 * callWebBrowse 사용 시
	 * url에 붙여줄 query string 을 세팅
	 */
	function setUrlQueryString(queryString) {
		if (queryString) {
			expanUrlQueryString = queryString;
		}
	}

	/**
	 * setUrlQueryString함수로 expanObj 오브젝트에
	 * 저장한 데이터를 리턴
	 */
	function getUrlQueryString() {
		return expanUrlQueryString;
	}
	//	2022-05-23 P20222164743 setUrlQueryString 관련 소스 수정 ==========> END
	
	//	2022-05-31 P20222164743 setCustInfo 관련 소스 수정 ================> START	
	/**
	  * extendData에 고객정보를 추가 세팅하는 function
	  *  param
	  *   custObj : 고객정보를 담은 객체
	  *    ex) custObj = {
	  *       custNm  : "성명(고객명)"
	  *       brdt  : "생년월일(20010101)"
	  *       gndr  : "성별(1-남자,2-여자)"
	  *       cntpOwhus : "연락처_자택(02-123-1234)"
	  *       cntpMbl : "연락처_mobile(010-1234-5678)"
	  *       cntpWplc : "연락처_직장(02-123-1234)"
	  *       emad  : "연락처_E-mail(test@test.com)"
	  *       owhusAddr1 : "자택주소1(서울시 서울구 서울동)"
	  *       owhusAddr2 : "자택주소2(서울로 12길 12-5 6301)"
	  *       wplcAddr1 : "직장주소1(서울시 서울구 서울동)"
	  *       wplcAddr2 : "직장주소2(서울로 12길 12-5 6301)"
	  *       occu  : "직업(직업소분류명)"
	  *     }
	  *   successCallback : 고객정보 제공 이후 해야할 function 지정
	  * */
	function setCustInfo(custObj, successCallback) {
		//debugger;
		// 기존에 set되어있던 내용꺼내기 
		
		if(successCallback == undefined) {
			successCallback = function() {};
		}
		
		window.ExtendPlatformManager.getExtendData(function(sData) {
			// 기존에 setting되어있는 데이터가 있는 경우 
			var params = sData;
			params.custInfo = custObj;
			window.ExtendPlatformManager.setExtendData(successCallback , onFailCallback , params);
		}, function(fData) {
			var params = {};
			params.custInfo = custObj;
			window.ExtendPlatformManager.setExtendData(successCallback , onFailCallback , params);
		});
	}
	//	2022-05-31 P20222164743 setCustInfo 관련 소스 수정 ================> END	
	
	
	// 2022-05-27 P20222164743 sso 로직 분해 ==============================> START
    /**
     * service call 방식을 이용한 sso 거래 
     * ssoCallObj = {
     * 		accessMediaDstic : 로그인매체구분(세션에서 내려주는 '로그인처리매체구분')
     * 		layerId          : 동의 약관을 표시할 layer영역의 ID 
     * 		bizName          : 생명보험 내부에서 페이지 이동을 위해 넘기는 param
     * 		groupCoCd        : 그룹회사코드(KB0: 금융그룹, KN0: KB생명보험, KS2: KB증권, ...)
     * 		svcDstic         : 이동 url을 조회해오기 위한 property 구분자 
     * 		callUrl          : 이동 url을 property 방식으로 조회하지 않을 경우, 세팅하는 url 값
     * 		isMinimum		 : 창간 최소화 가능여부(default: Y)
     * 		returnParam      : 이동 url을 직접 설정한 경우 이동할 페이지 및 param
     * }
     */
    function serviceCallSSO(ssoCallObj) {
        //debugger;
        expanObj.successCallback = ssoCallObj.successCallback;
        expanObj.accessMediaDstic = ssoCallObj.accessMediaDstic;
        expanObj.layerId = ssoCallObj.layerId;
        expanObj.bizName = ssoCallObj.bizName;
        expanObj.groupCocd = ssoCallObj.groupCoCd;
        expanObj.svcDstic = ssoCallObj.svcDstic;
        expanObj.callUrl = ssoCallObj.callUrl;
        expanObj.isMinimum = ssoCallObj.isMinimum;
        expanObj.returnParam = ssoCallObj.returnParam;
        expanObj.userAgent = window.COMMON.getUserAgent();
        expanObj.callingKnd = 'S';	
        expanObj.ssoStage = '1';    //'1' - SSO 동의여부체크 / '2' - SSO 약관동의 및 정보 저장 / '3' - SSO 로그인 및 Saml 키발급 
        
        if(ssoCallObj.returnParam != undefined) {
        	expanObj.closeAction = ssoCallObj.returnParam.action;	// 콜백함수 구분        	
        } else {
        	alert("필수값 누락 returnParam");
        	return;
        }
        
		// 1. 로그인 여부 확인
	    if(loginCheck()) {
	        // 1-1. 모바일 기기 정보 가져오기 
	        getMobileDeviceInfo();
	    }
    }

    // 로그인 여부 확인
    function loginCheck() {
        //debugger;
        // 현재 브릿지 페이지 ID
        var currPagepId = window.SPA.getCurrentPageId();    
        // 현재 브릿지 페이지 param
        var sParam = 'bizName=' + expanObj.bizName + "&" + 'svcDstic=' + expanObj.svcDstic;
                            
        // 1.로그인 여부 체크 - 로그인안되어있을때
        /* if(expanObj.isLogin != 'Y' ) { 
            // 1-1. 로그인 진행 요청 
            if(confirm("로그인 후 거래 바랍니다.")) {
                // 1-1-1. 로그인 진행 후 sso 요청 페이지로 이동 ??? 어디로 갈지 요청 하자 
                window.configManager.requestCertLogin(currPagepId, sParam);
            } else {
                // 1-1-2. goBack 
                window.navi.goBack();
            }
        } else {  */ // 1.로그인 여부 체크 - 로그인되어있을때 
            // 1-2. 모바일 인증 여부 체크 - 모바일 인증서가 아닐때(K1: KB국민인증서-pin/ K2: KB국민인증서-패턴/ K3: KB국민인증서-생체/ K4: KB국민인증서-연동로그인/ K5: KB국민인증서-자동로그인)
            if(!(expanObj.accessMediaDstic.toLowerCase() == "k1" || expanObj.accessMediaDstic.toLowerCase() == "k2" 
                || expanObj.accessMediaDstic.toLowerCase() == "k3" || expanObj.accessMediaDstic.toLowerCase() == "k4")){ 
                // 1-2-1. 모바일 인증서 로그인 요청 
                if(confirm("KB국민인증서로 로그인 후 거래하시기 바랍니다.")){
                    // 1-2-1-1. 국민인증서 로그인 진행 후, 현재 브릿지 페이지로 이동 
                    window.UserPreference.setValue(
                        function(){ 
                            window.configManager.requestCertLogin(currPagepId, sParam); 
                        },
                        function(){}, 
                        "LOGIN.NXT", 
                        "KS"
                    );
                } else {
                    // 1-2-1-2. goback
                    window.navi.goBack();
                }
            } else { // 1-2. 모바일 인증 여부 체크 - 모바일 인증서일때 
                return true;
            }
        /* } */
    }

    // 모바일 기기 정보 가져오기 
    function getMobileDeviceInfo() {
        //debugger;
        window.SystemInfoManager.getSystemInfoForUsim(getMobileDeviceInfoCallback);
    }

    // 기기 정보 저장 및 스뱅 로그인 실행 
    function getMobileDeviceInfoCallback(data) {
        //debugger;
        
        // 1. 앱키값(기기고유번호) 저장
        expanObj.hpKey = data.deviceUniqueId;
        
        // 2. 네이티브 인증 실행
        // - 성공시 CI 가져오기 
        // - 실패시 국민인증 실패시 재발급 실행  
        kbstar.exec(getCi, reqCertInfoFail, "KBSignManager", "requestCertInfo", {});        
    }

    // CI 정보 조회 
    function getCi(data) {
        //debugger;
        
        // 1. 국민인증 실패시 콜백 
        if(data == '') {
            reqCertInfoFail(data)
        }
        
        // 2. KB국민인증서일련번호 가져오기
        expanObj.kBCrtfiSerno = data.serialNumber;
        
        // 3. CI 정보를 가져오는 전문(KFK120B440) 호출 
        var params = {
            mode: "5",
            kBCrtfiSerno: expanObj.kBCrtfiSerno
        }
        
        kbstar.connect.request('/mquics?QAction=1058783', params, getCiResult, onFailCallback, true); 
    }

    // 국민인증 실패시 callback 
    function reqCertInfoFail(data) {
        //debugger;
        try{
            if(confirm("KB국민인증서 로그인이 필요한 서비스입니다. KB국민인증서를 발급하시겠습니까? ")){
                window.navi.navigate('/mquics?page=D000986',{},function(){});
            } else {
                window.navi.goBack();
            }
        }catch(e){
            alert("certFailCallBack: " + e);
        }
    }

    // CI 값 저장 및 jsonData 세팅 
    function getCiResult(data){
        //debugger;
        // 1.암호화된 CI, KB국민인증서일련번호 저장
        expanObj.ssoCiEnc = data.data.msg.servicedata.encCi;
        expanObj.kBCrtfiSernoEnc = data.data.msg.servicedata.encKbSerno;
        
        if(expanObj.callingKnd == 'S') {
            doServiceCallForSSOAgreChk();
        } else if(expanObj.callingKnd == 'A') {
            //getSsoApiKey()
        }
        
    }

    // 서비스콜에서 사용하는 파라미터 만들기
    function setServiceCallParam() {
        //debugger;
        // 1. 기기분류 설정
        expanObj.appKnd = ''
        if(expanObj.userAgent == 'android') {
            expanObj.appKnd = '1';
        } else if(expanObj.userAgent == 'ios') {
            expanObj.appKnd = '2';
        }
        
        // 2. 파라미터 세팅 
        var params = {
            API_groupCoCd       : "KB0",                    // 그룹코드
            API_appKnd          : expanObj.appKnd,          // 기기분류(1-android, 2-ios)
            API_appKey          : expanObj.hpKey,           // 앱키값(기기고유번호)
            API_crtfiKndDstcd   : "01",                     // 인증서종류 - KB국민인증서
            API_kBCrtfiSerno    : expanObj.kBCrtfiSerno,    // KB국민인증서일련번호(암호화 안된 값)
        }
        
        
        // 3. sso 단계에따라 api호출을 위한 url과 구분자 설정
        if(expanObj.ssoStage == '1') {
            expanObj.calledAction = '1006911';
            expanObj.urls = '/caq/kbsign/sso/check/ssoAgreeYNandRegister/ver1';
            params.API_lginHMS = currentTime();             // 현재시간
        } else if(expanObj.ssoStage == '2') {
            expanObj.calledAction = '1008297';
            expanObj.urls = '/caq/kbsign/sso/store/ssoLoginInfo/ver1';
            params.API_lginHMS = currentTime();             // 현재시간 
        } else if(expanObj.ssoStage == '3') {
            expanObj.calledAction = '1007997';
            expanObj.urls = '/caq/kbsign/sso/confirmAndPub/ssoLoginAndSsoKey/ver1';
            params.API_serNo = expanObj.ssoSerno;           // sso일련번호
        }
        
        params.calledAction = expanObj.calledAction;        // sso단계 구분값
        params.urls = expanObj.urls                         // sso 단계별 api호출을 위한 url 값
            
        return params;
    }   
    
    // SSO 1,2,3단계 successCallback
    function nextSuccessForSSO(data){
        //debugger;
        var serviceData;
        
        try{
            if(expanObj.callingKnd == 'S') {
                serviceData = data.data.msg.servicedata;
            } else if(expanObj.callingKnd == 'A') {
            }
            
            var successCode = serviceData.dataHeader.successCode;
            var resultMessage = serviceData.dataHeader.resultMessage;
            
            // 1-1. 정상처리인 경우
            if(successCode == '0') {
                if(expanObj.ssoStage == '1') {  // SSO 1단계 callback
                    nextSuccessForSSOAgreChk(serviceData);
                } else if(expanObj.ssoStage == '2') {   // SSO 2단계 callback
                    nextSuccessForSSOInfoSave(serviceData);
                } else if(expanObj.ssoStage == '3') {   // SSO 3단계 callback
                    nextSuccessForSSOKeyIssu(serviceData);
                }
            } else { // 1-2. 정상처리 실패인 경우 - goBack 
                alert("거래 처리중 오류가 발생하였습니다.["+successCode+"]["+resultMessage+"]");
                window.navi.goBack();
            }
        } catch(e) {
            alert(e)
        } 
    }

    // failCallback - getCi, SSO 1/2/3단계 
    function onFailCallback(data) {
        //debugger;
		//console.log("onFailCallback");
        caq.error.caq_printError(data);
    }
        
    // SSO 1단계 - 서비스콜 방식의 SSO 동의여부체크
    function doServiceCallForSSOAgreChk(){
        //debugger;
        try {
            var params = setServiceCallParam();
            kbstar.connect.request('/mquics?QAction=1052086', params , nextSuccessForSSO, onFailCallback, true);
        } catch(e) {
            alert("doServiceCallForSSOAgreChk: " + e);
        }
    }

    // SSO 1단계 callback - 서비스콜 방식의 SSO 동의여부체크 callback
    function nextSuccessForSSOAgreChk(serviceData){
        //debugger;
        // SSO 동의 여부
        var ssoCnsntYn = serviceData.dataBody.sSOCnsntYn;
        
        if(ssoCnsntYn == '1') { // 1-1-1. 동의한 경우 
            expanObj.ssoSerno = serviceData.dataBody.sSOSerno;
            
            // 1-1-1-1. sso 3단계(SSO 로그인 및 Saml 키발급) 실행
            expanObj.ssoStage = '3';
            if(expanObj.callingKnd == 'S') {
                doServiceCallForSSOKeyIssu();
            } else if(expanObj.callingKnd == 'A') {
            }
        } else { //1-1-2. 동의하지 않은 경우 - 약관 팝업 호출 
            $.ohyLayer({
                closeUse    : false,
                title       : '계열사 간 SSO 개인정보 동의서', 
                content     : '#'+expanObj.layerId,
                type        : 'confirm',
            });
        }
    }

    // 동의 확인 버튼 클릭시 
    function clickSSOAgre() {
        expanObj.ssoStage = '2';
        if(expanObj.callingKnd == 'S') {
            doServiceCallForSSOInfoSave(); 
        } else if(expanObj.callingKnd == 'A') {
        }
    }

    
    // SSO 2단계 - 서비스콜 방식의 SSO 약관동의 및 정보 저장
    function doServiceCallForSSOInfoSave(){
        //debugger;
        try {
            var params = setServiceCallParam();
            kbstar.connect.request('/mquics?QAction=1052086', params , nextSuccessForSSO, onFailCallback, true);
        } catch(e) {
            alert("doServiceCallForSSOInfoSave: " + e);
        }
    }

    // SSO 2단계 callback - 서비스콜 방식의 SSO 약관동의 및 정보 저장 callback 
    function nextSuccessForSSOInfoSave(serviceData){
        //debugger;
        // SSO 동의 여부
        var ssoCnsntYn = serviceData.dataBody.sSOCnsntYn;
        
        if(ssoCnsntYn == '1') { // 1-1-1. 동의한 경우 
            expanObj.ssoSerno = serviceData.dataBody.sSOSerno;
            
            // 1-1-1-1. sso 3단계(SSO 로그인 및 Saml 키발급) 실행
            expanObj.ssoStage = '3';
            if(expanObj.callingKnd == 'S') {
                doServiceCallForSSOKeyIssu();
            } else if(expanObj.callingKnd == 'A') {
            }
        } 
    }

    // SSO 3단계 - 서비스콜 방식의 SSO 로그인 및 Saml 키발급  
    function doServiceCallForSSOKeyIssu(){
        //debugger;
        try {
            var params = setServiceCallParam();
            kbstar.connect.request('/mquics?QAction=1052086', params , nextSuccessForSSO, onFailCallback, true);
        } catch(e) {
            alert("doServiceCallForSSOKeyIssu: " + e);
        }
    }

    // SSO 3단계 callback - 서비스콜 방식의 SSO 로그인 및 Saml 키발급 callback
    function nextSuccessForSSOKeyIssu(serviceData){
        //debugger;
        // SSO saml키 저장
        expanObj.samlAssertion = serviceData.dataBody.samlAssertion;
        
        var sParam = {
            "samlAssertion" : expanObj.samlAssertion,   // saml키
            "ssoSerno"      : expanObj.ssoSerno,        // sso일련번호
            "encCI"         : expanObj.ssoCiEnc,        // ci값
            "appKnd"        : expanObj.appKnd,          // 기기분류(1-android, 2-ios)
            "kBCrtfiSerno"  : expanObj.kBCrtfiSernoEnc, // KB국민인증서일련번호(암호화된)
            "bodyAppKey"    : expanObj.hpKey,           // 앱키값(기기고유번호)
            "bizName"       : expanObj.bizName,         // 생명보험을 페이지이동 구분자값     
        }
        
        //kbstar.connect.request('/mquics?QAction=1079619', sParam , function(data) {
        	//console.log("data check succeed");
        	//console.log(sParam);
	        
        	//window.ExtendPlatformManager.setExtendData(ssoCompleteSuccessCallback2 , ssoCompleteFailCallback2, sParam);
        	
        	// 기존에 set되어있던 내용꺼내기 
    		window.ExtendPlatformManager.getExtendData(function(sData) {
    			// 기존에 setting되어있는 데이터가 있는 경우 
    			var params = Object.assign({}, sData, sParam);
    			window.ExtendPlatformManager.setExtendData(ssoCompleteSuccessCallback2, ssoCompleteFailCallback2, params);
    		}, function(fData) {
    			var params = sParam;
    			window.ExtendPlatformManager.setExtendData(ssoCompleteSuccessCallback2, ssoCompleteFailCallback2, params);
    		});
	        
        //}, function(data) {
            //console.log("data check failed");
            //console.log(data);
        //}, true);
        
    }

    // SSO 로그인 완료된 경우, 인앱브라우저 호출 
    function ssoCompleteSuccessCallback2(data) {
        //debugger;
        if(expanObj.callUrl != undefined && expanObj.callUrl != '') {    // url 호출 방식
        	
        	// 창간이동 bit 가 off이고 callback이 있을 경우 as-is
			// 그 외의 경우 to-be
			 if(expanObj.isMinimum != undefined && expanObj.isMinimum == 'N' && expanObj.closeAction != undefined && expanObj.closeAction == 'callback') {
	        	// callback 적용 이전
	        	window.ExtendPlatformManager.openExtendWebView(expanObj.callUrl , expanObj.groupCocd, ''
	                    , expanObj.returnParam, expanWebCloseCallback, expanObj.isMinimum);
			 } else {
				// callback 적용 후 
        		window.cmnExpanPlfm.openExtendWebView(expanObj.callUrl , expanObj.groupCocd, '', expanObj.returnParam, expanObj.isMinimum);
			 }
        	// callback 적용 이전
			/* window.ExtendPlatformManager.openExtendWebView(expanObj.callUrl , expanObj.groupCocd, ''
			                    , expanObj.returnParam, expanWebCloseCallback);
			*/        	
        } else { // property 호출방식 
        	if(expanObj.isMinimum != undefined && expanObj.isMinimum == 'N' && expanObj.closeAction != undefined && expanObj.closeAction == 'callback') {
        		// callback 이 있는 경우 
                window.expanPlfm.callWebBrowse(expanObj.successCallback, expanObj.groupCocd, expanObj.svcDstic, expanObj.returnParam, '', expanObj.isMinimum);
        	} else {
        		// callback 이 없는 경우 
        		window.expanPlfm.callWebBrowse("", expanObj.groupCocd, expanObj.svcDstic, expanObj.returnParam, '', expanObj.isMinimum);        		
        	}
        }
    }

    // SSO 로그인 실패한 경우, goback
    function ssoCompleteFailCallback2(data) {
        //debugger;
        window.SPA_COMMON.callbackWithSPA(function() {
            //console.log("ssoCompleteFailCallback");
        }, data);
    }
    
    // 웹 닫기시 callback
    function expanWebCloseCallback(returnData) {
    	//debugger;
    	// 창간이동 불가능할때, callback을 지정한 경우
    	//alert("expanWebCloseCallback : " + JSON.stringify(returnData) );
        if(expanObj.isMinimum != undefined && expanObj.isMinimum == 'N' && expanObj.closeAction != undefined && expanObj.closeAction == "callback" ) {
        	window.SPA_COMMON.callbackWithSPA(expanObj.successCallback, returnData);
        } else {
        	// 창간이동 불가능할때, callback을 지정하지 않은 경우
        	if (returnData != undefined) {
				if (returnData.action != undefined && (returnData.action == "move_to" || returnData.action == "MOVEPAY" )) {
					let url = '/mquics?page='+returnData.page;
					let params = returnData.params || {};
					
					if( returnData.page == "home" || returnData.page == "D001374" ){
						window.configManager.moveToBankHome();
					} else if( $.trim( returnData.page ).length > 0 ) {
						window.navi.navigateWithCurrPageHistoryRemove(url, params, function(){});
					}
				} else if( returnData.action != "stay" ) {
					window.navi.goBack();
				}
			} else {
				window.navi.goBack();
			}

        	// as-is callback function
        	/*if (returnData != undefined) {
	            if (returnData.action != undefined && returnData.action == "move_to") {
	                if (returnData.navigateFlag != undefined) {
	                    
	                    
	                     * navigateFlag
	                     - navigate
	                     - navigateWithInit
	                     - navigateWithCurrPageHistoryRemove
	                     - navigateWithClose
	                     - navigateWithAllClose
	                     - openWebViewWithPopup
	                     
	                    
	                    if (returnData.page == "home") {
	                        window.configManager.moveToBankHome();
	                    }
	                    else {
	                        let url = '/mquics?page='+returnData.page;
	                        let params = returnData.params || {};
	        
	                        if (returnData.navigateFlag == "navigate") {
	                            window.navi.navigate(url, params, function(){});
	                        } else if (returnData.navigateFlag == "navigateWithInit") {
	                            window.navi.navigateWithInit(url, params, function(){});
	                        } else if (returnData.navigateFlag == "navigateWithCurrPageHistoryRemove") {
	                            window.navi.navigateWithCurrPageHistoryRemove(url, params, function(){});
	                        } else if (returnData.navigateFlag == "navigateWithClose") {
	                            window.navi.navigateWithClose(url, params, function(){});
	                        } else if (returnData.navigateFlag == "navigateWithAllClose") {
	                            window.navi.navigateWithAllClose(url, params, function(){});
	                        } else if (returnData.navigateFlag == "openWebViewWithPopup") {
	                            window.appManager.openWebViewWithPopup(url, param, function(){});
	                        }
	                    }
	                } else {
	                	window.SPA_COMMON.callbackWithSPA(expanObj.successCallback, returnData);
	                }
	            } else {
	            	window.SPA_COMMON.callbackWithSPA(expanObj.successCallback, returnData);
	            }
	        } else {                    
	            window.SPA_COMMON.callbackWithSPA(expanObj.successCallback, returnData);
	        }*/
	    }
    }
	// 2022-05-27 P20222164743 sso 로직 분해 ==============================> END
    
    /*window.onClose = function(returnData) {
		if(returnData.isConfirm == "Y"){
			var confirmMsg = "진행 중인 거래를 종료하시겠습니까?";
			if(returnData.confirmMsg != null && returnData.confirmMsg != undefined && returnData.confirmMsg.trim().length > 0){
				confirmMsg = returnData.confirmMsg;
			}
			
			if(confirm(confirmMsg)){
				window.ExtendPlatformManager.closeExtendWebView(returnData);
			}else{
				return;
			}
		}else{
			window.ExtendPlatformManager.closeExtendWebView(returnData);
		}
	}*/
    
    return {
    	afltsso,
    	chanelsso,
    	callWebBrowse,
    	callWebBrowseSetTitle,
    	ssoCompleteSuccessCallback,
    	ssoCompleteFailCallback,
    	innerSSO,
    	setUrlQueryString,
    	getUrlQueryString,
    	setCustInfo,
    	serviceCallSSO,
    	clickSSOAgre,
    }
};

window.expanPlfm = new expanPlfm();
