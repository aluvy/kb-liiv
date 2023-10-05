window.addEventListener("load", ()=>{
  mobileChk();
  window.addEventListener('resize', setVh);
  setVh();

  containerPad();
  window.addEventListener("resize", containerPad);
  
  // ink__item
  const linkItem = Array.from(document.querySelectorAll('.link__item'));
  linkItem.forEach((item)=>{
    item.addEventListener("click", (e)=>{
      e.preventDefault();
      if( $(item).hasClass("disabled") || $(item).attr("disabled") !== undefined  ){ return } // disabled check
      pageChange(item.dataset.link)
    })
  })


  const step1Swiper = new Swiper(".step1__swiper", {
    pagination: {
      el: ".pagination",
    },
    on: {
      slideChange: function(swiper){
        const isEnd = swiper.isEnd;
        isEnd ? $('.intro__btn').removeClass('disabled') : $('.intro__btn').addClass('disabled');
      }
    }
  });

  agree();



  





  $(window).scroll(function (event) {
    let scroll = $(window).scrollTop();
    
    if(scroll > 60){
      $('.float_billtype3_6').stop().fadeIn('fast');
    }else{
      $('.float_billtype3_6').stop().fadeOut('fast');
    }
  });

  $("a").click(function(e){ 
    if($(this).hasClass('disabled') || $(this).hasClass('disabled-type2') || $(this).attr('href') == '#'){
      e.preventDefault(); 
    }
  }); 
  
  $(document).on("click", ".toastpopup", function (e) {
    e.preventDefault();
    $('.card__item-toastpopup').fadeIn('fast');
    $('.card__item-toastpopup').addClass('active');
    $('.card__item-toastpopup .container').css('transform','translateY(-100%)');
    $('html').css('overflow','hidden');
  });

  $(document).on("click", ".toastpopup-close", function (e) {
    e.preventDefault();
    $('.card__item-toastpopup').fadeOut(function(){
      $('.card__item-toastpopup').css('display','none');
    })
    $('.card__item-toastpopup').removeClass('active');
    $('.card__item-toastpopup .container').css('transform','translateY(0%)');
    $('html').css('overflow','auto');
  });

  $(document).on("click", ".billtype3-2", function (e) {
    if(!$(this).hasClass('disabled')){
      $('.section__billtype3-1').removeClass('active');
      $('.section__billtype3-2').addClass('active');
    }else{
      e.preventDefault();
    }
  });

  $(document).on("click", ".section__billtype3-3 .img_radio", function (e) {
    if($(this).index() == 0){
      $('.section__billtype3-3 .foot__btn a').removeClass('disabled');
    }else{
      $('.section__billtype3-3 .foot__btn a').addClass('disabled');
    }
  });

  $(document).on("click", ".section__billtype3-3-1 .img_radio", function (e) {
    if($(this).index() == 1){
      $('.section__billtype3-3-1 .foot__btn a').removeClass('disabled');
    }else{
      $('.section__billtype3-3-1 .foot__btn a').addClass('disabled');
    }
  });

  $(document).on("keyup", "#usim-address2", function (e) {            
    if($(this).val() != ''){
      $('.section__billtype3-4 .foot__btn a').removeClass('disabled');
    }else{
      e.preventDefault();
    }
  });

  $(document).on("keyup", "#user_phone", function (e) {            
    if($(this).val() != ''){
      $('.section__billtype3-5 .foot__btn a').removeClass('disabled');
    }else{
      e.preventDefault();
    }
  });
  
  $(document).on("change",".section__billtype3-1 .email_row.secend select",function(){
    $('.section__billtype3-1 .billtype3-2.disabled').removeClass('disabled');
  });

  $(document).on("change",".section__billtype3-1 .email_row.secend select",function(){
    $('.section__billtype3-1 .billtype3-2.disabled').removeClass('disabled');
  });

  $(document).on("click", ".btn-dropdown", function (e) {
    $(this).hide().addClass('active');
    $('.dropdown1').hide();
    $('.dropdown2').fadeIn();   
  });

  $(".section__joincard .form__item-input.flex input").keyup (function () {
    var charLimit = $(this).attr("maxlength");
    if (this.value.length >= charLimit) {
      $(this).parent().next().find('input').focus();
      return false;
    }
  });



  // step1 유심 라디오버튼 임시
  // const radioSelect = Array.from(document.querySelectorAll(".rdo__item"));
  // const radioResult = document.querySelectorAll(".rdo__result");
  // radioSelect.forEach((rdo)=>{
  //     const rdoTxt = rdo.getAttribute("data-txt");
  //     console.log(document.querySelector('input[type=radio]:checked').value);
  //     if(rdo.classList.contains("active")){
  //         radioResult.forEach((result)=>{
  //             result.innerHTML = rdoTxt;
  //         })
  //     };
  //     rdo.addEventListener("click", (e)=>{
  //         console.log(document.querySelector('input[type=radio]:checked').value);
  //         radioResult.forEach((result)=>{
  //             result.innerHTML = rdoTxt;
  //         })
  //     })
  // })


  // close 버튼 팝업
  // const btnClose = document.querySelector('header .btn__close');
  // const leavepop = document.querySelector('#leave__pop');
  // const dim = document.querySelector('.dim');

  // btnClose.addEventListener("click", function(e){
  //     e.preventDefault;
  //     leavepop.classList.toggle("active");
  //     dim.classList.toggle("active");
  // });
  // leavepop.addEventListener("click", function(e){
  //     e.preventDefault;
  //     leavepop.classList.toggle("active");
  //     dim.classList.toggle("active");
  // });

  // step1 아코디언 버튼
  $(".acco__btn").each(function(){
    $(this).on('click', function(){
      $(this).closest('.acco__wrap').toggleClass('active');
      $(this).siblings('.acco__cont').slideToggle(200);
    })
  })

})


// 모바일 100vh 대응
const setVh = () => { document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`) };

// mobile check
function mobileChk(agent) {
  const mobileRegex = [/Android/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i];
  const userAgent = window.navigator.userAgent;
  const isMobile = mobileRegex.some(mobile => userAgent.match(mobile));
  isMobile ? document.querySelector("html").classList.add("mobile") : document.querySelector("html").classList.add("pc");   // mobile check
  return isMobile;
}

// header, footer padding setting
const containerPad = function(){
  const head = document.querySelector(".active header") ?? 0;
  const foot = document.querySelector(".active footer") ?? 0;
  const contentWrap = document.querySelector(".active .container__wrap") ?? 0;
  if( contentWrap == 0 ) return;
  head ? contentWrap.style.paddingTop = `${head.offsetHeight}px` : contentWrap.style.paddingTop = "";
  foot ? contentWrap.style.paddingBottom = `${foot.offsetHeight}px` : contentWrap.style.paddingBottom = "";
}


/**
 * section__step1_2 radio 선택 시 선택된 요금제 show
 * @param {*} a : this (input) 
 */
const step2Radio = function(a){
  const result = document.querySelector('.active .rdo__result');
  const button = document.querySelector('.active .link__item');
  result.classList.add('active');
  button.classList.remove('disabled');
  const flag = a.dataset.flag;
  const charge = a.dataset.charge;
  result.querySelector('.flag').innerText = flag;
  result.querySelector('.charge span').innerText = charge;
}












// footer home bar check
// const getFootPad = function(){
//     const foot = Array.from(document.querySelectorAll("footer"));                   // footer elem
//     const footH = document.querySelector(".active .foot__btn") ? document.querySelector(".active .foot__btn").offsetHeight : 0;   // 하단 버튼 높이
//     foot.forEach((item)=>{ item.style.bottom = `-${footH * 0.2}px`; })
// }

// page link
const pageChange = function(link){
  const section = Array.from(document.querySelectorAll(".content__section"));
  section.forEach((item)=>{ item.classList.remove("active") })
  window.scrollTo(0, 0);
  document.querySelector(`.${link}`).classList.add("active");
  containerPad();
}

$(document).ready(function(){
  $(document).on("click", ".img_radio", function () {
      $(this).siblings().removeClass('active');
      if(!$(this).hasClass('active')){
          $(this).addClass('active');
      }
      
  });

  /* clear text */
  $('form').on('click','.form-text + label + .clear-text', function(e) {
  e.preventDefault();
  console.log('clear text.');
  $(this).prev().prev('input').val('');
  return false;
  });

  /* input without required attribute */
  $('form').on('focus blur keyup','.form-text:not([required])', function(e) {
  e.preventDefault();
  if($(this).val().length) {
      $(this).addClass('valid-text');
  } else {
      $(this).removeClass('valid-text');
  }
  });
  $('form').on('click','.form-text:not([required]) + label + .clear-text', function(e) {
  e.preventDefault();
  console.log('remove valid-text.');
  $(this).prev().prev('input').removeClass('valid-text');
  return false;
  });






  // radio group active
  // $(document).find('.radio__group .radio__item input').on("change", function(){
  //     const radioGroup = $(this).parents(".radio__group");
  //     radioGroup.find(".radio__item").removeClass("active");
  //     $(this).parents(".radio__item").addClass("active")
  // })
  $(document).find('.radio__group .radio__item').on("click", function(){
      const radioGroup = $(this).parents(".radio__group");
      radioGroup.find(".radio__item").removeClass("active");
      $(this).addClass("active");
      radioGroup.find(".radio__item input").prop("checked", false);
      $(this).find("input").prop("checked", true);
  })

  // form focus
  $(document).find(".form__item input").on("focus", function(){
      $(this).parents(".form__item").addClass("focus");
  })
  $(document).find(".form__item input").on("blur", function(){
      $(this).parents(".form__item").removeClass("focus");

      // console.log( $(this).parents(".form_item").find("input") )

      // if( $(this).val().length > 0 ){
      //     $(this).parents(".form__item").addClass("active");
      // } else {
      //     $(this).parents(".form__item").removeClass("active");
      // }
  })

  // form active
  $(document).find(".form__group input").on("propertychange change keyup keypress keydown paste input blur", function(){
    if( $(this).val().length > 0 ){
      $(this).parents(".form__item").addClass("active");
      $(this).parents('.form__item-hasbtn').addClass("active");
    } else {
      $(this).parents(".form__item").removeClass("active");
      $(this).parents('.form__item-hasbtn').removeClass("active");
    }
  })

  // regNo text change 2******
  $(document).find(".regNo2").on("input", function(){
      const value = $(this).val();
      let star ="";
      if (value){
          for(let i=1; i<value.length; i++){ star += "●" }
          $(this).val($(this).val()[0] + star)
      }
  })

  // clear-text
  $(document).find(".form__group .clear-text").on("click", function(){
      $(this).prev("input").val("");
      $(this).parents(".form__item-hasbtn").removeClass("active");

      let input = $(this).parents(".form__item").find("input");
      let count = 0;

      input.each((idx, item)=>{ if( $(item).val().length > 0 ){ count++ } })
      if( count < 1 ){ $(this).parents(".form__item").removeClass("active"); }
  })

  // // help toast open
  // $(document).find(".link__help").on("click", function(e){
  //     e.preventDefault();
  //     $(document).find(".section__joinhelp").addClass("open");
  // })
  // // help close
  // $(document).find(".link__help-close").on("click", function(e){
  //     e.preventDefault();
  //     if( $(this).hasClass("disabled") ){ return false }
  //     $(document).find(".section__joinhelp").removeClass("open");
  // })

  // leave popup open
  // $(document).find(".link__leave").on("click", function(e){
  //     e.preventDefault();
  //     $(document).find(".section__leave").addClass("open");
  // })
  // $(document).find(".link__leave-close").on("click", function(e){
  //     e.preventDefault();
  //     $(document).find(".section__leave").removeClass("open");
  // })




  

  // disabled check - 가입유형 선택 (번호이동/신규가입)
  $(document).on("click", ".section__step1_1 .img_radio", function(){
    $(document).find(".section__step1_1 .foot__btn .link__item").addClass("disabled");
      const elem = $(document).find(".section__step1_1 .img_radio").eq(1);
      elem.hasClass("active") ? $(document).find(".section__step1_1 .foot__btn .link__item").removeClass("disabled") : null;
  })



  // disabled check - 요금제 선택
  $(document).on("click", ".section__step1_2 .img_radio", function(){
    $(document).find(".section__step1_2 .foot__btn .link__item").removeClass("disabled");
  })

  // disabled check - 개통유형 선택 (유심 개통/eSIM 개통)
  $(document).on("click", ".section__step1_3 .img_radio", function(){
    $(document).find(".section__step1_3 .foot__btn .link__item").addClass("disabled");
      const elem = $(document).find(".section__step1_3 .img_radio").eq(0);
      elem.hasClass("active") ? $(document).find(".section__step1_3 .foot__btn .link__item").removeClass("disabled") : null;
  })

  // disabled check - 유심정보 선택 (유심이 없어요/유심이 있어요)
  $(document).on("click", ".section__step1_4 .img_radio", function(){
    $(document).find(".section__step1_4 .foot__btn .link__item").addClass("disabled");
      const elem = $(document).find(".section__step1_4 .img_radio").eq(0);
      elem.hasClass("active") ? $(document).find(".section__step1_4 .foot__btn .link__item").removeClass("disabled") : null;
  })

  // disabled check - 가입유형 선택 (개인/개인사업자)
  $(document).on("click", ".section__jointype .img_radio", function(){
      $(document).find(".section__jointype .foot__btn .link__item").addClass("disabled");
      const elem = $(document).find(".section__jointype .img_radio").eq(0);
      elem.hasClass("active") ? $(document).find(".section__jointype .foot__btn .link__item").removeClass("disabled") : null;
  })
  // disabled check - 가입유형 선택 (만 19세 이상 성인)
  $(document).on("click", ".section__jointype2 .radio__item", function(){
      $(document).find(".section__jointype2 .foot__btn .link__item").addClass("disabled");
      const elem = $(document).find(".section__jointype2 .radio__group .radio__item").eq(0);
      elem.hasClass("active") ? $(document).find(".section__jointype2 .foot__btn .link__item").removeClass("disabled") : null;

  })
  // disabled check - 가입자 유형 선택 (신분증 확인)
  $(document).on("click", ".section__jointype3 .img_radio", function(){
      $(document).find(".section__jointype3 .foot__btn .link__item").addClass("disabled");
      const elem = $(document).find(".section__jointype3 .img_radio_wrap .img_radio").eq(0);
      elem.hasClass("active") ? $(document).find(".section__jointype3 .foot__btn .link__item").removeClass("disabled") : null;
  })

  // disabled check - 가입자 유형 선택 (이름/주빈먼호/발급일자)
  $(document).on("input click", ".section__jointype4 .form__group", function(){
      $(document).find(".section__jointype4 .foot__btn .link__item").addClass("disabled");

      const name = $(document).find(".section__jointype4 form .jointype4_name");
      const regNo = $(document).find(".section__jointype4 form .regNo");
      const regNo2 = $(document).find(".section__jointype4 form .regNo2");
      const date = $(document).find(".section__jointype4 form .jointype4_date");

      if( name.val().length < 1 ){ return false }
      if( regNo.val().length < 1 ){ return false }
      if( regNo2.val().length < 1 ){ return false }
      if( date.val().length < 1 ){ return false }

      $(document).find(".section__jointype4 .foot__btn .link__item").removeClass("disabled");
  })

  // disabled check - 인증방법(KB모바일인증서, 신용카드 인증)
  $(document).on("click", ".section__joinauth .img_radio", function(){
      $(document).find(".section__joinauth .foot__btn .link__item").addClass("disabled");
      const elem = $(document).find(".section__joinauth .img_radio_wrap .img_radio").eq(1);
      elem.hasClass("active") ? $(document).find(".section__joinauth .foot__btn .link__item").removeClass("disabled") : null;
      // $(document).find(".section__joinauth .foot__btn .link__item").removeClass("disabled")
  })

  // disabled check - 로그인정보 필요
  $(document).on("input click", ".section__joininfo form", function(){
      $(document).find(".section__joininfo .foot__btn .link__item").addClass("disabled");

      const id = $(document).find(".section__joininfo .section__joininfo_id");
      const pw = $(document).find(".section__joininfo .section__joininfo_pw");
      const pw2 = $(document).find(".section__joininfo .section__joininfo_pw2");

      if( id.val().length < 1 ){ return false }
      if( pw.val().length < 1 ){ return false }
      if( pw2.val().length < 1 ){ return false }

      $(document).find(".section__joininfo .foot__btn .link__item").removeClass("disabled");
  })

  // disabled check - 기본 정보입력 ( 이메일 )
  $(document).on("input click change", ".section__joininfo2 form", function(){
      $(document).find(".section__joininfo2 .foot__btn .link__item").addClass("disabled");

      const email = $(document).find(".section__joininfo2 .section__joininfo2_email");
      const email2 = $(document).find(".section__joininfo2 .section__joininfo2_email2");

      if( email.val().length < 1 ){ return false }
      if( email2.find("option:selected").val() < 1 ){ return false }

      $(document).find(".section__joininfo2 .foot__btn .link__item").removeClass("disabled");
  })

  // disabled check - 기본 정보입력 ( 주소지 )
  $(document).on("input click", ".section__joinaddress form", function(){
      $(document).find(".section__joinaddress .foot__btn .link__item").addClass("disabled");

      const address1 = $(document).find(".section__joinaddress .section__joinaddress_address1");
      const address2 = $(document).find(".section__joinaddress .section__joinaddress_address2");

      if( address1.val().length < 1 ){ return false }
      if( address2.val().length < 1 ){ return false }

      $(document).find(".section__joinaddress .foot__btn .link__item").removeClass("disabled");
  })
  // disabled check - 요금 청구서 수령방법(문자, 이메일)
  $(document).on("click", ".section__joinbill .img_radio", function(){
      $(document).find(".section__joinbill .foot__btn .link__item").addClass("disabled");
      const elem = $(document).find(".section__joinbill .img_radio_wrap .img_radio").eq(0);
      elem.hasClass("active") ? $(document).find(".section__joinbill .foot__btn .link__item").removeClass("disabled") : null;
  })

  // disabled check - 요금 납부 방법 (신용카드, 계좌이체)
  $(document).on("click change", ".section__joinpay .img_radio, .section__joinpay .check-type1 input", function(){
      $(document).find(".section__joinpay .section__joinpay-btn .link__item").addClass("disabled");

      const elem = $(document).find(".section__joinpay .img_radio_wrap .img_radio").eq(0);
      const checkbox = $(document).find(".section__joinpay .check-type1 input");

      if( elem.hasClass("active") && checkbox.is(":checked") ){
          $(document).find(".section__joinpay .section__joinpay-btn .link__item").removeClass("disabled");
      }
  })

  // disabled check - 요금 납부 방법
  $(document).on("input click", ".section__joincard form", function(){
      $(document).find(".section__joincard .foot__btn .link__item").addClass("disabled");

      const input1 = $(document).find(".section__joincard .section__joincard_1");
      const input2 = $(document).find(".section__joincard .section__joincard_2");
      const input3 = $(document).find(".section__joincard .section__joincard_3");
      const input4 = $(document).find(".section__joincard .section__joincard_4");
      const input5 = $(document).find(".section__joincard .section__joincard_5");

      if( input1.val().length < 1 ){ return false }
      if( input2.val().length < 1 ){ return false }
      if( input3.val().length < 1 ){ return false }
      if( input4.val().length < 1 ){ return false }
      if( input5.val().length < 1 ){ return false }

      $(document).find(".section__joincard .foot__btn .link__item").removeClass("disabled");
  })
  $(document).on("input", ".section__joincard_1, .section__joincard_2, .section__joincard_3, .section__joincard_4", function(){
      // $(document).find(".section__joincard_1")
  })

  // disabled check - 가입상담 신청하세요
  // $(document).on("input click change", ".section__joinhelp form, .section__joinhelp .section__joinhelp-checkbox", function(){
  //     $(document).find(".section__joinhelp .section__joinhelp-btn .link__help-close").addClass("disabled");

  //     const name = $(document).find(".section__joinhelp .section__joinhelp_name");
  //     const name2 = $(document).find(".section__joinhelp .section__joinhelp_name2");
  //     const checkbox = $(document).find(".section__joinhelp .section__joinhelp-checkbox");

  //     if( name.val().length < 1 ){ return false }
  //     if( name2.val().length < 1 ){ return false }
  //     if( checkbox.is(":checked") ){
  //         $(document).find(".section__joinhelp .section__joinhelp-btn .link__help-close").removeClass("disabled");
  //     }
  // })





  




  // 신용카드 선택
  $(document).on("click", ".joincard__card__wrap ul li", function(){
      $(document).find(".joincard__card__wrap ul li").removeClass("active");
      $(this).addClass("active");
  })
})




/**
 * 약관동의 (관련 클래스 : agreeAll, agreeGroup, agreeItem);
 */
const agree = function(){
  // 전체 동의
  $(document).on('change', '.agreeAll', function(){
    const isChecked = $(this).is(":checked");
    $(document).find(".active input[type='checkbox']").prop('checked', isChecked);

    const button = $(document).find('.active .link__item');
    const wrap = $(this).parents(".check__list__wrap");

    isChecked ? wrap.addClass('active') : wrap.removeClass('active');
    isChecked ? button.removeClass('disabled') : button.addClass('disabled');
  });
  
  // 그룹 동의
  $(document).on('change', '.agreeGroup', function(){
    const isChecked = $(this).is(":checked");
    $(this).parents('.check__wrap').find('.agreeItem').prop('checked', isChecked).trigger('change');
  });

  // 동의 체크박스
  $(document).on('change', '.agreeItem', function(){
    const agreeGroup = $(this).parents(".check__wrap").find('.agreeGroup');
    const agreeAll = $(this).parents(".agr__group").find(".agreeAll");

    // group
    const chkbox = $(this).parents(".check__wrap").find(".agreeItem");
    let chkedBox = chkbox.filter( (idx, item) => $(item).is(":checked") );
    ( chkbox.length == chkedBox.length ) ? agreeGroup.prop('checked', true) : agreeGroup.prop('checked', false);

    // all
    const allChkbox = $(this).parents(".agr__group").find(".agreeItem");
    let allChkedBox = allChkbox.filter( (idx, item) => $(item).is(":checked") );
    ( allChkbox.length == allChkedBox.length ) ? agreeAll.prop('checked', true) : agreeAll.prop('checked', false);
  });
}