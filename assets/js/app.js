/* 플레이션 가챠샵 — 공통 스크립트 */
(function () {
  "use strict";
  var C = window.PLT || {};
  C.brand = C.brand || {}; C.store = C.store || {}; C.contact = C.contact || {}; C.links = C.links || {};
  C.features = C.features || {}; C.endpoints = C.endpoints || {}; C.business = C.business || {}; C.analytics = C.analytics || {};

  /* ---------- 작은 도우미 ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); };
  var get = function (obj, path) { return path.split(".").reduce(function (o, k) { return (o && o[k] !== undefined) ? o[k] : undefined; }, obj); };
  var won = function (n) { return (typeof n === "number") ? n.toLocaleString("ko-KR") + "원" : (n || "가격 확인 중"); };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var KST = function (d) { // 한국 시간 기준 부분값
    try { var f = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit", weekday: "short", hour12: false }); var o = {}; f.formatToParts(d).forEach(function (x) { o[x.type] = x.value; }); return o; }
    catch (e) { return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(), hour: pad(d.getHours()), minute: pad(d.getMinutes()), weekday: ["일", "월", "화", "수", "목", "금", "토"][d.getDay()] }; }
  };
  var fmtDateTime = function (iso) {
    if (!iso) return "";
    var d = new Date(iso); if (isNaN(d)) return iso;
    var k = KST(d); return parseInt(k.month, 10) + "월 " + parseInt(k.day, 10) + "일 " + (k.hour === "24" ? "00" : k.hour) + ":" + k.minute;
  };
  var fmtDate = function (iso) {
    if (!iso) return "";
    var d = new Date(iso + (iso.length === 10 ? "T00:00:00+09:00" : "")); if (isNaN(d)) return iso;
    var k = KST(d); return k.year + "." + pad(parseInt(k.month, 10)) + "." + pad(parseInt(k.day, 10)) + " (" + String(k.weekday).replace("요일", "") + ")";
  };
  var hoursSince = function (iso) { if (!iso) return Infinity; var d = new Date(iso); if (isNaN(d)) return Infinity; return (Date.now() - d.getTime()) / 36e5; };
  var param = function (k) { var m = new RegExp("[?&]" + k + "=([^&]*)").exec(location.search); return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : ""; };

  /* 캡슐 그림 (사진이 없을 때) */
  function capsuleSvg(color, label) {
    color = color || "#FFD447";
    return '<svg viewBox="0 0 200 200" role="img" aria-label="' + esc(label || "캡슐 그림") + '" xmlns="http://www.w3.org/2000/svg">' +
      '<rect width="200" height="200" fill="#F4F3F0"/>' +
      '<circle cx="100" cy="104" r="58" fill="' + color + '"/>' +
      '<path d="M42 104a58 58 0 0 1 116 0z" fill="#ffffff" fill-opacity="0.92"/>' +
      '<path d="M42 104h116" stroke="#171A20" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="100" cy="104" r="58" fill="none" stroke="#171A20" stroke-width="4"/>' +
      '<circle cx="78" cy="78" r="9" fill="#ffffff" fill-opacity="0.9"/>' +
      '<path d="M86 134q14 10 28 0" stroke="#171A20" stroke-width="4" stroke-linecap="round" fill="none"/>' +
      '</svg>';
  }

  /* 상품 상태 */
  var STALE_HOURS = 24;
  function statusInfo(p) {
    var stale = hoursSince(p.checkedAt) > STALE_HOURS;
    if (p.status === "soldout") return { key: "soldout", label: "품절", cls: "tag--red", note: "현재 이 상품은 품절로 안내 중입니다. 재입고 일정은 확정되면 공지합니다." };
    if (p.status === "check" || stale) return { key: "check", label: stale ? "확인 오래됨" : "확인 필요", cls: "tag--gray", note: stale ? "마지막 확인 후 시간이 지났어요. 방문 전 매장에 확인해 주세요." : "최근 판매 상태를 확인하고 있어요. 방문 전 문의해 주세요." };
    return { key: "sale", label: "판매중", cls: "tag--green", note: fmtDateTime(p.checkedAt) + "에 매장에서 확인했어요. 방문 시에는 판매가 끝났을 수 있어요." };
  }
  function parseLoc(code) {
    var m = /^([A-Z])-?(\d{1,2})-?(\d)$/i.exec(String(code || "").trim());
    if (!m) return null;
    return { zone: m[1].toUpperCase(), col: parseInt(m[2], 10), row: parseInt(m[3], 10), code: m[1].toUpperCase() + "-" + pad(parseInt(m[2], 10)) + "-" + m[3] };
  }

  /* ---------- 설정값을 화면에 꽂기 ---------- */
  function bindConfig() {
    $$("[data-plt]").forEach(function (el) {
      var v = get(C, el.getAttribute("data-plt"));
      var fallback = el.getAttribute("data-fallback");
      if (v !== undefined && v !== null && v !== "") { el.textContent = v; el.classList.remove("tbd"); }
      else if (fallback !== null) { el.textContent = fallback; el.classList.add("tbd"); }
    });
    $$("[data-plt-if]").forEach(function (el) {
      var v = get(C, el.getAttribute("data-plt-if"));
      el.classList.toggle("hidden", !v);
    });
    $$("[data-plt-href]").forEach(function (el) {
      var v = get(C, el.getAttribute("data-plt-href"));
      if (v) { el.setAttribute("href", v); el.classList.remove("is-off"); el.removeAttribute("aria-disabled"); }
      else {
        el.classList.add("is-off"); el.setAttribute("aria-disabled", "true"); el.removeAttribute("href");
        var off = el.getAttribute("data-off-text"); if (off) { var t = $(".t", el); if (t) t.textContent = off; }
      }
    });
    // 길찾기 링크
    var q = encodeURIComponent(C.store.mapQuery || C.store.address || "");
    $$("[data-map='naver']").forEach(function (a) { a.href = "https://map.naver.com/p/search/" + q; });
    $$("[data-map='kakao']").forEach(function (a) { a.href = "https://map.kakao.com/?q=" + q; });
    $$("[data-map='google']").forEach(function (a) { a.href = "https://www.google.com/maps/search/?api=1&query=" + q; });
    $$("[data-copy-address]").forEach(function (b) {
      b.addEventListener("click", function () {
        var text = (C.store.address || "") + (C.store.building ? " " + C.store.building : "");
        var done = function () { b.textContent = "주소를 복사했어요"; setTimeout(function () { b.textContent = "주소 복사"; }, 2000); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () { window.prompt("주소를 복사하세요", text); });
        else window.prompt("주소를 복사하세요", text);
      });
    });
    // 전화
    $$("[data-tel]").forEach(function (a) { if (C.contact.phone) a.href = "tel:" + C.contact.phone.replace(/[^0-9+]/g, ""); });
  }

  /* ---------- 공지 띠 ---------- */
  function noticeBar() {
    var host = $("#notice-bar"); if (!host) return;
    var list = window.PLT_NOTICES || [];
    var n = list.filter(function (x) { return x.bar; })[0];
    if (!n) return;
    try { if (sessionStorage.getItem("plt-notice-" + n.id) === "1") return; } catch (e) { }
    host.innerHTML = '<div class="container"><p>' + esc(n.barText || n.title) + ' <a href="notices.html">자세히</a></p><button type="button" aria-label="공지 닫기">×</button></div>';
    host.classList.remove("hidden");
    $("button", host).addEventListener("click", function () { host.classList.add("hidden"); try { sessionStorage.setItem("plt-notice-" + n.id, "1"); } catch (e) { } });
  }

  /* ---------- 푸터 사업자 정보 ---------- */
  function footerBiz() {
    var el = $("#biz-line"); if (!el) return;
    var b = C.business, parts = [];
    if (b.company) parts.push("<span>" + esc(b.company) + "</span>");
    if (b.ceo) parts.push("<span>대표 " + esc(b.ceo) + "</span>");
    if (b.regNo) parts.push("<span>사업자등록번호 " + esc(b.regNo) + "</span>");
    if (b.address) parts.push("<span>" + esc(b.address) + "</span>");
    if (C.contact.phone) parts.push("<span>문의 " + esc(C.contact.phone) + "</span>");
    if (C.contact.email) parts.push("<span>" + esc(C.contact.email) + "</span>");
    el.innerHTML = parts.join(" <span aria-hidden='true'>|</span> ") + "<br>© " + new Date().getFullYear() + " PLAYTION. 상품 사진과 캐릭터의 권리는 각 공급사에 있습니다.";
  }

  /* ---------- 오픈 D-day ---------- */
  function dday() {
    var el = $("#dday"); if (!el) return;
    if (!C.store.openDate) { el.classList.add("hidden"); return; }
    var open = new Date(C.store.openDate + "T00:00:00+09:00"); if (isNaN(open)) { el.classList.add("hidden"); return; }
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var diff = Math.round((open - today) / 864e5);
    var txt = diff > 0 ? "오픈까지 <b>D-" + diff + "</b>" : diff === 0 ? "<b>오늘 오픈</b>" : "<b>OPEN</b> " + fmtDate(C.store.openDate) + " 영업 시작";
    el.innerHTML = txt; el.classList.remove("hidden");
  }

  /* ---------- 검색엔진용 매장 정보 (확정된 값만) ---------- */
  function jsonLd() {
    var data = {
      "@context": "https://schema.org", "@type": "Store",
      "name": C.brand.name || "플레이션 가챠샵",
      "image": (C.siteUrl || "") + "/assets/img/store-front.webp",
      "address": { "@type": "PostalAddress", "streetAddress": C.store.address || "", "addressLocality": "광진구", "addressRegion": "서울특별시", "addressCountry": "KR" },
      "url": C.siteUrl || location.origin
    };
    if (C.contact.phone) data.telephone = C.contact.phone;
    var s = document.createElement("script"); s.type = "application/ld+json"; s.textContent = JSON.stringify(data); document.head.appendChild(s);
  }

  /* ---------- 분석 도구 (ID가 있을 때만, 개인정보 미전송) ---------- */
  function analytics() {
    if (C.analytics.ga4) {
      var g = document.createElement("script"); g.async = true; g.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(C.analytics.ga4); document.head.appendChild(g);
      window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date()); window.gtag("config", C.analytics.ga4, { anonymize_ip: true });
    }
    if (C.analytics.metaPixel) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", C.analytics.metaPixel); window.fbq("track", "PageView");
    }
  }
  function track(name, params) { try { if (window.gtag) window.gtag("event", name, params || {}); } catch (e) { } }

  /* ---------- 현재 메뉴 표시 ---------- */
  function activeNav() {
    var page = document.body.getAttribute("data-page");
    $$("a[data-nav]").forEach(function (a) { if (a.getAttribute("data-nav") === page) a.setAttribute("aria-current", "page"); });
  }

  /* ---------- 전송 도우미 ---------- */
  function postJSON(url, data) {
    return fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) throw Object.assign(new Error("HTTP " + r.status), { body: j }); return j; }); });
  }
  function contactLinksHtml() {
    var out = [];
    if (C.contact.kakao) out.push('<a class="btn btn--yellow btn--sm" href="' + esc(C.contact.kakao) + '" target="_blank" rel="noopener">카카오톡 채널로 문의</a>');
    if (C.contact.phone) out.push('<a class="btn btn--outline btn--sm" href="tel:' + esc(C.contact.phone.replace(/[^0-9+]/g, "")) + '">전화 ' + esc(C.contact.phone) + '</a>');
    if (C.contact.email) out.push('<a class="btn btn--outline btn--sm" href="mailto:' + esc(C.contact.email) + '">메일 문의</a>');
    if (C.contact.instagram) out.push('<a class="btn btn--outline btn--sm" href="' + esc(C.contact.instagram) + '" target="_blank" rel="noopener">인스타그램</a>');
    return out.join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    bindConfig(); noticeBar(); footerBiz(); dday(); jsonLd(); activeNav(); analytics();
    document.dispatchEvent(new CustomEvent("plt:ready"));
  });

  window.PLTX = { C: C, $: $, $$: $$, esc: esc, get: get, won: won, pad: pad, fmtDate: fmtDate, fmtDateTime: fmtDateTime, hoursSince: hoursSince, param: param, capsuleSvg: capsuleSvg, statusInfo: statusInfo, parseLoc: parseLoc, postJSON: postJSON, contactLinksHtml: contactLinksHtml, track: track, STALE_HOURS: STALE_HOURS };
})();
