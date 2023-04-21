var gTestArr = new Array();
var gTestObj = new Object();
var gJoinInfo = new Object();
var gStatCount = 0;

//스마트개통 MNP 운영시간여부체크
function sendSB804(){

	var base = new Object();
	var data = new Object();

	var RetrieveSmrtCheckMnpRunTimeBD = new Object();

	var RequestRecord = new Object();
	var RequestBody   = new Object();

	var DsConfldsInVO   = new Object();

	DsConfldsInVO.userWorkDlrCd   = "315397";
	DsConfldsInVO.userWorkDlrNm   = "KB국민은행지점";
	DsConfldsInVO.nextOperatorId  = "1100000288";

	RequestBody.DsConfldsInVO   = DsConfldsInVO;

	RequestRecord.RequestBody = RequestBody;

	RetrieveSmrtCheckMnpRunTimeBD.RequestRecord = RequestRecord;

	data.RetrieveSmrtCheckMnpRunTimeBD = RetrieveSmrtCheckMnpRunTimeBD;

	base.serviceId = "SB804";
	base.data = data;
	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/SB804',
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		//async: false,
		cache: false,
		dataType: "json",
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success: function(response) {
			console.log(JSON.stringify(response));
			if(response !== null && response.data !== null){
				if(response.resultCode !== 'N0000'){
					popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
					return;
				}
				var resultCode = "";

				try{
					resultCode = response.data.RetrieveSmrtCheckMnpRunTimeBDResponse.ResponseRecord.ResponseBody.ResultOutVO.resultCode;
				}catch(e){

				}
				console.log(' resultCode=' + resultCode);

				if(resultCode == 'YES'){
					getJoinInfo();
				}else{
				    openLoading("stop");
                    $.ohyLayer({
                        title:'개통 가능 시간에 <br/>다시 시도해 주세요',
                        content:'#openTimeLayer',
                        type:'confirm',
                        closeUse:false,
                    });
				}

			}else{
			    openLoading("stop");
			}

		},
		error: function(request,status,error){
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);

		}
	});//end ajax
}


//신청정보 데이터 세팅 및 처리시작
function setJoinInfo(data){
	$("#soId").val(data.soId);
	$("#applSeqNo").val(data.applSeqNo);
	$("#custId").val(data.custId);
	$("#custNm").val(data.custNm);
	$("#custTp").val(data.custTp);
	$("#mvnoCustId").val(data.mvnoCustId);
	$("#idcardTp").val(data.idcardTp);
	$("#bizRegNo").val(data.bizRegNo);
	$("#repNm").val(data.repNm);
	$("#acntNm").val(data.acntNm);
	$("#foreignerStyCd").val(data.foreignerStyCd);
	$("#foreignerStrtDt").val(data.foreignerStrtDt);
	$("#foreignerExpiratDt").val(data.foreignerExpiratDt);
	$("#regNo").val(data.corpRegNo);
	$("#driverNo").val(data.driverNo);

	$("#dlvrPstNo").val(data.dlvrPstNo);
	$("#dlvrBassAddr").val(data.dlvrBassAddr);
	$("#dlvrDtlAddr").val(data.dlvrDtlAddr);
	$("#cellPhnNo").val(data.dlvdstRcpntCellPhnNo);

	$("#pymMthd").val(data.pymMthd);
	$("#cardNo").val(data.cardNo);
	$("#cardCorpCd").val(data.cardCorpCd);
	$("#cardCorpNm").val(data.cardCorpNm);
	$("#cardEffcprd").val(data.cardEffcprd);
	$('#emad').val(data.emad);
	$('#issDt').val(data.issueDt);

	$("#billMdmEmlYn").val(data.billMdmEmlYn);
	$("#billMdmSmsYn").val(data.billMdmSmsYn);

	$("#posCd").val(data.posCd);

	$("#mtelNo").val(data.chgBfrTelNo);
	$("#mcoCd").val(data.befNp);
	$("#npAuthKey").val(data.npAuthKey);

    if(data.npAuthMthd == '03'){ //신용카드
        $("input:radio[id='rdoNpMth3']").prop('checked',true);
    }else if(data.npAuthMthd == '01'){//휴대폰
        $("input:radio[id='rdoNpMth1']").prop('checked',true);
    }else if(data.npAuthMthd == '02'){//은행
        $("input:radio[id='rdoNpMth2']").prop('checked',true);
    }

    $("#chrgPln").val(data.chrgPln);
    $("#modelNo").val(data.modelNo);

    //법정대리인
    $("#legalRprsnYn").val(data.legalRprsnYn);
	$("#legalRprsnNm").val(data.legalRprsnNm);
	$("#legalRprsnRegNo").val(data.legalRprsnRegNo);
	$("#legalRprsnDriverNo").val(data.legalRprsnDriverNo);
    $("#legalRprsnIssueDt").val(data.legalRprsnIssueDt);
    $("#legalRprsnRel").val(data.legalRprsnRel);
    $("#legalRprsnTelNo").val(data.legalRprsnTelNo);

    //KT일련번호
    $("#mvnoOrdNo").val(data.mvnoOrdNo);
    $("#osstOrdNo").val(data.osstOrdNo);
    $("#osstStat").val(data.osstStat);

    gJoinInfo = data;

    $("#SB808_RE").val("Y");
    $("#SB813_RE").val("N");

    $("#athnDiv").show();
    $("#athnBtn").click(function(){
    	preChkNpItem();
    });

    console.log("esimYn="+data.esimYn);
	console.log("modelItemid="+data.modelItemid);
	console.log("modelSerialNo="+data.modelSerialNo);
	console.log("modelEid="+data.modelEid);
	console.log("imei="+data.imei);
	console.log("imei2="+data.imei2);
	console.log("modelMacAddress="+data.modelMacAddress);

    if("20221001" <= gToday ){ //KT망 시즌 제휴요금제 판매 종료
    	if(data.chrgPln == "PD00000704" || data.chrgPln == "PD00000705"){
    		popalarm2("KT 시즌 서비스 종료에 따라 신청하신 시즌 제휴 요금제는 판매가 종료된 상품입니다. <br/>고객센터로 문의 부탁드립니다.<br/>(고객센터☎ 1522-9999)", "info", false,"",goBack);
    		return;
    	}
    }

    if(data.esimYn == "C"){
		popalarm2("개통에 필요한 eSIM정보가 유효하지 않습니다.<br/>eSIM정보 먼저 등록해주세요.", "info", false,"",goBack);
	}
	else if(data.esimYn == "Y"){
		if(data.modelItemid == "" || data.modelSerialNo == "" || data.modelEid == "" || data.imei2 == ""){
			popalarm2("개통에 필요한 eSIM정보가 유효하지 않습니다.<br/>eSIM정보 먼저 등록해주세요.", "info", false,"",goBack);
		}
		else{
			sendNP1();
		}
	}
	else{
		sendNP1();
	}

}


//사전체크 및 고객생성 요청
function sendPC0(joinInfo){
	var applTp = "M";
	var idCardTp = joinInfo.idcardTp;
	var minorYn = joinInfo.legalRprsnYn;

	var serviceId = "";
	serviceId = "OSSTPC01";

	var base = new Object();
	base.serviceId = serviceId;
	var data = new Object();

	var osstNpPrePrc = new Object();
	var OsstPrePrcInVO = new Object();
	var inDto = new Object();
	var inNpDto = new Object();

	inDto.mvnoOrdNo = joinInfo.mvnoOrdNo; //MVNO 오더 번호
	inDto.cntrUseCd = "R"; //계약용도코드
	inDto.instYn = "N"; //할부여부
	inDto.scnhndPhonInstYn = "N"; //중고폰할부여부
	inDto.myslAgreYn = "Y"; //본인동의여부

	inDto.athnRqstcustCntplcNo = telNoSeqFormatter(joinInfo.dlvdstRcpntCellPhnNo); //인증요청고객연락처번호
	if(idCardTp == "01"){
		inDto.nativeRlnamAthnEvdnPprCd = "REGID"; //내국인실명인증증빙서류코드
		inDto.lcnsNo = ""; //면허번호
		inDto.lcnsRgnCd = ""; //면허지역코드
	}
	else if (idCardTp == "02"){
		inDto.nativeRlnamAthnEvdnPprCd = "DRIVE"; //내국인실명인증증빙서류코드
		inDto.lcnsNo = joinInfo.driverNo.substr(2,joinInfo.driverNo.length); //면허번호
		if(joinInfo.driverNo.length > 2) inDto.lcnsRgnCd = joinInfo.driverNo.substr(0,2); //면허지역코드
	}
	else{
		if(joinInfo.driverNo == ""){
			inDto.nativeRlnamAthnEvdnPprCd = "REGID"; //내국인실명인증증빙서류코드
			inDto.lcnsNo = ""; //면허번호
			inDto.lcnsRgnCd = ""; //면허지역코드
		}
		else{
			inDto.nativeRlnamAthnEvdnPprCd = "DRIVE"; //내국인실명인증증빙서류코드
			inDto.lcnsNo = joinInfo.driverNo.substr(2,joinInfo.driverNo.length); //면허번호
			if(joinInfo.driverNo.length > 2) inDto.lcnsRgnCd = joinInfo.driverNo.substr(0,2); //면허지역코드
		}
	}
	inDto.rsdcrtIssuDate = joinInfo.issueDt; //주민등록증발급일자

	inDto.mrtrPrsnNo = ""; //유공자번호
	inDto.nationalityCd = ""; //국적코드
	inDto.fornBrthDate = ""; //외국인생일일자
	inDto.crdtInfoAgreYn = "Y"; //신용정보동의여부
	inDto.indvInfoInerPrcuseAgreYn = "Y"; //개인정보내부활용동의여부
	inDto.cnsgInfoAdvrRcvAgreYn = "N"; //위탁정보광고수신동의여부
	inDto.othcmpInfoAdvrRcvAgreYn = "N"; //타사정보광고수신동의여부
	inDto.othcmpInfoAdvrCnsgAgreYn = "N"; //타사정보광고위탁동의여부
	inDto.grpAgntBindSvcSbscAgreYn = "N"; //그룹사결합서비스가입동의여부
	inDto.cardInsrPrdcAgreYn = "N"; //카드보험상품동의여부
	inDto.olhRailCprtAgreYn = "N"; //OLLEH철도제휴동의여부
	inDto.olhShckWibroRlfAgreYn = "N"; //OLLEH쇼킹와이브로안심동의여부
	inDto.olngDscnHynmtrAgreYn = "N"; //주유할인현대자동차동의여부
	inDto.olhCprtPntAgreYn = "N"; //OLLEH제휴포인트동의여부
	inDto.dwoCprtPntAgreYn = "N"; //대우제휴포인트동의여부
	inDto.wlfrDscnAplyAgreYn = "N"; //복지할인신청동의여부
	inDto.spamPrvdAgreYn = "N"; //스팸제공동의여부
	inDto.prttlpStlmUseAgreYn = "N"; //이동전화결제이용동의여부
	inDto.prttlpStlmPwdUseAgreYn = "N"; //이동전화결제비밀번호이용동의여부
	inDto.wrlnTlphNo = telNoSeqFormatter(joinInfo.dlvdstRcpntCellPhnNo); //유선전화번호
	inDto.tlphNo = $("#mtelNo").val();//telNoSeqFormatter(joinInfo.dlvdstRcpntCellPhnNo); //전화번호

	inDto.zipNo = joinInfo.dlvrPstNo; //우편번호
	inDto.fndtCntplcSbst = joinInfo.dlvrBassAddr; //기본연락처내용
	inDto.mntCntplcSbst = joinInfo.dlvrDtlAddr; //상세연락처내용

	var birth_gender = joinInfo.corpRegNo7;
	var birthDay = "";
	if(birth_gender.charAt(6) == "1" || birth_gender.charAt(6) == "2" || birth_gender.charAt(6) == "5" || birth_gender.charAt(6) == "6") {
		birthDay = "19" + birth_gender.substr(0,6);
	} else {
		birthDay = "20" + birth_gender.substr(0,6);
	}
	inDto.brthDate = birthDay; //생일일자
	inDto.brthNnpIndCd = ""; //생일음양구분코드
	inDto.jobCd = ""; //직업코드
	inDto.emlAdrsNm = joinInfo.emad; //이메일주소명
	inDto.lstdIndCd = ""; //상장구분코드
	inDto.emplCnt = ""; //사원수
	inDto.slngAmt = ""; //매출액
	inDto.cptlAmnt = ""; //자본금액
	inDto.crprUpjnCd = ""; //법인업종코드
	inDto.crprBcuSbst = ""; //법인업태내용
	inDto.crprZipNo = ""; //법인우편번호
	inDto.crprFndtCntplcSbst = ""; //법인기본연락처내용
	inDto.crprMntCntplcSbst = ""; //법인상세연락처내용
	inDto.custInfoChngYn = "Y"; //고객정보변경여부
	inDto.m2mHndsetYn = "N"; //M2M단말여부

	if(minorYn == "Y"){
		inDto.agntIdfyNoVal = joinInfo.legalRprsnRegNo; //법정대리인 고객식별번호 : 주민등록번호
		inDto.nativeRlnamAthnEvdnPprCd = "COURT"; //내국인실명인증증빙서류코드(법정대리인)
		inDto.rsdcrtIssuDate = ""; //주민등록증발급일자

		inDto.agntCustNm = joinInfo.legalRprsnNm; //법정대리인 성명
		inDto.agntCustIdfyNoType = "1"; //법정대리인 식별번호 종류 1(주민번호), 4(외국인등록번호)

		if(joinInfo.legalRprsnRegNo.length > 7){
			var tmpGender = joinInfo.legalRprsnRegNo.substr(6,1);
			var gender = "1";
			if(tmpGender == "1" || tmpGender == "3" || tmpGender == "5" || tmpGender == "7"){
				gender = "1";
			}
			else gender = "2";
		}
		inDto.agntPersonSexDiv = gender; //법정대리인 성별
		inDto.agntAgreYn = "Y"; //법정대리인 정보조회 동의여부
		inDto.agntTelAthn = "M"; //법정대리인 연락처 종류
		inDto.agntTelNo = joinInfo.legalRprsnTelNo; //법정대리인 연락처

		if(joinInfo.legalRprsnRel == "F"){
			inDto.agntTypeCd = "01"; //법정대리인 유형 : 부
		}
		else if (joinInfo.legalRprsnRel == "M"){
			inDto.agntTypeCd = "02"; //법정대리인 유형 : 모
		}
		else{
			inDto.agntTypeCd = "03"; //법정대리인 유형 : 후견인
		}

		inDto.agntRsdcrtIssuDate = joinInfo.legalRprsnIssueDt; //법정대리인 식별번호 발급일자
		inDto.agntNationalityCd = ""; //법정대리인 국적코드
	}
	else{
		inDto.agntIdfyNoVal = ""; //법정대리인 고객식별번호
		inDto.agntCustNm = ""; //법정대리인 성명
		inDto.agntCustIdfyNoType = ""; //법정대리인 식별번호 종류
		inDto.agntPersonSexDiv = ""; //법정대리인 성별
		inDto.agntAgreYn = ""; //법정대리인 정보조회 동의여부
		inDto.agntTelAthn = ""; //법정대리인 연락처 종류
		inDto.agntTelNo = ""; //법정대리인 연락처
		inDto.agntTypeCd = ""; //법정대리인 유형
		inDto.agntRsdcrtIssuDate = ""; //법정대리인 식별번호 발급일자
		inDto.agntNationalityCd = ""; //법정대리인 국적코드
	}
	inDto.atmSeqNo = ""; //atm일련번호
	inDto.custIdntNo = joinInfo.corpRegNo; //고객식별번호
	inDto.custIdntNoIndCd = "01"; //고객식별번호구분코드
	inDto.custNm = joinInfo.custNm; //고객명
	inDto.custTypeCd = "I"; //고객유형코드
	inDto.slsCmpnCd = "KBM"; //판매회사코드

	inNpDto.athnItemCd = getAuthMthd(); //인증항목코드
	inNpDto.athnSbst = $("#npAuthKey").val(); //인증항목값
	inNpDto.bchngNpCommCmpnCd = $("#mcoCd").val(); //변경전번호이동사업자코드
	inNpDto.crprNo = ""; //법인번호
	inNpDto.custIdntNo = joinInfo.corpRegNo; //고객식별번호
	inNpDto.custIdntNoIndCd = "01"; //고객식별번호구분코드
	inNpDto.custNm = joinInfo.custNm; //고객명
	inNpDto.custTypeCd = "I"; //고객유형코드

	if(joinInfo.custTp == "GEF"){
		inNpDto.indvBizrYn = "Y"; //개인사업자여부
	}
	else {
		inNpDto.indvBizrYn = "N"; //개인사업자여부
	}

	//inNpDto.npRstrtnContYn = "N"; //번호이동제한예외여부(번호이동가입 필수 Y:예외 N:대상아님)
	inNpDto.npRstrtnContYn = ($("#npRstCheckY").prop("checked") == true) ? "Y" : "N";
	inNpDto.npTlphNo = $("#mtelNo").val(); //번호이동전화번호
	inNpDto.oderTypeCd = "MNP";//오더유형코드

	inNpDto.slsCmpnCd = "KBM"; // 판매회사코드
	inNpDto.ytrpaySoffAgreYn = "Y"; //해지미환급금 상계동의여부 //번호이동가입 필수 (계약유형이 선불인 경우에는 미동의) Y:동의 N:미동의
	inDto.rprsPrsnNm = joinInfo.repNm;; //대표자명
	inDto.upjnCd = ""; //업종코드
	inDto.bcuSbst = ""; //업태내용

	if($("#custTp").val() == "IFX"){
		inDto.custIdntNoIndCd = "05";
		inNpDto.custIdntNoIndCd = "05"; //고객식별번호구분코드
		inDto.nativeRlnamAthnEvdnPprCd = "FORGN"; //내국인실명인증증빙서류코드
		inDto.nationalityCd = "USA"; //국적코드
		inDto.fornBrthDate = birthDay; //외국인생일일자
	}

	OsstPrePrcInVO.inDto = inDto;
	OsstPrePrcInVO.inNpDto = inNpDto;
	osstNpPrePrc.OsstPrePrcInVO = OsstPrePrcInVO;

	data.osstNpPrePrc = osstNpPrePrc;
	base.data = data;

	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/kt/osst/' + serviceId,
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		cache: false,
		dataType: "json",
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success: function(response) {
			console.log(JSON.stringify(response));
			try{
				if(response !== null && response.data !== null){
					var res = response.data.osstNpPrePrcResponse.return;
					if(res.commHeader.responseType == "N"){
						if(res.rsltCd == "S") { //S: 접수정상, F:접수에러
							console.log("OSST 오더 번호="+res.osstOrdNo);
							$("#osstOrdNo").val(res.osstOrdNo);
							checkST0(res.osstOrdNo);
						} else {
							popalarm2(res.rsltMsg+"<br/>다시 시도해 주세요.", "info", false);
						}
					}
					else{
						var errCd = res.commHeader.responseCode;
						var errMsg = res.commHeader.responseBasic;
						if(errCd != "" && gErrCdList[errCd] != undefined && gErrCdList[errCd] != null){
							if(errCd == "ITL_COM_E0003"){
								popalarm2(errMsg+"<br/>"+gErrCdList[errCd], "info", false);
							}
							else{
								popalarm2(gErrCdList[errCd], "info", false);
							}
						}
						else{
							popalarm2("시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
						}
					}
				} else {
				    openLoading("stop");
				}
			}
			catch(e){
				console.log(e);
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
			}
		},
		error: function(request,status,error){
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
		}
	});

}

//개통상태 확인
function checkST0(osstOrdNo){
	var base = new Object();
	var data = new Object();

	var osstPrcSch = new Object();
	var OsstPrcSchInVO = new Object();
	var inDto   = new Object();
	inDto.osstOrdNo   = $("#osstOrdNo").val();

	OsstPrcSchInVO.inDto = inDto;
	osstPrcSch.OsstPrcSchInVO = OsstPrcSchInVO;
	data.osstPrcSch = osstPrcSch;

	base.serviceId = "OSSTST10";
	base.data = data;
	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/kt/osst/OSSTST10',
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		//async: false,
		cache: false,
		dataType: "json",
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success: function(response) {
			console.log(JSON.stringify(response));
			try{
				gStatCount++;
				if(response !== null && response.data !== null){
					var res = response.data.osstPrcSchResponse.return;
					if(res.commHeader.responseType == "N"){
						var vCustId = res.custId;
						var vMvnoOrdNo = res.mvnoOrdNo;
						var vPrgrStatCd = res.prgrStatCd;
						var vRsltCd = res.rsltCd;
						var vRsltMsg = res.rsltMsg;
						var vSvcCntrNo = res.svcCntrNo;
						console.log("try"+gStatCount+" osstStat="+vPrgrStatCd);
						if(vPrgrStatCd == "PC2"){
							//PC0: 사전체크접수, PC1:사전체크 중, PC2: 사전체크완료
							//OP0: 개통 접수, OP1: 개통 진행 중, OP2: 개통작업 완료
							//CP0: 지능망직권해지접수, CP1: 지능망직권해지 진행 중, CP2: 지능망직권해지 완료
							if(vRsltCd == "0000"){
								console.log("[PC0]사전체크 완료");
								$("#osstOrdNo").val(osstOrdNo);
								$("#osstStat").val(vPrgrStatCd);
								$("#custNo").val(vCustId);
								updateApplInfo();
							}
							else{
								var vTrgCd = "";
								if(vRsltMsg.indexOf("면허번호") > 0) vTrgCd = "면허번호";
								else if(vRsltMsg.indexOf("발급일자") > 0) vTrgCd = "발급일자";
								else if(vRsltMsg.indexOf("주민번호") > 0) vTrgCd = "주민번호";
								else if(vRsltMsg.indexOf("BF1004") > 0) vTrgCd = "BF1004";
								else if(vRsltMsg.indexOf("BF1005") > 0) vTrgCd = "BF1005";
								else if(vRsltMsg.indexOf("BF1028") > 0) vTrgCd = "BF1028";
								else if(vRsltMsg.indexOf("BF1039") > 0) vTrgCd = "BF1039";
								else if(vRsltMsg.indexOf("BF1100") > 0) vTrgCd = "BF1100";
								else if(vRsltMsg.indexOf("BF1007") > 0) vTrgCd = "BF1007";
								else if(vRsltMsg.indexOf("BF1026") > 0) vTrgCd = "BF1026";
								else if(vRsltMsg.indexOf("BF1000") > 0) vTrgCd = "BF1000";
								else if(vRsltMsg.indexOf("BF1010") > 0) vTrgCd = "BF1010";

								if(vRsltCd != "" && gErrCdList[vRsltCd+vTrgCd] != undefined && gErrCdList[vRsltCd+vTrgCd] != null){
									popalarm2(gErrCdList[vRsltCd+vTrgCd], "info", false);
									return;
								}
								else{
									popalarm2(vRsltMsg, "info", false);
									return;
								}
							}
						}
						else{
							if(gStatCount < 7){
								var ctemp = setTimeout(function(){ //interval 10초
									checkST0(osstOrdNo);
									clearTimeout(ctemp);
								}, 5000);
							}
							else{
								popalarm2("["+vRsltCd+"]"+vRsltMsg+"<br/>KB Liiv M 고객센터 1522-9999로 문의 주시기 바랍니다.", "info", false);
								return;
							}
						}
					}
					else{
						popalarm2("시스템 오류: 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
						return;
					}

				}else{
					popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
					return;
				}
			}
			catch(e){
				console.log(e);
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
				return;
			}
		},
		error: function(request,status,error){
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
			return;

		}
	});//end ajax
}

//신청상태 업데이트
function updateApplInfo(){
	var url = "/join/open/updateApplStat";

	$.ajax({
		type : "post",
		url  : url,
		data : {
			soId      : $("#soId").val(),
			applSeqNo : $("#applSeqNo").val(),
			custId    : $("#custId").val(),
			osstOrdNo : $("#osstOrdNo").val(),
			osstStat  : $("#osstStat").val(),
			chgrId    : "OSSTST10",
		},
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success : function(response) {
			console.log(JSON.stringify(response));
			if(response != null) { // response.joinInfo
				console.log("[ST1] 상태업데이트 완료");
				if($("#osstStat").val() == "PC2"){
					saveNpAuthInfo();
				}
				else {
					popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
				}
			} else {
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
			}
		},
        error: function(e){
        	popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
        }
	});
}

//사전동의요청
function sendNP1(){

	var base = new Object();
	var data = new Object();

	var osstNpBfacAgree = new Object();
	var OsstNpPrePrcInVO = new Object();
	var inDto = new Object();

	base.serviceId = "OSSTNP10";

	inDto.athnItemCd = "";
	inDto.athnSbst = "";
	inDto.bchngNpCommCmpnCd = $("#mcoCd").val();
	inDto.crprNo = "";
	inDto.custIdntNo = $("#regNo").val();
	if($("#custTp").val() == "IFX"){
		inDto.custIdntNoIndCd = "05";
	}
	else{
		inDto.custIdntNoIndCd = "01";
	}

	inDto.custNm = $("#custNm").val();
	inDto.custTypeCd = "I";
	if($("#custTp").val() == "GEF"){
		inDto.indvBizrYn = "Y";
	}
	else{
		inDto.indvBizrYn = "N";
	}

	inDto.npRstrtnContYn = "";
	inDto.npTlphNo = $("#mtelNo").val();
	inDto.oderTypeCd = "";
	inDto.slsCmpnCd = "KBM"; //판매회사코드
	inDto.ytrpaySoffAgreYn = "";

	//inDto.autnItemDvCd = getAuthMthd(); //번호이동구분코드
	//inDto.autnItemNo   = $("#npAuthKey").val(); //번호이동인증값


	OsstNpPrePrcInVO.inDto = inDto;
	osstNpBfacAgree.OsstNpPrePrcInVO = OsstNpPrePrcInVO;
	data.osstNpBfacAgree = osstNpBfacAgree;
	base.data = data;

	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/kt/osst/OSSTNP10',
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		//async: false,
		cache: false,
		dataType: "json",
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success: function(response) {
			console.log(JSON.stringify(response));

			try{
				if(response !== null && response.data !== null){
					var res = response.data.osstNpBfacAgreeResponse.return;
					if(res.commHeader.responseType == "N"){
						$("#SB808_RE").val("N");
						$("#SB813_RE").val("Y");
						//sendNP3();
					}
					else if(res.commHeader.responseType == "E"){
						if(res.commHeader.responseCode == "ITL_SST_E1014"){
							//이미 번호이동가입정보가 존재하는 전화번호
							$("#SB808_RE").val("N");
							$("#SB813_RE").val("Y");
						}
						else{
							popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
							$("#SB808_RE").val("Y");
							return;
						}
					}
					else{
						popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
						$("#SB808_RE").val("Y");
						return;
					}
				}
			}
			catch(e){
				console.log(e);
				popalarm2("[NP1]일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
				$("#SB808_RE").val("Y");
				return;
			}
		},
		error: function(request,status,error){
			$("#SB808_RE").val("Y");
			popalarm2("[NP1]일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
		},
		complete: function() {
		    openLoading("stop");
		}
	});//end ajax
}


//번호이동 MNP 인증 요청
function sendNP3(){

	var base = new Object();
	var data = new Object();

	var osstNpBfacAgreeRpyRetv = new Object();

	var OsstNpBfacAgreRpyRetvInVO  = new Object();
	var inDto    = new Object();

	var DsAutnRqstInVO = new Object();
	var sb813Re = $("#SB813_RE").val();

	inDto.telNo =  $("#mtelNo").val();
	inDto.bchngNpCommCmpnCd = $("#mcoCd").val();

	OsstNpBfacAgreRpyRetvInVO.inDto = inDto;
	osstNpBfacAgreeRpyRetv.OsstNpBfacAgreRpyRetvInVO = OsstNpBfacAgreRpyRetvInVO;
	data.osstNpBfacAgreeRpyRetv = osstNpBfacAgreeRpyRetv;

	base.serviceId = "OSSTNP30";
	base.data = data;
	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/kt/osst/OSSTNP30',
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		//async: false,
		cache: false,
		dataType: "json",
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success: function(response) {
			console.log(JSON.stringify(response));

			try{
				if(response !== null && response.data !== null){
					var res = response.data.osstNpBfacAgreeRpyRetvResponse.return;
					if(res.commHeader.responseType == "N"){

						var vRsltCd = res.outDto.rsltCd;
						var vRsltMsg = res.outDto.rsltMsg;
						if(vRsltCd == "S"){
						    $("#SB813_RE").val("N");
						    $("#athnBtn").prop('disabled', true);
						    popalarm2("정상적으로 처리되었습니다.", "info", false);
						}
						else{
							popalarm2(vRsltMsg, "info", false);
							$("#SB813_RE").val("Y");
							return;
						}

					}
					else{
						popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
						$("#SB813_RE").val("Y");
						return;
					}
				}
			}
			catch(e){
				console.log(e);
				popalarm2("[NP3]일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
				$("#SB813_RE").val("Y");
				return;
			}
		},
		error: function(request,status,error){
			popalarm2("[NP3]일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
			$("#SB813_RE").val("Y");

		},
        complete: function() {
            openLoading("stop");
        }
	});//end ajax

}

//사전동의 정보 체크
function preChkNpItem(){

	if($("#mcoCd").val() == ""){
		popalarm2("통신사를 선택해 주세요.", "info", false,"확인","mcoCd");
	}else if($("#mtelNo").val() == "" || !chkmtelNo($("#mtelNo").val()) ){
		popalarm2("휴대폰번호를 정확히 입력해주세요.", "info", false,"확인","mtelNo");
	}else if($("#npAuthKey").val() == "" && $("input:radio[name=rdoNpInfo]:checked").val() != "5"){
		popalarm2("인증정보를 정확히 입력해주세요.", "info", false,"확인","npAuthKey");
	}else{

		if($("#SB808_RE").val() == "N" && $("#SB813_RE").val() == "N"){
			popalarm2("사전동의 입력을 하셨습니다.", "info", false);
		}
		else if($("#SB808_RE").val() == "Y"){
		    openLoading("start");
			sendNP1();
		}
		else if ($("#SB813_RE").val() == "Y"){
		    openLoading("start");
			sendNP3();//[번호이동] MNP 인증요청
		}
	}

}


//버튼클릭시 NP정보 체크
function chkNpItem(){

	if($("#mcoCd").val() == ""){
		popalarm2("통신사를 선택해 주세요.", "info", false,"확인","mcoCd");
	}else if($("#mtelNo").val() == "" || !chkmtelNo($("#mtelNo").val()) ){
		popalarm2("휴대폰번호를 정확히 입력해주세요.", "info", false,"확인","mtelNo");
	}else if($("#npAuthKey").val() == "" && $("input:radio[name=rdoNpInfo]:checked").val() != "5"){
		popalarm2("인증정보를 정확히 입력해주세요.", "info", false,"확인","npAuthKey");
	}else{

		if($("#SB808_RE").val() == "N" && $("#SB813_RE").val() == "N"){
		    openLoading("start");
			sendPC0(gJoinInfo);
		}
		else if($("#SB808_RE").val() == "Y"){
			popalarm2("사전동의 결과가 확인되지 않았습니다.", "info", false);
		}
		else if ($("#SB813_RE").val() == "Y"){
			popalarm2("사전동의 결과가 확인되지 않았습니다.", "info", false);
		}
	}

}


//12 자리 폰 번호 가져오기
function getCtnFormat(value){
	if (value == null || value.length == 0) return '';

    var str = value.replace(/[^0-9/*]/g, '');
    var tmp = '';

    if(value.length == 11){
    	var a = '';
    	var b = '';
    	a = str.substr(0,3);
    	b = str.substr(3,8);
    	tmp = a + "0" + b;
    }

    if(tmp == null || tmp == ''){
        tmp = str;
    }

    return tmp;
}
