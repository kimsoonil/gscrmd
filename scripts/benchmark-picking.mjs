import {performance} from 'node:perf_hooks';
import os from 'node:os';
import {getClickedVehicle} from '../utils/canvas-interaction.ts';
let state=42;const random=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
const results=[];
for(const count of [10000,50000,100000]){
 const points=Array.from({length:count},(_,i)=>({id:String(i),x:random()*1920,y:random()*1080}));
 for(let i=0;i<50;i++)getClickedVehicle(960,540,points);
 const times=[];
 for(let i=0;i<200;i++){const x=random()*1920,y=random()*1080;const t=performance.now();getClickedVehicle(x,y,points);times.push(performance.now()-t);}
 times.sort((a,b)=>a-b);results.push({count,iterations:200,medianMs:times[100],p95Ms:times[189]});
}
console.log(JSON.stringify({scope:'Node CPU picking only; excludes Canvas, FPS, network and rendering',seed:42,node:process.version,platform:os.platform(),arch:os.arch(),cpu:os.cpus()[0]?.model,results},null,2));
