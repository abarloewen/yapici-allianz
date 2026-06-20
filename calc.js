/* =========================================================
   Yapıcı · Allianz Agentur — calculator suite
   Kfz · Altersvorsorge · Bedarfs-Check · Risikoleben
   Front-end estimates for design preview (non-binding).
   ========================================================= */
(function(){
  "use strict";
  function t(k){ return (window.YP ? window.YP.t(k) : k); }
  function $(s,c){ return (c||document).querySelector(s); }
  function $all(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); }

  function eur(n){
    var lang=(window.YP&&window.YP.lang)||"de";
    var loc={de:"de-DE",tr:"tr-TR",ru:"ru-RU",ar:"ar"}[lang]||"de-DE";
    try{ return new Intl.NumberFormat(loc,{numberingSystem:"latn",maximumFractionDigits:0}).format(Math.round(n))+" €"; }
    catch(e){ return Math.round(n).toLocaleString()+" €"; }
  }

  /* generic single-select segmented control */
  function segValue(grp){ var b=$(".sel",grp); return b?b.getAttribute("data-val"):null; }
  function initSeg(grp,onChange){
    $all("button",grp).forEach(function(b){
      b.addEventListener("click",function(){
        $all("button",grp).forEach(function(x){x.classList.remove("sel");});
        b.classList.add("sel"); onChange();
      });
    });
  }
  function bindRange(id,onChange,fmt){
    var r=document.getElementById(id), v=document.getElementById(id+"-v");
    if(!r) return;
    function upd(){ if(v) v.textContent=(fmt?fmt(+r.value):r.value); onChange(); }
    r.addEventListener("input",upd); upd();
  }
  function bindNum(id,onChange){ var el=document.getElementById(id); if(el) el.addEventListener("input",onChange); }

  /* ---------------- KFZ ---------------- */
  function calcKfz(){
    if(!document.getElementById("k-age")) return;
    var vehicle=segValue($("#k-vehicle"))||"mid";
    var cover=segValue($("#k-cover"))||"haft";
    var age=+document.getElementById("k-age").value;
    var km=+document.getElementById("k-km").value;
    var region=segValue($("#k-region"))||"town";
    var sfr=+document.getElementById("k-sfr").value;

    var base={small:220,mid:340,suv:480,lux:720}[vehicle];
    var coverF={haft:1.0,teil:1.45,voll:2.1}[cover];
    var ageF = age<25?1.8 : age<30?1.35 : age<50?1.0 : age<70?0.92 : 1.12;
    var regF={city:1.25,town:1.05,rural:0.9}[region];
    var kmF=0.85+(km/50000)*0.45;
    var disc=Math.min(sfr*2.4,65)/100;

    var annual=base*coverF*ageF*regF*kmF*(1-disc);
    var monthly=annual/12;

    document.getElementById("k-amount").textContent=eur(monthly);
    setRow("k-bd-base",eur(base*ageF*kmF/12));
    setRow("k-bd-cover","×"+coverF.toFixed(2));
    setRow("k-bd-region","×"+regF.toFixed(2));
    setRow("k-bd-sfr","−"+Math.round(disc*100)+"%");
  }

  /* ---------------- VORSORGE ---------------- */
  function calcVorsorge(){
    if(!document.getElementById("v-age")) return;
    var age=+document.getElementById("v-age").value;
    var retire=+document.getElementById("v-retire").value;
    var income=+(document.getElementById("v-income").value||0);
    var saved=+(document.getElementById("v-saved").value||0);

    var years=Math.max(retire-age,1);
    var monthsRetire=Math.max((84-retire)*12,12);
    var target=income*0.80;
    var state=income*0.48;
    var gap=Math.max(target-state,0);

    var capitalNeeded=gap*monthsRetire;
    var fvSaved=saved*Math.pow(1.03,years);
    var net=Math.max(capitalNeeded-fvSaved,0);

    var r=0.03/12, m=years*12;
    var factor=(Math.pow(1+r,m)-1)/r;
    var monthlySave= factor>0 ? net/factor : net/m;

    document.getElementById("v-amount").textContent=eur(monthlySave);
    document.getElementById("v-gap").textContent=eur(gap);
    setRow("v-bd-years",years+"");
    setRow("v-bd-target",eur(target));
    setRow("v-bd-state",eur(state));
    setRow("v-bd-gap",eur(gap));
  }

  /* ---------------- LEBEN ---------------- */
  function calcLeben(){
    if(!document.getElementById("l-years")) return;
    var income=+(document.getElementById("l-income").value||0);
    var years=+document.getElementById("l-years").value;
    var debts=+(document.getElementById("l-debts").value||0);
    var kids=+document.getElementById("l-children").value;

    var rep=income*years;
    var kidSum=kids*25000;
    var sum=rep+debts+kidSum;

    document.getElementById("l-amount").textContent=eur(sum);
    setRow("l-bd-income",eur(rep));
    setRow("l-bd-debts",eur(debts));
    setRow("l-bd-kids",eur(kidSum));
  }

  /* ---------------- MULTI ---------------- */
  function calcMulti(){
    var box=document.getElementById("m-reco"); if(!box) return;
    var car=segValue($("#m-car")), house=segValue($("#m-house")), fam=segValue($("#m-family")), self=segValue($("#m-self"));
    var keys=["svc.haft.t","svc.vorsorge.t"]; // always
    if(car==="yes") keys.push("svc.kfz.t");
    if(house==="rent"||house==="own") keys.push("svc.hausrat.t");
    if(fam==="yes"){ keys.push("svc.leben.t"); keys.push("svc.kranken.t"); }
    if(self==="yes"){ keys.push("svc.gewerbe.t"); keys.push("svc.recht.t"); }
    // unique
    keys=keys.filter(function(v,i){return keys.indexOf(v)===i;});
    box.innerHTML=keys.map(function(k){
      return '<span class="pill" style="margin:.25rem .35rem .25rem 0">'+t(k)+'</span>';
    }).join("");
    var c=document.getElementById("m-count"); if(c) c.textContent=keys.length;
  }

  function setRow(id,val){ var el=document.getElementById(id); if(el) el.textContent=val; }

  /* ---------------- Tabs ---------------- */
  function initTabs(){
    var tabs=$all(".calc__tab"); if(!tabs.length) return;
    tabs.forEach(function(tb){
      tb.addEventListener("click",function(){
        var pane=tb.getAttribute("data-tab");
        tabs.forEach(function(x){x.classList.remove("active");}); tb.classList.add("active");
        $all(".calc__pane").forEach(function(p){ p.classList.toggle("active", p.getAttribute("data-pane")===pane); });
      });
    });
  }

  function recalcAll(){ calcKfz(); calcVorsorge(); calcLeben(); calcMulti(); }

  function init(){
    if(!document.querySelector(".calc")) return;
    initTabs();

    // KFZ
    if($("#k-vehicle")){
      initSeg($("#k-vehicle"),calcKfz); initSeg($("#k-cover"),calcKfz); initSeg($("#k-region"),calcKfz);
      bindRange("k-age",calcKfz); bindRange("k-km",calcKfz,function(v){return new Intl.NumberFormat("de-DE").format(v)+" km";});
      bindRange("k-sfr",calcKfz,function(v){return v+" J.";});
    }
    // VORSORGE
    if($("#v-age")){
      bindRange("v-age",calcVorsorge,function(v){return v+"";});
      bindRange("v-retire",calcVorsorge,function(v){return v+"";});
      bindNum("v-income",calcVorsorge); bindNum("v-saved",calcVorsorge);
    }
    // LEBEN
    if($("#l-years")){
      bindNum("l-income",calcLeben); bindRange("l-years",calcLeben,function(v){return v+"";});
      bindNum("l-debts",calcLeben); bindRange("l-children",calcLeben,function(v){return v+"";});
    }
    // MULTI
    if($("#m-car")){ initSeg($("#m-car"),calcMulti); initSeg($("#m-house"),calcMulti); initSeg($("#m-family"),calcMulti); initSeg($("#m-self"),calcMulti); }

    recalcAll();
    document.addEventListener("yp:lang",recalcAll); // reformat numbers + reco labels on language switch
  }

  document.addEventListener("DOMContentLoaded",init);
})();
