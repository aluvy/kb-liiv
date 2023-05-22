$(document).ready(function(){

    setTimeout(() => { _layout.init() }, 0);
    accordionButton.init();
    tabMenu.init();
    _front.init();  //form

    // 퍼블화면만 적용 by S020781
    if(location.href.indexOf('/pub/') != -1){
    	new AsideMenu().init(); // aside_menu
    }
    
    partnerMarquee();   // 멤버십제휴처 로고 애니메이션
});


// Accordion & toggle
var accordionButton = {
    init : function(){
        accordionButton.accordion();
        accordionButton.toggle();
    },
    accordion : function(){

        $(document).find(".js_accordion > li").each((idx, item)=>{

            let target = $(item).find(".title").hasClass("btn_type") ? $(item).find(".btn_acc") : $(item).find(".title");

            $(item).hasClass("on") ? $(item).find(target).attr('aria-expanded', 'true') : $(item).find(target).attr('aria-expanded', 'false');
            $(item).hasClass("on") ? $(item).find(".content_panel").show() : $(item).find(".content_panel").hide();
            $(item).find(target).hasClass("link") ? $(item).find(target).removeAttr('aria-expanded') : null;

            target.on("click", function(e){

                if( $(this).hasClass("link") ){ return }
                e.preventDefault();

                const li = $(this).parents("li");
                const liAll = $(this).parents("li").siblings("li");

                if( li.hasClass("on") ){
                    $(this).attr('aria-expanded', 'false');
                    li.removeClass("on").find(".content_panel").slideUp(200);
                } else {
                    liAll.find("[aria-expanded]").attr("aria-expanded", 'false');
                    liAll.removeClass("on").find(".content_panel").slideUp(200);

                    $(this).attr('aria-expanded', 'true');
                    li.addClass("on").find(".content_panel").slideDown(200);
                }
            })
        });
    },
    /**
     * popup 내 아코디언 이벤트 init: popup open 시 호출 함께 호출 됨
     * @param {element} popup (_this.$el) => (ex) div.layer_wrap.open.confirm
     */
    accordion_popup: function(popup){
        // popup in accordion

        $(popup).find(".js_accordion > li").each((idx, item)=>{

            let target = $(item).find(".title").hasClass("btn_type") ? $(item).find(".btn_acc") : $(item).find(".title");

            $(item).hasClass("on") ? $(item).find(target).attr('aria-expanded', 'true') : $(item).find(target).attr('aria-expanded', 'false');
            $(item).hasClass("on") ? $(item).find(".content_panel").show() : $(item).find(".content_panel").hide();
            $(item).find(target).hasClass("link") ? $(item).find(target).removeAttr('aria-expanded') : null;

            target.on("click", function(e){

                if( $(this).hasClass("link") ){ return }
                e.preventDefault();

                const li = $(this).parents("li");
                const liAll = $(this).parents("li").siblings("li");

                if( li.hasClass("on") ){
                    $(this).attr('aria-expanded', 'false');
                    li.removeClass("on").find(".content_panel").slideUp(200);
                } else {
                    liAll.find("[aria-expanded]").attr("aria-expanded", 'false');
                    liAll.removeClass("on").find(".content_panel").slideUp(200);

                    $(this).attr('aria-expanded', 'true');
                    li.addClass("on").find(".content_panel").slideDown(200);
                }
            })
        });
    },
    toggle : function(){
        $(".js_toggle li").each((idx, item)=>{

            let target = $(item).find(".title").hasClass("btn_type") ? $(item).find(".btn_acc") : $(item).find(".title");

            $(item).hasClass("on") ? $(item).find(target).attr('aria-expanded', 'true') : $(item).find(target).attr('aria-expanded', 'false');
            $(item).hasClass("on") ? $(item).find(".content_panel").show() : $(item).find(".content_panel").hide();
            $(item).find(target).hasClass("link") ? $(item).find(target).removeAttr('aria-expanded') : null;
            
            target.on("click", function(e){
                if( $(this).hasClass("link") ){ return }
                e.preventDefault();

                const li = $(this).parents("li");

                if( li.hasClass("on") ){
                    $(this).attr('aria-expanded', 'false');
                    li.removeClass("on").find(".content_panel").slideUp(200);
                } else {
                    $(this).attr('aria-expanded', 'true');
                    li.addClass("on").find(".content_panel").slideDown(200);
                }
            })
        })

        // 게시판 필터 토글
        $(".filter_list").each((idx, item)=>{
            $(item).hasClass("on") ? $(item).find(".btn_acc").attr("aria-expanded", 'true') : $(item).find(".btn_acc").attr("aria-expanded", 'false');
        })
        $(".filter_list li > a").each((idx, item)=>{
            $(item).attr("role", "radio");  // [05/15] role 추가
            $(item).hasClass("on") ? $(item).attr("aria-checked", true) : $(item).attr("aria-checked", false);  // [05/15] aria-checked 추가
        })
        $(document).on("click", ".filter_list li a", function(e){
            e.preventDefault();
            $(this).parents(".filter_list").find("li a").removeClass("on").attr("aria-checked", false);         // [05/15] aria-checked 추가
            $(this).addClass("on").attr("aria-checked", true);                                                  // [05/15] aria-checked 추가
        })
        $(document).on("click", ".filter_list .btn_acc", function(e){
            if( $(this).parents(".filter_list").hasClass("on") ){
                $(this).parents(".filter_list").removeClass("on");
                $(this).attr("aria-expanded", 'false');
            }  else {
                $(this).parents(".filter_list").addClass("on");
                $(this).attr("aria-expanded", 'true');
            }
        })
    },
}

// Tab menu
var tabMenu = {
    init : function(){
        if($("[role='tab']").length) {
            $("[role='tab']").each(function(){
                $(this).parent('div').attr('role', 'none');
                $(this).closest('.scroll_wrap').attr('role', 'none');
            });
        } // 접근성 추가
        for( var i=0 ; i< $('.tab_wrap').length ; i++ ){
            var thisIndex = $('.tab_wrap button[aria-selected=true]').eq(i).attr('aria-controls');
            if(thisIndex) {
                thisIndex.length > 0 && $('.tab_wrap button[aria-selected=true]').eq(i).parents('.tab_wrap').find('#'+thisIndex).addClass('on').siblings().removeClass('on');
            }
        }
        tabMenu.tabMove();
        tabMenu.tab();
        // tabMenu.tabBox();
    },
    tab : function(){
        $(document).on('click', '.tab_wrap [role=tab]', function(e) {
            e.preventDefault();
            var _this = $(this),
                _tabWrap = _this.closest('.tab_wrap'),
                _thisPanel = _tabWrap.children('.tab_panel'),
                _thisControls = _thisPanel.filter('#' + _this.attr('aria-controls'));
            
            _this.attr('aria-selected', 'true').parent('div').eq(0).find('[role=tab]').attr('aria-selected', 'true').parent('div').siblings().find('[role="tab"]').attr('aria-selected', 'false')

            if (_thisPanel.length) {
                _thisControls.addClass('on').siblings('.tab_panel').removeClass('on');

                // if (!_tabWrap.hasClass('box')) {
                //     _thisControls.find('.tab_wrap .tab_list > div [role=tab]').attr('aria-selected', 'false').parent('div').eq(0).find('[role=tab]').attr('aria-selected', 'true');
                //     _thisControls.find('.tab_panel').eq(0).addClass('on').siblings().removeClass('on');
                // }
            };
            tabMenu.tabMove();
        });
    },
    tabMove : function(){
        $('.tab_wrap').each(function(){

            $(this).find('[role=tab]').each(function(){
                var _this = $(this),
                    _tabWrap = _this.closest('.tab_wrap'),
                    _thisScroll = _tabWrap.find('.tab_list'),
                    _thisScrollLp = parseInt(_thisScroll.css('padding-left')),
                    _thisScrollW = _thisScroll.outerWidth(true),
                    _thisPanelLeft = _this.parent('div').offset().left;

                if (_this.attr('aria-selected') == 'true' && (_thisScrollW <= _this.parent('div').outerWidth() + _thisPanelLeft || _thisPanelLeft <= _thisScrollLp)) {
                    _thisScroll.scrollLeft(_thisScroll.scrollLeft() + _thisPanelLeft - _thisScrollLp);
                    return false;
                }
            });
        });
    },
    // tabBox : function(){
    //         if($('.tab_wrap.box').length > 0) {
    //             $('.tab_wrap.box .tab_list > div').attr("role","presentation");                
    //         }
    // }
}



/* layer popup
*  1.종류 : 총 3타입(alert, confirm, bottom) (confirm alert, fullpopup, calendar, notice 추가됨) ==> 총 7타입
*  2.특징 :
*           - alert         : 퍼블화면에선 사용하지 않음
*           - confirm alert : 컨펌 알럿팝업은 레이어팝업과 유사하지만 좌유 여백이 다름. (우측 상단 삭제버튼(X) 없음)
*           - confirm       : 가장 많이 사용하는 일반 타입 (우측 상단 삭제버튼(X) 없음)
*           - bottom        : 하단에 위치하는 타입
*                               - 최대 높이값은 최대(100%-헤더) 이며, 스크롤 자동 지원
*           - fullpopup     : 높이 100% 팝업
*           - calendar      : 달력 호출 팝업
*           - notice        : 공지사항 호출 팝업
*
*  3.옵션 : (달력팝업의 옵션은 cal_popup 페이지 참고)
*       title:'타이틀',         // 필수입력
*       titleUse : true,        // default "true", 타이틀 사용여부
*       closeUse : false,       // default "true", 오른쪽 상단 닫기버튼 사용여부
*       closeAct:false,         // default "true", 레이어 닫기 버튼의 닫기 기능 사용여부를 정의할 때 사용
*       content:'#ID',          // 필수입력, 호출할 HTML컨텐츠 ('#ID명'), 알림창일 경우 텍스트 입력 ('알림창입니다.')
*       type:'confirm',         // 필수입력, default "confirm", 레이어 타입 지정 (alert, confirm, bottom)
*       openAuto : true,        // default "false", 레이어를 변수명으로 호출할 때 정의
*       dimAct : false,         // defulat "false", dim클릭 close event
*
*  4. 참고 URL :
*       /pub/html/cmn/popup.html
*       /pub/html/cmn/cal_popup.html
*       /pub/html/cmn/notice_popup.html
*/
$(function(){
    "use strict";

    var _w = window;
    $.ohyLayer = function(options, option2){

        let id = options.content;
        if($(id).children().length <= 0) return;    // 비어있는 요소 예외처리

        if(typeof options === 'undefined') element = {};
        if(typeof options === 'string') {
            options = {
                content : options,
                title : (option2) ? option2 : false,
            };
        }

        return _w.johyLayer(options);
    }

    _w.johyLayer = function(options){
        if(typeof options === 'undefined') options = {}

        var pluginOptions = $.extend(true, {}, _w.johyLayer.pluginDefaults);
        (_w.johyLayer.defaults) ? pluginOptions = $.extend(true, pluginOptions, _w.johyLayer.defaults) : '' ;
        pluginOptions = $.extend(true, {}, pluginOptions, options);

        var instance = new _w.JohyLayer(pluginOptions);
        _w.johyLayer.instances.push(instance);

        return instance;
    };

    _w.JohyLayer = function(options){
        $.extend(this, options);
        this.init();
    };

    _w.JohyLayer.prototype = {
        init : function(){
            if(this.openAuto == false)  this.open();
        },
        buildHTML : function(){
            var _this = this;

            _this.$el = $(_this.template).appendTo(_this.container);
            _this.$parent = _this.$el.closest('.layer_wrap');
            _this.$layer = _this.$el.find('.ly_in');
            _this.$hd = _this.$el.find('.ly_hd');
            _this.$title = _this.$el.find('.ly_hd h1');
            _this.$con = _this.$el.find('.ly_con');
            _this.$closeDevBtn = _this.$el.find('.btn.close');

            _this.setContent();
            _this.$layer.attr("tabindex", 0).focus();   // [05/22] 추가

            _this.$closeDevBtn.attr("id", (_this.content.replace("#",""))+"_dev");
            if(this.closeAct == true) _this.$closeDevBtn.attr("data-action","close");

            _this.$parent.addClass(_this.type);
            
            var $closeBtn = _this.$el.find("[data-action='close']");
            $closeBtn.on("click", function(e){                
                _this.$layer.addClass("off");
                _this.close();
            });
           
            // dim click action
            var $dim = _this.$el.find(".col_dim");
            $dim.on("click", function(){
                if( _this.dimAct === true ){
                    _this.$layer.addClass("off");
                    _this.close();
                }
            });
        },
        open : function(){
            var _this = this;
            var $lastFocused = $("body").find(":focus");    // [05/22] 추가
            var $focusId = $lastFocused.attr("id");         // [05/22] 추가

            _this.buildHTML();
            
            // 타이틀 있는지 체크
            if( _this.$con.find(".ly_hd").length > 0 ){ _this.$hd.remove() }

            (_this.title == '') ? _this.$title.html("알림") : _this.$title.html(_this.title);
            if(_this.closeUse === false) _this.$layer.addClass("noBtn");

            // _this.$layer.focus().attr('rel', $focusId);
            // _this.$parents.prev('.layer_wrap').attr('aria-hidden', true);

            // ios focus 대응 setTimeout
            setTimeout(()=>{
                var $lastFocused = $('body').find(':focus');
                var $focusId = $lastFocused.attr("id");

                _this.$layer.focus().attr("rel", $focusId);

                let targetBtn = _this.$layer.attr("rel");
                $(document).find(`#${targetBtn}`).addClass("on");   // 누른 target에 class on

                _this.$layer.focus().attr('rel', $focusId);                     // [05/22] 추가
                _this.$parent.prev('.layer_wrap').attr('aria-hidden', true);    // [05/22] 추가

                _this.$layer.attr("tabindex",0).focus();            // focus 이동
            }, 0)


            // aria-hidden
            $(".wrap", window.parent.document).attr("aria-hidden", "true");
            _this.$parent.prev(".layer_wrap").attr("aria-hidden", true);
            _this.$el.attr("aria-hidden", false);

            if( $(document).find(".layer_wrap.open").length <= 1 ){ // 팝업이 이미 떠있는지 체크
                var $scrollTop = $(window).scrollTop();

                let $title = $(document).find(".container .content h1.title");
                let $header = $(document).find(".header");
                setTimeout(function(){
                    $(".wrap").css({
                        "top":-$scrollTop,
                        "position" : "relative",
                        // "position" : "fixed"
                    });
                    $("html, body").addClass("noScroll");
                    if( _front.isMain() ){
                        ( $scrollTop > 60 ) ? $header.addClass("on") : null;  // 메인일때 .header.on 예외처리
                    } else if ( _front.isSub() ){
                        // console.log("isSub", $scrollTop, $title.length );
                        ( $scrollTop > 0 && $title.length > 0 ) ? $title.removeClass("hidden") : null;  // 서브일때 h1.title 예외처리
                    }
                }, 0);
            }

            ( _this.type !== "alert" ) ? $("html, body").addClass("noScroll") : null; // noScroll
            if(_this.titleUse === false) _this.$layer.addClass("noHd");

            // max, min height
            function getHeight(){
                let winH =  Math.round($(window).height());
                let htmlH = Math.round($("html").height());
                let head = ( _front.isSub() )
                         ? Math.round($(document).find(".header .inner_sub").outerHeight(true)) || 0
                         : Math.round($(document).find(".header .inner_main").outerHeight(true)) || 0;
                
                let pophead = Math.round(_this.$layer.find(".ly_hd").outerHeight());
                let btn = _this.$layer.find(".btn_pop_confirm_wrap").length > 0 ? Math.round(_this.$con.find(".btn_area").outerHeight()) : 0;
                let maxHeight = winH - pophead - btn;
                let maxHeightforApp = htmlH - pophead - btn;
                let minHeight = 410;    // calendar
                let cnt = _this.$con.find(".ly_cnt");
    
                if( _this.type == "fullpopup" ){    // fullpopup
                    cnt.css({"max-height":`${maxHeightforApp}px`});
                    cnt.css({"min-height":`${maxHeightforApp}px`});
    
                } else {
                    maxHeight = maxHeight-head;
                    if( _this.type == "calendar" ){
                        if( minHeight >= maxHeight ){ minHeight = maxHeight }
                        cnt.css({"max-height":`${maxHeight * 0.1}rem`});
                        cnt.css({"min-height":`${minHeight * 0.1}rem`});

                        // 캘린더 세로값 셋팅
                        _calendar.minH = minHeight;
                        _calendar.maxH = maxHeight;
                    } else {
                        cnt.css({"max-height":`${maxHeight}px`});
                    }
                }
            }
            getHeight();
            
            if( _this.type == "confirm") getIframeSize(); // pdf 미리보기 iframe 사이즈

            // resize
            $(window).on("resize",() => {
                getHeight();
                if( _this.type == "confirm") getIframeSize();
            });
            
            $(_this.content).trigger("onload");
            accordionButton.accordion_popup(_this.$el); // popup accordion

            return true;
        },
        setContent:function(){
            var _this = this;

            if(_this.type === 'alert') {
                var $html = '<div class="ly_cnt"><div class="section">'+_this.content+'</div></div>';
            }else{
                var $html = $(_this.content).html();
                $(_this.content).empty();
            };

            if(_this.type === 'confirm' || _this.type === 'confirm alert' || _this.type === 'alert confirm'){
                _this.$closeDevBtn.remove();
            }

            _this.$con.html($html);

            // 버튼 없는 바텀 팝업 하단 패딩
            let $btn_pop = _this.$con.find(".btn_pop_confirm_wrap");
            if( _this.type == 'bottom' && $btn_pop.length <= 0 ){
                _this.$con.find(".ly_cnt").css({ "padding-bottom" : `calc(var(--sab) + 3.2rem)` })
            }

        },
        close:function(){
            var _this = this;
            var $html = _this.$con.html();
            var $lastFocused = _this.$layer.attr("rel");
            var $scrollTop = parseInt($(".wrap").css("top"))*-1;
            var $win = $(window);
            
            let targetBtn = _this.$layer.attr("rel");
            $(document).find(`#${targetBtn}`).removeClass("on");   // 누른 target에 remove class on

            // $("#"+$lastFocused).focus().closest(".layer_wrap").removeAttr("aria-hidden");
            // _this.$parent.prev(".layer_wrap").removeAttr("aria-hidden");

            setTimeout(()=>{
                    
                $("#"+$lastFocused).focus().closest(".layer_wrap").removeAttr("aria-hidden");   // [05/22] 이동
                 _this.$parent.prev(".layer_wrap").removeAttr("aria-hidden");                   // [05/22] 이동
                
                if (_this.type !== "alert" ) {
                    if( _this.$el.prev(".layer_wrap").length > 0  ){
                        _this.$el.prev(".layer_wrap").attr("aria-hidden", false);
                    } else {
                        $("html, body").removeClass("noScroll");    // noScroll

                        $(".wrap").css("top","");
                        $win.scrollTop($scrollTop);

                        let wrap = $(".wrap", window.parent.document);
                        wrap.css("position", "");
                        wrap.removeAttr("aria-hidden");
                    }
                    $(_this.content).html($html);               // element reset
                    if( _this.type == "calendar" ){
                        $(_this.content).remove();
                    }
                };
                _this.$el.remove();
                _w.johyLayer.instances.find(function(o, i){
                    if(o == _this){
                        _w.johyLayer.instances.splice(i, 1);
                    }
                });
            }, 250);
        }
    };
 
    _w.johyLayer.instances = [];
    _w.johyLayer.lastFocused = false;
    _w.johyLayer.pluginDefaults = {
        template:'' +
            '<div class="layer_wrap open"><div class="row"><div class="col"><div class="col_dim"></div><div class="ly_in">' +
            '<div class="ly_hd"><h1 class="pop_h1">알림</h1></div>'+
            '<div class="ly_con"></div>'+
            '<button type="button" class="btn btn_ico close" ><span class="hidden">레이어창 닫기</span></button>' +
            '</div></div></div></div>',
        titleUse:true,
        title:'알림',
        closeUse:true,
        content:'content',
        container:'body',
        height:null,
        type:'confirm',
        openAuto : false,
        closeAct : true,
        confirmType : null,
        dimAct : false
    };
});



$(function(){
    "use strict";

    var _w = window;
    $.marquee = function(options){

        if(typeof options === 'undefined') element = {};
        if(typeof options === 'string') {
            options = {
                content : options,
                title : (option2) ? option2 : false,
            };
        }

        return _w.jmarquee(options);
    }

    _w.jmarquee = function(options){
        if(typeof options === 'undefined') options = {};

        var pluginOptions = $.extend(true, {}, _w.jmarquee.pluginDefaults);
        (_w.jmarquee.defaults) ? pluginOptions = $.extend(true, pluginOptions, _w.jmarquee.defaults) : '' ;
        pluginOptions = $.extend(true, {}, pluginOptions, options);

        var instance = new _w.Jmarquee(pluginOptions);
        _w.jmarquee.instances.push(instance);

        return instance;
    };
    

    _w.Jmarquee = function(options){
        $.extend(this, options);
        this.init();
    };

    _w.Jmarquee.prototype = {
        init : function(){
            this.set();
        },
        buildHTML : function(){
            var _this = this;

            _this.$marquee;     // requestAnimationFrame();
            _this.$left = 0;

            _this.$id = _this.content;

            _this.$area = $(_this.content);
            _this.$wrap = _this.$area.find(".marquee-wrap");

            setTimeout(() => {
                _this.$item = _this.$area.find(".marquee-item");
                _this.$itemWidth = Math.floor(_this.$item.width());
                _this.$item.css({"width": `${_this.$itemWidth * 0.1}rem` });
                _this.$itemSize = _this.$itemWidth*-1;
                
                for(let i=0; i<_this.clone; i++){
                    let clone = _this.$item.clone();
                    clone.attr("aria-hidden", true);
                    _this.$wrap.append(clone);
                }
                
            }, 0);
        },
        set: function(){
            var _this = this;

            _this.buildHTML();
            _this.play();

        },
        play: function(){
            var _this = this;

            if( _this.playUse == true ){
                _this.$marquee = requestAnimationFrame(ani);
            }

            function ani(){
                _this.$wrap.css({"left" : `${_this.$left * 0.1}rem`});
                _this.$left = _this.$left - _this.speed;

                _this.$marquee = requestAnimationFrame(ani);                // callback
                if( _this.$left <= _this.$itemSize ) _this.$left = 0;        // reset
            }

            // stop
            $(document).off("click", `${_this.$id}_stop`).on("click", `${_this.$id}_stop`, function(){
                cancelAnimationFrame(_this.$marquee);
            });

            // play
            $(document).off("click", `${_this.$id}_play`).on("click", `${_this.$id}_play`, function(){
                cancelAnimationFrame(_this.$marquee);
                _this.$marquee = requestAnimationFrame(ani);
            });

            // close
            $(document).off("click", `${_this.$id}_close`).on("click",`${_this.$id}_close`, function(){
                cancelAnimationFrame(_this.$marquee);
                _this.close();
            });

        },
        close: function(){
            var _this = this;
            _w.jmarquee.instances.find(function(o, i){
                if(o == _this){
                    _w.jmarquee.instances.splice(i, 1);
                }
            });
        }
    };
 
    _w.jmarquee.instances = [];
    _w.jmarquee.pluginDefaults = {
        playUse: true,
        stopUse: true,
        speed: 1,
        clone: 2,
    };
});



var _calendar = {
    idCal : '',         // calendar id
    idInput : '',       // input id
    format : '-',       // 0000-00-00
    valY : '',          // 년
    valM : '',          // 월
    valD : '',          // 일
    minH : '',
    maxH : '',
    minDate: { year: 0, month: 0, day: 0 },
    maxDate: { year: 0, month: 0, day: 0 },
    
    /**
     * _calendar.open( idCal, idInput, dateVal ) : 달력 레이어팝업 호출
     * @param {string} idCal		    : 달력 팝업 내 DIV ID       (idCal)
     * @param {string} idInput		    : 달력에서 날짜 선택 시 날짜를 받을 input id
     * @param {string} dateVal			: 기본 선택되어 있는 날짜    (20230223)
     * @param {string} format           : 0000-00-00, 
     */
    open : function( idCal, idInput, dateVal, format, object ){

        _calendar.idInput = ( idInput != '' || idInput != undefined ) ? idInput : '';       // input setting
        _calendar.format = (format != undefined) ? format : ".";                            // format setting

        // 초기화
        _calendar.minDate = { year: 0000, month: 00, day: 00 };
        _calendar.maxDate = { year: 9999, month: 99, day: 99 };

        // minDate, maxDate 체크
        if( object !== undefined ){
            let minDate  = String(object.minDate).replace(/[^0-9]/g, "");  // 숫자 제외하고 제거
            let maxDate  = String(object.maxDate).replace(/[^0-9]/g, "");  // 숫자 제외하고 제거

            // minDate
            if( _calendar.isDate(minDate) ){
                if( minDate.length == 8 ){
                    _calendar.minDate.year  = minDate.substring(0,4);
                    _calendar.minDate.month = minDate.substring(4,6);
                    _calendar.minDate.day  = minDate.substring(6);
                }
            }

            // maxDate
            if( _calendar.isDate(maxDate) ){
                if( maxDate.length == 8 ){
                    _calendar.maxDate.year  = maxDate.substring(0,4);
                    _calendar.maxDate.month = maxDate.substring(4,6);
                    _calendar.maxDate.day  = maxDate.substring(6);
                }
            }
        }

        // 달력 popup element 생성
        let HTML = `<div id="${idCal}" class="layerHTML"></div>`;
        $("body").append(HTML);

        _calendar.show( idCal, dateVal );
        $.ohyLayer({
            title: "날짜선택",
            content:`#${idCal}`,
            type:'calendar',
        });
    },

    /**
     * _calendar.show( idCal, dateVal ) : 달력 보이기
     * @param {string} idCal		    : 달력 팝업 내 DIV ID       (idCal)
     * @param {string} dateVal			: 기본 선택되어 있는 날짜    (20230223)
     */
     show : function( idCal, dateVal ){

        var strDate  = dateVal.replace(/[^0-9]/g, "");  // 숫자 제외하고 제거
        var year     = "";
        var month    = "";
        var date     = "";

        // 기본날짜 유효성 체크
        if( _calendar.isDate(strDate) ){
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
        
        _calendar.makeCalendar( idCal, year, month, date, dateVal );
    },

    /**
     * _calendar.makeCalendar( idCal, valY, valM, valD, dateVal ) : 달력 마크업 셋팅
     * @param {string} idCal		    : 달력 팝업DIV ID
     * @param {string} valY				: 년
     * @param {string} valM				: 월
     * @param {string} valD				: 일
     * @param {string} dateVal			: 날짜 초기값
     */
     makeCalendar : function( idCal, valY, valM, valD, dateVal ){

        //	전역변수에 설정값 저장
        _calendar.idCal   = idCal;
        _calendar.valY    = Number(valY);
        _calendar.valM    = Number(valM);
        _calendar.valD    = Number(valD);

        // 캘린더 담을 타겟 설정
        let calendar = $(`#${idCal}`);
        if( $(`#${idCal}-wrap`).length > 0 ){
            calendar = $(`#${idCal}-wrap`).parents(".ly_con");
        }

        //	해당월의 마지막 데이트 검증
        let valDD = _calendar.getLastDayOfMonth(valY,valM-1) < valD ? _calendar.getLastDayOfMonth(valY,valM-1) : valD;
        if( _calendar.valD != valDD ){
            _calendar.valD = valDD;
        }

        //	오늘날짜 설정용
        let strToday		= new Date();
        let strTodayYear	= strToday.getFullYear();
        let strTodayMonth	= strToday.getMonth() + 1;
        let strTodayDay		= strToday.getDate();

        let today    = new Date( _calendar.valY , _calendar.valM-1 , _calendar.valD );
        let year     = today.getFullYear();
        let nextyear = year +1;
        let lastyear = year -1;
        let month    = today.getMonth();
        let date     = today.getDate();
        // let strMonth = month+1 < 10 ? '0' + (month+1) : (month+1);
        let strMonth = String(month+1).padStart(2, "0");

        let strPreMonth		= (Number(strMonth)-1)+"";
        let strPreYear		= year;
        let strNextMonth	= (Number(strMonth)+1)+"";
        let strNextYear		= year;

        if( (Number(strMonth)-1) == 0 ){
            strPreMonth		= "12";
            strPreYear		= year-1;
        }else if( (Number(strMonth)+1) == 13 ){
            strNextMonth	= "1";
            strNextYear		= year+1;
        }

        //	txt 설정 
        let day = new Array("일","월","화","수","목","금","토");
        let txtYearMonth	=  `${year}.${strMonth}`;
        let txtCaption		= "달력";
        let txtConfirm		= "확인";
        // let txtCancle		= "취소";
        let txtToday		= "오늘";

        let firstOfMonth = new Date(year,month,1);
        let firstDay     = firstOfMonth.getDay();
        let lastDate     = _calendar.getLastDayOfMonth(year,month);

        let HTML = `
            <div class='ly_cnt' style='max-height: ${_calendar.maxH * 0.1}rem; min-height: ${_calendar.minH * 0.1}rem;'>
                <div class='ly_calendar' id='${idCal}-wrap'>
                    <div class='cal_month'>
                        <button type='button' class='btn_ico first' onclick="_calendar.makeCalendar( '${idCal}','${lastyear}','${strMonth}','${date}','${dateVal}' )" >
                            <span class='hidden'>전년도</span>
                        </button>
                        <button type='button' class='btn_ico prev' onclick="_calendar.makeCalendar( '${idCal}','${strPreYear}','${strPreMonth}','${date}','${dateVal}' )">
                            <span class='hidden'>이전달</span>
                        </button>
                        <span class='year_txt'>${txtYearMonth}</span>
                        <button type='button' class='btn_ico next' onclick="_calendar.makeCalendar( '${idCal}','${strNextYear}','${strNextMonth}','${date}','${dateVal}' )">
                            <span class='hidden'>다음달</span>
                        </button>
                        <button type='button' class='btn_ico end' onclick="_calendar.makeCalendar( '${idCal}','${nextyear}','${strMonth}','${date}','${dateVal}' )">
                            <span class='hidden'>다음년도</span>
                        </button>
                        <button type='button' class='today' onclick="_calendar.makeCalendar( '${idCal}','${strTodayYear}','${strTodayMonth}','${strTodayDay}','${dateVal}' )">
                            ${txtToday}
                            <span class='hidden'>선택</span>
                        </button>
                    </div>
                    <table id='${idCal}-table' class='cal_tbl'>
                        <caption>${txtCaption}</caption>
                            <thead>
                                <tr>
                                    <th scope='col' class='sunday'>${day[0]}</th>
                                    <th scope='col'>${day[1]}</th>
                                    <th scope='col'>${day[2]}</th>
                                    <th scope='col'>${day[3]}</th>
                                    <th scope='col'>${day[4]}</th>
                                    <th scope='col'>${day[5]}</th>
                                    <th scope='col' class='saturday'>${day[6]}</th>
                                </tr>
                            </thead>
                            <tbody>
        `;

        let dayNum    = 1;
        let curCol    = 1;
        let weekcount = 0;
        let todayClass = '';

        // loop
        for (let i=1; i<=Math.ceil((lastDate + firstDay)/7); i++) {
            HTML += `<tr>`;
            for( var j=1; j<=7; j++ ){
                // 요일설정
                if(j == 1) {              HTML += `<td class='sunday'>`;
                } else if (j == 7) {      HTML += `<td class='saturday'>`;
                } else {                  HTML += `<td>`;
                }

                weekcount = weekcount + 1;

                if( curCol < firstDay + 1 || dayNum > lastDate ){
                    HTML += `&nbsp;`;
                    curCol ++;
                }else{
                
                    todayClass = (  strTodayYear == year && strTodayMonth == strMonth && strTodayDay == dayNum ) ? 'today' : '';

                    // min, max
                    let disabled = '';
                    if( year < _calendar.minDate.year || year > _calendar.maxDate.year ) disabled = "disabled";
                    if( strMonth < _calendar.minDate.month || strMonth > _calendar.maxDate.month )disabled = "disabled";
                    if( ( year == _calendar.minDate.year && strMonth == _calendar.minDate.month && dayNum < _calendar.minDate.day )
                     || ( year == _calendar.maxDate.year && strMonth == _calendar.maxDate.month && dayNum > _calendar.maxDate.day ) ) disabled = "disabled";
                    
                    // minDate = 00000000
                    if( _calendar.minDate.year == 0 ){
                        if( year < _calendar.maxDate.year ) disabled = '';
                    }
                    // maxDate = 9999
                    if( _calendar.maxDate.year == 9999 ){
                        if( year > _calendar.minDate.year ) disabled = '';
                        if( year == _calendar.minDate.year && strMonth > _calendar.minDate.month ) disabled = '';
                    }

                    if( dayNum == date ) {
                        HTML += `<button type='button' class='on ${todayClass}' title='선택 됨' onclick="_calendar.selectDay( this,'${idCal}','${year}','${strMonth}','${dayNum}' )" ${disabled}>${dayNum}</button>`;
                    }else{
                        switch( j ){
                            default :
                            // if( strTodayYear == year && strTodayMonth == strMonth && strTodayDay == dayNum ){ todayClass = 'today' }
                            HTML += `<button type='button' class='${todayClass}' onclick="_calendar.selectDay( this,'${idCal}','${year}','${strMonth}','${dayNum}' )" ${disabled}>${dayNum}</button>`;
                        }
                    }
                    dayNum++ ;
                }
                HTML += `</td>`;
            }
            HTML += `</tr>`;
        }

        HTML += `
                            </tbody>
                    </table>
                </div>
            </div>
            <div class='btn_pop_confirm_wrap'>
                <div class='btn_area'>
                    <button type='button' class='btn primary' onclick="_calendar.setYMD( '${idCal}' )" >${txtConfirm}</button>
                </div>
            </div>
        `;

        calendar.html(HTML);
    },
    
    /**
     * _calendar.selectDay( obj, idCal, idDate, valY, valM, valD ) : 달력에서 선택한 년월일을 전역 변수에 저장
     * @param {Object} obj		: DOM object
     * @param {Object} idCal	: DOM ID
     * @param {Object} valY		: 년 Value
     * @param {Object} valM		: 월 Value
     * @param {Object} valD		: 일 Value
     */
    selectDay : function( obj, idCal, valY, valM, valD ){

        $("#"+idCal+"-table").find("button").removeClass("on");
        $("#"+idCal+"-table").find("button").removeAttr("title");
        $(obj).attr("title", "선택 됨");
        $(obj).addClass("on");

        _calendar.idCal   = idCal;
        _calendar.valY    = valY;
        _calendar.valM    = valM;
        _calendar.valD    = valD;
    },
    
    /**
     * _calendar.setYMD( idCal ) : 달력에서 선택한 년월일을 idInput value에 리턴 후 팝업 닫기
     * 선택된 버튼이 disabled일 경우 확인버튼 작동 안함
     * @param {string} idCal 
     */
    setYMD : function( idCal ){

        let disabled = $(document).find(`#${idCal}-table tbody button.on`).prop("disabled");
        if( disabled ){ return }

        var idCal  = _calendar.idCal;
        var idInput = _calendar.idInput;
        var valY   = String(_calendar.valY);
        var valM   = String(_calendar.valM).padStart(2, "0");
        var valD   = String(_calendar.valD).padStart(2, "0");

        if( idInput != '' ){
            $(`#${idInput}`).val(`${valY}${_calendar.format}${valM}${_calendar.format}${valD}`);
            $(`#${idInput}`).attr("data-date", `${valY}${valM}${valD}`);
            $(`#${idInput}`).keyup();   // btn_clear
        }

        this.onclose( idCal );
    },

    /**
     * _calendar.onclose( idCal ) 해당 id를 가진 달력 팝업을 닫음
     * @param {string} idCal       : close 버튼 id
     */
    onclose : function( idCal ){
        var idCal  = _calendar.idCal;        
        $(`#${idCal}_dev`).click();
    },

    /**
     * _calendar.getLastDayOfMonth( year, month ) 해당 년월의 마지막일 계산
     * @param   {number} year       : 년    (2023)
     * @param   {number} Month      : 월    (2)
     * @returns {number}            : 마지막날짜 (31)
     */
    getLastDayOfMonth : function( year, month ){
        var tempDay = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
        if( ((year %4 ==0) && (year%100!=0)) || (year%400 ==0) ) tempDay[1] = 29;
        else tempDay[1] = 28;
        return tempDay[month];
    },

    /**
      * _calendar.isDate( yyyymmdd ) : 날짜 유효성 체크(병합된 yyyymmdd 값)
      * @param  {string} yyyymmdd   : 검증 문자열
      * @return {boolean}
      */
    isDate : function(yyyymmdd){
        var isTrue = false;
        if ( _calendar.isNumStr(yyyymmdd)) {
            var yyyy = eval(yyyymmdd.substring(0,4));
            var mm = eval(yyyymmdd.substring(4,6));
            var dd = eval(yyyymmdd.substring(6,8));
            if ( _calendar.isYearMonthDay(yyyy,mm-1,dd))isTrue = true;
        } else if (yyyymmdd == "") {
            isTrue = false;
        }
        return isTrue;
    },

    /**
     * _calendar.isNumStr( value ) : 숫자로 구성된 문자열 체크
     * @param  {Object} value : 검증 문자열
     * @return {boolean}
     */
    isNumStr : function (value){
        var ii;
        var str = null;
        str = new String(value);
        if(str == null || str.length == 0) return false;
        for(ii = 0; ii < str.length; ii++){
            if(!_calendar.isInt(str.charAt(ii)))
            return false;
        }
        return true;
    },

    /**
      * _calendar.isInt( value ) : 한 글자가 숫자인지 체크
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
      * _calendar.isYearMonthDay( yyyy, mm, dd ) : 날짜 유효성 체크(분리된 yyyy, mm, dd 값)
      * @param  {Object} yyyy : 검증 문자열
      * @param  {Object} mm   : 검증 문자열
      * @param  {Object} dd   : 검증 문자열
      * @return {boolean}
      */
     isYearMonthDay : function (yyyy, mm, dd){
        var isTrue = false;
        var iMaxDay = _calendar.getLastDayOfMonth(yyyy, mm);
        if ( yyyy == "" && mm == "" && dd == "" ) {
            isTrue = true;
        } else {
            if ( (yyyy >= 1901) && (yyyy <= 9999) && (mm >= 0) && (mm <= 11) && (dd >= 1) && (dd <= iMaxDay) )
            isTrue = true;
        }
        return isTrue;
     },
}


// toast
$.toast = function(options){
    if( typeof options !== "object" ){ return; }
    if( options.content === undefined || options.content === "" ){ return; }

    // type check
    let type = "bottom";
    options.type === "top" ? type ="top" : type = "bottom";

    // toast_group
    $(document).find(`.toast_group.${type}`).length < 1
        ?  $("body").append(`<div class="toast_group ${type}" role="alert" aria-live="assertive" aria-atomic="true"></div>`)
        : null;

    // toast_item
    let content = options.content;
    let html = `
        <div class="toast_item">
            <div class="toast_body">${content}</div>
            <div class="toast_func">
                <button type="button" class="toast_close"><span class="blind">닫기</span></button>
            </div>
        </div>
    `;
    $(document).find(`.toast_group.${type}`).append(html);

    // remove
    setTimeout(() => {
        $(".toast_group").children().first().length >= 1 ? $(".toast_group").children().first().remove() : null;

        const top = $(document).find(".toast_group.top");
        top.children().length < 1 ? top.remove() : null;

        const bottom = $(document).find(".toast_group.bottom");
        bottom.children().length < 1 ? bottom.remove() : null;
    }, 3000);
}

// toast remove
$(document).on("click", ".toast_close", function(){
    const toast_group = $(this).parents(".toast_group");
    $(this).parents(".toast_item").remove();
    toast_group.children().length < 1 ? toast_group.remove() : null;
})


var _layout = {
    init: function(){
        _layout.headerMain();
        _layout.headerSub();
        _layout.getPad();
    },
    headerMain: function(){
        const mainScrollTop = function(){
            if( _front.isSub() ) return;    // 서브 예외처리

            // 팝업이 떠있는지 체크
            let isPopup = $(document).find(".layer_wrap").length > 0;
            if(isPopup) return;

            const mainScroll = $(".header");
            const scroll = $(document).scrollTop();
            scroll > 10 ? mainScroll.addClass("on") : mainScroll.removeClass("on");
        }
        mainScrollTop();
        $(document).on("scroll", mainScrollTop );
    },
    headerSub: function(){
        
        // h1.title width
        const getH1Layout = function(){

            if( _front.isMain() ) return;     // 메인 예외처리
            if( !_front.isSub() ) return;     // 서브 아니면 예외처리 (ia error 대응)
            
            let headerinnerW = $(document).find(".header .inner_sub").width();
            let headerInnerPadL = $(document).find(".header .inner_sub").css("padding-left").replace("px", "") * 1;
            let headerBackAreaW = $(document).find(".header .back_area").width();
            headerBackAreaW = headerBackAreaW > 10 ? headerBackAreaW /* + 5 */ : headerBackAreaW; // 5px 삭제요청
            let headerBtnAreaW = $(document).find(".header .btn_area").outerWidth(true);
            let maxW = headerinnerW - headerBackAreaW - headerBtnAreaW - 10;
            let left = headerInnerPadL + headerBackAreaW;
            $(document).find(".container .content h1.title").css({
                "max-width": `${maxW}px`,
                "left" : `${left}px`,
            });
        }

        // pageTitle
        const pageTtl = $(".content h1.title");
        const onPageTtl = function(){
            if( _front.isMain() ) return;               // 메인 예외처리
            if( $(".layer_wrap").length > 0 )return;    // 팝업 떠있을때 예외처리
            const scroll = $(document).scrollTop();

            if( scroll > 60 ){
                pageTtl.removeClass("hidden");
            } else {
                pageTtl.addClass("hidden");
                if( $(document).find(".layer_wrap").length > 0 ){
                    pageTtl.removeClass("hidden");
                }
            }
        }

        setTimeout(() => {
            getH1Layout();
            onPageTtl();
        }, 1);
        
        $(window).on("resize", getH1Layout );
        $(document).on("scroll", onPageTtl );
    },

    /**
     * progress_wrap 있을때 .content 패딩처리
     */
    getPad: function(){
        
        const proBar = $(".progress_wrap");
        if( proBar.length > 0 ){
            setTimeout(() => {
                const proBarH = proBar.outerHeight(true);
                const content = $(".content");
                const contentPadT = _frontFormatter.Number(content.css("padding-top"));
                let padTop = contentPadT + proBarH;

                content.css({"padding-top" : `${padTop}px`});
                
            }, 0);
        }
    }
}


var _front = {
    init : function(){
        _front.OSchk();             // os check
        _front.accessibility();     // accessibility code
        _front.formBtn();           // input button setting
        _front.formTimer();         // input timer setting
        _front.form();
        _front.switch();
        _front.expandedSelect();    // expanded select
        _front.cardItem();
        _front.bottom_select();
        _front.step();
        _front.isKeyboard();

        $(document).on("click", "a[href='#'], a[href='#none']", function(e){ e.preventDefault();});

        // ios 대응 button, a 클릭 시 focus 이동
        $(document).on("click", "button, a", function(){ this.focus() })

    },
    OSchk: function(){
        const elem = $("body");
        const userAgent = navigator.userAgent;
        const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const ios = /iPhone|iPad|iPod/i;
        const iosApp = /liivm_ios/i;
        const aos = /Android/i;
        const aosApp = /liivm_android/i;
        
        ( mobile.test(userAgent) ) ? elem.addClass("mobile") : null;
        ( ios.test(userAgent) ) ? elem.addClass("ios") : null;
        ( iosApp.test(userAgent) ) ? elem.addClass("ios_app") : null;
        ( aos.test(userAgent) ) ? elem.addClass("aos") : null;

        // aos_app 일때
        if ( aosApp.test(userAgent) ) {
            elem.addClass("aos_app");
            
            // aosApp safe area top 처리
            if ( !navigator.userAgent.includes("sh=") ) return;     // sh= 없을때 예외처리
            let sh = navigator.userAgent.split("sh=");
            sh = sh[sh.length-1]*1;
            sh = Math.floor(sh);
            if( isNaN(sh) ) return;     // NaN 예외처리
            document.documentElement.style.setProperty('--sat', `${sh}px`);
        };
        
    },
    isKeyboard: function(e){
        if( !$("body").hasClass("mobile") ) return;     // 모바일이 아닐 때 예외처리

        let target = "input[type=text], input[type=date], input[type=number], input[type=password], input[type=email], input[type=tel], input[type=url], input[type=search], textarea";

        $(document).on("focus", target, function(e){
            let elem = $(e.target);
            if(
                elem.prop("readonly")
                || elem.prop("disabled")
                || elem.hasClass("readonly")
                || elem.hasClass("disabled")
                || elem.hasClass("nppfs-npv")
            ) return;  // readonly, disabled 예외처리
            
            $("body").addClass("keyboard-on");
            $(window).resize();     // resize 이벤트 추가
        });
        $(document).on("blur", target, function(){
            $("body").removeClass("keyboard-on");
            $(window).resize();     // resize 이벤트 추가
        });
    },
    isMain: function(){
        return $(document).find(".inner_main").length > 0;
    },
    isSub: function(){
        return $(document).find(".inner_sub").length > 0;
    },
    formBtn: function(){
        let btn = {
            'btn_check' : '중복확인',
            'btn_address' : '주소검색',
            'btn_search' : '검색',
            'btn_camera' : '카메라 열기',
            'btn_auth' : '인증번호 발송',
            'btn_auth_confirm' : '인증확인',
            'btn_acc' : '계좌발급',
            'btn_date' : '날짜선택',
            'btn_s_date' : '시작일 선택',
            'btn_e_date' : '종료일 선택',
        };
        for (let [item, text] of Object.entries(btn) ){
            button = `<button type="button" class="btn_type">${text}</button>`;
            $(document).find(`.form_item .item_content.${item}`).append(button);
        }
    },
    formTimer: function(){
        $(document).find(".form_item .item_content.js_timer").each((idx, item)=>{
            $(item).append("<span class='timer'>07:00</span>");
        })
    },
    form : function(){
        var _doc = $(document);

        const _input = {
            init : function(elem){
                elem.parents(".form_item")
                    .removeClass("error");

                elem.parents(".item_content")
                    // .removeClass("done")
                    .removeClass("focus")
                    .removeClass("error")
                    .removeClass("focus");
                    
                elem.parents(".form_group").find(".form_error").html("");
            },
    
            focus : function(elem){
                if( this.isDisabled(elem) ){ return; }
                elem.parents(".item_content").addClass("focus");
            },
    
            blur : function(elem){
                if( this.isDisabled(elem) ){ return; }
                
                this.init(elem);

                if(this.done(elem)){
                    elem.parents(".item_content").addClass("done");
                } else {
                    elem.parents(".item_content").removeClass("done");
                }
    
                const reqChk = elem.parents(".form_item").hasClass("req");
                const reqChild = elem.parents(".form_item").find("input").filter((idx, item)=> $(item).val().length < 1 );
                ( reqChk && reqChild.length > 0 ) ? this.req(elem) : null;
            },
    
            done : function(elem){
                const doneChk = elem.val();
                let result = (doneChk.length > 0) ? true : false;
                return result;
            },
    
            error : function(elem){
                !errorChk(elem.val()) ? elem.parents(".item_content").addClass("error") : null;

                const errChk = elem.parents(".form_item").find("input").filter((idx, item)=> !errorChk($(item).val()) );
                if( errChk.length > 0 ){
                    elem.parents(".form_item").addClass("error");
                    elem.parents(".form_group").find(".form_error").html("에러문구 영역입니다.");
                }
            },
    
            req : function(elem){
                const child = elem.parents(".form_item").find(".input input");
                child.each((idx, item)=>{
                    const input = $(item).parents(".item_content");
                    $(item).val().length < 1 ? input.addClass("error") : input.removeClass("error");
                })
                elem.parents(".form_item").addClass("error");
                elem.parents(".form_group").find(".form_error").html("필수 입력 사항입니다.");
            },
    
            isDisabled : function(elem){
                let result = false;
                if(
                    elem.prop("readonly")
                    || elem.prop("disabled")
                    || elem.hasClass("readonly")
                    || elem.hasClass("disabled")
                    // || elem.hasClass("nppfs-npv")
                ){
                    result = true;
                }

                return result;
            }
        }

        //input init
        $(".input input").each(function(e){
            ($(this).val().length > 0) ? $(this).parents(".item_content").addClass("done") : null;  // load시 value값 체크

            _doc.off("keyup", ".input input").on("keyup", ".input input", function(){
                var _this = $(this);
                var _form_item = _this.parents(".form_item");
                var _parent = _this.parents(".input");

                if( !_this.is(':not([type=tel])') && _this.is('[readonly], [disabled]') ){ return; }

                //input clear 추가
                _parent.find('.btn_clear').remove();
                if( !(_parent.hasClass("no_clear") || _form_item.hasClass("card_type") || _input.isDisabled(_this)) ){
                    _parent.append('<button type="button" class="btn_clear"><span class="hidden">입력내용 초기화</span></button>');
                    if( _this.val() == '' ){
                        // _this.css({'padding-right' : ''});
                        _this.css({'width' : ''});
                        _parent.find('.btn_clear').hide();
                    } else {
                        // _this.css({'padding-right' : '2rem'});
                        _this.css({'width' : 'calc(100% - 2rem)'});
                        _parent.find('.btn_clear').show();
                    }
                }
            })
            .off('click', '.input .btn_clear').on("click", ".input .btn_clear", function(){
                var _this = $(this);
                var _parent = _this.parent(".input");
                var _input = _parent.find("input");

                // _parent.css({'padding-right': 0});
                // _input.css({'padding-right': 0});
                _input.css({'width' : ''});
                _this.hide().siblings('input').val('').focus();
            })
            .off("focus", ".input input").on("focus", ".input input", function(){ _input.focus($(this)) })
            .off("blur", ".input input").on("blur", ".input input", function(){ _input.blur($(this)) })
        });

    },
    switch : function(){
        let switchItem = $(document).find(".switch_item");

        switchItem.each((idx, item)=>{
            const checkbox = $(item).find("input[type='checkbox']")
            let text = checkbox.is(":checked") ? "활성화" : "비활성화";
            $(item).find("label .blind").text(text);
    
            // change
            $(item).off("change").on("change", function(){
                text = checkbox.is(":checked") ? "활성화" : "비활성화";
                $(item).find("label .blind").text(text);
            })
        })
    },
    /**
     * 클릭 시 아래로 늘어나는 .btn_select
     * .form_group 안에 .select_inline 클래스가 있는지 체크 후,
     * 그 조건에 해당하는 .btn_select 에만 접근성마크 추가 및 클릭 이벤트 부여
     */
    expandedSelect : function(){
        // s : 접근성 수정
        if($(".btn_select").length) {
            $(".btn_select").each(function(){
                if($(this).closest(".form_group").find(".select_inline").length) {
                    var _this = $(this).closest(".form_group").find(".select_inline");
                    if(_this.length <= 0) return;
                    $(this).hasClass("on") ? $(this).attr('aria-expanded', 'true') : $(this).attr('aria-expanded', 'false');
                    if(_this.hasClass("notclose")) return;
                    $(this).hasClass("checked") ? $(this).attr('aria-selected', 'true') : $(this).attr('aria-selected', 'false');
                } else {
                    // $(this).attr("aria-haspopup", true);
                }
            });
        }
    
        if($(".select_inline").length) {
            $(".select_inline").each(function(){
                var _this = $(this).find('a');
                _this.hasClass("on") ? _this.attr('aria-selected', 'true') : _this.attr('aria-selected', 'false');
            });
        }
    
        // droptype
        $(document).on("click", ".btn_select[aria-expanded]", function(e){
            if( $(this).hasClass("readonly") || $(this).hasClass("disabled") || $(this).attr("readonly") || $(this).attr("disabled")) return;
            
            const _this = $(this).closest('.item_content').index();
            const _thisNot = $(this).closest('.item_content').prevAll(':not(.item_content)').length;
            const _thisIndex = _this - _thisNot;
            const select = $(this).closest(".form_group").find(".select_inline").eq(_thisIndex);
    
            $(this).closest('.form_item').find(".btn_select").removeClass("on").attr('aria-expanded', 'false');
            $(this).closest(".form_group").find(".select_inline").slideUp();
            select.css("display") == "none" ? $(this).addClass("on").attr('aria-expanded', 'true') : $(this).removeClass("on").attr('aria-expanded', 'false');
            select.css("display") == "none" ? select.slideDown() : select.slideUp();
        })

        $(document).on("click", ".select_inline li a", function(e){
            e.preventDefault();
            const _this = $(this).closest('.select_inline').index();
            const _thisNot = $(this).closest('.select_inline').prevAll(':not(.select_inline)').length;
            const _thisIndex = _this - _thisNot;
            const select = $(this).closest(".select_inline");
            const isClose = !$(this).closest(".select_inline").hasClass("notclose");
            
            $(this).attr('aria-selected', 'true').closest("li").addClass("on").siblings("li").removeClass("on").find("a").attr('aria-selected', 'false');
            $(this).closest(".form_group").find('.item_content').eq(_thisIndex).find(".select button").text($(this).attr("title"));
            
            if(isClose) {
                select.slideUp();
                $(this).closest(".form_group").find('.item_content').eq(_thisIndex).find(".select button").removeClass("on").attr('aria-expanded', 'false').attr('aria-selected', 'true').addClass("checked").focus();
            }
        })
        // e : 접근성 수정
    },
    /**
     * 접근성 코드 추가
     *      hr                  : aria-hidden="true"
     *      .layerHTML          : aria-hidden="true" role="dialog"
     *      .droptype_btn       : aria-haspopup="true"
     *      .btn_sort           : aria-haspopup="true"
     *      .btn_select         : aria-haspopup="true" ( 아래로 늘어나는 btn_select 제외 )
     */
    accessibility: function(){   // 클릭 시 팝업

        $('hr').attr('aria-hidden','true'); // hr aria-hidden

        $('.layerHTML').attr('aria-hidden','true').attr('role','dialog');   // modal popup

        // droptype_btn
        let droptypeBtn = $(document).find(".droptype_btn_wrap .droptype_btn");
        droptypeBtn = droptypeBtn.filter((idx, item)=> !$(item).hasClass("no_item") )       // no_item 클래스 제외
                    .filter((idx2, item2)=> !$(item2).hasClass("right_type") )              // right_type 클래스 제외
                    .filter((idx3, item3)=> !$(item3).hasClass("readonly") )                // readonly 클래스 제외
                    .filter((idx4, item4)=> $(item4).attr("id") != undefined );             // id 없는것 제외
        droptypeBtn.attr("aria-haspopup", true);

        // .btn_sort (인기순~)
        $(document).find(".data_sort .btn_sort").each((idx, item)=>{
            if( $(item).hasClass("readonly") || $(item).hasClass("disabled") ) return;
            $(item).attr("aria-haspopup", true);   // 접근성 추가
        })

        // .btn_select ( 아래로 늘어나는 .btn_select 제외 )
        let btnSelect = $(document).find(".form_group .select .btn_select");
        btnSelect = btnSelect.filter((idx, item)=> $(item).prop("disabled") == false )      // disabled true 제외
                    .filter((idx2, item2)=> $(item2).attr("aria-expanded") == undefined )   // aria-expanded 제외
                    .filter((idx3, item3)=> $(item3).attr("id") != undefined );             // id 없는것 제외
        btnSelect.attr("aria-haspopup", true);

        // 요금제메인 필터 팝업
        $("#btnUserFilter").attr("aria-haspopup", true);

    },
    cardItem: function(){
        $(document).off("click", ".card_select_wrap .card_item").on("click", ".card_select_wrap .card_item", function(){
            $(this).addClass('on').siblings('.card_item').removeClass('on');
        })
    },
    bottom_select: function(){
        // selectbox bottom popup
        $(document).on("click", ".bottom_select li a", function(){
            $(this).parents(".bottom_select").find("li").removeClass("on");
            $(this).parents("li").addClass("on");
        })
    },
    step: function(){

        let param = window.location.href;
        let isRateplan = param.includes('/rateplan/');

        if($("ol.progress_wrap").length) {
            if(isRateplan){     // 요금제 진단하기
                getCheckPlanStep();

            } else {        // 가입
                $("ol.progress_wrap").each(function(){
                    $(this).before("<style>ol.progress_wrap .step .blind {display:none} ol.progress_wrap .step.on .blind {display:block}</style>");
                    $(this).find("li.step").prepend("<span class='blind'>현재단계</span>");
                });
            }
        }
    
        if($(".join_comp_dia").length) {
            $(".join_comp_dia").each(function(){
                $(this).find(".comp_dia.on .comp_dia_div").prepend("<span class='blind'>현재단계</span>");
            });
        }
    
        if($(".open_step").length) {
            $(".open_step").each(function(){
                $(this).find(".step_item.ing").prepend("<span class='blind' style='position:absolute;top:0;left:0;width:1px;margin:0;'>현재단계</span>");
            });
        }
    }
};

/**
 * 요금제 진단하기 단계설정
 */
const getCheckPlanStep = function(){
    let stepLength = $(document).find(".progress_wrap .step").length;
    $(document).find(".progress_wrap .step").each((idx, item)=>{
        let step = idx+1;
        let isCnt = $(item).hasClass("on") ? ", 현재단계" : "";
        $(item).find("span").remove();
        $(item).append(`<span>${stepLength}단계 중 ${step}단계${isCnt}</span>`);
        console.log(`${step} / ${stepLength} ${isCnt}`);
    })
}


// ios keyboard open && touch event
$(window).on("touchstart", function(e){
    if(    $("body").hasClass("ios")
        && $("body").hasClass("keyboard-on")
        && $(document).find(":focus").parents(".layer_wrap").length > 0
    ){
        let result = isInputTouch(e.target);    // false를 반환했을 때 blur처리
        if( !result ) $(document).find(":focus").blur();
    }
})


/**
 * @param {*} target element 
 * @returns 터치영역의 target을 체크하여 false를 반환하면 :focus blur 처리된다.
 */
const isInputTouch = function(target){
    let result = false;

    const isFormItem = $(target).parents(".form_item").length > 0;  // form_item 영역을 touch 했는지 체크
    if( !isFormItem ) return false;

    const btnClear = $(target).hasClass("btn_clear");   // btn_clear를 touch했을때 return false
    if( btnClear ) return true;

    let inputType = ["text", "date", "number", "password", "email", "tel", "url", "search", "textarea"];
    let check = [];

    const isInput = target.nodeName == "INPUT";     // target이 INPUT tag 인지 체크
    if( isInput )       check = inputType.filter((item, idx)=> $(target).attr("type") == item );
    else {              check = inputType.filter((item, idx)=> $(target).find(`input[type=${item}]`).length > 0 );
    }

    if( check.length > 0 ) result = true;

    return result;
}





// aside_menu
const _aside = {
    isClick: false,     // nav_list 클릭인지 체크 (클릭 인 경우 true, 스크롤이벤트 무시)
    isSticky: false,
    navTop: 0,
    gnbPath: [],
    init: function(){        
        if( $(document).find(".aside_wrap").length < 1 ){ return };

        $(document).find(".aside_wrap").css('visibility', 'hidden'); // 접근성 추가
        $(document).find(".aside_wrap").attr("aria-hidden", true);

        _aside.set();
        _aside.reset();
    },
    set: function(){

        // [05/08] [앱접근성] asidemenu close target a tag 추가
        let asideCloseFocus = _front.isMain() ? "inner_main" : "inner_sub";
        setTimeout(() => {
            // main과 sub close_aside 분리
            if( _front.isMain() ){
                $(document).find(`.header h1.title a`).attr("id", "close_aside").attr("tabindex", 1);     // [05/15] name속성 id로 교체
            } else {
                $(document).find(".container .content h1.title").each((idx, item)=>{
                    const title = $(item).text();
                    $(item).html(`<a id="close_aside">${title}</a>`)
                    $(item).attr("tabindex", 1);     // [05/15] name속성 id로 교체
                })
            }
            $(document).find(`.header .aside_wrap .aside_head .title`).html(`<a id="open_aside">전체</a>`);             // [05/15] name속성 id로 교체
        }, 0);

        $(document).find(".header .nav_list li a").each((idx, item)=>{
            $(item).attr("href", `#nav_${idx}`).attr("role", "button");     // [05/15] role 속성 추가
            let tit = $(document).find(".header .menu_area .menu_list > li").eq(idx).find(".title");
            let menu = tit.text();
            tit.html(`<a id="nav_${idx}">${menu}</a>`);     // [05/15] name속성 id로 교체
        })

    },
    reset: function(){
        if( $(document).find(".aside_wrap").length < 1 ){ return };

        let body = $(document).find(".aside_body");
        let nav = $(document).find(".nav_area");

        body.scrollTop(0);
        nav.scrollTop(0);
        
        _aside.navTop = Math.ceil(nav.position().top);  // ceil
        
        setTimeout(() => { _aside.getGnbPath() }, 0);   // menuY값 여백오류 대응
    },
    open: function(){
        $(document).find(".aside_wrap").css('visibility', 'visible');   // 접근성 추가
        $(document).find(".aside_wrap").attr("aria-hidden", false);

        $(document).find(".inner_main").attr("aria-hidden", true);
        $(document).find(".inner_sub").attr("aria-hidden", true);
        $(document).find(".container").attr("aria-hidden", true);
        $(document).find(".footer").attr("aria-hidden", true);
        
        $(document).find(".btm_gnb").attr("aria-hidden", true);
        $(document).find(".kbplus_wrap").attr("aria-hidden", true);
        $(document).find(".go_kbplus").attr("aria-hidden", true);
        $(document).find(".go_chatbot").attr("aria-hidden", true);

        $(document).find('.header').find('.aside_wrap').addClass('on');
        $('body').addClass('no_scroll');
        
        _aside.reset(); // reset

        // 포커스 이동
        $(document).find("a#open_aside").attr("tabindex", 1).focus();                       // [05/15] name속성 id로 교체
        setTimeout(() => { $(document).find("a#open_aside").removeAttr("tabindex") }, 0);   // [05/15] name속성 id로 교체

        console.log('open', $(":focus"));
    },
    close: function(){
        $(document).find('.aside_wrap').removeClass('on');
        $('body').removeClass('no_scroll');
        $(document).find(".aside_wrap").attr("aria-hidden", true);

        $(document).find(".inner_main").removeAttr("aria-hidden");
        $(document).find(".inner_sub").removeAttr("aria-hidden");
        $(document).find(".container").removeAttr("aria-hidden");
        $(document).find(".footer").removeAttr("aria-hidden");
        
        $(document).find(".btm_gnb").removeAttr("aria-hidden");
        $(document).find(".kbplus_wrap").removeAttr("aria-hidden");
        $(document).find(".go_kbplus").removeAttr("aria-hidden");
        $(document).find(".go_chatbot").removeAttr("aria-hidden");

        setTimeout(() => { $(document).find(".aside_wrap").css('visibility', 'hidden') }, 200); // 접근성 추가

        $(document).find("a#close_aside").attr("tabindex", 1).focus();                          // [05/15] name속성 id로 교체
        setTimeout(() => { $(document).find("a#close_aside").removeAttr("tabindex") }, 0);      // [05/15] name속성 id로 교체

        console.log('close', $(":focus"));
    },
    sticky: function(){
        let scrollTop = $(".aside_body").scrollTop();
        let head = $(document).find(".aside_head");
        let body = $(document).find(".aside_body");

        (scrollTop > 10 ) ? head.addClass("on") : head.removeClass("on");
        (scrollTop >= _aside.navTop) ? body.addClass("sticky") : body.removeClass("sticky");
        _aside.isSticky = (scrollTop >= _aside.navTop) ? true : false;

        let navH = $(document).find(".nav_area").outerHeight(true);
        let manu = $(document).find(".menu_area");
        _aside.isSticky ? manu.css({"margin-top": `${navH}px`}) : manu.css({"margin-top": 0});
    },
    navActive: function(target){

        // 클릭 시에만 focus 이동
        if( target != undefined ){
            let targetId = target.attr("href").replace("#", "");
            $(document).find(`a#${targetId}`).attr("tabindex", 1).focus();      // [05/15] name속성 id로 교체
            $(document).find(`a#${targetId}`).removeAttr("tabindex");           // [05/15] name속성 id로 교체
        }


        if( _aside.isClick ) return;     // nav_list 클릭인지 체크 (클릭 인 경우 true, 스크롤이벤트 무시)
        $(".nav_list li a").removeClass("on");

        const ScrollTop = $(".aside_body").scrollTop();
        const length = _aside.gnbPath.length - 1;
        const gap = $(".aside_wrap .menu_list > li:eq(1)").css("padding-top").replace("px", "") * 1;
        let count = length;

        while ( count ){
            if( ScrollTop >= _aside.gnbPath[count].menuY - gap ){ break }
            count--;
        }

        _aside.endScrollChk() ? count = length : count;

        $(document).find(`.aside_wrap .nav_list li:eq(${count}) a`).addClass("on");
        $(".nav_list").stop().animate({scrollLeft : _aside.gnbPath[count].tabX}, 300);
    },
    endScrollChk: function(){   // 마지막 메뉴 예외처리
        let ScrollTop = Math.round($(document).find(".aside_body").scrollTop());
        
        let bodyH = $(document).find(".aside_body").height();
        let bodyScroll = $(document).find(".aside_body").prop("scrollHeight");

        let cntScroll = Math.floor(bodyScroll - bodyH);

        if( ScrollTop >= cntScroll )return true;

        return false;
    },
    getGnbPath: function(){
        _aside.gnbPath = [];

        let docCenter = $(document).width() / 2;
        let nav = $(document).find(".aside_wrap .nav_area .nav_list > li");
        let menu = $(document).find(".aside_wrap .menu_area .menu_list > li");

        let removeLeft = $(document).find(".aside_wrap .nav_area .nav_list").css("padding-left").replace("px", "") * 1; // 20
        let removeTop = $(document).find(".aside_wrap .nav_area").outerHeight(true);

        for(let i=0; i<menu.length; i++){

            let getX = (nav.eq(i).find("a").position().left) - removeLeft - docCenter;
            getX = getX + (nav.eq(i).find("a").outerWidth(true) / 2);

            let getY = (menu.eq(i).find(".title").position().top) - removeTop;
            
            _aside.gnbPath.push({});
            _aside.gnbPath[i].tabX = Math.floor(getX);
            _aside.gnbPath[i].menuY = Math.floor(getY);
        }
    }
};

let appOpt = {};	// APP용 req
//APP메뉴 이벤트 바인딩을 위해 class로 변경	by S020781
//호출 예 (페이지 로딩 후 호출해야 함)
// $(()=>{
//     let menu = new AsideMenu();
//     menu.init();
// })
class AsideMenu{

	init(){
        const mediaQuery = window.matchMedia('(max-width:9999px)');     // font-size:10px
        const mediaQuery360 = window.matchMedia('(max-width:360px)');   // font-size:10px
        const mediaQuery320 = window.matchMedia('(max-width:320px)');   // font-size:9px
        const mediaQuery280 = window.matchMedia('(max-width:280px)');   // font-size:8px
        
        _aside.init();

	    $(window).on("resize orientationchange", function(e){
            setTimeout(() => { _aside.reset() }, 0);

            let time = 150;
            if(  mediaQuery280.matches ){           mediaQuery280.onchange = function(e){ setTimeout(() => { _aside.reset() }, time); }
            } else if ( mediaQuery320.matches ){    mediaQuery320.onchange = function(e){ setTimeout(() => { _aside.reset() }, time); }
            } else if ( mediaQuery360.matches ){    mediaQuery360.onchange = function(e){ setTimeout(() => { _aside.reset() }, time); }
            } else if ( mediaQuery.matches ){       mediaQuery.onchange = function(e){ setTimeout(() => { _aside.reset() }, time); }
            }
        });
	    
	    $(".aside_body").on("scroll", function(){
            _aside.sticky();
            _aside.navActive();
        } );

	    // aside menu > nav click event
	    let Navs = $(document).find(".nav_list li a");        
        Navs.on("click", function(e){
            const _this = $(this);
            _aside.isClick = true;
            let idx = $(document).find(".nav_list li a").index(_this);
            $(".aside_body").stop().animate({scrollTop : _aside.gnbPath[idx].menuY }, 300, function(){
                _aside.isClick = false;
                _aside.navActive(_this);
            });
        })

	    // aside menu click event
	    // APP WEB 메뉴 이벤트 정의 by S020781
	    $('.btn_open_aside, .js_aside').on('click', function(){
	    	appOpt.action_code = 'A0205';	// APP GNB OFF
	    	if(getOsInfo() === 'ios_app'){
	    		window.webkit.messageHandlers.webAction.postMessage(appOpt);
	    	}else if(getOsInfo() === 'android_app'){
	    		appOpt.action_param =  {isMenu : true}
	    		window.android.webAction(JSON.stringify(appOpt));
	    	}
	    	_aside.open();
	    });
	    
        $('.btn_close_aside').on('click', function(){
            
            //우측메뉴 Close 버튼 클릭 시 GNB 버튼 Visible 처리 위한 로직 추가 [START] - 2023.03.22 최대한
            if(getOsInfo().indexOf("app") !== -1){
                let _p = location.href;
        
                if(_p.indexOf("/system/main/appMenu") != -1){
                    return;
                }
                if(_p.indexOf("/system/gnbbar/kbPlus") != -1){
                    return;
                }
                if(_p.indexOf("/system/main/ssoBridge") != -1){
                    return;
                }
        
                if(_p === "http://"+location.host+"/#open_aside"
                    || _p === "https://"+location.host+"/#open_aside"
                    || _p === "http://"+location.host+"/"
                    || _p === "https://"+location.host+"/"
                    || _p.indexOf("/system/main/main") != -1
                    || _p.indexOf("/rateplan/plans/products") != -1
                    || _p.indexOf("/info/mypage/join-info") != -1){
                    callAppService({
                        action_code : 'A0204',	// APP GNB ON
                    });
                }else{
                    callAppService({
                        action_code : 'A0205',	// APP GNB OFF
                    });
                }
            }
            //우측메뉴 Close 버튼 시 GNB 버튼 처리 위한 로직 추가 [END] - 2023.03.22 최대한

	    	_aside.close();
	    });
	}
}




// 100vh layout
let _fullH = {
    init: function(){
        let fullH = $(document).find(".section.fullH");
        if( fullH.length < 1 ) return;

        let winH = $(window).height() || 0;
        let headH = $(document).find(".header .inner_sub").outerHeight(true) || 60;
        let btnH = $(document).find(".btn_confirm_wrap .btn_area").outerHeight(true) || 0;
        let gap = headH;

        let children = fullH.children();
        let childrenH = fullH.children().innerHeight();

        let height = winH - headH - btnH - gap;
        
        fullH.css({
            "min-height" : `${childrenH}px`,
            "max-height" : `${height}px`,
        });
        children.css({
            "min-height" : `${height}px`,
        });
    }
}
$(()=>{
    setTimeout(() => { _fullH.init() }, 0);
    $(window).on("resize", _fullH.init );
})




$(()=>{
    // 요금제 > 하단 진단하기 페이지 링크 스크롤이벤트
    const ratePlanHelp = $(document).find(".rateplan_help");
    ratePlanHelp.find("a").attr("aria-labelledby", "rateplan_help_txt");                // [05/19] 초점 관련 스크립트 추가
    ratePlanHelp.find("p").attr("id", "rateplan_help_txt").attr("aria-hidden", true);   // [05/19] 초점 관련 스크립트 추가
    if( ratePlanHelp.length > 0 ){
        $(document).on("scroll", ()=>{
            const scrollTop = $(window).scrollTop();
            scrollTop > 100 ? ratePlanHelp.addClass("mini") : ratePlanHelp.removeClass("mini");
        })
    }
    getBtmFixElem();
});
$(window).on("resize", function(e){
    getBtmFixElem();
});

// 하단고정 엘리먼트 .btm_fixed_item 의 bottom 값 계산
const getBtmFixElem = function(){
    const isPageOn = $(document).find(".page.on").length > 0;   // .page.on이 있으면 true
    
    let btmFixedItem = $(document).find(".btm_fixed_item");
    if( btmFixedItem.length < 1 ) return;

    btmFixedItem = btmFixedItem.filter((idx, item)=> $(item).css("display")!="none" );  // display:none 인 요소 필터링
    btmFixedItem = btmFixedItem.filter((idx, item)=> $(item).height() != 0);            // display:none 안에 있는 요소 필터링

    let footBtnH = isPageOn
                 ? $(document).find(".on .btn_confirm_wrap .btn_area").outerHeight(true) || 0
                 : $(document).find(".btn_confirm_wrap .btn_area").outerHeight(true) || 0;

    btmFixedItem = [...btmFixedItem];
    let elemH = btmFixedItem.map((item) => $(item).outerHeight(true));

    let btm = [...elemH].reduceRight((prev, curr, idx) => { 
        $(btmFixedItem[idx]).css({"bottom" : `${Math.round(prev) * 0.1}rem`});
        return prev + curr;
    }, footBtnH);

    setContentPad(Math.round(btm), footBtnH);
}
const setContentPad = function(size, footBtnH){
    const content = $(document).find(".content");
    content.css({"padding-bottom": ""});    // inline padding-bottom 초기화

    let contPad = content.length > 0
                ? _frontFormatter.Number($(document).find(".content").css("padding-bottom"))
                : 0;
    contPad = contPad + size - footBtnH;
    $(document).find(".content").css({"padding-bottom": `${contPad * 0.1}rem`});
}





// page : 가입/개통
$(()=>{
    // 이용 전 확인해주세요 아코디언
    $('.info_acc_wrap').each(function(){

        const _this = $(this);

        if( _this.hasClass('on') ){
            _this.find("a.acco_btn").attr("aria-expanded", true);
            _this.find('.acco_cont').show();
        } else {
            _this.find("a.acco_btn").attr("aria-expanded", false);
            _this.find('.acco_cont').hide();
        }

        _this.find('.acco_btn').on('click', function(e){
            e.preventDefault();

            let accoCont = $(this).siblings('.acco_cont');

            if( _this.hasClass('on') ){
                _this.removeClass('on');
                $(this).attr("aria-expanded", false);
                accoCont.slideUp(200);
            } else {
                _this.addClass('on');
                $(this).attr("aria-expanded", true);
                accoCont.slideDown(200);
            }
            
            // 개발팀 요청 main 함수
            if(_this[0].id === "main_info_acc_wrap_id"){
                mainRealTimeFuncCall();
            } 
        });

    });
})

const getIframeSize = function(){
    let layer = $(`.layer_wrap[aria-hidden = "false"]`);
    let iframePage = layer.find("#pdfViewPage");
    
    if( iframePage.length <= 0 ) return;

    let lyCnt = layer.find(".ly_cnt");
    let lyCntH = _frontFormatter.Number(lyCnt.css("max-height"));
    let lyCntPd = _frontFormatter.Number(lyCnt.css("padding-top")) + _frontFormatter.Number(lyCnt.css("padding-bottom"));
    let previewH = lyCntH - lyCntPd;

    iframePage.css({"height":`${previewH}px`, "width":"100%"});
}


/**
 * 가까운멤버십 로고 애니메이션 play, stop버튼 관련 함수
 * @returns null
 */
const partnerMarquee = function(){
    if( $(document).find(".partner_area").length < 1 ) return; // 예외처리
    
    const parent = $(document).find(".partner_area");
    const btn = parent.find(".btn_func");

    // setting
    $("#marquee_area_stop").removeClass("play").addClass("stop").html(`<span class="blind">멈추기</span>`);
    $("#marquee_area_play").removeClass("stop").addClass("play").html(`<span class="blind">재생</span>`);

    btn.on("click", function(e){
        let _this = $(this);
        setTimeout(() => {
            if( _this.hasClass("stop") ){
                _this.addClass("play").removeClass("stop").attr("id", "marquee_area_play");
                _this.html(`<span class="blind">재생</span>`);
            } else {
                _this.addClass("stop").removeClass("play").attr("id", "marquee_area_stop");;
                _this.html(`<span class="blind">멈추기</span>`);
            }
        }, 1);
    })
}


const _frontFormatter = {
    /**
     * 문자열 내 숫자만 추출 후 숫자 타입으로 리턴   _frontFormatter.Number("12.5px");  => 12.5
     * @param {string} string  
     * @returns number
     */
    Number: function(string){
        if( typeof(string) != "string" ) return;
        const regExp = /[^.0-9]/g;
        const result = string.replace(regExp, "") * 1;

        return result;
    }
}