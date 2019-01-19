$(function() {
    $(window).on('scroll', function() {
        let scrollPosition = $(this).scrollTop();
        let $header = $('.hagoromo-header');        
        
        if ($(window).width() > 800) {
            if (scrollPosition < 200) {
                $header.finish();
                $header.css({
                    'top': '0',
                });
            }

            if (scrollPosition > 600 && !$header.hasClass('hagoromo-header-sticky')) {
                $header.addClass('hagoromo-header-sticky');
                $header.css({
                    'top': '-70px',
                });
                $header.animate({
                    top: "0"
                },160)
            }

            if (scrollPosition < 550 && $header.hasClass('hagoromo-header-sticky')) {
                $header.animate({
                    top: "-70px"
                },160, function() {
                    $header.removeClass('hagoromo-header-sticky');
                    $header.finish();
                    $header.css('top', '0');
                })
            }
        } else {
            if (scrollPosition > 55) {
                $header.addClass('hagoromo-header-hidden')
            } else {
                $header.removeClass('hagoromo-header-hidden')
            }
        }
    });

    $('.hagoromo-action-button').on('click', function(event) {
        $('body').addClass('hagoromo-sidebar-open');
    });

    $('.hagoromo-sidebar-overlay, .hagoromo-sidebar-close').on('click', function(event) {
        $('body').removeClass('hagoromo-sidebar-open');
    });

    $('.hagoromo-post').each(function(index) {
        let l = $(this).find('.entry-title').text().trim()[0];
        $(this).find('.post-letter').text(l);
    });

    $('#hagoromo-search-form').on('submit', function(event) {
        event.preventDefault();
        let q = $(this).find("input[name='s']").val() + "+site:reyshawn.com";
        window.open("https://www.google.com/search?q=" + q);        
    });

});

hljs.initHighlightingOnLoad();
hljs.initLineNumbersOnLoad();