const {test}=require('node:test');
const assert=require('node:assert/strict');
const {parseDelimited,convert,convertBook,formatPrize,personPrize}=require('./sheet.js');
function fixture(){return [
 ['11월 1주차'],
 ['순위','수령인','활동 점수','상품권','금액(만원)'],
 ['2','예시 수령인','100','신세계','3만 원'],[],
 ['순위','수령인','작품','리스펙트','상품권','금액(만원)'],
 ['1','예시 수령인','첫 줄\n둘째 줄','100','신세계','5만 원'],[],
 ['수령인','크리에이터(만원)','작품(만원)','신세계(만원)','CU(만원)','총합(만원)','지급 대상','당첨 안내'],
 ['예시 수령인','3','5','8','0','8','지급대상','안내완료'],
 ['제외한 수령인','0','1','0','1','1','지급제외','미안내'],
 ['전체 합계','3','6','8','1','9'],
 ['예외 메모','','','','','','지급대상']];}
test('quoted CSV keeps embedded newlines, commas, quotes and BOM',()=>{
 assert.deepEqual(parseDelimited('\uFEFF주차,작품\r\n11월 1주차,"a,b\n""c"""'),[['주차','작품'],['11월 1주차','a,b\n"c"']]);
 assert.throws(()=>parseDelimited('a,"unterminated'));
});
test('TSV from Sheets preserves multiline cells',()=>{
 assert.deepEqual(parseDelimited('A\tB\n1\t"첫 줄\n둘째 줄"'),[['A','B'],['1','첫 줄\n둘째 줄']]);
});
test('only explicit eligible people, includes previously notified and ignores footer',()=>{
 const d=convert(fixture());assert.equal(d.people.length,1);assert.equal(d.total,8);
 assert.equal(d.people[0].notice,'안내완료');assert.equal(d.people[0].prize,'신세계 모바일 상품권 5만 원(1장), 3만 원(1장)');
 assert.equal(d.people[0].awards.split('\n').length,2);assert.match(d.people[0].awards,/첫 줄 둘째 줄/);
});
test('amount mismatch blocks generation even when grand total matches',()=>{
 const r=fixture();r[8][1]='4';r[8][2]='4';assert.throws(()=>convert(r),/합계가 맞지/);
});
test('gift breakdown mismatch and malformed amounts block generation',()=>{
 const r=fixture();r[8][3]='7';assert.throws(()=>convert(r),/합계가 맞지/);
 r[8][3]='N/A';assert.throws(()=>convert(r),/금액/);
});
test('duplicate recipients and unsupported tabs fail visibly',()=>{
 const r=fixture();r.splice(9,0,[...r[8]]);assert.throws(()=>convert(r),/중복/);
 assert.throws(()=>convert([['11월 1주차 접속기록'],['부문','수령인','지급 대상']]),/사람별 관리표/);
});
test('zero eligible people is a valid empty state',()=>{
 const r=fixture();r[8][6]='지급제외';assert.equal(convert(r).people.length,0);
});
test('unused gift amount may be blank but total cannot be blank',()=>{
 const r=fixture();r[8][4]='';assert.equal(convert(r).total,8);
 r[8][5]='';assert.throws(()=>convert(r),/금액/);
});
test('workbook import keeps weekly tabs, skips helper tabs and reports broken weeks',()=>{
 const bad=fixture();bad[0]=['10월 4주차'];bad[8][3]='7';
 const {weeks,errors}=convertBook([
  {name:'11월 1주차 접속기록',rows:[['11월 1주차 접속기록'],['부문','수령인','지급 대상']]},
  {name:'11월 1주차',rows:fixture()},
  {name:'10월 4주차',rows:bad},
  {name:'당첨자 관리',rows:[['메모']]}]);
 assert.deepEqual(weeks.map(w=>w.week),['11월 1주차']);
 assert.equal(errors.length,1);assert.equal(errors[0].week,'10월 4주차');assert.match(errors[0].message,/^10월 4주차: .*합계가 맞지/);
 assert.throws(()=>convertBook([{name:'메모',rows:[['x']]}]),/주차별 탭/);
});
test('a copied weekly tab blocks that week instead of silently replacing it',()=>{
 const copy=fixture();copy[8][6]='지급제외';
 const {weeks,errors}=convertBook([{name:'11월 1주차',rows:fixture()},{name:'11월 1주차 사본',rows:copy}]);
 assert.equal(weeks.length,0);assert.equal(errors[0].week,'11월 1주차');assert.match(errors[0].message,/여러 개/);
});
test('a weekly tab that fails reports its week even when another week still imports',()=>{
 const bad=fixture();bad[8][3]='7';const ok=fixture();ok[0]=['10월 4주차'];
 const {weeks,errors}=convertBook([{name:'11월 1주차',rows:bad},{name:'10월 4주차',rows:ok}]);
 assert.deepEqual(weeks.map(w=>w.week),['10월 4주차']);assert.deepEqual(errors.map(e=>e.week),['11월 1주차']);
});
test('prize lists each voucher card by brand and count',()=>{
 const r=fixture();r[2]=['4','예시 수령인','100','CU','1만 원'];r[5]=['2','예시 수령인','첫 줄','100','신세계','3만 원'];
 r[8]=['예시 수령인','1','3','3','1','4','지급대상','미안내'];
 assert.equal(convert(r).people[0].prize,'신세계 모바일 상품권 3만 원(1장)\nCU 모바일 상품권 1만 원(1장)');
 const same=fixture();same[2]=['5','예시 수령인','100','CU','1만 원'];same[5]=['6','예시 수령인','x','1','CU','1만 원'];
 same[8]=['예시 수령인','1','1','0','2','2','지급대상','미안내'];
 assert.equal(convert(same).people[0].prize,'CU 모바일 상품권 1만 원(2장)');
});
test('voucher brand mismatch between rank and person tables blocks generation',()=>{
 const r=fixture();r[2][3]='CU';assert.throws(()=>convert(r),/상품권 합계가 맞지/);
});
test('a zero-amount rank row never becomes a 0-won voucher',()=>{
 const r=fixture();r.splice(3,0,['9','예시 수령인','1','CU','0만 원']);
 assert.equal(convert(r).people[0].prize,'신세계 모바일 상품권 5만 원(1장), 3만 원(1장)');
});

test('legacy prize formatting preserves denomination and quantity',()=>{
 assert.equal(formatPrize('CU 상품권 1만원 1장'), 'CU 모바일 상품권 1만 원(1장)');
 assert.equal(formatPrize('CU상품권1만원1장'), 'CU 모바일 상품권1만 원(1장)');
 assert.equal(formatPrize('신세계 모바일 상품권 5만원(1장), 3만원(2장)'), '신세계 모바일 상품권 5만 원(1장), 3만 원(2장)');
 assert.equal(formatPrize('CU 모바일 상품권 1만 원(11장)'), 'CU 모바일 상품권 1만 원(11장)');
});

test('cached single-brand totals recover card quantities from verified award amounts',()=>{
 assert.equal(personPrize({prize:'CU 상품권 1만 원',ssg:0,cu:1,total:1,awards:'작품 부문 : 6위 (1만 원)'}),'CU 모바일 상품권 1만 원(1장)');
 assert.equal(personPrize({prize:'신세계 상품권 8만 원',ssg:8,cu:0,total:8,awards:'작품 부문 : 1위 (5만 원)\n크리에이터 부문 : 2위 (3만 원)'}),'신세계 모바일 상품권 5만 원(1장), 3만 원(1장)');
 assert.equal(personPrize({prize:'CU 상품권 2만 원',ssg:0,cu:2,total:2,awards:'불명'}),'CU 모바일 상품권 2만 원');
 assert.equal(personPrize({prize:'CU 상품권 2만 원',ssg:0,cu:2,awards:'작품 부문 (1만 원)'}),'CU 모바일 상품권 2만 원');
});
