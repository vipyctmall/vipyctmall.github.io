Vipyctmall 15語系訪客計數器修正版

原問題：15個語系首頁全部使用 data-akg-path="/zh-tw/"，因此所有訪問都被記入繁體中文。

本版修正：
1. 每個語系首頁都改為自己的路徑，例如英文 /en/、日文 /ja/、俄文 /ru/。
2. counter-track.js 會以瀏覽器實際網址為準；即使未來複製頁面時忘記修改 data-akg-path，也不會再被記到其他語系。
3. 更新JS版本號，避免瀏覽器或GitHub Pages快取舊腳本。
4. 保留Cloudflare Worker、D1、siteKey、驗證檔、SEO、favicon、Sitemap與整站360個多語系頁面。

注意：過去已誤記入繁中的歷史資料不會自動重新分類；本版部署後的新訪問會正確分流。
