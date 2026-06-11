(function () {
  var domain = 'thealchemism.com';
  function load() {
    if (document.querySelector('script[data-domain="' + domain + '"]')) return;
    var s = document.createElement('script');
    s.defer = true;
    s.dataset.domain = domain;
    s.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(s);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      window.addEventListener('cookie-consent-accepted', load, { once: true });
    });
  } else {
    window.addEventListener('cookie-consent-accepted', load, { once: true });
  }
})();
