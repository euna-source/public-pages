/* Run as a bookmark on the signed-in Google Sheet. Read-only export. */
async function weeklyBestBridge(){
  const id='1sp429sp0G-xega9RBvcPw0phOd9Ju5bkuzgo5r4gE1Y';
  const target='https://euna-source.github.io/public-pages/c8-weeklybest-mail/';
  if(location.origin!=='https://docs.google.com'||!location.pathname.includes('/spreadsheets/d/'+id+'/')){
    alert('당첨자 관리 시트의 주차별 탭에서 이 북마크를 눌러 주세요.');return;
  }
  const gid=new URLSearchParams(location.hash.slice(1)).get('gid')||new URL(location.href).searchParams.get('gid')||'0';
  const win=window.open(target+'#sheet-import','c8-weeklybest-import');
  if(!win){alert('팝업을 허용한 뒤 다시 눌러 주세요.');return;}
  let timer,timeout;
  const end=()=>{clearInterval(timer);clearTimeout(timeout);window.removeEventListener('message',ack);};
  function ack(e){if(e.origin===new URL(target).origin&&e.source===win&&e.data?.type==='c8-weekly-import-ack')end();}
  try{
    const url=location.origin+'/spreadsheets/d/'+id+'/export?format=csv&gid='+encodeURIComponent(gid);
    const res=await fetch(url,{credentials:'same-origin'});
    if(!res.ok)throw Error('시트를 읽지 못했어요 ('+res.status+'). Google 로그인 상태를 확인해 주세요.');
    if(!(res.headers.get('content-type')||'').includes('csv'))throw Error('CSV를 받지 못했어요. 주차별 탭과 로그인 상태를 확인해 주세요.');
    const csv=await res.text();if(csv.length>1000000)throw Error('표가 너무 커요. 주차별 탭을 선택해 주세요.');
    const payload={type:'c8-weekly-import',spreadsheetId:id,gid,csv};
    window.addEventListener('message',ack);
    timer=setInterval(()=>{if(win.closed){end();return;}win.postMessage(payload,new URL(target).origin);},500);
    timeout=setTimeout(()=>{end();alert('편집기로 연결하지 못했어요. 편집기의 파일 가져오기로 시트 CSV를 불러와 주세요.');},30000);
  }catch(e){end();alert(e.message);}
}
