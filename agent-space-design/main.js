'use strict';
const $ = (id) => document.getElementById(id);
const views = {
  whole: {title:'연결된 전체 공간', image:'assets/whole-space.webp', alt:'45도 입체 시점의 지브리 공방, 공유 원탁, 산리오 작업실과 열린 통로', caption:'두 세계와 회의실 사이로 업무가 이어집니다.', area:null},
  meeting: {title:'다락방 원탁', image:'assets/meeting-room.webp', alt:'필요한 대표만 모인 원탁, 아젠다 서가와 실험 탁자, 바깥에서 계속되는 업무', caption:'필요한 대표만 모이고, 준비된 결과를 다시 업무로 연결합니다.', area:'meeting'},
  knowledge: {title:'지식 서가와 관찰 회랑', image:'assets/knowledge-gallery.webp', alt:'근거와 결과를 정리하는 먼지, 전체 지식 방향을 살피는 하울과 흐름을 관찰하는 초코캣', caption:'지난 결정과 새 근거, 다음에 확인할 질문이 같은 서가에 이어집니다.', area:'knowledge'},
  parallel: {title:'함께 일하는 작업실', image:'assets/parallel-work.webp', alt:'키티와 쿠로미의 분신, 연구 먼지가 각자의 작업대에서 독립된 일을 진행하는 장면', caption:'완료된 부분부터 넘깁니다. 다른 갈래는 자기 일을 이어갑니다.', area:'studio'}
};
const areas = {
  howl: {label:'1 · 하울의 공방',title:'전체 방향을 연결합니다.',description:'하울은 지식과 업무를 함께 보고, 더 나은 연구 질문과 적용 방향을 찾습니다.',owner:'하울 · 연구 먼지',output:'공통 기준 · 우선순위 · 다음 연구 질문',rule:'각 담당자의 일상 실행은 하울의 순서를 기다리지 않습니다.'},
  meeting: {label:'2 · 다락방 원탁',title:'필요한 관점을 모읍니다.',description:'각자 만든 독립안을 펼치고, 결과를 바꿀 쟁점을 짧게 대조합니다.',owner:'안건 담당자 · 필요한 대표 분신',output:'달라진 판단 · 남은 반론 · 다음 행동',rule:'원탁 바깥의 분신은 독립된 작업을 계속합니다.'},
  studio: {label:'3 · 창작·검증 작업실',title:'만들고, 따로 확인합니다.',description:'키티는 사용자 흐름을, 쿠로미는 실패 조건을 살핍니다. 먼지는 필요한 조사와 실행을 맡습니다.',owner:'키티 · 쿠로미 · 실행 먼지',output:'개선안 · 결과물 · 독립 검증 근거',rule:'같은 수정 대상에는 책임자 한 명, 다른 대상에는 여러 갈래를 둡니다.'},
  knowledge: {label:'4 · 지식 서가',title:'다음 일에 쓸 근거를 남깁니다.',description:'관련 세션과 이전 판단을 연결하고, 무엇이 실제 업무에 쓰였는지 확인합니다.',owner:'사서 먼지 · 하울 · 독립 검증 담당',output:'원문 · 적용 기록 · 결과 · 남은 질문',rule:'읽은 횟수와 실제 도움이 된 결과를 구별합니다.'},
  observer: {label:'5 · 관찰 회랑',title:'흐름을 살피고 고칩니다.',description:'초코캣은 대기·중복·재작업을 발견해 원인을 확인하고 작은 개선을 시작합니다.',owner:'초코캣 · 독립 쿠로미',output:'관측 근거 · 개선 실험 · 효과 확인',rule:'초코캣이 낸 개선안의 효과는 별도의 검증 담당자가 확인합니다.'}
};
const wholeContext = {label:'공간의 원칙',title:'각자 움직이고, 함께 이어갑니다.',description:'하울은 전체 방향을, 각 담당자는 다음 행동을 맡습니다. 회의 중에도 다른 작업은 계속됩니다.',owner:'하울 · 먼지 · 키티 · 쿠로미 · 초코캣',output:'목표 → 실행 → 검증 → 지식 → 다음 일',rule:'공간의 지점을 선택하면 그 자리의 역할을 볼 수 있습니다.'};
let activeView='whole', activeArea=null, step=0, externalWait=false, activeAgenda='knowledge';
const pausedAgendas=new Set();
function setContext(area){
  activeArea=area;
  const a=areas[area]||wholeContext;
  ['label','title','description','owner','output','rule'].forEach(k=>$('context-'+k).textContent=a[k]);
  document.querySelectorAll('[data-area]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.area===area)));
}
function showImageStatus(text,retry){
  const box=$('image-status');box.replaceChildren();box.hidden=!text;
  if(text){const span=document.createElement('span');span.textContent=text;box.append(span);}
  if(retry){const b=document.createElement('button');b.className='quiet-button';b.textContent='이미지 다시 불러오기';b.addEventListener('click',()=>loadWorldImage(views[activeView]));box.append(b);}
}
function loadWorldImage(view){
  const image=$('world-image');
  image.alt=view.alt;image.src=view.image;
  if(image.complete&&image.naturalWidth>0)showImageStatus('');
  else showImageStatus('공간 이미지를 불러오고 있습니다.');
}
$('world-image').addEventListener('load',()=>showImageStatus(''));
$('world-image').addEventListener('error',()=>showImageStatus('이미지를 불러오지 못했습니다. 자리별 설명은 아래에서 볼 수 있습니다.',true));
function selectView(key){
  if(!views[key])return;
  activeView=key;const view=views[key];
  document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===key)));
  $('map-pins').hidden=key!=='whole';$('view-caption').textContent=view.caption;
  setContext(view.area);loadWorldImage(view);
}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>selectView(b.dataset.view)));
document.querySelectorAll('[data-area]').forEach(b=>b.addEventListener('click',()=>{if(activeView!=='whole')selectView('whole');setContext(b.dataset.area);}));
const story=[
 {title:'지시를 기다리지 않고 발견합니다.',description:'키티가 사용자가 다음 입력으로 넘어가기 어려운 지점을 발견했습니다. 기존 개선 목표 안에서 확인할 일을 고릅니다.',image:'parallel',ribbon:'키티가 다음 개선을 발견합니다.',branches:[['키티','입력 흐름의 불편을 확인','다음 일 발견'],['사서 먼지','관련된 이전 기준을 연결','근거 확인'],['하울','다른 목표의 방향을 검토','별도 업무 계속']]},
 {title:'여러 갈래가 동시에 시작합니다.',description:'근거 조사, 사용자 문구, 실패 조건 확인을 나눕니다. 각 담당자는 자기 범위에서 시작하고 준비된 자료부터 공유합니다.',image:'parallel',ribbon:'같은 캐릭터의 분신이 서로 다른 일을 맡습니다.',branches:[['연구 먼지','관련 근거를 조사','독립 진행'],['키티 분신','문구와 입력 흐름을 개선','독립 진행'],['쿠로미 분신','실패 조건과 검증 방법 준비','독립 진행'],['초코캣','중복 작업과 합류 대기를 살핌','흐름 관찰']]},
 {title:'차이가 생기면 필요한 대표가 모입니다.',description:'설명 문구를 늘릴지, 입력 순서를 바꿀지 의견이 갈렸습니다. 세 담당자가 독립안을 대조하는 동안 다른 분신은 검증 준비를 이어갑니다.',image:'meeting',ribbon:'원탁에서는 조율하고, 바깥에서는 계속 준비합니다.',branches:[['키티 대표','사용자 관점의 개선안 제시','원탁에서 조율'],['연구 먼지','각 선택의 근거를 대조','원탁에서 조율'],['쿠로미 대표','반례와 확인할 조건 제시','원탁에서 조율'],['쿠로미 분신','별도 검증 자료를 준비','작업실에서 계속']]},
 {title:'준비된 결과부터 넘깁니다.',description:'합의한 작은 개선을 적용하고 별도의 담당자가 확인합니다. 먼저 끝난 결과를 버전과 함께 넘겨 전체 합류 대기를 줄입니다.',image:'parallel',ribbon:'한 갈래를 기다리는 동안 다른 결과를 확인합니다.',branches:[['키티','개선한 화면과 문구를 전달','부분 결과 인계'],['쿠로미','완료 조건과 실제 결과를 대조','독립 검증'],['사서 먼지','사용한 근거와 결과를 연결','기록 준비'],['초코캣','개선 전후의 대기·재작업 관찰','효과 근거 확인']]},
 {title:'남은 질문에서 다음 일을 찾습니다.',description:'확인된 결과를 아젠다에 남깁니다. 사서 먼지는 다음에 꺼낼 지식으로 연결하고, 담당자는 아직 풀리지 않은 질문을 고릅니다.',image:'knowledge',ribbon:'검증한 결과가 다음 판단의 근거가 됩니다.',branches:[['사서 먼지','원문·적용·검증 결과 연결','지식 정리'],['키티','남은 사용자 불편을 확인','다음 일 선택'],['하울','다른 업무에 적용할 조건 검토','지식 총괄'],['초코캣','실제로 도움이 됐는지 대조','효과 확인']]}
];
function renderStory(){
 const s=story[step];$('story-stage').textContent=`입력 흐름 개선 · ${step+1}/5`;$('story-title').textContent=s.title;$('story-description').textContent=s.description;
 $('story-image').src=views[s.image].image;$('story-image').alt=views[s.image].alt;
 $('story-ribbon').textContent=externalWait?'연구 한 갈래는 응답 대기, 나머지 작업은 계속됩니다.':s.ribbon;
 document.querySelectorAll('[data-step]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.step)===step)));
 const branches=s.branches.map(b=>b.slice());
 if(externalWait){branches.unshift(['연구 분신','추가 자료의 외부 응답을 기다림','이 갈래만 대기']);if(step===4){$('story-description').textContent='검증이 끝난 부분만 아젠다에 연결합니다. 외부 자료를 기다리는 갈래는 미완료로 남겨 두고, 다른 담당자는 다음 유효한 일을 이어갑니다.';}}
 $('branch-list').replaceChildren(...branches.map(([owner,work,state])=>{const li=document.createElement('li');const name=document.createElement('span');name.className='owner';name.textContent=owner;const copy=document.createElement('span');copy.textContent=work;const status=document.createElement('span');status.className='state';status.textContent=state;copy.append(status);li.append(name,copy);return li;}));
 $('next-story').textContent=step===4?'처음 장면으로 ↺':'다음 장면 →';
 $('toggle-wait').textContent=externalWait?'대기 상황 해제':'한 갈래가 막힌 상황 보기';$('toggle-wait').setAttribute('aria-pressed',String(externalWait));
}
document.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{step=Number(b.dataset.step);renderStory();}));
$('next-story').addEventListener('click',()=>{step=(step+1)%story.length;renderStory();});
$('reset-story').addEventListener('click',()=>{step=0;externalWait=false;renderStory();});
const waitButton=document.createElement('button');waitButton.id='toggle-wait';waitButton.className='quiet-button';waitButton.style.marginTop='var(--sp-3)';waitButton.setAttribute('aria-pressed','false');waitButton.textContent='한 갈래가 막힌 상황 보기';$('workflow').querySelector('.story-note').after(waitButton);
waitButton.addEventListener('click',()=>{externalWait=!externalWait;if(externalWait&&step===0)step=1;renderStory();});
const agendas={
 knowledge:{title:'지식이 실제 업무에 쓰이려면?',items:[['지난 판단','읽은 횟수와 실제 활용을 구별하기로 했습니다.'],['확인할 근거','이전 기준이 이번 제안이나 실행을 어떻게 바꿨는지 연결합니다.'],['다음 행동','사서 먼지가 한 업무의 원문·적용·검증 결과를 엮습니다.']],next:'사서 먼지 → 한 업무의 원문·적용·검증 결과 연결'},
 quality:{title:'속도와 품질을 함께 높이려면?',items:[['지난 판단','전체 합류를 기다리지 않고 준비된 부분부터 넘기기로 했습니다.'],['확인할 근거','대기와 재작업의 원인을 같은 유형의 업무에서 비교합니다.'],['다음 행동','초코캣이 대기 구간을 찾고, 쿠로미가 작은 개선의 효과를 확인합니다.']],next:'초코캣 → 대기 원인 확인 / 독립 쿠로미 → 개선 효과 대조'},
 meeting:{title:'회의가 일을 앞으로 움직이려면?',items:[['지난 판단','독립 초안을 만든 뒤 필요한 쟁점만 대조하기로 했습니다.'],['확인할 근거','초안에 없던 오류 발견·판단 변화·실행 연결을 확인합니다.'],['다음 행동','안건 담당자가 회의에서 달라진 점과 다음 실행을 한 장으로 남깁니다.']],next:'안건 담당자 → 달라진 판단·실행 담당·검증 조건 기록'}
};
function renderAgenda(){
 const a=agendas[activeAgenda],paused=pausedAgendas.has(activeAgenda);
 $('agenda-detail-title').textContent=a.title;$('agenda-state').textContent=paused?'아젠다 예시 · 잠시 보류':'아젠다 예시 · 다음 확인 준비';
 document.querySelectorAll('[data-agenda]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.agenda===activeAgenda)));
 $('agenda-timeline').replaceChildren(...a.items.map(([label,text])=>{const li=document.createElement('li');const k=document.createElement('span');k.className='time-label';k.textContent=label;const p=document.createElement('p');p.textContent=text;li.append(k,p);return li;}));
 $('pause-agenda').textContent=paused?'이 아젠다 다시 이어가기':'이 아젠다 잠시 보류';$('agenda-next').disabled=paused;
 $('agenda-feedback').textContent=paused?'이 예시 아젠다의 다음 행동을 보류했습니다. 다른 아젠다는 이어집니다.':'';
}
document.querySelectorAll('[data-agenda]').forEach(b=>b.addEventListener('click',()=>{activeAgenda=b.dataset.agenda;renderAgenda();}));
$('pause-agenda').addEventListener('click',()=>{if(pausedAgendas.has(activeAgenda))pausedAgendas.delete(activeAgenda);else pausedAgendas.add(activeAgenda);renderAgenda();});
$('agenda-next').addEventListener('click',()=>{if(!pausedAgendas.has(activeAgenda))$('agenda-feedback').textContent=agendas[activeAgenda].next+' · 설계 예시';});
const dialog=$('image-dialog');let dialogTrigger=null;
for(const id of ['story-image','dialog-image']){
 const image=$(id),status=document.createElement('p');status.className='dialog-caption';status.hidden=true;status.setAttribute('role','status');image.after(status);
 image.addEventListener('error',()=>{image.hidden=true;status.hidden=false;status.textContent=id==='story-image'?'이미지를 불러오지 못했습니다. 단계별 담당과 다음 행동은 아래 설명에서 볼 수 있습니다.':'이미지를 불러오지 못했습니다. 창을 닫고 다시 열어 주세요.';});
 image.addEventListener('load',()=>{image.hidden=false;status.hidden=true;});
}
function openImage(image,title,caption,trigger){dialogTrigger=trigger;$('dialog-title').textContent=title;$('dialog-image').src=image;$('dialog-image').alt=title;$('dialog-caption').textContent=caption;dialog.showModal();$('close-dialog').focus();}
$('expand-space').addEventListener('click',e=>{const v=views[activeView];openImage(v.image,v.title,v.caption,e.currentTarget);});
$('expand-chococat').addEventListener('click',e=>openImage('assets/chococat.webp','초코캣의 관찰·기록·전달 동작','공식 원본을 바탕으로 맞춘 형태와 역할 동작 시안입니다.',e.currentTarget));
$('close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();$('close-dialog').focus();}});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>dialogTrigger?.focus());
for(const selector of ['.view-tabs','.story-tabs','.agenda-menu']){
 const group=document.querySelector(selector);group.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(e.key))return;const buttons=[...group.querySelectorAll('button')];const index=buttons.indexOf(document.activeElement);if(index<0)return;e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(index+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+buttons.length)%buttons.length;buttons[next].focus();buttons[next].click();});
}
renderStory();renderAgenda();setContext(null);
if($('world-image').complete&&$('world-image').naturalWidth===0)showImageStatus('공간 이미지를 불러오지 못했습니다.',true);
