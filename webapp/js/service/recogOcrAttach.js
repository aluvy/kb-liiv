/**
 * OCR촬영 관련 공통 스크립트
 * 
 */
$(function(){		
	// 휴대폰 단말기 구분
	if( navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) ) {
		$('#ocrOtherCamera').detach();
	}else if( navigator.userAgent.match(/Android/i) ) { 
		$('#ocrIosCamera').detach();
	}else{ //PC
		$('#ocrIosCamera').detach();
	}
	
	$('#ocrFile1').MultiFile({
		max: 5, 
		maxfile: 10240, 
		maxsize: 102400,  
		STRING: { 
			remove : ''
		},
		list : '#ocrFileList'
	}); 
	
});

let tOcrFormInfo = "";
let tIdcardType = "";

//촬영 버튼 클릭
function uploadOcrImgClick(ocrFormInfo, idcardType) {
	//OS 따라 Ocr 호출
	if(getOsInfo() === 'ios_app'){
		//버전체크
		if(validVersionCheck()){			
			tOcrFormInfo = ocrFormInfo;
			tIdcardType = idcardType;
			callIosCameraAuth();
		}else{
			uploadOcrImgClickReal(ocrFormInfo, idcardType);
		}
	}else if (getOsInfo() === 'android_app'){
		//버전체크
		if(validVersionCheck()){			
			tOcrFormInfo = ocrFormInfo;
			tIdcardType = idcardType;
			callNativeOcrCamera(ocrFormInfo);
		}else{
			uploadOcrImgClickReal(ocrFormInfo, idcardType);
		}
	}else{
		uploadOcrImgClickReal(ocrFormInfo, idcardType);
	}
}

//네이티브 버전 체크
function validVersionCheck(){
	
	//현재 모바일 버전
	var cVersion = sessionStorage.getItem("appVersion");
	var cArray = cVersion.split('.');

	var cFirst = cArray[0];
	var cSecond = cArray[1];
	var cThird = cArray[2];

	//Native Ocr 사용 가능 버전
	if(getOsInfo() === 'android_app'){
		var mVersion = '1.0.93';		
		var mArray = mVersion.split('.');

		var mFirst = mArray[0];
		var mSecond = mArray[1];
		var mThird = mArray[2];

		if(cFirst > mFirst){
			return true;
		}else if(cFirst == mFirst){
			if(cSecond > mSecond){
				return true;
			}else if(cSecond == mSecond){
				if(cThird >= mThird){
					return true;
				}else{
					return false;
				}
			}else{
				return false;
			}
		}else{
			return false;
		}
	}else if( getOsInfo() === 'ios_app'){
		var mVersion = '1.0.4';
		var mArray = mVersion.split('.');

		var mFirst = mArray[0];
		var mSecond = mArray[1];
		var mThird = mArray[2];

		if(cFirst > mFirst){
			return true;
		}else if(cFirst == mFirst){
			if(cSecond > mSecond){
				return true;
			}else if(cSecond == mSecond){
				if(cThird >= mThird){
					return true;
				}else{
					return false;
				}
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
}

//IOS 촬영동의 CallBack 함수
function callbackIosCameraAuth(dValue) {

	//촬영동의 승락한 경우
	if(dValue == "Y"){
		
		initAttachFileByNative();
		
		//NativeOcr 촬영 호출
		if(tOcrFormInfo === 'IDCARD'){
			//주민등록증, 운전면허증
			callAppService({
				action_code : 'A0307',
				callBack : 'callbackNativeOcrIdcard' 
			});	

		}else if(tOcrFormInfo === 'CREDIT' || tOcrFormInfo === 'USIM'){
			//신용카드, 유심
			callAppService({
				action_code : 'A0308',
				callBack : 'callbackNativeOcrCreditUsim',
				action_param : {type : tOcrFormInfo} 
			});	
		}
	}
}

//네이티브 Ocr 촬영 호출
function callNativeOcrCamera(ocrFormInfo){
	
	initAttachFileByNative();
	
	//NativeOcr 촬영 호출
	if(ocrFormInfo === 'IDCARD'){
		//주민등록증, 운전면허증
		callAppService({
			action_code : 'A0307',
			callBack : 'callbackNativeOcrIdcard'
		});	

	}else if(ocrFormInfo === 'CREDIT' || ocrFormInfo === 'USIM'){
		//신용카드, 유심
		callAppService({
			action_code : 'A0308',
			callBack : 'callbackNativeOcrCreditUsim',
			action_param : {type : tOcrFormInfo}
		});	
	}
}

//네이티브 Ocr 콜백 함수 (주민등록증, 운전면허증)
function callbackNativeOcrIdcard(data) {
	
	modalLayer.show({
		id:'OCRIdcardLayer',
		type:'fullpopup',
		closeUse:true ,
		titleUse : true ,
		title : '&nbsp'
	});	

	var parseData = JSON.parse(data);

	var encImg = parseData.maskingImage; //data.cropImage; //base64이미지
	
	//인식후 이미지 출력
	var dec_src = "";
	
	if( encImg.indexOf("base64") != -1){
		dec_src = encImg;
	}else{
		dec_src = "data:image/;base64," + encImg;
	}
	
	if (tIdcardType == 'jumin') {
		if($('#OCRIdcardLayer').find("#ocrAfFormInfo").text() == "신분증"){ 
			$('#OCRIdcardLayer').find("#ocrAfFormInfo").text("주민등록증");
			$('#divOcrDrvLic').css('display','none');
		}
	} else if (tIdcardType == 'driver') {
		if($('#OCRIdcardLayer').find("#ocrAfFormInfo").text() == "신분증"){ 
			$('#OCRIdcardLayer').find("#ocrAfFormInfo").text("운전면허증");
			$('#divOcrDrvLic').css('display','');
		}
	}		

	$('#ocrAfImageIdCard').attr('src', dec_src);
	$('#ocrAfImageIdCard').css('display','');						
	
	//주민번호
	$("#ocrIdNum6").val((parseData.idNum).substr(0,6) );
	$("#ocrIdNum7").val((parseData.idNum).substr(6,7) );

	//이름	
	$("#ocrIdName").val(parseData.idName);
	
	//날짜(발급일자) 
	$("#ocrCertDate").val(parseData.certDate);

	//면허번호
	if (tIdcardType == 'driver') {
		
		var ocrDrvLicRgn = (parseData.drvLicNum).substr(0, ((parseData.drvLicNum).length - 10) ); //면허지역 인식값 (문자일수도 숫자일수도)
		var ocrDrvLicNo  = (parseData.drvLicNum).substr(-10); //면허지역 뒤 10자리 숫자 인식값

		if(!!Number(ocrDrvLicRgn)){
			$("#btn_selectArea").text(fnRegionName(ocrDrvLicRgn));
			$("#ocrDrvLicRgn").val(ocrDrvLicRgn);
		}else{
			$("#btn_selectArea").text(ocrDrvLicRgn);
			$("#ocrDrvLicRgn").val(fnRegionCode(ocrDrvLicRgn));
		}

		$("#ocrDrvLicNo").val(ocrDrvLicNo);

		$('#OCRIdcardLayer').find("#ocrAfFormInfo").text("운전면허증");
		$('#divOcrDrvLic').css('display','');
	}	
	
	if($('#OCRIdcardLayer').find("#ocrAfFormInfo").text() == "신분증"){ 
		$('#OCRIdcardLayer').find("#ocrAfFormInfo").text("주민등록증");
		$('#divOcrDrvLic').css('display','none');
	}

}

//네이티브 Ocr 콜백 함수 (신용카드, USIM)
function callbackNativeOcrCreditUsim(data) {

	var parseData = JSON.parse(data);
	
	var encImg = parseData.maskingImage; //data.cropImage; //base64이미지
	
	//인식후 이미지 출력
	var dec_src = "";
	
	if( encImg.indexOf("base64") != -1){
		dec_src = encImg;
	}else{
		dec_src = "data:image/;base64," + encImg;
	}

	if(tOcrFormInfo === 'CREDIT'){
		$('#ocrAfImageCard').attr('src', dec_src);
		$('#ocrAfImageCard').css('display','');	
		
		modalLayer.show({
			id:'OCRCcardLayer',
			type:'fullpopup',
			closeUse: true,
			titleUse : true ,
			title : '&nbsp'                             
		});
		
		//유효기간
		var cardExpDateText = parseData.cardExpDate.replace( /[^0-9]/g, '' );
		if(cardExpDateText.length > 4){
			cardExpDateText = cardExpDateText.substring(0, 4);
		}
		$("#ocrCardExpDate").val(cardExpDateText);	
		$('#ocrCardExpDate').trigger('keyup');							
		
		//카드번호			
		var cardNum = parseData.cardNum.replaceAll("-","") ;

		$("#ocrCardNumber1").val(cardNum.substr(0,4)); 
		$("#ocrCardNumber2").val(cardNum.substr(4,4)); 
		$("#ocrCardNumber3").val(cardNum.substr(8,4)); 
		$("#ocrCardNumber4").val(cardNum.substr(12,4));

	}else if(tOcrFormInfo === 'USIM'){

		$('#ocrAfImageUsim').attr('src', dec_src);
		$('#ocrAfImageUsim').css('display','');	

		modalLayer.show({
			id:'OCRUsimLayer',
			type:'fullpopup',
			closeUse: true ,
			titleUse : true ,
			title : '&nbsp'                                  
		});			
			
		var modelNo  = ""; //모델번호 
		var serialNo = ""; //일련번호
		
		//soId에 따라 처리.. //kje.
		if($('#soId').val() == "01"){ //LGU
			modelNo = (parseData.barcode).substr(0, 5); //앞에서 5자리
			serialNo = (parseData.barcode).substr(-8); //뒤에서 8자리	
		}else if($('#soId').val() == "02"){ //KT				
			serialNo = (parseData.barcode).substr(0, ((parseData.barcode).length - 1) ); //끝 한자리(F) 빼고 19자리			
		}else if($('#soId').val() == "03"){ //SKT								
			serialNo = (parseData.barcode).substr(-14); //뒤에서 14자리
		}
									
		$("#ocrUsimModel").val(modelNo.toUpperCase()); 
		$("#ocrUsimSerial").val(serialNo.toUpperCase());
	}
}

function uploadOcrImgClickReal(ocrFormInfo, idcardType) {

	initAttachFile(ocrFormInfo, idcardType);	
	
	$('#ocrFile1').click();
}


//재촬영 버튼 클릭
function retryOcrImgClick() {	
	var ocrFormInfo = $("#ocrFormInfo").val();
	var idcardType = "";

	if($('#OCRIdcardLayer').find("#ocrAfFormInfo").text() == "주민등록증"){		
		idcardType = 'jumin';
	}else if($('#OCRIdcardLayer').find("#ocrAfFormInfo").text() == "운전면허증"){	
		idcardType = 'driver';		
	}

	//OS에 따라 촬영 카메라를 호출한다.
	if(getOsInfo() === 'ios_app'){
		//버전체크
		if(validVersionCheck()){
			callIosCameraAuth();
		}else{
			initAttachFile(ocrFormInfo, idcardType);
			$('#ocrFile1').click();
		}
	}else if (getOsInfo() === 'android_app'){
		//버전체크
		if(validVersionCheck()){
			callNativeOcrCamera(tOcrFormInfo);
		}else{
			initAttachFile(ocrFormInfo, idcardType);
			$('#ocrFile1').click();
		}
	}else{
		initAttachFile(ocrFormInfo, idcardType);
		$('#ocrFile1').click();
	}
}

//완료 버튼 클릭
function popOCRConfirmClick() {	
	var ocrFormInfo = $("#ocrFormInfo").val();
	
	setFromOCRRecogInfo(ocrFormInfo); //각 업무화면에서 구현할것.
	
	// if     (ocrFormInfo == 'IDCARD'){ modalLayer.hide('OCRIdcardLayer'); }
	// else if(ocrFormInfo == 'CREDIT'){ modalLayer.hide('OCRCcardLayer');  }
	// else if(ocrFormInfo == 'USIM')  { modalLayer.hide('OCRUsimLayer');   }	
	
	if(getOsInfo().indexOf("app") != -1) {
		initAttachFileByNative();		
	}else{
		initAttachFile(ocrFormInfo);
	}
	
	$('#OCRIdcardLayer').find("#ocrAfFormInfo").text("");

	//지역번호 값 초기화
	$("#btn_selectArea").text("지역선택");
    $("#ocrDrvLicRgn").val("");
}

// 첨부파일 업로드 시
function imgUpload(e) {
	var flie = e.target.files[0];

	if(flie.size > 1024*1000*10) {
		
		let opt = {
				msg: "10MB이내의 사진 파일을 첨부해 주세요.",
				cfrmYn: false
		}
	
		popalarm(opt);
		
		return;
	}	
	
	//촬영 or 사진첨부시, upload 및 ocr인식 자동처리	
	ocrFileRecog($("#ocrFormInfo").val());
}

// 첨부파일 관련 초기화
function initAttachFile(ocrFormInfo, idcardType) {	
	
	//파일선택자 초기화
	if((/(MSIE|Trident)/).test(navigator.userAgent)){ 
		$('#ocrFile1').replaceWith($('#ocrFile1').clone(true));
	}else{
		$('#ocrFile1').val("");
	}
	
	$('#ocrFileList').empty();
	
	
	$('#ocrFormInfo').val(ocrFormInfo);
	
	if(ocrFormInfo == 'IDCARD'){
	//OCRIdcardLayer>layer_body		
		if(idcardType == 'jumin'){
			$('#OCRIdcardLayer').find("#ocrAfFormInfo").text("주민등록증");
			$('#divOcrDrvLic').css('display','none');
		}else if(idcardType == 'driver'){
			$('#OCRIdcardLayer').find("#ocrAfFormInfo").text("운전면허증");
			$('#divOcrDrvLic').css('display','');
		}else{ //undefined
			if($('#OCRIdcardLayer').find("#ocrAfFormInfo").text() == ""){
				$('#OCRIdcardLayer').find("#ocrAfFormInfo").text("신분증"); //kje.
				$('#divOcrDrvLic').css('display','none'); //default
			}
		}
		
		$('#ocrAfImageIdCard').css('display','none');
		$('#ocrAfImageIdCard').attr('src', '');

		
		$("#ocrIdName").val("");
		$("#ocrIdNum6").val("");
		$("#ocrIdNum7").val("");	
		
		$("#ocrCertDate").val("");
		
		$('#ocrDrvLicRgn option:selected').removeAttr('selected');		
		$("#ocrDrvLicNo").val("");
		
	}else if(ocrFormInfo == 'CREDIT'){
		//OCRCcardLayer>layer_body 
		$('#OCRCcardLayer').find("#ocrAfFormInfo").text("신용카드");
		
		$('#ocrAfImageCard').css('display','none');
		$('#ocrAfImageCard').attr('src', '');
		
		//$("#ocrCardNumber").val("");
		$("#ocrCardNumber1").val("");
		$("#ocrCardNumber2").val("");
		$("#ocrCardNumber3").val("");
		$("#ocrCardNumber4").val("");

		$("#ocrCardExpDate").val("");		
		
	}else if(ocrFormInfo == 'USIM'){
	//OCRUsimLayer>layer_body 	
		//soId에 따라 처리.. //kje.
		if($('#soId').val() == "01"){ //LGU
			$('#OCRUsimLayer').find("#ocrAfFormInfo").text("유심 (LG U+)");
			$("#ocrUsimModelDiv").css("display",'');
		}else if($('#soId').val() == "02"){ //KT
			$('#OCRUsimLayer').find("#ocrAfFormInfo").text("유심 (KT)");
			$("#ocrUsimModelDiv").css("display","none");
		}else if($('#soId').val() == "03"){ //SKT
			$('#OCRUsimLayer').find("#ocrAfFormInfo").text("유심 (SKT)");
			$("#ocrUsimModelDiv").css("display","none");
		}else{ //undefined
			$('#OCRUsimLayer').find("#ocrAfFormInfo").text("유심");
			$("#ocrUsimModelDiv").css("display",''); //default
		}			
		
		$('#ocrAfImageUsim').css('display','none');
		$('#ocrAfImageUsim').attr('src', '');
		
		$("#ocrUsimModel").val("");
		$("#ocrUsimSerial").val("");
	}
}

// 첨부파일 관련 초기화
function initAttachFileByNative() {	
	
	$('#ocrFormInfo').val(tOcrFormInfo);
	
	if(tOcrFormInfo == 'IDCARD'){
	//OCRIdcardLayer>layer_body		
		if(tIdcardType == 'jumin'){
			$('#OCRIdcardLayer').find("#ocrAfFormInfo").text("주민등록증");
			$('#divOcrDrvLic').css('display','none');
		}else if(tIdcardType == 'driver'){
			$('#OCRIdcardLayer').find("#ocrAfFormInfo").text("운전면허증");
			$('#divOcrDrvLic').css('display','');
		}else{ //undefined
			if($('#OCRIdcardLayer').find("#ocrAfFormInfo").text() == ""){
				$('#OCRIdcardLayer').find("#ocrAfFormInfo").text("신분증"); //kje.
				$('#divOcrDrvLic').css('display','none'); //default
			}
		}
		
		$('#ocrAfImageIdCard').css('display','none');
		$('#ocrAfImageIdCard').attr('src', '');

		
		$("#ocrIdName").val("");
		$("#ocrIdNum6").val("");
		$("#ocrIdNum7").val("");	
		
		$("#ocrCertDate").val("");
		
		$('#ocrDrvLicRgn option:selected').removeAttr('selected');		
		$("#ocrDrvLicNo").val("");
		
	}else if(tOcrFormInfo == 'CREDIT'){
		//OCRCcardLayer>layer_body 
		$('#OCRCcardLayer').find("#ocrAfFormInfo").text("신용카드");
		
		$('#ocrAfImageCard').css('display','none');
		$('#ocrAfImageCard').attr('src', '');
		
		//$("#ocrCardNumber").val("");
		$("#ocrCardNumber1").val("");
		$("#ocrCardNumber2").val("");
		$("#ocrCardNumber3").val("");
		$("#ocrCardNumber4").val("");

		$("#ocrCardExpDate").val("");		
		
	}else if(tOcrFormInfo == 'USIM'){
	//OCRUsimLayer>layer_body 	
		//soId에 따라 처리.. //kje.
		if($('#soId').val() == "01"){ //LGU
			$('#OCRUsimLayer').find("#ocrAfFormInfo").text("유심 (LG U+)");
			$("#ocrUsimModelDiv").css("display",'');
		}else if($('#soId').val() == "02"){ //KT
			$('#OCRUsimLayer').find("#ocrAfFormInfo").text("유심 (KT)");
			$("#ocrUsimModelDiv").css("display","none");
		}else if($('#soId').val() == "03"){ //SKT
			$('#OCRUsimLayer').find("#ocrAfFormInfo").text("유심 (SKT)");
			$("#ocrUsimModelDiv").css("display","none");
		}else{ //undefined
			$('#OCRUsimLayer').find("#ocrAfFormInfo").text("유심");
			$("#ocrUsimModelDiv").css("display",''); //default
		}			
		
		$('#ocrAfImageUsim').css('display','none');
		$('#ocrAfImageUsim').attr('src', '');
		
		$("#ocrUsimModel").val("");
		$("#ocrUsimSerial").val("");
	}
}

function fnRegionCode(pRegionName){

	let regionCode = "";
	
	if(pRegionName == "경기"){
		regionCode = "13";
	}else if(pRegionName == "서울"){
		regionCode = "11";
	}else if(pRegionName == "경기북부"){
		regionCode = "28";
	}else if(pRegionName == "경기남부"){
		regionCode = "13";
	}else if(pRegionName == "강원"){
		regionCode = "14";
	}else if(pRegionName == "충북"){
		regionCode = "15";
	}else if(pRegionName == "충남"){
		regionCode = "16";
	}else if(pRegionName == "전북"){
		regionCode = "17";
	}else if(pRegionName == "전남"){
		regionCode = "18";
	}else if(pRegionName == "경북"){
		regionCode = "19";
	}else if(pRegionName == "경남"){
		regionCode = "20";
	}else if(pRegionName == "제주"){
		regionCode = "21";
	}else if(pRegionName == "대구"){
		regionCode = "22";
	}else if(pRegionName == "인천"){
		regionCode = "23";
	}else if(pRegionName == "광주"){
		regionCode = "24";
	}else if(pRegionName == "대전"){
		regionCode = "25";
	}else if(pRegionName == "울산"){
		regionCode = "26";
	}else if(pRegionName == "부산"){
		regionCode = "12";
	}

	return regionCode;
}

function fnRegionName(pRegionCode){

	let regionName = "";
	
	if(pRegionCode == "13"){
		regionName = "경기(13)";
	}else if(pRegionCode == "11"){
		regionName = "서울(11)";
	}else if(pRegionCode == "28"){
		regionName = "경기북부(28)";
	}else if(pRegionCode == "14"){
		regionName = "강원(14)";
	}else if(pRegionCode == "15"){
		regionName = "충북(15)";
	}else if(pRegionCode == "16"){
		regionName = "충남(16)";
	}else if(pRegionCode == "17"){
		regionName = "전북(17)";
	}else if(pRegionCode == "18"){
		regionName = "전남(18)";
	}else if(pRegionCode == "19"){
		regionName = "경북(19)";
	}else if(pRegionCode == "20"){
		regionName = "경남(20)";
	}else if(pRegionCode == "21"){
		regionName = "제주(21)";
	}else if(pRegionCode == "22"){
		regionName = "대구(22)";
	}else if(pRegionCode == "23"){
		regionName = "인천(23)";
	}else if(pRegionCode == "24"){
		regionName = "광주(24)";
	}else if(pRegionCode == "25"){
		regionName = "대전(25)";
	}else if(pRegionCode == "26"){
		regionName = "울산(26)";
	}else if(pRegionCode == "12"){
		regionName = "부산(12)";
	}

	return regionName;
}

//사진 첨부 및 OCR인식
function ocrFileRecog(ocrFormInfo) {
	//var ocrFormInfo = $("#ocrFormInfo").val();  // IDCARD/CREDIT/USIM

	$('#recogOcr').ajaxSubmit({
		url:  "/mypage/recogOcr/uploadImgAndOcr.ajax",
		type: "POST",
		enctype:"multipart/form-data",
		//dataType : 'json',
		processData : false,
		contentType : false,
		cache: false,
		timeout:600000,
		beforeSend : function(xhr, set) {
			let token = $("meta[name='_csrf']").attr("content");
			let header = $("meta[name='_csrf_header']").attr("content");
			xhr.setRequestHeader(header, token);
		},			
		success: function(data) {				
			var resultCode = data.resultCode;
			var resultMessage = data.message;					
			
			if(resultCode == '200') { 
				var encImg = data.maskingImage; //data.cropImage; //base64이미지
				var fieldResults = data.formResult.fieldResults; //인식결과
				//console.log("encImg="+encImg);
				//console.log("fieldResults="+fieldResults);
				
				var ocrFormInfo = $("#ocrFormInfo").val();
				var ocrFormType = ""; //인식결과 타입
								
				//이하, OCR Layer 영역 출력 :
				
				//인식후 이미지 출력
				var dec_src = "";
				if( encImg.indexOf("base64") != -1){
					dec_src = encImg;
				}else{
					dec_src = "data:image/;base64," + encImg;
				}				
//				console.log("dec_src="+dec_src);		
				
				//인식항목값 출력
				$.each(fieldResults, function(index, item) {
					if(item.fieldId == "1") { //인식결과 타입 (주민등록증은 10, 운전면허증은 11 . USIM/CREDIT은 안나옴)
						ocrFormType = item.value;						
						if (ocrFormType == '10') {
							if($('#OCRIdcardLayer').find("#ocrAfFormInfo").text() == "신분증"){ 
								$('#OCRIdcardLayer').find("#ocrAfFormInfo").text("주민등록증");
								$('#divOcrDrvLic').css('display','none');
							}
						} else if (ocrFormType == '11') {
							if($('#OCRIdcardLayer').find("#ocrAfFormInfo").text() == "신분증"){ 
								$('#OCRIdcardLayer').find("#ocrAfFormInfo").text("운전면허증");
								$('#divOcrDrvLic').css('display','');
							}
						}						
					}			
					
					if(ocrFormInfo == 'IDCARD'){
						$('#ocrAfImageIdCard').attr('src', dec_src);
						$('#ocrAfImageIdCard').css('display','');						
						
						if(item.fieldId == "101") { //주민번호
							$("#ocrIdNum6").val( (item.value).substr(0,6) );
							$("#ocrIdNum7").val( (item.value).substr(6,7) );
						}
						if(item.fieldId == "102") { //이름
							$("#ocrIdName").val(item.value);
						}
						if(item.fieldId == "103") { //날짜(발급일자) 
							$("#ocrCertDate").val(item.value);
						}
						if(item.fieldId == "104") { //면허번호
							var ocrDrvLicRgn = (item.value).substr(0, ((item.value).length - 10) ); //면허지역 인식값 (문자일수도 숫자일수도)
							var ocrDrvLicNo  = (item.value).substr(-10); //면허지역 뒤 10자리 숫자 인식값
			
							if(!!Number(ocrDrvLicRgn)){
								$("#btn_selectArea").text(fnRegionName(ocrDrvLicRgn));
								$("#ocrDrvLicRgn").val(ocrDrvLicRgn);
							}else{
								$("#btn_selectArea").text(ocrDrvLicRgn);
								$("#ocrDrvLicRgn").val(fnRegionCode(ocrDrvLicRgn));
							}

							$("#ocrDrvLicNo").val(ocrDrvLicNo);

							$('#OCRIdcardLayer').find("#ocrAfFormInfo").text("운전면허증");
							$('#divOcrDrvLic').css('display','');
						}
						
						if($('#OCRIdcardLayer').find("#ocrAfFormInfo").text() == "신분증"){ 
							$('#OCRIdcardLayer').find("#ocrAfFormInfo").text("주민등록증");
							$('#divOcrDrvLic').css('display','none');
						}
						
						//modalLayer.show('OCRIdcardLayer');
						
						modalLayer.show({
							id:'OCRIdcardLayer',
							type:'fullpopup',
							closeUse:true ,
							titleUse : true ,
							title : '&nbsp'
						});							
					}
					else if(ocrFormInfo == 'CREDIT'){
						$('#ocrAfImageCard').attr('src', dec_src);
						$('#ocrAfImageCard').css('display','');	
						
						modalLayer.show({
							id:'OCRCcardLayer',
							type:'fullpopup',
							closeUse: true,
							titleUse : true ,
							title : '&nbsp'                             
						});
						
						if(item.fieldId == "301") { //유효기간
							var cardExpDateText = item.value.replace( /[^0-9]/g, '' );
							if(cardExpDateText.length > 4){
								cardExpDateText = cardExpDateText.substring(0, 4);
							}
							$("#ocrCardExpDate").val(cardExpDateText);	
							$('#ocrCardExpDate').trigger('keyup');							
						}	
						if(item.fieldId == "300") { //카드번호
							
							var cardNum = item.value;
							
							$("#ocrCardNumber1").val(cardNum.substr(0,4)); 
							$("#ocrCardNumber2").val(cardNum.substr(4,4)); 
							$("#ocrCardNumber3").val(cardNum.substr(8,4)); 
							$("#ocrCardNumber4").val(cardNum.substr(12,4)); 
							
						}			
						//modalLayer.show('OCRCcardLayer');
					}
					else if(ocrFormInfo == 'USIM'){
						$('#ocrAfImageUsim').attr('src', dec_src);
						$('#ocrAfImageUsim').css('display','');	
						
						if(item.fieldId == "400") { //PIN번호 
						}
						if(item.fieldId == "401") { //PUK번호 
						}						
						if(item.fieldId == "402") { //Barcode번호
							var modelNo  = ""; //모델번호 
							var serialNo = ""; //일련번호
							
							//soId에 따라 처리.. //kje.
							if($('#soId').val() == "01"){ //LGU
								modelNo = (item.value).substr(0, 5); //앞에서 5자리
								serialNo = (item.value).substr(-8); //뒤에서 8자리	
								
							}else if($('#soId').val() == "02"){ //KT				
								serialNo = (item.value).substr(0, ((item.value).length - 1) ); //끝 한자리(F) 빼고 19자리
								
							}else if($('#soId').val() == "03"){ //SKT								
								//modelNo = (item.value).substr(0, ((item.value).length - 14) ); //뒤에서 14자리 빼고 앞		
								serialNo = (item.value).substr(-14); //뒤에서 14자리
							}
														
							$("#ocrUsimModel").val(modelNo.toUpperCase()); 
							$("#ocrUsimSerial").val(serialNo.toUpperCase());
						}
						
						modalLayer.show({
							id:'OCRUsimLayer',
							type:'fullpopup',
							closeUse: true ,
							titleUse : true ,
							title : '&nbsp'                                  
						});								
						
						// modalLayer.show('OCRUsimLayer');
					}
				});

			} else {
				//popalarm("["+resultCode+"]"+resultMessage, "", false);
				
				let opt = {
					msg: "인식할 수 없습니다. 정보를 직접 입력해 주세요",
					cfrmYn: false,
					okCallback: function(){
							var ocrFormInfo = $("#ocrFormInfo").val();
							
							if (ocrFormInfo == 'IDCARD'){ 
								if($('#OCRIdcardLayer').find("#ocrAfFormInfo").text() == "신분증"){ //kje.
									//default
									$('#OCRIdcardLayer').find("#ocrAfFormInfo").text("주민등록증"); 
									$('#divOcrDrvLic').css('display','none');
								}								
								modalLayer.show({
									id:'OCRIdcardLayer',
									type:'fullpopup',
									closeUse: true ,
									titleUse : true ,
									title : '&nbsp'
								});

								//modalLayer.show('OCRIdcardLayer'); 
							}
							else if(ocrFormInfo == 'CREDIT'){ 
								
								modalLayer.show({
									id:'OCRCcardLayer',
									type:'fullpopup',
									closeUse: true ,                                    
									titleUse : true ,
									title : '&nbsp'                                 
								});									
								//modalLayer.show('OCRCcardLayer');  
							}
							else if(ocrFormInfo == 'USIM')  { 
								modalLayer.show({
									id:'OCRUsimLayer',
									type:'fullpopup',
									closeUse: true  ,
									titleUse : true ,
									title : '&nbsp'                              
								});									
								//modalLayer.show('OCRUsimLayer');   
							}
						}
				}
		
				popalarm(opt);
			}
		},
		error:function(request,status,error) {

			let opt = {
				msg: "인식에 실패하였습니다. 다시 촬영해 주세요.",
				cfrmYn: false,
				okCallback: function(){
					var idcardType = "";
					if($('#OCRIdcardLayer').find("#ocrAfFormInfo").text() == "주민등록증"){		
						idcardType = 'jumin';
					}else if($('#OCRIdcardLayer').find("#ocrAfFormInfo").text() == "운전면허증"){	
						idcardType = 'driver';
					}
					uploadOcrImgClick($("#ocrFormInfo").val(), idcardType);
				}				
			}
	
			popalarm(opt);
		}
	});	
}

