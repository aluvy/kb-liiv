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
    
    //KT일련번호
    $("#mvnoOrdNo").val(data.mvnoOrdNo);
    $("#osstOrdNo").val(data.osstOrdNo);
    $("#osstStat").val(data.osstStat);
    
	console.log("mvnoOrdNo="+data.mvnoOrdNo);
	console.log("osstOrdNo="+data.osstOrdNo);
	console.log("osstStat="+data.osstStat);
	
	console.log("esimYn="+data.esimYn);
	console.log("modelItemid="+data.modelItemid);
	console.log("modelSerialNo="+data.modelSerialNo);
	console.log("modelEid="+data.modelEid);
	console.log("imei="+data.imei);
	console.log("imei2="+data.imei2);
	console.log("modelMacAddress="+data.modelMacAddress);

	if("20221001" <= gToday ){ //KT망 시즌 제휴요금제 판매 종료
    	if(data.chrgPln == "PD00000704" || data.chrgPln == "PD00000705"){
            openLoading("stop");
            let opt = {
                 msg         : "KT 시즌 서비스 종료에 따라 신청하신 시즌 제휴 요금제는 판매가 종료된 상품입니다. <br/>고객센터로 문의 부탁드립니다.<br/>(고객센터☎ 1522-9999)",
                 cfrmYn      : false,
                 okCallback  : goBack
            };
            popalarm(opt);
    		return;
    	}
    }

	if(data.esimYn == "C"){
	    openLoading("stop");
        let opt = {
             msg         : "개통에 필요한 eSIM정보가 유효하지 않습니다.<br/>eSIM정보 먼저 등록해주세요.",
             cfrmYn      : false,
             okCallback  : goBack
        };
        popalarm(opt);
	}
	else if(data.esimYn == "Y"){
		if(data.modelItemid == "" || data.modelSerialNo == "" || data.modelEid == "" || data.imei2 == ""){
		    openLoading("stop");
            let opt = {
                 msg         : "개통에 필요한 eSIM정보가 유효하지 않습니다.<br/>eSIM정보 먼저 등록해주세요.",
                 cfrmYn      : false,
                 okCallback  : goBack
            };
            popalarm(opt);
		}
		else{
			sendPC0(data);

			if($("#dsharRelCd").val() == "C") { // 데이터 쉐어링 가입
				getParentsMvnoPymAcntId();
			}
		}
	}
	else{
		sendPC0(data);

		if($("#dsharRelCd").val() == "C") { // 데이터 쉐어링 가입
			getParentsMvnoPymAcntId();
		}
	}

}

//사전체크 및 고객생성 요청
function sendPC0(joinInfo){
	var applTp = "N";
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
	inDto.wrlnTlphNo = telNoSeqFormatter(joinInfo.dlvdstRcpntCellPhnNo); //유선전화번호
	inDto.tlphNo = "";//telNoSeqFormatter(joinInfo.dlvdstRcpntCellPhnNo); //전화번호

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

	//일반가입시 inNpDto는 미사용처리
	inNpDto.athnItemCd = ""; //인증항목코드
	inNpDto.athnSbst = ""; //인증항목값
	inNpDto.bchngNpCommCmpnCd = ""; //변경전번호이동사업자코드
	inNpDto.crprNo = ""; //법인번호
	inNpDto.custIdntNo = ""; //고객식별번호
	inNpDto.custIdntNoIndCd = ""; //고객식별번호구분코드
	inNpDto.custNm = ""; //고객명
	inNpDto.custTypeCd = ""; //고객유형코드

	if(joinInfo.custTp == "GEF"){
		inNpDto.indvBizrYn = ""; //개인사업자여부
	}
	else {
		inNpDto.indvBizrYn = ""; //개인사업자여부
	}

	inNpDto.npRstrtnContYn = ""; //번호이동제한예외여부
	inNpDto.npTlphNo = ""; //번호이동전화번호
	if(applTp == "N"){
		inNpDto.oderTypeCd = ""; //오더유형코드
	}
	else {
		inNpDto.oderTypeCd = "";
	}
	inNpDto.slsCmpnCd = ""; //판매회사코드
	inNpDto.ytrpaySoffAgreYn = ""; //해지미환급금 상계동의여부
	inDto.rprsPrsnNm = joinInfo.repNm;; //대표자명
	inDto.upjnCd = ""; //업종코드
	inDto.bcuSbst = ""; //업태내용

	if($("#custTp").val() == "IFX"){
		inDto.custIdntNoIndCd = "05"; //고객식별번호구분코드
		inDto.nativeRlnamAthnEvdnPprCd = "FORGN"; //내국인실명인증증빙서류코드
		inDto.nationalityCd = "USA"; //국적코드
		inDto.fornBrthDate = birthDay; //외국인생일일자
	}

	OsstPrePrcInVO.inDto = inDto;
	OsstPrePrcInVO.inNpDto = inNpDto;
	osstPrePrc.OsstPrePrcInVO = OsstPrePrcInVO;

	data.osstPrePrc = osstPrePrc;
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
					var res = response.data.osstPrePrcResponse.return;
					if(res.commHeader.responseType == "N"){
						if(res.rsltCd == "S") { //S: 접수정상, F:접수에러
							console.log("OSST 오더 번호="+res.osstOrdNo);
							$("#osstOrdNo").val(res.osstOrdNo);
							checkST0(res.osstOrdNo);
						} else {
						    openLoading("stop");
                            let opt = {
                                 msg         : res.rsltMsg+"<br/>다시 시도해 주세요.",
                                 cfrmYn      : false,
                                 okCallback  : goBack
                            };
                            popalarm(opt);
						}
					}
					else{
						var errCd = res.commHeader.responseCode;
						var errMsg = res.commHeader.responseBasic;
						if(errCd != "" && gErrCdList[errCd] != undefined && gErrCdList[errCd] != null){
							if(errCd == "ITL_COM_E0003"){
							    openLoading("stop");
                                let opt = {
                                     msg         : errMsg+"<br/>"+gErrCdList[errCd],
                                     cfrmYn      : false,
                                     okCallback  : goBack
                                };
                                popalarm(opt);
							}
							else{
							    openLoading("stop");
                                let opt = {
                                     msg         : gErrCdList[errCd],
                                     cfrmYn      : false,
                                     okCallback  : goBack
                                };
                                popalarm(opt);
							}
						}
						else{
						    openLoading("stop");
                            let opt = {
                                 msg         : "시스템 오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                                 cfrmYn      : false,
                                 okCallback  : goBack
                            };
                            popalarm(opt);
						}
					}
				}else{
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

								if(vRsltCd != "" && gErrCdList[vRsltCd+vTrgCd] != undefined && gErrCdList[vRsltCd+vTrgCd] != null){
								    openLoading("stop");
                                    let opt = {
                                         msg         : gErrCdList[vRsltCd+vTrgCd],
                                         cfrmYn      : false,
                                         okCallback  : goBack
                                    };
                                    popalarm(opt);
									return;
								}
								else{
								    openLoading("stop");
                                    let opt = {
                                         msg         : vRsltMsg,
                                         cfrmYn      : false,
                                         okCallback  : goBack
                                    };
                                    popalarm(opt);
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
							    openLoading("stop");
                                let opt = {
                                     msg         : "["+vRsltCd+"]"+vRsltMsg+"<br/>KB Liiv M 고객센터 1522-9999로 문의 주시기 바랍니다.",
                                     cfrmYn      : false,
                                     okCallback  : goBack
                                };
                                popalarm(opt);
								return;
							}
						}
					}
					else{
					    openLoading("stop");
                        let opt = {
                             msg         : "시스템 오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                             cfrmYn      : false,
                             okCallback  : goBack
                        };
                        popalarm(opt);
						return;
					}

				}else{
					popalarmRetry();
					return;
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
			    openLoading("stop");
				console.log("[ST1] 상태업데이트 완료");
			} else {
				popalarmRetry();
			}
		},
        error: function(e){
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
		sendNU1();//희망번호 목록 조회
	}//end if
}


//번호패턴에 따른 목록 조회
function sendNU1(param){

	var base = new Object();
	var data = new Object();

	var inqrOsstSvcNoInfo = new Object();

	var InqrOsstSvcNoInfoInVO = new Object();
	var inDto   = new Object();

	var inqrSvcNoInfoInDTO   = new Object();

	var rTelNo = $("#rTelNo").val();

	var fromctn = param;

	if(fromctn == null || fromctn == ''){
		fromctn = "0";
	}else{

		fromctn = 10 + Number(fromctn);
		fromctn = fromctn + "";
	}

	$("#fromctn").val(fromctn);

	inqrSvcNoInfoInDTO.asgnAgncId = "AA01976"; //할당 대리점 ID
	inqrSvcNoInfoInDTO.asgnAgncYn = "Y"; //할당번호조회여부
	inqrSvcNoInfoInDTO.cntryCd = "KOR"; //국가코드
	inqrSvcNoInfoInDTO.custNo = $("#custNo").val(); //고객번호
	inqrSvcNoInfoInDTO.inqrBase = fromctn; //조회페이지(페이지번호)
	inqrSvcNoInfoInDTO.inqrCascnt = "10"; //조회카운트
	inqrSvcNoInfoInDTO.nowSvcIndCd = "03"; //2G,3G구분
	inqrSvcNoInfoInDTO.searchGubun = "2"; //조회구분 코드
	inqrSvcNoInfoInDTO.arPrGubun = ""; //예약/선호번호 구분코드
	inqrSvcNoInfoInDTO.custIdntNo = ""; //주민번호(미사용)
	inqrSvcNoInfoInDTO.custIdntNoIndCd = ""; //주민번호 구분 코드(미사용)
	inqrSvcNoInfoInDTO.tlphNoChrcCd = "GEN"; //전화번호특성코드
	inqrSvcNoInfoInDTO.tlphNoIndCd = "01"; //전화번호구분코드
	inqrSvcNoInfoInDTO.tlphNoPtrn = "010____"+rTelNo; //번호조회패턴
	inqrSvcNoInfoInDTO.tlphNoUseCd = "R";//번호사용용도코드
	inqrSvcNoInfoInDTO.tlphNoUseMntCd = "";//번호사용상세사유코드


    inDto.osstOrdNo   = $("#osstOrdNo").val();
	inDto.inqrSvcNoInfoInDTO   = inqrSvcNoInfoInDTO;

	InqrOsstSvcNoInfoInVO.inDto = inDto;

	inqrOsstSvcNoInfo.InqrOsstSvcNoInfoInVO = InqrOsstSvcNoInfoInVO;

	data.inqrOsstSvcNoInfo = inqrOsstSvcNoInfo;

	base.serviceId = "OSSTNU10";
	base.data = data;
	console.log(JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/kt/osst/OSSTNU10',
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
					var res = response.data.inqrOsstSvcNoInfoResponse.return;
					if(res.commHeader.responseType == "N"){
						var lastPageYn = res.outDto.lastPageYn; //Y or N
						console.log("lastPageYn="+lastPageYn);

						var listArry = "";

						try{
							listArry = res.outDto.svcNoList;//ARRAY
						}catch(e){
							listArry = "";
						}
						console.log(' listArry=' + JSON.stringify(listArry));

						var html    = "";

						if(listArry != null){

							telListCnt += listArry.length;
							lastListCnt = listArry.length;

							for(var i = 0 ; i < listArry.length ; i++ ){
								var tlphNoStatCd = listArry[i].tlphNoStatCd; //AA:사용가능, AR:예약중, AG:에이징
								var encdTlphNo = listArry[i].encdTlphNo; //암호화된 전화번호
								var tlphNo = listArry[i].tlphNo; //전화번호
								var ctn  = tlphNo;
								var ctn2  = telNoAutoFormatter(tlphNo);
								if(tlphNoStatCd == "AA"){
                                    html += "<div class=\"radio_item box_type\" onClick=\"setTelNo('"+ tlphNo+"');\">";
                                    html += "<input type=\"radio\" name=\"c-phonenum\" value=\""+tlphNo+"\" data-enc-no=\"" + encdTlphNo + "\">";
                                    html += "<label class=\"label\">" + ctn2 + "</label>";
                                    html += "</div>";

									first_ctn = (first_ctn == '') ? ctn : first_ctn;
								}

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
                            sendNU1($("#fromctn").val());
                        }else{
                            $("#reTry").val("false");
                        }
					}
					else{
                        openLoading("stop");
                        let opt = {
                             msg         : "시스템 오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                             cfrmYn      : false
                        };
                        popalarm(opt);
						return;
					}

				}else{
					popalarmRetry2();
					return;
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
		}
	});//end ajax


}

//모바일 번호 예약 OSSTNU20(KT)
function sendNU2(){

	var base = new Object();
	var data = new Object();

	var resvOsstTlphNo = new Object();
	var ResvOsstTlphNoInVO = new Object();
	var inDto   = new Object();

	var resvTlphNoInDTO   = new Object();
	resvTlphNoInDTO.asgnAgncId = "AA01976"; //할당 대리점 ID
	resvTlphNoInDTO.custIdntNo = "";
	resvTlphNoInDTO.custIdntNoIndCd = "";
	resvTlphNoInDTO.custNo  = $("#custNo").val(); //고객번호
	resvTlphNoInDTO.custTypeCd = "I";//$("#custTp").val() == "II"?"I": "B";
	resvTlphNoInDTO.encdTlphNo  = $("#encdTlphNo").val();
	resvTlphNoInDTO.gubun = "RSV";
	resvTlphNoInDTO.mnpIndCd = "";
	resvTlphNoInDTO.mnpMngmNo = "";
	resvTlphNoInDTO.mpngTlphNoYn = "";
	resvTlphNoInDTO.nowSvcIndCd = "03";
	resvTlphNoInDTO.tlphNo = $("#mtelNo").val();
	resvTlphNoInDTO.tlphNoStatCd = "AR";
	resvTlphNoInDTO.tlphNoStatChngRsnCd = "RSV";

	inDto.osstOrdNo   = $("#osstOrdNo").val();
	inDto.resvTlphNoInDTO   = resvTlphNoInDTO;

	ResvOsstTlphNoInVO.inDto = inDto;

	resvOsstTlphNo.ResvOsstTlphNoInVO = ResvOsstTlphNoInVO;

	data.resvOsstTlphNo = resvOsstTlphNo;

	base.serviceId = "OSSTNU20";
	base.data = data;
	console.log(JSON.stringify(base));

    openLoading("start");
	$.ajax({
		type: 'POST',
		url: '/appIf/v1/kt/osst/OSSTNU20',
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
					var res = response.data.resvOsstTlphNoResponse.return;
					if(res.commHeader.responseType == "N"){
						goUsimReg();
					}
					else{
					    openLoading("stop");
                        let opt = {
                             msg         : "시스템 오류 : 일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                             cfrmYn      : false
                        };
                        popalarm(opt);
						return;
					}

				}else{
					popalarmRetry2();
					return;
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

		}
	});//end ajax
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
			if(isEmpty(response.result)) {
				popalarmRetry();
				return;
			}else{
			    openLoading("stop");
			}
			
			$("#billAcntNo").val(response.result);
		},
        error: function(e){
        	popalarmRetry();
        }
	});
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