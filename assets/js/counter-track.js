(function () {
  "use strict";

  var LANGUAGES = Object.freeze([
    "zh-tw", "zh-cn", "en", "ja", "ko", "ms", "th", "vi",
    "id", "ru", "my", "hi", "mn", "km", "lo"
  ]);
  var LANGUAGE_SET = new Set(LANGUAGES);
  var pathname = String(window.location.pathname || "/");
  var match = pathname.toLowerCase().match(
    /^\/([a-z0-9-]+)(?:\/|$)/i
  );
  var language = match ? String(match[1]).toLowerCase() : "";

  if (!LANGUAGE_SET.has(language)) {
    return;
  }

  var config = window.AKG_COUNTER || {};
  var apiBase = String(config.apiBase || "")
    .trim()
    .replace(/\/+$/, "");
  var siteKey = String(
    config.siteKey || "vipyctmall-mall"
  ).trim();

  if (
    !/^https:\/\//i.test(apiBase) ||
    apiBase.indexOf("REPLACE-WITH-") !== -1 ||
    !/^[a-z0-9-]+$/i.test(siteKey)
  ) {
    console.info("AKG analytics is not configured.");
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
      return Array.prototype.map.call(
        bytes,
        function (value) {
          return value.toString(16).padStart(2, "0");
        }
      ).join("");
    }

    return (
      "e-" +
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

  var visitorId = getVisitorId();

  function sendEvent(eventType) {
    var payload = {
      siteKey: siteKey,
      language: language,
      path: pathname,
      eventType: eventType,
      visitorId: visitorId,
      eventId: randomId(),
      createdAt: Date.now()
    };

    fetch(apiBase + "/event", {
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
      console.warn("AKG analytics event failed:", error);
    });
  }

  function classifyAction(anchor) {
    if (!anchor || !anchor.href) {
      return "";
    }

    var target;
    try {
      target = new URL(anchor.href, window.location.href);
    } catch (error) {
      return "";
    }

    var hostname = target.hostname.toLowerCase();
    var targetPath = target.pathname.toLowerCase();

    if (
      hostname === "point.vipyct.com" &&
      targetPath === "/login"
    ) {
      return "register_click";
    }

    if (
      (
        hostname === "www.vipyct.com" ||
        hostname === "vipyct.com"
      ) &&
      /^#\/category(?:\?|$)/i.test(target.hash) &&
      /(?:^|[?&])categoryid=1025(?:&|$)/i.test(
        target.hash
      )
    ) {
      return "member_purchase_click";
    }

    return "";
  }

  // Every opened page under the language folder counts.
  sendEvent("page_view");

  // Existing buttons and layouts remain untouched.
  document.addEventListener(
    "click",
    function (event) {
      var element = event.target;
      if (
        !element ||
        typeof element.closest !== "function"
      ) {
        return;
      }

      var anchor = element.closest("a[href]");
      var eventType = classifyAction(anchor);
      if (eventType) {
        sendEvent(eventType);
      }
    },
    true
  );
})();
