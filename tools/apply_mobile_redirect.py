#!/usr/bin/env python3
from pathlib import Path
import re

LANGUAGES = ["zh-tw","zh-cn","en","ja","ko","ms","th","vi","id","ru","my","hi","mn","km","lo"]
SCRIPT = r'''
<script id="mobile-page-redirect">
(() => {
  "use strict";

  function isPortraitLayout() {
    const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    return width > 0 && height > 0 && width < height;
  }

  function redirectToMobilePage() {
    // Explicitly selecting the full website is the only exception.
    if (new URLSearchParams(window.location.search).get("desktop") === "1") return;
    if (!isPortraitLayout()) return;
    if (window.location.pathname.toLowerCase().endsWith("/indexm.html")) return;
    window.location.replace("indexm.html");
  }

  redirectToMobilePage();
  window.addEventListener("pageshow", redirectToMobilePage);
  window.addEventListener("orientationchange", redirectToMobilePage);
  window.addEventListener("resize", redirectToMobilePage, { passive: true });
})();
</script>
'''

root = Path(__file__).resolve().parents[1]
updated=[]; skipped=[]; missing=[]
for lang in LANGUAGES:
    folder=root/lang
    index=folder/'index.html'
    mobile=folder/'indexm.html'
    if not index.exists():
        missing.append(f"{lang}/index.html")
        continue
    if not mobile.exists():
        skipped.append(f"{lang}: missing indexm.html")
        continue
    text=index.read_text(encoding='utf-8')
    text=re.sub(r'\s*<script id=["\']mobile-page-redirect["\']>.*?</script>\s*', '\n', text, flags=re.S|re.I)
    if '<head>' not in text:
        skipped.append(f"{lang}: <head> not found")
        continue
    text=text.replace('<head>', '<head>\n'+SCRIPT, 1)
    index.write_text(text, encoding='utf-8')
    updated.append(lang)

print('Updated:', ', '.join(updated) if updated else 'none')
if skipped: print('Skipped:', '; '.join(skipped))
if missing: print('Not found:', ', '.join(missing))
input('\nPress Enter to close...')
