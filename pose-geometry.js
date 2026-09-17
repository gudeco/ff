// Source-space neck -> hip -> knee -> ankle measurements. These follow the
// body through a bent pose; hats, weapons, tails and raised hands are excluded.
// Calibrate once from anatomy, never from a sprite rectangle or a hitbox.
export const POSE_GEOMETRY = {
 gudeco: { reference:1, scale:.58, poses:[
  [[246,130],[250,349],[285,447],[288,548]],
  [[738,130],[704,331],[764,425],[784,542]],
  [[241,665],[211,824],[269,897],[262,986]],
  [[800,678],[778,823],[688,921],[607,993]]
 ]},
 mari: {reference:0,scale:.73,poses:[
  [[230,680],[224,811],[219,890],[222,978]],
  [[566,482],[566,724],[641,959],[563,1157]]
 ]},
 andre: {reference:0,scale:.46,poses:[
  [[235,256],[246,510],[338,638],[337,777]],
  [[1067,676],[1092,821],[1144,907],[1196,980]]
 ]},
 vorath: {reference:0,scale:.84,poses:[
  [[300,208],[222,313],[281,392],[267,464]],
  [[814,213],[728,293],[814,354],[788,458]],
  [[328,738],[232,818],[294,889],[278,978]]
 ]}
};
export function bodyLength(points){return points.slice(1).reduce((sum,p,i)=>sum+Math.hypot(p[0]-points[i][0],p[1]-points[i][1]),0);}
export function poseGeometry(id,pose){const entry=POSE_GEOMETRY[id],points=entry.poses[pose];return {scale:entry.scale*bodyLength(entry.poses[entry.reference])/bodyLength(points),pivotX:points[1][0]};}
