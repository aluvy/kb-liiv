var Contents = (function() {
    (function init() {
        setTransition();
    })();

    function setTransition() {
        setTimeout(function() {
            $('.contents').css('transition', 'padding .6s');
        }, 1000);
    }
})();