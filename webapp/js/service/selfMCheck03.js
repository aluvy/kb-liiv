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

	$("#usimModelNo_org").val(data.usimMngNo);
	$("#iccid").val(data.iccid);
	if(data.iccid.length > 19){
		$("#usimSerialNo").val(data.iccid.substr(11,20));
	}

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

    $("#npMgmtNum").val(data.npMngNo);
    gJoinInfo = data;

    $("#SB808_RE").val("Y");
    $("#SB813_RE").val("N");


    $("#athnDiv").show();
    $("#athnBtn").click(function(){
    	preChkNpItem();
    });

    $("input[name='c-select-id']").change(function(){
    	if($("input[name='c-select-id']:checked").val() == "1"){
    		$("#SB808_RE").val("Y");
    		$("#SB813_RE").val("N");
    	}
    });

	if(data.custTp == "IFX" || data.legalRprsnYn == "Y" ){
		popalarm2("SKT망은 만 19세 이상의 개인(내국인)만 셀프 개통이 가능합니다.<br/>이외 고객님께는 개통을 위해 KB Liiv M 고객센터에서 순차적으로 연락 드리겠습니다.<br/>감사합니다.", "info", false,"",goBack);
	}
	else{
		if(data.esimYn == "C" || data.esimYn == "Y"){
			popalarm2("SKT망 eSIM 개통은 고객센터(1522-9999)로 문의주세요.", "info", false,"",goBack);
		}
		else{
			sendSKSU00101(data);
		}
	}

}


//사전체크
function sendSKSU00101(joinInfo){
	var applTp = "M";
	var idCardTp = joinInfo.idcardTp;

	var serviceId = "SKSU00101";

	var base = new Object();
	base.serviceId = serviceId;
	var data = new Object();


	var header = new Object();
	var field = new Object();

	header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드
	header.api_trace_num = $("#apiTraceNum").val(); //추적번호
	field.np_yn = "Y"; //번호이동여부
	field.cust_nm = joinInfo.custNm;
	field.ctz_num = joinInfo.corpRegNo; //주민번호

	if(idCardTp == "01"){
		field.id_typ = "0CW1"; //신분증종류 	0CW1:주민등록증, 0CW4:운전면허증, 0CWA:외국인등록증
		field.drv_licen_num = ""; //운전면허증
	}
	else if (idCardTp == "02"){
		field.id_typ = "0CW4"; //신분증종류 	0CW1:주민등록증, 0CW4:운전면허증, 0CWA:외국인등록증
		field.drv_licen_num = joinInfo.driverNo; //운전면허증
	}
	else{
		if(joinInfo.driverNo == ""){
			field.id_typ = "0CW1"; //신분증종류 	0CW1:주민등록증, 0CW4:운전면허증, 0CWA:외국인등록증
			field.drv_licen_num = ""; //운전면허증
		}
		else{
			field.id_typ = "0CW4"; //신분증종류 	0CW1:주민등록증, 0CW4:운전면허증, 0CWA:외국인등록증
			field.drv_licen_num = joinInfo.driverNo; //운전면허증
		}
	}
	field.id_isue_dt = joinInfo.issueDt; //발급일자
	field.fee_prod_id = joinInfo.mnoProdCd; //상품
	field.indv_info_use_agree_yn = "Y"; //개인정보사용동의여부

	data.field = field;
	data.header = header;
	base.data = data;

	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/skt/apihub/' + serviceId,
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
					var res = response.data.BODY;
					if(res.message.rps_code == "000000"){
						console.log("주민등록일련번호="+res.field.ctz_ser_num);
						console.log("고객계정번호="+res.field.cu_acnt_num);
						$("#ctzSerNum").val(res.field.ctz_ser_num);
						$("#cuAcntNum").val(res.field.cu_acnt_num);
						$("#custNo").val(res.field.cu_acnt_num);

						var ctemp = setTimeout(function(){ //interval
							checkSKSU00190(joinInfo);
							clearTimeout(ctemp);
						}, 8000);
					}
					else{
						popalarm2("시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
					}
				} else {
				    openLoading("stop");
				}
			}
			catch(e){
				console.log(e);
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
			}
		},
		error: function(request,status,error){
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
		}
	});

}


//본인확인 결과조회
function checkSKSU00190(joinInfo){
	var base = new Object();
	var data = new Object();

	var header = new Object();
	var field = new Object();

	header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드
	header.api_trace_num = $("#apiTraceNum").val(); //추적번호
	field.np_yn = "Y"; //번호이동여부
	field.cust_nm = joinInfo.custNm;
	field.ctz_num = joinInfo.corpRegNo;
	field.ctz_ser_num = $("#ctzSerNum").val();

	data.field = field;
	data.header = header;
	base.data = data;

	base.serviceId = "SKSU00190";
	base.data = data;
	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/skt/apihub/SKSU00190',
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
					var res = response.data.BODY;
					if(res.message.rps_code == "000000"){
						console.log("(KAIT신용조회)결과코드="+res.field.cb_crdt_brws_rslt_cd);
						console.log("실명확인결과코드="+res.field.rnm_check_rslt_cd);
						console.log("(진위확인)신분증진위확인결과코드="+res.field.tru_check_rslt_cd);
						console.log("타사미납결과코드="+res.field.crdt_brws_rslt_cd);

						console.log("실명확인정상여부="+res.field.rnm_check_norm_yn);
						console.log("진위확인정상여부="+res.field.tru_check_norm_yn);
						console.log("신용조회정상여부="+res.field.crdt_brws_norm_yn);
						console.log("타사미납정상여부="+res.field.oco_col_norm_yn);

						console.log("(다회선)결과코드="+fnCheckNull(res.field.mline_rslt_cd));
						console.log("(다회선)등록건수합계="+fnCheckNull(res.field.mline_rgst_cnt_tot));
						console.log("(다회선)정상여부="+fnCheckNull(res.field.mline_norm_yn));

						var rnmCheckNormYn = res.field.rnm_check_norm_yn;
						var truCheckNormYn = res.field.tru_check_norm_yn;
						var crdtBrwsNormYn = res.field.crdt_brws_norm_yn;
						var ocoColNormYn = res.field.oco_col_norm_yn;
						var mlineNormYn = fnCheckNull(res.field.mline_norm_yn);
						var mlineRsltCd = fnCheckNull(res.field.mline_rslt_cd);

						if(mlineRsltCd == "ML0P"){
						    openLoading("stop");
                            let opt = {
                                 msg         : "정보 조회 중 오류가 발생하여 다시 조회합니다.",
                                 cfrmYn      : false,
                                 okParam     : joinInfo,
                                 okCallback  : checkSKSU00190
                            };
                            popalarm(opt);
						}
						else{
							if(rnmCheckNormYn == "Y"
								&& truCheckNormYn == "Y"
								&& crdtBrwsNormYn == "Y"
								&& ocoColNormYn == "Y"
								&& mlineNormYn == "Y") {

								sendSKSU00501(joinInfo);

							}
							else{
								popalarm2("가입 신청이 불가능합니다.<br/>자세한 가입제한 사유는 고객센터(1522-9999)로 문의주세요.", "info", false,"",closePopup);
							}
						}
					}
					else{
						popalarm2("시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
					}
				} else {
				    openLoading("stop");
				}

			}
			catch(e){
				console.log(e);
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
				return;
			}
		},
		error: function(request,status,error){
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
			return;

		}
	});//end ajax
}


//납부인증요청
function sendSKSU00501(joinInfo){

	var serviceId = "SKSU00501";

	var base = new Object();
	base.serviceId = serviceId;
	var data = new Object();


	var header = new Object();
	var field = new Object();

	header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드
	header.api_trace_num = $("#apiTraceNum").val(); //추적번호

	field.birth_dt = joinInfo.corpRegNo7.substr(0,6);
	field.dpst_card_ownr_nm = joinInfo.custNm;

	if($("#pymMthd").val() == "CM"){ //은행
		field.pay_mthd_cd = "A2901"; //은행자동납부
		field.isue_card_co_cd = "";
		field.bank_cd = getSktBankCd($("#cardCorpCd").val());
		field.card_eff_ym = "";
		field.bank_card_num = $('#cardNo').val();

		//TODO 추후에 자동납부동의값 기준으로 변경처리필요
		//PRF1:서면, PRF2:전자문서-공인전자서명, PRF3:전자문서-일반전자서명, PRF4:녹취, PRF5:ARS, PRF6:기타전자문서, PRF9 : 기타
		if($("#preCheckSucYn").val() == "0"){ //미소지자 은행 방문
			field.op_prf_data_cl_cd = "PRF1";
		}
		else if ($("#preCheckSucYn").val() == "3"){ //모바일인증서
			field.op_prf_data_cl_cd = "PRF3";
		}
		else if ($("#preCheckSucYn").val() == "2"){ //신용카드인증
			field.op_prf_data_cl_cd = "PRF3";
		}
		else {
			field.op_prf_data_cl_cd = "PRF3";
		}
	}
	else{ //카드
		field.pay_mthd_cd = "A2902"; //카드자동납부
		field.isue_card_co_cd = getSktCardCd($("#cardCorpCd").val());
		field.bank_cd = "";

		var cardValdEndYymm = $("#cardEffcprd").val().replace('/','');
	   	cardValdEndYymm = "20"+cardValdEndYymm.substr(2,2)+cardValdEndYymm.substr(0,2);
		field.card_eff_ym = cardValdEndYymm; //신용카드유효년월
		field.bank_card_num = $('#cardNo').val();
		field.op_prf_data_cl_cd = "";
	}

	data.field = field;
	data.header = header;
	base.data = data;

	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/skt/apihub/' + serviceId,
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
					var res = response.data.BODY;
					if(res.message.rps_code == "000000"){

						console.log("자동납부인증요청일련번호="+res.field.auth_req_ser_num);
						$("#authReqSerNum").val(res.field.auth_req_ser_num);

						var ctemp = setTimeout(function(){ //interval
							checkSKSU00590(joinInfo);
							clearTimeout(ctemp);
						}, 5000);

					}
					else{
						popalarm2("시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
					}
				} else {
				    openLoading("stop");
				}
			}
			catch(e){
				console.log(e);
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
			}
		},
		error: function(request,status,error){
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
		}
	});

}


//납부인증 결과조회
function checkSKSU00590(joinInfo){
	var base = new Object();
	var data = new Object();

	var header = new Object();
	var field = new Object();

	header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드
	header.api_trace_num = $("#apiTraceNum").val(); //추적번호

	if($("#pymMthd").val() == "CM"){ //은행
		field.pay_mthd_cd = "A2901"; //은행자동납부
		field.auth_req_ser_num = $("#authReqSerNum").val(); //자동납부인증요청일련번호

	}
	else{ //카드
		field.pay_mthd_cd = "A2902"; //카드자동납부
		field.auth_req_ser_num = $("#authReqSerNum").val(); //자동납부인증요청일련번호
	}

    data.field = field;
	data.header = header;
	base.data = data;

	base.serviceId = "SKSU00590";
	base.data = data;
	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/skt/apihub/SKSU00590',
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
					var res = response.data.BODY;
					if(res.message.rps_code == "000000"){
						console.log("자동납부인증요청결과="+res.field.ap_auth_req_rslt);
						console.log("발급카드사코드="+res.field.isue_card_co_cd);
						console.log("카드사명="+res.field.card_co_nm);

						var apAuthReqRslt = res.field.ap_auth_req_rslt;

						if(apAuthReqRslt == "PC723"
							|| apAuthReqRslt == "00"
							|| apAuthReqRslt == "0000") {

							if($("#cuAcntNum").val() == ""){
								sendSKSU00901(joinInfo);
							}
							else{
								sendSKSU00902(joinInfo);
							}

						}
						else{
							popalarm2("자동납부 체크중 오류가 발생하였습니다.<br/>자세한 사유는 고객센터(1522-9999)로 문의주세요.", "info", false,"",closePopup);
						}

					}
					else{
						popalarm2("시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
					}
				} else {
				    openLoading("stop");
				}

			}
			catch(e){
				console.log(e);
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
				return;
			}
		},
		error: function(request,status,error){
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
			return;

		}
	});//end ajax
}


//고객계정등록,청구계정등록
function sendSKSU00901(joinInfo){

	var serviceId = "SKSU00901";

	var base = new Object();
	base.serviceId = serviceId;
	var data = new Object();


	var header = new Object();
	var field = new Object();

	header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드
	header.api_trace_num = $("#apiTraceNum").val(); //추적번호

	field.cust_nm = joinInfo.custNm;
	field.ctz_num = joinInfo.corpRegNo;
	field.cust_zip = $("#dlvrPstNo").val();
	field.cust_bas_addr = $("#dlvrBassAddr").val();
	field.cust_dtl_addr = $("#dlvrDtlAddr").val();
	field.cust_cntc_num = telNoSeqFormatter(joinInfo.dlvdstRcpntCellPhnNo);
	field.cust_email_addr = $('#emad').val();
	if(joinInfo.custTp == "GEF"){
		field.bl_acnt_nm = joinInfo.acntNm; //개인사업자의 납부자명은 상호명으로
	}
	else{
		field.bl_acnt_nm = joinInfo.custNm;
	}

	if($("#pymMthd").val() == "CM"){ //은행
		field.pay_mthd_cd = "A2901"; //은행자동납부
	}
	else{ //카드
		field.pay_mthd_cd = "A2902"; //카드자동납부
	}

	field.auth_req_ser_num = $("#authReqSerNum").val();
	if($("#billMdmEmlYn").val() == "Y"){
		field.bill_isue_typ_cd = "0382";//이메일청구서
	}
	else {
		field.bill_isue_typ_cd = "0386";//문자청구서
	}

	field.int_phon_dtl_isue_yn = "1"; //국제전화상세발행내역여부
	field.info_inv_dtl_disp_yn = "1"; //정보료청구상세표시여부

	data.field = field;
	data.header = header;
	base.data = data;

	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/skt/apihub/' + serviceId,
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
					var res = response.data.BODY;
					if(res.message.rps_code == "000000"){

						console.log("고객계정번호="+res.field.cu_acnt_num);
						console.log("청구계정번호="+res.field.bl_acnt_num);
						$("#blAcntNum").val(res.field.bl_acnt_num);
						$("#cuAcntNum").val(res.field.cu_acnt_num);
						$("#custNo").val(res.field.cu_acnt_num);
						$("#billAcntNo").val(res.field.bl_acnt_num);

						//SKSU00201 USIM카드 가용확인
						var base = new Object();
						base.serviceId = "SKSU00201";
						var data = new Object();

						var header = new Object();
						var field = new Object();

						header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드
						header.api_trace_num = $("#apiTraceNum").val(); //추적번호

						field.pre_post_pay_cl_cd = "06J2"; //후불
						field.usim_mdl_cd = $("#usimModelNo_org").val();
						field.usim_ser_num = $("#usimSerialNo").val();

						data.field = field;
						data.header = header;
						base.data = data;

						console.log(JSON.stringify(base));

						$.ajax({
							type: 'POST',
							url: '/appIf/v1/skt/apihub/SKSU00201',
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
										var res = response.data.BODY;
										if(res.message.rps_code == "000000"){
											console.log("USIM가용구분코드="+res.field.usim_avail_cd);

											var usimAvailCd = res.field.usim_avail_cd;
											if(usimAvailCd == "02TA"){ //사용가능
												sendSKNP01600();
											}
											else{
												popalarm2("사용할 수 없는 유심입니다.<br/>자세한 사유는 고객센터(1522-9999)로 문의주세요.", "info", false,"",closePopup);
											}
										}
										else{
											popalarm2("시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
											return;
										}
									}
									else{
										popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
										return;
									}

								}catch(e){
									console.log(e);
									popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
									return;
								}

							},
							error: function(request,status,error){
								popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
							}
						});//end ajax

					}
					else{
						popalarm2("시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
					}
				} else {
				    openLoading("stop");
				}
			}
			catch(e){
				console.log(e);
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
			}
		},
		error: function(request,status,error){
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
		}
	});

}

//고객계정변경,청구계정등록
function sendSKSU00902(joinInfo){

	var serviceId = "SKSU00902";

	var base = new Object();
	base.serviceId = serviceId;
	var data = new Object();


	var header = new Object();
	var field = new Object();

	header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드
	header.api_trace_num = $("#apiTraceNum").val(); //추적번호

	field.cust_zip = $("#dlvrPstNo").val();
	field.cust_bas_addr = $("#dlvrBassAddr").val();
	field.cust_dtl_addr = $("#dlvrDtlAddr").val();
	field.cust_cntc_num = telNoSeqFormatter(joinInfo.dlvdstRcpntCellPhnNo);
	field.cust_email_addr = $("#emad").val();
	field.cu_acnt_num = $("#cuAcntNum").val();
	if(joinInfo.custTp == "GEF"){
		field.bl_acnt_nm = joinInfo.acntNm; //개인사업자의 납부자명은 상호명으로
	}
	else{
		field.bl_acnt_nm = joinInfo.custNm;
	}

	if($("#pymMthd").val() == "CM"){ //은행
		field.pay_mthd_cd = "A2901"; //은행자동납부
	}
	else{ //카드
		field.pay_mthd_cd = "A2902"; //카드자동납부
	}

	field.auth_req_ser_num = $("#authReqSerNum").val();
	if($("#billMdmEmlYn").val() == "Y"){
		field.bill_isue_typ_cd = "0382";//이메일청구서
	}
	else {
		field.bill_isue_typ_cd = "0386";//문자청구서
	}

	field.int_phon_dtl_isue_yn = "1"; //국제전화상세발행내역여부
	field.info_inv_dtl_disp_yn = "1"; //정보료청구상세표시여부

	data.field = field;
	data.header = header;
	base.data = data;

	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/skt/apihub/' + serviceId,
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
					var res = response.data.BODY;
					if(res.message.rps_code == "000000"){
						console.log("청구계정번호="+res.field.bl_acnt_num);
						$("#blAcntNum").val(res.field.bl_acnt_num);
						$("#billAcntNo").val(res.field.bl_acnt_num);


						//SKSU00201 USIM카드 가용확인
						var base = new Object();
						base.serviceId = "SKSU00201";
						var data = new Object();

						var header = new Object();
						var field = new Object();

						header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드
						header.api_trace_num = $("#apiTraceNum").val(); //추적번호

						field.pre_post_pay_cl_cd = "06J2"; //후불
						field.usim_mdl_cd = $("#usimModelNo_org").val();
						field.usim_ser_num = $("#usimSerialNo").val();

						data.field = field;
						data.header = header;
						base.data = data;

						console.log(JSON.stringify(base));

						$.ajax({
							type: 'POST',
							url: '/appIf/v1/skt/apihub/SKSU00201',
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
										var res = response.data.BODY;
										if(res.message.rps_code == "000000"){
											console.log("USIM가용구분코드="+res.field.usim_avail_cd);

											var usimAvailCd = res.field.usim_avail_cd;
											if(usimAvailCd == "02TA"){ //사용가능
												sendSKNP01600();
											}
											else{
												popalarm2("사용할 수 없는 유심입니다.<br/>자세한 사유는 고객센터(1522-9999)로 문의주세요.", "info", false,"",closePopup);
											}
										}
										else{
											popalarm2("시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
											return;
										}
									}
									else{
										popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
										return;
									}

								}catch(e){
									console.log(e);
									popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
									return;
								}

							},
							error: function(request,status,error){
								popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
							}
						});//end ajax

					}
					else{
						popalarm2("시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
					}
				} else {
				    openLoading("stop");
				}
			}
			catch(e){
				console.log(e);
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
			}
		},
		error: function(request,status,error){
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
		}
	});

}


//[번호이동]사전동의
function sendSKNP01600(execFunction){

	var serviceId = "SKNP01600";

	var base = new Object();
	base.serviceId = serviceId;
	var data = new Object();


	var header = new Object();
	var field = new Object();

	header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드
	header.api_trace_num = $("#apiTraceNum").val(); //추적번호

	field.cust_nm = $("#custNm").val();
	field.birth_dt = $("#regNo").val().substr(0,6);
	field.bnp_co_cd = "06T"+$("#mcoCd").val();
	field.anp_co_cd = "06TS14";
	field.svc_num = $("#mtelNo").val();
	//field.np_rst_cust_yn = "0"; //3개월이내 이동여부 1:예, 0:아니요
	field.np_rst_cust_yn = ($("#npRstCheckY").prop("checked") == true) ? "1" : "0"; //3개월이내 이동여부 1:예, 0:아니요

	data.field = field;
	data.header = header;
	base.data = data;

	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/skt/apihub/' + serviceId,
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
					var res = response.data.BODY;
					if(res.message.rps_code == "000000"){

						$("#SB808_RE").val("N");
						$("#SB813_RE").val("Y");
						console.log("NP관리번호="+res.field.np_mgmt_num);
						$("#npMgmtNum").val(res.field.np_mgmt_num);
						if(execFunction == "SKNP03000"){
							sendSKNP03000();
						} else {
						    openLoading("stop");
						}
					}
					else if(res.message.rps_code == "999999"){
						if(res.message.msg_id == "SORHE3212"){ //이미 인증성공한 NP응답
							$("#SB808_RE").val("N");
							$("#SB813_RE").val("Y");
							console.log("기성공 NP관리번호="+$("#npMgmtNum").val());
							if(execFunction == "SKNP03000"){
								sendSKNP03000();
							} else {
							    openLoading("stop");
                            }
						}
						else if(res.message.msg_id == "071BF1010" // 이동후3개월이내고객이동불가
							|| res.message.msg_id == "071BF1028"  // 010신규가입후3개월이내고객
							|| res.message.msg_id == "071BF1029"  // 명의변경후3개월이내고객
							|| res.message.msg_id == "071BF1015") // NP허용제한고객
						{ //번호이동 3개월 제한 고객의 경우 발생되는 오류
						    openLoading("stop");
							$("#SB808_RE").val("Y");
							console.log("번호이동 3개월 제한 오류 NP관리번호="+$("#npMgmtNum").val());
						}
						else{
							$("#SB808_RE").val("Y");
							popalarm2("일시적으로 오류가 발생하였습니다.<br/>"+fnCheckNull(res.message.msg_ctt), "info", false);
						}
					}
					else{
						$("#SB808_RE").val("Y");
						popalarm2("시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
					}
				} else {
				    openLoading("stop");
				}
			}
			catch(e){
				$("#SB808_RE").val("Y");
				console.log(e);
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
			}
		},
		error: function(request,status,error){
			$("#SB808_RE").val("Y");
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
		}
	});

}

//[번호이동]사전동의 결과확인 및 인증요청
function sendSKNP03000(){

	var serviceId = "SKNP03000";

	var base = new Object();
	base.serviceId = serviceId;
	var data = new Object();


	var header = new Object();
	var field = new Object();

	header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드
	header.api_trace_num = $("#apiTraceNum").val(); //추적번호

	field.np_pre_post_pay_cl_cd = "F061";//선후불구분코드 F060:선불고객, F061:후불고객
	field.cust_nm = $("#custNm").val();
	field.birth_dt = $("#regNo").val().substr(0,6);
	field.bnp_co_cd = "06T"+$("#mcoCd").val();
	field.anp_co_cd = "06TS14";
	field.np_auth_cd = "06X"+getAuthMthd(); //인증항목코드
	field.np_auth_ctt = $("#npAuthKey").val(); //인증항목값
	field.svc_num = $("#mtelNo").val();
	//field.np_rst_cust_yn = "0"; //3개월이내 이동여부 1:예, 0:아니요
	field.np_rst_cust_yn = ($("#npRstCheckY").prop("checked") == true) ? "1" : "0"; //3개월이내 이동여부 1:예, 0:아니요
	field.setoff_agree_yn = "1"; //미환급액요금상계 1:예, 0:아니요

	data.field = field;
	data.header = header;
	base.data = data;

	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/skt/apihub/' + serviceId,
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
					var res = response.data.BODY;
					if(res.message.rps_code == "000000"){
						$("#SB813_RE").val("N");
						console.log("NP관리번호="+res.field.np_mgmt_num);
						$("#npMgmtNum").val(res.field.np_mgmt_num);
						saveNpInfo();
					}
					else if(res.message.rps_code == "999999"){
						if(res.message.msg_id == "SORHE3212"){ //이미 인증성공한 NP응답
							$("#SB813_RE").val("N");
							console.log("기성공 NP관리번호="+$("#npMgmtNum").val());
							saveNpInfo();
						}
						else if(res.message.msg_id == "071BF1010" // 이동후3개월이내고객이동불가
							|| res.message.msg_id == "071BF1028"  // 010신규가입후3개월이내고객
							|| res.message.msg_id == "071BF1029"  // 명의변경후3개월이내고객
							|| res.message.msg_id == "071BF1015") // NP허용제한고객
						{ //번호이동 3개월 제한 고객의 경우 발생되는 오류
						    openLoading("stop");
							$("#SB808_RE").val("Y");
						    console.log("번호이동 3개월 제한 오류 NP관리번호="+$("#npMgmtNum").val());
						}
						else{
							$("#SB808_RE").val("Y");
							popalarm2("일시적으로 오류가 발생하였습니다.<br/>"+fnCheckNull(res.message.msg_ctt), "info", false);
						}
					}
					else{
						$("#SB813_RE").val("Y");
						popalarm2("시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
					}
				} else {
				    openLoading("stop");
				}
			}
			catch(e){
				$("#SB813_RE").val("Y");
				console.log(e);
				popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
			}
		},
		error: function(request,status,error){
			$("#SB813_RE").val("Y");
			popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
		}
	});
}

//[번호이동]진행상태조회(결과확인)
function checkSKNP00000(){
	var base = new Object();
	var data = new Object();

	var header = new Object();
	var field = new Object();

	header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드
	header.api_trace_num = $("#apiTraceNum").val(); //추적번호

	field.svc_num = $("#mtelNo").val();
	field.np_mgmt_num = $("#npMgmtNum").val();

	data.field = field;
	data.header = header;
	base.data = data;

	base.serviceId = "SKNP00000";
	base.data = data;
	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/skt/apihub/SKNP00000',
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
					var res = response.data.BODY;
					if(res.message.rps_code == "000000"){
						console.log("번호이동업무구분코드="+res.field.np_cd);
						console.log("번호이동처리응답코드="+res.field.np_rps_cd);
						console.log("번호이동처리응답명="+res.field.np_rps_nm);

						console.log("단말기 할부승계="+res.field.eqp_allot_pay_cd);
						console.log("단말할부잔액="+res.field.eqp_allot_bamt);

						var npCd = res.field.np_cd;
						var npRpsCd = res.field.np_rps_cd;
						var npRpsNm = res.field.np_rps_nm;
						var npMgmtNum = res.field.np_mgmt_num;

						//NP인증응답
						if(npCd == "0730310" || npCd == "0730410") { //0730310 : NP인증응답, 0730410 : NP요청응답
							if(npRpsCd == "071BS0000" || npRpsCd == "071BF1036"){
								$('#npMgmtNum').val(npMgmtNum);
								saveNpAuthInfo();
							}
							else if(npRpsCd == "071BF1010" || npRpsCd == "071BF1028"
								|| npRpsCd == "071BF1029" || npRpsCd == "071BF1015") { //번호이동 3개월 제한 고객의 경우 발생되는 오류
								// 071BF1010 : 이동후3개월이내고객이동불가
								// 071BF1028 : 010신규가입후3개월이내고객
								// 071BF1029 : 명의변경후3개월이내고객
								// 071BF1015 : NP허용제한고객
								$("#SB808_RE").val("Y");
							    $("#SB813_RE").val("N");

                                var npMessage =  "번호이동 후 90일 경과여부를 다시 한 번 확인하여 주시기 바랍니다.";
                                var npErrorName = npRpsCd.substr(3);
                                var npHelp = "<p><strong>90일이 경과한 고객 :</strong> 해당 질문에 대한 답변 <span class=\"fc_blue\">\"아니요\"</span> 선택 후 \"번호이동 사전동의 결과조회\" 버튼을 눌러주세요.</p><p><strong>90일이 경과하지 않은 고객 :</strong> 해당 질문에 대한 답변 <span class=\"fc_blue\">\"네\"</span> 선택 후 \"번호이동 사전동의 결과조회\" 버튼을 눌러주세요.</p>";
                                showOpeningFailLayer(npMessage, npErrorName, npHelp);
								return;
							}
							else if(npRpsCd == "071BF1001") {
							    showOpeningFailLayer("고객 유형이 불일치 합니다. 이동 전 통신사에서 고객 유형을 다시 확인해 주시기 바랍니다.<br/>※ 번호이동 인증 1일 7회 초과시, 익일 재인증 가능합니다.<br/>(KB Liiv M 고객센터 : 1522-9999)", "BF1001");
								return;
							}
							else if(npRpsCd == "071BF1004") {
							    showOpeningFailLayer("인증항목 구분이 일치하지 않습니다. 이동 전 통신사에서 등록정보를 다시 확인해 주시기 바랍니다.<br/>※ 번호이동 인증 1일 7회 초과시, 익일 재인증 가능합니다.<br/>(KB Liiv M 고객센터 : 1522-9999)", "BF1004");
								return;
							}
							else if(npRpsCd == "071BF1005") {
							    showOpeningFailLayer("인증정보가 일치하지 않습니다. 이동 전 통신사에서 등록정보를 다시 확인해 주시기 바랍니다.<br/>※ 번호이동 인증 1일 7회 초과시, 익일 재인증 가능합니다.<br/>(KB Liiv M 고객센터 : 1522-9999)", "BF1005");
								return;
							}
							else if(npRpsCd == "071BF1012") {
							    showOpeningFailLayer("이동 전 통신사 기 해지 고객입니다. 해지 철회 후 번호이동이 가능합니다.<br/>※ 번호이동 인증 1일 7회 초과시, 익일 재인증 가능합니다.<br/>(KB Liiv M 고객센터 : 1522-9999)", "BF1012");
								return;
							}
							else if(npRpsCd == "071BF1039") {
							    showOpeningFailLayer("번호이동 사전동의 내역이 확인되지 않습니다. 이동 전 통신사에서 번호이동 사전동의 후 진행해 주시기 바랍니다.<br/>(KB Liiv M 고객센터 : 1522-9999)", "BF1039");
								return;
							}
							else if(npRpsCd == "071BF2001") {
							    showOpeningFailLayer("해당사업자의 고객 전화번호가 아닙니다. 번호이동 전 통신사를 다시 확인 후 시도해 주시기 바랍니다.<br/>(KB Liiv M 고객센터 : 1522-9999)", "BF2001");
								return;
							}
							else if(npRpsCd == "071BF2001") {
							    showOpeningFailLayer("해당사업자의 고객 전화번호가 아닙니다. 번호이동 전 통신사를 다시 확인 후 시도해 주시기 바랍니다.<br/>(KB Liiv M 고객센터 : 1522-9999)", "BF2001");
								return;
							}
							else{
								popalarm2(npRpsNm+"<br/>확인 후 다시 시도해 주세요.", "info", false);
								return;
							}
						}
						else if(npCd == "0730300") { // 0730300 : NP인증요청
							popalarm2("번호이동 인증이 완료되지 않았습니다.<br/>다시 시도해 주세요.", "info", false);
							return;
						}
						else{
							popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
							return;
						}

					}
					else{
						popalarm2("시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
						return;
					}
				} else {
				    openLoading("stop");
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

//NP관련 신청 정보 저장
function saveNpInfo(){

	var appInfo = 'soId='+ $('#soId').val() + '&applSeqNo=' + $('#applSeqNo').val() + '&custId=' + $('#custId').val();
	    appInfo += '&npMngNo=' + $('#npMgmtNum').val();
	    appInfo += '&regrId=APP001' + '&chgrId=APP001';

	var npAuthMthd = "";
	var rdoNpInfo= $("input:radio[name='rdoNpInfo']:checked").val();
    if(rdoNpInfo == '1'){
    	npAuthMthd = '03';//신용카드
    }else if(rdoNpInfo == '2'){
    	npAuthMthd = '01';//휴대폰일련
    }else if(rdoNpInfo == '3'){
    	npAuthMthd = '02';//은행계좌번호
    }

    appInfo += '&npAuthMthd=' + npAuthMthd + '&npAuthKey=' + $('#npAuthKey').val() ;
    console.log(appInfo);
	$.ajax({
	       url:'/join/open/saveNpAuthInfo',
	       type:'POST',
	       data : appInfo,
	       //dataType: 'json',
            beforeSend : function(xhr, set) {
                let token = $("meta[name='_csrf']").attr("content");
                let header = $("meta[name='_csrf_header']").attr("content");
                xhr.setRequestHeader(header, token);
            },
	       success: function(responseData){
	    	   console.log(responseData);
	    	   var data = JSON.parse(responseData);

				if(data.result != '1'){
					popalarm2("신청정보 저장중 에러가 발생했습니다.", "info", false);
				} else {
				    openLoading("stop");
                }
	        },
	    	error : function(request, err){
	    		popalarm2("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
	    	}
	});
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
			sendSKNP01600("SKNP03000");
		}
		else if ($("#SB813_RE").val() == "Y"){
			gStatCount = 0;
			openLoading("start");
			sendSKNP03000();//[번호이동] MNP 인증요청 결과확인
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
			checkSKNP00000();
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


//(SKT)카드사 코드
function getSktCardCd(cardCd) {

	var returnVal = "";
	if(cardCd == "02") { //국민카드
		returnVal = "A5062";
	}
	else if(cardCd == "71") { //NH카드
		returnVal = "A5071";
	}
	else if(cardCd == "08") { //롯데신용카드
		returnVal = "A5068";
	}
	else if(cardCd == "01") { //비씨카드
		returnVal = "A5061";
	}
	else if(cardCd == "04") { //삼성카드
		returnVal = "A5065";
	}
	else if(cardCd == "26") { //신한카드
		returnVal = "A5066";
	}
	else if(cardCd == "72") { //씨티카드
		returnVal = "A5053";
	}
	else if(cardCd == "07") { //현대카드
		returnVal = "A5067";
	}
	else if(cardCd == "03") { //하나SK카드
		returnVal = "A5083";
	}

	return returnVal;
}

//(SKT)은행 코드
function getSktBankCd(bankCd) {
	var returnVal = "A14"+bankCd;

	return returnVal;
}