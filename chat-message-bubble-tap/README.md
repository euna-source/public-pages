# 라운지 채팅방 · 말풍선 터치 모션 전달서

- **시작**: 말풍선 더블 탭(1번 탭 → 2번 탭) — 같은 말풍선에서 0.35초·24pt 안의 두 번째 탭에 터짐 · 한 번 탭은 반응 없음 · 말풍선마다 따로 셈 **(10/14 변경)**
- **눌림**: scale 0.96 → 1 — 0.12초 · ease-out
- **글자**: 더블 탭마다 +1pt (16 → 17 → 18 …) — 0.18초 · cubic-bezier(0.2, 0.8, 0.2, 1) · 상한 없음 · 말풍선 최대 폭 260pt 그대로(넘치면 줄바꿈)
- **이모지 개수**: 2개 · 서로 다른 2종 — Full Set 88종(motion-spec.json)에서 랜덤 조합, 직전 조합의 이모지는 다음 번에 나오지 않음 **(10/14 변경)**
- **나오는 간격**: 0.04초에 하나씩 — 2개 = 0.04초 동안
- **나오는 자리**: 손가락이 닿은 점 — 이모지 중심 = 탭 좌표
- **이모지 크기**: 26 ~ 42pt 무작위 — 시스템 이모지
- **튀어나옴**: 크기 0 → 1.3 (0.12초) → 1.0 (0.08초) — 카톡 공감처럼 «뿅»
- **위로 튀는 속도**: 390 ~ 650 pt/s 무작위 (기준 520 × 0.75~1.25) — «튀는 높이 조금 낮게» = 5단계 중 2
- **옆으로 퍼짐**: -170 ~ +170 pt/s 무작위
- **중력**: 1500 pt/s² — «떨어지는 속도 조금 느리게» = 5단계 중 2
- **회전**: 처음 -8 ~ +8° · 초당 -30 ~ +30° — 이모지가 거꾸로 서 보이지 않게 작게 둠
- **사라짐**: 화면 아래 끝 + 48pt를 지나면 지움 — 투명도 변화 없음 · 화면 밖으로 떨어져 나감
- **걸리는 시간**: 약 1.0 ~ 1.4초 — 탭 위치에 따라 다름
- **층**: 채팅 화면 위 · 상단바·입력창보다도 위 — 터치를 막지 않음(pointer-events none) · 화면 밖은 잘림
- **연타**: 더블 탭마다 새 조합 2개 — 앞의 2개는 지우고 새 2개만 보임 · 글자도 계속 +1pt
- **움직임 줄이기 설정**: 이모지가 탭 근처에 떠서 0.6초 동안 사라짐 · 낙하 없음 — iOS 동작 줄이기 / Android 애니메이션 제거

## 화면 값 (피그마)
- **피그마**: Cre8orClub_v3 › [26.10] 디자인 업데이트 › 섹션 «10월 업데이트» › «라운지 채팅방» (node 22078:23354)
- **말풍선**: radius 16 (radius/xl) · padding 12 (spacing/4) · 최대 폭 260 · 내 말 #07ED21 · 상대 #D9D9D9 (color/gray/200)
- **글자**: Pretendard Regular 16 · 행간 150% · 자간 -3% · #282828 (color/gray/800) · 스타일 body/md
- **시간·이름**: 12pt #666666 · 이름 14pt #888888 · 날짜 14pt #444444

## 계산 코드 (웹)
```js
// up = 520, g = 1500 · 이모지 2개(서로 다른 2종)
 var POOL=[/* Full Set 88종 · motion-spec.json */],prev=[];
 function pickPair(){var c=POOL.filter(function(e){return prev.indexOf(e)<0});
  var a=Math.floor(Math.random()*c.length),b=Math.floor(Math.random()*(c.length-1));if(b>=a)b++;
  prev=[c[a],c[b]];return prev.slice();}
 function clearParts(){parts.forEach(function(p){p.el.remove()});parts=[];timers.forEach(clearTimeout);timers=[];}
 var timers=[];
 function burst(x,y){
  clearParts();var pair=pickPair(),n=pair.length,up=[420,520,620,720,820][kH.value-1],g=[1100,1500,1900,2400,3000][kG.value-1];
  for(var i=0;i<n;i++)(function(i){timers.push(setTimeout(function(){
   var el=document.createElement('span');el.className='th';el.textContent=pair[i];fx.appendChild(el);
   var size=26+Math.random()*16;el.style.fontSize=size+'px';
   parts.push({el:el,x:x-size/2,y:y-size/2,vx:(Math.random()*2-1)*170,vy:-(up*(.75+Math.random()*.5)),r:(Math.random()*2-1)*8,vr:(Math.random()*2-1)*30,g:g,t:0,x0:x-size/2+(Math.random()*2-1)*40,y0:y-size/2-30-Math.random()*40});
   if(!run){run=true;last=performance.now();requestAnimationFrame(step);}
  },i*40))})(i);
 }
 var last=0;
 function step(now){var dt=Math.min(.033,(now-last)/1000);last=now;
  for(var i=parts.length-1;i>=0;i--){var p=parts[i];p.t+=dt;p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.vr*dt;
   var k=p.t/.2,sc=k<1?(k<.6?k/.6*1.3:1.3-(k-.6)/.4*.3):1;
   if(RM){p.el.style.transform='translate('+p.x0+'px,'+p.y0+'px)';p.el.style.opacity=Math.max(0,1-p.t/.6);if(p.t>.6)p.y=999;}
   else p.el.style.transform='translate('+p.x+'px,'+p.y+'px) rotate('+p.r+'deg) scale('+sc+')';
   if(p.y>860){p.el.remove();parts.splice(i,1);}}
  if(parts.length)requestAnimationFrame(step);else run=false;}

 // 더블 탭 판정 (말풍선마다)
  var first=null;
  b.addEventListener('click',function(e){
   if(e.detail!==0){var t={t:e.timeStamp,x:e.clientX,y:e.clientY};
    if(!first||t.t-first.t>350||Math.hypot(t.x-first.x,t.y-first.y)>24){first=t;return;}}
   first=null;
   // → 글자 +1pt, burst(x,y)
```
