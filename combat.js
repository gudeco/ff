export const ROSTER = {
 gudeco:{name:'Gudeco',moves:['Guitar smash','Sound shockwave','Feedback felid'],color:'#8cc4c4',speed:250,h:295,reach:142,damage:12},
 mari:{name:'Mari',moves:['Hex strike','Pentagram spell','Twin familiars'],color:'#c594be',speed:270,h:292,reach:108,damage:10},
 andre:{name:'André',moves:['Board bash','Sea wave','Thesis thunder'],color:'#91b8d0',speed:225,h:285,reach:156,damage:12},
 vorath:{name:'Vorath',moves:['Rending claws','Fire fart','Acid vomit'],color:'#c4b46c',speed:200,h:370,reach:155,damage:15}
};
export const GROUND=715;
export const JUMP={speed:1040,gravity:1800,forward:380,backward:310,startup:.05,landing:.09};
export function pushBounds(f){const h=hurtHeight(f);return {top:f.y-h*.82,bottom:f.y-(f.airborne?h*.22:0)};}
export const hurtHeight=f=>ROSTER[f.id].h*(f.crouch?.60:1);
export const ATTACKS={
 punch:{cost:0,windup:.14,duration:.32,cooldown:.40,reach:80,damage:7,vertical:80},
 kick:{cost:0,windup:.23,duration:.49,cooldown:.62,reach:120,damage:10,vertical:70},
 melee:{cost:0,windup:.16,duration:.40,cooldown:.53,vertical:155},
 special1:{cost:26,windup:.29,duration:.67,cooldown:.86},
 special2:{cost:42,windup:.29,duration:.67,cooldown:1.25}
};
// Times are custom 60 Hz-style timings for this roster, not SFII frame data.
export const HIT_TIMING={punch:{stun:14/60,stop:6/60,block:10/60},kick:{stun:22/60,stop:9/60,block:16/60},melee:{stun:20/60,stop:8/60,block:14/60}};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export class Match {
 constructor(p1='gudeco',p2='mari',mode='cpu',difficulty='normal',random=Math.random){this.ids=[p1,p2];this.mode=mode;this.difficulty=difficulty;this.random=random;this.wins=[0,0];this.round=1;this.events=[];this.phase='intro';this.nextId=0;this.newRound();}
 newRound(){this.fighters=this.ids.map((id,i)=>({id,x:i?930:350,y:GROUND,vy:0,facing:i?-1:1,hp:100,energy:0,stun:0,invuln:0,cooldown:0,attack:null,nextPunchArm:'right',guard:false,crouch:false,crouchTime:0,landing:0,airborne:false,preJump:0,jumpVX:0,walk:false,poison:0,poisonTick:0,combo:0,comboTime:0}));this.projectiles=[];this.casts=new Map();this.time=90;this.phase='intro';this.phaseTime=2;this.hitstop=0;this.aiTime=0;this.aiInput={};this.events.push({type:'round',round:this.round});}
 emit(type,data={}){this.events.push({type,...data});}
 consumeEvents(){return this.events.splice(0);}
 gainSpecial(i,amount){const f=this.fighters[i],gained=Math.min(amount,100-f.energy);f.energy+=gained;if(gained>0)this.emit('evade',{i,amount:gained,x:f.x,y:f.y-ROSTER[f.id].h-30});}
 startAttack(i,kind){const f=this.fighters[i],e=this.fighters[1-i],spec=ATTACKS[kind],normal=kind==='punch'||kind==='kick';if(!spec||f.hp<=0||f.down||f.stun>0||f.cooldown>0||f.attack||(f.guard&&!(f.crouch&&normal))||f.preJump>0||f.landing>.04||this.phase!=='fight'||f.energy<spec.cost)return false;
 const reach=(spec.reach??ROSTER[f.id].reach)+32;
 f.energy-=spec.cost;f.attack={kind,time:0,fired:false,aerial:f.airborne,posture:f.airborne?'air':f.crouch&&normal?'crouch':'stand',targetX:e.x,targetY:e.y,threat:Math.abs(e.x-f.x)<reach+90&&(e.x-f.x)*f.facing>-15&&Math.abs(e.y-f.y)<450};f.guard=false;
 // Advance only on an accepted punch. Store the arm on this attack so camera
 // facing, hitstop, interrupted recovery and repeated input cannot change it.
 if(f.id==='vorath'&&kind==='punch'){f.attack.punchArm=f.nextPunchArm;f.nextPunchArm=f.nextPunchArm==='right'?'left':'right';}
 // Andre keeps his left hand on the surfboard for every low punch.
 if(f.id==='andre'&&kind==='punch'&&f.attack.posture==='crouch')f.attack.punchArm='right';
 f.cooldown=spec.cooldown;this.emit('attack',{i,id:f.id,kind});return true;}
 newCast(i){const uid=++this.nextId;this.casts.set(uid,{owner:i,threat:false,contact:false});return uid;}
 spawn(i,type,extra={}){const f=this.fighters[i];this.projectiles.push({uid:++this.nextId,owner:i,type,x:f.x+f.facing*65,y:f.y-145,vx:f.facing*400,vy:0,life:2.6,age:0,radius:30,damage:14,delay:0,...extra,cast:extra.cast??this.newCast(i)});}
 fire(i,kind){const f=this.fighters[i],e=this.fighters[1-i],spec=ATTACKS[kind];if(spec.cost===0){
  const aerial=!!f.attack?.aerial,crouching=f.attack?.posture==='crouch',highKick=!aerial&&!crouching&&f.id==='gudeco'&&kind==='kick';
  const highContact=!highKick||((f.y-ROSTER[f.id].h*.82)>e.y-hurtHeight(e)&&(f.y-ROSTER[f.id].h*.82)<e.y);
  const attackY=f.y-(crouching?(kind==='kick'?35:100):40);
  const vertical=aerial||crouching?attackY>e.y-hurtHeight(e)&&attackY<e.y:Math.abs(e.y-f.y)<spec.vertical;
  const inRange=highContact&&(e.x-f.x)*f.facing>(aerial?-65:-20)&&Math.abs(e.x-f.x)<(spec.reach??ROSTER[f.id].reach)+32&&vertical;
  if(inRange)this.hurt(1-i,spec.damage??ROSTER[f.id].damage,i,Math.sign(e.x-f.x)||f.facing,kind);
  else if(f.attack?.threat&&e.stun===0&&(Math.abs(e.x-f.attack.targetX)>5||Math.abs(e.y-f.attack.targetY)>12||e.y<GROUND-30||(highKick&&e.crouch)))this.gainSpecial(1-i,20);
  this.emit('swing',{i,x:f.x+f.facing*(spec.reach??90),y:f.y-(highKick?ROSTER[f.id].h*.82:kind==='kick'?90:160),id:f.id,kind});return;
 }
 const first=kind==='special1',cast=this.newCast(i),shot=(type,extra)=>this.spawn(i,type,{...extra,cast});
 if(f.id==='gudeco'){if(first)shot('sound',{radius:44,damage:15,vx:f.facing*490});else shot('feedbackCat',{x:f.x+f.facing*82,y:GROUND-35,vx:0,direction:f.facing,radius:38,damage:24,life:4.8,state:'summon',stateTime:0,walkDistance:0});}
 if(f.id==='mari'){if(first)shot('pentagram',{radius:44,damage:18,vx:f.facing*325});else for(let n=0;n<2;n++)shot('cat',{x:f.x+f.facing*(35+n*40),y:GROUND-20,delay:n*.28,radius:24,damage:12,vx:f.facing*(240+n*30),white:n===0,life:5.2});}
 if(f.id==='andre'){if(first){shot('wave',{y:GROUND-180,radius:180,damage:20,vx:f.facing*1250,life:1.0});this.emit('flood',{x:f.x+f.facing*65,direction:f.facing});}else shot('paper',{x:e.x,y:GROUND,vx:0,vy:0,radius:90,damage:5,delay:0,life:1.9,nextPulse:.22});}
 if(f.id==='vorath'){if(first)for(let n=0;n<4;n++)shot('fire',{originX:f.x+f.facing*55,x:f.x+f.facing*55,y:f.y-120,vx:f.facing*(330+n*20),radius:42,damage:6,delay:n*.09,life:.72});else shot('acid',{y:f.y-255,vx:f.facing*410,vy:-10,radius:29,damage:15,gravity:240,life:2.8});}
 }
 knockDown(f,direction,defeated=false){f.down={phase:'fall',time:0,vx:direction*210,defeated,facing:-direction};f.reaction=null;f.attack=null;f.preJump=0;f.guard=false;f.crouch=false;f.vy=-390;f.airborne=true;f.y=Math.min(f.y,GROUND-1);f.jumpVX=0;}
 advanceMariCat(p,dt){
  if(p.delay>0){p.delay-=dt;return;}
  p.age+=dt;p.life-=dt;p.stateTime=(p.stateTime||0)+dt;p.state??='walk';
  const target=this.fighters[1-p.owner],cast=this.casts.get(p.cast),direction=Math.sign(p.vx)||1;
  if(p.state==='walk'){
   p.x+=p.vx*dt;p.walkDistance=(p.walkDistance||0)+Math.abs(p.vx*dt);
   const ahead=(target.x-p.x)*direction;
   if(!p.spent&&!target.down&&ahead>=-30&&ahead<65){cast.threat=true;p.state='claw';p.stateTime=0;}
  }else if(p.state==='claw'){
   if(!p.spent&&p.stateTime>=.12){p.spent=true;
    if(!target.down&&Math.abs(p.x-target.x)<100&&p.y+p.radius>target.y-hurtHeight(target)&&p.y-p.radius<target.y){
     if(this.hurt(1-p.owner,p.damage,p.owner,direction,'cat')){cast.contact=true;this.emit('impact',{typeName:'cat',x:p.x+direction*40,y:p.y});}
    }
   }
   if(p.stateTime>=.3){p.state='recover';p.stateTime=0;}
  }else if(p.state==='recover'&&p.stateTime>=.18){p.state='walk';p.stateTime=0;}
 }
 advanceFeedbackCat(p,dt){
  p.age+=dt;p.life-=dt;p.stateTime+=dt;
  const target=this.fighters[1-p.owner],cast=this.casts.get(p.cast);
  const distance=(target.x-p.x)*p.direction;
  if(p.state==='summon'&&p.stateTime>=.34){p.state='walk';p.stateTime=0;}
  if(p.state==='walk'){
   const travel=300*dt;p.x+=p.direction*travel;p.walkDistance+=travel;
   const ahead=(target.x-p.x)*p.direction;
   if(!target.down&&ahead>=-20&&ahead<110){cast.threat=true;p.state='claw';p.stateTime=0;}
  }else if(p.state==='claw'){
   // Wind-up is visible and avoidable. Contact happens only on the swipe,
   // once per summon; the cat remains to land and recover after a hit/miss.
   if(!p.spent&&p.stateTime>=.18){
    p.spent=true;
    if(!target.down&&distance>=-25&&distance<145&&target.y>GROUND-85&&target.y-hurtHeight(target)<GROUND-20){
     if(this.hurt(1-p.owner,p.damage,p.owner,p.direction,'feedbackCat')){cast.contact=true;this.emit('impact',{typeName:'feedbackCat',x:p.x+p.direction*65,y:GROUND-65});}
    }
   }
   if(p.stateTime>=.42){p.state='recover';p.stateTime=0;}
  }else if(p.state==='recover'&&p.stateTime>=.24){p.state='run';p.stateTime=0;p.runDistance=0;p.life=4;}
  else if(p.state==='run'){const travel=620*dt;p.x+=p.direction*travel;p.runDistance+=travel;}
 }
 advanceReaction(f,dt){
  if(f.reaction){f.reaction.time+=dt;if(f.reaction.time>=f.reaction.duration)f.reaction=null;}
  if(!f.down)return;
  const d=f.down;d.time+=dt;
  if(d.phase==='fall'){
   f.x=clamp(f.x+d.vx*dt,70,1210);f.vy+=1800*dt;f.y+=f.vy*dt;
   if(f.y>=GROUND){f.y=GROUND;f.vy=0;f.airborne=false;d.phase='ground';d.time=0;this.emit('land',{x:f.x,y:GROUND,i:this.fighters.indexOf(f)});}
  }else if(d.phase==='ground'&&!d.defeated&&d.time>=.50){d.phase='rise';d.time=0;}
  else if(d.phase==='rise'&&d.time>=.32){f.down=null;f.stun=0;f.landing=0;f.facing=this.fighters[1-this.fighters.indexOf(f)].x>=f.x?1:-1;}
 }
 hurt(index,damage,owner,direction,kind){const f=this.fighters[index];if(f.down||f.hp<=0)return false;const guarded=f.guard&&f.y>=GROUND&&f.facing===-direction;
 const normal=['punch','kick','melee'].includes(kind),attacker=this.fighters[owner];
 const amount=guarded?(normal?0:damage*.18):damage;f.hp=clamp(f.hp-amount,0,100);
 const pushKick=attacker.id==='andre'&&kind==='kick'&&attacker.attack?.posture==='stand';
 const push=pushKick?(guarded?60:108):(guarded?30:27),before=f.x;f.x=clamp(f.x+direction*push,70,1210);
 // A cornered defender cannot move farther; transfer that displacement to
 // the attacker so blocking creates breathing room instead of a corner lock.
 const remainder=push-Math.abs(f.x-before);
 attacker.x=clamp(attacker.x-direction*(remainder+(guarded?18:0)),70,1210);
 const timing=HIT_TIMING[kind]||{stun:20/60,stop:6/60,block:12/60};
 f.stun=guarded?timing.block:timing.stun;f.invuln=0;
 const head=kind==='kick'&&attacker.id==='gudeco'&&!attacker.attack?.aerial;
 const impactY=f.y-(head?ROSTER[f.id].h*.82:Math.min(160,hurtHeight(f)*.55));
 if(!guarded){const continuing=!!f.reaction;f.attack=null;f.preJump=0;f.guard=false;const a=this.fighters[owner];a.comboTime=1.25;a.combo=continuing?a.combo+1:1;
  f.reaction={type:'hit',pose:head?'head':'body',time:0,duration:timing.stun,facing:-direction};
  if(f.hp<=0||f.airborne||f.y<GROUND)this.knockDown(f,direction,f.hp<=0);
  if(kind==='acid'){f.poison=3;f.poisonTick=.75;}
 }
 this.hitstop=guarded?4/60:timing.stop;this.emit(guarded?'block':'hit',{i:index,owner,x:f.x-direction*24,y:impactY,damage:amount,kind,combo:this.fighters[owner].combo});return true;}
 cpu(dt){this.aiTime-=dt;if(this.aiTime>0)return this.aiInput;this.aiTime=this.difficulty==='hard'?.10:this.difficulty==='easy'?.40:.23;const me=this.fighters[1],enemy=this.fighters[0],d=Math.abs(me.x-enemy.x),r=this.random;
 const threat=this.projectiles.some(p=>p.owner===0&&Math.abs(p.x-me.x)<250&&Math.abs(p.y-(me.y-130))<180)||!!(enemy.attack&&!enemy.attack.fired&&d<220);
 const input={move:d>115?Math.sign(enemy.x-me.x):d<90?-Math.sign(enemy.x-me.x):0,guard:false};
 if(threat&&r()<(this.difficulty==='easy'?.20:.65)){input.move=-Math.sign(enemy.x-me.x);if(r()<.55)input.jump=true;else if(r()<.25)input.guard=true;}
 if(threat&&r()<.20)input.jump=true;
 if(!threat){if(d<135&&r()<.55)input.punch=true;else if(d<170&&r()<.55)input.kick=true;else if(d<185&&r()<.55)input.melee=true;else if(me.energy>=26&&r()<.4)input.special1=true;else if(me.energy>=42&&r()<.3)input.special2=true;}
 if(me.y>=GROUND&&(me.x<155||me.x>1125)&&d<230&&r()<.55){input.jump=true;input.move=Math.sign(enemy.x-me.x);input.guard=false;input.punch=false;input.kick=false;input.melee=false;}
 if(me.airborne){input.guard=false;if(me.vy>0&&d<150&&r()<.55)input.kick=true;}
 if(this.difficulty==='easy'&&r()<.4)return this.aiInput={};return this.aiInput=input;}
 step(dt,inputs=[{},{}]){if(this.phase==='over')return;
 if(this.hitstop>0){this.hitstop=Math.max(0,this.hitstop-dt);return;}
 if(this.phase==='intro'||this.phase==='roundEnd'){if(this.phase==='roundEnd')this.fighters.forEach(f=>{this.advanceReaction(f,dt);if(!f.down){if(f.attack){f.attack.time+=dt;if(f.attack.time>=ATTACKS[f.attack.kind].duration)f.attack=null;}if(f.y<GROUND){f.vy+=JUMP.gravity*dt;f.y=Math.min(GROUND,f.y+f.vy*dt);if(f.y===GROUND){f.vy=0;f.airborne=false;}}}});this.phaseTime-=dt;if(this.phaseTime<=0){if(this.phase==='intro'){this.phase='fight';this.emit('fight');}else{if(this.wins.some(w=>w>=2)){this.phase='over';this.emit('over',{winner:this.wins[0]>this.wins[1]?0:1});}else{this.round++;this.newRound();}}}return;}
 this.time=Math.max(0,this.time-dt);
 if(this.mode==='cpu')inputs=[inputs[0],this.cpu(dt)];
 for(let i=0;i<2;i++){const f=this.fighters[i],e=this.fighters[1-i],input=inputs[i]||{};
  const wasDown=!!f.down;this.advanceReaction(f,dt);if(wasDown){f.previousX=f.x;continue;}
  for(const field of ['stun','invuln','cooldown','comboTime'])f[field]=Math.max(0,f[field]-dt);if(f.comboTime===0)f.combo=0;
  f.previousX=f.x;
  if(!f.attack&&!f.airborne&&!f.preJump&&!f.reaction)f.facing=e.x>=f.x?1:-1;
  const move=clamp(input.move||0,-1,1),threat=(!!e.attack&&Math.abs(e.x-f.x)<270)||this.projectiles.some(p=>p.owner!==i&&Math.abs(p.x-f.x)<240);
  f.guard=(!!input.guard||(move*f.facing<-.2&&threat))&&!input.jump&&f.y>=GROUND&&!f.attack&&!f.preJump&&!f.reaction;f.walk=false;
  f.crouch=f.attack?.posture==='crouch'||(f.guard&&!!input.guard);
  f.crouchTime=clamp((f.crouchTime||0)+(f.crouch?dt:-dt),0,.12);
  f.landing=Math.max(0,(f.landing||0)-dt);
  if(f.preJump>0){f.preJump=Math.max(0,f.preJump-dt);if(f.preJump===0){f.vy=-JUMP.speed;f.airborne=true;this.emit('jump',{i});}}
  else if(f.stun===0&&!f.attack&&(!f.guard||!input.guard)&&!f.airborne&&f.landing===0){
   if(input.jump){f.preJump=JUMP.startup;f.jumpVX=Math.sign(move)*(move*f.facing>=0?JUMP.forward:JUMP.backward);}
   else {f.x=clamp(f.x+move*ROSTER[f.id].speed*dt,70,1210);f.walk=Math.abs(move)>.1;}
  }
  if(f.airborne)f.x=clamp(f.x+(f.jumpVX||0)*dt,70,1210);
  for(const kind of ['punch','kick','melee','special1','special2'])if(input[kind]){this.startAttack(i,kind);break;}
  const wasAirborne=f.y<GROUND;
  f.vy+=JUMP.gravity*dt;f.y+=f.vy*dt;if(f.y>=GROUND){if(wasAirborne){if(f.attack?.aerial&&['punch','kick'].includes(f.attack.kind))f.attack=null;f.landing=JUMP.landing;f.jumpVX=0;f.facing=e.x>=f.x?1:-1;}f.y=GROUND;f.vy=0;}
  f.airborne=f.y<GROUND;
  if(f.attack){f.attack.time+=dt;const at=f.attack,spec=ATTACKS[at.kind];if(!at.fired&&at.time>spec.windup){at.fired=true;this.fire(i,at.kind);}if(at.time>spec.duration)f.attack=null;}
  if(f.poison>0){f.poison-=dt;f.poisonTick-=dt;if(f.poisonTick<=0){f.hp=Math.max(0,f.hp-2);f.poisonTick=.75;this.emit('poison',{i,x:f.x,y:f.y-100});}}
 }
 const [a,b]=this.fighters,ab=pushBounds(a),bb=pushBounds(b);
 if(!a.down&&!b.down&&Math.abs(a.x-b.x)<76&&ab.bottom>bb.top&&bb.bottom>ab.top){
  const sign=(a.previousX??a.x)<(b.previousX??b.x)?1:-1,overlap=76-Math.abs(a.x-b.x);
  const aMoving=Math.abs(a.x-(a.previousX??a.x))>.01,bMoving=Math.abs(b.x-(b.previousX??b.x))>.01;
  const share=aMoving&&!bMoving?1:!aMoving&&bMoving?0:.5;
  a.x=clamp(a.x-sign*overlap*share,70,1210);b.x=clamp(b.x+sign*overlap*(1-share),70,1210);
  const left=sign===1?a:b,right=sign===1?b:a;
  if(right.x-left.x<76){if(left.x<=70)right.x=146;else if(right.x>=1210)left.x=1134;}
 }
 // Use resolved ground displacement, so blocked movement does not walk in place.
 for(const f of this.fighters)if(['vorath','gudeco','mari'].includes(f.id)){
  const distance=f.x-(f.previousX??f.x);
  const walking=f.walk&&!f.attack&&!f.reaction&&!f.down&&!f.stun&&!f.airborne&&!f.preJump&&!f.landing&&!f.crouch&&Math.abs(distance)>.01;
  f.walk=!!walking;f.walkDistance=walking?(f.walkDistance||0)+distance*f.facing:0;
 }
 for(const p of this.projectiles){if(p.type==='feedbackCat'){this.advanceFeedbackCat(p,dt);continue;}if(p.type==='cat'){this.advanceMariCat(p,dt);continue;}if(p.delay>0){p.delay-=dt;continue;}p.age+=dt;p.life-=dt;p.x+=p.vx*dt;p.vy+=(p.gravity||0)*dt;p.y+=p.vy*dt;const target=this.fighters[1-p.owner],top=target.y-hurtHeight(target),cast=this.casts.get(p.cast);
  if(p.type==='paper'){
   const nearby=Math.abs(p.x-target.x)<p.radius+24;
   if(nearby&&!target.down)cast.threat=true;
   if(p.age>=p.nextPulse&&p.age<1.5){
    p.nextPulse+=.26;
    const height=220*Math.min(1,p.age/.4);
    if(nearby&&!target.down&&target.y>GROUND-height&&top<GROUND){
     cast.contact=true;
     // Paper cuts do not stun, push, or knock down: jumping remains possible
     // even after the first pulse clips the defender during takeoff.
     const guarded=target.guard&&!target.airborne,damage=guarded?p.damage*.18:p.damage;
     target.hp=clamp(target.hp-damage,0,100);
     this.emit(guarded?'block':'hit',{i:1-p.owner,owner:p.owner,x:target.x,y:target.y-80,damage,kind:'paper',combo:1});
    }
   }
   continue;
  }
  if(!p.spent&&!target.down&&Math.abs(p.x-target.x)<p.radius+70&&p.y+p.radius>GROUND-ROSTER[target.id].h&&p.y-p.radius<GROUND)cast.threat=true;
  if(!p.spent&&!target.down&&p.x>-100&&p.x<1380&&Math.abs(p.x-target.x)<p.radius+32&&p.y+p.radius>top&&p.y-p.radius<target.y){cast.contact=true;if(this.hurt(1-p.owner,p.damage,p.owner,Math.sign(this.fighters[1-p.owner].x-this.fighters[p.owner].x)||1,p.type)){if(p.type==='cat')p.spent=true;else p.life=0;this.emit('impact',{typeName:p.type,x:p.x,y:p.y});}}
  if(p.y>GROUND+30)p.life=0;
 }
 this.projectiles=this.projectiles.filter(p=>p.life>0&&p.x>-150&&p.x<1430);
 const live=new Set(this.projectiles.map(p=>p.cast));for(const [id,cast]of this.casts)if(!live.has(id)){if(cast.threat&&!cast.contact&&!this.fighters[1-cast.owner].down&&this.fighters[1-cast.owner].hp>0)this.gainSpecial(1-cast.owner,30);this.casts.delete(id);}
 if(this.fighters.some(f=>f.hp<=0)||this.time<=0){const diff=a.hp-b.hp;this.winner=Math.abs(diff)<.001?-1:diff>0?0:1;if(this.winner>=0){this.wins[this.winner]++;const loser=this.fighters[1-this.winner];if(loser.down)loser.down.defeated=true;else this.knockDown(loser,Math.sign(loser.x-this.fighters[this.winner].x)||1,true);}for(const f of this.fighters)if(f.hp<=0&&!f.down)this.knockDown(f,-f.facing,true);this.phase='roundEnd';this.phaseTime=2.8;this.projectiles=[];this.casts.clear();this.emit('ko',{winner:this.winner,timeout:this.time<=0});}
 }
}

