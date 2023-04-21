var gTestArr = new Array();
var gTestObj = new Object();


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


    console.log("esimYn="+data.esimYn);
	console.log("modelItemid="+data.modelItemid);
	console.log("modelSerialNo="+data.modelSerialNo);
	console.log("modelEid="+data.modelEid);
	console.log("imei="+data.imei);
	console.log("imei2="+data.imei2);
	console.log("modelMacAddress="+data.modelMacAddress);

    if(data.watchTp == 'G' || data.watchTp == 'A'){
    	popalarm2("워치 셀프개통이 불가능합니다.<br/>고객센터(☎1522-9999)를 통해 개통가능합니다.", "info", false,"",goBack);
    }
    else if(data.esimYn == "C"){
		popalarm2("개통에 필요한 eSIM정보가 유효하지 않습니다.<br/>eSIM정보 먼저 등록해주세요.", "info", false,"",goBack);
	}
	else if(data.esimYn == "Y"){
		if(data.modelItemid == "" || data.modelSerialNo == "" || data.modelEid == "" || data.imei2 == ""){
			popalarm2("개통에 필요한 eSIM정보가 유효하지 않습니다.<br/>eSIM정보 먼저 등록해주세요.", "info", false,"",goBack);
		}
		else{
			if($("#legalRprsnYn").val() == 'Y'){
		    	sendCM802_legal();
		    }else{
				sendSB803();
		    }
		}
	}
	else{
		if($("#legalRprsnYn").val() == 'Y'){
	    	sendCM802_legal();
	    }else{
	    	sendSB803();
	    }
	}
}

//고객마스터 유형별 상세조회 - 법정대리인
function sendCM802_legal(){
	var base = new Object();
	var data = new Object();

	var RetrieveCustomerInfoByCustList = new Object();

	var RequestRecord = new Object();
	var RequestBody   = new Object();

	var DataInVO  = new Object();
	var UserInfoInVO = new Object();

	base.serviceId = "CM802";

	DataInVO.retType = "M";
	DataInVO.custrnmNo = $("#legalRprsnRegNo").val();
	DataInVO.bsRegNo = "";
	DataInVO.custDvCd = "I";
	DataInVO.custKdCd = "II";
	DataInVO.custNo = "";
	DataInVO.userId = "";
	DataInVO.nextOperatorId = "1100000288";

	UserInfoInVO.userId = "";
	UserInfoInVO.userNm = "";
	UserInfoInVO.intgUserId = "";
	UserInfoInVO.userOrgCd = "";
	UserInfoInVO.userLginIp = "";
	UserInfoInVO.extduYn = "Y";
	UserInfoInVO.mrktCd = "KBM";
	UserInfoInVO.userDlrCd = "315397";
	UserInfoInVO.userDlrGrpCd = "";
	UserInfoInVO.userDlrNm = "KB국민은행지점";
	UserInfoInVO.nextOperatorId = "1100000288";

 	RequestBody.DataInVO  = DataInVO;
 	RequestBody.UserInfoInVO = UserInfoInVO;

	RequestRecord.RequestBody = RequestBody;

	RetrieveCustomerInfoByCustList.RequestRecord = RequestRecord;

	data.RetrieveCustomerInfoByCustList = RetrieveCustomerInfoByCustList;

	base.data = data;
	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/CM802',
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

			var resultCode    = "";
			var resultMessage = "";
			var custNo		  = "";
			var msgCd		  = "";
			var msgTxt		  = "";

			var DsCtplcListOutVO = new Array();
			var custBasCtplcYn = ""; //고객기본연락처여부
			var telno = "";
			var legalRprsnTelNo = getCtnFormat($("#legalRprsnTelNo").val());

			console.log("DB_legalRprsnTelNo="+legalRprsnTelNo);

			try{
				resultCode    = response.resultCode;
				msgCd         = response.data.RetrieveCustomerInfoByCustListResponse.ResponseRecord.ResponseBody.DsMsgOutVO.msgCd;
				msgTxt        = response.data.RetrieveCustomerInfoByCustListResponse.ResponseRecord.ResponseBody.DsMsgOutVO.msgTxt;
				custNo        = response.data.RetrieveCustomerInfoByCustListResponse.ResponseRecord.ResponseBody.DsCstInfoOutVO[0].custNo;
				DsCtplcListOutVO = response.data.RetrieveCustomerInfoByCustListResponse.ResponseRecord.ResponseBody.DsCtplcListOutVO;

				if(DsCtplcListOutVO != null){
					for(var i = 0 ; i < DsCtplcListOutVO.length ; i++ ){
						if(DsCtplcListOutVO[i].custBasCtplcYn == "1") telno = DsCtplcListOutVO[i].telno;
					}
				}
				console.log("ESB_telno="+telno);

				$("#legalRprsnCustNo").val(custNo);
			}catch(e){
				resultMessage = response.resultMessage;
			}

			console.log('CM802_legal resultCode='+resultCode+ " legalRprsnCustNo=" + custNo + " msgCd=" + msgCd + " msgTxt=" + msgTxt);

			if(resultCode == 'N0000' && msgCd == '00'){ //고객정보 존재
				if(telno == legalRprsnTelNo){ //법정대리인의 전화번호가 기존 유큐브 저장 전화번호와 같다면, 넘어감
					sendSB803();
				}
				else {
					sendCM805_legal();//법정대리인의 전화번호가 기존 유큐브 저장 전화번호와 다르다면 고객정보 채번 수정
				}
			}else if(resultCode == 'N0000' && msgCd == '01'){//고객정보 미존재
				sendCM805_legal();//고객정보 채번 수정
			}else if(resultCode !== 'N0000'){
				popalarm2(resultMessage, "info", false,"",goBack);
			}else{
				popalarm2("[CM802 legal]일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
			}

		},
		error: function(request,status,error){
			popalarm2("[CM802 legal] 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
		}
	});//end ajax
}

//스마트개통 고객정보 등록 및 수정 - 법정대리인
function sendCM805_legal(custYn){
	var base = new Object();
	var data = new Object();

	var CreateSmrtCustomerInfo = new Object();

	var RequestRecord = new Object();
	var RequestBody   = new Object();

	var DsLawAgntInVO = new Object();
	var UserInfoInVO  = new Object();
	var DsCustInfoInVO  = new Object();

	base.serviceId = "CM805";

	DsLawAgntInVO.custNo = "";
	DsLawAgntInVO.custDvCd = "";
	DsLawAgntInVO.custKdCd = "";
	DsLawAgntInVO.custNm = "";
	DsLawAgntInVO.custrnmNo = "";
	DsLawAgntInVO.bsRegNo = "";
	DsLawAgntInVO.indvCustRnmKdCd = "";
	DsLawAgntInVO.custTel = "";
	DsLawAgntInVO.custAddrZip = "";
	DsLawAgntInVO.custVilgAbvAddr = "";
	DsLawAgntInVO.custVilgBlwAddr = "";
	DsLawAgntInVO.ntnltCd = "";
	DsLawAgntInVO.psprAutnDt = "";
	DsLawAgntInVO.stayTermStartDt = "";
	DsLawAgntInVO.stayTermEndDt = "";
	DsLawAgntInVO.stayLcnsCd = "";
	DsLawAgntInVO.custBday = "";
	DsLawAgntInVO.nextOperatorId = "1100000288";

    UserInfoInVO.userId = "";
    UserInfoInVO.userNm = "";
    UserInfoInVO.intgUserId = "";
    UserInfoInVO.userOrgCd = "";
    UserInfoInVO.userLginIp = "";
    UserInfoInVO.extduYn = "Y";
    UserInfoInVO.mrktCd = "KBM";
    UserInfoInVO.userDlrCd = "315397";
    UserInfoInVO.userDlrGrpCd = "315397";
    UserInfoInVO.userDlrNm = "KB국민은행지점";
    UserInfoInVO.nextOperatorId = "1100000288";

    DsCustInfoInVO.custNo = "";
    DsCustInfoInVO.custDvCd = "I";
    DsCustInfoInVO.custKdCd = "II";
    DsCustInfoInVO.custNm = $("#legalRprsnNm").val();
    DsCustInfoInVO.custrnmNo = $("#legalRprsnRegNo").val();
    DsCustInfoInVO.bsRegNo = "";
    DsCustInfoInVO.bizCompNm = "";
    DsCustInfoInVO.indvCustRnmKdCd = "";
    DsCustInfoInVO.custTel = getCtnFormat($("#legalRprsnTelNo").val());
    DsCustInfoInVO.custAddrZip = $("#dlvrPstNo").val();
    DsCustInfoInVO.custVilgAbvAddr = $("#dlvrBassAddr").val();
    DsCustInfoInVO.custVilgBlwAddr = $("#dlvrDtlAddr").val();
    DsCustInfoInVO.ntnltCd = "";
    DsCustInfoInVO.psprAutnDt = "";
    DsCustInfoInVO.stayTermStartDt = "";
    DsCustInfoInVO.stayTermEndDt = "";
    DsCustInfoInVO.stayLcnsCd = "";
    DsCustInfoInVO.youthYn = "";
    DsCustInfoInVO.custBday = "";
    DsCustInfoInVO.nextOperatorId = "1100000288";
    DsCustInfoInVO.sohoInkdCd = "";
    DsCustInfoInVO.seempDivsCd = "";

   	RequestBody.DsLawAgntInVO  = DsLawAgntInVO;
   	RequestBody.UserInfoInVO   = UserInfoInVO;
   	RequestBody.DsCustInfoInVO = DsCustInfoInVO;


	RequestRecord.RequestBody = RequestBody;

	CreateSmrtCustomerInfo.RequestRecord = RequestRecord;

	data.CreateSmrtCustomerInfo = CreateSmrtCustomerInfo;

	base.data = data;
	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/CM805',
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
			console.log(response);

			var resultCode    = "";
			var resultMessage = "";
			var rlstMsg		  = "";
			var rlstCd		  = "";
			var custNo = "";

			try{
				resultCode    = response.resultCode;
				resultMessage = response.ResultMessage;
				rlstMsg       = response.data.CreateSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsRsltOutVO.rlstMsg;
				rlstCd        = response.data.CreateSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsRsltOutVO.rlstCd;
				custNo        = response.data.CreateSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsRsltOutVO.custNo;
			}catch(e){
				resultMessage = response.resultMessage;
			}
			console.log('CM805 legal resultCode='+resultCode+ + " rlstMsg=" + rlstMsg + " rlstCd=" + rlstCd);

			if(resultCode == 'N0000' && rlstCd == '00'){
				$("#legalRprsnCustNo").val(custNo);
				sendSB803();
			}else if(resultCode !== 'N0000'){
				popalarm2(resultMessage, "info", false,"",goBack);
			}else{
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
			}

		},
		error: function(request,status,error){
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
		}
	});//end ajax
}


//스마트 등록 실시간 가입 판매정보 등록
function sendSB803(step){

	var mvnoRcptNo  = "";//가입예약번호
	var billAcntNo  = "";//청구계정번호
	var custNo		= "";
  	var prodRqstNo  = "";

	if(step == '9'){
		if($("#mvnoRcptNo").val() != '' && $("#mvnoRcptNo").val() != null && $("#mvnoRcptNo").val() != 'NULL'){
			mvnoRcptNo  = $("#mvnoRcptNo").val();
		}
		if( $("#billAcntNo").val() != '' && $("#billAcntNo").val() != null && $("#billAcntNo").val() != 'NULL'){
			billAcntNo  = $("#billAcntNo").val();
		}
		if( $("#custNo").val() != '' && $("#custNo").val() != null && $("#custNo").val() != 'NULL'){
			custNo      = $("#custNo").val();
		}
		prodRqstNo = $("#prodRqstNo").val();//$("#applSeqNo").val();
	}

	var base = new Object();
	var data = new Object();

	var SaveEntrSaleOnlineInfoEsb = new Object();

	var RequestRecord = new Object();
	var RequestBody   = new Object();

	var DsEntrInfoInVO       = new Object();
	var DsConfldsInVO        = new Object();
	var DsDevSaleInfoInVO    = new Object();
	var DsEntrOnlineSaleInVO = new Object();
	var DsEntrBySvcInfoInVO  = new Object();
	var DsRsvMnpInfoInVO     = new Object();
	var DsAtrctInfoInVO      = new Object();
	var DsAsgnNoListInVO     = new Object();
	var DsEntrRsvBySvcListInVO = new Object();
	var DsCustInfoInVO         = new Object();
	var DsJncoCpnInfoInVO      = new Object();

	base.serviceId = "SB803";

	DsEntrInfoInVO.prodNo = "";
	DsEntrInfoInVO.aceno = "";
	DsEntrInfoInVO.frstEntrRqstNo = "";
	DsEntrInfoInVO.cpno = "";
	DsEntrInfoInVO.entrNo = "";
	DsEntrInfoInVO.elecDocNo = "";
	DsEntrInfoInVO.allAgrmtYn = "";
	DsEntrInfoInVO.custAgrmtYn = "";
	DsEntrInfoInVO.custInfoGthrAgrmtYn = "";
	DsEntrInfoInVO.custInfoTrstAgrmtYn = "";
	DsEntrInfoInVO.custInfoCprtPuseAgrmtYn = "";
	DsEntrInfoInVO.mblAdRcpAgrmtYn = "";
	DsEntrInfoInVO.locFndtnInfoAgrmtYn = "";
	DsEntrInfoInVO.indvInfoThptAgrmtYn = "";
	DsEntrInfoInVO.indvCrdtInqAgrmtYn = "";
	DsEntrInfoInVO.adOfferTrstAgrmtYn = "";
	DsEntrInfoInVO.mppgEntrRsvRcptSeqno = "";
	DsEntrInfoInVO.inputAddJson = "";
	DsEntrInfoInVO.nextOperatorId = "1100000288";

	DsConfldsInVO.entrNo = "";
	DsConfldsInVO.aceno = "";
	DsConfldsInVO.billAcntNo = "";
	DsConfldsInVO.prodNo = "";
	DsConfldsInVO.userWorkDlrCd = "";
	DsConfldsInVO.userWorkDlrNm = "";
	DsConfldsInVO.lockMode = "";
	DsConfldsInVO.cnId = "";
	DsConfldsInVO._directive = "";
	DsConfldsInVO._transactionMode = "";
	DsConfldsInVO._runDate = "";
	DsConfldsInVO._runDateDtm = "";
	DsConfldsInVO.transactionMode = "";
	DsConfldsInVO.directive = "";
	DsConfldsInVO.runDate = "";
	DsConfldsInVO.runDateDtm = "";
	DsConfldsInVO.entrSysUpdateDate = "";
	DsConfldsInVO.entrDlUpdateStamp = "";
	DsConfldsInVO.cntcSysUpdateDate = "";
	DsConfldsInVO.cntcDlUpdateStamp = "";
	DsConfldsInVO.billSysUpdateDate = "";
	DsConfldsInVO.billDlUpdateStamp = "";
	DsConfldsInVO.ctnDlUpdateStamp = "";
	DsConfldsInVO.ctnSysUpdateDate = "";
	DsConfldsInVO.inputAddJson = "";
	DsConfldsInVO.nextOperatorId = "1100000288";

	DsDevSaleInfoInVO.itemId =  "";
	DsDevSaleInfoInVO.manfSerialNo =  "";
	DsDevSaleInfoInVO.usimMdlCd =  "";
	DsDevSaleInfoInVO.usimSerialNo =  "";
	DsDevSaleInfoInVO.sdphnYn =  "";
	DsDevSaleInfoInVO.usimDvCd =  "";
	DsDevSaleInfoInVO.plcydcPlcyCd =  "";
	DsDevSaleInfoInVO.bizPlcyCd =  "";
	DsDevSaleInfoInVO.hpdisAmt =  "";
	DsDevSaleInfoInVO.sdphnCmpsnAmt =  "";
	DsDevSaleInfoInVO.devcDlvrAmt =  "";
	DsDevSaleInfoInVO.rsaleAmt =  "";
	DsDevSaleInfoInVO.cashAmt =  "";
	DsDevSaleInfoInVO.cardAmt =  "";
	DsDevSaleInfoInVO.cprtCardAmt =  "";
	DsDevSaleInfoInVO.insttAmt =  "";
	DsDevSaleInfoInVO.insttMnbr =  "";
	DsDevSaleInfoInVO.suprtAmt =  "";
	DsDevSaleInfoInVO.entrDscntKdCd =  "";
	DsDevSaleInfoInVO.insttDvCd =  "";
	DsDevSaleInfoInVO.slt1InsttMnbr =  "";
	DsDevSaleInfoInVO.slt2InsttMnbr =  "";
	DsDevSaleInfoInVO.mnthAtmny =  "";
	DsDevSaleInfoInVO.insttFeeAmt =  "";
	DsDevSaleInfoInVO.sdphnPnt =  "";
	DsDevSaleInfoInVO.cashAcumAmt =  "";
	DsDevSaleInfoInVO.allDscntAmt =  "";
	DsDevSaleInfoInVO.chceAgmtYn =  "";
	DsDevSaleInfoInVO.chceAgmtMnbr =  "";
	DsDevSaleInfoInVO.rvinsAgrmtYn =  "";
	DsDevSaleInfoInVO.insrSvcId =  "";
	DsDevSaleInfoInVO.usimPymMthdCd =  "";
	DsDevSaleInfoInVO.coPrmPymMthdCd =  "";
	DsDevSaleInfoInVO.insttYn =  "";
	DsDevSaleInfoInVO.cashYn =  "";
	DsDevSaleInfoInVO.cprtCardYn =  "";
	DsDevSaleInfoInVO.cardYn =  "";
	DsDevSaleInfoInVO.cashAcumYn =  "";
	DsDevSaleInfoInVO.sdphnPntYn =  "";
	DsDevSaleInfoInVO.cashAcumUseYn =  "";
	DsDevSaleInfoInVO.cashAcumUseAmt =  "";
	DsDevSaleInfoInVO.usimSaleAmt =  "";
	DsDevSaleInfoInVO.coPrmAmt =  "";
	DsDevSaleInfoInVO.devHelpAmt =  "";
	DsDevSaleInfoInVO.cprtCdcmpCd =  "";
	DsDevSaleInfoInVO.cprtCardCd =  "";
	DsDevSaleInfoInVO.cprtCardMnbr =  "";
	DsDevSaleInfoInVO.entrRqstCntnt =  "";
	DsDevSaleInfoInVO.inputAddJson =  "";
	DsDevSaleInfoInVO.nextOperatorId =  "1100000288";
	DsDevSaleInfoInVO.mnpCardApno =  "";
	DsDevSaleInfoInVO.mnpCprtCardApno =  "";
	DsDevSaleInfoInVO.devcCardApno =  "";
	DsDevSaleInfoInVO.devcCprtCardApno =  "";
	DsDevSaleInfoInVO.usimCardApno =  "";
	DsDevSaleInfoInVO.coGrtinsCardApno =  "";
	DsDevSaleInfoInVO.dpDscntAmt =  "";
	DsDevSaleInfoInVO.devGrdCd =  "";
	DsDevSaleInfoInVO.devGrdDscntAmt =  "";
	DsDevSaleInfoInVO.chrgPymPosCd =  "";
	DsDevSaleInfoInVO.insttItrr =  "";
	DsDevSaleInfoInVO.cntcDvCd =  "";
	DsDevSaleInfoInVO.agmtPrnplInfo1Amt =  "";
	DsDevSaleInfoInVO.agmtPrnplInfo2Amt =  "";
	DsDevSaleInfoInVO.mnthInsttInfo1Amt =  "";
	DsDevSaleInfoInVO.mnthInsttInfo2Amt =  "";
	DsDevSaleInfoInVO.toinsttFee =  "";
	DsDevSaleInfoInVO.slt1ToinsttFee =  "";
	DsDevSaleInfoInVO.slt2ToinsttFee =  "";
	DsDevSaleInfoInVO.slt1MnthBillAmt =  "";
	DsDevSaleInfoInVO.slt2MnthBillAmt =  "";
	DsDevSaleInfoInVO.dataShrAddDscntCd =  "";
	DsDevSaleInfoInVO.rsvSaleNo =  "";
	DsDevSaleInfoInVO.rsvFnshDataYn =  "";
	DsDevSaleInfoInVO.AgDcCntcMnbr =  "";
	DsDevSaleInfoInVO.jncoCpnTotAmt =  "";

	DsEntrOnlineSaleInVO.entrRsvRcptSeqno = mvnoRcptNo;
	DsEntrOnlineSaleInVO.entrRsvProdCd =  "LZP0000001";
	DsEntrOnlineSaleInVO.mrktCd =  "KBM";
	DsEntrOnlineSaleInVO.workSttsCd =  "I";
	DsEntrOnlineSaleInVO.stepMnpCd =  "";
	DsEntrOnlineSaleInVO.stepMnpChngDttm =  "";
	DsEntrOnlineSaleInVO.stepCustCd = (step == '9') ? "9" : "";
	DsEntrOnlineSaleInVO.stepCustChngDttm =  "";
	DsEntrOnlineSaleInVO.stepSvcCd =  "";
	DsEntrOnlineSaleInVO.stepSvcChngDttm =  "";
	DsEntrOnlineSaleInVO.stepDevcCd =  "";
	DsEntrOnlineSaleInVO.stepDevcChngDttm =  "";
	DsEntrOnlineSaleInVO.stepCustAgrmtYn =  "";
	DsEntrOnlineSaleInVO.stepCustAgrmtChngDttm =  "";
	DsEntrOnlineSaleInVO.entrRqstChnlKdCd =  "1";
	DsEntrOnlineSaleInVO.prssEvntCd =  "MNP";
	DsEntrOnlineSaleInVO.rgstDt =  "";
	DsEntrOnlineSaleInVO.entrRsvDttm =  "";
	DsEntrOnlineSaleInVO.prssDt =  "";
	DsEntrOnlineSaleInVO.prssMemo =  "";
	DsEntrOnlineSaleInVO.prssRsultCd =  "";
	DsEntrOnlineSaleInVO._workDv =  (step == '9') ? "U"   : "C";
	DsEntrOnlineSaleInVO._jobBiz =  (step == '9') ? "CUS" : "POS";
	DsEntrOnlineSaleInVO.inputAddJson =  "";
	DsEntrOnlineSaleInVO.nextOperatorId =  "1100000288";

	DsEntrBySvcInfoInVO.cnvgEntrNo = "",
	DsEntrBySvcInfoInVO.cnvgTypCd = "",
	DsEntrBySvcInfoInVO.cnvgSvcCd = "",
	DsEntrBySvcInfoInVO.lteFrstDscntDvVlue = "",
	DsEntrBySvcInfoInVO.smlsStlmUseDenyYn = "",
	DsEntrBySvcInfoInVO.mbrshCardRqstYn = "",
	DsEntrBySvcInfoInVO.trmnsAvrDataUsage = "",
	DsEntrBySvcInfoInVO.trmnsAvrVceUsage = "",
	DsEntrBySvcInfoInVO.trmnsAvrSmsUsage = "",
	DsEntrBySvcInfoInVO.lmtStlmUseDenyYn = "",
	DsEntrBySvcInfoInVO.phncarEntrYn = "",
	DsEntrBySvcInfoInVO.phncarEntrKdCd = "",
	DsEntrBySvcInfoInVO.svcCd = "",
	DsEntrBySvcInfoInVO.ppNm = "",
	DsEntrBySvcInfoInVO.inputAddJson = "",
	DsEntrBySvcInfoInVO.nextOperatorId = "1100000288";

	DsRsvMnpInfoInVO.entrRsvProdCd = "";
	DsRsvMnpInfoInVO.mnpBfrEnpr = "";
	DsRsvMnpInfoInVO.autnItemDvCd = "";
	DsRsvMnpInfoInVO.autnItemNo = "";
	DsRsvMnpInfoInVO.mnpTelno = "";
	DsRsvMnpInfoInVO.apcntNm = "";
	DsRsvMnpInfoInVO.apcntPersNo = "";
	DsRsvMnpInfoInVO.apcntTelno = "";
	DsRsvMnpInfoInVO.apcntHpno = "";
	DsRsvMnpInfoInVO.mnpHldrDvCd = "";
	DsRsvMnpInfoInVO.mnpHldrPersNo = "";
	DsRsvMnpInfoInVO.mnpHldrNm = "";
	DsRsvMnpInfoInVO.mnpHldrTelno = "";
	DsRsvMnpInfoInVO.mnpHldrHpno = "";
	DsRsvMnpInfoInVO.mnpHldrAutnOrgnzCd = "";
	DsRsvMnpInfoInVO.mnpHldrAutnMthdCd = "";
	DsRsvMnpInfoInVO.mnpHldrAutnDttm = "";
	DsRsvMnpInfoInVO.mnpHldrAutnSucsYn = "";
	DsRsvMnpInfoInVO.mnpHldrAutnReqstNo = "";
	DsRsvMnpInfoInVO.mnpHldrAutnRspnsNo = "";
	DsRsvMnpInfoInVO.ebcstReturnYn = "";
	DsRsvMnpInfoInVO.rfndBankCd = "";
	DsRsvMnpInfoInVO.rfndBandAcctNo = "";
	DsRsvMnpInfoInVO.urdmAmtOfstDvCd = "";
	DsRsvMnpInfoInVO.contcPsblTmDvCd = "";
	DsRsvMnpInfoInVO.mnpHldrBsRegNo = "";
	DsRsvMnpInfoInVO.billCntcInfoKdCd = "";
	DsRsvMnpInfoInVO.billCntcInfo1 = "";
	DsRsvMnpInfoInVO.totnpayAmt = "";
	DsRsvMnpInfoInVO.upaidPrssDvCd = "";
	DsRsvMnpInfoInVO.insttSaleAmt = "";
	DsRsvMnpInfoInVO.insttDvCd = "";
	DsRsvMnpInfoInVO.pymAsertAmt = "";
	DsRsvMnpInfoInVO.pymAsertAmtPymDt = "";
	DsRsvMnpInfoInVO.pymAsertAmtPymMthdCd = "";
	DsRsvMnpInfoInVO.msgChasNo = "";
	DsRsvMnpInfoInVO.inputAddJson = "";
	DsRsvMnpInfoInVO.nextOperatorId = "1100000288";

	DsAtrctInfoInVO.userId = "";
	DsAtrctInfoInVO.userNm = "";
	DsAtrctInfoInVO.intgUserId = "";
	DsAtrctInfoInVO.userOrgCd = "";
	DsAtrctInfoInVO.userLginIp = "";
	DsAtrctInfoInVO.extduYn = "Y";
	DsAtrctInfoInVO.mrktCd = "KBM";
	DsAtrctInfoInVO.userDlrCd = "315397";
	DsAtrctInfoInVO.userDlrGrpCd = "";
	DsAtrctInfoInVO.userDlrNm = "KB국민은행지점";
	DsAtrctInfoInVO.saleEmpno = "";
	DsAtrctInfoInVO.entrEmpno = "";
	DsAtrctInfoInVO.posCd = $("#posCd").val();
	DsAtrctInfoInVO.workDlrCd = "315397";
	DsAtrctInfoInVO.pmEmpno = "";
	DsAtrctInfoInVO.intgBizCd = "";
	DsAtrctInfoInVO.atrctDvCd = "";
	DsAtrctInfoInVO.atrctDt = "";
	DsAtrctInfoInVO.indcDvCd = "";
	DsAtrctInfoInVO.indcId = "";
	DsAtrctInfoInVO.inputAddJson = "";
	DsAtrctInfoInVO.nextOperatorId = "1100000288";

	DsAsgnNoListInVO.entrRsvProdCd = "";
	DsAsgnNoListInVO.entrRsvSvcCd = "";
	DsAsgnNoListInVO.asgnDscntSrlno = "";
	DsAsgnNoListInVO.asgnDscntTelno = "";
	DsAsgnNoListInVO.dscntSvcCd = "";
	DsAsgnNoListInVO._rowStatus = "";
	DsAsgnNoListInVO.inputAddJson = "";
	DsAsgnNoListInVO.nextOperatorId = "1100000288";

	DsEntrRsvBySvcListInVO.entrRsvProdCd = "";
	DsEntrRsvBySvcListInVO.entrRsvSvcCd = "";
	DsEntrRsvBySvcListInVO.svcKdCd = "";
	DsEntrRsvBySvcListInVO.svcLvlCd = "";
	DsEntrRsvBySvcListInVO.ndblCvrtSvcCd = "";
	DsEntrRsvBySvcListInVO.svcNm = "";
	DsEntrRsvBySvcListInVO._rowStatus = "";
	DsEntrRsvBySvcListInVO.inputAddJson = "";
	DsEntrRsvBySvcListInVO.nextOperatorId = "1100000288";

	DsCustInfoInVO.hldrCustNo =  custNo;
	DsCustInfoInVO.rlusrCustNo = custNo;
	DsCustInfoInVO.billAcntNo =  billAcntNo;
	DsCustInfoInVO.welfCommDscntRqstYn = "";
	DsCustInfoInVO.lawcAgntCustNo = (step == '9') ? $("#legalRprsnCustNo").val() : "";
	DsCustInfoInVO.pymDepoCd = "";
	DsCustInfoInVO.pymDepoCustCd = "";
	DsCustInfoInVO.hldrKdCd = "";
	DsCustInfoInVO.rqmnKdCd = "";
	DsCustInfoInVO.ocrSeqno = "";
	DsCustInfoInVO.oneidEntrRqstYn = "";
	DsCustInfoInVO.oneidEmailAddr = "";
	DsCustInfoInVO.fmlyDvCd = $("#legalRprsnRel").val();
	DsCustInfoInVO.prodRqstNo = prodRqstNo;
	DsCustInfoInVO.roadMgmtNo = "";
	DsCustInfoInVO.inputAddJson = "";
	DsCustInfoInVO.nextOperatorId = "1100000288";

	DsJncoCpnInfoInVO.jncoCpnNo = "";
	DsJncoCpnInfoInVO.jncoCpnAmt = "";
	DsJncoCpnInfoInVO.nextOperatorId = "1100000288";

	RequestBody.DsEntrInfoInVO         = DsEntrInfoInVO        ;
	RequestBody.DsConfldsInVO          = DsConfldsInVO         ;
	RequestBody.DsDevSaleInfoInVO      = DsDevSaleInfoInVO     ;
	RequestBody.DsEntrOnlineSaleInVO   = DsEntrOnlineSaleInVO  ;
	RequestBody.DsEntrBySvcInfoInVO    = DsEntrBySvcInfoInVO   ;
	RequestBody.DsRsvMnpInfoInVO       = DsRsvMnpInfoInVO      ;
	RequestBody.DsAtrctInfoInVO        = DsAtrctInfoInVO       ;
	RequestBody.DsAsgnNoListInVO       = DsAsgnNoListInVO      ;
	RequestBody.DsEntrRsvBySvcListInVO = DsEntrRsvBySvcListInVO;
	RequestBody.DsCustInfoInVO         = DsCustInfoInVO        ;
	RequestBody.DsJncoCpnInfoInVO      = DsJncoCpnInfoInVO     ;

	RequestRecord.RequestBody = RequestBody;

	SaveEntrSaleOnlineInfoEsb.RequestRecord = RequestRecord;

	data.SaveEntrSaleOnlineInfoEsb = SaveEntrSaleOnlineInfoEsb;
	base.data = data;
	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/SB803',
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
			console.log(response);

			var resultCode  = "";
			var resultCode1 = "";


			try{
				resultCode  = response.resultCode;
				resultCode1 = response.data.SaveEntrSaleOnlineInfoEsbResponse.ResponseRecord.ResponseBody.ResultInfoOutVO.resultCode;
				mvnoRcptNo  = response.data.SaveEntrSaleOnlineInfoEsbResponse.ResponseRecord.ResponseBody.ResultInfoOutVO.entrRsvRcptSeqno;

			}catch(e){

			}
			console.log('sendSB803 resultCode='+resultCode+' resultCode1='+resultCode1+' mvnoRcptNo='+mvnoRcptNo);
			if(resultCode == 'N0000' && resultCode1 == '0000'){
				if(step != '9'){
					$('#mvnoRcptNo').val(mvnoRcptNo);
					sendCM802();//고객마스터유형별 상세조회
				}else{
					sendSB815();
				}
			}else if(resultCode != 'N0000'){
				popalarm2(response.resultMessage, "info", false,"",goBack);
			}else{
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
			}

		},
		error: function(request,status,error){
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
		}
	});//end ajax

}


//고객마스터 유형별 상세조회
function sendCM802(){
	var base = new Object();
	var data = new Object();

	var RetrieveCustomerInfoByCustList = new Object();

	var RequestRecord = new Object();
	var RequestBody   = new Object();

	var DataInVO  = new Object();
	var UserInfoInVO = new Object();

	base.serviceId = "CM802";

    DataInVO.retType = "M";
    DataInVO.custrnmNo = $("#regNo").val();

	if($("#custTp").val() == "II"){
		DataInVO.bsRegNo = "";
	    DataInVO.custDvCd = "I";
	    DataInVO.custKdCd = "II";
	}
	else if($("#custTp").val() == "GEF"){
		DataInVO.bsRegNo = $("#bizRegNo").val();
	    DataInVO.custDvCd = "G";
	    DataInVO.custKdCd = "GEF";
	}
	else if($("#custTp").val() == "IFX"){
		DataInVO.bsRegNo = "";
	    DataInVO.custDvCd = "I";
	    DataInVO.custKdCd = "IFX";
	}

    DataInVO.custNo = "";
    DataInVO.userId = "";
    DataInVO.nextOperatorId = "1100000288";

    UserInfoInVO.userId = "";
    UserInfoInVO.userNm = "";
    UserInfoInVO.intgUserId = "";
    UserInfoInVO.userOrgCd = "";
    UserInfoInVO.userLginIp = "";
    UserInfoInVO.extduYn = "Y";
    UserInfoInVO.mrktCd = "KBM";
    UserInfoInVO.userDlrCd = "315397";
    UserInfoInVO.userDlrGrpCd = "";
    UserInfoInVO.userDlrNm = "KB국민은행지점";
    UserInfoInVO.nextOperatorId = "1100000288";


 	RequestBody.DataInVO  = DataInVO;
 	RequestBody.UserInfoInVO = UserInfoInVO;

	RequestRecord.RequestBody = RequestBody;

	RetrieveCustomerInfoByCustList.RequestRecord = RequestRecord;

	data.RetrieveCustomerInfoByCustList = RetrieveCustomerInfoByCustList;

	base.data = data;
	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/CM802',
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

			var resultCode    = "";
			var resultMessage = "";
			var custNo		  = "";
			var msgCd		  = "";
			var msgTxt		  = "";
			var uCustNm       = "";

			try{
				resultCode    = response.resultCode;
				msgCd         = response.data.RetrieveCustomerInfoByCustListResponse.ResponseRecord.ResponseBody.DsMsgOutVO.msgCd;
				msgTxt        = response.data.RetrieveCustomerInfoByCustListResponse.ResponseRecord.ResponseBody.DsMsgOutVO.msgTxt;
				custNo        = response.data.RetrieveCustomerInfoByCustListResponse.ResponseRecord.ResponseBody.DsCstInfoOutVO[0].custNo;
				uCustNm        = response.data.RetrieveCustomerInfoByCustListResponse.ResponseRecord.ResponseBody.DsCstInfoOutVO[0].custNm;

				$("#custNo").val(custNo);
			}catch(e){
				resultMessage = response.resultMessage;
			}
			console.log('CM802 resultCode='+resultCode+ " custNo=" + custNo + " msgCd=" + msgCd + " msgTxt=" + msgTxt);
			console.log('CM802 name :: kb='+$("#custNm").val()+" | ucube="+uCustNm);

			if(resultCode == 'N0000' && msgCd == '00'){
				if($("#custNm").val() != "" && uCustNm != $("#custNm").val()){//고객정보는 존재하나 이름이 다름
					sendCM805('N');//고객정보 수정
				}
				else{
					sendCM803();
				}
			}else if(resultCode == 'N0000' && msgCd == '01'){//고객정보 미존재
				sendCM805();//고객정보 채번 수정
			}else if(resultCode !== 'N0000'){
				popalarm2(resultMessage, "info", false,"",goBack);
			}else{
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
			}

		},
		error: function(request,status,error){
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
		}
	});//end ajax
}


//고객기본정보 조회
function sendCM803(){
	var base = new Object();
	var data = new Object();

	var RetrieveCustInfo = new Object();
	var RequestRecord = new Object();
	var RequestBody   = new Object();
	var DsReqInVO  = new Object();

	base.serviceId = "CM803";

	DsReqInVO.custNo = $("#custNo").val();
	DsReqInVO.nextOperatorId = "1100000288";

 	RequestBody.DsReqInVO  = DsReqInVO;
	RequestRecord.RequestBody = RequestBody;
	RetrieveCustInfo.RequestRecord = RequestRecord;
	data.RetrieveCustInfo = RetrieveCustInfo;
	base.data = data;
	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/CM803',
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

			var resultCode    = "";
			var resultMessage = "";
			var custAddrSeqno = "";

			try{
				resultCode    = response.resultCode;
				custNo 		  = response.data.RetrieveCustInfoResponse.ResponseRecord.ResponseBody.DsCustInfoOutVO[0].custNo;
				custAddrSeqno = response.data.RetrieveCustInfoResponse.ResponseRecord.ResponseBody.DsCustInfoOutVO[0].custAddrSeqno;
				$("#custAddrSeqno").val(custAddrSeqno);
			}catch(e){
				resultMessage = response.resultMessage;
			}
			console.log('CM803 resultCode = ' + resultCode + ' custNo = ' + custNo + ' custAddrSeqno=' + custAddrSeqno);

			if(resultCode == 'N0000' ){
				$("#custNo").val(custNo);
				sendCM804();//스마트개통 고객인증및 사전체크
			}else if(resultCode !== 'N0000'){
				popalarm2(resultMessage, "info", false,"",goBack);
			}else{
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
			}

		},
		error: function(request,status,error){
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
		}
	});//end ajax
}


//스마트개통 고객인증및 사전체크
function sendCM804(){

	var json_obj = new Object();

	var base = new Object();
	var data = new Object();
	var CheckSmrtCustomerInfo = new Object();
	var RequestRecord = new Object();
	var RequestBody = new Object();
	var ReqDataInVO = new Object();
	var UserInfoInVO = new Object();
	base.serviceId = "CM804";

	var regNo  = $("#regNo").val() ;//$("#regNoH").val().replace(/-/g,'');
	var custNm = $("#custNm").val();

	var legalRprsnYn = $("#legalRprsnYn").val();

	if($("#custTp").val() == "II"){
		ReqDataInVO.custDvCd = "I";
		ReqDataInVO.custKdCd = "II";
		ReqDataInVO.bsRegNo = "";
		ReqDataInVO.chkFrgnCustRnm = "N";
		ReqDataInVO.chkCorpClose = "N";
		ReqDataInVO.preCustRnmFlag = "";
	}
	else if($("#custTp").val() == "GEF"){
		ReqDataInVO.custDvCd = "G";
		ReqDataInVO.custKdCd = "GEF";
		ReqDataInVO.bsRegNo = $("#bizRegNo").val();
		ReqDataInVO.chkFrgnCustRnm = "N";
		ReqDataInVO.chkCorpClose = "Y";
		ReqDataInVO.preCustRnmFlag = "";
	}
	else if($("#custTp").val() == "IFX"){
		ReqDataInVO.custDvCd = "I";
		ReqDataInVO.custKdCd = "IFX";
		ReqDataInVO.bsRegNo = "";
		ReqDataInVO.chkFrgnCustRnm = "Y";
		ReqDataInVO.chkCorpClose = "N";
		ReqDataInVO.preCustRnmFlag = "P";
	}

	ReqDataInVO.chkCustRnm = "Y";
	ReqDataInVO.chkVerify = "Y";
	ReqDataInVO.chkKaitSpam = "N";
	ReqDataInVO.chkKisCBScoreCredit = "Y";
	ReqDataInVO.chkInsttYn = "N";
	ReqDataInVO.chkBlList = "Y";
	ReqDataInVO.chkSbgnCnt = "Y";
	ReqDataInVO.chkCorpInsr = "N";
	ReqDataInVO.chkWelfStatus = "Y";
	ReqDataInVO.chkExpyCntYn = "";
	ReqDataInVO.chkReJoinCntYn = "";
	ReqDataInVO.chkNoReFundYn = "";

	ReqDataInVO.custNm    = custNm; //ReqDataInVO.custNm    = (legalRprsnYn == 'Y') ? $("#legalRprsnNm").val()    : custNm; //2020.04.17 CM804는 미성년자의 정보로 조회하게 변경
	ReqDataInVO.custrnmNo = regNo;  //ReqDataInVO.custrnmNo = (legalRprsnYn == 'Y') ? $("#legalRprsnRegNo").val() : regNo; //2020.04.17 CM804는 미성년자의 정보로 조회하게 변경
	ReqDataInVO.indvCustRnmKdCd = "I";
	ReqDataInVO.custNo = "";
	ReqDataInVO.custRealActRsn = "CNM";
	ReqDataInVO.reduceCode = "";
	ReqDataInVO.suplPersNo = "";
	ReqDataInVO.suplPersNm = "";
	ReqDataInVO.ppsYn = "";
	ReqDataInVO.nextOperatorId = "1100000288";


	UserInfoInVO.userId = "";
	UserInfoInVO.userNm = "";
	UserInfoInVO.intgUserId = "";
	UserInfoInVO.userOrgCd = "";
	UserInfoInVO.userLginIp = "";
	UserInfoInVO.extduYn = "";
	UserInfoInVO.mrktCd = "KBM";
	UserInfoInVO.userDlrCd = "315397";
	UserInfoInVO.userDlrGrpCd = "";
	UserInfoInVO.userDlrNm = "KB국민은행지점";
	UserInfoInVO.nextOperatorId = "1100000288";

	RequestBody.ReqDataInVO = ReqDataInVO;
	RequestBody.UserInfoInVO = UserInfoInVO;
	RequestRecord.RequestBody = RequestBody;

	CheckSmrtCustomerInfo.RequestRecord = RequestRecord;
	data.CheckSmrtCustomerInfo = CheckSmrtCustomerInfo;
	base.data = data;
	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/CM804',
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
			if(response.resultCode == 'N0000'){
				var errCnt = 0;

				try{
					var DsCustRnmRsltOutVO = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsCustRnmRsltOutVO;
					errCnt += (isEmpty(DsCustRnmRsltOutVO)) ? 0 : Number(DsCustRnmRsltOutVO.errCnt);
				}catch(e){			}
				try{
					var DsCBScoreRsltOutVO = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsCBScoreRsltOutVO;
					errCnt += (isEmpty(DsCBScoreRsltOutVO)) ? 0 : Number(DsCBScoreRsltOutVO.errCnt);
				}catch(e){			}
				try{
					var DsLverifyOutVO     = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsLverifyOutVO;
					errCnt += (isEmpty(DsLverifyOutVO))     ? 0 : Number(DsLverifyOutVO.errCnt);
				}catch(e){			}
				try{
					var DsSbgnRsltOutVO    = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsSbgnRsltOutVO;
					errCnt += (isEmpty(DsSbgnRsltOutVO))    ? 0 : Number(DsSbgnRsltOutVO.errCnt);
				}catch(e){			}
				try{
					var DsBlRsltOutVO      = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsBlRsltOutVO;
					errCnt += (isEmpty(DsBlRsltOutVO))      ? 0 : Number(DsBlRsltOutVO.errCnt);
				}catch(e){			}
				try {
					var DsCorpCloseRsltOutVO      = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsCorpCloseRsltOutVO;
					errCnt += (isEmpty(DsCorpCloseRsltOutVO))      ? 0 : Number(DsCorpCloseRsltOutVO.errCnt);
				} catch(e) {}
				console.log("CM804 response="+ JSON.stringify(response));
				console.log("CM804 errCnt="+ errCnt);


				if(errCnt > 0){
					popalarm2("가입 신청이 불가능합니다.<br/>자세한 가입제한 사유는 고객센터(1522-9999)로 문의주세요.", "info", false,"",closePopup);
				}else{
					sendCM806();//신분증 진위 검증
				}

			}else if(response.resultCode == 'E0000'){
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
			}else{
				popalarm2("신분증 정보를 정확히 입력해주세요.", "info", false,"",goBack);
			}

		},
		error: function(request,status,error){
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
		}
	});//end ajax
}

//스마트개통 고객정보 등록 및 수정
function sendCM805(){
	var base = new Object();
	var data = new Object();

	var CreateSmrtCustomerInfo = new Object();

	var RequestRecord = new Object();
	var RequestBody   = new Object();

	var DsLawAgntInVO = new Object();
	var UserInfoInVO  = new Object();
	var DsCustInfoInVO  = new Object();

	base.serviceId = "CM805";

	var regNo  = $("#regNo").val() ;
	var custNm = $("#custNm").val();

	if($("#custTp").val() == "II"){
		custNm = $("#custNm").val();
		DsCustInfoInVO.custDvCd = "I";
	    DsCustInfoInVO.custKdCd = "II";
	    DsCustInfoInVO.custNm = custNm;
	    DsCustInfoInVO.bsRegNo = "";
	    DsCustInfoInVO.bizCompNm = "";
	    DsCustInfoInVO.stayTermStartDt = "";
	    DsCustInfoInVO.stayTermEndDt = "";
	    DsCustInfoInVO.stayLcnsCd = "";
	}
	else if($("#custTp").val() == "GEF"){
		DsCustInfoInVO.custDvCd = "G";
	    DsCustInfoInVO.custKdCd = "GEF";
	    DsCustInfoInVO.custNm = $("#repNm").val();//($("#repNm").val() == '') ? $("#custNm").val() : $("#repNm").val();
	    DsCustInfoInVO.bsRegNo = $("#bizRegNo").val();
	    DsCustInfoInVO.bizCompNm = $("#acntNm").val();
	    DsCustInfoInVO.stayTermStartDt = "";
	    DsCustInfoInVO.stayTermEndDt = "";
	    DsCustInfoInVO.stayLcnsCd = "";

	}
	else if($("#custTp").val() == "IFX"){
		DsCustInfoInVO.custDvCd = "I";
	    DsCustInfoInVO.custKdCd = "IFX";
	    DsCustInfoInVO.custNm = custNm;
	    DsCustInfoInVO.bsRegNo = "";
	    DsCustInfoInVO.bizCompNm = "";
	    DsCustInfoInVO.stayTermStartDt = $("#foreignerStrtDt").val();
	    DsCustInfoInVO.stayTermEndDt = $("#foreignerExpiratDt").val();
	    DsCustInfoInVO.stayLcnsCd = $("#foreignerStyCd").val();
	}



	DsLawAgntInVO.custNo = "";
	DsLawAgntInVO.custDvCd = "";
	DsLawAgntInVO.custKdCd = "";
	DsLawAgntInVO.custNm = "";
	DsLawAgntInVO.custrnmNo = "";
	DsLawAgntInVO.bsRegNo = "";
	DsLawAgntInVO.indvCustRnmKdCd = "";
	DsLawAgntInVO.custTel = "";
	DsLawAgntInVO.custAddrZip = "";
	DsLawAgntInVO.custVilgAbvAddr = "";
	DsLawAgntInVO.custVilgBlwAddr = "";
	DsLawAgntInVO.ntnltCd = "";
	DsLawAgntInVO.psprAutnDt = "";
	DsLawAgntInVO.stayTermStartDt = "";
	DsLawAgntInVO.stayTermEndDt = "";
	DsLawAgntInVO.stayLcnsCd = "";
	DsLawAgntInVO.custBday = "";
	DsLawAgntInVO.nextOperatorId = "1100000288";

	UserInfoInVO.userId = "";
	UserInfoInVO.userNm = "";
	UserInfoInVO.intgUserId = "";
	UserInfoInVO.userOrgCd = "";
	UserInfoInVO.userLginIp = "";
	UserInfoInVO.extduYn = "Y";
	UserInfoInVO.mrktCd = "KBM";
	UserInfoInVO.userDlrCd = "315397";
	UserInfoInVO.userDlrGrpCd = "315397";
	UserInfoInVO.userDlrNm = "KB국민은행지점";
	UserInfoInVO.nextOperatorId = "1100000288";

	DsCustInfoInVO.custNo = ($("#custNo").val() == '') ? "" : $("#custNo").val();
	DsCustInfoInVO.custrnmNo = regNo;
	DsCustInfoInVO.indvCustRnmKdCd = "";
	DsCustInfoInVO.custTel = getCtnFormat($("#cellPhnNo").val());
	DsCustInfoInVO.custAddrZip = $("#dlvrPstNo").val();
	DsCustInfoInVO.custVilgAbvAddr = $("#dlvrBassAddr").val();
	DsCustInfoInVO.custVilgBlwAddr = $("#dlvrDtlAddr").val();
	DsCustInfoInVO.ntnltCd = "";
	DsCustInfoInVO.psprAutnDt = "";
	DsCustInfoInVO.youthYn = "";
	DsCustInfoInVO.custBday = "";
	DsCustInfoInVO.nextOperatorId = "1100000288";
	DsCustInfoInVO.sohoInkdCd = "";
	DsCustInfoInVO.seempDivsCd = "";

	RequestBody.DsLawAgntInVO  = DsLawAgntInVO;
	RequestBody.UserInfoInVO   = UserInfoInVO;
	RequestBody.DsCustInfoInVO = DsCustInfoInVO;


	RequestRecord.RequestBody = RequestBody;

	CreateSmrtCustomerInfo.RequestRecord = RequestRecord;

	data.CreateSmrtCustomerInfo = CreateSmrtCustomerInfo;

	base.data = data;
	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/CM805',
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
			console.log(response);

			var resultCode    = "";
			var resultMessage = "";
			var rlstMsg		  = "";
			var rlstCd		  = "";
			var custNo = "";

			try{
				resultCode    = response.resultCode;
				resultMessage = response.ResultMessage;
				rlstMsg       = response.data.CreateSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsRsltOutVO.rlstMsg;
				rlstCd        = response.data.CreateSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsRsltOutVO.rlstCd;
				custNo        = response.data.CreateSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsRsltOutVO.custNo;
			}catch(e){
				resultMessage = response.resultMessage;
			}
			console.log('CM805 resultCode='+resultCode+ + " rlstMsg=" + rlstMsg + " rlstCd=" + rlstCd);

			if(resultCode == 'N0000' && rlstCd == '00'){
				$("#custNo").val(custNo);
				sendCM803();//고객기본정보조회
			}else if(resultCode !== 'N0000'){
				popalarm2(resultMessage, "info", false,"",goBack);
			}else{
				popalarm2("[CM805] 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
			}

		},
		error: function(request,status,error){
			popalarm2("[CM805] 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
		}
	});//end ajax
}

//스마트개통 청구납부인증 및 체크
function sendCM808(){
	var base = new Object();
	var data = new Object();

	var CheckSmrtBillPymAcnt = new Object();
	var RequestRecord = new Object();
	var RequestBody = new Object();
	var DsPymAcntInVO = new Object();
	var DsBilAcntInVO = new Object();
	var UserInfoInVO  = new Object();

	base.serviceId = "CM808";

	var legalRprsnYn = $("#legalRprsnYn").val();
	var regNo = (legalRprsnYn == 'Y') ? $("#legalRprsnRegNo").val() : $("#regNo").val();//fnUnSign($("#regNoH").val()).replace(/-/g,'');
	var acntOwnrNo      = regNo.substr(0,6);
	var bankAcntNo      = "";
	var bankCd          = "";
	var bankNm          = "";
	var cardNo          = "";
	var cardValdEndYymm = "";

	var custNm  = (legalRprsnYn == 'Y') ? $("#legalRprsnNm").val() : $("#custNm").val();
    var cdcmpCd = $("#cardCorpCd").val();
    var cdcmpNm = "";//$("#cardCorpNm").val();
    var custNo  = (legalRprsnYn == 'Y') ? $("#legalRprsnCustNo").val() : $("#custNo").val();
	var pymMthdCd = "";
	var pymMthdNm = "";
	var billEmailAddr = ($('#emad').val().trim() == '') ? "1" : $('#emad').val();
	pymMthdCd = $("#pymMthd").val();

	if(pymMthdCd == 'CM'){
		bankCd     = cdcmpCd;//국민은행
		bankNm     = $("#cardCorpNm").val();
		bankAcntNo = $('#cardNo').val();
		pymMthdNm  = "은행자동이체";
	}else{
	   	cardNo    = $('#cardNo').val();
	   	cardValdEndYymm = $("#cardEffcprd").val().replace('/','');
	   	cardValdEndYymm = "20"+cardValdEndYymm.substr(2,2)+cardValdEndYymm.substr(0,2);
	   	pymMthdNm = "신용카드자동이체";
	}

	if($("#custTp").val() == "II"){
		DsPymAcntInVO.pHldrCustrnmNo = regNo;
        DsPymAcntInVO.custDvCd = "I";
        DsPymAcntInVO.custKdCd = "II";
        DsBilAcntInVO.custDvCd = "I";
        DsBilAcntInVO.custKdCd = "II";
        DsBilAcntInVO.bisCompNm = "";
        DsBilAcntInVO.bisReptNm = "";
        DsBilAcntInVO.bizCompNm = "";
        DsBilAcntInVO.bsRegNo = "";
	}
	else if($("#custTp").val() == "GEF"){
		DsPymAcntInVO.pHldrCustrnmNo = $("#bizRegNo").val();
	    DsPymAcntInVO.custDvCd = "G";
	    DsPymAcntInVO.custKdCd = "GEF";
	    DsBilAcntInVO.custDvCd = "G";
	    DsBilAcntInVO.custKdCd = "GEF";
	    DsBilAcntInVO.bisCompNm = $("#acntNm").val();
	    DsBilAcntInVO.bisReptNm = $("#repNm").val();
	    DsBilAcntInVO.bizCompNm = $("#acntNm").val();
	    DsBilAcntInVO.bsRegNo = $("#bizRegNo").val();
	}
	else if($("#custTp").val() == "IFX"){
		DsPymAcntInVO.pHldrCustrnmNo = regNo;
	    DsPymAcntInVO.custDvCd = "I";
	    DsPymAcntInVO.custKdCd = "IFX";
	    DsBilAcntInVO.custDvCd = "I";
	    DsBilAcntInVO.custKdCd = "IFX";
	    DsBilAcntInVO.bisCompNm = "";
	    DsBilAcntInVO.bisReptNm = "";
	    DsBilAcntInVO.bizCompNm = "";
	    DsBilAcntInVO.bsRegNo = "";
	}

	DsBilAcntInVO.authMobYn = "N";
	DsBilAcntInVO.billAcntNo = "";
	DsBilAcntInVO.billAcntSttsCd = "";
	DsBilAcntInVO.billAddrSeqno = "0";
	DsBilAcntInVO.billCurCd = "KRW";
	DsBilAcntInVO.billEmailAddr = billEmailAddr;
	DsBilAcntInVO.bltxtKdCd = "N";
	DsBilAcntInVO.bltxtKdNm = "";
	DsBilAcntInVO.bltxtRcpProdNo = "";
	DsBilAcntInVO.bltxtRcptManNm = custNm;
	DsBilAcntInVO.bsstNm = "";
	DsBilAcntInVO.cntctPntSeqno = "";
	DsBilAcntInVO.custAddrZip = "";
	DsBilAcntInVO.custAddrZip1 = "";
	DsBilAcntInVO.custAddrZip2 = "";
	DsBilAcntInVO.custNm = custNm;
	DsBilAcntInVO.custNo = custNo;
	DsBilAcntInVO.custVilgAddr = "";
	DsBilAcntInVO.dabvAddr = "";
	DsBilAcntInVO.dnblAddr = "";
	DsBilAcntInVO.emailAuthYn = "Y";
	DsBilAcntInVO.frstWdrwRgstDd = getPayDimension(); //납부요금 1차수,2차수
	DsBilAcntInVO.inkndNm = "";
	DsBilAcntInVO.lguplusNoYn = "";
	DsBilAcntInVO.mrktCd = "KBM";
	DsBilAcntInVO.pChgMode = "N";
	DsBilAcntInVO.ppayAcntYn = "N";
	DsBilAcntInVO.pScMode = "BIAV";
	DsBilAcntInVO.reptNm = "";
	DsBilAcntInVO.scurMailRcpYn = "Y";
	DsBilAcntInVO.selngDvCd = "1";
	DsBilAcntInVO.telno = "";
	DsBilAcntInVO.vatGrntCd = "N";
	DsBilAcntInVO.nextOperatorId = "1100000288";

	DsPymAcntInVO.acntOwnrNo = acntOwnrNo;
	DsPymAcntInVO.actInd = "N";
	DsPymAcntInVO.agntCustNm = "";
	DsPymAcntInVO.agntCustNo = "";
	DsPymAcntInVO.agntCustrnmNo = "";
	DsPymAcntInVO.bankAcntNo = bankAcntNo;
	DsPymAcntInVO.bankCd = bankCd;
	DsPymAcntInVO.bankNm = bankNm;
	DsPymAcntInVO.bltxtKdCd = "N";
	DsPymAcntInVO.cardNo = cardNo;
	DsPymAcntInVO.cardValdEndYymm = cardValdEndYymm;
	DsPymAcntInVO.cdcmpCd = cdcmpCd;
	DsPymAcntInVO.cdcmpNm = cdcmpNm;
	DsPymAcntInVO.cmsYn = "";
	DsPymAcntInVO.cprtDvCd = "";
	DsPymAcntInVO.pCustDvCd = "";
	DsPymAcntInVO.pCustKdCd = "";
	DsPymAcntInVO.pHldrCustNo = custNo;
	DsPymAcntInVO.ppayAcntYn = "N";
	DsPymAcntInVO.prssDlrCd = "";
	DsPymAcntInVO.pymCustNm = custNm;
	DsPymAcntInVO.pymManCustNo = "0";
	DsPymAcntInVO.pymMthdCd = pymMthdCd;
	DsPymAcntInVO.pymMthdNm = pymMthdNm;
	DsPymAcntInVO.nextOperatorId = "1100000288";

	UserInfoInVO.userId = "";
	UserInfoInVO.userNm = "";
	UserInfoInVO.intgUserId = "";
	UserInfoInVO.userOrgCd = "";
	UserInfoInVO.userLginIp = "";
	UserInfoInVO.extduYn = "";
	UserInfoInVO.mrktCd = "KBM";
	UserInfoInVO.userDlrCd = "315397";
	UserInfoInVO.userDlrGrpCd = "";
	UserInfoInVO.userDlrNm = "KB국민은행지점";
	UserInfoInVO.nextOperatorId = "1100000288";


 	RequestBody.DsPymAcntInVO = DsPymAcntInVO;
	RequestBody.DsBilAcntInVO = DsBilAcntInVO;
    RequestBody.UserInfoInVO = UserInfoInVO;

	RequestRecord.RequestBody = RequestBody;

	CheckSmrtBillPymAcnt.RequestRecord = RequestRecord;

	data.CheckSmrtBillPymAcnt = CheckSmrtBillPymAcnt;

	base.data = data;
	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/CM808',
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
			var resultCode = response.resultCode;

			if(resultCode == 'N0000'){
				var cmsYn         = "";
				var cmsAssCode    = "";
				var cmsResultCode = "";
				var succYn		  = "";

				try{
					cmsYn         = response.data.CheckSmrtBillPymAcntResponse.ResponseRecord.ResponseBody.DsPymAuthRsltOutVO.cmsYn;
					cmsAssCode    = response.data.CheckSmrtBillPymAcntResponse.ResponseRecord.ResponseBody.DsPymAuthRsltOutVO.cmsAssCode;
					cmsResultCode = response.data.CheckSmrtBillPymAcntResponse.ResponseRecord.ResponseBody.DsPymAuthRsltOutVO.cmsResultCode;
					succYn		  = response.data.CheckSmrtBillPymAcntResponse.ResponseRecord.ResponseBody.DsCprtCardRgstRsltOutVO.succYn;
				}catch(e){}

				$("#cm808_cmsYn").val(cmsYn);
				$("#cm808_cmsAssCode").val(cmsAssCode);
				$("#cm808_cmsResultCode").val(cmsResultCode);
				$("#cm808_succYn").val(succYn);

				sendCM814();//청구납부저장

			}else{
				if($("#custTp").val() == "GEF"){
					sendCM808_RE();//개인사업자의 납부에러가 난 경우, 개인납부로 한번 더 검증
				}
				else{
					if(pymMthdCd == 'CM'){//계좌
						popalarm2("인증에 실패하였습니다. 계좌정보를 다시 확인해주세요", "info", false,"",goBack);
					}else{
						popalarm2("인증에 실패하였습니다. 신용카드 인증정보를 다시 확인해주세요", "info", false,"",goBack);
					}
				}
			}

		},
		error: function(request,status,error){
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
		}
	});//end ajax
}

//개인사업자의 납부에러가 난 경우, 개인납부로 한번 더 검증체크
function sendCM808_RE(){
	var base = new Object();
	var data = new Object();

	var CheckSmrtBillPymAcnt = new Object();
	var RequestRecord = new Object();
	var RequestBody = new Object();
	var DsPymAcntInVO = new Object();
	var DsBilAcntInVO = new Object();
	var UserInfoInVO  = new Object();

	base.serviceId = "CM808";

	var legalRprsnYn = $("#legalRprsnYn").val();
	var regNo = (legalRprsnYn == 'Y') ? $("#legalRprsnRegNo").val() : $("#regNo").val();//fnUnSign($("#regNoH").val()).replace(/-/g,'');
	var acntOwnrNo      = regNo.substr(0,6);
	var bankAcntNo      = "";
	var bankCd          = "";
	var bankNm          = "";
	var cardNo          = "";
	var cardValdEndYymm = "";

	var custNm  = (legalRprsnYn == 'Y') ? $("#legalRprsnNm").val() : $("#custNm").val();
    var cdcmpCd = $("#cardCorpCd").val();
    var cdcmpNm = "";//$("#cardCorpNm").val();
    var custNo  = (legalRprsnYn == 'Y') ? $("#legalRprsnCustNo").val() : $("#custNo").val();
	var pymMthdCd = "";
	var pymMthdNm = "";
	var billEmailAddr = ($('#emad').val().trim() == '') ? "1" : $('#emad').val();
	pymMthdCd = $("#pymMthd").val();

	if(pymMthdCd == 'CM'){
		bankCd     = cdcmpCd;//국민은행
		bankNm     = $("#cardCorpNm").val();
		bankAcntNo = $('#cardNo').val();
		pymMthdNm  = "은행자동이체";
	}else{
	   	cardNo    = $('#cardNo').val();
	   	cardValdEndYymm = $("#cardEffcprd").val().replace('/','');
	   	cardValdEndYymm = "20"+cardValdEndYymm.substr(2,2)+cardValdEndYymm.substr(0,2);
	   	pymMthdNm = "신용카드자동이체";
	}

	DsPymAcntInVO.pHldrCustrnmNo = regNo;
    DsPymAcntInVO.custDvCd = "I";
    DsPymAcntInVO.custKdCd = "II";
    DsBilAcntInVO.custDvCd = "I";
    DsBilAcntInVO.custKdCd = "II";
    DsBilAcntInVO.bisCompNm = "";
    DsBilAcntInVO.bisReptNm = "";
    DsBilAcntInVO.bizCompNm = "";
    DsBilAcntInVO.bsRegNo = "";

	DsBilAcntInVO.authMobYn = "N";
	DsBilAcntInVO.billAcntNo = "";
	DsBilAcntInVO.billAcntSttsCd = "";
	DsBilAcntInVO.billAddrSeqno = "0";
	DsBilAcntInVO.billCurCd = "KRW";
	DsBilAcntInVO.billEmailAddr = billEmailAddr;
	DsBilAcntInVO.bltxtKdCd = "N";
	DsBilAcntInVO.bltxtKdNm = "";
	DsBilAcntInVO.bltxtRcpProdNo = "";
	DsBilAcntInVO.bltxtRcptManNm = custNm;
	DsBilAcntInVO.bsstNm = "";
	DsBilAcntInVO.cntctPntSeqno = "";
	DsBilAcntInVO.custAddrZip = "";
	DsBilAcntInVO.custAddrZip1 = "";
	DsBilAcntInVO.custAddrZip2 = "";
	DsBilAcntInVO.custNm = custNm;
	DsBilAcntInVO.custNo = custNo;
	DsBilAcntInVO.custVilgAddr = "";
	DsBilAcntInVO.dabvAddr = "";
	DsBilAcntInVO.dnblAddr = "";
	DsBilAcntInVO.emailAuthYn = "Y";
	DsBilAcntInVO.frstWdrwRgstDd = getPayDimension(); //납부요금 1차수,2차수
	DsBilAcntInVO.inkndNm = "";
	DsBilAcntInVO.lguplusNoYn = "";
	DsBilAcntInVO.mrktCd = "KBM";
	DsBilAcntInVO.pChgMode = "N";
	DsBilAcntInVO.ppayAcntYn = "N";
	DsBilAcntInVO.pScMode = "BIAV";
	DsBilAcntInVO.reptNm = "";
	DsBilAcntInVO.scurMailRcpYn = "Y";
	DsBilAcntInVO.selngDvCd = "1";
	DsBilAcntInVO.telno = "";
	DsBilAcntInVO.vatGrntCd = "N";
	DsBilAcntInVO.nextOperatorId = "1100000288";

	DsPymAcntInVO.acntOwnrNo = acntOwnrNo;
	DsPymAcntInVO.actInd = "N";
	DsPymAcntInVO.agntCustNm = "";
	DsPymAcntInVO.agntCustNo = "";
	DsPymAcntInVO.agntCustrnmNo = "";
	DsPymAcntInVO.bankAcntNo = bankAcntNo;
	DsPymAcntInVO.bankCd = bankCd;
	DsPymAcntInVO.bankNm = bankNm;
	DsPymAcntInVO.bltxtKdCd = "N";
	DsPymAcntInVO.cardNo = cardNo;
	DsPymAcntInVO.cardValdEndYymm = cardValdEndYymm;
	DsPymAcntInVO.cdcmpCd = cdcmpCd;
	DsPymAcntInVO.cdcmpNm = cdcmpNm;
	DsPymAcntInVO.cmsYn = "";
	DsPymAcntInVO.cprtDvCd = "";
	DsPymAcntInVO.pCustDvCd = "";
	DsPymAcntInVO.pCustKdCd = "";
	DsPymAcntInVO.pHldrCustNo = custNo;
	DsPymAcntInVO.ppayAcntYn = "N";
	DsPymAcntInVO.prssDlrCd = "";
	DsPymAcntInVO.pymCustNm = custNm;
	DsPymAcntInVO.pymManCustNo = "0";
	DsPymAcntInVO.pymMthdCd = pymMthdCd;
	DsPymAcntInVO.pymMthdNm = pymMthdNm;
	DsPymAcntInVO.nextOperatorId = "1100000288";

	UserInfoInVO.userId = "";
	UserInfoInVO.userNm = "";
	UserInfoInVO.intgUserId = "";
	UserInfoInVO.userOrgCd = "";
	UserInfoInVO.userLginIp = "";
	UserInfoInVO.extduYn = "";
	UserInfoInVO.mrktCd = "KBM";
	UserInfoInVO.userDlrCd = "315397";
	UserInfoInVO.userDlrGrpCd = "";
	UserInfoInVO.userDlrNm = "KB국민은행지점";
	UserInfoInVO.nextOperatorId = "1100000288";


 	RequestBody.DsPymAcntInVO = DsPymAcntInVO;
	RequestBody.DsBilAcntInVO = DsBilAcntInVO;
    RequestBody.UserInfoInVO = UserInfoInVO;

	RequestRecord.RequestBody = RequestBody;

	CheckSmrtBillPymAcnt.RequestRecord = RequestRecord;

	data.CheckSmrtBillPymAcnt = CheckSmrtBillPymAcnt;

	base.data = data;
	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/CM808',
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
			var resultCode = response.resultCode;

			if(resultCode == 'N0000'){
				var cmsYn         = "";
				var cmsAssCode    = "";
				var cmsResultCode = "";
				var succYn		  = "";

				try{
					cmsYn         = response.data.CheckSmrtBillPymAcntResponse.ResponseRecord.ResponseBody.DsPymAuthRsltOutVO.cmsYn;
					cmsAssCode    = response.data.CheckSmrtBillPymAcntResponse.ResponseRecord.ResponseBody.DsPymAuthRsltOutVO.cmsAssCode;
					cmsResultCode = response.data.CheckSmrtBillPymAcntResponse.ResponseRecord.ResponseBody.DsPymAuthRsltOutVO.cmsResultCode;
					succYn		  = response.data.CheckSmrtBillPymAcntResponse.ResponseRecord.ResponseBody.DsCprtCardRgstRsltOutVO.succYn;
				}catch(e){}

				$("#cm808_cmsYn").val(cmsYn);
				$("#cm808_cmsAssCode").val(cmsAssCode);
				$("#cm808_cmsResultCode").val(cmsResultCode);
				$("#cm808_succYn").val(succYn);

				sendCM814();//청구납부저장

			}else{
				if(pymMthdCd == 'CM'){//계좌
					popalarm2("인증에 실패하였습니다. 계좌정보를 다시 확인해주세요", "info", false,"",goBack);
				}else{
					popalarm2("인증에 실패하였습니다. 신용카드 인증정보를 다시 확인해주세요", "info", false,"",goBack);
				}

			}

		},
		error: function(request,status,error){
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
		}
	});//end ajax
}



//스마트개통 MNP 사전동의요청
function sendSB808(){

	var base = new Object();
	var data = new Object();

	var CreateSmrtMnpPriorConBD = new Object();

	var RequestRecord = new Object();
	var RequestBody = new Object();

	var DsAutnRqstInVO = new Object();

	base.serviceId = "SB808";

	DsAutnRqstInVO.ctn          = $("#mtelNo").val();
	DsAutnRqstInVO.mnpBfrEnprCd = $("#mcoCd").val();
	/* 번호이동시 호출하는 번호이동고객유형코드(mnpCustKdCd)
	01 : 일반
	02 : 개인사업자
	03 : 일반법인
	04 : 공공기관
	*/
	if($("#custTp").val() == "II"){
		DsAutnRqstInVO.mnpCustKdCd  = "01";
		DsAutnRqstInVO.custBsRegNo  = "";
		DsAutnRqstInVO.hldrCustNm   = $("#custNm").val();
	}
	else if($("#custTp").val() == "GEF"){
		DsAutnRqstInVO.mnpCustKdCd  = "02";
		DsAutnRqstInVO.custBsRegNo = $("#bizRegNo").val();
		DsAutnRqstInVO.hldrCustNm   = $("#repNm").val();
	}
	else if($("#custTp").val() == "IFX"){
		DsAutnRqstInVO.mnpCustKdCd  = "01";
		DsAutnRqstInVO.custBsRegNo  = "";
		DsAutnRqstInVO.hldrCustNm   = $("#custNm").val();
	}
	else{
		DsAutnRqstInVO.mnpCustKdCd  = "01";
		DsAutnRqstInVO.custBsRegNo  = "";
		DsAutnRqstInVO.hldrCustNm   = $("#custNm").val();
	}

	DsAutnRqstInVO.custPersNo   = $("#regNo").val();
	DsAutnRqstInVO.frgnrYn      = "";
	DsAutnRqstInVO.autnItemDvCd = getAuthMthd(); //번호이동구분코드
	DsAutnRqstInVO.autnItemNo   = $("#npAuthKey").val(); //번호이동인증값
	DsAutnRqstInVO.cashPymAmt   = "";
	DsAutnRqstInVO.mnpKdCd      = "KBM";
	DsAutnRqstInVO.insttEntrYn  = "";
	DsAutnRqstInVO.custCtplc    = "";
	DsAutnRqstInVO.rqmnNm       = "";
	DsAutnRqstInVO.rqmnPersNo   = "";
	DsAutnRqstInVO.hldrDrngRelsCd = "";
	DsAutnRqstInVO.msgChasNo     = "";
	DsAutnRqstInVO.mnpRstnCustYn = "0";
	DsAutnRqstInVO.userWorkDlrCd = "315397";
	DsAutnRqstInVO.itemId = "";
	DsAutnRqstInVO.mnpAftEnprCd = "L30";
	DsAutnRqstInVO.ltpymAmt = "";
	DsAutnRqstInVO.mvnoFlag = "Y";
	DsAutnRqstInVO.ppayPspmtMvmtDvCd = "";
	DsAutnRqstInVO.rsvCustNo = "";
	DsAutnRqstInVO.mnpRspnCd = "";
	DsAutnRqstInVO.mrktCd = "KBM";
	DsAutnRqstInVO.mnpPymDvCd = "";
	DsAutnRqstInVO.applicationId = "IF-SB-808";
	DsAutnRqstInVO.nextOperatorId = "1100000288";

	RequestBody.DsAutnRqstInVO = DsAutnRqstInVO;

	RequestRecord.RequestBody = RequestBody;

	CreateSmrtMnpPriorConBD.RequestRecord = RequestRecord;
	data.CreateSmrtMnpPriorConBD = CreateSmrtMnpPriorConBD;
	base.data = data;
	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/SB808',
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
			console.log(response);

			var resultCode  = "";
			var resultCode1 = "";
			var resultCode2 = "";
			var resultMessage = "";
			var resultDesc	  = "";

			try{
				resultCode    = response.resultCode;
				resultMessage = response.data.CreateSmrtMnpPriorConBDResponse.ResponseRecord.BusinessHeader.ResultMessage;
				resultCode1   = response.data.CreateSmrtMnpPriorConBDResponse.ResponseRecord.BusinessHeader.ResultCode;
				resultCode2   = response.data.CreateSmrtMnpPriorConBDResponse.ResponseRecord.ResponseBody.ResultOutVO.resultCode;
				resultDesc    = response.data.CreateSmrtMnpPriorConBDResponse.ResponseRecord.ResponseBody.ResultOutVO.resultDesc;
			}catch(e){
				resultMessage = response.resultMessage;
			}

			resultMessage = "[SB808]" + resultMessage;
			resultDesc    = "[SB808]" + resultDesc;

			console.log('SB808 resultCode='+resultCode+' resultCode1='+resultCode1+' resultCode2='+resultCode2 + ' resultDesc=' + resultDesc);

			$("#SB808_RE").val("N");
			$("#SB813_RE").val("N");

			if(resultCode == 'N0000' && ( resultCode2 == 'BS0000' || resultCode2 == 'BF1036' || resultCode2 == 'BF1037' || resultCode2 == 'BF1039') ){
				sendDV825();
			}
			else if(resultCode == 'N0000' && resultCode2 == 'BF1001' ){
				$("#SB808_RE").val("Y");
                showOpeningFailLayer("고객 유형이 불일치 합니다. 이동 전 통신사에서 고객 유형을 다시 확인해 주시기 바랍니다.<br/>(KB Liiv M 고객센터 : 1522-9999)", "BF1001");
			}
			else if(resultCode == 'N0000' && resultCode2 == 'BF1012' ){
				$("#SB808_RE").val("Y");
                showOpeningFailLayer("이동 전 통신사 기 해지 고객입니다. 해지 철회 후 번호이동이 가능합니다.<br/>(KB Liiv M 고객센터 : 1522-9999)", "BF1012");
			}
			else if(resultCode == 'N0000' && resultCode2 == 'BF2001' ){
				$("#SB808_RE").val("Y");
                showOpeningFailLayer("해당사업자의 고객 전화번호가 아닙니다. 번호이동 전 통신사를 다시 확인 후 시도해 주시기 바랍니다.<br/>(KB Liiv M 고객센터 : 1522-9999)", "BF2001");
			}
			else if(resultCode == '500' ){
				$("#SB808_RE").val("Y");
				popalarm2(resultMessage, "info", false,"");
			}
			else if(resultCode2 != '' && resultCode2 != 'BS0000' ){
				$("#SB808_RE").val("Y");
				popalarm2(resultDesc, "info", false,"");
			}
			else{
				$("#SB808_RE").val("Y");
				popalarm2("[SB808]일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"");
			}

		},
		error: function(request,status,error){
			popalarm2("[SB808]일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
		}
	});//end ajax
}

//USIM 단독개통 가상 단말등록
function sendDV825(){

	var base = new Object();
	var data = new Object();

	var RetrieveUsimSnglSbgn = new Object();

	var RequestRecord = new Object();
	var RequestBody   = new Object();

	var UserInfoInVO  = new Object();
	var InputDataInVO = new Object();

	base.serviceId = "DV825";

	UserInfoInVO.userId     =  "";
    UserInfoInVO.userOrgCd  =  "";
    UserInfoInVO.userLginIp =  "";
    UserInfoInVO.extduYn    =  "Y";
    UserInfoInVO.mrktCd     =  "KBM";
    UserInfoInVO.userDlrCd  =  "315397";
    UserInfoInVO.userDlrGrpCd =  "";
    UserInfoInVO.userDlrNm    =  "KB국민은행지점";
    UserInfoInVO.entrNo =  "";
    UserInfoInVO.aceno  =  "";
    UserInfoInVO.billAcntNo =  $("#billAcntNo").val();
    UserInfoInVO.prodNo     =  $("#mtelNo").val();
    UserInfoInVO.userWorkDlrCd =  "315397";
    UserInfoInVO.userWorkDlrNm =  "KB국민은행지점";
    UserInfoInVO.runDate    =  "";
    UserInfoInVO.runDateDtm =  "";
    UserInfoInVO.nextOperatorId =  "1100000288";

	InputDataInVO.msMode            = "NAC";
    InputDataInVO.entrRsvRcptSeqno  = $("#mvnoRcptNo").val();
    InputDataInVO.custNo            = $("#custNo").val();
    InputDataInVO.prodNo            = $("#mtelNo").val();
    InputDataInVO.entrNo            = "";
    InputDataInVO.sdphnYn           = "I";

	InputDataInVO.vtDevTyp          = getVtDevTyp();

    InputDataInVO.itemId            = "";
    InputDataInVO.manfSerialNo      = "";
    InputDataInVO.posCd             = $("#posCd").val();
    InputDataInVO.nextOperatorId    = "1100000288";

   	RequestBody.UserInfoInVO  = UserInfoInVO;
   	RequestBody.InputDataInVO = InputDataInVO;

	RequestRecord.RequestBody = RequestBody;

	RetrieveUsimSnglSbgn.RequestRecord = RequestRecord;

	data.RetrieveUsimSnglSbgn = RetrieveUsimSnglSbgn;

	base.data = data;
	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/DV825',
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

			var resultCode    = "";
			var rsltYn        = "";
			var resultMessage = "";
			var itemId		  = "";
			var manfSerialNo  = "";

			try{
				resultCode    = response.resultCode;
				rsltYn        = response.data.RetrieveUsimSnglSbgnResponse.ResponseRecord.ResponseBody.RsltDataOutVO.rsltYn;
				resultMessage = response.data.RetrieveUsimSnglSbgnResponse.ResponseRecord.BusinessHeader.ResultMessage;

				itemId		  = response.data.RetrieveUsimSnglSbgnResponse.ResponseRecord.ResponseBody.DsChkItemOutVO[0].itemId;
				manfSerialNo  = response.data.RetrieveUsimSnglSbgnResponse.ResponseRecord.ResponseBody.DsChkItemOutVO[0].manfSerialNo;
			}catch(e){
				resultMessage = response.resultMessage;
			}

			var chrgPln = $("#chrgPln").val();

			itemId = (chrgPln == 'PD00000011'
					|| chrgPln == 'PD00000012'
					|| chrgPln == 'PD00000579'
					|| chrgPln == 'PD00000581'
					|| chrgPln == 'PD00000583'
					|| chrgPln == 'PD00000585'
					|| chrgPln == 'PD00000587'
					|| chrgPln == 'PD00000589'
					|| chrgPln == 'PD00000591'
					|| chrgPln == 'PD00000555') ? itemId + "" :  itemId;
			console.log('DV825 resultCode='+resultCode + " rsltYn ="+ rsltYn + " itemId = " + itemId + " manfSerialNo=" + manfSerialNo);


			if(resultCode == 'N0000' && rsltYn == 'Y'){
			    openLoading("stop");
				$("#itemId").val(itemId);
				$("#manfSerialNo").val(manfSerialNo);
			}else if(resultCode !== 'N0000'){
				popalarm2(resultMessage, "info", false);
			}else{
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
			}

		},
		error: function(request,status,error){
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
		}
	});//end ajax
}


//스마트개통 인증요청 번호이동 MNP 인증 요청
function sendSB813(){

	var base = new Object();
	var data = new Object();

	var CreateSmrtMnpAutnBD = new Object();

	var RequestRecord  = new Object();
	var RequestBody    = new Object();

	var DsAutnRqstInVO = new Object();
	var sb813Re = $("#SB813_RE").val();

    DsAutnRqstInVO.ctn =  $("#mtelNo").val();
    DsAutnRqstInVO.mnpBfrEnprCd = $("#mcoCd").val();

    /* 번호이동시 호출하는 번호이동고객유형코드(mnpCustKdCd)
	01 : 일반
	02 : 개인사업자
	03 : 일반법인
	04 : 공공기관
	*/
	if($("#custTp").val() == "II"){
		DsAutnRqstInVO.mnpCustKdCd  = "01";
		DsAutnRqstInVO.custBsRegNo =  "";
		DsAutnRqstInVO.hldrCustNm =  $("#custNm").val();
	}
	else if($("#custTp").val() == "GEF"){
		DsAutnRqstInVO.mnpCustKdCd  = "02";
		DsAutnRqstInVO.custBsRegNo =  $("#bizRegNo").val();
		DsAutnRqstInVO.hldrCustNm =  $("#repNm").val();
	}
	else if($("#custTp").val() == "IFX"){
		DsAutnRqstInVO.mnpCustKdCd  = "01";
		DsAutnRqstInVO.custBsRegNo =  "";
		DsAutnRqstInVO.hldrCustNm =  $("#custNm").val();
	}
	else {
		DsAutnRqstInVO.mnpCustKdCd  = "01";
		DsAutnRqstInVO.custBsRegNo =  "";
		DsAutnRqstInVO.hldrCustNm =  $("#custNm").val();
	}

    DsAutnRqstInVO.custPersNo =  $("#regNo").val();
    DsAutnRqstInVO.frgnrYn =  "";
	DsAutnRqstInVO.autnItemDvCd = getAuthMthd(); //번호이동구분코드
	DsAutnRqstInVO.autnItemNo   = $("#npAuthKey").val(); //번호이동인증값
    DsAutnRqstInVO.cashPymAmt =  "";
    DsAutnRqstInVO.mnpKdCd =  "KBM";
    DsAutnRqstInVO.insttEntrYn =  "";
    DsAutnRqstInVO.custCtplc =  "";
    DsAutnRqstInVO.rqmnNm =  "";
    DsAutnRqstInVO.rqmnPersNo =  "";
    DsAutnRqstInVO.hldrDrngRelsCd =  "";
    DsAutnRqstInVO.msgChasNo =  "";
    DsAutnRqstInVO.mnpRstnCustYn = (sb813Re == 'Y') ? "1":"0";
    DsAutnRqstInVO.userWorkDlrCd =  "315397";
    DsAutnRqstInVO.itemId =  $("#itemId").val(); // LGU-OMPHONE LM-G710N
    DsAutnRqstInVO.mnpAftEnprCd =  "L30";
    DsAutnRqstInVO.ltpymAmt =  "";
    DsAutnRqstInVO.mvnoFlag =  "Y";
    DsAutnRqstInVO.ppayPspmtMvmtDvCd =  "1";
    DsAutnRqstInVO.rsvCustNo =  "";
    DsAutnRqstInVO.mnpRspnCd =  "";
    DsAutnRqstInVO.mrktCd =  "";
    DsAutnRqstInVO.mnpPymDvCd =  "";
    DsAutnRqstInVO.rltyPymAmt =  "";
    DsAutnRqstInVO.pymTrgtStrtDt =  "";
    DsAutnRqstInVO.pymTrgtEndDt =  "";
    DsAutnRqstInVO.pymMthdBank =  "";
    DsAutnRqstInVO.pymMthdCard =  "";
    DsAutnRqstInVO.pymMthdGiro =  "";
    DsAutnRqstInVO.pymMthdCms =  "";
    DsAutnRqstInVO.pymMthdKT =  "";
    DsAutnRqstInVO.applicationId =  "";
    DsAutnRqstInVO.nextOperatorId =  "1100000288";

	RequestBody.DsAutnRqstInVO   = DsAutnRqstInVO;

	RequestRecord.RequestBody = RequestBody;

	CreateSmrtMnpAutnBD.RequestRecord = RequestRecord;

	data.CreateSmrtMnpAutnBD = CreateSmrtMnpAutnBD;

	base.serviceId = "SB813";
	base.data = data;
	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/SB813',
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

				var resultCode    = "";
				var resultMessage = "";
				var resultCode1   = "";
				var resultDesc	  = "";
				var msgChasNo     = "";


				try{
					resultCode      = response.resultCode;
					msgChasNo 	    = response.data.CreateSmrtMnpAutnBDResponse.ResponseRecord.ResponseBody.DsAutn0300OutVO.msgChasNo;      //메세지 추적 번호
					resultCode1     = response.data.CreateSmrtMnpAutnBDResponse.ResponseRecord.ResponseBody.ResultOutVO.resultCode;
					resultDesc      = response.data.CreateSmrtMnpAutnBDResponse.ResponseRecord.ResponseBody.ResultOutVO.resultDesc;
					autnDayCount    = response.data.CreateSmrtMnpAutnBDResponse.ResponseRecord.ResponseBody.ResultOutVO.autnDayCount;
					$("#msgChasNo").val(msgChasNo);
					$("#autnDayCount").val(autnDayCount);
				}catch(e){
					resultCode = "";
				}

				resultMessage = "[SB813]" + "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.";

				if(resultCode !== 'N0000'){
					popalarm2(resultMessage, "info", false);
					return;
				}

				console.log(' SB813 resultCode=' + resultCode);

				//$("#SB813_RE").val("N");
				if(resultCode == 'N0000' && (resultCode1 == 'BS0000' || resultCode1 == 'BF1036') ){
					saveNpAuthInfo();
				}
				else if(resultCode == 'N0000' && resultCode1 == 'BF1001' ){
                    showOpeningFailLayer("고객 유형이 불일치 합니다. 이동 전 통신사에서 고객 유형을 다시 확인해 주시기 바랍니다.<br/>※ 번호이동 인증 1일 7회 초과시, 익일 재인증 가능합니다.<br/>(KB Liiv M 고객센터 : 1522-9999)", "BF1001");
				}
				else if(resultCode == 'N0000' && resultCode1 == 'BF1004' ){
                    showOpeningFailLayer("인증항목 구분이 일치하지 않습니다. 이동 전 통신사에서 등록정보를 다시 확인해 주시기 바랍니다.<br/>※ 번호이동 인증 1일 7회 초과시, 익일 재인증 가능합니다.<br/>(KB Liiv M 고객센터 : 1522-9999)", "BF1004");
				}
				else if(resultCode == 'N0000' && resultCode1 == 'BF1005' ){
                    showOpeningFailLayer("인증정보가 일치하지 않습니다. 이동 전 통신사에서 등록정보를 다시 확인해 주시기 바랍니다.<br/>※ 번호이동 인증 1일 7회 초과시, 익일 재인증 가능합니다.<br/>(KB Liiv M 고객센터 : 1522-9999)", "BF1005");
				}
				else if(resultCode == 'N0000' && resultCode1 == 'BF1012' ){
                    showOpeningFailLayer("이동 전 통신사 기 해지 고객입니다. 해지 철회 후 번호이동이 가능합니다.<br/>※ 번호이동 인증 1일 7회 초과시, 익일 재인증 가능합니다.<br/>(KB Liiv M 고객센터 : 1522-9999)", "BF1012");
				}
				else if(resultCode == 'N0000' && resultCode1 == 'BF1039' ){
                    showOpeningFailLayer("번호이동 사전동의 내역이 확인되지 않습니다. 이동 전 통신사에서 번호이동 사전동의 후 진행해 주시기 바랍니다.<br/>(KB Liiv M 고객센터 : 1522-9999)", "BF1039");
				}
				else if(resultCode == 'N0000' && resultCode1 == 'BF2001' ){
                    showOpeningFailLayer("해당사업자의 고객 전화번호가 아닙니다. 번호이동 전 통신사를 다시 확인 후 시도해 주시기 바랍니다.<br/>(KB Liiv M 고객센터 : 1522-9999)", "BF2001");
				}
				else if(resultCode == 'N0000' && (resultCode1 == 'BF1010' || resultCode1 == 'BF1028' || resultCode1 == 'BF1029' ) ){
					$("#SB813_RE").val("Y");
					popalarm2("3개월 제한여부 확인중입니다. 다음버튼을 한번 더 눌러주세요.", "info", false);
				}
				else if( resultCode1 != 'BS0000'){
					popalarm2(resultDesc, "info", false);
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
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
			}

		},
		error: function(request,status,error){
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);

		}
	});//end ajax

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
    	openLoading("start");
		if($("#SB808_RE").val() == 'Y'){
			sendSB808();
		}else{
			sendSB813();//[번호이동] MNP 인증요청
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

//단말 타입 설정
function getVtDevTyp(){
	var modelNo = $("#modelNo").val();
	var chrgPln = $("#chrgPln").val();
	var rtnval = "";

	if(chrgPln == 'PD00000011'
			|| chrgPln == 'PD00000012'
			|| chrgPln == 'PD00000579'
			|| chrgPln == 'PD00000581'
			|| chrgPln == 'PD00000583'
			|| chrgPln == 'PD00000585'
			|| chrgPln == 'PD00000587'
			|| chrgPln == 'PD00000589'
			|| chrgPln == 'PD00000591'
			|| chrgPln == 'PD00000555'){
		if(modelNo == '01' || modelNo == '05'){
			rtnval = "VT5";//5G 요금제 자사 단말코드
		}else{
			rtnval = "VT6";//5G 요금제 타사 단말코드
		}
	}else{
		if(modelNo == '01' || modelNo == '05'){
			rtnval = "VT";//LTE 요금제 자사 단말코드
		}else{
			rtnval = "VT2";//LTE 요금제 타사 단말코드
		}
	}

	return rtnval;

}

//납부차수 확인
function getPayDimension() {
	if(gToday < "20200401") {
		return "1"; //1차수
	}
	else{
		return "2";	//2차수
	}
}