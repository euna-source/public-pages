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
const query=new URLSearchParams(location.search);
const calibration=query.get('calibrate')==='1';

// All actors use metres in one perspective camera. Screen anchors only choose
// where a camera ray meets a support plane; they never set actor scale.
const CAMERA={fov:47,position:[0,1.68,11.4],target:[0,1.62,-5.8],near:.1,far:80};
const CAST={
 howl:{name:'하울',height:1.78,foot:[.405,.755],support:0,look:[-2.8,.76,9.0]},
 kitty:{name:'키티',height:.72,foot:[.905,.845],support:0,look:[5.0,.62,10.4]},
 kuromi:{name:'쿠로미',height:.68,foot:[.435,.845],support:0,look:[-1.6,.56,10.0]},
 chococat:{name:'초코캣',height:.66,foot:[.875,.685],support:0,look:[4.0,.60,8.8]},
 dust:{name:'스스와타리',height:.18,foot:[.67,.925],support:0,look:[1.4,.18,10.8]},
};
const focusTargets={all:[1,'50%','50%'],howl:[1.52,'40.5%','61%'],kitty:[2.05,'90.5%','72%'],kuromi:[1.95,'43.5%','78%'],chococat:[2.2,'87.5%','60%'],dust:[2.5,'67%','84%']};
const howlBeats=[
 {end:2.4,label:'읽으며 호흡하기',copy:'몸통과 책이 같은 방향을 유지하고 시선이 먼저 문장에 머뭅니다.'},
 {end:3.6,label:'시선이 먼저 멎기',copy:'고개보다 눈이 먼저 멈추고 발은 바닥의 같은 자리를 지킵니다.'},
 {end:5.3,label:'몸통으로 반응하기',copy:'가슴이 들린 뒤 어깨와 팔이 조금 늦게 따라옵니다.'},
 {end:7.5,label:'체중을 한쪽으로 옮기기',copy:'골반 위에서 무게를 옮기되 발바닥은 바닥 높이를 벗어나지 않습니다.'},
 {end:13.2,label:'다시 문장으로 돌아가기',copy:'작은 숨과 시선 이동으로 동작 사이의 정지를 남깁니다.'},
];

let renderer,scene,camera,raycaster,raf=0,last=0;
let clock=((Number(query.get('time'))||0)%180+180)%180;
let manualDelta=0,paused=reduced.matches,visible=true;
const cast=[],castByKey=new Map(),debugGroup=new T.Group(),supportPlanes=new Map(),spatial={};
const clamp01=value=>Math.max(0,Math.min(1,value));
const smooth=value=>{const x=clamp01(value);return x*x*(3-2*x);};
const angleDelta=(a,b)=>Math.atan2(Math.sin(b-a),Math.cos(b-a));

function planeAt(y){
 if(!supportPlanes.has(y))supportPlanes.set(y,new T.Plane(new T.Vector3(0,1,0),-y));
 return supportPlanes.get(y);
}

function worldAtScreen(u,v,y=0,target=new T.Vector3()){
 raycaster.setFromCamera(new T.Vector2(u*2-1,1-v*2),camera);
 if(!raycaster.ray.intersectPlane(planeAt(y),target))throw new Error(`화면 좌표 ${u}, ${v}가 지지 평면과 만나지 않습니다.`);
 return target;
}

function screenOf(point){
 const projected=point.clone().project(camera);
 return {x:(projected.x+1)/2,y:(1-projected.y)/2,depth:projected.z};
}

function facingYaw(from,to){return Math.atan2(to.x-from.x,to.z-from.z);}

function contactShadow(width,opacity=.22){
 const material=new T.MeshBasicMaterial({color:0x2c211a,transparent:true,opacity,depthWrite:false,toneMapped:false});
 const shadow=new T.Mesh(new T.CircleGeometry(width,48),material);
 shadow.rotation.x=-Math.PI/2;shadow.scale.y=.48;shadow.position.y=.008;
 return shadow;
}

function addActor(key){
 const spec=CAST[key],rig=actor(key,spec.height),position=worldAtScreen(...spec.foot,spec.support);
 if(key==='dust')rig.root.scale.setScalar(spec.height/.90);
 if(key!=='dust')rig.prop.scale.setScalar(key==='howl'?.70:.82);
 rig.root.position.copy(position);rig.root.rotation.y=facingYaw(position,new T.Vector3(...spec.look));
 rig.root.add(contactShadow(key==='dust'?.28:spec.height*(key==='howl'?.16:.24),key==='dust'?.30:.19));
 const member={key,...spec,rig,position:position.clone(),baseYaw:rig.root.rotation.y,gait:0,state:'대기'};
 scene.add(rig.root);cast.push(member);castByKey.set(key,member);return member;
}

function addShadowPlane(y,size=70){
 const material=new T.ShadowMaterial({color:0x251c16,opacity:.25,transparent:true,depthWrite:false});
 const plane=new T.Mesh(new T.PlaneGeometry(size,size),material);
 plane.rotation.x=-Math.PI/2;plane.position.y=y-.002;plane.receiveShadow=true;scene.add(plane);
}

function addProxy(name,geometry,position,rotation=[0,0,0]){
 const material=new T.MeshBasicMaterial({colorWrite:false,depthWrite:true,depthTest:true,side:T.DoubleSide});
 const mesh=new T.Mesh(geometry,material);mesh.name=name;mesh.position.copy(position);mesh.rotation.set(...rotation);mesh.renderOrder=-10;scene.add(mesh);
 if(calibration){
  const wire=new T.LineSegments(new T.EdgesGeometry(geometry),new T.LineBasicMaterial({color:0x7ee7cf,transparent:true,opacity:.72,depthTest:false}));
  wire.position.copy(position);wire.rotation.copy(mesh.rotation);wire.renderOrder=20;debugGroup.add(wire);
 }
 return mesh;
}

function buildSpatialProxies(){
 addShadowPlane(0);
 // Matte proxies represent furniture painted into the background. Default actors
 // stay in open lanes, so occlusion happens only on a true depth crossing.
 const tableBase=worldAtScreen(.685,.875,0);
 spatial.tableCenter=tableBase.clone();
 addProxy('central-table-base',new T.CylinderGeometry(.66,.60,.72,48),tableBase.clone().add(new T.Vector3(0,.36,-.05)));
 const tableTop=tableBase.clone();tableTop.y=.74;
 addProxy('central-table-top',new T.CylinderGeometry(1.10,1.10,.12,48),tableTop);
 const deskBase=worldAtScreen(.285,.805,0);
 addProxy('left-desk',new T.BoxGeometry(1.40,.76,.64),deskBase.clone().add(new T.Vector3(0,.38,-.28)),[0,-.035,0]);

 if(calibration){
  const grid=new T.GridHelper(36,36,0xf3d68c,0x8ab6a6);grid.material.transparent=true;grid.material.opacity=.36;grid.position.y=.012;debugGroup.add(grid);
  const horizon=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(-25,1.68,-8),new T.Vector3(25,1.68,-8)]),new T.LineBasicMaterial({color:0xff765f,depthTest:false}));horizon.renderOrder=21;debugGroup.add(horizon);
  for(const member of cast){
   const line=new T.ArrowHelper(new T.Vector3(Math.sin(member.baseYaw),0,Math.cos(member.baseYaw)),member.position.clone().add(new T.Vector3(0,.03,0)),member.height*.55,0xffd16e,member.height*.12,member.height*.06);line.renderOrder=22;debugGroup.add(line);
  }
  scene.add(debugGroup);
 }
}

function relativeAttention(member,target,pitch=0){
 const desired=facingYaw(member.position,target);
 return {yaw:T.MathUtils.clamp(angleDelta(member.baseYaw,desired),-.48,.48),pitch};
}

function updateHowl(member,time,dt){
 const local=time%13.2,found=howlBeats.findIndex(item=>local<item.end),index=found<0?howlBeats.length-1:found,item=howlBeats[index];
 let performanceName='read',age=local;if(local>=2.4){performanceName='disappointed';age=Math.min(9.6,local-2.4+.55);}
 member.rig.update(time,0,'read','focused',member.gait,dt,{...relativeAttention(member,new T.Vector3(...member.look),.10),age,performance:performanceName});member.state=item.label;return {index,item};
}

function updateKitty(member,time,dt){
 const local=(time+4.35)%11.7,writing=local<6.1,performanceName=writing?'brooding':'idea',age=writing?Math.min(local+1.1,8.2):local-6.1+.55;
 member.rig.update(time,0,writing?'write':'present',writing?'focused':'pleased',member.gait,dt,{...relativeAttention(member,new T.Vector3(...member.look),writing?.08:0),age,performance:performanceName});member.state=writing?'한 줄을 고쳐 쓰기':'고친 문장을 조용히 보여 주기';
}

function updateKuromi(member,time,dt){
 const local=(time+7.2)%13.4,challenge=local>=6.9&&local<10.2,agree=local>=10.2,action=challenge?'challenge':agree?'agree':'verify';
 member.rig.update(time,0,action,challenge?'curious':agree?'pleased':'focused',member.gait,dt,{...relativeAttention(member,new T.Vector3(...member.look),.04),age:agree?local-10.2+.7:Math.min((local%6.9)+1.2,8.1),performance:agree?'idea':'brooding'});member.state=challenge?'근거를 옆 장과 대조하기':agree?'맞는 문장에 작게 끄덕이기':'표시를 따라 검증하기';
}

function updateChococat(member,time,dt,dustMember){
 const local=(time+2.6)%15.3,writing=local>8.4&&local<12.7,target=writing?new T.Vector3(...member.look):dustMember.position;
 member.rig.update(time,0,writing?'write':'observe',writing?'focused':'curious',member.gait,dt,{...relativeAttention(member,target,writing?.08:-.01),age:local,performance:writing?'read':''});member.state=writing?'관찰한 변화를 짧게 적기':'스스와타리 쪽으로 귀와 눈 돌리기';
}

function updateDust(member,time,poseDt,gaitDt=poseDt){
 const local=(time+1.2)%18.4,start=CAST.dust.foot,end=[.715,.915];let u=0,speed=0,action='read',performanceName='read',age=local;
 if(local>=4&&local<8){u=smooth((local-4)/4);speed=.34;action='carry';performanceName='';}
 else if(local>=8&&local<13){u=1;action='pickup';performanceName='pickup';age=local-8+.35;}
 else if(local>=13&&local<17){u=1-smooth((local-13)/4);speed=.34;action='carry';performanceName='';}
 const foot=[T.MathUtils.lerp(start[0],end[0],u),T.MathUtils.lerp(start[1],end[1],u)];member.position.copy(worldAtScreen(...foot,0));member.rig.root.position.copy(member.position);
 const travelTarget=worldAtScreen(...(local>=13&&local<17?start:end),0);member.baseYaw=facingYaw(member.position,travelTarget);member.rig.root.rotation.y=member.baseYaw;member.gait+=speed*gaitDt*12;
 member.rig.update(time,speed,action,'focused',member.gait,poseDt,{...relativeAttention(member,travelTarget,.02),age,performance:performanceName});member.state=speed?'종이를 몸 가까이 들고 짧게 걷기':action==='pickup'?'무릎부터 접어 종이 줍기':'바닥에 놓인 종이를 읽기';
}

function resize(){if(!renderer||!camera)return;const rect=host.getBoundingClientRect();if(!rect.width||!rect.height)return;renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));renderer.setSize(rect.width,rect.height,false);camera.aspect=rect.width/rect.height;camera.updateProjectionMatrix();}
function formatTime(value){const whole=Math.floor(value%180);return `${String(Math.floor(whole/60)).padStart(2,'0')}:${String(whole%60).padStart(2,'0')} / 03:00`;}

function renderFrame(now){
 raf=requestAnimationFrame(renderFrame);const dt=Math.min(.05,(now-last)/1000||0);last=now;if(document.hidden||!visible)return;if(!paused)clock=(clock+dt)%180;
 const dustMember=castByKey.get('dust'),poseDt=paused?Infinity:dt,motionDt=paused?manualDelta:dt,beat=updateHowl(castByKey.get('howl'),clock,poseDt);updateKitty(castByKey.get('kitty'),clock,poseDt);updateKuromi(castByKey.get('kuromi'),clock,poseDt);updateDust(dustMember,clock,poseDt,motionDt);updateChococat(castByKey.get('chococat'),clock,poseDt,dustMember);manualDelta=0;
 elapsed.textContent=formatTime(clock);beatKicker.textContent=`하울 · ${String(beat.index+1).padStart(2,'0')} / 05`;beatLabel.textContent=beat.item.label;beatCopy.textContent=beat.item.copy;renderer.render(scene,camera);
}

function setPaused(value){paused=value;playToggle.setAttribute('aria-pressed',String(paused));playToggle.querySelector('span').textContent=paused?'움직임 재생':'움직임 정지';}
function focus(key){const target=focusTargets[key]||focusTargets.all;world.style.setProperty('--view-scale',target[0]);world.style.setProperty('--origin-x',target[1]);world.style.setProperty('--origin-y',target[2]);document.querySelectorAll('[data-focus]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.focus===key)));}

function actorSnapshot(member){
 const bounds=new T.Box3().setFromObject(member.rig.root),corners=[];
 for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z])corners.push(screenOf(new T.Vector3(x,y,z)));
 const foot=screenOf(member.position),head=screenOf(member.position.clone().add(new T.Vector3(0,member.height,0)));
 return {key:member.key,state:member.state,world:member.position.toArray(),height:member.height,rootY:member.rig.root.position.y,support:member.support,foot,head,screenHeight:Math.abs(head.y-foot.y),baseYaw:member.baseYaw,bounds:{left:Math.min(...corners.map(p=>p.x)),right:Math.max(...corners.map(p=>p.x)),top:Math.min(...corners.map(p=>p.y)),bottom:Math.max(...corners.map(p=>p.y))}};
}

async function init(){
 renderer=new T.WebGLRenderer({alpha:true,antialias:true,premultipliedAlpha:true});renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;renderer.setClearColor(0x000000,0);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;host.append(renderer.domElement);
 scene=new T.Scene();camera=new T.PerspectiveCamera(CAMERA.fov,2752/1536,CAMERA.near,CAMERA.far);camera.position.set(...CAMERA.position);camera.lookAt(...CAMERA.target);camera.updateMatrixWorld();raycaster=new T.Raycaster();
 scene.add(new T.HemisphereLight(0xffedd0,0x4f5149,1.72));const sun=new T.DirectionalLight(0xffdfad,3.35);sun.position.set(-7,9,7);sun.target.position.set(0,0,-2);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-12;sun.shadow.camera.right=12;sun.shadow.camera.top=12;sun.shadow.camera.bottom=-12;sun.shadow.camera.near=.1;sun.shadow.camera.far=35;sun.shadow.bias=-.00025;scene.add(sun,sun.target);const fill=new T.DirectionalLight(0xd9e5ee,.42);fill.position.set(6,4,7);scene.add(fill);
 try{
  await preload(count=>{loading.textContent=`기존 캐릭터 자산을 불러오는 중 · ${count} / 4`;});for(const key of Object.keys(CAST))addActor(key);buildSpatialProxies();
  const depthProbe=query.get('depthProbe');
  if(depthProbe){
   const depthOffsets={front:1.0,middle:.25,behind:-1.8},member=castByKey.get('howl');
   member.position.copy(spatial.tableCenter).add(new T.Vector3(0,0,depthOffsets[depthProbe]??depthOffsets.front));member.rig.root.position.copy(member.position);member.baseYaw=0;member.rig.root.rotation.y=0;
  }
  resize();loading.hidden=true;setPaused(paused);focus(query.get('focus')||'all');raf=requestAnimationFrame(renderFrame);
 }catch(error){loading.textContent='캐릭터 자산을 불러오지 못했습니다. 공간 탐색에서 정지 장면을 확인해 주세요.';console.error('Spatial previs failed',error);}
}

playToggle.addEventListener('click',()=>setPaused(!paused));document.querySelectorAll('[data-focus]').forEach(button=>button.addEventListener('click',()=>focus(button.dataset.focus)));stage.addEventListener('keydown',event=>{if(event.code==='Space'){event.preventDefault();setPaused(!paused);}});reduced.addEventListener('change',event=>{if(event.matches)setPaused(true);});new ResizeObserver(resize).observe(host);new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=performance.now();},{rootMargin:'100px'}).observe(stage);document.addEventListener('visibilitychange',()=>{last=performance.now();});window.addEventListener('pagehide',()=>cancelAnimationFrame(raf));

window.motionPrevis={get ready(){return cast.length===5;},get paused(){return paused;},get time(){return clock;},get cameraType(){return camera?.type;},setTime(value){clock=((Number(value)||0)%180+180)%180;manualDelta=0;},advance(delta){manualDelta=Math.max(0,Number(delta)||0);clock=(clock+manualDelta)%180;},setPaused,focus,snapshot(){return {ready:cast.length===5,paused,time:clock,camera:{type:camera?.type,fov:camera?.fov,position:camera?.position.toArray()},shadows:renderer?.shadowMap.enabled,actors:cast.map(actorSnapshot)}}};
if(query.has('paused'))paused=true;focus(query.get('focus')||'all');init();
