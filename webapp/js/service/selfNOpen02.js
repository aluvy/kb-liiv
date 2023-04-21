var gTestArr = new Array();
var gTestObj = new Object();
var gStatCount = 0;

//신청정보 세팅
function setJoinInfo(data){
	$("#soId").val(data.soId);
	$("#applSeqNo").val(data.applSeqNo);
	$("#custId").val(data.custId);
	$("#custNm").val(data.custNm);
	$("#ctrtId").val(data.ctrtId);
	$("#usrId").val(data.usrId);
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
	$("#corpRegNo7").val(data.corpRegNo7);


	$("#dlvrPstNo").val(data.dlvrPstNo);
	$("#dlvrBassAddr").val(data.dlvrBassAddr);
	$("#dlvrDtlAddr").val(data.dlvrDtlAddr);
	$("#cellPhnNo").val(data.dlvdstRcpntCellPhnNo);

	$("#pymMthd").val(data.pymMthd);
	$("#cardNo").val(data.cardNo);
	$("#cardCorpCd").val(data.cardCorpCd);
	$("#cardEffcprd").val(data.cardEffcprd);
	$('#emad').val(data.emad)

	$("#billMdmEmlYn").val(data.billMdmEmlYn);
	$("#billMdmSmsYn").val(data.billMdmSmsYn);

	$("#posCd").val(data.posCd);
	$("#mnoProdCd").val(data.mnoProdCd);
	if(data.usimMngNo ==  null ||  data.usimMngNo == ''){
		//$("#usimMngNo").val("K9040");
	}else{
		$("#usimMngNo").val(data.usimMngNo);
		$("#usimModelNo_org").val(data.usimMngNo);
	}

	$("#iccid").val(data.iccid);
	if(data.iccid.length > 18){
		$("#usimSerialNo").val(data.iccid.substr(0,19));
	}
	else{
		$("#usimSerialNo").val(data.iccid);
	}

	$("#chrgPln").val(data.chrgPln);
	$("#prodGrp").val(data.prodGrp);
	$("#modelNo").val(data.modelNo);

	$("#usimFeeCnt").val(data.usimFeeCnt);
	$("#preCheckSucYn").val(data.preCheckSucYn);


    //법정대리인
    $("#legalRprsnYn").val(data.legalRprsnYn);
	$("#legalRprsnNm").val(data.legalRprsnNm);
	$("#legalRprsnRegNo").val(data.legalRprsnRegNo);
	$("#legalRprsnRel").val(data.legalRprsnRel);
//	$("#legalRprsnDriverNo").val(data.legalRprsnDriverNo);
//  $("#legalRprsnIssueDt").val(data.legalRprsnIssueDt);

    $("#dsharStat").val(data.dsharStat);
    $("#dsharRelCd").val(data.dsharRelCd);
    $("#oppntCtrtId").val(data.oppntCtrtId);

    //KT일련번호
    $("#mvnoOrdNo").val(data.mvnoOrdNo);
    $("#osstOrdNo").val(data.osstOrdNo);
    $("#osstStat").val(data.osstStat);

	applTp = data.applTp;//번호이동 M 신규가입 N

	//eSIM정보
	$("#modelItemid").val(data.modelItemid);
	$("#modelSerialNo").val(data.modelSerialNo);
	$("#imei").val(data.imei);
	$("#imei2").val(data.imei2);
	$("#modelEid").val(data.modelEid);
	$("#modelMacAddress").val(data.modelMacAddress);

	if(data.esimYn == "Y"){
		sendY13();
	}
	else{
		$("#usimpickt").click();
    	openLoading("stop");
	}
}

//USIM 선 체크
function chkUsimCard(){

	var str    = $("#usimSerialNo").val();
	var strTmp = $("#usimSerialNoR").val();
	var len    = strTmp.length;

	if( strTmp == "" || len !== 19){
		$("#usimSerialNoR").focus();
		$("#btnOpenReq").prop("disabled",true);

        let opt = {
             msg         : "유심 일련번호를 정확히 입력해주세요.",
             cfrmYn      : false
        };
        popalarm(opt);

		return;
	}else{

		if(str != strTmp){
            $("#btnOpenReq").prop("disabled",true);

            let opt = {
                 msg         : "기존 발급된 유심 일련번호 정보와 다릅니다. 정확히 입력해주세요.<br/><br/>유심번호가 변경된 경우 KB Liiv M 고객상담센터 1522-9999(유료)를 통해서 개통 가능합니다. 연결하시겠습니까?",
                 cfrmYn      : true,
                 okCallback  : callbackCallCenter
            };
            popalarm(opt);
		}
		else{
			$("#btnOpenReq").prop("disabled",false);

            let opt = {
                 msg         : "유심번호가 확인되었습니다.",
                 cfrmYn      : false,
                 okCallback  : setDisabledUsim
            };
            popalarm(opt);
		}

	}//end if
}

//USIM 일련번호 체크
function chkUsimNo(){
	saveOpenigDstcd();
	if($("#esimYn").val() == "Y"){
		showOpenBar();
		gStatCount = 0;
		sendOP0();
	}
	else{
		var str    = $("#usimSerialNo").val();
		var strTmp = $("#usimSerialNoR").val();
		var len    = strTmp.length;

		if( strTmp == "" || len !== 19){
            $("#usimSerialNoR").focus();
            $("#btnOpenReq").prop("disabled",true);

            let opt = {
                 msg         : "유심 일련번호를 정확히 입력해주세요.",
                 cfrmYn      : false
            };
            popalarm(opt);

			return;
		}else{

			if(str != strTmp){
                let opt = {
                     msg         : "기존 발급된 유심 일련번호 정보와 다릅니다. 정확히 입력해주세요.<br/><br/>유심번호가 변경된 경우 KB Liiv M 고객상담센터 1522-9999(유료)를 통해서 개통 가능합니다. 연결하시겠습니까?",
                     cfrmYn      : true,
                     okCallback  : callbackCallCenter
                };
                popalarm(opt);
			}
			else{
				showOpenBar();

				var sb816_re = $("#SB816_RE").val();

				if(sb816_re == 'Y'){
					gStatCount = 0;
					sendOP0();
				}else{
					sendOP0();//USIM 단독개통 가상 단말등록
				}
			}

		}//end if
	}
}


//스마트 개통완료 처리
function sendOP0(){

	var ymdhms     = getYYYYMMDDHHMMSS();
	var ymd        = getYYYYMMDD();
	var prodRqstNo = $("#applSeqNo").val();

	var billAcntNo  = $("#billAcntNo").val();
	var prodNo		= $("#mtelNo").val();//전화번호
	var custNo      = $("#custNo").val();

	var base = new Object();
	var data = new Object();

	var osstOpenPrc = new Object();

	var OsstOpenPrcInVO = new Object();
	var inDto = new Object();
	var inNpDto = new Object();
	var inPrdcDto = new Object();

	var DsEntrOnlineSaleInVO = new Object();

	base.serviceId = "OSSTOP00";

	var vCustDvCd = "";
	var vCustKdCd = "";
	var vStayTermEndDt = "";
	var vStayLcnsCd = "";

	if($("#custTp").val() == "II"){
		vCustDvCd = "I";
		vCustKdCd = "II";
		vStayTermEndDt = "";
		vStayLcnsCd = "";
	}
	else if($("#custTp").val() == "GEF"){
		vCustDvCd = "G";
		vCustKdCd = "GEF";
		vStayTermEndDt = "";
		vStayLcnsCd = "";
	}
	else if($("#custTp").val() == "IFX"){
		vCustDvCd = "I";
		vCustKdCd = "IFX";
		vStayTermEndDt = $("#foreignerExpiratDt").val();
		vStayLcnsCd = $("#foreignerStyCd").val();
	}

	inDto.osstOrdNo = $("#osstOrdNo").val(); //OSST 오더 번호
	inDto.custNo = $("#custNo").val(); //고객번호

	if($("#dsharRelCd").val() == "C") { // 데이터 쉐어링 가입
		inDto.billAcntNo = $("#billAcntNo").val(); //청구계정번호
		inDto.rqsshtPprfrmCd = ""; //청구서양식코드
		inDto.rqsshtTlphNo = ""; //청구서 발송 전화번호
		inDto.rqsshtEmlAdrsNm = ""; //청구서이메일주소명
		inDto.billZipNo = ""; //청구우편번호
		inDto.billFndtCntplcSbst = ""; //청구기본연락처내용
		inDto.billMntCntplcSbst = ""; //청구상세연락처내용
		inDto.blpymMthdCd = ""; //납부방법코드
		inDto.duedatDateIndCd = ""; //납기일자구분코드
		inDto.crdtCardExprDate = ""; //신용카드만기일자
		inDto.crdtCardKindCd = ""; //신용카드종류코드
		inDto.bankCd = ""; //은행코드
		inDto.blpymMthdIdntNo = ""; //납부방법식별번호
		inDto.blpymCustNm = ""; //납부고객명
		inDto.blpymCustIdntNo = ""; //납부고객식별번호
		inDto.blpymMthdIdntNoHideYn = ""; //납부방법식별번호숨김여부
		inDto.bankSkipYn = ""; //은행건너뛰기여부
		inDto.agreIndCd = ""; //동의자료코드
		inDto.myslAthnTypeCd = ""; //본인인증타입코드
	} else {
		inDto.billAcntNo = ""; //청구계정번호
		if($("#billMdmEmlYn").val() == "Y"){
			inDto.rqsshtPprfrmCd = "CB"; //청구서양식코드
			inDto.rqsshtTlphNo = ""; //청구서 발송 전화번호
			inDto.rqsshtEmlAdrsNm = $('#emad').val(); //청구서이메일주소명
		}
		else {
			inDto.rqsshtPprfrmCd = "MB"; //청구서양식코드
			inDto.rqsshtTlphNo = $("#mtelNo").val(); //청구서 발송 전화번호
			inDto.rqsshtEmlAdrsNm = $('#emad').val(); //청구서이메일주소명
		}
		inDto.billZipNo = $("#dlvrPstNo").val(); //청구우편번호
		inDto.billFndtCntplcSbst = $("#dlvrBassAddr").val(); //청구기본연락처내용
		inDto.billMntCntplcSbst = $("#dlvrDtlAddr").val(); //청구상세연락처내용
		if($("#pymMthd").val() == "CM"){ //은행
			inDto.blpymMthdCd = "D"; //납부방법코드
			inDto.duedatDateIndCd = "21"; //납기일자구분코드

			inDto.crdtCardExprDate = ""; //신용카드만기일자
			inDto.crdtCardKindCd = ""; //신용카드종류코드

			inDto.bankCd = getBankCd($("#cardCorpCd").val()); //은행코드
			inDto.blpymMthdIdntNo = $('#cardNo').val(); //납부방법식별번호
		}
		else{ //카드
			inDto.blpymMthdCd = "C"; //납부방법코드
			inDto.duedatDateIndCd = "99"; //납기일자구분코드

			var cardValdEndYymm = $("#cardEffcprd").val().replace('/','');
		   	cardValdEndYymm = "20"+cardValdEndYymm.substr(2,2)+cardValdEndYymm.substr(0,2);
		   	inDto.crdtCardExprDate = cardValdEndYymm; //신용카드만기일자
			inDto.crdtCardKindCd = getCrdtCardKindCd($("#cardCorpCd").val()); //신용카드종류코드 $('#cardNo').val()

			inDto.bankCd = ""; //은행코드
			inDto.blpymMthdIdntNo = $('#cardNo').val(); //납부방법식별번호
		}
		inDto.blpymCustNm = $("#acntNm").val(); //납부고객명

		var birth_gender = $("#corpRegNo7").val();
		var birthDay = "";
		if(birth_gender.charAt(6) == "1" || birth_gender.charAt(6) == "2" || birth_gender.charAt(6) == "5" || birth_gender.charAt(6) == "6") {
			birthDay = "19" + birth_gender.substr(0,6);
		} else {
			birthDay = "20" + birth_gender.substr(0,6);
		}
		inDto.blpymCustIdntNo = birthDay; //납부고객식별번호
		inDto.blpymMthdIdntNoHideYn = "Y"; //납부방법식별번호숨김여부
		inDto.bankSkipYn = "N"; //은행건너뛰기여부

		//TODO 추후에 자동납부동의값 기준으로 변경처리필요
		if($("#preCheckSucYn").val() == "0"){ //미소지자 은행 방문
			inDto.agreIndCd = "01"; //동의자료코드 01: 서면, 02: 공인인증, 03:일반인증, 04: 녹취, 05:ARS
			inDto.myslAthnTypeCd = "01"; //본인인증타입코드  01: SMS, 02: iPin, 03: 신용카드, 04: 범용공인인증
		}
		else if ($("#preCheckSucYn").val() == "3"){ //모바일인증서
			inDto.agreIndCd = "03"; //동의자료코드
			inDto.myslAthnTypeCd = "02"; //본인인증타입코드
		}
		else if ($("#preCheckSucYn").val() == "2"){ //신용카드인증
			inDto.agreIndCd = "03"; //동의자료코드
			inDto.myslAthnTypeCd = "03"; //본인인증타입코드
		}
	}

	inDto.billAtchExclYn = ""; //청구첨부제외여부
	inDto.rqsshtTlphNoHideYn = ""; //청구서전화번호숨김여부
	inDto.rqsshtDsptYn = "N"; //청구서발송여부 Y: 발송안함, N:발송
	inDto.enclBillTrmnYn = ""; //동봉청구해지여부
	inDto.realUseCustNm = $("#custNm").val(); //실사용고객명
	inDto.mngmAgncId = "AA01976"; //관리대리점아이디
	inDto.cntpntCd = "SZA0000788"; //접점코드
	inDto.slsPrsnId = ""; //판매자아이디

	if($("#esimYn").val() == "Y"){
		inDto.iccId = ""; //ICC아이디. 실물유심용
		inDto.eUiccId = $("#modelEid").val(); //EID
		inDto.intmMdlId = $("#modelItemid").val(); //기기모델아이디
		inDto.intmSrlNo = $("#modelSerialNo").val(); //기기일련번호
		inDto.eSimOpenYn = "Y"; //eSIM개통여부
		inDto.usimOpenYn = "N"; //유심개통여부
		inDto.motliSvcNo = ""; //모회선전화번호
		inDto.usimPymnMthdCd = "B"; //USIM 수납방법코드
		inDto.spclSlsNo = "G2982"; //특별판매번호(기본판매_중고/자급제/외산단말)
	}
	else{
		inDto.iccId = $("#usimSerialNo").val(); //ICC아이디. 실물유심용
		inDto.eUiccId = ""; //EID
		inDto.intmMdlId = ""; //기기모델아이디
		inDto.intmSrlNo = ""; //기기일련번호
		inDto.eSimOpenYn = "N"; //eSIM개통여부
		inDto.usimOpenYn = "Y"; //유심개통여부
		inDto.motliSvcNo = ""; //모회선전화번호
		inDto.usimPymnMthdCd = "N"; //USIM 수납방법코드
		inDto.spclSlsNo = "G0839"; //특별판매번호(유심단독개통)
	}

	if($("#legalRprsnYn").val() == "Y"){
		inDto.agntRltnCd = "03"; //대리인관계코드

		var legal_gender = $("#legalRprsnRegNo").val().substr(0,7);
		var legalDay = "";
		if(legal_gender.charAt(6) == "1" || legal_gender.charAt(6) == "2" || legal_gender.charAt(6) == "5" || legal_gender.charAt(6) == "6") {
			legalDay = "19" + legal_gender.substr(0,6);
		} else {
			legalDay = "20" + legal_gender.substr(0,6);
		}

		inDto.agntBrthDate = legalDay; //대리인생일일자
		inDto.agntCustNm = $("#legalRprsnNm").val(); //대리인고객명

		inDto.blpymCustNm = $("#legalRprsnNm").val(); //미성년자일때의 납부고객명
		inDto.blpymCustIdntNo = legalDay; //미성년자일때의 납부고객식별번호
	}
	else{
		inDto.agntRltnCd = ""; //대리인관계코드
		inDto.agntBrthDate = ""; //대리인생일일자
		inDto.agntCustNm = ""; //대리인고객명
	}

	inDto.homeTlphNo = ""; //자택전화번호
	inDto.wrkplcTlphNo = ""; //직장전화번호
	inDto.prttlpNo = telNoSeqFormatter($("#cellPhnNo").val()); //이동전화번호
	inDto.ftrNewParam = ""; //상품 파람
	inDto.spnsDscnTypeCd = ""; //스폰서할인유형코드
	inDto.agncSupotAmnt = ""; //대리점지원금액
	inDto.enggMnthCnt = ""; //약정개월수
	inDto.hndsetInstAmnt = ""; //단말기분납금액
	inDto.hndsetPrpyAmnt = ""; //단말기선납금액
	inDto.instMnthCnt = ""; //분납개월수
	inDto.sbscstPymnMthdCd = "P"; //가입비 수납방법코드
	inDto.sbscstImpsExmpRsnCd = "37"; //가입비면제사유코드
	inDto.bondPrsrFeePymnMthdCd = ""; //채권보전료수납방법코드
	inDto.tlphNo = $("#mtelNo").val(); //전화번호
	inDto.sbscPrtlstRcvEmlAdrsNm = $('#emad').val(); //가입내역서수신이메일주소명
	inDto.atmSeqNo = ""; //atm일련번호

	inNpDto.npFeePayMethCd = ""; //번호이동수수료 수납방법코드
	inNpDto.npBillMethCd = ""; //타사미청구금액 청구방법코드
	inNpDto.npHndsetInstaDuratDivCd = ""; //번호이동단말기분납지속구분코드
	inNpDto.rfundNpBankCd = ""; //번호이동환불은행코드
	inNpDto.rfundBankBnkacnNo = ""; //번호이동환불계좌번호
	inNpDto.npTotRmnyAmt = ""; //번호이동총수납금액
	inNpDto.npCashRmnyAmt = ""; //번호이동현금수납액
	inNpDto.npCcardRmnyAmt = ""; //번호이동카드수납액
	inNpDto.npRmnyMethCd = ""; //번호이동수납방법코드
	inNpDto.npHndsetInstaLmsTlphNo = ""; //번호이동단말기분납문자명세서전화번호
	inNpDto.npCcardNo = ""; //번호이동카드번호
	inNpDto.npCcardExpirYm = ""; //번호이동카드유효기간(만기년월)
	inNpDto.npInslMonsNum = ""; //번호이동할부개월수
	inNpDto.npCcardSnctTypeCd = ""; //번호이동결제유형코드
	inNpDto.npCcaardOwnrIdfyNo = ""; //번호이동카드명의인식별번호
	inNpDto.npSgntInfo = ""; //번호이동서명정보

	inPrdcDto.prdcCd = $("#mnoProdCd").val(); //상품코드
	inPrdcDto.prdcTypecd = "P"; //상품타입코드

	OsstOpenPrcInVO.inDto = inDto;
	OsstOpenPrcInVO.inNpDto = inNpDto;
	OsstOpenPrcInVO.inPrdcDto = inPrdcDto;
	osstOpenPrc.OsstOpenPrcInVO = OsstOpenPrcInVO;
	data.osstOpenPrc = osstOpenPrc;

	base.data = data;
	base.processMode = "backend";
	base.pApplSeqNo = $("#applSeqNo").val();
	base.pSoId = $("#soId").val();

	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/kt/osst/OSSTOP00',
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

			var rsltCd = "";
			var rsltMsg = "";
			var osstOrdNo = "";

			try{
				if(response !== null && response.data !== null){
					var res = response.data.osstOpenPrcResponse.return;
					if(res.commHeader.responseType == "N"){
						osstOrdNo = res.osstOrdNo;
						rsltCd = res.rsltCd;
						rsltMsg = res.rsltMsg;
						if(rsltCd == "S"){
							var ctemp = setTimeout(function(){ //interval 10초
								checkST0(osstOrdNo);
								clearTimeout(ctemp);
							}, 10000);

							//updateApplStat(osstOrdNo);
						}
						else{
							$("#SB816_RE").val("Y");
							hideOpenBar();
                            let opt = {
                                 msg         : rsltMsg,
                                 cfrmYn      : false
                            };
                            popalarm(opt);
						}
					}
					else{
						var errCd = res.commHeader.responseCode;
						var errMsg = res.commHeader.responseBasic;
						if(errCd != "" && gErrCdList[errCd] != undefined && gErrCdList[errCd] != null){
							hideOpenBar();
                            let opt = {
                                 msg         : gErrCdList[errCd],
                                 cfrmYn      : false
                            };
                            popalarm(opt);
							$("#SB816_RE").val("Y");
							return;
						}
						else{
							$("#SB816_RE").val("Y");
							hideOpenBar();
                            let opt = {
                                 msg         : "시스템 오류:일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                                 cfrmYn      : false
                            };
                            popalarm(opt);
							return;
						}
					}
				}
				else{
					$("#SB816_RE").val("Y");
					hideOpenBar();
					popalarmRetry();
					return;
				}

			}catch(e){
				console.log(e);
				$("#SB816_RE").val("Y");
				hideOpenBar();
				popalarmRetry();
				return;
			}

		},
		error: function(request,status,error){
			$("#SB816_RE").val("Y");
			hideOpenBar();
			popalarmRetry();
		}
	});//end ajax

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
						if(vPrgrStatCd == "OP2"){
							//PC0: 사전체크접수, PC1:사전체크 중, PC2: 사전체크완료
							//OP0: 개통 접수, OP1: 개통 진행 중, OP2: 개통작업 완료
							//CP0: 지능망직권해지접수, CP1: 지능망직권해지 진행 중, CP2: 지능망직권해지 완료
							if(vRsltCd == "0000"){
								updateApplStat(vSvcCntrNo);
							}
							else{
								hideOpenBar();
                                let opt = {
                                     msg         : vRsltMsg,
                                     cfrmYn      : false
                                };
                                popalarm(opt);
								$("#SB816_RE").val("Y");
								return;
							}
						}
						else{
							if(gStatCount < 10){
								var ctemp = setTimeout(function(){ //interval 10초
									checkST0(osstOrdNo);
									clearTimeout(ctemp);
								}, 10000);
							}
							else{
								hideOpenBar();
                                let opt = {
                                     msg         : "["+vRsltCd+"]"+vRsltMsg+"<br/>개통 완료 상태를 확인하지 못했습니다.<br/>5분 후 재 로그인하여 다시 한번 개통완료 여부를 확인해 주세요.",
                                     cfrmYn      : false
                                };
                                popalarm(opt);
								$("#SB816_RE").val("Y");
								return;
							}
						}
					}
					else{
						hideOpenBar();
                        let opt = {
                             msg         : "시스템 오류: 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                             cfrmYn      : false
                        };
                        popalarm(opt);
						$("#SB816_RE").val("Y");
						return;
					}

				}else{
					hideOpenBar();
					popalarmRetry();
					$("#SB816_RE").val("Y");
					return;
				}
			}
			catch(e){
				console.log(e);
				hideOpenBar();
				popalarmRetry();
				$("#SB816_RE").val("Y");
				return;
			}
		},
		error: function(request,status,error){
			hideOpenBar();
			popalarmRetry();
			$("#SB816_RE").val("Y");
			return;

		}
	});//end ajax
}

//신청정보의 OSST_STAT확인
function fnCheckOsstStat(osstOrdNo){
	var url = "/join/open/getJoinApplInfo";
	$.ajax({
		type : "post",
		url  : url,
		data : {
			soId      :  $("#soId").val(),
			applSeqNo :  $("#applSeqNo").val(),
			custId    :  $("#custId").val()
		},
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success : function(response) {


			try{
				gStatCount++;
				var osstStat = response.joinInfo.osstStat;
				if(osstStat == "OP2"){
					updateApplStat(osstOrdNo);
				}
				else{
					if(gStatCount <= 5){
						var ctemp = setTimeout(function(){ //interval 10초
							fnCheckOsstStat(osstOrdNo);
							clearTimeout(ctemp);
						}, 10000);
					}
					else{
						hideOpenBar();
                        let opt = {
                             msg         : "개통처리가 확인되지 않았습니다.<br/>KB Liiv M 고객센터 1522-9999로 문의 주시기 바랍니다.",
                             cfrmYn      : false
                        };
                        popalarm(opt);
					}
				}

			}
			catch(e){
				console.log(e);
				hideOpenBar();
				popalarmRetry();
				return;
			}

		},
        error: function(e){
        	hideOpenBar();
        	popalarmRetry();
        }
	});
}


//기기원부조회
function sendY13(){

	$.ajax({
		type: 'POST',
		url : "/info/esim/sendY13",
		data: {
			soId : $("#soId").val(),
			intmMdlId : "",
			intmUniqIdntNo : $("#imei2").val(),
			indCd : "2",
			intmSrlNo : ""
		},
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
	    success: function(res) {
	    	console.log(res);

	    	try{
	    		if(res.commHeader.responseType == "N"){
	    			var outDto = res.outDto;
					if(outDto.length > 0){
						var openRstrYn = fnCheckNull(outDto[0].openRstrYn);
						var lastIntmStatCd = fnCheckNull(outDto[0].lastIntmStatCd);
						var eUiccId = fnCheckNull(outDto[0].eUiccId);

						console.log("modelItemid="+outDto[0].intmMdlId);
						console.log("modelSerialNo="+outDto[0].intmSrlNo);
						console.log("modelEid="+eUiccId);

						if(openRstrYn == "Y"){
                            let opt = {
                                 msg         : "개통이 불가능한 단말입니다.",
                                 cfrmYn      : false
                            };
                            popalarm(opt);
						}
						else if (lastIntmStatCd == "10" || lastIntmStatCd == "40"){
                            let opt = {
                                 msg         : "개통이 불가능한 단말입니다.",
                                 cfrmYn      : false
                            };
                            popalarm(opt);
						}
						else{
							//KT 등록된 단말 정보로 갱신
							$("#modelItemid").val(fnCheckNull(outDto[0].intmMdlId));
							$("#modelSerialNo").val(fnCheckNull(outDto[0].intmSrlNo));

							$("#btnOpenReq").prop("disabled",false);

						}
					}
					else{
						popalarmRetry();
					}
				}
	    		else{
                    let opt = {
                         msg         : "등록되지 않은 단말입니다.",
                         cfrmYn      : false
                    };
                    popalarm(opt);
	    		}
	    	}
	    	catch(e){
				console.log(e);
				popalarmRetry();
				return;
			}
	    },
	    error: function(e) {
			popalarmRetry();
	    },
        complete: function() {
            openLoading("stop");
        }
	});
}

//유심번호 체크
function checkUsimmngno(){
	var rtnval = true;
	var val = $("#usimModelNo_org").val();

	if($("#usimMngNo").val() == "K3600" || $("#usimMngNo").val() == "K9040"){
		console.log(val)
		if(val != '' && val != null && $("#usimMngNo").val() != val){
			rtnval = false;
            let opt = {
                 msg         : "유심 모델번호가 틀립니다. 정확히 선택해 주세요.",
                 cfrmYn      : false
            };
            popalarm(opt);
			//$("#usimMngNo").val(val);
		}
	}

	return rtnval;

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

//유심모델 체크
function checkUsimmngno(){
	var rtnval = true;
	var val = $("#usimModelNo_org").val();

	if($("#usimMngNo").val() == "K3600" || $("#usimMngNo").val() == "K9040"){
		console.log(val)
		if(val != '' && val != null && $("#usimMngNo").val() != val){
			rtnval = false;
            let opt = {
                 msg         : "유심 모델번호가 틀립니다. 정확히 선택해 주세요.",
                 cfrmYn      : false
            };
            popalarm(opt);
			//$("#usimMngNo").val(val);
		}
	}

	return rtnval;

}

//(KT)카드사 코드
function getCrdtCardKindCd(cardCd) {

	var returnVal = "";
	if(cardCd == "02") { //국민카드
		returnVal = "GM";
	}
	else if(cardCd == "71") { //NH카드
		returnVal = "NH";
	}
	else if(cardCd == "08") { //롯데신용카드
		returnVal = "AM";
	}
	else if(cardCd == "01") { //비씨카드
		returnVal = "BC";
	}
	else if(cardCd == "04") { //삼성카드
		returnVal = "SS";
	}
	else if(cardCd == "26") { //신한카드
		returnVal = "SH";
	}
	else if(cardCd == "72") { //씨티카드
		returnVal = "CT";
	}
	else if(cardCd == "07") { //현대카드
		returnVal = "DY";
	}
	else if(cardCd == "03") { //하나SK카드
		returnVal = "HS";
	}

	return returnVal;
}

//(KT)은행 코드
function getBankCd(bankCd) {
	var returnVal = bankCd+"0000";

	return returnVal;
}

function popalarmRetry(){
    let opt = {
         msg         : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
         cfrmYn      : false
    };
    popalarm(opt);
}