// Crowd clocks advance only while the match is running.
const underpassGather=[[0,.65],[1,.32],[2,.8],[3,.65],[0,.55],[4,1.2]];
const underpassActorIds=['collector','drinker','man','woman'];
// Source rows have unequal margins/sizes. Register feet and scale each row
// uniformly; never stretch the bodies to a nominal square grid.
const underpassPairCells={
 man:[[0,0,444,491,239.5,485],[444,0,443,491,214,486],[887,0,444,491,215,485],[1331,0,443,491,233.5,486],[0,0,570,761,338.5,750],[570,0,450,761,228,750],[1020,0,470,761,228,750],[1490,0,576,761,236,750]],
 woman:[[0,0,384,518,239,513],[384,0,384,518,230,513],[768,0,384,518,232,513],[1152,0,384,518,231.5,513],[0,518,384,506,238.5,492],[384,518,384,506,241,493],[768,518,384,506,229,492],[1152,518,384,506,226.5,492]]
};
// Reuse the approved poses in distinct performances, including restrained looks.
const underpassGestures={
 collector:[[[4,.7]],[[4,.18],[5,.65],[4,.25]],[[4,.2],[6,.55],[4,.15],[6,.35]],[[4,.25],[7,.85]],[[4,.22],[0,.2],[4,.45],[5,.3]],[[6,.4],[4,.55]]],
 drinker:[[[4,.6],[7,.3]],[[4,.35],[6,.55]],[[5,.5],[7,.2],[5,.4]],[[6,.75],[4,.35]],[[4,.2],[0,.15],[4,.45]],[[7,.4],[5,.65]]],
 man:[[[4,.65]],[[4,.18],[5,.7],[4,.2]],[[4,.2],[6,.7],[7,.35]],[[4,.3],[7,.9]],[[4,.2],[0,.16],[4,.5]],[[6,.35],[4,.2],[6,.4]]],
 woman:[[[4,.75]],[[4,.15],[5,.6],[4,.3]],[[6,.45],[4,.15],[6,.6]],[[4,.22],[7,.85]],[[4,.2],[0,.16],[4,.5],[5,.3]],[[7,.4],[6,.7]]]
};
function underpassRandom(c){c.seed=(Math.imul(c.seed,1664525)+1013904223)>>>0;return c.seed/4294967296;}
function underpassLength(sequence){return sequence.reduce((sum,p)=>sum+p[1],0);}
function underpassAmbient(c,id){
 const rest=2+underpassRandom(c)*6,hold=.65+underpassRandom(c)*.9;
 if(id==='drinker')return underpassRandom(c)<.7?[[0,rest],[1,.3],[2,hold],[3,.35],[0,rest*.65]]:[[0,rest],[7,hold],[4,.4],[0,rest*.6]];
 // -1 is a live conversation/listening pose; drinking interrupts it naturally.
 return [[-1,rest+2],[2,.32],[3,hold],[2,.3],[-1,rest]];
}
const underpassStops=[{x:350,y:746},{x:575,y:761},{x:800,y:778}];
const underpassRoute=[0,1,2,1,0];
const underpassDwell=4.17,underpassSpeed=48,underpassTurn=2.4;
// The earlier compact walk uses a shorter stride and slower cart travel.
const underpassStride=80;
function underpassPose(t,sequence){t%=underpassLength(sequence);for(const [frame,length]of sequence){if(t<length)return frame;t-=length;}return 0;}
export function createUnderpassCrowd(seed=Math.floor(Math.random()*4294967296)){
 const c={time:0,routeTime:0,seed:seed>>>0,actors:{},conversation:{speaker:'man',start:0,end:0}};
 for(const id of underpassActorIds){const sequence=id==='collector'?[[0,1]]:underpassAmbient(c,id);c.actors[id]={clock:0,start:0,sequence,end:underpassLength(sequence),reaction:null,cooldown:0,lastGesture:-1};}
 c.conversation.end=4+underpassRandom(c)*5;return c;
}
export function reactUnderpassCrowd(crowd,event){
 if(!['hit','ko'].includes(event.type))return false;
 const knockout=event.type==='ko',strong=(event.combo??0)>=3||(event.damage??0)>=12;
 let reacted=false;
 for(const [i,id]of underpassActorIds.entries()){
  const actor=crowd.actors[id];
  if(!knockout&&(crowd.time<actor.cooldown||underpassRandom(crowd)>[.38,.52,.46,.43][i]+(strong?.22:0)))continue;
  const options=underpassGestures[id].map((_,n)=>n).filter(n=>n!==actor.lastGesture&&(!knockout||n!==0));
  const gesture=options[Math.floor(underpassRandom(crowd)*options.length)],pace=.8+underpassRandom(crowd)*.65;
  const sequence=underpassGestures[id][gesture].map(([f,d])=>[f,d*pace]);
  const start=crowd.time+.07+underpassRandom(crowd)*.48,end=start+underpassLength(sequence);
  actor.reaction={start,end,sequence,gesture};actor.lastGesture=gesture;
  actor.cooldown=end+1.8+underpassRandom(crowd)*4.5;reacted=true;
 }
 return reacted;
}
export function underpassCollectorRoute(time){
 const legs=underpassRoute.slice(0,-1).map((from,i)=>{
  const to=underpassRoute[i+1],a=underpassStops[from],b=underpassStops[to];
  return {from,to,a,b,dir:Math.sign(b.x-a.x),travel:Math.hypot(b.x-a.x,b.y-a.y)/underpassSpeed};
 });
 const cycle=legs.reduce((s,l,i)=>s+underpassDwell+l.travel+((i===1||i===3)?underpassTurn:0),0);
 let t=((time%cycle)+cycle)%cycle;
 for(const [i,leg]of legs.entries()){
  const {a,b,dir,travel}=leg;
  if(t<underpassDwell)return {...a,dir,mode:'gather',frame:underpassPose(t,underpassGather),progress:t/underpassDwell,stop:leg.from};
  t-=underpassDwell;
  if(t<travel){const u=t/travel;return {x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u,dir,mode:'push',frame:Math.floor(t*underpassSpeed/underpassStride*8)%8};}
  t-=travel;
  if(i===1||i===3){
   if(t<underpassTurn){const u=t/underpassTurn;return {...b,dir,mode:'turn',frame:Math.min(11,Math.floor(u*12)),progress:u};}
   t-=underpassTurn;
  }
 }
 return {...underpassStops[0],dir:1,mode:'gather',frame:0,progress:0,stop:0};
}
export function advanceUnderpassCrowd(crowd,dt){
 const step=Math.max(0,dt),old=crowd.time;
 if(!step)return;
 crowd.time+=step;
 for(const id of underpassActorIds){
  const actor=crowd.actors[id],r=actor.reaction;
  const overlap=r?Math.max(0,Math.min(crowd.time,r.end)-Math.max(old,r.start)):0;
  actor.clock+=step-overlap;
  if(id==='collector')crowd.routeTime+=step-overlap;
  else while(actor.clock>=actor.end){actor.start=actor.end;actor.sequence=underpassAmbient(crowd,id);actor.end=actor.start+underpassLength(actor.sequence);}
 }
 while(crowd.time>=crowd.conversation.end){
  const social=crowd.conversation;social.start=social.end;social.speaker=social.speaker==='man'?'woman':'man';social.end+=3.5+underpassRandom(crowd)*6;
 }
}
export function underpassCrowdFrames(crowd){
 const route=underpassCollectorRoute(crowd.routeTime),frames={route,reacting:false,reactions:{}};
 for(const id of underpassActorIds){
  const actor=crowd.actors[id],r=actor.reaction,reacting=!!r&&crowd.time>=r.start&&crowd.time<r.end;
  frames.reactions[id]=reacting;
  if(id==='collector'){frames.reacting=reacting;frames[id]=reacting?underpassPose(crowd.time-r.start,r.sequence):route.mode==='gather'?route.frame:0;continue;}
  let frame=reacting?underpassPose(crowd.time-r.start,r.sequence):underpassPose(actor.clock-actor.start,actor.sequence);
  if(frame===-1)frame=crowd.conversation.speaker===id?underpassPose(crowd.time-crowd.conversation.start,[[1,.7],[0,.45],[1,.5],[0,.8]]):0;
  frames[id]=frame;
 }
 return frames;
}
export function drawUnderpassCollector(ctx,images,r,frame=0,reacting=false){
 ctx.save();ctx.translate(r.x,r.y);ctx.scale(-r.dir,1);
 if(r.mode==='turn'){
  // Turn frames contain both the man and cart. Keep the incoming reflection
  // throughout; the drawn perspectives perform the reversal. A reaction
  // freezes this pose with the route, without teleporting to a standing pose.
  const im=images['underpass-collector-turn-v1'],w=im.width/4,h=im.height/3;
  ctx.drawImage(im,r.frame%4*w,Math.floor(r.frame/4)*h,w,h,-448*.54,-455*.54,w*.54,h*.54);
 }else{
  ctx.drawImage(images['underpass-cart'],-100,-187,200,200);
  if(r.mode==='push'&&!reacting){
   const im=images['underpass-collector-walk-v7'];
   ctx.drawImage(im,r.frame%4*512,Math.floor(r.frame/4)*512,512,512,120-239*.54,-455*.54,512*.54,512*.54);
  }else{
   const im=images['underpass-collector'],w=im.width/4,h=im.height/2,unit=512/w*.47;
   ctx.drawImage(im,frame%4*w,Math.floor(frame/4)*h,w,h,120-256*.47,-500*.47,w*unit,h*unit);
  }
 }
 ctx.restore();
}
export function drawUnderpassCrowd(ctx,images,crowd,dt=0){
 advanceUnderpassCrowd(crowd,dt);const frames=underpassCrowdFrames(crowd),r=frames.route;
 ctx.save();ctx.translate(0,800-1024*1280/1536);ctx.scale(1280/1536,1280/1536);ctx.imageSmoothingEnabled=false;
 const sprite=(key,frame,x,y,scale,anchorX=256,anchorY=500,columns=4)=>{
  const im=images[key],w=im.width/columns,h=im.height/2,unit=512/w;
  ctx.drawImage(im,frame%columns*w,Math.floor(frame/columns)*h,w,h,x-anchorX*scale,y-anchorY*scale,w*unit*scale,h*unit*scale);
 };
 const pairSprite=(id,frame,x,y,scale)=>{
  const [sx,sy,w,h,fx,fy]=underpassPairCells[id][frame];
  const unit=480/(id==='man'?(frame<4?472:731):(frame<4?498:485))*scale;
  const key=id==='woman'?'underpass-woman-dress-v1':frame<4?'underpass-man':'underpass-man-reactions-v2';
  ctx.drawImage(images[key],sx,sy,w,h,x-fx*unit,y-fy*unit,w*unit,h*unit);
 };
 // Draw from the far truck to the middle plaza, then the foreground collector.
 sprite('underpass-drinker',frames.drinker,1380,650,.30);
 pairSprite('man',frames.man,1054,698,.37);
 pairSprite('woman',frames.woman,1172,704,.35);
 drawUnderpassCollector(ctx,images,r,frames.collector,frames.reacting);
 ctx.restore();
}
