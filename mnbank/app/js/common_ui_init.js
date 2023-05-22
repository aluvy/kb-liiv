/*
 * NEW KBSTAR 2021
 */
    accordionButton.init(); //아코디온
    tabMenu.init(); //탭메뉴
    progressDiv.init(); //스탭
    countNumber.init(); //countNumber
    tooltipButton.init(); //툴팁
    toggleButton.init(); //토글
    staffHopeSelect.init();//권유희망직원 선택
    anckorScroll.init(); //하단스크롤
    selectItem.init(); //항목선택
    transferMoney.init(); //이체 금액 입력폼
    dDay.init(); //거래내역조회 디데이위치
    scTop.init(); //추가정보입력 스크롤
$(function(){
    //jquery start
    "use strict";
 
    /* ohy init */
    _front.init();  
    
    
    //$.getScript('/mnbank/app/js/bfa/cmn/pip.video.js');
    
    
    $('#pipVideoScript').remove();
    var tag = document.createElement('script');
    tag.src = 'https://zmnbank.kbstar.com/mnbank/app/js/bfa/cmn/pip.video.js';
    tag.id = 'pipVideoScript';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);    
    setTimeout(function(){
    	try{window.MOVIE.moviePIPon();} catch(e){}
    },300)
    //try{window.MN_CAR.moviePIPon();} catch(e){}

    $('html').addClass('scroll_bounce_none');	// ios16 관성스크롤 막기(2022-12-10)
    //jquery end
});  