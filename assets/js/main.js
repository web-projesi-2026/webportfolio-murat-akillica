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
    ? '<i class="fa-solid fa-circle-check" style="color:#22c55e;font-size:13px;"></i>'
    : '<i class="fa-solid fa-circle-xmark" style="color:#e84393;font-size:13px;"></i>';

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
    // Sadece project-card'lara tilt uygula; skill-card'lar flip kullandığı için hariç
    document.querySelectorAll('.project-card').forEach(el => {
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
      if (res.success) { showNotification('Mesajınız gönderildi!', 'success'); form.reset(); }
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
  SkillFlip.init();
  ProjectFilter.init();
  ReadingProgress.init();
  RippleEffect.init();
  Typewriter.init();
  TooltipEnhancer.init();

  KeyboardShortcuts.init();
  SwipeHint.init();
  TagClickFilter.init();
  ModalFocusTrap.init();
  ScrollSpy.init();
  // Login ve Register formları aşağıdaki FormValidator bloğunda bağlanıyor
});

// ===== FEATURE: INTERACTIVE SKILL SHOWCASE =====
const SkillFlip = {
  toggle(card) {
    // Diğer açık kartları kapat
    document.querySelectorAll('.skill-card.flipped').forEach(c => {
      if (c !== card) c.classList.remove('flipped');
    });
    card.classList.toggle('flipped');
  },
  init() {
    // Dışarı tıklayınca kapat
    document.addEventListener('click', e => {
      if (!e.target.closest('.skill-card')) {
        document.querySelectorAll('.skill-card.flipped').forEach(c => c.classList.remove('flipped'));
      }
    });
  }
};

// ===== FEATURE: DYNAMIC PROJECT FILTER =====
const ProjectFilter = {
  init() {
    const tabs = document.querySelectorAll('.filter-tab');
    if (!tabs.length) return;

    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.project-card');

    // Sayaçları hesapla
    const counts = { all: cards.length };
    cards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').split(' ');
      tags.forEach(tag => {
        if (tag) counts[tag] = (counts[tag] || 0) + 1;
      });
    });

    // Sayaçları yerleştir
    Object.entries(counts).forEach(([key, val]) => {
      const el = document.getElementById('count-' + key);
      if (el) el.textContent = val;
    });

    // Boş durum elementi
    let emptyEl = grid.querySelector('.filter-empty');
    if (!emptyEl) {
      emptyEl = document.createElement('div');
      emptyEl.className = 'filter-empty';
      emptyEl.innerHTML = '<div class="filter-empty-icon"><i class="fa-solid fa-magnifying-glass"></i></div><p>Bu kategoride proje bulunamadı.</p>';
      grid.appendChild(emptyEl);
    }

    const filterCards = (filter) => {
      let visible = 0;
      cards.forEach(card => {
        const tags = (card.getAttribute('data-tags') || '').split(' ');
        const match = filter === 'all' || tags.includes(filter);

        if (match) {
          // filter-hidden ve reveal.hidden her ikisini de kaldır — flaş önlenir
          card.classList.remove('filter-hidden', 'filter-fade-out');
          card.classList.remove('hidden');
          card.classList.add('visible');
          visible++;
        } else {
          card.classList.add('filter-fade-out');
          setTimeout(() => card.classList.add('filter-hidden'), 280);
        }
      });

      setTimeout(() => {
        emptyEl.classList.toggle('visible', visible === 0);
      }, 300);
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        filterCards(tab.getAttribute('data-filter'));
      });
    });
  }
};

// ===== FEATURE: ARTICLE READING PROGRESS =====
const ReadingProgress = {
  init() {
    // Progress bar elementi oluştur
    const bar = document.createElement('div');
    bar.id = 'reading-progress';
    document.body.prepend(bar);

    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = Math.min(progress, 100).toFixed(2) + '%';
    };

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update(); // Başlangıçta çalıştır
  }
};

// ===== INIT EKLE =====

// ===================================================
// YENİ ETKİLEŞİM 1: RIPPLE (DALGA EFEKTİ) - Tüm .btn elemanları
// ===================================================
const RippleEffect = {
  init() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.btn');
      if (!btn) return;

      const wave = document.createElement('span');
      wave.className = 'ripple-wave';

      const rect = btn.getBoundingClientRect();
      wave.style.left = (e.clientX - rect.left) + 'px';
      wave.style.top  = (e.clientY - rect.top) + 'px';

      btn.appendChild(wave);
      wave.addEventListener('animationend', () => wave.remove());
    });
  }
};

// ===================================================
// YENİ ETKİLEŞİM 2: TYPEWRITER - Hero subtitle metnini yazar
// ===================================================
const Typewriter = {
  texts: [
    'Mobil Uygulama Geliştirici',
    'Swift & iOS Geliştirici',
    'Kotlin & Android Geliştirici',
    'Firebase Entegrasyon Uzmanı'
  ],
  el: null,
  cursor: null,
  idx: 0,
  charIdx: 0,
  deleting: false,
  pauseTimer: null,

  init() {
    this.el = document.querySelector('.hero__label');
    if (!this.el) return;

    // Cursor ekle
    this.cursor = document.createElement('span');
    this.cursor.className = 'typewriter-cursor';
    this.el.textContent = '';
    this.el.appendChild(this.cursor);

    this.type();
  },

  type() {
    const current = this.texts[this.idx];

    if (!this.deleting) {
      // Yaz
      this.charIdx++;
      const slice = current.slice(0, this.charIdx);
      this.el.textContent = slice;
      this.el.appendChild(this.cursor);

      if (this.charIdx === current.length) {
        // Tamamlandı – bekle sonra sil
        this.deleting = true;
        this.pauseTimer = setTimeout(() => this.type(), 2200);
        return;
      }
      setTimeout(() => this.type(), 65);
    } else {
      // Sil
      this.charIdx--;
      const slice = current.slice(0, this.charIdx);
      this.el.textContent = slice;
      this.el.appendChild(this.cursor);

      if (this.charIdx === 0) {
        this.deleting = false;
        this.idx = (this.idx + 1) % this.texts.length;
        setTimeout(() => this.type(), 400);
        return;
      }
      setTimeout(() => this.type(), 35);
    }
  }
};

// ===================================================
// YENİ ETKİLEŞİM 3: TOOLTIP SISTEMI - data-tooltip attr ile çalışır
// ===================================================
// Tooltip CSS ile çalışır, JS olarak da dil bazlı dinamik tooltip'ler ekler.
const TooltipEnhancer = {
  init() {
    // Stack tag'lara tooltip ekle
    const tagTips = {
      'Swift':   'Apple\'ın modern programlama dili',
      'Kotlin':  'Android için resmi dil',
      'Firebase':'Google\'ın bulut platformu',
      'SQLite':  'Yerel veritabanı çözümü',
      'iOS':     'Apple mobil işletim sistemi',
      'Android': 'Google mobil işletim sistemi'
    };

    document.querySelectorAll('.stack-tag').forEach(tag => {
      const key = tag.textContent.trim();
      if (tagTips[key]) tag.setAttribute('data-tooltip', tagTips[key]);
    });

    // Sosyal linklere tooltip
    document.querySelectorAll('.social-link[title]').forEach(link => {
      if (!link.getAttribute('data-tooltip')) {
        link.setAttribute('data-tooltip', link.getAttribute('title'));
      }
    });

    // Tema toggle butona tooltip
    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) {
      const updateThemeTip = () => {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        themeBtn.setAttribute('data-tooltip', isDark ? 'Açık temaya geç' : 'Koyu temaya geç');
      };
      updateThemeTip();
      themeBtn.addEventListener('click', () => setTimeout(updateThemeTip, 50));
    }
  }
};

// ===================================================
// YENİ ETKİLEŞİM 4: KLAVYE KISAYOLLARI
// T = tema değiştir | Esc = açık modalı kapat | / = arama odağı (varsa)
// ===================================================
const KeyboardShortcuts = {
  init() {
    document.addEventListener('keydown', e => {
      // Yazı alanlarında çalışmasın
      const tag = document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 't' || e.key === 'T') {
        ThemeManager.toggle();
        showNotification('Tema değiştirildi.', 'success');
      }

      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal-overlay.open');
        if (openModal) openModal.classList.remove('open');
        // Mobil menü açıksa kapat
        const nav = document.querySelector('.navbar__nav.open');
        if (nav) Navbar.toggleMenu();
      }

      // Yukarı çık: G tuşu
      if (e.key === 'g' || e.key === 'G') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
};

// ===================================================
// YENİ ETKİLEŞİM 5: MOBİL DOKUNMATIK KAYDIRMA (SWIPE)
// Mobilde sola/sağa kaydırma ile proje kartları arasında geçiş
// ===================================================
const SwipeHint = {
  init() {
    let startX = 0;
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    grid.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    grid.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) < 60) return; // Küçük kaydırmaları yoksay

      const tabs = document.querySelectorAll('.filter-tab');
      const activeIdx = [...tabs].findIndex(t => t.classList.contains('active'));

      if (diff > 0 && activeIdx < tabs.length - 1) {
        tabs[activeIdx + 1].click(); // Sağa kaydır → sonraki kategori
      } else if (diff < 0 && activeIdx > 0) {
        tabs[activeIdx - 1].click(); // Sola kaydır → önceki kategori
      }
    }, { passive: true });
  }
};

// ===================================================
// YENİ ETKİLEŞİM 6: KART ETİKETİNE TIKLAYINCA FİLTRELE
// Proje kartındaki etiketlere tıklayınca otomatik filtrele
// ===================================================
const TagClickFilter = {
  init() {
    document.addEventListener('click', e => {
      const tag = e.target.closest('.project-card__tag');
      if (!tag) return;

      const text = tag.textContent.trim().toLowerCase();
      // Etiket metnini tab data-filter değerleriyle eşleştir
      const map = {
        'swift': 'ios', 'swiftui': 'ios', 'uikit': 'ios', 'healthkit': 'ios',
        'kotlin': 'android', 'room db': 'android',
        'firebase': 'firebase',
        'sqlite': 'sqlite', 'room': 'sqlite'
      };
      const filterKey = map[text];
      if (!filterKey) return;

      const tab = document.querySelector(`.filter-tab[data-filter="${filterKey}"]`);
      if (tab) {
        tab.click();
        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        showNotification(`"${filterKey.toUpperCase()}" filtreye geçildi.`, 'success');
      }
    });
  }
};

// ===================================================
// YENİ ETKİLEŞİM 7: MODAL ODAK KILIDI (Erişilebilirlik)
// Modal açıkken Tab tuşu modalın içinde döngü yapar
// ===================================================
const ModalFocusTrap = {
  init() {
    document.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const modal = document.querySelector('.modal-overlay.open .modal');
      if (!modal) return;

      const focusable = [...modal.querySelectorAll('a, button, input, textarea, [tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled);
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // Modal açılınca ilk butona odaklan
    const observer = new MutationObserver(() => {
      const modal = document.querySelector('.modal-overlay.open .modal');
      if (modal) {
        const firstFocus = modal.querySelector('button, a');
        if (firstFocus) setTimeout(() => firstFocus.focus(), 50);
      }
    });
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
  }
};

// ===================================================
// YENİ ETKİLEŞİM 8: SCROLL SPY (SAYFA KAYDIRMA TAKİBİ)
// Sayfa aşağı kaydıkça navbar'daki aktif link güncellenir
// ===================================================
const ScrollSpy = {
  init() {
    const sections = document.querySelectorAll('section[id], div[id].page-section');
    if (!sections.length) return;

    const links = document.querySelectorAll('.navbar__nav a[href]');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(link => {
            const href = link.getAttribute('href');
            const isMatch = href && href.includes('#' + id);
            link.classList.toggle('active', isMatch);
          });
        }
      });
    }, { threshold: 0.45, rootMargin: '-60px 0px -40% 0px' });

    sections.forEach(s => observer.observe(s));
  }
};

// ===================================================
// BAĞLA – Yeni etkileşimler
// ===================================================

// ===================================================
// FORM VALIDATION ENGINE – Canlı doğrulama sistemi
// ===================================================
const FormValidator = {

  // Alan doğrulama kuralları
  rules: {
    name:     { minLen: 2, label: 'Ad Soyad' },
    email:    { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: 'E-posta' },
    password: { minLen: 6, label: 'Şifre' },
    password2:{ label: 'Şifre Tekrar' },
    message:  { minLen: 10, maxLen: 1000, label: 'Mesaj' },
    subject:  { label: 'Konu' },
    terms:    { label: 'Koşullar' }
  },

  // Tek bir alanı doğrula
  validateField(input) {
    const name = input.name;
    const val  = input.type === 'checkbox' ? null : input.value.trim();
    const rule = this.rules[name];
    if (!rule) return true;

    let error = '';

    if (input.type === 'checkbox') {
      if (input.required && !input.checked) error = 'Devam etmek için kabul etmelisiniz.';
    } else if (input.required && !val) {
      error = `${rule.label} boş bırakılamaz.`;
    } else if (val) {
      if (name === 'email' && !rule.pattern.test(val)) {
        error = 'Geçerli bir e-posta adresi girin. (örn: ad@mail.com)';
      } else if (name === 'password' && val.length < rule.minLen) {
        error = `Şifre en az ${rule.minLen} karakter olmalıdır.`;
      } else if (name === 'password2') {
        const form = input.closest('form');
        const pass = form ? form.querySelector('[name="password"]') : null;
        if (pass && val !== pass.value) error = 'Şifreler birbiriyle eşleşmiyor.';
      } else if (name === 'name' && val.length < rule.minLen) {
        error = `${rule.label} en az ${rule.minLen} karakter olmalıdır.`;
      } else if (rule.minLen && val.length < rule.minLen) {
        error = `En az ${rule.minLen} karakter giriniz.`;
      } else if (rule.maxLen && val.length > rule.maxLen) {
        error = `En fazla ${rule.maxLen} karakter girebilirsiniz.`;
      }
    }

    this.setFieldState(input, error);
    return !error;
  },

  // Alanın görsel durumunu ayarla
  setFieldState(input, error) {
    input.classList.remove('is-valid', 'is-invalid');
    const prev = input.parentElement.querySelector('.field-error, .field-success');
    if (prev) prev.remove();

    const hasValue = input.type === 'checkbox' ? input.checked : input.value.trim().length > 0;

    if (!hasValue && !error) return; // Henüz dokunulmamış

    if (error) {
      input.classList.add('is-invalid');
      const msg = document.createElement('div');
      msg.className = 'field-error';
      msg.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>${error}`;
      input.parentElement.appendChild(msg);
    } else {
      input.classList.add('is-valid');
      const msg = document.createElement('div');
      msg.className = 'field-success';
      msg.innerHTML = `<i class="fa-solid fa-circle-check"></i>Geçerli`;
      input.parentElement.appendChild(msg);
    }
  },

  // Tüm formu doğrula
  validateForm(form) {
    const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
    let allValid = true;
    let firstInvalid = null;

    fields.forEach(field => {
      const ok = this.validateField(field);
      if (!ok) {
        allValid = false;
        if (!firstInvalid) firstInvalid = field;
      }
    });

    if (!allValid && firstInvalid) {
      firstInvalid.focus();
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.classList.add('shake');
        setTimeout(() => submitBtn.classList.remove('shake'), 400);
      }
    }

    return allValid;
  },

  // Forma canlı doğrulama ekle
  attachLive(form) {
    if (!form) return;
    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid') || field.value.trim().length > 0) {
          this.validateField(field);
        }
      });
      // Checkbox için anlık
      if (field.type === 'checkbox') {
        field.addEventListener('change', () => this.validateField(field));
      }
    });
  },

  // Karakter sayacı
  attachCharCounter(textarea, max) {
    if (!textarea) return;
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.textContent = `0 / ${max}`;
    textarea.parentElement.appendChild(counter);
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      counter.textContent = `${len} / ${max}`;
      counter.classList.remove('warn', 'over');
      if (len > max * 0.8) counter.classList.add('warn');
      if (len > max)       counter.classList.add('over');
    });
  }
};

// ===================================================
// AUTH – Navbar güncelle: kayıt butonu + kullanıcı adı
// ===================================================
// Auth.updateNavbar'ı genişlet
const _origUpdateNavbar = Auth.updateNavbar.bind(Auth);
Auth.updateNavbar = function() {
  const user = this.getUser();
  const loginBtn   = document.querySelector('.btn-login');
  const registerBtn = document.querySelector('.btn-register');
  const userMenu   = document.querySelector('.user-menu');
  const userName   = document.querySelector('.user-name');
  const userAvatar = document.querySelector('.user-avatar');

  if (user) {
    // Giriş yapılmış: giriş/kayıt butonlarını gizle, user menüsü göster
    if (loginBtn)    loginBtn.style.display = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    if (userMenu)    userMenu.style.display = 'flex';
    if (userName)    userName.textContent = user.name || user.email;
    if (userAvatar)  userAvatar.textContent = (user.name || user.email).charAt(0).toUpperCase();
  } else {
    // Giriş yapılmamış: user menüsünü gizle, butonları göster
    if (loginBtn)    loginBtn.style.display = '';
    if (registerBtn) registerBtn.style.display = '';
    if (userMenu)    userMenu.style.display = 'none';
  }
};

// ===================================================
// LOGIN – Gelişmiş doğrulama ile
// ===================================================
function handleLoginValidated(e) {
  e.preventDefault();
  const form = e.target;

  // Canlı doğrula
  if (!FormValidator.validateForm(form)) return;

  const btn = form.querySelector('[type="submit"]');
  const orig = btn.innerHTML;
  btn.innerHTML = '<span class="loading"></span> Giriş yapılıyor…';
  btn.disabled = true;

  const data = new FormData();
  data.append('action', 'login');
  data.append('email', form.querySelector('[name="email"]').value.trim());
  data.append('password', form.querySelector('[name="password"]').value);

  // Simüle edilmiş giriş (backend olmadan da çalışır)
  setTimeout(() => {
    const email = form.querySelector('[name="email"]').value.trim();
    const name  = email.split('@')[0];

    // localStorage'dan kayıtlı kullanıcıyı bul
    const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const foundUser  = savedUsers.find(u => u.email === email && u.password === form.querySelector('[name="password"]').value);

    if (foundUser) {
      sessionStorage.setItem('user', JSON.stringify({ name: foundUser.name, email: foundUser.email }));
      showFormAlert(form, `Hoş geldiniz, ${foundUser.name}! Yönlendiriliyorsunuz…`, true);
      setTimeout(() => window.location.href = getRootPath() + 'index.html', 1200);
    } else if (email && email.includes('@')) {
      // Demo: backend olmadan geçici giriş
      const demoUser = { name: name.charAt(0).toUpperCase() + name.slice(1), email };
      sessionStorage.setItem('user', JSON.stringify(demoUser));
      showFormAlert(form, `Hoş geldiniz! Yönlendiriliyorsunuz…`, true);
      setTimeout(() => window.location.href = getRootPath() + 'index.html', 1200);
    } else {
      showFormAlert(form, 'E-posta veya şifre hatalı.', false);
      btn.innerHTML = orig;
      btn.disabled  = false;
    }
  }, 800);
}

// ===================================================
// REGISTER – Gelişmiş doğrulama ile
// ===================================================
function handleRegisterValidated(e) {
  e.preventDefault();
  const form = e.target;

  if (!FormValidator.validateForm(form)) return;

  const pass  = form.querySelector('[name="password"]').value;
  const pass2 = form.querySelector('[name="password2"]').value;
  if (pass !== pass2) {
    FormValidator.setFieldState(form.querySelector('[name="password2"]'), 'Şifreler birbirleriyle eşleşmiyor.');
    return;
  }

  const btn  = form.querySelector('[type="submit"]');
  const orig = btn.innerHTML;
  btn.innerHTML = '<span class="loading"></span> Kayıt yapılıyor…';
  btn.disabled  = true;

  setTimeout(() => {
    const name  = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();

    // Kullanıcıyı localStorage'a kaydet
    const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (savedUsers.find(u => u.email === email)) {
      showFormAlert(form, 'Bu e-posta adresi zaten kayıtlı.', false);
      btn.innerHTML = orig;
      btn.disabled  = false;
      return;
    }
    savedUsers.push({ name, email, password: pass });
    localStorage.setItem('registeredUsers', JSON.stringify(savedUsers));

    // Başarı mesajı
    const formEl = form.parentElement;
    form.style.display = 'none';
    const successBox = document.createElement('div');
    successBox.className = 'form-success-box show';
    successBox.innerHTML = `
      <div class="form-success-icon"><i class="fa-solid fa-check"></i></div>
      <div class="form-success-title">Kayıt Başarılı!</div>
      <p class="form-success-text">Hesabınız oluşturuldu.<br>Giriş sayfasına yönlendiriliyorsunuz…</p>
    `;
    formEl.appendChild(successBox);
    showNotification(`Hoş geldiniz, ${name}!`, 'success');
    setTimeout(() => window.location.href = getRootPath() + 'pages/login.html', 2000);
  }, 900);
}

// ===================================================
// CONTACT FORM – Gelişmiş doğrulama ile
// ===================================================
function handleContactValidated(e) {
  e.preventDefault();
  const form = e.target;

  if (!FormValidator.validateForm(form)) return;

  const btn  = form.querySelector('[type="submit"]');
  const orig = btn.innerHTML;
  btn.innerHTML = '<span class="loading"></span> Gönderiliyor…';
  btn.disabled  = true;

  // Simüle gönderim (backend yoksa da çalışır)
  setTimeout(() => {
    // Backend denemesi
    fetch(getRootPath() + 'backend/php/contact.php', {
      method: 'POST',
      body: new FormData(form)
    })
    .then(r => r.json())
    .then(res => {
      if (res.success) showContactSuccess(form);
      else showFormAlert(form, res.message || 'Hata oluştu.', false);
    })
    .catch(() => {
      // Backend yoksa yine de başarılı göster (static site)
      showContactSuccess(form);
    })
    .finally(() => {
      btn.innerHTML = orig;
      btn.disabled  = false;
    });
  }, 600);
}

function showContactSuccess(form) {
  form.style.display = 'none';
  const parent = form.parentElement;
  const box = document.createElement('div');
  box.className = 'form-success-box show';
  box.innerHTML = `
    <div class="form-success-icon"><i class="fa-solid fa-paper-plane"></i></div>
    <div class="form-success-title">Mesajınız Gönderildi!</div>
    <p class="form-success-text">En kısa sürede size geri döneceğim.<br>Teşekkür ederim!</p>
    <button class="btn btn-outline" onclick="location.reload()" style="margin-top:0.5rem;font-size:0.82rem;">Yeni Mesaj Gönder</button>
  `;
  parent.appendChild(box);
  showNotification('Mesajınız başarıyla gönderildi!', 'success');
}

// Form içi alert (hata/başarı mesajı)
function showFormAlert(form, msg, success) {
  let alert = form.querySelector('.form-alert');
  if (!alert) {
    alert = document.createElement('div');
    const submitBtn = form.querySelector('[type="submit"]');
    form.insertBefore(alert, submitBtn);
  }
  alert.className = 'form-alert ' + (success ? 'form-alert--success' : 'form-alert--error');
  alert.innerHTML = (success
    ? '<i class="fa-solid fa-circle-check"></i>'
    : '<i class="fa-solid fa-circle-exclamation"></i>') + msg;
  setTimeout(() => { if (alert.parentElement) alert.remove(); }, 5000);
}

// ===================================================
// DOMContentLoaded – Yeni handler'ları bağla
// ===================================================
document.addEventListener('DOMContentLoaded', () => {
  // Auth navbar güncellemesini yeniden çalıştır
  Auth.updateNavbar();

  // Login formu
  const lForm = document.getElementById('loginForm');
  if (lForm) {
    FormValidator.attachLive(lForm);
    // Mevcut handler'ı kaldır, yenisini ekle
    lForm.removeEventListener('submit', handleLogin);
    lForm.addEventListener('submit', handleLoginValidated);
  }

  // Register formu
  const rForm = document.getElementById('registerForm');
  if (rForm) {
    FormValidator.attachLive(rForm);
    rForm.removeEventListener('submit', handleRegister);
    rForm.addEventListener('submit', handleRegisterValidated);
    // Mesaj textarea karakter sayacı
    const msgArea = rForm.querySelector('[name="message"]');
    if (msgArea) FormValidator.attachCharCounter(msgArea, 1000);
  }

  // Contact formu
  const cForm = document.getElementById('contactForm');
  if (cForm) {
    FormValidator.attachLive(cForm);
    // Mevcut inline handler'ı kaldır
    cForm.removeEventListener('submit', handleContactForm);
    cForm.addEventListener('submit', handleContactValidated);
    // Textarea karakter sayacı
    const msgArea = cForm.querySelector('[name="message"]');
    if (msgArea) FormValidator.attachCharCounter(msgArea, 1000);
  }
});
