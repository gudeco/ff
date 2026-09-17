import {SoundEngine,SAMPLE_FILES} from './audio-engine.js';
import {drawHospitalRain,drawHospitalOvercast} from './weather.js';
import {drawDamage} from './damage-art.js';
import {Match,ROSTER,GROUND,ATTACKS} from './combat.js';
import {loadArt,images,sprites,cats,effects,drawFighter,drawPortrait,drawStageBackground} from './art.js';
import {drawVorathClaw,drawVorathFireCast,drawUnarmed,drawMovement,drawAndreWaveCast,drawContextAttack,drawWeaponAttack} from './normal-attacks.js';
import {drawFireProjectile,drawFlood,FLOOD_DURATION,drawSoundBlast,drawMagicBlast,drawSummonSeal,drawThesisPaper} from './wave-art.js';
import {drawGudecoFeedback,drawFeedbackCat,drawMariCat} from './feedback-art.js';
let floods=[];
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const canvas=$('#game'),ctx=canvas.getContext('2d');
const fxCanvas=document.createElement('canvas');fxCanvas.width=640;fxCanvas.height=400;const fx=fxCanvas.getContext('2d');
let chosen='gudeco',stage='plaza',mode='cpu',match=null,paused=false,last=0,accumulator=0,clock=0,shake=0,flash=0,banner='',bannerTime=0,particles=[],floaters=[],soundOn=true,ready=false;
const keys=new Set(),taps=new Set(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const keySets=[{left:'KeyA',right:'KeyD',jump:'KeyW',guard:'KeyS',punch:'KeyJ',kick:'KeyU',melee:'KeyI',special1:'KeyK',special2:'KeyL'},{left:'ArrowLeft',right:'ArrowRight',jump:'ArrowUp',guard:'ArrowDown',punch:'Digit1',kick:'Digit2',melee:'Digit3',special1:'Digit4',special2:'Digit5'}];
function readInput(i){const k=keySets[i],held=key=>keys.has(key)||taps.has(key),input={move:(keys.has(k.right)?1:0)-(keys.has(k.left)?1:0),jump:held(k.jump)||(i===0&&held('Space')),guard:keys.has(k.guard)};
 ['punch','kick','melee','special1','special2'].forEach((kind,n)=>input[kind]=held(k[kind])||(i===1&&held('Numpad'+(n+1))));
 const pads=[...(navigator.getGamepads?.()||[])].filter(Boolean),p=pads[i];if(p){const down=n=>p.buttons[n]?.pressed;const ax=p.axes[0]||0;if(Math.abs(ax)>.2)input.move=ax;else if(down(14)||down(15))input.move=(down(15)?1:0)-(down(14)?1:0);input.jump ||= down(0)||down(12);input.guard ||= down(4)||down(13);input.punch ||=down(2);input.kick ||=down(1);input.melee ||=down(3);input.special1 ||=down(5);input.special2 ||=down(7);}return input;}
const soundEngine=new SoundEngine();
function sound(event){const f=match?.fighters[event.i??event.owner??0];soundEngine.effect(event,f?.id||chosen,f?(f.x/1280-.5)*.8:0);}
function syncAudioPause(){soundEngine.setPaused(paused||document.hidden).catch(console.warn);}
function burst(x,y,color,count=20){for(let n=0;n<count;n++)particles.push({x,y,vx:(Math.random()-.5)*420,vy:(Math.random()-.7)*380,life:.2+Math.random()*.45,max:.65,color,size:2+Math.random()*5});}
function events(){for(const e of match.consumeEvents()){if(e.type==='flood')floods.push({...e,age:0});if(e.type==='round'||e.type==='ko')floods=[];sound(e);if(e.type==='hit'||e.type==='block'){shake=e.type==='hit'?(reduced?0:6):2;flash=e.type==='hit'?.06:0;burst(e.x,e.y,e.type==='hit'?'#e0bc7c':'#a8cbd3',e.type==='hit'?25:12);if(e.combo>1&&e.type==='hit')floaters.push({text:e.combo+' HITS',x:e.x,y:e.y-110,life:1,color:'#f0c578'});}if(e.type==='land'){burst(e.x,e.y,'#9d947d',15);if(!reduced)shake=4;}if(e.type==='poison')burst(e.x,e.y,'#a6b869',5);if(e.type==='evade')floaters.push({text:'SPECIAL +'+e.amount,x:e.x,y:e.y,life:1,color:'#b7d5c2'});if(e.type==='empty')floaters.push({text:'LOW ENERGY',x:match.fighters[e.i].x,y:match.fighters[e.i].y-330,life:.6,color:'#bba989'});if(e.type==='fight'){banner='FIGHT';bannerTime=.8;}if(e.type==='round'){banner='ROUND '+e.round;bannerTime=1.8;}if(e.type==='ko'){banner=e.winner<0?'DRAW':e.timeout?'TIME UP':'K.O.';bannerTime=2.6;}if(e.type==='over')showOverlay(false);}}
function start(){if(!ready)return;floods=[];$('#song-next').hidden=true;$('#song-current').hidden=true;soundEngine.setTheme(stage);match=new Match(chosen,$('#opponent').value,mode,$('#difficulty').value);paused=false;accumulator=0;particles=[];floaters=[];keys.clear();taps.clear();$('#selection').hidden=true;$('#arena').hidden=false;$('#overlay').hidden=true;$('#stage-name').textContent=({plaza:'SQUARE',street:'STREET',hospital:'HOSPITAL'})[stage];syncAudioPause();events();canvas.focus();}
function showOverlay(isPause){$('#overlay').hidden=false;$('#overlay-title').textContent=isPause?'Paused':ROSTER[match.ids[match.wins[0]>match.wins[1]?0:1]].name+' wins.';$('#overlay-text').textContent=isPause?'':match.wins.join(' — ');$('#resume').hidden=!isPause;}
function pause(){if(!match||match.phase==='over'||$('#arena').hidden)return;paused=!paused;keys.clear();taps.clear();if(paused)showOverlay(true);else $('#overlay').hidden=true;syncAudioPause();}
function back(){match=null;paused=false;soundEngine.setTheme('title');$('#song-next').hidden=false;updateSongPreview();syncAudioPause();keys.clear();taps.clear();$('#arena').hidden=true;$('#selection').hidden=false;$('#overlay').hidden=true;}
$('#fight').onclick=start;$('#back').onclick=back;$('#select-again').onclick=back;$('#pause').onclick=pause;$('#resume').onclick=pause;$('#rematch').onclick=start;
$('.close').onclick=()=>$('#help').close();
let audioStarting=false,entering=false;
$('#entry-gate').onclick=async()=>{
 if(entering)return;entering=true;
 try{
  // Resume is requested synchronously in this trusted user gesture.
  // Do not keep a fresh visitor behind the gate while large artwork loads.
  // The match button remains disabled until the selection finishes loading.
  try{await soundEngine.setEnabled(true)}catch(error){soundOn=false;console.warn('Audio could not start',error);}
  $('#entry-gate').classList.add('entering');
  document.body.classList.remove('awaiting-entry');
  document.querySelector('header').inert=false;document.querySelector('main').inert=false;
  $('#entry-gate').hidden=true;$('.fighter-card.active').focus({preventScroll:true});updateSoundButton();
 }catch(error){entering=false;$('#entry-gate').classList.remove('entering');$('#entry-gate .entry-label').textContent='Click';console.warn(error);}
};
function updateSoundButton(){const b=$('#sound');b.textContent='SOUND '+(soundOn?'ON':'OFF');b.setAttribute('aria-pressed',String(soundOn));const n=SAMPLE_FILES.filter(n=>soundEngine.samples?.has(n)).length;b.title=n?'Sample audio: '+n+'/'+SAMPLE_FILES.length+' loaded'+(soundEngine.sampleErrors?.length?' (some synthesis fallback)':''):'Sound starts on your first click or keypress';b.dataset.samples=String(n);}
async function activateSound(){if(!soundOn||audioStarting)return;audioStarting=true;try{const starting=soundEngine.setEnabled(true);await starting;}catch(e){console.warn('Audio could not start',e);}finally{audioStarting=false;updateSoundButton();}}
function unlockSound(e){if(document.body.classList.contains('awaiting-entry'))return;if(e.target.closest?.('#sound')||!soundOn||paused||document.hidden)return;if(soundEngine.ctx?.state==='suspended')void soundEngine.ctx.resume().catch(console.warn);if(!soundEngine.enabled||soundEngine.ctx?.state!=='running')void activateSound();}
window.addEventListener('pointerdown',unlockSound,{capture:true});
window.addEventListener('click',unlockSound,{capture:true});
window.addEventListener('keydown',unlockSound,{capture:true});
const previewSongs=['title','plaza','street','hospital'],previewNames=['Main','Square','Street','Hospital'];
function updateSongPreview(){const i=previewSongs.indexOf(soundEngine.theme);$('#song-current').textContent=previewNames[i];$('#song-next').title='Next song: '+previewNames[(i+1)%4];$('#song-next').setAttribute('aria-label','Next song; currently '+previewNames[i]);}
$('#song-next').onclick=async()=>{if(match)return;soundEngine.setTheme(previewSongs[(previewSongs.indexOf(soundEngine.theme)+1)%4]);$('#song-current').hidden=false;updateSongPreview();if(!soundOn){soundOn=true;updateSoundButton();}await activateSound();};
$('#sound').onclick=async()=>{soundOn=!soundOn;updateSoundButton();if(soundOn)await activateSound();else await soundEngine.setEnabled(false);};
updateSoundButton();
for(const id of ['music-volume','effects-volume'])$('#'+id).oninput=()=>soundEngine.setVolumes($('#music-volume').value/100,$('#effects-volume').value/100);
document.addEventListener('visibilitychange',syncAudioPause);
window.addEventListener('pagehide',()=>soundEngine.dispose());
$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{$('#fullscreen').textContent='FULLSCREEN UNAVAILABLE';}};
$$('.stage').forEach(b=>b.onclick=()=>{stage=b.dataset.stage;$$('.stage').forEach(x=>x.classList.toggle('active',x===b));});
$$('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;$$('[data-mode]').forEach(x=>x.classList.toggle('active',x===b));$('#difficulty').hidden=mode==='local';});
function select(id){chosen=id;$$('.fighter-card').forEach(b=>{b.classList.toggle('active',b.dataset.id===id);b.setAttribute('aria-pressed',b.dataset.id===id);b.querySelector('.mark').textContent=b.dataset.id===id?'◆':'';});const f=ROSTER[id];$('#fighter-name').textContent=f.name;$('#moves').innerHTML=['Punch','Kick',...f.moves].map((m,i)=>'<span><kbd>'+['J','U','I','K','L'][i]+'</kbd>'+m+'</span>').join('');}
for(const [i,[id,f]]of Object.entries(ROSTER).entries()){const b=document.createElement('button');b.className='fighter-card';b.dataset.id=id;b.setAttribute('aria-label','Select '+f.name);b.innerHTML='<span class="number">0'+(i+1)+'</span><canvas aria-hidden="true"></canvas><span class="name">'+f.name+'</span><span class="mark"></span>';b.onclick=()=>select(id);$('#roster').append(b);const o=document.createElement('option');o.value=id;o.textContent=f.name;$('#opponent').append(o);}$('#opponent').value='mari';select(chosen);
window.addEventListener('keydown',e=>{if($('#help').open||/SELECT|INPUT/.test(document.activeElement.tagName))return;if(match){if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code))e.preventDefault();if(e.code==='Escape'&&!e.repeat)pause();if(e.code==='KeyR'&&match.phase==='over')start();keys.add(e.code);if(!e.repeat)taps.add(e.code);}});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();taps.clear();if(match&&!paused&&match.phase!=='over')pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden&&match&&!paused&&match.phase!=='over')pause();});
$$('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(b.dataset.key);taps.add(b.dataset.key);};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>keys.delete(b.dataset.key);});
function text(str,x,y,size=16,color='#e4d9bf',align='left',font='Arial'){ctx.font=`${size}px ${font}`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(str,x,y);}
function diamond(x,y,filled){ctx.beginPath();ctx.moveTo(x,y-5);ctx.lineTo(x+5,y);ctx.lineTo(x,y+5);ctx.lineTo(x-5,y);ctx.closePath();ctx.fillStyle=filled?'#dcbd77':'#3f4840';ctx.fill();ctx.strokeStyle='#af9b66';ctx.stroke();}
function hud(){const g=ctx.createLinearGradient(0,0,0,190);g.addColorStop(0,'#07100ff2');g.addColorStop(1,'#07100f00');ctx.fillStyle=g;ctx.fillRect(0,0,1280,190);
 match.fighters.forEach((f,i)=>{const left=i===0,x=left?48:762,w=470;ctx.fillStyle='#17221cd9';ctx.fillRect(x,62,w,20);ctx.fillStyle=f.hp<25?'#b06550':'#cbb881';const width=w*f.hp/100;ctx.fillRect(left?x:x+w-width,62,width,20);ctx.strokeStyle='#c2b27e';ctx.lineWidth=1;ctx.strokeRect(x-.5,61.5,w+1,21);text(ROSTER[f.id].name.toUpperCase(),left?x:x+w,47,22,'#ece0c5',left?'left':'right','Georgia');text(left?'PLAYER 1':mode==='cpu'?'CPU / '+$('#difficulty').value.toUpperCase():'PLAYER 2',left?x+w:x,45,9,'#b3b59a',left?'right':'left');ctx.fillStyle='#1a2b29';ctx.fillRect(x,91,w,8);ctx.fillStyle=ROSTER[f.id].color;ctx.fillRect(left?x:x+w-w*f.energy/100,91,w*f.energy/100,8);for(let n=0;n<2;n++)diamond(left?x+7+n*20:x+w-7-n*20,112,n<match.wins[i]);text('SPECIAL '+Math.floor(f.energy)+' / 100',left?x+w:x,115,9,'#d8d5b8',left?'right':'left');});
 text(String(Math.ceil(match.time)).padStart(2,'0'),640,83,57,'#e7d7b0','center','Georgia');text('ROUND '+match.round,640,111,10,'#b7b79a','center');
 const bottom=ctx.createLinearGradient(0,720,0,800);bottom.addColorStop(0,'#0c161100');bottom.addColorStop(1,'#07100fed');ctx.fillStyle=bottom;ctx.fillRect(0,720,1280,80);
 match.fighters.forEach((f,i)=>{const x=i===0?45:765;['Punch','Kick',...ROSTER[f.id].moves].forEach((move,n)=>{const px=x+n*96,enabled=n<3||f.energy>=(n===3?26:42);ctx.strokeStyle=enabled?'#8d9172':'#414b3e';ctx.strokeRect(px,746,20,20);text((i===0?['J','U','I','K','L']:['1','2','3','4','5'])[n],px+10,760,10,enabled?'#e8d5a7':'#697163','center');text(move,px,782,9,enabled?'#d4cfb1':'#697163');});});
}
function pentagram(x,y,r,spin,color){fx.save();fx.translate(x,y);fx.rotate(spin);fx.strokeStyle=color;fx.lineWidth=1.5;fx.beginPath();fx.arc(0,0,r,0,Math.PI*2);fx.stroke();fx.beginPath();for(let i=0;i<=5;i++){const a=-Math.PI/2+i*4*Math.PI/5;const px=Math.cos(a)*r*.84,py=Math.sin(a)*r*.84;if(!i)fx.moveTo(px,py);else fx.lineTo(px,py);}fx.stroke();fx.restore();}
function projectile(p){if(p.type==='cat'){drawMariCat(ctx,p,images);return;}if(p.type==='feedbackCat'){drawFeedbackCat(ctx,p,images);return;}if(p.type==='fire'){drawFireProjectile(ctx,p,images['vorath-fire-jet']);return;}if(p.type==='paper'){drawThesisPaper(ctx,p,images['andre-thesis-storm']);return;}if(p.type==='pentagram'){drawMagicBlast(ctx,p,images['mari-pentagram-blast']);return;}if(p.type==='sound'){drawSoundBlast(ctx,p,images['gudeco-sonic-blast']);return;}if(p.type==='wave')return;if(p.delay>0){if(p.type==='paper'){fx.strokeStyle='#c8d4c144';fx.beginPath();fx.moveTo(p.x/2,330);fx.lineTo(p.x/2,350);fx.stroke();}return;}const x=p.x/2,y=p.y/2,t=p.age,dir=Math.sign(p.vx)||1;fx.save();fx.translate(x,y);fx.scale(dir,1);
 if(p.type==='cat'){const c=cats[p.white?0:1];const hop=Math.abs(Math.sin(t*19))*6,h=54*c.height/c.width;fx.drawImage(c,-26,10-h-hop,54,h);}
 if(p.type==='wave'){const w=effects.wave;const size=74;fx.drawImage(w,-size/2,-size/2,size,size*w.height/w.width);for(let n=0;n<12;n++){fx.fillStyle='#93bcbc88';fx.fillRect(-45+n*5,28+Math.sin(n+t*10)*3,3,2);}}
 if(p.type==='paper'){fx.rotate(t*4+p.uid);fx.fillStyle='#d6cfaa';fx.fillRect(-8,-11,16,22);fx.fillStyle='#7a8069';for(let n=0;n<5;n++)fx.fillRect(-5,-7+n*3,9,1);fx.strokeStyle='#8c937944';fx.strokeRect(-9,-12,18,24);}
 if(p.type==='acid'){for(let n=0;n<16;n++){fx.fillStyle=['#6c823a','#8b9f4b','#bac276','#475a33'][n%4];fx.fillRect(Math.sin(n*7+t*5)*17,Math.cos(n*3+t*4)*12,5+n%4,4+n%5);}for(let n=0;n<5;n++){fx.fillStyle='#7c984b88';fx.fillRect(-25-n*6,Math.sin(n+t*10)*9,4,4);}}
 fx.restore();}
function fighter(f,i){const bob=f.walk?Math.sin(clock*17)*2:Math.sin(clock*2.5+i)*1.2;let pose=0,rot=0;const airborne=f.y<GROUND-8;
 if(f.id==='gudeco'){pose=f.attack?(f.attack.kind==='melee'?3:2):f.guard?2:1;}
 if(f.id==='mari'){pose=airborne||f.attack?.kind==='special2'?1:0;if(f.attack?.kind==='melee')rot=f.facing*.07;}
 if(f.id==='andre'){pose=f.walk||f.attack?1:0;rot=0;}
 if(f.id==='vorath'){pose=f.attack?2:f.walk?1:0;rot=f.attack?.kind==='special1'?-f.facing*.1:0;}
 if(f.stun>0&&!f.guard)rot=-f.facing*.08;
 ctx.fillStyle='#04090766';ctx.beginPath();ctx.ellipse(f.x,GROUND+2,ROSTER[f.id].h*.24,13,0,0,Math.PI*2);ctx.fill();
 const mirror=f.id==='vorath'&&f.attack?.kind==='special1'?-f.facing:f.facing;
 const unarmed=f.attack&&(f.attack.kind==='punch'||f.attack.kind==='kick');
 if(drawDamage(ctx,f)){} else if(drawGudecoFeedback(ctx,sprites,images,f)){} else if(drawVorathClaw(ctx,sprites,f)){} else if(drawVorathFireCast(ctx,sprites,f)){} else if(drawWeaponAttack(ctx,sprites,f)){} else if(drawContextAttack(ctx,sprites,f,f.x,f.y)){} else if(unarmed)drawUnarmed(ctx,sprites,f.id,f.attack.kind,f.attack.time,f.x,f.y+bob,f.facing,f.attack.punchArm);
 else if(f.id==='andre'&&f.attack?.kind==='special1')drawAndreWaveCast(ctx,sprites,f.attack.time,f.x,f.y,f.facing);
 else if(f.attack||f.stun>0||!drawMovement(ctx,sprites,f,f.x,f.y))drawFighter(ctx,f.id,pose,f.x,f.y+bob,mirror,rot);
 if(f.guard){ctx.strokeStyle='#c2d4be88';ctx.lineWidth=2;ctx.beginPath();ctx.arc(f.x+f.facing*18,f.y-145,80,f.facing===1?-1.2:1.9,f.facing===1?1.2:4.4);ctx.stroke();text('GUARD',f.x,f.y-ROSTER[f.id].h-18,9,'#ccdcc5','center');}
 if(f.id!=='vorath'&&f.attack?.kind==='melee'){const p=f.attack.time;if(p>.1&&p<.31){fx.strokeStyle=f.id==='mari'?'#b9798d':'#c8be9988';fx.lineWidth=2;fx.beginPath();const x=(f.x+f.facing*70)/2,y=(f.y-170)/2;fx.arc(x,y,40,-1.1,1.1);fx.stroke();}}
 if(f.id==='mari'&&f.attack&&!unarmed)drawSummonSeal(ctx,f,images['mari-pentagram-blast']);
 if(f.poison>0){for(let n=0;n<6;n++){fx.fillStyle='#a0b26099';fx.fillRect(f.x/2+Math.sin(n*8+clock*2)*28,f.y/2-((clock*50+n*23)%120),2,3);}}
}
function render(dt){clock+=dt;if(match)for(const f of match.fighters)f.walkTime=f.walk?(f.walkTime||0)+dt:0;ctx.clearRect(0,0,1280,800);ctx.save();if(shake>0){ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);shake=Math.max(0,shake-dt*25);}ctx.imageSmoothingEnabled=false;
 drawStageBackground(ctx,stage);
 ctx.fillStyle='#0818100d';ctx.fillRect(0,0,1280,800);
 // Quiet dust and leaves keep the original environment alive without repainting it.
 if(stage==='hospital')drawHospitalRain(ctx,clock,false,reduced);
 else for(let i=0;i<35;i++){ctx.fillStyle=i%3?'#cdc99533':'#98ad9b33';ctx.fillRect((i*113+clock*(4+i%5))%1280,150+(i*67)%500+Math.sin(clock+i)*8,i%3+1,2);}
 fx.clearRect(0,0,640,400);
 match.fighters.forEach(fighter);for(const flood of floods){flood.age+=dt;drawFlood(ctx,flood,images['andre-tsunami']);}floods=floods.filter(f=>f.age<FLOOD_DURATION);match.projectiles.forEach(projectile);
 for(const p of particles){if(!paused){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=480*dt;p.life-=dt;}fx.globalAlpha=Math.max(0,p.life/p.max);fx.fillStyle=p.color;fx.fillRect(p.x/2,p.y/2,p.size/2,p.size/2);}fx.globalAlpha=1;particles=particles.filter(p=>p.life>0);
 ctx.drawImage(fxCanvas,0,0,1280,800);
 if(stage==='hospital'){drawHospitalOvercast(ctx);drawHospitalRain(ctx,clock,true,reduced);}
 if(flash>0&&!reduced){ctx.fillStyle='#dfc58c12';ctx.fillRect(0,0,1280,800);flash-=dt;}
 ctx.restore();hud();
 for(const f of floaters){if(!paused){f.life-=dt;f.y-=dt*30;}ctx.globalAlpha=Math.max(0,Math.min(1,f.life*2));text(f.text,f.x,f.y,18,f.color,'center','Georgia');}ctx.globalAlpha=1;floaters=floaters.filter(f=>f.life>0);
 if(bannerTime>0){if(!paused)bannerTime-=dt;ctx.fillStyle='#0c161aad';ctx.fillRect(0,300,1280,126);ctx.strokeStyle='#c0a76b55';ctx.beginPath();ctx.moveTo(0,300);ctx.lineTo(1280,300);ctx.moveTo(0,426);ctx.lineTo(1280,426);ctx.stroke();text(banner,640,385,66,'#e8d4a3','center','Georgia');if(match.phase==='roundEnd'&&match.winner>=0)text(ROSTER[match.ids[match.winner]].name.toUpperCase()+' TAKES THE ROUND',640,410,10,'#c8c6ac','center');}
}
function loop(time){const dt=Math.min(.05,(time-last)/1000||0);last=time;if(match){if(!paused){accumulator+=dt;while(accumulator>=1/120){match.step(1/120,[readInput(0),readInput(1)]);taps.clear();accumulator-=1/120;}events();}render(paused?0:dt);}requestAnimationFrame(loop);}

// Synth title needs no recording download; entry click starts its audio clock.
try{await loadArt(()=>{$$('.fighter-card').forEach(b=>drawPortrait(b.querySelector('canvas'),b.dataset.id));});ready=true;$('#fight').disabled=false;$('#fight').textContent='START MATCH';requestAnimationFrame(loop);}catch(error){$('#fight').textContent='ART FAILED TO LOAD — RELOAD';console.error(error);}
// Read-only diagnostics for browser verification and future integration.
window.lastLight={get state(){return match},get ready(){return ready},get sprites(){return sprites}};



