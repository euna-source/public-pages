import {spawn} from 'node:child_process';

const chrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const port=9237;
const child=spawn(chrome,[
 '--headless=new',
 '--disable-gpu-sandbox',
 `--remote-debugging-port=${port}`,
 '--user-data-dir=/tmp/agent-space-previs-cdp',
 'http://127.0.0.1:8794/previs.html?paused=1',
],{stdio:'ignore'});

const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function tabs(){
 for(let attempt=0;attempt<80;attempt++){
  try{
   const list=await fetch(`http://127.0.0.1:${port}/json/list`).then(response=>response.json());
   const tab=list.find(item=>item.type==='page'&&item.url.includes('previs.html'));
   if(tab)return tab;
  }catch{}
  await wait(100);
 }
 throw new Error('검증 브라우저에 연결하지 못했습니다.');
}

function cdp(url){
 const socket=new WebSocket(url);let id=0;const pending=new Map(),errors=[];
 socket.onmessage=event=>{
  const message=JSON.parse(event.data);
  if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text);
  if(message.id&&pending.has(message.id)){pending.get(message.id)(message);pending.delete(message.id);}
 };
 const opened=new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
 return {errors,async send(method,params={}){await opened;const call=++id;socket.send(JSON.stringify({id:call,method,params}));return new Promise(resolve=>pending.set(call,resolve));},close(){socket.close();}};
}

async function evaluate(client,expression){
 const response=await client.send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
 if(response.result.exceptionDetails)throw new Error(response.result.exceptionDetails.text);
 return response.result.result.value;
}

try{
 const tab=await tabs(),client=cdp(tab.webSocketDebuggerUrl);
 await client.send('Runtime.enable');
 let ready=false;
 for(let attempt=0;attempt<120;attempt++){
  ready=await evaluate(client,'Boolean(window.motionPrevis?.ready)');
  if(ready)break;
  await wait(100);
 }
 if(!ready)throw new Error('다섯 캐릭터가 준비되지 않았습니다.');

 const samples=[];
 for(const time of [0,2.7,4.2,6.1,10.8,179]){
  const sample=await evaluate(client,`new Promise(resolve=>{window.motionPrevis.setTime(${time});requestAnimationFrame(()=>requestAnimationFrame(()=>resolve({label:document.querySelector('#beat-label').textContent,snapshot:window.motionPrevis.snapshot()})));})`);
  samples.push(sample);
 }
 const labels=[...new Set(samples.slice(0,5).map(sample=>sample.label))];
 if(labels.length!==5)throw new Error(`하울 키포즈가 ${labels.length}개만 확인됐습니다.`);
 if(samples.some(sample=>sample.snapshot.actors.length!==5))throw new Error('장면에 다섯 캐릭터가 유지되지 않습니다.');
 const activeStates=new Set(samples[2].snapshot.actors.map(actor=>actor.state));
 if(activeStates.size<4)throw new Error('캐릭터별 비동기 상태가 충분히 갈리지 않습니다.');
 const dustX=samples.map(sample=>sample.snapshot.actors.find(actor=>actor.key==='dust').x);
 if(new Set(dustX.map(value=>value.toFixed(2))).size<2)throw new Error('스스와타리의 바닥 이동이 확인되지 않습니다.');
 await evaluate(client,"window.motionPrevis.focus('howl')");
 const focus=await evaluate(client,"getComputedStyle(document.querySelector('#world')).getPropertyValue('--origin-x').trim()");
 if(focus!=='29%')throw new Error('캐릭터 가까이 보기가 적용되지 않았습니다.');
 if(client.errors.length)throw new Error(`브라우저 예외: ${client.errors.join(', ')}`);
 console.log(JSON.stringify({ok:true,actors:5,howlKeyPoses:labels,asynchronousStates:[...activeStates],dustRange:[Math.min(...dustX),Math.max(...dustX)],threeMinuteBoundary:samples.at(-1).snapshot.time,focus},null,2));
 client.close();
}finally{
 child.kill('SIGTERM');
}
