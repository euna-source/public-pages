/* Private sheet data stays in the current browser, never in the published files. */
const SHEET_STORE='c8-weeklybest-private-weeks-v1';
const SHEET_ID='1sp429sp0G-xega9RBvcPw0phOd9Ju5bkuzgo5r4gE1Y';
const RECEIPTS={
  basic:'경품 지급 확인 문자는 크리에이터클럽 운영팀 담당자 번호로 따로 보내드립니다.\n문자를 확인하신 후 안내에 따라 회신 부탁드립니다.',
  knock:'경품 지급 확인 문자는 크리에이터클럽 운영팀 담당자 번호로 따로 보내드립니다.\nMy 프로필에 휴대폰 번호가 등록되어 있지 않은 경우, 크리에이터클럽 앱 내 노크로 안내드릴 수 있습니다.\n문자 또는 노크를 확인하신 후 안내에 따라 회신 부탁드립니다.'
};
let weeks={};
try{const data=JSON.parse(sessionStorage.getItem(SHEET_STORE)||'{}');if(data&&typeof data==='object'&&!Array.isArray(data))weeks=data;}catch(e){}
const sheetMessage=(s,error=false)=>{ $('sheetStatus').textContent=s;$('sheetStatus').style.color=error?'var(--ink)':''; };
function saveWeeks(){
  try{sessionStorage.setItem(SHEET_STORE,JSON.stringify(weeks));return true;}
  catch(e){sheetMessage('브라우저에 저장하지 못했어요. 지금은 사용할 수 있지만 새로 열면 다시 가져와야 해요.',true);return false;}
}
function fillSelect(el,items,empty){
  el.replaceChildren();
  if(!items.length){const o=new Option(empty,'');el.add(o);el.disabled=true;return;}
  el.disabled=false;items.forEach(([label,value])=>el.add(new Option(label,value)));
}
function updatePeople(){
  const data=weeks[$('sheetWeek').value];
  fillSelect($('sheetPerson'),data?data.people.map((p,i)=>[p.name+' · '+WeeklySheet.money(p.total)+' · '+(p.notice||'안내 상태 미확인'),String(i)]):[],'지급 대상자 없음');
  $('makeMail').disabled=!data?.people.length;
  if(data)sheetMessage(data.week+' · 지급대상 '+data.people.length+'명 · 총 '+WeeklySheet.money(data.total)+'\n가져온 시각: '+new Date(data.importedAt).toLocaleString('ko-KR')+'\n‘선택한 분의 메일 만들기’를 누르면 아래 양식에 반영돼요.');
}
function updateWeeks(selected){
  const entries=Object.values(weeks).filter(d=>d&&typeof d.week==='string'&&Array.isArray(d.people));
  fillSelect($('sheetWeek'),entries.map(d=>[d.week,d.week]),'시트를 먼저 가져와 주세요');
  if(selected&&weeks[selected])$('sheetWeek').value=selected;
  updatePeople();
}
function importSheet(csv,gid=''){
  const data=WeeklySheet.convert(WeeklySheet.parseDelimited(csv));
  data.gid=gid;data.importedAt=new Date().toISOString();
  weeks[data.week]=data;
  const saved=saveWeeks();updateWeeks(data.week);$('sheetPaste').value='';
  if(!saved)sheetMessage(data.week+'를 가져왔지만 브라우저 저장 공간이 부족해요. 새로 열면 다시 가져와 주세요.',true);
  toast(data.week+' 지급대상 '+data.people.length+'명을 가져왔어요.');
  return data;
}
/* Whole workbook (.xlsx) from the sheet's own download. The parser is bundled and loaded only when needed. */
let xlsxLib;
function loadXlsx(){
  return xlsxLib||(xlsxLib=new Promise((ok,fail)=>{
    if(window.XLSX)return ok(window.XLSX);
    const s=document.createElement('script');s.src='xlsx.mini.min.js';
    s.onload=()=>window.XLSX?ok(window.XLSX):fail(Error('파일 읽기 도구를 불러오지 못했어요. 새로고침 후 다시 시도해 주세요.'));
    s.onerror=()=>{xlsxLib=null;fail(Error('파일 읽기 도구를 불러오지 못했어요. 인터넷 연결을 확인해 주세요.'));};
    document.head.appendChild(s);
  }));
}
async function importWorkbook(buffer){
  const X=await loadXlsx();
  const wb=X.read(new Uint8Array(buffer),{type:'array'});
  const {weeks:found,errors}=WeeklySheet.convertBook(wb.SheetNames.map(name=>({name,rows:X.utils.sheet_to_json(wb.Sheets[name],{header:1,raw:false,defval:'',blankrows:true})})));
  const importedAt=new Date().toISOString();
  found.forEach(d=>{d.gid='';d.importedAt=importedAt;weeks[d.week]=d;});
  const saved=saveWeeks();
  // Newest week first: tab order in the sheet puts the latest week at the front.
  updateWeeks(found[0]?.week);
  const lines=[];
  if(found.length)lines.push(found.map(d=>d.week+' '+d.people.length+'명').join(' · ')+'을 가져왔어요.');
  if(errors.length)lines.push('가져오지 못한 주차가 있어요. 시트를 확인한 뒤 다시 받아 주세요.\n'+errors.join('\n'));
  if(!saved)lines.push('브라우저 저장 공간이 부족해요. 새로 열면 다시 가져와 주세요.');
  if(errors.length||!saved||!found.length)sheetMessage((found.length?$('sheetStatus').textContent+'\n':'')+lines.join('\n'),true);
  if(found.length)toast(lines[0]);
}
async function importFile(f){
  if(!f)return;
  try{
    if(/\.xlsx$/i.test(f.name)){
      if(f.size>5000000)throw Error('당첨자 관리 시트에서 받은 파일을 선택해 주세요. xlsx 파일은 5MB까지 가져올 수 있어요.');
      await importWorkbook(await f.arrayBuffer());
    }else{
      if(f.size>1000000)throw Error('주차별 CSV 파일을 선택해 주세요. 파일은 1MB까지 가져올 수 있어요.');
      importSheet(await f.text());
    }
  }catch(e){sheetMessage(e.message,true);}
}
function syncReceiptVersion(){
  $('receiptVersion').value=Object.keys(RECEIPTS).find(k=>RECEIPTS[k]===$('receipt').value)||'custom';
}
function makeSelectedMail(){
  const data=weeks[$('sheetWeek').value],p=data?.people[Number($('sheetPerson').value)];
  if(!p)return;
  if(!confirm(p.name+' 님의 '+data.week+' 메일을 만들까요? 현재 양식과 직접 고친 HTML은 새 내용으로 바뀝니다.'))return;
  const receiptVersion=$('receiptVersion').value==='knock'?'knock':'basic';
  const v={...DEFAULTS,
    subject:'[크리에이터클럽] '+data.week+' 위클리 베스트 수상 및 경품 지급 안내',
    preheader:data.week+' 위클리 베스트 선정을 축하드려요. 경품 지급 안내를 확인해 주세요.',
    week:data.week,name:p.name,awards:p.awards,total:'모바일 상품권 '+WeeklySheet.money(p.total),prize:p.prize,
    receipt:$('receiptVersion').value==='custom'?$('receipt').value:RECEIPTS[receiptVersion],bizno:$('bizno').value||DEFAULTS.bizno};
  KEYS.forEach(k=>$(k).value=v[k]);setMode(false);syncReceiptVersion();
  sheetMessage('현재 메일: '+data.week+' · '+p.name+' 님 · '+WeeklySheet.money(p.total)+'\n수상 내역·경품·안내 버전을 확인한 뒤 복사해 주세요. 이메일 주소는 시트에 없어 자동 입력하지 않아요.');
}
$('sheetWeek').onchange=updatePeople;
$('sheetPerson').onchange=()=>sheetMessage('선택한 대상자: '+$('sheetPerson').selectedOptions[0]?.textContent+'\n‘선택한 분의 메일 만들기’를 눌러 양식에 반영해 주세요.');
$('makeMail').onclick=makeSelectedMail;
$('forgetSheet').onclick=()=>{
  if(!confirm('이 브라우저에 가져온 모든 주차 명단과 현재 메일 초안을 지울까요? 원본 시트는 바뀌지 않아요.'))return;
  weeks={};try{sessionStorage.removeItem(SHEET_STORE);sessionStorage.removeItem(STORE);localStorage.removeItem(STORE);}catch(e){}
  KEYS.forEach(k=>$(k).value=DEFAULTS[k]);$('raw').value='';setMode(false);updateWeeks();syncReceiptVersion();
  sheetMessage('가져온 명단과 현재 메일 초안을 지웠어요. 원본 시트는 바뀌지 않았어요.');
};
$('receiptVersion').onchange=()=>{
  const version=$('receiptVersion').value;if(!RECEIPTS[version])return;
  if(rawMode){toast('양식으로 고치기로 돌아온 뒤 안내 버전을 골라 주세요.');syncReceiptVersion();return;}
  $('receipt').value=RECEIPTS[version];render();
};
$('receipt').addEventListener('input',syncReceiptVersion);
$('reset').addEventListener('click',syncReceiptVersion);
$('importPaste').onclick=()=>{try{importSheet($('sheetPaste').value);}catch(e){sheetMessage(e.message,true);}};
$('sheetFile').onchange=async()=>{const f=$('sheetFile').files[0];$('sheetFile').value='';await importFile(f);};
$('sheetDownload').onclick=()=>{
  // Google serves the private workbook only to the signed-in browser, so the browser downloads it and the editor reads the file.
  window.open('https://docs.google.com/spreadsheets/d/'+SHEET_ID+'/export?format=xlsx','_blank','noopener');
  sheetMessage('시트 파일을 내려받고 있어요. 받은 ‘[WIP] 위클리베스트 당첨자 관리.xlsx’를 이 칸에 끌어 놓거나 ‘받은 파일 선택’을 눌러 주세요.\n새 탭에 Google 로그인 화면이 뜨면 회사 계정으로 로그인한 뒤 다시 눌러 주세요.');
};
const importer=document.querySelector('.importer');
importer.addEventListener('dragover',e=>{if(![...e.dataTransfer.types].includes('Files'))return;e.preventDefault();importer.classList.add('dragging');});
importer.addEventListener('dragleave',e=>{if(!importer.contains(e.relatedTarget))importer.classList.remove('dragging');});
importer.addEventListener('drop',e=>{if(!e.dataTransfer.files.length)return;e.preventDefault();importer.classList.remove('dragging');importFile(e.dataTransfer.files[0]);});
$('sheetBookmark').href='javascript:('+weeklyBestBridge.toString()+')()';
$('sheetBookmark').onclick=e=>{e.preventDefault();toast('이 링크를 북마크 막대로 끌어 놓은 뒤, 당첨자 시트에서 눌러 주세요.');};
window.addEventListener('message',e=>{
  if(e.origin!=='https://docs.google.com'||!window.opener||e.source!==window.opener||e.data?.type!=='c8-weekly-import'||e.data.spreadsheetId!==SHEET_ID)return;
  const csv=e.data.csv;
  if(typeof csv!=='string'||csv.length>1000000)return;
  // ACK both success and parse errors so the sheet sender never retries a bad tab.
  e.source.postMessage({type:'c8-weekly-import-ack'},e.origin);
  try{importSheet(csv,String(e.data.gid||''));}
  catch(error){sheetMessage(error.message,true);}
});
updateWeeks();syncReceiptVersion();
if(location.hash==='#sheet-import'){
  history.replaceState(null,'',location.pathname+location.search);
  sheetMessage('시트에서 선택한 주차를 가져오고 있어요.');
}
