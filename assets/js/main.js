// ===== MAIN.JS – Gelişmiş Animasyonlar =====

// ===== CURSOR =====
// Custom cursor kaldırıldı – tarayıcı varsayılan imleci kullanılır.

// ===== HERO SPOTLIGHT =====
const Spotlight = {
  init() {
    const spotlight = document.querySelector('.hero__spotlight');
    if (!spotlight) return;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1) + '%';
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1) + '%';
      spotlight.style.setProperty('--mx', x);
      spotlight.style.setProperty('--my', y);
    });
  }
};

// ===== TEMA YÖNETİMİ =====
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('theme') || 'dark';
    this.apply(saved);
    const btn = document.querySelector('.theme-toggle');
    if (btn) btn.addEventListener('click', () => this.toggle());
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.apply(current === 'dark' ? 'light' : 'dark');
  }
};

// ===== NAVBAR =====
const Navbar = {
  init() {
    this.el = document.querySelector('.navbar');
    this.hamburger = document.querySelector('.navbar__hamburger');
    this.nav = document.querySelector('.navbar__nav');

    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    if (this.hamburger) this.hamburger.addEventListener('click', () => this.toggleMenu());

    // Menü linkine tıklanınca menüyü kapat
    document.querySelectorAll('.navbar__nav a').forEach(link => {
      link.addEventListener('click', () => {
        if (this.nav && this.nav.classList.contains('open')) {
          this.toggleMenu();
        }
      });
    });

    // Aktif link
    const links = document.querySelectorAll('.navbar__nav a');
    const current = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(l => {
      const href = l.getAttribute('href').split('/').pop();
      if (href === current) l.classList.add('active');
    });
  },
  onScroll() {
    if (this.el) this.el.classList.toggle('scrolled', window.scrollY > 50);
  },
  toggleMenu() {
    if (!this.nav) return;
    this.nav.classList.toggle('open');
    const isOpen = this.nav.classList.contains('open');
    document.body.classList.toggle('menu-open', isOpen);
    const spans = this.hamburger.querySelectorAll('span');
    if (spans.length === 3) {
      spans[0].style.transform = isOpen ? 'rotate(45deg) translateY(7px)' : '';
      spans[1].style.opacity = isOpen ? '0' : '';
      spans[2].style.transform = isOpen ? 'rotate(-45deg) translateY(-7px)' : '';
    }
  }
};

// ===== SCROLL REVEAL =====
const ScrollReveal = {
  init() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          const delay = parseFloat(e.target.getAttribute('data-delay') || 0);
          e.target.style.transitionDelay = (delay + i * 0.06) + 's';
          e.target.classList.remove('hidden');
          e.target.classList.add('visible');
          this.observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    // JS çalışıyorsa animasyon için önce hidden yap
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('hidden');
      this.observer.observe(el);
    });
  }
};

// ===== SKILL & PROGRESS BARS =====
const AnimatedBars = {
  init() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('[data-width]').forEach(bar => {
            setTimeout(() => { bar.style.width = bar.getAttribute('data-width'); }, 150);
          });
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skills-grid, .progress-list').forEach(el => observer.observe(el));
  }
};

// ===== COUNTER ANIMATION =====
const Counters = {
  init() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.num').forEach(el => this.animate(el));
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stats-row').forEach(el => observer.observe(el));
  },

  animate(el) {
    const text = el.textContent;
    const num = parseFloat(text);
    const suffix = text.replace(/[\d.]/g, '');
    const isFloat = text.includes('.');
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const current = num * eased;
      el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
};

// ===== BACK TO TOP =====
const BackToTop = {
  init() {
    this.btn = document.querySelector('.back-to-top');
    if (!this.btn) return;
    window.addEventListener('scroll', () => {
      this.btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    this.btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
};

// ===== NOTIFICATION =====
function showNotification(msg, type = 'success') {
  let el = document.querySelector('.notification');
  if (!el) { el = document.createElement('div'); el.className = 'notification'; document.body.appendChild(el); }

  const icon = type === 'success'
    ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5"><polyline points="20,6 9,17 4,12"/></svg>'
    : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e84393" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  el.innerHTML = icon + ' ' + msg;
  el.className = `notification ${type}`;
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => el.classList.remove('show'), 3500);
}

// ===== MODAL =====
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); }
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); }
}

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) { e.target.classList.remove('open'); }
  if (e.target.closest('.modal-close')) {
    e.target.closest('.modal-overlay').classList.remove('open');

  }
});

// ===== TILT EFFECT ON CARDS =====
const Tilt = {
  init() {
    document.querySelectorAll('.project-card, .skill-card').forEach(el => {
      el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
        el.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
        setTimeout(() => { el.style.transition = ''; }, 500);
      });
    });
  }
};

// ===== STAGGER GRID ITEMS =====
const StaggerGrids = {
  init() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const items = e.target.querySelectorAll('.reveal');
          items.forEach((item, i) => {
            item.style.transitionDelay = (i * 0.08) + 's';
            item.classList.add('visible');
          });
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll('.skills-grid, .projects-grid, .blog-grid, .services-grid').forEach(g => observer.observe(g));
  }
};

// ===== AUTH =====
const Auth = {
  getUser() {
    try { return JSON.parse(sessionStorage.getItem('user')) || null; } catch { return null; }
  },
  isLoggedIn() { return !!this.getUser(); },
  logout() {
    sessionStorage.removeItem('user');
    showNotification('Çıkış yapıldı.', 'success');
    setTimeout(() => window.location.href = getRootPath() + 'index.html', 1000);
  },
  updateNavbar() {
    const user = this.getUser();
    const loginBtn = document.querySelector('.btn-login');
    const userMenu = document.querySelector('.user-menu');
    const userName = document.querySelector('.user-name');
    if (user) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (userMenu) userMenu.style.display = 'flex';
      if (userName) userName.textContent = user.name || user.email;
    }
  }
};

function getRootPath() {
  const path = window.location.pathname;
  // pages/ veya admin/ altındaysak bir üst dizine çık
  if (path.includes('/pages/') || path.includes('/admin/')) return '../';
  return '';
}

// ===== FORM GÖNDERİMİ =====
function handleContactForm(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('[type="submit"]');
  const orig = btn.textContent;
  btn.innerHTML = '<span class="loading"></span>';
  btn.disabled = true;

  const url = getRootPath() + 'backend/php/contact.php';

  fetch(url, { method: 'POST', body: new FormData(form) })
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(res => {
      if (res.success) { showNotification('Mesajınız gönderildi! ✓', 'success'); form.reset(); }
      else showNotification(res.message || 'Hata oluştu.', 'error');
    })
    .catch(err => {
      console.error('Contact form error:', err, 'URL:', url);
      showNotification('Sunucuya bağlanılamadı. XAMPP çalışıyor mu?', 'error');
    })
    .finally(() => { btn.textContent = orig; btn.disabled = false; });
}

// ===== REGISTER =====
function handleRegister(e) {
  e.preventDefault();
  const form = e.target;
  const pass = form.querySelector('[name="password"]').value;
  const pass2 = form.querySelector('[name="password2"]').value;

  if (pass !== pass2) { showNotification('Şifreler eşleşmiyor!', 'error'); return; }
  if (pass.length < 6) { showNotification('Şifre en az 6 karakter olmalı!', 'error'); return; }

  const btn = form.querySelector('[type="submit"]');
  btn.innerHTML = '<span class="loading"></span>';
  btn.disabled = true;

  const data = new FormData();
  data.append('action', 'register');
  data.append('name', form.querySelector('[name="name"]').value.trim());
  data.append('email', form.querySelector('[name="email"]').value.trim());
  data.append('password', pass);

  fetch(getRootPath() + 'backend/php/auth.php', { method: 'POST', body: data })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        showNotification('Kayıt başarılı! Giriş yapabilirsiniz.', 'success');
        setTimeout(() => window.location.href = getRootPath() + 'pages/login.html', 1500);
      } else showNotification(res.message || 'Kayıt hatası.', 'error');
    })
    .catch(() => showNotification('Sunucu hatası.', 'error'))
    .finally(() => { btn.disabled = false; btn.textContent = 'Kayıt Ol'; });
}

// ===== LOGIN =====
function handleLogin(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('[type="submit"]');
  btn.innerHTML = '<span class="loading"></span>';
  btn.disabled = true;

  const data = new FormData();
  data.append('action', 'login');
  data.append('email', form.querySelector('[name="email"]').value.trim());
  data.append('password', form.querySelector('[name="password"]').value);

  fetch(getRootPath() + 'backend/php/auth.php', { method: 'POST', body: data })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        sessionStorage.setItem('user', JSON.stringify(res.user));
        showNotification('Hoş geldiniz, ' + res.user.name + '!', 'success');
        setTimeout(() => window.location.href = getRootPath() + 'index.html', 1000);
      } else showNotification(res.message || 'Giriş başarısız.', 'error');
    })
    .catch(() => showNotification('Sunucu hatası.', 'error'))
    .finally(() => { btn.disabled = false; btn.textContent = 'Giriş Yap'; });
}

// ===== SMOOTH HOVER LINE EFFECT =====
const NavHover = {
  init() {
    const links = document.querySelectorAll('.navbar__nav a');
    links.forEach(link => {
      link.addEventListener('mouseenter', function () {
        this.style.setProperty('--progress', '1');
      });
      link.addEventListener('mouseleave', function () {
        this.style.setProperty('--progress', '0');
      });
    });
  }
};

// ===== BAĞLA =====
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  Navbar.init();
  Spotlight.init();
  ScrollReveal.init();
  AnimatedBars.init();
  Counters.init();
  BackToTop.init();
  StaggerGrids.init();
  Tilt.init();
  Auth.updateNavbar();

  // Form handlers
  const rForm = document.getElementById('registerForm');
  if (rForm) rForm.addEventListener('submit', handleRegister);

  const lForm = document.getElementById('loginForm');
  if (lForm) lForm.addEventListener('submit', handleLogin);
});
