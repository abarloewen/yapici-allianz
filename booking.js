/* =========================================================
   Yapıcı · Allianz Agentur — booking wizard
   4 steps + confirmation (front-end design preview)
   ========================================================= */
(function(){
  "use strict";
  function t(k){ return (window.YP?window.YP.t(k):k); }
  function $(s,c){ return (c||document).querySelector(s); }
  function $all(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); }

  if(!document.querySelector(".wizard")) return;

  var step=0, TOTAL=4;
  var state={svcKey:null, chKey:null, date:"", time:"", name:"", phone:"", email:"", msg:""};

  document.addEventListener("DOMContentLoaded",function(){
    // date min = today
    var d=$("#bk-date");
    if(d){ var n=new Date(); n.setDate(n.getDate()+1); d.min=n.toISOString().split("T")[0]; }

    // option selectors (service / channel)
    $all(".opts").forEach(function(grp){
      $all(".opt",grp).forEach(function(o){
        o.addEventListener("click",function(){
          $all(".opt",grp).forEach(function(x){x.classList.remove("sel");});
          o.classList.add("sel");
          var key=o.getAttribute("data-i18nkey");
          if(grp.getAttribute("data-grp")==="service") state.svcKey=key;
          if(grp.getAttribute("data-grp")==="channel") state.chKey=key;
        });
      });
    });

    // time slots
    $all(".slot").forEach(function(s){
      s.addEventListener("click",function(){
        $all(".slot").forEach(function(x){x.classList.remove("sel");});
        s.classList.add("sel"); state.time=s.getAttribute("data-val");
      });
    });
    if(d) d.addEventListener("change",function(){ state.date=d.value; });

    var nb=$(".js-next"), bb=$(".js-back");
    if(nb) nb.addEventListener("click",next);
    if(bb) bb.addEventListener("click",back);
    var rn=$(".js-restart"); if(rn) rn.addEventListener("click",restart);

    setStep(0);
    document.addEventListener("yp:lang",function(){ updateBtns(); });
  });

  function setStep(n){
    step=n;
    $all(".wpane").forEach(function(p){ p.hidden=(+p.getAttribute("data-step")!==n); });
    $all(".wstep").forEach(function(s,i){
      s.classList.toggle("active",i===n);
      s.classList.toggle("done",i<n);
    });
    updateBtns();
    var w=$(".wizard"); if(w) window.scrollTo({top:w.getBoundingClientRect().top+window.scrollY-90,behavior:"smooth"});
  }

  function updateBtns(){
    var back=$(".js-back"), nextb=$(".js-next"), foot=$(".wizard__foot");
    if(foot) foot.hidden=(step===TOTAL);
    if(back) back.style.visibility=(step===0||step===TOTAL)?"hidden":"visible";
    if(nextb){ nextb.innerHTML=(step===TOTAL-1)?t("book.confirm"):t("book.next"); }
    if(back) back.innerHTML=t("book.back");
  }

  function valid(n){
    if(n===0) return !!state.svcKey;
    if(n===1) return !!state.chKey;
    if(n===2) return !!($("#bk-date")&&$("#bk-date").value) && !!state.time;
    if(n===3){ var nm=$("#bk-name").value.trim(), ph=$("#bk-phone").value.trim(); return nm&&ph; }
    return true;
  }

  function flash(){
    var el=$(".wiz-msg");
    if(!el){ el=document.createElement("div"); el.className="wiz-msg form__note"; el.style.color="var(--warn)"; el.style.marginInlineEnd="auto";
      var foot=$(".wizard__foot"); if(foot) foot.insertBefore(el,foot.firstChild); }
    el.textContent=t("book.req"); setTimeout(function(){ if(el) el.textContent=""; },2800);
  }

  function next(){
    if(!valid(step)){ flash(); return; }
    if(step===3){ collect(); confirm(); return; }
    setStep(step+1);
  }
  function back(){ if(step>0) setStep(step-1); }

  function collect(){
    state.name=$("#bk-name").value.trim();
    state.phone=$("#bk-phone").value.trim();
    state.email=$("#bk-email")?$("#bk-email").value.trim():"";
    state.msg=$("#bk-msg")?$("#bk-msg").value.trim():"";
  }

  function confirm(){
    var s=$("#bk-summary");
    if(s){
      s.innerHTML=
        row(t("book.sum.svc"), t(state.svcKey))+
        row(t("book.sum.ch"), t(state.chKey))+
        row(t("book.sum.when"), state.date+" · "+state.time)+
        row(t("book.sum.name"), state.name);
    }
    setStep(TOTAL);
  }
  function row(k,v){ return '<div class="row"><span>'+k+'</span><b>'+(v||"—")+'</b></div>'; }

  function restart(){
    state={svcKey:null,chKey:null,date:"",time:"",name:"",phone:"",email:"",msg:""};
    $all(".opt,.slot").forEach(function(x){x.classList.remove("sel");});
    ["bk-name","bk-phone","bk-email","bk-msg","bk-date"].forEach(function(id){ var e=document.getElementById(id); if(e) e.value=""; });
    setStep(0);
  }
})();
