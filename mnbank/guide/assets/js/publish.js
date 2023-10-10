$(function(){
    var header = $('#header');
    var html;

    if( header.length >= 1 ){
        html = '<div class="inner"> ';
        html +='    <div class="action_back"> ';
        html +='        <button class="btn_back" type="button"><i class="ico_24_arrowback"></i><span class="hidden">이전</span></button> ';
        html +='    </div> ';
        html +='    <p class="page_title">타이틀 명</p> ';
        html +='    <div class="nav_wrap"> ';
        html +='        <button class="btn_menu" type="button"><i class="ico_24_menu"></i><span class="hidden">메뉴</span></button> ';
        html +='    </div> ';
        html +='</div> ';
    }
    //header.html(html);

    // 권유직원 선택
    var staffHope = $('.section .staff_hope');
    var staffHtml;

    if(staffHope.length > 0){
        staffHtml = '<!-- [개발] 방문이력이 있는 경우 노출 -->';
        staffHtml += '<ul class="list_comp check">';
        staffHtml += '    <li>';
        staffHtml += '        <span class="selection">';
        staffHtml += '            <input type="radio" id="rad_staff1" name="rad_staff">';
        staffHtml += '            <label for="rad_staff1" class="label">';
        staffHtml += '                <em>';
        staffHtml += '                    <span class="staff">김국민</span>';
        staffHtml += '                    <span class="office">역삼동 영업점 내점 상담</span>';
        staffHtml += '                    <span class="hope_date number">2021.05.23</span>';
        staffHtml += '                </em>';
        staffHtml += '            </label>';
        staffHtml += '        </span>';
        staffHtml += '    </li>';
        staffHtml += '    <li>';
        staffHtml += '        <span class="selection">';
        staffHtml += '            <input type="radio" id="rad_staff2" name="rad_staff">';
        staffHtml += '            <label for="rad_staff2" class="label">';
        staffHtml += '                <em>';
        staffHtml += '                    <span class="staff">이국민</span>';
        staffHtml += '                    <span class="office">역삼동 영업점 내점 상담</span>';
        staffHtml += '                    <span class="hope_date number">2021.04.23</span>';
        staffHtml += '                </em>';
        staffHtml += '            </label>';
        staffHtml += '        </span>';
        staffHtml += '    </li>';
        staffHtml += '</ul>';
        staffHtml += '<!-- //[개발] 방문이력이 있는 경우 노출 -->';
        staffHtml += '<p class="depth info">고객님의 상품 가입에 가장 도움이 된 상담직원 또는 전담직원을 선택해 주시기 바랍니다.</p>';
        staffHtml += '<div class="staff_hope_sel">';
        staffHtml += '    <div class="rdoChk_box">';
        staffHtml += '        <span class="selection">';
        staffHtml += '            <input type="radio" id="staff_hope_1" name="staff_hope">';
        staffHtml += '            <label for="staff_hope_1" class="label"><em>지점명</em></label>';
        staffHtml += '        </span>';
        staffHtml += '        <span class="selection">';
        staffHtml += '            <input type="radio" id="staff_hope_2" name="staff_hope">';
        staffHtml += '            <label for="staff_hope_2" class="label"><em>직원이름</em></label>';
        staffHtml += '        </span>';
        staffHtml += '        <span class="selection">';
        staffHtml += '            <input type="radio" id="staff_hope_3" name="staff_hope">';
        staffHtml += '            <label for="staff_hope_3" class="label"><em>직원번호</em></label>';
        staffHtml += '        </span>';
        staffHtml += '        <span class="selection">';
        staffHtml += '            <input type="radio" id="staff_hope_4" name="staff_hope" checked>';
        staffHtml += '            <label for="staff_hope_4" class="label"><em>없음</em></label>';
        staffHtml += '        </span>';
        staffHtml += '    </div>';
        staffHtml += '</div>';
        staffHtml += '<!-- 지점명 -->';
        staffHtml += '<div class="staff_hope_cts">';
        staffHtml += '    <div class="form_group">';
        staffHtml += '        <div class="form_tit hidden">지점명</div>';
        staffHtml += '        <div class="form_row">';
        staffHtml += '            <div class="select outline lg">';
        staffHtml += '                <button type="button" class="select_btn active" title="지점명 선택">지점명</button> <!-- [개발] 버튼에 값이 들어갈 경우 클래스 "active" 추가 -->';
        staffHtml += '            </div>';
        staffHtml += '        </div>';
        staffHtml += '        <div class="form_row">';
        staffHtml += '            <span class="input int_btn">';
        staffHtml += '                <input type="text" title="지점명 직접입력" placeholder="지점명" value="동여의도(김국민)" disabled>';
        staffHtml += '                <button type="button" class="btn point sm round">검색</button>';
        staffHtml += '            </span>';
        staffHtml += '        </div>';
        staffHtml += '        <div class="form_btm_full_wrap">';
        staffHtml += '            <span><button type="button" class="btn outline md">검색초기화</button></span>';
        staffHtml += '        </div>';
        staffHtml += '    </div>';
        staffHtml += '</div>';
        staffHtml += '<!-- //지점명 -->';
        staffHtml += '<!-- 직원이름 -->';
        staffHtml += '<div class="staff_hope_cts">';
        staffHtml += '    <div class="form_group">';
        staffHtml += '        <div class="form_tit hidden">직원이름</div>';
        staffHtml += '        <div class="form_row">';
        staffHtml += '            <span class="input int_btn">';
        staffHtml += '                <input type="text" title="직원이름 직접입력" placeholder="직원이름">';
        staffHtml += '                <button type="button" class="btn point sm round">검색</button>';
        staffHtml += '            </span>';
        staffHtml += '        </div>';
        staffHtml += '    </div>';
        staffHtml += '</div>';
        staffHtml += '<!-- //지점명 -->';
        staffHtml += '<!-- 직원번호 -->';
        staffHtml += '<div class="staff_hope_cts">';
        staffHtml += '    <div class="form_group">';
        staffHtml += '        <div class="form_tit hidden">직원번호</div>';
        staffHtml += '        <div class="form_row">';
        staffHtml += '            <span class="input int_btn">';
        staffHtml += '                <input type="text" title="직원번호 직접입력" placeholder="직원번호">';
        staffHtml += '                <button type="button" class="btn point sm round">검색</button>';
        staffHtml += '            </span>';
        staffHtml += '        </div>';
        staffHtml += '    </div>';
        staffHtml += '</div>';
        staffHtml += '<!-- //직원번호 -->';
    }
    staffHope.html(staffHtml);
    
    //큰글씨
    var $opener = window.opener;
    if ($opener) {
        if ($opener._target.hasClass('big_link')) {
            $('head').append('<link rel="stylesheet" data-description="큰글씨" href="../../mnbank/app/css/common_big.css">');
            $('html').removeAttr('class').addClass('big_mode');
        } else if ($opener._target.hasClass('dark_link')) {
            $('script').eq(0).before('<link rel="stylesheet" data-description="다크모드" href="../../../mnbank/app/css/common_dark.css">');
            $('html').removeAttr('class').addClass('dark_mode');
            //$('[rel=stylesheet]').eq(0).attr('href', '/mnbank/app/css/common_d.css'); 

            //추후삭제예정s
/*             var cssDk = $('[rel=stylesheet]').eq($('[rel=stylesheet]').length - 1);
            var cssDk2 = $('[rel=stylesheet]').eq($('[rel=stylesheet]').length - 2);
            if(cssDk.attr('href').indexOf('common_dark.css') === -1) {
                var chgCssDk = cssDk.attr('href').replace('.css', '_d.css');
                cssDk.attr('href', chgCssDk);
            } */
            //추후삭제예정e
        } else {
            $('html').removeAttr('class');
        }
    }
})
