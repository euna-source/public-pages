import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {box,ball,cylinder,line,book,paper,mat,obstacles} from './geometry.js';
import {tactile} from './materials.js';

const brass='#a17e43',darkWood='#806146',cream='#f5e7cd';
const moving=[];
function ring(parent,x,y,z,r,t,color,rotation=[Math.PI/2,0,0]){
 const o=new T.Mesh(new T.TorusGeometry(r,t,7,32),mat(color));o.position.set(x,y,z);o.rotation.set(...rotation);parent.add(o);return o;
}
function group(parent,x,y,z,angle=0){const g=new T.Group();g.position.set(x,y,z);g.rotation.y=angle;parent.add(g);return g;}
function cup(parent,x,y,z,color=cream){
 const g=group(parent,x,y,z);cylinder(g,0,.045,0,.062,.09,color);cylinder(g,0,.091,0,.051,.004,'#7b5b3e');
 ring(g,.066,.055,0,.034,.011,color,[0,Math.PI/2,0]);cylinder(g,0,-.008,0,.094,.012,color);return g;
}
function bottle(parent,x,y,z,color,height=.24){
 const g=group(parent,x,y,z);ball(g,0,height*.38,0,height*.27,color,[.75,1.4,.75]);cylinder(g,0,height*.81,0,height*.10,height*.3,color);
 cylinder(g,0,height,0,height*.12,.035,'#bca47c');box(g,0,height*.43,height*.205,height*.25,height*.20,.007,'#e8d8b7',.002);return g;
}
function potPlant(parent,x,y,z,scale=1,hanging=false){
 const g=group(parent,x,y,z);g.scale.setScalar(scale);
 const pot=new T.Mesh(new T.CylinderGeometry(.15,.11,.25,20),mat('#b77b60'));pot.position.y=.125;g.add(pot);cylinder(g,0,.253,0,.134,.008,'#665240');
 for(let n=0;n<9;n++){
  const a=n*2.4,r=.16+(n%3)*.04,top=hanging?-.15-(n%4)*.13:.46+(n%3)*.13;
  const points=[[0,.23,0],[Math.cos(a)*r*.6,.40,Math.sin(a)*r*.6],[Math.cos(a)*r*1.2,top,Math.sin(a)*r*1.2]];
  line(g,points,'#61754b',.007);
  for(let j=1;j<=3;j++){
   const t=j/3,px=Math.cos(a)*r*t,py=.28+(top-.28)*t,pz=Math.sin(a)*r*t;
   for(const side of [-1,1]){const leaf=ball(g,px+Math.sin(a)*side*.07,py,pz+Math.cos(a)*side*.07,.07,['#6b8357','#8a9c68','#526f4e'][n%3],[.45,.15,1.5]);leaf.rotation.set(.2,Math.PI/2-a+side*.5,.4*side);}
  }
 }
 return g;
}
function lamp(parent,x,y,z,color='#687b60'){
 const g=group(parent,x,y,z);cylinder(g,0,.018,0,.12,.035,brass);
 line(g,[[0,.04,0],[0,.25,0],[.07,.41,.01],[.17,.44,.05]],brass,.015);
 const shade=new T.Mesh(new T.CylinderGeometry(.055,.16,.12,24,1,true),mat(color));shade.position.set(.18,.405,.06);g.add(shade);
 const light=ball(g,.18,.345,.06,.038,'#fff0ba');light.material=mat('#fff0ba').clone();light.material.emissive.set('#f5ce7b');light.material.emissiveIntensity=.5;
 return g;
}
function picture(parent,x,y,z,angle=0){
 const g=group(parent,x,y,z,angle);box(g,0,0,0,.50,.69,.04,darkWood,.012);box(g,0,0,.025,.44,.63,.01,'#dfd6b9',0);
 line(g,[[0,-.25,.035],[-.015,-.05,.036],[.018,.21,.035]],'#607553',.004);
 for(let i=0;i<6;i++)for(const side of [-1,1]){
  const leaf=ball(g,side*(.055+(i%2)*.015),-.18+i*.065,.04,.045,'#697954',[1.35,.42,.04]);leaf.rotation.z=side*.5;
 }
}
function windowPainting(){
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=768;const c=canvas.getContext('2d');
 const sky=c.createLinearGradient(0,0,0,768);sky.addColorStop(0,'#a3c0ba');sky.addColorStop(.7,'#e5d9b1');sky.addColorStop(1,'#f0ddb3');c.fillStyle=sky;c.fillRect(0,0,512,768);
 for(const [y,color] of [[470,'#9dad93'],[550,'#809978'],[650,'#647f61']]){c.fillStyle=color;c.beginPath();c.moveTo(0,768);c.lineTo(0,y);for(let x=0;x<=512;x+=8)c.lineTo(x,y+Math.sin(x*.010+y)*36+Math.sin(x*.024)*12);c.lineTo(512,768);c.fill();}
 c.fillStyle='#f5ebd0';for(const [x,y,r]of [[105,145,24],[127,135,31],[151,150,22],[350,270,22],[372,260,29],[400,271,20]]){c.beginPath();c.ellipse(x,y,r*1.5,r*.58,0,0,Math.PI*2);c.fill();}
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;return texture;
}

export function enrichWorld(root,scene){
 // A pale curved inlay reconnects the rooms; it is flush with the timber floor.
 const inlay=new T.Mesh(new T.RingGeometry(1.93,2.27,128),tactile('pale-wood','#f2e8d2'));
 inlay.rotation.x=-Math.PI/2;inlay.scale.set(1.27,1,1);inlay.position.set(0,.018,-.5);inlay.receiveShadow=true;root.add(inlay);
 // Exposed rafters continue the little attic in the accepted room sketch.
 const beam=(a,b)=>{const from=new T.Vector3(...a),to=new T.Vector3(...b),v=to.clone().sub(from),o=box(root,...from.add(to).multiplyScalar(.5).toArray(),.13,v.length(),.15,'#c4a580',.018);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());};
 beam([-1.06,.08,-3.51],[-1.06,2.83,-3.51]);beam([1.10,.08,-3.51],[1.10,2.83,-3.51]);
 beam([-1.06,2.81,-3.51],[1.10,2.81,-3.51]);beam([-1.10,2.83,-3.51],[.02,3.65,-3.51]);beam([.02,3.65,-3.51],[1.14,2.83,-3.51]);beam([.02,2.83,-3.51],[.02,3.61,-3.51]);
 // The front bench holds work in progress, rather than leaving a blank stage.
 const bench=group(root,-.80,0,2.83);box(bench,0,.58,0,1.62,.13,.65,'#c4a580',.045);
 for(const x of [-.63,.63])for(const z of [-.20,.20])box(bench,x,.27,z,.105,.54,.105,'#ae855c',.02);
 obstacles.push({x:-.80,z:2.83,w:1.78,d:.78});
 paper(bench,-.45,.66,0,'#ece0c3',-.15);paper(bench,.05,.658,-.04,'#f4e8cb',.12);
 const sketch=group(bench,.05,.68,-.04,.12);for(const [x,z]of [[-.09,-.055],[.06,-.035],[-.015,.07]]){box(sketch,x,0,z,.09,.002,.045,'#c9cbb0',0);}
 line(sketch,[[-.085,.003,-.03],[-.025,.003,0],[.06,.003,-.02]],'#8e997e',.003);
 box(bench,.53,.66,.025,.28,.043,.40,'#87917b',.015);for(let i=0;i<3;i++)box(bench,.53,.69+i*.012,.015,.23,.009,.31,'#e6d6b4',.002);
 cup(bench,.55,.708,-.04);bottle(bench,-.62,.654,-.14,'#a18b79',.14);
 const cloth=box(bench,-.24,.06,.04,.58,.11,.42,'#b7b399',.04);cloth.rotation.y=.08;
 // Cloth and woven edges give each work area a softer, inhabited centre.
 for(const [x,z,rx,rz]of [[-3.8,.6,1.35,1.1],[0,-.5,1.42,1.42]]){
  const rug=cylinder(root,x,.024,z,1,.018,'#748064');rug.scale.set(rx,1,rz);rug.material=tactile('floral-cloth','#e4d9bd');
  const edge=ring(root,x,.042,z,1,.021,'#b7a579');edge.scale.set(rx,rz,1);
 }

 // A rear cabinet, with horizontally stacked books, rolled plans and small collections.
 const cabinet=group(root,-.05,0,-3.45);
 box(cabinet,0,1.15,-.04,1.88,2.3,.20,'#b68d5e');
 for(const x of [-.95,0,.95])box(cabinet,x,1.15,.10,.065,2.3,.43,'#ae855c');
 for(const y of [.12,.68,1.25,1.81,2.31])box(cabinet,0,y,.10,1.96,.06,.49,'#ae855c');
 for(let row=0;row<4;row++)for(let i=0;i<5;i++){
  const x=-.8+i*.15,y=.17+row*.56,h=.30+(i%3)*.035;
  const b=box(cabinet,x,y+h/2,.11,.11,h,.30,['#678174','#9e6d5c','#c1aa76'][i%3],.01);b.rotation.z=i===3?-.13:0;
  box(b,0,.07,.154,.07,.016,.006,'#cfb77b',0);box(b,0,-.09,.154,.07,.010,.006,'#cfb77b',0);
 }
 for(let i=0;i<3;i++)book(cabinet,.46,.77+i*.11,.11,['#807c65','#8f6b62','#637d70'][i],i*.14);
 for(let i=0;i<4;i++){const scroll=cylinder(cabinet,.25+i*.14,1.49,.1,.05,.36,'#e2cfaa');scroll.rotation.z=(i-1.5)*.10;}
 bottle(cabinet,.35,1.85,.10,'#809a80',.29);bottle(cabinet,.70,1.85,.10,'#8e776d',.22);
 obstacles.push({x:-.05,z:-3.4,w:2.0,d:.58});

 // A small clock and a suspended plane provide discoveries above eye level.
 const clock=group(root,-.05,2.68,-3.32);
 const face=cylinder(clock,0,0,0,.21,.04,darkWood);face.rotation.x=Math.PI/2;
 const dial=cylinder(clock,0,0,.029,.182,.006,'#e9dcc0');dial.rotation.x=Math.PI/2;
 for(let i=0;i<12;i++){const a=i*Math.PI/6;const mark=box(clock,Math.sin(a)*.15,Math.cos(a)*.15,.04,.012,.025,.004,'#776344',0);mark.rotation.z=-a;}
 line(clock,[[0,.10,.049],[0,0,.049],[.088,-.04,.049]],'#5a5041',.008);
 const pendulum=group(scene,-.05,2.48,-3.25);line(pendulum,[[0,0,0],[0,-.25,0]],brass,.007);ball(pendulum,0,-.27,0,.044,brass,[1,1,.32]);moving.push({kind:'pendulum',object:pendulum});
 const plane=group(root,-.85,2.86,-2.97,-.28);box(plane,0,0,0,.07,.05,.38,'#b48a5d');box(plane,0,0,.04,.48,.025,.11,'#d6b98b');box(plane,0,.035,-.16,.17,.025,.07,'#d6b98b');line(root,[[-.85,2.88,-2.97],[-.85,3.22,-2.97]],'#b0a48e',.003);

 // A brass globe, a leaning library ladder and the worn rail above the curved shelves.
 const globe=group(root,-1.78,0,-1.88);cylinder(globe,0,.04,0,.23,.065,darkWood);cylinder(globe,0,.37,0,.045,.64,brass);
 const earth=ball(globe,0,.88,0,.29,'#baa87b');earth.rotation.z=-.25;
 for(let i=0;i<7;i++){const a=i*2.4;const land=ball(earth,Math.sin(a)*.21,Math.cos(a*1.7)*.15,Math.cos(a)*.21,.115,'#8d9870',[1.3,.60,.38]);land.lookAt(earth.localToWorld(land.position.clone().multiplyScalar(2)));}
 ring(globe,0,.88,0,.325,.015,brass,[0,0,-.25]);ring(globe,0,.88,0,.31,.008,brass);obstacles.push({x:-1.78,z:-1.88,r:.33});
 const ladder=group(root,-5.2,0,-1.18,-.9);for(const x of [-.21,.21])line(ladder,[[x,.05,.27],[x,2.3,0]],'#ae855c',.031);
 for(let i=0;i<8;i++)line(ladder,[[-.22,.18+i*.27,.255-i*.032],[.22,.18+i*.27,.255-i*.032]],'#c4a580',.025);
 const rail=[];for(let i=0;i<=50;i++){const a=Math.PI*1.025+i/50*Math.PI*.76;rail.push([-3+2.33*Math.cos(a),2.68,-.4+2.33*Math.sin(a)]);}line(root,rail,brass,.019);

 // A real arched window, curtains with folds, and things left on the sill.
 const win=group(root,4.15,.13,-1.96,-.4),shape=new T.Shape();shape.moveTo(-.49,.48);shape.lineTo(.49,.48);shape.lineTo(.49,1.43);shape.absarc(0,1.43,.49,0,Math.PI,false);shape.lineTo(-.49,.48);
 const glass=new T.Mesh(new T.ShapeGeometry(shape),new T.MeshBasicMaterial({map:windowPainting(),color:'#fff7df'}));glass.position.z=.11;
 // ShapeGeometry's default XY UVs are measured in metres; map the complete painted vista into the opening.
 const uv=glass.geometry.attributes.uv,pos=glass.geometry.attributes.position;for(let i=0;i<uv.count;i++)uv.setXY(i,(pos.getX(i)+.49)/.98,(pos.getY(i)-.48)/1.45);win.add(glass);
 box(win,0,1.19,.13,.045,1.43,.05,'#ae855c');box(win,0,1.20,.14,.97,.04,.055,'#ae855c');box(win,0,.48,.17,1.16,.09,.40,'#c4a580');
 for(const side of [-1,1]){const geo=new T.PlaneGeometry(.31,1.43,10,16),p=geo.attributes.position;for(let i=0;i<p.count;i++)p.setZ(i,Math.sin(p.getX(i)*75)*.032);geo.computeVertexNormals();const curtain=new T.Mesh(geo,tactile('floral-cloth','#eee0c5'));curtain.material=curtain.material.clone();curtain.material.side=T.DoubleSide;curtain.position.set(side*.47,1.19,.23);win.add(curtain);line(win,[[side*.36,.81,.25],[side*.56,.79,.26]],brass,.010);}
 cup(win,-.30,.545,.18);potPlant(win,.32,.545,.13,.60);
 picture(root,5.05,1.9,-1.08,-.8);potPlant(root,5.45,2.22,-.20,.70,true);

 // Personal work surfaces: each object explains the work happening beside it.
 lamp(root,-4.19,.585,.22);lamp(root,3.15,.585,.31,'#9d776c');lamp(root,4.60,.585,2.35,'#81768a');
 for(let i=0;i<3;i++)book(root,-3.37,.64+i*.09,.37,['#6e8170','#9d7c64','#bfab85'][i],-.10+i*.09);
 const quill=group(root,-4.03,.59,.60);cylinder(quill,0,.045,0,.043,.09,'#5c6356');line(quill,[[0,.08,0],[.08,.31,.025]],'#8c785b',.007);const feather=ball(quill,.077,.265,.022,.075,'#e5d7b9',[.36,1.6,.10]);feather.rotation.z=-.28;
 cup(root,-3.84,.595,.24);paper(root,-3.90,.595,.67,'#e6d6b7',.19);
 // Kitty: thread spool, scissors, a pencilled prototype and tiny paper offcuts.
 for(const [x,z,color]of [[3.93,.34,'#b68a84'],[4.04,.42,'#819883']]){cylinder(root,x,.655,z,.050,.15,color);cylinder(root,x,.735,z,.066,.015,'#e2c9a6');cylinder(root,x,.580,z,.066,.015,'#e2c9a6');}
 const scissors=group(root,3.33,.601,.67,.55);for(const x of [-.045,.045])ring(scissors,x,0,0,.040,.009,'#b56e68');line(scissors,[[-.045,0,-.035],[.035,0,-.18]],'#898578',.010);line(scissors,[[.045,0,-.035],[-.035,0,-.18]],'#898578',.010);
 for(let i=0;i<5;i++){const cut=box(root,3.47+i*.09,.604,.24+(i%2)*.045,.06,.003,.10,'#eee0bd',0);cut.rotation.y=i*.77;}
 // Kuromi: compared pages, page tabs, a stamp, and a tray holding checked documents.
 paper(root,4.35,.597,2.5,'#ebdccb',-.12);for(let i=0;i<3;i++)box(root,4.48,.617,2.42+i*.044,.037,.005,.024,['#bba5b2','#91a28b','#b69f77'][i],0);
 cylinder(root,3.60,.62,2.22,.065,.04,'#7a6476');cylinder(root,3.60,.68,2.22,.025,.11,darkWood);ball(root,3.60,.749,2.22,.045,darkWood,[1,.65,1]);
 box(root,3.63,.61,2.59,.38,.045,.29,'#8d7a87',.02);for(let i=0;i<3;i++)paper(root,3.63,.64+i*.019,2.59,'#e9decd',i*.035);
 // Dust's records: open notebook, ribbon bookmark, graphite and a basket of scrolls.
 for(let i=0;i<3;i++)book(root,-3.75,.64+i*.09,2.36,['#95846d','#6d8071','#a0816c'][i],i*.08);
 line(root,[[-3.24,.615,2.36],[-3.18,.615,2.57]],'#675e4c',.009);
 const basket=group(root,-4.05,0,2.93);cylinder(basket,0,.15,0,.22,.28,'#b38f63');for(let i=0;i<8;i++)ring(basket,0,.03+i*.032,0,.225,.006,'#d1b184');
 for(let i=0;i<4;i++){const scroll=cylinder(basket,-.10+i*.065,.29,(i%2)*.09,.035,.33,'#e1cba7');scroll.rotation.z=(i-1.5)*.1;}

 // The shared table has tea, bookmarks and several hands' different page arrangements.
 const tea=group(root,0,.655,-.5);ball(tea,.02,.12,.02,.13,'#dad8bb',[1,1,1]);cylinder(tea,.02,.245,.02,.065,.026,'#c4c6a4');ball(tea,.02,.271,.02,.024,brass);ring(tea,-.125,.13,.02,.082,.015,'#c4c6a4',[0,Math.PI/2,0]);line(tea,[[.12,.08,.02],[.21,.15,.02],[.23,.19,.02]],'#c4c6a4',.028);
 cup(root,-.40,.654,-.48);cup(root,.45,.654,-.40);box(root,.22,.659,-.03,.036,.004,.20,'#a26961',0);
 // A few small gardens soften the edge and make the room feel occupied beyond its desks.
 potPlant(root,-5.85,.035,.30,.82);potPlant(root,5.85,.025,1.3,.88);potPlant(root,-1.4,.025,-3.63,.85);
 const mobilePlant=potPlant(scene,5.18,.05,1.72,.58);mobilePlant.updateMatrixWorld(true);
 const inverse=mobilePlant.matrixWorld.clone().invert(),batches=new Map();
 mobilePlant.traverse(o=>{if(!o.isMesh)return;const g=(o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone()).applyMatrix4(inverse.clone().multiply(o.matrixWorld));if(!batches.has(o.material))batches.set(o.material,[]);batches.get(o.material).push(g);});
 mobilePlant.clear();for(const [material,geos]of batches){const mesh=new T.Mesh(mergeGeometries(geos),material);mesh.castShadow=true;mesh.receiveShadow=true;mobilePlant.add(mesh);geos.forEach(g=>g.dispose());}
 moving.push({kind:'leaves',object:mobilePlant});
 return {detailGroups:root.children.length};
}

export function updateWorld(time){for(const {kind,object}of moving){if(kind==='pendulum')object.rotation.z=Math.sin(time*1.9)*.085;else object.rotation.z=Math.sin(time*.55)*.014;}}
