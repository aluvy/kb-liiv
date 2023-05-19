$(document).ready(function(){
	
	$("a[href='#'], a[href='#none']").on('click', function(e){
		e.preventDefault();
		// return false
	});

    // 상단 메뉴 include 관련
	// if($('.header').hasClass('sub')){
	// 	$('.header.sub').load('/pub/html/include/header_sub.html');
	// } else if($('.header').hasClass('detail')){
	// 	$('.header.detail').load('/pub/html/include/header_detail.html');
	// } else if($('.header').hasClass('event')){
	// 	$('.header.event').load('/pub/html/include/header_event.html');
	// } else if($('.header').hasClass('layer')){
	// 	$('.header.layer').load('/pub/html/include/header_layer.html');
	// }
	// [02/27] header include 방식 변경
	let HeaderHTML = ``;
	if($('.header').hasClass('sub')){			HeaderHTML = _header.sub;
	} else if($('.header').hasClass('detail')){	HeaderHTML = _header.detail;
	} else if($('.header').hasClass('event')){	HeaderHTML = _header.event;
	} else if($('.header').hasClass('layer')){	HeaderHTML = _header.layer;
	}
	$(".header").prepend(HeaderHTML);


	$('.table_ia').each(function(){
		$(this).find("table tbody tr:not(.hidden)").each(function(index){
			$("td:first-child", this).text(index +1);
		});
		$tr = $(this).find("table tbody tr:not(.hidden)");
		$trEnd = $(this).find("table tbody tr.end:not(.hidden)");
		$trModify = $(this).find("table tbody tr.modify:not(.hidden)");
		$(this).find(".rate").html("<em>총</em>" + $tr.length + "<em>잔여</em>" + ($tr.length - $trEnd.length - $trModify.length) + "<em>진행률</em>" + parseInt(($trEnd.length + $trModify.length)/$tr.length*100) + "%");
		$(this).find(".info").html("<span class='ing'>1. 진행중</span><span class='waiting'>2. 대기</span><span class='end'>3. 완료</span><span class='modify ing'>4. 수정중</span><span class='modify'>5. 수정완료</span>");
	});

	// tip commnet layer 관련
	$(".comment > a").each(function(){
		$(this).click(function(){
			if($(this).next("div").hasClass("on")){
				$(this).removeClass("on");
				$(this).next("div").removeClass("on").slideUp(200);
			} else {
				$(".comment > div").removeClass("on").slideUp(200);
				$(this).next("div").addClass("on").slideDown(200);
				$(this).addClass("on");
			}
			return false
		});
	});

	$(".btn_area .btn_code").each(function(){
		$(this).on("click", function(){
			var codeView = $(this).parent(".btn_area").siblings(".view_area");
			if($(codeView).hasClass("on")){
				$(codeView).removeClass("on").slideUp(200);
			} else {
				$(codeView).addClass("on").slideDown(200);
			}
		});
	});
	
});

const _header = {
	sub: `
		<div class="inner_sub">
			<div class="back_area">
				<button type="button" class="btn_back"><span class="hidden">이전</span></button>
			</div>
			<div class="btn_area">
				<button type="button" class="btn_home"><span class="hidden">홈으로</span></button>
				<button type="button" class="btn_search"><span class="hidden">통합검색</span></button>
				<a href="#open_aside" class="btn_open_aside"><span class="hidden">메뉴</span></a>
			</div>
		</div>
	`,
	detail: `
		<div class="inner_sub">
			<div class="back_area">
				<button type="button" class="btn_back"><span class="hidden">이전</span></button>
			</div>
			<div class="btn_area">
				<button type="button" class="btn_close"><span class="hidden">닫기</span></button>
			</div>
		</div>
	`,
	event: `
		<div class="inner_sub">
			<div class="btn_area">
				<button type="button" class="btn_close"><span class="hidden">닫기</span></button>
			</div>
		</div>
	`,
	layer: `
		<div class="inner_sub">
			<div class="btn_area">
				<button type="button" class="btn_close"><span class="hidden">닫기</span></button>
			</div>
		</div>
	`,
}