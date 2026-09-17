import {images,sprites} from './art.js';
import {damageLayout} from './damage-layout.js';
import {drawMovement} from './normal-attacks.js';

const damageCache=new Map();
// Only exposed faces are taken from the reference edit. All other pixels,
// including hair, neck, poses and equipment, stay from the existing atlas.
export const gudecoFaceMasks=[null,
 {dx:17,points:[[665,59],[678,55],[687,64],[694,77],[687,87],[674,91],[663,81],[660,69]]},
 {dx:0,points:[[358,588],[372,587],[384,598],[376,611],[365,614],[354,604]]},
 {dx:17,points:[[844,510],[859,507],[870,519],[862,534],[850,537],[839,527]]},
 {dx:0,points:[[71,911],[84,910],[96,921],[101,930],[91,941],[78,939],[68,928]]},
 {dx:0,points:[[640,1033],[651,1031],[665,1043],[670,1054],[657,1063],[643,1058],[634,1047]]},
 {dx:0,points:[[87,1353],[102,1354],[113,1366],[110,1378],[96,1383],[83,1375],[80,1364]]},
 {dx:0,points:[[619,1353],[633,1353],[647,1363],[649,1375],[638,1384],[623,1380],[614,1369]]}
];
export function applyGudecoFace(ctx,index,x=0,y=0){
 const mask=gudecoFaceMasks[index];if(!mask)return;
 const source=images['gudeco-damage-face-reference'],base=images['gudeco-damage-v2'];
 ctx.save();ctx.translate(-x,-y);ctx.beginPath();mask.points.forEach(([px,py],i)=>i?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.closePath();ctx.clip();
 ctx.drawImage(source,-mask.dx,0,base.width,base.height);ctx.restore();
}
function damageBounds(image){
 const {width:w,height:h}=image,p=image.getContext('2d').getImageData(0,0,w,h).data;
 let top=h,bottom=0,footSum=0,footCount=0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(p[(y*w+x)*4+3]>160){top=Math.min(top,y);bottom=Math.max(bottom,y);}
 for(let y=Math.max(top,bottom-8);y<=bottom;y++)for(let x=0;x<w;x++)if(p[(y*w+x)*4+3]>160){footSum+=x;footCount++;}
 return {top,bottom,foot:footSum/Math.max(1,footCount)};
}
function damageFrames(id){
 if(damageCache.has(id))return damageCache.get(id);
 const source=sprites[id][id==='gudeco'?1:0],original=damageBounds(source.image),atlas=images[id+'-damage-'+(id==='gudeco'?'v2':'v1')];
 const frames=damageLayout[id].map(([x,y,w,h],i)=>{const image=document.createElement('canvas');image.width=w;image.height=h;const ctx=image.getContext('2d');ctx.drawImage(atlas,x,y,w,h,0,0,w,h);const bounds=damageBounds(image);if(id==='gudeco')applyGudecoFace(ctx,i,x,y);return {image,...bounds};});
 const scale=(source.feet-original.top)*source.scale/(frames[0].bottom-frames[0].top);
 const footOffset=(original.foot-source.pivot)*source.scale;
 frames.forEach((f,i)=>{f.scale=scale;f.pivot=i<4?f.foot-footOffset/scale:f.image.width/2;f.feet=f.bottom;});
 damageCache.set(id,frames);return frames;
}
export function damageFrameIndex(f){
 if(f.down){const d=f.down;if(d.phase==='fall')return d.time<.11?1:f.vy<60?4:5;if(d.phase==='ground')return d.time<.12?6:7;return 6;}
 if(f.reaction)return f.reaction.time/f.reaction.duration<.68?(f.reaction.pose==='head'?1:2):3;
 return -1;
}
export function drawDamage(ctx,f){
 const index=damageFrameIndex(f);if(index<0)return false;
 const facing=f.down?.facing??f.reaction.facing;
 // Reuse the existing low crouch/standing transition for nonfatal wake-up.
 if(f.down?.phase==='rise')return drawMovement(ctx,sprites,{...f,facing,airborne:false,preJump:0,crouch:true,crouchTime:f.down.time<.17?.12:.03},f.x,f.y);
 const s=damageFrames(f.id)[index];ctx.save();ctx.translate(f.x,f.y);ctx.scale(facing*s.scale,s.scale);ctx.drawImage(s.image,-s.pivot,-s.feet);ctx.restore();return true;
}


