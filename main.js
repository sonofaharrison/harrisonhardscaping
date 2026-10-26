/* ==========================================================================
   HARRISON HARDSCAPING LLC (harrisonhardscaping.com) — GLOBAL THEME & VIEW ENGINE
   Obsidian Dark / Alabaster Light Theme Engine + 9:16 Hero Media Synchronizer
   Parent Enterprise: Sons of Harrison (sonsofharrison.com)
   ========================================================================== */

/* 0. Immediate Theme, Crest Finish & View Restoration */
(function restoreSavedPreferences() {
  const savedTheme = localStorage.getItem('harrison-theme') || 'dark';
  const savedCrest = localStorage.getItem('harrison-hardscaping-crest') || savedTheme;
  const savedView = localStorage.getItem('harrison-view-mode') || 'standard';

  document.documentElement.setAttribute('data-theme', savedTheme);
  document.documentElement.setAttribute('data-crest', savedCrest);

  if (savedView === 'mobile') {
    document.documentElement.setAttribute('data-view', 'mobile');
  }
})();

/**
 * 1. Global Dark/Light Media Asset Synchronizer (Site Theme)
 *    - Swaps 1:1 Square Logos (.theme-brand-logo) between Harrison_Hardscaping_Dark.jpg & Light.jpg
 *    - Supports Parent Nexus 1:1 Logos (data-brand="sons") -> Harrison_Sons_Dark.jpg & Light.jpg
 *    - Swaps 9:16 Static Brand Graphics (.theme-brand-9x16) between *_Dark_9x16.jpg & *_Light_9x16.jpg
 *    - Swaps 9:16 Theme-Bound Videos (.theme-brand-video) between *_Dark_9x16_Animated.mp4 & *_Light_9x16_Animated.mp4
 */
function syncThemeMediaAssets() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const modeLabel = isLight ? 'Light' : 'Dark';

  /* A. Sync 1:1 Square Brand Logos (.theme-brand-logo) */
  document.querySelectorAll('.theme-brand-logo').forEach((img) => {
    const brandKey = (img.dataset.brand || 'hardscaping').toLowerCase();
    const logoSrc =
      brandKey === 'sons'
        ? `Harrison_Sons_${modeLabel}.jpg`
        : `Harrison_Hardscaping_${modeLabel}.jpg`;

    if (img.getAttribute('src') !== logoSrc) {
      img.dataset.fallbackApplied = 'false';
      img.style.display = '';
      img.setAttribute('src', logoSrc);
    }
  });

  /* B. Sync 9:16 Static Brand Graphics (.theme-brand-9x16) */
  const brandAssetMap = {
    hardscaping: `Harrison_Hardscaping_${modeLabel}_9x16.jpg`,
    sons: `Harrison_Sons_${modeLabel}.jpg`
  };

  document.querySelectorAll('.theme-brand-9x16').forEach((img) => {
    const brandKey = (img.dataset.brand || 'hardscaping').toLowerCase();
    const targetSrc = brandAssetMap[brandKey] || brandAssetMap.hardscaping;
    if (img.getAttribute('src') !== targetSrc) {
      img.dataset.fallbackApplied = 'false';
      img.style.display = '';
      const wrapper = img.parentElement;
      const existingFallback = wrapper ? wrapper.querySelector('.asset-fallback-box') : null;
      if (existingFallback) existingFallback.remove();
      img.setAttribute('src', targetSrc);
    }
  });

  /* C. Sync Theme-Linked 9:16 Animated Videos (.theme-brand-video) */
  const themeVideoSrc = `Harrison_Hardscaping_${modeLabel}_9x16_Animated.mp4`;
  const themePosterSrc = `Harrison_Hardscaping_${modeLabel}_9x16.jpg`;

  document.querySelectorAll('.theme-brand-video').forEach((video) => {
    video.setAttribute('poster', themePosterSrc);
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    if (video.getAttribute('src') !== themeVideoSrc) {
      video.setAttribute('src', themeVideoSrc);
      video.load();
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  });

  /* D. Update Dynamic Theme Status Captions */
  document.querySelectorAll('[data-caption-dark][data-caption-light]').forEach((el) => {
    el.textContent = isLight
      ? el.getAttribute('data-caption-light')
      : el.getAttribute('data-caption-dark');
  });
}

/**
 * 2. 9:16 Hero Crest Finish Engine (.crest-brand-video & .crest-brand-9x16)
 *    - Supports 'dark' (Harrison_Hardscaping_Dark_9x16_Animated.mp4)
 *      and 'light' (Harrison_Hardscaping_Light_9x16_Animated.mp4)
 */
function syncCrestFinishAssets() {
  const crestFinish = (document.documentElement.getAttribute('data-crest') || 'dark').toLowerCase();
  const finishLabel = crestFinish === 'light' ? 'Light' : 'Dark';

  const videoSrc = `Harrison_Hardscaping_${finishLabel}_9x16_Animated.mp4`;
  const posterSrc = `Harrison_Hardscaping_${finishLabel}_9x16.jpg`;

  /* A. Sync 9:16 Hero Animated Videos (.crest-brand-video) */
  document.querySelectorAll('.crest-brand-video').forEach((video) => {
    video.setAttribute('poster', posterSrc);
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    if (video.getAttribute('src') !== videoSrc) {
      video.setAttribute('src', videoSrc);
      video.load();
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  });

  /* B. Sync 9:16 Static Crest Displays tied to Crest Switcher (.crest-brand-9x16) */
  document.querySelectorAll('.crest-brand-9x16').forEach((img) => {
    if (img.getAttribute('src') !== posterSrc) {
      img.setAttribute('src', posterSrc);
    }
  });

  /* C. Update Active State on Crest Switcher Buttons (.crest-switch-btn) */
  document.querySelectorAll('.crest-switch-btn').forEach((btn) => {
    const isMatch = (btn.dataset.crestTarget || '').toLowerCase() === crestFinish;
    btn.classList.toggle('active', isMatch);
    btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
  });
}

/**
 * 3. Initialize Header & Hero Controls
 */
function initHeaderControls() {
  const rootEl = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const viewBtn = document.getElementById('view-mode-toggle');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  const syncControlLabels = () => {
    const isLight = rootEl.getAttribute('data-theme') === 'light';
    const isMobileView = rootEl.getAttribute('data-view') === 'mobile';

    if (themeBtn) {
      themeBtn.innerHTML = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
      themeBtn.setAttribute(
        'aria-label',
        isLight ? 'Switch Site to Obsidian Dark Mode' : 'Switch Site to Alabaster Light Mode'
      );
    }

    if (viewBtn) {
      viewBtn.innerHTML = isMobileView ? '🖥️ Full View' : '📱 Mobile View';
      viewBtn.classList.toggle('active', isMobileView);
      viewBtn.setAttribute('aria-pressed', isMobileView ? 'true' : 'false');
    }

    syncThemeMediaAssets();
    syncCrestFinishAssets();
  };

  syncControlLabels();

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isLight = rootEl.getAttribute('data-theme') === 'light';
      const nextTheme = isLight ? 'dark' : 'light';
      rootEl.setAttribute('data-theme', nextTheme);
      rootEl.setAttribute('data-crest', nextTheme);
      localStorage.setItem('harrison-theme', nextTheme);
      localStorage.setItem('harrison-hardscaping-crest', nextTheme);
      syncControlLabels();
    });
  }

  if (viewBtn) {
    viewBtn.addEventListener('click', () => {
      const isMobileView = rootEl.getAttribute('data-view') === 'mobile';
      if (isMobileView) {
        rootEl.removeAttribute('data-view');
        localStorage.setItem('harrison-view-mode', 'standard');
      } else {
        rootEl.setAttribute('data-view', 'mobile');
        localStorage.setItem('harrison-view-mode', 'mobile');
      }
      syncControlLabels();
    });
  }

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('nav-open');
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      menuBtn.textContent = isOpen ? '✕ CLOSE' : '☰ MENU';
    });
  }

  /* Bind 9:16 Hero Crest Finish Switcher Pills */
  document.querySelectorAll('.crest-switch-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetCrest = (btn.dataset.crestTarget || 'dark').toLowerCase();
      rootEl.setAttribute('data-crest', targetCrest);
      localStorage.setItem('harrison-hardscaping-crest', targetCrest);
      syncCrestFinishAssets();
    });
  });
}

/**
 * 4. Highlight Current Active Page in Navigation
 */
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/**
 * 5. Collapsible Details for Mobile Center-Scrolling View
 */
function initMobileCollapsibleCards() {
  document.querySelectorAll('[data-collapsible-card]').forEach((card) => {
    const content = card.querySelector('.collapsible-content');
    const toggleBtn = card.querySelector('.collapse-toggle-btn');
    if (!content || !toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
      const isCollapsed = content.classList.toggle('is-collapsed');
      toggleBtn.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true');
      toggleBtn.innerHTML = isCollapsed
        ? '<span>Show Technical Specs</span> <span>[+]</span>'
        : '<span>Collapse Technical Specs</span> <span>[−]</span>';
    });
  });
}

/**
 * 6. Project Consultation Portal Handler (contact.html)
 */
function initConsultationForm() {
  const form = document.getElementById('hardscaping-consult-form');
  const statusBox = document.getElementById('consult-form-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const clientName = formData.get('clientName') || 'Prospective Client';
    const scope = formData.get('projectScope') || 'Structural Hardscaping';
    const location = formData.get('propertyLocation') || 'Maryland';

    if (statusBox) {
      statusBox.classList.add('active');
      statusBox.innerHTML = `
        <strong>Field Assessment Request Logged:</strong> Thank you, ${clientName}. Your inquiry for
        <em>${scope}</em> in <em>${location}</em> has been prepared. For immediate priority scheduling,
        call or text our Maryland Field Desk directly at <a href="tel:4439919896" style="color: var(--gold); font-weight: 700;">443-991-9896</a>.
      `;
    }
  });
}

/**
 * 7. Automatic Zero-Edit Fallback for Any Missing Future Brand Image
 */
function initMissingAssetFallbacks() {
  document.querySelectorAll('img[data-fallback-title]').forEach((img) => {
    const handleFallback = () => {
      if (img.dataset.fallbackApplied === 'true') return;
      img.dataset.fallbackApplied = 'true';

      const srcAttr = img.getAttribute('src') || 'Asset_File.jpg';
      const title = img.getAttribute('data-fallback-title') || 'Harrison Hardscaping Asset';
      const status = img.getAttribute('data-asset-status') || 'STRUCTURAL MASONRY';

      if (img.classList.contains('theme-brand-logo')) {
        const parent = img.parentElement;
        img.style.display = 'none';
        if (parent && !parent.querySelector('.logo-monogram-fallback')) {
          const badge = document.createElement('span');
          badge.className = 'logo-monogram-fallback';
          badge.textContent = 'HH';
          parent.appendChild(badge);
        }
        return;
      }

      const wrapper = img.parentElement;
      img.style.display = 'none';

      if (wrapper && !wrapper.querySelector('.asset-fallback-box')) {
        const fallbackEl = document.createElement('div');
        fallbackEl.className = 'asset-fallback-box';
        fallbackEl.innerHTML = `
          <span class="fallback-monogram">HARRISON HARDSCAPING // ${status}</span>
          <div class="fallback-title">${title}</div>
          <span class="fallback-filename">${srcAttr}</span>
        `;
        wrapper.appendChild(fallbackEl);
      }
    };

    img.addEventListener('error', handleFallback);
    if (img.complete && img.naturalWidth === 0) {
      handleFallback();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHeaderControls();
  highlightActiveNav();
  initMobileCollapsibleCards();
  initConsultationForm();
  initMissingAssetFallbacks();
  syncThemeMediaAssets();
  syncCrestFinishAssets();
});
