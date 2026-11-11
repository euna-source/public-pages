/* Contact message templates, filling and checks. Pure functions only: no network, no storage, no candidate data. */
(function(root){
  'use strict';
  const LINKS={app:'https://app.cre8orclub.com',form:'https://forms.gle/t22LtA8dTVBrUc2X8',chat:'https://open.kakao.com/o/pPlfzgWi',
    // One page that carries the app, the form and the chat; the mail points here instead of listing all three.
    hub:'https://litt.ly/cre8orclub'};
  // Reward terms live in one place so a grade-based amount decision changes only this line.
  const REWARD={per:'1만 원',max:5,total:'5만 원'};
  const COMPANY={name:'㈜라텔앤드파트너즈',address:'서울특별시 중구 필동로 16 참그루빌딩 2층',email:'support@cre8orclub.com'};
  const TRUST='크리에이터클럽은 입금·계좌번호·비밀번호·신분증을 요청하지 않습니다.';
  const VARS=[
    {key:'활동명',required:true,field:'v-name'},
    {key:'담당자명',required:true,field:'v-sender'},
    {key:'플랫폼',required:false,field:'v-platform'},
    {key:'게시물 주소',required:true,field:'v-post'},
    {key:'본 것 한 줄',required:false,field:'v-seen'},
    {key:'작품명',required:false,field:'v-work'}
  ];
  const DEFAULTS={
    // Same sections as the Weekly Best award mail so both mails read as one family.
    // The applied mail (2026-11-10): sent as the team, one link to the hub page.
    email:{
      subject:'[크리에이터클럽] {활동명}님께 작품 소개 협업을 제안드려요',
      preheader:'{활동명}님께 기존 작업을 소개하는 협업을 제안드려요.',
      headline:'{활동명}님께\n작품 소개 협업을 제안드려요',
      greeting:[
        '안녕하세요, **{활동명}님!**',
        '창작자를 위한 포트폴리오·네트워크 앱, 크리에이터클럽입니다.',
        '',
        '{활동명}님의 {플랫폼} 작업을 보고 연락드렸어요.',
        '{본 것 한 줄}'
      ].join('\n'),
      intro:'크리에이터클럽은 다양한 분야의 창작자들이 자신의 작업을 소개하고 서로의 작품을 발견할 수 있는 공간이에요. {활동명}님의 작업도 크리에이터클럽에서 소개하고 싶어 이번 협업을 제안드려요.',
      gift:'이번 제안은 기존에 제작하신 작업을 포트폴리오로 소개하는 방식이며, 참여해 주시는 작업에 대해서는 감사의 마음을 담아 소정의 사례를 제공하고 있어요.',
      steps:'관심있으시다면 아래 링크를 눌러주세요.\n[👉 협업 제안 자세히 보기]('+LINKS.hub+')',
      ask:'궁금한 점은 언제든 이 메일로 편하게 회신해 주세요.',
      closing:'감사합니다.',
      signature:'크리에이터클럽 드림',
      footer:'본 메일은 공개하신 연락처로 개별적으로 보내드리는 제안입니다. 원치 않으시면 추가 연락을 드리지 않겠습니다. '+TRUST
    },
    dm:{message:[
      '안녕하세요, {활동명}님!',
      '창작자를 위한 포트폴리오·네트워크 앱, 크리에이터클럽입니다.',
      '', '{본 것 한 줄}', '',
      '크리에이터클럽은 자신의 작업을 알리고, 그 가치를 알아보는 동료를 만나 새로운 협업을 시작하는 공간이에요.',
      '',
      '기존 작업을 포트폴리오로 올려 주시면 1개당 신세계 모바일 상품권 '+REWARD.per+', 최대 '+REWARD.total+'을 드려요. 참여 방법은 다음 링크에서 확인해 주세요.',
      LINKS.hub, '',
      '궁금한 점은 편하게 답장 주세요.',
      '{활동명}님의 멋진 작업을 크리에이터클럽에서도 만나볼 수 있으면 좋겠습니다!'
    ].join('\n')}

  };
  // Field wordings of the mail: only the sections that differ from DEFAULTS.email. The opening sentence is the sender's own
  // phrase plus 이/가, because a song or an album does not read as 「○○님의 … 작업」.
  const EMAIL_VARIANTS={
    music:{
      label:'음악',
      match:/음악|음원|작곡|작사|편곡|보컬|싱어|가수|뮤지션|프로듀서|밴드|연주|래퍼|비트메이커|사운드/,
      greeting:[
        '안녕하세요, **{활동명}님!**',
        '창작자를 위한 포트폴리오·네트워크 앱, 크리에이터클럽입니다.',
        '',
        '{플랫폼}{이/가} 인상 깊어 연락드렸어요.',
        '{본 것 한 줄}'
      ].join('\n')
    }
  };
  const DM_VARIANTS={music:{message:[
    '안녕하세요, {활동명}님!',
    '창작자를 위한 포트폴리오·네트워크 앱, 크리에이터클럽입니다.',
    '', '{본 것 한 줄}', '',
    '이런 음악을 더 많은 창작자에게 소개하고 싶어 연락드렸어요.', '',
    '크리에이터클럽은 자신의 작업을 알리고, 그 가치를 알아보는 동료를 만나 새로운 협업을 시작하는 공간이에요.', '',
    '특히 김형석 작곡가 겸 프로듀서님도 크리에이터클럽의 투자자이자 크리에이터로 직접 활동하고 계세요. {활동명}님처럼 자신만의 음악 세계를 만들어가는 분들과도 함께하고 싶어요.', '',
    '지금은 기존 작업을 포트폴리오로 올려 주시면 1개당 신세계 모바일 상품권 '+REWARD.per+', 최대 '+REWARD.total+'을 드리고 있어요.', '',
    '참여 방법은 다음 링크에서 확인해 주세요.', LINKS.hub, '',
    '궁금한 점은 언제든 편하게 답장 주세요.',
    '{활동명}님의 음악을 크리에이터클럽에서도 만나볼 수 있으면 좋겠습니다!'
  ].join('\n')}};
  // User-provided examples are preview-only; choosing a real recipient never fills these observations.
  const EMAIL_EXAMPLE={'활동명':'티티워크룸','플랫폼':'인스타그램','본 것 한 줄':'최근에 올리신 🎃 할로윈 쿠키박스 영상과 홈페이지는 티티워크룸님만의 추구미와 감도 높은 미적감각이 느껴졌어요. 다음에는 또 어떤 새로운 작업을 보여주실지 기대가 됐어요!'};
  const DM_EXAMPLES={
    basic:{'활동명':'고산타','본 것 한 줄':'고산타님 그림은 색감부터 너무너무 제 취향이에요… 몽글몽글 귀여운데 보고 있으면 괜히 마음까지 따뜻해져요,, 그래서 고산타님을 저희 앱에 초대하고 싶어 사심을 담아 연락드립니다!'},
    music:{'활동명':'지넥스','본 것 한 줄':'최근 발매하신 앨범 《동화》의 수록곡 「곁」을 정말 좋게 들었어요. 부드러운 미성과 섬세한 가성이 어우러진 감미로운 음색이 인상 깊었어요. 특히 90년대 솔리드가 떠오르는 R&B 감성이 느껴지면서도, 지넥스님만의 색깔로 풀어낸 음악이 참 매력적이었어요.'}
  };
  const variantKey=v=>Object.prototype.hasOwnProperty.call(EMAIL_VARIANTS,v)?v:'basic';
  /* The full wording for one variant ('basic' or a key of EMAIL_VARIANTS), as a fresh copy. */
  function template(variant){
    const t=JSON.parse(JSON.stringify(DEFAULTS)),o=EMAIL_VARIANTS[variantKey(variant)];
    if(o)EMAIL_SECTIONS.forEach(k=>{if(typeof o[k]==='string')t.email[k]=o[k];});
    if(DM_VARIANTS[variantKey(variant)])t.dm.message=DM_VARIANTS[variantKey(variant)].message;
    return t;
  }
  /* Which variant a candidate's 분야 points to. */
  function variantOf(field){const f=clean(field);return Object.keys(EMAIL_VARIANTS).find(k=>EMAIL_VARIANTS[k].match.test(f))||'basic';}
  const SUBJECT_TYPES=[
    {name:'창작자 중심',template:'[크리에이터클럽] {활동명}님께 작품 소개 협업을 제안드려요',audience:'작품 전반의 스타일이 인상적인 창작자'},
    {name:'작품 중심',template:'[크리에이터클럽] {작품명}{을/를} 보고 연락드렸어요',audience:'개별 작품의 개성이 강한 창작자'},
    {name:'제안 중심',template:'[크리에이터클럽] {활동명}님께 드리는 포트폴리오 제안',audience:'스튜디오·디자인 에이전시·전문 창작자'}
  ];
  const SUBJECT_ALTERNATIVES=SUBJECT_TYPES.slice(1).map(t=>t.template);
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
  const LIMITS={dmChars:1000,subjectChars:40,seenMax:120,dmSeenMax:500,similar:0.7,night:{from:20*60+50,to:8*60,soon:20*60+40}};

  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  /* NFC plus zero-width removal so a pasted look-alike compares equal. */
  const clean=v=>String(v??'').normalize('NFC').replace(/[​-‍﻿]/g,'').replace(/\s+/g,' ').trim();
  const prose=v=>String(v??'').normalize('NFC').replace(/[​-‍﻿]/g,'').replace(/\r\n?/g,'\n').trim();
  const MARK_ON='\u0001',MARK_OFF='\u0002';

  /* 이/가 after a filled value: by the last letter's 받침, looking past closing quotes and brackets. */
  const PARTICLE='{이/가}';
  function subjectParticle(before){
    const s=String(before).replace(/[\u0001\u0002]/g,''),m=s.match(/([가-힣A-Za-z0-9])[^가-힣A-Za-z0-9]*$/);
    if(!m)return '이';
    const c=m[1];
    if(/[가-힣]/.test(c))return (c.charCodeAt(0)-0xAC00)%28?'이':'가';
    if(/[0-9]/.test(c))return /[013678]/.test(c)?'이':'가';
    // Latin is a guess by how the last letter is usually read (엘·엠·엔·알, -ng); the sender can still fix the wording by hand.
    return /[lmnLMNR]/.test(c)||/ng[^A-Za-z]*$/.test(s)?'이':'가';
  }
  /* Replace {변수}. An empty optional token takes its surrounding space with it so no double space or blank line remains.
     mark=true wraps filled values for the preview's 「바뀌는 부분 보기」; copies never use it. */
  function fill(text,values,mark){
    const known=new Set(VARS.map(v=>v.key).concat(Object.keys(values||{})));
    let source=String(text).replace(/\r\n?/g,'\n');
    if(!clean((values||{})['플랫폼']))source=source.replace('{활동명}님의 {플랫폼} 작업을 보고 연락드렸어요.','{활동명}님의 작업을 보고 연락드렸어요.').replace('{플랫폼}{이/가} 인상 깊어 연락드렸어요.','{활동명}님의 음악을 듣고 연락드렸어요.');
    let out=source.replace(/\{([^{}\n]+)\}/g,(m,k)=>{
      k=k.trim();
      if(!known.has(k))return m;
      // Observation is prose: keep its line structure; identifiers remain single-line.
      const raw=(values||{})[k];
      const v=k==='본 것 한 줄'?prose(raw):clean(raw);
      const on=mark&&(mark===true||(mark.has&&mark.has(k)));
      return v?(on?v.split('\n').map(line=>line?MARK_ON+line+MARK_OFF:'').join('\n'):v):'\u0000';
    });
    out=out.split(PARTICLE).reduce((a,b)=>a+subjectParticle(a.slice(a.lastIndexOf('\n')+1))+b);
    out=out.split('{을/를}').reduce((a,b)=>a+(subjectParticle(a.slice(a.lastIndexOf('\n')+1))==='이'?'을':'를')+b);
    // Omitted optional paragraphs are removed; intentional user blank lines stay.
    out=out.replace(/\n\n[ \t]*\u0000[ \t]*\n\n/g,'\n\n').replace(/(^|\n)[ \t]*\u0000[ \t]*(\n|$)/g,(m,a,b)=>a&&b?'\n':'');
    out=out.replace(/[ \t]*\u0000[ \t]*/g,' ').replace(/ +\n/g,'\n').replace(/\n +/g,'\n').replace(/ {2,}/g,' ').replace(/ ([.,)」])/g,'$1');
    return out.split('\n').map(l=>l.trim()===''?'':l.replace(/\s+$/,'')).join('\n').trim();
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
    return unmark(String(s).replace(/\[([^\]]+)\]\(mailto:([^)\s]+)\)/g,'$2').replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,(m,t,u)=>t===u?u:t+'('+u+')').replace(/\*\*([^*]+)\*\*/g,'$1'));
  }
  function blocks(text){
    const out=[];
    String(text).split(/(\n{2,})/).forEach(part=>{
      if(/^\n{2,}$/.test(part)){
        // Two Enters create the paragraph gap; additional Enters remain empty lines.
        if(out.length)out[out.length-1].push(...Array(part.length-2).fill(''));
      }else if(part.trim())out.push(part.split('\n'));
    });
    return out;
  }
  const SECTION_TITLES={gift:'🎁 감사 선물',steps:'📝 참여 방법',ask:'💬 궁금한 점'};
  const EMAIL_SECTIONS=['subject','preheader','headline','greeting','intro','gift','steps','ask','closing','signature','footer'];
  const LOGO='https://euna-source.github.io/public-pages/c8-contact-mail/c8-logo-mark.png';
  const POLICY={privacy:'https://static.cre8orclub.com/policy/privacy-policy-general.html',terms:'https://static.cre8orclub.com/policy/terms-of-service.html'};
  const FONT="'Pretendard','Apple SD Gothic Neo','Malgun Gothic','맑은 고딕',sans-serif";
  /* Lines → html: blank line = paragraph gap, 「1. 」 runs = ordered list, everything else joins with <br>. */
  function richHtml(text,size){
    return blocks(text).map((lines,bi)=>{
      const gap=bi?'margin-top:12px; ':'';
      if(lines.every(l=>/^\d+\.\s/.test(unmark(l))))return '<ol style="'+gap+'margin-bottom:0; padding-left:20px;">'+lines.map(l=>'<li style="margin:0 0 4px;">'+inlineHtml(l.replace(/^(\u0001?)\d+\.\s/,'$1'))+'</li>').join('')+'</ol>';
      return '<div style="'+gap+'">'+lines.map(inlineHtml).join('<br>')+'</div>';
    }).join('');
  }
  // Preserve the brand header and footer; keep the invitation body in one reading column.
  const OUTLINE='outline:2px solid #111111; outline-offset:2px; border-radius:4px;';
  const framed=(html,on)=>on?html.replace(/<td style="/,'<td style="'+OUTLINE+' '):html;
  function designedHtml(p,o){
    const f=k=>o.outline===k;
    const pre=o.withPreheader&&p.preheader?'<div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">'+esc(unmark(p.preheader))+'</div>\n':'';
    const section=(key,pad,extra)=>p[key].trim()?framed('<tr><td style="padding:'+pad+'; font-size:16px; line-height:1.75; color:#333d4b;'+(extra||'')+'">'+richHtml(p[key])+'</td></tr>',f(key)):'';
    const head='        <tr>\n          <td style="background-color:#111111; border-radius:12px 12px 0 0; padding:24px 32px 28px;">\n            <table role="presentation" cellpadding="0" cellspacing="0" border="0">\n              <tr>\n                <td valign="middle" style="vertical-align:middle; line-height:0; font-size:0;"><img src="'+(o.logo||LOGO)+'" width="18" height="30" alt="Cre8orClub" style="display:block; width:18px; height:30px; border:0;"></td>\n                <td valign="middle" style="vertical-align:middle; padding-left:10px; font-size:24px; line-height:30px; font-weight:700; color:#ffffff; padding-top:4px;">Cre8orClub</td>\n              </tr>\n            </table>\n            <div style="margin-top:22px; font-size:25px; line-height:1.45; font-weight:700; color:#ffffff;'+(f('headline')?' outline:2px solid #07ED21; outline-offset:4px;':'')+'">'+String(p.headline).split('\n').map(inlineHtml).join('<br>')+'</div>\n          </td>\n        </tr>\n';
    // Keep editable sections and their order; whitespace, rather than boxes, groups the prose.
    const greet=section('greeting','24px 32px 0');
    const intro=section('intro','16px 32px 0');
    const gift=section('gift','24px 32px 0');
    const steps=section('steps','16px 32px 0');
    const ask=section('ask','20px 32px 0');
    const closing=section('closing','0 32px 0');
    const signature=framed('<tr><td style="padding:0 32px 32px; font-size:15px; line-height:1.7; font-weight:600; color:#191f28;">'+String(p.signature).split('\n').map(inlineHtml).join('<br>')+'</td></tr>',f('signature'));
    const slogan='        <tr>\n          <td style="padding:0 32px;"><div style="border-top:1px solid #e5e5e5; font-size:0; line-height:0;">&nbsp;</div></td>\n        </tr>\n        <tr>\n          <td align="center" style="padding:36px 32px 36px; font-size:20px; line-height:1.55; font-weight:700; color:#111111;">\n            당신의 작업이 무대가 되는 곳, Cre8orClub\n          </td>\n        </tr>\n';
    const notes=[p.footer,p.ad].filter(x=>x&&x.trim()).map(t=>'<p style="margin:0 0 6px; line-height:1.75;">'+String(t).replace(' '+TRUST,'\n'+TRUST).split('\n').map(inlineHtml).join('<br>')+'</p>').join('\n');
    const company='<div style="'+(notes?'margin-top:18px; padding-top:16px; border-top:1px solid #dcdfe3; ':'')+'line-height:1.8;"><strong style="font-size:12px; font-weight:600; color:#545b66;">'+COMPANY.name+'</strong><br>'+COMPANY.address+'<br><a href="mailto:'+COMPANY.email+'" style="color:#545b66; text-decoration:underline;">'+COMPANY.email+'</a></div>';
    const foot=framed('<tr><td style="background-color:#f3f3f3; border-radius:0 0 12px 12px; padding:24px 32px; font-size:11px; line-height:1.75; color:#737b87;">'+notes+company+'</td></tr>',f('footer'));
    const card='<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2f2f2;">\n  <tr>\n    <td align="center" style="padding:24px 12px;">\n      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px; background-color:#ffffff; border-radius:12px; overflow:hidden; word-break:keep-all; font-family:'+FONT+'; color:#111111;">\n'+
      head+greet+intro+gift+steps+ask+closing+signature+slogan+foot+'      </table>\n    </td>\n  </tr>\n</table>';
    if(o.fragment)return card;
    return '<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="x-apple-disable-message-reformatting"><title>'+esc(unmark(p.subject))+'</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"></head><body style="margin:0; padding:0; background-color:#f2f2f2;">'+pre+card+'</body></html>';
  }
  /* 「글만」: the same sections as a personal note, no band, no boxes, no images. */
  function plainHtml(p,o){
    const P='margin:0 0 16px; font-size:15px; line-height:1.7; color:#111111;';
    const para=t=>t&&t.trim()?'<div style="'+P+'">'+richHtml(t)+'</div>':'';
    const body=[para(p.greeting),para(p.intro),para([p.gift,p.steps].filter(Boolean).join('\n\n')),para([p.ask,p.closing,p.signature].filter(Boolean).join('\n')),
      '<p style="margin:0 0 20px; font-size:13px; color:#6b6b6b;">당신의 작업이 무대가 되는 곳, Cre8orClub</p>',
      [p.footer,p.ad].filter(x=>x&&x.trim()).map(t=>'<p style="margin:0; padding-top:12px; border-top:1px solid #e5e5e5; font-size:12px; line-height:1.6; color:#8a8a8a;">'+String(t).split('\n').map(inlineHtml).join('<br>')+'<br>'+COMPANY.name+' | '+COMPANY.address+' | '+COMPANY.email+'</p>').join('')].join('\n');
    const div='<div style="max-width:600px; padding:8px 4px; font-family:'+FONT+'; color:#111111; word-break:keep-all;">\n'+body+'\n</div>';
    if(o.fragment)return div;
    return '<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>'+esc(unmark(p.subject))+'</title>\n</head>\n<body style="margin:0; padding:0; background:#ffffff;">\n'+div+'\n</body>\n</html>\n';
  }
  function plain(text){return blocks(text).map(lines=>lines.map(inlinePlain).join('\n')).join('\n\n');}

  /* opts: style 'card' (위클리 양식, default) | 'plain', footer (default true), ad {on,phone},
     preview-only: mark (true or a Set of 칸 names to highlight), outline (section key to frame), logo. */
  function render(tpl,values,opts){
    const v=values||{},o=opts||{},mark=o.mark||false,ad=o.ad&&o.ad.on;
    const phone=clean(o.ad&&o.ad.phone)||'(전화번호)';
    const p={};EMAIL_SECTIONS.forEach(k=>p[k]=fill(tpl.email[k]||'',v,mark));
    p.subject=(ad?AD.subjectPrefix:'')+p.subject;
    if(!(ad||o.footer!==false))p.footer='';
    p.ad=ad?AD.emailBlock(phone):'';
    const style=o.style==='plain'?'plain':'card';
    const build=style==='plain'?plainHtml:designedHtml;
    // Section titles travel with the plain text so a plain-text paste keeps the same order.
    const titled=[plain(p.greeting),plain(p.intro),plain([p.gift,p.steps].filter(Boolean).join('\n\n')),plain([p.ask,p.closing,p.signature].filter(Boolean).join('\n')),'당신의 작업이 무대가 되는 곳, Cre8orClub',plain([p.footer,p.ad].filter(Boolean).join('\n')),COMPANY.name+' | '+COMPANY.address+' | '+COMPANY.email].filter(x=>x&&x.trim());
    const dmCore=fill(tpl.dm.message,v,mark);
    const dm=[ad?AD.dmHead(phone):'',dmCore,ad?AD.dmTail:''].filter(Boolean).join('\n\n');
    return {
      style,subject:unmark(p.subject),subjectMarked:p.subject,preheader:unmark(p.preheader),
      emailHtml:build(p,{withPreheader:true,logo:o.logo,outline:o.outline}),
      emailPaste:build(p,{fragment:true,logo:o.logo,outline:o.outline}),
      emailText:titled.join('\n\n'),
      dm:plain(dm),dmMarked:dm.replace(/\*\*([^*]+)\*\*/g,'$1')
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
    const used=channel==='email'?EMAIL_SECTIONS.filter(k=>k!=='footer'||o.footer!==false||(o.ad&&o.ad.on)).map(k=>tpl.email[k]||''):[tpl.dm.message];
    const usedKeys=new Set(used.flatMap(tokens));
    const known=new Set(VARS.map(x=>x.key));
    usedKeys.delete('이/가');usedKeys.delete('을/를');
    usedKeys.forEach(k=>{if(!known.has(k))add('block','unknown','모르는 칸 {'+k+'}이 문구에 있어요. 칸 이름을 고치거나 지워 주세요.');});
    VARS.forEach(x=>{if(usedKeys.has(x.key)&&x.required&&!clean(v[x.key]))add('block','empty:'+x.key,'「'+x.key+'」 칸이 비어 있어요.',x.field);});
    const name=clean(v['활동명']);
    if(/님$/.test(name))add('warn','name-nim','활동명 끝에 「님」이 있어요. 문구에 이미 「님」이 붙어 「'+name+'님」이 돼요.','v-name');
    const seen=clean(v['본 것 한 줄']);
    if(usedKeys.has('본 것 한 줄')){
      if(seen){
        // A sentence frame still holding a blank is never ready: machine check, both channels.
        if(hasBlank(seen))add('block','seen-blank','빈칸(___)이 남아 있어요. 작품에서 본 것으로 채워 주세요.','v-seen');
        const limit=channel==='dm'?LIMITS.dmSeenMax:LIMITS.seenMax;
        if(chars(seen)>limit)add('warn','seen-long','개인화 문구가 '+chars(seen)+'자예요. '+limit+'자 안으로 줄여 주세요.','v-seen');
        if(!/[.!?요다]$/.test(seen))add('warn','seen-end','「본 것 한 줄」을 완결된 문장으로 끝내 주세요(예: …생각났어요.).','v-seen');
        // Copying the same line to several people is the one thing the plan forbids; a near-copy only warns.
        const near=nearest(seen,name,o.history);
        if(near&&near.same)add('block','seen-same','「본 것 한 줄」이 '+near.h.name+'님에게 쓴 문장과 똑같아요. 이 분 작품에서 본 걸로 다시 써 주세요.','v-seen');
        else if(near&&near.s>=LIMITS.similar)add('warn','seen-similar','「본 것 한 줄」이 '+near.h.name+'님에게 쓴 문장과 많이 겹쳐요: 「'+clean(near.h.seen)+'」','v-seen');
      }
    }
    const r=render(tpl,v,o);
    const text=channel==='email'?r.subject+'\n'+r.emailText:r.dm;
    const typed=[v['본 것 한 줄'],v['활동명'],v['작품명']].map(clean).join('\n');
    AVOID.forEach(a=>{const m=typed.match(a.re);if(m)add('warn','avoid','손으로 쓴 칸의 「'+[...new Set(m)].join('·')+'」 — '+a.why+'.');});
    if(/\{[^{}\n]+\}/.test(text))add('block','leftover','채워지지 않은 {칸}이 남아 있어요.');
    // Links: the hub link must survive any one-off edit, over https, never shortened.
    // Only anchors the sender controls: the fixed layout's policy links, logo and font are not part of the check.
    const fixed=new Set(Object.values(POLICY));
    const all=channel==='email'?[...r.emailHtml.matchAll(/<a href="([^"]+)"/g)].map(m=>m[1]).filter(u=>!/^mailto:/.test(u)&&!fixed.has(u)).concat(links(r.subject)):links(r.dm);
    // Both approved DM variants and the email must carry the participation hub link.
    const missing=[['hub','참여 방법']].filter(([k])=>!all.includes(LINKS[k]));
    missing.forEach(([k,label])=>add('block','link-missing:'+k,label+' 링크('+LINKS[k]+')가 문구에서 빠졌어요.'));
    all.filter(u=>/^http:\/\//i.test(u)).forEach(u=>add('block','link-http','https가 아닌 링크가 있어요: '+u));
    all.filter(u=>SHORTENERS.test(u)).forEach(u=>add('block','link-short','단축 주소는 사기 링크처럼 보여요: '+u));
    if(channel==='email')[...r.emailHtml.matchAll(/<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g)].forEach(m=>{const t=m[2].trim();if(/^https?:\/\//.test(t)&&t!==m[1])add('block','link-text','링크 글자와 실제 주소가 달라요: '+t);});
    const known3=new Set(Object.values(LINKS)),post=clean(v['게시물 주소']);
    [...new Set(all)].filter(u=>!known3.has(u)&&u!==post).forEach(u=>add('warn','link-other','정해진 링크 말고 다른 링크가 있어요: '+u));
    if(o.ad&&o.ad.on){
      if(!clean(o.ad.phone))add('block','ad-phone','광고 표기에는 회사 전화번호가 들어가야 해요.','adPhone');
      if(channel==='email'&&!r.subject.startsWith('(광고)'))add('block','ad-subject','제목이 「(광고)」로 시작해야 해요.');
      if(/[(\[]\s*광\W+고\s*[)\]]|\[광고\]/.test(text))add('block','ad-variant','「(광고)」는 빈칸·부호 없이 그대로 써야 해요.');
    }
    if(channel==='email'){
      if(!clean(r.subject.replace(/^\(광고\)\s*/,'')))add('block','subject-empty','메일 제목을 입력해 주세요.','subjectCustom');
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

  /* ---------- 문장 도움: rule-based hints, fill-in frames, examples. Pure: no DOM, no storage, no clock, nothing leaves the page. ---------- */
  // Fill-in frames by field (젠지 정리 2026-11-10). A frame only offers blanks; the observation itself is always written by a person.
  const FRAMES=[
    {id:'c1',group:'공통',text:'「___」에서 ___이/가 먼저 눈에 들어왔어요.'},
    {id:'c2',group:'공통',text:'___ 부분을 보다가 한참 멈춰 있었어요.'},
    {id:'c3',group:'공통',text:'「___」의 ___이/가 며칠째 생각나요.'},
    {id:'i1',group:'일러스트·만화',text:'___번째 컷의 ___에서 한참 머물렀어요.'},
    {id:'i2',group:'일러스트·만화',text:'___을/를 ___ 색으로 칠하신 장면이 계속 생각났어요.'},
    {id:'i3',group:'일러스트·만화',text:'배경의 ___이/가 인물보다 먼저 눈에 들어왔어요.'},
    {id:'d1',group:'디자인',text:'「___」 포스터에서 ___ 글자를 ___에 둔 배치가 먼저 보였어요.'},
    {id:'d2',group:'디자인',text:'___ 화면의 ___ 처리를 보고 한 번 더 넘겨 봤어요.'},
    {id:'p1',group:'사진',text:'___에서 찍으신 사진의 ___ 빛이 먼저 눈에 들어왔어요.'},
    {id:'p2',group:'사진',text:'___을/를 ___ 거리에서 담으신 사진이 계속 생각났어요.'},
    {id:'v1',group:'영상',text:'「___」 ___초쯤 ___(으)로 넘어가는 전환을 다시 돌려 봤어요.'},
    {id:'v2',group:'영상',text:'___ 장면에서 ___ 소리만 남는 순간에 멈췄어요.'},
    {id:'m1',group:'음악',text:'「___」 ___ 부분에서 ___만 남는 순간을 여러 번 다시 들었어요.'},
    {id:'m2',group:'음악',text:'「___」 가사 중 「___」 한 줄이 계속 맴돌았어요.'},
    {id:'m3',group:'음악',text:'___ 도입의 ___ 소리에서 바로 끝까지 들었어요.'},
    {id:'w1',group:'글',text:'「___」에서 「___」(이)라는 문장에 밑줄을 그었어요.'},
    {id:'w2',group:'글',text:'「___」 마지막 문장의 ___이/가 며칠째 생각나요.'},
    {id:'k1',group:'공예',text:'「___」의 ___ 부분에 남은 ___ 자국이 먼저 눈에 들어왔어요.'},
    {id:'k2',group:'공예',text:'___을/를 ___(으)로 마감하신 가장자리를 한참 봤어요.'},
    {id:'s1',group:'공연·무대',text:'「___」에서 ___이/가 ___하는 순간에 숨을 멈췄어요.'},
    {id:'s2',group:'공연·무대',text:'___ 동작에서 ___(으)로 넘어가는 부분을 다시 돌려 봤어요.'}
  ];
  // First match wins, in this order. 음악 shares the mail variant's own pattern so the two never disagree.
  const FRAME_GROUPS=[
    {group:'일러스트·만화',match:/일러스트|만화|웹툰|드로잉|그림|캐릭터/},
    {group:'디자인',match:/디자인|브랜딩|그래픽|UI|UX|타이포|편집/i},
    {group:'사진',match:/사진|포토/},
    {group:'영상',match:/영상|모션|필름|애니메이션|연출|유튜브/},
    {group:'음악',match:EMAIL_VARIANTS.music.match},
    {group:'글',match:/글|에세이|소설|시인|작가|문학/},
    {group:'공예',match:/공예|도자|도예|섬유|목공|가죽|금속|유리/},
    {group:'공연·무대',match:/공연|무용|연주|무대|연극|뮤지컬|댄스/}
  ];
  // source 'made' = written as an illustration; 'sent' = a line that was really sent (none confirmed yet). No names, no handles.
  const EXAMPLES=[
    {text:'배경을 손으로 긁어 낸 질감이 인물보다 먼저 눈에 들어왔어요.',fields:['일러스트·만화'],source:'made'},
    {text:'「밤의 정류장」에서 가로등 빛만 따뜻하게 남긴 색이 오래 남았어요.',fields:['일러스트·만화','사진'],source:'made'},
    {text:'릴스 마지막에 손으로 접은 종이가 펼쳐지는 장면이 계속 생각났어요.',fields:['영상','공예'],source:'made'}
  ];
  function frameGroup(field){const f=clean(field);if(!f)return '';const g=FRAME_GROUPS.find(x=>x.match.test(f));return g?g.group:'';}
  // Only the blank a frame inserts: three underscores standing alone. An Instagram handle with underscores is not a blank.
  const BLANK=/(^|[^A-Za-z0-9_.@])_{3}(?![A-Za-z0-9_])/;
  function hasBlank(text){return BLANK.test(String(text??''));}
  /* [start,end] of the first blank at or after `from`; null when none follows (never wraps to the start). */
  function nextBlank(text,from){
    const re=new RegExp(BLANK.source,'g'),s=String(text??'');let m;
    while((m=re.exec(s))){const start=m.index+m[1].length;if(start>=(from||0))return [start,start+3];re.lastIndex=start+3;}
    return null;
  }
  /* 이/가 · 을/를 · 와/과 · (으)로 · (이)라는 → the one form that fits the letter before it. A marker right after a blank stays.
     Looks past closing quotes and brackets; digits by how they are read, Latin by the same guess as subjectParticle. */
  const PARTICLES=/이\/가(?![가-힣A-Za-z0-9])|을\/를(?![가-힣A-Za-z0-9])|와\/과(?![가-힣A-Za-z0-9])|\(으\)로|\(이\)라는/g;
  function resolveParticles(text){
    return String(text??'').replace(PARTICLES,(m,at,all)=>{
      const before=all.slice(0,at).replace(/[」』)\]"'’”]+$/,'');
      if(/_{3}$/.test(before))return m;
      const c=before.slice(-1);
      let closed,rieul=false;   // closed = ends in a 받침; rieul = that 받침 is ㄹ
      if(/[가-힣]/.test(c)){const j=(c.charCodeAt(0)-0xAC00)%28;closed=j>0;rieul=j===8;}
      else if(/[0-9]/.test(c)){closed=/[013678]/.test(c);rieul=/[178]/.test(c);}
      else if(/[A-Za-z]/.test(c)){closed=/[lmnLMNR]/.test(c)||/ng$/.test(before);rieul=/[lLR]/.test(c);}
      else closed=subjectParticle(before)==='이';
      if(m==='이/가')return closed?'이':'가';
      if(m==='을/를')return closed?'을':'를';
      if(m==='와/과')return closed?'과':'와';
      if(m==='(으)로')return closed&&!rieul?'으로':'로';
      return closed?'이라는':'라는';
    });
  }
  const reEsc=x=>x.replace(/[.*+?^${}()|[\]\\\/]/g,'\\$&');
  const FRAME_RE=FRAMES.map(f=>{
    const src=f.text.split('___').map(part=>reEsc(part)
      .replace(/이\\\/가/g,'(?:이\\/가|이|가)').replace(/을\\\/를/g,'(?:을\\/를|을|를)').replace(/와\\\/과/g,'(?:와\\/과|와|과)')
      .replace(/\\\(으\\\)로/g,'(?:\\(으\\)로|으로|로)').replace(/\\\(이\\\)라는/g,'(?:\\(이\\)라는|이라는|라는)')).join('(.+?)');
    return {id:f.id,re:new RegExp('^'+src+'$')};
  });
  /* Which frame a finished line was built on, and what was put in its blanks. A line that still holds a blank is no frame. */
  function stripFrame(text){
    const t=clean(text);
    if(!hasBlank(t))for(const f of FRAME_RE){const m=t.match(f.re);if(m)return {frame:f.id,fills:m.slice(1).map(x=>x.trim())};}
    return {frame:'',fills:[t]};
  }
  /* How close one line is to another person's. Two lines on the same frame are compared by what filled the blanks,
     so the shared frame wording does not count; anything else is compared as whole lines. */
  function seenScore(a,b){
    const A=stripFrame(a),B=stripFrame(b);
    if(!A.frame||A.frame!==B.frame)return similarity(a,b);
    const fa=A.fills.join(' '),fb=B.fills.join(' '),len=x=>chars(x.replace(/\s/g,''));
    if(Math.min(len(fa),len(fb))<6)return fa===fb?1:0;
    return similarity(fa,fb);
  }
  /* The closest line written to someone else: {s, h, same}. same = the whole line is identical (the block). */
  function nearest(seen,name,history){
    let best=null;
    (history||[]).filter(h=>h&&h.seen&&clean(h.name)!==name).forEach(h=>{
      const same=clean(h.seen)===seen,s=same?1:seenScore(seen,h.seen);
      if(!best||s>best.s||(same&&!best.same))best={s,h,same};
    });
    return best;
  }
  const noTitles=s=>String(s).replace(/[「『][^」』]*[」』]/g,'');   // a quoted title may hold any word
  const PITCH=/크리에이터클럽|크클|(저희|우리) *(앱|서비스|플랫폼|팀)|포트폴리오로 *올|상품권|소개하고 *싶|초대(드|하고 *싶|합니다|해요)|제안드|입점/;
  const NUMBERS=/팔로워|팔로우 *수|구독자|조회 *수|좋아요 *(수[가는도]|[0-9])|[0-9]+ *(만|천) *(명|회|뷰)|인기 *많으|떡상|바이럴/;
  const HYPE=/무료 *(제공|증정|체험|지급)|공짜|지금 *바로|(인원|기간) *한정|한정 *(모집|혜택)|특별한 *(제안|기회)|기회를 *드|당첨|축하드|선정되셨|100 *%|돈 *버|부업|리워드|오늘까지|이번 *주까지|역대급/;
  const DECO=/[!?！？]{2,}|\p{Emoji_Presentation}|[ㅋㅎㅠㅜ]{2,}|~{2,}/u;
  const FIXED_LINES=['작업이 인상 깊어 연락드렸어요','자신만의 색깔이 뚜렷한 작업을 더 많은 창작자에게 소개하고 싶었어요'];
  const SUBJECT_WHY='작품 소개 협업을 제안한다는 목적이 제목에서 보여요.';
  /* Advice for the hand-typed fields. Hints never block: they carry no level and copying ignores them.
     history is the same [{name, seen}] that check() takes. The screen shows at most two hints, in this order. */
  function coach(input){
    const o=input||{},name=clean(o.name).replace(/\s*님$/,''),work=clean(o.work);
    const seen=resolveParticles(clean(o.seen)),bare=noTitles(seen),hints=[];
    const hint=(id,text,target,pinned)=>hints.push({id,text,target:target||'v-seen',pinned:!!pinned});
    if(seen){
      const near=nearest(seen,name,o.history);
      if(near&&!near.same&&near.s>=LIMITS.similar)hint('seen-similar',near.h.name+'님에게 쓴 문장과 많이 겹쳐요. 이 분 작품에서 본 걸로 바꿔 주세요.','v-seen',true);
      AVOID.forEach(a=>{const m=seen.match(a.re);if(m)hint('avoid','손으로 쓴 칸의 「'+[...new Set(m)].join('·')+'」 — '+a.why+'.','v-seen',true);});
      if(o.channel!=='dm'&&PITCH.test(bare))hint('seen-pitch','이 칸에는 작품에서 본 것만 써 주세요. 앱 소개는 바로 다음 문단에 있어요.');
      if(NUMBERS.test(bare))hint('seen-number','팔로워·조회 수 대신 작품에서 본 장면을 써 주세요.');
      const hype=bare.match(HYPE);
      if(hype)hint('typed-hype','「'+hype[0]+'」은 광고 문자처럼 읽힐 수 있어요. 담백한 말로 바꿔 주세요.');
      const max=o.channel==='dm'?LIMITS.dmSeenMax:LIMITS.seenMax;
      if(chars(seen)>max)hint('seen-long',chars(seen)+'자예요. '+(o.channel==='dm'?'한 문단':'한 문장')+'('+max+'자 안)으로 줄여 주세요.');
      if(EXAMPLES.some(e=>similarity(seen,e.text)>=LIMITS.similar))hint('seen-example','예로 든 문장과 거의 같아요. 이 분 작품에서 본 걸로 바꿔 주세요.');
      const n=chars(seen);
      if((n<=14&&!/[0-9「『]/.test(seen))||FIXED_LINES.some(f=>similarity(seen,f)>=0.5))hint('seen-thin','어느 작품의 어느 부분인지 한 가지만 더 짚어 주세요.');
      if(!/[.!?요다]$/.test(seen))hint('seen-end','문장으로 끝내 주세요(예: …생각났어요.).');
      if(DECO.test(bare))hint('typed-deco','겹친 느낌표나 이모지는 빼거나 하나만 남겨 주세요.');
    }
    if(work){
      const w=noTitles(work),hype=w.match(HYPE);
      if(hype)hint('typed-hype','「'+hype[0]+'」은 광고 문자처럼 읽힐 수 있어요. 담백한 말로 바꿔 주세요.','subject');
      if(DECO.test(w))hint('typed-deco','겹친 느낌표나 이모지는 빼거나 하나만 남겨 주세요.','subject');
    }
    // Subject: the name or the title should sit in the part every inbox shows.
    const subject=clean(o.subject).replace(/^\(광고\)\s*/,'');
    const keys=[name,work].filter(k=>chars(k)>=2);
    if(subject&&keys.length){
      const front=keys.some(k=>{const at=subject.indexOf(k);if(at<0)return false;return chars(k)>14?chars(subject.slice(0,at))<=6:chars(subject.slice(0,at+k.length))<=20;});
      if(!front)hint('subject-front','제목 앞쪽에 받는 분 이름이나 작품명이 보이게 해 주세요.','subject');
    }
    const group=frameGroup(o.field),common=FRAMES.filter(f=>f.group==='공통');
    const frames=group?FRAMES.filter(f=>f.group===group).concat(common.slice(0,2)):common.slice(0,3);
    const sentOnes=EXAMPLES.some(e=>e.source==='sent'),examplesLabel=sentOnes?'이렇게 썼어요':'예시';
    const examples=EXAMPLES.filter(e=>group&&e.fields.includes(group)).concat(EXAMPLES.filter(e=>!(group&&e.fields.includes(group)))).slice(0,3).map(e=>({text:e.text,source:e.source}));
    const foldLabel=seen?'문장 도움 · 문장 틀과 '+examplesLabel:'문장이 안 떠오르면 · '+(group?group+' ':'')+'문장 틀 보기';
    const professional=/스튜디오|studio|에이전시|agency|전문 창작자/i.test(name+' '+(o.field||''));
    const subjectPick=professional?{index:2,why:'스튜디오·에이전시에는 포트폴리오 제안을 앞에 두는 제목을 추천해요.'}:work?{index:1,why:'작품명이 있어 어떤 작업을 보고 연락했는지 제목에서 보여 줄 수 있어요.'}:{index:0,why:SUBJECT_WHY};
    return {hints,frames:frames.map(f=>({id:f.id,group:f.group,text:f.text})),examples,foldLabel,examplesLabel,subjectPick,blank:hasBlank(seen)};
  }

  const api={LINKS,REWARD,COMPANY,TRUST,VARS,DEFAULTS,EMAIL_VARIANTS,DM_VARIANTS,DM_EXAMPLES,EMAIL_EXAMPLE,template,variantOf,EMAIL_SECTIONS,SECTION_TITLES,LOGO,POLICY,SUBJECT_TYPES,SUBJECT_ALTERNATIVES,AD,REPLIES,LIMITS,fill,tokens,render,reply,plain,similarity,check,chars,seoulMinutes,clean,prose,FRAMES,FRAME_GROUPS,EXAMPLES,frameGroup,hasBlank,nextBlank,resolveParticles,stripFrame,coach};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.ContactMail=api;
})(typeof self!=='undefined'?self:this);
