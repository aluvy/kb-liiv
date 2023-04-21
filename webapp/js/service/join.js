
/**
* 가입 공통 스크립트
* 작성일 : 2023-01-20
*/

// 상단 메뉴 백버튼 영역 이벤트 재정의
function goPrevPageForJoin() {
    // 주소검색 팝업이 있는 경우 팝업 닫기
    if($("#layer").prop("class") != undefined && $("#layer").css("display") != "none") {
        closeDaumPostcode();
        return;
    }
    // 레이어 팝업이 있는 경우 팝업 닫기
    var passBackFunc = 0;
    if($(".layer_wrap[aria-hidden=false]").find(".ly_in").prop("class") != undefined) {
        modalLayer.hide();
        passBackFunc++;
        //return;
    }
    // 가상키패드가 있는 경우 키패드 닫기
    $(".nppfs-keypad").each(function(){
        if($(this).css("display") != "none"){
            $(this).css("display", "none");
            passBackFunc++;
        }
    });

    if(passBackFunc > 0) return;

    if($(".page.display").prop("class") != undefined) {
        let pageLength = $('.page.display').length;

        if($(".page.display").eq(0).hasClass("on")) {
            prevStepForJoin();
            return;
        }

        for(var i=pageLength ; i>0 ; i--) {
            if ($(".page.display").eq(i-1).prop("class") != undefined &&
                $(".page.display").eq(i-1).prop("class") != "progress_wrap") {
                if($(".page.display").eq(i).hasClass("on")) {
                    $(".page.display").eq(i).removeClass("on");
                    $(".page.display").eq(i-1).addClass("on");

                    window.scrollTo(0,0);
                    getBtmFixElem();

                    if($('.progress_wrap').prop("class") != undefined) {
                        setProgressBar($(".page.display").eq(i-1).prop("id"));
                    }
                    break;
                }
            }
        }

        //고객센터 상담단계에 따른 배너 노출
        if($("#counselApplStat").val() != undefined && !isEmpty($("#applSeqNo").val())) {
            $("#areaCounselBanner").css("display","block");
        }
    } else {
        //step 처리 없는 화면인 경우 각 화면의 이전페이지 이동 함수 호출
        prevStepForJoin();
        return;
    }
}

// 페이지 이동
// 호출하는 부모 페이지에 화면 이동을 위한 nextStepForJoin() 함수 작성 필요
function goPageForJoin(page) {

    let pageLength = $(".page.display").length;

    // 특정 페이지 ID로 이동시
    if(typeof page === "string") {
        if($("#" + page).hasClass("display")) {
            $("#" + page).addClass("on").siblings().removeClass("on");

            window.scrollTo(0,0);
            getBtmFixElem();

            if($(".progress_wrap").prop("class") != undefined) {
                setProgressBar(page);
            }
        } else {
            // display 속성이 부여되지 않은 페이지로 접근 불가
            let opt = {
                msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            };
            popalarm(opt);
            return;
        }
    }
    // 현재 페이지의 다음페이지로 이동시
    else {
        for(var i=0 ; i<pageLength ; i++) {
            if($(".page.display").eq(i+1).prop("class") != undefined) {
                if($(".page.display").eq(i).hasClass("on")) {
                    $(".page.display").eq(i).removeClass("on");
                    $(".page.display").eq(i+1).addClass("on");

                    window.scrollTo(0,0);
                    getBtmFixElem();

                    if($(".progress_wrap").prop("class") != undefined) {
                        setProgressBar($(".page.display").eq(i+1).prop("id"));
                    }
                    break;
                }
            } else {
                nextStepForJoin();
            }
        }
    }
}

function exitJoin(){
    modalLayer.show({
        titleUse : true,
        title : "KB Liiv M과의 만남을<br>그만두실 건가요?",
        id : "exitJoinLayer",
        type : "confirm",
        closeUse : false
    });
}

function setProgressBar(pageId) {
    stepLength = 34;
    for(var i=1 ; i<=stepLength ; i++) {
        if(isEmpty($("#custId").val()) && i < 14) {
            if($(".page.display").hasClass("step"+i)) {
                $(".progress_wrap > .step"+i).css("display", "block");
            } else {
                $(".progress_wrap > .step"+i).css("display", "none");
            }
        }
        if($("#"+pageId).hasClass("step"+i)) {
            $(".progress_wrap > .step"+i).addClass("on").siblings().removeClass("on");
            beforeOpenPageForJoin("step"+i, pageId);
        }
    }
}

//START : eSIM 단말모델 조회 관련 스크립트 ----------------------------------------
//eSIM 단말모델조회 팝업화면 초기화
function initIntmMdlIdSearch() {

    clickModelInfo("");

    $("#noModelData").show(); // 2023-03-10 요청으로 인해 nodata영역 표시X -> nodata 문구를 없애는 방식으로 변경
    $("#noModelData").find(".card_nodata > p").css("display", "none");
    $("#modelData").hide();

    $.ohyLayer({
        content:"#intmMdlIdSearchLayer",
        type:'confirm',
        closeUse:true,
        closeAct:true,
    });

    // 통신사별
    // eSIM 단말모델코드 조회
    if($("#soId").val() == "01"){ //LGU+
        $(".btn_search .btn_type").on("click", function() {
            popSearchModel01();
        });
        $("#btnModelConfirm").removeAttr("onclick");
        $("#btnModelConfirm").attr("onclick", "popModelConfirm01();");
    }else{
        $(".btn_search .btn_type").on("click", function() {
            popSearchModel02();
        });
        $("#btnModelConfirm").removeAttr("onclick");
        $("#btnModelConfirm").attr("onclick", "popModelConfirm02();");
    }
}
//LGU 휴대폰 모델명 검색 팝업 조회
function popSearchModel01() {
	var modelNm = $("#popModelNm").val().trim();
	$("#popTmpModelNm").val(modelNm);

	if(modelNm.length < 2) { // 검색어 2자리 이상
        let opt = {
            msg: "모델명 2자리 이상 입력해 주세요.",
            cfrmYn : false
        }
        popalarm(opt);
		return;
	}
	
	$("#popModelList").empty();
	
	if($("#soId").val() == "01") { // U+

		$.ajax({
			type : "post",
			url : "/info/device/getDeviceModelList",
			data : {
				itemId : modelNm
			},
            beforeSend : function(xhr, set) {
                let token = $("meta[name='_csrf']").attr("content");
                let header = $("meta[name='_csrf_header']").attr("content");
                xhr.setRequestHeader(header, token);
            },
			success : function(data) {
                clickModelInfo("");
				if(data.result.length == 0) {
					$("#noModelData").show();
                    $("#noModelData").find(".card_nodata > p").css("display", "block");
					$("#modelData").hide();
					return;
				} else {
					$("#noModelData").hide();
					$("#modelData").show();
				}
				
				var html = "";
				$.each(data.result, function(index, item) {
                    html += "<div class='radio_item box_type' onClick=\"clickModelInfo('" + item.itemId + "');\">";
                    html += "    <input type='radio' id='" + item.itemId+ "' name='modelcode'>";
                    html += "    <label for='" + item.itemId+ "' class='label'>" + item.itemId + "(" + item.itemSdesc + ")" + "</label>";
                    html += "</div>";
				});

				$("#popModelList").append(html);

                // 첫번째 아이템 선택
				$(".radio_item.box_type").eq(0).click();
				$("input:radio[name=modelcode]").eq(0).prop("checked", true);
			},
	        error: function(request,status,error){
                let opt = {
                    msg: "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                }
                popalarm(opt);
	        }
		});
	} else {
        let opt = {
            msg: "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
            cfrmYn : false
        }
        popalarm(opt);
	}
}

//KT휴대폰 모델명 검색 팝업 조회
function popSearchModel02() {
	var modelNm = $("#popModelNm").val().trim();
	$("#popTmpModelNm").val(modelNm);

	if(modelNm.length < 2) { // 검색어 2자리 이상
        let opt = {
            msg: "모델명 2자리 이상 입력해 주세요.",
            cfrmYn : false
        }
        popalarm(opt);
		return;
	}
	
	$("#popModelList").empty();
	
	if($("#soId").val() == "02") { // KT, KT는 단말정보를 전문으로 제공함 최대 30건
		$("#popModelList").data("inqrBase", 0);
		$("#popModelList").data("nextSearch", "N");
		
		getKtModelList(modelNm, $("#popModelList").data("inqrBase"), $("#popModelList").data("inqrCascnt"), function(data) { // KT 단말목록조회
	    	clickModelInfo("");

			if(data.resultCode != "00000000") {
                $("#noModelData").show();
                $("#noModelData").find(".card_nodata > p").css("display", "block");
                $("#modelData").hide();

                let opt = {
                    msg: data.resultMessage,
                    cfrmYn : false
                }
                popalarm(opt);
				return;
			}
			
			if(data.data.mdlList.length == 0) {
                $("#noModelData").show();
                $("#modelData").hide();
				return;
			} else {
                $("#noModelData").hide();
                $("#modelData").show();
			}
			
			var html = "";

			$.each(data.data.mdlList, function(index, item) {
                html += "<div class='radio_item box_type' onClick=\"clickModelInfo('" + item.intmMdlNm + "', '" + item.intmMdlId + "');\">";
                html += "    <input type='radio' id='" + item.intmMdlNm+ "' name='modelcode'>";
                html += "    <label for='" + item.intmMdlNm+ "' class='label'>" + item.intmMdlNm + "(" + item.intmAliasNm + ")" + "</label>";
                html += "</div>";
			});
			
			$("#popModelList").append(html);

            // 첫번째 아이템 선택
            $(".radio_item.box_type").eq(0).click();
            $("input:radio[name=modelcode]").eq(0).prop("checked", true);
			
			if(data.data.mdlList.length == $("#popModelList").data("inqrCascnt")) {
				$("#popModelList").data("nextSearch", "Y");
				getNextKtModelList();
			}
		});
	} else {
        let opt = {
            msg: "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
            cfrmYn : false
        }
        popalarm(opt);
	}
}

//KT 단말목록조회
function getKtModelList(intmMdlNm, inqrBase, inqrCascnt, successCallback) {
	//isKtModelAjaxCall = true;
	$.ajax({
		type: 'POST',
		url : "/info/device/getKtModelList",
		data: {
			soId : '02',
			intmMdlNm : intmMdlNm,
			inqrIndCd : "B",
			inqrBase : inqrBase,
			inqrCascnt : inqrCascnt
		},
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },
	    success: function(data) {
	    	successCallback(data);
//	    	isKtModelAjaxCall = false;
	    },
	    error: function(e) {
            let opt = {
                msg: "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                cfrmYn : false
            }
            popalarm(opt);
//			isKtModelAjaxCall = false;
	    },
	});
}

//휴대폰 모델명 검색 팝업 모델 클릭 시 변경할 휴대폰 모델명 셋팅
function clickModelInfo(chgModelNm, intmMdlId) {
	if($("#soId").val() == "01") {// LGU
		$(".code_result_wrap .code").html(chgModelNm);
		$("#popChgModelNm").val(chgModelNm);
	} else if($("#soId").val() == "02") {// KT
		$(".code_result_wrap .code").html(chgModelNm);
		$("#popChgModelNm").val(chgModelNm);
		$("#popChgModelNm").data("intmMdlId", intmMdlId);
	}
}

//휴대폰 모델명 검색 팝업 확인
function popModelConfirm01() {
	var popChgModelNm = $("#popChgModelNm").val();

    if($("#modelData").css("display") == "none"){
        let opt = {
            msg: "조회된 데이터가 없습니다.",
            cfrmYn : false
        }
        popalarm(opt);
        return;
    }
	if(isEmpty(popChgModelNm)) {
        let opt = {
            msg: "휴대폰 모델명을 선택해 주세요.",
            cfrmYn : false
        }
        popalarm(opt);
	} else {
		modalLayer.hide();

		var param = new Object();
		var data = new Object();
		var Query = new Object();
		
		param.serviceId = 'APIM0049';
		Query.itemId = popChgModelNm;

		data.query = Query;
		param.data = data;
		
		$.ajax({
		    url:  '/appIf/v1/uplus/esb/' + param.serviceId,
		    type: 'POST',
		    data: fnSign(JSON.stringify(param)),
            beforeSend : function(xhr, set) {
                let token = $("meta[name='_csrf']").attr("content");
                let header = $("meta[name='_csrf_header']").attr("content");
                xhr.setRequestHeader(header, token);
            },
		    success: function(data){
				if(data.resultCode == 'N0000' || data.resultCode == '200'){
					var output = data.data.dsOutput;
					try{
						if( output.simPsblCode == '0002' || output.simPsblCode == '0003' ){
							$("#intmMdlId").val(popChgModelNm);
						} 
						else if(output.simPsblCode == '0004'){
                            let opt = {
                                msg: "가입이 불가능한 단말입니다.",
                                cfrmYn : false
                            }
                            popalarm(opt);
							return;
						}
						else{
                            let opt = {
                                msg: output.simPsblMessage,
                                cfrmYn : false
                            }
                            popalarm(opt);
							return;
						}
						
					}
					catch(e){
						console.log(e);
                        let opt = {
                            msg: "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                            cfrmYn : false
                        }
                        popalarm(opt);
						return;
					}
					
				} else {
                    let opt = {
                        msg: "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                        cfrmYn : false
                    }
                    popalarm(opt);
					return;
				}
		    },
		    error: function(e){
                let opt = {
                    msg: "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                }
                popalarm(opt);
		    	return;
		    },
		    complete: function() {
		    }
		});

	}
}

//KT 휴대폰 모델명 검색 팝업 확인
function popModelConfirm02() {
	var popChgModelNm = $("#popChgModelNm").val();

    if($("#modelData").css("display") == "none"){
        let opt = {
            msg: "조회된 데이터가 없습니다.",
            cfrmYn : false
        }
        popalarm(opt);
        return;
    }
	if(isEmpty(popChgModelNm)) {
        let opt = {
            msg: "휴대폰 모델명을 선택해 주세요.",
            cfrmYn : false
        }
        popalarm(opt);
	} else {
		modalLayer.hide();
		var vIntmMdlId = $("#popChgModelNm").data("intmMdlId");
		
		$.ajax({
			type: 'POST',
			url : "/info/esim/sendY12",
			data: {
				soId : $("#soId").val(),
				indCd : "1",
				intmMdlId : vIntmMdlId,
				intmSpecTypeCd : "108"
			},
            beforeSend : function(xhr, set) {
                let token = $("meta[name='_csrf']").attr("content");
                let header = $("meta[name='_csrf_header']").attr("content");
                xhr.setRequestHeader(header, token);
            },
		    success: function(res) {
		    	try{
		    		if(res.commHeader.responseType == "N") {
		    			var outDto = res.outDto;
		    			if(outDto != undefined && outDto != null) {
		    			
			    			var specSbstList = res.outDto.specSbstList;
			    			if(specSbstList == undefined || specSbstList == null) specSbstList = new Array();
			    			
			    			if(specSbstList.length > 0) {
			    				var isEsimAble = false;
			    				var pattern108 = /[A-Z]/;
			    				
			    				for(var i=0; i < specSbstList.length; i++) {
			    					if(pattern108.test(specSbstList[i].intmSpecSbst)) {
			    						isEsimAble = true;	    						
			    						break;
			    					}
			    				}
			    				
			    				if(isEsimAble) {
			    					$("#intmMdlId").val(vIntmMdlId);
			    				} else {
                                    let opt = {
                                        msg: "eSIM개통이 불가능한 단말입니다.",
                                        cfrmYn : false
                                    }
                                    popalarm(opt);
			    				}
			    			} else {
                                let opt = {
                                    msg: "eSIM개통이 불가능한 단말입니다.(02)",
                                    cfrmYn : false
                                }
                                popalarm(opt);
			    			}
		    			} else {
                            let opt = {
                                msg: "eSIM개통이 불가능한 단말입니다.(03)",
                                cfrmYn : false
                            }
                            popalarm(opt);
		    			}
					} else {
                        let opt = {
                            msg: "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                            cfrmYn : false
                        }
                        popalarm(opt);
		    		}
		    	} catch(e) {
					console.log(e);
                    let opt = {
                        msg: "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                        cfrmYn : false
                    }
                    popalarm(opt);
					return;
				}
		    },
		    error: function(e) {
                let opt = {
                    msg: "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.",
                    cfrmYn : false
                }
                popalarm(opt);
		    },
		});
	}
}

// KT 휴대폰 모델명 목록 스크롤
function getNextKtModelList() {

    if($("#soId").val() == "02") { // KT인 경우에만
        if($("#popModelList").data("nextSearch") == "Y") {
            //다음 페이지가 있는 경우 전체 조회하도록 변경
            //if(isKtModelAjaxCall) {
            var inqrBase = $("#popModelList").data("inqrBase");
            $("#popModelList").data("inqrBase", inqrBase + 1);

            getKtModelList($("#popTmpModelNm").val(), $("#popModelList").data("inqrBase"), $("#popModelList").data("inqrCascnt"), function(data) { // KT 단말목록조회
                $("#popModelList").data("nextSearch", "N");
                if(data.resultCode != "00000000") {
                    return;
                }

                if(data.data.mdlList.length == 0) {
                    return;
                }

                var html = "";
                $.each(data.data.mdlList, function(index, item) {
                    html += "<div class='radio_item box_type' onClick=\"clickModelInfo('" + item.intmMdlNm + "', '" + item.intmMdlId + "');\">";
                    html += "    <input type='radio' id='" + item.itemId+ "' name='modelcode'>";
                    html += "    <label for='" + item.itemId+ "' class='label'>" + item.intmMdlNm + "(" + item.intmAliasNm + ")</label>";
                    html += "</div>";
                });

                $("#popModelList").append(html);

                if(data.data.mdlList.length == $("#popModelList").data("inqrCascnt")) {
                    $("#popModelList").data("nextSearch", "Y");
                    getNextKtModelList();
                }
            });
           // }
        }
    }
}
// 한글, 특문 제외,영문대문자
function noHangul(obj) {
	$(obj).val($(obj).val().toUpperCase());
    $(obj).val( $(obj).val().replace( /[^A-za-z0-9|\-]/gi, '' ) );
}
//END : eSIM 단말모델 조회 관련 스크립트 ------------------------------------------

//select box - popup
//부모창의 hidden component id : {compId}
//부모창의 버튼 id : btn_{compId}
//팝업창의 ul list id : {compId}_list
function setSelectPopup(compId) {
    //현재 오픈된 레이어팝업에서 선택한 요소를 선택하도록 변경
    //var selValue = $("#" + compId + "_list").find(".on > a");
    var selValue = $(document).find(".layer_wrap.open.bottom").find(".on > a");

    if(selValue.attr("value") == undefined) {
        let opt = {
            msg: "선택된 항목이 없습니다.",
            cfrmYn : false
        }
        popalarm(opt);
        return;
    } else {
        $("#btn_" + compId).text(selValue[0].text);
        $("#" + compId).val(selValue.attr("value"));
        $("#" + compId).change(); // change 이벤트 발생

		modalLayer.hide();
    }
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