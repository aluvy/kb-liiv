/* ********************************************************************************************************************
 * 20191111 HANNA
 * callIFCM559SM322SM530('010012341234') 가입정보 조회 후 조회
 * callIFSM322(svcInfo) 가입정보 조회(로밍 기간형)
 * callIFCM559SM483('010012341234') 가입정보 조회 후 일반변경
 * callIFSM483() 일반형 신청/해지
 * getDataCallIFSM483();
 * callIFSM529(svcInfo) 기간형 신청/해지
 * callIFCM559SM529('010012341234') 가입정보 조회 후 기간형 신청해지
 * getDataCallIFSM529();
 * callIFSM530(svcInfo) 무제한데이터로밍기간형정보조회
 * callIFSM530ForUpdate(svcInfo)
 * callIFAPIM0001(svcInfo)국가명 조회 전문
 ******************************************************************************************************************** */


// =====================================================================================================================
// 로밍서비스 가입 상품 조회
// =====================================================================================================================

/** 가입 상품 정보 조회 (음성 로밍 차단) **/
function callIFCM559SM322SM530(prodNo) {
	var serviceId      = "CM559";
	var nextOperatorId = "1100000288";
	var mode           = "P";

	var data                      = new Object();
	var RetrieveCustInfoSvcAddvBD = new Object();
	var RequestRecord             = new Object();
	var RequestBody               = new Object();

	var DsReqInVO = new Object();

	DsReqInVO.prodNo         = prodNo;
	DsReqInVO.mode           = mode;
	DsReqInVO.nextOperatorId = nextOperatorId;

	RequestBody.DsReqInVO                   = DsReqInVO;
	RequestRecord.RequestBody               = RequestBody;
	RetrieveCustInfoSvcAddvBD.RequestRecord = RequestRecord;
	data.RetrieveCustInfoSvcAddvBD          = RetrieveCustInfoSvcAddvBD;

	var base = new Object();

	base.serviceId = serviceId;
	base.data      = data;
	base.cm559     = "Y";

	$.ajax({
            type         : 'POST'
            ,url         : '/appIf/v1/uplus/esb/' + serviceId
            ,data        : fnSign(JSON.stringify(base))
            ,contentType : 'application/json; charset=utf-8'
            ,cache       : false
            ,dataType    : "json"
            ,success     : function(res) {

                data = JSON.parse(fnUnSign(res.enc));

                // 음성 로밍 차단 신청하기 버튼 표시
                $("#div_btn_voiceappl").show();

                // 로밍 서비스 상품 목록 활성화
                $("div.tit_sec_wrap.extra_cost").parent().show();
                $("div.content.extra_detail").find("hr.hr_divide").each(function(index) {
                    if (index > 0 && index < 7) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });

                // 음성로밍 차단 신청하기 버튼 숨김
                $("#div_btn_voicecncl").hide();

                if (data.resultCode == "00000" || data.resultCode == "N0000") {
                    var body = data.data.RetrieveCustInfoSvcAddvBDResponse.ResponseRecord.ResponseBody;

                    // default-nxt-side.jsp 히든 인풋 값
                    $("#CM559Result").val(JSON.stringify(body));
                    $("#CM559CustInfo").val(JSON.stringify(body.DsCustInfoOutVO));

                    var custInfo    = body.DsCustInfoOutVO;
                    var custSvcInfo = body.DsSvcInfoOutVO;
                    var svcInfo     = new Object();

                    svcInfo.prodNo = prodNo;
                    svcInfo.prodCd = custInfo.prodCd;
                    svcInfo.entrNo = custInfo.entrNo;

                    $.each(custSvcInfo, function(index, item) {
                        // 음성 로밍 차단
                        if(item.svcKdCd == "R" && item.svcCd == 'LRZ0000368') {
                            $("#div_btn_voiceappl").hide();
                            $("#div_btn_voicecncl").show();
                        }
                    });

                    // 가입 상품 정보 조회 (일반형, 기간형)
                    callIFSM322(svcInfo);

                } else {
                    roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                }
            }
            ,error : function(xhr) {
                if (xhr.status !== 0) {
                    roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                }
            }
            ,complete : function(xhr, status) {
                if(getOsInfo().indexOf("app") !== -1) {
                    callAppService({
                        action_code : 'A0313'
                    });
                } else {
                    loading('stop');
                }
            }
	});
}

/** 가입 상품 정보 조회 (일반형, 기간형) **/
function callIFSM322(svcInfo) {
	var serviceId      = "SM322";
	var entrNo         = svcInfo.entrNo;
	var prodNo         = svcInfo.prodNo;
	var prodCd         = svcInfo.prodCd;
	var nextOperatorId = "1100000288";

	var data           = new Object();
	var RetrieveSvcEqu = new Object();
	var RequestRecord  = new Object();
	var RequestBody    = new Object();

	var DsSvcChgParamInVO = new Object();

	DsSvcChgParamInVO.entrNo         = entrNo;
	DsSvcChgParamInVO.prodNo         = prodNo;
	DsSvcChgParamInVO.prodCd         = prodCd;
	DsSvcChgParamInVO.nextOperatorId = nextOperatorId;
	DsSvcChgParamInVO.entrRqstNo     = "";
	DsSvcChgParamInVO.mnpKdCd        = "";
	DsSvcChgParamInVO.prcType        = "";
	DsSvcChgParamInVO.aceno          = "";
	DsSvcChgParamInVO.billAcntNo     = "";
	DsSvcChgParamInVO.entrDlrCd      = "";
	DsSvcChgParamInVO.entrSttsCd     = "";
	DsSvcChgParamInVO.hldrCustNo     = "";
	DsSvcChgParamInVO.mrktCd         = "";
	DsSvcChgParamInVO.nwKindKdCd     = "";
	DsSvcChgParamInVO.ppayAcntYn     = "";
	DsSvcChgParamInVO.prodNm         = "";
	DsSvcChgParamInVO.prssCd         = "";
	DsSvcChgParamInVO.rlusrCustNo    = "";
	DsSvcChgParamInVO.salePathDvCd   = "";

	RequestBody.DsSvcChgParamInVO    = DsSvcChgParamInVO;
	RequestRecord.RequestBody        = RequestBody;
	RetrieveSvcEqu.RequestRecord     = RequestRecord;
	data.RetrieveSvcEqu              = RetrieveSvcEqu;

	var base = new Object();

	base.serviceId = serviceId;
	base.data      = data;

	$.ajax({
             type        : 'POST'
            ,url         : '/appIf/v1/uplus/esb/' + serviceId
            ,data        : fnSign(JSON.stringify(base))
            ,cache       : false
            ,dataType    : "json"
            ,contentType : 'application/json; charset=utf-8'
            ,success     : function(data) {

                // 로밍서비스 해제
                $("#roamingServiceOnOffChk").prop("checked", true);
                $("#roamingServiceOnOffChk").parent().find("span").text("해제");
                $("#roamingServiceOnOffChk").parent().find("label > span").text("활성화");

                $('#roamingOffDiv').hide();
                $('#roamingOffHr').hide();

                $("div.content.extra_detail").find("hr.hr_divide").each(function(index) {
                    if (index > 0 && index < 10) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });

                $("div.content.extra_detail").find("div.section").each(function(index) {
                    if (index > 0 && index < 10) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });

                // 일반형, 기간형 로밍 서비스 목록 버튼 영역 활성화/비활성화
                $("div [id$=_appl]").show();
                $("div [id$=_cncl]").hide();

                $("div[id$=_use]").hide();
                $("p[id$=_kor]").hide();
                $("p[id$=_loc]").hide();

                // 한국 시간, 현지수도 시간 초기화
                $("div[id$=_use] > h4.tit_item").text("");
                $("p[id$=_kor] > span").text("");
                $("p[id$=_loc] > span").text("");

                // 기간형 신청 레이어 팝업(데이터사용량)
                $("#LRZ0002091").click();

                // 모든 신청 버튼 활성화
                $("div [id$=_appl] > button.primary").prop("disabled", false);

                if (data.resultCode == "00000" || data.resultCode == "N0000") {
                    var body           = data.data.RetrieveSvcEquResponse.ResponseRecord.ResponseBody;
                    var ppSvcInfoOutVO = body.PpSvcInfoOutVO;

                    var isRoamingOff = false;

                    for(var i = 0; i < ppSvcInfoOutVO.length; i++) {

                        if (ppSvcInfoOutVO[i].svcCd == 'LRZ0002225') {
                            $("#roamingServiceOnOffChk").prop("checked", false);
                            $("#roamingServiceOnOffChk").parent().find("span").text("차단");
                            $("#roamingServiceOnOffChk").parent().find("label > span").text("비활성화");

                            $('#roamingOffDiv').show();
                            $('#roamingOffHr').show();

                            $("div.content.extra_detail").find("hr.hr_divide").each(function(index) {
                                if (index > 0 && index < 7) {
                                    $(this).hide();
                                } else {
                                    $(this).show();
                                }
                            });

                            $("div.content.extra_detail").find("div.section").each(function(index) {
                                if (index > 0 && index < 7) {
                                   $(this).hide();
                                } else {
                                   $(this).show();
                                }
                            });

                            isRoamingOff = true;
                            break;
                        }
                    }

                    if (!isRoamingOff) {

                        for (var i = 0; i < ppSvcInfoOutVO.length; i++) {

                            // 하루데이터로밍 일반형
                            if (ppSvcInfoOutVO[i].svcCd == 'LRZ0001876') {

                                // 버튼 영역 처리 (신청/변경,해지)
                                $("#div_btn_LRZ0001876_appl").hide();
                                $("#div_btn_LRZ0001876_cncl").show();

                                // 모든 신청 버튼 disable
                                $("div [id$=_appl] > button.primary").prop("disabled", true);
                            }

                            // 제로 프리미엄 일반형
                            // 제로 프리미엄 일반형 (20211227상품코드변경 asis LRZ0003848 tobe LRZ0003095)
                            if (ppSvcInfoOutVO[i].svcCd == 'LRZ0003095') {
                                $("#div_btn_LRZ0003095_appl").hide();
                                $("#div_btn_LRZ0003095_cncl").show();
                                $("div [id$=_appl] > button.primary").prop("disabled", true);
                            }

                            // 하루데이터로밍 기간형
                            if (ppSvcInfoOutVO[i].svcCd == 'LRZ0002680') {
                                $("#div_btn_LRZ0002680_appl").hide();
                                $("#div_btn_LRZ0002680_cncl").show();
                                $("div [id$=_appl] > button.primary").prop("disabled", true);

                                $("#div_LRZ0002680_use").attr("data-value", ppSvcInfoOutVO[i].entrSvcSeqno);
                                $("#div_LRZ0002680_use").show();
                                $("#p_LRZ0002680_kor").show();
                                $("#p_LRZ0002680_loc").show();

                                svcInfo.entrSvcSeqno = ppSvcInfoOutVO[i].entrSvcSeqno;

                                callIFSM530(svcInfo);
                            }

                            // 제로 프리미엄 기간형
                            // 제로 프리미엄 기간형 (20211227상품코드변경 asis LRZ0003085 tobe LRZ0003094)
                            if (ppSvcInfoOutVO[i].svcCd == 'LRZ0003094') {
                                $("#div_btn_LRZ0003094_appl").hide();
                                $("#div_btn_LRZ0003094_cncl").show();
                                $("div [id$=_appl] > button.primary").prop("disabled", true);

                                $("#div_LRZ0003094_use").attr("data-value",ppSvcInfoOutVO[i].entrSvcSeqno);
                                $("#div_LRZ0003094_use").show();
                                $("#p_LRZ0003094_kor").show();
                                $("#p_LRZ0003094_loc").show();

                                svcInfo.entrSvcSeqno = ppSvcInfoOutVO[i].entrSvcSeqno;

                                callIFSM530(svcInfo);
                            }

                            // 제로라이트
                            if (ppSvcInfoOutVO[i].svcCd == 'LRZ0002091' ||
                                ppSvcInfoOutVO[i].svcCd == 'LRZ0002092' ||
                                ppSvcInfoOutVO[i].svcCd == 'LRZ0002093' ||
                                ppSvcInfoOutVO[i].svcCd == 'LRZ0002094') {
                                $("#div_btn_zerolite_appl").hide();
                                $("#div_btn_zerolite_cncl").show();
                                $("div [id$=_appl] > button.btn_default").prop("disabled", true);

                                $("#div_zerolite_use").attr("data-value", ppSvcInfoOutVO[i].entrSvcSeqno);
                                $("#div_zerolite_use").attr("data-prod" , ppSvcInfoOutVO[i].svcCd);
                                $("#div_zerolite_use").show();
                                $("#p_zerolite_kor").show();
                                $("#p_zerolite_loc").show();

                                $("#" + ppSvcInfoOutVO[i].svcCd).click(); // 체크처리

                                svcInfo.entrSvcSeqno = ppSvcInfoOutVO[i].entrSvcSeqno;

                                callIFSM530(svcInfo);
                            }
                        }
                    }

                } else {
                    roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                }
            }
            ,error : function(xhr) {
                if (xhr.status !== 0) {
                    roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                }
            }
            ,complete : function(xhr, status) {
                if(getOsInfo().indexOf("app") !== -1) {
                    callAppService({
                        action_code : 'A0313'
                    });
                } else {
                    loading('stop');
                }
            }
	});
}

/** 가입상품정보 조회 (기간형 한국 시간 및 현지수도 시간) **/
function callIFSM530(svcInfo) {
	var serviceId      = "SM530";
	var nextOperatorId = "1100000288";

	var data               = new Object();
	var RetrieveRmngPeriod = new Object();
	var RequestRecord      = new Object();
	var RequestBody        = new Object();

	var DsModeInVO = new Array();
	var obj        = new Object();

	obj.nextOperatorId = nextOperatorId;
	obj.svcMode        = "R";

	DsModeInVO.push(obj);

	var DsPeriodInVO = new Array();
	var obj          = new Object();

	obj.nextOperatorId = nextOperatorId;
	obj.entrSvcSeqno   = svcInfo.entrSvcSeqno;

	DsPeriodInVO.push(obj);

	var DsSavePeriodInVO = new Array();
	var obj              = new Object();

	obj.nextOperatorId        = nextOperatorId;
	obj.entrNo                = "";
	obj.svcCd                 = "";
	obj.svcStrtDttm           = "";
	obj.svcEndDttm            = "";
	obj.aplyNation            = "";
	obj.aplyNationSvcStrtDttm = "";
	obj.aplyNationSvcEndDttm  = "";
	obj.entrSvcSeqno          = "";

	DsSavePeriodInVO.push(obj);

	RequestBody.DsModeInVO           = DsModeInVO;
	RequestBody.DsPeriodInVO         = DsPeriodInVO;
	RequestBody.DsSavePeriodInVO     = DsSavePeriodInVO;
	RequestRecord.RequestBody        = RequestBody;
	RetrieveRmngPeriod.RequestRecord = RequestRecord;
	data.RetrieveRmngPeriod          = RetrieveRmngPeriod;

	var base = new Object();

	base.serviceId = serviceId;
	base.data      = data;

	$.ajax({
             type        : 'POST'
            ,url         : '/appIf/v1/uplus/esb/' + serviceId
            ,data        : fnSign(JSON.stringify(base))
            ,contentType : 'application/json; charset=utf-8'
            ,cache       : false
            ,dataType    : "json"
            ,success     : function(data) {

                if (data.resultCode == "00000" || data.resultCode == "N0000") {
                    var body              = data.data.RetrieveRmngPeriodResponse.ResponseRecord.ResponseBody;
                    var DsPeriodInfoOutVO = body.DsPeriodInfoOutVO;
                    var korStrtdttm       = stringDateFormatter(body.DsPeriodInfoOutVO.aplyNationSvcStrtDttm); // 한국시간
                    var korEnddttm        = stringDateFormatter(body.DsPeriodInfoOutVO.aplyNationSvcEndDttm);
                    var strtdttm          = stringDateFormatter(body.DsPeriodInfoOutVO.svcStrtDttm);           // 현지시간
                    var enddttm           = stringDateFormatter(body.DsPeriodInfoOutVO.svcEndDttm);

                    if (DsPeriodInfoOutVO.svcCd == 'LRZ0002091' ||
                        DsPeriodInfoOutVO.svcCd == 'LRZ0002092' ||
                        DsPeriodInfoOutVO.svcCd == 'LRZ0002093' ||
                        DsPeriodInfoOutVO.svcCd == 'LRZ0002094') {
                        $("#div_zerolite_use > h4.tit_item").text(body.DsPeriodInfoOutVO.aplyNation);
                        $("#p_zerolite_kor > span").text(korStrtdttm + " ~ " + korEnddttm);
                        $("#p_zerolite_loc > span").text(strtdttm + " ~ " + enddttm);

                    } else {
                        $("#div_" + DsPeriodInfoOutVO.svcCd + "_use > h4.tit_item").text(body.DsPeriodInfoOutVO.aplyNation);
                        $("#p_" + DsPeriodInfoOutVO.svcCd + "_kor > span").text(korStrtdttm + " ~ " + korEnddttm);
                        $("#p_" + DsPeriodInfoOutVO.svcCd + "_loc > span").text(strtdttm + " ~ " + enddttm);
                    }

                } else {
                    roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                }
            }
            ,error : function(xhr) {
                if (xhr.status !== 0) {
                    roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                }
            }
            ,complete : function(xhr, status) {
                if(getOsInfo().indexOf("app") !== -1) {
                    callAppService({
                        action_code : 'A0313'
                    });
                } else {
                    loading('stop');
                }
            }
	});
}

// =====================================================================================================================
// '하루 데이터 로밍 (일반형)', '제로 프리미엄 (일반형)', '음성 로밍 차단'
// =====================================================================================================================

/** 가입 상품 조회 후 신청/해지 함수 호출 **/
function callIFCM559SM483(svcInfo) {
	var serviceId      = "CM559";
	var nextOperatorId = "1100000288";
	var mode           = "P";
	var prodNo         = svcInfo.prodNo;

	var data                      = new Object();
	var RetrieveCustInfoSvcAddvBD = new Object();
	var RequestRecord             = new Object();
	var RequestBody               = new Object();
	``
	var DsReqInVO = new Object();

	DsReqInVO.prodNo         = prodNo;
	DsReqInVO.mode           = mode;
	DsReqInVO.nextOperatorId = nextOperatorId;

	RequestBody.DsReqInVO                   = DsReqInVO;
	RequestRecord.RequestBody               = RequestBody;
	RetrieveCustInfoSvcAddvBD.RequestRecord = RequestRecord;
	data.RetrieveCustInfoSvcAddvBD          = RetrieveCustInfoSvcAddvBD;

	var base = new Object();

	base.serviceId = serviceId;
	base.data      = data;
	base.cm559     = "Y";

	paramSvcInfo = svcInfo;

	$.ajax({
             type        : 'POST'
            ,url         : '/appIf/v1/uplus/esb/' + serviceId
            ,data        : fnSign(JSON.stringify(base))
            ,contentType : 'application/json; charset=utf-8'
            ,cache       : false
            ,dataType    : "json"
            ,success     : function(res) {
                data = JSON.parse(fnUnSign(res.enc));

                if (data.resultCode == "00000" || data.resultCode == "N0000") {
                    var body        = data.data.RetrieveCustInfoSvcAddvBDResponse.ResponseRecord.ResponseBody;
                    var custSvcInfo = body.DsSvcInfoOutVO;

                    $("#CM559Result").val(JSON.stringify(body));
                    $("#CM559CustInfo").val(JSON.stringify(body.DsCustInfoOutVO));

                    $.each(custSvcInfo, function(index, item) {
                        if (item.svcKdCd == "R" && svcInfo.svcCd == item.svcCd) {
                            svcInfo.svcStrtDttm  = item.svcStrtDttm;
                            svcInfo.entrSvcSeqno = item.entrSvcSeqno;
                            svcInfo.prodCd       = item.prodCd;
                            svcInfo.entrNo       = item.entrNo;
                        }
                    });

                    callIFSM483(svcInfo);

                } else {
                    hideOpenBar();
                    roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                }
            }
            ,error : function(xhr) {
                if (xhr.status !== 0) {
                    hideOpenBar();
                    roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                }
            }
            ,complete: function(xhr, status) {
                /*
                if (getOsInfo().indexOf("app") !== -1) {
                    callAppService({
                        action_code : 'A0313'
                    });
                } else {
                    loading('stop');
                }
                */
            }
	});
}

/** SM483 데이터 세팅 **/
function getDataCallIFSM483(svcInfo) {
	var actionType     = svcInfo.actionType;
	var dlrCd          = "315397";
	var svcCd          = svcInfo.svcCd;
	var entrSvcSeqno   = svcInfo.entrSvcSeqno;
	var nextOperatorId = "1100000288";
	var CM559Result    = JSON.parse($("#CM559Result").val());
	var dsConflds      = CM559Result.DsConfldsOutVO;
	var dsCustInfo     = CM559Result.DsCustInfoOutVO;
	var dsDevInfo      = CM559Result.DsDevInfoOutVO;
	var svcEndDttm     = "";
	var svcStrtDttm    = "";
	var date           = new Date();

	if (actionType == "I") {
		svcEndDttm  = "99991231235959";
		svcStrtDttm = date.format('yyyyMMddhhmmss');
	}

	if (actionType == "U") {
		svcEndDttm = date.format('yyyyMMddhhmmss');
	}

	var data              = new Object();
	var SaveSvcMdlForMvno = new Object();
	var RequestRecord     = new Object();
	var RequestBody       = new Object();

	var DsConfldsInVO = new Array();
	var obj           = new Object();

	obj.directive          = dsConflds.directive;
	obj.runDate            = dsConflds.runDate;
	obj.runDateDtm         = dsConflds.runDateDtm;
	obj.transactionMode    = dsConflds.transactionMode;
	obj.entrNo             = dsConflds.entrNo;
	obj.entrDlUpdateStamp  = dsConflds.entrDlUpdateStamp;
	obj.entrSysUpdateDate  = dsConflds.entrSysUpdateDate;
	obj.aceno              = dsConflds.aceno;
	obj.cntcDlUpdateStamp  = dsConflds.cntcDlUpdateStamp;
	obj.cntcSysUpdateStamp = "";
	obj.ctnDlUpdateStamp   = "";
	obj.ctnSysUpdateDate   = "";
	obj.prodNo             = dsCustInfo.prodNo;
	obj.billAcntNo         = dsConflds.billAcntNo;
	obj.billDlUpdateStamp  = dsConflds.billDlUpdateStamp;
	obj.billSysUpdateDate  = dsConflds.billSysUpdateDate;
	obj.cnId               = dsConflds.cnId;
	obj.lockMode           = dsConflds.lockMode;
	obj.userWorkDlrCd      = dlrCd;
	obj.userWorkDlrNm      = "";
	obj.mrktCd             = "KBM";
	obj.nextOperatorId     = nextOperatorId;

	DsConfldsInVO.push(obj);

	var DsUsimInfoInVO = new Array();
	obj = new Object();

	obj.nextOperatorId  = nextOperatorId;
	obj.entrNo          = dsConflds.entrNo;
	obj.usimMode        = "";
	obj.iccid           = "";
	obj.usimRuseYn      = "";
	obj.usimMdlCd       = "";
	obj.usimSerialNo    = "";
	obj.usimMdlDvCd     = "";
	obj.usimSttsCd      = "";
	obj.usimSttsRsnCd   = "";
	obj.saleAmt         = "";
	obj.usimInitYn      = "";
	obj.usimByEntrSeqno = "";
	obj.lteRoamImsi     = "";
	obj.usimValdEndDt   = "";
	obj.lteActType      = "";
	obj.itemOwnership   = "";
	obj.prssDlrCd       = "";

	DsUsimInfoInVO.push(obj);

	var DsChkSvcInVO = new Array();
	obj = new Object();

	obj.nextOperatorId    = nextOperatorId;
	obj.svcCd             = svcCd;
	obj.hposSvcCd         = svcCd;
	obj.prodCd            = dsCustInfo.prodCd;
	obj.svcAplyLvlCd      = "C";
	obj.svcKdCd           = "R";
	obj.svcMode           = actionType;
	obj.svcSubMode        = actionType;
	obj.svcRelsDvCd       = "BUN";
	obj.entrSvcSeqno      = entrSvcSeqno;
	obj.hposEntrSvcSeqno  = entrSvcSeqno;
	obj.svcEndDttm        = svcEndDttm;
	obj.svcStrtDttm       = svcStrtDttm;
	obj.organizationId    = "";
	obj.revisionId        = "";
	obj.svcNm             = "";
	obj.inventoryItemId   = "";
	obj.ndblCvrtSvcCd     = "";
	obj.pVirtualNo        = "";
	obj.virtualNo         = "";
	obj.svcProdMode       = "";
	obj.entrRqstProdSeqno = "";
	obj.entrProdSeqno     = "";
	obj.entrMeta          = "";
	obj.entrRqstNo        = "";
	obj.entrSvcRqstSeqno  = "";

	DsChkSvcInVO.push(obj);

	var DsChkFtrInVO = new Array();
	obj = new Object();

	obj.prodCd         = dsCustInfo.prodCd;
	obj.svcCd          = svcCd;
	obj.ftrMode        = actionType;
	obj.ftrSubMode     = actionType;
	obj.nextOperatorId = nextOperatorId;
	obj.ftrValdStrtDt  = date.format("yyyyMMdd");
	obj.ftrCd          = "";
	obj.ftrNm          = "";
	obj.ftrValdEndDt   = "";
	obj.varParam       = "";
	obj.ftrVarDtlSeqno = "";
	obj.entrSvcSeqno   = "";

	DsChkFtrInVO.push(obj);

	var DsLzoneInVO = new Array();
	obj = new Object();

	obj.nextOperatorId = nextOperatorId;
	obj.lzoneInd       = "";
	obj.lzoneId        = "";
	obj.lzoneActYn     = "";
	obj.lzoneDmBuyYn   = "";
	obj.posCd          = "";
	obj.pmntMthd       = "";
	obj.saleAmt        = "";
	obj.entrNo         = "";
	obj.dlrCd          = "";
	obj.rmks           = "";

	DsLzoneInVO.push(obj);

	var DsChkItemInVO = new Array();
	obj = new Object();

	obj.nextOperatorId = nextOperatorId;
	obj.itemId         = dsDevInfo.itemId;
	obj.manfSerialNo   = dsDevInfo.manfSerialNo;
	obj.devChngRsnCd   = dsDevInfo.devChngRsnCd;
	obj.itemStatus     = dsDevInfo.itemStatus;
	obj.eventCode      = "";
	obj.casNo          = "";
	obj.newTrxCd       = "";
	obj.chipUseYn      = "";
	obj.devMode        = "";

	DsChkItemInVO.push(obj);

	var DsSaveSvcInVO = new Array();
	obj = new Object();

	obj.nextOperatorId       = nextOperatorId;
	obj.prodCd               = dsCustInfo.prodCd;
	obj.billAcntNo           = dsConflds.billAcntNo;
	obj.entrNo               = dsConflds.entrNo;
	obj.prodNo               = dsCustInfo.prodNo;
	obj.rgstDlrCd            = dlrCd;
	obj.rjnDt                = date.format("yyyyMMdd");
	obj.runDttm              = date.format("yyyyMMddhhmmss");
	obj.prcType              = "SVC";
	obj.prcSubType           = "AC";
	obj.prcMode              = "SVC";
	obj.prcSubMode           = "ACH";
	obj.noGuidPrcType        = "";
	obj.saleEmpno            = "";
	obj.svcDutyUseMnthCnt    = "";
	obj.svcDutyUseDvCd       = "";
	obj.svcDutyUseStrtDt     = "";
	obj.svcDutyUseEndDt      = "";
	obj.posCd                = "";
	obj.rsalePosCd           = "";
	obj.devUpYn              = "";
	obj.itemTrx              = "";
	obj.sid                  = "";
	obj.rlusrPersNo          = "";
	obj.kongUppChrgAmt       = "";
	obj.urlType              = "";
	obj.siteUrl              = "";
	obj.cmpnyId              = "";
	obj.rqstDvCd             = "";
	obj.entrRqstNo           = "";
	obj.lastIndcId           = "";
	obj.lastIndcChnlCd       = "";
	obj.entrSttsChngRsnCd    = "";
	obj.entrSttsChngRsnDtlCd = "";

	DsSaveSvcInVO.push(obj);

	var DsAsgnNoListInVO = new Array();
	obj = new Object();

	obj.nextOperatorId = nextOperatorId;
	obj.entrNo         = "";
	obj.dscntStrtDttm  = "";
	obj.asgnNoSeqno    = "";
	obj.asgnDscntTelno = "";
	obj.dscntEndDttm   = "";
	obj.dscntKdDtlCd   = "";
	obj.dscntSvcCd     = "";
	obj.hposSvcCd      = "";
	obj.ctn            = "";
	obj.svcGrpSeqno    = "";
	obj.svcRsvSttsCd   = "";
	obj.hposSvcNm      = "";
	obj.rowStatus      = "";

	DsAsgnNoListInVO.push(obj);

	var DsUserMemoInVO = new Array();
	obj = new Object();

	obj.nextOperatorId = nextOperatorId;
	obj.memoType       = "SVC";
	obj.userMemo       = "";

	DsUserMemoInVO.push(obj);

	RequestBody.DsConfldsInVO       = DsConfldsInVO;
	RequestBody.DsUsimInfoInVO      = DsUsimInfoInVO;
	RequestBody.DsChkSvcInVO        = DsChkSvcInVO;
	RequestBody.DsChkFtrInVO        = DsChkFtrInVO;
	RequestBody.DsLzoneInVO         = DsLzoneInVO;
	RequestBody.DsChkItemInVO       = DsChkItemInVO;
	RequestBody.DsSaveSvcInVO       = DsSaveSvcInVO;
	RequestBody.DsAsgnNoListInVO    = DsAsgnNoListInVO;
	RequestBody.DsUserMemoInVO      = DsUserMemoInVO;
	RequestRecord.RequestBody       = RequestBody;
	SaveSvcMdlForMvno.RequestRecord = RequestRecord;

	data.SaveSvcMdlForMvno = SaveSvcMdlForMvno;

	return data;
}

/** '하루 데이터 로밍 (일반형)', '제로 프리미엄 (일반형)', '음성 로밍 차단' 신청/해지 **/
function callIFSM483(svcInfo) {
	var serviceId = "SM483";
	var data      = getDataCallIFSM483(svcInfo);
	var base      = new Object();

	base.serviceId = serviceId;
	base.data      = data;

	$.ajax({
             type        : 'POST'
            ,url         : '/appIf/v1/uplus/esb/' + serviceId
            ,data        : fnSign(JSON.stringify(base))
            ,cache       : false
            ,dataType    : "json"
            ,contentType : 'application/json; charset=utf-8'
            ,success     : function(data) {

                if (data.resultCode == "00000" || data.resultCode == "N0000") {
                    hideOpenBar();

                    var body = data.data.SaveSvcMdlForMvnoResponse.ResponseRecord.ResponseBody;

                    if ('1' == body.DsResultOutVO[0].rslt) {

                        if (svcInfo.actionType =='I') {

                            if (svcInfo.svcCd == 'LRZ0002225') {
                                roamingPopalarm("데이터로밍이 차단되었습니다."
                                               ,false
                                               ,""
                                               ,""
                                               ,"확인"
                                               ,""
                                               ,initRoamingPage);
                            } else {
                                var title   = "로밍서비스 신청이 완료되었습니다.";
                                var message = "KB국민카드 이용고객님께 안내드립니다.<br>" +
                                              "신용/체크카드 사용범위(해외 오프라인 가맹점 사용기간/국가설정)를 직접 선택하여 부정사용(위변조 및 도난분실 등)을 예방할 수 있는 「카드사용 안심서비스」가 있으니 필요 시 신청하시기 바랍니다.";

                                roamingPopalarm(message
                                               ,true
                                               ,title
                                               ,"카드사용안심서비스"
                                               ,"확인"
                                               ,fn_openCardUsageSafeService
                                               ,initRoamingPage);
                            }
                        }

                        if (svcInfo.actionType =='U') {

                            if (svcInfo.svcCd =='LRZ0002225') {
                                roamingPopalarm("로밍서비스 차단해제 되었습니다. 원하는 로밍 서비스를 신청해주세요."
                                               ,false
                                               ,""
                                               ,""
                                               ,"확인"
                                               ,""
                                               ,initRoamingPage);

                            } else {
                                roamingPopalarm("로밍 서비스 해지가 완료되었습니다."
                                               ,false
                                               ,""
                                               ,""
                                               ,"확인"
                                               ,""
                                               ,initRoamingPage);
                            }
                        }
                    }

                } else {
                    hideOpenBar();

                    if (svcInfo.svcCd == 'LRZ0002225') {
                        roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                    } else {
                        roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                    }
                }
            }
            ,error : function(xhr) {
                if (xhr.status !== 0) {
                    hideOpenBar();
                    roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                }
            }
            ,complete : function(xhr, status) {
                if (getOsInfo().indexOf("app") !== -1) {
                    callAppService({
                        action_code : 'A0313'
                    });
                } else {
                    loading('stop');
                }
            }
	});
}

// =====================================================================================================================
// '하루 데이터 로밍 (기간형)', '제로 프리미엄 (기간형)', '제로 라이트' 신청/변경/해지
// =====================================================================================================================

/** 신청/해지 **/
function callIFCM559SM529(svcInfo) {
	var serviceId      = "CM559";
	var nextOperatorId = "1100000288";
	var mode           = "P";
	var prodNo         = svcInfo.prodNo;

	var data                      = new Object();
	var RetrieveCustInfoSvcAddvBD = new Object();
	var RequestRecord             = new Object();
	var RequestBody               = new Object();

	var DsReqInVO = new Object();
	DsReqInVO.prodNo         = prodNo;
	DsReqInVO.mode           = mode;
	DsReqInVO.nextOperatorId = nextOperatorId;

	RequestBody.DsReqInVO                   = DsReqInVO;
	RequestRecord.RequestBody               = RequestBody;
	RetrieveCustInfoSvcAddvBD.RequestRecord = RequestRecord;
	data.RetrieveCustInfoSvcAddvBD          = RetrieveCustInfoSvcAddvBD;

	var base = new Object();
	base.serviceId = serviceId;
	base.data      = data;
	base.cm559     = "Y";

	$.ajax({
            type         : 'POST'
            ,url         : '/appIf/v1/uplus/esb/' + serviceId
            ,data        : fnSign(JSON.stringify(base))
            ,contentType : 'application/json; charset=utf-8'
            ,cache       : false
            ,dataType    : "json"
            ,success     : function(res) {
                data = JSON.parse(fnUnSign(res.enc));

                if (data.resultCode == "00000" || data.resultCode == "N0000") {
                    var body = data.data.RetrieveCustInfoSvcAddvBDResponse.ResponseRecord.ResponseBody;

                    $("#CM559Result").val(JSON.stringify(body));
                    $("#CM559CustInfo").val(JSON.stringify(body.DsCustInfoOutVO));

                    var custInfo    = body.DsCustInfoOutVO;
                    var custSvcInfo = body.DsSvcInfoOutVO;

                    svcInfo.prodNo = prodNo;
                    svcInfo.prodCd = custInfo.prodCd;
                    svcInfo.entrNo = custInfo.entrNo;

                    $.each(custSvcInfo, function(index, item) {
                        if (item.svcKdCd == "R" && svcInfo.svcCd == item.svcCd) {
                            svcInfo.svcStrtDttm  = item.svcStrtDttm;
                            svcInfo.prodCd       = item.prodCd;
                            svcInfo.entrNo       = item.entrNo;
                        }
                    });

                    sendSM005(body, svcInfo);

                } else {
                     hideOpenBar();
                     roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                }
            }
            ,error : function(xhr) {
                if (xhr.status !== 0) {
                    hideOpenBar();
                    roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                }
            }
            ,complete : function(xhr, status) {
                /*
                if(getOsInfo().indexOf("app") !== -1) {
                    callAppService({
                        action_code : 'A0313'
                    });
                } else {
                    loading('stop');
                }
                */
            }
	});
}

function getYYYYMMDDHHMMSS() {
	var date = new Date();

    var year  = date.getFullYear();
    var month = date.getMonth() + 1 ; // 0부터 시작하므로 1더함 더함
    var day   = date.getDate();
    var hh    = date.getHours();
    var mm    = date.getMinutes();
    var ss    = date.getSeconds();

    if (("" + month).length == 1) { month = "0" + month; }
    if (("" + day).length   == 1) { day   = "0" + day;   }

    if( hh < 10 ) {
		hh = "0" + hh;
	}

	if( mm < 10 ) {
		mm = "0" + mm;
	}

	if( ss < 10 ) {
		ss = "0" + ss;
	}

	return (year + "" + month + "" + day + "" + hh + "" + mm + "" + ss);
}

/** 부가서비스 변경 check **/
function sendSM005(cm559Data, svcInfo) {

	var custInfo	= cm559Data.DsCustInfoOutVO; //CM559 DsSvcInfoOutVO 데이터
	var devInfo		= cm559Data.DsDevInfoOutVO[0];
	var conFlds		= cm559Data.DsConfldsOutVO;
	var custSvcInfo = cm559Data.DsSvcInfoOutVO;
	var actionType	= svcInfo.actionType;
	var ymdhms		= getYYYYMMDDHHMMSS();

	var base              = new Object();
	var data              = new Object();
	var CheckSvcChg       = new Object();
	var RequestRecord     = new Object();
	var RequestBody       = new Object();
	var DsChkSvcInVO      = new Object();
	var DsChkFtrInVO      = new Object();
	var DsChkSvcChgInVO   = new Object();
	var DsChkSvcInVOArray = new Array();
	var DsChkFtrInVOArray = new Array();

	base.serviceId = "SM005";

    DsChkSvcInVO.prodCd	= "LZP0000001";   //필수값:  무조건 'LZP0000001' 로 세팅 (모바일의 의미)
    DsChkSvcInVO.svcCd	=  svcInfo.svcCd; //mvno 상품코드 '신청/해지할 부가서비스코드 세팅 ('LRZ' 로 시작하는 부가서비스 코드)
    DsChkSvcInVO.svcNm	=  "";

    if (actionType == 'I') {
    	DsChkSvcInVO.entrSvcSeqno	= ""; //신청시에는 빈값 입력, 해지시에는 기 가입된 일련번호 세팅필수 (CM559 리턴값 활용)
    	DsChkSvcInVO.svcStrtDttm	= ymdhms;
    	DsChkSvcInVO.svcEndDttm		= "99991231235959";
    	DsChkSvcInVO.svcMode		= "I";
    	DsChkSvcInVO.svcSubMode		= "I";
    } else {
    	DsChkSvcInVO.entrSvcSeqno	= svcInfo.entrSvcSeqno; //신청시에는 빈값 입력, 해지시에는 기 가입된 일련번호 세팅필수 (CM559 리턴값 활용)
    	DsChkSvcInVO.svcStrtDttm	= ymdhms;
    	DsChkSvcInVO.svcEndDttm		= ymdhms;
    	DsChkSvcInVO.svcMode		= "U";
    	DsChkSvcInVO.svcSubMode		= "U";
    }

    DsChkSvcInVO.hposSvcCd			= "";
    DsChkSvcInVO.hposEntrSvcSeqno	= "";
    DsChkSvcInVO.svcAplyLvlCd		= "C";
    DsChkSvcInVO.svcKdCd			= "";
    DsChkSvcInVO.svcRelsDvCd		= "";
    DsChkSvcInVO.ndblCvrtSvcCd		= "";
    DsChkSvcInVO.nextOperatorId		= "1100000288";

    DsChkSvcInVOArray.push(DsChkSvcInVO);

	$.each(custSvcInfo, function(index, item) {
		DsChkSvcInVO                    = new Object();
	    DsChkSvcInVO.prodCd				= "LZP0000001";
	    DsChkSvcInVO.svcCd				= item.svcCd;//대상서비스 종속코드
	    DsChkSvcInVO.svcStrtDttm		= ymdhms;
	    DsChkSvcInVO.entrSvcSeqno		= item.entrSvcSeqno;
	    DsChkSvcInVO.hposEntrSvcSeqno	= "";
	    DsChkSvcInVO.hposSvcCd			= "";
	    DsChkSvcInVO.svcNm				= item.svcNm;
	    DsChkSvcInVO.svcAplyLvlCd		= "C";
	    DsChkSvcInVO.svcEndDttm			= item.svcEndDttm;
	    DsChkSvcInVO.svcKdCd			= "";
	    DsChkSvcInVO.svcRelsDvCd		= "";
	    DsChkSvcInVO.ndblCvrtSvcCd		= "";
	    DsChkSvcInVO.nextOperatorId		= "1100000288";

	    DsChkSvcInVOArray.push(DsChkSvcInVO);
	});

    DsChkFtrInVO.prodCd			=  "LZP0000001";
    DsChkFtrInVO.svcCd			=  "";//mvno 상품코드
    DsChkFtrInVO.ftrCd			=  "";
    DsChkFtrInVO.ftrNm			=  "";
    DsChkFtrInVO.ftrValdStrtDt	=  "";
    DsChkFtrInVO.ftrValdEndDt	=  "";
    DsChkFtrInVO.varParam		=  "";
    DsChkFtrInVO.ftrVarDtlSeqno =  "";
    DsChkFtrInVO.entrSvcSeqno	=  "";
    DsChkFtrInVO.ftrMode		=  "";
    DsChkFtrInVO.ftrSubMode		=  "";
    DsChkFtrInVO.nextOperatorId =  "1100000288";

    DsChkFtrInVOArray.push(DsChkFtrInVO);

    DsChkSvcChgInVO.entrNo			= custInfo.entrNo;  //가입번호
    DsChkSvcChgInVO.mrktCd			= "KBM"             //"KBM";마켓코드
    DsChkSvcChgInVO.prodNo			= custInfo.prodNo;  //상품번호
    DsChkSvcChgInVO.prodCd			= "LZP0000001";     //LZP0000001서비스코드
    DsChkSvcChgInVO.entrSttsCd		= "";               //가입상태코드
    DsChkSvcChgInVO.itemId			= devInfo.itemId;   //단말기모델코드
    DsChkSvcChgInVO.manfSerialNo	= "";               //단말기일련번호
    DsChkSvcChgInVO.prevSvcCd		= svcInfo.svcCd;
    DsChkSvcChgInVO.svcCd			= svcInfo.svcCd;    //mvno 상품코드
    DsChkSvcChgInVO.svcDutyUseEndDt	= "";
    DsChkSvcChgInVO.opDlrCd			= "315397";
    DsChkSvcChgInVO.entrDlrCd		= "";
    DsChkSvcChgInVO.svcAplyLvlCd	= "C";             //"C" 고정값 세팅
    DsChkSvcChgInVO.hldrCustNo		= "";              //uplus 고객번호 -
    DsChkSvcChgInVO.rlusrCustNo		= "";
    DsChkSvcChgInVO.billAcntNo		= "";
    DsChkSvcChgInVO.ppayAcntYn		= "";
    DsChkSvcChgInVO.mnpKdCd			= "";
    DsChkSvcChgInVO.ltpymSttsCd		= "";
    DsChkSvcChgInVO.custrnmNo		= "";
    DsChkSvcChgInVO.runDttm			= ymdhms;
    DsChkSvcChgInVO.rsvDate			= "";
    DsChkSvcChgInVO.prcType			= "CYB";           //작업구분 - "CYB" 세팅 (고정값)
    DsChkSvcChgInVO.prcSubType		= "AC";            //"AC" 세팅 (요금제,부가서비스 변경 시 코드값)
    DsChkSvcChgInVO.prcMode			= "SVC";           //"SVC" 세팅 (요금제, 부가서비스 변경시 코드값)
    DsChkSvcChgInVO.prcSubMode		= "SCH";           //"SCH" 세팅  (요금제변경시 PCH, 부가서비스 신청/해지 시 SCH)
    DsChkSvcChgInVO.nextOperatorId	= "1100000288";

 	RequestBody.DsChkSvcInVO		= DsChkSvcInVOArray;
 	RequestBody.DsChkFtrInVO		= DsChkFtrInVOArray;
 	RequestBody.DsChkSvcChgInVO		= DsChkSvcChgInVO;

	RequestRecord.RequestBody = RequestBody;
	CheckSvcChg.RequestRecord = RequestRecord;
	data.CheckSvcChg          = CheckSvcChg;
	base.data                 = data;

	$.ajax({
             type        : 'POST'
            ,url         : '/appIf/v1/uplus/esb/SM005'
            ,data        : fnSign(JSON.stringify(base))
            ,contentType : 'application/json; charset=utf-8'
            ,cache       : false
            ,dataType    : "json"
            ,success     : function(response) {

                var resultCode    		= "";
                var resultCode1   		= "";
                var resultMessage 		= "";
                var DsChkSvcOutVO 		= new Array();
                var DsChkSvcRsltOutVO	= new Array();

                try {
                    resultCode    		= response.resultCode;
                    resultCode1  		= response.data.CheckSvcChgResponse.ResponseRecord.BusinessHeader.ResultCode;
                    resultMessage		= response.data.CheckSvcChgResponse.ResponseRecord.BusinessHeader.ResultMessage;
                    DsChkSvcOutVO		= response.data.CheckSvcChgResponse.ResponseRecord.ResponseBody.DsChkSvcOutVO;
                    dsChkSvcRsltOutVO	= response.data.CheckSvcChgResponse.ResponseRecord.ResponseBody.DsChkSvcRsltOutVO;
                } catch(e) {
                    resultMessage = response.resultMessage;
                }

                if (resultCode == 'N0000' && resultCode1 == 'N0000') {
                    for(var value in dsChkSvcRsltOutVO) {
                        if (dsChkSvcRsltOutVO[value].msgType == "E" ||
                            dsChkSvcRsltOutVO[value].msgType == "B") {
                            hideOpenBar();
                            var noApplMsg = "로밍 신청이 불가능합니다.<br>" +
                                            "자세한 가입제한 사유는 고객센터(1522-9999)로 문의주세요.<br>" +
                                            "* [하루 데이터로밍(기간형)] 또는 [제로 프리미엄(기간형)] 서비스는 해지 1일 이후에 재가입 신청이 가능합니다.";
                            roamingPopalarm(noApplMsg, false, "", "", "확인", "", "");
                            return false;
                        }
                    }

                    callIFSM529(svcInfo);

                } else if(resultCode !== 'N0000') {
                    hideOpenBar();
                    roamingPopalarm(resultMessage, false, "", "", "확인", "", "");
                } else {
                    hideOpenBar();
                    roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                }
            }
            ,error : function(xhr) {
                if (xhr.status !== 0) {
                    hideOpenBar();
                    roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                }
            }
            ,complete: function(xhr, status) {
                /*
                if(getOsInfo().indexOf("app") !== -1) {
                    callAppService({
                        action_code : 'A0313'
                    });
                } else {
                    loading('stop');
                }
                */
            }
	});//end ajax
}

/** callIFSM529 **/
function getDataCallIFSM529(svcInfo) {
	var actionType     = svcInfo.actionType;
	var svcCd          = svcInfo.svcCd;
	var nextOperatorId = "1100000288";
	var dlrCd          = "315397";
	var CM559Result    = JSON.parse($("#CM559Result").val());
	var dsConflds      = CM559Result.DsConfldsOutVO;
	var dsCustInfo     = CM559Result.DsCustInfoOutVO;
	var dsDevInfo      = CM559Result.DsDevInfoOutVO;
	var svcEndDttm     = svcInfo.svcEndDttm;
	var svcStrtDttm    = svcInfo.svcStrtDttm;
	var aplyNation	   = svcInfo.aplyNation;
	var entrSvcSeqno   = svcInfo.entrSvcSeqno;

	var date = new Date();

	var data                   = new Object();
	var SaveSvcMdlCaseARoaming = new Object();
	var RequestRecord          = new Object();
	var RequestBody            = new Object();

	var DsConfldsInVO = new Array();

	var obj               = new Object();
	obj.directive         = dsConflds.directive;
	obj.runDate           = dsConflds.runDate;
	obj.runDateDtm        = dsConflds.runDateDtm;
	obj.transactionMode   = dsConflds.transactionMode;
	obj.entrNo            = dsConflds.entrNo;
	obj.entrDlUpdateStamp = dsConflds.entrDlUpdateStamp;
	obj.entrSysUpdateDate = dsConflds.entrSysUpdateDate;
	obj.aceno             = dsConflds.aceno;
	obj.cntcDlUpdateStamp = dsConflds.cntcDlUpdateStamp;
	obj.cntcSysUpdateDate = dsConflds.cntcSysUpdateDate;
	obj.ctnDlUpdateStamp  = "";
	obj.ctnSysUpdateDate  = "";
	obj.prodNo            = dsCustInfo.prodNo;
	obj.billAcntNo        = dsConflds.billAcntNo;
	obj.billDlUpdateStamp = dsConflds.billDlUpdateStamp;
	obj.billSysUpdateDate = dsConflds.billSysUpdateDate;
	obj.cnId              = dsConflds.cnId;
	obj.lockMode          = dsConflds.lockMode;
	obj.userWorkDlrCd     = dlrCd;
	obj.userWorkDlrNm     = "";
	obj.nextOperatorId    = nextOperatorId;

	DsConfldsInVO.push(obj);

	var DsChkSvcInVO = new Array();

	obj = new Object();
	obj.nextOperatorId = nextOperatorId;
	obj.svcCd          = svcCd;
	obj.hposSvcCd      = svcCd;
	obj.prodCd         = dsCustInfo.prodCd;
	obj.svcAplyLvlCd   = "C";
	obj.svcKdCd        = "R";
	obj.svcMode        = actionType;
	obj.svcSubMode     = actionType;

	if (actionType == 'I') {
		obj.svcMode     = actionType;
		obj.svcSubMode = actionType;
	} else if(actionType == 'U') {
		obj.svcMode    = 'U';
		obj.svcSubMode = 'E';
	} else if(actionType == 'D') {
		obj.svcMode    = 'U';
		obj.svcSubMode = 'U';
	}

	obj.svcRelsDvCd           = "BUN";
	obj.entrSvcSeqno          = entrSvcSeqno;
	obj.hposEntrSvcSeqno      = entrSvcSeqno;
	obj.svcStrtDttm           = svcStrtDttm;
	obj.svcEndDttm            = svcEndDttm;
	obj.aplyNation            = aplyNation;
	obj.organizationId        = "";
	obj.revisionId            = "";
	obj.svcNm                 = "";
	obj.inventoryItemId       = "";
	obj.ndblCvrtSvcCd         = "";
	obj.pVirtualNo            = "";
	obj.virtualNo             = "";
	obj.svcProdMode           = "";
	obj.entrRqstProdSeqno     = "";
	obj.entrProdSeqno         = "";
	obj.entrMeta              = "";
	obj.entrRqstNo            = "";
	obj.entrSvcRqstSeqno      = "";
	obj.aplyNationSvcStrtDttm = "";
	obj.aplyNationSvcEndDttm  = "";

	DsChkSvcInVO.push(obj);

	var DsUsimInfoInVO = new Array();

	obj                 = new Object();
	obj.nextOperatorId  = nextOperatorId;
	obj.entrNo          = dsConflds.entrNo;
	obj.usimMode        = "";
	obj.iccid           = "";
	obj.usimRuseYn      = "";
	obj.usimMdlCd       = "";
	obj.usimSerialNo    = "";
	obj.usimMdlDvCd     = "";
	obj.usimSttsCd      = "";
	obj.usimSttsRsnCd   = "";
	obj.saleAmt         = "";
	obj.usimInitYn      = "";
	obj.usimByEntrSeqno = "";
	obj.lteRoamImsi     = "";
	obj.usimValdEndDt   = "";
	obj.lteActType      = "";
	obj.itemOwnership   = "";
	obj.prssDlrCd       = "";

	DsUsimInfoInVO.push(obj);

	var DsUserMemoInVO = new Array();

	obj                = new Object();
	obj.nextOperatorId = nextOperatorId;
	obj.memoType       = "SVC";
	obj.userMemo       = "";

	DsUserMemoInVO.push(obj);

	var DsSaveSvcInVO = new Array();

	obj                      = new Object();
	obj.nextOperatorId       = nextOperatorId;
	obj.prodCd               = dsCustInfo.prodCd;
	obj.billAcntNo           = dsConflds.billAcntNo;
	obj.entrNo               = dsConflds.entrNo;
	obj.prodNo               = dsCustInfo.prodNo;
	obj.rgstDlrCd            = dlrCd;
	obj.rjnDt                = date.format("yyyyMMdd");
	obj.runDttm              = date.format("yyyyMMddhhmmss");
	obj.prcType              = "SVC";
	obj.prcSubType           = "AC";
	obj.prcMode              = "SVC";
	obj.prcSubMode           = "ACH";
	obj.noGuidPrcType        = "";
	obj.saleEmpno            = "";
	obj.svcDutyUseMnthCnt    = "";
	obj.svcDutyUseDvCd       = "";
	obj.svcDutyUseStrtDt     = "";
	obj.svcDutyUseEndDt      = "";
	obj.posCd                = "";
	obj.rsalePosCd           = "";
	obj.devUpYn              = "";
	obj.itemTrx              = "";
	obj.sid                  = "";
	obj.rlusrPersNo          = "";
	obj.kongUppChrgAmt       = "";
	obj.urlType              = "";
	obj.siteUrl              = "";
	obj.cmpnyId              = "";
	obj.rqstDvCd             = "";
	obj.entrRqstNo           = "";
	obj.lastIndcId           = "";
	obj.lastIndcChnlCd       = "";
	obj.entrSttsChngRsnCd    = "";
	obj.entrSttsChngRsnDtlCd = "";

	DsSaveSvcInVO.push(obj);

	RequestBody.DsConfldsInVO            = DsConfldsInVO;
	RequestBody.DsChkSvcInVO             = DsChkSvcInVO;
	RequestBody.DsUsimInfoInVO           = DsUsimInfoInVO;
	RequestBody.DsUserMemoInVO           = DsUserMemoInVO;
	RequestBody.DsSaveSvcInVO            = DsSaveSvcInVO;
	RequestRecord.RequestBody            = RequestBody;
	SaveSvcMdlCaseARoaming.RequestRecord = RequestRecord;
	data.SaveSvcMdlCaseARoaming          = SaveSvcMdlCaseARoaming;

	return data;
}

/** 신청/해지 **/
function callIFSM529(svcInfo) {
	var serviceId = "SM529";
	var data      = getDataCallIFSM529(svcInfo); // I/U

	var base       = new Object();
	base.serviceId = serviceId;
	base.data      = data;

	$.ajax({
             type        : 'POST'
            ,url         : '/appIf/v1/uplus/esb/' + serviceId
            ,data        : fnSign(JSON.stringify(base))
            ,contentType : 'application/json; charset=utf-8'
            ,cache       : false
            ,dataType    : "json"
            ,success     : function(data) {

                if (data.resultCode == "00000" || data.resultCode == "N0000") {
                    var body = data.data.SaveSvcMdlCaseARoamingResponse.ResponseRecord.ResponseBody;

                    if ('1' == body.DsResultOutVO[0].rslt) {
                        if (svcInfo.actionType == 'I') {
                            var title   = "로밍서비스 신청이 완료되었습니다.";
                            var message = "KB국민카드 이용고객님께 안내드립니다.<br>" +
                                          "신용/체크카드 사용범위(해외 오프라인 가맹점 사용기간/국가설정)를 직접 선택하여 부정사용(위변조 및 도난분실 등)을 예방할 수 있는 「카드사용 안심서비스」가 있으니 필요 시 신청하시기 바랍니다.";

                            roamingPopalarm(message
                                           ,true
                                           ,title
                                           ,"카드사용안심서비스"
                                           ,"확인"
                                           ,fn_openCardUsageSafeService
                                           ,initRoamingPage);
                        }

                        if (svcInfo.actionType == 'D') {
                            $("#div_LRZ0002680_use").hide();
                            $("#div_LRZ0003094_use").hide();
                            $("#div_zerolite_use").hide();

                            roamingPopalarm("로밍 서비스 해지가 완료되었습니다."
                                           ,false
                                           ,""
                                           ,""
                                           ,"확인"
                                           ,""
                                           ,initRoamingPage);
                        }
                    }
                } else {
                    roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                }
            }
            ,error : function(xhr) {
                if (xhr.status !== 0) {
                    roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                }
            }
            ,complete: function(xhr, status) {
                if (getOsInfo().indexOf("app") !== -1) {
                    callAppService({
                        action_code : 'A0313'
                    });
                } else {
                    loading('stop');
                }
            }
	});
}

/** 변경 **/
function callIFSM530ForUpdate(svcInfo) {
	var serviceId      = "SM530";
	var nextOperatorId = "1100000288";

	var data               = new Object();
	var RetrieveRmngPeriod = new Object();
	var RequestRecord      = new Object();
	var RequestBody        = new Object();

	var DsModeInVO = new Array();
	var obj        = new Object();

	obj.nextOperatorId = nextOperatorId;
	obj.svcMode        = "U";

	DsModeInVO.push(obj);

	var DsPeriodInVO = new Array();
	var obj          = new Object();

	obj.nextOperatorId = nextOperatorId;
	obj.entrSvcSeqno   = "";

	DsPeriodInVO.push(obj);

	var DsSavePeriodInVO = new Array();
	var obj              = new Object();

	obj.nextOperatorId        = nextOperatorId;
	obj.entrNo                = svcInfo.entrNo;
	obj.svcCd                 = svcInfo.svcCd;
	obj.svcStrtDttm           = svcInfo.svcStrtDttm;
	obj.svcEndDttm            = svcInfo.svcEndDttm;
	obj.aplyNation            = svcInfo.aplyNation;
	obj.aplyNationSvcStrtDttm = "";
	obj.aplyNationSvcEndDttm  = "";
	obj.entrSvcSeqno          = svcInfo.entrSvcSeqno;

	DsSavePeriodInVO.push(obj);

	RequestBody.DsModeInVO           = DsModeInVO;
	RequestBody.DsPeriodInVO         = DsPeriodInVO;
	RequestBody.DsSavePeriodInVO     = DsSavePeriodInVO;
	RequestRecord.RequestBody        = RequestBody;
	RetrieveRmngPeriod.RequestRecord = RequestRecord;
	data.RetrieveRmngPeriod          = RetrieveRmngPeriod;

	var base = new Object();
	base.serviceId = serviceId;
	base.data      = data;

	$.ajax({
             type        : 'POST'
            ,url         : '/appIf/v1/uplus/esb/' + serviceId
            ,data        : fnSign(JSON.stringify(base))
            ,contentType : 'application/json; charset=utf-8'
            ,cache       : false
            ,dataType    : "json"
            ,success     : function(data) {

                if (data.resultCode == "00000" || data.resultCode == "N0000") {
                    var body = data.data.RetrieveRmngPeriodResponse.ResponseRecord.ResponseBody;

                    if ('1' == body.DsResultOutVO[0].rslt) {
                        roamingPopalarm("로밍 서비스 변경이 완료되었습니다."
                                       ,false
                                       ,""
                                       ,""
                                       ,"확인"
                                       ,""
                                       ,initRoamingPage);
                    } else {
                        roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                    }

                } else {
                    roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                }
            }
            ,error : function(xhr) {
                if (xhr.status !== 0) {
                    roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                }
            }
            ,complete: function(xhr, status) {
                if(getOsInfo().indexOf("app") !== -1) {
                    callAppService({
                        action_code : 'A0313'
                    });
                } else {
                    loading('stop');
                }
            }
	});
}

// =====================================================================================================================
// 기간형 신청 레이어 팝업
// =====================================================================================================================

/** 방문 국가 검색 **/
function callIFAPIM0001(svcInfo) {
	var serviceId = "APIM0001";

	var obj  = new Object();
	obj.prodCd      = svcInfo.prodCd;
	obj.natnKorlNm  = svcInfo.natnKorlNm;

	var data = new Object();
	data.query = obj;

	var base = new Object();
	base.serviceId = serviceId;
	base.data = data;

	$.ajax({
             type        : 'POST'
            ,url         : '/appIf/v1/uplus/esb/' + serviceId
            ,data        : fnSign(JSON.stringify(base))
            ,contentType : 'application/json; charset=utf-8'
            ,cache       : false
            ,dataType    : "json"
		    ,success     : function(data) {

                $("#list_searched_nation").hide();
                $("#list_searched_nation > ul > ").remove();

                if (data.resultCode == "200" && data.data.dsRsltInfo.rsltCd == 'SUCCESS') {
                    var body = data.data.dsOutput;

                    for(var i = 0; i < body.length; i++) {
                        var li = body[i];
                        $("#list_searched_nation > ul").append('<li><button type="button" class="btn_nation" data-time="' + li.diffTmH + '" onclick="setSelectedNation(this);">' + li.natnKorlNm+'</button></li>');
                    }

                } else {
                    $("#list_searched_nation > ul").append('<div class="result_nodata"><p class="txt">검색 결과가 없습니다.</p></div>');
                }

                $("#list_searched_nation").show();
            }
            ,error : function(xhr) {
                if (xhr.status !== 0) {
                    roamingPopalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", false, "", "", "확인", "", "");
                }
            }
            ,complete : function(xhr, status) {
                if(getOsInfo().indexOf("app") !== -1) {
                    callAppService({
                        action_code : 'A0313'
                    });
                } else {
                    loading('stop');
                }
            }
	});
}

// =====================================================================================================================
// 로밍서비스용 popalarm
// =====================================================================================================================
var roamingPopalarm = function (message, cfrmYn, title, cancelBtnText, okBtnText, cancelCallback, okCallback) {

	if (getOsInfo().indexOf("app") === -1) {
        var obj = {};

        obj.msg            = message;
        obj.cfrmYn         = cfrmYn;
        obj.titleUse       = !isEmpty(title) ? true : false;
        obj.title          = title;
        obj.cancelBtnText  = cancelBtnText;
        obj.okBtnText      = okBtnText;
        obj.cancelCallback = cancelCallback;
        obj.okCallback     = okCallback;

        this.roamingPopalarmLayer(obj);

	} else {
	    var appObj = {};

        appObj.msg      = message;
        appObj.cfrmYn   = cfrmYn;
        appObj.titleUse = !isEmpty(title) ? true : false;

        if (!isEmpty(title)) {
            appObj.title = title;
        }

        if (!isEmpty(cancelBtnText)) {
            appObj.cancelBtnText = cancelBtnText;
        }

        if (!isEmpty(okBtnText)) {
            appObj.okBtnText = okBtnText;
        }

        if (!isEmpty(cancelCallback)) {
            appObj.cancelCallback = cancelCallback;
        }

        if (!isEmpty(okCallback)) {
            appObj.okCallback = okCallback;
        }

	    popalarm(appObj);
	}
}

var roamingPopalarmLayer = function (obj) {

    if ($(".layer_wrap.open.confirm > .row > .col > .ly_in").attr('tabindex') == 0 && $(".wrap").attr("aria-hidden") == "true") {
        return;
    }

    var confirmPopupHtml = "";

    confirmPopupHtml = confirmPopupHtml + '    <div class="ly_cnt">';
    confirmPopupHtml = confirmPopupHtml + '        <div class="section"></div>';
    confirmPopupHtml = confirmPopupHtml + '    </div>';
    confirmPopupHtml = confirmPopupHtml + '    <div class="btn_pop_confirm_wrap">';
    confirmPopupHtml = confirmPopupHtml + '        <div class="btn_area">';
    confirmPopupHtml = confirmPopupHtml + '            <button type="button" class="btn secondary" data-action="close">취소</button>';
    confirmPopupHtml = confirmPopupHtml + '            <button type="button" class="btn primary" data-action="close">확인</button>';
    confirmPopupHtml = confirmPopupHtml + '        </div>';
    confirmPopupHtml = confirmPopupHtml + '    </div>';

    $("#confirmPopup").html("");
    $("#confirmPopup").append(confirmPopupHtml);

    if (!obj.cfrmYn) {
        $('#confirmPopup > .btn_pop_confirm_wrap > .btn_area > .btn.secondary').hide();
    } else {
        $('#confirmPopup > .btn_pop_confirm_wrap > .btn_area > .btn.secondary').show();
    }

	if (!isEmpty(obj.msg)) {
		$('#confirmPopup > .ly_cnt > .section').html(obj.msg);
	}

	if (obj.cfrmYn && !isEmpty(obj.cancelBtnText)) {
		$('#confirmPopup > .btn_pop_confirm_wrap > .btn_area > .btn.secondary').text(obj.cancelBtnText);
	}

	if (!isEmpty(obj.okBtnText)) {
		$('#confirmPopup > .btn_pop_confirm_wrap > .btn_area > .btn.primary').text(obj.okBtnText);
	}

    $.ohyLayer({
         titleUse   : !isEmpty(obj.title) ? true : false
        ,title      : !isEmpty(obj.title) ? obj.title : ""
        ,content    : '#confirmPopup'
        ,type       : 'confirm'
        ,closeUse   : false
        ,closeAct   : true
    });

    setTimeout(function() {

        if (!isEmpty(obj.cancelCallback)) {
            $('.layer_wrap.open.confirm > .row > .col > .ly_in.noBtn > .ly_con > .btn_pop_confirm_wrap > .btn_area > .btn.secondary').click(function (e) {
                if (typeof obj.cancelCallback === "function") {
                    e.preventDefault();
                    setTimeout(function() { obj.cancelCallback.call(); }, 10);
                    $(".layer_wrap.open.confirm > .row > .col > .ly_in.noBtn > .ly_con > .btn_pop_confirm_wrap > .btn_area > .btn.secondary").unbind("click");
                } else if (typeof obj.okCallback === "string") {
                    setTimeout(function() { $('#' + obj.cancelCallback).focus(); }, 1);
                }
            });
        }

        if (!isEmpty(obj.okCallback)) {
            $('.layer_wrap.open.confirm > .row > .col > .ly_in.noBtn > .ly_con > .btn_pop_confirm_wrap > .btn_area > .btn.primary').click(function (e) {
                if (typeof obj.okCallback === "function") {
                    e.preventDefault();
                    setTimeout(function() { obj.okCallback.call(); }, 10);
                    $(".layer_wrap.open.confirm > .row > .col > .ly_in.noBtn > .ly_con > .btn_pop_confirm_wrap > .btn_area > .btn.primary").unbind("click");
                } else if (typeof obj.okCallback === "string") {
                    setTimeout(function() { $('#' + obj.okCallback).focus(); }, 1);
                }
            });
        }

    }, 100);
};

// =====================================================================================================================
// 기타
// =====================================================================================================================

/** 로밍서비스 신청 완료 카드사용안심서비스 새창 열기 **/
function fn_openCardUsageSafeService() {
    hideOpenBar();
    window.open("https://m.kbcard.com/SVC/DVIEW/MSCMCXHIASVC0060");
    initRoamingPage();
}

/** 딤처리 제외 **/
function hideOpenBar() {
    if (getOsInfo().indexOf("app") !== -1) {
        callAppService({
            action_code : 'A0313'
        });
    } else {
        loading('stop');
    }
}
