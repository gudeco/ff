import {poseGeometry} from './pose-geometry.js';
// Render the supplied paintings through hand-authored silhouette paths.
// No generated replacement sprites, recoloring, smoothing filter, or nonuniform scaling.
const defs = {
 gudeco: [
  ['gudeco-original',.58,247,577,[[[207,45],[242,33],[273,43],[291,64],[291,97],[280,116],[281,131],[309,148],[320,188],[328,232],[321,258],[338,281],[333,326],[312,340],[310,391],[302,441],[302,522],[316,557],[319,574],[274,575],[262,565],[269,535],[263,482],[264,418],[250,372],[239,423],[224,486],[213,538],[210,573],[158,576],[157,562],[176,536],[179,479],[184,422],[193,358],[190,314],[178,284],[166,253],[166,215],[175,169],[190,145],[215,131],[213,116],[201,94],[200,66]]]],
  ['gudeco-original',.58,706,577,[[[720,44],[756,41],[777,53],[782,80],[769,106],[769,123],[751,139],[782,151],[792,176],[791,227],[812,237],[832,233],[836,224],[846,230],[857,223],[889,219],[899,229],[898,242],[856,247],[830,259],[803,269],[764,282],[759,307],[777,332],[791,367],[792,413],[789,477],[802,530],[823,550],[833,555],[830,568],[785,570],[769,563],[764,536],[754,475],[748,414],[723,358],[700,402],[675,454],[646,509],[624,548],[624,574],[580,577],[576,563],[582,534],[600,483],[621,436],[639,387],[650,342],[636,329],[638,288],[643,270],[627,249],[624,219],[638,183],[657,151],[687,131],[704,124],[702,103],[696,84],[706,58]]]],
  ['gudeco-original',.58,225,1011,[[[232,592],[268,598],[283,617],[278,644],[259,663],[260,681],[277,699],[302,716],[325,699],[352,690],[372,695],[382,708],[368,723],[347,722],[309,742],[279,758],[279,785],[264,803],[276,827],[294,871],[297,902],[282,954],[278,984],[294,995],[294,1008],[251,1010],[239,1000],[249,967],[253,916],[238,887],[214,849],[195,887],[165,923],[137,957],[117,986],[117,1008],[77,1010],[72,1000],[81,970],[102,923],[123,883],[139,837],[142,805],[127,783],[128,756],[118,735],[122,706],[145,680],[179,659],[208,651],[208,631],[214,608]]]],
  ['gudeco-original',.58,741,1013,[[[778,595],[808,590],[834,601],[846,621],[840,648],[820,668],[820,682],[848,699],[878,656],[904,595],[920,548],[913,539],[922,526],[935,519],[948,527],[947,540],[935,550],[925,588],[911,643],[900,688],[909,722],[902,764],[878,789],[842,808],[836,822],[860,846],[875,869],[872,900],[853,931],[850,974],[876,993],[881,1008],[834,1010],[813,1001],[815,966],[831,914],[827,884],[791,858],[753,891],[708,922],[663,954],[623,988],[631,1008],[618,1014],[588,1010],[580,994],[591,972],[629,934],[670,893],[708,850],[742,815],[748,796],[718,780],[688,756],[680,731],[691,704],[716,686],[752,674],[760,656],[754,636],[762,610]]]]
 ],
 mari: [
  ['roster-original',.73,227,1007,[[[177,610],[179,600],[205,586],[223,577],[240,580],[253,606],[260,614],[290,612],[294,622],[269,635],[257,641],[254,661],[246,674],[264,699],[270,735],[281,754],[291,752],[300,761],[297,776],[280,780],[263,771],[247,743],[244,790],[256,835],[266,894],[278,951],[276,974],[287,989],[301,995],[301,1006],[260,1006],[250,995],[250,969],[187,966],[181,989],[179,1004],[156,1005],[152,991],[159,966],[164,928],[175,871],[180,830],[180,786],[172,771],[170,742],[174,711],[184,683],[189,662],[200,646],[168,649],[161,644],[182,630]]]],
  ['mari-original',.285,552,1250,[[[382,140],[409,137],[432,157],[439,185],[424,199],[448,290],[467,378],[491,449],[528,464],[540,445],[538,417],[514,407],[496,377],[488,355],[456,350],[399,365],[343,352],[296,358],[247,351],[269,320],[313,273],[346,250],[377,235],[405,234],[393,198],[382,178]],[[415,303],[447,312],[470,324],[513,341],[537,359],[551,372],[567,347],[590,336],[615,333],[616,352],[597,373],[590,413],[572,431],[570,450],[603,453],[633,410],[650,361],[670,284],[676,192],[662,164],[655,134],[648,114],[656,84],[677,71],[704,71],[723,96],[723,128],[708,148],[709,214],[710,282],[704,351],[692,405],[666,464],[644,499],[650,545],[642,613],[654,672],[671,722],[718,767],[747,809],[765,869],[787,947],[803,1008],[798,1064],[778,1101],[741,1138],[717,1173],[699,1222],[679,1246],[654,1255],[626,1244],[609,1212],[591,1176],[565,1158],[540,1148],[511,1125],[497,1104],[523,1085],[551,1054],[507,1075],[449,1089],[402,1105],[352,1100],[325,1083],[332,1052],[358,1030],[386,1014],[401,992],[369,939],[344,904],[326,917],[309,944],[288,953],[267,941],[262,914],[236,934],[218,924],[220,890],[235,856],[268,818],[293,799],[317,806],[339,825],[365,819],[397,837],[419,861],[439,864],[459,830],[492,779],[513,725],[510,678],[501,639],[492,594],[502,551],[493,516],[470,494],[455,474],[445,434],[432,397],[421,351]]]]
 ],
 andre: [
  ['andre-original',.46,257,816,[[[185,144],[217,130],[245,133],[264,154],[275,185],[282,201],[275,229],[262,247],[259,268],[290,289],[315,318],[379,264],[443,227],[502,212],[530,215],[533,234],[511,282],[467,348],[422,403],[383,447],[379,463],[354,474],[350,500],[366,551],[387,600],[396,633],[389,663],[366,712],[352,760],[365,778],[402,786],[411,800],[386,806],[342,801],[326,793],[323,773],[324,742],[340,691],[351,641],[333,616],[337,600],[313,600],[301,596],[296,624],[284,648],[254,673],[224,703],[197,743],[171,780],[188,794],[216,799],[218,811],[200,816],[172,811],[152,798],[138,779],[141,754],[157,719],[170,687],[179,657],[204,636],[222,622],[226,604],[216,601],[210,561],[205,540],[171,548],[141,543],[137,521],[144,502],[143,469],[128,450],[113,458],[113,494],[104,519],[89,529],[79,522],[82,502],[74,500],[72,464],[82,419],[84,387],[79,365],[92,343],[102,312],[121,282],[166,261],[191,253],[197,234],[181,221],[163,202],[158,174]]]],
  ['roster-original',.73,1104,1009,[[[1043,579],[1063,570],[1081,574],[1093,590],[1095,613],[1098,636],[1090,660],[1080,670],[1114,678],[1140,686],[1160,700],[1176,728],[1177,763],[1189,778],[1184,803],[1164,801],[1149,778],[1147,741],[1125,725],[1128,782],[1136,816],[1148,852],[1158,882],[1154,900],[1168,924],[1191,953],[1209,967],[1217,990],[1208,1004],[1179,1007],[1164,1002],[1178,989],[1177,975],[1155,948],[1128,921],[1108,900],[1097,873],[1077,854],[1066,882],[1052,910],[1053,944],[1055,978],[1074,992],[1075,1003],[1040,1007],[1020,1001],[1017,989],[1029,975],[1021,927],[1017,899],[1021,872],[1040,835],[1053,803],[1046,786],[1019,787],[1007,799],[990,785],[991,772],[964,765],[924,743],[888,710],[857,680],[839,661],[840,651],[864,645],[914,645],[963,651],[1015,666],[1033,670],[1036,654],[1028,641],[1027,614]]]]
 ],
 vorath: [
  ['vorath-original',.84,230,489,[[[144,36],[169,35],[206,55],[232,61],[200,23],[231,33],[260,57],[275,65],[257,24],[282,29],[308,60],[320,79],[323,32],[336,45],[344,89],[365,112],[387,126],[391,155],[395,185],[382,219],[366,229],[353,213],[344,236],[349,263],[373,287],[388,309],[397,341],[389,379],[376,409],[365,414],[357,399],[364,372],[357,357],[347,373],[346,401],[337,408],[330,391],[333,365],[331,333],[304,304],[285,285],[272,288],[258,323],[270,345],[299,365],[306,395],[294,425],[281,445],[293,455],[339,459],[373,471],[374,486],[273,489],[251,480],[250,454],[268,410],[244,392],[213,370],[192,387],[169,418],[151,451],[166,470],[198,475],[198,488],[129,490],[106,481],[71,495],[54,487],[32,482],[34,472],[66,467],[69,450],[49,430],[49,400],[61,370],[80,343],[109,322],[130,301],[132,278],[119,258],[103,250],[90,225],[97,222],[103,193],[120,165],[134,147],[143,123],[151,112],[139,105],[143,89],[166,91],[179,75]],[[121,353],[98,374],[80,407],[85,431],[96,444],[116,414],[135,389]],[[175,229],[157,256],[165,279],[158,308],[147,335],[137,351],[151,365],[151,387],[161,394],[171,377],[181,353],[194,319],[208,288],[215,258]]]],
  ['vorath-original',.84,749,497,[[[626,46],[675,46],[701,56],[704,46],[663,8],[697,16],[727,43],[738,59],[729,10],[746,21],[766,56],[779,66],[785,17],[800,47],[806,72],[826,83],[852,112],[876,137],[890,162],[890,193],[877,218],[861,227],[848,210],[837,239],[870,252],[900,233],[923,206],[928,185],[920,174],[922,155],[936,141],[952,136],[971,147],[981,159],[979,171],[991,179],[1000,196],[996,220],[985,224],[981,203],[967,206],[970,227],[956,234],[949,223],[937,239],[921,270],[889,288],[860,298],[836,286],[807,265],[783,250],[771,272],[788,290],[820,308],[845,335],[847,362],[826,393],[808,425],[807,446],[835,460],[879,467],[879,482],[792,484],[771,475],[769,452],[785,414],[799,376],[777,354],[748,339],[729,364],[711,392],[686,412],[673,444],[678,465],[697,475],[697,491],[642,499],[616,488],[605,466],[608,445],[623,412],[647,382],[667,346],[652,323],[634,342],[611,370],[593,396],[584,425],[594,451],[611,457],[609,472],[583,468],[556,449],[550,421],[556,391],[574,359],[602,327],[629,300],[644,276],[627,269],[608,267],[613,281],[600,298],[581,296],[583,282],[568,282],[556,270],[553,249],[563,229],[571,204],[582,181],[571,178],[578,157],[596,155],[612,130],[586,126],[572,115],[572,108],[609,112],[627,103],[645,83],[630,69]]]],
  ['vorath-original',.84,228,1004,[[[146,533],[173,535],[204,551],[226,575],[237,587],[224,546],[242,553],[259,581],[280,602],[294,624],[285,578],[299,591],[316,623],[330,635],[320,590],[339,608],[352,641],[377,659],[394,677],[405,701],[399,730],[389,754],[371,760],[357,741],[350,751],[347,783],[373,796],[408,801],[436,791],[449,779],[454,761],[468,752],[477,761],[479,779],[497,789],[507,805],[509,832],[504,853],[491,854],[487,828],[473,827],[470,853],[458,862],[451,850],[452,824],[425,835],[395,850],[368,857],[340,847],[313,828],[290,814],[273,819],[278,839],[299,856],[314,881],[312,908],[292,936],[290,962],[313,976],[365,982],[372,995],[363,1002],[276,1002],[255,989],[258,960],[277,913],[253,896],[232,885],[214,909],[188,931],[176,954],[182,979],[208,988],[208,1002],[144,1006],[125,995],[116,1004],[78,1007],[56,995],[29,994],[22,984],[51,980],[64,966],[61,947],[40,931],[34,909],[39,887],[51,864],[76,839],[105,818],[132,792],[143,765],[125,751],[106,745],[110,728],[95,723],[76,723],[60,709],[71,702],[54,693],[44,680],[73,687],[89,675],[113,668],[130,651],[112,638],[88,628],[85,616],[114,619],[148,628],[165,614],[182,596],[164,565]],[[129,849],[101,866],[81,889],[75,912],[83,933],[103,947],[114,924],[130,900],[146,878]]]]
 ]
};

// Complete outline of the raised-arm source pose, including the wide hat and hair.
defs.mari[1][4]=[[[378,158],[391,141],[414,135],[437,145],[453,168],[455,199],[449,216],[454,234],[479,241],[518,269],[545,281],[579,286],[617,275],[655,259],[668,259],[670,229],[674,185],[669,163],[653,144],[646,114],[651,90],[668,72],[698,69],[715,81],[724,105],[722,132],[713,153],[715,176],[718,221],[719,272],[716,307],[707,346],[692,389],[674,430],[657,477],[653,516],[663,542],[667,578],[662,618],[648,659],[650,694],[650,735],[661,781],[684,805],[716,833],[749,871],[776,907],[794,947],[803,984],[796,1027],[780,1061],[756,1095],[734,1092],[707,1080],[685,1076],[673,1088],[651,1106],[647,1137],[631,1161],[612,1187],[617,1210],[628,1231],[622,1245],[606,1251],[587,1243],[570,1223],[556,1197],[545,1175],[523,1172],[508,1158],[502,1138],[510,1120],[534,1100],[563,1082],[599,1066],[598,1059],[556,1070],[507,1091],[454,1099],[414,1106],[382,1100],[354,1088],[343,1069],[338,1045],[340,1021],[351,998],[370,979],[372,967],[356,942],[342,918],[330,900],[311,895],[295,908],[281,929],[271,943],[253,946],[238,943],[221,935],[219,916],[225,891],[236,870],[257,848],[276,831],[288,813],[301,801],[317,798],[334,802],[348,815],[358,840],[377,857],[389,884],[402,905],[415,905],[426,866],[434,827],[451,783],[473,743],[492,699],[500,658],[496,624],[490,598],[486,579],[469,589],[445,594],[420,599],[394,615],[375,623],[372,601],[352,595],[334,602],[326,590],[329,571],[325,560],[315,547],[319,530],[337,514],[367,492],[338,494],[299,493],[297,485],[322,465],[349,444],[375,419],[390,394],[391,368],[373,347],[348,326],[330,315],[310,320],[289,333],[264,352],[247,353],[254,338],[270,315],[292,289],[312,268],[333,247],[360,237],[391,233],[405,235],[403,215],[394,199],[385,185]],[[609,354],[636,337],[657,323],[648,366],[629,411],[610,449],[608,421],[604,399]]];
// Restore complete original guitar/face contours in both special poses.
defs.gudeco[2][4]=[[[225,592],[259,593],[286,607],[296,626],[289,651],[272,673],[271,687],[293,700],[311,714],[338,699],[351,688],[371,691],[383,702],[381,714],[365,724],[348,724],[322,742],[304,759],[280,766],[276,800],[259,824],[279,846],[295,872],[299,903],[283,953],[278,983],[294,995],[294,1010],[239,1011],[232,998],[247,958],[253,916],[231,887],[212,857],[189,893],[163,928],[135,963],[119,989],[118,1011],[72,1011],[70,996],[81,965],[103,921],[122,880],[139,839],[141,819],[132,803],[130,770],[117,749],[112,728],[119,702],[142,678],[177,655],[207,652],[206,633],[213,608]]];
defs.gudeco[3][4]=[[[779,592],[812,592],[838,606],[847,625],[840,650],[823,668],[841,667],[858,664],[878,646],[887,616],[901,603],[909,573],[902,568],[905,551],[914,539],[930,520],[941,520],[949,530],[945,543],[934,548],[936,559],[926,572],[919,576],[914,603],[922,616],[919,632],[910,641],[905,681],[919,691],[915,724],[902,750],[898,786],[882,803],[854,815],[837,828],[856,845],[872,869],[875,899],[856,937],[851,975],[877,994],[882,1011],[833,1011],[813,1001],[815,965],[831,914],[824,886],[790,859],[753,894],[709,924],[662,957],[625,990],[632,1010],[618,1016],[588,1011],[579,994],[591,971],[630,931],[671,890],[708,849],[742,815],[750,799],[721,785],[695,761],[680,740],[678,722],[689,698],[715,679],[750,666],[757,654],[752,636],[761,609]]];
// Background wedge below guitar, between its body and the shirt/trousers.
defs.gudeco[3][4].push([[822,810],[849,814],[837,829],[827,821]]);
export const images = {};
export const sprites = {};
// Original full-width framing, with the road visible in the hospital arena.
let rainyHospital;
export function drawStageBackground(ctx,stage,width=1280,height=800){
 let bg=images[stage];
 if(stage==='hospital'){
  if(!rainyHospital){
   rainyHospital=document.createElement('canvas');rainyHospital.width=bg.width;rainyHospital.height=bg.height;
   const c=rainyHospital.getContext('2d');c.filter='saturate(0.62) brightness(0.79)';c.drawImage(bg,0,0);c.filter='none';
   c.fillStyle='#304d7026';c.fillRect(0,0,bg.width,bg.height);
  }
  bg=rainyHospital;
 }
 const scale=width/bg.width;ctx.drawImage(bg,0,height-bg.height*scale,width,bg.height*scale);
}
export const cats = [];
export const effects = {};
// These are actual gaps between limbs, not a cut through the abdomen.
defs.vorath[0][4]=[defs.vorath[0][4][0],
 [[220,242],[237,234],[266,228],[269,245],[267,265],[279,279],[293,290],[265,282],[239,277],[227,268]],
 [[85,389],[100,370],[120,357],[112,382],[107,412],[92,442],[80,429],[77,408]]];
function cleanEdge(canvas,radius){
 const c=canvas.getContext('2d'),pixels=c.getImageData(0,0,canvas.width,canvas.height),a=pixels.data,original=new Uint8ClampedArray(a);
 for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){const i=(y*canvas.width+x)*4;if(!original[i+3])continue;let edge=false;
  for(let oy=-radius;oy<=radius&&!edge;oy++)for(let ox=-radius;ox<=radius;ox++){if(ox*ox+oy*oy>radius*radius)continue;const nx=x+ox,ny=y+oy;if(nx<0||ny<0||nx>=canvas.width||ny>=canvas.height||original[(ny*canvas.width+nx)*4+3]<128){edge=true;break;}}
  if(edge)a[i+3]=0;
 }c.putImageData(pixels,0,0);return canvas;
}
function clipSourceSilhouette(canvas,paths,originX,originY){
 const mask=document.createElement('canvas');mask.width=canvas.width;mask.height=canvas.height;const m=mask.getContext('2d');m.translate(-originX,-originY);m.beginPath();for(const path of paths){m.moveTo(...path[0]);path.slice(1).forEach(p=>m.lineTo(...p));m.closePath();}m.fill('evenodd');const c=canvas.getContext('2d');c.save();c.globalCompositeOperation='destination-in';c.drawImage(mask,0,0);c.restore();
}
function originalForeground(source,background,x,y,w,h){
 const layer=document.createElement('canvas');layer.width=w;layer.height=h;const c=layer.getContext('2d',{willReadFrequently:true});
 c.drawImage(images[source],-x,-y);const front=c.getImageData(0,0,w,h);c.clearRect(0,0,w,h);c.drawImage(images[background],-x,-y);const back=c.getImageData(0,0,w,h);
 for(let i=0;i<front.data.length;i+=4){const delta=Math.max(Math.abs(front.data[i]-back.data[i]),Math.abs(front.data[i+1]-back.data[i+1]),Math.abs(front.data[i+2]-back.data[i+2]));const oldFloor=source==='roster-original'&&x===145&&y+Math.floor(i/4/w)>951&&front.data[i+2]>44;if(delta<=3||oldFloor)front.data[i+3]=0;}
 // Only alpha changes. Every retained RGB triplet is from the supplied painting.
 c.putImageData(front,0,0);return layer;
}
function monsterCutout(x,y,w,h){
 // Keep the complete source cell. The former traced perimeter crossed the
 // bent knee and shin, so patching only interior holes could never fix them.
 const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
 const c=canvas.getContext('2d');c.drawImage(images['vorath-original'],-x,-y);
 const pixels=c.getImageData(0,0,w,h),rgba=pixels.data;
 const candidate=new Uint8Array(w*h),background=new Uint8Array(w*h),queue=new Uint32Array(w*h);let head=0,tail=0;
 for(let p=0;p<w*h;p++){const i=p*4,r=rgba[i],g=rgba[i+1],b=rgba[i+2];
  // The yellow backdrop has much more green-to-blue than red-to-green
  // contrast. Brown skin, dark limbs and green eyes remain untouched.
  candidate[p]=r>g&&g>45&&g-b>(r-g)*.8+6?1:0;
  const border=p<w||p>=w*(h-1)||p%w===0||p%w===w-1;
  if(candidate[p]&&(border||(g>110&&g-b>25))){background[p]=1;queue[tail++]=p;}
 }
 while(head<tail){const p=queue[head++],px=p%w;for(const n of [px>0?p-1:-1,px<w-1?p+1:-1,p-w,p+w])if(n>=0&&n<w*h&&candidate[n]&&!background[n]){background[n]=1;queue[tail++]=n;}}
 for(let p=0;p<w*h;p++)if(background[p])rgba[p*4+3]=0;
 c.putImageData(pixels,0,0);return canvas;
}
export async function loadArt(onSelectionReady=()=>{}) {
 const variationUrl=globalThis.loadGameArt?await globalThis.loadGameArt('andre-source-variations'):null;
 const variation=new Image();await new Promise((resolve,reject)=>{variation.onload=resolve;variation.onerror=reject;variation.src=variationUrl|| (typeof EMBEDDED_ART!=='undefined'?EMBEDDED_ART['andre-source-variations']:'assets/andre-source-variations.png');});images['andre-source-variations']=variation;
 const names=['mari-cat-black-exit','mari-cat-white-run','mari-cat-white','mari-cat-black','gudeco-cat-run','gudeco-cat-walk','gudeco-cat-actions','gudeco-feedback-cast','gudeco-feedback-effects','gudeco-walk','mari-walk','vorath-claw-ground','vorath-claw-air','vorath-fire-cast','vorath-fire-jet','andre-ground-punch','gudeco-ground-punch','vorath-walk','andre-push-kick','gudeco-ground-smash','andre-thesis-cast','andre-thesis-storm','andre-board-bash','gudeco-air-smash','gudeco-context-attacks','mari-context-attacks','andre-context-attacks','vorath-context-attacks','mari-pentagram-blast','vorath-fire-blast','gudeco-sonic-blast','andre-tsunami','plaza','hospital','street','gudeco-original','gudeco-select','vorath-original','andre-original','roster-original','mari-original','gudeco-hit-original','battle-original','gudeco-roundhouse','gudeco-roundhouse-v3','gudeco-damage-face-reference',...['gudeco','mari','andre','vorath'].map(id=>id+'-damage-'+(id==='gudeco'?'v2':'v1')),...['gudeco','mari','andre','vorath'].map(id=>id+'-jump-v2'),...['gudeco','mari','andre','vorath'].map(id=>id+'-movement'),'vorath-punch-right-drawn','vorath-punch-left-drawn',...['gudeco','mari','andre','vorath'].flatMap(id=>(id==='vorath'?['kick']:['punch','kick']).map(kind=>id+'-'+kind+'-drawn'))];
 const core=new Set([...Object.values(defs).flat().map(p=>p[0]),'street','plaza','roster-original','battle-original']);
 const loadNames=list=>Promise.all(list.map(async name=>{const url=globalThis.loadGameArt?await globalThis.loadGameArt(name):'assets/'+name+'.png';return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{images[name]=img;resolve()};img.onerror=()=>reject(new Error('Could not load '+name));img.src=url});}));
 await loadNames(names.filter(n=>core.has(n)));
 for(const [id,poses] of Object.entries(defs)) {if(id==='vorath')continue;sprites[id]=poses.map(([source,_legacyScale,_legacyPivot,feet,paths],pose)=>{
   const {scale,pivotX:pivot}=poseGeometry(id,pose);
   const points=paths.flat(), minX=Math.floor(Math.min(...points.map(p=>p[0]))),minY=Math.floor(Math.min(...points.map(p=>p[1])));
   const w=Math.ceil(Math.max(...points.map(p=>p[0])))-minX+1,h=Math.ceil(Math.max(...points.map(p=>p[1])))-minY+1;
   const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
   const c=canvas.getContext('2d');c.save();c.translate(-minX,-minY);c.beginPath();
   for(const path of paths){c.moveTo(...path[0]);path.slice(1).forEach(p=>c.lineTo(...p));c.closePath()}
   c.clip('evenodd');c.drawImage(images[source],0,0);c.restore();
   return {image:canvas,scale,pivot:pivot-minX,feet:feet-minY,source,paths,originX:minX,originY:minY};
 });}
 // Background-connected matte removal preserves every limb, including pixels
 // that fell outside the old hand-authored silhouette in all three poses.
 sprites.vorath=[];
 [[0,0,512,510],[512,0,512,510],[0,510,512,514]].forEach(([x,y,w,h],pose)=>{
  const {scale,pivotX}=poseGeometry('vorath',pose);
  sprites.vorath[pose]={image:monsterCutout(x,y,w,h),scale,pivot:pivotX-x,feet:defs.vorath[pose][3]-y,source:'vorath-original',originX:x,originY:y};
 });
 sprites.mari[0]={image:originalForeground('roster-original','street',145,568,165,444),scale:poseGeometry('mari',0).scale,pivot:poseGeometry('mari',0).pivotX-145,feet:439,source:'roster-original',originX:145,originY:568};
 sprites.andre[1]={image:originalForeground('roster-original','street',827,562,398,452),scale:poseGeometry('andre',1).scale,pivot:poseGeometry('andre',1).pivotX-827,feet:447,source:'roster-original',nativeFacing:-1,originX:827,originY:562};
 cleanEdge(sprites.mari[0].image,2);cleanEdge(sprites.mari[1].image,3);
 const boardPose=sprites.andre[1];clipSourceSilhouette(boardPose.image,defs.andre[1][4],827,562);
 const ac=boardPose.image.getContext('2d'),ap=ac.getImageData(0,0,398,452);
 for(let i=0;i<ap.data.length;i+=4){const y=562+Math.floor(i/4/398),[r,g,b]=ap.data.subarray(i,i+3);if(y>815&&(b>r*.9||g>r*.95))ap.data[i+3]=0;}ac.putImageData(ap,0,0);cleanEdge(boardPose.image,1);
 // The familiars also come directly from the supplied battle painting.
 const catPaths=[[[520,888],[531,869],[543,856],[564,848],[581,841],[598,841],[609,831],[617,830],[620,842],[626,832],[633,833],[635,849],[644,857],[641,870],[624,879],[615,878],[609,891],[618,902],[622,908],[610,909],[598,898],[594,884],[579,883],[564,894],[561,905],[548,906],[548,898],[549,886],[538,892],[528,895],[523,889]],[[520,924],[521,947],[535,959],[552,958],[559,943],[579,934],[600,931],[620,937],[632,937],[637,927],[645,929],[647,941],[658,938],[663,945],[661,962],[650,970],[638,966],[633,981],[636,999],[632,1009],[624,1009],[620,992],[620,979],[608,985],[604,1006],[595,1008],[591,1002],[593,982],[578,982],[578,1003],[568,1008],[560,1005],[564,984],[558,977],[549,970],[534,968],[522,959],[516,946],[517,930]]];
 for(const path of catPaths){const xs=path.map(p=>p[0]),ys=path.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys);const c=document.createElement('canvas');c.width=Math.max(...xs)-x+1;c.height=Math.max(...ys)-y+1;const ctx=c.getContext('2d');ctx.translate(-x,-y);ctx.beginPath();ctx.moveTo(...path[0]);path.slice(1).forEach(p=>ctx.lineTo(...p));ctx.closePath();ctx.clip();ctx.drawImage(images['battle-original'],0,0);cats.push(c);}
 cats[0]=originalForeground('battle-original','plaza',516,827,137,89);
 cats[1]=originalForeground('battle-original','plaza',510,916,158,98);
 effects.wave=originalForeground('battle-original','plaza',698,563,134,129);
 onSelectionReady();
 await new Promise(resolve=>requestAnimationFrame(()=>setTimeout(resolve,0)));
 await loadNames(names.filter(n=>!core.has(n)));
}
export function drawFighter(ctx,id,pose,x,y,facing=1,rotation=0,alpha=1) {
 const s=sprites[id][pose%sprites[id].length];ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);ctx.rotate(rotation);
 // Anatomy-calibrated scale, no destination rectangle and no per-fighter clip.
 // The entire cutout may extend beyond the independent combat body bounds.
 ctx.scale(facing*(s.nativeFacing||1)*s.scale,s.scale);ctx.drawImage(s.image,-s.pivot,-s.feet);ctx.restore();
}
export function drawPortrait(canvas,id) {
 const ctx=canvas.getContext('2d');canvas.width=280;canvas.height=390;
 // The supplied Gudeco portrait is this same right-facing original pose.
 // Use its transparent cutout, not the screenshot's charcoal matte and padding.
 const pose=id==='gudeco'?1:0;
 const s=sprites[id][pose],height=s.image.height*s.scale, fit=345/height;
 ctx.save();ctx.translate(140,379);ctx.scale(fit,fit);drawFighter(ctx,id,pose,0,0);ctx.restore();
}





