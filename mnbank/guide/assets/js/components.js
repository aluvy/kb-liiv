var preview = preview || (function() {
    var soureces = document.querySelectorAll('[type="text/html"]');

    (function init() {
        draw();
        copy();
        addEvent();

        // new ClipboardJS('[data-class*="demo"] *', {
        //     text: function(trigger) {
        //         return $(trigger).attr('class');
        //     }
        // });

        // 코드 전체펼침
        // $('[data-class*="code"]').attr('data-class', 'code active');
    })();

    function addEvent() {
        $(document).on('click', '[data-class*="fold"]', folding);
        $(document).on('click', '[data-class*="file"]', spriteFolding);
    }

    function folding(e) {
        var target = $(e.target).parent().parent();

        if (target.attr('data-class') == 'code') {
            target.attr('data-class','code active');
        } else {
            target.attr('data-class','code');
        }
    }

    function spriteFolding(e) {
        var target = $(e.target).parent();

        if (target.attr('data-class') == 'sprite') {
            target.attr('data-class','sprite active');
        } else {
            target.attr('data-class','sprite');
        }
    }

    function draw() {
        _.forEach(soureces, function(source) {
            var esc = _.escape(_.trim(source.textContent));
            var padding = $(source).attr('data-padding');
            var file = $(source).attr('data-sprite');
            var type = $(source).attr('data-type');
            var spriteImgWidth = $(source).attr('data-img-width') + 'px';
            var preview = $('<div data-class="preview"></div>');
            var demo = $('<div data-class="demo">' + source.textContent + '</div>');
            var code = $('<pre data-class="code"><div data-class="title"><button type="button" data-class="fold">CODE</a><button type="button" data-class="copy">COPY</button></div><code data-class="html">' + esc + '</code></pre>');
            
            if (padding) {
                preview.css({
                    'borderRadius': '0 0 5px 5px'
                });
                demo.css({
                    'padding': padding,
                    'borderRadius': 0
                });
            }
            
            if (type != 'script') {
                preview.append(demo);
            }

            if (file) {
                var fileName = file.split('/').pop();
                var sprite = $('<div data-class="sprite"><button type="button" data-class="file">' + fileName + '</button><div data-class="image"><img src="' + file + '" style="max-width: ' + spriteImgWidth + '" alt=""></div></div>');
                
                preview.append(demo);
                preview.append(sprite);
            }

            preview.append(code);
    
            hljs.highlightBlock(code[0]);
            
            $(preview).insertAfter(source);
            $(source).remove();
        });
    }

    function copy() {
        var clipboard = new ClipboardJS('[data-class="copy"]');
        var codes = document.querySelectorAll('[data-class="html"]');
        var buttons = document.querySelectorAll('[data-class="copy"]');

        _.forEach(codes, function(code, i) {
            code.setAttribute('id', 'code' + i);
        });

        _.forEach(buttons, function(button, i) {
            button.setAttribute('data-clipboard-target', '#code' + i);
        });

        clipboard.on('success', function(e) {
            e.trigger.textContent = 'Copied!';

            setTimeout(function() {
                e.trigger.textContent = 'Copy';
            },2000);
        
            e.clearSelection();
        });
    }
})();

var Contents = (function() {
    (function init() {
        setTransition();
    })();

    function setTransition() {
        setTimeout(function() {
            $('[data-class="contents"]').css('transition', 'padding .6s');
        }, 1000);
    }
})();

var Shortcut = (function() {
    var headings = $('[data-class="h1"], [data-class="h2"], [data-class="h3"]');

    (function init() {
        setTarget();
        setLink();
    })();

    function setTarget() {
        _.each(headings, function(heading, i) {
            var target = $(heading);

            target.attr('id', 'target' + i);
        });
    }

    function setLink() {
        var shortcuts = $('<div data-class="shortcut"></div>');

        _.each(headings ,function(heading, i) {
            var heading = $(heading);
            var type = heading.attr('data-class');
            var text = heading.text();

            var shortcut = $('<a href="#target' + i + '" data-class="' + type + '-target">'+ text +'</a>');

            shortcuts.append(shortcut);


            //console.log(heading);
        });

        $('[data-class="component-name"]').after(shortcuts);
    }
})();
var darkHtml = (function() {
    $('head').append('<link rel="stylesheet" data-description="다크모드" href="../../../mnbank/app/css/common_dark.css">');
    $('[data-class=contents]').append('<button type="button" class="btn_dark" data-class="button">다크모드</button>');
    $('.btn_dark').on('click', function(){
        $('html').toggleClass('dark_mode');
        $('.btn_dark').text() === '일반모드' ? $('.btn_dark').text('다크모드') : $('.btn_dark').text('일반모드');
    })
})();