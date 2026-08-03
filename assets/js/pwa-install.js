(() => {
  'use strict';

  const VERSION = '20260803-root-pwa-v3';
  const DISMISS_KEY = `vipyctmall_pwa_dismissed_${VERSION}`;
  const DISMISS_DAYS = 7;
  const DAY_MS = 24 * 60 * 60 * 1000;
  const params = new URLSearchParams(location.search);
  const forceTest = params.get('pwa-test') === '1';

  const strings = {
    'zh-hant': {
      title: '將 AKG GLOBAL 加到主畫面',
      text: '安裝後可像一般 App 一樣快速開啟 Vipyctmall。',
      install: '新增', later: '暫時不要',
      manual: '請開啟瀏覽器選單，選擇「安裝應用程式」或「加到主畫面」。',
      ios: '請點選 Safari 的「分享」，再選擇「加入主畫面」。'
    },
    'zh-hans': {
      title: '将 AKG GLOBAL 添加到主屏幕',
      text: '安装后可像普通 App 一样快速打开 Vipyctmall。',
      install: '添加', later: '暂时不要',
      manual: '请打开浏览器菜单，选择“安装应用”或“添加到主屏幕”。',
      ios: '请点击 Safari 的“分享”，再选择“添加到主屏幕”。'
    },
    en: {
      title: 'Add AKG GLOBAL to your Home Screen',
      text: 'Install Vipyctmall for fast, app-like access.',
      install: 'Add', later: 'Not now',
      manual: 'Open the browser menu and choose Install app or Add to Home screen.',
      ios: 'Tap Share in Safari, then choose Add to Home Screen.'
    },
    ja: {title:'AKG GLOBAL をホーム画面に追加',text:'Vipyctmall をアプリのようにすぐ開けます。',install:'追加',later:'今はしない',manual:'ブラウザのメニューから「アプリをインストール」または「ホーム画面に追加」を選択してください。',ios:'Safari の共有をタップし、「ホーム画面に追加」を選択してください。'},
    ko: {title:'AKG GLOBAL을 홈 화면에 추가',text:'Vipyctmall을 앱처럼 빠르게 열 수 있습니다.',install:'추가',later:'나중에',manual:'브라우저 메뉴에서 앱 설치 또는 홈 화면에 추가를 선택하세요.',ios:'Safari에서 공유를 누른 뒤 홈 화면에 추가를 선택하세요.'},
    ms: {title:'Tambah AKG GLOBAL ke Skrin Utama',text:'Pasang Vipyctmall untuk akses pantas seperti aplikasi.',install:'Tambah',later:'Bukan sekarang',manual:'Buka menu pelayar dan pilih Pasang aplikasi atau Tambah ke Skrin Utama.',ios:'Tekan Kongsi dalam Safari, kemudian pilih Tambah ke Skrin Utama.'},
    th: {title:'เพิ่ม AKG GLOBAL ไปยังหน้าจอหลัก',text:'ติดตั้ง Vipyctmall เพื่อเปิดใช้งานได้รวดเร็วเหมือนแอป',install:'เพิ่ม',later:'ไว้ภายหลัง',manual:'เปิดเมนูเบราว์เซอร์ แล้วเลือกติดตั้งแอปหรือเพิ่มไปยังหน้าจอหลัก',ios:'แตะแชร์ใน Safari แล้วเลือกเพิ่มไปยังหน้าจอโฮม'},
    vi: {title:'Thêm AKG GLOBAL vào Màn hình chính',text:'Cài đặt Vipyctmall để mở nhanh như một ứng dụng.',install:'Thêm',later:'Để sau',manual:'Mở menu trình duyệt và chọn Cài đặt ứng dụng hoặc Thêm vào Màn hình chính.',ios:'Nhấn Chia sẻ trong Safari, sau đó chọn Thêm vào Màn hình chính.'},
    id: {title:'Tambahkan AKG GLOBAL ke Layar Utama',text:'Instal Vipyctmall agar dapat dibuka cepat seperti aplikasi.',install:'Tambahkan',later:'Nanti',manual:'Buka menu browser lalu pilih Instal aplikasi atau Tambahkan ke layar utama.',ios:'Ketuk Bagikan di Safari, lalu pilih Tambahkan ke Layar Utama.'},
    ru: {title:'Добавить AKG GLOBAL на главный экран',text:'Установите Vipyctmall для быстрого запуска как приложения.',install:'Добавить',later:'Не сейчас',manual:'Откройте меню браузера и выберите «Установить приложение» или «Добавить на главный экран».',ios:'Нажмите «Поделиться» в Safari, затем выберите «На экран Домой».'},
    my: {title:'AKG GLOBAL ကို ပင်မမျက်နှာပြင်သို့ ထည့်ပါ',text:'Vipyctmall ကို App ကဲ့သို့ အမြန်ဖွင့်နိုင်ရန် ထည့်သွင်းပါ။',install:'ထည့်ပါ',later:'နောက်မှ',manual:'Browser menu ကိုဖွင့်ပြီး Install app သို့မဟုတ် Add to Home Screen ကိုရွေးပါ။',ios:'Safari မှ Share ကိုနှိပ်ပြီး Add to Home Screen ကိုရွေးပါ။'},
    hi: {title:'AKG GLOBAL को होम स्क्रीन पर जोड़ें',text:'Vipyctmall को ऐप की तरह तेज़ी से खोलने के लिए इंस्टॉल करें।',install:'जोड़ें',later:'अभी नहीं',manual:'ब्राउज़र मेनू खोलें और Install app या Add to Home screen चुनें।',ios:'Safari में शेयर पर टैप करें, फिर होम स्क्रीन पर जोड़ें चुनें।'},
    mn: {title:'AKG GLOBAL-ийг нүүр дэлгэцэд нэмэх',text:'Vipyctmall-ийг апп шиг хурдан нээхийн тулд суулгана уу.',install:'Нэмэх',later:'Дараа',manual:'Хөтчийн цэснээс Install app эсвэл Add to Home Screen-г сонгоно уу.',ios:'Safari-ийн Share товчийг дараад Add to Home Screen-г сонгоно уу.'},
    km: {title:'បន្ថែម AKG GLOBAL ទៅអេក្រង់ដើម',text:'ដំឡើង Vipyctmall ដើម្បីបើកបានលឿនដូចកម្មវិធី។',install:'បន្ថែម',later:'ពេលក្រោយ',manual:'បើកម៉ឺនុយកម្មវិធីរុករក ហើយជ្រើស Install app ឬ Add to Home Screen។',ios:'ចុច Share ក្នុង Safari រួចជ្រើស Add to Home Screen។'},
    lo: {title:'ເພີ່ມ AKG GLOBAL ໄປທີ່ໜ້າຈໍຫຼັກ',text:'ຕິດຕັ້ງ Vipyctmall ເພື່ອເປີດໄດ້ໄວເໝືອນແອັບ.',install:'ເພີ່ມ',later:'ໄວ້ພາຍຫຼັງ',manual:'ເປີດເມນູ browser ແລ້ວເລືອກ Install app ຫຼື Add to Home Screen.',ios:'ແຕະ Share ໃນ Safari ແລ້ວເລືອກ Add to Home Screen.'}
  };

  const lang = (document.documentElement.lang || 'en').toLowerCase();
  const locale = lang.startsWith('zh-hant') || lang === 'zh-tw' ? 'zh-hant'
    : lang.startsWith('zh-hans') || lang === 'zh-cn' ? 'zh-hans'
    : lang.split('-')[0];
  const copy = strings[locale] || strings.en;

  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isMobile = () => matchMedia('(pointer: coarse)').matches || innerWidth <= 900;
  const recentlyDismissed = () => {
    if (forceTest) return false;
    try {
      const t = Number(localStorage.getItem(DISMISS_KEY) || 0);
      return t > 0 && Date.now() - t < DISMISS_DAYS * DAY_MS;
    } catch (_) { return false; }
  };
  const dismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (_) {}
  };

  if ('serviceWorker' in navigator) {
    addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {scope:'/', updateViaCache:'none'});
        registration.update().catch(() => {});
      } catch (error) {
        console.warn('AKG GLOBAL service worker registration failed:', error);
      }
    });
  }

  if (isStandalone()) return;

  let deferredPrompt = null;
  addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    document.dispatchEvent(new CustomEvent('akg-pwa-install-ready'));
  });

  const style = document.createElement('style');
  style.id = 'akg-pwa-install-style';
  style.textContent = `
    .akg-pwa{position:fixed;z-index:2147483647;left:max(12px,env(safe-area-inset-left));right:max(12px,env(safe-area-inset-right));bottom:max(14px,env(safe-area-inset-bottom));display:none;grid-template-columns:56px minmax(0,1fr);gap:12px;align-items:center;max-width:680px;margin:auto;padding:14px;border:1px solid rgba(96,165,250,.4);border-radius:22px;background:linear-gradient(145deg,rgba(13,27,51,.985),rgba(5,12,25,.985));color:#f8fafc;box-shadow:0 24px 70px rgba(0,0,0,.58);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans",sans-serif;backdrop-filter:blur(18px)}
    .akg-pwa.show{display:grid;animation:akg-pwa-in .28s ease-out}
    .akg-pwa img{width:56px;height:56px;border-radius:15px;background:#fff;object-fit:cover}
    .akg-pwa h2{margin:0 0 4px;font-size:1rem;line-height:1.3;color:#fff}
    .akg-pwa p{margin:0;color:#bcc9da;font-size:.84rem;line-height:1.46}
    .akg-pwa-actions{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:9px}
    .akg-pwa button{min-height:44px;border-radius:13px;font:inherit;font-weight:900;cursor:pointer}
    .akg-pwa-install{border:0;background:linear-gradient(100deg,#ffc229,#f59e0b);color:#111827}
    .akg-pwa-later{border:1px solid rgba(148,163,184,.3);background:rgba(15,23,42,.92);color:#dbeafe}
    @keyframes akg-pwa-in{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
    @media(max-width:350px){.akg-pwa{grid-template-columns:48px minmax(0,1fr);padding:12px}.akg-pwa img{width:48px;height:48px}.akg-pwa-actions{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(navigator.userAgent);

  function createBanner() {
    const box = document.createElement('aside');
    box.className = 'akg-pwa';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-live', 'polite');
    box.innerHTML = `
      <img src="/assets/brand/icon-192.png?v=${VERSION}" alt="" width="56" height="56">
      <div><h2></h2><p></p></div>
      <div class="akg-pwa-actions">
        <button type="button" class="akg-pwa-later"></button>
        <button type="button" class="akg-pwa-install"></button>
      </div>`;
    box.querySelector('h2').textContent = copy.title;
    box.querySelector('p').textContent = (isIOS && isSafari) ? copy.ios : copy.text;
    box.querySelector('.akg-pwa-later').textContent = copy.later;
    box.querySelector('.akg-pwa-install').textContent = copy.install;
    document.body.appendChild(box);
    return box;
  }

  addEventListener('load', () => {
    if (!isMobile() || recentlyDismissed() || isStandalone()) return;
    const box = createBanner();
    const install = box.querySelector('.akg-pwa-install');
    const later = box.querySelector('.akg-pwa-later');

    later.addEventListener('click', () => {
      dismiss();
      box.classList.remove('show');
    });

    install.addEventListener('click', async () => {
      if (isIOS && isSafari) {
        box.querySelector('p').textContent = copy.ios;
        return;
      }
      if (deferredPrompt) {
        box.classList.remove('show');
        deferredPrompt.prompt();
        try { await deferredPrompt.userChoice; } catch (_) {}
        deferredPrompt = null;
        return;
      }
      box.querySelector('p').textContent = copy.manual;
    });

    setTimeout(() => box.classList.add('show'), 1000);
  });

  addEventListener('appinstalled', () => {
    document.querySelector('.akg-pwa')?.remove();
    try { localStorage.removeItem(DISMISS_KEY); } catch (_) {}
  });
})();
