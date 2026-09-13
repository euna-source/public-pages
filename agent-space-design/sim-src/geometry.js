import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {tactile} from './materials.js';
import {enrichWorld} from './furnishings.js';
export const materials={};
const woods=new Set(['#c9a77c','#ddbd91','#d9b88e','#e3c59e','#d6b18a','#b68d5e','#d4b388','#ae855c','#dfc9a2','#c4a580','#dbbf96','#ba9468','#c5a37b','#d5bea0','#c6af87','#806146']);
const plasters=new Set(['#f0e4cd','#f3e8d6','#e0d0b5']);
export function mat(color){
 if(materials[color])return materials[color];
 if(woods.has(color)){const tint=new T.Color(color).lerp(new T.Color('#fffaf1'),.72);return materials[color]=tactile('wood-grain','#'+tint.getHexString());}
 if(plasters.has(color))return materials[color]=tactile('plaster','#fff9ef');
 return materials[color]=new T.MeshStandardMaterial({color,roughness:.82});
}
export function box(parent,x,y,z,w,h,d,color,r=.04){const geo=r?new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/3,h/3,d/3)):new T.BoxGeometry(w,h,d);
 if(woods.has(color)){const p=geo.attributes.position,n=geo.attributes.normal,uv=geo.attributes.uv;for(let i=0;i<p.count;i++){const nx=Math.abs(n.getX(i)),ny=Math.abs(n.getY(i)),nz=Math.abs(n.getZ(i));if(ny>nx&&ny>nz)uv.setXY(i,(p.getZ(i)+z)*.24,(p.getX(i)+x)*.14);else uv.setXY(i,(nx>nz?p.getZ(i)+z:p.getX(i)+x)*.75,(p.getY(i)+y)*.37);}}
 const o=new T.Mesh(geo,mat(color));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
export function ball(parent,x,y,z,r,color,s=[1,1,1]){const o=new T.Mesh(new T.SphereGeometry(r,20,14),mat(color));o.position.set(x,y,z);o.scale.set(...s);o.castShadow=true;parent.add(o);return o;}
export function cylinder(parent,x,y,z,r,h,color){const o=new T.Mesh(new T.CylinderGeometry(r,r,h,48),mat(color));o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
export function line(parent,points,color,r=.018){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));const o=new T.Mesh(new T.TubeGeometry(curve,Math.max(8,points.length*4),r,5,false),mat(color));parent.add(o);return o;}
export function paper(parent,x,y,z,color='#f5ecdb',angle=0){const g=new T.Group();g.position.set(x,y,z);g.rotation.y=angle;parent.add(g);box(g,0,0,0,.42,.025,.31,color,.005);for(let i=0;i<4;i++)box(g,-.025,.017,-.09+i*.05,.26-i*.015,.004,.008,'#968d79',0);return g;}
export function book(parent,x,y,z,color='#608477',angle=0){const g=new T.Group();g.position.set(x,y,z);g.rotation.y=angle;parent.add(g);box(g,0,0,0,.34,.10,.44,color,.013);box(g,.008,.005,.006,.32,.066,.42,'#eee4ce',.008);box(g,0,.058,0,.35,.018,.45,color,.008);return g;}
export const obstacles=[];
export function makeWorld(scene){const root=new T.Group();scene.add(root);
 const floor=cylinder(root,0,-.19,0,1,.36,'#c9a77c');floor.scale.set(6.7,1,4.65);
 // Individually laid boards stay inside the oval; a shallow base keeps the edge continuous.
 for(let z=-4.48,row=0;z<=4.48;z+=.23,row++){const half=6.62*Math.sqrt(Math.max(0,1-z*z/20.65));if(half<.2)continue;box(root,0,.001,z,half*2,.025,.227,['#ddbd91','#d9b88e','#e3c59e','#d6b18a'][row%4],.008);for(let x=-half+(.8*(row%3));x<half-.05;x+=1.7)box(root,x,.017,z,.008,.001,.217,'#bea580',0);}
 function wallArc(cx,cz,r,start,end,color){const shape=new T.Shape();const n=64;for(let i=0;i<=n;i++){const a=start+(end-start)*i/n,x=cx+r*Math.cos(a),z=cz+r*Math.sin(a);if(i===0)shape.moveTo(x,z);else shape.lineTo(x,z);}for(let i=n;i>=0;i--){const a=start+(end-start)*i/n;shape.lineTo(cx+(r+.18)*Math.cos(a),cz+(r+.18)*Math.sin(a));}shape.closePath();const geo=new T.ExtrudeGeometry(shape,{depth:2.8,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.06,bevelThickness:.05,curveSegments:32});geo.rotateX(Math.PI/2);const mesh=new T.Mesh(geo,mat(color));mesh.position.y=2.8;mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);}
 wallArc(-3,-.4,2.8,Math.PI,Math.PI*1.80,'#f0e4cd');wallArc(3,-.4,2.8,Math.PI*1.28,Math.PI*2,'#f3e8d6');
 const colors=['#63806c','#9e6757','#d3b46c','#547583','#c3a287','#a3a477'];
 // Curved library, open towards the central conversation and the front corridor.
 for(let j=0;j<8;j++){const a=Math.PI*1.03+j*.105*Math.PI,x=-3+2.53*Math.cos(a),z=-.4+2.53*Math.sin(a);const shelf=new T.Group();shelf.position.set(x,0,z);shelf.rotation.y=-a-Math.PI/2;root.add(shelf);box(shelf,0,1.28,-.12,.79,2.56,.18,'#b68d5e');for(let k=0;k<5;k++){const y=.16+k*.51;box(shelf,0,y,.03,.8,.065,.38,'#d4b388');if(k<4)for(let b=0;b<6;b++){
 const varied=(j*7+k*3+b*11)%5,h=.25+varied*.035;
 if((j+k)%4===1&&b>3){if(b===4)for(let stack=0;stack<3;stack++){const v=book(shelf,.26,y+.09+stack*.075,.035,colors[(j+k+stack)%6],stack*.06);v.scale.set(.55,.7,.62);}continue;}
 if((j*3+k)%7===0&&b===2)continue;
 const o=box(shelf,-.3+b*.115,y+.045+h/2,.03,.085,h,.23,colors[(j+k+b)%6],.008);o.rotation.z=(b===3?.09:b===4?-.025:0);
 if((j+k+b)%3!==0){for(const yy of [-h*.31,h*.31])box(o,0,yy,.12,.054,.009,.004,'#c5ac76',0);}
 if((j+k+b)%5===0)box(o,0,.005,.121,.041,.056,.004,'#d3c5a3',0);
 }}if(j%3===0){for(let q=0;q<2;q++){const chest=box(shelf,-.19+q*.37,2.36,.035,.30,.29,.27,['#84917b','#b69a75'][q],.016);box(chest,0,0,.14,.09,.055,.006,'#dccba5',.003);}}else if(j%3===1){for(let q=0;q<3;q++){const v=book(shelf,0,2.25+q*.095,.025,colors[(j+q)%6],q*.09);v.scale.set(1,.78,.66);}}for(const xx of [-.4,.4])box(shelf,xx,1.28,0,.065,2.56,.39,'#d4b388');}
 function arch(x,z,width=1.25){const g=new T.Group();g.position.set(x,0,z);root.add(g);for(const xx of [-width/2,width/2])box(g,xx,.77,0,.13,1.55,.23,'#e0d0b5');const curve=[];for(let i=0;i<=30;i++){const a=i/30*Math.PI;curve.push([Math.cos(a)*width/2,1.5+Math.sin(a)*width/2,0]);}line(g,curve,'#e0d0b5',.083);return g;}
 arch(2.25,-2.66,1.5);arch(4.15,-2.02,1.2).rotation.y=-.4;arch(5.25,-.7,1).rotation.y=-.8;
 // Muted rose piano and a real keyboard, tucked into the large arch.
 const piano=new T.Group();piano.position.set(2.25,0,-2.52);root.add(piano);box(piano,0,.73,0,1.35,1.45,.48,'#a66b64',.1);box(piano,0,.65,.36,1.48,.17,.45,'#b77d70');for(let i=0;i<18;i++){box(piano,-.65+i*.076,.75,.43,.069,.05,.29,'#f8f0dd',.005);if(![2,6,9,13,16].includes(i))box(piano,-.61+i*.076,.796,.34,.036,.045,.14,'#393b34',.004);}paper(piano,0,1.26,.29,'#f3e7cf');box(piano,0,.35,.9,.62,.12,.37,'#af7866');for(const x of [-.23,.23])box(piano,x,.17,.9,.065,.35,.25,'#98634f');obstacles.push({x:2.25,z:-2.35,w:1.6,d:1.2});
 function desk(x,z,w,d,color){const g=new T.Group();g.position.set(x,0,z);g.scale.y=.68;root.add(g);box(g,0,.77,0,w,.16,d,color,.07);for(const xx of [-w/2+.14,w/2-.14])for(const zz of [-d/2+.13,d/2-.13])box(g,xx,.38,zz,.13,.76,.13,color);obstacles.push({x,z,w:w+.12,d:d+.12});paper(g,-.22,.866,0);book(g,w/2-.3,.90,-d/2+.25,'#7b927b');const cup=cylinder(g,-w/2+.27,.94,-d/2+.24,.07,.18,'#faf0d9');return g;}
 desk(-3.7,.45,1.5,.76,'#ae855c');desk(3.6,.5,1.55,.8,'#dfc9a2');desk(4.05,2.45,1.65,.8,'#b8a3bd');desk(-3.25,2.5,1.6,.72,'#c4a580');
 const table=cylinder(root,0,.58,-.5,1.15,.13,'#dbbf96');cylinder(root,0,.28,-.5,.32,.56,'#ba9468');obstacles.push({x:0,z:-.5,r:1.3});for(let i=0;i<4;i++){const a=i/4*Math.PI*2;paper(root,Math.sin(a)*.68,.652,-.5+Math.cos(a)*.68,'#fff5df',-a);}
 function stool(x,z,color){cylinder(root,x,.43,z,.27,.12,color);for(let i=0;i<3;i++){let a=i/3*Math.PI*2;box(root,x+Math.cos(a)*.18,.2,z+Math.sin(a)*.18,.065,.4,.065,color);}}
 stool(-4.12,1.25,'#c5a37b');stool(4.25,1.25,'#d5bea0');stool(4.8,2.55,'#b09bb8');
 // Task shelves and plants give the corridor a rhythm without blocking the route.
 desk(-.55,-2.95,1.1,.5,'#c6af87');

 enrichWorld(root,scene);
 // Static furnishings share a handful of draw calls; characters keep their independent joints.
 root.updateMatrixWorld(true);const batches=new Map();root.traverse(o=>{if(!o.isMesh)return;const geo=(o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone()).applyMatrix4(o.matrixWorld);if(!batches.has(o.material))batches.set(o.material,[]);batches.get(o.material).push(geo);});root.clear();for(const [material,geos]of batches){const merged=mergeGeometries(geos,false),mesh=new T.Mesh(merged,material);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);for(const g of geos)g.dispose();}
 return root;
}
