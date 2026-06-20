/* =========================================================
   Yapıcı · Allianz Agentur — core app
   Language engine (DE/TR/RU/AR + RTL), nav, reveal, FAQ
   ========================================================= */
(function(){
  "use strict";
  var I18N = window.I18N || {};
  var LANGS = window.LANGS || [{code:"de"}];
  var DEFAULT = "de";
  var RTL = ["ar"];

  function getLang(){
    var l;
    try{ l = localStorage.getItem("yp_lang"); }catch(e){}
    var url = new URLSearchParams(location.search).get("lang");
    if(url) l = url;
    if(!l || !I18N[l]) l = DEFAULT;
    return l;
  }
  function setLangStore(l){ try{ localStorage.setItem("yp_lang", l); }catch(e){} }

  window.YP = {
    lang: getLang(),
    t: function(key, lang){
      lang = lang || window.YP.lang;
      var d = I18N[lang] || I18N[DEFAULT];
      return (d && d[key] != null) ? d[key] : (I18N[DEFAULT][key] != null ? I18N[DEFAULT][key] : key);
    }
  };

  function applyI18n(){
    var lang = window.YP.lang;
    var isRTL = RTL.indexOf(lang) > -1;
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", isRTL ? "rtl" : "ltr");

    // text content (allow inline html for accent spans)
    document.querySelectorAll("[data-i18n]").forEach(function(el){
      el.innerHTML = window.YP.t(el.getAttribute("data-i18n"));
    });
    // placeholders
    document.querySelectorAll("[data-i18n-ph]").forEach(function(el){
      el.setAttribute("placeholder", window.YP.t(el.getAttribute("data-i18n-ph")));
    });
    // generic attribute: data-i18n-attr="attr:key"
    document.querySelectorAll("[data-i18n-attr]").forEach(function(el){
      el.getAttribute("data-i18n-attr").split(";").forEach(function(pair){
        var p = pair.split(":"); if(p.length===2) el.setAttribute(p[0].trim(), window.YP.t(p[1].trim()));
      });
    });
    // page title
    var mt = window.YP.t("meta.title"); if(mt) document.title = mt;

    // language button label
    var cur = LANGS.filter(function(x){return x.code===lang;})[0] || LANGS[0];
    var lbl = document.querySelector(".lang__btn .lang__cur");
    if(lbl && cur){ lbl.textContent = cur.code.toUpperCase(); }
    var fl = document.querySelector(".lang__btn .flag");
    if(fl && cur){ fl.textContent = cur.flag; }
    document.querySelectorAll(".lang__menu button").forEach(function(b){
      b.classList.toggle("sel", b.getAttribute("data-lang")===lang);
    });

    // re-bind dynamic contact + notify modules
    bindAgency();
    document.dispatchEvent(new CustomEvent("yp:lang", {detail:{lang:lang, rtl:isRTL}}));
  }

  function setLang(l){
    if(!I18N[l]) return;
    window.YP.lang = l; setLangStore(l);
    applyI18n();
  }
  window.YP.setLang = setLang;

  /* ---- bind agency contact data ---- */
  function bindAgency(){
    var A = window.AGENCY || {};
    document.querySelectorAll("[data-bind]").forEach(function(el){
      var k = el.getAttribute("data-bind");
      if(A[k]!=null) el.textContent = A[k];
    });
    document.querySelectorAll("[data-href]").forEach(function(el){
      var type = el.getAttribute("data-href");
      if(type==="tel") el.setAttribute("href","tel:"+(A.phoneRaw||""));
      if(type==="mail") el.setAttribute("href","mailto:"+(A.email||""));
      if(type==="wa") el.setAttribute("href","https://wa.me/"+(A.whatsapp||""));
      if(type==="instagram") el.setAttribute("href",A.instagram||"#");
      if(type==="linkedin") el.setAttribute("href",A.linkedin||"#");
    });
    document.querySelectorAll("[data-photo]").forEach(function(el){
      if(A.photo && !el.getAttribute("src")) el.setAttribute("src", A.photo);
    });
  }

  /* initials avatar (used if the agent photo fails to load) */
  function initialsAvatar(name){
    var ini=(name||"AY").split(/\s+/).map(function(w){return w[0];}).join("").slice(0,2).toUpperCase();
    var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="%23004FA3"/><stop offset="1" stop-color="%23002659"/></linearGradient></defs><rect width="200" height="200" fill="url(%23g)"/><text x="100" y="100" dy=".36em" text-anchor="middle" font-family="Plus Jakarta Sans, Arial, sans-serif" font-size="84" font-weight="800" fill="%23ffffff">'+ini+'</text></svg>';
    return "data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg.replace(/%23/g,"#")).replace(/#/g,"%23");
  }

  /* ---- language dropdown ---- */
  function initLangMenu(){
    var menu = document.querySelector(".lang__menu");
    if(menu && !menu.children.length){
      LANGS.forEach(function(L){
        var b=document.createElement("button");
        b.setAttribute("data-lang",L.code);
        b.innerHTML='<span class="flag">'+L.flag+'</span> '+L.label;
        b.addEventListener("click",function(){ setLang(L.code); closeMenu(); });
        menu.appendChild(b);
      });
    }
    var btn=document.querySelector(".lang__btn");
    if(btn){ btn.addEventListener("click",function(e){ e.stopPropagation(); menu.classList.toggle("open"); }); }
    document.addEventListener("click",closeMenu);
    function closeMenu(){ if(menu) menu.classList.remove("open"); }
  }

  /* ---- mobile nav ---- */
  function initBurger(){
    var b=document.querySelector(".burger"), links=document.querySelector(".nav__links");
    if(!b||!links) return;
    b.addEventListener("click",function(){
      b.classList.toggle("x"); links.classList.toggle("open");
      document.body.classList.toggle("no-scroll", links.classList.contains("open"));
    });
    links.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click",function(){ b.classList.remove("x"); links.classList.remove("open"); document.body.classList.remove("no-scroll"); });
    });
  }

  /* ---- active nav highlight ---- */
  function initActiveNav(){
    var path=(location.pathname.split("/").pop()||"index.html");
    document.querySelectorAll(".nav__links a").forEach(function(a){
      var href=a.getAttribute("href")||"";
      if(href===path || (path==="" && href==="index.html") || (path==="index.html" && href==="index.html")){
        a.classList.add("active");
      }
    });
  }

  /* ---- reveal on scroll ---- */
  function initReveal(){
    var els=document.querySelectorAll(".reveal");
    if(!("IntersectionObserver" in window)){ els.forEach(function(e){e.classList.add("in");}); return; }
    var io=new IntersectionObserver(function(ents){
      ents.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
    },{threshold:.12});
    els.forEach(function(e){ io.observe(e); });
  }

  /* ---- FAQ accordion ---- */
  function initFAQ(){
    document.querySelectorAll(".faq__q").forEach(function(q){
      q.addEventListener("click",function(){
        var item=q.closest(".faq__item"); var a=item.querySelector(".faq__a");
        var open=item.classList.toggle("open");
        a.style.maxHeight = open ? a.scrollHeight+"px" : "0";
      });
    });
  }

  /* ---- image fallback ---- */
  function initImgFallback(){
    document.querySelectorAll("img[data-fallback]").forEach(function(img){
      function fail(){
        if(img.hasAttribute("data-photo")){
          if(img.getAttribute("data-fell")) return;
          img.setAttribute("data-fell","1");
          img.src=initialsAvatar((window.AGENCY&&window.AGENCY.name)||"AY");
        }else{
          img.style.visibility="hidden";
          if(img.parentElement) img.parentElement.classList.add("img-fallback");
        }
      }
      img.addEventListener("error",fail);
      if(img.complete && img.naturalWidth===0) fail(); // already broken
    });
  }

  /* ---- footer year ---- */
  function initYear(){ var y=document.querySelector("[data-year]"); if(y) y.textContent=new Date().getFullYear(); }

  document.addEventListener("DOMContentLoaded",function(){
    initLangMenu(); initBurger(); initActiveNav();
    applyI18n();
    initReveal(); initFAQ(); initImgFallback(); initYear();
  });
})();
