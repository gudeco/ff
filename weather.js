// Deterministic pixel rain; separate from the original stage artwork and combat.
export function drawHospitalRain(ctx,time,foreground=false,reduced=false){
 ctx.save();
 const count=reduced?55:foreground?190:310;
 for(let i=0;i<count;i++){
  const seed=i*97+(foreground?41:0),speed=foreground?640:410;
  const y=((seed*31+time*speed)%860)-30;
  const x=((seed*73-time*speed*.19)%1360+1360)%1360-40;
  ctx.fillStyle=foreground?'#b8d6e05c':'#a1bdca38';
  const length=foreground?14+i%10:7+i%6;
  // Stepped streaks belong to the same raster vocabulary as the stage.
  for(let n=0;n<length;n+=4)ctx.fillRect(Math.round(x-n*.2),Math.round(y+n),foreground?2:1,3);
 }
 if(foreground){
  for(let i=0;i<(reduced?14:65);i++){
   const phase=(time*2.8+i*.371)%1;
   if(phase>.45)continue;
   const x=25+(i*179)%1230,y=601+(i*47)%188,r=2+phase*13;
   ctx.fillStyle=`rgba(177,204,211,${(.45-phase)*.45})`;
   ctx.fillRect(Math.round(x-r),y,Math.round(r*2),1);
   ctx.fillRect(Math.round(x-r-1),y-2,2,1);ctx.fillRect(Math.round(x+r),y-2,2,1);
  }
 }
 ctx.restore();
}

export function drawHospitalOvercast(ctx){
 ctx.save();ctx.fillStyle='#263c551c';ctx.fillRect(0,0,1280,800);ctx.restore();
}

