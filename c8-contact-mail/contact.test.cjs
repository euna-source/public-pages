const test=require('node:test');
const assert=require('node:assert/strict');
const C=require('./contact.js');
const K=require('./candidates.js');

const base={'활동명':'연두','담당자명':'서지원','플랫폼':'비핸스','게시물 주소':'https://www.instagram.com/reel/ABC/','본 것 한 줄':'배경을 손으로 긁어 낸 질감이 인물보다 먼저 눈에 들어왔어요.','작품명':''};
const noon='2026-11-10T03:00:00Z'; // 12:00 in Seoul
const copy=o=>JSON.parse(JSON.stringify(o));
const codes=(t,v,o)=>C.check(t,v,{now:noon,...o}).map(c=>c.code);

test('fills every variable and keeps the confirmed facts in both channels',()=>{
  const r=C.render(C.DEFAULTS,base);
  assert.equal(r.subject,'연두님, 크리에이터클럽에서 인사드려요');
  for(const s of ['신세계 모바일 상품권 1만 원','매주 화요일','당신의 작업이 무대가 되는 곳',C.TRUST,C.LINKS.app,C.LINKS.form,C.LINKS.chat]){
    assert.ok(r.emailHtml.includes(s)&&r.emailText.includes(s),'email '+s);
    assert.ok(r.dm.includes(s),'dm '+s);
  }
  assert.ok(r.emailText.includes('최대: 5개, 총 5만 원')&&r.dm.includes('최대 5개'));
  assert.ok(!/\{[^}]+\}/.test(r.emailText+r.dm));
});

test('DM is one message that carries the offer and links',()=>{
  const r=C.render(C.DEFAULTS,base);
  assert.ok(r.dm.indexOf('상품권')>r.dm.indexOf('안녕하세요')&&r.dm.includes('앱스토어'));
  assert.ok(C.chars(r.dm)<C.LIMITS.dmChars);
});

test('an empty 본 것 한 줄 leaves no double space or dangling blank',()=>{
  const r=C.render(C.DEFAULTS,{...base,'본 것 한 줄':''});
  assert.ok(r.emailText.includes('비핸스에 올려 주신 작업들을 봤어요.\n보다가'));
  assert.ok(!/ {2}/.test(r.emailText+r.dm)&&!/ \n/.test(r.emailText+r.dm));
  assert.ok(r.dm.includes('연락드렸어요.\n이 작업이'));
});

test('email follows the Weekly Best layout: black band, logo, boxes, slogan, footer, preheader',()=>{
  const h=C.render(C.DEFAULTS,base).emailHtml;
  for(const s of ['background-color:#111111','c8-logo-mark.png','border-left:3px solid #07ED21','background-color:#f7f7f7','border:2px solid #07ED21','당신의 작업이 무대가 되는 곳, Cre8orClub','background-color:#f3f3f3','대표 최남희',C.POLICY.privacy,'display:none; max-height:0'])
    assert.ok(h.includes(s),s);
  assert.ok(h.includes('연두님의 작업을<br>크리에이터클럽에서도 소개하고 싶어요'));
  assert.equal((h.match(/<li /g)||[]).length,2);
  assert.ok(!/utm_|static\.dev\./.test(h));
});

test('paste fragment has no hidden preheader and no document wrapper',()=>{
  const r=C.render(C.DEFAULTS,base);
  assert.ok(!r.emailPaste.includes('display:none')&&!r.emailPaste.includes('<html')&&r.emailPaste.startsWith('<table'));
});

test('plain style keeps the same sections without band, boxes or images',()=>{
  const r=C.render(C.DEFAULTS,base,{style:'plain'});
  assert.ok(!/<img|<table/.test(r.emailPaste));
  for(const s of ['신세계 모바일 상품권 1만 원',C.LINKS.app,C.LINKS.form,C.LINKS.chat,C.TRUST])assert.ok(r.emailHtml.includes(s),s);
});

test('user text is escaped in html and the preview marker never leaks into copies',()=>{
  const h=C.render(C.DEFAULTS,{...base,'활동명':'<b>x</b>'}).emailHtml;
  assert.ok(!h.includes('<b>x</b>')&&h.includes('&lt;b&gt;x&lt;/b&gt;'));
  const m=C.render(C.DEFAULTS,base,{mark:true});
  assert.ok(m.emailHtml.includes('<mark')&&!/[\u0001\u0002]/.test(m.emailText+m.subject+m.dm));
  assert.ok(m.dmMarked.includes('\u0001연두\u0002'));
});

test('plain text keeps section titles and turns links into 글자(주소)',()=>{
  const t=C.render(C.DEFAULTS,base).emailText;
  assert.ok(t.includes('크리에이터클럽 앱('+C.LINKS.app+')')&&t.includes('support@cre8orclub.com')&&!t.includes('mailto:')&&!t.includes('**'));
  assert.ok(t.indexOf(C.SECTION_TITLES.gift)<t.indexOf(C.SECTION_TITLES.steps)&&t.indexOf(C.SECTION_TITLES.steps)<t.indexOf(C.SECTION_TITLES.ask));
});

test('a complete draft passes with no notes in either channel',()=>{
  assert.deepEqual(C.check(C.DEFAULTS,base,{channel:'email',now:noon,to:'a@b.co'}),[]);
  assert.deepEqual(C.check(C.DEFAULTS,base,{channel:'email',style:'plain',now:noon,to:'a@b.co'}),[]);
  assert.deepEqual(C.check(C.DEFAULTS,base,{channel:'dm',now:noon}),[]);
});

test('empty required fields block, per channel',()=>{
  assert.ok(codes(C.DEFAULTS,{},{channel:'email'}).includes('empty:활동명'));
  const dm=codes(C.DEFAULTS,{...base,'플랫폼':'','게시물 주소':''},{channel:'dm'});
  assert.ok(dm.includes('empty:게시물 주소')&&!dm.includes('empty:플랫폼'));
});

test('night warning runs 20:50–08:00 Seoul time with a 10-minute heads-up',()=>{
  const at=hm=>codes(C.DEFAULTS,base,{channel:'dm',now:'2026-11-09T'+hm+':00Z'});
  assert.ok(at('11:55').includes('night'));          // 20:55
  assert.ok(at('11:45').includes('night-soon'));     // 20:45
  assert.ok(!at('11:30').some(c=>/night/.test(c)));  // 20:30
  assert.ok(at('22:30').includes('night'));          // 07:30
  assert.ok(!at('23:05').includes('night'));         // 08:05
  assert.ok(C.check(C.DEFAULTS,base,{channel:'email',now:'2026-11-09T12:00:00Z'}).find(c=>c.code==='night').msg.includes('예약 전송'));
});

test('본 것 한 줄: exact copy blocks, title-swapped near copy warns, same person and loose lines pass',()=>{
  const line='「여름 정원」의 물빛 번짐이 오래 남았어요.';
  const v={...base,'본 것 한 줄':line};
  assert.ok(codes(C.DEFAULTS,v,{channel:'email',history:[{name:'파랑',seen:line.normalize('NFD')}]}).includes('seen-same'));
  assert.ok(codes(C.DEFAULTS,v,{channel:'email',history:[{name:'파랑',seen:'「밤의 바다」의 물빛 번짐이 오래 남았어요.'}]}).includes('seen-similar'));
  assert.ok(!codes(C.DEFAULTS,v,{channel:'email',history:[{name:'연두',seen:line}]}).some(c=>/seen-s/.test(c)));
  assert.ok(!codes(C.DEFAULTS,v,{channel:'email',history:[{name:'파랑',seen:'도시의 밤 네온을 길게 노출로 잡은 연작이 좋았어요.'}]}).some(c=>/seen-s/.test(c)));
});

test('avoid words only in hand-typed fields; 님 suffix and a prior send are caught',()=>{
  const r=codes(C.DEFAULTS,{...base,'활동명':'연두님','본 것 한 줄':'B 등급 작품 중 이벤트로 소개하고 싶었어요.'},{channel:'email',sentBefore:'11월 9일'});
  for(const c of ['name-nim','avoid','sent'])assert.ok(r.includes(c),c);
  const t=copy(C.DEFAULTS);t.email.closing+='\n\n이벤트 혜택을 놓치지 마세요.';
  assert.ok(!codes(t,base,{channel:'email'}).includes('avoid'));
});

test('links: missing canonical, http, shortener and mismatched text all block',()=>{
  const drop=copy(C.DEFAULTS);drop.email.steps=drop.email.steps.replace(/\n2\. .*\n/,'\n');
  assert.ok(codes(drop,base,{channel:'email'}).includes('link-missing:form'));
  const http=copy(C.DEFAULTS);http.dm.message=http.dm.message.replace(C.LINKS.app,'http://app.cre8orclub.com');
  const h=codes(http,base,{channel:'dm'});assert.ok(h.includes('link-http')&&h.includes('link-missing:app'));
  const short=copy(C.DEFAULTS);short.dm.message+='\nhttps://bit.ly/abc';
  assert.ok(codes(short,base,{channel:'dm'}).includes('link-short'));
  const lie=copy(C.DEFAULTS);lie.email.ask+='\n[https://app.cre8orclub.com](https://evil.example.com)';
  assert.ok(codes(lie,base,{channel:'email'}).includes('link-text'));
  assert.ok(codes(C.DEFAULTS,{...base,'게시물 주소':'https://example.com/x'},{channel:'dm'}).includes('post-url'));
});

test('unknown {칸} in edited wording blocks copying',()=>{
  const t=copy(C.DEFAULTS);t.email.greeting+='\n{이름}님';
  assert.ok(C.check(t,base,{channel:'email',now:noon}).some(c=>c.code==='unknown'&&c.level==='block'));
});

test('ad mode: (광고) subject, sender block with phone, DM head and tail; phone required',()=>{
  const r=C.render(C.DEFAULTS,base,{ad:{on:true,phone:'02-123-4567'}});
  assert.ok(r.subject.startsWith('(광고) '));
  assert.ok(r.emailText.includes('전화 02-123-4567')&&r.emailText.includes('unsubscribe')&&r.emailText.includes('수신거부'));
  assert.ok(r.dm.startsWith('(광고) 크리에이터클럽 · 02-123-4567')&&r.dm.trim().endsWith(C.AD.dmTail));
  assert.ok(codes(C.DEFAULTS,base,{channel:'email',ad:{on:true,phone:''}}).includes('ad-phone'));
  assert.ok(C.render(C.DEFAULTS,base,{ad:{on:true,phone:'1'},footer:false}).emailText.includes(C.COMPANY.name));
  const t=copy(C.DEFAULTS);t.email.closing+='\n(광 고)';
  assert.ok(codes(t,base,{channel:'email',ad:{on:true,phone:'1'}}).includes('ad-variant'));
});

test('footer line can be left out when ad mode is off',()=>{
  assert.ok(C.render(C.DEFAULTS,base).emailText.includes('다시 연락드리지 않을게요'));
  assert.ok(!C.render(C.DEFAULTS,base,{footer:false}).emailText.includes('다시 연락드리지 않을게요'));
});

test('reward terms come from one constant',()=>{
  const r=C.render(C.DEFAULTS,base);
  assert.ok(r.emailText.includes('상품권 '+C.REWARD.per)&&r.dm.includes('최대 '+C.REWARD.max+'개'));
});

test('reply templates fill name, date and source',()=>{
  const s=C.reply('source',{'활동명':'연두','담당자명':'서지원','출처':'https://www.behance.net/y'});
  assert.ok(s.includes('연두님 연락처는 https://www.behance.net/y')&&!/\{/.test(s));
  assert.ok(C.reply('optout',{'날짜':'11월 10일','담당자명':'서지원'}).includes('11월 10일에 수신거부'));
});

test('grapheme count treats emoji and composed Korean as one each',()=>{
  assert.equal(C.chars('가👍🏽'),2);
  assert.equal(C.chars('가'.normalize('NFD')),1);
});

test('candidate sheet: header aliases, O filters, email and handle',()=>{
  const rows=K.parseDelimited('제목줄,,\n행,이름,주 플랫폼 URL,연락 창구,평가 등급,직접 확인,직접 컨택 후보,비고\n,연두,https://www.behance.net/y,y@example.com,B (2만원),O,O,메모\n,파랑,https://www.instagram.com/parang.art/,@parang.art 메일 없음,C,O,O,\n,보류,https://notefolio.net/x,,,,O,\n');
  const r=K.convert(rows);
  assert.equal(r.header,2);
  const [a,b,c]=r.people;
  assert.deepEqual([a.row,a.email,a.platform,a.grade,K.channelOf(a),K.ready(a)],[3,'y@example.com','비핸스','B','email',true]);
  assert.deepEqual([b.handle,b.platform,K.channelOf(b),K.ready(b)],['parang.art','인스타그램','dm',true]);
  assert.equal(K.ready(c),false);
});

test('channel follows the contact column; status, do-not-contact and minor block',()=>{
  const rows=[['이름','연락 창구','이메일','상태','연락 금지','미성년'],['가','@ga.art 메일 없음','ga@example.com','','',''],['나','문의 메일','na@example.com','미연락','',''],['다','@da','','발송 11/9','',''],['라','@ra','','','수신거부',''],['마','@ma','','','','O']];
  const [a,b,c,d,e]=K.convert(rows).people;
  assert.deepEqual([a,b,c].map(K.channelOf),['dm','email','dm']);
  assert.deepEqual([a,b,c,d,e].map(K.blockedWhy).map(Boolean),[false,false,true,true,true]);
});

test('same email or handle on two rows is one person',()=>{
  const [a,b]=K.convert([['이름','이메일','연락 창구'],['가','GA@x.com',''],['가 스튜디오','ga@x.com','@other']]).people;
  assert.deepEqual([a.dupOf,b.dupOf],[[3],[2]]);
});

test('an email in an unrelated column is not used',()=>{
  const [p]=K.convert([['이름','연락 창구','비고'],['가','@ga.art','매니저 m@example.com']]).people;
  assert.equal(p.email,'');assert.equal(K.channelOf(p),'dm');
});

test('candidate sheet without O columns never marks people ready; a tab without a name header is refused',()=>{
  assert.equal(K.ready(K.convert([['이름','연락처'],['연두','y@example.com']]).people[0]),false);
  assert.throws(()=>K.convert([['날짜','금액'],['1','2']]),/머리글/);
});

test('review regressions: Korean yes, contacted-but-waiting statuses',()=>{
  assert.equal(K.yes('예'),true);assert.equal(K.yes('네'),true);assert.equal(K.yes('O (확인)'),true);assert.equal(K.yes('예정'),false);assert.equal(K.yes('X'),false);
  const st=s=>K.uncontacted({status:s});
  assert.deepEqual(['', '미연락', '대기', '연락 전'].map(st),[true,true,true,true]);
  assert.deepEqual(['수신거부 처리 예정','발송 완료, 답장 대기','거절','무응답','발송 11/9','보류 메모'].map(st),[false,false,false,false,false,false]);
  const [m]=K.convert([['이름','미성년','연락 창구'],['가','예','@ga']]).people;
  assert.equal(K.blockedWhy(m),'미성년 표시');
});

test('reads the live 후보 tab headers: 「직접 확인 (O/△/X)」, 「인스타 DM」, 「포폴 링크」, 「개인화 첫 줄」',()=>{
  const header=['분야','이름','포폴 링크','인스타 DM','문의 채널','이메일','조사 등급','직접 확인 (O/△/X)','평가 등급','비고','직접 컨택 후보','무리','플랫폼','연락 구분','조사 연락 경로(원문)','최근 활동','조사 메모','컨택 상태','조사 키','연락 날짜','연락 경로','응답','재연락 금지','지급일','지급액','조사 원 링크','링크 확인','유형','비고','가입 아이디','시딩 계정','앱에 올린 작품 수','개인화 첫 줄'];
  const row=['일러스트','연두','https://www.behance.net/yeondu','@yeondu.art','프로필 메일','y@example.com','A','O','B (2만원)','질감이 좋다','O','','비핸스','','','','','미연락','k1','','','','','','','','','개인','','','','','배경을 손으로 긁어 낸 질감이 계속 생각났어요.'];
  const r=K.convert([header,row]);
  assert.deepEqual([r.columns.checked,r.columns.pick,r.columns.grade,r.columns.contact,r.columns.url,r.columns.seen,r.columns.status],['직접 확인 (O/△/X)','직접 컨택 후보','평가 등급','인스타 DM','포폴 링크','개인화 첫 줄','컨택 상태']);
  const [p]=r.people;
  assert.equal(K.ready(p),true);
  assert.equal(p.grade,'B');
  assert.equal(p.handle,'yeondu.art');
  assert.equal(K.channelOf(p),'email');
  assert.equal(p.seen,'배경을 손으로 긁어 낸 질감이 계속 생각났어요.');
  // 플랫폼 수집 tab: same checked header, 「포트폴리오 링크」, blank 직접 확인 → not ready
  const q=K.convert([['분야·직무','이름','플랫폼','유형','포트폴리오 링크','이메일','인스타 DM','직접 컨택 후보','연락 목적','직접 확인 (O/△/X)','평가 등급','컨택 상태'],['2D','포스트','TVCF','회사','https://star.tvcf.co.kr/x','s@example.com','','O','새 작업 의뢰','','','미연락']]).people[0];
  assert.equal(K.ready(q),false);
  assert.equal(q.purpose,'새 작업 의뢰');
});

test('a parenthetical that is not an answer hint keeps the header distinct: 「컨택 상태 (이전)」 is not the status column',()=>{
  const r=K.convert([['이름','연락 창구','컨택 상태 (이전)','컨택 상태'],['연두','y@example.com','미연락','발송 완료']]);
  assert.equal(r.columns.status,'컨택 상태');
  assert.match(K.blockedWhy(r.people[0]),/발송 완료/);
});

test('an existing 「인스타」 contact column still wins over 「인스타 DM」, keeping the 메일 없음 note',()=>{
  const [p]=K.convert([['이름','이메일','인스타 DM','인스타'],['가','ga@x.com','@ga.art','@ga.art 메일 없음']]).people;
  assert.equal(K.channelOf(p),'dm');
});
