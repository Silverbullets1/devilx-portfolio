/* ============================================================
   DevilX Security Labs — site behaviour
   vanilla, no deps. Features degrade without JS.
   ============================================================ */
(function () {
  'use strict';

  var body = document.body;
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  var topbar = document.getElementById('topbar');
  var progress = document.getElementById('progress');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- mobile menu ---------- */
  function setOpen(open) {
    body.classList.toggle('menu-open', open);
    if (burger) {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    if (menu) menu.setAttribute('aria-hidden', String(!open));
  }
  if (burger) {
    burger.addEventListener('click', function () {
      setOpen(!body.classList.contains('menu-open'));
    });
  }
  if (menu) {
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth / window.innerHeight > 1.1) setOpen(false);
  }, { passive: true });

  /* ---------- header state + scroll progress ---------- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || 0;
      if (topbar) topbar.classList.toggle('scrolled', y > 30);
      if (progress) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- reveal on scroll ---------- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window && !reduce.matches) {
    revealables.forEach(function (el, i) {
      if (el.children.length) {
        Array.prototype.forEach.call(el.children, function (c, j) {
          c.style.setProperty('--i', Math.min(j, 5));
        });
      }
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- seamless marquee (duplicate track) ---------- */
  var track = document.querySelector('.marq-track');
  if (track) {
    track.insertAdjacentHTML('beforeend', track.innerHTML);
    track.querySelectorAll('li').forEach(function (li, i) {
      if (i >= track.querySelectorAll('li').length / 2) li.setAttribute('aria-hidden', 'true');
    });
  }

  /* ---------- copy email ---------- */
  var EMAIL = 'bb8654838@gmail.com';
  var copyBtn = document.getElementById('copyMail');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var done = function () {
        var t = copyBtn.querySelector('span');
        if (t) {
          var old = t.textContent;
          t.textContent = 'Copied ✓';
          setTimeout(function () { t.textContent = old; }, 1800);
        }
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL).then(done, function () { fallbackCopy(done); });
      } else {
        fallbackCopy(done);
      }
    });
  }
  function fallbackCopy(cb) {
    var ta = document.createElement('textarea');
    ta.value = EMAIL;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); cb(); } catch (e) {}
    body.removeChild(ta);
  }

  /* ---------- mailto form builder (no backend needed) ---------- */
  var form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(form);
      var name = (f.get('name') || '').toString().trim();
      var email = (f.get('email') || '').toString().trim();
      var service = (f.get('service') || '').toString();
      var msg = (f.get('message') || '').toString().trim();
      var subject = 'Project enquiry — ' + (service || 'General');
      if (name) subject += ' (' + name + ')';
      var lines = [];
      if (name) lines.push('Name: ' + name);
      if (email) lines.push('Email: ' + email);
      lines.push('Service: ' + (service || 'Not sure yet'));
      lines.push('');
      lines.push(msg || '(no details provided)');
      lines.push('');
      lines.push('— sent from devilx-security-labs.vercel.app');
      window.location.href = 'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      var btn = form.querySelector('button[type=submit] span');
      if (btn) btn.textContent = 'Opening your mail app…';
      setTimeout(function () { if (btn) btn.textContent = 'Send Enquiry'; }, 3000);
    });
  }

  /* ---------- keep hero video playing (iOS edge cases) ---------- */
  var vid = document.querySelector('.plate video');
  if (vid) {
    var tryPlay = function () {
      var p = vid.play();
      if (p && p.catch) p.catch(function () {});
    };
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && vid.paused) tryPlay();
    });
    if (vid.readyState < 3) vid.addEventListener('canplay', tryPlay, { once: true });
  }

  /* ---------- year ---------- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
