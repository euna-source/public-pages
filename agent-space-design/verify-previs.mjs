import {spawn} from 'node:child_process';

const chrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',port=9237;
const child=spawn(chrome,['--headless=new','--disable-gpu-sandbox',`--remote-debugging-port=${port}`,'--user-data-dir=/tmp/agent-space-previs-v2-cdp','http://127.0.0.1:8794/previs.html?paused=1'],{stdio:'ignore'});
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function tabs(){for(let attempt=0;attempt<80;attempt++){try{const list=await fetch(`http://127.0.0.1:${port}/json/list`).then(response=>response.json()),tab=list.find(item=>item.type==='page'&&item.url.includes('previs.html'));if(tab)return tab;}catch{}await wait(100);}throw new Error('검증 브라우저에 연결하지 못했습니다.');}
function cdp(url){const socket=new WebSocket(url);let id=0;const pending=new Map(),errors=[];socket.onmessage=event=>{const message=JSON.parse(event.data);if(message.method==='Runtime.exceptionThrown')errors.push(message.params.exceptionDetails.text);if(message.id&&pending.has(message.id)){pending.get(message.id)(message);pending.delete(message.id);}};const opened=new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});return {errors,async send(method,params={}){await opened;const call=++id;socket.send(JSON.stringify({id:call,method,params}));return new Promise(resolve=>pending.set(call,resolve));},close(){socket.close();}};}
async function evaluate(client,expression){const response=await client.send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(response.result.exceptionDetails)throw new Error(response.result.exceptionDetails.text);return response.result.result.value;}

try{
 const tab=await tabs(),client=cdp(tab.webSocketDebuggerUrl);await client.send('Runtime.enable');let ready=false;
 for(let attempt=0;attempt<120;attempt++){ready=await evaluate(client,'Boolean(window.motionPrevis?.ready)');if(ready)break;await wait(100);}if(!ready)throw new Error('다섯 캐릭터가 준비되지 않았습니다.');
 const samples=[];for(const time of [0,2.7,4.2,6.1,10.8,179])samples.push(await evaluate(client,`new Promise(resolve=>{window.motionPrevis.setTime(${time});requestAnimationFrame(()=>requestAnimationFrame(()=>resolve({label:document.querySelector('#beat-label').textContent,snapshot:window.motionPrevis.snapshot()})));})`));
 const labels=[...new Set(samples.slice(0,5).map(sample=>sample.label))],base=samples[0].snapshot;
 if(base.camera.type!=='PerspectiveCamera')throw new Error('원근 카메라가 아닙니다.');
 if(!base.shadows)throw new Error('접촉 그림자가 꺼져 있습니다.');
 if(labels.length!==5)throw new Error(`하울 키포즈가 ${labels.length}개만 확인됐습니다.`);
 if(base.actors.length!==5)throw new Error('장면에 다섯 캐릭터가 유지되지 않습니다.');
 for(const actor of base.actors){
  if(Math.abs(actor.rootY-actor.support)>.001)throw new Error(`${actor.key}의 발 기준이 지지 평면에서 떨어졌습니다.`);
  if(actor.foot.x<0||actor.foot.x>1||actor.foot.y<0||actor.foot.y>1)throw new Error(`${actor.key}의 발이 화면 밖입니다.`);
  if(actor.bounds.left<-.02||actor.bounds.right>1.02||actor.bounds.top<-.02||actor.bounds.bottom>1.02)throw new Error(`${actor.key}의 전신 경계가 화면에서 잘립니다.`);
  if(actor.screenHeight<=.015||actor.screenHeight>=.38)throw new Error(`${actor.key}의 원근상 크기가 비정상입니다.`);
  if(!actor.world.every(Number.isFinite)||!Number.isFinite(actor.baseYaw))throw new Error(`${actor.key}의 세계 좌표 또는 방향이 유한값이 아닙니다.`);
 }
 const howl=base.actors.find(actor=>actor.key==='howl'),dustPositions=samples.map(sample=>sample.snapshot.actors.find(actor=>actor.key==='dust').world.join(','));
 if(howl.screenHeight<.16)throw new Error('하울이 가구 스케일에 비해 지나치게 작습니다.');
 if(new Set(dustPositions).size<2)throw new Error('스스와타리의 바닥 이동이 확인되지 않습니다.');
 const activeStates=new Set(samples[2].snapshot.actors.map(actor=>actor.state));if(activeStates.size<4)throw new Error('캐릭터별 비동기 상태가 충분히 갈리지 않습니다.');
 if(client.errors.length)throw new Error(`브라우저 예외: ${client.errors.join(', ')}`);
 console.log(JSON.stringify({ok:true,camera:base.camera,shadows:true,actors:base.actors.map(actor=>({key:actor.key,heightMetres:actor.height,screenHeight:Number(actor.screenHeight.toFixed(3)),foot:[Number(actor.foot.x.toFixed(3)),Number(actor.foot.y.toFixed(3))],rootY:actor.rootY,support:actor.support})),howlKeyPoses:labels,asynchronousStates:[...activeStates],dustWorldPositions:[...new Set(dustPositions)].length},null,2));client.close();
}finally{child.kill('SIGTERM');}
