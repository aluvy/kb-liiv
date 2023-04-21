var gTestArr = new Array();
var gTestObj = new Object();

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
				popalarm2("유심번호가 확인되었습니다.", "info", false, '', setDisabledUsim);
			}
			else{
				if(str != strTmp){
					popalarm2("기존 발급된 유심 일련번호 정보와 다릅니다. 정확히 입력해주세요.<br/><br/>유심번호가 변경된 경우 KB Liiv M 고객상담센터 1522-9999(유료)를 통해서 개통 가능합니다. 연결하시겠습니까?", "check", true, '', callbackCallCenter);
				}
				else{
					$("#btnOpenReq").prop("disabled",false);
					//showOpenBar();
					popalarm2("유심번호가 확인되었습니다.", "info", false, '', setDisabledUsim);
				}
			}
		}
	}//end if
}

//신청정보 데이터 세팅
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
	
	$("#pymMthd").val("CA");//CA: 현금 CO: 카드 
	
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
	$("#npAuthKey").val(data.npAuthKey);
	$("#npAuthMthd").val(data.npAuthMthd);
	
	$("#usimFeeCnt").val(data.usimFeeCnt);
	$("#mcoCd").val(data.befNp);
	
	applTp = data.applTp;//번호이동 M 신규가입 N
	
    //법정대리인
    $("#legalRprsnYn").val(data.legalRprsnYn);
	$("#legalRprsnNm").val(data.legalRprsnNm);
	$("#legalRprsnRegNo").val(data.legalRprsnRegNo);
	$("#legalRprsnRel").val(data.legalRprsnRel);
//	$("#legalRprsnDriverNo").val(data.legalRprsnDriverNo);
//  $("#legalRprsnIssueDt").val(data.legalRprsnIssueDt);
 
	//eSIM정보
    $("#modelItemid").val(data.modelItemid);
	$("#modelSerialNo").val(data.modelSerialNo);
	$("#imei").val(data.imei);
	$("#imei2").val(data.imei2);
	$("#modelEid").val(data.modelEid);
	$("#modelMacAddress").val(data.modelMacAddress);
	
	//applTp 'M' 번호이동
	sendSB805();
}

//USIM 일련번호 체크
function chkUsimNo(){
	saveOpenigDstcd();
	if($("#esimYn").val() == "Y"){
		showOpenBar();
		if($("#1_SB816_RE").val() == 'Y'){
			sendSB816_1();
		}else if($("#2_SB816_RE").val() == 'Y'){
			sendSB816();
		}else{ 
			sendSM803();//요금종속및 가능체크
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
					
					$("#errMsg_usimNo").hide();

//					$('body').append('<div class="dimmed" style="background-color: rgba(0,0,0,0.6);"></div>');
					showOpenBar();
					
					var sb816_1 = $("#1_SB816_RE").val();
					var sb816_2 = $("#2_SB816_RE").val();
					
					if(sb816_1 == 'Y'){
						sendSB816_1();
					}else if(sb816_2 == 'Y'){
						sendSB816();
					}else{ 
						sendSM803();//요금종속및 가능체크
					}	
					
				}
				else{
					if(str != strTmp){
						//popalarm("유심 일련번호가 틀립니다. 정확히 입력해주세요.", "info", false,"확인","usimSerialNoR");
						//return;
						popalarm2("기존 발급된 유심 일련번호 정보와 다릅니다. 정확히 입력해주세요.<br/><br/>유심번호가 변경된 경우 KB Liiv M 고객상담센터 1522-9999(유료)를 통해서 개통 가능합니다. 연결하시겠습니까?", "check", true, '', callbackCallCenter);
					}
					else{
						$("#errMsg_usimNo").hide();

//						$('body').append('<div class="dimmed" style="background-color: rgba(0,0,0,0.6);"></div>');
						showOpenBar();
						
						//sendSB804();//스마트개통 MNP 운영시간여부체크
						//sendDV825();//USIM 단독개통 가상 단말등록
						var sb816_1 = $("#1_SB816_RE").val();
						var sb816_2 = $("#2_SB816_RE").val();
						
						if(sb816_1 == 'Y'){
							sendSB816_1();
						}else if(sb816_2 == 'Y'){
							sendSB816();
						}else{ 
							sendSM803();//요금종속및 가능체크
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
								popalarm2("개통이 불가능한 단말입니다.", "info", false);
							}
							else{
								$("#btnOpenReq").prop("disabled",false);
							}
						}
					}
					else{
						popalarm2("등록되지 않은 단말입니다.", "info", false);
					}
				}
				catch(e){
					console.log(e);
					popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
					return;
				}
				
			} else {
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
				return;
			}
	    },
	    error: function(e){
	    	console.log(e.responseText.trim());
	    	popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
	    	return;
	    },
	    complete: function() {
    	    openLoading("stop");
	    }
	});
}

//스마트개통 MNP 이전사업자 미청구금 조회
function sendSB805(){

	var base = new Object();
	var data = new Object();
	
	var RetireveSmrtMnpHotBillForEntrBD = new Object();
	
	var RequestRecord = new Object();
	var RequestBody = new Object();
	
	var RqstDataInVO = new Object();
	
	base.serviceId = "SB805";

	/* 번호이동시 호출하는 번호이동고객유형코드(mnpCustKdCd)
	01 : 일반
	02 : 개인사업자
	03 : 일반법인
	04 : 공공기관
	*/
	if($("#custTp").val() == "II"){
		RqstDataInVO.mnpCustKdCd    = "01";
	}
	else if($("#custTp").val() == "GEF"){
		RqstDataInVO.mnpCustKdCd    = "02";
	}
	else if($("#custTp").val() == "IFX"){
		RqstDataInVO.mnpCustKdCd    = "01";
	}
	else{
		RqstDataInVO.mnpCustKdCd    = "01";
	}
	
	RqstDataInVO.ctn            = $("#mtelNo").val();
	RqstDataInVO.custPersNo     = $("#regNo").val();
	RqstDataInVO.msgChasNo      = $("#msgChasNo").val();//메세지 추적번호
	RqstDataInVO.userDlrGrpCd   = "Fa";
	RqstDataInVO.userWorkDlrCd  = "315397";
	RqstDataInVO.nextOperatorId = "1100000288";
	
   	RequestBody.RqstDataInVO = RqstDataInVO;

	RequestRecord.RequestBody = RequestBody;
	
	RetireveSmrtMnpHotBillForEntrBD.RequestRecord = RequestRecord;
	data.RetireveSmrtMnpHotBillForEntrBD = RetireveSmrtMnpHotBillForEntrBD;
	
	base.data = data;

	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/SB805', 
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

		    var mpAutnSeqno 	=""; //번호이동 인증누적번호
		    var mpAutnPrssDttm  =""; //번호이동 인증처리일시
		    
		    var msgChasNo 	    =""; //메세지 추적 번호
		    var ltpymAmt 	    =""; //연체금액
		    
		    var totPymAmt ="";
			var rqmnNm    ="";
			var dlServiceCode ="";
			var rltyPymAmt ="";
			var devatOrg ="";
			var mnpRstnCustYn ="";
			var enprByUniqIdfyNo ="";
			var ppayAmt ="";
			var sysCreationDate ="";
			var pymTrgtEndDt ="";
			var intcalFee ="";
			var devHshdDvCd ="";
			var rtmAcntPersNo ="";
			var ctn ="";
			var rfndBankAcntNo ="";
			var domeCalf ="";
			var mnpKdCd ="";
			var mnpTrdtKdCd ="";
			var vat ="";
			var dlrYn ="";
			var itemId ="";
			var ppayPspmtMvmtDvCd ="";
			var mPostHld ="";
			var hprsnDvCd ="";
			var applicationId ="";
			var cardPymAmt ="";
			var mnpAutnSeqno ="";
			var hprsnDvCdAutn0200 ="";
			var cardInsttMnthCnt ="";
			//var autnDayCount ="";
			var cardFee ="";
			var mnpCustKdCd ="";
			var addvSvcChrg ="";
			var sbsdTerm ="";
			var mnpUclmAmtPymMthd ="";
			//var ltpymAmt ="";
			var dlUpdateStamp ="";
			var rqmnPersNo ="";
			//var msgChasNo ="";
			var sysUpdateDate ="";
			var rsvEntrRcptNo ="";
			var _rowStatus ="";
			var cardNo_org ="";
			var penaltyAmt ="";
			var hldrDrngRelsCd ="";
			var hldrCustNm ="";
			var posCd ="";
			var cardNo ="";
			var mnpUfee ="";
			var autnItemDvCd ="";
			var rfndBankCd ="";   
			var mnpAutnPrssDttm ="";
			var mnpRspnCd ="";
			var insttEntrYn ="";
			var operatorId ="";
			var mnpAutnPrssDt ="";
			var pymTrgtStrtDt ="";
			var cardValdEndYymm ="";
			var mnpBfrEnprCd ="";
			var mapCtn ="";
			var totPymAmtOrg ="";
			var noGrntEnpr ="";
			var userDlrGrpCd ="";
			var custPersNo_org ="";
			var expryBillAmtPbpYn ="";
			var autnItemNo ="";
			var rqmnPersNo_org ="";
			var frgnrYn ="";
			var devat ="";
			var rsltCd400 ="";
			var mnpAftEnprCd ="";
			var rtmBankCd ="";
			var mnpPymDvCdAutn0200 ="";
			var bfrEnprUpmnyPymMthdCd ="";
			var custBsRegNo ="";
			var mnpAftRtngNo ="";
			var taxBl ="";
			var etcUfee ="";
			var prssSttsCd ="";
			var mnpBfrRtngNo ="";
			var billAcntNo ="";
			var cardAprvNo ="";
			var rtmBankAcntNo ="";
			var cashPymAmt ="";
			var mnpDevInsttAmtPymMthd ="";
			var totPymTrgtAmt ="";
			var cdcmpCd ="";
			var mnpFeePymMthd ="";
			var dlrGrpCd ="Fa";
			var sbsdAmt ="";
			var custPersNo ="";
			var custCtplc ="";
			var rtmBankAcntNo_org ="";
			var insttLineCnt ="";
			var openMnp ="";
			var mnpPymDvCd ="";
			var basf =" ";
			
			var totnpayAmt = "";
			
			try{
				resultCode    = response.resultCode;
				//resultMessage = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.BusinessHeader.ResultMessage;
				                
   		        mpAutnSeqno 	= response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mpAutnSeqno;    //번호이동 인증누적번호
   		        mpAutnPrssDttm  = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mpAutnPrssDttm; //번호이동 인증처리일시
   		        msgChasNo 	    = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.msgChasNo;      //메세지 추적 번호
   		        ltpymAmt 	    = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.ltpymAmt;       //연체금액
   		        
	   		     totPymAmt               = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.totPymAmt;
	   			 rqmnNm                  = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.rqmnNm;
	   			 dlServiceCode           = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.dlServiceCode;
	   			 rltyPymAmt              = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.rltyPymAmt;
	   			 devatOrg                = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.devatOrg;
	   			 mnpRstnCustYn           = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mnpRstnCustYn;
	   			 enprByUniqIdfyNo        = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.enprByUniqIdfyNo;
	   			 ppayAmt                 = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.ppayAmt;
	   			 sysCreationDate         = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.sysCreationDate;
	   			 pymTrgtEndDt            = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.pymTrgtEndDt;
	   			 intcalFee               = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.intcalFee;
	   			 devHshdDvCd             = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.devHshdDvCd;
	   			 rtmAcntPersNo           = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.rtmAcntPersNo;
	   			 ctn                     = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.ctn;
	   			 rfndBankAcntNo          = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.rfndBankAcntNo;
	   			 domeCalf                = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.domeCalf;
	   			 mnpKdCd                 = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mnpKdCd;
	   			 mnpTrdtKdCd             = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mnpTrdtKdCd;
	   			 vat                     = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.vat;
	   			 dlrYn                   = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.dlrYn;
	   			 itemId                  = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.itemId;
	   			 ppayPspmtMvmtDvCd       = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.ppayPspmtMvmtDvCd;
	   			 mPostHld                = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mPostHld;
	   			 hprsnDvCd               = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.hprsnDvCd;
	   			 applicationId           = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.applicationId;
	   			 cardPymAmt              = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.cardPymAmt;
	   			 mnpAutnSeqno            = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mnpAutnSeqno;
	   			 hprsnDvCdAutn0200       = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.hprsnDvCdAutn0200;
	   			 cardInsttMnthCnt        = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.cardInsttMnthCnt;
	   			 //autnDayCount            = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.autnDayCount;
	   			 cardFee                 = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.cardFee;
	   			 mnpCustKdCd             = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mnpCustKdCd;
	   			 addvSvcChrg             = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.addvSvcChrg;
	   			 sbsdTerm                = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.sbsdTerm;
	   			 mnpUclmAmtPymMthd       = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mnpUclmAmtPymMthd;
	   			 //ltpymAmt                = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.ltpymAmt;
	   			 dlUpdateStamp           = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.dlUpdateStamp;
	   			 rqmnPersNo              = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.rqmnPersNo;
	   			 //msgChasNo               = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.msgChasNo;
	   			 sysUpdateDate           = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.sysUpdateDate;
	   			 rsvEntrRcptNo           = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.rsvEntrRcptNo;
	   			 _rowStatus              = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO._rowStatus;
	   			 cardNo_org              = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.cardNo_org;
	   			 penaltyAmt              = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.penaltyAmt;
	   			 hldrDrngRelsCd          = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.hldrDrngRelsCd;
	   			 hldrCustNm              = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.hldrCustNm;
	   			 posCd                   = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.posCd;
	   			 cardNo                  = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.cardNo;
	   			 mnpUfee                 = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mnpUfee;
	   			 autnItemDvCd            = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.autnItemDvCd;
	   			 rfndBankCd              = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.rfndBankCd;
	   			 mnpAutnPrssDttm         = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mnpAutnPrssDttm;
	   			 mnpRspnCd               = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mnpRspnCd;
	   			 insttEntrYn             = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.insttEntrYn;
	   			 operatorId              = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.operatorId;
	   			 mnpAutnPrssDt           = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mnpAutnPrssDt;
	   			 pymTrgtStrtDt           = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.pymTrgtStrtDt;
	   			 cardValdEndYymm         = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.cardValdEndYymm;
	   			 mnpBfrEnprCd            = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mnpBfrEnprCd;
	   			 mapCtn                  = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mapCtn;
	   			 totPymAmtOrg            = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.totPymAmtOrg;
	   			 noGrntEnpr              = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.noGrntEnpr;
	   			 userDlrGrpCd            = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.userDlrGrpCd;
	   			 custPersNo_org          = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.custPersNo_org;
	   			 expryBillAmtPbpYn       = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.expryBillAmtPbpYn;
	   			 autnItemNo              = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.autnItemNo;
	   			 rqmnPersNo_org          = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.rqmnPersNo_org;
	   			 frgnrYn                 = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.frgnrYn;
	   			 devat                   = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.devat;
	   			 rsltCd400               = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.rsltCd400;
	   			 mnpAftEnprCd            = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mnpAftEnprCd;
	   			 rtmBankCd               = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.rtmBankCd;
	   			 mnpPymDvCdAutn0200      = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mnpPymDvCdAutn0200;
	   			 bfrEnprUpmnyPymMthdCd   = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.bfrEnprUpmnyPymMthdCd;
	   			 custBsRegNo             = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.custBsRegNo;
	   			 mnpAftRtngNo            = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mnpAftRtngNo;
	   			 taxBl                   = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.taxBl;
	   			 etcUfee                 = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.etcUfee;
	   			 prssSttsCd              = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.prssSttsCd;
	   			 mnpBfrRtngNo            = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mnpBfrRtngNo;
	   			 //billAcntNo              = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.billAcntNo;
	   			 cardAprvNo              = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.cardAprvNo;
	   			 rtmBankAcntNo           = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.rtmBankAcntNo;
	   			 cashPymAmt              = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.cashPymAmt;
	   			 mnpDevInsttAmtPymMthd   = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mnpDevInsttAmtPymMthd;
	   			 totPymTrgtAmt           = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.totPymTrgtAmt;
	   			 cdcmpCd                 = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.cdcmpCd;
	   			 mnpFeePymMthd           = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mnpFeePymMthd;
	   			 dlrGrpCd                = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.dlrGrpCd;
	   			 sbsdAmt                 = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.sbsdAmt;
	   			 custPersNo              = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.custPersNo;
	   			 custCtplc               = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.custCtplc;
	   			 rtmBankAcntNo_org       = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.rtmBankAcntNo_org;
	   			 insttLineCnt            = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.insttLineCnt;
	   			 openMnp                 = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.openMnp;
	   			 mnpPymDvCd              = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.mnpPymDvCd;
	   			 basf                    = response.data.RetireveSmrtMnpHotBillForEntrBDResponse.ResponseRecord.ResponseBody.Autn0300OutVO.basf;
   			
	   			if(mpAutnSeqno != null) $("#mpAutnSeqno").val(mpAutnSeqno);
	   			if(mpAutnPrssDttm != null) $("#mpAutnPrssDttm").val(mpAutnPrssDttm);
	   			if(msgChasNo != null) $("#msgChasNo").val(msgChasNo);
	   			if(ltpymAmt != null) $("#ltpymAmt").val(ltpymAmt);
   				
	   			if(totPymAmt != null) $("#totPymAmt").val(totPymAmt);          
	   			if(rqmnNm != null) $("#rqmnNm").val(rqmnNm);
	   			if(dlServiceCode != null) $("#dlServiceCode").val(dlServiceCode);
	   			if(rltyPymAmt != null) $("#rltyPymAmt").val(rltyPymAmt);
	   			if(devatOrg != null) $("#devatOrg").val(devatOrg);
	   			if(mnpRstnCustYn != null) $("#mnpRstnCustYn").val(mnpRstnCustYn);
	   			if(enprByUniqIdfyNo != null) $("#enprByUniqIdfyNo").val(enprByUniqIdfyNo);
	   			if(ppayAmt != null) $("#ppayAmt").val(ppayAmt);
	   			if(sysCreationDate != null) $("#sysCreationDate").val(sysCreationDate);
	   			if(pymTrgtEndDt != null) $("#pymTrgtEndDt").val(pymTrgtEndDt);
	   			if(intcalFee != null) $("#intcalFee").val(intcalFee);
	   			if(devHshdDvCd != null) $("#devHshdDvCd").val(devHshdDvCd);
	   			if(rtmAcntPersNo != null) $("#rtmAcntPersNo").val(rtmAcntPersNo);
	   			if(ctn != null) $("#ctn").val(ctn);
	   			if(rfndBankAcntNo != null) $("#rfndBankAcntNo").val(rfndBankAcntNo);
	   			if(domeCalf != null) $("#domeCalf").val(domeCalf);
	   			if(mnpKdCd != null) $("#mnpKdCd").val(mnpKdCd);
	   			if(mnpTrdtKdCd != null) $("#mnpTrdtKdCd").val(mnpTrdtKdCd);
	   			if(vat != null) $("#vat").val(vat);
	   			if(dlrYn != null) $("#dlrYn").val(dlrYn);
	   			if(itemId == '' || itemId == null){
	   			}else{
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
	   						|| chrgPln == 'PD00000555' ) ? itemId + "" :  itemId;	   				
	   				$("#itemId").val(itemId);
	   			}
	   			if(ppayPspmtMvmtDvCd != null) $("#ppayPspmtMvmtDvCd").val(ppayPspmtMvmtDvCd);
	   			if(mPostHld == '' || mPostHld == null){$("#mPostHld").val("Y");}else{$("#mPostHld").val(mPostHld);}
	   			if(hprsnDvCd != null) $("#hprsnDvCd").val(hprsnDvCd);
	   			if(applicationId != null) $("#applicationId").val(applicationId);
	   			if(cardPymAmt != null) $("#cardPymAmt").val(cardPymAmt);
	   			if(mnpAutnSeqno != null) $("#mnpAutnSeqno").val(mnpAutnSeqno);
	   			if(hprsnDvCdAutn0200 != null) $("#hprsnDvCdAutn0200").val(hprsnDvCdAutn0200);
	   			if(cardInsttMnthCnt != null) $("#cardInsttMnthCnt").val(cardInsttMnthCnt);
	   			 //$("#autnDayCount").val(autnDayCount);
	   			if(cardFee != null) $("#cardFee").val(cardFee);
	   			if(mnpCustKdCd != null) $("#mnpCustKdCd").val(mnpCustKdCd);
	   			if(addvSvcChrg != null) $("#addvSvcChrg").val(addvSvcChrg);
	   			if(sbsdTerm != null) $("#sbsdTerm").val(sbsdTerm);
	   			$("#mnpUclmAmtPymMthd").val($("#pymMthd").val());
	   			 //$("#ltpymAmt").val(ltpymAmt);
	   			if(dlUpdateStamp != null) $("#dlUpdateStamp").val(dlUpdateStamp);
	   			if(rqmnPersNo != null) $("#rqmnPersNo").val(rqmnPersNo);
	   			 //$("#msgChasNo").val(msgChasNo);
	   			if(sysUpdateDate != null) $("#sysUpdateDate").val(sysUpdateDate);
	   			if(rsvEntrRcptNo != null) $("#rsvEntrRcptNo").val(rsvEntrRcptNo);
	   			if(_rowStatus != null) $("#_rowStatus").val(_rowStatus);
	   			if(cardNo_org != null) $("#cardNo_org").val(cardNo_org);
	   			if(penaltyAmt != null) $("#penaltyAmt").val(penaltyAmt);
	   			if(hldrDrngRelsCd != null) $("#hldrDrngRelsCd").val(hldrDrngRelsCd);
	   			if(hldrCustNm != null) $("#hldrCustNm").val(hldrCustNm);
	   			 //$("#posCd").val(posCd);
	   			if(cardNo != null) $("#cardNo").val(cardNo);
	   			if(mnpUfee != null) $("#mnpUfee").val(mnpUfee);
	   			if(autnItemDvCd != null) $("#autnItemDvCd").val(autnItemDvCd);
	   			if(rfndBankCd != null) $("#rfndBankCd").val(rfndBankCd);
	   			if(mnpAutnPrssDttm != null) $("#mnpAutnPrssDttm").val(mnpAutnPrssDttm);
	   			if(mnpRspnCd != null) $("#mnpRspnCd").val(mnpRspnCd);
	   			if(insttEntrYn != null) $("#insttEntrYn").val(insttEntrYn);
	   			if(operatorId != null) $("#operatorId").val(operatorId);
	   			if(mnpAutnPrssDt != null) $("#mnpAutnPrssDt").val(mnpAutnPrssDt);
	   			if(pymTrgtStrtDt != null) $("#pymTrgtStrtDt").val(pymTrgtStrtDt);
	   			if(cardValdEndYymm != null) $("#cardValdEndYymm").val(cardValdEndYymm);
	   			if(mnpBfrEnprCd != null) $("#mnpBfrEnprCd").val(mnpBfrEnprCd);
	   			if(mapCtn != null) $("#mapCtn").val(mapCtn);
	   			if(totPymAmtOrg != null) $("#totPymAmtOrg").val(totPymAmtOrg);
	   			if(noGrntEnpr != null) $("#noGrntEnpr").val(noGrntEnpr);
	   			if(userDlrGrpCd != null) $("#userDlrGrpCd").val(userDlrGrpCd);
	   			if(custPersNo_org != null) $("#custPersNo_org").val(custPersNo_org);
	   			//if(expryBillAmtPbpYn != null) $("#expryBillAmtPbpYn").val(expryBillAmtPbpYn);
	   			if(autnItemNo != null)  $("#autnItemNo").val(autnItemNo);
	   			if(rqmnPersNo_org != null)  $("#rqmnPersNo_org").val(rqmnPersNo_org);
	   			if(frgnrYn != null)  $("#frgnrYn").val(frgnrYn);
	   			if(devat != null)  $("#devat").val(devat);
	   			if(rsltCd400 != null)  $("#rsltCd400").val(rsltCd400);
	   			if(mnpAftEnprCd != null)  $("#mnpAftEnprCd").val(mnpAftEnprCd);
	   			if(rtmBankCd != null)  $("#rtmBankCd").val(rtmBankCd);
	   			if(mnpPymDvCdAutn0200 != null)  $("#mnpPymDvCdAutn0200").val(mnpPymDvCdAutn0200);
	   			if(bfrEnprUpmnyPymMthdCd != null)  $("#bfrEnprUpmnyPymMthdCd").val(bfrEnprUpmnyPymMthdCd);
	   			if(custBsRegNo != null)  $("#custBsRegNo").val(custBsRegNo);
	   			if(mnpAftRtngNo != null)  $("#mnpAftRtngNo").val(mnpAftRtngNo);
	   			if(taxBl != null)  $("#taxBl").val(taxBl);
	   			if(etcUfee != null)  $("#etcUfee").val(etcUfee);
	   			if(prssSttsCd != null)  $("#prssSttsCd").val(prssSttsCd);
	   			if(mnpBfrRtngNo != null)  $("#mnpBfrRtngNo").val(mnpBfrRtngNo);
	   			 //$("#billAcntNo").val(billAcntNo);
	   			if(cardAprvNo != null)  $("#cardAprvNo").val(cardAprvNo);
	   			if(rtmBankAcntNo != null)  $("#rtmBankAcntNo").val(rtmBankAcntNo);
	   			if(cashPymAmt != null)  $("#cashPymAmt").val(cashPymAmt);
	   			$("#mnpDevInsttAmtPymMthd").val($("#pymMthd").val());
	   			if(totPymTrgtAmt != null)  $("#totPymTrgtAmt").val(totPymTrgtAmt);
	   			if(cdcmpCd != null)  $("#cdcmpCd").val(cdcmpCd);
	   			$("#mnpFeePymMthd").val($("#pymMthd").val());
	   			if(dlrGrpCd != null)  $("#dlrGrpCd").val(dlrGrpCd);
	   			if(sbsdAmt != null)  $("#sbsdAmt").val(sbsdAmt);
	   			if(custPersNo != null)  $("#custPersNo").val(custPersNo_org);
	   			if(custCtplc != null)  $("#custCtplc").val(custCtplc);
	   			if(rtmBankAcntNo_org != null)  $("#rtmBankAcntNo_org").val(rtmBankAcntNo_org);
	   			if(insttLineCnt != null)  $("#insttLineCnt").val(insttLineCnt);
	   			if(openMnp != null)  $("#openMnp").val(openMnp);
	   	
	   			//번호이동납부구분코드
	   			//1: 완납(번호이동 후 당행에서청구), 2: 분납(단말잔여할부금 이전통신사 청구)
	   			//단말할부금이 없을경우 번호이동납부구분코드는 1
	   			//2021.01.21 추가사항 - MNP사업자정보(SB809)중 hldDvCd값이 Y면 3, N이면 2로 세팅 
	   			if(devat == "0" || devat == "") $("#mnpPymDvCd").val("1");
	   			else {
	   				if($("#hldDvCd").val() == "N"){
	   					$("#mnpPymDvCd").val("2");
	   				}
	   				else if($("#hldDvCd").val() == "Y"){
	   					$("#mnpPymDvCd").val("3");
	   				}
	   				else{
	   					$("#mnpPymDvCd").val("2");
	   				}
	   			}
		
	   			if(basf != null)  $("#basf").val(basf);
   				
			}catch(e){
				resultMessage = response.resultMessage;
			}			
			resultMessage = "[SB805]" + resultMessage;		
			console.log('SB805 resultCode=' + resultCode);
			
			if(resultCode == 'N0000'){

				if($("#esimYn").val() == "Y"){
					sendAPIM0048();
				} else {
				    openLoading("stop");
				}

			}else{
			    openLoading("stop");
				popalarm2("[SB805]일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
			}
		},
		error: function(request,status,error){
		    openLoading("stop");
			popalarm2("[SB805]일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
		}
	});//end ajax
}


//스마트 등록 실시간 가입 판매정보 등록(번호이동)
function sendSB803_NP(step){
	
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
	var	chrgPymPosCd = ""; 

	var stepDevcCd		= "";
	var stepSvcChngDttm = "";

	var stepMnpChngDttm  = "";
	var stepCustChngDttm = "";
	var rgstDt           = "";
	var prssDt           = "";
	
	var entrRsvDttm      = "";
	var prssRsultCd      = "";
	var _workDv          = "";
	var _jobBiz          = "";
	var stepCustAgrmtYn  = "";
	var stepCustAgrmtChngDttm = "";
	var mnpHldrAutnDttm  = "";
	
	var stepMnpCd        = "";
	
	var usimFeeCnt		 = "";
	var usimFeeAmt		 = "0";
	
	var ymdhms = getYYYYMMDDHHMMSS();
	var ymd    = getYYYYMMDD();
	
	var steptmp = "";	
	
	if(step == 'AGR1' || step == 'MNP1' || step == 'AGR' || step == 'MNP'){
		steptmp = step;	
	}else{
		steptmp = "";
	}	
	
	if(steptmp == 'AGR1'){
		step = 'AGR';
	}else if(steptmp == 'MNP1'){
		step = 'MNP';
	}
		
	if(step == 'DEV' || step == 'AGR' || step == 'MNP' || step == 'CUSACT'){//2-5번째
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
		prssDt           = ymd;
		
		prssRsultCd      = "I";
		stepDevcCd		= "9";
		stepSvcChngDttm = ymdhms;
		stepCustAgrmtChngDttm = ymdhms;
		mnpHldrAutnDttm  = ymdhms;
	}

	_workDv = "U"; 

	if(step == 'DEV'){//2
		_jobBiz = "DEV";	
	}else if(step == 'AGR'){//3
		_jobBiz = "AGR";	
		stepCustAgrmtYn = "9";
		stepMnpCd = "9";
	}else if(step == 'MNP'){//4
		_jobBiz = "MNP";
		if(steptmp == 'MNP'){//2번째 mnp
			stepMnpCd = "9";
		}else{
			stepMnpCd = "8";
		}
	}else if(step == 'CUSACT'){//5
		_jobBiz = "CUSACT";
		stepCustAgrmtYn = "9";
		stepMnpCd = "9";
	}else{ //1번째
		_jobBiz = "SVC";//1
		step = "SVC";
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

	DsEntrInfoInVO.prodNo = getCtnFormat($("#mtelNo").val());
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
		DsDevSaleInfoInVO.usimMdlCd = "ESIM";
		DsDevSaleInfoInVO.usimSerialNo = "";
		DsDevSaleInfoInVO.itemId =  $("#modelItemid").val();
		DsDevSaleInfoInVO.manfSerialNo =  $("#modelSerialNo").val();
	}
	else{
		DsDevSaleInfoInVO.usimMdlCd = ($("#usimMngNo").val() == null || $("#usimMngNo").val() == '') ? "K9040": $("#usimMngNo").val() ;
		DsDevSaleInfoInVO.usimSerialNo = $("#usimSerialNo").val();
		DsDevSaleInfoInVO.itemId = $("#itemId").val();
		DsDevSaleInfoInVO.manfSerialNo = $("#manfSerialNo").val();
	}

	DsDevSaleInfoInVO.sdphnYn =  "I";
	DsDevSaleInfoInVO.usimDvCd =  "C";
	DsDevSaleInfoInVO.plcydcPlcyCd =  strBlank;
	DsDevSaleInfoInVO.bizPlcyCd =  strBlank;
	DsDevSaleInfoInVO.hpdisAmt =  strZero;
	DsDevSaleInfoInVO.sdphnCmpsnAmt =  (step == 'DEV') ? "" : strZero;
	DsDevSaleInfoInVO.devcDlvrAmt =  strZero;
	DsDevSaleInfoInVO.rsaleAmt =  strZero;
	DsDevSaleInfoInVO.cashAmt =  strZero;
	DsDevSaleInfoInVO.cardAmt =  strZero;
	DsDevSaleInfoInVO.cprtCardAmt =  strZero;
	DsDevSaleInfoInVO.insttAmt =  strZero;
	DsDevSaleInfoInVO.insttMnbr =  (step == 'DEV') ? "" : strZero;
	DsDevSaleInfoInVO.suprtAmt =  strZero;
	DsDevSaleInfoInVO.entrDscntKdCd =  "";
	DsDevSaleInfoInVO.insttDvCd = insttDvCd;
	DsDevSaleInfoInVO.slt1InsttMnbr =  "";
	DsDevSaleInfoInVO.slt2InsttMnbr =  "";
	DsDevSaleInfoInVO.mnthAtmny =  strZero;
	DsDevSaleInfoInVO.insttFeeAmt =  strZero;
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
	DsDevSaleInfoInVO.usimSaleAmt = (step == 'SVC') ? usimFeeAmt : strZero;
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
	DsEntrOnlineSaleInVO.stepMnpCd =  stepMnpCd;
	DsEntrOnlineSaleInVO.stepMnpChngDttm = (step == 'SVC' || step == 'AGR' || step == 'MNP' ) ? stepMnpChngDttm : "";
	DsEntrOnlineSaleInVO.stepCustCd = "9";
	DsEntrOnlineSaleInVO.stepCustChngDttm = (step == 'MNP') ? "" : stepCustChngDttm;
	DsEntrOnlineSaleInVO.stepSvcCd = (step == 'MNP') ? "" : "9";
	DsEntrOnlineSaleInVO.stepSvcChngDttm = (step == 'MNP') ? "" : stepSvcChngDttm;
	DsEntrOnlineSaleInVO.stepDevcCd =  (step == 'SVC' || step == 'DEV') ? stepDevcCd : "";
	DsEntrOnlineSaleInVO.stepDevcChngDttm =  "";
	DsEntrOnlineSaleInVO.stepCustAgrmtYn =  (step == 'DEV' || step == 'MNP') ? "" : stepCustAgrmtYn ;
	DsEntrOnlineSaleInVO.stepCustAgrmtChngDttm =  (step == 'AGR' || step == 'CUSACT') ? stepCustAgrmtChngDttm : "";
	DsEntrOnlineSaleInVO.entrRqstChnlKdCd =  (step == 'MNP') ? "" : "1";
	DsEntrOnlineSaleInVO.prssEvntCd =  (step == 'SVC') ? "" : "MNP";
	DsEntrOnlineSaleInVO.rgstDt = (step == 'MNP') ? "" : rgstDt;
	DsEntrOnlineSaleInVO.entrRsvDttm = (step == 'MNP') ? "" : entrRsvDttm;
	DsEntrOnlineSaleInVO.prssDt = "";
	DsEntrOnlineSaleInVO.prssMemo =  "";
	DsEntrOnlineSaleInVO.prssRsultCd =  (step == 'MNP') ? "" : prssRsultCd;
	DsEntrOnlineSaleInVO._workDv = _workDv;
	DsEntrOnlineSaleInVO._jobBiz = _jobBiz;
	DsEntrOnlineSaleInVO.inputAddJson =  "";
	DsEntrOnlineSaleInVO.nextOperatorId =  "1100000288";
  
	DsEntrBySvcInfoInVO.cnvgEntrNo = "";
	DsEntrBySvcInfoInVO.cnvgTypCd = "";
	DsEntrBySvcInfoInVO.cnvgSvcCd = "";
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

	DsRsvMnpInfoInVO.entrRsvProdCd = (step == 'MNP') ? "LZP0000001" : "";
	DsRsvMnpInfoInVO.mnpBfrEnpr = (step == 'MNP') ? $("#mcoCd").val() : "";
	DsRsvMnpInfoInVO.autnItemDvCd = (step == 'MNP') ? getAutnItemDvCd() : "";
	DsRsvMnpInfoInVO.autnItemNo = (step == 'MNP') ? $("#npAuthKey").val() : "";
	DsRsvMnpInfoInVO.mnpTelno = (step == 'MNP') ? $("#mtelNo").val() : "";
	
	var vApcntNm = (step == 'MNP') ? $("#custNm").val() : "";
	if (vApcntNm.length > 30) vApcntNm = vApcntNm.substring(0,30);
	DsRsvMnpInfoInVO.apcntNm = vApcntNm;
	DsRsvMnpInfoInVO.apcntPersNo = (step == 'MNP') ? getPersNo() : "";
	DsRsvMnpInfoInVO.apcntTelno = "";
	DsRsvMnpInfoInVO.apcntHpno = "";
	DsRsvMnpInfoInVO.mnpHldrDvCd = (step == 'MNP') ? "01" : "";
	DsRsvMnpInfoInVO.mnpHldrPersNo = (step == 'MNP') ? getPersNo() : "";
	DsRsvMnpInfoInVO.mnpHldrNm = (step == 'MNP') ? $("#custNm").val() : "";
	DsRsvMnpInfoInVO.mnpHldrTelno = "";
	DsRsvMnpInfoInVO.mnpHldrHpno = "";
	DsRsvMnpInfoInVO.mnpHldrAutnOrgnzCd = "";
	DsRsvMnpInfoInVO.mnpHldrAutnMthdCd = (step == 'MNP') ? "8" : "";
	DsRsvMnpInfoInVO.mnpHldrAutnDttm = (step == 'MNP') ? $("#mnpAutnPrssDttm").val() : "";
	DsRsvMnpInfoInVO.mnpHldrAutnSucsYn = (step == 'MNP') ? "Y" : "";
	DsRsvMnpInfoInVO.mnpHldrAutnReqstNo = (step == 'MNP') ? $("#mnpAutnSeqno").val() : "";//명의자 인증요청번호
	DsRsvMnpInfoInVO.mnpHldrAutnRspnsNo = "";
	DsRsvMnpInfoInVO.ebcstReturnYn = "";
	DsRsvMnpInfoInVO.rfndBankCd = "";
	DsRsvMnpInfoInVO.rfndBandAcctNo = "";
	DsRsvMnpInfoInVO.urdmAmtOfstDvCd = (step == 'MNP') ? "3" : "";
	DsRsvMnpInfoInVO.contcPsblTmDvCd = "";
	DsRsvMnpInfoInVO.mnpHldrBsRegNo = $("#bizRegNo").val();
	DsRsvMnpInfoInVO.billCntcInfoKdCd = (step == 'MNP') ? "3" : "";
	DsRsvMnpInfoInVO.billCntcInfo1 = "";
	DsRsvMnpInfoInVO.totnpayAmt = (step == 'MNP') ? $("#totPymAmt").val() : "";//총미납금액
	DsRsvMnpInfoInVO.upaidPrssDvCd = (step == 'MNP') ? "1" : "";
	DsRsvMnpInfoInVO.insttSaleAmt = (step == 'MNP') ? "0" : "";//할부 판매금액
	DsRsvMnpInfoInVO.insttDvCd = (step == 'MNP') ? "" : "";//할부구분코드
	DsRsvMnpInfoInVO.pymAsertAmt = "";
	DsRsvMnpInfoInVO.pymAsertAmtPymDt = "";
	DsRsvMnpInfoInVO.pymAsertAmtPymMthdCd = "";
	DsRsvMnpInfoInVO.msgChasNo = (step == 'MNP') ? $("#msgChasNo").val() : "" ;
	DsRsvMnpInfoInVO.inputAddJson = "";
	DsRsvMnpInfoInVO.nextOperatorId = "1100000288";

	DsAtrctInfoInVO.userId = (step == 'DEV' || step == 'AGR') ? "" : "";
	DsAtrctInfoInVO.userNm = (step == 'DEV' || step == 'AGR') ? "" : "";
	DsAtrctInfoInVO.intgUserId = (step == 'DEV' || step == 'AGR') ? "" : "";
	DsAtrctInfoInVO.userOrgCd = (step == 'DEV' || step == 'AGR') ? "" : "";
	DsAtrctInfoInVO.userLginIp = "";
	DsAtrctInfoInVO.extduYn = "Y";
	DsAtrctInfoInVO.mrktCd = "KBM";
	DsAtrctInfoInVO.userDlrCd = "315397";
	DsAtrctInfoInVO.userDlrGrpCd = (step == 'DEV' || step == 'AGR') ? "Fa" : "";
	DsAtrctInfoInVO.userDlrNm = "KB국민은행지점";
	DsAtrctInfoInVO.saleEmpno = (step == 'DEV' || step == 'AGR') ? "" : "";
	DsAtrctInfoInVO.entrEmpno = (step == 'DEV' || step == 'AGR') ? "" : "";
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
	}//end for	

	DsCustInfoInVO.hldrCustNo =  custNo;
	DsCustInfoInVO.rlusrCustNo = custNo;
	DsCustInfoInVO.billAcntNo =  billAcntNo;
	DsCustInfoInVO.welfCommDscntRqstYn = "";
	DsCustInfoInVO.lawcAgntCustNo = $("#legalRprsnCustNo").val();
	DsCustInfoInVO.pymDepoCd = "A";
	DsCustInfoInVO.pymDepoCustCd = "A";
	DsCustInfoInVO.hldrKdCd = "A";
	DsCustInfoInVO.rqmnKdCd = "A";
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

	if(DsEntrInfoInVO.nextOperatorId == "1100000288") RequestBody.DsEntrInfoInVO         = DsEntrInfoInVO        ;
	if(DsConfldsInVO.nextOperatorId == "1100000288")  RequestBody.DsConfldsInVO          = DsConfldsInVO         ;
	if(DsDevSaleInfoInVO.nextOperatorId == "1100000288")    RequestBody.DsDevSaleInfoInVO      = DsDevSaleInfoInVO     ;
	if(DsEntrOnlineSaleInVO.nextOperatorId == "1100000288") RequestBody.DsEntrOnlineSaleInVO   = DsEntrOnlineSaleInVO  ;
	if(DsEntrBySvcInfoInVO.nextOperatorId == "1100000288")  RequestBody.DsEntrBySvcInfoInVO    = DsEntrBySvcInfoInVO   ;
	if(DsRsvMnpInfoInVO.nextOperatorId == "1100000288") RequestBody.DsRsvMnpInfoInVO       = DsRsvMnpInfoInVO      ;
	if(DsAtrctInfoInVO.nextOperatorId == "1100000288")  RequestBody.DsAtrctInfoInVO        = DsAtrctInfoInVO       ;
	if(DsAsgnNoListInVO.nextOperatorId == "1100000288")                RequestBody.DsAsgnNoListInVO       = DsAsgnNoListInVO      ;
	if(DsEntrRsvBySvcListInVO_Array != null && DsEntrRsvBySvcListInVO_Array[0].nextOperatorId == "1100000288"){
		RequestBody.DsEntrRsvBySvcListInVO = DsEntrRsvBySvcListInVO_Array;
	}
	if(DsCustInfoInVO.nextOperatorId == "1100000288")    RequestBody.DsCustInfoInVO         = DsCustInfoInVO        ;
	if(DsJncoCpnInfoInVO.nextOperatorId == "1100000288") RequestBody.DsJncoCpnInfoInVO      = DsJncoCpnInfoInVO     ;	
	
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
			console.log('sendSB803_NP resultCode='+resultCode+' resultCode1='+resultCode1+' mvnoRcptNo='+mvnoRcptNo);
			
			if(resultCode == 'N0000' && resultCode1 == '0000'){
				if(step == 'SVC'){
					sendSB803_NP('DEV');
				}else if(step == 'DEV'){
					sendSB803_NP('AGR1');
				}else if(steptmp == 'AGR1'){
					sendSB803_NP('MNP1');
				}else if(steptmp == 'MNP1'){
					sendSB816_1();					
				}else if(step == 'AGR'){
					sendSB803_NP('MNP');
				}else if(step == 'MNP'){
					sendSB803_NP('CUSACT');
				}else if(step == 'CUSACT'){	
					sendSB806();//실시간 스마트 가입 조회
				}	
			}else if(resultCode != 'N0000'){	
				hideOpenBar();
				popalarm2(response.resultMessage, "info", false);
			}else{
				hideOpenBar();
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
			}
		},
		error: function(request,status,error){
			hideOpenBar();
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
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
				popalarm2(resultMessage, "info", false);
			}else{
				hideOpenBar();
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
			}
		},
		error: function(request,status,error){
			hideOpenBar();
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
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
    DsChkSvcChgInVO.prodNo =  getCtnFormat($("#mtelNo").val());
    DsChkSvcChgInVO.prodCd =  "LZP0000001";
    DsChkSvcChgInVO.entrSttsCd =  "A";
    DsChkSvcChgInVO.itemId =  $("#itemId").val();
    DsChkSvcChgInVO.manfSerialNo =  $("#manfSerialNo").val();
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
				popalarm2(resultMessage, "info", false);
			}else{
				hideOpenBar();
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
			}
		},
		error: function(request,status,error){
			hideOpenBar();
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
		}
	});//end ajax
}

//SM005 결과 세팅
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
	/*22.12.22 지서연 사원 추가
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
	

	if(applTp == 'M'){//번호이동
		sendSB803_NP('SVC');
	}	
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
			
			console.log('SB806 resultCode='+resultCode +  ' resultCode1='+resultCode1 + ' hldrCustNo=' + hldrCustNo );			
			if(resultCode == 'N0000' && hldrCustNo != '' && billAcntNo != '' && stepCustCd == '9' && stepSvcCd == '9' && stepDevcCd == '9' && stepCustAgrmtYn == '9' ){
				//popalarm('SB806 ' + resultMessage, "info", false);
				sendSB816();//스마트 개통완료 처리
			}else if(resultCode1 !== 'N0000'){	
				hideOpenBar();
				popalarm2(resultMessage, "info", false);
			}else{
				hideOpenBar();
				popalarm2("[SB806]일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
			}
		},
		error: function(request,status,error){
		    hideOpenBar();
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
		}
	});//end ajax
}


//스마트 개통완료 처리 첫번째
function sendSB816_1(){
	
	var ymdhms     = getYYYYMMDDHHMMSS();
	var ymd        = getYYYYMMDD();
	var prodRqstNo = $("#prodRqstNo").val();//$("#applSeqNo").val();
	
	var billAcntNo  = $("#billAcntNo").val();
	var prodNo		= getCtnFormat($("#mtelNo").val());//전화번호
	var custNo      = $("#custNo").val();
	var custPersNo  = $("#regNo").val();
	
	if(custPersNo != null && custPersNo.length >= 6){
		custPersNo = custPersNo.substr(0,6) + "0000000";
	}
	
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
	
	var vTotPymAmt = $("#totPymAmt").val() == ""?"0":$("#totPymAmt").val();
	var vPpayAmt = $("#ppayAmt").val() == ""?"0":$("#ppayAmt").val();
	var sTotPymAmt = Number(vTotPymAmt) - Number(vPpayAmt); /* 2021.12.23 실제 수납금액 = 해지시미청구합계금액(TOT_PYM_AMT) - 타사선납금액(PPAY_AMT) */ 
	if(sTotPymAmt < 0) sTotPymAmt = 0;
	
	DsEntrOnlineSaleInVO.entrRsvRcptSeqno = $("#mvnoRcptNo").val();
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
    DsEntrOnlineSaleInVO.dsConflds += "\"_workDv\":\"400\",                 ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizbrNmLvl1\":\"\",                ";
    DsEntrOnlineSaleInVO.dsConflds += "\"_runDate\":\""+ymd+"\",            ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizbrNmLvl2\":\"\",                ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizbrCdLvl25\":\"\",               ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizbrNmLvl3\":\"\",                ";
    DsEntrOnlineSaleInVO.dsConflds += "\"bizbrNmLvl5\":\"\",                ";
    DsEntrOnlineSaleInVO.dsConflds += "\"chnlCd\":\"\",                     ";
    DsEntrOnlineSaleInVO.dsConflds += "\"dlrNm\":\"KB국민은행지점\",        ";
    DsEntrOnlineSaleInVO.dsConflds += "\"userWorkDlrGrpCd\":\"Fa\",         ";
    DsEntrOnlineSaleInVO.dsConflds += "\"orgLvl\":\"\",                     ";
    DsEntrOnlineSaleInVO.dsConflds += "\"intgUserId\":\"\",                 ";
    DsEntrOnlineSaleInVO.dsConflds += "\"orgAddKdCd\":\"\"                  ";
    DsEntrOnlineSaleInVO.dsConflds += "}]";
	
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
    DsEntrOnlineSaleInVO.dsCustInfo += "\"lawcAgntCustNo\":\"\",                 ";
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
    
    DsEntrOnlineSaleInVO.dsEntrMemo  = "[]";
	 
	//SB805 결과값 세팅    	
	DsEntrOnlineSaleInVO.dsAutn0300  = "[{";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"totPymAmt\": \""+sTotPymAmt+"\",               ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rqmnNm\": \""+$("#custNm").val()+"\",                     ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"dlServiceCode\": \""+$("#dlServiceCode").val()+"\",       ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rltyPymAmt\": \""+$("#rltyPymAmt").val()+"\",                 ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"devatOrg\": \""+$("#devatOrg").val()+"\",                     ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpRstnCustYn\": \""+$("#mnpRstnCustYn").val()+"\",           ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"enprByUniqIdfyNo\": \""+$("#enprByUniqIdfyNo").val()+"\",     ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"ppayAmt\": \""+$("#ppayAmt").val()+"\",                       ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"sysCreationDate\": \""+$("#sysCreationDate").val()+"\",       ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"pymTrgtEndDt\": \""+$("#pymTrgtEndDt").val()+"\",             ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"intcalFee\": \""+$("#intcalFee").val()+"\",                          ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"devHshdDvCd\": \""+$("#devHshdDvCd").val()+"\",                      ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rtmAcntPersNo\": \""+$("#rtmAcntPersNo").val()+"\",                  ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"ctn\": \""+getCtnFormat($("#ctn").val())+"\",                     ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rfndBankAcntNo\": \""+$("#rfndBankAcntNo").val()+"\",             ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"domeCalf\": \""+$("#domeCalf").val()+"\",                         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpKdCd\": \""+$("#mnpKdCd").val()+"\",                           ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpTrdtKdCd\": \""+$("#mnpTrdtKdCd").val()+"\",                   ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"vat\": \""+$("#vat").val()+"\",                                  ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"dlrYn\": \""+$("#dlrYn").val()+"\",                              ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"itemId\": \""+$("#itemId").val()+"\",                            ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"ppayPspmtMvmtDvCd\": \""+$("#ppayPspmtMvmtDvCd").val()+"\",         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mPostHld\": \""+$("#mPostHld").val()+"\",                           ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"hprsnDvCd\": \""+$("#hprsnDvCd").val()+"\",                         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"applicationId\": \""+$("#applicationId").val()+"\",                 ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"cardPymAmt\": \""+$("#cardPymAmt").val()+"\",                       ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpAutnSeqno\": \""+$("#mnpAutnSeqno").val()+"\",                   ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"hprsnDvCdAutn0200\": \""+$("#hprsnDvCdAutn0200").val()+"\",                  ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"cardInsttMnthCnt\": \""+$("#cardInsttMnthCnt").val()+"\",                    ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"autnDayCount\": \""+$("#autnDayCount").val()+"\",                  ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"cardFee\": \""+$("#cardFee").val()+"\",                            ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpCustKdCd\": \""+$("#mnpCustKdCd").val()+"\",                    ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"addvSvcChrg\": \""+$("#addvSvcChrg").val()+"\",                    ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"sbsdTerm\": \""+$("#sbsdTerm").val()+"\",                          ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpUclmAmtPymMthd\": \""+$("#mnpUclmAmtPymMthd").val()+"\",         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"ltpymAmt\": \""+$("#ltpymAmt").val()+"\",                           ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"dlUpdateStamp\": \""+$("#dlUpdateStamp").val()+"\",                 ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rqmnPersNo\": \""+custPersNo+"\",                      ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"msgChasNo\": \""+$("#msgChasNo").val()+"\",            ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"sysUpdateDate\": \""+$("#sysUpdateDate").val()+"\",         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rsvEntrRcptNo\": \""+$("#rsvEntrRcptNo").val()+"\",                   ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"_rowStatus\": \""+$("#_rowStatus").val()+"\",                         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"cardNo_org\": \""+$("#cardNo_org").val()+"\",                         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"penaltyAmt\": \""+$("#penaltyAmt").val()+"\",                         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"hldrDrngRelsCd\": \""+$("#hldrDrngRelsCd").val()+"\",                 ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"hldrCustNm\": \""+$("#custNm").val()+"\",                     ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"posCd\": \""+$("#posCd").val()+"\",                           ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"cardNo\": \""+$("#cardNo").val()+"\",                            ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpUfee\": \""+$("#mnpUfee").val()+"\",                          ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"autnItemDvCd\": \""+$("#autnItemDvCd").val()+"\",                ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rfndBankCd\": \""+$("#rfndBankCd").val()+"\",                    ";   
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpAutnPrssDttm\": \""+$("#mnpAutnPrssDttm").val()+"\", ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpRspnCd\": \""+$("#mnpRspnCd").val()+"\",             ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"insttEntrYn\": \""+$("#insttEntrYn").val()+"\",                   ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"operatorId\": \"1100000288\",          ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpAutnPrssDt\": \""+$("#mnpAutnPrssDt").val()+"\",         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"pymTrgtStrtDt\": \""+$("#pymTrgtStrtDt").val()+"\",         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"cardValdEndYymm\": \""+$("#cardValdEndYymm").val()+"\",         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpBfrEnprCd\": \""+$("#mnpBfrEnprCd").val()+"\",               ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mapCtn\": \""+$("#mapCtn").val()+"\",                        ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"totPymAmtOrg\": \""+$("#totPymAmtOrg").val()+"\",            ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"noGrntEnpr\": \""+$("#noGrntEnpr").val()+"\",                ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"userDlrGrpCd\": \""+$("#userDlrGrpCd").val()+"\",                  ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"custPersNo_org\": \""+$("#custPersNo_org").val()+"\",              ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"expryBillAmtPbpYn\": \""+$("#expryBillAmtPbpYn").val()+"\",        ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"autnItemNo\": \""+$("#autnItemNo").val()+"\",                ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rqmnPersNo_org\": \""+$("#rqmnPersNo_org").val()+"\",         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"frgnrYn\": \""+$("#frgnrYn").val()+"\",                       ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"devat\": \""+$("#devat").val()+"\",                  ";

	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpAftEnprCd\": \""+$("#mnpAftEnprCd").val()+"\",               ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rtmBankCd\": \""+$("#rtmBankCd").val()+"\",                     ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpPymDvCdAutn0200\": \""+$("#mnpPymDvCdAutn0200").val()+"\",            ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"bfrEnprUpmnyPymMthdCd\": \""+$("#bfrEnprUpmnyPymMthdCd").val()+"\",      ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"custBsRegNo\": \""+$("#custBsRegNo").val()+"\",                   ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpAftRtngNo\": \""+$("#mnpAftRtngNo").val()+"\",                 ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"taxBl\": \""+$("#taxBl").val()+"\",                     ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"etcUfee\": \""+$("#etcUfee").val()+"\",                 ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"prssSttsCd\": \""+$("#prssSttsCd").val()+"\",           ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpBfrRtngNo\": \""+$("#mnpBfrRtngNo").val()+"\",                ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"billAcntNo\": \""+$("#billAcntNo").val()+"\",                    ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"cardAprvNo\": \""+$("#cardAprvNo").val()+"\",                    ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rtmBankAcntNo\": \""+$("#rtmBankAcntNo").val()+"\",              ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"cashPymAmt\": \""+$("#cashPymAmt").val()+"\",              ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpDevInsttAmtPymMthd\": \""+$("#pymMthd").val()+"\",      ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"totPymTrgtAmt\": \""+$("#totPymTrgtAmt").val()+"\",        ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"cdcmpCd\": \""+$("#cdcmpCd").val()+"\",                    ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpFeePymMthd\": \""+$("#pymMthd").val()+"\",              ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"dlrGrpCd\": \"Fa\",                    ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"sbsdAmt\": \""+$("#sbsdAmt").val()+"\",                    ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"custPersNo\": \""+custPersNo+"\",       ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"custCtplc\": \""+$("#custCtplc").val()+"\",                ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rtmBankAcntNo_org\": \""+$("#rtmBankAcntNo_org").val()+"\",        ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"insttLineCnt\": \""+$("#insttLineCnt").val()+"\",                  ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"openMnp\": \"2\",                      ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpPymDvCd\": \""+$("#mnpPymDvCd").val()+"\",           ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"basf\": \""+$("#basf").val()+"\"                        ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "}]";

	DsEntrOnlineSaleInVO.dsUsimSaleInfo = "[]";
    DsEntrOnlineSaleInVO.dsDevSaleChrgPym = "[]";
    
    DsEntrOnlineSaleInVO.dsDevSaleInfo  = "[{ ";
    if($("#esimYn").val() == "Y"){
		DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"itemId\":\""+$("#modelItemid").val()+"\", ";
		DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"manfSerialNo\":\""+$("#modelSerialNo").val()+"\", ";  
	    DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"usimMdlCd\":\"ESIM\", ";	  
		DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"usimSerialNo\":\"\", ";	  
	}
	else{
		DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"itemId\":\""+$("#itemId").val()+"\", ";
		DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"manfSerialNo\":\""+$("#manfSerialNo").val()+"\", ";  
	    DsEntrOnlineSaleInVO.dsDevSaleInfo +=  ($("#usimMngNo").val() == null || $("#usimMngNo").val() == '') ? "\"usimMdlCd\":\"K9040\", " : "\"usimMdlCd\":\""+$("#usimMngNo").val()+"\", ";	  
		DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"usimSerialNo\":\""+$("#usimSerialNo").val()+"\", ";  
	}
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"sdphnYn\":\"I\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"usimDvCd\":\"C\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"plcydcPlcyCd\":\"\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"bizPlcyCd\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"hpdisAmt\":\"0\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"sdphnCmpsnAmt\":\"\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"devcDlvrAmt\":\"0\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"rsaleAmt\":\"0\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cashAmt\":\"0\", ";  
    DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cardAmt\":\"0\", ";	  
    DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cprtCardAmt\":\"0\", ";	  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"insttAmt\":\"0\", ";	  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"insttMnbr\":\"\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"suprtAmt\":\"0\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"entrDscntKdCd\":\"\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"insttDvCd\":\"N\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"slt1InsttMnbr\":\"\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"slt2InsttMnbr\":\"\", ";	  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"mnthAtmny\":\"0\", ";
    DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"insttFeeAmt\":\"0\", ";	  
    DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"sdphnPnt\":\"\", ";
    DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cashAcumAmt\":\"\", ";      
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"allDscntAmt\":\"0\", ";	  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"chceAgmtYn\":\"N\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"chceAgmtMnbr\":\"\", ";
    DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"rvinsAgrmtYn\":\"N\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"insrSvcId\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"usimPymMthdCd\":\"EX\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"coPrmPymMthdCd\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"insttYn\":\"N\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cashYn\":\"N\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cprtCardYn\":\"N\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cardYn\":\"N\", ";
    DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cashAcumYn\":\"N\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"sdphnPntYn\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cashAcumUseYn\":\"N\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cashAcumUseAmt\":\"0\", ";
    DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"usimSaleAmt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"coPrmAmt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"devHelpAmt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cprtCdcmpCd\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cprtCardCd\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cprtCardMnbr\":\"\", ";	  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"entrRqstCntnt\":\"\", ";	  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"inputAddJson\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"nextOperatorId\":\"1100000288\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"mnpCardApno\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"mnpCprtCardApno\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"devcCardApno\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"devcCprtCardApno\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"usimCardApno\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"coGrtinsCardApno\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"dpDscntAmt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"devGrdCd\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"devGrdDscntAmt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"chrgPymPosCd\":\""+$("#posCd").val()+"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"insttItrr\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cntcDvCd\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"agmtPrnplInfo1Amt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"agmtPrnplInfo2Amt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"mnthInsttInfo1Amt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"mnthInsttInfo2Amt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"toinsttFee\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"slt1ToinsttFee\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"slt2ToinsttFee\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"slt1MnthBillAmt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"slt2MnthBillAmt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"dataShrAddDscntCd\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"rsvSaleNo\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"rsvFnshDataYn\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"AgDcCntcMnbr\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"jncoCpnTotAmt\":\"\" ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "}]";
	  
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
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"custDvCd\":\""+vCustDvCd+"\",          ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"nextOperatorId\":\"1100000288\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"stayLcnsCd\":\""+vStayLcnsCd+"\",      ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"prodRqstNo\":\""+prodRqstNo+"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"ntnltCd\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"kisCrdtRsltCd\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"cbscore\":\"ZZ\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"cbscoreRsnCd\":\"ZZ\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"spamKaitYn\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"entrNo\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"ocrSeqno\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"lawcAgntCustNo\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"agntNtnltCd\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"cbscoreCustGubun\":\"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"kaitAuthRsltCd\":\""+prodRqstNo+"\", ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "\"custKdCd\":\""+vCustKdCd+"\"          ";
    DsEntrOnlineSaleInVO.dsCustCrdtInfo += "}]";
    
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
	DsEntrOnlineSaleInVO.dsEtcInfo1 += "\"startDate\": \""+ymd+"000000\",     ";
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
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msInsttImpsblAuth\": \"\",          ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msDevcDlvrAmt\": \"0\", ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msInsttPsblCustYn\": \"Y\", ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msKbptPntLmt\": \"\",       ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msDevSbsdPsblYn\": \"N\", ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"insttYn\": \"Y\", ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msPhnCmpnChk\": \"\",     ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msInsttDeferYn\": \"N\",  ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msCorporationAct\": \"N\",";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"insttDvCd\": \"N\", ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msRnmCnfmYn\": \"\",            ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msETaxBillYn\": \"N\", ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msKbptCardTp\": \"\",            ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msDpDscntAmt\": \"0\", ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msNewActType\": \"M\", ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msDevcSbsd\": \"\",            ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msSbsdAmtTot\": \"\",          ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msInsttMnbr\": \"\",            ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msDlrSbsdRate\": \"\",          ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msLastInsttMnbr\": \"\",        ";
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msInsttDobYn\": \"\",           ";
    
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
	   
    DsEntrOnlineSaleInVO.nextOperatorId = "1100000288";
    
	RequestBody.DsEntrOnlineSaleInVO  = DsEntrOnlineSaleInVO;
	RequestRecord.RequestBody = RequestBody;
	CreateSmrtActivMobile.RequestRecord = RequestRecord;
	data.CreateSmrtActivMobile = CreateSmrtActivMobile;
	
	base.data = data;

	console.log("SB816_1 : " + JSON.stringify(base));
	

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
			
			console.log('SB816_1 resultCode='+resultCode + ' rsltCd='+rsltCd + ' prodNo='+prodNo + " entrNo =" + entrNo);
			
			if(resultCode == 'N0000' ){
				$("#1_SB816_RE").val("N");				
				$("#2_SB816_RE").val("N");
				if( rsltCd == 'OO'){
//					$('body').append('<div class="dimmed" style="background-color: rgba(0,0,0,0.6);"></div>');
					
					setTimeout( function(){
//						$('.dimmed').length && $('.dimmed').remove();
						sendSB803_NP('AGR');
					},30000);					
				}else{
					$("#1_SB816_RE").val("Y");
					hideOpenBar();
					popalarm2(resultMessage, "info", false);
				}
			}else if(resultCode !== 'N0000'){
				$("#1_SB816_RE").val("Y");
				hideOpenBar();
				popalarm2(resultMessage, "info", false);

			}
		},
		error: function(request,status,error){
			$("#1_SB816_RE").val("Y");	
			hideOpenBar();
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
		}
	});//end ajax	
}


//스마트 개통완료 처리 2번째
function sendSB816(){
	
	var ymdhms     = getYYYYMMDDHHMMSS();
	var ymd        = getYYYYMMDD();
	var prodRqstNo = $("#prodRqstNo").val();//$("#applSeqNo").val();
	
	var billAcntNo  = $("#billAcntNo").val();
	var prodNo		= getCtnFormat($("#mtelNo").val());//전화번호
	var custNo      = $("#custNo").val();
	var custPersNo  = $("#regNo").val();
	
	if(custPersNo != null && custPersNo.length >= 6){
		custPersNo = custPersNo.substr(0,6) + "0000000";
	}
	
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
	
	var vTotPymAmt = $("#totPymAmt").val() == ""?"0":$("#totPymAmt").val();
	var vPpayAmt = $("#ppayAmt").val() == ""?"0":$("#ppayAmt").val();
	var sTotPymAmt = Number(vTotPymAmt) - Number(vPpayAmt); /* 2021.12.23 실제 수납금액 = 해지시미청구합계금액(TOT_PYM_AMT) - 타사선납금액(PPAY_AMT) */ 
	if(sTotPymAmt < 0) sTotPymAmt = 0;
	
    DsEntrOnlineSaleInVO.entrRsvRcptSeqno = $("#mvnoRcptNo").val();
    DsEntrOnlineSaleInVO.dsAsgnNoList = "[]";
    DsEntrOnlineSaleInVO.dsBillAcnt = "[]";
    DsEntrOnlineSaleInVO.dsChkFtr = "[]";
    DsEntrOnlineSaleInVO.dsChkSvc = "[]";
    
    //스마트 개통완료 처리 2번째
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
    	
    //스마트 개통완료 처리 2번째
    
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
    DsEntrOnlineSaleInVO.dsCustInfo += "\"lawcAgntCustNo\":\""+lawcAgntCustNo+"\",                 ";
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
    
    //스마트 개통완료 처리 2번째
    
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
    
	//SB805 결과값 세팅    	
   	DsEntrOnlineSaleInVO.dsAutn0300  = "[{";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"totPymAmt\": \""+sTotPymAmt+"\",                   ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rqmnNm\": \""+$("#custNm").val()+"\",                         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"dlServiceCode\": \""+$("#dlServiceCode").val()+"\",           ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rltyPymAmt\": \""+$("#rltyPymAmt").val()+"\",                 ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"devatOrg\": \""+$("#devatOrg").val()+"\",                     ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpRstnCustYn\": \""+$("#mnpRstnCustYn").val()+"\",           ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"enprByUniqIdfyNo\": \""+$("#enprByUniqIdfyNo").val()+"\",     ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"ppayAmt\": \""+$("#ppayAmt").val()+"\",                       ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"sysCreationDate\": \""+$("#sysCreationDate").val()+"\",       ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"pymTrgtEndDt\": \""+$("#pymTrgtEndDt").val()+"\",             ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"intcalFee\": \""+$("#intcalFee").val()+"\",                   ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"devHshdDvCd\": \""+$("#devHshdDvCd").val()+"\",               ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rtmAcntPersNo\": \""+$("#rtmAcntPersNo").val()+"\",           ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"ctn\": \""+getCtnFormat($("#ctn").val())+"\",                 ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rfndBankAcntNo\": \""+$("#rfndBankAcntNo").val()+"\",         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"domeCalf\": \""+$("#domeCalf").val()+"\",                     ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpKdCd\": \""+$("#mnpKdCd").val()+"\",                       ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpTrdtKdCd\": \""+$("#mnpTrdtKdCd").val()+"\",               ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"vat\": \""+$("#vat").val()+"\",                               ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"dlrYn\": \""+$("#dlrYn").val()+"\",                           ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"itemId\": \""+$("#itemId").val()+"\",                   ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"ppayPspmtMvmtDvCd\": \""+$("#ppayPspmtMvmtDvCd").val()+"\",   ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mPostHld\": \""+$("#mPostHld").val()+"\",                     ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"hprsnDvCd\": \""+$("#hprsnDvCd").val()+"\",                   ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"applicationId\": \""+$("#applicationId").val()+"\",           ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"cardPymAmt\": \""+$("#cardPymAmt").val()+"\",                 ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpAutnSeqno\": \""+$("#mnpAutnSeqno").val()+"\",              ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"hprsnDvCdAutn0200\": \""+$("#hprsnDvCdAutn0200").val()+"\",    ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"cardInsttMnthCnt\": \""+$("#cardInsttMnthCnt").val()+"\",      ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"autnDayCount\": \""+$("#autnDayCount").val()+"\",              ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"cardFee\": \""+$("#cardFee").val()+"\",                        ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpCustKdCd\": \""+$("#mnpCustKdCd").val()+"\",                ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"addvSvcChrg\": \""+$("#addvSvcChrg").val()+"\",                ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"sbsdTerm\": \""+$("#sbsdTerm").val()+"\",                      ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpUclmAmtPymMthd\": \""+$("#mnpUclmAmtPymMthd").val()+"\",         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"ltpymAmt\": \""+$("#ltpymAmt").val()+"\",                           ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"dlUpdateStamp\": \""+$("#dlUpdateStamp").val()+"\",                 ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rqmnPersNo\": \""+custPersNo+"\",             ";//2번째 SB816
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"msgChasNo\": \""+$("#msgChasNo").val()+"\",                   ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"sysUpdateDate\": \""+$("#sysUpdateDate").val()+"\",           ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rsvEntrRcptNo\": \""+$("#rsvEntrRcptNo").val()+"\",                   ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"_rowStatus\": \""+$("#_rowStatus").val()+"\",                         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"cardNo_org\": \""+$("#cardNo_org").val()+"\",                         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"penaltyAmt\": \""+$("#penaltyAmt").val()+"\",                         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"hldrDrngRelsCd\": \""+$("#hldrDrngRelsCd").val()+"\",                 ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"hldrCustNm\": \""+$("#custNm").val()+"\",                     ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"posCd\": \""+$("#posCd").val()+"\",                           ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"cardNo\": \""+$("#cardNo").val()+"\",                              ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpUfee\": \""+$("#mnpUfee").val()+"\",                            ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"autnItemDvCd\": \""+$("#autnItemDvCd").val()+"\",                ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rfndBankCd\": \""+$("#rfndBankCd").val()+"\",                    ";   
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpAutnPrssDttm\": \""+$("#mnpAutnPrssDttm").val()+"\", ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpRspnCd\": \""+$("#mnpRspnCd").val()+"\",             ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"insttEntrYn\": \""+$("#insttEntrYn").val()+"\",                   ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"operatorId\": \"1100000288\",          ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpAutnPrssDt\": \""+$("#mnpAutnPrssDt").val()+"\",   ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"pymTrgtStrtDt\": \""+$("#pymTrgtStrtDt").val()+"\",         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"cardValdEndYymm\": \""+$("#cardValdEndYymm").val()+"\",         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpBfrEnprCd\": \""+$("#mnpBfrEnprCd").val()+"\",               ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mapCtn\": \""+$("#mapCtn").val()+"\",                        ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"totPymAmtOrg\": \""+$("#totPymAmtOrg").val()+"\",            ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"noGrntEnpr\": \""+$("#noGrntEnpr").val()+"\",                ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"userDlrGrpCd\": \""+$("#userDlrGrpCd").val()+"\",            ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"custPersNo_org\": \""+custPersNo+"\",                ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"expryBillAmtPbpYn\": \""+$("#expryBillAmtPbpYn").val()+"\",            ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"autnItemNo\": \""+$("#autnItemNo").val()+"\",                ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rqmnPersNo_org\": \""+custPersNo+"\",                        ";//2번째 SB816
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"frgnrYn\": \""+$("#frgnrYn").val()+"\",                       ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"devat\": \""+$("#devat").val()+"\",                           ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rsltCd400\": \"OO\",                   ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpAftEnprCd\": \""+$("#mnpAftEnprCd").val()+"\",               ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rtmBankCd\": \""+$("#rtmBankCd").val()+"\",                     ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpPymDvCdAutn0200\": \""+$("#mnpPymDvCdAutn0200").val()+"\",            ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"bfrEnprUpmnyPymMthdCd\": \""+$("#bfrEnprUpmnyPymMthdCd").val()+"\",      ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"custBsRegNo\": \""+$("#custBsRegNo").val()+"\",                   ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpAftRtngNo\": \""+$("#mnpAftRtngNo").val()+"\",                  ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"taxBl\": \""+$("#taxBl").val()+"\",                         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"etcUfee\": \""+$("#etcUfee").val()+"\",                     ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"prssSttsCd\": \""+$("#prssSttsCd").val()+"\",                    ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpBfrRtngNo\": \""+$("#mnpBfrRtngNo").val()+"\",                ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"billAcntNo\": \""+$("#billAcntNo").val()+"\",                    ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"cardAprvNo\": \""+$("#cardAprvNo").val()+"\",                    ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rtmBankAcntNo\": \""+$("#rtmBankAcntNo").val()+"\",              ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"cashPymAmt\": \""+$("#cashPymAmt").val()+"\",               ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpDevInsttAmtPymMthd\": \""+$("#pymMthd").val()+"\",       ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"totPymTrgtAmt\": \""+$("#totPymTrgtAmt").val()+"\",         ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"cdcmpCd\": \""+$("#cdcmpCd").val()+"\",                     ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpFeePymMthd\": \""+$("#pymMthd").val()+"\",               ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"dlrGrpCd\": \"Fa\",                    ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"sbsdAmt\": \""+$("#sbsdAmt").val()+"\",                      ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"custPersNo\": \""+custPersNo+"\",       "; //2번째 SB816
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"custCtplc\": \""+$("#custCtplc").val()+"\",                     ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"rtmBankAcntNo_org\": \""+$("#rtmBankAcntNo_org").val()+"\",     ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"insttLineCnt\": \""+$("#insttLineCnt").val()+"\",               ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"openMnp\": \"2\",                      ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"mnpPymDvCd\": \""+$("#mnpPymDvCd").val()+"\",                   ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "\"basf\": \""+$("#basf").val()+"\"                                ";
	DsEntrOnlineSaleInVO.dsAutn0300 += "}]";
    
    DsEntrOnlineSaleInVO.dsChkItem = "[]";
    DsEntrOnlineSaleInVO.dsChkUsim = "[]";
    DsEntrOnlineSaleInVO.dsUsimSaleInfo = "[]";
    DsEntrOnlineSaleInVO.dsDevSaleChrgPym = "[]";
    
    //DsEntrOnlineSaleInVO.dsDevSaleInfo = "[]";
    DsEntrOnlineSaleInVO.dsDevSaleInfo  = "[{ ";
    if($("#esimYn").val() == "Y"){
		DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"itemId\":\""+$("#modelItemid").val()+"\", ";
		DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"manfSerialNo\":\""+$("#modelSerialNo").val()+"\", ";  
	    DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"usimMdlCd\":\"ESIM\", ";	  
		DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"usimSerialNo\":\"\", ";  
	}
	else{
		DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"itemId\":\""+$("#itemId").val()+"\", ";
		DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"manfSerialNo\":\""+$("#manfSerialNo").val()+"\", ";  
	    DsEntrOnlineSaleInVO.dsDevSaleInfo +=  ($("#usimMngNo").val() == null || $("#usimMngNo").val() == '') ? "\"usimMdlCd\":\"K9040\", " : "\"usimMdlCd\":\""+$("#usimMngNo").val()+"\", ";	  
		DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"usimSerialNo\":\""+$("#usimSerialNo").val()+"\", ";  
	}
    DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"sdphnYn\":\"I\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"usimDvCd\":\"C\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"plcydcPlcyCd\":\"\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"bizPlcyCd\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"hpdisAmt\":\"0\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"sdphnCmpsnAmt\":\"\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"devcDlvrAmt\":\"0\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"rsaleAmt\":\"0\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cashAmt\":\"0\", ";  
    DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cardAmt\":\"0\", ";	  
    DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cprtCardAmt\":\"0\", ";	  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"insttAmt\":\"0\", ";	  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"insttMnbr\":\"\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"suprtAmt\":\"0\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"entrDscntKdCd\":\"\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"insttDvCd\":\"N\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"slt1InsttMnbr\":\"\", ";  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"slt2InsttMnbr\":\"\", ";	  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"mnthAtmny\":\"0\", ";
    DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"insttFeeAmt\":\"0\", ";	  
    DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"sdphnPnt\":\"\", ";
    DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cashAcumAmt\":\"\", ";      
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"allDscntAmt\":\"0\", ";	  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"chceAgmtYn\":\"N\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"chceAgmtMnbr\":\"\", ";
    DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"rvinsAgrmtYn\":\"N\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"insrSvcId\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"usimPymMthdCd\":\"EX\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"coPrmPymMthdCd\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"insttYn\":\"N\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cashYn\":\"N\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cprtCardYn\":\"N\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cardYn\":\"N\", ";
    DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cashAcumYn\":\"N\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"sdphnPntYn\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cashAcumUseYn\":\"N\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cashAcumUseAmt\":\"0\", ";
    DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"usimSaleAmt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"coPrmAmt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"devHelpAmt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cprtCdcmpCd\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cprtCardCd\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cprtCardMnbr\":\"\", ";	  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"entrRqstCntnt\":\"\", ";	  
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"inputAddJson\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"nextOperatorId\":\"1100000288\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"mnpCardApno\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"mnpCprtCardApno\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"devcCardApno\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"devcCprtCardApno\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"usimCardApno\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"coGrtinsCardApno\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"dpDscntAmt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"devGrdCd\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"devGrdDscntAmt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"chrgPymPosCd\":\""+$("#posCd").val()+"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"insttItrr\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"cntcDvCd\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"agmtPrnplInfo1Amt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"agmtPrnplInfo2Amt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"mnthInsttInfo1Amt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"mnthInsttInfo2Amt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"toinsttFee\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"slt1ToinsttFee\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"slt2ToinsttFee\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"slt1MnthBillAmt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"slt2MnthBillAmt\":\"0\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"dataShrAddDscntCd\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"rsvSaleNo\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"rsvFnshDataYn\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"AgDcCntcMnbr\":\"\", ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "\"jncoCpnTotAmt\":\"\" ";
	DsEntrOnlineSaleInVO.dsDevSaleInfo += "}]";
    
    DsEntrOnlineSaleInVO.dsDevSaleInstt = "[]";

    //스마트 개통완료 처리 2번째
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
    
    //스마트 개통완료 처리 2번째
    
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
    DsEntrOnlineSaleInVO.dsEtcInfo5 += "\"msNewActType\": \"M\", ";
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
			//var resultCode1 = "";
			var resultMessage = "";
			var rsltCd		  = "";
			var prodNo		  = "";
			var entrNo		  = "";
			
			try{
				resultCode    = response.resultCode;
				//resultCode1   = response.data.RetrieveOnlineSaleAllInfoEsbResponse.ResponseRecord.BusinessHeader.ResultCode;
				resultMessage = response.data.CreateSmrtActivMobileResponse.ResponseRecord.BusinessHeader.ResultMessage;
				rsltCd		  = response.data.CreateSmrtActivMobileResponse.ResponseRecord.ResponseBody.ResultInfoOutVO.rsltCd;
				prodNo		  = response.data.CreateSmrtActivMobileResponse.ResponseRecord.ResponseBody.ResultInfoOutVO.prodNo;
				entrNo		  = response.data.CreateSmrtActivMobileResponse.ResponseRecord.ResponseBody.ResultInfoOutVO.entrNo;
				resultMessage = (resultCode == 'N0000') ? response.data.CreateSmrtActivMobileResponse.ResponseRecord.ResponseBody.ResultInfoOutVO.resultMessage : resultMessage ;
			}catch(e){
				resultMessage  = response.resultMessage;
			}
			
			console.log('2번째 SB816 resultCode='+resultCode + ' rsltCd='+rsltCd + ' prodNo='+prodNo + " entrNo =" + entrNo + " resultMessage=" + resultMessage);

			if(resultCode == 'N0000' ){
				$("#1_SB816_RE").val("N");				
				$("#2_SB816_RE").val("N");				
				//if(rsltCd == '0000' ){ //test
				if(rsltCd == '0000' && prodNo != '' && entrNo != ''&& resultMessage.indexOf("정상적으로 완료") > -1){
					//popalarm('개통완료처리되었습니다. SB816 ' + resultMessage, "info", false,"",updateApplStat);
					updateApplStat(entrNo);
					//sendSM080(entrNo);
				}else{
					$("#2_SB816_RE").val("Y");
					hideOpenBar();
					popalarm2(resultMessage, "info", false);
				}
				
			}else if(resultCode !== 'N0000'){
				$("#2_SB816_RE").val("Y");
				hideOpenBar();
				popalarm2(resultMessage, "info", false);
			//else{
			//	popalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
			}
		},
		error: function(request,status,error){
			$("#2_SB816_RE").val("Y");
			hideOpenBar();
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
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
			//sendSM080_1(entrno);
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

//유플러스용 개인식별세팅
function getPersNo(){
	var persNo = $("#regNo").val();
	if(persNo != null){
		persNo = persNo.substr(0,6) + "0000000";
	}
	return persNo
}

//유심모델 체크
function checkUsimmngno(){
	var rtnval = true;
	var val = $("#usimModelNo_org").val();
	
	if($("#usimMngNo").val() == "K3600" || $("#usimMngNo").val() == "K9040" || $("#usimMngNo").val() == "U9110"){
		console.log(val)
		if(val != '' && val != null && $("#usimMngNo").val() != val){
			rtnval = false;
			popalarm2("유심 모델번호가 틀립니다. 정확히 선택해 주세요.", "info", false);
			//$("#usimMngNo").val(val);
		}
	}
	
	return rtnval;
	
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
