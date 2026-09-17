// Four painted raster frames; screen compositing makes the black matte invisible.
export const FLOOD_DURATION=1.2;
// Painted ignition roots, measured separately because the flame shapes extend
// beyond equal grid cells. Crop complete frames and scale uniformly.
export const fireJetLayout=[
 [0,0,480,512,30,346],[480,0,512,512,497,346],[992,0,544,512,1008,346],
 [0,512,545,512,30,815],[545,512,520,512,567,815],[1065,512,471,512,1100,815]
];
export function fireJetFrame(age,life){return life<.13?5:life<.25?4:age<.055?0:age<.12?1:2+Math.floor(age*16)%2;}
export function drawFireJet(ctx,atlas,frame,x,y,facing=1,scale=1,opacity=1){
 if(!atlas||opacity<=0)return;
 const [sx,sy,w,h,rootX,rootY]=fireJetLayout[frame];
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalCompositeOperation='source-over';ctx.globalAlpha=opacity;
 ctx.translate(x,y);ctx.scale(facing*scale,scale);
 ctx.drawImage(atlas,sx,sy,w,h,sx-rootX,sy-rootY,w,h);ctx.restore();
}
export function drawFireProjectile(ctx,p,atlas){
 if(p.delay>0||p.life<=0)return;
 const direction=Math.sign(p.vx)||1,frame=fireJetFrame(p.age,p.life);
 const fade=Math.min(1,p.age/.035)*Math.min(1,p.life/.13);
 // The painted fire trails the damaging projectile; the cast has its own
 // short attached ignition so it remains connected to Vorath on impact.
 const trail=Math.min(190,Math.max(0,(p.x-(p.originX??p.x))*direction));
 drawFireJet(ctx,atlas,frame,p.x-direction*trail,p.y,direction,.65,.65*fade);
}
const thesisEffectCache=new WeakMap();
export function drawThesisPaper(ctx,p,atlas){
 if(!atlas||p.delay>0||p.life<=0)return;
 if(!thesisEffectCache.has(atlas)){
  const ranges=[[0,.225],[.21,.455],[.435,.795],[.785,1]];
  thesisEffectCache.set(atlas,ranges.map(([a,b])=>{
   const c=document.createElement('canvas');c.width=Math.ceil((b-a)*atlas.width);c.height=atlas.height;
   const x=c.getContext('2d');x.drawImage(atlas,a*atlas.width,0,(b-a)*atlas.width,atlas.height,0,0,c.width,c.height);
   x.globalCompositeOperation='destination-in';const g=x.createLinearGradient(0,0,c.width,0);
   g.addColorStop(0,'transparent');g.addColorStop(.16,'black');g.addColorStop(.84,'black');g.addColorStop(1,'transparent');x.fillStyle=g;x.fillRect(0,0,c.width,c.height);
   return c;
  }));
 }
 const rise=Math.min(1,p.age/.4),ending=Math.max(0,(p.age-1.5)/.4);
 const frame=ending>0?3:p.age<.22?0:1+Math.floor(p.age*9)%2;
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalCompositeOperation='source-over';
 ctx.globalAlpha=Math.min(1,p.age/.08)*(1-ending);ctx.translate(p.x,p.y-ending*230);
 // Grow from the planted base, then carry the remaining sheets upward.
 const height=330*rise;
 ctx.drawImage(thesisEffectCache.get(atlas)[frame],-120,-height,240,height+5);ctx.restore();
}
export function drawSummonSeal(ctx,f,atlas){
 if(!atlas||!f.attack)return;
 const cats=f.attack.kind==='special2',t=f.attack.time,cw=atlas.width/2,ch=atlas.height/2;
 const frame=Math.min(2,Math.floor(t*6)),size=cats?330:230;
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalCompositeOperation='screen';
 ctx.globalAlpha=.8*Math.min(1,t/.08)*Math.min(1,Math.max(0,(.67-t)/.14));
 ctx.translate(f.x+f.facing*(cats?80:65),f.y-(cats?48:170));
 // The familiar seal uses the same painted star, flattened into a violet
 // ground portal so it reads differently from the travelling red spell.
 if(cats){ctx.filter='hue-rotate(305deg)';ctx.scale(f.facing,.48);}else ctx.scale(f.facing,1);
 ctx.drawImage(atlas,frame%2*cw,Math.floor(frame/2)*ch,cw,ch,-size/2,-size/2,size,size);ctx.restore();
}
export function drawMagicBlast(ctx,p,atlas){
 if(!atlas||p.delay>0||p.life<=0)return;
 const fire=p.type==='fire',frame=p.life<.14?3:p.age<.09?0:1+Math.floor(p.age*12)%2;
 const cw=atlas.width/2,ch=atlas.height/2,w=fire?370:460,h=fire?245:310;
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalCompositeOperation='screen';
 ctx.globalAlpha=(fire?.56:.9)*Math.min(1,p.age/.035)*Math.min(1,p.life/.12);
 ctx.translate(p.x,p.y);ctx.scale(Math.sign(p.vx)||1,1);
 ctx.drawImage(atlas,frame%2*cw,Math.floor(frame/2)*ch,cw,ch,fire?-w*.66:-w*.7,-h/2,w,h);ctx.restore();
}
export function drawSoundBlast(ctx,p,atlas){
 if(!atlas||p.delay>0||p.life<=0)return;
 const frame=p.life<.18?3:p.age<.07?0:[1,2,1,0][Math.floor(p.age*12)%4];
 const cw=atlas.width/2,ch=atlas.height/2;
 // Keep the leading edge at the projectile; painted echoes trail behind it.
 const tip=[.66,.80,.93,.90][frame],width=480,height=320;
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.globalCompositeOperation='screen';
 ctx.globalAlpha=.90*Math.min(1,p.age/.045)*Math.min(1,p.life/.14);
 ctx.translate(p.x,p.y);ctx.scale(Math.sign(p.vx)||1,1);
 ctx.drawImage(atlas,frame%2*cw,Math.floor(frame/2)*ch,cw,ch,-tip*width+25,-height/2,width,height);
 ctx.restore();
}
export function drawFlood(ctx,flood,atlas){
 const t=flood.age;if(t<0||t>=FLOOD_DURATION||!atlas)return;
 const fade=Math.min(1,t/.07)*Math.min(1,(FLOOD_DURATION-t)/.22);
 const frame=t<.22?0:t<.67?1:t<.94?2:3;
 const cw=atlas.width/2,ch=atlas.height/2;
 const front=flood.x+flood.direction*1250*t;
 ctx.save();ctx.imageSmoothingEnabled=false;
 ctx.globalCompositeOperation='screen';ctx.globalAlpha=.78*fade;
 ctx.translate(front,735);ctx.scale(flood.direction,1);
 // 780 x 520: crest towers above Andre, with a broad surge behind it.
 ctx.drawImage(atlas,frame%2*cw,Math.floor(frame/2)*ch,cw,ch,-735,-520,780,520);
 ctx.restore();
}
