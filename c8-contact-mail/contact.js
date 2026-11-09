/* Contact message templates, filling and checks. Pure functions only: no network, no storage, no candidate data. */
(function(root){
  'use strict';
  const LINKS={app:'https://app.cre8orclub.com',form:'https://forms.gle/t22LtA8dTVBrUc2X8',chat:'https://open.kakao.com/o/pPlfzgWi'};
  // Reward terms live in one place so a grade-based amount decision changes only this line.
  const REWARD={per:'1만 원',max:5,total:'5만 원'};
  const COMPANY={name:'㈜라텔앤드파트너즈',address:'서울특별시 중구 필동로 16 참그루빌딩 2층',email:'support@cre8orclub.com'};
  const TRUST='크리에이터클럽은 입금·계좌번호·비밀번호·신분증을 요청하지 않아요.';
  const VARS=[
    {key:'활동명',required:true,field:'v-name'},
    {key:'담당자명',required:true,field:'v-sender'},
    {key:'플랫폼',required:true,field:'v-platform'},
    {key:'게시물 주소',required:true,field:'v-post'},
    {key:'본 것 한 줄',required:false,field:'v-seen'},
    {key:'작품명',required:false,field:'v-work'}
  ];
  const DEFAULTS={
    email:{
      subject:'{활동명}님, 크리에이터클럽에서 인사드려요',
      body:[
        '안녕하세요, {활동명}님. 크리에이터클럽을 만들고 있는 {담당자명}이에요.',
        '{플랫폼}에 올려 주신 작업들을 봤어요. {본 것 한 줄}',
        '보다가 문득, 이 작업들이 크리에이터클럽에서도 소개되면 좋겠다 싶어서 연락드려요.',
        '',
        '크리에이터클럽은 「당신의 작업이 무대가 되는 곳」이에요. 올려 둔 작업을 알리고, 그 작업에 공감하는 창작자를 만나고, 함께 일할 사람도 여기서 찾아요. 전문가에게 작업의 가치를 인정받고, 새로운 협업으로 이어지는 자리를 만들어 가고 있어요.',
        '',
        '그 시작을 {활동명}님과 함께하고 싶어요. 기존 작업을 포트폴리오로 올려 주시면, 감사의 뜻으로 **작업 1개당 신세계 모바일 상품권 '+REWARD.per+'**을 드려요. 최대 '+REWARD.max+'개, 총 '+REWARD.total+'까지요.',
        '새로 만드실 건 없어요. 아래 두 가지만 해 주시면 돼요.',
        '',
        '1. [크리에이터클럽 앱]('+LINKS.app+')을 받아 기존 작업을 포트폴리오로 올려 주세요.',
        '2. [참여 신청서]('+LINKS.form+')에 포트폴리오 링크를 남겨 주세요.',
        '',
        '확인하고 **매주 화요일에 상품권을 보내 드려요.**',
        '궁금한 게 있으면 이 메일에 답장 주셔도 되고, [오픈채팅방]('+LINKS.chat+')에서 물어보셔도 돼요. 바쁘시면 답 안 주셔도 괜찮아요.',
        '',
        '긴 글 읽어 주셔서 고마워요. 앞으로의 작업도 계속 보고 있을게요.'
      ].join('\n'),
      signature:'{담당자명} · 크리에이터클럽\n당신의 작업이 무대가 되는 곳, Cre8orClub',
      footer:'답이 없으시면 다시 연락드리지 않을게요. '+TRUST+'\n'+COMPANY.name+' | '+COMPANY.address+' | ['+COMPANY.email+'](mailto:'+COMPANY.email+')'
    },
    dm:{
      // A message request reaches someone who doesn't follow us as one text-only message, so the offer and links travel together.
      message:[
        '안녕하세요, {활동명}님.',
        '크리에이터클럽을 만들고 있는 {담당자명}이에요.',
        '',
        '올려 주신 게시물({게시물 주소})을 보고 인사드리고 싶어서 연락드렸어요. {본 것 한 줄}',
        '이 작업이 더 많은 창작자에게 닿고, 새로운 협업으로도 이어지면 좋겠다 싶었어요.',
        '',
        '크리에이터클럽은 「당신의 작업이 무대가 되는 곳」이에요. 작업을 알리고, 공감하는 창작자를 만나고, 함께 일할 사람을 찾는 앱이에요.',
        '',
        '기존 작업을 포트폴리오로 올려 주시면, 감사의 뜻으로 작업 1개당 신세계 모바일 상품권 '+REWARD.per+'을 드려요(최대 '+REWARD.max+'개). 올리신 뒤 신청서에 링크만 남겨 주시면 매주 화요일에 보내 드려요.',
        '· 앱: '+LINKS.app,
        '· 신청서: '+LINKS.form,
        '· 궁금한 점(오픈채팅): '+LINKS.chat,
        '링크가 안 눌리면 앱스토어에서 「크리에이터클럽」을 검색해 주세요.',
        '',
        '바쁘시면 답 안 주셔도 괜찮아요. '+TRUST
      ].join('\n')
    }
  };
  const SUBJECT_ALTERNATIVES=['「{작품명}」 보고 연락드려요','{활동명}님 작업을 크리에이터클럽에 소개하고 싶어요'];
  // Legal ad labelling (정보통신망법 시행령 별표 6). Off until legal review decides; the switch lives in the editor.
  const AD={
    subjectPrefix:'(광고) ',
    emailBlock:p=>'전송자: '+COMPANY.name+' · 전화 '+p+' · '+COMPANY.address+' · '+COMPANY.email+'\n수신을 원치 않으시면 이 메일에 「수신거부」라고 답장해 주세요. 비용은 들지 않아요. To unsubscribe, reply "unsubscribe" to this email.',
    dmHead:p=>'(광고) 크리에이터클럽 · '+p,
    dmTail:'원치 않으시면 답장으로 알려 주세요. 수신거부에 드는 비용은 없어요.'
  };
  const REPLIES={
    optout:'알려 주셔서 고마워요. {날짜}에 수신거부를 받았고, 앞으로 크리에이터클럽에서 연락드리지 않을게요.\n— {담당자명} · '+COMPANY.name,
    source:'{활동명}님 연락처는 {출처}에 공개해 두신 문의 창구에서 봤어요. 작품 소개를 제안드리는 첫 연락에만 썼고, 원하시면 바로 지울게요. 지워 달라고 답장 주시면 처리하고 알려 드릴게요.\n— {담당자명} · '+COMPANY.name
  };
  // Checked only in what the sender types by hand: the fixed wording already passed review. List from the contact plan.
  const AVOID=[
    {re:/구매|상금|이벤트|혜택|마감|선착순|협업 제안|파트너십/g,why:'광고·이벤트처럼 읽혀요'},
    {re:/[ABCD]\s*등급|등급|평가 점수/g,why:'내부 평가는 작가에게 말하지 않아요'},
    {re:/주민(등록)?번호|계좌|비밀번호|신분증/g,why:'첫 연락에서 개인정보를 꺼내면 피싱처럼 읽혀요'}
  ];
  const SHORTENERS=/\/\/(www\.)?(bit\.ly|t\.co|han\.gl|me2\.do|url\.kr|vo\.la|tinyurl\.com|buly\.kr|goo\.gl(?!\/forms)|ow\.ly|is\.gd|cutt\.ly|rebrand\.ly)\//i;
  // night: 21:00–08:00 needs separate consent for ads; we start warning at 20:50 like Kakao brand messages.
  const LIMITS={dmChars:1000,subjectChars:40,seenMax:120,similar:0.7,night:{from:20*60+50,to:8*60,soon:20*60+40}};

  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  /* NFC plus zero-width removal so a pasted look-alike compares equal. */
  const clean=v=>String(v??'').normalize('NFC').replace(/[​-‍﻿]/g,'').replace(/\s+/g,' ').trim();
  const MARK_ON='\u0001',MARK_OFF='\u0002';

  /* Replace {변수}. An empty optional token takes its surrounding space with it so no double space or blank line remains.
     mark=true wraps filled values for the preview's 「바뀌는 부분 보기」; copies never use it. */
  function fill(text,values,mark){
    const known=new Set(VARS.map(v=>v.key).concat(Object.keys(values||{})));
    let out=String(text).replace(/\{([^{}\n]+)\}/g,(m,k)=>{
      k=k.trim();
      if(!known.has(k))return m;
      const v=clean((values||{})[k]);
      return v?(mark?MARK_ON+v+MARK_OFF:v):'\u0000';
    });
    out=out.replace(/[ \t]*\u0000[ \t]*/g,' ').replace(/ +\n/g,'\n').replace(/\n +/g,'\n').replace(/ {2,}/g,' ').replace(/ ([.,)」])/g,'$1');
    return out.split('\n').map(l=>l.trim()===''?'':l.replace(/\s+$/,'')).join('\n').replace(/\n{3,}/g,'\n\n').trim();
  }
  const unmark=s=>String(s).replace(/[\u0001\u0002]/g,'');
  const markHtml=h=>h.replace(/\u0001/g,'<mark style="background:#fff3a3; color:inherit;">').replace(/\u0002/g,'</mark>');
  function tokens(text){return [...String(text).matchAll(/\{([^{}\n]+)\}/g)].map(m=>m[1].trim());}

  /* Minimal markup: **굵게**, [글자](주소), 「1. 」로 시작하는 줄은 번호 목록, 빈 줄은 문단. */
  function inlineHtml(s){
    let h=esc(s);
    h=h.replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^)\s]+)\)/g,(m,t,u)=>'<a href="'+u.replace(/[\u0001\u0002]/g,'')+'" style="color:#111111; text-decoration:underline;">'+t+'</a>');
    h=h.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
    return markHtml(h);
  }
  function inlinePlain(s){
    return unmark(String(s).replace(/\[([^\]]+)\]\(mailto:([^)\s]+)\)/g,'$2').replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,'$1($2)').replace(/\*\*([^*]+)\*\*/g,'$1'));
  }
  function blocks(text){return String(text).split(/\n{2,}/).map(p=>p.split('\n').filter(l=>l.trim()!=='')).filter(p=>p.length);}
  const P='margin:0 0 16px; font-size:15px; line-height:1.7; color:#111111;';
  function bodyHtml(text){
    return blocks(text).map(lines=>{
      if(lines.every(l=>/^\d+\.\s/.test(l)))return '<ol style="margin:0 0 16px; padding-left:22px; font-size:15px; line-height:1.7; color:#111111;">'+lines.map(l=>'<li style="margin:0 0 4px;">'+inlineHtml(l.replace(/^\d+\.\s/,''))+'</li>').join('')+'</ol>';
      return '<p style="'+P+'">'+lines.map(inlineHtml).join('<br>')+'</p>';
    }).join('\n');
  }
  function signatureHtml(signature,footer){
    const [who,...rest]=String(signature).split('\n').filter(l=>l.trim());
    return '<p style="margin:24px 0 4px; font-size:15px; line-height:1.6; color:#111111; font-weight:600;">'+inlineHtml(who||'')+'</p>'+
      (rest.length?'<p style="margin:0 0 20px; font-size:13px; line-height:1.6; color:#6b6b6b;">'+rest.map(inlineHtml).join('<br>')+'</p>':'')+
      (footer?'<p style="margin:0; padding-top:12px; border-top:1px solid #e5e5e5; font-size:12px; line-height:1.6; color:#8a8a8a;">'+footer.split('\n').filter(l=>l.trim()).map(inlineHtml).join('<br>')+'</p>':'');
  }
  /* A plain personal-looking email: no banner, no images, no hidden preheader (Safari drops display:none on copy). */
  function emailHtml(subject,body,signature,footer){
    return '<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>'+esc(unmark(subject))+'</title>\n</head>\n'+
      '<body style="margin:0; padding:0; background:#ffffff;">\n<div style="max-width:600px; padding:8px 4px; font-family:-apple-system,\'Apple SD Gothic Neo\',\'Malgun Gothic\',\'맑은 고딕\',sans-serif; color:#111111; word-break:keep-all;">\n'+
      bodyHtml(body)+'\n'+signatureHtml(signature,footer)+'\n</div>\n</body>\n</html>\n';
  }
  function plain(text){return blocks(text).map(lines=>lines.map(inlinePlain).join('\n')).join('\n\n');}

  /* opts: footer (default true), ad {phone}, mark (preview only). */
  function render(tpl,values,opts){
    const v=values||{},o=opts||{},mark=!!o.mark,ad=o.ad&&o.ad.on;
    const phone=clean(o.ad&&o.ad.phone)||'(전화번호)';
    const subject=(ad?AD.subjectPrefix:'')+fill(tpl.email.subject,v,mark);
    const body=fill(tpl.email.body,v,mark);
    const signature=fill(tpl.email.signature,v,mark);
    const footerOn=ad||o.footer!==false;
    const footer=[footerOn?fill(tpl.email.footer||'',v,mark):'',ad?AD.emailBlock(phone):''].filter(Boolean).join('\n');
    const dmCore=fill(tpl.dm.message,v,mark);
    const dm=[ad?AD.dmHead(phone):'',dmCore,ad?AD.dmTail:''].filter(Boolean).join('\n\n');
    const emailText=plain(body)+'\n\n'+plain(signature)+(footer?'\n\n'+plain(footer):'');
    return {
      subject:unmark(subject),subjectMarked:subject,
      emailHtml:emailHtml(subject,body,signature,footer),
      emailText,dm:plain(dm),dmMarked:dm.replace(/\*\*([^*]+)\*\*/g,'$1')
    };
  }
  function reply(kind,values){return fill(REPLIES[kind],values||{});}

  /* Character trigram containment: shared trigrams over the smaller side, so a line that only swaps a title still matches. */
  function grams(s){const t=clean(s).replace(/[\s.,!?·「」『』"'()~…]/g,'');const g=new Set();for(let i=0;i<t.length-2;i++)g.add(t.slice(i,i+3));return g;}
  function similarity(a,b){
    const A=grams(a),B=grams(b);if(!A.size||!B.size)return 0;
    let n=0;A.forEach(x=>{if(B.has(x))n++;});return n/Math.min(A.size,B.size);
  }
  /* Instagram and most counters see what people see: grapheme clusters, not code units. */
  function chars(s){
    s=String(s);
    if(typeof Intl!=='undefined'&&Intl.Segmenter){let n=0;for(const _ of new Intl.Segmenter('ko',{granularity:'grapheme'}).segment(s))n++;return n;}
    return [...s].length;
  }
  function seoulMinutes(now){
    const d=now instanceof Date?now:new Date(now);
    const [h,m]=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',hour12:false}).format(d).split(':').map(Number);
    return (h%24)*60+m;
  }
  function links(text){return [...String(text).matchAll(/https?:\/\/[^\s)<>"']+/g)].map(m=>m[0].replace(/[.,]$/,''));}

  /* Each check: level block = 복사 막음, warn = 보내기 전에 보기. field = 눌렀을 때 옮겨 갈 입력칸 id. */
  function check(tpl,values,opts){
    const o=opts||{},v=values||{},out=[];
    const channel=o.channel==='dm'?'dm':'email';
    const add=(level,code,msg,field)=>out.push({level,code,msg,field:field||''});
    const used=channel==='email'?[tpl.email.subject,tpl.email.body,tpl.email.signature,o.footer===false?'':tpl.email.footer||'']:[tpl.dm.message];
    const usedKeys=new Set(used.flatMap(tokens));
    const known=new Set(VARS.map(x=>x.key));
    usedKeys.forEach(k=>{if(!known.has(k))add('block','unknown','모르는 칸 {'+k+'}이 문구에 있어요. 칸 이름을 고치거나 지워 주세요.');});
    VARS.forEach(x=>{if(usedKeys.has(x.key)&&x.required&&!clean(v[x.key]))add('block','empty:'+x.key,'「'+x.key+'」 칸이 비어 있어요.',x.field);});
    const name=clean(v['활동명']);
    if(/님$/.test(name))add('warn','name-nim','활동명 끝에 「님」이 있어요. 문구에 이미 「님」이 붙어 「'+name+'님」이 돼요.','v-name');
    const seen=clean(v['본 것 한 줄']);
    if(usedKeys.has('본 것 한 줄')){
      if(!seen)add('warn','seen-empty','「본 것 한 줄」이 비어 있어요. 이 분에게만 맞는 한 문장이 있으면 답장이 와요.','v-seen');
      else{
        if(chars(seen)>LIMITS.seenMax)add('warn','seen-long','「본 것 한 줄」이 '+chars(seen)+'자예요. 한 문장('+LIMITS.seenMax+'자 안)으로 줄여 주세요.','v-seen');
        if(!/[.!?요다]$/.test(seen))add('warn','seen-end','「본 것 한 줄」을 완결된 문장으로 끝내 주세요(예: …생각났어요.).','v-seen');
        let best=null;
        (o.history||[]).filter(h=>h&&h.seen&&clean(h.name)!==name).forEach(h=>{const s=clean(h.seen)===seen?1:similarity(seen,h.seen);if(!best||s>best.s)best={s,h};});
        // Copying the same line to several people is the one thing the plan forbids; a near-copy only warns.
        if(best&&best.s>=1&&clean(best.h.seen)===seen)add('block','seen-same','「본 것 한 줄」이 '+best.h.name+'님에게 쓴 문장과 똑같아요. 이 분 작품에서 본 걸로 다시 써 주세요.','v-seen');
        else if(best&&best.s>=LIMITS.similar)add('warn','seen-similar','「본 것 한 줄」이 '+best.h.name+'님에게 쓴 문장과 '+Math.round(best.s*100)+'% 겹쳐요: 「'+clean(best.h.seen)+'」','v-seen');
      }
    }
    const r=render(tpl,v,o);
    const text=channel==='email'?r.subject+'\n'+r.emailText:r.dm;
    const typed=[v['본 것 한 줄'],v['활동명'],v['작품명']].map(clean).join('\n');
    AVOID.forEach(a=>{const m=typed.match(a.re);if(m)add('warn','avoid','손으로 쓴 칸의 「'+[...new Set(m)].join('·')+'」 — '+a.why+'.');});
    if(/\{[^{}\n]+\}/.test(text))add('block','leftover','채워지지 않은 {칸}이 남아 있어요.');
    // Links: the three canonical ones must survive any one-off edit, over https, never shortened.
    const all=channel==='email'?[...r.emailHtml.matchAll(/href="([^"]+)"/g)].map(m=>m[1]).filter(u=>!/^mailto:/.test(u)).concat(links(r.subject)):links(r.dm);
    const missing=[['app','앱'],['form','신청서'],['chat','오픈채팅']].filter(([k])=>!all.includes(LINKS[k]));
    missing.forEach(([k,label])=>add('block','link-missing:'+k,label+' 링크('+LINKS[k]+')가 문구에서 빠졌어요.'));
    all.filter(u=>/^http:\/\//i.test(u)).forEach(u=>add('block','link-http','https가 아닌 링크가 있어요: '+u));
    all.filter(u=>SHORTENERS.test(u)).forEach(u=>add('block','link-short','단축 주소는 사기 링크처럼 보여요: '+u));
    if(channel==='email')[...r.emailHtml.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].forEach(m=>{const t=m[2].trim();if(/^https?:\/\//.test(t)&&t!==m[1])add('block','link-text','링크 글자와 실제 주소가 달라요: '+t);});
    const known3=new Set(Object.values(LINKS)),post=clean(v['게시물 주소']);
    [...new Set(all)].filter(u=>!known3.has(u)&&u!==post).forEach(u=>add('warn','link-other','정해진 링크 말고 다른 링크가 있어요: '+u));
    if(channel==='dm'&&post){
      let ok=false;try{const u=new URL(post);ok=/(^|\.)instagram\.com$/.test(u.hostname)&&/^\/(p|reel|reels)\/[^/]+/.test(u.pathname);}catch(e){}
      if(!ok)add('warn','post-url','게시물 주소가 인스타 게시물(instagram.com/p/… 또는 /reel/…) 모양이 아니에요.','v-post');
    }
    if(o.ad&&o.ad.on){
      if(!clean(o.ad.phone))add('block','ad-phone','광고 표기에는 회사 전화번호가 들어가야 해요.','adPhone');
      if(channel==='email'&&!r.subject.startsWith('(광고)'))add('block','ad-subject','제목이 「(광고)」로 시작해야 해요.');
      if(/[(\[]\s*광\W+고\s*[)\]]|\[광고\]/.test(text))add('block','ad-variant','「(광고)」는 빈칸·부호 없이 그대로 써야 해요.');
    }
    if(channel==='email'){
      if(chars(r.subject)>LIMITS.subjectChars)add('warn','subject-long','제목이 '+chars(r.subject)+'자예요. 휴대폰 받은편지함에서 '+LIMITS.subjectChars+'자 뒤는 잘려요.');
      if(o.to&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(o.to)))add('warn','to','받는 주소 형식을 확인해 주세요.','to');
    }else if(chars(r.dm)>LIMITS.dmChars)add('warn','dm-long','DM이 '+chars(r.dm)+'자예요. 인스타 앱 한도는 확인되지 않았어요. '+LIMITS.dmChars+'자 안으로 줄이면 안전해요.','v-seen');
    if(o.now!=null){
      const t=seoulMinutes(o.now),N=LIMITS.night;
      if(t>=N.from||t<N.to)add('warn','night',channel==='email'?'지금은 밤(20:50~08:00)이에요. 보내려면 Gmail 「예약 전송」으로 아침 8시 10분 뒤를 고르세요.':'지금은 밤(20:50~08:00)이에요. 인스타는 예약 전송이 없으니 아침 8시 뒤에 보내 주세요.');
      else if(t>=N.soon)add('warn','night-soon','10분 안에 밤 시간(20:50)이 돼요. 그 전에 보내거나 아침에 보내 주세요.');
    }
    if(o.sentBefore)add('block','sent','이 분에게는 '+o.sentBefore+'에 이미 보냈어요. 답이 없으면 다시 보내지 않아요.');
    return out;
  }

  const api={LINKS,REWARD,COMPANY,TRUST,VARS,DEFAULTS,SUBJECT_ALTERNATIVES,AD,REPLIES,LIMITS,fill,tokens,render,reply,plain,emailHtml,similarity,check,chars,seoulMinutes,clean};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.ContactMail=api;
})(typeof self!=='undefined'?self:this);
