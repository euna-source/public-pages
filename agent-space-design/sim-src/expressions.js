import * as T from 'three';
import {faceShapes} from './face-shapes.js';
const configs={howl:{x:.023,y:.928,rx:.014,ry:.0055,mx:.020,my:.015,z:.030,skin:'#efd6b8'},kitty:{x:.145,y:.587,rx:.022,ry:.029,mx:.045,my:.049,z:.18,skin:'#f2eee5'},kuromi:{x:.126,y:.516,rx:.030,ry:.039,mx:.058,my:.069,z:.15,skin:'#f3e9e5'},chococat:{x:.142,y:.64,rx:.079,ry:.086,mx:.095,my:.108,z:.17,skin:'#211e1e'}};
export function expressions(root,height,key,space=root){const shapes=[];const conf=configs[key];if(!conf)return {update(){}};const uniforms={eyeOpen:{value:1},eyeSmile:{value:0},eyeLook:{value:new T.Vector2()},eyeSkin:{value:new T.Color(conf.skin)},eyeTilt:{value:0},eyeSad:{value:0},mouthSmile:{value:0},mouthOpen:{value:0}};
 root.updateMatrixWorld(true);root.traverse(mesh=>{if(!mesh.isMesh||!mesh.material.map)return;const pos=mesh.geometry.attributes.position,values=[];for(let i=0;i<pos.count;i++){const v=new T.Vector3();mesh.getVertexPosition(i,v);mesh.localToWorld(v);space.worldToLocal(v);values.push(v.x/height,v.y/height,v.z/height);}mesh.geometry.setAttribute('facePosition',new T.Float32BufferAttribute(values,3));shapes.push(faceShapes(mesh,values,height,key,space));
 mesh.material.onBeforeCompile=shader=>{Object.assign(shader.uniforms,uniforms);shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute vec3 facePosition; varying vec3 vFacePosition;').replace('#include <begin_vertex>','#include <begin_vertex>\nvFacePosition=facePosition;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vFacePosition; uniform float eyeOpen; uniform float eyeSmile; uniform vec2 eyeLook; uniform vec3 eyeSkin; uniform float eyeTilt; uniform float eyeSad; uniform float mouthSmile; uniform float mouthOpen;');shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
 vec2 eyeP=vec2(abs(vFacePosition.x)-${conf.x},vFacePosition.y-${conf.y});
 float front=smoothstep(${conf.z},${conf.z+.025},vFacePosition.z);
 float region=(1.-smoothstep(.86,1.,length(eyeP/vec2(${conf.mx},${conf.my}))))*front;
 vec3 faceInk=eyeSkin;
 vec2 gaze=eyeP-eyeLook*vec2(sign(vFacePosition.x),1.); gaze.y+=gaze.x*eyeTilt;
 float openHeight=max(.035,eyeOpen);
 ${key==='howl'?`float almond=pow(abs(eyeP.x)/${conf.rx},1.6)+pow(abs(eyeP.y)/(${conf.ry}*openHeight),2.);
 float rim=1.-smoothstep(.92,1.04,almond),whiteEye=1.-smoothstep(.79,.91,almond);
 faceInk=mix(faceInk,vec3(.16,.115,.09),rim);
 faceInk=mix(faceInk,vec3(.93,.915,.86),whiteEye);
 float iris=1.-smoothstep(.9,1.,length(gaze/vec2(.0048,.0048)));
 faceInk=mix(faceInk,vec3(.095,.145,.155),iris*whiteEye);
 float pupil=1.-smoothstep(.8,1.,length(gaze/vec2(.0025,.0030)));
 faceInk=mix(faceInk,vec3(.009),pupil*whiteEye);`:key==='chococat'?`float whiteEye=1.-smoothstep(.95,1.,length(eyeP/vec2(${conf.rx},${conf.ry}*openHeight)));
 faceInk=mix(faceInk,vec3(.93,.915,.86),whiteEye);
 float iris=1.-smoothstep(.9,1.,length((gaze+vec2(0.,.006))/(vec2(.032,.040)*vec2(1.,openHeight))));
 faceInk=mix(faceInk,vec3(.015),iris*whiteEye);`:`float ellipse=1.-smoothstep(.9,1.,length(gaze/vec2(${conf.rx},${conf.ry}*openHeight)));
 ${key==='kuromi'?`ellipse*=1.-smoothstep(.016,.024,gaze.y+gaze.x*.32);`:''}
 faceInk=mix(faceInk,vec3(.009),ellipse);`}
 float smileCurve=abs(eyeP.y-(${key==='howl'?'.0016':'.006'}-pow(eyeP.x/${conf.rx},2.)*${key==='howl'?'.0025':'.009'}));
 float smileLine=(1.-smoothstep(${key==='howl'?'.0006,.0013':'.002,.004'},smileCurve))*(1.-smoothstep(${conf.rx*.85},${conf.rx*1.1},abs(eyeP.x)));
 if(eyeSmile>.01){faceInk=mix(faceInk,mix(eyeSkin,${key==='chococat'?'vec3(.8,.77,.66)':'vec3(.015)'},smileLine),eyeSmile);}
 if(eyeOpen<.06){float closedLine=(1.-smoothstep(${key==='howl'?'.0004,.0012':'.0015,.0035'},abs(eyeP.y+.003+pow(eyeP.x/${conf.rx},2.)*.002)))*(1.-smoothstep(${conf.rx*.85},${conf.rx*1.1},abs(eyeP.x)));faceInk=mix(eyeSkin,${key==='chococat'?'vec3(.8,.77,.66)':'vec3(.018)'},closedLine);}
 diffuseColor.rgb=mix(diffuseColor.rgb,faceInk,region);
 ${key==='howl'?`vec2 mouthP=vec2(vFacePosition.x,vFacePosition.y-.885);
 float mouthRegion=(1.-smoothstep(.82,1.,length(mouthP/vec2(.030,.013))))*smoothstep(.047,.058,vFacePosition.z);
 float lipY=mouthSmile*(pow(mouthP.x/.022,2.)*.005-.0015);
 float lip=(1.-smoothstep(.0007,.0016,abs(mouthP.y-lipY)))*(1.-smoothstep(.019,.024,abs(mouthP.x)));
 float opening=(1.-smoothstep(.85,1.,length(mouthP/vec2(.009,max(.0001,mouthOpen*.007)))))*mouthOpen;
 vec3 lipColor=mix(eyeSkin,vec3(.18,.105,.074),max(lip*(1.-mouthOpen*.75),opening));
 diffuseColor.rgb=mix(diffuseColor.rgb,lipColor,mouthRegion);`:''}

 `);};mesh.material.customProgramCacheKey=()=>`role-eyes-${key}`;mesh.material.needsUpdate=true;});
 return {update(t,expression,action,dt=.05,attention={yaw:0,pitch:0}){for(const shape of shapes)shape.update(expression,dt);const blinkTime=t%4.1,blink=blinkTime<.16?Math.max(0,Math.abs(blinkTime-.08)/.08):1,target=expression==='disappointed'?.42:expression==='brooding'?.55:expression==='surprised'?(key==='howl'?1.55:1.3):expression==='focused'?.78:expression==='curious'?1.12:1;uniforms.eyeOpen.value=blink*target;uniforms.mouthSmile.value=T.MathUtils.damp(uniforms.mouthSmile.value,expression==='disappointed'?-.8:['relieved','pleased'].includes(expression)?.85:expression==='brooding'?-.35:0,7,dt);uniforms.mouthOpen.value=T.MathUtils.damp(uniforms.mouthOpen.value,expression==='surprised'?.7:0,10,dt);uniforms.eyeTilt.value=T.MathUtils.damp(uniforms.eyeTilt.value,expression==='disappointed'?.48:expression==='brooding'?-.34:0,8,dt);uniforms.eyeSmile.value=T.MathUtils.damp(uniforms.eyeSmile.value,['pleased','relieved'].includes(expression)&&blink>.2?.92:0,6,dt);uniforms.eyeLook.value.set(T.MathUtils.clamp(attention.yaw*.026,-.018,.018),['read','verify','write'].includes(action)?(key==='howl'?-.002:-.012):T.MathUtils.clamp(attention.pitch*.018,-.009,.009));}};
}
