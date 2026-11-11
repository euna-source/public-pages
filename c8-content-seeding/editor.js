/* Wiring only. The candidate sheet's status column is the send record of truth; drafts, the list and this window's
   sends live in sessionStorage and end with the window. Sender settings and reusable wording are remembered in this browser.
   Screen (v2, 2026-11-10): two columns — 쓰기 · 받는 분이 볼 모습 — one action bar with one filled button, the list in a popover. */
const SHEET_ID='1BBRYmwNxBEnUpDuLTSg6KLmVgzaxVpdfjT-aU92ZTo4';
// Tab gids for 「시트에서 보기」.
const TAB_GID={후보:'862905173',수집:'619389779'};
const KEY={people:'c8-contact-people-v1',ui:'c8-contact-ui-v2',drafts:'c8-contact-drafts-v2',tpl:'c8-contact-templates-v3',sender:'c8-contact-sender-v1',phone:'c8-contact-phone-v1',log:'c8-contact-sent-v1'};
const $=id=>document.getElementById(id);
const C=ContactMail,K=Candidates;
const store={
  get(area,k,fallback){try{const v=area.getItem(k);return v==null?fallback:JSON.parse(v);}catch(e){return fallback;}},
  set(area,k,v){try{area.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}},
  del(area,k){try{area.removeItem(k);}catch(e){}}
};
const S=window.sessionStorage,L=window.localStorage;
['c8-contact-log-v1','c8-contact-tpl-v1','c8-contact-draft-v1'].forEach(k=>{store.del(L,k);store.del(S,k);});
const icon=(id,cls)=>'<svg class="i'+(cls?' '+cls:'')+'" aria-hidden="true"><use href="#i-'+id+'"/></svg>';
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const plainName=s=>String(s||'').trim().replace(/\s*님$/,'');
const handleOf=s=>String(s||'').trim().replace(/^@/,'').replace(/^https?:\/\/(www\.)?instagram\.com\//i,'').replace(/[/?#].*$/,'');
const fmtDate=iso=>{const d=new Date(iso);return isNaN(d)?'':d.toLocaleDateString('ko-KR',{month:'long',day:'numeric'});};
const fmtTime=iso=>{const d=new Date(iso);return isNaN(d)?'':d.toLocaleTimeString('ko-KR',{hour:'numeric',minute:'2-digit'});};
const yymmdd=d=>String(d.getFullYear()).slice(2)+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0');
const setText=(el,t)=>{if(el.textContent!==t)el.textContent=t;};
const mqNarrow=matchMedia('(max-width:1023px)');   // the one width boundary, same number as the CSS

let sheet=store.get(S,KEY.people,null);
let log=store.get(S,KEY.log,[]);if(!Array.isArray(log))log=[];
let drafts=store.get(S,KEY.drafts,{});if(!drafts||typeof drafts!=='object')drafts={};
// ui.mark is no longer read (the switch is gone) but stays in the shape for windows that are already open.
let ui=Object.assign({channel:'email',current:'manual',subject:0,variant:'basic',footer:true,ad:false,mark:false,width:'desk',scope:'ready',filter:''},store.get(S,KEY.ui,{}));
// Two toggles became one scope: a window that had either one off keeps seeing everyone.
if('fBoth' in ui||'fOpen' in ui){ui.scope=(ui.fBoth===false||ui.fOpen===false)?'all':'ready';delete ui.fBoth;delete ui.fOpen;}
delete ui.tab;
if(ui.scope!=='all')ui.scope='ready';if(typeof ui.filter!=='string')ui.filter='';
let tpl=mergeTpl(null);
let attempted=false,touched=new Set(),logoBroken=false,focusSeen=false,outline='',last=null,lastChecks=[],state=null;
let sampleChannel='email',sampleVariant='basic',editReturn='compose';
let copyStale=false,foldDismissed=false,shownHints=[],hintTimer=0,listLimit=200;

// Reusable templates contain wording only. Recipient values remain in session drafts.
// Store only changed sections, so untouched sections receive future approved copy updates.
function savedTemplate(variant){
  const t=C.template(variant),saved=store.get(L,KEY.tpl,{});
  ['email','dm'].forEach(c=>Object.keys(t[c]).forEach(k=>{
    const text=saved?.[variant]?.[c]?.[k];if(typeof text==='string')t[c][k]=text;
  }));return t;
}
function mergeTpl(){return savedTemplate(ui.variant);}
function sampleMode(){return !hasSheet()&&(viewNow()==='import'||viewNow()==='edit'&&editReturn==='import');}
function wordingVariant(){return sampleMode()?sampleVariant:ui.variant;}
function wordingChannel(){return sampleMode()?sampleChannel:ui.channel;}
function saveWording(channel,key,value){
  const variant=wordingVariant(),saved=store.get(L,KEY.tpl,{}),base=C.template(variant);
  if(!saved[variant])saved[variant]={};if(!saved[variant][channel])saved[variant][channel]={};
  if(value===base[channel][key])delete saved[variant][channel][key];else saved[variant][channel][key]=value;
  const ok=store.set(L,KEY.tpl,saved);
  if(variant===ui.variant)tpl[channel][key]=value;
  if(channel==='email'&&key==='subject')ui.subject=0;
  staleCopy();setText($('wordingStatus'),ok?'이 브라우저에 자동 저장했어요.':'저장하지 못했어요. 저장 공간을 확인해 주세요.');
  render();
}
const editedKeys=()=>{const b=C.template(ui.variant);return C.EMAIL_SECTIONS.filter(k=>tpl.email[k]!==b.email[k]).map(k=>'email.'+k).concat(tpl.dm.message!==b.dm.message?['dm.message']:[]);};

/* ---------- Popovers: opened by the user only, placed next to the button that opened them ---------- */
const isOpen=p=>{try{return p.matches(':popover-open');}catch(e){return false;}};
const openPops=()=>[...document.querySelectorAll('[popover]')].filter(isOpen);
const hidePop=id=>{const p=$(id);if(isOpen(p))p.hidePopover();};
const POP_ANCHOR={recipients:'drawerToggle',listMenu:'listMenuBtn',moreMenu:'moreBtn',subjectPop:'subjectChange',checklist:'checkSummary',importInfo:'mInfo'};
const lastInvoker={};
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[popovertarget]');if(b)lastInvoker[b.getAttribute('popovertarget')]=b;},true);
const onScreen=el=>!!el&&el.isConnected&&el.getClientRects().length>0;
function anchorOf(pop){const a=lastInvoker[pop.id];if(onScreen(a))return a;const d=$(POP_ANCHOR[pop.id]);return onScreen(d)?d:$('moreBtn');}
/* Below the anchor, left edges aligned; flipped when it would leave the window, kept 8px inside every edge. */
function place(pop,anchor){
  const s=pop.style;
  if(pop.id==='recipients'&&mqNarrow.matches){s.top=s.left=s.position=s.inset=s.margin='';return;}   // full screen comes from the CSS
  anchor=onScreen(anchor)?anchor:anchorOf(pop);if(!onScreen(anchor))return;
  const r=anchor.getBoundingClientRect(),vw=window.innerWidth,vh=window.innerHeight;
  const w=pop.offsetWidth||parseFloat(getComputedStyle(pop).width)||280,h=pop.offsetHeight||0;
  let left=r.left;if(left+w>vw-8)left=r.right-w;left=Math.max(8,Math.min(left,vw-8-w));
  let top=r.bottom+6;if(h&&top+h>vh-8){const up=r.top-6-h;top=up>=8?up:Math.max(8,vh-8-h);}
  s.position='fixed';s.inset='auto';s.margin='0';s.top=Math.round(top)+'px';s.left=Math.round(left)+'px';
}
document.querySelectorAll('[popover]').forEach(pop=>{
  // beforetoggle: the width is known from the CSS, so the first frame is already beside the button. toggle: height is known, flip if needed.
  pop.addEventListener('beforetoggle',e=>{if(e.newState==='open')place(pop);});
  pop.addEventListener('toggle',e=>{
    const a=$(POP_ANCHOR[pop.id]);if(a&&a.hasAttribute('popovertarget'))a.setAttribute('aria-expanded',String(e.newState==='open'));
    if(e.newState==='open')place(pop);
  });
});
let lastW=window.innerWidth;
window.addEventListener('resize',()=>{
  // Width changes close what is open; a height-only change (phone address bar, keyboard) only moves it.
  if(window.innerWidth!==lastW){lastW=window.innerWidth;openPops().forEach(p=>p.hidePopover());}
  else openPops().forEach(p=>place(p));
});
if(!('popover' in HTMLElement.prototype))$('oldBrowser').hidden=false;

/* ---------- Clipboard: never claim a copy that did not happen ---------- */
let tt;function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),4000);}
function fallbackCopy(s){
  const ta=document.createElement('textarea');ta.value=s;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();
  let ok=false;try{ok=document.execCommand('copy');}catch(e){}
  ta.remove();return ok;
}
// Resolves true only on a real write. No await before the write: Safari allows clipboard writes only inside the click.
function writeText(s){
  if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(s).then(()=>true,()=>fallbackCopy(s));
  return Promise.resolve(fallbackCopy(s));
}
function writeRich(html,text){
  try{
    return navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([html],{type:'text/html'}),'text/plain':new Blob([text],{type:'text/plain'})})]).then(()=>true,()=>richFallback(html));
  }catch(e){return Promise.resolve(richFallback(html));}
}
function richFallback(html){
  const box=document.createElement('div');box.innerHTML=html;box.style.cssText='position:fixed;left:-9999px;top:0';document.body.appendChild(box);
  const r=document.createRange();r.selectNodeContents(box);const sel=getSelection();sel.removeAllRanges();sel.addRange(r);
  let ok=false;try{ok=document.execCommand('copy');}catch(e){}
  sel.removeAllRanges();box.remove();return ok;
}
// One filled button on screen: while a dialog is up, the bar's button lends its fill to the dialog's.
function syncPrimaryFill(){$('primary').classList.toggle('primary',!document.querySelector('dialog[open]'));}
let manualThen=null;
/* channel is given only when the text is a message body: the dialog then names where it opens, and for mail shows subject and address to select. */
function manualCopy(text,then,channel,head){
  $('manualText').value=text;$('manualOpen').hidden=!then;manualThen=then||null;
  $('manualOpen').textContent=channel==='dm'?'복사했어요 · 인스타 열기':'복사했어요 · Gmail 열기';
  const mail=channel==='email';$('manualMail').hidden=!mail;
  // Subject and address come from the same moment as the body: the person may have changed while the write was pending.
  if(mail){$('manualSubject').value=head?head.subject:last.subject;$('manualTo').value=head?head.to:$('to').value.trim();}
  $('manual').showModal();syncPrimaryFill();$('manualText').focus();$('manualText').select();
}
function flash(btn,okText){
  const label=btn.querySelector('span')||btn;const keep=label.innerHTML;
  label.innerHTML=icon('check')+esc(okText||'복사했어요');btn.dataset.flash='1';
  // After the flash the label comes from the current state, not from before the click: the state may have moved on.
  setTimeout(()=>{
    if(!btn.dataset.flash)return;
    delete btn.dataset.flash;
    if(btn.id==='primary')primarySig='';else label.innerHTML=keep;
    render();
  },2000);
}
async function copyWithFeedback(btn,text,okText){const ok=await writeText(text);if(ok)flash(btn,okText);else manualCopy(text);return ok;}

/* ---------- People ---------- */
// [후보] and [플랫폼 수집] are one list (K.merge). Every imported tab, listed or not, is indexed for blocking.
const EMPTY_POOL={people:[],byKey:new Map(),byId:new Map(),byName:new Map(),compIds:new Map(),history:[],readyOut:0};
let pool=EMPTY_POOL,fieldTop=null;
let query='';   // never stored: a search ends with the window
const hasSheet=()=>!!(sheet&&sheet.tabs&&Object.keys(sheet.tabs).length);
function listedOf(tabs){
  const names=Object.keys(tabs||{}),out={};
  names.forEach(n=>{const s=K.sourceOf(n);if(s)out[n]=s;});
  if(!Object.keys(out).length)names.forEach(n=>{const t=tabs[n];out[n]=t&&t.columns&&t.columns.purpose?'수집':'후보';});
  return out;
}
function rebuild(){
  pool=hasSheet()?K.merge(sheet.tabs,sheet.listed||listedOf(sheet.tabs)):EMPTY_POOL;
  // More than 15 fields: the 12 largest keep their own option, the rest share 「그 밖」.
  const counts=new Map();pool.people.forEach(p=>{const f=K.clean(p.field);if(f)counts.set(f,(counts.get(f)||0)+1);});
  fieldTop=counts.size>15?new Set([...counts].sort((a,b)=>b[1]-a[1]||collator.compare(a[0],b[0])).slice(0,12).map(x=>x[0])):null;
}
const collator=new Intl.Collator('ko',{numeric:true,sensitivity:'base'});
const uniq=a=>[...new Set(a)];
// Drafts follow the person (email or Instagram handle), not the row: re-imports keep each line with its owner.
const keyOf=p=>p.key||(K.ids(p)[0]?'id:'+K.ids(p)[0]:'row:'+(p.source||'')+':'+(p.row||'')+':'+plainName(p.name));
const sameIds=(a,b)=>a.some(x=>b.includes(x));
function findPerson(key){if(!key||key==='manual')return null;return pool.byKey.get(key)||null;}
function idsOfCurrent(){const ids=[];const m=$('to').value.trim().toLowerCase(),h=handleOf($('handle').value).toLowerCase();if(m)ids.push('m:'+m);if(h)ids.push('i:'+h);return ids;}
// One id stands for its whole group across every tab (mail A, handle B, a log row linking them).
const expandIds=ids=>uniq(ids.flatMap(id=>(pool.compIds&&pool.compIds.get(id))||[id]));
function matchesOf(ids,name){return ids.length?uniq(expandIds(ids).flatMap(id=>pool.byId.get(id)||[])):(name&&pool.byName.get(name))||[];}
// Pooled people carry the answer from merge (whole group, every tab); only hand-typed people are looked up here.
function blockedAnywhere(p){
  if(p.blocked!==undefined)return p.blocked;
  const hit=matchesOf(K.ids(p),plainName(p.name)).find(q=>K.blockedWhy(q));
  return hit?{why:K.blockedWhy(hit),row:hit.row,tab:hit.tab,name:plainName(hit.name),contacted:!K.uncontacted(hit)}:null;
}
function sentFor(ids,name){const x=expandIds(ids);return log.find(r=>(x.length&&sameIds(expandIds(r.ids||[]),x))||(!x.length&&r.name===name));}
const isSent=p=>!!sentFor(p.allIds||K.ids(p),plainName(p.name));
function sendable(p){return K.ready(p)&&!blockedAnywhere(p)&&!K.purposeWhy(p);}
const inScope=p=>ui.scope==='all'||(sendable(p)&&!isSent(p));
function fieldKey(p){const f=K.clean(p.field);return f&&fieldTop&&!fieldTop.has(f)?'*그밖':f;}
const inFilter=p=>!ui.filter||(ui.filter.startsWith('src:')?(p.source===ui.filter.slice(4)||p.also===ui.filter.slice(4)):fieldKey(p)===ui.filter.slice(6));
const queryTokens=()=>query.split(/\s+/).map(s=>K.nk(s).replace(/^@/,'')).filter(Boolean);
const matchesQuery=(p,t)=>(t||queryTokens()).every(x=>p.hay.includes(x));
function visible(){const t=queryTokens();return pool.people.filter(p=>inScope(p)&&inFilter(p)&&matchesQuery(p,t));}
function rowStatus(p){
  const key=keyOf(p),d=drafts[key],b=blockedAnywhere(p);
  if(isSent(p))return {t:'보냈어요',ic:'check'};
  if(b)return b.contacted?{t:'시트에 연락함',ic:'ban',dim:1}:{t:'보내지 않아요',ic:'ban',dim:1};
  if(K.purposeWhy(p))return {t:'목적 다름',ic:'ban',dim:1};
  if(!K.ready(p))return {t:'확인 전',ic:'',dim:1};
  if(!K.channelOf(p))return {t:'창구 없음',ic:'alert',dim:1};
  if(d&&d.flow==='opened')return {t:K.channelOf(p)==='dm'?'인스타 열었어요':'Gmail 열었어요',ic:'send'};
  if(d&&((d.vars&&d.vars['본 것 한 줄']||'').trim()||Object.values(d.seenByChannel||{}).some(x=>String(x).trim())))return {t:'쓰는 중',ic:'pen'};
  return {t:'연락 전',ic:''};
}
// The progress and 「n명 남음」 count the merged list, whatever the search or filter shows.
function progress(){const all=pool.people.filter(sendable);return {m:all.length,n:all.filter(isSent).length};}
// 「다음 분 쓰기」 ignores search and filter: the next sendable, unsent person after the current one.
function nextPerson(){
  const all=pool.people;if(!all.length)return null;
  const at=all.findIndex(p=>keyOf(p)===ui.current);
  for(let k=1;k<=all.length;k++){const p=all[(Math.max(at,-1)+k+all.length)%all.length];if(keyOf(p)!==ui.current&&sendable(p)&&!isSent(p))return p;}
  return null;
}

/* ---------- Form values and drafts ---------- */
const varInputs=()=>[...document.querySelectorAll('[data-var]')];
// The six [data-var] fields are always in the DOM, whichever view or popover holds them.
// 「본 것 한 줄」 is read with its particle markers resolved, so preview, checks, copy and record all use one text.
function values(){const v={};varInputs().forEach(i=>v[i.dataset.var]=i.value);v['본 것 한 줄']=C.resolveParticles(v['본 것 한 줄']||'');return v;}
const subjectTpl=()=>ui.subject===0?tpl.email.subject:C.SUBJECT_ALTERNATIVES[ui.subject-1];
const activeTpl=()=>({email:{...tpl.email,subject:subjectTpl()},dm:tpl.dm});
const renderOpts=()=>({footer:ui.footer,ad:{on:ui.ad,phone:$('adPhone').value}});
const histList=()=>pool.history.concat(log.map(x=>({name:x.name,seen:x.seen})));
function draft(){return drafts[ui.current]||(drafts[ui.current]={vars:{},to:'',handle:'',flow:''});}
function saveDraft(){
  const d=draft(),v=values();delete v['담당자명'];
  v['본 것 한 줄']=$('v-seen').value;   // the draft keeps what was typed
  if(!d.seenByChannel)d.seenByChannel={email:v['본 것 한 줄'],dm:v['본 것 한 줄']};
  d.seenByChannel[ui.channel]=v['본 것 한 줄'];
  d.vars=v;d.to=$('to').value;d.handle=$('handle').value;d.channel=ui.channel;d.subject=ui.subject;d.variant=ui.variant;
  store.set(S,KEY.drafts,drafts);store.set(S,KEY.ui,ui);
  store.set(L,KEY.sender,$('v-sender').value);store.set(L,KEY.phone,$('adPhone').value);
}
function loadDraftInto(key,p){
  const d=drafts[key];
  const set=(id,val)=>{$(id).value=val||'';};
  if(d){
    // Older drafts kept the post address only for DM people: fall back to the sheet's work address.
    set('v-name',d.vars['활동명']);set('v-platform',d.vars['플랫폼']);set('v-post',d.vars['게시물 주소']||(p&&p.url)||'');set('v-seen',d.vars['본 것 한 줄']);set('v-work',d.vars['작품명']);
    set('to',d.to);set('handle',d.handle);if(d.channel)ui.channel=d.channel;ui.subject=d.subject||0;ui.variant=d.variant||'basic';
  }else if(p){
    set('v-name',plainName(p.name));set('to',p.email);set('handle',p.handle);set('v-platform',p.platform);
    set('v-post',p.url||'');set('v-seen','');set('v-work','');
    ui.subject=0;ui.variant=C.variantOf(p.field);const ch=K.channelOf(p);if(ch)ui.channel=ch;
  }else{ui.variant='basic';['v-name','v-platform','v-post','v-seen','v-work','to','handle'].forEach(id=>set(id,''));}
  const current=draft();
  if(!current.seenByChannel)current.seenByChannel={email:$('v-seen').value,dm:$('v-seen').value};
  $('v-seen').value=current.seenByChannel[ui.channel]||'';
  touched=new Set();attempted=false;
}

/* ---------- Views of the write column: compose | import | edit | settings. Never stored, never changes the person. ---------- */
const viewNow=()=>$('writeCol').dataset.view;
function showView(v,o){
  const col=$('writeCol');col.dataset.view=v;
  col.querySelectorAll('[data-view-of]').forEach(el=>el.hidden=el.dataset.viewOf!==v);
  syncBars();
  if(state)render();   // what the bars show depends on the view
  if(!(o&&o.keep)){$('writeScroll').scrollTop=0;if(mqNarrow.matches)window.scrollTo(0,0);}
}
function syncBars(){
  const has=hasSheet(),emptyImport=viewNow()==='import'&&!has;
  $('drawerToggle').hidden=!has;$('progressText').hidden=!has;
  $('barTitle').hidden=has;$('importOpen').hidden=has||viewNow()==='import';
  // Nothing to send yet: the download is the one filled button and the action bar steps aside.
  $('actBar').classList.toggle('is-empty',emptyImport);
  $('sheetDownload').classList.toggle('primary',emptyImport);$('sheetDownload').classList.toggle('line',!emptyImport);
  $('importClose').hidden=!has;
  setText($('importTitle'),has?'명단 가져오기':'아직 명단이 없어요');
  setText($('importLead'),has?'받은 파일을 이 창에 끌어 놓거나 표를 붙여 넣으면 지금 명단에 더해요.':'시트를 내려받아 이 창에 끌어 놓으면 지금 보낼 수 있는 분부터 보여요.');
}
function setFoldFocus(id){
  const fold=$('personFold');fold.dataset.focus=id;
  fold.querySelectorAll('.prow').forEach(r=>r.classList.toggle('is-focus',r.dataset.row===id));
  $('personAll').hidden=false;
}
function clearFoldFocus(){
  const fold=$('personFold');fold.removeAttribute('data-focus');
  fold.querySelectorAll('.prow.is-focus').forEach(r=>r.classList.remove('is-focus'));
  $('personAll').hidden=true;
}
function toggleCoach(open){$('coachPanel').hidden=!open;$('coachToggle').setAttribute('aria-expanded',String(open));}
// 「본 곳」 sits above the line when it must be written (music wording, or empty); otherwise it rests inside 「이 분 정보」.
function placePlatform(){
  const row=$('platformRow'),slot=$(ui.variant==='music'||!$('v-platform').value.trim()?'platformSlotMain':'platformSlotFold');
  if(row.parentElement!==slot&&!row.contains(document.activeElement))slot.appendChild(row);
}
function resetPersonUi(){
  clearFoldFocus();foldDismissed=false;copyStale=false;
  $('personFold').open=true;   // 샐리 11/11: the person's details are shown open as soon as someone is chosen
  toggleCoach(false);
  delete $('primary').dataset.flash;
  $('writeScroll').scrollTop=0;$('previewScroll').scrollTop=0;if(mqNarrow.matches)window.scrollTo(0,0);
}

/* ---------- Choosing a person: every path goes through choose() ---------- */
// Leaving someone whose Gmail or Instagram was opened but not recorded asks first. false = stay.
async function leaveGuard(){
  const cur=drafts[ui.current];
  if(cur&&cur.flow==='opened'&&!sentFor(idsOfCurrent(),plainName($('v-name').value))){
    const pick=await ask(plainName($('v-name').value)+'님은 '+(ui.channel==='dm'?'인스타':'Gmail')+'을 열었지만 아직 기록하지 않았어요','보냈다면 기록해 두세요. 그래야 다음에 다시 보내지 않아요.',[['닫기','close'],['넘어가기','skip'],['보냈어요 · 기록하기','record',true]]);
    if(pick==='close'||!pick)return false;
    if(pick==='record')record({silent:true});
  }
  return true;
}
async function choose(key,opts){
  const o=opts||{};
  if(key===ui.current&&!o.force){closeDrawer();showView('compose');if(key==='manual'){$('personFold').open=true;if(!$('v-name').value.trim())$('v-name').focus();}return;}
  if(!o.guarded&&!(await leaveGuard()))return;
  saveDraft();
  const switching=key!==ui.current;
  ui.current=key;
  const p=findPerson(key);
  // 「다음 분 쓰기」 can land outside the search or filter: release them so the row is on screen. Scope stays.
  if(p&&!visible().some(q=>q.key===key)&&(query||ui.filter)){query='';$('listSearch').value='';$('listSearchClear').hidden=true;ui.filter='';}
  const was=ui.variant;
  loadDraftInto(key,p);
  // Reuse saved wording for the next person, selecting that person's variant.
  if(switching||was!==ui.variant){tpl=mergeTpl();fillTplFields();}
  saveDraft();closeDrawer();
  resetPersonUi();showView('compose');
  renderAll();autoGrow();refreshHints();
  setTimeout(()=>{const f=$('v-seen');if(f.offsetParent!==null&&!f.readOnly)f.focus({preventScroll:true});},0);
}

/* ---------- Confirm dialog (one at a time). In a destructive confirm the fill is on 닫기. ---------- */
function ask(title,body,buttons){
  return new Promise(res=>{
    const d=$('confirm');$('confirmTitle').textContent=title;$('confirmBody').textContent=body;
    const row=$('confirmRow');row.replaceChildren();
    buttons.forEach(([label,val,primary,danger])=>{const b=document.createElement('button');b.className='btn'+(primary?' primary':'')+(danger?' line danger':'');b.textContent=label;b.onclick=()=>{d.close();res(val);};row.appendChild(b);});
    d.onclose=()=>{syncPrimaryFill();res(null);};
    d.showModal();syncPrimaryFill();row.querySelector('button').focus();
  });
}

/* ---------- Checks ---------- */
const PERSON_CODES=['sheet','purpose','sent'];   // this person is not to be written to at all
function allChecks(r,v){
  const t=activeTpl(),opts=renderOpts();
  const ids=idsOfCurrent(),rec=sentFor(ids,plainName(v['활동명']));
  const cur=findPerson(ui.current),pw=cur?K.purposeWhy(cur):'';
  const list=C.check(t,v,{...opts,channel:ui.channel,to:$('to').value,now:new Date(),history:histList(),sentBefore:rec?fmtDate(rec.at):''});
  const sheetMsg=(tab,row,name,why)=>(cur&&tab!==cur.tab?tab+' 탭 ':'')+row+'행 '+name+'님 — '+why+'. 이 분에게는 보내지 않아요.';
  matchesOf(ids,plainName(v['활동명'])).forEach(p=>{const why=K.blockedWhy(p);if(why&&!rec)list.unshift({level:'block',code:'sheet',msg:sheetMsg(p.tab,p.row,plainName(p.name),why),field:''});});
  // The merged group may be blocked through an id the form does not show (e.g. the 수집 row's mail).
  if(cur&&cur.blocked&&!rec&&!list.some(c=>c.code==='sheet'))list.unshift({level:'block',code:'sheet',msg:sheetMsg(cur.blocked.tab,cur.blocked.row,cur.blocked.name,cur.blocked.why),field:''});
  if(pw&&!rec)list.unshift({level:'block',code:'purpose',msg:(cur.source==='수집'?'플랫폼 수집 탭 ':'후보 탭 ')+cur.row+'행 '+plainName(cur.name)+'님 — '+pw+'. 지금 문안은 기존 작품을 올려 달라는 제안이라 이 분에게는 보내지 않아요.',field:''});
  if(cur&&!K.ready(cur)&&!pw&&!rec)list.push({level:'warn',code:'not-ready',msg:'시트에서 아직 「직접 확인」이나 「직접 컨택 후보」가 O가 아닌 분이에요. 확인한 뒤 보내 주세요.',field:''});
  if(ui.channel==='email'&&!$('to').value.trim())list.unshift({level:'block',code:'to-empty',msg:'받는 메일 주소가 비어 있어요.',field:'to',fix:handleOf($('handle').value)?['인스타 DM으로 바꾸기',()=>setChannel('dm')]:null});
  if(ui.channel==='dm'&&!handleOf($('handle').value))list.unshift({level:'block',code:'handle-empty',msg:'인스타 계정을 쓰면 DM 창을 바로 열 수 있어요.',field:'handle',fix:$('to').value.trim()?['이메일로 바꾸기',()=>setChannel('email')]:null});
  const first=()=>{staleCopy();ui.subject=0;saveDraft();renderAll();};
  if(ui.subject===1&&ui.channel==='email'&&!$('v-work').value.trim())list.forEach(c=>{if(c.code==='leftover'||c.code==='empty:작품명'){c.field='v-work';c.fix=['1안으로 바꾸기',first];}});
  if(ui.subject===1&&ui.channel==='email'&&!$('v-work').value.trim()&&!list.some(c=>c.field==='v-work'))list.unshift({level:'block',code:'work-empty',msg:'2안 제목에 넣을 작품명이 비어 있어요.',field:'v-work',fix:['1안으로 바꾸기',first]});
  if(ui.channel==='email'&&logoBroken)list.push({level:'warn',code:'logo',msg:'로고 이미지를 불러오지 못했어요. 받는 분에게도 깨져 보여요.',field:''});
  if(ui.channel==='email'&&r){const kb=new Blob([r.emailHtml]).size/1024;if(kb>80)list.push({level:'warn',code:'size',msg:'메일 HTML이 '+Math.round(kb)+'KB예요. 80KB를 넘으면 일부 메일 앱이 자를 수 있어요.',field:''});}
  list.forEach(c=>{
    if(c.code==='ad-phone')c.field='adPhone';
    if(c.code==='empty:플랫폼')c.msg=ui.variant==='music'?'인상 깊었던 곡·앨범이 비어 있어요.':'「본 곳」이 비어 있어요.';
    if(c.code==='night'&&ui.channel==='dm')c.msg='인스타는 예약 전송이 없어요. 아침 8시 뒤에 보내면 좋아요.';
    if(c.code==='night'&&ui.channel==='email')c.msg='지금은 밤이에요. Gmail 「예약 전송」으로 아침 8시 10분 뒤를 고르면 좋아요.';
    if(c.code==='night-soon')c.msg='10분 뒤면 밤 시간이에요.';
  });
  // One message per problem: keep the first of each code.
  const seen=new Set();return list.filter(c=>!seen.has(c.code)&&seen.add(c.code));
}
// The status line names a single problem in a few words; the full sentence is in the popover.
const SHORT={
  'to-empty':'받는 메일 주소가 비어 있어요','handle-empty':'인스타 계정이 비어 있어요','empty:활동명':'활동명이 비어 있어요','empty:플랫폼':'본 곳이 비어 있어요',
  'work-empty':'작품명이 비어 있어요','empty:작품명':'작품명이 비어 있어요','seen-blank':'빈칸이 남아 있어요','seen-same':'다른 분 문장과 똑같아요','ad-phone':'회사 전화번호가 비어 있어요',
  'leftover':'채워지지 않은 칸이 있어요','unknown':'모르는 칸이 문구에 있어요','link-http':'링크를 확인해 주세요','link-short':'링크를 확인해 주세요','link-text':'링크를 확인해 주세요',
  'seen-empty':'본 것 한 줄이 비어 있어요','night':'지금은 밤이에요','night-soon':'곧 밤 시간이에요','seen-similar':'다른 분 문장과 겹쳐요','avoid':'광고처럼 읽히는 말이 있어요',
  'not-ready':'확인 전인 분이에요','name-nim':'이름 끝에 「님」이 있어요','subject-long':'제목이 길어요','dm-long':'DM이 길어요','to':'메일 주소를 확인해 주세요','link-other':'다른 링크가 있어요','logo':'로고를 불러오지 못했어요','size':'메일이 커요'
};
const shortOf=c=>SHORT[c.code]||(c.code.startsWith('link-missing')?'참여 방법 링크가 빠졌어요':'');
const NEED={'to-empty':'받는 메일 주소가 필요해요','handle-empty':'인스타 계정이 필요해요','empty:활동명':'활동명이 필요해요'};
function showFieldErrors(checks){
  const want=new Map();
  checks.forEach(c=>{
    if(!c.field||c.level!=='block'||c.field==='v-seen'||want.has(c.field))return;
    // Values that came from the sheet are shown as wrong at once; a hand-typed person only after touching the field or trying to send.
    if(attempted||touched.has(c.field)||ui.current!=='manual')want.set(c.field,c);
  });
  document.querySelectorAll('p.err[id^="err-"]').forEach(e=>{
    const id=e.id.slice(4),c=want.get(id),f=$(id),sig=c?c.code+'|'+c.msg+'|'+(c.fix?c.fix[0]:''):'';
    if(e.dataset.sig===sig)return;e.dataset.sig=sig;
    if(f){if(c)f.setAttribute('aria-invalid','true');else f.removeAttribute('aria-invalid');}
    e.hidden=!c;e.replaceChildren();if(!c)return;
    e.innerHTML=icon('x')+'<span>'+esc(c.msg)+'</span>';
    if(c.fix){const b=document.createElement('button');b.className='btn sm';b.textContent=c.fix[0];b.onclick=()=>{const cur=(lastChecks.find(x=>x.code===c.code)||c).fix;if(cur)cur[1]();};e.appendChild(b);}
  });
}
function paintChecks(s){
  const list=s.blocks.filter(c=>!PERSON_CODES.includes(c.code)).concat(s.warns);
  const ul=$('checkItems'),sig=list.map(c=>c.level+c.code+c.msg+(c.field||'')).join('|');
  if(ul.dataset.sig===sig)return;ul.dataset.sig=sig;ul.replaceChildren();
  if(!list.length){const li=document.createElement('li');li.className='none';li.textContent=s.personBlock?'이 분에게는 보내지 않아요.':'지금은 볼 것이 없어요.';ul.appendChild(li);return;}
  list.forEach(c=>{
    const li=document.createElement('li');li.className=c.level;
    li.innerHTML=icon(c.level==='block'?'x':'alert')+'<span class="msg">'+esc(c.msg)+'</span>';
    if(c.field&&$(c.field)){const b=document.createElement('button');b.className='btn sm';b.textContent='고치기';b.onclick=()=>{hidePop('checklist');goField(c.field,true);};li.appendChild(b);}
    ul.appendChild(li);
  });
}
/* Take the user to a field wherever it lives: its view, its fold (only that row), its popover. */
function goField(id,fromClick){
  const f=$(id);if(!f)return;
  const view=f.closest('[data-view-of]');if(view&&view.dataset.viewOf!==viewNow())showView(view.dataset.viewOf,{keep:true});
  const fold=f.closest('details');
  // A closed fold opens to that one row; a fold the user already opened in full stays in full.
  if(fold){const was=fold.open;fold.open=true;if(fold.id==='personFold'&&(!was||fold.dataset.focus))setFoldFocus(f.closest('.prow').dataset.row);}
  const pop=f.closest('[popover]');if(pop&&!isOpen(pop)&&fromClick){try{pop.showPopover();}catch(e){}}
  if(mqNarrow.matches)closePreview();
  f.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  setTimeout(()=>f.focus({preventScroll:true}),180);
}

/* ---------- Render = compute (always now) + paint (waits while a pointer is down) ----------
   A click that starts while a field has focus blurs the field first. If that blur redrew or moved what is under the
   pointer, the click would land on nothing. So blur computes at once and the drawing waits for the pointer to lift. */
let pointerDown=false,paintPending=false,afterUp=[];
document.addEventListener('pointerdown',()=>{pointerDown=true;},true);
function pointerEnd(){
  if(!pointerDown)return;pointerDown=false;
  const run=afterUp;afterUp=[];
  setTimeout(()=>{if(paintPending){paintPending=false;paint();}run.forEach(fn=>fn());},0);
}
document.addEventListener('pointerup',pointerEnd,true);document.addEventListener('pointercancel',pointerEnd,true);
const afterPointer=fn=>{if(pointerDown)afterUp.push(fn);else fn();};
function setVariant(v){
  if(v===ui.variant)return;
  staleCopy();ui.variant=v;tpl=mergeTpl();fillTplFields();saveDraft();renderAll();
}
function setChannel(c){const n=c==='dm'?'dm':'email';if(n===ui.channel)return;staleCopy();saveDraft();const d=draft();ui.channel=n;$('v-seen').value=d.seenByChannel[n]||'';saveDraft();renderAll();}
function renderAll(){placePlatform();renderRecipients();render();}
function render(){compute();if(pointerDown){paintPending=true;return;}paint();}

let primarySig='',primaryGuard=false,guardTimer=0;
function setPrimaryLabel(label,name){
  const sig=label+'|'+name;if(sig===primarySig)return;primarySig=sig;
  const el=$('primaryLabel');el.textContent=label;
  if(name){const n=document.createElement('span');n.className='nm';n.textContent=name;el.appendChild(n);}
}
function compute(){
  const v=values(),t=activeTpl(),opts=renderOpts();
  const r=C.render(t,v,opts);last=r;
  const checks=allChecks(r,v);lastChecks=checks;
  const blocks=checks.filter(c=>c.level==='block');
  // 길이·끝맺음은 칸 아래 귀띔으로만 보여서 상태 줄에서는 세지 않는다.
  const warns=checks.filter(c=>c.level==='warn'&&c.code!=='seen-long'&&c.code!=='seen-end');
  const d=draft(),flow=d.flow||'',isEmail=ui.channel==='email',nm=plainName(v['활동명']),p=findPerson(ui.current);
  const personBlock=blocks.find(b=>PERSON_CODES.includes(b.code))||null;
  const fieldBlocks=blocks.filter(b=>!PERSON_CODES.includes(b.code));
  const rec=sentFor(idsOfCurrent(),nm);
  const recorded=flow==='recorded'||!!rec&&flow!=='opened';
  const nx=nextPerson();
  // The one button leads the order: 복사하고 열기 → 보냈어요 · 기록하기 → 다음 분 쓰기.
  let mode,label,name='',next='';
  const toNext=()=>{mode='next';if(nx){label='다음 분 쓰기 · ';name=plainName(nx.name);next='person';}};
  if(recorded){toNext();if(!nx){if(log.length){label='시트 줄 모두 복사';next='rows';}else{label='다음 분이 없어요';next='none';}}}
  else if(!isEmail&&(flow==='opened'||flow==='copied')){mode='record';label='보냈어요 · 기록하기';}
  // Someone we do not write to: no copy path anywhere, the button moves on instead.
  else if(personBlock){toNext();if(!nx){label='다음 분이 없어요';next='none';}}
  else{mode='open';label=isEmail?'메일 내용 복사':'복사하고 인스타 열기';}
  const lockPrimary=mode==='open'&&blocks.length>0;
  const coach=C.coach({seen:$('v-seen').value,subject:r.subject,work:v['작품명'],name:nm,field:p?p.field:'',channel:ui.channel,history:histList()});
  state={v,t,opts,r,checks,blocks,warns,fieldBlocks,personBlock,flow,isEmail,nm,p,rec,recorded,nx,mode,next,lockPrimary,coach,d};

  // Primary: only attributes and text change, never the element.
  const btn=$('primary');
  if(btn.dataset.mode!==mode){
    btn.dataset.mode=mode;
    // A second press that was meant for the old label must not fire the new one.
    primaryGuard=true;clearTimeout(guardTimer);guardTimer=setTimeout(()=>{primaryGuard=false;},400);
  }
  btn.dataset.next=next;
  btn.setAttribute('aria-disabled',String(lockPrimary||(mode==='next'&&next==='none')));
  btn.title=lockPrimary?blocks.map(x=>x.msg).join('\n'):'';
  if(!btn.dataset.flash)setPrimaryLabel(label,name);
  syncStatus(state);

  // More menu: a block locks every copy path, here as well as on the button.
  const lock=blocks.length>0;
  ['copyBody','copySubject','copyTo','exFile','exSource','exText','copyMailSource'].forEach(id=>$(id).setAttribute('aria-disabled',String(lock)));
  $('moreLock').hidden=!lock;$('copyLabel').hidden=lock;
  setText($('moreLock'),recorded?'이미 보낸 분이라 복사가 잠겨 있어요':'보낼 수 없는 이유가 있어 복사가 잠겨 있어요');
  const cb=$('copyBody');
  setText(cb.querySelector('span'),isEmail?'메일 내용 복사':mode==='record'?'다시 복사하고 열기':'DM만 복사');
  cb.dataset.mode=mode==='record'?'reopen':'copy';cb.hidden=mode==='next';
  $('alreadySent').hidden=mode!=='open'||(!isEmail&&flow!=='');

  // Channel-dependent visibility (the only writer of [data-only]'s hidden).
  document.querySelectorAll('[data-only]').forEach(el=>el.hidden=el.dataset.only!==ui.channel);
  // What the write column shows for this person.
  $('seenBlock').hidden=mode==='next'&&!recorded;
  $('coach').hidden=recorded;$('personFold').hidden=recorded;$('channelRow').hidden=recorded;
  $('v-seen').readOnly=recorded;
  // Nothing to change on a sent mail, a person we do not write to, or the sample shown before any list is in.
  $('subjectChange').hidden=mode==='next'||$('actBar').classList.contains('is-empty');
  $('adBadge').hidden=!ui.ad;
  syncPrimaryFill();
  store.set(S,KEY.ui,ui);
}
function syncStatus(s){
  let kind='ok',ic='check',text='',btn=null;
  if(s.recorded){
    kind='done';
    text=s.next==='person'?'보냈어요'+(s.rec?' · '+fmtTime(s.rec.at):''):s.next==='rows'?'이 명단의 연락 전 분에게 모두 보냈어요':'목록에서 「전체」로 바꿔 볼 수 있어요';
    if(s.next==='none'){kind='info';ic='dot';}
  }else if(s.mode==='record'){
    kind='info';ic='send';
    text=$('primary').dataset.flash?(s.d.copiedChannel==='dm'?'인스타 DM 창에 붙여 넣고 보내 주세요':'Gmail 쓰기 창에 붙여 넣고 보내 주세요'):'붙여 넣고 보낸 뒤 눌러 주세요';
  }else if(s.personBlock){kind='block';ic='x';text='이 분에게는 보내지 않아요';}
  else if(s.fieldBlocks.length){btn={cls:'block',ic:'x',text:s.fieldBlocks.length===1?(shortOf(s.fieldBlocks[0])||'보낼 수 없어요 · 이유 1'):'보낼 수 없어요 · 이유 '+s.fieldBlocks.length,title:s.fieldBlocks.map(c=>c.msg).join('\n')};}
  else if(s.warns.length){btn={cls:'warn',ic:'alert',text:s.warns.length===1?(shortOf(s.warns[0])||'확인 1'):'확인 '+s.warns.length,title:s.warns.map(c=>c.msg).join('\n')};}
  else if(copyStale){kind='info';ic='alert';text='글이 바뀌어서 다시 복사해야 해요';}
  else if(s.isEmail&&s.flow==='copied'){kind='info';ic='check';text='복사했어요 · 보낸 뒤 더보기에서 기록해 주세요';}
  else text='보낼 수 있어요';
  // Two fixed elements, switched by hidden: the button under the pointer is never rebuilt.
  const st=$('statusText'),cs=$('checkSummary');
  st.hidden=!!btn;cs.hidden=!btn;
  if(btn){
    cs.className='btn sm check-summary '+btn.cls;setText($('checkText'),btn.text);cs.title=btn.title;
    if($('checkIcon').getAttribute('href')!=='#i-'+btn.ic)$('checkIcon').setAttribute('href','#i-'+btn.ic);
  }else{
    st.className='status '+kind;setText($('statusLabel'),text);st.title=text;
    if($('statusIcon').getAttribute('href')!=='#i-'+ic)$('statusIcon').setAttribute('href','#i-'+ic);
  }
}
function paint(){
  const s=state;if(!s)return;
  const {v,t,opts,r,isEmail,nm,p}=s;
  paintChecks(s);showFieldErrors(s.checks);
  // Segments and menu checks
  const music=ui.variant==='music';
  [['vBasic',!music],['vMusic',music],['chEmail',isEmail],['chDm',!isEmail]].forEach(([id,on])=>{$(id).setAttribute('aria-checked',String(on));$(id).tabIndex=on?0:-1;});
  setText($('platformLabel'),music?'인상 깊었던 곡·앨범 · 선택':'본 곳 · 선택');
  setText($('help-v-platform'),music?'비워 두면 「○○님의 음악을 듣고 연락드렸어요」로 들어가요.':'비워 두면 「○○님의 작업을 보고 연락드렸어요」로 들어가요.');
  $('v-platform').placeholder=music?'예: 최근 발매하신 싱글 「새벽 버스」':'예: 홈페이지와 「밤의 정류장」';
  $('widthToggle').setAttribute('aria-checked',String(ui.width!=='desk'));
  $('mail').classList.toggle('mobile',ui.width!=='desk');
  // This person
  setText($('who'),nm?nm+' 님':(ui.current==='manual'?'새로 쓰는 분':'이름이 비어 있어요'));$('who').classList.toggle('is-empty',!nm);
  setText($('chText'),isEmail?'이메일':'인스타 DM');
  $('sheetNote').hidden=!(p&&p.note);if(p&&p.note)setText($('sheetNote'),'시트 비고 · '+p.note);
  paintFold(s);
  renderWorkLink(p);
  // The line
  // DM: the line stands as its own paragraph after 「인스타그램에서 …보고 연락드렸어요」, so it reads as what struck us.
  setText($('seenLabel'),(isEmail?(nm?nm+'님 작품에서 본 것':'본 것 한 줄'):(nm?nm+'님 작업에서 인상 깊었던 점':'개인화 문단'))+' · 선택');
  $('v-seen').placeholder=isEmail?'예: 배경을 손으로 긁어 낸 질감이 인물보다 먼저 눈에 들어왔어요.':'작품에서 좋았던 점을 적어 주세요. 음악 외 문안은 초대하고 싶은 이유도 함께 써 주세요.';
  const n=C.chars(v['본 것 한 줄'].trim());setText($('seenCount'),n+'/'+(isEmail?C.LIMITS.seenMax:C.LIMITS.dmSeenMax)+'자');$('seenCount').classList.toggle('over',n>(isEmail?C.LIMITS.seenMax:C.LIMITS.dmSeenMax));
  paintCoach(s);
  renderSubjects(v);
  // More menu side notes, settings, wording
  setText($('settingsSummary'),[$('v-sender').value.trim()||'담당자명 없음',ui.ad?'광고 켜짐':'광고 꺼짐'].join(' · '));
  $('adOn').setAttribute('aria-checked',String(ui.ad));$('adBox').hidden=!ui.ad;
  $('footerOn').setAttribute('aria-checked',String(ui.footer||ui.ad));$('footerOn').disabled=ui.ad;$('footerLocked').hidden=!ui.ad;
  const edited=editedKeys().filter(k=>isEmail?k.startsWith('email.'):k.startsWith('dm.'));
  setText($('editTitle'),'양식 편집');
  const wc=wordingChannel(),wv=wordingVariant(),wt=savedTemplate(wv),wb=C.template(wv);
  setText($('editHeading'),(wv==='music'?'음악':wc==='email'?'기본':'음악 외')+' '+(wc==='email'?'이메일':'인스타 DM')+' 양식 편집');
  setText($('editSummary'),edited.length?'고친 곳 '+edited.length:'');
  $('editBadge').hidden=!edited.length;setText($('editBadge'),'고친 곳 '+edited.length);
  document.querySelectorAll('[data-tpl]').forEach(i=>{const c=i.dataset.tpl.split('.')[0];i.closest('.tpl-field').hidden=c!==wc;const m=i.closest('.tpl-field').querySelector('.changed');if(m)m.hidden=wt[c][i.dataset.tpl.split('.')[1]]===wb[c][i.dataset.tpl.split('.')[1]];});
  // Preview: what the recipient sees. With no name yet it is shown as a sample.
  const mark=focusSeen?new Set(['본 것 한 줄']):false;
  const sample=sampleMode();
  const previewChannel=sample?sampleChannel:ui.channel;
  const previewLogo=document.querySelector('meta[name="editor-preview-logo"]')?.content;
  const shown=sample?C.render(savedTemplate(sampleVariant),previewChannel==='dm'?C.DM_EXAMPLES[sampleVariant]:SAMPLE_VALUES,{footer:true,logo:previewLogo}):
    (mark||outline||!nm||previewLogo)?C.render(t,nm?v:{...v,'활동명':'○○'},{...opts,mark,outline,logo:previewLogo}):r;
  $('previewCol').querySelectorAll('[data-only]').forEach(el=>el.hidden=el.dataset.only!==previewChannel);
  ['previewEmail','previewDm'].forEach((id,i)=>{const on=previewChannel===(i?'dm':'email');$(id).setAttribute('aria-checked',String(on));$(id).tabIndex=on?0:-1;});
  $('dmVariantSwitch').hidden=false;setText($('dmBasicPreview'),previewChannel==='email'?'기본':'음악 외');
  ['dmBasicPreview','dmMusicPreview'].forEach((id,i)=>{const on=(sample?sampleVariant:ui.variant)===(i?'music':'basic');$(id).setAttribute('aria-checked',String(on));$(id).tabIndex=on?0:-1;});
  setText($('variantHeading'),isEmail?'메일 문안':'DM 문안');setText($('vBasic'),isEmail?'기본':'음악 외');
  $('downloadEmailSource').setAttribute('aria-disabled',String(!sample&&(ui.channel!=='email'||s.blocks.length>0)));
  setText($('pvTitle'),sample||!nm?'받는 분이 볼 모습 · 예시':'받는 분이 볼 모습');
  const subj=ui.ad?shown.subjectMarked.slice(C.AD.subjectPrefix.length):shown.subjectMarked;
  const subjHtml=esc(subj).replace(/\u0001/g,'<mark class="mailmark">').replace(/\u0002/g,'</mark>');
  const st=$('subjText');if(st.dataset.html!==subjHtml){st.dataset.html=subjHtml;st.innerHTML=subjHtml;st.title=r.subject;}
  $('subjAd').hidden=!ui.ad;
  $('subjPick').hidden=ui.subject!==s.coach.subjectPick.index;
  $('subjectChange').title='제목 3안 가운데 고를 수 있어요. 추천 1안: '+s.coach.subjectPick.why;
  // Darken only the preview surround; copied and downloaded email keep their original background.
  const previewHtml=shown.emailHtml.replace(/background-color:#f2f2f2/g,'background-color:#e5e5e5');
  const doc=$('frame');if(doc.dataset.html!==previewHtml){doc.dataset.html=previewHtml;doc.srcdoc=previewHtml;}
  const kb=Math.max(1,Math.round(new Blob([r.emailHtml]).size/1024));setText($('exSize'),'약 '+kb+'KB');
  const h=handleOf($('handle').value);
  setText($('dmWho'),h?'@'+h+'에게 보내는 메시지 요청':'인스타 계정을 쓰면 받는 사람이 보여요');
  const dmHtml=esc(shown.dmMarked).replace(/\u0001/g,'<mark>').replace(/\u0002/g,'</mark>');
  const dt=$('dmText');if(dt.dataset.html!==dmHtml){dt.dataset.html=dmHtml;dt.innerHTML=dmHtml;}
  const dn=C.chars(shown.dm);setText($('dmMeta'),dn.toLocaleString()+'/'+C.LIMITS.dmChars.toLocaleString()+'자 · 수락 전 한 통·글만 가요');$('dmMeta').classList.toggle('over',dn>C.LIMITS.dmChars);
  renderAlert(s);
  renderReplies();renderSent();
}
/* 「이 분 정보」: a one-line result of what was decided for this person; opens to one row when that row blocks. */
function paintFold(s){
  const {p,isEmail,nm}=s,fold=$('personFold');
  const fb=s.mode==='open'?s.blocks.find(c=>c.field&&$(c.field)&&$(c.field).closest('#personFold')&&(ui.current!=='manual'||attempted||touched.has(c.field))):null;
  if(fb&&!foldDismissed){
    if(!fold.open){fold.open=true;setFoldFocus(fb.field);}
    else if(fold.dataset.focus&&fold.dataset.focus!==fb.field&&!fold.contains(document.activeElement))setFoldFocus(fb.field);
  }
  fold.classList.toggle('is-block',!!fb);
  const h=handleOf($('handle').value),to=$('to').value.trim(),seenAt=$('v-platform').value.trim();
  const line=fb?'이 분 정보 · '+(NEED[fb.code]||'확인할 칸이 있어요')
    :ui.current==='manual'&&!nm?'이름과 받는 곳을 적어 주세요'
    :isEmail?['메일 '+(to||'없음'),seenAt?(ui.variant==='music'?'곡·앨범 ':'본 곳 ')+seenAt:'',ui.variant==='music'?'음악 문안':'기본 문안'].filter(Boolean).join(' · ')
    :['인스타 '+(h?'@'+h:'없음'),p&&p.field?p.field:''].filter(Boolean).join(' · ');
  setText($('personLine'),line);
  // What the sheet says about this person: text only, the row link is a fixed element.
  const kv=$('sheetKv'),href=rowHref(p);
  const rows=p?[['시트 행',(p.source==='수집'?'플랫폼 수집':'후보')+' 탭 '+p.row+'행'],['분야',p.field||''],['등급',p.grade?p.grade+'등급':''],['연락 창구',p.contact||''],['시트 상태',p.status||'미연락'],['비고',p.note||''],['적어 둔 문장',p.seen||'']].filter(x=>x[1]):[];
  const sig=JSON.stringify(rows);
  if(kv.dataset.sig!==sig){kv.dataset.sig=sig;kv.replaceChildren();rows.forEach(([k,val])=>{const dt=document.createElement('dt');dt.textContent=k;const dd=document.createElement('dd');dd.textContent=val;kv.append(dt,dd);});}
  $('sheetRow').hidden=!p;
  const a=$('rowLink');a.hidden=!href;if(href&&a.getAttribute('href')!==href)a.href=href;
}
/* 문장 도움 under the line. The area is two lines tall and what is pressed sits above it, so nothing shifts as notes come and go. */
function paintCoach(s){
  const co=s.coach,p=s.p,isEmail=s.isEmail;
  setText($('coachLabel'),co.foldLabel);
  setText($('exampleTitle'),co.examplesLabel+' · 그대로 쓰지 말고 이 분 작품에서 본 걸로 써 주세요.');
  const fl=$('frameList'),fsig=co.frames.map(f=>f.id).join(',');
  if(fl.dataset.sig!==fsig){
    fl.dataset.sig=fsig;fl.replaceChildren();
    co.frames.forEach(f=>{const li=document.createElement('li'),b=document.createElement('button');b.type='button';b.innerHTML='<span>'+esc(f.text)+'</span><span class="grp">'+esc(f.group)+'</span>';b.onclick=()=>useFrame(f.text);li.appendChild(b);fl.appendChild(li);});
  }
  const el=$('exampleList'),esig=co.examples.map(e=>e.text).join('|');
  if(el.dataset.sig!==esig){el.dataset.sig=esig;el.replaceChildren();co.examples.forEach(e=>{const li=document.createElement('li');li.textContent=e.text;el.appendChild(li);});}
  // 1. Blocks (machine checks), at once.
  const err=s.blocks.find(c=>c.field==='v-seen');
  const se=$('seenErr'),ssig=err?err.code+err.msg:'';
  if(se.dataset.sig!==ssig){se.dataset.sig=ssig;se.hidden=!err;se.innerHTML=err?icon('x')+'<span>'+esc(err.msg)+'</span>':'';}
  if(err)$('v-seen').setAttribute('aria-invalid','true');else $('v-seen').removeAttribute('aria-invalid');
  // 2–3. Hints, as last refreshed (600ms after typing stops, or on leaving the field). Never more than two lines in all.
  let room=2-(err?1:0);
  const hints=shownHints.slice(0,Math.max(0,room));room-=hints.length;
  const hl=$('coachHints'),hsig=hints.map(h=>h.id+h.text).join('|');
  if(hl.dataset.sig!==hsig){hl.dataset.sig=hsig;hl.replaceChildren();hints.forEach(h=>{const li=document.createElement('li');li.innerHTML=icon('alert')+'<span>'+esc(h.text)+'</span>';hl.appendChild(li);});}
  // 4. A line already written on the sheet, offered while the field is empty.
  const sheetLine=!$('v-seen').value.trim()&&p&&p.seen&&room>0?p.seen:'';
  const cs=$('coachSheet'),csig=sheetLine;
  if(cs.dataset.sig!==csig){
    cs.dataset.sig=csig;cs.hidden=!sheetLine;cs.replaceChildren();
    if(sheetLine){const t=document.createElement('span');t.className='ell';t.textContent='시트에 적어 둔 문장이 있어요: 「'+sheetLine+'」';t.title=sheetLine;const b=document.createElement('button');b.type='button';b.className='btn sm';b.textContent='넣기';b.onclick=()=>{const q=findPerson(ui.current);if(q&&q.seen){setSeen(q.seen);$('v-seen').focus();}};cs.append(t,b);}
  }
  if(sheetLine)room--;
  // 5. Where the line lands, only when nothing above needs the space.
  $('seenWhere').hidden=!!err||hints.length>0||room<=0;
  setText($('seenWhere'),isEmail?'연락드린 이유 바로 다음 줄에 들어가요.':(ui.variant==='music'?'곡·앨범에서 좋았던 점을 한 문단으로 써 주세요.':'감상과 초대하고 싶은 이유를 한 문단으로 써 주세요.'));
  // Subject popover: the reason for the pick and a hint about what sits up front.
  setText($('subjectWhy'),'추천은 1안이에요. '+co.subjectPick.why);
  const sh=co.hints.filter(h=>h.target==='subject');
  $('subjectHint').hidden=!sh.length;setText($('subjectHint'),sh.map(h=>h.text).join(' '));
}
function refreshHints(){
  clearTimeout(hintTimer);if(!state)return;
  // While the cursor is in the field, an unfinished line is not yet 「too short」 or 「not ended」.
  shownHints=state.coach.hints.filter(h=>h.target==='v-seen'&&!(focusSeen&&(h.id==='seen-thin'||h.id==='seen-end')));
  paintCoach(state);
}
const SUBJECT_NOTES=['','작품명이 제목에 보여요. 그 작품을 실제로 보셨을 때만 골라 주세요.','메일 큰 제목과 같은 말이 되풀이돼요.'];
function renderSubjects(v){
  const g=$('subjectGroup');
  if(!g.dataset.built){
    g.dataset.built='1';
    [0,1,2].forEach(i=>{
      const l=document.createElement('label');l.className='radio';
      l.innerHTML='<input type="radio" name="subject" value="'+i+'"><span class="body"><span class="txt"></span>'+(SUBJECT_NOTES[i]?'<span class="why">'+esc(SUBJECT_NOTES[i])+'</span>':'')+'</span>'+(i===0?'<span class="pick">추천</span>':'');
      l.querySelector('input').onchange=()=>{staleCopy();ui.subject=i;saveDraft();render();if(i===1&&!$('v-work').value.trim())setTimeout(()=>$('v-work').focus(),0);};
      g.appendChild(l);
      if(i===1){const x=document.createElement('div');x.className='radio-extra';x.id='workRow';x.innerHTML='<label for="v-work">작품명</label><input class="field" id="v-work" data-var="작품명" autocomplete="off" aria-describedby="err-v-work"><p class="err" id="err-v-work" hidden></p>';g.appendChild(x);}
    });
  }
  const opts=[tpl.email.subject,...C.SUBJECT_ALTERNATIVES];
  // An option whose blank is still empty shows the blank's name, not an empty pair of quotes.
  const named={...v,'활동명':(v['활동명']||'').trim()||'○○','작품명':(v['작품명']||'').trim()||'작품명'};
  g.querySelectorAll('label.radio').forEach((l,i)=>{const t=(ui.ad?'(광고) ':'')+(C.fill(opts[i],named)||opts[i]);setText(l.querySelector('.txt'),t);l.querySelector('input').checked=ui.subject===i;});
  $('workRow').hidden=ui.subject!==1;
}
// Sheet row link per tab gid (플랫폼 수집 gid read from the live sheet 2026-11-10).
function rowHref(p){const g=p&&TAB_GID[p.source];return g?'https://docs.google.com/spreadsheets/d/'+SHEET_ID+'/edit#gid='+g+'&range=A'+p.row:'';}
/* ---------- Work link: the sheet address, editable to the exact post ---------- */
function safeUrl(s){try{const u=new URL(String(s||'').trim());return /^https?:$/.test(u.protocol)?u.href:'';}catch(e){return '';}}
function renderWorkLink(p){
  const v=$('v-post').value.trim(),u=safeUrl(v),sheetUrl=(p&&p.url)||'',edited=!!(sheetUrl&&v&&safeUrl(sheetUrl)!==u);
  const a=$('postOpen');
  if(u){if(a.getAttribute('href')!==u)a.href=u;a.removeAttribute('aria-disabled');a.title='';}
  else{a.removeAttribute('href');a.setAttribute('aria-disabled','true');a.title='작품 주소가 비어 있어요. 누르면 주소 칸으로 가요.';}
  const msg=!p&&!v?'본 게시물 주소를 넣으면 「작품 보기」로 바로 열 수 있어요.':p&&!sheetUrl&&!v?'시트에 작품 주소가 없어요. 본 게시물 주소를 넣어 주세요.':'받는 분에게는 안 보여요. 본 게시물 주소로 바꾸면 시트 줄에 그 주소가 남아요.';
  const h=$('postHelp'),sig=msg+'|'+edited;if(h.dataset.sig===sig)return;h.dataset.sig=sig;
  h.replaceChildren(msg);
  if(edited){const b=document.createElement('button');b.type='button';b.className='btn sm';b.textContent='시트 주소로 되돌리기';
    b.onclick=()=>{const f=$('v-post'),q=findPerson(ui.current);f.value=(q&&q.url)||'';f.dispatchEvent(new Event('input',{bubbles:true}));f.focus();};h.append(b);}
}
/* The slot above the name: the result of recording, why this person is not written to, or a blocked new window. */
function renderAlert(s){
  const slot=$('alertSlot'),{flow,nm,p,rec,d}=s;
  const rowUrl=rowHref(p),sheetBlock=s.checks.find(c=>c.code==='purpose'||c.code==='sheet');
  const noSender=!$('v-sender').value.trim();
  const {m,n}=progress();
  const kind=rec&&flow==='recorded'?'recorded':rec?'sent':sheetBlock?'sheet':!s.isEmail&&flow==='copied'&&d.popupBlocked&&d.openUrl?'popup':hasSheet()&&m>0&&m===n&&ui.current==='manual'?'alldone':'';
  // Everything a button in here holds on to is part of the signature, so an unchanged slot is left alone (and stays clickable).
  const sig=[kind,ui.current,nm,flow,d.recordedAt||'',rec?rec.at+tsvRow(rec):'',ui.channel,sheetBlock?sheetBlock.msg:'',p?p.row:'',rowUrl,d.openUrl||'',d.copiedChannel||'',noSender].join('|');
  if(slot.dataset.sig===sig)return;slot.dataset.sig=sig;slot.replaceChildren();
  if(!kind)return;
  const box=(cls,ic,html,actions)=>{const el=document.createElement('div');el.className='alert '+cls;el.innerHTML='<div class="head">'+icon(ic)+'<div>'+html+'</div></div>';if(actions&&actions.length){const r=document.createElement('div');r.className='row';actions.filter(Boolean).forEach(a=>r.appendChild(a));el.appendChild(r);}slot.appendChild(el);};
  const btn=(txt,fn,cls)=>{const b=document.createElement('button');b.type='button';b.className='btn '+(cls||'sm');b.innerHTML='<span>'+esc(txt)+'</span>';b.onclick=()=>fn(b);return b;};
  const link=(txt,href,cls)=>{const a=document.createElement('a');a.className=cls||'link';a.href=href;a.target='_blank';a.rel='noopener';a.innerHTML=esc(txt)+icon('ext');return a;};
  const sentNow=()=>sentFor(idsOfCurrent(),plainName($('v-name').value));
  if(kind==='recorded'){
    const where=p?'시트 '+p.row+'행':'후보 시트';
    const copyRow=btn('시트 줄 복사',b=>{const cur=sentNow();if(cur)copyWithFeedback(b,tsvRow(cur));},'line strong');copyRow.insertAdjacentHTML('afterbegin',icon('copy'));
    box('result','check','<strong>'+esc(nm)+'님을 보냄으로 기록했어요</strong><span class="sub">'+(rec.channel==='dm'?'DM을':'메일을')+' 보낸 뒤 시트 줄을 복사해 '+esc(where)+' 상태 열 옆에 붙여 넣으면 끝나요.</span>',
      [copyRow,rowUrl?link('시트 '+p.row+'행 열기',rowUrl):null,btn('되돌리기',undo),noSender?btn('담당자명이 비어 있어요 · 설정 열기',()=>goField('v-sender',true)):null]);
  }else if(kind==='sent'){
    box('block','ban',esc(nm)+'님에게는 '+esc(fmtDate(rec.at))+'에 이미 보냈어요. 답이 없으면 다시 보내지 않아요.',[btn('답장이 왔을 때',openReplies)]);
  }else if(kind==='sheet'){
    box('block','ban',esc(sheetBlock.msg),[btn('답장이 왔을 때',openReplies)]);
  }else if(kind==='popup'){
    const dm=d.copiedChannel==='dm',name=dm?'인스타 DM 직접 열기':'Gmail 직접 열기';
    box('info','send','복사는 됐는데 새 창이 막혔어요. 「'+name+'」로 열어 붙여 넣고 보낸 뒤 기록해 주세요.',
      [(()=>{const a=link(name,d.openUrl,'btn line');
        // Opening by hand counts as opened: leaving this person unrecorded must ask, as after the button.
        a.addEventListener('click',()=>setTimeout(()=>{const x=draft();if(x.flow==='copied'){x.flow='opened';x.popupBlocked=false;saveDraft();renderAll();}},0));return a;})(),dm?null:btn('제목 복사',b=>copyWithFeedback(b,last.subject)),dm?null:btn('주소 복사',b=>{const to=$('to').value.trim();if(to)copyWithFeedback(b,to);else goField('to',true);})]);
  }else if(kind==='alldone'){
    box('info','check','이 명단의 연락 전 분에게 모두 보냈어요. 받는 분 목록에서 「전체」로 바꿔 볼 수 있어요.');
  }
}

/* ---------- Recipients list (a popover opened from the write bar) ---------- */
const srcLabel=p=>(p.source==='수집'?'수집 ':'후보 ')+p.row+'행';
function renderRecipients(){
  const has=hasSheet();
  syncBars();
  const {m,n}=progress(),left=Math.max(0,m-n);
  setText($('drawerLabel'),'받는 분 '+left+'명 남음');
  setText($('progressText'),n+'/'+m+' 보냄');setText($('progressNote'),n+'/'+m+' 보냄');
  const bar=$('progressBar');bar.setAttribute('aria-valuemax',String(m));bar.setAttribute('aria-valuenow',String(n));bar.firstElementChild.style.width=(m?Math.round(n/m*100):0)+'%';
  $('mClear').hidden=!has;$('mInfo').hidden=!has;$('clearLog').hidden=!log.length;
  if(!has){$('staleNote').hidden=true;$('recipientList').replaceChildren();return;}
  const when=new Date(sheet.importedAt);
  setText($('listMeta'),(sheet.file||'가져온 표')+' · '+(when.toDateString()===new Date().toDateString()?'오늘 ':fmtDate(sheet.importedAt)+' ')+fmtTime(sheet.importedAt)+'에 가져옴');
  const issues=importIssues();
  $('issuesBtn').hidden=!issues.length;setText($('issuesBtn'),'확인할 행 '+issues.length+' · 보기');
  const listed=sheet.listed||listedOf(sheet.tabs);
  const info=Object.entries(sheet.tabs).map(([name,t])=>'<h3>'+esc(name)+' 탭'+(listed[name]?'':' · 목록에 올리지 않고 막힘만 확인해요')+'</h3><p>열 이름 줄 '+t.header+'행 · '+esc(Object.values(t.columns).join(', '))+'</p>').join('')
    +(issues.length?'<h3>확인할 행</h3><ul>'+issues.slice(0,12).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'<p style="margin:0">확인할 행이 없어요.</p>');
  const ii=$('importInfo');if(ii.dataset.html!==info){ii.dataset.html=info;ii.innerHTML=info;}
  const stale=Date.now()-when.getTime()>20*3600*1000&&when.toDateString()!==new Date().toDateString();
  $('staleNote').hidden=!stale;
  const ls=$('listStale'),ssig=String(stale);
  if(ls.dataset.sig!==ssig){
    ls.dataset.sig=ssig;ls.hidden=!stale;ls.replaceChildren();
    if(stale){ls.innerHTML=icon('alert')+'<span>어제 가져온 명단이에요. 그 사이 보낸 분이 있을 수 있어요.</span>';const b=document.createElement('button');b.type='button';b.className='btn sm';b.textContent='다시 내려받기';b.onclick=downloadSheet;ls.appendChild(b);}
  }
  renderFilter();renderScope();renderList(m,left);
}
function setScope(v){ui.scope=v;listLimit=200;store.set(S,KEY.ui,ui);renderRecipients();}
function setFilter(v){ui.filter=v;listLimit=200;store.set(S,KEY.ui,ui);renderRecipients();}
// Scope (two segments) and filter (one select) are chosen separately: 「보낼 분만」 within 「음악」.
function renderScope(){
  const ready=pool.people.filter(p=>sendable(p)&&!isSent(p)).length,on=ui.scope==='ready';
  setText($('scopeReady'),'보낼 분만 '+ready.toLocaleString());setText($('scopeAll'),'전체 '+pool.people.length.toLocaleString());
  [['scopeReady',on],['scopeAll',!on]].forEach(([id,c])=>{$(id).setAttribute('aria-checked',String(c));$(id).tabIndex=c?0:-1;});
  setText($('scopeLine'),on?(pool.readyOut?'확인 전 '+pool.readyOut.toLocaleString()+'분은 빠져 있어요.':''):'보낼 수 없는 분은 흐리게 보여요.');
}
// One select: 출처 and 분야 groups with counts in the current scope (search is not counted). Zero stays as 0.
function renderFilter(){
  const sel=$('listFilter'),base=pool.people.filter(inScope);
  const count=f=>base.reduce((a,p)=>a+(f(p)?1:0),0);
  const opts=[new Option('출처·분야 모두','')];
  const listed=Object.values(sheet&&sheet.listed||{});
  if(listed.includes('수집')||pool.people.some(p=>p.source==='수집'||p.also==='수집')){
    const g=document.createElement('optgroup');g.label='출처';
    g.append(new Option('후보 탭 '+count(p=>p.source==='후보'||p.also==='후보'),'src:후보'),new Option('플랫폼 수집 '+count(p=>p.source==='수집'||p.also==='수집'),'src:수집'));
    opts.push(g);
  }
  const all=new Map();pool.people.forEach(p=>{const k=fieldKey(p);all.set(k,(all.get(k)||0)+1);});
  const named=[...all].filter(([k])=>k&&k!=='*그밖').sort((a,b)=>b[1]-a[1]||collator.compare(a[0],b[0]));
  if(all.size){
    const g=document.createElement('optgroup');g.label='분야';
    named.forEach(([k])=>g.append(new Option(k+' '+count(p=>fieldKey(p)===k),'field:'+k)));
    if(all.has('*그밖'))g.append(new Option('그 밖 '+count(p=>fieldKey(p)==='*그밖'),'field:*그밖'));
    if(all.has(''))g.append(new Option('분야 없음 '+count(p=>!fieldKey(p)),'field:'));
    opts.push(g);
  }
  sel.replaceChildren(...opts);
  const vals=[...sel.options].map(o=>o.value);
  if(!vals.includes(ui.filter)){ui.filter='';store.set(S,KEY.ui,ui);}
  sel.value=ui.filter;sel.classList.toggle('on',!!ui.filter);
}
let liveSig='';
function renderList(m,left){
  const ul=$('recipientList'),t=queryTokens();
  const list=pool.people.filter(p=>inScope(p)&&inFilter(p)&&matchesQuery(p,t));
  const frag=document.createDocumentFragment();let selId='';
  // Draw 200 rows at a time: 「전체」 on the live sheet is over a thousand people.
  list.slice(0,listLimit).forEach((p,i)=>{
    const st=rowStatus(p),key=keyOf(p),ch=K.channelOf(p);
    const li=document.createElement('li');li.id='opt-'+i;li.setAttribute('role','option');li.dataset.key=key;
    const on=key===ui.current;li.setAttribute('aria-selected',String(on));if(on)selId=li.id;if(st.dim)li.classList.add('dim');
    li.innerHTML='<span class="nm">'+esc(p.name)+'</span><span class="st">'+(st.ic?icon(st.ic):'')+esc(st.t)+'</span><span class="sub num">'
      +esc([p.source==='수집'?'수집':'후보',p.field,ch==='email'?'메일':ch==='dm'?'인스타':'창구 없음'].filter(Boolean).join(' · '))+(p.dupOf?' · 중복':'')+'</span>';
    frag.appendChild(li);
  });
  ul.replaceChildren(frag);ul.setAttribute('aria-activedescendant',selId);
  const more=list.length-listLimit;$('listMore').hidden=more<=0;setText($('listMore'),'더 보기 ('+Math.max(0,more).toLocaleString()+'명 남음)');
  const allDone=m>0&&left===0&&ui.scope==='ready'&&!ui.filter&&!query;
  $('allDone').hidden=!allDone;
  const fe=$('filterEmpty');fe.hidden=!!list.length||allDone;
  if(!fe.hidden){
    const wider=ui.scope==='ready'?pool.people.filter(p=>inFilter(p)&&matchesQuery(p,t)).length:0;
    const b=$('filterReset');
    if(wider){$('filterEmptyText').textContent='지금 보낼 수 있는 분 중에는 없어요. 확인 전이거나 연락한 분까지 보면 '+wider+'명 있어요.';b.textContent='전체 보기';b.onclick=()=>setScope('all');}
    else if(query&&!pool.people.some(p=>matchesQuery(p,t))){$('filterEmptyText').textContent='‘'+query.trim()+'’에 맞는 분이 없어요.';b.textContent='검색 지우기';b.onclick=()=>clearSearch(true);}
    else{$('filterEmptyText').textContent='조건에 맞는 분이 없어요.';b.textContent='거르기 풀기';b.onclick=()=>setFilter('');}
  }
  const sig=query+'|'+ui.filter+'|'+ui.scope;
  if(sig!==liveSig){if(liveSig)$('listLive').textContent=list.length+'명';liveSig=sig;}
}
function refreshRowStatus(){
  const li=[...$('recipientList').children].find(x=>x.dataset.key===ui.current);const p=findPerson(ui.current);
  if(!li||!p)return;const st=rowStatus(p);li.querySelector('.st').innerHTML=(st.ic?icon(st.ic):'')+esc(st.t);
}
function importIssues(){
  const out=[];
  pool.people.forEach(p=>{
    const at=srcLabel(p);
    if(p.email&&!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(p.email))out.push(at+' 메일 형식을 확인해 주세요');
    if(p.dupOf)out.push(at+' 같은 메일·계정이 '+p.dupOf.join('·')+'행에도 있어요');
    if(p.also)out.push(at+' 두 탭에 모두 있어요('+p.rows.filter(r=>r.source!==p.source).map(srcLabel).join('·')+')');
    if(K.ready(p)&&!p.url)out.push(at+' 작품 주소(출처)가 비어 있어요');
    if(K.ready(p)&&!K.channelOf(p))out.push(at+' 연락 창구가 없어요');
  });
  return [...new Set(out)];
}
function renderSent(){
  $('sentGroup').hidden=!log.length;
  setText($('sentHeading'),'이 창에서 보낸 분 '+log.length);
  const ul=$('sentList'),sig=log.map(r=>r.at+r.name+r.channel).join('|');
  if(ul.dataset.sig===sig)return;ul.dataset.sig=sig;ul.replaceChildren();
  [...log].reverse().forEach(r=>{
    const li=document.createElement('li');
    li.innerHTML=icon('check')+'<span>'+esc(r.name)+'</span><span class="when num">'+(r.channel==='dm'?'인스타':'메일')+' · '+esc(fmtTime(r.at))+'</span>';
    const b=document.createElement('button');b.type='button';b.className='btn sm';b.textContent='빼기';b.setAttribute('aria-label',r.name+'님 빼기');
    b.onclick=async()=>{
      // The confirm closes the list; focus comes back to the button that opens it.
      const go=await ask(r.name+'님을 이 목록에서 뺄까요?','시트에 붙인 줄은 직접 지워 주세요.',[['닫기','close',true],['빼기','go',false,true]]);
      $('drawerToggle').focus();
      if(go!=='go')return;
      log=log.filter(x=>x!==r);store.set(S,KEY.log,log);Object.values(drafts).forEach(d=>{if(d.recordedAt===r.at)d.flow='opened';});store.set(S,KEY.drafts,drafts);renderAll();
    };
    li.appendChild(b);ul.appendChild(li);
  });
}

/* ---------- Actions ---------- */
function gmailUrl(){const to=$('to').value.trim();return 'https://mail.google.com/mail/?view=cm&fs=1'+(to?'&to='+encodeURIComponent(to):'')+'&su='+encodeURIComponent(last.subject);}
function dmUrl(){return 'https://ig.me/m/'+encodeURIComponent(handleOf($('handle').value));}
/* A blocked press: shake, open 「보내기 전에 볼 것」 inside this same click, then go to the first field to fix. */
function shakeTo(btn){
  btn.classList.remove('shake');void btn.offsetWidth;btn.classList.add('shake');
  attempted=true;foldDismissed=false;render();
  const blocks=lastChecks.filter(c=>c.level==='block');
  $('live').textContent='';setTimeout(()=>{$('live').textContent='아직 보낼 수 없어요. '+blocks.map(b=>b.msg).join(' ');},50);
  const cl=$('checklist');if(!isOpen(cl)&&!$('checkSummary').hidden){try{cl.showPopover();}catch(e){}}
  const first=lastChecks.find(c=>c.level==='block'&&c.field&&$(c.field));
  if(first)setTimeout(()=>goField(first.field,true),240);
}
async function copyAndOpen(btn){
  if(ui.channel==='email')return copyOnly();
  // Freeze who, what and where at the click: the person or channel may change while the clipboard write is pending.
  const snap={key:ui.current,channel:ui.channel,html:last.emailPaste,text:ui.channel==='email'?last.emailText:last.dm,url:ui.channel==='email'?gmailUrl():dmUrl(),subject:last.subject,to:$('to').value.trim()};
  const writing=snap.channel==='email'?writeRich(snap.html,snap.text):writeText(snap.text);
  const w=window.open('about:blank','_blank');
  const ok=await writing;
  const d=drafts[snap.key]||(drafts[snap.key]={vars:{},to:'',handle:'',flow:''});
  if(ok){
    let opened=false;
    if(w){try{w.opener=null;w.location.href=snap.url;opened=true;}catch(e){}}
    d.flow=opened?'opened':'copied';d.copiedChannel=snap.channel;d.popupBlocked=!opened;d.openUrl=snap.url;
    store.set(S,KEY.drafts,drafts);
    copyStale=false;
    if(!opened)toast('복사는 됐는데 브라우저가 새 창을 막았어요. 「'+(snap.channel==='dm'?'인스타 DM 직접 열기':'Gmail 직접 열기')+'」로 열어 주세요.');
    if(snap.key===ui.current)flash(btn,'복사했어요');
    renderAll();
  }else{
    if(w)w.close();
    manualCopy(snap.text,()=>{const x=window.open(snap.url,'_blank','noopener');d.flow=x?'opened':'copied';d.copiedChannel=snap.channel;store.set(S,KEY.drafts,drafts);renderAll();return x;},snap.channel,snap);
  }
}
// From the more menu: the write starts inside the click, the result is told by a toast (a closed menu cannot show a flash).
async function copyOnly(source=false){
  const snap={key:ui.current,channel:ui.channel,html:last.emailPaste,text:source?last.emailHtml:ui.channel==='email'?last.emailText:last.dm,subject:last.subject,to:$('to').value.trim()};
  const ok=!source&&snap.channel==='email'?await writeRich(snap.html,snap.text):await writeText(snap.text);
  const d=drafts[snap.key]||(drafts[snap.key]={vars:{},to:'',handle:'',flow:''});
  if(ok){d.flow=d.flow||'copied';if(snap.channel==='email'){delete d.popupBlocked;delete d.openUrl;}d.copiedChannel=snap.channel;store.set(S,KEY.drafts,drafts);copyStale=false;toast(source?'HTML 소스를 복사했어요.':snap.channel==='dm'?'DM을 복사했어요.':'본문을 복사했어요.');renderAll();}
  else manualCopy(snap.text,null,source?undefined:snap.channel,snap);
}
const tsvRow=r=>[r.name,r.contact,r.channel==='dm'?'인스타 DM':'메일','발송 '+new Date(r.at).toLocaleDateString('ko-KR'),r.sender||'',r.seen||'',r.post||''].join('\t');
async function record(opts){
  const nm=plainName($('v-name').value);if(!nm)return;
  const p=findPerson(ui.current)||matchesOf(idsOfCurrent(),nm)[0];
  const ch=draft().copiedChannel||ui.channel;
  const r={ids:uniq(expandIds(idsOfCurrent()).concat(p&&p.allIds||[])),name:nm,channel:ch,contact:ch==='email'?$('to').value.trim():'@'+handleOf($('handle').value),row:p?p.row:'',seen:values()['본 것 한 줄'].trim(),post:safeUrl($('v-post').value),sender:$('v-sender').value.trim(),at:new Date().toISOString()};
  log.push(r);store.set(S,KEY.log,log);
  const d=draft();d.flow='recorded';d.recordedAt=r.at;saveDraft();
  // Recording never writes the clipboard: the mail body may still be waiting to be pasted.
  delete $('primary').dataset.flash;primarySig='';
  renderAll();
  if(!(opts&&opts.silent)){$('writeScroll').scrollTop=0;if(mqNarrow.matches)window.scrollTo(0,0);}
}
function undo(){
  const d=draft();const at=d.recordedAt;log=log.filter(x=>x.at!==at);store.set(S,KEY.log,log);d.flow='opened';delete d.recordedAt;saveDraft();renderAll();
  toast('되돌렸어요. 시트에 붙인 줄은 직접 지워 주세요.');
}
async function primary(btn){
  const mode=btn.dataset.mode,off=btn.getAttribute('aria-disabled')==='true';
  if(mode==='open'&&off)return shakeTo(btn);
  if(mode==='open')return ui.channel==='email'?copyOnly():copyAndOpen(btn);
  if(mode==='record')return record();
  if(mode==='next'&&!off){
    if(btn.dataset.next==='person'){const nx=nextPerson();if(nx)return choose(keyOf(nx));}
    if(btn.dataset.next==='rows'&&log.length)return copyAllRows(btn);
  }
}
function copyAllRows(btn){return copyWithFeedback(btn||$('copyLog'),['활동명\t계정·주소\t보낸 곳\t상태\t담당\t본 것 한 줄\t작품 링크'].concat(log.map(tsvRow)).join('\n'),'시트 줄을 복사했어요');}
// More-menu copy and export items share one order: lock check → start the write → close the menu → toast or the manual dialog.
function menuLocked(id){
  if($(id).getAttribute('aria-disabled')!=='true')return false;
  hidePop('moreMenu');shakeTo($('primary'));return true;
}
function menuCopy(id,text,done,channel){
  if(menuLocked(id))return;
  const writing=writeText(text);hidePop('moreMenu');
  writing.then(ok=>ok?toast(done):manualCopy(text,null,channel));
}
const EDITOR_URL='https://euna-source.github.io/public-pages/c8-content-seeding/content-seeding-email-instagram-dm.html';
const SAMPLE_VALUES={'활동명':'○○','플랫폼':'인스타그램','본 것 한 줄':'작품에서 인상 깊었던 장면을 여기에 한 줄로 적어요.'};
function saveHtml(html,filename){
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));a.download=filename;
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
async function downloadEditor(){
  const b=$('downloadEditor');if(b.disabled)return;b.disabled=true;
  try{
    const payload=$('editorSource');let html;
    if(payload){
      const raw=new TextDecoder().decode(Uint8Array.from(atob(JSON.parse(payload.textContent)),c=>c.charCodeAt(0)));
      const at=raw.lastIndexOf('</body>');
      html=raw.slice(0,at)+'<script id="editorSource" type="application/json">'+payload.textContent+'<'+ '/script>\n'+raw.slice(at);
    }else{
      const response=await fetch(new URL('content-seeding-editor.html?v=261111-template-edit',location.href));
      if(!response.ok)throw Error('download');html=await response.text();
    }
    saveHtml(html,'콘텐츠시딩_이메일_인스타DM_편집기.html');toast('편집기 HTML을 받았어요. 명단과 초안은 포함되지 않아요.');
  }catch(e){toast('편집기를 받지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.');}
  finally{b.disabled=false;}
}
function downloadEmailSource(){
  const sample=sampleMode();
  if(!sample){if($('downloadEmailSource').getAttribute('aria-disabled')==='true'){toast('이메일로 전환하고 받는 분 정보를 채워 주세요.');return;}return download();}
  saveHtml(C.render(savedTemplate(sampleVariant),SAMPLE_VALUES,{footer:true}).emailHtml,'콘텐츠시딩_이메일_예시.html');toast('예시 이메일 HTML 소스를 받았어요.');
}
function switchPreview(channel){
  if(sampleMode()){sampleChannel=channel;render();}else setChannel(channel);fillTplFields();
}
function download(){
  if(menuLocked('exFile'))return;
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([last.emailHtml],{type:'text/html'}));
  a.download='콘텐츠시딩_이메일_'+(plainName($('v-name').value)||'작가').replace(/[\\/:*?"<>|\s]+/g,'')+'_'+yymmdd(new Date())+'.html';
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  hidePop('moreMenu');toast('HTML 파일을 받았어요.');
}

/* ---------- Replies ---------- */
function replyValues(){
  const p=findPerson(ui.current)||matchesOf(idsOfCurrent(),plainName($('v-name').value))[0];
  return {'활동명':plainName($('v-name').value)||'작가','담당자명':$('v-sender').value.trim()||'담당자','날짜':new Date().toLocaleDateString('ko-KR',{month:'long',day:'numeric'}),'출처':safeUrl($('v-post').value)||(p&&p.url)||($('v-platform').value.trim()?$('v-platform').value.trim()+' 프로필':'공개 프로필')};
}
function renderReplies(){if($('replyPanel').hidden)return;setText($('replyOptout'),C.reply('optout',replyValues()));setText($('replySource'),C.reply('source',replyValues()));}
function openReplies(){$('replyPanel').hidden=false;$('previewArea').hidden=true;$('previewScroll').scrollTop=0;openPreview();renderReplies();$('replyClose').focus();}
function closeReplies(){$('replyPanel').hidden=true;$('previewArea').hidden=false;$('moreBtn').focus();}

/* ---------- List popover and the preview sheet (under 1024) ---------- */
function closeDrawer(){hidePop('recipients');}
function openPreview(){if(mqNarrow.matches){$('previewCol').classList.add('open');$('shell').classList.add('preview-open');}}
function closePreview(){$('previewCol').classList.remove('open');$('shell').classList.remove('preview-open');}

/* ---------- Import ---------- */
const sheetError=(msg)=>{const e=$('importError');e.hidden=!msg;e.innerHTML=msg?icon('x')+'<span>'+esc(msg)+'</span>':'';if(msg&&viewNow()!=='import')toast(msg);};
/* found: [{name, data, source}] where source is '후보'|'수집'|'' (index only). Tabs add to what is already here. */
function addTabs(found,file){
  const old=hasSheet()?sheet:{tabs:{},listed:{}};
  sheet={tabs:{...old.tabs},listed:{...(old.listed||listedOf(old.tabs))},file,importedAt:new Date().toISOString()};
  found.forEach(f=>{sheet.tabs[f.name]=f.data;if(f.source)sheet.listed[f.name]=f.source;else delete sheet.listed[f.name];});
  store.set(S,KEY.people,sheet);sheetError('');
  rebuild();listLimit=200;
  const ready=pool.people.filter(p=>sendable(p)&&!isSent(p)).length;
  const pending=log.filter(r=>matchesOf(r.ids||[],r.name).some(p=>K.uncontacted(p)));
  // One number that means what the bar says (「받는 분 n명 남음」), not a count per tab.
  toast('명단을 가져왔어요 · 지금 보낼 수 있는 분 '+ready+'명'+(pending.length?' · 이 창에서 보낸 '+pending.length+'명이 시트에 아직 미연락이에요':''));
  const first=pool.people.find(p=>sendable(p)&&!isSent(p));
  if(first)choose(keyOf(first),{force:true});else{showView('compose');renderAll();}
}
// CSV and paste carry one tab: its name says 후보·수집, or a 연락 목적 column means 수집.
const oneTab=(name,data)=>({name,data,source:K.sourceOf(name)||(data.columns.purpose?'수집':'후보')});
function importText(text){
  try{addTabs([oneTab('붙여 넣은 표',K.convert(K.parseDelimited(text)))],'붙여 넣은 표');$('sheetPaste').value='';}
  catch(e){sheetError(e.message||'표로 읽지 못했어요. 열 이름 줄부터 복사해 붙여 넣어 주세요.');}
}
let xlsxLib;
function loadXlsx(){
  return xlsxLib||(xlsxLib=new Promise((ok,fail)=>{
    if(window.XLSX)return ok(window.XLSX);
    const s=document.createElement('script');s.src='xlsx.mini.min.js';
    s.onload=()=>window.XLSX?ok(window.XLSX):fail(Error('파일 읽기 도구를 불러오지 못했어요. 새로 고친 뒤 다시 가져와 주세요.'));
    s.onerror=()=>{xlsxLib=null;fail(Error('파일 읽기 도구를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.'));};
    document.head.appendChild(s);
  }));
}
const okFile=f=>/\.(csv|tsv|xlsx)$/i.test(f.name);
function busy(on){
  const n=$('dragNote');
  if(on){n.classList.remove('bad');n.textContent='명단을 읽는 중이에요';n.hidden=false;$('shell').setAttribute('aria-busy','true');}
  else{n.hidden=true;$('shell').removeAttribute('aria-busy');}
}
async function importFile(f){
  if(!f)return;
  if(!okFile(f))return sheetError('CSV나 XLSX만 가져올 수 있어요.');
  busy(true);
  try{
    if(/\.xlsx$/i.test(f.name)){
      if(f.size>8000000)throw Error('XLSX는 8MB까지 가져올 수 있어요. 시트에서 후보 탭과 플랫폼 수집 탭을 CSV로 하나씩 내려받아 끌어 놓아 주세요.');
      const X=await loadXlsx(),wb=X.read(new Uint8Array(await f.arrayBuffer()),{type:'array'});
      const found=[];wb.SheetNames.forEach(name=>{try{found.push({name,data:K.convert(X.utils.sheet_to_json(wb.Sheets[name],{header:1,raw:false,defval:'',blankrows:true})),source:K.sourceOf(name)});}catch(e){}});
      if(!found.length)throw Error('후보 명단 열이 있는 탭을 찾지 못했어요. 「이름」과 「직접 확인」 열이 있는 탭을 가져와 주세요.');
      // No 후보·수집 tab name: the first readable tab is the list, the rest only block.
      if(!found.some(t=>t.source))found[0].source='후보';
      addTabs(found,f.name);
    }else{
      if(f.size>3000000)throw Error('CSV는 3MB까지 가져올 수 있어요.');
      addTabs([oneTab(f.name.replace(/\.(csv|tsv)$/i,''),K.convert(K.parseDelimited(await f.text())))],f.name);
    }
  }catch(e){sheetError(e.message);}
  finally{busy(false);}
}
function downloadSheet(){
  window.open('https://docs.google.com/spreadsheets/d/'+SHEET_ID+'/export?format=xlsx','_blank','noopener');
  toast('시트를 내려받고 있어요. 받은 파일을 이 창에 끌어 놓아 주세요.');
}

/* ---------- Reusable wording fields ---------- */
const TPL_LABELS={'email.subject':'메일 제목','email.preheader':'숨은 미리보기 문장','email.headline':'큰 제목','email.greeting':'인사','email.intro':'소개','email.gift':'감사 선물','email.steps':'참여 방법','email.ask':'궁금한 점','email.closing':'맺음','email.signature':'서명','email.footer':'맨 아래 고지','dm.message':'DM 본문'};
function fillTplFields(){
  const box=$('tplFields');
  if(!box.dataset.built){
    box.dataset.built='1';
    Object.entries(TPL_LABELS).forEach(([k,label])=>{
      const id='t-'+k.replace('.','-');const multi=!/subject|preheader/.test(k);
      const w=document.createElement('div');w.className='tpl-field';
      w.innerHTML='<label for="'+id+'">'+esc(label)+'<span class="changed" hidden>고침</span></label>'+(multi?'<textarea class="field" rows="'+(k==='dm.message'?12:3)+'" id="'+id+'" data-tpl="'+k+'"></textarea>':'<input class="field" id="'+id+'" data-tpl="'+k+'">');
      box.appendChild(w);
      const i=w.querySelector('[data-tpl]');
      i.addEventListener('input',()=>{const [c,kk]=k.split('.');saveWording(c,kk,i.value);});
      i.addEventListener('focus',()=>{const kk=k.split('.')[1];if(k.startsWith('email.')){outline=kk;render();}});
      i.addEventListener('blur',()=>{if(outline){outline='';render();}});
    });
  }
  box.querySelectorAll('[data-tpl]').forEach(i=>{const [c,k]=i.dataset.tpl.split('.');i.value=savedTemplate(wordingVariant())[c][k];});
}

/* ---------- Iframe sizing and logo ---------- */
function fitFrame(){
  const f=$('frame');try{const d=f.contentDocument;if(!d||!d.documentElement)return;const h=Math.max(400,d.documentElement.scrollHeight)+'px';if(f.style.height!==h)f.style.height=h;}catch(e){}
}
// The canvas grows with its content. No ResizeObserver across the frame boundary (it logs layout-loop errors on every reload):
// the height is re-read when the frame loads, when its images and fonts arrive, and when its width changes.
$('frame').addEventListener('load',()=>{
  fitFrame();
  try{
    const d=$('frame').contentDocument;
    [...d.images].forEach(i=>{i.addEventListener('load',fitFrame);i.addEventListener('error',fitFrame);});
    if(d.fonts){d.fonts.addEventListener('loadingdone',fitFrame);if(d.fonts.ready)d.fonts.ready.then(fitFrame);}
    // Links in the preview open in a new tab, as they will for the recipient.
    d.querySelectorAll('a').forEach(a=>{a.target='_blank';a.rel='noopener';});
  }catch(e){}
  setTimeout(fitFrame,400);
});
window.addEventListener('resize',fitFrame);
$('mail').addEventListener('transitionend',fitFrame);
(function checkLogo(){const img=new Image();img.onload=()=>{logoBroken=false;};img.onerror=()=>{logoBroken=true;render();};img.src=C.LOGO+'?v=1';})();

/* ---------- Keyboard helpers ---------- */
function radioKeys(group,ids,apply){
  $(group).addEventListener('keydown',e=>{
    const i=ids.findIndex(id=>$(id).getAttribute('aria-checked')==='true');
    let n=null;if(e.key==='ArrowRight'||e.key==='ArrowDown')n=(i+1)%ids.length;if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=(i-1+ids.length)%ids.length;
    if(n==null)return;e.preventDefault();apply(ids[n]);$(ids[n]).focus();
  });
}
function menuKeys(menu){
  // Items hidden by attribute, by a hidden parent or by CSS (휴대폰 폭으로 보기 under 1024) are skipped.
  const items=()=>[...menu.querySelectorAll('[role^=menuitem]:not([hidden]):not([aria-hidden=true])')].filter(x=>x.offsetParent!==null);
  menu.addEventListener('toggle',e=>{if(e.newState==='open'){const f=items()[0];f&&f.focus();}});
  menu.addEventListener('keydown',e=>{
    const list=items(),i=list.indexOf(document.activeElement);if(!list.length)return;
    if(e.key==='ArrowDown'){e.preventDefault();list[(i+1)%list.length].focus();}
    if(e.key==='ArrowUp'){e.preventDefault();list[(i-1+list.length)%list.length].focus();}
    if(e.key==='Home'){e.preventDefault();list[0].focus();}
    if(e.key==='End'){e.preventDefault();list[list.length-1].focus();}
  });
}
// field-sizing:content grows the box by itself where the browser has it; this is the fallback.
const SELF_SIZING=!!(window.CSS&&CSS.supports&&CSS.supports('field-sizing','content'));
function autoGrow(){if(SELF_SIZING)return;const t=$('v-seen');t.style.height='auto';t.style.height=Math.max(96,t.scrollHeight+2)+'px';}

/* ---------- Events ---------- */
function staleCopy(){
  // What sits in the clipboard no longer matches the screen once the text changes.
  const d=draft();if(d.flow==='copied'||d.flow==='opened'){d.flow='';delete d.copiedChannel;store.set(S,KEY.drafts,drafts);copyStale=true;delete $('primary').dataset.flash;primarySig='';toast('글이 바뀌어서 다시 복사해야 해요.');}
}
/* The one way code changes the line: frames and the sheet's line go through here, so a copy made before is marked stale.
   keepCopy is only for swapping particle markers for what values() already resolved them to — the computed text is the same. */
function setSeen(text,opts){
  if(!(opts&&opts.keepCopy))staleCopy();
  $('v-seen').value=text;touched.add('v-seen');autoGrow();saveDraft();render();refreshRowStatus();refreshHints();
}
async function useFrame(text){
  const f=$('v-seen');
  if(f.value.trim()&&await ask('쓰던 문장을 문장 틀로 바꿀까요?','지금 쓴 문장은 지워져요.',[['닫기','close'],['바꾸기','go',true]])!=='go')return;
  setSeen(text);toggleCoach(false);
  f.focus();const b=C.nextBlank(text,0);if(b)f.setSelectionRange(b[0],b[1]);
}
document.addEventListener('input',e=>{
  const el=e.target;
  if(el.id==='listSearch'||el.id==='sheetPaste')return;   // search and the paste box never touch drafts, the preview or the copied state
  if(el.dataset&&(el.dataset.var!=null||el.dataset.tpl!=null)&&el.id!=='v-sender'||['to','handle','adPhone','v-sender'].includes(el.id))staleCopy();
  if(el.dataset&&el.dataset.var!=null||['to','handle','adPhone'].includes(el.id)){
    touched.add(el.id);if(el.id==='v-seen')autoGrow();saveDraft();render();
    if(el.id==='v-seen'){refreshRowStatus();clearTimeout(hintTimer);hintTimer=setTimeout(refreshHints,600);}
  }
});
$('to').addEventListener('blur',()=>{$('to').value=$('to').value.trim();touched.add('to');render();});
$('handle').addEventListener('change',()=>{$('handle').value=handleOf($('handle').value);saveDraft();render();});
$('v-seen').addEventListener('paste',e=>{const t=e.clipboardData&&e.clipboardData.getData('text/plain');if(t==null)return;e.preventDefault();document.execCommand('insertText',false,C.clean(t));});
$('v-seen').addEventListener('focus',()=>{focusSeen=true;render();});
// Blur computes at once (a click under way must see the latest text and blocks); what would redraw or move waits for the pointer.
$('v-seen').addEventListener('blur',()=>{
  focusSeen=false;touched.add('v-seen');render();refreshRowStatus();refreshHints();
  afterPointer(()=>{const f=$('v-seen'),r=C.resolveParticles(f.value);if(r!==f.value&&document.activeElement!==f)setSeen(r,{keepCopy:true});});
});
$('v-seen').addEventListener('keydown',e=>{
  if(e.isComposing||e.keyCode===229)return;
  // ⌘Enter is the primary button: same handler, same blocks.
  if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)){e.preventDefault();$('primary').click();return;}
  // Tab walks forward through a frame's blanks; with none ahead it is a plain Tab. Shift+Tab is always plain.
  if(e.key==='Tab'&&!e.shiftKey&&!e.altKey&&!e.ctrlKey&&!e.metaKey){const f=e.target,b=C.nextBlank(f.value,f.selectionEnd);if(b){e.preventDefault();f.setSelectionRange(b[0],b[1]);}}
});
$('coachToggle').onclick=()=>toggleCoach($('coachPanel').hidden);
$('chEmail').onclick=()=>setChannel('email');$('chDm').onclick=()=>setChannel('dm');
$('vBasic').onclick=()=>setVariant('basic');$('vMusic').onclick=()=>setVariant('music');
radioKeys('variantSeg',['vBasic','vMusic'],id=>setVariant(id==='vMusic'?'music':'basic'));
radioKeys('channelSeg',['chEmail','chDm'],id=>setChannel(id==='chDm'?'dm':'email'));
radioKeys('scopeSeg',['scopeReady','scopeAll'],id=>setScope(id==='scopeAll'?'all':'ready'));
$('scopeReady').onclick=()=>setScope('ready');$('scopeAll').onclick=()=>setScope('all');
$('personFold').addEventListener('toggle',()=>{const f=$('personFold');if(!f.open){if(state&&state.blocks.some(c=>c.field&&$(c.field)&&$(c.field).closest('#personFold')))foldDismissed=true;clearFoldFocus();}});
$('personAll').onclick=()=>{clearFoldFocus();const f=$('personFold').querySelector('.field');f&&f.focus();};
$('adOn').onclick=()=>{staleCopy();ui.ad=!ui.ad;saveDraft();render();if(ui.ad&&!$('adPhone').value.trim())$('adPhone').focus();};
$('footerOn').onclick=()=>{if(ui.ad)return;staleCopy();ui.footer=!ui.footer;saveDraft();render();};
$('allDoneReset').onclick=()=>setScope('all');
$('listFilter').addEventListener('change',e=>setFilter(e.target.value));
$('listMore').onclick=()=>{const at=listLimit;listLimit+=200;renderRecipients();const li=$('recipientList').children[at];if(li)li.scrollIntoView({block:'nearest'});};
function clearSearch(focus){const f=$('listSearch');f.value='';query='';listLimit=200;$('listSearchClear').hidden=true;renderRecipients();if(focus)f.focus();}
$('listSearch').addEventListener('input',()=>{query=$('listSearch').value;listLimit=200;$('listSearchClear').hidden=!query;renderRecipients();});
function activeRow(i){
  const ul=$('recipientList'),items=[...ul.children];if(!items.length)return;
  i=Math.max(0,Math.min(items.length-1,i));
  items.forEach((li,j)=>li.classList.toggle('active',j===i));ul.setAttribute('aria-activedescendant',items[i].id);items[i].scrollIntoView({block:'nearest'});
}
$('listSearch').addEventListener('keydown',e=>{
  if(e.isComposing||e.keyCode===229){if(e.key==='Escape')e.stopPropagation();return;}   // keys that end Korean composition are not commands
  if(e.key==='ArrowDown'&&$('recipientList').children.length){e.preventDefault();$('recipientList').focus();activeRow(0);return;}
  if(e.key==='Enter'){const only=$('recipientList').children;if(only.length===1){e.preventDefault();choose(only[0].dataset.key);}return;}
  if(e.key!=='Escape'||!$('listSearch').value)return;   // empty: Esc closes the list as usual
  e.preventDefault();e.stopPropagation();clearSearch(false);
});
$('listSearchClear').onclick=()=>clearSearch(true);
$('recipientList').addEventListener('click',e=>{const li=e.target.closest('li[data-key]');if(li)choose(li.dataset.key);});
$('recipientList').addEventListener('keydown',e=>{
  const ul=$('recipientList'),items=[...ul.children];if(!items.length)return;
  const i=items.findIndex(li=>li.classList.contains('active'));
  if(e.key==='ArrowDown'){e.preventDefault();activeRow(i+1);}
  if(e.key==='ArrowUp'){e.preventDefault();if(i<=0){items.forEach(li=>li.classList.remove('active'));$('listSearch').focus();}else activeRow(i-1);}
  if(e.key==='Enter'&&i>=0){e.preventDefault();choose(items[i].dataset.key);}
});
$('recipientList').addEventListener('blur',()=>[...$('recipientList').children].forEach(li=>li.classList.remove('active')));
$('recipients').addEventListener('toggle',e=>{if(e.newState==='open'){renderRecipients();const s=$('recipientList').querySelector('[aria-selected="true"]');if(s)s.scrollIntoView({block:'nearest'});(mqNarrow.matches?$('recipientsClose'):$('listSearch')).focus({preventScroll:true});}});
$('recipientsClose').onclick=()=>{closeDrawer();$('drawerToggle').focus();};
$('postOpen').addEventListener('click',e=>{if($('postOpen').getAttribute('aria-disabled')==='true'){e.preventDefault();goField('v-post',true);}});
$('v-post').addEventListener('blur',()=>{const f=$('v-post'),v=f.value.trim();if(v&&!/^[a-z][a-z0-9+.-]*:/i.test(v)&&/^[\w-]+(\.[\w-]+)+\//i.test(v)){f.value='https://'+v;f.dispatchEvent(new Event('input',{bubbles:true}));}});
// While the label still says 「복사했어요」 the button already means 「기록하기」: a press then would record someone not yet written to.
$('primary').onclick=()=>{if(primaryGuard||$('primary').dataset.flash)return;primary($('primary'));};
// --- More menu ---
$('copyBody').onclick=()=>{
  const b=$('copyBody');if(menuLocked('copyBody'))return;
  if(b.dataset.mode==='reopen'){copyAndOpen($('primary'));hidePop('moreMenu');return;}   // the success mark shows on the primary button
  copyOnly();hidePop('moreMenu');
};
$('copySubject').onclick=()=>menuCopy('copySubject',last.subject,'제목을 복사했어요.');
$('copyTo').onclick=()=>{const t=$('to').value.trim();if(!t){hidePop('moreMenu');return goField('to',true);}menuCopy('copyTo',t,'받는 주소를 복사했어요.');};
$('exFile').onclick=download;
$('downloadEditor').onclick=downloadEditor;
$('copyDocLink').onclick=()=>copyWithFeedback($('copyDocLink'),EDITOR_URL,'링크를 복사했어요');
$('downloadEmailSource').onclick=downloadEmailSource;
const pickDmVariant=v=>{if(sampleMode()){sampleVariant=v;render();fillTplFields();}else setVariant(v);};
$('dmBasicPreview').onclick=()=>pickDmVariant('basic');$('dmMusicPreview').onclick=()=>pickDmVariant('music');
radioKeys('dmVariantSwitch',['dmBasicPreview','dmMusicPreview'],id=>pickDmVariant(id==='dmMusicPreview'?'music':'basic'));
$('previewEmail').onclick=()=>switchPreview('email');
$('previewDm').onclick=()=>switchPreview('dm');
radioKeys('previewSwitch',['previewEmail','previewDm'],id=>switchPreview(id==='previewDm'?'dm':'email'));
$('copyMailSource').onclick=()=>{if(!menuLocked('copyMailSource'))copyOnly(true);};
$('exSource').onclick=()=>menuCopy('exSource',last.emailHtml,'HTML 소스를 복사했어요.');
$('exText').onclick=()=>menuCopy('exText',last.emailText,'양식 없이 글만 복사했어요.');
$('alreadySent').onclick=async()=>{
  hidePop('moreMenu');
  if(await ask(plainName($('v-name').value)+'님에게 이미 보냈나요?','이 창의 보낸 분에 올려요. 시트 줄은 기록한 뒤 「시트 줄 복사」로 복사해요.',[['닫기','close'],['보냈어요 · 기록하기','go',true]])==='go')record();
};
$('replyOpen').onclick=()=>{hidePop('moreMenu');openReplies();};
$('replyClose').onclick=closeReplies;
function openWording(){editReturn=viewNow()==='edit'?editReturn:viewNow();hidePop('moreMenu');closePreview();showView('edit');fillTplFields();$('editClose').focus();}
$('editOpen').onclick=$('previewEdit').onclick=openWording;
$('settingsOpen').onclick=()=>{hidePop('moreMenu');closePreview();showView('settings');$('settingsClose').focus();};
$('editClose').onclick=()=>{showView(editReturn);$('previewEdit').focus();};
$('settingsClose').onclick=()=>{showView('compose');$('moreBtn').focus();};
$('widthToggle').onclick=()=>{ui.width=ui.width==='desk'?'mobile':'desk';hidePop('moreMenu');render();};
$('importOpen').onclick=()=>{showView('import');};
$('importClose').onclick=()=>{showView('compose');};
$('manualStart').onclick=()=>choose('manual');
$('copyLog').onclick=()=>copyAllRows($('copyLog'));
$('clearLog').onclick=async()=>{
  const go=await ask('보낸 분 '+log.length+'명 목록을 비울까요?','시트에 옮기지 않은 줄은 사라져요.',[['닫기','close',true],['비우기','go',false,true]]);
  $('drawerToggle').focus();
  if(go!=='go')return;
  log=[];store.del(S,KEY.log);Object.values(drafts).forEach(d=>{if(d.flow==='recorded')d.flow='';delete d.recordedAt;});store.set(S,KEY.drafts,drafts);renderAll();
};
$('copyOptout').onclick=()=>copyWithFeedback($('copyOptout'),C.reply('optout',replyValues()));
$('copySource').onclick=()=>copyWithFeedback($('copySource'),C.reply('source',replyValues()));
$('copyOptoutRow').onclick=()=>{const v=replyValues(),c=$('to').value.trim()||('@'+handleOf($('handle').value));copyWithFeedback($('copyOptoutRow'),[v['활동명'],c,ui.channel==='dm'?'인스타 DM':'메일','수신거부 '+new Date().toLocaleDateString('ko-KR'),$('v-sender').value.trim()].join('\t'));};
$('tplReset').onclick=async()=>{
  const channel=wordingChannel(),variant=wordingVariant();
  if(await ask('이 양식을 기본 문구로 되돌릴까요?','현재 분야의 '+(channel==='email'?'이메일':'DM')+'에서 고친 문구만 지워져요.',[['닫기','close',true],['되돌리기','go',false,true]])!=='go')return;
  const saved=store.get(L,KEY.tpl,{});if(saved[variant])delete saved[variant][channel];
  if(!store.set(L,KEY.tpl,saved)){toast('저장하지 못했어요. 다시 시도해 주세요.');return;}
  tpl=mergeTpl();staleCopy();fillTplFields();setText($('wordingStatus'),'기본 문구로 되돌렸어요.');render();
};
$('manualClose').onclick=()=>$('manual').close();
$('manualOpen').onclick=()=>{$('manual').close();if(manualThen)manualThen();};
$('manual').addEventListener('close',syncPrimaryFill);
// --- List menu ---
$('sheetDownload').onclick=downloadSheet;$('mRedownload').onclick=()=>{hidePop('listMenu');downloadSheet();};
$('mOtherFile').onclick=()=>{hidePop('listMenu');$('sheetFile').click();};
// Opens the import view only: the person and the list stay as they are.
$('mPaste').onclick=()=>{closeDrawer();showView('import');$('pasteBox').open=true;$('sheetPaste').focus();};
$('mClear').onclick=async()=>{
  closeDrawer();
  if(!(await leaveGuard()))return $('drawerToggle').focus();
  if(await ask('가져온 명단을 지울까요?','원본 시트와 보낸 분 목록은 그대로예요.',[['닫기','close',true],['지우기','go',false,true]])!=='go')return $('drawerToggle').focus();
  sheet=null;store.del(S,KEY.people);rebuild();
  await choose('manual',{force:true,guarded:true});
  showView('import');renderAll();
};
$('sheetFile').onchange=async()=>{const f=$('sheetFile').files[0];$('sheetFile').value='';await importFile(f);};
$('importPaste').onclick=()=>importText($('sheetPaste').value);
// A table pasted anywhere on the import view is the list, unless the cursor is in a field.
document.addEventListener('paste',e=>{
  if(viewNow()!=='import'||document.querySelector('dialog[open]'))return;
  if(e.target&&e.target.closest&&e.target.closest('input,textarea,[contenteditable]'))return;
  const text=e.clipboardData&&e.clipboardData.getData('text/plain');if(!text||!text.trim())return;
  e.preventDefault();importText(text);
});
$('previewOpen').onclick=()=>{openPreview();$('previewClose').focus();};
$('previewClose').onclick=()=>{closePreview();$('previewOpen').focus();};
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape'||e.defaultPrevented||openPops().length||document.querySelector('dialog[open]'))return;   // popovers and dialogs close themselves
  if(!$('replyPanel').hidden){closeReplies();return;}
  if($('previewCol').classList.contains('open'))closePreview();
});
menuKeys($('listMenu'));menuKeys($('moreMenu'));
// Drag and drop: the whole window receives files.
let dragDepth=0;const hasFiles=e=>!!e.dataTransfer&&[...e.dataTransfer.types].includes('Files');
document.addEventListener('dragenter',e=>{if(!hasFiles(e))return;e.preventDefault();dragDepth++;$('shell').classList.add('dragging');const item=e.dataTransfer.items&&e.dataTransfer.items[0];const bad=item&&item.type&&!/csv|tab-separated|spreadsheetml|vnd\.ms-excel/.test(item.type);$('dragNote').hidden=false;$('dragNote').classList.toggle('bad',!!bad);$('dragNote').textContent=bad?'CSV나 XLSX만 가져올 수 있어요':(hasSheet()?'놓으면 명단에 더해요':'놓으면 명단을 가져와요');});
document.addEventListener('dragover',e=>{if(hasFiles(e))e.preventDefault();});
document.addEventListener('dragleave',()=>{if(--dragDepth<=0){dragDepth=0;$('shell').classList.remove('dragging');$('dragNote').hidden=true;}});
document.addEventListener('drop',e=>{if(!hasFiles(e)||!e.dataTransfer.files.length)return;e.preventDefault();dragDepth=0;$('shell').classList.remove('dragging');$('dragNote').hidden=true;importFile(e.dataTransfer.files[0]);});
// Leaving with an opened-but-unrecorded mail asks first.
window.addEventListener('beforeunload',e=>{if(Object.values(drafts).some(d=>d.flow==='opened')){e.preventDefault();e.returnValue='';}});
// The night window can start while the tab is open. render() never opens or closes a popover.
setInterval(render,60000);
// Under 1024 the action bar is fixed to the bottom: what scrolls keeps clear of it.
if(window.ResizeObserver)new ResizeObserver(()=>{document.documentElement.style.setProperty('--act-h',$('actBar').offsetHeight+'px');}).observe($('actBar'));

/* ---------- Start ---------- */
if(hasSheet()&&!sheet.listed)sheet.listed=listedOf(sheet.tabs);   // lists saved before the merge
rebuild();
fillTplFields();
renderSubjects(values()); // builds the 작품명 field before drafts are loaded into it
loadDraftInto(ui.current,findPerson(ui.current));
$('v-sender').value=store.get(L,KEY.sender,'')||'';$('adPhone').value=store.get(L,KEY.phone,'')||'';
resetPersonUi();
// No list and nothing typed yet: start by bringing a list in.
showView(hasSheet()||drafts.manual&&(drafts.manual.vars['활동명']||drafts.manual.to||drafts.manual.handle)?'compose':'import');
renderAll();autoGrow();refreshHints();
