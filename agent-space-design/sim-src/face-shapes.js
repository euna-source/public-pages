import * as T from 'three';

// Authored local deformations travel with the skin: brows, eye socket, cheek, mouth and jaw.
// Keeping the texture on the deformed vertices avoids a separate mask floating over the face.
export function faceShapes(mesh,coords,height,key,space){
 const pos=mesh.geometry.attributes.position;
 const matrix=new T.Matrix4().copy(mesh.matrixWorld).invert().multiply(space.matrixWorld);
 const basis=new T.Matrix3().setFromMatrix4(matrix);
 const eye={howl:.928,kitty:.587,kuromi:.516,chococat:.64}[key];
 const spread={howl:.023,kitty:.145,kuromi:.126,chococat:.142}[key];
 const front={howl:.048,kitty:.18,kuromi:.15,chococat:.17}[key];
 const human=key==='howl',size=human?.016:.07;
 const gauss=(v,c,r)=>Math.exp(-Math.pow((v-c)/r,2)*2);
 const arrays=Array.from({length:4},()=>new Float32Array(pos.count*3));
 const d=new T.Vector3();
 for(let i=0;i<pos.count;i++){
  const [x,y,z]=coords.slice(i*3,i*3+3),side=Math.sign(x);
  const face=T.MathUtils.smoothstep(z,front,front+.02);
  if(!face||y<eye-size*3.6||y>eye+size*2)continue;
  // Imported rigs may keep a scale in their bind transform. Invert the skin's
  // linear transform as well as the mesh transform, otherwise a tiny expression
  // in metres can become a large spike after skinning.
  let localBasis=basis;
  if(mesh.isSkinnedMesh){
   const origin=mesh.applyBoneTransform(i,new T.Vector3());
   const axes=[[1,0,0],[0,1,0],[0,0,1]].map(a=>mesh.applyBoneTransform(i,new T.Vector3(...a)).sub(origin));
   const skin=new T.Matrix3().set(axes[0].x,axes[1].x,axes[2].x,axes[0].y,axes[1].y,axes[2].y,axes[0].z,axes[1].z,axes[2].z);
   localBasis=skin.invert().multiply(basis);
  }
  const socket=gauss(Math.abs(x),spread,size)*gauss(y,eye,size*.9)*face;
  const brow=gauss(Math.abs(x),spread,size*1.3)*gauss(y,eye+size*.85,size*.7)*face;
  const cheek=gauss(Math.abs(x),spread*1.4,size*1.4)*gauss(y,eye-size*1.2,size)*face;
  const mouth=human?gauss(x,0,.025)*gauss(y,.885,.015)*face:0;
  const amount=human?.0035:.0030;
  const motions=[
   [side*cheek*amount*.18,amount*(brow*(.7-Math.abs(x)/Math.max(spread,.01))-socket*.45-mouth*.8),-amount*cheek*.12],
   [-side*socket*amount*.25,-amount*(brow*.9+socket*.22+mouth*.25),amount*cheek*.12],
   [side*cheek*amount*.25,amount*(cheek*.55+socket*.24+mouth*(Math.abs(x)/.02-.4)),amount*cheek*.2],
   [side*socket*amount*.15,amount*(brow*.9+socket*.35-mouth*.8),0]
  ];
  motions.forEach((v,n)=>{d.set(...v).multiplyScalar(height).applyMatrix3(localBasis);arrays[n].set(d.toArray(),i*3);});
 }
 mesh.geometry.morphTargetsRelative=true;
 mesh.geometry.morphAttributes.position=arrays.map(a=>new T.Float32BufferAttribute(a,3));
 mesh.updateMorphTargets();
 return {update(feeling,dt){
  const targets=[feeling==='disappointed'?1:0,feeling==='brooding'?1:0,['pleased','relieved'].includes(feeling)?1:0,feeling==='surprised'?1:0];
  targets.forEach((v,i)=>mesh.morphTargetInfluences[i]=T.MathUtils.damp(mesh.morphTargetInfluences[i],v,8,dt));
 }};
}
