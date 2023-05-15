/*
 * 20200203 HANNA
 * KCB 인증 연동 함수 (KCB001, KCB002, KCB003, KCB004) 
 */
let _v = {};
/**
 * ARS 요청
 * @param inparam
 * @param callbackKcb001
 */
function callApiKcb001(inparam, callbackKcb001) {
	let param  	= {};
	let data   	= {};
	let Request = {};
	
	param.serviceId = 'KCB001';
	param.soId      = $('#soId').val();
	
	Request.crdTpCd = inparam.crdTpCd;
	Request.crdNo	= inparam.crdNo	;
	Request.binNo   = inparam.binNo;
	Request.crdCd 	= inparam.crdCd;
	Request.mbphnNo = inparam.mbphnNo;

	Request.usrEnvTpCd         = "01";
	Request.reqSiteUrl         = window.location.href;
	Request.reqSiteNm          = "liivM";
	Request.identSvcTrmsAgrYn  = "Y";
	Request.cdSvcTrmsAgrYn 	   = "Y";
	Request.indivInfoCollAgrYn = "Y";
	Request.uciProcAgrYn 	   = "Y";
	Request.extrAgrYn 	       = "Y";
	Request.dvcGtherInfo       = "";
	Request.chnl_cd 	       = ""; 
	Request.clientIp 	       = "127.0.0.1";		// 클라이언트 ID
	
	data.Request = Request;
	param.data 	 = data;

	// 호출화면 콜백
	_v.rtnCallback = callbackKcb001;
	
    let url		=  '/appIf/v1/kcb/web/KCB001';
	fn_transCall(url, fnSign(JSON.stringify(param)), fn_apiCallBack);	
};

/**
 * ARS인증 확인
 * @param inparam
 * @param callbackKcb002
 */
function callApiKcb002(inparam, callbackKcb002) {
	let param  	= {};
	let data   	= {};
	let Request = {};
	
	param.serviceId = 'KCB002';
	param.soId       = $('#soId').val();
	param.certPathCd = inparam.certPathCd;
	param.certCustId = inparam.certCustId;
	param.certCtrtId = inparam.certCtrtId;
	
	Request.txSeqNo = inparam.txSeqNo;
	Request.crdCd   = inparam.crdCd  ;
	data.Request = Request;
	param.data = data;
	
	// 호출화면 콜백
	_v.rtnCallback = callbackKcb002;

    let url		=  '/appIf/v1/kcb/web/KCB002';
	fn_transCall(url, fnSign(JSON.stringify(param)), fn_apiCallBack);	
};

/**
 * 동명이인 확인
 * @param postData
 * @param callbackKcb001
 * @param inparam
 */
function callApiKcb003(postData, callbackKcb001, inparam) {
	let param  	= {};
	let data   	= {};
	let Request = {};
	
	param.serviceId = "KCB003";
	param.soId      = $('#soId').val();
	
	let txSeqNo  = postData.data.Response.txSeqNo;
	let birthDay = "";
	let sexCd    = "";
	let nm       = inparam.lrp_nm;
	let birth_gender = inparam.birth_gender;
	
	if(birth_gender.charAt(6) == "1" || birth_gender.charAt(6) == "3") {
		sexCd = "M";
	} else {
		sexCd = "F";
	}
	if(birth_gender.charAt(6) == "1" || birth_gender.charAt(6) == "2") {
		birthDay = "19" + birth_gender.substr(0,6);
	} else {
		birthDay = "20" + birth_gender.substr(0,6);
	}
	
	Request.txSeqNo  = txSeqNo ;
	Request.birthDay = birthDay;
	Request.sexCd    = sexCd   ;
	Request.nm       = nm      ;
	
	data.Request = Request;
	param.data = data;
	
	// 호출화면 콜백
	_v.rtnCallback = callbackKcb001;

    let url		=  '/appIf/v1/kcb/web/KCB003';
	fn_transCall(url, fnSign(JSON.stringify(param)), fn_apiCallBack);	
};


/**
 * 앱카드 간편인증
 * @param inparam
 * @param callbackKcb004
 */
function callApiKcb004(inparam, callbackKcb004) {
	
	let param  	= {};
	let data   	= {};
	let Request = {};
	
	param.serviceId = 'KCB004';
	param.soId      = $('#soId').val();

	Request.crdCd   = inparam.crdCd;
	Request.mbphnNo = inparam.mbphnNo;

	Request.reqSiteUrl         = window.location.href;
	Request.reqSiteNm          = "liivM";
	Request.usrEnvTpCd         = "02";
	Request.uciProcAgrYn       = "Y";
	Request.indivInfoCollAgrYn = "Y";
	Request.identSvcTrmsAgrYn  = "Y";
	Request.cdSvcTrmsAgrYn     = "Y";
	Request.extrAgrYn          = "Y";
	Request.dvcGtherInfo       = "";
	Request.chnl_cd            = "";// 채널 코드
	Request.clientIp           = "127.0.0.1";

	data.Request = Request;
	param.data = data;
	
	// 호출화면 콜백
	_v.rtnCallback = callbackKcb004;

    let url		=  '/appIf/v1/kcb/web/KCB004';
	fn_transCall(url, fnSign(JSON.stringify(param)), fn_apiCallBack);	
};

/**
 * apiKcb Callback
 * @param tranId
 * @param data
 * @param status
 */
function fn_apiCallBack(tranId, data, status){
	switch(tranId){
	case 'KCB001':
		var resultCode = data.resultCode;
		if(resultCode == 'T001') {
			_v.rtnCallback(data);
		}else if(resultCode == 'T200') {
			callApiKcb003(data, _v.rtnCallback, inparam);
		}else{
			kcbReturnCode(resultCode);	
		}
		break;
	case 'KCB002':
		var resultCode = data.resultCode;
		if(resultCode == 'T000') {
			_v.rtnCallback(data);
		} else {
			kcbReturnCode(resultCode);
		}
		break;
	case 'KCB003':
	case 'KCB004':
		var resultCode = data.resultCode;
		if(resultCode == 'T001') {
			_v.rtnCallback(data);
		} else {
			kcbReturnCode(resultCode);
		}
		break;
	}
};