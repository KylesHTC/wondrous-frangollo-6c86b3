/* Partners > Get Involved only. The other OCC pages are not modified. */
(function(){'use strict';
const content={
partner:['Become a Partner','Tell us about your organisation and how you would like to collaborate with OCC.'],
fund:['Fund OCC','Tell us about potential funding or sponsorship. No money is taken in this demo.'],
volunteer:['Volunteer','Tell us about the time or skills you could offer to the community.'],
other:['Other ways to help','Tell us about equipment, materials, services or other support you could provide.']
};
function close(){const m=document.getElementById('pgiModal');if(m)m.hidden=true;}
function open(type){
 const d=content[type];if(!d)return;
 const modal=document.getElementById('pgiModal');
 document.getElementById('pgiModalTitle').textContent=d[0];
 document.getElementById('pgiModalDesc').textContent=d[1];
 const form=document.getElementById('pgiContactForm');form.reset();form.hidden=false;
 document.getElementById('pgiConfirmation').hidden=true;
 modal.hidden=false;
 document.getElementById('pgiClose').focus();
}
document.addEventListener('DOMContentLoaded',()=>{
 const page=document.querySelector('[data-screen="pf-involved"]');if(!page)return;
 page.querySelectorAll('[data-pgi]').forEach(b=>b.addEventListener('click',()=>open(b.dataset.pgi)));
 document.getElementById('pgiClose').addEventListener('click',close);
 document.getElementById('pgiReturn').addEventListener('click',close);
 document.getElementById('pgiModal').addEventListener('click',e=>{if(e.target.id==='pgiModal')close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 document.getElementById('pgiContactForm').addEventListener('submit',e=>{
  e.preventDefault();
  if(!e.currentTarget.reportValidity())return;
  e.currentTarget.hidden=true;
  document.getElementById('pgiConfirmation').hidden=false;
 });
 // Optional link for checking this screen; regular app loading is unchanged.
 if(new URLSearchParams(location.search).get('occ-preview')==='get-involved'){
  if(typeof state!=='undefined'){
    state.role='Funder'; state.name=state.name||'OCC Member';
    if(state.access)state.access.funder=true;
  }
  if(typeof renderAll==='function')renderAll();
  if(typeof hideOnboarding==='function')hideOnboarding();
  if(typeof nav==='function')nav('pf-involved');
 }
});
})();
