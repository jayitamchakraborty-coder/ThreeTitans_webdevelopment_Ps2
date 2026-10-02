/**
 * LocalLoop Unified Cross-Screen Navigator
 * Allows seamless navigation across all 5 Stitch HTML screens during testing & presentations.
 */
(function() {
  const routes = {
    'home': '../home_localloop_2/code.html',
    'discover': '../discover_localloop_amazon_style_browsing/code.html',
    'create-post': '../share_information_localloop_clean_spacious/code.html',
    'share': '../share_information_localloop_clean_spacious/code.html',
    'moderation-queue': '../moderation_localloop_clean_queue/code.html',
    'moderation': '../moderation_localloop_clean_queue/code.html',
    'my-activity': '../my_activity_localloop_2/code.html'
  };

  document.addEventListener('DOMContentLoaded', () => {
    // Intercept clicks on links with data-path or matching text
    document.querySelectorAll('a, button').forEach(el => {
      const path = el.getAttribute('data-path');
      const text = el.textContent ? el.textContent.trim().toLowerCase() : '';

      if (path && routes[path]) {
        el.setAttribute('href', routes[path]);
      } else if (text === 'home') {
        el.setAttribute('href', routes['home']);
      } else if (text === 'discover') {
        el.setAttribute('href', routes['discover']);
      } else if (text.includes('share') || text.includes('publish') && el.tagName === 'A') {
        if (!el.getAttribute('href') || el.getAttribute('href') === '#') {
          el.setAttribute('href', routes['create-post']);
        }
      } else if (text === 'my activity' || text.includes('saved posts')) {
        el.setAttribute('href', routes['my-activity']);
      } else if (text.includes('review submissions') || text.includes('moderation')) {
        el.setAttribute('href', routes['moderation']);
      }
    });

    console.log('[LocalLoop Navigator] Universal routing initialized across 5 screens.');
  });
})();
