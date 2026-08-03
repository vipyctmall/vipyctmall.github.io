(() => {
  'use strict';

  const VERSION = '20260803-install-detect-v5';
  const params = new URLSearchParams(location.search);
  const forceTest = params.get('pwa-test') === '1';

  const strings = {
    'zh-hant': {
      title: '將 AKG GLOBAL 加到主畫面',
      text: '安裝後可像一般 App 一樣快速開啟 Vipyctmall。',
      install: '新增',
      later: '暫時不要',
      manual: '目前瀏覽器尚未提供安裝視窗，請開啟瀏覽器選單，選擇「安裝應用程式」或「加到主畫面」。',
      ios: '請點選 Safari 的「分享」，再選擇「加入主畫面」。'
    },
    'zh-hans': {
      title: '将 AKG GLOBAL 添加到主屏幕',
      text: '安装后可像普通 App 一样快速打开 Vipyctmall。',
      install: '添加',
      later: '暂时不要',
      manual: '当前浏览器尚未提供安装窗口，请打开浏览器菜单，选择“安装应用”或“添加到主屏幕”。',
      ios: '请点击 Safari 的“分享”，再选择“添加到主屏幕”。'
    },
    en: {
      title: 'Add AKG GLOBAL to your Home Screen',
      text: 'Install Vipyctmall for fast, app-like access.',
      install: 'Add',
      later: 'Not now',
      manual: 'The browser install dialog is not available yet. Open the browser menu and choose Install app or Add to Home screen.',
      ios: 'Tap Share in Safari, then choose Add to Home Screen.'
    },
    ja: {title:'AKG GLOBAL をホーム画面に追加',text:'Vipyctmall をアプリのようにすぐ開けます。',install:'追加',later:'今はしない',manual:'インストール画面がまだ利用できません。ブラウザメニューから「アプリをインストール」または「ホーム画面に追加」を選択してください。',ios:'Safari の共有をタップし、「ホーム画面に追加」を選択してください。'},
    ko: {title:'AKG GLOBAL을 홈 화면에 추가',text:'Vipyctmall을 앱처럼 빠르게 열 수 있습니다.',install:'추가',later:'나중에',manual:'현재 설치 창을 사용할 수 없습니다. 브라우저 메뉴에서 앱 설치 또는 홈 화면에 추가를 선택하세요.',ios:'Safari에서 공유를 누른 뒤 홈 화면에 추가를 선택하세요.'},
    ms: {title:'Tambah AKG GLOBAL ke Skrin Utama',text:'Pasang Vipyctmall untuk akses pantas seperti aplikasi.',install:'Tambah',later:'Bukan sekarang',manual:'Tetingkap pemasangan belum tersedia. Buka menu pelayar dan pilih Pasang aplikasi atau Tambah ke Skrin Utama.',ios:'Tekan Kongsi dalam Safari, kemudian pilih Tambah ke Skrin Utama.'},
    th: {title:'เพิ่ม AKG GLOBAL ไปยังหน้าจอหลัก',text:'ติดตั้ง Vipyctmall เพื่อเปิดใช้งานได้รวดเร็วเหมือนแอป',install:'เพิ่ม',later:'ไว้ภายหลัง',manual:'หน้าต่างติดตั้งยังไม่พร้อม กรุณาเปิดเมนูเบราว์เซอร์ แล้วเลือกติดตั้งแอปหรือเพิ่มไปยังหน้าจอหลัก',ios:'แตะแชร์ใน Safari แล้วเลือกเพิ่มไปยังหน้าจอโฮม'},
    vi: {title:'Thêm AKG GLOBAL vào Màn hình chính',text:'Cài đặt Vipyctmall để mở nhanh như một ứng dụng.',install:'Thêm',later:'Để sau',manual:'Hộp thoại cài đặt chưa sẵn sàng. Mở menu trình duyệt và chọn Cài đặt ứng dụng hoặc Thêm vào Màn hình chính.',ios:'Nhấn Chia sẻ trong Safari, sau đó chọn Thêm vào Màn hình chính.'},
    id: {title:'Tambahkan AKG GLOBAL ke Layar Utama',text:'Instal Vipyctmall agar dapat dibuka cepat seperti aplikasi.',install:'Tambahkan',later:'Nanti',manual:'Dialog instalasi belum tersedia. Buka menu browser lalu pilih Instal aplikasi atau Tambahkan ke layar utama.',ios:'Ketuk Bagikan di Safari, lalu pilih Tambahkan ke Layar Utama.'},
    ru: {title:'Добавить AKG GLOBAL на главный экран',text:'Установите Vipyctmall для быстрого запуска как приложения.',install:'Добавить',later:'Не сейчас',manual:'Окно установки пока недоступно. Откройте меню браузера и выберите «Установить приложение» или «Добавить на главный экран».',ios:'Нажмите «Поделиться» в Safari, затем выберите «На экран Домой».'},
    my: {title:'AKG GLOBAL ကို ပင်မမျက်နှာပြင်သို့ ထည့်ပါ',text:'Vipyctmall ကို App ကဲ့သို့ အမြန်ဖွင့်နိုင်ရန် ထည့်သွင်းပါ။',install:'ထည့်ပါ',later:'နောက်မှ',manual:'Install dialog မရသေးပါ။ Browser menu ကိုဖွင့်ပြီး Install app သို့မဟုတ် Add to Home Screen ကိုရွေးပါ။',ios:'Safari မှ Share ကိုနှိပ်ပြီး Add to Home Screen ကိုရွေးပါ။'},
    hi: {title:'AKG GLOBAL को होम स्क्रीन पर जोड़ें',text:'Vipyctmall को ऐप की तरह तेज़ी से खोलने के लिए इंस्टॉल करें।',install:'जोड़ें',later:'अभी नहीं',manual:'इंस्टॉल विंडो अभी उपलब्ध नहीं है। ब्राउज़र मेनू खोलें और Install app या Add to Home screen चुनें।',ios:'Safari में शेयर पर टैप करें, फिर होम स्क्रीन पर जोड़ें चुनें।'},
    mn: {title:'AKG GLOBAL-ийг нүүр дэлгэцэд нэмэх',text:'Vipyctmall-ийг апп шиг хурдан нээхийн тулд суулгана уу.',install:'Нэмэх',later:'Дараа',manual:'Суулгах цонх одоогоор бэлэн биш байна. Хөтчийн цэснээс Install app эсвэл Add to Home Screen-г сонгоно уу.',ios:'Safari-ийн Share товчийг дараад Add to Home Screen-г сонгоно уу.'},
    km: {title:'បន្ថែម AKG GLOBAL ទៅអេក្រង់ដើម',text:'ដំឡើង Vipyctmall ដើម្បីបើកបានលឿនដូចកម្មវិធី។',install:'បន្ថែម',later:'ពេលក្រោយ',manual:'ផ្ទាំងដំឡើងមិនទាន់មានទេ។ បើកម៉ឺនុយកម្មវិធីរុករក ហើយជ្រើស Install app ឬ Add to Home Screen។',ios:'ចុច Share ក្នុង Safari រួចជ្រើស Add to Home Screen។'},
    lo: {title:'ເພີ່ມ AKG GLOBAL ໄປທີ່ໜ້າຈໍຫຼັກ',text:'ຕິດຕັ້ງ Vipyctmall ເພື່ອເປີດໄດ້ໄວເໝືອນແອັບ.',install:'ເພີ່ມ',later:'ໄວ້ພາຍຫຼັງ',manual:'ກ່ອງຕິດຕັ້ງຍັງບໍ່ພ້ອມ. ເປີດເມນູ browser ແລ້ວເລືອກ Install app ຫຼື Add to Home Screen.',ios:'ແຕະ Share ໃນ Safari ແລ້ວເລືອກ Add to Home Screen.'}
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

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const isSafari =
    /Safari/.test(navigator.userAgent) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS/.test(navigator.userAgent);

  let deferredPrompt = null;
  let banner = null;
  let dismissedForThisPage = false;
  let pageLoaded = document.readyState === 'complete';

  function removeBanner() {
    banner?.remove();
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
      .akg-pwa-install{border:0;background:linear-gradient(100deg,#ffc229,#f59e0b);color:#111827}
      .akg-pwa-later{border:1px solid rgba(148,163,184,.3);background:rgba(15,23,42,.92);color:#dbeafe}
      @keyframes akg-pwa-in{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
      @media(max-width:350px){.akg-pwa{grid-template-columns:52px minmax(0,1fr);padding:12px}.akg-pwa img{width:52px;height:52px}.akg-pwa-actions{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
  }

  function createBanner(mode) {
    if (banner || dismissedForThisPage || isStandalone() || !isMobile()) return;

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
    box.querySelector('p').textContent =
      mode === 'ios' ? copy.ios :
      mode === 'manual' ? copy.manual :
      copy.text;
    box.querySelector('.akg-pwa-later').textContent = copy.later;
    box.querySelector('.akg-pwa-install').textContent = copy.install;

    const installButton = box.querySelector('.akg-pwa-install');
    const laterButton = box.querySelector('.akg-pwa-later');

    laterButton.addEventListener('click', () => {
      // Only suppress the prompt in this document.
      // No localStorage/cookie is written, so the next reload checks again.
      dismissedForThisPage = true;
      removeBanner();
    });

    installButton.addEventListener('click', async () => {
      if (isStandalone()) {
        removeBanner();
        return;
      }

      if (mode === 'ios') {
        box.querySelector('p').textContent = copy.ios;
        return;
      }

      // The banner is normally shown only after beforeinstallprompt,
      // so this branch opens the real browser installation dialog.
      if (deferredPrompt) {
        const promptEvent = deferredPrompt;
        deferredPrompt = null;
        removeBanner();

        try {
          await promptEvent.prompt();
          await promptEvent.userChoice;
        } catch (error) {
          console.warn('AKG GLOBAL install prompt failed:', error);
        }
        return;
      }

      // Do not pretend an install is possible when the browser has not
      // provided an install event.
      box.querySelector('p').textContent = copy.manual;
    });

    document.body.appendChild(box);
    banner = box;
    requestAnimationFrame(() => box.classList.add('show'));
  }

  function maybeShowIOSGuide() {
    if (!pageLoaded || !isIOS || !isSafari || isStandalone() || dismissedForThisPage) return;
    createBanner('ios');
  }

  // Register the worker on every page load and always request the newest copy.
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

  // Chrome/Edge/Samsung Chromium sends this only when the site is currently
  // installable and the PWA is not already installed. This is the main
  // installed-state check for Android.
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;

    if (pageLoaded && !dismissedForThisPage && !isStandalone()) {
      createBanner('native');
    }
  });

  window.addEventListener('load', () => {
    pageLoaded = true;

    if (isStandalone()) {
      removeBanner();
      return;
    }

    if (deferredPrompt && !dismissedForThisPage) {
      createBanner('native');
      return;
    }

    // iOS has no beforeinstallprompt event. Show Safari's manual instructions.
    maybeShowIOSGuide();

    // Test mode may show a diagnostic/manual banner without falsely claiming
    // that a native install dialog is ready.
    if (forceTest && !banner && !isStandalone()) {
      createBanner('manual');
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    dismissedForThisPage = true;
    removeBanner();
  });

  window.matchMedia('(display-mode: standalone)').addEventListener?.('change', (event) => {
    if (event.matches) {
      deferredPrompt = null;
      dismissedForThisPage = true;
      removeBanner();
    }
  });
})();
