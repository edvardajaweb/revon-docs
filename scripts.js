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
    drawer.inert = !open;
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

  if (drawer) drawer.inert = drawer.getAttribute('aria-hidden') !== 'false';

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

  var docsPages = [
    { url: 'index.html', title: 'Overview', summary: 'Revon theme overview, key features, presets, commerce tools, and documentation links.' },
    { url: 'getting-started.html', title: 'Getting started', summary: 'Install Revon, choose a preset, connect store content, configure navigation, test, and publish.' },
    { url: 'presets.html', title: 'Presets', summary: 'Compare Pure, Atelier, and Maison typography, colors, spacing, templates, and homepage sections.' },
    { url: 'customizing.html', title: 'Customizing', summary: 'Global theme settings, sections, product blocks, card hover effects, product badges, trust badges, cart behavior, and app placements.' },
    { url: 'badges.html', title: 'Product badges', summary: 'Create custom product-card badges with metafields or tags, bulk edit values, control colors and priority, and troubleshoot badge display.' },
    { url: 'cheatsheet.html', title: 'Cheat sheet', summary: 'Quick paths and practical recipes for common Shopify and Revon configuration tasks.' },
    { url: 'apps.html', title: 'App integrations', summary: 'App blocks, app embeds, selling plans, compatibility testing, and integration troubleshooting.' },
    { url: 'faq.html', title: 'FAQ', summary: 'Answers about installation, presets, images, product badges, products, cart, apps, markets, performance, and accessibility.' },
    { url: 'support.html', title: 'Support', summary: 'Contact support, prepare a useful request, understand support scope, and troubleshoot safely.' },
    { url: 'changelog.html', title: 'Changelog', summary: 'Revon release history, documentation revisions, fixes, and feature changes.' }
  ];
  var searchOpenButtons = Array.prototype.slice.call(document.querySelectorAll('[data-search-open]'));
  var searchLayer = null;
  var searchInput = null;
  var searchStatus = null;
  var searchResults = null;
  var searchIndex = null;
  var searchLoadPromise = null;
  var searchLastFocused = null;

  function normalizeSearchText(value) {
    return (value || '').replace(/\s+/g, ' ').trim();
  }

  function currentPageName() {
    var name = window.location.pathname.split('/').pop();
    return name || 'index.html';
  }

  function entryFromDocument(page, doc) {
    var main = doc.querySelector('main');
    var content = main ? normalizeSearchText(main.textContent) : page.summary;
    var headings = main ? Array.prototype.slice.call(main.querySelectorAll('h1[id], h2[id], h3[id]')).map(function (heading) {
      return { id: heading.id, text: normalizeSearchText(heading.textContent) };
    }) : [];
    return {
      url: page.url,
      title: page.title,
      summary: page.summary,
      content: content,
      headings: headings
    };
  }

  function fallbackEntry(page) {
    return {
      url: page.url,
      title: page.title,
      summary: page.summary,
      content: page.summary,
      headings: []
    };
  }

  function loadSearchIndex() {
    if (searchLoadPromise) return searchLoadPromise;
    var parser = new DOMParser();
    var activePage = currentPageName();
    searchLoadPromise = Promise.all(docsPages.map(function (page) {
      if (page.url === activePage) return Promise.resolve(entryFromDocument(page, document));
      if (window.location.protocol === 'file:') return Promise.resolve(fallbackEntry(page));
      return fetch(page.url, { credentials: 'same-origin' })
        .then(function (response) {
          if (!response.ok) throw new Error('Unable to load ' + page.url);
          return response.text();
        })
        .then(function (html) { return entryFromDocument(page, parser.parseFromString(html, 'text/html')); })
        .catch(function () { return fallbackEntry(page); });
    })).then(function (entries) {
      searchIndex = entries;
      return entries;
    });
    return searchLoadPromise;
  }

  function buildSearchDialog() {
    if (searchLayer) return;
    searchLayer = document.createElement('div');
    searchLayer.className = 'search-layer';
    searchLayer.setAttribute('data-search-layer', '');
    searchLayer.hidden = true;
    searchLayer.innerHTML = '' +
      '<div class="search-layer__backdrop" data-search-close></div>' +
      '<section class="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-dialog-title" aria-describedby="search-dialog-status">' +
        '<div class="search-dialog__head">' +
          '<h2 class="search-dialog__title" id="search-dialog-title">Search documentation</h2>' +
          '<button class="search-dialog__close" type="button" data-search-close aria-label="Close search">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="search-form" role="search">' +
          '<svg class="search-form__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="16" y1="16" x2="21" y2="21"/></svg>' +
          '<label class="sr-only" for="documentation-search">Search documentation</label>' +
          '<input class="search-form__input" id="documentation-search" type="search" inputmode="search" autocomplete="off" spellcheck="false" placeholder="Search setup, presets, products, apps...">' +
        '</div>' +
        '<p class="search-dialog__status" id="search-dialog-status" data-search-status aria-live="polite">Search across all guides</p>' +
        '<div class="search-results" data-search-results></div>' +
      '</section>';
    document.body.appendChild(searchLayer);
    searchInput = searchLayer.querySelector('.search-form__input');
    searchStatus = searchLayer.querySelector('[data-search-status]');
    searchResults = searchLayer.querySelector('[data-search-results]');
    searchLayer.querySelectorAll('[data-search-close]').forEach(function (button) {
      button.addEventListener('click', closeSearch);
    });
    searchInput.addEventListener('input', renderSearch);
    searchLayer.addEventListener('keydown', trapSearchFocus);
  }

  function searchFocusable() {
    if (!searchLayer) return [];
    return Array.prototype.slice.call(searchLayer.querySelectorAll('a[href], button:not([disabled]), input:not([disabled])'));
  }

  function trapSearchFocus(event) {
    if (event.key !== 'Tab' || searchLayer.hidden) return;
    var focusable = searchFocusable();
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openSearch() {
    if (searchLayer && !searchLayer.hidden) {
      searchInput.focus();
      return;
    }
    buildSearchDialog();
    if (drawer && drawer.getAttribute('aria-hidden') === 'false') setDrawer(false);
    searchLastFocused = document.activeElement;
    searchLayer.hidden = false;
    document.body.style.overflow = 'hidden';
    searchStatus.textContent = 'Loading documentation index...';
    window.requestAnimationFrame(function () { searchInput.focus(); });
    loadSearchIndex().then(function () { renderSearch(); });
  }

  function closeSearch() {
    if (!searchLayer || searchLayer.hidden) return;
    searchLayer.hidden = true;
    document.body.style.overflow = '';
    if (searchLastFocused && typeof searchLastFocused.focus === 'function') searchLastFocused.focus();
    searchLastFocused = null;
  }

  function resultSnippet(entry, terms) {
    var text = entry.content || entry.summary;
    var lower = text.toLowerCase();
    var position = -1;
    terms.some(function (term) {
      position = lower.indexOf(term);
      return position !== -1;
    });
    if (position === -1) return entry.summary;
    var start = Math.max(0, position - 70);
    var end = Math.min(text.length, position + 170);
    return (start > 0 ? '... ' : '') + text.slice(start, end).trim() + (end < text.length ? ' ...' : '');
  }

  function scoreEntry(entry, query, terms) {
    var title = entry.title.toLowerCase();
    var summary = entry.summary.toLowerCase();
    var content = entry.content.toLowerCase();
    var headingScore = 0;
    var bestHeading = null;
    var haystack = title + ' ' + summary + ' ' + content;
    if (!terms.every(function (term) { return haystack.indexOf(term) !== -1; })) return null;
    entry.headings.forEach(function (heading) {
      var value = heading.text.toLowerCase();
      var score = value.indexOf(query) !== -1 ? 70 : 0;
      terms.forEach(function (term) { if (value.indexOf(term) !== -1) score += 25; });
      if (score > headingScore) {
        headingScore = score;
        bestHeading = heading;
      }
    });
    var score = headingScore;
    if (title.indexOf(query) !== -1) score += 120;
    if (summary.indexOf(query) !== -1) score += 55;
    if (content.indexOf(query) !== -1) score += 20;
    terms.forEach(function (term) {
      if (title.indexOf(term) !== -1) score += 45;
      if (summary.indexOf(term) !== -1) score += 18;
      if (content.indexOf(term) !== -1) score += 4;
    });
    return {
      score: score,
      title: bestHeading ? entry.title + ': ' + bestHeading.text : entry.title,
      url: entry.url + (bestHeading ? '#' + bestHeading.id : ''),
      snippet: resultSnippet(entry, terms)
    };
  }

  function appendSearchResult(result) {
    var item = document.createElement('article');
    item.className = 'search-result';
    var link = document.createElement('a');
    link.className = 'search-result__link';
    link.href = result.url;
    var copy = document.createElement('span');
    var title = document.createElement('span');
    title.className = 'search-result__title';
    title.textContent = result.title;
    var snippet = document.createElement('span');
    snippet.className = 'search-result__snippet';
    snippet.textContent = result.snippet;
    var arrow = document.createElement('span');
    arrow.className = 'search-result__arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/></svg>';
    copy.appendChild(title);
    copy.appendChild(snippet);
    link.appendChild(copy);
    link.appendChild(arrow);
    item.appendChild(link);
    searchResults.appendChild(item);
  }

  function renderSearch() {
    if (!searchResults || !searchIndex) return;
    var query = normalizeSearchText(searchInput.value).toLowerCase();
    searchResults.textContent = '';
    if (!query) {
      searchStatus.textContent = 'Search across ' + searchIndex.length + ' guides';
      searchIndex.slice(0, 5).forEach(function (entry) {
        appendSearchResult({ title: entry.title, url: entry.url, snippet: entry.summary });
      });
      return;
    }
    var terms = query.split(' ').filter(Boolean);
    var results = searchIndex.map(function (entry) { return scoreEntry(entry, query, terms); })
      .filter(Boolean)
      .sort(function (a, b) { return b.score - a.score; });
    searchStatus.textContent = results.length + (results.length === 1 ? ' guide found' : ' guides found');
    if (!results.length) {
      var empty = document.createElement('p');
      empty.className = 'search-dialog__empty';
      empty.textContent = 'No documentation matched your search. Try fewer or more general words.';
      searchResults.appendChild(empty);
      return;
    }
    results.forEach(appendSearchResult);
  }

  searchOpenButtons.forEach(function (button) { button.addEventListener('click', openSearch); });

  document.addEventListener('keydown', function (event) {
    var target = event.target;
    var isEditable = target && (target.matches('input, textarea, select') || target.isContentEditable);
    var isShortcut = (event.key.toLowerCase() === 'k' && (event.ctrlKey || event.metaKey)) || (event.key === '/' && !isEditable && !event.ctrlKey && !event.metaKey && !event.altKey);
    if (isShortcut) {
      event.preventDefault();
      openSearch();
    } else if (event.key === 'Escape' && searchLayer && !searchLayer.hidden) {
      closeSearch();
    }
  });

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
