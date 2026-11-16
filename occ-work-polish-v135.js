/* OCC V135: menu interaction for Looking for Work shared header. */
(function(){
 function closeAll(){ document.querySelectorAll('.work135-menu').forEach(function(n){n.hidden=true;});document.querySelectorAll('.work135-hamburger').forEach(function(n){n.setAttribute('aria-expanded','false');}); }
 document.addEventListener('click',function(ev){
  var menuToggle=ev.target.closest('.work135-hamburger');
  if(menuToggle){ev.preventDefault();var panel=document.getElementById(menuToggle.getAttribute('aria-controls'));var opening=!!panel && panel.hidden;closeAll();if(panel&&opening){panel.hidden=false;menuToggle.setAttribute('aria-expanded','true');}return;}
  if(ev.target.closest('.work135-menu [data-go]')) {closeAll();return;}
  if(!ev.target.closest('.work135-menu')) closeAll();
 });
 document.addEventListener('keydown',function(ev){if(ev.key==='Escape')closeAll();});
 window.addEventListener('hashchange',closeAll);
})();