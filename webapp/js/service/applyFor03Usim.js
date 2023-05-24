/* 유심가입 통신사 SKT 관련 */
function checkOSST(){
	getJoinInfo();
}
function paymentAuth(gubun){
	if(gubun == "cert"){//자동이체 출금 전자서명전 검증인경우 
		var payMethod = $('input[name="c-paywray"]:checked').val();//납부
		var acntNo = $('#acntNoSel option:selected').val() ;
		
		if(payMethod == 'ac' && acntNo == ""){
            let opt = {
                msg : "계좌번호를 선택해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		} else if(payMethod == 'ac' && !checkValidationAgree()){
            let opt = {
                msg : "모든필수 약관에 동의해주세요.",
                cfrmYn : false,
				 okParam : "page_widthdrawAgree2",
                okcallback : stepActive
            };
            popalarm(opt);
            return;
		}
	}
	var data = new Object();
	var base = new Object();
	base.serviceId = "ITB021";
	
	var date = new Date();
	var gbCd  	= "";	//검증구분	1:카드검증,2:계좌검증
	var tranCd 	= "";	//거래구분	31 : 금융결제원 카드검증시 필수값
	var corpCardDstcd  = "1";	//기업카드구분 1:개인, 2:기업
	var cardDsticUno = "";		//카드사용자번호 개인:생년월일, 기업:사업자번호
	var askCardNo = ""; 		//청구카드번호
	var cardVakdYm = ""; 		//카드유효기일 MMYY
	var actNo 	= "";			//계좌번호
	var bankCd 	= ""; 			//은행코드
	var custId = "";
	var regNo = "";
	
	//가입자유형구분
	if($("#custTp").val() == "MIN"){
		regNo	= fnUnSign($("#legalRprsnRegNoH").val());
		//법정대리인 custId
		if($('#legCustId').val() != ""){
			custId = $('#legCustId').val();
		}else{
			custId = "999999999900000";
		}
	}else{
		regNo	= fnUnSign($("#regNoH").val());
		custId  = $("#custId").val();
	}
	
	cardDsticUno	= regNo.substr(0,6);
	
	//납부구분
	var payMth  = $('input[name="c-paywray"]:checked').val();
	if(payMth == 'ac'){
		actNo = $('#acntNoSel option:selected').val(); //계좌번호	
		if(actNo == '' || actNo == null || actNo == undefined){
			actNo = $('#acntNo').val();
		}    
		bankCd = $("#bankComp6H").val(); 	//은행코드
		gbCd = "2";
	}else{
		corpCardDstcd 	= "1";
		askCardNo 		= $("#cardNum").val().replace(/-/g,'');
		cardVakdYm		= $("#cardEffcprd").val().replace('/','');
		tranCd			= "31";
		gbCd 			= "1";
		bankCd 			= $("#cardComp6").val();
	}
	
	data.soId = $("#soId").val();
	data.gbCd = gbCd;
	data.tranCd = tranCd;
	data.askCardNo = askCardNo;
	data.cardValdYm= cardVakdYm;
	data.tranYmd = dateToYYYMMDD4(date);	//거래년월일 YYYMMDD
	data.mrvAmt = 1000; //고정값 거래금액 
	data.wonCd = "410";//고정값 금융결제원통화코드 
	data.buyUniqNo = "";
	data.athorNo = "";
	data.intmMocnt = 0; //고정값 할부개월수 
	data.custIdnfr = custId.substring(0, 10);  //고객식별자
	data.custMgtNo = custId.substring(10, 15); //고객관리번호
	data.commJoinNo = "";
	data.telNo = "";
	data.pymAcntId = "";
	data.corpCardDstcd =corpCardDstcd;
	data.cardDsticUno = cardDsticUno;
	data.commBzmanDstcd = $("#soId").val();
	data.actNo = actNo;
	data.bankCd = bankCd;
	data.resvArea ="";
	//console.log(JSON.stringify(data));

	base.data = data;
	
	$.ajax({
		url: '/appIf/v1/kb/eai/ITB021', 
		type: 'POST',
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		cache: false,
		dataType: "json",
		success: function(data) {
			//console.log(JSON.stringify(data));
			if(data.resultCode == '00000'){
				if(gubun == "cert"){
					var auth = $("input[name=c-certification]:checked").val();
					if(auth == "1"){
						gAuthMthd = "301";
						openKCBCertPopup();
					}else{// ARS
						//console.log("ARS인증");
						var arsParam = new Object();
						arsParam.kbPin = fnSign($("#custId").val()); //encoding
						arsParam.telNo = fnSign($('#arsCertCellPhoneNo').val()); //encoding
						arsParam.custNm = fnSign($("#custNm").val()); //encoding

						startKbArsCertPopup(arsParam);
					}
				}else{
					savePymAcntInfo();
				}
			} else {
				if(payMth == 'ac'){//계좌
                    let opt = {
                        msg : "인증에 실패하였습니다. 계좌정보를 다시 확인해주세요.",
                        cfrmYn : false
                    };
                    popalarm(opt);
                    return;
				} else {
                    let opt = {
                        msg : "인증에 실패하였습니다. 신용카드 인증정보를 다시 확인해주세요.",
                        cfrmYn : false
                    };
                    popalarm(opt);
                    return;
				}
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
	});//end ajax
}

function esbJoinIF(joinInfo) {
	//검증API 추가 예정
	lastSaveAppInfo(joinInfo);
}

//사전체크
function sendSKSU00101(){
	// SKT 외국인의 경우 LGT(CM804,CM806) 전문 호출
	if($("#custTp").val() == "IFX"){
		sendSktCM804();
		return;
	}else{
		var applTp = "N";
		var serviceId = "SKSU00101";
		
		var base = new Object();
		base.serviceId = serviceId;
		var data = new Object();

		var header = new Object();
		var field = new Object();
		
		header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드 
		header.api_trace_num = $("#apiTraceNum").val(); //추적번호
		field.np_yn = $("#npYn").val(); //번호이동여부 N:신규, Y번호이동
		
		//외국인인경우
		if($("#custTp").val() == "IFX"){
			field.id_typ = "0CWA"; //신분증종류 	0CW1:주민등록증, 0CW4:운전면허증, 0CWA:외국인등록증
			field.drv_licen_num = ""; //운전면허증
			field.id_isue_dt = $("#issfDt").val(); //발급일자
			
			field.cust_nm = removeStrSpace($("#fNm").val()); //이름
			field.ctz_num = fnUnSign($("#regNoH").val());
			
		}else if($("#custTp").val() == "MIN"){
		// 미성년자인경우 법정대리인정보
			if($('input:radio[name="rdoSelfIdf"][value="1"]').prop('checked') == true){
				field.id_typ = "0CW1";
				field.drv_licen_num = ""; 
				field.id_isue_dt = $('#legalRprsnJIssDt').val();
				
				field.cust_nm = removeStrSpace($("#legalRprsnNm").val());
				field.ctz_num = fnUnSign($("#legalRprsnRegNoH").val());
				
			}
			else if($('input:radio[name="rdoSelfIdf"][value="2"]').prop('checked') == true){
				field.id_typ = "0CW4"; 
				field.drv_licen_num =  fnUnSign($("#driverNoH").val()); //$('#legalRprsnDriverRgn').val() + $('#legalRprsnDriverNo').val().replace(/-/g,'');
				field.id_isue_dt = $("#legalRprsnIssueDt").val();
				
				field.cust_nm = removeStrSpace($("#legalRprsnNm").val());
				field.ctz_num = fnUnSign($("#legalRprsnRegNoH").val());
				
			}
		}else{ 
		// 개인,개인사업자,신용카드미소지자
			if($('input:radio[name="rdoSelfIdf"][value="1"]').prop('checked') == true){
				field.id_typ = "0CW1";
				field.drv_licen_num = ""; 
				field.id_isue_dt = $('#JIssDt').val();
				
				field.cust_nm = $("#custNm").val();
				field.ctz_num = fnUnSign($("#regNoH").val());
			
			}else if($('input:radio[name="rdoSelfIdf"][value="2"]').prop('checked') == true){
				field.id_typ = "0CW4"; 
				field.drv_licen_num = fnUnSign($("#driverNoH").val()); //$('#driverRgn').val() + $('#driverNo').val().replace(/-/g,'');
				field.id_isue_dt = $('#driverIssDt').val();
				
				field.cust_nm = $("#custNm").val(); 
				field.ctz_num = fnUnSign($("#regNoH").val());
			
			}
		}
		
		field.fee_prod_id = "PC0ZB00013"; //상품 기본11GB+
		field.indv_info_use_agree_yn = "Y"; //개인정보사용동의여부
		
		data.field = field;
		data.header = header;
		base.data = data;
		//console.log(JSON.stringify(base));
		
		$.ajax({
			type: 'POST',
			url: '/appIf/v1/skt/apihub/' + serviceId,
			data: fnSign(JSON.stringify(base)),
			contentType: 'application/json; charset=utf-8',
			cache: false,
			dataType: "json",
			success: function(response) {
				//console.log(JSON.stringify(response));
				try{
					if(response !== null && response.data !== null){
						var res = response.data.BODY;
						if(res.message.rps_code == "000000"){
							//console.log("주민등록일련번호="+res.field.ctz_ser_num);
							$("#ctzSerNum").val(res.field.ctz_ser_num);//임시
							
							showOpenBar();
							var ctemp = setTimeout(function(){ //interval
								checkSKSU00190();
								clearTimeout(ctemp);
							}, 8000);
						}
						else{
                            let opt = {
                                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                                cfrmYn : false
                            };
                            popalarm(opt);
                            return;
						}
					}
				}
				catch(e){
					//console.log(e);
                    let opt = {
                        msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                        cfrmYn : false
                    };
                    popalarm(opt);
                    return;
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
}

//본인확인 결과조회
function checkSKSU00190(){
	var base = new Object();
	var data = new Object();
	
	var header = new Object();
	var field = new Object();
	
	header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드 
	header.api_trace_num = $("#apiTraceNum").val(); //추적번호
	field.np_yn = $("#npYn").val(); //번호이동여부
	if($("#custTp").val() == "IFX"){
		field.cust_nm = removeStrSpace($("#fNm").val());
		field.ctz_num = fnUnSign($("#regNoH").val());
	}else if($("#custTp").val() == "MIN"){
		field.cust_nm = removeStrSpace($("#legalRprsnNm").val());
		field.ctz_num = fnUnSign($("#legalRprsnRegNoH").val());
	}else{
		field.cust_nm = $("#custNm").val(); 
		field.ctz_num = fnUnSign($("#regNoH").val());
	}
	field.ctz_ser_num = $("#ctzSerNum").val(); //주민등록일련번호
	
	data.field = field;
	data.header = header;
	base.data = data;
	
	base.serviceId = "SKSU00190";
	base.data = data;
	//console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/skt/apihub/SKSU00190', 
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		//async: false,
		cache: false,
		dataType: "json",
		success: function(response) {
			//console.log(JSON.stringify(response));
			try{
				
				if(response !== null && response.data !== null){
					var res = response.data.BODY;
					if(res.message.rps_code == "000000"){

						//console.log("실명확인정상여부="+res.field.rnm_check_norm_yn);
						//console.log("진위확인정상여부="+res.field.tru_check_norm_yn);
						//console.log("신용조회정상여부="+res.field.crdt_brws_norm_yn);
						//console.log("타사미납정상여부="+res.field.oco_col_norm_yn);
						//console.log("(다회선)정상여부="+fnCheckNull(res.field.mline_norm_yn));
						//console.log("(다회선)결과코드="+fnCheckNull(res.field.mline_rslt_cd));
						
						var rnmCheckNormYn = res.field.rnm_check_norm_yn;
						var truCheckNormYn = res.field.tru_check_norm_yn;
						var crdtBrwsNormYn = res.field.crdt_brws_norm_yn;
						var ocoColNormYn = res.field.oco_col_norm_yn;
						var mlineNormYn = fnCheckNull(res.field.mline_norm_yn);
						var mlineRsltCd = fnCheckNull(res.field.mline_rslt_cd);
						
						if($("#serverTarget").val() == "prod"){
							if(mlineRsltCd == "ML0P"){
                                let opt = {
                                    msg : "정보 조회 중 오류가 발생하여 다시 조회합니다.",
                                    cfrmYn : false,
               					 	okParam : joinInfo,
                                    okCallback : checkSKSU00190
                                };
                                popalarm(opt);
                                return;
							}
							else{
								if(rnmCheckNormYn == "Y" 
									&& truCheckNormYn == "Y"
									&& crdtBrwsNormYn == "Y"
									&& ocoColNormYn == "Y"
									&& mlineNormYn == "Y") {
									
									hideOpenBar();
									openKCBCertPopup();//KCB팝업 인증
								}else{
									hideOpenBar();
//									popalarm("가입 신청이 불가능합니다.<br>자세한 가입제한 사유는 고객센터(1522-9999)로 문의주세요.", "info", false);
                                    let opt = {
                                        msg : "가입 신청이 불가능합니다.<br>자세한 가입제한 사유는 고객센터(1522-9999)로 문의주세요.",
                                        cfrmYn : false,
                   					 	okParam : joinInfo,
                                        okCallback : checkSKSU00190 // to-be 양식 확인필요
                                    };
                                    popalarm(opt);
                                    return;
								}
							}
						}else{
							hideOpenBar();
							openKCBCertPopup();//KCB팝업 인증
						}
					}else{
						hideOpenBar();
						let opt = {
                            msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                            cfrmYn : false
                        };
                        popalarm(opt);
                        return;
					}
				}
			}catch(e){
				hideOpenBar();
				//console.log(e);
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
			}
		},
		error: function(request,status,error){
			hideOpenBar();
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
			return;
		}
	});//end ajax
}
function sendSB804(){
	if($("#mcoCd").val() == ""){
        let opt = {
            msg : "사용중인 통신사를 선택해주세요.",
            cfrmYn : false,
			 okParam : "page_transfer",
            okcallback : stepActive
        };
        popalarm(opt);
		return;
	}else if($("#mtelNo").val() == ""){
        let opt = {
            msg : "휴대폰 번호를 입력해주세요.",
            cfrmYn : false,
			 okParam : "page_transfer",
            okcallback : stepActive
        };
        popalarm(opt);
		return;
	}else if(applMYn){//사전동의된 경우 재검증없이 2단계부터 저장
		saveApplTp();
		return;
	}
	
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
	//console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/SB804', 
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		//async: false,
		cache: false,
		dataType: "json",
		success: function(response) {
			//console.log(JSON.stringify(response));
			if(response !== null && response.data !== null){
				if(response.resultCode !== 'N0000'){
                    let opt = {
                        msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                        cfrmYn : false
                    };
                    popalarm(opt);
                    return;
				}
				var resultCode = "";
				
				try{
					resultCode = response.data.RetrieveSmrtCheckMnpRunTimeBDResponse.ResponseRecord.ResponseBody.ResultOutVO.resultCode;
				}catch(e){
					
				}
				//console.log(' resultCode=' + resultCode);

				if(resultCode == 'YES'){
					//미성년자 번호이동인 경우 번호이동사전검증 X <- 법정대리인 신분증 사전체크로 미성년자번호이동사전검증이 불가함
					if($("#custTp").val() == "MIN"){
						saveApplTp();
						applMYn = true; //사전동의 검증여부 (한번 호출)
						
						$(".select_inline.full.notclose").empty();
						$("#mtelNo").prop("disabled",true);

						goPageForJoin();
					}else{
						sendSKSU00201();
					}
				}else{
                    modalLayer.show({
                        titleUse : true,
                        title : "개통 가능 시간에<br>다시 시도해 주세요",
                        id : "openTimeLayer",
                        type : "bottom",
                        closeUse : false
                    });
				}	
			}else{
				
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
	});//end ajax
}

//[번호이동]사전동의
function sendSKSU00201(){
	var serviceId = "SKSU00201";
	
	var base = new Object();
	base.serviceId = serviceId;
	var data = new Object();
	

	var header = new Object();
	var field = new Object();
	
	header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드 
	header.api_trace_num = $("#apiTraceNum").val(); //추적번호
	
	field.pre_post_pay_cl_cd = "06J2";	//선불요금제,후불요금제구분 
	field.usim_mdl_cd = $("#usimMdlCd").val(); //Usim 모델코드 
	field.usim_ser_num = $("#usimSerNum").val(); //Usim 일련번호 

	data.field = field;
	data.header = header;
	base.data = data;
	
	//console.log(JSON.stringify(base));
	
	$.ajax({
		type: 'POST',
		url: '/appIf/v1/skt/apihub/' + serviceId,
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		cache: false,
		dataType: "json",
		success: function(response) {
			//console.log(JSON.stringify(response));
			try{
				if(response !== null && response.data !== null){
					var res = response.data.BODY;
					if(res.message.rps_code == "000000"){
						sendSKNP01600();
					}
					else{
//						popalarm("시스템오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
                        let opt = {
                            msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                            cfrmYn : false
                        };
                        popalarm(opt);
                        return;
					}
				}
			}
			catch(e){
				//console.log(e);
//				popalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
			}
		},
		error: function(request,status,error){
//			popalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}
	});
	
}

//[번호이동]사전동의
function sendSKNP01600(){
	var serviceId = "SKNP01600";
	
	var base = new Object();
	base.serviceId = serviceId;
	var data = new Object();
	

	var header = new Object();
	var field = new Object();
	
	header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드 
	header.api_trace_num = $("#apiTraceNum").val(); //추적번호
	
	field.cust_nm = $("#custNm").val();
	field.birth_dt = fnUnSign($("#regNoH").val()).substr(0,6);//생년월일 6자리
	field.bnp_co_cd = "06T"+$("#mcoCd").val();
	field.anp_co_cd = "06TS14"; //고정값
	field.svc_num = $("#mtelNo").val();
	field.np_rst_cust_yn = "0"; //3개월이내 이동여부 1:예, 0:아니요

	data.field = field;
	data.header = header;
	base.data = data;
	
	//console.log(JSON.stringify(base));
	
	$.ajax({
		type: 'POST',
		url: '/appIf/v1/skt/apihub/' + serviceId,
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		cache: false,
		dataType: "json",
		success: function(response) {
			//console.log(JSON.stringify(response));
			try{
				if(response !== null && response.data !== null){
					var res = response.data.BODY;
					if(res.message.rps_code == "000000"){
						//console.log("NP관리번호="+res.field.np_mgmt_num);
						saveApplTp();
						applMYn = true; //사전동의 검증여부 (한번 호출)
						
						$(".select_inline.full.notclose").empty();
						$("#mtelNo").prop("disabled",true);

						goPageForJoin();
					}
					else if(res.message.rps_code == "999999"){
						if(res.message.msg_id == "SORHE3212"){ //이미 인증성공한 NP응답
							saveApplTp();
							applMYn = true; //사전동의 검증여부 (한번 호출)
							
						    $(".select_inline.full.notclose").empty();
							$("#mtelNo").prop("disabled",true);

						    goPageForJoin();
						}
						else{
                            let opt = {
                                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                                cfrmYn : false,
           					 	okParam : "page_transfer",
                                okcallback : stepActive
                            };
                            popalarm(opt);
                            return;
						}
					}
					else{
                        let opt = {
                            msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                            cfrmYn : false,
       					 	okParam : "page_transfer",
                            okcallback : stepActive
                        };
                        popalarm(opt);
                        return;
					}
				}
			}catch(e){
				//console.log(e);
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false,
					okParam : "page_transfer",
                    okcallback : stepActive
                };
                popalarm(opt);
                return;
			}
		},
		error: function(request,status,error){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false,
				okParam : "page_transfer",
                okcallback : stepActive
            };
            popalarm(opt);
            return;
		}
	});
	
}

//본인확인 :: 고객의 개통 가능 여부 사전 체크 CM804(SKT 외국인일 경우에만 해당 전문 호출)
function sendSktCM804(){
	var json_obj = new Object();
	var base = new Object();
	var data = new Object();
	var CheckSmrtCustomerInfo = new Object();
	var RequestRecord = new Object();
	var RequestBody = new Object();
	var ReqDataInVO = new Object();
	var UserInfoInVO = new Object();
	
	base.serviceId = "CM804";
	
	// 외국인 셋팅정보 시작
	ReqDataInVO.custDvCd = "I";
	ReqDataInVO.custKdCd = $("#custTp").val();
	ReqDataInVO.bsRegNo = "";
	ReqDataInVO.chkFrgnCustRnm = "Y";
	ReqDataInVO.chkCorpClose = "N";
	ReqDataInVO.custNm = $("#fNm").val();
	ReqDataInVO.preCustRnmFlag = "P";//복지할인 체크P;
	// 외국인 셋팅정보 끝
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
	ReqDataInVO.custrnmNo = fnUnSign($("#regNoH").val());
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
	
	//console.log(JSON.stringify(base));

	$.ajax({
		url: '/appIf/v1/uplus/esb/CM804', 
		type: 'POST',
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		//async: false,
		cache: false,
		dataType: "json",
		success: function(response) {
			//console.log(response);
			if(response.resultCode == 'N0000'){
				var errCnt = 0;
				var welfStatus = "";//복지할인
				
				try {
					var DsCustRnmRsltOutVO = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsCustRnmRsltOutVO;
					errCnt += (isEmpty(DsCustRnmRsltOutVO)) ? 0 : Number(DsCustRnmRsltOutVO.errCnt);
					//console.log("CM804 고객실명 Error count = "+DsCustRnmRsltOutVO.errCnt);
				} catch(e) {}
				try {
					var DsCBScoreRsltOutVO = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsCBScoreRsltOutVO;
					errCnt += (isEmpty(DsCBScoreRsltOutVO)) ? 0 : Number(DsCBScoreRsltOutVO.errCnt);
					//console.log("CM804 신용정보조회 Error count = "+DsCBScoreRsltOutVO.errCnt);
				} catch(e) {}
				try {
					var DsLverifyOutVO     = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsLverifyOutVO;
					errCnt += (isEmpty(DsLverifyOutVO))     ? 0 : Number(DsLverifyOutVO.errCnt);
					//console.log("CM804 자사체납 Error count = "+DsLverifyOutVO.errCnt);
				} catch(e) {}
				try {
					var DsSbgnRsltOutVO    = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsSbgnRsltOutVO;
					//console.log("CM804 가입회선 Error count = "+DsSbgnRsltOutVO.errCnt);
				} catch(e) {}
				try {
					var DsBlRsltOutVO      = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsBlRsltOutVO;
					errCnt += (isEmpty(DsBlRsltOutVO))      ? 0 : Number(DsBlRsltOutVO.errCnt);
					//console.log("CM804 블랙리스트 Error count = "+DsBlRsltOutVO.errCnt);
				} catch(e) {}
				try {
					var DsCorpCloseRsltOutVO      = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsCorpCloseRsltOutVO;
					errCnt += (isEmpty(DsCorpCloseRsltOutVO))      ? 0 : Number(DsCorpCloseRsltOutVO.errCnt);
					//console.log("CM804 휴폐업사업자 Error count = "+DsCorpCloseRsltOutVO.errCnt);
				} catch(e) {}
				
				try {
					var DsWelfRsltOutVO      = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsWelfRsltOutVO;
					welfStatus = (isEmpty(DsWelfRsltOutVO)) ? "" : DsWelfRsltOutVO.welfStatus;
				} catch(e) {}
				
				//console.log("CM804 response="+ JSON.stringify(response));
				//console.log("CM804 errCnt="+ errCnt);
				
				if(errCnt > 0) {
                    let opt = {
                        msg : "가입 신청이 불가능합니다.<br>자세한 가입제한 사유는 고객센터(1522-9999)로 문의주세요.",
                        cfrmYn : false
                    };
                    popalarm(opt);
                    return;
				} else {
					if(welfStatus == '등록가능'){
						let opt = {
                            msg : "고객님은 나눔할인 대상자입니다.",
                            cfrmYn : false,
                            okCallback : IdentityAuth
                        };
                        popalarm(opt);
                        return;
                } else {
						sendSktCM806();//신분증 진위 검증	
					}
				}
			} else if(response.resultCode == 'E0000' || response.resultCode == 'sys.err.005'){
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
			} else {
                let opt = {
                    msg : "신분증 정보를 정확히 입력해주세요.<br>" + response.resultMessage,
                    cfrmYn : false
                };
                popalarm(opt);
                return;
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
	});//end ajax
}

//본인확인 :: 개인 신분증 검증 결과값 리턴(SKT 외국인일 경우에만 해당 전문 호출)
function sendSktCM806(){
	
	var base = new Object();
	var data = new Object();
	var RetrieveSmrtCustKaitTrthAutnYn = new Object();
	var RequestRecord = new Object();
	var RequestBody = new Object();
	var DsKaitAuthPassInVO = new Object();
	var UserInfoInVO = new Object();
	var DsCustInfoInVO = new Object();
	var ymdhms = getYYYYMMDDHHMMSS();
	var regNo = fnUnSign($("#regNoH").val());
	var inqDvCd = "FORGN";
	var drvLcnsNo = "";
	base.serviceId = "CM806";
	
	// 외국인 셋팅정보 시작
	DsKaitAuthPassInVO.indvDvCd = "FT";
	DsKaitAuthPassInVO.custNm = removeStrSpace($("#fNm").val());
	DsKaitAuthPassInVO.isuDt = $("#issfDt").val();
	DsKaitAuthPassInVO.trdnmNm = "";
	// 외국인 셋팅정보 끝	
	
    DsKaitAuthPassInVO.prodSvcNm = "TextYN";
    DsKaitAuthPassInVO.inqDt = ymdhms.substr(0,8);
    DsKaitAuthPassInVO.entrDlrCd = ymdhms.substr(8,6);
    DsKaitAuthPassInVO.tadvOrgnzCd = "A331";
    DsKaitAuthPassInVO.inqDvCd = inqDvCd;
    DsKaitAuthPassInVO.prodDvCd = "MOB";
    DsKaitAuthPassInVO.cnctDvCd = "D";
    DsKaitAuthPassInVO.entrDvCd = "1";
    DsKaitAuthPassInVO.inqWorkCd = "BE";
    DsKaitAuthPassInVO.agrmtDvCd = "Y";
    DsKaitAuthPassInVO.lawcAgntAgrmtYn = "";
    DsKaitAuthPassInVO.userIp = "127.0.0.1";
    DsKaitAuthPassInVO.workDlrId = "315397";
    DsKaitAuthPassInVO.recvId = "1100000288";
    DsKaitAuthPassInVO.dlrNm = "KB국민은행지점";
    DsKaitAuthPassInVO.sbrnCd = "";
    DsKaitAuthPassInVO.persFrgnrPsnoEnprNo = regNo;
    DsKaitAuthPassInVO.drvLcnsNo = drvLcnsNo;
    DsKaitAuthPassInVO.ntnltCd = "";
    DsKaitAuthPassInVO.btday = "";
    DsKaitAuthPassInVO.lawcAgntPersNo = "";
    DsKaitAuthPassInVO.lawcAgntNm = "";
    DsKaitAuthPassInVO.coBsRegNo = "";
    DsKaitAuthPassInVO.natnMomrtStndCd = "";
    DsKaitAuthPassInVO.applicationId = "CM806";
    DsKaitAuthPassInVO.jobDvCd = "NAC";
    DsKaitAuthPassInVO.ocrSeqno = "";
    DsKaitAuthPassInVO.nextOperatorId = "1100000288";
   
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
    UserInfoInVO.workDlrCd = "";
    UserInfoInVO.workDlrNm = "";
    UserInfoInVO.workDlrGrpCd = "";
    UserInfoInVO.nextOperatorId = "1100000288"
    
    DsCustInfoInVO.custKdCd = "II";
    DsCustInfoInVO.agntCustKdCd = "";
    DsCustInfoInVO.custNo = "";
    DsCustInfoInVO.agntCustNo = "";
    DsCustInfoInVO.entrNo = "";
    DsCustInfoInVO.nextOperatorId = "1100000288"
	
   	RequestBody.DsKaitAuthPassInVO = DsKaitAuthPassInVO;
	RequestBody.UserInfoInVO = UserInfoInVO;
	RequestBody.DsCustInfoInVO = DsCustInfoInVO;
	RequestRecord.RequestBody = RequestBody;
	RetrieveSmrtCustKaitTrthAutnYn.RequestRecord = RequestRecord;
	data.RetrieveSmrtCustKaitTrthAutnYn = RetrieveSmrtCustKaitTrthAutnYn;
	base.data = data;

	$.ajax({
		url: '/appIf/v1/uplus/esb/CM806',
		type: 'POST',
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		cache: false,
		dataType: "json",
		success: function(data) {
			var vTotSuccCd = "N";
			try {
				vTotSuccCd = data.data.RetrieveSmrtCustKaitTrthAutnYnResponse.ResponseRecord.ResponseBody.DsKaitRsltOutVO.totSuccCd;
			} catch(e) {
				vTotSuccCd = "E";						
			}

			if($("#serverTarget").val() != "prod"){
				if($("#custTp").val() == "IFX") vTotSuccCd = 'F'; //20201208 외국인의 경우, 개발/스테이지에서 결과코드를 F값으로 고정처리
			}
			
			if(vTotSuccCd == 'Y' || ($("#serverTarget").val() != "prod" && vTotSuccCd == 'F' ) ){	
				// 인증성공했을때 
				openKCBCertPopup();// KCB본인인증 팝업 오픈
			} else if( data.resultCode == "icm.err.901" ){
                let opt = {
                    msg : "신분증 정보를 인증하지 못했습니다. 다른 신분증을 이용해주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
			} else if( vTotSuccCd == 'N' ){
                let opt = {
                    msg : "신분증 정보를 인증하지 못했습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
			} else {
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
			}
		},
		error: function(request,status,error){
			
		}
	});//end ajax
}
