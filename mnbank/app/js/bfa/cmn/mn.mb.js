//-----------------------------------------------------------------------------------------------------------------------
// * 쿠키 관련 자바스크립트
//-----------------------------------------------------------------------------------------------------------------------

/**
* cookie : 쿠기값 설정, 삭제, 가져오기
*/
cookie = function(){
    return{
        /**
        * cookie.getCookie(name) : 쿠기값 가져오기
        * @param {Object} name : 쿠기명
        */
        getCookie : function(name){
            var i,x,y,ARRcookies=document.cookie.split(";");
            for(i=0;i<ARRcookies.length;i++){
                x = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
                y = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
                x = x.replace(/^\s+|\s+$/g,"");
                if (x==name){
                    return unescape(y);
                }
            }
        },

        /**
        * cookie.getCookieVal(offset)
        * @param {Object} offset
        */
        getCookieVal : function(offset){
            var endstr = document.cookie.indexOf (";", offset);
            if (endstr == -1) endstr = document.cookie.length;
            return unescape(document.cookie.substring(offset, endstr));
        },

        /**
        * cookie.setCookie(name, value, expires, path, domain) : 쿠키값 설정
        * @param {Object} name    : 쿠키명
        * @param {Object} value   : 쿠키값
        * @param {Object} expires : 쿠키 만기 날짜
        * @param {Object} path    : 쿠키 된 경로
        * @param {Object} domain  : 쿠키 된 도메인
        */
        setCookie : function(name, value, expires, path, domain){
            if (!path) path = "/";
            document.cookie = name + "=" + escape (value) +
            ((expires) ? "; expires=" + expires : "")   +
            ((path)    ? "; path="    + path    : "")   +
            ((domain)  ? "; domain="  + domain  : "");
        },

        /**
        * cookie.delCookie(name, path, domain) : 쿠키값 삭제
        * @param {Object} name   : 쿠키명
        * @param {Object} path   : 쿠키 된 경로
        * @param {Object} domain : 쿠키 된 도메인
        */
        delCookie : function(name, path, domain){
            if (!path) path = "/";
            if (getCookie(name)) {
                document.cookie = name + "=" +
                ((path)   ? "; path="   + path   : "") +
                ((domain) ? "; domain=" + domain : "") + "; expires=Thu, 01-Jan-70 00:00:01 GMT";
            }
        },

        /**
        * cookie.getExpDate(days, hours, minutes) : 일, 시간, 분 입력하여 GMT 사건 가져오기
        * @param {Object} days    : 일
        * @param {Object} hours   : 시간
        * @param {Object} minutes : 분
        */
        getExpDate : function(days, hours, minutes){
            var expDate = new Date();
            if (typeof days == "number" && typeof hours == "number" && typeof hours == "number") {
                expDate.setDate(expDate.getDate() + parseInt(days));
                expDate.setHours(expDate.getHours() + parseInt(hours));
                expDate.setMinutes(expDate.getMinutes() + parseInt(minutes));
                return expDate.toGMTString();
            }
        }
    };
}();

//-----------------------------------------------------------------------------------------------------------------------
// * 자바스크립트
//-----------------------------------------------------------------------------------------------------------------------
caq = function(){
    return{
        /**
        * caq.popupIMMAproval(form_name,next_target_obj,telaproval_result,siteId,langtype):  2채널인증-전화승인팝업 페이지 오픈-이통사명의확인 default
        * @param {Object} form_name          : Fomm 태그 name 
        * @param {Object} next_target_obj          : 창이 닫힌 후 다음 포커스 오브젝트 ID 
        * @param {Object} histDstic            :  내역구분
        * @param {Object} strTelMent           : 멘트종류
        * @param {Object} telaproval_result            : 전화승인팝업처리결과
        * @param {Object} siteId            :  도메인명
        * @param {Object} langtype            :  다국어
        */
        popupIMMAproval  : function(form_name,next_target_obj,telaproval_result,siteId,langtype){
            var url = "/mquics?page=D002689";   
            if(langtype == 'ENG' || langtype == 'JPN' || langtype == 'CHN') { // 2016-09-29 다국어 추가 김근주
                url = "/mquics?page=D001445";
            }
            
            var param = "{";
            param += '"form_name":"' + form_name + '"';
            param += ',"telaproval_result":"' + telaproval_result + '"';
            param += ',"LANG_TYPE":"' + langtype + '"'; // 2016-09-29 다국어 추가 김근주
            param += "}";   
            window.appManager.openWebViewWithPopup(url, param, caqtel.addSuccessCallback);
        },

        /**
        * caq.popupSMSAproval(form_name,next_target_obj,smsaproval_result,siteId,langtype):  휴대폰SMS인증 팝업 페이지오픈
        * @param {Object} form_name          : Fomm 태그 name 
        * @param {Object} next_target_obj          : 창이 닫힌 후 다음 포커스 오브젝트 ID 
        * @param {Object} smsaproval_result            : 휴대폰SMS인증 결과
        * @param {Object} siteId            :  도메인명
        * @param {Object} langtype            :  다국어
        */
        popupSMSAproval  : function(form_name,next_target_obj,smsaproval_result,siteId,langtype){
            var url = "/mquics?page=D002690";
            if(langtype == 'ENG' || langtype == 'JPN' || langtype == 'CHN') { // 2016-09-29 다국어 추가 김근주
                url = "/mquics?page=D001443";
            }

            var param = "{";
            param += '"form_name":"' + form_name + '"';
            param += ',"smsaproval_result":"' + smsaproval_result + '"';
            param += ',"LANG_TYPE":"' + langtype + '"'; // 2016-09-29 다국어 추가 김근주
            param += "}";   
            window.appManager.openWebViewWithPopup(url, param, caqtel.addSuccessCallback);
           },  
        /**
        * caq.popupSPhoneNumAproval(form_name,next_target_obj,smsaproval_result,siteId,langtype):  연락처본인인증 팝업 페이지오픈
        * @param {Object} form_name          : Fomm 태그 name 
        * @param {Object} next_target_obj          : 창이 닫힌 후 다음 포커스 오브젝트 ID 
        * @param {Object} smsaproval_result            : 연락처본인인증 결과
        * @param {Object} siteId            :  도메인명
        * @param {Object} langtype            :  다국어
        */
        popupSPhoneNumAproval  : function(form_name,next_target_obj,smsaproval_result,siteId,langtype){
            var url = "/mquics?page=D002691";
            if(langtype == 'ENG' || langtype == 'JPN' || langtype == 'CHN') { // 2016-09-29 다국어 추가 김근주
                url = "/mquics?page=D001446";
            }
            var param = "{";
            param += '"form_name":"' + form_name + '"';
            param += ',"smsaproval_result":"' + smsaproval_result + '"';
            param += ',"LANG_TYPE":"' + langtype + '"'; // 2016-09-29 다국어 추가 김근주
            param += "}";   
            window.appManager.openWebViewWithPopup(url, param, caqtel.addSuccessCallback);
            
           },
        /**
        * caq.popupSPhoneNumCertAproval(form_name,next_target_obj,smsaproval_result,siteId,langtype):  연락처본인인증 팝업 페이지오픈
        * @param {Object} form_name          : Fomm 태그 name 
        * @param {Object} next_target_obj          : 창이 닫힌 후 다음 포커스 오브젝트 ID 
        * @param {Object} smsaproval_result            : 연락처본인인증 결과
        * @param {Object} siteId            :  도메인명
        * @param {Object} langtype            :  다국어
        */
        popupSPhoneNumCertAproval  : function(form_name,next_target_obj,smsaproval_result,siteId,langtype){
            var url = "/mquics?page=D002691";
            if(langtype == 'ENG' || langtype == 'JPN' || langtype == 'CHN') { // 2016-09-29 다국어 추가 김근주
                url = "/mquics?page=D001446";
            }

            var param = "{";
            param += '"form_name":"' + form_name + '"';
            param += ',"smsaproval_result":"' + smsaproval_result + '"';
            param += ',"LANG_TYPE":"' + langtype + '"'; // 2016-09-29 다국어 추가 김근주
            param += "}";   
            window.appManager.openWebViewWithPopup(url, param, caqtelCert.addSuccessCallback);
            
           },
        /**
        * caq.popupTelAproval(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype):  2채널인증-전화승인팝업 페이지 오픈-이통사명의확인 default
        * @param {Object} form_name          : Fomm 태그 name 
        * @param {Object} next_target_obj          : 창이 닫힌 후 다음 포커스 오브젝트 ID 
        * @param {Object} histDstic            :  내역구분
        * @param {Object} strTelMent           : 멘트종류
        * @param {Object} telaproval_result            : 전화승인팝업처리결과
        * @param {Object} siteId            :  도메인명
        * @param {Object} langtype            :  다국어
        */
        popupTelAproval  : function(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype){
            var tel_nominal  = false;          //  이통사명의확인여부 default 값
            var login_p = "";                     //  로그인 pass 값 초기화
            caq.popupTelAprovalNomial(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal,login_p);
        },
        
        /**
         * caq.popupTelAprovalN(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype):  2채널인증-전화승인팝업 페이지 오픈-이통사명의확인 default
         * @param {Object} form_name          : Fomm 태그 name 
         * @param {Object} next_target_obj          : 창이 닫힌 후 다음 포커스 오브젝트 ID 
         * @param {Object} histDstic            :  내역구분
         * @param {Object} strTelMent           : 멘트종류
         * @param {Object} telaproval_result            : 전화승인팝업처리결과
         * @param {Object} siteId            :  도메인명
         * @param {Object} langtype            :  다국어
         */
         popupTelAprovalN  : function(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype){
             var tel_nominal  = false;          //  이통사명의확인여부 default 값
             var login_p = "";                     //  로그인 pass 값 초기화
             caq.popupTelAprovalNomialN(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal,login_p);
         },

        /**
        * caq.popupTelAproval(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal):  2채널인증-전화승인팝업 페이지 오픈 - 이통사명의확인 
        * @param {Object} form_name          : Fomm 태그 name 
        * @param {Object} next_target_obj          : 창이 닫힌 후 다음 포커스 오브젝트 ID  
        * @param {Object} histDstic            :  내역구분
        * @param {Object} strTelMent           : 멘트종류
        * @param {Object} telaproval_result            : 전화승인팝업처리결과
        * @param {Object} siteId            :  도메인명
        * @param {Object} langtype            :  다국어
        * @param {Object} tel_nominal            :  이통사명의확인여부
        */
        popupTelAproval  : function(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal){
            var b_tel_nominal = false;
            if(typeof(tel_nominal) =="boolean") b_tel_nominal =tel_nominal;
            var login_p = "";
            caq.popupTelAprovalNomial(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,b_tel_nominal,login_p);
        },
        
        /**
       * caq.popupTelAprovalNomial(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal,login_p):  2채널인증-전화승인팝업 페이지 오픈
       * @param {Object} form_name          : Fomm 태그 name  
       * @param {Object} next_target_obj          : 창이 닫힌 후 다음 포커스 오브젝트 ID 
       * @param {Object} histDstic            :  내역구분
       * @param {Object} strTelMent           : 멘트종류
       * @param {Object} telaproval_result            : 전화승인팝업처리결과
       * @param {Object} siteId            :  도메인명
       * @param {Object} langtype            :  다국어
       * @param {Object} tel_nominal            :  이통사명의확인여부
       * @param {Object} login_p            :    로그인패스여부
       */
       popupTelAprovalNomial  : function(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal,login_p){
            var is_ModiTel = "";
            caq.popupTelAprovalNomial(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal,login_p,is_ModiTel);
       },
       
       /**
      * caq.popupTelAprovalNomialN(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal,login_p):  2채널인증-전화승인팝업 페이지 오픈
      * @param {Object} form_name          : Fomm 태그 name  
      * @param {Object} next_target_obj          : 창이 닫힌 후 다음 포커스 오브젝트 ID 
      * @param {Object} histDstic            :  내역구분
      * @param {Object} strTelMent           : 멘트종류
      * @param {Object} telaproval_result            : 전화승인팝업처리결과
      * @param {Object} siteId            :  도메인명
      * @param {Object} langtype            :  다국어
      * @param {Object} tel_nominal            :  이통사명의확인여부
      * @param {Object} login_p            :    로그인패스여부
      */
      popupTelAprovalNomialN  : function(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal,login_p){
           var is_ModiTel = "";
           caq.popupTelAprovalNomialN(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal,login_p,is_ModiTel);
      },

        /**
        * caq.popupTelAprovalNomial(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal,login_p,is_ModiTel):  2채널인증-전화승인팝업 페이지 오픈
        * @param {Object} form_name          : Fomm 태그 name  
        * @param {Object} next_target_obj          : 창이 닫힌 후 다음 포커스 오브젝트 ID 
        * @param {Object} histDstic            :  내역구분
        * @param {Object} strTelMent           : 멘트종류
        * @param {Object} telaproval_result            : 전화승인팝업처리결과
        * @param {Object} siteId            :  도메인명
        * @param {Object} langtype            :  다국어
        * @param {Object} tel_nominal            :  이통사명의확인여부
        * @param {Object} login_p            :    로그인패스여부
        * @param {Object} is_ModiTel            :  자택직장휴대폰변경여부
        */
        popupTelAprovalNomial  : function(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal,login_p,is_ModiTel){
            var url = "/mquics?page=D002692"; 
            if(langtype == 'ENG' || langtype == 'JPN' || langtype == 'CHN') { // 2016-09-29 다국어 추가 김근주
                url = "/mquics?page=D001444";
            }
            var param = "{";
            param += '"form_name":"' + form_name + '"';
            param += ',"histDstic":"' + histDstic + '"';
            param += ',"strTelMent":"' + strTelMent + '"';
            param += ',"telaproval_result":"' + telaproval_result + '"';
            param += ',"tel_nominal":"' + tel_nominal + '"';
            param += ',"login_p":"' + login_p + '"';
            param += ',"is_ModiTel":"' + is_ModiTel + '"';
            param += ',"LANG_TYPE":"' + langtype + '"'; // 2016-09-29 다국어 추가 김근주
            param += "}";

            window.appManager.openWebViewWithPopup(url, param, caqtel.addSuccessCallback);
        },
        
        /**
         * caq.popupTelAprovalNomialN(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal,login_p,is_ModiTel):  2채널인증-전화승인팝업 페이지 오픈
         * @param {Object} form_name          : Fomm 태그 name  
         * @param {Object} next_target_obj          : 창이 닫힌 후 다음 포커스 오브젝트 ID 
         * @param {Object} histDstic            :  내역구분
         * @param {Object} strTelMent           : 멘트종류
         * @param {Object} telaproval_result            : 전화승인팝업처리결과
         * @param {Object} siteId            :  도메인명
         * @param {Object} langtype            :  다국어
         * @param {Object} tel_nominal            :  이통사명의확인여부
         * @param {Object} login_p            :    로그인패스여부
         * @param {Object} is_ModiTel            :  자택직장휴대폰변경여부
         */
         popupTelAprovalNomialN  : function(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal,login_p,is_ModiTel){
             var url = "/mquics?page=D002692"; 
             if(langtype == 'ENG' || langtype == 'JPN' || langtype == 'CHN') { // 2016-09-29 다국어 추가 김근주
                 url = "/mquics?page=D001444";
             }

             var param = "{";
             param += '"form_name":"' + form_name + '"';
             param += ',"histDstic":"' + histDstic + '"';
             param += ',"strTelMent":"' + strTelMent + '"';
             param += ',"telaproval_result":"' + telaproval_result + '"';
             param += ',"tel_nominal":"' + tel_nominal + '"';
             param += ',"login_p":"' + login_p + '"';
             param += ',"is_ModiTel":"' + is_ModiTel + '"';
             param += ',"LANG_TYPE":"' + langtype + '"'; // 2016-09-29 다국어 추가 김근주
             param += "}";   
             window.appManager.openWebViewWithPopup(url, param, caqtel.addSuccessCallback);
         },
        
        /**
         * TODO 인증서 발급 추가인증 관련 추가로직.
         */
        /**
         * caq.popupIMMCertAproval(form_name,next_target_obj,telaproval_result,siteId,langtype):  2채널인증-전화승인팝업 페이지 오픈-이통사명의확인 default
         * @param {Object} form_name          : Fomm 태그 name 
         * @param {Object} next_target_obj          : 창이 닫힌 후 다음 포커스 오브젝트 ID 
         * @param {Object} histDstic            :  내역구분
         * @param {Object} strTelMent           : 멘트종류
         * @param {Object} telaproval_result            : 전화승인팝업처리결과
         * @param {Object} siteId            :  도메인명
         * @param {Object} langtype            :  다국어
         */
         popupIMMCertAproval  : function(form_name,next_target_obj,telaproval_result,siteId,langtype){
             var url = "/mquics?page=D002689";   
             if(langtype == 'ENG' || langtype == 'JPN' || langtype == 'CHN') { // 2016-09-29 다국어 추가 김근주
                 url = "/mquics?page=D001445";
             }
             
             var param = "{";
             param += '"form_name":"' + form_name + '"';
             param += ',"telaproval_result":"' + telaproval_result + '"';
             param += ',"LANG_TYPE":"' + langtype + '"'; // 2016-09-29 다국어 추가 김근주
             param += "}";   
             window.appManager.openWebViewWithPopup(url, param, caqtelCert.addSuccessCallback);
         },

         /**
         * caq.popupSMSCertAproval(form_name,next_target_obj,smsaproval_result,siteId,langtype):  휴대폰SMS인증 팝업 페이지오픈
         * @param {Object} form_name          : Fomm 태그 name 
         * @param {Object} next_target_obj          : 창이 닫힌 후 다음 포커스 오브젝트 ID 
         * @param {Object} smsaproval_result            : 휴대폰SMS인증 결과
         * @param {Object} siteId            :  도메인명
         * @param {Object} langtype            :  다국어
         */
         popupSMSCertAproval  : function(form_name,next_target_obj,smsaproval_result,siteId,langtype){
             var url = "/mquics?page=D002690";
             if(langtype == 'ENG' || langtype == 'JPN' || langtype == 'CHN') { // 2016-09-29 다국어 추가 김근주
                 url = "/mquics?page=D001443";
             }

             var param = "{";
             param += '"form_name":"' + form_name + '"';
             param += ',"smsaproval_result":"' + smsaproval_result + '"';
             param += ',"LANG_TYPE":"' + langtype + '"'; // 2016-09-29 다국어 추가 김근주
             param += "}";   
             window.appManager.openWebViewWithPopup(url, param, caqtelCert.addSuccessCallback);
             
            },  
      
         /**
         * caq.popupTelCertAproval(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype):  2채널인증-전화승인팝업 페이지 오픈-이통사명의확인 default
         * @param {Object} form_name          : Fomm 태그 name 
         * @param {Object} next_target_obj          : 창이 닫힌 후 다음 포커스 오브젝트 ID 
         * @param {Object} histDstic            :  내역구분
         * @param {Object} strTelMent           : 멘트종류
         * @param {Object} telaproval_result            : 전화승인팝업처리결과
         * @param {Object} siteId            :  도메인명
         * @param {Object} langtype            :  다국어
         */
         popupTelCertAproval  : function(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype){
             var tel_nominal  = false;          //  이통사명의확인여부 default 값
             var login_p = "";                     //  로그인 pass 값 초기화
             caq.popupTelCertAprovalNomial(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal,login_p);
         },

         /**
         * caq.popupTelCertAproval(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal):  2채널인증-전화승인팝업 페이지 오픈 - 이통사명의확인 
         * @param {Object} form_name          : Fomm 태그 name 
         * @param {Object} next_target_obj          : 창이 닫힌 후 다음 포커스 오브젝트 ID  
         * @param {Object} histDstic            :  내역구분
         * @param {Object} strTelMent           : 멘트종류
         * @param {Object} telaproval_result            : 전화승인팝업처리결과
         * @param {Object} siteId            :  도메인명
         * @param {Object} langtype            :  다국어
         * @param {Object} tel_nominal            :  이통사명의확인여부
         */
         popupTelCertAproval  : function(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal){
             var b_tel_nominal = false;
             if(typeof(tel_nominal) =="boolean") b_tel_nominal =tel_nominal;
             var login_p = "";
             caq.popupTelCertAprovalNomial(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,b_tel_nominal,login_p);
         },
         
         /**
        * caq.popupTelCertAprovalNomial(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal,login_p):  2채널인증-전화승인팝업 페이지 오픈
        * @param {Object} form_name          : Fomm 태그 name  
        * @param {Object} next_target_obj          : 창이 닫힌 후 다음 포커스 오브젝트 ID 
        * @param {Object} histDstic            :  내역구분
        * @param {Object} strTelMent           : 멘트종류
        * @param {Object} telaproval_result            : 전화승인팝업처리결과
        * @param {Object} siteId            :  도메인명
        * @param {Object} langtype            :  다국어
        * @param {Object} tel_nominal            :  이통사명의확인여부
        * @param {Object} login_p            :    로그인패스여부
        */
        popupTelCertAprovalNomial  : function(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal,login_p){
            var is_ModiTel = "";
            caq.popupTelCertAprovalNomial(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal,login_p,is_ModiTel);
        },

         /**
         * caq.popupTelCertAprovalNomial(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal,login_p,is_ModiTel):  2채널인증-전화승인팝업 페이지 오픈
         * @param {Object} form_name          : Fomm 태그 name  
         * @param {Object} next_target_obj          : 창이 닫힌 후 다음 포커스 오브젝트 ID 
         * @param {Object} histDstic            :  내역구분
         * @param {Object} strTelMent           : 멘트종류
         * @param {Object} telaproval_result            : 전화승인팝업처리결과
         * @param {Object} siteId            :  도메인명
         * @param {Object} langtype            :  다국어
         * @param {Object} tel_nominal            :  이통사명의확인여부
         * @param {Object} login_p            :    로그인패스여부
         * @param {Object} is_ModiTel            :  자택직장휴대폰변경여부
         */
         popupTelCertAprovalNomial  : function(form_name,next_target_obj,histDstic,strTelMent,telaproval_result,siteId,langtype,tel_nominal,login_p,is_ModiTel){
             var url = "/mquics?page=D002692"; 
             
             if(langtype == 'ENG' || langtype == 'JPN' || langtype == 'CHN') { // 2016-09-29 다국어 추가 김근주
                 url = "/mquics?page=D001444";
             }

             var param = "{";
             param += '"form_name":"' + form_name + '"';
             param += ',"histDstic":"' + histDstic + '"';
             param += ',"strTelMent":"' + strTelMent + '"';
             param += ',"telaproval_result":"' + telaproval_result + '"';
             param += ',"tel_nominal":"' + tel_nominal + '"';
             param += ',"login_p":"' + login_p + '"';
             param += ',"is_ModiTel":"' + is_ModiTel + '"';
             param += ',"LANG_TYPE":"' + langtype + '"'; // 2016-09-29 다국어 추가 김근주
             param += "}";   
             window.appManager.openWebViewWithPopup(url, param, caqtelCert.addSuccessCallback);
         },
        
        /**
        * caq.popupZipcodeInquery(form_name, zipcode1_name, zipcode2_name, address1_name, address2_name, usage_cleanaddress, zip_serial_name) : 우편번호조회 팝업페이지 오픈
        * @param {Object} form_name          : 폼이름(form)
        * @param {Object} zipcode1_name      : 우편번호1(text)
        * @param {Object} zipcode2_name      : 우편번호2(text)
        * @param {Object} address1_name      : 우편번호주소(text)
        * @param {Object} address2_name      : 상세주소(text)
        * @param {Object} usage_cleanaddress : 정제주소사용여부(Y:정제, N:일반)
        * @param {Object} zip_serial_name    : 우편일련번호(선택사항)(hidden) 
        */

        popupZipcodeInquery : function(form_name, zipcode1_name, zipcode2_name, address1_name, address2_name, usage_cleanaddress, zip_serial_name){
            form_name          = (form_name          === undefined) ? "" : form_name;
            zipcode1_name      = (zipcode1_name      === undefined) ? "" : zipcode1_name;
            zipcode2_name      = (zipcode2_name      === undefined) ? "" : zipcode2_name;
            address1_name      = (address1_name      === undefined) ? "" : address1_name;
            address2_name      = (address2_name      === undefined) ? "" : address2_name;
            usage_cleanaddress = (usage_cleanaddress === undefined) ? "" : usage_cleanaddress;
            zip_serial_name    = (zip_serial_name    === undefined) ? "" : zip_serial_name;

            alert("popupZipcodeInquery_MNBANK Function으로 바뀌었습니다.");
            var url     = "/mquics?page=D002207";
            var params  = "&form_name=" + form_name + "&zip1_field_name=" + zipcode1_name;
                params += "&zip2_field_name=" + zipcode2_name + "&address1_field_name=" + address1_name;
                params += "&address2_field_name=" + address2_name + "&clean_address="+usage_cleanaddress;
                params += "&zip_serial_name="+zip_serial_name+"&functionName=none";
            
            window.appManager.openWebViewWithPopup(url, caq.util.paramsToJson(params), caq.popupzipcodeCalback);
        },
          /**
           * caq.popupZipcodeInqueryStreetName()      : 우편번호조회 팝업페이지 오픈(도로명)
           * @param {Object} form_name                    : 폼이름(form)
           * @param {Object} zipcode1_name              : 우편번호1(text)
           * @param {Object} zipcode2_name              : 우편번호2(text)
           * @param {Object} address1_name              : 우편번호주소(text)
           * @param {Object} address2_name              : 상세주소(text)
           * @param {Object} usage_cleanaddress        : 정제주소사용여부(Y:정제, N:일반)
           * @param {Object} zip_serial_name               : 우편일련번호(선택사항)(hidden)
           * @param {Object} zipcode_gubun_code       : 주소표시구분코드 (hidden)
           * @param {Object} zipcode                          : 지번우편번호(hidden)
           * @param {Object} ser_no                            : 지번일련번호(hidden)
           * @param {Object} jibun_basic_address         : 지번기본주소(hidden)
           * @param {Object} jibun_detail_address         : 지번상세주소(hidden)
           * @param {Object} streetname_basic_address   : 도로기본주소(hidden)
           * @param {Object} streetname_detail_address  : 도로상세주소(hidden)
           * @param {Object} streetname_zipcode         : 도로명우편번호(hidden)
           * @param {Object} streetname_manage_num      : 도로명우편보조번호(hidden)
           * @param {Object} streetname_area_code     : 도로명구역코드(hidden)
           * @param {Object} jiha_yn                            : 도로명지하구분(hidden)
           * @param {Object} building_major_num         : 도로명건물본번호(hidden)
           * @param {Object} building_minor_num         : 도로명건물부번호(hidden)
           * @param {Object} building_manage_num      : 도로명건물관리번호(hidden)
           * @param {Object} streetname_eupmyun_seq : 도로명읍면번호(hidden)
           * @param {Object} streetname_detail             : 도로명상세주소(hidden)
           */
        
          popupZipcodeInqueryStreetName : function(
                  form_name
                , zipcode1_name
                , zipcode2_name
                , address1_name
                , address2_name
                , usage_cleanaddress
                , zip_serial_name
                , zipcode_gubun_code
                , zipcode
                , ser_no
                , jibun_basic_address
                , jibun_detail_address
                , streetname_basic_address
                , streetname_detail_address
                , streetname_zipcode
                , streetname_manage_num
                , streetname_area_code
                , jiha_yn
                , building_major_num
                , building_minor_num
                , building_manage_num
                , streetname_eupmyun_seq
                , streetname_detail
              ) {
                caq.popupZipcodeInqueryWithTypeStreetName(
                    form_name
                  , zipcode1_name
                  , zipcode2_name
                  , address1_name
                  , address2_name
                  , usage_cleanaddress
                  , zip_serial_name
                  , ''
                  , zipcode_gubun_code
                  , zipcode
                  , ser_no
                  , jibun_basic_address
                  , jibun_detail_address
                  , streetname_basic_address
                  , streetname_detail_address
                  , streetname_zipcode
                  , streetname_manage_num
                  , streetname_area_code
                  , jiha_yn
                  , building_major_num
                  , building_minor_num
                  , building_manage_num
                  , streetname_eupmyun_seq
                  , streetname_detail
                );
            },
            
           /**
           * caq.popupZipcodeInqueryWithTypeStreetName() : 우편번호조회 팝업페이지 오픈(도로명)
           * @param {Object} form_name                  : 폼이름(form)
           * @param {Object} zipcode1_name              : 우편번호1(text)
           * @param {Object} zipcode2_name              : 우편번호2(text)
           * @param {Object} address1_name              : 우편번호주소(text)
           * @param {Object} address2_name              : 상세주소(text)
           * @param {Object} usage_cleanaddress         : 정제주소사용여부(Y:정제, N:일반)
           * @param {Object} zip_serial_name            : 우편일련번호(선택사항)(hidden)
           * @param {Object} formatted_type             : 표준화주소용(hidden)
           * @param {Object} zipcode_gubun_code         : 주소표시구분코드 (hidden)
           * @param {Object} zipcode                    : 지번우편번호(hidden)
           * @param {Object} ser_no                     : 지번일련번호(hidden)
           * @param {Object} jibun_basic_address        : 지번기본주소(hidden)
           * @param {Object} jibun_detail_address       : 지번상세주소(hidden)
           * @param {Object} streetname_basic_address   : 도로기본주소(hidden)
           * @param {Object} streetname_detail_address  : 도로상세주소(hidden)
           * @param {Object} streetname_zipcode         : 도로명우편번호(hidden)
           * @param {Object} streetname_manage_num      : 도로명우편보조번호(hidden)
           * @param {Object} streetname_area_code       : 도로명구역코드(hidden)
           * @param {Object} jiha_yn                    : 도로명지하구분(hidden)
           * @param {Object} building_major_num         : 도로명건물본번호(hidden)
           * @param {Object} building_minor_num         : 도로명건물부번호(hidden)
           * @param {Object} building_manage_num        : 도로명건물관리번호(hidden)
           * @param {Object} streetname_eupmyun_seq     : 도로명읍면번호(hidden)
           * @param {Object} streetname_detail          : 도로명상세주소(hidden)
           */
          popupZipcodeInqueryWithTypeStreetName : function(
                form_name
              , zipcode1_name
              , zipcode2_name
              , address1_name
              , address2_name
              , usage_cleanaddress
              , zip_serial_name
              , formatted_type
              , zipcode_gubun_code
              , zipcode
              , ser_no
              , jibun_basic_address
              , jibun_detail_address
              , streetname_basic_address
              , streetname_detail_address
              , streetname_zipcode
              , streetname_manage_num
              , streetname_area_code
              , jiha_yn
              , building_major_num
              , building_minor_num
              , building_manage_num
              , streetname_eupmyun_seq
              , streetname_detail
            ) {
        	  alert("popupZipcodeInqueryWithTypeStreetName_MNBANK Function으로 바뀌었습니다.");
            var url       = "/mquics?page=D002204";
            var params    = "&form_name=" + form_name;
                params   += "&zip1_field_name=" + zipcode1_name;
                params   += "&zip2_field_name=" + zipcode2_name;
                params   += "&address1_field_name=" + address1_name;
                params   += "&address2_field_name=" + address2_name;
                params   += "&clean_address=" + usage_cleanaddress;
                params   += "&zip_serial_name=" + zip_serial_name;
                params   += "&functionName=none";
                params   += "&formatted_type=" + formatted_type;
                params   += "&zipcode_gubun_code=" + zipcode_gubun_code;
                params   += "&zipcode=" + zipcode;
                params   += "&ser_no=" + ser_no;
                params   += "&jibun_basic_address=" + jibun_basic_address;
                params   += "&jibun_detail_address=" + jibun_detail_address;
                params   += "&streetname_basic_address=" + streetname_basic_address;
                params   += "&streetname_detail_address=" + streetname_detail_address;
                params   += "&streetname_zipcode=" + streetname_zipcode;
                params   += "&streetname_manage_num=" + streetname_manage_num;
                params   += "&streetname_area_code=" + streetname_area_code;
                params   += "&jiha_yn=" + jiha_yn;
                params   += "&building_major_num=" + building_major_num;
                params   += "&building_minor_num=" + building_minor_num;
                params   += "&building_manage_num=" + building_manage_num;
                params   += "&streetname_eupmyun_seq=" + streetname_eupmyun_seq;
                params   += "&streetname_detail=" + streetname_detail;
        
                window.appManager.openWebViewWithPopup(url, caq.util.paramsToJson(params), caq.popupzipcodeCalback);
          },

        /**
           * caq.popupZipcodeInqueryWithTypeStreetNamePlusSix() : 우편번호조회 팝업페이지 오픈(도로명)(5자리 일괄 전환에 따른 기존 6자리 포함)
           * @param {Object} form_name                  : 폼이름(form)
           * @param {Object} zipcode1_name              : 우편번호1(text)
           * @param {Object} zipcode2_name              : 우편번호2(text)
           * @param {Object} address1_name              : 우편번호주소(text)
           * @param {Object} address2_name              : 상세주소(text)
           * @param {Object} usage_cleanaddress         : 정제주소사용여부(Y:정제, N:일반)
           * @param {Object} zip_serial_name            : 우편일련번호(선택사항)(hidden)
           * @param {Object} formatted_type             : 표준화주소용(hidden)
           * @param {Object} zipcode_gubun_code         : 주소표시구분코드 (hidden)
           * @param {Object} zipcode                    : 지번우편번호(hidden)
           * @param {Object} ser_no                     : 지번일련번호(hidden)
           * @param {Object} jibun_basic_address        : 지번기본주소(hidden)
           * @param {Object} jibun_detail_address       : 지번상세주소(hidden)
           * @param {Object} streetname_basic_address   : 도로기본주소(hidden)
           * @param {Object} streetname_detail_address  : 도로상세주소(hidden)
           * @param {Object} streetname_zipcode         : 도로명우편번호(hidden)
           * @param {Object} streetname_manage_num      : 도로명우편보조번호(hidden)
           * @param {Object} streetname_area_code       : 도로명구역코드(hidden)
           * @param {Object} jiha_yn                    : 도로명지하구분(hidden)
           * @param {Object} building_major_num         : 도로명건물본번호(hidden)
           * @param {Object} building_minor_num         : 도로명건물부번호(hidden)
           * @param {Object} building_manage_num        : 도로명건물관리번호(hidden)
           * @param {Object} streetname_eupmyun_seq     : 도로명읍면번호(hidden)
           * @param {Object} streetname_detail          : 도로명상세주소(hidden)
           * @param {Object} zipcode_origin          : 우편번호6자리(hidden)
           * @param {Object} zip_serial_name_origin          : 우편번호6자리 일련번호(hidden)
           */
          popupZipcodeInqueryWithTypeStreetNamePlusSix : function(
                form_name
              , zipcode1_name
              , zipcode2_name
              , address1_name
              , address2_name
              , usage_cleanaddress
              , zip_serial_name
              , formatted_type
              , zipcode_gubun_code
              , zipcode
              , ser_no
              , jibun_basic_address
              , jibun_detail_address
              , streetname_basic_address
              , streetname_detail_address
              , streetname_zipcode
              , streetname_manage_num
              , streetname_area_code
              , jiha_yn
              , building_major_num
              , building_minor_num
              , building_manage_num
              , streetname_eupmyun_seq
              , streetname_detail
              , zipcode_origin
              , zip_serial_name_origin
            ) {
        	  alert("popupZipcodeInqueryWithTypeStreetNamePlusSix_MNBANK Function으로 바뀌었습니다.");
            var url       = "/mquics?page=D002204";
            var params    = "&form_name=" + form_name;
                params   += "&zip1_field_name=" + zipcode1_name;
                params   += "&zip2_field_name=" + zipcode2_name;
                params   += "&address1_field_name=" + address1_name;
                params   += "&address2_field_name=" + address2_name;
                params   += "&clean_address=" + usage_cleanaddress;
                params   += "&zip_serial_name=" + zip_serial_name;
                params   += "&functionName=none";
                params   += "&formatted_type=" + formatted_type;
                params   += "&zipcode_gubun_code=" + zipcode_gubun_code;
                params   += "&zipcode=" + zipcode;
                params   += "&ser_no=" + ser_no;
                params   += "&jibun_basic_address=" + jibun_basic_address;
                params   += "&jibun_detail_address=" + jibun_detail_address;
                params   += "&streetname_basic_address=" + streetname_basic_address;
                params   += "&streetname_detail_address=" + streetname_detail_address;
                params   += "&streetname_zipcode=" + streetname_zipcode;
                params   += "&streetname_manage_num=" + streetname_manage_num;
                params   += "&streetname_area_code=" + streetname_area_code;
                params   += "&jiha_yn=" + jiha_yn;
                params   += "&building_major_num=" + building_major_num;
                params   += "&building_minor_num=" + building_minor_num;
                params   += "&building_manage_num=" + building_manage_num;
                params   += "&streetname_eupmyun_seq=" + streetname_eupmyun_seq;
                params   += "&streetname_detail=" + streetname_detail;
                params   += "&zipcode_origin=" + zipcode_origin;
                params   += "&zip_serial_name_origin=" + zip_serial_name_origin;

                window.appManager.openWebViewWithPopup(url, caq.util.paramsToJson(params), caq.popupzipcodeCalback);
          },

        /**
           * caq.popupZipcodeInqueryWithTypeTonghap() : 우편번호조회 팝업페이지 오픈(통합검색)
           * @param {Object} form_name                  : 폼이름(form)
           * @param {Object} zipcode1_name              : 우편번호1(text)
           * @param {Object} zipcode2_name              : 우편번호2(text)
           * @param {Object} address1_name              : 우편번호주소(text)
           * @param {Object} address2_name              : 상세주소(text)
           * @param {Object} usage_cleanaddress         : 정제주소사용여부(Y:정제, N:일반)
           * @param {Object} zip_serial_name            : 우편일련번호(선택사항)(hidden)
           * @param {Object} formatted_type             : 표준화주소용(hidden)
           * @param {Object} zipcode_gubun_code         : 주소표시구분코드 (hidden)
           * @param {Object} zipcode                    : 지번우편번호(hidden)
           * @param {Object} ser_no                     : 지번일련번호(hidden)
           * @param {Object} jibun_basic_address        : 지번기본주소(hidden)
           * @param {Object} jibun_detail_address       : 지번상세주소(hidden)
           * @param {Object} streetname_basic_address   : 도로기본주소(hidden)
           * @param {Object} streetname_detail_address  : 도로상세주소(hidden)
           * @param {Object} streetname_zipcode         : 도로명우편번호(hidden)
           * @param {Object} streetname_manage_num      : 도로명우편보조번호(hidden)
           * @param {Object} streetname_area_code       : 도로명구역코드(hidden)
           * @param {Object} jiha_yn                    : 도로명지하구분(hidden)
           * @param {Object} building_major_num         : 도로명건물본번호(hidden)
           * @param {Object} building_minor_num         : 도로명건물부번호(hidden)
           * @param {Object} building_manage_num        : 도로명건물관리번호(hidden)
           * @param {Object} streetname_eupmyun_seq     : 도로명읍면번호(hidden)
           * @param {Object} streetname_detail          : 도로명상세주소(hidden)
           * @param {Object} zipcode_origin         	: 우편번호6자리(hidden)
           * @param {Object} zip_serial_name_origin     : 우편번호6자리 일련번호(hidden)
           */
          popupZipcodeInqueryWithTypeTonghap : function(
                form_name
              , zipcode1_name
              , zipcode2_name
              , address1_name
              , address2_name
              , usage_cleanaddress
              , zip_serial_name
              , formatted_type
              , zipcode_gubun_code
              , zipcode
              , ser_no
              , jibun_basic_address
              , jibun_detail_address
              , streetname_basic_address
              , streetname_detail_address
              , streetname_zipcode
              , streetname_manage_num
              , streetname_area_code
              , jiha_yn
              , building_major_num
              , building_minor_num
              , building_manage_num
              , streetname_eupmyun_seq
              , streetname_detail
              , zipcode_origin
              , zip_serial_name_origin
            ) {

        	  alert("popupZipcodeInqueryWithTypeTonghap_MNBANK Function으로 바뀌었습니다.");
            var url       = "/mquics?page=D002202";
            var params    = "&form_name=" + form_name;
                params   += "&zip1_field_name=" + zipcode1_name;
                params   += "&zip2_field_name=" + zipcode2_name;
                params   += "&address1_field_name=" + address1_name;
                params   += "&address2_field_name=" + address2_name;
                params   += "&clean_address=" + usage_cleanaddress;
                params   += "&zip_serial_name=" + zip_serial_name;
                params   += "&functionName=none";
                params   += "&formatted_type=" + formatted_type;
                params   += "&zipcode_gubun_code=" + zipcode_gubun_code;
                params   += "&zipcode=" + zipcode;
                params   += "&ser_no=" + ser_no;
                params   += "&jibun_basic_address=" + jibun_basic_address;
                params   += "&jibun_detail_address=" + jibun_detail_address;
                params   += "&streetname_basic_address=" + streetname_basic_address;
                params   += "&streetname_detail_address=" + streetname_detail_address;
                params   += "&streetname_zipcode=" + streetname_zipcode;
                params   += "&streetname_manage_num=" + streetname_manage_num;
                params   += "&streetname_area_code=" + streetname_area_code;
                params   += "&jiha_yn=" + jiha_yn;
                params   += "&building_major_num=" + building_major_num;
                params   += "&building_minor_num=" + building_minor_num;
                params   += "&building_manage_num=" + building_manage_num;
                params   += "&streetname_eupmyun_seq=" + streetname_eupmyun_seq;
                params   += "&streetname_detail=" + streetname_detail;
                params   += "&zipcode_origin=" + zipcode_origin;
                params   += "&zip_serial_name_origin=" + zip_serial_name_origin;

                window.appManager.openWebViewWithPopup(url, caq.util.paramsToJson(params), caq.popupzipcodeCalback);
          },

          
        popupzipcodeCalback : function (param) {
            var jsonParam = param;
            var key = Object.keys(jsonParam);
                
            var objForm = $(document).find("[name='" + jsonParam.FORM_NAME + "']");     
            
            for(key in jsonParam){
                if("FORM_NAME" != key){
                    objForm.find("[name='"+ key + "']").focus();
                    objForm.find("[name='"+ key + "']").val(jsonParam[key]);
                    objForm.find("[name='"+ key + "']").blur();
                } 
            }                       
        },
        
        onDateInputChangedBlur : function(obj, lang) {
            var strTemp = "";
            var strVal  = $(obj).val();
            $(obj).val(strVal.replace(/[^0-9]/g,""));
            if(strVal.length < 8) {
              strTemp = strVal;
              var curDate = new Date();
              strTemp = curDate.getFullYear() +"."+ (((curDate.getMonth()+1)<10)?"0"+(curDate.getMonth()+1) : (curDate.getMonth()+1)) +"."+((curDate.getDate()<10)?"0"+curDate.getDate():curDate.getDate());
              if(lang == 'KOR'){
                  alert("날짜 형식이 아닙니다.");  
              }else{
                  alert("DateFormat is wrong!");
              }
              
              $(obj).val(strTemp);          
              return;
            } else if(strVal.length == 8) {
            	if( !strVal.endsWith(".") ){
	                strTemp = strVal;
	                $(obj).val(strTemp.substring(0,4)+'.'+strTemp.substring(4,6)+'.'+strTemp.substring(6,8));
	            }
                
            } else if(strVal.length > 8) {
              if(0 == strTemp.length){
                strTemp = strVal.replace(/[^0-9]/g,"").substring(0,8);
              }
              $(obj).val(strTemp.substring(0,4)+'.'+strTemp.substring(4,6)+'.'+strTemp.substring(6,8));
            }
            if(false == caq.util.isDate(strTemp)){
                try{
                  var curDate = new Date();
                  strTemp = curDate.getFullYear() +"."+ (((curDate.getMonth()+1)<10)?"0"+(curDate.getMonth()+1) : (curDate.getMonth()+1)) +"."+((curDate.getDate()<10)?"0"+curDate.getDate():curDate.getDate());
                  if(lang == 'KOR'){
                      alert("날짜 형식이 아닙니다.");  
                  }else{
                      alert("DateFormat is wrong!");
                  }
                  $(obj).val(strTemp);
                  strTemp="";
                } catch(e){
                    alert(e);
                    alert(e.Description);
                }
            }
        },
        
		onDateInputChangedKeyUp : function(obj, lang){
			var strTemp = "";
			var strVal  = $(obj).val().replace(/[^0-9]/g,"");
			$(obj).val( strVal );

			if(strVal.length < 8) {
				strTemp = strVal;
				return;
			}else if(strVal.length == 8){
				if( !strVal.endsWith(".") ){
					strTemp = strVal;
					$(obj).val(strTemp.substring(0,4)+'.'+strTemp.substring(4,6)+'.'+strTemp.substring(6,8));
				}
			} else if(strVal.length > 8) {
				if(0 == strTemp.length){
					strTemp = strVal.replace(/[^0-9]/g,"").substring(0,8);
				}
				$(obj).val(strTemp.substring(0,4)+'.'+strTemp.substring(4,6)+'.'+strTemp.substring(6,8));
				return;
			}
		},

		//############################################## 
		// NEW 스타뱅킹 사용
		//############################################## 
		/**
		 * caq.popupZipcodeInquery_MNBANK(form_name, zipcode_name, address1_name, address2_name, usage_cleanaddress, zip_serial_name) : 우편번호조회 팝업페이지 오픈
		 * @param {Object} form_name			: 폼이름(form)
		 * @param {Object} zipcode_name			: 우편번호(text)
		 * @param {Object} address1_name		: 우편번호주소(text)
		 * @param {Object} address2_name		: 상세주소(text)
		 * @param {Object} usage_cleanaddress	: 정제주소사용여부(Y:정제, N:일반)
		 * @param {Object} zip_serial_name		: 우편일련번호(선택사항)(hidden)
		 */
		popupZipcodeInquery_MNBANK : function( form_name, zipcode_name, address1_name, address2_name, usage_cleanaddress, zip_serial_name ){
			form_name			= (form_name			=== undefined) ? "" : form_name;
			zipcode_name		= (zipcode_name			=== undefined) ? "" : zipcode_name;
			address1_name		= (address1_name		=== undefined) ? "" : address1_name;
			address2_name		= (address2_name		=== undefined) ? "" : address2_name;
			usage_cleanaddress	= (usage_cleanaddress	=== undefined) ? "" : usage_cleanaddress;
			zip_serial_name		= (zip_serial_name		=== undefined) ? "" : zip_serial_name;
			var url     = "/mquics?page=D002207";
			var params  = "&form_name=" + form_name + "&zip_field_name=" + zipcode_name;
				params += "&address1_field_name=" + address1_name;
				params += "&address2_field_name=" + address2_name + "&clean_address="+usage_cleanaddress;
				params += "&zip_serial_name="+zip_serial_name+"&functionName=none";

			window.appManager.openWebViewWithPopup(url, caq.util.paramsToJson(params), caq.popupzipcodeCalback_MNBANK);
		},

		/**
		 * caq.popupZipcodeInqueryStreetName_MNABNK()	: 우편번호조회 팝업페이지 오픈(도로명)
		 * @param {Object} form_name					: 폼이름(form)
		 * @param {Object} zipcode_name					: 우편번호(text)
		 * @param {Object} address1_name				: 우편번호주소(text)
		 * @param {Object} address2_name				: 상세주소(text)
		 * @param {Object} usage_cleanaddress			: 정제주소사용여부(Y:정제, N:일반)
		 * @param {Object} zip_serial_name				: 우편일련번호(선택사항)(hidden)
		 * @param {Object} zipcode_gubun_code			: 주소표시구분코드 (hidden)
		 * @param {Object} zipcode						: 지번우편번호(hidden)
		 * @param {Object} ser_no						: 지번일련번호(hidden)
		 * @param {Object} jibun_basic_address			: 지번기본주소(hidden)

		 * @param {Object} jibun_detail_address			: 지번상세주소(hidden)
		 * @param {Object} streetname_basic_address		: 도로기본주소(hidden)
		 * @param {Object} streetname_detail_address	: 도로상세주소(hidden)
		 * @param {Object} streetname_zipcode			: 도로명우편번호(hidden)
		 * @param {Object} streetname_manage_num		: 도로명우편보조번호(hidden)
		 * @param {Object} streetname_area_code			: 도로명구역코드(hidden)
		 * @param {Object} jiha_yn						: 도로명지하구분(hidden)
		 * @param {Object} building_major_num			: 도로명건물본번호(hidden)
		 * @param {Object} building_minor_num			: 도로명건물부번호(hidden)
		 * @param {Object} building_manage_num			: 도로명건물관리번호(hidden)

		 * @param {Object} streetname_eupmyun_seq		: 도로명읍면번호(hidden)
		 * @param {Object} streetname_detail			: 도로명상세주소(hidden)
		 */
		popupZipcodeInqueryStreetName_MNBANK : function( form_name
														 , zipcode_name
														 , address1_name
														 , address2_name
														 , usage_cleanaddress
														 , zip_serial_name
														 , zipcode_gubun_code
														 , zipcode
														 , ser_no
														 , jibun_basic_address
														 , jibun_detail_address
														 , streetname_basic_address
														 , streetname_detail_address
														 , streetname_zipcode
														 , streetname_manage_num
														 , streetname_area_code
														 , jiha_yn
														 , building_major_num
														 , building_minor_num
														 , building_manage_num
														 , streetname_eupmyun_seq
														 , streetname_detail ){
			caq.popupZipcodeInqueryWithTypeStreetName_MNBANK( form_name
															 , zipcode_name
															 , address1_name
															 , address2_name
															 , usage_cleanaddress
															 , zip_serial_name
															 , ''
															 , zipcode_gubun_code
															 , zipcode
															 , ser_no
															 , jibun_basic_address
															 , jibun_detail_address
															 , streetname_basic_address
															 , streetname_detail_address
															 , streetname_zipcode
															 , streetname_manage_num
															 , streetname_area_code
															 , jiha_yn
															 , building_major_num
															 , building_minor_num
															 , building_manage_num
															 , streetname_eupmyun_seq
															 , streetname_detail );
		},
          
         /**
         * caq.popupZipcodeInqueryWithTypeStreetName_MNBANK()	: 우편번호조회 팝업페이지 오픈(도로명)
         * @param {Object} form_name					: 폼이름(form)
         * @param {Object} zipcode_name					: 우편번호(text)
         * @param {Object} address1_name				: 우편번호주소(text)
         * @param {Object} address2_name				: 상세주소(text)
         * @param {Object} usage_cleanaddress			: 정제주소사용여부(Y:정제, N:일반)
         * @param {Object} zip_serial_name				: 우편일련번호(선택사항)(hidden)
         * @param {Object} formatted_type				: 표준화주소용(hidden)
         * @param {Object} zipcode_gubun_code			: 주소표시구분코드 (hidden)
         * @param {Object} zipcode						: 지번우편번호(hidden)
         * @param {Object} ser_no						: 지번일련번호(hidden)

         * @param {Object} jibun_basic_address			: 지번기본주소(hidden)
         * @param {Object} jibun_detail_address			: 지번상세주소(hidden)
         * @param {Object} streetname_basic_address		: 도로기본주소(hidden)
         * @param {Object} streetname_detail_address	: 도로상세주소(hidden)
         * @param {Object} streetname_zipcode			: 도로명우편번호(hidden)
         * @param {Object} streetname_manage_num		: 도로명우편보조번호(hidden)
         * @param {Object} streetname_area_code 		: 도로명구역코드(hidden)
         * @param {Object} jiha_yn						: 도로명지하구분(hidden)
         * @param {Object} building_major_num			: 도로명건물본번호(hidden)
         * @param {Object} building_minor_num			: 도로명건물부번호(hidden)
         * 
         * @param {Object} building_manage_num			: 도로명건물관리번호(hidden)
         * @param {Object} streetname_eupmyun_seq		: 도로명읍면번호(hidden)
         * @param {Object} streetname_detail			: 도로명상세주소(hidden)
         */
		popupZipcodeInqueryWithTypeStreetName_MNBANK : function( form_name
																, zipcode_name
																, address1_name
																, address2_name
																, usage_cleanaddress
																, zip_serial_name
																, formatted_type
																, zipcode_gubun_code
																, zipcode
																, ser_no
																, jibun_basic_address
																, jibun_detail_address
																, streetname_basic_address
																, streetname_detail_address
																, streetname_zipcode
																, streetname_manage_num
																, streetname_area_code
																, jiha_yn
																, building_major_num
																, building_minor_num
																, building_manage_num
																, streetname_eupmyun_seq
																, streetname_detail ){
			var url       = "/mquics?page=D002204";
			var params    = "&form_name=" + form_name;
				params   += "&zip_field_name=" + zipcode_name;
				params   += "&address1_field_name=" + address1_name;
				params   += "&address2_field_name=" + address2_name;
				params   += "&clean_address=" + usage_cleanaddress;
				params   += "&zip_serial_name=" + zip_serial_name;
				params   += "&formatted_type=" + formatted_type;
				params   += "&zipcode_gubun_code=" + zipcode_gubun_code;
				params   += "&zipcode=" + zipcode;
				params   += "&ser_no=" + ser_no;
				params   += "&jibun_basic_address=" + jibun_basic_address;
				params   += "&jibun_detail_address=" + jibun_detail_address;
				params   += "&streetname_basic_address=" + streetname_basic_address;
				params   += "&streetname_detail_address=" + streetname_detail_address;
				params   += "&streetname_zipcode=" + streetname_zipcode;
				params   += "&streetname_manage_num=" + streetname_manage_num;
				params   += "&streetname_area_code=" + streetname_area_code;
				params   += "&jiha_yn=" + jiha_yn;
				params   += "&building_major_num=" + building_major_num;
				params   += "&building_minor_num=" + building_minor_num;
				params   += "&building_manage_num=" + building_manage_num;
				params   += "&streetname_eupmyun_seq=" + streetname_eupmyun_seq;
				params   += "&streetname_detail=" + streetname_detail;
				params   += "&functionName=none";

			window.appManager.openWebViewWithPopup(url, caq.util.paramsToJson(params), caq.popupzipcodeCalback_MNBANK);
		},

		/**
		 * caq.popupZipcodeInqueryWithTypeStreetNamePlusSix_MNBANK()	: 우편번호조회 팝업페이지 오픈(도로명)(5자리 일괄 전환에 따른 기존 6자리 포함)
		 * @param {Object} form_name					: 폼이름(form)
		 * @param {Object} zipcode_name					: 우편번호(text)
		 * @param {Object} address1_name				: 우편번호주소(text)
		 * @param {Object} address2_name				: 상세주소(text)
		 * @param {Object} usage_cleanaddress			: 정제주소사용여부(Y:정제, N:일반)
		 * @param {Object} zip_serial_name				: 우편일련번호(선택사항)(hidden)
		 * @param {Object} formatted_type				: 표준화주소용(hidden)
		 * @param {Object} zipcode_gubun_code			: 주소표시구분코드 (hidden)
		 * @param {Object} zipcode						: 지번우편번호(hidden)
		 * @param {Object} ser_no						: 지번일련번호(hidden)

		 * @param {Object} jibun_basic_address			: 지번기본주소(hidden)
		 * @param {Object} jibun_detail_address			: 지번상세주소(hidden)
		 * @param {Object} streetname_basic_address		: 도로기본주소(hidden)
		 * @param {Object} streetname_detail_address	: 도로상세주소(hidden)
		 * @param {Object} streetname_zipcode			: 도로명우편번호(hidden)
		 * @param {Object} streetname_manage_num		: 도로명우편보조번호(hidden)
		 * @param {Object} streetname_area_code			: 도로명구역코드(hidden)
		 * @param {Object} jiha_yn						: 도로명지하구분(hidden)
		 * @param {Object} building_major_num			: 도로명건물본번호(hidden)
		 * @param {Object} building_minor_num			: 도로명건물부번호(hidden)

		 * @param {Object} building_manage_num			: 도로명건물관리번호(hidden)
		 * @param {Object} streetname_eupmyun_seq		: 도로명읍면번호(hidden)
		 * @param {Object} streetname_detail			: 도로명상세주소(hidden)
		 * @param {Object} zipcode_origin				: 우편번호6자리(hidden)
		 * @param {Object} zip_serial_name_origin		: 우편번호6자리 일련번호(hidden)
		 */
		popupZipcodeInqueryWithTypeStreetNamePlusSix_MNBANK : function( form_name
																		, zipcode_name
																		, address1_name
																		, address2_name
																		, usage_cleanaddress
																		, zip_serial_name
																		, formatted_type
																		, zipcode_gubun_code
																		, zipcode
																		, ser_no
																		, jibun_basic_address
																		, jibun_detail_address
																		, streetname_basic_address
																		, streetname_detail_address
																		, streetname_zipcode
																		, streetname_manage_num
																		, streetname_area_code
																		, jiha_yn
																		, building_major_num
																		, building_minor_num
																		, building_manage_num
																		, streetname_eupmyun_seq
																		, streetname_detail
																		, zipcode_origin
																		, zip_serial_name_origin ){
			var url       = "/mquics?page=D002204";
			var params    = "&form_name=" + form_name;
				params   += "&zip_field_name=" + zipcode_name;
				params   += "&address1_field_name=" + address1_name;
				params   += "&address2_field_name=" + address2_name;
				params   += "&clean_address=" + usage_cleanaddress;
				params   += "&zip_serial_name=" + zip_serial_name;
				params   += "&formatted_type=" + formatted_type;
				params   += "&zipcode_gubun_code=" + zipcode_gubun_code;
				params   += "&zipcode=" + zipcode;
				params   += "&ser_no=" + ser_no;
				params   += "&jibun_basic_address=" + jibun_basic_address;
				params   += "&jibun_detail_address=" + jibun_detail_address;
				params   += "&streetname_basic_address=" + streetname_basic_address;
				params   += "&streetname_detail_address=" + streetname_detail_address;
				params   += "&streetname_zipcode=" + streetname_zipcode;
				params   += "&streetname_manage_num=" + streetname_manage_num;
				params   += "&streetname_area_code=" + streetname_area_code;
				params   += "&jiha_yn=" + jiha_yn;
				params   += "&building_major_num=" + building_major_num;
				params   += "&building_minor_num=" + building_minor_num;
				params   += "&building_manage_num=" + building_manage_num;
				params   += "&streetname_eupmyun_seq=" + streetname_eupmyun_seq;
				params   += "&streetname_detail=" + streetname_detail;
				params   += "&zipcode_origin=" + zipcode_origin;
				params   += "&zip_serial_name_origin=" + zip_serial_name_origin;
				params   += "&functionName=none";

			window.appManager.openWebViewWithPopup(url, caq.util.paramsToJson(params), caq.popupzipcodeCalback_MNBANK);
		},

		/**
		 * caq.popupZipcodeInqueryWithTypeTonghap_MNBANK()	: 우편번호조회 팝업페이지 오픈(통합검색)
		 * @param {Object} form_name						: 폼이름(form)
		 * @param {Object} zipcode_name						: 우편번호(text)
		 * @param {Object} address1_name					: 우편번호주소(text)
		 * @param {Object} address2_name					: 상세주소(text)
		 * @param {Object} usage_cleanaddress				: 정제주소사용여부(Y:정제, N:일반)
		 * @param {Object} zip_serial_name					: 우편일련번호(선택사항)(hidden)
		 * @param {Object} formatted_type					: 표준화주소용(hidden)
		 * @param {Object} zipcode_gubun_code				: 주소표시구분코드 (hidden)
		 * @param {Object} zipcode							: 지번우편번호(hidden)
		 * @param {Object} ser_no							: 지번일련번호(hidden)

		 * @param {Object} jibun_basic_address				: 지번기본주소(hidden)
		 * @param {Object} jibun_detail_address				: 지번상세주소(hidden)
		 * @param {Object} streetname_basic_address			: 도로기본주소(hidden)
		 * @param {Object} streetname_detail_address		: 도로상세주소(hidden)
		 * @param {Object} streetname_zipcode				: 도로명우편번호(hidden)
		 * @param {Object} streetname_manage_num			: 도로명우편보조번호(hidden)
		 * @param {Object} streetname_area_code				: 도로명구역코드(hidden)
		 * @param {Object} jiha_yn							: 도로명지하구분(hidden)
		 * @param {Object} building_major_num				: 도로명건물본번호(hidden)
		 * @param {Object} building_minor_num				: 도로명건물부번호(hidden)

		 * @param {Object} building_manage_num				: 도로명건물관리번호(hidden)
		 * @param {Object} streetname_eupmyun_seq			: 도로명읍면번호(hidden)
		 * @param {Object} streetname_detail				: 도로명상세주소(hidden)
		 * @param {Object} zipcode_origin					: 우편번호6자리(hidden)
		 * @param {Object} zip_serial_name_origin			: 우편번호6자리 일련번호(hidden)
		 */
		popupZipcodeInqueryWithTypeTonghap_MNBANK : function( form_name
															  , zipcode_name
															  , address1_name
															  , address2_name
															  , usage_cleanaddress
															  , zip_serial_name
															  , formatted_type
															  , zipcode_gubun_code
															  , zipcode
															  , ser_no
															  , jibun_basic_address
															  , jibun_detail_address
															  , streetname_basic_address
															  , streetname_detail_address
															  , streetname_zipcode
															  , streetname_manage_num
															  , streetname_area_code
															  , jiha_yn
															  , building_major_num
															  , building_minor_num
															  , building_manage_num
															  , streetname_eupmyun_seq
															  , streetname_detail
															  , zipcode_origin
															  , zip_serial_name_origin ){
			var url       = "/mquics?page=D002202";
			var params    = "&form_name=" + form_name;
				params   += "&zip_field_name=" + zipcode_name;
				params   += "&address1_field_name=" + address1_name;
				params   += "&address2_field_name=" + address2_name;
				params   += "&clean_address=" + usage_cleanaddress;
				params   += "&zip_serial_name=" + zip_serial_name;
				params   += "&formatted_type=" + formatted_type;
				params   += "&zipcode_gubun_code=" + zipcode_gubun_code;
				params   += "&zipcode=" + zipcode;
				params   += "&ser_no=" + ser_no;
				params   += "&jibun_basic_address=" + jibun_basic_address;
				params   += "&jibun_detail_address=" + jibun_detail_address;
				params   += "&streetname_basic_address=" + streetname_basic_address;
				params   += "&streetname_detail_address=" + streetname_detail_address;
				params   += "&streetname_zipcode=" + streetname_zipcode;
				params   += "&streetname_manage_num=" + streetname_manage_num;
				params   += "&streetname_area_code=" + streetname_area_code;
				params   += "&jiha_yn=" + jiha_yn;
				params   += "&building_major_num=" + building_major_num;
				params   += "&building_minor_num=" + building_minor_num;
				params   += "&building_manage_num=" + building_manage_num;
				params   += "&streetname_eupmyun_seq=" + streetname_eupmyun_seq;
				params   += "&streetname_detail=" + streetname_detail;
				params   += "&zipcode_origin=" + zipcode_origin;
				params   += "&zip_serial_name_origin=" + zip_serial_name_origin;
				params   += "&functionName=none";

			window.appManager.openWebViewWithPopup(url, caq.util.paramsToJson(params), caq.popupzipcodeCalback_MNBANK);
		},

		popupzipcodeCalback_MNBANK : function (param) {
            var jsonParam = param;

            var key = Object.keys(jsonParam);
            var objForm = $(document).find("[name='" + jsonParam.FORM_NAME + "']");     
            
            for(key in jsonParam){
                if("FORM_NAME" != key){
                    //	주소영역 show
                    if( objForm.find("[id='"+ key + "_div']").length > 0 ){
                    	objForm.find("[id='"+ key + "_div']").css("display","block");
                    }

                    //	Text영역에 데이터 저장
                    if( objForm.find("[id='"+ key + "_text']").length > 0 ){
                    	objForm.find("[id='"+ key + "_text']").text( jsonParam[key] );
                    }

                    objForm.find("[id='"+ key + "']").val(jsonParam[key]);
                } 
            }
            
        }

	};
}();

// -----------------------------------------------------------------------------------------------------------------------
// * 공통 팝업 Iframe
// -----------------------------------------------------------------------------------------------------------------------
caq.popup = function(){
    var _NEXT_TARGET_OBJID = "";
    var _CURR_IFRAME_OBJID = "";    //최종 iframe 레이어 div id(2013.08.29 스타뱅킹3.0 추가)
    
    return {
    /**
     * caq.popup.iFrameShow(objId,url,nextObjId) : 팝업레이어 Iframe 보여주기
     * @param {Object} objId     : 팝업레이어 DIV ID
     * @param {Object} url       : Iframe의 src 속성값
     * @param {Object} nextObjId : 닫기 후 focus 될 DOM객체의 ID
     */
        iFrameShow : function(objId, url, nextObjId) {
            _NEXT_TARGET_OBJID = nextObjId;
            _CURR_IFRAME_OBJID = objId;
    
            var sWidth = $(window).width();
            var sHeight = $(window).height();
            // div, iframe(mnbankPop) 유무 체크
            if($('#mnbankPop').length > 0) {
            	$('#mnbankPop').remove();
            }
            var iframeDiv = "<div id='" + objId + "' style='position:fixed;left:0;top:0;display:none;background-color:#fff;z-Index:1002;'>";
            iframeDiv += "  <iframe  src='../../cache/resource/html/docReadyFragment.html' id='" + objId + "-Iframe' name='" + objId + "-Iframe'></iframe>";
            iframeDiv += "</div>";
            $("body").append(iframeDiv);
            var targetObj = $("#" + objId);
            targetObj.css({
                "width" : sWidth,
                "height" : sHeight
            });
            $("#" + objId + "-Iframe").css({
                "width" : sWidth,
                "height" : sHeight
            });
            //targetObj.find("iframe").attr("src", url);
            //targetObj.show();
            // SPA 방식으로 변경됨에 따라 페이지 load 방식을 SPA로 변경       
            window.SPA_COMMON.iFrameShow(objId, url, targetObj);
        },
          /**
           * caq.popup.iFrameHide(objId) : 팝업레이어 Iframe 숨기기
           * @param {Object} objId : 팝업레이어 DIV ID
           */
          iFrameHide : function(objId){
              if(typeof objId == "undefined" || objId == null)
                  objId = _CURR_IFRAME_OBJID;

             $("#"+objId).hide();
             $("#"+objId + "-Iframe").hide();
             $("#"+objId + "-Iframe").remove();
            $("#"+objId).remove();
            _CURR_IFRAME_OBJID = "";

            var tarObj = $("input[name='"+_NEXT_TARGET_OBJID+"']");
            if(tarObj.prop("readonly")){
              tarObj.removeAttr("readonly");
              tarObj.focus();
              tarObj.attr("readonly","readonly");
              tarObj.blur();
            }else{
              tarObj.focus();
            }
          }
    };
 }();
 
//-----------------------------------------------------------------------------------------------------------------------
//* 공통에러 자바스크립트
//-----------------------------------------------------------------------------------------------------------------------

caq.error = function(){
    var errOriData = {};
    var TEMPLATE_PATH_SERVER = "";
    var TEMPLATE_ERR_DEFAULT = "OP_IBF_WEBDefaultErrTemp";    
    var TEMPLATE_ERR_DEFAULT_POPUP = "OP_IBF_WEBDefaultErrTempPopup";
    var TEMPLATE_ERR_DEFAULT_LAYER_POPUP = "OP_IBF_WEBDefaultErrTempLayerPopup";
    
    var href = location.href;
    if(href.indexOf("/app/") > -1) {
        TEMPLATE_PATH_SERVER = href.substring(0, href.indexOf("/app/")) + "/html/caq/template/";
    } else {
        if(device.platform.match(/Orchestra Simulator/)) {
            TEMPLATE_PATH_SERVER = "/mobank5/html/caq/template/";
        } else {
            TEMPLATE_PATH_SERVER = "/data/data/com.kbstar.kbbank/files/app/html/caq/template/";
        }
    }

    return {
        /**
        * caq.error.setErrorMsg(errCode, errMsg, errUrl, errUrlNm, errLinkTxt, errLinkUrl, errLinkImgUrl, errAlertFlag) : 공통에러영역 보여주기
        * @param errCode       : 에러코드
        * @param errMsg        : 에러메세지
        * @param errUrl        : 에러메세지를 보여준후 이동할 PageUrl
        * @param errUrlNm      : 에러메세지를 보여준후 이동할 Page명
        * @param errLinkTxt    : 고객용안내내용
        * @param errLinkUrl    : 고객용안내URL
        * @param errLinkImgUrl : 고객용안내이미지경로내용
        * @param errAlertFlag  : 에러메세지 보여주는 형태 true: alert 에러문구 보여줌, false: 스크린영역의 에러처리
        * @param errorurlnm    : 에러메세지 확인버튼 클릭후 이동할 페이지명
        * @param errorpopup    : 팝업화면 여부
        * @param errorbutton   : 확인, 닫기 버튼 여부
        */
        setErrorPrint : function(errCode, errMsg, errUrl, errUrlNm, errLinkTxt, errLinkUrl, errLinkImgUrl, errAlertFlag, errPopup, errButton){
            $.get(TEMPLATE_PATH_SERVER + "" + TEMPLATE_ERR_DEFAULT + ".html", function(src){

                var errTemp = src;
                
                if( $("body").find("#errorDiv").val() == null ) {
                    $("body").prepend(errTemp);
                }
                
                var goErrPage = ''; 
                
                if(errUrl != '') {
                    goErrPage = "javascript:goErrPage('" + errUrl + "');";
                }
                
                if(errAlertFlag){
                    alert("["+errCode+"] "+errMsg);
                }else{
                    if(errMsg != ""){
                        var newErrLnk    = "";
                        var newImgErrLnk = "";

                        $("#errMsg").html(errMsg);
                        
                        if(errCode != ""){
                            $("#errCd").html("("+errCode+")");
                            $("#errUl").show();
                        }else{
                            $("#errUl").hide();
                        }
                        
                        if(errLinkUrl != ""){
                            newErrLnk = '<a href="'+errLinkUrl+'">'+errLinkTxt+'</a>';
                        }else{
                            newErrLnk = errLinkTxt;
                        }
                        
                        if(errLinkImgUrl != ""){
                            newImgErrLnk = '<a href="'+errLinkUrl+'">'+errLinkImgUrl+'</a>';
                        }else{
                            newImgErrLnk = errLinkImgUrl;
                        }
                        
                        $("#linkText").html(newErrLnk + " " + newImgErrLnk);

                        if(errUrl != "") {
                            $("#errorTransfer").show();
                            $("#errorTransfer #goPage").html(errUrlNm);
                            $("#errorTransferBtn").show();
                            $("#errorTransferBtn").find("span a").attr("href", goErrPage);
                            
                        }else{
                            $("#errorTransfer").hide();
                            $("#errorTransferBtn").hide();
                        }
                        
                        if(errLinkUrl != ""){
                            $("#errorTransfer").hide();
                            $("#errorTransferBtn").hide();
                        }
                        
                        $("#errorDiv").show();
                        $("html").scrollTop(0);
                        $("body").scrollTop(0);
                    }else{
                        $("#errorDiv").hide();
                    }
                }
                
                // 버튼 처리
                if(errButton != '1') {  // 확인,닫기 버튼 안보이게
                    $("#errorTransferBtn").hide();
                    $("#errorClose").hide();
                    $("#errorTransfer").hide(); // ' 화면으로 이동합니다.' 문구 안보이게
                } else {
                    if(errPopup == '0') {   // 팝업 닫기 버튼 안보이게
                        $("#errorClose").hide();
                    } else { // 확인 버튼 안보이게
                        $("#errorTransferBtn").hide();
                    }
                }
            },"text"); 
        },
    
        /**
         * caq.error.setErrorPrintPopup(errCode, errMsg, errUrl, errUrlNm, errLinkTxt, errLinkUrl, errLinkImgUrl, errAlertFlag) : 공통에러영역 보여주기
         * @param errCode       : 에러코드
         * @param errMsg        : 에러메세지
         * @param errUrl        : 에러메세지를 보여준후 이동할 PageUrl
         * @param errUrlNm      : 에러메세지를 보여준후 이동할 Page명
         * @param errLinkTxt    : 고객용안내내용
         * @param errLinkUrl    : 고객용안내URL
         * @param errLinkImgUrl : 고객용안내이미지경로내용
         * @param errAlertFlag  : 에러메세지 보여주는 형태 true: alert 에러문구 보여줌, false: 스크린영역의 에러처리
         * @param errorurlnm    : 에러메세지 확인버튼 클릭후 이동할 페이지명
         * @param errorpopup    : 팝업화면 여부
         * @param errorbutton   : 확인, 닫기 버튼 여부
         */
        setErrorPrintPopup : function(errCode, errMsg, errUrl, errUrlNm, errLinkTxt, errLinkUrl, errLinkImgUrl, errAlertFlag, errPopup, errButton){
             $.get(TEMPLATE_PATH_SERVER + "" + TEMPLATE_ERR_DEFAULT_POPUP + ".html", function(src){
                 var errTemp = src;
                 $(content).html(errTemp);
                 
                 if(errAlertFlag){
                     alert("["+errCode+"] "+errMsg);
                 }else{
                     if(errMsg != ""){
                         var newErrLnk    = "";
                         var newImgErrLnk = "";

                         $("#errMsg").html(errMsg);
                         
                         if(errCode != ""){
                             $("#errCd").html("("+errCode+")");
                             $("#errUl").show();
                         }else{
                             $("#errUl").hide();
                         }
                         
                         if(errLinkUrl != ""){
                             newErrLnk = '<a href="'+errLinkUrl+'">'+errLinkTxt+'</a>';
                         }else{
                             newErrLnk = errLinkTxt;
                         }
                         
                         if(errLinkImgUrl != ""){
                             newImgErrLnk = '<a href="'+errLinkUrl+'">'+errLinkImgUrl+'</a>';
                         }else{
                             newImgErrLnk = errLinkImgUrl;
                         }
                         
                         $("#linkText").html(newErrLnk + " " + newImgErrLnk);

                         if(errUrl != "") {
                             $("#errorTransfer").show();
                             $("#errorTransfer #goPage").html(errUrlNm);
                             $("#errorTransferBtn").show();
                         }else{
                             $("#errorTransfer").hide();
                             $("#errorTransferBtn").hide();
                         }
                         if(errLinkUrl != ""){
                             $("#errorTransfer").hide();
                             $("#errorTransferBtn").hide();
                         }
                     }
                 }
                 // 버튼 처리
                 if(errButton != '1') {  // 확인,닫기 버튼 안보이게
                     $("#errorTransferBtn").hide();
                     $("#errorTransfer").hide(); // ' 화면으로 이동합니다.' 문구 안보이게
                 } else {
                     if(errPopup == '0') {   // 팝업 닫기 버튼 안보이게
                         $("#errorClose").hide();
                     } else { // 확인 버튼 안보이게
                         $("#errorTransferBtn").hide();
                     }
                 }
             },"text"); 
         },
         
         /**
          * caq.error.setErrorPrintLayerPopup(errCode, errMsg, errUrl, errUrlNm, errLinkTxt, errLinkUrl, errLinkImgUrl, errAlertFlag, errParam) : 공통에러영역 보여주기
          * @param errCode       : 에러코드
          * @param errMsg        : 에러메세지
          * @param errUrl        : 에러메세지를 보여준후 이동할 PageUrl
          * @param errUrlNm      : 에러메세지를 보여준후 이동할 Page명
          * @param errLinkTxt    : 고객용안내내용
          * @param errLinkUrl    : 고객용안내URL
          * @param errLinkImgUrl : 고객용안내이미지경로내용
          * @param errAlertFlag  : 에러메세지 보여주는 형태 true: alert 에러문구 보여줌, false: 스크린영역의 에러처리
          * @param errorurlnm    : 에러메세지 확인버튼 클릭후 이동할 페이지명
          * @param errorpopup    : 팝업화면 여부
          * @param errorbutton   : 확인, 닫기 버튼 여부
          * @param errorbutton   : 확인, 닫기 버튼 여부
          */
         setErrorPrintLayerPopup : function(errCode, errMsg, errUrl, errUrlNm, errLinkTxt, errLinkUrl, errLinkImgUrl, errAlertFlag, errPopup, errButton, errParam, lang_type){
              /*$.get(TEMPLATE_PATH_SERVER + "" + TEMPLATE_ERR_DEFAULT_LAYER_POPUP + "" + lang_type + ".html", function(src){
                  var errTemp = src;
                  $("body").prepend(errTemp);

                  var goErrPage = "javascript:goErrPage('" + errUrl + "','" + errParam + "');return false;";    // 페이지 이동 
                  var popupClose = "javascript:errTempPopupClose() ;return false;"; // 팝업창  닫기
                      
                  if(errAlertFlag){
                      alert("["+errCode+"] "+errMsg);
                  }else{
                      if(errMsg != ""){
                          var newErrLnk    = "";
                          var newImgErrLnk = "";
                          var start = "/mquics?page=";

                          $("#errMsg").html(errMsg);
                          
                          // 에러메세지 링크 처리 start
                          var errLink = $("#errMsg").find("a").attr("href");
                          
                          if(errLink != undefined) {
                              var startInt = errLink.indexOf(start);
                              
                              if(startInt != -1) {
                                  
                                  var errMsgPageInfo = errLink.substr(startInt+13, 7);
                                  var errMsgLink = "javascript:errorPopupCloseGoPage('" + errMsgPageInfo + "');return false;";
                                  
                                  $("#errMsg").find("a").attr("href", errMsgLink);
                              }
                          }
                          // 에러메세지 링크 처리 end
                          if(errCode != ""){
                              $("#errCd").html("("+errCode+")");
                              $("#errUl").show();
                          }else{
                              $("#errUl").hide();
                          }
                          
                          if(errLinkUrl != ""){
                              
                              var startLinkInt = errLinkUrl.indexOf(start);
                              var errMsgLink = '';
                              
                              if(startLinkInt != -1) {
                                  var errLinkPageInfo = errLinkUrl.substr(startLinkInt+13, 7);
                                  errMsgLink = "javascript:errorPopupCloseGoPage('" + errLinkPageInfo + "');return false;";
                              }
                              
                              newErrLnk = '<a href="'+errMsgLink+'">'+errLinkTxt+'</a>';
                          }else{
                              newErrLnk = errLinkTxt;
                          }
                          
                          if(errLinkImgUrl != ""){
                              var startLinkImgInt = errLinkUrl.indexOf(start);
                              var errMsgLinkImg = '';
                              
                              if(startLinkImgInt != -1) {
                                  var errLinkImgPageInfo = errLinkImgUrl.substr(startLinkImgInt+13, 7);
                                  errMsgLinkImg = "javascript:errorPopupCloseGoPage('" + errLinkImgPageInfo + "');return false;";
                              }
                              newImgErrLnk = '<a href="'+errMsgLinkImg+'">'+errLinkImgUrl+'</a>';
                          }else{
                              newImgErrLnk = errLinkImgUrl;
                          }
                          
                          $("#linkText").html(newErrLnk + " " + newImgErrLnk);
                      }
                  }
                  
                  // 버튼 처리
                  if(errPopup == '1') {
                      errButton = '0';
                  }
                  
                  if(errButton == '1') {  
                      $("#errorTransferBtn").show();    // 확인 버튼 show
                      $("#errorTransfer").show();       // ' 화면으로 이동합니다.' show
                      $("#errorClose").hide();          // 닫기 버튼 hide
                      
                      $("#errorTransfer #goPage").html(errUrlNm);
                      $("#errBtnConfirm").attr("onclick", goErrPage);
                      $("#errCommonClose").attr("onclick", goErrPage);
                      
                      if(errLinkUrl != ""){
                          // 확인버튼 클릭시 errLinkUrl 화면으로 이동
                          $("#errorTransfer #goPage").html(errLinkTxt);
                          $("#errBtnConfirm").attr("onclick", errLinkUrl);
                          $("#errCommonClose").attr("onclick", errLinkUrl);
                          $("#linkText").html("");
                      }
                  } else if(errButton == '0') { 
                      $("#errorTransferBtn").hide();    // 확인 버튼 hide
                      $("#errorTransfer").hide();       // ' 화면으로 이동합니다.' hide
                      if(errPopup == '0') {   
                          $("#errorClose").hide();      // 닫기 버튼 hide
                          $("#errorLayerClose").show(); // 레이어 닫기 버튼 show
                      } else if(errPopup == '1') {
                          $("#errorClose").show();      // 닫기 버튼 show
                          $("#errCommonClose").attr("onclick", popupClose);
                      }
                  }
                  
                  // 화면 위치 설정
                  var osGubun = getUserAgent();
                  caq.error.fnComLayerPopUi('#errorLayerPopupDiv', osGubun);
              },"text"); */

        	 if(errAlertFlag){
                 alert("["+errCode+"] "+errMsg);
             }else{
	        	 var errorHtml	 = '<div id="error_confirm_html" class="layerHTML">';
	        	 var newImgErrLnk = "";
	        	 if(errCode == '' || errCode == undefined || errCode == null){
	        		 errCode = 'CBFBB800';
	        	 }
	        	 errorHtml 		+= '	<div class="ly_cnt">';
	        	 errorHtml 		+= '		<div class="section">';
        		 errorHtml 		+= '			<span>고객님 죄송합니다.</span><br/>';
	        	 errorHtml 		+= '			<span>응답코드('+ errCode+')</span><br/>';
	        	 errorHtml 		+= '			<span>' + errMsg + '</span><br/>';
	        	 if(errButton == '1') {
	        		 errorHtml 	+= '			<span>확인을 누르시면 '+ errUrlNm + ' 화면으로 이동합니다.</span><br/>';
	        	 }
	        	 errorHtml 		+= '			<span>1588-9999, 1599-9999, 1644-9999</span>';
        		 errorHtml 		+= '		</div>';
	    		 errorHtml 		+= '	</div>';
				 errorHtml 		+= '	<div class="btn_pop_confirm_wrap">';
				 errorHtml 		+= '		<div class="btn_area">';
				 if(errButton == '1') {
					 
					 var dataParam = JSON.parse(errParam);
					 if(errUrl == '' || errUrl == undefined || errUrl == null){
						 errUrl = 'D001374';
					 }
					 //var btnEvnt = 'window.navi.navigateWithInit(\'/mquics?page=\''+errUrl + '\',{}, function(){});';
					 var btnEvnt = 'window.navi.navigateWithInit(\'/mquics?page=' + errUrl + '\',{}, function(){});';
					 
					 if(errUrl == 'main'){
						 btnEvnt = 'window.configManager.moveToBankHome()';
					 }else if(errUrl == 'logout'){
						 btnEvnt = 'window.configManager.requestLogout("","0");';
					 }
					 errorHtml 	+= '			<span><button type="button" class="btn primary lg" data-action="close" id="var_test" onclick="javascript:'+ btnEvnt +'">확인</button></span>';
				 
				 }else{
					 errorHtml 	+= '			<span><button type="button" class="btn primary lg" data-action="close" id="var_test">확인</button></span>';
				 }
				 errorHtml 		+= '		</div>';
				 errorHtml 		+= '	</div>';
				 errorHtml 		+= '</div>';
				 
				 $("#wrap").after(errorHtml);
				 
				 $.ohyLayer({                 
	                title:'',
	                content:'#error_confirm_html',
	                type:'confirm', 
	                closeUse:false,
	            });
             }
        },
        
        /**
         * caq.error.caq_printError(data) : 공통에러영역 보여주기
         * @param data.msg.common.
         * @param errCode		: 에러코드
         * @param errMsg		: 에러메세지
         * @param errUrl		: 에러메세지를 보여준후 이동할 PageUrl
         * @param errUrlNm		: 에러메세지를 보여준후 이동할 Page명
         * @param errLinkTxt	: 고객용안내내용
         * @param errLinkUrl	: 고객용안내URL
         * @param errLinkImgUrl	: 고객용안내이미지경로내용
         * @param errAlertFlag	: 에러메세지 보여주는 형태 true: alert 에러문구 보여줌, false: 스크린영역의 에러처리
         * @param errorurlnm	: 에러메세지 확인버튼 클릭후 이동할 페이지명
         * @param errorpopup	: 팝업화면 여부
         * @param errorbutton	: 확인, 닫기 버튼 여부
         */ 
        caq_printError : function(data){
            if (device.platform.match(/Orchestra Simulator/)) {
                // QAction 이면서 페이지 이동시 에러 템플릿 화면 위치 조정을 위해서
                var err_popup = data.msg.common.errorpopup;
                var err_button = data.msg.common.errorbutton;
                if(err_popup == "" || err_popup == undefined || typeof err_popup == undefined) {
                    err_popup = '0'; 
                } 
                if(err_button == "" || err_button == undefined || typeof err_button == undefined) {
                    err_button = '1'; 
                }
                if(err_popup == '1') {
                    err_button = '0';
                }
                if(err_button == '1') {  
                    $("#content").remove();
                } else if(err_button == '0') {
                    if(err_popup == '1') {
                       $("#content").remove();
                    } 
                }
                errOriData = data;  
                // 언어타입 정보  
//                window.UserPreference.getValue(caq.error.caq_error, caq.error.caq_error, 'locale');
                caq.error.caq_error();
            } else {
                var err_button          = data.msg.common.errorbutton;
                if(err_button == '0'){
                    kbstar.callScript = 'F';
                }
                var errCode = "";;
                var errMSG = "";
                var errLinkTxt = "";
                var errLinkUrl = "";
                var errLinkImgUrl = "";
                var errUrl = "";
                var QPageStart = "";;
                var QPageStartTitle = "";;
    
                if(typeof data.msg.servicedata != 'undefined' ){
                    errCode = data.msg.servicedata.ERR_CODE;
                    errMSG = data.msg.servicedata.ERR_MSG;
                    errUrl = data.msg.servicedata.ERR_URL;
                    errLinkTxt = data.msg.servicedata.ERR_LNKTXT;
                    errLinkUrl = data.msg.servicedata.ERR_LNKURL;
                    errLinkImgUrl = data.msg.servicedata.ERR_LNKIMGURL;
                    QPageStart = data.msg.servicedata.QPageStart;
                    QPageStartTitle = data.msg.servicedata.QPageStartTitle;
                }
                
                // nfilter 오류인 경우(서버에서 키 생성후 키를 write)
                if(errCode == "CBP2001" || errCode == "UCBP0006") {
                    kbstar.connect.request('/mquics?QAction=1033457&page=D002561', {}, caq.error.nFilterSuccessCallback, caq.error.nFilterFailCallback, true);
                }
    
                var params = {
                    errCode : errCode,
                    errMSG : errMSG,
                    errUrl : errUrl,
                    errcustlinktxt : errLinkTxt,
                    errcustlinkurl : errLinkUrl,
                    errcustlinkimgurl : errLinkImgUrl,
                    QPageStart : QPageStart,
                    QPageStartTitle : QPageStartTitle,
                    callScript : kbstar.callScript
                };
                
                window.appManager.showErrDialog(function(data){               
                    if((typeof data.ERR_URL == 'string') && data.ERR_URL.length > 0){
                        if(data.ERR_URL == 'onClose'){
                            onClose();
                        }else{
                            window.navi.navigateWithInit(data.ERR_URL, {}, function(){});
                        }
                    }else{
                        window.LocalStorage.getItem("QPageStart", function(error_url){
                            if(error_url == 'main') {
                                window.configManager.moveToBankHome();
                            } else if(error_url == 'logout') {    
                                window.configManager.requestLogout("","0");
                            } else if(error_url != null && error_url != ""){
                                window.navi.navigateWithInit('/mquics?page='+error_url, {}, function(){});
                            }
                        });
                    }
                }, params);
            }
        },
        
        /**
        * caq.error.caq_printError(data) : 공통에러영역 보여주기
        * @param data.msg.common.
        * @param errCode       : 에러코드
        * @param errMsg        : 에러메세지
        * @param errUrl        : 에러메세지를 보여준후 이동할 PageUrl
        * @param errUrlNm      : 에러메세지를 보여준후 이동할 Page명
        * @param errLinkTxt    : 고객용안내내용
        * @param errLinkUrl    : 고객용안내URL
        * @param errLinkImgUrl : 고객용안내이미지경로내용
        * @param errAlertFlag  : 에러메세지 보여주는 형태 true: alert 에러문구 보여줌, false: 스크린영역의 에러처리
        * @param errorurlnm    : 에러메세지 확인버튼 클릭후 이동할 페이지명
        * @param errorpopup    : 팝업화면 여부
        * @param errorbutton   : 확인, 닫기 버튼 여부
        * @param lang_type     : 언어 타입
        */
        caq_error : function(val){
            var lang_type = "";
            if(!device.platform.match(/Orchestra Simulator/)) {
                lang_type = val;
                if(lang_type == "" || lang_type == undefined) {
                    lang_type = "";
                } else if(lang_type == '0' || lang_type == 'ko') {
                    lang_type = "";
                } else if(lang_type == '1' || lang_type == 'en') {
                    lang_type = "Eng";
                }
            }
            
            var data = errOriData;
            
            var status = "";
            try {
                status = data.msg.common.status;
            } catch(e) {
                //console.log("caq_printError data.msg.common.status not value : " + e);
            }
            
            if(status == "F"){
                var error_code          = data.msg.common.errorcode;
                var error_msg           = data.msg.common.errormessage;
                
                // 로그인이 필요하다는 에러메세지인 경우 로그아웃 하고 메인으로 이동하는 API 호출
                if(error_code == "CBP0601" || error_code == "UCBP0010") { 
                    try {
                        window.configManager.requestLogout("","2");
                        return;
                    } catch(e) {
                        //console.log("window.configManager.requestCertLogin() : " + e);
                    }
                }
                
                // nfilter 오류인 경우(서버에서 키 생성후 키를 write)
                if(error_code == "CBP2001" || error_code == "UCBP0006") {
                    var asisPageInfo = "D002561";   // 에러인 경우 asisPageInfo 정보가 없으므로 임시로 설정
                    var param = "{}";
                    kbstar.connect.request('/mquics?QAction=1033457&page=' + asisPageInfo, param, caq.error.nFilterSuccessCallback, caq.error.nFilterFailCallback, true);
                }
                
                var error_url = "";
                try { error_url = data.msg.servicedata.QPageStart; } catch(e) {}
                if(error_url == "" || error_url == undefined || typeof error_url == undefined) {
                    window.LocalStorage.getItem("QPageStart", function(data){
                        error_url = data;
                    });
                }
                
                var err_custlinktxt     = data.msg.common.errcustlinktxt;
                if(err_custlinktxt == undefined) {
                    err_custlinktxt = ''; 
                }
                var err_custlinkurl     = data.msg.common.errcustlinkurl;
                if(err_custlinkurl == undefined) {
                    err_custlinkurl = ''; 
                }
                var err_custlinkimgurl  = data.msg.common.errcustlinkimgurl;
                if(err_custlinkimgurl == undefined) {
                    err_custlinkimgurl = ''; 
                }

                var error_urlnm = "";
                try { error_urlnm = data.msg.servicedata.QPageStartTitle; } catch(e) {}
                if(error_urlnm == "" || error_urlnm == undefined || typeof error_urlnm == undefined) {
                    window.LocalStorage.getItem("QPageStartTitle", function(data){
                        error_urlnm = data;
                    });
                }  
            
                var err_popup           = data.msg.common.errorpopup;
                var err_button          = data.msg.common.errorbutton;

                if(err_popup == "" || err_popup == undefined || typeof err_popup == undefined) {
                    err_popup = '0'; 
                } 
             
                if(err_button == "" || err_button == undefined || typeof err_button == undefined) {
                    err_button = '1'; 
                }
                
                // 에러파라미터 추가
                var err_param = data.msg.common.errorparam;
                if(err_param == undefined) {
                    err_param = '{}'; 
                }
                if( $("body").find("#errorLayerPopupDiv").val() != null ) {
                    $("#errorLayerPopupDiv").remove();
                }
                caq.error.setErrorPrintLayerPopup(error_code, error_msg, error_url, error_urlnm, err_custlinktxt, err_custlinkurl,err_custlinkimgurl, false, err_popup, err_button, err_param, lang_type);
            }
        },
        
        errorPopupSuccessCallback : function(param) {

            var gubun                       = param.GUBUN; // 0 : 닫기, 1 : 페이지 이동
            var page_info                   = param.PAGE_INFO;
            var error_param                 = param.ERROR_PARAM;
            var dataParam;
            dataParam = JSON.parse(error_param);
            
            if(gubun == '1') {
                window.navi.navigate("/mquics?page=" + page_info, dataParam, function(){});
            } 
        },
        
        nFilterSuccessCallback: function(data) {
            var publickey = data.data.msg.servicedata.publicKey;
            // native write
            if(!device.platform.match(/Orchestra Simulator/)) {
                window.AppInfoManager.setPublicKey(publickey);
            }
        },
        
        nFilterFailCallback: function(data) {
            alert("nFilterFailCallback");
        },
        
        errorResize: function () {
            var box = $('.error_layerwrap');
            var maskHeight = $(document).height();
            var maskWidth = $(window).width();

            $('#layermask').css({'width':maskWidth,'height':maskHeight});

            var winH = $(window).height();
            var winW = $(window).width();

            box.css('top',  winH/2 - box.height()/2);
            box.css('left', winW/2 - box.width()/2);
        },
        
        fnComLayerPopUi: function(strId, osGubun) {
            if (strId == null || strId === undefined || strId == "") {
                return false;
            }

            var winH = $(window).height();
            var winW = $(window).width();
            var intPageYOffset = window.pageYOffset;
            var intErrDivHeight = $("#errorLayerPopupDiv").height();
            var intErrDivWidth = $("#errorLayerPopupDiv").width();
            var calTop = intPageYOffset + (winH/2 - intErrDivHeight/2);
            var calLeft = winW/2 - intErrDivWidth/2;
            
            if(winH < intErrDivHeight){
                document.getElementById("errorLayerPopupDiv").style.top = intPageYOffset + 'px';
            }else{
                document.getElementById("errorLayerPopupDiv").style.top = calTop + 'px';
            }
            document.getElementById("errorLayerPopupDiv").style.left = calLeft + 'px';
            
            $("#errorLayerPopupDiv").fadeIn(500);
        },
        
        callBackSecureErr : function(data) {
            if(data != undefined) {
                $(window).scrollTop(0);
                if(typeof caqtel.failCallBack == 'function'){
                    try{
                        caqtel.failCallBack();
                    }catch(e){
                        //console.log("[보안매체]Fail:: caqtel.failCallBack()");
                    }
                }
                data.data.msg.common.errorbutton  = "0";               // 확인 또는 닫기 버튼  (선택), default : 1
                caq.error.caq_printError(data.data);                 // 에러메세지 템플릿 호출함수
            } else {
                alert("callBackSecureErr fail");
                //console.log("[yc-log] callBackSecureErr : data != undefined else");   
            }          
        }
    };
}();

const MN_MB = function(){
	// Native 타이틀바 취소 버튼 처리
	function _onCancel() {
		//debugger;
		window.LocalStorage.getItem("QPageCancel", function(pageId){
			if (pageId == null || pageId == undefined || pageId == "") {
				if (window.SPA_COMMON.callbackWithSPA('_onCancel')) {
					// HTML 페이지에 _onCancel이 없거나 return false를 한 경우 홈으로 이동
					window.configManager.moveToBankHome();
				}
			}else{
				window.navi.getPageIndex(
					pageId,
					function(index) { 	// success callback
						if (index > 0) {
							window.navi.goBackWithCount(index, {}, "Y");
						}else{
							if (window.SPA_COMMON.callbackWithSPA('_onCancel')) {
								// HTML 페이지에 _onCancel이 없거나 return false를 한 경우 홈으로 이동
								window.configManager.moveToBankHome();
							}
						}
					},
					function(){		// fail callback
						//console.log("[MN_MB] _onCancel : fail callback");
					}
				);
			}
	    });
	}

	// 스타뱅킹 내 팝업 페이지 이동
	function _goPopupPage(strJSON) {
		var jsonParms = JSON.parse(strJSON);
	    var url = "/mquics?page=" + jsonParms["pageId"];
	    var param = {};
	    
	    if(device.devicetype == "tablet" ) {
	        param["loadMenuContent"] = "Y";
	        window.navi.navigate(url, param, function(){});
	    } else {
	        window.appManager.openWebViewWithPopup(url, param, function(){});   
	    }
	}


	// 모바일의 경우 현재페이지  url 및 현재페이지 제목 설정
	function pageInfoCallback(data) {
	    if(data.id == undefined) {
	        page = "";
	        title = "";
	    } else {
	        page = data.id;
	        title = data.title;
	    
	        title = title.substring(title.indexOf("[")+1, title.indexOf("]"));
	    }
	    window.LocalStorage.removeItem("QPageStart");
	    window.LocalStorage.removeItem("QPageStartTitle");
	    
	    window.LocalStorage.setItem("QPageStart", page);
	    window.LocalStorage.setItem("QPageStartTitle", title);
	}

	//웹의 경우 현재페이지  url 및 현재페이지 제목 설정
	function setPageInfoWeb() {
	    var title = $("title").text();
	    var url = location.href;
	    
	    var start = "page=";
	    var startInt = url.indexOf(start);
	    
	    if(startInt != -1) {
	        var page = url.substr(startInt+5, 11);
	        window.LocalStorage.setItem("QPageStart", page);
	        window.LocalStorage.setItem("QPageStartTitle", title);
	    }
	}

	// 현재페이지  url 및 현재페이지 제목 설정
	function webQPageStart() {
	    try {
	        if(device.platform.match(/Orchestra Simulator/)) {
	            setPageInfoWeb();
	            return;
	        } else {
	            window.appManager.getPageInfo(pageInfoCallback);
	            return;
	        }
	    } catch (e) {
	        //console.log("WebQPageStart() error : "+e);
	    }   
	} 

	var errData;
	//현재페이지  url 및 현재페이지 제목 설정
	function webQPageStartFirstError(data) {
	    try {
	        errData = data;
	        
	        if(device.platform.match(/Orchestra Simulator/)) {
	            setPageInfoWeb();
	            if(errData.msg.common.status == 'F') {
	                caq.error.caq_printError(data);
	            }
	            return;
	        } else {
	            window.appManager.getPageInfo(pageInfoCallbackFirstError);
	            return;
	        }
	    } catch (e) {
	        //console.log("webQPageStartFirstError(data) error : "+e);
	    }   
	} 

	// 스탭성 거래 화면 시작 위치 설정
	function webQPageCancel() {
		window.LocalStorage.setItem("QPageCancel", window.SPA.getCurrentPageId());
	}

	//모바일의 경우 첫번째 스텝의 경우 상위페이지  및 상위페이지 제목 설정
	function pageInfoCallbackFirstError(data) {
	    parentPage = data.parent_id;
	    parentTitle = data.parent_title;
	    
	    // 상위페이지 정보가 없는 경우 메인으로 설정
	    if(parentPage == undefined || parentPage == '' || typeof parentPage == 'undefined') {
	        parentPage = "D001374"; // 로그인후 메인
	        parentTitle = "메인";
	    } else {
	        parentTitle = parentTitle.substring(parentTitle.indexOf("[")+1, parentTitle.indexOf("]"));
	    }
	    window.LocalStorage.removeItem("QPageStart");
	    window.LocalStorage.removeItem("QPageStartTitle");
	    
	    window.LocalStorage.setItem("QPageStart", parentPage);
	    window.LocalStorage.setItem("QPageStartTitle", parentTitle);
	    
	    if(errData.msg.common.status == 'F') {
	        caq.error.caq_printError(errData);
	    }
	}

	/**
	 * 조회 후 포커스 이동
	 * @param {object} obj 포커스 이동할 버튼 객체
	 * @param {number} topOffset 포커스 위치조정 변수
	 */
	function fn_focusMove(obj, topOffset){
	    var _this = $(obj);
	    if(topOffset == null || typeof topOffset == "undefined" || typeof topOffset != "number"){
	        topOffset = 0;
	    }
	    
	    $("body").animate({scrollTop:_this.offset().top-topOffset}, "fast");
	}
	/**
	 * 조회 후 포커스 이동
	 * @param {number} topFocus : 포커스 이동할 위치
	 */
	function fn_focusMoveTop(topFocus){
	    if(topFocus == null || typeof topFocus == "undefined" || typeof topFocus != "number"){
	        topFocus = 0;
	    }
	    
	    $("body").animate({scrollTop:topFocus}, "fast");
	}
	
	return{
		_onCancel,
		_goPopupPage,
		pageInfoCallback,
		setPageInfoWeb,
		webQPageStart,
		webQPageStartFirstError,
		webQPageCancel,
		pageInfoCallbackFirstError,
		fn_focusMove,
		fn_focusMoveTop
	}
}

window.MN_MB = new MN_MB();


//-----------------------------------------------------------------------------------------------------------------------
//* 공통유틸 자바스크립트
//-----------------------------------------------------------------------------------------------------------------------

caq.util = function(){
 return{
     /**
      * caq.util.encodeURI(paramStr) : Get형태의 문자열의 한글처리
      * @param {Object} paramStr : Get형태의 파라미터 문자열 (예:&test1=테스트1&test2=테스트2)
      */
     encodeURI : function(paramStr){
       var returnStr = "";
       if($.browser.msie){
         returnStr = encodeURI(paramStr);
       }else{
         returnStr = paramStr;
       }
       return returnStr;
     },
     /**
      * caq.util.paramsToJson(paramStr) : Get형태의 문자열을 Json 변환
      * @param {Object} paramStr : Get형태의 파라미터 문자열 (예:&test1=테스트1&test2=테스트2)
      */
     paramsToJson : function (paramStr){
      var params     = paramStr.split("&");
      var returnJson = "";
      $(params).each(function(i) {
          var param = $(params).get(i).split("=");
          var key   = $(param).get(0);
          var val   = $(param).get(1);
          
          if(!(key===undefined || val===undefined)){
              
              returnJson += ',"'+key+'":"'+val+ '"';
          }           
      });
     
      returnJson = "{"+ returnJson.substring(1) +'}';
      
      return returnJson;
     },
     /**
      * caq.util.getScrollbarsFlag() : scrollbars 속성값 가져오기
      */
     getScrollbarsFlag : function(){
       return ($.browser.mozilla || $.browser.opera || $.browser.safari) ? "yes" : "no";
     },

     /**
      * caq.util.onDateInputBlur_m(obj,lang) : 포커스 아웃 시 yyyyMMdd 날짜 형식 검증 (스타뱅킹3.0)
      * @param {Object} obj   : 객체
      * @param {Object} lang  : 언어
      */
     onDateInputBlur_m : function(obj,lang){
      var delim = ".";
      var strVal  = $(obj).val();
      strVal = strVal.replace(/[^0-9]/g, "");

      if(strVal.length == 8) {
          if(caq.util.isDate(strVal)){
              $(obj).val(strVal.substring(0, 4) + delim + strVal.substring(4, 6) + delim + strVal.substring(6, 8));
          } else {
              alert(msg.getMsg(lang,"MSG00001"));
              $(obj).val("");
          }
      } else {
          alert(msg.getMsg(lang,"MSG00001"));
              $(obj).val("");
      }
     },
     
     /**
      * caq.util.formInputControl : 영문숫자만 가능하게 (onkeyup이벤트에서 호출)
      * @param {Object} objId : 체크 대상 element id
      * @param {Object} chkCase = 1 : 숫자만 입력
      *                           2 : 영문만 입력
      *                           3 : 영숫자만 입력
      *                           4 : 계좌번호 입력
      *                           5 : 이메일 입력
      */
     formInputControl : function(objId, chkCase){
       var tempObj = $("#"+objId);
       var regVal  = null;
       if (tempObj.prop("readonly")) return false;
       switch(chkCase){
         case 1:
           regVal = /[^0-9]/g;
         break;
         case 2:
           regVal = /[^a-zA-Z]/g;
         break;
         case 3:
           regVal = /[^a-zA-Z0-9]/g;
         break;
         case 4:
           regVal = /[^-0-9]/g;
         break;
         case 5:
           regVal = /[\ \!\@\#\$\%\^\&\*\(\)\+\=\|\\\~\[\]\{\}\:\;\"\'\<\>\/\?\`]/g;
         break;
         default:
           regVal = /[^a-zA-Z0-9]/g;
       }
       var idVal = tempObj.val();
       tempObj.val(idVal.replace(regVal,""));
     },
     
     /**
      * caq.util.onMoveNext(objId, nextObjId, maxLength) : maxLength인 경우 nextObjId로 focus 이동 (ex)onMoveNext('id', 'pwd', 8)
      * @param {Object} objId     : 입력 maxLength 조사할 element
      * @param {Object} nextObjId : maxLength 시 이동할 element
      * @param {Object} maxLength : maxLength 값
      */
     onMoveNext : function(objId, nextObjId, maxLength){
       if ($("#"+objId).val().length >= maxLength)
         $("#"+nextObjId).focus();
     },

     /**
      * caq.util.isNumStr(value) : 숫자로 구성된 문자열 체크
      * @param  {Object} value : 검증 문자열
      * @return {boolean}
      */
     isNumStr : function (value){
       var ii;
       var str = null;
       str = new String(value);
       if(str == null || str.length == 0) return false;
       for(ii = 0; ii < str.length; ii++){
         if(!caq.util.isInt(str.charAt(ii)))
         return false;
       }
       return true;
     },

     /**
      * caq.util.isInt(value) : 한 글자가 숫자인지 체크
      * @param  {Object} value : 검증 문자열
      * @return {boolean}
      */
     isInt : function(value){
       var j;
       var _intValue = "0123456789";
       for(j=0;j<_intValue.length;j++){
         if(value == _intValue.charAt(j)) return true;
       }
       return false;
     },

     /**
      * caq.util.isDate(yyyymmdd) : 날짜 유효성 체크(병합된 yyyymmdd 값)
      * @param  {Object} yyyymmdd : 검증 문자열
      * @return {boolean}
      */
     isDate : function(yyyymmdd){
       var isTrue = false;
       if (caq.util.isNumStr(yyyymmdd)) {
         var yyyy = eval(yyyymmdd.substring(0,4));
         var mm = eval(yyyymmdd.substring(4,6));
         var dd = eval(yyyymmdd.substring(6,8));
         if (caq.util.isYearMonthDay(yyyy,mm-1,dd))isTrue = true;
       } else if (yyyymmdd == "") {
         isTrue = false;
       }
       return isTrue;
     },

     /**
      * caq.util.isYearMonthDay(yyyy, mm, dd) : 날짜 유효성 체크(분리된 yyyy, mm, dd 값)
      * @param  {Object} yyyy : 검증 문자열
      * @param  {Object} mm   : 검증 문자열
      * @param  {Object} dd   : 검증 문자열
      * @return {boolean}
      */
     isYearMonthDay : function (yyyy, mm, dd){
       var isTrue = false;
       var iMaxDay = caq.util.getLastDayOfMonth(yyyy, mm);
       if ( yyyy == "" && mm == "" && dd == "" ) {
         isTrue = true;
       } else {
         if ( (yyyy >= 1901) && (yyyy <= 9999) && (mm >= 0) && (mm <= 11) && (dd >= 1) && (dd <= iMaxDay) )
           isTrue = true;
       }
       return isTrue;
     },

     /**
      * caq.util.getLastDayOfMonth(year, month) : 해당 년월의 마지막일 계산
      * @param {Object} year   : 연
      * @param {Object} month  : 월
      */
     getLastDayOfMonth : function(year, month) {
       var tempDay = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
       if(((year %4 ==0) && (year%100!=0)) ||(year%400 ==0)) tempDay[1] = 29;
       else tempDay[1] = 28;
       return tempDay[month];
     },
     /**
      * caq.util.paramsToInput(paramStr) : Get형태의 문자열을 input 태그로 변환
      * @param {Object} paramStr : Get형태의 파라미터 문자열 (예:&test1=테스트1&test2=테스트2)
      */
     paramsToInput : function (paramStr){
       var params     = paramStr.split("&");
       var returnHtml = "";
       $(params).each(function(i) {
         var param = $(params).get(i).split("=");
         var key   = $(param).get(0);
         var val   = $(param).get(1);
         if(!(key===undefined || val===undefined)){
           returnHtml += '<input type="hidden" name="'+key+'" id="'+key+'" value="'+val+'"/>\n';
         }
       });
       return returnHtml;
     },
     /**
      * caq.util.onDateInputChanged_m(obj,lang) : 날짜 형식 검증 (모바일용)
      * @param {Object} obj   : 객체
      * @param {Object} lang  : 언어
      */
     onDateInputChanged_m : function(obj,lang){
       var strTemp = "";
       var strVal  = $(obj).val();
       $(obj).val(strVal.replace(/[^0-9]/g,""));
       if(strVal.length < 8) {
         strTemp = strVal;
         return;
       }
       if(strVal.length > 8) {
         if(0 == strTemp.length){
           strTemp = strVal.substring(0,8);
         }
         $(obj).val(strTemp);
         return;
       }
       if(false == caq.util.isDate(strVal)){
         alert(msg.getMsg(lang,"MSG00001"));
         $(obj).val(strTemp);
         strTemp="";
       }
     },

     /**
      * caq.util.nativeVersionChk(nowVersion, newVersion) : native version check : ISO - I4.0.0, Android - G4.0.0
      * @param {String} nowVersion  : 현재버전
      * @param {String} newVersion  : 최신버전
      * @return {boolean} updateYN : 업데이트 여부
      */
     nativeVersionChk : function(nowVersion, newVersion){
         try{
             var updateYn = false;
             
             var now_version = nowVersion.split('.');
             var new_version = newVersion.split('.');
             
             var now_version1 = 0;
             var now_version2 = 0;
             var now_version3 = 0;
             
             var new_version1 = 0;
             var new_version2 = 0;
             var new_version3 = 0;
             
             if(now_version.length == 3){
                 now_version1 = (now_version[0].length == 2) ? now_version[0].substring(1) : now_version[0];
                 now_version2 = now_version[1];
                 now_version3 = now_version[2];
             }else{
                 return updateYn;
             }
             
             if(new_version.length == 3){
                 new_version1 = (new_version[0].length >= 2) ? new_version[0].substring(1) : new_version[0];
                 new_version2 = new_version[1];
                 new_version3 = new_version[2];
             }else{
                 return updateYn;
             }
             
             if(Number(now_version1) < Number(new_version1)){
                 updateYn = true;
             }else if(Number(now_version1) == Number(new_version1)){
                 if(Number(now_version2) < Number(new_version2)){
                     updateYn = true;
                 }else if(Number(now_version2) == Number(new_version2)){
                     if(Number(now_version3) < Number(new_version3)){
                         updateYn = true;
                     }
                 }
             }
             
             return updateYn;
         }catch(e){
             return false;
         }
     },

     getTimeStampFromDate : function( dt ){
         var year = dt.getFullYear().toString();
         
         var month = dt.getMonth() + 1;
         month = month < 10 ? '0' + month.toString() : month.toString();
         
         var date = dt.getDate();
         date = date < 10 ? '0' + date.toString() : date.toString();
         
         var hour = dt.getHours();
         hour = hour < 10 ? '0' + hour.toString() : hour.toString();
         
         var minites = dt.getMinutes();
         minites = minites < 10 ? '0' + minites.toString() : minites.toString();
         
         var seconds = dt.getSeconds();
         seconds = seconds < 10 ? '0' + seconds.toString() : seconds.toString();
         
         return year + month + date + hour + minites + seconds;
     }

 };
}();

//-----------------------------------------------------------------------------------------------------------------------
// * 공통 JSP태그 자바스크립트
//-----------------------------------------------------------------------------------------------------------------------

caq.tag = function(){
	var idCal_m, idDate_m, valY_m, valM_m, valD_m;
	var bzoprList = [];

	return{
		/**
		 * caq.tag.onRegiAcnt(casei) : 입금지정계좌번호 등록 (모바일용)
		 * @param {Object} casei : 뱅킹코드
		 */
		onRegiAcnt_m : function(casei) {
			if (casei == "01") {
				caq.util.localtionFormSubmit('locationFrm', 'C020220', '');
			} else if (casei == "02") {
				caq.util.localtionFormSubmit('locationFrm', 'C017217', '');
			}
		},
		/**
		 * caq.tag.onFaccRegiAcnt(casei) : 자주쓰는입금계좌 등록 (모바일용)
		 * @param {Object} casei : 뱅킹코드
		 */
		onFaccRegiAcnt_m : function(casei) {
			if (casei == "01") {
				caq.util.localtionFormSubmit_m('locationFrm', 'D001605', '');
				} else if (casei == "02") {
					caq.util.localtionFormSubmit('locationFrm', 'C017217', '');
				}
		},

		/**
		 * caq.tag.inputCalendarShow_m(lang, idCal, idYear, idMonth, idDate) : input 달력 보이기 (모바일용)
		 * @param {Object} lang    : 언어
		 * @param {Object} idCal   : 달력 DIV ID
		 * @param {Object} idYear  : 년 ID
		 * @param {Object} idMonth : 월 ID
		 * @param {Object} idDate  : 일 ID
		 */
		inputCalendarShow_m : function(lang, idCal, idDate, dateVal, callback, flag){
			var tempHtml = '<div id="'+idCal+'" style="display:none;"></div>';
			$("#cal_wrap").html(tempHtml);
			var strDate  = dateVal;
			var year     = "";
			var month    = "";
			var date     = "";
			if(caq.util.isDate(strDate)){
				if(strDate.length == 8) {
					year  = strDate.substring(0,4);
					month = strDate.substring(4,6);
					date  = strDate.substring(6);
				} else {
					year  = strDate.substring(0,4);
					month = strDate.substring(5,7);
					date  = strDate.substring(8);
				}
			}else{
				var today = new Date();
				year  = today.getFullYear();
				month = today.getMonth()+1;
				date  = today.getDate();
			}
			month = Number(month);
			caq.tag.makeInputCalendar_m(lang, idCal, idDate, year, month, date, dateVal, callback, flag);
			$('#' + idCal).show();
		},
      
		/**
	 	 * caq.tag.inputCalendarShow_mN(lang, idCal, idYear, idMonth, idDate) : input 달력 보이기 (모바일용) (스타뱅킹 5.1 디자인)
	 	 * @param {Object} lang    : 언어
	 	 * @param {Object} idCal   : 달력 DIV ID
	 	 * @param {Object} idYear  : 년 ID
	 	 * @param {Object} idMonth : 월 ID
	 	 * @param {Object} idDate  : 일 ID
	 	 */
		inputCalendarShow_mN : function(lang, idCal, idDate, dateVal, callback, flag){
			var txtConfirm = "확인";
			var txtCancle = "취소";

			if('KOR'==lang){
				txtConfirm = "확인";
				txtCancle = "취소";
			}else{
				txtConfirm = "Confirm";
				txtCancle = "Cancel";
			}

			var tempHtml = '';
			tempHtml += "<!-- content -->";
			tempHtml += "<div id='content'> <!-- 2018-08-28 영역 마크업 추가 -->";
			tempHtml += "<section>";
			tempHtml += "<!-- calendar -->";
			tempHtml += "<div id='" + idCal + "' style='display:none;height:100%;'></div>";
			tempHtml += "<!-- //calendar -->";
			tempHtml += "</section>";

			tempHtml += "<!-- btn -->";
			tempHtml += "<div class='btns_area fill floating'>"; // 스타뱅킹5.1 디자인 버튼 수정
			tempHtml += "  <div class='inner'> <!-- 2018-08-28 태그 추가 -->";
			tempHtml += "    <div><button type='button' class='btn_ty_solid03 big' onclick=\"window.appManager.closePopupWebView('');\">"+txtCancle+"</button></div>";
			tempHtml += "    <div><button type='button' class='btn_ty_solid01 big' onclick=\"caq.tag.setInputYMD_m('"+callback+"');\">"+txtConfirm+"</button></div>";
			tempHtml += "  </div>";
			tempHtml += "</div>";
			tempHtml += "<!-- btn -->";

			tempHtml += "</div>";
			tempHtml += "<!-- //content -->";

			$("#cal_wrap").html(tempHtml);
			var strDate  = dateVal;
			var year     = "";
			var month    = "";
			var date     = "";

			if(caq.util.isDate(strDate)){
				if(strDate.length == 8) {
					year  = strDate.substring(0,4);
					month = strDate.substring(4,6);
					date  = strDate.substring(6);
				} else {
					year  = strDate.substring(0,4);
					month = strDate.substring(5,7);
					date  = strDate.substring(8);
				}
			}else{
				var today = new Date();
				year  = today.getFullYear();
				month = today.getMonth()+1;
				date  = today.getDate();
			}
			month = Number(month);
			caq.tag.makeInputCalendar_mN(lang, idCal, idDate, year, month, date, dateVal, callback, flag);
			$('#' + idCal).show();
			//fn_focusMove($("#span_monthDp"));
		},
      
      /**
       * caq.tag.inputBzoprCalendarShow_m(lang, idCal, idYear, idMonth, idDate) : input 달력 보이기 (모바일용)
       * @param {Object} lang    : 언어
       * @param {Object} idCal   : 달력 DIV ID
       * @param {Object} idYear  : 년 ID
       * @param {Object} idMonth : 월 ID
       * @param {Object} idDate  : 일 ID
       */
      inputBzoprCalendarShow_m : function(lang, idCal, idDate, dateVal, callback, flag, bzoprList, bzoprDay1){
        var tempHtml = '<div id="'+idCal+'"></div>';
        $("#cal_wrap").html(tempHtml);
        var strDate  = dateVal;
        var year     = "";
        var month    = "";
        var date     = "";
        if(!!strDate){
            year  = strDate.substring(0,4);
            month = strDate.substring(5,7);
            date  = strDate.substring(8);
        }else{
            var today = new Date();
            year  = today.getFullYear();
            month = today.getMonth()+1;
            date  = today.getDate();
        }
        month = Number(month);
        //caq.tag.makeBzoprList_m(lang, idCal, idDate, year, month, date, dateVal, callback, flag);
        caq.tag.makeInputBzoprCalendar_m(lang,idCal,idDate,year,month,date,dateVal,callback,flag,bzoprList,bzoprDay1);
      },
      
      /**
       * caq.tag.inputBzoprCalendarShow_mFex(lang, idCal, idDate, dateVal, callback, flag, bzoprList, bzoprDay1, strExCd) : input 달력 보이기 (모바일용)
       * @param {Object} lang    	: 언어
       * @param {Object} idCal   	: 달력 DIV ID
       * @param {Object} idYear  	: 년 ID
       * @param {Object} idMonth 	: 월 ID
       * @param {Object} idDate  	: 일 ID
       * @param {Object} dateVal 	: 선택일 ex)2019.09.24
       * @param {Object} callbank	: 콜백
       * @param {Object} flag	 	: 초기값 세팅여부
       * @param {Object} bzoprList	: 영업일 리스트
       * @param {Object} bzoprDay1	: 당일 값 ex)20190924
       * @param {Object} strExCd	: 1:기본통화 2:기타통화 3:배달하기
       */
      inputBzoprCalendarShow_mFex : function(lang, idCal, idDate, dateVal, callback, flag, bzoprList, bzoprDay1, strExCd){
    	var tempHtml = '<div id="'+idCal+'"></div>';
    	$("#cal_wrap").html(tempHtml);
        var strDate  = dateVal;
        var year     = "";
        var month    = "";
        var date     = "";
        if(!!strDate){
            year  = strDate.substring(0,4);
            month = strDate.substring(5,7);
            date  = strDate.substring(8);
        }else{
            var today = new Date();
            year  = today.getFullYear();
            month = today.getMonth()+1;
            date  = today.getDate();
        }
        month = Number(month);
        //caq.tag.makeBzoprList_m(lang, idCal, idDate, year, month, date, dateVal, callback, flag);
        caq.tag.makeInputBzoprCalendar_mFex(lang,idCal,idDate,year,month,date,dateVal,callback,flag,bzoprList,bzoprDay1, strExCd);
      },

      /**
       * caq.tag.makeBzoprList_m(lang, idCal, idDate, year, month, date, dateVal, callback, flag) : input 영업일리스트 구하기 (모바일용)
       * @param {Object} lang    : 언어
       * @param {Object} idCal   : 달력 DIV ID
       * @param {Object} idYear  : 년 ID
       * @param {Object} idMonth : 월 ID
       * @param {Object} idDate  : 일 ID
       */
      makeBzoprList_m : function(lang, idCal, idDate, year, month, date, dateVal, callback, bzoprDay, flag){
          if(month == 13) {
              year = year+1;
              month = 1;
          }
          
          if(month == '00') {
              year = year-1;
              month = 12;
          }
          
          var fixMonth = month < 10 ? '0' + month : month;
          var fixDate = date < 10 ? '0' + date : date;
          var fixDay = ''+year+fixMonth+'31';
          if(fixDay < bzoprDay) {
              alert('당일 이후 가능 날짜를 선택해주세요.');
              return;
          }
          // 해당월 유효성 체크
          var today1    = new Date( year , month-1 , date );
          var month1    = (today1.getMonth()+1) < 10 ? '0' + (today1.getMonth()+1) : (today1.getMonth()+1);
          var day1    = today1.getDate() < 10 ? '0' + today1.getDate() : today1.getDate();
          if(fixMonth != month1) {
        	  fixMonth = month1;
        	  dateVal = dateVal.substring(0,4) + '.' + month1 + '.' + day1;
          }
          
          var inputParam = {};
          inputParam.inquiryDate = ''+year+fixMonth+fixDate;
          inputParam.lang = lang;
          inputParam.idCal = idCal;
          inputParam.idDate = idDate;
          inputParam.year = year;
          inputParam.month = month;
          inputParam.date = date;
          inputParam.dateVal = dateVal;
          inputParam.callback = callback;
          inputParam.flag = flag;
          kbstar.connect.request('/mquics?QAction=1034148&page=D002695', inputParam, caq.tag.bzoprListSuccessCallback, caq.tag.bzoprListFailCallback, true);
      },
      
      /**
       * caq.tag.makeBzoprList_m2(lang, idCal, idDate, year, month, date, dateVal, callback, flag) : input 영업일리스트 구하기 (모바일환전용)
       * @param {Object} lang    : 언어
       * @param {Object} idCal   : 달력 DIV ID
       * @param {Object} idYear  : 년 ID
       * @param {Object} idMonth : 월 ID
       * @param {Object} idDate  : 일 ID
       */
      makeBzoprList_m2 : function(lang, idCal, idDate, year, month, date, dateVal, callback, bzoprDay, flag){
          if(month == 13) {
              year = year+1;
              month = 1;
          }
          
          if(month == '00') {
              year = year-1;
              month = 12;
          }
          
          var fixMonth = month < 10 ? '0' + month : month;
          var fixDate = date < 10 ? '0' + date : date;
          var fixDay = ''+year+fixMonth+'31';
          if(fixDay < bzoprDay) {
              alert('당일 이후 가능 날짜를 선택해주세요.');
              return;
          }
          // 해당월 유효성 체크
          var today1    = new Date( year , month-1 , date );
          var month1    = (today1.getMonth()+1) < 10 ? '0' + (today1.getMonth()+1) : (today1.getMonth()+1);
          var day1    = today1.getDate() < 10 ? '0' + today1.getDate() : today1.getDate();
          if(fixMonth != month1) {
        	  var month2 = month1-1 < 10 ? '0' + (month1-1) : (month1-1)
        	  fixMonth = month2;
        	  fixDate = day1;
        	  date = day1;
        	  dateVal = dateVal.substring(0,4) + '.' + month2 + '.' + day1;
          }
          var inputParam = {};
          inputParam.inquiryDate = ''+year+fixMonth+fixDate;
          inputParam.lang = lang;
          inputParam.idCal = idCal;
          inputParam.idDate = idDate;
          inputParam.year = year;
          inputParam.month = month;
          inputParam.date = date;
          inputParam.dateVal = dateVal;
          inputParam.callback = callback;
          inputParam.flag = flag;
          kbstar.connect.request('/mquics?QAction=1034148&page=D002695', inputParam, caq.tag.bzoprListSuccessCallback, caq.tag.bzoprListFailCallback, true);
      },
      
      /**
       * caq.tag.makeBzoprList_mFex(lang, idCal, idDate, year, month, date, dateVal, callback, flag) : input 영업일리스트 구하기 (모바일환전용)
       * @param {Object} lang    	: 언어
       * @param {Object} idCal   	: 달력 DIV ID
       * @param {Object} idYear  	: 년 ID
       * @param {Object} idMonth 	: 월 ID
       * @param {Object} idDate  	: 일 ID
       * @param {Object} dateVal 	: 선택일 ex)2019.09.24
       * @param {Object} callbank	: 콜백
       * @param {Object} flag	 	: 초기값 세팅여부
       * @param {Object} bzoprList	: 영업일 리스트
       * @param {Object} bzoprDay1	: 당일 값 ex)20190924
       * @param {Object} strExCd	: 1:기본통화, 2:기타통화, 3:배달하기
       */
      makeBzoprList_mFex : function(lang, idCal, idDate, year, month, date, dateVal, callback, bzoprDay, flag, strExCd){
          if(month == 13) {
              year = year+1;
              month = 1;
          }
          
          if(month == '00') {
              year = year-1;
              month = 12;
          }
          
          var fixMonth = month < 10 ? '0' + month : month;
          var fixDate = date < 10 ? '0' + date : date;
          var fixDay = ''+year+fixMonth+'31';
          if(fixDay < bzoprDay) {
              alert('당일 이후 가능 날짜를 선택해주세요.');
              return;
          }
          
          var lastDate = new Date(year, month, "");
          var lastDateTemp = lastDate.getDate();
          if(date > lastDateTemp) {
        	  date = lastDateTemp;
          }
          // 해당월 유효성 체크
          var today1    = new Date( year , month-1 , date );
          var month1    = (today1.getMonth()+1) < 10 ? '0' + (today1.getMonth()+1) : (today1.getMonth()+1);
          var day1    = today1.getDate() < 10 ? '0' + today1.getDate() : today1.getDate();
          if(fixMonth != month1) {
        	  fixMonth = month1;
        	  dateVal = dateVal.substring(0,4) + '.' + month1 + '.' + day1;
          }
          
          var inputParam = {};
          inputParam.inquiryDate = ''+year+fixMonth+fixDate;
          inputParam.lang = lang;
          inputParam.idCal = idCal;
          inputParam.idDate = idDate;
          inputParam.year = year;
          inputParam.month = month;
          inputParam.date = date;
          inputParam.dateVal = dateVal;
          inputParam.callback = callback;
          inputParam.flag = flag;
          inputParam.strExCd = strExCd;
          kbstar.connect.request('/mquics?QAction=1034149&page=D002696', inputParam, caq.tag.bzoprListSuccessCallbackFex, caq.tag.bzoprListFailCallbackFex, true);
      },
      
      /**
       * caq.tag.makeBzoprList_m2Fex(lang, idCal, idDate, year, month, date, dateVal, callback, flag, strExCd) : input 영업일리스트 구하기 (모바일용)
        * @param {Object} lang    	: 언어
       * @param {Object} idCal   	: 달력 DIV ID
       * @param {Object} idYear  	: 년 ID
       * @param {Object} idMonth 	: 월 ID
       * @param {Object} idDate  	: 일 ID
       * @param {Object} dateVal 	: 선택일 ex)2019.09.24
       * @param {Object} callbank	: 콜백
       * @param {Object} flag	 	: 초기값 세팅여부
       * @param {Object} bzoprList	: 영업일 리스트
       * @param {Object} bzoprDay1	: 당일 값 ex)20190924
       * @param {Object} strExCd	: 1:기준통화, 2:기타통화, 3:배달하기
       */
      makeBzoprList_m2Fex : function(lang, idCal, idDate, year, month, date, dateVal, callback, bzoprDay, flag, strExCd){
          if(month == 13) {
              year = year+1;
              month = 1;
          }
          
          if(month == '00') {
              year = year-1;
              month = 12;
          }
          
          var fixMonth = month < 10 ? '0' + month : month;
          var fixDate = date < 10 ? '0' + date : date;
          var fixDay = ''+year+fixMonth+'31';
          if(fixDay < bzoprDay) {
              alert('당일 이후 가능 날짜를 선택해주세요.');
              return;
          }
          // 해당월 유효성 체크
          var today1    = new Date( year , month-1 , date );
          var month1    = (today1.getMonth()+1) < 10 ? '0' + (today1.getMonth()+1) : (today1.getMonth()+1);
          var day1    = today1.getDate() < 10 ? '0' + today1.getDate() : today1.getDate();
          if(fixMonth != month1) {
        	  var month2 = month1-1 < 10 ? '0' + (month1-1) : (month1-1)
        	  fixMonth = month2;
        	  fixDate = day1;
        	  date = day1;
        	  dateVal = dateVal.substring(0,4) + '.' + month2 + '.' + day1;
          }
          var inputParam = {};
          inputParam.inquiryDate = ''+year+fixMonth+fixDate;
          inputParam.lang = lang;
          inputParam.idCal = idCal;
          inputParam.idDate = idDate;
          inputParam.year = year;
          inputParam.month = month;
          inputParam.date = date;
          inputParam.dateVal = dateVal;
          inputParam.callback = callback;
          inputParam.flag = flag;
          inputParam.strExCd = strExCd;
          kbstar.connect.request('/mquics?QAction=1034149&page=D002696', inputParam, caq.tag.bzoprListSuccessCallbackFex, caq.tag.bzoprListFailCallbackFex, true);
      },
      
      /**
       * caq.tag.bzoprListSuccessCallback(data) : 영업일 outputList (모바일용)
       */
      bzoprListSuccessCallback : function(data) {
          bzoprList = data.data.msg.servicedata.ARRAY수;
          var bzoprDay1 = data.data.msg.servicedata.bzoprDay;
          caq.tag.makeInputBzoprCalendar_m(data.data.msg.servicedata.lang, 
                                          data.data.msg.servicedata.idCal, 
                                          data.data.msg.servicedata.idDate, 
                                          data.data.msg.servicedata.year, 
                                          data.data.msg.servicedata.month, 
                                          data.data.msg.servicedata.date, 
                                          data.data.msg.servicedata.dateVal, 
                                          data.data.msg.servicedata.callback, 
                                          data.data.msg.servicedata.flag, 
                                          bzoprList,
                                          bzoprDay1);
      },
      
      /**
       * caq.tag.bzoprListFailCallback(data) : 영업일 outputList (모바일용)
       */
      bzoprListFailCallback : function(data) {
          //console.log('error data :::', data);
      },
      
      /**
       * caq.tag.bzoprListSuccessCallbackFex(data) : 영업일 outputList (모바일환전용)
       */
      bzoprListSuccessCallbackFex : function(data) {
          bzoprList = data.data.msg.servicedata.ARRAY수;
          var bzoprDay1 = data.data.msg.servicedata.bzoprDay;
          caq.tag.makeInputBzoprCalendar_mFex(data.data.msg.servicedata.lang, 
                                          data.data.msg.servicedata.idCal, 
                                          data.data.msg.servicedata.idDate, 
                                          data.data.msg.servicedata.year, 
                                          data.data.msg.servicedata.month, 
                                          data.data.msg.servicedata.date, 
                                          data.data.msg.servicedata.dateVal, 
                                          data.data.msg.servicedata.callback, 
                                          data.data.msg.servicedata.flag, 
                                          bzoprList,
                                          bzoprDay1,
                                          data.data.msg.servicedata.strExCd
                                          );
      },
      
      /**
       * caq.tag.bzoprListFailCallbackFex(data) : 영업일 outputList (모바일환전용)
       */
      bzoprListFailCallbackFex : function(data) {
          //console.log('error data :::', data);
      },
      
      /**
       * caq.tag.inputCalendarHide_m(idCal) : input 달력 숨기기 (모바일용)
       * @param {Object} idCal   : 달력 DIV ID
       */
      inputCalendarHide_m : function(idCal){
        caq.mobile.popupLayerHide(idCal);
        $("#"+idCal).remove();
      },

      /**
       * caq.tag.inputCalendarShow_mbank(lang, idCal, idDate, dataVal, callback, flag) : 달력 팝업 오픈 (스타뱅킹3.0)
       * @param {Object} lang     : 언어
       * @param {Object} idCal    : 달력 DIV ID
       * @param {Object} idDate   : 날짜 ID
       * @param {Object} dateVal  : 초기 날짜값
       * @param {Object} callback : callback 함수
       * @param {Object} flag     : flag
       */
      inputCalendarShow_mbank : function(lang, idCal, idDate, dateVal, callback, flag, btnYn) {
          var paramJSON = '{'
                + '"LANG":"'        + lang      + '"'
                + ',"PID":"'        + idCal     + '"'
                + ',"TID":"'        + idDate    + '"'
                + ',"DATE_VAL":"'   + dateVal   + '"'
                + ',"CALLBACK":"'   + callback  + '"'
                + ',"FLAG":"'       + flag      + '"'
                + ',"BTN_YN":"'     + btnYn     + '"'
                + '}'
                ;
          if(lang == "ENG"){
              window.appManager.openWebViewWithPopup('/mquics?page=D002267', paramJSON, caq.tag.inputCalendarSet_mbank);
          }else{
              window.appManager.openWebViewWithPopup('/mquics?page=D002228', paramJSON, caq.tag.inputCalendarSet_mbank);
          }
      },

      /**
       * caq.tag.inputCalendarShow_mbankN(lang, idCal, idDate, dataVal, callback, flag) : 달력 팝업 오픈 (스타뱅킹5.1)
       * @param {Object} lang     : 언어
       * @param {Object} idCal    : 달력 DIV ID
       * @param {Object} idDate   : 날짜 ID
       * @param {Object} dateVal  : 초기 날짜값
       * @param {Object} callback : callback 함수
       * @param {Object} flag     : flag
       * @param {Object} btnYn    : 버튼적용여부
       */
      inputCalendarShow_mbankN : function(lang, idCal, idDate, dateVal, callback, flag, btnYn) {
          var paramJSON = '{'
                + '"LANG":"'        + lang      + '"'
                + ',"PID":"'        + idCal     + '"'
                + ',"TID":"'        + idDate    + '"'
                + ',"DATE_VAL":"'   + dateVal   + '"'
                + ',"CALLBACK":"'   + callback  + '"'
                + ',"FLAG":"'       + flag      + '"'
                + ',"BTN_YN":"'     + btnYn     + '"'
                + '}'
                ;
          if(lang == "ENG"){
              window.appManager.openWebViewWithPopup('/mquics?page=D002267', paramJSON, caq.tag.inputCalendarSet_mbank);
          }else{
              window.appManager.openWebViewWithPopup('/mquics?page=D002228', paramJSON, caq.tag.inputCalendarSet_mbank);
          }
      },

      /**
       * caq.tag.inputCalendarSet_mbank(lang, idCal, idDate) : 선택한 날짜 셋팅 (스타뱅킹3.0)
       * @param {Object} data : 날짜입력 id:날짜값 으로 구성된 JSON string
       */
      inputCalendarSet_mbank : function(data) {
          if(typeof data != 'undefined' && data != null) {
              for(var key in data) {
                  if(data[key] != '') {
                      if(key == 'CALLBACK') {
                          eval(data[key] +"();");
                      } else {
                          $("#" + key).focus();
                          $("#" + key).val(data[key]);
                          $("#" + key).blur();
                          $("#btn_" + key).focus(); //접근성 문제 처리(포커스 원위치)
                      }
                  }
              }
          }
      },
      
      
      /**
       * caq.tag.inputBzoprCalendarShow_mbank(lang, idCal, idDate, dataVal, callback, flag) : 달력 팝업 오픈 (스타뱅킹3.0)
       * @param {Object} lang     : 언어
       * @param {Object} idCal    : 달력 DIV ID
       * @param {Object} idDate   : 날짜 ID
       * @param {Object} dateVal  : 초기 날짜값
       * @param {Object} callback : callback 함수
       * @param {Object} flag     : flag
       */
      inputBzoprCalendarShow_mbank : function(lang, idCal, idDate, dateVal, callback, flag) {
          var paramJSON = '{'
                + '"lang":"'        + lang      + '"'
                + ',"idCal":"'        + idCal     + '"'
                + ',"idDate":"'        + idDate    + '"'
                + ',"dateVal":"'   + dateVal   + '"'
                + ',"inquiryDate":"'   + dateVal.replace(/\./gi, '')   + '"'
                + ',"callback":"'   + callback  + '"'
                + ',"flag":"'       + flag      + '"'
                + '}'
                ;
          window.appManager.openWebViewWithPopup('/mquics?page=D002695', paramJSON, caq.tag.inputBzoprCalendarSet_mbank);
      },
      /**
       * caq.tag.inputBzoprCalendarShow_mbankN(lang, idCal, idDate, dataVal, callback, flag) : 달력 팝업 오픈 (스타뱅킹3.0)
       * @param {Object} lang     : 언어
       * @param {Object} idCal    : 달력 DIV ID
       * @param {Object} idDate   : 날짜 ID
       * @param {Object} dateVal  : 초기 날짜값
       * @param {Object} callback : callback 함수
       * @param {Object} flag     : flag
       */
      inputBzoprCalendarShow_mbankN : function(lang, idCal, idDate, dateVal, callback, flag) {
          var paramJSON = '{'
                + '"lang":"'        + lang      + '"'
                + ',"idCal":"'        + idCal     + '"'
                + ',"idDate":"'        + idDate    + '"'
                + ',"dateVal":"'   + dateVal   + '"'
                + ',"inquiryDate":"'   + dateVal.replace(/\./gi, '')   + '"'
                + ',"callback":"'   + callback  + '"'
                + ',"flag":"'       + flag      + '"'
                + '}'
                ;
          window.appManager.openWebViewWithPopup('/mquics?page=D002695', paramJSON, caq.tag.inputBzoprCalendarSet_mbank);
      },
      
      /**
       * caq.tag.inputBzoprCalendarShow_mbankFex(lang, idCal, idDate, dataVal, callback, flag, strExCd) : 달력 팝업 오픈 (스타뱅킹3.0)
       * @param {Object} lang     : 언어
       * @param {Object} idCal    : 달력 DIV ID
       * @param {Object} idDate   : 날짜 ID
       * @param {Object} dateVal  : 초기 날짜값
       * @param {Object} callback : callback 함수
       * @param {Object} flag     : flag
       * @param {Object} strExCd  : 환전구분 1:기준통화, 2:기타통화
       */
      inputBzoprCalendarShow_mbankFex : function(lang, idCal, idDate, dateVal, callback, flag, strExCd) {
          var paramJSON = '{'
                + '"lang":"'        + lang      + '"'
                + ',"idCal":"'        + idCal     + '"'
                + ',"idDate":"'        + idDate    + '"'
                + ',"dateVal":"'   + dateVal   + '"'
                + ',"inquiryDate":"'   + dateVal.replace(/\./gi, '')   + '"'
                + ',"callback":"'   + callback  + '"'
                + ',"flag":"'       + flag      + '"'
                + ',"strExCd":"'       + strExCd      + '"'
                + '}'
                ;
          window.appManager.openWebViewWithPopup('/mquics?page=D002696', paramJSON, caq.tag.inputBzoprCalendarSet_mbank);
      },
      
      /**
       * caq.tag.inputBzoprCalendarSet_mbank(lang, idCal, idDate) : 선택한 날짜 셋팅 (스타뱅킹3.0)
       * @param {Object} data : 날짜입력 id:날짜값 으로 구성된 JSON string
       */
      inputBzoprCalendarSet_mbank : function(data) {
          if(typeof data != 'undefined' && data != null) {
              for(var key in data) {
                  if(data[key] != '') {
                      if(key == 'CALLBACK') {
                          eval(data[key] +"();");
                      } else {
                          $("#" + key).focus();
                          $("#" + key).val(data[key]);
                          $("#" + key).blur();
                          $("#btn_" + key).focus(); //접근성 문제 처리(포커스 원위치)
                      }
                  }
              }
          }
      },

      /**
       * caq.tag.makeInputCalendar_m(lang, idCal, idY, idM, idD, valY, valM, valD, dateVal, callback, flag) : input 달력 생성 (모바일용)
       * @param {Object} lang       : 언어 (KOR,ENG)
       * @param {Object} idCal      : 달력 DIV ID
       * @param {Object} idY        : 년 ID
       * @param {Object} idM        : 월 ID
       * @param {Object} idD        : 일 ID
       * @param {Object} valY       : 년 Value(Number Type)
       * @param {Object} valM       : 월 Value(Number Type)
       * @param {Object} valD       : 일 Value(Number Type)
       * @param {Object} dateVal    : 날짜 초기값
       * @param {Object} callback   : callback 함수명
       * @param {Object} flag       : 초기값 세팅여부
       * 2013.08.30 : 스타뱅킹3.0 디자인 적용
       */
      makeInputCalendar_m : function(lang, idCal, idD, valY, valM, valD, dateVal, callback, flag) {
          idCal_m   = idCal;
          idDate_m  = idD;
          valY_m    = valY;
          valM_m    = valM;
          valD_m    = valD;

          var calendar = $("#"+idCal);
          var valDD    = caq.util.getLastDayOfMonth(valY,valM-1) < valD ? caq.util.getLastDayOfMonth(valY,valM-1) : valD;

          if(valD_m != valDD){
        	  valD_m = valDD;
          }

          if(flag == "true") {
              valY_m    = parseInt(dateVal.substring(0, 4), 10);
              valM_m    = dateVal.substring(5, 7);
              valD_m    = dateVal.substring(8);

              if(valM_m.substring(0,1)=="0") valM_m = valM_m.substring(1);
              if(valD_m.substring(0,1)=="0") valD_m = valD_m.substring(1);            
          }
          var today    = new Date( valY_m , valM_m-1 , valD_m );
          var year     = today.getFullYear();
          var nextyear = year +1;
          var lastyear = year -1;
          var month    = today.getMonth();
          var date     = today.getDate();
          var strMonth = month+1 < 10 ? '0' + (month+1) : (month+1);
          var day;
          if('KOR'==lang){
              day=new Array("일","월","화","수","목","금","토");
              txtYearMonth =  year + "년 "+ strMonth + "월 ";
              txtCaption = "달력";
              txtConfirm = "확인";
              txtCancle = "취소";
          }else{
              day=new Array ("S","M","T","W","T","F","S");
              txtYearMonth =  strMonth + "/"+year;
              txtCaption = "Calendar";
              txtConfirm = "Confirm";
              txtCancle = "Cancel";
          }
          var firstOfMonth = new Date(year,month,1);
          var firstDay     = firstOfMonth.getDay();
          var lastDate     = caq.util.getLastDayOfMonth(year,month);

          try{
              var text  = "";
              
              text += "  <div class='calendar_wrap'>";
              text += "    <div class='cal_month'>";                                     
              text += "			<button type='button' class='btn btn_ico first' onclick=\"caq.tag.makeInputCalendar_m('"+lang+"','"+idCal+"','"+idD+"'," +lastyear+ "," +(Number(strMonth))+ ", " +date+ ",'"+dateVal+"','"+callback+"','false'); return false;\"><span class='hidden'>전년도</span></button>";
              text += "			<button type='button' class='btn btn_ico prev' onclick=\"caq.tag.makeInputCalendar_m('"+lang+"','"+idCal+"','"+idD+"'," +year+ "," +(Number(strMonth)-1)+ ", " +date+ ",'"+dateVal+"','"+callback+"','false'); return false;\"><span class='hidden'>이전달</span></button>";
              text += "			<span class='year_txt'><span class='number'>" + txtYearMonth + "</span></span>";
              text += "			<button type='button' class='btn btn_ico next' onclick=\"caq.tag.makeInputCalendar_m('"+lang+"','"+idCal+"','"+idD+"'," +year+ "," +(Number(strMonth)+1)+ ", " +date+ ",'"+dateVal+"','"+callback+"','false'); return false;\"><span class='hidden'>다음달</span></button>";
              text += "			<button type='button' class='btn btn_ico end' onclick=\"caq.tag.makeInputCalendar_m('"+lang+"','"+idCal+"','"+idD+"'," +nextyear+ "," +(Number(strMonth))+ ", " +date+ ",'"+dateVal+"','"+callback+"','false'); return false;\"><span class='hidden'>다음년도</span></button>";
              text += "    </div>";
              text += "    <table class='cal_tbl' id='"+idCal+"-table'>";
              text += "		<caption>"+txtCaption+"</caption>";
              text += "		<thead>";
              text += "			<tr>";
              text += "				<th scope='col' class='sunday'>"+day[0]+"</th>";
              text += "				<th scope='col'>"+day[1]+"</th>";
              text += "				<th scope='col'>"+day[2]+"</th>";
              text += "				<th scope='col'>"+day[3]+"</th>";
              text += "				<th scope='col'>"+day[4]+"</th>";
              text += "				<th scope='col'>"+day[5]+"</th>";
              text += "				<th scope='col' class='saturday'>"+day[6]+"</th>";
              text += "			</tr>";
              text += "		</thead>";
              text += "		<tbody>";
              text += "			<tr>";
              
              var dayNum    = 1;
              var curCol    = 1;
              var weekcount = 0;
              for (var i=1; i<=Math.ceil((lastDate + firstDay)/7); i++) {
                  text += "        <tr>";
                  for (var j=1; j<=7; j++) {
                      if(j == 1) {
                          text += "          <td class='sunday'>";
                      } else {
                          text += "          <td>";
                      }
                      weekcount = weekcount+1;
                      if(curCol < firstDay + 1 || dayNum > lastDate) {
                          text += "&nbsp;";
                          curCol++;
                      } else {
                          if( dayNum == date ) {
                              text += "<button type='button' class='on' title='선택 됨' onclick=\"caq.tag.selectDay_m(this,'"+idCal+"','"+idD+"',"+year+","+Number(strMonth)+","+dayNum+"); return false;\">" + dayNum + "</button>";
                          } else {
                              switch(j) {
                              default :
                            	  text += "<button type='button' onclick=\"caq.tag.selectDay_m(this,'"+idCal+"','"+idD+"',"+year+","+Number(strMonth)+","+dayNum+");return false;\">"+dayNum+"</button>";
                              }
                          }
                          dayNum++ ;
                      }
                      text += "</td>";
                  }
                  text += "        </tr>";
              }
              text += "      </tbody>";
              text += "    </table>";
              
              text += "<div class='btn_confirm_wrap'>";
              text += "		<div class='btn_area'>";
              text += "			<span><button type='button' class='btn primary lg' onclick=\"caq.tag.setInputYMD_m('"+callback+"');\">"+txtConfirm+"</button></span>";
              text += "			<span><button type='button' class='btn secondary lg' onclick=\"window.appManager.closePopupWebView('');\">"+txtCancle+"</button></span>";
              text += "    	</div>";
              text += "  </div>";
              
              calendar.html(text);
              calendar.css({"height":"100%"});
          }catch(err){}
      },
      
      /**
       * caq.tag.makeInputCalendar_mN(lang, idCal, idY, idM, idD, valY, valM, valD, dateVal, callback, flag) : input 달력 생성 (모바일용)
       * @param {Object} lang       : 언어 (KOR,ENG)
       * @param {Object} idCal      : 달력 DIV ID
       * @param {Object} idY        : 년 ID
       * @param {Object} idM        : 월 ID
       * @param {Object} idD        : 일 ID
       * @param {Object} valY       : 년 Value(Number Type)
       * @param {Object} valM       : 월 Value(Number Type)
       * @param {Object} valD       : 일 Value(Number Type)
       * @param {Object} dateVal    : 날짜 초기값
       * @param {Object} callback   : callback 함수명
       * @param {Object} flag       : 초기값 세팅여부
       * 2013.08.30 : 스타뱅킹3.0 디자인 적용
       * 2018.10.29 : 스타뱅킹5.1 디자인 적용
       */
      makeInputCalendar_mN : function(lang, idCal, idD, valY, valM, valD, dateVal, callback, flag) {
          idCal_m   = idCal;
          idDate_m  = idD;
          valY_m    = valY;
          valM_m    = valM;
          valD_m    = valD;

          var calendar = $("#"+idCal);
          var valDD    = caq.util.getLastDayOfMonth(valY,valM-1) < valD ? caq.util.getLastDayOfMonth(valY,valM-1) : valD;
          if( valD_m != valDD ){
				valD_m = valDD;
			}

          if(flag == "true") {
              valY_m    = parseInt(dateVal.substring(0, 4), 10);
              valM_m    = dateVal.substring(5, 7);
              valD_m    = dateVal.substring(8);

              if(valM_m.substring(0,1)=="0") valM_m = valM_m.substring(1);
              if(valD_m.substring(0,1)=="0") valD_m = valD_m.substring(1);            
          }
          // 자바스크립트가 실행된 기기의 당일자 구하기
          var nowDate = new Date();	
          var nowYear = nowDate.getFullYear();
          var nowMonth = nowDate.getMonth();
          var nowDay   = nowDate.getDate();
          var strNowMonth = nowMonth+1 < 10 ? '0' + (nowMonth+1) : (nowMonth+1);

          var today    = new Date( valY_m , valM_m-1 , valD_m );
          var year     = today.getFullYear();
          var nextyear = year +1;
          var lastyear = year -1;
          var month    = today.getMonth();
          var date     = today.getDate();
          var strMonth = month+1 < 10 ? '0' + (month+1) : (month+1);
          var day;
          var txtToday = "오늘";
          //lang = 'KOR';
          if('KOR'==lang){
              day=new Array("일","월","화","수","목","금","토");
              //txtYearMonth =  year + "년 "+ strMonth + "월 ";
              txtYearMonth =  year + ". "+ strMonth;
              txtCaption = "달력";
              txtConfirm = "확인";
              txtCancle = "취소";
              txtToday = "오늘 날짜";
          }else{
              day=new Array ("S","M","T","W","T","F","S");
              txtYearMonth =  strMonth + "/"+year;
              txtCaption = "Calendar";
              txtConfirm = "Confirm";
              txtCancle = "Cancel";
              txtToday = "Today";
          }
          var firstOfMonth = new Date(year,month,1);
          var firstDay     = firstOfMonth.getDay();
          var lastDate     = caq.util.getLastDayOfMonth(year,month);

          try{
              var text  = "";
              text += "  <div class='calendar_wrap'>";
              text += "    <div class='cal_month'>";                                     
              text += "			<button type='button' class='btn btn_ico first' onclick=\"caq.tag.makeInputCalendar_mN('"+lang+"','"+idCal+"','"+idD+"'," +lastyear+ "," +(Number(strMonth))+ ", " +date+ ",'"+dateVal+"','"+callback+"','false'); return false;\"><span class='hidden'>전년도</span></button>";
              text += "			<button type='button' class='btn btn_ico prev' onclick=\"caq.tag.makeInputCalendar_mN('"+lang+"','"+idCal+"','"+idD+"'," +year+ "," +(Number(strMonth)-1)+ ", " +date+ ",'"+dateVal+"','"+callback+"','false'); return false;\"><span class='hidden'>이전달</span></button>";
              text += "			<span class='year_txt'><span class='number'>" + txtYearMonth + "</span></span>";
              text += "			<button type='button' class='btn btn_ico next'  onclick=\"caq.tag.makeInputCalendar_mN('"+lang+"','"+idCal+"','"+idD+"'," +year+ "," +(Number(strMonth)+1)+ ", " +date+ ",'"+dateVal+"','"+callback+"','false'); return false;\"><span class='hidden'>다음달</span></button>";
              text += "			<button type='button' class='btn btn_ico end' onclick=\"caq.tag.makeInputCalendar_mN('"+lang+"','"+idCal+"','"+idD+"'," +nextyear+ "," +(Number(strMonth))+ ", " +date+ ",'"+dateVal+"','"+callback+"','false'); return false;\"><span class='hidden'>다음년도</span></button>";
              text += "    </div>";
              text += "    <table class='cal_tbl' id='"+idCal+"-table'>";
              text += "		<caption>"+txtCaption+"</caption>";
              text += "		<thead>";
              text += "			<tr>";
              text += "				<th scope='col' class='sunday'>"+day[0]+"</th>";
              text += "				<th scope='col'>"+day[1]+"</th>";
              text += "				<th scope='col'>"+day[2]+"</th>";
              text += "				<th scope='col'>"+day[3]+"</th>";
              text += "				<th scope='col'>"+day[4]+"</th>";
              text += "				<th scope='col'>"+day[5]+"</th>";
              text += "				<th scope='col' class='saturday'>"+day[6]+"</th>";
              text += "			</tr>";
              text += "		</thead>";
              text += "		<tbody>";
              text += "			<tr>";
              
              var dayNum    = 1;
              var curCol    = 1;
              var weekcount = 0;
              for (var i=1; i<=Math.ceil((lastDate + firstDay)/7); i++) {
                  text += "        <tr>";
                  for (var j=1; j<=7; j++) {
                      if(j == 1) {
                          text += "          <td class='sunday'>";
                      } else {
                          text += "          <td>";
                      }
                      weekcount = weekcount+1;
                      if(curCol < firstDay + 1 || dayNum > lastDate) {
                          text += "&nbsp;";
                          curCol++;
                      } else {
                          if( dayNum == date ) {
                              text += "<button type='button' class='on' title='선택 됨' onclick=\"caq.tag.selectDay_mN(this,'"+idCal+"','"+idD+"',"+year+","+Number(strMonth)+","+dayNum+"); return false;\">" + dayNum + "</button>";
                          } else {
                              switch(j) {
                              default :
                            	  text += "<button type='button' onclick=\"caq.tag.selectDay_m(this,'"+idCal+"','"+idD+"',"+year+","+Number(strMonth)+","+dayNum+");return false;\">"+dayNum+"</button>";
                              }
                          }
                          dayNum++ ;
                      }
                      text += "</td>";
                  }
                  text += "        </tr>";
              }
              text += "      </tbody>";
              text += "    </table>";
              
              text += "<div class='btn_confirm_wrap'>";
              text += "		<div class='btn_area'>";
              text += "			<span><button type='button' class='btn secondary lg' onclick=\"window.appManager.closePopupWebView('');\">"+txtCancle+"</button></span>";
              text += "			<span><button type='button' class='btn primary lg' onclick=\"caq.tag.setInputYMD_m('"+callback+"');\">"+txtConfirm+"</button></span>";
              text += "    	</div>";
              text += "  </div>";

              calendar.html(text);
              calendar.css({"height":"100%"});
              
          }catch(err){}
      },
      
      /**
       * caq.tag.makeInputBzoprCalendar_m(lang, idCal, idY, idM, idD, valY, valM, valD, dateVal, callback, flag, bzoprList) : input 달력 생성 (모바일용)
       * @param {Object} lang       : 언어 (KOR,ENG)
       * @param {Object} idCal      : 달력 DIV ID
       * @param {Object} idY        : 년 ID
       * @param {Object} idM        : 월 ID
       * @param {Object} idD        : 일 ID
       * @param {Object} valY       : 년 Value(Number Type)
       * @param {Object} valM       : 월 Value(Number Type)
       * @param {Object} valD       : 일 Value(Number Type)
       * @param {Object} dateVal    : 날짜 초기값
       * @param {Object} callback   : callback 함수명
       * @param {Object} flag       : 초기값 세팅여부
       * @param {Object} bzoprList  : 영업일리스트
       * 2013.08.30 : 스타뱅킹3.0 디자인 적용
       */
      makeInputBzoprCalendar_m : function(lang, idCal, idD, valY, valM, valD, dateVal, callback, flag, bzoprList, bzoprDay1) {
          idCal_m   = idCal;
          idDate_m  = idD;
          valY_m    = valY;
          valM_m    = valM;
          valD_m    = valD;
          var calendar = $("#"+idCal);
          var valDD    = caq.util.getLastDayOfMonth(valY,valM-1) < valD ? caq.util.getLastDayOfMonth(valY,valM-1) : valD;

          if( valD_m != valDD ){
              valD_m = valDD;
          }

          if(flag == "true") {
              valY_m    = parseInt(dateVal.substring(0, 4), 10);
              valM_m    = dateVal.substring(5, 7);
              valD_m    = dateVal.substring(8);

              if(valM_m.substring(0,1)=="0") valM_m = valM_m.substring(1);
              if(valD_m.substring(0,1)=="0") valD_m = valD_m.substring(1);            
          }
          var today    = new Date( valY_m , valM_m-1 , valD_m );
          var year     = today.getFullYear();
          var nextyear = year +1;
          var lastyear = year -1;
          var month    = today.getMonth();
          var date     = today.getDate();
          var strMonth = month+1 < 10 ? '0' + (month+1) : (month+1);
          var day;
          if('KOR'==lang){
              day=new Array("일","월","화","수","목","금","토");
              txtYearMonth =  year + "년 "+ strMonth + "월 ";
              txtCaption = "달력";
              txtConfirm = "확인";
              txtCancle = "취소";
          }else{
              day=new Array ("S","M","T","W","T","F","S");
              txtYearMonth =  strMonth + "/"+year;
              txtCaption = "Calendar";
              txtConfirm = "Confirm";
              txtCancle = "Cancel";
          }
          var firstOfMonth = new Date(year,month,1);
          var firstDay     = firstOfMonth.getDay();
          var lastDate     = caq.util.getLastDayOfMonth(year,month);
          
          try{
              var text  = "";
              text += "  <div class='calendar_wrap'>";
              text += "    <div class='cal_month'>";
              text += "			<button type='button' class='btn btn_ico first' onclick=\"caq.tag.makeBzoprList_m2('"+lang+"','"+idCal+"','"+idD+"'," +lastyear+ "," +(Number(strMonth))+ ", " +date+ ",'"+dateVal+"','"+callback+"', '"+bzoprDay1+ "','false'); return false;\"><span class='hidden'>전년도</span></button>";
              text += "			<button type='button' class='btn btn_ico prev' onclick=\"caq.tag.makeBzoprList_m2('"+lang+"','"+idCal+"','"+idD+"'," +year+ "," +(Number(strMonth)-1)+ ", " +date+ ",'"+dateVal+"','"+callback+"','"+bzoprDay1+ "','false'); return false;\"><span class='hidden'>이전달</span></button>";
              text += "			<span class='year_txt'><span class='number'>" + txtYearMonth + "</span></span>";
              text += "			<button type='button' class='btn btn_ico next'  onclick=\"caq.tag.makeBzoprList_m('"+lang+"','"+idCal+"','"+idD+"'," +year+ "," +(Number(strMonth)+1)+ ", " +date+ ",'"+dateVal+"','"+callback+"','"+bzoprDay1+ "','false'); return false;\"><span class='hidden'>다음달</span></button>";
              text += "			<button type='button' class='btn btn_ico end' onclick=\"caq.tag.makeBzoprList_m('"+lang+"','"+idCal+"','"+idD+"'," +nextyear+ "," +(Number(strMonth))+ ", " +date+ ",'"+dateVal+"','"+callback+"','"+bzoprDay1+ "','false'); return false;\"><span class='hidden'>다음년도</span></button>";
              text += "    </div>";
              text += "    <table class='cal_tbl' id='"+idCal+"-table'>";
              text += "		<caption>"+txtCaption+"</caption>";
              text += "		<thead>";
              text += "			<tr>";
              text += "				<th scope='col' class='sunday'>"+day[0]+"</th>";
              text += "				<th scope='col'>"+day[1]+"</th>";
              text += "				<th scope='col'>"+day[2]+"</th>";
              text += "				<th scope='col'>"+day[3]+"</th>";
              text += "				<th scope='col'>"+day[4]+"</th>";
              text += "				<th scope='col'>"+day[5]+"</th>";
              text += "				<th scope='col' class='saturday'>"+day[6]+"</th>";
              text += "			</tr>";
              text += "		</thead>";
              text += "		<tbody>";
              text += "			<tr>";
              
              var dayNum    = 1;
              var curCol    = 1;
              var weekcount = 0;
              for (var i=1; i<=Math.ceil((lastDate + firstDay)/7); i++) {
                  text += "        <tr>";
                  for (var j=1; j<=7; j++) {
                	  var holyYn = '';
                      var strDayNum = dayNum < 10 ? '0' + dayNum : dayNum;
                      var dDate = '' + year + strMonth + strDayNum;
                      $.each(bzoprList, function(i,v) {
                          if(v.date == dDate) {
                              holyYn = v.holyYn;
                          } 
                      });
                      
                	  
                	  if(j == 1) {
                          text += "          <td class='sunday'>";
                      } else {
                    	  if(holyYn == '7') {
                              text += "          <td class='sunday'>";
                          } else {
                              text += "          <td>";
                          }
                      }
                      weekcount = weekcount+1;
                      if(curCol < firstDay + 1 || dayNum > lastDate) {
                          text += "&nbsp;";
                          curCol++;
                      } else {
                          if( dayNum == date ) {
                        	  if(holyYn == '0' || holyYn == '6' || holyYn == '7') {
                                  text += "<span class=\"disabled\">" + dayNum + "</span>";
                              } else {
                                  if(bzoprDay1 > dDate) {
                                	  text += "<button type='button' class='disabled'>" + dayNum + "</button>";
                                  } else {
                                      text += "<button type='button' class='on' title='선택 됨' onclick=\"caq.tag.selectDay_m(this,'"+idCal+"','"+idD+"',"+year+","+Number(strMonth)+","+dayNum+"); return false;\">" + dayNum + "</button>";
                                  }
                              }
                          
                          } else {
                        	  if(holyYn == '0' || holyYn == '6' || holyYn == '7') {
                        		  text += "<button type='button' class='disabled'>" + dayNum + "</button>";
                              } else {
                                  if(bzoprDay1 > dDate) {
                                	  text += "<button type='button' class='disabled'>" + dayNum + "</button>";
                                  } else {
                                	  text += "<button type='button' onclick=\"caq.tag.selectDay_m(this,'"+idCal+"','"+idD+"',"+year+","+Number(strMonth)+","+dayNum+");return false;\">"+dayNum+"</button>";
                                  }
                              } 
                          }
                          dayNum++ ;
                      }
                      text += "</td>";
                  }
                  text += "        </tr>";
              }
              text += "      </tbody>";
              text += "    </table>";
              
              text += "<div class='btn_confirm_wrap'>";
              text += "		<div class='btn_area'>";
              text += "			<span><button type='button' class='btn secondary lg' onclick=\"window.appManager.closePopupWebView('');\">"+txtCancle+"</button></span>";
              text += "			<span><button type='button' class='btn primary lg' onclick=\"caq.tag.setInputBzoprYMD_m('"+callback+"', '"+ bzoprDay1 +"');\">"+txtConfirm+"</button></span>";
              text += "    	</div>";
              text += "  </div>";

              calendar.html(text);
              calendar.css({"height":"100%"});
          }catch(err){}
      },
      
      /**
       * caq.tag.makeInputBzoprCalendar_mFex(lang, idCal, idY, idM, idD, valY, valM, valD, dateVal, callback, flag, bzoprList, strExCd) : input 달력 생성 (모바일환전용)
       * @param {Object} lang       : 언어 (KOR,ENG)
       * @param {Object} idCal      : 달력 DIV ID
       * @param {Object} idY        : 년 ID
       * @param {Object} idM        : 월 ID
       * @param {Object} idD        : 일 ID
       * @param {Object} valY       : 년 Value(Number Type)
       * @param {Object} valM       : 월 Value(Number Type)
       * @param {Object} valD       : 일 Value(Number Type)
       * @param {Object} dateVal    : 날짜 초기값
       * @param {Object} callback   : callback 함수명
       * @param {Object} flag       : 초기값 세팅여부
       * @param {Object} bzoprList  : 영업일리스트
       * @param {Object} strExCd  	: 1:기본통화, 2:기타통화, 3:배달하기
       * 2013.08.30 : 스타뱅킹3.0 디자인 적용
       */
      makeInputBzoprCalendar_mFex : function(lang, idCal, idD, valY, valM, valD, dateVal, callback, flag, bzoprList, bzoprDay1, strExCd) {
    	  idCal_m   = idCal;
          idDate_m  = idD;
          valY_m    = valY;
          valM_m    = valM;
          valD_m    = valD;
          var calendar = $("#"+idCal);
          var valDD    = caq.util.getLastDayOfMonth(valY,valM-1) < valD ? caq.util.getLastDayOfMonth(valY,valM-1) : valD;
          if( valD_m != valDD ){
				valD_m = valDD;
			}

          if(flag == "true") {
              valY_m    = parseInt(dateVal.substring(0, 4), 10);
              valM_m    = dateVal.substring(5, 7);
              valD_m    = dateVal.substring(8);

              if(valM_m.substring(0,1)=="0") valM_m = valM_m.substring(1);
              if(valD_m.substring(0,1)=="0") valD_m = valD_m.substring(1);            
          }
          var today    = new Date( valY_m , valM_m-1 , valD_m );
          var year     = today.getFullYear();
          var nextyear = year +1;
          var lastyear = year -1;
          var month    = today.getMonth();
          var date     = today.getDate();
          var strMonth = month+1 < 10 ? '0' + (month+1) : (month+1);
          var day;
          if('KOR'==lang){
              day=new Array("일","월","화","수","목","금","토");
              txtYearMonth =  year + "년 "+ strMonth + "월 ";
              txtCaption = "달력";
              txtConfirm = "확인";
              txtCancle = "취소";
          }else{
              day=new Array ("S","M","T","W","T","F","S");
              txtYearMonth =  strMonth + "/"+year;
              txtCaption = "Calendar";
              txtConfirm = "Confirm";
              txtCancle = "Cancel";
          }
          var firstOfMonth = new Date(year,month,1);
          var firstDay     = firstOfMonth.getDay();
          var lastDate     = caq.util.getLastDayOfMonth(year,month);
          
          try{
              var text  = "";
              text += "  <div class='con_sp01 calendar schedule' style='position:relative; left:0px; top:0px;'>";
              text += "    <div class='present_month'>";
              text += "      <a href='javascript:void(0);' class='first' onclick=\"caq.tag.makeBzoprList_m2Fex('"+lang+"','"+idCal+"','"+idD+"'," +lastyear+ "," +(Number(strMonth))+ ", " +date+ ",'"+dateVal+"','"+callback+"', '"+bzoprDay1+ "','false', '"+strExCd+"'); return false;\">전년도</a>";
              text += "      <a href='javascript:void(0);' class='prev' onclick=\"caq.tag.makeBzoprList_m2Fex('"+lang+"','"+idCal+"','"+idD+"'," +year+ "," +(Number(strMonth)-1)+ ", " +date+ ",'"+dateVal+"','"+callback+"','"+bzoprDay1+ "', 'false', '"+strExCd+"'); return false;\">이전달</a>";
              text += "      <span class='pagenum'>";
              text += "        " + txtYearMonth + " ";
              text += "      </span>";
              text += "      <a href='javascript:void(0);' class='next' onclick=\"caq.tag.makeBzoprList_mFex('"+lang+"','"+idCal+"','"+idD+"'," +year+ "," +(Number(strMonth)+1)+ ", " +date+ ",'"+dateVal+"','"+callback+"','"+bzoprDay1+ "', 'false', '"+strExCd+"'); return false;\">다음달</a>";
              text += "      <a href='javascript:void(0);' class='last' onclick=\"caq.tag.makeBzoprList_mFex('"+lang+"','"+idCal+"','"+idD+"'," +nextyear+ "," +(Number(strMonth))+ ", " +date+ ",'"+dateVal+"','"+callback+"','"+bzoprDay1+ "', 'false', '"+strExCd+"'); return false;\">다음년도</a>";
              text += "    </div>";
              text += "    <table id='"+idCal+"-table' class='schedule'>";
              text += "      <caption>"+txtCaption+"</caption>";
              text += "      <colgroup>";
              text += "        <col style='width:14.5%' />";
              text += "        <col style='width:14.5%' />";
              text += "        <col style='width:14.5%' />";
              text += "        <col style='width:14.5%' />";
              text += "        <col style='width:14.5%' />";
              text += "        <col style='width:14.5%' />";
              text += "        <col style='width:14.5%' />";
              text += "      <thead>";
              text += "        <tr>";
              text += "          <th scope='col' class='sunday'>"+day[0]+"</th>";
              text += "          <th scope='col'>"+day[1]+"</th>";
              text += "          <th scope='col'>"+day[2]+"</th>";
              text += "          <th scope='col'>"+day[3]+"</th>";
              text += "          <th scope='col'>"+day[4]+"</th>";
              text += "          <th scope='col'>"+day[5]+"</th>";
              text += "          <th scope='col'>"+day[6]+"</th>";
              text += "        </tr>";
              text += "      </thead>";
              text += "      <tbody>";

              var dayNum    = 1;
              var curCol    = 1;
              var weekcount = 0;
              for (var i=1; i<=Math.ceil((lastDate + firstDay)/7); i++) {
                  text += "        <tr>";
                  for (var j=1; j<=7; j++) {
                      var holyYn = '';
                      var strDayNum = dayNum < 10 ? '0' + dayNum : dayNum;
                      var dDate = '' + year + strMonth + strDayNum;
                      $.each(bzoprList, function(i,v) {
                          if(v.date == dDate) {
                              holyYn = v.holyYn;
                          } 
                      });
                      
                      if(j == 1) {
                          text += "          <td class='sunday'>";
                      } else {
                          if(holyYn == '7') {
                              text += "          <td class='sunday'>";
                          } else {
                              text += "          <td>";
                          }
                      }
                      weekcount = weekcount+1;
                      if(curCol < firstDay + 1 || dayNum > lastDate) {
                          text += "&nbsp;";
                          curCol++;
                      } else {
                          if( dayNum == date ) {
                              if(holyYn == '0' || holyYn == '6' || holyYn == '7') {
                                  text += "<span class=\"disabled\">" + dayNum + "</span>";
                              } else {
                                  if(bzoprDay1 > dDate) {
                                      text += "<span class=\"disabled\">" + dayNum + "</span>";
                                  } else {
                                      text += "<a href='javascript:void(0);' class='active' onclick=\"caq.tag.selectDay_m(this,'"+idCal+"','"+idD+"',"+year+","+Number(strMonth)+","+dayNum+"); return false;\">" + dayNum + "<span id=\"id_title\" class=\"hide\">일 선택</span></a>";
                                  }
                              }
                          } else {
                              if(holyYn == '0' || holyYn == '6' || holyYn == '7') {
                                  text += "<span class=\"disabled\">" + dayNum + "</span>";
                              } else {
                                  if(bzoprDay1 > dDate) {
                                      text += "<span class=\"disabled\">" + dayNum + "</span>";
                                  } else {
                                      text += "<a href='javascript:void(0);' onclick=\"caq.tag.selectDay_m(this,'"+idCal+"','"+idD+"',"+year+","+Number(strMonth)+","+dayNum+");return false;\">"+dayNum+"</a>";
                                  }
                              }
                          }
                          dayNum++ ;
                      }
                      text += "</td>";
                  }
                  text += "        </tr>";
              }
              text += "      </tbody>";
              text += "    </table>";
              text += "    <div class='btn_center'>";
              text += "      <button type='button' class='btn02' onclick=\"caq.tag.setInputBzoprYMD_m('"+callback+"', '"+ bzoprDay1 +"');\">"+txtConfirm+"</button>";
              text += "      <button type='button' class='btn03' onclick=\"window.appManager.closePopupWebView('');\">"+txtCancle+"</button>";
              text += "    </div>";
              text += "  </div>";
              
              if(strExCd != "3") {	// 기준,기타 통화일 때
	              text += "  <div class='txt_caption' style='margin:16px;'>";
	              text += "  <p style='padding-left:8px; font-size:12px; line-height:16px; color:#707070; text-align:justify;'>토,일요일 공휴일/공휴일에는 외화 실물 수령이 불가하오니, 정상은행 영업일 확인 후 지정하세요</p>";
	              text += "  <p style='padding-left:8px; font-size:12px; line-height:16px; color:#707070; text-align:justify;'>USD, JPY, EUR, CNY : 신청거래일자부터 입력가능(최대 1개월 범위 내)</p>";
	              text += "  <p style='padding-left:8px; font-size:12px; line-height:16px; color:#707070; text-align:justify;'>기타통화: 신청거래일+2은행영업일부터 입력가능(최대 1개월 범위 내)</p>";
	              text += "  </div>";              
              } else {
            	  text += "  <div class='txt_caption' style='margin:16px;'>";
            	  text += "  <p style='padding-left:8px; font-size:12px; line-height:16px; color:#707070; text-align:justify;'>배송시간은 지정 불가 합니다.</p>";
            	  text += "  </div>";
              }
              calendar.html(text);
              calendar.css({"height":"100%"});
          }catch(err){}
      },
      
      /**
       * caq.tag.selectDay_m(idCal, idDate, valY, valM, valD) : 달력에서 선택한 년월일을 전역 변수에 저장 (모바일용)
       * @param {Object} idCal  : DOM ID
       * @param {Object} idDate : 일 ID
       * @param {Object} valY   : 년 Value
       * @param {Object} valM   : 월 Value
       * @param {Object} valD   : 일 Value
       */
      selectDay_m : function(obj, idCal, idDate, valY, valM, valD){
        //$("#"+idCal+"-table").find("a").removeClass("active");
    	  $("#"+idCal+"-table").find("button").removeClass("on");
        //$('#id_title').remove();
        //$(obj).addClass("active");
    	  $(obj).addClass("on");
        //$(obj).append("<span id=\"id_title\" class=\"hide\">일 선택</span>");
        idCal_m   = idCal;
        idDate_m  = idDate;
        valY_m    = valY;
        valM_m    = valM;
        valD_m    = valD;
      },

      /**
       * caq.tag.selectDay_mN(idCal, idDate, valY, valM, valD) : 달력에서 선택한 년월일을 전역 변수에 저장 (모바일용)
       * @param {Object} idCal  : DOM ID
       * @param {Object} idDate : 일 ID
       * @param {Object} valY   : 년 Value
       * @param {Object} valM   : 월 Value
       * @param {Object} valD   : 일 Value
       */
      selectDay_mN : function(obj, idCal, idDate, valY, valM, valD){
        //$("#"+idCal+"-table").find("a").removeClass("active");
    	  $("#"+idCal+"-table").find("button").removeClass("on");
        //$('#id_title').remove();
        
        //$(obj).addClass("active");
    	  $(obj).addClass("on");
        //$(obj).append("<span id=\"id_title\">일 선택됨</span>");
        idCal_m   = idCal;
        idDate_m  = idDate;
        valY_m    = valY;
        valM_m    = valM;
        valD_m    = valD;
      },

      /**
       * caq.tag.setInputYMD_m() : 달력에서 선택한 년월일을 input에 set (모바일용)
       * 2013.08.28 스타뱅킹 3.0 : 날짜선택 시 구분자 삽입
       */
      setInputYMD_m : function(callback){
        var delim = ".";
        var idCal  = idCal_m;
        var idDate = idDate_m;
        var valY   = valY_m;
        var valM   = Number(valM_m);
        var valD   = Number(valD_m);
        var month = valM < 10 ? "0" + valM : String(valM);
        var day   = valD < 10 ? "0" + valD : String(valD);
        // 2015.10.29 Android 4.1.2버전인 단말기 만 "확인"버튼 클릭시 동작안하는 현상 (일단 되도록 수정함)
//        $("#"+idDate).val(String(valY) + delim + String(month) + delim + String(day)).change();
//        window.appManager.closePopupWebView('{"' +idDate+ '":"'+$("#"+idDate).val() + '","CALLBACK":"'+callback+'"}');
        document.getElementById(idDate).value = String(valY) + delim + String(month) + delim + String(day);
        window.appManager.closePopupWebView('{"' +idDate+ '":"'+document.getElementById(idDate).value + '","CALLBACK":"'+callback+'"}');
      },
      /**
       * caq.tag.setInputBzoprYMD_m() : 달력에서 선택한 년월일을 input에 set (모바일용)
       * 2013.08.28 스타뱅킹 3.0 : 날짜선택 시 구분자 삽입
       */
      setInputBzoprYMD_m : function(callback, bzoprDay1){
    	  var delim = ".";
          var idCal  = idCal_m;
          var idDate = idDate_m;
          var valY   = valY_m;
          var valM   = Number(valM_m);
          var valD   = Number(valD_m);
          var month = valM < 10 ? "0" + valM : String(valM);
          var day   = valD < 10 ? "0" + valD : String(valD);
          
          var selDay = valY + month + day;
          
          if(bzoprDay1 > selDay) {
        	  alert('당일 이후 가능 날짜를 선택해주세요.');
        	  return;
          }
          
          var dDate = String(valY) + String(month) + String(day);
          
          // 해당월 유효성 체크
          var today1    = new Date( valY , month-1 , day );
          var month1    = (today1.getMonth()+1) < 10 ? '0' + (today1.getMonth()+1) : (today1.getMonth()+1);
          var day1    = today1.getDate() < 10 ? '0' + today1.getDate() : today1.getDate();
          if(month != month1) {
        	  month = month1;
        	  day = day1;
        	  dDate = dDate.substring(0,4) + month1 + day1;
          }
          var holyYn = '';
          $.each(bzoprList, function(i,v) {
        	  if(v.date == dDate) {
                  holyYn = v.holyYn;
              } 
          });
          if(holyYn == '0' || holyYn == '6' || holyYn == '7') {
        	  alert('당일 이후 가능 날짜를 선택해주세요.');
        	  return false;
          } else {
        	  document.getElementById(idDate).value = String(valY) + delim + String(month) + delim + String(day);
        	  window.appManager.closePopupWebView('{"' +idDate+ '":"'+document.getElementById(idDate).value + '","CALLBACK":"'+callback+'"}');
          }
    	  //var inputParam = {};
    	  //inputParam.inquiryDate = String(valY) + String(month) +  String(day);
    	  //inputParam.callback = callback;
    	  //kbstar.connect.request('/mquics?QAction=1034148&page=D002695', inputParam, caq.tag.setInputBzoprYMDSuccessCallback, caq.tag.setInputBzoprYMDFailCallback, true);
      },
      
      /**
       * caq.tag.setInputBzoprYMDSuccessCallback() : 영업일 조회 성공 (모바일용)
       * 2013.08.28 스타뱅킹 3.0 : 날짜선택 시 구분자 삽입
       */
      setInputBzoprYMDSuccessCallback : function(data) {
          bzoprList = data.data.msg.servicedata.ARRAY수;
          
          var delim = ".";
          var idCal  = idCal_m;
          var idDate = idDate_m;
          var valY   = valY_m;
          var valM   = Number(valM_m);
          var valD   = Number(valD_m);
          var month = valM < 10 ? "0" + valM : String(valM);
          var day   = valD < 10 ? "0" + valD : String(valD);
          var dDate = String(valY) + String(month) + String(day);
          var holyYn = '';
          $.each(bzoprList, function(i,v) {
        	  if(v.date == dDate) {
                  holyYn = v.holyYn;
              } 
          });
          if(holyYn == '0' || holyYn == '6' || holyYn == '7') {
        	  alert('당일 이후 가능 날짜를 선택해주세요.');
        	  return false;
          } else {
        	  document.getElementById(idDate).value = String(valY) + delim + String(month) + delim + String(day);
        	  window.appManager.closePopupWebView('{"' +idDate+ '":"'+document.getElementById(idDate).value + '","CALLBACK":"'+data.data.msg.servicedata.callback+'"}');
          }
      },
      /**
       * caq.tag.setInputBzoprYMDFailCallback() : 영업일 조회 실패 (모바일용)
       * 2013.08.28 스타뱅킹 3.0 : 날짜선택 시 구분자 삽입
       */
      setInputBzoprYMDFailCallback : function(data) {
    	  //console.log('bzoprListFailCallback::', data);
      },
      /**
       * caq.tag.setFullPhone(idFull, idP1, idP2, idP3, mode) : 전화번호 set
       * @param {Object} idFull : DOM객체 ID
       * @param {Object} idP1   : 선택된 Value
       * @param {Object} idP2   : 선택된 Value
       * @param {Object} idP3   : 선택된 Value
       * @param {Object} mode   : 1 - 010-1234-5678
       *                          2 - 010)-1234-5678
       */
      setFullPhone : function (idFull, idP1, idP2, idP3, mode){
        objFull = $("#" + idFull);
        objP1   = $("#" + idP1);
        objP2   = $("#" + idP2);
        objP3   = $("#" + idP3);
        if(objP1.val()==""){
          objFull.val("");
          objP2.val("");
          objP3.val("");
        }else{
          switch(mode){
            case 1:
              objFull.val( objP1.val() + "-" + objP2.val() + "-" + objP3.val() );
            break;
            case 2:
              objFull.val( objP1.val() + ")" + objP2.val() + "-" + objP3.val() );
            break;
            default:
              objFull.val( objP1.val() + "-" + objP2.val() + "-" + objP3.val() );
          }
        }
      },

      /**
       * caq.tag.setFullEmail(idId, idAddr, idFull) : 전체이메일 주소 set
       * @param {Object} idId   : DOM ID
       * @param {Object} idAddr : 일 ID
       * @param {Object} idFull : 년 Value
       */
      setFullEmail : function(idId, idAddr, idFull){
        var objId   = $("#"+idId);
        var objAddr = $("#"+idAddr);
        var objFull = $("#"+idFull);
        if (objId.val() == "" && objAddr.val() == "") {
          objFull.val("");
        } else {
          objFull.val(objId.val() + "@" + objAddr.val());
        }
      },

      // 이메일 직접입력란 show hide
       /**
       * caq.tag.setEmailAddr(idSel, idTxt, incase) : 이메일 직접입력란 show hide
       * @param {Object} idId   : DOM ID
       * @param {Object} idAddr : 일 ID
       * @param {Object} idFull : 년 Value
       */
      setEmailAddr : function(idSel, idTxt, incase) {
        var objSel = $("#"+idSel);
        var objTxt = $("#"+idTxt);
        var selVal = objSel.val();
        
        if( selVal == "self" ) {
            objTxt.attr("readonly", false); 
          if( incase == 2 ){
            objTxt.val("");
            objTxt.focus();
          }
        } else {
          objTxt.attr("readonly", true);
          objTxt.val(objSel.val());
          objSel.focusout();
          objSel.focus();
        }
      },

//######################################################
//	MNBANK Function 추가
//######################################################

		/**
		 * setEmailSelectData_MNBANK(selId, emailId, emailAddrId, emailFullId) : 이메일 셀렉트버튼의 이벤트
		 * @param {Object} selId		: 셀렉트버튼의 HTMLText ID
		 * @param {Object} emailId		: 이메일 ID
		 * @param {Object} emailAddrId	: 이메일 주소 ID
		 * @param {Object} emailFullId	: 이메일 풀주소 ID
		 * @param {Object} noEmailId	: 이메일 없음 체크박스 ID
		 */      
		setEmailSelectData_MNBANK : function( selId, emailId, emailAddrId, emailFullId, noEmailId ){
			//debugger;
			if( noEmailId != "" ){
				//	이메일없음이 체크시 셀렉트버튼 이벤트 실행금지
				if( $("#"+noEmailId).is(":checked") ){
					return;
				}
			}

			var param = [];
			param.push({title:'직접입력'		,value:''});
			param.push({title:'naver.com'	,value:'naver.com'});
			param.push({title:'nate.com'	,value:'nate.com'});
			param.push({title:'yahoo.co.kr'	,value:'yahoo.co.kr'});
			param.push({title:'empal.com'	,value:'empal.com'});
			param.push({title:'gmail.com'	,value:'gmail.com'});
			param.push({title:'hanmail.net'	,value:'hanmail.net'});
			param.push({title:'daum.net'	,value:'daum.net'});

			var sussCallBack = function(datas){
				if( datas[0].title == "직접입력" ){
					$("#selfInput").attr("style", "display:block");
					$("#"+selId).text(datas[0].title);
					//$("#"+selId).removeClass("active");
					$("#"+emailAddrId).val(datas[0].value);
					$("#"+emailFullId).val( $("#"+emailId).val() + "@");
					//	타임아웃을 통해 키패드 호출이 원활해짐
					setTimeout(function(){
						$("#"+emailAddrId).focus();
					},100);

				}else{
					$("#selfInput").attr("style", "display:none");
					$("#"+selId).text(datas[0].title);
					$("#"+selId).addClass("active");
					$("#"+emailAddrId).val(datas[0].value);
					$("#"+emailFullId).val( $("#"+emailId).val() + "@" + $("#"+emailAddrId).val() );
					
				}
			}

			var value = $("#"+emailAddrId).val();
			BottomSheet.simplePickerBottomSheet("E-MAIL", "", value , param, sussCallBack);
		},
		
		/**
		 * caq.tag.setFullEmail_MNBANK(emailId, emailAddrId, emailFullId) : 전체이메일 주소 set
		 * @param {Object} selId		: 셀렉트버튼의 HTMLText ID
		 * @param {Object} emailId		: 이메일 ID
		 * @param {Object} emailAddrId	: 이메일 주소 ID
		 * @param {Object} emailFullId	: 이메일 풀주소 ID
		 */
		setFullEmail_MNBANK : function( selId, emailId, emailAddrId, emailFullId ){
			var objselId	= $("#"+selId);				//	이메일주소 버튼 ID button
			var objId		= $("#"+emailId);			//	이메일 ID input 
			var objAddr		= $("#"+emailAddrId);		//	이메일 주소 ID input hidden
			var objFull		= $("#"+emailFullId);		//	이메일 풀주소 ID input hidden

			//	이메일ID 없음, 도메인주소 Input 값 (직접입력)없음
			if( objId.val() == "" && objAddr.val() == "" ){
				objselId.text("직접선택");
				objFull.val("");

			//	이메일ID 있음, 도메인주소 Input 값 (직접입력)없음
			}else if( objId.val() != "" && objAddr.val() == "" ){
				objselId.text("직접선택");
				objFull.val( objId.val() + "@" + objAddr.val() );

			}else{
				//objselId.removeClass("active");
				objselId.text(objAddr.val());
				objFull.val( objId.val() + "@" + objAddr.val() );
			}
		},

		/**
		 * caq.tag.noEmail_MNBANK( selId, emailId, emailAddrId, emailFullId ) : 이메일없음 선택
		 * @param {Object} selId		: 셀렉트버튼의 HTMLText ID
		 * @param {Object} emailId		: 이메일 ID
		 * @param {Object} emailAddrId	: 이메일 주소 ID
		 * @param {Object} emailFullId	: 이메일 풀주소 ID
		 * @param {Object} noEmailId	: 이메일 없음 체크박스 ID
		 */
		noEmail_MNBANK : function( selId, emailId, emailAddrId, emailFullId, noEmailId ){
			var checkVal = false;
			if( noEmailId != "" || noEmailId != "defNoEmailId" ){
				checkVal = $("#"+noEmailId).is(":checked");
			}

			if( checkVal ){
				$("#"+ selId).text(" ");
				$("#"+ emailId).val("");
				$("#"+ emailAddrId).val("");
				$("#"+ emailFullId).val("");

				$("#"+ emailId).attr("readonly",true);
				$("#"+ selId).attr("readonly",true);
				$("#"+ selId).prop("disabled",true);
				$("#selfInput").attr("style", "display:none");
			}else{
				
				$("#"+ emailId).removeAttr("readonly");
				$("#"+ selId).removeAttr("readonly");
				$("#"+ selId).prop("disabled",false);
			}
		},

		/**
		 * caq.tag.setPhoneSelectData_MNBANK(selId, mobilIdNo, emailAddrId, mobilTelNo) : 통신사식별번호 셀렉트버튼의 이벤트
		 * @param {Object} selId		: 셀렉트버튼의 HTMLText ID
		 * @param {Object} mobilIdNo	: 통신사식별번호 ID
		 * @param {Object} mobilTelNo	: 전화번호 ID
		 * @param {Object} mobilFullNo	: 휴대전화풀번호 ID
		 * @param {Object} phoneMode	: 전화번호 모드
		 * @param {Object} noPhoneId	: 휴대폰없음 체크박스 ID
		 */      
		setPhoneSelectData_MNBANK : function( selId, mobilIdNo, mobilTelNo, mobilFullNo, phoneMode, noPhoneId ){
//			debugger;
			if( noPhoneId != "" || noPhoneId != "defNoPhoneId" ){
				//	이메일없음이 체크시 셀렉트버튼 이벤트 실행금지
				if( $("#"+noPhoneId).is(":checked") ){
					return;
				}
			}

			var param = [];

			//	집전화 목록
			if( phoneMode == 'N' || phoneMode == 'H' || phoneMode == 'W' ){
				param.push({title:'02'		,value:'02'});		param.push({title:'031'		,value:'031'});		param.push({title:'032'		,value:'032'});
				param.push({title:'033'		,value:'033'});		param.push({title:'041'		,value:'041'});		param.push({title:'042'		,value:'042'});
				param.push({title:'043'		,value:'043'});		param.push({title:'044'		,value:'044'});		param.push({title:'051'		,value:'051'});
				param.push({title:'052'		,value:'052'});		param.push({title:'053'		,value:'053'});		param.push({title:'054'		,value:'054'});
				param.push({title:'055'		,value:'055'});		param.push({title:'061'		,value:'061'});		param.push({title:'062'		,value:'062'});
				param.push({title:'063'		,value:'063'});		param.push({title:'064'		,value:'064'});		param.push({title:'070'		,value:'070'});
				param.push({title:'080'		,value:'080'});		param.push({title:'0130'	,value:'0130'});	param.push({title:'0131'	,value:'0131'});
				param.push({title:'0132'	,value:'0132'});	param.push({title:'0303'	,value:'0303'});	param.push({title:'0502'	,value:'0502'});
				param.push({title:'0504'	,value:'0504'});	param.push({title:'0505'	,value:'0505'});	param.push({title:'0506'	,value:'0506'}); 
				param.push({title:'0507'	,value:'0507'});

			}else if( phoneMode == 'A' ){
				param.push({title:'070'		,value:'070'});
				param.push({title:'0502'	,value:'0502'});
				param.push({title:'0504'	,value:'0504'});
				param.push({title:'0505'	,value:'0505'});
				param.push({title:'0506'	,value:'0506'});

			}else if( phoneMode == 'G' ){
				param.push({title:'010'		,value:'010'});
				param.push({title:'011'		,value:'011'});
				param.push({title:'016'		,value:'016'});
				param.push({title:'017'		,value:'017'});
				param.push({title:'018'		,value:'018'});
				param.push({title:'019'		,value:'019'});
				param.push({title:'02'		,value:'02'});		param.push({title:'031'		,value:'031'});		param.push({title:'032'		,value:'032'});
				param.push({title:'033'		,value:'033'});		param.push({title:'041'		,value:'041'});		param.push({title:'042'		,value:'042'});
				param.push({title:'043'		,value:'043'});		param.push({title:'044'		,value:'044'});		param.push({title:'051'		,value:'051'});
				param.push({title:'052'		,value:'052'});		param.push({title:'053'		,value:'053'});		param.push({title:'054'		,value:'054'});
				param.push({title:'055'		,value:'055'});		param.push({title:'061'		,value:'061'});		param.push({title:'062'		,value:'062'});
				param.push({title:'063'		,value:'063'});		param.push({title:'064'		,value:'064'});		param.push({title:'070'		,value:'070'});
				param.push({title:'080'		,value:'080'});		param.push({title:'0130'	,value:'0130'});	param.push({title:'0131'	,value:'0131'});
				param.push({title:'0132'	,value:'0132'});	param.push({title:'0303'	,value:'0303'});	param.push({title:'0502'	,value:'0502'});
				param.push({title:'0504'	,value:'0504'});	param.push({title:'0505'	,value:'0505'});	param.push({title:'0506'	,value:'0506'}); 
				param.push({title:'0507'	,value:'0507'});
				
			}else{
				param.push({title:'010'		,value:'010'});
				param.push({title:'011'		,value:'011'});
				param.push({title:'016'		,value:'016'});
				param.push({title:'017'		,value:'017'});
				param.push({title:'018'		,value:'018'});
				param.push({title:'019'		,value:'019'});
			}

			var sussCallBack = function(datas){
				$("#"+selId).text(datas[0].title);
				$("#"+mobilIdNo).val(datas[0].value);
				caq.tag.setFullPhone_MNBANK( mobilIdNo, mobilTelNo, mobilFullNo );
			}

			var value = $("#"+mobilIdNo).val();
			BottomSheet.simplePickerBottomSheet("TEL", "", value , param, sussCallBack);
		},

		/**
	     * caq.tag.setFullPhone_MNBANK( mobilIdNo, mobilTelNo, mobilFullNo ) : 전화번호 set
	     * @param {Object} mobilIdNo	: 통신사식별번호 Value
	     * @param {Object} mobilTelNo	: 국번일련번호 Value
	     * @param {Object} mobilFullNo	: Full전화번호 Value
	     */
		setFullPhone_MNBANK : function( mobilIdNo, mobilTelNo, mobilFullNo ){
			var objMobilIdNo	= $("#" + mobilIdNo);
			var objmobilTelNo	= $("#" + mobilTelNo);
			var objmobilFullNo	= $("#" + mobilFullNo);

			if( objMobilIdNo.val() == "" ){
				objmobilTelNo.val("");
				objmobilFullNo.val("");
				
			}else{
				
				objmobilFullNo.val( objMobilIdNo.val() + objmobilTelNo.val() );
			}
		},

		/**
		 * caq.tag.noPhone_MNBANK( selId, emailId, emailAddrId, emailFullId ) : 휴대폰없음 선택
		 * @param {Object} selId		: 셀렉트버튼의 HTMLText ID
		 * @param {Object} mobilIdNo	: 통신사 식별번호 ID
		 * @param {Object} mobilTelNo	: 국번일련번호 ID
		 * @param {Object} mobilFullNo	: FULL 전화번호 ID
		 * @param {Object} mobilFullNo	: FULL 전화번호 ID
		 * @param {Object} noPhoneId	: 휴대폰없음 체크박스 ID
		 */
		noPhone_MNBANK : function( selId, mobilIdNo, mobilTelNo, mobilFullNo, noPhoneId, phoneMode ){
			//debugger;
			var checkVal = false;
			if( noPhoneId != "" || noPhoneId != "defNoPhoneId" ){
				checkVal = $("#"+noPhoneId).is(":checked");
			}

			var defaultNum = "";
			if( phoneMode == 'N' || phoneMode == 'H' || phoneMode == 'W'){
				defaultNum = "02";
			}else if( phoneMode == 'A' ){
				defaultNum = "070";
			}else{
				defaultNum = "010";
			}

			if( checkVal ){
				$("#"+ selId).text(" ");
				$("#"+ mobilIdNo).val("");
				$("#"+ mobilTelNo).val("");
				$("#"+ mobilFullNo).val("");

				$("#"+ selId).attr("readonly",true);
				$("#"+ selId).prop("disabled",true);
				$("#"+ mobilTelNo).attr("readonly",true);
			}else{
				$("#"+ selId).text(defaultNum);
				$("#"+ mobilIdNo).val(defaultNum);
				$("#"+ mobilTelNo).val("");
				$("#"+ mobilFullNo).val(defaultNum);
				$("#"+ selId).removeAttr("readonly");
				$("#"+ selId).prop("disabled",false);
				$("#"+ mobilTelNo).removeAttr("readonly");
			}
		},

		/**
		 * caq.tag.inputCalendarShow_MNBANK( lang, calPop_Id, inputDate_Id, dateVal, flag, layerId, callbackFn ) : input 달력 보이기 (모바일용)
		 * @param {Object} lang				: 언어
		 * @param {Object} calPop_Id		: 달력 팝업 DIV ID
		 * @param {Object} inputDate_Id		: 날짜 Input ID
		 * @param {Object} dateVal			: 기본날짜
		 * @param {Object} flag				: 초기값셋팅 여부
		 * @param {Object} layerId			: 달력태그를 담을 layerID
		 * @param {String} callbackFn		: 콜백함수
		 */
		inputCalendarShow_MNBANK : function( lang, calPop_Id, inputDate_Id, dateVal, flag, layerId, callbackFn ){
			var tempHtml = '<div id="'+calPop_Id+'"></div>';
			$("#"+layerId).html(tempHtml);

			var strDate  = dateVal;
			var year     = "";
			var month    = "";
			var date     = "";

			if( caq.util.isDate(strDate) ){
				if( strDate.length == 8 ){
					year  = strDate.substring(0,4);
					month = strDate.substring(4,6);
					date  = strDate.substring(6);
				}else{
					year  = strDate.substring(0,4);
					month = strDate.substring(5,7);
					date  = strDate.substring(8);
				}
			}else{
				var today = new Date();
				year  = today.getFullYear();
				month = today.getMonth()+1;
				date  = today.getDate();
			}
			month = Number(month);
			caq.tag.makeInputCalendar_MBANK(lang, calPop_Id, inputDate_Id, year, month, date, dateVal, flag, layerId, callbackFn);
		},

		/**
		 * caq.tag.makeInputCalendar_MBANK( lang, calPop_Id, inputDate_Id, valY, valM, valD, dateVal, flag, layerId, callbackFn ) : input 달력 생성 (모바일용)
		 * @param {Object} lang				: 언어 (KOR,ENG)
		 * @param {Object} calPop_Id		: 달력 팝업DIV ID
		 * @param {Object} inputDate_Id		: 날짜 Input ID
		 * @param {Object} valY				: 년 Value(Number Type)
		 * @param {Object} valM				: 월 Value(Number Type)
		 * @param {Object} valD				: 일 Value(Number Type)
		 * @param {Object} dateVal			: 날짜 초기값
		 * @param {Object} flag				: 초기값 세팅여부
		 * @param {Object} layerId			: 태그레이어팝업ID
		 * @param {String} callbackFn		: 콜백함수
		 */
		makeInputCalendar_MBANK : function( lang, calPop_Id, inputDate_Id, valY, valM, valD, dateVal, flag, layerId, callbackFn ){
			//	전역변수에 설정값 저장
			idCal_m   = calPop_Id;		//	달력팝업을 넣을 DIV ID
			idDate_m  = inputDate_Id;	//	날짜 INPUT ID
			valY_m    = valY;
			valM_m    = valM;
			valD_m    = valD;

			var calendar	= $("#"+calPop_Id);		//	달력팝업을 넣을 DIV ID

			//	해당월의 마지막 데이트 검증
			var valDD		= caq.util.getLastDayOfMonth(valY,valM-1) < valD ? caq.util.getLastDayOfMonth(valY,valM-1) : valD;
			if( valD_m != valDD ){
				valD_m = valDD;
			}

			//	오늘날짜 설정용
			var strToday		= new Date();
			var strTodayYear	= strToday.getFullYear();
			var strTodayMonth	= strToday.getMonth() + 1;
			var strTodayDay		= strToday.getDate();

			if( flag == "true" ){
				valY_m    = parseInt(dateVal.substring(0, 4), 10);
				valM_m    = dateVal.substring(5, 7);
				valD_m    = dateVal.substring(8);

				if(valM_m.substring(0,1)=="0") valM_m = valM_m.substring(1);
				if(valD_m.substring(0,1)=="0") valD_m = valD_m.substring(1);
			}

			var today    = new Date( valY_m , valM_m-1 , valD_m );
			var year     = today.getFullYear();
			var nextyear = year +1;
			var lastyear = year -1;
			var month    = today.getMonth();
			var date     = today.getDate();
			var strMonth = month+1 < 10 ? '0' + (month+1) : (month+1);

			var strPreMonth		= (Number(strMonth)-1)+"";
			var strPreYear		= year;
			var strNextMonth	= (Number(strMonth)+1)+"";
			var strNextYear		= year;

			if( (Number(strMonth)-1) == 0 ){
				strPreMonth		= "12";
				strPreYear		= year-1;
			}else if( (Number(strMonth)+1) == 13 ){
				strNextMonth	= "1";
				strNextYear		= year+1;
			}

			var day;

			//	txt 설정 
			var txtYearMonth= "";
			var txtCaption	= "";
			var txtConfirm	= "";
			var txtCancle	= "";
			var txtToday	= "";

			if( 'KOR'==lang ){
				day=new Array("일","월","화","수","목","금","토");
				txtYearMonth	=  year + "년 " + strMonth + "월 ";
				txtCaption		= "달력";
				txtConfirm		= "확인";
				txtCancle		= "취소";
				txtToday		= "오늘";
			}else{
				day=new Array ("S","M","T","W","T","F","S");
				txtYearMonth	=  strMonth + "/" +year;
				txtCaption		= "Calendar";
				txtConfirm		= "Confirm";
				txtCancle		= "Cancel";
				txtToday		= "Today"
			}

			var firstOfMonth = new Date(year,month,1);
			var firstDay     = firstOfMonth.getDay();
			var lastDate     = caq.util.getLastDayOfMonth(year,month);

			//	팝업레이어 변경이 일어나기때문에 고정을 위한 max-height값 채번
			var maxheight =  $("#"+calPop_Id+"-Lyaer_devCon").attr("rel");

			try{
				var text  = "";
				text += "    <div class='ly_cnt' style=" + maxheight + ">";
				text += "        <div class='ly_calendar'>";
				text += "            <div class='cal_month'>";
				text += "                <button type='button' class='btn btn_ico first' onclick=\"caq.tag.makeInputCalendar_MBANK('"+lang+"','"+calPop_Id+"','"+inputDate_Id+"'," +lastyear+ "," +(Number(strMonth))+ ", " +date+ ",'"+dateVal+"','false', '"+layerId+"','"+callbackFn+"' ); return false;\" ><span class='hidden'>전년도</span></button>";
				text += "                <button type='button' class='btn btn_ico prev' onclick=\"caq.tag.makeInputCalendar_MBANK('"+lang+"','"+calPop_Id+"','"+inputDate_Id+"'," +strPreYear+ "," +(Number(strPreMonth))+ ", " +date+ ",'"+dateVal+"','false', '"+layerId+"','"+callbackFn+"' ); return false;\" ><span class='hidden'>이전달</span></button>";
				text += "                <span class='year_txt'>" + txtYearMonth + "</span>";
				text += "                <button type='button' class='btn btn_ico next' onclick=\"caq.tag.makeInputCalendar_MBANK('"+lang+"','"+calPop_Id+"','"+inputDate_Id+"'," +strNextYear+ "," +(Number(strNextMonth))+ ", " +date+ ",'"+dateVal+"','false', '"+layerId+"','"+callbackFn+"' ); return false;\" ><span class='hidden'>다음달</span></button>";
				text += "                <button type='button' class='btn btn_ico end' onclick=\"caq.tag.makeInputCalendar_MBANK('"+lang+"','"+calPop_Id+"','"+inputDate_Id+"'," +nextyear+ "," +(Number(strMonth))+ ", " +date+ ",'"+dateVal+"','false', '"+layerId+"','"+callbackFn+"' ); return false;\" ><span class='hidden'>다음년도</span></button>";
				text += "                <button type='button' class='btn today' onclick=\"caq.tag.makeInputCalendar_MBANK('"+lang+"','"+calPop_Id+"','"+inputDate_Id+"'," +strTodayYear+ "," +(Number(strTodayMonth))+ ", " +strTodayDay+ ",'"+dateVal+"','false', '"+layerId+"','"+callbackFn+"' ); return false;\" >"+txtToday+"<span class='hidden'>선택</span></button>";
				text += "            </div>";

				text += "            <table id='"+calPop_Id+"-table' class='cal_tbl'>";
				text += "                <caption>"+txtCaption+"</caption>";
				text += "                <thead>";
				text += "                    <tr>";
				text += "                        <th scope='col' class='sunday'>"+day[0]+"</th>";
				text += "                        <th scope='col'>"+day[1]+"</th>";
				text += "                        <th scope='col'>"+day[2]+"</th>";
				text += "                        <th scope='col'>"+day[3]+"</th>";
				text += "                        <th scope='col'>"+day[4]+"</th>";
				text += "                        <th scope='col'>"+day[5]+"</th>";
				text += "                        <th scope='col' class='saturday' >"+day[6]+"</th>";
				text += "                    </tr>";
				text += "                </thead>";
				text += "                <tbody>";

				var dayNum    = 1;
				var curCol    = 1;
				var weekcount = 0;
				for (var i=1; i<=Math.ceil((lastDate + firstDay)/7); i++) {
					text += "                    <tr>";
					for( var j=1; j<=7; j++ ){
						if(j == 1) {
							text += "                        <td class='sunday'>";
						}else if(j == 7) {
							text += "                        <td class='saturday'>";
						}else{
							text += "                        <td>";
						}
						weekcount = weekcount+1;
						if( curCol < firstDay + 1 || dayNum > lastDate ){
							text += "&nbsp;";
							curCol++;
						}else{
							if( dayNum == date ) {
								//text += "<a href='javascript:void(0);' class='active' onclick=\"caq.tag.selectDay_MNBANK(this,'"+calPop_Id+"','"+inputDate_Id+"',"+year+","+Number(strMonth)+","+dayNum+"); return false;\">" + dayNum + "<span id=\"id_title\" class=\"hidden\">일 선택</span></a>";
								text += "<button type='button' class='on' title='선택 됨' onclick=\"caq.tag.selectDay_MNBANK(this,'"+calPop_Id+"','"+inputDate_Id+"',"+year+","+Number(strMonth)+","+dayNum+"); return false;\">" + dayNum + "</button>";
							}else{
								switch( j ){
									default :
									//text += "<a href='javascript:void(0);' onclick=\"caq.tag.selectDay_MNBANK(this,'"+calPop_Id+"','"+inputDate_Id+"',"+year+","+Number(strMonth)+","+dayNum+");return false;\">"+dayNum+"</a>";
									text += "<button type='button' onclick=\"caq.tag.selectDay_MNBANK(this,'"+calPop_Id+"','"+inputDate_Id+"',"+year+","+Number(strMonth)+","+dayNum+");return false;\">"+dayNum+"</button>";
								}
							}
							dayNum++ ;
						}
						text += "                        </td>";
					}
					text += "                    </tr>";
				}

				text += "                </tbody>";
				text += "            </table>";
				text += "        </div>";
				text += "    </div>";
				text += "    <div class='btn_pop_confirm_wrap'>";
				text += "        <div class='btn_area'>";
				text += "            <span><button type='button' class='btn primary lg' onclick=\"caq.tag.setInputYMD_MNBANK( '"+layerId+"_dev','"+callbackFn+"' );\" >"+txtConfirm+"</button></span>";
				text += "        </div>";
				text += "    </div>";

				calendar.html(text);
				//calendar.css({"height":"100%"});
			}catch(err){}
		},

		/**
		 * caq.tag.setInputYMD_MNBANK() : 달력에서 선택한 년월일을 input에 set (모바일용)
		 */
		setInputYMD_MNBANK : function( closeBtId, callbackFn ){
			//debugger;
			var delim = ".";
			var idCal  = idCal_m;
			var idDate = idDate_m;		//	전역변수 INPUT ID를 설정
			var valY   = valY_m;
			var valM   = Number(valM_m);
			var valD   = Number(valD_m);
			var month = valM < 10 ? "0" + valM : String(valM);
			var day   = valD < 10 ? "0" + valD : String(valD);

			$('#'+idDate).val( String(valY) + delim + String(month) + delim + String(day) );

			$('#'+closeBtId).click();

			if( typeof callbackFn == "string" && callbackFn != "" ){
				try{ window.SPA_COMMON.callbackWithSPA( callbackFn , {}); }catch( e ){}
			}
		},

		/**
		 * caq.tag.selectDay_MNBANK( obj, idCal, idDate, valY, valM, valD ) : 달력에서 선택한 년월일을 전역 변수에 저장 (모바일용)
		 * @param {Object} obj		: DOM object
		 * @param {Object} idCal	: DOM ID
		 * @param {Object} idDate	: 일 ID
		 * @param {Object} valY		: 년 Value
		 * @param {Object} valM		: 월 Value
		 * @param {Object} valD		: 일 Value
		 */
		selectDay_MNBANK : function( obj, idCal, idDate, valY, valM, valD ){
			//$("#"+idCal+"-table").find("a").removeClass("active");
			//$('#id_title').remove();
			//$(obj).addClass("active");
			//$(obj).append("<span id=\"id_title\" class=\"hidden\">일 선택</span>");

			$("#"+idCal+"-table").find("button").removeClass("on");
			$(obj).addClass("on");

			idCal_m   = idCal;
			idDate_m  = idDate;
			valY_m    = valY;
			valM_m    = valM;
			valD_m    = valD;
		},

		/**
		 * caq.tag.openCalendarLayerPop( lang, calPop_Id, inputDate_Id, dateVal, flag, layerId, callbackFn ) : 달력 레이어팝업 호출(모바일용)
		 * @param {Object} lang				: 언어
		 * @param {Object} calPop_Id		: 달력 팝업 DIV ID
		 * @param {Object} inputDate_Id		: 날짜 Input ID
		 * @param {Object} dateVal			: 기본날짜
		 * @param {Object} flag				: 초기값셋팅 여부
		 * @param {Object} layerId			: 달력태그를 담을 layerID
		 * @param {String} callbackFn		: 콜백함수
		 */
		openCalendarLayerPop : function( lang, calPop_Id, inputDate_Id, dateVal, flag, layerId, callbackFn ){
			var txtTitle = "";
			if( 'KOR'==lang ){
				txtTitle = "날짜선택";
			}else{
				txtTitle = "Calendar";
			}
			caq.tag.inputCalendarShow_MNBANK( lang, calPop_Id, inputDate_Id, $("#"+inputDate_Id).val(), flag, layerId, callbackFn );
			
			window.appManager.closeHybridBottomSheet("caq.tag.onclose('#"+layerId+"')");
			
			$.ohyLayer({
				title: txtTitle,
				content:'#'+layerId,
				type:'bottom',
				height:600,
				closeUse:true
			});
			
			//바텀시트의 X(닫기)버튼 클릭시 백버튼에 동작 등록한 함수를 제거
			$(document).off("click.btmClose","#"+layerId+"_dev").on("click.btmClose","#"+layerId+"_dev",function(){
				window.appManager.closeHybridBottomSheet("");
			});
			//dim 터치시 백버튼 동작 등록한 함수 제거
			$(document).off("click.btmClose",".col_dim").on("click.btmClose",".col_dim",function(){
				window.appManager.closeHybridBottomSheet("");
			});
		},
		
		onclose : function( id ){
			$(id+"_dev").click();
		}

	};
}();
  
  
  /*
  * Pagination 1.0 - jQuery Plugin
  * http://www.taeyo.net
  * Copyright (c) 2009 Taeyoung Kim
  * Dual licensed under the MIT and GPL licenses
  */
  (function ($) {
     var settings;
     var iLoop = 1;
     var iLoopEnd = 1;
     var pageCount = 0;
     var cnt = 10;

     $.fn.pager = function (callSetting) {
        settings = $.extend({
           pager: "#pager",
           pagerMode: "image",
           totalItemCount: 100,
           recordPerPage: 10,
           currentPage: 1,
           pageIndexChanged: "",
           prev1Text: "<",
           next1Text: ">",
           prev1ImgSrc: "images/Prev1.gif",
           next1ImgSrc: "images/next1.gif",
           prev10Text: "<<",
           next10Text: ">>",
           prev10ImgSrc: "images/Prev10.gif",
           next10ImgSrc: "images/next10.gif",
           numberStyle: "&nbsp;",
           pagingPerPage: 10,
           selectedPageFontColor: "#f484a8"
        }, callSetting || {});

        settings.pager = $(settings.pager);

        showPager();
     };

     var pager = $.fn.pager;
     pager.refresh = function (totalItemCount, recordPerPage) {
        settings.totalItemCount = totalItemCount;
        settings.recordPerPage = recordPerPage;

        showPager();

        return pageCount;
     }

     var showPager = function () {
        cnt = settings.pagingPerPage;
        pageCount = Math.ceil(settings.totalItemCount / settings.recordPerPage);
        var pageLink;

        settings.pager.empty();
        
        var baseVal = settings.currentPage - 1;
        iLoop = (Math.floor(baseVal / cnt) * cnt) + 1;
        iLoopEnd = (Math.floor(baseVal / cnt) + 1) * cnt;

        if (iLoopEnd > pageCount) iLoopEnd = pageCount;

        for (var page = iLoop; page <= iLoopEnd; page++) {
           
           //현재 페이지가 아닌 경우 클릭 이벤트를 걸어준다
           if (page != settings.currentPage) {
              pageLink = $("<a  class='txt'> " + page + " </a>\n");
              pageLink.css("cursor", "hand").click(function () {  //페이지 번호를 클릭하는 경우의 처리
                 settings.currentPage = parseInt($(this).text());
                 PageClick();
              });
           } else {
              //현재 페이지는 클릭 이벤트를 걸지 않고, 스타일만 다르게 한다
              pageLink = $("<a class='txt on'> " + page + " </a>\n");
           }
           
           settings.pager.append(pageLink);
        }
        if (pageCount > 0) {
   //        //### 이전 1개, 다음 1개 Start ###
           var prev1UniqueId = settings.pager.attr("id") + "_prev1";
           var next1UniqueId = settings.pager.attr("id") + "_next1";

   //        //이전 1개, 다음 1개를 위한 영역
           settings.pager.prepend("<a class='img' id='" + prev1UniqueId + "'></a>");
           settings.pager.append("<a class='img' id='" + next1UniqueId + "'></a>");

           var $prev1Span = settings.pager.find("#" + prev1UniqueId);
           var $next1Span = settings.pager.find("#" + next1UniqueId);

           var $prev1, $next1;

           //이전 1 페이지 관련 처리
           if (settings.currentPage > 1) {
               if (settings.pagerMode == "text") {
                   $prev1 = $("<a>" + settings.prev1Text + "</a>]");
                   $prev1
                       .css("cursor", "hand")
                       .click(GoPrev1);
               }
               else if (settings.pagerMode == "image") {
                   $prev1 = $("<img />");
                   $prev1
                       .attr("src", settings.prev1ImgSrc)
                       .css("cursor", "hand")
                       .click(GoPrev1);
               }
               $prev1Span.append($prev1);
           }
           else {
               if (settings.pagerMode == "text") {
                   $prev1 = $("<a>" + settings.prev1Text + "</a>]");
               }
               else if (settings.pagerMode == "image") {
                   $prev1 = $("<img />");
                   $prev1.attr("src", settings.prev1ImgSrc);
               }
               $prev1Span.append($prev1);
           }

           //다음 1 페이지 관련 처리
           if (pageCount > settings.currentPage) {
               if (settings.pagerMode == "text") {
                   $next1 = $("<a>" + settings.next1Text + "</a>]");
                   $next1
                       .css("cursor", "hand")
                       .click(GoNext1);
               }
               else if (settings.pagerMode == "image") {
                   $next1 = $("<img />");
                   $next1
                           .attr("src", settings.next1ImgSrc)
                           .css("cursor", "hand")
                           .click(GoNext1);
               }
               $next1Span.append($next1);
           }
           else {
               if (settings.pagerMode == "text") {
                   $next1 = $("<a>" + settings.next1Text + "</a>]");
               }
               else if (settings.pagerMode == "image") {
                   $next1 = $("<img />");
                   $next1.attr("src", settings.next1ImgSrc);
               }
               $next1Span.append($next1);
           }
         
        }
     }

     var PageClick = function () {

        //이벤트 버블;
        settings.pageIndexChanged(settings.currentPage); //페이지 클릭 이벤트 호출
        //showPager();
     }
    var GoPrev1 = function () {
        if( settings.currentPage > 0) {
        settings.currentPage = Number(settings.currentPage) -1;

        //showPager();
        //이벤트 버블;
        settings.pageIndexChanged(settings.currentPage); //페이지 클릭 이벤트 호출
      }
     }

     var GoNext1 = function () {
        if( settings.currentPage < pageCount) {
          settings.currentPage = Number(settings.currentPage) + 1;

          //showPager();
          //이벤트 버블;
          settings.pageIndexChanged(settings.currentPage); //페이지 클릭 이벤트 호출
      }
     }

     var GoPrev10 = function () {
        iLoop -= cnt;
        iLoopEnd -= cnt;
        iLoopEnd = Math.ceil(iLoopEnd / cnt) * cnt; //최종구역이 아니라면, 페이지 end 수를 10의 배수로 맞춘다
        if (iLoop < 1) iLoopEnd = 1;
        if (iLoopEnd < cnt) iLoopEnd = cnt;
        settings.currentPage = iLoop;

        showPager();
        //이벤트 버블;
        settings.pageIndexChanged(settings.currentPage); //페이지 클릭 이벤트 호출
     }

     var GoNext10 = function () {
        iLoop += cnt;
        iLoopEnd += cnt;
        if (iLoopEnd > pageCount) iLoopEnd = pageCount;
        settings.currentPage = iLoop;

        showPager();
        //이벤트 버블;
        settings.pageIndexChanged(settings.currentPage); //페이지 클릭 이벤트 호출
     }
  })(jQuery);
  

//-----------------------------------------------------------------------------------------------------------------------
// * 글로벌 메세지 자바스크립트
//-----------------------------------------------------------------------------------------------------------------------
    msg = function(){

    var msgKOR = {
      "MSG00001" : "날짜 형식이 아닙니다.",
      "MSG00002" : "일",
      "MSG00003" : "월",
      "MSG00004" : "화",
      "MSG00005" : "수",
      "MSG00006" : "목",
      "MSG00007" : "금",
      "MSG00008" : "토",
      "MSG00009" : "년",
      "MSG00010" : "월",
      "MSG00011" : "일",
      "MSG00012" : "이전",
      "MSG00013" : "이후",
      "MSG00014" : "확인",
      "MSG00015" : "닫기",
      "MSG00016" : "년 선택",
      "MSG00017" : "월 선택",
      "MSG00018" : "일 선택",
      "MSG00019" : "처리중입니다."
    };

    var msgENG = {
      "MSG00001" : "Wrong format for date type",
      "MSG00002" : "S",
      "MSG00003" : "M",
      "MSG00004" : "T",
      "MSG00005" : "W",
      "MSG00006" : "T",
      "MSG00007" : "F",
      "MSG00008" : "S",
      "MSG00009" : "Y",
      "MSG00010" : "M",
      "MSG00011" : "D",
      "MSG00012" : "Prev",
      "MSG00013" : "Next",
      "MSG00014" : "Ok",
      "MSG00015" : "Close",
      "MSG00016" : "Select Year",
      "MSG00017" : "Select Month",
      "MSG00018" : "Select Day",
      "MSG00019" : "Loading"
    };

    var msgJPN = {
            "MSG00001" : "日付タイプの間違ったフォーマット",
            "MSG00002" : "日",
            "MSG00003" : "月",
            "MSG00004" : "火",
            "MSG00005" : "水",
            "MSG00006" : "木",
            "MSG00007" : "金",
            "MSG00008" : "土",
            "MSG00009" : "年",
            "MSG00010" : "月",
            "MSG00011" : "日",
            "MSG00012" : "い-ぜん",
            "MSG00013" : "い-ご",
            "MSG00014" : "確認する",
            "MSG00015" : "閉じる",
            "MSG00016" : "年選択",
            "MSG00017" : "月選択",
            "MSG00018" : "日選択",
            "MSG00019" : "Loading"
    };

    var msgCHN = {
            "MSG00001" : "日期类型的格式错误",
            "MSG00002" : "日",
            "MSG00003" : "月",
            "MSG00004" : "火",
            "MSG00005" : "水",
            "MSG00006" : "木",
            "MSG00007" : "金",
            "MSG00008" : "土",
            "MSG00009" : "年",
            "MSG00010" : "月",
            "MSG00011" : "日",
            "MSG00012" : "以前",
            "MSG00013" : "以后",
            "MSG00014" : "确认",
            "MSG00015" : "关闭",
            "MSG00016" : "年 选择",
            "MSG00017" : "月 选择",
            "MSG00018" : "日 选择",
            "MSG00019" : "Loading"
    };

    return {
      /**
       * msg.getMsg(sLangType, sMsgCode) : 언어별 메세지 가져오기
       * @param {Object} sLangType : 언어코드 (KOR,ENG,JPN,CHN)
       * @param {Object} sMsgCode  : 메세지 코드
       */
      getMsg : function(sLangType, sMsgCode){
        var sMsg = "";
        switch(sLangType){
          case "KOR" : sMsg = eval("msgKOR."+sMsgCode); break;
          case "ENG" : sMsg = eval("msgENG."+sMsgCode); break;
          case "JPN" : sMsg = eval("msgJPN."+sMsgCode); break;
          case "CHN" : sMsg = eval("msgCHN."+sMsgCode); break;
          default    : sMsg = eval("msgKOR."+sMsgCode); break;
        }
        return sMsg;
      },

      /**
       * msg.setErrMsg(sKey, sValues) : 언어별 메세지 설정
       * @param {Object} sKey     : 메세지 코드 (예: MSG00001)
       * @param {Object} sValues  : 메세지 배열 (예: new Array("한글","English","日本語","中国") 단, 해당 순서에 영향이 있다.)
       */
      setMsg : function(sKey, sValues){
        msgKOR[sKey] = sValues[0];
        msgENG[sKey] = sValues[1];
        msgJPN[sKey] = sValues[2];
        msgCHN[sKey] = sValues[3];
      }
    };
  }();
  
//2022-05-30 P20222164743 goBack 로직 분할 ==========================> START
var cmnExpanPlfm = function(){
	function openExtendWebView( urls , groupCocd, pageTitle, onCloseData, isMinimum ){
	  	window.ExtendPlatformManager.openExtendWebView(urls , groupCocd, pageTitle, onCloseData,
	  		function( returnData ){
				if( returnData != undefined ){
					if( returnData.action != undefined && (returnData.action == "move_to" || returnData.action == "MOVEPAY" ) ){
						let pageCd	= $.trim( returnData.page );
						let url		= '/mquics?page='+pageCd;
						let params	= returnData.params || {};

						if( returnData.page == "home" || returnData.page == "D001374" ){
							window.configManager.moveToBankHome();

						}else if( pageCd.length > 0 ){
							kbstar.exec(function(oRet){
									try{
										const nFindIdx = Number( $.trim( oRet ) );
										if( nFindIdx == 1 ){
											window.navi.goBack();
										}else{
											window.navi.navigateWithCurrPageHistoryRemove(url, params, function(){});
										}
									}catch(e){
										window.navi.goBack();
									}
								}, function(oRet){
									window.navi.navigateWithCurrPageHistoryRemove(url, params, function(){});
								}, "Navigator", "getPageIndex",  { pageId : pageCd }
							);
						}
					}else if( returnData.action != "stay" ){
						window.navi.goBack();
					}
				}else{
					window.navi.goBack();
				}
			}, isMinimum
		);
	}
	return{
		openExtendWebView
	}
};
window.cmnExpanPlfm = new cmnExpanPlfm();
// 2022-05-31 P20222164743 goBack 로직 분할 ==========================> END