/* V131 — generic menu toggles for the unified partner pages. */
(function(){
  function initMenus(){
    document.querySelectorAll('.pf131-menu-toggle').forEach(function(btn){
      if(btn.dataset.bound==='1') return;
      btn.dataset.bound='1';
      var screen = btn.closest('.screen');
      var drawer = screen && screen.querySelector('.pf131-drawer');
      if(!drawer) return;
      btn.addEventListener('click', function(ev){
        ev.stopPropagation();
        var willOpen = drawer.hasAttribute('hidden');
        document.querySelectorAll('.pf131-drawer').forEach(function(other){ if(other!==drawer) other.hidden = true; });
        document.querySelectorAll('.pf131-menu-toggle').forEach(function(other){ if(other!==btn) other.setAttribute('aria-expanded','false'); });
        drawer.toggleAttribute('hidden', !willOpen);
        btn.setAttribute('aria-expanded', String(willOpen));
      });
      drawer.addEventListener('click', function(ev){
        if(ev.target.closest('[data-go]')){ drawer.hidden = true; btn.setAttribute('aria-expanded','false'); }
      });
    });
    document.addEventListener('click', function(ev){
      document.querySelectorAll('.pf131-menu-toggle').forEach(function(btn){
        var screen = btn.closest('.screen');
        var drawer = screen && screen.querySelector('.pf131-drawer');
        if(drawer && !screen.contains(ev.target)){
          drawer.hidden = true; btn.setAttribute('aria-expanded','false');
        }
      });
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', initMenus); else initMenus();
  window.addEventListener('load', function(){ if(typeof bindNav==='function') bindNav(); initMenus(); });
})();
