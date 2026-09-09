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

// Lazy-load videos: only set the source when the video scrolls near the viewport.
// Sources use data-src instead of src so the browser doesn't fetch them upfront.
(function () {
    function loadVideo(video) {
        var source = video.querySelector('source[data-src]');
        if (source && !source.src) {
            source.src = source.getAttribute('data-src');
            video.load();
        }
    }

    var lazyVideos = Array.prototype.slice.call(
        document.querySelectorAll('video source[data-src]')
    ).map(function (source) { return source.closest('video'); });

    if (!lazyVideos.length) return;

    if ('IntersectionObserver' in window) {
        var videoObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    loadVideo(entry.target);
                }
            });
        }, { rootMargin: '300px' });

        lazyVideos.forEach(function (video) { videoObserver.observe(video); });
    } else {
        // Fallback for very old browsers: load everything immediately.
        lazyVideos.forEach(loadVideo);
    }
})();
