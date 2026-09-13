import * as T from 'three';

// The service's body rig attached the long coat hem to both thighs. A separate
// cloth control lets the hem fold behind the hips when sitting or crouching.
export function rigCoat(model,root,height){
 const hips=model.getObjectByName('Hips');if(!hips)return;
 const coat=new T.Bone();coat.name='CoatTail';hips.add(coat);root.updateMatrixWorld(true);
 const meshes=[];model.traverse(o=>{if(o.isSkinnedMesh)meshes.push(o);});
 for(const mesh of meshes){
  const old=mesh.skeleton,coatIndex=old.bones.length;
  const geo=mesh.geometry=mesh.geometry.clone(),ids=geo.attributes.skinIndex,weights=geo.attributes.skinWeight;
  for(let i=0;i<geo.attributes.position.count;i++){
   const p=mesh.getVertexPosition(i,new T.Vector3());mesh.localToWorld(p);root.worldToLocal(p).divideScalar(height);
   const amount=T.MathUtils.smoothstep(.65-p.y,0,.13)*T.MathUtils.smoothstep(-p.z,.055,.085);
   if(amount<=.001||p.y<.29)continue;
   const values=[0,1,2,3].map(j=>({id:ids.array[i*4+j],weight:weights.array[i*4+j]})).sort((a,b)=>b.weight-a.weight).slice(0,3);
   const sum=values.reduce((a,v)=>a+v.weight,0);
   for(let j=0;j<3;j++){ids.array[i*4+j]=values[j].id;weights.array[i*4+j]=(1-amount)*values[j].weight/sum;}
   ids.array[i*4+3]=coatIndex;weights.array[i*4+3]=amount;
  }
  const skeleton=new T.Skeleton([...old.bones,coat],[...old.boneInverses,coat.matrixWorld.clone().invert()]);
  mesh.bind(skeleton,mesh.bindMatrix.clone());ids.needsUpdate=true;weights.needsUpdate=true;
 }
}
