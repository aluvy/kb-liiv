/**
 * @name	jQuery.AmbGraph
 * @author	@mo, @jsl, @ohy ( http://www.ntels.com/ )
 *
 * @version	1.0.0
 * @since	202203
 *
 * @example
 
	$("#target").AmbPie({
		cName : 'pCircle',         // style (현재: pCircle)
		customCss: 'customCss',    // custom css가 필요할 경우 class명
		width : '75px',            // Gauge chart width // min 6rem
        maxWidth : null,           // Gauge chart maxWidth // 100% 
		setColor :{
			strokeColor : '#2ba4fc',  // #2ba4fc
			textColor : '#2ba4fc,     // #2ba4fc
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

	$.fn.AmbPie = function (settings) {

		$.fn.AmbPie.defaults = {

			cName : null,     // style (현재: pCircle)
			customCss: null,  // custom css가 필요할 경우 class명
			width : null,     // Gauge chart width // min 6rem
			maxWidth : null,  // Gauge chart maxWidth // 100% 
			setColor :{				
				strokeColor : '#2ba4fc',  // #2ba4fc
				textColor : '#2ba4fc',  // #2ba4fc
			},

			data : null       // 불러올 data arrry
		};
		
		var opts = $.extend(true, {}, $.fn.AmbPie.defaults, settings);				
		
		return this.each(function () {					
			var _this = this;

			$.fn.extend(this, AmbPie);
			this.opts = opts;
			this.init();
		});
	
	};

	var AmbPie = {
		init : function () {			
			var _this = this;	
			
			this.tg =  $(this);

			this.data =   this.opts.data;			
			this.max =    this.data[0].max;
			this.value =  this.data[0].value;
			this.label =  this.data[0].label;
			this.unit =   this.data[0].unit;
			this.gUnit =  this.data[0].gUnit;
			this.type =   this.data[0].type;
			
			this.cutomTxt_PieValue =     this.data[0].cutomTxt_PieValue;
			this.cutomTxt_labelValue =   this.data[0].cutomTxt_labelValue;

			this.width =  this.opts.width;
			this.maxWidth =  this.opts.maxWidth;
			
			this.cName =      this.opts.cName;
			this.customCss =  this.opts.customCss;

			var makeWrap = '<div class="ambGaugeMain"><div class="gauge_chart"></div></div>';
			this.tg.prepend(makeWrap).addClass('ambGaugeWrap');
			this.tg.parent('div').addClass('ambGaugeBox');
			
						
			if(this.tg.attr('ambGaugeText') == 'true'){
				
				var makeHtml = "";
					makeHtml += '<dl class="gauge_text">';
					makeHtml += 	'<dt class="blind"><span ambGauge-label></span> 사용</dt>';
					makeHtml += 	'<dd class="valueTxt"><em ambGauge-value></em><em ambGauge-unit></em></dd>';
					makeHtml += '</dl>';
				this.tg.find('.ambGaugeMain').append(makeHtml);
			}
			
			if(this.tg.attr('ambGaugelabel') == 'true'){
				var makeHtml = "";
					makeHtml += '<dl class="gauge_label">';
					makeHtml += 	'<dt><span ambGauge-label></span></dt>';
					makeHtml += 	'<dd><em ambGauge-max></em><em ambGauge-unit></em></dd>';
					makeHtml += '</dl>';
				this.tg.append(makeHtml);
			}

			///// cName
			if(this.opts.cName) {
				var cName = this.opts.cName;
				this.tg.addClass(cName);
			}

			///// customCss
			if(this.opts.customCss) {
				var customCss = this.opts.customCss;
				this.tg.addClass(customCss);
			}

			///// width
			if(this.opts.width) {
				var w = this.opts.width;
				this.tg.find('.ambGaugeMain').css({
					'width': w,
				}); 						
			}
			
			///// maxWidth
			if(this.opts.maxWidth) {
				var w = this.opts.maxWidth;
				this.tg.find('.ambGaugeMain').css({
					'max-width': w,
				}); 						
			}

			///// data
			if(this.opts.data) {
				
				this.tg.find('>.ambGaugeMain').attr({
					'data-max' : this.max,
					'data-value' : this.value,
					
					'data-type' : this.type,
					'data-gUnit' : this.gUnit,
					
					'data-cTxt-Pie' : this.cutomTxt_PieValue,
					'data-cTxt-label' : this.cutomTxt_labelValue
					
				});
				
				_this.makeGauge();
				
				setTimeout(function(){ _this.setGauge(); }, 1);
				setTimeout(function(){ _this.setGaugeText(); }, 10);
			}
			
			///// setColor
			if(this.opts.setColor) {
				if(this.opts.setColor.strokeColor) {
					var color = this.opts.setColor.strokeColor;
					this.tg.find('.circle.fill').css('stroke', color);
				}
				if(this.opts.setColor.textColor) {
					var color = this.opts.setColor.textColor;
					this.tg.find('.valueTxt').css('color', color);
				}
			}
			


		},
		
		makeGauge : function () {
			this.chart = this.tg.find('.gauge_chart');			
			this.id = this.tg.attr('id');
			
			var cName = this.cName;			
			switch (cName){
		    	case "pCircle" :
		    		var svg = "";
						svg += '<svg viewBox="0 0 40 40">';
						svg +=     '<path class="circle bg"   d="M20,4 a 16,16  0  0,1  0,32 a 16,16  0  0,1  0,-32"></path>';
						svg +=     '<path class="circle fill" d="M20,4 a 16,16  0  0,1  0,32 a 16,16  0  0,1  0,-32" stroke-dasharray="0, 100"></path>';
						svg += '</svg>';
		    		break;
			}
			
			this.chart.prepend(svg);
		},
		
		
		setGauge : function () {
			var max = Number(this.tg.find('>.ambGaugeMain').attr('data-max'));
			var v = Number(this.tg.find('>.ambGaugeMain').attr('data-value'));			
			var type = this.tg.find('>.ambGaugeMain').attr('data-type');
			
			if(!type == ''){
				var percent = 1 *100;	
			} else {
				var val = (v > max) ? max : v;
				var percent = val/max *100;	
			}
			
			//var val = (v > max) ? max : v;			
			//var percent = val/max *100;	
			var stroke = (this.tg.hasClass('pCircle') == true) ? percent : percent/2;
						
			var $stroke =  this.tg.find('.gauge_chart .fill');
			
			if(type == '초과'){
				$stroke.addClass('over');
			}
			
			$stroke.css({
				'stroke-opacity' : '1',
				'stroke-dasharray' : stroke  +', 100',		
			});
		},
		
		/**/
		setGaugeText : function () {
			var max = Number(this.tg.find('>.ambGaugeMain').attr('data-max'));
			var v = Number(this.tg.find('>.ambGaugeMain').attr('data-value'));
			var type = this.tg.find('>.ambGaugeMain').attr('data-type');
			var gUnit = this.tg.find('>.ambGaugeMain').attr('data-gUnit');
			
			var ctLabel = this.tg.find('>.ambGaugeMain').attr('data-ctxt-label');
			var ctPie = this.tg.find('>.ambGaugeMain').attr('data-ctxt-pie');
			
			/*
			var val = (v > max) ? max : v;			
			var percent = val/max *100;	
			var $pTxt =  this.tg.find('[ambGauge-percent]');
			*/
			//var $pTxt =  this.tg.find('[ambGauge-percent]');
			//$pTxt.text(percent.toFixed(1).numFormat());

			var $vTxt =  this.tg.find('[ambGauge-value]');			
			var $maxTxt =  this.tg.find('[ambGauge-max]');
			
			var $unitTxt =  this.tg.find('[ambGauge-unit]');
			var $labelTxt =  this.tg.find('[ambGauge-label]');
			
			if(!ctLabel == ''){
				this.tg.find('.gauge_label > dd').html('<em>'+ctLabel+'</em>');
			}
			if(!ctPie == ''){
				this.tg.find('> .ambGaugeMain > .gauge_text > dd').html('<em>'+ctPie+'</em>');
			}
			
			
			if(!gUnit == ''){
				$unitTxt.text(this.unit);
				this.tg.find('>.ambGaugeMain>.gauge_text [ambgauge-unit]').text(gUnit);
			} else {
				$unitTxt.text(this.unit);
			}
			
			if(type == '무제한'){
				$vTxt.text(v.numFormat());
				$labelTxt.text(this.label);
				this.tg.find('>.gauge_label>dd').html('<em>무제한</em>');
			} else if(type == "초과") {
				$vTxt.text(v.numFormat());	
				$maxTxt.text(max.numFormat()); 
				$labelTxt.text(this.label);
				this.tg.find('>.ambGaugeMain>.gauge_text>dd').append('<p>초과</p>');
				this.tg.find('>.ambGaugeMain').addClass('over');
			} else {
				$vTxt.text(v.numFormat());	
				$maxTxt.text(max.numFormat()); 
				$labelTxt.text(this.label);
			}
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
