// Underpass: cold neon, machinery and an approaching threat. Original A–B–A–B–C score.
export function createUnderpassTheme(){
 const bpm=128,beat=60/bpm,sectionBars=8,duration=88*4*beat,events=[];
 const harmony=['Em(add9)','Em(add9)','Cmaj7/E','Cmaj7/E','Em(add9)','Em(add9)','F/E','B(no3)',
 'Em','Cmaj7','G(add9)','B(no3)','Em','Cmaj7','Fmaj7','B(no3)'];
 const roots=[-5,-5,-5,-5,-5,-5,-5,2,-5,-9,-2,2,-5,-9,-4,2];
 const chords=[[-5,2,10,21],[-5,2,10,21],[-5,3,10,14],[-5,3,10,14],[-5,2,10,21],[-5,2,10,21],[-5,3,8,12],[2,9,14,20],
 [-5,2,10,14],[-9,-2,7,10],[-2,5,14,21],[2,9,14,20],[-5,2,10,14],[-9,-2,7,10],[-4,3,8,15],[2,9,14,20]];
 for(let globalBar=0;globalBar<32;globalBar++){
  const b=globalBar%16,second=globalBar>=16;
  const B=b>=8,root=roots[b],meta={section:B?'B':'A',formIndex:Math.floor(globalBar/8),bar:globalBar,chord:harmony[b]};
  const put=(pos,kind,pitch,len,vel,lane,pan=0,extra={})=>events.push([(globalBar*4+pos)*beat,kind,pitch,len*beat,vel,pan,lane,{...meta,...extra}]);
  // A stalks; B opens into a driving four-on-the-floor pulse.
  for(const p of B?[0,1,2,3]:[0,1.75,2.5])put(p,'kick',-2,.55,.82,1701);
  for(const p of [1,3])put(p,'snare',-3,.34,.65,1701);
  for(let n=0;n<8;n++)put(n*.5,'hat',0,n%2?.17:.10,n%2?.48:.27,1701,n%2?.12:-.12);
  if(B)for(const p of [1.75,2.75])put(p,'hat',0,.08,.18,1701,-.2);
  if(b===7||b===15)for(const [n,p]of [3.25,3.5,3.75].entries())put(p,'snare',-3,.16,.24+n*.09,1701);
  const rhythm=B?[0,.5,.75,1.5,2,2.5,2.75,3.5]:[0,.75,1.5,2,2.75,3.5];
  rhythm.forEach((p,n)=>put(p,'cyberbass',root+(n===rhythm.length-1?12:n===3?7:0),.30,n%3===0?.64:.48,1702));
  put(0,'cyberpad',chords[b],3.92,B?.30:.25,1703,b%2?.2:-.2);
  // Sparse minor-second friction in A becomes an insistent octave motif in B.
  const turnaround=B&&(b===11||b===15);
  const motif=turnaround?(second?[[.5,12,.6],[1.5,17,.20],[1.75,19,.35],[2.25,17,.20],[2.5,15,.35],[3,14,.7]]:[[.5,12,.6],[1.5,17,.35],[2.25,19,.35],[3,17,.7]]):B?[[.5,14,.6],[1.5,21,.35],[2.25,22,.35],[3,21,.7]]:
   b%2===0?[[.5,14,1.15],[2.5,b===6?15:21,1.1]]:[[1,22,.8],[2.5,21,1.1]];
  for(const [p,n,len]of motif){
   put(p,'cyberlead',n+(B?0:-12),len,B?.28:.23,1704,-.12);
   if(second)put(p,'thanathoa',n+(B?0:-12),len,B?.28:.23,1706,.12);
  }
  if(B)for(const [n,p]of [.25,1.25,2.75,3.75].entries())put(p,'cyberpulse',chords[b][1+n%3]+12,.18,.20,1705,n%2?.35:-.35);
 }
 // C: low E pedal, semitone/tritone shadows, driving kick, backbeat snare and accented sixteenth hats.
 const cChords=[[-17,-10,-2,2],[-17,-10,-2,2],[-17,-9,-4,3],[-17,-9,-4,3],[-17,-10,-2,2],[-17,-10,-2,2],[-17,-11,-4,1],[-17,-10,-2,2]];
 for(let b=0;b<8;b++){
  const globalBar=32+b,meta={section:'C',formIndex:4,bar:globalBar,chord:'E pedal'};
  const put=(pos,kind,pitch,len,vel,lane,pan=0)=>events.push([(globalBar*4+pos)*beat,kind,pitch,len*beat,vel,pan,lane,meta]);
  for(const pos of [0,1,2,3])put(pos,'kick',-2,.55,.88,1701);
  if(b%2)put(3.5,'kick',-2,.35,.62,1701);
  for(const pos of [1,3])put(pos,'snare',-3,.34,.76,1701);
  if(b===3||b===7)for(const pos of [3.5,3.75])put(pos,'snare',-3,.15,.40,1701);
  for(let n=0;n<16;n++)put(n*.25,'hat',0,.10,n%4===0?.58:n%2===0?.40:.26,1701,n%2?.12:-.12);
  for(const [n,pos]of [0,.5,.75,1,1.5,2,2.5,2.75,3,3.5].entries())put(pos,'cyberbass',n===9?(b===6?1:b%2?-4:7):n===4||n===7?7:-5,.23,n%3===0?.72:.56,1702);
  put(0,'cyberpad',cChords[b],3.92,.38,1703,b%2?.2:-.2);
  // Original staggered rhythm, with the chromatic notes in a single octave.
  const leadRhythm=b%2?[[1,1],[2.5,1.1]]:[[.5,1.4],[2.5,1.2]];
  leadRhythm.forEach(([pos,len],n)=>put(pos,'thanathoa',7+(b%2)*2+n,len,.286,1706,n?.10:-.10));
 }
 // D gives the foreground to a continuous monophonic acid sequence.
 const acidPatterns=[[-5,-5,7,-5,2,-5,8,7,-5,2,-5,7,10,8,2,-5],[-5,7,-5,2,-5,8,7,2,-5,-5,7,10,8,7,2,-4]];
 for(let b=0;b<8;b++){
  const meta={section:'D',formIndex:5,bar:40+b,chord:'E Phrygian'},start=(40+b)*4*beat;
  const put=(pos,kind,pitch,len,velocity,lane,extra={})=>events.push([start+pos*beat,kind,pitch,len*beat,velocity,0,lane,{...meta,...extra}]);
  for(const pos of [0,1,2,3])put(pos,'kick',-2,.55,.88,1701);
  for(const pos of [1,3])put(pos,'snare',-3,.34,.72,1701);
  for(let n=0;n<16;n++)put(n*.25,'hat',0,n%4===2?.18:.09,n%4===2?.52:n%2?.22:.35,1701);
  if(b===7)for(const pos of [3.5,3.75])put(pos,'snare',-3,.15,.42,1701);
  const notes=acidPatterns[b%2].map((pitch,n)=>({pitch,at:n*.25*beat,accent:[0,6,10,14].includes(n),slide:[2,6,7,12,13].includes(n),gate:.72}));
  put(0,'acidbass',notes[0].pitch,4,.35,1702,{notes,step:.25*beat,brightness:.65+b*.11});
  put(0,'cyberpad',[-17,-10,-2],3.92,.16,1703);
 }
 const baseEvents=events.slice(),extraHarmony=[];
 const tripletTemplate=baseEvents.find(e=>e[7].formIndex===2&&e[1]==='thanathoa');
 // Starred reprises preserve the original arrangement and add a quieter acid layer.
 for(const [i,sourceIndex]of [0,1,2,3,4].entries()){
  const index=6+i,name=['A**','B*','A*′','B**′','C**′'][i],shift=(index-sourceIndex)*32*beat;
  for(const e of baseEvents.filter(e=>e[7].formIndex===sourceIndex)){
   const lead=['cyberlead','thanathoa'].includes(e[1]),meta={...e[7],section:name,formIndex:index,bar:e[7].bar+(index-sourceIndex)*8};
   if(i===3&&lead&&[3,7].includes(e[7].bar%8))continue;
   const pitch=lead?e[2]+(i===1?0:i===2&&e[1]==='thanathoa'?24:12):e[2];
   if(i===4&&e[1]==='thanathoa'){
    const localBar=e[7].bar%8,slot=(e[2]-7)%2;
    events.push([(index*32+localBar*4+slot*2)*beat,e[1],pitch,2*beat,...e.slice(4,7),meta]);
   }else if(i===2&&e[1]==='thanathoa'){
    for(let n=0;n<3;n++)events.push([e[0]+shift+n*tripletTemplate[3]/6,e[1],tripletTemplate[2]+36-n*2,tripletTemplate[3]/6,e[4],e[5],e[6],{...meta,descendingTriplet:true,echoTaps:4,echoStep:.75*beat,slowFilter:{start:index*32*beat,duration:32*beat}}]);
   }else if(i===3&&lead&&Math.abs(e[0]/beat%4-3)<1e-8){
    // Turn the final F# into a compact F#–G–F# ornament within its existing slot.
    for(const [offset,interval,length]of [[0,0,.25],[.25,1,.25],[.5,0,.5]])events.push([e[0]+shift+offset*e[3],e[1],pitch+interval,e[3]*length,...e.slice(4,7),{...meta,endingOrnament:true,ornamentDelay:{end:e[0]+shift+2.5*beat-.02,step:.1875*beat}}]);
   }else{
    events.push([e[0]+shift,e[1],pitch,...e.slice(3,7),{...meta,...(i===0&&e[1]==='cyberlead'?{fadeIn:true,voice:0}:{})}]);
    if(i===1&&e[1]==='cyberlead')events.push([e[0]+shift+.06,'vstdefault',pitch,e[3]-.06,.20,.12,1710,{...meta,delayedSwell:true}]);
    if(i===0&&e[1]==='cyberlead'){
     const entry=Math.min(.24,e[3]*.55)+.025;
     events.push([e[0]+shift+entry,'vstdefault',pitch,e[3]-entry,.20,.12,1710,{...meta,delayedSwell:true}]);
    }
    if(i===0&&e[1]==='cyberlead')events.push([e[0]+shift,e[1],pitch-5,e[3],e[4]*.7,.12,e[6],{...meta,fadeIn:true,voice:1}]);
   }
  }
  if(i===3)for(const b of [3,7])for(const kind of ['cyberlead','thanathoa']){
   const motif=[[.5,12,.6],[1.5,17,.35],[2.25,19,.35],[3,17,.7/3],[3+.7/3,15,.7/3],[3+1.4/3,14,.7/3]];
   for(const [pos,pitch,len]of motif)events.push([(index*32+b*4+pos)*beat,kind,pitch+12,len*beat,.28,kind==='cyberlead'?-.12:.12,kind==='cyberlead'?1704:1706,{section:name,formIndex:index,bar:index*8+b,endingTriplet:pos>=3}]);
  }
  for(let b=0;b<8;b++){
   const sourceBar=sourceIndex*8+b,root=baseEvents.find(e=>e[7].bar===sourceBar&&e[1]==='cyberbass')?.[2]??-5;
   const notes=acidPatterns[b%2].map((pitch,n)=>({pitch:pitch+root+5,at:n*.25*beat,accent:[0,6,10,14].includes(n),slide:[2,6,7,12,13].includes(n),gate:.72}));
   const chord=baseEvents.find(e=>e[7].bar===sourceBar)?.[7].chord;extraHarmony.push(chord);
   events.push([(index*32+b*4)*beat,'acidbass',notes[0].pitch,4*beat,.45,0,1702,{section:name,formIndex:index,bar:index*8+b,chord,notes,step:.25*beat,brightness:.65+b*.07}]);
  }
 }
 // A′: a seeded random order of the original four notes, in a fixed register.
 let arpSeed=28417,lastArpPitch=null;
 const nextArpPitch=()=>{
  arpSeed=(Math.imul(arpSeed,1664525)+1013904223)>>>0;
  const choices=[38,36,34,26].filter(p=>p!==lastArpPitch);
  return lastArpPitch=choices[Math.floor(arpSeed/4294967296*choices.length)];
 };
 const arpFilters=[
  [450,1800,.45,1.05],[280,1300,.55,1.08],[250,1300,.55,1.1],[500,2400,1.05,1.3],
  [800,3400,.6,1.1],[1400,4400,.55,1.08],[600,2600,.85,1.2],[350,1700,.65,1.15]
 ];
 for(let b=0;b<2;b++)for(let n=0;n<32;n++){
  const step=b*32+n,pitch=nextArpPitch();
  const [low,high,resonance,envAmount]=arpFilters[b];
  events.push([(64+b*4+n*.125)*beat,'cyberarp',pitch,.16*beat,step%4===0?.24:.18,n%2?.2:-.2,1707,{section:'A′',formIndex:2,bar:16+b,chord:harmony[b],warmArp:true,echoTaps:4,echoStep:.75*beat,echoGain:.50,echoDecay:.65,echoCutoff:1800,arpSweep:{start:(64+b*4)*beat,period:8*beat,low,high,resonance,envAmount,falling:b%2===1},vibrato:{rate:4.7,depth:5}}]);
 }
 // Add these details after building reprises, so starred sections stay intact.
 for(const e of events)if(e[1]==='cyberlead'&&e[7].formIndex===0){e[1]='vstdefault';if(e[2]===2){e[2]=-10;e[7]={...e[7],filterBite:true};}}
 for(const e of events)if(e[1]==='vstdefault'&&e[7].formIndex===0&&e[2]!==-10)e[7]={...e[7],echoTaps:4,echoStep:.75*beat};
 // Reinforce only A's B1 notes with the original lead voice.
 for(const e of events.filter(e=>e[1]==='vstdefault'&&e[7].formIndex===0&&e[2]===-10))events.push([e[0],'cyberlead',e[2],e[3],e[4],.12,1704,{section:'A',formIndex:0,bar:e[7].bar,chord:e[7].chord,lowLeadLayer:true,filterBite:true}]);
 for(const e of events)if(e[7].formIndex===0&&e[2]===-10&&['vstdefault','cyberlead'].includes(e[1]))e[4]*=.9;
 // B2 on beat 1 (A2 in bar 7) leads into B1 (A1 in bar 7), using the same two voices.
 for(const e of events.filter(e=>e[7].formIndex===0&&e[2]===-10&&['vstdefault','cyberlead'].includes(e[1])))events.push([e[0]-.5*beat,e[1],e[7].bar===6?0:2,.5*beat,e[4]*.75,e[5],e[6],{...e[7],lowLeadLayer:false,b2Pickup:true}]);
 for(const e of events)if(e[7].formIndex===0&&e[7].bar===6&&e[2]===-10&&['vstdefault','cyberlead'].includes(e[1]))e[2]=-12;
 // A′ also carries A's octave-drop openings, alongside its existing arrangement.
 for(const e of events.filter(e=>e[7].formIndex===0&&['vstdefault','cyberlead'].includes(e[1])&&(e[7].b2Pickup||e[2]<=-10)))events.push([e[0]+64*beat,...e.slice(1,7),{...e[7],section:'A′',formIndex:2,bar:e[7].bar+16,lowLeadLayer:false,b2Pickup:false,aPrimeLowMotif:true}]);
 // A′ bar 3: G5 eighths, opening/closing filter and a fading final half-bar.
 for(let n=0;n<8;n++)events.push([(72+n*.5)*beat,'cyberarp',34,.46*beat,[.40,.40,.40,.40,.32,.23,.14,.05][n],0,1707,{section:'A′',formIndex:2,bar:18,chord:harmony[2],lowGPulse:true,echoTaps:4,echoStep:.75*beat,arpSweep:{start:72*beat,period:4*beat,low:280,high:2200,resonance:1.2,envAmount:1.1},vibrato:{rate:4.7,depth:3}}]);
 // Repeat the two-bar arp and G pulse in bars 5–7, preserving their note order.
 for(const e of events.filter(e=>e[1]==='cyberarp'&&e[7].formIndex===2&&e[7].bar<=18)){
  events.push([e[0]+16*beat,...e.slice(1,7),{...e[7],bar:e[7].bar+4,arpSweep:{...e[7].arpSweep,start:e[7].arpSweep.start+16*beat}}]);
 }
 // Keep just the sustained E4 / C#5 targets, with their swell and delay.
 for(const [bar,target]of [[19,19],[23,28]]){
  const pos=1.5;
  events.push([(bar*4+pos)*beat,'cyberarp',target,(4-pos)*beat,.28,.15,1707,{section:'A′',formIndex:2,bar,sustainFade:true,swellIn:true,clusterFadeAt:(bar*4+3)*beat,echoTaps:4,echoStep:1.5*beat,echoDecay:.68,echoGain:.70,arpSweep:{start:bar*4*beat,period:8*beat,low:650,high:2800,resonance:.8,envAmount:1.05,falling:true},vibrato:{rate:4.7,depth:5}}]);
 }
 // Subtle Lahopterix pairs rise from an octave below, reaching their targets
 // with each sustained target note, then hold and fade together.
 for(const [bar,notes]of [[19,[26]],[23,[23,28]]])for(const [voice,pitch]of notes.entries())events.push([bar*4*beat,'lahopterix',pitch,4*beat,.09,voice?.18:-.18,1707,{section:'A′',formIndex:2,bar,glideFromBelow:12,glideSeconds:1.5*beat,fadeOut:.25}]);
 // Barely audible upper Lahopterix voices follow the same rising envelope.
 for(const [bar,pitch]of [[19,31],[19,43],[19,39],[23,40]])events.push([bar*4*beat,'lahopterix',pitch,4*beat,.018,0,1707,{section:'A′',formIndex:2,bar,upperLahopterix:true,glideFromBelow:12,glideSeconds:1.5*beat,fadeOut:.25}]);
 // Warm Thanathoa replies: B5–A5–G5 first, A5–G5–F5 over G#–C#.
 for(const [bar,transpose]of [[19,0],[23,-2]])for(let pulse=0;pulse<4;pulse++)for(const [n,pitch]of [38,36,34].entries())events.push([(bar*4+pulse)*beat+n*tripletTemplate[3]/6,'thanathoa',pitch+transpose,tripletTemplate[3]/6,bar===23?.075:.14,.12,1706,{section:'A′',formIndex:2,bar,warmTriplet:true,...(bar===23?{phraseFade:{start:(bar*4+2.5)*beat,end:(bar*4+3.8)*beat}}:{}),warmFilter:{start:bar*4*beat,duration:4*beat,low:260,high:1150},feedbackDelay:{time:.75*beat,feedback:bar===23?.45:.72,wet:bar===23?.25:.45,cutoff:950}}]);
 // A high C#6 Rhodesia swell covers only beats 3–4 of the second Lahopterix bar.
 events.push([94*beat,'organ',40,2*beat,.055,-.12,1707,{section:'A′',formIndex:2,bar:23,rhodesiaSwell:true,swell:true,swellRise:beat}]);
 // Compare each even bar with its preceding odd bar: preserve existing fills
 // and C's alternating kick pattern instead of piling another variation on top.
 const drums=new Set(['kick','snare','hat']);
 const signature=bar=>JSON.stringify(events.filter(e=>e[7].bar===bar&&drums.has(e[1])).map(e=>[e[1],Math.round((e[0]/beat-bar*4)*1000),e[3],e[4]]));
 for(let bar=1;bar<48;bar+=2){
  if(signature(bar)!==signature(bar-1))continue;
  const template=events.find(e=>e[7].bar===bar&&e[1]==='kick');
  for(const [pos,velocity]of (bar%4===1?[[3.25,.48],[3.75,.60]]:[[.75,.52],[2.75,.46]])){
   if(events.some(e=>e[7].bar===bar&&e[1]==='kick'&&Math.abs(e[0]/beat-bar*4-pos)<.001))continue;
   events.push([(bar*4+pos)*beat,'kick',-2,.25*beat,velocity,0,1701,{...template[7],kickVariation:true}]);
  }
 }
 // Inverted Hot Sauce Groove: the supplied bar played at half speed over two bars.
 // Beat 1 has eight 32nds; beat 2 starts with four 32nds, then two 16ths.
 for(let i=events.length-1;i>=0;i--)if(events[i][7].formIndex===8&&drums.has(events[i][1]))events.splice(i,1);
 for(let bar=64;bar<72;bar+=2){
  const put=(pos,kind,len,velocity,extra={})=>events.push([(bar*4+pos*2)*beat,kind,kind==='kick'?-2:kind==='snare'?-3:0,len*2*beat,velocity,kind==='hat'?.12:0,1701,{section:'A*′',formIndex:8,bar:bar+Math.floor(pos/2),groove:'inverted-hot-sauce',...extra}]);
  for(const pos of [0,.375,.5,.875,2])put(pos,'kick',.45,pos===0||pos===2?.82:.66);
  for(const pos of [.125,.25,.625,.75])put(pos,'snare',.12,.20,{ghost:true});
  for(const pos of [1,3])put(pos,'snare',.34,.76,{accent:true});
  for(const pos of [0,.375,.5,1,1.125,1.25,1.375,1.5,1.75,2,2.25,2.5,2.75,3,3.25,3.5,3.75]){
   const open=pos===1.75,accent=pos===1||pos===1.5||pos===3;
   put(pos,'hat',open?.25:.095,open?.48:accent?.50:.28,{articulation:open?'open-hat':'closed-hat',accent});
  }
 }
 // Phrase-ending snare fills are installed after reprises are copied.
 // Replace snares inside each fill window; preserve the kick and hi-hat groove.
 const fill=(index,ending,span,hits,id)=>{
  const start=(index*32+ending-span)*beat,end=(index*32+ending)*beat;
  for(let i=events.length-1;i>=0;i--)if(events[i][7].formIndex===index&&events[i][1]==='snare'&&events[i][0]>=start&&events[i][0]<end)events.splice(i,1);
  for(const [pos,velocity]of hits){const at=start+pos*beat;
   events.push([at,'snare',-3,Math.min(.14*beat,end-at),velocity,0,1701,{section:index===8?'A*′':'C',formIndex:index,bar:Math.floor(at/(4*beat)+1e-8),snareFill:id,fillSpan:span,...(index===8?{groove:'inverted-hot-sauce'}:{})}]);
  }
 };
 fill(8,8,.5,[[0,.42],[.25,.72]],'hot-1');
 fill(8,16,1,[[0,.40],[1/3,.56],[2/3,.78]],'hot-2');
 fill(8,24,2,[[0,.74],[.5,.30],[.75,.46],[1.25,.38],[1.5,.58],[1.75,.78]],'hot-3');
 // One bar: 16ths, 32nds, 64ths, a half-beat of 32nds, then two 16ths.
 fill(8,32,4,[...Array.from({length:4},(_,n)=>[n*.25,n===0?.76:.50+n*.025]),...Array.from({length:8},(_,n)=>[1+n*.125,n%4===0?.78:.50+n*.012]),...Array.from({length:16},(_,n)=>[2+n*.0625,n%4===0?.76:.44+n*.009]),...Array.from({length:4},(_,n)=>[3+n*.125,n===0?.78:.58+n*.025]),[3.5,.76],[3.75,.84]],'hot-4');
 fill(4,8,.75,[[0,.34],[.25,.50],[.5,.76]],'c-1');
 fill(4,16,1.5,[[0,.66],[.5,.30],[.75,.45],[1,.58],[1.25,.80]],'c-2');
 fill(4,24,.75,[[0,.34],[.25,.50],[.5,.76]],'c-3');
 fill(4,32,1,Array.from({length:6},(_,n)=>[n/6,.40+n*.08]),'c-4');
 // C**′: extra 4& backbeats; retain and accent bar 8's existing fill hit.
 for(const [bar,pos]of [[81,3.5],[85,3],[85,3.5],[87,3.5]]){
  const at=(bar*4+pos)*beat,existing=events.find(e=>e[1]==='snare'&&e[7].formIndex===10&&Math.abs(e[0]-at)<1e-8);
  if(existing){existing[4]=Math.max(existing[4],.76);existing[7]={...existing[7],endingAccent:true};}
  else events.push([at,'snare',-3,.22*beat,.76,0,1701,{section:'C**′',formIndex:10,bar,endingAccent:true}]);
 }
 const form=['A','B',"A′","B′",'C','D','A**','B*','A*′','B**′','C**′'],sections=form.map((name,index)=>({name,index,start:index*32*beat,duration:32*beat,bars:8,meter:'4/4'}));
 // Section trims offset density as layers accumulate, without flattening accents.
 const sectionMixDb=[0,-.8,-1,-1.5,-1.8,-1.2,-1.5,-1.5,-2,-2,-2];
 for(const e of events)e[7]={...e[7],mixGain:10**(sectionMixDb[e[7].formIndex]/20)};
 return {sectionMixDb,bpm,drumBpm:bpm,sectionBars,drumSectionBars:8,form,sections,duration,harmony:[...harmony,...harmony,...Array(8).fill('E pedal'),...Array(8).fill('E Phrygian'),...extraHarmony],events:events.sort((a,b)=>a[0]-b[0])};
}
