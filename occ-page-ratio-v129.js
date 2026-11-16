/* Accessible native funder category filtering; demo data only. */
(function(){'use strict';let root=document.querySelector('.pf129-pf-funders');if(!root)return;
root.querySelectorAll('[data-pf129-filter]').forEach(tab=>tab.addEventListener('click',()=>{
 let value=tab.dataset.pf129Filter;
 root.querySelectorAll('[data-pf129-filter]').forEach(other=>{let yes=other===tab;other.classList.toggle('selected',yes);other.setAttribute('aria-selected',String(yes))});
 root.querySelectorAll('[data-pf129-category]').forEach(card=>card.hidden=value!=='all'&&card.dataset.pf129Category!==value);
}));})();
