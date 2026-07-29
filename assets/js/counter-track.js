(function () {
  "use strict";

  var LANGUAGES = Object.freeze([
    "zh-tw", "zh-cn", "en", "ja", "ko", "ms", "th", "vi",
    "id", "ru", "my", "hi", "mn", "km", "lo"
  ]);
  var LANGUAGE_SET = new Set(LANGUAGES);

  var current = document.currentScript;
  var declaredPath = current && current.dataset
    ? String(current.dataset.akgPath || "")
    : "";

  var pathname = String(window.location.pathname || "/").toLowerCase();
  var pathMatch = pathname.match(/^\/([a-z0-9-]+)(?:\/|$)/i);
  var actualLanguage = pathMatch ? String(pathMatch[1]).toLowerCase() : "";
  var actualPath = LANGUAGE_SET.has(actualLanguage)
    ? "/" + actualLanguage + "/"
    : "";

  /*
   * Use the real browser URL as the source of truth.
   * The data attribute remains as a readable per-page declaration, but a
   * copied or stale value can no longer send another language's visit count.
   */
  var path = actualPath || declaredPath;

  if (
    actualPath &&
    declaredPath &&
    actualPath !== declaredPath.toLowerCase()
  ) {
    console.warn(
      "AKG visitor counter: page declaration did not match the current URL; "
      + "using " + actualPath + " instead of " + declaredPath + "."
    );
  }

  var config = window.AKG_COUNTER || {};
  var apiBase = String(config.apiBase || "").trim().replace(/\/+$/, "");
  var siteKey = String(config.siteKey || "vipyctmall-mall").trim();

  if (!/^\/[a-z0-9-]+\/$/i.test(path)) {
    console.warn("AKG visitor counter: invalid or missing language path.");
    return;
  }

  var language = path.slice(1, -1).toLowerCase();
  if (!LANGUAGE_SET.has(language)) {
    console.warn("AKG visitor counter: unsupported language.");
    return;
  }

  if (
    !/^https:\/\//i.test(apiBase) ||
    apiBase.indexOf("REPLACE-WITH-") !== -1
  ) {
    console.info(
      "AKG visitor counter is not configured. "
      + "Edit assets/js/counter-config.js."
    );
    return;
  }

  function randomId() {
    if (
      window.crypto &&
      typeof window.crypto.randomUUID === "function"
    ) {
      return window.crypto.randomUUID();
    }

    var bytes = new Uint8Array(16);
    if (
      window.crypto &&
      typeof window.crypto.getRandomValues === "function"
    ) {
      window.crypto.getRandomValues(bytes);
      return Array.prototype.map.call(bytes, function (value) {
        return value.toString(16).padStart(2, "0");
      }).join("");
    }

    return (
      "v-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).slice(2, 14)
    );
  }

  function getVisitorId() {
    var key = "akgVisitorIdV1";

    try {
      var existing = localStorage.getItem(key);
      if (
        existing &&
        /^[a-z0-9-]{16,80}$/i.test(existing)
      ) {
        return existing;
      }

      var created = randomId();
      localStorage.setItem(key, created);
      return created;
    } catch (error) {
      return randomId();
    }
  }

  var payload = {
    siteKey: siteKey,
    language: language,
    path: path,
    visitorId: getVisitorId()
  };

  fetch(apiBase + "/visit", {
    method: "POST",
    mode: "cors",
    cache: "no-store",
    credentials: "omit",
    keepalive: true,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }).catch(function (error) {
    console.warn("AKG visitor counter request failed:", error);
  });
})();
