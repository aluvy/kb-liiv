/**
 * @name	jQuery.AmbGraph
 @author	@mo, @jsl, @ohy ( http://www.ntels.com/ )
 *
 * @version	1.0.0
 * @since	202203
 *
 * @example
 
	$("#target").AmbGraph({
		cName : vertical,     // style (현재: dataBar , vertical )
		customCss: null,  // custom css가 필요할 경우 class명
		speed : 50,       // ani 속도 단위 ms // 최소 100 
		setUnit :{
			text : null,  // 단위 표시 필요시
			position : null, // 단위 위치 (left or right)
		},

		data : null       // 불러올 data arrry
	});

**/


////////////////////////////////////////////////
(function (factory) {
	"use strict";

	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(jQuery);
	}
}(function ($) {
	"use strict";

	$.fn.AmbGraph = function (settings) {

		$.fn.AmbGraph.defaults = {

			cName : null,     // style (현재: dataBar , vertical)
			customCss: null,  // custom css가 필요할 경우 class명
			speed : 50,       // ani 속도 단위 ms // 최소 100 
			setUnit :{
				text : null,  // 단위 표시 필요시
			},

			data : null       // 불러올 data arrry
		};
		
		var opts = $.extend(true, {}, $.fn.AmbGraph.defaults, settings);				
		
		return this.each(function () {					
			var _this = this;

			$.fn.extend(this, AmbGraph);
			this.opts = opts;
			this.init();
		});
	
	};

	var AmbGraph = {
		init : function () {			
			var _this = this;	
			
			this.tg =  $(this);

			this.data =   this.opts.data;
			this.cnt =    this.data.length;

			this.speed =  this.opts.speed;
			this.cName =  this.opts.cName;
			this.customCss =  this.opts.customCss;

			this.maxNum = null;

			////
			var makeWrap = '<ul class="barChart"></ul>';
			this.tg.append(makeWrap);

			///// cName
			if(this.opts.cName) {
				var cName = this.opts.cName;
				this.tg.find(' > ul.barChart').addClass(cName);
				/**/
				if(cName == 'barChart'){
					setTimeout(function(){ _this.moveNum(); }, 10);
				}
				
			}

			///// customCss
			if(this.opts.customCss) {
				var customCss = this.opts.customCss;
				this.tg.addClass(customCss);
			}

			///// speed
			if(this.opts.speed) {
				var speed = (this.speed > 100) ? this.speed : '100';
				this.tg.find('.unit .graph>em').css({
					'transition-duration': speed+'ms',
				}); 						
			}

			///// data
			if(this.opts.data) {
				for( var i=0; i< this.cnt; i++){	// 최대값 추출						
					if (!maxNum) {
						var maxNum = this.data[i].value;
					};					
					if (maxNum < this.data[i].value) {
						var maxNum = this.data[i].value;
					}
				}
				
				if(cName == 'dataBar'){
					for(var i=0; i< this.cnt; i++){
						var label = this.data[i].label;
						var type =  (this.data[i].type) ? this.data[i].type : '';
						var unit =  (this.data[i].unit) ? this.data[i].unit : '';
						
						var barColor = (this.data[i].barColor) ? this.data[i].barColor : '';
						var bgColor = (this.data[i].bgColor) ? this.data[i].bgColor : ''; // 2023 커스텀
						
						var max; // 총
						var used; // 사용
						var charge; // 잔여
						
						if(this.data[i].type == 'time'){
							var used = '시간';
						} else {
							var used = this.data[i].used + unit;
						}
						if(this.data[i].max == '무제한'){
							var max = '무제한';
						} else if(this.data[i].max == '기본제공') {
							var max = '기본제공';
						} else {
							// 2023 커스텀
							// var max = '총' + this.data[i].max + unit;
							var max = this.data[i].max + unit;
							var charge = this.data[i].max - this.data[i].used;
						}
						
						var makeHtml = "";
							makeHtml += '<li class="unit" data-type="'+type+'" data-label="'+label+'" data-unit="'+unit+'" data-max="'+this.data[i].max+'" data-value="'+this.data[i].used+'" data-charge="'+charge+'">';
							makeHtml += 	'<dl ambGraph-DataText>';
							makeHtml += 		'<dt>'+label+'</dt>';
							makeHtml += 		'<dd>';
							// 2023 커스텀 "value", "max" 순서변경 및 텍스트 삭제
							// makeHtml += 			'<span class="value">'+used+' 사용</span>';
							makeHtml += 			'<span class="value">'+used+'</span>';
							makeHtml += 			'<span class="max">'+max+'</span>';
							makeHtml += 		'</dd>';	
							makeHtml += 	'</dl>';
							makeHtml += 	'<span class="graph" style="background-color:'+bgColor+'"><em style="right:100%; background-color:'+barColor+'"></em></span>';
							// 2023 커스텀
							// makeHtml += 	'<p ambGraph-ExText style="color:'+barColor+'"></p>';
							makeHtml += '</li>';
							
						this.tg.find('.barChart').append(makeHtml);
						
						setTimeout(function(){ _this.setAniDataBar(); }, 1);
						setTimeout(function(){ _this.changeDateFormat(); }, 10);
						setTimeout(function(){ _this.exTextMaker(); }, 10);
					}
				} else {
					for(var i=0; i< this.cnt; i++){
						var label = this.data[i].label;
						var type =  (this.data[i].type) ? this.data[i].type : '';
						var unit =  (this.data[i].unit) ? this.data[i].unit : '';
						var dataType =  (this.data[i].dataType) ? this.data[i].dataType : '';
						
						var barColor = (this.data[i].barColor) ? this.data[i].barColor : '';

						var addClass;
						var textColor;

						if(type == 'everage'){
							var addClass = 'everage';
							var textColor = this.data[i].barColor;
						} else {
							var addClass = '';
							var textColor = '';
						}				

						var makeHtml = "";
							makeHtml += '<li class="unit '+addClass+'" data-type="'+type+'" data-dataType="'+dataType+'" data-label="'+label+'"  data-unit="'+unit+'" data-value="'+this.data[i].value+'" style="color:'+textColor+';">';	
							makeHtml += 	'<dl ambGraph-DataText>';
							makeHtml += 		'<dt>'+label+'</dt>';
							makeHtml += 		'<dd><span class="value num"></span></dd>';	
							makeHtml += 	'</dl>';
							makeHtml += 	'<span class="graph"><em style="right:100%; background-color:'+barColor+'"></em></span>';
							makeHtml += '</li>';
						
						this.tg.find('.barChart').append(makeHtml);
						
						setTimeout(function(){ _this.changeDateFormat(); }, 10);
					}
					
					this.maxNum = maxNum;
					this.setValue();
					
					setTimeout(function(){ _this.setAni(); }, 1);
					setTimeout(function(){ _this.moveNum(); }, 10);
					setTimeout(function(){ _this.setEerage(); }, 10);
				}
			}


			///// setUnit
			if(this.opts.setUnit) {
				if(this.opts.setUnit.text) {
					var text = this.opts.setUnit.text;
					this.tg.find('.unit .num').append('<em>'+text+'</em>');	
				}
				if(this.opts.setUnit.position) {
					var position = this.opts.setUnit.position;
					this.tg.find('.unit .num').addClass(position);
					if(position == 'left'){
						var $num = this.tg.find('.unit .num');
						$num.each(function() {
							var $em = $(this).find('>em');
							$em.prependTo($(this));
						});
					}
				}
			}

		},

		setValue : function () {
			this.unit = this.tg.find('.unit');

			this.unit.each(function() {
				var v = Number($(this).attr('data-value'));				
				$(this).find('.num').append(v.numFormat());				
			});
		},

		setAni : function () {
			this.unit = this.tg.find('.unit');

			var max = this.maxNum;
			var cName = this.opts.cName;

			this.unit.each(function() {
				var v = $(this).attr('data-value');
				var p = 110 - (v/max * 100);

				if(cName == 'vertical'){
					$(this).find('.graph > em').css('top', p + '%');
				} else {
					$(this).find('.graph > em').css('right', p + '%');	
				}
			});
		},


		// 평군값 라인 셋팅
		setEerage : function () {
			this.unit = this.tg;
			this.everage = this.unit.find('.everage');

			var max = this.maxNum;

			if(this.everage.length > 0){
				var v = this.everage.attr('data-value');
				var p = 110 - (v/max * 100);

				var makeHtml = "";
					makeHtml += '<li class="everageline" style="top:'+p+'%">';
					makeHtml += '</li>';

				this.tg.find('.barChart').prepend(makeHtml);
				
			}

		},
		
		// 사용량 bar 그래프 // cName = dataBar
		setAniDataBar : function () {
			this.unit = this.tg.find('.unit');

			this.unit.each(function() {
				var v = $(this).attr('data-value');
				var m = $(this).attr('data-max');
				
				var p = 100 - (v/m * 100);
				
				if(m == '무제한' || m == '기본제공'){
					$(this).find('.graph > em').css('right', '0%');	
				}  else {
					$(this).find('.graph > em').css('right', p + '%');	
				}
			});
		},
		
		// 초 > 분,초 변경
		changeDateFormat :function () {
			this.unit = this.tg.find('.unit');
			
			this.unit.each(function() {
				var type = $(this).attr('data-type');
				var max = $(this).attr('data-max');
				var dataType = $(this).attr('data-dataType');
				if(type == 'time'){
					if(max == '무제한'){
						$(this).find('[ambgraph-datatext] > dd > span.max').text('무제한');
					} else if(max == '기본제공') {
						$(this).find('[ambgraph-datatext] > dd > span.max').text('기본제공');
					} else {
						var mText = $(this).attr('data-max').toHHMMSS();
						// 2023 커스텀
						// $(this).find('[ambgraph-datatext] > dd > span.max').text('총 ' +mText );
						$(this).find('[ambgraph-datatext] > dd > span.max').text(mText);
					}
					var vText = $(this).attr('data-value').toHHMMSS();
					// 2023 커스텀
					// $(this).find('[ambgraph-datatext] > dd > span.value').text(vText + ' 사용');
					$(this).find('[ambgraph-datatext] > dd > span.value').text(vText);
				}
				if(dataType == 'time'){
					var vText = $(this).attr('data-value').toHHMMSS();
					$(this).find('[ambgraph-datatext] > dd > span.value').text(vText);
				}
			});
		},
		
		// 잔여 표시
		exTextMaker :function () {
			this.unit = this.tg.find('.unit');
			
			this.unit.each(function() {
				var type = $(this).attr('data-type');
				var max = $(this).attr('data-max');
				var value = $(this).attr('data-value');
				var unit = $(this).attr('data-unit');
				var charge = $(this).attr('data-charge');
				
				if(max == '무제한' || max == '기본제공'){
					return;
				} else if(charge > 0) {
					if(type == 'time'){
						
						var exText = $(this).attr('data-charge').toHHMMSS();
						$(this).find('[ambgraph-extext]').text('잔여 ' +exText);	
					} else {
						$(this).find('[ambgraph-extext]').text('잔여 ' +charge + unit);	
					}
				} else {
					
				}
			});
		},

		moveNum : function () {
			this.unit = this.tg.find('.unit');

			this.unit.each(function() {
				var num = $(this).find('.num').text();
				$(this).find('.graph > em').attr('data-num', num);	
			});
		},
		
		
		
	};
}));


////////////////////////////////////////
//숫자 타입에서 쓸 수 있도록 numFormat() 함수 추가
Number.prototype.numFormat = function(){
	if(this==0) return 0; 
	var reg = /(^[+-]?\d+)(\d{3})/;
	var n = (this + ''); 
	while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2'); 
	return n;
};

//문자열 타입에서 쓸 수 있도록 numFormat() 함수 추가
String.prototype.numFormat = function(){
  var num = parseFloat(this);
  if( isNaN(num) ) return "0"; 
  return num.numFormat();
};

//초를  분/초 변경 함수
String.prototype.toHHMMSS = function(){
  var num = parseInt(this, 10);
  var m = Math.floor(num / 60);
  var s = num - (m * 60);
  
  if(s == 0){
	 return m+'분'; 
  } else {
	 return m+'분 '+s+'초'; 
  }
};
