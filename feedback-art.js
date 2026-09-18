// Full painted frames, with a wider crop for the outstretched claw.
const feedbackGrid=Array.from({length:6},(_,i)=>[i%3*512,Math.floor(i/3)*512,512,512]);
const feedbackActionRects=[[0,0,512,512],[512,0,512,512],[1024,0,512,512],[0,512,558,512],[558,512,466,512],[1024,512,512,512]];
// Leap extends into the next cell's empty margin; preserve the full paws.
const mariBlackExitRects=[[0,0,512,512],[512,0,570,512],[1082,0,454,512],...feedbackGrid.slice(3)];
const mariWhiteRunRects=[[0,0,512,512],[512,0,506,512],[1018,0,518,512],...feedbackGrid.slice(3)];
const feedbackAtlasCache=new WeakMap();
function feedbackFrames(atlas,rects=feedbackGrid){
 if(!feedbackAtlasCache.has(atlas))feedbackAtlasCache.set(atlas,rects.map(([x,y,w,h])=>{
  const image=document.createElement('canvas');image.width=w;image.height=h;
  const c=image.getContext('2d');c.drawImage(atlas,x,y,w,h,0,0,w,h);
  const p=c.getImageData(0,0,w,h).data;let top=h,bottom=0,left=w,right=0;
  for(let yy=0;yy<h;yy++)for(let xx=0;xx<w;xx++)if(p[(yy*w+xx)*4+3]>160){top=Math.min(top,yy);bottom=Math.max(bottom,yy);left=Math.min(left,xx);right=Math.max(right,xx);}
  return {image,top,bottom,left,right};
 }));return feedbackAtlasCache.get(atlas);
}
export function feedbackCastFrame(t){return t<.09?0:t<.19?1:t<.29?2:t<.43?3:t<.55?4:5;}
export function feedbackCatFrame(p){
 if(p.state==='run')return {sheet:'run',frame:Math.floor((p.runDistance||0)/30)%6};
 if(p.state==='walk')return {sheet:'walk',frame:Math.floor((p.walkDistance||0)/15)%6};
 if(p.state==='summon')return {sheet:'actions',frame:p.stateTime<.20?0:1};
 if(p.state==='claw')return {sheet:'actions',frame:p.stateTime<.18?2:3};
 return {sheet:'actions',frame:p.state==='recover'&&p.stateTime<.18?4:5};
}
export function mariCatFrame(p){
 if(p.state==='jump')return p.stateTime<.08?0:p.vy<170?1:2;
 if(p.state==='run')return (p.white?0:3)+Math.floor((p.runDistance||0)/(p.white?24:30))%(p.white?6:3);
 if(p.state==='claw')return p.stateTime<.12?3:4;
 if(p.state==='recover')return 5;
 return Math.floor((p.walkDistance||0)/20)%3;
}
export function drawMariCat(ctx,p,images){
 if(p.delay>0||p.life<=0)return;
 const exiting=p.state==='jump'||p.state==='run';
 const atlas=images[exiting?(p.white?'mari-cat-white-run':'mari-cat-black-exit'):(p.white?'mari-cat-white':'mari-cat-black')];
 const frame=mariCatFrame(p),s=feedbackFrames(atlas,exiting?(p.white?mariWhiteRunRects:mariBlackExitRects):feedbackGrid)[frame],ground=p.y+20;
 ctx.save();ctx.fillStyle='#04090755';ctx.beginPath();ctx.ellipse(p.x,717,35,5,0,0,Math.PI*2);ctx.fill();ctx.restore();
 feedbackPaint(ctx,s,p.x,ground,Math.sign(p.vx)||1,.26,exiting&&frame===2?(p.white?281:217):275);
}
function feedbackPaint(ctx,s,x,y,direction,scale,pivot,alpha=1){
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.scale(direction*scale,scale);
 ctx.drawImage(s.image,-pivot,-s.bottom);ctx.restore();
}
function feedbackEffect(ctx,atlas,frame,x,y,direction,scale,alpha=1){
 if(!atlas)return;const s=feedbackFrames(atlas)[frame];feedbackPaint(ctx,s,x,y,direction,scale,256,alpha);
}
export function drawGudecoFeedback(ctx,sprites,images,f){
 if(f.id!=='gudeco'||f.attack?.kind!=='special2')return false;
 const frames=feedbackFrames(images['gudeco-feedback-cast']),source=sprites.gudeco[1];
 const scale=source.feet*source.scale/(frames[5].bottom-frames[5].top),frame=feedbackCastFrame(f.attack.time);
 feedbackPaint(ctx,frames[frame],f.x,f.y,f.facing,scale,245);
 const t=f.attack.time;
 if(t>.09&&t<.46)feedbackEffect(ctx,images['gudeco-feedback-effects'],t<.19?0:t<.29?1:2,f.x+f.facing*85,f.y-95,f.facing,.40,Math.min(1,(t-.09)/.05,(.46-t)/.1));
 return true;
}
export function drawFeedbackCat(ctx,p,images){
 if(p.life<=0||p.delay>0)return;
 const {sheet,frame}=feedbackCatFrame(p),s=feedbackFrames(images['gudeco-cat-'+sheet],sheet==='actions'?feedbackActionRects:feedbackGrid)[frame];
 const direction=p.direction||1,ground=p.y+35;
 const fade=p.state==='summon'?Math.min(1,p.stateTime/.14):1;
 ctx.save();ctx.globalAlpha=fade;ctx.fillStyle='#04090755';ctx.beginPath();ctx.ellipse(p.x,ground+2,45,7,0,0,Math.PI*2);ctx.fill();ctx.restore();
 // Same uniform scale across walking and action sheets; no limb deformation.
 const pivots=sheet==='run'?[282,282,282,282,282,282]:sheet==='walk'?[282,282,282,282,282,282]:[300,300,285,272,260,310];
 feedbackPaint(ctx,s,p.x,ground-(sheet==='run'?[0,8,0,0,0,8][frame]:0),direction,.30,pivots[frame],fade);
 if(p.state==='summon')feedbackEffect(ctx,images['gudeco-feedback-effects'],Math.min(2,Math.floor(p.stateTime/.11)),p.x,ground,direction,.40,fade*(1-p.stateTime/.4));
 if(p.state==='claw'&&p.stateTime>=.18)feedbackEffect(ctx,images['gudeco-feedback-effects'],p.stateTime<.29?3:4,p.x+direction*66,ground-28,direction,.25,Math.max(0,(.42-p.stateTime)/.24));

}
