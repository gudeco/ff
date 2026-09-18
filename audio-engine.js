import {SYNTH_SCORE} from './synth-score.js';
import {scheduleSynth,withStageBass,createTitleTheme,createHospitalTheme} from './synth-music.js';
// Original percussion/ambience scores; no scale or chord progression.
export const QUADS_TRACKS=[{"bars":4,"bpm":110,"div":16,"hpf":21,"hpfQ":0.707,"lpf":1612,"lpfQ":0.707,"pan":0,"playing":true,"rev":0,"sound":5,"steps":[[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,12,[-1,-1,-1,-1,1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,24,[-1,-1,-1,-1,1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,24,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,31,[-1,-1,-1,-1,1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,17,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,true,false]],[true,14,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,true,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,1,-1,-1,-1,-1,-1,false,false]]],"swing":0,"vol":1},{"bars":4,"bpm":110,"div":16,"hpf":21,"hpfQ":0.707,"lpf":1612,"lpfQ":0.707,"pan":0,"playing":true,"rev":0,"sound":6,"steps":[[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,12,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,24,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,12,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,15,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,17,[-1,-1,-1,-1,1,-1,-1,-1,-1,-1,false,false]]],"swing":0,"vol":1},{"bars":4,"bpm":110,"div":16,"hpf":21,"hpfQ":0.707,"lpf":1612,"lpfQ":0.707,"pan":0,"playing":true,"rev":0,"sound":8,"steps":[[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,-12,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,24,[-1,-1,-1,-1,-1,1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,12,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,0,[-1,-1,-1,-1,1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]]],"swing":0,"vol":1},{"bars":4,"bpm":110,"div":16,"hpf":21,"hpfQ":0.707,"lpf":1612,"lpfQ":0.707,"pan":0,"playing":true,"rev":0,"sound":0,"steps":[[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,-12,[2222,-1,-1,-1,1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,-12,[7000,-1,7000,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,-12,[-1,-1,-1,-1,1,-1,-1,-1,1,-1,true,false]],[false,12,[-1,-1,-1,-1,1,-1,-1,-1,-1,-1,false,false]],[true,-12,[2222,-1,-1,-1,1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,-12,[-1,-1,-1,-1,1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[true,-12,[2222,1,7000,1,1,1,11,-1,1,-1,true,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]],[false,-2,[-1,20,-1,20,1,1,11,0.949999988079071,-1,-1,true,false]],[false,0,[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,false,false]]],"swing":0,"vol":1}];
export function quadsStep(step){const ix=step%64,second=step%128>=64;return QUADS_TRACKS.flatMap((q,i)=>{const st=q.steps[ix],on=i===3&&ix===62?second:st[0];if(!on)return [];return [{voice:i,instrument:['kick','snare','metal','quad'][i],freq:110*Math.pow(2,st[1]/12),duration:i===3?.6:.3,level:q.vol,pan:q.pan,offset:0,slide:1,texture:{pitch:st[1],seq:i,fx:st[2],rate:Math.pow(2,st[1]/12),cutoff:q.lpf}}];});}
export function industrialStep(name,step){if(name==='title')return [];const ix=step%64,bar=Math.floor(step/16)%32,street=name==='street',q=QUADS_TRACKS[street?0:2],st=q.steps[ix];if(!st[0]||(st[1]===0&&st[2][4]<=0)||bar%8<2)return [];const pitch=st[1]+(Math.floor(bar/8)%2?-12:0);return [{voice:10,instrument:street?'metal':'drop',freq:110,duration:street?.17:.48,level:street?.24:.22,pan:bar%2?.3:-.3,offset:street?.5:0,slide:.97,texture:{rate:Math.pow(2,pitch/12)*.55,cutoff:street?1300:900,dist:st[2][4]>0}}];}

export const THEMES={
 title:{bpm:110,swing:0,echo:.16,wet:0,feedback:.20},
 plaza:{bpm:174,swing:.035,echo:.29,wet:.24,feedback:.34},
 street:{bpm:188,swing:0,echo:.075,wet:.045,feedback:.12},
 hospital:{bpm:170,swing:0,echo:.17,wet:.075,feedback:.20}
};
const audioClamp=n=>Math.max(0,Math.min(1,Number(n)||0));
export const SAMPLE_FILES=['quads-title.wav','perkons-kick.wav','perkons-impact.wav','perkons-snare.wav','perkons-hat.wav','perkons-gong.wav','prc-1.mp3','prc-3.mp3','prc-8.mp3','alice-cellamb.mp3','alice-rasp.mp3','alice-cellamb2.mp3','alice-pianofade.mp3'];
// Reference frequencies control playback speed, not a new melodic score.
const SAMPLE_VOICES={tape:['alice-cellamb2.mp3',160],dust:['alice-pianofade.mp3',240],kick:['perkons-kick.wav',65],snare:['perkons-snare.wav',145],breaksnare:['perkons-snare.wav',125],snap:['prc-3.mp3',155],brush:['perkons-hat.wav',150],tick:['perkons-hat.wav',125],bongo:['prc-1.mp3',190],metal:['perkons-gong.wav',310],drop:['perkons-gong.wav',380],drift:['alice-cellamb.mp3',100],hollow:['perkons-gong.wav',155],haze:['alice-cellamb.mp3',240],water:['alice-rasp.mp3',210],motor:['prc-8.mp3',145],grit:['alice-rasp.mp3',170],impact:['perkons-kick.wav',85],guard:['prc-3.mp3',240],air:['perkons-hat.wav',170],surf:['alice-rasp.mp3',220],paper:['prc-8.mp3',180],flame:['alice-rasp.mp3',155],acid:['prc-8.mp3',150],hex:['perkons-gong.wav',310],guitar:['alice-rasp.mp3',120]};
const BREAKS=[
 {kick:[0,6,10],snare:[4,12],ghost:[7,11,15]},
 {kick:[0,3,8,10],snare:[4,12],ghost:[6,9,14]},
 {kick:[0,6,9],snare:[4,10,12],ghost:[3,7,15]},
 {kick:[0,2,8,11],snare:[4,12,14],ghost:[6,10,15]},
 {kick:[0,7,10],snare:[4,12],ghost:[2,9,13,15]},
 {kick:[0,3,10],snare:[4,8,12],ghost:[6,11,14]},
 {kick:[0,6,8],snare:[4,13],ghost:[7,10,12,15]},
 {kick:[0,5,10],snare:[4,12],ghost:[3,7,11,14]}
];
// Eight different fourth-bar endings; 32 bars before the form repeats.
const FILLS=[ [12,13,14,15], [10,12,14,15], [8,11,13,15], [12,14,15], [9,10,12,15], [8,10,13,14,15], [11,12,14], [8,11,12,13,14,15] ];
export function scoreStep(themeName,step){
 const name=THEMES[themeName]?themeName:'title',s=step%16,bar=Math.floor(step/16)%32,phrase=Math.floor(bar/4),fill=bar%4===3,out=[];
 const add=(voice,instrument,freq,duration,level=1,pan=0,offset=0,slide=1)=>out.push({voice,instrument,freq,duration,level,pan,offset,slide});
 if(name==='title')return quadsStep(step);
 const street=name==='street',pattern=BREAKS[(bar+(street?3:0)+phrase)%BREAKS.length],breakdown=bar===15||bar===31;
 // Original chopped funk-break rhythms: backbeats, anticipations, ghost snares,
 // displaced kicks and 32nd-note retriggers, rather than a repeated drum loop.
 if(pattern.kick.includes(s)&&(!breakdown||s<8))add(5,'kick',street?57:49,.18,s===0?1:.74);
 if(pattern.snare.includes(s)&&!(fill&&s>=12))add(6,street?'snap':'breaksnare',135,.14,.84,-.10);
 if(pattern.ghost.includes(s)&&!(fill&&s>=10))add(6,street?'snap':'breaksnare',125,.065,.22+((s+bar)%3)*.06,.15);
 if((street?s%2===0||s===7||s===15:s%2===0)&&(!breakdown||s<10))add(7,street?'tick':'brush',90,s===14?.12:.04,s%4===0?.34:.20,s%4===0?-.27:.27);
 if(fill&&FILLS[phrase].includes(s)){
  const drum=street?(s%3===0?'metal':'snap'):(s%3===0?'bongo':'breaksnare');
  add(6,drum,street?121+s*3.7:133+s*2.1,.08,.50+(s%3)*.13,-.24);
  if((s+phrase)%2===0||s===15)add(7,street?'snap':'bongo',street?147:171,.045,.35,.28,.5);
  if(s===15&&phrase%2===1)add(5,'kick',street?51:43,.21,.9,0,.5);
 }
 if(street){
  if([0,7,10].includes(s)&&!breakdown)add(0,'sub',44.6+(bar%3)*1.3,.23,.72,0,0,.91);
  if(s===0&&bar%2===0)add(1,'motor',71.3+(phrase%3)*1.1,2.25,.50,-.18,0,.97);
  if(s===(bar*5)%16&&bar%2===1)add(2,'metal',183.7+(bar%5)*13.1,.42,.33,(bar%3-1)*.4,0,.82);
  if(s===8&&bar%4===2)add(3,'grit',110,.75,.27,.3);
 }else{
  if(s===0&&bar%2===0){add(0,'drift',46.9+(phrase%3)*.71,3.0,.63,-.25,0,1.037);add(1,'hollow',79.1+(bar%3)*1.73,2.8,.30,.3,0,.963);}
  if(s===4&&bar%2===1)add(2,'water',110,1.3,.45,bar%4===1?-.4:.4);
  if(s===10&&bar%4===2)add(3,'haze',120,2.1,.3,-.2);
  if(s===14&&bar%4===0)add(4,'drop',227.3+phrase*3.9,.39,.22,.38,0,.73);
 }
 return out;
}

// Additional texture lanes leave the approved percussion score untouched.
export function ambienceStep(name,step){
 const bar=Math.floor(step/16)%32,beat=step%16,tick=60/THEMES[name].bpm/4,street=name==='street',cycle=Math.floor(bar/4),out=[];
 if(name==='title'){
  if(beat===0&&bar%4===0){out.push({voice:8,instrument:'tape',freq:91+cycle*.73,duration:tick*64+.5,level:.4,pan:-.28,offset:0,slide:.985});if(bar%8===4)out.push({voice:9,instrument:'dust',freq:127,duration:tick*55,level:.28,pan:.35,offset:0,slide:1.013});}return out;
 }
 // The same four-bar call returns every eight bars, with a transformed answer.
 const variations=[0,1,0,2,0,3,0,1],v=variations[cycle];
 if(beat===0&&bar%4===0)out.push({voice:8,instrument:street?'dust':'tape',freq:street?113:91,duration:tick*(v===2?46:64),level:street?.27:.38,pan:-.28,offset:0,slide:[.985,1.017,.96,1.008][v],texture:{stretch:v!==0,reverse:v===3,partial:[0,370,590,240][v],gate:street?tick*(v===2?2:4):0,cutoff:street?980:1450}});
 const answer=street?[7,10,14]:[4,11];
 if(bar%4===2&&answer.includes(beat))out.push({voice:9,instrument:street?'tape':'dust',freq:street?83:127,duration:tick*(street?3:8),level:street?.23:.27,pan:beat%2?.32:-.32,offset:0,slide:1,texture:{stretch:true,reverse:v===1,partial:street?430:720,cutoff:1200}});
 return out;
}
export const STAGE_RENDERS={plaza:{file:'square-industrial.wav',bpm:174,bars:28,gain:.72},street:{file:'street-industrial.wav',bpm:188,bars:20,gain:.72}};
SAMPLE_FILES.push(...Object.values(STAGE_RENDERS).map(s=>s.file));
export class SoundEngine{
 constructor({contextFactory=null}={}){this.contextFactory=contextFactory;this.ctx=null;this.enabled=false;this.paused=false;this.theme='title';this.musicMode='synth';this.musicVolume=.55;this.effectsVolume=.72;this.voices=new Set();this.slots=new Map();this.timer=null;this.step=0;}
 init(){
  if(this.ctx)return;
  const C=globalThis.AudioContext||globalThis.webkitAudioContext;
  this.ctx=this.contextFactory?this.contextFactory():new C();const c=this.ctx;
  this.master=c.createGain();this.master.gain.value=.72;
  const low=c.createBiquadFilter();low.type='lowpass';low.frequency.value=3400;low.Q.value=.55;
  const dc=c.createBiquadFilter();dc.type='highpass';dc.frequency.value=28;
  const compressor=c.createDynamicsCompressor();compressor.threshold.value=-16;compressor.knee.value=15;compressor.ratio.value=5;compressor.attack.value=.004;compressor.release.value=.16;
  this.music=c.createGain();this.effects=c.createGain();this.music.gain.value=this.musicVolume;this.effects.gain.value=this.effectsVolume;
  // FL9 exports already contain the approved mix; preserve their spectrum and dynamics.
  this.renderedMusic=c.createGain();this.renderedMusic.gain.value=this.musicVolume;this.renderedMusic.connect(c.destination);
  // Measure pre-volume music only; gameplay effects never influence leveling.
  this.musicInput=c.createGain();this.recordedInput=c.createGain();
  this.musicLevel=c.createGain();this.recordedLevel=c.createGain();
  this.musicInput.connect(this.musicLevel);this.musicLevel.connect(this.music);
  this.recordedInput.connect(this.recordedLevel);this.recordedLevel.connect(this.renderedMusic);
  this.levelMeter=c.createAnalyser();this.levelMeter.fftSize=2048;
  this.musicInput.connect(this.levelMeter);this.recordedInput.connect(this.levelMeter);
  this.levelData=new Float32Array(2048);this.musicLevel.gain.value=1.2;this.levelGain=1.2;this.levelPower=0;
  this.musicDuck=c.createGain();this.ambientDuck=c.createGain();this.ambientDuck.connect(this.musicInput);this.bassDuck=c.createGain();this.bassDuck.connect(this.musicInput);this.music.connect(this.musicDuck);this.musicDuck.connect(this.master);this.effects.connect(this.master);this.master.connect(low);low.connect(dc);dc.connect(compressor);compressor.connect(c.destination);
  // Dark, short echo. Feedback < 1; no sharp cymbal/reverb wash.
  const delay=c.createDelay(.5),feedback=c.createGain(),damp=c.createBiquadFilter(),wet=c.createGain();
  delay.delayTime.value=.165;feedback.gain.value=.21;damp.type='lowpass';damp.frequency.value=1250;wet.gain.value=.12;
  this.echo={delay,feedback,wet};this.applyThemeMix();
  this.musicDuck.connect(delay);delay.connect(damp);damp.connect(feedback);feedback.connect(delay);damp.connect(wet);wet.connect(this.master);
  const real=new Float32Array(12),imag=new Float32Array(12);
  [0,1,.23,.13,.065,.025,.015].forEach((v,i)=>imag[i]=v);this.warmWave=c.createPeriodicWave(real,imag);
  const noise=c.createBuffer(1,c.sampleRate,c.sampleRate),data=noise.getChannelData(0);let seed=58321;
  for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=(seed/2147483648-1);}
  this.noise=noise;this.nextTime=c.currentTime+.04;
  this.industrialCurve=Float32Array.from({length:512},(_,i)=>Math.tanh((i/511*2-1)*5)/1.4);
  this.drumCurve=Float32Array.from({length:512},(_,i)=>Math.tanh((i/511*2-1)*1.6)/Math.tanh(1.6));
 }
 async prepareSamples(names=SAMPLE_FILES){
  this.init();this.samples??=new Map();this.sampleErrors??=[];this.sampleLoads??=new Map();
  for(const name of names){
  if(!this.sampleLoads.has(name))this.sampleLoads.set(name,(async()=>{try{
   const url=globalThis.loadGameAudio?await globalThis.loadGameAudio(name):typeof EMBEDDED_AUDIO!=='undefined'?EMBEDDED_AUDIO[name]:new URL('assets/audio/'+name,import.meta.url).href;
   let bytes;
   if(url.startsWith('data:')){const raw=atob(url.slice(url.indexOf(',')+1));const array=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)array[i]=raw.charCodeAt(i);bytes=array.buffer;}
   else{const response=await fetch(url);if(!response.ok)throw Error(response.status);bytes=await response.arrayBuffer();}
   const decoded=await this.ctx.decodeAudioData(bytes);
   if(name==='quads-title.wav'||Object.values(STAGE_RENDERS).some(s=>s.file===name)){this.samples.set(name,decoded);return;}
   // Remove DC, trim leading silence, normalize and fade the cut boundaries.
   const mono=new Float32Array(decoded.length);for(let ch=0;ch<decoded.numberOfChannels;ch++){const a=decoded.getChannelData(ch);for(let i=0;i<mono.length;i++)mono[i]+=a[i]/decoded.numberOfChannels;}
   let mean=0;for(const v of mono)mean+=v;mean/=mono.length;let peak=0;for(let i=0;i<mono.length;i++){mono[i]-=mean;peak=Math.max(peak,Math.abs(mono[i]));}
   if(peak<.00001)throw Error('Silent sample');let start=0;while(start<mono.length-1&&Math.abs(mono[start])<peak*.035)start++;start=Math.max(0,start-Math.floor(decoded.sampleRate*.002));
   const length=Math.min(mono.length-start,Math.floor(decoded.sampleRate*(name.includes('cellamb')||name.includes('pianofade')?8:2.5))),buffer=this.ctx.createBuffer(1,length,decoded.sampleRate),a=buffer.getChannelData(0),fade=Math.min(Math.floor(decoded.sampleRate*.008),length/4);
   for(let i=0;i<length;i++)a[i]=mono[start+i]/peak*.85*Math.min(1,i/fade,(length-1-i)/fade);
   this.samples.set(name,buffer);
   if(name.startsWith('alice-')){
    // Overlap-add grains stretch time independently of playback pitch.
    const grain=Math.floor(buffer.sampleRate*.12),hop=Math.floor(grain/4),stretched=this.ctx.createBuffer(1,length*2,buffer.sampleRate),dst=stretched.getChannelData(0),weights=new Float32Array(dst.length);
    for(let pos=0;pos<dst.length;pos+=hop){const src=Math.floor(pos*.5);for(let j=0;j<grain&&pos+j<dst.length;j++){const w=.5-.5*Math.cos(2*Math.PI*j/(grain-1));dst[pos+j]+=a[Math.min(length-1,src+j)]*w;weights[pos+j]+=w;}}
    for(let i=0;i<dst.length;i++)dst[i]=weights[i]>0?dst[i]/weights[i]:0;
    this.samples.set(name+':stretch',stretched);
    for(const [suffix,b]of [['',buffer],[':stretch',stretched]]){const reversed=this.ctx.createBuffer(1,b.length,b.sampleRate);reversed.getChannelData(0).set(b.getChannelData(0).slice().reverse());this.samples.set(name+suffix+':reverse',reversed);}
   }
  }catch(error){this.sampleErrors.push(name+': '+error.message);console.warn('Sample unavailable; using synthesis',name,error);}})());
  await this.sampleLoads.get(name);
  // Let input and painting run between expensive sample conversions.
  if(names.length>1)await new Promise(resolve=>setTimeout(resolve,0));
  }
 }
 duck(bus,t,depth,release){
  const p=bus.gain;
  // Preserve the current envelope during rapid kicks instead of jumping back to unity.
  if(p.cancelAndHoldAtTime)p.cancelAndHoldAtTime(t);
  else{const held=p.value;p.cancelScheduledValues(t);p.setValueAtTime(held,t);}
  p.linearRampToValueAtTime(depth,t+.007);p.setTargetAtTime(1,t+.022,release);
 }
 async setMusicMode(mode){
  this.musicMode=mode==='recorded'?'recorded':'synth';this.synthClock=null;
  if(this.ctx){for(const v of this.voices)if(v.music)v.stop(this.ctx.currentTime);this.slots.clear();}
  if(this.enabled)await this.setEnabled(true);
 }
 async setEnabled(on){
  this.enabled=!!on;
  if(!on){this.stopTimer();if(this.ctx)await this.ctx.suspend();return;}
  try{this.init();const ready=this.musicMode==='synth'?Promise.resolve():this.prepareSamples([STAGE_RENDERS[this.theme]?.file||'quads-title.wav']);if(!this.paused)await this.ctx.resume();await ready;if(this.enabled&&!this.paused){this.startTimer();void this.prepareSamples(this.musicMode==='synth'?SAMPLE_FILES.filter(n=>!n.includes('title')&&!Object.values(STAGE_RENDERS).some(s=>s.file===n)):SAMPLE_FILES);}}catch(e){this.enabled=false;this.stopTimer();throw e;}
 }
 setVolumes(music,effects){this.musicVolume=audioClamp(music);this.effectsVolume=audioClamp(effects);if(this.ctx){this.music.gain.setTargetAtTime(this.musicVolume,this.ctx.currentTime,.03);this.renderedMusic.gain.setTargetAtTime(this.musicVolume,this.ctx.currentTime,.03);this.effects.gain.setTargetAtTime(this.effectsVolume,this.ctx.currentTime,.03);}}
 applyThemeMix(){if(!this.echo)return;const p=THEMES[this.theme],t=this.ctx.currentTime;this.echo.delay.delayTime.setTargetAtTime(p.echo,t,.12);this.echo.wet.gain.setTargetAtTime(p.wet,t,.12);this.echo.feedback.gain.setTargetAtTime(p.feedback,t,.12);}
 setTheme(theme){theme=THEMES[theme]?theme:'title';if(theme===this.theme)return;this.theme=theme;if(this.ctx&&this.musicInput){this.musicInput.gain.cancelScheduledValues(this.ctx.currentTime);this.musicInput.gain.setValueAtTime(1,this.ctx.currentTime);this.echo?.wet.gain.cancelScheduledValues(this.ctx.currentTime);}if(theme==='title'&&this.musicLevel){this.levelGain=Math.min(this.levelGain,1.2);this.musicLevel.gain.setValueAtTime(this.levelGain,this.ctx.currentTime);}this.levelPower=0;this.synthClock=null;this.applyThemeMix();this.step=0;if(this.ctx){const t=this.ctx.currentTime;for(const v of this.voices)if(v.music)v.stop(t);this.slots.clear();this.nextTime=t+.045;}}
 async setPaused(paused){this.paused=!!paused;if(!this.ctx||!this.enabled)return;if(paused){this.stopTimer();await this.ctx.suspend();}else{await this.ctx.resume();if(this.musicMode!=='synth')await this.prepareSamples([STAGE_RENDERS[this.theme]?.file||'quads-title.wav']);if(this.enabled&&!this.paused)this.startTimer();}}
 updateMusicLevel(){
  if(!this.levelMeter||this.ctx.state!=='running')return;
  this.levelMeter.getFloatTimeDomainData(this.levelData);
  let power=0;for(const value of this.levelData)power+=value*value;power/=this.levelData.length;
  if(power<.00002)return;
  this.levelPower=this.levelPower?this.levelPower*.98+power*.02:power;
  const title=this.theme==='title';
  const target=Math.max(title?.15:.35,Math.min(title?2.5:3.5,(title?.075:.10)/Math.sqrt(this.levelPower)));
  this.levelGain=this.levelGain*.99+target*.01;
  this.musicLevel.gain.setTargetAtTime(this.levelGain,this.ctx.currentTime,.5);
  // Recorded mixes bypass the .72 synth master attenuation.
  this.recordedLevel.gain.setTargetAtTime(this.levelGain*.72,this.ctx.currentTime,.5);
 }
 startTimer(){if(this.timer!==null)return;if(this.nextTime<this.ctx.currentTime)this.nextTime=this.ctx.currentTime+.035;this.schedule();this.timer=setInterval(()=>{this.updateMusicLevel();this.schedule();},25);}
 stopTimer(){if(this.timer!==null)clearInterval(this.timer);this.timer=null;}
 startTitleLoop(){
  if(this.slots.has('quads-title'))return;
  const c=this.ctx,b=this.samples?.get('quads-title.wav');if(!b)return;
  const source=c.createBufferSource(),gain=c.createGain(),warm=c.createBiquadFilter(),t=c.currentTime+.025;
  source.buffer=b;source.loop=true;
  // A quieter entrance and a lower normalization target keep menu music subtle.
  this.levelGain=Math.min(this.levelGain||1,.45);
  if(this.musicLevel)this.musicLevel.gain.setValueAtTime(this.levelGain,c.currentTime);
  warm.type='lowpass';warm.frequency.value=2200;warm.Q.value=.45;
  gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.22,t+.12);
  source.connect(warm);warm.connect(gain);gain.connect(this.musicInput||this.music);
  const voice={music:true,stop:at=>{gain.gain.cancelScheduledValues(at);gain.gain.setTargetAtTime(.0001,at,.012);source.stop(at+.08);}};
  this.slots.set('quads-title',voice);this.voices.add(voice);
  source.onended=()=>{source.disconnect();warm.disconnect();gain.disconnect();this.voices.delete(voice);if(this.slots.get('quads-title')===voice)this.slots.delete('quads-title');};source.start(t);
 }

 startStageLoop(){
  const spec=STAGE_RENDERS[this.theme],key='stage:'+this.theme;
  if(!spec||this.slots.has(key))return;
  const buffer=this.samples?.get(spec.file);if(!buffer)return;
  const c=this.ctx,source=c.createBufferSource(),gain=c.createGain(),t=c.currentTime+.025;
  source.buffer=buffer;source.loop=true;source.loopStart=0;source.loopEnd=buffer.duration;
  gain.gain.setValueAtTime(spec.gain,t);source.connect(gain);gain.connect(this.recordedInput||this.renderedMusic);
  // Completed mixes bypass the procedural echo/duck buses: silence must stay silent.
  let stopped=false;const voice={music:true,stop:at=>{if(stopped)return;stopped=true;gain.gain.cancelScheduledValues(at);gain.gain.setTargetAtTime(0,at,.012);source.stop(at+.08);}};
  this.slots.set(key,voice);this.voices.add(voice);source.onended=()=>{source.disconnect();gain.disconnect();this.voices.delete(voice);if(this.slots.get(key)===voice)this.slots.delete(key);};source.start(t);
 }
 schedule(){if(!this.enabled||this.paused||!this.ctx||this.ctx.state!=='running')return;if(this.theme==='title'){if(this.musicMode==='synth'){this.titleSynthScore??=createTitleTheme();scheduleSynth(this,this.titleSynthScore);}else if(this.samples?.has('quads-title.wav'))this.startTitleLoop();return;}if(this.musicMode==='synth'||this.theme==='hospital'){this.stageSynthScores??={};this.stageSynthScores[this.theme]??=this.theme==='hospital'?createHospitalTheme():withStageBass(SYNTH_SCORE[this.theme],this.theme);scheduleSynth(this,this.stageSynthScores[this.theme]);return;}if(STAGE_RENDERS[this.theme]&&this.samples?.has(STAGE_RENDERS[this.theme].file)){this.startStageLoop();return;}if(this.theme==='title'&&this.samples?.has('quads-title.wav')){this.startTitleLoop();return;}const c=this.ctx,p=THEMES[this.theme],sixteenth=60/p.bpm/4;
  // If a tab stalls, resume from now rather than emit a backlog of notes.
  if(this.nextTime<c.currentTime-.1)this.nextTime=c.currentTime+.025;
  while(this.nextTime<c.currentTime+.12){const t=this.nextTime+(this.step%2?p.swing*sixteenth:0);for(const e of [...scoreStep(this.theme,this.step),...ambienceStep(this.theme,this.step),...industrialStep(this.theme,this.step)])this.voice(e.instrument,e.freq,t+e.offset*sixteenth,e.duration,e.level,e.pan,true,e.voice,e.slide,e.texture);this.step=(this.step+1)%512;this.nextTime+=sixteenth;}
 }
 voice(instrument,freq,time,duration,level=1,pan=0,music=false,slot=null,slide=1,texture={}){
  if(!this.ctx)return;const c=this.ctx,t=Math.max(time,c.currentTime);
  const drum=music&&['kick','snare','breaksnare','snap','bongo','brush','tick'].includes(instrument);
  const naturalDuration=drum?({kick:this.theme==='title'?.64:.39,snare:.29,breaksnare:.25,snap:.24,bongo:.30,brush:.075,tick:.07}[instrument]):0;
  const d=Math.max(.025,duration,naturalDuration),g=c.createGain(),filter=c.createBiquadFilter(),stereo=c.createStereoPanner();
  const noise=['snare','brush','air','surf','paper','flame','acid','breaksnare','snap','tick','haze','water','grit'].includes(instrument);
  const mapping=music&&instrument==='bongo'?['perkons-gong.wav',290]:music&&instrument==='snap'?['perkons-snare.wav',145]:SAMPLE_VOICES[instrument],sample=mapping&&this.samples?.get(mapping[0]+(texture.stretch?':stretch':'')+(texture.reverse?':reverse':''))||mapping&&this.samples?.get(mapping[0]);
  const source=sample||noise?c.createBufferSource():c.createOscillator();
  filter.type=noise?'bandpass':'lowpass';filter.Q.value=noise?.55:.6;
  const ambient=['drift','hollow','motor','haze','water','grit','tape','dust'].includes(instrument);
  const presets={tape:[.13,1450],dust:[.11,1150],drift:[.16,750],hollow:[.10,650],motor:[.12,490],sub:[.20,260],haze:[.12,450],water:[.14,760],grit:[.12,1050],metal:[.12,1700],drop:[.10,950],breaksnare:[.23,1750],snap:[.24,2200],tick:[.09,2300],bass:[.19,800],keys:[.075,1450],horn:[.11,1200],reed:[.09,1600],kick:[.30,550],bongo:[.20,1250],snare:[.13,1200],brush:[.08,1900],air:[.10,900],surf:[.14,700],paper:[.12,1600],flame:[.17,450],acid:[.10,850],impact:[.27,900],guard:[.16,1300],hex:[.13,1100],guitar:[.15,1450]};
  let [gain,cutoff]=presets[instrument]||[.12,1200];
  if(drum){[gain,cutoff]=({kick:[.40,920],snare:[.21,1500],breaksnare:[.25,1500],snap:[.25,1700],bongo:[.17,1150],brush:[.065,1800],tick:[.07,1950]})[instrument];}
filter.frequency.setValueAtTime(cutoff,t);filter.frequency.exponentialRampToValueAtTime(Math.max(160,cutoff*.55),t+d);
  if(sample){source.buffer=sample;source.loop=ambient||['surf','flame','guitar'].includes(instrument);const rate=texture.rate??Math.max(.22,Math.min(1.8,(drum&&instrument==='kick'?1:freq/mapping[1])));source.playbackRate.setValueAtTime(rate,t);source.playbackRate.exponentialRampToValueAtTime(Math.max(.15,rate*slide),t+d*.75);filter.type='lowpass';}
  else if(noise){source.buffer=this.noise;source.loop=true;}else{source.type=['bass','keys','hex','hollow','motor'].includes(instrument)?'triangle':'sine';if(['horn','reed','guitar'].includes(instrument))source.setPeriodicWave(this.warmWave);const drum=['kick','bongo','impact'].includes(instrument);source.frequency.setValueAtTime(drum?freq*1.8:freq,t);source.frequency.exponentialRampToValueAtTime(Math.max(25,freq*slide),t+(drum?.045:d*.75));}
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(Math.max(.0001,gain*level*(sample?(music?2.2:1.5):1)),t+(ambient?Math.min(.45,d*.22):.004));if(ambient&&sample){const peak=Math.max(.0001,gain*level*2.2);g.gain.linearRampToValueAtTime(peak*.82,t+d*.65);g.gain.exponentialRampToValueAtTime(.0001,t+d);}else if(drum&&sample){const peak=gain*level*2.2;g.gain.linearRampToValueAtTime(peak*.88,t+Math.min(.07,d*.25));g.gain.exponentialRampToValueAtTime(Math.max(.0001,peak*.18),t+d*.83);g.gain.linearRampToValueAtTime(.0001,t+d);}else g.gain.exponentialRampToValueAtTime(.0001,t+d);
  let resonance=null;
  if(['bongo','metal','hollow','breaksnare','snap'].includes(instrument)&&!(sample&&music)){
   resonance=c.createOscillator();const ring=c.createGain();resonance.type='sine';resonance.frequency.setValueAtTime(freq*(instrument==='metal'?3.17:2.32),t);resonance.frequency.exponentialRampToValueAtTime(freq*(instrument==='metal'?2.71:1.59),t+.035);ring.gain.value=.22;resonance.connect(ring);ring.connect(filter);resonance.start(t);resonance.stop(t+d*.65);resonance.onended=()=>{resonance.disconnect();ring.disconnect();};
  }
  // Two warm accents per eight bars; ordinary title percussion stays clean.
  const phraseBeat=Math.round(t/(60/THEMES[this.theme].bpm/4))%128;
  const warmAccent=music&&this.theme==='title'&&['bongo','snare'].includes(instrument)&&[61,63,125,127].includes(phraseBeat);
  const industrialKick=music&&instrument==='kick';
  const drive=(texture.dist||(music&&this.theme==='title'?(warmAccent||industrialKick):(industrialKick||['snap','metal','motor'].includes(instrument))))?c.createWaveShaper():null;
  if(drive){drive.curve=industrialKick?this.industrialCurve:this.drumCurve;drive.oversample='2x';filter.connect(drive);drive.connect(g);}else filter.connect(g);
  stereo.pan.value=Math.max(-.75,Math.min(.75,pan));if(ambient){stereo.pan.setValueAtTime(pan,t);stereo.pan.linearRampToValueAtTime(-pan,t+d);filter.frequency.setValueAtTime(cutoff*.65,t);filter.frequency.linearRampToValueAtTime(cutoff,t+d*.45);filter.frequency.linearRampToValueAtTime(cutoff*.45,t+d);}source.connect(filter);g.connect(stereo);stereo.connect(music?(ambient?this.ambientDuck:this.music):this.effects);
  if(music&&instrument==='kick')this.duck(this.ambientDuck,t,this.theme==='street'?.45:.67,.09);
  const extras=[];
  if(industrialKick&&this.samples?.has('perkons-impact.wav')){const layer=c.createBufferSource(),band=c.createBiquadFilter(),lg=c.createGain();layer.buffer=this.samples.get('perkons-impact.wav');layer.playbackRate.value=.62;band.type='bandpass';band.frequency.value=740;band.Q.value=.75;lg.gain.setValueAtTime(.001,t);lg.gain.linearRampToValueAtTime(this.theme==='title'?.30:.16,t+.005);lg.gain.exponentialRampToValueAtTime(.001,t+d*.85);layer.connect(band);band.connect(lg);lg.connect(drive);layer.start(t);layer.stop(t+d);extras.push(layer,band,lg);}
  if(ambient&&sample&&texture.partial){const partial=c.createBiquadFilter(),pg=c.createGain();partial.type='bandpass';partial.Q.value=3.5;partial.frequency.setValueAtTime(texture.partial,t);partial.frequency.linearRampToValueAtTime(texture.partial*1.24,t+d);pg.gain.value=.38;source.connect(partial);partial.connect(pg);pg.connect(g);extras.push(partial,pg);}
  if(texture.cutoff){filter.frequency.cancelScheduledValues(t);filter.frequency.setValueAtTime(texture.cutoff,t);filter.frequency.linearRampToValueAtTime(texture.cutoff*.55,t+d);}
  if(texture.gate){const peak=gain*level*2.2;g.gain.cancelScheduledValues(t);g.gain.setValueAtTime(.0001,t);for(let at=t;at<t+d-.06;at+=texture.gate){g.gain.linearRampToValueAtTime(peak,at+.02);g.gain.linearRampToValueAtTime(peak*.2,Math.min(at+texture.gate*.8,t+d-.02));}g.gain.linearRampToValueAtTime(.0001,t+d);}
  const voice={music,stop:(at)=>{const end=Math.max(c.currentTime,at);g.gain.cancelScheduledValues(end);g.gain.setTargetAtTime(.0001,end,.006);try{source.stop(end+.035);}catch{}}};
  if(music&&drum)slot=String(slot)+':'+instrument;
  if(music){this.slots.set(slot,voice);}else{const fx=[...this.voices].filter(v=>!v.music);if(fx.length>=16)fx[0].stop(c.currentTime);}
  this.voices.add(voice);source.onended=()=>{source.disconnect();for(const node of extras)node.disconnect();filter.disconnect();drive?.disconnect();g.disconnect();stereo.disconnect();this.voices.delete(voice);if(this.slots.get(slot)===voice)this.slots.delete(slot);};source.start(t,sample&&ambient?Math.min(sample.duration*.3,(freq%7)*.07):0);source.stop(t+d+.04);
 }
 effect(e,id='gudeco',pan=0){if(!this.enabled||this.paused||!this.ctx||this.ctx.state!=='running')return;
  const t=this.ctx.currentTime+.003,play=(ins,f,d=.16,v=1,delay=0,slide=1)=>this.voice(ins,f,t+delay,d,v,pan,false,null,slide);
  if(['hit','ko','fight'].includes(e.type))this.duck(this.musicDuck,t,e.type==='ko'?.55:.76,.10);
  if(e.type==='hit'){play('impact',e.kind==='kick'?57:76,.20);play('snare',80,.085,.7);}
  if(e.type==='block'){play('guard',185,.12,.8,0,.68);play('snare',80,.04,.30);}
  if(e.type==='land')play('impact',42,.26,.85);
  if(e.type==='jump')play('air',90,.10,.35);
  if(e.type==='evade'){play('keys',147,.17,.6);play('keys',220,.19,.42,.07);}
  if(e.type==='poison')play('acid',70,.12,.28);
  if(e.type==='attack'){
   if(['punch','kick','melee'].includes(e.kind)){play('air',90,e.kind==='kick'?.17:.09,.65);if(e.kind==='melee')play(id==='gudeco'?'guitar':'bongo',id==='gudeco'?82:110,.18,.65);}
   else if(id==='gudeco'){if(e.kind==='special2'){play('guitar',164.8,.58,.52,0,1.38);play('guitar',169.2,.52,.32,.06,1.35);play('keys',329.6,.20,.28,.29,.75);}else [82.4,123.5,164.8].forEach((f,i)=>play('guitar',f,.48,.65,i*.025,.97));}
   else if(id==='mari'){[146.8,174.6,207.7].forEach((f,i)=>play('hex',f,.35,.65,i*.065,.72));if(e.kind==='special2'){play('reed',196,.16,.5,.16,.7);play('reed',164,.16,.5,.32,.75);}}
   else if(id==='andre'){if(e.kind==='special1')play('surf',80,.65);else for(let i=0;i<7;i++)play('paper',90,.10,.65,i*.075);}
   else if(e.kind==='special1'){play('flame',50,.55);play('bass',45,.35,.85,0,.55);}else{for(let i=0;i<4;i++)play('acid',60,.18,.7,i*.065);play('hex',90,.35,.6,0,.4);}
  }
  if(e.type==='round'){[73.4,110,87.3].forEach((f,i)=>play('keys',f,.24,.7,i*.12));}
  if(e.type==='fight'){play('kick',52,.30);play('guitar',110,.25,.7,.04);}
  if(e.type==='ko'){[110,103.8,73.4,55].forEach((f,i)=>play('horn',f,.38,.9,i*.15));play('impact',38,.48);}
  if(e.type==='over'){[73.4,87.3,110,146.8].forEach((f,i)=>play('keys',f,.5,.7,i*.09));}
 }
 async dispose(){this.stopTimer();for(const v of this.voices)v.stop(this.ctx.currentTime);if(this.ctx)await this.ctx.close();this.enabled=false;}
}
