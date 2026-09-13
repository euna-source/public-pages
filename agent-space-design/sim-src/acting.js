import * as T from 'three';

const smooth=x=>{x=T.MathUtils.clamp(x,0,1);return x*x*(3-2*x);};
const rise=(t,a,b)=>smooth((t-a)/(b-a));
const window=(t,a,b,c,d)=>rise(t,a,b)*(1-rise(t,c,d));

// A performance has an input, a thought, a physical response, a held thought and a recovery.
// These channels deliberately arrive at different times; they are not simultaneous pose presets.
export function performance(name,age,key){
 const p={name,age,face:'calm',intensity:0,lean:0,side:0,head:0,headSide:0,lower:0,hand:0,breath:0,prop:true,contact:'forehead',crouch:0,cross:0,pick:0,paper:'normal',idea:0};
 if(name==='disappointed'){
  p.intensity=window(age,.65,1.35,6.8,8.1);
  p.face=age<.65?'focused':age<1.4?'surprised':age<7.3?'disappointed':age<9?'relieved':'focused';
  p.lean=.13*window(age,1.3,2.2,6.5,8.3);
  p.side=-.07*window(age,1.6,2.5,6.5,8.5);
  p.head=.19*window(age,1,1.9,6.8,8.2)-.17*window(age,.64,.93,1.16,1.55);
  p.lean-=.035*window(age,.72,1.03,1.24,1.72);
  p.headSide=-.12*window(age,1.4,2.4,6.6,8.1);
  p.hand=window(age,1.85,3.0,5.9,7.65);
  p.breath=.015*Math.sin(Math.PI*rise(age,5.7,7.8));
  p.prop=true;
 }
 if(name==='brooding'){
  const hold=window(age,.8,1.8,6.3,8.3);
  p.face=age<.6?'focused':age<6.8?'brooding':age<8.8?'relieved':'focused';
  p.lean=.10*hold;p.side=.065*hold;p.head=.10*hold;p.headSide=.11*hold;
  p.hand=window(age,1.1,2.4,6.0,7.9);p.contact='chin';p.intensity=hold;
 }
 if(name==='pickup'){
  const bend=window(age,.55,2.1,3.35,5.3);
  p.face=age<.6?'curious':age<5.3?'focused':'pleased';
  p.crouch=bend;p.lower=(key==='howl'?.44:.09)*bend;
  p.lean=(key==='howl'?.72:.35)*bend;p.head=.18*window(age,.25,.9,4.8,5.8);
  p.hand=window(age,1.0,2.25,3.4,5.5);p.contact='paper';
  p.paper=age<2.35?'ground':'hand';p.pick=rise(age,2.3,2.5);p.prop=true;
 }
 if(name==='crossleg'){
  const sit=window(age,.55,2.8,9.8,12.6);
  p.face=age<2.3?'calm':age<7.5?'brooding':age<11?'relieved':'calm';
  p.lower=(key==='howl'?.40:.10)*sit;p.cross=window(age,1.8,3.1,9.5,11.3);
  p.crouch=sit*(1-p.cross);p.lean=.10*window(age,.6,1.5,2.2,3.2)+.16*window(age,10.8,11.6,12.1,13);
  const living=window(age,2.9,3.6,9.4,10.1);
  p.breath=.007*Math.sin((age-3)*1.3)*living;
  p.side=.035*Math.sin((age-3)*.72)*living;p.lean+=.014*Math.sin(age*.7)*living;
  p.head=.11*sit-.07*window(age,7.45,8.2,9.0,9.8)+.012*Math.sin(age*1.1)*living;
  p.headSide=.04*sit+.025*Math.sin((age-3)*.6)*living;p.prop=false;
 }
 if(name==='idea'){
  p.face=age<.35?'focused':age<1.2?'surprised':age<4.5?'pleased':'calm';
  p.idea=window(age,.75,1.7,3.5,5.1);p.lean=-.07*p.idea;p.head=-.05*p.idea;p.side=-.025*p.idea;
  p.prop=true;
 }
 if(name==='read'){
  p.face='focused';p.head=.08+Math.sin(age*.9)*.015;p.headSide=.022*Math.sin(age*.4);
  p.lean=.025+Math.sin(age*1.6)*.003;p.side=.025;
 }
 return p;
}
