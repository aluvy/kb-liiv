/**
 * NEW KBSTAR 2021
 * JS Loader : A Temp File
 */

/* 페이지중복확인 */
var $targetPage = function() {
    return $('.pt-page').length > 1 ? $($('.pt-page')[1]) : $('.pt-page');
}

/* [Biz-007] 계좌순서 변경 기능 개선s */
var orderList = {
    flag: false,
    evtStop: function(thisLi){
        if(orderList.flag == true) {
            thisLi.each(function(){
                $(this).css('z-index', '-1')
            });
        } else{
            thisLi.each(function(){
                $(this).css('z-index', '0')
            });
        }
    },
    liEachSet: function(thisLi){
        var itemHeight = 0;
        thisLi.each(function(index, item){
            thisLi.removeClass('last first');
            if($(this).hasClass('hidden')){
                $(this).css('top', 0);
            } else {
                $(this).css('top', itemHeight);
                itemHeight += Math.ceil($(item).outerHeight());
            }
        });
        thisLi.eq(0).addClass('first');
        thisLi.eq(-1).addClass('last');
        return itemHeight;
    },
    liPosHeight: function(upParent, upParentNP){
        var upParentTop = parseInt(upParent.css('top'));
        var upParentheight = Math.ceil(upParent.outerHeight());
        var upParentNPTop = parseInt(upParentNP.css('top'));
        var upParentNPHeight = Math.ceil(upParentNP.outerHeight());
        return [upParentTop, upParentheight, upParentNPTop, upParentNPHeight];
    },
    compareOff: function(_re){
            var toggleIs = $('.tit_area.js_toggle.on');
            if(toggleIs.length > 0 && !_re == 're'){
                toggleIs.each(function(){
                    var thisLi =$(this).next().children().find('.li');
                    thisLi.each(function(index, item){
                        $(this).removeAttr('style');
                    });
                    $(this).next().children().removeAttr('style');
                });
            } else if(_re == 're') {
                var newListDrag = $('.new_list_drag');
                newListDrag.children().each(function(){
                    $(this).removeClass('chosen')
                    $(this).removeAttr('style');
                });
                newListDrag.removeClass('type_drag').addClass('drag').removeAttr('style');
            } else {
                var thisLi = $('.drag').children();
                thisLi.each(function(index, item){
                    $(this).removeAttr('style');
                });
                thisLi.parent().removeAttr('style');
            }
    },
    compareOn: function(_currentClass, _this,){
        if(_currentClass == 'orderSet'){
            var toggleIs = $('#wrap .tit_area.js_toggle.on'); // [전담반 Biz-171] 대표계좌 설정 개선 :20220405 개발 피드백 수정
            if(toggleIs.length > 0){
                toggleIs.each(function(){
                    var thisLi = $(this).next().children().find('.li');
                    var itemHeight = orderList.liEachSet(thisLi);
                    $(this).next().children().css('height', itemHeight);
                });
            } else {
                var thisLi = $('.type_drag').children();
                var itemHeight = orderList.liEachSet(thisLi);
                thisLi.parent().css('height', itemHeight);
            }
        } else if (_currentClass == 'type_drag'){
            var thisLi =  _this.next().children().find('.li');
            var itemHeight = orderList.liEachSet(thisLi);
            _this.next().children().css('height', itemHeight);
        }
    },
    orderUp: function(_this){
        var upParent = _this.closest($('.li'));
        var thisLi = _this.closest($('.type_drag')).children();
        var upParentNP = upParent.prev();
        var [upParentTop, upParentheight, upParentNPTop, upParentNPHeight] = orderList.liPosHeight(upParent, upParentNP);
        // animate stop
        orderList.flag = true;
        orderList.evtStop(thisLi);   

        upParent.animate({top: upParentTop-upParentNPHeight+'px'}, 200);
        upParentNP.animate({top: upParentNPTop+upParentheight+'px'},200,function(){

                     
            upParent.insertBefore(upParentNP);
            // 순서 변경 여부 개발 펑션 호출 - 없을 경우 퍼블 인터렉션 펑션만 호출
            if(window.SPA_COMMON){
                window.SPA_COMMON.callbackWithSPA('chkModfiList', _this);
            }
            orderList.compareOn('orderSet');
            // animate start
            orderList.flag = false;
            orderList.evtStop(thisLi);
        });
        // 애니메이션 완료 후 호출
        $('.new_list_drag .li').removeClass('chosen');
        upParent.addClass('chosen');
        
    },
    orderDown: function(_this){
        var upParent = _this.closest($('.li'));
        var thisLi = _this.closest($('.type_drag')).children();
        var upParentNP = upParent.next();
        var [upParentTop, upParentheight, upParentNPTop, upParentNPHeight] = orderList.liPosHeight(upParent, upParentNP);
        // animate stop
        orderList.flag = true;
        orderList.evtStop(thisLi);  
        upParent.animate({top: upParentTop+upParentNPHeight+'px'}, 200);
        upParentNP.animate({top: upParentNPTop-upParentheight+'px'},200,function(){
            upParent.insertAfter(upParentNP);
            // 순서 변경 여부 개발 펑션 호출 - 없을 경우 퍼블 인터렉션 펑션만 호출
            if(window.SPA_COMMON){
                window.SPA_COMMON.callbackWithSPA('chkModfiList', _this);
            }
            orderList.compareOn('orderSet');
            // animate start
            orderList.flag = false;
            orderList.evtStop(thisLi);
        });
        // 애니메이션 완료 후 호출
        $('.new_list_drag .li').removeClass('chosen');
        upParent.addClass('chosen');
    },
    init: function(_currentClass){
        var btnMove = $('.move_area button');
        orderList.compareOn(_currentClass);
        btnMove.each(function(){
            $(this).off('click').on('click', function(e){
                e.preventDefault();
                // var btnClassName = $(this).attr('class');
                if($(this).hasClass('btn_up')) {
                    orderList.orderUp($(this));
                }else if($(this).hasClass('btn_down')) {
                    orderList.orderDown($(this));
                }else{
                    return;
                }
            });
        });
    }
}
// drag start
const orderDragBtn = {
    drag_id: [],
    dragIs: function() {
        orderDragBtn.drag_id = new Array();
        var dragListIs = $('.new_list_drag');
        dragListIs.each(function(index, item) {
            orderDragBtn.drag_id.push($(item).attr('id'));
        });
        orderDragBtn.accountSetup(orderDragBtn.drag_id);
    },
    accountSetup: function(id){
        for(var i = 0; i < id.length; i++){
            Sortable.create( document.getElementById(id[i]), {
                handle: '.btn_move',
                animation: 150,
                scrollSensitivity: 30,
                onStart: function(evt){
                    var el = $(this.el);
                    var accPnnel = el.children('.li');
                    _chosen = accPnnel.filter('.sortable-chosen');
                    $('.new_list_drag .li').removeClass('chosen');
                    accPnnel.filter(':not(.sortable-drag)').addClass('opac');
                },
                onEnd: function(){
                    var el = $(this.el);
                    var accPnnel = el.children('.li');
                    accPnnel.filter(':not(.sortable-drag)').removeClass('opac');
                    _chosen.addClass('chosen');
                    
                    // 순서 변경 여부 개발 펑션 호출 - 없을 경우 퍼블 인터렉션 펑션만 호출
                    var btnMove = _chosen.children('.btn_move').eq(1);
                    if(window.SPA_COMMON){
                        window.SPA_COMMON.callbackWithSPA('chkModfiList', btnMove);
                    }
                }
            });
            orderDragBtn.selectDragSort();
        }
    },
    selectDragSort: function() {
        $(document).off('click', '.sel_drag_sort .selection input').on('click', '.sel_drag_sort .selection input', function(e){
            var _this = $(this);
            var _listDrag = $('.new_list_drag')
            var _st = $(window).scrollTop();

            if(_this.closest('.selection').hasClass('drag_move')){
                _listDrag.removeClass('type_drag').addClass('drag');
                orderList.compareOff();

            }else if (_this.closest('.selection').hasClass('button_move')){
                _listDrag.removeClass('drag').addClass('type_drag');
                orderList.init('orderSet');
                $('body,html').animate({scrollTop: _st}, 0);
            }
        });
    }
}
/* [Biz-007] 계좌순서 변경 기능 개선e */

/* 아코디온 from accordion.html */
var accordionButton = {
    init : function(){
        accordionButton.accordion();
        accordionButton.toggle();
        accordionButton.toggler();
        accordionButton.reminder();
        accordionButton.slideToggler();
    },
    accordion : function(){

        if ($('.js_accordion li').hasClass('on')){
            $('.js_accordion li.on').find('.toggle_panel').css('display','block');
        }

        $(document).off('click', '.js_accordion a.tit, .js_accordion .btn_acco').on('click', '.js_accordion a.tit, .js_accordion .btn_acco', function(e){
            e.preventDefault();
            var _this = $(this),
                _li = _this.parents('li'),
                _lipar = _this.parent('li'),
                _litree = $('.toggle_panel > ul > li'),
                _parent = _li.parent('.js_accordion'),
                spd = 100;

            if (_parent.hasClass('live')){
                $(this).next('.toggle_panel').stop().clearQueue().slideToggle(spd, function(){
                    if ($(this).prev('.tit').hasClass('on')){
                        $(this).prev('.tit').attr({'aria-expanded':'false'}).removeClass('on');
                        $(this).parent('li').removeClass('on');
                    } else {
                        $(this).prev('.tit').attr({'aria-expanded':'true'}).addClass('on');
                        $(this).parent('li').addClass('on');
                    }
                });
            } else if (_parent.hasClass('tree')){
                if(_lipar.hasClass('on')){
                    _this.attr('aria-expanded', 'false').parent('li').removeClass('on').find('.toggle_panel').slideUp(spd);

                    if (_this.parent('li').find('.list_acco li').is('.on')) {
                        _litree.removeClass('on').children('a').attr('aria-expanded', 'false');
                    } else {
                        _this.closest('.js_accordion').find('> li').removeClass('on').children('a').attr('aria-expanded', 'false');
                    }
                } else {
                    _this.attr('aria-expanded', 'true').parent('li').find('> .toggle_panel').slideDown(spd).parent('li').addClass('on');
                    _lipar.siblings('li').removeClass('on').children('a').attr('aria-expanded', 'false');
                    _lipar.siblings('li').find('> .toggle_panel').slideUp(spd).children('li').removeClass('on');
                }
            } else { // default
                if(_li.hasClass('on')){
                    _this.attr('aria-expanded', 'false').parents('li').removeClass('on').find('.toggle_panel').slideUp(spd);
                } else {
                    _this.attr('aria-expanded', 'true').parents('li').find('.toggle_panel').slideDown(spd).parents('li').addClass('on');
                    _li.siblings('li').removeClass('on').find('.btn_acco, .tit').attr('aria-expanded', 'false').next('.toggle_panel').slideUp(spd);
                }
            }

            if (_this.find('input[type=checkbox]:checked').length) {
                _this.find('input[type=checkbox]').prop('checked', false).attr('checked', false);
            } else {
                _this.find('input[type=checkbox]').prop('checked', true).attr('checked', true).parents('li').siblings().find('input[type=checkbox]').prop('checked', false).attr('checked', false);
            }

        });
    },
    toggle : function(){
        if ($('.js_toggle').length > 0) {
            $('.js_toggle').each(function() {
                $(this).attr('aria-expanded', $(this).is('.on') ? true : false);
            });
        };
        $(document).off('click', '.js_toggle').on('click', '.js_toggle', function(e){
            e.preventDefault();
            var _this = $(this);
            var _toggleSmWrap = _this.parents('.toggle_sm_wrap');

            if (_this.hasClass('switch')){ // accordion
                if(_this.hasClass('on')){
                    _this.attr('aria-expanded', 'false').removeClass('on').parent('li').siblings('li').children('.js_toggle').removeClass('on').attr('aria-expanded', 'false');
                } else {
                    _this.attr('aria-expanded', 'true').addClass('on').parent('li').siblings('li').children('.js_toggle').removeClass('on').attr('aria-expanded', 'false');
                }
            } else if(_toggleSmWrap.length > 0) {
                if(_toggleSmWrap.hasClass('on')){                    
                    setTimeout(function(){
                        _this.attr('aria-expanded', 'false');
                        _toggleSmWrap.removeClass('on');
                        if(_toggleSmWrap.hasClass('type1')){
                            _this.text('상세내역 보기');
                        }
                    },0);  
                } else {                    
                    setTimeout(function(){
                        _this.attr('aria-expanded', 'true');
                        _toggleSmWrap.addClass('on');
                        if(_toggleSmWrap.hasClass('type1')){
                            _this.text('상세내역 닫기');
                        }
                    },0);  
                }
            } else { // default   
                var _st = $(window).scrollTop();  
                var _gap = 400; 
                _this.parents('.js_toggle').toggleClass('on');          

                if(_this.hasClass('on')){
                    _this.attr('aria-expanded', 'false').removeClass("on").next('.toggle_panel').slideUp(300);
                    var _st = $(window).scrollTop() - _gap;
                } else {
                    _this.attr('aria-expanded', 'true').addClass("on").next('.toggle_panel').slideDown(300);

                    if(_this.parents('.inform_btm_wrap').length > 0) {
                        var _docH = $(document).height();
                        var _winH = $(window).innerHeight();
                        var _panelH = _this.next('.toggle_panel').outerHeight();

                        if(_panelH > _winH - 100) {
                            $('html, body').stop().animate({'scrollTop': _st + _gap});
                        } else {
                            $('html, body').stop().animate({'scrollTop': _docH});
                        }
                    }
                    // [Biz-007] 계좌순서 변경 기능 개선
                    if(_this.next().children().hasClass('type_drag')){
                        orderList.compareOn('type_drag' ,_this);
                    }
                } 
            }
        });
    },
    toggler: function() {
        $(document).off('click', '.js_toggler').on('click', '.js_toggler', function(e){
            var toggler = $(this),
                target = $('#' + toggler.attr('aria-controls')),
                isActive = toggler.attr('aria-expanded') == 'true' ? true : false,
                isReminder = toggler.closest('.reminder').length > 0;

            if (isReminder) return;
            
            if (isActive){
                toggler.attr('aria-expanded', 'false');
                target.removeClass('active');
            } else {
                toggler.attr('aria-expanded', 'true');
                target.addClass('active');
            }

            e.preventDefault();
        });
    },
    slideToggler: function() {
        $(document).off('click', '.js_slide_toggler').on('click', '.js_slide_toggler', function(e){
            var toggler = $(this),
                target = $('#' + toggler.attr('aria-controls')),
                isActive = toggler.attr('aria-expanded') == 'true' ? true : false,
                speed = 400,
                isReminder = toggler.closest('.reminder').length > 0;

            if (isReminder) return;

            if(isActive){
                toggler.attr('aria-expanded', 'false');
                target.slideUp(speed);
            } else {
                toggler.attr('aria-expanded', 'true');
                target.slideDown(speed);
            }

            e.preventDefault();
        });
    },
    reminder: function() { //자산관리용 (toggle + checkbox)
        $(document).off('click', '.reminder > .selection input').on('click', '.reminder > .selection input', function(e) {
            var cTarget = $(e.currentTarget),
                reminder = cTarget.closest('.reminder'),
                tit = reminder.find('.tit'),
                panel = reminder.find('.panel'),
                isActive = cTarget.prop('checked'),
                isSync = reminder.hasClass('sync'),
                isNoSync = reminder.hasClass('nosync'),
                isSlide = tit.hasClass('js_slide_toggler'),
                speed = 400;

            if (!isNoSync) {
                if (isActive) {
                    tit.attr('aria-expanded', 'true');
                    
                    if (isSlide) {
                        panel.slideDown(speed);
                    } else {
                        panel.addClass('active');
                    }
                } else if (isSync) {
                    tit.attr('aria-expanded', 'false');
                    
                    if (isSlide) {
                        panel.slideUp(speed);
                    } else {
                        panel.removeClass('active');
                    }
                }
            }
        });

        $(document).off('click', '.reminder > .tit').on('click', '.reminder > .tit', function(e) {
            var cTarget = $(e.currentTarget),
                reminder = cTarget.closest('.reminder'),
                isActive = cTarget.attr('aria-expanded') == 'false' ? true : false,
                selection = reminder.find('input'),
                tit = reminder.find('.tit'),
                panel = reminder.find('.panel'),
                isSync = reminder.hasClass('sync'),
                isNoSync = reminder.hasClass('nosync'),
                isSlide = tit.hasClass('js_slide_toggler'),
                speed = 400;

            if (isActive) {
                if (!isNoSync) { selection.prop('checked', true).attr('checked', true); }
                
                tit.attr('aria-expanded', 'true');

                if (isSlide) {
                    panel.slideDown(speed);
                } else {
                    panel.addClass('active');
                }
            } else {
                if (isSync) { selection.prop('checked', false).attr('checked', false); }

                tit.attr('aria-expanded', 'false');

                if (isSlide) {
                    panel.slideUp(speed);
                } else {
                    panel.removeClass('active');
                }
            }
        });
    }
}

/* 텝메뉴 from tab.html */
var tabMenu = {
    init : function(){
        for( var i=0 ; i< $('.tab_wrap').length ; i++ ){
            var thisIndex = $('.tab_wrap button[aria-selected=true]').eq(i).attr('aria-controls');
            if(thisIndex) {
                thisIndex.length > 0 && $('.tab_wrap button[aria-selected=true]').eq(i).parents('.tab_wrap').find('#'+thisIndex).addClass('active').siblings().removeClass('active');
            }
        }
        tabMenu.tabMove();
        tabMenu.tab();
        tabMenu.tabBox();        
    },
    tab : function(){
        $(document).on('click', '.tab_wrap [role=tab]', function(e) {
            e.preventDefault();
            var _this = $(this),
                _tabWrap = _this.closest('.tab_wrap'),
                _thisPannel = _tabWrap.children('.tab_panel'),
                _thisControls = _thisPannel.filter('#' + _this.attr('aria-controls'));
            
            _this.attr('aria-selected', 'true').parent('div').eq(0).find('[role=tab]').attr('aria-selected', 'true').parent('div').siblings().find('[role="tab"]').attr('aria-selected', 'false')

            if (_thisPannel.length) {
                _thisControls.addClass('active').siblings('.tab_panel').removeClass('active');

                if (!_tabWrap.hasClass('box')) {
                    _thisControls.find('.tab_wrap .tab_list > div [role=tab]').attr('aria-selected', 'false').parent('div').eq(0).find('[role=tab]').attr('aria-selected', 'true');
                    _thisControls.find('.tab_panel').eq(0).addClass('active').siblings().removeClass('active');
                }
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
                    _thisPannelLeft = _this.parent('div').offset().left;

                if (_this.attr('aria-selected') == 'true' && (_thisScrollW <= _this.parent('div').outerWidth() + _thisPannelLeft || _thisPannelLeft <= _thisScrollLp)) {
                    _thisScroll.scrollLeft(_thisScroll.scrollLeft() + _thisPannelLeft - _thisScrollLp);
                    return false;
                }
            });
        });
    },
    tabBox : function(){
            if($('.tab_wrap.box').length > 0) {
                $('.tab_wrap.box .tab_list > div').attr("role","presentation");                
            }
    }
}

/* 프로그래스바 from etc.html */
function updateProgressBar(value){
    var value;
    value ? value = Math.round(value) : value = 100;
    var i = 0;
    if (i == 0) {
        i = 1;
        var el = $('.progressbar .pbar'),
        w = 1,
        id = setInterval(frame, 10);
        function frame(){
            if (w >= value){
                clearInterval(id);
                i = 0;
            } else {
                w++;
                el.css('width', w + '%');
                el.siblings('.ptext').text(w + '%');
            }
        }
    }
}

/* 스텝 div 프로그래스 스텝 from etc.html */
var progressDiv = {
    init : function(status){
        status > 0 ? status = status : status = $('.progress.div').attr('data-value');
        $('.progress.div').attr({'aria-live':'polite', 'aria-label':status+'% 진행중'});
        $('.progress.div .progress_div').attr('style', 'width:'+status+'%;')
    }
}

/* Count Number from etc.html */
var countNumber = {
    init : function(){
        // if ($('.numberCountCon').length>0){
            var numberCountConTxt = $('.numberCountCon').attr('data-value');
            $({ val : 0 }).animate({ val : numberCountConTxt }, {
                duration: 2000,
                step: function() {
                    var num = numberWithComas(Math.floor(this.val));
                    $('.numberCountCon').text(num);
                },
                complete: function() {
                    var num = numberWithComas(Math.floor(this.val));
                    $('.numberCountCon').text(num);
                }
            });
            function numberWithComas(x){
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
        // }
    }
}

/* 툴팁 from tooltip.html */
var tooltipButton = {
    init : function(){
        $('.js_tooltip').off('click').on('click', function(){
            _this = $(this);
            var _winW = $('body').width(),
                _tooltipWrap = _this.parents('.tooltip_limited').find('.tooltip_wrap'),
                _tooltipWrapL = _this.offset().left -24,
                _tooltipWrapR = _winW-(_this.offset().left+44),

                deviceH = screen.height,
                offsetT = _this.offset().top,
                scrollT = $(document).scrollTop(),
                tipWrapT = offsetT - scrollT,
                tipWrapD = deviceH - (offsetT - scrollT);

            if ( _tooltipWrap.css('display')  == 'block' ){
                _tooltipWrap.hide().removeClass('top').attr('aria-hidden', 'true').closest('.tooltip_limited').parent().css('z-index','').parent().css('z-index','');
            } else {
                $('.tooltip_wrap').hide().removeClass('top').attr('aria-hidden', 'true').closest('.tooltip_limited').parent().css('z-index','').parent().css('z-index','');
                
                if( tipWrapT > tipWrapD ){
                    _tooltipWrap.addClass('top');
                }

                _this.closest('.tooltip_limited').parent().css('z-index', '101').parent().css('z-index', '101');
                _tooltipWrap.show().attr('aria-hidden', 'false');

                if( _tooltipWrap.parents('.acc_pannel').parents('div').hasClass('section_f') ){
                    _tooltipWrap.css({'left':-_tooltipWrapL-8, 'right':-_tooltipWrapR-8});
                } else {
                    _tooltipWrap.css({'left':-_tooltipWrapL, 'right':-_tooltipWrapR});
                }
            }

            $('.btn_tooltip_x').off('click').on('click', function() {
                $(this).closest('.tooltip_wrap').hide().removeClass('top').attr('aria-hidden', 'true').closest('.tooltip_limited').parent().css('z-index','').parent().css('z-index','');
                setTimeout(function(){
                    _this.focus();
                },100);
            });
        });
        return false;
    }
}

/* 토글 버튼 */
var toggleButton = {
    init : function(){
        $(document).on('click', '.toggle', function(){
            $(this).toggleClass('active');
            $(this).hasClass('active') ? $(this).attr('aria-pressed','true') : $(this).attr('aria-pressed','false');
        });
    }
}

var selectItem = {
    init : function(){
        if( $('.item_area').hasClass('active') ){
            $('.item_area.active').find('.item').append('<span class="hidden">선택</span>');
        }
        $(document).on('click', '.js_list_item .item ', function(){
            $('.item_area').removeClass('active');
            $('.item').find('.hidden').remove();
            $(this).closest('.item_area').addClass('active');
            $(this).append('<span class="hidden">선택</span>');
        });
    }
}

/* 권유희망직원 선택 */
var staffHopeSelect = {
    init : function(){
        this.staffHopeShowHide();
    },
    staffHopeShowHide : function(){
        $(document).on('click', '.staff_hope .staff_hope_sel .rdoChk_box .selection input', function(e){
            var radioIndex = $(this).parent().index();
            $('.staff_hope .staff_hope_cts').each(function(index){
                $(this).removeClass('on').attr({'aria-hidden':'true'});
                if(radioIndex === index){
                    $(this).addClass('on').attr({'aria-hidden':'false'});
                }
            })

        });
    }
}

/* 이체 금액 입력폼 */
var transferMoney = {
    init:function(){
        $.fn.setCursorPosition = function(pos) {
            this.each(function(index, elem) {
                if (elem.setSelectionRange) {
                    elem.setSelectionRange(pos, pos);
                } else if (elem.createTextRange) {
                    var range = elem.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', pos);
                    range.moveStart('character', pos);
                    range.select();
                }
            });
            return this;
        };
        $(document).on('keyup', '.js_money', function() {
            if ($(this).val().length < $(this).attr('maxlength') + 2) {
                var _this = $(this),
                    _value = _this.val(),
                    _valueLength = _value.length,
                    _unit = _this.data('unit');

                if (_value.indexOf(_unit) !== -1) {
                    _this.val(_value);
                } else {
                    _this.val(_value + ' ' + _unit);
                    _this.focus().setCursorPosition(_valueLength);
                } 
            }
        });
    }
}

//디데이
var dDay = {
    init:function(){
        var day = $('.acc_day_info').find('.d-day');
        var graphW = $('.graph_area').find('.default').outerWidth();
        var graphA = $('.graph_area').find('.active').outerWidth();

        if( graphA < (graphW * 0.1) ){
            day.css({'left':'0','transform':'none'});
        } else if ( graphA > (graphW * 0.9) ){
            day.css({'left':'auto','right':'0','transform':'none'});
        }
    }
}

var _front = {
    init : function(){
        var $dragUse = ($(".list_drag").length > 0) ? true : false;
        _front.$deviceH = $(window).height();
        _front.$deviceV = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sab"));
        _front.$deviceS = (isNaN(_front.$deviceV)) ? 0 : _front.$deviceV;
        /* [전담반 Biz-069] : 20220407 swiper pannel 높이가 device 크기보다 작을 경우 처리 */
        let $header = $("#header").eq(0);
        _front.$hdH = ($header != undefined)?(parseInt($header.outerHeight(true)+($header.innerHeight()-$header.height()))):0; 
        /* //[전담반 Biz-069] : 20220407 swiper pannel 높이가 device 크기보다 작을 경우 처리 */
        
        _front.form();
        _front.scroll();
        
        
        if($dragUse) _front.drag();        
        $(document).on("click", "a[href='#'], a[href='#none']", function(e){ e.preventDefault();});

        // Content 여백(cmd 버튼)
        !$(".btn_confirm_wrap").length > 0 ? $('#content').addClass('type2') : $('#content').removeClass('type2');

        //hr aria-hidden 추가 : 접근성
        $('hr').attr('aria-hidden','true'); 
    },
    scroll : function(){
        var _isStep = ($targetPage().find(".js_step").length > 0) ? true : false;
        if(_isStep) {
            _front.step();
        } else {
            $(document).off('scroll');
        }
    },
    step : function() {
		var _step = $targetPage().find(".js_step");
        var _stepH = parseInt(_step.outerHeight());
        var _hdH = $targetPage().find("#header").outerHeight() == undefined ? 0 : parseInt($targetPage().find("#header").outerHeight());
        var _aniVal = _stepH + _hdH + 20;

        $(document).off('scroll').on("scroll", function(){
            var _st = $(document).scrollTop();

            //[Biz-056] 송금국가 선택시 검색 기능 제공(바텀시트 노출시 스탭 유지)
            if (_st > _aniVal || $('.layer_wrap').hasClass('open')) {
                if (!$('.js_step').hasClass('on')) _step.clone().prependTo('#content').addClass("on");
            } else {
                $('.js_step.on').remove();
            }
        });
    },
    drag : function(){
        $(".js_drag_set .ico_set").on("click", function(){
            // [Biz-007] 계좌순서 변경 기능 개선
            var _this = $(this).closest(".js_drag_set").addClass("on");
            $('.sel_drag_sort .drag_move input[type=radio]').prop('checked', true);
            orderList.compareOff('re');
        });
    },
    form : function(){
        var _doc = $(document);
        var _langRem = 10;
        // [전담반 Biz-158] 전자금융 이용해지 프로세스 신설
        if ($('#content').attr('class') !== undefined) {
            var _classArg = $('#content').attr('class').split(' ');
            _langRem = ($.inArray('global_int_btn', _classArg) != -1) ? 9 : 10; //다국어,국문 구분
        }

        //textarea init
        $(".textarea").each(function(){
            var _this = $(this);
            var _textarea = _this.find("textarea");
            var _numInfo = _this.find(".num_info");
            var _numInfoLen = _numInfo.length;

            _textarea.val().length > 0 ? _textarea.addClass('finished') : _textarea.removeClass('finished');

            if (_numInfoLen > 0) {_this.addClass("textarea_count")}
            if (_textarea.is('[readonly]')){
                _this.addClass("textarea_readonly");
            } else if (_textarea.is('[disabled]')){
                _this.addClass("textarea_disabled");
            }

            _doc.off("keyup", _textarea).on("keyup", _textarea, function(){
                _textarea.val().length > 0 ? _textarea.addClass('finished') : _textarea.removeClass('finished');
            });
        });

        //input init
        $(".input input").each(function(e){
            var _this = $(this);
            var _parent = _this.parent(".input");
            var _valueL = _this.val().length;

            _this.val().length > 0 ? _this.addClass('finished') :  _this.removeClass('finished');

            // 단위 추가
            if(_this.data('unit') && _this.is(':not(.js_money)') && _this.is(':not([type=hidden])')) {
                var _dataUnit = _this.data('unit');

                _this.siblings('.unit').remove();
                _this.after('<span class="unit">' + _dataUnit + '</span>');

                var _unit = _this.siblings('.unit'),
                    _unitTxt = _unit.text(),
                    _unitGwalho = _unitTxt.match(/[()]/gi),
                    _unitBlk = _unitTxt.match(' '),
                    _unitBlkL = _unitTxt.replace(' ', '').length;

                if (/[a-z]/.test(_unitTxt)) {
                    if ((/[cm%]/gi).test(_unitTxt)) {
                        _unitW = _unitBlkL * 1 + (_unitBlk ? 1 : 1.2);
                    } else {
                        _unitW = _unitBlkL * 1 + (_unitBlk ? 1 : 0.5);
                    }
                    if (_unitGwalho) _unitW = _unitW - 0.8;
                } else {
                    _unitW = _unitBlkL * 1.641 + (_unitBlk ? 1 : 0.4);
                    if (_unitGwalho) _unitW = _unitW - 1.8;
                }

                _this.css('padding-right', _unitW + (_parent.is('.outline') ? 0.6 : 0) + 'rem');
                if (_valueL) _this.siblings('.unit').addClass('on');
            }

            if(_this.closest('.input').hasClass('js_global_unit')){
                if (_valueL) _this.closest('.input').addClass('active').find('span.txt_unit').addClass('on');
            }

            _doc.off("keyup", ".input input").on("keyup", ".input input", function(){
                var _this = $(this);
                var _parent = _this.parent(".input");
                var _valueL = _this.val().length;
                var _btn = _this.siblings(".btn_clear");

                _this.next('.unit').addClass('on');
                if(!_valueL) _this.next('.unit').removeClass('on');

                if(_this.closest('.input').hasClass('js_global_unit')){
                    _this.closest('.input').addClass('active').find('span.txt_unit').addClass('on');
                    if(!_valueL) _this.closest('.input').removeClass('active').find('span.txt_unit').removeClass('on');
                }

                _btn.toggle(Boolean(_this.val()));
                if(_parent.is('.int_pencil')) {
                    _parent.find('.btn_pencil').hide().siblings(".btn_clear").css('right', 0.6 + 'rem');
                }

                //input clear 추가
                if (!_this.parents('.form_group').is('.between') && !_this.parents('.form_row').is('.col') && !_parent.is('.outline') && _this.is(':not([type=tel])') && !_this.is('[readonly], [disabled]')) {
                    var _inpBtn = _parent.find('.btn.point.round');
                    var _inpBtnW = Math.round(_inpBtn.outerWidth()) / _langRem;
                    
                    _parent.find('.btn_clear').remove();
                    _this.css('padding-right', 3.6 + 'rem').siblings(".btn_clear").css('right', 0.6 + 'rem');
                    _parent.append('<button type="button" class="btn_clear"><span class="hidden">입력내용 초기화</span></button>');

                    _this.val() == '' ? _parent.find('.btn_clear').hide() : _parent.find('.btn_clear').show();  

                    if (_this.is('[type=password]')) _this.css('padding-right', 3.6 + 'rem');
                    if (_this.siblings('.btn_sch')) _this.css('padding-right', (Math.round(_this.siblings('.btn_sch').outerWidth()) / _langRem) + 3.6 + 'rem').siblings('.btn_clear').css('right', _this.siblings('.btn_sch').outerWidth() / _langRem + 'rem');
                };

                //input 버튼 여백
                if (_parent.find('.btn.point.round').length) {
                    var _inpBtn = $(this).parent().find('.btn.point.round');
                    var _inpBtnW = Math.round(_inpBtn.outerWidth()) / _langRem;
                    
                    if (!_this.is('[type=tel]')) {
                        _this.css('padding-right', _inpBtnW + 3.6 + 'rem').siblings(".btn_clear").css('right', _inpBtnW + 0.6 + 'rem');
                    } else {
                        _this.css('padding-right', _inpBtnW + 0.6 + 'rem');
                    }
                };
            }).off("focusout").on("focusout", function(){
                var _this = $(this);
                var _parent = _this.parent(".input");
                var _valueL = _this.val().length;
                if(!_valueL) _parent.find('.unit').removeClass('on');

                _this.val().length > 0 ? _this.addClass('finished') :  _this.removeClass('finished'); //[Biz-035] 시인성개선
                
            }).off('click', '.input .btn_clear').on("click", ".input .btn_clear", function(){
                var _this = $(this);
                var _parent = _this.parent(".input");

                _this.removeAttr('style').hide().siblings('input').val('').focus();
                _parent.find('.unit').removeClass('on');

                if(_parent.is('.int_pencil')) _parent.find('.btn_clear').hide().siblings(".btn_pencil").show();
                if(_parent.find('.btn.point.round').length && !_this.is('[type=tel]')) {
                    var _inpBtn = _parent.find('.btn.point.round');
                    var _inpBtnW = Math.round(_inpBtn.outerWidth()) / 10;
                    
                    _this.css('right', _inpBtnW + 0.6 + 'rem').hide();
                };
            });
        });

        //select init
        $(".select").each(function(){
            var _this = $(this);
            var _select = _this.find("select");
            var _val =  _select.children("option[value='none']").index();
            var _selected =  _select.children("option:selected").index();

            _select.text().length > 0 ? _select.addClass('finished') :  _select.removeClass('finished');

            if(_val == 0 && _selected == 0) {
                _this.addClass("placeholder");
            }else{
                _this.removeClass("placeholder");
            }
            _select.on("change", function(){
                var _val = _select.children("option:selected").index();
                (_val !== 0) ? _this.removeClass("placeholder") : _this.addClass("placeholder");
            });
        });

        //select
        _doc.on("click touchstart mousedown", ".select_btn .btn_txt", function(){
            $(this).closest(".select_btn").addClass("active");
        }).on("touchend mouseup", ".select_btn .btn_txt", function(){
            $(this).closest(".select_btn").removeClass("active");
        });

        //switch
        $(".switch.rate").change(function(){
            var _chk = $(this).find('input');
            var _labelChild = _chk.next('label').children('span');

            _chk.is(':checked') ? _labelChild.text('하락') : _labelChild.text('상승');
        });

        //[Biz-065] 다크테마 .list_comp + checkbox 비활성화
        if($('.list_comp.check li, .acc_pannel.check').length > 0) { 
            $('.list_comp.check li, .acc_pannel.check').each(function() {
                let $el = $(this).find('input[type=radio], input[type=checkbox]');
                
                if(!($el.parent('.selection').css('display') === 'none') && $el.is('[disabled]')){
                    $(this).addClass('disabled');
                }
            }); 
        }
    },

    layerTab : function(){
        $(document).on("click", ".layer_wrap .tab_list button", function(){
            $(".layer_wrap .tab_list button[aria-selected=true]").each(function(){
                var _id = $(this).attr("aria-controls");
                $("#"+_id).addClass("active").siblings().removeClass("active");
            });
        });
    },
    layerClose : function(_target){    
        _this = $(this);
        $(_target).closest(".ly_in").find(".btn.close").trigger("click");            
    },
};

/* 하단스크롤  */
var anckorScroll = {
    init : function(){
        $(document).on('click', '.btn_anckor', function(e){
            var $html = $('html, body'),
                $this = $(this);
                $index = $this.index();
                $thisID = $($this.attr('href'));
                $anckorFix = parseInt( $('.anckor_fix').outerHeight() ) + 48;
                $offsetTop = $thisID.offset().top - $anckorFix;

            $('.btn_anckor').removeClass('active');
            $this.addClass('active');

            if($index > 0) {
                $html.animate({
                    scrollTop: $offsetTop
                }, 400);
            }else{
                $html.animate({
                    scrollTop: 0
                }, 400);
            }
            e.preventDefault();
        });

    }
}
var scTop = {
    init : function(){
        $(document).on('click', '.btn_sctop', function(e){
            var $html = $('html, body');
            $this = $(this);
            $offsetTop = $this.offset().top - 70;
            if( !$('.sctop_fix').hasClass('on') ){
                $html.animate({
                    scrollTop: $offsetTop
                }, 400);
            }                    
            e.preventDefault();
        }); 
    }
}

/* 튜토리얼 */
var tutorial = {
    init : function(){
        tutorial.tutoSize();
        tutorial.swipe();

        $(window).resize(function(){
            tutorial.tutoSize();
        });
    },
    tutoSize : function(){
        if($('.tuto_sec').length > 0){
            var _this = $('.tuto_sec');
            var _imgWrapH = _this.find('.img_wrap').innerHeight();
            _this.find('.img_wrap img').css('height', _imgWrapH * 0.8);
        }
    },
    swipe : function(){
        var swiper = new Swiper('.tuto_sec .swiper-container', {
            slidesPerView: 'auto',
            spaceBetween: 0,
            pagination : { // 210813 접근성수정 (swiper 속성추가)
                el : '.swiper-pagination',
                clickable: true,
                renderBullet: function(idx, className) {
                    var txt = (idx + 1) + '/' + this.$el.find('.swiper-slide').length;
                    return '<button class=' + className + '><span class="hidden">' + txt + '</span></button>';
                }    
            },
            on: { // 210730 접근성수정 (swiper 속성추가)
                afterInit: function() {
                    this.$el.each(function() {
                        var _this = $(this);
                        _this.find('.swiper-slide').eq(0).attr('aria-hidden', false).siblings().attr('aria-hidden', true);
                        _this.parent().find('.swiper-pagination-bullet').eq(0).attr('title', '선택됨').siblings().attr('title', '');
                    });
                },
                transitionEnd: function() {
                    this.$el.find('.swiper-slide').each(function() {
                        var _this = $(this);
                        if (_this.is('.swiper-slide-active')) {
                            _this.attr('aria-hidden', false).siblings().attr('aria-hidden', true);
                        }
                    });
                    this.$el.parent().find('.swiper-pagination-bullet').each(function() {
                        var _this = $(this);
                        if (_this.is('.swiper-pagination-bullet-active')) {
                            _this.attr('title', '선택됨').siblings().attr('title', '');
                        };
                    });
                },
            }
        });   
    }
};

/* layer popup
*  1.종류 : 총 3타입(alert, confirm, bottom)
*  2.특징 :
*         - alert : html 호출없이 옵션의 텍스트 입력만으로 구현
*         - confirm : 가장 많이 사용하는 일반 타입
*         - bottom : 하단에 위치하는 타입
*                    - 일반 바텀시트 : max값 95%만 적용하며 높이는 컨텐츠길이만큼 자동으로 지원. 컨텐츠가 95%이상이면 스크롤 자동 지원
                     - 탭이 있는 바텀시트 : 고정값 적용, 사용 디바이스의 70% 고정값 사용, 확장/축소 기능 지원
                     - 탭이 있는 이체의 계좌선택 바텀시트만 예외 : 고정값 적용, 바닥 컨텐츠의 남은 여백만큼 바텀시트 높이 지정
*  3.옵션 :
*       title:'타이틀',      //필수입력
        titleUse : true,    //default "true", 타이틀 사용여부
        closeUse : false    //default "true", 오른쪽 상단 닫기버튼 사용여부
        closeAct:false,     //default "true", 레이어 닫기 버튼의 닫기 기능 사용여부를 정의할 때 사용
        content:'#ID',      //필수입력, 호출할 HTML컨텐츠 ('#ID명'), 알림창일 경우 텍스트 입력 ('알림창입니다.')
        type:'confirm',     //필수입력, default "confirm", 레이어 타입 지정 (alert, confirm, bottom)        
        openAuto : true,    //default "false", 레이어를 변수명으로 호출할 때 정의
*/

$(function(){
    //jquery start
    "use strict";

    var _w = window;
    $.ohyLayer = function(options, option2){
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
            
            ($(".tab_wrap").length > 0) ?  tabMenu.init(): '';
        },
        buildHTML : function(){
            var _this = this;
            var $template = $(_this.template);
            var $layer_acc = $("#layer_acc").length;
            var $winH = $(window).height();

            _this.$el = $template.appendTo(_this.container);
            _this.$parent = _this.$el.closest('.layer_wrap');
            _this.$layer = _this.$el.find('.ly_in');
            _this.$hd = _this.$el.find('.ly_hd');
            _this.$title = _this.$el.find('.ly_hd h1');
            _this.$con = _this.$el.find('.ly_con');
            _this.$closeDevBtn = _this.$el.find('.btn.close');              

            _this.setContent();      
            
            _this.isTab = (_this.$layer.find(".tab_wrap").length > 0) ? true : false ;          
            _this.$cnt =  _this.$layer.find(".ly_cnt");
            _this.$layer.attr("tabindex",0).focus();
            
            if($.type(_this.content) === 'string' && _this.type !== 'alert') {
                _this.$closeDevBtn.attr("id", (_this.content.replace("#",""))+"_dev"); 
                _this.$con.attr({
                    "id": (_this.content.replace("#",""))+"_devCon",
                }); 
            }
            if(this.closeAct == true) _this.$closeDevBtn.attr("data-action","close");      

            if(_this.type === 'bottom'){                
                if(_this.isTab) {
                    _this.$parent.addClass("type2 isTab");
                    _this.$con.find(".ly_cnt").addClass("scroll");
                } else {
                    _this.$parent.addClass("type2");
                }
                _this.$layer.css({bottom:-$winH}).stop().animate({bottom:"0%"}, 350);
                
            }else if(_this.type === 'bottom_acc'){
                _this.$parent.addClass("type2 bottom_acc");
                _this.$con.find(".ly_cnt").addClass("scroll");
                _this.$layer.css({bottom:-$winH}).stop().animate({bottom:"0%"}, 350);
            }else{
                _this.$parent.addClass("type1");
            }

            _this.$parent.addClass(_this.type);

            setTimeout(function(){                                
                var $acc_conH = $("#layer_acc").innerHeight();                  
                var $winH = _front.$deviceH;                
                var $tabL = _this.$con.children(".tab_wrap");
                var $tabH = $tabL.find(".scroll_wrap").innerHeight();
                var $tabValue = ($tabL.length > 0) ? $tabH : 0;
                var $padd = parseInt(_this.$parent.css("padding-left"));
                var $conpaddT = parseInt(_this.$con.css("padding-top"));
                var $conpddB = parseInt(_this.$con.css("padding-bottom"));
                var $noHdH = parseInt( _this.$layer.css("padding-top"));
                var $hdH = _this.$hd.outerHeight();
                var $hdValue = (_this.$layer.is(".noHd")) ? $noHdH : $hdH;
                var $btm = _this.$parent.find(".btn_pop_confirm_wrap");
                var $btnH = ($btm.length >= 1) ? $btm.outerHeight() : $conpddB ;
                var $value = $hdValue + $btnH + $padd + $padd + $conpaddT + $tabValue;
                var $hdH = parseInt($("#wrap").css("padding-top"));
                var $cntH_confirm = parseInt($winH - $value);
                var $cntH_bottom = parseInt(($winH*.95) - $value);
                var $cntH_bottomTab = parseInt(($winH*.7) - $value);                
                var $cnt = _this.$con.find(".ly_cnt");
                var $cntH_acc = parseInt(($winH-$acc_conH-$hdH) - $value);                                              
                var $heightVal = (_this.height !== null) ? parseInt(_this.height-(_this.$el.find('.ly_hd').height()+$value))+_front.$deviceS : '';  
                var $fixMH = (!_this.isTab) ? "max-height:" + $cntH_bottom + "px;" : '';                
                var $fixH = (_this.height !== null) ? ($.type(_this.height) === 'string' && _this.height == 'full') ? "height:"+$cntH_bottom+"px" : "height:"+$heightVal+"px" : '';   
                
               
                switch (_this.type) {
                    case "confirm" :
                        $cnt.css({
                            "max-height": $cntH_confirm,
                        });

                        if(_this.confirmType === "btm") {
                            _this.$parent.addClass("btm");
                        } else if(_this.confirmType === "btm-one") {
                            _this.$parent.addClass("btm-one");
                        }

                        break;
                    case "bottom" :
                        $cnt.css({                            
                            "max-height" : (!_this.isTab) ? $cntH_bottom : '',                            
                            "height" : (_this.isTab) ? $cntH_bottomTab : (_this.height !== null) ? ($.type(_this.height) === 'string' && _this.height == 'full') ? $cntH_bottom : $heightVal : '' ,  
                        });
                        _this.$con.attr("rel", $fixMH + $fixH); 
                        
                        if(_this.isTab) _this.setAni();                               
                        
                        break;
                    case "bottom_acc" :
                        $cnt.css({                        
                            "height" : $cntH_acc,
                        });
                        _this.setAni();

                        break;
                    default :
                        break;
                }
                
            },0);

            var $closeBtn = _this.$el.find("[data-action='close']");
            $closeBtn.on("click", function(e){                
                _this.$layer.addClass("off");
                _this.close();
            });
           
            var $dim = _this.$el.find(".col_dim");
            $dim.on("click", function(){                                        
                if(_this.closeAct == true && _this.type =="bottom" && _this.closeUse == true && !_this.$layer.hasClass("off") ) {                                                            
                    _this.$layer.addClass("off");
                    _this.close();                    
                }        
            });

        },
        open : function(){
            var _this = this;           
            var $lastFocused = $('body').find(':focus');
            var $focusId = $lastFocused.attr("id");

            _this.buildHTML();     
            
            $("#viewport").clone().replaceAll("#viewport");

            // dev
            $(".layer_wrap a[href='#'], .layer_wrap a[href='#none']").on("click", function(e){ e.preventDefault();});

            if(_this.$con.children(".tab_wrap").length > 0) _front.layerTab();
            _front.form();

            var $scrollTop = $(window).scrollTop();

            if($(".layer_wrap.open").length == 1 && _this.type !== "bottom_acc") {                
                setTimeout(function(){
                    $("#wrap").css({
                        "top":-$scrollTop,
                        "position" : "relative"
                    });
                    $("html, body").addClass("noScroll");
                },0);
            }

            if(_this.type !== "bottom_acc") {
                $("#wrap").attr("aria-hidden", "true");
            }
            
            tooltipButton.init();

            (_this.title == '') ? _this.$title.html("알림") : _this.$title.html(_this.title);
            if(_this.titleUse === false && _this.type !== 'alert') _this.$layer.addClass("noHd");
            if(_this.closeUse === false) _this.$layer.addClass("noBtn");
            _this.$layer.focus().attr("rel", $focusId); 
            
            _this.$parent.prev(".layer_wrap").attr("aria-hidden", true);            

            return true;

        },
        setContent:function(){
            var _this = this;

            if(_this.type === 'alert') {
                var $html = '<div class="ly_cnt"><div class="section">'+_this.content+'</div></div>';
                _this.$con.html($html);
            }else{
                var $html = $(_this.content).html();
                _this.$con.html($html);
                $(_this.content).empty();
            };
        },
        setAni:function(){
            var _this = this;                
            var $winHTab = Math.floor(($(window).outerHeight())*0.95);
            var $tabL = _this.$con.children(".tab_wrap");            
            var $tabH = ($tabL.length > 0) ? $tabL.find(".scroll_wrap").innerHeight() : 0;            
            var $tabValue = ($tabL.length > 0) ? $tabH : 0;
            var $padd = parseInt(_this.$parent.css("padding-left"));
            var $conpaddT = parseInt(_this.$con.css("padding-top"));
            var $conpddB = parseInt(_this.$con.css("padding-bottom"));
            var $noHdH = parseInt( _this.$layer.css("padding-top"));
            var $hdH = _this.$hd.outerHeight();
            var $hdValue = (_this.$layer.is(".noHd")) ? $noHdH : $hdH;            
            var $btm = _this.$parent.find(".btn_pop_confirm_wrap");
            var $btnH = ($btm.length == 1) ? $btm.outerHeight() : $conpddB;
            var $value = $hdValue + $btnH + $padd + $padd + $conpaddT + $tabValue;            
            var $cntH_bottom = $winHTab - $value;                                    
            
            var startY;
            var moveY;
            var endY;
            var isFixval;
            var isUpval;
            var st=0;
            var lastScroll=0;
            var isScrollval;            
            var isOnval;            
            var _target = _this.$con.find(".ly_cnt");                        
            var _heightCnt = _target.height();  
            var _panelH = _target.children(".tab_panel.active").first().innerHeight();      
            

            $(".tab_list [role='tab']").on('click', function(){                  
                setTimeout(function(){
                    var _tabWrap = $(this).closest(".tab_wrap");
                    var isTabsub = (_tabWrap.is(".tab_list_sub")) ? true : false;
                    
                    if(isTabsub){
                        _panelH = _tabWrap.closest(".tab_panel.active").innerHeight();                     
                    }else {
                        _panelH = _target.children(".tab_panel.active").first().innerHeight();
                    }  
                    if( _target.hasClass("on")) {
                        _target.addClass("isFix");
                        _target.stop().scrollTop(0);
                    };

                },0);
                
            });
            
            _target
                .on("scroll", function(e){
                    st = $(this).scrollTop(); 
                    isScroll();
                    lastScroll = st;      
                })
                .on("touchstart", function(e){   
                    startY = e.originalEvent.changedTouches[0].screenY;        
                    _target.removeClass("isFix");                                                     
                })
                .on("touchmove", function(e){        
                    isScrollval = (_target.is(".scroll")) ? true : false;                                      
                    moveY = e.originalEvent.changedTouches[0].screenY;                                   
                    if(isScrollval && moveY < startY){
                        _target.addClass("isTouchUp");
                    }else if (isScrollval && moveY > startY) {
                        _target.removeClass("isTouchUp");
                    }
                })
                .on("touchend", function(e){  
                    _target.removeClass("isTouchUp");
                    isScrollval = (_target.is(".touch")) ? true : false;
                    isOnval = (_target.is(".on")) ? true : false;  
                    isFixval = (_target.is(".isFix")) ? true : false;
                    startY = startY+50;
                    endY = e.originalEvent.changedTouches[0].screenY;  

                    if(isScrollval && endY > startY ) hasTouched();
                    if(isOnval && isFixval == false && endY > startY) hasTouched();
                });


            function isScroll() {                
                isScrollval = (_target.is(".scroll")) ? true : false;   
                isOnval = (_target.is(".on")) ? true : false;                                                   
                isUpval = (_target.is(".isTouchUp")) ? true : false;
                isFixval = (_target.is(".isFix")) ? true : false; 

                if(isScrollval && st > lastScroll && isUpval) {                     
                    hasScrolled();                             
                } else if(isOnval && st < lastScroll && st < 0 && isFixval === false) {    
                    _target.stop().animate({"height":_heightCnt}, 300, function(){
                        $(this).removeClass("on isTouchUp").addClass("scroll");
                    });
                }
            }

            function hasScrolled(){   
                _target.stop().animate({"height" :$cntH_bottom}, 300, function(){  
                    var _this = $(this);                
                    var scrTarget = _this.height();   

                    _this.addClass("on").removeClass("scroll"); 
                    if(scrTarget > _panelH) _this.addClass("touch");
                });                                                      
            }

            function hasTouched(){ 
                var _cntSt = _target.scrollTop();   
                if(_cntSt === 0){  
                    _target.removeClass("touch isFix").stop().animate({"height":_heightCnt}, 300, function(e){                    
                        $(this).removeClass("on").addClass("scroll");                  
                    });   
                }
            }
           
        },
        close:function(){
            var _this = this;
            var $html = _this.$con.html();            
            var $lastFocused = _this.$layer.attr("rel");
            var $scrollTop = parseInt($("#wrap").css("top"))*-1;
            var $body = $("body");
            var $win = $(window);

            if(_this.type === 'bottom' || _this.type === 'bottom_acc'){
                _this.$layer.css({bottom:"0%"}).stop().animate({bottom:"-100%"}, 400, function(){
                    _this.$el.remove();                                        
                    if($(".layer_wrap.open:not(.bottom_acc)").length == 0) ohyCloseInit();      

                    // 개발 함수 : 콜백함수 뒤 실행하는 개발함수
                    if (window.SPA_COMMON) {
                        window.SPA_COMMON.iFrameHide(_this.type);
                    }                   
                });
            }else{
                setTimeout(function(){
                    _this.$el.remove();                    
                    if($(".layer_wrap.open:not(.bottom_acc)").length == 0) ohyCloseInit();      
                    
                    // 개발 함수 : 콜백함수 뒤 실행하는 개발함수
                    if (window.SPA_COMMON) {
                        window.SPA_COMMON.iFrameHide(_this.type);
                    }
                },250);
            }

            if(_this.type !== "alert") {
                $(_this.content).html($html).find('.ly_cnt').removeClass("scroll_y").removeAttr("style");
            }

            $("#"+$lastFocused).focus().closest(".layer_wrap").removeAttr("aria-hidden");
            _this.$parent.prev(".layer_wrap").removeAttr("aria-hidden");  
            
            function ohyCloseInit(){
                $body.removeClass("noScroll").off("touchmove");
                $("html").removeClass("noScroll");
                $("#wrap").css("top","").removeAttr("aria-hidden");                 
                $win.scrollTop($scrollTop);                                   
            }
        },
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
    };    
    //jquery end
});

// [전담반 Biz-069] : return scroll position 2022-04-12 (개발요청)
function getScrollpos() {
    var top = $(window).scrollTop();
    return top;
}