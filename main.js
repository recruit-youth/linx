/**
 * LINX株式会社 採用ページ — main.js
 * alpha.plaid.co.jp テイストのアニメーション
 */
'use strict';

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ─────────────────────────────────────────
   Throttled scroll listener
───────────────────────────────────────── */
function onScroll(fn) {
  let t = false;
  window.addEventListener('scroll', () => {
    if (!t) { requestAnimationFrame(() => { fn(); t = false; }); t = true; }
  }, { passive: true });
}

/* ─────────────────────────────────────────
   1. Loader → Site reveal
───────────────────────────────────────── */
function initLoader() {
  const loader = $('#loader');
  const site   = $('#site');
  if (!loader || !site) return;

  const DURATION = 1800;

  setTimeout(() => {
    loader.classList.add('is-gone');
    site.classList.add('is-ready');
    // ローダー退場後にヒーローアニメを発火
    setTimeout(fireHeroAnims, 200);
  }, DURATION);
}

/* ─────────────────────────────────────────
   2. Hero animations (delay-driven)
───────────────────────────────────────── */
function fireHeroAnims() {
  // タイトルライン
  $$('.js-hero-line').forEach(el => {
    const d = parseInt(el.dataset.delay || 0, 10);
    setTimeout(() => el.classList.add('in'), d);
  });
  // フェード要素
  $$('.js-hero-fade').forEach(el => {
    const d = parseInt(el.dataset.delay || 0, 10);
    setTimeout(() => el.classList.add('in'), d);
  });
}

/* ─────────────────────────────────────────
   3. Nav scroll state
───────────────────────────────────────── */
function initNav() {
  const nav = $('#nav');
  if (!nav) return;
  function update() {
    nav.classList.toggle('is-solid', window.scrollY > 60);
  }
  onScroll(update);
  update();
}

/* ─────────────────────────────────────────
   4. Scroll reveal — js-reveal
───────────────────────────────────────── */
function initReveal() {
  const els = $$('.js-reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const d  = parseInt(el.dataset.delay || 0, 10);
      setTimeout(() => el.classList.add('in'), d);
      io.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => io.observe(el));
}

/* ─────────────────────────────────────────
   5. Count-up animation
───────────────────────────────────────── */
function initCountUp() {
  const counters = $$('.js-count');
  if (!counters.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.target || 0, 10);
      countUp(el, target, 1800);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
}

function countUp(el, to, dur) {
  const start = performance.now();
  function ease(t) { return 1 - Math.pow(1 - t, 4); }
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(to * ease(p));
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ─────────────────────────────────────────
   6. ORB morphing parallax
     SVGアニメは既にCSS/SVG animateタグで動作。
     追加でスクロール視差のみ適用。
───────────────────────────────────────── */
function initOrbParallax() {
  const orb = $('.hero__orb-wrap');
  if (!orb) return;
  onScroll(() => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    if (y > vh) return;
    orb.style.transform = `translateY(calc(-50% + ${y * 0.18}px))`;
  });
}

/* ─────────────────────────────────────────
   7. Vision cards dim-siblings on hover
───────────────────────────────────────── */
function initVisionCards() {
  const cards = $$('.vision__card');
  cards.forEach((c, i) => {
    c.addEventListener('mouseenter', () => {
      cards.forEach((oc, j) => {
        const dist = Math.abs(i - j);
        oc.style.opacity    = dist === 0 ? '1' : dist === 1 ? '0.55' : '0.25';
        oc.style.transition = 'opacity 0.35s, padding-left 0.4s cubic-bezier(0.16,1,0.3,1)';
      });
    });
    c.addEventListener('mouseleave', () => {
      cards.forEach(oc => { oc.style.opacity = '1'; });
    });
  });
}

/* ─────────────────────────────────────────
   8. Entry option hover — lift effect
───────────────────────────────────────── */
function initEntryOptions() {
  $$('.entry-opt').forEach(opt => {
    opt.addEventListener('mouseenter', () => {
      if (window.innerWidth < 600) return;
      opt.style.transition = 'background 0.3s, transform 0.4s cubic-bezier(0.16,1,0.3,1)';
      opt.style.transform  = 'translateY(-4px)';
    });
    opt.addEventListener('mouseleave', () => {
      opt.style.transform = '';
    });
  });
}

/* ─────────────────────────────────────────
   9. Smooth scroll
───────────────────────────────────────── */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
    });
  });
}

/* ─────────────────────────────────────────
   10. Reading progress bar
───────────────────────────────────────── */
function initProgressBar() {
  const bar = document.createElement('div');
  bar.className = 'progress-bar';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  onScroll(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? window.scrollY / max * 100 : 0) + '%';
  });
}

/* ─────────────────────────────────────────
   11. Entry Form
───────────────────────────────────────── */
function initForm() {
  const form = $('#entryForm');
  const done = $('#formDone');
  if (!form || !done) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name  = $('#f-name').value.trim();
    const email = $('#f-email').value.trim();
    const type  = $('#f-type').value;

    if (!name)  { showErr('f-name',  'お名前を入力してください'); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showErr('f-email', '正しいメールアドレスを入力してください'); return;
    }
    if (!type)  { showErr('f-type',  'ご希望を選択してください'); return; }

    const btn = form.querySelector('.f-submit');
    const origHTML = btn.innerHTML;
    btn.disabled = true;
    btn.querySelector('span').textContent = '送信中...';

    try {
      await fetch('../tables/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email,
          contact_type: type,
          message: $('#f-msg').value.trim(),
          submitted_at: new Date().toISOString(),
          company: 'LINX',
        }),
      });
    } catch (err) {
      console.warn('Save error:', err);
    }

    setTimeout(() => {
      form.style.display = 'none';
      done.classList.add('is-show');
      done.scrollIntoView({ behavior: 'smooth', block: 'center' });
      btn.disabled = false;
      btn.innerHTML = origHTML;
    }, 700);
  });
}

function showErr(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  const prev = el.parentNode.querySelector('.f-err');
  if (prev) prev.remove();
  const err = document.createElement('span');
  err.className = 'f-err';
  err.textContent = msg;
  el.parentNode.appendChild(err);
  el.style.borderColor = 'var(--accent)';
  el.focus();
  el.addEventListener('input', () => {
    const e = el.parentNode.querySelector('.f-err');
    if (e) e.remove();
    el.style.borderColor = '';
  }, { once: true });
}

/* ─────────────────────────────────────────
   12. Grid lines subtle animation
───────────────────────────────────────── */
function initGridLines() {
  const lines = $$('.grid-line');
  if (!lines.length) return;

  // ロード後にフェードイン
  setTimeout(() => {
    lines.forEach((l, i) => {
      l.style.transition = `opacity 1.2s ease ${0.3 + i * 0.15}s`;
      l.style.opacity = '1';
    });
  }, 2000);

  // 初期状態を透明に
  lines.forEach(l => { l.style.opacity = '0'; });
}

/* ─────────────────────────────────────────
   INIT
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNav();
  initReveal();
  initCountUp();
  initOrbParallax();
  initVisionCards();
  initEntryOptions();
  initSmoothScroll();
  initProgressBar();
  initForm();
  initGridLines();
});
