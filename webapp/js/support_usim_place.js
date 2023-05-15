/* Hammer.js 제거 버전 */

let mapBottomFix = { type: 0 }; // 0:close , 1:open, 2: viewStoreDetail

$(()=>{
    h1Hidden();
    setTimeout(() => { h1Hidden() }, 100);
    // $("html, body").addClass("noScroll");   // noScroll
    $("html, body").addClass("no_scroll");  // [05/11] 클래스변경

    setBottomLayout(mapBottomFix.type);
    _touch.init();

    // .usim_map-bottom 열기/닫기
    $(document).on("click", ".btn_open", function(){
        const bottom = $(document).find(".usim_map-bottom");
        mapBottomFix.type = ( bottom.hasClass("on") ) ? 0 : 1;
        setBottomLayout( mapBottomFix.type );
    });

    // 검색창 focus 시
    $(document).on("focus", ".usim_map-search input", function(e){
        const bottom = $(document).find(".usim_map-bottom");
        setBottomLayout( mapBottomFix.type=1 );
    });
    
    // 목록보기 클릭
    $(document).on("click", ".map_control .btn_list", function(){ viewStoreList() })

    // 파트너 리스트 클릭
    $(".partner_list li a").on("click", function(){ viewStoreDetail() });
});

// resize
$(window).on("resize", ()=>{ setBottomLayout(mapBottomFix.type) });

// mousewheel
$(document).find(".usim_map-bottom").on("mousewheel", function(e){
    let isView = $(document).find(".usim_map-bottom").hasClass("view");
    if(isView) return;

    let isOpen = $(document).find(".usim_map-bottom").hasClass("on");   // 열렸을때 true
    let cntScroll = $(".content_body").scrollTop();
    const deltaY = e.originalEvent.deltaY;  // 위로(-), 아래로(+)

    if( deltaY < 0 && cntScroll <= 0 && isOpen ){
        setBottomLayout(mapBottomFix.type=0);

    } else if ( deltaY > 0 && !isOpen ){
        setBottomLayout(mapBottomFix.type=1);
    }
});

// scroll
$(document).find(".content_body").on("scroll", function(e){

    // let headFix = $(document).find(".content_head-fix");
    // $(this).scrollTop() >= 50 ? headFix.addClass("scroll") : headFix.removeClass("scroll");

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
        $(document).find(".usim_map-bottom .content_body").scrollTop(0);
    }

    const bottom = $(document).find(".usim_map-bottom");
    const content = $(document).find(".content");
    const btn = $(document).find(".usim_map-bottom .btn_open .blind");

    // transition
    if( bottom.hasClass("view") )       bottom.css({"transition": "none"});
    else                                bottom.css({"transition": ""});

    ( type == 1 ) ? bottom.addClass("on") : bottom.removeClass("on");
    ( type == 1 ) ? content.addClass("dim") : content.removeClass("dim");
    ( type == 1 ) ? btn.text("리스트 닫기") : btn.text("리스트 열기");

    ( type == 2 ) ? bottom.addClass("view") : bottom.removeClass("view");
    ( type == 2 ) ? $(".usim_map-search").hide() : $(".usim_map-search").show();

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

// 이 지역에서 재검색 버튼
const setResetBtn = function(type){    // 0:감추기, 1:보이기
    let display = (type == 0) ? "none" : "inline-flex";
    const elem = $(document).find(".btn_map_reset");
    elem.css({"display" : display});
}

// 검색모드 ui 셋팅
const setSearchMode = function(type){   // 0:검색모드X, 1:검색모드
    const elem = $(document).find(".content");
    if( type == 0 ){
        elem.removeClass("search");
    } else {
        elem.addClass("search");
    }
}

// h1 활성화, inner_sub z-index
const h1Hidden = function(){
    $(document).find(".container .content .title").removeClass("hidden");
    $(document).find(".inner_sub").css({"z-index" : "10"});
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
     * 터치 끝 위치 저장 후 시작 위치와 비교 ==> .usim_map-bottom 열기/닫기 실행
     */
    touchend: function(){
        $(window).on("touchend", function(e){
            const target = e.target;
            if( !_touch.isTarget($(target)) ) return;   // .usim_map-content 가 아니면 return;
        
            const touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            const y = touch.screenY;
            _touch.endY = y;
        
            const bottom = $(document).find(".usim_map-bottom");
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
     * @returns .usim_map-content의 자식 element 면 true를 리턴한다.
     */
    isTarget: function(target){
        let result = ( target.parents(".usim_map-content").length > 0 ) ? true : false;
        return result;
    }
}