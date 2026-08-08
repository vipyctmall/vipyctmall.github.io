(() => {
  'use strict';

  const VERSION = '20260808-pwa-restored-v1';
  const DISMISS_KEY = 'vipyctmall_pwa_install_dismissed_at';
  const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;
  let deferredPrompt = null;
  let panel = null;

  const standalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isSafari = () => /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(navigator.userAgent);

  const localeCode = () => {
    const raw = (document.documentElement.lang || '').toLowerCase();
    if (raw.startsWith('zh-tw') || raw.startsWith('zh-hant')) return 'zh-tw';
    if (raw.startsWith('zh-cn') || raw.startsWith('zh-hans') || raw === 'zh') return 'zh-cn';
    return raw.split('-')[0] || 'en';
  };

  const copy = {
    'zh-tw': {title:'安裝 AKG GLOBAL', body:'將網站加入手機主畫面，之後可像 APP 一樣快速開啟。', install:'安裝 APP', close:'稍後', ios:'Safari：點選「分享」→「加入主畫面」即可安裝。', ok:'知道了'},
    'zh-cn': {title:'安装 AKG GLOBAL', body:'将网站添加到手机主屏幕，之后可像 APP 一样快速打开。', install:'安装 APP', close:'稍后', ios:'Safari：点击“分享”→“添加到主屏幕”即可安装。', ok:'知道了'},
    en: {title:'Install AKG GLOBAL', body:'Add this site to your home screen for app-like quick access.', install:'Install App', close:'Later', ios:'Safari: tap Share → Add to Home Screen.', ok:'Got it'},
    ja: {title:'AKG GLOBAL をインストール', body:'ホーム画面に追加すると、アプリのようにすぐ開けます。', install:'アプリを追加', close:'後で', ios:'Safari：「共有」→「ホーム画面に追加」を選択してください。', ok:'OK'},
    ko: {title:'AKG GLOBAL 설치', body:'홈 화면에 추가하면 앱처럼 빠르게 열 수 있습니다.', install:'앱 설치', close:'나중에', ios:'Safari: 공유 → 홈 화면에 추가를 선택하세요.', ok:'확인'},
    ms: {title:'Pasang AKG GLOBAL', body:'Tambah laman ini ke skrin utama untuk akses pantas seperti aplikasi.', install:'Pasang Aplikasi', close:'Kemudian', ios:'Safari: tekan Kongsi → Tambah ke Skrin Utama.', ok:'Faham'},
    th: {title:'ติดตั้ง AKG GLOBAL', body:'เพิ่มเว็บไซต์นี้ไปยังหน้าจอหลักเพื่อเปิดใช้งานได้รวดเร็วเหมือนแอป', install:'ติดตั้งแอป', close:'ภายหลัง', ios:'Safari: แตะ แชร์ → เพิ่มไปยังหน้าจอโฮม', ok:'ตกลง'},
    vi: {title:'Cài đặt AKG GLOBAL', body:'Thêm trang này vào màn hình chính để truy cập nhanh như ứng dụng.', install:'Cài ứng dụng', close:'Để sau', ios:'Safari: chạm Chia sẻ → Thêm vào Màn hình chính.', ok:'Đã hiểu'},
    id: {title:'Instal AKG GLOBAL', body:'Tambahkan situs ini ke layar utama untuk akses cepat seperti aplikasi.', install:'Instal Aplikasi', close:'Nanti', ios:'Safari: ketuk Bagikan → Tambahkan ke Layar Utama.', ok:'Mengerti'},
    ru: {title:'Установить AKG GLOBAL', body:'Добавьте сайт на главный экран для быстрого доступа как к приложению.', install:'Установить', close:'Позже', ios:'Safari: нажмите «Поделиться» → «На экран Домой».', ok:'Понятно'},
    my: {title:'AKG GLOBAL ကို ထည့်သွင်းရန်', body:'APP ကဲ့သို့ အမြန်ဖွင့်နိုင်ရန် ပင်မမျက်နှာပြင်သို့ ထည့်ပါ။', install:'APP ထည့်သွင်းရန်', close:'နောက်မှ', ios:'Safari: Share → Add to Home Screen ကို နှိပ်ပါ။', ok:'နားလည်ပါပြီ'},
    hi: {title:'AKG GLOBAL इंस्टॉल करें', body:'ऐप जैसी तेज़ पहुँच के लिए इसे होम स्क्रीन पर जोड़ें।', install:'ऐप इंस्टॉल करें', close:'बाद में', ios:'Safari: Share → Add to Home Screen चुनें।', ok:'ठीक है'},
    mn: {title:'AKG GLOBAL суулгах', body:'Апп шиг хурдан нээхийн тулд нүүр дэлгэцэнд нэмнэ үү.', install:'Апп суулгах', close:'Дараа', ios:'Safari: Share → Add to Home Screen сонгоно уу.', ok:'Ойлголоо'},
    km: {title:'ដំឡើង AKG GLOBAL', body:'បន្ថែមគេហទំព័រនេះទៅអេក្រង់ដើម ដើម្បីបើកបានរហ័សដូចកម្មវិធី។', install:'ដំឡើង APP', close:'ពេលក្រោយ', ios:'Safari៖ ចុច Share → Add to Home Screen។', ok:'យល់ហើយ'},
    lo: {title:'ຕິດຕັ້ງ AKG GLOBAL', body:'ເພີ່ມເວັບໄຊນີ້ໄປໜ້າຈໍຫຼັກ ເພື່ອເປີດໄດ້ໄວເໝືອນ APP.', install:'ຕິດຕັ້ງ APP', close:'ພາຍຫຼັງ', ios:'Safari: ແຕະ Share → Add to Home Screen.', ok:'ເຂົ້າໃຈແລ້ວ'}
  };

  const t = () => copy[localeCode()] || copy.en;

  const recentlyDismissed = () => {
    try {
      const ts = Number(localStorage.getItem(DISMISS_KEY) || 0);
      return ts > 0 && Date.now() - ts < DISMISS_MS;
    } catch (_) { return false; }
  };

  const markDismissed = () => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch (_) {}
  };

  const hide = () => {
    if (panel) panel.remove();
    panel = null;
  };

  const show = (mode) => {
    if (standalone() || panel || recentlyDismissed()) return;
    const txt = t();
    panel = document.createElement('aside');
    panel.id = 'vipyctmall-pwa-install';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', txt.title);
    panel.innerHTML = `
      <img src="/assets/brand/vipyctmall-icon-max-192.png?v=${VERSION}" alt="" width="48" height="48">
      <div class="vipyctmall-pwa-copy">
        <strong>${txt.title}</strong>
        <span>${mode === 'ios' ? txt.ios : txt.body}</span>
      </div>
      <button type="button" class="vipyctmall-pwa-primary">${mode === 'ios' ? txt.ok : txt.install}</button>
      <button type="button" class="vipyctmall-pwa-close" aria-label="${txt.close}">×</button>`;

    const style = document.createElement('style');
    style.id = 'vipyctmall-pwa-install-style';
    style.textContent = `
      #vipyctmall-pwa-install{position:fixed;left:50%;bottom:calc(78px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:100000;width:min(94vw,520px);box-sizing:border-box;display:grid;grid-template-columns:48px minmax(0,1fr) auto;gap:10px;align-items:center;padding:12px 42px 12px 12px;border:1px solid rgba(94,225,220,.42);border-radius:18px;background:#09172a;color:#eef7ff;box-shadow:0 12px 34px rgba(0,0,0,.48);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans",sans-serif}
      #vipyctmall-pwa-install img{display:block;border-radius:12px}
      #vipyctmall-pwa-install .vipyctmall-pwa-copy{min-width:0;display:grid;gap:3px}
      #vipyctmall-pwa-install strong{font-size:14px;line-height:1.25}
      #vipyctmall-pwa-install span{font-size:11.5px;line-height:1.4;color:#b8cadf}
      #vipyctmall-pwa-install .vipyctmall-pwa-primary{min-height:38px;padding:0 14px;border:0;border-radius:999px;background:#ffbd23;color:#07101f;font-weight:900;white-space:nowrap;cursor:pointer}
      #vipyctmall-pwa-install .vipyctmall-pwa-close{position:absolute;right:8px;top:8px;width:28px;height:28px;border:0;border-radius:50%;background:rgba(255,255,255,.08);color:#dce8f7;font-size:20px;line-height:1;cursor:pointer}
      @media(max-width:420px){#vipyctmall-pwa-install{grid-template-columns:42px minmax(0,1fr);padding:10px 38px 10px 10px}#vipyctmall-pwa-install img{width:42px;height:42px}#vipyctmall-pwa-install .vipyctmall-pwa-primary{grid-column:1/-1;width:100%;min-height:40px}#vipyctmall-pwa-install strong{font-size:13px}#vipyctmall-pwa-install span{font-size:11px}}
    `;
    if (!document.getElementById(style.id)) document.head.appendChild(style);
    document.body.appendChild(panel);

    panel.querySelector('.vipyctmall-pwa-close').addEventListener('click', () => {
      markDismissed();
      hide();
    });

    panel.querySelector('.vipyctmall-pwa-primary').addEventListener('click', async () => {
      if (mode === 'ios') {
        markDismissed();
        hide();
        return;
      }
      if (!deferredPrompt) return;
      const promptEvent = deferredPrompt;
      deferredPrompt = null;
      try {
        await promptEvent.prompt();
        await promptEvent.userChoice;
      } catch (_) {}
      hide();
    });
  };

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', {scope:'/', updateViaCache:'none'}).catch(() => {});
    }, {once:true});
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    show('native');
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    hide();
    try { localStorage.removeItem(DISMISS_KEY); } catch (_) {}
  });

  if (isIOS() && isSafari() && !standalone()) {
    window.addEventListener('load', () => setTimeout(() => show('ios'), 700), {once:true});
  }
})();
