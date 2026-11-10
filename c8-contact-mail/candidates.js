/* Candidate sheet reading. Pure functions: rows in, people out. No network, no storage, no bundled names. */
(function(root){
  'use strict';
  const clean=v=>String(v??'').replace(/\s+/g,' ').trim();
  // Header cells carry value hints like 「직접 확인 (O/△/X)」: drop a trailing parenthetical only when it lists answer marks,
  // so 「컨택 상태 (이전)」 stays a different header from 「컨택 상태」.
  const norm=v=>clean(v).replace(/\s*\([oxOX○◯△●✓✔yYnN예아니오\s\/,·]+\)\s*$/,'').replace(/[\s()·\-_/]/g,'').toLowerCase();
  // Header names seen in the seeding sheet and its predecessors. First match wins per field.
  const ALIASES={
    name:['활동명','이름','작가명','작가','닉네임','크리에이터','크리에이터명','계정명'],
    url:['주플랫폼url','주플랫폼','플랫폼url','포트폴리오','포트폴리오링크','포폴링크','포폴','대표링크','링크','url','주소','작품링크'],
    contact:['연락창구','창구','연락처','인스타','인스타그램','dm','인스타dm','문의채널'],
    email:['이메일','메일','email','e-mail','메일주소','이메일주소'],
    grade:['평가등급','등급','최종등급'],
    checked:['직접확인'],
    pick:['직접컨택후보','컨택후보','직접컨택'],
    note:['비고','메모','작품에서본점','샐리가볼점','코멘트'],
    seen:['본것한줄','본것','개인화문장','개인화첫줄','첫줄'],
    field:['분야','직군','카테고리','장르'],
    purpose:['연락목적','목적'],
    status:['연락상태','컨택상태','진행상태','상태','발송'],
    donot:['연락금지','수신거부','재연락금지','연락하지않음'],
    minor:['미성년','미성년으로보임','미성년여부']
  };
  const PLATFORMS=[
    [/instagram\.com|^@/,'인스타그램'],[/behance\.net/,'비핸스'],[/notefolio\.net/,'노트폴리오'],[/youtube\.com|youtu\.be/,'유튜브'],
    [/soundcloud\.com/,'사운드클라우드'],[/brunch\.co\.kr/,'브런치'],[/postype\.com/,'포스타입'],[/grafolio/,'그라폴리오'],
    [/in\.naver\.com/,'네이버 인플루언서'],[/blog\.naver\.com/,'네이버 블로그'],[/(x|twitter)\.com/,'X'],[/spotify\.com/,'스포티파이'],
    [/vimeo\.com/,'비메오'],[/artstation\.com/,'아트스테이션'],[/dribbble\.com/,'드리블'],[/idus\.com/,'아이디어스'],[/picturebook-illust\.com/,'그림책 일러스트 갤러리']
  ];
  function parseDelimited(text,delimiter){
    text=String(text).replace(/^\uFEFF/,'');
    delimiter=delimiter||(text.split(/\r?\n/)[0].includes('\t')?'\t':',');
    const rows=[];let row=[],cell='',quoted=false;
    for(let i=0;i<text.length;i++){
      const c=text[i];
      if(c==='"'){
        if(quoted&&text[i+1]==='"'){cell+='"';i++;}
        else if(quoted||!cell)quoted=!quoted;
        else cell+=c;
      }else if(c===delimiter&&!quoted){row.push(cell);cell='';}
      else if((c==='\n'||c==='\r')&&!quoted){
        if(c==='\r'&&text[i+1]==='\n')i++;
        row.push(cell);rows.push(row);row=[];cell='';
      }else cell+=c;
    }
    if(quoted)throw Error('따옴표가 닫히지 않았어요. 표를 다시 복사해 주세요.');
    if(cell||row.length){row.push(cell);rows.push(row);}
    return rows;
  }
  function platformName(url){
    const u=clean(url).toLowerCase();if(!u)return '';
    for(const [re,n] of PLATFORMS)if(re.test(u))return n;
    return /^https?:\/\//.test(u)?'포트폴리오 사이트':'';
  }
  // Exact first token: JS \b does not see Korean as word characters, so 「예」 needs a whole-token match.
  const yes=v=>/^(o|ㅇ|○|◯|●|예|네|y|yes|true|✓|✔|v)$/i.test(clean(v).split(/[\s(,·/]/)[0]);
  const EMAIL=/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
  function handleOf(cells){
    for(const c of cells){
      const s=clean(c);
      const m=s.match(/instagram\.com\/([A-Za-z0-9._]{1,30})/i);if(m&&!/^(p|reel|reels|stories|explore)$/i.test(m[1]))return m[1];
    }
    for(const c of cells){const m=clean(c).match(/(?:^|\s)@([A-Za-z0-9._]{2,30})(?![A-Za-z0-9._]*@)/);if(m&&!EMAIL.test(clean(c).slice(m.index)))return m[1];}
    return '';
  }
  function findHeader(rows){
    let best={index:-1,score:0};
    rows.slice(0,15).forEach((r,i)=>{
      const cells=r.map(norm);let score=0;
      Object.values(ALIASES).forEach(list=>{if(cells.some(c=>list.includes(c)))score++;});
      if(score>best.score&&cells.some(c=>ALIASES.name.includes(c)))best={index:i,score};
    });
    return best.score>=2?best.index:-1;
  }
  function columns(header){
    const cells=header.map(norm),map={};
    Object.entries(ALIASES).forEach(([field,list])=>{
      for(const a of list){const i=cells.indexOf(a);if(i>=0&&!Object.values(map).includes(i)){map[field]=i;break;}}
    });
    return map;
  }
  function gradeLetter(v){const m=clean(v).match(/^([ABCD])(?![a-z])/i);return m?m[1].toUpperCase():'';}
  /* rows: 2-D array of strings from one tab. Returns people with the sheet row number (1-based) for linking back. */
  function convert(rows,opts){
    const o=opts||{};
    if(!Array.isArray(rows)||rows.length>5000)throw Error('후보 탭 전체를 가져와 주세요(5,000행까지).');
    rows=rows.map(r=>Array.isArray(r)?r.map(c=>String(c??'')):[]);
    const h=findHeader(rows);
    if(h<0)throw Error('머리글을 찾지 못했어요. 「이름」(또는 활동명)과 「평가 등급」·「연락 창구」 같은 열이 있는 후보 탭을 가져와 주세요.');
    const col=columns(rows[h]);
    const get=(r,f)=>col[f]==null?'':clean(r[col[f]]);
    const people=[];
    for(let i=h+1;i<rows.length;i++){
      const r=rows[i],name=get(r,'name');
      if(!name)continue;
      const cells=r.map(clean);
      const url=get(r,'url')||cells.find(c=>/^https?:\/\//.test(c))||'';
      const contact=get(r,'contact');
      // Only the contact columns count: the plan says we write to channels the creator opened, not addresses found elsewhere.
      const email=((get(r,'email')+' '+contact).match(EMAIL)||[''])[0];
      const handle=handleOf([contact,url,...cells]);
      people.push({
        row:i+1,name,url,platform:platformName(url)||(handle?'인스타그램':''),
        email,handle,contact,
        grade:gradeLetter(get(r,'grade')),gradeRaw:get(r,'grade'),
        checked:col.checked==null?null:yes(get(r,'checked')),
        pick:col.pick==null?null:yes(get(r,'pick')),
        donot:get(r,'donot'),minor:yes(get(r,'minor')),note:get(r,'note'),seen:get(r,'seen'),field:get(r,'field'),purpose:get(r,'purpose'),status:get(r,'status')
      });
    }
    // Same address or handle on two rows is one person: a send on either row covers both.
    const seen=new Map();
    people.forEach(p=>ids(p).forEach(id=>{if(seen.has(id)){const q=seen.get(id);if(q!==p){(p.dupOf=p.dupOf||[]).push(q.row);(q.dupOf=q.dupOf||[]).push(p.row);}}else seen.set(id,p);}));
    return {header:h+1,columns:Object.fromEntries(Object.entries(col).map(([k,i])=>[k,rows[h][i]])),people};
  }
  /* Ready = both O when the sheet has those columns. Missing columns never silently pass people through. */
  function ready(p){return p.checked!==false&&p.pick!==false&&p.checked!==null&&p.pick!==null;}
  /* Stable identifiers: lower-cased email and Instagram handle. Names are not identifiers. */
  function ids(p){return [p.email&&('m:'+p.email.toLowerCase()),p.handle&&('i:'+p.handle.toLowerCase().replace(/^@/,''))].filter(Boolean);}
  /* Why this person must not get a first message, or '' when free. */
  function blockedWhy(p){
    if(!p)return '';
    if(clean(p.donot)&&!/^(x|아니오|no|n)$/i.test(clean(p.donot)))return '연락 금지 표시('+clean(p.donot)+')';
    if(p.minor)return '미성년 표시';
    if(!uncontacted(p))return '시트 상태 「'+clean(p.status)+'」';
    return '';
  }
  /* Not yet contacted per the sheet's status column. Empty or 미연락 counts as not contacted. */
  // Any sign of contact wins over 「대기·예정」: 「발송 완료, 답장 대기」 or 「수신거부 처리 예정」 must never read as free.
  const CONTACTED=/발송|보냄|보낸|연락함|연락 ?완료|컨택함|답장|회신|거절|수신 ?거부|무응답|완료|지급|진행 ?중|협의/;
  function uncontacted(p){const s=clean(p.status);if(!s)return true;if(CONTACTED.test(s))return false;return /^(미연락|연락 ?전|컨택 ?전|대기|예정|미정)$/.test(s);}
  /* The contact column decides. 「메일 없음」 or a DM-only note sends it to Instagram even if an address sits elsewhere. */
  function channelOf(p){
    const c=clean(p.contact);
    const noMail=/메일\s*(없음|x|X|미확인)/.test(c);
    if(p.email&&!noMail)return 'email';
    if(p.handle)return 'dm';
    return '';
  }
  const api={ALIASES,parseDelimited,platformName,findHeader,convert,ready,uncontacted,blockedWhy,ids,channelOf,yes};
  if(typeof module==='object'&&module.exports)module.exports=api;else root.Candidates=api;
})(typeof self!=='undefined'?self:this);
