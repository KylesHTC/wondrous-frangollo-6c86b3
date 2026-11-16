/* OCC V130 — optional accessible Partners home shortcuts only. */
(function(){
 const screen=document.querySelector('[data-screen="partners-funders"]'); if(!screen)return;
 const menu=screen.querySelector('.pf130-menu'),drawer=screen.querySelector('#pf130Menu');
 if(menu&&drawer){
  menu.addEventListener('click',()=>{const open=drawer.hasAttribute('hidden');drawer.toggleAttribute('hidden',!open);menu.setAttribute('aria-expanded',String(open))});
  drawer.addEventListener('click',e=>{if(e.target.closest('[data-go]')){drawer.hidden=true;menu.setAttribute('aria-expanded','false')}});
  document.addEventListener('click',e=>{if(!screen.contains(e.target)||(!menu.contains(e.target)&&!drawer.contains(e.target))){drawer.hidden=true;menu.setAttribute('aria-expanded','false')}});
 }
})();
