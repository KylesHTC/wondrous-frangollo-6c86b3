/* OCC V136: Business menu only; application navigation continues to use app.js. */
(function(){
 function close(){document.querySelectorAll('.biz136-drawer').forEach(n=>n.hidden=true);document.querySelectorAll('.biz136-hamburger').forEach(n=>n.setAttribute('aria-expanded','false'))}
 document.addEventListener('click',e=>{
  const toggle=e.target.closest('.biz136-hamburger');if(toggle){e.preventDefault();let panel=document.getElementById(toggle.getAttribute('aria-controls'));let next=panel&&panel.hidden;close();if(panel&&next){panel.hidden=false;toggle.setAttribute('aria-expanded','true')}return}
  if(!e.target.closest('.biz136-drawer'))close();else if(e.target.closest('[data-go]'))close();
 });
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});window.addEventListener('hashchange',close);
})();