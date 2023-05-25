var List = (function() {
    var table = $('.list table');
    var pages = $('.list table tbody tr');
    var links = pages.find('a');
    var slideMotion;
    
    var ingCount = 0;
    var testCount = 0;
    var doneCount = 0;
    var deferCount = 0;

    (function init() {
        head();
        list();

        dashboard();
        shortcut();
        notice();

        addEvent();

        setTimeout(function() {
            table.tablesorter();
        }, 1000);
    })();

    function head() {
        var html;

        html = '<div class="head">';
        html +='    <div class="head__name">' + document.title + '</div>';
        html +='    <div class="head__go"></div>';
        html +='    <div class="head__info">';
        html +='        <div class="info">';
        html +='            <div class="info__item">';
        html +='                <div class="info__key">검수</div>';
        html +='                <div class="info__value test-count">-</div>';
        html +='            </div>';
        html +='            <div class="info__item">';
        html +='                <div class="info__key">보류</div>';
        html +='                <div class="info__value defer-count">-</div>';
        html +='            </div>';
        html +='            <div class="info__item">';
        html +='                <div class="info__key">완료</div>';
        html +='                <div class="info__value done-count">-</div>';
        html +='            </div>';
        html +='            <div class="info__progress">';
        html +='                <div class="progress">';
        html +='                    <div class="progress__total" style="width: 100%"><div class="progress__total-text">전체 <span class="progress__total-count total-count">-</span>개</div></div>';
        html +='                    <div class="progress__done" style="width: 0%"><div class="progress__done-percent done-percent"></div></div>';
        html +='                    <div class="progress__defer" style="width: 0%"></div>';
        html +='                </div>';
        html +='            </div>';
        html +='        </div>';
        html +='    </div>';
        html +='</div>';

        $('body').prepend(html);

        setTimeout(function() {
            $('.head').addClass('show');
        }, 10);

        setTimeout(function() {
            $('.head').css('transition', 'visibility .2s, opacity .2s, padding .8s');
        }, 100);
    }

    function list() {
        _.each(pages, function(page) {
            var self = $(page);

            // 구분
            var type = self.find('[data-type]');
            var typeText = type.text();

            if (typeText) {
                type.html('<span class="type">' + typeText + '</span>');
            } else {
                type.html('');
            }

            // 상태
            var status = self.find('[data-status]');
            var statusText = status.text();

            switch (statusText) {
                case '진행':
                    status.html('<span class="status ing">' + statusText + '</span>');
                    ingCount++;
                    break;

                case '검수':
                    status.html('<span class="status test">' + statusText + '</span>');
                    testCount++;
                    break;

                case '완료':
                    status.html('<span class="status done">' + statusText + '</span>');
                    doneCount++;
                    break;

                case '보류':
                    status.html('<span class="status defer">' + statusText + '</span>');
                    deferCount++;
                    break;

                default:
                    break;
            }
        });
    }

    function dashboard() {
        var totalCount = pages.length;
        var delCount = table.find('tr.del').length;

        totalCount = totalCount - delCount;
        doneCount = doneCount - $('.del .done').length;

        var donePercent = Math.floor((doneCount / totalCount) * 100);
        var deferPercent = Math.floor((deferCount / totalCount) * 100);

        // 값 지정
        $('.total-count').text(totalCount);
        $('.done-count').text(doneCount);
        $('.done-percent').text(donePercent + '%');
        $('.test-count').text(testCount);
        $('.defer-count').text(deferCount);

        // 그래프값 지정
        $('.progress__done').css('width', donePercent + '%');
        $('.progress__defer').css('width', deferPercent + '%');
        $('.progress__total').css('width', 100 + '%');

        // 완료카운트 50% 이상일 경우 처리
        if (donePercent >= 50) {
            $('.progress').addClass('half');
        }
    }

    function shortcut() {
        if (document.title == '공통') return;

        var area = $('.head__go');
        var targets = pages.find('td:first-child');
        var prevTargetText = null;

        _.forEach(targets, function(target, i) {
            var targetText = $(target).text();
            var row = $(target).parent();
            
            if (prevTargetText == targetText || targetText == '' || row.hasClass('del')) return;

            row.attr('id', 'target' + i);
            
            area.append('<a href="#target' + i + '" class="go">' + targetText + '</a>');
            
            prevTargetText = $(target).text();
        });
    }

    function notice() {
        var checks = $('<div class="checks"></div>');
        var planCount = $('[data-role="기획"]').length - $('.del [data-role="기획"]').length;
        var designCount = $('[data-role="디자인"]').length - $('.del [data-role="디자인"]').length;

        if (!planCount && !designCount) return;

        if (planCount) {
            checks.append('<button class="check plan">기획파트에서 확인 필요한 항목이 <span class="check__number">' + planCount + '</span>개 있습니다.</button>');
        }

        if (designCount) {
            checks.append('<button class="check design">디자인파트에서 확인 필요한 항목이 <span class="check__number">' + designCount + '</span>개 있습니다.</button>');
        }

        $('.contents').prepend(checks);
    }

    function addEvent() {
        var doc = $(document);

        $('.head').on('mouseenter', slideActive);
        $('.head').on('mouseleave', slideInactive);

        doc.on('click', '.list a', history);
        doc.on('click', '.go', goShortcut);

        doc.on('click', '.check', function(e) {
            var target = $(e.target);
            var plans = $('[data-role="기획"]').closest('tr');
            var designs = $('[data-role="디자인"]').closest('tr');

            if (target.hasClass('plan')) {
                target.toggleClass('active').siblings().removeClass('active');
                
                if (target.hasClass('active')) {
                    pages.show().not(plans).hide();
                } else {
                    pages.show();
                }
            }
            
            if ((target.hasClass('design'))) {
                target.toggleClass('active').siblings().removeClass('active');
                
                if (target.hasClass('active')) {
                    pages.show().not(designs).hide();
                } else {
                    pages.show();
                }
            }
        });
    }

    function history(e) {
        var target = $(e.target);

        target.addClass('history');
        links.not(target).removeClass('history');
    }

    function slideActive(e) {
        clearTimeout(slideMotion);

        if (document.querySelector('.head__go').clientWidth < document.querySelector('.head__go').scrollWidth) {
            $(e.currentTarget).addClass('active');
        }
    }

    function slideInactive(e) {
        slideMotion = setTimeout(function() {
            $(e.currentTarget).removeClass('active');
        }, 2000);
    }

    function goShortcut(e) {
        var targetID = $(e.currentTarget).attr('href');
            
        $(targetID).children().css({transition: 'background .6s'});

        setTimeout(function() {
            $(targetID).addClass('here');

            setTimeout(function() {
                $(targetID).removeClass('here');

                setTimeout(function() {
                    $(targetID).children().removeAttr('style');
                }, 2000);
            }, 2000);
        }, 400);

        $('html, body').animate({
            scrollTop: (parseInt($(targetID).offset().top) - 100) + 'px'
        }, 400);

        e.preventDefault();
    }
})();

var Preview = (function() {
    var doc = $(document);
    var opener = $('.preview-opener');
    var func = $('.func');
    var list = $('.list');
    var preview = $('.preview');
    var row = $('.list tbody tr');

    (function init() {
        addEvent();
    })();

    function addEvent() {
        opener.on('click', previewToggle);
        row.on('mouseenter', show);
        doc.on('keydown', hide);
    }

    function previewToggle() {
        opener.toggleClass('active');
        list.toggleClass('active');
        preview.toggleClass('active');
        func.toggleClass('active');
    }

    function show(e) {
        if (!preview.hasClass('active')) return;

        var cTarget = $(e.currentTarget);
        var link = cTarget.find('a');
        var url = link.attr('href');

        preview.attr('src', url);
    }

    function hide(e) {
        if (e.keycode == 27 || e.which == 27) {
            opener.removeClass('active');
            list.removeClass('active');
            preview.removeClass('active');
        }
    }
})();

var Scroll = (function() {
    var win = $(window);
    var body = $('body');

    (function init() {
        addEvent();
    })();

    function addEvent() {
        win.on('scroll', _.throttle(setScroll, 200, this));
    }

    function setScroll(e) {
        if ($(e.currentTarget).scrollTop() > 0) {
            body.addClass('scrolled');
        } else {
            body.removeClass('scrolled');
        }
    }
})();

var Contents = (function() {
    (function init() {
        setTransition();
        addEvent();
    })();

    function addEvent() {
        $('.top').on('click', function() {
            $('html, body').animate({
                scrollTop: 0
            }, 400);
        });
    }

    function setTransition() {
        setTimeout(function() {
            $('.contents').css('transition', 'padding .6s');
        }, 1000);
    }
})();

$(function(){//큰글씨, 다크모드
    $('table tr').each(function() {
        var titleTxt = $('html').find('title').text();
        var _td = $(this).find('td').eq(5);
        var _str = $(this).find('a').attr('href');

        if(titleTxt === '조회' || titleTxt === '이체' && $(this).is(':not(.no_big)')){
            if(titleTxt === '조회'){
                _td.filter('.big').prepend('<a href="" class="big_link" target="_blank">큰</a>');
            }else if(titleTxt === '이체'){
                _td.addClass('big').prepend('<a href="" class="big_link" target="_blank">큰</a>');
            }
        }
        if(titleTxt === "all ways banking" || titleTxt === "기타"){
            return;
        }else{
            _td.prepend('<a href="" class="dark_link" target="_blank">D</a>').addClass('dark'); 
        }
        //$(this).find('a').attr('href', _str); 
		_td.find('a').attr('href', _str); 
    });

    $('table a').click(function(e) {
        _this = $(this);
        _target = $(e.currentTarget);

        popup = window.open(_this.attr('href'));
        $(popup.document).find('body').removeAttr('class');
    });
});

// var Scroller = (function() {
//     var track = $('.head__go');

//     (function init() {
//         addEvent();
//     })();

//     function addEvent() {
//         track.on('mousemove', _.throttle(setScroll, 50, this));
//     }

//     function setScroll(e) {
//         var track = $(e.currentTarget);
//         var trackScroll = track.prop('scrollWidth');
//         var viewWidth = track.width();
//         var mouseX = e.originalEvent.pageX - 200;
//         var percent = Math.round((mouseX * 100) / viewWidth);
//         var value = (trackScroll * percent) / 100 - 100;
        
//         track.scrollLeft(value);
//     }
// })();