/**
 * 유플러스 고객 정보 조회
 * @param svcTelNo : 회선 번호
 * @param successCallback : 성공 시 콜백 함수
 * @return 고객 정보 json
 */
function getUplusCustInfo(svcTelNo, successCallback) {
	inferface_CM559(svcTelNo, function(data) {
		successCallback(data);
	});
}

/**
 * 고객 회선 일시정지 확인
 * @param svcTelNo : 회선 번호
 * @param successCallback : 성공 시 콜백 함수
 * @return boolean true : 일시정지, false, 일시정지아님
 */
function getIsPause(svcTelNo, successCallback) {
	inferface_CM559(svcTelNo, function(data) {
		var custInfo = data.data.RetrieveCustInfoSvcAddvBDResponse.ResponseRecord.ResponseBody; // 고객 정보
		successCallback(custInfo.DsCustInfoOutVO.entrSttsCd == "S" ? true : false);
	});
}

/**
 * QR요금제 확인
 * @param mnoProdCd : 유플러스 요금제 코드
 * @return boolean true, false
 */
function isProdQR(mnoProdCd) {
	return (mnoProdCd == "LPZ0016838");
}

/**
 * 태블릿요금제 확인
 * @param mnoProdCd : 유플러스 요금제 코드
 * @return boolean true, false
 */
function isProdTablet(mnoProdCd) {
	return (mnoProdCd == "LPZ0015848" || mnoProdCd == "LPZ0015850" || mnoProdCd == "LPZ0015852");
}

/**
 * 데이터쉐어링 확인
 * @param mnoProdCd : 유플러스 요금제 코드
 * @return boolean true, false
 */
function isProdDataSharing(mnoProdCd) {
	return (mnoProdCd == "LPZ0002626" || mnoProdCd == "LPZ0001410");
}

/**
 * 워치요금제 확인
 * @param mnoProdCd : 유플러스 요금제 코드
 * @return boolean true, false
 */
function isProdWatch(mnoProdCd) {
	return (mnoProdCd == "LPZ0002625");
}

/**
 * 멤버십 이용가능 요금제 확인
 * @param mnoProdCd : 유플러스 요금제 코드
 * @return array[2] : 0번째 멤버십 이용가능 YN, 1번째 이용불가 문구
 */
function checkMbsProd(mnoProdCd) {
	var useYn = "Y"
	var msg = "";
	
	if(mnoProdCd == "LPZ0016838") { // QR요금제
		useYn = "N";
		msg = "QR체크인 LTE요금제는 멤버십 혜택을 이용하실 수 없습니다.";
	} else if(mnoProdCd == "LPZ0015848" || mnoProdCd == "LPZ0015850" || mnoProdCd == "LPZ0015852") { // 태블릿요금제
		useYn = "N";
		msg = "태블릿 LTE요금제는 멤버십 혜택을 이용하실 수 없습니다.";
	} else if(mnoProdCd == "LPZ0002626" || mnoProdCd == "LPZ0001410") { // 데이터쉐어링
		useYn = "N";
		msg = "데이터쉐어링은 멤버십 혜택을 이용하실 수 없습니다.";
	} else if(mnoProdCd == "LPZ0002625") { // LTE 워치요금제
		useYn = "N";
		msg = "LTE 워치요금제는 멤버십 혜택을 이용하실 수 없습니다.";
	}

	return [useYn, msg]
}

/**
 * 사용중인 유플러스 요금제 코드
 * @param svcTelNo : 회선 번호
 * @param successCallback : 성공 시 콜백 함수
 * @return mnoProdCd : 사용중인 유플러스 요금제 코드
 */
function getMnoProdCd(svcTelNo, successCallback) {
	inferface_CM559(svcTelNo, function(data) {
		var mnoProdCd = "";
		var dsSvcInfoOutVO = data.data.RetrieveCustInfoSvcAddvBDResponse.ResponseRecord.ResponseBody.DsSvcInfoOutVO;
		
		$.each(dsSvcInfoOutVO, function(index, item) {
			if(item.svcKdCd == "P") { // 사용중인 기본 요금제
				mnoProdCd = item.svcCd;
				return false;
			}
		});
		
		successCallback(mnoProdCd);
	});
}

/**
 * CM559 호출 공통
 * @param svcTelNo : 회선 번호
 * @param successCallback : 성공 시 콜백 함수
 */
function inferface_CM559(svcTelNo, successCallback) {
	var serviceId = "CM559";
	var nextOperatorId = "1100000288"; // 처리자 ID
	
	var base = new Object();
	base.serviceId = serviceId;
	
	var data = new Object();
	var RetrieveCustInfoSvcAddvBD = new Object();
	var RequestRecord = new Object();
	var RequestBody = new Object();
	
	var DsReqInVO = new Object();
	DsReqInVO.entrNo = "";
	DsReqInVO.prodNo = telNoIfFormatter(svcTelNo);
	DsReqInVO.mode = "P";
	DsReqInVO.nextOperatorId = nextOperatorId;
	
	RequestBody.DsReqInVO = DsReqInVO;
	RequestRecord.RequestBody = RequestBody;
	RetrieveCustInfoSvcAddvBD.RequestRecord = RequestRecord;
	data.RetrieveCustInfoSvcAddvBD = RetrieveCustInfoSvcAddvBD;
	base.data = data;
	base.cm559 = 'Y';
	
	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/' + serviceId,
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		cache: false,
		dataType: "json",
		success: function(res) {
			data = JSON.parse(fnUnSign(res.enc));
			
			if(data.resultCode == "00000" || data.resultCode == "N0000") {
				successCallback(data);
			} else {
				popalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
			}
		},
		error: function(request,status,error){
			popalarm("일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", "info", false);
		}
	});
}