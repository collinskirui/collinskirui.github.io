(function(){
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
var t=document.getElementById('typed'),nm=document.getElementById('nm'),tg=document.getElementById('tag'),cu=document.getElementById('cur'),rh=document.querySelector('.rh');
function typeInto(el,txt,ms,done){var i=0;(function n(){el.textContent=txt.slice(0,++i);if(i<txt.length)setTimeout(n,ms+Math.random()*ms*.3);else if(done)setTimeout(done,320)})()}
function hold(el,txt){el.textContent=txt;var b=el.parentNode;b.style.minHeight=b.offsetHeight+'px';el.textContent=''}
function after(el){el.parentNode.insertBefore(cu,el.nextSibling)}
if(t&&nm&&tg){var w=t.getAttribute('data-text'),nt=nm.getAttribute('data-text'),full=tg.getAttribute('data-text');
  if(reduce){t.textContent=w;nm.textContent=nt;tg.textContent=full;rh.classList.add('show');after(tg)}
  else{hold(nm,nt);hold(tg,full);
    typeInto(t,w,85,function(){after(nm);typeInto(nm,nt,70,function(){rh.classList.add('show');setTimeout(function(){after(tg);typeInto(tg,full,28)},500)})})}}


if(document.getElementById("map")){
/* attack-surface map */
var N=[["Network","L2 switching, L3 routing, wireless and voice gateways. Designed for availability and hardened so one weak segment does not expose the rest."],
["Virtualization","ESXi hosts and vCenter: capacity, provisioning, snapshot hygiene and a locked-down management network."],
["Cloud","AWS storage on S3 and EFS, with access kept to what each workload needs."],
["Identity","User accounts, permissions and access control, including badge and biometric systems. Least privilege, reviewed regularly."],
["Backups","Scheduled, isolated and restore-tested. Recovery should never be a surprise."],
["Telephony","SIP trunks and call-centre users. Reliable routing, with limits that stop toll fraud."],
["Monitoring","Traffic, servers and environment watched in real time against a 99.9% uptime target, with logs kept for investigation."]];
var NS='http://www.w3.org/2000/svg',svg=document.getElementById('map'),lines=[],nodes=[],btns=[],auto=null,cur=0;
function el(n,a,p){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);(p||svg).appendChild(e);return e}
var cx=250,cy=200,gl=el('g',{});
N.forEach(function(n,k){var a=-Math.PI/2+k*2*Math.PI/N.length,x=cx+185*Math.cos(a),y=cy+140*Math.sin(a);n.x=x;n.y=y;
  lines.push(el('line',{x1:cx,y1:cy,x2:x,y2:y,'class':'ln'},gl))});
var core=el('g',{'class':'nd core'});el('rect',{x:cx-52,y:cy-22,width:104,height:44},core);var ct=el('text',{x:cx,y:cy},core);ct.textContent='ENTERPRISE';
N.forEach(function(n,k){var g=el('g',{'class':'nd',tabindex:0,role:'button','aria-label':n[0]});el('rect',{x:n.x-60,y:n.y-20,width:120,height:40},g);var tt=el('text',{x:n.x,y:n.y},g);tt.textContent=n[0];
  g.addEventListener('mouseenter',function(){pick(k,true)});g.addEventListener('click',function(){pick(k,true)});
  g.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(k,true)}});nodes.push(g);
  var b=document.createElement('button');b.type='button';b.className='chip';b.textContent=n[0];b.addEventListener('click',function(){pick(k,true)});document.getElementById('chips').appendChild(b);btns.push(b)});
var ph=document.querySelector('#panel h3'),pp=document.querySelector('#panel p');
function pick(k,user){cur=k;if(user&&auto){clearInterval(auto);auto=null}
  nodes.forEach(function(g,j){g.classList.toggle('on',j===k);lines[j].classList.toggle('on',j===k);btns[j].setAttribute('aria-pressed',j===k)});
  ph.textContent=N[k][0];document.getElementById("pi").setAttribute("href","#"+["i-net","i-srv","i-cloud","i-lock","i-box","i-phone","i-act"][k]);pp.textContent=N[k][1]}
pick(0);
if(!reduce)auto=setInterval(function(){pick((cur+1)%N.length)},4200);


}
if(document.getElementById("out")){
/* terminal */
var out=document.getElementById('out'),inp=document.getElementById('cmd');
var CM={
help:"commands: whoami, skills, certs, roles, languages, contact, clear",
whoami:"Collins Kirui. Infrastructure, network, cloud and security engineer. Open to roles across IT, infrastructure and security.",
skills:"networking   Cisco, ISR gateways, Aruba, Ubiquiti\nvirtual      VMware ESXi, vCenter\ncloud        AWS S3, EFS\nsecurity     Sophos XDR, FortiGate, FortiAnalyzer, ESET\nmonitoring   Zabbix, SolarWinds, Grafana, Prometheus\nsystems      HPE, NetApp ONTAP, SAP HANA\nphysical     Hikvision, Dahua, biometrics\ntelephony    3CX, Cisco UCS, SIP trunking",
certs:"AWS Certified Cloud Practitioner\nCCNA Routing and Switching",
roles:"IT infrastructure engineer\nNetwork engineer\nCloud and virtualization engineer\nSystems and IT operations\nTelecom and voice engineer\nSecurity analyst and engineer\nMalware analyst, DFIR",
languages:"English: fluent\nKiswahili: fluent\nItalian: basic",
contact:"linkedin.com/in/kiruicollins\ngithub.com/collinskirui"};
function line(txt,cls){var d=document.createElement('div');if(cls)d.className=cls;d.textContent=txt;out.appendChild(d);out.scrollTop=out.scrollHeight}
function run(c){c=c.trim().toLowerCase();if(!c)return;line('$ '+c,'c');
  if(c==='clear'){out.textContent='';return}
  if(CM[c])line(CM[c]);else line('command not found: '+c.slice(0,40)+'. type help','e')}
inp.addEventListener('keydown',function(e){if(e.key==='Enter'){run(inp.value);inp.value=''}});
['help','whoami','skills','certs','roles','contact'].forEach(function(c){var b=document.createElement('button');b.type='button';b.className='chip';b.textContent=c;b.addEventListener('click',function(){run(c)});document.getElementById('cc').appendChild(b)});
line('welcome. type help','e');



}
/* cursor grid */
var cv=document.getElementById('grid'),ctx=cv.getContext('2d');
var S=28,G=18,R=140,W,H,C,Rw,E,acc='#00ff41',ln='#1c2a20',dpr=Math.min(window.devicePixelRatio||1,2),mx=-999,my=-999,rip=[];
function colors(){var s=getComputedStyle(document.documentElement);acc=s.getPropertyValue('--acc').trim()||acc;ln=s.getPropertyValue('--line').trim()||ln}
function size(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);C=Math.ceil(W/S);Rw=Math.ceil(H/S);E=new Float32Array(C*Rw);colors()}
function base(){ctx.globalAlpha=.7;ctx.strokeStyle=ln;ctx.lineWidth=1;ctx.beginPath();for(var r=0;r<Rw;r++)for(var c=0;c<C;c++)ctx.rect(c*S+(S-G)/2+.5,r*S+(S-G)/2+.5,G,G);ctx.stroke()}
function frame(){
  ctx.clearRect(0,0,W,H);base();var mr=Math.max(W,H)*1.1;
  for(var k=rip.length-1;k>=0;k--){rip[k].r+=10;if(rip[k].r>mr)rip.splice(k,1)}
  if(Math.random()<.04)E[Math.floor(Math.random()*E.length)]=.7;
  ctx.strokeStyle=acc;ctx.fillStyle=acc;
  for(var r=0;r<Rw;r++)for(var c=0;c<C;c++){
    var i=r*C+c,cx2=c*S+S/2,cy2=r*S+S/2,dx=cx2-mx,dy=cy2-my,d=Math.sqrt(dx*dx+dy*dy),inf=d<R?1-d/R:0,tg=inf*inf;
    for(var q=0;q<rip.length;q++){var p=rip[q],dd=Math.abs(Math.hypot(cx2-p.x,cy2-p.y)-p.r);if(dd<50){var v=(1-dd/50)*.9*(1-p.r/mr);if(v>tg)tg=v}}
    var e=E[i];e=tg>e?e+(tg-e)*.35:e*.93;E[i]=e;if(e<.015)continue;
    var ox=inf&&d?dx/d*inf*8:0,oy=inf&&d?dy/d*inf*8:0,s=G*(1+e*.35);
    ctx.globalAlpha=Math.min(.3,e*.4);ctx.fillRect(cx2+ox-s/2,cy2+oy-s/2,s,s);
    ctx.globalAlpha=Math.min(.9,.2+e);ctx.strokeRect(cx2+ox-s/2+.5,cy2+oy-s/2+.5,s,s);
  }
  requestAnimationFrame(frame);
}
size();addEventListener('resize',size);
matchMedia('(prefers-color-scheme:dark)').addEventListener('change',colors);
if(reduce){base()}else{
  addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY},{passive:true});
  document.addEventListener('pointerleave',function(){mx=my=-999});
  addEventListener('pointerdown',function(e){rip.push({x:e.clientX,y:e.clientY,r:0})},{passive:true});
  requestAnimationFrame(frame);
}
})();
