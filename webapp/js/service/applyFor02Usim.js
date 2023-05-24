var gStatCount = 0;

/* 유심가입 통신사 KT 관련 */
function checkOSST(){
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
					sendPC0(data.joinInfo);
				} else {
					applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
                    let opt = {
                        msg : "일시적으로 오류가 발생하였습니다. 다시 시도해주세요.",
                        cfrmYn : false
                    };
                    popalarm(opt);
                    return;
				}
			} else {
				applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
			}
		},
        error: function(e){
        	applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
        }
	});
}


//사전체크 및 고객생성 요청
function sendPC0(joinInfo){
	var idCardTp = joinInfo.idcardTp;
	var minorYn = joinInfo.legalRprsnYn;
	
	var serviceId = "";
	serviceId = "OSSTPC00";
	
	var base = new Object();
	base.serviceId = serviceId;
	var data = new Object();
	
	var osstPrePrc = new Object();
	var OsstPrePrcInVO = new Object();
	var inDto = new Object();
	var inNpDto = new Object();
	
	inDto.mvnoOrdNo = $("#mvnoOrdNo").val(); //MVNO 오더 번호
	inDto.cntrUseCd = "R"; //계약용도코드
	inDto.instYn = "N"; //할부여부
	inDto.scnhndPhonInstYn = "N"; //중고폰할부여부
	inDto.myslAgreYn = "Y"; //본인동의여부
	
	inDto.athnRqstcustCntplcNo = telNoSeqFormatter(joinInfo.dlvdstRcpntCellPhnNo); //인증요청고객연락처번호
	
	if($('input:radio[name="rdoSelfIdf"][value="1"]').prop('checked') == true){
		inDto.nativeRlnamAthnEvdnPprCd = "REGID"; //내국인실명인증증빙서류코드
		inDto.lcnsNo = ""; //면허번호
		inDto.lcnsRgnCd = ""; //면허지역코드
		inDto.rsdcrtIssuDate = $("#JIssDt").val(); //주민등록증발급일자
	} else {
		inDto.nativeRlnamAthnEvdnPprCd = "DRIVE"; //내국인실명인증증빙서류코드
		inDto.lcnsNo = fnUnSign($("#driverNoH").val()).substr(2); //$('#driverNo').val().replace(/-/g,''); //면허번호
		inDto.lcnsRgnCd = fnUnSign($("#driverNoH").val()).substr(0,2); //$('#driverRgn').val(); //면허지역코드
		inDto.rsdcrtIssuDate = $("#driverIssDt").val(); //운전면허증 발급일자
	}
	
	inDto.mrtrPrsnNo = ""; //유공자번호
	inDto.nationalityCd = "KOR"; //국적코드
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
	inDto.wrlnTlphNo = "" //유선전화번호
	inDto.tlphNo = "";//telNoSeqFormatter(joinInfo.dlvdstRcpntCellPhnNo); //전화번호

	inDto.zipNo = joinInfo.dlvrPstNo; //우편번호
	inDto.fndtCntplcSbst = joinInfo.dlvrBassAddr; //기본연락처내용
	inDto.mntCntplcSbst = joinInfo.dlvrDtlAddr; //상세연락처내용
	

	var birth_gender = fnUnSign($("#regNoH").val()).substr(0,7);
	var birthDay = "";
	if(birth_gender.charAt(6) == "1" || birth_gender.charAt(6) == "2" || birth_gender.charAt(6) == "5" || birth_gender.charAt(6) == "6") {
		birthDay = "19" + birth_gender.substr(0,6);
	} else {
		birthDay = "20" + birth_gender.substr(0,6);
	}
	inDto.brthDate = birthDay; //생일일자
	inDto.brthNnpIndCd = ""; //생일음양구분코드
	inDto.jobCd = ""; //직업코드
	inDto.emlAdrsNm = ""; //이메일주소명
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
		if($('input:radio[name="c-select2-id"][value="1"]').prop('checked')){
			inDto.agntIdfyNoVal = fnUnSign($("#legalRprsnRegNoH").val()); //법정대리인 고객식별번호 : 주민등록번호
			inDto.agntRsdcrtIssuDate = $("#legalRprsnJIssDt").val();; //법정대리인 식별번호 발급일자
			inDto.nativeRlnamAthnEvdnPprCd = "COURT"; //내국인실명인증증빙서류코드(법정대리인)
			inDto.rsdcrtIssuDate = ""; //주민등록증발급일자 

		}else {
			inDto.agntIdfyNoVal = fnUnSign($("#driverNoH").val()).substr(2); //$('#legalRprsnDriverNo').val().replace(/-/g,''); //법정대리인 고객식별번호 : 운전면허번호
			inDto.agntRsdcrtIssuDate = $("#legalRprsnIssueDt").val(); //법정대리인 식별번호 발급일자
			inDto.nativeRlnamAthnEvdnPprCd = "COURT"; //내국인실명인증증빙서류코드(법정대리인)
			inDto.rsdcrtIssuDate = ""; //주민등록증발급일자

		}
		inDto.agntCustNm = removeStrSpace($("#legalRprsnNm").val()); //법정대리인 성명
		inDto.agntCustIdfyNoType = "01"; //법정대리인 식별번호 종류
		
		if(fnUnSign($("#legalRprsnRegNoH").val()).length > 7){
			var tempGender = fnUnSign($("#legalRprsnRegNoH").val()).substr(6,1);
			var gender = "1";
			if(tempGender == "1" || tempGender == "3" || tempGender == "5" || tempGender == "7"){
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
	inDto.custIdntNo = fnUnSign($("#regNoH").val()); //고객식별번호
	inDto.custIdntNoIndCd = "01"; //고객식별번호구분코드
	inDto.custNm = joinInfo.custNm; //고객명
	inDto.custTypeCd = "I"; //고객유형코드
	inDto.slsCmpnCd = "KBM"; //판매회사코드
	
	inNpDto.athnItemCd = ""; //인증항목코드
	inNpDto.athnSbst = ""; //인증항목값
	inNpDto.bchngNpCommCmpnCd = ""; //변경전번호이동사업자코드
	inNpDto.crprNo = ""; //법인번호
	inNpDto.custIdntNo = ""; //고객식별번호
	inNpDto.custIdntNoIndCd = ""; //고객식별번호구분코드
	inNpDto.custNm = ""; //고객명
	inNpDto.custTypeCd = ""; //고객유형코드
	inNpDto.indvBizrYn = ""; //개인사업자여부	
	inNpDto.npRstrtnContYn = ""; //번호이동제한예외여부
	inNpDto.npTlphNo = ""; //번호이동전화번호
	inNpDto.oderTypeCd = ""; //오더유형코드
	inNpDto.slsCmpnCd = ""; //판매회사코드
	inNpDto.ytrpaySoffAgreYn = ""; //해지미환급금 상계동의여부
	inNpDto.custIdntNoIndCd = ""; //고객식별번호구분코드
	
	inDto.rprsPrsnNm = joinInfo.repNm;; //대표자명
	inDto.upjnCd = ""; //업종코드
	inDto.bcuSbst = ""; //업태내용
	
	if($("#custTp").val() == "IFX"){
		inDto.custIdntNoIndCd = "05";
		inDto.nativeRlnamAthnEvdnPprCd = "FORGN"; //내국인실명인증증빙서류코드
		inDto.nationalityCd = "USA"; //외국인 국적코드
		inDto.fornBrthDate = birthDay; //외국인생일일자
		inDto.rsdcrtIssuDate = $("#issfDt").val();
	}
	
	OsstPrePrcInVO.inDto = inDto;
	OsstPrePrcInVO.inNpDto = inNpDto;
	osstPrePrc.OsstPrePrcInVO = OsstPrePrcInVO;
	
	data.osstPrePrc = osstPrePrc;
	base.data = data;
	
	//console.log(JSON.stringify(base));
	
	$.ajax({
		type: 'POST',
		url: '/appIf/v1/kt/osst/' + serviceId,
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		cache: false,
		dataType: "json",
		success: function(response) {
			//console.log(JSON.stringify(response));
			try{
				if(response !== null && response.data !== null){
					var res = response.data.osstPrePrcResponse.return;
					if(res.commHeader.responseType == "N"){
						if(res.rsltCd == "S") { //S: 접수정상, F:접수에러
							//console.log("OSST 오더 번호="+res.osstOrdNo);
							$("#osstOrdNo").val(res.osstOrdNo);
							checkST0(res.osstOrdNo);
						} else {
							applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
                            let opt = {
                                msg : res.rsltMsg+"<br/>다시 시도해 주세요.",
                                cfrmYn : false
                            };
                            popalarm(opt);
                            return;
						}
					}
					else{
						var errCd = res.commHeader.responseCode;
						var errMsg = res.commHeader.responseBasic;
						if(errCd != "" && gErrCdList[errCd] != undefined && gErrCdList[errCd] != null){
							if(errCd == "ITL_COM_E0003"){
                                let opt = {
                                    msg : errMsg + "<br/>" + gErrCdList[errCd],
                                    cfrmYn : false
                                };
                                popalarm(opt);
                                return;
							}
							else{
								applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
                                let opt = {
                                    msg : gErrCdList[errCd],
                                    cfrmYn : false
                                };
                                popalarm(opt);
                                return;
							}
						}
						else{
							applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
                            let opt = {
                                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                                cfrmYn : false
                            };
                            popalarm(opt);
                            return;
						}
					}
				}
			}
			catch(e){
				//console.log(e);
				applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
			}
		},
		error: function(request,status,error){
			applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}
	});
	
}


//사전조회 상태 확인
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
	//console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/kt/osst/OSSTST10', 
		data: fnSign(JSON.stringify(base)), 
		contentType: 'application/json; charset=utf-8',
		//async: false,
		cache: false,
		dataType: "json",
		success: function(response) {
			//console.log(JSON.stringify(response));
			try{
				showOpenBar();
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
						//console.log("try"+gStatCount+" osstStat="+vPrgrStatCd);
						if(vPrgrStatCd == "PC2"){
							hideOpenBar();
							//PC0: 사전체크접수, PC1:사전체크 중, PC2: 사전체크완료
							//OP0: 개통 접수, OP1: 개통 진행 중, OP2: 개통작업 완료
							//CP0: 지능망직권해지접수, CP1: 지능망직권해지 진행 중, CP2: 지능망직권해지 완료
							if(vRsltCd == "0000"){
								//console.log("[PC0]사전체크 완료");
								//$("#osstOrdNo").val(osstOrdNo);
								//$("#osstStat").val(vPrgrStatCd);
								//$("#custNo").val(vCustId);
								getJoinInfo();
							}
							else{
								var vTrgCd = "";
								if(vRsltMsg.indexOf("면허번호") > 0) vTrgCd = "면허번호";
								else if(vRsltMsg.indexOf("발급일자") > 0) vTrgCd = "발급일자";
								else if(vRsltMsg.indexOf("주민번호") > 0) vTrgCd = "주민번호";
								
								if(vRsltCd != "" && gErrCdList[vRsltCd+vTrgCd] != undefined && gErrCdList[vRsltCd+vTrgCd] != null){
									applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
                                    let opt = {
                                        msg : gErrCdList[vRsltCd+vTrgCd],
                                        cfrmYn : false
                                    };
                                    popalarm(opt);
                                    return;
								}
								else{
									applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
                                    let opt = {
                                        msg : vRsltMsg,
                                        cfrmYn : false
                                    };
                                    popalarm(opt);
                                    return;
								}
							}
						}
						else{
							if(gStatCount < 7){
								var ctemp = setTimeout(function(){ //interval 10초
									hideOpenBar();
									checkST0(osstOrdNo);
									clearTimeout(ctemp);
								}, 5000);	
							}
							else{
								hideOpenBar();
								applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
                                let opt = {
                                    msg : "[" + vRsltCd + "]" + vRsltMsg + "<br/>KB Liiv M 고객센터 1522-9999로 문의 주시기 바랍니다.",
                                    cfrmYn : false
                                };
                                popalarm(opt);
                                return;
							}
						}
					}
					else{
						hideOpenBar();
						applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
                        let opt = {
                            msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                            cfrmYn : false
                        };
                        popalarm(opt);
                        return;
					}
					
				}else{
					hideOpenBar();
					applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
                    let opt = {
                        msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                        cfrmYn : false
                    };
                    popalarm(opt);
                    return;
				}
			}
			catch(e){
				hideOpenBar();
				//console.log(e);
				applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
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
			applStatRollback($("#soId").val(), $("#applSeqNo").val(), $("#custId").val());
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
			return;

		}
	});//end ajax
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
	lastSaveAppInfo(joinInfo);
}

//스마트개통 MNP 운영시간여부체크
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
            msg : "휴대폰 번호를 입력해 주세요.",
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
//					popalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
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
					sendNP1();

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
//			popalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false,"",goBack);
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}
	});//end ajax
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
	inDto.custIdntNo = fnUnSign($("#regNoH").val());
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
	
	//console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/kt/osst/OSSTNP10', 
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		//async: false,
		cache: false,
		dataType: "json",
		success: function(response) {
			//console.log(JSON.stringify(response));

			try{
				if(response !== null && response.data !== null){
					var res = response.data.osstNpBfacAgreeResponse.return;
					if(res.commHeader.responseType == "N"){
						saveApplTp();
						applMYn = true; //사전동의 검증여부 (한번 호출)
						
						$(".select_inline.full.notclose").empty();
						$("#mtelNo").prop("disabled",true);

						goPageForJoin();
					}
					else if(res.commHeader.responseType == "E"){
						if(res.commHeader.responseCode = "ITL_SST_E1014"){
							//이미 번호이동가입정보가 존재하는 전화번호 : 성공으로 본다
							saveApplTp();
							applMYn = true; //사전동의 검증여부 (한번 호출)
							
						    $(".select_inline.full.notclose").empty();
							$("#mtelNo").prop("disabled",true);

						    goPageForJoin();
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
                msg : "[NP1]일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}
	});//end ajax
}