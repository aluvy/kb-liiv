var gTestArr = new Array();
var gTestObj = new Object();
var gStatCount = 0;
var gVrEqpMthd = ""; //USIM단독개통가상단말방식 EQ101:3G, EQ102:LTE, EQ103 : 5G

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
	if(data.iccid.length > 19){
		$("#usimSerialNo").val(data.iccid.substr(11,20));
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


	applTp = data.applTp;//번호이동 M 신규가입 N

	$("#usimpicskt").click();

	fnGetChrgInfo(data.chrgPln);
}

//요금제 정보 가져오기
function fnGetChrgInfo(vProdCd){
	if(vProdCd != ''){
		$.ajax({
		    url:  '/appIf/v1/rateplan/LMPM000002',
		    type: 'POST',
		    data: {
		    	soId : '99',
		    	svcTp : '99',
		    	grpTp : '',
		    	smsAmt : '',
		    	voiceAmt : '',
		    	dataAmt : '',
		    	prodCd : vProdCd
		    },
			cache: false,
			dataType: "json",
            beforeSend : function(xhr, set) {
                let token = $("meta[name='_csrf']").attr("content");
                let header = $("meta[name='_csrf_header']").attr("content");
                xhr.setRequestHeader(header, token);
            },
		    success: function(data) {
		    	console.log("--------LMPM000002-------");
		    	console.log(data);
		    	try{
		    		if(data.searchProdList[0].svcTp == "02") gVrEqpMthd = "EQ103";
		    		else gVrEqpMthd = "EQ102";
		    	}
		    	catch(e){
		    		gVrEqpMthd = "EQ102";
		    		console.log(e);
		    	}
		    },
		    error: function(e) {
		    	gVrEqpMthd = "EQ102";
		    	console.log(e);
		    },
		    complete: function() {
		        openLoading("stop");
		    }
		});
	}
}

//USIM 선 체크
function chkUsimCard(){

	var str    = "";
	if($("#iccid").val().length == 20) str = $("#iccid").val().substr(6,20);
	var strTmp = $("#usimSerialNoR").val();
	var len    = strTmp.length;

	if( strTmp == "" || len !== 14){
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
			$("#btnOpenReq").prop("disabled",false);

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

			openLoading("start");
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
                                    let opt = {
                                         msg         : "유심번호가 확인되었습니다.",
                                         cfrmYn      : false,
                                         okCallback  : setDisabledUsim
                                    };
                                    popalarm(opt);
								}
								else{
                                    let opt = {
                                         msg         : "사용할 수 없는 유심입니다.",
                                         cfrmYn      : false
                                    };
                                    popalarm(opt);
									return;
								}
							}
							else{
                                let opt = {
                                     msg         : "시스템 오류:일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                                     cfrmYn      : false
                                };
                                popalarm(opt);
								return;
							}
						}
						else{
							popalarmRetry();
							return;
						}

					}catch(e){
						console.log(e);
						popalarmRetry();
						return;
					}

				},
				error: function(request,status,error){
					popalarmRetry();
				},
                complete: function() {
                    openLoading("stop");
                }
			});//end ajax

		}

	}//end if
}

//USIM 일련번호 체크
function chkUsimNo(){
	saveOpenigDstcd();
	var str    = "";
	if($("#iccid").val().length == 20) str = $("#iccid").val().substr(6,20);
	var strTmp = $("#usimSerialNoR").val();
	var len    = strTmp.length;

	if( strTmp == "" || len !== 14){
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
                 cfrmYn      : false,
                 okCallback  : callbackCallCenter
            };
            popalarm(opt);
		}
		else{
            showOpenBar();

			//sendSB804();//스마트개통 MNP 운영시간여부체크
			var sb816_re = $("#SB816_RE").val();

			if(sb816_re == 'Y'){
				gStatCount = 0;
				sendSKSU01001();
			}else{

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
										sendSKSU01001();//USIM 단독개통
									}
									else{
									    hideOpenBar();
                                        let opt = {
                                             msg         : "사용할 수 없는 유심입니다.",
                                             cfrmYn      : false
                                        };
                                        popalarm(opt);
										return;
									}
								}
								else{
								    hideOpenBar();
                                    let opt = {
                                         msg         : "시스템 오류:일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                                         cfrmYn      : false
                                    };
                                    popalarm(opt);
									return;
								}
							}
							else{
							    hideOpenBar();
								popalarmRetry();
								return;
							}

						}catch(e){
							console.log(e);
							hideOpenBar();
							popalarmRetry();
							return;
						}

					},
					error: function(request,status,error){
					    hideOpenBar();
						popalarmRetry();
					}
				});//end ajax


			}
		}

	}//end if
}


//개통요청 처리
function sendSKSU01001(){

	var prodRqstNo = $("#applSeqNo").val();

	var billAcntNo  = $("#billAcntNo").val();
	var prodNo		= $("#mtelNo").val();//전화번호
	var custNo      = $("#custNo").val();
	var usimFeeCnt	=	$("#usimFeeCnt").val(); //유심카운트

	var base = new Object();
	base.serviceId = "SKSU01001";
	var data = new Object();

	var header = new Object();
	var field = new Object();

	header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드
	header.api_trace_num = $("#apiTraceNum").val(); //추적번호

	field.pre_post_pay_cl_cd = "06J2"; //후불
	field.scrb_typ_cd = "0862"; //0862:USIM단독, 0865:번호이동USIM단독
	field.cust_nm = $("#custNm").val();
	field.ctz_num = $("#regNo").val();
	field.ctz_ser_num = $("#ctzSerNum").val();
	field.svc_num = $("#mtelNo").val();
	field.np_mgmt_num = "";
	field.cu_acnt_num = $("#custNo").val();
	field.scrb_fee_cl_cd = "0"; //가입비구분코드 0: 면제, 1:분납, 2:즉납
	field.fee_prod_id = $("#mnoProdCd").val();
	field.bl_acnt_num = $("#billAcntNo").val();
	field.vr_eqp_mthd = gVrEqpMthd; //EQ102:LTE, EQ103 : 5G
	field.eqp_mdl_cd = "";//단말기모델코드
	field.eqp_ser_num = "";//단말기일련번호
	field.usim_mdl_cd = $("#usimModelNo_org").val();
	field.usim_ser_num = $("#usimSerialNo").val();

	//TODO 유료는 Y에 1,2 / 무료는 N에 공백(유심발급횟수 체크 후 2회이하)
	if(Number(usimFeeCnt) > 3 ){
		field.usim_pay_yn = "Y";//유심카드후불여부
		field.usim_fee_cd = "2";//1:6,600(BASIC), 2:7,700(NFC)
	}else{
		field.usim_pay_yn = "N";//유심카드후불여부
		field.usim_fee_cd = "";//1:6,600(BASIC), 2:7,700(NFC)
	}

	field.eqp_dc_cl_cd = "";
	field.dc_scrb_typ_cd = "";
	field.dc_mth_cnt = "";
	field.rcv_dt = "";
	field.rcv_tm = "";
	field.allot_mth_cnt = "";
	field.indv_info_use_agree_yn = "Y";//개인정보사용동의여부
	field.req_sale_br_org_cd = "KBC0007"; //판매점코드
	field.sale_chnl_cd = "SALA001"; //판매채널정책(판매채널코드)
	field.prom_sale_chnl_cd1 = ""; //프로모션판매채널코드1
	field.sv_acnt_num = ""; //서비스계정번호

	data.field = field;
	data.header = header;
	base.data = data;

	base.processMode = "backend";
	base.pApplSeqNo = $("#applSeqNo").val();
	base.pSoId = $("#soId").val();

	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/skt/apihub/SKSU01001',
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

						var ctemp = setTimeout(function(){ //interval 10초
							checkSKSU01002();
							clearTimeout(ctemp);
						}, 10000);
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
function checkSKSU01002(){

	var base = new Object();
	base.serviceId = "SKSU01002";
	var data = new Object();

	var header = new Object();

	header.api_org_cd = "KBC0007"; //사업자 채널(or조직) 코드
	header.api_trace_num = $("#apiTraceNum").val(); //추적번호

	data.header = header;
	base.data = data;

	console.log(JSON.stringify(base));

	base.data = data;
	base.processMode = "backend";
	base.pApplSeqNo = $("#applSeqNo").val();
	base.pSoId = $("#soId").val();

	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/skt/apihub/SKSU01002',
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
					var res = response.data.BODY;
					if(res.message.rps_code == "000000"){

						console.log("API서비스진행상태코드="+res.field.api_svc_proc_st_cd);
						console.log("API서비스진행상태명="+res.field.api_svc_proc_st_nm);
						console.log("서비스계정번호="+res.field.sv_acnt_num);

						var apiSvcProcStCd = res.field.api_svc_proc_st_cd;
						var svAcntNum = res.field.sv_acnt_num;

						console.log("try"+gStatCount+" apiSvcProcStCd="+apiSvcProcStCd);
						if(apiSvcProcStCd == "SS5CO"){
							//SS5CN 취소, SS5CO 완료, SS5PR 처리중
							updateApplStat(svAcntNum);

						}
						else{
							if(gStatCount < 7){
								var ctemp = setTimeout(function(){ //interval 10초
									checkSKSU01002();
									clearTimeout(ctemp);
								}, 10000);
							}
							else{
								hideOpenBar();
                                let opt = {
                                     msg         : "시스템 오류:일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
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
                             msg         : "시스템 오류:일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
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

function popalarmRetry(){
    let opt = {
         msg         : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
         cfrmYn      : false
    };
    popalarm(opt);
}