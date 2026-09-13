import * as T from 'three';
export function softenNormals(geo){
 const p=geo.attributes.position,n=geo.attributes.normal;if(!n)return geo;
 const groups=new Map();
 for(let i=0;i<p.count;i++){const key=[p.getX(i),p.getY(i),p.getZ(i)].map(v=>Math.round(v*100000)).join(',');if(!groups.has(key))groups.set(key,[]);groups.get(key).push(i);}
 const original=n.array.slice();
 for(const ids of groups.values())for(const i of ids){const sum=new T.Vector3(),a=new T.Vector3().fromArray(original,i*3);for(const j of ids){const b=new T.Vector3().fromArray(original,j*3);if(a.dot(b)>.5)sum.add(b);}sum.normalize();n.setXYZ(i,sum.x,sum.y,sum.z);}
 n.needsUpdate=true;return geo;
}
// Inset triangle UVs by a fraction of a texel so unrelated atlas islands do not bleed at seams.
export function cleanSurface(geometry,material){const texture=material.map;if(!texture)return geometry;texture.generateMipmaps=false;texture.minFilter=T.LinearFilter;texture.magFilter=T.LinearFilter;texture.anisotropy=4;texture.needsUpdate=true;const geo=geometry.index?geometry.toNonIndexed():geometry.clone(),uv=geo.attributes.uv;if(!uv)return geo;const width=texture.image.width||2048;for(let i=0;i<uv.count;i+=3){const cx=(uv.getX(i)+uv.getX(i+1)+uv.getX(i+2))/3,cy=(uv.getY(i)+uv.getY(i+1)+uv.getY(i+2))/3;for(let j=0;j<3;j++){const x=uv.getX(i+j),y=uv.getY(i+j),d=Math.hypot(cx-x,cy-y),a=Math.min(.14,.65/width/Math.max(d,.00001));uv.setXY(i+j,x+(cx-x)*a,y+(cy-y)*a);}}uv.needsUpdate=true;return geo;}
