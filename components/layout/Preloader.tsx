/**
 * Loading screen, after the brand film (NAMMA_Hero_B): a truck, a ship
 * and a plane draw on in yellow line art, the plane traces the Namma "N", the N
 * fills, and the screen lifts. A fast counter runs 0 to 100 at the bottom left.
 *
 * Plain HTML + an inline script so it paints with the first byte, before React.
 * Shown on every page load and every page change, until the page's images and fonts
 * are in (so it lasts as long as each visitor's connection needs); skipped for reduced motion (see the head script
 * in app/[locale]/layout.tsx, which sets html.nl-on). Page intros wait for it
 * through LoaderGate / whenLoaderDone (lib/loader.ts).
 */

const N_PATH = "M225 3H182L141 42L140 3L96 4L0 96V127H49L95 84L97 127H137L225 42Z";

const script = `(function(){
var d=document.documentElement,el=document.getElementById('nl');if(!el)return;
if(matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.remove('nl-on');return;}
var q=function(s){return el.querySelector(s)},qa=function(s){return [].slice.call(el.querySelectorAll(s))};
var num=q('[data-nl-num]'),bar=q('[data-nl-bar]'),cap=q('[data-nl-cap]'),caps=(el.getAttribute('data-caps')||'').split('|');
var nLine=q('[data-n-line]'),pen=q('[data-pen]'),nFill=q('[data-n-fill]'),L=nLine.getTotalLength();
var E='cubic-bezier(.22,1,.36,1)',EI='cubic-bezier(.55,0,.75,.2)',G=['truck','ship','plane'];
var run=0,shown=0,t0=0,firstLoad=true,pageLoaded=document.readyState==='complete',navFrom=null,loopT=null,stageI=0;
addEventListener('load',function(){pageLoaded=true});
function anims(){try{return el.getAnimations({subtree:true})}catch(e){return []}}
function draw(g){qa('[data-g="'+g+'"] [data-d]').forEach(function(p,i){p.animate([{strokeDashoffset:1},{strokeDashoffset:0}],{duration:560,delay:i*50,easing:E,fill:'both'})})}
function enter(g){q('[data-g="'+g+'"]').animate([{opacity:0,transform:'translateX(-46px)'},{opacity:1,transform:'none'}],{duration:480,easing:E,fill:'forwards'})}
function leave(g){q('[data-g="'+g+'"]').animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateX(70px)'}],{duration:240,easing:EI,fill:'forwards'})}
function caption(i){if(!cap)return;cap.textContent=caps[i]||'';cap.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:340,easing:E,fill:'both'})}
/* Road, sea, air on a loop while the page is loading. */
function loop(r){if(r!==run)return;var g=G[stageI%3];enter(g);draw(g);caption(stageI%3);
loopT=setTimeout(function(){if(r!==run)return;leave(g);stageI++;loopT=setTimeout(function(){loop(r)},260)},880)}
/* What the page still needs: the images in view (or marked eager), the fonts and, on a first visit, the load event. */
function progress(){if(document.readyState==='loading')return{p:.1,done:false};
var imgs=[].slice.call(document.images).filter(function(i){if(el.contains(i))return false;var r=i.getBoundingClientRect();if(!r.width&&!r.height)return false;return i.loading!=='lazy'||(r.top<innerHeight*1.3&&r.bottom>-50)});
var ok=imgs.filter(function(i){return i.complete}).length,f=imgs.length?ok/imgs.length:1,fonts=!document.fonts||document.fonts.status==='loaded';
return{p:.15+.75*f+(fonts?.1:0),done:f>=1&&fonts&&(!firstLoad||pageLoaded)}}
function start(nav){run++;var r=run;clearTimeout(loopT);anims().forEach(function(a){a.cancel()});
nLine.style.strokeDashoffset='1';pen.style.opacity='0';d.classList.add('nl-on');
window.__nammaLoading=true;window.dispatchEvent(new Event('namma:loading'));
shown=0;stageI=0;t0=performance.now();navFrom=nav?location.pathname:null;num.textContent='0';bar.style.transform='scaleX(0)';
requestAnimationFrame(function(){requestAnimationFrame(function(){loop(r);tick(r)})})}
function tick(r){if(r!==run)return;var now=performance.now(),el2=now-t0;
/* A client-side page change: measure once the new page is in (or give up waiting after 4s). */
var waiting=navFrom!==null&&location.pathname===navFrom&&el2<4000;if(navFrom!==null&&!waiting)navFrom=null;
var pr=waiting?{p:.1,done:false}:progress(),cap12=el2>12000;
var target=cap12||pr.done?100:Math.min(96,pr.p*100);
shown+=Math.max(.35,(target-shown)*.09);if(shown>target)shown=target;
/* Never a flash: at least ~0.9s on screen, even on a fast line. */
if(el2<900&&shown>92)shown=92;
var v=Math.round(shown);num.textContent=String(v);bar.style.transform='scaleX('+(v/100)+')';
if(v>=100)finale(r);else requestAnimationFrame(function(){tick(r)})}
/* Loaded: the plane draws the N, the N fills, the curtain lifts. */
function finale(r){clearTimeout(loopT);G.forEach(function(g){var n=q('[data-g="'+g+'"]');if(getComputedStyle(n).opacity>0.05)leave(g)});
caption(3);pen.style.opacity='1';var s=performance.now(),TD=620;
(function f(t){if(r!==run)return;var k=Math.min(1,(t-s)/TD),e=1-Math.pow(1-k,3),l=e*L,a=nLine.getPointAtLength(l),b=nLine.getPointAtLength(Math.min(L,l+1.5));
nLine.style.strokeDashoffset=String(1-e);pen.setAttribute('transform','translate('+a.x+' '+a.y+') rotate('+(Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI)+')');
if(k<1)requestAnimationFrame(f);else{pen.animate([{opacity:1},{opacity:0}],{duration:160,fill:'forwards'});nFill.animate([{opacity:0},{opacity:1}],{duration:300,easing:E,fill:'forwards'});setTimeout(function(){out(r)},380)}})(s)}
function out(r){if(r!==run)return;q('[data-nl-stage]').animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.92)'}],{duration:380,easing:EI,fill:'forwards'});
qa('[data-nl-meta]').forEach(function(m){m.animate([{opacity:1},{opacity:0}],{duration:280,fill:'forwards'})});
var a=el.animate([{clipPath:'inset(0 0 0 0)'},{clipPath:'inset(0 0 100% 0)'}],{duration:760,delay:220,easing:'cubic-bezier(.76,0,.24,1)',fill:'forwards'});
/* The page starts its entrance while the curtain is lifting. */
setTimeout(function(){if(r!==run)return;firstLoad=false;window.__nammaLoading=false;window.dispatchEvent(new Event('namma:loaded'))},380);
a.onfinish=function(){if(r===run)d.classList.remove('nl-on')}}
/* Every page change shows it too: internal links (and back/forward) start a new run at once. */
document.addEventListener('click',function(e){if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a||a.target&&a.target!=='_self'||a.hasAttribute('download'))return;
var u;try{u=new URL(a.href,location.href)}catch(x){return}if(u.origin!==location.origin||u.pathname===location.pathname)return;
start(true)},true);
addEventListener('popstate',function(){start(true)});
addEventListener('pageshow',function(e){if(e.persisted)start(false)});
start(false);
})();`;

const COPY = {
  en: { label: "Loading", caps: "By land|By sea|By air|Namma" },
  ar: { label: "جارٍ التحميل", caps: "برًّا|بحرًا|جوًّا|نما" },
} as const;

const D = 'data-d="" pathLength="1"';

/** Plain markup: React only owns the wrapper, so the script can drive the inside freely. */
function markup(c: (typeof COPY)[keyof typeof COPY]) {
  return `<div class="nl__stage" data-nl-stage="">
<svg class="nl__art" viewBox="0 0 240 140" fill="none">
<g data-g="truck">
<path ${D} d="M22 52H40M14 66H36M24 80H40"/>
<path ${D} d="M52 40H142V96H52Z"/>
<path ${D} d="M142 58H172L190 78V96H142"/>
<path ${D} d="M150 64H168L178 76H150Z"/>
<g data-wheels=""><circle ${D} cx="74" cy="100" r="9"/><circle ${D} cx="98" cy="100" r="9"/><circle ${D} cx="172" cy="100" r="9"/></g>
</g>
<g data-g="ship">
<path ${D} d="M30 86H210L194 108H48Z"/>
<path ${D} d="M70 62H96V86H70ZM96 62H122V86H96ZM83 40H109V62H83Z"/>
<path ${D} d="M150 56H172V86H150ZM164 56V40"/>
<path ${D} d="M30 120q10-7 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0"/>
</g>
<g data-g="plane">
<path ${D} d="M14 70H30M8 80H28M16 90H30"/>
<path ${D} d="M50 72H184C200 72 210 76 212 79C210 82 200 86 184 86H54C48 86 46 82 46 79C46 76 48 72 50 72Z"/>
<path ${D} d="M58 72L44 48H58L82 72"/>
<path ${D} d="M120 84L94 116H110L150 84M126 72L110 54H120L142 72"/>
</g>
<g data-g="n" transform="translate(7.5 6)">
<path data-n-fill="" class="nl__fill" d="${N_PATH}"/>
<path data-n-line="" pathLength="1" d="${N_PATH}"/>
<path data-pen="" class="nl__pen" d="M9 0L-5 -2.6L-8 -8H-10.5L-9 -2.2L-13 -1.8L-15 -5H-16.5V5H-15L-13 1.8L-9 2.2L-10.5 8H-8L-5 2.6Z"/>
</g>
</svg>
<p class="nl__cap" data-nl-cap=""></p>
</div>
<div class="nl__count" data-nl-meta=""><span class="nl__label">${c.label}</span><span class="nl__num"><span data-nl-num="">0</span><i>%</i></span></div>
<span class="nl__bar" data-nl-bar="" data-nl-meta=""></span>`;
}

export function Preloader({ locale }: { locale: string }) {
  const c = locale === "ar" ? COPY.ar : COPY.en;
  return (
    <>
      <div id="nl" className="nl" aria-hidden="true" data-caps={c.caps} dangerouslySetInnerHTML={{ __html: markup(c) }} suppressHydrationWarning />
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}

/** Head script: decide before first paint whether the loading screen runs. */
export const preloaderHeadScript = `(function(){try{var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('nl-on');window.__nammaLoading=true}catch(e){}})();`;
