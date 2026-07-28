
(function(){
 const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
 const menu=$("#menu-toggle"),links=$("#nav-links");if(menu&&links)menu.addEventListener("click",()=>links.classList.toggle("open"));
 $$('a[data-cta]').forEach(a=>a.addEventListener('click',()=>{const k='akg_cta_'+(a.dataset.cta||'unknown');localStorage.setItem(k,String((Number(localStorage.getItem(k))||0)+1))}));
 $$('.faq details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)$$('.faq details').filter(x=>x!==d).forEach(x=>x.open=false)}));
 const jc=$("#join-confirm"),jb=$("#join-button");if(jc&&jb){jb.classList.add("disabled");jb.setAttribute("aria-disabled","true");jb.addEventListener("click",e=>{if(!jc.checked)e.preventDefault()});jc.addEventListener("change",()=>{jb.classList.toggle("disabled",!jc.checked);jb.setAttribute("aria-disabled",String(!jc.checked))})}
 const cf=$("#cost-form");if(cf){const calc=()=>{const n=id=>Number($("#"+id).value)||0,m=Math.max(1,n("months")),t=n("initial")+m*(n("monthly")+n("shipping")+n("platform")+n("training"));$("#cost-total").textContent=t.toLocaleString("zh-TW",{style:"currency",currency:"TWD",maximumFractionDigits:0});$("#cost-monthly").textContent=(t/m).toLocaleString("zh-TW",{style:"currency",currency:"TWD",maximumFractionDigits:0})};cf.addEventListener("input",calc);calc()}
 const bf=$("#bonus-form");if(bf){const calc=()=>{const n=id=>Number($("#"+id).value)||0,g=n("personalSales")*n("personalRate")/100+n("groupSales")*n("groupRate")/100,net=g-n("businessCosts");$("#bonus-gross").textContent=g.toLocaleString("zh-TW",{style:"currency",currency:"TWD",maximumFractionDigits:0});$("#bonus-net").textContent=net.toLocaleString("zh-TW",{style:"currency",currency:"TWD",maximumFractionDigits:0})};bf.addEventListener("input",calc);calc()}
 $$(".compare-filter").forEach(btn=>btn.addEventListener("click",()=>{const t=btn.dataset.target;$$(".compare-panel").forEach(p=>p.classList.toggle("hidden",t!=="all"&&p.dataset.panel!==t));$$(".compare-filter").forEach(b=>b.classList.toggle("primary",b===btn))}));
})();
