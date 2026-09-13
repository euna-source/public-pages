import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone} from 'three/addons/utils/SkeletonUtils.js';
import {dust} from './dust.js';
import {cleanSurface,softenNormals} from './surface.js';
import {expressions} from './expressions.js';
import {performance} from './acting.js';
import {rigCat} from './rig.js';
import {rigCoat} from './coat.js';
import {box,line} from './geometry.js';

const V=()=>new T.Vector3(),Q=()=>new T.Quaternion();
const templates=new Map(),loader=new GLTFLoader();
export async function preload(onProgress){
 let loaded=0;
 await Promise.all(['howl','kitty','kuromi','chococat'].map(async key=>{
  templates.set(key,await loader.loadAsync(`assets/3d/${key}.glb`));onProgress(++loaded);
 }));
}
function aim(bone,child,target){
 if(!bone||!child)return;
 bone.updateWorldMatrix(true,true);
 const origin=bone.getWorldPosition(V()),from=child.getWorldPosition(V()).sub(origin).normalize(),to=target.clone().sub(origin).normalize();
 if(!from.lengthSq()||!to.lengthSq())return;
 const delta=Q().setFromUnitVectors(from,to),world=bone.getWorldQuaternion(Q()).premultiply(delta);
 bone.quaternion.copy(bone.parent.getWorldQuaternion(Q()).invert().multiply(world));bone.updateWorldMatrix(false,true);
}
function ik(root,a,b,c,localTarget,pole){
 if(!a||!b||!c)return;
 root.updateWorldMatrix(true,true);
 const origin=a.getWorldPosition(V()),middle=b.getWorldPosition(V()),end=c.getWorldPosition(V()),target=root.localToWorld(localTarget.clone());
 const upper=origin.distanceTo(middle),lower=middle.distanceTo(end),direction=target.clone().sub(origin);
 const distance=T.MathUtils.clamp(direction.length(),Math.abs(upper-lower)+.001,(upper+lower)*.992);direction.normalize();
 const bendDirection=root.localToWorld(pole.clone()).sub(origin);bendDirection.addScaledVector(direction,-bendDirection.dot(direction)).normalize();
 const along=(upper*upper+distance*distance-lower*lower)/(2*distance),bend=Math.sqrt(Math.max(0,upper*upper-along*along));
 const elbow=origin.clone().addScaledVector(direction,along).addScaledVector(bendDirection,bend);
 aim(a,b,elbow);aim(b,c,origin.clone().addScaledVector(direction,distance));
}
function documents(root,height,key){
 const prop=new T.Group();root.add(prop);
 const sheet=new T.Group();prop.add(sheet);
 box(sheet,0,0,0,height*.29,height*.22,.009,'#ede1c8',.005);
 for(let i=0;i<5;i++)box(sheet,-height*.008,height*(.07-i*.035),.007,height*(.22-(i%3)*.025),.003,.003,'#8b8d77',0);
 const book=new T.Group();prop.add(book);
 for(const side of [-1,1]){
  const page=new T.Group();page.position.x=side*height*.076;page.rotation.y=-side*.14;book.add(page);
  box(page,0,0,-.008,height*.154,height*.225,.016,key==='howl'?'#6d7c65':'#a3856c',.004);
  box(page,0,.003,.004,height*.146,height*.211,.015,'#eadfc9',.002);
  for(let i=0;i<6;i++)box(page,0,height*(.075-i*.029),.014,height*(.10-(i%3)*.012),.0025,.002,'#99917c',0);
 }
 box(book,.013,-height*.072,.019,.012,height*.14,.003,'#aa7064',0);
 const glass=new T.Group();root.add(glass);
 const ring=new T.Mesh(new T.TorusGeometry(height*.060,.010,8,24),new T.MeshStandardMaterial({color:0x645c60,roughness:.72}));glass.add(ring);
 line(glass,[[0,-height*.06,0],[.025,-height*.17,0]],'#645c60',.012);
 const pen=line(root,[[0,0,0],[.02,.13,.018]],'#77685b',.009);
 return {prop,sheet,book,glass,pen};
}

export function actor(key,height=1.1){
 if(key==='dust')return dust();
 const root=new T.Group(),source=templates.get(key).scene;
 source.updateMatrixWorld(true);
 let model=clone(source);
 if(key!=='howl')model=rigCat(model,height,key);
 else{
  const bounds=new T.Box3().setFromObject(source),size=bounds.getSize(V()),centre=bounds.getCenter(V()),scale=height/size.y;
  model.scale.multiplyScalar(scale);model.position.set(-centre.x*scale,-bounds.min.y*scale,-centre.z*scale);
 }
 root.add(model);root.updateMatrixWorld(true);if(key==='howl')rigCoat(model,root,height);
 const baseY=model.position.y,bones={},rest=[];
 model.traverse(o=>{
  if(o.isBone){bones[o.name]=o;rest.push([o,o.quaternion.clone()]);}
  if(o.isMesh){
   o.material=o.material.clone();o.material.emissive?.set(0);o.material.emissiveMap=null;
   o.geometry=softenNormals(cleanSurface(o.geometry,o.material));
   o.material.roughness=.92;o.material.metalness=0;o.castShadow=true;o.receiveShadow=true;
  }
 });
 const faceMotion=expressions(model,height,key,root),head=bones.Head;
 const anchor={},footRotation={};
 for(const name of ['LeftArm','RightArm','LeftUpLeg','RightUpLeg'])if(bones[name])anchor[name]=root.worldToLocal(bones[name].getWorldPosition(V()));
 for(const side of ['Left','Right'])footRotation[side]=root.getWorldQuaternion(Q()).invert().multiply(bones[side+'Foot'].getWorldQuaternion(Q()));
 const props=documents(root,height,key),{prop,sheet,book,glass,pen}=props;
 const tailRest=bones.Tail?.position.clone();
 let poseState=null;
 return {root,bones,prop,getPerformance(){return poseState;},update(t,speed,action,expression,gait,dt=1/60,attention={yaw:0,pitch:0}){
  const previous=new Map(rest.map(([bone])=>[bone,bone.quaternion.clone()]));
  for(const [bone,rotation]of rest)bone.quaternion.copy(rotation);
  const walk=Math.min(1,speed/.65),phase=gait??t*7.7,age=attention.age||0;
  const perf=performance(attention.performance||'',age,key);poseState=perf;
  const isWorking=['read','write','verify','file','carry','present','challenge','pickup'].includes(action);
  const lower=perf.lower*height;
  model.position.y=baseY-lower-perf.breath+Math.abs(Math.sin(phase))*.008*walk;
  if(perf.name)expression=perf.face;
  const spines=['Spine02','Spine01','Spine'].map(name=>bones[name]).filter(Boolean);
  for(const spine of spines){spine.rotateX((perf.lean+Math.sin(phase)*.02*walk)/spines.length);spine.rotateZ((perf.side+Math.sin(phase)*.022*walk)/spines.length);}
  if(head){
   head.rotateX(perf.head+(['read','verify','write'].includes(action)?.08:action==='agree'?Math.sin(t*4)*.045:0)-attention.pitch*.25);
   head.rotateY(attention.yaw*.65);head.rotateZ(perf.headSide+(expression==='curious'?Math.sin(t*.65)*.045:0));
  }
  const blend=Number.isFinite(dt)?1-Math.exp(-dt*12):1;
  for(const bone of [...spines,head].filter(Boolean)){const desired=bone.quaternion.clone();bone.quaternion.copy(previous.get(bone)).slerp(desired,blend);}
  root.updateWorldMatrix(true,true);

  for(const [side,prefix,offset]of [[1,'Left',0],[-1,'Right',Math.PI]]){
   const hip=anchor[prefix+'UpLeg'],foot=bones[prefix+'Foot'];
   const step=((phase+offset)%(Math.PI*2)+Math.PI*2)%(Math.PI*2),stride=Math.PI/(key==='howl'?11:18);
   const swing=step<Math.PI,u=(swing?step:step-Math.PI)/Math.PI;
   const smooth=u*u*(3-2*u),forward=(swing?-stride/2+stride*smooth:stride/2-stride*u)*walk;
   const lift=(swing?Math.sin(u*Math.PI):0)*(key==='howl'?.065:.04)*walk;
   const footTarget=new T.Vector3(hip.x,key==='howl'?.085:height*.026,forward+(key==='howl'?0:.018*height));
   footTarget.y+=lift;footTarget.z+=perf.crouch*height*(key==='howl'?.18:.06);
   footTarget.lerp(new T.Vector3(-side*height*.105,footTarget.y,height*(key==='howl'?.18:.13)),perf.cross);
   const pole=new T.Vector3(hip.x,height*.20,height*.44);
   pole.lerp(new T.Vector3(side*height*.40,height*.08,height*.06),perf.cross);
   ik(root,bones[prefix+'UpLeg'],bones[prefix+'Leg'],foot,footTarget,pole);
   // Feet retain their sole orientation while knees fold; they do not point through the floor.
   const yaw=Q().setFromAxisAngle(new T.Vector3(0,1,0),side*perf.cross*.55);
   const orientation=root.getWorldQuaternion(Q()).multiply(yaw).multiply(footRotation[prefix]);
   foot.quaternion.copy(foot.parent.getWorldQuaternion(Q()).invert().multiply(orientation));

   const shoulder=anchor[prefix+'Arm'];
   const handTarget=shoulder.clone();handTarget.x+=side*height*.015;
   handTarget.y-=height*(key==='howl'?.225:.145)+lower;
   handTarget.z+=height*.055+Math.sin(phase+offset)*height*.06*walk;
   if(isWorking&&perf.prop){
    handTarget.set(side*height*.12,height*(key==='howl'?.635:key==='kuromi'?.29:.385)-lower,height*(key==='howl'?.20:.19));
    if(action==='present'&&side===1){const gesture=Math.sin(Math.min(1,Math.max(0,(age%5.2-.4)/1.2))*Math.PI);handTarget.x+=height*.11*gesture;handTarget.y+=height*.08*gesture;}
    if(action==='challenge'&&side===-1){handTarget.x-=height*.08;handTarget.y+=height*.09;}
    if(action==='write'&&side===-1){handTarget.x+=Math.sin(t*10)*height*.012;handTarget.z+=Math.cos(t*7)*height*.009;}
   }
   if(perf.hand>0&&side===1&&key!=='howl'){handTarget.x+=height*.06*perf.hand;handTarget.y-=height*.08*perf.hand;}
   if(perf.cross>0)handTarget.lerp(new T.Vector3(side*height*.17,height*(key==='howl'?.25:.13),height*.19),perf.cross);
   if(perf.idea>0&&side===-1)handTarget.lerp(new T.Vector3(-height*(key==='howl'?.18:.30),shoulder.y+height*(key==='howl'?.045:.08),height*(key==='howl'?.22:.10)),perf.idea);
   if(perf.hand>0&&side===-1&&head){
    let contact;
    if(perf.contact==='paper')contact=new T.Vector3(-height*.07,key==='howl'?.085:.055,height*.235);
    else{
     const local=perf.contact==='chin'?(key==='howl'?[-.014,-.024,.065]:[-.09,.005,.185]):(key==='howl'?[-.045,.065,.052]:[-.19,.065,.165]);
     contact=new T.Vector3(...local).multiplyScalar(height);
     contact.applyQuaternion(root.getWorldQuaternion(Q()).invert().multiply(head.getWorldQuaternion(Q())));
     contact.add(root.worldToLocal(head.getWorldPosition(V())));
    }
    handTarget.lerp(contact,perf.hand);
   }
   const poleArm=new T.Vector3(side*height*.22,shoulder.y-height*.20-lower,height*.17);
   ik(root,bones[prefix+'Arm'],bones[prefix+'ForeArm'],bones[prefix+'Hand'],handTarget,poleArm);
   for(const name of ['Arm','ForeArm','Hand']){const bone=bones[prefix+name],desired=bone.quaternion.clone();bone.quaternion.copy(previous.get(bone)).slerp(desired,blend);}
  }
  if(bones.CoatTail)bones.CoatTail.rotation.x=perf.cross*.50+perf.crouch*.20;
  if(bones.Tail){bones.Tail.position.y=tailRest.y+lower*.85;bones.Tail.rotation.y=Math.sin(t*.8)*.12;}
  if(key==='chococat'){
   for(const [name,side]of [['LeftEar',1],['RightEar',-1]]){bones[name].rotation.z=-side*.05+attention.yaw*.12; bones[name].rotation.x=attention.pitch*.25+(expression==='brooding'?-.07:0);}
  }
  root.updateWorldMatrix(true,true);
  prop.visible=isWorking&&perf.prop;sheet.visible=action!=='read'||perf.name==='pickup';book.visible=!sheet.visible;
  prop.position.set(0,height*(key==='howl'?.59:key==='kuromi'?.28:.37)-lower,height*(key==='howl'?.245:.235));
  if(perf.idea>0&&key!=='howl'){prop.position.x+=height*.065*perf.idea;prop.position.y-=height*.035*perf.idea;}
  if(perf.hand>0&&key!=='howl'){prop.position.x+=height*.08*perf.hand;prop.position.y-=height*.10*perf.hand;}
  prop.rotation.set(action==='read'?-.55:-.10,0,action==='challenge'?-.12:0);
  if(perf.name==='pickup'){
   prop.visible=true;
   if(perf.paper==='ground'){prop.position.set(-height*.055,.029,height*.25);prop.rotation.set(-Math.PI/2,0,-.18);}
   else{prop.position.copy(root.worldToLocal(bones.RightHand.getWorldPosition(V()))).add(new T.Vector3(.015,-.012,.035));prop.rotation.x=-Math.PI/2+(1-perf.hand)*1.35;}
  }
  glass.visible=action==='verify'&&isWorking;
  glass.position.copy(root.worldToLocal(bones.RightHand.getWorldPosition(V()))).add(new T.Vector3(0,height*.14,.035));glass.rotation.z=-.15+Math.sin(t*.9)*.03;
  pen.visible=action==='write';pen.position.copy(root.worldToLocal(bones.RightHand.getWorldPosition(V()))).add(new T.Vector3(-.008,-.045,.026));pen.rotation.z=.25;
  faceMotion.update(t,expression,action,dt,attention);
 }};
}
