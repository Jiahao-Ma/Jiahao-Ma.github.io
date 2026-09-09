// ---------------------------------------------------------------------------
// Lazy video loading (runs first, no dependencies).
// Sources use data-src instead of src so the browser doesn't fetch videos upfront.
// ---------------------------------------------------------------------------
function loadLazyVideo(video) {
    if (!video) return;
    var source = video.querySelector('source[data-src]');
    if (source && !source.getAttribute('src')) {
        source.setAttribute('src', source.getAttribute('data-src'));
        video.load();
    }
}

(function () {
    try {
        var lazyVideos = Array.prototype.slice.call(
            document.querySelectorAll('video source[data-src]')
        ).map(function (source) { return source.parentNode; })
         .filter(function (video) { return !video.closest('.publication-mousecell'); });

        if (!lazyVideos.length) return;

        if ('IntersectionObserver' in window) {
            var videoObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        loadLazyVideo(entry.target);
                        videoObserver.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '300px' });
            lazyVideos.forEach(function (video) { videoObserver.observe(video); });
        } else {
            lazyVideos.forEach(loadLazyVideo);
        }
    } catch (e) {
        // Never leave the page without videos because of an observer quirk.
        Array.prototype.forEach.call(document.querySelectorAll('video'), loadLazyVideo);
    }
})();

// ---------------------------------------------------------------------------
// Page interactions (vanilla JS, no jQuery).
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    // Hover previews: load the video on first mouseover, pause it when hidden.
    Array.prototype.forEach.call(document.querySelectorAll('.publication-mousecell'), function (cell) {
        var video = cell.querySelector('video');
        var img = cell.querySelector('img');
        cell.addEventListener('mouseover', function () {
            loadLazyVideo(video);
            if (video) { video.style.display = 'inline-block'; var p = video.play(); if (p) p.catch(function () {}); }
            if (img) img.style.display = 'none';
        });
        cell.addEventListener('mouseout', function () {
            if (video) { video.style.display = 'none'; video.pause(); }
            if (img) img.style.display = 'inline-block';
        });
    });

    // "X-Humanoid Team" author expander.
    Array.prototype.forEach.call(document.querySelectorAll('.team-toggle'), function (toggle) {
        toggle.addEventListener('click', function () {
            var team = toggle.parentNode.querySelector('.team-authors');
            toggle.classList.toggle('is-expanded');
            if (!team) return;
            var visible = team.style.display !== 'none' && team.offsetParent !== null;
            team.style.display = visible ? 'none' : 'inline';
        });
    });

    // Publication category filter.
    var filterButtons = document.querySelectorAll('.pub-filter-btn');
    var blocks = document.querySelectorAll('.publication-block[data-category]');
    Array.prototype.forEach.call(filterButtons, function (btn) {
        btn.addEventListener('click', function () {
            Array.prototype.forEach.call(filterButtons, function (b) { b.classList.remove('is-active'); });
            btn.classList.add('is-active');
            var filter = btn.getAttribute('data-filter');
            Array.prototype.forEach.call(blocks, function (block) {
                var show = filter === 'all' || block.getAttribute('data-category') === filter;
                block.classList.toggle('pub-hidden', !show);
            });
        });
    });
});
