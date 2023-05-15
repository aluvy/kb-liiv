/*  빈값체크 */
function isEmpty(data){
	var b = false;
	
	switch(typeof(data)){
	case 'function':
		b = false;
		break;
	case 'object':
		if(data == null){
			b = true;
		}else if(JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]'){
			b = true; 
		}
		break;
	case 'string':
		if(!data.trim()){
			b = true;
		}
		break;
	case 'undefined':
		b = true;
		break;
	default:
		if(isNaN(data)){
			b = true;
		}
		break;
	}
	
	return b;
}

/**
 * 두 날짜 사이 일자 반환
 * @param _date1 시작일(YYYYMMDD)
 * @param _date2 종료일(YYYYMMDD)
 * @returns 차이일
 */
function getDateDiff(_date1, _date2) {

	if (_date1 == null || _date1 == '')
		return '';
	if (_date2 == null || _date2 == '')
		return '';
	if (!/^(\d){8}$/.test(_date1))
		return "invalid date";
	if (!/^(\d){8}$/.test(_date2))
		return "invalid date";

	var yy1 = _date1.substr(0, 4), mm1 = _date1.substr(4, 2) - 1, dd1 = _date1
			.substr(6, 2);

	var diffDate_1 = new Date(yy1, mm1, dd1);

	var yy2 = _date2.substr(0, 4), mm2 = _date2.substr(4, 2) - 1, dd2 = _date2
			.substr(6, 2);

	var diffDate_2 = new Date(yy2, mm2, dd2);

	var diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
	diff = Math.ceil(diff / (1000 * 3600 * 24));
	diff = diff + 1;
	return diff;
}

/**
 *  alert 팝업
 *  opt = {
 *		  	msg : 팝업에 표시할 메시지 - 필수
 *			cfrmYn : 팝업타입(false인경우 일반 alert형태, true인경우 confirm) - 필수 
 *			title : 팝업에 표시할 제목(값이 없으면 제목영역생성안함)
 *			cancelBtnText : '취소' 버튼 표시 대신할 문자열
 *			okBtnText : '확인' 버튼 표시 대신할 문자열
 *			cancelCallback :   '취소' 버튼 발생이벤트 혹은 Object ID
 *			cancelParam :   '취소' 버튼 발생이벤트 파라미터
 *			okCallback : '확인' 버튼 발생이벤트 혹은 Object ID
 *			okParam : '확인' 버튼 발생이벤트 파라미터
 * }                   
 * 
 */
let context = {};
let paramMode = {};

function popalarm(opt) {
	
		if(getOsInfo().indexOf("app") === -1 || 
				(!isEmpty(opt.okParam) && opt.okParam == '/info/agree/benefit-info-agree')){
			setTimeout(()=>{
				$('#confirmPopup > .ly_cnt > .section').html(opt.msg);
				if(!opt.cfrmYn){
					$("#btnPopCancel").hide();
				}else{
					$("#btnPopCancel").show();	
				}
				
				if(!isEmpty(opt.okBtnText)){
					$("#btnPopOk").text(opt.okBtnText);
				}
				
				if(!isEmpty(opt.cancelBtnText)){
					$("#btnPopCancel").text(opt.cancelBtnText);
				}
				
				$.ohyLayer({    
					titleUse: isEmpty(opt.title) ? false : true,             
							title:opt.title,
							content:'#confirmPopup',
							type:'confirm', 
							closeUse:false,        
							closeAct:true,         
				});
				
				$(document).one("click", '#btnPopOk', function (e){
					if (typeof opt.okCallback === "function") {
						e.preventDefault();
						setTimeout(function(){ opt.okCallback.call(opt.okCallback, opt.okParam); }, 10);
						//setTimeout(function(){ opt.okCallback.call(); }, 10);
						$("#btnPopOk").unbind("click");
						$(document).off("click", "#btnPopCancel");
					} else if (typeof opt.okCallback === "string" && !isEmpty(opt.okCallback)) {
						setTimeout(function(){ $('#'+opt.okCallback).focus(); }, 1);
					}else{
						$(document).off("click", "#btnPopCancel");
					}
				});
				$(document).one("click", '#btnPopCancel', function (e){
					if (typeof opt.cancelCallback === "function") {
						e.preventDefault();
						opt.cancelCallback.call(opt.cancelCallback, opt.cancelParam);  
						//opt.cancelCallback.call();  
						$("#btnPopCancel").unbind("click");
						$(document).off("click", "#btnPopOk");
					} else if (typeof opt.cancelCallback === "string" && !isEmpty(opt.cancelCallback)) {
						setTimeout(function(){ $('#'+opt.cancelCallback).focus(); }, 1);
					}else{
						$(document).off("click", "#btnPopOk");
					}			
				});
			}, 251);
		}else{
			context = {};
			paramMode = {};

			opt.cfrmYn = opt.cfrmYn == true ? "Y" : "N"; 
			if(typeof opt.cancelCallback === "function"){
				context[opt.cancelCallback.name] = opt.cancelCallback;
				opt.cancelCallback = opt.cancelCallback.name;
								
				if(typeof opt.cancelParam == 'object'){
					paramMode[opt.cancelCallback.name] = 'object';
					opt.cancelParam = JSON.stringify(opt.cancelParam);
				}else if(!isEmpty(opt.cancelParam) && typeof opt.cancelParam == 'string'){
					paramMode[opt.cancelCallback.name] = 'string';
				}
			}else if(typeof opt.cancelCallback === "string" && isEmpty(opt.cancelParam)){
				opt.cancelParam = opt.cancelCallback;
				opt.cancelCallback = setFocus;

				context['setFocus'] = opt.cancelCallback;
			}
			
			if(typeof opt.okCallback === "function"){
				context[opt.okCallback.name] = opt.okCallback;
				opt.okCallback = opt.okCallback.name;
				
				if(typeof opt.okParam == 'object'){
					paramMode[opt.okParam.name] = 'object';
					opt.okParam = JSON.stringify(opt.okParam);
				}else if(!isEmpty(opt.okParam) && typeof opt.okParam == 'string'){
					paramMode[opt.okParam.name] = 'string';
				}
			}else if(!isEmpty(opt.okCallback) && typeof opt.okCallback === "string" && isEmpty(opt.okParam)){
				opt.okParam = opt.okCallback;
				opt.okCallback = 'setFocus';

				context['setFocus'] = setFocus;
			}
			
			callAppService({
				action_code : 'A0317',
				action_param : 
				{
					 msg : opt.msg,
					 cfrmYn : opt. cfrmYn,
					 title : opt.title,
					 cancelBtnText : opt.cancelBtnText,
					 okBtnText : opt.okBtnText,
					 cancelCallback : (isEmpty(opt.cancelCallback) ? "" : opt.cancelCallback),
					 okCallback : (isEmpty(opt.okCallback) ? "" : opt.okCallback),
					 okParam : (isEmpty(opt.okParam) ? "" : opt.okParam),
					 cancelParam : (isEmpty(opt.cancelParam) ? "" : opt.cancelParam)
				}  
			});
		}
}

function execFn(fnName){
	let args = Array.prototype.slice.call(arguments, 1);
	if(paramMode[fnName] == 'object'){
		args[0] = JSON.parse(args[0]);
	}
	return context[fnName].apply(context, args);
}

function setFocus(id){
	$("#"+id).focus();
}

/**
 * 모달 레이어 팝업 공통
 * 1. 타이틀 설정이 필요없는 경우 레이어 아이디("#"제외) - 필수
 * 		modalLayer.show(target);
 * 2. 옵션 설정이 필요한 경우
 * 		modalLayer.show({
 * 			target.title			//옵션 
 * 			target.titleUse		//옵션, default "false" 
 * 			target.closeUse	//오른쪽 상단 닫기버튼 사용여부, default "true"
 * 			target.id				//필수입력, 레이어 아이디("#"제외)
 * 			target.type			//옵션, default "confirm", 레이어 타입 지정 (confirm, bottom)     
 * 		})
 *  3. 모달레이어 감추기
 *  	modalLayer.hide();
 */
window.modalLayer = {
	show:function(target){
		if(typeof target === 'string'){
    		  $.ohyLayer({
    			  titleUse: false,
    			  content: '#'+target,
    			  type: 'confirm',
    			  closeUse: false,                                     
    		  });           
		}else{
	        $.ohyLayer({
	            titleUse: (isEmpty(target.titleUse) ? false : target.titleUse),
	            title: (isEmpty(target.title) ? false : target.title),
	            content: '#'+target.id,
	            type: (isEmpty(target.type) ? 'confirm' : target.type),
	            closeUse: (isEmpty(target.closeUse) ? true : target.closeUse),                                     
	        });	  
    	}
     },
     hide:function(){
    	 if(johyLayer.instances.length > 0){
    		 $('.layer_wrap[aria-hidden=false]').find('.ly_in').addClass('off');
    		 johyLayer.instances.slice(-1)[0].close();
    	 }
     }
};

/*	주민번호 유효성 검사 */
 function checkJumin(chkNum){

	var strJumin = "" + chkNum;
	var checkBit = new Array(2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5);
	var num7 = strJumin.substr(6, 1);
	var num13 = strJumin.substr(12, 1);
	
    
	var total = 0;
	if (strJumin.length == 13) {
		for (i = 0; i < checkBit.length; i++) { // 주민번호 12자리를 키값을 곱하여 합산한다.
			total += strJumin.substr(i, 1) * checkBit[i];
		}
		// 외국인 구분 체크
		if (num7 == 0 || num7 == 9) { // 내국인 ( 1800년대 9: 남자, 0:여자)
			total = (11 - (total % 11)) % 10;
		} else if (num7 > 4) { // 외국인 ( 1900년대 5:남자 6:여자 2000년대 7:남자, 8:여자)
			total = (13 - (total % 11)) % 10;
		} else { // 내국인 ( 1900년대 1:남자 2:여자 2000년대 3:남자, 4:여자)
			total = (11 - (total % 11)) % 10;
		}
		
		//생년월일 검증 시작
		var birth_year = strJumin.substring(0,2);
		var birth_month = Number(strJumin.substring(2,4));
	    var birth_day   = Number(strJumin.substring(4,6));
	    
	    if(num7 == "1" || num7 == "2" || num7 == "5" || num7 == "6"){
	    	birth_year = "19" + birth_year;
	    }else if(num7 == "3" || num7 == "4" || num7 == "7" || num7 == "8"){
	    	birth_year = "20" + birth_year;
	    }
	    birth_year = Number(birth_year);
	    
	    if(birth_month < 1 || birth_month > 12){
	    	return false;
	    }
	    if(birth_day < 1 || birth_day > 31){
	    	return false;
	    }
	    if((birth_month == 4 || birth_month == 6 || birth_month == 9 || birth_month == 11) && birth_day == 31){
	    	return false;
	    }
	    if(birth_month == 2 ){
	    	var isleap = (birth_year % 4 == 0 && (birth_year % 100 != 0 || birth_year % 400 == 0));
	    	if(birth_day > 29 || (birth_day == 29 && !isleap)) {
	    		return false;	
	    	}
	    }
	    //생년월일 검증 종료


		if ( total != num13) {	
//			return false; //2020.05.26 행안부 개인정보보호강화 일환으로 뒷자리 검증항목 제거
			return true;
		}
		return true;
	} else {
		return false;
	}

	return true;
}

/*	외국인번호 유효성 검사	*/
function checkForeigner(chkNum) {

	var strJumin = "" + chkNum;
	var checkBit = new Array(2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5);
	var num7 = strJumin.substr(6, 1);
	var num13 = strJumin.substr(12, 1);
	var total = 0;
	if (strJumin.length == 13) {
		for (i = 0; i < checkBit.length; i++) { // 주민번호 12자리를 키값을 곱하여 합산한다.
			total += strJumin.substr(i, 1) * checkBit[i];
		}
		
		// 외국인 구분 체크
		if (num7 > 4) { // 외국인 ( 1900년대 5:남자 6:여자 2000년대 7:남자, 8:여자)
			total = (13 - (total % 11)) % 10;
		}

		if (total != num13) {
			return false;
		}
		return true;// 외국인
	} else {
		return false;
	}

	return true;
}

/*	미성년 체크	*/
function checkAdult(chkNum) {

	var today = new Date();
	
	var now_year  = today.getFullYear(); 
    var now_month = today.getMonth() + 1 ; // 0부터 시작하므로 1더함 더함
    var now_day   = today.getDate();
    
    var jumin = "" + chkNum;
    
    var birth_year  =  jumin.substring(0,2);
    var birth_month =  jumin.substring(2,4);
    var birth_day   =  jumin.substring(4,6);
    
    var sex  =  jumin.substring(6,7);
    
    var full_year = "";
    
    if(sex == "1" || sex == "2"){
    	full_year = "19" + birth_year;
    }else if(sex == "3" || sex == "4"){
    	full_year = "20" + birth_year;
    }
    
    var age = now_year - Number(full_year);
    
    var man_age = age;
    
    if(now_month < birth_month){
    	man_age = age - 1;
    }else if(now_month == birth_month){
    	if(now_day < birth_day){
    		man_age = age - 1;
    	}
    }
    	
    if(man_age >= 19){
    	return true;
    } else {
    	return false;
    }
}

/* --- 숫자만 리턴 --- */
function onlyNum(val)
{
	 var num = val;
	 var tmp = "";
	
	 for (var i = 0; i < num.length; i ++)
	 {
	  if ( (num.charAt(i) >= 0 && num.charAt(i) <= 9) || num.charAt(i) == '*')
	   tmp = tmp + num.charAt(i);
	  else
	   continue;
	 }
	 return tmp;
}

//숫자만
function onlyNumInput(obj)
{
	 $(obj).val( $(obj).val().replace( /[^0-9]/g, '' ) );// 숫자만입력
}

//숫자 입력필드
function onlyNumberInput(obj)
{
	 $(obj).val( $(obj).val().replace( /[^0-9\-\*]/g, '' ) );// 숫자만입력(*, - 제외)
}

/* --- 카드번호 형식 (onKeyUp 이벤트) --- */
function cardFormat(obj)
{
	 var str = onlyNum(obj.value);
	 var leng = str.length;
	
	 switch(leng)
	 {
	  case  1 :
	  case  2 :
	  case  3 :
	  case  4 : obj.value = str; break;
	  case  5 :
	  case  6 :
	  case  7 :
	  case  8 : obj.value = str.substring(0, 4) + "-" + str.substring(4, 8); break;
	  case  9 :
	  case 10 :
	  case 11 :
	  case 12 : obj.value = str.substring(0, 4) + "-" + str.substring(4, 8)  + "-" + str.substring(8, 12); break;
	  case 13 :
	  case 14 :
		  obj.value = str.substring(0, 4) + "-" + str.substring(4, 8) + "-" + str.substring(8, 12) + "-" + str.substring(12, 14); break;
	      break;
	  case 15 :
		  obj.value = str.substring(0, 4) + "-" + str.substring(4, 8) + "-" + str.substring(8, 12) + "-" + str.substring(12, 15); break;
	      break;
	  case 16 :
		  obj.value = str.substring(0, 4) + "-" + str.substring(4, 8) + "-" + str.substring(8, 12) + "-" + str.substring(12, 16); break;
	      break;
	 }
}

/* --- 카드번호 유효기간 형식 (onKeyUp 이벤트) --- */
function termFormat(obj)
{
	 var str = onlyNum(obj.value);
	 var leng = str.length;
	
	 switch(leng)
	 {
	  case  1 :
	  case  2 : obj.value = str; break;
	  case  3 :
	  case  4 : obj.value = str.substring(0, 2) + "/" + str.substring(2, 4); break;
	 }
}

//카드유효기간 날짜 체크
function chkValidTerm(mmyy){
	if(mmyy != null && mmyy.length > 4){
		var mm = mmyy.substring(0,2);
		if( Number(mm) > 12 ){
			return false;
		} else {
			var dt = new Date();
			var curyy = dt.getFullYear()+"";//현재년도
			var curmm = dt.getMonth()+1+"";//현재월

//console.log("curmm.length = " + curmm.length);

			if(curmm.length == 1){
				curmm = "0"+curmm;
			}

			curyy = curyy.substring(2,4);

			var yy = mmyy.substring(3,5);
//console.log(Number(yy+mm) + '   ' + Number(curyy+curmm) );
			if( Number(yy+mm) < Number(curyy+curmm) ){//현재년월 보다 작을때
				return false;
			} else {
				return true;
			}
		}
	}//end if
}

function maxLengthCheck(object){
    if (object.size >= object.maxLength){
        object.value = object.value.slice(0, object.maxLength);
    }
}

/* --- 운전면허번호 형식 (onKeyUp 이벤트) --- */
function driverFormat(obj)
{
	 var str = onlyNum(obj.value);
	 var leng = str.length;
	
	 switch(leng)
	 {
	  case  1 :
	  case  2 : obj.value = str; break;
	  case  3 :
	  case  4 :
	  case  5 :
	  case  6 :
	  case  7 :
	  case  8 : obj.value = str.substring(0, 2) + "-" + str.substring(2, 8); break;
	  case  9 :
	  case 10 :
		  obj.value = str.substring(0, 2) + "-" + str.substring(2, 8) + "-" + str.substring(8, 10); break;
	      break;
	 }

}

/* 날짜유효성체크 */
function isValidDate(param) {
    try
    {
        param = param.replace(/-/g,'');

        // 자리수가 맞지않을때
        if( isNaN(param) || param.length!=8 ) {
            return false;
        }

        var year = Number(param.substring(0, 4));
        var month = Number(param.substring(4, 6));
        var day = Number(param.substring(6, 8));

        //var dd = day / 0;

        if( month<1 || month>12 ) {
            return false;
        }

        var maxDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        var maxDay = maxDaysInMonth[month-1];

        // 윤년 체크
        if( month==2 && ( year%4==0 && year%100!=0 || year%400==0 ) ) {
            maxDay = 29;
        }

        if( day<=0 || day>maxDay ) {
            return false;
        }
        return true;

    } catch (err) {
        return false;
    }
}

/* 카드형식SET */
function cardNoFrmt(obj,gb)
{

	 var str = onlyNum(obj.value);
	 var leng = str.length;
	
	 switch(leng)
	 {
	  case  1 :
	  case  2 :
	  case  3 :
	  case  4 : //obj.value = str; break;
	  case  5 :
	  case  6 :
	  case  7 :
	  case  8 : //obj.value = str.substring(0, 4) + "-" + str.substring(4, 8); break;
	  case  9 :
	  case 10 :
	  case 11 :
	  case 12 : //obj.value = str.substring(0, 4) + "-" + str.substring(4, 8)  + "-" + str.substring(8, 12); break;
	  case 13 :
	  case 14 : obj.value = str.substring(0, 4) + "-" + "**" + "-" +  str.substring(6, 10)  + "-" + str.substring(10, 14);    break; //다이너스
	  case 15 : obj.value = str.substring(0, 4) + "-" + "***" + "-" + str.substring(7, 11) + "-" + str.substring(11, 15); break;//AMEX
	  case 16 :
		  		obj.value = str.substring(0, 4) + "-" + str.substring(4, 8) + "-" + "****" + "-" + str.substring(12, 16);  break;
		  //obj.value = str.substring(0, 4) + "-" + str.substring(4, 8) + "-" + str.substring(8, 12) + "-" + str.substring(12, 16); break;
	      break;
	 }

}

function crdNextPage(mod){
	var url = '';
	if(mod == 'P'){
		url = '/system/login/setPs';
	}else if(mod == 'I'){
		url = '/system/login/findIdCheck';
	} 
	
	$('#nextCrdForm')
	.attr("action", url)
	.attr("method", "post").submit();
}

function nextPage(mod){
	var url = '';
	if('P' == mod){
		url = '/system/login/setPs';
	}else if('I' == mod){
		url = '/system/login/findIdCheck';
	} 
	
	$('#nextForm')
	.attr("action", url)
	.attr("method", "post").submit();
}


var setCookie = function(name, value, day) {
	var date = new Date();
	date.setTime(date.getTime() + day*24*60*60*1000);
	document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
}

var getCookie = function(name) {
	var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	return value ? value[2] : null;
}

var deleteCookie = function(name) {
	var date = new Date();
	document.cookie = name + "= " + " expires=" + date.toUTCString() + "; path=/";
}

function goStep(frm,url) {
	$("#"+frm).attr("action", url);
	$("#"+frm).submit();
}


function getServerNow() {
	
	$.ajax({
	    url:  '/system/main/getServerNow',
	    type: 'POST',
	    success: function(data) {
	    	console.log(data.curdttm);
	    	return data.curdttm;
	    },
	    error: function(e) {
			console.log(e.responseText.trim());
			return '';
	    },
	    complete: function() {}
	});
	
	return '';
}

//문자열에서 공백제거
function removeStrSpace(str){
	var tmpStr = str;
	if(tmpStr != null){
		tmpStr = tmpStr.replace(/\s/gi,"");
	}
	return tmpStr;
}

//고객센터 클릭
function connectCallCenter() {
	let opt = {
			msg: "KB Liiv M 고객상담센터 1522-9999(유료) 로 연결하시겠습니까?",
			cfrmYn: true,
			okCallback: callbackCallCenter
	};
	popalarm(opt);
}

//고객센터 연결 콜백
function callbackCallCenter() {
	location.href="tel:1522-9999";
}

//114 클릭
function connectCall114() {
	let opt = {
			msg: "KB Liiv M 고객센터 114(무료, Liiv M 가입자 대상) 로 연결하시겠습니까?",
			cfrmYn: true,
			okCallback: callbackCall114
	};
	popalarm(opt);
}

//114 연결 콜백
function callbackCall114() {
	location.href="tel:114";
}

// 전문 prodNo
function getProdNoUseSvcNo(type) {
	// 퍼블확정되면 작업 (전화번호 목록 SET)
	var svcNoArray = $("#phoneNumber").val().split("-");
	var prodNo = '';
	if(type == 'svcTelNo'){
		if(svcNoArray.length==3) {
			prodNo = svcNoArray[0]+svcNoArray[1]+svcNoArray[2];	
		}
	}
	else{
		//console.log('type='+type);
		if(svcNoArray.length==3) {
			prodNo = svcNoArray[0]+'0'+svcNoArray[1]+svcNoArray[2];	
		}
	}
	return prodNo;
}


/**
 * 기준날짜에서 계산일자를 더한 날짜를 반환
 * 
 * @param date 기준날짜
 * @param calcVal 계산일자
 * @returns 계산결과날짜
 */
function calcDate(date, calcVal) {
//	if(!date || calcVal == 0) {
	if(!date) {
		return date;
	}
	var y, m, d;
	if(typeof date === 'string') {
		var nDate = numberFormatter(date);
		if(nDate.length === 8) {
			y = Number(nDate.substr(0, 4));
			m = Number(nDate.substr(4, 2))-1;
			d = Number(nDate.substr(6));
			date = new Date(y, m, d);
			date.setDate(date.getDate() + calcVal);
		}
	} else if(typeof date.getDate === 'function') {
		date.setDate(date.getDate() + calcVal);
	}
	return date;
}


/**
 * 기준날짜에서 계산일자를 더한 날짜를 반환
 * 
 * @param date 기준날짜
 * @param calcVal 계산일자
 * @returns 계산결과날짜
 */
function calcLocDttm(date, calcVal) {
	if(!date) {
		return date;
	}
//	calcVal = (32400+calcVal)/3600;
	var y, m, d, h, i, s;
	if(typeof date === 'string') {
		var nDate = numberFormatter(date);
		if(nDate.length === 14) {
			y = Number(nDate.substr(0, 4));
			m = Number(nDate.substr(4, 2))-1;
			d = Number(nDate.substr(6, 2));
			h = Number(nDate.substr(8, 2));
			i = Number(nDate.substr(10, 2));
			s = Number(nDate.substr(12, 2));
			date = new Date(y, m, d, h, i, s);
			date.setHours(date.getHours() - calcVal);
		}
	} else if(typeof date.getHours === 'function') {
		date.setHours(date.getHours() - calcVal);
	}
	return date;
}


function kcbReturnCode(resultCode){
	let strErr = '인증에 실패하였습니다. <br>신용카드 인증정보를 다시 확인해주세요.';
	
	switch(resultCode){
	case 'T090': 
		strErr = '인증에 실패하였습니다. 입력정보 또는 본인인증 대상 카드 여부를 확인해주세요.<br/><br/> 오류코드 ('+resultCode+')';
		break;
	case 'T091': 
		strErr = '인증에 실패하였습니다. 신용카드 발급사 확인이 필요합니다.<br/><br/> 오류코드 ('+resultCode+')';
		break;
	case 'T093': 
		strErr = '법인/가족/선불카드는 본인인증 대상 카드가 아닙니다.<br/><br/> 오류코드 ('+resultCode+')';
		break;
	case 'T095': 
		strErr = '체크카드는 이용이 불가합니다.<br/><br/> 오류코드 ('+resultCode+')';
		break;
	case 'T097': 
	case 'T098': 
	case 'T899': 
	case 'T998': 
	case 'T999': 
		strErr = '일시적인 시스템 오류입니다. 잠시 후 다시 시도해주세요.<br/><br/> 오류코드 ('+resultCode+')';
		break;
	case 'T099': 
		strErr = '인증에 실패하였습니다. 다시 시도해주세요.<br/><br/> 오류코드 ('+resultCode+')';
		break;
	case 'T100': 
		strErr = 'ARS인증 또는 앱카드 인증 완료 후 인증 완료를 선택해 주세요.<br/><br/> 오류코드 ('+resultCode+')';
		break;
	case 'T699': 
		strErr = '입력 카드사 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주시거나 다른 신용카드를 이용해주세요.<br/><br/> 오류코드 ('+resultCode+')';
		break;
	case 'T440': 
	case 'T441': 
	case 'T442': 
	case 'T443': 
		strErr = '인증 완료 중복 시도로 인한 인증 실패 입니다. 다시 시도해주세요.<br/><br/> 오류코드 ('+resultCode+')';
		break;
	case 'T599': 
		strErr = '인증 재시도 횟수 또는 인증 제한 시간이 초과 되었습니다. 다시 시도해주세요.<br/><br/> 오류코드 ('+resultCode+')';
		break;
	case 'T887': 
	case 'T888': 
		strErr = '카드사 시스템 점검으로 인하여 이용이 불가합니다. 다른 카드사를 이용해주시길 바랍니다.<br/><br/> 오류코드 ('+resultCode+')';
		break;
	}
	
	setTimeout( function(){
		popalarm({
			msg: strErr,
			cfrmYn: false
		});
	}, 500);
};

/**
 * 카드번호 자리수 체크
 * @param cardCd 카드사코드
 * @param cardNo 카드번호
 */
function digitCardNo(cardCd, cardNo) {
	if(isEmpty(cardCd) || isEmpty(cardNo)) {
		return false;
	}
	
	if(cardNo.length == 16) {
		return true;
	} else if(cardCd == "07" && cardNo.length == 14) { // 현대카드 다이너스
		return true;
	} else if(cardCd != "07" && cardNo.length == 15) { // AMEX
		return true;
	}
	
	return false;
};

function getPageId(){
	var pageId = "";
	try{
		pageId = location.href.substring(location.href.lastIndexOf('/') + 1);
		if(pageId.indexOf('?') > -1){
			pageId = pageId.substring(0,pageId.lastIndexOf('?'));
		}
		if(pageId == ""){
			pageId = "liivM"; 
		}
	}catch (e) {
		pageId = "liivM";
	}
	
	return pageId;
};

/**
 * 기기정보조회
 * ios_app: IOS App
 * android_app: Android App
 * ios: IOS Web
 * android: Android Web
 * @return OS 구분
 */
function getOsInfo(){
	let phoneInfo = navigator.userAgent.toLowerCase();
	let typeOS = 'others';
	
	if(phoneInfo.indexOf('liivm_ios') !== -1){
		typeOS = 'ios_app';
	}else if(phoneInfo.indexOf('liivm_android') !== -1){
		typeOS = 'android_app';
	}else if(phoneInfo.indexOf('iphone') !== -1){
		typeOS = 'ios';
	}else if(phoneInfo.indexOf('ipad') !== -1){
		typeOS = 'ios';
	}else if(phoneInfo.indexOf('android') !== -1){
		typeOS = 'android';
	}
	return typeOS;
}

/**
 * 전화번호 형식으로 리턴 
 */
function makeTelNumber(str){
	if(str == null || str == ""){ return str; }

	str = onlyNum(str);

	var len = str.length;
	var returnVal = "";
	var lastNumber = "";

	if( str.length <= 2 ){
		return returnVal;
	}else{
		if( str.indexOf("02") == 0 ){
			returnVal += str.substr(0,2) + '-';
			lastNumber = str.substr(2, str.length);
		}else if(str.indexOf("0") == 0 ){
			returnVal = str.substr(0,3) + '-';
			lastNumber = str.substr(3, str.length);
		}else{
			lastNumber = str;
		}

		switch(lastNumber.length){
			case 7 : 
				returnVal += (lastNumber.substr(0,3)+'-'+lastNumber.substr(3,7));
				break;
			case 8 : 
				returnVal += (lastNumber.substr(0,4)+'-'+lastNumber.substr(4,8));
				break;
			default : 
				returnVal += lastNumber;
				returnVal = onlyNum(returnVal);
				break;
		}
	}

	return returnVal;
}

function fnReplaceAll(str, searchStr, replaceStr){
	return str.split(searchStr).join(replaceStr);
}

function fnLpad(s, padLength, padString){
	if(padString == "" || padLength == 0 || s == "" || padString == undefined || padLength == undefined || s == undefined){
		return s;
	}
	if(padString.length > padLength){
		return s;
	}
	while(s.length < padLength){
		s = padString + s;
	}
	return s;
}

function fnCheckNull(val){
	if(val=="undefined" || val==undefined || val==null || val=="null") return "";
	else return val;
}

// 사업명 리턴
function getSoNm(soId) {
	var soNm = "";
	
	if(soId == "01") {
		soNm = "LG U+";
	} else if(soId == "02") {
		soNm = "KT";
	} else if(soId == "03") {
		soNm = "SKT";
	}
	
	return soNm; 
};

//아이디 값으로 비활성화(id)
var domDisabled = function(id) {
	$("#" + id).attr("disabled", "disabled");
};

// 아이디 값으로 비활성화(ids)
var domDisableds = function(ids) {
	$.each(ids, function(index, id) {
		domDisabled(id);
	});
};

// 아이디 값으로 활성화(id)
var domEnabled = function(id) {
	$("#" + id).removeAttr("disabled");
};

// 아이디 값으로 활성화(ids)
var domEnableds = function(ids) {
	$.each(ids, function(index, id) {
		domEnabled(id);
	});
};

/*
 * input value 초기화(id)
 */
var valueClear = function(id) {
	$("#" + id).val("");
};

/*
 * input value 초기화(ids)
 */
var valueClears = function(ids) {
	$.each(ids, function(index, id) {
		valueClear(id);
	});
};

// 아이디 값으로 dom show
var domShow = function(id) {
	$("#" + id).show();
};

// 아이디 값으로 dom show(ids)
var domShows = function(ids) {
	$.each(ids, function(index, id) {
		domShow(id);
	});
};

// 아이디 값으로 dom hide
var domHide = function(id) {
	$("#" + id).hide();
};

// 아이디 값으로 dom hide(ids)
var domHides = function(ids) {
	$.each(ids, function(index, id) {
		domHide(id);
	});
};

var fnClearValue = function(divId, ab) {
	var $contents = $("#" + divId + " :input");
	var node, id;

	for (var i = 0; i < $contents.length; i++) {
		node = $contents.eq(i);
		id = node.attr('id');

		if (id == "" || id == "undefined")
			continue;

		if (node.prop('type') == "text" || node.prop('type') == "textarea"
				|| node.prop('type') == "email") {
			node.val("");
		} else if (node.prop('type').indexOf("select") > -1) {
			$("#" + id + " option:eq(0)").prop("selected", true);
		} else if (node.prop('type') == "radio") {// radio

		} else if (node.prop('type') == "checkbox") {
			$("#" + id).iCheck('uncheck');
		}

	}

};

var fnSetAbility = function(divId, ab) {
	var $contents = $("#" + divId + " :input");
	var node, id;

	for (var i = 0; i < $contents.length; i++) {
		node = $contents.eq(i);
		id = node.attr('id');

		if (id == "" || id == "undefined")
			continue;
		if (ab) {
			$("#" + id).removeAttr("disabled");
		} else {
			$("#" + id).attr("disabled", "disabled");
		}

		if ($("#" + id).parent().hasClass("input-group date")
				|| $("#" + id).parent().hasClass("input-group clockpicker")) {

			$("#" + id).parent().css("pointer-events", ab ? "auto" : "none");

		}
	}
};

function makeCM559Init(){};

var SignModule={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(input){var output="";var chr1,chr2,chr3,enc1,enc2,enc3,enc4;var i=0;input=SignModule._utf8_encode(input);while(i<input.length){chr1=input.charCodeAt(i++);chr2=input.charCodeAt(i++);chr3=input.charCodeAt(i++);enc1=chr1>>2;enc2=((chr1&3)<<4)|(chr2>>4);enc3=((chr2&15)<<2)|(chr3>>6);enc4=chr3&63;if(isNaN(chr2)){enc3=enc4=64}else if(isNaN(chr3)){enc4=64}output=output+this._keyStr.charAt(enc1)+this._keyStr.charAt(enc2)+this._keyStr.charAt(enc3)+this._keyStr.charAt(enc4)}return output},decode:function(input){var output="";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(i<input.length){enc1=this._keyStr.indexOf(input.charAt(i++));enc2=this._keyStr.indexOf(input.charAt(i++));enc3=this._keyStr.indexOf(input.charAt(i++));enc4=this._keyStr.indexOf(input.charAt(i++));chr1=(enc1<<2)|(enc2>>4);chr2=((enc2&15)<<4)|(enc3>>2);chr3=((enc3&3)<<6)|enc4;output=output+String.fromCharCode(chr1);if(enc3!=64){output=output+String.fromCharCode(chr2)}if(enc4!=64){output=output+String.fromCharCode(chr3)}}output=SignModule._utf8_decode(output);return output},_utf8_encode:function(string){string=string.replace(/\r\n/g,"\n");var utftext="";for(var n=0;n<string.length;n++){var c=string.charCodeAt(n);if(c<128){utftext+=String.fromCharCode(c)}else if((c>127)&&(c<2048)){utftext+=String.fromCharCode((c>>6)|192);utftext+=String.fromCharCode((c&63)|128)}else{utftext+=String.fromCharCode((c>>12)|224);utftext+=String.fromCharCode(((c>>6)&63)|128);utftext+=String.fromCharCode((c&63)|128)}}return utftext},_utf8_decode:function(utftext){var string="";var i=0;var c=c1=c2=0;while(i<utftext.length){c=utftext.charCodeAt(i);if(c<128){string+=String.fromCharCode(c);i++}else if((c>191)&&(c<224)){c2=utftext.charCodeAt(i+1);string+=String.fromCharCode(((c&31)<<6)|(c2&63));i+=2}else{c2=utftext.charCodeAt(i+1);c3=utftext.charCodeAt(i+2);string+=String.fromCharCode(((c&15)<<12)|((c2&63)<<6)|(c3&63));i+=3}}return string}};function addCrc(max){var arrFlag=['N','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','W','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9'];var ret="";for(var i=0;i<max;i++){ret=ret+arrFlag[Math.floor(Math.random()*62)+1]}return ret}function fnSign(orgStr){return addCrc(32)+SignModule.encode(orgStr)+addCrc(32)}function fnUnSign(encStr){if(encStr.length>64){var enStr = encStr.substring(32,encStr.length-32);return SignModule.decode(enStr);}else{	return "";}}
