    /******************* jQuery 플러그인 *******************/
    /**
     * 디버깅을 위한 로그 출력
     * @param 출력메세지
     */ 
    (function($) {
        $.log = function(message) {
            if(window.console) {
                console.debug(message);
            } else {
                alert(message);
            }
        };
    })(jQuery); 
    
    const MN_BANK = function(){
    	function constructor() {
    		return MN_BANK();
    	} 
	    /**
	     * JAVA의 StringBuffer 기능 함수
	     */
	    function StringBuffer() { 
	        this.buffer = [];
	    }

	    StringBuffer.prototype.toString = function toString() {
	        return this.buffer.join("");
	    };
	    
	    StringBuffer.prototype.append = function append(str) {
	        this.buffer.push(str);
	        return this;
	    };
	    
	    /**
	     * replaceAll 함수
	     */
	    function fnReplaceAll(str, rep1, rep2) {
	        if( str == null || str == undefined || $.trim(str) == '' ){
	            return '';
	        }
	        return str.split(rep1).join(rep2);
	    }
	    
	    /**
	     * 콤마제거
	     * @param str
	     * @return 콤마 제거한 값
	     */
	    function fnRemoveComma(str) {
	        var rtnStr='';
	        for( var i=0;i<str.length;i++ ) {
	            if(str.substring(i, i+1)==",") continue;
	            rtnStr+=str.substring(i, i+1);
	        }
	        return rtnStr;
	    }
	    
	    /**
	     * 입력값의 공백을 제거후 반환(문자 사이의 공백도 포함)
	     * @param value
	     * @return 공백을 제거한 값
	     */
	    function fnRemoveSpace( value ) {
	        return value.replace(/\s+/g," ");
	    }
	    
	    /**
	     * 페이지 이동함수 공통
	     * @param pPageNo[이동할 페이지 번호]
	     * @param pFormId[파라미터가 포함된 폼 아이디]
	     * 사용예) fn_goPage(페이지번호, 폼아이디)
	     */
	    function fn_goPage( pPageNo , pFormId ){
	    	// 5.2.0 내부오픈을 위한 메뉴 링크 변경
	    	if (pPageNo == "C051019") {
	    		if (true/*compareVersion(device.appVersion, "5.2.0") >= 0*/) {
	    			pPageNo = "C062048";
	    		}
	    	}

	    	var pageNo = '';
	        if( pPageNo === undefined || $.trim(pPageNo) == '' ){
	            return false;
	        }else{
	            pageNo = pPageNo;
	        }
	        
	        var param = null;
	        if( pFormId ){
	            if( pFormId !== undefined && $.trim(pFormId) != '' ){
	                param = $("#"+pFormId).serializeJSON();
	            }
	        }
	        
	        // 파라미터 없을때 , 에러 방지위해 임시폼 생성
	        if( param == null ){
	            $("<form id='empty_frm' name='empty_frm' onsubmit='return false;' />").appendTo("body");
	            $("#empty_frm").append("<input type='hidden' name='t' value='"+new Date().getTime()+"' />");
	            param = $("#empty_frm").serializeJSON();
	            $("#empty_frm").remove();
	        }

	        window.navi.navigate('/mquics?page='+pageNo, param, function(){});
	        pageNo = '';
	        param = null;
	        return false;
	    }
	    
	    /**
	     * 페이지 이동함수2 공통
	     * @param pPageNo[이동할 페이지 번호]
	     * @param pFormId[파라미터가 포함된 폼 아이디]
	     * 사용예) fn_goPageWith(페이지번호, 폼아이디)
	     * 메뉴이동이 히스토리 삭제함
	     */
	    function fn_goPageWith( pPageNo , pFormId ){
	        var pageNo = '';
	        if( pPageNo === undefined || $.trim(pPageNo) == '' ){
	            return false;
	        }else{
	            pageNo = pPageNo;
	        }
	        
	        var param = null;
	        if( pFormId ){
	            if( pFormId !== undefined && $.trim(pFormId) != '' ){
	                param = $("#"+pFormId).serializeJSON();
	            }
	        }
	        
	        // 파라미터 없을때 , 에러 방지위해 임시폼 생성
	        if( param == null ){
	            $("<form id='empty_frm' name='empty_frm' onsubmit='return false;' />").appendTo("body");
	            $("#empty_frm").append("<input type='hidden' name='t' value='"+new Date().getTime()+"' />");
	            param = $("#empty_frm").serializeJSON();
	            $("#empty_frm").remove();
	        }

	        window.navi.navigateWithInit('/mquics?page='+pageNo, param, function(){});
	        pageNo = '';
	        param = null;
	        return false;
	    }
	    
	    /**
	     * 페이지 이동함수2 공통
	     * @param pPageNo[이동할 페이지 번호]
	     * @param pFormId[파라미터가 포함된 폼 아이디]
	     * 사용예) fn_goPageWith(페이지번호, 폼아이디)
	     * 메뉴이동이 히스토리 삭제함
	     */
	    function fn_goPageWithClose( pPageNo , pFormId ){
	        var pageNo = '';
	        if( pPageNo === undefined || $.trim(pPageNo) == '' ){
	            return false;
	        }else{
	            pageNo = pPageNo;
	        }
	        
	        var param = null;
	        if( pFormId ){
	            if( pFormId !== undefined && $.trim(pFormId) != '' ){
	                param = $("#"+pFormId).serializeJSON();
	            }
	        }
	        
	        // 파라미터 없을때 , 에러 방지위해 임시폼 생성
	        if( param == null ){
	            $("<form id='empty_frm' name='empty_frm' onsubmit='return false;' />").appendTo("body");
	            $("#empty_frm").append("<input type='hidden' name='t' value='"+new Date().getTime()+"' />");
	            param = $("#empty_frm").serializeJSON();
	            $("#empty_frm").remove();
	        }

	        window.navi.navigateWithClose('/mquics?page='+pageNo, param, function(){});
	        pageNo = '';
	        param = null;
	        return false;
	    }
	    
	    /**
	     * 상품의 약관 및 사용설명서 전체 다운로드 함수
	     * @param pDownUrl (구분자 , 해서 여러개의 다운로드 url 구성)
	     * 예) encodeURI(strUrl),encodeURI(strUrl),encodeURI(strUrl)
	     */
	    function fn_prdAllDownload( pDownUrl ){
	        if( "android" == window.COMMON.getUserAgent() ){
	            window.AppInfoManager.requestFileDownload(pDownUrl);
	        }
	        return false;
	    }
	    
	    /**
	     * 상품설명서 PDFView 함수
	     * @param down_num 다운번호
	     * @param file_nm 서식논리파일명
	     * @param formDocNo 서식일련번호
	     * 
	     */
	    function fn_callPrdManualpdfView( down_num , file_nm , formDocNo ){
	        var strHttp = kbstarCommon._PDF_DOMAIN;
	        var strUrl  = strHttp + "/mquics?asfilecode=1034598&QSL=F&_FILE_NAME="+file_nm+"&_LANG_TYPE=KOR&" + formDocNo;
	        window.AppInfoManager.openPdfViewer(encodeURI(strUrl));
	        return true;
	    }
	    
	    /**
	     * 외환상품설명서 PDFView 함수
	     * @param down_num 다운번호
	     * @param file_nm 서식논리파일명
	     * @param formDocNo 서식일련번호
	     * 
	     */
	    function fn_callFxPrdManualpdfView( down_num , file_nm , formDocNo ){
	    	//7.29 뱅킹과 구현 방식이 달라 추가
	    	var strHttp = kbstarCommon._PDF_DOMAIN;
	    	var strUrl  = strHttp + "/mquics?asfilecode=1034598&QSL=F&_FILE_NAME="+file_nm+"&_LANG_TYPE=KOR&formDocNo=" + formDocNo;
	    	window.AppInfoManager.openPdfViewer(encodeURI(strUrl));
	        return true;
	    }
	    
	    
	    /**
	     * checkBox의 name에 해당하는 전체 체크 결과를 반환.
	     * @param tgtNameObj check box의 name 객체 
	     *   예) document.IBF.doc , $("input[name='doc']")
	     * @return true(전체체크) , false(그외)
	     */
	    function fn_allCheckedBoolean( tgtNameObj ) {
	        var checkFlg = true;
	        $(tgtNameObj).each(function () {
	            if( ! $(this).is(':checked') ) {
	                checkFlg = false;
	                return false; // break . return true:continue
	            }
	        });
	        return checkFlg;
	    }
	    
	    /**
	     * checkBox의 name에 해당하는 객체의 disabled="disabled" 를 해제함
	     * @param tgtNameObj check box의 name 객체 
	     *   예) document.IBF.doc , $("input[name='doc']")
	     */
	    function fn_allDisableCancel( tgtNameObj ) {
	        $(tgtNameObj).each(function () {
	            $(this).attr("disabled",false);
	        });
	    }
	    
	    // oApprovalCertification.jsp 에서 사용하던 uf_submit() 구현 함수 시작 =========
	    /**
	     * uf_submitMbank
	     * ( oApprovalCertification.jsp 에서 사용하던 uf_submit() )
	     * @param   hi_encryptData      전자서명_값_목록
	     *          hi_encryptData2     전자서명_파라미터_목록
	     *          hi_encryptData3     전자서명_라벨_목록
	     *          targetPage          본거래페이지 
	     * @return 
	     *          signed_msg
	     */ 
	    function uf_submitMbank(){
	        try{
	            var f = document.IBF;
	            f.submitted = false;
	            if (!f.submitted) {
	                f.submitted = true;
	                
	                // 보안 매체 태그 적용 (추가인증 적용시)
	                if(!caqtel.aprovalValdn()) {
	                    return; 
	                }    
	                
	                // opt또는 보안카드 스크립트 처리 함수 
	                try{
	                    if (!checkSubmitSecurity()) {
	                        f.submitted = false;
	                        return;
	                    }
	                }catch(e){
	                }
	                
	                // 승인전화체크 스크립트 처리 함수
	                try{
	                    if (!fnCheckTelAthor()) {
	                        f.submitted = false;
	                        return;
	                    }
	                }catch(e){
	                }
	            }
	            
	            //전자서명
	            if (checkSubmitSecurity()) {
	                var signedKeys      =  document.IBF.elements['hi_encryptData2'].value; 
	                var signedLabels    =  document.IBF.elements['hi_encryptData3'].value;
	                try{
	                	window.COMMON.caq_doSign(signedKeys, signedLabels, uf_submitMbankCallback);
	                }catch(ex){
	                    alert('digiSign 에러=>'+ex);
	                }
	            }
	        }catch(ex){
	            alert(ex.name+":"+ex.message);
	            f.submitted = false;
	        }
	    }

	    function uf_submitMbankCallback() {
	        var f = document.IBF;
	        if($("input[name=signed_msg]")[0].value.length != 0){
	            //앱난독화솔루션(Appsuit) 적용 후 일부 저사양 폰에서 이체성 거래 시 전자서명창 입력 후 기존 화면 전환이 느려져서 확인 버튼 중복으로 누르는 현상 개선
	            $(".btn_center").hide();
	            var form = $("#IBF").serializeJSON();
	            window.navi.navigate('/mquics?page='+ $("[name=targetPage]").val(), form, caq.error.callBackSecureErr);
	        } 
	    }    
	    
	    function CertManager31(){
	    	var f = document.IBF;
	        alert('uf_submitMbankCallback 111');
	        if($("input[name=signed_msg]")[0].value.length != 0){
	            //앱난독화솔루션(Appsuit) 적용 후 일부 저사양 폰에서 이체성 거래 시 전자서명창 입력 후 기존 화면 전환이 느려져서 확인 버튼 중복으로 누르는 현상 개선
	            $(".btn_center").hide();
	            var form = $("#IBF").serializeJSON();
	            alert('uf_submitMbankCallback 222');
	            window.navi.navigate('/mquics?page='+ $("[name=targetPage]").val(), form, caq.error.callBackSecureErr);
	        }
	    }
	   
	    
	    // oApprovalCertification.jsp 에서 사용하던 uf_submit() 구현 함수 끝 =========
	    
	    // #################### 이메일 발송 구현 함수 시작 #################### 
	    /**
	     * 이메일 주소형식 체크결과를 반환하는 함수
	     * @param objEmail 체크할 이메일 값
	     * @return boolean 체크결과[true:이메일 형식 , false : 이메일 형식 아님]
	     */
	    function fn_mobileEmailValidation( objEmail ) {
	        var reEmailChk = false;
	        var strEmail   = objEmail;

	        if( strEmail != null && strEmail != "" ) {
	            // 이메일 체크
	            reEmailChk = strEmail.search(/^\s*[\w\~\-\.]+\@[\w\~\-]+(\.[\w\~\-]+)+\s*$/g)>=0;
	            if( ! reEmailChk ) {
	                alert("이메일 주소가 올바르지 않습니다.");
	            }
	        }
	        return reEmailChk;
	    }
	    
	    /**
	     * 이메일 전송 성공후 호출 함수
	     *
	     */
	    function successCall_email(data) {
	        try{
	            var obj = data;
	            document.IBF.elements["전송결과"].value = obj.data.msg.servicedata.전송결과;
	            alert( obj.data.msg.servicedata.이메일주소+' 로 '+obj.data.msg.servicedata.받는사람명+' 님에게 이메일 발송이 완료되었습니다.\n네트워크상황에 따라 도착하는데 시간이 소요될 수 있습니다.' );
	            obj = null;
	        }catch(e){
	            alert("successCall_email : "+e);
	        }
	        return false;
	    }
	    
	    /**
	     * 이메일 전송 실패후 호출 함수
	     *
	     */
	    function failCall_email(data) {
	        try{
	            // param ( Json 데이터  , QAction 사용여부 , 팝업화면 여부 , 확인 버튼 show 여부   ) 
	            //caq_commonError( data , 'Y' , 'N');
	        }catch(e){
	            alert("failCall_email : "+e);
	        }
	        return false;
	    }
	    
	    /**
	    '이메일로 받기' 버튼 클릭시 동작 함수
	    */
	    function fn_sendEmailCheck(){
	        if( ! $('#emailchk').is(':checked') ) {
	            alert('이메일 주소로 받기 를 선택하여 주십시오');
	        }else{
	            // UserPreference 정보 가져오기
	            window.UserPreference.getValue(successCall_UserPreference, failCall_UserPreference, "userName");
	        }
	        return false;
	    }
	    
	    /**
	     * UserPreference 정보성공후 이메일 전송 호출 함수
	     */
	    function successCall_UserPreference(data) {
	    	try{
	            document.IBF.elements["받는사람명"].value = data;
	            // 이메일 보내기
	            sendEmail();
	        }catch(e){alert("successCall_UserPreference catch "+e);}
	        return false;
	    }
	    
	    /**
	     * UserPreference 정보성공 호출 함수
	     */
	    function failCall_UserPreference(data) {
	        try {
	            
	        }catch(e){alert("failCall_UserPreference catch "+e);}
	        return false;
	    }
	    
	    /**
	     * 약관 이메일 발송 함수
	     */
	    function sendEmail() {
	        if( document.IBF.elements["받는사람명"].value == "" ){
	            // UserPreference 정보 가져오기
	            window.UserPreference.getValue(function(data){document.IBF.elements["받는사람명"].value = data;}, function(){}, "userName");
	        }

	        if( document.IBF.elements["받는사람이메일주소"].value == "" ){
	            alert("받는사람이메일주소를 입력하세요");
	            document.IBF.elements["txt_email_id"].focus();
	            return false;
	        }else{
	            if( confirm(document.IBF.elements["받는사람이메일주소"].value+ " 로 상품설명서 및 약관을 이메일로 받으시겠습니까?") ){
	                if( ! fn_mobileEmailValidation(document.IBF.elements["받는사람이메일주소"].value) ){
	                    document.IBF.elements["txt_email_id"].focus();
	                    return false;
	                }

	                var param = $("#IBF").serializeJSON();
	                kbstar.connect.request('/mquics?QAction=1034602&page='+ kbstarCommon.asisPageInfo,param, successCall_email, failCall_email, true);
	            }
	        }
	    }
	    // #################### 이메일 발송 구현 함수 끝 ####################
	    
	    /**
	     * 공통에러처리 함수
	     * @param data        :  error Json 데이터 
	     * @param qActionYn   : QAction 사용여부             [ 'N' : 미사용 , 'Y' : 사용]
	     * @param errorpopup  : 팝업화면 여부                [ 팝업아님 : 'N' , 팝업 : 'Y' ]
	     * @param errorbutton : 확인 또는 닫기 버튼 show 여부 [ 'N' : 안보임 , 'Y' : 보임 ]  
	     *                      , 그외 : QAction 과는 별도로 에러화면 닫힌후 , 그화면에 그대로 남아있을때 '0' 셋팅
	     * 
	     * ※ 'QAction 사용여부' 가 'Y' 인경우에는 , errorbutton 셋팅 안해도 됨
	     * 예) caq_commonError( data , 'Y' );
	     * 
	     */
	    function caq_commonError( data , qActionYn , errorpopup , errorbutton ) {
	        if( qActionYn == 'N' ){
	            if( errorbutton == 'N' ){
	                data.msg.common.errorbutton = '0'; // 확인 또는 닫기 버튼 show 여부 [ 0 : 숨기기 , 1: 노출 (default)] - QAction 사용시 '0' 설정
	            }
	        }else{
	            data.msg.common.errorbutton = '0'; // 확인 또는 닫기 버튼 show 여부 [ 0 : 숨기기 , 1: 노출 (default)] - QAction 사용시 '0' 설정
	        }
	        
	        if( errorpopup == 'Y' ){
	            data.msg.common.errorpopup  = '1'; // 팝업화면인 경우 설정[ 0 : 팝업아님(default) , 1 :팝업화면 ]
	        }

	        // 에러메세지 템플릿 호출함수
	        caq.error.caq_printError(data);
	    }
	    
	    function formatCurrency(num) {
	        var numData = "";
	        var startRealNum = 0;
	        var sign = "";//양수[],음수[-]
	        numData = num;
	        numData = numData.toString().replace(/\$|\,/g,'');

	        if(isNaN(numData)) {
	            numData = num;
	            return "";
	        }

	        if(numData.substring(0,1)=="-"){
	            sign="-";
	            numData=numData.substring(1);
	        }

	        //소숫점 및 "000.." 제거
	        for(var i=0;i<numData.length;i++){
	            if(numData.charAt(i)!='0'){
	                break;
	            }
	            startRealNum++;
	        }

	        if(numData.length!=1&&startRealNum>0){
	            if(numData.charAt(startRealNum)=='.'){
	                numData = numData.substring(startRealNum-1);
	            }else{
	                numData = numData.substring(startRealNum);
	            }
	        }

	        //소숫점 제거
	        if(numData.charAt(0)=="."){
	            numData="0."+numData.substring(1);
	        }

	        tmpNum=numData.split('.');
	        if(tmpNum.length==1){
	            numData=tmpNum[0];
	            cents="";
	        }else if(tmpNum.length==2){
	            numData =tmpNum[0];
	            cents   =tmpNum[1];
	        }else{
	            return "";
	        }

	        for (var i = 0; i < Math.floor((numData.length-(1+i))/3); i++)
	            numData = numData.substring(0,numData.length-(4*i+3))+','+numData.substring(numData.length-(4*i+3));

	        if(cents==""){
	            return sign+numData;
	        }else{
	            return sign+(numData + "." + cents);
	        }   
	    }
	    
	    /*
	    권유직원 Layer 생성 함수
	    */
	    function setEmpNoTag(jsonData) {
	        param = new Object();
	        param.FORM_NAME         = "IBF";
	        param.TAG_TYPE          = WebEtcTag.TAG_EMPNO; //* 직원번호조회입력
	        param.TARGET_ELEMENT_ID = "id_empno";          //* 직원번호입력 태그 위치 ID(2번에서 생성한 빈 div id)

	        WebEtcTag.setEmpNoTagData(jsonData);
	        WebEtcTag.loadData(param);
	    }
	    
	    /**
	     * 시작일과 종료일이 있고, 종료일을 기준으로 시작일을 해당 interval만큼 계산해서 세팅한다.
	     * 0  : 3일전
	     * 1  : 1주일 전
	     * 2  : 1개월 전
	     * 3  : 3개월 전
	     * 4  : 1년전
	     * 5  : 3년전
	     * 6  : 5년전
	     * 7  : 당일
	     * 8  : 6개월 전
	     * 9  : 18개월 전
	     * 10 : 24개월 전
	     * 11 : 9개월 전
	     */
	    function MBK_ChangeDate(type, sDayObj, eDayObj){
	        var todayDate = eDayObj.val();
	        var strDate = new Date(); 
	        var temp_y = strDate.getFullYear();
	        var temp_m = strDate.getMonth()+1;

	        if(temp_m < 10){
	            temp_m = "0" + temp_m;
	        }

	        var temp_d = strDate.getDate();

	        if(temp_d.length = 1){
	            temp_d = "0" + temp_d;
	        }

	        var returnDate = "" + temp_y + temp_m + temp_d;
	        
	        if(showConvert(0, todayDate).length != 8) {
	            todayDate = showConvert(1, returnDate);
	            eDayObj.val(todayDate);
	            sDayObj.val(showConvert(1, getshiftDate(type, showConvert(0, eDayObj.val()))));
	        } else {
	            sDayObj.val(showConvert(1, getshiftDate(type, showConvert(0, todayDate))));
	            if(type=="7"){
	                 eDayObj.val(showConvert(1, getshiftDate(type, showConvert(0, todayDate))));
	            }
	        }
	    }

	    /**
	     *  인자로 받은 문자를 원하는 문자로 변환하여 RETURN한다.
	     *  type == 0 (-->) ex)yyyy.MM.dd 의 형식을 yyyyMMdd로 변환한다. 
	     *  type == 1 (-->) ex)yyyyMMdd 의 형식을 yyyy.MM.dd로 변환한다.
	     *  (2013.08.13)
	     */
	    function showConvert(type, strData){
	        var strValue = "";

	        if(type == 0){
	            strValue = strData.substr(0,4) + strData.substring(5,7) + strData.substring(8,10); 
	        }else if(type == 1){
	            strValue = strData.substr(0,4) + "." + strData.substr(4,2) + "." + strData.substr(6,2);
	        }
	        return strValue;
	    }

	    /**
	     * 시작일과 종료일이 있고, 종료일을 기준으로 시작일을 해당 interval만큼 계산해서 세팅한다.
	     * 0  : 3일전
	     * 1  : 1주일 전
	     * 2  : 1개월 전
	     * 3  : 3개월 전
	     * 4  : 1년전
	     * 5  : 3년전
	     * 6  : 5년전
	     * 7  : 당일
	     * 8  : 6개월 전
	     * 9 : 18개월 전
	     * 10 : 24개월 전
	     * 11 : 9개월 전
	     */
	    function getshiftDate(type, dt){
	        var retVal = "" ;
	        var i = parseInt(type);
	        
	        switch(i) {
	            case 0:
	                retVal = shiftDate(dt, 0, 0, -3 );
	                break;  
	            case 1:
	                retVal = shiftDate(dt, 0, 0, -6 );
	                break;
	            case 2:           
	                retVal = shiftDate(dt, 0, -1, 1 );
	                break;
	            case 3: 
	                retVal = shiftDate(dt, 0, -3, 1 );
	                break;
	            case 4:
	                retVal = shiftDate(dt, -1, 0, 1 );
	                break;
	            case 5:
	                retVal = shiftDate(dt, -3, 0, 1 );
	                break;
	            case 6:
	                retVal = shiftDate(dt, -5, 0, 1 );
	                break;
	            case 7:
	                retVal = shiftDate(dt, 0, 0, 0 );
	                break;
	            case 8:
	                retVal = shiftDate(dt, 0, -6, 1 );
	                break;
	            case 9:
	                retVal = shiftDate(dt, 0, -18, 1 );
	                break;
	            case 10:
	                retVal = shiftDate(dt, -2, 0, 1 );
	                break; 
	            case 11:
	                retVal = shiftDate(dt, 0, -9, 1 );
	                break; 
	        }
	        return retVal ;
	    }   
	    
	    /**
	     *    날짜를 y, m, d만큼 이동해서 리턴 (dt : YYYYMMDD(문자열), 리턴타입 : YYYYMMDD)
	     *    y, m, d : +는 주어진 날짜를 앞으로 이동(더하기), -는 주어진 날짜를 뒤로 이동(빼기)
	     *    (2002.06.08) 버그수정
	     *    클라이언트 날짜(스크립트 org_dt)과 서버 날짜(dt)가 다를 경우 날짜오류발생, 서버시간 기준으로 소스 수정 (이근준, 2014.4.15)
	     */
	    function shiftDate(dt,y,m,d){
	        var yy = dt.substr(0, 4);
	        var mm = dt.substr(4, 2);
	        var dd = dt.substr(6, 2);
	        var org_dt = new Date(yy,mm-1,dd); // 서버날짜로 세팅

	        //var org_dt = new Date();  //<- 이것은 클라이언트(고객pc 브라우저) 날짜로 세팅(해외인경우 시차로 인한 해외날짜로 세팅되어 오류야기)
	        //org_dt.setYear(yy);
	        //org_dt.setMonth(mm-1);
	        //org_dt.setDate(dd);

	        var new_dt = org_dt;

	        new_dt.setDate(org_dt.getDate() + d);
	        new_dt.setMonth(new_dt.getMonth() + m);
	        new_dt.setYear(new_dt.getFullYear() + y);
	        var n_yy  = new_dt.getFullYear();
	        var n_mm = new_dt.getMonth()+1;
	        var n_dd   = new_dt.getDate();
	        
	        if(y=="0" && m=="0" && d=="0"){
	            var org_dt2 = new Date();
	            n_yy = org_dt2.getFullYear();
	            n_mm = org_dt2.getMonth()+1;
	            n_dd = org_dt2.getDate();
	        }
	        
	        if (("" + n_mm).length == 1)     { n_mm = "0" + n_mm;     }
	        if (("" + n_dd).length   == 1)     { n_dd = "0" + n_dd;  }
	        return ""+n_yy+n_mm+n_dd;
	    }

	    /**
	     *    달력 view
	     *    targetId
	     *    datdId
	     *    popId
	     *    val
	     */
	    function MBK_ViewCalendar1(dateId, val){
	        var param = new Object();
	        param.TAG_TYPE = WebEtcTag.TAG_CALENDAR;
	        param.TARGET_ELEMENT_ID = "id_calendar1";       //날짜입력 태그 위치 ID
	        param.INPUT_DATE_ID = dateId;                           //날짜 ID
	        param.DIV_POPUP_CAL_ID = "startdate_cal";          //달력 ID
	        param.DEF_YMD_VALUE = val;                             //기본표시날짜.(빈값이면 당일, "none"인 경우 공란처리)

	        WebEtcTag.loadData(param);
	    }
	    
	        /**
	     *    달력 view
	     *    targetId
	     *    datdId
	     *    popId
	     *    val
	     */
	    function MBK_ViewCalendar1(dateId, val, deftitlevalue){
	        var param = new Object();
	        param.TAG_TYPE = WebEtcTag.TAG_CALENDAR;
	        param.TARGET_ELEMENT_ID = "id_calendar1";   //날짜입력 태그 위치 ID
	        param.INPUT_DATE_ID = dateId;                       //날짜 ID
	        param.DIV_POPUP_CAL_ID = "startdate_cal";       //달력 ID
	        param.DEF_YMD_VALUE = val;                          //기본표시날짜.(빈값이면 당일, "none"인 경우 공란처리)
	        param.DEF_TITLE_VALUE = deftitlevalue;            //기본TITLE.(빈값이면 "날짜 입력"처리)
	        
	        WebEtcTag.loadData(param);
	    }
	    
	    /**
	     *    달력 view 2
	     *    targetId1, target2
	     *    datdId1, dateId2
	     *    popId1, popId2
	     *    val1, val2
	     */
	    function MBK_ViewCalendar2(dateId1, val1, dateId2, val2){
	        var param1 = new Object();
	        param1.TAG_TYPE = WebEtcTag.TAG_CALENDAR;
	        param1.TARGET_ELEMENT_ID = "id_calendar1";  //날짜입력 태그 위치 ID
	        param1.INPUT_DATE_ID = dateId1;     //날짜 ID
	        param1.DIV_POPUP_CAL_ID = "startdate_cal";      //달력 ID
	        param1.DEF_YMD_VALUE = val1;            //기본표시날짜.(빈값이면 당일, "none"인 경우 공란처리)

	        WebEtcTag.loadData(param1);
	        
	        var param2 = new Object();
	        param2.TAG_TYPE = WebEtcTag.TAG_CALENDAR;
	        param2.TARGET_ELEMENT_ID = "id_calendar2";  //날짜입력 태그 위치 ID
	        param2.INPUT_DATE_ID = dateId2;     //날짜 ID
	        param2.DIV_POPUP_CAL_ID = "enddate_cal";        //달력 ID
	        param2.DEF_YMD_VALUE = val2;            //기본표시날짜.(빈값이면 당일, "none"인 경우 공란처리)

	        WebEtcTag.loadData(param2);
	    }
	    
	        /**
	     *    달력 view 2
	     *    targetId1, target2
	     *    datdId1, dateId2
	     *    popId1, popId2
	     *    val1, val2
	     */
	    function MBK_ViewCalendar2(dateId1, val1, dateId2, val2, deftitlevalue1, deftitlevalue2){
	        var param1 = new Object();
	        param1.TAG_TYPE = WebEtcTag.TAG_CALENDAR;
	        param1.TARGET_ELEMENT_ID = "id_calendar1";  //날짜입력 태그 위치 ID
	        param1.INPUT_DATE_ID = dateId1;     //날짜 ID
	        param1.DIV_POPUP_CAL_ID = "startdate_cal";      //달력 ID
	        param1.DEF_YMD_VALUE = val1;            //기본표시날짜.(빈값이면 당일, "none"인 경우 공란처리)
	        param1.DEF_TITLE_VALUE = deftitlevalue1;            //기본TITLE.(빈값이면 "날짜 입력"처리)

	        WebEtcTag.loadData(param1);
	        
	        var param2 = new Object();
	        param2.TAG_TYPE = WebEtcTag.TAG_CALENDAR;
	        param2.TARGET_ELEMENT_ID = "id_calendar2";  //날짜입력 태그 위치 ID
	        param2.INPUT_DATE_ID = dateId2;     //날짜 ID
	        param2.DIV_POPUP_CAL_ID = "enddate_cal";        //달력 ID
	        param2.DEF_YMD_VALUE = val2;            //기본표시날짜.(빈값이면 당일, "none"인 경우 공란처리)
	        param2.DEF_TITLE_VALUE = deftitlevalue2;            //기본TITLE.(빈값이면 "날짜 입력"처리)
	        WebEtcTag.loadData(param2);
	    }
	    
	    /**
	     *    달력 view 3
	     *    targetId1, target2
	     *    datdId1, dateId2
	     *    popId1, popId2
	     *    val1, val2
	     */
	    function MBK_ViewCalendar3(dateId1, val1, targetId1, dateId2, val2, targetId2){
	        var param1 = new Object();
	        param1.TAG_TYPE = WebEtcTag.TAG_CALENDAR;
	        param1.TARGET_ELEMENT_ID = targetId1;   //날짜입력 태그 위치 ID
	        param1.INPUT_DATE_ID = dateId1;     //날짜 ID
	        param1.DIV_POPUP_CAL_ID = "startdate_cal";      //달력 ID
	        param1.DEF_YMD_VALUE = val1;            //기본표시날짜.(빈값이면 당일, "none"인 경우 공란처리)

	        WebEtcTag.loadData(param1);
	        
	        var param2 = new Object();
	        param2.TAG_TYPE = WebEtcTag.TAG_CALENDAR;
	        param2.TARGET_ELEMENT_ID = targetId2;   //날짜입력 태그 위치 ID
	        param2.INPUT_DATE_ID = dateId2;     //날짜 ID
	        param2.DIV_POPUP_CAL_ID = "enddate_cal";        //달력 ID
	        param2.DEF_YMD_VALUE = val2;            //기본표시날짜.(빈값이면 당일, "none"인 경우 공란처리)

	        WebEtcTag.loadData(param2);
	    }
	    
	        /**
	     *    달력 view 3
	     *    targetId1, target2
	     *    datdId1, dateId2
	     *    popId1, popId2
	     *    val1, val2
	     */
	    function MBK_ViewCalendar3(dateId1, val1, targetId1, dateId2, val2, targetId2, deftitlevalue1, deftitlevalue2){
	        var param1 = new Object();
	        param1.TAG_TYPE = WebEtcTag.TAG_CALENDAR;
	        param1.TARGET_ELEMENT_ID = targetId1;   //날짜입력 태그 위치 ID
	        param1.INPUT_DATE_ID = dateId1;     //날짜 ID
	        param1.DIV_POPUP_CAL_ID = "startdate_cal";      //달력 ID
	        param1.DEF_YMD_VALUE = val1;            //기본표시날짜.(빈값이면 당일, "none"인 경우 공란처리)
	        param1.DEF_TITLE_VALUE = deftitlevalue1;            //기본TITLE.(빈값이면 "날짜 입력"처리)

	        WebEtcTag.loadData(param1);
	        
	        var param2 = new Object();
	        param2.TAG_TYPE = WebEtcTag.TAG_CALENDAR;
	        param2.TARGET_ELEMENT_ID = targetId2;   //날짜입력 태그 위치 ID
	        param2.INPUT_DATE_ID = dateId2;     //날짜 ID
	        param2.DIV_POPUP_CAL_ID = "enddate_cal";        //달력 ID
	        param2.DEF_YMD_VALUE = val2;            //기본표시날짜.(빈값이면 당일, "none"인 경우 공란처리)
	        param2.DEF_TITLE_VALUE = deftitlevalue2;            //기본TITLE.(빈값이면 "날짜 입력"처리)

	        WebEtcTag.loadData(param2);
	    }
	    
	    /**
	     * 
	     *  Form To 달력 Tag - 스뱅 5.1 VI가이드 적용 
	     *
	     * @param dateId1{String} - 시작일 Input Tag ID
	     *         , val1{String} - 시작일 Input Default Value 
	     *         , targetId1{String} - 시작일태그 위치 ID
	     *         , defTitle1{String} - 시작일 접근성 버튼 태그안에 Span 내용
	     *         , callback1{String} - 시작일 달력버튼 CallBack 함수명
	     *         , dateId2{String}   - 종료일 Input Tag ID
	     *         , val2{String}      - 종료일 Input Default Value 
	     *         , targetId2{String} - 종료일태그 위치 ID
	     *         , defTitle2{String} - 종료일 접근성 버튼 태그안에 Span 내용
	     *         ,callback2{String}  - 종료일 달력버튼 CallBack 함수명
	     * @return N/A
	     */
	    function MBK_ViewCalendar3_BTN(dateId1, val1, targetId1, defTitle1 , callback1 , dateId2, val2, targetId2 , defTitle2 ,callback2 ){
	        var param1 = new Object();
	        param1.TAG_TYPE = WebEtcTag.TAG_CALENDAR;
	        param1.TARGET_ELEMENT_ID = targetId1;   //날짜입력 태그 위치 ID
	        param1.INPUT_DATE_ID = dateId1;     //날짜 ID
	        param1.DIV_POPUP_CAL_ID = "startdate_cal";      //달력 ID
	        param1.DEF_YMD_VALUE = val1;            //기본표시날짜.(빈값이면 당일, "none"인 경우 공란처리)
	        param1.BTN_YN = "Y";
	        param1.CALLBACK = callback1;
	        param1.DEF_TITLE_VALUE = defTitle1;
	        
	        WebEtcTag.loadData(param1);
	        
	        var param2 = new Object();
	        param2.TAG_TYPE = WebEtcTag.TAG_CALENDAR;
	        param2.TARGET_ELEMENT_ID = targetId2;   //날짜입력 태그 위치 ID
	        param2.INPUT_DATE_ID = dateId2;     //날짜 ID
	        param2.DIV_POPUP_CAL_ID = "enddate_cal";        //달력 ID
	        param2.DEF_YMD_VALUE = val2;            //기본표시날짜.(빈값이면 당일, "none"인 경우 공란처리)
	        param2.BTN_YN = "Y";
	        param2.CALLBACK = callback2;
	        param2.DEF_TITLE_VALUE = defTitle2;
	        
	        WebEtcTag.loadData(param2);
	    }

	    
	    /**
	     *    달력 view 영문
	     *    targetId
	     *    datdId
	     *    popId
	     *    val
	     */
	    function MBK_ViewCalendar1Eng(dateId, val){
	        var param = new Object();
	        param.TAG_TYPE = WebEtcTag.TAG_CALENDAR;
	        param.TARGET_ELEMENT_ID = "id_calendar1";   //날짜입력 태그 위치 ID
	        param.INPUT_DATE_ID = dateId;       //날짜 ID
	        param.DIV_POPUP_CAL_ID = "startdate_cal";       //달력 ID
	        param.DEF_YMD_VALUE = val;          //기본표시날짜.(빈값이면 당일, "none"인 경우 공란처리)
	        param.LANG_CODE = "ENG";

	        WebEtcTag.loadData(param);
	    }
	    
	    /**
	     *    달력 view 2 영문
	     *    targetId1, target2
	     *    datdId1, dateId2
	     *    popId1, popId2
	     *    val1, val2
	     */
	    function MBK_ViewCalendar2Eng(dateId1, val1, dateId2, val2){
	        var param1 = new Object();
	        param1.TAG_TYPE = WebEtcTag.TAG_CALENDAR;
	        param1.TARGET_ELEMENT_ID = "id_calendar1";  //날짜입력 태그 위치 ID
	        param1.INPUT_DATE_ID = dateId1;     //날짜 ID
	        param1.DIV_POPUP_CAL_ID = "startdate_cal";      //달력 ID
	        param1.DEF_YMD_VALUE = val1;            //기본표시날짜.(빈값이면 당일, "none"인 경우 공란처리)
	        param1.LANG_CODE = "ENG";

	        WebEtcTag.loadData(param1);
	        
	        var param2 = new Object();
	        param2.TAG_TYPE = WebEtcTag.TAG_CALENDAR;
	        param2.TARGET_ELEMENT_ID = "id_calendar2";  //날짜입력 태그 위치 ID
	        param2.INPUT_DATE_ID = dateId2;     //날짜 ID
	        param2.DIV_POPUP_CAL_ID = "enddate_cal";        //달력 ID
	        param2.DEF_YMD_VALUE = val2;            //기본표시날짜.(빈값이면 당일, "none"인 경우 공란처리)
	        param2.LANG_CODE = "ENG";

	        WebEtcTag.loadData(param2);
	    }
	    
	    /**
	     *    달력 view 3 영문
	     *    targetId1, target2
	     *    datdId1, dateId2
	     *    popId1, popId2
	     *    val1, val2
	     */
	    function MBK_ViewCalendar3Eng(dateId1, val1, targetId1, dateId2, val2, targetId2){
	        var param1 = new Object();
	        param1.TAG_TYPE = WebEtcTag.TAG_CALENDAR;
	        param1.TARGET_ELEMENT_ID = targetId1;   //날짜입력 태그 위치 ID
	        param1.INPUT_DATE_ID = dateId1;     //날짜 ID
	        param1.DIV_POPUP_CAL_ID = "startdate_cal";      //달력 ID
	        param1.DEF_YMD_VALUE = val1;            //기본표시날짜.(빈값이면 당일, "none"인 경우 공란처리)
	        param1.LANG_CODE = "ENG";

	        WebEtcTag.loadData(param1);
	        
	        var param2 = new Object();
	        param2.TAG_TYPE = WebEtcTag.TAG_CALENDAR;
	        param2.TARGET_ELEMENT_ID = targetId2;   //날짜입력 태그 위치 ID
	        param2.INPUT_DATE_ID = dateId2;     //날짜 ID
	        param2.DIV_POPUP_CAL_ID = "enddate_cal";        //달력 ID
	        param2.DEF_YMD_VALUE = val2;            //기본표시날짜.(빈값이면 당일, "none"인 경우 공란처리)
	        param2.LANG_CODE = "ENG";

	        WebEtcTag.loadData(param2);
	    }
	    
	    /**
	     * 출금가능금액
	     * @param 계좌번호
	     * @param flag
	     * 기본이 출금계좌번호가 아닌경우
	     * 업무코드를 넘겨서 해당부분을 추가하여 사용
	     */
	    function Car_InqChange(flag){
	    	
	        if (flag) {
	            if (flag == "cbf") {
	                if($("[name='원화출금계좌번호']").val()!=''){
	                    $("#inq_limit").hide();
	                    $("<form id='ajax_frm' name='empty_frm' onsubmit='return false;' />").appendTo("body");
	                    $("#ajax_frm").append("<input type='hidden' name='계좌번호' value='"+$("[name='원화출금계좌번호']").val()+"' />");
	                    var param = $("#ajax_frm").serializeJSON();
	                    kbstar.connect.request('/mquics?QAction=1032505&page='+ kbstarCommon.asisPageInfo, param, InqChange_successCallback, InqChange_failCallback, true);
	                    param = null;
	                    $("#ajax_frm").remove();
	                }else{
	                    alert('원화출금계좌번호를 선택하여 주십시오.');
	                }
	            } else if (flag == "cbf_fx1") {
	                if($("[name='특정환율원화지정계좌번호']").val()!=''){
	                    $("#inq_limit").hide();
	                    $("<form id='ajax_frm' name='empty_frm' onsubmit='return false;' />").appendTo("body");
	                    $("#ajax_frm").append("<input type='hidden' name='계좌번호' value='"+$("[name='특정환율원화지정계좌번호']").val()+"' />");
	                    var param = $("#ajax_frm").serializeJSON();
	                    kbstar.connect.request('/mquics?QAction=1032505&page='+ kbstarCommon.asisPageInfo, param, InqChange_successCallback, InqChange_failCallback, true);
	                    param = null;
	                    $("#ajax_frm").remove();
	                }else{
	                    alert('원화지정계좌번호가 없습니다.');
	                }
	            } else if (flag == "cbf_fx2") {
	                if($("[name='특정환율원화지정계좌번호']").val()!=''){
	                    $("#inq_limit").hide();
	                    $("<form id='ajax_frm' name='empty_frm' onsubmit='return false;' />").appendTo("body");
	                    $("#ajax_frm").append("<input type='hidden' name='계좌번호' value='"+$("[name='특정환율원화지정계좌번호']").val()+"' />");
	                    var param = $("#ajax_frm").serializeJSON();
	                    kbstar.connect.request('/mquics?QAction=1032505&page='+ kbstarCommon.asisPageInfo, param, InqChangeFx_successCallback, InqChange_failCallback, true);
	                    param = null;
	                    $("#ajax_frm").remove();
	                }else{
	                    alert('원화지정계좌번호가 없습니다.');
	                }
	            }else if( 'ENG' == flag){
	                if($("[name='출금계좌번호']").val()!=''){
	                    $("#inq_limit").hide();
	                    $("<form id='ajax_frm' name='empty_frm' onsubmit='return false;' />").appendTo("body");
	                    $("#ajax_frm").append("<input type='hidden' name='계좌번호' value='"+$("[name='출금계좌번호']").val()+"' />");
	                    var param = $("#ajax_frm").serializeJSON();
	                    kbstar.connect.request('/mquics?QAction=1032505&LANG_TYPE=ENG&page='+ kbstarCommon.asisPageInfo, param, InqChange_successCallback, InqChange_failCallback, true);
	                    param = null;
	                    $("#ajax_frm").remove();
	                }else{
	                	if($("#800-627").val() == "" || $("#800-627").val() == undefined || $("#800-627").val() == "undefined"){ // 2016-10-04 김근주 변경
	                		// 혹시나 다른 HTML에서 800-627을 히든에 지정 안했을 경우를 대비하여 처리
	                		alert('출금계좌번호를 선택하여 주십시오.'); 
	                	} else {
	                		alert($("#800-627").val());
	                	}
	                }
	            }
	        } else {
	            if($("[name='출금계좌번호']").val()!=''){
	                if($("[name='출금계좌번호']").val()!= undefined && $("[name='출금계좌번호']").val()!= null){
	                    $("#inq_limit").hide();
	                    $("<form id='ajax_frm' name='empty_frm' onsubmit='return false;' />").appendTo("body");
	                    $("#ajax_frm").append("<input type='hidden' name='계좌번호' value='"+$("[name='출금계좌번호']").val()+"' />");
	                    var param = $("#ajax_frm").serializeJSON();
	                    kbstar.connect.request('/mquics?QAction=1032505&page='+ kbstarCommon.asisPageInfo, param, InqChange_successCallback, InqChange_failCallback, true);
	                    param = null;
	                    $("#ajax_frm").remove();
	                }else{
	                    //alert('출금계좌번호를 선택하여 주십시오.');
	                }
	            }else{
	                alert('출금계좌번호를 선택하여 주십시오.');
	            }
	        }
	        return false;
	    }

	    /**
	     * 출금가능금액 성공 처리
	     * @param data 데이터
	     */
	    function InqChange_successCallback(data) {
	        try{
	            $(".btn_pay").hide();
	            $("#inq_limit").show();
	            $("#inq1").text(data.data.msg.servicedata.출금가능잔액);
	            //$("#inq2").text(data.data.msg.servicedata.일일이체한도);
	            $("#inq2").text(data.data.msg.servicedata.잔여한도);
	            
	            // 2014.06.27 이정윤 타행이체수수료 표시 추가
	            if($.trim(data.data.msg.servicedata.선수수료조회정상여부) == "1") {
	                if($("#inq3").length >0) {
	                    $("#inq3").text(data.data.msg.servicedata.선이체수수료);
	                }
	                if($("#inq4").length >0) {
	                    var strAheadExptmRmainN = $.trim(data.data.msg.servicedata.선수수료면제잔여횟수);
	                    if(strAheadExptmRmainN==""||strAheadExptmRmainN=="0"){
	                        strAheadExptmRmainN = "해당무";
	                    } else if(strAheadExptmRmainN=="99"){
	                        strAheadExptmRmainN = "제한없음";
	                    } else {
	                        strAheadExptmRmainN += "회";
	                    }
	                    $("#inq4").text(strAheadExptmRmainN);
	                }
	            } else {
	                // 타행이체수수료금액
	                if($("#aheadFee").length >0) {
	                    $("#aheadFee").hide();
	                }
	                // 수수료면제잔여횟수
	                if($("#aheadExptmRmainN").length >0) {
	                    $("#aheadExptmRmainN").hide();
	                }
	            }
	                
	            // 2014.09.17 이정윤 미지정계좌이체잔여한도 표시 추가
	            if($("#inq5").length >0) {
	                $("#inq5").text(data.data.msg.servicedata.미지정계좌1일이체잔여한도);
	            }
	            
	            if($("#inq6").length >0) {
	                $("#inq6").text(data.data.msg.servicedata.일회이체한도);
	            }
	            
	            var intgraGuid = "";
	            var igayn      = "";
	            var viewYn     = "";
	            
	            if($("#igaamt").length >0) {
	                var amt = parseInt(removeChar(data.data.msg.servicedata.strUserTrsaccAmtSum,','));
	                viewYn = data.data.msg.servicedata.strUserTrsaccAmtSum_viewYn;
	                
	                if (viewYn == "Y"){
	                	// 20181213 P20181885718 예금주통합 관리서비스 개발 의뢰
	                    intgraGuid =  "<p>통합ID로 로그인하여 이체한 금액(" + data.data.msg.servicedata.strUserTrsaccAmtSum + "원)도 이용잔여한도에 차감됩니다.</p>";
	                    $("#igaamt").html(intgraGuid);
	                    $("#igaamt").show();
	                    $("#astar").show();
	                } else {
	                    $("#igaamt").hide();
	                    $("#astar").hide();
	                }
	            
	            }    
	            if($("#intgra").length >0) {
	                viewYn = data.data.msg.servicedata.strUserTrsaccInfo_viewYn;

	                if (viewYn == "Y"){
	                	// 20181213 P20181885718 예금주통합 관리서비스 개발 의뢰
	                    intgraGuid =  "<p class='item_desc'><span>*</span> "+data.data.msg.servicedata.strCustNm+","+data.data.msg.servicedata.strUserCustNm+"의 잔여한도 중 작은 한도 적용</p>";
	                    $("#intgra").html(intgraGuid);
	                    $("#intgra").show();
	                    $("#astar").show();
	                } else {
	                    $("#intgra").hide();
	                    $("#astar").hide();
	                }
	            }
	            
	            // 2018.04.05
	            var strAmtChkBit = $.trim(data.data.msg.servicedata.strAmtChkBit);
	            if(strAmtChkBit == '1'){
	            	$("#amtchk").show();
	            }
	        }catch(e){alert("caq_successCallback : "+e);}
	    }
	    
	    /**
	     * 외환특정예액매매거래 원화출금가능금액2 성공 처리
	     * @param data 데이터
	     */
	    function InqChangeFx_successCallback(data) {
	        try{
	            $("#inq_limit1").show();
	            $("#inq11").text(data.data.msg.servicedata.출금가능잔액);
	            //$("#inq22").text(data.data.msg.servicedata.일일이체한도);
	            $("#inq22").text(data.data.msg.servicedata.잔여한도);
	        }catch(e){alert("caq_successCallback : "+e);}
	    }   
	    

	    /**
	     * 출금가능금액 실패 처리
	     * @param data 데이터
	     */
	    function InqChange_failCallback(data) {
	        try{
	            // param ( Json 데이터  , QAction 사용여부 , 팝업화면 여부 , 확인 버튼 show 여부 , 이동할 페이지 , 이동할 화면명  ) 
	            caq_commonError( data , 'Y' , 'N');
	        }catch(e){alert("InqChange_failCallback : "+e);}
	    }   
	    
	    /**
	     * 본인계좌 확인 요청
	     * @param value value
	     */
	    function AcnInq() {
	        var url = "/mquics?page=D002227";
	        var param = "{";
	        param += '"AcNo":"' + $("[name='AcNo']").val() + '"';
	        param += ',"AcNo2":"' + $("[name='AcNo2']").val() + '"';
	        param += ',"value":"' + $("[name='value']").val() + '"';
	        param += ',"적립식계좌여부":"' + $("[name='적립식계좌여부']").val() + '"';
	        param += "}";   
	        window.appManager.openWebViewWithClose(url, param, AcnInq_successCallback); 
	    }
	    
	    /**
	     * 최근입금계좌/본인계좌 성공 처리
	     * @param data 데이터
	     */
	    function AcnInq_successCallback(data) {
	        try{
	            var input_id = $("input[name='value']").val();
	            $("#"+input_id).val("");
	            $("#입금은행").val(data.입금은행코드);
	            $("#"+input_id).val(data.입금계좌번호);
	            $("input[name='내계좌여부']").val("1");
	        }catch(e){alert("caq_successCallback : "+e);}
	    }

	    /**
	     * 관리자에서 입력한 데이터 페이지 페이지 이동처리 함수
	     * @param 데이터 (C030936&aaa=444&bbb=666&ccc=777) : 가장처음 : 이동할 페이지 번호 , 파라미터는 &구분자로 셋팅
	     */
	    function fn_adminRegData_move( pParam ) {
	        if( pParam == null || pParam === undefined || pParam == ''){
	            return false;
	        }

	        $("<form id='IBF_MOVE' name='IBF_MOVE' onsubmit='return false;' />").appendTo("body");
	        $("#IBF_MOVE").append("<input type='hidden' name='t' value='"+new Date().getTime()+"' />");

	        var page_no  = ''; // mquics 페이지 이동
	        var webUrl   = '';  // 기본 브라우져 새창
	        var objParam = pParam.split("&");
	        var subParam;
	        
	        if( objParam.length == 1 ){
	            subParam = objParam.split("=");
	            // 페이지 이동번호 셋팅
	            if( subParam.length == 2 ) {
	                webUrl = subParam[1];
	            }else{
	                page_no = subParam[0];
	            }
	            
	            subParam = null;
	            
	            // 기본브라우져로 이동
	            return false;
	        }else{
	            $.each( objParam, function( idx, value ) {
	                subParam = value.split("=");
	                if( idx == 0 ){
	                    // 페이지 이동번호 셋팅
	                    if( subParam.length == 2 ) {
	                        webUrl = subParam[1];
	                    }else{
	                        page_no = subParam[0];
	                    }
	                }else{
	                    if( webUrl == '' ){
	                        if( subParam.length == 2 ) {
	                            $("#IBF_MOVE").append("<input type='hidden' name='"+subParam[0]+"' value='"+subParam[1]+"' />");
	                        }else{
	                            $("#IBF_MOVE").append("<input type='hidden' name='"+subParam[0]+"' value='' />");
	                        }
	                    }else{
	                        webUrl = '&'+subParam[0]+'='+subParam[1];
	                    }
	                }
	                subParam = null;
	            });
	            subParam = null;
	        }

	        if( page_no != '' ){
	            var param = $("#IBF_MOVE").serializeJSON();
	            window.navi.navigate('/mquics?page='+page_no, param, function(){});
	            param = null;
	        }else{
	            // 기본브라우져로 새창  이동
	            window.appManager.openURL(webUrl);
	        }
	        
	        page_no = '';
	        webUrl  = '';
	        $("#IBF_MOVE").remove();
	        return false;
	    }
	    
	    /**
	     * 날짜 변경 버튼
	     * 공과금용 날짜변경함수
	     */
	    function MBK_ChangeDateCBR(type, sDayObj, eDayObj){
	        var todayDate = eDayObj.val();
	        var strDate = new Date(); 
	        var temp_y = strDate.getFullYear();
	        var temp_m = strDate.getMonth()+1;

	        if(temp_m < 10){
	            temp_m = "0" + temp_m;
	        }

	        var temp_d = strDate.getDate();

	        if(temp_d.length = 1){
	            temp_d = "0" + temp_d;
	        }

	        var returnDate = "" + temp_y + temp_m + temp_d;
	        
	        if(showConvert(0, todayDate).length != 8) {
	            todayDate = showConvert(1, returnDate);
	            eDayObj.val(todayDate);
	            sDayObj.val(showConvert(1, getshiftDate(type, showConvert(0, eDayObj.val()))));
	        } else {
	            if(type=="7"){
	                sDayObj.val(showConvert(1, getshiftDate(type, showConvert(0, todayDate))));
	                eDayObj.val(showConvert(1, getshiftDate(type, showConvert(0, todayDate))));
	                return;
	            }
	            sDayObj.val(showConvert(1, getShiftDateCBR(type, showConvert(0, todayDate))));
	        }
	    }
	    
	    /**
	     * 모바일 기본 웹브라우져 호출 함수
	     * @param pUrl 기본 웹브라우져 호출할 주소
	     */
	    function fn_mobileOpenWeb(pUrl) {
	        window.appManager.openURL(pUrl);
	        return false;
	    }
	    
	    /**
	     * name=\"상품서식명\" 를 name=\"상품서식명[]\" 로 , name=\"파일다운여부\" 를 name=\"파일다운여부[]\" 일괄수정해 화면에 붙여넣는 함수
	     * 모바일에서 해당데이터를 배열로 받기위해 처리하는 함수
	     * @param pTarget 예)'#enterPeriod' , '.enterPeriod'
	     * @param pData 데이터
	     */
	    function fn_ChangePrdInfoArray( pTarget , pData ) {
	        if( pData != null && pData != undefined && $.trim(pData) != '' ){
	            var tag_input_0 = fnReplaceAll(pData       , '상품서식명'   , '상품서식명[]');
	                tag_input_0 = fnReplaceAll(tag_input_0 , '파일다운여부' , '파일다운여부[]');
	                $('#'+pTarget).html(tag_input_0);
	                tag_input_0 = '';
	        }
	        return true;
	    }
	    
	    /**
	     * SMS RETURN URL 
	     * @param
	     * @return RETURN URL 
	     */
	    function fn_SmsReturnUrl() {
	        var _SmsReturnUrl="\n"+kbstarCommon._DOMAIN+"/mquics?asfilecode=1040094";	//2021.05.20 변경 695366   ==> 1040094
	        return _SmsReturnUrl;
	    }
	    
	    /**
	     * 지연시간 대기 후 콜백함수 호출
	     * @param callback[지연시간대기후 호출할 함수명]
	     * @param nsec[지연시간. default:500ms]
	     * ex) _exec_delay(callback함수)
	     *         _exec_delay(callback함수, 1000)
	    */
	    function _exec_delay(callback, nsec) {
	        var init_sec = 500;
	        
	        if (nsec == undefined) {
	            nsec = init_sec;
	        }
	      
	        if(typeof callback == "function") {
	            setTimeout(function() {
	                callback();
	            }, nsec);
	        }
	    }
	    
	    /**
	     * 금액입력 필드 스크립트처리 이벤트 onkeyup -> oninput 으로 변경하기 위한 useragent 체크함수
	     * android 4.4 kitkat 버전에서 backspace 입력시 keyup event 발생하지 않음
	     */ 
	    function chkUserAgentForOninputEvent(){
	        // 금액입력 필드 입력시 , 처리 car_common.js displayComma2 를
	        // android 4.4 kitkat 버전에서 backspace 입력시 keyup event 발생하지 않아서
	        // html5 지원 event인 input event로 변경
	        var ua = navigator.userAgent.toLowerCase();
	        //  os 버전명 
	        // android 4.4 kitkat 이 아닌 기존버전은 기존대로 keyup event 로 처리
	        if(window.COMMON.getUserAgent() == "ios" ||
	        //window.COMMON.getUserAgent() : ios / android / else  (else는 인터넷 브라우저)
	            window.COMMON.getUserAgent() == "else" ||
	            ua.indexOf("android 1")>-1 ||
	            ua.indexOf("android 2")>-1 ||
	            ua.indexOf("android 3")>-1 ||
	            ua.indexOf("android 4.0")>-1 ||
	            ua.indexOf("android 4.1")>-1 ||
	            ua.indexOf("android 4.2")>-1 ||
	            ua.indexOf("android 4.3")>-1 ){
	            return false;
	        }else{ // 기존버전이 아닌 경우 ( android 4.4 kitkat or 이후 버전 )
	            return true;
	        }
	    }

		//통합포인트리조회
		function CAR_MergePoinTreeInq() {
			$("<form id='Pointree_frm' name='Pointree_frm' onsubmit='return false;' />").appendTo("body");
			var param = $('#Pointree_frm').serializeJSON();
			kbstar.connect.request('/mquics?QAction=754891', param, successCallPoinTreeInq, caq_failCallback,true);       
			param = null;
			$("#Pointree_frm").remove();
		}


		function successCallPoinTreeInq(data){	         
			try{
				var rltPnt = data.data.msg.servicedata.KB카드포인트리점수;
				var AppMemYn = data.data.msg.servicedata.앱회원여부;
				var CIyn = data.data.msg.servicedata.CI여부;
				if('0' == CIyn){
					alert('고객님의 포인트가 정상적으로 조회되지 않았습니다.\n다음 영업일에 다시한번 확인 부탁드립니다.');
					$("input[id='pointTree']").attr("disabled", true);
					return ;
				}

				var eval_text = '<span class="inner_txt">총</span> <u>'+rltPnt+'</u> P';
				if(AppMemYn=='1'){ 
					eval_text = eval_text + "(Liiv Mate 가입)";
				}else{
					eval_text = eval_text + "(Liiv Mate 미가입)";
				}

				$("#evual_pointree").html(eval_text);
				$("#KB카드포인트리점수").val(rltPnt);
				$("#앱회원여부").val(AppMemYn);

				if($("#PointreeAmount")&&AppMemYn=='1'){
					$("#PointreeAmount").prop("disabled",false);
				}
			}catch(e){alert("successCallPoinTreeInq : "+e);}    
		}

		function checkPoinTreeValue(){
			if($("#PointreeAmount") && $("#PointreeAmount").val()!=""){
				
				if($("#KB카드포인트리점수").val() == ""){
					alert('포인트리 조회를 먼저 하시기 바랍니다.');
					return false;
				}

				/*if( !isNumber(removeChar($("#PointreeAmount").val(), ','))) {
				alert("포인트리사용 포인트는 숫자만 입력 가능합니다.");
				$("#PointreeAmount").focus();
				return false;
				}*/
				$("#PointreeAmount").val($("#PointreeAmount").val().replace(/[^0-9]/g,""));

				var pointreeAmt = parseInt($("#PointreeAmount").val().replace(/[^0-9]/g,""));
				var rltPnt = parseInt($("#KB카드포인트리점수").val().replace(/[^0-9]/g,""));
				var trsaccAmount =  parseInt($("#이체금액").val().replace(/[^0-9]/g,""));

				if(pointreeAmt > rltPnt){
					alert('입력하신 포인트리사용 포인트가 사용하실 수 있는 포인트리 포인트 보다 많습니다. 다시 입력해 주십시오.');
					$("#PointreeAmount").focus();
					return false;
				}
				
				if(pointreeAmt > newAmount){
					alert('총신규금액 보다 포인트리사용 포인트를 많이 입력할 수 없습니다. 다시 입력해 주십시오.');
					$("#PointreeAmount").focus();
					return false;
				}

				if($("#포인트리신규여부")){
					$("#포인트리신규여부").val("1");
				}
			}
			return true;
		}

		//즉시이체 및 적금이체시 포인트리 사용금액 유효성 체크
		function checkPoinTreeValueForTrsacc(){
			if($("#PointreeAmount") && $("#PointreeAmount").val()!=""){
				
				if($("#KB카드포인트리점수").val() == ""){
					alert('포인트리 조회를 먼저 하시기 바랍니다.');
					return false;
				}

				/*if( !isNumber(removeChar($("#PointreeAmount").val(), ','))) {
					alert("포인트리사용 포인트는 숫자만 입력 가능합니다.");
					$("#PointreeAmount").focus();
					return false;
				}*/
				$("#PointreeAmount").val($("#PointreeAmount").val().replace(/[^0-9]/g,""));

				var pointreeAmt = parseInt($("#PointreeAmount").val().replace(/[^0-9]/g,""));
				var rltPnt = parseInt($("#KB카드포인트리점수").val().replace(/[^0-9]/g,""));
				var trsaccAmount =  parseInt($("#이체금액").val().replace(/[^0-9]/g,""));

				if(pointreeAmt > rltPnt){
					alert('입력하신 포인트리사용 포인트가 사용하실 수 있는 포인트리 포인트 보다 많습니다. 다시 입력해 주십시오.');
					$("#PointreeAmount").focus();
					return false;
				}
				
				if(pointreeAmt > trsaccAmount){
					alert('총이체금액 보다 포인트리사용 포인트를 많이 입력할 수 없습니다. 다시 입력해 주십시오.');
					$("#PointreeAmount").focus();
					return false;
				}

				if($("#포인트리신규여부")){
					$("#포인트리신규여부").val("1");
				}
			}
			return true;
		}


		function openLiivMateUrl(){
			window.appManager.openURL("https://m.liivmate.com/katws/mobile/app_install.jsp");
		}
		
		/**
		 * 2017-09-29
		 * 버전 문자열 비교 함수. 앞에 있는 버전 구분자(영문)는 무시하고 뒤에 오는 버전(Major.Minor.Build)만 비교함.
		 * @Ahuthor: 김지윤(에이티솔루션즈)
		 * @param ver1 버전 문자열1
		 * @param ver2 버전 문자열2
		 * @return 0:같다, 1:ver1이 크다, -1:ver2가 크다
		 * @예제
		 * @ compareVersion('G5.0.0', 'G5.0.0') : 0
		 * @ compareVersion('G5.0.1', 'G5.0.0') : 1
		 * @ compareVersion('G5.0.0', 'G5.0.1') : -1
		 */
		function compareVersion (ver1, ver2) {
			var verArr1;
			var verArr2;

			// 버전 문자열을 '.'로 분리
			if (ver1.charAt(0) > '9') { // 첫 문자가 영문인 경우 영문자를 제외
			 	verArr1 = ver1.substring(1).split(".");
			} else {
			  verArr1 = ver1.split(".");
			}

			if (ver2.charAt(0) > '9') { // 첫 문자가 영문인 경우 영문자를 제외
			 	verArr2 = ver2.substring(1).split(".");
			} else {
			  verArr2 = ver2.split(".");
			}
			
			// 숫자로 변환 후에 비트 연산(32비트)
			var a1 = (verArr1[0] * 1) << 20;
			var b1 = (verArr1[1] * 1) << 10;
			var c1 = (verArr1[2] * 1) << 0;
			
			var a2 = (verArr2[0] * 1) << 20;
			var b2 = (verArr2[1] * 1) << 10;
			var c2 = (verArr2[2] * 1) << 0;
			
			
			var appVer1 = a1 + b1 + c1;
			var appVer2 = a2 + b2 + c2;

		  // 숫자 버전 비교	
			if(appVer1 > appVer2) {
				return 1;
			} else if(appVer1 < appVer2) {
				return -1;
			}

			return 0;
		}

	    function Car_InqChange_acct(){
	    	if($("[name='출금계좌번호']").val()!=''){
	    	    if($("[name='출금계좌번호']").val()!= undefined && $("[name='출금계좌번호']").val()!= null){
	    	        $("#inq_limit").hide();
	    	        $("<form id='ajax_frm' name='empty_frm' onsubmit='return false;' />").appendTo("body");
	    	        $("#ajax_frm").append("<input type='hidden' name='통합ID여부' value='Y' />");
	    	        $("#ajax_frm").append("<input type='hidden' name='계좌번호' value='"+$("[name='출금계좌번호']").val()+"' />");
	    	        $("#ajax_frm").append("<input type='hidden' name='부사용자ID' value='"+$("[name='통합사용자ID']").val()+"' />");
	    	        var param = $("#ajax_frm").serializeJSON();
	    	        kbstar.connect.request('/mquics?QAction=1032505&page='+ kbstarCommon.asisPageInfo, param, InqChange_successCallback, InqChange_failCallback, true);
	    	        param = null;
	    	        $("#ajax_frm").remove();
	    	    }else{
	    	        //alert('출금계좌번호를 선택하여 주십시오.');
	    	    }
	    	}else{
	    	    alert('출금계좌번호를 선택하여 주십시오.');
	    	}
	    }
	    
		// 연속된 글자 체크 함수 : 1234 or 1111 (숫자, 알파벳 지원)
		function chkContStr(str, max){
		    if(!max) max = 4; // 글자수를 지정하지 않으면 4로 지정
		    var i, j, k, x, y;
		    var buff = ["0123456789", "abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
		    var src, src2, ptn="";

		    for(i=0; i<buff.length; i++){
		        src = buff[i]; // 0123456789
		        src2 = buff[i] + buff[i]; // 01234567890123456789
		        for(j=0; j<src.length; j++){
		            x = src.substr(j, 1); // 0
		            y = src2.substr(j, max); // 0123
		            ptn += "["+x+"]{"+max+",}|"; // [0]{4,}|0123|[1]{4,}|1234|...
		            ptn += y+"|";
		        }
		    }
		    ptn = new RegExp(ptn.replace(/.$/, "")); // 맨마지막의 글자를 하나 없애고 정규식으로 만든다.

		    if(ptn.test(str)) return true;
		    return false;
		}

		// 테스트
		//var buff = ["abc1234", "aabb123", "333111222", "Hello", "3335555512", "318371", "", "3334567111"];
		//var rst;
		//for(var i=0; i<buff.length; i++){
		//    rst = chkContStr(buff[i]);
		//    document.write(buff[i] + " = " + rst + "<br>");
		//}

		function flbn_successCallback(flbnDataObj) {
			try{
				if(typeof flbnDataObj != "undefined" != undefined && $.trim(flbnDataObj) != ""){
					var flbnApnd = function(htmlData){	//일반플로팅배너
						window.UserPreference.getValue(function(ret) {
							if(ret != flbnDataObj.members.세션키.value) {
								$("body").prepend(htmlData);
								if(flbnDataObj.members.페이지ID.value == "C059493") {	// 내맘대로적금 신규
									setTimeout(function() {
			                        	$("#flbn").hide();
			                        	$("#flbnNavAside").addClass("show");
										$("#flbn").show();
									}, 120000);
								} else if(flbnDataObj.members.페이지ID.value == "C059517") { // KB Star정기예금 상품
									setTimeout(function() {
			                        	$("#flbn").hide();
			                        	$("#flbnNavAside").addClass("show");
										$("#flbn").show();
									}, 60000);
								} else if(flbnDataObj.members.페이지ID.value == "C051297") { // 펀드상품
									setTimeout(function() {
			                        	$("#flbn").hide();
			                        	$("#flbnNavAside").addClass("show");
										$("#flbn").show();
									}, 70000);
								} else if(flbnDataObj.members.페이지ID.value == "C061546") { // KB Star 신용대출
									setTimeout(function() {
			                        	$("#flbn").hide();
			                        	$("#flbnNavAside").addClass("show");
										$("#flbn").show();
									}, 70000);
								} else if(flbnDataObj.members.페이지ID.value == "C063583") { // 개인형IRP(적립식)
									setTimeout(function() {
			                        	$("#flbn").hide();
			                        	$("#flbnNavAside").addClass("show");
										$("#flbn").show();
									}, 110000);
								} else if(flbnDataObj.members.페이지ID.value == "C060622") { // 전계좌조회
									setTimeout(function() {
			                        	$("#flbn").hide();
			                        	$("#flbnNavAside").addClass("show");
										$("#flbn").show();
									}, 1000);
								} else { 
			                    	$("#flbn").hide();
			                    	$("#flbnNavAside").addClass("show");
									$("#flbn").show();
								}
								
								window.UserPreference.setValue(function() {}, function() {}, "flbnSessKey", flbnDataObj.members.세션키.value);
			                    
							    // 배너 노출 후 IMDG 삭제
								kbstar.connect.request('/mquics?QAction=1008482',  {}, function() {}, function() {}, true);
								
							    var QLFUtil = {
							      sendLog : function(data){
							        if(!data){
							          return false;
							        }
							
							        data.lgTmClnt = this.timeStamp();
							        data._LOG_TYPE = data.lgType;
							        data.timZone = (- new Date().getTimezoneOffset()/60);
							
							        if(data.lgType == "AB"){
							          var request = "";
							            if(typeof(data) == "string"){
							              request = data;
							            }else if(typeof(data) == "object"){
							              var list = [];
							              for(var key in data){
							                  var val = data[key];
							                  val = (val != undefined && typeof(val) == "string" ? val.replace(/([\^\|\\])/g,"\$1" ) : "");
							                  list.push( key + "|" + val );
							              }
							              request = list.join("^");
							
							              var _params={hb : request}
							                  if (window.COMMON.getUserAgent() == "ios") {
							                      _params={hb:encodeURIComponent(request)}
							                  }
							                if (typeof(kbstar) != "undefined") {
							                          kbstar.exec(null, null, "TrackerManager", "sendBehaviorLog", _params);				
							                  }
							            }else{
							              return false;
							            }
							        }
							
							        return true;
							      },
							      timeStamp : function(){
							          var lp = function(s,l){
							              s = (s||'').split("").reverse();
							              l -= s.length;
							              for(var i = 0; i < l ; i++){
							                  s.push("0");
							              }
							              return s.reverse().join("");
							          }
							
							          var db = new Date();
							
							          var Y = db.getFullYear().toString();
							          var M = (db.getMonth()+1).toString();
							          var D = db.getDate().toString();
							          var h = db.getHours().toString();
							          var m = db.getMinutes().toString();
							          var s = db.getSeconds().toString();
							          var ms = db.getMilliseconds().toString();
							
							
							          return Y + "-" + lp(M,2,0)+"-"+lp(D,2,0)
							              +"T"+lp(h,2,0)+":"+lp(m,2,0)+":"+lp(s,2,0)+"."+lp(ms,3,0)+"Z";
							      }
							  	};
						  	
						  		var data = {};
												
								//공통 필수
								data.lgType = "AB"; 			//로그종류 (WB : WEB배너 , AB : APP배너)
								data.bnnrType = "F";			//배너종류 ()
								data.bnnrCkEpDstic = "1";	//배너 노출/클릭여부 ( : 노출 , : 클릭 )
								
								data.pageID = flbnDataObj.members.페이지ID.value;
								
								//일반 베너 필수 
								data.bnnrID		=	""; 	//배너 ID
								data.bnnrArID	= ""; //배너 AREA ID
								
								//플로팅베너 필수
								data.fltBnnrID     = flbnDataObj.members.플로팅배너ID.value;  //플로팅 배너 ID    
								data.fltBnnrElmtID = ''; //플로팅 구성요소 ID
								data.fltBnnrPtrn1  = flbnDataObj.members.플로팅배너유형대분류ID.value; //플로팅 배너 유형1 
								data.fltBnnrPtrn2  = flbnDataObj.members.플로팅배너유형중분류ID.value; //플로팅 배너 유형2 
								data.fltBnnrPtrn3  = flbnDataObj.members.플로팅배너유형소분류ID.value; //플로팅 배너 유형3 
								
								//옵션
								data.crmCmpgnID   = flbnDataObj.members.캠페인ID.value; //CRM캠페인ID
								data.acaInfoID    = flbnDataObj.members.수행캠페인활동식별자.value; //수행캠페인활동식별자
								data.bnnrAdtInfo  = ''; //배너 추가정보 
								
								//행태감지 추가옵션 : abTest(ABtest)와 custGrpId(고객군) 
								data.abTest  = "A"; //배너 abTest(ABtest)
								data.custGrpId  = "TEST"; //배너 custGrpId(고객군) 
								QLFUtil.sendLog(data);	
								
								// 신규 : 플로팅버튼
								$("#flbnNavAside .ui_btn").click(function(idx){
			                    	if(flbnDataObj.members.플로팅배너유형구분.value == "3") {
			                        	var etcURL1 = flbnDataObj.members.기타버튼URL1.value;
			                            
			                        	if(etcURL1.length == 7 && etcURL1.substring(0,1) == "C") {
			                            	flbn_etcGoPage(etcURL1, '');
			                            } else {
			                            	window.appManager.openURL(etcURL1);
			                            }
			                            $('#flbn').remove();
			                            
			                            data.bnnrCkEpDstic = "2";
			                            QLFUtil.sendLog(data);
			                        } else {
			                        	if($("#flbnNavAside").hasClass("close")) {
			                                $("#flbnNavAside").removeClass("close");
			                                $("#flbnNavAside").after('<div class="dim"></div>');
	
			                                $('.dim').off('click').on('click', function(){
			                                    $('#flbn').remove();
			                                });
	
			                                data.bnnrCkEpDstic = "2";
			                                QLFUtil.sendLog(data);
			                            } else {
			                                $('#flbn').remove();
			                            }
			                        }
								});
								$("#flbnNavAside .nav_close").click(function(idx){
									$('#flbn').remove();
								});
								
								$("#flbnNavAside li>a, #flbnEtc1").click(function(idx){
									data.bnnrCkEpDstic = "3";
									data.fltBnnrElmtID = $(this).attr("id");
									
									QLFUtil.sendLog(data);
								});
							}
						}, function() {
						}, "flbnSessKey");
				  };
				  //캠페인플로팅배너용
				  var cmpgnApnd = function(htmlData){
						window.UserPreference.getValue(function(ret) {
							if(ret != flbnDataObj.members.세션키.value) {
								$("body").prepend(htmlData);
								setTimeout(function() {
		                        	$("#flbn").hide();
		                        	$("#flbnNavAside").addClass("show");
									$("#flbn").show();
								}, 1000);
								
								window.UserPreference.setValue(function() {}, function() {}, "cmpgnSessKey", flbnDataObj.members.세션키.value);
			                  
							    // 배너 노출 후 IMDG 삭제
								kbstar.connect.request('/mquics?QAction=1014565',  {}, function() {}, function() {}, true);
								
							    var QLFUtil = {
							      sendLog : function(data){
							        if(!data){
							          return false;
							        }
							
							        data.lgTmClnt = this.timeStamp();
							        data._LOG_TYPE = data.lgType;
							        data.timZone = (- new Date().getTimezoneOffset()/60);
							
							        if(data.lgType == "AB"){
							          var request = "";
							            if(typeof(data) == "string"){
							              request = data;
							            }else if(typeof(data) == "object"){
							              var list = [];
							              for(var key in data){
							                  var val = data[key];
							                  val = (val != undefined && typeof(val) == "string" ? val.replace(/([\^\|\\])/g,"\$1" ) : "");
							                  list.push( key + "|" + val );
							              }
							              request = list.join("^");
							
							              var _params={hb : request}
							                  if (window.COMMON.getUserAgent() == "ios") {
							                      _params={hb:encodeURIComponent(request)}
							                  }
							                if (typeof(kbstar) != "undefined") {
							                          kbstar.exec(null, null, "TrackerManager", "sendBehaviorLog", _params);				
							                  }
							            }else{
							              return false;
							            }
							        }
							
							        return true;
							      },
							      timeStamp : function(){
							          var lp = function(s,l){
							              s = (s||'').split("").reverse();
							              l -= s.length;
							              for(var i = 0; i < l ; i++){
							                  s.push("0");
							              }
							              return s.reverse().join("");
							          }
							
							          var db = new Date();
							
							          var Y = db.getFullYear().toString();
							          var M = (db.getMonth()+1).toString();
							          var D = db.getDate().toString();
							          var h = db.getHours().toString();
							          var m = db.getMinutes().toString();
							          var s = db.getSeconds().toString();
							          var ms = db.getMilliseconds().toString();
							
							
							          return Y + "-" + lp(M,2,0)+"-"+lp(D,2,0)
							              +"T"+lp(h,2,0)+":"+lp(m,2,0)+":"+lp(s,2,0)+"."+lp(ms,3,0)+"Z";
							      }
							  	};
						  	
						  		var data = {};
												
								//공통 필수
								data.lgType = "AB"; 			//로그종류 (WB : WEB배너 , AB : APP배너)
								data.bnnrType = "C";			//배너종류 ()
								data.bnnrCkEpDstic = "1";	//배너 노출/클릭여부 ( : 노출 , : 클릭 )
								
								data.pageID = flbnDataObj.members.페이지ID.value;
								
								//일반 베너 필수 
								data.bnnrID		=	""; 	//배너 ID
								data.bnnrArID	= ""; //배너 AREA ID
								
								//플로팅베너 필수
								data.fltBnnrID     = flbnDataObj.members.플로팅배너ID.value;  //플로팅 배너 ID    
								data.fltBnnrElmtID = ''; //플로팅 구성요소 ID
								data.fltBnnrPtrn1  = flbnDataObj.members.플로팅배너유형대분류ID.value; //플로팅 배너 유형1 
								data.fltBnnrPtrn2  = flbnDataObj.members.플로팅배너유형중분류ID.value; //플로팅 배너 유형2 
								data.fltBnnrPtrn3  = flbnDataObj.members.플로팅배너유형소분류ID.value; //플로팅 배너 유형3 
								
								//옵션
								data.crmCmpgnID   = flbnDataObj.members.캠페인식별자.value; //CRM캠페인ID
								data.acaInfoID    = flbnDataObj.members.수행활동식별자.value; //수행캠페인활동식별자
								data.bnnrAdtInfo  = ''; //배너 추가정보 
								
								//행태감지 추가옵션 : abTest(ABtest)와 custGrpId(고객군) 
								data.abTest  = "A"; //배너 abTest(ABtest)
								data.custGrpId  = "TEST"; //배너 custGrpId(고객군) 
								QLFUtil.sendLog(data);	
								
								// 신규 : 플로팅버튼
								$("#flbnNavAside #ui_btn").click(function(idx){
			                      	var urlVal = flbnDataObj.members.이벤트상세경로명.value;
			                          
			                      	if(urlVal.length == 7 && urlVal.substring(0,1) == "C") {
			                      		flbn_etcGoPage(urlVal, '');
			                        } else {
			                          	window.appManager.openURL(urlVal);
			                        }
			                      	$('#flbn').remove();
			                        data.bnnrCkEpDstic = "2";
			                        QLFUtil.sendLog(data);
								});
								$("#flbnNavAside .closeBtn").click(function(idx){
									$('#flbn').remove();
								});
								$("#flbn").find("input[name=reviewYN]").click(function(idx){							
									if($("#flbn").find("input[name=reviewYN]").is(":checked")){
										// 쿠키값을 가져온다.
										window.UserPreference.getValue(function(data) {
											var infoData = {};
											infoData.viewFlag = flbnDataObj.members.노출종료년월일.value;
											var JData = JSON.stringify(infoData);
											// 쿠키값을 설정한다.
											window.UserPreference.setValue(function(){}, function() {}, flbnDataObj.members.플로팅배너ID.value, JData);
										}, function() {},flbnDataObj.members.플로팅배너ID.value);
										
										// 콜백함수값을 반영하기 위한 타임아웃
										setTimeout(function(){
											$('#flbn').remove();
										}, 200);							
									}
								});
								
	//							$("#flbnNavAside li>a, #flbnEtc1").click(function(idx){
	//								data.bnnrCkEpDstic = "3";
	//								data.fltBnnrElmtID = $(this).attr("id");
	//								
	//								QLFUtil.sendLog(data);
	//							});
							}
						}, function() {
						}, "cmpgnSessKey");
				  };
				  
					
				  var flbnHtml = "";
				  if(flbnDataObj.members.플로팅배너유형구분.value == "1") {
						flbnHtml += '<div id="flbn">									';
						flbnHtml += '	<div id="flbnNavAside" class="nav_aside2">        ';
						flbnHtml += '		<div class="cont">';
						flbnHtml += '			<p class="sub">'+flbnDataObj.members.플로팅배너텍스트명.value+'</p>';
						flbnHtml += '			<div class="btns_area"><a href="#" class="ui_btn">닫기</a></div>';
						flbnHtml += '			<ul>';
				
						// 상담버튼
						if(flbnDataObj.members.상담버튼구분1.value == "01") {
							if(flbnDataObj.members.플로팅배너채널구분.value == "02") {	// 스타뱅킹
						  	flbnHtml += '        <li><a href="#none" id="flbnTelCnsel" onclick="flbn_goPage(\'D000855\', \''+flbnDataObj.members.캠페인ID.value+'\',\''+flbnDataObj.members.서버환경.value+'\'); return false;">전화상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "03" ) { // 리브
						  	flbnHtml += '        <li><a href="#none" id="flbnTelCnsel" onclick="flbn_goPage(\'C100636\', \''+flbnDataObj.members.캠페인ID.value+'\',\''+flbnDataObj.members.서버환경.value+'\'); return false;">전화상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "04") { // 리브똑똑
						  	flbnHtml += '        <li><a href="#none" id="flbnTelCnsel" onclick="flbn_goPage(\'C100632\', \''+flbnDataObj.members.캠페인ID.value+'\',\''+flbnDataObj.members.서버환경.value+'\'); return false;">전화상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "05") { // 마이머니
						  	flbnHtml += '        <li><a href="#none" id="flbnTelCnsel" onclick="flbn_goPage(\'C100585\', \''+flbnDataObj.members.캠페인ID.value+'\',\''+flbnDataObj.members.서버환경.value+'\'); return false;">전화상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "06") { // 리브온
						  	flbnHtml += '        <li><a href="#none" id="flbnTelCnsel" onclick="flbn_goPage(\'C100634\', \''+flbnDataObj.members.캠페인ID.value+'\',\''+flbnDataObj.members.서버환경.value+'\'); return false;">전화상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "07") { // 스타알림
						  	flbnHtml += '        <li><a href="#none" id="flbnTelCnsel" onclick="flbn_goPage(\'C100633\', \''+flbnDataObj.members.캠페인ID.value+'\',\''+flbnDataObj.members.서버환경.value+'\'); return false;">전화상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "09") { // 스타기업뱅킹
						  	flbnHtml += '        <li><a href="#none" id="flbnTelCnsel" onclick="flbn_goPage(\'C100635\', \''+flbnDataObj.members.캠페인ID.value+'\',\''+flbnDataObj.members.서버환경.value+'\'); return false;">전화상담</a></li>                     ';
						  }
						}
						if(flbnDataObj.members.상담버튼구분2.value == "02") {
							if(flbnDataObj.members.플로팅배너채널구분.value == "02") {	// 스타뱅킹
						  	flbnHtml += '        <li><a href="#none" id="flbnChtt" onclick="flbn_goPage(\'C063718\',\''+flbnDataObj.members.캠페인ID.value+'\',\'\'); return false;">채팅상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "03") { // 리브
						  	flbnHtml += '        <li><a href="#none" id="flbnChtt" onclick="flbn_goPage(\'C064314\',\''+flbnDataObj.members.캠페인ID.value+'\',\'\'); return false;">채팅상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "04") { // 리브똑똑
						  	flbnHtml += '        <li><a href="#none" id="flbnChtt" onclick="flbn_goPage(\'C056503\',\''+flbnDataObj.members.캠페인ID.value+'\',\'\'); return false;">채팅상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "05") { // 마이머니
						  	flbnHtml += '        <li><a href="#none" id="flbnChtt" onclick="flbn_goPage(\'C064374\',\''+flbnDataObj.members.캠페인ID.value+'\',\'\'); return false;">채팅상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "06") { // 리브온
						  	flbnHtml += '        <li><a href="#none" id="flbnChtt" onclick="flbn_goPage(\'C060536\',\''+flbnDataObj.members.캠페인ID.value+'\',\'\'); return false;">채팅상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "07") { // 스타알림
						  	flbnHtml += '        <li><a href="#none" id="flbnChtt" onclick="flbn_goPage(\'C064377\',\''+flbnDataObj.members.캠페인ID.value+'\',\'\'); return false;">채팅상담</a></li>                     ';
						  }
						}
						if(flbnDataObj.members.상담버튼구분3.value == "03") {
							flbnHtml += '        <li><a href="#none" id="flbnTelPengag" onclick="flbn_goPage(\'C100442\', \''+flbnDataObj.members.캠페인ID.value+'\',\'\'); return false;">전화상담 예약</a></li>                     ';
						}
						if(flbnDataObj.members.상담버튼구분4.value == "04") {
							flbnHtml += '        <li><a href="#none" id="flbnBbrnPengag" onclick="flbn_etcGoPage(\'D000918\',\'\'); return false;">영업점 방문예약</a></li>                     ';
						}
						
						// 기타버튼
						if(flbnDataObj.members.기타버튼명1.value != "" && flbnDataObj.members.기타버튼명1.value != null) {
							flbnHtml += '        <li><a href="#none" id="flbnEtc1" onclick="flbn_etcGoPage(\''+flbnDataObj.members.기타버튼URL1.value+'\',\'\'); return false;">'+flbnDataObj.members.기타버튼명1.value+'</a></li>                     ';
						}
						if(flbnDataObj.members.기타버튼명2.value != "" && flbnDataObj.members.기타버튼명2.value != null) {
							flbnHtml += '        <li><a href="#none" id="flbnEtc2" onclick="flbn_etcGoPage(\''+flbnDataObj.members.기타버튼URL2.value+'\',\'\'); return false;">'+flbnDataObj.members.기타버튼명2.value+'</a></li>                     ';
						}
						if(flbnDataObj.members.기타버튼명3.value != "" && flbnDataObj.members.기타버튼명3.value != null) {
							flbnHtml += '        <li><a href="#none" id="flbnEtc3" onclick="flbn_etcGoPage(\''+flbnDataObj.members.기타버튼URL3.value+'\',\'\'); return false;">'+flbnDataObj.members.기타버튼명3.value+'</a></li>                     ';
						}
						if(flbnDataObj.members.기타버튼명4.value != "" && flbnDataObj.members.기타버튼명4.value != null) {
							flbnHtml += '        <li><a href="#none" id="flbnEtc4" onclick="flbn_etcGoPage(\''+flbnDataObj.members.기타버튼URL4.value+'\',\'\'); return false;">'+flbnDataObj.members.기타버튼명4.value+'</a></li>                     ';
						}
						if(flbnDataObj.members.기타버튼명5.value != "" && flbnDataObj.members.기타버튼명5.value != null) {
							flbnHtml += '        <li><a href="#none" id="flbnEtc5" onclick="flbn_etcGoPage(\''+flbnDataObj.members.기타버튼URL5.value+'\',\'\'); return false;">'+flbnDataObj.members.기타버튼명5.value+'</a></li>                     ';
						}
							
						flbnHtml += '					</ul>                                                                   ';
						flbnHtml += '				</div>                                                                    ';
						flbnHtml += '			</div>                                                                      ';
			            flbnHtml += '			<div class="dim"></div>                                                                      ';
						flbnHtml += '		</div>                                                                        ';
						
						flbnApnd(flbnHtml);
					} else if(flbnDataObj.members.플로팅배너유형구분.value == "2") {
						flbnHtml += '<div id="flbn">									';
						flbnHtml += '<div id="flbnNavAside" class="nav_aside2 close">                                            ';
						flbnHtml += '  <div class="btns_area">                                                                  ';
						flbnHtml += '    <a href="#" class="ui_btn"><span>'+flbnDataObj.members.플로팅배너텍스트명.value+'</span></a>                            ';
						flbnHtml += '    <a href="#" class="nav_close">닫기</a>';
						flbnHtml += '  </div>                                                                                   ';
						flbnHtml += '  <div class="cont type2">                                                                 ';
						flbnHtml += '    <p class="sub">                                                                        ';
						flbnHtml += '      <em class="ic1">'+flbnDataObj.members.플로팅배너메시지명.value+'</em>                ';
						if(typeof flbnDataObj.members.플로팅배너메시지내용.value != "undefined") {
							flbnHtml += flbnDataObj.members.플로팅배너메시지내용.value;
						}
						flbnHtml += '    </p>                                                                                   ';
						flbnHtml += '    <div class="btns_area"><a href="#" class="ui_btn">닫기</a></div>                        ';
						flbnHtml += '    <ul>                                                                                   ';
						if(flbnDataObj.members.상담버튼구분1.value == "01") {
							if(flbnDataObj.members.플로팅배너채널구분.value == "02") {	// 스타뱅킹
						  	flbnHtml += '      <li class="ic1"><a href="#none" id="flbnTelCnsel" onclick="flbn_goPage(\'D000855\', \''+flbnDataObj.members.캠페인ID.value+'\',\''+flbnDataObj.members.서버환경.value+'\'); return false;">전화상담</a></li>         ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "03") { // 리브
						  	flbnHtml += '        <li class="ic1"><a href="#none" id="flbnTelCnsel" onclick="flbn_goPage(\'C100636\', \''+flbnDataObj.members.캠페인ID.value+'\',\''+flbnDataObj.members.서버환경.value+'\'); return false;">전화상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "04") { // 리브똑똑
						  	flbnHtml += '        <li class="ic1"><a href="#none" id="flbnTelCnsel" onclick="flbn_goPage(\'C100632\', \''+flbnDataObj.members.캠페인ID.value+'\',\''+flbnDataObj.members.서버환경.value+'\'); return false;">전화상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "05") { // 마이머니
						  	flbnHtml += '        <li class="ic1"><a href="#none" id="flbnTelCnsel" onclick="flbn_goPage(\'C100585\', \''+flbnDataObj.members.캠페인ID.value+'\',\''+flbnDataObj.members.서버환경.value+'\'); return false;">전화상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "06") { // 리브온
						  	flbnHtml += '        <li class="ic1"><a href="#none" id="flbnTelCnsel" onclick="flbn_goPage(\'C100634\', \''+flbnDataObj.members.캠페인ID.value+'\',\''+flbnDataObj.members.서버환경.value+'\'); return false;">전화상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "07") { // 스타알림
						  	flbnHtml += '        <li class="ic1"><a href="#none" id="flbnTelCnsel" onclick="flbn_goPage(\'C100633\', \''+flbnDataObj.members.캠페인ID.value+'\',\''+flbnDataObj.members.서버환경.value+'\'); return false;">전화상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "09") { // 스타기업뱅킹
						  	flbnHtml += '        <li class="ic1"><a href="#none" id="flbnTelCnsel" onclick="flbn_goPage(\'C100635\', \''+flbnDataObj.members.캠페인ID.value+'\',\''+flbnDataObj.members.서버환경.value+'\'); return false;">전화상담</a></li>                     ';
						  }
						}
						if(flbnDataObj.members.상담버튼구분2.value == "02") {
							if(flbnDataObj.members.플로팅배너채널구분.value == "02") {	// 스타뱅킹
						  	flbnHtml += '        <li class="ic2"><a href="#none" id="flbnChtt" onclick="flbn_goPage(\'C063718\',\''+flbnDataObj.members.캠페인ID.value+'\',\'\'); return false;">채팅상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "03") { // 리브
						  	flbnHtml += '        <li class="ic2"><a href="#none" id="flbnChtt" onclick="flbn_goPage(\'C064314\',\''+flbnDataObj.members.캠페인ID.value+'\',\'\'); return false;">채팅상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "04") { // 리브똑똑
						  	flbnHtml += '        <li class="ic2"><a href="#none" id="flbnChtt" onclick="flbn_goPage(\'C056503\',\''+flbnDataObj.members.캠페인ID.value+'\',\'\'); return false;">채팅상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "05") { // 마이머니
						  	flbnHtml += '        <li class="ic2"><a href="#none" id="flbnChtt" onclick="flbn_goPage(\'C064374\',\''+flbnDataObj.members.캠페인ID.value+'\',\'\'); return false;">채팅상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "06") { // 리브온
						  	flbnHtml += '        <li class="ic2"><a href="#none" id="flbnChtt" onclick="flbn_goPage(\'C060536\',\''+flbnDataObj.members.캠페인ID.value+'\',\'\'); return false;">채팅상담</a></li>                     ';
						  } else if(flbnDataObj.members.플로팅배너채널구분.value == "07") { // 스타알림
						  	flbnHtml += '        <li class="ic2"><a href="#none" id="flbnChtt" onclick="flbn_goPage(\'C064377\',\''+flbnDataObj.members.캠페인ID.value+'\',\'\'); return false;">채팅상담</a></li>                     ';
						  }
						}
						if(flbnDataObj.members.상담버튼구분3.value == "03") {
							flbnHtml += '      <li class="ic4"><a href="#none" id="flbnTelPengag" onclick="flbn_goPage(\'C100442\', \''+flbnDataObj.members.캠페인ID.value+'\',\''+flbnDataObj.members.서버환경.value+'\'); return false;">전화상담 예약</a></li>                                             ';
						}
						if(flbnDataObj.members.상담버튼구분4.value == "04") {
							flbnHtml += '      <li class="ic5"><a href="#none" id="flbnBbrnPengag" onclick="flbn_etcGoPage(\'D000918\',\'\'); return false;">영업점<br>방문예약</a></li>                                             ';
						}
						flbnHtml += '    </ul>                                                                                  ';
						if(flbnDataObj.members.기타버튼명1.value != "" && flbnDataObj.members.기타버튼명1.value != null) {
							flbnHtml += '    <div class="btns_area fill">                                                           ';
							flbnHtml += '      <div><button type="button" id="flbnEtc1"  onclick="flbn_etcGoPage(\''+flbnDataObj.members.기타버튼URL1.value+'\',\'\'); return false;"><span>'+flbnDataObj.members.기타버튼명1.value+'</span></button></div>';
							flbnHtml += '    </div>                                                                                 ';
						}
						flbnHtml += '  </div>                                                                                   ';
						flbnHtml += '</div>                                                                                     ';
						flbnHtml += '</div>                                                                                     ';
						
						flbnApnd(flbnHtml);
					} else if(flbnDataObj.members.플로팅배너유형구분.value == "3") {
			            flbnHtml += '<div id="flbn">									';
			            flbnHtml += '<div id="flbnNavAside" class="nav_aside2 close">                                            ';
			            flbnHtml += '  <div class="btns_area">                                                                  ';
			            flbnHtml += '    <a href="#" class="ui_btn"><span>'+flbnDataObj.members.플로팅배너텍스트명.value+'</span></a>                            ';
			            flbnHtml += '    <a href="#" class="nav_close">닫기</a>';
			            flbnHtml += '  </div>                                                                                   ';
			            flbnHtml += '</div>                                                                                     ';
			            flbnHtml += '</div>                                                                                     ';
			            
			            flbnApnd(flbnHtml);
					}  else if(flbnDataObj.members.플로팅배너유형구분.value == "4") {		//캠페인플로팅배너
			            //캠페인플로팅배너 노출 체크.
						window.UserPreference.getValue(function(data){
							var infoData = data ? JSON.parse(data) : {};
	//						viewCheckFunction(flbnDataObj,infoData);
							if(viewCheckFunction(flbnDataObj,infoData)){
				            	var ui_btn = "ui_btn";
				    			var nav_close = "nav_close";
				    			if(flbnDataObj.members.템플릿설정구분.value != ''){
				    				var tmplSet = flbnDataObj.members.템플릿설정구분.value;
				    				if(flbnDataObj.members.템플릿설정구분.value!='01'){
				    					tmplSet = tmplSet * 1;
				    					ui_btn = ui_btn + tmplSet;
				    				}
				    				if( flbnDataObj.members.템플릿설정구분.value=='02'){
				    					nav_close = 'nav_close2';
				    				}
				    				if( flbnDataObj.members.템플릿설정구분.value=='03'){
				    					nav_close = 'nav_close3';
				    				}
				    				if(  flbnDataObj.members.템플릿설정구분.value=='04'){
				    					nav_close = 'nav_close4';
				    				}
				    			}
				    			
				    			
				                flbnHtml += '<div id="flbn">									';
				                flbnHtml += '<div id="flbnNavAside" class="nav_aside2 close">                                            ';
				                flbnHtml += '  <div class="btns_area">                                                                  ';
				                flbnHtml += '    <a href="#" id="ui_btn" class="'+ui_btn+'">';
				                if(flbnDataObj.members.템플릿설정구분.value=='01'){
				                	flbnHtml += '		<span class="detail_area">'+flbnDataObj.members.메시지내용.value+'</span></a>                            ';
				                }else{
				                	flbnHtml += '		<div class="detail_area">'+flbnDataObj.members.메시지내용.value+'</div></a>                            ';
				                }
				                
				                
				                
				                flbnHtml += '    <a href="#" class="'+nav_close+' closeBtn">닫기</a>';
				                //if(flbnDataObj.members.노출거부추가여부.value != '' && flbnDataObj.members.노출거부추가여부.value != '0'){
				                if(flbnDataObj.members.노출거부추가여부 
				                		&& flbnDataObj.members.노출거부추가여부.value 
				                		&& flbnDataObj.members.노출거부추가여부.value == '1' ){
				                	flbnHtml += '<div class="review_area">';
				                	flbnHtml += '<input type="checkbox" name="reviewYN" value=""/> <label for="reviewYN">다시보지않기</label>';
				                	flbnHtml += '</div>';
				                }
				                flbnHtml += '  </div>                                                                                   ';
				                flbnHtml += '</div>                                                                                     ';
				                flbnHtml += '</div>                                                                                     ';
				            	
				                cmpgnApnd(flbnHtml);
				            }
						},function(){},flbnDataObj.members.플로팅배너ID.value);
					}
				}
	
			}catch(e){
				
			}
		}
	
		function flbn_goPage(pageId, cmpgnId, sevrMod) {
			var param= {};
			if(pageId == "D000855" 
				|| pageId == "C100585"
				|| pageId == "C100632"
				|| pageId == "C100633"
				|| pageId == "C100634"
				|| pageId == "C100635"
				|| pageId == "C100636") {
				if(sevrMod == "D") {
					param.상담전화번호 = "0263092276,";
				} else if(sevrMod == "T") {
					param.상담전화번호 = "0263092277,";
				} else {
					param.상담전화번호 = "18336405,";
				}
	
				param.추가데이터1 = cmpgnId;
				param.SSO메세지채널구분 = "78"; // 스타뱅킹
				if(pageId == "C100636") {	// 리브
					param.SSO메세지채널구분 = "83";
				} else if(pageId == "C100632") {	// 리브똑똑
					param.SSO메세지채널구분 = "84";
				} else if(pageId == "C100585") {	// 마이머니
					param.SSO메세지채널구분 = "80";
				} else if(pageId == "C100634") {	// 리브온
					param.SSO메세지채널구분 = "82";
				} else if(pageId == "C100633") {	// 스타알림
					param.SSO메세지채널구분 = "85";
				} else if(pageId == "C100635") {	// 스타기업뱅킹
					param.SSO메세지채널구분 = "81";
				}
	
				window.appManager.openWebViewWithClose("/mquics?page="+pageId, param, function(){});
			} else if(pageId == "C100442") {
				param.캠페인ID = cmpgnId;
				window.appManager.openWebViewWithClose("/mquics?page="+pageId, param, flbn_goPengangCnsel);
			} else {
				window.navi.navigate('/mquics?page='+pageId, {bannerEventId:cmpgnId}, function(){});
			}
		}
	
		function flbn_goPengangCnsel(data){
			if(data.goListyn == "Y"){
				window.navi.navigateWithInit('/mquics?page=C100441','', function(){});
			}
		}
	
		function flbn_etcGoPage(pageId, param) {
			window.navi.navigate('/mquics?page='+pageId, param, function(){});
		}
	
		function getCmpgnToday(){
			var today = new Date();
	
		    var year = today.getFullYear();
		    var month = today.getMonth()+1;
		    if(month<10){
		    	month = "0"+month;
		    }
		    var day = today.getDate();
		    if(day<10){
			    day = "0"+day;
			}
	
		    return year+""+month+""+day;
		}
		function getLastDayOfMonth1(year, month) {
		    var tempDay = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
	
		    if(((year %4 ==0) && (year%100!=0)) ||(year%400 ==0))
		        tempDay[1] = 29;
		        else
		        tempDay[1] = 28;
	
		    return tempDay[month];
		}
	
	
		function setCmpgnObj(type,cmpgnID,val){
			if(type=="1"){
				window.UserPreference.getValue(function(data) {
					var infoData = !$.isEmptyObject(data) ? JSON.parse(data) : {};
					if(!$.isEmptyObject(infoData)){
						infoData.cmpgnID = val.cmpgnID;
						infoData.viewFlag = val.viewFlag;
						infoData.viewCnt = val.viewCnt;
						infoData.viewType = val.viewType;
						infoData.endDate = val.endDate;
					}else{
						infoData = val;
					}
					
					var JData = JSON.stringify(infoData);
					window.UserPreference.setValue(function() {}, function() {}, cmpgnID, JData);
				}, function() {},cmpgnID);
			}else if(type=="2"){
				window.UserPreference.getValue(function(data) {
					var infoData = !$.isEmptyObject(data) ? JSON.parse(data) : {};
					infoData.viewFlag = val.viewFlag;
					var JData = JSON.stringify(infoData);
					window.UserPreference.setValue(function() {}, function() {}, cmpgnID, JData);
				}, function() {},cmpgnID);
			}
		}
		function viewCheckFunction(flbnDataObj,lData){
			var thisDate = getCmpgnToday();	//오늘일자.
			var cmpgnID = flbnDataObj.members.플로팅배너ID.value;
			var viewType = "0";	//중복구분값
			var viewCnt = 0;	//중복횟수
			var endDate = "";	//대상일자
			var viewFlag = "";	//노출여부
			
			/**
			 * 
			 * 중복제거구분(피로도) 체크
			 * 1.노출여부체크
			 * 2.노출시간체크
			 * "V플로팅배너ID=노출종료년월일" 값으로 쿠키입력.
			 *  종료일까지 보여주지않게 작업.
			 * */
			
			//노출여부 - viewFlag에 값이 있으면 노출안함.
			viewFlag = (!$.isEmptyObject(lData) && lData.viewFlag) ? lData.viewFlag : ""; //getCmpgnCookie("V"+flbnDataObj.members.플로팅배너ID.value);
			if($.isEmptyObject(viewFlag) != true){ //빈값이 아닐떄.
				if(thisDate  <= viewFlag){
					//노출 횟수 및 다시보지않기 선택시 IMDG 삭제
					kbstar.connect.request('/mquics?QAction=1014565',  {}, function() {}, function() {}, true);
					return false;
				}
			}
			//노출날짜체크
			if(flbnDataObj.members.노출시작년월일.value > thisDate || flbnDataObj.members.노출종료년월일.value < thisDate ){
				//노출 횟수 및 다시보지않기 선택시 IMDG 삭제
				kbstar.connect.request('/mquics?QAction=1014565',  {}, function() {}, function() {}, true);
				return false;
			}
			//노출시간체크
			if(flbnDataObj.members.노출시작년월일.value <= thisDate && flbnDataObj.members.노출종료년월일.value  >=thisDate ){
				var date1 = new Date();
				var tmpTime = date1.getHours() + "";
				tmpTime = tmpTime.length > 1 ? tmpTime :"0"+tmpTime;
				tmpTime = tmpTime +""+ date1.getMinutes(); 
				
				if(flbnDataObj.members.노출시작시분.value > tmpTime || flbnDataObj.members.노출종료시분.value < tmpTime ){
					//노출 횟수 및 다시보지않기 선택시 IMDG 삭제
					kbstar.connect.request('/mquics?QAction=1014565',  {}, function() {}, function() {}, true);
					return false;
				}
			}else{
				//노출 횟수 및 다시보지않기 선택시 IMDG 삭제
				kbstar.connect.request('/mquics?QAction=1014565',  {}, function() {}, function() {}, true);
				return false;
			}
			//
			/**
			 * 
			 * 중복제거구분(피로도) 체크
			 * 1.쿠키정보 있을떄.
			 * 2.쿠키정보 없을때.
			 * 2.1. 당일체크(당일)
			 * 2.2. 당월체크(노출종료일의 마지막 월)
			 * 2.3. 캠페인체크(노출종료일)
			 * Dup플로팅배너ID=중복구분값|중복횟수|대상일자 와 같이 작업.
			 * */
			if(flbnDataObj.members.중복제거구분.value && flbnDataObj.members.중복제거구분.value != '0' && flbnDataObj.members.중복제거구분.value != ''){
	//			var dupInfo = getCmpgnCookie("Dup"+flbnDataObj.members.플로팅배너ID.value);	//1:당일,  2 : 당월, 3:캠페인기간
	//			
	//			var viewInfo = dupInfo ? dupInfo.split("|") : [];
				
				if(!$.isEmptyObject(lData)){
					viewType = lData.viewType ? lData.viewType : "0";	//중복구분값
					viewCnt = typeof(lData.viewCnt) != 'undefined' ? Number(lData.viewCnt) : 0;
					endDate = lData.endDate ? lData.endDate : "";	//대상일자
	
					var exDate = "";//종료일자
					var setVal = "";//쿠키에담을 데이터 - '중복구분값|중복횟수|대상일자'
					//alert("thisDate="+thisDate +"|endDate="+endDate+"|viewCnt="+viewCnt + "|중복횟수=" + flbnDataObj.members.중복횟수.value);
					if(viewType=="1"){	//1.1.캠페인당일
						//if(thisDate != endDate && viewCnt < flbnDataObj.members.중복횟수.value){	//날짜 다를떄
						if(thisDate != endDate){	//날짜 다를떄
							exDate = getCmpgnToday();
							
							viewType = ""+flbnDataObj.members.중복제거구분.value;	//중복구분값
							viewCnt = 1;	//중복횟수
							endDate = ""+thisDate;	//대상일자
							var tmpObj = {
									"cmpgnID" : cmpgnID,
									"viewFlag" : viewFlag,
									"viewType" : viewType,
									"viewCnt" : viewCnt+"",
									"endDate":endDate
							};
							
							setCmpgnObj("1",cmpgnID,tmpObj);
						}else if(thisDate == endDate && viewCnt < flbnDataObj.members.중복횟수.value){	//날짜가같고 
							viewCnt = (viewCnt*1) + 1;
							viewType = ""+flbnDataObj.members.중복제거구분.value;	//중복구분값
							endDate = ""+thisDate;	//대상일자
							var tmpObj = {
									"cmpgnID" : cmpgnID,
									"viewFlag" : viewFlag,
									"viewType" : viewType,
									"viewCnt" : viewCnt+"",
									"endDate":endDate
							};
							
							setCmpgnObj("1",cmpgnID,tmpObj);
						}else{
							//노출 횟수 및 다시보지않기 선택시 IMDG 삭제
							kbstar.connect.request('/mquics?QAction=1014565',  {}, function() {}, function() {}, true);
							return false;	//횟수 초과
						}
					}else if(viewType=="2"){//1.2.캠페인당월
						
						if(thisDate <= endDate && viewCnt < flbnDataObj.members.중복횟수.value){	//날짜 다를떄
							viewCnt =(viewCnt*1) + 1;//중복횟수
							viewType = ""+flbnDataObj.members.중복제거구분.value;	//중복구분값
							endDate = ""+thisDate;	//대상일자
							var tmpObj = {
									"cmpgnID" : cmpgnID,
									"viewFlag" : viewFlag,
									"viewType" : viewType,
									"viewCnt" : viewCnt+"",
									"endDate":endDate
							};
							
							setCmpgnObj("1",cmpgnID,tmpObj);
						}else{
							return false;	//횟수 초과
						}
					}else if(viewType=="3"){//1.3.캠페인당
						if(viewCnt < flbnDataObj.members.중복횟수.value){	//날짜가같고 
							viewCnt = (viewCnt*1) + 1;//중복횟수
							viewType = ""+flbnDataObj.members.중복제거구분.value;	//중복구분값
							endDate = ""+thisDate;	//대상일자
							var tmpObj = {
									"cmpgnID" : cmpgnID,
									"viewFlag" : viewFlag,
									"viewType" : viewType,
									"viewCnt" : viewCnt+"",
									"endDate":endDate
							};
							setCmpgnObj("1",cmpgnID,tmpObj);
						}else{
							//노출 횟수 및 다시보지않기 선택시 IMDG 삭제
							kbstar.connect.request('/mquics?QAction=1014565',  {}, function() {}, function() {}, true);
							return false;	//횟수 초과
						}
					}
				}else{
					//2.새로 등록시.
					var exDate = "";
					if(flbnDataObj.members.중복제거구분.value == "1"){	//2.1캠페인 당일
						exDate = getCmpgnToday();
					}else if(flbnDataObj.members.중복제거구분.value == "2"){//2.2.캠페인 당월 
						var tmpEndDate = flbnDataObj.members.노출종료년월일.value;
						tmpEndDate = tmpEndDate.substring(0,6);
						var tmpLastDay = getLastDayOfMonth1(tmpEndDate.substring(0,4)*1, tmpEndDate.substring(4,6)*1);
						exDate = tmpEndDate+""+tmpLastDay;
					}else if(flbnDataObj.members.중복제거구분.value == "3"){//2.3.캠페인 당
						exDate = flbnDataObj.members.노출종료년월일.value;
					}
					viewType = ""+flbnDataObj.members.중복제거구분.value;	//중복구분값
					endDate = ""+exDate;	//대상일자
					var tmpObj = {
							"cmpgnID" : flbnDataObj.members.플로팅배너ID.value,
							"viewFlag" : "",
							"viewType" : viewType,
							"viewCnt" : "1",
							"endDate":endDate
					};
					setCmpgnObj("1",cmpgnID,tmpObj);
				}
			}else{
				
				var tmpObj = {
					"cmpgnID" : flbnDataObj.members.플로팅배너ID.value,
					"viewFlag" : (!$.isEmptyObject(lData) && lData.viewFlag) ? lData.viewFlag : "",
					"viewType" : "0",
					"viewCnt" : "0",
					"endDate":flbnDataObj.members.노출종료년월일.value
				};
				setCmpgnObj("1",cmpgnID,tmpObj);
				
			}
			return true;
		}
	
	
		function appLink(appNum, movepage){
			
			var appName = "";
			var androidPkg = "";
			var iospkg = "";
			var androidStoreUrl = "";
			var iosStoreUrl = "";
			var urlScheme = "";
			switch(appNum) {
			
			//id=sso와 web 차이 확인필요.
				case '02' :
					// 스타뱅킹
					appName = "스타뱅킹";
					androidPkg = "com.kbstar.kbbank";
					iospkg = "kbbank://";
					androidStoreUrl = "https://play.google.com/store/apps/details?id=com.kbstar.kbbank";
					iosStoreUrl = "https://play.google.com/store/apps/details?id=com.kbstar.kbbank";
					urlScheme = "kbbank://call?cmd=move_to&id=web&url=/mquics?page="+movepage;
					break;
				case '03' :
					// 리브
					appName = "리브";
					androidPkg = "com.kbstar.liivbank";
					iospkg = "liivbank://";
					androidStoreUrl = "https://play.google.com/store/apps/details?id=com.kbstar.liivbank&hl=ko";
					iosStoreUrl = "https://itunes.apple.com/app/id1126232922?mt=8";
					urlScheme = "liivbank://call?cmd=move_to&id=web&url=/mquics?page="+movepage;
					break;
				case '04' :
					// 리브 똑똑
					appName = "리브 똑똑";
					androidPkg = "com.kbstar.liivtalk";
					iospkg = "liivtalk://";
					androidStoreUrl = "https://play.google.com/store/apps/details?id=com.kbstar.liivtalk";
					iosStoreUrl = "https://itunes.apple.com/app/id1255058366?mt=8";
					urlScheme = "liivtalk://call?cmd=move_to&id=web&url=/mquics?page="+movepage;
					break;
				case '05' :
					// 마이머니
					appName = "KB마이머니";
					androidPkg = "com.kbstar.kbpfm";
					iospkg = "kbpfm://";
					androidStoreUrl = "https://play.google.com/store/apps/details?id=com.kbstar.kbpfm";
					iosStoreUrl = "https://itunes.apple.com/app/id1141323821";
					urlScheme = "kbpfm://call?cmd=move_to&id=sso&url=/mquics?page="+movepage;
					break;
				case '06' :
					// KB부동산
					appName = "KB부동산 Liiv ON";
					androidPkg = "com.kbstar.kbland";
					iospkg = "kbland://";
					androidStoreUrl = "https://play.google.com/store/apps/details?id=com.kbstar.kbland";
					iosStoreUrl = "https://itunes.apple.com/kr/app/kbbudongsan-r-easy/id597333937?mt=8";
					urlScheme = "kbland://call?cmd=move_to&id=sso&url=/mquics?page="+movepage;
					break;
			}
		//window.configManager.appLinkWithScheme(ssoinfo.aosPkg, ssoinfo.iosPkg, ssoinfo.aosStoreUrl, ssoinfo.iosStoreUrl, ssoinfo.appName, ssoinfo.urlScheme);
			window.configManager.appLinkWithScheme(androidPkg, iospkg, androidStoreUrl, iosStoreUrl, appName, urlScheme);
		}

		/**
		 * 시작일과 종료일이 있고, 종료일을 기준으로 시작일을 해당 interval만큼 계산해서 리턴한다.
		 * 0  : 3일전
		 * 1  : 1주일 전
		 * 2  : 1개월 전
		 * 3  : 3개월 전
		 * 4  : 6개월 전
		 * 5  : 12개월 전
		 * 6 : 18개월 전
		 * 7 : 24개월 전
		 * 8 : 36개월 전
		 * 9  : 1년전
		 * 10  : 3년전
		 * 11  : 5년전
		 */
		function getShiftDateCBR(type, dt){
		    var retVal = "" ;
		    var i = parseInt(type);
		    
		    switch(i) {
		        case 0:
		            retVal = shiftDateCBR(dt, 0, 0, -3 );
		            break;  
		        case 1:
		            retVal = shiftDateCBR(dt, 0, 0, -7 );
		            break;
		        case 2:
		            retVal = shiftDateCBR(dt, 0, -1, 0 );
		            break;
		        case 3: 
		            retVal = shiftDateCBR(dt, 0, -3, 0 );
		            break;
		        case 4:
		            retVal = shiftDateCBR(dt, 0, -6, 0 );
		            break;
		        case 5:
		            retVal = shiftDateCBR(dt, 0, -12, 0 );
		            break;
		        case 6:
		            retVal = shiftDateCBR(dt, 0, -18, 0 );
		            break;
		        case 7:
		            retVal = shiftDateCBR(dt, 0, -24, 0 );
		            break;
		        case 8:
		            retVal = shiftDateCBR(dt, 0, -36, 0 );
		            break;
		        case 9:
		            retVal = shiftDateCBR(dt, -1, 0, 0 );
		            break;
		        case 10:
		            retVal = shiftDateCBR(dt, -3, 0, 0 );
		            break;
		        case 11:
		            retVal = shiftDateCBR(dt, -5, 0, 0 );
		            break;   
		    }
		    return retVal ;
		}

		/**
		 *  날짜를 y, m, d만큼 이동해서 리턴 (dt : YYYYMMDD(문자열), 리턴타입 : YYYYMMDD)
		 *  y, m, d : +는 주어진 날짜를 앞으로 이동(더하기), -는 주어진 날짜를 뒤로 이동(빼기)
		 *  (2002.06.08)
		 */
		function shiftDateCBR(dt,y,m,d)
		{
		    var org_dt = new Date();
		    var yy = dt.substr(0, 4);
		    var mm = dt.substr(4, 2);
		    var dd = dt.substr(6, 2);
		    org_dt.setYear(yy);
		    org_dt.setMonth(mm-1);
		    org_dt.setDate(dd);
		    var new_dt = org_dt;
		    new_dt.setDate(org_dt.getDate()+ d);
		    new_dt.setMonth(new_dt.getMonth()+ m);
		    new_dt.setYear(new_dt.getFullYear()+ y);
		    
		    var n_yy  = new_dt.getFullYear();
		    var n_mm = new_dt.getMonth()+1;
		    var n_dd   = new_dt.getDate();
		    
		    if (("" + n_mm).length == 1) {
		        n_mm = "0" + n_mm;
		    }
		    if (("" + n_dd).length   == 1)  {
		        n_dd = "0" + n_dd;
		    }
		    
		    return ""+n_yy+n_mm+n_dd;
		}

		return{
			 StringBuffer
			,fnReplaceAll
			,fnRemoveComma
			,fnRemoveSpace
			,fn_goPage
			,fn_goPageWith
			,fn_goPageWithClose
			,fn_prdAllDownload
			,fn_callPrdManualpdfView
			,fn_callFxPrdManualpdfView
			,fn_allCheckedBoolean
			,fn_allDisableCancel
			,uf_submitMbank
			,uf_submitMbankCallback
			,CertManager31
			,fn_mobileEmailValidation
			,successCall_email
			,failCall_email
			,fn_sendEmailCheck
			,successCall_UserPreference
			,failCall_UserPreference
			,sendEmail
			,caq_commonError
			,formatCurrency
			,setEmpNoTag
			,MBK_ChangeDate
			,showConvert
			,getshiftDate
			,shiftDate
			,MBK_ViewCalendar1
			,MBK_ViewCalendar2
			,MBK_ViewCalendar3
			,MBK_ViewCalendar3_BTN
			,MBK_ViewCalendar1Eng
			,MBK_ViewCalendar2Eng
			,MBK_ViewCalendar3Eng
			,Car_InqChange
			,InqChange_successCallback
			,InqChangeFx_successCallback
			,InqChange_failCallback
			,AcnInq
			,AcnInq_successCallback
			,fn_adminRegData_move
			,MBK_ChangeDateCBR
			,fn_mobileOpenWeb
			,fn_ChangePrdInfoArray
			,fn_SmsReturnUrl
			,_exec_delay
			,chkUserAgentForOninputEvent
			,CAR_MergePoinTreeInq
			,successCallPoinTreeInq
			,checkPoinTreeValue
			,checkPoinTreeValueForTrsacc
			,openLiivMateUrl
			,compareVersion
			,Car_InqChange_acct
			,chkContStr
			,flbn_successCallback
			,flbn_goPage
			,flbn_goPengangCnsel
			,flbn_etcGoPage
			,getCmpgnToday
			,getLastDayOfMonth1
			,setCmpgnObj
			,viewCheckFunction
			,appLink
			,getShiftDateCBR
			,shiftDateCBR
		}
    }
    window.MN_BANK = new MN_BANK();
    
    if(!kbstar.hasResource("DeviceResource")) {
        kbstar.addResource("DeviceResource");
        const DeviceResource = function() {
        	/**
             * Toast 메세지 띄우기
             * 시뮬레이터 모드와 앱 버전 5.1.0 미만에서는 alert box로 대체함.
             * @param successCallback 성공콜백
             * @param failCallback 실패콜백
             * @param message 메세지내용
             * @param durationType 지속시간 : short=3초, long=5초
             */
        	 function showToastMsg(successCallback, failCallback, message, durationType) {
                if (device.platform.match(/Orchestra Simulator/) || (window.MN_BANK.compareVersion(device.appVersion, '5.1.0') < 0)) {
                	// 5.1.0 미만일 때
                	alert(message);
                }
                else {
                	if(durationType == "" || durationType == undefined){
                		durationType = "short";
                	}
                    kbstar.exec(successCallback, failCallback, "DeviceResource", "showToastMsg", {"message" : message, "durationType" : durationType});
                }
            };
            
            /**
             * 캡쳐이미지 공유하기
             * 
             * @param {Function}
             *            callbackSuccess
             * @param {Function}
             *            callbackFail
             * @param {String}
             *            저장될 파일명 (미지정시 유닉스 타임)
             * @param {String}
             *            param 캡쳐할 엘리먼트 ID
             * callbackSuccess()
             * callbackFail()
             */
            function shareCapture(callbackSuccess, callbackFail, fileName, elementId) {
            	//elementId = "#"+elementId;
            	elementId = elementId;
        		elelmentObj  =  document.getElementById(elementId);
        		let params = {};
        		if(fileName == null || fileName == undefined || fileName.trim() == ""){
        			fileName = new Date().getTime();
        		}
        		params.fileName = fileName;
        		params.posX  = parseInt(elelmentObj.getBoundingClientRect().left);
                params.posY  = parseInt(elelmentObj.getBoundingClientRect().top);
                params.width = parseInt(elelmentObj.getBoundingClientRect().width);
                params.height = parseInt(elelmentObj.getBoundingClientRect().height);
                params.documentWidth = parseInt(document.body.clientWidth);
                params.documentHeight = parseInt(document.body.clientHeight);
        		kbstar.exec(callbackSuccess, callbackFail,  "DeviceResource", "shareCapture", params);
            };
            
            /**
             * 문자열 공유하기
             * @param successCallback 성공콜백
             * @param failCallback 실패콜백
             * @param shareText 공유할 문자열
             */
            function shareTextMsg(successCallback, failCallback, shareText) {
                
                kbstar.exec(successCallback, failCallback, "DeviceResource", "shareTextMsg", { "shareText" : shareText });
            };
            
            /**
             * 문자열 클립보드에 복사
             * @param copyStr 복사할 문자열
             * @param successCallback 성공콜백
             * @param failCallback 실패콜백
             */
            function clipboardCopy(successCallback, failCallback, copyStr) {
            	
        	    kbstar.exec(successCallback, failCallback, "DeviceResource", "clipboardCopy", {"copyStr" : copyStr});
            };
            
            
            /**
			 * Notification 보이기
			 * @param successCallback 성공콜백
			 * @param failCallback 실패콜백
			 * @param param
			 *        { 
			 *            type    : "2"    // 표시타입(1:즉시(안드로이드, IOS 10이상만 가능), 2:백드라운드로 내려갈때)
			 *          , title   : "제목" // Notification 제목
			 *          , message : "내용" // Notification 내용
			 *        }
			 */
			showNotification = function( successCallback, failCallback, param ) {
				kbstar.exec( successCallback, failCallback, "DeviceResource", "showNotification",  param );
			};
            
		 /**
		    * 현재 밝기 정보 얻기
		    * @param successCallback 성공콜백
		    * @param failCallback 실패콜백
		    */
		   getScreenBrightness = function( successCallback, failCallback) {
		    kbstar.exec( successCallback, failCallback, "DeviceResource", "getScreenBrightness",  {} );
		   };

		            
		   /**
		    * 새로운 밝기 정보 설정
		    * @param successCallback 성공콜백
		    * @param failCallback 실패콜백
		    * @param brightness 밝기값 0 ~ 1
		    */
		   setScreenBrightness = function( successCallback, failCallback, brightness ) {
		          let params = {brightness : brightness};

		    kbstar.exec( successCallback, failCallback, "DeviceResource", "setScreenBrightness",  params );
		   };

            /**
			 * 앱 아이콘 뱃지 삭제 (Android - 노티피케이션도 함께 삭제)
			 */
			clearBadge = function() {
				kbstar.exec(null, null, "DeviceResource", "clearBadge");
			};
			
		   /**
		    * 기기에 간편일련번호 저장 
		    * @param callbackSuccess 성공콜백
		    * @param callbackFail 실패콜백
		    * @param simpleSerno 기기에 저장할 간편일련번호값
		    */
			setSimpleSerno = function(callbackSuccess, callbackFail, simpleSerno){
				window.UserPreference.setValue(callbackSuccess, callbackFail, "simptyKey", simpleSerno);
			};

		   /**
		    * 기기에 저장된 간편일련번호 정보 얻기
		    * @param callbackSuccess 성공콜백
		    * @param callbackFail 실패콜백
		    * 
		    */
			getSimpleSerno = function(callbackSuccess, callbackFail){
				window.UserPreference.getValue(callbackSuccess, callbackFail, "simptyKey");
			};

			
            
            return {
            	'showToastMsg' : showToastMsg
            	, 'shareCapture' : shareCapture
            	, 'shareTextMsg' : shareTextMsg
            	, 'clipboardCopy' : clipboardCopy
            	, 'showNotification' : showNotification
            	, 'getScreenBrightness' : getScreenBrightness
                , 'setScreenBrightness' : setScreenBrightness
                , 'clearBadge' : clearBadge
                , 'setSimpleSerno' : setSimpleSerno
                , 'getSimpleSerno' : getSimpleSerno
            } 
        };
        

        kbstar.addConstructor(function() {
            window.DeviceResource = new DeviceResource();
        });
    }
