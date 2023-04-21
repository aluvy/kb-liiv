
//유심가입(가입신청 관련js)
//초기세팅 :: 유심정보 기입력시 유심수령방법 출력 안함

function init(){
    $("#select2-id-jumin").click(); //주민등록 선택 디폴트

	$("#ocrAttchSoId").val(soId); //OCR

	fnLMPM000009($("#chrgPln").val());// 변경 가능요금제 불러오기 (한번만 실행)

    if(soId == "02"){//KT 경우 법정대리인 운전면허 본인인증이 불가함 (PC0)
        $('input[name="c-select2-id"]').eq(1).parent().css("display","none");
    }

	//kbCard 초기 세팅
	//$("#card02 >button").click();

	// 모바일브랜치 가입 시 권유직원번호까지 넘어온 경우
	if($("#dstic").val().includes("AO") && $("#empid").val() != ""){
		selectKbEmpAO($("#empid").val());
	}
}

//가입신청 TO-BE 스텝별 화면이동 변경으로 인한 데이터 체크
function joinRequestDataChk(pageId){
    var compName = "";
    var altMsg = "";
    var goToNext = true;

    if(pageId == "page_bizType") {
        if(isEmpty($('input[name="c-cust-tp"]:checked').val())) {
            altMsg = "가입대상을 선택해 주세요.";
        } else {
            setProgressBarDiv();
        }
    } else if(pageId == "page_custType") {
        if(isEmpty($('input[name="c-join-type"]:checked').val())) {
            altMsg = "가입대상을 선택해 주세요.";
        } else {
            if($("#custTp").val() == "IFX") {
                let opt = {
                    msg : "외국인 가입은 국내 체류 기간 30일이상 되어야 가입 가능합니다.<br/>(D-2/E-9 체류코드의 경우, 180일이상 체류 필요)<br/>*주한미국인은 가입불가능합니다.",
                    cfrmYn : false,
                    okCallback : goPageForJoin
                };
                popalarm(opt);
                return;
            }
            setProgressBarDiv();
        }
    } else if(pageId == "page_idtDefault1") {
        if(isEmpty($('input[name="rdoSelfIdf"]:checked').val())) {
            altMsg = "신분증을 선택해 주세요.";
        }
    } else if(pageId == "page_idtDefault2") {
        if($("#custTp").val() != "MIN"){
            if(!checkInputOption()) return; // 이름, 주민번호, 신분증별 정보 확인(미성년자가 아닌 경우)
        }
    } else if(pageId == "page_idtInputMinor1") {
        if(isEmpty($('input[name="c-select2-id"]:checked').val())) {
            altMsg = "신분증을 선택해 주세요.";
        }
    } else if(pageId == "page_idtInputMinor2") {
        if(!checkInputLegalRprsnOption()) return; // 법정대리인 신분증 인증

    } else if(pageId == "page_idtInputMinor3") {
        if(!checkInputLegalRprsnOption2()) return; // 법정대리인 관계, 휴대폰, 서류 등 확인

    } else if(pageId == "page_idtInputForeign1") {
        if(isEmpty($('input[name="c-id-foreigner"]:checked').val())) {
            altMsg = "외국인 인증방법을 선택하세요.";
        }
    } else if(pageId == "page_idtInputForeign2") {
        if(!chkFnmLen()) {
            altMsg = "이름을 확인해 주세요.";
        } else if(!chkFnoLen()) {
            altMsg = "실명번호를 확인해 주세요.";
        } else if(!chkIssfDt()) {
            altMsg = "발급일자를 확인해 주세요.";
        } else if(!chkForeignerStyCdLen()) {
            altMsg = "체류코드를 확인해 주세요.";
        } else if($("#foreignerStrtDt").val() == "" || $("#foreignerExpiratDt").val() == "" || $("#foreignerStrtDt").val() >= $("#foreignerExpiratDt").val()) {
            altMsg = "체류기간을 확인해 주세요.";
        } else {
            var date =  new Date();
            var today = dateToYYYMMDD(date).replace( /[.:|\`~_\- ]/gi, '' );
            var foreignerStrtDt = $("#foreignerStrtDt").val().replace( /[.:|\`~_\- ]/gi, '' );

			if(foreignerStrtDt > today){
                altMsg = "현재 체류중인 외국인만 가입 가능합니다.";
			}
        }

    } else if(pageId == "page_idtInputOther") {
        // 가입사전조회 여부 확인
    } else if(pageId == "page_idtInputBiz1") {
        if(!chkBznoLen()) {
            altMsg = "사업자 등록번호를 확인해 주세요.";
        } else if(!chkBznmLen()) {
            altMsg = "상호명을 확인해 주세요.";
        }
    } else if(pageId == "page_idtInputBiz2") {
        // 세금계산서 발행정보
    } else if(pageId == "page_idtInputBiz3") {
    // 세금계산서 발행정보
    } else if(pageId == "page_idtCert") {
        if($("#custId").val() == ""){
            altMsg = "본인인증을 진행해주세요.";
        }
    } else if(pageId == "page_prodInfo") {
        // 특화요금제 관련 입력 정보 확인 추가 필요
        if($("#applTp").val() != "M" && $("#svcTp").val() != "04"){
            if(!chkRatePlanOption()) return;
            infoDeny(3); // 2단계 신정내용 저장
        }
    } else if(pageId == "page_watch") {
        altMsg = chkWatchRatePlanOption1();
    } else if(pageId == "page_mobileAdd") {
        altMsg = chkWatchRatePlanOption2();
        if(isEmpty(altMsg)) infoDeny(3); // 2단계 신정내용 저장
    } else if(pageId == "page_transfer") {
        setRemoveErrClass("mcoCd");
        setRemoveErrClass("mtelNo");

		if($("#mcoCd").val() == ""){
            altMsg = "사용중인 통신사를 선택해주세요.";
            setAddErrClass("mcoCd", altMsg);
		} else if(isEmpty($("#mtelNo").val()) || $("#mtelNo").val().length < 10) {
            altMsg = "휴대폰번호를 정확히 입력해주세요.";
            setAddErrClass("mtelNo", altMsg);
        } else {
            infoDeny(3); // 2단계 신정내용 저장
            if(!applMYn) return; //사전동의 완료된 경우만 pass
        }

    } else if(pageId == "page_loginInfo1") {
        if(!chkItemOption()) return; // 로그인아이디, 비밀번호 확인
        goToNext = false; // 패스워드 체크 callback에서 페이지 이동

    } else if(pageId == "page_loginInfo2") {
        // 이메일 SKIP
    } else if(pageId == "page_loginInfo3") {
        // 주소지 SKIP
    } else if(pageId == "page_payAlarm") {
        if(isEmpty($('input[name="c-billwray"]:checked').val())) {
            altMsg = "청구서 수신방법을 선택해 주세요.";
        }
        // 모델번호, 일련번호, IMEI, EID 추가로 확인
    } else if(pageId == "page_payWay") {
        if(isEmpty($('input[name="c-paywray"]:checked').val())) {
            altMsg = "요금 납부방법을 선택해 주세요.";
        } else if($("#joinDataSharingYn").val() != "Y" && !$("#agreeCheck4").prop("checked")){
            altMsg = "필수 동의사항에 동의해 주세요";
        } else {
            if($('input[name="c-paywray"]:checked').val() == "ac") {
                if(!$("#page_account").hasClass("display")){
                    var acntNo = $("#acntNoSel option:selected").val() ;
                    if(acntNo == "" || acntNo == null || acntNo == undefined){
                        acntNo = $("#acntNo").val();
                    }
                    if(acntNo == "" || acntNo == null || acntNo == undefined){
                        altMsg = "계좌번호를 선택해 주세요.";
                    }
                }
            }
        }
    } else if(pageId == "page_account") {
        // 계좌등록 확인
    } else if(pageId == "page_card") {
        // 카드등록 확인, 카드번호확인
        if(isEmpty($("#cardComp6").val())) {
            altMsg = "신용카드를 선택해 주세요.";
        } else if(isEmpty($("#cardNum").val()) || $("#cardNum").val().length < 14) {
            altMsg = "신용카드 번호를 정확히 입력해 주세요.";
        } else if($("#cardEffcprd").val() < 5 || !chkValidTerm($("#cardEffcprd").val())){
            altMsg = "유효기간을 정확히 입력해 주세요.";
        }
    } else if(pageId == "page_widthdrawAgree1") {
        // 출금동의등록확인
        if(isEmpty($('input[name="c-certification"]:checked').val())) {
            altMsg = "자동이체 출금동의 방법을 선택해 주세요.";
        } else if($('input[name="c-certification"]:checked').val() == "2" && $("#arsCertCellPhoneNo").val() == ""){
            altMsg = "ARS 인증받을 전화번호를 정확히 입력해주세요.";
        }
    } else if(pageId == "page_widthdrawAgree2") {
        // 약관동의항목 확인
    } else if(pageId == "page_recommInfo") {
        // 추천친구등록
        if(isEmpty($('input[name="c-recomm-type"]:checked').val())) {
            altMsg = "추천 친구를 선택해 주세요.";
        } else if(isEmpty($('input[name="c-recomm-type2"]:checked').val())) {
            altMsg = "추천 직원을 선택해 주세요.";
        } else {
            // 배송정보 필요없는 경우 마지막 단계로
            if($("#dlvrMthd").val() == "4" || $("#dlvrMthd").val() == "5") {
                goToNext = false;
                chkItem("check");
            }
        }
    } else if(pageId == "page_delivery1") {
        if(isEmpty($('input[name="c-receive-type"]:checked').val())) {
            altMsg = "유심 배송방법을 선택해 주세요.";
        }
    } else if(pageId == "page_delivery2") {
        // SKIP
    } else if(pageId == "page_delivery3") {
        // SKIP
    } else if(pageId == "page_delivery4") {
        setRemoveErrClass("dvrlNm");
        setRemoveErrClass("dvrlTelNo");

        if(isEmpty($("#dvrlNm").val()) || $("#dvrlNm").val().length == 0) {
            altMsg = "수령인을 정확히 입력해주세요.";
            setAddErrClass("dvrlNm", altMsg);
        }else if(isEmpty($("#dvrlTelNo").val()) || $("#dvrlTelNo").val().length < 10) {
            altMsg = "연락 가능번호를 정확히 입력해주세요.";
            setAddErrClass("dvrlTelNo", altMsg);
        }
    }

    if(!isEmpty(altMsg)) {
        goToNext = false;
        let opt = {
            msg : altMsg,
            cfrmYn : false
        };
        popalarm(opt);
        return;
    }
    if(goToNext) goPageForJoin();
}

//특정 페이지 오픈시 동작(accordionSetting 대체)
function beforeOpenPageForJoin(step, pageId){
    if(pageId == "page_recommInfo") {
        if (recoUsrId != ''){
            if($("#friendUsrIdH").val() == ''){
                $("#friendUsrId").val(recoUsrId);
                selectKbUsrId();
            }
            recoUsrId='';
        }
    }
}

function setProgressBarDiv() {
    // progress bar step 추가, 제거 영역
    // 워치요금제
    if($("#page_watch").hasClass("display")){
        $(".progress_wrap > .step16").css("display", "block");
        $(".progress_wrap > .step17").css("display", "block");
    } else {
        $(".progress_wrap > .step16").css("display", "none");
        $(".progress_wrap > .step17").css("display", "none");
    }
    // 계좌등록
    /*if($("#page_account").hasClass("display")){
        $(".progress_wrap > .step24").css("display", "block");
    } else {
        $(".progress_wrap > .step24").css("display", "none");
    }
    // 카드등록
    if($("#page_card").hasClass("display")){
        $(".progress_wrap > .step25").css("display", "block");
    } else {
        $(".progress_wrap > .step25").css("display", "none");
    }
    // 출금이체동의 - 본인 인증 전까지는 영역 확보
    if($("#joinDataSharingYn").val() != "Y") {
        if($("#btnCardAuthCmp").css("display") == "none" && $("#btnKbsignAuthCmp").css("display") == "none"){
            $(".progress_wrap > .step26").css("display", "block");
            $(".progress_wrap > .step27").css("display", "block");
        } else {
            if($("#page_widthdrawAgree1").hasClass("display")){
                $(".progress_wrap > .step26").css("display", "block");
                $(".progress_wrap > .step27").css("display", "block");
            } else {
                $(".progress_wrap > .step26").css("display", "none");
                $(".progress_wrap > .step27").css("display", "none");
            }
        }
    }*/
    // 유심배송지
    if($("#dlvrMthd").val() == "1" || $("#dlvrMthd").val() == "3") {
        $(".progress_wrap > .step31").css("display", "block");
        $(".progress_wrap > .step32").css("display", "block");
        $(".progress_wrap > .step33").css("display", "block");
    } else {
        $(".progress_wrap > .step31").css("display", "none");
        $(".progress_wrap > .step32").css("display", "none");
        $(".progress_wrap > .step33").css("display", "none");
    }
}

//본인확인 :: 가입가능시간 체크
function checkTime() {
	var today = "";
	var hour = "";

	$.ajax({
	    url: '/system/main/getServerNow',
	    type: 'POST',
	    success: function(data) {
	    	today = data.curdttm;
	    	hour = today.substr(8,2);
	    	gToday = today.substr(0,8);

	    	if(hour >= '20' || hour < '08') {
                modalLayer.show({
                    titleUse : true,
                    title : "개통 가능 시간에<br>다시 시도해 주세요",
                    id : "openTimeLayer",
                    type : "bottom",
                    closeUse : false
                });
	    	} else {
	    		if($("#custTp").val() == "II"){
	    			if($("#regNoRf").val() == ""){
	    				gAge = 0;
	    			}

	    			if(gAge < 20 && gAge > 0){
                        let opt = {
                            msg : "만4세 ~ 19세 미만 어린이/청소년 가입 대상입니다.",
                            cfrmYn : false
                        };
                        popalarm(opt);
						return;
					}else{
						checkExceptTime_join();
					}
	    		}else{
	    			checkExceptTime_join();
	    		}
	    	}
	    },
	    error: function(e) {
			console.log(e.responseText.trim());
			return '';
	    }
	});
}
//본인확인 :: 특정 예외시간 체크
function checkExceptTime_join() {
	var today = '';
	var hour = '';

	$.ajax({
	    url:  '/system/main/getServerNow',
	    type: 'POST',
	    success: function(data) {
	    	today = data.curdttm;
	    	today = today.substr(0,today.length-2);

			var val = $("input:radio[name=rdoSelfIdf]:checked").val();//주민등록증,운전면허증 선택
	    	if(val == "2" && today >= "202105290900" && today <= "202105291800") {
	    		var strMsg  = "연계기관 시스템 작업으로<br/>운전면허증 이용이 불가합니다.<br/>주민등록증 이용을 부탁드립니다.";

                let opt = {
                    msg : strMsg,
                    cfrmYn : false
                };
                popalarm(opt);
	    	} else {
	    		checkInput();
	    	}
	    },
	    error: function(e) {
			console.log(e.responseText.trim());
			return '';
	    }
	});
}
//본인확인 :: 본인인증 1단계에서 필요정보만 체크
//checkInput       : AS-IS 본인인증 필요 정보 체크
//checkInputOption : TO-BE 단계별 정합성 체크시 본인 신분증 인증 별도 체크(성인, 신용카드미소지자, 사업자)
//checkInputLegalRprsnOption  : TO-BE 단계별 정합성 체크시 법정대리인 신분증 인증 별도 체크(미성년자)
//checkInputLegalRprsnOption2 : TO-BE 단계별 정합성 체크시 법정대리인 상세정보 별도 체크(미성년자)
function checkInputOption() {
    if(!chkNmLen()) {
        let opt = {
            msg : "이름을 정확히 입력해주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return false;
    } else if (!chkJumin()) {
        let opt = {
            msg : "주민등록번호를 정확히 입력해주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return false;
    } else if (!chkDriver('1')) {
        let opt = {
            msg : "운전면허증 정보를 정확히 입력해주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return false;
    }

    if($('input:radio[name="rdoSelfIdf"][value="1"]').prop('checked')){
        if ($("#JIssDt").val() == "" && $("#JIssDt").val().length != 8) {
            setAddErrClass("JIssDt", "발급일자를 정확히 입력해주세요.");

            let opt = {
                msg : "발급일자를 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return false;
        }else{
            var returnMsg = isValiIssuDate($("#JIssDt").val());
            if(returnMsg != ""){
                setAddErrClass("JIssDt", "발급일자를 정확히 입력해주세요.");

                let opt = {
                    msg : returnMsg,
                    cfrmYn : false
                };
                popalarm(opt);
                return false;
            } else {
                setRemoveErrClass("JIssDt");
            }
        }
    }else{
        if ($("#driverRgn").val() == '') {
            setAddErrClass("driverNo", "지역을 정확히 입력해주세요.");
            let opt = {
                msg : "지역을 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return false;
        }
        if ($("#driverNo").val() == '') {
            setAddErrClass("driverNo", "운전면허번호를 정확히 입력해주세요.");
            let opt = {
                msg : "운전면허번호를 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return false;
        }
        if ($("#driverIssDt").val() == '' && $("#driverIssDt").val().length != 8) {
            setAddErrClass("driverIssDt", "발급일자를 정확히 입력해주세요.");
            let opt = {
                msg : "발급일자를 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return false;
        }else{
            var returnMsg = isValiIssuDate($("#driverIssDt").val());
            if(returnMsg != ""){
                setAddErrClass("driverIssDt", "발급일자를 정확히 입력해주세요.");
                let opt = {
                    msg : returnMsg,
                    cfrmYn : false
                };
                popalarm(opt);
                return false;
            } else {
                setRemoveErrClass("driverIssDt");
            }
        }
    }
    return true;
}
function checkInputLegalRprsnOption() {
    var vLegalRprsnNm = $('#legalRprsnNm').val();
    var vLegalRprsnNoRf = $('#legalRprsnRegNoRf').val();
    var vLegalRprsnNoRb = $('#legalRprsnRegNoRb').val();
    var vDriverRgn = $("#legalRprsnDriverRgn").val();
    var vDriverNo = $("#legalRprsnDriverNo").val();
    var vJIssDt = $("#legalRprsnJIssDt").val();
    var vIssDt = $("#legalRprsnIssueDt").val();

    if(!chkLegNmLen()) {
        let opt = {
            msg : "법정대리인 이름을 정확히 입력해주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return false;
    } else if(!chkLegJumin()) {
        let opt = {
            msg : "법정대리인 주민번호를 정확히 입력해주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return false;
    } else if(!chkLegDriver('1')){
        let opt = {
            msg : "법정대리인 운전면허증 정보를 정확히 입력해주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return false;
    }

    setRemoveErrClass("legalRprsnJIssDt");
    setRemoveErrClass("legalRprsnDriverRgn");
    setRemoveErrClass("legalRprsnDriverNo");
    setRemoveErrClass("legalRprsnIssueDt");

    if($('input:radio[name="c-select2-id"][value="1"]').prop('checked')) {
        if(vJIssDt == '') {
            let opt = {
                msg : "발급일자를 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            setAddErrClass("legalRprsnJIssDt", opt.msg);
            return false;
        }else{
            var returnMsg = isValiIssuDate(vJIssDt);
            if(returnMsg != ""){
                let opt = {
                    msg : returnMsg,
                    cfrmYn : false
                };
                popalarm(opt);
                setAddErrClass("legalRprsnJIssDt", opt.msg);
                return false;
            }
        }
    } else {
        if(vDriverRgn == '') {
            let opt = {
                msg : "지역을 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            setAddErrClass("legalRprsnDriverRgn", opt.msg);
            return false;
        }
        if(vDriverNo == '') {
            let opt = {
                msg : "운전면허번호를 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            setAddErrClass("legalRprsnDriverNo", opt.msg);
            return false;
        }
        if(vIssDt == '') {
            let opt = {
                msg : "발급일자를 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            setAddErrClass("legalRprsnDriverNo", opt.msg);
            return false;
        }else{
            var returnMsg = isValiIssuDate(vIssDt);
            if(returnMsg != ""){
                let opt = {
                    msg : returnMsg,
                    cfrmYn : false
                };
                popalarm(opt);
                setAddErrClass("legalRprsnIssueDt", opt.msg);
                return false;
            }
        }
    }
    //getLegKBCustInfo();//법정대리인
    return true;
}
function checkInputLegalRprsnOption2() {
    var vLegalRprsnRel = $("#legalRprsnRel").val();
    var vLegalRprsnTelNo = $("#legalRprsnTelNo").val();

    setRemoveErrClass("legalRprsnRel");
    setRemoveErrClass("vLegalRprsnTelNo");

    if(vLegalRprsnRel == '') {
        let opt = {
            msg : "법정대리인의 관계를 정확히 입력해 주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        setAddErrClass("legalRprsnRel", "관계를 정확히 입력해 주세요.");
        return false;
    } else if(vLegalRprsnTelNo == ''|| vLegalRprsnTelNo.length < 10) {
        let opt = {
            msg : "법정대리인의 휴대폰번호를 정확히 입력해 주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        setAddErrClass("legalRprsnTelNo", "휴대폰번호를 정확히 입력해 주세요.");
        return false;
    }

    if($("#applTp").val() == "N" || $("#applTp").val() == "M"){
        if(!$("#chkFileAfter").is(":checked") && $("#fileList1").text() ==""){
            let opt = {
                msg : "증빙서류를 첨부해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
        }
    }
    return true;
}
function checkInput() {
	var applTp = $("#applTp").val();
	var custTp = $("#custTp").val();
	gAge = 0;

	//가입유형 (명의변경시 신청정보확인)
	if(applTp == "T"){
		if(!chkNmLen()) {
            let opt = {
                msg : "이름을 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
			return;
		}else if($("#custNm").val().trim() != $('#trnsTakeNm').val().trim()){
            let opt = {
                msg : "명의변경 정보와 이름이 다릅니다.",
                cfrmYn : false
            };
            popalarm(opt);
			return;
		}
		/*22.11.23 지서연 사원 추가
		 * 주니어 요금제 명의변경 시 양수인이 미성년자가 맞는지 확인하는 로직 추가
		 * 안내문구는 임시 작성
		 */
		var ratePlan = $("#chrgPln").val();
		if(ratePlan == "PD00000914" || ratePlan == "PD00000916" || ratePlan == "PD00000918" || ratePlan == "PD00000920" || ratePlan == "PD00000922" || ratePlan == "PD00000923") {
			getNowAge(function(age){
				 if(age <= 4 || age > 19) {
                    let opt = {
                        msg : "명의를 받을 요금제는 미성년자 대상 요금제입니다.",
                        cfrmYn : false
                    };
                    popalarm(opt);
				    return;
				 }
			 });
		}/*22.11.24 이서현 대리 추가
		 * 시니어 요금제 명의변경 시 양수인이 만64세 이상이 맞는지 확인하는 로직 추가
		 */
		else if(ratePlan == "PD00000925" || ratePlan == "PD00000927" || ratePlan == "PD00000929" || ratePlan == "PD00000930"){
			getNowAge(function(age){
				 var data = Number(age) - Number("1");//만나이
				 if(data < 65) {
                    let opt = {
                        msg : "골든라이프 LTE 요금제는 만 65세 이상 고객이 가입 가능한 요금제입니다.<br/>가입 대상을 확인해주세요.",
                        cfrmYn : false
                    };
                    popalarm(opt);
					return;
				 }
			 });
		}/*22.12.22 이서현 대리 추가
		 * 기존 Flex LTE(구) 명의변경시 판매종료 요금제 가입불가 팝업 추가
		 */
		else if(ratePlan == "PD00000245"){
            let opt = {
                msg : "판매중단된 요금제입니다.<br/> Flex LTE(신) 요금제를 확인해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}
	}

	//가입자유형
	if(custTp == "II" || custTp == "UNC") {
		checkInputOption(); // 본인 신분증 인증

		// 미성년자체크
		getNowAge(function(age){
			if(age <= 4){
                let opt = {
                    msg : "만 4세이상 가입 가능합니다.",
                    cfrmYn : false
                };
                popalarm(opt);
				return;
			} else if(age < 20){
                let opt = {
                    msg : "만4세~19세미만 어린이/청소년 가입 대상입니다.<br> 가입자 유형을 확인해주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
				return;
			}else{
				getKBCustInfo();
			}
		});

	}else if(custTp == "GEF"){
		//개인사업자인경우
		checkInputOption(); // 본인 신분증 인증

		if (!chkBznoLen()) {
            let opt = {
                msg : "사업자등록번호를 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
			return;
		} else if (!chkBznmLen()) {
            let opt = {
                msg : "상호명을 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
			return;
		}  else {
			getKBCustInfo();
		}
	}else if(custTp == "IFX"){
		//외국인인경우
		if(!chkFnmLen()) {
            let opt = {
                msg : "이름을 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
			return;
		} else if (!chkFnoLen()) {
            let opt = {
                msg : "실명번호를 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
			return;
		} else if (!chkIssfDt()) {
            let opt = {
                msg : "발급일자를 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
			return;
		}else{
			var returnMsg = isValiIssuDate($("#issfDt").val());
			if(returnMsg != ""){
                let opt = {
                    msg : returnMsg,
                    cfrmYn : false
                };
                popalarm(opt);
				return;
			}
		}

		if (!chkForeignerStyCdLen()) {
            let opt = {
                msg : "체류코드를 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
			return;
		} else if ($("#foreignerStrtDt").val() == "" || $("#foreignerExpiratDt").val() == "" || $("#foreignerStrtDt").val() >= $("#foreignerExpiratDt").val()) {
            let opt = {
                msg : "체류기간을 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
			return;
		} else {
			checkForeignerCode($("#foreignerStyCd").val());
		}
	}else if(custTp == "MIN"){
		//미성년자인경우
		//가입사전조회인경우
		if($("#btnMinorJoinAuth").css("display") != "none"){
			if(!chkNmLen()) {
                let opt = {
                    msg : "이름을 정확히 입력해주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
				return;
			} else if (!chkJumin()) {
				/*if($("#errMsg_regNo").css("display") == 'none') { to-be 확인
                    let opt = {
                        msg : "내국인 미성년자만 가입 신청이 가능합니다.",
                        cfrmYn : false
                    };
                    popalarm(opt);
				    return;
				} else {*/
                    let opt = {
                        msg : "주민등록번호를 정확히 입력해주세요.",
                        cfrmYn : false
                    };
                    popalarm(opt);
                    return;
				/*}
				return;*/
			} else {
				var param = new Object();
				param.birthGender = fnUnSign($("#regNoH").val()).substr(0,7);
				var num7 = (param.birthGender).substr(6, 1);
				if(num7 == "5" || num7 == "6" || num7 == "7" || num7 == "8"){
                    let opt = {
                        msg : "외국인 회원 가입 대상입니다.",
                        cfrmYn : false
                    };
                    popalarm(opt);
                    return;
				}
				// 미성년자 여부 체크
				getNowAge(function(age){
					if(age > 4 && age <= 19){
			    		getKBCustInfo();
			    	}else if(age > 19){
                        let opt = {
                            msg : "개인 회원 가입 대상입니다.",
                            cfrmYn : false
                        };
                        popalarm(opt);
                        return;
			    	}else{
                        let opt = {
                            msg : "만 4세이상 가입 가능합니다.",
                            cfrmYn : false
                        };
                        popalarm(opt);
                        return;
			    	}
				});
			}
		//법정대리인 신용카드 본인확인인경우
		}else{
			checkInputLegalRprsnOption(); // 법정대리인 신분증 확인
			checkInputLegalRprsnOption2(); // 법정대리인 관계 확인
			getLegKBCustInfo();//법정대리인
		}
	}else{
        let opt = {
            msg : "가입자 유형을 선택해주세요",
            cfrmYn : false
        };
        popalarm(opt);
        return;
	}
}
//미성년자확인
function getNowAge(successCallback){

	if(gAge != 0) {
        successCallback(gAge);
    } else {
        $.ajax({
            url:  '/system/main/getNowAge',
            type: 'POST',
            data: npPfsCtrl.toJson(document.frm),
            beforeSend : function(xhr, set) {
                let token = $("meta[name='_csrf']").attr("content");
                let header = $("meta[name='_csrf_header']").attr("content");
                xhr.setRequestHeader(header, token);
            },
            success: function(result) {
                var age = result.age;
                gAge = age;
                successCallback(age);
            },
            error: function(e) {
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
            },
            complete: function() {}
        });
    }
}
//본인확인 :: KB PIN 확인
function getKBCustInfo(){

	let cuniqnoDstic = "";
	let cuniqno = "";
	let cuniqno2 = "";

	if($("#custTp").val() == "GEF"){
		cuniqnoDstic = "2";
		cuniqno = $("#bzno").val();

	}else if($("#custTp").val() == "IFX"){
		cuniqnoDstic = "1";
		$("#regNoRf, #regNoRb").val("");

	}else{
		cuniqnoDstic = "1";
		$("#fNo").val("");
	}

	let url = '/appIf/v1/kb/ITB001';
	let param = npPfsCtrl.toJson(document.frm);
	param.soId = $("#soId").val();
	param.cuniqno = cuniqno;
	param.cuniqnoDstic = cuniqnoDstic;

	fn_transCall(url, param, fn_certCallBack);
}
// 콜백
function fn_certCallBack(tranId, data){
	switch(tranId){
	case 'ITB001':	// KB고객정보조회

        $("#regNoH").val(data.regNo);
        $("#driverNoH").val(data.driverNo);
        data = fnUnSign(data.enc);

        if(!isEmpty(data)){
            data = JSON.parse(data);
        }

        if(isEmpty(data) || data.resultCode !== '00000') {
            popalarm({
                msg: "일시적으로 오류가 발생하였습니다. 다시 시도해주세요.",
                cfrmYn: false
            });
            return;
        } else {
            var vCustnm = data.data.custnm;
            if(vCustnm == null || vCustnm == undefined || vCustnm == "undefined")  vCustnm = "";
            if(vCustnm != "" && $("#custTp").val() == "MIN"){
                if(sTarget == "prod"){
                    if(vCustnm != $('#custNm').val()){
                        let opt = {
                            msg : "입력하신 이름을 확인해주세요.",
                            cfrmYn : false
                        };
                        popalarm(opt);
                        return;
                    }
                }
            }

            if(data.resultCode !== '00000'){
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
            }

            if(data.data.owbnkCustYn == '0'){
                modalLayer.show({
                    titleUse : true,
                    title : "KB국민은행 계좌 미 보유 고객으로<br> 계좌 개설 후 가입이 가능합니다.<br> 국민은행 계좌를 개설하시겠어요?",
                    id : "moveToMobileBranLayer",
                    type : "confirm"
                });
                return;
            }

            var custId = data.data.custIdnfr + data.data.custMgtNo; //KB PIN
            $('#custId').val(custId);
            $('#certCustId').val(custId);

            // 데이터쉐어링 가입이면 모회선 KB PIN과 비교
            if($('#joinDataSharingYn').val() == "Y" && $("#custTp").val() != "IFX") {
                if($('#parentsCustId').val() != custId) {
                    let opt = {
                        msg : "모회선 본인확인 정보와 일치하지 않습니다.",
                        cfrmYn : false
                    };
                    popalarm(opt);
                    return;
                }
            }

            try{
                var mAcnoCnt  = 0;//Number(data.data.ondmdAcnoCnt);//요구불계좌건수
                var mAcnoArry = data.data.ondmdAcnoArray;//요구불계좌정보 ARRAY
                var mAcno     = data.data.ondmdAcno;//요구불계좌번호

                var cnifNo   = data.data.cnifNo;//고객 CI 값
                var cnifNoEnc   = data.data.cnifNoEnc;// 고객 CI값을 KB 공통 암호화 처리한 값

                var arsltArry = data.data.custArsltDscntArray;//고객실적할인 ARRAY
                var arsltCnt  = 0;//Number(data.data.custArsltDscntCnt);//고객실적할인건수

                var arsltCdAmt = "";
                var arsltCd    = data.data.custArsltDscntCd;//고객실적할인코드
                var arsltAmt   = data.data.custArsltDscntAmt;//고객실적할인금액

                var usimCnt = data.data.usimCnt;	//유심발급횟수
                var cifEmail = data.data.cifEmail; //CIF이메일

                $('#cnifNo').val(cnifNo);
                $('#cnifNoEnc').val(cnifNoEnc);

                if(usimCnt < 3){
                    $("#usimCnt").val('1');//면제
                }else{
                    $("#usimCnt").val('3');//익월청구
                }
                arsltCnt = (arsltArry == '' || arsltArry == null || arsltArry == undefined) ? 0 : arsltArry.length;

                /************
                * 고객실적할인정보
                */
                if(arsltCnt > 0){
                    for(var i = 0 ; i < arsltArry.length ; i++ ){
                        if(i == 0){
                            arsltCdAmt  = arsltArry[i].custArsltDscntCd ;
                        } else {
                            arsltCdAmt  = arsltCdAmt + '|' + arsltArry[i].custArsltDscntCd ;
                        }
                    }//end for
                } else {
                    arsltCdAmt = arsltCd ;
                }
                $('#arsltArry').val(arsltCdAmt);


                /************
                * 고객계좌번호
                */
                mAcnoCnt = (mAcnoArry == '' || mAcnoArry == null || mAcnoArry == undefined) ? 0: mAcnoArry.length;
                if (mAcnoCnt > 0) {
                    for (var i = 0; i < mAcnoArry.length; i++) {
                        if (i == 0) {
                            mAcno = String(mAcnoArry[0].ondmdAcno);
                        } else {
                            mAcno = mAcno + '|' + String(mAcnoArry[i].ondmdAcno);
                        }
                    }//end for
                }
                if( mAcnoArry.length == 1){ //계좌번호 1개일 경우
                    $("#mAcno").val(mAcno);
                }
                $('#mAcnoCnt').val(mAcnoCnt);//보유 계좌 갯수
                $('#mAcnoArry').val(JSON.stringify(mAcnoArry));//계좌번호	리스트

                try{
                    /************
                    * CIF 자택 주소
                    */
                    var vOwhusZip = data.data.owhusZip;
                    var vOwhusHanglAddr = data.data.owhusHanglAddr;
                    var vOwhusHDtailAddr = data.data.owhusHDtailAddr;

                    gHusZip = vOwhusZip;
                    gHusAddr = vOwhusHanglAddr;
                    gHusAddrDtl = vOwhusHDtailAddr;

                    if(vOwhusZip != null && vOwhusZip != "" && $('#postcode').val() == "" && vOwhusZip.length == 5){
                        gHusZip = vOwhusZip;
                        if(vOwhusHanglAddr != null && vOwhusHanglAddr != "" && $('#bassAddr').val() == "" ) {
                            vOwhusHanglAddr = fnReplaceAll(vOwhusHanglAddr,'　',' ');
                            vOwhusHanglAddr = fnReplaceAll(vOwhusHanglAddr,'  ',' ');
                            gHusAddr = vOwhusHanglAddr;
                        }
                        if(vOwhusHDtailAddr != null && vOwhusHDtailAddr != "" && $('#dtlAddr').val() == "") {
                            vOwhusHDtailAddr = fnReplaceAll(vOwhusHDtailAddr,'　',' ');
                            vOwhusHDtailAddr = fnReplaceAll(vOwhusHDtailAddr,'  ',' ');
                            gHusAddrDtl = vOwhusHDtailAddr;
                        }
                    }

                    /************
                    * CIF 직장 주소
                    */
                    var post = data.data.post;
                    var basAddr = data.data.basAddr;
                    //var basDefaddr = data.data.basDefaddr; basDefaddr->defaddr 바뀐 거 아닌지?
                    var basDefaddr = data.data.defAddr;

                    gBasZip = post;
                    gBasAddr = basAddr;
                    gBasAddrDtl = basDefaddr;

                    if(post != null && post != "" && $('#wPostCode').val() == "" && post.length == 5){
                        gBasZip = post;
                        if(basAddr != null && basAddr != "" && $('#bassAddr').val() == "" ) {
                            basAddr = fnReplaceAll(basAddr,'　',' ');
                            basAddr = fnReplaceAll(basAddr,'  ',' ');
                            gBasAddr = basAddr;
                        }
                        if(basDefaddr != null && basDefaddr != "" && $('#dtlAddr').val() == "") {
                            basDefaddr = fnReplaceAll(basDefaddr,'　',' ');
                            basDefaddr = fnReplaceAll(basDefaddr,'  ',' ');
                            gBasAddrDtl = basDefaddr;
                        }
                    }

                    /************
                    * 이메일 step 단축용 기본 주소지 세팅
                    * - 이메일이 없는 경우 이메일주소 입력 스텝에서 입력을 받도록 처리
                    *   (이메일 skip 요청이 있었지만 납부방법 등록을 위해 이메일 정보가 필요함)
                    */
                    //if(cifEmail != null && cifEmail != "" && cifEmail.trim() != ""){
                    //    $("#emlD2").css("display", "block");
                        $("#emlD2").val(cifEmail.trim());
                    /*} else {
                        $("#emlD2").css("display", "none");
                        $("#page_loginInfo2").addClass("display");
                    }*/

                    /************
                    * 주소 step 단축용 기본 주소지 세팅
                    * 1. 자택 우선
                    * 2. 직장 차선
                    */

                    if(gHusZip != null && gHusZip != "" && gHusAddr != null && gHusAddr != "") {
                        // 기본주소
                        $("#postcode").val(vali(gHusZip));
                        $("#bassAddr").val(vali(gHusAddr));
                        $("#dtlAddr").val(vali(gHusAddrDtl));
                        // 배송주소
                        $("#DPostcode").val(vali(gHusZip));
                        $("#dvrlAddr").val(vali(gHusAddr));
                        $("#dDtlAddr").val(vali(gHusAddrDtl));
                        // 배송지 문구
                        $("#strDPostCode").text(vali(gHusZip));
                        $("#strdvrlAddr").text(vali(gHusAddr) + " " + vali(gHusAddrDtl));
                    } else if(gBasZip != null && gBasZip != "" && gBasAddr != null && gBasAddr != "") {
                        // 기본주소
                        $("#postcode").val(vali(gBasZip));
                        $("#bassAddr").val(vali(gBasAddr));
                        $("#dtlAddr").val(vali(gBasAddrDtl));
                        // 배송주소
                        $("#DPostcode").val(vali(gBasZip));
                        $("#dvrlAddr").val(vali(gBasAddr));
                        $("#dDtlAddr").val(vali(gBasAddrDtl));
                        // 배송지 문구
                        $("#strDPostCode").text(vali(gBasZip));
                        $("#strdvrlAddr").text(vali(gBasAddr) + " " + vali(gBasAddrDtl));
                    }
                }
                catch(e){
                    console.log(e);
                }
            }
            catch(e){
                console.log(e);
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
            }
        }

        if(mAcnoCnt != NaN && mAcnoCnt != undefined){
            setTimeout(function(){
                checkSvcCnt(mAcnoCnt);//가입회선수 체크
            },110);
        }else{
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
        }
        break;

	case 'chkUsrPwd':	// 패스워드 체크
		if(data.resultCode == 'FAIL'){
			popalarm( {
				msg :  data.resultMsg,
				cfrmYn : false
			});
			if(!isEmpty(data.compId)) {
                setAddErrClass(data.compId, data.resultMsg);
			} else {
                setRemoveErrClass(data.compId);
			}
		} else {
            setRemoveErrClass("usrPw");
            setRemoveErrClass("usrPwRe");
		    goPageForJoin();
		}
	    break;
    }
}
//본인확인 :: 현재 가입 회선수 체크
function checkSvcCnt(acnoCnt){
	var appInfo = 'soId=' +$("#soId").val() + '&custId=' + $('#custId').val()+'&custTp='+$('#custTp').val();
	var baseCnt = 3;

	$.ajax({
		url: '/join/steps/step2/getSvcCnt',
		type: 'POST',
		data: appInfo,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success: function(responseData) {
			var data = JSON.parse(responseData);
			var cnt = Number(data.svcCnt);

			if($("#custTp").val() == "IFX") baseCnt = 1;

			if(cnt < baseCnt || cnt == NaN || cnt == undefined){
				if(acnoCnt > 0){
					checkNoPayInfo(); //KB-PIN기준 미납 체크
				} else {
                    modalLayer.show({
                        titleUse : true,
                        title : "KB국민은행 계좌 미 보유 고객으로<br> 계좌 개설 후 가입이 가능합니다.<br> 국민은행 계좌를 개설하시겠어요?",
                        id : "moveToMobileBranLayer",
                        type : "confirm"
                    });
				}
				return false;
			} else {
                let opt = {
                    msg : baseCnt + "개 회선초과 신청 불가능합니다.",
                    cfrmYn : false
                };
                popalarm(opt);
				return true;
			}

		},
		error: function(request,status,error){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}
	});
}
//KB-PIN기준 미납 체크
function checkNoPayInfo(){
	var appInfo = 'soId='+$("#soId").val() + '&custId=' + $('#custId').val();
	$.ajax({
		url: '/join/steps/step2/getNoPayInfo',
		type: 'POST',
		data: appInfo,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success: function(responseData) {
			try{
				var unpayYn = responseData.data.unpayYn;
				console.log("getNoPayInfo unpayYn -->"+responseData.data.unpayYn);
				if(unpayYn == "Y" && Number(fnCheckNull(responseData.data.unpayAmt) >= 200)){
					var alertStr = "";
					var unpayAmt = makeComma(fnCheckNull(responseData.data.unpayAmt))+"원";

					alertStr += "자사(Liiv M) 미납 내역이 확인되어, 가입이 불가합니다.<br/>";
					alertStr += "*미납금액 : "+unpayAmt+"<br/>";
					alertStr += "*고객번호 : "+responseData.data.custId.substr(0,5) + "-" + responseData.data.custId.substr(5,5) +"<br/>";
					alertStr += "*청구계정번호 : "+responseData.data.pymAcntId+"<br/>";
					alertStr += "*회선번호 : "+responseData.data.svcTelNo.substr(0,7)+ "****" +"<br/>";
					alertStr += "*개통일 : "+responseData.data.rateStrtDt.substr(0,4) + "/" + responseData.data.rateStrtDt.substr(4,2) + "/" + responseData.data.rateStrtDt.substr(6,2) + "<br/>";
					alertStr += "*미납회선수 : "+responseData.data.unpayCtrtCnt+"<br/><br/>";
					alertStr += "미납금액 납부는 Liiv M 고객센터(1522-9999)를 통해 문의 부탁드립니다.<br/><br/>";
					alertStr += "※ 여러 미납회선을 보유하신 경우, 하나의 회선 정보만 표기될 수 있습니다.";

                    let opt = {
                        msg : alertStr,
                        cfrmYn : false
                    };
                    popalarm(opt);
                    return;
				}
				else{
					getSvcAppInfo();
				}
			}
			catch(e){
				console.log(e);
			}

			/*
			var data = JSON.parse(responseData);
			var cnt = Number(data.usimFeeCnt);

			$("#usimFeeCnt").val(cnt);

			if(cnt > 3) {
				popalarm("고객님은 유심비용 선납 대상입니다.<br>비용 납부 확인 후 유심 배송이 시작됩니다.", "info", false, "", getSvcAppInfo);
			} else {
				getSvcAppInfo();
			}
			*/
		},
		error: function(request,status,error){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}
	});
}
//본인확인 :: 서비스 신청 정보 조회
function getSvcAppInfo(){
	console.log("1-7.서비스 신청 정보 조회");
	var appInfo  = "soId="+$("#soId").val() + "&custId=" + $('#custId').val();
	$.ajax({
		url  : '/join/steps/step2/getSvcAppInfo',
		type : 'POST',
		data : appInfo,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success: function(responseData){
			var data = JSON.parse(responseData);
			if(data.applStat !== '03' && data.applStat !== '04' && data.applStat !== '05'){
				if(data.shortTermCnt != undefined && data.shortTermCnt >= 3){ //임시로 1건이라도 있으면 바로 던진다
				    // 메인으로 이동 필요
					let opt = {
                        msg : "고객님은 최근 1개월 이내에 가입 가능한 횟수를 초과하였습니다! (3회)<br/>회선별 개통일로부터 30일 경과 후 가입이 가능합니다.<br/>(가입가능일 " + data.strtDt + ")",
                        cfrmYn : false,
                        okCallback : goToMain
                    };
                    popalarm(opt);

				}else{
					if(gAuthMthd == "002"){// 미성년자 가입사전조회인경우 : 신분증 진위검증 안함
						openKCBCertPopup();
						return;
					}

					if($("#soId").val() == "03"){
						sendSKSU00101(); 	//신분증검증 SKSU00101 ->  KCB본인인증 팝업 오픈
					}else if($("#soId").val() == "02"){
						openKCBCertPopup(); //신분증검증없이 KCB본인인증 팝업 오픈
					}else if($("#soId").val() == "01"){
						checkOpenYn_1(); 	//고객의 개통 가능 여부 체크 CM804 -> 신분증검증 CM806 ->  KCB본인인증 팝업 오픈
					}
				}
			} else {
                // 메인으로 이동 필요
                let opt = {
                    msg : "현재 개통 전 회선이 있습니다. 개통 완료 후 추가 통신가입을 진행해 주세요.",
                    cfrmYn : false,
                    okCallback : goToMain
                };
                popalarm(opt);
			}
		},
		error : function(request, err){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}
	});
}
//본인확인 :: KCB본인인증 팝업 오픈
function openKCBCertPopup() {
	if(gAuthMthd == "001"){//미소지자: 가입사전조회인 경우
		$("#btnJoinAuthCmp").css("display", "block");//사전조회 버튼-> 사전조회완료 버튼
		$("#btnJoinAuth").css("display", "none");
		$("#btnPhoneAuth").removeClass("disabled");

        let opt = {
            msg : "가입 가능 대상자입니다. 계속해서 휴대폰 본인확인을 진행해주세요.",
            cfrmYn : false
        };
        popalarm(opt);

        //1. 가입대상선택
        $("#page_bizType input, #page_custType input").prop("disabled",true);
        //2. 신분증인증정보
        $("#page_idtDefault1 input, #page_idtDefault2 input, #page_idtDefault2 .section button").prop("disabled",true);
        //3. 미성년자 정보
//        $("#page_idtInputMinor1 input, page_idtInputMinor2 input, #page_idtInputMinor3 input").prop("disabled",true);
//        $("#page_idtInputMinor2 .section button, #page_idtInputMinor3 .section button").prop("disabled",true);
        //4. 외국인 정보
//        $("#page_idtInputForeign1 input, #page_idtInputForeign2 input").prop("disabled",true);
        //5. 인증서 미소지자
        //6. 사업자정보
//        $("#page_idtInputBiz1 input, #page_idtInputBiz2 input, #page_idtInputBiz3 input, #page_idtInputBiz3 .section button").prop("disabled",true);
        //7. 인증수단
//        $("#page_idtCert input").prop("disabled",true); //수정가능정보 활성화
//		$("#step01  input, #step01 select").prop("disabled",true);	//본인확인정보 비활성화

	}else if(gAuthMthd=="002"){//미성년자 : 가입사전조회인경우
		$("#btnMinorJoinAuthCmp").css("display", "block");//사전조회 버튼-> 사전조회완료 버튼
		$('#btnMinorJoinAuth').css('display', 'none');

        let opt = {
            msg : "가입 가능 대상자입니다. 계속해서 통신 추가 정보 입력을 진행해 주세요.",
            cfrmYn : false
        };
        popalarm(opt);

        //1. 가입대상선택
        $("#page_bizType input, #page_custType input").prop("disabled",true);
        //2. 신분증인증정보(본인확인정보)
        $("#page_idtDefault2 input, #page_idtDefault2 .section button").prop("disabled",true);
    	$("#childDiv input, #childDiv select, #defaultDiv input").prop("disabled",false); //수정가능정보 활성화

	}else if(gAuthMthd=="200"){ //신용카드 인증
		initKCBCertPopupNormal();// 초기화
		if($("#custTp").val() == "IFX"){
			$("#includeNm").val($("#fNm").val());
			$("#custNm").val($("#fNm").val());
			//$("#regNoH").val($("#fNo").val());
		}
		else if($("#custTp").val() == "MIN") $("#includeNm").val($("#legalRprsnNm").val());
	    else $("#includeNm").val($("#custNm").val());

	    modalLayer.show({
           titleUse : true,
           title : "신용카드 본인인증",
           id : "includeLayerCardCertNormal",
           type : "fullpopup",
           closeUse : false,
       });

	}else if(gAuthMthd=="300"){ //KB 모바일 인증서 인증
		initKbsignCertPopupNormal();// 초기화
		if($("#custTp").val() == "IFX"){
			$("#includeNm").val($("#fNm").val());
			$("#custNm").val($("#fNm").val());
			//$("#regNoH").val($("#fNo").val());
		}

	    modalLayer.show({
           titleUse : true,
           title : "KB국민인증서 본인인증",
           id : "kbMobileCertLayer",
           type : "confirm",
           closeUse : false,
        });

	}else if(gAuthMthd=="301"){//계좌일경우_(필수)자동이체 출금동의
		$("#cmsKBDigitalYn").val("Y");
		initKbsignCertPopupNormal();// 초기화
		$("#btnKbsignAuth").css("display", "none"); // 출금동의 전 본인인증이 무조건 선행되므로 인증서인증요청버튼 표시안함

	    modalLayer.show({
           titleUse : true,
           title : "KB국민인증서 전자서명",
           id : "kbMobileCertLayer",
           type : "confirm",
           closeUse : false,
        });
	}
}
///본인확인 :: 고객정보 확인 후 분기
function saveCheckData(){
	if($("#custId").val() == undefined || $("#custId").val() == null || $("#custId").val() == ""){
        modalLayer.show({
            titleUse : true,
            title : "KB국민은행 계좌 미 보유 고객으로<br> 계좌 개설 후 가입이 가능합니다.<br> 국민은행 계좌를 개설하시겠어요?",
            id : "moveToMobileBranLayer",
            type : "confirm"
        });
	}else {
		saveCustInfo();//고객정보 저장

		if(gProdGrpCd == "U08"){ //더주는 적금요금제 그룹
			saveProdCtrtCnt(); //더주는 적금요금제 보유여부 체크
		}
		/*22.11.29 지서연 사원 추가
		 * 주니어 요금제 회선수 체크
		 */
		if(gProdGrpCd == "U03" || gProdGrpCd == "K08"){
			juniorProdCtrtCnt();
		}
	}
}
//본인확인 :: 고객 정보 저장
function saveCustInfo(){
	var custInfo = 'soId='+ $("#soId").val() + '&custId=' + $('#custId').val();

	if($("#custTp").val() == "II" || $("#custTp").val() == "UNC" || $("#custTp").val() == "MIN"){
		custInfo += '&regNo=' + $('#regNoH').val();
		custInfo += '&custNm=' + $('#custNm').val();
		custInfo += '&custTp=II&custCl=A';

	}else if($("#custTp").val() == "GEF"){
		custInfo += '&regNo=' + $('#regNoH').val();
		custInfo += '&custNm=' + $('#custNm').val();
		custInfo += '&bzno=' +$("#bzno").val() ;
		custInfo += '&bznm=' +$("#bznm").val() ;
		custInfo += '&custTp=' +$("#custTp").val() + '&custCl=A';

		//개인사업자
		custInfo += "&repNm="+$("#txRprsNm").val()+"&busiCndt="+$("#txBusiCndt").val()+"&busiTp="+$("#txBusiTp").val();

	}else if($("#custTp").val() == "IFX"){
		custInfo += '&regNo=' + fnSign($('#fNo').val());
		custInfo += '&custNm=' + $('#fNm').val();
		custInfo += '&foreignerStyCd=' +$("#foreignerStyCd").val();
		custInfo += '&foreignerStrtDt=' +$("#foreignerStrtDt").val().replace( /[.:|\`~_\- ]/gi, '' );
		custInfo += '&foreignerExpiratDt=' +$("#foreignerExpiratDt").val().replace( /[.:|\`~_\- ]/gi, '' );
		custInfo += '&custTp=' +$("#custTp").val() + '&custCl=A';

	}
	custInfo += '&regrId=APP001' + '&chgrId=APP001';

	$.ajax({
		url:'/join/steps/step2/saveCustInfo',
		type:'POST',
		data: custInfo,
		dataType: 'json',
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success: function(data){
			getCustSvcApplInfo();
		},
		error : function(request, err){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false,
                okCallback : goLiiv
            };
            popalarm(opt);
            return;
		}
	});
}
//가입내용 :: 가입신청중 신청정보 조회
function getCustSvcApplInfo(){
	var appInfo = 'custId=' + $('#custId').val();

    $.ajax({
        url: '/join/steps/getAllAppInfo',
        type: 'POST',
        data: appInfo,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
        success: function(data){
            var applInfo = data.applInfo;
            if(applInfo != ""){
                $("#custSvcApplInfo").val(JSON.stringify(applInfo));

                modalLayer.show("tempSaveLayer"); //작성중인 가입신청정보가 있습니다. 이어서 작성하시겠습니까?
            } else {
                // 서비스신청정보 저장
                // 1. tempSaveLayer 팝업에서 버튼 클릭 이후에 저장하도록 수정(as-is 소스에서 팝업 겹침 현상 발생)
                // 2. 작성중 신청정보가 없는 경우 서비스 신청 정보 저장
                saveSvcApplInfo_1();
            }
        },
        error : function(request, err){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false,
                okCallback : goLiiv
            };
            popalarm(opt);
            return;
        }
    });
}
//본인확인후 :: 서비스 신청 정보 저장
function saveSvcApplInfo_1(){
	var appInfo = 'soId='+$("#soId").val() + '&applSeqNo=' + $('#applSeqNo').val() + '&custId=' + $('#custId').val();
	appInfo += '&modelNo=02';
	//appInfo += '&dlvdstRcpntCellPhnNo='+ $('#dlvdstRcpntCellPhnNo').val();

	//	가입상담 콜
	//	var agrCnsFlag = $("input:checkbox[id='agrCnsFlag']").is(":checked");
	//	if(agrCnsFlag) appInfo += "&agrCnsYn=Y";
	//	else appInfo += "&agrCnsYn=N";

	if($("#custTp").val() == "IFX"){
		appInfo += '&corpRegNo=' + fnSign($('#fNo').val().replace(/-/g,'')) ;
		appInfo += '&idcardTp='   + $("input[name=c-id-foreigner]:checked").val();
		appInfo += '&issueDt='   + $('#issfDt').val() ;
		appInfo += '&birthGender=' + $('#fNo').val().replace(/-/g,'').substr(0,7) ;
		appInfo += '&creditCheckSucYn=&fileAddYn=&legalRprsnYn=&legalRprsnNm=&legalRprsnRegNo=&legalRprsnDriverNo=&legalRprsnIpinNo=&legalRprsnRel=&legalRprsnIssueDt=&legalRprsnPstNo=&legalRprsnBassAddr=&legalRprsnDtlAddr=&legalRprsnEml=&legalRprsnTelNo=';
	}
	else if($("#custTp").val() == "II" || $("#custTp").val() == "UNC" || $("#custTp").val() == "GEF"){
		appInfo += '&corpRegNo=' + $('#regNoH').val() ;
		appInfo += '&birthGender=' + fnUnSign($('#regNoH').val()).substr(0,7) ;

		if($('#driverNo').val() == ""){
			appInfo += '&idcardTp=01';
			appInfo += '&driverNo=';
			appInfo += '&issueDt='   + $('#JIssDt').val() ;
		}
		else {
			appInfo += '&idcardTp=02';
			//appInfo += '&driverNo='  + fnSign($('#driverRgn').val() + $('#driverNo').val().replace(/-/g,''));
			appInfo += '&driverNo='  + $('#driverNoH').val();
			appInfo += '&issueDt='   + $('#driverIssDt').val() ;
		}
		appInfo += '&creditCheckSucYn=&fileAddYn=&legalRprsnYn=&legalRprsnNm=&legalRprsnRegNo=&legalRprsnDriverNo=&legalRprsnIpinNo=&legalRprsnRel=&legalRprsnIssueDt=&legalRprsnPstNo=&legalRprsnBassAddr=&legalRprsnDtlAddr=&legalRprsnEml=&legalRprsnTelNo=';

	}
	else if($("#custTp").val() == "MIN"){
		appInfo += '&corpRegNo=' + $('#regNoH').val();
		appInfo += '&birthGender=' + fnUnSign($('#regNoH').val()).substr(0,7) ;
		appInfo += '&fileAddYn=Y';
		//법정대리인 정보
		appInfo += '&legalRprsnYn=Y&legalRprsnNm=' + $('#legalRprsnNm').val();
		appInfo += '&legalRprsnRegNo=' + $('#legalRprsnRegNoH').val();
		//appInfo += '&legalRprsnDriverNo=' + fnSign($('#legalRprsnDriverRgn').val() + $('#legalRprsnDriverNo').val().replace(/-/g,'')); // 키패드 체크 필요
		appInfo += '&legalRprsnDriverNo=' + $('#driverNoH').val(); //fnSign($('#legalRprsnDriverRgn').val() + $('#legalRprsnDriverNo').val().replace(/-/g,'')); // 키패드 체크 필요
		appInfo += '&legalRprsnRel=' + $('#legalRprsnRel').val();
		appInfo += '&legalRprsnTelNo=' + $('#legalRprsnTelNo').val().replace(/-/g,'');
		if($('#legalRprsnDriverNo').val().replace(/-/g,'') == ""){
			appInfo += '&legalRprsnIssueDt=' + $('#legalRprsnJIssDt').val();
		}else{
			appInfo += '&legalRprsnIssueDt=' + $('#legalRprsnIssueDt').val();
		}

	}
	appInfo += "&npYn="+$("#npYn").val()+"&applTp="+$("#applTp").val();// 가입유형 신규,번호이동
	appInfo += '&fstAuthMthd=' + $('#fstAuthMthd').val();
	appInfo += '&noGudsvcAppl=N'+'&payPlanDt=25'+'&procPsnInchgrId=APP001';
	appInfo += '&regrId=APP001' + '&chgrId=APP001';
	appInfo += "&applStat=01"+"&applPhs=02";
	appInfo += "&kbBranchCd="+$("#kbBranchCd").val()+"&kbBranchNm="+$("#kbBranchNm").val()+"&kbDeptCd="+$("#kbDeptCd").val()+"&kbDeptNm="+$("#kbDeptNm").val()+"&kbEmpNo="+$("#kbEmpNo").val()+"&kbEmpNm="+$("#kbEmpNm").val();
	appInfo += "&usimType="+$("#usimCnt").val()+"&esimYn="+$("#esimYn").val();

	//명의변경인경우
	if($("#applTp").val() == "T"){
		appInfo += '&trnsGiveTelNo='+ fnSign($('#trnsGiveTelNo').val());
		appInfo += '&trnsRel='+ $('#trnsRel').val();
		appInfo += '&trnsTakeNm='+ fnSign($('#trnsTakeNm').val());
	}else{
		appInfo += '&trnsGiveTelNo=&trnsRel=&trnsTakeNm=';
	}

    $.ajax({
	    url: '/join/steps/step2/saveCustSvcApplInfo',
	    type: 'POST',
	    data: appInfo,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
	    success: function(responseData){
	    	var data = JSON.parse(responseData);
	    	console.log("1단계저장완료"+ JSON.stringify(responseData));
		    $("#applSeqNo").val(data.applSeqNo);
		    $("#mvnoOrdNo").val(data.mvnoOrdNo);
	    	$("#ajax").remove();

	    	//정상
		    if( $("#applSeqNo").val() != "" ){
		        //본인확인정보 비활성화
		        //1. 가입대상선택
		    	$("#page_bizType input, #page_custType input").prop("disabled",true);
		    	//2. 신분증인증정보
		    	$("#page_idtDefault1 input, #page_idtDefault2 input, #page_idtDefault2 .section button").prop("disabled",true);
		    	//3. 미성년자 정보
		    	$("#page_idtInputMinor1 input, #page_idtInputMinor2 input, #page_idtInputMinor3 input").prop("disabled",true);
		    	$("#page_idtInputMinor2 .section button, #page_idtInputMinor3 .section button").prop("disabled",true);
		    	//4. 외국인 정보
		    	$("#page_idtInputForeign1 input, #page_idtInputForeign2 input").prop("disabled",true);
		    	//5. 인증서 미소지자
		    	//6. 사업자정보
		    	$("#page_idtInputBiz1 input, #page_idtInputBiz2 input, #page_idtInputBiz3 input, #page_idtInputBiz3 .section button").prop("disabled",true);
		    	//7. 인증수단
		    	$("#page_idtCert input").prop("disabled",true);
		    	$(".doc_file input, .detail_tax input").prop("disabled",false); //수정가능정보 활성화

		    	//LTE워치요금제 :: 모회선리스트가져오기
		    	if($("#svcTp").val() == "04") getSvcInfoListW();

		    	//특화요금제 대상확인 및 할인예상금액 재세팅(통신요금)
		    	changeRatePlanView();

		    	//고객센터 상담단계 세팅 및 배너 노출
		    	$("#counselApplStat").val('1');
		    	$("#areaCounselBanner").css("display","block");

	            goPageForJoin(); // 본인인증 후 다음스텝 이동

		    	//신청단계 세팅
//		    	accordionSetting('1');

		    }else{
		    //error
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
		    }
	    },
	    error : function(request, err){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
	    }
    });
}
//작성중인 신청정보 세팅
function setCustSvcApplInfo(){
    //팝업에서 버튼 클릭 이후에 저장하도록 수정(as-is 소스에서 팝업 겹침 현상 발생)
    saveSvcApplInfo_1();

	var applInfo = JSON.parse($("#custSvcApplInfo").val());
	var custTp =  $("#custTp").val();

	if(applInfo != null){
		//가입자유형별
		if(custTp == "MIN"){
			//$("#legalRprsnNm").val(vali(applInfo.legalRprsnNm));	//(법정대리인)이름
			//$("#legalRprsnRel").val(vali(applInfo.legalRprsnRel));	//(법정대리인)관계
		}else if(custTp == "GEF"){
			/*$("#bzno").val(vali(applInfo.txBzno));
			$("#bznm").val();
			$("#txRprsNm").val(vali(applInfo.txRprsNm));
			$("#txBusiCndt").val(vali(applInfo.txBusiCndt));	//업태
			$("#txBusiTp").val(vali(applInfo.txBusiTp));		//업종
			$("#busAddr").val(vali(applInfo.txBasAddr));
			$("#busAddrDtl").val(vali(applInfo.txDtlAddr));
			$("#BPostCode").val(vali(applInfo.txPostNo));
			$("#chrgNm").val(vali(applInfo.txChrgNm));
			$("#busTelNo").val(vali(applInfo.txChrgTelNo));		//담당자직장연락처
			$("#busMTelNo").val(vali(applInfo.txChrgCphnno));	//담당자휴대폰번호
			$("#busEml").val(vali(applInfo.txChrgEmail));		//담당자이메일*/

		}else if(custTp == "IFX"){
			$("#foreignerStyCd").val(vali(applInfo.foreignerStyCd));
			if(vali(applInfo.foreignerStrtDt) != "" && vali(applInfo.foreignerExpiratDt) != ""){
				$("#foreignerStrtDt").val(dateToYYYMMDD3(applInfo.foreignerStrtDt));
				$("#foreignerExpiratDt").val(dateToYYYMMDD3(applInfo.foreignerExpiratDt));
			}
		}
		//유심수령방법 1:우체국 2:당일배송 3:지점방문 4: 유심있음 5:배송완료
		if(applInfo.dlvrMthd != ""){
			//배송정보
			$("#dvrlAddr").val(vali(applInfo.dlvrBassAddr));
			$("#dDtlAddr").val(vali(applInfo.dlvrDtlAddr));
			$("#DPostcode").val(vali(applInfo.dlvrPstNo));
			$("#dvrlNm").val(vali(applInfo.dlvdstRcpntNm));
			$("#dvrlTelNo").val(vali(applInfo.dlvdstRcpntCellPhnNo));

		}else if(applInfo.dlvrMthd == ""){
            $("#dvrlNm,#dvrlTelNo").val("");
            //고객요청으로 무조건 ITB001의 주소정보를 배송주소로 세팅
            if(gHusZip != null && gHusZip != "" && gHusAddr != null && gHusAddr != "") {
                $("#strDPostCode").text(vali(gHusZip));
                $("#strdvrlAddr").text(vali(gHusAddr) + " " + vali(gHusAddrDtl));
                $("#DPostcode").val(vali(gHusZip));
                $("#dvrlAddr").val(vali(gHusAddr));
                $("#dDtlAddr").val(vali(gHusAddrDtl));
            } else if(gBasZip != null && gBasZip != "" && gBasAddr != null && gBasAddr != "") {
                $("#strDPostCode").text(vali(gBasZip));
                $("#strdvrlAddr").text(vali(gBasAddr) + " " + vali(gBasAddrDtl));
                $("#DPostcode").val(vali(gBasZip));
                $("#dvrlAddr").val(vali(gBasAddr));
                $("#dDtlAddr").val(vali(gBasAddrDtl));
            } else {
                $("#dvrlAddr,#dDtlAddr,#DPostcode,#dvrlNm,#dvrlTelNo").val("");
            }
		}
		//가입유형
		if($("#applTp").val() == "M" && applInfo.applTp == "M"){
			//$("#mcoCd").val(vali(applInfo.befNp));
			$("#mtelNo").val(vali(applInfo.chgBfrTelNo));
		}
		//공통 : 고객정보
		if(vali(applInfo.usrId) != ""){
			$("#usrId").val(applInfo.usrId);
			$("#usrId").prop("disabled", true);
			$("#divPw").css("display", "none");
			$("#divPwRe").css("display", "none");
			$("#idstep").val("3");
            $(".btn_check .btn_type").css("display", "none");
		}

		//저장된 주소 불러올때 우편번호가 잘못된 경우 리셋처리
		if(applInfo.zipCd == "12345" || applInfo.zipCd == "" || applInfo.zipCd == null){

            //고객요청으로 무조건 ITB001의 주소정보를 기본주소로 세팅
            if(gHusZip != null && gHusZip != "" && gHusAddr != null && gHusAddr != "") {
                $("#postcode").val(vali(gHusZip));
                $("#bassAddr").val(vali(gHusAddr));
                $("#dtlAddr").val(vali(gHusAddrDtl));
            } else if(gBasZip != null && gBasZip != "" && gBasAddr != null && gBasAddr != "") {
                $("#postcode").val(vali(gBasZip));
                $("#bassAddr").val(vali(gBasAddr));
                $("#dtlAddr").val(vali(gBasAddrDtl));
            } else {
                $("#bassAddr,#dtlAddr,#postcode").val("");
            }
		}
		else{
			$("#bassAddr").val(vali(applInfo.baseAddr));
			$("#dtlAddr").val(vali(applInfo.addrDtl));
			$("#postcode").val(vali(applInfo.zipCd));
		}

		//공통 : 납부방법
		if(vali(applInfo.cardCorpCd) != ""){
			if(applInfo.pymMthd == "CM"){
				$("#select_pay_acc").prop("checked",true);
				$("#bankNoH6").val(vali(applInfo.acno));
				$("#bankComp6").val(vali(applInfo.cardCorpCd));
				$("#bankComp6H").val(vali(applInfo.cardCorpCd));

				$("#bankCompNm6H").val($("#newBankLayer").find(".img_item.c_"+vali(applInfo.cardCorpCd)).text());

				setBankNumber();
			}else if(applInfo.pymMthd == "CC"){
				$("#cardNoH6").val(vali(applInfo.acno));
				$("#cardComp6").val(vali(applInfo.cardCorpCd));

				//$("#cardCompNm6H").val($("#card"+vali(applInfo.cardCorpCd)+"> button >p").text());
				setCardNumber();
			}
		}
		// 공통 : 청구서 유형
		if(applInfo.billMdmSmsYn == "Y"){
			$("#c-bill-sms").prop("checked",true);
		}else if(applInfo.billMdmEmlYn == "Y"){
			$("#c-bill-email").prop("checked",true);
		}
		if(vali(applInfo.busiEmad) != ""){
			var email = applInfo.busiEmad.split("@");
			if(email.length >= 2){
				$("#eml").val('');
				$("#emlD").val("i");
				$("#eml").prop("disabled",true);
				$("#emlD2").css("display","block")
				$("#emlD2").val(applInfo.busiEmad);
			}
		}
		// 공통 : 추천인
		$("#kbBranchCd").val(vali(applInfo.kbBranchCd));
		$("#kbBranchNm").val(vali(applInfo.kbBranchNm));
		$("#kbEmpNo").val(vali(applInfo.kbEmpNo));
		$("#kbEmpNm").val(vali(applInfo.kbEmpNm));
		$("#kbDeptCd").val(vali(applInfo.kbDeptCd));//04.08 추가컬럼 (부서코드,부서명)
		$("#kbDeptNm").val(vali(applInfo.kbDeptNm));

		if($("#kbBranchCd").val() != ""){ // to-be 확인
			var html = "";
			html = '<p id="kbEmpInfo">'+$("#kbBranchNm").val()+' '+$("#kbEmpNm").val()+' (직원번호 '+$("#kbEmpNo").val()+')</p>';
			$("#recommStafResultDiv").html(html);
			//$("#recommStafResultDiv").css("display","block");
			$("#c-recomm-office2").prop("checked",true);
		}
	}
}
//외국인 체류코드 상세조회 체크
function checkForeignerCode(scd){
	var data = new Object();
	data.commonGrp = "CM00084";
	data.commonCd = scd;

	var url = "/system/main/getCommonDataSelectOne";
	$.ajax({
		type : "post",
		url : url,
		data: data,
		async: false,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success : function(data) {
			if(data.commonDataSelectOne.commonCd != null && data.commonDataSelectOne.commonCd != ""){
				if(data.commonDataSelectOne.refCode2 == "PPS"){
					//popalarm("가입 불가능한 체류코드입니다.", "info", false,"확인","foreignerStyCd");
                    let opt = {
                        msg : "가입 불가능한 체류코드입니다.",
                        cfrmYn : false
                    };
                    popalarm(opt);
                    return;
				}
				else{
					var vForeignerStrtDt = $("#foreignerStrtDt").val().replace( /[.:|\`~_\- ]/gi, '' );
					var vForeignerExpiratDt = $("#foreignerExpiratDt").val().replace( /[.:|\`~_\- ]/gi, '' );
					var diff = getDateDiff(gToday,vForeignerExpiratDt);

					if(data.commonDataSelectOne.commonCd == "D-2" || data.commonDataSelectOne.commonCd == "E-9"){
						if(diff < 180){
                            let opt = {
                                msg : "남은 체류기간이 180일이상 되어야 가입 가능합니다.",
                                cfrmYn : false
                            };
                            popalarm(opt);
                            return;
						}
						else{
							//PASS
							$("#errMsg_foreignerStyCd").hide();
							$("#foreignerStyCd").removeClass("error");
							getKBCustInfo();
						}
					}
					else{
						if(diff < 30){
                            let opt = {
                                msg : "남은 체류기간이 30일이상 되어야 가입 가능합니다.",
                                cfrmYn : false
                            };
                            popalarm(opt);
                            return;
						}
						else{
							//PASS
							$("#errMsg_foreignerStyCd").hide();
							$("#foreignerStyCd").removeClass("error");
							getKBCustInfo();
						}
					}
				}
			}
			else{
				//popalarm("체류코드를 정확히 입력해주세요.", "info", false,"확인","foreignerStyCd");
                let opt = {
                    msg : "체류코드를 정확히 입력해주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
			}
		}
	});
}
function goLiiv(){
	var data = new Object();
	data.commonGrp = "CM00067";
	var targetUrl = "https://m.naver.com";

	var url = "/system/main/getCommonData";
	$.ajax({
		url: url,
		type: "POST",
		data: data,
		async: false,
		success : function(data) {
			for(var i=0; i<data.commonData.length; i++) {
				if(data.commonData[i].commonCd == '03' ) {
					targetUrl = data.commonData[i].refCode;
				}
			}
		}
	});

	var ele = document.createElement('a');
	ele.target = "_blank";
	ele.href = targetUrl;//"https://obank.kbstar.com/quics?page=C041244&scheme=liivtalk";
	ele.click();
}
function onlyNumberIn(obj) {
	 //$(obj).val( $(obj).val().replace( /[^0-9\-\*]/g, '' ) );// 숫자만입력(*, - 제외)
	 $(obj).val( $(obj).val().replace( /[^0-9]/g, '' ) );// 숫자만입력
}

/**
 * APP Active시
 */
function setActivePage(){
	//휴대폰 앱인증시
	document.kcbResultForm.kcbName.value = localStorage.getItem("kcbResult_name"); //이름
	document.kcbResultForm.kcbBirthDay.value = localStorage.getItem("kcbResult_birthday"); //생년월일
	document.kcbResultForm.kcbTelNo.value = localStorage.getItem("kcbResult_telNo"); //전화번호
	document.kcbResultForm.result.value = localStorage.getItem("kcbResult_code"); //실패코드
	document.kcbResultForm.errorMsg.value = localStorage.getItem("kcbResult_errorMsg"); //실패메세지

	insertAuthInfo2();

	setTimeout(()=>{
		localStorage.removeItem("kcbResult_name");
		localStorage.removeItem("kcbResult_birthday");
		localStorage.removeItem("kcbResult_telNo");
		localStorage.removeItem("kcbResult_code");
		localStorage.removeItem("kcbResult_errorMsg");
	}, 500);
}

//KCB 휴대폰 본인인증 결과 화면 리턴값 , 암호화된 인증결과정보를 복호화
function insertAuthInfo2(){
	//console.log("STEP휴대폰 본인확인 결과  -KCB 결과");
	var result = $("#result").val();
	var errorMsg = $("#errorMsg").val();

	var aRslt = $("#kcbName").val();
	var bRslt = $("#custNm").val();

	aRslt = removeStrSpace(aRslt);
	bRslt = removeStrSpace(bRslt);

	aRslt = aRslt.toUpperCase();
	bRslt = bRslt.toUpperCase();

	//가입정보와 KCB인증정보가 다를 경우
	if(aRslt != bRslt || $("#kcbBirthDay").val().substring(2) != $("#regNoRf").val()){
        let opt = {
            msg : "휴대폰 본인인증 정보를 정확히 입력해주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
	}
	if (result == "B000") {
        let opt = {
            msg : "휴대폰 본인인증이 완료되었습니다. 계속해서 추가 정보 입력을 진행해주세요.",
            cfrmYn : false,
            okCallback : certPhoneAfter
        };
        popalarm(opt);
		return;
	}else{
		if(result == "error"){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}else{
            let opt = {
                msg : errorMsg,
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}
		$("#kcbValue").val("");
	}
}
//KCB본인인증 완료 콜백
function callbackFromNormalOnBody() {
	if(gAuthMthd=="200"){
		$("#btnCardAuth").css("display", "none");
		$("#btnKbsignAuth").css("display", "none");
		$("#btnCardAuthCmp").css("display", "block");
		//$('#areaRcpntCellPhnNo').css('display', '');
		//<c:if test="${agrCnsYn eq 'Y'}">$("input:checkbox[id='agrCnsFlag']").prop("checked",true);</c:if>
	//	$("#btnNext").prop("disabled",false);
		modalLayer.hide();
	}
	else if(gAuthMthd=="300"){
		$("#btnCardAuth").css("display", "none");
		$("#btnKbsignAuth").css("display", "none");
		$("#btnKbsignAuthCmp").css("display", "block");
		//$('#areaRcpntCellPhnNo').css('display', '');
		//<c:if test="${agrCnsYn eq 'Y'}">$("input:checkbox[id='agrCnsFlag']").prop("checked",true);</c:if>
	//	$("#btnNext").prop("disabled",false);
		modalLayer.hide();
	}

	$("#fstAuthMthd").val(gAuthMthd);

	//22.02.15 본인확인후 저장 (as-is는 다음단계진입시 저장함)
	saveCheckData();
	//계좌 세팅 부터 확인하기
	if($("#custTp").val() != "MIN") setAcntNo();
}
//납부방법계좌인경우 전자서명 : 모바일인증서 본인인증 완료 콜백
function callbackFromNormalOnBody2(){
	$('#btnArsAutoPay').css('display', 'none');
	$('#btnArsAutoPayCmp').css('display', 'none');
	$('#btnKbsignAutoPay').css('display', 'none');
	$('#btnKbsignAutoPayCmp').css('display', 'block');

	//납부방법 고정
	$("#select_pay_acc, #select_pay_card, #acntNo, #select_kbmobile, #select_ars").prop("disabled",true);
	$("#agreeCheck4").prop("disabled",true);

    $("#page_account").removeClass("display");
	$("#acntDiv").removeAttr("onclick");

	modalLayer.hide();
}
function certPhoneAfter() {
    $("#kcbValue").val("1"); //KCB 인증 확인 값
    $("#btnPhoneAuth").css("display", "none");
    $("#btnPhoneAuthCmp").css("display", "block");

    saveCheckData();//22.02.15 본인확인후 저장 (as-is는 다음단계진입시 저장함)
    if($("#custTp").val() != "MIN") setAcntNo();//계좌 세팅 부터 확인하기
}
//납부방법계좌인경우 ARS : 인증 완료 콜백
function callbackFromKbArsCert(){
	$('#btnArsAutoPay').css('display', 'none');
	$('#btnArsAutoPayCmp').css('display', 'block');
	$('#btnKbsignAutoPay').css('display', 'none');
	$('#btnKbsignAutoPayCmp').css('display', 'none');
	//납부방법 고정
	$("#select_pay_acc, #select_pay_card, #acntNo, #select_kbmobile, #select_ars, #arsCertCellPhoneNo").prop("disabled",true);
	$("#agreeCheck4").prop("disabled",true);

    $("#page_account").removeClass("display");
	$("#acntDiv").removeAttr("onclick");
}
//특화요금제 :: 적금요금제 가입전 회선확인
function saveProdCtrtCnt(){
	$('#saveProdCtrtCnt').val('');
	if($('#custId').val() == ""){
		return;
	}
	else{
		var url = "/join/steps/reserve/saveProdCtrtCnt";
		var info = "custId="+$('#custId').val();
		$.ajax({
            url:url,
            type:'POST',
            data : info,
            dataType: 'json',
            beforeSend : function(xhr, set) {
                let token = $("meta[name='_csrf']").attr("content");
                let header = $("meta[name='_csrf_header']").attr("content");
                xhr.setRequestHeader(header, token);
            },
            success: function(data){
                if(data.ctrtCnt != null){
                    $('#saveProdCtrtCnt').val(data.ctrtCnt);
                }
            },
		    error : function(request, err){
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
		    }
		});
	}
}
/*22.11.29 지서연 사원 추가
 * 특화요금제 :: 주니어요금제 가입전 회선확인
 */
function juniorProdCtrtCnt(){
	$('#juniorProdCtrtCnt').val('');
	if($('#custId').val() == ""){
		return;
	}
	else{
		var appInfo = 'prodGrp='+gProdGrpCd + '&custId='+$('#custId').val();

		$.ajax({
            url:"/join/steps/reserve/juniorProdCtrtCnt",
            type:'POST',
            data : appInfo,
            dataType: 'json',
            beforeSend : function(xhr, set) {
                let token = $("meta[name='_csrf']").attr("content");
                let header = $("meta[name='_csrf_header']").attr("content");
                xhr.setRequestHeader(header, token);
            },
            success: function(data){
                if(data.ctrtCnt != null){
                    $('#juniorProdCtrtCnt').val(data.ctrtCnt);
                }
            },
            error : function(request, err){
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
            }
		});
	}
}

//가입유형 저장
function saveApplTp(){
	var appInfo = "";
	appInfo += 'soId='+$("#soId").val() + '&applSeqNo=' + $('#applSeqNo').val() + '&custId=' + $('#custId').val();
	appInfo += "&npYn="+$("#npYn").val();
    appInfo += "&applPhs=03";
    appInfo += '&regrId=APP001' + '&chgrId=APP001';

    if($("#npYn").val() != "Y" ){
    	appInfo += '&npAuthMthd=&npAuthKey=';
    	appInfo += '&befNp=&chgBfrTelNo=';
    }else{
    	appInfo += '&npAuthMthd=02&npAuthKey='; //번호이동구분 은행계좌, 번호이동인증값 공백으로 디폴트 세팅
    	appInfo += '&befNp=' + $('#mcoCd').val() +  '&chgBfrTelNo=' + $('#mtelNo').val();
    }

    $.ajax({
    	url: '/join/steps/step3/saveCustSvcApplInfo',
    	type: 'POST',
    	data: appInfo,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
    	success: function(responseData){
    		chkRatePlan();//요금제저장전 특화요금제확인
    	},
    	error : function(request, err){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
    	}
   	});
}
//요금제저장전  특화요금제확인
function chkRatePlanOption(){
    var ratePlan = $("#chrgPln").val();
	if(ratePlan == "" || ratePlan == undefined ) {
        let opt = {
            msg : "요금제를 선택해 주세요.",
            cfrmYn : false,
			okParam : 2,
            okCallback : stepActive
        };
        popalarm(opt);
        return;
	} else {
		//The주는 요금제
		if(ratePlan == "PD00000261" || ratePlan == "PD00000262" || ratePlan == "PD00000263"){
			if($("#saveProdCtrtCnt").val() != "0"){
                let opt = {
                    msg : "The주는 LTE 요금제는 1인 1회선만 가입 가능합니다.",
                    cfrmYn : false,
        			okParam : 2,
                    okCallback : stepActive
                };
                popalarm(opt);
                setProdInfoData(defaultProdInfo);
				return;
			}
		}
		//나라사랑 직업군인가족
		if(ratePlan == "PD00000319" || ratePlan == "PD00000941"){
			if(!$("#narasarangCheck2").prop("checked")){
                let opt = {
                    msg : "증빙서류 제출에 동의해주세요.",
                    cfrmYn : false,
					okParam : 2,
                    okCallback : stepActive
                };
                popalarm(opt);
				return;
			}else if($("#infoOfferStat").val() == ""){
                let opt = {
                    msg : "직업군인정보를 확인해 주세요.",
                    cfrmYn : false,
					okParam : 2,
                    okCallback : stepActive
                };
                popalarm(opt);
				return;
			}
		}
		//나라사랑 직업군인
		if(ratePlan == "PD00000320" || ratePlan == "PD00000937"){
			if(!$("#agreeYn2").prop("checked")){
                let opt = {
                    msg : "개인정보제공동의에 동의해주세요.",
                    cfrmYn : false,
					okParam : 2,
                    okCallback : stepActive
                };
                popalarm(opt);
				return;
			}else if($("#narasarangYn").val() == "N"){
				modalLayer.show("cardNoLayer");	//나라사랑LTE(일반)요금제 가입대상이 아님
				return;
			}else if($("#narasarangYn").val() == ""){
                let opt = {
                    msg : "나라사랑LTE(일반) 가입대상확인을 진행해 주세요.",
                    cfrmYn : false,
					okParam : 2,
                    okCallback : stepActive
                };
                popalarm(opt);
				return;
			}
		}
		//나라사랑 일반
		if(ratePlan == "PD00000321" || ratePlan == "PD00000939"){
			if(!$("#agreeYn").prop("checked")){
                let opt = {
                    msg : "개인정보제공동의에 동의해주세요.",
                    cfrmYn : false,
					okParam : 2,
                    okCallback : stepActive
                };
                popalarm(opt);
				return;
			}else if(!$("#narasarangCheck").prop("checked")){
                let opt = {
                    msg : "증빙서류 제출에 동의해주세요.",
                    cfrmYn : false,
					okParam : 2,
                    okCallback : stepActive
                };
                popalarm(opt);
				return;
			}
		}
		//5G30GB 요금제
		if(ratePlan == "PD00000555"){
			if(!$("#5gAgreeChk").prop("checked")){
                let opt = {
                    msg : "요금제 자동변경됨을 확인해주세요.",
                    cfrmYn : false,
					okParam : 2,
                    okCallback : stepActive
                };
                popalarm(opt);
				return;
			}
		}
		//LTE반려 요금제
		if(ratePlan == "PD00000561"){
			if($("#adoptAgencyNm").val().trim() == "" || $("#adoptBtn").prop("disabled") == false){
                let opt = {
                    msg : "입양기관정보를 확인해 주세요.",
                    cfrmYn : false,
					okParam : 2,
                    okCallback : stepActive
                };
                popalarm(opt);
				return;
			}else if($("#careServiceApplYn").val() != "1"){
                let opt = {
                    msg : "펫케어 서비스 상담신청은 필수입니다.",
                    cfrmYn : false,
					okParam : 2,
                    okCallback : stepActive
                };
                popalarm(opt);
				return;
			}
		}
		/*22.11.21 지서연 사원 삭제
		 * 신규 주니어 요금제 할인 조건에 오픈뱅킹이 없어짐에 따라 관련 팝업창 삭제
		 */
		//주니어요금제
		/*
		if($("#grpTp").val() == "03"){
			if($("#openbankingYn").val() == ""){
				popalarm("개인정보제공의 동의여부를 선택해 주세요.", "info", false, '', stepActive(2));
				return;
			}else if($("#openbankingYn").val() == "N"){
				popalarm('개인정보제공 "미동의"선택으로 오픈뱅킹 할인혜택은 제공되지 않습니다.', "info", false, '' );
			}
		}
		*/
		/*22.11.29 지서연 사원 추가
		 * 주니어 요금제 1인 1회선 한정 로직 추가
		 */
		if(gProdGrpCd == "U03" || gProdGrpCd == "K08") {
		//if(ratePlan == "PD00000914" || ratePlan == "PD00000916" || ratePlan == "PD00000918" || ratePlan == "PD00000920" || ratePlan == "PD00000922" || ratePlan == "PD00000923"){
			if($('#juniorProdCtrtCnt').val() != "0"){
                let opt = {
                    msg : "주니어 LTE 요금제는 1인 1회선만 가입 가능합니다.",
                    cfrmYn : false,
					okParam : 2,
                    okCallback : stepActive
                };
                popalarm(opt);
				setProdInfoData(defaultProdInfo);
				return;
			}
		}/*22.11.25 이서현 대리 추가
		 * 시니어 요금제는 개통시 피싱보험 가입 필수조건 요금제로 동의여부 확인 추가
		 */
		if(ratePlan == "PD00000925" || ratePlan == "PD00000927" || ratePlan == "PD00000929" || ratePlan == "PD00000930"){// 시니어 요금제 피싱보험 동의
			if($("input:checkbox[id='SnrAgreeYn']").is(":checked") == false){
                let opt = {
                    msg : "골든라이프 요금제는 피싱보험 가입 필수입니다 <br> 동의여부를 선택해 주세요.",
                    cfrmYn : false,
					okParam : 2,
                    okCallback : stepActive
                };
                popalarm(opt);
				return;
			}
		}
		/**
		 * 20221209 양희환 추가
		 * 무궁화(신)_PD00000947, 공무원(신)_PD00000943, 선생님(신)_PD00000945 요금제 추가
		 */
		if(ratePlan == "PD00000273" || ratePlan == "PD00000947" ){// 무궁화, 공무원, 선생님
			if($("input:checkbox[id='agreeYn1']").is(":checked") == false){
                let opt = {
                    msg : "개인정보제공의 동의여부를 선택해 주세요.",
                    cfrmYn : false,
					okParam : 2,
                    okCallback : stepActive
                };
                popalarm(opt);
				return;
			}
		}
		if(ratePlan == "PD00000274" || ratePlan == "PD00000943" ){// 무궁화, 공무원, 선생님
			if($("input:checkbox[id='agreeYn4']").is(":checked") == false ){
                let opt = {
                    msg : "개인정보제공의 동의여부를 선택해 주세요.",
                    cfrmYn : false,
					okParam : 2,
                    okCallback : stepActive
                };
                popalarm(opt);
				return;
			}
		}
		if(ratePlan == "PD00000275" || ratePlan == "PD00000945" ){// 무궁화, 공무원, 선생님
			if($("input:checkbox[id='agreeYn3']").is(":checked") == false ){
                let opt = {
                    msg : "개인정보제공의 동의여부를 선택해 주세요.",
                    cfrmYn : false,
					okParam : 2,
                    okCallback : stepActive
                };
                popalarm(opt);
				return;
			}
		}
    }

    return true;
}
function chkRatePlan(){
    var ratePlan = $("#chrgPln").val();
    if(chkRatePlanOption()) {
		//요금제정보저장
		if(ratePlan == "PD00000273" || ratePlan == "PD00000947"){ // 무궁화 (대상확인 > 정보저장)
			sendItb006New('1');

		}else if(ratePlan == "PD00000274" || ratePlan == "PD00000943"){ // 공무원 ( 대상확인 > 정보저장 )
			sendItb006New('2');

		}else if(ratePlan == "PD00000275" || ratePlan == "PD00000945"){ // 선생님 ( 대상확인 > 정보저장 )
			sendItb006New('3');

		}else if($("#svcTp").val() == "04"){
			chkWatchRatePlan();//(워치정보확인 > 정보저장)

		}else{
			saveRatePlan();
		}
	}
}
// 특화요금제 :: LTE워치
// chkWatchRatePlanOption : 워치정보확인
// chkWatchRatePlan       : 워치정보확인 > 정보저장
function chkWatchRatePlanOption1(){
    var returnAltMsg = "";

    setRemoveErrClass("modelItemid");
    setRemoveErrClass("modelSerialNo");
    setRemoveErrClass("imei");
    setRemoveErrClass("modelEid");

    if($('input[name="c-watch"]:checked').val() == undefined){
        returnAltMsg = "제조사를 선택해 주세요.";
        return returnAltMsg;
    }else if($("#modelItemid").val().trim() == ""){
        returnAltMsg = "워치모델을 정확히 입력해 주세요.";
        setAddErrClass("modelItemid", returnAltMsg);
        return returnAltMsg;
    }else if($("#modelSerialNo").val().trim() == ''){
        returnAltMsg = "일련번호를 정확히 입력해 주세요.";
        setAddErrClass("modelSerialNo", returnAltMsg);
        return returnAltMsg;
    }else if($("#imei").val().trim() == '' || $("#imei").val().length != 15){
        returnAltMsg = "IMEI를 정확히 입력해 주세요.(15자리 숫자)";
        setAddErrClass("imei", returnAltMsg);
        return returnAltMsg;
    }else if($("#modelEid").val().trim() == '' || $("#modelEid").val().length != 32){
        returnAltMsg = "EID를 정확히 입력해 주세요.(32자리 숫자)";
        setAddErrClass("modelEid", returnAltMsg);
        return returnAltMsg;
    }

    return returnAltMsg;
}
function chkWatchRatePlanOption2(){
    var returnAltMsg = "";

    if($('input[name="c-watch"]:checked').val() == "G" && $('input[name="c-conn-mobile"]:checked').val() == undefined){
        returnAltMsg = "모바일 결합여부를 선택해 주세요.";
        return returnAltMsg;
    }else if(($("#svcInfoDiv").css("display") == "block")
            &&(($('input[name="c-watch"]:checked').val() == "A"||$('input[name="c-conn-mobile"]:checked').val() == "Y") && $('input[name="c-share"]:checked').val() == undefined)){
        returnAltMsg = "모바일 회선의 통화, 문자, 데이터 기본제공량 공유 여부를 선택해 주세요.";
        return returnAltMsg;
    }else if($('input[name="c-watch"]:checked').val() == "A"||(($('input[name="c-watch"]:checked').val() == "G" && $('input[name="c-conn-mobile"]:checked').val() == "Y"))){
        returnAltMsg = chkSvcInfo('C'); //결합가능요금제 확인
    }

    return returnAltMsg;
}

function chkWatchRatePlan(){

    var altMsg = chkWatchRatePlanOption1();
    if(!isEmpty(altMsg)) {
        let opt = {
            msg : altMsg,
            cfrmYn : false,
			okParam : "page_watch",
            okCallback : stepActive
        };
        popalarm(opt);
        return;
    }

    altMsg = chkWatchRatePlanOption2();
    if(!isEmpty(altMsg)) {
        let opt = {
            msg : altMsg,
            cfrmYn : false,
			okParam : "page_mobileAdd",
            okCallback : stepActive
        };
        popalarm(opt);
        return;
    }

	if($('input[name="c-watch"]:checked').val() == "A"||(($('input[name="c-watch"]:checked').val() == "G" && $('input[name="c-conn-mobile"]:checked').val() == "Y"))){
		chkSvcInfo('S'); //결합가능요금제 확인
	}else{
		saveRatePlan();
	}

}
//특화요금제 :: 워치 결합가능요금제확인
function chkSvcInfo(mode){
	var svcInfo = $("#svcInfoSelect option:selected").attr("data-map");//선택한 모 회선정보
	var txt = "";

	if(svcInfo != undefined ){
		svcInfo  = svcInfo.replace(/'/gi,"\"");
		svcInfo  = jQuery.parseJSON(svcInfo);

		//확정기변확인
		if(svcInfo.modelNm != null && svcInfo.modelNm.indexOf("OMPHONE") != -1){
			txt = "모바일 기기정보 등록(확정기변) 후 워치요금제 가입이 가능합니다.";

		//결합가능상품확인
		}else if(svcInfo.prodCnt > 0 ){
			txt = "현재 이용중인 요금제는 워치요금제와<br> 결합 불가능한 요금제입니다.";

		//자회선건수확인
		}else if(svcInfo.dsharCnt == 2 ){
			txt = "모회선에 연결된 자회선 횟수가 초과되었습니다.";

		//자회선 상품군 확인 :: 워치요금제 중복 불가
		}else if(svcInfo.dsharCnt == 1 ){
			getParentsInfo(svcInfo.ctrtId,function(data){
				var oppntProdGrp  = data.vo.oppntProdGrp; 	//자회선 상품군
				var oppntProdGrp2 = data.vo.oppntProdGrp2;  //자회선 상품군2

				//워치요금제 중복가입확인
				if(oppntProdGrp == "U18" || oppntProdGrp2 == "U18"){
					txt = "모회선에는 하나의 워치회선만 결합 할 수 있습니다.";

				//데이터쉐어링여부확인
				}else if($('input[name="c-share"]:checked').val() == "Y"){
					txt = "데이터쉐어링을 이용중인 경우<br> 모바일회선 기본 제공량을<br> 공유 할 수 없습니다.";
					$("#sharN").prop("checked",true);// 이용하지 않음 선택
				}
			});

		//듀얼넘버서비스및착신서비스여부확인
		}else if(svcInfo.adtSvcCnt > 0 ){
			txt = "듀얼넘버서비스, 착신전환서비스<br> 해지후 신청이 가능합니다.";

		}

		if(mode == "C"){
            return txt;

        } else {

            if(txt != ""){
                $("#warchLayertxt").empty();
                $("#warchLayertxt").append(txt);
                modalLayer.show("alertWatchLayer");
                stepActive("page_mobileAdd");
                return;
            }else if(mode == 'S'){
                saveRatePlan();//요금제저장

            }
        }

	}
}

//모회선에 기 결합되어있는 자회선 상품군 정보 가져오기(워치요금제)
function getParentsInfo(pCtrtId,successCallback){
	var info = "soId="+$("#soId").val()+"&ctrtId="+pCtrtId;

	$.ajax({
		url: '/join/steps/step5/getParentsInfo',
		type:'POST',
		async : false,
		data:info,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success:function(data){
			successCallback(data);
		},
		error : function (Request,status,error){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}
	});
}

//워치 요금제 모회선 납부정보 가져오기
function getPymAcntInfo(){
	if($('input[name="c-watch"]:checked').val() == "A"){//애플워치
		watchCombYn = "Y";
	}else{
		watchCombYn = $('input[name="c-conn-mobile"]:checked').val();
	}

	if(watchCombYn != "Y"){ //결합이 아닌경우 retrun;
		//납부방법 변경 가능
		$("#c-bill-sms, #c-bill-email, #select_pay_acc, #select_pay_card, #cardNum, #acntNo").prop("disabled",false);
		$("#emlD, #emlD2").prop("disabled", false);
		$("#accRegLayerBtn, #cardRegLayerBtn").css("display","block");
		$("#select_kbmobile, #select_ars, #agreeCheck4").prop("disabled",false);
		$("#acntDiv").attr("onclick","drawBottomPopup('계좌선택', 'acntNoSelLayer', '')");
        $("#page_widthdrawAgree1, #page_widthdrawAgree2").addClass("display");
        $("#btnKbsignAutoPay").css("display", "block");
        $("#btnKbsignAutoPayCmp").css("display", "none");
		return;
	}
	else{
		$("#page_account").removeClass("display");
		$("#btnRegAcntNo").text("네 선택했어요");
		discountCalc($("#prodPrice").val()); //상품 재계산,(모바일결합쪽)
	}

	if($('#watchPymAcntId').val() == "") return; //모회선이 없는경우 return;

	var data  = '&watchPymAcntId=' + $('#watchPymAcntId').val() + '&custId=' + $('#custId').val();
    $.ajax({
    	url: '/join/steps/getPymAcntInfo',
    	type:'POST',
    	data : data,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
    	success: function(responseData){
    		var data = responseData;

    		if(data.pymInfo != "" && data.pymInfo != null){//모회선납부정보세팅
    			$("#pymInfo").val(JSON.stringify(data.pymInfo));

    			var pymAcntInfo = JSON.parse($("#pymInfo").val());
    			var watchCombYn = $("#watchCombYn").val();

    			if($("#svcTp").val() == "04" && watchCombYn == "Y"){
    				setParentPymAcntInfo(pymAcntInfo);

    				if(pymAcntInfo.pymMthd == "CM" && watchCombYn == "Y"){
    					//워치 결합이고 계좌인경우, 모회선 납부정보 세팅되므로 자동이체출금동의는 생략한다
						$('#btnArsAutoPay').css('display', 'none');
						$('#btnArsAutoPayCmp').css('display', 'none');
						$('#btnKbsignAutoPay').css('display', 'none');
						$('#btnKbsignAutoPayCmp').css('display', 'block');

						$("#agreeCheck4").prop("checked",true);
						$("#select_kbmobile, #select_ars, #agreeCheck4").prop("disabled",true);
						$("#acntDiv").removeAttr("onclick");
						$("#page_widthdrawAgree1, #page_widthdrawAgree2").removeClass("display");

    				}

    			}
    		}else{//납부자정보 못가져옴 : 이전페이지로
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false,
                    okCallback : goToMain
                };
                popalarm(opt);
                return;
    		}
    	},
    	error : function(request, err){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
    	}
    });
}

//데이터쉐어링 요금제 모회선 납부정보 가져오기
function getDsharPymAcntInfo() {
	var data  = '&watchPymAcntId=' + $('#parentsPymAcntId').val() + '&custId=' + $('#custId').val();
    $.ajax({
    	url: '/join/steps/getPymAcntInfo',
    	type:'POST',
    	data : data,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
    	success: function(responseData){
    		var data = responseData;

    		if(data.pymInfo != "" && data.pymInfo != null){//모회선납부정보세팅
    			$("#pymInfo").val(JSON.stringify(data.pymInfo));
    			var pymAcntInfo = JSON.parse($("#pymInfo").val());
				setParentPymAcntInfo(pymAcntInfo);
    		}else{//납부자정보 못가져옴 : 메인페이지로...? why?
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false,
                    okCallback : goToMain
                };
                popalarm(opt);
                return;
    		}
    	},
    	error : function(request, err){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
    	}
    });
}

//모회선 납부정보 셋팅
function setParentPymAcntInfo(pymAcntInfo) {
	var pymMthdCd = pymAcntInfo.pymMthd;
	if(pymMthdCd == "CM"){
		$("#select_pay_acc").click();
		$("#bankNoH6").val(pymAcntInfo.acntNo);
		$("#bankComp6").val(pymAcntInfo.bnkCd);
		$("#bankComp6H").val(pymAcntInfo.bnkCd);
		$("#bankCompNm6H").val(pymAcntInfo.bnkCdNm);

		setBankNumber();//계좌세팅
	} else if(pymMthdCd == "CC") {
		$("#select_pay_card").click();
		$("#cardNoH6").val(pymAcntInfo.acntNo);
		$("#cardComp6").val(pymAcntInfo.bnkCd);
		$("#cardCompNm6H").val(pymAcntInfo.bnkCdNm);
		$("#cardCompNm6").val(pymAcntInfo.bnkCdNm);

		setCardNumber();//카드세팅
	}

	//청구서 받는 방법
	var billMdmSmsYn = pymAcntInfo.billMdmSmsYn;
	var billMdmEmlYn = pymAcntInfo.billMdmEmlYn;
	var eml = pymAcntInfo.eml;
	if(billMdmSmsYn == "Y"){
		$("#c-bill-sms").prop("checked",true);
	}else{
		$("#c-bill-email").prop("checked",true);
	}

	if(vali(eml) != ""){
		$("#eml").val('');
		$("#emlD").val("i");
		$("#emlD2").css("display","block");
		$("#eml, #emlD, #emlD2").prop("disabled", true);
		$("#emlD2").val(eml);
	}

	//납부방법 변경 못함
	$("#c-bill-sms, #c-bill-email, #select_pay_acc, #select_pay_card, #cardNum, #acntNo").prop("disabled", true);
	$("#eml").prop("disabled", true);
	$("#accRegLayerBtn, #cardRegLayerBtn").css("display","none");
	$("#acntDiv").removeAttr("onclick");
}

//요금제 정보저장
function saveRatePlan(){
	var ratePlan = $("#chrgPln").val();
	var appInfo  = 'soId='+ $("#soId").val() + '&applSeqNo=' + $('#applSeqNo').val() + '&custId=' + $('#custId').val();
	    appInfo += '&chrgPln=' + ratePlan;
	    appInfo += '&regrId=APP001' + '&chgrId=APP001';
	    appInfo += "&applPhs=04";

    $.ajax({
    	url:'/join/steps/step5/saveCustSvcApplInfo',
    	type:'POST',
    	data : appInfo,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
    	success: function(responseData){
    		var data = responseData;
    		saveWatchSvcApplInfo();

    	},
    	error : function(request, err){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
    	}
    });
}
//특화요금제 :: LTE워치정보저장
function saveWatchSvcApplInfo(){
	var ratePlan = $("#chrgPln").val();

	var modelItemid = ""; //단말ID
	var modelSerialNo = ""; //단말일련번호
	var watchTp = "";//워치구분
	var imei = "";
	var modelEid = "";
	var watchCombYn = ""; //워치결합여부
	var watchSharYn = ""; //워치쉐어링여부

	if($("#svcTp").val() == "04"){
		modelItemid = $("#modelItemid").val().trim();
		modelSerialNo = $("#modelSerialNo").val().trim();
		imei = $("#imei").val().trim();
		modelEid = $("#modelEid").val().trim();
		watchTp = $('input[name="c-watch"]:checked').val()

		if(watchTp == "A"){//애플워치
			watchCombYn = "Y";
		}else{
			watchCombYn = $('input[name="c-conn-mobile"]:checked').val();
		}

		if(watchCombYn != "Y" || $("#svcInfoDiv").css("display") == "none"){
			watchSharYn = "N";
		}else{
			watchSharYn = $('input[name="c-share"]:checked').val();
		}

		var info = "soId="+$("#soId").val()+"&applSeqNo="+$("#applSeqNo").val()+"&custId="+$("#custId").val();
		info += '&watchDstic='+watchTp+"&watchMdelCd="+modelItemid+"&watchMdelSerno="+modelSerialNo;
		info += "&mobLinkYn="+watchCombYn+"&mobLotShaYn="+watchSharYn;
		info += "&imei="+imei+"&modelEid="+modelEid;

		//결합인경우 납부자ID 입력
		if(watchTp == "A" ||(watchTp == "G" && watchCombYn == "Y") ){
			var svcInfo = $("#svcInfoSelect option:selected").attr("data-map");
			svcInfo  = svcInfo .replace(/'/gi,"\"");
			svcInfo  = jQuery.parseJSON(svcInfo);

			$("#watchParentCtrtId").val(svcInfo.ctrtId);
			$("#watchPymAcntId").val(svcInfo.pymAcntId);
			$("#watchCombYn").val(watchCombYn);
			$("#watchSharYn").val(watchSharYn);
		}else{
			$("#watchParentCtrtId").val('');
			$("#watchPymAcntId").val('');
			$("#watchCombYn").val('');
			$("#watchSharYn").val('');

		}
	}else{
		var info = "soId="+$("#soId").val()+"&applSeqNo="+$("#applSeqNo").val()+"&custId="+$("#custId").val();
		info += "&watchDstic=&watchMdelCd=&watchMdelSerno=";
		info += "&mobLinkYn=&mobLotShaYn=&imei=&modelEid=";
	}

	$.ajax({
		url: '/join/steps/step5/saveWatchSvcApplInfo',
		type:'POST',
		data:info,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success:function(data){
			if(data.result != 0){
				saveJobInfo();
			}else{
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
			}
		},
		error : function (Request,status,error){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}

	});
}
//특화요금제 : 직업군인정보
function saveJobInfo(){
	var appInfo  = "soId="+$("#soId").val()+ '&applSeqNo=' + $('#applSeqNo').val() + '&custId=' + $('#custId').val();
	appInfo += "&infoOfferTelNo=" + $('#infoOfferTelNo').val()+"&infoOfferStat="+ $('#infoOfferStat').val();
	appInfo += '&chgrId=APP001';

    $.ajax({
    	url:'/join/steps/step5/saveJobInfo',
    	type:'POST',
    	data : appInfo,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
    	success: function(data){
    		saveAdoptAgencyInfo('N'); //반려행복요금제 입양기관 저장:::  C:확인클릭 N:다음단계전확인
    	},
    	error : function(request, err){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
    	}
    });
}
//특화요금제 :: 반려행복요금제 입양기관 저장 (C:확인클릭 N:다음단계전확인)
function saveAdoptAgencyInfo(type){
	if(type == 'C' && $("#adoptAgencyNm").val().trim() == ""){
        let opt = {
            msg : "입양기관정보를 정확히 입력해주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
	}

	var info = "soId=01"+"&applSeqNo="+$("#applSeqNo").val()+"&custId="+$("#custId").val()+"&adoptAgencyNm="+$("#adoptAgencyNm").val();
	info += '&chgrId=APP001';

	$.ajax({
		url: '/join/steps/step5/saveAdoptInfo',
		type:'POST',
		data:info,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success:function(data){
			if(type == 'C'){
				$("#adoptAgencyNm").prop("disabled",true);
				$("#adoptBtn").prop("disabled",true);
				$("#specialProdDiv_petInfo").css("display","");
			}

			//LTE워치요금제 모회선납부정보 가져오기
			if($("#svcTp").val() == "04"){
				getPymAcntInfo();
			} else if($("#joinDataSharingYn").val() == "Y" && $("#custTp").val() != "IFX") { //데이터 쉐어링 가입
				getDsharPymAcntInfo(); //모회선납부정보 가져오기
			}

    		console.log("2단계저장완료 -------------------------------------------------");
			//accordionSetting(2);

			//고객센터 상담단계
			$("#counselApplStat").val('2');//요금제 정보저장

			//최종가입일시
			if($("#page_apply").hasClass("on") && $("#confirmBtn").text() == "가입신청") checkUsimCnt();
		},
		error : function (Request,status,error){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}
	});
}
//기존 아이디 조회
function usrIdChk() {
	/*idstep 20200616 미성년자,신용카드미소지자 가입시 ID세팅용 변수 추가
	idstep=1 : 아이디 입력한적 없는 최초 세팅 (TCMCU_USER insert 용. 다른jsp에서 사용시 일반적인 케이스)
	idstep=2 : 아이디 입력후 고정됨 (TCMCU_USER update 비밀번호만 변경 가능)
	idstep=3 : 이미 사용하던 아이디가 자동세팅되어 고정됨(TCMCU_USER 수정사항 없음)*/
	//console.log("STEP1_9  - 기존 아이디 조회 ");
	var custId = 'custId=' + $("#custId").val();
	var altMsg = "";

    if($("#custId").val() == ""){
        altMsg = "본인인증을 진행해주세요.";
    }else if($("#usrId").val() == ""){
        altMsg = "로그인시 사용할 아이디를 정확히 입력해주세요.";
    }else if($("#usrId").val().length < 6){
        altMsg = "로그인시 사용할 아이디를 6자 이상 입력해주세요.";
    }

    if(!isEmpty(altMsg)) {
        let opt = {
            msg : altMsg,
            cfrmYn : false
        };
        popalarm(opt);
        return;
    }

	$.ajax({
		url : '/join/steps/step7/selectUsrId',
		type : 'POST',
		data : custId,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success : function(responseData) {
			var data = responseData;

			if (data.result !== 'null' && data.result !== null&& data.result !== '') {
				//getSetSvcAppInfo();
				$("#usrId").val(data.result);
				$("#usrId").prop("disabled", true);
				$("#divPw").css("display", "none");
				$("#divPwRe").css("display", "none");
				//$("#chk_newYn").val("N");
				$("#idstep").val("3");

				$("#orgId").text(data.result);
                modalLayer.show({
                    titleUse : true,
                    title : "아이디 중복 확인",
                    id : "idCheckLayer",
                    type : "confirm"
                });
                $(".btn_check .btn_type").css("display","none");
				$("#usrId").prop("disabled",true);
			} else {
				//getSetSvcAppInfo();
				$("#usrId").prop("disabled", false);
				$("#divPw").css("display", "block");
				$("#divPwRe").css("display", "block");
				//$("#chk_newYn").val("Y");
				checkUsrId("#usrId");
			}
		},
		error : function(request, err) {
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}
	});
}
//아이디 중복 체크
function checkUsrId(userid){
    setRemoveErrClass("usrId");
	$(userid).val( removeStrSpace($(userid).val()) );

	if(isEmpty($(userid).val())) return;

	var usrId  = 'usrId=' + $(userid).val();
	$.ajax({
        url:'/join/steps/step7/checkUsrId',
        type:'POST',
        data : usrId,
        //dataType: 'json',
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
        success: function(responseData){
            var data = responseData;

            var result = JSON.parse(data.result);
            var custId = $("#custId").val();

            if(result.usrId !== '' && result.usrId !== null && result.custId !== '' && result.custId !== null && result.custId !== custId){
                let opt = {
                    msg : "가입이 불가능한 아이디입니다. 다른 아이디를 입력해주세요.",
                    cfrmYn : false
                };
                popalarm(opt);

	            setAddErrClass("usrId", "다른 아이디를 입력해주세요.");
                $(userid).val("");

            }else if(result.usrId !== '' && result.usrId !== null){
                let opt = {
                    msg : "이미 있는 아이디입니다. 다른 아이디를 입력해주세요.",
                    cfrmYn : false
                };
                popalarm(opt);

	            setAddErrClass("usrId", "다른 아이디를 입력해주세요.");
                $(userid).val("");

            }else{
                let opt = {
                    msg : "가입 가능한 아이디 입니다. 이 아이디로 가입을 진행하시겠어요?",
                    cfrmYn : true,
                    okCallback : setUsrIdReadonly
                };
                popalarm(opt);
            }
        },
        error : function(request, err){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
        }
	});
}

function setUsrIdReadonly() {
    $("#usrId").prop("readonly",true);
    $(".btn_check .btn_type").css("display", "none");
}

//조건별 배송지입력메세지 세팅
function checkMsgDtlAddr() {
	if (isEmpty($("#dtlAddr").val()) || $("#dtlAddr").val().length == 0) {
		$("#errMsg_dtlAddr").show();
		$("#dtlAddr").addClass("error");
	} else {
		$("#errMsg_dtlAddr").hide();
		$("#dtlAddr").removeClass("error");
	}
}

function checkUsimCnt(){

	if($(".btn_check .btn_type").css("display") == "block"){
        let opt = {
            msg : "로그인시 사용할 아이디의 중복확인을 진행해 주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
	}

	var cnt = Number($("#usimFeeCnt").val());
	if(cnt > 3){
        let opt = {
            msg : "통신비 자동납부 계좌에서 유심 비용<br>7,700원이 출금됩니다. 계좌잔액을<br>확인해 주세요.유심 비용 납부 확인 후<br> 유심 배송이 시작됩니다.",
            cfrmYn : false,
            okCallback : chkPayMethod
        };
        popalarm(opt);
	} else {
		chkPayMethod();
	}

}
//납부방법체크
function chkPayMethod(){
    var payMethod = $('input[name="c-paywray"]:checked').val();//납부
	var acntNo = $('#acntNoSel option:selected').val() ;
	if(acntNo == '' || acntNo == null || acntNo == undefined){
		acntNo = $('#acntNo').val() ;
	}
    var cardNum   = $('#cardNum').val();
    var billMth   = $('input[name="c-billwray"]:checked').val();//청구
    var email     = getEmail();

    if(billMth == ''){
        let opt = {
            msg : "청구서 받는 방법을 정확히 확인해 주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
	} else if($('#emlD').val() != 'i' && (isEmpty($('#eml').val()) || $('#eml').val().trim().length == 0)){
        let opt = {
            msg : "이메일 주소를 정확히 입력해 주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
	} else if($('#emlD').val() == 'i' && (isEmpty($('#emlD2').val()) || $('#emlD2').val().trim().length == 0)) {
        let opt = {
            msg : "이메일 주소를 정확히 입력해 주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
	} else if(!checkEmailStr(email)) {
        let opt = {
            msg : "이메일 주소를 정확히 입력해 주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
	} else if(payMethod == ""){
        let opt = {
            msg : "납부방법을 선택해 주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
	} else if(payMethod == 'ac' && acntNo == ""){
        let opt = {
            msg : "계좌번호를 선택해 주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
	}else if($("#joinDataSharingYn").val() != "Y" && (payMethod == "ac" && ($("#btnKbsignAutoPay").css("display") != "none" && $("#btnArsAutoPay").css("display") != "none"))){
        let opt = {
            msg : "자동이체 출금동의를 먼저 진행해주세요.",
            cfrmYn : false,
            okParam : "page_widthdrawAgree2",
            okCallback : stepActive
        };
        popalarm(opt);
        return;
	}else if($("#joinDataSharingYn").val() != "Y" && !$("#agreeCheck4").prop("checked")){
        let opt = {
            msg : "필수 항목에 동의해 주세요.",
            cfrmYn : false,
            okParam : "page_payWay",
            okCallback : stepActive
        };
        popalarm(opt);
        return;
	}else if(payMethod == 'ca' && cardNum == ""){
        let opt = {
            msg : "카드를 선택해 주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
	} else {
		if($("#joinDataSharingYn").val() == "Y" && $("#custTp").val() != "IFX") { //데이터쉐어링 가입 CM808 생략
			$("#pymAcntId").val($("#parentsPymAcntId").val());
			saveSvcApplInfo_2();
		}else if($("#svcTp").val() == "04" && $("#watchCombYn").val() == "Y"){ //워치요금제 결합인경우 납부정보 입력 생략
			$("#pymAcntId").val($("#watchPymAcntId").val());
			saveSvcApplInfo_2();
		}else {
			// 통신사별 분기_납부방법검증[ LGU/SKT: CM808, KT: ITB021 ]
			paymentAuth("");
		}
	}
}
//통신비납부방법 등록
function savePymAcntInfo(){
	var payMth  = $('input[name="c-paywray"]:checked').val();//납부
	var email     = getEmail();
    var appInfo = 'soId='+$("#soId").val() + '&applSeqNo=' + $('#applSeqNo').val() + '&custId=' + $('#custId').val();

    //납부유형
	if(payMth == 'ac'){
		var acntno = $('#acntNoSel option:selected').val() ;
		if(acntno == '' || acntno == null || acntno == undefined){
			acntno = $('#acntNo').val() ;
		}
        appInfo += "&pymMthd=CM"+"&acntNo=" + encodeURIComponent(acntno);
        appInfo += "&bnkCd="+$("#bankComp6H").val();

    }else if(payMth == 'ca'){//카드
    	appInfo += '&pymMthd=CC'+"&acntNo=" + encodeURIComponent($('#cardNum').val());
    	appInfo += "&bnkCd="+$("#cardComp6").val()+'&cdtcdExpDt='+$("#cardEffcprd6H").val();

    }
	appInfo += "&acntNm="+$("#custNm").val();//납부자명
	appInfo += "&acntOwnerNm="+$("#custNm").val();//예금주

	//가입자유형
	if($("#custTp").val() == "GEF"){
		var vPostcode = $('#BPostcode').val();
		if(vPostcode == '') vPostcode = "12345";
    	appInfo += "&bznm="+$("#bznm").val();//상호명
    	appInfo += "&txRprsNm="+$("#txRprsNm").val().trim();//대표자
    	appInfo += "&txBusiCndt="+$("#txBusiCndt").val().trim();//업태
    	appInfo += "&txBusiTp="+$("#txBusiTp").val().trim();//업종
    	appInfo += "&txBasAddr="+$("#busAddr").val().trim(); //배송지 기본주소
    	appInfo += "&txDtlAddr="+$("#busAddrDtl").val().trim();  //배송지 상세주소
    	appInfo += "&txPostNo="+vPostcode;
    	appInfo += "&txChrgNm="+$("#chrgNm").val().trim();
    	appInfo += "&txChrgTelNo="+$("#busTelNo").val().trim().replace( /[.:|\`~_\- ]/gi, '' );
    	appInfo += "&txChrgCphnno="+$("#busMTelNo").val().trim().replace( /[.:|\`~_\- ]/gi, '' );
    	appInfo += "&txChrgEmail="+$("#busEml").val().trim();
    	appInfo += "&telNo="+$("#busTelNo").val().trim().replace( /[.:|\`~_\- ]/gi, '' ); //전화번호
    	appInfo += "&mtelNo="+$("#busMTelNo").val().trim().replace( /[.:|\`~_\- ]/gi, '' ); //휴대폰번호
    	//appInfo += "&eml="+$("#busEml").val().trim();

    }

	//청구유형
	var billMth = $('input[name="c-billwray"]:checked').val();//청구
    if(billMth == 'sms'){//문자
        appInfo += '&billMdmEmlYn=N&billMdmSmsYn=Y';
    } else if(billMth == 'email'){
    	appInfo += "&billMdmEmlYn=Y&billMdmSmsYn=N";
    }

    appInfo += "&eml=" + encodeURIComponent(email);

    appInfo += "&joinDataSharingYn="+$("#joinDataSharingYn").val();
    appInfo += "&parentsCtrtId="+$("#parentsCtrtId").val();
	appInfo += '&regrId=APP001' + '&chgrId=APP001';

	try{
		$.ajax({
            url:'/join/steps/step6/savePymAcntInfo',
            type:'POST',
            data : appInfo,
            //dataType: 'json',
            beforeSend : function(xhr, set) {
                let token = $("meta[name='_csrf']").attr("content");
                let header = $("meta[name='_csrf_header']").attr("content");
                xhr.setRequestHeader(header, token);
            },
            success: function(responseData){
                //$("#ajax").remove();
                try{
                    var data = JSON.parse(responseData);
                    if(data.pymAcntId != "" && data.pymAcntId != null){
                        $("#pymAcntId").val(data.pymAcntId);
                    }

                    exeSaveStep();
                }
                catch(e){
                    console.log(e);
                    let opt = {
                        msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                        cfrmYn : false
                    };
                    popalarm(opt);
                    return;
                }
            },
            error : function(request, err){
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
            }
		});
	}
	catch(e){
		console.log(e);
        let opt = {
            msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
	}
}

function exeSaveStep(){
	if( $("#usrId").prop("disabled") ) {//기존 아이디 있음
		saveSvcApplInfo_2();
	}else{
		insertUserInfo();
	}
}
//회원관리 등록
function insertUserInfo(){
	/*var appInfo = 'soId='+$("#soId").val()+'&usrId=' + $('#usrId').val()  + '&custId=' + $('#custId').val();
	appInfo += '&usrPw=' + fnSign($('#usrPw').val());
	appInfo += '&usrStat=05' + '&actDttm='+getYYYYMMDDHHMMSS();
	appInfo += '&fstAuthMthd='+$("#fstAuthMthd").val();
	appInfo += '&regrId=APP001' + '&chgrId=APP001';*/

	let param = npPfsCtrl.toJson(document.frm);
	param.usrStat = "05";
	param.actDttm = getYYYYMMDDHHMMSS();
	param.regrId = "APP001";
	param.chgrId = "APP001";

	$.ajax({
        url:'/join/steps/step7/insertUserInfo',
        type:'POST',
        data : param,
        //dataType: 'json',
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
        success: function(responseData){

            console.log("insertUserInfo responseData="+responseData);
            if(responseData > 0 ){
                saveSvcApplInfo_2();
            }
            else if (responseData == -1){
                let opt = {
                    msg : "아이디를 올바르게 입력해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
            }
            else{
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
            }
        },
        error : function(request, err){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
        }
	});
}

function saveSvcApplInfo_2(){
	var payMth = $('input[name="c-paywray"]:checked').val();//납부
	var billMth = $('input[name="c-billwray"]:checked').val();//청구
	var email     = getEmail();
	var chrgPln = $("#chrgPln").val();
	var pymAcntId = $("#pymAcntId").val();

	//납부방법
	var appInfo  = 'soId='+$("#soId").val() + '&applSeqNo=' + $('#applSeqNo').val() + '&custId=' + $('#custId').val();
    	appInfo += "&pymAcntId="+pymAcntId

	if(payMth == 'ac'){//계좌
		var acntno = $('#acntNoSel option:selected').val() ;
		if(acntno == '' || acntno == null || acntno == undefined){
			acntno = $('#acntNo').val().replace(/-/g,'');
		}
	    appInfo += '&pymMthd=CM'+'&cardNo=' + encodeURIComponent(acntno) ;
	    appInfo += '&cardCorpCd='+$("#bankComp6H").val();//납부은행코드

	} else if(payMth == 'ca'){//카드
		appInfo += '&pymMthd=CC'+'&cardNo=' + encodeURIComponent($('#cardNum').val().replace(/-/g,'')) ;
		appInfo += '&cardCorpCd='+$("#cardComp6").val()+'&cardEffcprd='+$("#cardEffcprd6H").val()+'&cardPswd='+$("#cardPswd").val();

	}

	appInfo += "&reqEmail="+encodeURIComponent(email);
	appInfo += "&cstmField1="+$('#joinDataSharingYn').val(); // 임시필드4에 데이터 쉐어링 가입 모 납부 정보인지 구분하기 위함

	//KB국민카드 11GB+이벤트 할인 - 계좌인경우:PD00000575/KB국민카드인경우:PD00000577,PD00000622
	if(chrgPln == "PD00000575" ||chrgPln == "PD00000577" ||chrgPln == "PD00000622"){
		if($('input[name="c-paywray"]:checked').val() == "ac"){
			chrgPln = "PD00000575";
		}else if($('input[name="c-paywray"]:checked').val() == "ca"){
			if($("#cardComp6").val() == "02"){
				chrgPln = "PD00000622";
			}else{
				chrgPln = "PD00000575";
			}
		}
		appInfo += '&chrgPln='+chrgPln ;
	}

	appInfo += setUsimInfo();

	//유심수령방법
	if($("#svcTp").val() == "04") {//워치 요금제인경우 유심수령방법 5값 고정
		appInfo += "&dlvrMthd=5";

	}else if($("#dlvrMthd").val() == "4"){
		appInfo += "&dlvrMthd="+$("#dlvrMthd").val();

	}else {
		appInfo += "&dlvrMthd="+$("#dlvrMthd").val();

	}

	var vTelNo = "";
	var dlvdstRcpntNm = "";
	var dlvdstRcpntCellPhnNo = "";
	var vPostcode = "";
	var dlvrBassAddr = "";
	var dlvrDtlAddr = "";

	//지점방문수령시, 배송정보 유심기입력시, eSIM 설치시 고객정보로 저장
	if($("#dlvrMthd").val() == "4" || $("#dlvrMthd").val() =="5"){
		vTelNo = $("#dvrlTelNo2").val(); //배송지 수령인 휴대폰번호
		dlvdstRcpntNm = $("#custNm").val().trim();
		vPostcode = $('#postcode').val();
		dlvrBassAddr = $('#bassAddr').val();
		dlvrDtlAddr = $('#dtlAddr').val();
	}else{
		vTelNo = $("#dvrlTelNo").val(); //배송지 수령인 휴대폰번호
		dlvdstRcpntNm = $("#dvrlNm").val().trim();
		vPostcode = $('#DPostcode').val();
		dlvrBassAddr = $('#dvrlAddr').val();
		dlvrDtlAddr = $('#dDtlAddr').val();
	}

	if(vPostcode == '') vPostcode = "12345";
	appInfo += "&dlvdstRcpntNm="+dlvdstRcpntNm;
	appInfo += "&dlvdstRcpntCellPhnNo=" + vTelNo;
	appInfo += "&dlvrPstNo=" + vPostcode + "&dlvrBassAddr=" + dlvrBassAddr + "&dlvrDtlAddr=" + dlvrDtlAddr ;//배송지 주소
	appInfo += "&applPhs=06";
	//appInfo += "&cstmField1=${uaStr}";

	//추천직원
	if($("#kbEmpInfo").text() == null || $("#kbEmpInfo").text() == ''){
		appInfo += "&kbBranchCd=&kbBranchNm=&kbDeptCd=&kbDeptNm=&kbEmpNo=&kbEmpNm=";
	}else{
		var empinfo = $("input:radio[name='rdoEmpInfo']:checked").val();
		if(empinfo == undefined || empinfo == null || empinfo == ''){
			empinfo = $("#kbBranchCd").val() + '|' + $("#kbBranchNm").val() + '|' + $("#kbEmpNo").val() + '|' + $("#kbEmpNm").val() + '|' + $("#kbDeptCd").val() + '|' + $("#kbDeptNm").val();
		}

		var emparr   = empinfo.split("|");
		var branchcd = (emparr[0] == undefined || emparr[0] == 'on') ? $("#kbBranchCd").val() : emparr[0];
		var branchnm = (emparr[1] == undefined) ? $("#kbBranchNm").val() : emparr[1];
		var empno    = (emparr[2] == undefined) ? $("#kbEmpNo").val() : emparr[2];
		var empnm    = (emparr[3] == undefined) ? $("#kbEmpNm").val() : emparr[3];
		var deptcd   = (emparr[4] == undefined) ? $("#kbDeptCd").val() : emparr[4];
		var deptnm   = (emparr[5] == undefined) ? $("#kbDeptNm").val() : emparr[5];

		appInfo += "&kbBranchCd="+branchcd+"&kbBranchNm="+branchnm+"&kbDeptCd="+deptcd+"&kbDeptNm="+deptnm+"&kbEmpNo="+empno+"&kbEmpNm="+empnm;
	}

	//추천인
	if($("#friendUsrIdH").val() != null || $("#friendUsrIdH").val() != ''){
		appInfo += "&recoUsrId="+$("#friendUsrIdH").val();
	}

	//증빙서류
	appInfo += fileYnApplInfo();

	//미성년자인경우 1단계 신청정보(법정대리인정보) 추가 저장
	if($("#custTp").val() == "MIN"){
		appInfo += '&legalRprsnYn=Y&legalRprsnNm=' + $('#legalRprsnNm').val();
		appInfo += '&legalRprsnRegNo=' + $('#legalRprsnRegNoH').val();
		//appInfo += '&legalRprsnDriverNo=' + fnSign($('#legalRprsnDriverRgn').val() + $('#legalRprsnDriverNo').val().replace(/-/g,''));
		appInfo += '&legalRprsnDriverNo=' + $('#driverNoH').val(); //fnSign($('#legalRprsnDriverRgn').val() + $('#legalRprsnDriverNo').val().replace(/-/g,''));
		appInfo += '&legalRprsnRel=' + $('#legalRprsnRel').val();
		appInfo += '&legalRprsnTelNo=' + $('#legalRprsnTelNo').val().replace(/-/g,'');
		if($('#legalRprsnDriverNo').val().replace(/-/g,'') == ""){
			appInfo += '&legalRprsnIssueDt=' + $('#legalRprsnJIssDt').val();
		}else{
			appInfo += '&legalRprsnIssueDt=' + $('#legalRprsnIssueDt').val();
		}
	}

	appInfo += "&regrId=APP001" + "&chgrId=APP001";
	console.log("2단계 신청정보저장 applInfo :" + appInfo);


	$.ajax({
        url:'/join/steps/step7/saveCustSvcApplInfo',
        type:'POST',
        data : appInfo,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
        success: function(responseData){
            var data = responseData;
            console.log("saveSvcApplInfo data.result="+data.result);
            if(data.result > 0 ){
                saveCustInfo_2();//고객정보저장
            }
            else if (data.result == -1){
                let opt = {
                    msg : "주소가 정확하지 않습니다.<br>올바른 주소를 검색/선택하여 입력해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
            }
            else{
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
            }
        },
        error : function(request, err){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
        }
	});
}
//고객 정보 저장
function saveCustInfo_2(){
	var vPostcode = $('#postcode').val();
	if(vPostcode == '') vPostcode = "12345";

	var custInfo =  'soId='+ $("#soId").val() + '&custId=' + $('#custId').val();
		custInfo += '&zipCd='+vPostcode+'&baseAddr='+ $('#bassAddr').val()+'&addrDtl='+ $('#dtlAddr').val();

    //개인사업자
    if($("#custTp").val() == "GEF"){
        custInfo += "&repNm="+$("#txRprsNm").val()+"&busiCndt="+$("#txBusiCndt").val()+"&busiTp="+$("#txBusiTp").val();
    }

    custInfo += '&regrId=APP001' + '&chgrId=APP001';

	$.ajax({
        url:'/join/steps/step7/saveCustInfo',
        type:'POST',
        data : custInfo,
        dataType: 'json',
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
        success: function(data){
            console.log("3단계 저장완료-------------------------------------");
            //accordionSetting('3');	//신청단계 세팅

            //고객센터 상담단계
            $("#counselApplStat").val('4');//배송지입력(고객정보입력)

            //가입완료 확인페이지로 이동
			if($("#page_apply").hasClass("on") && $("#confirmBtn").text() == "가입신청") {//최종저장 페이지
                //미성년자인경우 증빙서류 첨부
                if($("#custTp").val() == "MIN"){
                    insertFileInfo();
                }else{
                    saveAppInfo();
                }
            }
        },
        error : function(request, err){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
        }
   });
}
//카드 등록하기
function cardReg(){
	var cnt = Number($("#usimFeeCnt").val());

	if ($('#custId').val() == "") {
        let opt = {
            msg : "가입사전 조회를 진행해주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
	}

	if(cnt > 3){
		let opt = {
            msg : "고객님은 유심비용 선납 대상입니다.<br>유심 비용 자동 출금을 위해 국민은행<br>계좌만 등록 가능하며 개통 이후 카드<br>자동납부로 납부방법 변경 가능합니다.",
            cfrmYn : false
        };
        popalarm(opt);
		return;
	}

	cardNo6_1_tmp   = $("#cardNo6_1").val();
	cardNo6_2_tmp   = $("#cardNo6_2").val();
	cardNo6_3_tmp   = $("#cardNo6_3").val();
	cardNo6_4_tmp   = $("#cardNo6_4").val();
	cardEffcprd_tmp = $("#cardEffcprd").val();
	selCardImg_tmp  = $("#selCardImg").prop("class");

	$("#cardNo6_1").val("");
	$("#cardNo6_2").val("");
	$("#cardNo6_3").val("");
	$("#cardNo6_4").val("");
	$("#cardEffcprd").val("");
	$("#selCardImg").removeClass();
	$("#selCardImg").addClass("sp_card c_none");

	modalLayer.show('layerCardReg');
	$("#btnCardSel").addClass("active");
}
//다른 계좌등록하기
function bankReg(){
	if ($('#custId').val() == "") {
		let opt = {
            msg : "가입사전 조회를 진행해주세요.",
            cfrmYn : false
        };
        popalarm(opt);
		return;
	}

	//값 초기화
	$("#bankNo").val('');
	$("#bankNm").text('');
	$("#bankComp6").val('');
	$("#bankCompNm6").val('');

	$("#btnBankSel").attr('class','sp_bank c_none');
	$("#accRegcdList >li").removeClass("active");
	$("#accRegLayer .type_name dd").text('');


	//국민은행 선택 숨기기
	if($("#bankComp6H").val() == "004"){
		$("#bank004").css("display","none");
	}else{
		$("#bank004").css("display","block");
	}

//	modalLayer.show('accRegLayer'); 화면 직접 입력으로 변경

}
//카드사 선택 (4.납부정보 입력)
function setCardComp_4(cd,nm){
	$("#cardComp6").val(cd);
	$("#cardCompNm6").val(nm);
	$("#btnConfirm").css("display","block");
	$("#btnConfirmCmp").css("display","none");
//	$("#btnConfirm").prop("disabled",false);
}
//선택은행사 세팅(4.납부정보 입력)
function setBankComp_4(cd,nm){
	$("#bankComp6").val(cd);
	$("#bankCompNm6").val(nm);
    $("#bankNo").prop("disabled", false);
	$("#btnBankConfirm").css("display","block");
	$("#btnBankConfirmCmp").css("display","none");
}
//선택은행사 컴포넌트 세팅(4.납부정보 입력) - to-be 추가
function setBankComp(){
    //$("#btn_newBank").html("<span class='account_select'><span class='img_item sm c_" + $("#bankComp6").val() + "'>" + $("#bankCompNm6").val() + "</span></span>");
    $("#btn_newBank").text($("#bankCompNm6").val());
}
function setCardComp(){
    //$("#btn_newCard").html("<span class='card_select'><span class='item c_kb' id='cardKind'>" + $("#cardCompNm6").val() + "</span></span>");
    $("#btn_newCard").text($("#cardCompNm6").val());
    setCardNumber();
}


function setCardNo_4(obj){

	var cardno = $("#cardNoH6").val();
	var len    = 0;

	if(cardno != null){
		len = cardno.length;
	}

	if(obj.name == "cardNo6_1" && len >= 4){
		cardno = cardno.substring(0,4);
		$("cardNo6_1").val(onlyNum(cardno));
	}else if(obj.name == "cardNo6_2" && len >= 8){
		cardno = cardno.substring(4,8);
		$("cardNo6_2").val(onlyNum(cardno));
	}else if(obj.name == "cardNo6_3" && len >= 12){
		cardno = cardno.substring(8,12);
		$("cardNo6_3").val(onlyNum(cardno));
	}else if(obj.name == "cardNo6_4" && len >= 14){
		cardno = cardno.substring(12,len);
		$("cardNo6_4").val(onlyNum(cardno));
	}else{
		if(len >= 4)  $("cardNo6_1").val(onlyNum(cardno.substring(0, 4)));
		if(len >= 8)  $("cardNo6_2").val(onlyNum(cardno.substring(4, 8)));
		if(len >= 12) $("cardNo6_3").val(onlyNum(cardno.substring(8, 12)));

		if(len == 14) $("cardNo6_4").val(onlyNum(cardno.substring(12, 14)));
		if(len == 15) $("cardNo6_4").val(onlyNum(cardno.substring(12, 15)));
		if(len == 16) $("cardNo6_4").val(onlyNum(cardno.substring(12, 16)));
	}
}
//카드번호 세팅 (4. 납부정보입력)
function checkCardNo() {
	var cardNo6_1 = $("#cardNo6_1").val();
	var cardNo6_2 = $("#cardNo6_2").val();
	var cardNo6_3 = $("#cardNo6_3").val();
	var cardNo6_4 = $("#cardNo6_4").val();
	var altMsg = "신용카드 번호를 정확히 입력해 주세요.";

	if( !isEmpty(cardNo6_1) && cardNo6_1.length < 4 ) {
		setAddErrClass("cardNo6_1", altMsg);
	}else if( !isEmpty(cardNo6_2) && cardNo6_2.length < 4 ) {
		setAddErrClass("cardNo6_2", altMsg);
	}else if( !isEmpty(cardNo6_3) && cardNo6_3.length < 4 ) {
		setAddErrClass("cardNo6_3", altMsg);
	} else if( !isEmpty(cardNo6_4) && cardNo6_4.length < 2 ) {
		setAddErrClass("cardNo6_4", altMsg);
	}else{
		setRemoveErrClass("cardNo6_4");
	}
}
//카드 유효기간 세팅 (4. 납부정보입력)
function checkCardEffprd() {
	if( isEmpty($("#cardEffcprd").val()) || $("#cardEffcprd").val().replace("\/","").length!=4 ) {
		setAddErrClass("cardEffcprd", "카드 유효기간을 확인해 주세요.");
	} else {
		setRemoveErrClass("cardEffcprd");
	}
}
//선택 계좌 세팅 (4.납부정보 입력)
function setBankNumber(){
	var inAcntInfo ="";
	var bankNo = $("#bankNoH6").val();

	inAcntInfo += "<span class='account_select'><span class='img_item c_"+$("#bankComp6").val()+"'>" + $("#bankCompNm6H").val() + "</span></span>";
    inAcntInfo += "<span class='info'>"+bankNo+"</span>";
	inAcntInfo += "<input type='hidden' name='acntNo' id='acntNo' value='"+bankNo+"'>";
	$("#acntDiv").empty();
	$("#acntDiv").append(inAcntInfo);

	//선택은행 이미지 변경
//	$("#bankKind").attr("class","icon img_item bank sm c_" + $("#bankComp6").val());
	$('input[id="select_pay_acc"]').prop("checked",true);
//	$("#bankNm2").text($("#bankCompNm6H").val());

//	modalLayer.hide('accRegLayer');
    $("#bankNo").prop("disabled", true);
    $("#btnBankConfirm").css("display", "none");
    $("#btnBankConfirmCmp").css("display", "block");
}
//선택 카드 세팅 (4.납부정보 입력)
function setCardNumber(){
	var inCardInfo ="";
	var cardClass = "";
	var cardNm = "";

	$("#cardNum").val($("#cardNoH6").val());

	if($("#cardComp6").val() == '02'){
		$("#cardKind").attr('class','item c_kb');
		cardClass = "item c_kb";
		cardNm = "국민카드";
	}else if($("#cardComp6").val() == '26'){
		$("#cardKind").attr('class','item c_sh');
		cardClass = "item c_sh";
		cardNm = "신한카드";
	}else if($("#cardComp6").val() == '04'){
		$("#cardKind").attr('class','item c_ss');
		cardClass = "item c_ss";
		cardNm = "삼성카드";
	}else if($("#cardComp6").val() == '07'){
		$("#cardKind").attr('class','item c_hd');
		cardClass = "item c_hd";
		cardNm = "현대카드";
	}else if($("#cardComp6").val() == '01'){
		$("#cardKind").attr('class','item c_bc');
		cardClass = "item c_bc";
		cardNm = "BC카드";
	}else if($("#cardComp6").val() == '03'){
		$("#cardKind").attr('class','item c_ha');
		cardClass = "item c_ha";
		cardNm = "하나카드";
	}else if($("#cardComp6").val() == '71'){
		$("#cardKind").attr('class','item c_nh');
		cardClass = "item c_nh";
		cardNm = "NH카드";
	}else if($("#cardComp6").val() == '08'){
		$("#cardKind").attr('class','item c_lt');
		cardClass = "item c_lt";
		cardNm = "롯데카드";
	}else if($("#cardComp6").val() == '72'){
		$("#cardKind").attr('class','item c_ct');
		cardClass = "item c_ct";
		cardNm = "씨티카드";
	}

	if(($("#joinDataSharingYn").val() == "Y" || ($("#svcTp").val() == "04" && watchCombYn == "Y")) && !isEmpty($("#cardNoH6").val())) {
        inCardInfo += "<span class='card_select'><span class='"+cardClass+"'>" + cardNm + "</span></span>";
        inCardInfo += "<span class='info'>" + $("#cardNoH6").val().substring(0,4) + "-****-****-" + $("#cardNoH6").val().substring(12) +"</span>";
        $("#cardCompNm6H").val(cardNm);
        $("#cardDiv").empty();
        $("#cardDiv").append(inCardInfo);
	}

	$("#cardNm").text(cardNm);
	if($('input[id="select_pay_card"]').prop("checked") == false){
		$('input[id="select_pay_card"]').click();
	}
}

function setCardInfo(){
	chkCardItem_4();
}
/* 카드 번호 형식 */
function cardNoFormat_4(obj) {
	var cardNo = $("#cardNo6_1").val()+$("#cardNo6_2").val()+$("#cardNo6_3").val()+$("#cardNo6_4").val();

	if( isEmpty(cardNo) || cardNo.replace(/-/gi,"").length < 14){
		return;
	}

	$("#cardNoH6").val(cardNo);

	var comp_cd = $("#cardComp6").val();//카드사코드
	var card_no = $("#cardNoH6").val();//카드번호

	if( card_no.length == 15){
		cardNoChk_4(obj);//AMEX 카드번호 형식
	}else if(card_no.length == 16){
		cardNoChk_4(obj);//일반 카드번호 형식
	}else if(card_no.length == 14 && comp_cd == '07'){//현대카드
		cardNoChk_4(obj);//다이너스 카드번호 형식
	}else if(card_no.length == 14 && comp_cd !== '07'){//현대카드
        let opt = {
            msg : "현대카드는 다이너스 카드번호로 입력해주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
	}
}
/* --- 일반 카드번호 형식 (onKeyUp 이벤트) --- */
function cardNoChk_4(obj) {
	var comp_cd = $("#cardComp6").val();//카드사코드
	var card_no = $("#cardNoH6").val();//카드번호
	var errYn = false;

	if(comp_cd == ''){
		if( $("#cardNo6_1").val() != '' && card_no.length < 4) {
//			$("#errMsg_cardNo").show();
//			$("#cardNo6_1").addClass("error");
			errYn = true;
		}else if( $("#cardNo6_2").val() != '' && card_no.length < 8) {
//			$("#errMsg_cardNo").show();
//			$("#cardNo6_2").addClass("error");
			errYn = true;
		}else if( $("#cardNo6_3").val() != '' && card_no.length < 12){
//			$("#errMsg_cardNo").show();
//			$("#cardNo6_3").addClass("error");
			errYn = true;
		}else if( $("#cardNo6_4").val() != '' && card_no.length < 14){
//			$("#errMsg_cardNo").show();
//			$("#cardNo6_4").addClass("error");
			errYn = true;
		}else{
//			$("#errMsg_cardNo").hide();
//			$("#cardNo6_1").removeClass("error");$("#cardNo6_2").removeClass("error");
//			$("#cardNo6_3").removeClass("error");$("#cardNo6_4").removeClass("error");
		    errYn = false;
		}
	}else if(comp_cd == '07'){//현대 다이너스
		if( card_no.length != 14 && card_no.length != 16){
			if( $("#cardNo6_1").val() != '' && card_no.length < 4) {
//				$("#errMsg_cardNo").show();  $("#cardNo6_1").addClass("error");
			    errYn = true;
			}else if( $("#cardNo6_2").val() != '' && card_no.length < 8) {
//				$("#errMsg_cardNo").show();  $("#cardNo6_2").addClass("error");
			    errYn = true;
			}else if( $("#cardNo6_3").val() != '' && card_no.length < 12){
//				$("#errMsg_cardNo").show();  $("#cardNo6_3").addClass("error");
			    errYn = true;
			}else if( $("#cardNo6_4").val() != ''){
//				$("#errMsg_cardNo").show();  $("#cardNo6_4").addClass("error");
			    errYn = true;
			}
		}else{
		    errYn = false;
//			$("#errMsg_cardNo").hide();
//			$("#cardNo6_1").removeClass("error");
//			$("#cardNo6_2").removeClass("error");
//			$("#cardNo6_3").removeClass("error");
//			$("#cardNo6_4").removeClass("error");
		}
	}else if(comp_cd != '07'){
		if( card_no.length != 15 && card_no.length != 16 ){
			if( $("#cardNo6_1").val() != '' && card_no.length < 4) {
//				$("#errMsg_cardNo").show();  $("#cardNo6_1").addClass("error");
			    errYn = true;
			}else if( $("#cardNo6_2").val() != '' && card_no.length < 8) {
//				$("#errMsg_cardNo").show();  $("#cardNo6_2").addClass("error");
			    errYn = true;
			}else if( $("#cardNo6_3").val() != '' && card_no.length < 12){
//				$("#errMsg_cardNo").show();  $("#cardNo6_3").addClass("error");
			    errYn = true;
			}else if( $("#cardNo6_4").val() != ''){
//				$("#errMsg_cardNo").show();  $("#cardNo6_4").addClass("error");
			    errYn = true;
			}
		}else{
		    errYn = false;
//			$("#errMsg_cardNo").hide();
//			$("#cardNo6_1").removeClass("error");
//			$("#cardNo6_2").removeClass("error");
//			$("#cardNo6_3").removeClass("error");
//			$("#cardNo6_4").removeClass("error");
		}
	}

	if(errYn) {
	    setAddErrClass("cardNo6_1", "카드번호를 정확히 입력해 주세요.");
	} else {
	    setRemoveErrClass("cardNo6_1");
	}
}
//카드 입력 항목 체크 (4.납부정보 입력)
function chkCardItem_4(){
	var str = $("#cardNo6_1").val()+$("#cardNo6_2").val()+$("#cardNo6_3").val()+$("#cardNo6_4").val();
	var len = str.length;

	if($("#cardComp6").val() == ""){
        let opt = {
            msg : "카드사를 선택해주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
	}else if(!digitCardNo($("#cardComp6").val(), str)) {
        let opt = {
            msg : "카드번호를 정확히 입력해주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
	}else{
		str = $("#cardEffcprd").val();
		len = str.length;
		if(len < 5 || !chkValidTerm(str)){
            let opt = {
                msg : "유효기간을 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}else{
            $("#cardNum").val($("#cardNoH6").val());
            $("#cardEffcprd6H").val($("#cardEffcprd").val().replace("\/",""));
            $("#cardComp6H").val($("#cardComp6").val());
            $("#cardCompNm6H").val($("#cardCompNm6").val());
			setCardNumber();
//			modalLayer.hide('cardRegLayer');
            $("#btnConfirm").css("display","none");
            $("#btnConfirmCmp").css("display","block");
		}
	}//end if
	//checkNextBtnState(); // 다음버튼 활성/비활성
}

//휴대폰 인증후 계좌번호 세팅
function setAcntNo(){
	$("#bankComp6H").val("004");
	$("#bankCompNm6H").val("국민은행");

	var inAcntInfo ="";
	var mAcnoCnt = $("#mAcnoCnt").val();//보유 계좌 갯수
	var mAcnoArry = JSON.parse($("#mAcnoArry").val());//계좌번호
	var mAcno =$("#mAcno").val();//단일 계좌번호

	inAcntInfo += "<span class='account_select'><span class='img_item c_004'>국민은행</span></span>";

	if(mAcnoCnt>1){
		inAcntInfo += "<span class='info'>" + +String(mAcnoArry[0].ondmdAcno) +"</span>"
		inAcntInfo += "<select name='acntNoSel' id='acntNoSel' style='display:none'>";
		for (var i = 0; i < mAcnoArry.length; i++) {
			if (i == 0) {
				inAcntInfo += "<option value='"+String(mAcnoArry[0].ondmdAcno)+"' selected>"+String(mAcnoArry[0].ondmdAcno)+"</option>";
			} else {
				inAcntInfo += "<option value='"+String(mAcnoArry[i].ondmdAcno)+"'>"+String(mAcnoArry[i].ondmdAcno)+"</option>";
			}
		}//end for
		inAcntInfo +="</select>";
	}else if(mAcnoCnt == 1){
		inAcntInfo += "<span class='info'>" + mAcno + "</span>"
		inAcntInfo += "<input type='hidden' name='acntNo' id='acntNo' value='"+mAcno+"'>"
	}
	//confirmBtnChk($("#chrgPln").val());//나라사랑(일반) 확인버튼 활성화

	$('#acntDiv').empty();
	$('#acntDiv').append(inAcntInfo);
//	$("#bankNm2").text($("#bankCompNm6H").val());
    setAcntNoList();
}

function setAcntNoList(){
	var inAcntListInfo ="";
	var mAcnoCnt = $("#mAcnoCnt").val();//보유 계좌 갯수
	var mAcnoArry = JSON.parse($("#mAcnoArry").val());//계좌번호
	var mAcno =$("#mAcno").val();//단일 계좌번호

	inAcntListInfo += "<li><a href='#' role='button' title='' value=''>다른 계좌로 등록할게요.</a></li>";

	if(mAcnoCnt>1){
        for (var i = 0; i < mAcnoArry.length; i++) {
            if (i == 0) {
                inAcntListInfo += "<li class='on'><a href='#' role='button' title='"+String(mAcnoArry[0].ondmdAcno)+"' value='"+String(mAcnoArry[0].ondmdAcno)+"'>"+String(mAcnoArry[0].ondmdAcno)+"</a></li>";
            } else {
                inAcntListInfo += "<li><a href='#' role='button' title='"+String(mAcnoArry[i].ondmdAcno)+"' value='"+String(mAcnoArry[i].ondmdAcno)+"'>"+String(mAcnoArry[i].ondmdAcno)+"</a></li>";
            }
        }//end for
	}else if(mAcnoCnt == 1){
		inAcntListInfo += "<li class='on'><a href='#' role='button' title='"+mAcno+"' value='"+mAcno+"'>"+mAcno+"</a></li>";
	}

	$("#acntNoListDiv").empty();
	$("#acntNoListDiv").append(inAcntListInfo);
}

//가입신청 정보확인
//chkItem       : AS-IS 가입신청 정보확인
//chkItemOption : TO-BE 단계별 정합성 체크시 본인 회원가입 정보(아이디, 비밀번호, 연락가능한 번호) 별도 체크
function chkItemOption(){
	var usrId = $("#usrId").val().trim();
	var usrPw = $("#usrPw").val().trim();
	var usrPwRe = $("#usrPwRe").val().trim();

	var p_eng  = /[a-zA-Z]/ ;
	var p_num  = /[0-9]/ ;

	var p_eng1  = /[a-zA-Z]/ ;
	var p_num1  = /[0-9]/ ;
	var p_spc1  = /[`~!@#$%^&*|\\\'\";:\/?]/ ;

    setRemoveErrClass("usrId");
    setRemoveErrClass("usrPw");
    setRemoveErrClass("usrPwRe");
    setRemoveErrClass("dvrlTelNo2");

    if($(".btn_check .btn_type").css("display") == "block"){
        let opt = {
            msg : "로그인시 사용할 아이디의 중복확인을 진행해 주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return false;
	}

	if(!$("#usrId").prop("disabled")) {
		if( usrId == "" || !( p_eng.test(usrId) || (p_eng.test(usrId) && p_num.test(usrId)) ) || usrId.length < 6 || usrId.length > 12 ){ //영문 또는 영문과 숫자조합 6-12자리
            let opt = {
                msg : "로그인시 사용할 아이디를 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            setAddErrClass("usrId", opt.msg);
            return false;
		}

	}else{
		if( usrId == "" || usrId.length < 6 ){
			let opt = {
                msg : "로그인 아이디를 확인하지 못했습니다.<br/>다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return false;
		}
	}

	if( $("#divPw").css("display") != "none"){
		if( usrPw == "" ){
			let opt = {
                msg : "비밀번호를 정확히 입력해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            setAddErrClass("usrPw", opt.msg);
            return false;
		} else if( usrPw.length < 8 || usrPw.length > 12 ){
            let opt = {
                 msg : "로그인시 사용할 비밀번호는 영문 숫자 특수문자 조합 8~12자리를 만족해야합니다.",
                 cfrmYn : false
             };
             popalarm(opt);
             setAddErrClass("usrPw", opt.msg);
             return false;
        }else if( usrPwRe == "" ){
            let opt = {
                msg : "비밀번호를 정확히 입력해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            setAddErrClass("usrPwRe", opt.msg);
            return false;
        } else if( usrPwRe.length < 8 || usrPwRe.length > 12 ){
            let opt = {
                 msg : "로그인시 사용할 비밀번호는 영문 숫자 특수문자 조합 8~12자리를 만족해야합니다.",
                 cfrmYn : false
            };
            popalarm(opt);
            setAddErrClass("usrPwRe", opt.msg);
            return false;
        } else if( usrPw.length != usrPwRe.length ) {
            let opt = {
                msg : "입력한 비밀번호와 일치하지 않습니다.",
                cfrmYn : false
            };
            popalarm(opt);
            setAddErrClass("usrPwRe", opt.msg);
            return false;
        } else {

            let url = "/join/steps/chkUsrPwd";
            let param = npPfsCtrl.toJson(document.frm);
            fn_transCall(url, param, fn_certCallBack);

        }
	}

	if( $("#dvrTelNo2Label").css("display") != "none"){
        if($("#dvrlTelNo2").val() == "" || $("#dvrlTelNo2").val().length < 10){
            let opt = {
                msg : "연락 가능번호를 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            setAddErrClass("dvrlTelNo2", opt.msg);
            return false;
    	}
    }

	if($("#divPw").css("display") == "none"){
        goPageForJoin();
	}

	return true;
}
function chkItem(step){

	var telNo    = $("#dvrlTelNo").val().trim();	//(배송)연락가능번호
	var bassAddr = $("#dvrlAddr").val().trim(); 	//배송지 기본주소
	var dtlAddr  = $("#dDtlAddr").val().trim();  	//배송지 상세주소
	var cDvrlNm  = $("#dvrlNm").val().trim();		//수령인
	var dpostcode = $('#DPostcode').val().trim(); //배송지 우편번호

	var usimno   = $("#usimSerialNo").val().trim();
	var usimmngno = $("#usimMngNo").val().trim();

	var payMethod = $('input[name="c-paywray"]:checked').val();//납부
	var acntNo = $('#acntNoSel option:selected').val() ;
	if(acntNo == '' || acntNo == null || acntNo == undefined){
		acntNo = $('#acntNo').val() ;
	}
    var cardNum   = $('#cardNum').val();
    var billMth   = $('input[name="c-billwray"]:checked').val();//청구
    var email     = getEmail();

    if($('#btnCardAuthCmp').css('display') == 'none' && $('#btnKbsignAuthCmp').css('display') == 'none' && $("#btnJoinAuthCmp").css('display') == 'none'){
        let opt = {
            msg : "본인확인을 진행해 주세요.",
            cfrmYn : false,
            okParam : "page_idtCert",
            okCallback : stepActive
        };
        popalarm(opt);
        return;
	}
	if($('#uNoCardDiv').css('display') == 'block' && $("#kcbValue").val() != "1"){
        let opt = {
            msg : "휴대폰 본인인증을 진행해주세요.",
            cfrmYn : false,
            okParam : "page_idtInputOther",
            okCallback : stepActive
        };
        popalarm(opt);
		return;
	}

	//가입유형
	if($("#applTp").val() == "M"){
		if($("#mcoCd").val() == ""){
            let opt = {
                msg : "사용중인 통신사를 선택해주세요.",
                cfrmYn : false,
                okParam : "page_transfer",
                okCallback : stepActive
            };
            popalarm(opt);
			return;
		}else if($("#mtelNo").val() == ""){
            let opt = {
                msg : "휴대폰 번호를 입력해 주세요.",
                cfrmYn : false,
                okParam : "page_transfer",
                okCallback : stepActive
            };
            popalarm(opt);
			return;
		}
	}

	//가입자 유형
	if($("#custTp").val() == "GEF"){
		if($("#joinDataSharingYn").val() == "Y" && $("#custTp").val() != "IFX") { // 데이터쉐어링 가입

		} else {
            var altMsg = "";
            var targetPageId = "";

			if($("#txRprsNm").val() == '') {
				altMsg = "사업자등록증과 동일한 대표자 정보를 입력해 주세요.";
				targetPageId = "page_idtInputBiz2";
			} else if($("#txBusiCndt").val() == '') {
				altMsg = "사업자등록증과 동일한 업태 정보를 입력해 주세요.";
				targetPageId = "page_idtInputBiz2";
			} else if($("#txBusiTp").val() == '') {
				altMsg = "사업자등록증과 동일한 업종 정보를 입력해 주세요.";
				targetPageId = "page_idtInputBiz2";
			} else if($("#busAddr").val() == '') {
				altMsg = "사업자등록증과 동일한 주소 정보를 입력해 주세요.";
				targetPageId = "page_idtInputBiz2";
			} else if($("#busAddrDtl").val() == '') {
				altMsg = "사업자등록증과 동일한 주소 정보를 입력해 주세요.";
				targetPageId = "page_idtInputBiz2";
			} else if($("#chrgNm").val() == '') {
				altMsg = "세금계산서 담당자 이름을 입력해 주세요.";
				targetPageId = "page_idtInputBiz3";
			} else if($("#chrgNm").val() != '' && $("#chrgNm").val().length < 2) {
				altMsg = "2글자 이상 입력해 주세요.";
				targetPageId = "page_idtInputBiz3";
			}else if($("#busTelNo").val() == '') {
				altMsg = "담당자 연락처를 정확히 입력해 주세요.";
				targetPageId = "page_idtInputBiz3";
			} else if($("#busMTelNo").val() == '') {
				altMsg = "담당자 직장 연락처를 정확히 입력해 주세요.";
				targetPageId = "page_idtInputBiz3";
			} else if(!checkEmailStr($("#busEml").val())) {
				altMsg = "담당자 이메일 주소를 정확히 입력해 주세요.";
				targetPageId = "page_idtInputBiz3";
			}

            if(!isEmpty(altMsg)) {
                let opt = {
                    msg : altMsg,
                    cfrmYn : false,
                    okParam : targetPageId,
                    okCallback : stepActive
                };
                popalarm(opt);
                return;
            }
		}
	}else if($("#custTp").val() == "MIN" && ($("#applTp").val() == 'N' || $("#applTp").val() == 'M') ){
		if(!$('#chkFileAfter').is(":checked") && $('#fileList1').text() ==''){
            let opt = {
                msg : "증빙서류를 첨부해 주세요.",
                cfrmYn : false,
                okParam : "page_idtInputMinor3",
                okCallback : stepActive
            };
            popalarm(opt);
            return;
		}
	}

	if($('#select_pay_acc').is(":checked") == true && $("#acntNo").val() == ''){
        let opt = {
            msg : "납부 정보를 입력해주세요.",
            cfrmYn : false,
            okParam : "page_payWay",
            okCallback : stepActive
        };
        popalarm(opt);
        return;
	}

	if($('#select_pay_card').is(":checked") == true && $("#cardNum").val() == ''){
        let opt = {
            msg : "납부 정보를 입력해주세요.",
            cfrmYn : false,
            okParam : "page_payWay",
            okCallback : stepActive
        };
        popalarm(opt);
        return;
	}

    // to-be 이메일 입력 skip으로 인해 최종 화면에서 검증하는 것으로 변경
    if(step == "join") {
        if($('#emlD').val() != 'i' && (isEmpty($('#eml').val()) || $('#eml').val().trim().length == 0)){
            let opt = {
                msg : "이메일을 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
        }

        if($('#emlD').val() == 'i' && (isEmpty($('#emlD2').val()) || $('#emlD2').val().trim().length == 0)) {
            let opt = {
                msg : "이메일을 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
        }

        if(!checkEmailStr(email)) {
            let opt = {
                msg : "이메일을 주소를 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
        }
    }

    chkItemOption(); // 아이디, 비밀번호 정합성 체크

	if($("#page_delivery1").hasClass("display")) {
		if(isEmpty(telNo) || telNo.length < 10){
            let opt = {
                msg : "연락가능번호를 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		} else if(isEmpty(bassAddr) || bassAddr.length == 0) {
            let opt = {
                msg : "유심배송 기본 주소 정보를 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		} else if(isEmpty(dtlAddr) || dtlAddr.length == 0) {
            let opt = {
                msg : "유심배송 상세 주소 정보를 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		} else if(isEmpty(cDvrlNm) || cDvrlNm.length == 0) {
            let opt = {
                msg : "수령인을 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		} else if(isEmpty(dpostcode) || dpostcode.length == 0 || dpostcode == "12345") {
            let opt = {
                msg : "주소가 정확하지 않습니다.<br>올바른 주소를 다시 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}
	}else if(!$("#page_delivery1").hasClass("display")){

		$("#dvrlTelNo").val($("#dvrlTelNo2").val());//(배송)연락가능번호
		$("#dvrlAddr").val($("#bassAddr").val());	//배송지 기본주소
		$("#dDtlAddr").val($("#dtlAddr").val());  	//배송지 상세주소
		$("#dvrlNm").val($("#custNm").val());		//수령인
		$('#DPostcode').val($('#postcode').val()); //배송지 우편번호

		if($("#dvrlTelNo2").val() == '' || $("#dvrlTelNo2").val().length < 10){
            let opt = {
                msg : "연락가능번호를 정확히 입력해주세요.",
                cfrmYn : false,
                okParam : "page_loginInfo1",
                okCallback : stepActive
            };
            popalarm(opt);
			return;
		}
		// to-be 주소 입력 skip으로 인해 최종 화면에서 검증하는 것으로 변경
        if(step == "join") {
            if(isEmpty($('#DPostcode').val()) || $('#DPostcode').val().length == 0 || $('#DPostcode').val() == "12345") {
                let opt = {
                    msg : "주소가 정확하지 않습니다.<br>올바른 주소를 다시 입력해주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
            }
        }
	}

	//납부방법
    if(billMth == ''){
        let opt = {
            msg : "청구서 받는 방법을 정확히 확인해 주세요.",
            cfrmYn : false,
            okParam : "page_payAlarm",
            okCallback : stepActive
        };
        popalarm(opt);
		return;
	} else if(payMethod == ""){
        let opt = {
            msg : "납부방법을 선택해 주세요.",
            cfrmYn : false,
            okParam : "page_payWay",
            okCallback : stepActive
        };
        popalarm(opt);
		return;
	} else if(payMethod == 'ac' && acntNo == ""){
        let opt = {
            msg : "계좌번호를 선택해 주세요.",
            cfrmYn : false,
            okParam : "page_payWay",
            okCallback : stepActive
        };
        popalarm(opt);
		return;
	} else if(payMethod == 'ca' && cardNum == ""){
        let opt = {
            msg : "카드를 선택해 주세요.",
            cfrmYn : false,
            okParam : "page_card",
            okCallback : stepActive
        };
        popalarm(opt);
		return;
	} else if( $("#joinDataSharingYn").val() != "Y" && (payMethod == "ac" && ($("#btnKbsignAutoPay").css("display") != "none" && $("#btnArsAutoPay").css("display") != "none"))){
        let opt = {
            msg : "자동이체 출금동의를 먼저 진행해주세요.",
            cfrmYn : false,
            okParam : "page_widthdrawAgree2",
            okCallback : tepActive
        };
        popalarm(opt);
		return;
	} else if($("#joinDataSharingYn").val() != "Y" && !$("#agreeCheck4").prop("checked")){
        let opt = {
            msg : "필수 항목에 동의해 주세요.",
            cfrmYn : false,
            okParam : "page_payWay",
            okCallback : stepActive
        };
        popalarm(opt);
		return;
	}

	// 유심수령방법
	if (($("#svcTp").val() != "04") && ($("#dlvrMthd").val() == "" || $('input[name="c-receive-type"]:checked').val() == "")) {
        let opt = {
            msg : "유심 수령 방법을 선택해주세요.",
            cfrmYn : false,
            okParam : "page_delivery1",
            okCallback : stepActive
        };
        popalarm(opt);
		return;
	}else if ($("#dlvrMthd").val() == "2" ) {
	    if(!checkQuickRgn(bassAddr)){
	    	let opt = {
                msg : "서울지역만 당일 배송 서비스 신청이 가능합니다.",
                cfrmYn : false,
                okParam : "page_delivery1",
                okCallback : stepActive
            };
            popalarm(opt);
	    	//$('#receipt_2').click();
	    	return;
	    }
	}else if ($("#dlvrMthd").val() == "4" ) {
		if($("#soId").val() == "01" && usimmngno == '') {
	    	let opt = {
                msg : "가입준비 화면에서 유심 모델번호를 선택해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
			return;
		} else if(usimno == '') {
	    	let opt = {
                msg : "가입준비 화면에서 뒷면의 유심 일련번호를 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
			return;
		}
	}

	/**
	 * 추천고객 입력시 권유직원 "없음" 자동 셋팅
	 */
	var kbFriend = $("#kbFriendInfo").text();
	if( kbFriend != "" && kbFriend != undefined ){
		$('#c-recomm-staff-no').prop('checked',true);
	}

	//추천직원
	var kbStaff = $("input[name=c-recomm-type2]:checked").val();
	if(kbStaff == "" || kbStaff == undefined){
        let opt = {
            msg : "가입 추천 직원을 입력해주세요.",
            cfrmYn : false
        };
        popalarm(opt);
		return;
	}

    if(step == "check") {
	    confirmData();
    }

    return true;
}

function confirmData(){

	$("#areaCounselBanner").css("display","none");
	$("#confirmBtn").text("하단으로 스크롤");

	//가입내용
	$("#cSoIdNm").text($("#d_comp").text().replace("망",""));	//통신망
	$("#cApplTpNm").text($("#applTpNm").text());//가입유형
	$("#cChargNm").text($("#fitProdNm").text());//요금제

	if($("#dlvrMthd").val() == "4"){//유심보유여부
		$("#cUsim").text("유심 있음");
	}
	else if($("#dlvrMthd").val() == "5"){
		$("#cUsim").text("eSIM");
	}
	else{
		$("#cUsim").text("유심 없음");
	}

	//외국인인 경우
	if($("#custTp").val() == "IFX"){
		$("#cCustNm").text($("#fNm").val());
	}else{
		$("#cCustNm").text($("#custNm").val());	//고객명
	}

	//개인사업자인경우
	if($("#custTp").val() == "GEF"){
		var busDrvlAddr 	= $("#busAddr").val()+"<br>"+$("#busAddrDtl").val();

		$("#cBizpersonDiv").css('display','');
		$("#cBzno").text($("#bzno").val());
		$("#cBznm").text($("#bznm").val());
		$("#cRepNm").text($("#txRprsNm").val());
		$("#cTxBusiCndt").text($("#txBusiCndt").val());
		$("#cTxBusiTp").text($("#txBusiTp").val());

		$("#cTxBusAddr").empty();
		$("#cTxBusAddr").append(busDrvlAddr);

		$("#cChrgNm").text($("#chrgNm").val());
		$("#cTxTelNo").text($("#busTelNo").val());
		$("#cTxMTelNo").text($("#busMTelNo").val());
		$("#cTxEml").text($("#busEml").val());

	//미성년자인경우
	}else if($("#custTp").val() == "MIN"){
		$("#cLegalNmDiv").css("display","");
		$("#cLegalRprsnNm").text($("#legalRprsnNm").val());
	}

	$("#cUsrId").text($("#usrId").val());	//아이디
	$("#cTelNo").text('');	//휴대폰번호
	$("#cAddr").empty();
	$("#cAddr").append($("#bassAddr").val()+"<br>"+$("#dtlAddr").val());

	//납부방법
	var payMth  = $('input[name="c-paywray"]:checked').val();
	var email   = getEmail();
	var bankAcntNo      = "";  		//선택계좌번호
	var bankNm          = ""; 		//선택 은행
	var cardNo          = ""; 		// 선택 카드번호
	var cardNm = ""; 				//선택카드사
	$("#cPymNm").empty();

	if(payMth == 'ac'){
	 	var acntno = $('#acntNoSel option:selected').val();
	 	bankAcntNo = acntno;
		if(bankAcntNo == '' || bankAcntNo == null || bankAcntNo == undefined){
			bankAcntNo = $('#acntNo').val();
		}
		bankNm    = $("#bankCompNm6H").val();

		$("#cPymNm").append("계좌이체<br>"+bankNm+"<br>"+bankAcntNo);
	}else if(payMth == 'ca'){
	  	cardNo          = $("#cardNum").val().replace(/-/g,'');
	  	cardNm = $("#cardCompNm6H").val();

		$("#cPymNm").append("신용카드<br>"+cardNm+"<br>"+cardNo);
	}
	$("#cEmail").text(email);

	var billMth = $('input[name="c-billwray"]:checked').val();//청구서유형
	if(billMth == 'sms'){
		$("#cBillMdm").text("문자");
    } else if(billMth == 'email'){
    	$("#cBillMdm").text("이메일");
    }

	//배송정보
	var dlvrMthd 	= $("#dlvrMthd").val();//유심수령방법
	var dvrlNm 		= $("#dvrlNm").val();
	var dvrlTelNo	= $("#dvrlTelNo").val();
	var drvlAddr 	= $("#dvrlAddr").val()+"<br>"+$("#dDtlAddr").val();
	if(dlvrMthd == "1"){
		$("#cDlvrMthdNm").text("우체국 등기");
	}else if(dlvrMthd == "2"){
		$("#cDlvrMthdNm").text("당일 배송 서비스");
	}else if(dlvrMthd == "4"){
		$("#cDlvrMthdNm").text("유심 수령 완료");
		dvrlNm = "-";
		dvrlTelNo = "-";
		drvlAddr = "-";
	}else if(dlvrMthd == "5"){
		$("#cDlvrMthdNm").text("eSIM 설치");
		dvrlNm = "-";
		dvrlTelNo = "-";
		drvlAddr = "-";
	}else{
		$("#cDlvrMthdNm").text("지점 방문 수령");
	}

	$("#cDvrlNm").text(dvrlNm);	//수령인
	$("#cDvrlTelNo").text(dvrlTelNo);	//연락가능번호
	$("#cDvrlAddr").empty();
	$("#cDvrlAddr").append(drvlAddr);	//유심수령주소

    if(dlvrMthd == "4" || dlvrMthd == "5"){
        $("#btn_cDvrlTelNo, #btn_cDvrlAddr").css("display", "none");
    } else {
        $("#btn_cDvrlTelNo, #btn_cDvrlAddr").css("display", "block");
    }

	//$("#agreechk").prop("checked",false);
	//$("#confirmBtn").prop("disabled",true);

	$("#applyToJoinDiv").css("display","none")
	$("#confirmDiv").css("display","block");

    goPageForJoin(); // 다음 step 이동
}

function fnLMPM000009(chrgPln){
	var searchProdList = new Array(); //변경가능한 상품
	var ratePlan = chrgPln;
	var selectProdInfo = null;

	try{
		$.ajax({
		    url:  '/appIf/v1/ratePlan/LMPM000009',
		    type: 'POST',
		    data: {
		    	soId : "99",
				liivmDataAmt : "",
				liivmDataUnlimit : "",
				liivmSvcTp : "",
				liivmPriceStart : "",
				liivmPriceEnd : "",
				liivmHashTag : ""
		    },
			cache: false,
			dataType: "json",
		    success: function(data) {
		    	if(data.searchProdList.length > 0) {
		    		$.each(data.searchProdList,function(index,item){
		    			/*22.12.28 지서연 사원 추가
		    			 * 가입불가 요금제 선택 시 자동 변경되는 요금제로 세팅 - 기본세팅요금제 : LTE 7GB+ 무제한
		    			 */
		    			if((soId == "01") && ("PD00000931" == item.prodCd)) defaultProdInfo = item;
		    			if((soId == "02") && ("PD00000702" == item.prodCd)) defaultProdInfo = item;

						if(ratePlan == item.prodCd){//선택요금제
							selectProdInfo = item;
	    					gProdGrpCd = item.prodGrpCd; //요금제그룹코드 전역변수에 세팅
						}
		    		});
		    	}
		    },
		    error: function(e) {
				console.log(e.responseText.trim());
				return '';
		    },
		    complete: function() {
		    	setProdInfoData(selectProdInfo);
		    }
		});
	}
	catch(e){
		console.log(e);
	}
}
//요금제그룹정보 조회
function fnLMPM000007(prodSoId, prodGrpCd){
    gProdGrpInfo.length = 0; //현재 화면의 요금제그룹정보 초기화
	gProdGrpCd = prodGrpCd; //요금제그룹코드 전역변수에 세팅
	$("#prodGrpCd").val(gProdGrpCd); //시니어,주니어 신규요금제 프로모션 팝업용 상품 그룹코드 추가_이서현
	$.ajax({
	    url:  '/appIf/v1/ratePlan/LMPM000007',
	    type: 'POST',
	    data: {
	    	soId : prodSoId,
	    	prodGrpCd : prodGrpCd
	    },
		cache: false,
		dataType: "json",
	    success: function(data) {
	    	try{
		    	console.log("--------fnLMPM000007-------");
				if(data.prodGrpInfo != null){
					gProdGrpInfo[0] = data.prodGrpInfo;
				}
	    	}
	    	catch(e){
	    		console.log(e);
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
	    	}

	    },
	    error: function(e) {
			console.log(e.responseText.trim());
			return '';
	    },
	    complete: function() {
	    	fnProdGrpInfoHtml(); //요금제그룹정보 표시
			if(prodGrpCd == "U08"){ //더주는 적금요금제 그룹
				saveProdCtrtCnt(); //더주는 적금요금제 보유여부 체크
			}
			/*22.11.29 지서연 사원 추가
			 * 주니어 요금제 회선 수 체크
			 */
			if(prodGrpCd == "U03" || prodGrpCd == "K08"){
				juniorProdCtrtCnt();
			}
	    }
	});
}
//요금제 그룹 안내 유의사항 매핑
function fnProdGrpInfoHtml(){
	if(gProdGrpInfo.length == 0){
		$("#grpNoticeDiv").css("display","none");
		return;
	}

	$("#grpNoticeDiv").css("display","block");

	if(isEmpty(gProdGrpInfo[0].noticeDesc) && isEmpty(gProdGrpInfo[0].noticeImgLoc)){
		$("#grpNoticeDesc").parent().css("display","none");
	}else{
		if(!isEmpty(gProdGrpInfo[0].noticeDesc)){
			$("#grpNoticeDesc").html(gProdGrpInfo[0].noticeDesc);
		}
		if(!isEmpty(gProdGrpInfo[0].noticeImgLoc)){
            $("#grpNoticeImg").attr("src", gProdGrpInfo[0].noticeImgLoc);
			$("#grpNoticeImg").attr("alt", gProdGrpInfo[0].noticeImgNm);
			$("#grpNoticeImg").css("display","");
		}else{
			$("#grpNoticeImg").parent().css("display","none");
		}
	}
}

// 요금제 검색 콜백
function callBackProdSearch(prodInfo, searchInfo) {
	if($("#applTp").val() == "M" && prodInfo.prodCd == "PD00000613"){
        let opt = {
            msg : "[LTE 워치] 요금제는 [번호이동] 가입이 불가합니다.<br>[신규가입]으로 진행해주시기 바랍니다.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
	}else{
	    if(prodInfo.prodCd == "PD00000613") {
	        $("#esimYn").val("N"); // 워치 요금제의 경우 esimYn을 강제로 N으로 변경
	    } else {
	        $("#esimYn").val(pEsimYn); // 그 외에는 이전 화면 단계의 값으로 진행
	    }
		setProdInfoData(prodInfo);
		ratePlan = prodInfo.prodCd;
	}
}
// 요금제 검색
function prodSearch() {
	//$.openProdSearchLayer(callBackProdSearch);
    $.openProdSearchLayer(callBackProdSearch, {isValid : true, svcSoId : $("#soId").val(), svcProdCd : ""});
    $('a[name="c-phone-com"]').each(function(index){
        if($(this).attr("data-so-id") != soId){
            $(this).parent().css("display", "none");
        }
    });
}
function setProdInfoData(data){
	if(data != null){
		try{
			// 요금제 속성
			var vFitCss = "lte";
			var vFitCssNm = "LTE";
			if(data.svcTp == "02")  {
                vFitCss = "five_g", vFitCssNm = "5G";
            } else if(data.svcTp == "03") {
			    vFitCss = "tablet", vFitCssNm = "테블릿";
            } else if(data.svcTp == "04") {
             	vFitCss = "watch", vFitCssNm = "워치";
			}

			// 통신사
			var vSoId = "lg_u";
			var vSoNm = "LG U+";
			if(data.soId == "02") {
			    vSoId = "kt", vSoNm = "KT";
			} else if(data.soId == "03") {
			    vSoId = "skt", vSoNm = "SKT";
			}

			var badgeHtml = "";
			badgeHtml += "<span class='badge "+ vFitCss + "'>" + vFitCssNm + "</span>";
			badgeHtml += "<span class='badge "+ vSoId + "'>" + vSoNm + "</span>";
			$(".badge_group").html(badgeHtml);

			//요금제정보세팅
			$("#fitProdNm").text(data.prodNm);
			$("#d_comp").text(vSoNm + "망");

            //통신요금
			$("#prodPrice").val(data.prodPrice);
			$("#fitProdPrice, #fitProdPrice2").text(makeComma(Number(data.prodPrice))+"원");

			if($("#joinDataSharingYn").val() == "Y" && $("#custTp").val() != "IFX") { // 데이터쉐어링 가입
				$("#fitDataUnit, #fitDataUnit2").text(isEmpty(data.dataUnit) ? "-" : data.dataUnit);
				$("#fitVoiceUnit, #fitVoiceUnit2").text(isEmpty(data.voiceUnit) ? "-" : data.voiceUnit);
				$("#fitSmsUnit, #fitSmsUnit2").text(isEmpty(data.smsUnit) ? "-" : data.smsUnit);
			} else {
				$("#fitDataUnit, #fitDataUnit2").text(data.dataUnit);	//데이터
				$("#fitVoiceUnit, #fitVoiceUnit2").text(data.voiceUnit);//음성
				$("#fitSmsUnit, #fitSmsUnit2").text(data.smsUnit);		//문자
			}

			$("#fitMoveVatPrice").text("0원");	//번호이동수수료
			if($("#esimYn").val() == "C" || $("#esimYn").val() == "Y"){
				$("#fitUsimPrice").text("2,750원");		//유심비
			}
			else{
				$("#fitUsimPrice").text("0원");		//유심비
			}

			$("#svcTp").val(data.svcTp);	// 통신망구분 01:LTE, 02:5G, 03:태블릿, 04:와치
			$("#grpTp").val(data.grpTp1);	// 가입대상 01:LTE, 02:5G, 03:주니어, 04:태블릿, 05:FLEX, 06:군인, 07:QR
			$("#chrgPln").val(data.prodCd);	// 상품코드
			$("#soId").val(data.soId);		// 통신사코드

			//월 예상 납부금액 (부가세포함)
			//$(".mo_box .txt_price > strong > span").text(makeComma(Number(data.prodPrice) - Number(data.eventAmt)));

			if($("#svcTp").val() == "04") { // 워치요금제인 경우
                $("#page_watch, #page_mobileAdd").addClass("display");
			} else {
                $("#page_watch, #page_mobileAdd").removeClass("display");
			}
            setProgressBarDiv();

			fnLMPM000007(data.soId,data.prodGrpCd); //이용안내 문구 가져오기
			changeRatePlanView();//특화요금제 화면

		}catch(e){
			console.log(e);
		}
	}else{//선택요금제가 존재하지 않는 요금제인 경우
		setProdInfoData(defaultProdInfo);
	}
}
//상품별적용할인리스트 및 할인예상금액 계산 세팅
function discountCalc(prodPrice){
	var starClubChk = false;	//스타클럽적용 적용여부
	var friendChk 	= false;	//친구할인적용 적용여부
	var flexChk 	= false ;	//FLEX중복할인 적용여부 ( 주택청약,오픈뱅킹 할인대상일경우 중복할인 불가 )

	var houseChk    = false;    //주택청약할인 적용여부

	var ratePlan 	= $("#chrgPln").val();
	var html		= ""; 	//할인예상금액 상세보기 HTML
	var usimAmt 	= "7700"; //유심비
	var esimAmt     = "2750"; //eSIM비

	dscntAmt 		= 0; 	//할인예상금액 초기화
	MaxDscntAmt 	= 0;	//할인최대금액 초기화

	var info = "soId="+$("#soId").val()+"&prodCd="+$("#chrgPln").val()+"&codeList="+$('#arsltArry').val().split('|');
	$.ajax({
    	url:'/join/steps/prod/getProductDiscountList',
    	type:'POST',
    	data : info,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
    	success: function(data){
    		if(data.prodDisCountList != undefined){
	    		if(data.prodDisCountList.length > 0) {
					$.each(data.prodDisCountList,function(index,item){
						//스타클럽할인인 경우(청구항목코드)
						if(item.svcRateItmTypCd == "SR144" || item.svcRateItmTypCd == "SR017"){
							if(ratePlan == "PD00000933" && !starClubChk) {
								if(item.fctrVal2 == "LDZ004000Z" || item.fctrVal2 == "LDZ0040003") {
									starClubChk = true;
									html +=  getStarClubHtml(data.prodDisCountList);
								}
							}
							else if(!starClubChk){
								starClubChk = true;
								html +=  getStarClubHtml(data.prodDisCountList);
							}

						}//친구결합할인인 경우(청구항목코드)
						else if(item.svcRateItmTypCd == "SR145"){
							if(!friendChk){
								friendChk = true;
								html +=  getFriendHtml();
							}
						}
						//주거래우대 할인
						else if(item.svcRateItmTypCd == "SR143"){
							html += "<li><span class='usage_pee_p'>"+item.fctrValNm2+"</span>";
							if(item.chkYn == "Y"){
								html += "<span class='usage_pee_p'>-"+makeComma(item.rateValAdd)+"원</span></li>";
								dscntAmt = Number(dscntAmt) + Number(item.rateValAdd);//총할인예상금액 더하기
							}else{
								html += "<span class='usage_pee_p'>-0원</span></li>";
							}
						}//워치_모바일결합할인 확인(청구항목코드)
						else if(item.svcRateItmTypCd == "SR245"){
							html += getSpecialHtml(item);
						}//주택청약할인인 경우(청구항목코드)
						/*22.11.11 지서연 사원 추가
						 * 신규 주니어 요금제 관련 주니어 할인 추가
						 */
						else if(item.svcRateItmTypCd == "SR024") {
							if(!houseChk){
								houseChk = true;
								html += getHouseHtml(item);
							}
						}//개인형IRP인 경우(청구항목코드)
						/*22.11.25 이서현 대리 추가
						 * 시니어 요금제 관련 개인형IRP 할인 추가
						 */
						else if(item.svcRateItmTypCd == "SR02287") {
                            html += getIrpHtml(item);
						}//FLEX요금제인경우 (중복불가할인확인) 기존요금제 판매중단으로 주석처리_이서현
						/*else if(ratePlan == "PD00000245" && (item.svcRateItmTypCd == "SR024" || item.svcRateItmTypCd == "SR022")){
							if(!flexChk){
								if(item.chkYn == "Y"){
									flexChk = true;
									html += getSpecialHtml(item);
								}else if(item.svcRateItmTypCd == "SR022"){//마지막 중복확인 청구항목코드이고,적용대상이아니면
									html += getSpecialHtml(item);
								}
							}
						}*/
						/*22.12.21 이서현
						 * Flex LTE(신) 프로모션 할인 명의변경일경우 포함 안됨
						 */
						else if(item.svcRateItmTypCd == "SR02299" && $("#applTp").val() == "T") {
						}
						/*22.12.16 지서연 사원 추가
						 * LTE 무제한 11GB+(LGU+망) 프로모션 할인
						 */
						else if(item.svcRateItmTypCd == "SR02297" && $("#applTp").val() != "T") {
							html += "<li><span class='usage_pee_p'>11GB+ 프로모션</span>";
							html += "<span class='usage_pee_p'>-"+makeComma(item.rateValAdd)+"원</span></li>";
							dscntAmt = Number(dscntAmt) + Number(item.rateValAdd);//총할인 예상금액 더하기
						}
						// 명의변경일 경우 LTE 무제한 7GB+(LGU+망) 프로모션 할인 안보이게 처리_박지은
						else if(item.svcRateItmTypCd == "SR02295" && $("#applTp").val() == "T") {
						}
						// LTE 무제한 7GB+(LGU+망) 프로모션 할인_박지은
						else if(item.svcRateItmTypCd == "SR02295" && $("#applTp").val() != "T") {
							html += "<li><span class='usage_pee_p'>7GB+ 프로모션</span>";
							html += "<dd>-"+makeComma(item.rateValAdd)+"원</dd></dl>";
							dscntAmt = Number(dscntAmt) + Number(item.rateValAdd);//총할인 예상금액 더하기
						}
						else{
							if(item.fctrValNm2 != "") {
								html += "<li><span class='usage_pee_p'>"+item.fctrValNm2+"</span>";
								if(item.chkYn == "Y"){
									html += "<span class='usage_pee_p'>-"+makeComma(item.rateValAdd)+"원</span></li>";
									dscntAmt = Number(dscntAmt) + Number(item.rateValAdd);//총할인예상금액 더하기
								}else{
									html += "<span class='usage_pee_p'>-0원</span></li>";
								}
							}
						}
					});//each END

					//할인최대 금액확인
					MaxDscntAmt = data.prodDisCountList[0].maxDiscount;
					if(dscntAmt > MaxDscntAmt){
						dscntAmt = MaxDscntAmt;
					}
		    	}
    		}

    		//유심비용 확인하기 7,700원
			if(Number($("#usimCnt").val()) >= 3 && $("#usimYn").val() != "Y" && $("#svcTp").val() != "04"){
				$("#fitUsimPrice").text(makeComma(usimAmt)+"원");
				esimAmt = "0";
			}
			else if($("#esimYn").val() == "C" || $("#esimYn").val() == "Y"){
				$("#fitUsimPrice").text(makeComma(esimAmt)+"원");
				usimAmt = "0";
			}
			else if(ratePlan == "PD00000613"){
				$("#fitUsimPrice").text(makeComma(esimAmt)+"원");
				usimAmt = "0";
			}
			else{
				usimAmt = "0";
				esimAmt = "0";
			}
    	},
    	complete: function() {
    		$("#sum_detail").empty();	 //비우기
    		$("#sum_detail").html(html); //할인리스트HTML
			$("#fitDiscount").text("-"+makeComma(Number(dscntAmt))+"원"); //할인예상금액
			$("#fitProdPrice, #fitProdPrice2, #fitMaxDisAmt").text(makeComma(Number(prodPrice))+"원"); //통신요금
			var fitMaxDisAmt = (Number(prodPrice)+Number(usimAmt)+Number(esimAmt)) - Number(dscntAmt);
			if(fitMaxDisAmt < 0) {
				fitMaxDisAmt = 0;
			}
			$("#fitMaxDisAmt2, #fitMaxDisAmt3").text(makeComma(fitMaxDisAmt)+"원"); //(기본료 + 유심비)-할인료
	    }
	});
}
//스타클럽
function getStarClubHtml(prodDisCountList){
	var html = "";
	var custStarClub = new Array();

	//스타클럽적용가능여부확인
	$.each(prodDisCountList,function(index,item){
		if(item.svcRateItmTypCd == "SR144" && item.chkYn == "Y"){
			custStarClub.push(item);
		}
	});
	if(custStarClub.length == 0){
		html += "<li><span class='usage_pee_p'>스타클럽</span>";
		html += "<span class='usage_pee_p'>-0원</span></li>";
	}else{
		/* 스타클럽(이벤트)적용 요금제이고,
		 * 고객이 스타클럽회원인경우 스타클럽할인이 중복으로 들어갈수 있음
		 * (스타클럽적용가능한 할인중 높은금액으로) */
		custStarClub.sort(function(a, b) {
			return (Number(a.rateValAdd) < Number(b.rateValAdd)) ? 1 : (Number(a.rateValAdd) > Number(b.rateValAdd)) ? -1 : 0;
		});

		html += "<li><span class='usage_pee_p'>"+custStarClub[0].fctrValNm2+"</span>";
		html += "<span class='usage_pee_p'>-"+makeComma(custStarClub[0].rateValAdd)+"원</span></li>";
		dscntAmt = Number(dscntAmt) + Number(custStarClub[0].rateValAdd);//총할인 예상금액 더하기
	}
	return html;
}
//친구결합 (가입시엔 확인불가하므로 무조건 0원 세팅)
function getFriendHtml(prodDisCountList){
	var html = "";
    html += "<li><span class='usage_pee_p'>친구결합</span>";
    html += "<span class='usage_pee_p'>-0원</span></li>";

	return html;
}
//주택청약
function getHouseHtml(item) {
	var html = "";
	if(item.chkYn == "Y"){
		html += "<li><span class='usage_pee_p'>주택청약</span>";
		html += "<span class='usage_pee_p'>-"+makeComma(item.rateValAdd)+"원</span></li>";
		dscntAmt = Number(dscntAmt) + Number(item.rateValAdd);//총할인 예상금액 더하기
	}else{
        html += "<li><span class='usage_pee_p'>주택청약</span>";
        html += "<span class='usage_pee_p'>-0원</span></li>";
	}
	return html;
}
//개인형IRP
function getIrpHtml(item) {
	var html = "";
	if(item.svcRateItmTypCd == "SR02287") {
		if(item.chkYn == "Y"){
            html += "<li><span class='usage_pee_p'>개인형IRP</span>";
			html += "<span class='usage_pee_p'>-"+makeComma(item.rateValAdd)+"원</span></li>";
			dscntAmt = Number(dscntAmt) + Number(item.rateValAdd);//총할인 예상금액 더하기
		}else{
            html += "<li><span class='usage_pee_p'>개인형IRP</span>";
            html += "<span class='usage_pee_p'>-0원</span></li>";
		}
	}
	return html;
}
//특화요금제 할인예상금액계산
function getSpecialHtml(item){
	var html = "";

	//워치- 모바일결합할인(청구코드)
	if(item.svcRateItmTypCd == "SR245"){
		//결합인지 확인하기
		if($("#watchCombYn").val() != "Y"){
			html += "<li><span class='usage_pee_p'>"+item.fctrValNm2+"</span>";
            html += "<span class='usage_pee_p'>-0원</span></li>";
		}else{
			html += "<li><span class='usage_pee_p'>"+item.fctrValNm2+"</span>";
			html += "<span class='usage_pee_p'>-"+makeComma(item.rateValAdd)+"원</span></li>";
			dscntAmt = Number(dscntAmt) + Number(item.rateValAdd);//총할인 예상금액 더하기
		}
	//FLEX- 중복불가할인 (청구코드)
	}else if(item.svcRateItmTypCd == "SR024" || item.svcRateItmTypCd == "SR022"){
		if(item.chkYn == "Y"){
            html += "<li><span class='usage_pee_p'>주택청약/오픈뱅킹</span>";
			html += "<span class='usage_pee_p'>-"+makeComma(item.rateValAdd)+"원</span></li>";
			dscntAmt = Number(dscntAmt) + Number(item.rateValAdd);//총할인 예상금액 더하기
		}else{
            html += "<li><span class='usage_pee_p'>주택청약/오픈뱅킹</span>";
            html += "<span class='usage_pee_p'>-0원</span></li>";
		}
	}

	return html;
}
//특화요금제 화면 세팅
function changeRatePlanView(){
	var prodCd = $("#chrgPln").val();
	var dlvrMthd = "1";
	if($("#esimYn").val() == "C" || $("#esimYn").val() == "Y"){
		dlvrMthd = "5";
	}

	if(!isEmpty(prodCd)){
	    //특화요금제 모든화면 숨김
        $("#specialProdDiv_nara, #specialProdDiv_nara2, #specialProdDiv_nara3, #specialProdDiv_min, #specialProdDiv_5g,#specialProdDiv_petInfo,#specialProdDiv_min,#agreePrsinfoPolice2, #agreePrsinfoPublicOfficer2, #agreePrsinfoTeacher2, #specialProdDiv_snr").css("display","none");
		//워치
        //$("#page_watch, #page_mobileAdd").removeClass("display"); // 요금제 확인에서 세팅하는 것으로 변경
		//나라사랑 요금제관련
		$("#narasarangYn, #infoOfferStat, #infoOfferTelNo").val("");
		$("#confirmSoldierBtn").css("display","block");
		$("#infoOfferTelNo").prop("disabled",false);
		//반려동물 요금제
		$("#adoptAgencyNm").prop("disabled",false);
		$("#adoptBtn").prop("disabled", false);
		$("#adoptAgencyNm, #careServiceApplYn").val('');
		//주니어
		$("#chkY,#chkN").prop("checked",false);
		$("#openbankingYn").val("");
		//파일첨부 팝업 노출여부 초기화
		$("#filePopupChk").val("");
		//나라사랑 특화요금제 가입대상확인 버튼관련
        $("#joinTagetBtn").css("display","none");
        $("#prodBtn").css("display","block");

		if($("#custId").val() != ""){
			if($("#custTp").val() != "MIN") setAcntNo(); //계좌리셋
			//이메일 & 납부방법 리셋
			$("#c-bill-sms, #c-bill-email, #select_pay_acc, #select_pay_card, #cardNum, #acntNo").prop("disabled", false);
			$("#eml").val("");
			//$("#emlD").val("i");
			$("#eml").prop("disabled",true);
			$("#emlD2").css("display","block");
			$("#emlD, #emlD2").prop("disabled", false);
			//$("#accRegLayerBtn, #cardRegLayerBtn").css("display","block");
			//$("#accRegLayerBtn").css("display","block");
			$("#select_pay_acc, #c-bill-sms").click();

			/************************************************************************************************************
			 * 특화요금제화면세팅 시작																					*/

			//LTE 워치
			if($("#svcTp").val() == "04"){

                //$("#page_watch, #page_mobileAdd").addClass("display");
				$("#modelItemid, #modelSerialNo, #imei, #modelEid").val("");

				getSvcInfoListW()//모회선 리스트 가져오기
				dlvrMthd = "5";

			}//나라사랑 : 직업군인가족
			else if(prodCd == "PD00000319" || prodCd == "PD00000941"){
				$("#specialProdDiv_nara3").css('display','block'); //서류체출동의 및 직업군인정보
				$("#fileAddYn").val("N");

				setTimeout(function(){
					modalLayer.show("militaryLayer3");
				},250);

			}//나라사랑 : 직업군인
			else if(prodCd == "PD00000321" || prodCd == "PD00000939"){
				$("#specialProdDiv_nara").css('display','block'); //개인정보 및 서류체출동의
				$("#fileAddYn").val("N");
			}//나라사랑 : 일반
			else if(prodCd == "PD00000320" || prodCd == "PD00000937"){
				$("#specialProdDiv_nara2").css("display","block");//개인정보동의 및 가입대상확인
				$("#joinTagetBtn").css("display","block");//가입대상확인
				$("#prodBtn").css("display","none");//다음버튼
			}// 5G30GB
			else if(prodCd == "PD00000555"){
				$("#specialProdDiv_5g").css("display","block");
			}//반려행복 요금제
			else if(prodCd == "PD00000561"){
				$("#specialProdDiv_petInfo").css('display','block');
				$("#petchkBox").css("display","none");
			}
			/*22.11.21 지서연 사원 삭제
			 * 신규 주니어 요금제 할인 조건에 오픈뱅킹이 없어짐에 따라 관련 동의창 삭제
			 */
			//주니어요금제
			else if($("#grpTp").val() == "03"){
				if($("#custTp").val() != "MIN") {
                    let opt = {
                        msg : "주니어LTE 요금제 가입대상이 아닙니다.",
                        cfrmYn : false,
                        okParam : defaultProdInfo,
                        okCallback : setProdInfoData
                    };
                    popalarm(opt);
                    return;
				}
				//가입대상확인
				/*
				if($("#custTp").val() == "MIN"){
					$("#specialProdDiv_min").css("display","block");
				}else{
					popalarm("주니어LTE 요금제 가입대상이 아닙니다.", "info", false, '' ,setProdInfoData(defaultProdInfo));
				}
				*/
			}//시니어요금제 추가_20221117 이서현
			else if($("#grpTp").val() == "08"){
				if(prodCd == "PD00000925" || prodCd == "PD00000927" || prodCd == "PD00000929" || prodCd == "PD00000930"){
					$("#specialProdDiv_snr").css("display","block");
					$("#specialProdTxt_snr").css("display","block");
					var prodNm = $("#fitProdNm").text();
					 $("#cngSnrProdNm").text(prodNm);
					getNowAge(function(age){
						var data = Number(age) - Number("1");//만나이
						if(data < 65){
                            let opt = {
                                msg : "골든라이프 LTE 요금제 가입대상이 아닙니다.",
                                cfrmYn : false,
                                okParam : defaultProdInfo,
                                okCallback : setProdInfoData
                            };
                            popalarm(opt);
                            return;
						}
					});
				}
			}//든든LTE1GB
			else if(prodCd == "PD00000635"){
				modalLayer.show("lte1gbLayer");
			}
			/*22.12.12 지서연 사원 추가 및 삭제
			 * LTE 무제한 11GB+ 요금제 선택 후 나이가 청년희망요금제 나이면 청년희망요금제로 세팅
			 * 기존 LTE든든무제한 11GB+ 요금제는 판매중지됨에 따라 주석 처리
			else if(prodCd == "PD00000637"){
				getNowAge(function(age){//추가 요건 : LTE든든 11GB+신규요금제 선택후 나이가 청년희망요금제 나이이면 청년희망요금제로 셋팅
			        var data = Number(age) - Number("1"); //20220222 만나이 계산

					if(data >= 19 && data <= 36){
			    		setTimeout(function() {
							modalLayer.show('youthlteLayer');// 20220217 청년희망 요금제 추가
			    		}, 200);
						return;
					}
				});
			}
			*/
			else if(prodCd == "PD00000933"){
				getNowAge(function(age){
			        var data = Number(age) - Number("1"); //20220222 만나이 계산

					if(data >= 19 && data <= 36){
			    		setTimeout(function() {
							modalLayer.show('youthlteLayer');// 20220217 청년희망 요금제 추가
			    		}, 200);
						return;
					}
				});
			}
			/*22.12.13 김정호
			/* 기존 청년희망 LTE 11GB+(Ⅱ) 요금제는 판매중지됨에 따라 주석 처리
			else if(prodCd == "PD00000644"){
				getNowAge(function(age){
			        var data = Number(age) - Number("1");//만나이

					if(data < 19 || data > 36){
			    		setTimeout(function() {
			    			popalarm("고객님은 청년희망 LTE요금제<br>가입조건에 해당하지 않습니다. <br>다른요금제를 선택해 주시기 바랍니다. <br><br><span style='color:red;font-weight: 700;'>※청년희망 LTE요금제 가입조건 : <br>만 19세 이상 ~ 만 36세 이하</span>", "info", false, fnLMPM000001('PD00000933'));
			    		}, 500);
					} else {
			    		setTimeout(function() {
			    			popalarm("청년(<span style='color:#31aae6;font-weight: 700;'>만19세 이상 ~ 만36세 이하</span>) 고객에게 <span style='color:#31aae6;font-weight: 700;'>청년할인</span>(<span style='color:red;font-weight: 700;'>8,200</span>원/월) 혜택을 제공합니다.", "info",false,"확인");
			    		}, 500);
					}
				});
			}
			*/
			//청년희망 LTE 11GB+(Ⅲ) 추가
			else if(prodCd == "PD00000949"){
				getNowAge(function(age){
			        var data = Number(age) - Number("1");//만나이

					if(data < 19 || data > 36){
			    		setTimeout(function() {
                            let opt = {
                                msg : "고객님은 청년희망 LTE요금제<br>가입조건에 해당하지 않습니다. <br>다른요금제를 선택해 주시기 바랍니다. <br><br>※청년희망 LTE요금제 가입조건 : <br>만 19세 이상 ~ 만 36세 이하",
                                cfrmYn : false,
                                okParam : "PD00000933",
                                okCallback : fnLMPM000009
                            };
                            popalarm(opt);
                            return;
			    		}, 500);
					} else {
			    		setTimeout(function() {
                            let opt = {
                                msg : "청년(만19세 이상 ~ 만36세 이하) 고객에게 청년할인(7,100 원/월) 혜택을 제공합니다.",
                                cfrmYn : false
                            };
                            popalarm(opt);
			    		}, 500);
					}
				});
			}
			/**
			 * 20221209 양희환 추가
			 * 무궁화(신)_PD00000947, 공무원(신)_PD00000943, 선생님(신)_PD00000945 요금제 추가
			 */
			//무궁화  개인정보동의란 활성화 여부
			else if(prodCd == "PD00000273" || prodCd == "PD00000947"){
				if($("#custTp").val() == "MIN") {
                    let opt = {
                        msg : "무궁화 LTE(신) 요금제 가입대상이 아닙니다.",
                        cfrmYn : false,
                        okParam : defaultProdInfo,
                        okCallback : setProdInfoData
                    };
                    popalarm(opt);
                    return;
				}else{
					$("#agreePrsinfoPolice2").css("display","block");
				}
			}//공무원  개인정보동의란 활성화 여부
			else if(prodCd == "PD00000274" || prodCd == "PD00000943"){
				if($("#custTp").val() == "MIN") {
                    let opt = {
                        msg : "공무원든든 LTE(신) 요금제 가입대상이 아닙니다.",
                        cfrmYn : false,
                        okParam : defaultProdInfo,
                        okCallback : setProdInfoData
                    };
                    popalarm(opt);
                    return;
				}else{
					$("#agreePrsinfoPublicOfficer2").css("display","block");
				}

			}//선생님  개인정보동의란 활성화 여부
			else if(prodCd == "PD00000275" || prodCd == "PD00000945"){
				if($("#custTp").val() == "MIN") {
                    let opt = {
                        msg : "선생님든든 LTE(신) 요금제 가입대상이 아닙니다.",
                        cfrmYn : false,
                        okParam : defaultProdInfo,
                        okCallback : setProdInfoData
                    };
                    popalarm(opt);
                    return;
				}else{
					$("#agreePrsinfoTeacher2").css("display","block");
				}
			}
		}


		/** 특화요금제 화면세팅 끝																					**
		 *************************************************************************************************************/

		//유심기입력시
		if($("#usimYn").val() == "Y" && dlvrMthd != "5") dlvrMthd ="4";
		if(dlvrMthd == "4" || dlvrMthd == "5") setDlvrMthd(dlvrMthd); //배송방법 재세팅

		discountCalc($("#prodPrice").val());
	}
}

//특화요금제(1GB이벤트) :: 이벤트 팝업 확인시 개통이력 확인
function checkEvt1G(){
    getCtrtProdCnt($("#chrgPln").val(), function(result){
        if(result > 0){//LTE든든 1GB이벤트 요금제 존재할경우 LTE든든 1GB로 셋팅
            modalLayer.show('lte1gbLayer1');
            fnLMPM000009('PD00000563');
            return;
        }
    });
}

//모회선리스트 가져오기
function getSvcInfoListW(){
	var info = "soId="+$("#soId").val()+"&custId="+$("#custId").val();
	$.ajax({
    	url:'/join/steps/step5/getSvcInfoList',
    	type:'POST',
    	data : info,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
    	success: function(data){
    		$("#svcInfoSelect").empty();//모회선 비우기
    		$("#svcTelNoListDiv").empty();//모회선 리스트 선택

    		if(data != null){
   	   			var svcInfoList = data.svcInfoList;

	   	   		if(svcInfoList.length != 0){
		   			for(var i = 0; i < svcInfoList.length; i++){
		   				var info = new Object();
		   				info.ctrtId = svcInfoList[i].ctrtId;
		   				info.svcTelNo = svcInfoList[i].svcTelNo;
		   				info.prodNo = svcInfoList[i].prodCd;
		   				info.modelNm = svcInfoList[i].modelNm;
		   				info.pymAcntId = svcInfoList[i].pymAcntId;
		   				info.prodCnt = svcInfoList[i].prodCnt;
		   				info.adtSvcCnt = svcInfoList[i].adtSvcCnt;
		   				info.dsharCnt = svcInfoList[i].dsharCnt;

		   				var svcNo = svcInfoList[i].svcTelNo;
		   				if(svcNo.length == 11){//서비스번호 하이픈추가
							svcNo = svcNo.substring(0,3)+"-"+svcNo.substring(3,7)+"-"+svcNo.substring(7,11);
						}else if (svcNo.length == 10){
							svcNo = svcNo.substring(0,3)+"-"+svcNo.substring(3,6)+"-"+svcNo.substring(6,10);
						}

		   				var option = $("<option data-map="+JSON.stringify(info)+">"+svcNo+"</option>");
		   				$("#svcInfoSelect").append(option);

		   				var inSvcTelNo = "";

                        inSvcTelNo += "<div class='radio_item box_type'>";
                        inSvcTelNo += "<input type='radio' id='svcTelNo_" + svcNo + "' name='m-svcTelNo' value='" + svcNo + "'>";
                        inSvcTelNo += "<label for='svcTelNo_" + svcNo + "' class='label'>";
                        inSvcTelNo += "<span class='line_group'>";
                        if($("#soId").val() == "01") {
                            inSvcTelNo += "<span class='badge lg_u'>LG U+</span>";
                        }else if($("#soId").val() == "02") {
                            inSvcTelNo += "<span class='badge kt'>KT</span>";
                        }else if($("#soId").val() == "03") {
                            inSvcTelNo += "<span class='badge skt'>SKT</span>";
                        }
                        inSvcTelNo += "<span>" + svcNo + "</span>";
                        inSvcTelNo += "</span>";
                        inSvcTelNo += "</label>";
                        inSvcTelNo += "</div>";

    		            $("#svcTelNoListDiv").append(inSvcTelNo);

		   				if(i==0) {
		   				    $("#svcInfoDiv").find(".myp_info_num > .info").text(svcNo);
		   				}
		   		  	}
	   	   		}else{
	   	   			/*회선이 없음*/
	   	   			console.log("(모회선 없음)");
		   	   	}
		   	}else{
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
		   	}
	    },
    	error : function(request, err){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
    	}
    });

	//워치정보입력 초기화
	$("input:radio[name='c-watch']").prop("checked",false);
	$("input:radio[name='c-conn-mobile']").prop("checked",false);
	$("input:radio[name='c-share']").prop("checked",false);
	$("#selectSharDiv").css('display','none');
	$("#svcInfoDiv").css('display','none');
	$("#sharN").prop("checked",true);
}
// 모바일결합 회선 선택
function setSelectsvcTelNoList() {
    var svcTelNo = $('input:radio[name="m-svcTelNo"]:checked').val();

    if(isEmpty(svcTelNo) || svcTelNo == undefined ||svcTelNo == "undefined") {
        let opt = {
            msg : "결합할 모바일 회선을 선택해 주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
    } else {
        modalLayer.hide();
        $("#svcInfoDiv").find(".myp_info_num > .info").text(svcTelNo);
        $("#svcInfoSelect").val(svcTelNo);
    }
}
//단계 확인
function infoDeny(step){
	console.log("진행중인 단계확인"+step);

	if($("#custId").val() == "") {
        let opt = {
            msg : "가입자 본인확인 단계를 진행해주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
	}

	if($("#custId").val() != "" && step == "3"){
		if($("#applTp").val() == "N" || $("#applTp").val() == "T"){
			saveApplTp();

		}else if($("#applTp").val() == "M"){
			//통신사별 분기 _스마트개통 MNP 운영시간여부체크
			sendSB804();
		}
	}

	/*
	if($(".join_reg_status .step .write").eq(1).text() == "작성필요" &&  step != '2'){
		popalarm("가입내용 단계를 진행해주세요.", "",false,'', function(){
			$("#step2 > h2 > a").click();
		});
	}*/
}
//단계펼침 -> 특정 스텝 또는 화면 이동으로 변경
function stepActive(step){
	if(step == null) return;
	if(typeof step == "undefined") return;

	var targetPageId = "";

	if(typeof step != "string") {
	    if(step == 1)       targetPageId = "page_bizType";
	    else if(step == 2)  targetPageId = "page_prodInfo";
	    else if(step == 3)  targetPageId = "page_loginInfo1";
	} else if(typeof step == "string") {
        targetPageId = step;
    } else {
        return;
    }

    if(!$("#" + targetPageId).hasClass("on")) { // 현재 활성화된 페이지가 이동대상 페이지인 경우 이동하지 않음
        goPageForJoin(targetPageId);
    }
}

function setKbUsrInfo(){
    if($("#friendUsrId").val().length < 6){
        setAddErrClass("friendUsrId", "아이디를 정확히 입력해 주세요.");
        return;
    }
    // 추천인 아이디가 "WELCOME"일 경우 이벤트 조건에 해당하는지 확인
    else if($("#friendUsrId").val().toUpperCase() == "WELCOME"){
        checkExceptTime_welcomeEvt();
    }else{
        setRemoveErrClass("friendUsrId");
        selectKbUsrId();
    }
}

// 추천친구검색
function selectKbUsrId(){
	var param  = 'usrId=' + $("#friendUsrId").val().trim()+'&custId=' + $("#custId").val();
	console.log("selectKbUsrId param = " + param);

	$.ajax({
        url:'/join/steps/step7/selectKbUsrId',
        type:'POST',
        data : param,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
        success: function(data){
            console.log(JSON.stringify(data));
            if(data.friendUsrId != ""){
                modalLayer.hide();

                let opt = {
                    msg : "입력하신 아이디로 추천 고객이 등록되었습니다.",
                    cfrmYn : false
                };
                popalarm(opt);

                $("#friendUsrIdH").val(data.friendUsrId);
                $("#kbFriendInfo").text(maskUsrId(data.friendUsrId));
                //$("#recommFriendResultDiv").css("display","block");
                //$("#kbEmpInfo").text("");
                //$("input:radio[name='rdoEmpInfo']:checked").val('');
                //$('#c-recomm-staff-no').prop('checked',true);
                //$("#recommStafResultDiv").css("display","none");

                //친구추천 등록시 권유직원 찾기 불가. 2023.01.03 MGM 개발 추가- 3900189
                //$("#recommPersonDiv").css("display","none");

                $("#friendUsrId").val(''); //검색란 비우기
                $("#c-recomm-friend").parent().find("label").text($("#kbFriendInfo").text());
                $("#c-recomm-friend").prop("checked",true);

                clickNoStaff(); // 추천직원 없음
            }else{
                /*let opt = {
                    msg : "해당 추천 아이디는 존재하지 않습니다. 다시 확인해주세요.",
                    cfrmYn : false
                };
                popalarm(opt);*/
                setAddErrClass("friendUsrId", "해당 추천 아이디는 존재하지 않습니다. 다시 확인해주세요.");

                $("#friendUsrIdH").val('');

                $("#kbFriendInfo").text('');
                $("#recommFriendResultDiv").css("display","none");
            }
        },
        error : function(request, err){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
        }
	});
}

function selectKbEmp(){
	if(!chkEmpNm()){
        let opt = {
            msg : "지점명 또는 직원이름 또는 직원번호를 정확히 입력해주세요.",
            cfrmYn : false
        };
        popalarm(opt);
		return;
	}
	// 테스트 직원번호 1582939
	var param  = 'empNm=' + $("#empNm").val()+'&branchCd=KB0';// + $("input:radio[name='rdoBranch']:checked").val();
	param += "&soId="+$("#soId").val();

	console.log(" selectKbEmp param = " + param);
	$.ajax({
        url:'/join/steps/step7/selectKbEmp',
        type:'POST',
        data : param,
        //dataType: 'json',
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
        success: function(responseData){
            var data = responseData;
            var html = "";
            console.log("selectKbEmp data.result="+JSON.stringify(data.result));

            if(data.result !== 'null' && data.result !== null && data.result !== ''){
                var emplist = data.result;
                var empnm="",empno="",branchcd="",branchnm="",deptno="",deptnm="";
                var empinfo = "";
                var empcnt = 0;

                html += "<div class='form_group row'>";

                for(var i = 0 ; i < emplist.length ; i++ ){
                    branchcd = emplist[i].branchCd;
                    branchnm = emplist[i].branchNm;
                    empno    = emplist[i].empNo;
                    empnm    = emplist[i].empNm;
                    deptcd   = emplist[i].deptCd;
                    deptnm   = emplist[i].respons;
                    empinfo  = branchcd + '|' + branchnm + '|' + empno + '|' + empnm + '|' + deptcd + '|' + deptnm;

                    html += "<span class='form_check'>";
                    if(i == 0){
                        html += "<input type='radio' id='rdoEmpInfo" + i + "' name='rdoEmpInfo' value='" + empinfo + "' checked>"
                        html += "<label for='rdoEmpInfo" + i + "' class='label'><span>" + branchnm + " " + deptnm + " " + empnm + " (직원번호 " + empno + ")</span></label>"
                    }else{
                        html += "<input type='radio' id='rdoEmpInfo" + i + "' name='rdoEmpInfo' value='" + empinfo + "'>"
                        html += "<label for='rdoEmpInfo" + i + "' class='label'><span>" + branchnm + " " + deptnm + " " + empnm + " (직원번호 " + empno + ")</span></label>"
                    }
                    html += "<input type='hidden' id='empInfo" + i + "' value='" + empnm + "(" + branchnm + " " + deptnm + ")'>";
                    html += "</span>";

                    empcnt += 1;
                }//end for

                html += "</div>";
                $("#emp_list").html(html);
                $("#empCnt").text(numberWithCommas(empcnt));

                setSchState(empcnt);
            }else{
                setSchState(0);
            }
        },
        error : function(request, err){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
        }
	});
}

//KB 추천직원 검색(모바일브랜치 통해서 권유직원번호)
function selectKbEmpAO(empid){
	// 테스트 직원번호 0007196
	var param  = 'empNm=' + empid +'&soId='+$("#soId").val();

	console.log(" selectKbEmp param = " + param);
	$.ajax({
        url:'/join/steps/step7/selectKbEmp',
        type:'POST',
        data : param,
        //dataType: 'json',
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
        success: function(responseData){
            var data = responseData;
            console.log("selectKbEmp data.result="+JSON.stringify(data.result));

            if(data.result !== 'null' && data.result !== null && data.result !== '' && data.result.length != 0){
                var emplist = data.result;
                var branchcd = emplist[0].branchCd;
                var branchnm = emplist[0].branchNm;
                var empno    = emplist[0].empNo;
                var empnm    = emplist[0].empNm;
                var deptcd  = emplist[0].deptCd;
                var deptnm  = emplist[0].respons;

                $("#kbEmpInfo").text(branchnm+' '+deptnm+' '+empnm+' (직원번호 '+empno+')');

                branchcd = (branchcd == undefined || branchcd == 'on') ? $("#kbBranchCd").val() : branchcd;
                branchnm = (branchnm == undefined) ? $("#kbBranchNm").val() : branchnm+' '+deptnm;
                empno    = (empno == undefined) ? $("#kbEmpNo").val() : empno;
                empnm    = (empnm == undefined) ? $("#kbEmpNm").val() : empnm;
                deptcd    = (deptcd == undefined) ? $("#kbDeptCd").val() : deptcd;
                deptnm    = (deptnm == undefined) ? $("#kbDeptNm").val() : deptnm;

                $("#kbBranchCd").val(branchcd);
                $("#kbBranchNm").val(branchnm);
                $("#kbEmpNo").val(empno);
                $("#kbEmpNm").val(empnm);
                $("#kbDeptCd").val(deptcd);
                $("#kbDeptNm").val(deptnm);

                //선택한 추천인
                var html = "";
                html = '<p id="kbEmpInfo">'+$("#kbBranchNm").val()+' '+$("#kbEmpNm").val()+' (직원번호 '+$("#kbEmpNo").val()+')</p>';
                $("#recommStafResultDiv").html(html);
                $("#c-recomm-office2").parent().find("label").text($("#kbEmpNo").val());
			    $("#c-recomm-office2").prop("checked",true);

                clickNoUsrId(); // 추천친구 없음
                $("#page_recommInfo input").prop("disabled",true);
            }else{
                clickNoStaff();
                $("#page_recommInfo input").prop("disabled",false);
            }
        },
        error : function(request, err){
            popalarm("시스템 오류: 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
        }
	});
}

function setKbEmpInfo_1(){
	var checked = $("input:radio[name='rdoEmpInfo']").is(":checked");
	//$("input:radio[name='rdoBranch']:checked").val();
	if(checked){
	   	var rdoBtn  = $("input:radio[name='rdoEmpInfo']");
       	var selidx  = rdoBtn.index(rdoBtn.filter(':checked'));
       	var val     = $("#empInfo"+selidx).val();
       	$("#kbEmpInfo").text(val);
       	$('#btnDelEmp').css("display","");

		modalLayer.hide();

		$("#empNm").val("");
		$("#emp_list").css("display","none");
		$("#emp_srchmsg").css("display","none");
		$("#emp_nosrch").show();
		$('#btnCfnEmp').prop("disabled", true);

		$("#kbempYn").css("display","");

		var empinfo = $("input:radio[name='rdoEmpInfo']:checked").val();

		var emparr   = empinfo.split("|");

		var branchcd = (emparr[0] == undefined || emparr[0] == 'on') ? $("#kbBranchCd").val() : emparr[0];
		var branchnm = (emparr[1] == undefined) ? $("#kbBranchNm").val() : emparr[1]+' '+emparr[5];
		var empno    = (emparr[2] == undefined) ? $("#kbEmpNo").val() : emparr[2];
		var empnm    = (emparr[3] == undefined) ? $("#kbEmpNm").val() : emparr[3];
		//04.08 추가컬럼 (부서코드,부서명)
		var deptcd    = (emparr[4] == undefined) ? $("#kbDeptCd").val() : emparr[4];
		var deptnm    = (emparr[5] == undefined) ? $("#kbDeptNm").val() : emparr[5];

		$("#kbBranchCd").val(branchcd);
		$("#kbBranchNm").val(branchnm);
		$("#kbEmpNo").val(empno);
		$("#kbEmpNm").val(empnm);
		//04.08 추가컬럼 (부서코드,부서명)
		$("#kbDeptCd").val(deptcd);
		$("#kbDeptNm").val(deptnm);

		//선택한 추천인
		var html = "";
		html = '<p id="kbEmpInfo">'+$("#kbBranchNm").val()+' '+$("#kbEmpNm").val()+' (직원번호 '+$("#kbEmpNo").val()+')</p>';
		$("#recommStafResultDiv").html(html);
		$("#c-recomm-office2").parent().find("label").text($("#kbEmpNo").val());


       	//$("#friendUsrIdH").val("");
       	//$("#kbFriendInfo").text("");
       	//$("#recommFriendResultDiv").css("display","none");

        clickNoUsrId(); // 추천친구 없음
	}else{
        let opt = {
            msg : "선택된 항목이 없습니다.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
	}
}
function setSchState(cnt){
	if(cnt > 0){
		$("#nodata_msg").css("display","none");
		$("#emp_list").css("display","");
		$("#emp_srchmsg").css("display","");
//		$("#emp_nosrch").hide();
		$("#btnCfnEmp").prop("disabled",false);
	}else{
		$("#nodata_msg").css("display","");
		$("#emp_list").css("display","none");
		$("#emp_srchmsg").css("display","none");
//		$("#emp_nosrch").show();
		$("#btnCfnEmp").prop("disabled",true);
	}
}
//이름 체크
function chkEmpNm(){
	var len = $("#empNm").val().length;

	$("#errMsg_empNm").hide();
	$("#errMsg_empNm2").hide();
	$("#emp_nosrch").show();

	if(len == 0 ){
		$("#errMsg_empNm").show();
		$("#emp_nosrch").hide();
		$("#empNm").addClass("error");
		return false;
	} else if(len < 2) {
		$("#errMsg_empNm2").show();
		$("#emp_nosrch").hide();
		$("#empNm").addClass("error");
		return false;
	} else {
		$("#errMsg_empNm").hide();
		$("#errMsg_empNm2").hide();
		$("#emp_nosrch").show();
		$("#empNm").removeClass("error");
		return true;
	}
}
//추천직원
function empSrchChk(){
    $("#empNm").val("");
    $("#emp_list").css("display","none");	//검색결과 리스트
    $("#emp_srchmsg").css("display","none"); //검색결과건수
    $('#btnCfnEmp').prop("disabled", true);
    $('#rdoEmpKB0').prop("checked",true);
    $("#nodata_msg").css("display","none");

    $("#recommStaffRegLayer").find(".btn_type").attr("onclick", "selectKbEmp()");
    drawBottomPopup("추천직원 검색", "recommStaffRegLayer", "");

    $("#recommStaffRegLayer_dev").attr("onclick", "clickNoStaff()"); // 그냥 닫기를 한 경우
}
function clickNoStaff() {
    $("#kbEmpInfo").text("");
    $("input:radio[name='rdoEmpInfo']:checked").val("");
    $("#c-recomm-office2").parent().find("label").text("직원 검색");
    $("#c-recomm-staff-no").click();
}
function clickNoUsrId() {
    $("#friendUsrIdH").val("");
    $("#kbFriendInfo").text("");
    $("#c-recomm-friend").parent().find("label").text("추천친구 검색");
    $("#c-recomm-friend-no").click();
}
//단계세팅-1단계:35 %, 2단계:70%, 3단계:100%
function accordionSetting(step){
	/*var num=0;
	var stepClass2 = $(".join_reg_status .step").eq(1).attr("class");//2단계상태	step:미작성, step done:작성
	var stepClass3 = $(".join_reg_status .step").eq(2).attr("class");//3단계상태

	//작성현황알기
	if(stepClass3 == "step done")	return;
	else if(stepClass2 == "step done")	num = 2;
	if(num > step) return;  //이전정보 수정시 return

	//진행바 세팅
	$(".done_rate .chart .bar").each(function(i){
		if(i < step){
			$(".done_rate .chart .bar").eq(i).addClass("done");
		}
	});

	//작성상태 표기
	var index = parseInt(step)-1;	//작성완료 step
	var nextStep = parseInt(step)+1;//작성필요 step
	$(".join_reg_status .step").eq(index).removeClass("ing");
	$(".join_reg_status .step").eq(index).addClass("done");
	$(".join_reg_status .step .write").eq(index).text("작성완료");
	$(".join_reg_status .step").eq(step).addClass("ing");
	$(".join_reg_status .step .write").eq(step).text("작성필요")

	//DIV 작성완료단계
	$("#step"+ step).removeClass("reg_ing");
	$("#step"+ step).addClass("reg_done");
	$("#step"+ step +" > h2 > a > .reg_status").text("- 작성완료");

	//DIV 작성필요단계
	if(step != '3'){
		$("#step"+ nextStep).removeClass("reg_done");
		$("#step"+ nextStep).addClass("reg_ing");
		$("#step"+ nextStep +" > h2 > a > .reg_status").text("- 작성필요");
		//$("#step"+nextStep+" > h2 > a").click();
	}*/

    //20220102 MGM 마케팅 링크 인입시, 추천 ID 자동 세팅팅
    if (step == '2' && recoUsrId != ''){
        if($("#friendUsrIdH").val() == ''){
            $("#friendUsrId").val(recoUsrId);
            selectKbUsrId();
        }
        recoUsrId='';
    }
}

function setAddress(code){
	$("#addressCode").val(code);

//	if(code == "D"){
//		beforePostCode(code); //주소불러오지 않음
//	}else{
    $("#addressRegLayer").find(".btn_address").find(".btn_type").removeAttr("onclick").attr("onclick", "beforePostCode()");
    //$("#addressRegLayer_dev").attr("onclick", "closeDaumPostcode()"); // 그냥 닫기를 한 경우

    modalLayer.show({
       titleUse : true,
       title : "주소 검색",
       id : "addressRegLayer",
       type : "fullpopup",
       closeUse : false
    });
    $("#hPostCode").val(gHusZip);
    $("#hAddress").val(gHusAddr);
    $("#hAddressDtl").val(gHusAddrDtl);
    $("#wPostCode").val(gBasZip);
    $("#wAddress").val(gBasAddr);
    $("#wAddressDtl").val(gBasAddrDtl);
//	}
}
function setSelectAddress() {
	var address 	= "";
    var addressDtl	= "";
    var postCode = "";

    if($("input[name=c-address-type ]:checked").val()  == "1"){//자택
        address 	= $("#hAddress").val();
        addressDtl 	= $("#hAddressDtl").val();
        postCode 	= $("#hPostCode").val();
    }else{//직장
        //고객 CIF 주소 세팅해주기
        address 	= $("#wAddress").val();
        addressDtl 	= $("#wAddressDtl").val();
        postCode 	= $("#wPostCode").val();
    }

    if(address == "" || addressDtl == "" || postCode == ""){
        let opt = {
            msg : "정확한 주소를 입력해주세요.",
            cfrmYn : false
        };
        popalarm(opt);
        return;
    }else{
        var addressCode = $("#addressCode").val(); // C:고객, B:사업장, D:배송지

        if(addressCode == "C"){
            $('#postcode').val(postCode);
            $('#bassAddr').val(address);
            $('#dtlAddr').val(addressDtl);

            $("#cAddr").empty();
            $("#cAddr").append($("#bassAddr").val()+"<br>"+$("#dtlAddr").val());

        }else if(addressCode == "B"){
            $('#BPostcode').val(postCode);
            $('#busAddr').val(address);
            $('#busAddrDtl').val(addressDtl);

            $("#cTxBusAddr").empty();
            $("#cTxBusAddr").append($("#busAddr").val()+"<br>"+$("#busAddrDtl").val());
        }else if(addressCode == "D"){
            $('#DPostcode').val(postCode);
            $('#dvrlAddr').val(address);
            $('#dDtlAddr').val(addressDtl);
            $('#strDPostCode').text(postCode);
            $('#strdvrlAddr').text(address + " " +addressDtl);
            $('#custAddrInfo').css('display','block');
            $('#editAddrInfo').css('display','none');

            $("#cDvrlAddr").empty();
            $("#cDvrlAddr").append($("#dvrlAddr").val()+"<br>"+$("#dDtlAddr").val());
        }
        modalLayer.hide();
    }
}
//최종. 가입 정보 저장
function saveAppInfo(){
	var appInfo = $("#frm").serialize();
	appInfo +="&custNm="+$("#custNm").val();

	if($("#custTp").val() == "MIN"){
		//법정대리인 정보
		appInfo += '&legalRprsnYn=Y&legalRprsnNm=' + $('#legalRprsnNm').val();
		appInfo += '&legalRprsnRegNo=' + $('#legalRprsnRegNoH').val();
		//appInfo += '&legalRprsnDriverNo=' + fnSign($('#legalRprsnDriverRgn').val() + $('#legalRprsnDriverNo').val().replace(/-/g,''));
		appInfo += '&legalRprsnRel=' + $('#legalRprsnRel').val();
		appInfo += '&legalRprsnTelNo=' + $('#legalRprsnTelNo').val().replace(/-/g,'');
	}

	$.ajax({
		url:'/join/steps/step8/saveApplInfo',
		type:'POST',
		data : appInfo,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success: function(responseData){
			var data = responseData;
			if(data > 0){
				checkOSST(); //ITB002전송전 KT통신사전문확인

			} else {
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
			}
  		},
		error : function(request, err){
			loading('stop'); // loding 수동제거
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}
	});
}
//최종. 가입 정보 조회
function getJoinInfo() {
	var url = "/join/steps/step8/getJoinApplInfo";

	$.ajax({
		type : "post",
		url : url,
		data : {
			soId : $("#soId").val(),
			applSeqNo : $("#applSeqNo").val(),
			custId : $("#custId").val()
		},
		async: false,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success : function(data) {
			if(data.joinInfo != null) {
				if(data.joinInfo.custNm != ""){
					getServerNow(data.joinInfo);
				} else {
                    let opt = {
                        msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                        cfrmYn : false
                    };
                    popalarm(opt);
					applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
				}
			} else {
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
				applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
			}
		},
        error: function(e){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
        	applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
        }
	});
}
//최종. 서버 시간 조회
function getServerNow(joinInfo) {
	var today = '';
	var hour = '';

	$.ajax({
	    url:  '/system/main/getServerNow',
	    type: 'POST',
	    success: function(data) {
	    	console.log(data.curdttm);
	    	today = data.curdttm;
	    	hour = today.substr(8,2);
	    	gToday = today.substr(0,8);

	    	if(hour >= '20' || hour < '08') {
                modalLayer.show({
                    titleUse : true,
                    title : "개통 가능 시간에<br>다시 시도해 주세요",
                    id : "openTimeLayer",
                    type : "bottom",
                    closeUse : false
                });

	    	}else{
	    		eaiJoinIF(joinInfo, data.curdttm);
	    	}
	    },
	    error: function(e) {
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
			applStatRollback(joinInfo.soId, joinInfo.applSeqNo, joinInfo.custId);
	    },
	});
}

// 이벤트 시간 체크
function checkExceptTime_welcomeEvt() {
	var today = '';
	var strDt = "20230109090000";
	var endDt = "20230228235959";

	$.ajax({
	    url: '/system/main/getServerNow',
	    type: 'POST',
	    success: function(data) {
	    	today = data.curdttm;

	    	if(sTarget != "prod"){
	    		strDt = "20230105090000";
	    	}

	    	// 2023.1.9(월) 09:00 ~ 2023.2.28(화) 23:59 이벤트 기간 체크
	    	if(today.substr(0,14) >= strDt && today.substr(0,14) <= endDt){
	    		// 개인고객만 이벤트 대상
	    		if($("#custTp").val() == "II"){
	    			// 만 19세 이상 이벤트 대상
	    			getNowAge(function(age){
	    				if(age > 19){
	    					// 이벤트 조기종영 여부 확인, 쿠폰발행 수 조회
	    	    			getWelcomeEventInfo(function(result){
	    	    				// 이벤트가 유효하고 이벤트 총 수량이 소진된 수량보다 클 경우에만 이벤트 참여가 가능
	    	    				if(result.refCode == "Y" && Number(result.commonCnt) < Number(result.refCode3)){
	    	    					modalLayer.show('eventRecNotiLayer');
	    	    					// 저장할 추천인 ID 셋팅
	    	    	    			$("#friendUsrIdH").val(result.refCode2);

	    	    	    			// 추천고객 입력란에 셋팅
	    	    	    			$("#kbFriendInfo").text(maskUsrId($("#friendUsrId").val()));
	    	    	    			$("#recommFriendResultDiv").css("display","block");

	    	    	    			// 권유직원 입력란 공백으로 처리
	    	    	    			$("#kbEmpInfo").text("");
	    	    	    			//$("#recommStafResultDiv").css("display","none");

	    	    	    			$("input:radio[name='rdoEmpInfo']:checked").val("");
	    	    	    			$('#c-recomm-staff-no').prop('checked',true);

	    	    	    			//추천인 ID 입력란 비우기
	    	    	    			$("#friendUsrId").val("");
	    	    				}else{
	    	    					modalLayer.show('eventEndNotiLayer');
	    	    					// 추천인 ID 입력란 초기화
	    	    					$("#friendUsrId").val("");
	    	    					$("#friendUsrIdH").val('');
	    	    					$("#kbFriendInfo").text('');
	    	    					$("#recommFriendResultDiv").css("display","none");
	    	    				}
	    	    			});
	    				}else{
	    					// 개인이 아니고 만 19세 이상이 아닐 경우에는 추천친구검색
	    					selectKbUsrId();
	    				}
	    			});
	    		}else{
	    			// 개인이 아닐 경우에는 추천친구검색
					selectKbUsrId();
	    		}
			}else{
				// 이벤트 기간이 아닐 경우에는 추천친구검색
				selectKbUsrId();
			}
	    },
	    error: function(e) {
			console.log(e.responseText.trim());
			return false;
	    }
	});
}

// WELCOME 추천인ID 이벤트 정보 조회
function getWelcomeEventInfo(successCallback){
	var param = 'commonGrp=CM00186&commonCd='+$("#friendUsrId").val().toUpperCase();

	$.ajax({
		url:'/join/steps/step7/getWelcomeEventInfo',
		type : 'POST',
		data : param,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success: function(result) {
			var data = result.welcomeEventInfoList[0];
			successCallback(data);
		},
		error: function(Request,status,error){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}
	});
}

// 4. EAI 인터페이스 연동 : 모바일웹 접수가입결과 통지
function eaiJoinIF(joinInfo, now) {
	var serviceId = "ITB002";
	var base = new Object();
	base.serviceId = serviceId;

	var data = new Object();
	var mblPathDstic = $("#dstic").val();

	// 모바일 브랜치로 들어왔을 경우_20230203_박지은
	if(mblPathDstic.includes("AO")){
		var sTemgmYmd = gToday;
		var sTemgmHms = "000000";
		var today = getServerNowTime();
		sTemgmYmd = today.substr(0,8);
		sTemgmHms = today.substr(8,6);

		var headerData = new Object();
		headerData.temgmDstic = "002";
	    headerData.temgmId = "ITB";
	    headerData.soId = joinInfo.soId;	// 01,02,03(통신사구분)
	    headerData.temgmTrsmt = "1";       	// 1:일반전송
	    headerData.temgmPtrn = "1";        	// 1:요청
	    headerData.temgmLen = 1623;        	// 1623(공통+개별=1623)
	    headerData.temgmHms = sTemgmHms;    // 거래시간
	    headerData.temgmYmd = sTemgmYmd;  	// 거래일자
	    headerData.rsultCtnt = "";
	    headerData.rsultCd = "";
	    headerData.temgmRegi = "1";         // 1:등록
	    headerData.temgmNo = "0002502280";
	    headerData.temgmChnlDstcd = "AO";   // AO-모바일브랜치
	    headerData.spare = "";

		data.header = headerData;
		data.mblPathDstic = mblPathDstic;
    }

	var maktngPcDsticd = $("#maktngPcDsticd").val();

	if($("#custTp").val() == "GEF"){
		data.commCustPtDstic = "4";
		data.commCustnm = joinInfo.repNm;

	}else{//개인,외국인,미성년자,미소지자
		data.commCustPtDstic = "1";
		data.commCustnm = joinInfo.custNm;
	}

	if($("#custTp").val() == "UNC"){
		data.docsAthorTYb = "0"; 	//신용카드미소지자 가입시 PPR 서류검수대상 없음
		data.selfCertnDstic = '2';	// 본인인증방법구분  1: 신용카드, 2: 창구인증
		data.mnadJoinYn = "";		// 미성년자가입 여부 - '1'이면 미성년자 통신가입
	}else if($("#custTp").val() == "MIN"){
		data.docsAthorTYb = "1";
		data.selfCertnDstic = '1';
		data.mnadJoinYn = "1";
	}else{
		data.docsAthorTYb = getDocsAthorTYb(joinInfo.prodCd,$("#fileAddYn").val());
		data.selfCertnDstic = getSelfCzWayDstcd(joinInfo.preCheckSucYn); //1:신용카드, 2:창구인증, 3:모바일인증서
		data.mnadJoinYn = "";
	}

	//20221024 고객 마케팅 동의 변경 이력항목추가(T006464)
	//변경전(ITB001에서 가져온값)
	var smsCnsntYn = ""; //문자
	var emalCnsntYn = ""; //이메일
	var telCnsntYn = ""; //전화
	var pstmalCnsntYn = ""; //우편

	smsCnsntYn = $("#orginOption1").val();
	emalCnsntYn = $("#orginOption2").val();
	telCnsntYn = $("#orginOption3").val();
	pstmalCnsntYn = $("#orginOption4").val();

	//변경후
	var afSmsCnsntYn = "";
	var afEmalCnsntYn = "";
	var afTelCnsntYn = "";
	var afPstmalCnsntYn = "";

	var afSmsCnsntYn2		= "";
	var afEmalCnsntYn2		= "";
	var afTelCnsntYn2		= "";
	var afPstmalCnsntYn2	= "";

	afSmsCnsntYn = joinInfo.smsYn;
	afEmalCnsntYn = joinInfo.emailYn;
	afTelCnsntYn = joinInfo.telYn;
	afPstmalCnsntYn = joinInfo.mailYn;

	afSmsCnsntYn2		= $("#selTerm9").val();
	afEmalCnsntYn2		= $("#selTerm10").val();
	afTelCnsntYn2		= $("#selTerm11").val();
	afPstmalCnsntYn2 	= $("#selTerm12").val();

	var screnExpsDstic = "";	//화면노출구분코드
	var pageId = "";	//화면ID
	pageId = location.href.substring(location.href.lastIndexOf('/') + 1);

	if(pageId == ""){
		pageId = "liivM";
	}else{
		if(pageId.indexOf('?') > -1){
			pageId = pageId.substring(0,pageId.lastIndexOf('?'));
		}
	}

	console.log("joinInfo::::"+JSON.stringify(joinInfo));

	//변경전(ITB001에서 가져온값)
	console.log("변경전_smsCnsntYn::::"+smsCnsntYn);
	console.log("변경전_emalCnsntYn::::"+emalCnsntYn);
	console.log("변경전_telCnsntYn::::"+telCnsntYn);
	console.log("변경전_pstmalCnsntYn::::"+pstmalCnsntYn);

	//변경후
	console.log("변경후_smsYn::::"+afSmsCnsntYn);
	console.log("변경후_emailYn::::"+afEmalCnsntYn);
	console.log("변경후_telYn::::"+afTelCnsntYn);
	console.log("변경후_mailYn::::"+afPstmalCnsntYn);

	//기존 동의값(문자,이메일,전화,우편물) 동의가 전부 N이였는데 동의값(문자,이메일,전화,우편물)이 하나라도 동의일 경우
	if ( (smsCnsntYn != "1" && emalCnsntYn != "1" && telCnsntYn != "1" && pstmalCnsntYn != "1")  &&
			 ( afSmsCnsntYn == "1" || afEmalCnsntYn == "1"  || afTelCnsntYn == "1"  || afPstmalCnsntYn == "1" )  ){
		screnExpsDstic = "1"; //동의
	//기존 동의값(문자,이메일,전화,우편물) 하나라도 동의 였는데 동의값(문자,이메일,전화,우편물)값이 전부 N으로 변경할 경우
	}else if( (smsCnsntYn == "1" || emalCnsntYn == "1" || telCnsntYn == "1"  || pstmalCnsntYn == "1") &&
			(afSmsCnsntYn != "1" && afEmalCnsntYn != "1" && afTelCnsntYn != "1" && afPstmalCnsntYn != "1")  ){
		screnExpsDstic = "2"; //거부
	//동의값(문자,이메일,전화,우편물) 기존의 동의상태 였으나 동의한 값이 변경 되었을때
	}else if( ( smsCnsntYn == "1"  || emalCnsntYn == "1" || telCnsntYn == "1"|| pstmalCnsntYn == "1") &&
			( (smsCnsntYn != afSmsCnsntYn) || (emalCnsntYn != afEmalCnsntYn) || (telCnsntYn != afTelCnsntYn) || (pstmalCnsntYn != afPstmalCnsntYn) ) ){
		screnExpsDstic = "3"; //변경
	//기존 동의값과 값을 경우
	}else if( (smsCnsntYn == afSmsCnsntYn) && (emalCnsntYn == afEmalCnsntYn) && (telCnsntYn == afTelCnsntYn) && (pstmalCnsntYn == afPstmalCnsntYn) ){
		screnExpsDstic = "0"; //변경사항없음
	}

	if(maktngPcDsticd == "3" || maktngPcDsticd == "4" || maktngPcDsticd == "5" || maktngPcDsticd == "6"){//알림창 미노출
		data.afltMCnsntDstcd = "0"; //미선택
	}else{
		if( afSmsCnsntYn2 == "1" || afEmalCnsntYn2 == "1"  || afTelCnsntYn2 == "1"  || afPstmalCnsntYn2 == "1"){
			data.afltMCnsntDstcd = "3"; //동의
		}else{
			data.afltMCnsntDstcd = "9"; //거절
		}
	}

	data.afltMSmsCnsntYn	=	afSmsCnsntYn2;
	data.afltMeCnsntYn		=	afEmalCnsntYn2;
	data.afltMTelCnsntYn	=	afTelCnsntYn2;
	data.afltMDmCnsntYn		=	afPstmalCnsntYn2;

	data.commMktDst	= $("#commMktDst").val();
	data.commMktAfDst = $("#commMktAfDst").val();

	data.custIdnfr = joinInfo.custId.substring(0, 10);
	data.custMgtNo = joinInfo.custId.substring(10, joinInfo.custId.length);
	data.rceptYmd = now.substring(0,8);
	data.rceptNo = joinInfo.applSeqNo;
	data.cnclYn = "";

	data.rceptHms = now.substring(8);
	data.askAcitmNo = joinInfo.pymAcntId;
	data.commMberId = joinInfo.usrId;
	data.commRceptDstic = "1";
	data.commJoinPtDstic = getCommJoinPtDstic(joinInfo.applTp);
	data.noMovCommCd = joinInfo.befNp;
	data.agreFareCd = joinInfo.mnoProdCd;
	data.commTermutNm = joinInfo.modelNo;
	data.cntctTelNo = (joinInfo.dlvdstRcpntCellPhnNo == '' ? joinInfo.eaiChgBfrTelNo: joinInfo.dlvdstRcpntCellPhnNo);
	data.emailAddr = joinInfo.reqEmail;
	data.usimQickWayDstic = joinInfo.dlvrMthd;//(isEmpty(joinInfo.usimSerialNo) ? joinInfo.dlvrMthd : "4");
	data.usimRceptBrcd = "";

	//2022.08.05 유심비 세팅 로직 변경
	if(joinInfo.prodCd == "PD00000613"){ //워치
		data.usimCst = 2750;
		data.usimCstAskDstic = "3";//유심비청구구분(익월청구)
	}
	else {
		if($("#esimYn").val() == "C" || $("#esimYn").val() == "Y"){
			data.usimCst = 2750;
			data.usimCstAskDstic = "3";//유심비청구구분(익월청구)
		}
		else if($("#usimYn").val() == "Y"){//유심이 있다면
			if(joinInfo.soId == "01"){
				if(joinInfo.usimMngNo == "U9110" || joinInfo.usimMngNo == "K9040" || joinInfo.usimMngNo == "K3600"){
					data.usimCst = 7700;
					data.usimCstAskDstic = joinInfo.usimType; //유심비청구구분
				}
				else{
					data.usimCst = 0;
					data.usimCstAskDstic = "1"; //유심비청구구분(면제)
				}
			}
			else{
				//KT, SKT
				data.usimCst = 7700;
				data.usimCstAskDstic = joinInfo.usimType; //유심비청구구분
			}
		}
		else{
			data.usimCst = 7700;
			data.usimCstAskDstic = joinInfo.usimType; //유심비청구구분
		}
	}

	data.usimQickFeeDstic = "1"; //유심배송료청구구분
	data.usimQickFee = 0; //유심배송료
	data.usimRceptPost = joinInfo.dlvrPstNo;
	data.usimRceptBascAddr = joinInfo.dlvrBassAddr;
	data.usimRceptDtailAddr = joinInfo.dlvrDtlAddr;
	data.askRecvDstic = getAaskRecvDstic(joinInfo.billMdmGiroYn, joinInfo.billMdmEmlYn, joinInfo.billMdmSmsYn);
	data.askWayDstic = getAskWayDstic(joinInfo.pymMthd);
	data.askBankCd = (joinInfo.pymMthd == "CM" ? joinInfo.cardCorpCd : "");
	data.askCardCd = (joinInfo.pymMthd == "CC" ? joinInfo.cardCorpCd : "");
	data.askAcno = (joinInfo.pymMthd == "CM" ? joinInfo.cardNo : "");
	data.askCardNo = (joinInfo.pymMthd == "CC" ? joinInfo.cardNo : "");
	data.stutPrxyFmlyDstic = joinInfo.legalRprsnRel;
	data.stutPrxyUniqNo = "";
	data.stutPrxyNm = joinInfo.legalRprsnNm;
	data.stutPrxyPost = joinInfo.legalRprsnPstNo;
	data.stutPrxyBascAddr = joinInfo.legalRprsnBassAddr;
	data.stutPrxyDtailAddr = joinInfo.legalRprsnDtlAddr;
	data.stutPrxyEmail = joinInfo.legalRprsnEml;
	data.stutPrxyTelno = joinInfo.legalRprsnTelNo;
	data.dualNoTelNo = joinInfo.eaiChgBfrTelNo;
	data.solicEmpNo = joinInfo.kbEmpNo;
	data.solicBrncd = joinInfo.deptCd;
	data.noMovCertnWay = ""; // 20200417 joinInfo.npAuthMthd;
	data.noMovCertnKey = ""; // 20200417 joinInfo.npAuthKey;
	data.brdtGndrNo = joinInfo.corpRegNo7;
	data.cnsntYms = now;
	data.stpulCnsntYn = joinInfo.infoApproval1Cd;
	data.ppsnSituCnsntYn = "N";//joinInfo.infoApproval2Cd;
	data.uniqGCnsntYn = "N";//joinInfo.infoApproval3Cd;
	data.svcOferCnsntYn = "N";//joinInfo.infoApproval4Cd;
	data.stpulCrCnsntYn = "N";//joinInfo.infoApproval5Cd;
	data.stpulEnCnsntYn = "N";//joinInfo.infoApproval6Cd;
	data.invtCnsntYn = "N";//joinInfo.infoApproval7Cd;
	data.custBoCnsntYn = "";
	data.custAdCnsntYn = "";
	data.grupOfCnsntYn = joinInfo.optionApproval3Cd;
	data.selfOfCnsntYn = joinInfo.optionApproval4Cd;
	if(joinInfo.applTp == "T"){
		data.nmnlModfiRceptNo = $("#giveApplSeqNo").val(); //명의변경양도인접수번호
		data.docsAthorTYb = "1"; //명변 서류첨부
	}else{
		data.nmnlModfiRceptNo = "";
	}
	if($("#soId").val() == "03"){
		data.usimNo = setUsimSerialNo(joinInfo.usimMngNo+""+joinInfo.usimSerialNo);
	}
	else{
		data.usimNo = setUsimSerialNo(joinInfo.usimSerialNo);
	}
	data.usimMdelDstcd = setUsimMngNo(joinInfo.usimMngNo);
	data.smsCnsntYn = joinInfo.smsYn;
	data.emalCnsntYn = joinInfo.emailYn;
	data.telCnsntYn = joinInfo.telYn;
	data.pstmalCnsntYn = joinInfo.mailYn;
	data.selfCzWayDstcd = data.selfCertnDstic;
	data.termutMdelDstic = joinInfo.modelNo;
	data.prxyCustIdnfr = "";
	data.prxyCustMgtNo = "";
	data.prxyOpenBnkgYn = "";

	data.uqGatCnsntYn1 = joinInfo.infoApproval2Cd;
	data.pnGatCnsntYn1 = joinInfo.infoApproval3Cd;
	data.pnSitCnsntYn1 = joinInfo.infoApproval4Cd;
	data.uqOfeCnsntYn1 = joinInfo.infoApproval5Cd;
	data.pnOfeCnsntYn1 = joinInfo.infoApproval6Cd;
	data.ivFinCnsntYn1 = joinInfo.infoApproval7Cd;
	data.uqGatCnsntYn2 = joinInfo.infoApproval8Cd;
	data.pnGatCnsntYn2 = joinInfo.infoApproval9Cd;
	data.uqOfeCnsntYn2 = joinInfo.infoApproval10Cd;
	data.pnOfeCnsntYn2 = joinInfo.infoApproval11Cd;
	data.uqInqCnsntYn2 = joinInfo.infoApproval12Cd;
	data.pnInqCnsntYn2 = joinInfo.infoApproval13Cd;
	data.snJoiCnsntYn  = joinInfo.infoApproval14Cd;

	data.sldrCDocBilnYn = getSldrCDocBiln(joinInfo.infoOfferStat);
	if(joinInfo.infoCustId.length == 15){
		data.occuSCustIdnfr = joinInfo.infoCustId.substring(0, 10);
		data.occuSCustMgtNo = joinInfo.infoCustId.substring(10, 15);
	}
	else{
		data.occuSCustIdnfr = "";
		data.occuSCustMgtNo = "";
	}
	data.occuSCommJoinNo = joinInfo.infoSerivceId;
	data.occuCTelno = joinInfo.infoOfferTelNo;

	data.resvArea = "";
	data.soId= joinInfo.soId;

	//20221024 고객 마케팅 동의 변경 이력항목추가(T006464)
	data.screnExpsDstic = screnExpsDstic;	//화면노출구분코드
	data.pageId = pageId;	//화면ID
	data.userId = "APP001";	//사용자ID
	data.logLodinYn = "Y";	//로그적재구분

	if($("#friendUsrIdH").val() != null || $("#friendUsrIdH").val() != ''){
		data.rcmndrId = $("#friendUsrIdH").val();
	}else{
		data.rcmndrId = "";
	}


	base.data = data;

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/kb/eai/' + serviceId,
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		cache: false,
		dataType: "json",
		success: function(data) {
			if(data.resultCode == "00000" || data.resultCode == "N0000") { // 성공
				if($("#joinDataSharingYn").val() == "Y" && $("#custTp").val() != "IFX") { // 데이터쉐어링 가입
					lastSaveAppInfo(joinInfo);
				} else {
					esbJoinIF(joinInfo);
				}
			} else if(data.resultCode == "00001") { // 실패
				var rsultCd = "";

				try{
					rsultCd = data.data.header.rsultCd;
				} catch(e){
					rsultCd = "";
				}

				if(!isEmpty(rsultCd)) {
					if(rsultCd == "UKGP0027" || rsultCd == "UKGP0025") { // 유심일련번호 검증 에러
                        let opt = {
                            msg : "유심 일련번호가 올바르지 않습니다.<br/>발급받으신 유심 카드의 일련번호를 정확히 확인 후<br/>메인 > 가입하기 화면에서 재 입력해주세요.",
                            cfrmYn : false
                        };
                        popalarm(opt);
                        applStatRollback(joinInfo.soId, joinInfo.applSeqNo, joinInfo.custId);
					} else if(rsultCd == "UKGP0132") {
						var rsultCtnt = "";

						try{
							rsultCtnt = data.data.header.rsultCtnt.substring(0,7);
						} catch(e){
							rsultCtnt = "";
						}

						if(rsultCtnt == "PGP6051") { // M/F 가입접수건이 기 존재함
							if($("#joinDataSharingYn").val() == "Y" && $("#custTp").val() != "IFX") { // 데이터쉐어링 가입
								lastSaveAppInfo(joinInfo);
							} else {
								esbJoinIF(joinInfo); // 이미 M/F 가입접수건 존재하므로 ESB 호출
							}
						} else {
                            let opt = {
                                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                                cfrmYn : false
                            };
                            popalarm(opt);
							applStatRollback(joinInfo.soId, joinInfo.applSeqNo, joinInfo.custId);
						}
					} else {
                        let opt = {
                            msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                            cfrmYn : false
                        };
                        popalarm(opt);
						applStatRollback(joinInfo.soId, joinInfo.applSeqNo, joinInfo.custId);
					}
				} else {
                    let opt = {
                        msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                        cfrmYn : false
                    };
                    popalarm(opt);
					applStatRollback(joinInfo.soId, joinInfo.applSeqNo, joinInfo.custId);
				}
			} else {
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
				applStatRollback(joinInfo.soId, joinInfo.applSeqNo, joinInfo.custId);
			}
		},
		error: function(request,status,error){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
			applStatRollback(joinInfo.soId, joinInfo.applSeqNo, joinInfo.custId);
		}
	});
}


//특화요금제 :: 나라사랑LTE 직업군인가족요금제 안내문자 전송
function sendInfoOffer(joinInfo){
	var vApplSeqNo = $("#applSeqNo").val();
	var vSvcTelNo = $("#infoOfferTelNo").val();
	var vCustNm = $("#custNm").val();
	var url = "/join/state/sendInfoOffer";

	try{
		$.ajax({
			type : "post",
			url : url,
			data : {
				applSeqNo : fnSign(vApplSeqNo),
		    	svcTelNo : fnSign(vSvcTelNo),
		    	custNm : fnSign(vCustNm)
		    },
			cache: false,
			dataType: "json",
            beforeSend : function(xhr, set) {
                let token = $("meta[name='_csrf']").attr("content");
                let header = $("meta[name='_csrf_header']").attr("content");
                xhr.setRequestHeader(header, token);
            },
		    success: function(data) {
		    	console.log("--------fnSendInfoOffer-------");
		    	console.log(data);
		    },
		    error: function(e) {
		    	console.log(e.responseText.trim());
		    },
		    complete: function() {
		    	lastSaveAppInfo(joinInfo);
		    }
		});
	}
	catch(e){
		console.log(e);
		lastSaveAppInfo(joinInfo);
	}
}
//최종 가입 완료 저장 : 일반가입에서만 사용
function lastSaveAppInfo(joinInfo){
	var appInfo = $("#frm").serialize();

	if( $("#custTp").val() == "MIN" ){
		appInfo += '&legalRprsnYn=Y';
	}else if( $("#custTp").val() == "UNC" ){
		appInfo += '&creditCheckSucYn=N';
		appInfo += '&preCheckSucYn=0'
	}

	$.ajax({
		url:'/join/steps/step8/lastSaveApplInfo',
		type:'POST',
		data : appInfo,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success: function(responseData){
			var data = responseData;
			if(data > 0){
				if($("#custTp").val() == "UNC"){
					saveNoCardCheck();
				}else{
					saveFileAddYnCheck();
				}
			} else {
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                applStatRollback(joinInfo.soId, joinInfo.applSeqNo, joinInfo.custId);
			}
  		},
		error : function(request, err){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
			applStatRollback(joinInfo.soId, joinInfo.applSeqNo, joinInfo.custId);
		}
	});
}

function goApplytoCompleted(){
//	$("#frm").attr("action", "/join/steps/applyToCompleted");
//	$("#frm").submit();
	$("#frm").attr("method","post").attr("action", "/join/steps/join-request-complete").submit();
}

function fileYnApplInfo(){//증빙서류가 필요한 요금제인 경우 :: 직업군인, 직업군인가족, 무궁화, 공무원, 선생님
	var appInfo = "";
	if($("#custTp").val() == "UNC"){
		/**
		 * 20221209 양희환 추가
		 * 무궁화(신)_PD00000947, 공무원(신)_PD00000943, 선생님(신)_PD00000945 요금제 추가
		 */
		if($("#chrgPln").val() == "PD00000939" || $("#chrgPln").val() == "PD00000941" ||$("#chrgPln").val() == "PD00000321" || $("#chrgPln").val() == "PD00000319" ||
				$("#chrgPln").val() == "PD00000273" || $("#chrgPln").val() == "PD00000274" || $("#chrgPln").val() == "PD00000275" ||
				$("#chrgPln").val() == "PD00000947" || $("#chrgPln").val() == "PD00000943" || $("#chrgPln").val() == "PD00000945" ){
			appInfo = '&fileAddYn=O';
		}else{
			appInfo = '&fileAddYn=';
		}
	}else if($("#custTp").val() == "MIN"){//가입자유형 : 미성년자의경우 파일첨부 유무로 판단
		if($('#fileList1').text() !=""){
			appInfo = '&fileAddYn=Y';
		}else{
			appInfo = '&fileAddYn=N';
		}
	}else{
		if($("#chrgPln").val() == "PD00000939" || $("#chrgPln").val() == "PD00000941" ||$("#chrgPln").val() == "PD00000321" || $("#chrgPln").val() == "PD00000319" ||
				$("#chrgPln").val() == "PD00000273" || $("#chrgPln").val() == "PD00000274" || $("#chrgPln").val() == "PD00000275" ||
				$("#chrgPln").val() == "PD00000947" || $("#chrgPln").val() == "PD00000943" || $("#chrgPln").val() == "PD00000945" ){
			appInfo = '&fileAddYn='+$("#fileAddYn").val();
		}else if($("#applTp").val() == "T"){//가입유형 : 명의변경일경우
			appInfo = '&fileAddYn=N';
		}else{
			appInfo = '&fileAddYn=';

		}
	}
	return appInfo;
}
//신용체크성공여부값 저장 고정값 N
function saveNoCardCheck(){
	console.log("step2_10  - 신용체크성공여부값 저장 고정값('N') 수정 ");
	var appInfo = 'soId='+ $("#soId").val() + '&applSeqNo=' + $('#applSeqNo').val() + '&custId=' + $('#custId').val()+ '&creditCheckSucYn=N';

	$.ajax({
		url:'/join/steps/reserve/saveNoCardCheck',
		type:'POST',
		data : appInfo,
		async: false,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success: function(data){
			console.log("saveAppInfo data.result="+data);
			if(data > 0){
				saveFileAddYnCheck();
			}else{
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
				applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
			}
		},
		error : function(request, err) {
			loading('stop'); // loding 수동제거
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
			applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
		}
	});
}
//증빙서류첨부여부확인
function saveFileAddYnCheck(){
	var appInfo = 'soId='+ $("#soId").val() + '&applSeqNo=' + $('#applSeqNo').val() + '&custId=' + $('#custId').val();
	appInfo += fileYnApplInfo();
	$.ajax({
		url:'/join/steps/step8/saveFileAddYnCheck',
		type:'POST',
		data : appInfo,
		async: false,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success: function(data){
			console.log("saveAppInfo data.result="+data);
			if(data.result > 0){
				goApplytoCompleted();
			}else{
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
				applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
			}
		},
		error : function(request, err) {
			loading('stop'); // loding 수동제거
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
			applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
		}
	});
}

//신청, 회원 상태 롤백
function applStatRollback(soId, applSeqNo, custId) {
	var url = "/join/steps/step8/applStatRollback";
	$.ajax({
		type : "post",
		url : url,
		data : {
			soId : soId,
			applSeqNo : applSeqNo,
			custId : custId
		},
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        }
	});
}
//휴대폰번호 세팅 (법정대리인정보 입력)
function checkMsgTelNo() {
	if( isEmpty($("#legalRprsnTelNo").val()) || $("#legalRprsnTelNo").val().length<10 || !chkmtelNo($("#legalRprsnTelNo").val()) ) {
		$("#errMsg_legalRprsnTelNo").show();
		$("#legalRprsnTelNo").addClass("error");
	} else {
		$("#errMsg_legalRprsnTelNo").hide();
		$("#legalRprsnTelNo").removeClass("error");
	}
}

//첨부파일 업로드 클릭(ios app 권한체크)
/*function callbackIosCameraAuth(dValue) {
	if(dValue == "Y"){
		fileUploadClick();
	}
}
function fileUploadClick() {
    if ($("#custId").val() == '') {
        let opt = {
            msg : "통신 가입 대상자의 가입 사전 조회를 진행해 주세요.",
            cfrmYn : false
        }
        popalarm(opt);
        return;
    }

    //파일첨부 5개이상 신청한 경우 안내
    if($('#fileList1 .MultiFile-label').length == 5) {
        let opt = {
            msg : "서류 첨부는 최대 5개까지 첨부 가능합니다.",
            cfrmYn : false
        }
        popalarm(opt);
        return;
    }

    if($('#imageIndex').val() > 0) {
        $('#file2_F'+$('#imageIndex').val()).click();
    } else {
        $('#file2').click();
    }
}*/
//첨부파일 업로드 시 (증빙서류 첨부)
function fileUpload(e){
	var idex  = $('#imageIndex').val();
	var picId ='pic'+$('#imageIndex').val();
	var strArry = new Array();
	var check = "";
	var flie = e.target.files[0];
	var name = e.target.files[0].name;

	var strArry1 =  $('#fileError').val().split(',');

	if($('#imageIndex').val() > 0){//동일 파일 비교를 위한 클릭 값
		check = $('#file2_F'+$('#imageIndex').val()).val();
	}else{
		check = $('#file2').val();
	}

	for (var j = 0 ; j < strArry1.length; j ++){  //파일명 비교
		var strArry3 = strArry1[j].split('\\');
		var strArry4 = check.split('\\');
        if(!navigator.userAgent.match(/iPhone/i) && name!="image.jpg" || !navigator.userAgent.match(/iPad/i) && name!="image.jpg"){
            if(strArry3[strArry3.length-1] == strArry4[strArry4.length-1] ){
                let opt = {
                    msg : "동일한 파일은 첨부할 수 없습니다. 다른 파일을 첨부해주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
            }
		}
	}

	if($('#imageIndex').val() > 0){
		$('#fileError').val($('#fileError').val()+','+ $('#file2_F'+$('#imageIndex').val()).val());
	}else{
		$('#fileError').val($('#fileError').val()+','+$('#file2').val());
	}

	if(flie.size > 1024*1000*10){
        let opt = {
            msg : "10MB이내의 사진 파일을 첨부해 주세요.",
            cfrmYn : false
        };
        popalarm(opt);
		return;
	}

	//var html = "<a href='javascript:void(0);' id='Rpic"+idex+"' onclick='imageDetail("+idex+");'><div class='img_area'><img id='pic"+idex+"'/></div></a> <a href='javascript:void(0);' class='btn_remove' onclick='imgDelete("+idex+");' '><span class='blind'>첨부된 파일 삭제</span></a>";
	var html = "<div class='img_area' id='imgDiv"+idex+"' onclick='imageDetail("+idex+");'><img id='pic"+idex+"'/></div> <a href='javascript:void(0);' class='btn_remove' onclick='imgDelete("+idex+");' '><span class='blind'>첨부된 파일 삭제</span></a>";
    $(".file_item_group > .file_item_scroll > .file_item").each(function(index){
        if( $(".file_item_group > .file_item_scroll > .file_item").eq(index).html() == ""){
            $(".file_item_group > .file_item_scroll > .file_item").eq(index).html(html);
            return false;
        }
    });

    $('#pic'+idex).attr('src', URL.createObjectURL(e.target.files[0]));
    idex++;
    $('#imageIndex').val(idex);

    domDisabled('chkFileAfter');
    $('#chkFileAfter').prop('checked', false);

}
//선택된 이미지 삭제 버튼 (5. 증빙서류 첨부)
function imgDelete(number) {
	var check = "";
	var Arry = new Array();

	if(number >0){
		check = $('#file2_F'+number).val();
	}else{
		check = $('#file2').val();
	}
	var strArry1 = $('#fileError').val().split(',');
	for (var j = 0 ; j < strArry1.length; j ++){
		if( strArry1[j] == check ){
			strArry1[j] = "";
		}
		Arry[j] = strArry1[j];
	}

	$('#fileError').val(Arry);
//	$('#imgDiv'+number).parent().empty();
//	$('#imgDiv'+number).parent().find("a").remove();
	$('#imgDiv'+number).parent().remove();
	$('.file_item_scroll').append("<div class='file_item'></div>");
	$('#imgRemove'+number).click();

	if($('#fileList1').text() =='') {
		domEnabled('chkFileAfter');
	}
}
//이미지 상세 보기 (5. 증빙서류 첨부)
function imageDetail(number) {
	var src = $("#pic"+number).attr("src");
	$('#sampleImage').attr("src",src);

    $.ohyLayer({
        content: '#addfilecheck_pop',
        type: 'photo',
        dimAct: true,
    });
}

function fileError(data) {
	$('#fileError').val(data);
}
// 증빙 서류 저장 (증빙서류 첨부) 키패드 확인
function insertFileInfo() {
	var soId = $("#soId").val();
	var custId = $("#custId").val();
	var custNm = $("#custNm").val();
	var legalRprsnNm = $("#legalRprsnNm").val();
	var ctrtId = $("#ctrtId").val();
	var applSeqNo = $("#applSeqNo").val();
	var regNo = fnUnSign($("#regNoH").val());
	var legalRprsnRegNo = fnUnSign($("#legalRprsnRegNoH").val());
	var legalRprsnRelNm = $("#legalRprsnRelNm").val();
	var date =  new Date();
	var today = dateToYYYMMDD(date);
 	$("#today").text(dateToYYYMMDD(date));
	//$("#recpno").val(mvnoCtrtId);
	$("#ch_custId").val(custId);
	$("#ch_custNm").val(custNm);
	$("#ch_ctrtId").val(ctrtId);
	$("#regdt").val(today);
	if($("#custTp").val() == "MIN" && ($("#chrgPln").val() == 'PD00000939' || $("#chrgPln").val() == 'PD00000941'
		|| $("#chrgPln").val() == 'PD00000943' || $("#chrgPln").val() == 'PD00000945' || $("#chrgPln").val() == 'PD00000947')){ //공무원 3종의 경우 안들어 오지만 넣어준다
		$("#bizcd").val("3|5");
		$("#addData").val($("#fitProdNm").text());
	}else{
		$("#bizcd").val("3"); // 3 : 어린이/청소년
	}
	$("#oldApplSeqNo").val(applSeqNo);
	$("#ch_applSeqNo").val(applSeqNo);
	$("#ch_regNo").val(regNo);
	$("#ch_legalRprsnNm").val(legalRprsnNm);
	$("#ch_legalRprsnRegNo").val(legalRprsnRegNo);
	$("#ch_legalRprsnRelNm").val(legalRprsnRelNm);
	$("#sspnresn").val($("#ch_militaryCustNm").val());
	$("#sspnresnCd").val("");
	$("#sspnterm").val($("#ch_militaryDocYn").val());

	if($('#fileList1').text() !=""){
		$('#change').ajaxSubmit({
			url:  "/join/steps/reserve/changeFileInsertAction.ajax",
			type: "POST",
			enctype:"multipart/form-data",
			dataType : 'json',
			processData : false,
			contentType : false,
			cache: false,
			timeout:600000,
            beforeSend : function(xhr, set) {
                let token = $("meta[name='_csrf']").attr("content");
                let header = $("meta[name='_csrf_header']").attr("content");
                xhr.setRequestHeader(header, token);
            },
			success: function(data) {
				if(data.fileUpload == true) {
					saveAppInfo();

				} else {
					console.log("파일 업로드 실패");
                    let opt = {
                        msg : "이미지 형식의 파일이 아닙니다. 파일을 다시 첨부해주세요.",
                        cfrmYn : false
                    };
                    popalarm(opt);
					applStatRollback(soId, applSeqNo, custId);
					return;
				}
			},
			error:function(request,status,error) {
                let opt = {
                    msg : "정상적으로 첨부되지 않았습니다. 다시 한번 진행해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
				applStatRollback(soId, applSeqNo, custId);
				return;
			}/*,
            complete: function() {
	            $("#ch_regNo, #ch_legalRprsnRegNo").val("");
            }*/
		});
	}else{
		saveAppInfo();
	}
}
//DateFormat
function dateToYYYMMDD(date) {
	return date.getFullYear()+'.'+pad(date.getMonth()+1)+'.'+pad(date.getDate());
}
//DateFormat2
function dateToYYYMMDD2() {
	var d =new Date();
	var s =leadingZeros(d.getFullYear(),4)+'.'+leadingZeros(d.getMonth()+1,2)+'.'+leadingZeros(d.getDate(),2)+' ' +leadingZeros(d.getHours(),2)+':'+leadingZeros(d.getMinutes(),2)+':'+leadingZeros(d.getSeconds(),2);
	return s;
}
//DateFormat3
function dateToYYYMMDD3() {
	var d =new Date();
	var s =leadingZeros(d.getFullYear(),4)+'.'+leadingZeros(d.getMonth()+1,2)+'.'+leadingZeros(d.getDate(),2);
	return s;
}
//DateFormat
function dateToYYYMMDD4(date) {
	return date.getFullYear()+pad(date.getMonth()+1)+pad(date.getDate());
}

function pad(num){
	num = num +'';
	return num.length < 2 ? '0' + num : num ;
}

function leadingZeros(n,digits) {
	var zero ='';
	n =n.toString();

	if(n.length < digits) {
		for(i =0 ;i <digits-n.length;i++ )
			zero +='0';
	}
	return zero + n ;
}
//미성년자
function makeAlert(){
	var chk = $('#chkFileAfter').is(":checked");
	if(chk){
		var str = "신청서 작성 완료 후<br>\'회원정보관리>증빙서류 관리\' 메뉴에서<br>증빙서류를 첨부해주세요.<br>신청일 기준 30영업일 이내에<br>서류제출 및 확인이 완료되지 않으면<br>신청이 자동 취소됩니다.";
		let opt = {
            msg : str,
            cfrmYn : false
        };
        popalarm(opt);
        return;
	}
}

//주민번호 체크 (2. 법정대리인정보입력)
function chkLegJumin() {

	var str = onlyNum($("#legalRprsnRegNoRf").val()) + onlyNum($("#legalRprsnRegNoRb").val());
	var len = str.length;
	var st = "1"; // 주민등록증 1

	setRemoveErrClass("legalRprsnRegNoRf");
	setRemoveErrClass("legalRprsnRegNoRb");

	if(st == '1' && len == 0) {
		setAddErrClass("legalRprsnRegNoRf", "필수 입력 사항입니다.");
		return false;
	} else {
		str = str.replace(/-/g,'');
		var chkyn = checkJumin(str);

		if(st == '1' && !chkyn) {
		    setAddErrClass("legalRprsnRegNoRf", "주민등록번호를 정확히 입력해주세요.");
			return false;
		} else if(chkLegFrgAdt(str)) {
		    setAddErrClass("legalRprsnRegNoRf", "주민등록번호를 정확히 입력해주세요.");
			return false;
		} else {
		    setRemoveErrClass("legalRprsnRegNoRf");
	        setRemoveErrClass("legalRprsnRegNoRb");
			return true;
		}
	}
}
// 주민번호 앞 세팅 (2. 법정대리인정보입력)
function juminLegFormat_f(obj) {
	var str = onlyNum(obj.value);
	str = str + $("#legalRprsnRegNoRb").val();

	$("#legalRprsnRegNoH").val(str);

 	str = $("#legalRprsnRegNoH").val();
	var len = str.length;

	if(len == 0) {
		$("#divLegalJumin").addClass('error');
		$("#errMsg_legalRprsnRegNo").show();
	} else {
		if(len <= 6) {
			return;
		}
		$("#divLegalJumin").removeClass('error');
		$("#errMsg_legalRprsnRegNo").hide();
		$("#errMsg_legalRprsnRegNo_fa").hide();
		str = str.replace(/-/g,'');
		var chkyn = checkJumin(str);
		if(!chkyn) {
			$("#divLegalJumin").addClass('error');
			$("#errMsg_legalRprsnRegNo").show();
		} else if(chkLegFrgAdt(str)) {
			$("#regLegNoRf").addClass('error');
			$("#errMsg_legalRprsnRegNo_fa").show();
		}
	}
}
// 주민번호 뒤 세팅 (2. 법정대리인정보입력)
function juminLegFormat_b(obj) {
	var str = onlyNum(obj.value);
	str = $("#legalRprsnRegNoRf").val() + str;

	$("#legalRprsnRegNoH").val(str);

 	str = $("#legalRprsnRegNoH").val();
	var len = str.length;


	if(len == 0) {
	    $("#legalRprsnRegNoRb").addClass('error');

	} else {
		$("#legalRprsnRegNoRb").removeClass('error');
//		$("#divLegalJumin").removeClass('error');
//		$("#errMsg_legalRprsnRegNo").hide();
//		$("#errMsg_legalRprsnRegNo_fa").hide();
		str = str.replace(/-/g,'');
		var chkyn = checkJumin(str);
		if(!chkyn) {
			$("#legalRprsnRegNoRb").addClass('error');
			//$("#errMsg_legalRprsnRegNo").show();
		} else if(chkLegFrgAdt(str)) {
			$("#legalRprsnRegNoRb").addClass('error');
			//$("#errMsg_legalRprsnRegNo_fa").show();
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
// 주민번호세팅 (2. 법정대리인정보입력)
function setJuminLegNo(obj) {
	var regNo = onlyNum($("#legalRprsnRegNoH").val());
	$(obj).val(regNo);
}
// 운전면허번호세팅 (2. 법정대리인정보입력)
function setDriverNo(obj) {
	var driverNo = onlyNum($("#legalRprsnDriverNo").val());
	$(obj).val(driverNo);
}

//휴대폰번호 세팅 (2. 법정대리인정보 입력)
function checkMsgTelNo() {
	if( isEmpty($("#legalRprsnTelNo").val()) || $("#legalRprsnTelNo").val().length<10 || !chkmtelNo($("#legalRprsnTelNo").val()) ) {
		$("#errMsg_legalRprsnTelNo").show();
		$("#legalRprsnTelNo").addClass("error");
	} else {
		$("#errMsg_legalRprsnTelNo").hide();
		$("#legalRprsnTelNo").removeClass("error");
	}
}
//KB PIN 조회 국민계좌보유여부 (2. 법정대리인정보입력)
function getLegKBCustInfo() {
	if ($("#custId").val() == '') {
        let opt = {
            msg : "통신 가입 대상자의 가입 사전 조회를 진행해 주세요.",
            cfrmYn : false
        };
        popalarm(opt);
		return;
	}

	let url = '/appIf/v1/kb/ITB001';
	let param = npPfsCtrl.toJson(document.frm);
	param.soId = $("#soId").val();
	//param.cuniqno = cuniqno;
	param.cuniqnoDstic = "1";

	fn_transCall(url, param, fn_legCertCallBack);
}
// 콜백
function fn_legCertCallBack(tranId, data){
    $("#legalRprsnRegNoH").val(data.regNo);
    $("#driverNoH").val(data.driverNo);

    data = fnUnSign(data.enc);

    if(!isEmpty(data)){
        data = JSON.parse(data);
    }

    if(isEmpty(data) || data.resultCode !== '00000') {
        popalarm({
            msg: "일시적으로 오류가 발생하였습니다. 다시 시도해주세요.",
            cfrmYn: false
        });
        return;
    } else {
        var vKBPin = data.data.custIdnfr + data.data.custMgtNo;
        // KB PIN 있는 경우
        if (vKBPin != "") {
            /************
            * 법정대리인 KB PIN
            */
            var cnifNo   = data.data.cnifNo;//고객 CI 값
            var cnifNoEnc   = data.data.cnifNoEnc;//고객 CI값을 KB 공통 암호화 처리한 값
            $('#legCustId').val(data.data.custIdnfr + data.data.custMgtNo);//KB PIN
            $('#certCustId').val(vKBPin);
            $('#cnifNo').val(cnifNo);
            $('#cnifNoEnc').val(cnifNoEnc);

            /************
            * 고객계좌번호
            */
            var acnoArry = data.data.ondmdAcnoArray;//요구불계좌정보 ARRAY
            var acnoCnt = 0;//Number(data.data.ondmdAcnoCnt);//요구불계좌건수
            var acno = data.data.ondmdAcno;//요구불계좌번호
            acnoCnt = (acnoArry == '' || acnoArry == null || acnoArry == undefined) ? 0 : acnoArry.length;

            if(acnoCnt > 0) {
                for (var i = 0 ; i < acnoArry.length ; i++ ) {
                    if(i == 0) {
                        acno  = acnoArry[0].ondmdAcno;
                    } else {
                        acno  = acno + '|' + acnoArry[i].ondmdAcno;
                    }
                }//end for
            }

            if(acnoArry.length == 1){ //계좌번호 1개일 경우
                $("#mAcno").val(acno);
            }
            $('#mAcnoCnt').val(acnoCnt);//보유 계좌 갯수
            $('#mAcnoArry').val(JSON.stringify(acnoArry));//계좌번호 리스트

            /************
            * 고객실적할인정보
            */
            var arsltArry = data.data.custArsltDscntArray;//고객실적할인 ARRAY
            var arsltCnt = 0;//Number(data.data.custArsltDscntCnt);//고객실적할인건수
            var arsltCdAmt = "";
            var arsltCd = data.data.custArsltDscntCd;//고객실적할인코드
            var arsltAmt = data.data.custArsltDscntAmt;//고객실적할인금액
            arsltCnt = (arsltArry == '' || arsltArry == null || arsltArry == undefined) ? 0 : arsltArry.length;

            if(arsltCnt > 0) {
                for (var i = 0 ; i < arsltArry.length ; i++ ) {
                    if(i == 0) {
                        arsltCdAmt  = arsltArry[i].custArsltDscntCd ;
                    } else {
                        arsltCdAmt  = arsltCdAmt + '|' + arsltArry[i].custArsltDscntCd;
                    }
                }//end for
            } else {
                arsltCdAmt = arsltCd ;
            }

            // 부모오픈뱅킹 코드확인
            if($('#arsltArry').val().indexOf('LDZ0070122') > -1){
                $('#arsltArry').val($('#arsltArry').val()+"|"+"LDZ0070122");
            }

            /************
             * 납부방법 법정대리인 계좌세팅
             */
            var inAcntInfo ="";
            var mAcnoCnt = acnoCnt;//보유 계좌 갯수
            var mAcnoArry = acnoArry;//계좌번호
            var mAcno = acno;//단일 계좌번호
            var inAcntListInfo ="";

            $("#bankComp6H").val("004");
            $("#bankCompNm6H").val("국민은행");


            inAcntInfo += "<span class='account_select'><span class='img_item c_004'>국민은행</span></span>";
            inAcntListInfo += "<li><a href='#' role='button' title='' value=''>다른 계좌로 등록할게요.</a></li>";
            if(mAcnoCnt>1){
                inAcntInfo += "<span class='info'>계좌를 선택하세요</span>"
                inAcntInfo += "<select name='acntNoSel' id='acntNoSel' title='계좌번호 선택'>";
                for (var i = 0; i < mAcnoArry.length; i++) {
                    if (i == 0) {
                        inAcntInfo += "<option value='"+String(mAcnoArry[0].ondmdAcno)+"' selected>"+String(mAcnoArry[0].ondmdAcno)+"</option>";
                        inAcntListInfo += "<li class='on'><a href='#' role='button' title='"+String(mAcnoArry[0].ondmdAcno)+"' value='"+String(mAcnoArry[0].ondmdAcno)+"'>"+String(mAcnoArry[0].ondmdAcno)+"</a></li>";
                    } else {
                        inAcntInfo += "<option value='"+String(mAcnoArry[i].ondmdAcno)+"' selected>"+String(mAcnoArry[i].ondmdAcno)+"</option>";
                        inAcntListInfo += "<li><a href='#' role='button' title='"+String(mAcnoArry[i].ondmdAcno)+"' value='"+String(mAcnoArry[i].ondmdAcno)+"'>"+String(mAcnoArry[i].ondmdAcno)+"</a></li>";
                    }
                }//end for
                inAcntInfo +="</select>";
            }else if(mAcnoCnt == 1){
                inAcntInfo += "<span class='info'>" + mAcno + "</span>";
                inAcntInfo += "<input type='hidden' name='acntNo' id='acntNo' value='"+mAcno+"'>";
                inAcntListInfo += "<li class='on'><a href='#' role='button' title='"+mAcno+"' value='"+mAcno+"'>"+mAcno+"</a></li>";
            }

            if(mAcnoCnt > 0){
                $('#acntDiv').empty();
                $('#acntDiv').append(inAcntInfo);
                //$("#bankNm2").text($("#bankCompNm6H").val());
            }

            $("#acntNoListDiv").empty();
            $("#acntNoListDiv").append(inAcntListInfo);

        // KB PIN 없는 경우
        }else {
            $('#legCustId').val("");//KB PIN
            $("#mAcno, #mAcnoArry, #mAcnoCnt").val("");
            $('#acnoArry').val("");
            $('#arsltArry').val("");
            $('#cnifNo').val("");
            $('#cnifNoEnc').val("");
            console.log("kbpin 없는 경우");
        }

        //신분증진위여부
        if($("#soId").val() == "03"){
            sendSKSU00101(); 	// -> 신분증검증 SKSU00101 ->  KCB본인인증 팝업 오픈

        }else if($("#soId").val() == "02"){
            openKCBCertPopup(); // -> 신분증검증없이 KCB본인인증 팝업 오픈

        }else if($("#soId").val() == "01"){
            IdentityAuth(); 	// -> 신분증검증 CM806 ->  KCB본인인증 팝업 오픈
        }
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

function getEmail(){
	var email = $('#eml').val() + "@";//이메일
	if($("#emlD2").css('display')  == "block"){
		email = $("#emlD2").val();
	}else{
		email += $("#emlD").val();
	}
	return email;
}
//외국인이름 체크
function chkFnmLen(){
	var len = $("#fNm").val().length;

	if(len == 0){
		setAddErrClass("fNm", "이름을 정확히 입력해 주세요.");
		return false;
	} else {
		setRemoveErrClass("fNm");
		return true;
	}
}
//외국인 실명번호 체크
function chkFnoLen(){
	var len = $("#fNo").val().length;

	if(len == 0){
		setAddErrClass("fNo", "실명번호를 입력해 주세요.");
		return false;
	} else if(len < 13 ){
		setAddErrClass("fNo", "실명번호를 정확히 입력해 주세요.");
		return false;
	} else {
		setRemoveErrClass("fNo");
		return true;
	}
}
//외국인 체류코드 기본 체크
function chkForeignerStyCdLen(){
	var len = $("#foreignerStyCd").val().length;

	if(len == 0){
		setAddErrClass("foreignerStyCd", "체류코드를 정확히 입력해 주세요.");
		return false;
	} else {
		setRemoveErrClass("foreignerStyCd");
		return true;
	}
}

function fnPassPwdRule(objNm){
	var retVal = "";
	var usrPw = $('#'+objNm).val().trim();
	//var birthDay = $("#regNoH").val().substr(0, 6);

	if( isEmpty($("#usrPw").val()) || $("#usrPw").val().length<8  || $("#usrPw").val().length>12 ) {
		retVal = "영문 숫자 특수문자 조합하여 8~12자리로 입력해주세요";
	}
	else if(/(0123)|(1234)|(2345)|(3456)|(4567)|(5678)|(6789)|(7890)/.test(usrPw)
			|| /(0987)|(9876)|(8765)|(7654)|(6543)|(5432)|(4321)|(3210)/.test(usrPw)
			|| /(qwer)|(asdf)|(zxcv)|(wert)|(sdfg)|(xcvb)|(erty)|(dfgh)|(cvbn)/.test(usrPw)
			|| /(rtyu)|(fghj)|(vbnm)|(tyui)|(ghjk)|(yuio)|(hjkl)|(uiop)/.test(usrPw)){
		retVal = "연속된 문자 또는 숫자입니다. 비밀번호를 정확히 입력해주세요.";
	}
	else if(/(\w)\1\1\1/.test(usrPw)){
		retVal = "동일한 문자 또는 숫자는 사용할 수 없습니다. 비밀번호를 정확히 입력해주세요.";
	}
	/*else if (usrPw.indexOf(birthDay) > -1){
		retVal = "생년월일과 일치하는 숫자입니다.다시 설정해주세요.";
	}*/
	else if ( $("#usrId").val().trim() != "" && usrPw.indexOf($("#usrId").val().trim())  > -1){
		retVal = "아이디와 동일한 비밀번호는 사용할 수 없습니다. 비밀번호를 정확히 입력해주세요.";
	}

	return retVal;
}
//항목 UI 체크
function chkLen(target){
	var len = $("#"+target).val().length;
	$("#errMsg_"+target).hide();

	if(len == 0 ){
		$("#errMsg_"+target).show();
		$("#"+target).addClass("error");
		return false;
	} else {
		$("#errMsg_"+target).hide();
		$("#"+target).removeClass("error");
		return true;
	}
}

function changeCustTpView(custTp){
	//가입유형자별 화면 세팅전 초기화 (성인기준)
	/*
	    #uNoCardDiv - 신용카드 미소지자
	    #childDiv - 미성년자(법정대리인)
	    #foreignerDiv - 외국인
	    #bizpersonDiv - 사업자
	    #minorAuthDiv - 미성년자 사전조회

	    #identitySelectDiv - 성인신분증진위확인
	    #JIssDtDiv - 주민등록증
	    #defaultDiv - 국민인증서인증, 신용카드인증 등... 인증방법선택
	    #defaultJoinDiv - 신분증인증
	    #rdoKbsignAuth - KB 국민 인증서
	    #legalIdPicDiv - 신분증 촬영하기
	    #idPicDiv - 신분증 촬영하기
	*/

	//만 4세 이상 ~ 만19세 미만 미성년자
	$("#page_idtInputMinor1, #page_idtInputMinor2, #page_idtInputMinor3").removeClass("display");
	//외국인
	$("#page_idtInputForeign1, #page_idtInputForeign2").removeClass("display");
	//신용카드/KB모바일 인증서 미소지자
	$("#page_idtInputOther").removeClass("display");
	//개인사업자
	$("#page_idtInputBiz1, #page_idtInputBiz2, #page_idtInputBiz3").removeClass("display");
    // to-be 수정중

	//가입유형자별 화면 세팅전 초기화 (성인기준)
	$("#page_idtDefault1, #page_idtDefault2, #page_idtCert").addClass("display");
	//$("#identitySelectDiv, #JIssDtDiv , #defaultDiv, #defaultJoinDiv, #rdoKbsignAuth, #legalIdPicDiv, #idPicDiv").css("display","block");
    $("#select-cert-kb").click(); //본인인증수단
    $("#select-id-jumin").click(); //주민등록 선택 디폴트

    $("#page_idtDefault2").find(".title.hidden").html("신분증 확인이 필요해요");
    $("#page_idtDefault2").find(".tit_sub_wrap").css("display", "none");

    $("#JIssDtDiv, #rdoKbsignAuth, #btnDefaultJoinAuth, #legalIdPicDiv, #idPicDiv").css("display","block");
    $("#licenseDiv1, #licenseDiv2, #btnMinorJoinAuth, #btnMinorJoinAuthCmp, #legalChkLabel").css("display", "none");
    /*
	* 1. 성인, 미성년자, 외국인, 법인 : 우체국등기(default), 당일 배송 서비스
	* 2. 미소지자 : 지점방문 수령(default), 우체국 등기
	* 3. eSIM : eSim 기본 선택
	*/
	var dlvrMthd = "1";	//우체국등기

	if(custTp == "II"){

	}else if(custTp == "UNC"){
	    $("#page_idtInputOther").addClass("display");
	    $("#page_idtCert").removeClass("display");

		dlvrMthd = "3";//지점방문수령 고정

	}else if(custTp == "IFX"){
	    $("#page_idtDefault1, #page_idtDefault2").removeClass("display");
	    $("#page_idtInputForeign1, #page_idtInputForeign2").addClass("display");
		//본인인증 신용카드만 가능
		//$("#select_cert_card").click();
		//$("#rdoKbsignAuth").css("display","none");

	}else if(custTp == "MIN"){
	    $("#page_idtDefault1, #page_idtDefault2").removeClass("display");
	    $("#page_idtDefault2, #page_idtInputMinor1, #page_idtInputMinor2, #page_idtInputMinor3").addClass("display");

        $("#page_idtDefault2").find(".title.hidden").html("가입자 정보를 입력해 주세요");
        $("#page_idtDefault2").find(".tit_sub_wrap").css("display", "block");
        //$("#page_idtDefault2").find(".id_form_wrap").removeClass("mgt32").addClass("mgt40");
        $("#licenseDiv1, #licenseDiv2, #JIssDtDiv, #idPicDiv, #btnDefaultJoinAuth, #btnMinorJoinAuthCmp").css("display", "none");
        $("#btnMinorJoinAuth, #legalChkLabel").css("display", "block");

        $("#select2-id-jumin").click(); //주민등록 선택 디폴트

		//신분증진위확인구분_ OCR관련
		if($('input:radio[name="c-select2-id"][value="1"]').prop('checked')){
			$('input:radio[name="rdoSelfIdf"][value="1"]').prop('checked',true);
		}else{
			$('input:radio[name="rdoSelfIdf"][value="2"]').prop('checked',true);
		}

	}else if(custTp == "GEF"){

		if($("#joinDataSharingYn").val() == "Y" && $("#custTp").val() != "IFX") { //데이터쉐어링 가입
	        $("#page_idtInputBiz1").addClass("display"); // 세금계산서 발행정보는 확인X
		} else {
	        $("#page_idtInputBiz1, #page_idtInputBiz2, #page_idtInputBiz3").addClass("display");
		}

		$('input[name="c-join-type"]:checked').prop("checked",false);
	}

	if($("#usimYn").val() == "Y") dlvrMthd ="4"; //유심이 있다면
	setDlvrMthd(dlvrMthd);//가입유형 및 요금제별 배송방법세팅
}
//가입유형 및 요금제별 배송방법세팅
function setDlvrMthd(dlvrMthd){
    $("#page_delivery1, #page_delivery2, #page_delivery3, #page_delivery4, #page_chkAddress").removeClass("display");
	$("#page_delivery1").find(".rdo_select_wrap > .form_check").css("display", "none");
	$("#dlvrInfo1, #dlvrInfo2, #dlvrInfo3, #dlvrInfo4").css("display","none"); //유심안내

	$("#dvrTelNo2Label").css("display","none"); //유심수령완료일경우 연락가능번호 따로 받기

	/* 유심보유 및 eSim 설치는 배송지 입력 안함
	 * dlvrMthd  1: 우체국등기, 2: 당일배송, 3: 지점방문, 4: 유심수령완료, 5: eSim수령
	 */

	if(dlvrMthd == "1"){//우체국등기
        $("#page_delivery1, #page_delivery4, #page_chkAddress").addClass("display");

		$("#dlvrInfo1").css("display","block");
        $("#page_delivery1").find(".rdo_select_wrap > .form_check").eq(0).css("display", "block");
        $("#page_delivery1").find(".rdo_select_wrap > .form_check").eq(1).css("display", "block");
		if(!$("#select-receive-type01").is("checked")) $("#select-receive-type01").click();

	}else if(dlvrMthd == "3"){//지점방문
        $("#page_delivery1, #page_delivery4, #page_chkAddress").addClass("display");
        $("#page_delivery1").find(".rdo_select_wrap > .form_check").eq(0).css("display", "block");
        $("#page_delivery1").find(".rdo_select_wrap > .form_check").eq(2).css("display", "block");
		if(!$("#select-receive-type03").is("checked")) $("#select-receive-type03").click();

	}else if(dlvrMthd == "4"){//유심수령 완료
		$("#dvrTelNo2Label").css("display","block");
	}else if(dlvrMthd == "5"){//워치요금제 eSIM 수령
        // 워치요금제인 경우 유심수령 단계를 스킵하나 수령방법 등은 eSIM 설치 설정
		$("#dvrTelNo2Label").css("display","block");

        $("#page_delivery1").find(".rdo_select_wrap > .form_check").eq(3).css("display", "block");
	    if(!$("#select-receive-type05").is("checked")) $("#select-receive-type05").click();
	}
	$("#dlvrMthd").val(dlvrMthd);
}
//이름 길이 체크
function chkNmLen(){
	var len = $("#custNm").val().length;
	if(len == 0 ){
		setAddErrClass("custNm", "이름을 정확히 입력해주세요.");
		return false;
	} else if(len < 2) {
		setAddErrClass("custNm", "이름을 정확히 입력해주세요.");
		return false;
	} else {
		setRemoveErrClass("custNm");
		return true;
	}
}
//법정대리인 이름 길이 체크
function chkLegNmLen(){
	var len = $("#legalRprsnNm").val().length;
	if(len == 0 ){
		setAddErrClass("legalRprsnNm", "이름을 정확히 입력해주세요.");
		return false;
	} else if(len < 2) {
		setAddErrClass("legalRprsnNm", "이름을 정확히 입력해주세요.");
		return false;
	} else {
		setRemoveErrClass("legalRprsnNm");
		return true;
	}
}

function juminFormat_f(obj) {
	var str = onlyNum(obj.value);
	str     = str + $("#regNoRb").val();

	$("#regNoH").val(str);

 	str = $("#regNoH").val();
	var len = str.length;

	if(len == 0){
		$("#regNoRf").addClass('error');
		$("#errMsg_regNo").show();
	} else {
		if(len <= 6){
			return;
		}

		$("#regNoRf").removeClass('error');
		$("#errMsg_regNo").hide();
		$("#errMsg_regNo_fa").hide();
		str = str.replace(/-/g,'');
		var chkyn = checkJumin(str);
		if(!chkyn){
			$("#regNoRf").addClass('error');
			$("#errMsg_regNo").show();
		} else if(($("#custTp").val() != "MIN" && $("#custTp").val() != "IFX") && chkFrgAdt(str)){
			$("#regNoRf").addClass('error');
			$("#errMsg_regNo_fa").show();
		}
	}
}
function juminFormat_b(obj) {
	var str = onlyNum(obj.value);
	str     = $("#regNoRf").val() + str;

	$("#regNoH").val(str);

 	str = $("#regNoH").val();
	var len = str.length;

	if(len == 0){
		$("#regNoRb").addClass('error');
		//$("#errMsg_regNo").show();
	} else {
		$("#regNoRb").removeClass('error');
		//$("#errMsg_regNo").hide();
		//$("#errMsg_regNo_fa").hide();
		str = str.replace(/-/g,'');
		var chkyn = checkJumin(str);
		if(!chkyn){
			$("#regNoRb").addClass('error');
			//$("#errMsg_regNo").show();
		} else if(($("#custTp").val() != "MIN" && $("#custTp").val() != "IFX") && chkFrgAdt(str)){
			$("#regNoRb").addClass('error');
			//$("#errMsg_regNo_fa").show();
		}
	}

	//주민번호 자리수
	if($("#regNoH").val().length != 13) {
		return;
	}

	//앞자리 한번더
	var str = onlyNum($("#regNoRf").val());
	str     = str + $("#regNoRb").val();

	$("#regNoH").val(str);

 	str = $("#regNoH").val();
	var len = str.length;

	if(len == 0){
		$("#regNoRf").addClass('error');
		$("#errMsg_regNo").show();
	} else {
		if(len <= 6){
			return;
		}

		$("#regNoRf").removeClass('error');
		str = str.replace(/-/g,'');
		var chkyn = checkJumin(str);
		if(!chkyn){
			$("#regNoRf").addClass('error');
		} else if(($("#custTp").val() != "MIN" && $("#custTp").val() != "IFX") && chkFrgAdt(str)){
			$("#regNoRf").addClass('error');
		}
	}
}
//주민번호 체크
function chkJumin(){
	//var str = $("#regNoH").val();
	var str = onlyNum($("#regNoRf").val()) + onlyNum($("#regNoRb").val());

	var len = str.length;
	var st = "1"; // 주민등록증 1

	$("#driverNo").removeClass('error');
	$("#errMsg_driver").hide();

	if(st == '1' && len == 0) {
		setAddErrClass("regNoRf", "필수 입력 사항입니다.");
		return false;

	} else {
		str = str.replace(/-/g,'');
		var chkyn    = checkJumin(str);

		if(st == '1' && !chkyn) {
		    setAddErrClass("regNoRf", "주민등록번호를 정확히 입력해주세요.");
			return false;

		} else {
			if(len == 13){ //외국인 체크
				var num7 = str.substr(6, 1);
				if(num7 == "5" || num7 == "6" || num7 == "7" || num7 == "8"){
					return false;
				}
			}
		    setRemoveErrClass("regNoRf");
			return true;
		}

	}
}
//외국인 또는 미성년 체크
function chkFrgAdt(juminno){
	var chkfgnyn = checkForeigner(juminno);
	var chkadtyn = checkAdult(juminno);

	if(chkfgnyn == true || chkadtyn == false){
		return true;// 외국인 또는 미성년
	} else {
		return false;
	}
}
//운전면허증 번호 체크
function chkDriver(param) {
	var str = $("#driverRgn option:selected").val();
	var len = str.length;
	var st = $("input:radio[name=rdoSelfIdf]:checked").val();//주민등록증,운전면허증 선택

	if (st == '2') {
		if(len == 0) {
            setAddErrClass("driverNo", "운전면허증 정보를 정확히 입력해주세요.");
			return false;
		} else {
			str = $("#driverNo").val().replace(/-/gi,'');
			len = str.length;

			if(len < 10 && param == '1') {
                setAddErrClass("driverNo", "면허번호를 정확히 입력해주세요.");
				return false;
			} else {
                setRemoveErrClass("driverNo");
				return true;
			}
		}
	} else {
		return true;
	}
}
//법정대리인 운전면허증 번호 체크
function chkLegDriver(param) {
	var str = $("#legalRprsnDriverRgn option:selected").val();
	var len = str.length;
	var st = $("input:radio[name=c-select2-id]:checked").val();//주민등록증,운전면허증 선택

	if (st == '2') {
		if(len == 0) {
		// to-be 버튼 유효성 class 추가 요청함
            setAddErrClass("legalRprsnDriverNo", "운전면허증 정보를 정확히 입력해주세요.");
			return false;
		} else {
			str = $("#legalRprsnDriverNo").val().replace(/-/gi,'');
			len = str.length;

			if(len < 10 && param == '1') {
                setAddErrClass("legalRprsnDriverNo", "면허번호를 정확히 입력해주세요.");
				return false;
			} else {
                setRemoveErrClass("legalRprsnDriverNo");
				return true;
			}
		}
	} else {
		return true;
	}
}
//사업자 등록번호 체크
function chkBznoLen(){
	var len = $("#bzno").val().length;

	if(len == 0 ){
		setAddErrClass("bzno", "사업자등록번호를 입력해 주세요.");
		return false;
	} else if(len < 10) {
		setAddErrClass("bzno", "사업자등록번호를 정확히 입력해 주세요.");
		return false;
	} else {
		setRemoveErrClass("bzno");
		return true;
	}
}
//상호명 체크
function chkBznmLen(){
	var len = $("#bznm").val().length;

	if(len == 0 ){
		setAddErrClass("bznm", "상호명을 입력해 주세요.");
		return false;
	} else {
		setRemoveErrClass("bznm");
		return true;
	}
}
//발급일자 체크
function chkIssfDt(param){
	var issDt = $("#issfDt").val();
	var len = issDt.length;

	if(len < 8 || !isValidDate(issDt)){
		if(param !== 'N') $("#issfDt").focus();
		setAddErrClass("issfDt", "발급일자를 정확히 입력해 주세요.");
		return false;
	} else {
		setRemoveErrClass("issfDt");
		return true;
	}
}
//영어(대)
function onlyUpperIn(obj) {
	 $(obj).val( $(obj).val().replace( /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g, '' ) );
	 $(obj).val( $(obj).val().toUpperCase() );
	 $(obj).val( $(obj).val().replace( /[\{\}\[\]\/?.,;:|\(\`~!@#$%^&)_\=\'\"\<\>\!\* /\\/]/gi, '' ) );
}
//null체크
function vali(val){
	if(val == null) return '';
	if(typeof val == 'string' || val == '') return val;
	if(typeof val == 'undefined') return '';

	return val;
}

//특화요금제 :: 나라사랑 직업군인가족 가입 시 직업군인 정보 조회
function chkProSoldierInfo(){
	if($("#infoOfferTelNo").val() == "" || !chkmtelNo($("#infoOfferTelNo").val()) ) {
        let opt = {
            msg : "휴대폰번호를 정확히 입력해 주세요.",
            cfrmYn : false
        };
        popalarm(opt);
		return;
	}
	var param = new Object();
	param.soId = $("#soId").val();
	param.svcTelNo = $("#infoOfferTelNo").val();
	console.info("직업군인 정보 조회: " + $("#infoOfferTelNo").val());

	$.ajax({
		type: 'POST',
		url: '/join/steps/reserve/getNaraChk.json',
		data : param,
		dataType: "json",
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success: function(data) {
			var infoMap = data.infoMap;
			$("#ch_militaryCustNm").val(infoMap.militaryCustNm);
			$("#ch_militaryDocYn").val(infoMap.militaryDocYn);

			if(data.naraCount > 0){
				$("#infoOfferStat").val("01");	//01:가입  02:비가입 10:정보제공동의 완료
			}else{
				$("#infoOfferStat").val("02");
			}

			var msg = "";
			msg += "가입예약 완료시 직업군인 본인 <br>";
			msg += "(" + data.maskTelNo + ")";
			msg += "에게 <br> 정보제공동의 안내메시지가 발송됩니다.";

            let opt = {
                msg : msg,
                cfrmYn : false
            };
            popalarm(opt);

			$("#confirmSoldierBtn").css("display","none");
			$("#infoOfferTelNo").prop("disabled",true);
			$("#narasarangYn").val("Y");

		},
		error: function(request,status,error){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}
	});
}
//군요금제가입전 개통이력 확인(나라사랑 일반)
function getCtrtProdCnt(prodCd,successCallback){
	if(prodCd != "") prodCd = $("#chrgPln").val();

	var appInfo = 'soId='+$("#soId").val() + '&custId=' + $('#custId').val()+ '&prodCd='+prodCd ;

	$.ajax({
		url : '/join/steps/prod/getCtrtProdCnt',
		type : 'POST',
		data : appInfo,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success: function(result) {
			console.log("getCtrtProdCnt====>  "+result);
			successCallback(result);
		},
		error: function(Request,status,error){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
		}
	});
}
//나라사랑발급대상 확인
function sendItb006(){
	var base = new Object();
	var data = new Object();

	base.serviceId = "ITB006";
	data.inquryDstic = "1";					// 조회구분 1:나라사랑LTE요금제 가입대상 고객여부조회
	data.cuniqnoDstic = "1";				// 고객고유번호구분 1:주민등록번호
	data.cuniqno = fnUnSign($("#regNoH").val());		// 고객고유번호 주민번호 = 13자리 + 공란 2자리
	base.data = data;

	//데이터 확인
	//console.log(JSON.stringify(base));
	$("#narasarangYn").val('N');

	$.ajax({
		type: 'POST',
		url : '/appIf/v1/kb/eai/ITB006',
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		//async: false,
		dataType: "json",
		success: function(data) {
			console.log(JSON.stringify(data));
			var result =  data.data.joinTagetCustYn	// 나라사랑LTE요금제 가입 대상고객여부 1:가입대상 0:가입불가
			console.log(data.data.joinTagetCustYn	);
			if(data.resultCode == "00000" || data.resultCode == "N0000") { // 성공
				if(result == "1"){
					$("#narasarangYn").val('Y');
                    let opt = {
                        msg : "나라사랑 LTE 요금제(일반)<br>가입대상입니다.",
                        cfrmYn : false
                    };
                    popalarm(opt);
                    $("#joinTagetBtn").css("display","none");//가입대상확인
                    $("#prodBtn").css("display","block");//다음버튼
				}else{
					$("#narasarangYn").val('N');
					modalLayer.show('cardNoLayer');
				}
			}else{
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false,
                    okCallback : prodSearch
                };
                popalarm(opt);
			}
		},
		error: function(Request,status,error){
//			popalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,'',prodSearch);
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false,
                okCallback : prodSearch
            };
            popalarm(opt);
		}
	});
}
//무궁화, 공무원, 선생님 대상 확인
function sendItb006New(tgpCode){
	if($("#filePopupChk").val() == "Y" && $("#confirmDiv").css("display") == "none"){// 팝업노출 한번만, 최종가입의 경우만 제외
		saveRatePlan();
		return;
	}

	var base = new Object();
	var data = new Object();

	base.serviceId = "ITB006";
	data.inquryDstic = "2";		// 조회구분 1:나라사랑LTE요금제 가입대상 고객여부조회
	data.cuniqnoDstic = "2";	// 고객고유번호구분 1:주민등록번호, 2:kb-pin
	data.cuniqno = $('#custId').val();	// kb-pin $('#custId').val()
	base.data = data;

	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url : '/appIf/v1/kb/eai/ITB006',
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		dataType: "json",
		success: function(data) {
			console.log(JSON.stringify(data));
			try{
				if(data.resultCode == "00000" || data.resultCode == "N0000") {//성공

					if(tgpCode == "1"){
						if(data.data.policLnYn == '1'){
                            let opt = {
                                msg : "KB무궁화대출 보유고객으로 직업정보를 증빙하는 서류제출 생략이 가능합니다.",
                                cfrmYn : false
                            };
                            popalarm(opt);
							$("#fileAddYn").val("A");
						}
						else{
							$("#fileAddYn").val("N");
							$("#evdnCont").html("증빙서류 : 재직증명서, 공무원증 중 택 1");
							$("#evdnCont2").html("KB무궁화대출 보유고객은 서류제출 생략가능");
							modalLayer.show('docEvdnGuideLayer');
						}
					}
					else if(tgpCode == "2"){
						if(data.data.gvemLnYn == '1'){
                            let opt = {
                                msg : "KB공무원대출 보유고객으로 직업정보를 증빙하는 서류제출 생략이 가능합니다.",
                                cfrmYn : false
                            };
                            popalarm(opt);
							$("#fileAddYn").val("A");
						}
						else{
							$("#fileAddYn").val("N");
							$("#evdnCont").html("<p>증빙서류 : 재직증명서, 공무원증 중 택 1</p>");
							$("#evdnCont2").html("KB공무원대출 보유고객은 서류제출 생략가능");
							modalLayer.show('docEvdnGuideLayer');
						}
					}
					else if (tgpCode == "3"){
						if(data.data.techrLnYn == '1'){
                            let opt = {
                                msg : "KB선생님든든대출 보유고객으로 직업정보를 증빙하는 서류제출 생략이 가능합니다.",
                                cfrmYn : false
                            };
                            popalarm(opt);
							$("#fileAddYn").val("A");
						}else{
							$("#fileAddYn").val("N");
							$("#evdnCont").html("증빙서류 : 재직증명서, 교직원증 중 택 1");
							$("#evdnCont2").html("KB선생님든든대출 보유고객은 서류제출 생략가능");
							modalLayer.show('docEvdnGuideLayer');
						}
					}
				}else{
					$("#fileAddYn").val("N");
					$("#evdnCont").html("증빙서류 : 재직증명서, 공무원증, 교직원증 중 택 1");
					$("#evdnCont2").html("KB무궁화대출, KB공무원대출, KB선생님든든대출 보유고객은 서류제출 생략가능");
					modalLayer.show('docEvdnGuideLayer');
				}

				$("#filePopupChk").val('Y');
			}
			catch(e){
				console.log(e);
				$("#fileAddYn").val("N");
				$("#evdnCont").html("증빙서류 : 재직증명서, 공무원증, 교직원증 중 택 1");
                $("#evdnCont2").html("KB무궁화대출, KB공무원대출, KB선생님든든대출 보유고객은 서류제출 생략가능");
				modalLayer.show('docEvdnGuideLayer');
			}
		},
		error: function(Request,status,error){
			$("#fileAddYn").val("N");
		},
		complete: function() {
			saveRatePlan(); //요금제정보저장
	    }
	});
}
//주니어 개인정보제공 동의여부 체크시
function prsinChk(e){
	var elementId = e.id;
	var elementIdChk = $("#"+elementId).prop('checked');

	if(elementId == "chkY"){
		$("#chkN").prop('checked',false);
		$("#openbankingYn").val("Y");
	}else{
		$("#chkY").prop('checked',false);
		$("#openbankingYn").val("N");
	}

	if(elementIdChk ==  false){
		$("#openbankingYn").val("");
	}
}

// 최종가입전 선택동의 동의여부 체크
function drawAgreeCheck() {
	var base = new Object();
	var data = new Object();
	var CM559CustInfo;
	var custId = $("#custId").val();

	base.serviceId    = "ITB001";
	data.soId = $("#soId").val();
	data.cuniqnoDstic = "3";
	data.cuniqno      = custId;
	base.data = data;

	var maktngPcDsticd = "";
	var grupOfCnsntYn = "";
	var smsCnsntYn = "";
	var emalCnsntYn = "";
	var telCnsntYn = "";
	var pstmalCnsntYn = "";
	var isMarketingYn = false;

	var afltMCnsntDstcd = "";
	var afltMSmsCnsntYN = "";
	var afltMeCnsntYN = "";
	var afltMTelCnsntYN = "";
	var afltMDmCnsntYN = "";
	var isAfltMYN = false;

	var commMktDst = "";
	var commMktAfDst = "";

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/kb/eai/ITB001',
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		//async: false,
		cache: false,
		dataType: "json",
		success: function(res) {
			data = JSON.parse(fnUnSign(res.enc));
			console.log(data);

			if(data !== null && data.data !== null){
				if(data.resultCode !== '00000'){
                    let opt = { msg: "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", cfrmYn : false }
                    popalarm(opt);
					return;
				}

				try{
					maktngPcDsticd = data.data.maktngPcDsticd;		//<%-- 마케팅활용동의구분 --%>
					grupOfCnsntYn   = data.data.grupOfCnsntYn;		//<%-- 그룹사제공선택동의여부 --%>
					smsCnsntYn   = data.data.smsCnsntYn;			//<%-- 문자메시지동의여부 --%>
					emalCnsntYn = data.data.emalCnsntYn;			//<%-- 이메일동의여부 --%>
					telCnsntYn = data.data.telCnsntYn;				//<%-- 전화동의여부 --%>
					pstmalCnsntYn = data.data.pstmalCnsntYn;		//<%-- 우편물동의여부 --%>
					$("#maktngPcDsticd").val(maktngPcDsticd);

					afltMCnsntDstcd	= data.data.afltMCnsntDstcd;
					afltMSmsCnsntYN	= data.data.afltMSmsCnsntYn;
					afltMeCnsntYN	= data.data.afltMeCnsntYn;
					afltMTelCnsntYN	= data.data.afltMTelCnsntYn;
					afltMDmCnsntYN	= data.data.afltMDmCnsntYn;

					commMktDst = data.data.commMktDst;
					commMktAfDst = data.data.commMktAfDst;
					$("#commMktDst").val(commMktDst);
					$("#commMktAfDst").val(commMktAfDst);

					if(afltMSmsCnsntYN == "1"
						|| afltMeCnsntYN == "1"
						|| afltMTelCnsntYN == "1"
						|| afltMDmCnsntYN == "1") isAfltMYN = true;

					if(smsCnsntYn == "1"
						|| emalCnsntYn == "1"
						|| telCnsntYn == "1"
						|| pstmalCnsntYn == "1") isMarketingYn = true;

					//광고성 정보 수신 :: 회선당 선택으로 없음 무조건 빈값
					//계열사 기동의인경우 숨김 -> 2023.02.28 계열사 마케팅 개정 후 광고성 정부 수신 필드 사용 안함
					/*if(grupOfCnsntYn == '1'){
						$("#selTerm3").val($("#chk6").val());
						$("#chk6").prop("checked", true);
						$('div.type_agree2>ul>li:last').css('display','none');

					}else{
						$("#chk6").prop("checked", false);
						$('div.type_agree2>ul>li:last').css('display','block');

					}*/

					//2021.12.01 5번(신양식,마이테이터 포함) 동의값 추가
					//마케팅 동의 (공백,0,9,1,2 팝업노출) (3,4,5,6 팝업미노출)
					console.log("선택동의 팝업노출여부(은행마케팅동의 값) : "+maktngPcDsticd);
					console.log("선택동의 팝업노출여부(LiivM마케팅동의 값) : "+commMktDst);
					if((maktngPcDsticd == "3" || maktngPcDsticd == "4" || maktngPcDsticd == "5" ||  maktngPcDsticd == "6") && commMktDst == "1"){

                        if($("#applTp").val() == "N" || $("#applTp").val() == "T"){
                            let opt = {
                                msg: "확인을 누르시면 KB Liiv M 가입이 진행됩니다.",
                                cfrmYn : true,
                                okCallback : saveApplTp
                            }
                            popalarm(opt);

                        }else if($("#applTp").val() == "M"){
                            //통신사별 분기 _스마트개통 MNP 운영시간여부체크
                            let opt = {
                                msg: "확인을 누르시면 KB Liiv M 가입이 진행됩니다.",
                                cfrmYn : true,
                                okCallback : sendSB804
                            }
                            popalarm(opt);
                        }

					}else{
						drawBottomPopup("선택 동의 설정", "selectAgreeLayer", "");
                        $("#chk_grp_5, #chk_grp_6, #chk_grp_7").css("margin-bottom", "20px");

						// 팝업 구조 때문에 팝업 표시 이후에 값 세팅 하는 것으로 변경
                        if(isMarketingYn) {//값세팅
                            $("#chk_grp_5").hide();
                            $("#chk_grp_6").hide();
                            $("#chk5_1").prop("checked",true);
                            $("input:checkbox[name*='L']").prop("checked",true);

                            //$("#I01sOtpion, #I01sOtpion > p.box_chk > label").removeClass("disabled");
                            //$("#I01sOtpion > p.box_chk > label > input[type=checkbox]").removeAttr("disabled");
                            $("#guideMethod1,#guideMethod2,#guideMethod3,#guideMethod4").prop("checked",false);
                            var checkCnt = 0;

                            $("#selTerm1").val($("#L13").val());
                            $("#selTerm2").val($("#chk5_1").val());
                            $("#selTerm4").val($("#L12").val());

                            if(smsCnsntYn == "1" ){
                                $("#orginOption1").val(smsCnsntYn);
                                $("#selTerm5").val(smsCnsntYn);
                                $("#guideMethod1").prop("checked", true);
                                checkCnt++;
                            }else{
                                $("#orginOption1").val("0");
                                $("#selTerm5").val("0");
                                $("#guideMethod1").prop("checked", false);
                            }
                            if(emalCnsntYn == "1" ){
                                $("#orginOption2").val(emalCnsntYn);
                                $("#selTerm6").val(emalCnsntYn);
                                $("#guideMethod2").prop("checked", true);
                                checkCnt++;
                            }else{
                                $("#orginOption2").val("0");
                                $("#selTerm6").val("0");
                                $("#guideMethod2").prop("checked", false);
                            }
                            if(telCnsntYn == "1"){
                                $("#orginOption3").val(telCnsntYn);
                                $("#selTerm7").val(telCnsntYn);
                                $("#guideMethod3").prop("checked", true);
                                checkCnt++;
                            }else{
                                $("#orginOption3").val("0");
                                $("#selTerm7").val("0");
                                $("#guideMethod3").prop("checked", false);

                            }
                            if(pstmalCnsntYn == "1"){
                                $("#orginOption4").val(pstmalCnsntYn);
                                $("#selTerm8").val(pstmalCnsntYn);
                                $("#guideMethod4").prop("checked", true);
                                checkCnt++;
                            }else{
                                $("#orginOption4").val("0");
                                $("#selTerm8").val("0");
                                $("#guideMethod4").prop("checked", false);
                            }

                            if(checkCnt == 4){
                                $("#guideMethod0").prop("checked", true);
                            }else{
                                $("#guideMethod0").prop("checked", false);
                            }
                        }else{
                            $("#chk_grp_5").show();
                            $("#chk_grp_6").show();
                            $("#chk5_1").prop("checked",false);
                            $("#guideMethod1,#guideMethod2,#guideMethod3,#guideMethod4").prop("checked",false);
                        }
                        if(isAfltMYN) {//값세팅
                            $("#chk6_1").prop("checked",true);
                            //$("#I01sOtpion2, #I01sOtpion > p.box_chk > label").removeClass("disabled");
                            //$("#I01sOtpion2 > p.box_chk > label > input[type=checkbox]").removeAttr("disabled");
                            $("#guideMethod5,#guideMethod6,#guideMethod7,#guideMethod8").prop("checked",false);

                            var checkCnt2 = 0;

                            $("#selTerm3").val($("#chk6_1").val());

                            if(afltMSmsCnsntYN == "1" ){
                                $("#orginOption5").val(afltMSmsCnsntYN);
                                $("#selTerm9").val(afltMSmsCnsntYN);
                                $("#guideMethod5").prop("checked", true);
                            }else{
                                $("#orginOption5").val("0");
                                $("#selTerm9").val("0");
                                $("#guideMethod5").prop("checked", false);
                            }
                            if(afltMeCnsntYN == "1" ){
                                $("#orginOption6").val(afltMeCnsntYN);
                                $("#selTerm10").val(afltMeCnsntYN);
                                $("#guideMethod6").prop("checked", true);
                            }else{
                                $("#orginOption6").val("0");
                                $("#selTerm10").val("0");
                                $("#guideMethod6").prop("checked", false);

                            }
                            if(afltMTelCnsntYN == "1"){
                                $("#orginOption7").val(afltMTelCnsntYN);
                                $("#selTerm11").val(afltMTelCnsntYN);
                                $("#guideMethod7").prop("checked", true);
                            }else{
                                $("#orginOption7").val("0");
                                $("#selTerm11").val("0");
                                $("#guideMethod7").prop("checked", false);
                            }
                            if(afltMDmCnsntYN == "1"){
                                $("#orginOption8").val(afltMDmCnsntYN);
                                $("#selTerm12").val(afltMDmCnsntYN);
                                $("#guideMethod8").prop("checked", true);
                            }else{
                                $("#orginOption8").val("0");
                                $("#selTerm12").val("0");
                                $("#guideMethod8").prop("checked", false);
                            }

                        }else{
                            $("#chk6_1").prop("checked",false);
                            $("#guideMethod5,#guideMethod6,#guideMethod7,#guideMethod8").prop("checked",false);
                        }

                        if(commMktDst == "1") {
                            $("#chk_grp_7").hide();
                            $("#chk_grp_8").hide();
                            $("#chk7_1").prop("checked",true);
                        } else {
                            $("#chk_grp_7").show();
                            $("#chk_grp_8").show();
                            $("#chk7_1").prop("checked",false);
                        }

                        if(commMktAfDst == "1") {
                            $("#chk8_1").prop("checked",true);
                            $("#commMktAfDst").val($("#chk8").val());
                        } else {
                            $("#chk8_1").prop("checked",false);
                        }
					}
					setChkall();

				}catch(e){
					console.log(e);
                    let opt = { msg: "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", cfrmYn : false }
                    popalarm(opt);
					return;
				}

			} else {
                let opt = { msg: "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", cfrmYn : false }
                popalarm(opt);
				return;
			}
		},
		error: function(request,status,error){
            let opt = { msg: "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", cfrmYn : false }
            popalarm(opt);
            return;
		}
	});//end ajax
}
//선택동의
function setChkall() {
	var total = 0;
	var checked = 0;

	if (($("#maktngPcDsticd").val() == "3" || $("#maktngPcDsticd").val() == "4" || $("#maktngPcDsticd").val() == "5" || $("#maktngPcDsticd").val() == "6") == false && $("#commMktDst").val() != "1") {
        total = $("#chk_group_in2 input[type=checkbox]").length;
        checked = $("#chk_group_in2 input[type=checkbox]:checked").length;
	} else if (($("#maktngPcDsticd").val() == "3" || $("#maktngPcDsticd").val() == "4" || $("#maktngPcDsticd").val() == "5" || $("#maktngPcDsticd").val() == "6") == false) {
        total = $("#chk_grp_5 input[type=checkbox]").length + $("#chk_grp_6 input[type=checkbox]").length;
        checked = $("#chk_grp_5 input[type=checkbox]:checked").length + $("#chk_grp_6 input[type=checkbox]:checked").length;
	} else {
        total = $("#chk_grp_7 input[type=checkbox]").length + $("#chk_grp_8 input[type=checkbox]").length;
        checked = $("#chk_grp_7 input[type=checkbox]:checked").length + $("#chk_grp_8 input[type=checkbox]:checked").length;
	}

	if (total == checked) {
	    $("#O").prop("checked", true);
        $("#O").parent().parent().addClass("on");
	} else {
	    $("#O").prop("checked", false);
        $("#O").parent().parent().removeClass("on");
	}
}

//이전단계로 이동
function goJoinAgree(){
//	$("#frm").attr("action", "/join/steps/join-agree");
//	$("#frm").submit();
}

//유심
function setUsimInfo(){
	var applInfo = "";
	var usimSerialNo = $('#usimSerialNo').val().trim();

	if($('#usimSerialNo').val() == "" ){
		applInfo += "&usimSerialNo=&usimMngNo=&iccid=" ;

	}else if(soId == "01"){
		applInfo += "&usimSerialNo=" + usimSerialNo; //유심일련번호
		applInfo += "&usimMngNo=" + $('#usimMngNo').val(); //유심관리번호
		applInfo += "&iccid="; //ICCIC

	}else if(soId == "02"){
		applInfo += "&usimSerialNo=" + usimSerialNo;
		applInfo += "&usimMngNo=";
		applInfo += "&iccid="+usimSerialNo+"F";

	}else if(soId == "03"){
		applInfo += "&usimSerialNo=" + usimSerialNo.substring(5);
		applInfo += "&usimMngNo=" + usimSerialNo.substring(0,5);
		applInfo += "&iccid=898205"+usimSerialNo;
	}

	return applInfo;
}

//OCR촬영 인식정보로 셋팅하기
function setFromOCRRecogInfo(ocrFormInfo) { //각 업무화면에서 구현할것.
	if (ocrFormInfo == 'IDCARD') {
		if($("#custTp").val() == "MIN"){//미성년자가입인경우 (법정대리인정보 세팅)
			//이름,주민등록번호
			$('#legalRprsnNm').val( $("#ocrIdName").val() );
			$('#legalRprsnRegNoRf').val( $("#ocrIdNum6").val() );
			$('#legalRprsnRegNoRb').val( $("#ocrIdNum7").val() );

			if($('input:radio[name="c-select2-id"][value="1"]').prop("checked")) {
				$('#legalRprsnJIssDt').val( $("#ocrCertDate").val().replace( /[^0-9]/g, '' ) ); //주민등록증 발급일자
				$('#select2-id-jumin').click();

			} else if($('input:radio[name="c-select2-id"][value="2"]').prop("checked")) {
				$('#legalRprsnDriverRgn').val( $("#ocrDrvLicRgn").val() ); //면허번호
				$('#btn_legalRprsnDriverRgn').text( $("#legalRprsnDriverRgn option:selected").text() );
				$('#legalRprsnDriverNo').val( $("#ocrDrvLicNo").val().replace( /[^0-9]/g, '' ) ); //면허번호
				$('#legalRprsnIssueDt').val( $("#ocrCertDate").val().replace( /[^0-9]/g, '' ) ); //운전면허증 발급일자
				$('#select2-id-car').click();

			}
			//$("#legalRprsnRegNoH").val($("#ocrIdNum6").val() + $("#ocrIdNum7").val());

		}else{
			//이름,주민등록번호
			$('#custNm').val( $("#ocrIdName").val() );
			$('#regNoRf').val( $("#ocrIdNum6").val() );
			$('#regNoRb').val( $("#ocrIdNum7").val() );

			if($('input:radio[name="rdoSelfIdf"][value="1"]').prop("checked")) {
			    console.log($("#ocrCertDate").val());
				$('#JIssDt').val( $("#ocrCertDate").val().replace( /[^0-9]/g, '' ) );//주민등록증 발급일자
				$('#select-id-jumin').click();

			} else if ($('input:radio[name="rdoSelfIdf"][value="2"]').prop("checked")) {
				$('#driverRgn').val( $("#ocrDrvLicRgn").val() ); //면허번호-지역번호
				$('#btn_driverRgn').text( $("#driverRgn option:selected").text() );
				$('#driverNo').val( $("#ocrDrvLicNo").val().replace( /[^0-9]/g, '' ) ); //면허번호
				$('#driverIssDt').val( $("#ocrCertDate").val().replace( /[^0-9]/g, '' ) );//운전면허증 발급일자
				$('#select-id-car').click();

			}
			//$("#regNoH").val($("#ocrIdNum6").val() + $("#ocrIdNum7").val());
		}

	} else if (ocrFormInfo == 'CREDIT') {

		if(gAuthMthd=="200" && $("#page_idtCert").hasClass("on")){ //KCB신용카드 본인인증에서 OCR을 호출하였을 경우
			var vKcbCardNum = $("#ocrCardNumber1").val()+$("#ocrCardNumber2").val()+$("#ocrCardNumber3").val()+$("#ocrCardNumber4").val();
			if(vKcbCardNum.length > 14){
				$("#includeCardNo1").val(vKcbCardNum.substr(0,4));
				$("#includeCardNo2").val(vKcbCardNum.substr(4,4));
				$("#includeCardNo3").val(vKcbCardNum.substr(8,4));
				$("#includeCardNo4").val(vKcbCardNum.substr(12,vKcbCardNum.length));
			}
		}
		else{
			$("#cardNoH6").val($("#ocrCardNumber1").val()+$("#ocrCardNumber2").val()+$("#ocrCardNumber3").val()+$("#ocrCardNumber4").val());
			$("#cardNo6_1").val($("#ocrCardNumber1").val());
			$("#cardNo6_2").val($("#ocrCardNumber2").val());
			$("#cardNo6_3").val($("#ocrCardNumber3").val());
			$("#cardNo6_4").val($("#ocrCardNumber4").val());

			//$("#cardEffcprd").val($("#ocrCardExpDate").val().replace("\/",""));

	        var ocrCardExpDate = $("#ocrCardExpDate").val().replace("\/","");
			$("#cardEffcprd").val(ocrCardExpDate.substring(0,2) + "/" + ocrCardExpDate.substring(2) );
			$("#cardEffcprd6H").val($("#cardEffcprd").val());
			$("#cardCompNm6H").val($("#cardCompNm6").val());

			setCardNumber();
		}

	} else if (ocrFormInfo == 'USIM') {

	}

	//OCR이후 미성년자 증빙서류 파일리스트 세팅
	index = $('#imageIndex').val();
}

//자동이체 출금동의 :: 동의값 확인
function checkValidationAgree(){
	var result = true;
	var payMethod = $('input[name="c-paywray"]:checked').val();//납부

	if(payMethod == "ac"){
		$("#divCms").find(".check_item > input[type=checkbox]").each(function(){
			if(!$(this).is(":checked")){
				result = false;
				return false;
			}
		});
	}

	return result;
}
//자동이체 출금동의 :: 계좌정보
function getParentGetOgtxtData(){
	var result = "";
	var custNm = "";
	var bankNm = "";
	var acntno = "";

	// 미성년자경우 법정대리인 정보입력
	if($("#custTp").val() == "MIN"){
		custNm  	= $("#legalRprsnNm").val();
	}else if($("#custTp").val() == "IFX"){
		custNm  	= $("#fNm").val();
	}else{
		custNm  	= $("#custNm").val();
	}

	acntno = $('#acntNoSel option:selected').val();
	if(acntno == '' || acntno == null || acntno == undefined){
		acntno = $('#acntNo').val() ;
	}

	bankNm    = $("#bankCompNm6H").val(); //은행사명


	result = "이름=" + custNm;
	result += "&금융기관명=" + bankNm; //$("button[name=popAcntSelectBtn]").data("label");
	result += "&계좌번호=" + acntno;

	return result;

}

function maxLengthCheck_join(object){
    if (object.value.length > object.maxLength){
        object.value = object.value.slice(0, object.maxLength);
    }
}

//청구서유형코드(ESB)
function getChargeDvCd(billMdmGiroYn, billMdmEmlYn, billMdmSmsYn) {
	if(billMdmGiroYn == "Y") {
		return "N";
	} else if(billMdmEmlYn == "Y" && billMdmSmsYn == "Y") {
		return "A";
	} else if(billMdmEmlYn == "Y") {
		return "Y";
	} else if(billMdmSmsYn == "Y") {
		return "C";
	}
	return "C";
}
// 가입구분(ESB)
function getEntrType(applTp) {
	if(applTp == "M") {
		return "2";
	}
	return "1";
}
// 통신가입유형구분(EAI)
function getCommJoinPtDstic(applTp) {
	if(applTp == "M") {
		return "2";
	} else if(applTp == "T"){
		return "3";
	}
	return "1";
}
// 청구서수신구분(EAI)
function getAaskRecvDstic(billMdmGiroYn, billMdmEmlYn, billMdmSmsYn) {
	if(billMdmEmlYn == "Y") {
		return "2";
	}
	return "1";
}
// 청구방법구분(EAI)
function getAskWayDstic(pymMthd) {
	if(pymMthd == "CC") {
		return "2";
	}
	return "1";
}
//본인인증구분(EAI)
function getSelfCzWayDstcd(cd) {
	if(cd == "3") {
		return "3";
	}
	else{
		return "1";
	}
	return "1";
}
// 유심비청구구분(EAI)
function getUsimCstAskDstic(usimType) {
	if(usimType == "0" || usimType == "1" || usimType == "2") {
		return "1";
	} else {
		return "3";
	}
	return "1";
}
//직업군인동의서징구여부(EAI)
function getSldrCDocBiln(cd) {
	if(cd == "01" || cd == "02") {
		return "0";
	}
	else if (cd == "10"){
		return "1"
	}
	else{
		return "0";
	}
	return "0";
}
// 카드유효기간(ESB)
function getPymcardYymm(cardEffcprd) {
	if(isEmpty(cardEffcprd)) {
		return cardEffcprd;
	}

	var date = new Date();
	return date.format("yyyy").substring(0,2) + cardEffcprd.substring(2) + cardEffcprd.substring(0,2);
}
// 청구이메일주소(ESB)
function getChargeEmail(email) {
	if(isEmpty(email)) {
		return "1";
	}

	return email;
}
// 렌탈여부(ESB)
function getRntlYn(modelNo) {
	if(modelNo != "01") {
		return "";
	}
	return "";
}
// DsRsvSvcInfoInVO 배열 생성(ESB)
function getDsRsvSvcInfoInArray(entrRsvProdCd, prodCd, mnoProdCd, nextOperatorId) {
	var array = new Array();

	//신청요금제 세팅
	var obj = new Object();
	obj.entrRsvProdCd = entrRsvProdCd;
	obj.entrRsvSvcCd = mnoProdCd;
	obj.svcKdCd = "P";
	obj.svcLvlCd = "C";
	obj.ndblCvrtSvcCd = "";
	obj.nextOperatorId = nextOperatorId;
	array.push(obj);

	//종속요금제 세팅
	var url = "/join/steps/step8/getRelMnoProdCdList";
	$.ajax({
		type : "post",
		url : url,
		data : {
			soId : $("#soId").val(),
			prodCd : prodCd
		},
		async: false,
		cache: false,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success : function(data) {
			try{
				for(var i=0 ; i<data.relMnoProdCdList.length; i++){
					obj = new Object();
					obj.entrRsvProdCd = entrRsvProdCd;
					obj.entrRsvSvcCd = data.relMnoProdCdList[i].mnoProdCd;
					obj.svcKdCd = "R";
					obj.svcLvlCd = "C";
					obj.ndblCvrtSvcCd = "";
					obj.nextOperatorId = nextOperatorId;
					array.push(obj);
				}
			}
			catch(e1){
				console.log(e1);
			}
		},
        error: function(e){
        	console.log(e)
        }
	});

	return array;
}
// 상품코드 ESB 코드로 변환(ESB)
function getEntrRsvSvcCd(prodCd) {
	var relMnoProdCd = "";
	var url = "/join/steps/step8/getRelMnoProdCd";

	$.ajax({
		type : "post",
		url : url,
		data : {
			prodCd : prodCd
		},
		async: false,
		cache: false,
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success : function(data) {
			relMnoProdCd = data.relMnoProdCd;
		},
        error: function(e){
        	console.log(e)
        }
	});

	return relMnoProdCd;
}
// 인증항목구분코드(ESB)
function getAutnItemDvCd(npAuthMthd) {
	if(npAuthMthd == "01") { // 단말일련번호
		return "2";
	} else if(npAuthMthd == "02") { // 은행계좌
		return "3";
	} else if(npAuthMthd == "03") { // 신용카드
		return "5";
	} else if(npAuthMthd == "05") { // 지로
		return "1";
	}

	return "2";
}
// 단말기모델코드(ESB)
function getDevItemId(prodGrp, modelNo) {
	var devItemId = "LTE";

	if(prodGrp == "U01") {
		devItemId = "LTE";
	} else if(prodGrp == "U02" || prodGrp == "U16") {
		devItemId = "5G";
	}

	if(!isEmpty(devItemId)) {
		if(modelNo == "02" || modelNo == "03" || modelNo == "04" || modelNo == "06") {
			devItemId = devItemId.concat(", 타사");
		}
	}

	return devItemId;
}
//서류승인대상여부(EAI)
function getDocsAthorTYb(prodCd,fileAddYn) {
	var returnVal = "0";
	if(prodCd == "PD00000264" || prodCd == "PD00000321" || prodCd == "PD00000939") { // 나라사랑직업군인
		returnVal = "1";
	}
	else if(prodCd == "PD00000319" || prodCd == "PD00000941") { // 나라사랑직업군인가족
		returnVal = "1";
	}
	/**
	 * 20221209 양희환 추가
	 * 무궁화(신)PD00000947, 공무원(신)PD00000943, 선생님(신)PD00000945 요금제 추가
	 */
	else if(prodCd == "PD00000273" || prodCd == "PD00000947") { // 무궁화LTE
		if(fileAddYn == "A") returnVal = "0";
		else returnVal = "1";
	}
	else if(prodCd == "PD00000274" || prodCd == "PD00000943") { // 공무원LTE
		if(fileAddYn == "A") returnVal = "0";
		else returnVal = "1";
	}
	else if(prodCd == "PD00000275" || prodCd == "PD00000945") { // 선생님LTE
		if(fileAddYn == "A") returnVal = "0";
		else returnVal = "1";
	}


	return returnVal;
}

function showOpenBar(){
	console.log("showOpenBar");
	$('body').append('<div class="dimmed" style="background-color: rgba(0,0,0,0.6);"></div>');
}

function showOpenBarForKakao(){
	console.log("showOpenBarForKakao");
	$('body').append('<div class="dimmed" style="background-color: rgba(0,0,0,0.6);z-index:8999"></div>');
}

function hideOpenBar(){
	console.log("hideOpenBar");
	$('.dimmed').hide();
}

//ITB002 통신사별 유심정보세팅
function setUsimSerialNo(usimSerialNo){
	if(usimSerialNo == ""){
		return "";
	}else if($("#soId").val() == "01"){
		return usimSerialNo;
	}else if($("#soId").val() == "02"){
		return usimSerialNo+"F";
	}else if($("#soId").val() == "03"){
		return "898205"+usimSerialNo;
	}
}

function setUsimMngNo(usimMngNo){
	if($("#soId").val() == "01"){
		return usimMngNo;
	}else if($("#soId").val() == "02" || $("#soId").val() == "03"){
		return '';
	}
}

//OCR 신분증 호출시
function callOcrIdCard(){
	if ($('input:radio[name="rdoSelfIdf"][value="1"]').prop('checked')) {
		uploadOcrImgClick('IDCARD','jumin');
	}else{
		uploadOcrImgClick('IDCARD','driver');
	}
}

function ocrCardCdChk(){
    if(isEmpty($("#cardComp6").val())) {
        let opt = {
            msg: "카드사를 선택해주세요.",
            cfrmYn : false
        }
        popalarm(opt);
        return;
    } else {
        uploadOcrImgClick('CREDIT');
    }
}

function isValiIssuDate(str){
	var year = Number(str.substring(0,4));
	var month = Number(str.substring(4,6));
	var day = Number(str.substring(6,8));

	var today = new Date();
	var yearNum = today.getFullYear();

	var msg = "발급일자를 정확히 입력해 주세요.";

	if(year < 1900 || year > yearNum){
//		msg = "발급일자를 년도를 확인하세요.";
	}else if(month < 1 || month >12){
//		msg = "발급일자를 달은 1월부터 12월까지 입력가능합니다.";
	}else if(day < 1 || day >31){
//		msg = "발급일자를 일은 1일부터 31일까지 입력가능합니다.";
	} else {
	    msg = "";
	}

	return msg;
}

//아이디 마스킹처리 앞3자리제외 *
function maskUsrId(usrId){
	var originStr =  usrId;
	var maskingStr = usrId.substring(0,3);
	var strLength  = Number(usrId.length - 3) ;

	for(var i = 0 ; i < strLength ; i++ ){
		maskingStr += "*";
	}

	return maskingStr;
}
function allChkAgree() {
    if(($("#maktngPcDsticd").val() == "3" || $("#maktngPcDsticd").val() == "4" || $("#maktngPcDsticd").val() == "5" || $("#maktngPcDsticd").val() == "6") == false && $("#commMktDst").val() != "1") {
        if($("#O").prop("checked")) {
            agreeConPDF("/html/usimJoinTerms/개인(신용)정보 수집이용제공 동의서(상품서비스 안내 등, 리브모바일활용 및 계열사제공용 포함).pdf","O");
            $(".section.info_agree input[type=checkbox]").prop("checked",true);//해당화면에 전체 checkbox들을 체크해준다.
            $("#O").parent().parent().addClass("on");
        } else {
            $(".section.info_agree input[type=checkbox]").prop("checked",false);//해당화면에 모든 checkbox들의 체크를해제시킨다.
            $("#O").parent().parent().removeClass("on");
        }
    } else if(($("#maktngPcDsticd").val() == "3" || $("#maktngPcDsticd").val() == "4" || $("#maktngPcDsticd").val() == "5" || $("#maktngPcDsticd").val() == "6") == false) {
        if($("#O").prop("checked")) {
            agreeConPDF("/html/usimJoinTerms/개인(신용)정보 수집이용제공 동의서(상품서비스 안내 등, 계열사제공용 포함).pdf","O");
            $("#O, #chk_grp_5 input[type=checkbox], #chk_grp_6 input[type=checkbox]").prop("checked",true);
            $("#O").parent().parent().addClass("on");
        } else {
            $("#O, #chk_grp_5 input[type=checkbox], #chk_grp_6 input[type=checkbox]").prop("checked",false);
            $("#O").parent().parent().removeClass("on");
        }
    } else {
        if($("#O").prop("checked")) {
            agreeConPDF("/html/usimJoinTerms/개인(신용)정보 수집이용제공 동의서(리브모바일 활용 상품서비스 안내 등, 계열사제공용 포함).pdf","O");
            $("#O, #chk_grp_7 input[type=checkbox], #chk_grp_8 input[type=checkbox]").prop("checked",true);
            $("#O").parent().parent().addClass("on");
        } else {
            $("#O, #chk_grp_7 input[type=checkbox], #chk_grp_8 input[type=checkbox]").prop("checked",false);
            $("#O").parent().parent().removeClass("on");
        }
    }
}
//chkGuideMethod
function chkOptionalAgree() {
    $(".section.info_agree").find(".check_item > input[type=checkbox]").each(function(){
        if($(this).prop("checked")){
            if(this.id == "chk5_1"){
                $("#guideMethod1,#guideMethod2,#guideMethod3,#guideMethod4").prop("checked",true);
            }
            // 계열사약관의 옵션
            if(this.id == "chk6_1"){
                $("#guideMethod5,#guideMethod6,#guideMethod7,#guideMethod8").prop("checked",true);
            }
            if(this.id == "chk7_1"){
            	$("#chk7_1").prop("checked",true);
            }
            if(this.id == "chk8_1"){
            	$("#chk8_1").prop("checked",true);
            }
            if(this.id == "L12" || this.id == "L13"){
                if($("#L12").prop("checked") && $("#L13").prop("checked") ){
                    $("#chk5_1").prop("checked",true);
                }
            }
        }else{
            if(this.id == "chk5_1"){
                $("input:checkbox[name*='L']").prop("checked",false);
                $("#guideMethod1,#guideMethod2,#guideMethod3,#guideMethod4").prop("checked",false);
            }
            if(this.id == "chk6_1"){
                $("#guideMethod5,#guideMethod6,#guideMethod7,#guideMethod8").prop("checked",false);
            }
            if(this.id == "chk7_1"){
            	$("#chk7_1").prop("checked",false);
            }
            if(this.id == "chk8_1"){
            	$("#chk8_1").prop("checked",false);
            }
            if(this.id == "L12" || this.id == "L13"){
                if(!$("#L12").prop("checked") || !$("#L13").prop("checked") ){
                    $("#chk5_1").prop("checked",false);
                }
            }

            // 선택약관의 옵션
            if(!$("#chk5_1").prop("checked")) {
                $("#guideMethod1,#guideMethod2,#guideMethod3,#guideMethod4").prop("checked",false);
            }
            // 계열사약관의 옵션
            if(!$("#chk6_1").prop("checked")) {
                $("#guideMethod5,#guideMethod6,#guideMethod7,#guideMethod8").prop("checked",false);
            }
        }
    });
    setChkall();
}
function chkOptionalAgree2() {
    $(".section.info_agree").find(".check_group.col.ar_chk_box > .check_item > input[type=checkbox]").each(function(){
        if($(this).prop("checked")){
            var cnt = 0;
            if(this.id == "guideMethod1" || this.id == "guideMethod2" || this.id == "guideMethod3" || this.id == "guideMethod4"){
                for(var i =1; i < 5; i++){
                    if(document.getElementById("guideMethod"+i+"").checked == true){
                        cnt++;
                    }
                }
                if(cnt >= 1){
                    $("#chk5_1").prop("checked",true);
                }
            }
            cnt=0;
            if(this.id == "guideMethod5" || this.id == "guideMethod6" || this.id == "guideMethod7" || this.id == "guideMethod8"){
                for(var i =5; i < 9; i++){
                    if(document.getElementById("guideMethod"+i+"").checked == true){
                        cnt++;
                    }
                }
                if(cnt >= 1){
                    $("#chk6_1").prop("checked",true);
                }
            }
        }else{
            var cnt = 0;
            if(this.id == "guideMethod1" || this.id == "guideMethod2" || this.id == "guideMethod3" || this.id == "guideMethod4"){
                for(var i =1; i < 5; i++){
                    if(document.getElementById("guideMethod"+i+"").checked == false){
                        cnt++;
                    }
                }
                if(cnt == 4){
                    $("#chk5_1").prop("checked",false);
                }
            }
            cnt=0;
            if(this.id == "guideMethod5" || this.id == "guideMethod6" || this.id == "guideMethod7" || this.id == "guideMethod8"){
                for(var i =5; i < 9; i++){
                    if(document.getElementById("guideMethod"+i+"").checked == false){
                        cnt++;
                    }
                }
                if(cnt == 4){
                    $("#chk6_1").prop("checked",false);
                }
            }
        }
    });
    setChkall();
}
function saveOptionalAgree() {
    //수집,이용 동의 광고성 정보

    modalLayer.hide();
    if($("input:checkbox[id='chk5_1']").is(":checked") == false && $("input:checkbox[id='chk7_1']").is(":checked") == true){
        var txt = "'개인(신용)정보 수집∙이용 동의서(상품서비스 안내 등)[선택]'을 선택하지 않을 경우 리브모바일에서 제공하는 다양한 혜택 및 이벤트에 대한 유용한 정보를 받으실 수 없습니다. 선택 동의를 진행 할까요?";
        $("#optionalAgreeLayertxt").empty();
        $("#optionalAgreeLayertxt").append(txt);
        modalLayer.show("alertOptionalAgreeLayer");
    }else if($("input:checkbox[id='chk5_1']").is(":checked") == false && $("input:checkbox[id='chk6_1']").is(":checked") == true){
        var txt = "선택 동의를 안하시면 KB국민은행에서 제공하는 다양한 혜택 및 이벤트, 상품 등에 대한 유용한 정보를 받으실 수 없습니다. 선택 동의를 진행 할까요?";
        $("#optionalAgreeLayertxt").empty();
        $("#optionalAgreeLayertxt").append(txt);
        modalLayer.show("alertOptionalAgreeLayer");
	}else if($("#chk_grp_5").css("display") != "none" && $("input:checkbox[id='chk5_1']").is(":checked") == true && $("input:checkbox[id='chk6_1']").is(":checked") == false){
        var txt = "선택 동의를 안하시면 KB금융그룹 계열사에서 제공하는 다양한 혜택 및 이벤트, 상품 등에 대한 유용한 정보를 받으실 수 없습니다. 선택 동의를 진행 할까요?";
        $("#optionalAgreeLayertxt").empty();
        $("#optionalAgreeLayertxt").append(txt);
        modalLayer.show("alertOptionalAgreeLayer");
    }else if($("input:checkbox[id='chk5_1']").is(":checked") == false && $("input:checkbox[id='chk6_1']").is(":checked") == false){
        var txt = "선택 동의를 안하시면 KB국민은행 및 KB금융그룹 계열사에서 제공하는 다양한 혜택 및 이벤트, 상품 등에 대한 유용한 정보를 받으실 수 없습니다. 선택 동의를 진행 할까요?";
        $("#optionalAgreeLayertxt").empty();
        $("#optionalAgreeLayertxt").append(txt);
        modalLayer.show("alertOptionalAgreeLayer");
    }else{
        makeAgreeData();
        modalLayer.hide();
    }
}

function makeAgreeData(){

    if($("#chk5_1").prop("checked") || $("#chk6_1").prop("checked") || $("#chk7_1").prop("checked") || $("#chk8_1").prop("checked")){

        if($("#chk5_1").prop("checked")){
            $("#selTerm2").val($("#chk5_1").val());
            var chk1 = $('#guideMethod1').prop("checked");
            var chk2 = $('#guideMethod2').prop("checked");
            var chk3 = $('#guideMethod3').prop("checked");
            var chk4 = $('#guideMethod4').prop("checked");

            //start
            $('#I01sOtpion .check_item > input[type=checkbox]').each(function() {
                if(this.id == 'guideMethod1'){
                    if($(this).prop("checked")== true){
                        $("#selTerm5").val("1");
                    }else{
                        $("#selTerm5").val("");
                    }
                }else if(this.id == 'guideMethod2'){
                    if($(this).prop("checked") == true){
                        $("#selTerm6").val("1");
                    }else{
                        $("#selTerm6").val("");
                    }
                }else if(this.id == 'guideMethod3'){
                    if($(this).prop("checked") == true){
                        $("#selTerm7").val("1");
                    }else{
                        $("#selTerm7").val("");
                    }
                }else if(this.id == 'guideMethod4'){
                    if($(this).prop("checked") == true){
                        $("#selTerm8").val("1");
                    }else{
                        $("#selTerm8").val("");
                    }
                }
            });

        }else{
            $("#selTerm2").val("");
            $("#selTerm5, #selTerm6, #selTerm7, #selTerm8").val("");
        }

        if($('#chk6_1').prop("checked")){
            //계열사동의시
            $("#selTerm3").val($("#chk6_1").val());

            var chk5 = $('#guideMethod5').prop("checked");
            var chk6 = $('#guideMethod6').prop("checked");
            var chk7 = $('#guideMethod7').prop("checked");
            var chk8 = $('#guideMethod8').prop("checked");

            //start
            $('#I01sOtpion2 .check_item > input[type=checkbox]').each(function() {
                if(this.id == 'guideMethod5'){
                    if($(this).prop("checked")== true){
                        $("#selTerm9").val("1");
                    }else{
                        $("#selTerm9").val("0");
                    }
                }else if(this.id == 'guideMethod6'){
                    if($(this).prop("checked") == true){
                        $("#selTerm10").val("1");
                    }else{
                        $("#selTerm10").val("0");
                    }
                }else if(this.id == 'guideMethod7'){
                    if($(this).prop("checked") == true){
                        $("#selTerm11").val("1");
                    }else{
                        $("#selTerm11").val("0");
                    }
                }else if(this.id == 'guideMethod8'){
                    if($(this).prop("checked") == true){
                        $("#selTerm12").val("1");
                    }else{
                        $("#selTerm12").val("0");
                    }
                }
            });
        }else{
            $("#selTerm3").val("0");
            $("#selTerm9, #selTerm10, #selTerm11, #selTerm12").val("0");
        }


	    if($("#chk7_1").prop("checked")) {
            $("#commMktDst").val("1");
	    } else {
            $("#commMktDst").val("9");
	    }

	    if($("#chk8_1").prop("checked")) {
            $("#commMktAfDst").val("1");
	    } else {
            $("#commMktAfDst").val("9");
	    }
	}
	else{

		$("#selTerm4, #selTerm1, #selTerm2, #selTerm5, #selTerm6, #selTerm7, #selTerm8").val("");
		$("#selTerm9, #selTerm10, #selTerm11, #selTerm12").val("0");
		$("#selTerm3").val("0");
		$("#commMktDst, #commMktAfDst").val("9");
		modalLayer.hide();

	}
    let opt = {
        msg: "확인을 누르시면 KB Liiv M 가입이 진행됩니다.",
        cfrmYn : true,
        okCallback : saveApplTp
    }
    popalarm(opt);
}

// select 버튼 - 팝업실행
function drawBottomPopup(popTitle, layerId, compId){
    modalLayer.show({
        titleUse : true,
        title : popTitle,
        id : layerId,
        type : "bottom",
        closeUse : true,
        dimAct : true
    });

    if(layerId == "driverRgnLayer") {
        $("#btnDriverRgnConfirm").removeAttr("onclick");
        $("#btnDriverRgnConfirm").attr("onclick", "setSelectPopup('"  + compId + "')");

        //if($("#" + compId).val() != "") {
            $(document).find(".layer_wrap.open.bottom").find("a").each(function(){
                 if($("#" + compId).val() == $(this).attr("value")) {
                    $(this).parent().addClass("on");
                 } else {
                    $(this).parent().removeClass("on");
                 }
            });
        //}

    } else if(layerId == "svcNumLayer") {
        $("#svcTelNo_" + $("#svcInfoSelect").val()).click();

    } else if(layerId == "mMcoCdLayer") {
        $(document).find(".layer_wrap.open.bottom").find("a").each(function(){
             if($("#mMcoCd").val() == $(this).attr("value")) {
                $(this).parent().addClass("on");
             } else {
                $(this).parent().removeClass("on");
             }
        });
    } else if(layerId == "sktMcoCdLayer") {
        $(document).find(".layer_wrap.open.bottom").find("a").each(function(){
             if($("#sktMcoCd").val() == $(this).attr("value")) {
                $(this).parent().addClass("on");
             } else {
                $(this).parent().removeClass("on");
             }
        });
    } else if(layerId == "ktMcoCdLayer") {
        $(document).find(".layer_wrap.open.bottom").find("a").each(function(){
             if($("#ktMcoCd").val() == $(this).attr("value")) {
                $(this).parent().addClass("on");
             } else {
                $(this).parent().removeClass("on");
             }
        });
    }else if(layerId == "lgMcoCdLayer") {
        $(document).find(".layer_wrap.open.bottom").find("a").each(function(){
             if($("#lgMcoCd").val() == $(this).attr("value")) {
                $(this).parent().addClass("on");
             } else {
                $(this).parent().removeClass("on");
             }
        });
    }
}
// 국민은행 계좌 선택
function setSelectAcntNoList() {
    var selValue = $("#acntNoListDiv").find(".on > a");

    if(selValue.attr("value") == undefined) {
        let opt = {
            msg: "선택된 항목이 없습니다.",
            cfrmYn : false
        }
        popalarm(opt);
        return;
    } else if(selValue.attr("value") == "") {
		modalLayer.hide();
		$("#acntDiv").find(".account_select").html("다른 계좌로 등록할게요.");
		$("#acntDiv").find(".info").empty();
		$("#page_account").addClass("display");
		$("#btnRegAcntNo").text("출금계좌등록");
    } else {
        modalLayer.hide();

        var inAcntInfo = "";
		var selAcntNo = selValue.attr("value");

	    inAcntInfo += "<span class='account_select'><span class='img_item c_004'>국민은행</span></span>";
		inAcntInfo += "<span class='info'>" + selAcntNo + "</span>";
		inAcntInfo += "<input type='hidden' name='acntNo' id='acntNo' value='"+selAcntNo+"'>";

		$("#acntDiv").empty();
		$("#acntDiv").append(inAcntInfo);
		$("#page_account").removeClass("display");
		$("#btnRegAcntNo").text("네 선택했어요");
    }
}

function changeInfo(info) {
    if(info == "email") {
        setRemoveErrClass("newEmail");

        if(isEmpty($("#newEmail").val()) || $("#newEmail").val().trim().length == 0){
            let opt = {
                msg : "이메일을 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            setAddErrClass("newEmail", opt.msg);
            return;
        } else if(!checkEmailStr($("#newEmail").val().trim())) {
            let opt = {
                msg : "이메일 주소를 정확히 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            setAddErrClass("newEmail", opt.msg);
            return;
        } else {
            $("#emlD2").css("display", "block");
            $("#emlD2").val($("#newEmail").val().trim());
            $("#cEmail").text(getEmail());
        }
    } else if(info == "telNo") {
        setRemoveErrClass("newTelNo");

        if(isEmpty($("#newTelNo").val()) || $("#newTelNo").val().trim().length == 0){
            let opt = {
                msg : "전화번호를 입력해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            setAddErrClass("newTelNo", opt.msg);
            return;
        } else if($("#newTelNo").val().trim().length < 10) {
            let opt = {
                msg : "전화번호를 정확히 입력해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            setAddErrClass("newTelNo", opt.msg);
            return;
        } else {
            var newTelNo = $("#newTelNo").val().trim();
            $("#dvrlTelNo").val(newTelNo);
            $("#dvrlTelNo2").val(newTelNo);
            $("#cDvrlTelNo").text(newTelNo);
        }
    }
    modalLayer.hide();
}

function setAddErrClass(compId, errMsg) {
    const child = $("#" + compId).parents(".form_item").find(".input input");
    child.each((idx, item)=>{
        const input = $(item).parents(".item_content");
        input.addClass("error");
    });
    $("#" + compId).parents(".form_item").addClass("error");
    $("#" + compId).addClass("error");
    $("#" + compId).parents(".form_group").find(".form_error").html(errMsg);

    if($("#" + compId).prop("class") == "btn_select") {
        //$("#" + compId).parents(".item_content").addClass("error");
        //.form_item.license.error .item_content:after {width:100%; background-color:#ff2E00;}
    }
}
function setRemoveErrClass(compId) {
    $("#" + compId).parents(".form_item").removeClass("error");

    const child = $("#" + compId).parents(".form_item").find(".input input");
    child.each((idx, item)=>{
        const input = $(item).parents(".item_content");
        input.removeClass("error");
    });
    $("#" + compId).parents(".form_item").removeClass("error");
}