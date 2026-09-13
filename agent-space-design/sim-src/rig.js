import * as T from 'three';

const profiles={
 kitty:{head:.43,arm:.31,shoulder:.14,leg:.12},
 kuromi:{head:.34,arm:.25,shoulder:.115,leg:.12},
 chococat:{head:.49,arm:.40,shoulder:.15,leg:.15}
};

// Preserve the accepted character mesh. Smooth weights assign forearms, wrists,
// knees and feet their own deformation, instead of rotating a whole limb rigidly.
function relaxEyeSurface(geo,height,key){
 if(key!=='kuromi'&&key!=='kitty')return;
 const p=geo.attributes.position,eye=key==='kuromi'?{x:.126,y:.516,rx:.077,ry:.092,z:.13}:{x:.145,y:.587,rx:.043,ry:.053,z:.17};
 // Fit the unraised cheek around each eye. This removes the source mesh's fixed
 // eyelash relief so a blinking eyelid follows a smooth face instead of a bump.
 for(const side of [-1,1]){
  const rows=[],candidates=[];
  for(let i=0;i<p.count;i++){
   const x=p.getX(i)/height-side*eye.x,y=p.getY(i)/height-eye.y,z=p.getZ(i)/height,r=Math.hypot(x/eye.rx,y/eye.ry);
   if(z<eye.z||r>1.4)continue;
   const f=[1,x,y,x*x,x*y,y*y];
   if(r>.85)rows.push({f,z});else candidates.push({i,x,y,z,r,f});
  }
  const a=Array.from({length:6},()=>Array(7).fill(0));
  for(const {f,z}of rows)for(let j=0;j<6;j++){for(let k=0;k<6;k++)a[j][k]+=f[j]*f[k];a[j][6]+=f[j]*z;}
  for(let j=0;j<6;j++){
   let pivot=j;for(let k=j+1;k<6;k++)if(Math.abs(a[k][j])>Math.abs(a[pivot][j]))pivot=k;
   [a[j],a[pivot]]=[a[pivot],a[j]];const divisor=a[j][j];if(Math.abs(divisor)<1e-12)continue;
   for(let k=j;k<7;k++)a[j][k]/=divisor;
   for(let row=0;row<6;row++)if(row!==j){const factor=a[row][j];for(let k=j;k<7;k++)a[row][k]-=factor*a[j][k];}
  }
  for(const {i,z,r,f}of candidates){const fitted=f.reduce((v,n,j)=>v+n*a[j][6],0),weight=1-T.MathUtils.smoothstep(r,.50,.85);if(Number.isFinite(fitted)&&Math.abs(fitted-z)<.055)p.setZ(i,height*T.MathUtils.lerp(z,fitted,weight));}
 }
 geo.computeVertexNormals();
}
export function rigCat(model,height,key){
 const shape=profiles[key];model.updateMatrixWorld(true);
 const meshes=[];model.traverse(o=>{if(o.isMesh)meshes.push(o);});
 const bounds=new T.Box3().setFromObject(model),size=bounds.getSize(new T.Vector3()),centre=bounds.getCenter(new T.Vector3()),scale=height/size.y;
 const group=new T.Group(),bones=[],positions=[];
 function joint(name,x,y,z,parent=-1){
  const bone=new T.Bone();bone.name=name;
  const world=new T.Vector3(x,y,z).multiplyScalar(height);positions.push(world);
  bone.position.copy(world);if(parent>=0){bone.position.sub(positions[parent]);bones[parent].add(bone);}else group.add(bone);
  bones.push(bone);return bones.length-1;
 }
 const hips=joint('Hips',0,.145,0);
 const spine=joint('Spine',0,.225,0,hips);
 const head=joint('Head',0,shape.head,0,spine);
 const armIndices={},legIndices={};
 for(const [prefix,side]of [['Left',1],['Right',-1]]){
  const upper=joint(prefix+'Arm',side*shape.shoulder,shape.arm,0,spine);
  const drop=key==='chococat'?0:.055;
  const fore=joint(prefix+'ForeArm',side*(shape.shoulder+.11),shape.arm-drop,0,upper);
  const hand=joint(prefix+'Hand',side*(shape.shoulder+.20),shape.arm-drop*1.65,0,fore);
  armIndices[prefix]=[upper,fore,hand];
  const thigh=joint(prefix+'UpLeg',side*.085,.15,0,hips);
  const shin=joint(prefix+'Leg',side*.085,.08,0,thigh);
  const foot=joint(prefix+'Foot',side*.085,.024,.018,shin);
  legIndices[prefix]=[thigh,shin,foot];
 }
 const tail=joint('Tail',0,.15,-.10,hips);
 const leftEar=joint('LeftEar',.24,.88,0,head),rightEar=joint('RightEar',-.24,.88,0,head);
 const blend=(a,b,t)=>[[a,1-T.MathUtils.clamp(t,0,1)],[b,T.MathUtils.clamp(t,0,1)]];
 for(const mesh of meshes){
  const geo=mesh.geometry.clone().applyMatrix4(mesh.matrixWorld);
  geo.translate(-centre.x,-bounds.min.y,-centre.z);geo.scale(scale,scale,scale);relaxEyeSurface(geo,height,key);
  const pos=geo.attributes.position,ids=new Uint16Array(pos.count*4),weights=new Float32Array(pos.count*4);
  for(let i=0;i<pos.count;i++){
   const x=pos.getX(i)/height,y=pos.getY(i)/height,z=pos.getZ(i)/height,ax=Math.abs(x),prefix=x>0?'Left':'Right';
   let w=[[spine,1]];
   if(key==='chococat'&&y>.81&&ax>.12)w=blend(head,x>0?leftEar:rightEar,(y-.81)/.10);
   else if(y>shape.head-.025)w=blend(spine,head,(y-shape.head+.025)/.050);
   else if(ax>shape.shoulder&&y>shape.arm-.13&&y<shape.head-.02){
    const [upper,fore,hand]=armIndices[prefix],elbow=shape.shoulder+.11,wrist=shape.shoulder+.20;
    if(ax<elbow-.03)w=blend(spine,upper,(ax-shape.shoulder)/.025);
    else if(ax<elbow+.035)w=blend(upper,fore,(ax-elbow+.03)/.065);
    else w=blend(fore,hand,(ax-wrist+.025)/.055);
   }else if(key!=='kitty'&&z<-.055&&ax>.14){w=[[tail,1]];
   }else if(y<.16&&ax<.25){
    const [thigh,shin,foot]=legIndices[prefix];
    if(y>.135)w=blend(thigh,hips,(y-.135)/.025);
    else if(y>.115)w=blend(shin,thigh,(y-.115)/.020);
    else w=blend(foot,shin,(y-.090)/.025);
   }else if(z<-.1&&ax>.16)w=[[tail,1]];
   for(let j=0;j<w.length;j++){ids[i*4+j]=w[j][0];weights[i*4+j]=w[j][1];}
  }
  geo.setAttribute('skinIndex',new T.Uint16BufferAttribute(ids,4));geo.setAttribute('skinWeight',new T.Float32BufferAttribute(weights,4));
  const skin=new T.SkinnedMesh(geo,mesh.material.clone());group.add(skin);group.updateMatrixWorld(true);skin.bind(new T.Skeleton(bones));
 }
 return group;
}
