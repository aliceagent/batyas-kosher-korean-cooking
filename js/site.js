/* Batya's Kosher Korean Kitchen — shared site behaviour
 * - Share modal (WhatsApp-first, plus copy link / email / Facebook)
 * - Vegan badges on cards, sample menus, and recipe headers
 * - Per-recipe "Share" buttons (link previews the dish via /share/<id>)
 * Loaded on index.html and recipes.html. Pure progressive enhancement.
 */
(function () {
  "use strict";
  var SITE = "https://batyas-kosher-korean-cooking.vercel.app";
  var DEFAULT_TEXT =
    "Cook Korean. Keep It Kosher. 🇰🇷✡️ Hands-on kosher Korean cooking workshops in Hashmonaim — cook from scratch, feast on what you made, and take home your own jar of kimchi.";
  var VEGAN = { oimuchim: 1, sigeumchi: 1, japchae: 1, dubujorim: 1, hotteok: 1, kimchi: 1 };

  /* ---------- icons ---------- */
  var I = {
    wa: '<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M.06 24l1.68-6.13A11.86 11.86 0 0 1 .16 11.9C.16 5.34 5.5.01 12.05.01a11.82 11.82 0 0 1 8.41 3.49 11.8 11.8 0 0 1 3.48 8.42c0 6.55-5.34 11.89-11.89 11.89a11.9 11.9 0 0 1-5.69-1.45L.06 24zm6.6-3.8c1.68.99 3.28 1.59 5.39 1.59 5.44 0 9.87-4.43 9.88-9.88a9.85 9.85 0 0 0-16.82-6.99 9.82 9.82 0 0 0-2.9 6.98c0 2.22.65 3.88 1.74 5.62l-.99 3.62 3.7-.97zm10.74-4.92c-.07-.12-.27-.2-.57-.35-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.88 1.21 3.08.15.2 2.09 3.2 5.07 4.48.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42z"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3l.4-3H14V4.3c0-.85.24-1.43 1.46-1.43H17.5V.2C17.16.15 16.13 0 14.93 0 12.43 0 10.7 1.53 10.7 4.34V6H8v3h2.7v8h3.3V9z"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>',
    leaf: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21v-9"/><path d="M12 12C12 8.5 9.2 6.4 4.5 6.4 4.5 9.9 7.3 12 12 12z"/><path d="M12 11.2c0-3.8 2.9-6.2 7.5-6.2 0 3.8-2.9 6.2-7.5 6.2z"/></svg>'
  };

  /* ---------- styles ---------- */
  var css =
    ".vegan-badge{display:inline-flex;align-items:center;gap:4px;font-size:.66rem;font-weight:800;letter-spacing:.04em;color:#52701f;background:#eef4dc;border:1px solid rgba(111,127,69,.45);padding:3px 9px;border-radius:999px;line-height:1;white-space:nowrap;vertical-align:middle}" +
    ".vegan-badge svg{flex:0 0 auto}" +
    ".vegan-badge.on-img{position:absolute;top:10px;right:10px;background:rgba(255,253,248,.96);box-shadow:0 3px 8px rgba(58,33,24,.18)}" +
    ".vegan-badge.sm{font-size:.6rem;padding:3px 8px}" +
    ".li-tags{display:inline-flex;align-items:center;gap:7px;flex:0 0 auto}" +
    ".recipe-share{position:absolute;top:16px;right:16px;z-index:2;display:inline-flex;align-items:center;gap:6px;background:#fff;border:1.5px solid var(--line,rgba(58,33,24,.12));color:var(--gochujang,#8F241C);font-family:inherit;font-weight:800;font-size:.82rem;padding:7px 13px;border-radius:999px;cursor:pointer;box-shadow:var(--shadow-card,0 10px 24px rgba(58,33,24,.08));transition:.15s}" +
    ".recipe-share:hover{border-color:var(--kimchi-red,#B93A2F);color:var(--kimchi-red,#B93A2F);transform:translateY(-1px)}" +
    ".recipe-share svg{width:15px;height:15px}" +
    "@media(max-width:560px){.recipe-share span{display:none}.recipe-share{padding:8px}}" +
    ".btn-share{display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-family:inherit}" +
    ".hshare{display:inline-grid;place-items:center;width:42px;height:42px;border-radius:12px;background:#fff;border:1px solid var(--line,rgba(58,33,24,.12));color:var(--gochujang,#8F241C);cursor:pointer;flex:0 0 auto}" +
    ".hshare:hover{color:var(--kimchi-red,#B93A2F);border-color:var(--kimchi-red,#B93A2F)}" +
    ".hshare svg{width:18px;height:18px}" +
    ".share-modal{position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;background:rgba(58,33,24,.55);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px);padding:20px}" +
    ".share-modal.open{display:flex;animation:shFade .2s ease}" +
    "@keyframes shFade{from{opacity:0}to{opacity:1}}" +
    ".share-box{position:relative;background:var(--cream-2,#FFF9EC);border:1px solid rgba(58,33,24,.12);border-radius:22px;box-shadow:0 24px 60px rgba(58,33,24,.32);width:100%;max-width:380px;padding:26px 22px 22px;text-align:center;animation:shPop .25s cubic-bezier(.22,1.4,.4,1)}" +
    "@keyframes shPop{from{transform:translateY(12px) scale(.96);opacity:0}to{transform:none;opacity:1}}" +
    ".share-x{position:absolute;top:8px;right:12px;background:none;border:none;font-size:1.8rem;line-height:1;color:#9a8b76;cursor:pointer;padding:4px}" +
    ".share-x:hover{color:var(--kimchi-red,#B93A2F)}" +
    ".share-h{font-family:'Fraunces',Georgia,serif;font-weight:800;color:var(--kimchi-red,#B93A2F);font-size:1.26rem;margin:0 8px 4px}" +
    ".share-sub{color:#7a6a58;font-size:.86rem;margin:0 0 16px}" +
    ".share-wa{display:flex;align-items:center;justify-content:center;gap:10px;background:#25D366;color:#fff;text-decoration:none;font-weight:800;font-size:1.02rem;padding:14px;border-radius:14px;box-shadow:0 8px 20px rgba(37,211,102,.35)}" +
    ".share-wa:hover{background:#1ebe5a}" +
    ".share-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:10px}" +
    ".share-opt{display:flex;flex-direction:column;align-items:center;gap:6px;background:#fff;border:1px solid rgba(58,33,24,.12);border-radius:14px;padding:13px 6px;font-weight:700;font-size:.82rem;color:var(--soy,#3A2118);cursor:pointer;text-decoration:none;font-family:inherit;transition:.15s}" +
    ".share-opt:hover{border-color:var(--kimchi-red,#B93A2F);color:var(--kimchi-red,#B93A2F);transform:translateY(-2px)}" +
    ".share-opt svg{width:22px;height:22px}";
  var styleEl = document.createElement("style");
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---------- helpers ---------- */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function veganBadge(extra) {
    return el("span", "vegan-badge " + (extra || ""), I.leaf + "<span>VEGAN</span>");
  }
  function dishId(href) {
    if (!href) return null;
    var m = href.match(/#([a-z0-9\-]+)/i);
    return m ? m[1] : null;
  }

  /* ---------- vegan badges ---------- */
  // menu cards (index)
  document.querySelectorAll("#menuGrid .card").forEach(function (card) {
    var id = dishId(card.getAttribute("href"));
    if (id && VEGAN[id]) {
      var wrap = card.querySelector(".imgwrap");
      if (wrap) wrap.appendChild(veganBadge("on-img"));
    }
  });
  // sample-menu list items (index)
  document.querySelectorAll(".menucard li").forEach(function (li) {
    var a = li.querySelector("a");
    var id = a ? dishId(a.getAttribute("href")) : null;
    if (id && VEGAN[id]) {
      var kosher = li.querySelector(".badge");
      if (kosher) {
        var tags = el("span", "li-tags");
        li.insertBefore(tags, kosher);
        tags.appendChild(veganBadge("sm"));
        tags.appendChild(kosher);
      }
    }
  });
  // "+ take-home jar of Kimchi" lines (index)
  document.querySelectorAll(".menucard .plus").forEach(function (p) {
    var a = p.querySelector("a");
    var id = a ? dishId(a.getAttribute("href")) : null;
    if (id && VEGAN[id]) {
      p.appendChild(document.createTextNode(" "));
      p.appendChild(veganBadge("sm"));
    }
  });
  // recipe headers (recipes.html)
  document.querySelectorAll("article.recipe").forEach(function (art) {
    if (VEGAN[art.id]) {
      var head = art.querySelector(".rhead");
      if (!head) return;
      var course = head.querySelector(".course");
      var b = veganBadge();
      if (course) course.insertAdjacentElement("afterend", b);
      else head.insertBefore(b, head.firstChild);
    }
  });

  /* ---------- share modal ---------- */
  var modal = el("div", "share-modal");
  modal.id = "shareModal";
  modal.innerHTML =
    '<div class="share-box" role="dialog" aria-modal="true" aria-label="Share">' +
    '<button class="share-x" data-share-close aria-label="Close">×</button>' +
    '<div class="share-h"></div><p class="share-sub"></p>' +
    '<a class="share-wa" data-act="wa" target="_blank" rel="noopener">' + I.wa + " Share on WhatsApp</a>" +
    '<div class="share-grid">' +
    '<button class="share-opt" data-act="copy" type="button">' + I.copy + '<span class="lbl">Copy link</span></button>' +
    '<a class="share-opt" data-act="email">' + I.mail + "<span>Email</span></a>" +
    '<a class="share-opt" data-act="fb" target="_blank" rel="noopener">' + I.fb + "<span>Facebook</span></a>" +
    "</div></div>";
  document.body.appendChild(modal);

  var qs = function (s) { return modal.querySelector(s); };
  var hEl = qs(".share-h"), subEl = qs(".share-sub");
  var waEl = qs('[data-act="wa"]'), emailEl = qs('[data-act="email"]'),
      fbEl = qs('[data-act="fb"]'), copyEl = qs('[data-act="copy"]'),
      copyLbl = copyEl.querySelector(".lbl");
  var cur = { url: SITE + "/" };

  function openShare(o) {
    o = o || {};
    cur.url = o.url || SITE + "/";
    var title = o.title || "Batya's Kosher Korean Kitchen";
    var text = o.text || DEFAULT_TEXT;
    hEl.textContent = o.heading || "Share";
    subEl.textContent = title;
    var msg = text + " " + cur.url;
    waEl.href = "https://wa.me/?text=" + encodeURIComponent(msg);
    emailEl.href = "mailto:?subject=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(msg);
    fbEl.href = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(cur.url);
    copyLbl.textContent = "Copy link";
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeShare() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
  copyEl.addEventListener("click", function () {
    var done = function () { copyLbl.textContent = "Copied!"; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cur.url).then(done).catch(fallback);
    } else { fallback(); }
    function fallback() {
      var t = el("textarea"); t.value = cur.url; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select();
      try { document.execCommand("copy"); done(); } catch (e) {}
      document.body.removeChild(t);
    }
  });

  document.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-share]");
    if (trigger) {
      e.preventDefault();
      openShare({
        url: trigger.getAttribute("data-share-url") || undefined,
        title: trigger.getAttribute("data-share-title") || undefined,
        text: trigger.getAttribute("data-share-text") || undefined,
        heading: trigger.getAttribute("data-share-heading") || undefined
      });
      return;
    }
    if (e.target === modal || e.target.closest("[data-share-close]")) closeShare();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("open")) closeShare();
  });

  /* ---------- per-recipe share buttons (recipes.html) ---------- */
  document.querySelectorAll("article.recipe").forEach(function (art) {
    var head = art.querySelector(".rhead h2");
    var name = "";
    if (head) {
      var clone = head.cloneNode(true);
      var kr = clone.querySelector(".kr");
      if (kr) kr.remove();
      name = clone.textContent.trim();
    }
    var btn = el("button", "recipe-share", I.share + "<span>Share</span>");
    btn.type = "button";
    btn.setAttribute("data-share", "");
    btn.setAttribute("data-share-heading", "Share this recipe");
    btn.setAttribute("data-share-url", SITE + "/share/" + art.id);
    btn.setAttribute("data-share-title", name + " — Batya's Kosher Korean Kitchen");
    btn.setAttribute(
      "data-share-text",
      name + " — a kosher Korean recipe from Batya's Kosher Korean Kitchen 🇰🇷✡️"
    );
    btn.setAttribute("aria-label", "Share " + name);
    if (getComputedStyle(art).position === "static") art.style.position = "relative";
    art.appendChild(btn);
  });
})();
