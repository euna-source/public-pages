import test from 'node:test';
import assert from 'node:assert/strict';
import { BubbleTapEffect } from '../src/bubble-tap.js';

test('each reaction adds two kinds x three; rapid reactions mix and never reuse the previous pair', async () => {
  const originals = Object.fromEntries(['document','matchMedia','requestAnimationFrame','cancelAnimationFrame'].map(k=>[k,globalThis[k]]));
  const children = new Set();
  globalThis.matchMedia = () => ({matches:false});
  globalThis.requestAnimationFrame = () => 1;
  globalThis.cancelAnimationFrame = () => {};
  globalThis.document = {createElement:()=>({style:{},remove(){children.delete(this);}})};
  const layer = {clientWidth:400,clientHeight:800,getBoundingClientRect:()=>({left:0,top:0,width:400,height:800}),append(el){children.add(el);}};
  const effect = new BubbleTapEffect(layer);
  try {
    const first = effect.play({clientX:100,clientY:100});
    await new Promise(r=>setTimeout(r,260));
    assert.equal(children.size,6);
    const counts = {}; for (const el of children) counts[el.textContent]=(counts[el.textContent]||0)+1;
    assert.deepEqual(Object.values(counts),[3,3]);
    assert.deepEqual(Object.keys(counts).sort(),[...first].sort());
    const second = effect.play({clientX:110,clientY:110});
    assert.ok(!second.some(e=>first.includes(e)),'new pair excludes previous pair');
    await new Promise(r=>setTimeout(r,260));
    assert.equal(children.size,12,'earlier emoji keep falling and mix');
    effect.clear();
    assert.equal(children.size,0);
  } finally {
    effect.destroy();
    for(const [k,v] of Object.entries(originals)){if(v===undefined)delete globalThis[k];else globalThis[k]=v;}
  }
});
