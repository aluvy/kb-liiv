
const _alarm = {
    lastSwipe : 0,  // time
    clickGap : 100,
    tabGap : 500,
    isClick : function(time){   // _alarm.isClick(time) == true => click event
        let t = time - _alarm.lastSwipe;
        if( t < _alarm.clickGap ) return false;
        return true;
    },
    isTap : function(time){     // _alarm.isClick(time) == true => click event
        let t = time - _alarm.lastSwipe;
        if ( t > _alarm.clickGap && t < _alarm.tabGap ) return true;
        return false;
    }
}

$(()=>{
    // tab click
    $('.tab_list button').on('click', function(){ window.scrollTo(0,0) });

    // li a click
    $(document).find(".noti_list li a").on("click", function(e){
        let time = new Date().getTime();
        if( !_alarm.isClick(time) ){
            e.preventDefault();
            return;
        }
        $(this).parents(".noti_list").find("li").removeClass("on");
        console.log("click");
    })
})


$(window).scroll(function(){
    let wTop = $(document).scrollTop() + 60;
    let tabTop = $('.tab_wrap').offset().top;
    // console.log(wTop, tabTop)
    wTop > tabTop ? $('.tab_wrap').addClass('fixed') : $('.tab_wrap').removeClass('fixed');
});


// hammer
$(()=>{

    let list = $(document).find(".noti_list li a");
    list.each((idx, item)=>{

        let mc = new Hammer(item);
        delete Hammer.defaults.cssProps.userSelect;
        // mc.get('tap').set({direction: Hammer.DIRECTION_ALL});
        mc.get('swipe').set({direction: Hammer.DIRECTION_HORIZONTAL});

        mc.off("swiperight swipeleft").on("swiperight swipeleft", function(e){
            _alarm.lastSwipe = new Date().getTime();
            const type = e.type;

            if( type == "swipeleft" ){
                $(item).parents("li").addClass("on");
                $(item).parents("li").siblings("li").removeClass("on");
            } else if( type == "swiperight" ) {
                $(item).parents("li").removeClass("on");
            }
        });

        mc.off("tap").on("tap", function(e){
            let isMouse = e.pointerType == "mouse";
            let time = new Date().getTime();

            if(isMouse) return;            

            if( _alarm.isTap(time) ) $(item).click();
        })
        
        // mc.off("panleft panright").on("panleft panright", function(e){
        //     let btn = $(item).parents("li").find(".btn_list_delete").width() * -1;  // 23/03/08 수정: 라인 이동

        //     $(item).parents("li").siblings("li").css({ "transform" : "matrix(1, 0, 0, 1, 0, 0)" });

        //     x = e.deltaX;
        //     angle = e.angle;

        //     console.log(angle, e.changedPointers[0].type);

        //     x = ( x <= btn ) ? btn : x;                     // min (btn)
        //     x = ( x >= 0 ) ? 0 : x;                         // max (0)

        //     if (   ( angle >= -180 && angle <= -165 )
        //         || ( angle >= 165 && angle <= 180 )
        //         || ( angle >= -20 && angle <= 20 ) ){
        //         $(item).parents("li").css({ "transform" : `matrix(1, 0, 0, 1, ${x}, 0)` });
        //     }

        //     if( e.changedPointers[0].type == "pointerup" ){
        //         x = ( x >= btn / 2 ) ? 0 : btn;
        //         $(item).parents("li").css({ "transform" : `matrix(1, 0, 0, 1, ${x}, 0)` });
        //     }
        //     ( x == 0 ) ? $(item).parents("li").removeClass("on") : $(item).parents("li").addClass("on");

        // })


    })

})