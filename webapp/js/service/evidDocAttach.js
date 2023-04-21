/**
 * 증빙서류첨부 관련 공통 스크립트
 * 
 */
$(function(){
	
		// 휴대폰 단말기 및 PC 구분 (5. 증빙서류 첨부)
		if( navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) ) {
			$('#otherCamera').detach();
			$('#pcFileUpload').detach();
		} else if( navigator.userAgent.match(/Android/i) ) {
			$('#iosCamera').detach();
			$('#pcFileUpload').detach();
		} else { //PC버전
			$('#iosCamera').detach();
			$('#otherCamera').detach();
		}
		
		$('#file1').MultiFile({
			max: 5, 
			maxfile: 10240, 
			maxsize: 102400,  
			STRING: { 
				remove : ''
			},
			list : '#fileList'
		});
		
		var pic = 0;
		$('#imageIndex').val(pic);
		 
		// 서류첨부 버튼 클릭
		$('#uploadBtn').click( function() {
			uploadBtnClick();
		});

});

//IOS 카메라권한체크 콜백
function callbackIosCameraAuth(dValue) {
	if(dValue == "Y"){
		if($('#imageIndex').val() > 0) {
            $('#file1_F'+$('#imageIndex').val()).click();
        } else {
            $('#file1').click();
        }
	}
}

function uploadBtnClick() {
	if($('#fileList .MultiFile-label').length == 5) {
		let option = {
            msg:"서류 첨부는 최대 5개까지 첨부 가능합니다.",
            titleUse : false,
            cfrmYn:false,
        };
        popalarm(option);
		return false;
	}
	
	//IOS의 경우 카메라 촬영 동의 체크
    if(getOsInfo() === 'ios_app'){
        callIosCameraAuth();
    }else{
        if($('#imageIndex').val() > 0) {
            $('#file1_F'+$('#imageIndex').val()).click();
        } else {
            $('#file1').click();
        }
    }
}

function uploadBtnClick3() {
	if($('#fileList .MultiFile-label').length == 3) {
		let option = {
            msg:"첨부는 최대 3개까지 첨부 가능합니다.",
            titleUse : false,
            cfrmYn:false,
        };
        popalarm(option);

		return false;
	}

	//IOS의 경우 카메라 촬영 동의 체크
    if(getOsInfo() === 'ios_app'){
        callIosCameraAuth();
    }else{
        if($('#imageIndex').val() > 0) {
            $('#file1_F'+$('#imageIndex').val()).click();
        } else {
            $('#file1').click();
        }
    }
}

// 첨부파일 업로드 시
function imgUpload(e, a) {
	var idex  = $('#imageIndex').val();
	var picId = 'pic'+$('#imageIndex').val();
	var strArry = new Array();
	var check = "";
	var flie = e.target.files[0];
	var emptyThumbnail = 0; //삭제후 이미지 추가시 썸네일 이미지 index 할당용

	var name = e.target.files[0].name;

	// 동일 파일 비교를 위한 클릭 값
	if($('#imageIndex').val() > 0){
		check = $('#file1_F'+$('#imageIndex').val()).val();
	} else{
		check = $('#file1').val();
	}

	var strArry1 = $('#fileError').val().split(',');

	for(var j = 0; j < strArry1.length; j++){ // 파일명 비교
		var strArry3 = strArry1[j].split('\\');
		var strArry4 = check.split('\\');
        if(!navigator.userAgent.match(/iPhone/i) && name!="image.jpg" || !navigator.userAgent.match(/iPad/i) && name!="image.jpg"){ // 아이폰 및 아이패드 사진촬영 시 image.jpg로만 들어와서 한장밖에 못올리는 관계로 해당 로직 추가

            if(strArry3[strArry3.length-1] == strArry4[strArry4.length-1]){

                let option = {
                    msg:"동일한 파일은 첨부할 수 없습니다. 다른 파일을 첨부해주세요.",
                    titleUse : false,
                    cfrmYn:false,
                };
                popalarm(option);
                return;
            }
        }

	}

	if($('#imageIndex').val() > 0){
		$('#fileError').val($('#fileError').val()+','+ $('#file1_F'+$('#imageIndex').val()).val());
	}else{
		$('#fileError').val($('#fileError').val()+','+$('#file1').val());
	}
	
	if(flie.size > 1024*1000*10) {
	    let option = {
            msg:"10MB이내의 사진 파일을 첨부해 주세요.",
            titleUse : false,
            cfrmYn:false,
        };
        popalarm(option);
		//popalarm('10MB이내의 사진 파일을 첨부해 주세요.', "info", false, "", "");
		return;
	}
	
	$('#imgCheckTime').text(dateToYYYMMDD2());	// 첨부파일 등록 일시
	$('#pause01').addClass('up');
	
	//$('#center').append("<div class='doc_bgimg_flow_inner' id='imgDiv"+idex+"'><a href='javascript:void(0);' id='Rpic"+idex+"' onclick='imageDetail("+idex+");' title='업로드된 파일을 확인합니다.''><img id='pic"+idex+"' '' /></a><button type='button' onclick='imgDelete("+idex+")'>delete</button></div>");
	for (var i = 0 ; i < 5; i ++) {
		if ($('#imgDiv'+i).is(':empty') ){
			emptyThumbnail = i; 
			break;
		}
	}	
	//$('#imgDiv'+emptyThumbnail).append("<button type='button' class='btn_file_del' onclick='imgDelete("+idex+")'><span class='blind'>첨부파일삭제</span></button><a href='javascript:void(0);' id='Rpic"+idex+"' onclick='imageDetail("+idex+");' '><img id='pic"+idex+"' '' /></a> ");
	//$('#imgDiv'+emptyThumbnail).append("<a href='javascript:void(0);' id='Rpic"+idex+"' onclick='imageDetail("+idex+");'><div class='img_area'><img id='pic"+idex+"' alt='"+a+"'/></div></a> <a href='javascript:void(0);' class='btn_remove' onclick='imgDelete("+idex+");' '><span class='blind'>첨부된 파일 삭제</span></a> ");
	$('#imgDiv'+emptyThumbnail).append("<div class='img_area' id='Rpic"+idex+"' onclick='imageDetail("+idex+");'><img id='pic"+idex+"' alt='"+a+"'/></div> <a href='javascript:void(0);' class='btn_remove' onclick='imgDelete("+idex+");' '><span class='blind'>첨부된 파일 삭제</span></a> ");
	$('#pic'+idex).attr('src', URL.createObjectURL(e.target.files[0]));

    //$('#imgDiv'+idex).show();
	$('#Rpic'+idex).parent().show();

	idex++;
	$('#imageIndex').val(idex);

}

// 선택된 첨부파일 삭제 
function imgDelete(number) {
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

// 이미지 상세 보기
function imageDetail(number) {
	var src = $('#pic'+number).attr("src");
	
	$('#previewImage').attr('src',src);
	//fullLayer.show('filePreviewLayer');

	$.ohyLayer({
        content:'#filePreviewLayer',
        dimAct:false,
        type:'photo',
    });
}

// DateFormat2
function dateToYYYMMDD2() {
	var d =new Date();
	var s =
		leadingZeros(d.getFullYear(),4)+'.'+leadingZeros(d.getMonth()+1,2)+'.'+leadingZeros(d.getDate(),2)+' ' + 		
		leadingZeros(d.getHours(),2)+':'+leadingZeros(d.getMinutes(),2)+':'+leadingZeros(d.getSeconds(),2);
	return s;
}

function leadingZeros(n,digits){
	var zero ='';
	n =n.toString();
	
	if(n.length < digits) {
		for(i =0 ;i <digits-n.length; i++)
			zero +='0';
	}
	return zero + n;
}

function fileError(data) {
	$('#fileError').val(data);
}


// 첨부파일 관련 초기화
function initAttachFile() {
	$('#imageIndex').val(0)
	$('#fileError').val("")
	$('#imgCheckTime').text("");
	$('#center').empty();
	$('#fileList').empty();
}