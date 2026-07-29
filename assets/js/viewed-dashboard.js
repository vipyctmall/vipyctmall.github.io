(function () {
  "use strict";

  var LANGUAGES = [
    {code:"zh-tw",name:"繁體中文",native:"繁體中文",path:"/zh-tw/",flag:"tw"},
    {code:"zh-cn",name:"簡體中文",native:"简体中文",path:"/zh-cn/",flag:"cn"},
    {code:"en",name:"英文",native:"English",path:"/en/",flag:"us"},
    {code:"ja",name:"日文",native:"日本語",path:"/ja/",flag:"jp"},
    {code:"ko",name:"韓文",native:"한국어",path:"/ko/",flag:"kr"},
    {code:"ms",name:"馬來文",native:"Bahasa Melayu",path:"/ms/",flag:"my"},
    {code:"th",name:"泰文",native:"ภาษาไทย",path:"/th/",flag:"th"},
    {code:"vi",name:"越南文",native:"Tiếng Việt",path:"/vi/",flag:"vn"},
    {code:"id",name:"印尼文",native:"Bahasa Indonesia",path:"/id/",flag:"id"},
    {code:"ru",name:"俄文",native:"Русский",path:"/ru/",flag:"ru"},
    {code:"my",name:"緬甸文",native:"မြန်မာဘာသာ",path:"/my/",flag:"mm"},
    {code:"hi",name:"印地文",native:"हिन्दी",path:"/hi/",flag:"in"},
    {code:"mn",name:"蒙古文",native:"Монгол",path:"/mn/",flag:"mn"},
    {code:"km",name:"高棉文",native:"ភាសាខ្មែរ",path:"/km/",flag:"kh"},
    {code:"lo",name:"寮文",native:"ພາສາລາວ",path:"/lo/",flag:"la"}
  ];

  var tbody = document.getElementById("language-stats-body");
  var totalEl = document.getElementById("total-visits");
  var totalRegisterEl =
    document.getElementById("total-register-clicks");
  var totalPurchaseEl =
    document.getElementById("total-purchase-clicks");
  var statusEl = document.getElementById("stats-status");
  var updatedEl = document.getElementById("last-updated");
  var refreshBtn = document.getElementById("refresh-stats");
  var resetBtn = document.getElementById("reset-stats");
  var configPanel = document.getElementById("config-warning");
  var resetModal = document.getElementById("reset-modal");
  var tokenInput = document.getElementById("reset-token");
  var resetMessage = document.getElementById("reset-message");
  var cancelBtn = document.getElementById("cancel-reset");
  var confirmBtn = document.getElementById("confirm-reset");
  var lastFocus = null;

  function settings() {
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

  function rowsHtml(rows, total) {
    var maximum = Math.max.apply(
      null,
      rows.map(function (row) {
        return row.count;
      }).concat([1])
    );

    tbody.innerHTML = rows.map(function (row, index) {
      var width = Math.max(
        row.count > 0 ? 2 : 0,
        Math.round((row.count / maximum) * 100)
      );
      var share = total > 0
        ? ((row.count / total) * 100).toFixed(1)
        : "0.0";

      return '<tr>' +
        '<td class="rank">' + (index + 1) + '</td>' +
        '<td><div class="language-cell">' +
        '<img src="https://flagcdn.com/w40/' + row.flag +
        '.png" alt="" width="30" height="21" loading="lazy">' +
        '<div><strong>' + row.native + '</strong><small>' +
        row.name + '</small></div></div></td>' +
        '<td><a href="' + row.path +
        '" target="_blank" rel="noopener">' +
        row.path + '</a></td>' +
        '<td class="count">' + number(row.count) + '</td>' +
        '<td class="count">' +
        number(row.registerCount) + '</td>' +
        '<td class="count">' +
        number(row.purchaseCount) + '</td>' +
        '<td class="share">' + share + '%</td>' +
        '<td><div class="bar-track"><span style="width:' +
        width + '%"></span></div></td></tr>';
    }).join("");

    totalEl.textContent = number(total);
  }

  function skeleton(label) {
    tbody.innerHTML = LANGUAGES.map(function (lang, index) {
      return '<tr><td class="rank">' + (index + 1) +
        '</td><td><div class="language-cell">' +
        '<img src="https://flagcdn.com/w40/' + lang.flag +
        '.png" alt="" width="30" height="21">' +
        '<div><strong>' + lang.native + '</strong><small>' +
        lang.name + '</small></div></div></td>' +
        '<td>' + lang.path + '</td>' +
        '<td class="count">' + label + '</td>' +
        '<td>—</td><td>—</td><td>—</td>' +
        '<td><div class="bar-track"></div></td></tr>';
    }).join("");
  }

  async function load() {
    var config = settings();

    if (!configured(config)) {
      configPanel.hidden = false;
      statusEl.textContent = "尚未設定 Cloudflare Worker";
      totalEl.textContent = "—";
      totalRegisterEl.textContent = "—";
      totalPurchaseEl.textContent = "—";
      resetBtn.disabled = true;
      skeleton("尚未設定");
      return;
    }

    configPanel.hidden = true;
    refreshBtn.disabled = true;
    resetBtn.disabled = true;
    statusEl.textContent = "正在讀取 Analytics V2…";
    skeleton("載入中…");

    try {
      var response = await fetch(
        config.apiBase + "/stats?siteKey=" +
        encodeURIComponent(config.siteKey) +
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

      var rows = LANGUAGES.map(function (lang) {
        return Object.assign({}, lang, {
          count:Number(visits[lang.code]) || 0,
          registerCount:Number(registers[lang.code]) || 0,
          purchaseCount:Number(purchases[lang.code]) || 0
        });
      });

      var total = Number(data.total);
      if (!Number.isFinite(total)) {
        total = rows.reduce(function (sum, row) {
          return sum + row.count;
        }, 0);
      }

      var totalRegisters =
        Number(data.totalRegistrationClicks);
      if (!Number.isFinite(totalRegisters)) {
        totalRegisters = rows.reduce(function (sum, row) {
          return sum + row.registerCount;
        }, 0);
      }

      var totalPurchases =
        Number(data.totalMemberPurchaseClicks);
      if (!Number.isFinite(totalPurchases)) {
        totalPurchases = rows.reduce(function (sum, row) {
          return sum + row.purchaseCount;
        }, 0);
      }

      rowsHtml(rows, total);
      totalRegisterEl.textContent = number(totalRegisters);
      totalPurchaseEl.textContent = number(totalPurchases);
      statusEl.textContent =
        "15 語系頁面開啟與轉換點擊已載入";
      updatedEl.textContent =
        new Intl.DateTimeFormat("zh-TW", {
          dateStyle:"medium",
          timeStyle:"medium"
        }).format(new Date());
    } catch (error) {
      console.error(error);
      statusEl.textContent =
        "讀取失敗，請確認 Worker 已升級 Analytics V2";
      totalEl.textContent = "—";
      totalRegisterEl.textContent = "—";
      totalPurchaseEl.textContent = "—";
      skeleton("讀取失敗");
    } finally {
      refreshBtn.disabled = false;
      resetBtn.disabled = false;
    }
  }

  function openReset() {
    if (!configured(settings())) {
      statusEl.textContent = "尚未設定 Worker";
      return;
    }

    lastFocus = document.activeElement;
    tokenInput.value = "";
    resetMessage.textContent = "";
    confirmBtn.disabled = false;
    cancelBtn.disabled = false;
    resetModal.hidden = false;
    document.body.style.overflow = "hidden";
    window.setTimeout(function () {
      tokenInput.focus();
    }, 0);
  }

  function closeReset() {
    if (confirmBtn.disabled) return;
    tokenInput.value = "";
    resetMessage.textContent = "";
    resetModal.hidden = true;
    document.body.style.overflow = "";

    if (
      lastFocus &&
      typeof lastFocus.focus === "function"
    ) {
      lastFocus.focus();
    }
  }

  async function resetAll() {
    var config = settings();
    var token = tokenInput.value.trim();

    if (!token) {
      resetMessage.textContent = "請輸入 RESET_TOKEN。";
      tokenInput.focus();
      return;
    }

    confirmBtn.disabled = true;
    cancelBtn.disabled = true;
    resetMessage.textContent =
      "正在清除頁面開啟與點擊統計…";

    try {
      var response = await fetch(
        config.apiBase + "/admin/reset",
        {
          method:"POST",
          mode:"cors",
          cache:"no-store",
          credentials:"omit",
          headers:{
            "Authorization":"Bearer " + token,
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            siteKey:config.siteKey
          })
        }
      );

      var data = await response.json().catch(function () {
        return {};
      });

      if (!response.ok || !data.ok) {
        if (response.status === 401) {
          throw new Error("RESET_TOKEN 錯誤。");
        }
        throw new Error(
          "歸零失敗（HTTP " + response.status + "）。"
        );
      }

      resetMessage.textContent =
        "歸零成功，正在重新載入…";

      window.setTimeout(async function () {
        resetModal.hidden = true;
        document.body.style.overflow = "";
        confirmBtn.disabled = false;
        cancelBtn.disabled = false;
        await load();
      }, 450);
    } catch (error) {
      resetMessage.textContent =
        error && error.message
          ? error.message
          : "歸零失敗。";
      confirmBtn.disabled = false;
      cancelBtn.disabled = false;
      tokenInput.select();
    }
  }

  refreshBtn.addEventListener("click", load);
  resetBtn.addEventListener("click", openReset);
  cancelBtn.addEventListener("click", closeReset);
  confirmBtn.addEventListener("click", resetAll);

  tokenInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") resetAll();
  });

  resetModal.addEventListener("click", function (event) {
    if (event.target === resetModal) closeReset();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !resetModal.hidden) {
      closeReset();
    }
  });

  load();
})();
