import * as T from 'three';
import {ball,box,mat} from './geometry.js';
import {performance} from './acting.js';

const V=()=>new T.Vector3();
function limb(root,radius){
 const count=13,sides=6,positions=new Float32Array((count+1)*(sides+1)*3),indices=[];
 for(let i=0;i<count;i++)for(let j=0;j<sides;j++){const a=i*(sides+1)+j,b=a+sides+1;indices.push(a,b,a+1,a+1,b,b+1);}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(positions,3));geo.setIndex(indices);
 const mesh=new T.Mesh(geo,mat('#252623'));mesh.castShadow=true;root.add(mesh);
 const hand=ball(root,0,0,0,radius*1.75,'#252623',[1,.75,1]);
 return {mesh,hand,set(start,bend,end){
  const curve=new T.QuadraticBezierCurve3(start,bend.clone().multiplyScalar(2).sub(start.clone().add(end).multiplyScalar(.5)),end);
  const p=geo.attributes.position;
  for(let i=0;i<=count;i++){
   const t=i/count,point=curve.getPoint(t),tangent=curve.getTangent(t),normal=new T.Vector3(0,0,1).cross(tangent).normalize();
   if(normal.lengthSq()<.01)normal.set(1,0,0);const binormal=tangent.clone().cross(normal).normalize();
   for(let j=0;j<=sides;j++){const a=j/sides*Math.PI*2,v=point.clone().addScaledVector(normal,Math.cos(a)*radius).addScaledVector(binormal,Math.sin(a)*radius);p.setXYZ(i*(sides+1)+j,v.x,v.y,v.z);}
  }
  p.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingSphere();hand.position.copy(end);
 }};
}
function elbow(start,end,pole,upper=.235,lower=.235){
 const dir=end.clone().sub(start),distance=Math.min(upper+lower-.005,dir.length());dir.normalize();
 const normal=pole.clone().sub(start).addScaledVector(dir,-pole.clone().sub(start).dot(dir)).normalize();
 const along=(upper*upper+distance*distance-lower*lower)/(2*distance);
 return start.clone().addScaledVector(dir,along).addScaledVector(normal,Math.sqrt(Math.max(.0001,upper*upper-along*along)));
}
export function dust(){
 const root=new T.Group(),body=new T.Group();body.position.y=.56;root.add(body);
 ball(body,0,0,0,.33,'#252623');
 const hairCount=3600,fur=new T.InstancedMesh(new T.ConeGeometry(.0012,.033,3),mat('#292925'),hairCount);
 const dummy=new T.Object3D(),up=new T.Vector3(0,1,0);
 for(let i=0;i<hairCount;i++){
  const y=1-2*(i+.5)/hairCount,a=i*2.39996,v=new T.Vector3(Math.sqrt(1-y*y)*Math.cos(a),y,Math.sqrt(1-y*y)*Math.sin(a));
  dummy.position.copy(v).multiplyScalar(.332);dummy.quaternion.setFromUnitVectors(up,v);const eyeArea=v.z>.70&&Math.abs(Math.abs(v.x)-.35)<.29&&v.y>-.25&&v.y<.48;dummy.scale.set(1,eyeArea?0:.65+((i*73)%101)/180,1);dummy.updateMatrix();fur.setMatrixAt(i,dummy.matrix);
  fur.setColorAt(i,new T.Color(['#252623','#2c2d27','#33332a'][i%3]));
 }
 body.add(fur);
 const eyes=[],pupils=[],creases=[];
 for(const side of [-1,1]){
  const eye=ball(body,side*.117,.035,.295,.088,'#ede8d7',[.83,1.13,.45]);eyes.push(eye);
  const pupil=ball(body,side*.117,.028,.336,.034,'#20211e',[.77,1,.32]);pupils.push(pupil);
  const crease=limb(body,.004);crease.set(new T.Vector3(side*.117-.056,.033,.332),new T.Vector3(side*.117,.027,.341),new T.Vector3(side*.117+.056,.033,.332));crease.hand.visible=false;crease.mesh.visible=false;
  creases.push(crease);
 }
 const arms=[limb(root,.014),limb(root,.014)],legs=[limb(root,.019),limb(root,.019)];
 for(const leg of legs)leg.hand.scale.set(.65,.45,1.55);
 const parcel=new T.Group();root.add(parcel);
 box(parcel,0,0,0,.31,.22,.016,'#d6c39b',.008);for(let i=0;i<5;i++)box(parcel,-.01,.070-i*.031,.010,.23-(i%3)*.018,.004,.003,'#887d61',0);
 let poseState=null;
 return {root,prop:parcel,getPerformance(){return poseState;},update(t,speed,action,expression,gait,dt=1/60,attention={yaw:0,pitch:0}){
  const walk=Math.min(1,speed/.6),phase=gait??t*10,perf=performance(attention.performance||'',attention.age||0,'dust');poseState=perf;
  if(perf.name)expression=perf.face;
  const crouch=perf.crouch,cross=perf.cross,previousBody=body.position.y,previousBodyX=body.position.x,previousRotation=body.rotation.clone();
  body.position.x=perf.side*.4*cross;
  body.position.y=.56+Math.abs(Math.sin(phase))*.017*walk-crouch*.13-cross*.18-perf.breath;
  body.rotation.set((action==='read'?.09:0)+perf.head*.45+perf.lean*.35,attention.yaw*.25,Math.sin(phase)*.025*walk+perf.side*.6+perf.headSide*.35);
  if(attention.recovering){body.position.x=T.MathUtils.damp(previousBodyX,body.position.x,12,dt);body.position.y=T.MathUtils.damp(previousBody,body.position.y,12,dt);for(const axis of ['x','y','z'])body.rotation[axis]=T.MathUtils.damp(previousRotation[axis],body.rotation[axis],12,dt);}
  const squeeze=expression==='disappointed'?.025:expression==='surprised'?-.018:0;
  body.scale.set(1+squeeze*.5,1-squeeze+perf.breath*.6,1+squeeze*.5);
  root.updateWorldMatrix(true,true);
  const bodyPoint=(x,y,z)=>root.worldToLocal(body.localToWorld(new T.Vector3(x,y,z)));
  for(let i=0;i<2;i++){
   const side=i?1:-1,p=(phase+i*Math.PI)%(Math.PI*2),swing=p<Math.PI,u=(swing?p:p-Math.PI)/Math.PI;
   const stride=Math.PI/15,forward=(swing?-stride/2+stride*u*u*(3-2*u):stride/2-stride*u)*walk;
   const foot=new T.Vector3(side*.13,.004+(swing?Math.sin(u*Math.PI)*.045:0)*walk,.09+forward);
   foot.lerp(new T.Vector3(-side*.16,.004,.27),cross);foot.z+=crouch*.08;
   const hip=bodyPoint(side*.13,-.24,0),knee=elbow(hip,foot,new T.Vector3(side*(.14+cross*.26),.10,.23),.18,.19);
   knee.lerp(new T.Vector3(side*.32,.065,.23),cross);legs[i].set(hip,knee,foot);
   const shoulder=bodyPoint(side*.28,-.09,.015);
   const hand=new T.Vector3(side*.33,body.position.y-.30,.095+Math.sin(phase+i*Math.PI)*.075*walk);
   const working=['read','write','carry','present','file','verify','pickup'].includes(action);
   if(working)hand.set(side*.15,body.position.y-.13,.40);
   if(action==='file'){hand.y+=.17;hand.z+=.035*Math.sin(t);}
   if(action==='present'&&i===0){hand.x-=.07;hand.y+=.07*Math.sin(Math.max(0,(t%4)-.5));}
   if(cross>0)hand.lerp(new T.Vector3(side*.22,.22,.26),cross);
   if(perf.idea>0&&i===0)hand.lerp(bodyPoint(-.23,.20,.30),perf.idea);
   if(perf.hand>0&&i===0){
    const target=perf.contact==='paper'?new T.Vector3(-.055,.021,.30):perf.contact==='chin'?bodyPoint(-.05,-.12,.35):bodyPoint(-.15,.18,.30);
    hand.lerp(target,perf.hand);
   }
   const bend=elbow(shoulder,hand,new T.Vector3(side*.42,body.position.y-.24,.13));arms[i].set(shoulder,bend,hand);
  }
  const cycle=t%5.8,blink=cycle<.14?Math.abs(cycle-.07)/.07:cycle>2.28&&cycle<2.40?Math.abs(cycle-2.34)/.06:1;
  const openness=expression==='brooding'?.52:expression==='disappointed'?.58:expression==='curious'?1.16:expression==='surprised'?1.25:expression==='focused'?.85:1.05;
  for(let i=0;i<2;i++){
   const side=i?1:-1,asym=expression==='brooding'?(i?.86:1.1):1;
   eyes[i].scale.y=Math.max(.025,blink*openness*asym);eyes[i].rotation.z=expression==='disappointed'?-side*.25:expression==='brooding'?side*.16:0;
   pupils[i].visible=blink>.10;pupils[i].scale.y=Math.max(.04,blink*openness*.88);
   pupils[i].position.x=side*.117+T.MathUtils.clamp(attention.yaw*.027,-.025,.025);
   pupils[i].position.y=.028+(['read','write'].includes(action)?-.015:0)+(expression==='disappointed'?-.011:0);
   // A short ink crease replaces the eye at the blink's closed instant.
   creases[i].mesh.visible=blink<.15;
  }
  parcel.visible=['read','write','carry','present','file','verify','pickup'].includes(action)&&perf.prop;
  parcel.position.set(0,body.position.y-.15,.45);parcel.rotation.set(action==='read'?-.38:-.08,0,0);
  if(perf.name==='pickup'){
   parcel.visible=true;
   const held=arms[0].hand.position.clone().add(new T.Vector3(.025,0,.035));parcel.position.set(-.035,-.006,.32).lerp(held,perf.pick);parcel.rotation.x=-Math.PI/2+(1-perf.hand)*1.35*perf.pick;
  }
 }};
}
