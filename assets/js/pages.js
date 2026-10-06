/* 플레이션 가챠샵 — 화면별 스크립트 */
(function () {
  "use strict";
  document.addEventListener("plt:ready", function () {
    var X = window.PLTX, C = X.C, $ = X.$, $$ = X.$$, esc = X.esc;
    var P = window.PLT_PRODUCTS || { items: [], zones: {}, priceBands: [] };
    var E = window.PLT_EVENTS || { items: [], weeks: [] };
    var S = window.PLT_STORIES || { items: [] };
    var N = window.PLT_NOTICES || [];
    var page = document.body.getAttribute("data-page");

    /* ======================= 공통 조각 ======================= */
    function productCard(p) {
      var st = X.statusInfo(p);
      var img = p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy">' : X.capsuleSvg(p.color, p.name + " 캡슐 그림");
      return '<a class="product' + (st.key === "soldout" ? " product--soldout" : "") + '" href="product.html?id=' + encodeURIComponent(p.id) + '">' +
        '<div class="product__img">' + img + '<span class="tag ' + st.cls + '">' + st.label + '</span>' + (p.sample ? '<span class="sample">예시</span>' : "") + '</div>' +
        '<p class="product__series">' + esc(p.series || "") + '</p>' +
        '<h3 class="product__name">' + esc(p.name) + '</h3>' +
        '<div class="product__meta"><span class="product__price">' + X.won(p.price) + '</span><span class="product__loc">' + esc(p.loc) + '</span></div>' +
        '<p class="product__checked">' + (p.checkedAt ? X.fmtDateTime(p.checkedAt) + " 확인" : "확인 시각 없음") + '</p>' +
        '</a>';
    }
    var STATUS = {
      planned: { label: "일정 확정 후 모집", cls: "tag--gray" }, open: { label: "모집중", cls: "tag--green" }, waitlist: { label: "대기 접수", cls: "tag--blue" },
      full: { label: "정원 마감", cls: "tag--red" }, closed: { label: "모집 마감", cls: "tag--gray" }, ended: { label: "종료", cls: "tag--gray" }
    };
    function eventTicket(ev) {
      var st = STATUS[ev.status] || STATUS.planned;
      var tbd = !ev.date;
      var dateBox = tbd ? '<span class="tbd">일정<br>확정 후<br>공지</span>' : (function () { var k = X.fmtDate(ev.date).split(" "); var md = k[0].split("."); return '<span class="m">' + parseInt(md[1], 10) + '월</span><span class="d">' + parseInt(md[2], 10) + '</span><span class="m">' + k[1].replace(/[()]/g, "") + '요일</span>'; })();
      return '<a class="ticket' + (tbd ? " ticket--tbd" : "") + '" href="event.html?id=' + encodeURIComponent(ev.id) + '">' +
        '<div class="ticket__date">' + dateBox + '</div>' +
        '<div class="ticket__body"><span class="tag ' + st.cls + '">' + st.label + '</span><span class="tag tag--plain tag--gray" style="margin-left:6px">' + esc(ev.type) + '</span>' +
        '<h3>' + esc(ev.title) + '</h3><p>' + esc(ev.summary) + '</p>' +
        '<div class="ticket__meta"><span>' + esc(ev.place || "") + '</span><span>정원 ' + esc(ev.capacity) + '명</span><span>' + esc(ev.fee || "") + '</span></div></div></a>';
    }
    function storyFrame(s) {
      var img = s.image ? '<img src="' + esc(s.image) + '" alt="' + esc(s.alt || s.title) + '" loading="lazy">' : X.capsuleSvg("#FFD447", s.title);
      return '<a class="frame" href="story.html?id=' + encodeURIComponent(s.id) + '"><div class="frame__img">' + img + '</div>' +
        '<div class="frame__title">' + esc(s.title) + '</div>' +
        '<div class="frame__meta"><span>' + esc(s.author || "") + (s.isStaff ? ' <span class="op">운영자</span>' : "") + '</span><span>' + esc(s.category || "") + '</span></div></a>';
    }
    function emptyStories(host) {
      host.innerHTML = '<div class="empty"><strong>첫 전시를 준비하고 있어요</strong>이번 전시 주제는 ‘' + esc(S.currentTheme || "처음 좋아하게 된 것") + '’입니다. 수집품 사진 한 장과 좋아하는 이유를 들려주세요.' +
        '<div class="btn-row"><a class="btn btn--red btn--sm" href="event.html?id=exhibit-01">전시 참여 안내 보기</a></div></div>';
    }
    function storeMapSvg(activeZone, loc) {
      var zones = P.zones || {};
      var z = function (k, d) { return (zones[k] && zones[k].desc) || d; };
      var pin = "";
      if (loc && activeZone) {
        var cols = (zones[activeZone] && zones[activeZone].cols) || 20, t = Math.min(1, Math.max(0, (loc.col - 0.5) / cols));
        var pos = { A: [70, 150 + t * 260], B: [150 + t * 420, 70], C: [650, 150 + t * 260], D: [150 + t * 420, 470] }[activeZone];
        if (pos) pin = '<circle class="pin" cx="' + pos[0] + '" cy="' + pos[1] + '" r="12"/><circle cx="' + pos[0] + '" cy="' + pos[1] + '" r="5" fill="#fff"/>';
      }
      var zc = function (k) { return "zone-fill" + (activeZone === k ? " is-active" : ""); };
      return '<svg viewBox="0 0 720 540" role="img" aria-label="매장 구역 도식">' +
        '<rect x="20" y="20" width="680" height="500" rx="18" fill="#fff" stroke="#171A20" stroke-width="3"/>' +
        '<rect class="' + zc("B") + '" x="110" y="40" width="500" height="60" rx="8"/>' +
        '<rect class="' + zc("A") + '" x="40" y="110" width="60" height="340" rx="8"/>' +
        '<rect class="' + zc("C") + '" x="620" y="110" width="60" height="340" rx="8"/>' +
        '<rect class="' + zc("D") + '" x="110" y="440" width="500" height="60" rx="8"/>' +
        '<text class="zone-label" x="360" y="78" text-anchor="middle">B</text>' +
        '<text class="zone-label" x="70" y="286" text-anchor="middle">A</text>' +
        '<text class="zone-label" x="650" y="286" text-anchor="middle">C</text>' +
        '<text class="zone-label" x="360" y="478" text-anchor="middle">D</text>' +
        '<rect x="260" y="230" width="200" height="90" rx="10" fill="#FFF3C4" stroke="#C9C7C0" stroke-width="2"/>' +
        '<text class="zone-sub" x="360" y="268" text-anchor="middle">개봉대 · 최애 촬영소</text>' +
        '<text class="zone-sub" x="360" y="290" text-anchor="middle">(이동식 · 배치 확정 후 갱신)</text>' +
        '<text class="zone-sub" x="360" y="128" text-anchor="middle">' + esc(z("B", "안쪽 벽면")) + '</text>' +
        '<text class="zone-sub" x="360" y="428" text-anchor="middle">' + esc(z("D", "입구 앞")) + '</text>' +
        '<rect x="300" y="514" width="120" height="12" fill="#171A20"/><text class="zone-sub" x="360" y="536" text-anchor="middle" fill="#171A20">입구</text>' +
        pin + '</svg>';
    }
    function contactFallback(title) {
      var links = X.contactLinksHtml();
      return '<div class="result-box result-box--wait"><h3>' + esc(title) + '</h3>' +
        (links ? '<p>아래 채널에서 접수해 드려요.</p><div class="btn-row">' + links + '</div>' : '<p>접수 방법은 공지와 매장 안내판에서 알려드립니다.</p>') + '</div>';
    }

    /* ======================= 홈 ======================= */
    if (page === "home") {
      var pv = $("#home-products");
      if (pv) {
        var items = P.items.filter(function (p) { return p.status !== "soldout"; }).slice(0, 4);
        pv.innerHTML = items.map(productCard).join("") || '<div class="empty"><strong>소개 상품을 준비하고 있어요</strong>오픈과 함께 대표 상품을 소개합니다.</div>';
        if (items.some(function (p) { return p.sample; })) { var sn = $("#home-sample-note"); if (sn) sn.classList.remove("hidden"); }
      }
      var ev = $("#home-events");
      if (ev) {
        var list = E.items.filter(function (e) { return e.status !== "ended"; }).slice(0, 2);
        if (list.length) ev.innerHTML = list.map(eventTicket).join(""); else $("#home-events-section").classList.add("hidden");
      }
      var sf = $("#home-stories");
      if (sf) { var st = S.items.slice(0, 4); if (st.length) sf.innerHTML = '<div class="frames">' + st.map(storyFrame).join("") + '</div>'; else emptyStories(sf); }
    }

    /* ======================= 상품 목록 ======================= */
    if (page === "products") {
      var grid = $("#product-grid"), countEl = $("#result-count"), q = $("#q"), themeHost = $("#theme-chips"), ipHost = $("#ip-chips"), priceHost = $("#price-chips");
      var state = { q: X.param("q"), theme: X.param("theme"), ip: X.param("ip"), price: X.param("price") };
      var themes = ["가방에 달기", "책상 위 작은 장면", "친구와 함께 고르기", "처음 수집하기"];
      var ips = []; P.items.forEach(function (p) { if (p.ip && ips.indexOf(p.ip) < 0) ips.push(p.ip); });
      function chips(host, list, key, labelOf) {
        host.innerHTML = list.map(function (v) { var id = typeof v === "string" ? v : v.id; return '<button type="button" class="chip" data-v="' + esc(id) + '" aria-pressed="' + (state[key] === id) + '">' + esc(labelOf ? labelOf(v) : v) + '</button>'; }).join("");
        $$(".chip", host).forEach(function (b) { b.addEventListener("click", function () { state[key] = state[key] === b.getAttribute("data-v") ? "" : b.getAttribute("data-v"); render(); }); });
      }
      function render() {
        chips(themeHost, themes, "theme"); chips(ipHost, ips, "ip"); chips(priceHost, P.priceBands, "price", function (b) { return b.label; });
        var kw = state.q.trim().toLowerCase();
        var band = P.priceBands.filter(function (b) { return b.id === state.price; })[0];
        var out = P.items.filter(function (p) {
          if (kw && [p.name, p.series, p.ip, (p.aliases || []).join(" ")].join(" ").toLowerCase().indexOf(kw) < 0) return false;
          if (state.theme && (p.themes || []).indexOf(state.theme) < 0) return false;
          if (state.ip && p.ip !== state.ip) return false;
          if (band && !(p.price >= band.min && p.price <= band.max)) return false;
          return true;
        });
        countEl.textContent = out.length + "개";
        var active = [state.q && ("‘" + state.q + "’"), state.theme, state.ip, band && band.label].filter(Boolean).length;
        $("#filter-reset").classList.toggle("hidden", !active);
        if (out.length) grid.innerHTML = out.map(productCard).join("");
        else grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><strong>소개 중인 목록에서 찾지 못했어요</strong>다른 이름으로 찾아보거나 매장 취급 여부를 문의해 주세요. 목록에 없다고 품절은 아닙니다.<div class="btn-row"><button type="button" class="btn btn--outline btn--sm" id="empty-reset">조건 지우기</button><a class="btn btn--yellow btn--sm" href="help.html#inquiry">매장에 문의</a></div></div>';
        var er = $("#empty-reset"); if (er) er.addEventListener("click", reset);
        var qs = []; ["q", "theme", "ip", "price"].forEach(function (k) { if (state[k]) qs.push(k + "=" + encodeURIComponent(state[k])); });
        history.replaceState(null, "", location.pathname + (qs.length ? "?" + qs.join("&") : ""));
        $("#sample-note").classList.toggle("hidden", !P.items.some(function (p) { return p.sample; }));
      }
      function reset() { state = { q: "", theme: "", ip: "", price: "" }; q.value = ""; render(); }
      q.value = state.q;
      q.addEventListener("input", function () { state.q = q.value; render(); });
      $("#filter-reset").addEventListener("click", reset);
      $("#q-clear").addEventListener("click", function () { q.value = ""; state.q = ""; render(); q.focus(); });
      // 취향 찾기
      var tasteForm = $("#taste-form");
      function syncChips() { $$(".chip", tasteForm).forEach(function (l) { var i = $("input", l); l.classList.toggle("is-on", !!(i && i.checked)); }); }
      if (tasteForm) { syncChips(); tasteForm.addEventListener("change", syncChips); }
      if (tasteForm) tasteForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var t = tasteForm.scene.value, b = tasteForm.budget.value;
        state.theme = t; state.price = b; state.q = ""; q.value = ""; render();
        var band = P.priceBands.filter(function (x) { return x.id === b; })[0];
        var matches = P.items.filter(function (p) { return (p.themes || []).indexOf(t) >= 0 && (!band || (p.price >= band.min && p.price <= band.max)) && p.status !== "soldout"; });
        var zones = []; matches.forEach(function (p) { var l = X.parseLoc(p.loc); if (l && zones.indexOf(l.zone) < 0) zones.push(l.zone); });
        var r = $("#taste-result");
        r.innerHTML = matches.length ? '오늘의 추천: <span>' + esc(t) + '</span> ' + matches.length + '종. 먼저 둘러볼 구역은 <span>' + zones.sort().join(" · ") + '</span>구역이에요. 아래 목록을 그대로 들고 매장에 오세요.' : '이 조건에 맞는 소개 상품이 아직 없어요. 조건을 바꿔 보거나 매장에서 직접 둘러보세요.';
        r.classList.remove("hidden");
        X.track("taste_quiz", { scene: t, budget: b });
        grid.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      // 기기 번호로 찾기
      var locForm = $("#locate-form");
      if (locForm) locForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var raw = locForm.code.value, l = X.parseLoc(raw), msg = $("#locate-msg");
        if (!l) { msg.textContent = "구역-열-단 형식으로 입력해 주세요. 예) A-12-2"; msg.className = "hint"; msg.style.color = "var(--error)"; return; }
        var p = P.items.filter(function (x) { return X.parseLoc(x.loc) && X.parseLoc(x.loc).code === l.code; })[0];
        if (p) { location.href = "product.html?id=" + encodeURIComponent(p.id); return; }
        msg.style.color = ""; msg.innerHTML = l.code + " 기기의 상품 정보를 확인하고 있어요. 기기 앞 안내 라벨을 참고하시거나 <a href=\"help.html?machine=" + encodeURIComponent(l.code) + "#inquiry\">문의</a>해 주세요.";
      });
      render();
    }

    /* ======================= 상품 상세 ======================= */
    if (page === "product") {
      var id = X.param("id"), p = P.items.filter(function (x) { return x.id === id; })[0], host = $("#detail");
      if (!p) {
        host.innerHTML = '<div class="empty" style="grid-column:1/-1"><strong>지금 볼 수 없는 상품입니다</strong>목록에서 내려갔거나 주소가 바뀌었을 수 있어요.<div class="btn-row"><a class="btn btn--red btn--sm" href="products.html">상품 목록으로</a></div></div>';
        document.title = "지금 볼 수 없는 상품 | 플레이션 가챠샵";
      } else {
        document.title = p.name + " | 플레이션 가챠샵";
        var st = X.statusInfo(p), l = X.parseLoc(p.loc), zone = l && P.zones[l.zone];
        var img = p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(p.name) + '">' : X.capsuleSvg(p.color, p.name + " 캡슐 그림");
        host.innerHTML =
          '<div class="detail__img">' + img + '</div>' +
          '<div>' +
          '<p class="breadcrumb"><a href="products.html">상품</a> › ' + esc(p.ip || "") + '</p>' +
          '<p class="detail__series">' + esc(p.series || "") + (p.sample ? ' <span class="tag tag--plain tag--gray">예시 상품</span>' : "") + '</p>' +
          '<h1 class="detail__name">' + esc(p.name) + '</h1>' +
          '<div class="status-note"><span class="tag ' + st.cls + '">' + st.label + '</span><span>' + esc(st.note) + '</span></div>' +
          '<div class="facts"><div class="fact"><span class="fact__k">1회 가격</span><span class="fact__v">' + X.won(p.price) + '</span></div>' +
          '<div class="fact"><span class="fact__k">기기 위치</span><span class="fact__v loc">' + esc(p.loc) + '</span></div>' +
          '<div class="fact"><span class="fact__k">구역</span><span class="fact__v" style="font-size:1rem">' + (zone ? esc(zone.name + " · " + zone.desc) : "확인 중") + '</span></div>' +
          '<div class="fact"><span class="fact__k">결제</span><span class="fact__v" style="font-size:1rem">' + esc(C.store.payment || "현장 기기 결제 (확정 후 안내)") + '</span></div></div>' +
          (p.desc ? '<p>' + esc(p.desc) + '</p>' : "") +
          '<p class="fine">종류는 무작위로 나옵니다. 원하는 종류 선택이나 완성 세트는 보장되지 않아요. 상품 구성·대상 연령은 공급사 자료 기준입니다.</p>' +
          '<div class="btn-row mt-16"><a class="btn btn--red" href="#map">기기 위치 보기</a><button type="button" class="btn btn--outline" id="share-btn">공유하기</button><a class="btn btn--ghost" href="help.html?machine=' + encodeURIComponent(p.loc) + '&type=loc#inquiry">위치·가격 오류 알리기</a></div>' +
          '</div>';
        $("#map-host").innerHTML = storeMapSvg(l && l.zone, l);
        $("#map-code").innerHTML = l ? '<b>' + esc(l.code) + '</b><small>' + esc(l.zone) + '구역 ' + l.col + '열 ' + l.row + '단</small>' : "";
        $("#share-btn").addEventListener("click", function () {
          var url = location.href, b = this;
          if (navigator.share) navigator.share({ title: p.name + " | 플레이션 가챠샵", text: p.name + " — " + p.loc, url: url }).catch(function () { });
          else if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { b.textContent = "링크를 복사했어요"; setTimeout(function () { b.textContent = "공유하기"; }, 2000); });
        });
        var rel = P.items.filter(function (x) { return x.id !== p.id && x.series === p.series; }).slice(0, 4);
        if (rel.length) { $("#related-section").classList.remove("hidden"); $("#related").innerHTML = rel.map(productCard).join(""); }
      }
    }

    /* ======================= 행사 목록 ======================= */
    if (page === "events") {
      var elist = $("#event-list"), evs = E.items.filter(function (e) { return e.status !== "ended"; });
      elist.innerHTML = evs.length ? evs.map(eventTicket).join("") : '<div class="empty"><strong>공개된 행사가 아직 없어요</strong>첫 교환회와 전시는 오픈 후 2주차에 모집을 시작합니다.</div>';
      var past = E.items.filter(function (e) { return e.status === "ended"; });
      if (past.length) { $("#past-section").classList.remove("hidden"); $("#past-list").innerHTML = past.map(eventTicket).join(""); }
      var wk = $("#weeks");
      if (wk) wk.innerHTML = (E.weeks || []).map(function (w) { return '<li class="week"><div class="week__n">' + w.n + '주<small>WEEK</small></div><div><h3>' + esc(w.theme) + '</h3><p>현장: ' + esc(w.onsite) + '<br>온라인: ' + esc(w.online) + '</p></div></li>'; }).join("");
    }

    /* ======================= 행사 상세 + 신청 ======================= */
    if (page === "event") {
      var eid = X.param("id"), ev = E.items.filter(function (x) { return x.id === eid; })[0], eh = $("#event-host");
      if (!ev) {
        eh.innerHTML = '<div class="empty"><strong>지금 볼 수 없는 행사입니다</strong>종료되었거나 주소가 바뀌었을 수 있어요.<div class="btn-row"><a class="btn btn--red btn--sm" href="events.html">행사 목록으로</a></div></div>';
        document.title = "지금 볼 수 없는 행사 | 플레이션 가챠샵";
      } else {
        document.title = ev.title + " | 플레이션 가챠샵";
        var est = STATUS[ev.status] || STATUS.planned;
        eh.innerHTML =
          '<p class="breadcrumb"><a href="events.html">행사</a> › ' + esc(ev.type) + '</p>' +
          '<span class="tag ' + est.cls + '">' + est.label + '</span>' +
          '<h1>' + esc(ev.title) + '</h1><p class="muted" style="font-size:1.05rem;max-width:40em">' + esc(ev.summary) + '</p>' +
          '<ul class="kv">' +
          '<li><span class="k">일시</span><span class="v">' + (ev.date ? esc(X.fmtDate(ev.date)) + (ev.time ? " · " + esc(ev.time) : "") : "일정 확정 후 공지" + (ev.time ? " · " + esc(ev.time) : "")) + '</span></li>' +
          '<li><span class="k">장소</span><span class="v">' + esc(ev.place || "") + '</span></li>' +
          '<li><span class="k">대상</span><span class="v">' + esc(ev.target || "") + '</span></li>' +
          '<li><span class="k">정원</span><span class="v">' + esc(ev.capacity) + '명 (보호자 포함 현장 인원)</span></li>' +
          '<li><span class="k">참가비</span><span class="v">' + esc(ev.fee || "") + '</span></li>' +
          '<li><span class="k">준비물</span><span class="v">' + esc(ev.bring || "") + '</span></li>' +
          (ev.series ? '<li><span class="k">대상 품목</span><span class="v">' + esc(ev.series) + '</span></li>' : "") +
          '<li><span class="k">취소</span><span class="v">' + esc(ev.cancel || "") + '</span></li>' +
          '</ul>' +
          (ev.rules && ev.rules.length ? '<h2 style="font-size:1.2rem;margin:24px 0 10px">진행 규칙</h2><ul class="rule-list">' + ev.rules.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + '</ul>' : "") +
          (ev.note ? '<p class="form-note mt-16">' + esc(ev.note) + '</p>' : "");
        renderApply(ev);
      }
      function renderApply(ev) {
        var host = $("#apply-host"), title = $("#apply-title");
        if (ev.status === "ended") { host.innerHTML = '<div class="result-box"><h3>종료된 행사예요</h3><p>참여해 주셔서 고맙습니다. 다음 행사를 확인해 보세요.</p><div class="btn-row"><a class="btn btn--outline btn--sm" href="events.html">행사 목록</a></div></div>'; return; }
        if (ev.status === "planned") { host.innerHTML = '<div class="result-box result-box--wait"><h3>일정이 확정되면 여기서 모집을 시작해요</h3><p>모집 시작 소식은 공지와 매장 안내판, 카카오톡 채널에서 알려드립니다. 사전 신청이 12명 미만이면 날짜를 조정할 수 있어요.</p>' + (C.contact.kakao ? '<div class="btn-row"><a class="btn btn--yellow btn--sm" href="' + esc(C.contact.kakao) + '" target="_blank" rel="noopener">카카오톡 채널에서 소식 받기</a></div>' : "") + '</div>'; return; }
        if (ev.status === "closed") { host.innerHTML = '<div class="result-box"><h3>모집이 마감됐어요</h3><p>마감 후 취소·문의는 공지된 문의 채널로 연락해 주세요.</p><div class="btn-row">' + X.contactLinksHtml() + '</div></div>'; return; }
        if (ev.status === "full") { host.innerHTML = '<div class="result-box result-box--err"><h3>지금은 정원이 찼어요</h3><p>자리가 생기면 공지로 알려드립니다. 이번 회차의 촬영소와 전시는 신청 없이 즐길 수 있어요.</p></div>'; return; }
        if (ev.applyUrl) { host.innerHTML = '<div class="result-box result-box--wait"><h3>신청 화면으로 이동해 주세요</h3><p>회원가입 없이 신청할 수 있어요. 신청 확인과 변경 안내를 받을 이메일이 필요합니다.</p><div class="btn-row"><a class="btn btn--red" href="' + esc(ev.applyUrl) + '" target="_blank" rel="noopener">신청하기</a></div></div>'; return; }
        if (!C.endpoints.eventApply) { host.innerHTML = contactFallback("온라인 신청을 준비하고 있어요"); return; }
        host.innerHTML =
          '<form class="form" id="apply-form" novalidate>' +
          '<p class="form-note">회원가입 없이 신청할 수 있어요. 신청 확인과 변경 안내를 받을 이메일이 필요합니다. 버튼을 누르는 것만으로 좌석이 확정되지 않으며, 이메일 확인 뒤 정원을 확인해 결과를 알려드려요.</p>' +
          '<div class="field"><label for="f-nick">닉네임 <span class="req" aria-hidden="true">*</span></label><input id="f-nick" name="nickname" type="text" maxlength="20" required placeholder="행사에서 불릴 이름"></div>' +
          '<div class="field"><span class="field label" style="display:block;font-weight:700;margin-bottom:6px">신청 유형 <span class="req" aria-hidden="true">*</span></span>' +
          '<label class="check"><input type="radio" name="age" value="adult" checked> 만 14세 이상 본인이 신청합니다</label>' +
          '<label class="check" style="margin-top:8px"><input type="radio" name="age" value="guardian"> 만 14세 미만 자녀를 위해 보호자가 대신 신청합니다 (보호자 동반)</label></div>' +
          '<div class="field-row"><div class="field"><label for="f-n1">참가자 수 <span class="req" aria-hidden="true">*</span></label><input id="f-n1" name="participants" type="number" min="1" max="3" value="1" required></div>' +
          '<div class="field"><label for="f-n2">동반 보호자 수</label><input id="f-n2" name="guardians" type="number" min="0" max="3" value="0"><p class="help">보호자도 현장 인원에 포함됩니다.</p></div></div>' +
          '<div class="field"><label for="f-email">이메일 <span class="req" aria-hidden="true">*</span></label><input id="f-email" name="email" type="email" required placeholder="name@example.com" autocomplete="email"><p class="help">확인 링크를 보내드립니다. 공개 게시판에 올라가지 않습니다.</p></div>' +
          (ev.type === "중복 교환회" ? '<div class="field"><label for="f-items">가져올 물건 · 구하는 물건 (선택)</label><textarea id="f-items" name="items" placeholder="예) 보유: 말랑 고양이 1종(미개봉) / 구함: 빵 굽는 곰 시리즈"></textarea><p class="help">교환품 사진과 상태 확인은 접수 후 따로 안내드려요. 회차당 1인 최대 3개.</p></div>' : "") +
          '<div class="field"><label class="check"><input type="checkbox" name="agreePrivacy" required> <span>[필수] 신청 처리를 위한 개인정보 수집·이용에 동의합니다. <a href="privacy.html" target="_blank" rel="noopener">안내 보기</a></span></label></div>' +
          '<div class="field"><label class="check"><input type="checkbox" name="agreeMarketing"> <span>[선택] 새 행사·입고 소식을 이메일로 받겠습니다. 언제든 해지할 수 있어요.</span></label></div>' +
          '<div id="apply-error" class="error hidden" role="alert"></div>' +
          '<button type="submit" class="btn btn--red btn--block">인증 메일 받고 신청하기</button>' +
          '</form>';
        var form = $("#apply-form"), busy = false;
        form.addEventListener("submit", function (e) {
          e.preventDefault(); if (busy) return;
          var err = $("#apply-error"); err.classList.add("hidden");
          var fd = new FormData(form), data = { eventId: ev.id, nickname: (fd.get("nickname") || "").trim(), ageType: fd.get("age"), participants: parseInt(fd.get("participants"), 10) || 0, guardians: parseInt(fd.get("guardians"), 10) || 0, email: (fd.get("email") || "").trim(), items: (fd.get("items") || "").trim(), agreePrivacy: !!fd.get("agreePrivacy"), agreeMarketing: !!fd.get("agreeMarketing"), submitKey: ev.id + ":" + (fd.get("email") || "").trim().toLowerCase() };
          var problems = [];
          if (!data.nickname) problems.push("닉네임을 입력해 주세요.");
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) problems.push("이메일 형식을 확인해 주세요.");
          if (data.participants < 1) problems.push("참가 인원을 확인해 주세요. 보호자도 현장 인원에 포함해 주세요.");
          if (data.ageType === "guardian" && data.guardians < 1) problems.push("보호자 대리 신청은 동반 보호자 1명 이상이 필요해요.");
          if (!data.agreePrivacy) problems.push("필수 동의 항목을 확인해 주세요.");
          if (problems.length) { err.innerHTML = problems.map(esc).join("<br>"); err.classList.remove("hidden"); err.scrollIntoView({ block: "center" }); return; }
          var btn = $("button[type=submit]", form); busy = true; btn.classList.add("is-busy"); btn.disabled = true;
          X.postJSON(C.endpoints.eventApply, data).then(function (r) {
            var s = (r && r.status) || "pending", box;
            if (s === "confirmed") box = '<div class="result-box result-box--ok"><h3>신청이 완료됐어요</h3><p>일정과 준비물은 안내 메일에서 확인하세요. 취소는 메일의 링크에서 할 수 있어요.</p></div>';
            else if (s === "waitlist") box = '<div class="result-box result-box--wait"><h3>대기 신청을 접수했어요</h3><p>아직 참석이 확정된 상태는 아니에요. 자리가 생기면 이메일로 안내드립니다.</p></div>';
            else if (s === "full") box = '<div class="result-box result-box--err"><h3>지금은 정원이 찼어요</h3><p>제출 직전에 자리가 모두 찼어요. 다음 회차 소식을 공지로 알려드릴게요.</p></div>';
            else if (s === "duplicate") box = '<div class="result-box result-box--wait"><h3>이미 이 행사에 신청한 기록이 있어요</h3><p>신청 확인 메일에서 내용을 확인하거나, 링크가 만료됐다면 새 링크를 요청해 주세요.</p></div>';
            else box = '<div class="result-box result-box--wait"><h3>이메일을 확인해 주세요</h3><p>이메일의 확인 링크를 열면 신청을 마무리할 수 있어요. 아직 자리가 확정되지는 않았어요. 메일이 오지 않으면 스팸함을 확인해 주세요.</p></div>';
            host.innerHTML = box; X.track("event_apply_submit", { event_id: ev.id, result: s }); host.scrollIntoView({ block: "start", behavior: "smooth" });
          }).catch(function () {
            busy = false; btn.classList.remove("is-busy"); btn.disabled = false;
            err.textContent = "연결이 원활하지 않아요. 작성한 내용은 그대로 두었으니 잠시 후 다시 시도해 주세요."; err.classList.remove("hidden");
          });
        });
      }
    }

    /* ======================= 교환회 ======================= */
    if (page === "swap") {
      var sw = E.items.filter(function (e) { return e.type === "중복 교환회" && e.status !== "ended"; })[0];
      var swHost = $("#swap-ticket");
      if (swHost) swHost.innerHTML = sw ? eventTicket(sw) : '<div class="empty"><strong>다음 교환회를 준비하고 있어요</strong>모집이 열리면 행사 목록에 올라옵니다.</div>';
      var cardForm = $("#card-form");
      if (cardForm) cardForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var fd = new FormData(cardForm);
        var text = "[플레이션 교환 카드]\n닉네임: " + (fd.get("nick") || "") + "\n보유(교환 가능): " + (fd.get("have") || "") + "\n상태: " + (fd.get("cond") || "") + "\n구함: " + (fd.get("want") || "") + "\n희망 회차: " + (fd.get("round") || "다음 회차");
        var out = $("#card-out"); out.textContent = text; out.parentElement.classList.remove("hidden");
        var cp = $("#card-copy"); cp.onclick = function () { if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { cp.textContent = "복사했어요"; setTimeout(function () { cp.textContent = "카드 내용 복사"; }, 2000); }); };
        X.track("swap_card_create", {});
      });
    }

    /* ======================= 컬렉터 클럽 ======================= */
    if (page === "club") {
      var cf = $("#club-stories"), cats = ["전체", "한 칸 전시", "첫 수집", "오늘의 한 개", "전시 기록"], cur = "전체";
      var ch = $("#club-chips");
      function renderClub() {
        ch.innerHTML = cats.map(function (c) { return '<button type="button" class="chip" aria-pressed="' + (cur === c) + '" data-c="' + esc(c) + '">' + esc(c) + '</button>'; }).join("");
        $$(".chip", ch).forEach(function (b) { b.addEventListener("click", function () { cur = b.getAttribute("data-c"); renderClub(); }); });
        var items = S.items.filter(function (s) { return cur === "전체" || s.category === cur; });
        if (!S.items.length) { emptyStories(cf); ch.classList.add("hidden"); return; }
        cf.innerHTML = items.length ? '<div class="frames">' + items.map(storyFrame).join("") + '</div>' : '<div class="empty"><strong>이 분류에는 아직 글이 없어요</strong></div>';
      }
      renderClub();
      var ct = $("#club-theme"); if (ct) ct.textContent = S.currentTheme || "처음 좋아하게 된 것";
      var nt = $("#club-next-theme"); if (nt) nt.textContent = S.nextTheme || "";
    }

    /* ======================= 전시 글 상세 ======================= */
    if (page === "story") {
      var sid = X.param("id"), s = S.items.filter(function (x) { return x.id === sid; })[0], sh = $("#story-host");
      if (!s) { sh.innerHTML = '<div class="empty"><strong>지금 볼 수 없는 게시물입니다</strong>비공개로 바뀌었거나 주소가 다를 수 있어요.<div class="btn-row"><a class="btn btn--red btn--sm" href="club.html">전시 목록으로</a></div></div>'; document.title = "지금 볼 수 없는 게시물 | 플레이션 가챠샵"; }
      else {
        document.title = s.title + " | 플레이션 컬렉터 클럽";
        var prod = P.items.filter(function (p) { return p.id === s.product; })[0];
        sh.innerHTML = '<div class="detail"><div class="detail__img">' + (s.image ? '<img src="' + esc(s.image) + '" alt="' + esc(s.alt || s.title) + '">' : X.capsuleSvg("#FFD447", s.title)) + '</div>' +
          '<div><p class="breadcrumb"><a href="club.html">컬렉터 클럽</a> › ' + esc(s.category || "") + (s.theme ? " › " + esc(s.theme) : "") + '</p>' +
          '<h1 class="detail__name">' + esc(s.title) + '</h1>' +
          '<p class="muted">' + esc(s.author || "") + (s.isStaff ? ' <span class="tag tag--plain tag--blue">운영자</span>' : "") + (s.date ? ' · ' + esc(X.fmtDate(s.date)) : "") + '</p>' +
          '<p style="font-size:1.05rem;line-height:1.8">' + esc(s.body || "").replace(/\n/g, "<br>") + '</p>' +
          (prod ? '<p class="fine">관련 상품: <a href="product.html?id=' + encodeURIComponent(prod.id) + '">' + esc(prod.name) + '</a> (' + esc(prod.loc) + ')</p>' : "") +
          '<div class="btn-row mt-16"><a class="btn btn--outline" href="club.html">다른 전시 보기</a><button type="button" class="btn btn--ghost" id="story-share">공유하기</button></div>' +
          '<p class="fine mt-16">이 작품은 제공자의 게시 동의를 받아 소개합니다. 문제가 있는 게시물은 <a href="help.html#inquiry">문의</a>로 알려주세요.</p></div></div>';
        $("#story-share").addEventListener("click", function () { var b = this; if (navigator.share) navigator.share({ title: s.title, url: location.href }).catch(function () { }); else if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(function () { b.textContent = "링크를 복사했어요"; }); });
      }
    }

    /* ======================= 방문·도움말 (문의) ======================= */
    if (page === "help") {
      var iq = $("#inquiry-form");
      if (iq) {
        var mPre = X.param("machine"); if (mPre) iq.machine.value = mPre;
        var tPre = X.param("type"); if (tPre === "loc") iq.type.value = "info";
        if (C.endpoints.inquiry) $("#photo-field").classList.remove("hidden");
        iq.addEventListener("submit", function (e) {
          e.preventDefault();
          var fd = new FormData(iq), err = $("#inquiry-error"); err.classList.add("hidden");
          var data = { machine: (fd.get("machine") || "").trim(), type: fd.get("type"), when: fd.get("when"), detail: (fd.get("detail") || "").trim(), contact: (fd.get("contact") || "").trim() };
          if (!data.type) { err.textContent = "문의 유형을 골라 주세요."; err.classList.remove("hidden"); return; }
          if (!data.detail) { err.textContent = "무슨 일이 있었는지 한 줄만 적어 주세요."; err.classList.remove("hidden"); return; }
          var typeLabel = $("select[name=type] option:checked", iq).textContent;
          var text = "[플레이션 문의] " + typeLabel + "\n기기 번호: " + (data.machine || "모름") + "\n발생 시각: " + (data.when || "모름") + "\n내용: " + data.detail + "\n답변 받을 연락처: " + (data.contact || "없음");
          var host = $("#inquiry-result");
          if (C.endpoints.inquiry) {
            var btn = $("button[type=submit]", iq); btn.classList.add("is-busy"); btn.disabled = true;
            var file = fd.get("photo"), send = function (photo) {
              if (photo) data.photo = photo;
              X.postJSON(C.endpoints.inquiry, data).then(function (r) {
                host.innerHTML = '<div class="result-box result-box--ok"><h3>문의를 접수했어요</h3><p>접수번호 ' + esc((r && r.id) || "") + ' ' + esc(C.contact.responseNote || "") + ' 사진만으로 결론 내리지 않고 현장 확인 후 처리합니다.</p></div>';
                host.classList.remove("hidden"); iq.classList.add("hidden"); host.scrollIntoView({ block: "start", behavior: "smooth" });
              }).catch(function () { btn.classList.remove("is-busy"); btn.disabled = false; err.textContent = "연결이 원활하지 않아요. 작성한 내용을 유지했으니 다시 시도해 주세요."; err.classList.remove("hidden"); });
            };
            if (file && file.size) { if (file.size > 8 * 1024 * 1024) { btn.classList.remove("is-busy"); btn.disabled = false; err.textContent = "사진을 올리지 못했어요. 8MB 이하 JPG·PNG·WebP 파일로 다시 선택해 주세요."; err.classList.remove("hidden"); return; } var rd = new FileReader(); rd.onload = function () { send({ name: file.name, type: file.type, data: String(rd.result).split(",")[1] }); }; rd.onerror = function () { send(null); }; rd.readAsDataURL(file); }
            else send(null);
            return;
          }
          if (C.links.inquiryForm) { window.open(C.links.inquiryForm, "_blank", "noopener"); return; }
          var links = X.contactLinksHtml();
          host.innerHTML = '<div class="result-box result-box--wait"><h3>아래 내용을 복사해 문의 채널로 보내주세요</h3><pre style="white-space:pre-wrap;font:inherit;background:#fff;padding:12px;border-radius:8px;border:1px solid var(--line)">' + esc(text) + '</pre><div class="btn-row"><button type="button" class="btn btn--outline btn--sm" id="iq-copy">내용 복사</button>' + links + '</div>' + (!links ? '<p class="mt-16 mb-0">문의 채널은 오픈 후 공지됩니다. 매장 안내대에서 직원에게 알려주셔도 됩니다.</p>' : "") + '</div>';
          host.classList.remove("hidden"); host.scrollIntoView({ block: "start", behavior: "smooth" });
          var cpb = $("#iq-copy"); if (cpb) cpb.addEventListener("click", function () { if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { cpb.textContent = "복사했어요"; }); });
          if (C.contact.email) { var ml = document.createElement("a"); ml.className = "btn btn--red btn--sm"; ml.href = "mailto:" + C.contact.email + "?subject=" + encodeURIComponent("[플레이션 문의] " + typeLabel) + "&body=" + encodeURIComponent(text); ml.textContent = "메일로 보내기"; $(".btn-row", host).prepend(ml); }
        });
      }
    }

    /* ======================= 공지 ======================= */
    if (page === "notices") {
      var nh = $("#notice-list");
      nh.innerHTML = N.length ? N.map(function (n) { return '<li class="notice"><time datetime="' + esc(n.date) + '">' + esc(X.fmtDate(n.date)) + '</time><h3>' + esc(n.title) + '</h3><p>' + esc(n.body) + '</p></li>'; }).join("") : '<li class="empty"><strong>등록된 공지가 없어요</strong></li>';
    }
  });
})();
