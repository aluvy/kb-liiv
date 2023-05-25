/*@depends="template"@*/
/**
 * 추가인증관련 전역변수
 */
var AddTemplate = {};
AddTemplate.ARS_CONFIRM = true;
AddTemplate.SMS_CONFIRM = true;
AddTemplate.TRANS_CONFIRM = true;
/* common-tag */
var ScurtyCD = function(){
	var _randNo1	= null;
	var _randNo2	= null;
	var _lang		= null;

	return {
		//	일반적인 보안카드 패스워드 init
		InitPassword : function (randNo1,randNo2,lang){
			_randNo1 = randNo1;
			_randNo2 = randNo2;
			_lang	= lang;

			var str_scTitle="보안카드 비밀번호";
			var randNo1Ment = "앞 2자리";
			var randNo2Ment = "뒤 2자리";
			if( lang != 'KOR'){
				str_scTitle = 'Security Card Password';
				randNo1Ment = "First 2 Digit";
				randNo2Ment = "Last 2 Digit";
			} 

			//	시뮬이 아닐경우
			if( !device.platform.match(/Orchestra Simulator/) ){
				$("#보안카드비밀번호1_V").prop("readonly",true);
				$("#보안카드비밀번호2_V").prop("readonly",true);
			}

			$("#보안카드비밀번호1_V").off().on("click", function(){
				ScurtyCD.ResetPassword();

				//	보안매체 검증 QAction 사용체크
				var strConfirmBtn = "" ;
				if( $("#scuryMdiaQactionUse").val() == "true" ){
					strConfirmBtn = "QAction=1031807&page=" + kbstarCommon.asisPageInfo + "&randNo1=" +randNo1 + "&randNo2="+ randNo2 ;
				}
				window.secureKeypad.showCardKeypadQAction('card', 1, str_scTitle, 2, '['+randNo1+'] '+randNo1Ment, '['+randNo2+'] '+randNo2Ment, "Y", strConfirmBtn, ScurtyCDpwCBQAction);
			});

			$("#보안카드비밀번호2_V").off().on("click", function(){
				ScurtyCD.ResetPassword();

				//	보안매체 검증 QAction 사용체크
				var strConfirmBtn = "" ;
				if( $("#scuryMdiaQactionUse").val() == "true" ){
					strConfirmBtn = "QAction=1031807&page=" + kbstarCommon.asisPageInfo + "&randNo1=" +randNo1 + "&randNo2="+ randNo2 ;
				}
				window.secureKeypad.showCardKeypadQAction('card', 2, str_scTitle, 2, '['+randNo1+'] '+randNo1Ment, '['+randNo2+'] '+randNo2Ment, "Y", strConfirmBtn, ScurtyCDpwCBQAction);
			});

			$("#보안카드비밀번호1_V").bind("keyup",function(){
				onSimulKeyUp($("#보안카드비밀번호1"), $("#보안카드비밀번호1_V").val());
			});
			$("#보안카드비밀번호2_V").bind("keyup",function(){
				onSimulKeyUp($("#보안카드비밀번호2"), $("#보안카드비밀번호2_V").val());
			});
		},

		ResetPassword : function(){
			//	앱일경우
			if (!device.platform.match(/Orchestra Simulator/)) {
				$("#보안카드비밀번호1").val("");
				$("#보안카드비밀번호2").val("");
				$("#보안카드비밀번호1_V").val("");
				$("#보안카드비밀번호2_V").val("");
			}
		},

		//	일반보안카드 비밀번호 체크
		CheckPassword : function(){
			//	앱일경우
			if( !device.platform.match(/Orchestra Simulator/) ){
				if( $("#보안카드비밀번호1").val() == "" ){
					$("#보안카드비밀번호1_V").click();
					return false;
				}

				if( $("#보안카드비밀번호2").val() == "" ){
					$("#보안카드비밀번호2_V").click();
					return false;
				}
				return true;
			}else{
				return ScurtyCD.CheckPasswordCert();
			}
		},

		////////////////////	인증서용 보안카드 Function	///////////////////
		//	인증서 보안카드 init
		InitCert : function (randNo1,randNo2,lang){
			ScurtyCD.InitSerial(randNo1, randNo2, lang);
			ScurtyCD.InitPasswordCert(randNo1, randNo2, lang);
		},

		InitSerial : function (randNo1,randNo2,lang){
			var str_scTitle="보안카드일련번호 마지막 4자리";
			if(lang != 'KOR'){
				str_scTitle = 'Last 4 digits of security card serial';
			}
			if (!device.platform.match(/Orchestra Simulator/)) {
				$("#보안카드번호_V").prop("readonly",true);
			}

			$("#보안카드번호_V").off();
			$(document).on("click", "#보안카드번호_V", function(){
				ScurtyCD.ResetSerial();
				window.secureKeypad.showSecureKeypad("num", 1, str_scTitle, 4, ScurtyCDSerialCB,'N','','Y');
			});

			$("#보안카드번호_V").on("keyup", function(){
				onSimulKeyUp($("#보안카드번호"), $("#보안카드번호_V").val());
			});
		},

		//	인증서용 보안카드 패스워드 init
		InitPasswordCert : function (randNo1,randNo2,lang){
			_randNo1 = randNo1;
			_randNo2 = randNo2;
			_lang	= lang;

			var str_scTitle="보안카드 비밀번호";
			var randNo1Ment = "앞 2자리";
			var randNo2Ment = "뒤 2자리";
			if(lang != 'KOR'){
				str_scTitle = 'Security Card Password';
				randNo1Ment = "First 2 Digit";
				randNo2Ment = "Last 2 Digit";
			}

			if (!device.platform.match(/Orchestra Simulator/)) {
				$("#보안카드비밀번호1_V").prop("readonly",true);
				$("#보안카드비밀번호2_V").prop("readonly",true);
			}

			$("#보안카드비밀번호1_V").off();
			$(document).on("click", "#보안카드비밀번호1_V", function(){
				ScurtyCD.ResetPassword();
				var scurtySerial  = $("#보안카드번호").val();
				if( scurtySerial == "" ){
					alert("보안카드일련번호 마지막 4자리를 입력하세요.");
					$("#보안카드번호_V").focus();
					return;
				}
				//	보안매체 검증 QAction 사용체크
				var strConfirmBtn = "" ;
				if( $("#scuryMdiaQactionUse").val() == "true" ){
					strConfirmBtn = "QAction=1031807&page=" + kbstarCommon.asisPageInfo + "&randNo1=" +randNo1 + "&randNo2="+ randNo2 + "&scurtySerial=" + scurtySerial ;
				}
				window.secureKeypad.showCardKeypadQAction('card', 1, str_scTitle, 2, '['+randNo1+'] '+randNo1Ment, '['+randNo2+'] '+randNo2Ment, "Y", strConfirmBtn, ScurtyCDpwCBCert);
			});

			$("#보안카드비밀번호2_V").off();
			$(document).on("click", "#보안카드비밀번호2_V", function(){
				ScurtyCD.ResetPassword();
				var scurtySerial  = $("#보안카드번호").val();
				if( scurtySerial == "" ){
					alert("보안카드일련번호 마지막 4자리를 입력하세요.");
					$("#보안카드번호_V").focus();
					return;
				}

				//	보안매체 검증 QAction 사용체크
				var strConfirmBtn = "" ;
				if( $("#scuryMdiaQactionUse").val() == "true" ){
					strConfirmBtn = "QAction=1031807&page=" + kbstarCommon.asisPageInfo + "&randNo1=" +randNo1 + "&randNo2="+ randNo2 + "&scurtySerial=" + scurtySerial ;
				}
				window.secureKeypad.showCardKeypadQAction('card', 2, str_scTitle, 2, '['+randNo1+'] '+randNo1Ment, '['+randNo2+'] '+randNo2Ment, "Y", strConfirmBtn, ScurtyCDpwCBCert);
				//window.secureKeypad.showKeypadCard('card',2,str_scTitle,2,'[ '+randNo1+' ] '+randNo1Ment, '[ '+randNo2+' ] '+randNo2Ment,'ScurtyCDpwCBCert');
			});

			$("#보안카드비밀번호1_V").bind("keyup",function(){
				onSimulKeyUp($("#보안카드비밀번호1"), $("#보안카드비밀번호1_V").val());
			});
			$("#보안카드비밀번호2_V").bind("keyup",function(){
				onSimulKeyUp($("#보안카드비밀번호2"), $("#보안카드비밀번호2_V").val());
			});
		},

		ResetSerial : function(){
			if( !device.platform.match(/Orchestra Simulator/) ){
				$("#보안카드번호").val("");
				$("#보안카드번호_V").val("");
			}
		},

		CheckCert : function(){
			if( ScurtyCD.CheckSerialCert() ){
				return ScurtyCD.CheckPasswordCert();
			}
			return false;
		},

		CheckSerialCert : function(){
			var arrMent = new Array();
			arrMent[0] = "보안카드일련번호 마지막 4자리를 입력하세요.";
			arrMent[1] = "보안카드일련번호 마지막 4자리를 정확하게 입력하세요.";

			if( _lang != 'KOR' ){
				arrMent[0] = "Please Insert Last 4 digits of Security Card Serial Number";
				arrMent[1] = "Please Check Last 4 digits of Security Card Serial Number";
			}

			if ($("#보안카드번호_V").val() == "" ){
				$("#보안카드번호_V").focus();
				return false;
			}

			if( $("#보안카드번호_V").val().length != $("#보안카드번호_V").attr("maxlength") ){
				$("#보안카드번호_V").focus();
				return false;
			}
			return ScurtyCD.CheckPasswordCert();
		},

		//	인증서용 보안카드 비밀번호 체크
		CheckPasswordCert : function(){
			var arrMent = new Array();
			arrMent[0] = "보안카드 [ "+_randNo1+" ] 앞의 두자리를 입력하세요.";
			arrMent[1] = "보안카드 [ "+_randNo1+" ] 앞의 두자리를 정확하게 입력하세요.";
			arrMent[2] = "보안카드 [ "+_randNo2+" ] 뒤의 두자리를 입력하세요.";
			arrMent[3] = "보안카드 [ "+_randNo2+" ] 뒤의 두자리를 정확하게 입력하세요.";
			if(_lang != 'KOR'){
				arrMent[0] = "Please Insert Security Card [ "+_randNo1+" ] First 2 digits";
				arrMent[1] = "Please Check Security Card [ "+_randNo1+" ] First 2 digits";
				arrMent[2] = "Please Insert Security Card [ "+_randNo2+" ] Last 2 digits";
				arrMent[3] = "Please Check Security Card [ "+_randNo2+" ] Last 2 digits";
			}

			if($("#보안카드비밀번호1_V").val() == ""){
				$("#보안카드비밀번호1_V").focus();
				return false;
			}
			if($("#보안카드비밀번호1_V").val().length != $("#보안카드비밀번호1_V").attr("maxlength")){
				$("#보안카드비밀번호1_V").focus();
				return false;
			}

			if($("#보안카드비밀번호2_V").val() == ""){
				$("#보안카드비밀번호2_V").focus();
				return false;
			}
			if($("#보안카드비밀번호2_V").val().length != $("#보안카드비밀번호2_V").attr("maxlength")){
				$("#보안카드비밀번호2_V").focus();
				return false;
			}
			return true;
		}
	};
}();

//	일반 보안카드 Callback Function
function ScurtyCDpwCBQAction(ret, idx, enc1, len1, plainText1, enc2, len2, plainText2){
	if(ret == "false"){
		$("#보안카드비밀번호1").val("");
		$("#보안카드비밀번호2").val("");
		$("#보안카드비밀번호1_V").val("");
		$("#보안카드비밀번호2_V").val("");
		return;
	}else{
		var _dummy1 = "";
		var _dummy2 = "";
		for ( var i = 0; i < len1; i++) {
			_dummy1 += " ";
		}
		for ( var i = 0; i < len2; i++) {
			_dummy2 += " ";
		}
		$("#보안카드비밀번호1").val(enc1);
		$("#보안카드비밀번호2").val(enc2);
		$("#보안카드비밀번호1_V").val(_dummy1);
		$("#보안카드비밀번호2_V").val(_dummy2);

		//	네이티브 보안키패드 검증완료후	특정콜백함수 호출
		try{ window.SPA_COMMON.callbackWithSPA("securityMdiaSubmit", {}); }catch( e ){}
	}
}

//	인증서용 보안카드번호 Callback Function
function ScurtyCDSerialCB(result, idx, plainText, len, enc ) {
	if(result == "false"){
		$("#보안카드번호").val("");
		$("#보안카드번호_V").val("");
		return;
	}else{
		var _dummy = "";
		for(var i =0; i < len; i++) {
			_dummy += " ";
		}
		$("#보안카드번호").val(enc);
		$("#보안카드번호_V").val(_dummy);
	}
}

//	인증서용 보안카드 비밀번호 Callback Function
function ScurtyCDpwCBCert(ret, idx, enc1, len1, plainText1, enc2, len2, plainText2){
	if(ret == "false"){
		$("#보안카드비밀번호1").val("");
		$("#보안카드비밀번호2").val("");
		$("#보안카드비밀번호1_V").val("");
		$("#보안카드비밀번호2_V").val("");
		return;

	}else{
		var _dummy1 = "";
		var _dummy2 = "";
		for ( var i = 0; i < len1; i++) {
			_dummy1 += " ";
		}
		for ( var i = 0; i < len2; i++) {
			_dummy2 += " ";
		}
		$("#보안카드비밀번호1").val(enc1);
		$("#보안카드비밀번호2").val(enc2);
		$("#보안카드비밀번호1_V").val(_dummy1);
		$("#보안카드비밀번호2_V").val(_dummy2);

		//	네이티브 보안키패드 검증완료후	특정콜백함수 호출
		try{ window.SPA_COMMON.callbackWithSPA("securityMdiaSubmit", {}); }catch( e ){}
	}
}

/**
 * OTP, 보안카드 onKeyUp 이벤트 처리 함수(시뮬레이터용)
 */
function onSimulKeyUp(secuObj, secuVal){
	if (typeof device != 'undefined' && typeof device.platform != 'undefined' && device.platform.match(/Orchestra Simulator/)) {
		secuObj.val(secuVal);
	}
}


//##################################################################################
// common-etc-tag
//##################################################################################
var WebEtcTag = function() {

	var TAG_JSON_DATA = {};

	return  {
		TAG_EMAIL_MNBANK	: "001",
		TAG_PHONE_MNBANK	: "002",
		TAG_CALENDAR_MNBANK	: "003",
		TAG_ADDR_MNBANK		: "004",
		TAG_EMPNO_MNBANK	: "005",

		HM_VALUE_PHONE_H : "H",
		HM_VALUE_PHONE_A : "A",
		HM_VALUE_PHONE_N : "N",
		HM_VALUE_PHONE_C : "C",
		HM_VALUE_PHONE_W : "W",
		HM_VALUE_PHONE_G : "G",

		loadData : function (inputData){
			try {
				switch (inputData.TAG_TYPE) {
					//	NEW 스타뱅킹용 이메일태그
					case WebEtcTag.TAG_EMAIL_MNBANK :
						WebEtcTag.setEmailTag_MNBANK(inputData);
						break;

					//	NEW 스타뱅킹용 전화태그
					case WebEtcTag.TAG_PHONE_MNBANK :
						WebEtcTag.setPhoneTag_MNBANK(inputData);
						break;

					//	NEW 스타뱅킹용 달력태그
					case WebEtcTag.TAG_CALENDAR_MNBANK :
						WebEtcTag.setCalendarTag_MNBANK(inputData);
						break;

					//	NEW 스타뱅킹용 주소태그
					case WebEtcTag.TAG_ADDR_MNBANK :
						WebEtcTag.setAddressTag_MNBANK(inputData);
						break;

					//	NEW 스타뱅킹용 직원
					case WebEtcTag.TAG_EMPNO_MNBANK :
						WebEtcTag.setEmpNoTag_MNBANK(inputData);
						break;

					default:
						break;
				}
			} catch (e) {
				kbstar.alert("WebTag.loadData error :"+e);
			}
		},

		setEmpNoTagData : function(jsonData) {
			TAG_JSON_DATA = jsonData;
		},

		evl : function(param, defaultValue) {
			if(typeof param == "undefined" || param == "" || param == null) {
				return defaultValue;
			} else {
				return param;
			}
		},

//######################################################
//	MNBANK Function
//######################################################

		//	NEW 스타뱅킹용 이메일태그
		setEmailTag_MNBANK : function (inputData, targetElement) {
			try {
				var data = {
					designTemplate	: "",
					targetElement	: WebEtcTag.evl(inputData.TARGET_ELEMENT_ID, ""),		//	테그를 넣을 ID
					sDivEmailId		: WebEtcTag.evl(inputData.DIV_EMAIL_ID, ""),			//	이메일 DIV ID
					sTxtFullEmailId	: WebEtcTag.evl(inputData.TXT_FULLEMAIL_ID, ""),		//	FULL 이메일 INPUT ID
					sTxtEmailId		: WebEtcTag.evl(inputData.TXT_EMAIL_ID, ""),			//	이메일 INPUT ID
					sTxtEmailAddrId	: WebEtcTag.evl(inputData.TXT_EMAILADDR_ID, ""),		//	이메일 도메인 INPUT ID
					sSelEmailAddrId	: WebEtcTag.evl(inputData.SEL_EMAILADDR_ID, ""),		//	셀렉트 DIV ID
					sDefEmailVal	: WebEtcTag.evl(inputData.DEF_EMAILADDR_VAL, ""),		//	이메일 넘겨받은값
					sDefNoEmail		: WebEtcTag.evl(inputData.NO_EMAIL, "none"),			//	이메일없음여부 (none, block)
					sDefNoEmailId	: WebEtcTag.evl(inputData.NO_EMAIL_ID, ""),				//	이메일없음 체크박스 ID
					sDefEmailVal1	: "",
					sDefEmailVal2	: ""
//					sInTypeYn		: WebEtcTag.evl(inputData.TAG_INTYPE_YN, ""),
				};

				var sFullVal = data.sDefEmailVal;		//	이메일풀주소
				var str1 = "";			//	기본 이메일 앞주소
				var str2 = "";			//	기본 이메일 뒷주소

				if(""!= sFullVal) {
					var idx = sFullVal.indexOf("@");
					if( idx > -1){
						str1 = sFullVal.substring(0, idx);
						str2 = sFullVal.substring(idx + 1);
					} else {
						str1 = sFullVal;
						str2 = "";
					}
				};

				data.designTemplate = "WEBEmailTag_MNBANK";
				data.sDefEmailVal1 = str1 ;
				data.sDefEmailVal2 = str2 ;

				var tagContents = WebTagContents[data.designTemplate]();
				tagContents = tagContents.replace(/@@~~DIV_EMAIL_ID~~@@/gm		, data.sDivEmailId);
				tagContents = tagContents.replace(/@@~~TXT_FULLEMAIL_ID~~@@/gm	, data.sTxtFullEmailId);		//	이메일 전체 ID
				tagContents = tagContents.replace(/@@~~TXT_EMAIL_ID~~@@/gm		, data.sTxtEmailId);			//	이메일 ID
				tagContents = tagContents.replace(/@@~~TXT_EMAILADDR_ID~~@@/gm	, data.sTxtEmailAddrId);		//	이메일 도메인 ID
				tagContents = tagContents.replace(/@@~~SEL_EMAILADDR_ID~~@@/gm	, data.sSelEmailAddrId);		//	셀렉트박스 ID
				tagContents = tagContents.replace(/@@~~DEF_EMAIL_VAL~~@@/gm		, data.sDefEmailVal);			//	이메일 전체 VAL
				tagContents = tagContents.replace(/@@~~DEF_EMAIL_VAL1~~@@/gm	, data.sDefEmailVal1);			//	이메일 ID VAL
				tagContents = tagContents.replace(/@@~~DEF_EMAIL_VAL2~~@@/gm	, data.sDefEmailVal2);			//	이메일 도메인 VAL
				tagContents = tagContents.replace(/@@~~NO_EMAIL~~@@/gm			, data.sDefNoEmail);			//	선택없음
				tagContents = tagContents.replace(/@@~~NO_EMAIL_ID~~@@/gm		, data.sDefNoEmailId);			//	선택없음 체크박스 ID

				$("#"+data.targetElement).html(tagContents);
			}catch( e ){
				kbstar.alert("WebEtcTag.setEmailTag_MNBANK error : "+e);
			};
		},

		//	NEW 스타뱅킹용 전화태그
		setPhoneTag_MNBANK : function(inputData){
			//debugger;
			try {
				var data = {
					designTemplate	: "",
					targetElement	: WebEtcTag.evl(inputData.TARGET_ELEMENT_ID, ""),		//	전화번호 테그 타겟 ID
					sDivPhoneMode	: WebEtcTag.evl(inputData.PHONE_DIVISION, ""),			//	전화번호 태그 모드 - H:집전화, A:평생전화, N:없음, C:휴대전화
					sDivPhoneId		: WebEtcTag.evl(inputData.DIV_PHONE_ID, ""),			//	전화번호 태그 DVI ID
					sTxtPhoneId		: WebEtcTag.evl(inputData.HID_PHONE_ID, ""),			//	FULL 전화번호 Input ID
					sSelPhone1Id	: WebEtcTag.evl(inputData.SEL_PHONE1_ID, ""),			//	셀렉트DIV ID
					sTxtPhone1Id	: WebEtcTag.evl(inputData.TXT_PHONE1_ID, ""),			//	전화번호 식별번호 ID
					sTxtPhone2Id	: WebEtcTag.evl(inputData.TXT_PHONE2_ID, ""),			//	전화번호 국번일련번호 ID
					sMskPhoneYN		: WebEtcTag.evl(inputData.MSK_PHONE_YN, ""),			//	마스킹여부
					sDefPhoneVal	: WebEtcTag.evl(inputData.DEF_PHONE_VAL, ""),			//	풀전화번호 값
					sDefNoPhone		: WebEtcTag.evl(inputData.NO_PHONE, "none"),			//	전화없음여부 (none, block)
					sDefNoPhoneId	: WebEtcTag.evl(inputData.NO_PHONE_ID, "defNoPhoneId"),	//	전화없음 체크박스 ID
					sDefPhone1Val	: "",													//	휴대폰식별번호
					sDefPhone2Val	: ""													//	휴대폰국번일련번호
				};

				var strNophone	= "";
				var strTilte	= "";
				var str1		= "";
				var str1tmp		= "";
				var str2		= "";
				var str3		= "";
				var idx			= 0;

				var sFullVal	= data.sDefPhoneVal;		//	넘어온 전화번호
				var valLength	= sFullVal.length; 			//	넘어온 전화번호 길이
				var sFullVals	= sFullVal.split("-");		//	넘어온 전화번호 분리된 배열

				if( valLength > 0 ){
					idx = sFullVals.length;
				}

				if( data.sDivPhoneMode == 'N' || data.sDivPhoneMode == 'H'){
					str1tmp = "02";
					strNophone = "자택 전화없음";
					strTilte = "자택";
				}else if( data.sDivPhoneMode == 'W' || data.sDivPhoneMode == 'G'){
					str1tmp = "02";
					strNophone = "직장 전화없음";
					strTilte = "직장";
				}else if( data.sDivPhoneMode == 'A' ){
					str1tmp = "070";
					strNophone = "자택 전화없음";
					strTilte = "자택";
				}else{
					str1tmp = "010";
					strNophone = "휴대폰 없음";
					strTilte = "휴대폰";
				}

				switch( idx ){
					case 1:
						str1 = sFullVals[0];
						break;
					case 2:
						str1 = sFullVals[0];
						str2 = sFullVals[1];
						break;
					case 3:
						str1 = sFullVals[0];
						str2 = sFullVals[1];
						str3 = sFullVals[2];
						break;
					default:
						str1 = str1tmp;
						str2 = "";
						str3 = "";
						break;
				}

				data.designTemplate = "WEBPhoneTag_MNBANK";
				data.sDefPhone1Val = str1;
				data.sDefPhone2Val = str2 + str3;

				var tagContents = WebTagContents[data.designTemplate]();
				tagContents = tagContents.replace(/@@~~DIV_PHONE~~@@/gm			, data.sDivPhoneId);	//	전화번호 테그 DIV ID
				tagContents = tagContents.replace(/@@~~HID_PHONE_ID~~@@/gm		, data.sTxtPhoneId);	//	FULL 전화번호 hidden INPUT ID
				tagContents = tagContents.replace(/@@~~SEL_PHONE1_ID~~@@/gm		, data.sSelPhone1Id);	//	전화번호 식별번호 셀렉트 DIV ID
				tagContents = tagContents.replace(/@@~~TXT_PHONE1_ID~~@@/gm		, data.sTxtPhone1Id);	//	전화번호 식별번호 INPUT ID
				tagContents = tagContents.replace(/@@~~TXT_PHONE2_ID~~@@/gm		, data.sTxtPhone2Id);	//	전화번호 국번일련번호 INPUT ID
				tagContents = tagContents.replace(/@@~~PHONE_MODE~~@@/gm		, data.sDivPhoneMode);	//	전화번호 태그 모드 - H:집전화, A:평생전화, N:없음, C:휴대전화
				tagContents = tagContents.replace(/@@~~NO_PHONE~~@@/gm			, data.sDefNoPhone);	//	전화없음 style 설정( none, block )
				tagContents = tagContents.replace(/@@~~NO_PHONE_ID~~@@/gm		, data.sDefNoPhoneId);	//	전화없음 checkBox ID
				tagContents = tagContents.replace(/@@~~NO_PHONE_TEXT~~@@/gm		, strNophone);			//	휴대폰없음, 자택 전화없음
				tagContents = tagContents.replace(/@@~~TITLE_PHONE_TEXT~~@@/gm	, strTilte);			//	테그 타이틀

				if( "Y" == data.sMskPhoneYN ){
					tagContents = tagContents.replace(/@@~~TYPE_PHONE2~~@@/gm, "password");
//					tagContents = tagContents.replace(/@@~~TYPE_PHONE2_SIZE~~@@/gm, "11");
				}else{
					tagContents = tagContents.replace(/@@~~TYPE_PHONE2~~@@/gm, "tel");
//					tagContents = tagContents.replace(/@@~~TYPE_PHONE2_SIZE~~@@/gm, "9");
				}

				tagContents = tagContents.replace(/@@~~DEF_PHONE_VAL~~@@/gm		, data.sDefPhone1Val + data.sDefPhone2Val);
				tagContents = tagContents.replace(/@@~~DEF_PHONE1_VAL~~@@/gm	, data.sDefPhone1Val);
				tagContents = tagContents.replace(/@@~~DEF_PHONE2_VAL~~@@/gm	, data.sDefPhone2Val);

				$("#"+data.targetElement).html(tagContents);

				//	전화번호 없을경우 체크박스 선택
				if( sFullVal == "" ){
					//$("#"+data.sDefNoPhoneId).prop("checked",true);
					//caq.tag.noPhone_MNBANK( data.sSelPhone1Id, data.sTxtPhone1Id, data.sTxtPhone2Id, data.sTxtPhoneId, data.sDefNoPhoneId, data.sDivPhoneMode );
				}

			}catch( e ){
				kbstar.alert("WebEtcTag.setPhoneTag error : "+e);
			};
		},

		//	NEW 스타뱅킹용 달력태그
		setCalendarTag_MNBANK : function(inputData) {
			var _sDesignTemplate	= "CalendarTag_InputType_MNBANK";		//	날짜입력템플릿 스크립트
			var _sInputDateId		= null;		//	날짜INPUT ID
			var _sDivPopUpCalId		= null;		//	팝업DIV ID
			var _sDefYmdValue		= null;		//	기본 날짜( "none" 입력 시 공란, 값 없을 시 오늘날짜 )
			var _sDelim				= ".";		//	날짜 구분자
			var _sCallback			= "";		//	콜백함수
			var _sInputTitleVal		= null;
			var _targetElement		= null;		//	태그 대상 element

			try{
				if( typeof inputData.LANG_CODE != "undefined" && inputData.LANG_CODE == "ENG" ){
					_sDesignTemplate = _sDesignTemplate + "_g";
				}
				_targetElement	= $("#" + inputData.TARGET_ELEMENT_ID);					//	달력 태그가 담겨질 엘리먼트 ID
				_sInputDateId	= WebEtcTag.evl(inputData.INPUT_DATE_ID, "");			//	input id
				_sDivPopUpCalId	= WebEtcTag.evl(inputData.DIV_POPUP_CAL_ID, "");		//	div id
				_sDefYmdValue	= WebEtcTag.evl(inputData.DEF_YMD_VALUE, "");			//	기본 날짜
				_sInputTitleVal	= WebEtcTag.evl(inputData.DEF_TITLE_VALUE, "날짜 입력");	//	타이틀
				_sCallback		= WebEtcTag.evl(inputData.CALLBACK, "");				//	callback func

				if( typeof _sCallback != "string" ){
					_sCallback = "";
				}

				//	마스킹
				if( _sDefYmdValue.length == 8 ){
					_sDefYmdValue = _sDefYmdValue.substring(0, 4) + _sDelim + _sDefYmdValue.substring(4, 6) + _sDelim + _sDefYmdValue.substring(6, 8);
				}

				if( "none" == _sDefYmdValue ){
					_sDefYmdValue = "";
				}else{
					if( "" == _sDefYmdValue ){
						var today = new Date();
						var year = today.getFullYear();
						var month = today.getMonth() + 1;
						var day = today.getDate();

						_sDefYmdValue = "" + year + _sDelim + (month < 10 ? "0" + month : month) + _sDelim + (day < 10 ? "0" + day : day);
					}
				}

				var tagContents = WebTagContents[_sDesignTemplate]();
				tagContents = tagContents.replace(/@@~~INPUT_DATE~~@@/gm		, _sInputDateId);
				tagContents = tagContents.replace(/@@~~CALENDAR_POPUP_ID~~@@/gm	, _sDivPopUpCalId);
				tagContents = tagContents.replace(/@@~~DEF_YMD_VAL~~@@/gm		, _sDefYmdValue);
				tagContents = tagContents.replace(/@@~~DEF_TITLE_VAL~~@@/gm		, _sInputTitleVal);
				tagContents = tagContents.replace(/@@~~CALLBACK~~@@/gm			, _sCallback);

				_targetElement.html(tagContents);
			}catch( e ){
				kbstar.alert("WebEtcTag.setCalendarTag error : " + e);
			};
		},

		//	NEW 스타뱅킹용 주소태그
		setAddressTag_MNBANK : function(inputData) {
			var _sDesignTemplate = "AddressInputTemplate_MNBANK"; // 주소입력템플릿
			var _sZipcodeId = null;
			var _sAddrBscId = null;
			var _sAddrDtlId = null;
			var _sPopupFunc = null;
			var _sDefZipcodeValue = null;
			var _sDefAddrBscValue = null;
			var _sDefAddrDtlValue = null;

			var _targetElement = null; // 태그 대상 element
			try {
				_targetElement = $("#" + inputData.TARGET_ELEMENT_ID);
				_sZipcodeId = WebEtcTag.evl(inputData.ZIPCODE_ID, "");					//	우편번호 input id, name
				_sAddrBscId = WebEtcTag.evl(inputData.ADDR_BSC_ID, "");					//	기본주소 input id, name
				_sAddrDtlId = WebEtcTag.evl(inputData.ADDR_DTL_ID, "");					//	상세주소 input id, name
				_sPopupFunc = WebEtcTag.evl(inputData.POPUP_FUNC, "");					//	우편번호 검색 팝업 함수 호출문장(세미콜론 제외!!!)
				_sDefZipcodeValue = WebEtcTag.evl(inputData.DEF_ZIPCODE_VALUE, "");		//	우편번호 기본값
				_sDefAddrBscValue = WebEtcTag.evl(inputData.DEF_ADDR_BSC_VALUE, "");	//	기본주소 기본값
				_sDefAddrDtlValue = WebEtcTag.evl(inputData.DEF_ADDR_DTL_VALUE, "");	//	상세주소 기본값

				var tagContents = WebTagContents[_sDesignTemplate]();
				tagContents = tagContents.replace(/@@~~ZIPCODE~~@@/gm			, _sZipcodeId);
				tagContents = tagContents.replace(/@@~~DEF_ZIPCODE_VAL~~@@/gm	, _sDefZipcodeValue);
				tagContents = tagContents.replace(/@@~~POPUP_OPEN_FUNC~~@@/gm	, _sPopupFunc);
				tagContents = tagContents.replace(/@@~~ADDR_BSC~~@@/gm			, _sAddrBscId);
				tagContents = tagContents.replace(/@@~~DEF_ADDR_BSC_VAL~~@@/gm	, _sDefAddrBscValue);
				tagContents = tagContents.replace(/@@~~ADDR_DTL~~@@/gm			, _sAddrDtlId);
				tagContents = tagContents.replace(/@@~~DEF_ADDR_DTL_VAL~~@@/gm	, _sDefAddrDtlValue);

				_targetElement.html(tagContents);

				//	우편번호가 있을경우
				if( _sDefZipcodeValue != "" ){
					$("#"+_sZipcodeId+"_div").css("display","block");
				}

			} catch (e) {
				kbstar.alert("WebEtcTag.setCalendarTag error : " + e);
			};
		},

		//	NEW 스타뱅킹 권유직원
		setEmpNoTag_MNBANK : function(inputData) {
			var _FormName			= inputData.FORM_NAME;
			var _sDesignTemplate	= "EmpnoInputTemplate_MNBANK";	//	직원번호 입력템플릿 파일명
			var _targetElement		= null;							//	태그 대상 element
			try{
				if( typeof inputData.LANG_CODE != "undefined" && inputData.LANG_CODE == "ENG" ){
					_sDesignTemplate = _sDesignTemplate + "_g";
				}

				var tagContents = WebTagContents[_sDesignTemplate]();
				tagContents = tagContents.replace(/@@~~FORM_NAME~~@@/gm	, _FormName);
				_targetElement = $("#" + inputData.TARGET_ELEMENT_ID);
				_targetElement.html(tagContents);
				kbstar.DataBinder.quicsDataBinding(TAG_JSON_DATA);		//	데이터 바인딩

				if( typeof empno != "undefined" ){
					if( typeof empno.init != "undefined" ){
						empno.init();		//	권유직원 초기화
					}
				}

			}catch(e){
				kbstar.alert("WebEtcTag.setEmpNoTag error : "+e);
			};
		}

	};
}();


//##################################################################################
// 페이징용 태그
//##################################################################################
var WebPagingTag = function() {
	return  {
		PAGING_DATA_LIST_ID: "",
		PAGING_METHOD: "",
		TEMPLATE_PATH_SERVER : "/mnbank/app/html/bfa/template/",
		TEMPLATE_PAGING_00 : "PAGING_TAG_KEY_00",
		TEMPLATE_PAGING_01 : "PAGING_TAG_KEY_01",
		TEMPLATE_PAGING_03 : "PAGING_TAG_KEY_03",

		TAG_PAGING_ID_00 : "PAGING_TAG_KEY_00",		//	페이지번호
		TAG_PAGING_ID_01 : "PAGING_TAG_KEY_01",		//	더보기
		TAG_PAGING_ID_03 : "PAGING_TAG_KEY_03",		//	더보기
		TAG_PAGING_ID_04 : "PAGING_TAG_KEY_04",		//	피이지번호Simple
		READMORE : "더보기",

		setPagingMethodName : function(method_name) {
			WebPagingTag.PAGING_METHOD = method_name;
		},

		loadData : function (inputData, element_id){
			try {
				WebPagingTag.setPagingTag(inputData, element_id);
			} catch (e) {
				kbstar.alert("WebTag.loadData error : "+e);
			}
		},

		loadDataDirect : function (inputData){
			try {
				var attrVal = $("#_paging").attr("data-quics");
				var _quicsjson = JSON.parse(attrVal);
				var element_id = _quicsjson["paging"];

				var $jsonData = inputData.data.msg;
				var decodeObj = $jsonData.servicedata;
				// List DataBinding
				var $listData = inputData.data.msg.servicedata[WebPagingTag.PAGING_DATA_LIST_ID];

				if( element_id == WebPagingTag.TAG_PAGING_ID_01 ){
					WebPagingTag.setReadMore("더보기");
					orchestra.DataBinder.quicsArrDataMore($("#"+WebPagingTag.PAGING_DATA_LIST_ID), $listData);

				}else if( element_id == WebPagingTag.TAG_PAGING_ID_03 ){
					WebPagingTag.setReadMore("More");
					orchestra.DataBinder.quicsArrDataMore($("#"+WebPagingTag.PAGING_DATA_LIST_ID), $listData);

				}else if( element_id == WebPagingTag.TAG_PAGING_ID_00 ){						//  피이지번호
					orchestra.DataBinder.quicsArrData($("#"+WebPagingTag.PAGING_DATA_LIST_ID), $listData);

				}else if( element_id == WebPagingTag.TAG_PAGING_ID_04 ){						//  피이지번호Simple
					orchestra.DataBinder.quicsArrData($("#"+WebPagingTag.PAGING_DATA_LIST_ID), $listData);
				}

				$("#"+WebPagingTag.PAGING_DATA_LIST_ID).show();
				WebPagingTag.setPagingTag(decodeObj, element_id);
			} catch (e) {
				kbstar.alert("WebTag.loadDataDitect error : "+e);
			}
		},

		loadDataDirect_itg : function (inputData, pagingId){
			try {
				var attrVal = $("#" + pagingId).attr("data-quics");
				var _quicsjson = JSON.parse(attrVal);
				var element_id = _quicsjson["paging"];

				var $jsonData = inputData.data.msg;
				var decodeObj = $jsonData.servicedata;
				// List DataBinding
				var $listData = inputData.data.msg.servicedata[WebPagingTag.PAGING_DATA_LIST_ID];

				if( element_id == WebPagingTag.TAG_PAGING_ID_01 ){
					WebPagingTag.setReadMore("더보기");
					orchestra.DataBinder.quicsArrDataMore($("#"+WebPagingTag.PAGING_DATA_LIST_ID), $listData);

				}else if( element_id == WebPagingTag.TAG_PAGING_ID_00 ){
					orchestra.DataBinder.quicsArrData($("#"+WebPagingTag.PAGING_DATA_LIST_ID), $listData);

				}else if( element_id == WebPagingTag.TAG_PAGING_ID_03 ){
					WebPagingTag.setReadMore("More");
					orchestra.DataBinder.quicsArrDataMore($("#"+WebPagingTag.PAGING_DATA_LIST_ID), $listData);
				}

				$("#"+WebPagingTag.PAGING_DATA_LIST_ID).show();
				WebPagingTag.setPagingTag_itg(decodeObj, element_id, pagingId);
			} catch (e) {
				kbstar.alert("WebTag.loadDataDitect error : "+e);
			}
		},

		loadDataDirect_itg2 : function (inputData, pagingId){
			try {
				var attrVal = $("#" + pagingId).attr("data-quics");
				var _quicsjson = JSON.parse(attrVal);
				var element_id = _quicsjson["paging"];

				var $jsonData = inputData.data.msg;
				var decodeObj = $jsonData.servicedata;
				// List DataBinding
				var $listData = inputData.data.msg.servicedata[WebPagingTag.PAGING_DATA_LIST_ID];

				if( element_id == WebPagingTag.TAG_PAGING_ID_01 ){
					WebPagingTag.setReadMore("더보기");
					orchestra.DataBinder.quicsArrDataMore($("#"+WebPagingTag.PAGING_DATA_LIST_ID), $listData);

				}else if( element_id == WebPagingTag.TAG_PAGING_ID_00 ){
					orchestra.DataBinder.quicsArrData($("#"+WebPagingTag.PAGING_DATA_LIST_ID), $listData);

				}else if( element_id == WebPagingTag.TAG_PAGING_ID_03 ){
					WebPagingTag.setReadMore("More");
					orchestra.DataBinder.quicsArrDataMore($("#"+WebPagingTag.PAGING_DATA_LIST_ID), $listData);
				}

				$("#"+WebPagingTag.PAGING_DATA_LIST_ID).show();
				WebPagingTag.setPagingTag_itg2(decodeObj, element_id, pagingId);
			} catch (e) {
				kbstar.alert("WebTag.loadDataDitect error : "+e);
			}
		},

		setPagingTag : function(inputData, element_id) {
			var _targetElement = null;	  //  태그 대상 element
			try {
				_targetElement = $("#" + "_paging");

				if( element_id == WebPagingTag.TAG_PAGING_ID_00 ){					//  페이지심플
					_targetElement.html(WebPagingTag.getPagingDataSimple(inputData));

				}else if( element_id == WebPagingTag.TAG_PAGING_ID_01 ){			//  더보기
					WebPagingTag.setReadMore("더보기");
					_targetElement.html(WebPagingTag.getPagingNextData(inputData));

				}else if( element_id == WebPagingTag.TAG_PAGING_ID_03 ){			//  더보기 다국어
					WebPagingTag.setReadMore("More");
					_targetElement.html(WebPagingTag.getPagingNextData(inputData));

				}else if( element_id == WebPagingTag.TAG_PAGING_ID_04 ){			//  페이지번호
					_targetElement.html(WebPagingTag.getPagingData(inputData));
				}

			}catch(e){
				kbstar.alert("WebPagingTag.setPagingTag error : "+e);
			};
		},

		setPagingTag_itg : function(inputData, element_id, pagingId) {
			var _targetElement = null;	//태그 대상 element
			try {
				_targetElement = $("#" + pagingId);
				if(element_id == WebPagingTag.TAG_PAGING_ID_00 ){				// 페이지심플
					_targetElement.html(WebPagingTag.getPagingDataSimple(inputData));

				}else if(element_id == WebPagingTag.TAG_PAGING_ID_01 ){			// 더보기
					WebPagingTag.setReadMore("더보기");
					_targetElement.html(WebPagingTag.getPagingNextData(inputData));

				}else if(element_id == WebPagingTag.TAG_PAGING_ID_03 ){			// 더보기 다국어
					WebPagingTag.setReadMore("More");
					_targetElement.html(WebPagingTag.getPagingNextData(inputData));

				}else if( element_id == WebPagingTag.TAG_PAGING_ID_04 ){		//  페이지번호
					_targetElement.html(WebPagingTag.getPagingData(inputData));
				}

			}catch(e){
				kbstar.alert("WebPagingTag.setPagingTag error : "+e);
			};
		},

		setPagingTag_itg2 : function(inputData, element_id, pagingId) {
			var _targetElement = null;	//태그 대상 element
			try {
				_targetElement = $("#" + pagingId);
				if( element_id == WebPagingTag.TAG_PAGING_ID_00 ){ 			// 페이지번호
					_targetElement.html(WebPagingTag.getPagingDataSimple(inputData));

				}else if( element_id == WebPagingTag.TAG_PAGING_ID_01 ){	// 더보기
					WebPagingTag.setReadMore("더보기");
					_targetElement.html(WebPagingTag.getPagingNextData(inputData));
					//_targetElement.html(WebPagingTag.getPagingNextData_itg(inputData, pagingId));

				}else if( element_id == WebPagingTag.TAG_PAGING_ID_03 ){	// 더보기
					WebPagingTag.setReadMore("More");
					_targetElement.html(WebPagingTag.getPagingNextData(inputData));
					//_targetElement.html(WebPagingTag.getPagingNextData_itg(inputData, pagingId));
				}

			}catch(e){
				kbstar.alert("WebPagingTag.setPagingTag error : "+e);
			};
		},

		evl : function(param, defaultValue) {
			if(typeof param == "undefined" || param == "" || param == null) {
				return defaultValue;
			} else {
				return param;
			}
		},

		getPagingData : function(jsondata) {
			var tagSrc = "";

			var m_intViewPage = 1;
			var m_intListCount = 5; // 5개 고정
			var m_intTotalRow = 0;
			var m_intRowCount = 10;
			var m_strMethod = "";

			var m_strFirst = "";
			var m_strPrev = "";
			var m_strNext = "";
			var m_strLast = "";

			var intTotPage=0;	// 전체페이지갯수
			var intStartPage=0;	// 페이지리스트를 시작할 페이지번호
			var intEndPage=0;	// 페이지리스트가 끝나는 페이지번호

			m_intTotalRow = parseInt(jsondata.q_totalRow, 10);
			m_intViewPage = parseInt(jsondata.q_viewPage, 10);
			m_intRowCount = parseInt(jsondata.q_rowCount, 10);

			// 페이지 리스트를 시작할 페이지 계산.
			intStartPage = parseInt((m_intViewPage - 1) / m_intListCount);
			intStartPage = (intStartPage * m_intListCount) + 1;

			if (intStartPage % m_intListCount == 0)
				intStartPage = intStartPage - m_intListCount + 1;

			// 전체 페이지 계산.
			intTotPage = WebPagingTag.getTotalPage(m_intTotalRow, m_intRowCount);

			// 페이지 리스트가 끝나는 페이지 계산.
			intEndPage = (intTotPage >= (m_intListCount + intStartPage)) ? intStartPage + m_intListCount - 1 : intStartPage + (intTotPage - intStartPage);

			if (m_intViewPage <= 0)	 m_intViewPage = 1;
			if (m_intRowCount <= 0)	 m_intRowCount = 10;
			if (m_intListCount <= 0)	 m_intListCount = 5; // 5개 고정

			if( WebPagingTag.PAGING_METHOD == "" ){
				m_strMethod = "window.SPA_COMMON.callbackWithSPA";
			}else{
				m_strMethod = WebPagingTag.PAGING_METHOD;
			}

			if (m_strFirst == "")		 m_strFirst = "페이지 처음";
			if (m_strPrev == "")		m_strPrev = "이전 페이지";
			if (m_strNext == "")		m_strNext = "다음 페이지";
			if (m_strLast == "")		m_strLast = "페이지 마지막";

			// 첫번째 페이지(리스트)로 이동 : |◀
			// <a href="javascript:gotoPage(1);">|◀</a>
			if (intStartPage > m_intListCount && m_strFirst != "") {
				tagSrc += "<a class=\"first on\" href=\"javascript:";
				tagSrc += m_strMethod;
				if( WebPagingTag.PAGING_METHOD == "" ){
					tagSrc += "('gotoPage', 1 );\"><span>처음</span></a>";
				}else{
					tagSrc += "(1);\"><span>처음</span></a>";
				}
			}

			// 이전 페이지 리스트로 이동 : ◀
			// <a href="javascript:gotoPage(11);">◀</a>--16 - 5 = 11
			if (intStartPage > m_intListCount) {
				tagSrc +="<a class=\"prev on\" href=\"javascript:";
				tagSrc += m_strMethod;
				if( WebPagingTag.PAGING_METHOD == "" ){
					tagSrc += "('gotoPage', "+(intStartPage - m_intListCount)+" );\"><span>이전</span></a>";
				}else{
					tagSrc += "("+(intStartPage - m_intListCount)+");\"><span>이전</span></a>";
				}
			}

			// 해당 페이지로 이동 : [16][17][18][19][20] -- 현재페이지 = 17
			for (var i = intStartPage; i <= intEndPage; i++) {
				if(i == intStartPage) {
					tagSrc += " <span class=\"pagenum\">";
				}

				if(m_intViewPage == i) {
					tagSrc +="<a title=\"현재페이지\" class=\"active\" href=\"javascript:";
				} else {
					tagSrc +="<a href=\"javascript:";
				}
				tagSrc += m_strMethod;

				if( WebPagingTag.PAGING_METHOD == "" ){
					tagSrc += "('gotoPage', "+i+" );\">"+i+"</a>\r\n";
				}else{
					tagSrc += "("+i+");\">"+i+"</a>\r\n";
				}

				if(i == intEndPage) {
					tagSrc += "</span> ";
				}
			}
			// 다음 페이지 리스트로 이동 : ▶
			// <a href="javascript:gotoPage(21);">▶</a>--16 + 5 = 21
			if (intTotPage > intEndPage) {

				tagSrc +="<a class=\"next on\" href=\"javascript:";
				tagSrc += m_strMethod;
				if( WebPagingTag.PAGING_METHOD == "" ){
					tagSrc += "('gotoPage', "+(intStartPage + m_intListCount)+" );\"><span>다음</span></a>";
				}else{
					tagSrc += "("+(intStartPage + m_intListCount)+");\"><span>다음</span></a>";
				}
			}

			// 마지막 페이지 리스트로 이동 : ▶|
			// <a href="javascript:gotoPage(41);">▶|</a>--intTotPage
			if (intTotPage > intEndPage && m_strLast != "") {
				tagSrc += "<a class=\"end on\" href=\"javascript:";
				tagSrc += m_strMethod;

				if( WebPagingTag.PAGING_METHOD == "" ){
					tagSrc += "('gotoPage', "+intTotPage+" );\"><span>끝</span></a>";
				}else{
					tagSrc += "(" + intTotPage + ");\"><span>끝</span></a>";
				}
			}
			return tagSrc;
		},

		getPagingDataSimple : function(jsondata) {
			var tagSrc = "";	//  StringBuffer

			var m_intViewPage   = 1;
			var m_intListCount  = 1;		// 1개 고정
			var m_intTotalRow   = 0;
			var m_intRowCount   = 10;
			var m_strMethod	 = "";

			var m_strFirst  = "";
			var m_strPrev   = "";
			var m_strNext   = "";
			var m_strLast   = "";

			var intTotPage  =0;		// 전체페이지갯수
			var intStartPage=0;	 // 페이지리스트가 시작할 페이지번호
			var intEndPage  =0;	 // 페이지리스트가 끝나는 페이지번호

			m_intTotalRow = parseInt(jsondata.q_totalRow, 10);		//	총페이지
			m_intViewPage = parseInt(jsondata.q_viewPage, 10);		//	현재페이지
			m_intRowCount = parseInt(jsondata.q_rowCount, 10);		//	페이지에 보여줄 레코드수

			//	페이지 리스트를 시작할 페이지 계산.
			intStartPage = parseInt((m_intViewPage - 1) / m_intListCount);
			intStartPage = (intStartPage * m_intListCount) + 1;

			if( intStartPage % m_intListCount == 0 ){
				intStartPage = intStartPage - m_intListCount + 1;
			}

			//  전체 페이지 계산.
			intTotPage = WebPagingTag.getTotalPage(m_intTotalRow, m_intRowCount);

			//  페이지 리스트가 끝나는 페이지 계산.
			intEndPage = (intTotPage >= (m_intListCount + intStartPage)) ? intStartPage + m_intListCount - 1 : intStartPage + (intTotPage - intStartPage);

			if( m_intViewPage <= 0 )	m_intViewPage	= 1;
			if( m_intRowCount <= 0 )	m_intRowCount	= 10;
			if( m_intListCount <= 0)	m_intListCount	= 1;	//	1개 고정

			if( WebPagingTag.PAGING_METHOD == "" )
				m_strMethod = "window.SPA_COMMON.callbackWithSPA";
			else
				m_strMethod = WebPagingTag.PAGING_METHOD;

			if( m_strFirst == "")   m_strFirst = "페이지 처음";
			if( m_strPrev == "" )   m_strPrev  = "이전 페이지";
			if( m_strNext == "" )   m_strNext  = "다음 페이지";
			if( m_strLast == "" )   m_strLast  = "페이지 마지막";

			tagSrc += "<div class=\"paging\">";
			//  첫번째 페이지(리스트)로 이동 : |◀
			//  <a href="javascript:gotoPage(1);">|◀</a>
			if( intStartPage > m_intListCount && m_strFirst != "" ){
				tagSrc += "<a class=\"first on\" href=\"javascript:";
				tagSrc += m_strMethod;
				if( WebPagingTag.PAGING_METHOD == "" ){
					tagSrc += "('gotoPage', '1' );\"><span>처음</span></a> ";
				}else{
					tagSrc += "(1);\"><span>처음</span> </a> ";
				}
			}

			//  이전 페이지 리스트로 이동 : ◀
			//  <a href="javascript:gotoPage(15);">◀</a>--16 - 1 = 15
			if( intStartPage > m_intListCount ){
				tagSrc +="<a class=\"prev on\" href=\"javascript:";
				tagSrc += m_strMethod;
				if( WebPagingTag.PAGING_METHOD == "" ){
					tagSrc += "('gotoPage', "+(intStartPage - m_intListCount)+" );\"><span>이전</span></a> ";
				}else{
					tagSrc += "("+(intStartPage - m_intListCount)+");\"><span>이전</span></a>";
				}
			}

			//  페이지리스트정보 ex) 3/10
//			tagSrc += " <span class=\"pagenum\">" +m_intViewPage+ " / " + intTotPage +  "</span> ";
			tagSrc += "<span class=\"curr\"><em>현재 페이지</em>" + m_intViewPage+ "<span class=\"total\"><em>전체 페이지</em>" + intTotPage +  "</span> ";

			// 다음 페이지 리스트로 이동 : ▶
			// <a href="javascript:gotoPage(17);">▶</a>--16 + 1 = 17
			if( intTotPage > intEndPage ){
				tagSrc +="<a class=\"next on\" href=\"javascript:";
				tagSrc += m_strMethod;
				if( WebPagingTag.PAGING_METHOD == "" ){
					tagSrc += "('gotoPage', "+(intStartPage + m_intListCount)+" );\"><span>다음</span></a> ";
				}else{
					tagSrc += "("+(intStartPage + m_intListCount)+");\"><span>다음</span></a>";
				}
			}

			// 마지막 페이지 리스트로 이동 : ▶|
			// <a href="javascript:gotoPage(41);">▶|</a>--intTotPage
			if (intTotPage > intEndPage && m_strLast != "") {
				tagSrc += " <a class=\"end on\" href=\"javascript:";
				tagSrc += m_strMethod;
				if( WebPagingTag.PAGING_METHOD == "" ){
					tagSrc += "('gotoPage', "+intTotPage+" );\"><span>끝</span></a> ";
				}else{
					tagSrc += "(" + intTotPage + ");\"><span>끝</span></a>";
				}
			}
			tagSrc += "</div>";

			return tagSrc;
		},

		getPagingNextData : function(jsondata) {
			var tagSrc = "";
			var m_intViewPage = 1;
			var m_intListCount = 5;// 5개 고정
			var m_intTotalRow = 0;
			var m_intRowCount = 10;
			var m_strMethod = "";

			var m_strFirst = "";
			var m_strPrev = "";
			var m_strNext = "";
			var m_strLast = "";

			var intTotPage=0;	// 전체페이지갯수
			var intStartPage=0;	// 페이지리스트를 시작할 페이지번호

			m_intTotalRow = parseInt(jsondata.q_totalRow, 10);
			m_intViewPage = parseInt(jsondata.q_viewPage, 10);
			m_intRowCount = parseInt(jsondata.q_rowCount, 10);

			// 페이지 리스트를 시작할 페이지 계산.
			intStartPage = parseInt((m_intViewPage - 1) / m_intListCount);
			intStartPage = (intStartPage * m_intListCount) + 1;

			if (intStartPage % m_intListCount == 0)
				intStartPage = intStartPage - m_intListCount + 1;

			// 전체 페이지 계산.
			intTotPage = WebPagingTag.getTotalPage(m_intTotalRow, m_intRowCount);

			if (m_intViewPage <= 0)	 m_intViewPage = 1;
			if (m_intRowCount <= 0)	 m_intRowCount = 10;
			if (m_intListCount <= 0)	 m_intListCount = 5;// 5개 고정

			if( WebPagingTag.PAGING_METHOD == "" )
				m_strMethod = "window.SPA_COMMON.callbackWithSPA";
			else
				m_strMethod = WebPagingTag.PAGING_METHOD;

			if(m_intViewPage<intTotPage) {
				tagSrc += "<div class=\"btn_list_btm more\"><button type=\"button\" class=\"btn\" onclick=\"javascript:";
				tagSrc += m_strMethod;

				if( WebPagingTag.PAGING_METHOD == "" ){
					tagSrc += "('gotoPage', "+(m_intViewPage+1)+" );\" >";
				}else{
					tagSrc += "(" + (m_intViewPage+1) + ");\" >";
				}

				tagSrc += "더보기</button></div>";
				//tagSrc += "더보기<em class=\"num\" ><em aria-hidden=\"true\">(<em class=\"curr\">"+ m_intViewPage +"</em>/<em class=\"total\">"+intTotPage + "</em>)</em></em></button></div>";
				//tagSrc += "더보기</button></div>";
			}
			return tagSrc;
		},

		getPagingNextData_itg : function(jsondata, pagingId) {
			var tagSrc = "";
			var m_intViewPage = 1;
			var m_intListCount = 5;// 5개 고정
			var m_intTotalRow = 0;
			var m_intRowCount = 10;
			var m_strMethod = "";

			var m_strFirst = "";
			var m_strPrev = "";
			var m_strNext = "";
			var m_strLast = "";

			var intTotPage=0;	// 전체페이지갯수
			var intStartPage=0;	// 페이지리스트를 시작할 페이지번호

			m_intTotalRow = parseInt(jsondata.q_totalRow, 10);
			m_intViewPage = parseInt(jsondata.q_viewPage, 10);
			m_intRowCount = parseInt(jsondata.q_rowCount, 10);

			// 페이지 리스트를 시작할 페이지 계산.
			intStartPage = parseInt((m_intViewPage - 1) / m_intListCount);
			intStartPage = (intStartPage * m_intListCount) + 1;

			if (intStartPage % m_intListCount == 0)
				intStartPage = intStartPage - m_intListCount + 1;

			// 전체 페이지 계산.
			intTotPage = WebPagingTag.getTotalPage(m_intTotalRow, m_intRowCount);
			if (m_intViewPage <= 0)	 m_intViewPage = 1;
			if (m_intRowCount <= 0)	 m_intRowCount = 10;
			if (m_intListCount <= 0)	 m_intListCount = 5;// 5개 고정

			if (WebPagingTag.PAGING_METHOD == "")
				m_strMethod = "window.SPA_COMMON.callbackWithSPA";
			else
				m_strMethod = WebPagingTag.PAGING_METHOD;

			if (m_strFirst == "")		 m_strFirst = "페이지 처음";
			if (m_strPrev == "")		m_strPrev = "이전 페이지";
			if (m_strNext == "")		m_strNext = "다음 페이지";
			if (m_strLast == "")		m_strLast = "페이지 마지막";
			if(m_intViewPage<intTotPage) {
				tagSrc += "<div class=\"list_more list_more_v1\"><div class=\"lcon\"><a href=\"javascript:";
				tagSrc += m_strMethod;
				if( WebPagingTag.PAGING_METHOD == "" ){
					tagSrc += "('gotoPage', "+(m_intViewPage+1)+" );\" >";
				}else{
					tagSrc += "(" + (m_intViewPage+1) + ");\" >";
				}
				tagSrc += "<span class=\"hide\">목록</span><span class='btnMore'>"+WebPagingTag.READMORE+"</span></a></div>";
				tagSrc += "<div class=\"rcon\"><a href=\"javascript:;\" id=\"btnPeriodSet" + pagingId.substring(pagingId.length-1)+ "\" class=\"btn07 btn_period_set\" aria-expanded=\"false\">기간설정</a></div></div>";
			} else {
				tagSrc += "<div class=\"list_more list_more_v1\">";
				tagSrc += "<div class=\"rcon\"><button type=\"button\" class=\"btn_period_set2\" id=\"btnPeriodSet" + pagingId.substring(pagingId.length-1)+ "\" aria-expanded=\"false\">기간설정</button></div></div>";
			}
			return tagSrc;
		},

		getTotalPage : function(totalRow, rowCount) {
			if (rowCount == 0)	rowCount = 1;
			return parseInt(totalRow/rowCount) + (parseInt(totalRow % rowCount) > 0 ? 1: 0);
		},

		setReadMore : function(_readMore){
			WebPagingTag.READMORE = _readMore;
		}
	};
}();


//##################################################################################
//	태그 템플릿 HTML
//##################################################################################
var WebTagContents = {
//##############################################################################
//	NEW 스뱅용 태그
//##############################################################################
		//	이메일 태그
		WEBEmailTag_MNBANK : function(){
			var tagContents = '';

			tagContents += '<div class="form_group email" id="@@~~DIV_EMAIL_ID~~@@">\n';
//			tagContents += '	<div class="form_tit">이메일주소</div>\n';
			tagContents += '	<div class="form_row col">\n';
			tagContents += '		<div class="input">\n';
			tagContents += '			<input type="text" title="ID" placeholder="아이디" id="@@~~TXT_EMAIL_ID~~@@" name="@@~~TXT_EMAIL_ID~~@@" value="@@~~DEF_EMAIL_VAL1~~@@" onclick="caq.tag.setFullEmail_MNBANK( \'@@~~SEL_EMAILADDR_ID~~@@\', \'@@~~TXT_EMAIL_ID~~@@\', \'@@~~TXT_EMAILADDR_ID~~@@\', \'@@~~TXT_FULLEMAIL_ID~~@@\' );" onkeyup="caq.util.formInputControl(\'@@~~TXT_EMAIL_ID~~@@\',5); caq.tag.setFullEmail_MNBANK( \'@@~~SEL_EMAILADDR_ID~~@@\', \'@@~~TXT_EMAIL_ID~~@@\', \'@@~~TXT_EMAILADDR_ID~~@@\', \'@@~~TXT_FULLEMAIL_ID~~@@\' );" />\n';
			tagContents += '		</div>\n';
			tagContents += '		<span class="space">@</span>\n';
			tagContents += '		<div class="select">\n';
			tagContents += '			<button type="button" class="select_btn active" title="도메인 선택" id="@@~~SEL_EMAILADDR_ID~~@@" onclick="caq.tag.setEmailSelectData_MNBANK( \'@@~~SEL_EMAILADDR_ID~~@@\',\'@@~~TXT_EMAIL_ID~~@@\',\'@@~~TXT_EMAILADDR_ID~~@@\',\'@@~~TXT_FULLEMAIL_ID~~@@\', \'@@~~NO_EMAIL_ID~~@@\' ); caq.tag.setFullEmail_MNBANK( \'@@~~SEL_EMAILADDR_ID~~@@\', \'@@~~TXT_EMAIL_ID~~@@\', \'@@~~TXT_EMAILADDR_ID~~@@\', \'@@~~TXT_FULLEMAIL_ID~~@@\' );" >@@~~DEF_EMAIL_VAL2~~@@</button>\n';
			tagContents += '		</div>\n';
			tagContents += '	</div>\n';
			tagContents += '	<div class="form_row" id="selfInput" style="display: none">\n';
			tagContents += '		<div class="input">\n';
			tagContents += '			<input type="text" value="@@~~DEF_EMAIL_VAL2~~@@" title="도메인 직접입력" id="@@~~TXT_EMAILADDR_ID~~@@" name="@@~~TXT_EMAILADDR_ID~~@@" onkeyup="caq.tag.setFullEmail_MNBANK( \'@@~~SEL_EMAILADDR_ID~~@@\', \'@@~~TXT_EMAIL_ID~~@@\', \'@@~~TXT_EMAILADDR_ID~~@@\', \'@@~~TXT_FULLEMAIL_ID~~@@\' )">\n';
			tagContents += '		</div>\n';
			tagContents += '	</div>\n';
			tagContents += '	<div class="form_btm_wrap" style="display: @@~~NO_EMAIL~~@@">\n';
			tagContents += '		<span class="selection sm">\n';
			tagContents += '			<input type="checkbox" id="@@~~NO_EMAIL_ID~~@@" onclick="caq.tag.noEmail_MNBANK( \'@@~~SEL_EMAILADDR_ID~~@@\',\'@@~~TXT_EMAIL_ID~~@@\',\'@@~~TXT_EMAILADDR_ID~~@@\',\'@@~~TXT_FULLEMAIL_ID~~@@\', \'@@~~NO_EMAIL_ID~~@@\' )" />\n';
			tagContents += '			<label for="@@~~NO_EMAIL_ID~~@@" class="label"><em>이메일 없음</em></label>\n';
			tagContents += '		</span>\n';
			tagContents += '	</div>\n';
			tagContents += '	<input type="hidden" id="@@~~TXT_FULLEMAIL_ID~~@@" name="@@~~TXT_FULLEMAIL_ID~~@@" value="@@~~DEF_EMAIL_VAL~~@@"/>\n';
			tagContents += '</div>';

			return tagContents;
		},

		//	전화번호 태그
		WEBPhoneTag_MNBANK : function(){
			var tagContents = '';

			tagContents += '<div class="form_group tel" id="@@~~DIV_PHONE~~@@">\n';
//			tagContents += '  	<div class="form_tit">휴대폰</div>\n';
			tagContents += '	<div class="form_row col">\n';
			tagContents += '		<div class="select">\n';
			tagContents += '			<button type="button" class="select_btn number active" title="@@~~TITLE_PHONE_TEXT~~@@앞자리 선택" id="@@~~SEL_PHONE1_ID~~@@" onclick="caq.tag.setPhoneSelectData_MNBANK( \'@@~~SEL_PHONE1_ID~~@@\', \'@@~~TXT_PHONE1_ID~~@@\', \'@@~~TXT_PHONE2_ID~~@@\',\'@@~~HID_PHONE_ID~~@@\', \'@@~~PHONE_MODE~~@@\', \'@@~~NO_PHONE_ID~~@@\' );caq.tag.setFullPhone_MNBANK( \'@@~~TXT_PHONE1_ID~~@@\', \'@@~~TXT_PHONE2_ID~~@@\',\'@@~~HID_PHONE_ID~~@@\' );">@@~~DEF_PHONE1_VAL~~@@</button>\n';
			tagContents += '		</div>\n';
			tagContents += '		<div class="input">\n';
			tagContents += '			<input type="@@~~TYPE_PHONE2~~@@" title="@@~~TITLE_PHONE_TEXT~~@@국번일련번호" id="@@~~TXT_PHONE2_ID~~@@" name="@@~~TXT_PHONE2_ID~~@@" maxlength="8" value="@@~~DEF_PHONE2_VAL~~@@" onkeyup="caq.util.formInputControl( \'@@~~TXT_PHONE2_ID~~@@\' ,1 );caq.tag.setFullPhone_MNBANK( \'@@~~TXT_PHONE1_ID~~@@\', \'@@~~TXT_PHONE2_ID~~@@\',\'@@~~HID_PHONE_ID~~@@\' )" />\n';
			tagContents += '		</div>\n';
			tagContents += '	</div>\n';
			tagContents += '	<div class="form_btm_wrap" style="display: @@~~NO_PHONE~~@@">\n';
			tagContents += '		<span class="selection sm">\n';
			tagContents += '			<input type="checkbox" id="@@~~NO_PHONE_ID~~@@" onclick="caq.tag.noPhone_MNBANK( \'@@~~SEL_PHONE1_ID~~@@\', \'@@~~TXT_PHONE1_ID~~@@\', \'@@~~TXT_PHONE2_ID~~@@\',\'@@~~HID_PHONE_ID~~@@\', \'@@~~NO_PHONE_ID~~@@\', \'@@~~PHONE_MODE~~@@\' );" >\n';
			tagContents += '			<label for="@@~~NO_PHONE_ID~~@@" class="label"><em>@@~~NO_PHONE_TEXT~~@@</em></label>\n';
			tagContents += '		</span>\n';
			tagContents += '	</div>\n';
			tagContents += '	<input type="hidden" id="@@~~TXT_PHONE1_ID~~@@" name="@@~~TXT_PHONE1_ID~~@@" value="@@~~DEF_PHONE1_VAL~~@@" />\n';
			tagContents += '	<input type="hidden" id="@@~~HID_PHONE_ID~~@@" name="@@~~HID_PHONE_ID~~@@" value="@@~~DEF_PHONE_VAL~~@@" />\n';
			tagContents += '</div>';

			return tagContents;
		},

		//	달력태그
		CalendarTag_InputType_MNBANK : function(){
			var tagContents = '';
			tagContents += '<div class="input date">	\n';
			tagContents += '	<input type="tel" maxlength="8" title="@@~~DEF_TITLE_VAL~~@@" placeholder="@@~~DEF_TITLE_VAL~~@@" id="@@~~INPUT_DATE~~@@" name="@@~~INPUT_DATE~~@@" value="@@~~DEF_YMD_VAL~~@@" onblur="caq.onDateInputChangedBlur(this, \'KOR\');" onfocus="this.value=this.value.replace(/[^0-9]/g, \'\');" onkeyup="caq.onDateInputChangedKeyUp(this, \'KOR\');" title="@@~~DEF_TITLE_VAL~~@@" />	\n';
			tagContents += '	<button type="button" class="btn_cal" id="btn_@@~~INPUT_DATE~~@@" onclick="caq.tag.openCalendarLayerPop(\'KOR\',\'@@~~CALENDAR_POPUP_ID~~@@\', \'@@~~INPUT_DATE~~@@\', $(\'#@@~~INPUT_DATE~~@@\').val(), \'true\', \'@@~~CALENDAR_POPUP_ID~~@@-Lyaer\', \'@@~~CALLBACK~~@@\' ); return false;"  >	\n';
			tagContents += '		<span class="hidden" id="@@~~CALENDAR_POPUP_ID~~@@-btn">@@~~DEF_TITLE_VAL~~@@달력</span>	\n';
			tagContents += '	</button>	\n';
			tagContents += '</div>	\n';
			tagContents += '<div id="@@~~CALENDAR_POPUP_ID~~@@-Lyaer" class="layerHTML">	\n';
			tagContents += '</div>	\n';

			return tagContents;
		},
		CalendarTag_InputType_MNBANK_g : function(){
			var tagContents = '';
			tagContents += '<div class="input date">	\n';
			tagContents += '	<input type="tel" maxlength="8" title="@@~~DEF_TITLE_VAL~~@@" placeholder="@@~~DEF_TITLE_VAL~~@@" id="@@~~INPUT_DATE~~@@" name="@@~~INPUT_DATE~~@@" value="@@~~DEF_YMD_VAL~~@@" onblur="caq.onDateInputChangedBlur(this, \'ENG\');" onfocus="this.value=this.value.replace(/[^0-9]/g, \'\');" onkeyup="caq.onDateInputChangedKeyUp(this, \'ENG\');" title="@@~~DEF_TITLE_VAL~~@@" />	\n';
			tagContents += '	<button type="button" class="btn_cal" id="btn_@@~~INPUT_DATE~~@@" onclick="caq.tag.openCalendarLayerPop(\'ENG\',\'@@~~CALENDAR_POPUP_ID~~@@\', \'@@~~INPUT_DATE~~@@\', $(\'#@@~~INPUT_DATE~~@@\').val(), \'true\', \'@@~~CALENDAR_POPUP_ID~~@@-Lyaer\', \'@@~~CALLBACK~~@@\' ); return false;"  >	\n';
			tagContents += '		<span class="hidden" id="@@~~CALENDAR_POPUP_ID~~@@-btn">@@~~DEF_TITLE_VAL~~@@달력</span>	\n';
			tagContents += '	</button>	\n';
			tagContents += '</div>	\n';
			tagContents += '<div id="@@~~CALENDAR_POPUP_ID~~@@-Lyaer" class="layerHTML">	\n';
			tagContents += '</div>	\n';

			return tagContents;
		},

		//	주소태그
		AddressInputTemplate_MNBANK : function(){
			var tagContents = '';

			tagContents += '<div class="form_group address">	\n';
			tagContents += '	<div class="addr_sch">	\n';
			tagContents += '		<button type="button" class="btn point sm round" onclick="@@~~POPUP_OPEN_FUNC~~@@;" >주소검색</button>	\n';
			tagContents += '		<!-- 주소 검색 후 노출 -->	\n';
			tagContents += '		<div class="addr_cts" style="display:none" id="@@~~ZIPCODE~~@@_div" >	\n';
			tagContents += '			<span class="addr_post number" id="@@~~ZIPCODE~~@@_text" >@@~~DEF_ZIPCODE_VAL~~@@</span>	\n';
			tagContents += '			<p id="@@~~ADDR_BSC~~@@_text" >@@~~DEF_ADDR_BSC_VAL~~@@</p>	\n';
			tagContents += '			<p id="@@~~ADDR_DTL~~@@_text" >@@~~DEF_ADDR_DTL_VAL~~@@</p>	\n';
			tagContents += '		</div>	\n';
			tagContents += '		<!-- //주소 검색 후 노출 -->	\n';
			tagContents += '	</div>	\n';
			tagContents += '	<input type="hidden" id="@@~~ZIPCODE~~@@"  name="@@~~ZIPCODE~~@@"  value="@@~~DEF_ZIPCODE_VAL~~@@" />	\n';
			tagContents += '	<input type="hidden" id="@@~~ADDR_BSC~~@@" name="@@~~ADDR_BSC~~@@" value="@@~~DEF_ADDR_BSC_VAL~~@@" />	\n';
			tagContents += '	<input type="hidden" id="@@~~ADDR_DTL~~@@" name="@@~~ADDR_DTL~~@@" value="@@~~DEF_ADDR_DTL_VAL~~@@" />	\n';
			tagContents += '</div>	\n';

			return tagContents;
		},

		//	권유직원 태그 - 한글
		EmpnoInputTemplate_MNBANK : function(){
			var tagContents = '';

			tagContents += '<script type="text/javascript">		\n';
			tagContents += '	function resetSearchBox(){		\n';
			tagContents += '		$("#권유지점코드").val("");		\n';
			tagContents += '		$("#권유부점코드").val("");		\n';
			tagContents += '		$("#권유직원번호").val("");		\n';
			tagContents += '		if( $("#radioCheck_1").is(":checked") == true ){		\n';
			tagContents += '			$("#config_gubun_1").attr("style","display:none");		\n';
			tagContents += '			$("#지점명").val("");		\n';
			tagContents += '			$("#지점명").removeAttr("disabled");		\n';
			tagContents += '		}else if( $("#radioCheck_2").is(":checked") == true ){		\n';
			tagContents += '			$("#config_gubun_2").attr("style","display:none");		\n';
			tagContents += '			$("#직원이름").val("");		\n';
			tagContents += '			$("#직원이름").removeAttr("disabled");		\n';
			tagContents += '		}else if( $("#radioCheck_3").is(":checked") == true ){		\n';
			tagContents += '			$("#config_gubun_3").attr("style","display:none");		\n';
			tagContents += '			$("#직원번호").val("");	\n';
			tagContents += '			$("#직원번호").removeAttr("disabled");		\n';
			tagContents += '		}	\n';
			tagContents += '		return false;	\n';
			tagContents += '	}		\n';
			tagContents += '	function openSolicEmpDotSearchPop(){		\n';
			tagContents += '		var form_name= "@@~~FORM_NAME~~@@";		\n';
			tagContents += '		var openUrl = "";		\n';
			tagContents += '		var param = {};		\n';
			tagContents += '		var empPopRetryMsg = "설정초기화 후 검색해주세요.";		\n';
			tagContents += '		if( $("#radioCheck_1").is(":checked") == true  ){		\n';
			tagContents += '			if($("#지점명").attr("disabled") == "disabled"){		\n';
			tagContents += '				alert(empPopRetryMsg);		\n';
			tagContents += '				return false;		\n';
			tagContents += '			}		\n';
			tagContents += '			openUrl = "/mquics?page=D002264";		\n';
			tagContents += '			if ($("#지점명").val() == "" ){		\n';
			tagContents += '				alert("지점명을 입력해주십시오");		\n';
			tagContents += '				$("#지점명").focus();		\n';
			tagContents += '				return false;		\n';
			tagContents += '			}		\n';
			tagContents += '			param = {"안내부점옵션선택":$("#안내부점옵션선택").val(),"안내부점명":$("#지점명").val(),"방카YN":$("#방카YN").val()}		\n';
			tagContents += '		}else if( $("#radioCheck_2").is(":checked") == true ){		\n';
			tagContents += '			if($("#직원이름").attr("disabled") == "disabled"){		\n';
			tagContents += '				alert(empPopRetryMsg);		\n';
			tagContents += '				return false;		\n';
			tagContents += '			}		\n';
			tagContents += '			openUrl = "/mquics?page=D002265";		\n';
			tagContents += '			if( $("#직원이름").val() == "" ){		\n';
			tagContents += '				alert("직원이름을 입력해주십시오");		\n';
			tagContents += '				$("#직원이름").focus();		\n';
			tagContents += '				return false;		\n';
			tagContents += '			}		\n';
			tagContents += '			param = {"직원선택방법":"4","안내부점명":$("#직원이름").val(),"방카YN":$("#방카YN").val()}		\n';
			tagContents += '		}else if( $("#radioCheck_3").is(":checked") == true ){		\n';
			tagContents += '			if( $("#직원번호").attr("disabled") == "disabled" ){		\n';
			tagContents += '				alert(empPopRetryMsg);		\n';
			tagContents += '				return false;		\n';
			tagContents += '			}		\n';
			tagContents += '			openUrl = "/mquics?page=D002266";		\n';
			tagContents += '			if( $("#직원번호").val() == "" ){		\n';
			tagContents += '				alert("직원번호를 입력해주십시오");		\n';
			tagContents += '				$("#직원번호").focus();		\n';
			tagContents += '				return false;		\n';
			tagContents += '			}		\n';
			tagContents += '			param = {"직원선택방법":"4","직원번호":$("#직원번호").val(),"방카YN":$("#방카YN").val()}		\n';
			tagContents += '		}		\n';
			tagContents += '		window.appManager.openWebViewWithPopup(openUrl,param, popupCallback);		\n';
			tagContents += '		return false;		\n';
			tagContents += '	}		\n';
			tagContents += '	function popupCallback( param ){		\n';
			tagContents += '		var jsonParam;		\n';
			tagContents += '		if( typeof param == "string" ){		\n';
			tagContents += '			jsonParam = JSON.parse(param);		\n';
			tagContents += '		}else if( typeof param == "object" ){		\n';
			tagContents += '			jsonParam = param;		\n';
			tagContents += '		}		\n';
			tagContents += '		if(jsonParam["CANCEL"]!="true") {		\n';
			tagContents += '			if( $("#radioCheck_1").is(":checked") == true ){		\n';
			tagContents += '				$("#config_gubun_1").attr("style","");		\n';
			tagContents += '				$("#지점명").val(jsonParam["안내부점명"]);		\n';
			tagContents += '				$("#지점명").attr("disabled","true");		\n';
			tagContents += '			}else if($("#radioCheck_2").is(":checked") == true ){		\n';
			tagContents += '				$("#config_gubun_2").attr("style","");		\n';
			tagContents += '				$("#직원이름").val(jsonParam["안내부점명"]);		\n';
			tagContents += '				$("#직원이름").attr("disabled","true");		\n';
			tagContents += '			}else if( $("#radioCheck_3").is(":checked") == true ){		\n';
			tagContents += '				$("#config_gubun_3").attr("style","");		\n';
			tagContents += '				$("#직원번호").val(jsonParam["권유직원번호"]);		\n';
			tagContents += '				$("#직원번호").attr("disabled","true");		\n';
			tagContents += '			}		\n';
			tagContents += '			$("#권유지점코드").val(jsonParam["권유지점코드"]);		\n';
			tagContents += '			$("#권유부점코드").val(jsonParam["권유지점코드"]);		\n';
			tagContents += '			$("#권유직원번호").val(jsonParam["권유직원번호"]);		\n';
			tagContents += '		}		\n';
			tagContents += '	}		\n';
			tagContents += '	function clearEmpSelect(){		\n';
			tagContents += '		for( var i=1; i<=4; i++ ){		\n';
			tagContents += '			$("#info_tab" + i).attr("style","display:none");		\n';
			tagContents += '			$("#radioCheck_" + i).attr("check","false");		\n';
			tagContents += '		}		\n';
			tagContents += '	}		\n';
			tagContents += '	function checkSolicEmpValue(){		\n';
			tagContents += '		var f = document.@@~~FORM_NAME~~@@;		\n';
			tagContents += '		if($("#권유구분코드").val()== "1"){		\n';
			tagContents += '			var cnt = 0;		\n';
			tagContents += '			if( typeof f.elements["직원선택직원번호"] == "object" && typeof f.elements["직원선택직원번호"].length == "undefined" ){		\n';
			tagContents += '				if(f.elements["직원선택직원번호"].checked == true){		\n';
			tagContents += '					Empid = f.elements["직원선택직원번호"].value;		\n';
			tagContents += '					Dotcd = f.elements["직원선택지점코드"].value;		\n';
			tagContents += '					$("#권유지점코드").val(Dotcd);		\n';
			tagContents += '					$("#권유부점코드").val(Dotcd);		\n';
			tagContents += '					$("#권유직원번호").val(Empid);		\n';
			tagContents += '					cnt++;		\n';
			tagContents += '				}		\n';
			tagContents += '			}else{		\n';
			tagContents += '				for( var i = 0; i < f.elements["직원선택직원번호"].length; i++ ){		\n';
			tagContents += '					if( f.elements["직원선택직원번호"][i].checked == true ){		\n';
			tagContents += '						Empid = f.elements["직원선택직원번호"][i].value;		\n';
			tagContents += '						Dotcd = f.elements["직원선택지점코드"][i].value;		\n';
			tagContents += '						$("#권유지점코드").val(Dotcd);		\n';
			tagContents += '						$("#권유부점코드").val(Dotcd);		\n';
			tagContents += '						$("#권유직원번호").val(Empid);		\n';
			tagContents += '						cnt++;		\n';
			tagContents += '						break;		\n';
			tagContents += '					}		\n';
			tagContents += '				}		\n';
			tagContents += '			}		\n';
			tagContents += '			if( cnt == 0 ){		\n';
			tagContents += '				alert("고객님의 상품 가입에 가장 도움이 된 직원을 선택해주시기 바랍니다.\\n없을 경우 “없음”을 선택해주십시오.");		\n';
			tagContents += '				return false;		\n';
			tagContents += '			}		\n';
			tagContents += '		}else if( $("#권유구분코드").val()=="2" ){		\n';
			tagContents += '			if( $("#radioCheck_1").is(":checked") == true ){		\n';
			tagContents += '				if( $("#지점명").val() =="" ){		\n';
			tagContents += '					alert("지점명을 입력해주십시오");		\n';
			tagContents += '					$("#지점명").focus();		\n';
			tagContents += '					return false;		\n';
			tagContents += '				}		\n';
			tagContents += '				if( $("#권유지점코드").val() == "" || $("#권유부점코드").val() == "" || $("#권유직원번호").val() == ""  ){		\n';
			tagContents += '					alert("권유직원 등록이 완료되지 않았습니다.\\n\'검색\'버튼을 누른후 해당직원을 선택해주세요.");		\n';
			tagContents += '					return false;		\n';
			tagContents += '				}		\n';
			tagContents += '			}		\n';
			tagContents += '		}else if( $("#권유구분코드").val()=="4" ){		\n';
			tagContents += '			if( $("#radioCheck_2").is(":checked") == true ){		\n';
			tagContents += '				if( $("#직원이름").val() =="" ){		\n';
			tagContents += '					alert("직원이름을 입력해주십시오");		\n';
			tagContents += '					$("#직원이름").focus();		\n';
			tagContents += '					return false;		\n';
			tagContents += '				}		\n';
			tagContents += '				if( $("#권유지점코드").val() == "" || $("#권유부점코드").val() == "" || $("#권유직원번호").val() == "" ){		\n';
			tagContents += '					alert("권유직원 등록이 완료되지 않았습니다.\\n\'검색\'버튼을 누른후 해당직원을 선택해주세요.");		\n';
			tagContents += '					return false;		\n';
			tagContents += '				}		\n';
			tagContents += '			}else{		\n';
			tagContents += '				if( $("#직원번호").val() =="" ){		\n';
			tagContents += '					alert("직원번호를 입력해주십시오");		\n';
			tagContents += '					$("#직원번호").focus();		\n';
			tagContents += '					return false;		\n';
			tagContents += '				}		\n';
			tagContents += '				if( !/\\d+$/.test($("#직원번호").val()) ){		\n';
			tagContents += '					alert("직원번호는 숫자만 입력해주십시오");		\n';
			tagContents += '					$("#직원번호").focus();		\n';
			tagContents += '					return false;		\n';
			tagContents += '				}		\n';
			tagContents += '				if( $("#권유직원번호").val() == "" ){		\n';
			tagContents += '					alert("권유직원 등록이 완료되지 않았습니다.\\n\'검색\'버튼을 누른후 해당직원을 선택해주세요.");		\n';
			tagContents += '					return false;		\n';
			tagContents += '				}		\n';
			tagContents += '				$("#권유직원번호").val($("#직원번호").val());		\n';
			tagContents += '			}		\n';
			tagContents += '		}else if( $("#권유구분코드").val()== "3" ){		\n';
			tagContents += '			$("#권유지점코드").val("");		\n';
			tagContents += '			$("#권유부점코드").val("");		\n';
			tagContents += '			$("#권유직원번호").val("");		\n';
			tagContents += '		}		\n';
			tagContents += '		return true;		\n';
			tagContents += '	}		\n';
			tagContents += '	function choice(idx){		\n';
			tagContents += '		var f = document.@@~~FORM_NAME~~@@;		\n';
			tagContents += '		$("#권유지점코드").val("");		\n';
			tagContents += '		$("#권유부점코드").val("");		\n';
			tagContents += '		$("#권유직원번호").val("");		\n';
			tagContents += '		if( idx == 0 ){		\n';
			tagContents += '			for( var i=1; i<=4; i++ ){		\n';
			tagContents += '				$("#info_tab" + i).attr("style","display:none");		\n';
			tagContents += '				$("#radioCheck_" + i).attr("check","false");		\n';
			tagContents += '			}		\n';
			tagContents += '			$("#권유구분코드").val("1");		\n';
			tagContents += '		}else{		\n';
			tagContents += '			if( typeof f.elements["직원선택직원번호"] == "object" && typeof f.elements["직원선택직원번호"].length == "undefined" ){		\n';
			tagContents += '				f.elements["직원선택직원번호"].checked = false;		\n';
			tagContents += '			}else{		\n';
			tagContents += '				for( var i = 0; i < f.elements["직원선택직원번호"].length; i++ ){		\n';
			tagContents += '					f.elements["직원선택직원번호"][i].checked = false;		\n';
			tagContents += '				}		\n';
			tagContents += '			}		\n';
			tagContents += '			f.elements["지점명"].value = "";		\n';
			tagContents += '			f.elements["지점명"].disabled = false;		\n';
			tagContents += '			f.elements["직원이름"].value = "";		\n';
			tagContents += '			f.elements["직원이름"].disabled = false;		\n';
			tagContents += '			f.elements["직원번호"].value = "";		\n';
			tagContents += '			f.elements["직원번호"].disabled = false;		\n';
			tagContents += '			$("#config_gubun_1").attr("style","display:none");		\n';
			tagContents += '			$("#config_gubun_2").attr("style","display:none");		\n';
			tagContents += '			$("#config_gubun_3").attr("style","display:none");		\n';
			tagContents += '			for( var i = 0; i < f.elements["직원선택직원번호"].length; i++ ){		\n';
			tagContents += '				f.elements["직원선택직원번호"][i].checked = false;		\n';
			tagContents += '			}		\n';
			tagContents += '			if( idx == 1 ){		\n';
			tagContents += '				$("#권유구분코드").val(2);		\n';
			tagContents += '			}else if(idx == 2){		\n';
			tagContents += '				$("#권유구분코드").val(4);		\n';
			tagContents += '			}else if(idx == 3){		\n';
			tagContents += '				$("#권유구분코드").val(4);		\n';
			tagContents += '			}else if(idx == 4){		\n';
			tagContents += '				$("#권유구분코드").val(3);		\n';
			tagContents += '			}		\n';
			tagContents += '			for( var i=1; i<=4; i++ ){		\n';
			tagContents += '				if( i==idx ){		\n';
			tagContents += '					$("#info_tab" + i).attr("style","");		\n';
			tagContents += '					$("#radioCheck_" + i).attr("check","true");		\n';
			tagContents += '					$("#radioCheck_" + i).prop("check","true");		\n';
			tagContents += '				}else{		\n';
			tagContents += '					$("#info_tab" + i).attr("style","display:none");		\n';
			tagContents += '					$("#radioCheck_" + i).attr("check","false");		\n';
			tagContents += '				}		\n';
			tagContents += '			}		\n';
			tagContents += '		}		\n';
			tagContents += '	}		\n';
			tagContents += '	var empno = {		\n';
			tagContents += '		init:function(){		\n';
			tagContents += '			$("input[name=직원선택직원번호]").each(function(index,elem){		\n';
			tagContents += '				$("input[name=직원선택직원번호]:eq("+index+")").click(function(){		\n';
			tagContents += '					for(var i=1; i<=4; i++) {		\n';
			tagContents += '						$("#info_tab" + i).attr("style","display:none");		\n';
			tagContents += '						$("#radioCheck_" + i).attr("check","false");		\n';
			tagContents += '					}		\n';
			tagContents += '					$("#권유구분코드").val("1");		\n';
			tagContents += '					$("#권유지점코드").val($("input[name=직원선택지점코드]:eq("+index+")").val());		\n';
			tagContents += '					$("#권유부점코드").val($("input[name=직원선택지점코드]:eq("+index+")").val());		\n';
			tagContents += '					$("#권유직원번호").val($("input[name=직원선택직원번호]:eq("+index+")").val());		\n';
			tagContents += '				});		\n';
			tagContents += '			});		\n';
			tagContents += '			choice(0);		\n';
			tagContents += '		}		\n';
			tagContents += '	}		\n';
			tagContents += '	function selectLayerPopupOpen(){		\n';
			tagContents += '		$.ohyLayer({		\n';
			tagContents += '			title:"지점명",		\n';
			tagContents += '			content:"#selectLyaerPopup",		\n';
			tagContents += '			type:"bottom",		\n';
			tagContents += '			scroll:true,		\n';
			tagContents += '			height:150,		\n';
			tagContents += '			closeUse:true		\n';
			tagContents += '		});		\n';
			tagContents += '	}		\n';
			tagContents += '	function selectBbrn(){		\n';
			tagContents += '		var param	= [];		\n';
			tagContents += '		param.push({title: "지점명"	,value: "1" });		\n';
			tagContents += '		param.push({title: "지역명 (시,구,군,읍,면,동)"	,value: "2" });		\n';
			tagContents += '		var sussCallBackBbrn = function(datas){		\n';
			tagContents += '			var tempName = ""	\n';
			tagContents += '			if( datas[0].value == 1){	\n';
			tagContents += '				tempName = "지점명"	\n';
			tagContents += '			}else{	\n';
			tagContents += '				tempName = "지역명"	\n';
			tagContents += '			}	\n';
			tagContents += '			$("#지점명").attr("placeholder",tempName);	\n';
			tagContents += '			$("#selectButtonId").text( datas[0].title );		\n';
			tagContents += '			$("#안내부점옵션선택").val( datas[0].value );		\n';
			tagContents += '		}		\n';
			tagContents += '		var value = $("#안내부점옵션선택").val();		\n';
			tagContents += '		BottomSheet.simplePickerBottomSheet("지점명", "", value , param, sussCallBackBbrn);		\n';
			tagContents += '	}		\n';
			tagContents += '</script>		\n';
			tagContents += '<input type="hidden" name="권유직원번호" id="권유직원번호" value="" />		\n';
			tagContents += '<input type="hidden" name="권유지점코드" id="권유지점코드" value="" />		\n';
			tagContents += '<input type="hidden" name="권유부점코드" id="권유부점코드" value="" />		\n';
			tagContents += '<input type="hidden" name="권유구분코드" id="권유구분코드" value="" />		\n';

			tagContents += '<div class="staff_hope">	\n';

			tagContents += '	<div data-quics=\'{"start":"if"}\'>	\n';
			tagContents += '		<div data-quics=\'{"if":"servicedata.totalrow!=0  && servicedata.totalrow!=undefined"}\'>	\n';
			tagContents += '			<div id="권유직원선택">	\n';
			tagContents += '				<ul class="list_comp check" data-quics=\'{"getList":"ARRAY수_view"}\' style="display: none">	\n';
			tagContents += '					<li>	\n';
			tagContents += '						<span class="selection">	\n';
			tagContents += '							<input type="hidden" id="직원선택지점코드" name="직원선택지점코드" data-quics=\'{"attr":"strDotCd"}\'>	\n';
			tagContents += '							<input type="radio"  id="직원선택직원번호" name="직원선택직원번호" data-quics=\'{"value":"strEmpid"}\' data-wat=\'{"attrString":"title","txtString":"권유직원 %S 선택","keyString":"strEmnm"}\'>	\n';
			tagContents += '							<label for="직원선택직원번호" class="label">	\n';
			tagContents += '								<em>	\n';
			tagContents += '									<span class="staff" data-quics=\'{"attr":"strEmnm"}\' ></span>	\n';
			tagContents += '									<span class="office" data-quics=\'{"attr":"strAreaDotName"}\' ></span>	\n';
			tagContents += '								</em>	\n';
			tagContents += '							</label>	\n';
			tagContents += '						</span>	\n';
			tagContents += '					</li>	\n';
			tagContents += '				</ul>	\n';
			tagContents += '			</div>	\n';
			tagContents += '		</div>	\n';
			tagContents += '	</div>	\n';

			tagContents += '	<div class="staff_hope_sel">	\n';
			tagContents += '		<div class="form_row">	\n';
			tagContents += '			<div class="rdoChk_box">	\n';
			tagContents += '				<span class="selection" >	\n';
			tagContents += '					<input type="radio" id="radioCheck_1" name="staff" onclick="choice(1)" />	\n';
			tagContents += '					<label for="radioCheck_1" class="label"><em>지점명</em></label>	\n';
			tagContents += '				</span>	\n';
			tagContents += '				<span class="selection" >	\n';
			tagContents += '					<input type="radio" id="radioCheck_2" name="staff" onclick="choice(2)" />	\n';
			tagContents += '					<label for="radioCheck_2" class="label"><em>직원이름</em></label>	\n';
			tagContents += '				</span>	\n';
			tagContents += '				<span class="selection" >	\n';
			tagContents += '					<input type="radio" id="radioCheck_3" name="staff" onclick="choice(3)" />	\n';
			tagContents += '					<label for="radioCheck_3" class="label"><em>직원번호</em></label>	\n';
			tagContents += '				</span>	\n';
			tagContents += '				<span class="selection"  >	\n';
			tagContents += '					<input type="radio" id="radioCheck_4" name="staff" onclick="choice(4)" />	\n';
			tagContents += '					<label for="radioCheck_4" class="label"><em>없음</em></label>	\n';
			tagContents += '				</span>		\n';
			tagContents += '			</div>		\n';
			tagContents += '		</div>		\n';
			tagContents += '	</div>		\n';

			tagContents += '	<!-- 권유직원 - 지점명 -->	\n';
			tagContents += '	<div class="staff_hope_cts" id="info_tab1">	\n';
			tagContents += '		<div class="form_group">	\n';
			tagContents += '			<div class="form_row">	\n';
			tagContents += '				<div class="select outline lg">	\n';
			tagContents += '					<button type="button" class="select_btn active" title="지점명 선택" id="selectButtonId" onclick="selectBbrn();" >지점명</button>	\n';
			tagContents += '					<input type="hidden" id="안내부점옵션선택" name="안내부점옵션선택" value="1" />	\n';
			tagContents += '				</div>	\n';
			tagContents += '			</div>	\n';
			tagContents += '			<div class="form_row">	\n';
			tagContents += '				<span class="input int_btn">	\n';
			tagContents += '					<input type="text" id="지점명" name="지점명" title="지점명 직접입력" placeholder="지점명" maxlength="40" />	\n';
			tagContents += '					<button type="button" class="btn point sm round" onclick="openSolicEmpDotSearchPop(\'1\');" id="btn_empno_search_dot" >검색</button>	\n';
			tagContents += '				</span>	\n';
			tagContents += '			</div>	\n';
			tagContents += '			<div id="config_gubun_1" class="form_btm_full_wrap" style="display: none" >	\n';
			tagContents += '				<span><button type="button" class="btn outline md" onclick="javascript:resetSearchBox();" >검색초기화</button></span>\n';
			tagContents += '			</div>	\n';
			tagContents += '		</div>	\n';
			tagContents += '	</div>	\n';

			tagContents += '	<!-- 권유직원 - 직원이름 -->	\n';
			tagContents += '	<div class="staff_hope_cts" id="info_tab2" >	\n';
			tagContents += '		<div class="form_group">	\n';
			tagContents += '			<div class="form_row">	\n';
			tagContents += '				<span class="input int_btn">	\n';
			tagContents += '					<input type="text" id="직원이름" name="직원이름" title="직원이름 직접입력" placeholder="직원이름" maxlength="40" />	\n';
			tagContents += '					<button type="button" class="btn point sm round" onclick="openSolicEmpDotSearchPop(\'4\');" id="btn_empno_search_nm" >검색</button>	\n';
			tagContents += '				</span>	\n';
			tagContents += '			</div>	\n';
			tagContents += '			<div id="config_gubun_2" class="form_btm_full_wrap" style="display: none" >	\n';
			tagContents += '				<span><button type="button" class="btn outline md" onclick="javascript:resetSearchBox();" >검색초기화</button></span>\n';
			tagContents += '			</div>	\n';
			tagContents += '		</div>	\n';
			tagContents += '	</div>	\n';

			tagContents += '	<!-- 권유직원 - 직원번호 -->	\n';
			tagContents += '	<div class="staff_hope_cts" id="info_tab3" >	\n';
			tagContents += '		<div class="form_group">	\n';
			tagContents += '			<div class="form_row">	\n';
			tagContents += '				<span class="input int_btn">	\n';
			tagContents += '					<input type="tel" id="직원번호" name="직원번호" title="직원번호 직접입력" placeholder="직원번호" maxlength="10" />	\n';
			tagContents += '					<button type="button" class="btn point sm round" onclick="openSolicEmpDotSearchPop(\'2\');" id="btn_empno_search_no" >검색</button>	\n';
			tagContents += '				</span>	\n';
			tagContents += '			</div>	\n';
			tagContents += '			<div id="config_gubun_3" class="form_btm_full_wrap" style="display: none" >	\n';
			tagContents += '				<span><button type="button" class="btn outline md" onclick="javascript:resetSearchBox();" >검색초기화</button></span>\n';
			tagContents += '			</div>	\n';
			tagContents += '		</div>	\n';
			tagContents += '	</div>	\n';

			tagContents += '	<!-- 권유직원 - 없음-->	\n';
			tagContents += '	<div class="staff_hope_cts"  id="info_tab4" >	\n';
			tagContents += '	</div>	\n';
			tagContents += '</div>	\n';

			return tagContents;
		},

		//	권유직원 태그 - 영문
		EmpnoInputTemplate_MNBANK_g : function(){
			var tagContents = '';
			
			tagContents += '<script type="text/javascript">		\n';
			tagContents += '	function resetSearchBox(){		\n';
			tagContents += '		$("#권유지점코드").val("");		\n';
			tagContents += '		$("#권유부점코드").val("");		\n';
			tagContents += '		$("#권유직원번호").val("");		\n';
			tagContents += '		if( $("#radioCheck_1").is(":checked") == true ){		\n';
			tagContents += '			$("#config_gubun_1").attr("style","display:none");		\n';
			tagContents += '			$("#지점명").val("");		\n';
			tagContents += '			$("#지점명").removeAttr("disabled");		\n';
			tagContents += '		}else if( $("#radioCheck_2").is(":checked") == true ){		\n';
			tagContents += '			$("#config_gubun_2").attr("style","display:none");		\n';
			tagContents += '			$("#직원이름").val("");		\n';
			tagContents += '			$("#직원이름").removeAttr("disabled");		\n';
			tagContents += '		}else if( $("#radioCheck_3").is(":checked") == true ){		\n';
			tagContents += '			$("#config_gubun_3").attr("style","display:none");		\n';
			tagContents += '			$("#직원번호").val("");	\n';
			tagContents += '			$("#직원번호").removeAttr("disabled");		\n';
			tagContents += '		}	\n';
			tagContents += '		return false;	\n';
			tagContents += '	}		\n';
			tagContents += '	function openSolicEmpDotSearchPop(){		\n';
			tagContents += '		var form_name= "@@~~FORM_NAME~~@@";		\n';
			tagContents += '		var openUrl = "";		\n';
			tagContents += '		var param = {};		\n';
			tagContents += '		var empPopRetryMsg = "Please search after initializing the settings.";		\n';
			tagContents += '		if( $("#radioCheck_1").is(":checked") == true  ){		\n';
			tagContents += '			if($("#지점명").attr("disabled") == "disabled"){		\n';
			tagContents += '				alert(empPopRetryMsg);		\n';
			tagContents += '				return false;		\n';
			tagContents += '			}		\n';
			tagContents += '			openUrl = "/mquics?page=D002264";		\n';
			tagContents += '			if ($("#지점명").val() == "" ){		\n';
			tagContents += '				alert("Please enter the Branch name.");		\n';
			tagContents += '				$("#지점명").focus();		\n';
			tagContents += '				return false;		\n';
			tagContents += '			}		\n';
			tagContents += '			param = {"안내부점옵션선택":$("#안내부점옵션선택").val(),"안내부점명":$("#지점명").val(),"방카YN":$("#방카YN").val()}		\n';
			tagContents += '		}else if( $("#radioCheck_2").is(":checked") == true ){		\n';
			tagContents += '			if($("#직원이름").attr("disabled") == "disabled"){		\n';
			tagContents += '				alert(empPopRetryMsg);		\n';
			tagContents += '				return false;		\n';
			tagContents += '			}		\n';
			tagContents += '			openUrl = "/mquics?page=D002265";		\n';
			tagContents += '			if( $("#직원이름").val() == "" ){		\n';
			tagContents += '				alert("Please enter the Employee name");		\n';
			tagContents += '				$("#직원이름").focus();		\n';
			tagContents += '				return false;		\n';
			tagContents += '			}		\n';
			tagContents += '			param = {"직원선택방법":"4","안내부점명":$("#직원이름").val(),"방카YN":$("#방카YN").val()}		\n';
			tagContents += '		}else if( $("#radioCheck_3").is(":checked") == true ){		\n';
			tagContents += '			if( $("#직원번호").attr("disabled") == "disabled" ){		\n';
			tagContents += '				alert(empPopRetryMsg);		\n';
			tagContents += '				return false;		\n';
			tagContents += '			}		\n';
			tagContents += '			openUrl = "/mquics?page=D002266";		\n';
			tagContents += '			if( $("#직원번호").val() == "" ){		\n';
			tagContents += '				alert("Please enter the Employee number");		\n';
			tagContents += '				$("#직원번호").focus();		\n';
			tagContents += '				return false;		\n';
			tagContents += '			}		\n';
			tagContents += '			param = {"직원선택방법":"4","직원번호":$("#직원번호").val(),"방카YN":$("#방카YN").val()}		\n';
			tagContents += '		}		\n';
			tagContents += '		window.appManager.openWebViewWithPopup(openUrl,param, popupCallback);		\n';
			tagContents += '		return false;		\n';
			tagContents += '	}		\n';
			tagContents += '	function popupCallback( param ){		\n';
			tagContents += '		var jsonParam;		\n';
			tagContents += '		if( typeof param == "string" ){		\n';
			tagContents += '			jsonParam = JSON.parse(param);		\n';
			tagContents += '		}else if( typeof param == "object" ){		\n';
			tagContents += '			jsonParam = param;		\n';
			tagContents += '		}		\n';
			tagContents += '		if(jsonParam["CANCEL"]!="true") {		\n';
			tagContents += '			if( $("#radioCheck_1").is(":checked") == true ){		\n';
			tagContents += '				$("#config_gubun_1").attr("style","");		\n';
			tagContents += '				$("#지점명").val(jsonParam["안내부점명"]);		\n';
			tagContents += '				$("#지점명").attr("disabled","true");		\n';
			tagContents += '			}else if($("#radioCheck_2").is(":checked") == true ){		\n';
			tagContents += '				$("#config_gubun_2").attr("style","");		\n';
			tagContents += '				$("#직원이름").val(jsonParam["안내부점명"]);		\n';
			tagContents += '				$("#직원이름").attr("disabled","true");		\n';
			tagContents += '			}else if( $("#radioCheck_3").is(":checked") == true ){		\n';
			tagContents += '				$("#config_gubun_3").attr("style","");		\n';
			tagContents += '				$("#직원번호").val(jsonParam["권유직원번호"]);		\n';
			tagContents += '				$("#직원번호").attr("disabled","true");		\n';
			tagContents += '			}		\n';
			tagContents += '			$("#권유지점코드").val(jsonParam["권유지점코드"]);		\n';
			tagContents += '			$("#권유부점코드").val(jsonParam["권유지점코드"]);		\n';
			tagContents += '			$("#권유직원번호").val(jsonParam["권유직원번호"]);		\n';
			tagContents += '		}		\n';
			tagContents += '	}		\n';
			tagContents += '	function clearEmpSelect(){		\n';
			tagContents += '		for( var i=1; i<=4; i++ ){		\n';
			tagContents += '			$("#info_tab" + i).attr("style","display:none");		\n';
			tagContents += '			$("#radioCheck_" + i).attr("check","false");		\n';
			tagContents += '		}		\n';
			tagContents += '	}		\n';
			tagContents += '	function checkSolicEmpValue(){		\n';
			tagContents += '		var f = document.@@~~FORM_NAME~~@@;		\n';
			tagContents += '		if($("#권유구분코드").val()== "1"){		\n';
			tagContents += '			var cnt = 0;		\n';
			tagContents += '			if( typeof f.elements["직원선택직원번호"] == "object" && typeof f.elements["직원선택직원번호"].length == "undefined" ){		\n';
			tagContents += '				if(f.elements["직원선택직원번호"].checked == true){		\n';
			tagContents += '					Empid = f.elements["직원선택직원번호"].value;		\n';
			tagContents += '					Dotcd = f.elements["직원선택지점코드"].value;		\n';
			tagContents += '					$("#권유지점코드").val(Dotcd);		\n';
			tagContents += '					$("#권유부점코드").val(Dotcd);		\n';
			tagContents += '					$("#권유직원번호").val(Empid);		\n';
			tagContents += '					cnt++;		\n';
			tagContents += '				}		\n';
			tagContents += '			}else{		\n';
			tagContents += '				for( var i = 0; i < f.elements["직원선택직원번호"].length; i++ ){		\n';
			tagContents += '					if( f.elements["직원선택직원번호"][i].checked == true ){		\n';
			tagContents += '						Empid = f.elements["직원선택직원번호"][i].value;		\n';
			tagContents += '						Dotcd = f.elements["직원선택지점코드"][i].value;		\n';
			tagContents += '						$("#권유지점코드").val(Dotcd);		\n';
			tagContents += '						$("#권유부점코드").val(Dotcd);		\n';
			tagContents += '						$("#권유직원번호").val(Empid);		\n';
			tagContents += '						cnt++;		\n';
			tagContents += '						break;		\n';
			tagContents += '					}		\n';
			tagContents += '				}		\n';
			tagContents += '			}		\n';
			tagContents += '			if( cnt == 0 ){		\n';
			tagContents += '				alert("Please select the solicitation staff who has been most helpful to you in signing up for the product. If there is no solicitor, please select “No solicitor”.");		\n';
			tagContents += '				return false;		\n';
			tagContents += '			}		\n';
			tagContents += '		}else if( $("#권유구분코드").val()=="2" ){		\n';
			tagContents += '			if( $("#radioCheck_1").is(":checked") == true ){		\n';
			tagContents += '				if( $("#지점명").val() =="" ){		\n';
			tagContents += '					alert("Please enter the branch name");		\n';
			tagContents += '					$("#지점명").focus();		\n';
			tagContents += '					return false;		\n';
			tagContents += '				}		\n';
			tagContents += '				if( $("#권유지점코드").val() == "" || $("#권유부점코드").val() == "" || $("#권유직원번호").val() == ""  ){		\n';
			tagContents += '					alert("The staff selection has not been completed.\\nPlease press the \'search\' button, and  select the staff.");		\n';
			tagContents += '					return false;		\n';
			tagContents += '				}		\n';
			tagContents += '			}		\n';
			tagContents += '		}else if( $("#권유구분코드").val()=="4" ){		\n';
			tagContents += '			if( $("#radioCheck_2").is(":checked") == true ){		\n';
			tagContents += '				if( $("#직원이름").val() =="" ){		\n';
			tagContents += '					alert("Please enter the employee name");		\n';
			tagContents += '					$("#직원이름").focus();		\n';
			tagContents += '					return false;		\n';
			tagContents += '				}		\n';
			tagContents += '				if( $("#권유지점코드").val() == "" || $("#권유부점코드").val() == "" || $("#권유직원번호").val() == "" ){		\n';
			tagContents += '					alert("The staff selection has not been completed.\\nPlease press the \'search\' button, and  select the staff.");		\n';
			tagContents += '					return false;		\n';
			tagContents += '				}		\n';
			tagContents += '			}else{		\n';
			tagContents += '				if( $("#직원번호").val() =="" ){		\n';
			tagContents += '					alert("Please enter the Employee number");		\n';
			tagContents += '					$("#직원번호").focus();		\n';
			tagContents += '					return false;		\n';
			tagContents += '				}		\n';
			tagContents += '				if( !/\\d+$/.test($("#직원번호").val()) ){		\n';
			tagContents += '					alert("Please enter only numbers for the employee number");		\n';
			tagContents += '					$("#직원번호").focus();		\n';
			tagContents += '					return false;		\n';
			tagContents += '				}		\n';
			tagContents += '				if( $("#권유직원번호").val() == "" ){		\n';
			tagContents += '					alert("The staff selection has not been completed.\\nPlease press the \'search\' button, and  select the staff.");		\n';
			tagContents += '					return false;		\n';
			tagContents += '				}		\n';
			tagContents += '				$("#권유직원번호").val($("#직원번호").val());		\n';
			tagContents += '			}		\n';
			tagContents += '		}else if( $("#권유구분코드").val()== "3" ){		\n';
			tagContents += '			$("#권유지점코드").val("");		\n';
			tagContents += '			$("#권유부점코드").val("");		\n';
			tagContents += '			$("#권유직원번호").val("");		\n';
			tagContents += '		}		\n';
			tagContents += '		return true;		\n';
			tagContents += '	}		\n';
			tagContents += '	function choice(idx){		\n';
			tagContents += '		var f = document.@@~~FORM_NAME~~@@;		\n';
			tagContents += '		$("#권유지점코드").val("");		\n';
			tagContents += '		$("#권유부점코드").val("");		\n';
			tagContents += '		$("#권유직원번호").val("");		\n';
			tagContents += '		if( idx == 0 ){		\n';
			tagContents += '			for( var i=1; i<=4; i++ ){		\n';
			tagContents += '				$("#info_tab" + i).attr("style","display:none");		\n';
			tagContents += '				$("#radioCheck_" + i).attr("check","false");		\n';
			tagContents += '			}		\n';
			tagContents += '			$("#권유구분코드").val("1");		\n';
			tagContents += '		}else{		\n';
			tagContents += '			if( typeof f.elements["직원선택직원번호"] == "object" && typeof f.elements["직원선택직원번호"].length == "undefined" ){		\n';
			tagContents += '				f.elements["직원선택직원번호"].checked = false;		\n';
			tagContents += '			}else{		\n';
			tagContents += '				for( var i = 0; i < f.elements["직원선택직원번호"].length; i++ ){		\n';
			tagContents += '					f.elements["직원선택직원번호"][i].checked = false;		\n';
			tagContents += '				}		\n';
			tagContents += '			}		\n';
			tagContents += '			f.elements["지점명"].value = "";		\n';
			tagContents += '			f.elements["지점명"].disabled = false;		\n';
			tagContents += '			f.elements["직원이름"].value = "";		\n';
			tagContents += '			f.elements["직원이름"].disabled = false;		\n';
			tagContents += '			f.elements["직원번호"].value = "";		\n';
			tagContents += '			f.elements["직원번호"].disabled = false;		\n';
			tagContents += '			$("#config_gubun_1").attr("style","display:none");		\n';
			tagContents += '			$("#config_gubun_2").attr("style","display:none");		\n';
			tagContents += '			$("#config_gubun_3").attr("style","display:none");		\n';
			tagContents += '			for( var i = 0; i < f.elements["직원선택직원번호"].length; i++ ){		\n';
			tagContents += '				f.elements["직원선택직원번호"][i].checked = false;		\n';
			tagContents += '			}		\n';
			tagContents += '			if( idx == 1 ){		\n';
			tagContents += '				$("#권유구분코드").val(2);		\n';
			tagContents += '			}else if(idx == 2){		\n';
			tagContents += '				$("#권유구분코드").val(4);		\n';
			tagContents += '			}else if(idx == 3){		\n';
			tagContents += '				$("#권유구분코드").val(4);		\n';
			tagContents += '			}else if(idx == 4){		\n';
			tagContents += '				$("#권유구분코드").val(3);		\n';
			tagContents += '			}		\n';
			tagContents += '			for( var i=1; i<=4; i++ ){		\n';
			tagContents += '				if( i==idx ){		\n';
			tagContents += '					$("#info_tab" + i).attr("style","");		\n';
			tagContents += '					$("#radioCheck_" + i).attr("check","true");		\n';
			tagContents += '					$("#radioCheck_" + i).prop("check","true");		\n';
			tagContents += '				}else{		\n';
			tagContents += '					$("#info_tab" + i).attr("style","display:none");		\n';
			tagContents += '					$("#radioCheck_" + i).attr("check","false");		\n';
			tagContents += '				}		\n';
			tagContents += '			}		\n';
			tagContents += '		}		\n';
			tagContents += '	}		\n';
			tagContents += '	var empno = {		\n';
			tagContents += '		init:function(){		\n';
			tagContents += '			$("input[name=직원선택직원번호]").each(function(index,elem){		\n';
			tagContents += '				$("input[name=직원선택직원번호]:eq("+index+")").click(function(){		\n';
			tagContents += '					for(var i=1; i<=4; i++) {		\n';
			tagContents += '						$("#info_tab" + i).attr("style","display:none");		\n';
			tagContents += '						$("#radioCheck_" + i).attr("check","false");		\n';
			tagContents += '					}		\n';
			tagContents += '					$("#권유구분코드").val("1");		\n';
			tagContents += '					$("#권유지점코드").val($("input[name=직원선택지점코드]:eq("+index+")").val());		\n';
			tagContents += '					$("#권유부점코드").val($("input[name=직원선택지점코드]:eq("+index+")").val());		\n';
			tagContents += '					$("#권유직원번호").val($("input[name=직원선택직원번호]:eq("+index+")").val());		\n';
			tagContents += '				});		\n';
			tagContents += '			});		\n';
			tagContents += '			choice(0);		\n';
			tagContents += '		}		\n';
			tagContents += '	}		\n';
			tagContents += '	function selectLayerPopupOpen(){		\n';
			tagContents += '		$.ohyLayer({		\n';
			tagContents += '			title:"Branch name",		\n';
			tagContents += '			content:"#selectLyaerPopup",		\n';
			tagContents += '			type:"bottom",		\n';
			tagContents += '			scroll:true,		\n';
			tagContents += '			height:150,		\n';
			tagContents += '			closeUse:true		\n';
			tagContents += '		});		\n';
			tagContents += '	}		\n';
			tagContents += '	function selectBbrn(){		\n';
			tagContents += '		var param	= [];		\n';
			tagContents += '		param.push({title: "Branch name"	,value: "1" });		\n';
			tagContents += '		param.push({title: "Area Name"	,value: "2" });		\n';
			tagContents += '		var sussCallBackBbrn = function(datas){		\n';
			tagContents += '			var tempName = ""	\n';
			tagContents += '			if( datas[0].value == 1){	\n';
			tagContents += '				tempName = "Branch name"	\n';
			tagContents += '			}else{	\n';
			tagContents += '				tempName = "Area Name"	\n';
			tagContents += '			}	\n';
			tagContents += '			$("#지점명").attr("placeholder",tempName);	\n';
			tagContents += '			$("#selectButtonId").text( datas[0].title );		\n';
			tagContents += '			$("#안내부점옵션선택").val( datas[0].value );		\n';
			tagContents += '		}		\n';
			tagContents += '		var value = $("#안내부점옵션선택").val();		\n';
			tagContents += '		BottomSheet.simplePickerBottomSheet("Branch name", "", value , param, sussCallBackBbrn, "confirm");		\n';
			tagContents += '	}		\n';
			tagContents += '</script>		\n';
			tagContents += '<input type="hidden" name="권유직원번호" id="권유직원번호" value="" />		\n';
			tagContents += '<input type="hidden" name="권유지점코드" id="권유지점코드" value="" />		\n';
			tagContents += '<input type="hidden" name="권유부점코드" id="권유부점코드" value="" />		\n';
			tagContents += '<input type="hidden" name="권유구분코드" id="권유구분코드" value="" />		\n';
			
			tagContents += '<div class="staff_hope">	\n';
			
			tagContents += '	<div data-quics=\'{"start":"if"}\'>	\n';
			tagContents += '		<div data-quics=\'{"if":"servicedata.totalrow!=0  && servicedata.totalrow!=undefined"}\'>	\n';
			tagContents += '			<div id="권유직원선택">	\n';
			tagContents += '				<ul class="list_comp check" data-quics=\'{"getList":"ARRAY수_view"}\' style="display: none">	\n';
			tagContents += '					<li>	\n';
			tagContents += '						<span class="selection">	\n';
			tagContents += '							<input type="hidden" id="직원선택지점코드" name="직원선택지점코드" data-quics=\'{"attr":"strDotCd"}\'>	\n';
			tagContents += '							<input type="radio"  id="직원선택직원번호" name="직원선택직원번호" data-quics=\'{"value":"strEmpid"}\' data-wat=\'{"attrString":"title","txtString":"권유직원 %S 선택","keyString":"strEmnm"}\'>	\n';
			tagContents += '							<label for="직원선택직원번호" class="label">	\n';
			tagContents += '								<em>	\n';
			tagContents += '									<span class="staff" data-quics=\'{"attr":"strEmnm"}\' ></span>	\n';
			tagContents += '									<span class="office" data-quics=\'{"attr":"strAreaDotName"}\' ></span>	\n';
			tagContents += '								</em>	\n';
			tagContents += '							</label>	\n';
			tagContents += '						</span>	\n';
			tagContents += '					</li>	\n';
			tagContents += '				</ul>	\n';
			tagContents += '			</div>	\n';
			tagContents += '		</div>	\n';
			tagContents += '	</div>	\n';
			
			tagContents += '	<div class="staff_hope_sel">	\n';
			tagContents += '		<div class="form_row">	\n';
			tagContents += '			<div class="rdoChk_box">	\n';
			tagContents += '				<span class="selection" >	\n';
			tagContents += '					<input type="radio" id="radioCheck_1" name="staff" onclick="choice(1)" />	\n';
			tagContents += '					<label for="radioCheck_1" class="label"><em>Branch name</em></label>	\n';
			tagContents += '				</span>	\n';
			tagContents += '				<span class="selection" >	\n';
			tagContents += '					<input type="radio" id="radioCheck_2" name="staff" onclick="choice(2)" />	\n';
			tagContents += '					<label for="radioCheck_2" class="label"><em>Employee name</em></label>	\n';
			tagContents += '				</span>	\n';
			tagContents += '				<span class="selection" >	\n';
			tagContents += '					<input type="radio" id="radioCheck_3" name="staff" onclick="choice(3)" />	\n';
			tagContents += '					<label for="radioCheck_3" class="label"><em>Employee number</em></label>	\n';
			tagContents += '				</span>	\n';
			tagContents += '				<span class="selection"  >	\n';
			tagContents += '					<input type="radio" id="radioCheck_4" name="staff" onclick="choice(4)" />	\n';
			tagContents += '					<label for="radioCheck_4" class="label"><em>None</em></label>	\n';
			tagContents += '				</span>		\n';
			tagContents += '			</div>		\n';
			tagContents += '		</div>		\n';
			tagContents += '	</div>		\n';
			
			tagContents += '	<!-- 권유직원 - 지점명 -->	\n';
			tagContents += '	<div class="staff_hope_cts" id="info_tab1">	\n';
			tagContents += '		<div class="form_group">	\n';
			tagContents += '			<div class="form_row">	\n';
			tagContents += '				<div class="select outline lg">	\n';
			tagContents += '					<button type="button" class="select_btn active" title="지점명 선택" id="selectButtonId" onclick="selectBbrn();" >Branch name</button>	\n';
			tagContents += '					<input type="hidden" id="안내부점옵션선택" name="안내부점옵션선택" value="1" />	\n';
			tagContents += '				</div>	\n';
			tagContents += '			</div>	\n';
			tagContents += '			<div class="form_row">	\n';
			tagContents += '				<span class="input int_btn">	\n';
			tagContents += '					<input type="text" id="지점명" name="지점명" title="지점명 직접입력" placeholder="Branch name" maxlength="40" />	\n';
			tagContents += '					<button type="button" class="btn point sm round" onclick="openSolicEmpDotSearchPop(\'1\');" id="btn_empno_search_dot" >Search</button>	\n';
			tagContents += '				</span>	\n';
			tagContents += '			</div>	\n';
			tagContents += '			<div id="config_gubun_1" class="form_btm_full_wrap" style="display: none" >	\n';
			tagContents += '				<span><button type="button" class="btn outline md" onclick="javascript:resetSearchBox();" >Initialize search</button></span>\n';
			tagContents += '			</div>	\n';
			tagContents += '		</div>	\n';
			tagContents += '	</div>	\n';
			
			tagContents += '	<!-- 권유직원 - 직원이름 -->	\n';
			tagContents += '	<div class="staff_hope_cts" id="info_tab2" >	\n';
			tagContents += '		<div class="form_group">	\n';
			tagContents += '			<div class="form_row">	\n';
			tagContents += '				<span class="input int_btn">	\n';
			tagContents += '					<input type="text" id="직원이름" name="직원이름" title="직원이름 직접입력" placeholder="Employee name" maxlength="40" />	\n';
			tagContents += '					<button type="button" class="btn point sm round" onclick="openSolicEmpDotSearchPop(\'4\');" id="btn_empno_search_nm" >Search</button>	\n';
			tagContents += '				</span>	\n';
			tagContents += '			</div>	\n';
			tagContents += '			<div id="config_gubun_2" class="form_btm_full_wrap" style="display: none" >	\n';
			tagContents += '				<span><button type="button" class="btn outline md" onclick="javascript:resetSearchBox();" >Initialize search</button></span>\n';
			tagContents += '			</div>	\n';
			tagContents += '		</div>	\n';
			tagContents += '	</div>	\n';
			
			tagContents += '	<!-- 권유직원 - 직원번호 -->	\n';
			tagContents += '	<div class="staff_hope_cts" id="info_tab3" >	\n';
			tagContents += '		<div class="form_group">	\n';
			tagContents += '			<div class="form_row">	\n';
			tagContents += '				<span class="input int_btn">	\n';
			tagContents += '					<input type="tel" id="직원번호" name="직원번호" title="직원번호 직접입력" placeholder="Employee number" maxlength="10" />	\n';
			tagContents += '					<button type="button" class="btn point sm round" onclick="openSolicEmpDotSearchPop(\'2\');" id="btn_empno_search_no" >Search</button>	\n';
			tagContents += '				</span>	\n';
			tagContents += '			</div>	\n';
			tagContents += '			<div id="config_gubun_3" class="form_btm_full_wrap" style="display: none" >	\n';
			tagContents += '				<span><button type="button" class="btn outline md" onclick="javascript:resetSearchBox();" >Initialize search</button></span>\n';
			tagContents += '			</div>	\n';
			tagContents += '		</div>	\n';
			tagContents += '	</div>	\n';
			
			tagContents += '	<!-- 권유직원 - 없음-->	\n';
			tagContents += '	<div class="staff_hope_cts"  id="info_tab4" >	\n';
			tagContents += '	</div>	\n';
			tagContents += '</div>	\n';
			
			return tagContents;
		}

};

//	바텀레이어 팝업 용
var bottomLayer = function(){
	return{
		openPopup : function ( popTitle, popId ){
			
			//안드로이드 백버튼에 bottomLayer.closePopup() 등록. 1회동작후 기존 백버튼으로 동작
			window.appManager.closeHybridBottomSheet("bottomLayer.closePopup()");
			
//			debugger;
			$.ohyLayer({
				title : popTitle,
				content : '#'+popId,
				type : 'bottom',
				closeUse:true
			});
			
		   //바텀시트의 X(닫기)버튼 클릭시 백버튼에 동작 등록한 함수를 제거
		   $(document).off("click.btmClose","#"+popId+"_dev").on("click.btmClose","#"+popId+"_dev",function(){
			   window.appManager.closeHybridBottomSheet("");
		   });
		   //dim 터치시 백버튼 동작 등록한 함수 제거
		   $(document).off("click.btmClose",".col_dim").on("click.btmClose",".col_dim",function(){
		   		window.appManager.closeHybridBottomSheet("");
		   });
		},

		closePopup : function(){
			$('body').find("[data-action='close']").click();
		},

		selectedOptionData : function( strVal, strValText, buttonId, inputId ){
			bottomLayer.closePopup();
			$("#"+buttonId).text(strValText);		//	버튼 타이틀
			$("#"+inputId).val(strVal);				//	hidden 값
		}
	};
}();

//##################################################################################
//셀렉트박스 DIV 바텀시트 처리용
//##################################################################################
var BottomSheet = {
	uuid : 0 ,
	nextUuid : function(){
		return BottomSheet.uuid++;
	},
	isNative : function(){
		return !device.platform.match(/Orchestra Simulator/);
	},
	valuesListToTree : function(obj){
		var selects = obj.selects;
		var values = [];
		var l1 = selects[0];
		var l2 = selects[1];
		var l3 = selects[2];

		var columnDefault = obj.columnDefault;

		var valuesMap1 = {};
		var valuesMap2 = {};


		for (var i = 0; i < l1.length; i++) {
			var val = {title : l1[i].title, data: l1[i] , values:[]};
			values.push(val);
			valuesMap1[l1[i].value] = val;
		}


		if(l2){
			for (var i = 0; i < l2.length; i++) {
				var l = l2[i];
				var s = l.select;
				var m1 = valuesMap1;
				var m2 = valuesMap2;

				if(s == "ALL"){
					s = [];
					for (var k in m1) {
						s.push(k)
					}
					l.select = s;
				}

				for (var j = 0; j < s.length; j++) {
					var val = {title : l.title, data: l , values:[]};
					m1[s[j]].values.push(val);
					if(m2[l.value]){
						m2[l.value].push( val );
					}else{
						m2[l.value] = [val];
					}
				}
			}
		}
		if(l3){
			for (var i = 0; i < l3.length; i++) {
				var l = l3[i];
				var s = l.select;
				var m1 = valuesMap2;
				if(s == "ALL"){
					s = [];
					for (var k in m1) {
						s.push(k);
					}
					l.select = s;
				}

				for (var j = 0; j < s.length; j++) {
					var val = {title : l.title, data: l, values:[]};
					var sm1 = m1[s[j]];

					for (var y = 0; y < sm1.length; y++) {
						sm1[y].values.push(val);
					}
				}
			}
		}
		return values;
	},
	getColumnDefault :function(values, columnDefaults, mltlYn){
		var columnDefaultIndexs = [0];
		if(mltlYn){
			for (var i in columnDefaults) {
				var inValues = values[i];
				var chkValue = columnDefaults[i];
				for (var p in inValues) {
					var bufValue =  inValues[p];
					if(bufValue.value == chkValue){
						columnDefaultIndexs[i] = p;
					}
				}
			}
		}else{
			var getIndex = function(inValues, chkValue,defaultPoint){
				for (var p = 0; p < inValues.length; p++) {
					var bufValue =  inValues[p];
					if(bufValue.data.value == chkValue){
						return p;
					}
				}
				return defaultPoint;
			}

			columnDefaultIndexs[0] = getIndex(values, columnDefaults[0], 0 );

			if(columnDefaults.length > 1){
				var leval1Value = values[columnDefaultIndexs[0]];

				columnDefaultIndexs[1] = getIndex(leval1Value.values, columnDefaults[1], 0 );
			}

			if(columnDefaults.length > 2){
				var leval1Value = values[columnDefaultIndexs[0]];
				var leval2Value = leval1Value.values[columnDefaultIndexs[1]];

				columnDefaultIndexs[2] = getIndex(leval2Value.values, columnDefaults[2], 0 );
			}
		}
		return columnDefaultIndexs;
	},
	//	1개, 2개, 3개 연동
	showNavi : function(target){
		var THIS = this;
		var data = this.data;

		var successCallback = function(reval){
			var ps = [];
			var redata = [];
			var sels = reval.value;
			var isCancel = reval.isCancel;	//	N : 확인버튼, Y : X버튼

			if( isCancel == "N"){
				var l = sels.length;
				var p1 = sels[0];
				var tree1 = data.values[p1];
				redata.push(tree1.data);

				ps.push( p1);

				if(l>1){
					var p2 = sels[1];
					if(p2 == -1) p2 = 0;
					ps.push(p2);

					var tree2 = tree1.values[p2];
					redata.push(tree2.data);

					if(l>2){
						var p3 = sels[2];
						if(p3 == -1) p3 = 0;
						ps.push(p3);

						var tree3 = tree2.values[p3];
						redata.push(tree3.data);
					}
				}

				if(THIS.suss(redata) != false){
					THIS.close(ps);
				}else{
					THIS.show(ps);
				}
			}
		};

		var tag = data.tag;
		var title = data.title;
		var confirmTitle = data.confirmTitle;
		var columnTitle = data.columnTitle;
		var columnDefault = target || data.columnDefault;
		var values = data.values;

		window.uicontrols.showCustomPickerBottomSheet(successCallback, tag, title, confirmTitle, columnTitle, columnDefault, values);

	},

	//	2개, 3개 독립
	showNaviMltl : function(target){
		var THIS = this;
		var data = this.data;
		var successCallback = function(reval){
			try {
				var selectDatas = [];
				var selectIndexs = reval.value;
				var isCancel = reval.isCancel;	//	N : 확인버튼, Y : X버튼

				if( isCancel == "N"){
					for(var i = 0 ; i < selectIndexs.length ; i++ ) {
						selectDatas[i] = data.values[i][selectIndexs[i]];
					}

					if(THIS.suss(selectDatas) != false){
						data.columnDefault = selectIndexs;
					}else{
						THIS.show(selectIndexs);
					}
				}
			} catch (e) {
				alert(e);
			}
		};

		var tag = data.tag;
		var title = data.title;
		var confirmTitle = data.confirmTitle;
		var columnTitle = data.columnTitle;
		var columnDefault = target || data.columnDefault;
		var values = data.values;

		window.uicontrols.showCustomPickerBottomSheet(successCallback, tag, title, confirmTitle, columnTitle, columnDefault, values);

	},
	createShowBrwHtml : function(obj, multYn){
		var selboxText = "";

		var data = obj.data;
		var selects = obj.selects

		var columnTitle = data.columnTitle
		var confirmTitle = data.confirmTitle;

		var buttomsrc = $(''
				 + '<div class="layerHTML"><div data-top="true">'
				 + '		<div class="ly_cnt">'
				 + '			<div class="section">'
				 + '			</div>'
				 + '		</div>'
				 + '		<div class="btn_pop_confirm_wrap">'
				 + '			<div class="btn_area">'
				 + '				<span><button type="button" class="btn secondary lg" data-action="close">취소</button></span>'
				 + '				<span><button type="button" class="btn primary lg">'+confirmTitle+'</button></span>'
				 + '			</div>'
				 + '		</div>'
				 + ' </div>   </div>'
				 );
		var selDiv = buttomsrc.find(".section");

		var setSelectHtml = function(selDiv,  columnTitle, options, multFlag, lvl, cng, disabled){
			var name = $('<span style="color: blue;"></span>').text(columnTitle || "" );
			var jSelect = $('<select></select>');

			if(!multFlag){
				jSelect.attr("data-lvl", lvl);
				if(cng){
					jSelect.attr("data-cng", cng);
				}
			}else{
				jSelect.attr("data-dstic", lvl);
			}

			for (var i in options) {
				var option = options[i];
				var jOption = $("<option />").val(option.value).text(option.title);
				if(!multFlag){
					jOption.prop("disabled",disabled);
					var sels = option.select;
					if(sels){
						for (var j in sels) {
							var sel = sels[j];
							jOption.attr("data-sel_" + sel,"true");
						}
					}
				}

				jSelect.append(jOption);
			}
			selDiv.append(name).append("&ensp;:&ensp;").append(jSelect);
		};


		if(selects[0]){
			setSelectHtml(selDiv, columnTitle[0], selects[0], multYn, 1, 2);
		}
		if(selects[1]){
			setSelectHtml(selDiv, columnTitle[1], selects[1], multYn, 2, 3, true);
		}
		if(selects[2]){
			setSelectHtml(selDiv, columnTitle[2], selects[2], multYn, 3, null, true);
		}

		return buttomsrc;
	},
	showBrw : function (target){

		//팝업 띄우기
		var columnDefault = target || this.data.columnDefault;
		var buttomsrc = BottomSheet.createShowBrwHtml(this);
		this.layer = $.ohyLayer({
			titleUse : true,
			title : this.data.title,
			content : buttomsrc,
			type : 'bottom',
			scroll : false,
			height : 250,
			closeUse : true,
		});

	  	//초기 선택
		this.layer.$el.find("[data-lvl='2'] option").prop("disabled", true).hide();
		this.layer.$el.find("[data-lvl='3'] option").prop("disabled", true).hide();

		var setSelected = function(jElement, lvl, index){
			var value = jElement.find("[data-lvl='"+lvl+"'] option:not(:disabled):eq('"+index+"')").prop("selected", true).val();
			if(value != undefined){
				jElement.find("[data-lvl='"+(lvl + 1)+"'] option[data-sel_"+value.replace(/([.|#|:|(|)\s])/g,"\\$1")+"]").prop("disabled", false).show();
			}
		}

		if(columnDefault[0] != undefined){
			setSelected(this.layer.$el, 1, columnDefault[0]);
			if(columnDefault[1] != undefined){
				setSelected(this.layer.$el, 2, columnDefault[1]);
			}
			if(columnDefault[2] != undefined){
				setSelected(this.layer.$el, 3, columnDefault[2]);
			}
		}else{
			this.layer.$el.find("[data-lvl='1'] option:eq(0)").prop("selected", true);
			this.layer.$el.find("[data-lvl='1']").change();
		}

		// Select 선택시 다음 Select 표시
		this.layer.$el.find("[data-lvl]").change(function(){
			var cng = $(this).data("cng");
			var next = $(this).parent().find("[data-lvl='"+cng+"']");
			if(next.length){
				next.find("option").prop("disabled", true).prop("selected", false).hide();
				next.find("option[data-sel_"+this.value.replace(/([.|#|:|(|)\s])/g,"\\$1")+"]").prop("disabled", false).show().eq(0).prop("selected", true);
				next.change();
			}
		});

		// 확인 버튼 이벤트
		var btn = this.layer.$el.find(".primary");
		btn[0].suss = this.suss;
		btn[0].data = this.data;
		btn[0].close = function(d){
			this.data.columnDefault = d || this.data.columnDefault;
			this.layer.$layer.addClass("off");
			this.layer.close();
		};
		btn[0].layer = this.layer;

		btn.click(function(){
			var selectIndexs = [];
			var selectDatas = [];

			var sels = $(".layer_wrap.open .section select");
			var length = sels.length;

			var selectPoint = function(selects, index){
				var optionSubs = selects.eq(index).find("option:not(:disabled)");
				var optionSubsSelected = optionSubs.siblings(":selected")
				var point = optionSubs.index(optionSubsSelected);
				return point == -1 ? 0 : point;
			}

			var lvl1Index = selectPoint(sels, 0);
			var lvl1Tree = this.data.values[lvl1Index];

			selectIndexs.push( lvl1Index );
			selectDatas.push(lvl1Tree.data);

			if(length>1){
				var lvl2Index = selectPoint(sels,1);
				var lvl2Tree = lvl1Tree.values[lvl2Index];

				selectIndexs.push(lvl2Index);
				selectDatas.push(lvl2Tree.data);

				if(length>2){
					var lvl3Index = selectPoint(sels, 2);
					var lvl3Tree = lvl2Tree.values[lvl3Index];

					selectIndexs.push(lvl3Index);
					selectDatas.push(lvl3Tree.data);
				}
			}
			if(this.suss(selectDatas) != false){
				this.close(selectIndexs);
			}
		});
	},
	showBrwMltl : function (target){

		//팝업 띄우기
		var columnDefault = target || this.data.columnDefault;
		var buttomsrc = BottomSheet.createShowBrwHtml(this, true);
		this.layer = $.ohyLayer({
			titleUse : true,
			title : this.data.title,
			content : buttomsrc,
			type : 'bottom',
			scroll : false,
			height : 250,
			closeUse : true,
		});
		for(var i = 0 ; i < columnDefault.length ; i++){
			var jElement = this.layer.$el;
			var index = columnDefault[i];
			jElement.find("[data-dstic='"+ ( i + 1 ) +"'] option").eq(index).prop("selected", true);

		}
// 			// 확인 버튼 이벤트
		var btn = this.layer.$el.find(".primary");
		btn[0].suss = this.suss;
		btn[0].data = this.data;
		btn[0].close = function(d){
			this.data.columnDefault = d || this.data.columnDefault;
			this.layer.$layer.addClass("off");
			this.layer.close();
		};
		btn[0].layer = this.layer;
		btn.click(function(){

			var selectIndexs = this.data.columnDefault;
			var selectDatas = [];
			var selects = $(".layer_wrap.open .section select");

			for(var i in selectIndexs){
				var point = selects.eq(i).find("option:selected").index();
				point = point == -1 ? selectIndexs[i] : point;
				selectIndexs[i] = point;
				selectDatas[i] = this.data.values[i][point];
			}
			if(this.suss(selectDatas) != false){
				this.close(selectIndexs);
			}
		});
	},
	newPickerBottomSheetList : function(obj){

		// 변수선언
		var confirmTitle = obj.confirmTitle || "확인";
		var sels = obj.selects;
		var columnDefault = obj.columnDefault;

		var naviYn = BottomSheet.isNative();
		var values = BottomSheet.valuesListToTree(obj);
		var columnDefaultIndexs = BottomSheet.getColumnDefault(values, columnDefault);


		//data생성
		var data = {
		   "tag": BottomSheet.nextUuid() ,
		   "confirmTitle":obj.confirmTitle,
		   "title":obj.title,
		   "columnTitle":obj.columnTitle,
		   "columnDefault":columnDefaultIndexs,
		   "values" : values
		};

		// 트리 values 생성

		var show = function(target){
			if(this.naviYn){
				this.showNavi(target);
			}else {
				this.showBrw(target);
			}
		}
		var showNavi = BottomSheet.showNavi;
		var showBrw = BottomSheet.showBrw;

		return {
			data : data
			,selects : sels
			,show : show
			,showNavi : showNavi
			,showBrw : showBrw
			,suss : obj.suss

			,naviYn : naviYn
		};
	},
	newPickerBottomSheetListMltl : function(obj){
		// 변수선언
		var confirmTitle = obj.confirmTitle || "확인";
		var sels = obj.selects;
		var columnDefault = obj.columnDefault;

		var naviYn = BottomSheet.isNative();
		var values = obj.selects;
		var columnDefaultIndexs = BottomSheet.getColumnDefault(values, columnDefault, true);

		//data생성
		var data = {
		   "tag": BottomSheet.nextUuid() ,
		   "confirmTitle":obj.confirmTitle,
		   "title":obj.title,
		   "columnTitle":obj.columnTitle,
		   "columnDefault":columnDefaultIndexs,
		   "values" : values,
		   "mltl" : true
		};

		// 트리 values 생성
		var show = function(target){
			if(this.naviYn){
				this.showNavi(target);
			}else {
				this.showBrw(target);
			}
		}

		var showNavi = BottomSheet.showNaviMltl;
		var showBrw = BottomSheet.showBrwMltl;

		return {
			data : data
			,selects : sels
			,show : show
			,showNavi : showNavi
			,showBrw : showBrw
			,suss : obj.suss
			,naviYn : naviYn
		};
	},
	simplePickerBottomSheet : function(title, columnTitle, columnDefault,  select,  suss,  confirmTitle){
		confirmTitle = confirmTitle || "확인";

		var sheet = this.newPickerBottomSheetList({
			  confirmTitle : confirmTitle,
			   title : title,
			   columnTitle : [ columnTitle ],
			   columnDefault : [columnDefault],
			   selects :
				[
					select
				],
				suss :  suss
			});
		sheet.show();
		return sheet;
	}
};