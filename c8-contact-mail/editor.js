/* Wiring only. The candidate sheet's status column is the send record of truth; everything here lives in sessionStorage and ends with the window. Only the sender name and company phone are remembered. */
const SHEET_ID='1BBRYmwNxBEnUpDuLTSg6KLmVgzaxVpdfjT-aU92ZTo4';
const CANDIDATE_GID='862905173';
const KEY={people:'c8-contact-people-v1',draft:'c8-contact-draft-v1',tpl:'c8-contact-tpl-once-v2',sender:'c8-contact-sender-v1',phone:'c8-contact-phone-v1',log:'c8-contact-sent-v1'};
const $=id=>document.getElementById(id);
const C=ContactMail,K=Candidates;
const store={
  get(area,k,fallback){try{const v=area.getItem(k);return v==null?fallback:JSON.parse(v);}catch(e){return fallback;}},
  set(area,k,v){try{area.setItem(k,JSON.stringify(v));return true;}catch(e){return false;}},
  del(area,k){try{area.removeItem(k);}catch(e){}}
};
const S=window.sessionStorage,L=window.localStorage;
// Earlier builds kept a send log and edited wording in localStorage; the sheet is the record now.
['c8-contact-log-v1','c8-contact-tpl-v1'].forEach(k=>store.del(L,k));
let channel='email',sheet=store.get(S,KEY.people,null),log=store.get(S,KEY.log,[]),last=null;
if(!Array.isArray(log))log=[];
let tpl=mergeTpl(store.get(S,KEY.tpl,null));

function mergeTpl(saved){
  const t=JSON.parse(JSON.stringify(C.DEFAULTS));
  if(saved&&typeof saved==='object')['email','dm'].forEach(c=>{if(saved[c])Object.keys(t[c]).forEach(k=>{if(typeof saved[c][k]==='string')t[c][k]=saved[c][k];});});
  return t;
}
const varInputs=[...document.querySelectorAll('[data-var]')];
const tplInputs=[...document.querySelectorAll('[data-tpl]')];
const values=()=>{const v={};varInputs.forEach(i=>v[i.dataset.var]=i.value);return v;};
const subjectTemplate=()=>{const i=Number($('subjectPick').value||0);return i===0?tpl.email.subject:C.SUBJECT_ALTERNATIVES[i-1];};
const activeTpl=()=>({email:{...tpl.email,subject:subjectTemplate()},dm:tpl.dm});
const renderOpts=()=>({footer:$('footerOn').checked,ad:{on:$('adOn').checked,phone:$('adPhone').value}});
const handleOf=s=>String(s||'').trim().replace(/^@/,'').replace(/^https?:\/\/(www\.)?instagram\.com\//i,'').replace(/[/?#].*$/,'');
const plainName=s=>String(s||'').trim().replace(/\s*님$/,'');
const fmtDate=iso=>{const d=new Date(iso);return isNaN(d)?'':d.toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'short'});};
function currentIds(){
  const ids=[];const m=$('to').value.trim().toLowerCase(),h=handleOf($('handle').value).toLowerCase();
  if(m)ids.push('m:'+m);if(h)ids.push('i:'+h);return ids;
}
function sameIds(a,b){return a.some(x=>b.includes(x));}
function sentRecord(ids,name){return log.find(r=>(ids.length&&sameIds(r.ids||[],ids))||(!ids.length&&r.name===name));}
const currentPeople=()=>{const t=sheet&&sheet.tabs&&sheet.tabs[$('sheetTab').value];return t?t.people:[];};
const everyone=()=>sheet&&sheet.tabs?Object.entries(sheet.tabs).flatMap(([tab,t])=>t.people.map(p=>({...p,tab}))):[];
/* Everyone on any imported tab who is this person: same email or handle, or the same name when no identifier is typed yet. */
function matchesOf(ids,name){return everyone().filter(p=>ids.length?sameIds(K.ids(p),ids):(name&&plainName(p.name)===name));}
function sheetMatches(){return matchesOf(currentIds(),plainName($('v-name').value));}
/* A person is blocked when any row on any tab that shares their address or handle is blocked. */
function blockedAnywhere(p){const hit=matchesOf(K.ids(p),plainName(p.name)).find(q=>K.blockedWhy(q));return hit?(hit.tab!==$('sheetTab').value?hit.tab+' 탭 ':'')+hit.row+'행 '+K.blockedWhy(hit):'';}
function seenHistory(){
  return currentPeople().filter(p=>p.seen).map(p=>({name:plainName(p.name),seen:p.seen})).concat(log.map(r=>({name:r.name,seen:r.seen})));
}

let tt;function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2400);}
function copyText(s,msg){
  // No await before the write: Safari only allows clipboard writes inside the click.
  const fail=()=>{if(fallbackCopy(s))toast(msg);else manualCopy(s);};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(s).then(()=>toast(msg),fail);return;}
  fail();
}
function fallbackCopy(s){
  const ta=document.createElement('textarea');ta.value=s;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();
  let ok=false;try{ok=document.execCommand('copy');}catch(e){}
  ta.remove();return ok;
}
/* Never claim a copy that did not happen: an old clipboard would paste the previous person's message. */
function manualCopy(s){
  const d=$('manual');$('manualText').value=s;d.showModal();$('manualText').select();
  toast('자동 복사가 막혔어요. 선택된 글을 ⌘C로 복사해 주세요.');
}
/* Gmail keeps bold and link text when the clipboard carries text/html; text/plain is the fallback for plain editors. */
function copyRich(r){
  const html=r.emailHtml.slice(r.emailHtml.indexOf('<div'),r.emailHtml.lastIndexOf('</div>')+6);
  const msg='본문을 복사했어요. Gmail 쓰기 창 본문에 붙여 넣으세요.';
  const fallback=()=>{
    const d=$('frame').contentDocument,range=d.createRange();range.selectNodeContents(d.body);const sel=d.getSelection();sel.removeAllRanges();sel.addRange(range);
    let ok=false;try{ok=d.execCommand('copy');}catch(e){}
    sel.removeAllRanges();
    if(ok)toast(msg);else manualCopy(r.emailText);
  };
  try{
    navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([html],{type:'text/html'}),'text/plain':new Blob([r.emailText],{type:'text/plain'})})]).then(()=>toast(msg),fallback);
  }catch(e){fallback();}
}
function setChannel(c,save=true){
  channel=c==='dm'?'dm':'email';
  $('chEmail').setAttribute('aria-selected',String(channel==='email'));
  $('chDm').setAttribute('aria-selected',String(channel==='dm'));
  document.querySelectorAll('[data-only]').forEach(el=>el.hidden=el.dataset.only!==channel);
  if(save)saveDraft();
  render();
}
function fillSubjects(){
  const v=values(),keep=$('subjectPick').value||'0';
  $('subjectPick').replaceChildren(...[tpl.email.subject,...C.SUBJECT_ALTERNATIVES].map((t,i)=>{
    const o=new Option(($('adOn').checked?C.AD.subjectPrefix:'')+(C.fill(t,v)||t),String(i));
    if(C.tokens(t).includes('작품명')&&!v['작품명'].trim()){o.disabled=true;o.text+=' (작품명을 쓰면 고를 수 있어요)';}
    return o;
  }));
  $('subjectPick').value=$('subjectPick').querySelector('option[value="'+keep+'"]:not([disabled])')?keep:'0';
}
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const markText=s=>esc(s).replace(/\u0001/g,'<mark>').replace(/\u0002/g,'</mark>');

function render(){
  fillSubjects();
  const v=values(),opts=renderOpts(),t=activeTpl();
  const r=C.render(t,v,opts);last=r;
  const shown=$('markOn').checked?C.render(t,v,{...opts,mark:true}):r;
  const ids=currentIds(),rec=sentRecord(ids,plainName(v['활동명']));
  const checks=C.check(t,v,{...opts,channel,to:$('to').value,now:new Date(),history:seenHistory(),sentBefore:rec?fmtDate(rec.at):''});
  // The sheet decides who was already contacted, across every row that shares the address or handle.
  sheetMatches().forEach(p=>{const why=K.blockedWhy(p);if(why&&!rec)checks.unshift({level:'block',code:'sheet',msg:(p.tab!==$('sheetTab').value?p.tab+' 탭 ':'')+p.row+'행 '+plainName(p.name)+'님 — '+why+'. 이 분에게는 보내지 않아요.',field:''});});
  if(channel==='dm'&&!handleOf($('handle').value))checks.push({level:'warn',code:'handle',msg:'인스타 계정이 비어 있어 「인스타 DM 열기」를 쓸 수 없어요.',field:'handle'});
  if(channel==='email'&&!$('to').value.trim())checks.push({level:'warn',code:'to-empty',msg:'받는 메일 주소가 비어 있어요.',field:'to'});
  const ul=$('checks');ul.replaceChildren();
  document.querySelectorAll('.invalid').forEach(el=>el.classList.remove('invalid'));
  const blocks=checks.filter(c=>c.level==='block');
  checks.forEach(c=>{
    const li=document.createElement('li');li.className=c.level+'-l';li.textContent=c.msg;
    if(c.level==='block')li.setAttribute('role','alert');
    if(c.field&&$(c.field)){li.dataset.field=c.field;li.tabIndex=0;if(c.level==='block')$(c.field).classList.add('invalid');}
    ul.appendChild(li);
  });
  if(!checks.length){const li=document.createElement('li');li.className='ok-l';li.textContent='걸리는 게 없어요. 링크 3개 모두 https예요. 복사해서 보내면 돼요.';ul.appendChild(li);}
  const why=blocks.map(b=>b.msg).join('\n');
  ['copyBody','copyDm','markSent'].forEach(id=>{$(id).disabled=!!blocks.length;$(id).title=why;});
  $('openGmail').setAttribute('aria-disabled',String(!!blocks.length));
  $('openDm').setAttribute('aria-disabled',String(!!blocks.length||!handleOf($('handle').value)));
  // Email preview
  $('frame').srcdoc=shown.emailHtml;
  $('ibFrom').textContent=(v['담당자명'].trim()||'담당자')+' (크리에이터클럽)';
  $('ibSubj').innerHTML=markText(shown.subjectMarked);
  $('ibSnip').textContent=r.emailText.replace(/\s+/g,' ').slice(0,90);
  $('ibTo').textContent='받는 사람: '+($('to').value.trim()||'(비어 있음)');
  const to=$('to').value.trim();
  $('openGmail').href='https://mail.google.com/mail/?view=cm&fs=1'+(to?'&to='+encodeURIComponent(to):'')+'&su='+encodeURIComponent(r.subject);
  // DM preview
  const h=handleOf($('handle').value);
  $('dmWho').textContent=h?'@'+h+'에게 보내는 메시지 요청':'인스타 계정을 넣으면 받는 사람이 보여요';
  $('dmText').innerHTML=markText(shown.dmMarked);
  const n=C.chars(r.dm);$('dmMeta').textContent=n.toLocaleString()+'자 · 팔로하지 않는 분에게는 수락 전 한 통·글만 가요';$('dmMeta').classList.toggle('over',n>C.LIMITS.dmChars);
  $('openDm').href=h?'https://ig.me/m/'+encodeURIComponent(h):'#';
  $('seenCount').textContent=C.chars(v['본 것 한 줄'].trim())+' / '+C.LIMITS.seenMax+'자';
  renderReplies();renderLog();
}

/* ---------- Draft ---------- */
function saveDraft(){
  const d={channel,to:$('to').value,handle:$('handle').value,subject:$('subjectPick').value,footer:$('footerOn').checked,ad:$('adOn').checked,mark:$('markOn').checked,vars:values(),person:$('person').value,tab:$('sheetTab').value};
  delete d.vars['담당자명'];
  store.set(S,KEY.draft,d);
  store.set(L,KEY.sender,$('v-sender').value);
  store.set(L,KEY.phone,$('adPhone').value);
}
function loadDraft(){
  const d=store.get(S,KEY.draft,null)||{};
  varInputs.forEach(i=>{i.value=(d.vars&&typeof d.vars[i.dataset.var]==='string')?d.vars[i.dataset.var]:'';});
  $('v-sender').value=store.get(L,KEY.sender,'')||'';
  $('adPhone').value=store.get(L,KEY.phone,'')||'';
  $('to').value=d.to||'';$('handle').value=d.handle||'';
  $('footerOn').checked=d.footer!==false;$('adOn').checked=!!d.ad;$('markOn').checked=!!d.mark;
  syncAd();
  tplInputs.forEach(i=>{const [c,k]=i.dataset.tpl.split('.');i.value=tpl[c][k];});
  fillSubjects();if(d.subject)$('subjectPick').value=d.subject;
  channel=d.channel==='dm'?'dm':'email';
  return d;
}
function syncAd(){
  const on=$('adOn').checked;$('adBox').hidden=!on;
  // Labelling must not be switched off by hand while ad mode is on.
  $('footerOn').disabled=on;if(on)$('footerOn').checked=true;
}
function resetWording(){if(!store.get(S,KEY.tpl,null))return false;store.del(S,KEY.tpl);tpl=mergeTpl(null);tplInputs.forEach(i=>{const [c,k]=i.dataset.tpl.split('.');i.value=tpl[c][k];});return true;}

/* ---------- Candidate import ---------- */
const sheetMessage=(s,error)=>{$('sheetStatus').textContent=s;$('sheetStatus').style.color=error?'var(--block)':'';};
function visible(){
  const all=currentPeople();
  return all.map((p,i)=>({p,i})).filter(({p})=>(!$('onlyReady').checked||K.ready(p))&&(!$('hideSent').checked||(!blockedAnywhere(p)&&!sentRecord(K.ids(p),plainName(p.name)))));
}
function fillPeople(keep){
  const tabs=sheet&&sheet.tabs?Object.keys(sheet.tabs):[];
  $('tabRow').hidden=tabs.length<2;
  if(tabs.length){const k=$('sheetTab').value;$('sheetTab').replaceChildren(...tabs.map(t=>new Option(t+' · '+sheet.tabs[t].people.length+'명',t)));$('sheetTab').value=tabs.includes(k)?k:(sheet.tab&&tabs.includes(sheet.tab)?sheet.tab:tabs[0]);}
  const all=currentPeople(),list=visible();
  const sel=$('person');sel.replaceChildren();
  ['prevPerson','nextPerson'].forEach(id=>$(id).disabled=list.length<2);
  if(!all.length){sel.add(new Option('명단을 먼저 가져와 주세요',''));sel.disabled=true;$('personCount').textContent='';return;}
  sel.disabled=false;
  sel.add(new Option(list.length?'— 보낼 분을 골라 주세요 —':'조건에 맞는 분이 없어요',''));
  list.forEach(({p,i})=>{
    const ch=K.channelOf(p),rec=sentRecord(K.ids(p),plainName(p.name)),why=blockedAnywhere(p);
    sel.add(new Option(p.row+'행 · '+p.name+' · '+(p.grade||'등급 없음')+' · '+(ch==='email'?'메일':ch==='dm'?'인스타':'창구 없음')+(rec?' · 이 창에서 보냄':why?' · '+why:'')+(p.dupOf?' · 중복 '+p.dupOf.join('·')+'행':''),String(i)));
  });
  if(keep&&list.some(x=>String(x.i)===keep))sel.value=keep;
  const ready=all.filter(K.ready).length,open=all.filter(p=>K.ready(p)&&!blockedAnywhere(p)).length;
  $('personCount').textContent=list.length+'명 보임 · 전체 '+all.length+'명 · 둘 다 O '+ready+'명 · 그중 보낼 수 있는 분 '+open+'명';
  const t=sheet.tabs[$('sheetTab').value];
  if(t&&(t.columns.checked==null||t.columns.pick==null))sheetMessage('이 탭에는 「직접 확인」 또는 「직접 컨택 후보」 열이 없어 「둘 다 O」 거르기를 쓸 수 없어요. 거르기를 끄면 모두 보여요.',true);
}
function addTabs(found,label){
  sheet={tabs:{...(sheet&&sheet.tabs?sheet.tabs:{})},tab:'',importedAt:new Date().toISOString()};
  found.forEach(f=>{sheet.tabs[f.name]=f.data;});
  sheet.tab=(found.find(f=>/후보/.test(f.name))||found[0]).name;
  const saved=store.set(S,KEY.people,sheet);
  fillPeople();$('sheetTab').value=sheet.tab;fillPeople();
  const t=sheet.tabs[sheet.tab];
  const issues=[];
  t.people.forEach(p=>{if(p.email&&!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(p.email))issues.push(p.row+'행 메일 형식');if(p.dupOf)issues.push(p.row+'행 같은 메일·계정이 '+p.dupOf.join('·')+'행에도 있음');if(K.ready(p)&&!p.url)issues.push(p.row+'행 작품 주소(출처) 비어 있음');});
  sheetMessage(label+' — '+found.map(f=>f.name+' '+f.data.people.length+'명').join(' · ')+'\n머리글 '+t.header+'행에서 찾은 열: '+Object.values(t.columns).join(', ')+(issues.length?'\n확인할 행: '+[...new Set(issues)].slice(0,8).join(' · ')+(issues.length>8?' 외 '+(issues.length-8)+'건':''):'')+(saved?'':'\n브라우저 저장 공간이 부족해 새로 열면 다시 가져와야 해요.'));
  toast('명단을 가져왔어요.');
}
const importRows=(rows,name,label)=>addTabs([{name,data:K.convert(rows)}],label);
let xlsxLib;
function loadXlsx(){
  return xlsxLib||(xlsxLib=new Promise((ok,fail)=>{
    if(window.XLSX)return ok(window.XLSX);
    const s=document.createElement('script');s.src='xlsx.mini.min.js';
    s.onload=()=>window.XLSX?ok(window.XLSX):fail(Error('파일 읽기 도구를 불러오지 못했어요.'));
    s.onerror=()=>{xlsxLib=null;fail(Error('파일 읽기 도구를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.'));};
    document.head.appendChild(s);
  }));
}
async function importFile(f){
  if(!f)return;
  try{
    if(/\.xlsx$/i.test(f.name)){
      if(f.size>8000000)throw Error('xlsx 파일은 8MB까지 가져올 수 있어요. 후보 탭만 CSV로 내려받아 주세요.');
      const X=await loadXlsx(),wb=X.read(new Uint8Array(await f.arrayBuffer()),{type:'array'});
      const found=[];let skipped=0;
      wb.SheetNames.forEach(name=>{try{found.push({name,data:K.convert(X.utils.sheet_to_json(wb.Sheets[name],{header:1,raw:false,defval:'',blankrows:true}))});}catch(e){skipped++;}});
      if(!found.length)throw Error('후보 명단 머리글이 있는 탭을 찾지 못했어요.');
      addTabs(found,f.name+(skipped?' (명단이 아닌 탭 '+skipped+'개는 건너뜀)':''));
    }else{
      if(f.size>3000000)throw Error('CSV 파일은 3MB까지 가져올 수 있어요.');
      importRows(K.parseDelimited(await f.text()),/후보/.test(f.name)?'후보':f.name.replace(/\.(csv|tsv)$/i,''),f.name);
    }
  }catch(e){sheetMessage(e.message,true);}
}
function choosePerson(){
  const p=currentPeople()[Number($('person').value)];
  if(!p||$('person').value==='')return;
  const seen=$('v-seen').value.trim(),cur=plainName($('v-name').value),next=plainName(p.name);
  const switching=!!cur&&cur!==next;
  // A line already sent is safe to drop; an unsent one asks first.
  if(switching&&seen&&!sentRecord(currentIds(),cur)&&!confirm('지금 쓰던 「본 것 한 줄」은 '+cur+'님 것이에요. 지우고 '+next+'님으로 바꿀까요?')){fillPeople();return;}
  $('v-name').value=next;
  $('to').value=p.email;$('handle').value=p.handle;
  $('v-platform').value=p.platform;
  $('v-post').value=/instagram\.com\/(p|reel|reels)\//i.test(p.url)?p.url:'';
  $('v-work').value='';
  if(switching){$('v-seen').value='';if(resetWording())toast('다른 분을 골라 문구를 확정 문안으로 되돌렸어요.');}
  const ch=K.channelOf(p);
  const rowLink=/후보/.test($('sheetTab').value)?'https://docs.google.com/spreadsheets/d/'+SHEET_ID+'/edit#gid='+CANDIDATE_GID+'&range=A'+p.row:'';
  const ref=$('sheetRef');ref.replaceChildren();
  const line=t=>ref.appendChild(document.createTextNode(t+'\n'));
  const link=(href,text)=>{const a=document.createElement('a');a.href=href;a.target='_blank';a.rel='noopener';a.textContent=text;ref.appendChild(a);ref.appendChild(document.createTextNode('  '));};
  line('시트 참고 · 메일·DM에는 들어가지 않아요');
  line(p.row+'행 · 평가 '+(p.gradeRaw||'없음')+(p.field?' · '+p.field:'')+(p.purpose?' · 목적 '+p.purpose:''));
  if(p.contact)line('연락 창구: '+p.contact);
  if(p.url)link(p.url,'작품 열기');
  if(rowLink)link(rowLink,'시트 행 열기');
  if(p.url||rowLink)ref.appendChild(document.createTextNode('\n'));
  if(p.note)line('비고: '+p.note);
  line('시트 상태: '+(p.status||'비어 있음'));
  if(p.seen)line('시트에 적힌 본 것: '+p.seen);
  if(ch)setChannel(ch,false);else toast('연락 창구(메일·인스타 계정)를 찾지 못했어요. 직접 넣어 주세요.');
  saveDraft();render();$('v-seen').focus();
}
function step(d){
  const list=visible();if(!list.length)return;
  const at=list.findIndex(x=>String(x.i)===$('person').value);
  const next=list[(at<0?(d>0?0:list.length-1):(at+d+list.length)%list.length)];
  $('person').value=String(next.i);choosePerson();
}

/* ---------- Replies ---------- */
function replyValues(){
  const p=sheetMatches()[0];
  return {'활동명':plainName($('v-name').value)||'작가','담당자명':$('v-sender').value.trim()||'담당자','날짜':new Date().toLocaleDateString('ko-KR',{month:'long',day:'numeric'}),'출처':(p&&p.url)||$('v-post').value.trim()||($('v-platform').value.trim()?$('v-platform').value.trim()+' 프로필':'공개 프로필')};
}
function renderReplies(){if($('replyBox').open)$('replyPreview').textContent=C.reply('optout',replyValues())+'\n\n'+C.reply('source',replyValues());}

/* ---------- Session list ---------- */
function renderLog(){
  const body=$('logBody');body.replaceChildren();
  $('logCount').textContent=log.length?log.length+'명':'';
  if(!log.length){const p=document.createElement('p');p.className='empty';p.textContent='아직 없어요. Gmail·인스타에서 보낸 뒤 「보냄으로 기록」을 눌러 주세요.';body.appendChild(p);return;}
  const t=document.createElement('table');
  t.innerHTML='<thead><tr><th>보낸 때</th><th>이름</th><th>곳</th><th>본 것 한 줄</th><th></th></tr></thead>';
  const tb=document.createElement('tbody');
  [...log].reverse().forEach(r=>{
    const tr=document.createElement('tr');
    [fmtDate(r.at),r.name+(r.row?' ('+r.row+'행)':''),r.channel==='dm'?'인스타':'메일',r.seen||'—'].forEach((x,i)=>{const td=document.createElement('td');td.textContent=x;if(i===3)td.className='seen';tr.appendChild(td);});
    const td=document.createElement('td'),b=document.createElement('button');b.textContent='빼기';b.style.minHeight='30px';b.style.padding='4px 8px';
    b.onclick=()=>{if(!confirm(r.name+'님을 이 목록에서 뺄까요? 시트는 바뀌지 않아요.'))return;log=log.filter(x=>x!==r);store.set(S,KEY.log,log);fillPeople($('person').value);render();};
    td.appendChild(b);tr.appendChild(td);tb.appendChild(tr);
  });
  t.appendChild(tb);body.appendChild(t);
}
const tsvRow=r=>[r.name,r.contact,r.channel==='dm'?'인스타 DM':'메일','발송 '+new Date(r.at).toLocaleDateString('ko-KR'),r.sender||'',r.seen||''].join('\t');
function markSent(){
  const name=plainName($('v-name').value);if(!name)return;
  if(!confirm(name+'님에게 '+(channel==='dm'?'인스타 DM':'메일')+'을 보냈나요? 이 창 목록에 올리고, 시트에 옮겨 적을 줄을 복사해요.'))return;
  const p=sheetMatches()[0];
  const r={ids:currentIds(),name,channel,contact:channel==='email'?$('to').value.trim():'@'+handleOf($('handle').value),row:p?p.row:'',seen:$('v-seen').value.trim(),sender:$('v-sender').value.trim(),at:new Date().toISOString()};
  log.push(r);store.set(S,KEY.log,log);
  copyText(tsvRow(r),name+'님 줄을 복사했어요. 후보 시트 상태 열 옆에 붙여 주세요.');
  fillPeople();render();
}

/* ---------- Events ---------- */
varInputs.forEach(i=>i.addEventListener('input',()=>{saveDraft();render();}));
['to','handle','adPhone'].forEach(id=>$(id).addEventListener('input',()=>{saveDraft();render();}));
$('handle').addEventListener('change',()=>{$('handle').value=handleOf($('handle').value);saveDraft();render();});
// Pasted text arrives as plain, NFC-normalised text so look-alike characters compare equal.
$('v-seen').addEventListener('paste',e=>{const t=e.clipboardData&&e.clipboardData.getData('text/plain');if(t==null)return;e.preventDefault();document.execCommand('insertText',false,C.clean(t));});
$('subjectPick').onchange=()=>{saveDraft();render();};
$('chEmail').onclick=()=>setChannel('email');
$('chDm').onclick=()=>setChannel('dm');
$('adOn').onchange=()=>{syncAd();saveDraft();render();};
['footerOn','markOn'].forEach(id=>$(id).onchange=()=>{saveDraft();render();});
tplInputs.forEach(i=>i.addEventListener('input',()=>{const [c,k]=i.dataset.tpl.split('.');tpl[c][k]=i.value;store.set(S,KEY.tpl,tpl);render();}));
$('tplReset').onclick=()=>{if(!confirm('이번 메일에서 고친 문구를 지우고 확정 문안으로 돌아갈까요?'))return;resetWording();render();toast('확정 문안으로 돌아왔어요.');};
$('checks').addEventListener('click',e=>{const li=e.target.closest('li[data-field]');if(li){$(li.dataset.field).focus();}});
$('checks').addEventListener('keydown',e=>{const li=e.target.closest('li[data-field]');if(li&&(e.key==='Enter'||e.key===' ')){e.preventDefault();$(li.dataset.field).focus();}});
$('copyTo').onclick=()=>{const t=$('to').value.trim();if(!t){toast('받는 메일 주소가 비어 있어요.');return;}copyText(t,'받는 주소를 복사했어요.');};
$('copySubject').onclick=()=>copyText(last.subject,'제목을 복사했어요.');
$('copyBody').onclick=()=>copyRich(last);
$('openGmail').onclick=e=>{if($('openGmail').getAttribute('aria-disabled')==='true'){e.preventDefault();toast('점검에서 막힌 것을 먼저 고쳐 주세요.');return;}copyRich(last);};
$('copyDm').onclick=()=>copyText(last.dm,'DM을 복사했어요.');
$('openDm').onclick=e=>{if($('openDm').getAttribute('aria-disabled')==='true'){e.preventDefault();toast(handleOf($('handle').value)?'점검에서 막힌 것을 먼저 고쳐 주세요.':'인스타 계정을 먼저 넣어 주세요.');return;}copyText(last.dm,'DM을 복사했어요. 열린 DM 창에 붙여 넣으세요.');};
$('openLinks').onclick=()=>{[C.LINKS.app,C.LINKS.form,C.LINKS.chat].forEach(u=>window.open(u,'_blank','noopener'));toast('링크 3개를 새 탭으로 열었어요. 팝업이 막히면 허용해 주세요.');};
$('markSent').onclick=markSent;
$('manualClose').onclick=()=>$('manual').close();
$('copyLog').onclick=()=>{if(!log.length){toast('이 창에서 보낸 분이 없어요.');return;}copyText(['활동명\t계정·주소\t보낸 곳\t상태\t담당\t본 것 한 줄'].concat(log.map(tsvRow)).join('\n'),'시트에 붙일 줄을 복사했어요.');};
$('clearLog').onclick=()=>{if(!log.length)return;if(!confirm('이 창 목록 '+log.length+'명을 비울까요? 시트에 옮겨 적었는지 먼저 확인해 주세요.'))return;log=[];store.del(S,KEY.log);fillPeople();render();};
$('replyBox').addEventListener('toggle',renderReplies);
$('copyOptout').onclick=()=>copyText(C.reply('optout',replyValues()),'수신거부 확인 답장을 복사했어요.');
$('copySource').onclick=()=>copyText(C.reply('source',replyValues()),'연락처 출처 안내 답장을 복사했어요.');
$('copyOptoutRow').onclick=()=>{const v=replyValues(),contact=$('to').value.trim()||('@'+handleOf($('handle').value));copyText([v['활동명'],contact,channel==='dm'?'인스타 DM':'메일','수신거부 '+new Date().toLocaleDateString('ko-KR'),$('v-sender').value.trim()].join('\t'),'시트에 붙일 수신거부 줄을 복사했어요.');};
$('wDesk').onclick=()=>{$('frame').style.width='640px';$('wDesk').setAttribute('aria-pressed','true');$('wMobile').setAttribute('aria-pressed','false');};
$('wMobile').onclick=()=>{$('frame').style.width='375px';$('wMobile').setAttribute('aria-pressed','true');$('wDesk').setAttribute('aria-pressed','false');};
$('sheetDownload').onclick=()=>{
  window.open('https://docs.google.com/spreadsheets/d/'+SHEET_ID+'/export?format=csv&gid='+CANDIDATE_GID,'_blank','noopener');
  sheetMessage('후보 탭을 CSV로 내려받고 있어요. 받은 파일을 이 칸에 끌어 놓거나 ‘받은 파일 선택’을 눌러 주세요.\n새 탭에 Google 로그인 화면이 뜨면 회사 계정으로 로그인한 뒤 다시 눌러 주세요.');
};
$('sheetFile').onchange=async()=>{const f=$('sheetFile').files[0];$('sheetFile').value='';await importFile(f);};
$('importPaste').onclick=()=>{try{importRows(K.parseDelimited($('sheetPaste').value),'붙여 넣은 표','붙여 넣은 표');$('sheetPaste').value='';}catch(e){sheetMessage(e.message,true);}};
$('forgetSheet').onclick=()=>{if(!confirm('이 창에 가져온 명단을 지울까요? 원본 시트와 이 창 목록은 그대로예요.'))return;sheet=null;store.del(S,KEY.people);$('sheetRef').replaceChildren();fillPeople();sheetMessage('가져온 명단을 지웠어요.');};
$('sheetTab').onchange=()=>{sheet.tab=$('sheetTab').value;store.set(S,KEY.people,sheet);fillPeople();};
$('person').onchange=choosePerson;
$('prevPerson').onclick=()=>step(-1);
$('nextPerson').onclick=()=>step(1);
['onlyReady','hideSent'].forEach(id=>$(id).onchange=()=>fillPeople($('person').value));
const importer=$('importer');
importer.addEventListener('dragover',e=>{if(![...e.dataTransfer.types].includes('Files'))return;e.preventDefault();importer.classList.add('dragging');});
importer.addEventListener('dragleave',e=>{if(!importer.contains(e.relatedTarget))importer.classList.remove('dragging');});
importer.addEventListener('drop',e=>{if(!e.dataTransfer.files.length)return;e.preventDefault();importer.classList.remove('dragging');importFile(e.dataTransfer.files[0]);});
// The night window can start while the tab is open.
setInterval(render,60000);

const draft=loadDraft();
fillPeople(draft.person);if(draft.tab&&sheet&&sheet.tabs&&sheet.tabs[draft.tab]){$('sheetTab').value=draft.tab;fillPeople(draft.person);}
setChannel(channel,false);
