/* 유심가입 통신사 LG U 관련 */
// 본인확인 :: 개인 신분증 검증 결과값 리턴
function IdentityAuth(){
	console.log("1-9.개인 신분증 검증 결과값 리턴");
	var base = new Object();
	var data = new Object();
	var RetrieveSmrtCustKaitTrthAutnYn = new Object();
	var RequestRecord = new Object();
	var RequestBody = new Object();
	var DsKaitAuthPassInVO = new Object();
	var UserInfoInVO = new Object();
	var DsCustInfoInVO = new Object();
	var ymdhms = getYYYYMMDDHHMMSS();
	var regNo = "";
	var inqDvCd   = "";
	var drvLcnsNo = "";
	base.serviceId = "CM806";

	// 미성년자
	if($("#custTp").val() == "MIN"){
		regNo = fnUnSign($("#legalRprsnRegNoH").val());
		if($('input:radio[name="c-select2-id"][value="1"]').prop('checked')){
			inqDvCd = "REGID";
			DsKaitAuthPassInVO.isuDt = $("#legalRprsnJIssDt").val();
		}else {
			inqDvCd = "DRIVE";
			drvLcnsNo = fnUnSign($('#driverNoH').val()); //$('#legalRprsnDriverRgn').val() + $('#legalRprsnDriverNo').val().replace(/-/g,'');
			DsKaitAuthPassInVO.isuDt = $("#legalRprsnIssueDt").val();
		}
		DsKaitAuthPassInVO.indvDvCd = "01";
	    DsKaitAuthPassInVO.custNm = removeStrSpace($("#legalRprsnNm").val());
	    DsKaitAuthPassInVO.trdnmNm = "";

	}
	else{
		// 외국인
		if($("#custTp").val() == "IFX"){
			//regNo = $("#fNo").val().replace(/-/g,'');
			regNo = fnUnSign($("#regNoH").val());
			inqDvCd = "FORGN";
			DsKaitAuthPassInVO.indvDvCd = "FT";
		    DsKaitAuthPassInVO.custNm = removeStrSpace($("#fNm").val());
		    DsKaitAuthPassInVO.isuDt = $("#issfDt").val();
		    DsKaitAuthPassInVO.trdnmNm = "";

		}
		// 개인,개인사업자,신용카드미소지자
		else{
			regNo = fnUnSign($("#regNoH").val());
			if($('input:radio[name="rdoSelfIdf"][value="1"]').prop('checked') == true){
				inqDvCd = "REGID";
				DsKaitAuthPassInVO.isuDt = $("#JIssDt").val();
			} else {
				inqDvCd = "DRIVE";
				drvLcnsNo = fnUnSign($("#driverNoH").val()); //$('#driverRgn').val() + $('#driverNo').val().replace(/-/g,'');
				DsKaitAuthPassInVO.isuDt = $("#driverIssDt").val();
			}
			DsKaitAuthPassInVO.indvDvCd = "01";
		    DsKaitAuthPassInVO.custNm = removeStrSpace($("#custNm").val());
		    DsKaitAuthPassInVO.trdnmNm = "";

		}
	}

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
				openKCBCertPopup();// KCB본인인증 팝업 오픈
				$("#errMsg_idAuth").hide();

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
function checkOSST(){
	getJoinInfo();
}
//납부 방법 검증 CM808
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
                okCallback : stepActive
            };
            popalarm(opt);
			return;
		}
	}

	var base = new Object();
	var data = new Object();

	var CheckSmrtBillPymAcnt = new Object();
	var RequestRecord = new Object();
	var RequestBody = new Object();

	var DsPymAcntInVO = new Object();
	var DsBilAcntInVO = new Object();
	var UserInfoInVO  = new Object();
	base.serviceId = "CM808";

	var bankAcntNo      = "";
	var bankCd          = "";
	var bankNm          = "";
	var cardNo          = "";
	var cardValdEndYymm = "";
	var regNo 			= "";
	var acntOwnrNo      = "";
	var custNm  		= "";
  	var cpcmpCd 		= "";
  	var cpcmpNm 		= "";
 	var custId  		= "";
 	var payMth  = $('input[name="c-paywray"]:checked').val();//납부
	var pymMthdCd = "";
	var pymMthdNm = "";
	var email     = getEmail();
	var billEmailAddr = (email == '@') ? "1" : email;

	// 미성년자경우 법정대리인 정보입력
	if($("#custTp").val() == "MIN"){
		regNo 		= fnUnSign($("#legalRprsnRegNoH").val());
		acntOwnrNo  = regNo.substr(0,6);
		custNm  	= $("#legalRprsnNm").val();
	 	custId  	= $("#custId").val();
	}else{
		regNo 		= fnUnSign($("#regNoH").val());
		acntOwnrNo  = regNo.substr(0,6);
		custNm  	= $("#custNm").val();
	 	custId  	= $("#custId").val();

	}
  	cpcmpCd 	= $("#cardComp6").val();
  	cpcmpNm 	= $("#cardCompNm6").val();

	if(payMth == 'ac'){//계좌
		var acntno = $('#acntNoSel option:selected').val();
		bankAcntNo = acntno;

		if(bankAcntNo == '' || bankAcntNo == null || bankAcntNo == undefined){
			bankAcntNo = $('#acntNo').val();
		}
		pymMthdCd = "CM";
		pymMthdNm = "은행자동이체";
		bankCd    = $("#bankComp6H").val();//은행사 코드
		bankNm    = $("#bankCompNm6H").val(); //은행사명
	}else if(payMth == 'ca'){//카드
		pymMthdCd = "CC";
		pymMthdNm = "신용카드자동이체";
		cardNo          = $("#cardNum").val().replace(/-/g,'');
		cardValdEndYymm = $("#cardEffcprd").val().replace('/','');
		cardValdEndYymm = "20"+cardValdEndYymm.substr(2,2)+cardValdEndYymm.substr(0,2);

	}

	if($("#custTp").val() == "II" || $("#custTp").val() == "UNC"){
    	DsPymAcntInVO.pHldrCustrnmNo = regNo;
    	DsPymAcntInVO.custDvCd 	= "I";
        DsPymAcntInVO.custKdCd 	= "II";
        DsBilAcntInVO.custDvCd 	= "I";
        DsBilAcntInVO.custKdCd 	= "II";
        DsBilAcntInVO.bisCompNm = "";
        DsBilAcntInVO.bisReptNm = "";
        DsBilAcntInVO.bizCompNm = "";
        DsBilAcntInVO.bsRegNo 	= "";

	}else if($("#custTp").val() == "MIN"){
		DsPymAcntInVO.custDvCd 	= "I";
        DsPymAcntInVO.custKdCd 	= "II";
        DsBilAcntInVO.custDvCd 	= "I";
        DsBilAcntInVO.custKdCd 	= "II";
        DsBilAcntInVO.bisCompNm = "";
        DsBilAcntInVO.bisReptNm = "";
        DsBilAcntInVO.bizCompNm = "";
        DsBilAcntInVO.bsRegNo 	= "";

	}else if($("#custTp").val() == "IFX"){
		DsPymAcntInVO.pHldrCustrnmNo = regNo;
		DsPymAcntInVO.custDvCd 	= "I";
	    DsPymAcntInVO.custKdCd 	= "IFX";
	    DsBilAcntInVO.custDvCd 	= "I";
	    DsBilAcntInVO.custKdCd 	= "IFX";
	    DsBilAcntInVO.bisCompNm = "";
        DsBilAcntInVO.bisReptNm = "";
        DsBilAcntInVO.bizCompNm = "";
        DsBilAcntInVO.bsRegNo 	= "";

	}else if($("#custTp").val() == "GEF"){
		DsPymAcntInVO.pHldrCustrnmNo = $("#bzno").val();
		DsPymAcntInVO.custDvCd 	= "G";
	    DsPymAcntInVO.custKdCd 	= "GEF";
	    DsBilAcntInVO.custDvCd 	= "G";
	    DsBilAcntInVO.custKdCd 	= "GEF";
	    DsBilAcntInVO.bisCompNm = $("#bznm").val();
        DsBilAcntInVO.bisReptNm = $("#txRprsNm").val();
        DsBilAcntInVO.bizCompNm = $("#bznm").val();
        DsBilAcntInVO.bsRegNo 	= $("#bzno").val();

	}
	else{
    	DsPymAcntInVO.pHldrCustrnmNo = regNo;
    	DsPymAcntInVO.custDvCd 	= "I";
        DsPymAcntInVO.custKdCd 	= "II";
        DsBilAcntInVO.custDvCd 	= "I";
        DsBilAcntInVO.custKdCd 	= "II";
        DsBilAcntInVO.bisCompNm = "";
        DsBilAcntInVO.bisReptNm = "";
        DsBilAcntInVO.bizCompNm = "";
        DsBilAcntInVO.bsRegNo 	= "";
	}

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
  	DsPymAcntInVO.cdcmpCd = cpcmpCd;
  	DsPymAcntInVO.cdcmpNm = cpcmpNm;
  	DsPymAcntInVO.cmsYn = "";
  	DsPymAcntInVO.cprtDvCd = "";
  	DsPymAcntInVO.pHldrCustNo = custId;
  	DsPymAcntInVO.ppayAcntYn = "N";
  	DsPymAcntInVO.prssDlrCd = "";
  	DsPymAcntInVO.pymCustNm = custNm;
  	DsPymAcntInVO.pymManCustNo = "0";
  	DsPymAcntInVO.pymMthdCd = pymMthdCd;
  	DsPymAcntInVO.pymMthdNm = pymMthdNm;
  	DsPymAcntInVO.nextOperatorId = "1100000288"

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
  	DsBilAcntInVO.custNo = custId;
  	DsBilAcntInVO.custVilgAddr = "";
  	DsBilAcntInVO.dabvAddr = "";
  	DsBilAcntInVO.dnblAddr = "";
  	DsBilAcntInVO.emailAuthYn = "Y";
  	DsBilAcntInVO.frstWdrwRgstDd = "1";
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
	UserInfoInVO.nextOperatorId = "1100000288"


 	RequestBody.DsPymAcntInVO = DsPymAcntInVO;
	RequestBody.DsBilAcntInVO = DsBilAcntInVO;
  	RequestBody.UserInfoInVO = UserInfoInVO;

	RequestRecord.RequestBody = RequestBody;

	CheckSmrtBillPymAcnt.RequestRecord = RequestRecord;
	data.CheckSmrtBillPymAcnt = CheckSmrtBillPymAcnt;
	base.data = data;

	//console.log(JSON.stringify(base));

	$.ajax({
		url: '/appIf/v1/uplus/esb/CM808',
		type: 'POST',
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		cache: false,
		dataType: "json",
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.resultCode == 'N0000'){
				// KB본인인증 전자서명
				if(gubun == "cert"){
					var auth = $("input[name=c-certification]:checked").val();
					if(auth == "1"){
						gAuthMthd = "301";
						openKCBCertPopup();
					}else{// ARS
						console.log("ARS인증");
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
				if($("#custTp").val() == "GEF"){
					if(gubun == "cert"){
						rePaymentAuth(gubun);//개인사업자의 납부에러가 난 경우, 개인납부로 한번 더 검증
					}else{
						rePaymentAuth();//개인사업자의 납부에러가 난 경우, 개인납부로 한번 더 검증
					}
				}else{
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
//개인사업자의 납부에러가 난 경우, 개인납부로 한번 더 검증
function rePaymentAuth(gubun){
	var base = new Object();
	var data = new Object();
	var CheckSmrtBillPymAcnt = new Object();
	var RequestRecord = new Object();
	var RequestBody = new Object();
	var DsPymAcntInVO = new Object();
	var DsBilAcntInVO = new Object();
	var UserInfoInVO  = new Object();
	base.serviceId = "CM808";
	var regNo = fnUnSign($("#regNoH").val());
	//console.log('regNo='+regNo + ' regNoH = ' + $('#regNoH').val() );

	var acntOwnrNo      = regNo.substr(0,6);

	var bankAcntNo      = "";
	var bankCd          = "";
	var bankNm          = "";
	var cardNo          = "";
	var cardValdEndYymm = "";

	var custNm  = $("#custNm").val();
  	var cpcmpCd = $("#cardComp6").val();
  	var cpcmpNm = $("#cardCompNm6").val();
 	var custId  = $("#custId").val();

	var payMth  = $('input[name="c-paywray"]:checked').val();//납부
	var pymMthdCd = "";
	var pymMthdNm = "";

	var email     = getEmail();

	var billEmailAddr = (email == '@') ? "1" : email;

  if(payMth == 'ac'){//계좌
  	var acntno = $('#acntNoSel option:selected').val();
  	bankAcntNo = acntno;
	if(bankAcntNo == '' || bankAcntNo == null || bankAcntNo == undefined){
		bankAcntNo = $('#acntNo').val();
	}
	pymMthdCd = "CM";
	pymMthdNm = "은행자동이체";
	bankCd    = $("#bankComp6H").val();//은행사 코드
	bankNm    = $("#bankCompNm6H").val(); //은행사명

  }else if(payMth == 'ca'){//카드
  	pymMthdCd = "CC";
  	pymMthdNm = "신용카드자동이체";
  	cardNo          = $("#cardNum").val().replace(/-/g,'');
  	cardValdEndYymm = $("#cardEffcprd").val().replace('/','');
  	cardValdEndYymm = "20"+cardValdEndYymm.substr(2,2)+cardValdEndYymm.substr(0,2);

  }

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
  	DsPymAcntInVO.cdcmpCd = cpcmpCd;
  	DsPymAcntInVO.cdcmpNm = cpcmpNm;
  	DsPymAcntInVO.cmsYn = "";
  	DsPymAcntInVO.cprtDvCd = "";
  	DsPymAcntInVO.custDvCd = "I";
  	DsPymAcntInVO.custKdCd = "II";
  	DsPymAcntInVO.pCustDvCd = "";
  	DsPymAcntInVO.pCustKdCd = "";
  	DsPymAcntInVO.pHldrCustNo = custId;
  	DsPymAcntInVO.pHldrCustrnmNo = regNo;
  	DsPymAcntInVO.ppayAcntYn = "N";
  	DsPymAcntInVO.prssDlrCd = "";
  	DsPymAcntInVO.pymCustNm = custNm;
  	DsPymAcntInVO.pymManCustNo = "0";
  	DsPymAcntInVO.pymMthdCd = pymMthdCd;
  	DsPymAcntInVO.pymMthdNm = pymMthdNm;
  	DsPymAcntInVO.nextOperatorId = "1100000288"

	DsBilAcntInVO.authMobYn = "N";
  	DsBilAcntInVO.billAcntNo = "";
  	DsBilAcntInVO.billAcntSttsCd = "";
  	DsBilAcntInVO.billAddrSeqno = "0";
  	DsBilAcntInVO.billCurCd = "KRW";
  	DsBilAcntInVO.billEmailAddr = billEmailAddr;
  	DsBilAcntInVO.bisCompNm = "";
  	DsBilAcntInVO.bisReptNm = "";
  	DsBilAcntInVO.bizCompNm = "";
  	DsBilAcntInVO.bltxtKdCd = "N";
  	DsBilAcntInVO.bltxtKdNm = "";
  	DsBilAcntInVO.bltxtRcpProdNo = "";
  	DsBilAcntInVO.bltxtRcptManNm = custNm;
  	DsBilAcntInVO.bsRegNo = "";
  	DsBilAcntInVO.bsstNm = "";
  	DsBilAcntInVO.cntctPntSeqno = "";
  	DsBilAcntInVO.custAddrZip = "";
  	DsBilAcntInVO.custAddrZip1 = "";
  	DsBilAcntInVO.custAddrZip2 = "";
  	DsBilAcntInVO.custDvCd = "I";
  	DsBilAcntInVO.custKdCd = "II";
  	DsBilAcntInVO.custNm = custNm;
  	DsBilAcntInVO.custNo = custId;
  	DsBilAcntInVO.custVilgAddr = "";
  	DsBilAcntInVO.dabvAddr = "";
  	DsBilAcntInVO.dnblAddr = "";
  	DsBilAcntInVO.emailAuthYn = "Y";
  	DsBilAcntInVO.frstWdrwRgstDd = "1";
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
	UserInfoInVO.nextOperatorId = "1100000288"


 	RequestBody.DsPymAcntInVO = DsPymAcntInVO;
	RequestBody.DsBilAcntInVO = DsBilAcntInVO;
  	RequestBody.UserInfoInVO = UserInfoInVO;

	RequestRecord.RequestBody = RequestBody;

	CheckSmrtBillPymAcnt.RequestRecord = RequestRecord;
	data.CheckSmrtBillPymAcnt = CheckSmrtBillPymAcnt;
	base.data = data;

	//console.log(JSON.stringify(base));

	$.ajax({
		url: '/appIf/v1/uplus/esb/CM808',
		type: 'POST',
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		cache: false,
		dataType: "json",
		success: function(data) {
			console.log(JSON.stringify(data));
			if(data.resultCode == 'N0000'){
				// KB본인인증 전자서명
				if(gubun == "cert"){
					var auth = $("input[name=c-certification]:checked").val();
					if(auth == "1"){
						gAuthMthd = "301";
						openKCBCertPopup();
					}else{// ARS
						console.log("ARS인증");
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
//본인확인 :: 고객의 개통 가능 여부 사전 체크 CM804
function checkOpenYn_1(){
	var custTp = $("#custTp").val();
    console.log("1-8 custTp="+$("#custTp").val()+" 고객의 개통 가능 여부 사전 체크 CM804");
	var json_obj = new Object();

	var base = new Object();
	var data = new Object();
	var CheckSmrtCustomerInfo = new Object();
	var RequestRecord = new Object();
	var RequestBody = new Object();
	var ReqDataInVO = new Object();
	var UserInfoInVO = new Object();
	var regNo = "";

	base.serviceId = "CM804";

	if(custTp == "GEF"){
		regNo = fnUnSign($("#regNoH").val());
		ReqDataInVO.custDvCd = "G";
		ReqDataInVO.custKdCd = custTp;
		ReqDataInVO.bsRegNo = $("#bzno").val();
		ReqDataInVO.chkFrgnCustRnm = "N";
		ReqDataInVO.chkCorpClose = "Y";
		ReqDataInVO.custNm = $("#custNm").val();
		ReqDataInVO.preCustRnmFlag = "";//복지할인 체크P;

	}else if(custTp == "IFX"){
		//regNo = $("#fNo").val().replace(/-/g,'');
        regNo = fnUnSign($("#regNoH").val());
		ReqDataInVO.custDvCd = "I";
		ReqDataInVO.custKdCd = custTp;
		ReqDataInVO.bsRegNo = "";
		ReqDataInVO.chkFrgnCustRnm = "Y";
		ReqDataInVO.chkCorpClose = "N";
		ReqDataInVO.custNm = $("#fNm").val();
		ReqDataInVO.preCustRnmFlag = "P";//복지할인 체크P;

	}else{ //개인, 신용카드미소지자, 미성년자
		regNo = fnUnSign($("#regNoH").val());
		ReqDataInVO.custDvCd = "I";
		ReqDataInVO.custKdCd = "II";
		ReqDataInVO.bsRegNo = "";
		ReqDataInVO.chkFrgnCustRnm = "N";
		ReqDataInVO.chkCorpClose = "N";
		ReqDataInVO.custNm = $("#custNm").val();
		ReqDataInVO.preCustRnmFlag = "";//복지할인 체크P;
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
	ReqDataInVO.custrnmNo = regNo;
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
			console.log(response);
			if(response.resultCode == 'N0000'){
				var errCnt = 0;
				var welfStatus = "";//복지할인

				try {
					var DsCustRnmRsltOutVO = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsCustRnmRsltOutVO;
					errCnt += (isEmpty(DsCustRnmRsltOutVO)) ? 0 : Number(DsCustRnmRsltOutVO.errCnt);
					console.log("CM804 고객실명 Error count = "+DsCustRnmRsltOutVO.errCnt);
				} catch(e) {}
				try {
					var DsCBScoreRsltOutVO = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsCBScoreRsltOutVO;
					errCnt += (isEmpty(DsCBScoreRsltOutVO)) ? 0 : Number(DsCBScoreRsltOutVO.errCnt);
					console.log("CM804 신용정보조회 Error count = "+DsCBScoreRsltOutVO.errCnt);
				} catch(e) {}
				try {
					var DsLverifyOutVO     = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsLverifyOutVO;
					errCnt += (isEmpty(DsLverifyOutVO))     ? 0 : Number(DsLverifyOutVO.errCnt);
					console.log("CM804 자사체납 Error count = "+DsLverifyOutVO.errCnt);
				} catch(e) {}
				try {
					var DsSbgnRsltOutVO    = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsSbgnRsltOutVO;
					//errCnt += (isEmpty(DsSbgnRsltOutVO))    ? 0 : Number(DsSbgnRsltOutVO.errCnt);
					console.log("CM804 가입회선 Error count = "+DsSbgnRsltOutVO.errCnt);
				} catch(e) {}
				try {
					var DsBlRsltOutVO      = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsBlRsltOutVO;
					errCnt += (isEmpty(DsBlRsltOutVO))      ? 0 : Number(DsBlRsltOutVO.errCnt);
					console.log("CM804 블랙리스트 Error count = "+DsBlRsltOutVO.errCnt);
				} catch(e) {}
				try {
					var DsCorpCloseRsltOutVO      = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsCorpCloseRsltOutVO;
					errCnt += (isEmpty(DsCorpCloseRsltOutVO))      ? 0 : Number(DsCorpCloseRsltOutVO.errCnt);
					console.log("CM804 휴폐업사업자 Error count = "+DsCorpCloseRsltOutVO.errCnt);
				} catch(e) {}

				try {
					var DsWelfRsltOutVO      = response.data.CheckSmrtCustomerInfoResponse.ResponseRecord.ResponseBody.DsWelfRsltOutVO;
					welfStatus = (isEmpty(DsWelfRsltOutVO)) ? "" : DsWelfRsltOutVO.welfStatus;
				} catch(e) {}

				console.log("CM804 response="+ JSON.stringify(response));
				console.log("CM804 errCnt="+ errCnt);

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
                            msg : "고객님은 나눔할인 대상자입니다",
                            cfrmYn : false,
                            okcallbacl : IdentityAuth//신분증 진위 검증
                        };
                        popalarm(opt);
                        return;
					} else {
						IdentityAuth();//신분증 진위 검증
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
//스마트개통 MNP 운영시간여부체크
function sendSB804() {
	if($("#mcoCd").val() == ""){
        let opt = {
            msg : "사용중인 통신사를 선택해주세요.",
            cfrmYn : false,
			okParam : "page_transfer",
            okCallback : stepActive
        };
        popalarm(opt);
        return;
	}else if($("#mtelNo").val() == ""){
        let opt = {
            msg : "휴대폰 번호를 입력해 주세요.",
            cfrmYn : false,
			okParam : "page_transfer",
            okCallback : stepActive
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
	
	console.log("sendSB804=base="+JSON.stringify(base));

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/SB804', 
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		//async: false,
		cache: false,
		dataType: "json",
		success: function(response) {
			console.log("sendSB804=response="+JSON.stringify(response));

			if(response !== null && response.data !== null){			
				if(response.resultCode !== 'N0000'){
                    let opt = {
                        msg : "일시적으로 오류가 발생하였습니다. 다시 시도해주세요.",
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
				console.log('sendSB804=resultCode=' + resultCode);
				
				if(resultCode == 'YES'){
					if($("#serverTarget").val() == "prod"){
						sendSB808();
					}else{
						saveApplTp();
						applMYn = true; //사전동의 검증여부 (한번 호출)

						$(".select_inline.full.notclose").empty();
						$("#mtelNo").prop("disabled",true);

						goPageForJoin();
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
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
			}
		},
		error: function(request,status,error){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
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
	
	if($("#custTp").val() == "II"){
		DsAutnRqstInVO.mnpCustKdCd  = "01";
		DsAutnRqstInVO.custBsRegNo  = "";
		DsAutnRqstInVO.hldrCustNm   = $("#custNm").val();
	}
	else if($("#custTp").val() == "GEF"){
		DsAutnRqstInVO.mnpCustKdCd  = "02";
		DsAutnRqstInVO.custBsRegNo = $("#bzno").val();
		DsAutnRqstInVO.hldrCustNm   = $("#txRprsNm").val();
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
	
	DsAutnRqstInVO.custPersNo   = fnUnSign($("#regNoH").val());
	DsAutnRqstInVO.frgnrYn      = "";
	DsAutnRqstInVO.autnItemDvCd = ""; //번호이동구분코드  "" 고정
	DsAutnRqstInVO.autnItemNo   = ""; //번호이동인증값 "" 고정
	DsAutnRqstInVO.cashPymAmt   = "";
	DsAutnRqstInVO.mnpKdCd      = "KBM";
	DsAutnRqstInVO.insttEntrYn  = "";
	DsAutnRqstInVO.custCtplc    = "";
	DsAutnRqstInVO.rqmnNm       = "";
	DsAutnRqstInVO.rqmnPersNo   = "";
	DsAutnRqstInVO.hldrDrngRelsCd = "";
	DsAutnRqstInVO.msgChasNo     = "";
	DsAutnRqstInVO.mnpRstnCustYn = "";
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
	DsAutnRqstInVO.applicationId = "";
	DsAutnRqstInVO.nextOperatorId = "1100000288";
	
   	RequestBody.DsAutnRqstInVO = DsAutnRqstInVO;

	RequestRecord.RequestBody = RequestBody;
	
	CreateSmrtMnpPriorConBD.RequestRecord = RequestRecord;
	data.CreateSmrtMnpPriorConBD = CreateSmrtMnpPriorConBD;
	base.data = data;

	console.log("=SB808 base="+JSON.stringify(base));
	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/SB808', 
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		//async: false,
		cache: false,
		dataType: "json",
		success: function(response) {

			console.log("=SB808 response="+response);

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
			
			console.log('SB808 resultCode='+resultCode+' resultCode1='+resultCode1+' resultCode2='+resultCode2 + ' resultDesc=' + resultDesc);

			if(resultCode == 'N0000' && (resultCode2 == 'BS0000' || resultCode2 == 'BF1036' || resultCode2 == 'BF1037' || resultCode2 == 'BF1039') ) {
				saveApplTp();
				applMYn = true; //사전동의 검증여부 (한번 호출)

                $(".select_inline.full.notclose").empty();
                $("#mtelNo").prop("disabled",true);

                goPageForJoin();
					
			} else if(resultCode == '500' ) {
                let opt = {
                    msg : resultMessage,
                    cfrmYn : false
                };
                popalarm(opt);
                return;
			} else if(resultCode2 != '' && resultCode2 != 'BS0000' ) {
                let opt = {
                    msg : resultDesc,
                    cfrmYn : false
                };
                popalarm(opt);
                return;
			} else {
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
			}
		},
		error: function(request,status,error){
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}
	});//end ajax	
}
//5. ESB 인터페이스 연동
function esbJoinIF(joinInfo) {
	var serviceId = "SB045";
	var nextOperatorId = "1100000288";
	var entrRsvProdCd = "LZP0000001";
	var dlrCd = "315397"; 
	
	var base = new Object();
	base.serviceId = serviceId;
	
	var data = new Object();
	var RegistOnSaleEntrRsv = new Object();
	var RequestRecord = new Object();
	var RequestBody = new Object();
	
	var DsRsvInfoInVO = new Object();
	var DsRsvMnpInfoInVO = new Object();
	
	if($("#custTp").val() == "GEF"){//여기서 여기서 여기서 확인필요
		DsRsvInfoInVO.hldrCustNm = joinInfo.repNm;
		DsRsvInfoInVO.rlusrCustNm = joinInfo.repNm;
		DsRsvInfoInVO.pymCustNm = joinInfo.repNm;
		DsRsvInfoInVO.bsRegNo = joinInfo.bizRegNo;
		DsRsvInfoInVO.inkndNm = $("#txBusiTp").val();
		DsRsvInfoInVO.bsstNm = $("#txBusiCndt").val();
		DsRsvInfoInVO.bizCompNm = $("#bznm").val() ;
		DsRsvInfoInVO.bizReptNm = $("#txRprsNm").val() ;
		DsRsvMnpInfoInVO.apcntNm = joinInfo.repNm;
	}
	else if($("#custTp").val() == "IFX"){
		DsRsvInfoInVO.hldrCustNm = joinInfo.custNm;
		DsRsvInfoInVO.rlusrCustNm = joinInfo.custNm;
		DsRsvInfoInVO.pymCustNm = joinInfo.custNm;
		DsRsvInfoInVO.bsRegNo = "";
		DsRsvInfoInVO.inkndNm = "";
		DsRsvInfoInVO.bsstNm = "";
		DsRsvInfoInVO.bizCompNm = "";
		DsRsvInfoInVO.bizReptNm = "";
		var vApcntNm = joinInfo.custNm;
		if (vApcntNm.length > 30) vApcntNm = vApcntNm.substring(0,30);
		DsRsvMnpInfoInVO.apcntNm = vApcntNm;
	}
	else{
		DsRsvInfoInVO.hldrCustNm = joinInfo.custNm;
		DsRsvInfoInVO.rlusrCustNm = joinInfo.custNm;
		DsRsvInfoInVO.pymCustNm = joinInfo.custNm;
		DsRsvInfoInVO.bsRegNo = "";
		DsRsvInfoInVO.inkndNm = "";
		DsRsvInfoInVO.bsstNm = "";
		DsRsvInfoInVO.bizCompNm = "";
		DsRsvInfoInVO.bizReptNm = "";
		DsRsvMnpInfoInVO.apcntNm = joinInfo.custNm;
	}
	
	DsRsvInfoInVO.hldrCustrnmNo = fnUnSign(joinInfo.corpRegNo);
	DsRsvInfoInVO.ipinCi = "";
	DsRsvInfoInVO.custrnmBday = joinInfo.corpRegNo7;
	DsRsvInfoInVO.hldrCustTel = (joinInfo.esbDlvdstRcpntCellPhnNo == '' ? telNoIfFormatter(joinInfo.eaiChgBfrTelNo): joinInfo.esbDlvdstRcpntCellPhnNo);
	
	DsRsvInfoInVO.rlusrCustrnmNo = fnUnSign(joinInfo.corpRegNo);
	
	DsRsvInfoInVO.pymCustrnmNo = fnUnSign(joinInfo.corpRegNo);
	DsRsvInfoInVO.pymMthdCd = joinInfo.pymMthd;
	DsRsvInfoInVO.pymBank = joinInfo.cardCorpCd;
	DsRsvInfoInVO.pymBankAcntNo = joinInfo.cardNo;
	DsRsvInfoInVO.pymcardYymm = getPymcardYymm(joinInfo.cardEffcprd); // 년4자리 월2자리로 변경
	DsRsvInfoInVO.chargeCustNm = joinInfo.custNm;
	DsRsvInfoInVO.chargeType = "H";
	DsRsvInfoInVO.chargeDvCd = getChargeDvCd(joinInfo.billMdmGiroYn, joinInfo.billMdmEmlYn, joinInfo.billMdmSmsYn);
	DsRsvInfoInVO.chargeEmail = getChargeEmail(joinInfo.reqEmail);
	DsRsvInfoInVO.chargePost = joinInfo.dlvrPstNo;
	DsRsvInfoInVO.chargeAddr1 = joinInfo.dlvrBassAddr;
	DsRsvInfoInVO.chargeAddr2 = joinInfo.dlvrDtlAddr;
	DsRsvInfoInVO.entfCustNm = "";
	DsRsvInfoInVO.entfCustrnmNo = "";
	DsRsvInfoInVO.entfPymDvCd = "";
	DsRsvInfoInVO.entfPymMthdCd = "";
	DsRsvInfoInVO.entfBank = "";
	DsRsvInfoInVO.entfCardYymm = "";
	DsRsvInfoInVO.entfBankAcntNo = "";
	DsRsvInfoInVO.entfBankDvCd = "";
	DsRsvInfoInVO.entfExmptYn = "N";
	DsRsvInfoInVO.entfExmptRsnCd = "";
	DsRsvInfoInVO.entfExmptRsnDscr = "";
	DsRsvInfoInVO.entfCardInsttMnthCnt = "";
	DsRsvInfoInVO.prcsSttsCd = "A";
	DsRsvInfoInVO.invNo = joinInfo.invcNo;
	DsRsvInfoInVO.hopeDlvDt = "";
	DsRsvInfoInVO.dlvDvCd = "";
	DsRsvInfoInVO.dlvPost = "";
	DsRsvInfoInVO.dlvAddr1 = "";
	DsRsvInfoInVO.dlvAddr2 = "";
	DsRsvInfoInVO.rcpntNm = "";
	DsRsvInfoInVO.dlvPlcCtplc1 = "";
	DsRsvInfoInVO.dlvPlcCtplc2 = "";
	DsRsvInfoInVO.dlvMemo = "";
	DsRsvInfoInVO.dlvDt = "";
	DsRsvInfoInVO.rdelvYn = "";
	DsRsvInfoInVO.sptrYn = "";
	if(joinInfo.prodCd == "PD00000613"){
		DsRsvInfoInVO.devItemId = joinInfo.modelItemid;
	}
	else{
		DsRsvInfoInVO.devItemId = getDevItemId(joinInfo.prodGrp, joinInfo.modelNo);
	}
	
	DsRsvInfoInVO.devChrgPymMthdCd = joinInfo.pymMthd;
	DsRsvInfoInVO.devManfSerialNo = joinInfo.modelSerialNo;
	DsRsvInfoInVO.devClrCd = "";
	DsRsvInfoInVO.dutyAgmtDscntYn = "";
	DsRsvInfoInVO.dutyAgmtDscntTerm = "";
	DsRsvInfoInVO.dlrAgmtAmt = "";
	DsRsvInfoInVO.lossInsrAgrmtYn = "N";
	DsRsvInfoInVO.sdphnYn = "Y"; //중고폰여부 Y:유심단독, C:신규폰
	DsRsvInfoInVO.sdphnCmpsnYn = "";
	DsRsvInfoInVO.sdphnCmpsnAmt = "";
	DsRsvInfoInVO.sdphnWdrw = "";
	DsRsvInfoInVO.sdphnWdrwMdlCd = "";
	DsRsvInfoInVO.sdphnWdrwMdlSrlno = "";
	DsRsvInfoInVO.sbsdPayYn = "";
	DsRsvInfoInVO.sbsdPayAmt = "";
	DsRsvInfoInVO.sbsdPayValdUseMms = "";
	DsRsvInfoInVO.sbsdRelsSxmnsUseAmt = "";
	DsRsvInfoInVO.sbsdDtlNoBackFvpos = "";
	DsRsvInfoInVO.sbsdDtlPrntDt = "";
	DsRsvInfoInVO.mbspCardRqstYn = "";
	DsRsvInfoInVO.mbspCardRcptPlcDvCd = "";
	DsRsvInfoInVO.mbspSmsRcpYn = "";
	DsRsvInfoInVO.custAgrmtYn = "Y";
	DsRsvInfoInVO.entrAgree1Yn = "Y";
	DsRsvInfoInVO.entrAgree2Yn = "Y";
	DsRsvInfoInVO.entrAgree3Yn = "Y";
	DsRsvInfoInVO.entrAgree4Yn = (isEmpty($("#selTerm1").val()) ? "N" : "Y");
	DsRsvInfoInVO.entrAgree5Yn = "N";
	DsRsvInfoInVO.ozLiteSvcAgreeYn = "N";
	DsRsvInfoInVO.msvcEntrNo = "";
	DsRsvInfoInVO.hpno = joinInfo.esbMtelNo;
	DsRsvInfoInVO.nwdvCd = "";
	DsRsvInfoInVO.intgBizCd = "";
	DsRsvInfoInVO.atrctDvCd = "";
	DsRsvInfoInVO.atrctDt = "";
	DsRsvInfoInVO.indcDvCd = "";
	DsRsvInfoInVO.indcTelno = "";
	DsRsvInfoInVO.indcEmailAddr = "";
	DsRsvInfoInVO.indcId = "";
	DsRsvInfoInVO.zip = "";
	DsRsvInfoInVO.rsdcDvCd = "";
	DsRsvInfoInVO.cdonm = "";
	DsRsvInfoInVO.ccwNm = "";
	DsRsvInfoInVO.townNm = "";
	DsRsvInfoInVO.rinm = "";
	DsRsvInfoInVO.islnNm = "";
	DsRsvInfoInVO.bldnNm = "";
	DsRsvInfoInVO.lcatDvCd = "";
	DsRsvInfoInVO.helpAddr = "";
	DsRsvInfoInVO.hsnmbAddr = "";
	DsRsvInfoInVO.hoaddr = "";
	DsRsvInfoInVO.aptDaddre = "";
	DsRsvInfoInVO.aptHoaddr = "";
	DsRsvInfoInVO.dongNo = "";
	DsRsvInfoInVO.adngNo = "";
	DsRsvInfoInVO.dongYn = "";
	DsRsvInfoInVO.sbgnHopeDt = "";
	DsRsvInfoInVO.entrDttm = "";
	DsRsvInfoInVO.gropNo = "";
	DsRsvInfoInVO.gropNoSnbr = "";
	DsRsvInfoInVO.aptNo = "";
	DsRsvInfoInVO.protectorCustNm = joinInfo.legalRprsnNm;
	DsRsvInfoInVO.protectorCustrnmNo = joinInfo.legalRprsnRegNo;
	DsRsvInfoInVO.ipinCiLaw = joinInfo.legalRprsnIpinNo;
	DsRsvInfoInVO.custrnmBdayLaw = joinInfo.legalRprsnRegNo7;
	DsRsvInfoInVO.protectorPhoneNo = joinInfo.legalRprsnTelNo;
	DsRsvInfoInVO.protectorPost = joinInfo.legalRprsnPstNo;
	DsRsvInfoInVO.protectorAddr1 = joinInfo.legalRprsnBassAddr;
	DsRsvInfoInVO.protectorAddr2 = joinInfo.legalRprsnDtlAddr;
	DsRsvInfoInVO.welfCommDscntRqstYn = "";
	DsRsvInfoInVO.scanAutnDv = "";
	DsRsvInfoInVO.onlnAppfNo = joinInfo.applSeqNo;
	DsRsvInfoInVO.userWorkDlrCd = dlrCd;
	DsRsvInfoInVO.entrRsvProdCd = entrRsvProdCd;
	DsRsvInfoInVO.entrRsvRqstDvCd = "";
	DsRsvInfoInVO.entrRsvProdNo = joinInfo.esbChgBfrTelNo;
	DsRsvInfoInVO.entrRqstChnlKdCd = "32";
	DsRsvInfoInVO.mnpBfrEnpr = joinInfo.befNp;
	DsRsvInfoInVO.autnItemDvCd = getAutnItemDvCd(joinInfo.npAuthMthd);
	DsRsvInfoInVO.autnItemNo = joinInfo.npAuthKey;
	DsRsvInfoInVO.chrgrBuyYn = "";
	DsRsvInfoInVO.rcmdmNo = "";
	DsRsvInfoInVO.rcmdEntrDvCd = "";
	DsRsvInfoInVO.trfcCardUseYn = "";
	DsRsvInfoInVO.spamIsolRqstYn = "";
	DsRsvInfoInVO.dataContsCd = "";
	DsRsvInfoInVO.workErrCd = "";
	DsRsvInfoInVO.dataCalfSmsYn = "";
	DsRsvInfoInVO.entrType = getEntrType(joinInfo.applTp);
	DsRsvInfoInVO.custType = "B";
	DsRsvInfoInVO.ppSvcCd = joinInfo.mnoProdCd;
	DsRsvInfoInVO.spclMttr = "";
	
	
	DsRsvInfoInVO.mbrshEntfUsimMemo = "";
	DsRsvInfoInVO.devcInsttMemo = "";
	DsRsvInfoInVO.elecDocNo = "";
	DsRsvInfoInVO.billAcntNo = joinInfo.mvnoPymAcntId;
	DsRsvInfoInVO.usimMdlCd = "";
	DsRsvInfoInVO.usimSerialNo = joinInfo.usimSerialNo;
	DsRsvInfoInVO.posCd = joinInfo.posCd;
	DsRsvInfoInVO.prmsLineCont = "";
	DsRsvInfoInVO.agntEntrRstnYn = "";
	DsRsvInfoInVO.onlnEntrRstnYn = "";
	DsRsvInfoInVO.smlsStlmUseDenyYn = "";
	DsRsvInfoInVO.phncarDocEntrYn = "";
	DsRsvInfoInVO.addrInqDvCd = joinInfo.dlvrAddrTyp;
	DsRsvInfoInVO.lmtStlmUseDenyYn = "";
	DsRsvInfoInVO.snglSppsRqstYn = "";
	DsRsvInfoInVO.prssRsultCd = "";
	DsRsvInfoInVO.prodRqstNo = "";
	DsRsvInfoInVO.oneidEntrRqstYn = "";
	DsRsvInfoInVO.oneidEmailAddr = "";
	DsRsvInfoInVO.rntlYn = getRntlYn(joinInfo.modelNo);
	DsRsvInfoInVO.rvinsAgrmtYn = "";
	DsRsvInfoInVO.rvinsDocEntrYn = "";
	DsRsvInfoInVO.macAddr = "";
	DsRsvInfoInVO.nmplteDlrCd = "";
	DsRsvInfoInVO.nextOperatorId = nextOperatorId;
	
	var DsRsvSvcInfoInVO = getDsRsvSvcInfoInArray(entrRsvProdCd, joinInfo.prodCd, joinInfo.mnoProdCd, nextOperatorId);
	
	var DsAgsnDcInfoInVO = new Object();
	DsAgsnDcInfoInVO.entrRsvProdCd = entrRsvProdCd;
	DsAgsnDcInfoInVO.entrRsvSvcCd = joinInfo.mnoProdCd;
	DsAgsnDcInfoInVO.asgnDscntSrlno = "";
	DsAgsnDcInfoInVO.asgnDscntTelno = "";
	DsAgsnDcInfoInVO.dscntSvcCd = "";
	DsAgsnDcInfoInVO.nextOperatorId = nextOperatorId;
	
	
	DsRsvMnpInfoInVO.entrRsvProdCd = entrRsvProdCd;
	DsRsvMnpInfoInVO.mnpBfrEnpr = joinInfo.befNp;
	DsRsvMnpInfoInVO.autnItemDvCd = getAutnItemDvCd(joinInfo.npAuthMthd);
	DsRsvMnpInfoInVO.autnItemNo = joinInfo.npAuthKey;
	DsRsvMnpInfoInVO.mnpTelno = joinInfo.esbChgBfrTelNo;
	
	DsRsvMnpInfoInVO.apcntPersNo = fnUnSign(joinInfo.corpRegNo);
	DsRsvMnpInfoInVO.apcntTelno = joinInfo.esbTelNo;
	DsRsvMnpInfoInVO.apcntHpno = (joinInfo.esbDlvdstRcpntCellPhnNo == '' ? telNoIfFormatter(joinInfo.eaiChgBfrTelNo): joinInfo.esbDlvdstRcpntCellPhnNo);
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
	DsRsvMnpInfoInVO.nextOperatorId = nextOperatorId;
	DsRsvMnpInfoInVO.urdmAmtOfstDvCd = "";
	DsRsvMnpInfoInVO.contcPsblTmDvCd = "";
	DsRsvMnpInfoInVO.mnpHldrBsRegNo = "";
	DsRsvMnpInfoInVO.billCntcInfoKdCd = "";
	DsRsvMnpInfoInVO.billCntcInfo1 = "";
	
	var DsKaitAuthPassInVO = new Object();
	DsKaitAuthPassInVO.entrRsvProdCd = entrRsvProdCd;
	DsKaitAuthPassInVO.prodSvcNm = "";
	DsKaitAuthPassInVO.inqDt = "";
	DsKaitAuthPassInVO.entrDlrCd = "";
	DsKaitAuthPassInVO.tadvOrgnzCd = "";
	DsKaitAuthPassInVO.inqDvCd = "";
	DsKaitAuthPassInVO.indvDvCd = "";
	DsKaitAuthPassInVO.prodDvCd = "";
	DsKaitAuthPassInVO.cnctDvCd = "";
	DsKaitAuthPassInVO.entrDvCd = "";
	DsKaitAuthPassInVO.inqWorkCd = "";
	DsKaitAuthPassInVO.agrmtDvCd = "";
	DsKaitAuthPassInVO.lawcAgntAgrmtYn = "";
	DsKaitAuthPassInVO.userIp = "";
	DsKaitAuthPassInVO.workDlrId = dlrCd;
	DsKaitAuthPassInVO.recvId = "";
	DsKaitAuthPassInVO.dlrNm = "KB국민은행지점";
	DsKaitAuthPassInVO.sbrnCd = "";
	DsKaitAuthPassInVO.persFrgnrPsnoEnprNo = "";
	DsKaitAuthPassInVO.custNm = "";
	DsKaitAuthPassInVO.isuDt = "";
	DsKaitAuthPassInVO.drvLcnsNo = "";
	DsKaitAuthPassInVO.ntnltCd = "";
	DsKaitAuthPassInVO.btday = "";
	DsKaitAuthPassInVO.lawcAgntPersNo = "";
	DsKaitAuthPassInVO.lawcAgntNm = "";
	DsKaitAuthPassInVO.coBsRegNo = "";
	DsKaitAuthPassInVO.trdnmNm = "";
	DsKaitAuthPassInVO.natnMomrtStndCd = "";
	DsKaitAuthPassInVO.nextOperatorId = nextOperatorId;
	
	var DsEntrCpnRsvInfoInVO = new Object();
	DsEntrCpnRsvInfoInVO.entrRsvProdCd = entrRsvProdCd;
	DsEntrCpnRsvInfoInVO.plcySnbr = "";
	DsEntrCpnRsvInfoInVO.plcyEvntSnbr = "";
	DsEntrCpnRsvInfoInVO.cpnEvntId = "";
	DsEntrCpnRsvInfoInVO.bnftSnbr = "";
	DsEntrCpnRsvInfoInVO.rsvDt = "";
	DsEntrCpnRsvInfoInVO.nextOperatorId = nextOperatorId;
	
	RequestBody.DsRsvInfoInVO = DsRsvInfoInVO;
	RequestBody.DsRsvSvcInfoInVO = DsRsvSvcInfoInVO;
	RequestBody.DsAgsnDcInfoInVO = DsAgsnDcInfoInVO;
	RequestBody.DsRsvMnpInfoInVO = DsRsvMnpInfoInVO;
	RequestBody.DsKaitAuthPassInVO = DsKaitAuthPassInVO;
	RequestBody.DsEntrCpnRsvInfoInVO = DsEntrCpnRsvInfoInVO;
	RequestRecord.RequestBody = RequestBody;
	RegistOnSaleEntrRsv.RequestRecord = RequestRecord;
	data.RegistOnSaleEntrRsv = RegistOnSaleEntrRsv;
	base.data = data;
	
	if($("#esimYn").val() == "C" || $("#esimYn").val() == "Y"){
		DsRsvInfoInVO.usimMdlCd = "";
		DsRsvInfoInVO.usimSerialNo = "";
		base.appl = "";
	}
	else{
		if(joinInfo.prodCd == "PD00000613"){
			base.appl = "";
		}else{
			base.appl = (isEmpty(joinInfo.usimSerialNo) ? joinInfo.applSeqNo : "");	
		}
	}
	
	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/' + serviceId,
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		cache: false,
		dataType: "json",
		success: function(data) {
			if(data.resultCode == "00000" || data.resultCode == "N0000") {
				//직업군인가족요금제- 최종가입전 문자전송
				if(joinInfo.prodCd == 'PD00000319' || joinInfo.prodCd == 'PD00000941'){
					sendInfoOffer(joinInfo);
				}else{
					lastSaveAppInfo(joinInfo);
				}
			} else {
				applStatRollback(joinInfo.soId, joinInfo.applSeqNo, joinInfo.custId);
                let opt = {
                    msg : "일시적으로 오류가 발생하였습니다. 다시 시도해주세요.",
                    cfrmYn : false
                };
                popalarm(opt);
                return;
			}
		},
		error: function(request,status,error){
			applStatRollback(joinInfo.soId, joinInfo.applSeqNo, joinInfo.custId);
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
		}
	});
}