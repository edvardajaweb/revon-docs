(function () {
  'use strict';

  var openBtn = document.querySelector('[data-mobile-open]');
  var closeBtn = document.querySelector('[data-mobile-close]');
  var drawer = document.querySelector('[data-mobile-drawer]');
  var lastFocused = null;

  function drawerFocusable() {
    if (!drawer) return [];
    return Array.prototype.slice.call(drawer.querySelectorAll('a[href], button:not([disabled])'));
  }

  function setDrawer(open) {
    if (!drawer) return;
    if (open) lastFocused = document.activeElement;
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';
    if (openBtn) openBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      window.requestAnimationFrame(function () {
        var focusable = drawerFocusable();
        if (focusable[0]) focusable[0].focus();
      });
    } else if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
      lastFocused = null;
    }
  }

  if (openBtn) openBtn.addEventListener('click', function () { setDrawer(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setDrawer(false); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.getAttribute('aria-hidden') === 'false') {
      setDrawer(false);
    }
  });

  if (drawer) {
    drawer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || drawer.getAttribute('aria-hidden') === 'true') return;
      var focusable = drawerFocusable();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  if (drawer) {
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setDrawer(false); });
    });
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -50px 0px', threshold: 0.05 });

    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  var sidebarLinks = Array.prototype.slice.call(document.querySelectorAll('.doc-sidebar__list a[href^="#"]'));
  if (sidebarLinks.length && 'IntersectionObserver' in window) {
    var headingIds = sidebarLinks
      .map(function (a) { return a.getAttribute('href').slice(1); })
      .filter(Boolean);
    var headings = headingIds
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    var activeMap = {};
    headings.forEach(function (h) { activeMap[h.id] = false; });

    function setActive(id) {
      sidebarLinks.forEach(function (a) {
        if (a.getAttribute('href') === '#' + id) a.classList.add('is-active');
        else a.classList.remove('is-active');
      });
    }

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { activeMap[entry.target.id] = entry.isIntersecting; });
      for (var i = 0; i < headings.length; i++) {
        if (activeMap[headings[i].id]) { setActive(headings[i].id); return; }
      }
    }, { rootMargin: '-88px 0px -70% 0px', threshold: [0, 1] });

    headings.forEach(function (h) { spy.observe(h); });

    if (headings[0]) setActive(headings[0].id);
  }

  var form = document.querySelector('[data-support-form]');
  if (form) {
    var successEl = form.querySelector('[data-form-success]');
    var errorEl = form.querySelector('[data-form-error]');
    var submitBtn = form.querySelector('[type="submit"]');
    var submitLabel = submitBtn ? submitBtn.textContent : '';

    form.addEventListener('submit', function (e) {
      var action = form.getAttribute('action') || '';
      if (action.indexOf('YOUR_FORM_ID') !== -1) return;

      e.preventDefault();
      if (successEl) successEl.hidden = true;
      if (errorEl) errorEl.hidden = true;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      var data = new FormData(form);
      fetch(action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          if (successEl) successEl.hidden = false;
          form.reset();
        } else {
          response.json().then(function (body) {
            var msg = 'Something went wrong. Please email us directly or try again.';
            if (body && body.errors && body.errors.length) {
              msg = body.errors.map(function (x) { return x.message; }).join(' ');
            }
            if (errorEl) {
              errorEl.textContent = msg;
              errorEl.hidden = false;
            }
          }).catch(function () {
            if (errorEl) {
              errorEl.textContent = 'Something went wrong. Please try again.';
              errorEl.hidden = false;
            }
          });
        }
      }).catch(function () {
        if (errorEl) {
          errorEl.textContent = 'Network error. Check your connection and try again.';
          errorEl.hidden = false;
        }
      }).then(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitLabel;
        }
      });
    });
  }

  var header = document.querySelector('.site-header');
  if (header) {
    var lastY = window.scrollY;
    function onScroll() {
      var y = window.scrollY;
      if (y > 4) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
      lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  var backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.type = 'button';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><polyline points="6 14 12 8 18 14"/></svg>';
  document.body.appendChild(backToTop);

  backToTop.addEventListener('click', function () {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  window.addEventListener('scroll', function () {
    if (window.scrollY > 600) backToTop.classList.add('is-visible');
    else backToTop.classList.remove('is-visible');
  }, { passive: true });
})();
