// Shared by every page: the header tone, the mobile menu, the Monday before-and-after, and the booking form.
(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var RM=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// the current page is marked in the nav: Transformation, Consulting, Training and About each have their own tab
var page=document.body.getAttribute("data-page");
$$(".nav .links a.pill,.sheet>a").forEach(function(a){if(a.getAttribute("data-p")===page){a.classList.add("on");a.setAttribute("aria-current","page")}});

// ---- every page opens at its top, out of the night. The artifact host can carry the scroll position from one page
// to the next, which dropped people at the next page's footer, so links fade out, reset the scroll, then go. ----
var veil=$(".veil");
function top0(){if(!location.hash)window.scrollTo({top:0,left:0,behavior:"instant"})}
var navType=((performance.getEntriesByType&&performance.getEntriesByType("navigation")[0])||{}).type;
if(navType!=="back_forward"&&!window.__heroResume){top0();window.addEventListener("load",top0)}
// a visit lasts while someone keeps moving around the site: the homepage story replays only after 30 minutes away
try{var hs=+localStorage.getItem("traq-hero-seen");if(hs>0&&Date.now()-hs<30*60*1000)localStorage.setItem("traq-hero-seen",String(Date.now()))}catch(e){}
if(veil){
 requestAnimationFrame(function(){requestAnimationFrame(function(){veil.classList.add("gone")})});
 window.addEventListener("pageshow",function(e){if(e.persisted){veil.classList.remove("leave");veil.classList.add("gone")}});
}
document.addEventListener("click",function(e){
 var a=e.target.closest&&e.target.closest("a[href]");
 if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target)return;
 var href=a.getAttribute("href");if(!href||href.charAt(0)==="#"||/^(mailto|tel|https?):/i.test(href))return;
 var url=new URL(href,location.href);if(url.pathname===location.pathname&&url.hash)return;
 e.preventDefault();
 function go(){window.scrollTo({top:0,left:0,behavior:"instant"});location.href=url.href}
 if(RM||!veil){go();return}
 veil.classList.remove("gone");veil.classList.add("leave");setTimeout(go,230);
});

// ---- opening words rise in one at a time; the page's own script decides when (it adds .shown) ----
$$("[data-rise]").forEach(function(h){
 var i=0;h.innerHTML=h.innerHTML.split(/(\s+)/).map(function(p){return !p||/^\s+$/.test(p)?p:'<span class="w" style="transition-delay:'+(i++*.07).toFixed(2)+'s">'+p+'</span>'}).join("");
});

// ---- page openings: a few seconds of the film play once and rest on the last frame, then the words arrive ----
var ph=$(".phero");
if(ph){
 var md=$(".media",ph),words=$$("[data-rise] .w",ph),after=.15+words.length*.07+.15;
 words.forEach(function(w,i){w.style.transitionDelay=(.15+i*.07).toFixed(2)+"s"});
 $$(".lift",ph).forEach(function(el){if(el.classList.contains("crumb")){el.style.transitionDelay="0s";return}el.style.transitionDelay=after.toFixed(2)+"s";after+=.15});
 if(md){
  var clip=md.getAttribute("data-clip"),img=new Image();img.alt="";img.src=clip+".webp";
  // if the film cannot play here, its last frame stands in
  var still=function(){if(md.contains(img))return;md.textContent="";md.appendChild(img);if(img.complete)md.classList.add("on");else img.onload=function(){md.classList.add("on")}};
  if(RM)still();else{
   var v=document.createElement("video");v.muted=true;v.defaultMuted=true;v.playsInline=true;v.setAttribute("playsinline","");v.setAttribute("muted","");v.preload="auto";v.src=clip+".mp4";
   md.appendChild(v);
   var late=setTimeout(still,2500);
   v.addEventListener("playing",function(){clearTimeout(late);md.classList.add("on")},{once:true});
   v.addEventListener("error",function(){clearTimeout(late);still()});
   var pr=v.play();if(pr&&pr.catch)pr.catch(function(){clearTimeout(late);still()});
  }
 }
 setTimeout(function(){ph.classList.add("shown")},RM?0:350);
}

// header: dark over the night sections, light over daylight. The problem section is night for its top part only.
var nav=$("#nav"),NIGHT=$$("[data-night]");
function tone(){
 var dark=false;
 NIGHT.forEach(function(el){var b=el.getBoundingClientRect(),f=parseFloat(el.getAttribute("data-night"))||1;if(b.top<=36&&b.top+b.height*f>36)dark=true});
 nav.classList.toggle("day",!dark);
}
function lifted(){nav.classList.toggle("lifted",window.scrollY>24)}
window.addEventListener("scroll",function(){tone();lifted()},{passive:true});window.addEventListener("resize",tone);tone();lifted();
window.__tone=tone;

// ---- the lamp: a soft light over the current item that glides to whichever item the pointer is on ----
var links=$(".nav .links"),lamp=$(".nav .lamp"),pills=$$(".nav .links .pill");
function lampTo(el,instant){
 if(!lamp)return;
 if(!el||!el.offsetWidth){lamp.classList.remove("lit");return}
 if(instant){lamp.style.transition="none";requestAnimationFrame(function(){lamp.style.transition=""})}
 lamp.style.width=el.offsetWidth+"px";lamp.style.transform="translate3d("+el.offsetLeft+"px,0,0)";lamp.classList.add("lit");
}
function home(instant){lampTo($(".nav .links .pill.on"),instant)}
if(links&&lamp){
 pills.forEach(function(el){el.addEventListener("mouseenter",function(){lampTo(el)});el.addEventListener("focus",function(){lampTo(el)})});
 links.addEventListener("mouseleave",function(){home()});
 home(true);window.addEventListener("resize",function(){home(true)});
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){home(true)});
}

// ---- the Services menu: opens on hover and keyboard focus, closes on leaving, Escape or a click elsewhere ----
var dd=$(".nav .dd"),shut=null;
if(dd){
 var trig=$(".pill",dd);
 var openDD=function(){clearTimeout(shut);dd.classList.add("open");trig.setAttribute("aria-expanded","true")};
 var closeDD=function(){clearTimeout(shut);dd.classList.remove("open");trig.setAttribute("aria-expanded","false")};
 dd.addEventListener("mouseenter",openDD);
 dd.addEventListener("mouseleave",function(){clearTimeout(shut);shut=setTimeout(closeDD,140)});
 dd.addEventListener("focusin",openDD);
 dd.addEventListener("focusout",function(e){if(!dd.contains(e.relatedTarget))closeDD()});
 // on touch screens the first tap opens the menu instead of following the link
 var tap=false;
 trig.addEventListener("pointerdown",function(e){tap=e.pointerType!=="mouse"&&!dd.classList.contains("open")});
 trig.addEventListener("click",function(e){if(tap){e.preventDefault();tap=false;openDD()}});
 document.addEventListener("keydown",function(e){if(e.key==="Escape"){closeDD();trig.blur()}});
 document.addEventListener("click",function(e){if(!dd.contains(e.target))closeDD()});
}

// mobile menu
var sheet=$(".sheet"),mb=$(".menu-btn");
if(mb&&sheet){
 mb.addEventListener("click",function(){var o=!sheet.classList.contains("open");sheet.classList.toggle("open",o);mb.setAttribute("aria-expanded",String(o));mb.textContent=o?"Close":"Menu";document.body.style.overflow=o?"hidden":""});
 $$("a",sheet).forEach(function(a){a.addEventListener("click",function(){sheet.classList.remove("open");mb.setAttribute("aria-expanded","false");mb.textContent="Menu";document.body.style.overflow=""})});
}

// ---- reveals: blocks marked .rv (and each Transformation chapter) rise in once, as they come into view ----
var rv=$$(".rv,.chap");
if(rv.length&&!RM&&"IntersectionObserver" in window){
 document.documentElement.classList.add("rvon");
 var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add("seen");io.unobserve(e.target)}})},{rootMargin:"0px 0px -12% 0px",threshold:.08});
 rv.forEach(function(el){
  // anything already on screen when the page opens shows straight away, so nothing blinks out and back
  var r=el.getBoundingClientRect();if(r.top<innerHeight*.92&&r.bottom>0){el.classList.add("seen");return}
  io.observe(el)});
}

// ---- a Monday at your business: the scattered beams of today line up and leave as one gold line ----
var mon=$(".monday");
if(mon){
 var cv=$("canvas",mon),cx=cv.getContext("2d"),btns=$$(".toggle button",mon),target=0,s=0,W=0,H=0,dpr=1,auto=false;
 var COL=["#EA4335","#34A853","#4285F4","#38BDF8","#FBBC04","#FF7A59","#E01E5A","#25D366"];
 var L=COL.map(function(c,i){var r=function(n){var x=Math.sin((i+1)*n*12.9898)*43758.5453;return x-Math.floor(x)};return {c:c,x:r(1),y:r(2),a:r(3)*Math.PI,ph:r(4)*6}});
 function size(){dpr=Math.min(window.devicePixelRatio||1,2);W=mon.clientWidth;H=mon.clientHeight;cv.width=W*dpr;cv.height=H*dpr}
 function set(n){target=n;mon.classList.toggle("calm",n===1);btns.forEach(function(b){b.setAttribute("aria-pressed",String(+b.dataset.v===n))})}
 btns.forEach(function(b){b.addEventListener("click",function(){auto=true;set(+b.dataset.v)})});
 function ease(x){return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2}
 function hex(h,a){var n=parseInt(h.slice(1),16);return "rgba("+(n>>16&255)+","+(n>>8&255)+","+(n&255)+","+a+")"}
 function draw(t){
  s+=(target-s)*(RM?1:.035);var e=ease(Math.max(0,Math.min(1,s)));
  cx.setTransform(dpr,0,0,dpr,0,0);
  cx.fillStyle="#07050E";cx.fillRect(0,0,W,H);
  var mob=W<700,Fx=mob?W*.86:W*.9,Fy=mob?H*.93:H*.84;
  // dawn comes up where the light lands
  var g=cx.createRadialGradient(Fx,Fy,0,Fx,Fy,Math.max(W,H)*.95);
  g.addColorStop(0,"rgba(242,176,120,"+(.5*e)+")");g.addColorStop(.3,"rgba(122,90,110,"+(.4*e)+")");g.addColorStop(.7,"rgba(58,40,90,"+(.35*e)+")");g.addColorStop(1,"rgba(20,12,34,0)");
  cx.fillStyle=g;cx.fillRect(0,0,W,H);
  cx.globalCompositeOperation="lighter";cx.lineCap="round";
  var D=Math.hypot(W,H);
  L.forEach(function(l,i){
   var sway=RM?0:Math.sin(t*.5+l.ph)*.25,a=l.a+sway,mx=l.x*W,my=l.y*H;
   var ax=mx-Math.cos(a)*D,ay=my-Math.sin(a)*D,bx=mx+Math.cos(a)*D,by=my+Math.sin(a)*D;
   var cy0=H*(.08+.84*i/(L.length-1)),qx=-20,qy=cy0;
   var x0=ax+(qx-ax)*e,y0=ay+(qy-ay)*e,x1=bx+(Fx-bx)*e,y1=by+(Fy-by)*e;
   var fl=(1-e)*(.55+.45*Math.abs(Math.sin(t*4.1+l.ph*5)))+e;
   [[9,.05],[3,.16],[1.1,.7]].forEach(function(w){cx.strokeStyle=hex(l.c,w[1]*fl*(.8+.1*e));cx.lineWidth=w[0];cx.beginPath();cx.moveTo(x0,y0);cx.lineTo(x1,y1);cx.stroke()});
  });
  if(e>.02){
   [[26,.05],[12,.1],[5,.22],[1.8,.9]].forEach(function(w){cx.strokeStyle="rgba(255,232,190,"+(w[1]*e)+")";cx.lineWidth=w[0];cx.beginPath();cx.moveTo(Fx,Fy);cx.lineTo(W+20,Fy);cx.stroke()});
   var fg=cx.createRadialGradient(Fx,Fy,0,Fx,Fy,70);fg.addColorStop(0,"rgba(255,248,235,"+(.9*e)+")");fg.addColorStop(1,"rgba(242,194,123,0)");cx.fillStyle=fg;cx.beginPath();cx.arc(Fx,Fy,70,0,6.3);cx.fill();
  }
  cx.globalCompositeOperation="source-over";
  // keep the words readable
  var sh=cx.createLinearGradient(0,0,W,0);sh.addColorStop(0,"rgba(7,5,14,.72)");sh.addColorStop(.55,"rgba(7,5,14,.45)");sh.addColorStop(1,"rgba(7,5,14,.25)");cx.fillStyle=sh;cx.fillRect(0,0,W,H);
 }
 var vis=false;
 if("IntersectionObserver" in window){new IntersectionObserver(function(en){vis=en[0].isIntersecting;
  // the one orchestrated moment: the first time the panel is properly in view, Monday turns calm on its own
  if(vis&&!auto){auto=true;setTimeout(function(){set(1)},1400)}},{threshold:.55}).observe(mon)}else{vis=true}
 size();window.addEventListener("resize",size);
 var t0=performance.now();(function loop(now){if(vis||Math.abs(target-s)>.001)draw((now-t0)/1000);requestAnimationFrame(loop)})(t0);
 set(0);
}

// ---- the contact form: sent to /api/contact, which emails the inquiry to the team. If that fails, say so and give the
// address, so nobody is left thinking it went through. ----
var form=$(".form");
if(form){
 var f=$("form",form),btn=$("button[type=submit]",f),msg=$(".alt",f),busy=false;
 f.addEventListener("submit",function(ev){
  ev.preventDefault();if(busy||!f.reportValidity())return;
  var d={};new FormData(f).forEach(function(v,k){d[k]=String(v).trim()});
  busy=true;btn.disabled=true;btn.textContent="Sending…";msg.classList.remove("err");
  fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)})
   .then(function(r){if(!r.ok)throw new Error(r.status);form.classList.add("sent");if(window.gtag)gtag("event","generate_lead",{form:"contact",topic:d.topic});form.scrollIntoView({behavior:RM?"auto":"smooth",block:"center"})})
   .catch(function(){busy=false;btn.disabled=false;btn.textContent="Send inquiry";msg.classList.add("err");
    msg.innerHTML='That didn&#8217;t send. Please email <a class="link" href="mailto:hello@traqcollective.com">hello@traqcollective.com</a> or call <a class="link" href="tel:+971508687196">+971 50 868 7196</a>.'});
 });
 // arriving from a page about one service (?for=training) picks it in "What is this about?"
 var pre=new URLSearchParams(location.search).get("for"),sel=$("select[name=topic]",f);
 if(pre&&sel&&$('option[value="'+pre+'"]',sel))sel.value=pre;
}
})();
