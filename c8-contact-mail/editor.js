/* Wiring only. The candidate sheet's status column is the send record of truth; drafts, the list and this window's
   sends live in sessionStorage and end with the window. Only the sender name and company phone are remembered. */
const SHEET_ID='1BBRYmwNxBEnUpDuLTSg6KLmVgzaxVpdfjT-aU92ZTo4';
// Tab gids for 「시트에서 보기」. 수집 gid is filled in when 샐리 shares it (결정 3); until then 수집 rows get no sheet link.
const TAB_GID={후보:'862905173',수집:'619389779'};
const KEY={people:'c8-contact-people-v1',ui:'c8-contact-ui-v2',drafts:'c8-contact-drafts-v2',tpl:'c8-contact-tpl-once-v2',sender:'c8-contact-sender-v1',phone:'c8-contact-phone-v1',log:'c8-contact-sent-v1'};
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

let sheet=store.get(S,KEY.people,null);
let log=store.get(S,KEY.log,[]);if(!Array.isArray(log))log=[];
let drafts=store.get(S,KEY.drafts,{});if(!drafts||typeof drafts!=='object')drafts={};
let ui=Object.assign({channel:'email',current:'manual',subject:0,footer:true,ad:false,mark:false,width:'desk',scope:'ready',filter:''},store.get(S,KEY.ui,{}));
// Two toggles became one scope: a window that had either one off keeps seeing everyone.
if('fBoth' in ui||'fOpen' in ui){ui.scope=(ui.fBoth===false||ui.fOpen===false)?'all':'ready';delete ui.fBoth;delete ui.fOpen;}
delete ui.tab;
if(ui.scope!=='all')ui.scope='ready';if(typeof ui.filter!=='string')ui.filter='';
let tpl=mergeTpl(store.get(S,KEY.tpl,null));
let attempted=false,touched=new Set(),logoBroken=false,focusSeen=false,outline='',last=null,lastChecks=[],checklistOpen=null;

// One-off edits are stamped with the wording they were made on; a new confirmed wording drops them so an old DM never survives a reload.
function tplStamp(){let h=5381;const s=JSON.stringify(C.DEFAULTS);for(let i=0;i<s.length;i++)h=(h*33+s.charCodeAt(i))>>>0;return h.toString(36);}
const saveTpl=()=>store.set(S,KEY.tpl,{...tpl,v:tplStamp()});
function mergeTpl(saved){
  const t=JSON.parse(JSON.stringify(C.DEFAULTS));
  if(saved&&typeof saved==='object'&&saved.v===tplStamp())['email','dm'].forEach(c=>{if(saved[c])Object.keys(t[c]).forEach(k=>{if(typeof saved[c][k]==='string')t[c][k]=saved[c][k];});});
  return t;
}
const editedKeys=()=>C.EMAIL_SECTIONS.filter(k=>tpl.email[k]!==C.DEFAULTS.email[k]).map(k=>'email.'+k).concat(tpl.dm.message!==C.DEFAULTS.dm.message?['dm.message']:[]);

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
let manualThen=null;
function manualCopy(text,then){
  $('manualText').value=text;$('manualOpen').hidden=!then;manualThen=then||null;
  $('manual').showModal();$('manualText').focus();$('manualText').select();
}
function flash(btn,okText){
  const label=btn.querySelector('span')||btn;const keep=label.innerHTML;
  label.innerHTML=icon('check')+(okText||'복사했어요');btn.dataset.flash='1';
  // After the flash the label comes from the current state, not from before the click: the state may have moved on.
  setTimeout(()=>{if(btn.dataset.flash){delete btn.dataset.flash;label.innerHTML=keep;render();}},2000);
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
  if(d&&(d.vars&&d.vars['본 것 한 줄']||'').trim())return {t:'쓰는 중',ic:'pen'};
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
function values(){const v={};varInputs().forEach(i=>v[i.dataset.var]=i.value);return v;}
const subjectTpl=()=>ui.subject===0?tpl.email.subject:C.SUBJECT_ALTERNATIVES[ui.subject-1];
const activeTpl=()=>({email:{...tpl.email,subject:subjectTpl()},dm:tpl.dm});
const renderOpts=()=>({footer:ui.footer,ad:{on:ui.ad,phone:$('adPhone').value}});
function draft(){return drafts[ui.current]||(drafts[ui.current]={vars:{},to:'',handle:'',flow:''});}
function saveDraft(){
  const d=draft(),v=values();delete v['담당자명'];
  d.vars=v;d.to=$('to').value;d.handle=$('handle').value;d.channel=ui.channel;d.subject=ui.subject;
  store.set(S,KEY.drafts,drafts);store.set(S,KEY.ui,ui);
  store.set(L,KEY.sender,$('v-sender').value);store.set(L,KEY.phone,$('adPhone').value);
}
function loadDraftInto(key,p){
  const d=drafts[key];
  const set=(id,val)=>{$(id).value=val||'';};
  if(d){
    // Older drafts kept the post address only for DM people: fall back to the sheet's work address.
    set('v-name',d.vars['활동명']);set('v-platform',d.vars['플랫폼']);set('v-post',d.vars['게시물 주소']||(p&&p.url)||'');set('v-seen',d.vars['본 것 한 줄']);set('v-work',d.vars['작품명']);
    set('to',d.to);set('handle',d.handle);if(d.channel)ui.channel=d.channel;ui.subject=d.subject||0;
  }else if(p){
    set('v-name',plainName(p.name));set('to',p.email);set('handle',p.handle);set('v-platform',p.platform);
    set('v-post',p.url||'');set('v-seen','');set('v-work','');
    ui.subject=0;const ch=K.channelOf(p);if(ch)ui.channel=ch;
  }else{['v-name','v-platform','v-post','v-seen','v-work','to','handle'].forEach(id=>set(id,''));}
  touched=new Set();attempted=false;
}

/* ---------- Choosing a person ---------- */
async function choose(key,opts){
  if(key===ui.current&&!(opts&&opts.force))return closeDrawer();
  const cur=drafts[ui.current];
  if(cur&&cur.flow==='opened'&&!sentFor(idsOfCurrent(),plainName($('v-name').value))){
    const pick=await ask(plainName($('v-name').value)+'님은 '+(ui.channel==='dm'?'인스타':'Gmail')+'을 열었지만 아직 기록하지 않았어요','보냈다면 기록해 두세요. 그래야 다음에 다시 보내지 않아요.',[['닫기','close'],['넘어가기','skip'],['보냈어요 · 기록하기','record',true]]);
    if(pick==='close'||!pick)return;
    if(pick==='record')record({silent:true});
  }
  saveDraft();
  const switching=key!==ui.current;
  ui.current=key;
  const p=findPerson(key);
  // 「다음 분 쓰기」 can land outside the search or filter: release them so the row is on screen. Scope stays.
  if(p&&!visible().some(q=>q.key===key)&&(query||ui.filter)){query='';$('listSearch').value='';$('listSearchClear').hidden=true;ui.filter='';}
  loadDraftInto(key,p);
  if(switching&&editedKeys().length){store.del(S,KEY.tpl);tpl=mergeTpl(null);fillTplFields();toast('문구를 확정 문안으로 되돌렸어요.');}
  saveDraft();closeDrawer();renderAll();
  setTimeout(()=>{$('v-seen').focus();},0);
}
function step(d){
  const list=visible();if(!list.length)return;
  const at=list.findIndex(p=>keyOf(p)===ui.current);
  const p=list[at<0?(d>0?0:list.length-1):(at+d+list.length)%list.length];
  choose(keyOf(p));
}

/* ---------- Confirm dialog (one at a time) ---------- */
function ask(title,body,buttons){
  return new Promise(res=>{
    const d=$('confirm');$('confirmTitle').textContent=title;$('confirmBody').textContent=body;
    const row=$('confirmRow');row.replaceChildren();
    buttons.forEach(([label,val,primary,danger])=>{const b=document.createElement('button');b.className='btn'+(primary?' primary':'')+(danger?' danger':'');b.textContent=label;b.onclick=()=>{d.close();res(val);};row.appendChild(b);});
    d.onclose=()=>res(null);
    d.showModal();row.querySelector('button').focus();
  });
}

/* ---------- Checks ---------- */
const FIELD_OF={'v-name':'v-name','v-sender':'v-sender','v-platform':'v-platform','v-post':'v-post','v-seen':'v-seen','v-work':'v-work','to':'to','handle':'handle','adPhone':'adPhone'};
function allChecks(r,v){
  const t=activeTpl(),opts=renderOpts();
  const ids=idsOfCurrent(),rec=sentFor(ids,plainName(v['활동명']));
  const hist=pool.history.concat(log.map(x=>({name:x.name,seen:x.seen})));
  const cur=findPerson(ui.current),pw=cur?K.purposeWhy(cur):'';
  const list=C.check(t,v,{...opts,channel:ui.channel,to:$('to').value,now:new Date(),history:hist,sentBefore:rec?fmtDate(rec.at):''});
  const sheetMsg=(tab,row,name,why)=>(cur&&tab!==cur.tab?tab+' 탭 ':'')+row+'행 '+name+'님 — '+why+'. 이 분에게는 보내지 않아요.';
  matchesOf(ids,plainName(v['활동명'])).forEach(p=>{const why=K.blockedWhy(p);if(why&&!rec)list.unshift({level:'block',code:'sheet',msg:sheetMsg(p.tab,p.row,plainName(p.name),why),field:''});});
  // The merged group may be blocked through an id the form does not show (e.g. the 수집 row's mail).
  if(cur&&cur.blocked&&!rec&&!list.some(c=>c.code==='sheet'))list.unshift({level:'block',code:'sheet',msg:sheetMsg(cur.blocked.tab,cur.blocked.row,cur.blocked.name,cur.blocked.why),field:''});
  if(pw&&!rec)list.unshift({level:'block',code:'purpose',msg:(cur.source==='수집'?'플랫폼 수집 탭 ':'후보 탭 ')+cur.row+'행 '+plainName(cur.name)+'님 — '+pw+'. 지금 문안은 기존 작품을 올려 달라는 제안이라 이 분에게는 보내지 않아요.',field:''});
  if(cur&&!K.ready(cur)&&!pw&&!rec)list.push({level:'warn',code:'not-ready',msg:'시트에서 아직 「직접 확인」이나 「직접 컨택 후보」가 O가 아닌 분이에요. 확인한 뒤 보내 주세요.',field:''});
  if(ui.channel==='email'&&!$('to').value.trim())list.unshift({level:'block',code:'to-empty',msg:'받는 메일 주소가 비어 있어요.',field:'to',fix:handleOf($('handle').value)?['인스타 DM으로 바꾸기',()=>setChannel('dm')]:null});
  if(ui.channel==='dm'&&!handleOf($('handle').value))list.unshift({level:'block',code:'handle-empty',msg:'인스타 계정을 쓰면 DM 창을 바로 열 수 있어요.',field:'handle',fix:$('to').value.trim()?['이메일로 바꾸기',()=>setChannel('email')]:null});
  if(ui.subject===1&&ui.channel==='email'&&!$('v-work').value.trim())list.forEach(c=>{if(c.code==='leftover'||c.code==='empty:작품명'){c.field='v-work';c.fix=['1안으로 바꾸기',()=>{ui.subject=0;renderAll();}];}});
  if(ui.subject===1&&ui.channel==='email'&&!$('v-work').value.trim()&&!list.some(c=>c.field==='v-work'))list.unshift({level:'block',code:'work-empty',msg:'2안 제목에 넣을 작품명이 비어 있어요.',field:'v-work',fix:['1안으로 바꾸기',()=>{ui.subject=0;renderAll();}]});
  list.forEach(c=>{if(c.code==='ad-phone'){c.field='adPhone';c.fix=['설정 펼치기',()=>{$('settingsFold').open=true;$('adPhone').focus();}];}});
  if(ui.channel==='email'&&logoBroken)list.push({level:'warn',code:'logo',msg:'로고 이미지를 불러오지 못했어요. 받는 분에게도 깨져 보여요.',field:''});
  if(ui.channel==='email'&&r){const kb=new Blob([r.emailHtml]).size/1024;if(kb>80)list.push({level:'warn',code:'size',msg:'메일 HTML이 '+Math.round(kb)+'KB예요. 80KB를 넘으면 일부 메일 앱이 자를 수 있어요.',field:''});}
  list.forEach(c=>{if(c.code==='seen-empty')c.msg='이 분에게만 맞는 한 문장이 있으면 답장이 더 잘 와요.';if(c.code==='night'&&ui.channel==='dm')c.msg='인스타는 예약 전송이 없어요. 아침 8시 뒤에 보내면 좋아요.';if(c.code==='night'&&ui.channel==='email')c.msg='지금은 밤이에요. Gmail 「예약 전송」으로 아침 8시 10분 뒤를 고르면 좋아요.';if(c.code==='night-soon')c.msg='10분 뒤면 밤 시간이에요.';});
  // One message per problem: keep the first of each code.
  const seen=new Set();return list.filter(c=>!seen.has(c.code)&&seen.add(c.code));
}
function showFieldErrors(checks){
  document.querySelectorAll('.field[aria-invalid]').forEach(f=>f.removeAttribute('aria-invalid'));
  document.querySelectorAll('p.err[id^="err-"]').forEach(p=>{p.hidden=true;p.replaceChildren();});
  checks.forEach(c=>{
    if(!c.field||c.level!=='block'||c.field==='v-seen')return;
    if(!(attempted||touched.has(c.field)))return;
    const f=$(c.field),e=$('err-'+c.field);if(!f||!e||!e.hidden)return;
    f.setAttribute('aria-invalid','true');e.hidden=false;e.innerHTML=icon('x')+'<span>'+esc(c.msg)+'</span>';
    if(c.fix){const b=document.createElement('button');b.className='btn sm';b.textContent=c.fix[0];b.onclick=c.fix[1];e.appendChild(b);}
  });
  const sw=checks.find(c=>c.field==='v-seen'&&(touched.has('v-seen')||attempted)&&c.code!=='seen-empty');
  $('seenErr').hidden=!sw;$('seenErr').innerHTML=sw?icon(sw.level==='block'?'x':'alert')+'<span>'+esc(sw.msg)+'</span>':'';
  $('seenErr').style.color=sw&&sw.level==='warn'?'var(--warn)':'';
  $('v-seen').toggleAttribute('aria-invalid',!!(sw&&sw.level==='block'));
}
function renderChecks(checks){
  lastChecks=checks;
  const blocks=checks.filter(c=>c.level==='block'),warns=checks.filter(c=>c.level==='warn');
  const sum=(el)=>{
    el.className='check-summary '+(blocks.length?'block':warns.length?'warn':'ok');
    el.innerHTML=blocks.length?icon('x')+'<span>막힘 '+blocks.length+'</span><span class="more">보기</span>':warns.length?icon('alert')+'<span>확인 '+warns.length+'</span><span class="more">보기</span>':icon('check')+'<span>보낼 수 있어요</span>';
    el.setAttribute('aria-expanded',String(!$('checklist').hidden));
  };
  const open=checklistOpen!=null?checklistOpen:!!blocks.length&&(attempted||ui.current!=='manual'||!!$('v-name').value.trim());
  $('checklist').hidden=!open||!checks.length;
  sum($('checkSummary'));sum($('checkSummaryM'));
  const ul=$('checkItems');ul.replaceChildren();
  checks.forEach(c=>{
    const li=document.createElement('li');li.className=c.level;
    li.innerHTML=icon(c.level==='block'?'x':'alert')+'<span class="msg">'+esc(c.msg)+'</span>';
    if(c.level==='block')li.setAttribute('role','alert');
    if(c.fix){const b=document.createElement('button');b.className='btn sm';b.textContent=c.fix[0];b.onclick=c.fix[1];li.appendChild(b);}
    if(c.field&&$(c.field)){const b=document.createElement('button');b.className='btn sm';b.textContent='고치기';b.onclick=()=>goField(c.field);li.appendChild(b);}
    ul.appendChild(li);
  });
  const passed=Math.max(0,8-checks.length);$('checkPassed').hidden=!checks.length;$('checkPassed').innerHTML=icon('check')+'<span>나머지 '+passed+'개 통과</span>';
  showFieldErrors(checks);
  return blocks;
}
function goField(id){
  const f=$(id);if(!f)return;
  const d=f.closest('details');if(d)d.open=true;
  closeSheets();
  f.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  setTimeout(()=>f.focus({preventScroll:true}),180);
}

/* ---------- Render ---------- */
function setChannel(c){const n=c==='dm'?'dm':'email';if(n!==ui.channel)staleCopy();ui.channel=n;saveDraft();renderAll();}
function renderAll(){renderRecipients();render();}
function render(){
  const v=values(),t=activeTpl(),opts=renderOpts();
  const r=C.render(t,v,opts);last=r;
  const mark=ui.mark?true:(focusSeen?new Set(['본 것 한 줄']):false);
  const shown=(mark||outline)?C.render(t,v,{...opts,mark,outline}):r;
  const checks=allChecks(r,v);
  const blocks=renderChecks(checks);
  const d=draft(),flow=d.flow||'';
  const isEmail=ui.channel==='email';
  // Channel-dependent visibility
  document.querySelectorAll('[data-only]').forEach(el=>el.hidden=el.dataset.only!==ui.channel);
  [['chEmail',isEmail],['chDm',!isEmail]].forEach(([id,on])=>{$(id).setAttribute('aria-checked',String(on));$(id).tabIndex=on?0:-1;});
  [['wDesk',ui.width==='desk'],['wMobile',ui.width!=='desk']].forEach(([id,on])=>{$(id).setAttribute('aria-checked',String(on));$(id).tabIndex=on?0:-1;});
  $('mail').classList.toggle('mobile',ui.width!=='desk');
  // Header
  const nm=plainName(v['활동명']);$('who').textContent=nm?nm+' 님':'받는 분을 골라 주세요';$('who').classList.toggle('is-empty',!nm);
  // Person summary and sheet note
  const p=findPerson(ui.current);
  $('personSummary').hidden=!p;$('sheetNote').hidden=!(p&&p.note);
  if(p){
    const line=$('summaryLine'),href=rowHref(p);
    line.textContent=[(p.source==='수집'?'플랫폼 수집':'후보')+' 탭 '+p.row+'행',p.grade?p.grade+'등급':'',p.platform,p.status||'미연락'].filter(Boolean).join(' · ');
    if(href){const a=document.createElement('a');a.className='link';a.id='rowLink';a.href=href;a.target='_blank';a.rel='noopener';a.innerHTML='시트에서 보기'+icon('ext');line.append(' · ',a);}
    $('sheetNote').textContent='시트 비고 · '+(p.note||'');
    const kv=$('sheetKv');kv.innerHTML='';
    const add=(k,val,btn)=>{const dt=document.createElement('dt');dt.textContent=k;const dd=document.createElement('dd');dd.textContent=val||'비어 있음';kv.append(dt,dd);const cell=document.createElement('dd');if(btn)cell.appendChild(btn);kv.appendChild(cell);};
    add('연락 창구',p.contact);add('시트 상태',p.status||'비어 있음');
    if(p.seen){const b=document.createElement('button');b.className='btn sm';b.textContent='이 문장 넣기';b.onclick=()=>{$('v-seen').value=p.seen;touched.add('v-seen');autoGrow();saveDraft();render();};add('적힌 본 것',p.seen,b);}
  }
  $('sheetFold').hidden=!p;
  $('noListHint').hidden=hasSheet();
  // Seen count
  // DM: the line stands as its own paragraph after 「인스타그램에서 …보고 연락드렸어요」, so it reads as what struck us.
  $('seenLabel').textContent=isEmail?(nm?nm+'님 작품에서 본 것':'본 것 한 줄'):(nm?nm+'님 작업에서 인상 깊었던 점':'인상 깊었던 점');
  $('seenHelp').textContent=isEmail?'「…작업이 인상 깊어 연락드렸어요」 다음 문단에 그대로 들어가요.':'「인스타그램에서 …작업을 보고 연락드렸어요」 다음 문단에 그대로 들어가요.';
  $('v-seen').placeholder=isEmail?'예: 배경을 손으로 긁어 낸 질감이 인물보다 먼저 눈에 들어왔어요.':'예: 손으로 접은 종이가 펼쳐지며 끝나는 장면이 특히 인상 깊었어요.';
  $('editTitle').textContent=isEmail?'이번 메일만 문구 고치기':'이번 DM만 문구 고치기';
  renderWorkLink(p,isEmail);
  const n=C.chars(v['본 것 한 줄'].trim());$('seenCount').textContent=n+'/'+C.LIMITS.seenMax+'자';$('seenCount').classList.toggle('over',n>C.LIMITS.seenMax);
  // Subject group
  renderSubjects(v);
  // Settings summary
  $('settingsSummary').textContent=[isEmail?($('v-sender').value.trim()||'담당자명 없음'):'',isEmail?(ui.footer?'고지 켜짐':'고지 꺼짐'):'',ui.ad?'광고 켜짐':'광고 꺼짐'].filter(Boolean).join(' · ');
  $('adOn').setAttribute('aria-checked',String(ui.ad));$('adBox').hidden=!ui.ad;
  $('footerOn').setAttribute('aria-checked',String(ui.footer||ui.ad));$('footerOn').disabled=ui.ad;$('footerLocked').hidden=!ui.ad;
  $('markOn').setAttribute('aria-checked',String(ui.mark));
  $('adBadge').hidden=!ui.ad;
  const edited=editedKeys().filter(k=>isEmail?k.startsWith('email.'):k.startsWith('dm.'));
  $('editSummary').textContent=edited.length?'고친 곳 '+edited.length:'';$('editBadge').hidden=!edited.length;
  document.querySelectorAll('[data-tpl]').forEach(i=>{const c=i.dataset.tpl.split('.')[0];i.closest('.tpl-field').hidden=(c==='email')!==isEmail;const m=i.closest('.tpl-field').querySelector('.changed');if(m)m.hidden=!edited.includes(i.dataset.tpl);});
  // Preview: inbox card + canvas
  $('ibFrom').textContent='크리에이터클럽';
  $('ibSubj').innerHTML=esc(shown.subjectMarked).replace(/\u0001/g,'<mark class="mailmark">').replace(/\u0002/g,'</mark>');
  $('ibSnip').textContent=r.emailText.replace(/\s+/g,' ').slice(0,90);
  $('ibTo').textContent='받는 사람 '+($('to').value.trim()||'(비어 있음)');
  const doc=$('frame');if(doc.dataset.html!==shown.emailHtml){doc.dataset.html=shown.emailHtml;doc.srcdoc=shown.emailHtml;}
  const kb=Math.max(1,Math.round(new Blob([r.emailHtml]).size/1024));$('sizeNote').textContent='약 '+kb+'KB';$('exSize').textContent='HTML 약 '+kb+'KB';
  // DM preview
  const h=handleOf($('handle').value);
  $('dmWho').textContent=h?'@'+h+'에게 보내는 메시지 요청':'인스타 계정을 쓰면 받는 사람이 보여요';
  $('dmText').innerHTML=esc(shown.dmMarked).replace(/\u0001/g,'<mark>').replace(/\u0002/g,'</mark>');
  const dn=C.chars(r.dm);$('dmMeta').textContent=dn.toLocaleString()+'/'+C.LIMITS.dmChars.toLocaleString()+'자 · 팔로하지 않는 분에게는 수락 전 한 통·글만 가요';$('dmMeta').classList.toggle('over',dn>C.LIMITS.dmChars);
  // Action bar state
  const nx=nextPerson();
  let label,mode;
  const recorded=flow==='recorded'||!!sentFor(idsOfCurrent(),nm)&&flow!=='opened';
  if(recorded){mode='next';label=nx?'다음 분 쓰기 · '+plainName(nx.name):(log.length?'시트 줄 모두 복사':'다음 분이 없어요');}
  else if(flow==='opened'||flow==='copied'){mode='record';label='보냈어요 · 기록하기';}
  else{mode='open';label=isEmail?'복사하고 Gmail 열기':'복사하고 인스타 열기';}
  const lockPrimary=mode==='open'&&blocks.length;
  [['primary','primaryLabel'],['primaryM','primaryLabelM']].forEach(([b,l])=>{
    if(!$(b).dataset.flash||$(b).dataset.mode!==mode){delete $(b).dataset.flash;$(l).textContent=label;}
    $(b).dataset.mode=mode;
    $(b).setAttribute('aria-disabled',String(!!lockPrimary||(mode==='next'&&!nx&&!log.length)));
    $(b).title=lockPrimary?blocks.map(x=>x.msg).join('\n'):'';
  });
  const copyBtn=$('copyBody');
  if(!copyBtn.dataset.flash)copyBtn.querySelector('span').textContent=mode==='record'?'다시 복사하고 열기':(isEmail?'본문만 복사':'DM만 복사');
  copyBtn.dataset.mode=mode==='record'?'reopen':'copy';
  copyBtn.setAttribute('aria-disabled',String(!!blocks.length&&mode!=='record'));copyBtn.title=blocks.length?blocks.map(x=>x.msg).join('\n'):'';
  copyBtn.hidden=mode==='next';
  $('alreadySent').hidden=mode!=='open'||!!blocks.find(b=>b.code==='sheet'||b.code==='sent'||b.code==='purpose');
  ['exFile','exSource','exText'].forEach(id=>$(id).setAttribute('aria-disabled',String(!!blocks.length)));
  // The empty-state download is the one green button only while nothing else can be sent.
  $('sheetDownload').classList.toggle('primary',!hasSheet()&&!!lockPrimary);
  renderAlert(flow,nm,p);
  renderReplies();renderSent();
  store.set(S,KEY.ui,ui);
}
function renderSubjects(v){
  const g=$('subjectGroup');
  if(!g.dataset.built){
    g.dataset.built='1';
    [0,1,2].forEach(i=>{
      const l=document.createElement('label');l.className='radio';l.innerHTML='<input type="radio" name="subject" value="'+i+'"><span class="txt"></span>'+(i===0?'<span class="tag">추천</span>':'');
      l.querySelector('input').onchange=()=>{staleCopy();ui.subject=i;saveDraft();render();if(i===1&&!$('v-work').value.trim())setTimeout(()=>$('v-work').focus(),0);};
      g.appendChild(l);
      if(i===1){const x=document.createElement('div');x.className='radio-extra';x.id='workRow';x.innerHTML='<label for="v-work">작품명</label><input class="field" id="v-work" data-var="작품명" autocomplete="off" aria-describedby="err-v-work"><p class="err" id="err-v-work" hidden></p>';g.appendChild(x);
        x.querySelector('input').addEventListener('input',()=>{touched.add('v-work');saveDraft();render();});}
    });
  }
  const opts=[tpl.email.subject,...C.SUBJECT_ALTERNATIVES];
  g.querySelectorAll('label.radio').forEach((l,i)=>{const t=(ui.ad?'(광고) ':'')+(C.fill(opts[i],v)||opts[i]);l.querySelector('.txt').textContent=t;l.querySelector('input').checked=ui.subject===i;});
  $('workRow').hidden=ui.subject!==1;
}
// Sheet row link per tab gid (플랫폼 수집 gid read from the live sheet 2026-11-10).
function rowHref(p){const g=p&&TAB_GID[p.source];return g?'https://docs.google.com/spreadsheets/d/'+SHEET_ID+'/edit#gid='+g+'&range=A'+p.row:'';}
/* ---------- Work link: the sheet address, editable to the exact post ---------- */
function safeUrl(s){try{const u=new URL(String(s||'').trim());return /^https?:$/.test(u.protocol)?u.href:'';}catch(e){return '';}}
let postHelpSig='';
function renderWorkLink(p,isEmail){
  const v=$('v-post').value.trim(),u=safeUrl(v),sheetUrl=(p&&p.url)||'',edited=!!(sheetUrl&&v&&safeUrl(sheetUrl)!==u);
  const a=$('postOpen');
  if(u){a.href=u;a.removeAttribute('aria-disabled');}else{a.removeAttribute('href');a.setAttribute('aria-disabled','true');}
  const msg=!p&&!v?'본 게시물 주소를 넣으면 바로 열 수 있어요.':p&&!sheetUrl&&!v?'시트에 작품 주소가 없어요. 본 게시물 주소를 넣어 주세요.':isEmail?'메일에는 안 들어가요. 본 게시물 주소로 바꿔도 돼요.':'DM에는 안 들어가요. 인상 깊었던 게시물 주소로 바꿔 두면 바로 열어 볼 수 있어요.';
  const sig=msg+'|'+edited;if(sig===postHelpSig)return;postHelpSig=sig;
  const h=$('postHelp');h.replaceChildren(msg);
  if(edited){const b=document.createElement('button');b.type='button';b.className='btn text';b.textContent='시트 주소로 되돌리기';
    b.onclick=()=>{const f=$('v-post'),q=findPerson(ui.current);f.value=(q&&q.url)||'';f.dispatchEvent(new Event('input',{bubbles:true}));f.focus();};h.append(' · ',b);}
}
function renderAlert(flow,nm,p){
  const slot=$('alertSlot');slot.replaceChildren();
  const box=(kind,ic,html,actions)=>{const d=document.createElement('div');d.className='alert '+kind;d.innerHTML='<div class="head">'+icon(ic)+'<div>'+html+'</div></div>';if(actions&&actions.length){const r=document.createElement('div');r.className='row';actions.forEach(a=>r.appendChild(a));d.appendChild(r);}slot.appendChild(d);};
  const btn=(txt,fn,cls,href)=>{const b=document.createElement(href?'a':'button');b.className='btn sm'+(cls?' '+cls:'');if(href){b.href=href;b.target='_blank';b.rel='noopener';b.innerHTML=esc(txt)+icon('ext');}else{b.textContent=txt;b.onclick=fn;}return b;};
  const rowUrl=rowHref(p);
  const rec=sentFor(idsOfCurrent(),nm);
  const sheetBlock=lastChecks.find(c=>c.code==='purpose'||c.code==='sheet');
  if(rec&&flow==='recorded'){
    const copyRow=btn('시트 줄 복사',null,'primary-ish');copyRow.onclick=()=>copyWithFeedback(copyRow,tsvRow(rec));
    box('result','check','<strong>'+esc(nm)+'님을 보냄으로 기록했어요.</strong> 메일을 보낸 뒤 시트 줄을 복사해'+(p?' 시트 '+p.row+'행':' 후보 시트')+' 상태 열 옆에 붙여 넣으면 끝나요.',[copyRow,rowUrl?btn('시트 '+p.row+'행 열기',null,'',rowUrl):null,btn('되돌리기',undo)].filter(Boolean));
  }else if(rec){
    box('block','ban',esc(nm)+'님에게는 '+esc(fmtDate(rec.at))+'에 이미 보냈어요. 답이 없으면 다시 보내지 않아요.',[btn('답장이 왔을 때',openReplies)]);
  }else if(sheetBlock){
    box('block','ban',esc(sheetBlock.msg),[btn('답장이 왔을 때',openReplies)]);
  }else if(flow==='copied'&&draft().popupBlocked&&draft().openUrl){
    box('info','send','복사는 됐는데 새 창이 막혔어요. 직접 열어 붙여 넣고 보낸 뒤 기록해 주세요.',[btn(draft().copiedChannel==='dm'?'인스타 DM 직접 열기':'Gmail 직접 열기',null,'',draft().openUrl)]);
  }else if(flow==='opened'||flow==='copied'){
    box('info','send',(flow==='opened'?(ui.channel==='dm'?'인스타 DM 창에':'Gmail 쓰기 창에')+' 붙여 넣고 보낸 뒤 기록해 주세요.':'붙여 넣고 보낸 뒤 기록해 주세요.'));
  }
}

/* ---------- Recipients column ---------- */
const srcLabel=p=>(p.source==='수집'?'수집 ':'후보 ')+p.row+'행';
function renderRecipients(){
  const has=hasSheet();
  $('dropEmpty').hidden=has;$('listArea').hidden=!has;$('progress').hidden=!has;
  ['mRedownload','mOtherFile','mPaste','mClear'].forEach(id=>$(id).hidden=!has&&id==='mClear');
  const {m,n}=progress(),left=Math.max(0,m-n);
  $('recHeading').textContent=has?'받는 분 · '+left+'명 남음':'받는 분';
  $('drawerLabel').textContent=has?'받는 분 '+left+'명 남음':'받는 분';
  $('progressText').textContent=n+'/'+m+' 보냄';
  const bar=$('progressBar');bar.setAttribute('aria-valuemax',String(m));bar.setAttribute('aria-valuenow',String(n));bar.firstElementChild.style.width=(m?Math.round(n/m*100):0)+'%';
  if(!has){['prevPerson','nextPerson'].forEach(id=>$(id).disabled=true);return;}
  const meta=$('listMeta');meta.replaceChildren();
  const when=new Date(sheet.importedAt);
  meta.append((sheet.file||'가져온 표')+' · '+(when.toDateString()===new Date().toDateString()?'오늘 ':fmtDate(sheet.importedAt)+' ')+fmtTime(sheet.importedAt));
  const issues=importIssues();
  const info=document.createElement('button');info.className='btn text';info.setAttribute('popovertarget','importInfo');info.textContent=issues.length?'확인할 행 '+issues.length+' · 자세히':'자세히';meta.appendChild(info);
  const listed=sheet.listed||listedOf(sheet.tabs);
  $('importInfo').innerHTML=Object.entries(sheet.tabs).map(([name,t])=>'<h3>'+esc(name)+' 탭'+(listed[name]?'':' · 목록에 올리지 않고 막힘만 확인해요')+'</h3><p style="margin:0 0 10px">머리글 '+t.header+'행 · '+esc(Object.values(t.columns).join(', '))+'</p>').join('')
    +(issues.length?'<h3>확인할 행</h3><ul>'+issues.slice(0,12).map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'<p style="margin:0">확인할 행이 없어요.</p>');
  const stale=Date.now()-when.getTime()>20*3600*1000&&when.toDateString()!==new Date().toDateString();
  $('listStale').hidden=!stale;
  if(stale){$('listStale').innerHTML=icon('alert')+'<span>어제 가져온 명단이에요. 그 사이 보낸 분이 있을 수 있어요.</span>';const b=document.createElement('button');b.className='btn text';b.textContent='다시 내려받기';b.onclick=downloadSheet;$('listStale').appendChild(b);}
  renderFilter();renderScope();renderList(m,left);
}
function setScope(v){ui.scope=v;store.set(S,KEY.ui,ui);renderRecipients();}
function setFilter(v){ui.filter=v;store.set(S,KEY.ui,ui);renderRecipients();}
function renderScope(){
  const el=$('scopeLine'),b=document.createElement('button');b.type='button';b.className='btn text';
  if(ui.scope==='ready'){el.replaceChildren('직접 확인·컨택 후보 O, 연락 전인 분만 보여요'+(pool.readyOut?' · 확인 전 '+pool.readyOut.toLocaleString()+'분은 빠져 있어요':''));b.textContent='모두 보기';b.onclick=()=>setScope('all');}
  else{el.replaceChildren('전체 '+pool.people.length.toLocaleString()+'분이에요. 보낼 수 없는 분은 흐리게 보여요');b.textContent='보낼 분만 보기';b.onclick=()=>setScope('ready');}
  el.append(' ',b);
}
// One select: 출처 and 분야 groups with counts in the current scope (search is not counted). Zero stays as 0.
function renderFilter(){
  const sel=$('listFilter'),base=pool.people.filter(inScope);
  const count=f=>base.reduce((a,p)=>a+(f(p)?1:0),0);
  const opts=[new Option('출처·분야 전체 '+base.length,'')];
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
  const values=[...sel.options].map(o=>o.value);
  if(!values.includes(ui.filter)){ui.filter='';store.set(S,KEY.ui,ui);}
  sel.value=ui.filter;sel.classList.toggle('on',!!ui.filter);
}
let liveSig='';
function renderList(m,left){
  const ul=$('recipientList'),t=queryTokens();
  const list=pool.people.filter(p=>inScope(p)&&inFilter(p)&&matchesQuery(p,t));
  const frag=document.createDocumentFragment();let selId='';
  list.forEach((p,i)=>{
    const st=rowStatus(p),key=keyOf(p),ch=K.channelOf(p);
    const li=document.createElement('li');li.id='opt-'+i;li.setAttribute('role','option');li.dataset.key=key;
    const on=key===ui.current;li.setAttribute('aria-selected',String(on));if(on)selId=li.id;if(st.dim)li.classList.add('dim');
    li.innerHTML='<span class="nm">'+esc(p.name)+'</span><span class="st">'+(st.ic?icon(st.ic):'')+esc(st.t)+'</span><span class="sub num"><span class="src">'+(p.source==='수집'?'수집':'후보')+'</span> · '
      +esc([p.field,p.grade?p.grade+'등급':'',ch==='email'?'메일':ch==='dm'?'인스타':'창구 없음'].filter(Boolean).join(' · '))+(p.dupOf?' · 중복':'')+'</span>';
    frag.appendChild(li);
  });
  ul.replaceChildren(frag);ul.setAttribute('aria-activedescendant',selId);
  const allDone=m>0&&left===0&&ui.scope==='ready'&&!ui.filter&&!query;
  $('allDone').hidden=!allDone;
  const fe=$('filterEmpty');fe.hidden=!!list.length||allDone;
  if(!fe.hidden){
    const wider=ui.scope==='ready'?pool.people.filter(p=>inFilter(p)&&matchesQuery(p,t)).length:0;
    const b=$('filterReset');
    if(wider){$('filterEmptyText').textContent='지금 보낼 수 있는 분 중에는 없어요. 확인 전이거나 연락한 분까지 보면 '+wider+'명 있어요.';b.textContent='모두 보기';b.onclick=()=>setScope('all');}
    else if(query&&!pool.people.some(p=>matchesQuery(p,t))){$('filterEmptyText').textContent='‘'+query.trim()+'’에 맞는 분이 없어요.';b.textContent='검색 지우기';b.onclick=()=>clearSearch(true);}
    else{$('filterEmptyText').textContent='조건에 맞는 분이 없어요.';b.textContent='거르기 풀기';b.onclick=()=>setFilter('');}
  }
  const sig=query+'|'+ui.filter+'|'+ui.scope;
  if(sig!==liveSig){if(liveSig)$('listLive').textContent=list.length+'명';liveSig=sig;}
  ['prevPerson','nextPerson'].forEach(id=>$(id).disabled=list.length<2);
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
  $('sentHeading').textContent='이 창에서 보낸 분 '+log.length;
  const ul=$('sentList');ul.replaceChildren();
  [...log].reverse().forEach(r=>{
    const li=document.createElement('li');
    li.innerHTML=icon('check')+'<span>'+esc(r.name)+'</span><span class="when num">'+(r.channel==='dm'?'인스타':'메일')+' · '+esc(fmtTime(r.at))+'</span>';
    const b=document.createElement('button');b.className='btn sm';b.textContent='빼기';b.setAttribute('aria-label',r.name+'님 빼기');
    b.onclick=async()=>{if(await ask(r.name+'님을 이 목록에서 뺄까요?','시트에 붙인 줄은 직접 지워 주세요.',[['닫기','close'],['빼기','go',true]])!=='go')return;log=log.filter(x=>x!==r);store.set(S,KEY.log,log);Object.values(drafts).forEach(d=>{if(d.recordedAt===r.at)d.flow='opened';});renderAll();};
    li.appendChild(b);ul.appendChild(li);
  });
}

/* ---------- Actions ---------- */
function gmailUrl(){const to=$('to').value.trim();return 'https://mail.google.com/mail/?view=cm&fs=1'+(to?'&to='+encodeURIComponent(to):'')+'&su='+encodeURIComponent(last.subject);}
function dmUrl(){return 'https://ig.me/m/'+encodeURIComponent(handleOf($('handle').value));}
function shakeTo(btn){
  btn.classList.remove('shake');void btn.offsetWidth;btn.classList.add('shake');
  attempted=true;checklistOpen=true;render();
  const blocks=lastChecks.filter(c=>c.level==='block');
  $('live').textContent='';setTimeout(()=>{$('live').textContent='아직 보낼 수 없어요. '+blocks.map(b=>b.msg).join(' ');},50);
  const first=lastChecks.find(c=>c.level==='block'&&c.field&&$(c.field));
  if(first)setTimeout(()=>goField(first.field),240);
}
async function copyAndOpen(btn){
  // Freeze who, what and where at the click: the person or channel may change while the clipboard write is pending.
  const snap={key:ui.current,channel:ui.channel,html:last.emailPaste,text:ui.channel==='email'?last.emailText:last.dm,url:ui.channel==='email'?gmailUrl():dmUrl()};
  const writing=snap.channel==='email'?writeRich(snap.html,snap.text):writeText(snap.text);
  const w=window.open('about:blank','_blank');
  const ok=await writing;
  const d=drafts[snap.key]||(drafts[snap.key]={vars:{},to:'',handle:'',flow:''});
  if(ok){
    let opened=false;
    if(w){try{w.opener=null;w.location.href=snap.url;opened=true;}catch(e){}}
    d.flow=opened?'opened':'copied';d.copiedChannel=snap.channel;d.popupBlocked=!opened;d.openUrl=snap.url;
    store.set(S,KEY.drafts,drafts);
    if(!opened)toast('복사는 됐는데 브라우저가 새 창을 막았어요. 아래 「직접 열기」로 열어 주세요.');
    if(snap.key===ui.current)flash(btn,'복사했어요');
    renderAll();
  }else{
    if(w)w.close();
    manualCopy(snap.text,()=>{const x=window.open(snap.url,'_blank','noopener');d.flow=x?'opened':'copied';d.copiedChannel=snap.channel;store.set(S,KEY.drafts,drafts);renderAll();return x;});
  }
}
async function copyOnly(btn){
  const snap={key:ui.current,channel:ui.channel,html:last.emailPaste,text:ui.channel==='email'?last.emailText:last.dm};
  const ok=snap.channel==='email'?await writeRich(snap.html,snap.text):await writeText(snap.text);
  const d=drafts[snap.key]||(drafts[snap.key]={vars:{},to:'',handle:'',flow:''});
  if(ok){d.flow=d.flow||'copied';d.copiedChannel=snap.channel;store.set(S,KEY.drafts,drafts);if(snap.key===ui.current)flash(btn,'복사했어요');renderAll();}
  else manualCopy(snap.text);
}
const tsvRow=r=>[r.name,r.contact,r.channel==='dm'?'인스타 DM':'메일','발송 '+new Date(r.at).toLocaleDateString('ko-KR'),r.sender||'',r.seen||'',r.post||''].join('\t');
async function record(opts){
  const nm=plainName($('v-name').value);if(!nm)return;
  const p=findPerson(ui.current)||matchesOf(idsOfCurrent(),nm)[0];
  const ch=draft().copiedChannel||ui.channel;
  const r={ids:uniq(expandIds(idsOfCurrent()).concat(p&&p.allIds||[])),name:nm,channel:ch,contact:ch==='email'?$('to').value.trim():'@'+handleOf($('handle').value),row:p?p.row:'',seen:$('v-seen').value.trim(),post:safeUrl($('v-post').value),sender:$('v-sender').value.trim(),at:new Date().toISOString()};
  log.push(r);store.set(S,KEY.log,log);
  const d=draft();d.flow='recorded';d.recordedAt=r.at;saveDraft();
  // Recording never writes the clipboard: the mail body may still be waiting to be pasted.
  renderAll();
}
function undo(){
  const d=draft();const at=d.recordedAt;log=log.filter(x=>x.at!==at);store.set(S,KEY.log,log);d.flow='opened';delete d.recordedAt;saveDraft();renderAll();
  toast('되돌렸어요. 시트에 붙인 줄은 직접 지워 주세요.');
}
async function primary(btn){
  const mode=btn.dataset.mode;
  if(mode==='open'&&btn.getAttribute('aria-disabled')==='true')return shakeTo(btn);
  if(mode==='open')return copyAndOpen(btn);
  if(mode==='record')return record();
  if(mode==='next'){const nx=nextPerson();if(nx)return choose(keyOf(nx));if(log.length)return copyAllRows(btn);}
}
function copyAllRows(btn){return copyWithFeedback(btn||$('copyLog'),['활동명\t계정·주소\t보낸 곳\t상태\t담당\t본 것 한 줄\t작품 링크'].concat(log.map(tsvRow)).join('\n'));}
function download(){
  if($('exFile').getAttribute('aria-disabled')==='true')return shakeTo($('exportBtn'));
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([last.emailHtml],{type:'text/html'}));
  a.download='직접컨택_'+(plainName($('v-name').value)||'작가').replace(/[\\/:*?"<>|\s]+/g,'')+'_'+yymmdd(new Date())+'.html';
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  $('exportMenu').hidePopover();toast('HTML 파일을 받았어요.');
}

/* ---------- Replies ---------- */
function replyValues(){
  const p=findPerson(ui.current)||matchesOf(idsOfCurrent(),plainName($('v-name').value))[0];
  return {'활동명':plainName($('v-name').value)||'작가','담당자명':$('v-sender').value.trim()||'담당자','날짜':new Date().toLocaleDateString('ko-KR',{month:'long',day:'numeric'}),'출처':safeUrl($('v-post').value)||(p&&p.url)||($('v-platform').value.trim()?$('v-platform').value.trim()+' 프로필':'공개 프로필')};
}
function renderReplies(){if($('replyPanel').hidden)return;$('replyOptout').textContent=C.reply('optout',replyValues());$('replySource').textContent=C.reply('source',replyValues());}
function openReplies(){$('replyPanel').hidden=false;$('previewArea').hidden=true;openPreviewSheet();renderReplies();$('replyClose').focus();}
function closeReplies(){$('replyPanel').hidden=true;$('previewArea').hidden=false;$('replyOpen').focus();}

/* ---------- Drawer and sheets ---------- */
const narrow=()=>matchMedia('(max-width:1359px)').matches;
function openDrawer(){$('recipients').classList.add('open');$('scrim').classList.add('on');($('recipientList').querySelector('[aria-selected="true"]')||$('recipients').querySelector('button')).focus?.();}
function closeDrawer(){if(!$('recipients').classList.contains('open'))return;$('recipients').classList.remove('open');$('scrim').classList.remove('on');if(narrow())$('drawerToggle').focus();}
function openPreviewSheet(){if(matchMedia('(max-width:1023px)').matches){$('previewCol').classList.add('open');$('previewClose').focus();}}
function closeSheets(){$('previewCol').classList.remove('open');closeDrawer();}

/* ---------- Import ---------- */
const sheetError=(msg)=>{const e=$('importError');e.hidden=!msg;e.innerHTML=msg?icon('x')+'<span>'+esc(msg)+'</span>':'';if(msg&&hasSheet())toast(msg);};
/* found: [{name, data, source}] where source is '후보'|'수집'|'' (index only). Tabs add to what is already here. */
function addTabs(found,file){
  const old=hasSheet()?sheet:{tabs:{},listed:{}};
  sheet={tabs:{...old.tabs},listed:{...(old.listed||listedOf(old.tabs))},file,importedAt:new Date().toISOString()};
  found.forEach(f=>{sheet.tabs[f.name]=f.data;if(f.source)sheet.listed[f.name]=f.source;else delete sheet.listed[f.name];});
  store.set(S,KEY.people,sheet);sheetError('');
  rebuild();
  const nH=pool.people.filter(p=>p.source==='후보').length,nS=pool.people.filter(p=>p.source==='수집').length;
  const pending=log.filter(r=>matchesOf(r.ids||[],r.name).some(p=>K.uncontacted(p)));
  toast('명단을 가져왔어요 · 후보 '+nH+'명'+(nS?' · 수집 '+nS+'명':'')+(pending.length?' · 이 창에서 보낸 '+pending.length+'명이 시트에 아직 미연락이에요':''));
  const first=pool.people.find(p=>sendable(p)&&!isSent(p));
  if(first)choose(keyOf(first),{force:true});else renderAll();
}
// CSV and paste carry one tab: its name says 후보·수집, or a 연락 목적 column means 수집.
const oneTab=(name,data)=>({name,data,source:K.sourceOf(name)||(data.columns.purpose?'수집':'후보')});
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
  if(on){n.classList.remove('bad');n.textContent='명단을 읽는 중이에요';n.hidden=false;$('recipients').setAttribute('aria-busy','true');}
  else{n.hidden=true;$('recipients').removeAttribute('aria-busy');}
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
  toast('시트를 내려받고 있어요. 받은 파일을 여기에 끌어 놓아 주세요.');
}

/* ---------- Wording fields (this mail only) ---------- */
const TPL_LABELS={'email.subject':'메일 제목','email.preheader':'숨은 미리보기 문장','email.headline':'큰 제목','email.greeting':'인사','email.intro':'소개','email.gift':'감사 선물','email.steps':'참여 방법','email.ask':'궁금한 점','email.closing':'맺음','email.signature':'서명','email.footer':'맨 아래 고지','dm.message':'DM 본문'};
function fillTplFields(){
  const box=$('tplFields');
  if(!box.dataset.built){
    box.dataset.built='1';
    Object.entries(TPL_LABELS).forEach(([k,label])=>{
      const id='t-'+k.replace('.','-');const multi=!/subject|preheader/.test(k);
      const w=document.createElement('div');w.className='tpl-field';w.style.marginTop='12px';
      w.innerHTML='<label for="'+id+'">'+esc(label)+'<span class="changed" hidden>고침</span></label>'+(multi?'<textarea class="field" rows="'+(k==='dm.message'?12:3)+'" id="'+id+'" data-tpl="'+k+'"></textarea>':'<input class="field" id="'+id+'" data-tpl="'+k+'">');
      box.appendChild(w);
      const i=w.querySelector('[data-tpl]');
      i.addEventListener('input',()=>{const [c,kk]=k.split('.');tpl[c][kk]=i.value;saveTpl();render();});
      i.addEventListener('focus',()=>{const kk=k.split('.')[1];if(k.startsWith('email.')){outline=kk;render();}});
      i.addEventListener('blur',()=>{if(outline){outline='';render();}});
    });
  }
  box.querySelectorAll('[data-tpl]').forEach(i=>{const [c,k]=i.dataset.tpl.split('.');i.value=tpl[c][k];});
}

/* ---------- Iframe sizing and logo ---------- */
function fitFrame(){
  const f=$('frame');try{const d=f.contentDocument;if(!d||!d.documentElement)return;f.style.height=Math.max(400,d.documentElement.scrollHeight)+'px';}catch(e){}
}
$('frame').addEventListener('load',()=>{
  fitFrame();
  try{const d=$('frame').contentDocument;new ResizeObserver(fitFrame).observe(d.body);d.querySelectorAll('a').forEach(a=>{a.target='_blank';a.rel='noopener';});}catch(e){}
});
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
  menu.addEventListener('toggle',e=>{if(e.newState==='open'){const f=menu.querySelector('[role="menuitem"]:not([hidden])');f&&f.focus();}});
  menu.addEventListener('keydown',e=>{
    const items=[...menu.querySelectorAll('[role="menuitem"]:not([hidden])')];const i=items.indexOf(document.activeElement);
    if(e.key==='ArrowDown'){e.preventDefault();items[(i+1)%items.length].focus();}
    if(e.key==='ArrowUp'){e.preventDefault();items[(i-1+items.length)%items.length].focus();}
  });
}
function autoGrow(){const t=$('v-seen');t.style.height='auto';t.style.height=Math.max(96,t.scrollHeight+2)+'px';}

/* ---------- Events ---------- */
function staleCopy(){
  // What sits in the clipboard no longer matches the screen once the text changes.
  const d=draft();if(d.flow==='copied'||d.flow==='opened'){d.flow='';delete d.copiedChannel;store.set(S,KEY.drafts,drafts);toast('글이 바뀌어서 다시 복사해야 해요.');}
}
document.addEventListener('input',e=>{
  const el=e.target;
  if(el.id==='listSearch')return;   // search never touches drafts, the preview or the copied state
  if(el.dataset&&(el.dataset.var!=null||el.dataset.tpl!=null)&&el.id!=='v-sender'||['to','handle','adPhone','v-sender'].includes(el.id))staleCopy();
  if(el.dataset&&el.dataset.var!=null||['to','handle','adPhone'].includes(el.id)){touched.add(el.id);if(el.id==='v-seen')autoGrow();saveDraft();render();if(el.id==='v-seen')refreshRowStatus();}
});
$('to').addEventListener('blur',()=>{$('to').value=$('to').value.trim();touched.add('to');render();});
$('handle').addEventListener('change',()=>{$('handle').value=handleOf($('handle').value);saveDraft();render();});
$('v-seen').addEventListener('paste',e=>{const t=e.clipboardData&&e.clipboardData.getData('text/plain');if(t==null)return;e.preventDefault();document.execCommand('insertText',false,C.clean(t));});
$('v-seen').addEventListener('focus',()=>{focusSeen=true;render();});
// Never rebuild the list on blur: blur fires on mousedown of a row, and a rebuilt row swallows that click.
$('v-seen').addEventListener('blur',()=>{focusSeen=false;touched.add('v-seen');render();refreshRowStatus();});
$('chEmail').onclick=()=>setChannel('email');$('chDm').onclick=()=>setChannel('dm');
radioKeys('channelSeg',['chEmail','chDm'],id=>setChannel(id==='chDm'?'dm':'email'));
$('wDesk').onclick=()=>{ui.width='desk';render();};$('wMobile').onclick=()=>{ui.width='mobile';render();};
radioKeys('wDesk'.length&&$('wDesk').parentElement.id||'channelSeg',['wDesk','wMobile'],id=>{ui.width=id==='wDesk'?'desk':'mobile';render();});
$('markOn').onclick=()=>{ui.mark=!ui.mark;render();};
$('adOn').onclick=()=>{staleCopy();ui.ad=!ui.ad;saveDraft();render();if(ui.ad&&!$('adPhone').value.trim())$('adPhone').focus();};
$('footerOn').onclick=()=>{if(ui.ad)return;staleCopy();ui.footer=!ui.footer;saveDraft();render();};
$('allDoneReset').onclick=()=>setScope('all');
$('listFilter').addEventListener('change',e=>setFilter(e.target.value));
function clearSearch(focus){const f=$('listSearch');f.value='';query='';$('listSearchClear').hidden=true;renderRecipients();if(focus)f.focus();}
$('listSearch').addEventListener('input',()=>{query=$('listSearch').value;$('listSearchClear').hidden=!query;renderRecipients();});
$('listSearch').addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  if(e.isComposing||e.keyCode===229){e.stopPropagation();return;}   // Esc that ends Korean composition is not a command
  if(!$('listSearch').value)return;   // empty: the global Esc closes the drawer as before
  e.preventDefault();e.stopPropagation();clearSearch(false);
});
$('listSearchClear').onclick=()=>clearSearch(true);
$('recipientList').addEventListener('click',e=>{const li=e.target.closest('li[data-key]');if(li)choose(li.dataset.key);});
$('postOpen').addEventListener('click',e=>{if($('postOpen').getAttribute('aria-disabled')==='true'){e.preventDefault();goField('v-post');}});
$('v-post').addEventListener('blur',()=>{const f=$('v-post'),v=f.value.trim();if(v&&!/^[a-z][a-z0-9+.-]*:/i.test(v)&&/^[\w-]+(\.[\w-]+)+\//i.test(v)){f.value='https://'+v;f.dispatchEvent(new Event('input',{bubbles:true}));}});
$('prevPerson').onclick=()=>step(-1);$('nextPerson').onclick=()=>step(1);
$('recipientList').addEventListener('keydown',e=>{
  const items=[...$('recipientList').children];if(!items.length)return;
  let i=items.findIndex(li=>li.id===$('recipientList').getAttribute('aria-activedescendant'));
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();i=e.key==='ArrowDown'?Math.min(items.length-1,i+1):Math.max(0,i-1);items.forEach(li=>li.classList.remove('active'));$('recipientList').setAttribute('aria-activedescendant',items[i].id);items[i].scrollIntoView({block:'nearest'});items.forEach((li,j)=>li.classList.toggle('active',j===i));}
  if(e.key==='Enter'&&i>=0){e.preventDefault();choose(items[i].dataset.key);}
});
$('primary').onclick=()=>primary($('primary'));$('primaryM').onclick=()=>primary($('primaryM'));
$('copyBody').onclick=()=>{const b=$('copyBody');if(b.dataset.mode==='reopen')return copyAndOpen(b);if(b.getAttribute('aria-disabled')==='true')return shakeTo(b);copyOnly(b);};
$('alreadySent').onclick=async()=>{if(await ask(plainName($('v-name').value)+'님에게 이미 보냈나요?','이 창 목록에 올리고 시트에 붙일 줄을 복사해요.',[['닫기','close'],['보냈어요 · 기록하기','go',true]])==='go')record();};
$('copySubject').onclick=()=>copyWithFeedback($('copySubject'),last.subject);
$('copyTo').onclick=()=>{const t=$('to').value.trim();if(!t)return goField('to');copyWithFeedback($('copyTo'),t);};
$('openLinks').onclick=()=>{window.open(C.LINKS.hub,'_blank','noopener');};
$('checkSummary').onclick=$('checkSummaryM').onclick=()=>{if(!lastChecks.length)return;checklistOpen=$('checklist').hidden;render();if(matchMedia('(max-width:1023px)').matches)openPreviewSheet();};
$('checkCollapse').onclick=()=>{checklistOpen=false;render();$('checkSummary').focus();};
$('exFile').onclick=download;
$('exSource').onclick=async()=>{if($('exSource').getAttribute('aria-disabled')==='true')return;$('exportMenu').hidePopover();const ok=await writeText(last.emailHtml);ok?toast('HTML 소스를 복사했어요.'):manualCopy(last.emailHtml);};
$('exText').onclick=async()=>{if($('exText').getAttribute('aria-disabled')==='true')return;$('exportMenu').hidePopover();const ok=await writeText(last.emailText);ok?toast('양식 없이 글만 복사했어요.'):manualCopy(last.emailText);};
$('copyLog').onclick=()=>copyAllRows($('copyLog'));
$('clearLog').onclick=async()=>{if(await ask('보낸 분 '+log.length+'명 목록을 비울까요?','시트에 옮기지 않은 줄은 사라져요.',[['닫기','close'],['비우기','go',true,true]])!=='go')return;log=[];store.del(S,KEY.log);Object.values(drafts).forEach(d=>{if(d.flow==='recorded')d.flow='';delete d.recordedAt;});store.set(S,KEY.drafts,drafts);renderAll();};
$('replyOpen').onclick=()=>$('replyPanel').hidden?openReplies():closeReplies();
$('replyClose').onclick=closeReplies;
$('copyOptout').onclick=()=>copyWithFeedback($('copyOptout'),C.reply('optout',replyValues()));
$('copySource').onclick=()=>copyWithFeedback($('copySource'),C.reply('source',replyValues()));
$('copyOptoutRow').onclick=()=>{const v=replyValues(),c=$('to').value.trim()||('@'+handleOf($('handle').value));copyWithFeedback($('copyOptoutRow'),[v['활동명'],c,ui.channel==='dm'?'인스타 DM':'메일','수신거부 '+new Date().toLocaleDateString('ko-KR'),$('v-sender').value.trim()].join('\t'));};
$('tplReset').onclick=async()=>{if(await ask('확정 문안으로 되돌릴까요?','이번 메일에서 고친 문구가 지워져요.',[['닫기','close'],['되돌리기','go',true]])!=='go')return;store.del(S,KEY.tpl);tpl=mergeTpl(null);fillTplFields();render();};
$('manualClose').onclick=()=>$('manual').close();
$('manualOpen').onclick=()=>{$('manual').close();if(manualThen)manualThen();};
$('sheetDownload').onclick=downloadSheet;$('mRedownload').onclick=()=>{$('listMenu').hidePopover();downloadSheet();};
$('mOtherFile').onclick=()=>{$('listMenu').hidePopover();$('sheetFile').click();};
$('mPaste').onclick=()=>{$('listMenu').hidePopover();if(hasSheet()){sheet=null;rebuild();}$('dropEmpty').hidden=false;$('listArea').hidden=true;$('pasteBox').open=true;$('sheetPaste').focus();};
$('mClear').onclick=async()=>{$('listMenu').hidePopover();if(await ask('가져온 명단을 지울까요?','원본 시트와 보낸 분 목록은 그대로예요.',[['닫기','close'],['지우기','go',true,true]])!=='go')return;sheet=null;store.del(S,KEY.people);rebuild();ui.current='manual';renderAll();};
$('sheetFile').onchange=async()=>{const f=$('sheetFile').files[0];$('sheetFile').value='';await importFile(f);};
$('importPaste').onclick=()=>{try{addTabs([oneTab('붙여 넣은 표',K.convert(K.parseDelimited($('sheetPaste').value)))],'붙여 넣은 표');$('sheetPaste').value='';}catch(e){sheetError(e.message);}};
$('drawerToggle').onclick=openDrawer;$('scrim').onclick=closeSheets;
$('previewOpen').onclick=()=>{$('previewCol').classList.add('open');$('previewClose').focus();};
$('previewClose').onclick=()=>{$('previewCol').classList.remove('open');$('previewOpen').focus();};
document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(!$('replyPanel').hidden){closeReplies();return;}if($('previewCol').classList.contains('open')){$('previewCol').classList.remove('open');return;}closeDrawer();});
menuKeys($('listMenu'));menuKeys($('exportMenu'));
// Drag and drop: the whole recipients column receives files.
const rec=$('recipients');let dragDepth=0;
rec.addEventListener('dragenter',e=>{if(![...e.dataTransfer.types].includes('Files'))return;e.preventDefault();dragDepth++;rec.classList.add('dragging');const item=e.dataTransfer.items&&e.dataTransfer.items[0];const bad=item&&item.type&&!/csv|tab-separated|spreadsheetml|vnd\.ms-excel/.test(item.type);$('dragNote').hidden=false;$('dragNote').classList.toggle('bad',!!bad);$('dragNote').textContent=bad?'CSV나 XLSX만 가져올 수 있어요':(hasSheet()?'놓으면 명단에 더해요':'놓으면 명단을 가져와요');});
rec.addEventListener('dragover',e=>{if([...e.dataTransfer.types].includes('Files'))e.preventDefault();});
rec.addEventListener('dragleave',()=>{if(--dragDepth<=0){dragDepth=0;rec.classList.remove('dragging');$('dragNote').hidden=true;}});
rec.addEventListener('drop',e=>{if(!e.dataTransfer.files.length)return;e.preventDefault();dragDepth=0;rec.classList.remove('dragging');$('dragNote').hidden=true;importFile(e.dataTransfer.files[0]);});
// Leaving with an opened-but-unrecorded mail asks first.
window.addEventListener('beforeunload',e=>{if(Object.values(drafts).some(d=>d.flow==='opened')){e.preventDefault();e.returnValue='';}});
// The night window can start while the tab is open.
setInterval(render,60000);

/* ---------- Start ---------- */
if(hasSheet()&&!sheet.listed)sheet.listed=listedOf(sheet.tabs);   // lists saved before the merge
rebuild();
fillTplFields();
renderSubjects(values()); // builds the 작품명 field before drafts are loaded into it
loadDraftInto(ui.current,findPerson(ui.current));
$('v-sender').value=store.get(L,KEY.sender,'')||'';$('adPhone').value=store.get(L,KEY.phone,'')||'';
if(!$('v-sender').value.trim())$('settingsFold').open=true;
if(editedKeys().length)$('editFold').open=true;
renderAll();autoGrow();
