/*
APPL_TP = "C" && APPL_STAT = "03" :: 법정대리인 변경 신청중
변경신청 완료 후 TCMMB_CUST_SVC_APPL_INFO 테이블에서 위의 값들  APPL_TP = "N" && APPL_STAT = "06" 로 업데이트

  $(".btn_cert_type").prop("checked",false);  ===> label 태그에서 onclick이 두번 실행되는 오류가 발생하여 onchange 이벤트로 바꾸었으나 두번째 선택시 이벤트가 발생하지 않아 초기화시키기 위해 추가함.

*/

 let areaArr = [
        {value : "13",text:"경기(13)"},
        {value : "11",text:"서울(11)"},
        {value : "28",text:"경기북부(28)"},
        {value : "13",text:"경기남부(13)"},
        {value : "14",text:"강원(14)"},
        {value : "15",text:"충북(15)"},
        {value : "16",text:"충남(16)"},
        {value : "17",text:"전북(17)"},
        {value : "18",text:"전남(18)"},
        {value : "19",text:"경북(19)"},
        {value : "20",text:"경남(20)"},
        {value : "21",text:"제주(21)"},
        {value : "22",text:"대구(22)"},
        {value : "23",text:"인천(23)"},
        {value : "24",text:"광주(24)"},
        {value : "25",text:"대전(25)"},
        {value : "26",text:"울산(26)"},
        {value : "12",text:"부산(12)"},
    ];

function initPage(){

//        $("#legalRprsnIssueDt").val("20131115");
//        $("#legalRprsnNm").val("황지우");
//        $("#legalRprsnRegNoRf").val("831203");
//        $("#legalRprsnRegNoRb").val("2017112");
//        $("#legalRprsnTelNo").val("01082394385");
//        $("#hLegalRprsnRegNo").val("8312032017112");
//        $("#hiddenLegalRprsnRegNo").val("8312032017112");
//        $("#legalRprsnIssueDt").val("20220707");


        legalRprsnInit();

        setHeaderType('sub');

        //신용카드 본인인증 버튼처리
        if(gAuthMthdForKCBCard == "Y"){
            gKCBAble = true;
        }

        //KB국민인증서 버튼처리
        if(gAuthMthdForKBSign == "Y"){
            gKbsignAble = true;
        }

        // 관계 레이어
        $('#legalRprsnRel').on('click', function(){
            $.ohyLayer({
                titleUse:true,
                title:"법정대리인과의 관계를 선택해주세요",
                content:'#relLayer',
                type:'bottom',
                closeUse:true,
            });
        });

        $("#btnNextPage").click(function(){
            if($("#btnNextPage").prop('disabled')){return false;}
            if($("#authMthd").val() == ''){
                callPop("본인 인증을 진행해 주세요.");
                return;
            } else {
                moveNextPage();
            }
        });

        $("#legalRprsnNm").keyup(function ( event) {
            // 한글만 입력
            $(this).val( $(this).val().replace( /[a-z|A-Z]/gi, '' ) );//영문제외
            $(this).val( $(this).val().replace( /[0-9]/gi, '' ) );//숫자제외
            $(this).val( $(this).val().replace( /[\{\}\[\]\/?.,;:|\(\`~!@#$%^&)_\=\'\"\<\>\!\*\- ]/gi, '' ) ); //특수문자입력제외
        });

        $('[name=rdoSelfIdf]').click(function(){
            divDriveOnOff();
        });


        $(function () {
            $("#legalRprsnRegNoRf").keyup(function() {
                var maxlen = $(this).attr("maxlength");
                if(this.value.length >= maxlen) {
                    $("#legalRprsnRegNoRb").focus();
                    return false;
                }
            });
        });


        $("#legalRprsnNm, #legalRprsnRegNoRf, #legalRprsnRegNoRb, #legalRprsnTelNo, #legalRprsnDriverNo, #legalRprsnIssueDt, #legalRprsnIssueDt2").on("focus", function() {
            var name = $(this).prop('name');
            $("[name='errMsg_"+$(this).prop('name')+"']").hide();
            if(name == 'legalRprsnRegNo'){
                $('#legalRprsnRegNoRf').prop("opocity",0);
                $('#legalRprsnRegNoRb').prop("opocity",0);
            }else{
                $(this).removeClass("error");
            }
        });

        // 2023.03.23 보안키패드 추가
        npPfsStartup(document.frm, false, false, false, true, "npkencrypt", "on");

        // 가상키패트 마우스다운이벤트
        $(".kpd-data[data-action*='data']").on("mousedown", function(e){
        });

        // 가상키패트 hide이벤트
        $(document).on("nppfs-npv-after-hide", function(e){
            var element = e.target;
            if(element.name === "legalRprsnRegNoRb" && $("#legalRprsnRegNoRb").val().length === 7){
                maxLengthCheck(element); cuNumPlus();
            }
        });


        divDriveOnOff();
        printArea();


}


// 관계값 초기화
function legalRprsnInit(){
	var rel = "${legalInfo.legalRprsnRel}";
	$('#legalRprsnRel').attr("data",rel);

    if(rel == "F"){
        $('#legalRprsnRel').text('부');
    }else if(rel == "M"){
        $('#legalRprsnRel').text('모');
    }else if(rel == "E"){
        $('#legalRprsnRel').text('기타');
    }
    $('#legalRprsnRel').attr("data", rel );

}

// 신용카드 인증 - (미성년자용)
function cardCertAction() {
    if($("#btnCardAuth").prop('disabled')){return false;}
        if($("#btnKbsignAuth").prop('disabled') || $("#btnMobileAuth").prop('disabled')){
            callPop("이미 인증을 완료 하였습니다.");
            return;
        }

        $("#btnNextPage").addClass('disabled');
        $("#btnNextPage").prop('disabled');
        $("#certMsg").text("");

        gAuthMthd = "200";
        $('#minorCertPathCd').val("41");
        getStartWithLegKBPin(); //->checkLegalRprsInfo(->진위)->인증


}

// KB국민인증서 인증 클릭 - (미성년자용)
function kbSignCertAction(){
    if($("#btnKbsignAuth").prop('disabled')){return false;}
    if($("#btnCardAuth").prop('disabled') || $("#btnMobileAuth").prop('disabled')){
        callPop("이미 인증을 완료 하였습니다.");
        return;
    }

    $("#btnNextPage").prop('disabled',true);
    $("#certMsg").text("");

    gAuthMthd = "300";
    $('#minorCertPathCd').val("41");
    getStartWithLegKBPin(); //->checkLegalRprsInfo(->진위)->인증

}

// 휴대폰 본인인증 (법정대리인 커스텀)
function phoneCertAction() {
	if($("#btnMobileAuth").prop('disabled')){return false;}
    if($("#btnKbsignAuth").prop('disabled') || $("#btnCardAuth").prop('disabled')){
        callPop("이미 인증을 완료 하였습니다.");
        return;
    }

    $("#btnNextPage").prop('disabled',true);
    $("#certMsg").text("");

    gAuthMthd = "100";
    getStartWithLegKBPin(); //->checkLegalRprsInfo(->진위)->인증
}

function fn_cancelKbsignBtn(){
    $("input[name='c-cert-type']").prop("checked",false);
}


function checkParam(){
	var strErr = '';
	if($('#legalRprsnNm').val() == '' || $('#legalRprsnNm').val().length < 2){
		$('#errMsg_legalRprsnNm').css('opacity','100');
		$("#legalRprsnNm").addClass("error");
		strErr = '이름을 정확하게 입력해주세요.';
		callPop(strErr, 'legalRprsnNm');
		$("input[name='c-cert-type']").prop("checked",false);
		return false;
	}

	if($('#hLegalRprsnRegNo').val() == '' || $('#hLegalRprsnRegNo').val().length < 13){
		$('#errMsg_legalRprsnRegNo').css('opacity','100');
		$('#legalRprsnRegNoRf').addClass('error');
		$('#legalRprsnRegNoRb').addClass('error');
		strErr = '주민등록번호를 정확히 입력해주세요.';
		callPop(strErr);
		$("input[name='c-cert-type']").prop("checked",false);
		return false;
	}

	if($('#legalRprsnRel').attr("data") == ''){
		strErr = '법정대리인의 관계를 선택해 주세요.';
		callPop(strErr);
		$("input[name='c-cert-type']").prop("checked",false);
		return false;
	}

	if($('#legalRprsnTelNo').val() == '' || $('#legalRprsnTelNo').val().length < 11 || !chkmtelNo($('#legalRprsnTelNo').val())){
		$('#errMsg_legalRprsnTelNo').css('opacity','100');
		$('#errMsg_legalRprsnTelNo').show();
		strErr = '휴대폰번호를 정확히 입력해주세요.';
		$('#errMsg_legalRprsnTelNo').text(strErr);
		callPop(strErr, 'legalRprsnTelNo');
		$("input[name='c-cert-type']").prop("checked",false);
		return false;
	}

	var radioVal = $("input:radio[name='rdoSelfIdf']:checked").val();
	if(radioVal == '1'){
		//주민등록증 발급일자
		var issDtVal = $('#legalRprsnIssueDt').val();
		if(!isIdcardValidDate(issDtVal)){
			$('#errMsg_legalRprsnIssueDt').css('opacity','100');
			$('#errMsg_legalRprsnIssueDt').show();
			strErr = '발급일자를 정확히 입력해주세요.';
			$('#errMsg_legalRprsnIssueDt').text(strErr);
			callPop(strErr, 'legalRprsnIssueDt');
			$("input[name='c-cert-type']").prop("checked",false);
			return false;
		}
	}
	else if(radioVal == '2'){
		if($('#legalRprsnRel').attr("data") == ''){
			strErr = '운전면허증의 지역을 선택해 주세요.';
			callPop(strErr);
			return false;
		}
		if($('#legalRprsnDriverNo').val() == '' || $('#legalRprsnDriverNo').val().replace(/-/g,'').length < 10){
			$('#errMsg_legalRprsnDriverNo').css('opacity','100');
			$('#errMsg_legalRprsnDriverNo').show();
			strErr = '운전면허번호를 정확히 입력해주세요.';
			$('#errMsg_legalRprsnDriverNo').text(strErr);
			callPop(strErr, 'legalRprsnDriverNo');
			$("input[name='c-cert-type']").prop("checked",false);
			return false;
		}

		//운전면허증 발급일자
		var issDtVal2 = $('#legalRprsnIssueDt2').val();
		if(!isIdcardValidDate(issDtVal2)){
			$('#errMsg_legalRprsnIssueDt2').css('opacity','100');
			$('#errMsg_legalRprsnIssueDt2').show();
			strErr = '발급일자를 정확히 입력해주세요.';
			$('#errMsg_legalRprsnIssueDt2').text(strErr);
			callPop(strErr, 'legalRprsnIssueDt2');
			$("input[name='c-cert-type']").prop("checked",false);
			return false;
		}
	}

	return true;
}


function checkLegalRprsInfo(){
	var chk = checkParam();

	if(chk){

		fn_transCall('/info/legal/checkLegalRprsInfo', {}, checkLegalRprsInfo_callBack);
	}
}

//KB국민/신용카드 인증(미성년자용)
function openAuthPopup() {
	if(gAuthMthd=="200"){
        init();
		$("#includeLRPNm").val($('#legalRprsnNm').val());
		$("#includeLRPBirthGender1").val($('#legalRprsnRegNoRf').val())
		$("#includeLRPBirthGender2").val($('#legalRprsnRegNoRb').val().substr(0,1));
		$("#includeLRPOpenMode").val("body");
         $.ohyLayer({
            titleUse:true,
            title: "신용카드 본인인증",
            content:'#includeLayerCardCert',
            type:'fullpopup',
            closeUse:false,
        });

        // 신용카드 인증 팝업 취소버튼 클릭
        $("#btnLRPAuthCancel").click(function(){
            $(".btn_cert_type").prop("checked",false);
        });
	}
	else if(gAuthMthd=="300"){
		getLegalRprsnKBCustInfo($('#legalRprsnCustId').val()); // 법정대리인 인증서 호출
		$("#includeLRPNm").val($('#legalRprsnNm').val());
		$("#includeLRPBirthGender1").val($('#legalRprsnRegNoRf').val());
		$("#includeLRPBirthGender2").val($('#legalRprsnRegNoRb').val().substr(0,1));
		$("#includeLRPOpenMode").val("body");
	}

}



//(휴대폰)인증 팝업 오픈
function openCertPopup() {
	$("#kcbValue").val(" "); //KCB 인증 확인 값
        if(gAuthMthd=="100"){
	    window.open("/system/main/phoneCertRequest","auth_popup");

	}
}

//인증서 확인을 위한, 법정대리인의 KB PIN 조회
function getStartWithLegKBPin() {
	var chk = checkParam();
	if(chk){
		//휴대폰인증 추가에 의한 로직
		$("#custBday").val($('#legalRprsnRegNoRf').val());
		if(gAuthMthd=="100"){
			//휴대폰 인증 먼저 실행
    		openCertPopup();
    	}

        // 2013.03.23 주민등록증 뒷번호 키패드 적용 후 변경됨.
        let url = '/appIf/v1/kb/ITB001';
        let param = npPfsCtrl.toJson(document.frm);
        param.soId = $("#soId").val();
        param.cuniqnoDstic = "1";

		fn_transCall("/appIf/v1/kb/ITB001", param, fn_callBack);
	}
}

function fn_callBack(tranId, data, status, inputData) {
    switch(tranId){
        case 'ITB001':
            var tmpData = data;
            data = JSON.parse(fnUnSign(data.enc));
            $("#legalRprsnRegNoRbEnc").val(tmpData.regNo);
            $("#hLegalRprsnRegNo").val(tmpData.regNo);
            $("#hiddenLegalRprsnRegNo").val(tmpData.regNo);
            $("#driverNoEnc").val(tmpData.driverNo);
                if(data !== null && data.data !== null){
                    if(data.resultCode !== '00000'){
                        callPop("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.");
                        return;
                    }

                    try{

                        var vKBPin = data.data.custIdnfr + data.data.custMgtNo;
                        if (vKBPin != "") {
                            $('#legalRprsnCustId').val(vKBPin);//KB PIN
                            $("#minorCertCustId").val(vKBPin);
                        }else {
                            $('#legalRprsnCustId').val("none");//KB PIN 없는 경우
                        }

                        //휴대폰인증 추가에 의한 로직 :
                        var cnifNo   = data.data.cnifNo; // <%-- 고객 CI 값 --%>
                        var cnifNoEnc   = data.data.cnifNoEnc; //<%-- 고객 CI값을 KB 공통 암호화 처리한 값 --%>
                        $('#cnifNo').val(cnifNo);
                        $('#cnifNoEnc').val(cnifNoEnc);

                        checkLegalRprsInfo();

                    }
                    catch(e){
                        callPop("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.");
                        $(".btn_cert_type").prop("checked",false);
                        return;
                    }
                } else {
                    callPop("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.");
                    $(".btn_cert_type").prop("checked",false);
                    return;
                }
            break;
    }
}



//인증결과콜백 - KB국민/신용카드/휴대폰 button퍼블버전
function callbackFromNormalOnBody () {
	$("input[name='c-cert-type']").prop("disabled",true);

	if(gAuthMthd=="200"){
		//modalLayer.hide('includeLayerCardCertNormal');
		$("#certMsg").text("신용카드 본인인증을 완료하였습니다.");
	}
	else if(gAuthMthd=="300"){
		//modalLayer.hide('kbMobileCertLayer');
		$("#certMsg").text("KB국민인증서 본인인증을 완료하였습니다.");
	}
	else if(gAuthMthd=="100"){
		if($("#certMsg").text() == ""){
			$("#kcbValue").val("1"); //KCB 인증 확인 값
			$("#certMsg").text("휴대폰 본인인증을 완료하였습니다.");
			$("#btnNextPage").prop('disabled',false);
		}else{ //진행가능조건 불충족시
			callbackFromNormalOnBody_rollback("");
			return;
		}
	}
	$("#authMthd").val(gAuthMthd);
	$("#btnNextPage").prop("disabled",false);

}

function callbackFromNormalOnBody_rollback(msg) {
	$("input[name='c-cert-type']").prop("disabled",false);

	if(gAuthMthd=="200"){
		modalLayer.hide('includeLayerCardCert');
	}else if(gAuthMthd=="300"){
		modalLayer.hide('minorKbMobileCertLayer');
	}else if(gAuthMthd=="100"){
		$("#kcbValue").val("");
	}
	$("#certMsg").text(msg);
	$("#authMthd").val("");

	$("#btnNextPage").prop('disabled',true);
}



//인증결과 확인 - 휴대폰인증 (법정대리인 커스텀 처리)
function insertAuthInfo2(){
	var result = $('#result').val();
	var errorMsg = $("#errorMsg").val();

	if (result == 'B000') {
		var aRslt = $('#kcbName').val();
		var bRslt = $('#legalRprsnNm').val(); //"${session_user.custNm}";

		aRslt = removeStrSpace(aRslt);
		bRslt = removeStrSpace(bRslt);

		aRslt = aRslt.toUpperCase();
		bRslt = bRslt.toUpperCase();

		//법정대리인정보와 KCB인증정보가 다를 경우
	 	if(aRslt != bRslt || $('#kcbBirthDay').val().substring(2) != $("#custBday").val()){
			callPop("휴대폰 본인인증 정보를 확인해주세요.");
			callbackFromNormalOnBody_rollback("");
			return;
		}

		callbackFromNormalOnBody();
		return;

	}else{
		if(result == "error"){
			callPop("일시적으로 오류가 발생하였습니다. 다시 시도해주세요.");
		}else{
			callPop(errorMsg);
		}
		callbackFromNormalOnBody_rollback("");
	}
}


function cuNumPlus(){
	var str2 = String($('#legalRprsnRegNoRf').val()) + String($('#legalRprsnRegNoRb').val());
	$('#hLegalRprsnRegNo').val(str2);
}

function onlyNumberIn(obj) {
	 $(obj).val( $(obj).val().replace( /[^0-9]/g, '' ) );// 숫자만입력
}

//운전면허번호세팅 (2. 법정대리인정보입력)
function setDriverNo(obj) {
	var driverNo = onlyNum($('#legalRprsnDriverNo').val());
	$(obj).val(driverNo);
}


//이름 길이 체크
function chkNmLen() {
	var len = $('#legalRprsnNm').val().length;

	if(len == 0 ) {
	    $('#errMsg_legalRprsnNm').text("이름을 정확히 입력해주세요.");
		$('#errMsg_legalRprsnNm').css('opacity','100');
		$(".btn_cert_type").prop("checked",false);
		return false;
	} else if(len < 2) {
	    $('#errMsg_legalRprsnNm2').text("2글자 이상 입력해주세요.");
		$('#errMsg_legalRprsnNm2').css('opacity','100');
		$(".btn_cert_type").prop("checked",false);
		return false;
	} else {
		$('#errMsg_legalRprsnNm').css('opacity','0');
		$('#errMsg_legalRprsnNm2').css('opacity','0');
		$(".btn_cert_type").prop("checked",false);
		return true;
	}
}


function divDriveOnOff(){
	if($('#rdoDrv').prop('checked')){
		$('#divId').css('display','');
		$('#divDrive').css('display','none');

		//주민등록증 발급일자 오류 초기화
		$("#errMsg_legalRprsnIssueDt").css('opacity','0');
		$('#legalRprsnIssueDt').val('');

		$("#cameraId").show();
        $("#cameraDr").hide();
	}else{
		$('#divDrive').css('display','');
		$('#divId').css('display','none');

		$("#errMsg_legalRprsnDriverNo").css('opacity','0');
		$('#legalRprsnDriverNo').val('');

		//운전면허증 발급일자 오류 초기화
		$("#errMsg_legalRprsnIssueDt2").css('opacity','0');
		$('#legalRprsnIssueDt2').val('');
		$("#cameraDr").show();
        $("#cameraId").hide();
	}
}

//주민번호
function juminLegFormat() {

	var len = $('#hLegalRprsnRegNo').val().length;

	if(len < 13) {
        $('#errMsg_legalRprsnRegNo').text("주민등록번호를 정확히 입력해주세요.");
        $('#errMsg_legalRprsnRegNo').show();
		$('#errMsg_legalRprsnRegNo').css('opacity','100');
		return;
	}else{
		var str = $('#hLegalRprsnRegNo').val().replace(/-/g,'');
		var chkyn = checkJumin(str);

		$('#errMsg_legalRprsnRegNo').css('opacity','0');
		$('#errMsg_legalRprsnRegNo_fa').css('opacity','0');

		if(!chkyn) {

			$('#errMsg_legalRprsnRegNo').text("주민등록번호를 정확히 입력해주세요.");
            $('#errMsg_legalRprsnRegNo').show();
            $('#errMsg_legalRprsnRegNo').css('opacity','100');
            return;
		} else if(chkLegFrgAdt(str)) {
            $('#errMsg_legalRprsnRegNo_fa').text("주민등록번호를 정확히 입력해주세요.");
            $('#errMsg_legalRprsnRegNo_fa').show();
			$('#errMsg_legalRprsnRegNo_fa').css('opacity','100');
			return;

		}
	}

}


//외국인 또는 미성년 체크 (2. 법정대리인정보입력)
function chkLegFrgAdt(juminno){
	var chkfgnyn = checkForeigner(juminno);
	var chkadtyn = checkAdult(juminno);

	if(chkfgnyn == true || chkadtyn == false) {
		return true;// 외국인 또는 미성년
	} else {
		return false;
	}
}


function checkMsgTelNo() {
	if( isEmpty($('#legalRprsnTelNo').val()) || $('#legalRprsnTelNo').val().length<10 || !chkmtelNo($('#legalRprsnTelNo').val()) ) {
		$('#errMsg_legalRprsnTelNo').css('opacity','100');
		$('#errMsg_legalRprsnTelNo').show();
		$('#errMsg_legalRprsnTelNo').text("휴대폰번호를 정확히 입력해주세요.");
	} else {
		$('#errMsg_legalRprsnTelNo').css('opacity','0');
	}
}

function chkmtelNo(phnum) {
	var regExp_ctn  = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/;
	if(regExp_ctn .test(phnum)) {
		return true;
	} else {
		return false;
	}
}

//운전면허증 번호 체크
function chkDriver(param) {
	var str = $("#legalRprsnDriverRgn").attr("data");
	var len = str.length;
	var st = $("input:radio[name=rdoSelfIdf]:checked").val();//주민등록증,운전면허증 선택
	$("#errMsg_legalRprsnDriverNo").css('opacity','0');
	if (st == '2') {
		if(len == 0) {
			$("#errMsg_legalRprsnDriverNo").css('opacity','100');
            $("#errMsg_legalRprsnDriverNo").text("운전면허증 정보를 정확히 입력해주세요.");
            $("#errMsg_legalRprsnDriverNo").show();
			return false;
		} else {
			str = $("#legalRprsnDriverNo").val().replace(/-/gi,'');
			len = str.length;

			if(len < 10 && param == '1') {
				$("#errMsg_legalRprsnDriverNo").css('opacity','100');
				$("#errMsg_legalRprsnDriverNo").text("운전면허증 정보를 정확히 입력해주세요.");
				return false;
			} else {
				$("#errMsg_legalRprsnDriverNo").css('opacity','0');
				return true;
			}
		}
	} else {
		return true;
	}
}

function chkIssDt(param) {
	var issDt = '';

	var radioVal = $("input:radio[name='rdoSelfIdf']:checked").val();
	if(radioVal == '1'){
		issDt = $("#legalRprsnIssueDt").val();
	}else if(radioVal == '2'){
		issDt = $("#legalRprsnIssueDt2").val();
	}

	var len = issDt.length;

	if(len < 8 || !isIdcardValidDate(issDt)) {
		if(radioVal == '1'){
			if(param != 'N') $("#legalRprsnIssueDt").focus();
			$("#errMsg_legalRprsnIssueDt").css('opacity','100');
			$("#errMsg_legalRprsnIssueDt").text('발급일자를 정확히 입력해주세요.');
			$("#errMsg_legalRprsnIssueDt").show();
			$("#errMsg_legalRprsnIssueDt").focus();
		}else if(radioVal == '2'){
			if(param != 'N') $("#legalRprsnIssueDt2").focus();
			$("#errMsg_legalRprsnIssueDt2").css('opacity','100');
            $("#errMsg_legalRprsnIssueDt2").text('발급일자를 정확히 입력해주세요.');
            $("#errMsg_legalRprsnIssueDt2").show();
			$("#errMsg_legalRprsnIssueDt2").focus();
		}
		return false;
	} else {
		if(radioVal == '1'){
			$("#errMsg_legalRprsnIssueDt").css('opacity','0');
			$("#errMsg_legalRprsnIssueDt").focus();
		}else if(radioVal == '2'){
			$("#errMsg_legalRprsnIssueDt2").css('opacity','0');
			$("#errMsg_legalRprsnIssueDt2").focus();
		}
		return true;
	}
}


function isIdcardValidDate(param) {
    try {
        param = param.replace(/-/g,'');

        // 자리수가 맞지않을때
        if( isNaN(param) || param.length!=8 ) {
            return false;
        }

        var year = Number(param.substring(0, 4));
        var month = Number(param.substring(4, 6));
        var day = Number(param.substring(6, 8));

    	var today = new Date();
    	var curYear = today.getFullYear();
    	if(year < 1900 || year > curYear){
    		return false;
    	}

        //var dd = day / 0;

        if( month<1 || month>12 ) {
            return false;

        }
        var maxDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var maxDay = maxDaysInMonth[month-1];

        // 윤년 체크
        if( month==2 && ( year%4==0 && year%100!=0 || year%400==0 ) ) {
            maxDay = 29;

        }
        if( day<=0 || day>maxDay ) {
            return false;

        }
        return true;

    } catch (err) {
        return false;
    }
}

//OCR촬영 인식정보로 셋팅하기
function setFromOCRRecogInfo(ocrFormInfo) { //각 업무화면에서 구현할것.
	f_setFromOCRRecogInfo(ocrFormInfo);
}
function setFromOCRRecogInfo_forward(ocrFormInfo) { //includeKCBForMinor 콜백을 먼저 탈 경우
	f_setFromOCRRecogInfo(ocrFormInfo);
}
function f_setFromOCRRecogInfo(ocrFormInfo) {
	if (ocrFormInfo == 'IDCARD') {
		if ( $('.layer_wrap').find("#ocrAfFormInfo").text() == '주민등록증' ) {
			//이름
			$('#legalRprsnNm').val( $("#ocrIdName").val() );

			//주민번호
			$('#legalRprsnRegNoRf').val( $("#ocrIdNum6").val() );
			$('#legalRprsnRegNoRb').val( $("#ocrIdNum7").val() );

			//주민등록증 발급일자
			$('#legalRprsnIssueDt').val( $("#ocrCertDate").val().replace( /[^0-9]/g, '' ) );

		} else if ( $('.layer_wrap').find("#ocrAfFormInfo").text() == '운전면허증' ) {
			//이름
			$('#legalRprsnNm').val( $("#ocrIdName").val() );

			//주민번호
			$('#legalRprsnRegNoRf').val( $("#ocrIdNum6").val() );
			$('#legalRprsnRegNoRb').val( $("#ocrIdNum7").val() );

			//면허번호

			for(var i =0; i<areaArr.length; i++){

			    if( areaArr[i].value == $("#ocrDrvLicRgn").val() ){
			        $('#legalRprsnDriverRgn').text(areaArr[i].text );
                    $("#legalRprsnDriverRgn").attr("data",areaArr[i].value);
                    $("#driverRgn").val(areaArr[i].value);
			    }
			}

            $("#legalRprsnDriverNo").val($("#ocrDrvLicNo").val().replace( /[^0-9]/g, '' ));

			//운전면허증 발급일자
			$('#legalRprsnIssueDt2').val( $("#ocrCertDate").val().replace( /[^0-9]/g, '' ) );
		}

	} else if (ocrFormInfo == 'CREDIT') {

	} else if (ocrFormInfo == 'USIM') {

	}
}

// 관계 레이어팝업에서 선택 시
function fnRelSel(){

    var selectedRelText = $(".rel_select").find(".on > a").text();
    var selectedRelCd=  $(".rel_select").find(".on > a").attr("data");

    $("#legalRprsnRel").text(selectedRelText);
    $("#legalRprsnRel").attr("data",selectedRelCd);

}

// 지역 리스트 프린트
function printArea(){

    var driveListArea = $('#driveLayer').find("ul");
    var html = '';

    for(var i=0; i<areaArr.length; i++){
        if(i==0){
            html += '<li  class="on">';
        }else{
            html += '<li>';
        }

        html += '   <a href="#none" role="button"  id="' +  areaArr[i].value + '">' + areaArr[i].text + '</a></li>';
    }

     $('#driveList').append(html);

    $("#legalRprsnDriverRgn").on("click", function(e) {
        $.ohyLayer({
            titleUse:true,
            title:"지역 선택하기",
            content:'#driveLayer',
            type:'bottom',
            closeUse:true,
            dimAct:true,
        });

    });

}

// 지역 레이어 팝업 선택 버튼 눌렀을때
function setArea(){
    $("#legalRprsnDriverRgn").text($("#driveList").find(".on > a").text());
    $("#legalRprsnDriverRgn").attr("data",$("#driveList").find(".on > a").attr("id"));
    $("#driverRgn").val($("#driveList").find(".on > a").attr("id"));
}


//  팝업
function callPop(msg, okCallbackFn, cancelBtn, cancelCallbackFn) {

    let option = {
                  msg           : msg
                 ,title         : ""
                 ,cfrmYn : cancelBtn || false
                 ,okCallback    : okCallbackFn || null
                 ,cancelCallback : cancelCallbackFn || null
    };
    popalarm(option);
    return false;
}
