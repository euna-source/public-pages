import test from 'node:test';
import assert from 'node:assert/strict';
import { BubbleTapEffect } from '../src/bubble-tap.js';

test('new reaction cancels pending spawns and replaces visible emoji', async () => {
  const originals = Object.fromEntries(['document','matchMedia','requestAnimationFrame','cancelAnimationFrame'].map(k=>[k,globalThis[k]]));
  const children = new Set();
  globalThis.matchMedia = () => ({matches:false});
  globalThis.requestAnimationFrame = () => 1;
  globalThis.cancelAnimationFrame = () => {};
  globalThis.document = {createElement:()=>({style:{},remove(){children.delete(this);}})};
  const layer = {clientWidth:400,clientHeight:800,getBoundingClientRect:()=>({left:0,top:0,width:400,height:800}),append(el){children.add(el);}};
  const effect = new BubbleTapEffect(layer);
  try {
    effect.play({clientX:100,clientY:100});
    effect.play({clientX:100,clientY:100});
    await new Promise(r=>setTimeout(r,65));
    assert.equal(children.size,2,'pending pairs must not stack');
    assert.equal(new Set([...children].map(el=>el.textContent)).size,2);
    effect.play({clientX:110,clientY:110});
    assert.equal(children.size,0,'old visible pair removed immediately');
    await new Promise(r=>setTimeout(r,65));
    assert.equal(children.size,2,'only latest pair remains');
    effect.clear();
    assert.equal(children.size,0);
  } finally {
    effect.destroy();
    for(const [k,v] of Object.entries(originals)){if(v===undefined)delete globalThis[k];else globalThis[k]=v;}
  }
});
