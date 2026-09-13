import * as T from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {GTAOPass} from 'three/addons/postprocessing/GTAOPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';

export function roomRendering(renderer,scene,camera){
 // Soft contact shade makes shelves, papers and cloth sit in the same room.
 // The normal/occlusion buffer runs below display resolution; colour keeps MSAA.
 if(!renderer.extensions.has('EXT_color_buffer_float'))return {resize(){},render(){renderer.render(scene,camera);}};
 const target=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,samples:4});
 const composer=new EffectComposer(renderer,target);composer.setPixelRatio(1);
 composer.addPass(new RenderPass(scene,camera));
 const shade=new GTAOPass(scene,camera,1,1,undefined,{radius:.22,distanceExponent:1.6,thickness:.16,distanceFallOff:1.2,scale:1,samples:8},{radius:4,samples:8,depthPhi:8,normalPhi:3});
 shade.blendIntensity=.70;composer.addPass(shade);
 renderer.setClearAlpha(0);renderer.shadowMap.autoUpdate=false;
 const output=new OutputPass();
 output.material.fragmentShader=output.material.fragmentShader.replace(/}\s*$/, 'gl_FragColor.rgb=mix(vec3(.9490196,.9333333,.8980392),gl_FragColor.rgb,gl_FragColor.a);gl_FragColor.a=1.;}');
 composer.addPass(output);
 let widthPx=1,heightPx=1,quality=0,slowFrames=0;
 return {observeFrame(dt){if(dt>.032)slowFrames++;else slowFrames=Math.max(0,slowFrames-2);if(slowFrames<90||quality>=2)return;slowFrames=0;quality++;if(quality===1){shade.updateGtaoMaterial({samples:4});shade.updatePdMaterial({samples:4});shade.setSize(Math.round(widthPx*.56),Math.round(heightPx*.56));}else shade.enabled=false;},resize(width,height){
  const ratio=Math.min(devicePixelRatio,1.4),w=Math.round(width*ratio),h=Math.round(height*ratio);
  widthPx=w;heightPx=h;composer.setSize(w,h);const scale=quality?.56:.72;shade.setSize(Math.round(w*scale),Math.round(h*scale));
 },render(){renderer.info.autoReset=false;renderer.info.reset();renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;composer.render();renderer.info.autoReset=true;}};
}
