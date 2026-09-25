// Oscillators and generated noise only: no recorded instruments or audio files.
export function synthNote(engine,event,time){
 if(event[7]?.ornamentDelay){
  const spec=event[7].ornamentDelay,c=engine.ctx,end=time+spec.end-event[0];
  engine.ornamentBuses??=new Map();const key=Math.round(end*100000);
  let bus=engine.ornamentBuses.get(key);
  if(!bus){
   const input=c.createGain(),out=c.createGain(),nodes=[input,out];
   out.gain.setValueAtTime(1,time);out.gain.setValueAtTime(1,Math.max(time,end-.10));out.gain.linearRampToValueAtTime(0,end);
   input.connect(out);out.connect(engine.musicInput||engine.music);
   for(let tap=1;tap<=8;tap++){
    const delay=c.createDelay(1),gain=c.createGain();delay.delayTime.value=spec.step*tap;gain.gain.value=.58*.86**(tap-1);
    input.connect(delay);delay.connect(gain);gain.connect(out);nodes.push(delay,gain);
   }
   bus={ctx:c,music:input,musicInput:input,voices:engine.voices};engine.ornamentBuses.set(key,bus);
   const timer=c.createOscillator(),mute=c.createGain();mute.gain.value=0;timer.connect(mute);mute.connect(out);
   const cleanup={music:true,synth:true,stop:at=>{out.gain.cancelScheduledValues(at);out.gain.setTargetAtTime(0,at,.006);timer.stop(at+.04);}};
   engine.voices.add(cleanup);timer.onended=()=>{for(const node of [...nodes,timer,mute])node.disconnect();bus.thanathoaReverb?.disconnect();engine.ornamentBuses.delete(key);engine.voices.delete(cleanup);};timer.start(time);timer.stop(end+.01);
  }
  return synthNote(bus,[...event.slice(0,7),{...event[7],ornamentDelay:undefined}],time);
 }
 if(event[7]?.mixGain!==undefined){event=[...event];event[4]*=event[7].mixGain;}
 const [offset,kind,pitch,length,velocity,pan,lane]=event,c=engine.ctx;
 const cyber=kind.startsWith('cyber');
 if(kind==='mesotonya')return synthMesotonya(engine,event,time);
 if(kind==='acidbass')return synthAcidBass(engine,event,time);
 if(kind==='thanathoa'||kind==='vstdefault')return synthThanathoa(engine,event,time);
 if(kind==='blattella')return synthBlattella(engine,event,time);
 const squareDouble=event[9]==='square-doubled';
 const underpassCrash=lane===1701&&kind==='hat'&&event[7]?.articulation==='crash-hat';
 const underpassLowTom=lane===1701&&kind==='tom'&&event[7]?.articulation==='low-tom';
 const rhodes=kind==='organ'&&((lane===1707&&event[7]?.rhodesiaSwell)||(lane>=1400&&lane<=1407)||lane===1456||lane===1486||lane===1458||lane===1481||lane===1482||lane===1487||lane===1488||lane===1489||lane===1491||lane===1498||lane===1510);
 // Let every scheduled music note finish, including clusters carried across parts.
 const drum=['kick','snare','hat','air'].includes(kind),duration=Math.max(.015,Math.min(length||.2,cyber?4:underpassCrash?2.2:underpassLowTom?.6:kind==='jazzsax'?3:kind==='jazzbass'?1.4:kind==='shepard'?8:kind==='lahopterix'?(lane===1596?16:8):kind==='brass'?1.5:kind==='harp'?.8:kind==='bell'?.65:kind==='ride'?.65:kind==='lead'?8:kind==='polysynth'?6:kind==='cymbal'?.7:kind==='tom'?.28:kind==='organ'?(lane===1458||lane===1482||lane===1488||lane===1491||((lane===1456||lane===1486)&&event[7]===1)?12:5.2):kind==='pad'?1.5:kind==='metal'?.65:kind==='bassline'?(lane===1497?2:lane===1507?1.2:lane===1201?1.8:lane===1000?1.2:.42):kind==='bass'?.28:kind==='kick'?.32:.18));
 const gain=c.createGain(),filter=c.createBiquadFilter(),panner=c.createStereoPanner();
 // Noise can begin one sample before a fractional-time envelope event. Start
 // Underpass voices at silence so that first sample cannot escape at unity.
 if(lane>=1700&&lane<=1705)gain.gain.value=0;
 const freq=Math.max(28,Math.min(1000,(kind==='kick'?55:kind==='bassline'?55:kind==='bass'?65:kind==='metal'?170:110)*2**((Array.isArray(pitch)?pitch[0]:pitch)/12)));
 filter.type=kind==='snare'||kind==='hat'||kind==='cymbal'?'highpass':'lowpass';filter.frequency.value=kind==='cymbal'?1900:kind==='tom'?1100:kind==='hat'?(underpassCrash?(event[7].hatCutoff??3000):3000):kind==='snare'?700:kind==='bassline'?750:kind==='pad'?900:kind==='metal'?2200:kind==='kick'?1000:1800;
 panner.pan.value=kind==='kick'||kind==='bass'||kind==='bassline'?0:Math.max(-.65,Math.min(.65,pan+(kind==='pad'?.25*Math.sin(lane*2.4):kind==='hat'?.3:kind==='metal'?-.22:0)));
 if(lane===1531){panner.pan.setValueAtTime(pan,time);panner.pan.linearRampToValueAtTime(-pan,time+duration);}
 const level=({cyberarp:.048,cyberbass:.13,cyberpad:.055,cyberlead:.075,cyberpulse:.055,jazzsax:.11,jazzbass:.10,shepard:.010,lahopterix:.065,brass:.085,harp:.028,kick:.36,snare:.12,hat:.04,tom:.19,cymbal:.065,ride:.065,bell:.095,metal:.10,bass:.12,bassline:.34,organ:.065,polysynth:.12,lead:.115,pad:.055,air:.04}[kind]||.06)*Math.min(1.2,velocity)*(squareDouble&&kind==='bassline'?.90:1)*(kind==='jazzsax'&&lane===1700?10**(-16/20):1)*(kind==='lead'?[1,1.8,1.45,1.9][event[7]??0]:1);
 gain.gain.setValueAtTime(0,time);
 if(kind==='cyberarp'&&event[7]?.sustainFade){
  gain.gain.linearRampToValueAtTime(level,time+(event[7]?.swellIn?duration*.4:.025));
  gain.gain.setValueAtTime(level*.9,time+(event[7]?.clusterFadeAt!==undefined?event[7].clusterFadeAt-offset:duration*(event[7]?.swellIn?.5:.3)));
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration-.02);
  gain.gain.linearRampToValueAtTime(0,time+duration);
 }else if(kind==='cyberarp'){
  gain.gain.linearRampToValueAtTime(level,time+.006);
  gain.gain.exponentialRampToValueAtTime(level*.32,time+duration*.65);
  gain.gain.linearRampToValueAtTime(0,time+duration);
 }else if(cyber){
  const attack=event[7]?.fadeIn?Math.min(.24,duration*.55):kind==='cyberpad'?.18:kind==='cyberlead'?.025:.004;
  gain.gain.linearRampToValueAtTime(level,time+Math.min(attack,duration*(event[7]?.fadeIn?.55:.2)));
  gain.gain.linearRampToValueAtTime(level*(kind==='cyberpad'?.85:.60),time+duration*.65);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(underpassCrash||(lane===1701&&kind==='hat'&&event[7]?.articulation==='open-hat')){
  // The shared noise hi-hat, opened out into a sustained, smoothly fading wash.
  gain.gain.linearRampToValueAtTime(level,time+.006);
  gain.gain.setValueAtTime(level*.88,time+.055);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(kind==='jazzsax'){
  const attack=Math.min(.035,duration*.22),release=Math.min(.13,duration*.22);
  gain.gain.linearRampToValueAtTime(level,time+attack);
  gain.gain.linearRampToValueAtTime(level*.88,time+duration-release);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(kind==='jazzbass'){
  const release=Math.min(.055,duration*.25);
  gain.gain.linearRampToValueAtTime(level,time+.006);
  gain.gain.linearRampToValueAtTime(level*.86,time+Math.min(.035,duration*.3));
  gain.gain.linearRampToValueAtTime(level*.70,time+duration-release);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(kind==='bassline'&&lane===1497){
  const gate=event[7].gate,short=event[7].short,decay=Math.min(short?.055:.2,Math.max(0,gate-.02)),sustain=short?.16:.6;
  gain.gain.linearRampToValueAtTime(level,time+(event[7].bite?.004:.02));
  gain.gain.linearRampToValueAtTime(level*sustain,time+.02+decay);
  gain.gain.setValueAtTime(level*sustain,time+gate);
  gain.gain.linearRampToValueAtTime(0,time+duration);
 }else if(kind==='kick'&&lane===1597){
  gain.gain.linearRampToValueAtTime(level,time+.002);
  gain.gain.setValueAtTime(level*.72,time+duration*.3);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(kind==='shepard'){
  gain.gain.linearRampToValueAtTime(level,time+duration*.30);
  gain.gain.setValueAtTime(level*.8,time+duration*.65);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(kind==='lahopterix'&&event[7]?.glideFromBelow){
  gain.gain.linearRampToValueAtTime(level,time+event[7].glideSeconds);
  gain.gain.setValueAtTime(level*.85,time+duration*.75);
  gain.gain.linearRampToValueAtTime(0,time+duration);
 }else if(kind==='lahopterix'&&lane===1703){
  gain.gain.linearRampToValueAtTime(level,time+.06);
  gain.gain.linearRampToValueAtTime(level*.78,time+duration-.16);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(kind==='lahopterix'&&lane===1596){
  gain.gain.linearRampToValueAtTime(level*.12,time+duration*.15);
  gain.gain.linearRampToValueAtTime(level,time+duration*.88);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(lane===1520){
  // Street C: a quiet chromatic Lahopterix cluster, gently swelling and releasing.
  gain.gain.linearRampToValueAtTime(level*.18,time+duration*.20);
  gain.gain.linearRampToValueAtTime(level,time+duration*.58);
  gain.gain.linearRampToValueAtTime(level*.62,time+duration*.84);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(kind==='lahopterix'&&lane===1531){
  gain.gain.linearRampToValueAtTime(level*.30,time+duration*.20);
  gain.gain.linearRampToValueAtTime(level,time+duration*.50);
  gain.gain.setValueAtTime(level,time+duration*.85);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(kind==='lahopterix'){
  gain.gain.linearRampToValueAtTime(level,time+.43);
  if(event[7]?.fadeOut)gain.gain.linearRampToValueAtTime(level*.7,time+duration*(1-event[7].fadeOut));
  else gain.gain.setValueAtTime(level*.7,time+duration-.35);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(kind==='lead'){
  gain.gain.linearRampToValueAtTime(level,time+duration*.26);
  gain.gain.setValueAtTime(level,time+duration*.68);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);

 }else if(kind==='brass'){
  gain.gain.linearRampToValueAtTime(level,time+.018);
  gain.gain.exponentialRampToValueAtTime(level*.55,time+duration*.4);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(kind==='polysynth'&&lane===1550){
  gain.gain.linearRampToValueAtTime(level,time+.004);
  gain.gain.exponentialRampToValueAtTime(level*.42,time+Math.min(.20,duration*.4));
  gain.gain.exponentialRampToValueAtTime(level*.22,time+duration-Math.min(.045,duration*.2));
  gain.gain.linearRampToValueAtTime(0,time+duration);
 }else if(kind==='polysynth'&&lane===1540){
  const landing=event[7].landing;
  gain.gain.linearRampToValueAtTime(level*.18,time+landing*.25);
  gain.gain.linearRampToValueAtTime(level,time+landing);
  gain.gain.linearRampToValueAtTime(level*.72,time+duration*.87);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(kind==='polysynth'&&lane===1513){
  gain.gain.linearRampToValueAtTime(level,time+.025);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(kind==='polysynth'){
  gain.gain.linearRampToValueAtTime(level*.12,time+duration*.16);
  gain.gain.linearRampToValueAtTime(level,time+duration*.48);
  gain.gain.linearRampToValueAtTime(level*.82,time+duration*.72);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(rhodes&&event[7]?.swell){
  const rise=event[7].swellRise??duration*.70;
  gain.gain.linearRampToValueAtTime(level*.12,time+rise*15/70);
  gain.gain.linearRampToValueAtTime(level,time+rise);
  if(event[7].sustain)gain.gain.setValueAtTime(level,time+duration*.90);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(rhodes&&lane===1498){
  gain.gain.linearRampToValueAtTime(level,time+.04);
  gain.gain.setValueAtTime(level*.78,time+duration-.04);
  gain.gain.linearRampToValueAtTime(0,time+duration);
 }else if(rhodes&&event[7]?.transition){
  gain.gain.linearRampToValueAtTime(level,time+.025);
  gain.gain.setValueAtTime(level*.78,time+event[7].landing);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(rhodes&&(lane===1488||lane===1491)){
  gain.gain.linearRampToValueAtTime(level,time+.22);
  gain.gain.setValueAtTime(level*.85,time+duration*.2);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(rhodes&&(lane===1458||lane===1482)){
  gain.gain.linearRampToValueAtTime(level,time+.6);
  gain.gain.setValueAtTime(level,time+duration-.25);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(rhodes&&(lane===1456||lane===1486)&&event[7]===1){
  gain.gain.linearRampToValueAtTime(level,time+.025);
  gain.gain.setValueAtTime(level*.78,time+duration-.08);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(rhodes){
  gain.gain.linearRampToValueAtTime(level,time+Math.min(.025,duration*.15));
  gain.gain.setValueAtTime(level*.78,time+duration*.75);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else if(kind==='organ'){
  // A slow bloom, held crest and short release make each harmony swell into view.
  gain.gain.linearRampToValueAtTime(level*.16,time+duration*.20);
  gain.gain.linearRampToValueAtTime(level,time+duration*.58);
  gain.gain.setValueAtTime(level*.92,time+duration*.82);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }else{
  gain.gain.linearRampToValueAtTime(level,time+Math.min(duration/4,kind==='pad'?.04:.003));
  if(kind==='bassline')gain.gain.setValueAtTime(level*.8,time+duration*.65);
  gain.gain.exponentialRampToValueAtTime(.0001,time+duration);
 }
 filter.connect(gain);gain.connect(panner);panner.connect(kind==='bassline'||kind==='organ'||kind==='polysynth'?(engine.bassDuck||engine.ambientDuck):kind==='pad'?engine.ambientDuck:(engine.musicInput||engine.music));
 const nodes=[],sources=[];
 const leadVariant=event[7]??0;
 let oscillatorBus=filter;
 if((kind==='kick'||kind==='tom')&&lane===1597){
  const drive=c.createWaveShaper();
  if(!engine.tribalDriveCurve)engine.tribalDriveCurve=Float32Array.from({length:1024},(_,i)=>Math.tanh(1.15*(i/511.5-1))/Math.tanh(1.15));
  drive.curve=engine.tribalDriveCurve;drive.oversample='2x';drive.connect(filter);oscillatorBus=drive;nodes.push(drive);
 }
 if((kind==='lead'&&(leadVariant===1||leadVariant===3))||((rhodes||kind==='lahopterix')&&event[7]?.ringHz)){
  const ring=c.createGain(),mod=c.createOscillator();
  ring.gain.value=0;mod.type='sine';mod.frequency.setValueAtTime(event[7]?.ringHz??(leadVariant===1?37:83),time);
  mod.connect(ring.gain);ring.connect(filter);oscillatorBus=ring;
  sources.push(mod);nodes.push(ring);
 }
 let reverbGain=null;
 const tail=cyber?.4:lane===1497?3:kind==='lead'||kind==='shepard'?2.4:0;
 if(kind==='lead'||kind==='shepard'||lane===1497){
  // Generated stereo impulse: no samples, independent of the percussion echo.
  if(!engine.leadImpulse){
   const buffer=c.createBuffer(2,Math.ceil(c.sampleRate*tail),c.sampleRate);let seed=82731;
   for(let ch=0;ch<2;ch++){
    const data=buffer.getChannelData(ch);let smooth=0;
    for(let i=0;i<data.length;i++){
     seed=(Math.imul(seed,1664525)+1013904223)>>>0;
     smooth=.72*smooth+.28*(seed/2147483648-1);
     data[i]=i<c.sampleRate*.027?0:smooth*(1-i/data.length)**3;
    }
   }
   engine.leadImpulse=buffer;
  }
  // A single convolution bus serves all voices; sends retain their individual mix.
  if(!engine.synthReverb){engine.synthReverb=c.createConvolver();engine.synthReverb.buffer=engine.leadImpulse;engine.synthReverb.connect(engine.musicInput||engine.music);}
  reverbGain=c.createGain();reverbGain.gain.value=lane===1497?.07:kind==='shepard'?1.1:.32;
  panner.connect(reverbGain);reverbGain.connect(engine.synthReverb);
  nodes.push(reverbGain);
 }
 function osc(type,hz,amp=1){const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(hz,time);g.gain.value=amp;o.connect(g);g.connect(oscillatorBus);sources.push(o);nodes.push(g);return o;}
 if(cyber){
  const pitches=Array.isArray(pitch)?pitch:[pitch];
  for(const note of pitches){
   const hz=(kind==='cyberbass'?55:110)*2**(note/12);
   if(kind==='cyberarp'){
    // Two gently detuned oscillators; six repeating voice offsets avoid a sterile unison.
    const voice=Math.round(offset/(60/128/8))%6,drift=[-2.4,1.1,-.7,2.2,-1.5,.8][voice];
    const vibrato=event[7]?.vibrato||{rate:4.7,depth:5};
    for(const [wave,ratio,amp,cents]of [['sawtooth',1,.30,drift-3],['square',1,.12,drift+3],['triangle',1,.35,drift],['triangle',.5,.10,drift]]){
     const hzAt=t=>hz*ratio*2**((cents+vibrato.depth*Math.sin(2*Math.PI*vibrato.rate*(offset+t)))/1200);
     const o=osc(wave,hzAt(0),amp);
     for(let t=.008;t<duration;t+=.008)o.frequency.exponentialRampToValueAtTime(hzAt(t),time+t);
     o.frequency.exponentialRampToValueAtTime(hzAt(duration),time+duration);
    }
   }else if(kind==='cyberbass'){
    osc('sine',hz,.75);osc('sawtooth',hz,.28);osc('sawtooth',hz*1.004,.18);
   }else{
    osc('sawtooth',hz*.997,kind==='cyberpad'?.20:.42);
    osc('sawtooth',hz*1.003,kind==='cyberpad'?.20:.42);
    osc('triangle',hz,kind==='cyberpad'?.12:.22);
   }
  }
  filter.Q.value=kind==='cyberbass'?1.3:.6;
  filter.frequency.setValueAtTime(kind==='cyberbass'?1050:kind==='cyberpad'?1050:kind==='cyberarp'?2600:2400,time);
  filter.frequency.exponentialRampToValueAtTime(kind==='cyberbass'?180:kind==='cyberpad'?650:kind==='cyberarp'?1100:850,time+duration);
  if(kind==='cyberlead'&&event[7]?.filterBite){
   filter.Q.value=3.8;filter.frequency.cancelScheduledValues(time);
   filter.frequency.setValueAtTime(380,time);
   filter.frequency.exponentialRampToValueAtTime(4600,time+.025);
   filter.frequency.exponentialRampToValueAtTime(650,time+Math.min(.24,duration*.65));
   filter.frequency.exponentialRampToValueAtTime(420,time+duration);
  }
  if((kind==='cyberarp'&&event[7]?.arpSweep)||(kind==='cyberlead'&&event[7]?.leadSweep)){
   const sweep=event[7].arpSweep||event[7].leadSweep,cutoff=t=>{const u=.5-.5*Math.cos(2*Math.PI*(t-sweep.start)/sweep.period);return sweep.low*(sweep.high/sweep.low)**(sweep.falling?1-u:u);};
   filter.Q.value=sweep.resonance;filter.frequency.cancelScheduledValues(time);
   const variation=1+.04*Math.sin(offset*7.31),base=cutoff(offset)*variation;
   filter.frequency.setValueAtTime(base*.65,time);
   filter.frequency.exponentialRampToValueAtTime(Math.min(7000,base*sweep.envAmount),time+.009);
   filter.frequency.exponentialRampToValueAtTime(cutoff(offset+duration)*.65,time+duration);
  }
  // Share the four-tap return across the rapid arp notes to avoid a delay
  // network per 32nd note. Buffered repeats continue after each note ends.
  if(kind==='cyberarp'&&event[7]?.echoTaps===4){
   const echoKey=event[7].sustainFade?'underpassSwellEcho':event[7].warmArp?'underpassWarmArpEcho':'underpassArpEcho';
   if(!engine[echoKey]){
    const input=c.createGain();input.gain.value=1;
    for(let tap=1;tap<=4;tap++){
     const delay=c.createDelay(4),repeat=c.createGain(),tone=c.createBiquadFilter();
     delay.delayTime.value=tap*event[7].echoStep;repeat.gain.value=(event[7].echoGain??.35)*(event[7].echoDecay??.55)**(tap-1);
     tone.type='lowpass';tone.frequency.value=(event[7].echoCutoff??3500)/(1+tap*.35);
     input.connect(delay);delay.connect(tone);tone.connect(repeat);repeat.connect(engine.musicInput||engine.music);
    }
    engine[echoKey]=input;
   }
   panner.connect(engine[echoKey]);
  }
  // Short, filtered echoes give the melodic voices space without bright bleeps.
  if(kind==='cyberlead'||kind==='cyberpulse'){
   const delay=c.createDelay(1),wet=c.createGain(),damp=c.createBiquadFilter();
   delay.delayTime.value=60/128*.75;wet.gain.value=.22;damp.type='lowpass';damp.frequency.value=1300;
   panner.connect(delay);delay.connect(damp);damp.connect(wet);wet.connect(engine.musicInput||engine.music);
   nodes.push(delay,wet,damp);
  }
 }
 else if(kind==='kick'){const o=osc('sine',freq*2.2);o.frequency.exponentialRampToValueAtTime(freq,time+.035);o.frequency.exponentialRampToValueAtTime(freq*.86,time+duration);if(lane===1597){const body=osc('triangle',freq*3,.32);body.frequency.exponentialRampToValueAtTime(freq*2,time+duration);filter.frequency.value=1800;}engine.duck(engine.ambientDuck,time,.42,.12);if(engine.bassDuck)engine.duck(engine.bassDuck,time,lane===1597?.60:squareDouble?.82:.75,lane===1597?.06:squareDouble?.032:.045);}
 else if(kind==='tom'){
  if(underpassLowTom){
   // Keep the existing sine/triangle drum family, with a low resonant body and
   // a brief stick/skin attack rather than a long pitched glissando.
   const o=osc('sine',108);o.frequency.exponentialRampToValueAtTime(96,time+.026);o.frequency.exponentialRampToValueAtTime(92,time+duration);
   osc('triangle',151,.14);
   const skin=c.createBufferSource(),skinGain=c.createGain();skin.buffer=engine.noise;
   skinGain.gain.setValueAtTime(.16,time);skinGain.gain.exponentialRampToValueAtTime(.0001,time+.023);
   skin.connect(skinGain);skinGain.connect(filter);sources.push(skin);nodes.push(skinGain);
  }else{const o=osc('sine',120*2**(pitch/12));o.frequency.exponentialRampToValueAtTime(82*2**(pitch/12),time+duration);osc('triangle',165*2**(pitch/12),.14);}
 }
 else if(kind==='snare'||kind==='hat'||kind==='air'||kind==='cymbal'){const n=c.createBufferSource();n.buffer=engine.noise;n.loop=true;n.connect(filter);sources.push(n);if(kind==='snare')osc('triangle',155*2**(pitch/12),.28);if(kind==='hat'&&lane===1700){filter.frequency.value=6200;filter.Q.value=.3;}}
 else if(kind==='shepard'){
  // Octave-spaced tones descend together; a fixed spectral bell crossfades registers.
  filter.frequency.value=1600;filter.Q.value=.2;
  for(let octave=-3;octave<=6;octave++){
   const o=osc('sine',220*2**octave,0),amplitude=nodes.at(-1).gain;
   for(let i=0;i<=64;i++){
    const u=i/64,hz=220*2**(octave-2*u),weight=.38*Math.exp(-.5*(Math.log2(hz/660)/1.2)**2);
    if(i===0){o.frequency.setValueAtTime(hz,time);amplitude.setValueAtTime(weight,time);}
    else{o.frequency.exponentialRampToValueAtTime(hz,time+u*duration);amplitude.linearRampToValueAtTime(weight,time+u*duration);}
   }
  }
 }
 else if(kind==='polysynth'&&lane===1550){
  // Street harp timbre, with sustained overlap and expressive vibrato for D2.
  const hz=110*2**(pitch/12),vibrato=c.createOscillator();
  vibrato.frequency.value=4.7;
  for(const [wave,harmonic,amp]of [['sine',1,.8],['triangle',1,.15],['sine',2,.09]]){
   const o=osc(wave,hz*harmonic,amp),depth=c.createGain();
   depth.gain.setValueAtTime(0,time);depth.gain.linearRampToValueAtTime(hz*harmonic*.009,time+Math.min(.18,duration*.45));
   vibrato.connect(depth);depth.connect(o.frequency);nodes.push(depth);
  }
  filter.Q.value=.2;filter.frequency.setValueAtTime(3800,time);
  filter.frequency.exponentialRampToValueAtTime(1400,time+duration);
  sources.push(vibrato);
 }
 else if(kind==='lahopterix'){
  // Lahopterix hissata reference: two sines, two saws, soft attack, low-pass and delay.
  const rising=event[7]?.glideFromBelow;
  const base=110*2**((pitch+(rising?0:.055))/12);
  for(const [i,[wave,amp]]of [['sine',.151],['sawtooth',.023],['sine',.512],['sawtooth',.626]].entries()){
   const o=osc(wave,rising?base*2**(-rising/12):lane===1531?base*2**(-45/1200):lane===1511?base*2**(-2/12):lane===1512?base*2**(2/12):base,amp*.65);
   if(rising){
    o.frequency.exponentialRampToValueAtTime(base,time+event[7].glideSeconds);
   }else if(lane===1703){
    // One uninterrupted oscillator/envelope per reply, with held notes and
    // short portamento ramps into each following target.
    const path=event[7].portamento,glide=event[7].glideSeconds;
    for(let n=1;n<path.length;n++){
     o.frequency.setValueAtTime(110*2**((path[n-1].pitch+.055)/12),time+Math.max(path[n-1].at,path[n].at-glide));
     o.frequency.exponentialRampToValueAtTime(110*2**((path[n].pitch+.055)/12),time+path[n].at);
    }
   }else if(lane===1531)o.frequency.exponentialRampToValueAtTime(base,time+duration*.75);
   else if(lane===1511||lane===1512)o.frequency.exponentialRampToValueAtTime(base,time+Math.min(.65,duration*.3));
   else if(lane===1596||lane===1520){o.frequency.exponentialRampToValueAtTime(base*2**(.035/12),time+duration*.5);o.frequency.exponentialRampToValueAtTime(base*2**(-.025/12),time+duration);}
   else if(lane===1483){o.frequency.exponentialRampToValueAtTime(base*2**(1/12),time+duration*.5);o.frequency.exponentialRampToValueAtTime(base,time+duration*.9);}
   else o.frequency.exponentialRampToValueAtTime(base*2**(-2/12),time+duration*.9);
  }
  filter.frequency.value=rising?2400:lane===1703?2200:lane===1596?2400:lane===1520?1900:lane===1531?2200:608;filter.Q.value=.4;
  const delay=c.createDelay(1),feedback=c.createGain(),tone=c.createBiquadFilter(),wet=c.createGain();
  delay.delayTime.value=lane===1703?60/108/2:.445;feedback.gain.value=lane===1703?.30:.55;tone.type='lowpass';tone.frequency.value=1420;wet.gain.value=lane===1703?.22:.4;
  filter.connect(delay);delay.connect(tone);tone.connect(feedback);feedback.connect(delay);tone.connect(wet);wet.connect(gain);
  nodes.push(delay,feedback,tone,wet);
 }
 else if(kind==='jazzsax'){
  // A reed-rich harmonic spectrum, breath and delayed, shallow vibrato.
  // No pitch sweeps, ring modulation or bell/triangle fallback.
  const hz=110*2**(pitch/12),vibrato=c.createOscillator();
  vibrato.frequency.value=5.1;
  for(const [i,amp]of [1,.72,.48,.34,.21,.15,.09,.055].entries()){
   const harmonic=i+1,o=osc('sine',hz*harmonic,amp*.40),depth=c.createGain();
   depth.gain.setValueAtTime(0,time);
   depth.gain.setValueAtTime(0,time+Math.min(.22,duration*.5));
   depth.gain.linearRampToValueAtTime(hz*harmonic*.004,time+Math.min(.42,duration*.8));
   vibrato.connect(depth);depth.connect(o.frequency);nodes.push(depth);
  }
  sources.push(vibrato);
  const breath=c.createBufferSource(),breathTone=c.createBiquadFilter(),breathGain=c.createGain();
  breath.buffer=engine.noise;breath.loop=true;breathTone.type='bandpass';breathTone.frequency.value=1350;breathTone.Q.value=.65;breathGain.gain.value=.12;
  breath.connect(breathTone);breathTone.connect(breathGain);breathGain.connect(filter);
  sources.push(breath);nodes.push(breathTone,breathGain);
  filter.frequency.value=2600;filter.Q.value=.45;
 }
 else if(kind==='jazzbass'){
  // Slightly more sine-like finger pluck: favor the fundamental, retaining
  // a little second harmonic and finger noise for the existing string texture.
  engine.underpassPlucks??=new Map();
  const hz=55*2**(pitch/12),key=pitch+':'+c.sampleRate;
  let buffer=engine.underpassPlucks.get(key);
  if(!buffer){
   buffer=c.createBuffer(1,Math.ceil(c.sampleRate*1.5),c.sampleRate);
   const data=buffer.getChannelData(0),period=Math.max(2,Math.round(c.sampleRate/hz-.5)),ring=new Float32Array(period);
   let seed=17007+Math.round(pitch*127),smooth=0,mean=0;
   for(let i=0;i<period;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;smooth=.75*smooth+.25*(seed/2147483648-1);ring[i]=smooth*.25+.34*Math.sin(i/period*Math.PI*2)+.075*Math.sin(i/period*Math.PI*4);mean+=ring[i]/period;}
   for(let i=0;i<period;i++)ring[i]-=mean;
   let peak=0;
   for(let i=0;i<data.length;i++){const j=i%period;data[i]=ring[j];peak=Math.max(peak,Math.abs(data[i]));ring[j]=.997*.5*(ring[j]+ring[(j+1)%period]);}
   for(let i=0;i<data.length;i++)data[i]*=.8/Math.max(peak,.001);
   engine.underpassPlucks.set(key,buffer);
  }
  const pluck=c.createBufferSource();pluck.buffer=buffer;pluck.connect(filter);sources.push(pluck);
  filter.frequency.value=1300;filter.Q.value=.35;
 }
 else if(kind==='brass'){
  const chord=Array.isArray(pitch)?pitch:[pitch];
  for(const [i,n]of chord.entries()){
   const hz=110*2**(n/12),balance=1/Math.sqrt(chord.length);
   osc('sawtooth',hz*2**((i%2?3:-3)/1200),.48*balance);osc('triangle',hz,.4*balance);
  }
  filter.Q.value=.65;filter.frequency.setValueAtTime(750,time);filter.frequency.linearRampToValueAtTime(2100,time+.025);filter.frequency.exponentialRampToValueAtTime(650,time+duration);
 }
 else if(kind==='harp'){
  const hz=110*2**(pitch/12);
  osc('sine',hz,.8);osc('triangle',hz,.15);osc('sine',hz*2,.09);
  filter.Q.value=.2;filter.frequency.setValueAtTime(3800,time);filter.frequency.exponentialRampToValueAtTime(1400,time+duration);
 }
 else if(kind==='bell'){
  // Rounded mallet rather than a vowel-like organ/square blend; no moving resonance.
  filter.frequency.value=3000;filter.Q.value=.25;
  osc('sine',freq,.85);osc('triangle',freq,.12);
  osc('sine',freq*2.76,.10);const partial=nodes.at(-1);
  partial.gain.setValueAtTime(.10,time);partial.gain.exponentialRampToValueAtTime(.0001,time+duration*.38);
 }
 else if(kind==='ride'){
  // A warm metallic stick ping with a restrained noise wash.
  filter.frequency.value=3800;filter.Q.value=.5;
  osc('sine',1720,.52);osc('sine',2387,.27);osc('sine',3211,.13);
  const n=c.createBufferSource(),ng=c.createGain();n.buffer=engine.noise;n.loop=true;
  ng.gain.value=.13;n.connect(ng);ng.connect(filter);sources.push(n);nodes.push(ng);
 }
 else if(kind==='metal'){osc('sine',freq,.65);osc('sine',freq*1.413,.26);osc('sine',freq*2.071,.15);}
 else if(kind==='bassline'&&(lane===1200||lane===1201||lane===1202)){osc('sawtooth',freq,.34);osc('triangle',freq,.46);osc('sine',freq,.30);filter.Q.value=lane===1202?2.2:1.1;
  filter.frequency.setValueAtTime(lane===1202?2400:1050,time);
  if(lane===1202)filter.frequency.exponentialRampToValueAtTime(480,time+Math.min(.065,duration*.4));
  filter.frequency.exponentialRampToValueAtTime(240,time+duration);}
 else if(kind==='bassline'&&lane===1497){
  // GUDECO Config{} startup, not factory program 0. G3 input transposed -24 = G1.
  for(const [detune,amp]of [[-.06,.28],[.06,.18],[-.06,.28],[.06,.18]])osc('sawtooth',freq*2**(detune/12),amp);
  if(event[7]?.bite){
   filter.Q.value=1.6;filter.frequency.setValueAtTime(1800,time);
   filter.frequency.exponentialRampToValueAtTime(300,time+.09);
   filter.frequency.exponentialRampToValueAtTime(180,time+duration);
  }else{
   filter.Q.value=.85;filter.frequency.setValueAtTime(260,time);
   filter.frequency.exponentialRampToValueAtTime(720,time+.015);
   filter.frequency.exponentialRampToValueAtTime(420,time+.12);
  }
  const chorus=c.createDelay(.05),lfo=c.createOscillator(),depth=c.createGain(),wet=c.createGain();
  chorus.delayTime.value=.0095;lfo.frequency.value=.22;depth.gain.value=.0038;wet.gain.value=.25;
  lfo.connect(depth);depth.connect(chorus.delayTime);filter.connect(chorus);chorus.connect(wet);wet.connect(gain);
  sources.push(lfo);nodes.push(chorus,depth,wet);
 }
 else if(kind==='bassline'){
  osc('triangle',freq,.65);osc('sine',freq,.32);osc('sawtooth',freq*2,.18);
  // Give the doubled pair a brief clear onset while leaving the low-pass dip intact.
  filter.frequency.setValueAtTime(squareDouble?1600:1300,time);
  if(squareDouble)filter.frequency.setValueAtTime(1600,time+Math.min(.012,duration*.2));
  filter.frequency.exponentialRampToValueAtTime(260,time+duration);
 }
 else if(kind==='lead'){
  for(const [type,cents,amp]of [['sawtooth',-5,.30],['sawtooth',5,.24],['triangle',0,.50]]){
   const o=osc(type,freq*2**((cents-20)/1200),amp);
   // Damped pitch hunting through the swell, then a stable, softly detuned sustain.
   const settling=Math.min(1.8,duration*.5);
   for(const [position,drift]of [[.12,25],[.29,-18],[.46,13],[.64,-8],[.81,4],[1,0]])
    o.frequency.linearRampToValueAtTime(freq*2**((cents+drift)/1200),time+settling*position);
   if(leadVariant===2){
    o.frequency.setValueAtTime(freq*2**(cents/1200),time+duration*.68);
    o.frequency.exponentialRampToValueAtTime(freq*2**((cents-700)/1200),time+duration);
   }else o.frequency.setValueAtTime(freq*2**(cents/1200),time+duration);
  }
  filter.Q.value=.65;filter.frequency.setValueAtTime(800,time);
  filter.frequency.linearRampToValueAtTime(2350,time+duration*.35);
  filter.frequency.linearRampToValueAtTime(900,time+duration);
  if(leadVariant===2){
   filter.Q.value=1.5;filter.frequency.cancelScheduledValues(time);
   filter.frequency.setValueAtTime(650,time);
   filter.frequency.exponentialRampToValueAtTime(2800,time+duration*.45);
   filter.frequency.exponentialRampToValueAtTime(350,time+duration);
  }else if(leadVariant===3){
   filter.Q.value=2;filter.frequency.cancelScheduledValues(time);
   filter.frequency.setValueAtTime(650,time);
   for(let i=1;i<=12;i++)filter.frequency.exponentialRampToValueAtTime(i%2?2100:700,time+duration*i/12);
  }
  panner.pan.setValueAtTime(pan-.08,time);panner.pan.linearRampToValueAtTime(pan+.08,time+duration);
 }
 else if(kind==='polysynth'&&lane===1540){
  // Interleaved high glides settle into adjacent notes and remain superimposed.
  const target=110*2**(pitch/12),{from,landing}=event[7];
  for(const [wave,amp,cents]of [['triangle',.55,-3],['sine',.45,3],['sawtooth',.12,0]]){
   const hz=target*2**(cents/1200),o=osc(wave,hz*2**(from/12),amp);
   o.frequency.exponentialRampToValueAtTime(hz,time+landing);
   o.frequency.linearRampToValueAtTime(hz*2**(-cents/1200),time+duration);
  }
  filter.Q.value=.5;filter.frequency.setValueAtTime(1400,time);
  filter.frequency.linearRampToValueAtTime(3200,time+landing);
  filter.frequency.linearRampToValueAtTime(2100,time+duration);
 }
 else if(kind==='polysynth'){
  const chord=Array.isArray(pitch)?pitch:[pitch],balance=1/Math.sqrt(chord.length);
  for(const [i,note]of chord.entries()){
   const hz=110*2**(note/12);
   for(const side of [-1,1]){
    const o=osc('sawtooth',hz*2**(side*(4+i*.6)/1200),.34*balance);
    // Slow, opposing pitch drift stays within a few cents of each chord tone.
    o.frequency.linearRampToValueAtTime(hz*2**(side*8/1200),time+duration*.5);
    o.frequency.linearRampToValueAtTime(hz*2**(side*3/1200),time+duration);
   }
   osc('triangle',hz,.36*balance);
  }
  filter.Q.value=.75;
  filter.frequency.setValueAtTime(360,time);
  filter.frequency.exponentialRampToValueAtTime(1550,time+duration*.55);
  filter.frequency.exponentialRampToValueAtTime(550,time+duration);
  panner.pan.setValueAtTime(pan-.12,time);
  panner.pan.linearRampToValueAtTime(pan+.12,time+duration);
 }
 else if(rhodes){
  // Adapted from the supplied QUAD-OSC Rhodesia fermis preset.
  const tones=Array.isArray(pitch)?pitch:[pitch],balance=.65/Math.sqrt(tones.length);
  const layers=[['sawtooth',-12,-.05,.626,.02],['sawtooth',-2,.05,.24,.336],['triangle',21,-.02,.597,.06],['sine',5,.02,.667,.1]];
  for(const [toneIndex,note] of tones.entries())for(const [wave,transpose,detune,amp,attack]of layers){
   const hz=110*2**((note+transpose+detune)/12),o=osc(wave,hz,amp*balance),g=nodes.at(-1);
   g.gain.setValueAtTime(0,time);
   const entry=lane===1458?toneIndex*.15:0;
   g.gain.setValueAtTime(0,time+entry);g.gain.linearRampToValueAtTime(amp*balance,time+entry+(lane===1458?.45:Math.min(attack,duration*.4)));
   if((lane===1456||lane===1486)&&event[7]===1){
    for(const [fraction,cents]of [[0,-5],[.28,7],[.62,-4],[1,1]])o.frequency.linearRampToValueAtTime(hz*2**(cents/1200),time+duration*fraction);
   }
   if(lane===1488||lane===1491){
    o.frequency.setValueAtTime(hz,time+duration*.15);
    o.frequency.exponentialRampToValueAtTime(hz*2**(-(2+toneIndex*.06)/12),time+duration);
   }
   if(event[7]?.transition){
    const landing=event[7].landing,target=event[7].targets[toneIndex];
    o.frequency.setValueAtTime(hz,time+landing*.5);
    o.frequency.exponentialRampToValueAtTime(110*2**((target+transpose+detune)/12),time+landing);
   }
  }
  const upperCounterline=[1487,1488,1489,1491].includes(lane)||event[7]?.swell;
  filter.Q.value=.1;filter.frequency.setValueAtTime(upperCounterline?1200:556,time);
  filter.frequency.linearRampToValueAtTime(upperCounterline?1550:620,time+duration*.5);
  filter.frequency.linearRampToValueAtTime(upperCounterline?1000:510,time+duration);
 }
 else if(kind==='organ'){
  // One voice owns the whole chord: admission, attack and release stay together.
  for(const note of (Array.isArray(pitch)?pitch:[pitch])){
   const fundamental=110*2**(note/12),balance=Math.sqrt(3/(Array.isArray(pitch)?pitch.length:3));
   for(const [harmonic,amp]of [[1,.65],[2,.23],[3,.10],[4,.06]]){
    const o=osc('sine',fundamental*harmonic,amp*balance);
    if(lane===1407){
     o.frequency.setValueAtTime(fundamental*harmonic,time+duration*.15);
     o.frequency.exponentialRampToValueAtTime(fundamental*harmonic*2,time+duration*.88);
    }
   }
  }
  filter.frequency.setValueAtTime(650,time);filter.frequency.linearRampToValueAtTime(1800,time+duration*.7);
 }
 else if(kind==='bass'){osc('triangle',freq,.8);osc('sine',freq/2,.22);}
 else {osc('triangle',freq,.55);osc('sine',freq*1.006,.35);}
 let ended=0,stopped=false;const voice={music:true,synth:true,stop:at=>{if(stopped)return;stopped=true;gain.gain.cancelScheduledValues(at);gain.gain.setTargetAtTime(.0001,at,.006);if(reverbGain){reverbGain.gain.cancelScheduledValues(at);reverbGain.gain.setTargetAtTime(.0001,at,.006);}for(const s of sources)s.stop(at+.035);}};
 engine.voices.add(voice);
 for(const s of sources){s.onended=()=>{s.disconnect();if(++ended===sources.length){for(const n of nodes)n.disconnect();filter.disconnect();gain.disconnect();panner.disconnect();engine.voices.delete(voice);}};s.start(time);s.stop(time+duration+(cyber?.4:0)+.01);}
}
export function scheduleSynth(engine,score){
 const c=engine.ctx,lookAhead=engine.synthLookAhead??.22;
 if(!engine.synthClock||engine.synthClock.theme!==engine.theme)engine.synthClock={theme:engine.theme,origin:c.currentTime+.05+(score.pickupDuration||0),pickupIndex:0,index:0,cycle:0,wetLevel:engine.echo?.wet.gain.value??0};
 const clock=engine.synthClock;
 // A one-time anacrusis precedes bar one; subsequent pickups live inside the loop.
 while(clock.pickupIndex<(score.pickupEvents?.length||0)){
  const e=score.pickupEvents[clock.pickupIndex],t=clock.origin+e[0];
  if(t>c.currentTime+lookAhead)break;
  if(t>=c.currentTime-.02)synthNote(engine,e,Math.max(c.currentTime,t));
  clock.pickupIndex++;
 }
 if(score.rests&&clock.restCycle!==clock.cycle&&engine.musicInput){
  clock.restCycle=clock.cycle;const base=clock.origin+clock.cycle*score.duration;
  engine.echo?.wet.gain.setValueAtTime(clock.wetLevel,base);
  engine.echo?.wet.gain.setValueAtTime(clock.wetLevel,base+score.duration);
  for(const [start,end]of score.rests){
   engine.musicInput.gain.setValueAtTime(1,base+start-.004);
   engine.musicInput.gain.linearRampToValueAtTime(0,base+start);
   engine.musicInput.gain.setValueAtTime(0,base+end);
   engine.musicInput.gain.linearRampToValueAtTime(1,base+end+.004);
   // Stop the echo return too, so the shared rests remain clean.
   engine.echo?.wet.gain.setValueAtTime(clock.wetLevel,base+start-.004);
   engine.echo?.wet.gain.linearRampToValueAtTime(0,base+start);
  }
 }

 if(c.currentTime-clock.origin-clock.cycle*score.duration>score.duration){clock.origin=c.currentTime+.025;clock.index=0;clock.cycle=0;}
 let guard=0;
 while(score.events.length&&guard++<2048){const e=score.events[clock.index],t=clock.origin+clock.cycle*score.duration+e[0];if(t>c.currentTime+lookAhead)break;
 if(t>=c.currentTime-.02)synthNote(engine,engine.theme==='hospital'&&e[1]==='lead'?[...e.slice(0,7),e[7]??clock.cycle%4]:e,Math.max(c.currentTime,t));
 if(++clock.index===score.events.length){clock.index=0;clock.cycle++;}
 }
}

// Square: four-bar A-minor pentatonic funk phrase, with ghost pickups.
// Street uses the dedicated A-A-B-A-A-C arrangement below.
// New notes fit existing activity windows, keeping playlist cutouts open.
export function withStageBass(score,theme){
 if(theme==='street')return arrangeStreet(score);
 const bpm=theme==='plaza'?174:188,step=60/bpm/4,bars=Math.round(score.duration/(step*16));
 const squarePhrase=[
  [[0,0,1.65,.90],[3,12,.55,.46],[6,7,.85,.73],[7.5,10,.45,.45],[10,0,1.35,.86],[13,3,.80,.70],[15,7,.65,.68]],
  [[0,0,1.30,.86],[2.5,0,.45,.43],[5,3,.85,.72],[7,5,.70,.68],[10,7,1.25,.81],[13,12,.65,.75],[15,10,.55,.58]],
  [[0,0,1.65,.90],[3,12,.55,.46],[6,7,.85,.73],[7.5,10,.45,.45],[10,0,1.35,.86],[13,3,.80,.70],[15,5,.65,.68]],
  [[0,7,1.20,.82],[3,10,.70,.68],[6,12,1.10,.86],[9,7,.65,.69],[11,5,.60,.65],[13,3,.65,.67],[15,0,.60,.79]]
 ];
 const squareB=[
  [[0,12,7,.82],[8,10,3.5,.76],[12,7,3.5,.74]],
  [[0,10,6.5,.80],[8,7,3.5,.74],[12,5,3.5,.72]],
  [[0,7,6.5,.79],[8,5,3.5,.74],[12,3,3.5,.72]],
  [[0,5,5.5,.77],[6,3,3.5,.73],[10,0,5,.86]]
 ];
 const streetMotif=[[0,-2,1.5],[3,-2,1],[6,10,1.2],[8,-2,1.8],[11,-1,1],[14,-2,1.2]];
 const added=[],sustainedDurations=new Map();
 const windows=[];
 for(const [start,end] of (score.activeWindows||score.events.map(e=>[e[0],e[0]+e[3]]))){const last=windows.at(-1);if(last&&start<=last[1]+.00001)last[1]=Math.max(last[1],end);else windows.push([start,end]);}

 for(let bar=0;bar<Math.min(bars,24);bar++)for(const [slot,pitch,len,velocity]of (theme==='plaza'?(bar%12>=8?squareB[bar%12-8]:squarePhrase[bar%4]):streetMotif)){
  if(theme!=='plaza'&&bar%4===3&&slot>=14)continue;
  const time=(bar*16+slot)*step;
  const active=score.events.filter(e=>e[0]<=time+.00001&&e[0]+e[3]>time);
  if(!active.length)continue;
  const isB=theme==='plaza'&&bar%12>=8;
  const end=windows.find(w=>w[0]<=time+.00001&&w[1]>time)?.[1]??Math.max(...active.map(e=>e[0]+e[3]));
  const phrase=isB?squareB[bar%12-8]:squarePhrase[bar%4];
  const next=phrase.find(n=>n[0]>slot)?.[0]??16;
  const sustained=Math.min((isB?len:Math.min(len*1.65,next-slot-.12))*step,end-time,score.duration-time);
  const duration=Math.min(len*step,(isB?end:Math.max(...active.map(e=>e[0]+e[3])))-time,score.duration-time);
  if(duration<.025)continue;
  sustainedDurations.set(time,sustained);
  added.push([time,'bassline',pitch+(theme!=='plaza'&&bar%2&&slot===8?-7:0),duration,velocity??(slot===0?.85:.67),0,isB?1000:999]);
 }
 // C: A-G-A, G-F-G, F-E-F ... descending, with common band rests.
 const cStart=24*16*step,bursts=[],cNotes=[];
 const figures=[[[12,10,12],[10,8,10]],[[8,7,8],[7,5,7]],[[5,3,5],[3,2,3]],[[2,0,2],[0,-2,0]]];
 for(let bar=0;bar<4;bar++)for(let figure=0;figure<2;figure++){
  const start=cStart+(bar*16+figure*8)*step;bursts.push([start,start+2.85*step]);
  figures[bar][figure].forEach((pitch,i)=>cNotes.push([start+i*step,'bassline',pitch,.82*step,i===0?.85:.71,0,1000]));
 }
 const accompaniment=score.events.flatMap(original=>{
  const e=[...original];
  if(e[0]<cStart){e[3]=Math.min(e[3],cStart-e[0]);return [e];}
  const burst=bursts.find(w=>e[0]>=w[0]-.00001&&e[0]<w[1]);
  if(!burst)return [];e[3]=Math.min(e[3],burst[1]-e[0]);return e[3]>.01?[e]:[];
 });
 // Explicit drum answers make each short bass figure a shared stop/start gesture.
 for(const [start] of bursts){cNotes.push([start,'kick',0,1.1*step,.7,0,1300],[start+2*step,'snare',-2,.8*step,.55,0,1301]);}
 // Filter after bass generation so the original activity windows and phrasing stay intact.
 const first=[...accompaniment,...added,...cNotes].filter(e=>e[1]!=='pad'&&!(e[1]==='metal'&&e[6]===44)).sort((a,b)=>a[0]-b[0]),length=score.duration;
 const rests=bursts.map((w,i)=>[w[1],bursts[i+1]?.[0]??length]);
 const repeat=first.map(e=>{
  const repeated=[e[0]+length,...e.slice(1)];
  if(e[1]==='bassline'&&sustainedDurations.has(e[0]))repeated[3]=sustainedDurations.get(e[0]);
  if(e[1]==='bassline'||e[1]==='kick')repeated[9]='square-doubled';
  return repeated;
 });
 // Preserve the bass patch, envelope and velocity; add only a perfect fifth.
 const fifths=repeat.filter(e=>e[1]==='bassline').map(e=>{
  const double=[...e];double[2]+=7;double[8]='square-fifth';return double;
 });
 const form=['A','A','B','A','A','B','C'];
 return {...score,duration:length*2,form:[...form,...form.map(p=>p+' fifths')],sectionBars:4,rests:[...rests,...rests.map(([a,b])=>[a+length,b+length])],events:[...first,...repeat,...fifths].sort((a,b)=>a[0]-b[0])};
}

// Seven four-bar sections, ending with a distinct organ-led D turnaround.
export function streetMicroPitch(pitch){
 const ratios=[1,16/15,9/8,6/5,5/4,4/3,7/5,3/2,8/5,5/3,7/4,15/8];
 const degree=pitch+2,octave=Math.floor(degree/12),pc=((degree%12)+12)%12;
 return -2+12*octave+12*Math.log2(ratios[pc]);
}
export function arrangeStreetCycle(source){
 const step=60/188/4,barTime=step*16,sectionTime=barTime*4;
 const form=['A',"A'",'B','A*',"A*'",'C','D','E','F'],events=[],activeWindows=[];
 const motifs={
  A:[[[0,-2,1.7,.87],[3,-2,.65,.48],[6,10,.85,.75],[8,-2,1.6,.84],[11,-1,.7,.65],[14,1,.8,.70]],
     [[0,-2,1.6,.87],[3,-2,.6,.48],[6,5,.9,.72],[9,1,1,.74],[12,-1,.7,.60],[15,-2,.65,.78]]],
  B:[[[0,-2,.65,.76],[1,1,.6,.73],[2,4,.6,.77],[3,5,.6,.8],[4,10,.9,.86],[10,-2,.6,.72],[11,1,.6,.75],[12,4,.6,.78],[13,10,.8,.85]],
     [[0,-2,.65,.76],[1,-1,.6,.72],[2,1,.6,.76],[3,5,.6,.81],[4,10,1,.87],[10,1,.6,.72],[11,4,.6,.76],[12,5,.6,.8],[13,10,.8,.85]]],
  C:[[[0,-2,1,.88],[2,1,.7,.67],[5,4,.75,.70],[7,-2,1,.83],[10,8,.7,.72],[12,4,.6,.65],[14,-1,.65,.66]],
     [[0,-2,1.2,.88],[3,1,.7,.66],[6,4,.7,.74],[8,-2,1.2,.86],[11,-1,.65,.65],[14,-2,.9,.8]]]
 };
 for(let section=0;section<form.length;section++){
  const prime=form[section].endsWith("'"),power=form[section].includes('*'),part=form[section].startsWith('A')?'A':form[section],dest=section*sectionTime;
  if(part==='F'){
   activeWindows.push([dest,dest+sectionTime]);
   const put=(bar,slot,kind,pitch,len,vel,lane)=>events.push([dest+(bar*16+slot)*step,kind,pitch,len*step,vel,0,lane]);
   for(let bar=0;bar<4;bar++){
    for(let slot=0;slot<16;slot+=2)put(bar,slot,'bassline',-14,1.5,slot%4===0?.82:.66,1470);
    if(bar<2){
     for(const slot of [0,2,8,10])put(bar,slot,'kick',-2,1.3,.82,1471);
     for(const slot of [4,12])put(bar,slot,'snare',-2,1.2,.88,1471);
     for(let slot=0;slot<16;slot+=2)put(bar,slot,'hat',-4,.5,.43,1471);
    }else{
     // Twelve strokes per bar: twice the previous fill speed, at the same tempo.
     if(bar===3){
      // Eight equal snare sixteenths occupy beats three and four before A.
      for(let i=0;i<8;i++)put(bar,8+i,'snare',-2,.7,.65,1472);
     }else for(let i=0;i<12;i++)put(bar,i*16/12,i%3===0?'snare':'tom',-(i%6),.625,.72+(i%6)*.025,1472);
     put(bar,0,'kick',-2,1.4,.80,1471);
    }
   }
   continue;
  }
  if(part==='E'){
   // Screenshot melody: each pair repeats three times; Db5 holds from bar four through F.
   const lines=[[40,39,40,39,40,39,37,35],[37,35,37,35,34,32,34,32],[34,32,30,29,30,29,30,29]];
   activeWindows.push([dest,dest+sectionTime]);
   const put=(bar,slot,kind,pitch,len,vel,pan=0,lane=1450)=>events.push([dest+(bar*16+slot)*step,kind,pitch,len*step,vel,pan,lane]);
   for(let bar=0;bar<4;bar++){
    // Rhodesia sixteenth-note riff with a quieter parallel perfect fifth.
    if(bar<3)for(let slot=0;slot<16;slot++){
     const pair=Math.floor(slot/4)*2,pitch=streetMicroPitch(lines[bar][pair+slot%2])-12;
     const velocity=(slot%2?.55:.65)*.65;
     put(bar,slot,'organ',pitch,.9,velocity,.12,1456);
     put(bar,slot,'organ',pitch+7,.9,velocity*.6,-.12,1486);
    }
    if(bar===3){
     put(bar,0,'organ',streetMicroPitch(28)-12,80-.2,.39,.12,1456);events.at(-1)[7]=1;
     put(bar,0,'organ',streetMicroPitch(28)-5,80-.2,.234,-.12,1486);events.at(-1)[7]=1;
    }
    // Syncopated kick, backbeat and quiet snare ghosts keep the eighths dancing.
    for(const slot of (bar%2?[0,3,7,10]:[0,6,9,14]))put(bar,slot,'kick',-2,1.5,slot===0?.80:.66,0,1451);
    for(const slot of [4,12])put(bar,slot,'snare',-2,1.2,.79,0,1452);
    for(const slot of [3,7,10,15])put(bar,slot+.12,'snare',-4,.45,.19,.13,1453);
    // The back half accelerates to thirty-seconds; soft in-between hits keep accents clear.
    for(let slot=0;slot<16;slot+=bar>=2?.5:2){
     const velocity=slot%4===2?.46:slot%2===0?.27:slot%1===0?.23:.17;
     put(bar,slot,'hat',-4,bar>=2?.22:.55,velocity,.22,1454);
    }

   }
   put(0,0,'shepard',0,48,.45,0,1485);
   // Two two-bar glides: D5 to Eb5 and back, then A4 down to G4.
   for(const [interval,velocity,pan]of [[0,.25,0],[7,.12,-.18],[12,.10,.18]]){
    put(0,0,'lahopterix',17+interval,32,velocity,pan,1483);
    put(2,0,'lahopterix',12+interval,32,velocity,pan,1484);
   }
   // One four-note statement across the three-bar descent: three beats per note.
   for(let i=0;i<4;i++){
    put(0,i*12,'organ',[34,33,36,35][i],12,.20,.12,1487);
    put(0,i*12,'organ',[27,26,29,30][i],12,.20,-.12,1489);
   }
   // At the held melody, gather the counterline into a slowly sinking, fading cluster.
   put(3,0,'organ',[33,34,35,36],80-.2,.175,.12,1488);
   put(3,0,'organ',[26,27,29,30],80-.2,.175,-.12,1491);
   // Quiet plucked sixteenths follow each two-note cell, below the main melody.
   for(let bar=0;bar<3;bar++)for(let slot=0;slot<16;slot++){
    const pair=Math.floor(slot/4)*2,root=lines[bar][pair],neighbor=lines[bar][pair+1];
    const tone=[root-12,neighbor-12,root-5,neighbor][slot%4];
    put(bar,slot,'harp',streetMicroPitch(tone),2.5,.32,slot%2?.28:-.28,1459);
   }
   // Sparse, interlocking plucks turn into a detuned cluster wash through F.
   for(let slot=56;slot<127;slot+=1.5){
    const index=Math.round((slot-56)/1.5),offset=[0,.3,1,-.2,-1,2][index%6];
    const t=dest+slot*step,len=Math.min(5*step,dest+sectionTime*2-.2*step-t);
    if(len>0)events.push([t,'harp',streetMicroPitch(28)+offset+(index%3===0?12:0),len,.23,index%2?.32:-.32,1459]);
   }
   // Crescendo answers: straight sixteenths, eighth triplets, 32nds, then sextuplets.
   for(const [start,count,span,peak]of [[56,8,8,.66],[88,6,8,.72],[104,16,8,.76]]){
    for(let i=0;i<count;i++){
     const slot=start+i*span/count,velocity=.16+(peak-.16)*(i/(count-1))**1.3;
     put(0,slot,'snare',-3,Math.min(.7,span/count*.7),velocity,i%2?.1:-.1,1480);
    }
   }
   // Six quarter-note-triplet clusters per bar rise beneath the descending line.
   for(let i=0;i<18;i++){
    const root=streetMicroPitch(10+i);
    put(0,i*16/6,'organ',[root,root+1,root+2,root+6],1.8,.22+i*.004,i%2?.16:-.16,1481);
   }
   // The rising voice settles into a held dissonance as the melody sustains Db5.
   put(3,0,'organ',[0,1,2,6].map(n=>streetMicroPitch(28)+n),80-.2,.24,0,1482);
   // Stagger neighbouring tones over E's last two beats; hold through all of F.
   put(3,8,'organ',[0,-.2,.3,1,-1,2].map(n=>streetMicroPitch(28)+n),72-.2,.48,0,1458);
   continue;
  }
  const origin=(part==='A'?0:8)*barTime;
  // Reuse the user's established breaks, samples-as-synth voices, and edits.
  for(const original of source.events){
   if(original[0]<origin-.000001||original[0]>=origin+sectionTime-.000001)continue;
   const e=[...original],local=e[0]-origin,slot=Math.round(local/step)%16;
   if(prime&&e[1]==='hat')continue;
   if(part==='D'&&['kick','snare','hat','air'].includes(e[1]))continue;
   if(part!=='A'&&(e[1]==='snare'||(e[1]==='hat'&&slot%4!==0)))continue;
   if((part==='C'||part==='D')&&e[1]==='pad')continue;
   e[0]=dest+local;e[3]=Math.min(e[3],sectionTime-local);
   if(e[1]==='pad'){e[2]=-2;e[4]*=part==='B'?.8:.6;}
   if(e[1]==='bass'){e[2]=-5;e[4]*=.45;}
   if(part!=='A'&&e[1]==='metal')e[4]*=.6;
   events.push(e);
  }
  const windows=[];
  for(const [a,b]of source.activeWindows||[]){const start=Math.max(a,origin)-origin,end=Math.min(b,origin+sectionTime)-origin;if(end>start)windows.push([start,end]);}
  windows.sort((a,b)=>a[0]-b[0]);const merged=[];
  for(const w of windows){const last=merged.at(-1);if(last&&w[0]<=last[1]+.00001)last[1]=Math.max(last[1],w[1]);else merged.push([...w]);}
  activeWindows.push(...merged.map(w=>w.map(t=>t+dest)));
  function add(local,kind,pitch,len,vel,lane=999){
   const window=merged.find(w=>w[0]<=local+.00001&&w[1]>local);if(!window)return;
   const duration=Math.min(len*step,window[1]-local,sectionTime-local);if(duration<.025)return;
   events.push([dest+local,kind,pitch,duration,vel,0,lane]);
  }
  for(let bar=0;bar<4;bar++){
   // The second G5/C#6 statement adds D6/G#6 above the original dyad.
   if(power&&bar===1)events.push([dest+bar*16*step,'organ',prime?[34,40,41,47]:[34,40],16*step,.20,.08,1498]);
   if(power&&prime&&bar===1)events.push([dest+(bar*16+8)*step,'organ',[53,59],8*step,.48,-.08,1498,{swell:true}]);
   if(part==='A'&&bar===0)for(const slot of [0,4]){
    const gate=4*step;
    events.push([dest+slot*step,'bassline',-2,gate+.20,.32,0,1497,{gate}]);
   }
   if(part==='A')for(const slot of [0,2]){
    const t=dest+(bar*16+slot)*step;
    for(let i=events.length-1;i>=0;i--)if(events[i][1]==='kick'&&Math.abs(events[i][0]-t)<1e-7)events.splice(i,1);
    events.push([t,'kick',-2,2*step,1.08,0,1496]);
   }
   const motif=motifs[part==='D'?'C':part][bar%2];
   for(const [noteIndex,[slot,pitch,length,velocity]]of motif.entries()){
    // Last C bar leaves a short breath before the recurring A downbeat.
    if((part==='C'||part==='D')&&bar===3&&slot>=14)continue;
    const nextSlot=motif[noteIndex+1]?.[0]??16;
    const held=part==='C'?Math.min(length*1.9,nextSlot-slot-.2):length;
    const accent=velocity*(part==='A'&&slot===0?1.06:1);
    if(part==='C')for(const half of [0,1])add((bar*16+slot+half*held/2)*step,'bassline',pitch,held/2,accent,999);
    else add((bar*16+slot)*step,'bassline',pitch,held,accent,999);
    if(power&&[0,1,4,5].includes(noteIndex))for(const interval of [7,12])add((bar*16+slot)*step,'bassline',pitch+interval,held,accent*.62,1495);
   }
   if(prime){
    for(let slot=0;slot<16;slot++){
     if(bar%2===1&&slot>=12)continue;
     add((bar*16+slot)*step,'hat',-4,.4,slot%2?.24:.43,1460);
    }
    if(bar%2===1)for(let i=0;i<6;i++)add((bar*16+12+i*2/3)*step,i%3===0?'snare':'hat',-4,.35,i%3===0?.35:.30,1461);
   }
   if(part!=='A'&&part!=='D')add((bar*16+8)*step,'snare',-2,2,.85);
   if(part==='D'){
    // Original cathedral-organ progression: a G pedal under chromatic upper voices.
    // Minor -> diminished -> altered dominant -> suspended, crushed dominant.
    // The final dominant leaves tension hanging for the return to G in A.
    const chord=[[-14,-2,5,13,17],[-14,-2,4,10,16],[-7,0,9,15,18],[-7,0,8,9,14,15,18]][bar];
    add(bar*16*step,'organ',chord,15,.46+bar*.035,1400);
    if(bar===3){
     const held=events.at(-1),entry=streetMicroPitch(40)-12;
     held[3]=18*step;
     held[7]={transition:true,landing:16*step,targets:[-36,-29,-24,-17,-12,-5,0].map(interval=>entry+interval)};
    }
    // A restrained answering voice suggests contrapuntal motion over the held harmony.
    for(const [slot,pitch]of [[6,[17,16,18,17][bar]],[10,[13,10,15,16][bar]]]){
     add((bar*16+slot)*step,'organ',[pitch],3.8,.24+bar*.015,1406);
    }
    add(bar*16*step,'metal',-2,5,.32+bar*.04,1404);
    // Driving backbeat replaces the earlier half-time pocket, still in 4/4.
    const turnaround=bar===3;
    for(const slot of (bar%2?[0,3,6,10]:[0,6,10]))add((bar*16+slot)*step,'kick',-2,2,.78,1410);
    for(const slot of [4,12])if(!turnaround||slot<12)add((bar*16+slot)*step,'snare',-2,1.5,.78,1411);
    for(const slot of [2,6,8,10,14])if(!turnaround||slot<8)add((bar*16+slot)*step,'hat',-3,.5,slot===8?.28:.42,1412);
    if(turnaround){
     // Triplet pickup into a six-stroke roll; a brief gap exposes A's downbeat.
     for(let i=0;i<3;i++)add((bar*16+8+i*4/3)*step,'metal',[-2,1,4][i],.7,.30+i*.04,1413);
     for(let i=0;i<6;i++)add((bar*16+12+i*2/3)*step,i%3===0?'snare':'air',-4+i,.40,.40+i*.065,1414);
    }
   }
   if(part==='C'){
    if(bar===0){
     // Five adjacent high notes: E5, F5, F#5, G5, G#5.
     for(let i=0;i<5;i++)events.push([dest,'lahopterix',31+i,sectionTime-step,.055,(i-2)*.08,1520,{ringHz:47}]);
    }
    // Rising dissonant texture builds drama without changing the bass motif.
    add(bar*16*step,'pad',-2,12,(.16+bar*.045)*1.6,1100);
    add((bar*16+4)*step,'metal',4,5,.15+bar*.045,1101);
    if(bar>=2)add((bar*16+12)*step,'metal',16,2,.23+bar*.025,1102);
   }
  }
  if(part==='C'||part==='D'){
   const cut=dest+sectionTime-step*(part==='D'?.2:1);
   for(let i=events.length-1;i>=0;i--){const e=events[i];if(e[0]<dest)break;if(e[7]?.transition)continue;if(e[0]>=cut)events.splice(i,1);else e[3]=Math.min(e[3],cut-e[0]);}
  }
 }
 const upperRhodes=events.filter(e=>[1400,1406,1407].includes(e[6])).map(e=>{
  const upper=[...e];upper[2]=Array.isArray(e[2])?e[2].map(n=>n+12):e[2]+12;upper[4]*=.65;upper[8]='street-D-octave';if(e[7]?.transition)upper[7]={...e[7],targets:e[7].targets.map(n=>n+12)};return upper;
 });
 return {duration:sectionTime*form.length,form,sectionBars:4,activeWindows,events:[...events,...upperRhodes].filter(e=>e[1]!=='metal').sort((a,b)=>a[0]-b[0])};
}

export function arrangeStreet(source){
 const cycle=arrangeStreetCycle(source),step=60/188/4,start=cycle.duration*2,duration=start+128*step;
 const repeat=[];
 for(const original of cycle.events){
  const e=[original[0]+cycle.duration,...original.slice(1)];
  if(e[6]===1498){
   if(e[7]?.swell){
    // Keep triplet entries; hold the first swell beneath the higher entry until the bar ends.
    const span=e[3]/3;
    repeat.push([e[0]+span,'organ',[53,59],2*span,.48,-.08,1498,{swell:true,swellRise:span*.70,sustain:true}]);
    repeat.push([e[0]+2*span,'organ',[51,59,66,71],span,.48,.08,1498,{swell:true}]);
    continue;
   }
   e[2]=[39,47]; // C6/G#6, only in the second pass.
   if(original[0]<16*16*step)e[7]={ringHz:61};
  }
  repeat.push(e);
  if(e[6]===1520){const upper=[...e];upper[2]+=12;repeat.push(upper);}
 }
 const events=[...cycle.events,...repeat];
 // D2 fingerpicking: thumb-led lower notes alternate with upper-string answers.
 // Use Rhodesia's full harmony, with natural timing and touch inside each bar.
 for(const [chordIndex,chord] of repeat.filter(e=>e[6]===1400&&e[8]!=='street-D-octave').entries()){
  const pitchClasses=new Set(chord[2].flatMap(n=>[-12,-2,21,5].map(interval=>((n+interval)%12+12)%12)));
  // Revoice the same harmony in progressively higher, overlapping registers.
  const floor=chordIndex*7,pitches=Array.from({length:25},(_,i)=>floor+i).filter(n=>pitchClasses.has(n%12));
  const voicing=Array.from({length:6},(_,i)=>pitches[Math.round(i*(pitches.length-1)/5)]);
  const picking=[0,2,4,2,1,3,5,3],touch=[1,.76,.88,.70,.93,.78,.91,.67];
  for(let i=0;i<picking.length;i++){
   const string=picking[i],delay=i*2*step+[0,.009,-.004,.006,0,.011,-.003,.005][i];
   // Release before the next chord; the final bar cannot spill into E2.
   const registerLevel=[1,.90,.70,.52][chordIndex];
   events.push([chord[0]+delay,'polysynth',voicing[string],16*step-delay-.015,.17*touch[i]*registerLevel,-.22+string*.088,1550,{strumStart:chord[0]}]);
  }
 }
 // Four finite, tempo-synced delay taps; no feedback tail can cross into E2.
 const harpEnd=cycle.duration+28*16*step-.015;
 for(const note of events.filter(e=>e[6]===1550)){
  for(let tap=1;tap<=4;tap++){
   const onset=note[0]+tap*3*step,remaining=harpEnd-onset;
   if(remaining<.025)continue;
   events.push([onset,...note.slice(1,3),Math.min(note[3],remaining),note[4]*.52**tap,note[5],1550,{...note[7],echoTap:tap}]);
  }
 }
 // C2 only: eight much quieter sweeps gather into chromatic and microtonal friction.
 const c2Start=cycle.duration+20*16*step,c2End=c2Start+64*step;
 const sweepPitches=[38,38.35,39,39.7,40,40.3,41,42.15];
 for(let i=0;i<sweepPitches.length;i++){
  const t=c2Start+i*4*step;
  events.push([t,'polysynth',sweepPitches[i],c2End-t-.04,.02,(i-3.5)*.06,1540,{from:[-7,6,-5,4,-3,6,-6,3][i],landing:14*step}]);
 }
 const put=(bar,slot,kind,pitch,length,velocity,pan=0)=>{
  const t=start+(bar*16+slot)*step;
  events.push([t,kind,pitch,Math.min(length*step,duration-step*.2-t),velocity,pan,1530]);
 };
 // G: double-kick sixteenths, blast-like snare answers and chromatic descent.
 for(let bar=0;bar<8;bar++){
  const variation=bar>=4,closing=bar===7;
  // Alternate G1/C#2; G2 adds tritone, octave and octave-plus-tritone layers.
  const gate=4*step;
  const biteRoot=bar%2===0?-2:4;
  events.push([start+bar*16*step,'bassline',biteRoot,gate+.20,.52,0,1497,{gate,bite:true}]);
  if(variation)for(const [interval,level]of [[6,.22],[12,.18],[18,.14]])events.push([start+bar*16*step,'bassline',biteRoot+interval,gate+.20,level,0,1497,{gate,bite:true,harmony:true,interval}]);
  // Two half-note Rhodesia tones per bar; repeat G/F#/A/G# twice in G and G2.
  for(let half=0;half<2;half++){
   const onset=start+(bar*16+half*8)*step,pitch=[34,33,36,35][(bar*2+half)%4];
   events.push([onset,'organ',pitch,8*step,.20,.12,1487]);
   events.push([onset,'thanathoa',pitch,8*step,.30,-.12,1551,{section:variation?'G2':'G',rhodesiaDouble:true}]);
   events.push([onset,'thanathoa',pitch-24,8*step,.38,.12,1552,{section:variation?'G2':'G',rhodesiaDouble:true,lowerDouble:true}]);
   events.push([onset,'thanathoa',pitch-24,8*step,.24,half===0?-1:1,1553,{section:variation?'G2':'G',rhodesiaDouble:true,alternatingPan:true}]);
  }
  // Octave-up quarter notes above the slower melody.
  for(let beat=0;beat<4;beat++)events.push([
   start+(bar*16+beat*4)*step,'organ',[46,45,48,47][beat],4*step,.16,-.14,1487,undefined,'street-G-high'
  ]);
  // Rising voicings stay below the G5/F#5/A5/G#5 melody:
  // C3/F#3, D3/G#3, F#3/D4/E4, G#3/F4/G4.
  const chord=[[3,9],[5,11],[9,17,19],[11,20,22]][bar%4];
  // G/G2 follow D2's thumb-led picking, using the sounding Rhodesia harmony.
  const harpClasses=new Set(chord.flatMap(n=>[-12,-2,21,5].map(interval=>((n+interval)%12+12)%12)));
  // Continue the register climb through G2 instead of returning to G's low strings.
  const harpFloor=bar*7,harpPitches=Array.from({length:25},(_,i)=>harpFloor+i).filter(n=>harpClasses.has(n%12));
  const harpVoicing=Array.from({length:6},(_,i)=>harpPitches[Math.round(i*(harpPitches.length-1)/5)]);
  const harpStart=start+bar*16*step,harpStop=duration-.015;
  for(const [i,string] of [0,2,4,2,1,3,5,3].entries()){
   const offset=i*2*step+[0,.009,-.004,.006,0,.011,-.003,.005][i];
   const note=[harpStart+offset,'polysynth',harpVoicing[string],16*step-offset-.015,
    .17*[1,.76,.88,.70,.93,.78,.91,.67][i]*[1,.87,.65,.46,.38,.31,.25,.20][bar],-.22+string*.088,1550,{strumStart:harpStart,section:variation?'G2':'G'}];
   events.push(note);
   // Same dotted-eighth delay as D2: four taps, each at 52% of the last.
   for(let tap=1;tap<=4;tap++){
    const onset=note[0]+tap*3*step,remaining=harpStop-onset;
    if(remaining<.025)continue;
    events.push([onset,...note.slice(1,3),Math.min(note[3],remaining),note[4]*.52**tap,note[5],1550,{...note[7],echoTap:tap}]);
   }
  }
  for(let octave=0;octave<3;octave++)events.push([
   start+bar*16*step,'organ',chord.map(n=>n+octave*12),16*step,.22,[.03,-.08,.10][octave],1489,
   octave===2?{swell:true}:undefined,'street-G-chords'
  ]);
  // All four G2 chords swell two octaves above, approaching from 45 cents below.
  if(variation)for(const note of chord)for(const octave of (bar>=6?[24,12]:[24]))events.push([
   start+bar*16*step,'lahopterix',note+octave,16*step,bar>=6?.065:.10,bar%2===0?-.60:.60,1531
  ]);
  for(let slot=0;slot<16;slot++){
   put(bar,slot,'bassline',(bar%2===0?10:6)-slot+(variation&&slot>=12?12:0),.82,slot%4===0?.78:.60);
   put(bar,slot,'kick',-5,.85,slot%4===0?.82:.62);
  }
  for(const slot of (variation?[2,4,7,10,12,15]:bar%2===0?[4,6,12,14]:[2,4,6,10,12,14]))if(!closing||slot<8)put(bar,slot,'snare',-2,.9,slot%4===0?.78:.53);
  // G2 sixteenth hats remain audible over the dense mix, then stop for the final fill.
  for(let slot=0;slot<(closing?8:16);slot+=variation?1:2)put(bar,slot,'hat',-4,variation?.65:.4,variation?(slot%2?.72:.94):(slot%2?.21:.32),.2);
  if(closing)for(let i=0;i<8;i++)put(bar,8+i,i<2||i>=6?'snare':'tom',i<2||i>=6?-2:-3-(i-2)*2,.8,.57+i*.035,(i-3.5)*.035);
  put(bar,0,'cymbal',-4,5,.23,-.2);
  if(bar%2===0)put(bar,0,'polysynth',variation?[-2,4,10,11,17]:bar===0?[-2,5,10,11,16]:[-2,4,9,10,15],31.8,bar===0?.24:.28,bar%4===0?-.12:.12);
 }
 return {duration,sectionBars:4,form:[...cycle.form,...cycle.form.map(p=>p[0]+'2'+p.slice(1)),'G','G2'],
  activeWindows:[...cycle.activeWindows,...cycle.activeWindows.map(w=>w.map(t=>t+cycle.duration)),[start,duration]],
  events:events.sort((a,b)=>a[0]-b[0])};
}

// Original 110 BPM industrial synth song: rapid minor bass, half-time drums.
export function createTitleTheme(){
 const form=['A','B',"A'","B'"];
 const bpm=110,step=60/bpm/4,duration=form.length*4*16*step,events=[];
 const riffs=[[-5,-5,7,-5,-2,-5,2,5,-5,-5,2,-2,5,2,-5,7],
              [-5,-5,2,-5,5,2,-2,-5,-5,7,5,2,-2,2,-5,-5]];
 function add(bar,slot,kind,pitch,len,velocity,pan=0,lane=0){
  const time=(bar*16+slot)*step;
  events.push([time,kind,pitch,Math.min(len*step,duration-time),velocity,pan,lane]);
 }
 const held=[
  [[0,-5,7,.72],[8,2,5.5,.64],[14,5,.7,.51],[15,2,.6,.48]],
  [[0,-2,10,.69],[12,-5,3.5,.72]],
  [[0,2,7,.68],[8,5,5.5,.62],[14,2,.7,.50],[15,-2,.6,.48]],
  [[0,-2,6.5,.67],[8,-5,5.5,.75]]
 ];
 for(let bar=0;bar<form.length*4;bar++){
  const part=form[Math.floor(bar/4)],partB=part==='B'||part==="B'",fill=bar%4===3,riff=riffs[bar%2];
  if(partB){
   for(const [slot,pitch,len,vel]of held[bar%4])add(bar,slot,'bassline',pitch,len,vel,0,1201);
  }else if(part==='A'){
   for(let slot=0;slot<16;slot+=2)add(bar,slot,'bassline',riff[slot],1.55,slot%4===0?.75:.60,0,bar===0&&slot===0?1202:1200);
  }else for(let slot=0;slot<16;slot++){
   if([3,7,11].includes(slot))continue;
   add(bar,slot,'bassline',riff[slot],slot%4===0?.8:.55,slot%4===0?.75:.51,0,1200);
  }
  for(const slot of (bar%2?[0,6,12]:[0,6]))if(!fill||slot<8)add(bar,slot,'kick',-2,2.5,.72);
  if(!fill)add(bar,8,'snare',-3,1.5,.64);
  if(part==='A')for(const slot of [0,4,8,12])add(bar,slot,'hat',-4,.60,slot===0?.56:.46,.18,1212);
  // B-prime adds accented sixteenths, leaving space for the fourth-bar fill.
  const hats=part==='A'?[]:part==="B'"?Array.from({length:16},(_,i)=>i):[2,6,10,14];
  for(const slot of hats)if(!fill||slot<8)add(bar,slot,'hat',-4,part==="B'"?.60:.35,part==="B'"?(slot%4===2?.85:slot%2===0?.64:.43):.40,.2);
  if(fill){
   // Beat three in triplets, beat four in sextuplets: the bar stays 4/4.
   for(let i=0;i<3;i++)add(bar,8+i*4/3,'snare',-3,.65,.42+i*.08,i%2?-.12:.12,1210);
   for(let i=0;i<6;i++)add(bar,12+i*2/3,i%3===0?'snare':'metal',[-5,-2,2,-5,2,5][i],.38,.28+i*.045,i%2?-.22:.22,1211);
  }
  if(bar%2===0){
   add(bar,0,'pad',-5,8,.34,-.30);
   add(bar,4,'pad',bar%4===0?-2:5,8,.23,.30);
  }
  if(bar%4===0)add(bar,0,'metal',-5,5,.27,-.25);
 }
 // Bar six: two eighth-note snare flams on beat three, four sixteenths on beat four.
 // Each quiet grace stroke precedes its main eighth by 25 ms.
 for(let i=events.length-1;i>=0;i--)if(events[i][1]==='snare'&&events[i][0]>=88*step&&events[i][0]<96*step)events.splice(i,1);
 for(const slot of [8,10]){
  add(5,slot-.025/step,'snare',-3,.25,.18,0,1214);
  add(5,slot,'snare',-3,.8,.62,0,1214);
 }
 for(const [i,slot]of [12,13,14,15].entries())add(5,slot,'snare',-3,.65,.40+i*.065,0,1214);
 // The opening and bar-two pickups remain; no extra pickup at the loop end.

 // Bar two also ends with the same two sixteenths, replacing its last eighth.
 const firstPickup=30*step;
 for(let i=events.length-1;i>=0;i--){
  const e=events[i];if(e[1]!=='bassline'||e[0]>=32*step)continue;
  if(e[0]>=firstPickup-1e-8)events.splice(i,1);
  else e[3]=Math.min(e[3],firstPickup-e[0]);
 }
 for(const slot of [14,15]){add(1,slot,'bassline',riffs[0][0],.8,.66,0,1200);add(1,slot,'snare',-3,.7,.44,0,1213);}
 const pickupDuration=2*step;
 const pickupEvents=[...[-2,-1].map(slot=>[slot*step,'bassline',riffs[0][0],.8*step,.66,0,1200]),...[-2,-1].map(slot=>[slot*step,'snare',-3,.7*step,.44,0,1213])].sort((a,b)=>a[0]-b[0]);
 // Keep the final sextuplet, then a tiny breath before the downbeat.
 const end=duration-step*.2;
 return {bpm,duration,form,sectionBars:4,pickupDuration,pickupEvents,events:events.filter(e=>e[0]<end).map(e=>{e[3]=Math.min(e[3],end-e[0]);return e;}).sort((a,b)=>a[0]-b[0])};
}

// Drum phrases from the user-supplied MIDI: source bars 3-10, 11-18, 27-34, 31-38.
export const HOSPITAL_DRUMS=[[0.0,35,110],[0.0,42,100],[0.5,42,100],[0.75,42,100],[1.0,35,110],[1.0,40,110],[1.0,42,100],[1.5,42,100],[1.75,42,100],[2.0,35,110],[2.0,42,100],[2.5,42,100],[2.75,42,100],[3.0,35,110],[3.0,40,110],[3.0,42,100],[3.5,42,100],[3.75,42,100],[4.0,35,110],[4.0,42,100],[4.5,42,100],[4.75,42,100],[5.0,35,110],[5.0,40,110],[5.0,42,100],[5.5,42,100],[5.75,42,100],[6.0,35,110],[6.0,42,100],[6.5,42,100],[6.75,42,100],[7.0,35,110],[7.0,40,110],[7.0,42,100],[7.5,42,100],[7.75,42,100],[8.0,35,110],[8.0,42,100],[8.5,42,100],[8.75,42,100],[9.0,35,110],[9.0,40,110],[9.0,42,100],[9.5,42,100],[9.75,42,100],[10.0,35,110],[10.0,42,100],[10.5,42,100],[10.75,42,100],[11.0,35,110],[11.0,40,110],[11.0,42,100],[11.5,42,100],[11.75,42,100],[12.0,35,110],[12.0,42,100],[12.5,42,100],[12.75,42,100],[13.0,35,110],[13.0,40,110],[13.0,42,100],[13.5,42,100],[13.75,42,100],[14.0,35,110],[14.0,42,100],[14.5,42,100],[14.75,42,100],[15.0,35,110],[15.0,40,110],[15.0,42,100],[15.5,42,100],[15.75,42,100],[16.0,35,110],[16.0,42,100],[16.5,42,100],[16.75,42,100],[17.0,35,110],[17.0,40,110],[17.0,42,100],[17.5,42,100],[17.75,42,100],[18.0,35,110],[18.0,42,100],[18.5,42,100],[18.75,42,100],[19.0,35,110],[19.0,40,110],[19.0,42,100],[19.5,42,100],[19.75,42,100],[20.0,35,110],[20.0,42,100],[20.5,42,100],[20.75,42,100],[21.0,35,110],[21.0,40,110],[21.0,42,100],[21.5,42,100],[21.75,42,100],[22.0,35,110],[22.0,42,100],[22.5,42,100],[22.75,42,100],[23.0,35,110],[23.0,40,110],[23.0,42,100],[23.5,42,100],[23.75,42,100],[24.0,35,110],[24.0,42,100],[24.5,42,100],[24.75,42,100],[25.0,35,110],[25.0,40,110],[25.0,42,100],[25.5,42,100],[25.75,42,100],[26.0,35,110],[26.0,42,100],[26.5,42,100],[26.75,42,100],[27.0,35,110],[27.0,40,110],[27.0,42,100],[27.5,42,100],[27.75,42,100],[28.0,35,110],[28.0,42,100],[28.5,42,100],[28.75,42,100],[29.0,35,110],[29.0,40,110],[29.0,42,100],[29.5,42,100],[29.75,42,100],[30.0,35,110],[30.0,42,100],[30.5,42,100],[30.75,42,100],[31.0,35,110],[31.0,40,110],[31.0,42,100],[31.5,42,100],[31.75,42,100],[32.0,35,110],[32.0,42,100],[32.5,35,110],[32.5,42,100],[33.0,40,110],[33.0,57,100],[34.0,35,110],[34.0,42,100],[34.5,35,110],[34.5,42,100],[35.0,40,110],[35.0,57,100],[36.0,35,110],[36.0,55,100],[36.0,42,100],[36.5,35,110],[36.5,42,100],[37.0,40,110],[37.0,42,100],[37.5,35,110],[37.5,55,100],[37.5,42,100],[38.0,42,100],[38.5,35,110],[38.5,42,100],[39.0,40,110],[39.0,42,100],[39.5,42,100],[40.0,35,110],[40.0,42,100],[40.5,35,110],[40.5,42,100],[41.0,40,110],[41.0,57,100],[42.0,35,110],[42.0,42,100],[42.5,35,110],[42.5,42,100],[43.0,40,110],[43.0,57,100],[44.0,35,110],[44.0,55,100],[44.0,42,100],[44.5,35,110],[44.5,42,100],[45.0,40,110],[45.0,42,100],[45.5,35,110],[45.5,55,100],[45.5,42,100],[46.0,42,100],[46.5,35,110],[46.5,42,100],[47.0,40,110],[47.0,42,100],[47.5,40,110],[47.5,42,100],[47.75,40,110],[48.0,35,110],[48.0,42,100],[48.5,35,110],[48.5,42,100],[49.0,40,110],[49.0,57,100],[50.0,35,110],[50.0,42,100],[50.5,35,110],[50.5,42,100],[51.0,40,110],[51.0,57,100],[52.0,35,110],[52.0,55,100],[52.0,42,100],[52.5,35,110],[52.5,42,100],[53.0,40,110],[53.0,42,100],[53.5,35,110],[53.5,55,100],[53.5,42,100],[54.0,42,100],[54.5,35,110],[54.5,42,100],[55.0,40,110],[55.0,42,100],[55.5,42,100],[56.0,35,110],[56.0,42,100],[56.5,35,110],[56.5,42,100],[57.0,40,110],[57.0,57,100],[58.0,35,110],[58.0,42,100],[58.5,35,110],[58.5,42,100],[59.0,40,110],[59.0,57,100],[60.0,35,110],[60.0,55,100],[60.0,42,100],[60.5,35,110],[60.5,42,100],[61.0,40,110],[61.0,42,100],[61.5,35,110],[61.5,55,100],[61.5,42,100],[62.0,42,100],[62.5,35,110],[62.5,42,100],[63.0,40,110],[63.0,42,100],[63.5,40,110],[63.5,42,100],[63.75,40,110],[64.0,35,110],[64.0,57,100],[64.0,42,100],[64.5,42,100],[65.0,40,110],[65.0,42,100],[65.5,42,100],[66.0,35,110],[66.0,42,100],[66.5,35,110],[66.5,42,100],[67.0,40,110],[67.0,42,100],[67.5,42,100],[68.0,35,110],[68.0,55,100],[68.0,42,100],[68.5,42,100],[69.0,40,110],[69.0,55,100],[69.0,42,100],[69.5,42,100],[70.0,35,110],[70.0,42,100],[70.5,35,110],[70.5,42,100],[71.0,40,110],[71.0,42,100],[71.5,42,100],[72.0,35,110],[72.0,57,100],[72.0,42,100],[72.5,42,100],[73.0,40,110],[73.0,42,100],[73.5,42,100],[74.0,35,110],[74.0,42,100],[74.5,35,110],[74.5,42,100],[75.0,40,110],[75.0,42,100],[75.5,35,110],[75.5,42,100],[76.0,42,100],[76.5,35,110],[76.5,42,100],[77.0,40,110],[77.0,42,100],[77.5,42,100],[78.0,35,110],[78.0,42,100],[78.5,35,110],[78.5,42,100],[79.0,40,110],[79.0,42,100],[79.25,40,110],[79.5,40,110],[79.5,42,100],[80.0,35,110],[80.0,57,100],[80.0,42,100],[80.5,42,100],[81.0,40,110],[81.0,42,100],[81.5,42,100],[82.0,35,110],[82.0,42,100],[82.5,35,110],[82.5,42,100],[83.0,40,110],[83.0,42,100],[83.5,42,100],[84.0,35,110],[84.0,55,100],[84.0,42,100],[84.5,42,100],[85.0,40,110],[85.0,55,100],[85.0,42,100],[85.5,42,100],[86.0,35,110],[86.0,42,100],[86.5,35,110],[86.5,42,100],[87.0,40,110],[87.0,42,100],[87.5,42,100],[88.0,35,110],[88.0,57,110],[88.0,42,100],[88.5,42,100],[88.75,42,100],[89.0,40,110],[89.0,42,100],[89.5,42,100],[89.75,42,100],[90.0,42,100],[90.5,35,110],[90.5,42,100],[90.75,42,100],[91.0,40,110],[91.0,42,100],[91.5,35,110],[91.5,42,100],[91.75,42,100],[92.0,42,100],[92.5,35,110],[92.5,42,100],[92.75,42,100],[93.0,40,110],[93.0,42,100],[93.5,42,100],[93.75,42,100],[94.0,42,100],[94.5,35,110],[94.5,42,100],[94.75,42,100],[95.0,40,110],[95.0,42,100],[95.5,35,110],[95.5,42,100],[95.75,42,100],[96.0,35,110],[96.0,57,100],[96.0,42,100],[96.5,42,100],[97.0,40,110],[97.0,42,100],[97.5,42,100],[98.0,35,110],[98.0,42,100],[98.5,35,110],[98.5,42,100],[99.0,40,110],[99.0,42,100],[99.5,42,100],[100.0,35,110],[100.0,55,100],[100.0,42,100],[100.5,42,100],[101.0,40,110],[101.0,55,100],[101.0,42,100],[101.5,42,100],[102.0,35,110],[102.0,42,100],[102.5,35,110],[102.5,42,100],[103.0,40,110],[103.0,42,100],[103.5,42,100],[104.0,35,110],[104.0,57,110],[104.0,42,100],[104.5,42,100],[104.75,42,100],[105.0,40,110],[105.0,42,100],[105.5,42,100],[105.75,42,100],[106.0,42,100],[106.5,35,110],[106.5,42,100],[106.75,42,100],[107.0,40,110],[107.0,42,100],[107.5,35,110],[107.5,42,100],[107.75,42,100],[108.0,42,100],[108.5,35,110],[108.5,42,100],[108.75,42,100],[109.0,40,110],[109.0,42,100],[109.5,42,100],[109.75,42,100],[110.0,42,100],[110.5,35,110],[110.5,42,100],[110.75,42,100],[111.0,40,110],[111.0,42,100],[111.5,35,110],[111.5,42,100],[111.75,42,100],[112.0,35,110],[112.0,42,100],[112.5,35,110],[112.5,42,100],[112.75,42,100],[113.0,40,110],[113.0,42,100],[113.5,35,110],[113.5,42,100],[113.75,42,100],[114.0,35,110],[114.0,42,100],[114.5,35,110],[114.5,42,100],[114.75,42,100],[115.0,40,110],[115.0,42,100],[115.5,35,110],[115.5,42,100],[115.75,42,100],[116.0,40,110],[116.0,57,100],[116.0,42,100],[116.5,35,110],[116.5,42,100],[117.0,35,110],[117.0,42,100],[117.5,40,110],[117.5,57,100],[117.5,42,100],[118.0,35,110],[118.0,42,100],[118.5,35,110],[118.5,42,100],[119.0,40,110],[119.0,57,100],[119.0,42,100],[119.5,35,110],[119.5,42,100],[120.0,35,110],[120.0,42,100],[120.5,40,110],[120.5,57,100],[120.5,42,100],[121.0,35,110],[121.0,42,100],[121.5,35,110],[121.5,42,100],[122.0,48,110],[122.0,40,110],[122.0,57,100],[122.0,42,100],[122.25,48,110],[122.5,35,110],[122.5,48,110],[122.5,42,100],[122.75,48,110],[123.0,45,110],[123.0,40,110],[123.0,57,100],[123.0,42,100],[123.25,45,110],[123.5,35,110],[123.5,45,110],[123.5,42,100],[123.75,45,110],[124.0,40,110],[124.0,57,100],[124.0,42,100],[124.5,35,110],[124.5,42,100],[125.0,35,110],[125.0,42,100],[125.5,40,110],[125.5,57,100],[125.5,42,100],[126.0,35,110],[126.0,42,100],[126.5,35,110],[126.5,42,100],[127.0,40,110],[127.0,42,100],[127.5,35,110],[127.5,57,100],[127.5,42,100]];

export function createHospitalPhrase(){
 const bpm=170,step=60/bpm/4,form=['A'],duration=8*16*step,events=[];
 function add(bar,slot,kind,pitch,len,vel,pan=0,lane=1500){
  const time=(bar*16+slot)*step;
  events.push([time,kind,pitch,Math.min(len*step,duration-time),vel,pan,lane]);
 }
 // MIDI percussion keys select drum types, not a copied pitched melody.
 for(const [beat,key,velocity]of HOSPITAL_DRUMS){
  if(beat>=32)continue;
  const kick=key===35||key===36,snare=key===38||key===40,hat=key===42||key===44||key===46;
  const tom=[41,43,45,47,48,50].includes(key);
  const kind=kick?'kick':snare?'snare':hat?'hat':tom?'tom':'cymbal';
  const pitch=kick?-3:snare?-2:hat?-4:tom?(key-45)*1.5:key===55?3:-2;
  const level=kick?.84:snare?.79:hat?.55:tom?.75:.42;
  events.push([beat*60/bpm,kind,pitch,Math.min(kick?.26:snare?.14:hat?.055:tom?.23:.55,duration-beat*60/bpm),level*velocity/110,kick?0:tom?(key-45)*.06:hat?.23:-.20,1600+key]);
 }
 // Fast, repeating arpeggios link minor-major, augmented and diminished colours.
 const harmony={EmM:[-5,-2,2,6],Eaug:[-5,-1,3],Faug:[-4,0,4],Fdim:[-3,0,3,6],Balt:[2,6,10,12]};
 const changes=[
  ['EmM','EmM','Eaug','Eaug','EmM','EmM','Eaug','Eaug'],
  ['Eaug','Eaug','Faug','Faug','Eaug','Eaug','Fdim','Fdim'],
  ['EmM','EmM','Fdim','Fdim','Faug','Faug','Balt','Balt'],
  ['Eaug','Eaug','Faug','Faug','Fdim','Balt','Balt','Balt']
 ];
 const contours=[
  [0,1,2,1,0,2,1,2,0,1,2,1,0,2,1,2],
  [0,1,2,0,1,2,1,0,0,1,2,0,2,1,2,1],
  [0,2,1,2,0,1,2,1,0,2,1,2,0,1,2,1],
  [0,1,2,1,0,1,2,0,0,2,1,2,0,1,2,1]
 ];
 for(let bar=0;bar<8;bar++){
  const section=Math.floor(bar/8),local=bar%8,chord=harmony[changes[section][local]];
  // Sixteenths stay in the bass register; octave peaks mark the repeated figure.
  contours[section].forEach((index,slot)=>{
   if(local===7&&slot>=14)return; // let the existing drum turnaround speak
   const tone=chord[index]+((slot===3||slot===11)&&section!==2?12:0);
   add(bar,slot,'bassline',tone,slot%4===0?.86:.67,slot%4===0?.76:slot%2===0?.61:.49,0,1500);
  });
  // The harmony sustains while the bass moves, so the tension has a clear shape.
  add(bar,0,'organ',chord,15,section===3?.18:.14,0,1504);
  // Broad two-bar swells; shorten them when the final build changes chords each bar.
  if(bar%2===0||(section===3&&local>=5)){
   const held=section===3&&local>=4?15.8:31.8;
   add(bar,0,'polysynth',chord,held,section===3?.54:.46,bar%4===0?-.12:.12,1505);
  }
  if(bar%2===1){
   add(bar,8,'pad',chord.at(-1),4,.29,-.20,1502);
   add(bar,13,'pad',chord[1],2,.25,.20,1502);
  }
 }
 // Sparse held upper notes bridge neighbouring swells rather than adding another riff.
 for(const [bar,slot,pitch,len,pan]of [[1,8,19,40,-.16]])
  add(bar,slot,'lead',pitch,len,.18,pan,1506);
 return {bpm,duration,form,sectionBars:8,events:events.sort((a,b)=>a[0]-b[0])};
}

// Four eight-bar parts; primes add fast hats, and B-prime doubles the bass rhythm.
export function createHospitalTheme(){
 const base=createHospitalPhrase(),events=[],form=['A',"A'",'B',"B'"],step=60/base.bpm/4;
 for(let part=0;part<4;part++){
  const offset=part*base.duration;
  for(const source of base.events){
   if(part>=2&&(source[6]===1500||source[1]==='lead'||source[6]===1502))continue;
   const e=[...source];e[0]+=offset;
   if(e[1]==='lead')e[7]=part;
   events.push(e);
   if(part===0&&e[1]==='lead'){events.push([e[0],'organ',e[2],e[3],.16,e[5],1510]);events.push([e[0],'lahopterix',e[2]+12,e[3],.30,-e[5],1511]);}
  }
  if(part>=2)for(let bar=0;bar<8;bar++){
   const chord=base.events.find(e=>e[6]===1504&&Math.abs(e[0]-bar*16*step)<1e-7)[2];
   // A 3+3+2 eighth-note accent cycle drives an octave-pedal riff, with a fourth-bar answer.
   const root=chord[0],answer=bar%4===3;
   const phrase=[[0,root,1.5],[2,root+12,1.2],[4,root,1.2],[6,root,1.5],[8,chord[2],1.2],[10,root+12,1.2],[12,answer?chord[1]:root,1.5],[14,answer?chord[2]:root+12,1.3]];
   for(const [slot,pitch,length]of phrase){
    if(part===2&&bar===0&&slot===0){
     for(const half of [0,1])events.push([offset+half*length/2*step,'bassline',pitch,length/2*step,.78,0,1507]);
    }else{
    events.push([offset+(bar*16+slot)*step,'bassline',pitch,(part===3?.78:length)*step,[0,6,12].includes(slot)?.78:.57,0,1507]);
    }
    if(part===3){
     const passing=chord[(slot/2+bar)%3];
     events.push([offset+(bar*16+slot+1)*step,'bassline',passing,.65*step,.49,0,1507]);
    }
   }
  }
  if(part>=2){
   // Four two-bar statements: original, semitone up, original, major third down.
   for(const [bar,slot,pitch,length,pan]of [[0,8,26,28,-.15],[2,8,27,28,-.15],[4,8,26,28,-.15],[6,8,22,21,-.08]])
    events.push([offset+(bar*16+slot)*step,'lead',pitch,length*step,.14,pan,1506,2]);
  }

  if(part%2===1)for(let bar=0;bar<8;bar++)for(let slot=0;slot<16;slot++){
   const t=(bar*16+slot)*step;
   // Fill empty sixteenth positions without doubling existing reference hats.
   if(base.events.some(e=>e[1]==='hat'&&Math.abs(e[0]-t)<1e-7))continue;
   events.push([offset+t,'hat',-4,.045,slot%2?.38:.47,.2,1590]);
  }
 }
 // Alternate spacious eighths, fast tuplets, a sparse syncopated answer, and a fast final roll.
 const fills=[[6],[0,4/3,8/3,4,14/3,16/3,6,20/3,22/3],[0,3,6],[0,2/3,4/3,2,8/3,10/3,4,5,6,6.5,7,7.5]];
 for(let part=0;part<4;part++){
  const start=(part+1)*base.duration-8*step,end=(part+1)*base.duration;
  // The first ending adds one offbeat; retain its regular beat-four snare.
  for(let i=events.length-1;part>0&&i>=0;i--)if(events[i][1]==='snare'&&events[i][0]>=start-1e-8&&events[i][0]<end-1e-8)events.splice(i,1);
  fills[part].forEach((slot,i)=>events.push([start+slot*step,'snare',-2,Math.min(.14,end-(start+slot*step)),(fills[part].length===1?.79:.3+.48*i/(fills[part].length-1)),i%2?.09:-.09,1591]));
 }
 // Repeat the four parts with new endings; the approved bass/lead phrases stay recognizable.
 const firstCycle=base.duration*4;
 const starred=events.filter(e=>e[6]!==1591).map(e=>[e[0]+firstCycle,...e.slice(1)]);
 const starFills=[[0,3,6],[0,2,4,14/3,16/3,6,20/3,22/3],[1,4,7],[0,4/3,8/3,4,5,6,7]];
 for(let part=0;part<4;part++){
  const end=firstCycle+(part+1)*base.duration,start=end-8*step;
  for(let i=starred.length-1;i>=0;i--)if(starred[i][1]==='snare'&&starred[i][0]>=start-1e-8&&starred[i][0]<end-1e-8)starred.splice(i,1);
  starFills[part].forEach((slot,i)=>starred.push([start+slot*step,'snare',-2,Math.min(.14,end-start-slot*step),.36+.40*i/(starFills[part].length-1),i%2?.09:-.09,1592]));
 }
 events.push(...starred);
 // One quiet, high dissonance on bar 17, released before bar 18.
 events.push([base.duration*2,'polysynth',[31,32,37,38],16*step-.02,.07,0,1513]);
 // A*: the second broad chord gains an upper voice approaching from above.
 const secondSwell=base.events.filter(e=>e[1]==='polysynth')[1];
 if(secondSwell)events.push([firstCycle+secondSwell[0],'lahopterix',secondSwell[2].at(-1)+12,secondSwell[3],.30,.12,1512]);
 // A*': E5 approaches from above, answered one bar later by E5 sliding to D5.
 for(const lead of starred.filter(e=>e[1]==='lead'&&e[0]>=firstCycle+base.duration&&e[0]<firstCycle+2*base.duration)){
  events.push([lead[0],'lahopterix',lead[2]+12,lead[3],.30,.12,1512]);
  events.push([lead[0]+16*step,'lahopterix',29,Math.min(lead[3],firstCycle+2*base.duration-lead[0]-16*step),.30,.12,1512,{fadeOut:.45}]);
 }
 // C: a relentless E pedal and straight, driving punk drums, with low drifting tension.
 const bridgeStart=base.duration*8,duration=base.duration*9;
 const put=(bar,slot,kind,pitch,len,velocity,lane)=>{
  const t=bridgeStart+(bar*16+slot)*step,end=lane===1593?duration:duration-2*step;
  if(t<end)events.push([t,kind,pitch,Math.min(len*step,end-t),velocity,0,lane]);
 };
 for(let bar=0;bar<8;bar++){
  for(let slot=0;slot<16;slot++)put(bar,slot,'bassline',-5,.72,slot%4===0?.72:.52,1507);
  if(bar%2===0)put(bar,0,'polysynth',[-17,-16.85,bar<4?-10:-11],31.5,.085+bar*.005,1594);
  if(bar===3||bar===6)put(bar,6,'lahopterix',-17,22,.10,1595);
  if(bar>=4){
   for(let slot=0;slot<16;slot++)put(bar,slot,'snare',-2,.85,.32+.46*((bar-4)*16+slot)/63,1593);
   for(const slot of [0,4,8,12])put(bar,slot,'kick',-3,2,.58+.20*(bar-4)/3,1593);
   continue;
  }
  // Even sixteenths: two higher low toms, then two deeper toms.
  for(let slot=0;slot<16;slot++)put(bar,slot,'tom',slot%4<2?-9:-14,.95,slot%2===0?.90:.74,1597);
 }
 // Quiet treble stack: E5/B5 opens into semitone and tritone friction.
 for(const [bar,pitch]of [[0,31],[2,38],[4,32],[6,37],[7,30]]){
  const t=bridgeStart+bar*16*step;
  events.push([t,'lahopterix',pitch,duration-t-.02,.08,bar%4===0?-.16:.16,1596]);
 }
 return {bpm:base.bpm,duration,form:[...form,'A*',"A*'",'B*',"B*'",'C'],sectionBars:8,events:events.sort((a,b)=>a[0]-b[0])};
}

// Blattella obscura, from the original QUAD-OSC preset. Keep its slow envelopes,
// four oscillator voicing and 220 ms upward glide spanning seven semitones.
function synthBlattella(engine,event,time){
 const c=engine.ctx,gate=event[3],output=engine.musicInput||engine.music,nodes=[],sources=[],amps=[];
 const low=c.createBiquadFilter(),high=c.createBiquadFilter(),dry=c.createGain(),wet=c.createGain();
 low.type='lowpass';low.frequency.value=1800;low.Q.value=.9;
 high.type='highpass';high.frequency.value=28;high.Q.value=.7;
 dry.gain.value=1;wet.gain.value=0; // Keep this short-note adaptation inside its written gate, including ambience.
 low.connect(high);high.connect(dry);dry.connect(output);high.connect(wet);nodes.push(low,high,dry,wet);
 if(!engine.blattellaReverb){
  const impulse=c.createBuffer(2,Math.ceil(c.sampleRate*3),c.sampleRate);let seed=86153;
  for(let ch=0;ch<2;ch++){const data=impulse.getChannelData(ch);for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=(seed/2147483648-1)*(1-i/data.length)**2;}}
  engine.blattellaReverb=c.createConvolver();engine.blattellaReverb.buffer=impulse;engine.blattellaReverb.connect(output);
 }
 wet.connect(engine.blattellaReverb);
 const patch=[['triangle',2,1,.85,5,-.04,.3,-12,-.35,.003],['triangle',2,1,.85,5,.04,.3,-12,.35,0],['sine',1.8,1.2,.8,5.5,0,.2,0,0,0],['square',.3,1.1,.4,6,.02,.1,7,0,0]];
 for(const [type,attack,decay,sustain,release,detune,level,transpose,pan,phase]of patch){
  const osc=c.createOscillator(),amp=c.createGain(),stereo=c.createStereoPanner(),start=time+phase,end=time+gate;
  const hz=110*2**((event[2]+transpose+detune)/12),peak=.24*event[4]*level;
  osc.type=type;osc.frequency.setValueAtTime(hz*2**(-7/12),start);osc.frequency.exponentialRampToValueAtTime(hz,start+.22);
  // The preset's two-second attack never reaches useful level on this short riff.
  // Scope the quicker swell to the score's explicit phrase adaptation.
  const rise=event[7]?.phraseAttack?Math.min(attack,event[7].phraseAttack,gate*.45):attack;
  const heldAt=t=>t<rise?peak*t/rise:peak*(1-(1-sustain)*Math.min(1,(t-rise)/decay));
  amp.gain.setValueAtTime(0,start);
  if(start+rise<end)amp.gain.linearRampToValueAtTime(peak,start+rise);
  const fade=end-Math.min(.09,gate*.30);
  if(start+rise+decay<fade)amp.gain.linearRampToValueAtTime(peak*sustain,start+rise+decay);
  amp.gain.linearRampToValueAtTime(heldAt(Math.max(0,fade-start)),fade);amp.gain.linearRampToValueAtTime(0,end);
  stereo.pan.value=pan;osc.connect(amp);amp.connect(stereo);stereo.connect(low);nodes.push(amp,stereo);amps.push(amp.gain);sources.push({osc,start,end:end+.001});
 }
 let ended=0,stopped=false;
 const voice={music:true,synth:true,stop:at=>{if(stopped)return;stopped=true;for(const amp of amps){amp.cancelScheduledValues(at);amp.setTargetAtTime(0,at,.006);}for(const {osc}of sources)osc.stop(at+.04);}};
 engine.voices.add(voice);
 for(const {osc,start,end}of sources){osc.onended=()=>{osc.disconnect();if(++ended===sources.length){for(const node of nodes)node.disconnect();engine.voices.delete(voice);}};osc.start(start);osc.stop(end);}
}

// Thanathoa noctivaga, from Gudeco's FL9 preset / index (27).html.
// Preserve the preset timbre; the score supplies note triggers instead of its arp.
function synthThanathoa(engine,event,time){
 // Native GUDECO Config{} startup patch; compensate its -24 transpose to
 // preserve the written melody register when replacing the game lead.
 const defaultPatch=event[1]==='vstdefault';
 const c=engine.ctx,gate=event[3],velocity=event[4],nodes=[],sources=[],envelopes=[];
 let output=engine.musicInput||engine.music,effects=engine;
 const phraseFade=event[7]?.phraseFade;
 if(phraseFade){
  const end=time+phraseFade.end-event[0],start=time+phraseFade.start-event[0];
  if(!engine.secondTripletEffects||Math.abs(engine.secondTripletEffects.end-end)>.001){
   engine.secondTripletEffects?.output.disconnect();
   const bus=c.createGain();bus.gain.setValueAtTime(1,time);
   bus.gain.setValueAtTime(1,start);bus.gain.linearRampToValueAtTime(0,end);bus.connect(output);
   engine.secondTripletEffects={end,output:bus};
  }
  effects=engine.secondTripletEffects;output=effects.output;
 }
 const filter=c.createBiquadFilter();
 filter.type='lowpass';filter.Q.value=1.3;nodes.push(filter);
 const sweep=event[7]?.slowFilter,warm=event[7]?.warmFilter;
 if(warm)filter.Q.value=.65;
 const cutoff=t=>warm?warm.low*(warm.high/warm.low)**(.5-.5*Math.cos(2*Math.PI*Math.max(0,Math.min(1,(t-warm.start)/warm.duration)))):defaultPatch?700:sweep?350*2**(2.7*(.5-.5*Math.cos(2*Math.PI*Math.max(0,Math.min(1,(t-sweep.start)/sweep.duration))))):20+19980*(.05+.043*Math.sin(2*Math.PI*.25*t));
 const bite=defaultPatch&&event[7]?.filterBite;
 if(bite)filter.Q.value=2.1;
 const base=warm?cutoff(event[0]):defaultPatch?700:sweep?cutoff(event[0]):484;
 filter.frequency.setValueAtTime(base*.55,time);
 filter.frequency.exponentialRampToValueAtTime(base*(warm?1.15:bite?3.6:1.9),time+(bite?.008:.015));
 filter.frequency.exponentialRampToValueAtTime(base,time+(bite?.135:.12));
 for(let t=.14;t<gate+.35;t+=.02)filter.frequency.linearRampToValueAtTime(cutoff(event[0]+t),time+t);
 const dry=c.createGain(),wet=c.createGain();dry.gain.value=.75;wet.gain.value=.25;
 filter.connect(dry);dry.connect(output);filter.connect(wet);nodes.push(dry,wet);
 if(!effects.thanathoaReverb){
  const impulse=c.createBuffer(2,Math.ceil(c.sampleRate*3),c.sampleRate);let seed=73519;
  for(let ch=0;ch<2;ch++){const data=impulse.getChannelData(ch);for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=(seed/2147483648-1)*Math.pow(1-i/data.length,2);}}
  effects.thanathoaReverb=c.createConvolver();effects.thanathoaReverb.buffer=impulse;effects.thanathoaReverb.connect(output);
 }
 wet.connect(effects.thanathoaReverb);
 const feedbackDelay=event[7]?.feedbackDelay;
 if(feedbackDelay){
  if(!effects.warmThanathoaDelay){
   const input=c.createGain(),delay=c.createDelay(2),tone=c.createBiquadFilter(),feedback=c.createGain(),wetReturn=c.createGain();
   delay.delayTime.value=feedbackDelay.time;tone.type='lowpass';tone.frequency.value=feedbackDelay.cutoff;
   feedback.gain.value=feedbackDelay.feedback;wetReturn.gain.value=feedbackDelay.wet;
   input.connect(delay);delay.connect(tone);tone.connect(feedback);feedback.connect(delay);tone.connect(wetReturn);wetReturn.connect(output);
   effects.warmThanathoaDelay=input;
  }
  filter.connect(effects.warmThanathoaDelay);
 }
 const echoTaps=event[7]?.echoTaps||0,echoStep=event[7]?.echoStep||0;
 for(let tap=1;tap<=echoTaps;tap++){
  const delay=c.createDelay(2),repeat=c.createGain(),tone=c.createBiquadFilter();
  delay.delayTime.value=tap*echoStep;repeat.gain.value=.35*.55**(tap-1);tone.type='lowpass';tone.frequency.value=3500/(1+tap*.35);
  filter.connect(delay);delay.connect(tone);tone.connect(repeat);repeat.connect(output);nodes.push(delay,tone,repeat);
 }

 const oscillators=defaultPatch?[[0,-.06,.28,-.2],[0,.06,.18,.2],[0,-.06,.28,-.2],[0,.06,.18,.2]]:[[-5,-.06,.28,-.2],[2,.06,.18,.2],[-24,-.06,.28,-.2],[-24,.06,.18,.2]];
 for(const [index,[transpose,detune,level,pan]]of oscillators.entries()){
  const osc=c.createOscillator(),amp=c.createGain(),stereo=c.createStereoPanner();osc.type='sawtooth';
  osc.frequency.setValueAtTime(110*2**((event[2]+transpose+detune)/12),time);stereo.pan.value=event[7]?.alternatingPan?event[5]:pan;
  if(defaultPatch){
   const drift=.12+index*.06,glide=event[7]?.glideTo;
   const hzAt=t=>110*2**((event[2]+(glide===undefined?0:(glide-event[2])*Math.min(1,t/gate))+detune+.05*Math.sin(t*2*Math.PI*drift))/12);
   for(let t=.02;t<gate;t+=.02)osc.frequency.exponentialRampToValueAtTime(hzAt(t),time+t);
   osc.frequency.exponentialRampToValueAtTime(hzAt(gate),time+gate);
   for(let t=gate+.02;t<gate+.35;t+=.02)osc.frequency.exponentialRampToValueAtTime(hzAt(t),time+t);
  }
  const peak=.24*velocity*level,attack=Math.min(.02,gate),decayEnd=Math.min(.22,gate),held=gate<.22?peak*(1-.4*Math.max(0,gate-.02)/.2):peak*.6;
  amp.gain.value=0;amp.gain.setValueAtTime(0,time);
  if(defaultPatch&&event[7]?.delayedSwell){
   amp.gain.linearRampToValueAtTime(peak,time+Math.min(.10,gate*.65));
   amp.gain.linearRampToValueAtTime(peak*.65,time+gate);
   amp.gain.linearRampToValueAtTime(0,time+gate+.12);
  }else{
   amp.gain.linearRampToValueAtTime(peak,time+attack);
   amp.gain.linearRampToValueAtTime(held,time+decayEnd);amp.gain.setValueAtTime(held,time+gate);amp.gain.linearRampToValueAtTime(0,time+gate+.35);
  }
  osc.connect(amp);amp.connect(stereo);stereo.connect(filter);nodes.push(amp,stereo);sources.push(osc);envelopes.push(amp.gain);
 }
 let ended=0,stopped=false;const voice={music:true,synth:true,stop:at=>{if(stopped)return;stopped=true;for(const g of envelopes){g.cancelScheduledValues(at);g.setTargetAtTime(0,at,.006);}for(const o of sources)o.stop(at+.04);}};
 engine.voices.add(voice);
 for(const o of sources){o.onended=()=>{o.disconnect();if(++ended===sources.length){for(const n of nodes)n.disconnect();engine.voices.delete(voice);}};o.start(time);o.stop(time+gate+.36+echoTaps*echoStep);}
}

// A single saw voice per bar: tied steps slide without restarting the envelope.
function synthAcidBass(engine,event,time){
 const c=engine.ctx,meta=event[7],osc=c.createOscillator(),filter=c.createBiquadFilter(),drive=c.createWaveShaper(),gain=c.createGain();
 osc.type='sawtooth';filter.type='lowpass';filter.Q.value=8;
 drive.curve=Float32Array.from({length:1024},(_,i)=>Math.tanh(1.8*(i/511.5-1)));drive.oversample='2x';
 gain.gain.value=0;osc.connect(filter);filter.connect(drive);drive.connect(gain);gain.connect(engine.bassDuck||engine.musicInput||engine.music);
 const hz=p=>55*2**(p/12),level=.056*event[4];
 for(const [n,note]of meta.notes.entries()){
  const t=time+note.at,step=meta.step,tied=n>0&&meta.notes[n-1].slide;
  if(tied)osc.frequency.exponentialRampToValueAtTime(hz(note.pitch),t+.055);
  else osc.frequency.setValueAtTime(hz(note.pitch),t);
  osc.frequency.setValueAtTime(hz(note.pitch),t+step-.002);
  const peak=level*(note.accent?1:.70),cutoff=(note.accent?2600:1450)*meta.brightness;
  if(!tied){gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(peak,t+.003);}
  else gain.gain.linearRampToValueAtTime(peak,t+.012);
  if(!tied){filter.frequency.setValueAtTime(260,t);filter.frequency.exponentialRampToValueAtTime(cutoff,t+.008);}
  else filter.frequency.exponentialRampToValueAtTime(cutoff,t+.018);
  filter.frequency.exponentialRampToValueAtTime(note.slide?650:190,t+step-.003);
  if(note.slide)gain.gain.setValueAtTime(peak*.85,t+step-.002);
  else{gain.gain.setValueAtTime(peak*.65,t+step*note.gate);gain.gain.linearRampToValueAtTime(0,t+step-.004);}
 }
 gain.gain.linearRampToValueAtTime(0,time+event[3]);
 let stopped=false;const voice={music:true,synth:true,stop:at=>{if(stopped)return;stopped=true;gain.gain.cancelScheduledValues(at);gain.gain.setTargetAtTime(0,at,.006);osc.stop(at+.04);}};
 engine.voices.add(voice);osc.onended=()=>{for(const node of [osc,filter,drive,gain])node.disconnect();engine.voices.delete(voice);};osc.start(time);osc.stop(time+event[3]+.01);
}

// Mesotonya pelagica: Gudeco preset, score-triggered in the browser.
function synthMesotonya(engine,event,time){
 const c=engine.ctx,gate=event[3],output=engine.musicInput||engine.music,nodes=[],sources=[],envelopes=[];
 const filter=c.createBiquadFilter();filter.type='lowpass';filter.Q.value=1.3;nodes.push(filter);
 // The preset was voiced for low notes; track the high E register so its
 // fundamentals are not removed by the original 260–780 Hz filter motion.
 const tracking=Math.max(1,110*2**(event[2]/12)/330),limit=Math.min(16000,c.sampleRate*.45);
 const cutoff=value=>Math.min(limit,value*tracking);
 filter.frequency.setValueAtTime(cutoff(550),time);
 for(let t=.04;t<gate+1.391;t+=.04)filter.frequency.linearRampToValueAtTime(cutoff(20+19980*(.025+.015*.86*Math.sin(2*Math.PI*.082*(event[0]+t)))),time+t);
 const dry=c.createGain(),wet=c.createGain();dry.gain.value=.62;wet.gain.value=.38;filter.connect(dry);dry.connect(output);filter.connect(wet);nodes.push(dry,wet);
 if(!engine.mesotonyaReverb){
  const buffer=c.createBuffer(2,Math.ceil(c.sampleRate*3),c.sampleRate);let seed=19183;
  for(let ch=0;ch<2;ch++){const data=buffer.getChannelData(ch);for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=(seed/2147483648-1)*(1-i/data.length)**2;}}
  engine.mesotonyaReverb=c.createConvolver();engine.mesotonyaReverb.buffer=buffer;engine.mesotonyaReverb.connect(output);
 }
 wet.connect(engine.mesotonyaReverb);
 const table=[0,193.16,386.32,503.42,696.58,889.74,1082.9];
 const configs=[['triangle',7,-.06,.871,-.2,.359,1.843,.299,.35,[.146,.12,.96,1]],['square',14,.06,.477,.2,.499,2.104,.6,.35,[.217,.04,.74,.95]],['square',2,-.06,.731,-.2,.522,2.104,.751,.35,[.5,0,.99,.85]],['square',7,.06,.18,.2,.475,.87,.461,1.391,null]];
 for(const [wave,transpose,detune,level,pan,attack,decay,sustain,release,lfo]of configs){
  const o=c.createOscillator(),env=c.createGain(),motion=c.createGain(),stereo=c.createStereoPanner();o.type=wave;stereo.pan.value=pan;
  const cents=1200*Math.floor(transpose/7)+table[transpose%7],hz=110*2**(event[2]/12+cents/1200+detune/12);
  o.frequency.setValueAtTime(hz*2**(.5/12),time);o.frequency.exponentialRampToValueAtTime(hz,time+.035);
  const stable=event[7]?.stableSustain,peak=.075*event[4],noteAttack=stable?Math.min(.12,gate*.18):Math.min(attack,gate*.45);env.gain.value=0;env.gain.setValueAtTime(0,time);env.gain.linearRampToValueAtTime(peak,time+noteAttack);const held=peak*(1-(1-(stable?Math.max(.7,sustain):sustain))*Math.min(1,Math.max(0,gate-noteAttack)/decay));env.gain.linearRampToValueAtTime(held,time+Math.min(noteAttack+decay,gate));env.gain.setValueAtTime(held,time+gate);env.gain.linearRampToValueAtTime(0,time+gate+release);
  motion.gain.setValueAtTime(stable?.55+.45*level:level,time);
  if(lfo){const [rate,lo,hi,depth]=lfo;for(let t=.02;t<gate+release;t+=.02)motion.gain.linearRampToValueAtTime((stable?.55:0)+(stable?.45:1)*((lo+hi)/2+(hi-lo)/2*depth*Math.sin(2*Math.PI*rate*(event[0]+t))),time+t);}
  o.connect(env);env.connect(motion);motion.connect(stereo);stereo.connect(filter);sources.push(o);nodes.push(env,motion,stereo);envelopes.push(env.gain);
 }
 let ended=0,stopped=false;const voice={music:true,synth:true,stop:at=>{if(stopped)return;stopped=true;for(const g of envelopes){g.cancelScheduledValues(at);g.setTargetAtTime(0,at,.006);}for(const o of sources)o.stop(at+.04);}};
 engine.voices.add(voice);for(const o of sources){o.onended=()=>{o.disconnect();if(++ended===sources.length){for(const n of nodes)n.disconnect();engine.voices.delete(voice);}};o.start(time);o.stop(time+gate+1.4);}
}
