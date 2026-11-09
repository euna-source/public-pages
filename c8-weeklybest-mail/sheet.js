/* Weekly Best sheet conversion. No network or recipient data is bundled here. */
(function(root){
  'use strict';
  const clean=v=>String(v??'').trim();
  const norm=v=>clean(v).replace(/\s/g,'');
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
    if(quoted)throw Error('따옴표가 닫히지 않았어요. 시트 전체를 다시 복사해 주세요.');
    if(cell||row.length){row.push(cell);rows.push(row);}
    return rows;
  }
  function amount(v,blankZero=false){
    const s=clean(v).replace(/[\s,]/g,'').replace(/만원/g,'');
    if(!s&&blankZero)return 0;
    if(!/^\d+(\.\d+)?$/.test(s))throw Error('금액을 확인해 주세요: '+clean(v));
    return Number(s);
  }
  const money=n=>Number(n.toFixed(4))+'만 원';
  function formatPrize(text){
    return String(text??'')
      .replace(/(신세계|CU)\s*(?:모바일\s*)?상품권\s*/g,'$1 모바일 상품권 ')
      .replace(/(\d+(?:\.\d+)?)\s*만\s*원/g,'$1만 원')
      .replace(/(만 원)\s*(?:[（(]\s*(\d+)\s*장\s*[)）]|(\d+)\s*장)/g,(_,unit,a,b)=>unit+'('+(a||b)+'장)');
  }
  function personPrize(p){
    const formatted=formatPrize(p.prize);
    if(/\d+\s*장/.test(formatted))return formatted;
    const brand=Number(p.ssg)>0&&Number(p.cu)===0?'신세계':Number(p.cu)>0&&Number(p.ssg)===0?'CU':'';
    const cards=String(p.awards||'').split('\n').map(line=>line.match(/\((\d+(?:\.\d+)?)\s*만\s*원\)\s*$/)).filter(Boolean).map(m=>Number(m[1])).filter(n=>n>0).sort((a,b)=>b-a);
    const total=Number(p.total),brandTotal=brand==='CU'?Number(p.cu):Number(p.ssg);
    if(!brand||!Number.isFinite(total)||total<=0||Math.abs(brandTotal-total)>0.0001||!cards.length||Math.abs(cards.reduce((n,x)=>n+x,0)-total)>0.0001)return formatted;
    return brand+' 모바일 상품권 '+[...new Set(cards)].map(x=>money(x)+'('+cards.filter(y=>y===x).length+'장)').join(', ');
  }
  function convert(rows,weekHint=''){
    if(!Array.isArray(rows)||rows.length>2000||rows.some(r=>!Array.isArray(r)))throw Error('주차별 시트 전체 표를 가져와 주세요.');
    rows=rows.map(r=>r.map(clean));
    const weekMatch=(weekHint+' '+rows.slice(0,4).flat().join(' ')).match(/\d+월\s*\d+주차/);
    if(!weekMatch)throw Error('주차를 찾지 못했어요. 주차별 탭 전체를 가져와 주세요.');
    const week=weekMatch[0].replace(/월\s*/,'월 ');
    const summaryIndex=rows.findIndex(r=>r.some(c=>norm(c)==='지급대상')&&r.some(c=>norm(c)==='총합(만원)'));
    if(summaryIndex<0)throw Error('사람별 관리표의 수령인·총합(만원)·지급 대상 열이 필요해요. 접속기록 탭 대신 주차별 탭을 선택해 주세요.');
    const header=rows[summaryIndex];
    const col=name=>{const n=header.findIndex(c=>norm(c)===name);if(n<0)throw Error('필요한 열이 없어요: '+name);return n;};
    const ix={name:col('수령인'),status:col('지급대상'),total:col('총합(만원)'),ssg:col('신세계(만원)'),cu:col('CU(만원)'),creator:col('크리에이터(만원)'),work:col('작품(만원)')};
    const notice=header.findIndex(c=>norm(c)==='당첨안내');
    const ranks=[];
    for(let i=0;i<summaryIndex;i++){
      const h=rows[i];
      if(!h.includes('순위')||!h.includes('수령인')||!h.includes('금액(만원)')||!h.includes('상품권'))continue;
      const isWork=h.includes('작품'),ni=h.indexOf('수령인'),ri=h.indexOf('순위'),ai=h.indexOf('금액(만원)'),ti=h.indexOf('작품'),gi=h.indexOf('상품권');
      for(let j=i+1;j<summaryIndex;j++){
        const r=rows[j];if(!/^\d+$/.test(r[ri]||''))break;
        ranks.push({name:r[ni],rank:Number(r[ri]),category:isWork?'작품':'크리에이터',title:isWork?(r[ti]||'').replace(/\s+/g,' '):'',amount:amount(r[ai]),brand:norm(r[gi])});
      }
    }
    const people=[],names=new Set();
    for(let i=summaryIndex+1;i<rows.length;i++){
      const r=rows[i];
      if(/합계/.test(r[ix.name]||''))break;
      if(norm(r[ix.status])!=='지급대상')continue;
      const name=r[ix.name];if(!name||names.has(name))throw Error('수령인 이름이 비어 있거나 중복되어 있어요. 사람별 관리표를 확인해 주세요.');
      names.add(name);
      const total=amount(r[ix.total]),ssg=amount(r[ix.ssg],true),cu=amount(r[ix.cu],true);
      const awards=ranks.filter(a=>a.name===name);
      const creator=amount(r[ix.creator],true),work=amount(r[ix.work],true);
      const creatorSum=awards.filter(a=>a.category==='크리에이터').reduce((n,a)=>n+a.amount,0);
      const workSum=awards.filter(a=>a.category==='작품').reduce((n,a)=>n+a.amount,0);
      if(total<=0||Math.abs(ssg+cu-total)>0.0001||Math.abs(creator+work-total)>0.0001||!awards.length||Math.abs(creatorSum-creator)>0.0001||Math.abs(workSum-work)>0.0001)throw Error(name+' 님의 순위별 금액과 사람별 경품 합계가 맞지 않아요. 시트를 확인해 주세요.');
      // One voucher per award, so the mail lists each card and its count instead of a merged amount.
      const prizes=[];
      for(const brand of ['신세계','CU']){
        const cards=awards.filter(a=>a.brand===brand&&a.amount>0).map(a=>a.amount).sort((x,y)=>y-x);
        if(Math.abs(cards.reduce((n,x)=>n+x,0)-(brand==='CU'?cu:ssg))>0.0001)throw Error(name+' 님의 순위별 상품권과 사람별 상품권 합계가 맞지 않아요. 시트를 확인해 주세요.');
        const counts=[...new Set(cards)].map(x=>money(x)+'('+cards.filter(y=>y===x).length+'장)');
        if(counts.length)prizes.push(brand+' 모바일 상품권 '+counts.join(', '));
      }
      people.push({name,total,ssg,cu,notice:notice<0?'':r[notice],sourceRow:i+1,
        awards:awards.sort((a,b)=>a.category.localeCompare(b.category)||a.rank-b.rank).map(a=>a.category+' 부문 : '+a.rank+'위'+(a.title?' · '+a.title:'')+' ('+money(a.amount)+')').join('\n'),prize:prizes.join('\n')});
    }
    return {week,people,total:people.reduce((n,p)=>n+p.total,0),rowCount:rows.length};
  }
  // Whole-workbook import: keep every weekly tab, skip helper tabs, and refuse weeks that are broken or appear twice.
  function convertBook(sheets){
    const found=new Map(),errors=[];
    const weekName=name=>(name.match(/^\s*(\d+월\s*\d+주차)\s*$/)||[])[1]?.replace(/월\s*/,'월 ');
    for(const {name,rows} of sheets){
      try{const d=convert(rows,name);found.set(d.week,[...(found.get(d.week)||[]),{name,d}]);}
      catch(e){const week=weekName(name);if(week)errors.push({week,message:name.trim()+': '+e.message});}
    }
    const weeks=[];
    for(const [week,list] of found){
      if(list.length>1)errors.push({week,message:week+': 같은 주차 탭이 여러 개예요 ('+list.map(x=>x.name).join(', ')+'). 하나만 남긴 뒤 다시 받아 주세요.'});
      else if(!errors.some(e=>e.week===week))weeks.push(list[0].d);
    }
    if(!weeks.length&&!errors.length)throw Error('주차별 탭을 찾지 못했어요. 당첨자 관리 시트에서 받은 파일인지 확인해 주세요.');
    return {weeks,errors};
  }
  root.WeeklySheet={parseDelimited,convert,convertBook,money,formatPrize,personPrize};
  if(typeof module==='object')module.exports=root.WeeklySheet;
})(typeof globalThis==='object'?globalThis:this);
