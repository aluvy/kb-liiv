let mapBottomFix = { type: 0 }; // 0:close , 1:open, 2: viewStoreDetail

$(()=>{
    h1Hidden();
    setTimeout(() => { h1Hidden() }, 100);

    $("html, body").css({"overflow" : "hidden"});   // noScroll
    setBottomLayout(mapBottomFix.type);
    _Hammer.init();

    // partner category toggle
    $(document).off("click", ".mbs_map_partner_list li a").on("click", ".mbs_map_partner_list li a", function(e){
        $(this).parents(".mbs_map_partner_list").find("li").removeClass("on");
        $(this).parents("li").addClass("on");

        setBottomLayout(mapBottomFix.type=1);
        $(document).find(".mbs_map-bottom .content_body").scrollTop(0);
    });
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

    // setBottomLayout(mapBottomFix.type=1);
    let headFix = $(document).find(".content_head-fix");
    $(this).scrollTop() >= 50 ? headFix.addClass("scroll") : headFix.removeClass("scroll");

    let cntScroll = $(e.target).scrollTop();
    let scroll = Math.floor($(e.target).prop("scrollHeight") - $(e.target).outerHeight(true));

    // console.log("content_body scroll", cntScroll, scroll, scroll <= cntScroll);
    
    if( scroll <= cntScroll ){
        fnDataMore();   // 더보기
    }

});


const setBottomLayout = function(type){
    // 0:close , 1:open, 2: viewStoreDetail

    fnDataReset(type);  // reset

    if( type == 0 ){
        $(".content_head-fix").removeClass("scroll");
        $(document).find(".mbs_map-bottom .content_body").scrollTop(0);
    }

    const winH = $(window).height();
    const winW = $(window).width();
    const halfH = Math.round(winH / 2);
    const minH = 0;

    let closeViewH = 230;   // 닫혀있을때 보여질 높이
    if( winW <= 280 ){              closeViewH = 190;
    } else if ( winW <= 320 ){      closeViewH = 210;
    }
    let maxH = winH - closeViewH;

    maxH = (maxH <= halfH) ? halfH : maxH;

    const btm = ( type == 1 || type == 2 ) ? minH : maxH*-1;

    const bottom = $(document).find(".mbs_map-bottom");
    const content = $(document).find(".content");
    const btn = $(document).find(".mbs_map-bottom .btn_open .blind");

    if( type == 0 ){
        bottom.css({"bottom" : `calc(${btm}px + var(--sab) + var(--sat) )`});    // 닫혔을때
    } else {
        bottom.css({"bottom" : `${btm}px`}); // 열렸을때 0
    }

    ( type == 1 ) ? bottom.addClass("on") : bottom.removeClass("on");
    ( type == 1 ) ? content.addClass("dim") : content.removeClass("dim");
    ( type == 1 ) ? btn.text("리스트 닫기") : btn.text("리스트 열기");

    ( type == 2 ) ? bottom.addClass("view") : bottom.removeClass("view");
    
    setFilter();
    setH(type);
    //HammerPanReset();
}

const setH = function(type){
    const winH = $(window).height();
    const headH = $(document).find(".header .inner_sub").outerHeight(true);

    const headFix = $(document).find(".mbs_map-content .content_head-fix");
    const headBtmPad = headFix.css("padding-bottom").replace("px", "") * 1;
    let headFixH = $(document).find(".mbs_map-content .content_head-fix").outerHeight(true);
    const btnOpenH = $(document).find(".mbs_map-bottom .btn_open").outerHeight(true);
    const cateH = $(document).find(".mbs_map-bottom .mbs_map_partner_list").outerHeight(true);
    const filterH = $(document).find(".mbs_map-bottom .filter_list").outerHeight(true);

    const filterOn = $(document).find(".mbs_map-bottom .filter_list").css("display") == "block";

    if( filterOn ){
        headFixH = btnOpenH + cateH + headBtmPad + filterH;
    } else {
        headFixH = btnOpenH + cateH + headBtmPad;
    }

    const bottom = $(document).find(".mbs_map-bottom");
    const content = $(document).find(".mbs_map-bottom .mbs_map-content");
    const body = $(document).find(".mbs_map-bottom .content_body");
    
    const btmH = Math.round(winH - headH);
    const contH = Math.round(winH - headH - headFixH);

    bottom.css({"height":`${btmH}px`});
    content.css({"height":`${btmH}px`});

    headFix.css({"height" : `${headFixH}px`});
    headFix.css({"flex" : `0 0 ${headFixH}px`});
    body.css({"height":`${contH}px`});
    body.css({"flex":`1 1 ${contH}px`});

    if( type == 2 ) bottom.css({"height" : "auto"});
}

const setFilter = function(){
    // const bottom = $(document).find(".mbs_map-bottom").hasClass("on");
    const happycon = $(document).find(".happycon").hasClass("on");
    const filter = $(document).find(".filter_list");

    ( happycon ) ? filter.show() : filter.hide();
}


// hammer
var panElem = new Hammer(document.querySelector(".mbs_map-bottom .mbs_map-content"));
//panElem.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });
panElem.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
var tapElem = new Hammer(document.querySelector(".mbs_map-bottom .btn_open"));

var _Hammer = {
    init: function(){
        _Hammer.pan();
        //_Hammer.swipe();
        _Hammer.tap();
    },
    pan: function(order){    // 0:off, or on
        // const elem = document.querySelector(".mbs_map-bottom .mbs_map-content");
        // const wrap = new Hammer(elem);
        // if( order == undefined ) order = 1;
        // console.log(order);

        if( order == 0 ){
            panElem.off("panup pandown");
            console.log('::: hammer end ::: / order :', order);
            return;
        }

        console.log('::: hammer start ::: / order :', order);
        panElem.off("panup pandown").on("panup pandown", function(e){
    
            // store_item일때 예외처리
            // let isStoreItem = false;
            // let target = $(e.target);
            // let chkIdx = 3;
            // while( chkIdx > 0 ){
            //     if( target.hasClass("store_item") ) isStoreItem = true;
            //     target = target.parent();
            //     chkIdx--;
            // }
            // if(isStoreItem) return;
    
            console.log('Hammer test', e.type);
            
            const bottom = $(document).find(".mbs_map-bottom");
            const type = e.type;
            const scrollTop = $(document).find(".content_body").scrollTop();   // pandown 시 scroll check
    
            if( type == 'panup' && !bottom.hasClass("on") ){
                setBottomLayout(mapBottomFix.type=1);
            } else if ( type == 'pandown' && scrollTop <= 0 ) {
                setBottomLayout(mapBottomFix.type=0);
            }
        });
    }/*,
    swipe : function() {

        panElem.on("swipeup", function(e) {
            console.log('Hammer swipeup', e.type);

            const bottom    = $(document).find(".mbs_map-bottom");

            if (!bottom.hasClass("on")) {
                setBottomLayout(mapBottomFix.type=1);
            }
        });

        panElem.on("swipedown", function(e) {
            console.log('Hammer swipedown', e.type);

            const scrollTop = $(document).find(".content_body").scrollTop();

            if (scrollTop <= 0) {
                setBottomLayout(mapBottomFix.type=0);
            }
        });
    }*/,
    tap: function(){
        // const elem = document.querySelector(".mbs_map-bottom .btn_open");
        // const mc = new Hammer(elem);
        tapElem.off("tap").on("tap", function(e){
            const bottom = $(document).find(".mbs_map-bottom");
            mapBottomFix.type = ( bottom.hasClass("on") ) ? 0 : 1;
            setBottomLayout( mapBottomFix.type );
        });
    }
};

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

// 목록보기 클릭
$(document).on("click", ".map_control .btn_list", function(){
    viewStoreList();
})

$(".partner_list li a").on("click", function(){
    viewStoreDetail();
});


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


const HammerPanReset = function(){
    _Hammer.pan(0); // end
    _Hammer.pan();  // start
}