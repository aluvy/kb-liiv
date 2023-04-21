var gTestArr = new Array();
var gTestObj = new Object();

//신청정보 세팅
function setJoinInfo(data){

	$("#soId").val(data.soId);
	$("#applSeqNo").val(data.applSeqNo);
	$("#custId").val(data.custId);
	$("#custNm").val(data.custNm);
	$("#ctrtId").val(data.ctrtId);
	$("#usrId").val(data.usrId);
	$("#custTp").val(data.custTp);
	$("#idcardTp").val(data.idcardTp);
	$("#bizRegNo").val(data.bizRegNo);
	$("#repNm").val(data.repNm);
	$("#acntNm").val(data.acntNm);
	$("#foreignerStyCd").val(data.foreignerStyCd);
	$("#foreignerStrtDt").val(data.foreignerStrtDt);
	$("#foreignerExpiratDt").val(data.foreignerExpiratDt);
	$("#regNo").val(data.corpRegNo);

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
		$("#usimMngNo").val("K9040");
	}else{
		$("#usimMngNo").val(data.usimMngNo);
		$("#usimModelNo_org").val(data.usimMngNo);
	}
	$("#usimSerialNo").val(data.usimSerialNo);
	$("#chrgPln").val(data.chrgPln);
	$("#prodGrp").val(data.prodGrp);
	$("#modelNo").val(data.modelNo);

	$("#usimFeeCnt").val(data.usimFeeCnt);

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

	applTp = data.applTp;//번호이동 M 신규가입 N

	//eSIM정보
    $("#modelItemid").val(data.modelItemid);
	$("#modelSerialNo").val(data.modelSerialNo);
	$("#imei").val(data.imei);
	$("#imei2").val(data.imei2);
	$("#modelEid").val(data.modelEid);
	$("#modelMacAddress").val(data.modelMacAddress);


	//워치
    $("#oppntSvcTelNo").val(data.oppntSvcTelNo);
    $("#oppntServiceId").val(data.oppntServiceId);
    $("#oppntMnoProdCd").val(data.oppntMnoProdCd);
    $("#watchTp").val(data.watchTp);
    $("#watchCombYn").val(data.watchCombYn);
    $("#watchSharYn").val(data.watchSharYn);

    console.log("usimMngNo="+data.usimMngNo);
    console.log("usimSerialNo="+data.usimSerialNo);
    console.log("oppntSvcTelNo="+data.oppntSvcTelNo);
    console.log("oppntServiceId="+data.oppntServiceId);
    console.log("oppntMnoProdCd="+data.oppntMnoProdCd);
    console.log("watchTp="+data.watchTp);
    console.log("watchCombYn="+data.watchCombYn);
    console.log("watchSharYn="+data.watchSharYn);
    console.log("esimYn="+data.esimYn);
	console.log("modelItemid="+data.modelItemid);
	console.log("modelSerialNo="+data.modelSerialNo);


	if(data.esimYn == "Y"){
		sendAPIM0048();
	}
	else if (data.watchTp == "G" || data.watchTp == 'A'){
		sendAPIM0048();
	} else {
    	openLoading("stop");
	}
}

//USIM 선 체크
function chkUsimCard(){

	var str    = $("#usimSerialNo").val();
	var strTmp = $("#usimSerialNoR").val();
	var strMng = $("#usimMngNo").val();
	var len    = strTmp.length;

	if( strTmp == "" || len !== 8){
		$("#usimSerialNoR").focus();
		$("#btnOpenReq").prop("disabled",true);

        let opt = {
             msg         : "유심 일련번호를 정확히 입력해주세요.",
             cfrmYn      : false
        };
        popalarm(opt);

		return;
	}else{
		if(checkUsimmngno()){
			if(strMng == "K3620" ){

				var strTmp3620 = $("#usimSerialNoR").val();
				$("#usimSerialNo").val(strTmp3620);
				console.log(strMng);
				console.log(strTmp3620);

				$("#btnOpenReq").prop("disabled",false);
				//showOpenBar();

                let opt = {
                     msg         : "유심번호가 확인되었습니다.",
                     cfrmYn      : false,
                     okCallback  : setDisabledUsim
                };
                popalarm(opt);
			}
			else{
				if(str != strTmp){
                    let opt = {
                         msg         : "기존 발급된 유심 일련번호 정보와 다릅니다. 정확히 입력해주세요.<br/><br/>유심번호가 변경된 경우 KB Liiv M 고객상담센터 1522-9999(유료)를 통해서 개통 가능합니다. 연결하시겠습니까?",
                         cfrmYn      : true,
                         okCallback  : callbackCallCenter
                    };
                    popalarm(opt);
				}
				else{
					$("#btnOpenReq").prop("disabled",false);
					//showOpenBar();

                    let opt = {
                         msg         : "유심번호가 확인되었습니다.",
                         cfrmYn      : false,
                         okCallback  : setDisabledUsim
                    };
                    popalarm(opt);
				}
			}
		}
	}//end if
}

//USIM 일련번호 체크
function chkUsimNo(){
	saveOpenigDstcd();
	if($("#esimYn").val() == "Y" || $("#watchTp").val() == "G" || $("#watchTp").val() == "A"){
		showOpenBar();
		if($("#SB816_RE").val() == 'Y'){
			sendSB816();
		}else{
			sendDV825();//USIM 단독개통 가상 단말등록
		}
	}
	else{
		var str    = $("#usimSerialNo").val();
		var strTmp = $("#usimSerialNoR").val();
		var strMng = $("#usimMngNo").val();
		var len    = strTmp.length;

		if( strTmp == "" || len !== 8){
            $("#usimSerialNoR").focus();
            $("#btnOpenReq").prop("disabled",true);

            let opt = {
                 msg         : "유심 일련번호를 정확히 입력해주세요.",
                 cfrmYn      : false
            };
            popalarm(opt);

			return;
		}else{
			//20220421 체험형 이벤트 추가
		    putTrialEvent();
			if(checkUsimmngno()){
				if(strMng == "K3620" ){

					var strTmp3620 = $("#usimSerialNoR").val();
					$("#usimSerialNo").val(strTmp3620);
					console.log(strMng);
					console.log(strTmp3620);

					showOpenBar();

					//sendSB804();//스마트개통 MNP 운영시간여부체크
					var sb816_re = $("#SB816_RE").val();

					if(sb816_re == 'Y'){
						sendSB816();
					}else{
						sendDV825();//USIM 단독개통 가상 단말등록
					}
				}
				else{
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

						//sendSB804();//스마트개통 MNP 운영시간여부체크
						var sb816_re = $("#SB816_RE").val();

						if(sb816_re == 'Y'){
							sendSB816();
						}else{
							sendDV825();//USIM 단독개통 가상 단말등록
						}
					}
				}
			}
		}//end if
	}
}

//단말마스터정보 조회
function sendAPIM0048(){
	var param = new Object();
	var data = new Object();
	var Query = new Object();
	var nextOperatorId = "1100000288";

	param.serviceId = 'APIM0048';
	Query.trmNo = $("#modelSerialNo").val();
	Query.trmMdlCd = $("#modelItemid").val();

	Query.inqStrtNo = "1";
	Query.inqEndNo = "1000";
	Query.optrId = nextOperatorId;


	data.query = Query;
	param.data = data;

	$.ajax({
	    url:  '/appIf/v1/uplus/esb/' + param.serviceId,
	    type: 'POST',
	    data: fnSign(JSON.stringify(param)),
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
	    success: function(data){
			if(data.resultCode == 'N0000' || data.resultCode == '200'){
				try{
					var dsTcnt = Number(data.data.dsTcnt.tcnt);
					if(dsTcnt > 0){
						var rsltData = data.data.rsltData;
						if(rsltData.length > 0){
							console.log("modelItemid="+rsltData[0].trmMdlCd);
							console.log("modelSerialNo="+rsltData[0].trmNo);
							console.log("imei="+rsltData[0].imeiIccidNo);
							console.log("imei2="+rsltData[0].secdImeiIccidNo);
							console.log("modelEid="+rsltData[0].eidNo);
							console.log("modelMacAddress="+rsltData[0].macAddr1);

							if(rsltData[0].trmMdlCd == "" || rsltData[0].trmNo == "" || rsltData[0].eidNo == ""){
                                let opt = {
                                     msg         : "개통이 불가능한 단말입니다.",
                                     cfrmYn      : false
                                };
                                popalarm(opt);
							}
							else{
								$("#btnOpenReq").prop("disabled",false);
							}
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

			} else {
			    popalarmRetry();
				return;
			}
	    },
	    error: function(e){
	    	console.log(e.responseText.trim());
	    	popalarmRetry();
	    	return;
	    },
	    complete: function() {
	        openLoading("stop");
	    }
	});
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
			//var resultCode1   = "";
			var rsltYn        = "";
			var resultMessage = "";
			var itemId		  = "";
			var manfSerialNo  = "";

			try{
				resultCode    = response.resultCode;
				//resultCode1   = response.data.RetrieveUsimSnglSbgnResponse.ResponseRecord.BusinessHeader.ResultCode;
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

			console.log('DV825 resultCode='+resultCode + " rsltYn ="+ rsltYn + " itemId = " + itemId);

			if(resultCode == 'N0000' && rsltYn == 'Y'){
				$("#itemId").val(itemId);
				$("#manfSerialNo").val(manfSerialNo);
				sendSM803();//요금종속및 가능체크
			}else if(resultCode !== 'N0000'){
				hideOpenBar();
                let opt = {
                     msg         : resultMessage,
                     cfrmYn      : false
                };
                popalarm(opt);
			}else{
				hideOpenBar();
				popalarmRetry();
			}
		},
		error: function(request,status,error){
			hideOpenBar();
			popalarmRetry();
		}
	});//end ajax
}


//요금종속및 가능체크
function sendSM803(){

	var base = new Object();
	var data = new Object();

	var RetrievePPlanDpndCheckSvc = new Object();

	var RequestRecord = new Object();
	var RequestBody   = new Object();

	var DsSvcParamInVO  = new Object();
	var DsRelsParamInVO = new Object();

	base.serviceId = "SM803";

    DsSvcParamInVO.svcCd    =  $("#mnoProdCd").val();//mvno 상품코드
    DsSvcParamInVO.srchYn   =  "E";
    DsSvcParamInVO.runDttm  =  getYYYYMMDDHHMMSS();
    DsSvcParamInVO.mrktCd   =  "KBM";
    DsSvcParamInVO.svcKdCd  =  "P";
    DsSvcParamInVO.prodCd   =  "LZP0000001";
    DsSvcParamInVO.itemId   =  $("#itemId").val();
    DsSvcParamInVO.entrRsvRcptSeqno =  $("#mvnoRcptNo").val();
    DsSvcParamInVO.nextOperatorId   =  "1100000288";

    DsRelsParamInVO.svcDpndRelsCd  =  "POE";
    DsRelsParamInVO.nextOperatorId =  "1100000288";

   	RequestBody.DsSvcParamInVO  = DsSvcParamInVO;
   	RequestBody.DsRelsParamInVO = DsRelsParamInVO;

	RequestRecord.RequestBody = RequestBody;

	RetrievePPlanDpndCheckSvc.RequestRecord = RequestRecord;

	data.RetrievePPlanDpndCheckSvc = RetrievePPlanDpndCheckSvc;

	base.data = data;

	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/SM803',
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
			var resultCode1   = "";
			var resultMessage = "";
			var svcCd		  = "";
			var dpndSvcCd     = "";
			var DsDpndSvcTotListOutVO = new Array();

			try{
				resultCode    = response.resultCode;
				resultCode1   = response.data.RetrievePPlanDpndCheckSvcResponse.ResponseRecord.BusinessHeader.ResultCode;
				resultMessage = response.data.RetrievePPlanDpndCheckSvcResponse.ResponseRecord.BusinessHeader.ResultMessage;
				svcCd		  = response.data.RetrievePPlanDpndCheckSvcResponse.ResponseRecord.ResponseBody.DsDpndSvcTotListOutVO[0].svcCd;
				DsDpndSvcTotListOutVO = response.data.RetrievePPlanDpndCheckSvcResponse.ResponseRecord.ResponseBody.DsDpndSvcTotListOutVO;
			}catch(e){
				resultMessage = response.resultMessage;
			}

			console.log('SM803 resultCode='+resultCode+ " resultCode1="+resultCode1 + " svcCd=" + svcCd);

			if(resultCode == 'N0000' && resultCode1 == 'N0000'){

				if(DsDpndSvcTotListOutVO != null){
					for(var i = 0 ; i < DsDpndSvcTotListOutVO.length ; i++ ){
						if(i == 0){
							dpndSvcCd  = DsDpndSvcTotListOutVO[i].svcCd;
						}else{
							dpndSvcCd  = dpndSvcCd + ',' + DsDpndSvcTotListOutVO[i].svcCd;
						}
					}
				}

				$("#sm803_svcCd").val(svcCd);//대상서비스 코드, 종속
				$("#sm803_dpndSvcCd").val(dpndSvcCd);//종속코드리스트

				sendSM005();//부가서비스 변경시 변경후 check
			}else if(resultCode !== 'N0000'){
				hideOpenBar();
                let opt = {
                     msg         : resultMessage,
                     cfrmYn      : false
                };
                popalarm(opt);
			}else{
				hideOpenBar();
				popalarmRetry();
			}
		},
		error: function(request,status,error){
			hideOpenBar();
			popalarmRetry();
		}
	});//end ajax
}

//부가서비스 변경시 변경후 check
function sendSM005(){

	var ymdhms = getYYYYMMDDHHMMSS();

	var base = new Object();
	var data = new Object();

	var CheckSvcChg = new Object();

	var RequestRecord = new Object();
	var RequestBody   = new Object();

	var DsChkSvcInVO    = new Object();
	var DsChkFtrInVO    = new Object();
	var DsChkSvcChgInVO = new Object();

	var DsChkSvcInVOArray  = new Array();
	var DsChkFtrInVOArray  = new Array();

	base.serviceId = "SM005";

    DsChkSvcInVO.prodCd =  "LZP0000001";
    DsChkSvcInVO.svcCd =  $("#mnoProdCd").val();//mvno 상품코드
    DsChkSvcInVO.svcNm =  "";
    DsChkSvcInVO.entrSvcSeqno = "";
    DsChkSvcInVO.hposSvcCd =  "";
    DsChkSvcInVO.hposEntrSvcSeqno =  "";
    DsChkSvcInVO.svcStrtDttm =  ymdhms;
    DsChkSvcInVO.svcAplyLvlCd =  "";
    DsChkSvcInVO.svcEndDttm =  "";
    DsChkSvcInVO.svcKdCd =  "P";
    DsChkSvcInVO.svcRelsDvCd =  "";
    DsChkSvcInVO.ndblCvrtSvcCd =  "";
    DsChkSvcInVO.svcMode =  "I";
    DsChkSvcInVO.svcSubMode =  "I";
    DsChkSvcInVO.nextOperatorId = "1100000288";

    DsChkSvcInVOArray.push(DsChkSvcInVO);

    var dpndSvcCd = $("#sm803_dpndSvcCd").val();
    var dpndSvcArr = dpndSvcCd.split(",");

	for(var i=0 ; i < dpndSvcArr.length ; i++){
		DsChkSvcInVO    = new Object();
	    DsChkSvcInVO.prodCd =  "LZP0000001";
	    DsChkSvcInVO.svcCd =  dpndSvcArr[i];//대상서비스 종속코드
	    DsChkSvcInVO.svcNm =  "";
	    DsChkSvcInVO.entrSvcSeqno = "";
	    DsChkSvcInVO.hposSvcCd =  "";
	    DsChkSvcInVO.hposEntrSvcSeqno =  "";
	    DsChkSvcInVO.svcStrtDttm =  ymdhms;
	    DsChkSvcInVO.svcAplyLvlCd =  "";
	    DsChkSvcInVO.svcEndDttm =  "";
	    DsChkSvcInVO.svcKdCd =  "O";
	    DsChkSvcInVO.svcRelsDvCd =  "";
	    DsChkSvcInVO.ndblCvrtSvcCd =  "";
	    DsChkSvcInVO.svcMode =  "I";
	    DsChkSvcInVO.svcSubMode =  "I";
	    DsChkSvcInVO.nextOperatorId = "1100000288";

	    DsChkSvcInVOArray.push(DsChkSvcInVO);
	}

    DsChkFtrInVO.prodCd =  "LZP0000001";
    DsChkFtrInVO.svcCd =  "";//mvno 상품코드
    DsChkFtrInVO.ftrCd =  "";
    DsChkFtrInVO.ftrNm =  "";
    DsChkFtrInVO.ftrValdStrtDt =  "";
    DsChkFtrInVO.ftrValdEndDt =  "";
    DsChkFtrInVO.varParam =  "";
    DsChkFtrInVO.ftrVarDtlSeqno =  "";
    DsChkFtrInVO.entrSvcSeqno =  "";
    DsChkFtrInVO.ftrMode =  "";
    DsChkFtrInVO.ftrSubMode =  "";
    DsChkFtrInVO.nextOperatorId =  "1100000288";

    DsChkFtrInVOArray.push(DsChkFtrInVO);

    DsChkSvcChgInVO.entrNo =  "";
    DsChkSvcChgInVO.mrktCd =  "KBM";
    DsChkSvcChgInVO.prodNo =  $("#mtelNo").val();
    DsChkSvcChgInVO.prodCd =  "LZP0000001";
    DsChkSvcChgInVO.entrSttsCd =  "A";

    if($("#watchTp").val() == "G" || $("#watchTp").val() == "A"){
	    DsChkSvcChgInVO.itemId = $("#modelItemid").val();
	    DsChkSvcChgInVO.manfSerialNo = $("#modelSerialNo").val();
    }
    else{
	    DsChkSvcChgInVO.itemId =  $("#itemId").val();
	    DsChkSvcChgInVO.manfSerialNo =  $("#manfSerialNo").val();
    }

    DsChkSvcChgInVO.prevSvcCd =  "";
    DsChkSvcChgInVO.svcCd =  $("#mnoProdCd").val();//mvno 상품코드
    DsChkSvcChgInVO.svcDutyUseEndDt =  "";
    DsChkSvcChgInVO.opDlrCd =  "315397";
    DsChkSvcChgInVO.entrDlrCd =  "315397";
    DsChkSvcChgInVO.svcAplyLvlCd =  "C";
    DsChkSvcChgInVO.hldrCustNo =  $("#custNo").val();//uplus 고객번호
    DsChkSvcChgInVO.rlusrCustNo = $("#custNo").val();
    DsChkSvcChgInVO.billAcntNo =  $("#billAcntNo").val();
    DsChkSvcChgInVO.ppayAcntYn =  "";
    DsChkSvcChgInVO.mnpKdCd =  "";
    DsChkSvcChgInVO.ltpymSttsCd =  "";
    DsChkSvcChgInVO.custrnmNo =  "";
    DsChkSvcChgInVO.runDttm =  ymdhms;
    DsChkSvcChgInVO.rsvDate =  "";
    DsChkSvcChgInVO.prcType =  "NAC";
    DsChkSvcChgInVO.prcSubType =  "AC";
    DsChkSvcChgInVO.prcMode =  "ALL";
    DsChkSvcChgInVO.prcSubMode =  "ACH";
    DsChkSvcChgInVO.nextOperatorId =  "1100000288";

 	RequestBody.DsChkSvcInVO     = DsChkSvcInVOArray;
 	RequestBody.DsChkFtrInVO     = DsChkFtrInVOArray;
 	RequestBody.DsChkSvcChgInVO  = DsChkSvcChgInVO;

	RequestRecord.RequestBody = RequestBody;
	CheckSvcChg.RequestRecord = RequestRecord;
	data.CheckSvcChg = CheckSvcChg;
	base.data = data;

	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/SM005',
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
			var resultCode1   = "";
			var resultMessage = "";
			var DsChkSvcOutVO = new Array();

			try{
				resultCode    = response.resultCode;
				resultCode1   = response.data.CheckSvcChgResponse.ResponseRecord.BusinessHeader.ResultCode;
				resultMessage = response.data.CheckSvcChgResponse.ResponseRecord.BusinessHeader.ResultMessage;
				DsChkSvcOutVO = response.data.CheckSvcChgResponse.ResponseRecord.ResponseBody.DsChkSvcOutVO;
			}catch(e){
				resultMessage = response.resultMessage;
			}

			console.log('SM005 resultCode='+resultCode+ " resultCode1="+resultCode1);

			if(resultCode == 'N0000' && resultCode1 == 'N0000'){
				//alert('SM005 complete!!');
				setSM005Response(DsChkSvcOutVO);
			}else if(resultCode !== 'N0000'){
				hideOpenBar();
                let opt = {
                     msg         : resultMessage,
                     cfrmYn      : false
                };
                popalarm(opt);
			}else{
				hideOpenBar();
				popalarmRetry();
			}
		},
		error: function(request,status,error){
			hideOpenBar();
			popalarmRetry();
		}
	});//end ajax
}

//SM005 결과 세팅 -> SB803(SVC)에 세팅하기위한 사전작업
function setSM005Response(voArr){
	var strSvc = "";
	var cnt = 0;
	if(voArr != null){
		for(var i = 0 ; i < voArr.length ; i++ ){
			if(i == 0){
				strSvc  = voArr[i].svcCd + '^' + voArr[i].svcKdCd;
			}else{
				strSvc  = strSvc + '|' + voArr[i].svcCd + '^' + voArr[i].svcKdCd;
			}
			cnt++;
		}
	}
	strSvc = strSvc + '|' + 'LRZ0000824' + '^' + 'R';//음성스팸차단
	cnt = cnt + 1;

	var legalRprsnYn = $("#legalRprsnYn").val();
	var chrgPln = $("#chrgPln").val();
	/*22.12.16 지서연 사원 추가
	 * 주니어 요금제 상품코드를 상품그룹코드로 변경
	 */
	var prodGrp = $("#prodGrp").val();

    if (legalRprsnYn == 'Y') {
    	strSvc = strSvc + '|' + 'LRZ0002466' + '^' + 'R';//미성년자 네트워크 차단
    	strSvc = strSvc + '|' + 'LRZ0002615' + '^' + 'R';//미성년자 자녀지킴이(무료)
    	cnt = cnt + 2;
    	if(prodGrp == "U03" || prodGrp == "K08") {
    	//if(chrgPln == 'PD00000240' || chrgPln == 'PD00000241' ){ //주니어요금제일경우
    		strSvc = strSvc + '|' + 'LRZ0000033' + '^' + 'R';//청소년 정보료 상한 10000
    		cnt = cnt + 1;
    	}
    }

	/*
	strSvc = strSvc + '|' + 'LRZ0000277' + '^' + 'R';//스팸차단
	strSvc = strSvc + '|' + 'LRZ0000382' + '^' + 'R';//발신번호표시
	strSvc = strSvc + '|' + 'LRZ0000608' + '^' + 'R';//매너콜

	cnt = cnt + 3;
	*/
	$("#sm005_svc").val(strSvc);
	$("#sm005_svc_cnt").val(cnt);

	sendSB803('SVC');

}

//스마트 등록 실시간 가입 판매정보 등록(신규가입)
function sendSB803(step){

	var mvnoRcptNo  = "";//가입예약번호
	var billAcntNo  = "";//청구계정번호
	var custNo		= "";
    var prodRqstNo  = "";

	if($("#mvnoRcptNo").val() != '' && $("#mvnoRcptNo").val() != null && $("#mvnoRcptNo").val() != 'NULL'){
		mvnoRcptNo  = $("#mvnoRcptNo").val();
	}
	if( $("#billAcntNo").val() != '' && $("#billAcntNo").val() != null && $("#billAcntNo").val() != 'NULL'){
		billAcntNo  = $("#billAcntNo").val();
	}
	if( $("#custNo").val() != '' && $("#custNo").val() != null && $("#custNo").val() != 'NULL'){
		custNo      = $("#custNo").val();
	}

	prodRqstNo = $("#applSeqNo").val();

	var strBlank = "";
	var strZero  = "";

	var insttDvCd   = "";
	var chceAgmtYn  = "";
	var rvinsAgrmtYn  = "";
	var usimPymMthdCd = "";
	var insttYn = "";
	var cashYn  = "";
	var cprtCardYn = "";
	var cardYn 	   = "";
	var cashAcumYn = "";
	var cashAcumUseYn = "";
	var chrgPymPosCd = "";

	var stepDevcCd		= "";
	var stepSvcChngDttm = "";

	var stepMnpChngDttm  = "";
	var stepCustChngDttm = "";
	var rgstDt           = "";
	var entrRsvDttm      = "";
	var prssRsultCd      = "";
	var _workDv          = "";
	var _jobBiz          = "";
	var stepCustAgrmtYn  = "";

	var usimFeeCnt		 = "";
	var usimFeeAmt		 = "0";

	var ymdhms = getYYYYMMDDHHMMSS();
	var ymd    = getYYYYMMDD();

	if(step == 'DEV' || step == 'AGR'){
		strBlank = "BLANK        ";
		strZero  = "0";
		insttDvCd = "N";
		chceAgmtYn  = "N";
		rvinsAgrmtYn  = "N";
		usimPymMthdCd = "EX";
		insttYn = "N";
		cashYn  = "N";
		cprtCardYn = "N";
		cardYn 	   = "N";
		cashAcumYn = "N";
		cashAcumUseYn = "N";
		chrgPymPosCd = $("#posCd").val();

		stepMnpChngDttm  = ymdhms;
		stepCustChngDttm = ymdhms;
		rgstDt           = ymd;
		entrRsvDttm      = ymdhms;
		prssRsultCd      = "I";
		stepDevcCd		= "9";
		stepSvcChngDttm = ymdhms;
	}

	_workDv = "U";

	if(step == 'DEV'){//2번째
		_jobBiz = "DEV";
	}else if(step == 'AGR'){//3번째
		_jobBiz = "AGR";
		stepCustAgrmtYn = "9";
	}else{ //1번째
		_jobBiz = "SVC";
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

	DsEntrInfoInVO.prodNo = $("#mtelNo").val();
    DsEntrInfoInVO.aceno = "";
    DsEntrInfoInVO.frstEntrRqstNo = "";
    DsEntrInfoInVO.cpno = "";
    DsEntrInfoInVO.entrNo = "";
    DsEntrInfoInVO.elecDocNo = "";
    DsEntrInfoInVO.allAgrmtYn = (step == 'AGR') ? "Y" : "";
    DsEntrInfoInVO.custAgrmtYn = "";
    DsEntrInfoInVO.custInfoGthrAgrmtYn = (step == 'AGR') ? "Y" : "";
    DsEntrInfoInVO.custInfoTrstAgrmtYn = (step == 'AGR') ? "Y" : "";
    DsEntrInfoInVO.custInfoCprtPuseAgrmtYn = "";
    DsEntrInfoInVO.mblAdRcpAgrmtYn = (step == 'AGR') ? "Y" : "";
    DsEntrInfoInVO.locFndtnInfoAgrmtYn = (step == 'AGR') ? "Y" : "";
    DsEntrInfoInVO.indvInfoThptAgrmtYn = (step == 'AGR') ? "Y" : "";
    DsEntrInfoInVO.indvCrdtInqAgrmtYn = (step == 'AGR') ? "Y" : "";
    DsEntrInfoInVO.adOfferTrstAgrmtYn = (step == 'AGR') ? "Y" : "";
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

    if($("#esimYn").val() == "Y"){
    	DsDevSaleInfoInVO.usimMdlCd = "ESIM" ;
        DsDevSaleInfoInVO.usimSerialNo = "";
        DsDevSaleInfoInVO.itemId = $("#modelItemid").val();
        DsDevSaleInfoInVO.manfSerialNo = $("#modelSerialNo").val();
    }
    else{
    	if($("#watchTp").val() == "G" || $("#watchTp").val() == "A"){
    		DsDevSaleInfoInVO.usimMdlCd = $("#usimModelNo_org").val();
	        DsDevSaleInfoInVO.usimSerialNo = fnLpad($("#usimSerialNo").val(), 20, "0");
	        DsDevSaleInfoInVO.itemId = $("#modelItemid").val();
	        DsDevSaleInfoInVO.manfSerialNo = $("#modelSerialNo").val();
    	}
    	else{
    	   	DsDevSaleInfoInVO.usimMdlCd = ($("#usimMngNo").val() == null || $("#usimMngNo").val() == '') ? "K9040": $("#usimMngNo").val() ;
	        DsDevSaleInfoInVO.usimSerialNo = $("#usimSerialNo").val();
	        DsDevSaleInfoInVO.itemId = $("#itemId").val();
	        DsDevSaleInfoInVO.manfSerialNo = $("#manfSerialNo").val();
    	}
    }

    DsDevSaleInfoInVO.sdphnYn =  "I";
    DsDevSaleInfoInVO.usimDvCd =  "C";
    DsDevSaleInfoInVO.plcydcPlcyCd =  strBlank;
    DsDevSaleInfoInVO.bizPlcyCd =  strBlank;
    DsDevSaleInfoInVO.hpdisAmt =  strZero;
    DsDevSaleInfoInVO.sdphnCmpsnAmt =  strZero;
    DsDevSaleInfoInVO.devcDlvrAmt =  strZero;
    DsDevSaleInfoInVO.rsaleAmt =  strZero;
    DsDevSaleInfoInVO.cashAmt =  strZero;
    DsDevSaleInfoInVO.cardAmt =  strZero;
    DsDevSaleInfoInVO.cprtCardAmt =  strZero;
    DsDevSaleInfoInVO.insttAmt =  strZero;
    DsDevSaleInfoInVO.insttMnbr =  (step == 'AGR') ? "" : strZero;
    DsDevSaleInfoInVO.suprtAmt =  strZero;
    DsDevSaleInfoInVO.entrDscntKdCd =  "";
    DsDevSaleInfoInVO.insttDvCd = insttDvCd;
    DsDevSaleInfoInVO.slt1InsttMnbr =  "";
    DsDevSaleInfoInVO.slt2InsttMnbr =  "";
    DsDevSaleInfoInVO.mnthAtmny =  strZero;
    DsDevSaleInfoInVO.insttFeeAmt =  (step == 'AGR') ?  "0" : "";
    DsDevSaleInfoInVO.sdphnPnt =  "";
    DsDevSaleInfoInVO.cashAcumAmt =  "";
    DsDevSaleInfoInVO.allDscntAmt =  strZero;
    DsDevSaleInfoInVO.chceAgmtYn =  chceAgmtYn;
    DsDevSaleInfoInVO.chceAgmtMnbr =  "";
    DsDevSaleInfoInVO.rvinsAgrmtYn =  rvinsAgrmtYn;
    DsDevSaleInfoInVO.insrSvcId =  "";
    DsDevSaleInfoInVO.usimPymMthdCd =  usimPymMthdCd;
    DsDevSaleInfoInVO.coPrmPymMthdCd =  "";
    DsDevSaleInfoInVO.insttYn = insttYn;
    DsDevSaleInfoInVO.cashYn =  cashYn;
    DsDevSaleInfoInVO.cprtCardYn = cprtCardYn;
    DsDevSaleInfoInVO.cardYn = cardYn;
    DsDevSaleInfoInVO.cashAcumYn = cashAcumYn;
    DsDevSaleInfoInVO.sdphnPntYn =  "";
    DsDevSaleInfoInVO.cashAcumUseYn =  cashAcumUseYn;
    DsDevSaleInfoInVO.cashAcumUseAmt =  strZero;
    DsDevSaleInfoInVO.usimSaleAmt = (step == '' || step == null || step == undefined) ? usimFeeAmt : strZero;
    DsDevSaleInfoInVO.coPrmAmt =  strZero;
    DsDevSaleInfoInVO.devHelpAmt =  strZero;
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
    DsDevSaleInfoInVO.dpDscntAmt =  strZero;
    DsDevSaleInfoInVO.devGrdCd =  "";
    DsDevSaleInfoInVO.devGrdDscntAmt =  strZero;
    DsDevSaleInfoInVO.chrgPymPosCd = chrgPymPosCd;
    DsDevSaleInfoInVO.insttItrr =  "";
    DsDevSaleInfoInVO.cntcDvCd =  "";
    DsDevSaleInfoInVO.agmtPrnplInfo1Amt =  strZero;
    DsDevSaleInfoInVO.agmtPrnplInfo2Amt =  strZero;
    DsDevSaleInfoInVO.mnthInsttInfo1Amt =  strZero;
    DsDevSaleInfoInVO.mnthInsttInfo2Amt =  strZero;
    DsDevSaleInfoInVO.toinsttFee =  "";
    DsDevSaleInfoInVO.slt1ToinsttFee =  strZero;
    DsDevSaleInfoInVO.slt2ToinsttFee =  strZero;
    DsDevSaleInfoInVO.slt1MnthBillAmt =  strZero;
    DsDevSaleInfoInVO.slt2MnthBillAmt =  strZero;
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
    DsEntrOnlineSaleInVO.stepMnpChngDttm = stepMnpChngDttm;
    DsEntrOnlineSaleInVO.stepCustCd = "9";
    DsEntrOnlineSaleInVO.stepCustChngDttm = stepCustChngDttm;
    DsEntrOnlineSaleInVO.stepSvcCd =  "9";
    DsEntrOnlineSaleInVO.stepSvcChngDttm =  stepSvcChngDttm;
    DsEntrOnlineSaleInVO.stepDevcCd =  stepDevcCd;
    DsEntrOnlineSaleInVO.stepDevcChngDttm =  "";
    DsEntrOnlineSaleInVO.stepCustAgrmtYn =  stepCustAgrmtYn;
    DsEntrOnlineSaleInVO.stepCustAgrmtChngDttm =  "";
    DsEntrOnlineSaleInVO.entrRqstChnlKdCd =  "1";
    DsEntrOnlineSaleInVO.prssEvntCd =  "NAC";
    DsEntrOnlineSaleInVO.rgstDt = rgstDt;
    DsEntrOnlineSaleInVO.entrRsvDttm = entrRsvDttm;
    DsEntrOnlineSaleInVO.prssDt =  "";
    DsEntrOnlineSaleInVO.prssMemo =  "";
    DsEntrOnlineSaleInVO.prssRsultCd =  prssRsultCd;
    DsEntrOnlineSaleInVO._workDv = _workDv;
    DsEntrOnlineSaleInVO._jobBiz = _jobBiz;
    DsEntrOnlineSaleInVO.inputAddJson =  "";
    DsEntrOnlineSaleInVO.nextOperatorId =  "1100000288";

    if($("#watchTp").val() == "G" || $("#watchTp").val() == "A"){
    	if($("#watchSharYn").val() == "Y"){
    		DsEntrBySvcInfoInVO.cnvgEntrNo = $("#oppntServiceId").val();
            DsEntrBySvcInfoInVO.cnvgTypCd = "W2U";
            DsEntrBySvcInfoInVO.cnvgSvcCd = $("#oppntMnoProdCd").val();
    	}
    	else{
    		DsEntrBySvcInfoInVO.cnvgEntrNo = "";
            DsEntrBySvcInfoInVO.cnvgTypCd = "";
            DsEntrBySvcInfoInVO.cnvgSvcCd = "";
    	}
    }
    else{
    	DsEntrBySvcInfoInVO.cnvgEntrNo = "";
        DsEntrBySvcInfoInVO.cnvgTypCd = "";
        DsEntrBySvcInfoInVO.cnvgSvcCd = "";
    }

    DsEntrBySvcInfoInVO.lteFrstDscntDvVlue = "";
    DsEntrBySvcInfoInVO.smlsStlmUseDenyYn = "Y";
    DsEntrBySvcInfoInVO.mbrshCardRqstYn = "";
    DsEntrBySvcInfoInVO.trmnsAvrDataUsage = "";
    DsEntrBySvcInfoInVO.trmnsAvrVceUsage = "";
    DsEntrBySvcInfoInVO.trmnsAvrSmsUsage = "";
    DsEntrBySvcInfoInVO.lmtStlmUseDenyYn = "Y";
    DsEntrBySvcInfoInVO.phncarEntrYn = "N";
    DsEntrBySvcInfoInVO.phncarEntrKdCd = "";
    DsEntrBySvcInfoInVO.svcCd = $("#mnoProdCd").val();
    DsEntrBySvcInfoInVO.ppNm = "";
    DsEntrBySvcInfoInVO.inputAddJson = "";
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

    var DsEntrRsvBySvcListInVO_Array = new Array();

	var strSvc = $("#sm005_svc").val();
	var svccnt = Number($("#sm005_svc_cnt").val());

	var svcArrTmp = strSvc.split("|");

	for(var i=0 ; i < svccnt ; i++){
		var svcArr    = svcArrTmp[i].split("^");

	    DsEntrRsvBySvcListInVO.entrRsvProdCd = "LZP0000001";
	    DsEntrRsvBySvcListInVO.entrRsvSvcCd = svcArr[0];
	    DsEntrRsvBySvcListInVO.svcKdCd = svcArr[1];
	    DsEntrRsvBySvcListInVO.svcLvlCd = "I";
	    DsEntrRsvBySvcListInVO.ndblCvrtSvcCd = "";
	    DsEntrRsvBySvcListInVO.svcNm = "";
	    DsEntrRsvBySvcListInVO._rowStatus = "I";
	    DsEntrRsvBySvcListInVO.inputAddJson = "";
	    DsEntrRsvBySvcListInVO.nextOperatorId = "1100000288";

	    DsEntrRsvBySvcListInVO_Array.push(DsEntrRsvBySvcListInVO);
	    DsEntrRsvBySvcListInVO  = new Object();
	}

    DsCustInfoInVO.hldrCustNo =  custNo;
    DsCustInfoInVO.rlusrCustNo = custNo;
    DsCustInfoInVO.billAcntNo =  billAcntNo;
    DsCustInfoInVO.welfCommDscntRqstYn = "";
    DsCustInfoInVO.lawcAgntCustNo = $("#legalRprsnCustNo").val();
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

    DsJncoCpnInfoInVO.jncoCpnNo = strBlank;
    DsJncoCpnInfoInVO.jncoCpnAmt = strZero;
    DsJncoCpnInfoInVO.nextOperatorId = "1100000288";

	RequestBody.DsEntrInfoInVO         = DsEntrInfoInVO        ;
	RequestBody.DsConfldsInVO          = DsConfldsInVO         ;
	RequestBody.DsDevSaleInfoInVO      = DsDevSaleInfoInVO     ;
	RequestBody.DsEntrOnlineSaleInVO   = DsEntrOnlineSaleInVO  ;
	RequestBody.DsEntrBySvcInfoInVO    = DsEntrBySvcInfoInVO   ;
	RequestBody.DsRsvMnpInfoInVO       = DsRsvMnpInfoInVO      ;
	RequestBody.DsAtrctInfoInVO        = DsAtrctInfoInVO       ;
	RequestBody.DsAsgnNoListInVO       = DsAsgnNoListInVO      ;
	RequestBody.DsEntrRsvBySvcListInVO = DsEntrRsvBySvcListInVO_Array;
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
				//resultCode = response.data.RetrieveCustInfoResponse.ResponseRecord.BusinessHeader.ResultCode;
				resultCode1 = response.data.SaveEntrSaleOnlineInfoEsbResponse.ResponseRecord.ResponseBody.ResultInfoOutVO.resultCode;
				mvnoRcptNo  = response.data.SaveEntrSaleOnlineInfoEsbResponse.ResponseRecord.ResponseBody.ResultInfoOutVO.entrRsvRcptSeqno;
			}catch(e){

			}

			console.log('sendSB803 resultCode='+resultCode+' resultCode1='+resultCode1+' mvnoRcptNo='+mvnoRcptNo);

			if(resultCode == 'N0000' && resultCode1 == '0000'){
				if(step == 'DEV'){
					sendSB803('AGR');//세번째 , 약관동의관련 체크
				}else if(step == 'AGR'){
					sendSB806();//실시간 스마트 가입 조회
				}else{
					sendSB803('DEV'); //두번째 , BLANK , 0
				}
			}else if(resultCode != 'N0000'){
				hideOpenBar();
                let opt = {
                     msg         : response.resultMessage,
                     cfrmYn      : false
                };
                popalarm(opt);
			}else{
				hideOpenBar();
				popalarmRetry();
			}
		},
		error: function(request,status,error){
			hideOpenBar();
			popalarmRetry();
		}
	});//end ajax
}

//실시간 스마트 가입 조회
function sendSB806(){

	var base = new Object();
	var data = new Object();

	var RetrieveOnlineSaleAllInfoEsb = new Object();

	var RequestRecord = new Object();
	var RequestBody = new Object();

	var DsInInfoInVO = new Object();

	base.serviceId = "SB806";

	DsInInfoInVO.entrRsvRcptSeqno = $("#mvnoRcptNo").val();
	DsInInfoInVO.nextOperatorId   = "1100000288";


   	RequestBody.DsInInfoInVO  = DsInInfoInVO;
	RequestRecord.RequestBody = RequestBody;
	RetrieveOnlineSaleAllInfoEsb.RequestRecord = RequestRecord;
	data.RetrieveOnlineSaleAllInfoEsb = RetrieveOnlineSaleAllInfoEsb;
	base.data = data;

	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/SB806',
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

			var resultCode  = "";
			var resultCode1 = "";
			var resultMessage = "";

			var hldrCustNo = "";
			var billAcntNo = "";
			var stepCustCd = "";
			var stepSvcCd  = "";
			var stepDevcCd = "";
			var stepCustAgrmtYn = "";

			try{
				resultCode      = response.resultCode;
				resultCode1     = response.data.RetrieveOnlineSaleAllInfoEsbResponse.ResponseRecord.BusinessHeader.ResultCode;
				resultMessage   = response.data.RetrieveOnlineSaleAllInfoEsbResponse.ResponseRecord.BusinessHeader.ResultMessage;

				hldrCustNo      = response.data.RetrieveOnlineSaleAllInfoEsbResponse.ResponseRecord.ResponseBody.DsCustInfoOutVO[0].hldrCustNo;
				billAcntNo      = response.data.RetrieveOnlineSaleAllInfoEsbResponse.ResponseRecord.ResponseBody.DsCustInfoOutVO[0].billAcntNo;
				stepCustCd      = response.data.RetrieveOnlineSaleAllInfoEsbResponse.ResponseRecord.ResponseBody.DsEntrOnlineSaleOutVO[0].stepCustCd;
				stepSvcCd       = response.data.RetrieveOnlineSaleAllInfoEsbResponse.ResponseRecord.ResponseBody.DsEntrOnlineSaleOutVO[0].stepSvcCd;
				stepDevcCd      = response.data.RetrieveOnlineSaleAllInfoEsbResponse.ResponseRecord.ResponseBody.DsEntrOnlineSaleOutVO[0].stepDevcCd;
				stepCustAgrmtYn = response.data.RetrieveOnlineSaleAllInfoEsbResponse.ResponseRecord.ResponseBody.DsEntrOnlineSaleOutVO[0].stepCustAgrmtYn;
			}catch(e){
				resultMessage  = response.resultMessage;
			}

			if($("#usrId").val() == "yuj1904"){
                console.log('테스트 - 예외처리');
                resultCode1 = '99999999';
			}

			console.log('SB806 resultCode='+resultCode +  ' resultCode1='+resultCode1 + ' hldrCustNo=' + hldrCustNo );
			if(resultCode == 'N0000' && resultCode1 == 'N0000' && hldrCustNo != '' && billAcntNo != '' && stepCustCd == '9' && stepSvcCd == '9' && stepDevcCd == '9' && stepCustAgrmtYn == '9' ){
				//popalarm('SB806 ' + resultMessage, "info", false);
				sendSB816();//스마트 개통완료 처리
			}else if(resultCode1 !== 'N0000'){
				hideOpenBar();
                let opt = {
                     msg         : resultMessage,
                     cfrmYn      : false
                };
                popalarm(opt);
			}else{
				hideOpenBar();
                let opt = {
                     msg         : "[SB806]일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                     cfrmYn      : false
                };
                popalarm(opt);
			}
		},
		error: function(request,status,error){
			hideOpenBar();
			popalarmRetry();
		}
	});//end ajax
}

//스마트 개통완료 처리
function sendSB816(){

	var ymdhms     = getYYYYMMDDHHMMSS();
	var ymd        = getYYYYMMDD();
	var prodRqstNo = $("#applSeqNo").val();

	var billAcntNo  = $("#billAcntNo").val();
	var prodNo		= $("#mtelNo").val();//전화번호
	var custNo      = $("#custNo").val();

	var base = new Object();
	var data = new Object();

	var CreateSmrtActivMobile = new Object();

	var RequestRecord = new Object();
	var RequestBody = new Object();

	var DsEntrOnlineSaleInVO = new Object();

	base.serviceId = "SB816";

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


    DsEntrOnlineSaleInVO.entrRsvRcptSeqno = $("#mvnoRcptNo").val();
    DsEntrOnlineSaleInVO.dsAsgnNoList = "[]";
    DsEntrOnlineSaleInVO.dsBillAcnt = "[]";
    DsEntrOnlineSaleInVO.dsChkFtr = "[]";
    DsEntrOnlineSaleInVO.dsChkSvc = "[]";

    //[]
	DsEntrOnlineSaleInVO.dsConflds = "[{ ";
    DsEntrOnlineSaleInVO.dsConflds += "\"userOrgCd\":\"\",                  ";
    DsEntrOnlineSaleInVO.dsConflds += "\"aceno\":\"\",                      ";
    DsEntrOnlineSaleInVO.dsConflds += "\"userDlrNm\":\"KB국민은행지점\",    ";
    DsEntrOnlineSaleInVO.dsConflds += "\"runDate\":\""+getYYYYMMDD()+"\",   ";
    DsEntrOnlineSaleInVO.dsConflds += "\"_transactionMode\":\"\",           ";
    DsEntrOnlineSaleInVO.dsConflds += "\"_applicationId\":\"IF-SB-816\",    ";
    DsEntrOnlineSaleInVO.dsConflds += "\"extduYn\":\"Y\",                   ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizbrCdLvl45\":\"\",               ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizbrNmLvl25\":\"\",               ";
    DsEntrOnlineSaleInVO.dsConflds += "\"orgNm\":\"\",                      ";
    DsEntrOnlineSaleInVO.dsConflds += "\"entrDlUpdateStamp\":\"\",          ";
    DsEntrOnlineSaleInVO.dsConflds += "\"rankNm\":\"\",                     ";
    DsEntrOnlineSaleInVO.dsConflds += "\"lockMode\":\"\",                   ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizBrCdLvl1\":\"\",                ";
    DsEntrOnlineSaleInVO.dsConflds += "\"orgmgrUserId\":\"\",               ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizbrCdLvl2\":\"\",                ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizbrCdLvl3\":\"\",                ";
    DsEntrOnlineSaleInVO.dsConflds += "\"hposOrgCd\":\"\",                  ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizbrCdLvl4\":\"\",                ";
    DsEntrOnlineSaleInVO.dsConflds += "\"entrSysUpdateDate\":\"\",          ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizbrCdLvl5\":\"\",                ";
    DsEntrOnlineSaleInVO.dsConflds += "\"workDlrGrpCd\":\"315397\",         ";
    DsEntrOnlineSaleInVO.dsConflds += "\"cntcSysUpdateDate\":\"\",          ";
    DsEntrOnlineSaleInVO.dsConflds += "\"billSysUpdateDate\":\"\",          ";
    DsEntrOnlineSaleInVO.dsConflds += "\"userDlrGrpCd\":\"Fa\",             ";
    DsEntrOnlineSaleInVO.dsConflds += "\"_directive\":\"\",                 ";
    DsEntrOnlineSaleInVO.dsConflds += "\"orgCd\":\"\",                      ";
    DsEntrOnlineSaleInVO.dsConflds += "\"orgKdCd\":\"\",                    ";
    DsEntrOnlineSaleInVO.dsConflds += "\"mrktCd\":\"KBM\",                  ";
    DsEntrOnlineSaleInVO.dsConflds += "\"workDlrNm\":\"KB국민은행지점\",    ";
    DsEntrOnlineSaleInVO.dsConflds += "\"_runDateDtm\":\""+ymdhms+"\",      ";
    DsEntrOnlineSaleInVO.dsConflds += "\"cntcDlUpdateStamp\":\"\",          ";
    DsEntrOnlineSaleInVO.dsConflds += "\"fixedOrgCd\":\"315397\",           ";
    DsEntrOnlineSaleInVO.dsConflds += "\"hposOrgmgrId\":\"\",               ";
    DsEntrOnlineSaleInVO.dsConflds += "\"userWorkDlrNm\":\"KB국민은행지점\", ";
    DsEntrOnlineSaleInVO.dsConflds += "\"orgDvCd\":\"\",                    ";
    DsEntrOnlineSaleInVO.dsConflds += "\"rankCd\":\"\",                     ";
    DsEntrOnlineSaleInVO.dsConflds += "\"runDateDtm\":\""+ymdhms+"\",       ";
    DsEntrOnlineSaleInVO.dsConflds += "\"userNm\":\"\",                     ";
    DsEntrOnlineSaleInVO.dsConflds += "\"fixedOrgNm\":\"\",                 ";
    DsEntrOnlineSaleInVO.dsConflds += "\"billDlUpdateStamp\":\"\",          ";
    DsEntrOnlineSaleInVO.dsConflds += "\"ctnDlUpdateStamp\":\"\",           ";
    DsEntrOnlineSaleInVO.dsConflds += "\"hposOrgNm\":\"\",                  ";
    DsEntrOnlineSaleInVO.dsConflds += "\"cnId\":\"\",                       ";
    DsEntrOnlineSaleInVO.dsConflds += "\"empno\":\"\",                      ";
    DsEntrOnlineSaleInVO.dsConflds += "\"billAcntNo\":\""+billAcntNo+"\",   ";
    DsEntrOnlineSaleInVO.dsConflds += "\"ctnSysUpdateDate\":\"\",           ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizbrNmLvl45\":\"\",               ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizbrCdPath\":\"\",                ";
    DsEntrOnlineSaleInVO.dsConflds += "\"dlrCd\":\"315397\",                ";
    DsEntrOnlineSaleInVO.dsConflds += "\"workDlrCd\":\"315397\",            ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizbrNmlvl4\":\"\",                ";
    DsEntrOnlineSaleInVO.dsConflds += "\"userDlrCd\":\"315397\",            ";
    DsEntrOnlineSaleInVO.dsConflds += "\"_operatorId\":\"1100000288\",      ";
    DsEntrOnlineSaleInVO.dsConflds += "\"userWorkDlrCd\":\"315397\",        ";
    DsEntrOnlineSaleInVO.dsConflds += "\"dlrGrpCd\":\"Fa\",                 ";
    DsEntrOnlineSaleInVO.dsConflds += "\"prodNo\":\""+prodNo+"\",           ";
    DsEntrOnlineSaleInVO.dsConflds += "\"inlnNo\":\"\",                     ";
    DsEntrOnlineSaleInVO.dsConflds += "\"transactionMode\":\"\",            ";
    DsEntrOnlineSaleInVO.dsConflds += "\"userDvCd\":\"PARTNER\",            ";
    DsEntrOnlineSaleInVO.dsConflds += "\"userLginIp\":\"\",                 ";
    DsEntrOnlineSaleInVO.dsConflds += "\"userId\":\"1100000288\",           ";
    DsEntrOnlineSaleInVO.dsConflds += "\"dlrEmpType\":\"\",                 ";
    DsEntrOnlineSaleInVO.dsConflds += "\"directive\":\"\",                  ";
    DsEntrOnlineSaleInVO.dsConflds += "\"_workDv\":\"ACT\",                 ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizbrNmLvl1\":\"\",                ";
    DsEntrOnlineSaleInVO.dsConflds += "\"_runDate\":\""+ymd+"\",            ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizbrNmLvl2\":\"\",                ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizbrCdLvl25\":\"\",               ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizbrNmLvl3\":\"\",                ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizbrNmLvl5\":\"\",                ";
    DsEntrOnlineSaleInVO.dsConflds += "\"chnlCd\":\"\",                     ";
    DsEntrOnlineSaleInVO.dsConflds += "\"dlrNm\":\"KB국민은행지점\",        ";
    DsEntrOnlineSaleInVO.dsConflds += "\"userWorkDlrGrpCd\":\"Fa\",       ";
    DsEntrOnlineSaleInVO.dsConflds += "\"orgLvl\":\"\",                     ";
    DsEntrOnlineSaleInVO.dsConflds += "\"intgUserId\":\"\",                 ";
    DsEntrOnlineSaleInVO.dsConflds += "\"orgAddKdCd\":\"\"                  ";
    DsEntrOnlineSaleInVO.dsConflds += "}]";

    //var dsConfldsArr = new Array();
    //dsConfldsArr.push(DsEntrOnlineSaleInVO.dsConflds);
    //DsEntrOnlineSaleInVO.dsConflds =  dsConfldsArr;

    DsEntrOnlineSaleInVO.dsCustAgrmtInfo = "[]";

    var legalRprsnYn = $("#legalRprsnYn").val();
    var lawcAgntCustNo = (legalRprsnYn == 'Y') ? $("#legalRprsnCustNo").val() : "";

    DsEntrOnlineSaleInVO.dsCustInfo =  "{ ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"aceno\":\"\",                          ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"lawcAgntPersNo\":\"\",                 ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"lawcAgntNm\":\"\",                     ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"agntStayLcnsCd\":\"\",                 ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"custDvCd\":\""+vCustDvCd+"\",          ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"nextOperatorId\":\"1100000288\",       ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"stayLcnsCd\":\""+vStayLcnsCd+"\",      ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"ntnltCd\":\"\",                        ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"kisCrdtRsltCd\":\"\",                  ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"cbscore\":\"ZZ\",                      ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"cbscoreRsnCd\":\"ZZ\",                 ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"spamKaitYn\":\"\",                     ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"entrNo\":\"\",                         ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"ocrSeqno\":\"\",                       ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"lawcAgntCustNo\":\""+lawcAgntCustNo+"\",";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"agntNtnltCd\":\"\",                    ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"custKdCd\":\""+vCustKdCd+"\",          ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"prodNo\":\""+prodNo+"\",               ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"custNo\":\""+custNo+"\",               ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"elecDocNo\":\"\",                      ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"agntStayTermEndDt\":\"\",              ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"stayTermEndDt\":\""+vStayTermEndDt+"\",";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"prodRqstNo\":\""+prodRqstNo+"\",       ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"cbscoreCustGubun\":\"\",               ";
    DsEntrOnlineSaleInVO.dsCustInfo += "\"kaitAuthRsltCd\":\""+prodRqstNo+"\"    ";
    DsEntrOnlineSaleInVO.dsCustInfo += "}";

    //var dsCustInfoArr = new Array();
    //dsCustInfoArr[0] = DsEntrOnlineSaleInVO.dsCustInfo;
    //DsEntrOnlineSaleInVO.dsCustInfo =  dsCustInfoArr[0];
    //DsEntrOnlineSaleInVO.dsCustInfo = JSON.parse(DsEntrOnlineSaleInVO.dsCustInfo);

    DsEntrOnlineSaleInVO.dsEntfRsltInfo = "[]";
    DsEntrOnlineSaleInVO.dsEntrAtrctInfo = "[]";
    DsEntrOnlineSaleInVO.dsEntrInfo = "[]";

    //[]
    DsEntrOnlineSaleInVO.dsEntrMemo  = "[{ ";
    DsEntrOnlineSaleInVO.dsEntrMemo += "\"msgParm2\":\"\",           ";
	DsEntrOnlineSaleInVO.dsEntrMemo += "\"MemoDvCd\":\"userMemo\",   ";
    DsEntrOnlineSaleInVO.dsEntrMemo += "\"msgParm1\":\""+ymd.substr(0,4)+"-"+ymd.substr(4,2)+"-"+ymd.substr(6,2)+"\", ";
    DsEntrOnlineSaleInVO.dsEntrMemo += "\"memoTxt\":\"\",            ";
    DsEntrOnlineSaleInVO.dsEntrMemo += "\"msgParm4\":\"\",           ";
    DsEntrOnlineSaleInVO.dsEntrMemo += "\"msgParm3\":\"\",           ";
    DsEntrOnlineSaleInVO.dsEntrMemo += "\"msgParm5\":\"\"            ";
    DsEntrOnlineSaleInVO.dsEntrMemo += "}]";

    //var dsEntrMemoArr = new Array();
    //dsEntrMemoArr.push(DsEntrOnlineSaleInVO.dsEntrMemo);
    //DsEntrOnlineSaleInVO.dsEntrMemo =  dsEntrMemoArr;
    //DsEntrOnlineSaleInVO.dsEntrMemo = JSON.parse(DsEntrOnlineSaleInVO.dsEntrMemo);

    DsEntrOnlineSaleInVO.dsEntrRqstProdInfo = "[]";
    DsEntrOnlineSaleInVO.dsEqpDocInfo = "[]";
    DsEntrOnlineSaleInVO.dsFormList = "[]";
    DsEntrOnlineSaleInVO.dsLzone = "[]";
    DsEntrOnlineSaleInVO.dsLawcAgntInfo = "[]";
    DsEntrOnlineSaleInVO.dsParams = "[]";
    DsEntrOnlineSaleInVO.dsUserMemo = "[]";
    DsEntrOnlineSaleInVO.dsSmsMsg = "[]";
    DsEntrOnlineSaleInVO.dsPymAcntS = "[]";

    if(applTp == 'N'){
   		DsEntrOnlineSaleInVO.dsAutn0300 = "[]";
    }else{
    	DsEntrOnlineSaleInVO.dsAutn0300 = "[]";
    }

    DsEntrOnlineSaleInVO.dsChkItem = "[]";
    DsEntrOnlineSaleInVO.dsChkUsim = "[]";
    DsEntrOnlineSaleInVO.dsUsimSaleInfo = "[]";
    DsEntrOnlineSaleInVO.dsDevSaleChrgPym = "[]";
    DsEntrOnlineSaleInVO.dsDevSaleInfo = "[]";
    DsEntrOnlineSaleInVO.dsDevSaleInstt = "[]";

    //[]
    DsEntrOnlineSaleInVO.dsCustCrdtInfo  = "[{ ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"aceno\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"prodNo\":\""+prodNo+"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"custNo\":\""+custNo+"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"elecDocNo\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"lawcAgntPersNo\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"agntStayTermEndDt\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"lawcAgntNm\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"agntStayLcnsCd\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"custDvCd\":\" "+vCustDvCd+" \", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"nextOperatorId\":\"1100000288\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"stayLcnsCd\":\" "+vStayLcnsCd+" \", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"prodRqstNo\":\""+prodRqstNo+"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"ntnltCd\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"kisCrdtRsltCd\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"cbscore\":\"ZZ\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"cbscoreRsnCd\":\"ZZ\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"spamKaitYn\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"entrNo\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"ocrSeqno\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"lawcAgntCustNo\":\""+lawcAgntCustNo+"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"agntNtnltCd\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"cbscoreCustGubun\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"kaitAuthRsltCd\":\""+prodRqstNo+"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"custKdCd\":\""+vCustKdCd+"\" ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "}]";

    //var dsCustCrdtInfoArr = new Array();
    //dsCustCrdtInfoArr.push(DsEntrOnlineSaleInVO.dsCustCrdtInfo);
    //DsEntrOnlineSaleInVO.dsCustCrdtInfo =  dsCustCrdtInfoArr;
    //DsEntrOnlineSaleInVO.dsCustCrdtInfo = JSON.parse(DsEntrOnlineSaleInVO.dsCustCrdtInfo);

    DsEntrOnlineSaleInVO.dsCardAprvInfo = "[]";
    DsEntrOnlineSaleInVO.dsScanInfo = "[]";

    DsEntrOnlineSaleInVO.dsEtcInfo1 = "{";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"changeYn\": \"N\",                  ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"dvAmtMemoifYn\": \"Y\",             ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"endDate\": \"99991231235959\",      ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"ktAmt\": \"0\",                     ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"dobDutyInsttInd\": \"N\",           ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"saleCode\": \"BLANK         \",     ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"dealerGubun\": \"GG\",              ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"adjReversedYn\": \"Y\",             ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"adjYn\": \"Y\",                     ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"mnpAmt\": \"0\",                    ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"plcyCode\": \"BLANK         \",     ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"dobDutySpPlusIn\": \"N\",           ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"billMessage\": \"\",                ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"dealerDvCd\": \"O\",                ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"deliveryAmt\": \"0\",               ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"misc2Amt\": \"0\",                  ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"bountyGiveYn\": \"Y\",              ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"chargerAmt\": \"0\",                ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"ssDevDscntYn\": \"N\",              ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"level1\": \"MAS\",                  ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"entrFee\": \"0\",                   ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"level3\": \"T10\",                  ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"mnpCustInd\": \"A\",                ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"startDate\": \""+ymd+"000000\",    ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"level2\": \"S01\",                  ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"dobDutySpInd\": \"N\",              ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"cmpnsUseDvYn\": \"N\",              ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"discountAmt\": \"0\",               ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"dobDutyAgmtInd\": \"N\",            ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"saleType\": \"A\",                  ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"maxAmt\": \"0\",                    ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"actvLevel\": \"100000  \",          ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"hlspAdjAmtAplyYn\": \"N\",          ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"agdcCntcMnbr\": \"0\",              ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"dvnotChngDays\": \"0 \",            ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"hlspAdjAmt\": \"0\",                ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"addAmt\": \"0\",                    ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"mnpCustDvCd\": \"A\",               ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"misc1Amt\": \"0\",                  ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"insttHelpYn\": \"N\",               ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"mnpYn\": \"Y\",                     ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"subsidyAmt\": \"0\",                ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"ownrNotChngDays\": \"0 \",          ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"dutyAgmtInd\": \"Y\",               ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"ddDiscAmt\": \"0\",                 ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"dobDutyAgmtYn\": \"N\",             ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"ssInsttHelpYn\": \"N\",             ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"rentYn\": \"N\",                    ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"bigSaleInd\": \"Y\",                ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"minAmt\": \"0\",                    ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"discAmt\": \"0\",                   ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"modelInd\": \"N\",                  ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"saleGubun\": \"ZZ\",                ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"amtYn\": \"N\",                     ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"cmpnsAdjAmt\": \"0\",               ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"plcyDesc\": \"BLANK\",              ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"dutyUseMnth\": \"0\"                ";
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "}";

    DsEntrOnlineSaleInVO.dsEtcInfo2 = "{}";

    DsEntrOnlineSaleInVO.dsEtcInfo3 = "{";
	DsEntrOnlineSaleInVO.dsEtcInfo3 += "\"dpDscntInd\": \"N\",    ";
	DsEntrOnlineSaleInVO.dsEtcInfo3 += "\"hpdisYn\": \"N\",       ";
	DsEntrOnlineSaleInVO.dsEtcInfo3 += "\"gradeRsn\": \"\",       ";
	DsEntrOnlineSaleInVO.dsEtcInfo3 += "\"gradeAmt\": \"0\",      ";
	DsEntrOnlineSaleInVO.dsEtcInfo3 += "\"errMsg\": \"\",         ";
	DsEntrOnlineSaleInVO.dsEtcInfo3 += "\"hpdisPlcyCd\": \"\",    ";
	DsEntrOnlineSaleInVO.dsEtcInfo3 += "\"dpDscntAmt\": \"0\",    ";
	DsEntrOnlineSaleInVO.dsEtcInfo3 += "\"prssYn\": \"N\",        ";
	DsEntrOnlineSaleInVO.dsEtcInfo3 += "\"devcPrmn\": \"0\",      ";
	DsEntrOnlineSaleInVO.dsEtcInfo3 += "\"devcSbsd\": \"0\",      ";
	DsEntrOnlineSaleInVO.dsEtcInfo3 += "\"hpdisRsn\": \"\",       ";
	DsEntrOnlineSaleInVO.dsEtcInfo3 += "\"rate\": \"0\",          ";
	DsEntrOnlineSaleInVO.dsEtcInfo3 += "\"sbsdPayAmt\": \"0\",    ";
	DsEntrOnlineSaleInVO.dsEtcInfo3 += "\"entrRsvDttm\": \"\",    ";
	DsEntrOnlineSaleInVO.dsEtcInfo3 += "\"gradeInd\": \"X\",      ";
	DsEntrOnlineSaleInVO.dsEtcInfo3 += "\"hpdisPlcySrlno\": \"\", ";
	DsEntrOnlineSaleInVO.dsEtcInfo3 += "\"cashAcumAmt\": \"0\"    ";
	DsEntrOnlineSaleInVO.dsEtcInfo3 += "}";

    DsEntrOnlineSaleInVO.dsEtcInfo4 = "{}";

    DsEntrOnlineSaleInVO.dsEtcInfo5 = "{";

    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msPtreePymtOver\": \"\",            ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msInsttImpsblAuth\": \"\",            ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msDevcDlvrAmt\": \"0\", ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msInsttPsblCustYn\": \"Y\", ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msKbptPntLmt\": \"\",            ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msDevSbsdPsblYn\": \"N\", ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"insttYn\": \"Y\", ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msPhnCmpnChk\": \"\",            ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msInsttDeferYn\": \"N\", ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msCorporationAct\": \"N\", ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"insttDvCd\": \"N\", ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msRnmCnfmYn\": \"\",            ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msETaxBillYn\": \"N\", ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msKbptCardTp\": \"\",            ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msDpDscntAmt\": \"0\", ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msNewActType\": \"N\", ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msDevcSbsd\": \"\",            ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msSbsdAmtTot\": \"\",            ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msInsttMnbr\": \"\",            ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msDlrSbsdRate\": \"\",            ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msLastInsttMnbr\": \"\",            ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msInsttDobYn\": \"\",            ";

	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msAgmtInfo2Rate\": \"\",            ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msExtnGrtinsExmp\": \"\",           ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msKisBadCust\": \"\",               ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msInsttDvDetlCd\": \"\",            ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"cardYn\": \"Y\",                    ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msGrtinsFee\": \"0\",               ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msSbsdPqyAmt\": \"\",               ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msRvinsCmpsnPsblYn\": \"N\",        ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msSpclAmtYn\": \"\",                ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msEntrRsvDttm\": \"\",              ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msInsttExmpt\": \"\",               ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msE9InsttPsbl\": \"N\",             ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msInsttPsblPlcyYn\": \"\",          ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msMns24Infee\": \"\",               ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msBillTrgtYn\": \"\",               ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msMnthInsttInfo1Amt\": \"\",        ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"miLowerPrc\": \"\",                 ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"cprtCardYn\": \"N\",                ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msGrtinsFeePymMthdCd\": \"X\",      ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msKbptDlrInd\": \"\",               ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msShCardRtnAmt\": \"0\",            ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msIPhonDscntYn\": \"N\",            ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msAgmtPrnplInfo2Amt\": \"0\",       ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msKbptInstMnth\": \"\",             ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"rsltMsg\": \"\",                    ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msExtnInsttEntr2CntYn\": \"\",      ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"cashYn\": \"\",                     ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msMonthPayAmt\": \"\",              ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msBeforeComp\": \"\",               ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msShinHanCardPrevSrchType\": \"\",  ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"sCmpsnMsg\": \"\",                  ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msDevcPrmn\": \"\",                 ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"sCmpsnYn\": \"N\",                  ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msMnthInsttInfo2Amt\": \"\",        ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msKbptGPntLmt\": \"\",              ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"miUpperPrc\": \"\",                 ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msInsttMonth\": \"\",               ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msIPhonDscntAmt\": \"0\",           ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msCashAcumAmt\": \"0\",             ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msLawcAgntExstnYn\": \"\",          ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msAgmtPrnplInfo1Amt\": \"0\",       ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msSchndDevPucsChg\": \"N\",         ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msKbptPntMgr\": \"N\",              ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msIsPlcyBlank\": \"Y\",             ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"rvinsAgrmtYn\": \"\",               ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msDevSbsd2CntPsblYn\": \"N\",       ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msBankBizPlcyCd\": \"\",            ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msUseDts\": \"0\"                   ";
	DsEntrOnlineSaleInVO.dsEtcInfo5 += "}";

    //[]
    DsEntrOnlineSaleInVO.dsJncoCpnInfo  = "[{ ";
    DsEntrOnlineSaleInVO.dsJncoCpnInfo += "\"jncoCpnNo\":\"BLANK\", ";
    DsEntrOnlineSaleInVO.dsJncoCpnInfo += "\"jncoCpnAmt\":\"0\", ";
    DsEntrOnlineSaleInVO.dsJncoCpnInfo += "\"nextOperatorId\":\"1100000288\" ";
    DsEntrOnlineSaleInVO.dsJncoCpnInfo += "}]";

    //var dsJncoCpnInfoArr = new Array();
    //dsJncoCpnInfoArr.push(DsEntrOnlineSaleInVO.dsJncoCpnInfo);
    //DsEntrOnlineSaleInVO.dsJncoCpnInfo =  dsJncoCpnInfoArr;
    //DsEntrOnlineSaleInVO.dsJncoCpnInfo = JSON.parse(DsEntrOnlineSaleInVO.dsJncoCpnInfo);

    DsEntrOnlineSaleInVO.nextOperatorId = "1100000288";

   	RequestBody.DsEntrOnlineSaleInVO  = DsEntrOnlineSaleInVO;
	RequestRecord.RequestBody = RequestBody;
	CreateSmrtActivMobile.RequestRecord = RequestRecord;
	data.CreateSmrtActivMobile = CreateSmrtActivMobile;

	base.data = data;
	base.processMode = "backend";
	base.vtDevType = getVtDevTyp();
	base.pApplSeqNo = $("#applSeqNo").val();
	base.pSoId = $("#soId").val();

	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/SB816',
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
			var rsltCd		  = "";
			var prodNo		  = "";
			var entrNo		  = "";

			try{
				resultCode    = response.resultCode;
				resultMessage = response.data.CreateSmrtActivMobileResponse.ResponseRecord.BusinessHeader.ResultMessage;
				rsltCd		  = response.data.CreateSmrtActivMobileResponse.ResponseRecord.ResponseBody.ResultInfoOutVO.rsltCd;
				prodNo		  = response.data.CreateSmrtActivMobileResponse.ResponseRecord.ResponseBody.ResultInfoOutVO.prodNo;
				entrNo		  = response.data.CreateSmrtActivMobileResponse.ResponseRecord.ResponseBody.ResultInfoOutVO.entrNo;
				resultMessage = (resultCode == 'N0000') ? response.data.CreateSmrtActivMobileResponse.ResponseRecord.ResponseBody.ResultInfoOutVO.resultMessage : resultMessage ;
			}catch(e){
				resultMessage  = response.resultMessage;
			}

			console.log('SB816 resultCode='+resultCode + ' rsltCd='+rsltCd + ' prodNo='+prodNo + " entrNo =" + entrNo + " resultMessage =" + resultMessage);

			if(resultCode == 'N0000' ){
				$("#SB816_RE").val("N");
				if(rsltCd == '0000' && prodNo != '' && entrNo != '' && resultMessage.indexOf("정상적으로 완료") > -1){
					if($("#watchTp").val() == "G" || $("#watchTp").val() == "A"){
						if($("#watchCombYn").val() == "Y"){
							sendAPIM0056(entrNo);
						}
					}
					updateApplStat(entrNo);
				}else{
					$("#SB816_RE").val("Y");
					hideOpenBar();
                    let opt = {
                         msg         : resultMessage,
                         cfrmYn      : false
                    };
                    popalarm(opt);
				}
			}else if(resultCode !== 'N0000'){
				$("#SB816_RE").val("Y");
				hideOpenBar();
                let opt = {
                     msg         : resultMessage,
                     cfrmYn      : false
                };
                popalarm(opt);

			}
		},
		error: function(request,status,error){
			$("#SB816_RE").val("Y");
			hideOpenBar();
			popalarmRetry();
		}
	});//end ajax

}

//통화중 대기 부가서비스 신청
function sendSM080(entrno){

	var base = new Object();
	var data = new Object();

	var CreateCallConviSvc = new Object();
	var RequestRecord = new Object();
	var RequestBody   = new Object();
	var DsReqInfoInVO   = new Object();

	DsReqInfoInVO.svcSetupYn  = "Y";
	DsReqInfoInVO.svcEntrYn   = "Y";
	DsReqInfoInVO.vcbxLinkYn  = "";
	DsReqInfoInVO.svcCd       = "Z100000006";
	DsReqInfoInVO.nextOperatorId  = "1100000288";
	DsReqInfoInVO.setupGuidMentKind = "";
	DsReqInfoInVO.gretKind          = "";
	DsReqInfoInVO.etcNoPrssMthd     = "";
	DsReqInfoInVO.sndrNIdcIsolKind  = "";
	DsReqInfoInVO.entrNo      = entrno;//"500134971066";
	DsReqInfoInVO.etcNoCvrtNo = "";
	DsReqInfoInVO.rcpNo2      = "";
	DsReqInfoInVO.rcpNo1      = "";

	RequestBody.DsReqInfoInVO   = DsReqInfoInVO;
	RequestRecord.RequestBody = RequestBody;
	CreateCallConviSvc.RequestRecord = RequestRecord;
	data.CreateCallConviSvc = CreateCallConviSvc;

	base.serviceId = "SM080";
	base.data = data;

	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/SM080',
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
			updateApplStat(entrno);
		},
		error: function(request,status,error){
			updateApplStat(entrno);
		}
	});//end ajax
}

//음성사서함 부가서비스 신청
function sendSM080_1(entrno){

	var base = new Object();
	var data = new Object();

	var CreateCallConviSvc = new Object();

	var RequestRecord = new Object();
	var RequestBody   = new Object();

	var DsReqInfoInVO   = new Object();

	DsReqInfoInVO.svcSetupYn  = "Y";
	DsReqInfoInVO.svcEntrYn   = "Y";
	DsReqInfoInVO.vcbxLinkYn  = "";
	DsReqInfoInVO.svcCd       = "Z100000028";
	DsReqInfoInVO.nextOperatorId  = "1100000288";
	DsReqInfoInVO.setupGuidMentKind = "";
	DsReqInfoInVO.gretKind          = "";
	DsReqInfoInVO.etcNoPrssMthd     = "";
	DsReqInfoInVO.sndrNIdcIsolKind  = "";
	DsReqInfoInVO.entrNo      = entrno;//"500134971066";
	DsReqInfoInVO.etcNoCvrtNo = "";
	DsReqInfoInVO.rcpNo2      = "";
	DsReqInfoInVO.rcpNo1      = "";

	RequestBody.DsReqInfoInVO   = DsReqInfoInVO;

	RequestRecord.RequestBody = RequestBody;

	CreateCallConviSvc.RequestRecord = RequestRecord;

	data.CreateCallConviSvc = CreateCallConviSvc;

	base.serviceId = "SM080";
	base.data = data;

	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/SM080',
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
			updateApplStat(entrno);
		},
		error: function(request,status,error){
			updateApplStat(entrno);
		}
	});//end ajax
}


//eSIM상태연동(모회선 자회선 연결)
function sendAPIM0056(entrNo){
	var param = new Object();
	var data = new Object();
	var Body = new Object();
	var nextOperatorId = "1100000288";

	param.serviceId = 'APIM0056';
	Body.trgtProdNo = getCtnFormat($('#oppntSvcTelNo').val());
	Body.entrNo = btoa(entrNo);

	data.body = Body;
	param.data = data;

	$.ajax({
	    url:  '/appIf/v1/uplus/esb/' + param.serviceId,
	    type: 'POST',
	    data: fnSign(JSON.stringify(param)),
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
	    success: function(data){
			if(data.resultCode == 'N0000' || data.resultCode == '200'){
				try{
					var rsltCd = data.data.dsRsltInfo.rsltCd;
					if(rsltCd == "SUCCESS"){
						var succYn = data.data.code;
						if(succYn == "0000"){
							console.log('결합성공');
						}
					}
				}
				catch(e){
					console.log(e);
				}
			}
	    },
	    error: function(e){
	        hideOpenBar();
	    	console.log(e);
	    },
	    complete: function() {
	    }
	});
}

//단말타입설정
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

	if($("#usimMngNo").val() == "K3600" || $("#usimMngNo").val() == "K9040" || $("#usimMngNo").val() == "U9110"){
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


function popalarmRetry(){
    let opt = {
         msg         : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
         cfrmYn      : false
    };
    popalarm(opt);
}
