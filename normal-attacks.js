import {images,drawFighter} from './art.js';
import {drawFireJet} from './wave-art.js';
import {ATTACKS} from './combat.js';
import {movementLayout} from './movement-layout.js';
import {contextLayout} from './context-layout.js';
import {weaponLayout} from './weapon-layout.js';
import {POSE_GEOMETRY,bodyLength} from './pose-geometry.js';

// Neck, hip, knee, ankle in the painted source frames. Follow the bent
// skeleton, never the rectangle containing the raised weapon.
export const weaponBones={
 'andre-ground-punch':[
  [[253,128],[263,278],[328,351],[313,455]],
  [[752,132],[759,277],[837,352],[817,456]],
  [[1265,134],[1253,285],[1323,353],[1303,458]],
  [[257,625],[240,777],[318,842],[296,953]],
  [[762,625],[766,778],[858,845],[836,953]],
  [[1252,625],[1254,771],[1340,841],[1314,955]]
 ],
 'gudeco-ground-punch':[
  [[235,107],[229,276],[292,358],[296,473]],
  [[758,109],[756,272],[813,354],[811,473]],
  [[1284,107],[1268,279],[1343,354],[1339,474]],
  [[269,592],[253,770],[326,844],[323,972]],
  [[792,594],[776,772],[843,848],[852,973]],
  [[1314,608],[1290,769],[1354,846],[1360,974]]
 ],
 'andre-push-kick':[
  [[222,119],[247,267],[307,351],[282,467]],
  [[695,121],[716,278],[724,354],[704,469]],
  [[1105,124],[1159,276],[1157,359],[1150,469]],
  [[169,623],[278,773],[291,858],[263,975]],
  [[781,623],[798,781],[805,858],[782,972]],
  [[1235,625],[1251,777],[1320,854],[1310,975]]
 ],
 'gudeco-ground-smash':[
  [[185,156],[185,344],[234,449],[244,575]],
  [[624,151],[617,301],[700,430],[717,566]],
  [[992,155],[978,300],[1090,435],[1115,565]],
  [[221,739],[211,899],[307,1009],[317,1160]],
  [[651,752],[647,904],[750,1026],[751,1160]],
  [[1022,758],[1023,935],[1080,1043],[1100,1159]]
 ],
 'andre-thesis-cast':[
  [[280,183],[298,322],[349,409],[344,517]],
  [[749,202],[783,331],[857,405],[850,518]],
  [[1244,217],[1263,337],[1320,410],[1320,518]],
  [[294,667],[302,797],[402,864],[394,972]],
  [[761,658],[791,790],[861,859],[858,976]],
  [[1237,659],[1255,795],[1310,863],[1310,976]]
 ],
 'gudeco-air-smash':[
  [[239,172],[225,348],[295,443],[250,574]],
  [[620,223],[622,355],[699,466],[654,586]],
  [[1021,243],[964,351],[1040,445],[1110,551]],
  [[264,757],[188,883],[258,984],[262,1119]],
  [[644,767],[603,914],[632,1003],[551,1140]],
  [[1021,754],[1008,936],[1080,995],[1022,1089]]
 ],
 'andre-board-bash':[
  [[203,111],[208,278],[259,347],[246,459]],
  [[751,132],[735,280],[815,344],[789,460]],
  [[1147,139],[1139,271],[1220,335],[1221,461]],
  [[219,620],[255,738],[341,816],[327,945]],
  [[746,624],[790,762],[882,829],[850,948]],
  [[1196,603],[1221,773],[1273,838],[1264,953]]
 ]
};
export function weaponAnatomicalScale(key,index){
 const id=key.startsWith('gudeco')?'gudeco':'andre',base=POSE_GEOMETRY[id];
 return base.scale*bodyLength(base.poses[base.reference])/bodyLength(weaponBones[key][index]);
}

const weaponCache=new Map();
export function weaponFrameIndex(time){
 const w=ATTACKS.melee.windup,d=ATTACKS.melee.duration;
 return time<w*.4?0:time<w?1:time<w+.055?2:time<w+.12?3:time<d-.045?4:5;
}
export function drawWeaponAttack(ctx,sprites,f){
 const thesis=f.id==='andre'&&f.attack?.kind==='special2';
 const pushKick=f.id==='andre'&&f.attack?.kind==='kick'&&f.attack.posture==='stand';
 const groundPunch=f.attack?.kind==='punch'&&f.attack.posture==='stand';
 if(f.attack?.kind!=='melee'&&!thesis&&!pushKick&&!groundPunch)return false;
 const air=f.id==='gudeco'&&f.attack.aerial;
 if(f.id!=='andre'&&f.id!=='gudeco')return false;
 const key=groundPunch?f.id+'-ground-punch':pushKick?'andre-push-kick':thesis?'andre-thesis-cast':f.id==='gudeco'?(air?'gudeco-air-smash':'gudeco-ground-smash'):'andre-board-bash';
 const index=groundPunch?groundPunchFrameIndex(f.attack.time):pushKick?pushKickFrameIndex(f.attack.time):thesis?thesisFrameIndex(f.attack.time):weaponFrameIndex(f.attack.time);
 if(key==='gudeco-ground-smash'&&(index===0||index===5)){drawFighter(ctx,'gudeco',1,f.x,f.y,f.facing);return true;}
 if(!weaponCache.has(key)){
  const atlas=images[key];
  const frames=weaponLayout[key].map(([x,y,w,h])=>{const image=document.createElement('canvas');image.width=w;image.height=h;image.getContext('2d').drawImage(atlas,x,y,w,h,0,0,w,h);isolateContextSilhouette(image);return {image,...landmarks(image),x,y};});
  const source=sprites[f.id][f.id==='gudeco'?1:0];
  const base=POSE_GEOMETRY[f.id],hip=base.poses[base.reference][1];
  const hipHeight=(source.feet+source.originY-hip[1])*source.scale;
  frames.forEach((s,i)=>{const point=weaponBones[key][i][1];s.scale=weaponAnatomicalScale(key,i);s.pivot=point[0]-s.x;s.feet=air?point[1]-s.y+hipHeight/s.scale:s.bottom;});
  weaponCache.set(key,frames);
 }
 const s=weaponCache.get(key)[index];
 ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.facing*s.scale,s.scale);ctx.drawImage(s.image,-s.pivot,-s.feet);ctx.restore();return true;
}
export function pushKickFrameIndex(time){const w=ATTACKS.kick.windup,d=ATTACKS.kick.duration;return time<.055?0:time<w?1:time<w+.06?2:time<w+.13?3:time<d-.05?4:5;}
export function groundPunchFrameIndex(time){const w=ATTACKS.punch.windup,d=ATTACKS.punch.duration;return time<.04?0:time<w?1:time<w+.04?2:time<w+.09?3:time<d-.035?4:5;}
export function thesisFrameIndex(time){return time<.08?0:time<ATTACKS.special2.windup?1:time<.39?2:time<.50?3:time<.60?4:5;}

// Complete painted frames edited from the original game cutouts. No joints,
// rotated body parts, squash/stretch, or fitting an extended limb into a box.
const normalCache=new Map();
const andreSourceCache=[];
export function drawAndreSourceFrame(ctx,sprites,index,x,y,facing=1){
 if(!andreSourceCache[index]){const image=document.createElement('canvas');image.width=600;image.height=850;image.getContext('2d').drawImage(images['andre-source-variations'],index%4*600,Math.floor(index/4)*850,600,850,0,0,600,850);andreSourceCache[index]=image;}
 const source=sprites.andre[0];
 ctx.save();ctx.translate(x,y);ctx.scale(facing*source.scale,source.scale);
 ctx.drawImage(andreSourceCache[index],-source.pivot-source.originX,-source.feet-source.originY);ctx.restore();
}
export function andreWalkFrame(time){return [0,1,2,1][Math.floor(time*8)%4];}
export function drawAndreWaveCast(ctx,sprites,time,x,y,facing){
 drawAndreSourceFrame(ctx,sprites,time<.42?3:0,x,y,facing);
}
const normalBasePose={gudeco:1,mari:0,andre:0,vorath:0};
export function vorathClawFrame(time){
 if(time<0||time>=ATTACKS.melee.duration)return -1;
 return time<.065?0:time<ATTACKS.melee.windup?1:time<.215?2:time<.275?3:time<.345?4:5;
}
// Complete silhouettes plus hip anchors measured in the source atlases.
export const vorathClawLayout={
 air:[
  [29,47,394,430,212,280],[528,4,368,505,717,298],[934,99,590,421,1160,322],
  [37,540,503,466,230,807],[546,559,409,415,727,803],[1045,540,383,458,1234,817]
 ],
 ground:[
  [45,58,384,455,207,315],[536,0,374,512,709,305],[975,70,561,444,1190,326],
  [41,549,431,448,208,831],[563,537,356,456,716,820],[1090,539,355,454,1243,824]
 ]
};
const vorathClawCache=new Map();
export function drawVorathClaw(ctx,sprites,f){
 if(f.id!=='vorath'||f.attack?.kind!=='melee')return false;
 const index=vorathClawFrame(f.attack.time);if(index<0)return false;
 const key=f.attack.aerial?'air':'ground',source=sprites.vorath[0];
 if(!vorathClawCache.has(key)){
  const atlas=images['vorath-claw-'+key];
  const frames=vorathClawLayout[key].map(([sx,sy,w,h,hipX,hipY])=>{
   const image=document.createElement('canvas');image.width=w;image.height=h;
   image.getContext('2d').drawImage(atlas,sx,sy,w,h,0,0,w,h);isolateContextSilhouette(image);
   return {image,pivot:hipX-sx,hipY:hipY-sy,bottom:landmarks(image).bottom};
  });
  vorathClawCache.set(key,frames);
 }
 const s=vorathClawCache.get(key)[index],scale=source.scale;
 // An airborne claw follows the fighter's hip, not the changing height of
 // tucked feet. No original floor pixels or sprite-local shadow are drawn.
 const hipHeight=source.feet+source.originY-POSE_GEOMETRY.vorath.poses[0][1][1];
 const feet=f.airborne?s.hipY+hipHeight:s.bottom;
 ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.facing*scale,scale);ctx.drawImage(s.image,-s.pivot,-feet);ctx.restore();return true;
}
// Full painted poses, hip anchors and rear emission points in atlas pixels.
export const vorathFireLayout=[
 [0,0,530,512,222,310,260,310],
 [530,0,510,512,822,300,852,310],
 [1040,0,496,512,1340,277,1384,287],
 [0,512,530,512,346,781,387,781],
 [530,512,520,512,865,792,906,788],
 [1050,512,486,512,1255,821,1295,821]
];
export function vorathFireFrame(time){
 if(time<0||time>=ATTACKS.special1.duration)return -1;
 return time<.10?0:time<.20?1:time<ATTACKS.special1.windup?2:time<.43?3:time<.55?4:5;
}
let vorathFireFrames;
export function drawVorathFireCast(ctx,sprites,f){
 if(f.id!=='vorath'||f.attack?.kind!=='special1')return false;
 const index=vorathFireFrame(f.attack.time);if(index<0)return false;
 if(!vorathFireFrames){const atlas=images['vorath-fire-cast'];
  vorathFireFrames=vorathFireLayout.map(([sx,sy,w,h,hipX,hipY,rearX,rearY])=>{
   const image=document.createElement('canvas');image.width=w;image.height=h;
   image.getContext('2d').drawImage(atlas,sx,sy,w,h,0,0,w,h);
   return {image,pivot:hipX-sx,feet:landmarks(image).bottom,rearX:rearX-hipX,rearY:rearY-sy};
  });
 }
 // Same source scale for every pose; crouching stays shorter and tails may
 // rise above the head without changing the size of the monster.
 const s=vorathFireFrames[index],scale=sprites.vorath[0].scale;
 ctx.save();ctx.translate(f.x,f.y);ctx.scale(f.facing*scale,scale);ctx.drawImage(s.image,-s.pivot,-s.feet);ctx.restore();
 const age=f.attack.time-ATTACKS.special1.windup;
 if(age>=0&&index<5){
  const phase=age<.04?0:age<.09?1:age<.20?2:3;
  const alpha=Math.min(1,age/.025)*Math.min(1,(.55-f.attack.time)/.045);
  drawFireJet(ctx,images['vorath-fire-jet'],phase,f.x+f.facing*s.rearX*scale,f.y+(s.rearY-s.feet)*scale,f.facing,.95,alpha);
 }
 return true;
}
// Measured transparent gutters in the textured atlases. Split at the actual
// gaps so extended fists and feet stay wholly inside their animation frame.
export const vorathPunchLayout={
 right:[[0,0,655,650],[655,0,599,650],[0,650,655,604],[655,650,599,604]],
 left:[[0,0,655,630],[655,0,599,630],[0,630,655,624],[655,630,599,624]]
};
function landmarks(canvas){
 const {width:w,height:h}=canvas,p=canvas.getContext('2d').getImageData(0,0,w,h).data;
 let top=h,bottom=0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(p[(y*w+x)*4+3]>160){top=Math.min(top,y);bottom=Math.max(bottom,y);}
 let sum=0,count=0;
 const end=top+(bottom-top)*.1;
 for(let y=top;y<end;y++)for(let x=0;x<w;x++)if(p[(y*w+x)*4+3]>160){sum+=x;count++;}
 return {top,bottom,headX:sum/Math.max(1,count)};
}
function normalFrames(sprites,id,kind,punchArm='right'){
 const key=id+'-'+kind+(id==='vorath'&&kind==='punch'?'-'+punchArm:'');
 if(normalCache.has(key))return normalCache.get(key);
 const roundhouse=id==='gudeco'&&kind==='kick';
 const source=sprites[id][normalBasePose[id]],atlas=images[roundhouse?'gudeco-roundhouse-v3':key+'-drawn'];
 const original=landmarks(source.image),frames=[];
 for(let i=0;i<(roundhouse?6:4);i++){
  const rect=roundhouse?movementLayout['gudeco-roundhouse-v3'][i]:id==='vorath'&&kind==='punch'?vorathPunchLayout[punchArm][i]:null;
  const x=rect?rect[0]:Math.floor((i%2)*atlas.width/2),y=rect?rect[1]:Math.floor(Math.floor(i/2)*atlas.height/2);
  const right=rect?x+rect[2]:Math.floor((i%2+1)*atlas.width/2),bottom=rect?y+rect[3]:Math.floor((Math.floor(i/2)+1)*atlas.height/2);
  const image=document.createElement('canvas');image.width=right-x;image.height=bottom-y;
  image.getContext('2d').drawImage(atlas,x,y,image.width,image.height,0,0,image.width,image.height);
  frames.push({image,...landmarks(image)});
 }
 // Calibrate once from the first, nearly standing drawing. Extended poses use
 // this same scale; only their anchors move to keep the planted foot grounded.
 const scale=(source.feet-original.top)*source.scale/(frames[0].bottom-frames[0].top);
 const headOffset=(original.headX-source.pivot)*source.scale;
 for(const frame of frames){frame.scale=scale;frame.pivot=frame.headX-headOffset/scale;frame.feet=frame.bottom;}
 // A roundhouse pivots around the planted front foot. Head anchoring would
 // cancel the lean-away motion and make the support foot skate sideways.
 if(roundhouse)for(const frame of frames)frame.pivot=footCenter(frame.image,true)-50/scale;
 normalCache.set(key,frames);return frames;
}
function footCenter(image,rightmost=false){
 const c=image.getContext('2d'),p=c.getImageData(0,0,image.width,image.height).data;
 const {bottom}=landmarks(image);let sum=0,n=0,min=image.width,max=0;
 for(let y=Math.max(0,bottom-8);y<=bottom;y++)for(let x=0;x<image.width;x++)if(p[(y*image.width+x)*4+3]>160){sum+=x;n++;min=Math.min(min,x);max=Math.max(max,x);}
 if(rightmost&&max-min>image.width*.4)return max-18;
 return sum/Math.max(1,n);
}
const movementCache=new Map();
const contextCache=new Map();
function isolateContextSilhouette(image){
 const c=image.getContext('2d'),w=image.width,h=image.height,p=c.getImageData(0,0,w,h),seen=new Uint8Array(w*h),q=new Int32Array(w*h);let largest=[];
 for(let seed=0;seed<w*h;seed++){
  if(seen[seed]||p.data[seed*4+3]<100)continue;let head=0,tail=1;q[0]=seed;seen[seed]=1;
  while(head<tail){const n=q[head++],x=n%w,y=Math.floor(n/w);for(const v of [x?n-1:-1,x<w-1?n+1:-1,y?n-w:-1,y<h-1?n+w:-1])if(v>=0&&!seen[v]&&p.data[v*4+3]>=100){seen[v]=1;q[tail++]=v;}}
  if(tail>largest.length)largest=Array.from(q.subarray(0,tail));
 }
 const keep=new Uint8Array(w*h);for(const n of largest){const x=n%w,y=Math.floor(n/w);for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)if(x+dx>=0&&x+dx<w&&y+dy>=0&&y+dy<h)keep[n+dy*w+dx]=1;}
 for(let n=0;n<w*h;n++)if(!keep[n])p.data[n*4+3]=0;c.putImageData(p,0,0);
}
function contextFrames(sprites,id){
 if(contextCache.has(id))return contextCache.get(id);
 const base=movementFrames(sprites,id)[2],atlas=images[id+'-context-attacks'];
 const frames=contextLayout[id].map(([x,y,w,h])=>{const image=document.createElement('canvas');image.width=w;image.height=h;image.getContext('2d').drawImage(atlas,x,y,w,h,0,0,w,h);isolateContextSilhouette(image);return {image,...landmarks(image)};});
 const scale=(base.bottom-base.top)*base.scale/(frames[0].bottom-frames[0].top);
 const headOffset=(base.headX-base.pivot)*base.scale;
 const air=movementFrames(sprites,id,true)[3],airHeadHeight=(air.feet-air.top)*air.scale;
 frames.forEach((f,i)=>{f.scale=scale;f.pivot=f.headX-headOffset/scale;f.feet=i<2?f.bottom:f.top+airHeadHeight/scale;});
 contextCache.set(id,frames);return frames;
}
export function drawContextAttack(ctx,sprites,f,x,y){
 const at=f.attack;if(!at||!['punch','kick'].includes(at.kind)||!['crouch','air'].includes(at.posture))return false;
 const {windup,duration}=ATTACKS[at.kind],contact=at.time>=windup*.65&&at.time<duration-.055;
 if(!contact){const state=at.posture==='crouch'?{...f,crouch:true,crouchTime:.12,airborne:false,preJump:0,landing:0}:{...f,airborne:true,preJump:0};drawMovement(ctx,sprites,state,x,y);return true;}
 const frame=contextFrames(sprites,f.id)[(at.posture==='air'?2:0)+(at.kind==='kick'?1:0)];
 ctx.save();ctx.translate(x,y);ctx.scale(f.facing*frame.scale,frame.scale);ctx.drawImage(frame.image,-frame.pivot,-frame.feet);ctx.restore();return true;
}
function movementFrames(sprites,id,jumping=false){
 const key=id+(jumping?'-jump-v2':'-movement');
 if(movementCache.has(key))return movementCache.get(key);
 const source=sprites[id][normalBasePose[id]],original=landmarks(source.image),atlas=images[key];
 const frames=movementLayout[key].map(([x,y,w,h])=>{const image=document.createElement('canvas');image.width=w;image.height=h;image.getContext('2d').drawImage(atlas,x,y,w,h,0,0,w,h);return {image,...landmarks(image)};});
 const referenceHeight=frames[0].bottom-frames[0].top;
 const scale=(source.feet-original.top)*source.scale/referenceHeight;
 const sourceFootOffset=(footCenter(source.image)-source.pivot)*source.scale;
 const headOffset=(original.headX-source.pivot)*source.scale;
 frames.forEach((frame,i)=>{const jump=jumping?(i>=2&&i<=4):(i===3||i===4);frame.scale=scale;frame.feet=jump?frame.top+referenceHeight:frame.bottom;frame.pivot=jump?frame.headX-headOffset/scale:footCenter(frame.image)-sourceFootOffset/scale;});
 movementCache.set(key,frames);return frames;
}
export function movementFrameIndex(f){
 if(f.preJump>0)return 6;
 if(f.airborne)return Math.abs(f.vy)<230?8:f.vy<0?7:9;
 if(f.crouch)return f.crouchTime<.08?1:2;
 if(f.landing>0)return f.landing>.04?10:1;
 if(f.crouchTime>0)return 1;
 return -1;
}
// One six-frame stride per 150 world pixels. Negative distance runs the
// same grounded cycle backward for retreat without turning away.
export function vorathWalkFrame(distance=0){return Math.floor(((distance%150)+150)%150/25);}
const walkFrames=new Map();
function drawSpriteWalk(ctx,sprites,f,x,y){
 const key=f.id+'-walk';
 if(!walkFrames.has(key)){
  const source=sprites[f.id][normalBasePose[f.id]],original=landmarks(source.image),atlas=images[key];
  const frames=movementLayout[key].map(([sx,sy,w,h])=>{
   const image=document.createElement('canvas');image.width=w;image.height=h;
   image.getContext('2d').drawImage(atlas,sx,sy,w,h,0,0,w,h);
   return {image,...landmarks(image)};
  });
  const scale=(source.feet-original.top)*source.scale/(frames[0].bottom-frames[0].top);
  const headOffset=(original.headX-source.pivot)*source.scale;
  for(const s of frames){s.scale=scale;s.pivot=s.headX-headOffset/scale;s.feet=s.bottom;}
  walkFrames.set(key,frames);
 }
 const s=walkFrames.get(key)[vorathWalkFrame(f.walkDistance)];
 ctx.save();ctx.translate(x,y);ctx.scale(f.facing*s.scale,s.scale);ctx.drawImage(s.image,-s.pivot,-s.feet);ctx.restore();
}
export function drawMovement(ctx,sprites,f,x,y){
 const index=movementFrameIndex(f);if(index<0){if(['vorath','gudeco','mari'].includes(f.id)&&f.walk&&!f.attack&&!f.guard&&!f.stun&&!f.reaction&&!f.down){drawSpriteWalk(ctx,sprites,f,x,y);return true;}if(f.id==='andre'&&f.walk){drawAndreSourceFrame(ctx,sprites,andreWalkFrame(f.walkTime||0),x,y,f.facing);return true;}return false;}
 const s=movementFrames(sprites,f.id,index>=6)[index>=6?index-5:index];
 ctx.save();ctx.translate(x,y);ctx.scale(f.facing*s.scale,s.scale);ctx.drawImage(s.image,-s.pivot,-s.feet);ctx.restore();return true;
}
export function normalFrameIndex(kind,time){
 const {windup,duration}=ATTACKS[kind];
 if(time<.025||time>=duration-.025)return -1;
 if(time<windup*.52)return 0;
 if(time<windup)return 1;
 if(time<windup+.065)return 2;
 const recovery=(time-windup-.065)/(duration-.025-windup-.065);
 if(recovery<.3)return 1;
 if(recovery<.7)return 3;
 return 0;
}
export function drawUnarmed(ctx,sprites,id,kind,time,x,y,facing=1,punchArm='right'){
 let frame=normalFrameIndex(kind,time);
 if(id==='andre'){const indices=kind==='punch'?[0,3,4,3]:[0,5,6,5];drawAndreSourceFrame(ctx,sprites,frame<0?0:indices[frame],x,y,facing);return;}
 if(id==='gudeco'&&kind==='kick')frame=roundhouseFrameIndex(time);
 if(frame<0){drawFighter(ctx,id,normalBasePose[id],x,y,facing);return;}
 const s=normalFrames(sprites,id,kind,punchArm)[frame];
 ctx.save();ctx.translate(x,y);ctx.scale(facing*s.scale,s.scale);
 ctx.drawImage(s.image,-s.pivot,-s.feet);ctx.restore();
}
export function roundhouseFrameIndex(time){
 const {windup,duration}=ATTACKS.kick;
 if(time<.025||time>=duration-.025)return -1;
 if(time<windup*.43)return 1;
 if(time<windup)return 2;
 if(time<windup+.065)return 3;
 if(time<windup+.14)return 4;
 return 5;
}
