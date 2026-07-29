(function () {
  "use strict";

  var REFRESH_INTERVAL_MS = 5000;
  var LANGUAGES = [
    { code:"zh-tw",name:"繁體中文",native:"繁體中文",flag:"tw" },
    { code:"zh-cn",name:"簡體中文",native:"简体中文",flag:"cn" },
    { code:"en",name:"英文",native:"English",flag:"us" },
    { code:"ja",name:"日文",native:"日本語",flag:"jp" },
    { code:"ko",name:"韓文",native:"한국어",flag:"kr" },
    { code:"ms",name:"馬來文",native:"Bahasa Melayu",flag:"my" },
    { code:"th",name:"泰文",native:"ภาษาไทย",flag:"th" },
    { code:"vi",name:"越南文",native:"Tiếng Việt",flag:"vn" },
    { code:"id",name:"印尼文",native:"Bahasa Indonesia",flag:"id" },
    { code:"ru",name:"俄文",native:"Русский",flag:"ru" },
    { code:"my",name:"緬甸文",native:"မြန်မာဘာသာ",flag:"mm" },
    { code:"hi",name:"印地文",native:"हिन्दी",flag:"in" },
    { code:"mn",name:"蒙古文",native:"Монгол",flag:"mn" },
    { code:"km",name:"高棉文",native:"ភាសាខ្មែរ",flag:"kh" },
    { code:"lo",name:"寮文",native:"ພາສາລາວ",flag:"la" }
  ];

  var grid = document.getElementById("tv-grid");
  var totalEl = document.getElementById("tv-total");
  var statusEl = document.getElementById("tv-status");
  var statusDot = document.getElementById("tv-status-dot");
  var updatedEl = document.getElementById("tv-updated");
  var clockEl = document.getElementById("tv-clock");
  var dateEl = document.getElementById("tv-date");
  var refreshBtn = document.getElementById("tv-refresh");
  var fullscreenBtn = document.getElementById("tv-fullscreen");
  var errorEl = document.getElementById("tv-error");
  var countdownEl = document.getElementById("tv-countdown");
  var loading = false;
  var secondsUntilRefresh =
    Math.ceil(REFRESH_INTERVAL_MS / 1000);

  function config() {
    var value = window.AKG_COUNTER || {};
    return {
      apiBase:String(value.apiBase || "")
        .trim().replace(/\/+$/, ""),
      siteKey:String(
        value.siteKey || "vipyctmall-mall"
      ).trim()
    };
  }

  function configured(value) {
    return Boolean(
      /^https:\/\//i.test(value.apiBase) &&
      value.apiBase.indexOf("REPLACE-WITH-") === -1 &&
      /^[a-z0-9-]+$/i.test(value.siteKey)
    );
  }

  function number(value) {
    return new Intl.NumberFormat("zh-TW").format(
      Number(value) || 0
    );
  }

  function updateClock() {
    var now = new Date();
    clockEl.textContent =
      new Intl.DateTimeFormat("zh-TW", {
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit",
        hour12:false
      }).format(now);
    dateEl.textContent =
      new Intl.DateTimeFormat("zh-TW", {
        year:"numeric",
        month:"long",
        day:"numeric",
        weekday:"long"
      }).format(now);
  }

  function metrics(registers, purchases) {
    return '<div class="action-metrics">' +
      '<div class="action-stat register">' +
        '<span>註冊帳號點擊</span><strong>' +
        number(registers) + '</strong></div>' +
      '<div class="action-stat purchase">' +
        '<span>購物成為正式會員</span><strong>' +
        number(purchases) + '</strong></div>' +
      '</div>';
  }

  function loadingCards() {
    grid.innerHTML = LANGUAGES.map(function (lang, index) {
      return '<article class="card loading">' +
        '<div class="card-head"><div class="language">' +
        '<img class="flag" src="https://flagcdn.com/w80/' +
        lang.flag + '.png" alt="" loading="eager">' +
        '<div class="language-copy"><span class="native">' +
        lang.native + '</span><span class="zh-name">' +
        lang.name + '</span></div></div>' +
        '<span class="rank">#' + (index + 1) + '</span></div>' +
        '<div class="count">載入中</div>' +
        metrics(0, 0) +
        '<div class="bottom"><div class="bar">' +
        '<span></span></div><span class="share">—</span></div>' +
        '</article>';
    }).join("");
  }

  function render(visits, registers, purchases, total) {
    var rows = LANGUAGES.map(function (lang) {
      return Object.assign({}, lang, {
        count:Number(visits[lang.code]) || 0,
        registerCount:Number(registers[lang.code]) || 0,
        purchaseCount:Number(purchases[lang.code]) || 0
      });
    });

    var ranking = rows.slice().sort(function (a, b) {
      if (b.count !== a.count) return b.count - a.count;
      return LANGUAGES.findIndex(function (item) {
        return item.code === a.code;
      }) - LANGUAGES.findIndex(function (item) {
        return item.code === b.code;
      });
    });

    var ranks = {};
    ranking.forEach(function (row, index) {
      ranks[row.code] = index + 1;
    });

    var maximum = Math.max.apply(
      null,
      rows.map(function (row) {
        return row.count;
      }).concat([1])
    );

    grid.innerHTML = rows.map(function (row) {
      var rank = ranks[row.code];
      var width = row.count > 0
        ? Math.max(
            3,
            Math.round((row.count / maximum) * 100)
          )
        : 0;
      var share = total > 0
        ? ((row.count / total) * 100).toFixed(1)
        : "0.0";
      var className = rank <= 3 ? " top-" + rank : "";

      return '<article class="card' + className + '">' +
        '<div class="card-head"><div class="language">' +
        '<img class="flag" src="https://flagcdn.com/w80/' +
        row.flag + '.png" alt="" loading="eager">' +
        '<div class="language-copy"><span class="native">' +
        row.native + '</span><span class="zh-name">' +
        row.name + '</span></div></div>' +
        '<span class="rank">#' + rank + '</span></div>' +
        '<div class="count">' + number(row.count) + '</div>' +
        metrics(row.registerCount, row.purchaseCount) +
        '<div class="bottom"><div class="bar">' +
        '<span style="width:' + width + '%"></span></div>' +
        '<span class="share">' + share + '%</span></div>' +
        '</article>';
    }).join("");

    totalEl.textContent = number(total);
  }

  function status(text, state) {
    statusEl.textContent = text;
    statusDot.classList.remove("live", "error");
    if (state) statusDot.classList.add(state);
  }

  async function load() {
    if (loading) return;
    loading = true;
    secondsUntilRefresh =
      Math.ceil(REFRESH_INTERVAL_MS / 1000);
    refreshBtn.disabled = true;
    errorEl.hidden = true;

    var settings = config();
    if (!configured(settings)) {
      status("尚未設定 Worker", "error");
      totalEl.textContent = "—";
      loadingCards();
      errorEl.textContent =
        "尚未設定 Cloudflare Worker 網址。";
      errorEl.hidden = false;
      loading = false;
      refreshBtn.disabled = false;
      return;
    }

    status("正在更新…", "");

    try {
      var response = await fetch(
        settings.apiBase +
        "/stats?siteKey=" +
        encodeURIComponent(settings.siteKey) +
        "&_=" + Date.now(),
        {
          method:"GET",
          mode:"cors",
          cache:"no-store",
          credentials:"omit"
        }
      );

      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }

      var data = await response.json();
      var visits = data.languages || {};
      var registers = data.registrationClicks || {};
      var purchases = data.memberPurchaseClicks || {};

      var calculated = LANGUAGES.reduce(
        function (sum, lang) {
          return sum + (Number(visits[lang.code]) || 0);
        },
        0
      );
      var total = Number(data.total);
      if (!Number.isFinite(total)) total = calculated;

      render(visits, registers, purchases, total);

      updatedEl.textContent =
        "最後更新：" +
        new Intl.DateTimeFormat("zh-TW", {
          hour:"2-digit",
          minute:"2-digit",
          second:"2-digit",
          hour12:false
        }).format(new Date());

      status("即時連線中", "live");
    } catch (error) {
      console.error(error);
      status("連線失敗", "error");
      errorEl.textContent =
        "無法讀取 Analytics V2，將在 5 秒後重試。";
      errorEl.hidden = false;
    } finally {
      loading = false;
      refreshBtn.disabled = false;
    }
  }

  function fullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .catch(function () {});
    } else {
      document.exitFullscreen().catch(function () {});
    }
  }

  refreshBtn.addEventListener("click", load);
  fullscreenBtn.addEventListener("click", fullscreen);

  document.addEventListener(
    "fullscreenchange",
    function () {
      fullscreenBtn.textContent =
        document.fullscreenElement ? "✕" : "⛶";
      fullscreenBtn.title =
        document.fullscreenElement
          ? "離開全螢幕"
          : "切換全螢幕";
    }
  );

  function countdown() {
    if (loading) {
      countdownEl.textContent = "正在更新…";
      return;
    }

    countdownEl.textContent =
      "下次更新 " + secondsUntilRefresh + " 秒";
    secondsUntilRefresh -= 1;

    if (secondsUntilRefresh < 0) {
      secondsUntilRefresh =
        Math.ceil(REFRESH_INTERVAL_MS / 1000);
    }
  }

  loadingCards();
  updateClock();
  countdown();
  load();

  window.setInterval(updateClock, 1000);
  window.setInterval(countdown, 1000);
  window.setInterval(function () {
    secondsUntilRefresh =
      Math.ceil(REFRESH_INTERVAL_MS / 1000);
    load();
  }, REFRESH_INTERVAL_MS);

  document.addEventListener(
    "visibilitychange",
    function () {
      if (!document.hidden) {
        secondsUntilRefresh =
          Math.ceil(REFRESH_INTERVAL_MS / 1000);
        load();
      }
    }
  );
})();
