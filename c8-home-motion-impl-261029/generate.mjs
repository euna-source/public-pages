import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export function response(k,z,t){
  if(!(k>0 && z>0 && z<=1 && t>=0)) throw new Error('Unsupported spring parameters');
  const w=Math.sqrt(k);
  if(z===1) return 1-(1+w*t)*Math.exp(-w*t);
  const d=Math.sqrt(1-z*z), wd=w*d;
  return 1-Math.exp(-z*w*t)*(Math.cos(wd*t)+z/d*Math.sin(wd*t));
}
export function settle(k,z){
  let last=0;
  for(let i=0;i<=20000;i++) if(Math.abs(1-response(k,z,i/10000))>.005) last=i/10000;
  if(last>=2) throw new Error('Spring did not settle');
  return Math.ceil((last+.0001)*1000)/1000;
}
export function generate(tokens){
  const springs={}, css=[':root {'];
  for(const family of ['spatial','effects']) for(const speed of ['fast','default','slow']){
    const group=tokens[family][speed], s=group.$extensions['club.cre8or.motion.spring'];
    if(s.mass!==1) throw new Error('Mass must be 1');
    const {stiffness:k,dampingRatio:z}=s, duration=settle(k,z);
    if(group.duration.$type!=='duration' || group.duration.$value.unit!=='s' || group.duration.$value.value!==duration) throw new Error('Stale derived duration');
    const name=family+'.'+speed;
    springs[name]={...s,duration,damping:2*z*Math.sqrt(k)};
    const values=Array.from({length:241},(_,i)=>+(i===240?1:response(k,z,duration*i/240)).toFixed(7));
    css.push(`  --${family}-${speed}-duration: ${duration}s;`, `  --${family}-${speed}-ease: linear(${values.join(',')});`);
  }
  css.push(`  --word-stagger: ${tokens.caption.stagger.$value.value}ms;`, '}');
  const motion=Object.fromEntries(Object.entries(springs).map(([key,s])=>[key,{type:'spring',mass:1,stiffness:s.stiffness,damping:s.damping}]));
  const js=`export const springs = ${JSON.stringify(springs,null,2)};\nexport const transitions = ${JSON.stringify(motion,null,2)};\nexport const stagger = ${tokens.caption.stagger.$value.value/1000};\nexport const response = ${response.toString()};\nexport function springEase(k,z){const s=Object.values(springs).find(s=>s.stiffness===k&&s.dampingRatio===z);if(!s) throw new Error('Use a declared token'); return p=>p===1?1:response(k,z,Math.max(0,Math.min(1,p))*s.duration);}\nexport function gsapTransition(name){const s=springs[name];return {duration:s.duration,ease:springEase(s.stiffness,s.dampingRatio)};}\n`;
  return {css:css.join('\n'),js,springs};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
  const dir=path.dirname(fileURLToPath(import.meta.url)), tokens=JSON.parse(readFileSync(path.join(dir,'motion-tokens.json')));
  const out=generate(tokens); mkdirSync(path.join(dir,'preview/generated'),{recursive:true});
  writeFileSync(path.join(dir,'preview/generated/tokens.css'),out.css);
  writeFileSync(path.join(dir,'preview/generated/motion.mjs'),out.js);
  writeFileSync(path.join(dir,'spring-metrics.json'),JSON.stringify(out.springs,null,2));
  console.log('Generated CSS, motion physics transitions and GSAP analytic easing');
}
