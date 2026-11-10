/* Contact message templates, filling and checks. Pure functions only: no network, no storage, no candidate data. */
(function(root){
  'use strict';
  const LINKS={app:'https://app.cre8orclub.com',form:'https://forms.gle/t22LtA8dTVBrUc2X8',chat:'https://open.kakao.com/o/pPlfzgWi',
    // One page that carries the app, the form and the chat; the mail points here instead of listing all three.
    hub:'https://litt.ly/cre8orclub'};
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
    // Same sections as the Weekly Best award mail so both mails read as one family.
    // The applied mail (2026-11-10): sent as the team, one link to the hub page.
    email:{
      subject:'{활동명}님, 크리에이터클럽에서 인사드려요',
      preheader:'{활동명}님의 작업을 크리에이터클럽에 소개하고 싶어요. 작업 1개당 신세계 모바일 상품권 '+REWARD.per+'을 드려요.',
      headline:'{활동명}님의 작업을\n크리에이터클럽에서도 소개하고 싶어요',
      greeting:[
        '안녕하세요, **{활동명}님!**',
        '창작자를 위한 포트폴리오·네트워크 앱, 크리에이터클럽입니다.',
        '',
        '{활동명}님의 {플랫폼} 작업이 인상 깊어 연락드렸어요.',
        '',
        '{본 것 한 줄}',
        '',
        '이렇게 자신만의 색깔이 뚜렷한 작업을 더 많은 창작자에게 소개하고 싶었어요.'
      ].join('\n'),
      intro:[
        '크리에이터클럽은 자신의 작업을 알리고, 그 가치를 알아보는 동료를 만나 새로운 협업을 시작하는 공간이에요.',
        '',
        '{활동명}님의 개성 있는 작업이 크리에이터클럽에서도 소개되고, 다양한 분야의 창작자들과 새로운 기회로 이어지면 좋겠어요.'
      ].join('\n'),
      gift:'지금은 기존 작업을 포트폴리오로 올려 주시면 **1개당 신세계 모바일 상품권 '+REWARD.per+', 최대 '+REWARD.total+'**을 드리고 있어요.',
      steps:[
        '참여 방법은 아래 링크에서 확인해 주세요.',
        '['+LINKS.hub+']('+LINKS.hub+')'
      ].join('\n'),
      ask:'궁금한 점은 언제든 편하게 회신해 주세요.',
      closing:'{활동명}님의 다음 작업도 기대하며, 크리에이터클럽에서도 멋진 작품들을 만나볼 수 있으면 좋겠습니다!',
      signature:'크리에이터클럽 드림',
      footer:'본 메일은 {활동명}님이 공개해 두신 연락처로 작품 소개를 제안드리기 위해 한 번 보내는 메일이에요. 답이 없으시면 다시 연락드리지 않을게요. '+TRUST
    },
    dm:{
      // The applied DM (2026-11-10): sent as the team, no links in the body; app, form and chat live in our profile link.
      message:[
        '안녕하세요, {활동명}님!',
        '창작자를 위한 포트폴리오·네트워크 앱, 크리에이터클럽 운영팀입니다.',
        '',
        '인스타그램에서 {활동명}님의 작업을 보고 연락드렸어요.',
        '',
        '{본 것 한 줄}',
        '',
        '{활동명}님만의 개성이 담긴 작업을 더 많은 창작자에게 소개하고 싶어 크리에이터클럽에 초대드리게 되었습니다.',
        '',
        '크리에이터클럽은 「당신의 작업이 무대가 되는 곳」이라는 슬로건 아래, 창작자들이 자신의 작업을 알리고 서로의 작업에 공감하며 새로운 협업의 기회를 만들어 가는 공간이에요.',
        '',
        '이번에 초대드리는 작가님께는 기존 작업을 포트폴리오로 올려 주시면, 감사의 뜻으로 작업 1개당 신세계 모바일 상품권 '+REWARD.per+'(최대 '+REWARD.total+')을 드리고 있어요.',
        '',
        '기존 작업을 그대로 활용하실 수 있고, 업로드 후 신청서에 작업 링크만 남겨 주시면 매주 화요일에 상품권을 보내 드려요.',
        '',
        '📌 앱 다운로드와 참여 신청서, 문의 채널은 저희 인스타그램 프로필에 있는 링크에서 확인하실 수 있어요.',
        '',
        '{활동명}님의 멋진 작업을 크리에이터클럽에서도 만나볼 수 있으면 좋겠습니다!'
      ].join('\n')
    }
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
        '',
        '{본 것 한 줄}',
        '',
        '이렇게 자신만의 음악적 색깔이 뚜렷한 작업을 더 많은 창작자에게 소개하고 싶었어요.'
      ].join('\n'),
      intro:[
        '크리에이터클럽은 자신의 작업을 알리고, 그 가치를 알아보는 동료를 만나 새로운 협업을 시작하는 공간이에요.',
        '',
        '특히 김형석 작곡가 겸 프로듀서님도 크리에이터클럽의 투자자이자 크리에이터로 직접 활동하고 계세요. {활동명}님처럼 자신만의 음악 세계를 만들어가는 분들과도 함께하고 싶어요.'
      ].join('\n'),
      closing:'{활동명}님의 앞으로의 음악 활동도 기대하며, 크리에이터클럽에서도 멋진 작업들을 만나볼 수 있으면 좋겠습니다!'
    }
  };
  const variantKey=v=>Object.prototype.hasOwnProperty.call(EMAIL_VARIANTS,v)?v:'basic';
  /* The full wording for one variant ('basic' or a key of EMAIL_VARIANTS), as a fresh copy. */
  function template(variant){
    const t=JSON.parse(JSON.stringify(DEFAULTS)),o=EMAIL_VARIANTS[variantKey(variant)];
    if(o)EMAIL_SECTIONS.forEach(k=>{if(typeof o[k]==='string')t.email[k]=o[k];});
    return t;
  }
  /* Which variant a candidate's 분야 points to. */
  function variantOf(field){const f=clean(field);return Object.keys(EMAIL_VARIANTS).find(k=>EMAIL_VARIANTS[k].match.test(f))||'basic';}
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
    let out=String(text).replace(/\{([^{}\n]+)\}/g,(m,k)=>{
      k=k.trim();
      if(!known.has(k))return m;
      const v=clean((values||{})[k]);
      const on=mark&&(mark===true||(mark.has&&mark.has(k)));
      return v?(on?MARK_ON+v+MARK_OFF:v):'\u0000';
    });
    out=out.split(PARTICLE).reduce((a,b)=>a+subjectParticle(a.slice(a.lastIndexOf('\n')+1))+b);
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
    return unmark(String(s).replace(/\[([^\]]+)\]\(mailto:([^)\s]+)\)/g,'$2').replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,(m,t,u)=>t===u?u:t+'('+u+')').replace(/\*\*([^*]+)\*\*/g,'$1'));
  }
  function blocks(text){return String(text).split(/\n{2,}/).map(p=>p.split('\n').filter(l=>l.trim()!=='')).filter(p=>p.length);}
  const SECTION_TITLES={gift:'🎁 감사 선물',steps:'📝 참여 방법',ask:'💬 궁금한 점'};
  const EMAIL_SECTIONS=['subject','preheader','headline','greeting','intro','gift','steps','ask','closing','signature','footer'];
  const LOGO='https://euna-source.github.io/public-pages/c8-contact-mail/c8-logo-mark.png';
  const POLICY={privacy:'https://static.cre8orclub.com/policy/privacy-policy-general.html',terms:'https://static.cre8orclub.com/policy/terms-of-service.html'};
  const FONT="'Pretendard','Apple SD Gothic Neo','Malgun Gothic','맑은 고딕',sans-serif";
  /* Lines → html: blank line = paragraph gap, 「1. 」 runs = ordered list, everything else joins with <br>. */
  function richHtml(text,size){
    return blocks(text).map((lines,bi)=>{
      const gap=bi?'margin-top:12px; ':'';
      if(lines.every(l=>/^\d+\.\s/.test(l)))return '<ol style="'+gap+'margin-bottom:0; padding-left:20px;">'+lines.map(l=>'<li style="margin:0 0 4px;">'+inlineHtml(l.replace(/^\d+\.\s/,''))+'</li>').join('')+'</ol>';
      return '<div style="'+gap+'">'+lines.map(inlineHtml).join('<br>')+'</div>';
    }).join('');
  }
  const row=(inner,pad)=>'        <tr>\n          <td style="padding:'+(pad||'16px 32px 0')+';">\n'+inner+'\n          </td>\n        </tr>\n';
  // Preview only: frame the section being edited so the editor can show where a field lands.
  const OUTLINE='outline:2px solid #111111; outline-offset:2px; border-radius:6px;';
  const framed=(html,on)=>on?html.replace(/<td style="/,'<td style="'+OUTLINE+' '):html;
  const box=(title,body,style)=>'            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="'+style+'">\n              <tr>\n                <td style="padding:20px 22px; font-size:15px; line-height:1.8; color:#111111;">\n                  <div style="font-size:16px; font-weight:700; margin-bottom:8px;">'+esc(title)+'</div>\n                  '+body+'\n                </td>\n              </tr>\n            </table>';
  /* The Weekly Best award mail layout: black band with logo and headline, intro rule, grey boxes, green-outlined box, slogan, grey footer. */
  function designedHtml(p,o){
    const f=k=>o.outline===k;
    const pre=o.withPreheader&&p.preheader?'<div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">'+esc(unmark(p.preheader))+'</div>\n':'';
    const head='        <tr>\n          <td style="background-color:#111111; padding:24px 32px 28px;">\n            <table role="presentation" cellpadding="0" cellspacing="0" border="0">\n              <tr>\n                <td valign="middle" style="vertical-align:middle; line-height:0; font-size:0;"><img src="'+(o.logo||LOGO)+'" width="18" height="30" alt="Cre8orClub" style="display:block; width:18px; height:30px; border:0;"></td>\n                <td valign="middle" style="vertical-align:middle; padding-left:10px; font-size:24px; line-height:30px; font-weight:700; color:#ffffff; padding-top:4px;">Cre8orClub</td>\n              </tr>\n            </table>\n            <div style="margin-top:22px; font-size:25px; line-height:1.45; font-weight:700; color:#ffffff;'+(f('headline')?' outline:2px solid #07ED21; outline-offset:4px;':'')+'">'+String(p.headline).split('\n').map(inlineHtml).join('<br>')+'</div>\n          </td>\n        </tr>\n';
    const greet=framed('        <tr>\n          <td style="padding:28px 32px 8px; font-size:15px; line-height:1.7; color:#111111;">\n            '+richHtml(p.greeting)+'\n          </td>\n        </tr>\n',f('greeting'));
    const intro=p.intro.trim()?framed(row('            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left:3px solid #07ED21;">\n              <tr>\n                <td style="padding:2px 0 2px 14px; font-size:14px; line-height:1.7; color:#444444;">\n                  '+richHtml(p.intro)+'\n                </td>\n              </tr>\n            </table>'),f('intro')):'';
    const grey='background-color:#f7f7f7; border-radius:10px;';
    const gift=p.gift.trim()?framed(row(box(SECTION_TITLES.gift,richHtml(p.gift),grey)),f('gift')):'';
    const steps=p.steps.trim()?framed(row(box(SECTION_TITLES.steps,richHtml(p.steps),grey)),f('steps')):'';
    const ask=p.ask.trim()?framed(row(box(SECTION_TITLES.ask,richHtml(p.ask),'border:2px solid #07ED21; border-radius:10px;')),f('ask')):'';
    const close=framed('        <tr>\n          <td style="padding:28px 32px 32px; font-size:15px; line-height:1.7; color:#111111;">\n            '+richHtml(p.closing)+'<br>\n            <strong>'+String(p.signature).split('\n').map(inlineHtml).join('<br>')+'</strong>\n          </td>\n        </tr>\n',f('closing')||f('signature'));
    const slogan='        <tr>\n          <td style="padding:0 32px;"><div style="border-top:1px solid #e5e5e5; font-size:0; line-height:0;">&nbsp;</div></td>\n        </tr>\n        <tr>\n          <td align="center" style="padding:36px 32px 36px; font-size:20px; line-height:1.55; font-weight:700; color:#111111;">\n            당신의 작업이 무대가 되는 곳, Cre8orClub\n          </td>\n        </tr>\n';
    const notes=[p.footer,p.ad].filter(x=>x&&x.trim()).map(t=>'            <p style="margin:0 0 6px;">'+String(t).split('\n').map(inlineHtml).join('<br>')+'</p>').join('\n');
    const foot=framed('        <tr>\n          <td style="background-color:#f3f3f3; padding:20px 32px 22px; font-size:11px; line-height:1.6; color:#777777;">\n'+(notes?notes+'\n':'')+
      '            <p style="margin:0 0 6px;">'+COMPANY.name+' | 대표 최남희 | 사업자등록번호 736-86-01932 | '+COMPANY.address+' | <a href="mailto:'+COMPANY.email+'" style="color:#777777; text-decoration:underline;">'+COMPANY.email+'</a></p>\n'+
      '            <p style="margin:0;"><a href="'+POLICY.privacy+'" target="_blank" style="color:#444444; font-weight:700; text-decoration:none;">개인정보처리방침</a> · <a href="'+POLICY.terms+'" target="_blank" style="color:#777777; text-decoration:none;">이용약관</a> · © Ratel And Partners Co., Ltd.</p>\n          </td>\n        </tr>\n',f('footer'));
    const card='<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2f2f2;">\n  <tr>\n    <td align="center" style="padding:24px 12px;">\n      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px; background-color:#ffffff; border-radius:12px; overflow:hidden; word-break:keep-all; font-family:'+FONT+'; color:#111111;">\n'+
      head+greet+intro+gift+steps+ask+close+slogan+foot+'      </table>\n    </td>\n  </tr>\n</table>';
    if(o.fragment)return card;
    return '<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="x-apple-disable-message-reformatting">\n<title>'+esc(unmark(p.subject))+'</title>\n<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css">\n</head>\n<body style="margin:0; padding:0; background-color:#f2f2f2;">\n'+pre+card+'\n</body>\n</html>\n';
  }
  /* 「글만」: the same sections as a personal note, no band, no boxes, no images. */
  function plainHtml(p,o){
    const P='margin:0 0 16px; font-size:15px; line-height:1.7; color:#111111;';
    const para=t=>t&&t.trim()?'<div style="'+P+'">'+richHtml(t)+'</div>':'';
    const body=[para(p.greeting),para(p.intro),para(p.gift),para(p.steps),para(p.ask),para(p.closing),
      '<p style="margin:24px 0 4px; font-size:15px; font-weight:600; color:#111111;">'+String(p.signature).split('\n').map(inlineHtml).join('<br>')+'</p>',
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
    const titled=[plain(p.greeting),plain(p.intro),p.gift.trim()?SECTION_TITLES.gift+'\n'+plain(p.gift):'',p.steps.trim()?SECTION_TITLES.steps+'\n'+plain(p.steps):'',p.ask.trim()?SECTION_TITLES.ask+'\n'+plain(p.ask):'',plain(p.closing)+'\n'+plain(p.signature),'당신의 작업이 무대가 되는 곳, Cre8orClub',plain([p.footer,p.ad].filter(Boolean).join('\n')),COMPANY.name+' | '+COMPANY.address+' | '+COMPANY.email].filter(x=>x&&x.trim());
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
    usedKeys.delete('이/가');
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
    // Links: the hub link must survive any one-off edit, over https, never shortened.
    // Only anchors the sender controls: the fixed layout's policy links, logo and font are not part of the check.
    const fixed=new Set(Object.values(POLICY));
    const all=channel==='email'?[...r.emailHtml.matchAll(/<a href="([^"]+)"/g)].map(m=>m[1]).filter(u=>!/^mailto:/.test(u)&&!fixed.has(u)).concat(links(r.subject)):links(r.dm);
    // The DM points to our profile link instead, so only the mail must carry the hub link.
    const missing=channel==='email'?[['hub','참여 방법']].filter(([k])=>!all.includes(LINKS[k])):[];
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

  const api={LINKS,REWARD,COMPANY,TRUST,VARS,DEFAULTS,EMAIL_VARIANTS,template,variantOf,EMAIL_SECTIONS,SECTION_TITLES,LOGO,POLICY,SUBJECT_ALTERNATIVES,AD,REPLIES,LIMITS,fill,tokens,render,reply,plain,similarity,check,chars,seoulMinutes,clean};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.ContactMail=api;
})(typeof self!=='undefined'?self:this);
