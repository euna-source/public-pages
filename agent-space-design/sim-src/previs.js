import * as T from 'three';
import {actor,preload} from './actors.js';

const stage=document.getElementById('stage');
const world=document.getElementById('world');
const host=document.getElementById('render-layer');
const loading=document.getElementById('loading');
const playToggle=document.getElementById('play-toggle');
const elapsed=document.getElementById('elapsed');
const beatKicker=document.getElementById('beat-kicker');
const beatLabel=document.getElementById('beat-label');
const beatCopy=document.getElementById('beat-copy');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const motionQuery=new URLSearchParams(location.search);

const HALF_HEIGHT=5;
const focusTargets={all:[1,'50%','50%'],howl:[1.65,'29%','59%'],kitty:[1.8,'47%','63%'],kuromi:[1.85,'78%','59%'],chococat:[2.15,'59%','30%'],dust:[2.05,'43%','76%']};
const anchors={howl:[30.6,69.2],kitty:[46.2,67.8],kuromi:[78.4,66.4],chococat:[59,37.1],dust:[38.5,78.6]};
const howlBeats=[
 {end:2.4,label:'읽으며 호흡하기',copy:'손보다 시선이 먼저 문장에 머뭅니다.'},
 {end:3.6,label:'시선이 먼저 멎기',copy:'새 근거를 발견하고 눈과 고개가 아주 작게 멈춥니다.'},
 {end:5.3,label:'몸통으로 반응하기',copy:'가슴이 먼저 들리고 상체가 종이에서 천천히 떨어집니다.'},
 {end:7.5,label:'체중을 한쪽으로 옮기기',copy:'골반과 어깨가 같은 방향으로 움직이지 않아 무게가 읽힙니다.'},
 {end:13.2,label:'일어서기 전 생각을 붙들기',copy:'바로 일어나지 않고 발 위치를 지킨 채 호흡부터 원래 리듬으로 돌아옵니다.'},
];

let renderer,scene,camera,raf=0,last=0,clock=((Number(motionQuery.get('time'))||0)%180+180)%180,paused=reduced.matches,visible=true,halfWidth=8.96;
const cast=[],castByKey=new Map();
const clamp01=value=>Math.max(0,Math.min(1,value));
const smooth=value=>{const x=clamp01(value);return x*x*(3-2*x);};
const screenPoint=(x,y)=>new T.Vector3((x/100-.5)*halfWidth*2,(.5-y/100)*HALF_HEIGHT*2,0);

function addContact(root,width,opacity=.24){
 const material=new T.MeshBasicMaterial({color:0x34291f,transparent:true,opacity,depthWrite:false});
 const shadow=new T.Mesh(new T.CircleGeometry(width,48),material);
 shadow.scale.y=.18;shadow.position.set(.09,.015,-.24);shadow.renderOrder=-1;root.add(shadow);
}

function addActor(key,name,height,anchor,contact){
 const rig=actor(key,height);
 rig.root.position.copy(screenPoint(...anchor));rig.root.rotation.y=0;
 rig.root.traverse(object=>{if(object.isMesh)object.renderOrder=1;});
 addContact(rig.root,contact,key==='dust'?.18:.24);scene.add(rig.root);
 const member={key,name,rig,anchor,gait:0,x:anchor[0],y:anchor[1],state:'대기'};
 cast.push(member);castByKey.set(key,member);return member;
}

function place(member,x=member.x,y=member.y){member.x=x;member.y=y;member.rig.root.position.copy(screenPoint(x,y));}

function updateHowl(member,time,dt){
 const local=time%13.2;
 const found=howlBeats.findIndex(item=>local<item.end),index=found<0?howlBeats.length-1:found,item=howlBeats[index];
 let performance='read',age=local;
 if(local>=2.4){performance='disappointed';age=Math.min(9.6,local-2.4+.55);}
 member.rig.update(time,0,'read','focused',member.gait,dt,{yaw:-.08,pitch:.02,age,performance});
 member.state=item.label;return {index,item};
}

function updateKitty(member,time,dt){
 const local=(time+4.35)%11.7,writing=local<6.1,performance=writing?'brooding':'idea';
 const age=writing?Math.min(local+1.1,8.2):local-6.1+.55;
 member.rig.update(time,0,writing?'write':'present',writing?'focused':'pleased',member.gait,dt,{yaw:writing?-.13:.12,pitch:.03,age,performance});
 member.state=writing?'한 줄을 고쳐 쓰기':'고친 문장을 조용히 보여 주기';
}

function updateKuromi(member,time,dt){
 const local=(time+7.2)%13.4,challenge=local>=6.9&&local<10.2,agree=local>=10.2;
 const action=challenge?'challenge':agree?'agree':'verify',performance=agree?'idea':'brooding';
 const age=agree?local-10.2+.7:Math.min((local%6.9)+1.2,8.1);
 member.rig.update(time,0,action,challenge?'curious':agree?'pleased':'focused',member.gait,dt,{yaw:challenge?-.28:.06,pitch:.01,age,performance});
 member.state=challenge?'근거를 옆 장과 대조하기':agree?'맞는 문장에 작게 끄덕이기':'표시를 따라 검증하기';
}

function updateChococat(member,time,dt,dust){
 const local=(time+2.6)%15.3,writing=local>8.4&&local<12.7;
 const yaw=writing?-.08:Math.sin(time*.43)*.34+(dust.x-member.x)*.012;
 member.rig.update(time,0,writing?'write':'observe',writing?'focused':'curious',member.gait,dt,{yaw,pitch:writing?.08:-.02,age:local,performance:writing?'read':''});
 member.state=writing?'관찰한 변화를 짧게 적기':'다른 움직임을 따라 눈과 귀 돌리기';
}

function updateDust(member,time,dt){
 const local=(time+1.2)%18.4;
 let x=38.5,speed=0,action='read',performance='read',age=local;
 if(local>=4&&local<8){x=38.5+(42.4-38.5)*smooth((local-4)/4);speed=.46;action='carry';performance='';}
 else if(local>=8&&local<13){x=42.4;action='pickup';performance='pickup';age=local-8+.35;}
 else if(local>=13&&local<17){x=42.4+(38.5-42.4)*smooth((local-13)/4);speed=.46;action='carry';performance='';}
 else if(local>=17){x=38.5;age=local-17;}
 member.gait+=speed*dt*15;place(member,x,78.6);member.rig.root.rotation.y=local>=13&&local<17?Math.PI:0;
 member.rig.update(time,speed,action,'focused',member.gait,dt,{yaw:0,pitch:.03,age,performance});
 member.state=speed?'종이를 든 채 짧게 걷기':action==='pickup'?'무릎부터 접어 종이 줍기':'종이 가장자리를 읽기';
}

function resize(){
 if(!renderer||!camera)return;
 const rect=host.getBoundingClientRect();if(!rect.width||!rect.height)return;
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.setSize(rect.width,rect.height,false);
 halfWidth=HALF_HEIGHT*(rect.width/rect.height);
 camera.left=-halfWidth;camera.right=halfWidth;camera.top=HALF_HEIGHT;camera.bottom=-HALF_HEIGHT;camera.updateProjectionMatrix();
 for(const member of cast)place(member);
}

function formatTime(value){const whole=Math.floor(value%180);return `${String(Math.floor(whole/60)).padStart(2,'0')}:${String(whole%60).padStart(2,'0')} / 03:00`;}

function renderFrame(now){
 raf=requestAnimationFrame(renderFrame);
 const dt=Math.min(.05,(now-last)/1000||0);last=now;if(document.hidden||!visible)return;
 if(!paused)clock=(clock+dt)%180;
 const dust=castByKey.get('dust'),frameDt=paused?Infinity:dt;
 const beat=updateHowl(castByKey.get('howl'),clock,frameDt);
 updateKitty(castByKey.get('kitty'),clock,frameDt);updateKuromi(castByKey.get('kuromi'),clock,frameDt);
 updateDust(dust,clock,frameDt);updateChococat(castByKey.get('chococat'),clock,frameDt,dust);
 elapsed.textContent=formatTime(clock);beatKicker.textContent=`하울 · ${String(beat.index+1).padStart(2,'0')} / 05`;beatLabel.textContent=beat.item.label;beatCopy.textContent=beat.item.copy;
 renderer.render(scene,camera);
}

function setPaused(value){paused=value;playToggle.setAttribute('aria-pressed',String(paused));playToggle.querySelector('span').textContent=paused?'움직임 재생':'움직임 정지';}
function focus(key){const target=focusTargets[key]||focusTargets.all;world.style.setProperty('--view-scale',target[0]);world.style.setProperty('--origin-x',target[1]);world.style.setProperty('--origin-y',target[2]);document.querySelectorAll('[data-focus]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.focus===key)));}

async function init(){
 renderer=new T.WebGLRenderer({alpha:true,antialias:true,premultipliedAlpha:true});
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.04;renderer.setClearColor(0x000000,0);host.append(renderer.domElement);
 scene=new T.Scene();camera=new T.OrthographicCamera(-halfWidth,halfWidth,HALF_HEIGHT,-HALF_HEIGHT,.1,40);camera.position.set(0,0,12);camera.lookAt(0,0,0);
 scene.add(new T.HemisphereLight(0xfff4dc,0x6e7867,2.35));const sun=new T.DirectionalLight(0xffdfad,3.2);sun.position.set(-5,8,10);scene.add(sun);const fill=new T.DirectionalLight(0xdce8ff,.7);fill.position.set(7,3,8);scene.add(fill);
 try{
  await preload(count=>{loading.textContent=`기존 캐릭터 자산을 불러오는 중 · ${count} / 4`;});
  addActor('howl','하울',1.62,anchors.howl,.27);addActor('kitty','키티',1.02,anchors.kitty,.24);addActor('kuromi','쿠로미',1.04,anchors.kuromi,.24);addActor('chococat','초코캣',.72,anchors.chococat,.22);addActor('dust','스스와타리',.62,anchors.dust,.22);
  resize();loading.hidden=true;setPaused(paused);focus(motionQuery.get('focus')||'all');raf=requestAnimationFrame(renderFrame);
 }catch(error){loading.textContent='캐릭터 자산을 불러오지 못했습니다. 공간 탐색에서 정지 장면을 확인해 주세요.';console.error('Motion previs failed',error);}
}

playToggle.addEventListener('click',()=>setPaused(!paused));
document.querySelectorAll('[data-focus]').forEach(button=>button.addEventListener('click',()=>focus(button.dataset.focus)));
stage.addEventListener('keydown',event=>{if(event.code==='Space'){event.preventDefault();setPaused(!paused);}});
reduced.addEventListener('change',event=>{if(event.matches)setPaused(true);});
new ResizeObserver(resize).observe(host);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=performance.now();},{rootMargin:'100px'}).observe(stage);
document.addEventListener('visibilitychange',()=>{last=performance.now();});window.addEventListener('pagehide',()=>cancelAnimationFrame(raf));

window.motionPrevis={get ready(){return cast.length===5;},get paused(){return paused;},get time(){return clock;},setTime(value){clock=((Number(value)||0)%180+180)%180;},setPaused,focus,snapshot(){return {ready:cast.length===5,paused,time:clock,focus:getComputedStyle(world).getPropertyValue('--origin-x').trim(),actors:cast.map(member=>({key:member.key,state:member.state,x:member.x,y:member.y}))};}};
if(motionQuery.has('paused'))paused=true;
focus(motionQuery.get('focus')||'all');
init();
