(() => {
  'use strict';

  const VERSION = '20260803-native-install-v7-full-icon';

  const strings = {
    'zh-hant': {
      title: '安裝 AKG GLOBAL',
      text: '安裝後可像一般 App 一樣快速開啟 Vipyctmall。',
      install: '立即安裝',
      later: '暫時不要'
    },
    'zh-hans': {
      title: '安装 AKG GLOBAL',
      text: '安装后可像普通 App 一样快速打开 Vipyctmall。',
      install: '立即安装',
      later: '暂时不要'
    },
    en: {
      title: 'Install AKG GLOBAL',
      text: 'Install Vipyctmall for fast, app-like access.',
      install: 'Install now',
      later: 'Not now'
    },
    ja: {title:'AKG GLOBAL をインストール',text:'Vipyctmall をアプリのようにすぐ開けます。',install:'今すぐインストール',later:'今はしない'},
    ko: {title:'AKG GLOBAL 설치',text:'Vipyctmall을 앱처럼 빠르게 열 수 있습니다.',install:'지금 설치',later:'나중에'},
    ms: {title:'Pasang AKG GLOBAL',text:'Pasang Vipyctmall untuk akses pantas seperti aplikasi.',install:'Pasang sekarang',later:'Bukan sekarang'},
    th: {title:'ติดตั้ง AKG GLOBAL',text:'ติดตั้ง Vipyctmall เพื่อเปิดใช้งานได้รวดเร็วเหมือนแอป',install:'ติดตั้งตอนนี้',later:'ไว้ภายหลัง'},
    vi: {title:'Cài đặt AKG GLOBAL',text:'Cài đặt Vipyctmall để mở nhanh như một ứng dụng.',install:'Cài đặt ngay',later:'Để sau'},
    id: {title:'Instal AKG GLOBAL',text:'Instal Vipyctmall agar dapat dibuka cepat seperti aplikasi.',install:'Instal sekarang',later:'Nanti'},
    ru: {title:'Установить AKG GLOBAL',text:'Установите Vipyctmall для быстрого запуска как приложения.',install:'Установить',later:'Не сейчас'},
    my: {title:'AKG GLOBAL ကို ထည့်သွင်းပါ',text:'Vipyctmall ကို App ကဲ့သို့ အမြန်ဖွင့်နိုင်ရန် ထည့်သွင်းပါ။',install:'ယခုထည့်သွင်းမည်',later:'နောက်မှ'},
    hi: {title:'AKG GLOBAL इंस्टॉल करें',text:'Vipyctmall को ऐप की तरह तेज़ी से खोलने के लिए इंस्टॉल करें।',install:'अभी इंस्टॉल करें',later:'अभी नहीं'},
    mn: {title:'AKG GLOBAL суулгах',text:'Vipyctmall-ийг апп шиг хурдан нээхийн тулд суулгана уу.',install:'Одоо суулгах',later:'Дараа'},
    km: {title:'ដំឡើង AKG GLOBAL',text:'ដំឡើង Vipyctmall ដើម្បីបើកបានលឿនដូចកម្មវិធី។',install:'ដំឡើងឥឡូវនេះ',later:'ពេលក្រោយ'},
    lo: {title:'ຕິດຕັ້ງ AKG GLOBAL',text:'ຕິດຕັ້ງ Vipyctmall ເພື່ອເປີດໄດ້ໄວເໝືອນແອັບ.',install:'ຕິດຕັ້ງດຽວນີ້',later:'ໄວ້ພາຍຫຼັງ'}
  };

  const lang = (document.documentElement.lang || 'en').toLowerCase();
  const locale = lang.startsWith('zh-hant') || lang === 'zh-tw' ? 'zh-hant'
    : lang.startsWith('zh-hans') || lang === 'zh-cn' ? 'zh-hans'
    : lang.split('-')[0];
  const copy = strings[locale] || strings.en;

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    navigator.standalone === true ||
    document.referrer.startsWith('android-app://');

  const isMobile = () =>
    window.matchMedia('(pointer: coarse)').matches ||
    navigator.maxTouchPoints > 0 ||
    window.innerWidth <= 900;

  let deferredPrompt = null;
  let banner = null;
  let dismissedForThisPage = false;
  let pageLoaded = document.readyState === 'complete';

  function removeBanner() {
    if (banner) banner.remove();
    banner = null;
  }

  function ensureStyle() {
    if (document.getElementById('akg-pwa-install-style')) return;

    const style = document.createElement('style');
    style.id = 'akg-pwa-install-style';
    style.textContent = `
      .akg-pwa{position:fixed;z-index:2147483647;left:max(12px,env(safe-area-inset-left));right:max(12px,env(safe-area-inset-right));bottom:max(14px,env(safe-area-inset-bottom));display:none;grid-template-columns:64px minmax(0,1fr);gap:12px;align-items:center;max-width:680px;margin:auto;padding:14px;border:1px solid rgba(96,165,250,.4);border-radius:22px;background:linear-gradient(145deg,rgba(13,27,51,.985),rgba(5,12,25,.985));color:#f8fafc;box-shadow:0 24px 70px rgba(0,0,0,.58);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",sans-serif;backdrop-filter:blur(18px)}
      .akg-pwa.show{display:grid;animation:akg-pwa-in .28s ease-out}
      .akg-pwa img{width:64px;height:64px;border-radius:17px;background:#07101f;object-fit:cover}
      .akg-pwa h2{margin:0 0 4px;font-size:1rem;line-height:1.3;color:#fff}
      .akg-pwa p{margin:0;color:#bcc9da;font-size:.84rem;line-height:1.46}
      .akg-pwa-actions{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:9px}
      .akg-pwa button{min-height:44px;border-radius:13px;font:inherit;font-weight:900;cursor:pointer}
      .akg-pwa button:disabled{opacity:.65;cursor:wait}
      .akg-pwa-install{border:0;background:linear-gradient(100deg,#ffc229,#f59e0b);color:#111827}
      .akg-pwa-later{border:1px solid rgba(148,163,184,.3);background:rgba(15,23,42,.92);color:#dbeafe}
      @keyframes akg-pwa-in{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
      @media(max-width:350px){.akg-pwa{grid-template-columns:52px minmax(0,1fr);padding:12px}.akg-pwa img{width:52px;height:52px}.akg-pwa-actions{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function showNativeInstallBanner() {
    // Never show a fake/manual install prompt.
    // The button is rendered only when the browser has supplied a real
    // BeforeInstallPromptEvent and the app is not already installed.
    if (
      banner ||
      dismissedForThisPage ||
      isStandalone() ||
      !isMobile() ||
      !deferredPrompt
    ) return;

    ensureStyle();

    const box = document.createElement('aside');
    box.className = 'akg-pwa';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-live', 'polite');
    box.innerHTML = `
      <img src="/assets/brand/vipyctmall-icon-max-192.png?v=${VERSION}" alt="" width="64" height="64">
      <div><h2></h2><p></p></div>
      <div class="akg-pwa-actions">
        <button type="button" class="akg-pwa-later"></button>
        <button type="button" class="akg-pwa-install"></button>
      </div>`;

    box.querySelector('h2').textContent = copy.title;
    box.querySelector('p').textContent = copy.text;

    const laterButton = box.querySelector('.akg-pwa-later');
    const installButton = box.querySelector('.akg-pwa-install');

    laterButton.textContent = copy.later;
    installButton.textContent = copy.install;

    laterButton.addEventListener('click', () => {
      // Only hide during the current document lifetime.
      // Reloading or reopening the page checks installability again.
      dismissedForThisPage = true;
      removeBanner();
    });

    installButton.addEventListener('click', async () => {
      // The browser requires this call to happen directly inside a user click.
      const promptEvent = deferredPrompt;
      if (!promptEvent || isStandalone()) {
        removeBanner();
        return;
      }

      installButton.disabled = true;
      laterButton.disabled = true;

      try {
        // This opens the browser's native installation confirmation.
        // Web security does not allow a site to silently install without it.
        promptEvent.prompt();
        const choice = await promptEvent.userChoice;

        deferredPrompt = null;
        removeBanner();

        if (choice && choice.outcome === 'dismissed') {
          dismissedForThisPage = true;
        }
      } catch (error) {
        console.warn('AKG GLOBAL native install prompt failed:', error);
        deferredPrompt = null;
        removeBanner();
      }
    });

    document.body.appendChild(box);
    banner = box;
    requestAnimationFrame(() => box.classList.add('show'));
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none'
        });
        registration.update().catch(() => {});
      } catch (error) {
        console.warn('AKG GLOBAL service worker registration failed:', error);
      }
    });
  }

  // Chromium-based browsers dispatch this only when the current site is
  // genuinely installable and is not already running as an installed app.
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;

    if (pageLoaded) {
      showNativeInstallBanner();
    }
  });

  window.addEventListener('load', () => {
    pageLoaded = true;

    if (isStandalone()) {
      deferredPrompt = null;
      removeBanner();
      return;
    }

    showNativeInstallBanner();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    dismissedForThisPage = true;
    removeBanner();
  });

  const standaloneQuery = window.matchMedia('(display-mode: standalone)');
  if (typeof standaloneQuery.addEventListener === 'function') {
    standaloneQuery.addEventListener('change', (event) => {
      if (event.matches) {
        deferredPrompt = null;
        dismissedForThisPage = true;
        removeBanner();
      }
    });
  }
})();
