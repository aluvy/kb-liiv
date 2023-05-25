var sseModule = function() {

	function constructor() {
		return sseModule();
	}

	//2021.12.08 추가된 설정값
	//앱에서 전달해주는 로그인 세션키. 로그인동안 유지되도록
	var loginSessionKey = "";

	var tarFlbCnt = 0; //타겟 횟수
	var flbCnt = 0; //실시간 횟수
	var dmpCnt = 0; //dmp횟수

	var eData = "";

	//sse에서 사용되는 변수 선언
	var sseEventSource = null;
	var sseConnected = false;
//	var maxRetryCnt = 5;   //sse 방식에서 사용되는 변수
//	var curRetryCnt = 1;   //sse 방식에서 사용되는 변수
	var bannerSseUrl = "/conn/banner/subscribe/";
	var bannerSseCloseUrl = "/conn/banner/close/";

	var hostUrl = "conn.kbstar.com";

	//websocket에서 사용되는 변수 선언
	var websocket = null;
	var bannerWebSocketUrl = "/conn/websocket/banner/subscribe/";

	var sseMode = "W";	//S:SSE, W:Websocket
	var sseKbPin = null;  //App에서 전달 받는 kbpin를 담는 변수
	var sseCusName = "";  //로그인된 고객명
	var changeName = "$고객명$";  //고객명 변환 키값
	var ohyLayer;	//팝업 레이어 api
	var popupCheck = "0"; //타겟플로팅배너 뜨게 되면 1로 변경

	var checkViewCnt = "0";	 //타켓 플로팅배너 피로도 체크시 사용되는 변수 0이 아닌 값을 때, 피로도 조건 체크되서 skip됨.

	//event listener에서 받은 플로팅 배너 데이터를 담는 json 객체
	var dataJson = {
		members: {}
	};

	var floatingData = ""; //플로팅 배너 데이터를 json변환전 담는 객체

	//방문식별자 추가로 수정
	var sseVstId   = null;	//App에서 전달 받는 방문식별자를 담는 변수 2022.07.11
	var sseConType = null; //소켓연결 방식을 담는 변수 2022.07.11
	var vistIdnfrCnt = 0; //비로그인 방문 식별자 cnt

	// 플로팅 배너 관련 타입이나 행동에 따른 구분값을 포함한 로그 데이터 전송
	// dmp배너 추가되어 전역변수로 변경
	// 2022.09.28 박응석
	////////////////////////
	var QLFUtil = {
		sendLog : function(data){
			if(!data){
				return false;
			}
			
			data.lgTmClnt = this.timeStamp();
			data._LOG_TYPE = data.lgType;
			data.timZone = (- new Date().getTimezoneOffset()/60);

			if(data.lgType == "AB"){
				var request = "";
				if(typeof(data) == "string"){
					request = data;
				}else if(typeof(data) == "object"){
					var list = [];
					for(var key in data){
						var val = data[key];
						val = (val != undefined && typeof(val) == "string" ? val.replace(/([\^\|\\])/g,"\$1" ) : "");
						list.push( key + "|" + val );
					}
					request = list.join("^");

					var _params={hb : request}

					if (window.COMMON.getUserAgent() == "ios") {
						_params={hb:encodeURIComponent(request)}
					}

					if (typeof(kbstar) != "undefined") {
						kbstar.exec(null, null, "TrackerManager", "sendBehaviorLog", _params);
					}
				}else{
					return false;
				}
			}

			return true;
		},
		timeStamp : function(){
			var lp = function(s,l){
				s = (s||'').split("").reverse();
				l -= s.length;
				for(var i = 0; i < l ; i++){
					s.push("0");
				}
				return s.reverse().join("");
			}

			var db = new Date();

			var Y = db.getFullYear().toString();
			var M = (db.getMonth()+1).toString();
			var D = db.getDate().toString();
			var h = db.getHours().toString();
			var m = db.getMinutes().toString();
			var s = db.getSeconds().toString();
			var ms = db.getMilliseconds().toString();

			return Y + "-" + lp(M,2,0)+"-"+lp(D,2,0)
				+"T"+lp(h,2,0)+":"+lp(m,2,0)+":"+lp(s,2,0)+"."+lp(ms,3,0)+"Z";
		}
	};

	/**
	 * sse로 서버에 연결하기 위한 method
	 * @param {kbPinNo}	 고객 KBPin번호
	 **/
	function conn(custData) {

		///////////////////////////////////////
		// 외부에서 dmp배너 호출
		// 2022.08.10 박응석
		///////////////////////////////////////
		window.sse.flbn_dmpBannerCall = function(){

		//printAppend("getCurrentPageId : " + window.moaAdsLoader.checkPageId(window.SPA.getCurrentPageId()));
		//printAppend("floatbannerLayer start\n[tarFlbCnt:"+tarFlbCnt+"]\n[flbCnt:"+flbCnt+"]\n[dmpCnt:"+dmpCnt+"]\n[eData:"+eData+"]\n"+window.SPA.getCurrentPageId());
		///////////////////////////////////////
		// KB DMP banner
		// 2022.08.25 정원제
			//if(window.SPA.getCurrentPageId() == "D001374"){
			if(typeof window.moaAdsLoader!= 'undefined' && window.moaAdsLoader.checkPageId(window.SPA.getCurrentPageId())){
		///////////////////////////////////////
				//배너 중복체크 호출시간때문에
				setTimeout(function() {

					//printAppend("eData : "+eData);
					// eData = "DATA" 인경우는 imdg에 DATA가 있는 경우
					// eData = "" 인경우는 로그인 후 처음 호출된 경우
					// 2022.12.15 정원제 start ///////////////////////////
					if(console){console.log("flbn_dmpBannerCall :: eData["+eData+"]");}
					// 2022.12.15 정원제 end ///////////////////////////
					if(eData != "DATA" && eData != ""){
						window.UserPreference.getValue(function(data) {
							loginSessionKey = data;

							// 현재접속 세션에 배너노출 횟수가져오기
							// //////////////////////////////////////
							window.UserPreference.getValue(function(val) {
								var lData;
								if(!$.isEmptyObject(val)){
									try{
										lData = val ? JSON.parse(val) : {};
									}catch(err){
										lData = val;
									}
								}

								if(!$.isEmptyObject(lData)){
									tarFlbCnt = typeof(lData.tarFlbCnt) != 'undefined' ? Number(lData.tarFlbCnt) : 0; // 타겟
									flbCnt = typeof(lData.flbCnt) != 'undefined' ? Number(lData.flbCnt) : 0; // 실시간
									dmpCnt = typeof(lData.dmpCnt) != 'undefined' ? Number(lData.dmpCnt) : 0; // dmp
								}else{
									tarFlbCnt = 0; // 타겟
									flbCnt = 0; // 실시간
									dmpCnt = 0; // dmp
								}
								//printAppend("floatbannerLayer Session value \n[tarFlbCnt:"+tarFlbCnt+"]\n[flbCnt:"+flbCnt+"]\n[dmpCnt:"+dmpCnt+"]");

								// 로그수집기에 로그남기기위해 셋팅함
								// 2022.09.28 박응석
								////////////////////////
								var data = {};

								//공통 필수
								data.lgType = "AB";				//로그종류 (WB : WEB배너 , AB : APP배너)
								data.bnnrType = "D";			//배너종류 (B:일반배너,C:타겟 플로팅배너,E:개인화배너,F:실시간 플로팅배너,P:POSITIVE배너,D:dmp배너)
								data.bnnrCkEpDstic = "1"; //배너 노출/클릭여부 ( : 노출 , : 클릭 )

								data.pageID = window.SPA.getCurrentPageId(); //현재 페이지 정보
								// eData = "" 인경우는 로그인 후 처음 호출된 경우
								// 2022.12.15 정원제 start ///////////////////////////
								if(console){console.log("flbn_dmpBannerCall :: call floatbannerLayer");}
								// 2022.12.15 정원제 end ///////////////////////////

								// dmp배너 호출
								floatbannerLayer("dmp","", data);

							}, function() {}, data+"_banner");
							// //////////////////////////////////////
						}, function() {}, "sseId");
					}
				}, 100);
			}
		}
	  ///////////////////////////////////////

		var connectionUrl = "";
		try{
			var conUrl = hostUrl;
			var serverModeData = window.device.servermode; //App에 저장되어 있는 서버모드 구분값

			//conn서버별 연결 도메인
			if(serverModeData == 'test'){
				conUrl = 'zconn.kbstar.com';
			}else if(serverModeData == 'stg'){
				conUrl = 'yconn.kbstar.com';
			}else if(serverModeData == 'real'){
				conUrl = 'conn.kbstar.com';
			}

			//navigator.device = window.device = this.config.deviceInfo;
			//kbstarCommon._DOMAIN = window.device.starbank_domain;
			if("W" == sseMode){
				//connectionUrl = "wss://" + conUrl.substring(8);
				connectionUrl = "wss://" + conUrl;
			}else{
				connectionUrl = conUrl;
			}
		}catch(e){
			if("W" == sseMode){
				connectionUrl = "wss://" + hostUrl;
			}else{
				connectionUrl = "https://" + hostUrl;
			}
		}

		//param data 확인.
		if (typeof custData == "undefiend" || custData == null || custData == "") {
			return;
		}else{
			//비로그인(방문식별자) 또는 로그인(KBPin)별 사용데이터 세팅
			if(custData.length <= 15 ){
				//custData = custData.substring(0,10);
				sseKbPin = custData;
				sseVstId = null;
			}else if(custData.length == 22 ){
				sseKbPin = null;
				sseVstId = custData;
			}else{
				return;
			}
		}

		//재연결 cnt 변수 초기화. sse 방식에서 사용되는 변수
		//curRetryCnt = 1;

		if("W" == sseMode){
			try{

				//App에서 페이지이동시에 WebView새로 생성 없이 spa init() 호출하면서 LocalStorage를 지울경우(ex.window.navi.navigateWithInit)
				//conn이 연결되어 있더라도 다시 연결되는 경우가 있어
				//직접적으로 연결 확인 후에 다시 LocalStorage에 연결 확인 셋팅하도록 수정
				if (typeof websocket != "undefined" && websocket != null && websocket != "" && typeof websocket == "object") {
					try{
						///////////////////////////////////////////////////////////////////////////
						// 로그인 / 비로그인 재접속시 처리  동일한 연결방식일 경우 Ping 다른 연결 방식일 경우 웹소켓 연결종료 후 접속
						if(websocket.url.indexOf(custData) < 0){

							//현재 웹소켓 접속 주소가 접속하려는 kbPin또는 방문식별자랑 다른 경우에는 다시 접속을 시도한다.
							websocket.close();
							websocket = null;
							websocket = new WebSocket(connectionUrl + bannerWebSocketUrl + custData);

							//배너 변수 초기화
							tarFlbCnt = 0;
							flbCnt = 0;
							dmpCnt = 0;
							eData = "";
							vistIdnfrCnt = 0;
							//printAppend('[floating_banner][conn]: 접속상태가 이전과 다름 신규 접속 : ' +fnGetConnType() + ' custData ' + custData );

						}else{
							websocket.send("ping");
						}
						//printAppend("websocket ping call");
					}catch(err){
						//websocket 연결은 되어 있지만, 연결이 정상이 아닌 경우 다시 연결.
						websocket = new WebSocket(connectionUrl + bannerWebSocketUrl + custData);
						//printAppend("websocket error new");
					}
				}else{
					//websocket이 연결이 아에 안되어 있을때 연결
					websocket = new WebSocket(connectionUrl + bannerWebSocketUrl + custData);
					//printAppend("websocket first new");
				}

				//websocket = new WebSocket(connectionUrl + bannerWebSocketUrl + custData);

				websocket.onopen = function(e) {
				}

				//websocket 연결 후 conn 서버에서 imdg의 데이터가 셋팅되어 imdg listener가 실행되었을 때 호출되는 메서드
				//conn 상태에 따라 다른 데이터 message를 보내줌.
				//일반적인 json 데이터를 제외한 특정 문구가 오는 경우 각각 구분해서 처리하도록되어 있음.
				websocket.onmessage = function(e) {
					//conn 끊겼거나 에러가 났을 경우 disconnect
					if(e.data == 'close' || e.data == 'error' ||e.data == 'error_imdg'){
						disconnect();
					}else{

						//conn 연결시 오는 상태값
						if(e.data == 'registred' || e.data == 'registered'){
							//printAppend('registred message skip');
							//연결 확인되면 LocalStorage에 연결확인 저장
							if(window.LocalStorage != "undefind" && window.LocalStorage != null){
								sseConType = fnGetConnType();
								window.LocalStorage.setItem('SSEStatus', 'connect', null);
								window.LocalStorage.setItem('SSEConnType', sseConType, null);
							}
						//conn 연결 확인시 오는 상태값
						}else if(e.data == 'connected'){
							//connectin 확인용
							//연결 확인 후 checkPin 에서 다시 체크 되도록 LocalStorage에 연결확인 저장
							sseConType = fnGetConnType();
							if(window.LocalStorage != "undefind" && window.LocalStorage != null){
								window.LocalStorage.setItem('SSEStatus', 'connect', null);
								window.LocalStorage.setItem('SSEConnType', sseConType, null);
							}
						//imdg 데이터가 없거나, 삭제 호출했을 떄 오는 상태값
						}else if(e.data == 'NO_DATA' || e.data == 'removed' || e.data == 'cremoved'){
							// 데이터가 없는 경우, imdg 데이터 삭제 응답
							// 그냥 skip
							var userAgent = window.COMMON.getUserAgent();

							// android인 경우는 페이지가 바뀔때마다 호출된다.
							if(userAgent == 'android'){
								eData='none';
								window.sse.flbn_dmpBannerCall();

							// ios인 경우는 (eData == '')처음 로그인 할때만 호출한다.
							}else if(userAgent == 'ios' && eData == ''){
								eData='none';
								window.sse.flbn_dmpBannerCall();
							}
						}else if ( e.data == 'fremoved') {
							// 그냥 skip
							;
						}else{

							//printAppend(e.data); 
							// imdg에 DATA가 있다는걸 표시한다.
							eData='DATA';
							//실제 데이터인 경우
							//json parse를 통해 json 형태의 데이터가 아니면 진행되지 않고 try catch를 통한 skip이 됨.
							try{
								floatingData = e.data;	//json string 변수
								dataJson.members = JSON.parse(e.data);	//json 객체 처리

								try {
									if ( feedback_popup.is_feedback_msg(dataJson.members) ) {
										feedback_popup.show(dataJson.members);	
										return;
									}
								} catch (err) {
									printAppend("onmessage :: error :: " + err);
								}

								//피로도 체크 확인 타켓 플로팅 배너만 확인
								checkPlay(dataJson);

								//고객정보 가져오기
								//고객정보 체크 후 고객명 치환
								var dynamicText = "";
								try{
									dynamicText = dataJson.members.가변항목내용; //관리자 페이지에서 등록된 가변항목내용 보통 $고객명$ 으로 고정되어 있음.
								}catch(e){
									dynamicText = "";
								}
								//2021.12.08 앱에서 저장하는 로그인 세션키 정보 가져오기 sseId
								window.UserPreference.getValue(function(data) {
									//printAppend("cookie check ["+document.cookie+"]");
									//서버 was에서 session에 고객명 가져오기 후 콜백함수를 통한 고객명 치환 후
									//배너 관련 함수 호출하도록 되어 있음.(flbn_successCallback)
									loginSessionKey = data;

									// 2022.07.12 박응석
									// 현재접속 세션에 배너노출 횟수가져오기
									////////////////////////////////////////
									window.UserPreference.getValue(function(val) {
										var lData;
										if(!$.isEmptyObject(val)){
											try{
												lData = val ? JSON.parse(val) : {};
											}catch(err){
												lData = val;
											}
										}

										if(!$.isEmptyObject(lData)){
											tarFlbCnt = typeof(lData.tarFlbCnt) != 'undefined' ? Number(lData.tarFlbCnt) : 0; //타겟
											flbCnt = typeof(lData.flbCnt) != 'undefined' ? Number(lData.flbCnt) : 0; //실시간
											dmpCnt = typeof(lData.dmpCnt) != 'undefined' ? Number(lData.dmpCnt) : 0; //dmp
										}else{
											tarFlbCnt = 0; //타겟
											flbCnt = 0; //실시간
											dmpCnt = 0; //dmp
										}

									}, function() {}, data+"_banner");

									//////////////////////////////////////////
									//방문식별자 배너노출 회수 가져오기
									////////////////////////////////////////
									if ( fnGetConnType() == 'V' ) {
										window.UserPreference.getValue(function(val) {
											var lData;
											if(!$.isEmptyObject(val)){
												try{
													lData = val ? JSON.parse(val) : {};
												}catch(err){
													lData = val;
												}
											}

											if(!$.isEmptyObject(lData)){
												vistIdnfrCnt = typeof(lData.vistIdnfrCnt) != 'undefined' ? Number(lData.vistIdnfrCnt) : 0; //방문식별자배너
											}else{
												vistIdnfrCnt = 0; //방문식별자배너
											}

										}, function() {}, "vistIdnfr_banner");
									}
									////////////////////////////////////////

									if(dynamicText == changeName && e.data.indexOf(changeName) > -1){
										var _params = {
											url : "/mquics?QAction=1052516",
											method : "POST",
											params : "",
											division : "division",
											bShowProgressFlag : "true"
										};
										kbstar.exec(successCustName, failCustName, "HTTP", "sendRequestTo", _params);

									}else{
										//중복체크 checkPlay 호출시간때문에
										setTimeout(function() {
											flbn_successCallback(dataJson);
										}, 100);
									}
								},
								function() {
									// 실패 콜백
								}, "sseId");
							}catch(e) {
								printAppend("onmessage :: error :: " + e);
							}
						}
					}
				}

				//websocket 에러시 호출되는 메서드
				websocket.onerror = function(e) {
					disconnect();
				}

				//websocket close시 호출되는 메서드
				websocket.onclose = function(e) {
					//종료되면 다시 맺어야 하므로 null처리해줌
					websocket = null;
				}
			}catch (ex){
				disconnect();
			}

		}else{
			//see 서버 연결 관련 로직들 (일단 주석처리..)
			/*
			try{
				if (typeof sseEventSource != "undefined" && sseEventSource != null && sseEventSource != "" && typeof sseEventSource == "object") {
					disconnect();
				}

				sseEventSource = new EventSource(connectionUrl + bannerSseUrl + custData);

				//서버와 SSE 연결이 되면 호출되는 method
				sseEventSource.addEventListener('open', function(e) {
					sseConnected = true;
					// Connection was opened.
				}, false);

				//서버로부터 데이터 수신시 호출되는 method
				sseEventSource.addEventListener('message', function(e) {

					//업무 script 호출 구현 필요....
					switch(e.data) {
						case 'ping' : ping(); break;
						case 'close':
						case 'error_imdg':
						case 'error': disconnect();break;
					}

				}, false);

				//sseKbPin 해당 값이 셋팅되었을때, 플로팅배너값 가져와 html 셋팅..
				sseEventSource.addEventListener(sseKbPin, function(e) {
					//if(sseKbPin == '1234567891'){
						var dataJson = {
							members: {}
						};
						try{
							dataJson.members = JSON.parse(e.data);
							flbn_successCallback(dataJson);
						}catch(e) {
						}
					//}
				}, false);

				//서버와 SSE 연결 오류시 호출되는 method
				sseEventSource.addEventListener('error', function(e) {
					if (e.type == "error") {
						// Connection was closed.
						curRetryCnt ++;
						if(curRetryCnt >= maxRetryCnt){
							//disconnect();
						}
					}else{
						//disconnect();
					}
					disconnect();
				}, false);
			}catch (ex){
				disconnect();
			}
			*/
		}
	}

	/**
	 * 페이지를 벋어날때 호출되는 method
	 * SSE 연결을 종료한다.
	 **/
	window.onbeforeunload = function() {
		disconnect();
	}

	//고객명 치환을 위한 콜백함수
	successCustName = function(data) {
		try{
			sseCusName = data.data.msg.servicedata.custName;

			var floatVar = window.MN_BANK.fnReplaceAll(floatingData, changeName, sseCusName);
			dataJson.members = JSON.parse(floatVar);

			flbn_successCallback(dataJson);
		} catch(e){}
	}

	/**
	 * 로그인	실패 처리
	 * @param data 로그인 실패 결과
	 */
	failCustName = function(data) {
	}

	/**
	 * App이 onResume시 SPA에서 호출되는 onResume method
	 * SSE 연결상태를 체크.
	 **/
	function onResume() {
		//안드로이드는 안죽음
		//아이폰일경우 확인
	}

	/**
	 * SSE 연결을 종료하는 method
	 **/
	function disconnect() {
		if("W" == sseMode){
			try{
				if (typeof websocket != "undefined" && websocket != null && websocket != "" && typeof websocket == "object") {
					///////////////////////////////////////
					// ios 에서 로그아웃후 로그인한경우 변수값이 초기화 안되어 추가함
					// 2022.08.23 박응석
					///////////////////////////////////////
					tarFlbCnt = 0; flbCnt = 0; dmpCnt = 0; eData = "";
					vistIdnfrCnt = 0;
					websocket.close();
				}
			}catch (e) {
			}finally{
				websocket = null;
				sseConnected = false;
				sseKbPin = null;
				window.LocalStorage.setItem('SSEStatus', 'disconnect', null);
			}
		}else{
			//sse 방식의 처리 프로세스는 일단 주석처리.
			/*
			try{
				if (typeof sseEventSource != "undefined" && sseEventSource != null && sseEventSource != "" && typeof sseEventSource == "object") {
					sseEventSource.close();
					$.ajax({
						type: "get", // method
						url: bannerSseCloseUrl+sseKbPin, //url
						contentType: 'text/plain',
						timeout: 180000,
						success: function(data) {
						},
						error: function(jqXHR, textStatus, errorThrown) {
						}
					});
				}
			}catch (e) {
			}finally{
				sseEventSource = null;
				sseConnected = false;
				sseKbPin = null;
				if(window.LocalStorage != "undefind" && window.LocalStorage != null){
					window.LocalStorage.setItem('SSEStatus', 'disconnect', null);
				}
			}
			*/
		}
	}

	//spa init() 시 호출되는 함수
	//외부에서 젤 먼저 호출되는 함수.
	function checkPin() {
		//로컬스토리지에 connect된 정보를 등록함
		//connect된 정보가 없으면 연결 요청.
		//또한 앱이 로그인 상태이후에 호출될수 있도록 되어 있으며, kbPinNo 값이 있는 경우에 conn(data) 호출
		window.LocalStorage.getItem('SSEStatus', (value)=>{
			if( value != 'connect') {
				// 웹소켓 미연결 상태인 경우
				window.AppInfoManager.requestLoginStatus(function(status) {
					if (status && status  != '00') {
						///////////////////////////////////////////////////////
						//로그인 상태 --> KbPin으로  웹소켓이 연결 되거나 유지
						if ( sseKbPin == null || sseKbPin == undefined || sseKbPin == '') {
							//로그인한 상태에서 최초로 kbPin방식으로 접속하는 경우, 방문식별자 배너 노출 관련 내용을 초기화 한다
							window.UserPreference.setValue(function() {}, function() {}, "vsitflbnSessKey" , "" );
							window.UserPreference.setValue(function() {}, function() {}, "vistIdnfr_banner", "" );
							vistIdnfrCnt = 0;
							connKbPin('웹소켓없음 KbPin으로접속'); //KB-Pin으로 conn 호출
						}else{
							//예외상황 : 로그인한 상태에서 윕소켓을 KbPin방식으로 연결할 경우
							connKbPin('예외상황-KbPin방식으로 재접속'); //KB-Pin으로 conn 호출
						}
					}else{
						///////////////////////////////////////////////////////
						//비로그인 상태 --> 방문식별자로  웹소켓이 연결 되거나 유지
						if ( sseVstId == null || sseVstId == undefined || sseVstId == '') {
							//최초 방문식별자로 연결될 경우 방문식별자 연결용 변수 초기화
							window.UserPreference.setValue(function() {}, function() {}, "vsitflbnSessKey" , "" );
							window.UserPreference.setValue(function() {}, function() {}, "vistIdnfr_banner", "" );
							vistIdnfrCnt = 0;

							connVsitIdnfr('웹소켓없음 방문식별자로접속'); //방문식별자로 conn 호출
						}else{
							//예외상황으로 재접속할 경우
							connVsitIdnfr('예외상황-방문식별자방식으로 재연결'); //방문식별자로 conn 호출
						}

					}// End if	로그인 상태
				});// End requestLoginStatus

			}else{
				///////////////////////////////////////////////////////
				// 웹소켓이 연결된 상태 처리
				window.AppInfoManager.requestLoginStatus(function(status) {
					if (status && status  != '00') {
						///////////////////////////////////////////////////////
						//로그인 상태 --> KbPin으로  웹소켓이 연결 되거나 유지
						if ( sseKbPin == null || sseKbPin == undefined || sseKbPin == '') {
							//이미 웹소켓이 연결된 상태에서 로그인을 되었으나 sseKbPin값에 kbPin이 없을 경우 --> 비로그인에서 로그인상태로 변하는 상태
							//방문식별자 관련 세션정보와 노출 정보를 초기화 한다.
							window.UserPreference.setValue(function() {}, function() {}, "vsitflbnSessKey" , "" );
							window.UserPreference.setValue(function() {}, function() {}, "vistIdnfr_banner", "" );
							vistIdnfrCnt = 0;
							connKbPin('웹소켓연결-KbPin접속');
						}else{
							//이미 웹소켓이 존재하고 이미 kbPin으로 웹소켓이 존재할 경우 --> Ping으로 연결 유지
							connKbPin('KbPin연결유지 ');
						}
					}else{
						///////////////////////////////////////////////////////
						//비로그인 상태 --> 방문식별자로  웹소켓이 연결 되거나 유지

						window.UserPreference.setValue(function() {}, function() {}, "vsitflbnSessKey" , "" );
						window.UserPreference.setValue(function() {}, function() {}, "vistIdnfr_banner", "" );
						vistIdnfrCnt = 0;

						if ( sseVstId == null || sseVstId == undefined || sseVstId == '') {
							connVsitIdnfr('웹소켓연결-방문식별자접속');
						}else{
							connVsitIdnfr('방문식별자 연결유지 ');
						}
					}
				}); // End requestLoginStatus
			}
		});
	}

	function connKbPin(msg){
		window.UserPreference.decValue(function(data) {
			// 성공 콜백
			if(data && data !='' && data.length <= 15) {
				conn(data);
			}else{
				disconnect();
			}
		},
		function() {
			// 실패 콜백
		}, "kbPinNo");
	}

	function connVsitIdnfr( msg ){

		var vNativename = "";

		// IOS 안드로이드별 방문식별자 조회 변수 설정
		if (window.COMMON.getUserAgent() == "android") {
			vNativename = "LOG_APP_VISITOR_ID_KEY";
		}else if (window.COMMON.getUserAgent() == "ios") {
			vNativename = "LOG_VISITOR_IDENTIFIER_KEY";
		} // End 방문식별자 조회변수 분기 종료

		// IOS 안드로이드 방문식별자 조회 후 웹소켓 접속 분기
		if ( window.COMMON.getUserAgent() == "android" || window.COMMON.getUserAgent() == "ios" ) {
			window.UserPreference.getValue(function(data) {
				if(data && data !='' && data.length == 22) {
					//방문식별자가 정상인 경우 연결
					conn(data);
				}else{
					//방문식별자가 비정상정인 경우 기존 연결이 있으면 연결 해제
					disconnect();
				}
			}, function() {}, vNativename );
		} // End if IOS 안드로이드 분기처리
	}

	// imdg 삭제는 sendMsg("remove") 호출
	// websocket에 직접 메서드 호출하는 메서드
	// 대응 메서드 구성 후 호출되도록 처리.
	function sendMsg(msg){
		if("W" == sseMode){
			try{
				if (typeof websocket != "undefined" && websocket != null && websocket != "" && typeof websocket == "object") {
					// 임시 
//					if ( sseKbPin == '134679605600000'	) {
						//alert("IMDG 삭제 안함");
//					}else{
						websocket.send(msg);
//					}
				}
			}catch (e) {
			}
		}
	}

	function printAppendConsole(txt) {
		// if ( window.SPA.getCurrentPageId() == "E009961" ||  window.SPA.getCurrentPageId() == "E010318" ) {
		  $("#tracePrint").append( txt	 );
		  $("#tracePrint").append('<br/>');
		  console.log( txt );
		// }
	}

	//laypopup 호출
	//플로팅배너 화면에서 layPopup 호출시 사용되는 api
	// 로그남기기위해 파라미터 추가 [data]
	// 2022.09.28 박응석
	////////////////////////
	function floatbannerLayer(kind, type, data){
		setTimeout(function() {
			var eventsrc = "";
			

			//printAppend("floatbannerLayer start\n[kind:"+kind+"]\n[type:"+type+"]\n[data:"+data+"]");
			//printAppend("loginSessionKey : "+loginSessionKey);
			//printAppend("floatbannerLayer start\n[tarFlbCnt:"+tarFlbCnt+"]\n[flbCnt:"+flbCnt+"]\n[dmpCnt:"+dmpCnt+"]");
			popupCheck = tarFlbCnt + flbCnt + dmpCnt;

			if (popupCheck <= 2){ // 전체 플배 호출 횟수 3번
				if(type=="B"){
					$.ohyLayer({//이미지형
						title:'<p class="noti">알림</p>',
						titleUse: false,
						content:'#flbn2',
						type:'bottom',
						confirmType : 'btm',
						//closeUse : false,
						closeUse : true
					});
					$('.layer_wrap.bottom .ly_in').addClass('tg_banner ver_img');//팝업로드후 클래스 추가 공통:tg_banner, 버전:ver_img

				}else if(type=="C"){
					$.ohyLayer({//이미지+텍스트 혼합형
						title:'<p class="noti">알림</p>',
						titleUse: false,
						content:'#flbn3',
						type:'bottom',
						confirmType : 'btm',
						//closeUse : false
						closeUse : true
					});
					$('.layer_wrap.bottom .ly_in').addClass('tg_banner ver_mix');//팝업로드후 클래스 추가 공통:tg_banner, 버전:ver_mix
					
				}else if(type=="A"){
					$.ohyLayer({//일반 텍스트형
						title:'<p class="noti">알림</p>',// 20211229 : h_ico클래스 삭제
						content:'#flbn1',
						type:'bottom',
						confirmType : 'btm',
						//closeUse : false// 20211229 : 닫기버튼 삭제 추가
						closeUse : true
					});
					$('.layer_wrap.bottom .ly_in').addClass('tg_banner ver_text');//팝업로드후 클래스 추가 공통:tg_banner, 버전:ver_text

				}else {

					if(kind ==="dmp"){
						// 2022.12.15 정원제 start ///////////////////////////
						if(console){console.log("floatbannerLayer :: dmpCnt["+dmpCnt+"]");}
						// 2022.12.15 정원제 end ///////////////////////////
						if(dmpCnt < 1){ //dmp배너 호출은 한번만.
							try {
								///////////////////////////////////////
								// KB DMP banner
								// 2022.08.25 정원제
								if(typeof window.moaAdsLoader!= 'undefined') {

									window.moaAdsLoader.loadMoaAds(function (result) {
										if(result===true){
											
											// 피로도맵 풋
											//putFtgXtntMap("fltbnnr_dmp"); 

											// 로그수집기 로그남기기
											// 2022.09.28 박응석
											////////////////////////
											QLFUtil.sendLog(data);

											dmpCnt++;
											var tmpObj = {"tarFlbCnt" : tarFlbCnt,"flbCnt" : flbCnt,"dmpCnt" : dmpCnt};
											var infoData = {};
											try{ infoData = !$.isEmptyObject(tmpObj) ? JSON.parse(tmpObj) : {}; }
											catch(err){ infoData = tmpObj; }
											var JData = JSON.stringify(infoData);
											window.UserPreference.setValue(function() {}, function() {}, loginSessionKey+"_banner", JData);
										}
									});
								}
							///////////////////////////////////////
							}catch(E) {
								//if(console)console.log(E);
							}
					}
					}else{
						$.ohyLayer({
							//title:'<p class="h_ico noti">알림</p>',
							title:'<p class="noti">알림</p>',
							content:'#flbn',
							type:'bottom',
							confirmType : 'btm',
						});
					}
				}

				if(kind ==="tarFlb"){
					tarFlbCnt++;
					eData = "none";
					
					// 피로도맵 풋
					//putFtgXtntMap("fltbnnr_trgt"); 
				}else if(kind ==="flb"){
					flbCnt++;
					eData = "none";
					
					// 피로도맵 풋
					//putFtgXtntMap("fltbnnr_cep"); 
				}

				// 실시간 타겟 로그수집기 로그남기기
				// 2022.09.28 박응석
				////////////////////////
				if( kind != "dmp" ){
					QLFUtil.sendLog(data);	//배너 정보 send
				}

				// 2022.07.12 박응석
				// 현재접속 세션에 배너노출 횟수셋팅하기
				////////////////////////////////////////
			}
			var tmpObj = {
				"tarFlbCnt" : tarFlbCnt,
				"flbCnt" : flbCnt,
				"dmpCnt" : dmpCnt
			};

			var infoData = {};
			try{
				infoData = !$.isEmptyObject(tmpObj) ? JSON.parse(tmpObj) : {};
			}catch(err){
				infoData = tmpObj;
			}
			var JData = JSON.stringify(infoData);

			// 배너 호출 카운터 저장
			window.UserPreference.setValue(function() {}, function() {}, loginSessionKey+"_banner", JData);
			////////////////////////////////////////
		}, 100);
	}

	function floatbannerLayerVisit(type, data){
		setTimeout(function() {
			var callYN = true; // 호출횟수 여부 확인
			if ( vistIdnfrCnt <= 2){  //1번만 노출 시킨다.
				if(type=="1" || type=="2"||type=="3"){	//				if(type=="1" || type=="2"||type=="3" ||type=="5"||type=="6"){
					$.ohyLayer({//이미지+텍스트 혼합형
						title:'<p class="h_ico noti">알림</p>',
						content:'#flbn',
						type:'bottom',
						confirmType : 'btm',
					});
					eData = "none";
					vistIdnfrCnt++;
				}
			}else{
				callYN = false; // 호출안함표시
			}

			// 실시간 타겟 로그수집기 로그남기기
			// 2022.09.28 박응석
			////////////////////////
			if(callYN === true && type != "dmp" ){
				QLFUtil.sendLog(data);	//배너 정보 send
			}

			var tmpObj = {
				"vistIdnfrCnt" : vistIdnfrCnt
			};

			var infoData = {};
			try{
				infoData = !$.isEmptyObject(tmpObj) ? JSON.parse(tmpObj) : {};
			}catch(err){
				infoData = tmpObj;
			}
			var JData = JSON.stringify(infoData);

			// 방문식별자 배너 호출 카운터 저장
			window.UserPreference.setValue(function() {}, function() {}, "vistIdnfr_banner", JData);
		}, 100);
	}

	//플로팅배너 로그 print용 sseKbPin
	//디버그용 메서드
	function printAppend(txt){
//		if ( sseKbPin == '134679605600000'	) {
//			alert(txt);
//		}
	}

  //상담 버튼 클릭시
	function flbn_goPage(pageId, cmpgnId, sevrMod) {
		var param= {};

		//전화상담 버튼 클릭시
		if(pageId == "D000855" ) {
			if(sevrMod == "D") {
				param.상담전화번호 = "0263092276,";
			} else if(sevrMod == "T") {
				param.상담전화번호 = "0263092277,";
			} else {
				param.상담전화번호 = "18336405,";
			}

			param.추가데이터1 = cmpgnId;
			param.SSO메세지채널구분 = "78"; // 스타뱅킹 & 뉴스타뱅킹

			//window.appManager.openWebViewWithClose("/mquics?page="+pageId, param, function(){});
			window.appManager.openWebViewWithPopup("/mquics?page="+pageId, param, function(){});
		//전화상담 예약 버튼 클릭시 (1:1 상담 전화 예약)
		} else if(pageId == "D011496") {
			param.캠페인ID = cmpgnId;

			//window.appManager.openWebViewWithClose("/mquics?page="+pageId, param, flbn_goPengangCnsel);
			window.appManager.openWebViewWithPopup("/mquics?page="+pageId, param, flbn_goPengangCnsel);
		} else {
			//페이지 이동시
			window.navi.navigate('/mquics?page='+pageId, {bannerEventId:cmpgnId}, function(){});
		}
	}

	function flbn_goPengangCnsel(data){
		if(data.goListyn == "Y"){
			window.navi.navigateWithInit('/mquics?page=D001399','', function(){});
		}
	}

	//기타버튼 클릭시 호출되는 메서드
	function flbn_etcGoPage(pageId, param) {
		window.navi.navigate('/mquics?page='+pageId, param, function(){});
	}

	//플로팅배너 업무관련 function ---------------start
	function flbn_successCallback(flbnDataObj) {
		try{
			if(typeof flbnDataObj != "undefined" != undefined && $.trim(flbnDataObj) != ""){

				/*****************************************
				** 실시간캠페인플로팅배너용
				*****************************************/
				//일반 플로팅배너 다시보지 않기 추가시
				//타켓 플로팅배너와 동일한 flbnDataObj.members.노출거부추가여부 값을 1로 내려주면 다시보지 않기 버튼 추가됨.
				var flbnApnd = function(htmlData, detailData){	//일반플로팅배너
					//실시간 배너는 로그인상태의 kbPin으로 조회되는 실시간 배너와 비로그인 방문식별자로 조회되는 실시간 배너가 있음
					//2개를 websocket 연결방식으로 세션 변수조회를 분기 시킨다.
					var vflbnsessionName = "flbnSessKey";
					var connType = fnGetConnType();
					if (connType !="P" ) {
						vflbnsessionName = "vsitflbnSessKey";
						loginSessionKey	 = "";	//방문식별자 방식

					}
					//conn 세션별 중복체크
					window.UserPreference.getValue(function(ret) {
						//conn 세션별로 한번만 호출되도록 세션키 체크
						//주의) 서버 세션이 아님. webview나 새로 생성되거나 conn이 끊겨서 다시 연결되면 세션키 변경됨.
						//세션키 셋팅을 App에서 받은 키값으로 변경 2021.12.08
						//if(ret != flbnDataObj.members.세션키) {
						if(loginSessionKey == "" || loginSessionKey != ret ) {
							$("body").prepend(htmlData);

							// 로그수집기에 로그남기기위해 셋팅함
							// 2022.09.28 박응석
							////////////////////////
							var data = {};

							//공통 필수
							data.lgType = "AB";				//로그종류 (WB : WEB배너 , AB : APP배너)
							data.bnnrType = "F";			//배너종류 (B:일반배너,C:타겟 플로팅배너,E:개인화배너,F:실시간 플로팅배너,P:POSITIVE배너,D:dmp배너)
							data.bnnrCkEpDstic = "1";		//배너 노출/클릭여부 ( : 노출 , : 클릭 )

							data.pageID = window.SPA.getCurrentPageId(); //현재 페이지 정보

							//일반 베너 필수
							data.bnnrID		=	"";		//배너 ID
							data.bnnrArID	= ""; //배너 AREA ID

							//플로팅베너 필수
							data.fltBnnrID	   = flbnDataObj.members.플로팅배너ID;  //플로팅 배너 ID
							data.fltBnnrElmtID = ''; //플로팅 구성요소 ID
							data.fltBnnrPtrn1  = flbnDataObj.members.플로팅배너유형대분류ID; //플로팅 배너 유형1
							data.fltBnnrPtrn2  = flbnDataObj.members.플로팅배너유형중분류ID; //플로팅 배너 유형2
							data.fltBnnrPtrn3  = flbnDataObj.members.플로팅배너유형소분류ID; //플로팅 배너 유형3

							//옵션
							data.crmCmpgnID	  = flbnDataObj.members.캠페인ID; //CRM캠페인ID
							data.acaInfoID	  = flbnDataObj.members.수행캠페인활동식별자; //수행캠페인활동식별자
							data.bnnrAdtInfo  = ''; //배너 추가정보

							//추가 플로팅배너 템플릿 구분값 2021.10.29
							data.fltBnnrTmplt = flbnDataObj.members.플로팅배너유형구분;

							//행태감지 추가옵션 : abTest(ABtest)와 custGrpId(고객군)
							data.abTest	 = "A"; //배너 abTest(ABtest)
							data.custGrpId	= "TEST"; //배너 custGrpId(고객군)

							//유형구분에 따른 layout popup api call
							if (connType !="P" ) {
								floatbannerLayerVisit(flbnDataObj.members.플로팅배너유형구분, data)
							}else{
								if(flbnDataObj.members.플로팅배너유형구분 == "1"){
									floatbannerLayer("flb", "", data);
								}else {
									floatbannerLayer("flb", flbnDataObj.members.실시간플로팅배너유형구분, data);
								}
							}

							//바닥 데이터 삭제.
							setTimeout(function() {
								$("#flbn").remove();
							}, 100);

							//현재 세션키를 저장해서 같은 세션키인 경우 호출되지 않도록 함.
							//window.UserPreference.setValue(function() {}, function() {}, "flbnSessKey", flbnDataObj.members.세션키);
							//세션키 셋팅을 App에서 받은 키값으로 변경 2021.12.08
							window.UserPreference.setValue(function() {}, function() {}, vflbnsessionName, loginSessionKey);

							//kbstar.connect.request('/mquics?QAction=1008482',	 {}, function() {}, function() {}, true);

							//Floating Banner IMDG 삭제
							sendMsg("remove");

							//full version 플로팅배너 일 때 1step, 2step으로 나눠져 있음.
							//1step에서 배너 클릭시 1step 배너 닫고, 2step(상세) 배너 호출되도록 되어 있음.
							window.sse.flbn_layer_one = function(_this){
								//$('#layer_one').remove();
								//$('#layer_two').show();
								$(_this).parent().parent().parent().find('.btn.close').trigger("click");

								data.bnnrCkEpDstic = "2";
								QLFUtil.sendLog(data);

								$("body").prepend(detailData);
								//유형구분에 따른 layout popup api call
								floatbannerLayer("flb", "", data);

								//바닥 데이터 삭제.
								setTimeout(function() {
									$("#flbn").remove();
								}, 100);
							}

							//플로팅 배너에서 바로 가기 버튼 클릭시 호출되는 메서드
							window.sse.flbn_sendGo = function(){
								if(flbnDataObj.members.플로팅배너유형구분 == "3") { //화면연계(템플릿 설정)
									var etcURL1 = flbnDataObj.members.기타버튼URL1;
									// 2022.07.18 박응석
									// D로시작 7자리 페이지코드만 대응하던 소스에서 파라미터 값 셋팅하는걸로 변경
									// 예) D005144&screenNo=b030190
									////////////////////////////////////////
									if(etcURL1.substring(0,1) == "D") {
										if(etcURL1.length == 7){
											flbn_etcGoPage(etcURL1, '');
										}else {
											var paramArr = etcURL1.split("&");
											var param = {};
											var pKey = "";
											var pVal = "";

											for(var i=1; i < paramArr.length; i++){
												pKey = paramArr[i].split('=')[0];
												pVal = paramArr[i].split('=')[1];
												param[pKey] = pVal;
											}

											flbn_etcGoPage(paramArr[0], param);
										}
									} else {
										window.appManager.openURL(etcURL1);
									}
									/////////////////////////////////////
									data.bnnrCkEpDstic = "2";
									QLFUtil.sendLog(data);
								}
							}

							//다시보지 않기 버튼
							//메서드는 구현은 해놨지만, 일반 플로팅배너에서는 아직 관리페이지에서 등록되지 않고 있음
							window.sse.flbn_reviewTiYn = function(_this){
								window.UserPreference.getValue(function(data) {
									var infoData = {
										viewFlag: ""
									};
									infoData.viewFlag = "Y";

									var JData = JSON.stringify(infoData);

									//버튼 닫기 click event
									$(_this).parents('.layer_wrap').find('.btn.close').trigger("click"); // 체크박스 선택시 팝업닫기 기능 추가
									data.bnnrCkEpDstic = "2";
									QLFUtil.sendLog(data);

									// 쿠키값을 설정한다.
									window.UserPreference.setValue(function(){}, function() {}, flbnDataObj.members.플로팅배너ID, JData);
								}, function() {},flbnDataObj.members.플로팅배너ID);
							}

							//전화상담버튼
							window.sse.flbn_flbnTelCnsel = function(){
								data.bnnrCkEpDstic = "3";
								data.fltBnnrElmtID = "flbnTelCnsel";
								QLFUtil.sendLog(data);

								flbn_goPage('D000855', flbnDataObj.members.캠페인ID, flbnDataObj.members.서버환경);
							}
							//채팅상담버튼(1:1 상담 바로연결)
							window.sse.flbn_flbnChtt = function(){
								data.bnnrCkEpDstic = "3";
								data.fltBnnrElmtID = "flbnChtt";
								QLFUtil.sendLog(data);

								flbn_goPage('D000860',flbnDataObj.members.캠페인ID, '');
							}
							//전화상담 예약 (1:1 상담 전화 예약)
							window.sse.flbn_flbnTelPengag = function(){
								data.bnnrCkEpDstic = "3";
								data.fltBnnrElmtID = "flbnTelPengag";
								QLFUtil.sendLog(data);

								flbn_goPage('D011496', flbnDataObj.members.캠페인ID, '');
							}
							//영업점 방문 예약
							window.sse.flbn_flbnBbrnPengag = function(){
								data.bnnrCkEpDstic = "3";
								data.fltBnnrElmtID = "flbnBbrnPengag";
								QLFUtil.sendLog(data);

								flbn_etcGoPage('D000918', '');
							}

							//기타버튼1
							window.sse.flbn_flbnEtc1 = function(url){
								data.bnnrCkEpDstic = "3";
								data.fltBnnrElmtID = "flbnEtc1";
								QLFUtil.sendLog(data);

								// 2023.04.26 박응석
								// D로시작 7자리 페이지코드만 대응하던 소스에서 파라미터 값 셋팅하는걸로 변경
								// 예) D005144&screenNo=b030190
								////////////////////////////////////////
								if(url.substring(0,1) == "D") {
									if(url.length == 7){
										flbn_etcGoPage(url,'');
									}else {
										var paramArr = url.split("&");
										var param = {};
										var pKey = "";
										var pVal = "";

										for(var i=1; i < paramArr.length; i++){
											pKey = paramArr[i].split('=')[0];
											pVal = paramArr[i].split('=')[1];
											param[pKey] = pVal;
										}

										flbn_etcGoPage(paramArr[0], param);
									}
								} else {
									window.appManager.openURL(url);
								}
								/////////////////////////////////////
							}

							//기타버튼1~5
							window.sse.flbn_flbnEtc = function(url, id){
								data.bnnrCkEpDstic = "3";
								data.fltBnnrElmtID = id;
								QLFUtil.sendLog(data);
								
								// 2023.04.26 박응석
								// D로시작 7자리 페이지코드만 대응하던 소스에서 파라미터 값 셋팅하는걸로 변경
								// 예) D005144&screenNo=b030190
								////////////////////////////////////////
								if(url.substring(0,1) == "D") {
									if(url.length == 7){
										flbn_etcGoPage(url,'');
									}else {
										var paramArr = url.split("&");
										var param = {};
										var pKey = "";
										var pVal = "";

										for(var i=1; i < paramArr.length; i++){
											pKey = paramArr[i].split('=')[0];
											pVal = paramArr[i].split('=')[1];
											param[pKey] = pVal;
										}

										flbn_etcGoPage(paramArr[0], param);
									}
								} else {
									window.appManager.openURL(url);
								}
								/////////////////////////////////////
							}
						}else{
							//printAppend('session dual!');
							sendMsg("remove");
						}
					}, function() {
					}, vflbnsessionName);
				};

				/*****************************************
				** 타겟캠페인플로팅배너용
				*****************************************/
				var cmpgnApnd = function(htmlData){
					//피로도 체크 0 이 아닌 값은 경우 피로드 체크에서 체크된 값임.
					if(checkViewCnt == "0"){
						window.UserPreference.getValue(function(ret) {

							//conn서버 세션값으로 세션키 체크를 해서 같은 세션에서는 플로팅배너 중복적으로 호출되지 않도록 처리
							//세션키 셋팅을 App에서 받은 키값으로 변경 2021.12.08
							if(loginSessionKey == "" || loginSessionKey != ret) {
								$("body").prepend(htmlData);

								// 로그수집기에 로그남기기위해 셋팅함
								// 2022.09.28 박응석
								////////////////////////
								var data = {};

								//공통 필수
								data.lgType = "AB";				//로그종류 (WB : WEB배너 , AB : APP배너)
								data.bnnrType = "C";			//배너종류 (B:일반배너,C:타겟 플로팅배너,E:개인화배너,F:실시간 플로팅배너,P:POSITIVE배너,D:dmp배너)

								//타켓 플로팅배너 템플릿 유형 추가로 인한 추가적인 Param값 설정. 2021.11.29
								var templeteGubun = "A";
								try{
									templeteGubun = flbnDataObj.members.타겟플로팅배너유형구분;  //해당 값 설정이 되지 않으면, 1로 셋팅되도록
								}catch(e){
									templeteGubun = "A";
								}

								data.fltBnnrTmplt = templeteGubun;

								data.bnnrCkEpDstic = "1";	//배너 노출/클릭여부 ( : 노출 , : 클릭 )

								data.pageID = window.SPA.getCurrentPageId();  //현재 페이지ID

								//일반 베너 필수
								data.bnnrID		=	"";		//배너 ID
								data.bnnrArID	= ""; //배너 AREA ID

								//플로팅베너 필수
								data.fltBnnrID	   = flbnDataObj.members.플로팅배너ID;  //플로팅 배너 ID
								data.fltBnnrElmtID = ''; //플로팅 구성요소 ID
								data.fltBnnrPtrn1  = flbnDataObj.members.플로팅배너유형대분류ID; //플로팅 배너 유형1
								data.fltBnnrPtrn2  = flbnDataObj.members.플로팅배너유형중분류ID; //플로팅 배너 유형2
								data.fltBnnrPtrn3  = flbnDataObj.members.플로팅배너유형소분류ID; //플로팅 배너 유형3

								//옵션
								data.crmCmpgnID	  = flbnDataObj.members.캠페인식별자; //CRM캠페인ID
								data.acaInfoID	  = flbnDataObj.members.수행활동식별자; //수행캠페인활동식별자
								data.bnnrAdtInfo  = ''; //배너 추가정보

								//행태감지 추가옵션 : abTest(ABtest)와 custGrpId(고객군)
								data.abTest	 = "A"; //배너 abTest(ABtest)
								data.custGrpId	= "TEST"; //배너 custGrpId(고객군)

								//유형구분에 따른 layout popup api call
								floatbannerLayer("tarFlb", flbnDataObj.members.타겟플로팅배너유형구분, data);
								//바닥 데이터 삭제.
								setTimeout(function() {
									$("#flbn").remove();
								}, 100);

								//window.UserPreference.setValue(function() {}, function() {}, "cmpgnSessKey", flbnDataObj.members.세션키);
								//세션키 셋팅을 App에서 받은 키값으로 변경 2021.12.08
								window.UserPreference.setValue(function() {}, function() {}, "cmpgnSessKey", loginSessionKey); //각각 타켓 플로팅 배너, 실시간 플로팅 배너 띄우기.
								//2021.12.09 타켓 플로팅배너, 실시간 플로팅배너 한번만 띄우도록 같은 UserPreference key 값 셋팅하도록 수정
								//타켓 플로팅 배너 한번, 실시간 플로팅 배너 한번 띄우도록 수정하려면 바로 위의 소스로 키 값을 cmpgnSessKey 로 수정하면 됨.
								//window.UserPreference.setValue(function() {}, function() {}, "flbnSessKey", loginSessionKey);

								sendMsg("cremove"); //타켓 플로팅 배너 imdg 데이터 삭제. cremove는 "C"+kbpin 값의 imdg 삭제, remove는 kbpin 값의 imdg 삭제

								//kbstar.connect.request('/mquics?QAction=1014565',	 {}, function() {}, function() {}, true);


								//바로가기 버튼
								//페이지 이동시 데이터값 체크 후 페이지 이동 또는 openUrl로 호출할 지 체크.
								window.sse.flbn_sendGoTarget = function() {
									var urlVal = flbnDataObj.members.이벤트상세경로명;

									// 2022.07.18 박응석
									// D로시작 7자리 페이지코드만 대응하던 소스에서 파라미터 값 셋팅하는걸로 변경
									// 예) D005144&screenNo=b030190
									////////////////////////////////////////
									if(urlVal.substring(0,1) == "D") {
										if( urlVal.length == 7 ){
											flbn_etcGoPage(urlVal, '');
										}else {
											var paramArr = urlVal.split("&");
											var param = {};
											var pKey = "";
											var pVal = "";

											for(var i=1; i < paramArr.length; i++){
												pKey = paramArr[i].split('=')[0];
												pVal = paramArr[i].split('=')[1];
												param[pKey] = pVal;
											}

											flbn_etcGoPage(paramArr[0], param);
										}
									} else {
										window.appManager.openURL(urlVal);
									}
									/////////////////////////////////////

									//$('#flbn').remove();
									data.bnnrCkEpDstic = "2";
									QLFUtil.sendLog(data);
								}

								//다시보지 않기 버튼
								window.sse.flbn_reviewYN = function(_this) {
									// 쿠키값을 가져온다.
									// 플로팅배너ID를 앱에 저장하여, 해당 플로팅배너ID가 있으면, 다시 호출되지 않도록 셋팅.
									window.UserPreference.getValue(function(data) {
										var infoData = {
											viewFlag: ""
										};
										infoData.viewFlag = flbnDataObj.members.노출종료년월일;
										var JData = JSON.stringify(infoData);

										//버튼 닫기 click event
										$(_this).parent().parent().parent().parent().parent().find('.btn.close').trigger("click");

										// 쿠키값을 설정한다.
										//window.UserPreference.setValue(function(){}, function() {}, flbnDataObj.members.플로팅배너ID, JData);

										// 2022.02.18 박응석
										// 쿠키값설정부분을 서버원장(노출거부여부) 체크로 변경함
										var param = {};
										param["플로팅배너ID"] = flbnDataObj.members.플로팅배너ID;
										param["고객정보번호"] = sseKbPin;
										kbstar.connect.request('/mquics?QAction=1070864', param, null, null, true);

									}, function() {},flbnDataObj.members.플로팅배너ID);
								}
							}
						}, function() {
							//2021.12.09 타켓 플로팅배너, 실시간 플로팅배너 한번만 띄우도록 같은 UserPreference key 값 셋팅하도록 수정
							//타켓 플로팅 배너 한번, 실시간 플로팅 배너 한번 띄우도록 수정하려면 키 값을 cmpgnSessKey 로 수정하면 됨.
						}, "cmpgnSessKey"); //각각 타켓 플로팅 배너, 실시간 플로팅 배너 띄우기.
						//}, "flbnSessKey");
					}
				};

				//캠페인플로팅배너 view
				//기존 타켓 플로팅 배너에만 있는 다시보지 않기 기능을 위한 쿠키값 확인 처리
				window.UserPreference.getValue(function(data){
					var infoData;
					try{
						infoData = data ? JSON.parse(data) : {};
					}catch(err){
						infoData = data;
					}

					var flbnHtml = "";   //플로팅배너 html 함수

//================================================================					
//					flbnDataObj.members.상담버튼구분1 = "01";					
					
					//일반 플로팅배너 simple version
					if(flbnDataObj.members.플로팅배너유형구분 == "1") {
						if(viewLiveCheckFunction(flbnDataObj,infoData)){
							flbnHtml += '<div id="flbn" class="layerHTML">								';
							flbnHtml += '	<div id="flbnNavAside" class="ly_cnt">						';
							flbnHtml += '		<div class="section ly_ban_wrap">						';
							flbnHtml += '			<p class="p fc_gray2">'+flbnDataObj.members.플로팅배너텍스트명+'</p>				';
							// 상담버튼
							flbnHtml += '			<ul class="ly_ban_advice tg_banner ver_link">';
							if(flbnDataObj.members.상담버튼구분1 == "01") {
								if(flbnDataObj.members.플로팅배너채널구분 == "10") { // 뉴스타뱅킹(mnbank)
									flbnHtml += '		 <li class="li1"><a href="#none" id="flbnTelCnsel" onclick="window.sse.flbn_flbnTelCnsel()">상담원 즉시연결</a></li>					  ';
								}
							}
							if(flbnDataObj.members.상담버튼구분2 == "02") {
								if(flbnDataObj.members.플로팅배너채널구분 == "10") {	// 뉴스타뱅킹(mnbank)
									flbnHtml += '		 <li class="li2"><a href="#none" id="flbnChtt" onclick="window.sse.flbn_flbnChtt()">채팅상담</a></li>					  ';
								}
							}
							if(flbnDataObj.members.상담버튼구분3 == "03") {
								flbnHtml += '		 <li class="li3"><a href="#none" id="flbnTelPengag" onclick="window.sse.flbn_flbnTelPengag()">전화상담 예약</a></li>					   ';
							}
							if(flbnDataObj.members.상담버튼구분4 == "04") {
								flbnHtml += '		 <li class="li4"><a href="#none" id="flbnBbrnPengag" onclick="window.sse.flbn_flbnBbrnPengag()">영업점 방문예약 </a></li>					   ';
							}
							flbnHtml += '			</ul>';
							flbnHtml += '				</div>																	  ';

							//다시보지 않기 버튼 추가
							//관리자 페이지 정보에 따라 조건이 달라질수도 있음.. 나머지 부분은 구현되어 있음
							try{
								if(flbnDataObj.members.노출거부추가여부 == '1' ){
									flbnHtml += '<div class="ly_again_check">													';
									flbnHtml += '	<span class="selection">													';
									flbnHtml += '		<input type="checkbox" id="reviewTiYn" name="reviewTiYn" onclick="window.sse.flbn_reviewTiYn(this)">					';
									flbnHtml += '		<label for="reviewTiYN" class="label"><em>다시 보지않기</em></label>		';
									flbnHtml += '	</span>';
									flbnHtml += '</div>';
								}
							}catch(e){}

							flbnHtml += '			</div>																		';
							flbnHtml += '		</div>																		  ';

							flbnApnd(flbnHtml, "");	  //html 팝업 호출 및 log처리
						}
					} else if(flbnDataObj.members.플로팅배너유형구분 == "2") {
						//일반 플로팅배너 full version 2step으로 구성된 배너
						if(viewLiveCheckFunction(flbnDataObj,infoData)){
							var templeteGubun = "A";
							var templeteColor = "";
							try{
								templeteGubun = flbnDataObj.members.실시간플로팅배너유형구분;  //해당 값 설정이 되지 않으면, 1로 셋팅되도록
								templeteColor = flbnDataObj.members.배경색상내용;	 //해당 값 설정이 되지 않으면, 1로 셋팅되도록
							}catch(e){
								templeteGubun = "A";
							}

							if(templeteGubun == "B"){
								//첫 팝업 페이지. full version 팝업 첫 팝업
								flbnHtml += '<div id="flbn2" class="layerHTML">														';
								flbnHtml += '	<div id="flbnNavAside" class="ly_cnt">												';
								flbnHtml += '		<div id="layer_one" class="section ly_ban_wrap" onclick="window.sse.flbn_layer_one(this)" style="background-color:'+templeteColor+'">		';
								flbnHtml += '			<div class="img"><img src="'+flbnDataObj.members.이미지URL+'" alt="'+flbnDataObj.members.이미지대체내용+'"></div>	 ';
								flbnHtml += '		</div>																			';
								flbnHtml += '		<div class="btn_area">	 ';
								flbnHtml += '			<span><button type="button" class="btn sm" data-action="close">닫기</button></span>	';
								flbnHtml += '		</div>	 ';
								flbnHtml += '	</div>																			';
								flbnHtml += '</div>																			';

							}else if(templeteGubun == "C"){
								//첫 팝업 페이지. full version 팝업 첫 팝업
								flbnHtml += '<div id="flbn3" class="layerHTML">														';
								flbnHtml += '	<div id="flbnNavAside" class="ly_cnt">												';
								flbnHtml += '		<div id="layer_one" class="section ly_ban_wrap" onclick="window.sse.flbn_layer_one(this)" style="background-color:'+templeteColor+'">		';
								flbnHtml += '			<div class="img"><img src="'+flbnDataObj.members.이미지URL+'" alt="'+flbnDataObj.members.이미지대체내용+'"></div>	 ';
								flbnHtml += '			<p class="p fc_gray2"><span>'+flbnDataObj.members.플로팅배너텍스트명+'</span></p>							';
								flbnHtml += '		</div>																			';
								flbnHtml += '		<div class="btn_area">	 ';
								flbnHtml += '			<span><button type="button" class="btn sm" data-action="close">닫기</button></span>	';
								flbnHtml += '		</div>	 ';
								flbnHtml += '	</div>																			';
								flbnHtml += '</div>																			';

							}else{
								//첫 팝업 페이지. full version 팝업 첫 팝업
								flbnHtml += '<div id="flbn1" class="layerHTML">														';
								flbnHtml += '	<div id="flbnNavAside" class="ly_cnt">												';
								flbnHtml += '		<div id="layer_one" class="section ly_ban_wrap" onclick="window.sse.flbn_layer_one(this)" style="cursor: pointer;">		';
								flbnHtml += '			<p class="p fc_gray2"><span>'+flbnDataObj.members.플로팅배너텍스트명+'</span></p>  ';
								flbnHtml += '			<div class="btn_wrap btm">													';
								flbnHtml += '				<a href="#none" class="btn_txt ico_arr">바로가기</a>					';
								flbnHtml += '			</div>																		';
								flbnHtml += '		</div>																			';
								flbnHtml += '		<div class="btn_area">	 ';
								flbnHtml += '			<span><button type="button" class="btn sm" data-action="close">닫기</button></span>	';
								flbnHtml += '		</div>	 ';
								flbnHtml += '	</div>																			';
								flbnHtml += '</div>																			';

							}
							//full version 팝업 상세. 상담버튼 포함팝업
							var detailHtml = "";
							detailHtml += '<div id="flbn" class="layerHTML">														';
							detailHtml += '	<div id="flbnNavAside" class="ly_cnt">												';
							detailHtml += '		<div id="layer_two" class="section ly_ban_wrap" onclick="window.sse.flbn_layer_two()" >		';

							if(flbnDataObj.members.플로팅배너메시지명 != "" && flbnDataObj.members.플로팅배너메시지명 != null && flbnDataObj.members.플로팅배너메시지명 != 'null'	 ) {
								detailHtml += '			<p>'+flbnDataObj.members.플로팅배너메시지명+'<br/>';
							}
							detailHtml += '									';
							try{
								detailHtml += flbnDataObj.members.플로팅배너메시지내용;
							}catch(err){}

							detailHtml += '			</p>						';

							//상담버튼
							detailHtml += '			<ul class="ly_ban_advice tg_banner ver_link">';

							if(flbnDataObj.members.상담버튼구분1 == "01") {
							  if(flbnDataObj.members.플로팅배너채널구분 == "10") { // 뉴스타뱅킹(mnbank)
								  detailHtml += '		 <li class="li1"><a href="#none" id="flbnTelCnsel" onclick="window.sse.flbn_flbnTelCnsel()">상담원 즉시연결</a></li>					  ';
							  }
							}
							if(flbnDataObj.members.상담버튼구분2 == "02") {
							  if(flbnDataObj.members.플로팅배너채널구분 == "10") {	// 뉴스타뱅킹(mnbank)
								  detailHtml += '		 <li class="li2"><a href="#none" id="flbnChtt" onclick="window.sse.flbn_flbnChtt()">채팅상담</a></li>					  ';
							  }
							}
							if(flbnDataObj.members.상담버튼구분3 == "03") {
								detailHtml += '		   <li class="li3"><a href="#none" id="flbnTelPengag" onclick="window.sse.flbn_flbnTelPengag()">전화상담 예약</a></li>					 ';
							}
							if(flbnDataObj.members.상담버튼구분4 == "04") {
								detailHtml += '		   <li class="li4"><a href="#none" id="flbnBbrnPengag" onclick="window.sse.flbn_flbnBbrnPengag()">영업점 방문예약</a></li>					 ';
							}
							detailHtml += '			</ul>';

							// 기타버튼
                            if(flbnDataObj.members.기타버튼명1 != "" && flbnDataObj.members.기타버튼명1 != null) {
								detailHtml += '			<ul class="list_link">';
							
								detailHtml += '		   <li><a href="#none" class="link" id="flbnEtc1" onclick="window.sse.flbn_flbnEtc(\''+flbnDataObj.members.기타버튼URL1+'\',\'flbnEtc1\') ">'+flbnDataObj.members.기타버튼명1+'</a></li>						';
							

								//기타버튼 1개만 구성하는 것으로 일단 정리. 나중에 추가되면 아래 소스 추가.
								/*
								if(flbnDataObj.members.기타버튼명2 != "" && flbnDataObj.members.기타버튼명2 != null) {
									detailHtml += '		   <li><a href="#none" class="link" id="flbnEtc2" onclick="window.sse.flbn_flbnEtc(\''+flbnDataObj.members.기타버튼URL2+'\',\'flbnEtc2\') ">'+flbnDataObj.members.기타버튼명2+'</a></li>						';
								}
								if(flbnDataObj.members.기타버튼명3 != "" && flbnDataObj.members.기타버튼명3 != null) {
									detailHtml += '		   <li><a href="#none" class="link" id="flbnEtc3" onclick="window.sse.flbn_flbnEtc(\''+flbnDataObj.members.기타버튼URL3+'\',\'flbnEtc3\') ">'+flbnDataObj.members.기타버튼명3+'</a></li>						';
								}
								if(flbnDataObj.members.기타버튼명4 != "" && flbnDataObj.members.기타버튼명4 != null) {
									detailHtml += '		   <li><a href="#none" class="link" id="flbnEtc4" onclick="window.sse.flbn_flbnEtc(\''+flbnDataObj.members.기타버튼URL4+'\',\'flbnEtc4\') ">'+flbnDataObj.members.기타버튼명4+'</a></li>						';
								}
								if(flbnDataObj.members.기타버튼명5 != "" && flbnDataObj.members.기타버튼명5 != null) {
									detailHtml += '		   <li><a href="#none" class="link" id="flbnEtc5" onclick="window.sse.flbn_flbnEtc(\''+flbnDataObj.members.기타버튼URL5+'\',\'flbnEtc5\') ">'+flbnDataObj.members.기타버튼명5+'</a></li>						';
								}
								*/
                              detailHtml += '					</ul>																	';
                            }
							detailHtml += '			</div>																					 ';

							//다시보지 않기 버튼 추가
							try{
								if(flbnDataObj.members.노출거부추가여부 == '1' ){
									detailHtml += '<div class="ly_again_check" >													';
									detailHtml += '	<span class="selection">													';
									detailHtml += '		<input type="checkbox" id="reviewTiYn" name="reviewTiYn" onclick="window.sse.flbn_reviewTiYn(this)">		';
									detailHtml += '		<label for="reviewTiYN" class="label"><em>다시 보지않기</em></label>		';
									detailHtml += '	</span>';
									detailHtml += '</div>';
								}
							}catch(e){}

							detailHtml += '	</div>																					   ';
							detailHtml += '</div>																					  ';

							flbnApnd(flbnHtml, detailHtml);
						}
					} else if(flbnDataObj.members.플로팅배너유형구분 == "3") {
						//일반 플로팅 배너 바로이동 플로팅배너 바로 가기 눌렀을 때 등록된 페이지 즉시 이동.
						if(viewLiveCheckFunction(flbnDataObj,infoData)){
							var templeteGubun = "A";
							var templeteColor = "";
							try{
								templeteGubun = flbnDataObj.members.실시간플로팅배너유형구분;  //해당 값 설정이 되지 않으면, 1로 셋팅되도록
								templeteColor = flbnDataObj.members.배경색상내용;	 //해당 값 설정이 되지 않으면, 1로 셋팅되도록
							}catch(e){
								templeteGubun = "A";
							}

							if(templeteGubun == "B"){

								flbnHtml += '<div id="flbn2" class="layerHTML">															';
								flbnHtml += '	<div id="flbnNavAside" class="ly_cnt">													';
								flbnHtml += '		<div class="section ly_ban_wrap" name="sendGo" id="sendGo" onclick="window.sse.flbn_sendGo()"  style="background-color:'+templeteColor+'">			 ';
								flbnHtml += '			<div class="img"><img src="'+flbnDataObj.members.이미지URL+'" alt="'+flbnDataObj.members.이미지대체내용+'"></div>	 ';
								flbnHtml += '		</div>																		';
								flbnHtml += '		<div class="btn_area">	 ';
								flbnHtml += '			<span><button type="button" class="btn sm" data-action="close">닫기</button></span>	';
								flbnHtml += '		</div>	 ';
							}else if(templeteGubun == "C"){

								flbnHtml += '<div id="flbn3" class="layerHTML">															';
								flbnHtml += '	<div id="flbnNavAside" class="ly_cnt">													';
								flbnHtml += '		<div class="section ly_ban_wrap" name="sendGo" id="sendGo" onclick="window.sse.flbn_sendGo()"  style="background-color:'+templeteColor+'">			 ';
								flbnHtml += '			<div class="img"><img src="'+flbnDataObj.members.이미지URL+'" alt="'+flbnDataObj.members.이미지대체내용+'"></div>	 ';
								flbnHtml += '			<p class="p fc_gray2"><span>'+flbnDataObj.members.플로팅배너텍스트명+'</span></p>							';
								flbnHtml += '		</div>																		';
								flbnHtml += '		<div class="btn_area">	 ';
								flbnHtml += '			<span><button type="button" class="btn sm" data-action="close">닫기</button></span>	';
								flbnHtml += '		</div>	 ';
							}else{

								flbnHtml += '<div id="flbn1" class="layerHTML">															';
								flbnHtml += '	<div id="flbnNavAside" class="ly_cnt">													';
								flbnHtml += '		<div class="section ly_ban_wrap" name="sendGo" id="sendGo" onclick="window.sse.flbn_sendGo()" style="cursor: pointer;">			  ';
								flbnHtml += '			<p class="p fc_gray2">'+flbnDataObj.members.플로팅배너텍스트명+'</p>				';
								flbnHtml += '			<div class="btn_wrap btm">												';
								flbnHtml += '				<a href="#none" class="btn_txt ico_arr">바로가기</a>  ';
								flbnHtml += '			</div>																	';
								flbnHtml += '		</div>																		';
								flbnHtml += '		<div class="btn_area">	 ';
								flbnHtml += '			<span><button type="button" class="btn sm" data-action="close">닫기</button></span>	';
								flbnHtml += '		</div>	 ';
							}

							flbnHtml += '  </div>																					';
							flbnHtml += '</div> ';

							flbnApnd(flbnHtml, "");
						}
					} else if(flbnDataObj.members.플로팅배너유형구분 == "4") {		//캠페인플로팅배너(타켓 플로팅배너)
						if(viewCheckFunction(flbnDataObj,infoData)){
							//타켓 플로팅배너 템플릿 설정 추가에 따른 배너 디자인 구분 2021.11.29 플로팅배너 디자인 개선관련
							var templeteGubun = "A";
							var templeteColor = "";
							try{
								templeteGubun = flbnDataObj.members.타겟플로팅배너유형구분;  //해당 값 설정이 되지 않으면, 1로 셋팅되도록
								templeteColor = flbnDataObj.members.배경색상내용;	 //해당 값 설정이 되지 않으면, 1로 셋팅되도록
							}catch(e){
								templeteGubun = "A";
							}

							if(templeteGubun == "B"){
								// B유형 : 이미지형 : 이미지첨부, 이미지 대체텍스트, 연계링크
								flbnHtml += '<div id="flbn2" class="layerHTML">	  ';
								flbnHtml += '	 <div id="flbnNavAside" class="ly_cnt">	  ';
								flbnHtml += '		<div class="section ly_ban_wrap" name="sendGo" id="sendGo" onclick="window.sse.flbn_sendGoTarget()" style="background-color:'+templeteColor+'">	  ';
								flbnHtml += '			<div class="img"><img src="'+flbnDataObj.members.이미지URL+'" alt="'+flbnDataObj.members.이미지대체내용+'"></div>	  ';
								flbnHtml += '		 </div>	  ';

								if(flbnDataObj.members.노출거부추가여부 == '1' ){
									flbnHtml += '		 <div class="ly_again_check">	';
									flbnHtml += '			 <span class="selection">	';
									flbnHtml += '				 <input type="checkbox" id="reviewYN" name="reviewYN" onclick="window.sse.flbn_reviewYN(this)">	  ';
									flbnHtml += '				 <label for="reviewYN" class="label"><em>다시 보지않기</em></label>	';
									flbnHtml += '			 </span>   ';
									flbnHtml += '		 </div>	  ';
								}

								flbnHtml += '		<div class="btn_area">	 ';
								flbnHtml += '			<span><button type="button" class="btn sm" data-action="close">닫기</button></span>	';
								flbnHtml += '		</div>	 ';
								flbnHtml += '	 </div>	  ';
								flbnHtml += '</div>	  ';

							}else if(templeteGubun == "C"){
								// C유형 : 이미지+텍스트형 : 한줄 메시지, 가변항목, 이미지 첨부, 이미지 대체텍스트, 연계링크
								flbnHtml += '<div id="flbn3" class="layerHTML">	  ';
								flbnHtml += '	 <div id="flbnNavAside" class="ly_cnt">	 ';
								flbnHtml += '		 <div class="section ly_ban_wrap" name="sendGo" id="sendGo" onclick="window.sse.flbn_sendGoTarget()" style="background-color:'+templeteColor+'">   ';
								flbnHtml += '			<div class="img"><img src="'+flbnDataObj.members.이미지URL+'" alt="'+flbnDataObj.members.이미지대체내용+'"></div>	 ';
								flbnHtml += '			 <p class="p fc_gray2"><span>'+flbnDataObj.members.메시지내용+'</span></p>  ';
								flbnHtml += '		 </div>	  ';

								if(flbnDataObj.members.노출거부추가여부 == '1' ){
									flbnHtml += '		 <div class="ly_again_check">  ';
									flbnHtml += '			 <span class="selection">  ';
									flbnHtml += '				 <input type="checkbox" id="reviewYN" name="reviewYN" onclick="window.sse.flbn_reviewYN(this)">	 ';
									flbnHtml += '				 <label for="reviewYN" class="label"><em>다시 보지않기</em></label>  ';
									flbnHtml += '			 </span>  ';
									flbnHtml += '		 </div>	 ';
								}

								flbnHtml += '		<div class="btn_area">	';
								flbnHtml += '			<span><button type="button" class="btn sm" data-action="close">닫기</button></span>  ';
								flbnHtml += '		</div>	';
								flbnHtml += '	 </div>	 ';
								flbnHtml += '</div>	 ';

							}else{
								// A유형 : 기존	as-is 타켓플로팅 배너(한줄 메시지, 가변항목, 연계링크)
								flbnHtml += '<div id="flbn1" class="layerHTML">	 ';
								flbnHtml += '	 <div id="flbnNavAside" class="ly_cnt">	 ';
								flbnHtml += '		 <div class="section ly_ban_wrap" name="sendGo" id="sendGo" onclick="window.sse.flbn_sendGoTarget()">  ';
								flbnHtml += '			 <p class="p fc_gray2"><span>'+flbnDataObj.members.메시지내용+'</span></p>  ';
								flbnHtml += '			 <div class="btn_wrap btm">	 ';
								flbnHtml += '				 <a href="#none" class="btn_txt ico_arr">바로가기</a>  ';
								flbnHtml += '			 </div>	 ';
								flbnHtml += '		 </div>	 ';

								if(flbnDataObj.members.노출거부추가여부	== '1' ){
									flbnHtml += '		 <div class="ly_again_check">  ';
									flbnHtml += '			 <span class="selection">  ';
									flbnHtml += '				 <input type="checkbox" id="reviewYN" name="reviewYN" onclick="window.sse.flbn_reviewYN(this)">	 ';
									flbnHtml += '				 <label for="reviewYN" class="label"><em>다시 보지않기</em></label>  ';
									flbnHtml += '			 </span>  ';
									flbnHtml += '		 </div>	 ';
									flbnHtml += '		 <div class="btn_area">	 ';
									flbnHtml += '			 <span><button type="button" class="btn sm" data-action="close">닫기</button></span>	';
									flbnHtml += '		 </div>	 ';
								}
								flbnHtml += '  </div>  ';
								flbnHtml += '</div>	  ';
							}

							cmpgnApnd(flbnHtml);
						}
					}
				},function(){},flbnDataObj.members.플로팅배너ID);
			}

		}catch(e){
			printAppend('floating target err['+e+']');
		}
	}

	// 피로도맵 풋
	function putFtgXtntMap(eventsrc){
		var param = {};
		param["플로팅배너구분"] = eventsrc; // "fltbnnr_trgt","fltbnnr_cep","fltbnnr_dmp"
		param["고객정보번호"] = sseKbPin;
		kbstar.connect.request('/mquics?QAction=1138845', param, null, null, true);
	}
	
	
	//오늘 날짜.
	function getCmpgnToday(){
		var today = new Date();
		var year = today.getFullYear();
		var month = today.getMonth()+1;
		var day = today.getDate();

		if(month<10) month = "0"+month;
		if(day<10)	day = "0"+day;

		return year+""+month+""+day;
	}

	//매월 마지막날 확인.
	function getLastDayOfMonth1(year, month) {
		var tempDay = new Array(31,28,31,30,31,30,31,31,30,31,30,31);

		if(((year %4 ==0) && (year%100!=0)) ||(year%400 ==0))
			tempDay[1] = 29;
		else
			tempDay[1] = 28;

		return tempDay[month];
	}

	//피로드 체크를 위한 횟수 체크 메서드
	function setCmpgnObj(type,cmpgnID,val){

		if(type == "1"){
			var infoData = {};
			try{
				infoData = !$.isEmptyObject(val) ? JSON.parse(val) : {};
			}catch(err){
				infoData = val;
			}

			var JData = JSON.stringify(infoData);

			window.UserPreference.setValue(function() {}, function() {}, cmpgnID+"CmpgnObj", JData);

		}else if(type == "2"){

			var infoData = {};
			try{
				infoData = !$.isEmptyObject(val) ? JSON.parse(val) : {};
			}catch(err){
				infoData = val;
			}

			//infoData.viewFlag = val.viewFlag;
			var JData = JSON.stringify(infoData);

			window.UserPreference.setValue(function() {}, function() {}, cmpgnID+"CmpgnObj", JData);
		}
	}

	//실시간 다시 보지 않기 체크 확인
	//제외 페이지 체크
	function viewLiveCheckFunction(flbnDataObj,lData){

		var viewFlag = (!$.isEmptyObject(lData) && lData.viewFlag) ? lData.viewFlag : "";

		if(viewFlag == "Y"){
			sendMsg("remove");
			return false;
		}

		//현재 페이지가 제외 페이지로 등록되었을때 스킵되도록 수정
		try{
			var expsEcludPage = flbnDataObj.members.제외페이지;
			var currentPageId = window.SPA.getCurrentPageId();
			//현재 페이지 정보가 D001266 이런 형태일때만 체크 되도록
			//혹시라도 전체 페이지 제외 등록은 안되게.
			if(currentPageId.length > 6){
				if(expsEcludPage.indexOf(currentPageId) > -1){
					sendMsg("remove");
					return false;
				}
			}
		}catch(err){
		}

		return true;
	}

	//view check 관련 function
	//중복 체크등..
	function viewCheckFunction(flbnDataObj,lData){

		//2021.11.02
		//로그인 후 메인홈 페이지인 경우에만 타켓 플로팅 배너 뜨도록 수정
		//아닐 경우 안뜨도록 수정
		//2021.11.30 간편모드 메인페이지 추가함
		if(window.SPA.getCurrentPageId() != "D001374" && window.SPA.getCurrentPageId() != "D012792"){
			sendMsg("cremove");
			return false;
		}

		var thisDate = getCmpgnToday();	//오늘일자.
		var cmpgnID = flbnDataObj.members.플로팅배너ID;
		var viewType = "0";	//중복구분값
		var viewCnt = 0;	//중복횟수
		var endDate = "";	//대상일자
		var viewFlag = "";	//노출여부


		/**
		 *
		 * 중복제거구분(피로도) 체크
		 * 1.노출여부체크
		 * 2.노출시간체크
		 * "V플로팅배너ID=노출종료년월일" 값으로 쿠키입력.
		 *	종료일까지 보여주지않게 작업.
		 * */

		//노출여부 - viewFlag에 값이 있으면 노출안함.
		viewFlag = (!$.isEmptyObject(lData) && lData.viewFlag) ? lData.viewFlag : ""; //getCmpgnCookie("V"+flbnDataObj.members.플로팅배너ID);

		if($.isEmptyObject(viewFlag) != true){ //빈값이 아닐떄.
			if(thisDate	 <= viewFlag){
				//노출 횟수 및 다시보지않기 선택시 IMDG 삭제
				//kbstar.connect.request('/mquics?QAction=1014565',	 {}, function() {}, function() {}, true);
				//sendMsg("cremove");
				// 2022.02.18 박응석
				// imdg삭제부분을 서버원장(노출거부여부) 체크로 변경함
				var param = {};
				param["플로팅배너ID"] = flbnDataObj.members.플로팅배너ID;
				param["고객정보번호"] = sseKbPin;
				kbstar.connect.request('/mquics?QAction=1070864', param, null, null, true);

				return false;
			}
		}
		//노출날짜체크
		if(flbnDataObj.members.노출시작년월일 > thisDate || flbnDataObj.members.노출종료년월일 < thisDate ){
			//노출 횟수 및 다시보지않기 선택시 IMDG 삭제
			//kbstar.connect.request('/mquics?QAction=1014565',	 {}, function() {}, function() {}, true);
			//sendMsg("cremove");
			// 2022.02.18 박응석
			// imdg삭제부분을 서버원장(노출거부여부) 체크로 변경함
			var param = {};
			param["플로팅배너ID"] = flbnDataObj.members.플로팅배너ID;
			param["고객정보번호"] = sseKbPin;
			kbstar.connect.request('/mquics?QAction=1070864', param, null, null, true);

			return false;
		}
		//노출시간체크
		if(flbnDataObj.members.노출시작년월일 <= thisDate && flbnDataObj.members.노출종료년월일  >=thisDate ){
			var date1 = new Date();
			var tmpTime = date1.getHours() + "";
			tmpTime = tmpTime.length > 1 ? tmpTime :"0"+tmpTime;
			tmpTime = tmpTime +""+ date1.getMinutes();

			if(flbnDataObj.members.노출시작시분 > tmpTime || flbnDataObj.members.노출종료시분 < tmpTime ){
				//노출 횟수 및 다시보지않기 선택시 IMDG 삭제
				//kbstar.connect.request('/mquics?QAction=1014565',	 {}, function() {}, function() {}, true);
				//sendMsg("cremove");
				// 2022.02.18 박응석
				// imdg삭제부분을 서버원장(노출거부여부) 체크로 변경함
				var param = {};
				param["플로팅배너ID"] = flbnDataObj.members.플로팅배너ID;
				param["고객정보번호"] = sseKbPin;
				kbstar.connect.request('/mquics?QAction=1070864', param, null, null, true);

				return false;
			}
		}else{
			//노출 횟수 및 다시보지않기 선택시 IMDG 삭제
			//kbstar.connect.request('/mquics?QAction=1014565',	 {}, function() {}, function() {}, true);
			//sendMsg("cremove");
			// 2022.02.18 박응석
			// imdg삭제부분을 서버원장(노출거부여부) 체크로 변경함
			var param = {};
			param["플로팅배너ID"] = flbnDataObj.members.플로팅배너ID;
			param["고객정보번호"] = sseKbPin;
			kbstar.connect.request('/mquics?QAction=1070864', param, null, null, true);

			return false;
		}


		//
		/**
		 *
		 * 중복제거구분(피로도) 체크
		 * 1.쿠키정보 있을떄.
		 * 2.쿠키정보 없을때.
		 * 2.1. 당일체크(당일)
		 * 2.2. 당월체크(노출종료일의 마지막 월)
		 * 2.3. 캠페인체크(노출종료일)
		 * Dup플로팅배너ID=중복구분값|중복횟수|대상일자 와 같이 작업.
		 * */
		if(flbnDataObj.members.중복제거구분 && flbnDataObj.members.중복제거구분 != '0' && flbnDataObj.members.중복제거구분 != ''){

			window.UserPreference.getValue(function(data) {

				if(!$.isEmptyObject(data)){
//					lData = data;
					try{
						lData = data ? JSON.parse(data) : {};
					}catch(err){
						lData = data;
					}
				}

				if(!$.isEmptyObject(lData)){
					viewType = lData.viewType ? lData.viewType : "0";	//중복구분값
					viewCnt = typeof(lData.viewCnt) != 'undefined' ? Number(lData.viewCnt) : 0;
					endDate = lData.endDate ? lData.endDate : "";	//대상일자

					//printAppend('lData['+Object.values(lData)+']');

					var exDate = "";//종료일자
					var setVal = "";//쿠키에담을 데이터 - '중복구분값|중복횟수|대상일자'
					if(viewType == "1"){	//1.1.캠페인당일
						if(thisDate != endDate){	//날짜 다를떄
							exDate = getCmpgnToday();

							viewType = ""+flbnDataObj.members.중복제거구분;	//중복구분값
							viewCnt = 1;	//중복횟수
							endDate = ""+thisDate;	//대상일자
							var tmpObj = {
								"cmpgnID" : cmpgnID,
								"viewFlag" : viewFlag,
								"viewType" : viewType,
								"viewCnt" : viewCnt+"",
								"endDate":endDate
							};

							setCmpgnObj("1",cmpgnID,tmpObj);
						}else if(thisDate == endDate && viewCnt < flbnDataObj.members.중복횟수 - 1){	//날짜가같고
							viewCnt = (viewCnt*1) + 1;
							viewType = ""+flbnDataObj.members.중복제거구분;	//중복구분값
							endDate = ""+thisDate;	//대상일자
							var tmpObj = {
								"cmpgnID" : cmpgnID,
								"viewFlag" : viewFlag,
								"viewType" : viewType,
								"viewCnt" : viewCnt+"",
								"endDate":endDate
							};

							//alert(viewCnt);
							setCmpgnObj("1",cmpgnID,tmpObj);
						}else{
							//노출 횟수 및 다시보지않기 선택시 IMDG 삭제
							//kbstar.connect.request('/mquics?QAction=1014565',	 {}, function() {}, function() {}, true);
							//sendMsg("cremove");
							// 2022.02.18 박응석
							// imdg삭제부분을 서버원장(노출거부여부) 체크로 변경함
							var param = {};
							param["플로팅배너ID"] = flbnDataObj.members.플로팅배너ID;
							param["고객정보번호"] = sseKbPin;
							kbstar.connect.request('/mquics?QAction=1070864', param, null, null, true);

							//alert(flbnDataObj.members.플로팅배너ID + " | " + sseKbPin);

							return false;	//횟수 초과
						}
					}else if(viewType == "2"){//1.2.캠페인당월

						if(thisDate <= endDate && viewCnt < flbnDataObj.members.중복횟수 - 1){	//날짜 다를떄
							viewCnt =(viewCnt*1) + 1;//중복횟수
							viewType = ""+flbnDataObj.members.중복제거구분;	//중복구분값
							endDate = ""+thisDate;	//대상일자
							var tmpObj = {
								"cmpgnID" : cmpgnID,
								"viewFlag" : viewFlag,
								"viewType" : viewType,
								"viewCnt" : viewCnt+"",
								"endDate":endDate
							};

							setCmpgnObj("1",cmpgnID,tmpObj);
						}else{
							// 2022.02.18 박응석
							// imdg삭제부분을 서버원장(노출거부여부) 체크로 변경함
							var param = {};
							param["플로팅배너ID"] = flbnDataObj.members.플로팅배너ID;
							param["고객정보번호"] = sseKbPin;
							kbstar.connect.request('/mquics?QAction=1070864', param, null, null, true);

							return false;	//횟수 초과
						}
					}else if(viewType == "3"){//1.3.캠페인당
						if(viewCnt < flbnDataObj.members.중복횟수 - 1){	//날짜가같고
							viewCnt = (viewCnt*1) + 1;//중복횟수
							viewType = ""+flbnDataObj.members.중복제거구분;	//중복구분값
							endDate = ""+thisDate;	//대상일자
							var tmpObj = {
								"cmpgnID" : cmpgnID,
								"viewFlag" : viewFlag,
								"viewType" : viewType,
								"viewCnt" : viewCnt+"",
								"endDate":endDate
							};

							setCmpgnObj("1",cmpgnID,tmpObj);
						}else{
							//노출 횟수 및 다시보지않기 선택시 IMDG 삭제
							//kbstar.connect.request('/mquics?QAction=1014565',	 {}, function() {}, function() {}, true);
							//sendMsg("cremove");
							// 2022.02.18 박응석
							// imdg삭제부분을 서버원장(노출거부여부) 체크로 변경함
							var param = {};
							param["플로팅배너ID"] = flbnDataObj.members.플로팅배너ID;
							param["고객정보번호"] = sseKbPin;
							kbstar.connect.request('/mquics?QAction=1070864', param, null, null, true);

							return false;	//횟수 초과
						}
					}
				}else{
					//2.새로 등록시.
					var exDate = "";
					if(flbnDataObj.members.중복제거구분 == "1"){	//2.1캠페인 당일
						exDate = getCmpgnToday();
					}else if(flbnDataObj.members.중복제거구분 == "2"){//2.2.캠페인 당월
						var tmpEndDate = flbnDataObj.members.노출종료년월일;
						tmpEndDate = tmpEndDate.substring(0,6);
						var tmpLastDay = getLastDayOfMonth1(tmpEndDate.substring(0,4)*1, tmpEndDate.substring(4,6)*1);
						exDate = tmpEndDate+""+tmpLastDay;
					}else if(flbnDataObj.members.중복제거구분 == "3"){//2.3.캠페인 당
						exDate = flbnDataObj.members.노출종료년월일;
					}
					viewType = ""+flbnDataObj.members.중복제거구분;	//중복구분값
					endDate = ""+exDate;	//대상일자
					var tmpObj = {
							"cmpgnID" : flbnDataObj.members.플로팅배너ID,
							"viewFlag" : "",
							"viewType" : viewType,
							"viewCnt" : "1",
							"endDate":endDate
					};
					setCmpgnObj("1",cmpgnID,tmpObj);
				}
			}, function() {}, cmpgnID+"CmpgnObj");
		}else{
			var tmpObj = {
				"cmpgnID" : flbnDataObj.members.플로팅배너ID,
				"viewFlag" : (!$.isEmptyObject(lData) && lData.viewFlag) ? lData.viewFlag : "",
				"viewType" : "0",
				"viewCnt" : "0",
				"endDate":flbnDataObj.members.노출종료년월일
			};
			setCmpgnObj("1",cmpgnID,tmpObj);

		}
		return true;
	}
	//플로팅배너 업무관련 fucntion ---------------end
	
	function setSseMode(value) {
		sseMode = value;
	}

	//피로도 데이터 확인
	function checkPlay(flbnDataObj){
		if(flbnDataObj.members.플로팅배너유형구분 == "4"){
			var thisDate = getCmpgnToday();	//오늘일자.
			var cmpgnID = flbnDataObj.members.플로팅배너ID;
			var viewType = "0";	//중복구분값
			var viewCnt = 0;	//중복횟수
			var endDate = "";	//대상일자
			var viewFlag = "";	//노출여부

			if(flbnDataObj.members.중복제거구분 && flbnDataObj.members.중복제거구분 != '0' && flbnDataObj.members.중복제거구분 != ''){
				window.UserPreference.getValue(function(data) {
					var infoData;
					try{
						infoData = data ? JSON.parse(data) : {};
					}catch(err){
						infoData = data;
					}

					if(!$.isEmptyObject(infoData)){
						viewType = infoData.viewType ? infoData.viewType : "0";	//중복구분값
						viewCnt = typeof(infoData.viewCnt) != 'undefined' ? Number(infoData.viewCnt) : 0;
						endDate = infoData.endDate ? infoData.endDate : "";	//대상일자

						//printAppend('check viewType : '+viewType+' endDate : '+endDate);

						var exDate = "";//종료일자
						var setVal = "";//쿠키에담을 데이터 - '중복구분값|중복횟수|대상일자'
						if(viewType == "1"){	//1.1.캠페인당일
							if(thisDate != endDate){	//날짜 다를떄

							}else if(thisDate == endDate && viewCnt < flbnDataObj.members.중복횟수){	//날짜가같고

							}else{
								//sendMsg("cremove");
								// 2022.02.18 박응석
				  // imdg삭제부분을 서버원장(노출거부여부) 체크로 변경함
								var param = {};
								param["플로팅배너ID"] = flbnDataObj.members.플로팅배너ID;
								param["고객정보번호"] = sseKbPin;
								kbstar.connect.request('/mquics?QAction=1070864', param, null, null, true);

								//return false;	//횟수 초과
								checkViewCnt = "1";
							}
						}else if(viewType == "2"){//1.2.캠페인당월

							if(thisDate <= endDate && viewCnt < flbnDataObj.members.중복횟수){	//날짜 다를떄

							}else{
								//sendMsg("cremove");
								// 2022.02.18 박응석
				  // imdg삭제부분을 서버원장(노출거부여부) 체크로 변경함
								var param = {};
								param["플로팅배너ID"] = flbnDataObj.members.플로팅배너ID;
								param["고객정보번호"] = sseKbPin;
								kbstar.connect.request('/mquics?QAction=1070864', param, null, null, true);

								//return false;	//횟수 초과
								checkViewCnt = "2";
							}
						}else if(viewType == "3"){//1.3.캠페인당
							if(viewCnt < flbnDataObj.members.중복횟수){	//날짜가같고

							}else{
								//sendMsg("cremove");
								// 2022.02.18 박응석
				  // imdg삭제부분을 서버원장(노출거부여부) 체크로 변경함
								var param = {};
								param["플로팅배너ID"] = flbnDataObj.members.플로팅배너ID;
								param["고객정보번호"] = sseKbPin;
								kbstar.connect.request('/mquics?QAction=1070864', param, null, null, true);

								//return false;	//횟수 초과
								checkViewCnt = "3";
							}
						}
						//printAppend('checkViewCnt['+checkViewCnt+']viewCnt['+viewCnt+']['+flbnDataObj.members.중복횟수+']');
					}
				}, function() {}, cmpgnID+"CmpgnObj");
			}
		}
	}

	function fnGetConnType() {
		//연결상태를 확인한다.
		var result = '';
		try{
			if (typeof websocket != "undefined" && websocket != null && websocket != "" && typeof websocket == "object") {

				var vUrl = websocket.url ;
				var vConLength = vUrl.substring ( vUrl.indexOf( 'subscribe/')  +10 ).length;

				if ( vConLength == 22 ){
					result = 'V';
				}else if ( vConLength == 10 || vConLength == 15 ){
					result = 'P';
				}else{
					result = 'error';
				}
			}else{
				result = 'NoConnect';
			}
		}catch (e) {
		}finally{
			return result ;
		}
	}

	//아래 메서드들은 spa 로딩시 만들어지는 메서드이며,
	//플로팅호출시 내부에서 메서드 overload 하기 위한 껍데기 메서드 선언
	//window.sse.flbn_sendGoTarget = function() { 변경내용	}
	//이런식으로 재 정의하여 사용가능.
	function flbn_sendGoTarget(){}		// 타켓 플로팅 배너 페이지 이동 fucntion
	function flbn_reviewYN(_this){}		// 타켓 플로팅 배너 다시보지 않기.
	function flbn_layer_one(_this){}	// 일반 플로팅 화면 view
	function flbn_layer_two(){}				// 일반 플로팅 화면 view 상세
	function flbn_sendGo(){}					// 일반 플로팅 화면 바로가기
	function flbn_reviewTiYn(_this){}	// 일반 플로팅 화면 다시보지 않기.
	function flbn_flbnTelCnsel(){}		// 전화상담버튼
	function flbn_flbnChtt(){}				// 채팅상담버튼(1:1 상담 바로연결)
	function flbn_flbnTelPengag(){}		// 전화상담 예약(1:1 상담 전화 예약)
	function flbn_flbnBbrnPengag(){}	// 영업점 방문 예약
	function flbn_flbnEtc(url, id){}	// 기타버튼2~5
	function flbn_flbnEtc1(url){}			// 기타버튼1
	function flbn_dmpBannerCall(){}


	/********************************************************************
	 * function	 : feedback_popup
	 * Author : 임장현
	 * date	  : 2022/12/02
	 * 행태감지피드백팝업
	********************************************************************/
	var feedback_popup = {
		is_feedback_msg : function(cep_data) {
			try{
				return cep_data.피드백고유번호 !== undefined;
			}catch(e){
			}
		},
		show : function(cep_data) {
			try {
				if ( typeof window.COM_CUSTFB === "undefined" )
					window.COM_CUSTFB = new this.COM_CUSTFB();

				// 피드백 팝업 중복 방지 확인
				kbstar.connect.request('/mquics?QAction=1124076&page=' + kbstarCommon.asisPageInfo ,
					{
						"KBPIN" : sseKbPin,
						"감지규칙고유번호" : cep_data.감지규칙고유번호,
						"피드백고유번호" : cep_data.피드백고유번호,
						"페이지번호" : kbstarCommon.asisPageInfo,
						"시작년월일" : cep_data.시작년월일,
						"종료년월일" : cep_data.종료년월일
					},
					function(data){
						try {
							if ( "Y" == data.data.msg.servicedata.피드백팝업노출 ) {
								
								
								// 피드백수집 노출 로그 전송 시작 (23.02.16 추가)
								const _datas = {
									lgType : 'AP',
									lgTmClnt : QLFUtil.timeStamp(),
									_LOG_TYPE : 'AP',
									timZone : (- new Date().getTimezoneOffset()/60),
									fdbcExpsTrsmtDstic  : "1", // fdbcExpsTrsmtDstic, 1:노출  2:전송
									fdbcRawData: "",
									fdbcId : cep_data.피드백번호,
									fdbcUniqId: cep_data.피드백고유번호,
									rsultScore: "-1",
									rsultCntn: "",
									dtctRuleId: cep_data.감지규칙고유번호,
									lvPageId: kbstarCommon.asisPageInfo,
                                    pageID: window.SPA.getCurrentPageId()
								};
			
								window.sse.feedback_popup.send_log(_datas);
								// 피드백수집 노출 로그 전송 끝 (23.02.16 추가)

								window.COM_CUSTFB.fnStlvPollSet(cep_data);
							}
						} catch (err) {
							printAppend("show sub :: error " + err);
						}
						window.sse.sendMsg("fremove");
					},
					function() {},
					true, true, false, false, false, false
				);
			} catch ( err ) {
				printAppend("show :: error " + err);
			}

		},
		send_log: function(datas) {
			var list = [];
			for(var key in datas){
				var val = datas[key];
				val = (val != undefined && typeof(val) == "string" ? val.replace(/([\^\|\\])/g,"\$1" ) : "");
				list.push( key + "|" + val );
			}
			const request = list.join("^");

			var _params={hb : request}
			if (window.COMMON.getUserAgent() == "ios") {
				_params={hb:encodeURIComponent(request)}
			}

			// 피드백수집 노출 여부를 Log로 전송
			if (typeof(kbstar) != "undefined") {
				try {
					kbstar.exec( null, null, "TrackerManager", "sendBehaviorLog", _params);
					kbstar.connect.request('/mquics?QAction=1130531&page=' + kbstarCommon.asisPageInfo ,
						{
							"raw_data" : datas.fdbcRawData
						},
						function(data){},
						function() {},
						true,
                        false,
                        false,
                        true,
                        true,
                        false
					);
				} catch ( err ) {
					printAppend(err);
				}
			}								
		}, 
		/********************************************************************
		 * 일반피드백팝업과 행태감지피드백팝업 통합을 위해 custStlvPoll.js 에서 가져온뒤 변경함
		********************************************************************/
		COM_CUSTFB : function() {
			var $FB_FORM = ''; // 피드백조사 피드백내용 form 객체
			var $FB_HTMLID = ''; // 피드백조사 피드백유형 HTML 영역 ID
			var cep_data;		// !!! custStlvPoll.js 에서 수정한 부분 #1/7 !!!

			function fnStlvPollInqOnload(svData){
				var	 pollsrc = $(''
						+'<div id="custStlvPollDIV">'
						+'		<form name="custStlvPollFrm" id="custStlvPollFrm" method="post" >'
						+'			<input type="hidden" name="조회구분" id="조회구분" />'
						+'			<input type="hidden" name="피드백고유번호" id="피드백고유번호" value="'+$.trim(svData.피드백고유번호)+'" />'
						+'			<input type="hidden" name="피드백번호" id="피드백번호" value="'+$.trim(svData.피드백번호)+'" />'
						+'			<input type="hidden" name="피드백명" id="피드백명" value="'+$.trim(svData.피드백명)+'" />'
						+'			<input type="hidden" name="피드백유형번호" id="피드백유형번호" value="'+$.trim(svData.피드백유형번호)+'" />'
						+'			<input type="hidden" name="자유의견여부" id="자유의견여부" value="'+$.trim(svData.자유의견여부)+'" />'
						+'			<input type="hidden" name="자유의견명" id="자유의견명" value="'+$.trim(svData.자유의견명)+'" />'
						+'			<input type="hidden" name="피드백콘텐츠" id="피드백콘텐츠" value="'+$.trim(svData.피드백콘텐츠)+'" />'
						+'			<input type="hidden" name="감지규칙고유번호" id="감지규칙고유번호" value="'+$.trim(svData.감지규칙고유번호)+'" />'	// !!! custStlvPoll.js 에서 수정한 부분 #2/7 !!!
						+'			<input type="hidden" name="설문페이지번호" id="설문페이지번호" value="'+kbstarCommon.asisPageInfo+'" />'	// !!! custStlvPoll.js 에서 수정한 부분 #2/7 !!!
						+'			<div id="custStlvPollHTML" class="layerHTML"></div>'
						+'		</form>'
						+'</div>'
					);
				var $ptPage = $('.pt-page').length > 1 ? $('.pt-page').eq(1) : $('.pt-page');
				$('#custStlvPollDIV').remove();	// !!! custStlvPoll.js 에서 수정한 부분 #3/7 !!!
				$ptPage.append(pollsrc);

				window.COM_CUSTFB.$FB_FORM = $('#custStlvPollFrm');
				window.COM_CUSTFB.$FB_HTMLID = $('#custStlvPollHTML');
			}

			/***********************************************************************************
			 * 고객만족도조사 피드백유형번호에 따른 설문유형 HTML 생성함수 호출
			 * @param 피드백조사 데이터	 {webBuffer}
			 ***********************************************************************************/
			function fnStlvPollSet(svData){
				cep_data = svData;	// !!! custStlvPoll.js 에서 수정한 부분 #4/7 !!!

				// 1. defalut 피드백조사 영역 및 form 생성
				fnStlvPollInqOnload(svData);

				// 2. 피드백조사유형 별 바텀시트 html 생성
				var fbTypeCd = $.trim(svData.피드백유형번호); // 피드백유형번호 001:별점 , 002:설문 , 003:좋아요싫어요

				// 001:별점
				if(fbTypeCd == '001'){
					fnMakeStarScoreFb();
				}
				// 002:설문
				else if(fbTypeCd == '002'){
					fnMakePollFb();
				}
				// 003:좋아요싫어요
				else if(fbTypeCd == '003'){
					fnMakeLikeHateFb();
				}

			}

			/***********************************************************************************
			 * 고객만족도조사 바텀시트 호출
			 * @param id {String} 만족도조사 html 영역 id
			 ***********************************************************************************/
			function fnOpenBottonSheet(id, t, closeYn) {

				window.appManager.closeHybridBottomSheet("window.COM_CUSTFB.fnCloseBottonSheet('"+id+"')");

				var _html = $.ohyLayer({
					titleUse:true,
					title:t,
					content:'#' + id,
					type:'bottom',
					closeUse:closeYn == undefined || closeYn == '' ? true : closeYn
				});

				//변수 레이어 닫기
				$("#" + id + "_dev").click(function(){
					$('#custStlvPollHTML').remove();
					$('#custStlvPollFrm').append(window.COM_CUSTFB.$FB_HTMLID);

					_html.close();
				});

			  //바텀시트의 X(닫기)버튼 클릭시 백버튼에 동작 등록한 함수를 제거
				$(document).off("click.btmClose","#"+id+"_dev").on("click.btmClose","#"+id+"_dev",function(){
					window.appManager.closeHybridBottomSheet("");
				});
				//dim 터치시 백버튼 동작 등록한 함수 제거
				$(document).off("click.btmClose",".col_dim").on("click.btmClose",".col_dim",function(){
					window.appManager.closeHybridBottomSheet("");
				});
			}

			function fnCloseBottonSheet(id){
				$('#custStlvPollDIV').remove();
				$("#" + id + "_dev").click();
			}

			/***********************************************************************************
			 * 고객만족도조사 별점 피드백유형 HTML
			 * @param 피드백조사 데이터	 {String} 피드백유형번호 001:별점 , 002:설문 , 003:좋아요싫어요
			 ***********************************************************************************/
			function fnMakeStarScoreFb(){
				var buttomsrc = '<div class="ly_cnt feedback_star">';
						buttomsrc += '	<div class="section">';
						buttomsrc += '		<p class="p">'+$('#custStlvPollFrm #피드백명').val()+'</p>';
						buttomsrc += '	</div>';
						buttomsrc += '	<div class="section gap_sm_2">';
						buttomsrc += '		<div class="star_grade">';
						buttomsrc += '			<button type="button" class="btn_star_grade" aria-selected="false">';
						buttomsrc += '				<span class="hidden">1</span>';
						buttomsrc += '			</button>';
						buttomsrc += '			<button type="button" class="btn_star_grade" aria-selected="false">';
						buttomsrc += '				<span class="hidden">2</span>';
						buttomsrc += '			</button>';
						buttomsrc += '			<button type="button" class="btn_star_grade" aria-selected="false">';
						buttomsrc += '				<span class="hidden">3</span>';
						buttomsrc += '			</button>';
						buttomsrc += '			<button type="button" class="btn_star_grade" aria-selected="false">';
						buttomsrc += '				<span class="hidden">4</span>';
						buttomsrc += '			</button>';
						buttomsrc += '			<button type="button" class="btn_star_grade" aria-selected="false">';
						buttomsrc += '				<span class="hidden">5</span>';
						buttomsrc += '			</button>';
						buttomsrc += '		</div>';
						buttomsrc += '	</div>';

						if($('#자유의견여부').val() == 'Y'){
							buttomsrc += '		<div class="section">';
							buttomsrc += '			<p class="p"><em class="num">Q1.</em>'+ $('#자유의견명').val()+'</p>';
							buttomsrc += '			<div class="form_group">'; // // [S] form_group 답변 반복 (주관식만 있을 때 감싸는 클래스)
							buttomsrc += '				<div class="form_row">';
							buttomsrc += '					<div class="textarea">';
							buttomsrc += '						<textarea title="자유의견입력" name="결과내용" placeholder="내용을 입력해주세요." onkeyup="window.COM_CUSTFB.fnBbyteCheck(this);" maxlength="2000"></textarea>';
							buttomsrc += '						<p class="num_info"><span><em class="curr basketByteInfo">0</em> / 2000</span></p>';
							buttomsrc += '					</div> '
							buttomsrc += '				</div>';
							buttomsrc += '			</div>';
							buttomsrc += '		</div>';
						}

						buttomsrc += '</div>';
						buttomsrc += '<div class="btn_pop_confirm_wrap">';
						buttomsrc += '	<div class="btn_area">';
						buttomsrc += '		<span><button type="button" class="btn primary lg" onclick="window.COM_CUSTFB.fnStlvPollReg(\'001\');">확인</button></span>';
						buttomsrc += '	</div>';
						buttomsrc += '</div>';

				window.COM_CUSTFB.$FB_HTMLID.html(buttomsrc);
				fnOpenBottonSheet('custStlvPollHTML','별점 등록');

				// 만족도 별점등록 클릭 이벤트
				$('.star_grade').find('.btn_star_grade:not(span)').click(function(){
					var starGradeOn = 'on';
					$(this).siblings().removeClass(starGradeOn);
					$(this).addClass(starGradeOn).prevAll('button').addClass(starGradeOn);
					$(this).attr('aria-selected', true).siblings().attr('aria-selected', false);
				});
			}

			/***********************************************************************************
			 * 고객만족도조사 좋아요싫어요 피드백유형 HTML
			 ***********************************************************************************/
			function fnMakeLikeHateFb(){
				var buttomsrc = '<div class="ly_cnt feedback_smile">';
					buttomsrc += '		<div class="section">';
					buttomsrc += '			<p class="p">'+$('#피드백명').val()+'</p>';
					buttomsrc += '		</div>';
					buttomsrc += '		<div class="section gap_xs_2">';
					buttomsrc += '			<ul class="rdoChk_item baby_sel">';
					buttomsrc += '				<li class="item1" onclick="window.COM_CUSTFB.fnLikeHateFbRegi(\'2\');">';
					buttomsrc += '					<span class="selection">';
					buttomsrc += '						<input type="radio" id="resultScore_H" name="resultScore" value="2">';
					buttomsrc += '						<label for="resultScore_H" class="label">';
					buttomsrc += '							<em>아쉬워요!</em>';
					buttomsrc += '						</label>';
					buttomsrc += '					</span>';
					buttomsrc += '				</li>';
					buttomsrc += '				<li class="item2" onclick="window.COM_CUSTFB.fnLikeHateFbRegi(\'1\');">';
					buttomsrc += '					<span class="selection">';
					buttomsrc += '						<input type="radio" id="resultScore_L" name="resultScore" value="1">';
					buttomsrc += '						<label for="resultScore_L" class="label">';
					buttomsrc += '							<em>만족해요!</em>';
					buttomsrc += '						</label>';
					buttomsrc += '					</span>';
					buttomsrc += '				</li>';
					buttomsrc += '			</ul>';
					buttomsrc += '		</div>';
					buttomsrc += '</div>';

				window.COM_CUSTFB.$FB_HTMLID.html(buttomsrc);
				fnOpenBottonSheet('custStlvPollHTML','만족도 조사');
			}
			
			/***********************************************************************************
			 * 고객만족도조사 설문 피드백유형 HTML
			 ***********************************************************************************/
			function fnMakePollFb(){

				var form = window.COM_CUSTFB.$FB_FORM;
				//form.find('[id=조회구분]').val('getCont');	// !!! custStlvPoll.js 에서 수정한 부분 #5/7 !!!
				//kbstar.connect.request('/mquics?QAction=1079724&page=' + kbstarCommon.asisPageInfo , form.serializeJSON(), function(data){
				//form.find('[id=조회구분]').val('');
				var rData = cep_data;
				//var rData = data.data.msg.servicedata;
					var QList = rData.설문정보;
					var buttomsrc = '<div class="ly_cnt feedback_rdo">';
					var parentQusnUid = '';
					var parentResultCd = '';
					var qCnt = 1;
						$.each(QList, function(ii,vv){

							if(vv.결과번호.indexOf('Q') == 0){

								parentQusnUid = vv.문답고유번호;
								parentResultCd = vv.결과번호;
								if(ii >0){
									buttomsrc += '		</div>'; // [E] rdoChk_group 답변 반복
									buttomsrc += '	</div>	'; // [E] section 설문문항 반복
								}
								buttomsrc += '		<div class="section" id="fbList_'+qCnt+'" resultCd="'+vv.결과번호+'" qusnUid="'+parentQusnUid+'">'; // [S] 설문문항 반복
								buttomsrc += '			<p class="p"><em class="num">Q'+(qCnt++)+'.</em>'+ $.trim(vv.문답내용)+'</p>';

								if(vv.결과번호 != 'Q002'){
									buttomsrc += '			<div class="rdoChk_group">'; // // [S] rdoChk_group 답변 반복 (객관식+주관식, 객관식만 있을 때 감싸는 클래스)
								}else{
									buttomsrc += '			<div class="form_group">'; // // [S] form_group 답변 반복 (주관식만 있을 때 감싸는 클래스)
								}

							}

							if(vv.결과번호.indexOf('Q') != 0){
								if(parentQusnUid == vv.상위문답고유번호){
									if(parentResultCd != 'Q002'){
										buttomsrc += '			<div class="selection">'; // [S] 답변 반복
										buttomsrc += '				<input type="radio" id="'+$.trim(vv.상위문답고유번호)+'_'+$.trim(vv.문답고유번호)+'" name="선택설문결과'+qCnt+'" value="'+$.trim(vv.결과번호)+'" resultCd ="'+$.trim(vv.결과번호)+'" onclick="window.COM_CUSTFB.fnEtcShowHide(this);">';
										buttomsrc += '				<label for="'+$.trim(vv.상위문답고유번호)+'_'+$.trim(vv.문답고유번호)+'" class="label">';
										buttomsrc += '					<em>'+$.trim(vv.문답내용)+'</em>';
										buttomsrc += '				</label>';

										if(vv.결과번호 == 'A5'){
											buttomsrc += '			<div class="form_group" style="display:none;">'
											buttomsrc += '				<div class="form_row">'
											buttomsrc += '					<div class="textarea">'
											buttomsrc += '						<textarea title="타이틀명" placeholder="내용을 입력해주세요." resultCd ="'+$.trim(vv.결과번호)+'" onkeyup="window.COM_CUSTFB.fnBbyteCheck(this);" maxlength="2000"></textarea>'
											buttomsrc += '						<p class="num_info"><span><em class="curr basketByteInfo">0</em> / 2000</span></p>'
											buttomsrc += '					</div> '
											buttomsrc += '				</div>'
											buttomsrc += '			</div>'
										}

										buttomsrc += '			</div>'; // [E] 답변 반복
									}else{
										buttomsrc += '			<div class="form_row">'
										buttomsrc += '				<div class="textarea">'
										buttomsrc += '					<textarea title="타이틀명" placeholder="내용을 입력해주세요." resultCd ="'+$.trim(vv.결과번호)+'" onkeyup="window.COM_CUSTFB.fnBbyteCheck(this);" maxlength="2000"></textarea>'
										buttomsrc += '					<p class="num_info"><span><em class="curr basketByteInfo">0</em> / 2000</span></p>'
										buttomsrc += '				</div> '
										buttomsrc += '			</div>'
									}
								}
							}

							if(QList.length-1 == ii){
								buttomsrc += '		</div>'; // [E] rdoChk_group 답변 반복
								buttomsrc += '	</div>	'; // [E] section 설문문항 반복
							}
						});

						if($('#자유의견여부').val() == 'Y'){
							buttomsrc += '<div class="section">';
							buttomsrc += '		<p class="p"><em class="num">Q'+qCnt+'.</em>'+ $.trim(rData.자유의견명)+'</p>';
							buttomsrc += '		<div class="form_group">'; // // [S] form_group 답변 반복 (주관식만 있을 때 감싸는 클래스)
							buttomsrc += '			<div class="form_row">'
							buttomsrc += '				<div class="textarea">'
							buttomsrc += '					<textarea title="자유의견입력" name="결과내용" placeholder="내용을 입력해주세요." onkeyup="window.COM_CUSTFB.fnBbyteCheck(this);" maxlength="2000"></textarea>'
							buttomsrc += '					<p class="num_info"><span><em class="curr basketByteInfo">0</em> / 2000</span></p>'
							buttomsrc += '				</div> '
							buttomsrc += '			</div>'
							buttomsrc += '		</div>';
							buttomsrc += '	</div>	';
						}

						buttomsrc += '</div>';
						buttomsrc += '<div class="btn_pop_confirm_wrap">';
						buttomsrc += '		<div class="btn_area">';
						buttomsrc += '			<span><button type="button" class="btn primary lg" onclick="window.COM_CUSTFB.fnStlvPollReg(\'002\');">확인</button></span>';
						buttomsrc += '		</div>';
						buttomsrc += '</div>';

						window.COM_CUSTFB.$FB_HTMLID.html(buttomsrc);
						fnOpenBottonSheet('custStlvPollHTML',$('#custStlvPollFrm #피드백명').val());
				//}, function(){}, true); // !!! custStlvPoll.js 에서 수정한 부분 #6/7 !!!
			}

			/***********************************************************************************
			 * 고객만족도조사 좋아요싫어요 설문에서 좋아요 선택 시 앱스토 이동
			 * @param gubun {String} 좋아요싫어요 구분 데이터 1 : 좋아요, 2 : 싫어요
			 * 1 : 컨펌 확인 시 -> 피드백결과 등록 후 스토어 이동 / 취소 시 -> 페이지 유지
			 * 2 : 설문피드백 호출
			 ***********************************************************************************/
			function fnLikeHateFbRegi(gubun){
				if(gubun == '1'){
					var msg = 'KB스타뱅킹 앱 칭찬 리뷰를 남겨주세요!\n리뷰작성을 위해 스토어로 이동하시겠습니까?'
					// 확인 클릭 시 피드백결과 등록 후 앱스토어 이동
					// 취소 클릭 시 페이지 유지
					if(confirm(msg)){
						var inputScore = '<input type="hidden" id="결과점수순위" name="결과점수순위" value="1" >'; // 좋아요
						window.COM_CUSTFB.$FB_FORM.append(inputScore);
						fnStlvPollReg('002');
					}
				}else{
					// 싫어요는 결과점수순위 = 2
					var inputScore = '<input type="hidden" id="결과점수순위" name="결과점수순위" value="2" >';
					window.COM_CUSTFB.$FB_FORM.append(inputScore);

					$('#custStlvPollHTML_dev').click();

					// 피드백유형 설문 호출
					fnMakePollFb();
				}
			}

			function fnStlvPollRegValidation(fbGubun){
				var valResult = true;
				if(fbGubun == '001'){
					var starScore = $('div.star_grade > button.on').length;
					if(starScore == 0){
						alert('별점을 선택해주세요.');
						valResult = false;
					}
				}else if(fbGubun == '002'){
					$('div[id^=fbList]').each(function(ii,ee){
						var resultCd = $(ee).attr('resultCd');
						if(resultCd != 'Q002'){ // 객관식인 경우
							$(this).find("div.rdoChk_group").each(function(i,e){

								var obj = $(e).find('input[type=radio]:checked');
								if( obj.length == 0 ){
									alert('설문조사를 선택해주세요.');
									valResult = false;
									return false;
								}else if( obj.attr('resultCd') == 'A5' ){
									if( obj.parent().find('textarea').val().length == 0 ){
										alert('답변을 입력해주세요.');
										obj.parent().find('textarea').focus();
										valResult = false;
										return false;
									}
								}

							});

						}else{

							if($(ee).find("textarea").val().length == 0){
								alert('답변을 입력해주세요.');
								$(ee).find("textarea").focus();
								valResult = false;
								return false;
							}
						}

						if( !valResult ) return false;

					});
				}
				return valResult;
			}

			/***********************************************************************************
			 * 고객만족도조사 피드백결과 등록
			 * @param fbGubun  {String} 피드백유형번호 001:별점 , 002:설문 , 003:좋아요싫어요
			 ***********************************************************************************/
			function fnStlvPollReg(fbGubun){

				if( !fnStlvPollRegValidation(fbGubun) ) return;

				if(fbGubun == '001'){
					var starScore = $('div.star_grade > button.on').length;
					window.COM_CUSTFB.$FB_FORM.append('<input type="hidden" id="결과점수순위" name="결과점수순위" value="'+starScore+'" >');
				}else if(fbGubun == '002'){

					if ( cep_data.피드백유형번호 == '002' )
						window.COM_CUSTFB.$FB_FORM.append('<input type="hidden" id="결과점수순위" name="결과점수순위" value="0" >');

					$('div[id^=fbList]').each(function(ii,ee){

						var resultCd = $(ee).attr('resultCd');
						var selectResultCd = '';
						var etcContent = '';

						if(resultCd != 'Q002'){ // 객관식인 경우
							$(this).find("div.rdoChk_group").each(function(i,e){
								selectResultCd = $(e).find("input[type=radio]:checked").val();
								if(selectResultCd == "A5"){
									etcContent = $(e).find("textarea").val();
								}
							});
						}else{
							selectResultCd = $(ee).find("textarea").attr('resultCd');
							etcContent = $(ee).find("textarea").val();
						}

						var resultACd = '';
						var resultBCd = '';
						var resultCCd = '';
						var resultDCd = '';
						var resultECd = '';

						if(selectResultCd == "A1"){
							resultACd = '1';
						}else if(selectResultCd == "A2"){
							resultBCd = '1';
						}else if(selectResultCd == "A3"){
							resultCCd = '1';
						}else if(selectResultCd == "A4"){
							resultDCd = '1';
						}else if(selectResultCd == "A5"){
							resultECd = '1';
						}

						var inputQusnUid = '<input type="hidden" name="설문문답고유번호[]" value="'+$(ee).attr('qusnUid')+'" />';
						var inputFbUid = '<input type="hidden" name="설문피드백고유번호[]" value="'+$('#custStlvPollFrm #피드백고유번호').val()+'" />';
						var inputUserid = '<input type="hidden" name="설문사용자번호[]" value="" />';
						var inputEtcContent	 = '<input type="hidden" name="설문기타내용[]" value="'+etcContent+'" />';
						var inputResultACd = '<input type="hidden" name="설문결과A번호[]" value="'+resultACd+'" />';
						var inputResultBCd = '<input type="hidden" name="설문결과B번호[]" value="'+resultBCd+'" />';
						var inputResultCCd = '<input type="hidden" name="설문결과C번호[]" value="'+resultCCd+'" />';
						var inputResultDCd = '<input type="hidden" name="설문결과D번호[]" value="'+resultDCd+'" />';
						var inputResultECd = '<input type="hidden" name="설문결과E번호[]" value="'+resultECd+'" />';
						var inputFbPageCd = '<input type="hidden" name="설문이탈페이지번호[]" value="'+kbstarCommon.asisPageInfo+'" />';	// !!! custStlvPoll.js 에서 수정한 부분 #2/7 !!!

						window.COM_CUSTFB.$FB_FORM.append(inputQusnUid);
						window.COM_CUSTFB.$FB_FORM.append(inputFbUid);
						window.COM_CUSTFB.$FB_FORM.append(inputUserid);
						window.COM_CUSTFB.$FB_FORM.append(inputEtcContent);
						window.COM_CUSTFB.$FB_FORM.append(inputResultACd);
						window.COM_CUSTFB.$FB_FORM.append(inputResultBCd);
						window.COM_CUSTFB.$FB_FORM.append(inputResultCCd);
						window.COM_CUSTFB.$FB_FORM.append(inputResultDCd);
						window.COM_CUSTFB.$FB_FORM.append(inputResultECd);
						window.COM_CUSTFB.$FB_FORM.append(inputFbPageCd);
					});

				}

				var inputFreeCont = '<input type="hidden" id="결과내용" name="결과내용" value="'+$.trim($("textarea[name=결과내용]").val())+'" >';
				window.COM_CUSTFB.$FB_FORM.append(inputFreeCont);

				try {

					var form = window.COM_CUSTFB.$FB_FORM;
					const jsonDatas = form.serializeJSON();
					const _datas = {
						lgType : 'AP',
						lgTmClnt : QLFUtil.timeStamp(),
						_LOG_TYPE : 'AP',
						timZone : (- new Date().getTimezoneOffset()/60),
						fdbcExpsTrsmtDstic  : "2", // fdbcExpsTrsmtDstic, 1:노출  2:전송
						fdbcRawData: encodeURIComponent(JSON.stringify(jsonDatas)),
						fdbcId : jsonDatas.피드백번호,
						fdbcUniqId: jsonDatas.피드백고유번호,
						rsultScore: jsonDatas.결과점수순위,
						rsultCntn: jsonDatas.결과내용,
						dtctRuleId: jsonDatas.감지규칙고유번호,
						lvPageId: kbstarCommon.asisPageInfo,
                        pageID: window.SPA.getCurrentPageId()
					};

					window.sse.feedback_popup.send_log(_datas);

					$('#custStlvPollDIV').remove();
					$('#custStlvPollHTML_dev').click();

					const fbTypeNm = $.trim(jsonDatas.피드백유형번호) == '001' ? '별점' : $.trim(jsonDatas.피드백유형번호) == '002' ? '설문' : '만족도' ;
					if($.trim(jsonDatas.피드백유형번호) == '003' && $.trim(jsonDatas.결과점수순위) == '1'){ // 좋아요싫어요 중 좋아요 선택 시
						fnAppStoreMove();
					} else {
						alert(fbTypeNm + ' 등록이 완료되었습니다. 감사합니다.');
					}

				} catch ( err ) {
					printAppend(err);
				}
			}

			/***********************************************************************************
			 * 스타뱅킹 앱이동 - 피드백수집 좋아요싫어요 중 좋아요 선택 시 등록 후 success callback
			***********************************************************************************/
			function fnAppStoreMove(){
				var androidPkg = "";
				var iospkg = "";
				var androidStoreUrl = "";
				var iosStoreUrl = "";
				var appname = "";

				//스타뱅킹앱 앱이동 및 스토어링크
				androidPkg = "com.kbstar.kbbank";
				androidStoreUrl = "https://play.google.com/store/apps/details?id=com.kbstar.kbbank";
				iospkg = "";
				iosStoreUrl = "http://itunes.apple.com/kr/app/id373742138?mt=8";

				var userAgent = window.COMMON.getUserAgent();	  //161110_ejp_add
				if(userAgent == 'ios'){				//161110_ejp_add
					window.configManager.appLink(androidPkg, iospkg, androidStoreUrl, iosStoreUrl, appname);
				} else if(userAgent == 'android'){			//161110_ejp_add
					window.configManager.marketLink(androidPkg, iospkg, androidStoreUrl, iosStoreUrl, appname);
				}
			}

			// 입력 bytecheck
			function fnBbyteCheck(obj) {

				var maxByte = obj.getAttribute("maxlength");
				var str = obj.value;
				var str_len = str.length;

				var breakStr = '';
				var pass = true;

				var rbyte = 0;
				var rlen = 0;
				var one_char = "";
				var code_char = '';
				var str2 = "";

				for (var i=0; i<str_len; i++) {
					one_char = str.charAt(i);
					code_char = str.charCodeAt(i);

					// 특수문자 체크
					//한글,영문,숫자 및 일부 특수문자(공백!?&-_~^*()")만 가능하게함.
					if ((code_char >= 12593 && code_char <= 12622) || code_char == 4514){

					} else if (code_char >= 12623 && code_char <= 12685){

					} else if (code_char >= 44032 && code_char <= 55203){

					} else if (code_char >= 97 && code_char <= 122){

					} else if (code_char >= 65 && code_char <= 90){

					} else if (code_char >= 48 && code_char <= 57) {

					} else if (code_char == 32|| code_char == 33 || code_char == 34 || code_char == 38 || code_char == 40 || code_char == 41 || code_char == 42 || code_char == 44
								|| code_char == 45 || code_char == 46 || code_char == 63 || code_char == 64 || code_char == 94 || code_char == 95 || code_char == 126 || code_char == 10  ) {

					} else {
						pass = false;
						breakStr = str.substring(i, i+1);
					}

					if(pass == false){
						alert("메시지 내용에는 일부 특수문자를 사용하실 수 없습니다. \n사용할 수 없는문자 ["+breakStr+"]");
						$(obj).val(str.replace(breakStr,''));
						break;
					}

					if (escape(code_char).length > 4) {
						rbyte += 2;
					} else {
						rbyte++;
					}//if

					if(rbyte <= maxByte) {
						rlen = i+1;
					}
				}//for
				if (rbyte > maxByte) {
					alert("한글 " + (maxByte/2) + "자 / 영문 " + maxByte + "자를 초과 입력할 수 없습니다.");

					str2 = str.substr(0, rlen);

					obj.value = str2;

				} else {
					$(obj).next().find('em.basketByteInfo').html(rbyte) ;
				}//if
			}

			/***********************************************************************************
			 * 객관식 질문 중 기타가 있다면, 기타 클릭 시 textarea 펼쳐지고, 다른 답변 클릭 시 textarea 닫힘
			***********************************************************************************/
			function fnEtcShowHide(obj){
				if($(obj).attr('resultCd') == 'A5'){
					$(obj).parent().parent().find('div.form_group').show();
				}else{
					$(obj).parent().parent().find('textarea').val('');
					$(obj).parent().parent().find('em.basketByteInfo').html('0') ;
					$(obj).parent().parent().find('div.form_group').hide();
				}
			}

			/**
			 * 외부에 노출시킬 속성 정의
			 */
			return {
				'fnStlvPollSet' : fnStlvPollSet
				,'fnStlvPollReg' : fnStlvPollReg
				,'fnLikeHateFbRegi' : fnLikeHateFbRegi
				,'$FB_FORM' :  $FB_FORM
				,'$FB_HTMLID' : $FB_HTMLID
				,'fnBbyteCheck' : fnBbyteCheck
				,'fnEtcShowHide' : fnEtcShowHide
				,'fnCloseBottonSheet' : fnCloseBottonSheet
			}

		}

	};

	return {
		"conn" : conn,
		"onResume" : onResume,
		"disconnect" : disconnect,
		"sseKbPin": sseKbPin,
		"checkPin": checkPin,
		"flbn_sendGoTarget": flbn_sendGoTarget,
		"flbn_reviewYN": flbn_reviewYN,
		"flbn_layer_one": flbn_layer_one,
		"flbn_layer_two": flbn_layer_two,
		"flbn_sendGo": flbn_sendGo,
		"flbn_reviewTiYn": flbn_reviewTiYn,
		"flbn_flbnTelCnsel": flbn_flbnTelCnsel,
		"flbn_flbnChtt": flbn_flbnChtt,
		"flbn_flbnTelPengag": flbn_flbnTelPengag,
		"flbn_flbnBbrnPengag": flbn_flbnBbrnPengag,
		"flbn_flbnEtc": flbn_flbnEtc,
		"flbn_flbnEtc1": flbn_flbnEtc1,
		"flbn_successCallback": flbn_successCallback,
		"setSseMode":setSseMode,
		"popupCheck": popupCheck,
		"tarFlbCnt":tarFlbCnt,
		"loginSessionKey": loginSessionKey,
		"flbn_dmpBannerCall":flbn_dmpBannerCall,
		"eData":eData,
		"sseVstId":sseVstId,
		"fnGetConnType":fnGetConnType,
		"sendMsg":sendMsg,
		"feedback_popup": feedback_popup
	}
}

window.sse = sseModule();