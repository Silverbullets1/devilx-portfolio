/* ============================================================
   DevilX Digital Labs — site behaviour
   vanilla, no deps. High-performance & accessible.
   ============================================================ */
(function () {
  'use strict';

  const body = document.body;
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  const topbar = document.getElementById('topbar');
  const progress = document.getElementById('progress');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Mobile Menu & Focus Management ---------- */
  function setOpen(open) {
    const isCurrentlyOpen = body.classList.contains('menu-open');
    if (isCurrentlyOpen === open) return;

    body.classList.toggle('menu-open', open);
    if (burger) {
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (!open) burger.focus();
    }
    if (menu) {
      menu.setAttribute('aria-hidden', String(!open));
    }
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
    if (e.key === 'Escape' && body.classList.contains('menu-open')) {
      setOpen(false);
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth / window.innerHeight > 1.1 && body.classList.contains('menu-open')) {
      setOpen(false);
    }
  }, { passive: true });

  /* ---------- Header State & Scroll Progress ---------- */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      const y = window.scrollY || window.pageYOffset || 0;
      if (topbar) {
        topbar.classList.toggle('scrolled', y > 30);
      }
      if (progress) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on Scroll ---------- */
  const revealables = Array.from(document.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window && !reduce.matches) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Seamless Infinite Marquee ---------- */
  const track = document.querySelector('.marq-track');
  if (track && !track.dataset.duplicated) {
    track.dataset.duplicated = 'true';
    const originalItems = Array.from(track.children);
    originalItems.forEach(function (item) {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
  }

  /* ---------- Copy Email to Clipboard ---------- */
  const EMAIL = 'devilxlabs@zohomail.in';
  const copyBtn = document.getElementById('copyMail');

  function fallbackCopy(cb) {
    const ta = document.createElement('textarea');
    ta.value = EMAIL;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    ta.setAttribute('readonly', '');
    body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      cb();
    } catch (err) {
      console.error('Copy fallback failed', err);
    }
    body.removeChild(ta);
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      const labelSpan = copyBtn.querySelector('span');
      const originalText = labelSpan ? labelSpan.textContent : '';

      const notifySuccess = function () {
        if (labelSpan) {
          labelSpan.textContent = 'Copied ✓';
          setTimeout(function () {
            labelSpan.textContent = originalText;
          }, 2000);
        }
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(EMAIL)
          .then(notifySuccess)
          .catch(function () {
            fallbackCopy(notifySuccess);
          });
      } else {
        fallbackCopy(notifySuccess);
      }
    });
  }

  /* ---------- Mailto Form Builder ---------- */
  const form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      
      const f = new FormData(form);
      const name = (f.get('name') || '').toString().trim();
      const email = (f.get('email') || '').toString().trim();
      const service = (f.get('service') || '').toString();
      const msg = (f.get('message') || '').toString().trim();

      let subject = 'Project enquiry — ' + (service || 'General');
      if (name) subject += ' (' + name + ')';

      const lines = [
        'Name: ' + (name || 'Not provided'),
        'Email: ' + (email || 'Not provided'),
        'Service: ' + (service || 'Not sure yet'),
        '',
        'Project details:',
        msg || '(no additional details provided)',
        '',
        '— Sent via devilx-security-labs.vercel.app'
      ];

      const mailtoUrl = 'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));

      const submitBtn = form.querySelector('button[type="submit"] span');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';

      if (submitBtn) submitBtn.textContent = 'Opening mail client…';

      window.location.href = mailtoUrl;

      setTimeout(function () {
        if (submitBtn) submitBtn.textContent = originalBtnText;
      }, 3500);
    });
  }

  /* ---------- Resilient Hero Video Playback ---------- */
  const vid = document.querySelector('.plate video');
  if (vid) {
    const playSafe = function () {
      if (vid.paused) {
        const promise = vid.play();
        if (promise !== undefined) {
          promise.catch(function () {});
        }
      }
    };

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) playSafe();
    });

    if (vid.readyState < 3) {
      vid.addEventListener('canplay', playSafe, { once: true });
    }
  }

  /* ---------- Dynamic Year ---------- */
  const yr = document.getElementById('yr');
  if (yr) {
    yr.textContent = new Date().getFullYear();
  }
})();
