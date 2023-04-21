//DateFormat
function dateToYYYMMDD(date){
	return date.getFullYear()+'.'+pad(date.getMonth()+1)+'.'+pad(date.getDate());
}

function pad(num){
	num = num +'';
	return num.length < 2 ? '0' + num : num ;
}

//DateFormat2
function dateToYYYMMDD2(){
	var d =new Date();
	var s =leadingZeros(d.getFullYear(),4)+'.'+leadingZeros(d.getMonth()+1,2)+'.'+leadingZeros(d.getDate(),2)+' ' +leadingZeros(d.getHours(),2)+':'+leadingZeros(d.getMinutes(),2)+':'+leadingZeros(d.getSeconds(),2);

	return s;
}

//DateFormat3
function dateToYYYMMDD3(date){
	return date.substring(0,4)+"."+date.substring(4,6)+"."+date.substring(6,8);
}

function leadingZeros(n,digits){
	var zero ='';
	n =n.toString();

	if(n.length < digits) {
		for(i =0 ;i <digits-n.length;i++ )
			zero +='0';
	}
	return zero + n ;
}

function onlyNumberIn(obj){
	$(obj).val( $(obj).val().replace( /[^0-9]/g, '' ) );// 숫자만입력
}

function chkmtelNo(phnum){
	var regExp_ctn  = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/;
	if(regExp_ctn .test(phnum)){
		return true;
	} else {
		return false;
	}
}

// userSvcLine.jsp 이용 시 필수 선언
function changeUserSvcInfo(svcInfo) {
}


// 공통 팝업
function callPop(msg, okCallbackFn, cancelCallbackFn) {

    console.log("callPop");
    let option = {
                  msg           : msg
                 ,title         : ""
                 ,okCallback    : okCallbackFn
                 ,cancelCallback : cancelCallbackFn
    };
    popalarm(option);
    return false;
}

// 공통 컨펌 팝업
function callConfirmPop(msg, okCallbackFn, cancelCallbackFn,okTxt) {
    let option = {
                  msg           : msg
                 ,cfrmYn        : true
                 ,title         : ""
                 ,cancelBtnText : "취소"
                 ,okBtnText     : okTxt || "확인"
                 ,okCallback    : okCallbackFn
                 ,cancelCallback : cancelCallbackFn
    };

    setTimeout(function(){
        popalarm(option);
    }, 10);
    return false;
}

// 더보기 버튼
function fn_more(){

    var resultCnt = $('#resultCnt').val(resultCnt);	 // 전체리스트수
    var endPage =  $('#moreMax').val(); //끝페이지
    var currPage = $('#moreMin').val();	 // 이전페이지

    $('#moreMin').val(currPage+1);	 // 현재페이지

    var startListIndex = (30*currPage) ;
    var loopLimit = startListIndex+30;
    var nxtPage = currPage+1;

    if(nxtPage => endPage){


        for( var i= startList; i< loopLimit ; i++){ //페이지에 보여줄 리스트
            var resultValue = result[i];

            var histTpNm = "";
            if ( resultValue.histTp == "SUS"){
                histTpNm ="일시정지";
            }
            if( resultValue.histTp == "RSP"){
                histTpNm ="일시정지해제";
            }

            var extDate = "";
            if ( resultValue.extDate != null){
                extDate = dateToYYYMMDD3(resultValue.extDate); //실행일
            }

            var rsnCdNm = resultValue.rsnCdNm; //사유명
            if(resultValue.rsnCd != 'MS' && resultValue.rsnCd != 'ABW' && resultValue.rsnCd != 'ABT'){
                susRsn ="일반";
            } else {
                susRsn = rsnCdNm;
            }

            $('#histLoation').append("<tr>"+"<td>"+phonNumber+"</td>"+"<td>"+histTpNm+"</td>"+"<td>"+extDate+"</td>" + "<td>"+susRsn+"</td>" + "</tr> ");
        }

    }else{
        loopLimit = resultCnt;
        $('#btn_more').hide();
    }

}


// 비밀번호 인증 레이어
function startCertification() {

   // 비밀번호 인증 팝업
    $.ohyLayer({
        title:"비밀번호 인증",
        content:'#pwdCertLayer',
        type:'bottom',
        closeUse:true,
        dimAct:true,
    });
}


//일시정지/일시정지해제 이력조회
function sendLMCT000019(){
    var svcData =   JSON.parse($("#userMajorSvc").attr("data-map").replace(/'/gi, "\""));

	var data = new Object();
	data.soId = svcData.soId;
	data.custIdnfr = svcData.custId.substring(0,10) ;//고객식별자
	data.custMgtNo = svcData.custId.substring(10,15); //고객관리번호
	data.tgtTelno = svcData.svcTelNo;  //대상회선번호(11자리)
	data.ctrtId = svcData.ctrtId; //계약아이디
	data.serviceId = svcData.serviceId; //MVNO가입번호(통신원장번호) //CM559CustInfo.entrNo

    fn_transCall("/info/stop/LMCT000019", data, sendLMCT000019_callBack);

}

// 일시정지 리스트 그리기
function sendLMCT000019_callBack(tranId, data, status, inputData){

    console.log("sendLMCT000019_callBack : " + JSON.stringify(data))
    var svcData =  JSON.parse($("#userMajorSvc").attr("data-map").replace(/'/gi, "\""));

     console.log("sendLMCT000019_callBack tranId : " + tranId);
     switch(tranId){
        case 'LMCT000019' :

            var susRsn ="";
            if( data.resultCode == '00000000' && data.data != null ){
                var resultCnt = data.data.histCnt;
                var result    = data.data.histList;

                $('#histLoation *').remove(); //비워주기

                if(resultCnt > 0 && result != null){
                    var prodNo = svcData.svcTelNo;
                    var phonNumber ="";
                    if(prodNo != null){
                        if( prodNo.length == 11 ){ //kje.
                            var num1 = prodNo.substr(0,3);
                            var num2 = prodNo.substr(3,2) + "**";//prodNo.substr(3,4);
                            var num3 = prodNo.substr(7,2) + "**";//prodNo.substr(7,4);
                            phonNumber = num1 +'-'+num2+'-'+num3;
                        }
                    }

                    var list = parseInt(resultCnt/30);
                    var maxlist = resultCnt - (30*list);

                    $('#moreMax').val(list); //끝페이지
                    $('#moreMin').val(1);	 // 현재페이지
					$('#resultCnt').val(resultCnt);	 // 전체리스트수

                    var loopLimit = 0;
                    if(list > 0 ){
                        loopLimit = 30;
                        $('#btn_more').show();
                    }else{
                        loopLimit = resultCnt;
                        $('#btn_more').hide();
                    }

                    for( var i=0 ; i< loopLimit ; i++){ //페이지에 보여줄 리스트
                        var resultValue = result[i];

                        var histTpNm = "";
                        if ( resultValue.histTp == "SUS"){
                            histTpNm ="일시정지";
                        }
                        if( resultValue.histTp == "RSP"){
                            histTpNm ="일시정지해제";
                        }

                        var extDate = "";
                        if ( resultValue.extDate != null){
                            extDate = dateToYYYMMDD3(resultValue.extDate); //실행일
                        }

                        var rsnCdNm = resultValue.rsnCdNm; //사유명
                        if(resultValue.rsnCd != 'MS' && resultValue.rsnCd != 'ABW' && resultValue.rsnCd != 'ABT'){
                            susRsn ="일반";
                        } else {
                            susRsn = rsnCdNm;
                        }

                        $('#histLoation').append("<tr>"+"<td>"+phonNumber+"</td>"+"<td>"+histTpNm+"</td>"+"<td>"+extDate+"</td>" + "<td>"+susRsn+"</td>" + "</tr> ");
                    }

                    $('#divHistList').css('display','');
                    $('#histLoation').css('display','');
                    $('#divNoHist').css('display','none');
                    $('#divHistComment').css('display','');

                } else {	//보여줄 리스트가 없을 경우
                    $('#divHistList').css('display','none');
                    $('#divHistComment').css('display','none');
                    $('#divNoHist').css('display','');
                    $("#btn_more").hide();
                }
//                modalLayer.show('pause_history');
//                $('#btn_history').trigger('click');

            } else {
                callPop('<spring:message code="MSG.M10.MSG00005"/>');
            }

        break;

    }

}

/***********************************파일 업로드 rprs-auth.jsp용 *********************************************/

//파일 신청시 채번
function getApplSeqNo(){

    console.log("getApplSeqNo");

	fn_transCall("/info/stop/getApplSeqNo", {}, getApplSeqNo_callBack);
}

function getApplSeqNo_callBack(tranId, data, status, inputData){
	 switch(tranId){
        case 'getApplSeqNo' :

            $('#applSeqNo').val(data.applSeqNo);
            insertFileInfo();

		break;

	}

}

//증빙서류저장 및 일반신청예약변경
function insertFileInfo(){

	console.log("insertFileInfo");
	var data =  JSON.parse($("#userMajorSvc").attr("data-map").replace(/'/gi, "\""));

	//var custNm = $('div.additiontop_wrap > div > ul > li.phone_user> span').text();
	var CM559CustInfo = JSON.parse($("#CM559CustInfo").val());
	var custNm = fnUnSign(CM559CustInfo.custNm); //kje.

	var phdYn = "";
	var strArry = $('#btn_StopReleaseList').val().split(',');
	var commonCode =strArry[0];

	if( $(':input:radio[name = pause_item]:checked').val() == 'all'){
		phdYn="Y,Y";
	} else {
		phdYn="N,Y";
	}

	//ini 파일저장 정보
	$("#recpno").val( data.mvnoCtrtId );
	$("#custNm").val( custNm );
	$('#ctrtId').val( data.ctrtId );
	$('#regdt').val( $("#datepicker2").val().replace(/[.]/gi,'') );
	$('#bizcd').val( '2' );
	$("#oldApplSeqNo").val( data.applSeqNo );
	$("#susStrtDt").val( $("#datepicker2").val().replace(/[.]/gi,'') );
	$("#susEndDt").val( $("#datepicker").val().replace(/[.]/gi,'') );
	$('#sspnresn').val( $('#btn_StopReleaseList').text() );
	$("#cstmField4").val($('#susStrtDt').val()+","+$('#susEndDt').val());
	$("#cstmField5").val(phdYn+","+$("#selNum").val());
	$('#sspnresnCd').val(commonCode);
	$('#sspnterm').val( $("#datepicker").val().replace(/[.]/gi,''));
	if($('#fileList').text() !=""){
		$('#uploadSelectForm').ajaxSubmit({
			url : "/info/stop/changeFileInsertAction",
			type: "POST",
			enctype:"multipart/form-data",
			dataType : 'json',
			beforeSend : function(xhr, set) {
                let token = $("meta[name='_csrf']").attr("content");
                let header = $("meta[name='_csrf_header']").attr("content");
                xhr.setRequestHeader(header, token);
            },
			processData : false,
			contentType : false,
			cache: false,
			timeout:600000,
			success: function(data){
				if(data.fileUpload == true){
					callConfirmPop($("#datepicker2").val()+'~'+$("#datepicker").val()+'까지 일시정지 신청되었습니다. <br> 검수 완료 후 일시정지 됩니다.',move);
				} else {

					callPop("일시정지가 정상적으로 신청되지 않았습니다. 다시 한번 일시정지를 신청해주세요.");
				}
			},
			error:function(request,status,error){
				callPop("일시정지가 정상적으로 신청되지 않았습니다. 다시 한번 일시정지를 신청해주세요.");
			}
		});

	} else {
		var info = 'applSeqNo='+ $('#applSeqNo').val();
		info = info + '&ctrtId='+ $('#ctrtId').val();
		info = info+  '&pymAcntId='+ $('#pymAcntId').val();
		info = info + '&sspnresnCd=' +$('#sspnresnCd').val();
		info = info + '&sspnresn=' +$('#sspnresn').val();
		info = info + '&cstmField4=' +$('#susStrtDt').val()+","+$('#susEndDt').val();

		fn_transCall("/info/stop/insertAppl.ajax", info, insertAppl_callBack);

	}
}

function insertAppl_callBack(tranId, data, status, inputData){
	 switch(tranId){
        case 'insertAppl.ajax' :

        if( data.result == true){
            sendLMCT000018("SUS");
        }
		break;
	}

}

//첨부파일 업로드 시
function imgUpload(e, a){

	var idex  = $('#imageIndex').val();
	var picId ='pic'+$('#imageIndex').val();
	var strArry = new Array();
	var check = "";
	var file = e.target.files[0];
	var file_kind = file.name.split(".")[1];
	var check_file_type = new Array();
	check_file_type = ['gif','jpg','png','jpeg','tiff','tif','bmp','raw','heif','heic',
	                   'GIF','JPG','PNG','JPEG','TIFF','TIF','BMP','RAW','HEIF','HEIC'];
	var emptyThumbnail = 0; //삭제후 이미지 추가시 썸네일 이미지 index 할당용

	var name = e.target.files[0].name;

	//동일 파일 비교를 위한 클릭 값
	if($('#imageIndex').val() >0){
		check = $('#file1_F'+$('#imageIndex').val()).val();
	} else {
		check = $('#file1').val();
	}

	// 이미지 외 파일 첨부 불가 , input의 accept 옵션은 디바이스 얼럿이 호출되어 사용하지않고 일단 첨부 받고 여기에서 return함;
	if(check_file_type.indexOf(file_kind)== -1){
	    callPop('이미지만 첨부할 수 있습니다. GIF, JPG, PNG, JPEG, TIFF, TIF, BMP, RAW, HEIF, HEIC');
        return;
	}

	var strArry1 =  $('#fileError').val().split(',');

	for (var j = 0 ; j < strArry1.length; j ++){ //파일명 비교
		var strArry3 = strArry1[j].split('\\');
		var strArry4 = check.split('\\');

        if(!navigator.userAgent.match(/iPhone/i) && name!="image.jpg" || !navigator.userAgent.match(/iPad/i) && name!="image.jpg"){

            if( 	strArry3[strArry3.length-1] == strArry4[strArry4.length-1] ){
                callPop('동일한 파일은 첨부할 수 없습니다. 다른 파일을 첨부해주세요.');
                return;
            }
        }
	}

	if($('#imageIndex').val() >0){
		$('#fileError').val($('#fileError').val()+','+ $('#file1_F'+$('#imageIndex').val()).val());
	} else {
		$('#fileError').val($('#fileError').val()+','+$('#file1').val());
	}
	if(file.size > 1024*1000*10){
		callPop('10MB이내의 사진 파일을 첨부해 주세요.');
		return;
	}

//	$('#imgCheckTime').text(dateToYYYMMDD2());	//첨부파일 등록 일시
//	$('#pause01').addClass('up');

	for (var i = 0 ; i < 5; i ++) {
		if ($('#imgDiv'+i).is(':empty') ){
			emptyThumbnail = i;
			break;
		}
	}

	var html = "<div class=\"img_area\" id='Rpic"+idex+"' onclick='imageDetail("+idex+");'>";
	    html += "<img id='pic"+idex+"' alt='"+a+"'/></div>";
	    html += "<a href='javascript:void(0);' class='btn_remove' onclick='imgDelete("+idex+");' '><span class='blind'>첨부된 파일 삭제</span></a>";

//	$('#imgDiv'+emptyThumbnail).append("<button type='button' class='btn_file_del' onclick='imgDelete("+idex+")'><span class='blind'>첨부파일삭제</span></button><a href='javascript:void(0);' id='Rpic"+idex+"' onclick='imageDetail("+idex+");' '><img id='pic"+idex+"' '' /></a> ");
	$('#imgDiv'+emptyThumbnail).append(html);
	$('#pic'+idex).attr('src', URL.createObjectURL(e.target.files[0]));

    $('#Rpic'+idex).parent().show();
	idex++;
	$('#imageIndex').val(idex);
	$('.file_item_group').attr('style','visibility:none');
	$('.file_item_group').show();

	$("#stopBtn").prop("disabled",false);

}


function imgDelete(number){
    console.log("imgDelete");
    var fileCnt = document.getElementById('fileList').childElementCount;
	var check = "";
	var Arry = new Array();

	if(number >0){
		check = $('#file1_F'+number).val();
	}else{
		check = $('#file1').val();
	}

	var strArry1 = $('#fileError').val().split(',');
	for (var j = 0; j < strArry1.length; j ++){
		if(strArry1[j] == check){
			strArry1[j] = "";
		}
		Arry[j] = strArry1[j];
	}

	$('#fileError').val(Arry);
	$('#Rpic'+number).parent().hide();  //썸네일 영역 숨김 처리 (imgDiv0~4)
	$('#Rpic'+number).parent().empty(); //썸네일 이미지 삭제 (imgDiv0~4)
	$('#imgRemove'+number).click();
	//$('#imgDiv'+number).hide();

}

//이미지 상세 보기
function imageDetail(number){

	console.log("imageDetail");
	var src = $('#pic'+number).attr("src");

	$('#previewImage').attr('src',src);
//	fullLayer.show('filePreviewLayer');

	$.ohyLayer({
        content:'#filePreviewLayer',
        dimAct:true,
        type:'photo',
    });
}

function fileError(data){

	console.log("fileError");
	$('#fileError').val(data);
}

function errorMsg(obj){
	console.log("errorMsg");
	if( obj.id == 'selNum'){
		if($('#selNum').val() != "" && chkmtelNo($('#selNum').val())== false){
			var strErr = "휴대폰번호를 정확히 입력해 주세요.";
			$('#divIdErr1').text(strErr);
			$('#divIdErr1').show();
			$("#divIdErr1").css('opacity','100');
//			$("#selNum").addClass('error');
			$("#selNum").focus();
		} else {
//			$('#divIdErr1').hide();
			$("#divIdErr1").css('opacity','0');
//			$("#selNum").removeClass('error');
		}
	}
}

/**************************** 파일 업로드 rprs-auth.jsp용 end************************************************/

