var $window = $(window),
    $document = $(document),
    $body = $('body'),
    scrollTop = 0,
    scrollStep = 0,
    lastScroll = 0,
    scrollBlock = 1,
    $search = $('.search__area'),
    $view = $('.view'),
    $back = $('.js-back'),
    $newPage = null,
    pageConnectors = {'view-categories': 'view-overview', 'view-question': 'view-categories', 'view-chat': 'view-tickets'},
    searchLoadTimeOut = null,
    $sliderList = $('.slider__list'),
    $sliderItem = null,
    $slideDot = null,
    $slideCounter = null,
    $attach = $('.attach input'),
    $deleteAttach = $('.attach .ico-close-color'),
    $input = $('.input__area'),
    $select = $('.input_select select'),
    $ratingItem = $('.rating__item'),
    screenHeight = $window.height(),
    $openSearch = $('.open-search'),
    $closeSearch = $('.search__link');

document.documentElement.scrollTop = 0;


// preloader
setTimeout(function() {
    $body.addClass('preload_off');
    document.documentElement.scrollTop = 0;
}, 1500);


// show/hide header titles on scroll
if (screenHeight > 500) {
    $document.on('scroll', function() {
        scrollTop = document.documentElement.scrollTop;

        if (scrollBlock) {
            if (scrollTop >= lastScroll){
                if (scrollTop > scrollStep) {
                    $body.addClass('hide_title');
                }
            } else {
                if (scrollTop != $document.height() - $window.height() && scrollTop < $document.height() - $window.height()) {
                    $body.removeClass('hide_title');
                }
            }
        }

        lastScroll = scrollTop;
    });
}


// open page function
function goToPage(page) {
    $body.removeClass('hide_title');
    document.documentElement.scrollTop = 0;
    $newPage = $('#' + page);
    //scrollBlock = 1;
    if (!$newPage.hasClass('view_open')) {
        $body.data('last-page', $('.view_open').attr('id'));
        $body.data('current-page', page);
        $body.addClass('page-' + page).removeClass('page-' + $body.data('last-page'));
        $view.removeClass('view_open');
        $newPage.addClass('view_open');
        if (page != 'view-search') {
            $search.val('');
        }
    }
    //scrollBlock = 0;
}


// links to pages
$back.click(function() {
    goToPage(pageConnectors[$body.data('current-page')]);
    $body.removeClass('search-opened');
});
$('#cancel').click(function() {
    goToPage(pageConnectors[$body.data('current-page')]);
});

$search.on('focus', function() {
    pageConnectors['view-search'] = $body.data('current-page');
    $body.addClass('pre-search');
});

$search.on('blur', function() {
    $body.removeClass('pre-search');
});

$search.on('input', function() {
    if ($(this).val().length > 0) {
        $body.addClass('loading');
        searchLoadTimeOut = setTimeout(function() {
            $body.removeClass('loading');
            goToPage('view-search');
        }, 500);
    } else {
        clearTimeout(searchLoadTimeOut);
        $body.removeClass('loading');
        $body.removeClass('pre-search');
        goToPage($body.data('last-page'));
    }
});

$('#view-overview .list__item').click(function() {
    goToPage('view-categories');
});
$('#view-categories .list__item, #view-search .list__item').click(function() {
    goToPage('view-question');
});
$('.article .slider__item').click(function() {
    pageConnectors['view-overlay'] = $body.data('current-page');
    goToPage('view-overlay');
});
$('.chat__pic').click(function() {
    pageConnectors['view-overlay'] = $body.data('current-page');
    goToPage('view-overlay');
});
$('.js-open-form').click(function() {
    pageConnectors['view-form'] = $body.data('current-page');
    goToPage('view-form');
});
$('.js-connect').click(function() {
    pageConnectors['view-tickets'] = $body.data('current-page');
    goToPage('view-tickets');
});

$('.js-create').click(function() {
    $('.view-form').addClass('open_form');
});

$('#complaint').click(function(e) {
    e.preventDefault();
    $('.dialog-box').toggleClass('dialog-box_confirm');
});

$('.dialogs__item').click(function(e) {
    goToPage('view-chat');
});
$('.js-send-feedback').click(function() {
    $('.quiz').addClass('quiz_done');
});


// input
$input.on('blur', function() {
    var $this = $(this);
    if ($this.val().length >= 1) {
        $this.addClass('input__area_filled');
    } else {
        $this.removeClass('input__area_filled');
    }
});


// select
$select.on('change', function() {
    var $this = $(this);
    $('.input__area', $this.parent()).addClass('input__area_filled').text(this.options[this.selectedIndex].text);
    if ($this.hasClass('js-open-hidden-form')) {
        $('.form__item_hidden').addClass('form__item_show');
    }
});


// textarea autoheight
function autoResize($node, $mirror) {
    $mirror.html($node.val().replace(/[\r\n]/g, "<br />s"));
    $node.css('height', $mirror.height());
    if ($node.is('.chat-input__area')) {
        $('.chat__body').css('bottom', $mirror.height() + 25);
    }
}

$('textarea.input__area').on('input', function() {
    autoResize($(this), $('.input__mirror'))
});

$('.chat-input__area').on('input', function() {
    var $this = $(this),
        $parent = $this.parents('.chat-input');
    autoResize($this, $('.chat-input__mirror'));
    if ($this.val().length > 0) {
        $parent.addClass('chat-input_ready');
    } else {
        if (!$('.attach', $parent).is('.attach_fill')) {
            $parent.removeClass('chat-input_ready');
        }
    }
});


// attach
$attach.on('change', function() {
    var $this = $(this),
        value = $this.val(),
        $parent = $this.parent(),
        $attachLabel = $('.attach__label', $parent);

    $parent.data('old-val', $attachLabel.text());

    if (value.length > 0) {
        if (!$this.parent().is('.chat-input__controls')) {
            $attachLabel.text(value);
        }
        $parent.addClass('attach_fill');
        $parent.parents('.chat-input').addClass('chat-input_ready');
    } else {
        if (!$this.parent().is('.chat-input__controls')) {
            $attachLabel.text($parent.data('old-val'));
        }
        $parent.removeClass('attach_fill');
        $parent.parents('.chat-input').removeClass('chat-input_ready');
    }
});

$deleteAttach.click(function(e) {
    var $parent = $deleteAttach.parent(),
        $attachLabel = $('.attach__label', $parent);

    $attach.val('');
    $attachLabel.text($parent.data('old-val'));
    $parent.removeClass('attach_fill');

    e.preventDefault();
});


// add comment
$('.pseudo-link').click(function() {
    $(this).parents('.quiz').addClass('quiz_comment');
});


$ratingItem.click(function() {

    $ratingItem.removeClass('rating_selected');

    for (var i = 0; i <= $(this).index(); i++) {
        $ratingItem.eq(i).addClass('rating_selected');
    }

});


$openSearch.click(function() {
    $body.addClass('search-opened');
});

$closeSearch.click(function() {
    $body.removeClass('search-opened');
    if ($body.hasClass('page-view-search')) {
        goToPage(pageConnectors[$body.data('current-page')]);
    }
});



var isMove = false,
    startPos = 0,
    endPos = 0,
    index = null,
    sliderDirection = null,
    $currentSlider = null;

$(document).on('touchstart mousedown', '.slider__list', function(e) {
    if (e.type == 'touchstart') {
        startPos = e.touches[0].clientX
    } else if (e.type == 'mousedown') {
        startPos = e.clientX
    }
    isMove = true;
});

$(document).on('touchmove mousemove', '.slider__list', function(e) {
    if (isMove === true) {

        if (e.type == 'touchmove') {
            endPos = e.originalEvent.touches[0].pageX
        } else if (e.type == 'mousemove') {
            endPos = e.pageX
        }

        if (startPos > endPos) {
            sliderDirection = 'left'
        } else if (startPos < endPos) {
            sliderDirection = 'right'
        }

        $currentSlider = $(this);
    }

});

$(document).on('touchend mouseup', function() {
    if (isMove === true) {
        isMove = false;
        changeSlide(sliderDirection, $currentSlider);
    }
});


function changeSlide(slideIndex, $node) {

    var $parent = $node.parents('.view');

    $sliderItem = $('.slider__item', $node);
    $slideDot = $('.slider__dot', $parent);
    $slideCounter = $('.overlay__counter', $parent);

    if (slideIndex == 'left') {
        ++index
    } else if (slideIndex == 'right') {
        --index
    }

    if (index > $sliderItem.length - 1) {
        index = $sliderItem.length - 1;
    } else if (index < 0) {
        index = 0
    }

    $sliderList.css('left', -(100 * index) + '%');
    $slideDot.removeClass('active');
    $slideDot.eq(index).addClass('active');
    $slideCounter.text((index + 1) + '/' + $sliderItem.length);
}