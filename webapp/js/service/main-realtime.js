// 실시간 사용량 표시
function showRtUseValue(svcInfo) {
	if(svcInfo.soId == "01") { // U+
		uplus_showRtUseValue(svcInfo);
	} else if(svcInfo.soId == "02") {
		kt_showRtUseValue(svcInfo); // KT
	} else if(svcInfo.soId == "03") {
		sk_showRtUseValue(svcInfo); // SK
	}
}

// U+ 실시간 사용량 표시
function uplus_showRtUseValue(svcInfo) {
	// var packetMain = {label : "데이터", alloValue : 157286400, useValue : 78643200};
	// var packetAdd = {label : "데이터", alloValue : 2048000, useValue : 3600000}; // 초과
	// var dataVoice = {label : "음성", alloValue : 36000, useValue : 600};
	// var dataSms = {label : "문자", alloValue : 100, useValue : 105};
	// var dataVideo = {label : "영상/부가음성", alloValue : 1200, useValue : 600};
	
	// showChart("packetMain", packetMain.label, getChartPacketData(packetMain.alloValue, packetMain.useValue, packetAdd.alloValue, packetAdd.useValue)); // 패킷 데이터 메인 차트	
	// showChart("dataVoice", dataVoice.label, getChartVoiceData(dataVoice.alloValue, dataVoice.useValue)); // 음성 차트
	// showChart("dataSms", dataSms.label, getChartSmsData(dataSms.alloValue, dataSms.useValue)); // 문자 차트

	var packetSub = {label : "데이터", alloValue : 0, useValue : 0};
	var packetMain = {label : "데이터", alloValue : 0, useValue : 0};
	var packetAdd = {label : "추가 데이터", alloValue : 0, useValue : 0};
	var dataVoice = {label : "음성", alloValue : 0, useValue : 0};
	var dataSms = {label : "문자", alloValue : 0, useValue : 0};
	var dataVideo = {label : "영상/부가음성", alloValue : 0, useValue : 0};
	
	uplusCM559(svcInfo.svcTelNo, function(cm559Data) {		
		if(cm559Data.resultCode == "00000" || cm559Data.resultCode == "N0000") {
			var custInfo = cm559Data.data.RetrieveCustInfoSvcAddvBDResponse.ResponseRecord.ResponseBody;
			var prodNo = custInfo.DsCustInfoOutVO.prodNo;
			var aceno = custInfo.DsCustInfoOutVO.aceno;
			var entrNo = custInfo.DsCustInfoOutVO.entrNo;
			var billAcntNo = custInfo.DsCustInfoOutVO.billAcntNo;

			var dsSvcInfoArray = custInfo.DsSvcInfoOutVO;
			var mnoProdCd = "";
			
			$.each(dsSvcInfoArray, function(index, item) {
				if(item.svcKdCd == "P") { // 사용중인 기본 요금제
					mnoProdCd = item.svcCd; 
					return false; 
				}
			});				
			
			getServerNow(function(serverNowData) { 
				
				uplusAPIM0030(prodNo, aceno, entrNo, billAcntNo, serverNowData.curdttm.substring(0, 6), "1", function(apim30Data) {
					var dsGetEntrSvcSmry = [];
					
					if(apim30Data.resultCode != "200") {
						//popalarm({msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", cfrmYn : false});
						//popalarm({msg : "통신사와 전문 통신간 오류가 발생하였습니다.", cfrmYn : false});
						doDrawEmptyData();
						return;
					}
					
					try{
						dsGetEntrSvcSmry = apim30Data.data.dsGetEntrSvcSmry;
					} catch(e){

					}
					
					//실시간 사용량 데이터 없을 경우 그래프 "-"로 표시
					if(!isEmpty(dsGetEntrSvcSmry) && isEmpty(dsGetEntrSvcSmry[0])){
						doDrawEmptyData();
						return;
					}

					var existVC = false; // 음성 유무
					$.each(dsGetEntrSvcSmry, function(index, item) {
						if(item.svcTypCd == "PT" && item.prodTypeCd == "B1") {
							
							if(item.svcCd == "LRZ0001832"){  // Flex 요금제 패킷 Qos 데이터
								packetMain.alloValue = item.alloValue;
								packetMain.useValue = item.useValue;
							}else if(item.svcCd == "LRZ0004255" || item.svcCd == "LRZ0002164"){ // 패킷 추가 데이터. LRZ0004255 : MVNO 무료 50GB DATA, LRZ0002164 : MVNO 무료 150GB DATA
								packetAdd.alloValue = item.alloValue;
								packetAdd.useValue = item.useValue;
							}else{// 그외 요금제
								//일 추가 데이터 표시
								packetAdd.alloValue = item.alloValue;
								packetAdd.useValue = item.useValue;
							}

						} else if(item.svcTypCd == "PT" && (item.prodTypeCd == "A2" || item.prodTypeCd == "A1")) { // 패킷 데이터
							packetMain.alloValue = item.alloValue;
							packetMain.useValue = item.useValue;
						} else if(item.svcTypCd == "VC" && item.prodTypeCd == "A1") { // 음성
							dataVoice.alloValue = item.alloValue;
							dataVoice.useValue = item.useValue;
						} else if(item.svcTypCd == "SS" && item.prodTypeCd == "A1") { // 문자
							dataSms.alloValue = item.alloValue;
							dataSms.useValue = item.useValue;
						} else if(item.svcTypCd == "VM" && item.prodTypeCd == "A1") { // 영상/부가전화
							dataVideo.alloValue = item.alloValue;
							dataVideo.useValue = item.useValue;
						}
						
						if(item.svcTypCd == "VC") { // VC 음성 존재 확인
							existVC = true;
						}
					});
					
					// VC 음성 없으면 VM 영상/부가전화 데이터를 VC 음성으로 표시
					if(!existVC) {
						dataVoice.alloValue = dataVideo.alloValue;
						dataVoice.useValue = dataVideo.useValue;
						dataVideo.alloValue = 0;
						dataVideo.useValue = 0;
					}
					
					// 사용중 요금제가 Flex 요금제면 Qos 데이터 사용량 데이터 차트 추가 표시
					// 대신 메인 데이터 사용량을 추가 차트에 표시하고 Qos 데이터 사용량을 메인 데이터 차트에 표시
					if(mnoProdCd == "LPZ0016180") {
						var tempAlloValue = packetMain.alloValue;
						var tempUseValue = packetMain.useValue;
						
						packetMain.alloValue = packetSub.alloValue;
						packetMain.useValue = packetSub.useValue;
						
						packetSub.alloValue = tempAlloValue;
						packetSub.useValue =  tempUseValue;
						
						var packetMainData = getChartPacketData(packetMain.alloValue, packetMain.useValue, packetAdd.alloValue, packetAdd.useValue);
						
						packetMainData.alloText = packetMainData.alloText.replaceAll("월", "일"); // Qos 제공량 문구 맨 앞에 '매일' 문구 추가
						
						showChart("packetMain", packetMain.label, packetMainData); // 패킷 데이터 메인 차트
					} else {
						showChart("packetMain", packetMain.label, getChartPacketData(packetMain.alloValue, packetMain.useValue, packetAdd.alloValue, packetAdd.useValue)); // 패킷 데이터 메인 차트	
					}
					
					showChart("dataVoice", dataVoice.label, getChartVoiceData(dataVoice.alloValue, dataVoice.useValue)); // 음성 차트
					showChart("dataSms", dataSms.label, getChartSmsData(dataSms.alloValue, dataSms.useValue)); // 문자 차트
				});
			});
		}else{
			//popalarm({msg : "통신사와 전문 통신간 오류가 발생하였습니다.", cfrmYn : false});
			doDrawEmptyData();
		}
	});
}

//실시간 사용량 데이터 없을 경우
function doDrawEmptyData(){

	//데이터
	let water = $("#packetMain").find('.wave_water')[0];
	water.style.transform = 'translate(0, 110%)';

	$("#packetMain").find('.wave_value').html('-');
	$("#packetMain").find('.data-max').text('-');

	$("#mainLabel").find('.data-val').text('');
	$("#mainLabel2").hide();

	//음성
	water = $("#dataVoice").find('.wave_water')[0];
	water.style.transform = 'translate(0, 110%)';

	$("#dataVoice").find('.wave_value .data-val').text('-');
	$("#dataVoice").find('.data-max').text('');
	
	$("#voice-data-text1").show();
	$("#voice-data-text2").hide();	

	//문자
	water = $("#dataSms").find('.wave_water')[0];
	water.style.transform = 'translate(0, 110%)';

	$("#dataSms").find('.wave_value .data-val').text('-');	
	$("#dataSms").find('.data-max').text('');
	
	$("#sms-data-text1").show();
	$("#sms-data-text2").hide();		
	
}

// KT 실시간 사용량 표시
function kt_showRtUseValue(svcInfo) {
	getCtrtRatePlanInfo(svcInfo.soId, svcInfo.ctrtId, function(dataProd) { // 현재 요금제 조회
		var packetSub = {label : "데이터", alloValue : 0, useValue : 0};
		var packetMain = {label : "데이터", alloValue : 0, useValue : 0};
		var packetAdd = {label : "추가 데이터", alloValue : 0, useValue : 0};
		var dataVoice = {label : "음성", alloValue : 0, useValue : 0};
		var dataSms = {label : "문자", alloValue : 0, useValue : 0};
		var dataVideo = {label : "영상/부가음성", alloValue : 0, useValue : 0};
		
		getKtTotUseTime(svcInfo.svcTelNo, svcInfo.mvnoCustId, svcInfo.serviceId, function(data) {
			
			if(!isEmpty(data.info)) {
				if(data.info.commHeader.responseType == "N") { // 응답 성공
					var totalUseTimeDto = data.info.outDto.totalUseTimeDto;
				
					//실시간 사용량 데이터 없을 경우 그래프 "-"로 표시
					if(isEmpty(totalUseTimeDto)){
						doDrawEmptyData();		
						return;
					}

					$.each(totalUseTimeDto, function(index, item) {
						if(item.strBunGun == "P" && item.strSvcName == "데이터-합계") { // 패킷 데이터
							packetMain.alloValue = item.strFreeMinTotal/2; // KT는 제공량 나누기 2
							packetMain.useValue = item.strFreeMinUse/2; // KT는 사용량 나누기 2
						} else if(item.strBunGun == "V" && item.strSvcName != "지정번호통화") { // 음성
							dataVoice.alloValue += isEmpty(item.strFreeMinTotal) ? 0 : Number(item.strFreeMinTotal);
							dataVoice.useValue += isEmpty(item.strFreeMinUse) ? 0 : Number(item.strFreeMinUse);
						} else if(item.strBunGun == "D" && item.strSvcName == "SMS/MMS") { // 문자
							dataSms.alloValue = item.strFreeMinTotal;
							dataSms.useValue = item.strFreeMinUse;
						} else if(item.strBunGun == "U") { // 영상/부가전화
							dataVideo.alloValue = item.strFreeMinTotal;
							dataVideo.useValue = item.strFreeMinUse;
						}
					});
				}else{
					doDrawEmptyData();		
					return;
				}
			}else{
				//popalarm({msg : "통신사와 전문 통신간 오류가 발생하였습니다.", cfrmYn : false});
				doDrawEmptyData();
				return;
			}

			//LTE 일5GB+(시즌)(KT망) [PD00000704], LTE무제한 일5GB+(왓챠)(KT망) [PD00000910]
			//위 두 요금제의 경우 제공량 앞에 문구를 '일'로 표시한다.
			
			var packetMainData = getChartPacketData(packetMain.alloValue, packetMain.useValue, packetAdd.alloValue, packetAdd.useValue);
			
			var svcInfo = JSON.parse($("#userMajorSvc").attr("data-map").replace(/'/gi, "\""));			

			if(svcInfo.prodCd == 'PD00000704' || svcInfo.prodCd == 'PD00000910'){
				packetMainData.alloText = packetMainData.alloText.replaceAll("월", "일"); // Qos 제공량 문구 맨 앞에 '매일' 문구 추가
			} 

			showChart("packetMain", packetMain.label, packetMainData); // 패킷 데이터 메인 차트
			showChart("dataVoice", dataVoice.label, getChartVoiceData(dataVoice.alloValue, dataVoice.useValue)); // 음성 차트
			showChart("dataSms", dataSms.label, getChartSmsData(dataSms.alloValue, dataSms.useValue)); // 문자 차트
			
		});
	});
}

// SKT 실시간 사용량 표시
function sk_showRtUseValue(svcInfo) {
	var packetSub = {label : "데이터", alloValue : 0, useValue : 0};
	var packetMain = {label : "데이터", alloValue : 0, useValue : 0};
	var packetAdd = {label : "추가 데이터", alloValue : 0, useValue : 0};
	var dataVoice = {label : "음성", alloValue : 0, useValue : 0};
	var dataSms = {label : "문자", alloValue : 0, useValue : 0};
	var dataVideo = {label : "영상/부가음성", alloValue : 0, useValue : 0};
	
	getSktTotUseTime(svcInfo.serviceId, function(data) {
	 	if(!isEmpty(data.useInfo) && !isEmpty(data.alloInfo)) {
	 		if(data.useInfo.rcClCd == "00" && data.alloInfo.rcClCd == "00") {

				if(isEmpty(data.alloInfo.dedtRecList)){
					doDrawEmptyData();
					return;
				}

				// 제공량
				$.each(data.alloInfo.dedtRecList, function(index, item) {
					if($("#sktVoiceSkipCodes").val().indexOf(item.skipCode) > -1) { // 음성
						dataVoice.alloValue = item.totalQty.replace(/,/g, "");
					} else if($("#sktSmsSkipCodes").val().indexOf(item.skipCode) > -1) { // 문자
						dataSms.alloValue = item.totalQty.replace(/,/g, "");
					} else if($("#sktDataSkipCodes").val().indexOf(item.skipCode) > -1) { // 데이터
						packetMain.alloValue = item.totalQty.replace(/,/g, "");
					}
				});
				
				// 사용량
				$.each(data.useInfo.usageRecList, function(index, item) {
					if(item.itmClCd == "1") { // 음성
						dataVoice.useValue = item.totUseQty;
					} else if(item.itmClCd == "2") { // 문자
						dataSms.useValue = item.totUseQty;
					} else if(item.itmClCd == "3") { // 데이터
						packetMain.useValue = item.totUseQty;
						packetMain.useValue = Math.floor(Number(packetMain.useValue) / 10); // 2022.10.20 EIGW5210 사용량조회 전문 중 데이터 사용량 10으로 나눈 후 절사
					}
				});
			}else{
				doDrawEmptyData();
				return;
			}
		}else{
			//popalarm({msg : "통신사와 전문 통신간 오류가 발생하였습니다.", cfrmYn : false});
			doDrawEmptyData();
			return;
		}
		
		showChart("packetMain", packetMain.label, getChartPacketData(packetMain.alloValue, packetMain.useValue, packetAdd.alloValue, packetAdd.useValue));
		showChart("dataVoice", dataVoice.label, getChartVoiceData(dataVoice.alloValue, dataVoice.useValue));
		showChart("dataSms", dataSms.label, getChartSmsData(dataSms.alloValue, dataSms.useValue));
	});	
}

// 차트 패킷 정보 리턴(제공량, 사용량, 초과량)
function getChartPacketData(alloValue, useValue, addAlloValue, addUseValue) {
    console.log("getChartPacketData : alloValue = " +  alloValue + ", useValue = " + useValue);
	
    alloValue = isEmpty(alloValue) ? 0 : alloValue;
	useValue = isEmpty(useValue) ? 0 : useValue;
    
    var restValue = 0;
	
    var data = {
		alloValue : 0,
		alloText : "",
		useValue : 0,
		useText : "",
        restValue : 0,
        restText : "",
		overValue : 0,
		overText : "",
        addAlloValue : 0,
        addAlloText : 0,
	};

	if(alloValue == "Z" || alloValue == "999999999" || alloValue == "999999998" || alloValue == "무제한") { // 무제한
		data.alloText = alloValue;
	} else {
        restValue = alloValue - useValue ;
		data.alloValue = packetKBtoMB(alloValue);
		data.alloText = "월" + packetFormatterMain(alloValue);
	}

	data.useValue = packetKBtoMB(useValue);
	data.useText = packetFormatterMain(useValue);

	data.overValue = packetKBtoMB(overData(alloValue, useValue));
	data.overText = packetFormatterMain(overData(alloValue, useValue));

    data.restValue = packetKBtoMB(restValue);
    data.restText = packetFormatterMain(restValue);

	//추가 데이터가 존재하는 경우
	if(restValue <= 0 && addAlloValue > 0){
		data.addAlloValue = packetKBtoMB(addAlloValue);
		data.addAlloText = packetFormatterMain(addAlloValue);
	}

    // //무제한 데이터인 경우 추가 데이터 체크
    // if(alloValue == "Z" || alloValue == "999999999" || alloValue == "999999998" || alloValue == "무제한") { // 무제한
    //     //무제한 데이터 소진 한 경우
    //     if(restValue <= 0 ){
    //         data.addAlloValue = packetKBtoMB(addAlloValue);
	// 	    data.addAlloText = packetFormatterMain(addAlloValue);
    //     }
    // }

	return data;
}

// 차트 음성 또는 영상, 부가전화 정보 리턴(제공량, 사용량, 초과량)
function getChartVoiceData(alloValue, useValue) {
	alloValue = isEmpty(alloValue) ? 0 : alloValue;
	useValue = isEmpty(useValue) ? 0 : useValue;
	var restValue = alloValue - useValue ;

	var data = {
		alloValue : 0,
		alloText : "",
		useValue : 0,
		useText : "",
        restValue : 0,
        restText : "",
		overValue : 0,
		overText : ""
	};

	if(alloValue == "Z" || alloValue == "999999999" || alloValue == "999999998" || alloValue == "무제한") { // 무제한
		data.alloText = '무제한';
	} else {
		data.alloValue = alloValue;
		data.alloText = callFormatterMain(alloValue);
	}
	
	data.useValue = useValue;
	data.useText = callFormatterMain(useValue);
	
	data.overValue = overData(alloValue, useValue);
	data.overText = callFormatterMain(overData(alloValue, useValue));

    data.restValue = restValue;
	data.restText = callFormatterMain(restValue);
	
	return data;
}

// 차트 문자 정보 리턴(제공량, 사용량, 초과량)
function getChartSmsData(alloValue, useValue) {
	alloValue = isEmpty(alloValue) ? 0 : alloValue;
	useValue = isEmpty(useValue) ? 0 : useValue;
	var restValue = alloValue - useValue ;

	var data = {
		alloValue : 0,
		alloText : "",
		useValue : 0,
		useText : "",
		overValue : 0,
		overText : ""
	};    
	
	if(alloValue == "Z" || alloValue == "999999999" || alloValue == "999999998" || alloValue == "무제한") { // 무제한
		data.alloText = '무제한';
	} else {
		data.alloValue = alloValue;
		data.alloText = alloValue + "건";
	}
	
	data.useValue = useValue;
	data.useText = useValue + "건";
	
	data.overValue = overData(alloValue, useValue);
	data.overText = overData(alloValue, useValue) + "건";

    data.restValue = restValue;
	data.restText = restValue + "건";    
	
    return data;
}

// 차트 표시
function showChart(chartId, label, data) {
	var cutomTxt_labelValue = data.alloText;
	var cutomTxt_PieValue = data.useText;	
	
	var type = "";
	if(data.alloText == "Z" || data.alloText == "999999999" || data.alloText == "999999998" || data.alloText == "무제한") {
		
        type = "무제한";

		cutomTxt_labelValue = ""; // type이 무제한이면 차트 스크립트에서 제공량 문구를 무제한으로 표시함
	} else if(data.overValue > 0) {
		type = "초과";
		cutomTxt_PieValue = data.overText;
	} else if(label === "데이터" && data.restValue <= 0 && data.addAlloValue > 0) {
		type = "추가"; 
	}
	
    data.type = type;
    
    if(chartId == "packetMain"){
       waveChartData('#' + chartId, data);    
    }else if(chartId == "dataVoice" || chartId == "dataSms"){
        waveChartEtc('#' + chartId, data);
    }
}


// 패킷 데이터 KB -> MB, GB 변환 + 단위명
function packetFormatterMain(kb) {
	var mb = kb/1024;
	return (mb>=1000 ? Math.floor((mb/1024))+"GB" : Math.floor(mb)+"MB");
}

//초 -> x분 x초 변환
function callFormatterMain(sec) {
	var str = ""
	var minutes = parseInt(sec/60);
	//var seconds = parseInt(sec%60);
	
	if(minutes > 0) {
		str += minutes + "분";
	}

	// if(!(minutes > 0 && seconds == 0)) {
	// 	str += seconds + "초";
	// }	
	
	return str;
}

function waveChartData(obj, data) {
    
    var _this = $(obj);

    _this.find('.data-max').text(data.alloText);

    if(data.restValue > 0 && data.restValue <= data.alloValue) {
        _this.find('.data-val').text(data.restText);

        var cent = Math.floor((data.restValue * 100) / data.alloValue);
        var water = _this.find('.wave_water')[0];
        var percent = 0;
        var interval;
        interval = setInterval(function () {
            percent++;
            water.style.transform = 'translate(0' + ',' + (100 - percent) + '%)';
            if (percent == 60) {
                _this.find('.wave_value').css('color', '#fff');
            }
            if (percent == cent) {
                clearInterval(interval);
            }
        }, 40);
    } else if(data.restValue <= 0 || data.restValue  > data.alloValue) {
        
        var water = _this.find('.wave_water')[0];
        water.style.transform = 'translate(0, 110%)';
        
        if(data.type == "추가") {
            //추가데이터가 있는 경우
            let html = '<dl>' +
                            '<dt>추가데이터</dt>' +
                            '<dd><span>일</span><span>' + data.addAlloText +  '</span></dd>'+
                        '</dl>';

            _this.find('.wave_value').html('').append(html);  
			
			//남은 데이터가 0인 경우 뒤에 단위 붙여준다      
			_this.find('.data-val').text("0" + data.alloText.slice(-2));
        
        }else{
            //데이터 모두 소진인 경우
            _this.find('.wave_value').addClass('zero');
            _this.find('.wave_value .data-val').text('소진');

			//남은 데이터가 0인 경우 뒤에 단위 붙여준다
			_this.find('.data-val').text("0" + data.alloText.slice(-2));
        } 
    }
    // 무제한 요금제 : 데이터, 추가데이터 데이터 잔여량 0 "소진"으로 표기 (val <= 0)
    // 제한 요금제 : 데이터 초과량기재 (val > max)
}

function waveChartEtc(obj, data) {
    
    var _this = $(obj);

    _this.find('.data-max').text(data.alloText);

    if(data.type ==="무제한"){        
        
        _this.find('.wave_value .data-val').text('');
        _this.find('.wave_value em').text('무제한');

        if(obj == "#dataVoice"){
            $("#voice-data-text1").show();
            $("#voice-data-text2").hide();
        }else if(obj == "#dataSms"){
            $("#sms-data-text1").show();
            $("#sms-data-text2").hide();
        }        

        var cent = Math.floor((100 * 100) / 100);
        var water = _this.find('.wave_water')[0];
        var percent = 0;
        var interval;
        
        interval = setInterval(function () {
            percent++;
            water.style.transform = 'translate(0' + ',' + (100 - percent) + '%)';
            if (percent == 60) {
                _this.find('.wave_value').css('color', '#fff');
            }
            if (percent == cent) {
                clearInterval(interval);
            }
        }, 40);

    }else{
        if(data.restValue > 0 && data.restValue <= data.alloValue) {
            _this.find('.data-val').text(data.restText);
    
            var cent = Math.floor((data.restValue * 100) / data.alloValue);
            var water = _this.find('.wave_water')[0];
            var percent = 0;
            var interval;
            interval = setInterval(function () {
                percent++;
                water.style.transform = 'translate(0' + ',' + (100 - percent) + '%)';
                if (percent == 60) {
                    _this.find('.wave_value').css('color', '#fff');
                }
                if (percent == cent) {
                    clearInterval(interval);
                }
            }, 40);
        } else if(data.restValue <= 0 || data.restValue  > data.alloValue) {
            var water = _this.find('.wave_water')[0];
            water.style.transform = 'translate(0, 110%)';
    
            _this.find('.wave_value').addClass('zero');
            _this.find('.wave_value .data-val').text('');
            _this.find('.wave_value em').text('소진');

			//남은 데이터가 0인 경우 뒤에 단위 붙여준다
			_this.find('.wave_label .data-val').text("0" + data.alloText.slice(-1));
        }
    }

    // 무제한 요금제 : 데이터, 추가데이터 데이터 잔여량 0 "소진"으로 표기 (val <= 0)
    // 제한 요금제 : 데이터 초과량기재 (val > max)
}

// 서버 시간 리턴
function getServerNow(successCallback) {
	$.ajax({
	    url:  '/system/main/getServerNow',
	    type: 'POST',
	    success: function(data) {
	    	successCallback(data);
	    },
	    error: function(e) {
			popalarm({msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", cfrmYn : false});
	    },
	});
}

// U+ CM559
function uplusCM559(svcTelNo, successCallback) {
	
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
		success: function(data) {
			successCallback(JSON.parse(fnUnSign(data.enc)));
		},
		error: function(request,status,error){
			//popalarm({msg : "통신사와 전문 통신간 오류가 발생하였습니다.", cfrmYn : false});
		}
	});	
}

// KT 실시간사용량 조회
function getKtTotUseTime(svcTelNo, mvnoCustId, serviceId, successCallback) {

    $.ajax({
		type: 'POST',
		url: "/change/rateplan/rateplan/getKtTotUseTime",
		data : {
			svcTelNo : svcTelNo,
			mvnoCustId : mvnoCustId,
			serviceId : serviceId
		},
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },        
		success: function(data) {
			successCallback(data);
		},
		error: function(request,status,error){
			popalarm({msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", cfrmYn : false});
		}
	});
}


// SKT 실시간사용량 조회
function getSktTotUseTime(serviceId, successCallback) {
	$.ajax({
		type: 'POST',
		url: "/change/rateplan/rateplan/getSktTotUseTime",
		data : {
			serviceId : serviceId
		},
        beforeSend : function(xhr, set) {
            let token = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhr.setRequestHeader(header, token);
        },     		
		success: function(data) {
			successCallback(data);
		},
		error: function(request,status,error){
			popalarm({msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", cfrmYn : false});
		}
	});
}

// U+ APIM0030
function uplusAPIM0030(prodNo, aceno, entrNo, billAcntNo, callYyyymm, wrkTypCd, successCallback) {
	var serviceId = "APIM0030";
	var nextOperatorId = "1100000288"; // 처리자 ID

	var base = new Object();
	base.serviceId = serviceId;

	var data = new Object();

	var Header = new Object();
	Header.prodNo = btoa(prodNo);             //상품번호
	Header.entrCntcId = btoa(aceno);          //가입계약ID
	Header.entrId = btoa(entrNo);             //가입ID
	Header.billAcntId = btoa(billAcntNo);     //청구계정ID
	//Header.xUserID = nextOperatorId;                                 //처리자ID

	data.header = Header;
	//RequestRecord.RequestBody = RequestBody;

	var Query = new Object();
	Query.callYyyymm = callYyyymm;                                   //통화년월
	Query.wrkTypCd = wrkTypCd;                                   //업무구분코드
	Query.mrktId = "KBM";                                        //마켓ID

	data.query = Query;
	base.data = data;

	$.ajax({
		type: 'POST',
		url: '/appIf/v1/uplus/esb/' + serviceId,
		data: fnSign(JSON.stringify(base)),
		contentType: 'application/json; charset=utf-8',
		cache: false,
		dataType: "json",
		success: function(data) {
			successCallback(data);
		},
		error: function(request,status,error){
			popalarm({msg : "일시적으로 오류가 발생하였습니다. 다시 시도해 주세요.", cfrmYn : false});
		}
	});
}

// 요금제 정보 조회
function getRatePlanInfo(soId, mnoProdCd, successCallback) {

    var param =  {
                    soId : soId,
                    mnoProdCd : mnoProdCd,
                    mstrFlYn : "N"
                }
    fn_transCall("/change/rateplan/rateplan/getRatePlanInfo", param, successCallback);
}



// 계약 요금제 정보 조회
function getCtrtRatePlanInfo(soId, ctrtId, successCallback) {

    var param =  {
                    soId : soId,
                    ctrtId : ctrtId
                }
    fn_transCall("/change/rateplan/rateplan/getCtrtRatePlanInfo", param, successCallback);
}