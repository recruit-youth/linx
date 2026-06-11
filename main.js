/**
 * LINX株式会社 - メインJavaScript
 */

'use strict';

/* ============================================
   ヘッダー スクロール制御
   ============================================ */
const header = document.getElementById('site-header');

function onScroll() {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // スクロールトップボタン
  const scrollBtn = document.getElementById('scroll-top');
  if (scrollBtn) {
    if (window.scrollY > 400) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // 初期実行

/* ============================================
   ハンバーガーメニュー
   ============================================ */
const hamburger = document.getElementById('hamburger');
const globalNav = document.getElementById('global-nav');

if (hamburger && globalNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = globalNav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // ナビリンクをクリックしたら閉じる
  globalNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      globalNav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================
   スムーススクロール（アンカーリンク）
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================
   スクロールトップ
   ============================================ */
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================
   AOS（独自スクロールアニメーション）
   ============================================ */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -48px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ============================================
   数値カウンターアニメーション
   ============================================ */
function initCounters() {
  const counters = document.querySelectorAll('.counter');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutQuart
        const eased = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.round(eased * target);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ============================================
   Works フィルタリング
   ============================================ */
function initWorksFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards  = document.querySelectorAll('.work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // アクティブ状態を切り替え
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      workCards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          card.classList.remove('hidden');
          // アニメーション
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ============================================
   お問い合わせフォーム バリデーション
   ============================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn  = document.getElementById('submit-btn');
  const successMsg = document.getElementById('form-success');

  function validateField(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (!field || !error) return true;

    let valid = true;
    let msg = '';

    if (field.required && !field.value.trim()) {
      valid = false;
      msg = message || 'この項目は必須です';
    } else if (field.type === 'email' && field.value.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) {
        valid = false;
        msg = '正しいメールアドレスを入力してください';
      }
    }

    field.classList.toggle('error', !valid);
    error.textContent = msg;
    return valid;
  }

  function validatePrivacy() {
    const check = document.getElementById('contact-privacy');
    const error = document.getElementById('error-privacy');
    if (!check || !error) return true;

    const valid = check.checked;
    error.textContent = valid ? '' : 'プライバシーポリシーへの同意が必要です';
    return valid;
  }

  // リアルタイムバリデーション
  ['contact-name', 'contact-email', 'contact-message'].forEach(id => {
    const field = document.getElementById(id);
    if (field) {
      field.addEventListener('blur', () => {
        const errorId = 'error-' + id.replace('contact-', '');
        validateField(id, errorId);
      });
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const v1 = validateField('contact-name',    'error-name',    'お名前を入力してください');
    const v2 = validateField('contact-email',   'error-email',   'メールアドレスを入力してください');
    const v3 = validateField('contact-message', 'error-message', 'お問い合わせ内容を入力してください');
    const v4 = validatePrivacy();

    if (!v1 || !v2 || !v3 || !v4) return;

    // 送信中
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = '送信中…';

    // ダミーの送信処理（実際にはAPIコールに置き換え）
    await new Promise(resolve => setTimeout(resolve, 1200));

    form.reset();
    successMsg.hidden = false;
    submitBtn.closest('.form-group') && submitBtn.closest('.form-group').remove();
    submitBtn.style.display = 'none';
  });
}

/* ============================================
   アクティブナビリンク（スクロール追従）
   ============================================ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '72')}px 0px -60% 0px` });

  sections.forEach(s => observer.observe(s));
}

/* ============================================
   初期化
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initCounters();
  initWorksFilter();
  initContactForm();
  initActiveNav();

  // アクティブナビのスタイル（CSS変数を補完）
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active {
      color: var(--color-primary) !important;
    }
    .site-header:not(.scrolled) .nav-link.active {
      color: #fff !important;
      background: rgba(255,255,255,0.12) !important;
    }
  `;
  document.head.appendChild(style);
});
