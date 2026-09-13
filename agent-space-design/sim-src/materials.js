import * as T from 'three';
const textures={},cache=new Map();
export async function prepareMaterials(){
 const loader=new T.TextureLoader();
 await Promise.all(['wood-grain','plaster','floral-cloth'].map(async name=>{
  const texture=await loader.loadAsync(`assets/materials/${name}.webp`);
  texture.colorSpace=T.SRGBColorSpace;
  texture.wrapS=texture.wrapT=T.RepeatWrapping;
  texture.anisotropy=4;
  textures[name]=texture;
 }));
}
export function tactile(kind,color='#ffffff'){
 const key=kind+color;
 if(cache.has(key))return cache.get(key);
 const m=new T.MeshStandardMaterial({map:textures[kind==='pale-wood'?'wood-grain':kind],color,roughness:kind==='floral-cloth'?1:.91,metalness:0});
 if(kind==='wood-grain'||kind==='pale-wood'){
  m.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#ifdef USE_MAP
vec4 sampledDiffuseColor = texture2D(map,vMapUv);
vec3 quietGrain=mix(vec3(${kind==='pale-wood'?'.72,.64,.49':'.49,.33,.185'}),sampledDiffuseColor.rgb,${kind==='pale-wood'?'.10':'.24'});
diffuseColor.rgb *= quietGrain;
#endif`);};
  m.customProgramCacheKey=()=> 'quiet-'+kind;
 }
 cache.set(key,m);return m;
}
