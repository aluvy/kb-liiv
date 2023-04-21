/* Hammer.js 제거 버전 */

let mapBottomFix = { type: 0 }; // 0:close , 1:open, 2: viewStoreDetail

$(()=>{
    h1Hidden();
    setTimeout(() => { h1Hidden() }, 100);
    $("html, body").addClass("noScroll");   // noScroll

    setBottomLayout(mapBottomFix.type);
    _touch.init();

    // .mbs_map-bottom 열기/닫기
    $(document).on("click", ".btn_open", function(){
        const bottom = $(document).find(".mbs_map-bottom");
        mapBottomFix.type = ( bottom.hasClass("on") ) ? 0 : 1;
        setBottomLayout( mapBottomFix.type );
    })

    // partner category toggle
    $(document).off("click", ".mbs_map_partner_list li a").on("click", ".mbs_map_partner_list li a", function(e){
        $(this).parents(".mbs_map_partner_list").find("li").removeClass("on");
        $(this).parents("li").addClass("on");

        setBottomLayout(mapBottomFix.type=1);
        $(document).find(".mbs_map-bottom .content_body").scrollTop(0);
    });
    
    // 목록보기 클릭
    $(document).on("click", ".map_control .btn_list", function(){ viewStoreList() })

    // 파트너 리스트 클릭
    $(".partner_list li a").on("click", function(){ viewStoreDetail() });
});

// resize
$(window).on("resize", ()=>{ setBottomLayout(mapBottomFix.type) });

// mousewheel
$(document).find(".mbs_map-bottom").on("mousewheel", function(e){
    let isOpen = $(document).find(".mbs_map-bottom").hasClass("on");
    if( !isOpen ) setBottomLayout(mapBottomFix.type=1);
});

// scroll
$(document).find(".content_body").on("scroll", function(e){

    let headFix = $(document).find(".content_head-fix");
    $(this).scrollTop() >= 50 ? headFix.addClass("scroll") : headFix.removeClass("scroll");

    let cntScroll = $(e.target).scrollTop();
    let scroll = Math.floor($(e.target).prop("scrollHeight") - $(e.target).outerHeight(true));
    
    if( scroll <= cntScroll ){ fnDataMore(); }  // partner_list 더보기
});


/**
 * @param {number} type  0:close, 1:open, 2:viewStoreDetail 
 */
const setBottomLayout = function(type){

    fnDataReset(type);  // reset

    if( type == 0 ){
        $(".content_head-fix").removeClass("scroll");
        $(document).find(".mbs_map-bottom .content_body").scrollTop(0);
    }

    const bottom = $(document).find(".mbs_map-bottom");
    const content = $(document).find(".content");
    const btn = $(document).find(".mbs_map-bottom .btn_open .blind");

    // transition
    if( bottom.hasClass("view") )       bottom.css({"transition": "none"});
    else                                bottom.css({"transition": ""});

    ( type == 1 ) ? bottom.addClass("on") : bottom.removeClass("on");
    ( type == 1 ) ? content.addClass("dim") : content.removeClass("dim");
    ( type == 1 ) ? btn.text("리스트 닫기") : btn.text("리스트 열기");

    ( type == 2 ) ? bottom.addClass("view") : bottom.removeClass("view");
    
    setFilter();
    setH(type);
}

/**
 * @param {number} type  0:close, 1:open, 2:viewStoreDetail 
 */
const setH = function(type){

    const contWrapH = $(".mbs_map-content").height();

    const headFix = $(document).find(".mbs_map-content .content_head-fix");
    const headBtmPad = headFix.css("padding-bottom").replace("px", "") * 1;
    let headFixH = $(document).find(".mbs_map-content .content_head-fix").outerHeight(true);

    // console.log(contWrapH, headFixH, contWrapH-headFixH);

    const btnOpenH = $(document).find(".mbs_map-bottom .btn_open").outerHeight(true);
    const cateH = $(document).find(".mbs_map-bottom .mbs_map_partner_list").outerHeight(true);
    const filterH = $(document).find(".mbs_map-bottom .filter_list").outerHeight(true);

    const filterOn = $(document).find(".mbs_map-bottom .filter_list").css("display") == "block";

    if( filterOn )  headFixH = btnOpenH + cateH + headBtmPad + filterH;
    else            headFixH = btnOpenH + cateH + headBtmPad;
    
    const body = $(document).find(".mbs_map-bottom .content_body");
    const contH = Math.round(contWrapH - headFixH);

    headFix.css({"height" : `${headFixH}px`});
    headFix.css({"flex" : `0 0 ${headFixH}px`});
    body.css({"height":`${contH}px`});
    body.css({"flex":`1 1 ${contH}px`});

}

// .mbs_map_partner_list (제휴처 브랜드 목록) 중 '해피콘'이 선택되어 있으면 해피콘의 필터(.filter_list)가 보여진다.
const setFilter = function(){
    const happycon = $(document).find(".happycon").hasClass("on");
    const filter = $(document).find(".filter_list");
    ( happycon ) ? filter.show() : filter.hide();
}

// 리스트 클릭 시 실행할 함수
const viewStoreDetail = function(){
    mapBottomFix.type = 2;
    setBottomLayout(mapBottomFix.type);
}

// 목록보기 클릭 시 실행할 함수
const viewStoreList = function(){
    mapBottomFix.type = 1;
    setBottomLayout(mapBottomFix.type);
}

// h1 활성화
const h1Hidden = function(){
    $(document).find(".container .content .title").removeClass("hidden");
}


/**
 * 현위치 버튼 on/off 클래스 부여 currentPositionBtn(1);
 * @param {Number} status 0:off, 1:on
 */
var currentPositionBtn = function(status){
    let cntBtn = $(document).find(".btn_location");
    ( status == 1 ) ? cntBtn.addClass("on") : cntBtn.removeClass("on");
}


// _touch gesture
var _touch = {
    startY: 0,
    endY: 0,
    init: function(){
        _touch.touchstart();
        _touch.touchend();
    },
    /**
     * touch 시작 위치 저장
     */
    touchstart: function(){
        $(window).on("touchstart", function(e){
            const touch = e.originalEvent.changedTouches[0] || e.originalEvent.touches[0];
            const y = touch.screenY;
            _touch.startY = y;
        })
    },
    /**
     * 터치 끝 위치 저장 후 시작 위치와 비교 ==> .mbs_map-bottom 열기/닫기 실행
     */
    touchend: function(){
        $(window).on("touchend", function(e){
            const target = e.target;
            if( !_touch.isTarget($(target)) ) return;   // .mbs_map-content 가 아니면 return;
        
            const touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            const y = touch.screenY;
            _touch.endY = y;
        
            const bottom = $(document).find(".mbs_map-bottom");
            const scrollTop = $(document).find(".content_body").scrollTop();   // pandown 시 scroll check
        
            if( _touch.startY - _touch.endY > 50 && !bottom.hasClass("on")  ){
                setBottomLayout(mapBottomFix.type=1);
            } else if ( _touch.endY - _touch.startY > 50 && scrollTop <= 0 ){
                setBottomLayout(mapBottomFix.type=0);
            }
        })
    },
    /**
     * @param {*} target jQuery element (ex) $(target)
     * @returns .mbs_map-content의 자식 element 면 true를 리턴한다.
     */
    isTarget: function(target){
        let result = ( target.parents(".mbs_map-content").length > 0 ) ? true : false;
        return result;
    }
}