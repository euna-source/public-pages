import {springs,gsapTransition,stagger} from './generated/motion.mjs';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const preference=matchMedia('(prefers-reduced-motion: reduce)');
window.c8EpisodeRequest=()=>{};window.c8VideoRequest=()=>{};
const reduced=()=>preference.matches||document.body.classList.contains('rm');
const active=new Set(), history=[];
function animate(el,frames,token,delay=0){
  if(!el||reduced()) return null;
  const s=springs[token], key=token.replace('.','-'), css=getComputedStyle(document.documentElement);
  // CSS and GSAP share the analytic spring; only transform and opacity are animated.
  const a=el.animate(frames,{duration:s.duration*1000,easing:css.getPropertyValue(`--${key}-ease`).trim(),delay:delay*1000,fill:'backwards'});
  active.add(a); a.finished.catch(()=>{}).finally(()=>active.delete(a));
  history.push({token,properties:Object.keys(frames[0]),target:el.id||el.className,section:el.closest('[data-sec]')?.id}); return a;
}
function once(el,fn){if(!el)return;const observer=new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting){observer.disconnect();fn();}},{threshold:.25});observer.observe(el);}
animate($('.hcard.main'),[{transform:'translateY(24px)'},{transform:'translateY(0)'}],'spatial.slow');

function words(el){
  const pin=el.querySelector('.pin');if(pin)pin.remove();
  const text=el.textContent.trim();el.textContent='';el.setAttribute('aria-label',text);
  const spans=text.split(/\s+/).map((word,i)=>{const s=document.createElement('span');s.className='motion-word';s.textContent=(i?' ':'')+word;s.setAttribute('aria-hidden','true');el.append(s);return s;});
  once(el,()=>spans.forEach((s,i)=>{animate(s,[{transform:'translateY(16px)'},{transform:'translateY(0)'}],'spatial.default',i*stagger);animate(s,[{opacity:0},{opacity:1}],'effects.fast',i*stagger);}));
}
words($('#bridge'));
const logo=document.createElement('span');logo.className='motion-logo';logo.textContent='C8';logo.setAttribute('aria-label','크리에이터클럽');$('.endline').prepend(logo);
once(logo,()=>animate(logo,[{transform:'scale(.8)'},{transform:'scale(1)'}],'spatial.fast'));
const media=[];
const missingAsset=label=>({src:null,poster:null,fullSrc:null,label,posterText:label,missing:'영상 목록을 불러오지 못했어요 · 새로고침해요'});
const mediaManifest=await fetch('./media.json',{signal:AbortSignal.timeout(5000)}).then(r=>{if(!r.ok)throw Error('Media manifest unavailable');return r.json();}).then(m=>{if(!m?.respect||!m?.episode)throw Error('Invalid media manifest');return m;}).catch(()=>({respect:missingAsset('리스펙트'),episode:missingAsset('대표 편')}));

// Controllers are scoped to media, with pause intent surviving viewport exits and races.
export function mountVideo(host,asset){
  const shell=document.createElement('div');shell.className='media-shell';
  const video=document.createElement('video');video.muted=true;video.loop=true;video.playsInline=true;video.preload='none';
  if(asset.poster)video.poster=asset.poster;
  const poster=document.createElement('div');poster.className='media-poster';poster.textContent=asset.posterText;
  const state=document.createElement('span');state.className='media-state';
  const button=document.createElement('button');button.type='button';button.textContent=asset.src?'재생':'영상 원본 확인 전';button.disabled=!asset.src;
  shell.append(video,poster,state,button);host.replaceChildren(shell);
  let visible=false,near=false,paused=false,manual=false,epoch=0,disposed=false,fullMode=false;
  function label(message){state.textContent=message;button.textContent=video.paused?'재생':'멈춤';button.setAttribute('aria-label',asset.label+' '+button.textContent);button.setAttribute('aria-pressed',String(!video.paused));}
  function load(){const src=fullMode?asset.fullSrc:asset.src;if(src&&video.getAttribute('src')!==src){video.src=src;video.load();}}
  function eligible(){return visible&&!document.hidden&&!paused&&(fullMode?manual:(!reduced()||manual))&&!disposed&&!shell.hidden;}
  function sync(){
    const turn=++epoch;
    if(!(fullMode?asset.fullSrc:asset.src)){state.textContent=asset.missing;return;}
    if(!eligible()){video.pause();label(reduced()?'움직임 줄이기 · 눌러서 재생':'일시정지');return;}
    load();video.play().then(()=>{if(turn!==epoch||!eligible()){if(!eligible())video.pause();return;}shell.dataset.ready='true';label('');}).catch(()=>{if(turn===epoch){shell.dataset.ready='false';label('자동재생이 막혔어요 · 재생을 눌러요');}});
  }
  button.addEventListener('click',()=>{paused=!video.paused;manual=!paused;sync();});
  video.addEventListener('pause',()=>label(reduced()?'움직임 줄이기 · 눌러서 재생':''));
  video.addEventListener('error',()=>{paused=true;shell.dataset.ready='false';label('영상을 불러오지 못했어요 · 재생을 눌러 다시 시도해요');video.removeAttribute('src');});
  const loader=new IntersectionObserver(es=>{near=es[0].isIntersecting;if(near&&!reduced())load();},{rootMargin:'1200px 0px'});
  const viewer=new IntersectionObserver(es=>{visible=es[0].isIntersecting&&es[0].intersectionRatio>=.25;if(!visible&&fullMode){paused=true;manual=false;}sync();},{threshold:[0,.25,1]});
  loader.observe(shell);viewer.observe(shell);
  const c={video,shell,sync,getState:()=>({visible,near,paused,manual,fullMode,loaded:!!video.getAttribute('src')}),reset(){manual=false;if(fullMode)paused=true;sync();},suspend(){epoch++;if(fullMode){paused=true;manual=false;}video.pause();},show(on){shell.hidden=!on;sync();},playFull(){if(!asset.fullSrc)return false;fullMode=true;paused=false;manual=true;video.loop=false;video.muted=false;sync();return true;},dispose(){disposed=true;epoch++;video.pause();loader.disconnect();viewer.disconnect();}};
  media.push(c);sync();return c;
}
const respectHost=$('#ch02 .phone .ph');respectHost.classList.add('motion-phone');
const respectLabel=respectHost.querySelector('.scr-in');
const respect=mountVideo(respectHost,mediaManifest.respect);
respectLabel.hidden=true;respectHost.append(respectLabel);
// Original wire moves the screen between accordion items. Retain one controller, never duplicate it.
const respectFrame=$('#ch02 [data-screen]');respectFrame.querySelector('.vid-ctl').hidden=true;
window.c8ScreenChanged=(scr,d)=>{
  if(scr.closest('#ch02')){respect.show(!!d.dataset.video);respectLabel.hidden=!!d.dataset.video;return;}
  const demo=scr.querySelector('.motion-demo');if(demo){
    const old=demo.cloneNode(true);old.inert=true;old.setAttribute('aria-hidden','true');old.style.cssText='position:absolute;inset:8px;pointer-events:none;z-index:1';
    old.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));
    if(scr.closest('#ch01')){demo.querySelector('b').textContent='고르기';demo.querySelector('.motion-work').textContent=d.dataset.scr.includes('upload-type')?'영감 · 포트폴리오 · 프로젝트':'사진 · 영상 · 오디오 · PDF';}
    if(!reduced()){demo.parentNode.append(old);const out=animate(old,[{opacity:1},{opacity:0}],'effects.default');out.finished.catch(()=>{}).finally(()=>old.remove());}
    animate(demo,[{opacity:0},{opacity:1}],'effects.default');
  }
};
window.c8VideoRequest=()=>{};
const episodeHost=$('#pPh').closest('.p-ph');episodeHost.classList.add('motion-episode');
const oldEpisodeLabel=$('#pPh');
const episode=mountVideo(episodeHost,mediaManifest.episode);
oldEpisodeLabel.hidden=true;episodeHost.append(oldEpisodeLabel);
// The one-minute master is a separate explicit action. Never label the preview as a full film.
$('#pSound').textContent='소리 켜고 전체 보기';
$('#pSound').removeAttribute('aria-pressed');
let episodeSelected=4;
window.c8FeaturedChanged=n=>{episodeSelected=n;episode.show(n===4);$('#pState').textContent=n!==4?'이 편의 영상 원본 확인 전':!mediaManifest.episode.src?'대표 편 원본 확인 전':episode.video.paused?'미리보기 대기':'무음 미리보기 재생 중';};
$('#pSound').addEventListener('click',()=>{
  if(episodeSelected!==4||!episode.playFull()){$('#pState').textContent='이 편의 전체 영상 원본 확인 전';return;}
});
$('#pPause').hidden=true;$('#pBar').hidden=true;window.c8EpisodeRequest=()=>{};
$('#pState').textContent=mediaManifest.episode.src?'무음 미리보기':'대표 편 원본 확인 전';
episode.video.addEventListener('play',()=>{$('#pState').textContent=episode.getState().fullMode?'전체 영상 재생 중':'무음 미리보기 재생 중';});
episode.video.addEventListener('pause',()=>{if(episodeSelected===4&&mediaManifest.episode.src)$('#pState').textContent='일시정지';});
document.addEventListener('visibilitychange',()=>media.forEach(m=>m.sync()));
let lastReduced=reduced();
function updateReduced(){const next=reduced();if(next===lastReduced)return;lastReduced=next;if(next){active.forEach(a=>a.cancel());media.forEach(m=>m.reset());}else media.forEach(m=>m.sync());}
preference.addEventListener('change',updateReduced);
new MutationObserver(updateReduced).observe(document.body,{attributes:true,attributeFilter:['class']});
window.addEventListener('pagehide',()=>media.forEach(m=>m.suspend()));
window.addEventListener('pageshow',()=>media.forEach(m=>m.sync()));

function demo(ch,html){const host=$(`#${ch} .phone .ph`);const label=host.querySelector('.scr-in');host.classList.add('motion-phone');host.innerHTML=`<div class="motion-demo">${html}<small>와이어 예시 · 실제 앱 화면 아님</small></div>`;label.hidden=true;host.append(label);return host.firstElementChild;}
const upload=demo('ch01','<b>고르기</b><p>지금 있는 작업</p><div class="motion-work">사진 · 영상 · 오디오 · PDF</div><button class="btn sm" type="button">이 작업 올리기</button>');
upload.querySelector('button').onclick=()=>{upload.querySelector('b').textContent='올림 완료';animate(upload,[{opacity:0},{opacity:1}],'effects.default');};
$('#ch01').addEventListener('toggle',e=>{if(e.target.matches('details[open]'))animate(upload,[{opacity:0},{opacity:1}],'effects.default');},true);
const profile=demo('ch03','<span class="motion-link">c8.club / creator</span><b>내 프로필</b><div class="motion-work">작업과 이력</div>');
const profileFrame=document.createElement('div');profileFrame.className='motion-profile-frame';profileFrame.setAttribute('aria-hidden','true');profile.prepend(profileFrame);profile.classList.add('motion-profile');
once(profile,()=>{animate(profileFrame,[{transform:'scaleX(.82)'},{transform:'scaleX(1)'}],'spatial.default');animate(profile.querySelector('.motion-work'),[{opacity:0},{opacity:1}],'effects.default');});
const knock=demo('ch04','<b>첫 메시지</b><div class="motion-bubble">같이 작업하고 싶어요.</div>');
once(knock,()=>animate(knock.querySelector('.motion-bubble'),[{transform:'translateY(16px)'},{transform:'translateY(0)'}],'spatial.default'));
window.c8PreviewChanged=()=>requestAnimationFrame(()=>['#pvName','#pvJob'].forEach(s=>animate($(s),[{opacity:.5},{opacity:1}],'effects.fast')));
new MutationObserver(()=>{if($('#expOut').classList.contains('open'))animate($('#expOut .pv')||$('#expOut'),[{transform:'translateY(24px)'},{transform:'translateY(0)'}],'spatial.default');}).observe($('#expOut'),{attributes:true,attributeFilter:['class']});
const bounceButtons='.btn,.chip,.toggle-annot,.cond';
document.addEventListener('pointerdown',e=>{const b=e.target.closest(bounceButtons);if(b)animate(b,[{transform:'scale(.96)'},{transform:'scale(1)'}],'spatial.fast');});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches(bounceButtons))animate(e.target,[{transform:'scale(.96)'},{transform:'scale(1)'}],'spatial.fast');});
document.addEventListener('toggle',e=>{if(e.target.matches('details[open]'))animate(e.target.querySelector('.ibody')||e.target.lastElementChild,[{opacity:0},{opacity:1}],'effects.fast');},true);
window.__c8Motion={history,media,active,springs,gsapTransition,reduced,ready:true};
