/* Authenticated Google sheet bridge. No credentials or candidate list are sent on page load. */
(function(root){
  'use strict';
  const origin='https://euna-source.github.io';
  const tabOf=p=>p&&p.source==='후보'?'후보':p&&p.source==='수집'?'플랫폼 수집':'';
  function payload(p,v,channel,contact,requestId,confirmedAt){
    const tab=tabOf(p);if(!tab)throw Error('시트에서 가져온 크리에이터를 먼저 골라 주세요.');
    const names=[...new Set([p.realName,p.alias,p.name].filter(Boolean))];
    if(!names.length||!contact)throw Error('이름과 실제로 보낸 연락처를 확인해 주세요.');
    return {requestId,confirmed:true,confirmedAt,tab,names,researchKey:p.researchKey||'',channel,contact,seen:String(v||''),originalSeen:String(p.seen||'')};
  }
  function createBridge(url,env){
    env=env||root;
    let iframe=null,nonce='',peer=null,peerOrigin='',loading=null,ready=false,pending=null,loadTimer=null;
    const remote=new URL(url);
    if(remote.origin!=='https://script.google.com'||!/^\/(?:a\/macros\/cre8orclub\.com\/s|macros\/s)\/[\w-]+\/exec$/.test(remote.pathname))throw Error('Google 시트 연결 주소를 확인해 주세요.');
    const err=m=>Object.assign(new Error(m),{connection:true});
    function reset(){
      ready=false;peer=null;peerOrigin='';loading=null;clearTimeout(loadTimer);
      if(iframe)iframe.remove();iframe=null;
    }
    function connect(){
      if(ready)return Promise.resolve();if(loading)return loading;
      nonce=env.crypto.randomUUID();
      loading=new Promise((resolve,reject)=>{
        const onReady=e=>{
          const m=e.data;
          if(!m||m.type!=='c8-sheet-ready'||m.nonce!==nonce||!/^https:\/\/[a-z0-9-]+\.googleusercontent\.com$/.test(e.origin))return;
          env.removeEventListener('message',onReady);clearTimeout(loadTimer);
          if(!m.ok){reset();reject(err(m.error||'Google 시트에 연결하지 못했어요.'));return;}
          peer=e.source;peerOrigin=e.origin;ready=true;resolve();
        };
        env.addEventListener('message',onReady);
        loadTimer=setTimeout(()=>{env.removeEventListener('message',onReady);reset();reject(err('Google 시트 연결이 필요해요. 「Google 연결 열기」에서 로그인한 뒤 다시 눌러 주세요.'));},20000);
        iframe=env.document.createElement('iframe');iframe.title='Google 시트 연락 기록 연결';iframe.hidden=true;
        const u=new URL(remote);u.hash=nonce;iframe.src=u.href;env.document.body.appendChild(iframe);
      });return loading;
    }
    env.addEventListener('message',e=>{
      const m=e.data;
      if(!pending||e.source!==peer||e.origin!==peerOrigin||!m||m.type!=='c8-sheet-result'||m.nonce!==nonce||m.requestId!==pending.id)return;
      const q=pending;pending=null;clearTimeout(q.timer);
      if(m.error)q.reject(new Error(m.error));
      else if(!m.result||m.result.requestId!==q.id||m.result.ok!==true)q.reject(new Error('시트 저장 결과를 확인하지 못했어요.'));
      else q.resolve(m.result);
    });
    async function write(p){
      if(pending)throw Error('앞선 연락 기록을 저장 중이에요.');
      await connect();
      if(pending)throw Error('앞선 연락 기록을 저장 중이에요.');
      return new Promise((resolve,reject)=>{
        pending={id:p.requestId,resolve,reject,timer:setTimeout(()=>{pending=null;reset();reject(new Error('시트 저장 응답이 늦어요. 같은 기록을 다시 확인해 주세요.'));},45000)};
        peer.postMessage({type:'c8-sheet-record',nonce,payload:p},peerOrigin);
      });
    }
    return {write,reset,connect,url:remote.href};
  }
  const api={payload,tabOf,createBridge,origin};if(typeof module==='object'&&module.exports)module.exports=api;else root.ContactSheet=api;
})(typeof window!=='undefined'?window:globalThis);
