/**
 *  인증서 관련 처리 스크립트
 *  
 -  includeKbsignForLogin.jsp
  1. KB모바일인증서 로그인 페이지는, 레이어팝업 없이 업무페이지에서 바로 인증시작 함수를 호출한다.
  2. 인증시작 : 인증 페이지의 fn_callApiKbsign001(); 호출
  3. 인증완료 : 인증 페이지의 fn_callApiKbsign003(); 호출
  4. 인증완료 후 호출함수 : 업무 페이지에 callbackFromNormalOnBody() 함수를 만들어두고 사용한다.
  
 - includeKbsignForNormal.jsp  
  1. 인증시작 : 인증 페이지의 fn_callApiKbsign001(); 호출
  2. 인증완료 : 인증 페이지의 fn_callApiKbsign003(); 호출
  3. 인증완료 후 호출함수 : 업무 페이지에 callbackFromNormalOnBody()[인증], callbackFromNormalOnBody2[전자서명] 함수를 만들어두고 사용한다.
     전자서명시 부모창에 필요한 값
       - callbackFromNormalOnBody2 성공 콜백 함수
       - getParentGetOgtxtData() 함수
       - cmsKBDigitalYn hidden input 값
 */
let gKbsignCi = '';

/**
 *  KB국민인증서 인증요청
 * @param type
 * 		'L' : includeKbsignForLogin.jsp
 * 		'N' : includeKbsignForNormal.jsp
 * 		'M' : includeKbsignForMinor.jsp
 */
function fn_callApiKbsign001(type) {
	let url = '/appIf/v1/kbsign/verifi/KBSIGN001';
	let data = {
						type: type,
						soId: $("#soId").val(),
						dataHeader: {},
						dataBody: {},
					};
					
	fn_transCall(url, JSON.stringify(data), fn_callBackApiKbsign);
};

/**
 * KB국민인증서 인증확인
 * @param type
 * 		'L' : includeKbsignForLogin.jsp
 * 		'N' : includeKbsignForNormal.jsp
 * 		'M' : includeKbsignForMinor.jsp
 */
function fn_callApiKbsign003(type) {
	let url = '/appIf/v1/kbsign/verifi/KBSIGN003';
	let data = {
						type: type,
						soId: $("#soId").val(),
						certPathCd: $("#certPathCd").val(),
						certCustId: $("#certCustId").val(),
						certCtrtId: $("#certCtrtId").val(),
						dataHeader: {},
						dataBody: {
											serialNo: sessionStorage.getItem("serialNo"),
											groupCoCd: "KBO"
										}
					};

	fn_transCall(url, JSON.stringify(data), fn_callBackApiKbsign);
};

/**
 * KB모바일인증서 전자서명 요청
 */
function fn_callApiKbsign004() {
	if(tg != 'prod'){
		//개발, 스테이지 무조건 인증
		setTimeout( function() {
			domDisabled('btnKbsignReq');
			domEnabled('btnKbsignComplete');
		},3000);
	}else{
		let url = '/appIf/v1/kbsign/verifi/KBSIGN004';
		let data = {
				dataHeader: {},
				dataBody: {
					ogtxtData: getParentGetOgtxtData() //부모창의 함수 호출
				}
		};
		
		fn_transCall(url, JSON.stringify(data), fn_callBackApiKbsign);
	}
};

/**
 * KB모바일인증서 전자서명 요청
 */
function fn_callApiKbsign006() {

	if(tg != 'prod'){
		popalarm({
			msg : "[개발/스테이지 PASS]인증에 성공하였습니다.("+tg+")",
			cfrmYn : false,
			okCallback : callbackFromNormalOnBody2	
		});
	}else{
		let url = '/appIf/v1/kbsign/verifi/KBSIGN006';
		let data = {
				dataHeader: {},
				dataBody: {
					serialNo: sessionStorage.getItem("serialNo")
				}
		};
		
		fn_transCall(url, JSON.stringify(data), fn_callBackApiKbsign);
	}
};

/**
 * KB모바일인증서 인증 확인
 * @param signData
 */
function fn_callApiKbsign007(signData) {
	let url = '/appIf/v1/kbsign/verifi/KBSIGN007';
	let data = {
			certPathCd: 	$('#certPathCd').val(),
			certCustId: 		$('#certCustId').val(),
			dataHeader: 	{},
			dataBody: {
				groupCoCd: 	"KB0",
				chnId: 			"AI",
				pageId: 			getPageId(),
				signData:		signData,
				serialNo: 		sessionStorage.getItem("serialNo")
			}
	};
	
	fn_transCall(url, JSON.stringify(data), fn_callBackApiKbsign);
};


/**
 * KB-PIN 수령
 */
function fn_callApiKbsignITB001(data) {
	let url = '/appIf/v1/kb/eai/ITB001';
	fn_transCall(url, fnSign(JSON.stringify(data)), fn_callBackApiKbsign);
};

/**
 *  KB국민인증서 인증요청콜백
 * @param tranId
 * @param result
 * @param status
 */
function fn_callBackApiKbsign(tranId, result, status, inputData){
	switch(tranId){
	case 'KBSIGN001':	// KB모바일인증서 인증요청
		sessionStorage.removeItem("serialNo");

		if(result.dataHeader.resultCode == '0000' && result.dataHeader.successCode == '0') {
			let serialNo = result.dataBody.serialNo;
			console.log("serialNo="+serialNo);
			sessionStorage.setItem("serialNo", serialNo);

			let url = "kbbank://call?cmd=move_to&id=web&url=/mquics?page=C063953&urlparam=serno:"+serialNo+",authtype:1,urlScheme:screen=A,kind:kbbank,chnId:AI,pagId:" + getPageId();
			if(JSON.parse(inputData).type === 'M'){
				url = "kbbank://call?cmd=move_to&id=web&url=/mquics?page=C063953&urlparam=serno:"+serialNo+",authtype:1,urlScheme:screen=A,kind:kbbank,chnId:AI,pagId:C066263";
			}
			fn_includeKbsignStartApp(url);
			
			// 로그인
			if(JSON.parse(inputData).type === 'L'){
				setTimeout( function() {
					domEnabled('btnCertLogin');
				},3000);
			}else if(JSON.parse(inputData).type === 'M'){
				setTimeout( function() {
					domDisabled('btnMinorKbsignReq');
					domEnabled('btnMinorKbsignComplete');
				},3000);
			}else{
				setTimeout( function() {
					domEnabled('btnKbsignComplete');
				},3000);
			}
			
		} else {

			let opt = {
					msg: "["+result.dataHeader.resultCode+"]"+result.dataHeader.successCode,
					cfrmYn: false
			};
			popalarm(opt);
		}
		break;
	case 'KBSIGN003':	// KB모바일인증서 인증확인
		if(result.dataHeader.resultCode == '0000' && result.dataHeader.successCode == '0') {
			/*****************************************************************************************
			 ******************************** includeKbsignForLogin.jsp ***************************
			*****************************************************************************************/
			let Ci = decodeURIComponent(result.dataBody.Ci);
			gKbsignCi = decodeURIComponent(result.dataBody.decCi);

			if(JSON.parse(inputData).type === 'L'){
				if(!isEmpty(gKbsignCi)){
	//				KB-PIN 수령
					let data = {
									serviceId: "ITB001",
									data: {
												cuniqnoDstic: "4",
												type: "L",
												cuniqno: "",
												ciNo: gKbsignCi,
												soId: $("#soId").val()
											}
								};
					
					fn_callApiKbsignITB001(data);
				}
			}else if(JSON.parse(inputData).type === 'N'){
				if($('#cnifNo').val() != "" && gKbsignCi == $('#cnifNo').val()) {
					let opt = {
							msg: "인증에 성공하였습니다.",
							cfrmYn: false,
							okCallback: callbackFromNormalOnBody
					};
					popalarm(opt);
				}else{
					let opt = {
							msg: "인증값이 일치하지 않습니다. 다시 시도해 주세요.",
							cfrmYn: false
					};
					popalarm(opt);
				}
			}
			
		} else {
			let opt = {
					msg: "["+result.dataHeader.resultCode+"]"+result.dataHeader.resultMessage,
					cfrmYn: false
			};
			popalarm(opt);
			if(JSON.parse(inputData).type === 'M'){
				initKbsignCertPopupNormal();
			}else if(JSON.parse(inputData).type === 'L'){
				$('#certCustId').val("");
				if(getOsInfo().indexOf('app') === -1){
					domDisabled('btnCertLogin');
				}
			}
		}
		break;
	case 'KBSIGN004':	// KB모바일인증서 전자서명 요청
		sessionStorage.removeItem("serialNo");
		if(result.dataHeader.resultCode == '0000' && result.dataHeader.successCode == '0') {
			
			let serialNo = result.dataBody.serialNo;
			console.log("serialNo="+serialNo);
			sessionStorage.setItem("serialNo", serialNo);
			
			let url = "kbbank://call?cmd=move_to&id=web&url=/mquics?page=C064350&urlparam=serno:" + serialNo + ",authtype:1,chnId:AI,pagId:" + getPageId();

			fn_includeKbsignStartApp(url);
			
			setTimeout( function() {
				domEnabled('btnKbsignComplete');
			},3000);
		} else {
			let opt = {
					msg: "["+result.dataHeader.resultCode+"]"+result.dataHeader.resultMessage,
					cfrmYn: false
			};
			popalarm(opt);
		}
		break;
	case 'KBSIGN006':	// KB모바일인증서 전자서명 사인데이터 요청
		if(result.dataHeader.resultCode == '0000' && result.dataHeader.successCode == '0') {
			if(result.dataBody.decSignData != getParentGetOgtxtData()){	//실패 
				let opt = {
						msg: "인증값이 일치하지 않습니다. 다시 시도해 주세요.",
						cfrmYn: false
				};
				popalarm(opt);
			}else{	// 성공
				fn_callApiKbsign007(result.dataBody.signData);
			}
		} else {
			let opt = {
					msg: "["+result.dataHeader.resultCode+"]"+result.dataHeader.resultMessage,
					cfrmYn: false
			};
			popalarm(opt);
		}
		break;
	case 'KBSIGN007':	// KB모바일인증서 인증 확인
		if(result.dataHeader.resultCode == '0000' && result.dataHeader.successCode == '0') {
			let Ci = decodeURIComponent(result.dataBody.Ci);
			gKbsignCi = decodeURIComponent(result.dataBody.decCi);
			
//			getCertKbCustInfo
			//인클루드된 부모에 ci값이 없느 없는애들은 ci를 조회하로 간다
			//ci값이 없는경우 인클루드된 부보에 (id - custId) 세팅을 해줘여한다
			if($('#cnifNo').val() == undefined || $('#cnifNo').val() == ""){
//				KB-PIN 수령
				let data = {
								serviceId: "ITB001",
								data: {
											type: "N",
											cuniqnoDstic: "3",
											cuniqno: $("#custId").val()
										}
							};
				
				if($("#certPathCd").val() == "11"){ // 미성년자 가입의 경우  
					data.data.cuniqno = $("#legCustId").val();
				}
				
				fn_callApiKbsignITB001(data);
			}else{
				if($('#cnifNo').val() != "" && gKbsignCi == $('#cnifNo').val()) {
					popalarm({
						msg: "인증에 성공하였습니다.",
						cfrmYn: false,
						okCallback: callbackFromNormalOnBody2
					});
				}
				else{
					popalarm({
						msg: "인증값이 일치하지 않습니다. 다시 시도해 주세요.",
						cfrmYn: false
					});
				}
			}
			
		} else {
			let opt = {
					msg: "["+result.dataHeader.resultCode+"]"+result.dataHeader.resultMessage,
					cfrmYn: false
			};
			popalarm(opt);
			initKbsignCertPopupNormal();
		}
		break;
	case 'ITB001':	// KB-PIN 수령
		let data = JSON.parse(fnUnSign(result.enc));

		if(JSON.parse(fnUnSign(inputData)).data.type === 'L'){
			if(data != null && data.data != null){
				
				if(data.resultCode !== '00000'){
					popalarm( {
						msg: "본인인증 정보를 확인하지 못했습니다. 다시 시도해 주세요.",
						cfrmYn: false
					});
					$('#certCustId').val("");
					domDisabled('btnCertLogin');
					return;
				}
				else{
					var custId = data.data.custIdnfr + data.data.custMgtNo; //KB PIN
					$('#certCustId').val(fnSign(custId));
					callbackFromNormalOnBody();	
				}
				
			} else {
				popalarm({
					msg: "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
					cfrmYn: false
				});
				$('#certCustId').val("");
				domDisabled('btnCertLogin');
				return;
			}
		}else{
			if(data !== null && data.data !== null){
				if(data.resultCode !== '00000'){
					popalarm({
						msg: "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
						cfrmYn: false
					});
					return;
				}else{
					var cnifNo   = data.data.cnifNo;
					if(gKbsignCi == cnifNo) {
						popalarm({
							msg: "인증에 성공하였습니다.",
							cfrmYn: false,
							okCallback: callbackFromNormalOnBody2
						});
					}else{
						popalarm({
							msg: "인증값이 일치하지 않습니다. 다시 시도해 주세요",
							cfrmYn: false
						});
					}
				}
				
			} else {
				popalarm({
					msg: "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
					cfrmYn: false
				});
			}
		}

		break;
	}
};


/**
 * 앱카드인증 앱실행
 * @param url
 */
function fn_includeKbsignStartApp(url){
	let typeOS = getOsInfo().toLowerCase();
	let openAt = new Date;

	if(typeOS.indexOf('android') !== -1){
		if(new Date - openAt < 2000){
			setTimeout( function(){
				location.href = url;
			},1000);
		}
	} else if(typeOS.indexOf('ios') !== -1){
		if(new Date - openAt < 5000){
			setTimeout( function(){
				location.href = "https://itunes.apple.com/kr/app/id373742138";
			},2500);
		}
		location.href = url;
	}
};


