var gTestArr = new Array();
var gTestObj = new Object();
var gStatCount = 0;

//신청정보 데이터 세팅
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
	$("#preCheckSucYn").val(data.preCheckSucYn);

	$("#posCd").val(data.posCd);
	
    //법정대리인
    $("#legalRprsnYn").val(data.legalRprsnYn);
	$("#legalRprsnNm").val(data.legalRprsnNm);
	$("#legalRprsnRegNo").val(data.legalRprsnRegNo);
	$("#legalRprsnDriverNo").val(data.legalRprsnDriverNo);
    $("#legalRprsnIssueDt").val(data.legalRprsnIssueDt);
    $("#legalRprsnRel").val(data.legalRprsnRel);
    $("#legalRprsnTelNo").val(data.legalRprsnTelNo);
    
    //데이터쉐어링
    $("#dsharStat").val(data.dsharStat);
    $("#dsharRelCd").val(data.dsharRelCd);
    $("#oppntCtrtId").val(data.oppntCtrtId);
    
    

	if(data.custTp == "IFX" || data.legalRprsnYn == "Y" || $("#dsharRelCd").val() == "C"){
	    openLoading("stop");
        let opt = {
             msg         : "SKT망은 만 19세 이상의 개인(내국인)만 셀프 개통이 가능합니다.<br/>이외 고객님께는 개통을 위해 KB Liiv M 고객센터에서 순차적으로 연락 드리겠습니다.<br/>감사합니다.",
             cfrmYn      : false,
             okCallback  : goBack
        };
        popalarm(opt);
	}
	else{
		if(data.esimYn == "C" || data.esimYn == "Y"){
		    openLoading("stop");
            let opt = {
                 msg         : "SKT망 eSIM 개통은 고객센터(1522-9999)로 문의주세요.",
                 cfrmYn      : false,
                 okCallback  : goBack
            };
            popalarm(opt);
		}
		else{
			sendSKSU00101(data);
		}
	}

	/*
	if($("#dsharRelCd").val() == "C") { // 데이터 쉐어링 가입
		getParentsMvnoPymAcntId();
	}
	*/
}

//사전체크
function sendSKSU00101(joinInfo){
	var applTp = "N";
	var idCardTp = joinInfo.idcardTp;

	var serviceId = "SKSU00101";

	var base = new Object();
	base.serviceId = serviceId;
	var data = new Object();


	var header = new Object();
	var field = new Object();

	header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드
	header.api_trace_num = $("#apiTraceNum").val(); //추적번호
	field.np_yn = "N"; //번호이동여부
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
					    openLoading("stop");
                        let opt = {
                             msg         : "시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                             cfrmYn      : false,
                             okCallback  : goBack
                        };
                        popalarm(opt);
					}
				} else {
				    openLoading("stop");
				}
			}
			catch(e){
				console.log(e);
				popalarmRetry();
			}
		},
		error: function(request,status,error){
			popalarmRetry();
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
	field.np_yn = "N"; //번호이동여부
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
                                openLoading("stop");
                                let opt = {
                                     msg         : "가입 신청이 불가능합니다.<br/>자세한 가입제한 사유는 고객센터(1522-9999)로 문의주세요.",
                                     cfrmYn      : false,
                                     okCallback  : closePopup
                                };
                                popalarm(opt);
							}
						}

					}
					else{
						openLoading("stop");
                        let opt = {
                             msg         : "시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                             cfrmYn      : false,
                             okCallback  : goBack
                        };
                        popalarm(opt);
					}
				} else {
				    openLoading("stop");
				}

			}
			catch(e){
				console.log(e);
				popalarmRetry();
				return;
			}
		},
		error: function(request,status,error){
			popalarmRetry();
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
					    openLoading("stop");
                        let opt = {
                             msg         : "시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                             cfrmYn      : false,
                             okCallback  : goBack
                        };
                        popalarm(opt);
					}
				} else {
				    openLoading("stop");
				}
			}
			catch(e){
				console.log(e);
				popalarmRetry();
			}
		},
		error: function(request,status,error){
			popalarmRetry();
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
							openLoading("stop");
                            let opt = {
                                 msg         : "자동납부 체크중 오류가 발생하였습니다.<br/>자세한 사유는 고객센터(1522-9999)로 문의주세요.",
                                 cfrmYn      : false,
                                 okCallback  : closePopup
                            };
                            popalarm(opt);
						}

					}
					else{
						openLoading("stop");
                        let opt = {
                             msg         : "시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                             cfrmYn      : false,
                             okCallback  : goBack
                        };
                        popalarm(opt);
					}
				} else {
				    openLoading("stop");
				}

			}
			catch(e){
				console.log(e);
				popalarmRetry();
				return;
			}
		},
		error: function(request,status,error){
			popalarmRetry();
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
			    openLoading("stop");
				if(response !== null && response.data !== null){
					var res = response.data.BODY;
					if(res.message.rps_code == "000000"){

						console.log("고객계정번호="+res.field.cu_acnt_num);
						console.log("청구계정번호="+res.field.bl_acnt_num);
						$("#blAcntNum").val(res.field.bl_acnt_num);
						$("#cuAcntNum").val(res.field.cu_acnt_num);
						$("#custNo").val(res.field.cu_acnt_num);
						$("#billAcntNo").val(res.field.bl_acnt_num);

					}
					else{
                        let opt = {
                             msg         : "시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                             cfrmYn      : false,
                             okCallback  : goBack
                        };
                        popalarm(opt);
					}
				}
			}
			catch(e){
				console.log(e);
				popalarmRetry();
			}
		},
		error: function(request,status,error){
			popalarmRetry();
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
			    openLoading("stop");
				if(response !== null && response.data !== null){
					var res = response.data.BODY;
					if(res.message.rps_code == "000000"){
						console.log("청구계정번호="+res.field.bl_acnt_num);
						$("#blAcntNum").val(res.field.bl_acnt_num);
						$("#billAcntNo").val(res.field.bl_acnt_num);
					}
					else{
                        let opt = {
                             msg         : "시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                             cfrmYn      : false,
                             okCallback  : goBack
                        };
                        popalarm(opt);
					}
				}
			}
			catch(e){
				console.log(e);
				popalarmRetry();
			}
		},
		error: function(request,status,error){
			popalarmRetry();
		}
	});

}



//전화번호 뒷자리 체크
function chkTelno(){
	var str = $("#rTelNo").val();
	var len = str.length;

	if($("#rTelNo").val() == ""){
        let opt = {
             msg         : "희망번호를 정확히 입력해주세요.",
             cfrmYn      : false,
             okCallback  : "rTelNo"
        };
        popalarm(opt);
		return;
    }else if(len !== 4){
        let opt = {
             msg         : "희망번호를 정확히 입력해주세요.",
             cfrmYn      : false,
             okCallback  : "rTelNo"
        };
        popalarm(opt);
		return;
	}else{
	    openLoading("start");
		sendSKSU00601();//희망번호 목록 조회
	}//end if
}


//번호패턴에 따른 목록 조회
function sendSKSU00601(param){

	var rTelNo = $("#rTelNo").val();
	var serviceId = "SKSU00601";

	var base = new Object();
	base.serviceId = serviceId;
	var data = new Object();


	var header = new Object();
	var field = new Object();

	header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드
	header.api_trace_num = $("#apiTraceNum").val(); //추적번호

	field.prefr_svc_line_num = rTelNo;

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
					if(res.message.rps_code == "000000" || res.message.rps_code == "999999"){

						var listArry = "";

						try{
							listArry = res.list;//ARRAY
						}catch(e){
							listArry = "";
						}

						console.log(' listArry=' + JSON.stringify(listArry));

						var html    = "";

						if(listArry != null && listArry.length != 0){

							telListCnt += listArry.length;
							lastListCnt = listArry.length;

							for(var i = 0 ; i < listArry.length ; i++ ){
								var tlphNo = listArry[i].prefr_svc_num_info; //전화번호
								var ctn  = tlphNo;
								var ctn2  = telNoAutoFormatter(tlphNo);

                                html += "<div class=\"radio_item box_type\" onClick=\"setTelNo('"+ tlphNo+"');\">";
                                html += "<input type=\"radio\" name=\"c-phonenum\" value=\""+tlphNo+"\">";
                                html += "<label class=\"label\">" + ctn2 + "</label>";
                                html += "</div>";

								first_ctn = (first_ctn == '') ? ctn : first_ctn;


							}//end for
							$('#btnCnfrm').prop("disabled",false);
						}else{
							lastListCnt = 0;
							if(telListCnt == 0){
								$('#btnCnfrm').prop("disabled",true);

                                html += "<div class=\"none_data\">";
                                html += "<p>검색 결과가 없습니다.</p>";
                                html += "</div>";
							}
						}

						var fromctn = Number($("#fromctn").val());

						if(fromctn > 0){
							$("#telNoList").append(html);
						}else{
							$("#telNoList").html("");
							$("#telNoList").html(html);

                            openLoading("stop");

                            $.ohyLayer({
                                title   : '원하는 번호가 있으면 선택해주세요',
                                content : '#telNoListLayer',
                                type    : 'bottom',
                            });
						}
                        // 레이어창 닫기
                        $('#telNoListLayer_dev').click(function(){ $("#reTry").val("true"); });

                        var reTry = $("#reTry").val();
                        // 전체조회 처리
                        if(lastListCnt >= 10 && (reTry == "false")){

                        }else{
                            $("#reTry").val("false");
                        }
					}
					else{
					    openLoading("stop");
                        let opt = {
                             msg         : "시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                             cfrmYn      : false
                        };
                        popalarm(opt);
					}
				} else {
				    openLoading("stop");
				}
			}
			catch(e){
				console.log(e);
				popalarmRetry2();
			}
		},
		error: function(request,status,error){
			popalarmRetry2();
		}
	});


}

//모바일 번호 예약 OSSTNU20(KT)
function sendSKSU00690(){

	var serviceId = "SKSU00690";

	var base = new Object();
	base.serviceId = serviceId;
	var data = new Object();


	var header = new Object();
	var field = new Object();

	header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드
	header.api_trace_num = $("#apiTraceNum").val(); //추적번호

	field.svc_num = $("#mtelNo").val();

	data.field = field;
	data.header = header;
	base.data = data;

	console.log(JSON.stringify(base));

    openLoading("start");
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
						goUsimReg();
					}
					else{
					    openLoading("stop");
                        let opt = {
                             msg         : "시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                             cfrmYn      : false
                        };
                        popalarm(opt);
						return;
					}
				} else {
				    openLoading("stop");
				}
			}
			catch(e){
				console.log(e);
				popalarmRetry2();
				return;
			}
		},
		error: function(request,status,error){
			popalarmRetry2();
			return;

		}
	});//end ajax

}


//부모 청구번호(U+ 납부자번호) 조회
function getParentsMvnoPymAcntId() {
	var url = "/join/open/getParentsMvnoPymAcntId";
	
	$.ajax({
		type : "post",
		url  : url,
		data : {
			soId      :  $("#soId").val(),
			ctrtId    :  $("#oppntCtrtId").val()
		},
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
		success : function(response) {
		    openLoading("stop");
			if(isEmpty(response.result)) {
				popalarmRetry();
				return;
			}
			
			$("#billAcntNo").val(response.result);
		},
        error: function(e){
        	popalarmRetry();
        }
	});
}

function popalarmRetry(){
    openLoading("stop");
    let opt = {
         msg         : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
         cfrmYn      : false,
         okCallback  : goBack
    };
    popalarm(opt);
}

function popalarmRetry2(){
    openLoading("stop");
    let opt = {
         msg         : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
         cfrmYn      : false
    };
    popalarm(opt);
}

//12 자리 폰 번호 가져오기
function getCtnFormat(value){
	
	if(value != null){
		value = value.trim(); 
	}
	
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

//납부차수 확인
function getPayDimension() {
	if(gToday < "20200401") {
		return "1"; //1차수
	}
	else{
		return "2";	//2차수
	}
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