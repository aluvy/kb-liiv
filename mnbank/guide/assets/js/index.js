var Oven = (function() {
    function setCookie(name, value) {
        var date = new Date();

        date.setHours(date.getHours() + 9 + 2);
        document.cookie = name + '=' + value + ';expires=' + date.toGMTString() + ';path=/';
    }

    function getCookie(name) {
        var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');

        return value ? value[2] : null;
    }

    return {
        setCookie: setCookie,
        getCookie: getCookie
    }
})();

var Nav = (function() {
    var doc = $(document);
    var viewer = $('.viewer');
    var category = $('.gnb__category');
    var title = $('.gnb__title');
    var links = $('.gnb__link');
    var iframe = $('.iframe');
    var opener = $('.nav-opener');
    var closer = $('.nav-closer');
    var indexID = Oven.getCookie('indexID');
    var guideID = Oven.getCookie('guideID');
    var isGuide = $('body').hasClass('guide');

    (function init() {
        if (isGuide) {
            go(guideID);
        } else {
            go(indexID);
        }

        addEvent();
    })();

    function addEvent() {
        title.on('click', togglefold);
        links.on('click', activateMenu);
        opener.on('click', openNav);
        closer.on('click', closeNav);
        doc.on('keydown', escape);
    }

    function togglefold(e) {
        var cTarget = $(e.currentTarget);

        cTarget.parent().toggleClass('active').siblings().removeClass('active');
    }

    function activateMenu(e) {
        var cTarget = $(e.currentTarget);
        
        cTarget.addClass('active');
        links.not(cTarget).removeClass('active');

        links.filter(function(index, selector) {
            if (cTarget.context == selector) {
                if (isGuide) {
                    Oven.setCookie('guideID', index);
                } else {
                    Oven.setCookie('indexID', index);
                }
            }
        });

        closeNav();
    }

    function go(pageID) {
        var currentMenu = links.eq(pageID);
        
        currentMenu.addClass('active');
        links.not(currentMenu).removeClass('active');

        links.filter(function(index, selector) {
            if (currentMenu[0] == selector) {
                if (isGuide) {
                    Oven.setCookie('guideID', index);
                } else {
                    Oven.setCookie('indexID', index);
                }
            }
        });

        closeNav();
        initUrl();
    }

    function openNav() {
        viewer.addClass('active');
    }

    function closeNav() {
        viewer.removeClass('active');
    }

    function escape(e) {
        if (e.keycode == 27 || e.which == 27) {
            viewer.removeClass('active');
        }
    }

    function initUrl() {
        var activateLink = $('.gnb__link.active');
        var url = activateLink.attr('href');
        var activateLinkParent = activateLink.parents('.gnb__category');

        iframe.attr('src', url);
        activateLinkParent.addClass('active');
        category.not(activateLinkParent).removeClass('active');
    }

    return {
        go: go
    }
})();

// var Scroller = (function() {
//     var track = $('.nav');

//     (function init() {
//         addEvent();
//     })();

//     function addEvent() {
//         track.on('mousemove', _.throttle(setScroll, 50, this));
//     }

//     function setScroll(e) {
//         var track = $(e.currentTarget);
//         var trackScroll = track.prop('scrollHeight');
//         var winHeight = $(window).height();
//         var mouseY = e.originalEvent.pageY;
//         var percent = Math.round((mouseY * 100) / winHeight);
//         var value = (trackScroll * percent) / 100;

//         track.scrollTop(value);
//     }
// })();