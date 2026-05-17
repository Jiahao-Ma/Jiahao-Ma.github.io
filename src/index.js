
$(document).ready(function() {
    $('.publication-mousecell').mouseover(function() {
        $(this).find('video').css('display', 'inline-block');
        $(this).find('img').css('display', 'none');
    });
    $('.publication-mousecell').mouseout(function() {
        $(this).find('video').css('display', 'none');
        $(this).find('img').css('display', 'inline-block');
    });

    $('.team-toggle').on('click', function() {
        var $team = $(this).siblings('.team-authors');
        $(this).toggleClass('is-expanded');
        if ($team.is(':visible')) {
            $team.hide();
        } else {
            $team.css('display', 'inline');
        }
    });

    $('.pub-filter-btn').on('click', function() {
        $('.pub-filter-btn').removeClass('is-active');
        $(this).addClass('is-active');

        var filter = $(this).data('filter');
        var $blocks = $('.publication-block[data-category]');

        if (filter === 'all') {
            $blocks.removeClass('pub-hidden');
        } else {
            $blocks.each(function() {
                if ($(this).data('category') === filter) {
                    $(this).removeClass('pub-hidden');
                } else {
                    $(this).addClass('pub-hidden');
                }
            });
        }
    });
})
