/* OCC V126 — refined self-contained Partners inbox. No server messaging integration. */
(function(){
 'use strict';
 const root=document.querySelector('[data-screen="pf-messages"]');if(!root)return;
 const $=(s)=>root.querySelector(s);
 const icons={handshake:'<path d="M2 12 7 7l4 2 4-2 7 5-6 8-5-3-3 3z"/><path d="m8 12 4 4 4-3"/>',people:'<circle cx="12" cy="8" r="3"/><path d="M5 21v-3a7 7 0 0 1 14 0v3M2 14v5m20-5v5"/>',briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M9 7V4h6v3M3 13h18"/>',megaphone:'<path d="M3 10h5l11-5v14l-11-5H3zM8 14l2 6"/>',shield:'<path d="m12 2 8 4v5c0 6-4 10-8 11-4-1-8-5-8-11V6zM8 12l3 3 5-6"/>',calendar:'<rect x="3" y="5" width="18" height="17" rx="2"/><path d="M7 2v6m10-6v6M3 11h18"/>',system:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',council:'<path d="M4 10h16M6 10V8l6-3 6 3v2M7 10v7M12 10v7M17 10v7M5 21h14"/>',leaf:'<path d="M5 19c7 0 13-6 13-13-7 0-13 6-13 13Z"/><path d="M5 19c2-4 6-7 11-9"/>'};
 const samples=[
  {id:'demo-1',name:'OCC Partnerships',category:'System',icon:'people',text:'Welcome to the Partners area. You can post company offers and opportunities here.',time:'Demo',demo:true},
  {id:'demo-2',name:'Bolton Council',category:'Enquiries',icon:'council',text:'Thank you for your support with the Breightmet pilot.',time:'1d ago',demo:true},
  {id:'demo-3',name:'National Lottery',category:'OCC Team',icon:'leaf',text:"Your pilot proposal has been received. We'll be in touch with next steps.",time:'3d ago',demo:true},
  {id:'demo-4',name:'Company Offers',category:'Enquiries',icon:'megaphone',text:'Your proposed discount offer is ready for review before publication.',time:'Demo',demo:true},
  {id:'demo-5',name:'OCC Project Team',category:'OCC Team',icon:'calendar',text:'A new community project is being planned in Breightmet. See how partners can help.',time:'Demo',demo:true}
 ];
 const escapeHtml=(t)=>String(t==null?'':t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let filter='All', selected=null;
 function messages(){
   let real=[];
   try{if(typeof state!=='undefined'&&state.notifications){real=state.notifications.slice(0,15).map((n,i)=>({id:'local-'+i,name:n.title||'OCC notification',category:'System',icon:'shield',text:n.text||'',time:(n.ts&&typeof fmtWhen==='function')?fmtWhen(n.ts):(n.when||'Saved notification'),demo:false}))}}catch(e){}
   return [...real,...samples];
 }
 function setUnread(){
   const count=messages().filter(x=>!x.demo).length;
   document.querySelectorAll('.pfmsg124-home-badge').forEach(badge=>{badge.textContent=String(Math.min(9,count));badge.hidden=count===0})
 }
 function render(){
   try {if(typeof state!=='undefined'&&state.name){$('#pfmsg124Avatar').textContent=state.name.trim().split(/\s+/).slice(0,2).map(w=>w.charAt(0)).join('').toUpperCase()||'KR'}}catch(e){}
   setUnread();
   root.querySelectorAll('[data-pfmsg-tab]').forEach(b=>{const on=b.dataset.pfmsgTab===filter;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on))});
   const rows=messages().filter(x=>filter==='All'||x.category===filter);
   $('#pfmsg124List').innerHTML=rows.length?rows.map(d=>`<button type="button" class="pfmsg124-card" data-pfmsg-id="${escapeHtml(d.id)}"><span class="pfmsg124-micon" aria-hidden="true"><svg viewBox="0 0 24 24">${icons[d.icon]||icons.system}</svg></span><span class="pfmsg124-mcopy"><b class="pfmsg124-mname">${escapeHtml(d.name)}</b><span class="pfmsg124-mpreview">${escapeHtml(d.text)}</span></span>${d.demo?'<span class="pfmsg124-demo">DEMO</span>':`<span class="pfmsg124-mtime">${escapeHtml(d.time)}</span>`}<span class="pfmsg124-chevron" aria-hidden="true">›</span></button>`).join(''):'<p class="pfmsg124-empty">No messages in this category.</p>';
   root.querySelectorAll('[data-pfmsg-id]').forEach(b=>b.onclick=()=>open(b.dataset.pfmsgId));
 }
 function open(id){
   selected=messages().find(x=>x.id===id);if(!selected)return;
   $('#pfmsg124DetailTitle').textContent=selected.name;
   $('#pfmsg124DetailType').textContent=(selected.demo?'Sample conversation':'OCC app notification')+' · '+selected.category;
   $('#pfmsg124DetailText').textContent=selected.text;
   $('#pfmsg124Replies').replaceChildren();$('#pfmsg124Reply').value='';
   $('#pfmsg124DemoComposer').hidden=!selected.demo;$('#pfmsg124SystemNote').hidden=!!selected.demo;
   $('#pfmsg124Inbox').hidden=true;$('#pfmsg124Detail').hidden=false;
   window.scrollTo({top:0,behavior:'smooth'});
 }
 function back(){$('#pfmsg124Inbox').hidden=false;$('#pfmsg124Detail').hidden=true;render();window.scrollTo({top:0,behavior:'smooth'})}
 root.querySelectorAll('[data-pfmsg-tab]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.pfmsgTab;back()}));
 $('#pfmsg124Back').addEventListener('click',back);
 $('#pfmsg124Send').addEventListener('click',()=>{
   const input=$('#pfmsg124Reply'),msg=input.value.trim();if(!msg||!selected||!selected.demo)return;
   const b=document.createElement('div');b.className='pfmsg124-reply';b.textContent=msg;$('#pfmsg124Replies').appendChild(b);input.value='';
 });
 $('#pfmsg124Reply').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('#pfmsg124Send').click()}});
 window.OCCPartnerMessages={render,back};
 render();
})();
