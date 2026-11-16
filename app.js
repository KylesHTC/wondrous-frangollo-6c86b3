// V84.16 FOREST LOGIN + BUSINESS JOBS VISUAL UPGRADE
// V84.11 EXISTING ACCOUNT RETURN
// V84.7 RESTORED STARTUP FLOW — onboarding only
const state = JSON.parse(localStorage.getItem("occV30State")||'{"role":"","name":"","email":"","postcode":"","area":"","skills":"","goal":"","hours":0,"skillsCount":0,"refs":0,"saved":[],"claimed":[],"joined":[],"onboarded":false,"consents":{"evidence":true,"matching":true,"contact":false},"jobProfile":{"about":"","skills":"","interests":"","availability":"Immediately available","travel":"Up to 3 miles","visible":false},"evidence":[],"pipeline":{"interest":false,"interview":false,"employed":false},"employer":{"selected":null,"shortlist":[],"interviews":[],"hires":[]},"business":{"name":"Bolton Fencing & Landscaping","trade":"Fencing & Landscaping","area":"Bolton","services":"","about":"","profileComplete":false,"checks":{"identity":false,"business":false,"insurance":false},"contributions":[],"jobs":[]},"resident":{"request":null,"quotes":[],"selectedQuote":null,"job":null,"rating":0,"review":""},"ecosystem":{"events":[],"linkedBusinessReviews":0,"linkedBusinessJobs":0,"linkedHires":0},"credits":{"balance":0,"history":[],"awardedKeys":[],"partnerOffers":[{"id":"po1","partner":"Local Barber Partner","offer":"Free interview haircut","cost":10},{"id":"po2","partner":"Breightmet Café Partner","offer":"Interview-day meal","cost":8},{"id":"po3","partner":"Community Gym Partner","offer":"1-week gym access","cost":15}]},"funding":{"total":25000,"votesLeft":3,"projects":[{"id":"fp1","title":"Street clean-up & environmental work","votes":18,"budget":3500},{"id":"fp2","title":"Community garden & fencing repairs","votes":14,"budget":4200},{"id":"fp3","title":"Youth work experience projects","votes":21,"budget":5000},{"id":"fp4","title":"Support for elderly / vulnerable residents","votes":16,"budget":3000}],"allocations":[]}}')
if(!state.access) state.access={worker:state.role==="Worker",business:state.role==="Business",employer:state.role==="Employer"}
const save=()=>localStorage.setItem("occV30State",JSON.stringify(state))
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)]
function initials(name){name=name||"OCC Member";return name.split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase()}
const roleConfig={
 Jobseeker:{label:"Find Work & Opportunities",summary:"Build your work profile, upload your CV, find relevant opportunities and prove your experience.",progress:42,next:"Build your profile and show what you can do",nextText:"Choose your current status — employed, unemployed, studying or apprentice — then add your CV and evidence.",actions:[["cv","My CV & Work Profile","Upload your CV • skills • work details","work-profile"],["visible","My Opportunities","See suitable matches and employer interest","work-opportunities"],["employment","Find Work","Jobs • apprenticeships • experience","work-jobs"],["impact","My Applications","Applications • interviews • outcomes","work-applications"]]},
 Resident:{label:"Residents & Customers",summary:"Your local OCC space: find trusted local services, post jobs and stay connected to your community — with you in control of contact.",progress:35,next:"Choose what you need today",nextText:"Find a tradesperson, post a job, explore your community or manage your OCC activity.",actions:[["tools","Find a Tradesperson","Search, compare & choose","resident-browse"],["postJob","Post a Job","Free to post • you control contact","resident-request"],["community","My Community","Projects, updates & voting","community"],["profile","My OCC","Quotes, jobs & reviews","resident-account"]]},
 Business:{label:"Business & Employer",summary:"Your business space: find local work, recruit people and build your OCC Verified record from one profile.",progress:55,next:"Choose what your business needs today",nextText:"Use Find Work for local jobs and OCC opportunities, or Find People to recruit employees and apprentices.",actions:[["tools","Find Work","Resident, OCC & funded opportunities","business-find-work"],["candidates","Find People / Recruit","Employees & apprentices","employer-dashboard"],["business","My Business","Profile, jobs & verification","business-hub"],["giveback","OCC Verification","Contribution & trust","business-contribution"]]},
 Worker:{label:"OCC Worker",summary:"Your internal OCC staff space: deliver street-by-street community work, record evidence and help residents connect genuine needs into OCC.",progress:60,next:"Continue today’s community work",nextText:"Record OCC delivery and any genuine resident requests you discover while working in the area.",actions:[["impact","OCC Worker Hub","Today’s streets & activity","worker-hub"],["tools","Resident Needs a Trade","Create a resident request","worker-request"],["evidence","Log OCC Work","Delivery & evidence","worker-log"],["business","Local Trade Requests","See opportunities created","business-opportunities"]]},
 Funder:{label:"Partners & Funders",summary:"Your transparency dashboard: see funding, live projects, spending evidence and measurable outcomes.",progress:50,next:"See what funding is producing",nextText:"Follow the chain from funding to project, local delivery, verified evidence and outcome.",actions:[["impact","My Funding","Allocation & transparency","funding-hub"],["tools","Live Projects","Funded local work","funded-work"],["outcomes","Impact & Outcomes","Live verified results","funding-impact"],["evidence","Spending & Evidence","Open funding ledger","funding-ledger"]]}
}
const opportunities=[
 {id:1,title:"Painting & Decorating Trainee",company:"Bolton Decorators",type:"Apprenticeship",meta:"Bolton • Practical pathway"},
 {id:2,title:"Retail Assistant",company:"Local Supermarket",type:"Job",meta:"Bolton • Employer interested in verified reliability"},
 {id:3,title:"Community Garden Refresh",company:"OCC Community Project",type:"Community Experience",meta:"Breightmet • 4 verified hours"},
 {id:4,title:"Warehouse Operative",company:"Greater Manchester Logistics",type:"Job",meta:"Greater Manchester • Entry level"},
]
const community=[
 {id:"c1",title:"Street clean & resident support",meta:"Breightmet • Up to 3 verified hours",skill:"Reliability • Teamwork"},
 {id:"c2",title:"Community garden improvement",meta:"Bolton • Up to 4 verified hours",skill:"Practical skills • Teamwork"},
 {id:"c3",title:"Painting support project",meta:"Bolton • Up to 5 verified hours",skill:"Painting • Preparation"},
]
const candidates=[
 {id:"alex",name:"Alex Morgan",area:"Bolton",hours:22,activities:4,refs:2,skills:["Painting","Preparation","Teamwork"],note:"4 verified activities • 2 references",summary:"Looking for a painting and decorating opportunity. OCC evidence shows consistent attendance and practical community experience.",reliability:["100% attendance across verified activities","Supervisor sign-off recorded","Completed practical painting support"]},
 {id:"jamie",name:"Jamie Patel",area:"Bolton",hours:14,activities:3,refs:1,skills:["Retail","Customer service","Teamwork"],note:"Reliable attendance • 1 reference",summary:"Interested in retail and customer-facing work. Strong community participation record and positive reference.",reliability:["Reliable attendance","Positive community reference","Customer-facing volunteer experience"]},
 {id:"sam",name:"Sam Wilson",area:"Greater Manchester",hours:8,activities:2,refs:1,skills:["Warehouse","Teamwork","Manual handling"],note:"2 verified activities",summary:"Seeking warehouse or logistics work and building an OCC evidence record.",reliability:["2 verified activities completed","Team-based practical work","Available immediately"]},
 {id:"taylor",name:"Taylor Green",area:"Bolton",hours:27,activities:5,refs:2,skills:["Construction","Labouring","Groundwork"],note:"5 verified activities • 2 references",summary:"Construction-focused candidate with repeated verified community work and strong practical feedback.",reliability:["27 verified hours","Two supervisor references","Practical site-style experience"]}
]
function currentUserCandidate(){
  ensureJobState();
  if(!state.jobProfile?.visible) return null;
  const verified=(state.evidence||[]).filter(e=>e.status==="verified");
  const evSkills=[...new Set(verified.flatMap(e=>e.skills||[]))];
  const manual=(state.jobProfile.skills||state.skills||"").split(",").map(x=>x.trim()).filter(Boolean);
  const skills=[...new Set([...evSkills,...manual])];
  const hours=verified.reduce((n,e)=>n+(+e.hours||0),0) || (+state.hours||0);
  const refs=verified.filter(e=>e.signer).length || (+state.refs||0);
  return {
    id:"current-user",
    name:state.name||"OCC Member",
    area:state.area||"Bolton",
    hours,
    activities:verified.length || (hours?1:0),
    refs,
    skills:skills.length?skills:["Verified community experience"],
    note:`${verified.length || (hours?1:0)} verified activit${(verified.length || (hours?1:0))===1?"y":"ies"} • ${refs} reference${refs===1?"":"s"}`,
    summary:state.jobProfile.about||`OCC Verified candidate seeking ${state.jobProfile.interests||state.goal||"local employment opportunities"}.`,
    reliability:[
      hours?`${hours} verified OCC hours`:"OCC evidence record active",
      refs?`${refs} independent sign-off${refs===1?"":"s"}`:"Verified activity evidence",
      state.jobProfile.availability||"Availability recorded"
    ],
    isCurrentUser:true
  };
}
function employerCandidates(){
  const mine=currentUserCandidate();
  return mine?[mine,...candidates]:[...candidates];
}
const businesses=[
 {name:"Bolton Fencing & Landscaping",tag:"OCC VERIFIED",text:"Community contribution recorded • verified work evidence"},
 {name:"Local Barber Partner",tag:"OCC PARTNER",text:"Offers interview haircuts to eligible OCC participants"},
 {name:"Breightmet Café Partner",tag:"OCC PARTNER",text:"Offers interview-day meal support"},
]
const rewards=[
 {id:"r1",title:"Interview Haircut",text:"Free haircut from a participating local barber.",eligible:true},
 {id:"r2",title:"Interview Meal",text:"Meal support on the day of an eligible interview.",eligible:true},
 {id:"r3",title:"Partner Gym Week",text:"One-week introductory gym access from a participating partner.",eligible:false},
]
function updateBottomNav(){
 const second=$("#bottomSecond"),secondLabel=$("#bottomSecondLabel"),third=$("#bottomThird"),thirdLabel=$("#bottomThirdLabel"),fourth=$("#bottomFourth"),fourthLabel=$("#bottomFourthLabel"),funderMyOcc=$("#funderMyOccNav");
 if(!second||!third||!fourth)return; const recruitment=$("#bottomRecruitment"); if(recruitment) recruitment.style.display=state.role==="Business"?"":"none"; if(funderMyOcc) funderMyOcc.style.display=state.role==="Funder"?"":"none";
 if(state.role==="Resident"){second.dataset.go="resident-browse";secondLabel.textContent="Trades";third.dataset.go="community";thirdLabel.textContent="Community";fourth.dataset.go="resident-account";fourthLabel.textContent="My OCC";}
 else if(state.role==="Jobseeker"){second.dataset.go="work-jobs";secondLabel.textContent="Jobs";third.dataset.go="work-community";thirdLabel.textContent="Community";fourth.dataset.go="work-menu";fourthLabel.textContent="My OCC";}
 else if(state.role==="Business"){
   const homeBtn=document.querySelector("#bottomNav>button:first-child");
   if(homeBtn){homeBtn.dataset.go="business-hub";homeBtn.querySelector("small").textContent="Home";}
   second.dataset.go="business-enquiries";secondLabel.textContent="Enquiries";
   third.dataset.go="business-jobs";thirdLabel.textContent="Jobs";
   fourth.dataset.go="business-messages";fourthLabel.textContent="Messages";
   const findWork=document.querySelector("#bizPostNav"); if(findWork){findWork.dataset.go="business-find-work";findWork.querySelector("small").textContent="Find Work";}
   const myOcc=document.querySelector("#bizMoreNav"); if(myOcc){myOcc.dataset.go="business-myocc";myOcc.innerHTML='<span class="occ-nav-icon">♙</span><small>My OCC</small>';}
   if(recruitment) recruitment.style.display="none";
 }
 else if(state.role==="Funder"){
   const homeBtn=document.querySelector("#bottomNav>button:first-child");
   if(homeBtn){homeBtn.dataset.go="partners-funders";homeBtn.querySelector("small").textContent="Home";}
   second.dataset.go="pf-company-offers";secondLabel.textContent="Company Offers";
   third.dataset.go="pf-funders";thirdLabel.textContent="Our Funders";
   fourth.dataset.go="pf-involved";fourthLabel.textContent="Get Involved";
   if(funderMyOcc){funderMyOcc.dataset.go="profile";funderMyOcc.querySelector("small").textContent="My OCC";}
 }
 else {second.dataset.go="opportunities";secondLabel.textContent="Opportunities";third.dataset.go="community";thirdLabel.textContent="Community";fourth.dataset.go="profile";fourthLabel.textContent="My OCC";}
}
function nav(screen){
 // V87: Find Work accounts use the approved new system only. Any remaining
 // legacy jobseeker link is redirected into the matching dark-green/lime page.
 if(state.role==="Jobseeker"){
   const jobseekerRoutes={
     "opportunities":"work-jobs",
     "job-profile":"work-profile",
     "job-cv":"work-cv",
     "job-evidence":"work-hours",
     "job-employers":"work-opportunities",
     "job-pipeline":"work-applications",
     "profile":"work-menu",
     "messages":"work-messages",
     "community":"work-community",
     "employment-support":"work-home",
     "pathway":"work-applications"
   };
   if(jobseekerRoutes[screen]) screen=jobseekerRoutes[screen];
 }
 if(state.role==="Funder" && screen==="messages")screen="pf-messages";
 if(screen==="home"&&!state.role)screen="role-picker";
 if(screen==="home"&&state.role==="Jobseeker")screen="work-home";
 if(screen==="home"&&state.role==="Resident")screen="resident-hub";
 if(screen==="home"&&state.role==="Business")screen="business-hub";
 // Keep Business & Employer accounts completely out of the personal/jobseeker pathway.
 // Any stale button, saved route or older prototype link that points at a personal
 // profile is safely redirected to the professional Business Profile.
 if(state.role==="Business" && ["profile","job-profile","job-cv","job-employers","job-pipeline"].includes(screen)) screen="business-profile";
 updateBottomNav();
 document.body.classList.toggle("work-ui-active",screen.startsWith("work-"));
 $$(".screen").forEach(x=>x.classList.toggle("active",x.dataset.screen===screen))
 $$(".bottom-nav button").forEach(x=>{const target=(x.dataset.go==="home"&&state.role==="Business")?"business-hub":x.dataset.go;x.classList.toggle("active",target===screen)})
 if(screen==="pf-messages" && window.OCCPartnerMessages)window.OCCPartnerMessages.render();
 window.scrollTo({top:0,behavior:"smooth"})
}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1900)}
window.toast=toast
function renderHome(){
 const has=!!state.role, cfg=roleConfig[state.role]; const cr=document.querySelector("#contextRole"); if(cr) cr.textContent=has?(cfg?.label||state.role):"Choose your route"
 $("#homeTitle").textContent=has&&state.role==="Jobseeker"?`Welcome back, ${(state.name||"OCC Member").split(" ")[0]}`:has?`Welcome back, ${(state.name||"OCC Member").split(" ")[0]}`:"Welcome to OCC"
 $("#homeIntro").textContent=has?(state.role==="Jobseeker"?"Ready for your next opportunity?":`Your ${cfg?.label||state.role} home is ready.`):"Choose how you want to use OCC and your home screen will adapt to you."
 const pathwayBtn=$(".welcome .primary"); if(pathwayBtn){pathwayBtn.textContent="Choose my OCC pathway";pathwayBtn.style.display=has?"none":"";}
 $("#roleHome").classList.toggle("hidden",!has)
 document.body.classList.toggle("jobseeker-mode",state.role==="Jobseeker")
 document.body.classList.toggle("occ-dark-work",state.role==="Jobseeker")
 document.body.classList.toggle("business-mode",state.role==="Business")
 document.body.classList.toggle("funder-mode",state.role==="Funder")
 if(!has)return
 $("#roleGreeting").textContent=state.role==="Jobseeker"?"Your work profile at a glance":`${cfg?.label||state.role}`
 $("#roleSummary").textContent=cfg.summary
 const profileBadge=$("#roleProfileBadge"); if(profileBadge) profileBadge.style.display=state.role==="Jobseeker"?"none":"";
 $("#nextStepTitle").textContent=cfg.next
 $("#nextStepText").textContent=cfg.nextText
 $("#progressBar").style.width=cfg.progress+"%"
 $("#metricHours").textContent=state.hours
 $("#metricSkills").textContent=state.skillsCount||0
 $("#metricRefs").textContent=state.refs
 const jobIcons={profile:`<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4.5 20c.8-4.2 3.3-6.5 7.5-6.5s6.7 2.3 7.5 6.5"/></svg>`,cv:`<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 12h6M9 16h6"/></svg>`,evidence:`<svg viewBox="0 0 24 24"><path d="M12 3 19 6v5c0 4.8-2.8 8-7 10-4.2-2-7-5.2-7-10V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></svg>`,employment:`<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 12h18M10 12v2h4v-2"/></svg>`,business:`<svg viewBox="0 0 24 24"><path d="M4 10v10h16V10M3 10l2-6h14l2 6"/><path d="M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M9 20v-6h6v6"/></svg>`,giveback:`<svg viewBox="0 0 24 24"><path d="M8.5 12.5 11 15a2 2 0 0 0 3 0l4.5-4.5"/><path d="m2.5 10.5 4-4 4 1 3-1 2 2M21.5 10.5l-4-4-2 2M6 14l3.5 3.5a2 2 0 0 0 3 0l.5-.5"/></svg>`,public:`<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4.5 20c.8-4.2 3.3-6.5 7.5-6.5s6.7 2.3 7.5 6.5"/><path d="M18 5h3v3"/></svg>`,tools:`<svg viewBox="0 0 24 24"><path d="m14 6 4-4 4 4-4 4M3 21l8-8M8 16l-3-3 8-8 3 3z"/></svg>`,apprentice:`<svg viewBox="0 0 24 24"><path d="M3 9l9-5 9 5-9 5zM7 12v5c3 2 7 2 10 0v-5M21 9v6"/></svg>`,skills:`<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v3h6V3M8 11l2 2 5-5M8 17h8"/></svg>`,verifiedFirm:`<svg viewBox="0 0 24 24"><path d="M4 10v10h16V10M3 10l2-6h14l2 6"/><path d="m9 15 2 2 4-5"/></svg>`,candidates:`<svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="8" r="3"/><path d="M2.5 20c.5-4 2.5-6 5.5-6s5 2 5.5 6M11.5 20c.5-4 2.5-6 5.5-6s5 2 5.5 6"/></svg>`,shortlist:`<svg viewBox="0 0 24 24"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2-4.5-4.4 6.2-.9z"/></svg>`,calendar:`<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h3M13 14h3M8 17h3"/></svg>`,outcomes:`<svg viewBox="0 0 24 24"><path d="M5 12l4 4L19 6"/></svg>`,gift:`<svg viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="12" rx="2"/><path d="M12 9v12M3 13h18M12 9H8.5A2.5 2.5 0 1 1 12 5.5zM12 9h3.5A2.5 2.5 0 1 0 12 5.5z"/></svg>`,impact:`<svg viewBox="0 0 24 24"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>`,messages:`<svg viewBox="0 0 24 24"><path d="M4 5h16v12H8l-4 4z"/><path d="M8 9h8M8 13h5"/></svg>`};
 $("#quickActions").innerHTML=cfg.actions.map(a=>`<button class="quick" data-go="${a[3]}"><span class="dashboard-icon">${jobIcons[a[0]]||jobIcons.evidence}</span><b>${a[1]}</b><small>${a[2]}</small></button>`).join("")
 const statusHelp=document.querySelector(".v40-completion small"); if(statusHelp) statusHelp.textContent=state.role==="Business"?"Add more verified evidence and feedback to strengthen what residents, customers and partners can see.":state.role==="Resident"?"Build your OCC record so trusted businesses and community partners can support you.":"Add more verified evidence and feedback to strengthen what employers and partners can see."
 bindNav()
}
function renderOpportunities(){
 const q=$("#oppSearch").value.toLowerCase(),type=$("#oppType").value
 const rows=opportunities.filter(o=>(type==="all"||o.type===type)&&(`${o.title} ${o.company}`.toLowerCase().includes(q)))
 $("#oppList").innerHTML=rows.map(o=>`<article class="item"><div class="item-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M9 5V3h6v2M4 10h16M9 10v2h6v-2"/></svg></div><div><b>${o.title}</b><p>${o.company}</p><small>${o.meta}</small><div class="actions"><span class="pill">${o.type}</span><button class="mini alt" onclick="saveOpp(${o.id})">${state.saved.includes(o.id)?"Saved ✓":"Save"}</button></div></div></article>`).join("")||'<p class="muted">No matching opportunities.</p>'
}
function renderPublicCommunity(){
 ensureEcosystemState();ensureFundingState();ensureBusinessState();
 const verifiedHours=(state.evidence||[]).filter(e=>e.status==="verified").reduce((n,e)=>n+(+e.hours||0),0) || (+state.hours||0);
 const employed=(state.employer?.hires?.length||0)+(state.pipeline?.employed?1:0);
 const completed=(state.business?.jobs||[]).filter(j=>j.signed).length + (state.resident?.job?.signed?1:0);
 const verifiedBiz=(state.business?.checks?.identity&&state.business?.checks?.business&&state.business?.checks?.insurance&&state.business?.contributions?.some(c=>c.verified))?1:0;
 const projects=state.funding?.allocations?.length||0;
 const put=(id,v)=>{const el=document.querySelector(id);if(el)el.textContent=v};
 put("#liveEmployed",employed);put("#liveJobs",completed);put("#liveHours",verifiedHours);put("#liveBusinesses",verifiedBiz);put("#liveProjects",projects);put("#liveFunding",`£${(+state.funding.total||0).toLocaleString()}`);
}
function renderCommunity(){
 $("#communityList").innerHTML=community.map(c=>`<article class="item"><div class="item-icon">🤝</div><div><b>${c.title}</b><p>${c.meta}</p><small>${c.skill}</small><div class="actions"><button class="mini" onclick="joinActivity('${c.id}')">${state.joined.includes(c.id)?"Joined ✓":"Join activity"}</button></div></div></article>`).join("")
}
function renderCandidates(){
 const q=$("#candidateSearch").value.toLowerCase(),h=+$("#candidateHours").value
 $("#candidateList").innerHTML=candidates.filter(c=>c.hours>=h&&(`${c.name} ${c.skills}`.toLowerCase().includes(q))).map(c=>`<article class="item"><div class="item-icon">👤</div><div><b>${c.name}</b><p>${c.skills}</p><small>${c.hours} verified hours • ${c.note}</small><div class="actions"><button class="mini" onclick="toast('Interview invitation prepared in prototype')">Invite</button><button class="mini alt" onclick="toast('Verified candidate profile opened')">View evidence</button></div></div></article>`).join("")
}
function renderBusinesses(){
 $("#businessList").innerHTML=businesses.map(b=>`<article class="item"><div class="item-icon">🏪</div><div><b>${b.name}</b><p>${b.text}</p><span class="pill">${b.tag}</span><div class="actions"><button class="mini alt" onclick="toast('Public OCC business profile opened')">View profile</button></div></div></article>`).join("")
}
function renderRewards(){
 $("#rewardList").innerHTML=rewards.map(r=>`<article class="item"><div class="item-icon">🎁</div><div><b>${r.title}</b><p>${r.text}</p><span class="pill">${state.claimed.includes(r.id)?"Claimed":r.eligible?"Eligible":"Locked"}</span>${r.eligible&&!state.claimed.includes(r.id)?`<div class="actions"><button class="mini" onclick="claimReward('${r.id}')">Claim prototype reward</button></div>`:""}</div></article>`).join("")
}
function renderTrust(){
 $("#trustHours").textContent=state.hours
 const joined=state.joined.map((id,i)=>{const c=community.find(x=>x.id===id);return `<article><b>✓ ${c.title}</b><span>Prototype joined activity • awaiting completed evidence and sign-off</span></article>`}).join("")
 $("#trustTimeline").innerHTML=`<article><b>✓ Community street support</b><span>3 hours • attendance and reliability verified</span></article><article><b>✓ Local improvement activity</b><span>3 hours • teamwork evidence recorded</span></article>${joined}<article><b>Reference received</b><span>Positive supervisor feedback attached to OCC profile</span></article>`
}
function renderPathway(){
 const cfg=roleConfig[state.role]||roleConfig.Jobseeker
 const steps=state.role==="Business"?["Create business profile","Complete identity/business checks","Record Community Contribution","Build verified evidence","Earn OCC Verified status","Access local opportunities"]:
 state.role==="Employer"?["Create employer profile","Define vacancies or needs","Search verified candidates","Invite to interview/trial","Record outcome","Build OCC employer contribution"]:
 ["Create OCC profile","Take part in community experience","Build verified evidence","Get noticed by employers","Interview / work trial","Employment / apprenticeship"]
 $("#pathwaySteps").innerHTML=steps.map((s,i)=>`<article class="step ${i<2?"done":""}"><div class="step-num">${i+1}</div><div><b>${s}</b><p class="muted">${i<2?"Started / evidenced in prototype":"Next stage of the OCC pathway"}</p></div></article>`).join("")
}

function ensureJobState(){
  state.jobProfile=state.jobProfile||{about:"",skills:"",interests:"",availability:"Immediately available",travel:"Up to 3 miles",visible:false};
  const oldStatus=state.jobProfile.status||"Looking for work";
  state.jobProfile.status=oldStatus==="Unemployed"?"Looking for work":oldStatus==="Employed"?"Now employed":(["Looking for work","Starting work soon","Now employed"].includes(oldStatus)?oldStatus:"Looking for work");
  state.evidence=state.evidence||[]
  state.pipeline=state.pipeline||{interest:false,interview:false,employed:false}
  state.employerFeedback=state.employerFeedback||[]
  state.feedbackRequested=!!state.feedbackRequested
}
function profileCompletion(){
  ensureJobState()
  let score=20
  if(state.name) score+=10
  if(state.area) score+=10
  if(state.jobProfile.about) score+=15
  if(state.jobProfile.skills) score+=15
  if(state.jobProfile.interests) score+=10
  if(state.hours>0) score+=10
  if(state.refs>0) score+=10
  return Math.min(score,100)
}
function renderJobProfile(){
  ensureJobState()
  $("#jsAbout").value=state.jobProfile.about||""
  $("#jsSkills").value=state.jobProfile.skills||state.skills||""
  $("#jsInterests").value=state.jobProfile.interests||""
  $("#jsAvailability").value=state.jobProfile.availability||"Immediately available"
  $("#jsTravel").value=state.jobProfile.travel||"Up to 3 miles"
  const statusEl=$("#jsStatus"); if(statusEl) statusEl.value=state.jobProfile.status||"Unemployed"
  const score=profileCompletion()
  $("#profileScore").textContent=score+"%"
  const ring=document.querySelector(".profile-score-ring")
  if(ring) ring.style.background=`conic-gradient(var(--lime) 0 ${score}%,#e7ece8 ${score}% 100%)`
}
function renderJobCV(){
  ensureJobState()
  $("#cvAvatar").textContent=initials(state.name)
  $("#cvName").textContent=state.name||"OCC Member"
  $("#cvArea").textContent=state.area||state.postcode||"Local area"
  $("#cvAbout").textContent=state.jobProfile.about||"Add a short profile introduction."
  const skills=(state.jobProfile.skills||state.skills||"").split(",").map(x=>x.trim()).filter(Boolean)
  $("#cvSkills").innerHTML=skills.length?skills.map(s=>`<span>${s}</span>`).join(""):'<span>Skills not added yet</span>'
  $("#cvHours").textContent=state.hours||0
  $("#cvActivities").textContent=state.evidence.filter(e=>e.status==="verified").length
  $("#cvReferences").textContent=state.refs||0
  $("#cvStatus").textContent=state.jobProfile.status||"Unemployed"
}
function renderJobEvidence(){
  ensureJobState()
  const joined=state.joined||[]
  if(!joined.length){
    $("#evidenceList").innerHTML='<article class="item"><div class="item-icon">🤝</div><div><b>No activity ready for evidence yet</b><p>Join a community activity first, then return here to add proof and sign-off.</p><div class="actions"><button class="mini" data-go="community">Find activity</button></div></div></article>'
    bindNav(); return
  }
  $("#evidenceList").innerHTML=joined.map(id=>{
    const c=community.find(x=>x.id===id)
    const ev=state.evidence.find(e=>e.id===id)
    const status=ev?.status||"pending"
    return `<article class="item"><div class="item-icon">✓</div><div><b>${c?c.title:"OCC activity"}</b><p>${c?c.meta:"Community activity"}</p><small>${c?c.skill:"Skills evidence"}</small><div><span class="evidence-status ${status}">${status==="verified"?"Verified ✓":"Evidence pending"}</span></div><div class="actions">${status==="verified"?'<button class="mini alt" onclick="toast(&quot;Verified evidence opened&quot;)">View evidence</button>':`<button class="mini" onclick="verifyEvidence('${id}')">Add evidence & sign-off</button>`}</div></div></article>`
  }).join("")
}
function verifyEvidence(id){
  ensureJobState()
  let ev=state.evidence.find(e=>e.id===id)
  if(!ev){ev={id,status:"verified"};state.evidence.push(ev)} else ev.status="verified"
  const c=community.find(x=>x.id===id)
  const hrs=c?.meta.match(/(\d+)\sverified hours/i)
  const add=hrs?+hrs[1]:3
  if(!ev.counted){state.hours=(state.hours||0)+add;state.skillsCount=(state.skillsCount||0)+1;ev.counted=true}
  if((state.refs||0)===0)state.refs=1
  recordAudit("evidence","OCC verifier",id,`Community activity evidence verified${c?`: ${c.title}`:""}`,"verified"); syncEcosystem();syncCredits();save();renderAll();renderJobEvidence();renderEcosystem();renderCreditsHub();toast("Evidence verified — Trust Record, impact and credits updated")
}
function renderJobEmployers(){
  ensureJobState()
  $("#employerVisible").checked=!!state.jobProfile.visible
  $("#visibilityTitle").textContent=state.jobProfile.visible?"Visible to suitable employers":"Hidden from employers"
  $("#visibilityText").textContent=state.jobProfile.visible?"Suitable OCC employers can discover your verified profile.":"Build some verified evidence first, then switch visibility on when you are ready."
}
function renderJobPipeline(){
  ensureJobState()
  $("#pipeVisible").classList.toggle("done",!!state.jobProfile.visible)
  $("#pipeInterest").classList.toggle("done",!!state.pipeline.interest)
  $("#pipeInterview").classList.toggle("done",!!state.pipeline.interview)
  $("#pipeOutcome").classList.toggle("done",!!state.pipeline.employed)
  const events=[]
  if(state.jobProfile.visible)events.push("<article><b>Profile made visible</b><span>Your CV and work profile can now be discovered by suitable employers.</span></article>")
  if(state.pipeline.interest)events.push(`<article><b>Employer interest received</b><span>${state.pipeline.employerName||"An OCC employer"} viewed the profile and expressed interest.</span></article>`)
  if(state.pipeline.interview)events.push("<article><b>Interview booked</b><span>Interview support and eligible OCC partner rewards can now activate.</span></article>")
  if(state.pipeline.employed)events.push("<article><b>Employment confirmed</b><span>Outcome recorded on the OCC pathway and available for impact reporting.</span></article>")
  $("#pipelineEvents").innerHTML=events.join("")||'<article><b>Your journey starts here</b><span>Employer interest, interviews and outcomes will appear as they happen.</span></article>'

  const feedback=state.employerFeedback||[];
  const feedbackList=$("#jobseekerFeedbackList");
  if(feedbackList) feedbackList.innerHTML=feedback.length?feedback.map(f=>`<article><b>${f.employer||"Employer feedback"}</b><span>${f.stage||"Employment journey"} • ${f.rating?f.rating+"/5 • ":""}${f.text}</span></article>`).join(""):'<article><b>No feedback yet</b><span>Feedback can be requested after an interview, work trial, placement or apprenticeship.</span></article>';
  const requestBtn=$("#requestEmployerFeedback");
  if(requestBtn){
    requestBtn.disabled=!state.pipeline.interview;
    requestBtn.textContent=state.feedbackRequested?"Feedback requested ✓":"Request feedback";
  }
  const success=$("#employmentSuccessCard");
  if(success) success.classList.toggle("hidden",!(state.pipeline.employed||state.jobProfile.status==="Now employed"));
}

function requestEmployerFeedback(){
  ensureJobState();
  if(!state.pipeline.interview)return toast("Feedback can be requested after an interview or work trial");
  state.feedbackRequested=true;
  save();renderJobPipeline();toast("Feedback request recorded");
}
function addEmployerFeedback(id){
  ensureJobState();
  const c=employerCandidates().find(x=>x.id===id);
  if(!c)return toast("Candidate not found");
  const rating=prompt("Employer feedback rating from 1 to 5", "5");
  if(rating===null)return;
  const score=Math.max(1,Math.min(5,parseInt(rating,10)||5));
  const text=prompt("Add a short piece of useful feedback", "Reliable, prepared and communicated well.");
  if(text===null||!text.trim())return toast("Add a short feedback note");
  if(id==="current-user"){
    state.employerFeedback=state.employerFeedback||[];
    state.employerFeedback.unshift({id:"FB-"+Date.now(),employer:state.business?.name||"OCC Employer",stage:state.pipeline.employed?"Employment":"Interview / work trial",rating:score,text:text.trim()});
    state.feedbackRequested=false;
  }
  save();renderEmployerOutcomes();renderJobPipeline();toast("Employer feedback saved");
}


function ensureEmployerState(){
  state.employer=state.employer||{selected:null,shortlist:[],interests:[],interviews:[],hires:[]}
  state.employer.interests=state.employer.interests||[]
}
function renderEmployerDashboard(){
  ensureEmployerState()
  $("#employerShortlistCount").textContent=state.employer.shortlist.length
  $("#employerInterviewCount").textContent=state.employer.interviews.length
  $("#employerHireCount").textContent=state.employer.hires.length
}
function renderEmployerSearch(){
  ensureEmployerState()
  const q=($("#empSearch")?.value||"").toLowerCase(), h=+(($("#empHours")?.value)||0)
  const rows=employerCandidates().filter(c=>c.hours>=h && (`${c.name} ${c.skills.join(" ")} ${c.area}`.toLowerCase().includes(q)))
  $("#empCandidateList").innerHTML=rows.map(c=>`<article class="item"><div class="item-icon">👤</div><div><b>${c.name}</b><p>${c.skills.join(" • ")}</p><small>${c.hours} verified hours • ${c.note}</small><div><span class="candidate-score"><i></i> OCC profile</span></div><div class="actions"><button class="mini" onclick="openEmployerCandidate('${c.id}')">View profile</button><button class="mini alt" onclick="employerShortlist('${c.id}')">${state.employer.shortlist.includes(c.id)?"Shortlisted ✓":"Shortlist"}</button></div></div></article>`).join("")||'<p class="muted">No candidates match those filters.</p>'
}
function openEmployerCandidate(id){
  ensureEmployerState(); state.employer.selected=id; save(); renderEmployerCandidate(); nav("employer-candidate")
}
function renderEmployerCandidate(){
  ensureEmployerState()
  const pool=employerCandidates(); const c=pool.find(x=>x.id===state.employer.selected)||pool[0]
  state.employer.selected=c.id
  $("#empCandidateName").textContent=c.name
  $("#empCandidateAvatar").textContent=initials(c.name)
  $("#empCandidateHeading").textContent=c.name
  $("#empCandidateArea").textContent=c.area
  $("#empCandidateSkills").innerHTML=c.skills.map(s=>`<span>${s}</span>`).join("")
  $("#empCandidateHours").textContent=c.hours
  $("#empCandidateActivities").textContent=c.activities
  $("#empCandidateRefs").textContent=c.refs
  $("#empReliability").innerHTML=c.reliability.map(r=>`<div><span>✓</span><b>${r}</b></div>`).join("")
  $("#empCandidateSummary").textContent=c.summary
  $("#empShortlistBtn").textContent=state.employer.shortlist.includes(c.id)?"Shortlisted ✓":"Add to shortlist"
  const interestBtn=$("#empInterestBtn"); if(interestBtn) interestBtn.textContent=state.employer.interests.includes(c.id)?"Interest sent ✓":"Express interest"
  $("#empInviteBtn").textContent=state.employer.interviews.includes(c.id)?"Interview invited ✓":"Invite to interview"
}
function employerShortlist(id){
  ensureEmployerState()
  if(!state.employer.shortlist.includes(id)) state.employer.shortlist.push(id)
  save();renderEmployerSearch();renderEmployerDashboard();if(state.employer.selected===id)renderEmployerCandidate();toast("Candidate added to shortlist")
}
function employerInterest(id){
  ensureEmployerState();
  if(!state.employer.interests.includes(id)) state.employer.interests.push(id);
  if(!state.employer.shortlist.includes(id)) state.employer.shortlist.push(id);
  if(id==="current-user"){
    ensureJobState(); state.pipeline.interest=true; state.pipeline.employerName=state.business?.name||"OCC Verified Employer";
    state.messages=state.messages||[]; state.messages.unshift({from:state.pipeline.employerName,text:"We viewed your OCC Verified profile and would like to discuss an opportunity.",time:"Just now"});
  }
  save(); renderEmployerDashboard(); renderEmployerSearch(); if(state.employer.selected===id)renderEmployerCandidate(); renderJobPipeline(); toast("Employer interest sent — candidate journey updated");
}
function employerInvite(id){
  ensureEmployerState()
  if(!state.employer.shortlist.includes(id)) state.employer.shortlist.push(id)
  if(!state.employer.interests.includes(id)) state.employer.interests.push(id)
  if(!state.employer.interviews.includes(id)) state.employer.interviews.push(id)
  if(id==="current-user"){
    ensureJobState(); state.pipeline.interest=true; state.pipeline.interview=true; state.pipeline.employerName=state.business?.name||"OCC Verified Employer";
    state.messages=state.messages||[]; state.messages.unshift({from:state.pipeline.employerName,text:"Interview / work trial invitation sent through OCC.",time:"Just now"});
  }
  save();renderEmployerDashboard();renderEmployerShortlist();renderEmployerInterviews();renderJobPipeline();if(state.employer.selected===id)renderEmployerCandidate();toast("Interview invitation created — candidate notified")
}
function renderEmployerShortlist(){
  ensureEmployerState()
  const rows=state.employer.shortlist.map(id=>employerCandidates().find(c=>c.id===id)).filter(Boolean)
  $("#empShortlistList").innerHTML=rows.map(c=>`<article class="item"><div class="item-icon">★</div><div><b>${c.name}</b><p>${c.skills.join(" • ")}</p><small>${c.hours} verified hours • ${c.refs} reference${c.refs===1?"":"s"}</small><div><span class="status-chip shortlisted">Shortlisted</span></div><div class="actions"><button class="mini" onclick="openEmployerCandidate('${c.id}')">View profile</button><button class="mini alt" onclick="employerInvite('${c.id}')">${state.employer.interviews.includes(c.id)?"Interview invited ✓":"Invite interview"}</button></div></div></article>`).join("")||'<article class="item"><div class="item-icon">★</div><div><b>No candidates shortlisted yet</b><p>Search people looking for work and save anyone you want to consider.</p><div class="actions"><button class="mini" data-go="employer-search">Find candidates</button></div></div></article>'
  bindNav()
}
function renderEmployerInterviews(){
  ensureEmployerState()
  const rows=state.employer.interviews.map(id=>employerCandidates().find(c=>c.id===id)).filter(Boolean)
  $("#empInterviewList").innerHTML=rows.map(c=>`<article class="item"><div class="item-icon">📅</div><div><b>${c.name}</b><p>Interview / work trial invitation active</p><small>${c.hours} verified hours • ${c.skills.join(" • ")}</small><div><span class="status-chip interview">Interview stage</span></div><div class="actions"><button class="mini" onclick="toast('Candidate message thread opened')">Message</button><button class="mini alt" onclick="confirmEmployerHire('${c.id}')">${state.employer.hires.includes(c.id)?"Employment confirmed ✓":"Confirm employment"}</button></div></div></article>`).join("")||'<article class="item"><div class="item-icon">📅</div><div><b>No interviews yet</b><p>Invite a shortlisted candidate to interview or work trial.</p></div></article>'
}
function confirmEmployerHire(id){
  ensureEmployerState()
  if(!state.employer.hires.includes(id))state.employer.hires.push(id)
  if(id==="current-user"){
    ensureJobState(); state.pipeline.interest=true; state.pipeline.interview=true; state.pipeline.employed=true; state.jobProfile.status="Now employed"; state.pipeline.employerName=state.business?.name||"OCC Verified Employer";
    state.messages=state.messages||[]; state.messages.unshift({from:state.pipeline.employerName,text:"Employment outcome confirmed. Congratulations — your OCC journey has been updated.",time:"Just now"});
  }
  syncEcosystem();syncCredits();save();renderEmployerDashboard();renderEmployerInterviews();renderEmployerOutcomes();renderJobPipeline();renderEcosystem();renderCreditsHub();toast("Employment outcome confirmed — both sides updated")
}
function renderEmployerOutcomes(){
  ensureEmployerState()
  const rows=state.employer.hires.map(id=>employerCandidates().find(c=>c.id===id)).filter(Boolean)
  $("#empOutcomeList").innerHTML=rows.map(c=>`<article class="item"><div class="item-icon">✓</div><div><b>${c.name}</b><p>Employment outcome confirmed through OCC.</p><small>${c.hours} verified hours before employment</small><div><span class="status-chip hired">Hired ✓</span></div><div class="actions"><button class="mini alt" onclick="toast('Employer feedback form opened in prototype')">Add feedback</button></div></div></article>`).join("")||'<article class="item"><div class="item-icon">✓</div><div><b>No confirmed outcomes yet</b><p>Employment and apprenticeship outcomes will appear here once confirmed.</p></div></article>'
}


function ensureBusinessState(){
 state.business=state.business||{name:"JCB Electricians",trade:"Electricians",area:"Bolton",services:"",about:"",profileComplete:false,checks:{identity:false,business:false,insurance:false},contributions:[],jobs:[]}; if(state.business.name==="Bolton Fencing & Landscaping"||state.business.name==="JCB Electricians"){state.business.name="Bolton Community Services";state.business.trade="Electrical • Property Maintenance"}
 state.business.checks=state.business.checks||{identity:false,business:false,insurance:false}
 state.business.contributions=state.business.contributions||[]
 state.business.jobs=state.business.jobs||[]
 state.business.opportunities=state.business.opportunities||[]
 state.business.selectedOpportunity=state.business.selectedOpportunity||null
 state.business.selectedTradeQuote=state.business.selectedTradeQuote||null
 state.business.awardedTradeQuote=state.business.awardedTradeQuote||null
 state.business.tradePayment=state.business.tradePayment||null
 state.business.availability=state.business.availability||"available"
 state.business.nextAvailable=state.business.nextAvailable||""
 state.business.purpose=state.business.purpose||"both"
}
function businessScore(){
 ensureBusinessState();let s=0
 if(state.business.profileComplete)s+=20
 if(state.business.checks.identity)s+=15
 if(state.business.checks.business)s+=15
 if(state.business.checks.insurance)s+=10
 if(state.business.contributions.some(c=>c.verified))s+=20
 if(state.business.jobs.some(j=>j.signed))s+=20
 return Math.min(s,100)
}
function renderBusinessHub(){
 ensureBusinessState();const s=businessScore()
 if($("#bizHomeFirstName")) $("#bizHomeFirstName").textContent=(state.name||"Kristian Roberts").trim().split(/\s+/)[0]||"Kristian";
 if($("#bizHomeName")) $("#bizHomeName").textContent=state.business.name||"Your business";
 if($("#bizHomeMeta")) $("#bizHomeMeta").textContent=`${state.business.trade||"Add your trade"} • ${state.business.area||"Add your area"}`;
 const homeAvail=$("#bizHomeAvailability"); if(homeAvail){const dateText=state.business.nextAvailable?new Date(state.business.nextAvailable+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short"}):"";homeAvail.textContent=state.business.availability==="available"?"● Available now":state.business.availability==="limited"?(dateText?`● Limited • ${dateText}`:"● Limited availability"):(dateText?`● Available from ${dateText}`:"● Fully booked")}
 const homeLogo=$("#bizHomeLogo");if(homeLogo){if(state.business.logo){homeLogo.style.backgroundImage=`url(${state.business.logo})`;homeLogo.classList.add("has-business-logo")}else{homeLogo.style.backgroundImage="";homeLogo.classList.remove("has-business-logo")}}
 if($("#bizHomeProfileScore")) $("#bizHomeProfileScore").textContent=(state.business.profileComplete?"100%":"75%");
 if($("#bizHomeVerifyScore")) $("#bizHomeVerifyScore").textContent=s+"%";
 const av=$("#bizAvailability"); if(av){av.value=state.business.availability; av.onchange=()=>{state.business.availability=av.value;if(av.value==="available")state.business.nextAvailable="";save();renderBusinessHub();renderBusinessProfile();toast("Business availability updated")}}
 const nextWrap=$("#bizNextAvailableWrap"),nextInput=$("#bizNextAvailable");if(nextWrap&&nextInput){nextWrap.style.display=state.business.availability==="available"?"none":"grid";nextInput.value=state.business.nextAvailable||"";nextInput.onchange=()=>{state.business.nextAvailable=nextInput.value;save();renderBusinessHub();renderBusinessProfile();toast("Next available date updated")}}
 const avTitle=$("#bizAvailabilityTitle"),avHelp=$("#bizAvailabilityHelp");
 if(avTitle){const dateText=state.business.nextAvailable?new Date(state.business.nextAvailable+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}):"date not set";const map={available:["Available now","Customers and OCC can see that your business is currently taking work."],limited:["Limited availability",`Taking selected work • next available from ${dateText}.`],unavailable:["Currently fully booked",`Your profile stays active • next available from ${dateText}.`]};avTitle.textContent=map[state.business.availability][0];avHelp.textContent=map[state.business.availability][1]}
 if($("#bizScore")) $("#bizScore").textContent=s+"%"
 const ring=document.querySelector(".verification-ring");if(ring)ring.style.background=`conic-gradient(var(--lime) 0 ${s}%,rgba(255,255,255,.14) ${s}% 100%)`
 if($("#bizStatus")) $("#bizStatus").textContent=s>=100?"OCC Verified":s>=60?"Verification progressing":s>=20?"Profile in progress":"Profile started"
 if($("#bizStatusText")) $("#bizStatusText").textContent=s>=100?"Business checks, community contribution and work evidence are all demonstrated.":"Complete checks and verified community contribution to progress."
 const checks=[
  ["Business profile",state.business.profileComplete],
  ["Identity check",state.business.checks.identity],
  ["Business check",state.business.checks.business],
  ["Relevant insurance evidence",state.business.checks.insurance],
  ["Verified Community Contribution",state.business.contributions.some(c=>c.verified)],
  ["Verified work + customer sign-off",state.business.jobs.some(j=>j.signed)]
 ]
 if($("#bizChecklist")) $("#bizChecklist").innerHTML=checks.map(x=>`<div class="${x[1]?"done":""}"><i>${x[1]?"✓":"•"}</i><b>${x[0]}</b></div>`).join("")
}
const tradeQuoteProfiles=[
 {id:"greenline",name:"Greenline Decorators",initials:"GD",verified:true,rating:4.9,reviews:31,communityHours:42,verifiedJobs:19,area:"Bolton",distance:"2.1 miles",start:"Within 5 days",duration:"4–5 days",insurance:"Public liability verified",skills:["Interior painting","Preparation","Commercial work"],trust:["42 verified community contribution hours","19 customer-signed OCC jobs","31 verified customer reviews","Insurance evidence current"],note:"Local decorating team with strong OCC work evidence and a consistent community contribution record."},
 {id:"northwest",name:"North West Painting Co.",initials:"NW",verified:true,rating:4.8,reviews:24,communityHours:28,verifiedJobs:14,area:"Bolton",distance:"3.7 miles",start:"Within 7 days",duration:"4 days",insurance:"Public liability verified",skills:["Office decoration","Spray finishing","Preparation"],trust:["28 verified community contribution hours","14 customer-signed OCC jobs","24 verified customer reviews","Business identity and insurance checked"],note:"Commercial painter offering a clear fixed quote and a fast estimated completion time."},
 {id:"jamie-decor",name:"Jamie Roberts Decorating",initials:"JR",verified:true,rating:5.0,reviews:12,communityHours:51,verifiedJobs:9,area:"Breightmet",distance:"1.8 miles",start:"Within 3 days",duration:"5–6 days",insurance:"Public liability verified",skills:["Painting","Wallpapering","Repairs & preparation"],trust:["51 verified community contribution hours","9 customer-signed OCC jobs","12 verified customer reviews","OCC identity and insurance checks complete"],note:"Independent local tradesperson with the highest community contribution in this comparison."}
]
function getBusinessOpportunity(id){ensureBusinessState();return state.business.opportunities.find(o=>o.id===id)||null}
function getTradeQuoteProfile(id){return tradeQuoteProfiles.find(q=>q.id===id)||tradeQuoteProfiles[0]}
function quotesForOpportunity(o){
 const budget=Number(o?.budget||2800)
 const prices=[Math.max(250,Math.round(budget*.95/10)*10),Math.max(250,Math.round(budget*.99/10)*10),Math.max(250,Math.round(budget*.92/10)*10)]
 return tradeQuoteProfiles.map((q,i)=>({...q,price:prices[i]}))
}
function openBusinessQuotes(id){ensureBusinessState();state.business.selectedOpportunity=id;state.business.selectedTradeQuote=null;save();renderBusinessQuotes();nav("business-quotes")}
window.openBusinessQuotes=openBusinessQuotes
function renderBusinessQuotes(){
 ensureBusinessState();const o=getBusinessOpportunity(state.business.selectedOpportunity)
 const head=$("#quoteOpportunitySummary"),list=$("#tradeQuoteList")
 if(!head||!list)return
 if(!o){head.innerHTML='<b>No opportunity selected</b><p>Return to Paid Opportunities and choose View quotes.</p>';list.innerHTML='';return}
 head.innerHTML=`<div><span class="eyebrow">${o.status==="awarded"?"AWARDED OPPORTUNITY":"OPEN OPPORTUNITY"}</span><h3>${o.title}</h3><p>${o.trade} • ${o.area} • Budget £${Number(o.budget||0).toLocaleString()}</p></div><span class="status-chip ${o.status==="awarded"?"hired":"shortlisted"}">${o.status==="awarded"?"AWARDED ✓":"3 VERIFIED QUOTES"}</span>`
 const awarded=state.business.awardedTradeQuote
 list.innerHTML=quotesForOpportunity(o).map(q=>`<article class="trade-quote-card ${awarded?.quoteId===q.id?'quote-awarded':''}"><div class="quote-top"><div class="avatar quote-avatar">${q.initials}</div><div class="quote-name"><b>${q.name}</b><span class="verified-inline">✓ OCC VERIFIED</span><small>★ ${q.rating} (${q.reviews}) • ${q.distance}</small></div><strong class="quote-amount">£${q.price.toLocaleString()}</strong></div><div class="quote-facts"><span><b>${q.communityHours}</b> community hours</span><span><b>${q.verifiedJobs}</b> verified jobs</span><span><b>${q.start}</b> start</span></div><p class="quote-note">${q.note}</p><div class="quote-trust"><span>🛡️ ${q.insurance}</span><span>⏱ ${q.duration} estimated</span></div><div class="actions wrap"><button class="mini alt" onclick="viewTradeQuoteProfile('${q.id}')">View profile & Trust Record</button>${awarded?.quoteId===q.id?'<span class="status-chip hired">JOB AWARDED ✓</span>':`<button class="mini" onclick="awardTradeQuote('${q.id}')">Award job</button>`}</div></article>`).join("")
}
function viewTradeQuoteProfile(id){ensureBusinessState();state.business.selectedTradeQuote=id;save();renderTradeQuoteProfile();nav("business-quote-profile")}
window.viewTradeQuoteProfile=viewTradeQuoteProfile
function renderTradeQuoteProfile(){
 ensureBusinessState();const o=getBusinessOpportunity(state.business.selectedOpportunity),q=getTradeQuoteProfile(state.business.selectedTradeQuote)
 const price=quotesForOpportunity(o).find(x=>x.id===q.id)?.price||0
 if(!$("#tradeProfileName"))return
 $("#tradeProfileAvatar").textContent=q.initials;$("#tradeProfileName").textContent=q.name;$("#tradeProfileMeta").textContent=`${q.area} • ${q.distance} from job`;$("#tradeProfileQuote").textContent=`£${price.toLocaleString()}`;$("#tradeProfileRating").textContent=`${q.rating} / 5`;$("#tradeProfileHours").textContent=q.communityHours;$("#tradeProfileJobs").textContent=q.verifiedJobs;$("#tradeProfileAbout").textContent=q.note;$("#tradeProfileSkills").innerHTML=q.skills.map(s=>`<span class="tag">${s}</span>`).join("");$("#tradeProfileTrust").innerHTML=q.trust.map(t=>`<div><span>✓</span><b>${t}</b></div>`).join("");$("#tradeProfileAward").onclick=()=>awardTradeQuote(q.id)
}
function awardTradeQuote(id){
 ensureBusinessState();const o=getBusinessOpportunity(state.business.selectedOpportunity);if(!o)return toast("Choose an opportunity first")
 const q=quotesForOpportunity(o).find(x=>x.id===id);state.business.selectedTradeQuote=id;state.business.awardedTradeQuote={opportunityId:o.id,quoteId:id,price:q.price,awardedAt:Date.now()};o.status="awarded";o.awardedTo=q.name
 state.business.tradePayment={opportunityId:o.id,quoteId:id,total:q.price,status:"awaiting-protection",milestones:[{label:"Booking / materials",pct:20,status:"held",evidence:""},{label:"Work progress",pct:60,status:"held",evidence:""},{label:"Completion & sign-off",pct:20,status:"held",evidence:""}]};save();renderBusinessPayment();renderBusinessOpportunities();toast("Job awarded — Secure Payment Protection ready");nav("business-trade-payment")
}
window.awardTradeQuote=awardTradeQuote
function renderBusinessPayment(){
 ensureBusinessState();const p=state.business.tradePayment,o=getBusinessOpportunity(p?.opportunityId),q=getTradeQuoteProfile(p?.quoteId)
 if(!$("#tradePaymentSummary"))return
 if(!p||!o){$("#tradePaymentSummary").innerHTML='<b>No awarded job yet</b><p>Award a quote first to create a protected payment record.</p>';$("#tradeMilestones").innerHTML='';return}
 // Backwards compatibility with V32.1 saved demo data.
 p.milestones.forEach(m=>{if(!m.status)m.status=m.released?"released":"held";if(m.evidence==null)m.evidence=""})
 $("#tradePaymentSummary").innerHTML=`<div><span class="eyebrow">OCC SECURE PAYMENT PROTECTION</span><h3>${o.title}</h3><p>${q.name} • OCC Job protection record</p></div><strong>£${p.total.toLocaleString()}</strong>`
 $("#tradePaymentStatus").textContent=p.status==="protected"?"PROTECTION ACTIVE ✓":"AWAITING PROTECTION";$("#tradePaymentStatus").className=`status-chip ${p.status==="protected"?"hired":"interview"}`
 $("#tradeMilestones").innerHTML=p.milestones.map((m,i)=>{
   const amount=Math.round(p.total*m.pct/100), released=m.status==="released", submitted=m.status==="submitted", issue=m.status==="issue";
   const badge=released?'RELEASED ✓':submitted?'AWAITING SIGN-OFF':issue?'ISSUE RAISED':'HELD';
   const klass=released?'hired':issue?'interview':submitted?'interview':'shortlisted';
   let actions='';
   if(p.status!=="protected") actions='<small>Activate protection before milestone actions begin.</small>';
   else if(m.status==="held") actions=`<button class="mini" onclick="submitTradeMilestone(${i})">Trading company: submit evidence</button>`;
   else if(submitted) actions=`<div class="milestone-evidence">📎 ${m.evidence||'Evidence submitted and timestamped'}</div><div class="actions wrap"><button class="mini" onclick="approveTradeMilestone(${i})">Customer: approve & release</button><button class="mini alt" onclick="raiseTradeMilestoneIssue(${i})">Raise an issue</button></div>`;
   else if(issue) actions=`<div class="milestone-evidence">⚠️ Payment remains held while the issue is recorded.</div><button class="mini alt" onclick="resolveTradeMilestoneIssue(${i})">Resolve & return to sign-off</button>`;
   else actions='<div class="milestone-evidence">✓ Evidence, customer sign-off and release recorded in the OCC job history.</div>';
   return `<article class="milestone milestone-flow ${released?'done':''}"><div class="milestone-num">${released?'✓':i+1}</div><div class="milestone-main"><b>${m.label}</b><small>${m.pct}% • £${amount.toLocaleString()}</small><div class="milestone-actions">${actions}</div></div><span class="status-chip ${klass}">${badge}</span></article>`
 }).join("")
 const btn=$("#activateTradeProtection");btn.textContent=p.status==="protected"?"Secure Payment Protection active":"Activate Secure Payment Protection";btn.disabled=p.status==="protected";btn.onclick=()=>{p.status="protected";save();renderBusinessPayment();toast("Protection active — customer and trading company protected")}
 save()
}
function submitTradeMilestone(i){const p=state.business.tradePayment;if(!p||p.status!=="protected")return toast("Activate protection first");const m=p.milestones[i];m.status="submitted";m.evidence=`Before / during / after evidence submitted • ${new Date().toLocaleDateString('en-GB')}`;addNotification("📎","Trading company evidence submitted",`Milestone ${i+1}: evidence submitted and awaiting customer sign-off.`);save();renderBusinessPayment();renderMessages();toast("Evidence submitted — awaiting customer sign-off")}
function approveTradeMilestone(i){const p=state.business.tradePayment;if(!p)return;const m=p.milestones[i];m.status="released";m.released=true;m.approvedAt=Date.now();save();renderBusinessPayment();toast("Milestone approved — payment released in prototype")}
function raiseTradeMilestoneIssue(i){const p=state.business.tradePayment;if(!p)return;p.milestones[i].status="issue";p.milestones[i].issueAt=Date.now();addNotification("⚠️","Milestone issue raised",`Milestone ${i+1}: represented payment remains held while the issue is reviewed.`);save();renderBusinessPayment();renderMessages();renderAdminCentre();toast("Issue recorded — payment remains held")}
function resolveTradeMilestoneIssue(i){const p=state.business.tradePayment;if(!p)return;p.milestones[i].status="submitted";save();renderBusinessPayment();toast("Issue marked resolved — returned for customer sign-off")}
window.submitTradeMilestone=submitTradeMilestone;window.approveTradeMilestone=approveTradeMilestone;window.raiseTradeMilestoneIssue=raiseTradeMilestoneIssue;window.resolveTradeMilestoneIssue=resolveTradeMilestoneIssue

function renderBusinessOpportunities(){
 ensureBusinessState()
 const rows=state.business.opportunities.slice().reverse()
 $("#businessOpportunityList").innerHTML=rows.map(o=>`<article class="item"><div class="item-icon">💷</div><div><b>${o.title}</b><p>${o.trade} • ${o.area}</p><small>Budget: £${Number(o.budget||0).toLocaleString()} • Paid commercial opportunity</small><div><span class="status-chip shortlisted">OPEN TO OCC TRADES</span></div><div class="actions"><button class="mini" onclick="toast('OCC Verified trades notified in prototype')">Notify verified trades</button><button class="mini alt" onclick="openBusinessQuotes('${o.id}')">View quotes</button></div></div></article>`).join("")||'<article class="item"><div class="item-icon">💷</div><div><b>No paid opportunities posted yet</b><p>Post work your business genuinely needs and give suitable OCC Verified local tradespeople the opportunity to quote.</p></div></article>'
}
function renderBusinessProfile(){
 ensureBusinessState();$("#bizName").value=state.business.name;const tradeSel=$("#bizTrade");if(tradeSel){const vals=[...tradeSel.options].map(o=>o.value);tradeSel.value=vals.includes(state.business.trade)?state.business.trade:"Other"}$("#bizArea").value=state.business.area;$("#bizServices").value=state.business.services;$("#bizAbout").value=state.business.about;if($("#bizPurpose"))$("#bizPurpose").value=state.business.purpose||"both";const heroName=$("#bizHeroName"),heroMeta=$("#bizHeroMeta"),heroAvail=$("#bizHeroAvailability");if(heroName)heroName.textContent=state.business.name||"Your business profile";if(heroMeta)heroMeta.textContent=`${state.business.trade||"Add your trade"} • ${state.business.area||"Add your area"}`;if(heroAvail){const labels={available:"● Available now",limited:"● Limited availability",unavailable:state.business.nextAvailable?`● Available from ${new Date(state.business.nextAvailable+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'})}`:"● Currently fully booked"};heroAvail.textContent=labels[state.business.availability]||labels.available}const logo=state.business.logo||"";for(const id of ["bizLogoPreview","bizLogoMini"]){const el=$("#"+id);if(el){el.style.backgroundImage=logo?`url(${logo})`:"";el.textContent=logo?"":(id==="bizLogoPreview"?"BUSINESS":"LOGO")}}if($("#bizProfileAvailability")){$("#bizProfileAvailability").value=state.business.availability;const wrap=$("#bizProfileNextAvailableWrap"),inp=$("#bizProfileNextAvailable");if(wrap&&inp){wrap.style.display=state.business.availability==="available"?"none":"grid";inp.value=state.business.nextAvailable||"";$("#bizProfileAvailability").onchange=()=>{wrap.style.display=$("#bizProfileAvailability").value==="available"?"none":"grid"}}}
}
function renderBusinessChecks(){
 ensureBusinessState()
 const rows=[
  ["identity","Identity / responsible person","Confirm who is responsible for the business."],
  ["business","Business identity","Validate business details against appropriate records."],
  ["insurance","Relevant insurance","Record evidence appropriate to the work offered."]
 ]
 $("#bizChecksList").innerHTML=rows.map(([id,title,text])=>`<article class="item"><div class="item-icon">${state.business.checks[id]?"✓":"🛡️"}</div><div><b>${title}</b><p>${text}</p><span class="status-chip ${state.business.checks[id]?"hired":"interview"}">${state.business.checks[id]?"Checked ✓":"Pending"}</span>${!state.business.checks[id]?`<div class="actions"><button class="mini" onclick="completeBizCheck('${id}')">Simulate check</button></div>`:""}</div></article>`).join("")
}
function completeBizCheck(id){ensureBusinessState();state.business.checks[id]=true;recordAudit("verification","OCC admin",`BUS-CHECK-${id.toUpperCase()}`,`Business verification check completed: ${id}`,"verified");save();renderBusinessChecks();renderBusinessHub();renderBusinessPublic();renderAdminCentre();toast("Verification check completed in prototype")}
function renderContribution(){
 ensureBusinessState()
 $("#contributionList").innerHTML=state.business.contributions.slice().reverse().map(c=>`<article class="item"><div class="item-icon">🤝</div><div><b>${c.type}</b><p>${c.desc}</p><small>${c.hours} hours/value units recorded</small><div><span class="status-chip ${c.verified?"hired":"interview"}">${c.verified?"Verified contribution ✓":"Awaiting verification"}</span></div>${!c.verified?`<div class="actions"><button class="mini" onclick="verifyContribution('${c.id}')">Simulate OCC verification</button></div>`:""}</div></article>`).join("")||'<article class="item"><div class="item-icon">🤝</div><div><b>No contributions recorded yet</b><p>Add free community work, discounts, work experience, opportunities or materials.</p></div></article>'
}
function verifyContribution(id){ensureBusinessState();const c=state.business.contributions.find(x=>x.id===id);if(c)c.verified=true;recordAudit("verification","OCC verifier",id,"Community Contribution verified","verified");syncCredits();save();renderContribution();renderBusinessHub();renderBusinessPublic();renderCreditsHub();renderAdminCentre();toast("Community Contribution verified — credits awarded")}
function renderBusinessWork(){
 ensureBusinessState()
 $("#businessWorkList").innerHTML=state.business.jobs.slice().reverse().map(j=>`<article class="item"><div class="item-icon"><svg class="occ-ui-icon" viewBox="0 0 24 24"><path d="M14.5 6.5a5 5 0 0 0-6.7 6.7L3 18l3 3 4.8-4.8a5 5 0 0 0 6.7-6.7l-3 3-3-3z"/></svg></div><div><b>${j.id} — ${j.title}</b><p>${j.customer}</p><small>Traceable OCC work record</small><div class="job-proof"><div class="${j.before?"done":""}">Before ${j.before?"✓":""}</div><div class="${j.after?"done":""}">After ${j.after?"✓":""}</div><div class="${j.signed?"done":""}">Sign-off ${j.signed?"✓":""}</div></div><div class="actions">${!j.before?`<button class="mini" onclick="advanceBizJob('${j.id}','before')">Add before evidence</button>`:!j.after?`<button class="mini" onclick="advanceBizJob('${j.id}','after')">Add completion evidence</button>`:!j.signed?`<button class="mini" onclick="advanceBizJob('${j.id}','signed')">Customer sign-off</button>`:'<span class="status-chip hired">Verified job ✓</span>'}</div></div></article>`).join("")||'<article class="item"><div class="item-icon"><svg class="occ-ui-icon" viewBox="0 0 24 24"><path d="M14.5 6.5a5 5 0 0 0-6.7 6.7L3 18l3 3 4.8-4.8a5 5 0 0 0 6.7-6.7l-3 3-3-3z"/></svg></div><div><b>No work evidence yet</b><p>Create a demonstration job to test the full evidence and customer sign-off flow.</p></div></article>'
}
function advanceBizJob(id,stage){ensureBusinessState();const j=state.business.jobs.find(x=>x.id===id);if(j)j[stage]=true;save();renderBusinessWork();renderBusinessHub();renderBusinessPublic();toast(stage==="signed"?"Customer sign-off recorded":"Work evidence added")}
function renderBusinessPublic(){
 ensureBusinessState();const s=businessScore()
 $("#publicBizName").textContent=state.business.name||"OCC Business";$("#publicBizTrade").textContent=`${state.business.trade||"Local business"} • ${state.business.area||"Local area"}`
 $("#publicBizAbout").textContent=state.business.about||"This business is building its OCC profile and community contribution record."
 $("#publicServices").innerHTML=state.business.services?`<span class="public-action-icon">+</span><div><b>${state.business.services}</b><small>Services available from this business.</small></div><span class="public-arrow">›</span>`:`<span class="public-action-icon">+</span><div><b>Services not added yet.</b><small>Add your services to let residents know what you do.</small></div><span class="public-arrow">›</span>`
 $("#publicContrib").textContent=state.business.contributions.filter(c=>c.verified).length
 $("#publicJobs").textContent=state.business.jobs.filter(j=>j.signed).length
 $("#publicSignoffs").textContent=state.business.jobs.filter(j=>j.signed).length
 const badge=$("#publicBizBadge");badge.textContent=s>=100?"OCC VERIFIED ✓":"VERIFICATION IN PROGRESS";badge.className=`status-chip ${s>=100?"hired":"shortlisted"}`
 const ev=[];if(state.business.checks.business)ev.push("Business identity checked");if(state.business.contributions.some(c=>c.verified))ev.push("Verified Community Contribution recorded");if(state.business.jobs.some(j=>j.signed))ev.push("Customer-signed verified work evidence");if(state.business.checks.insurance)ev.push("Relevant insurance evidence recorded")
 $("#publicEvidence").innerHTML=ev.length?ev.map(x=>`<div class="public-trust-row"><span class="public-info">✓</span><div><b>${x}</b></div><span class="public-arrow">›</span></div>`).join(""):`<div class="public-trust-row"><span class="public-info">i</span><div><b>OCC verification evidence is still being built.</b><small>Complete community work and build your trust record to become OCC Verified.</small></div><span class="public-arrow">›</span></div>`
}


function ensureResidentState(){state.resident=state.resident||{request:null,quotes:[],selectedQuote:null,job:null,rating:0,review:""}}
function renderResidentHub(){
 ensureResidentState();const r=state.resident
 const rows=[["Job request created",!!r.request],["Quotes received",r.quotes.length>0],["Business selected",!!r.selectedQuote],["OCC Job ID created",!!r.job],["Before/after evidence",!!r.job?.after],["Customer sign-off",!!r.job?.signed],["Verified review",!!r.review]]
 const journey=$("#residentJourney"); if(journey) journey.innerHTML=rows.map(x=>`<div class="${x[1]?"done":""}"><i>${x[1]?"✓":"•"}</i><b>${x[0]}</b></div>`).join("")
}
function generateResidentQuotes(){
 ensureResidentState()
 state.resident.quotes=[
  {id:"q1",business:"Oak & Stone Property Services",price:420,labour:260,materials:160,verified:true,rating:"4.9",reviews:48,distance:"3.2 miles",jobs:31,community:"Verified Community Contributor",employment:true},
  {id:"q2",business:"Greenline Home & Garden",price:465,labour:285,materials:180,verified:true,rating:"4.8",reviews:36,distance:"5.6 miles",jobs:24,community:"18 verified community hours",employment:false},
  {id:"q3",business:"North West Trade Solutions",price:395,labour:250,materials:145,verified:true,rating:"4.7",reviews:21,distance:"8.4 miles",jobs:17,community:"OCC Verified",employment:false}
 ];save()
}
function renderResidentQuotes(){
 ensureResidentState();const r=state.resident
 if(!r.request){$("#residentQuoteList").innerHTML='<article class="item"><div class="item-icon">£</div><div><b>No job request yet</b><p>Create a request first to receive demonstration quotes.</p><div class="actions"><button class="mini" data-go="resident-request">Request work</button></div></div></article>';bindNav();return}
 if(!r.quotes.length)generateResidentQuotes()
 $("#residentQuoteList").innerHTML=r.quotes.map(q=>`<article class="market-result-v51"><div class="market-result-top"><div class="market-avatar-v51">${q.business.split(/\s+/).slice(0,2).map(x=>x[0]).join("")}</div><div class="market-result-name"><b>${q.business}</b><div class="market-badges-v51"><span>✓ OCC VERIFIED</span>${q.employment?'<span class="employment">★ EMPLOYMENT PARTNER</span>':''}</div></div></div><div class="market-result-stats"><span><strong>★ ${q.rating}</strong><small>${q.reviews} verified reviews</small></span><span><strong>${q.distance}</strong><small>from your job</small></span><span><strong>${q.jobs}</strong><small>verified jobs</small></span></div><p class="market-community-v51">${q.employment?'This business has created employment through OCC.':q.community}</p><div class="market-quote-v51"><div><small>Indicative quote</small><strong>£${q.price}</strong></div><div class="quote-breakdown"><span>Labour £${q.labour}</span><span>Materials £${q.materials}</span></div></div><div class="actions"><button class="mini alt" onclick="toast('OCC business profile opened')">View Profile</button><button class="mini" onclick="chooseResidentQuote('${q.id}')">${r.selectedQuote===q.id?"Selected ✓":"Invite to Quote"}</button></div><small class="contact-safe-v51">🔒 Your contact details stay private until you choose to connect.</small></article>`).join("")
}
function chooseResidentQuote(id){
 ensureResidentState();state.resident.selectedQuote=id
 const q=state.resident.quotes.find(x=>x.id===id), req=state.resident.request
 state.resident.job={id:"OCC-R-"+String(Date.now()).slice(-6),title:req?.desc||req?.category||"Resident job",business:q.business,price:q.price,before:false,after:false,signed:false,milestones:[false,false,false],paymentReleased:[false,false,false],issues:[],protectionHistory:[{text:"Quote accepted and OCC Job ID created. Protection record opened.",type:"ok",ts:Date.now()}]}
 recordAudit("payment","Resident",state.resident.job.id,`Quote accepted from ${q.business}; protected job record created`,"protected")
 addNotification("🛡️","Protected job created",`${state.resident.job.id}: ${q.business} selected. Milestone protection record opened.`);save();renderResidentQuotes();renderResidentHub();renderResidentJob();renderPayment();renderMessages();toast("Quote selected — OCC Job ID created")
}
function renderResidentJob(){
 ensureResidentState();const j=state.resident.job
 if(!j){$("#residentJobId").textContent="Not created";$("#residentJobStatus").textContent="WAITING";$("#residentJobBusiness").textContent="Choose a quote to create a traceable job.";$("#residentEvidenceSteps").innerHTML="";$("#residentJobActions").innerHTML='<button class="mini" data-go="resident-quotes">View quotes</button>';bindNav();return}
 $("#residentJobId").textContent=j.id;$("#residentJobTitle").textContent=j.title;$("#residentJobBusiness").textContent=`${j.business} • £${j.price}`
 $("#residentJobStatus").textContent=j.signed?"COMPLETED ✓":j.after?"AWAITING SIGN-OFF":j.before?"IN PROGRESS":"BOOKED"
 const steps=[["Before evidence",j.before],["Work underway",j.before],["Completion evidence",j.after],["Customer sign-off",j.signed]]
 $("#residentEvidenceSteps").innerHTML=steps.map((x,i)=>`<div><span>${i+1}</span><b>${x[0]}</b><small>${x[1]?"Recorded ✓":"Pending"}</small></div>`).join("")
 $("#residentJobActions").innerHTML=!j.before?'<button class="mini" onclick="advanceResidentJob(\'before\')">Simulate arrival + before evidence</button>':!j.after?'<button class="mini" onclick="advanceResidentJob(\'after\')">Simulate completed work evidence</button>':!j.signed?'<button class="mini" onclick="advanceResidentJob(\'signed\')">Approve & sign off work</button>':'<button class="mini" data-go="resident-review">Leave verified review</button>'
 bindNav()
}
function advanceResidentJob(stage){
 const j=state.resident.job;if(!j)return;j[stage]=true
 if(stage==="before")j.milestones[0]=true
 if(stage==="after")j.milestones[1]=true
 if(stage==="signed"){j.milestones[2]=true;ensureBusinessState();if(!state.business.jobs.some(x=>x.id===j.id))state.business.jobs.push({id:j.id,title:j.title,customer:"OCC Resident",before:true,after:true,signed:true})}
 if(stage==="before"){recordAudit("evidence","Trading company",j.id,"Arrival and before evidence submitted","verified");addProtectionHistory("Arrival and before evidence recorded. First milestone evidence is available for review.","ok");addNotification("📎","Job evidence recorded",`${j.id}: arrival and before evidence added.`)}
 if(stage==="after"){recordAudit("evidence","Trading company",j.id,"Completion evidence submitted","verified");addProtectionHistory("Completion evidence recorded. Customer can review before final sign-off.","ok");addNotification("📎","Completion evidence submitted",`${j.id}: completion evidence is ready for customer review.`)}
 if(stage==="signed"){recordAudit("signoff","Resident",j.id,"Customer completion sign-off recorded","approved");addProtectionHistory("Customer completion sign-off recorded. Final milestone demonstrated as approved.","ok");addNotification("✓","Customer sign-off recorded",`${j.id}: completion approved and Trust Record updated.`)}
 syncEcosystem();save();renderResidentJob();renderPayment();renderResidentHub();renderBusinessHub();renderBusinessPublic();renderEcosystem();renderMessages();renderAdminCentre();toast(stage==="signed"?"Customer sign-off recorded — business Trust Record updated":"Job evidence updated")
}
function approveResidentMilestone(i){
 ensureV33State();const j=state.resident.job;if(!j)return;const open=j.issues.some(x=>x.milestone===i&&x.status==="open");if(open)return toast("Resolve the open issue before release");const ready=(i===0&&j.before)||(i===1&&j.after)||(i===2&&j.signed);if(!ready)return toast("Evidence / sign-off for this milestone is not ready yet");j.paymentReleased[i]=true;recordAudit("payment","Resident",j.id,`Milestone ${i+1} approved; prototype release recorded`,"released");addProtectionHistory(`Customer approved milestone ${i+1}. Payment is demonstrated as released against the agreed progress.`,"ok");addNotification("✓","Milestone approved",`${j.id}: milestone ${i+1} approved and demonstrated as released.`);save();renderPayment();renderMessages();renderAdminCentre();toast("Milestone approved — release recorded in prototype")
}
window.approveResidentMilestone=approveResidentMilestone
function renderPayment(){
 ensureV33State();const j=state.resident.job
 if(!j){$("#paymentMilestones").innerHTML='<article class="item"><div class="item-icon">🛡️</div><div><b>No protected job yet</b><p>Select a quote to create the payment milestone demonstration.</p></div></article>';const h=$("#residentProtectionHistory");if(h)h.innerHTML='<div class="history-row"><i>•</i><div><b>No job history yet</b><small>Create a protected OCC Job ID first.</small></div></div>';return}
 j.issues=j.issues||[];j.protectionHistory=j.protectionHistory||[];j.paymentReleased=j.paymentReleased||[false,false,false]
 const parts=[["Booking / materials",Math.round(j.price*.3)],["Work completion",Math.round(j.price*.5)],["Customer sign-off",j.price-Math.round(j.price*.3)-Math.round(j.price*.5)]]
 $("#paymentMilestones").innerHTML=parts.map((m,i)=>{const released=!!j.paymentReleased[i];const open=j.issues.some(x=>x.milestone===i&&x.status==="open");const ready=(i===0&&j.before)||(i===1&&j.after)||(i===2&&j.signed);let detail=released?"Customer approval recorded — milestone demonstrated as released":open?"Issue open — represented payment remains held":ready?"Evidence ready — customer can approve or raise an issue":"Represented as protected / awaiting agreed progress";let action="";if(!released&&open)action=`<span class="admin-chip warn">⚠ Release paused</span>`;else if(!released&&ready)action=`<div class="actions wrap"><button class="mini" onclick="approveResidentMilestone(${i})">Approve & release</button><button class="mini alt" onclick="residentRaiseIssue(${i})">Raise issue</button></div>`;return `<article class="item milestone ${released?"done":""}"><div class="milestone-num">${released?"✓":i+1}</div><div><b>${m[0]}</b><small>${detail}</small>${action?`<div class="milestone-actions">${action}</div>`:""}</div><strong>£${m[1]}</strong></article>`}).join("")
 const h=$("#residentProtectionHistory");if(h)h.innerHTML=(j.protectionHistory.length?j.protectionHistory:[{text:"Protection record created.",type:"info",ts:Date.now()}]).map(x=>`<div class="history-row"><i>${x.type==="issue"?"⚠":x.type==="ok"?"✓":"•"}</i><div><b>${x.text}</b><small>${fmtWhen(x.ts)}</small></div></div>`).join("")
}
function renderResidentReview(){
 ensureResidentState();const j=state.resident.job;if(!j)return
 $("#reviewJobName").textContent=j.title;$("#reviewBusiness").textContent=j.business
 document.querySelectorAll("[data-rating]").forEach(b=>b.classList.toggle("on",+b.dataset.rating<=state.resident.rating))
 $("#reviewText").value=state.resident.review||""
}



function ensureV33State(){
 state.notifications=state.notifications||[
  {id:"welcome-v33",icon:"✓",title:"OCC Verification",text:"V33 pilot protection and verification controls are ready.",ts:Date.now()-86400000}
 ]
 ensureResidentState()
 if(state.resident.job){
  state.resident.job.protectionHistory=state.resident.job.protectionHistory||[]
  state.resident.job.issues=state.resident.job.issues||[]
  state.resident.job.paymentReleased=state.resident.job.paymentReleased||[false,false,false]
 }
}
function addNotification(icon,title,text){
 ensureV33State();state.notifications.unshift({id:"n-"+Date.now()+Math.random(),icon,title,text,ts:Date.now()});state.notifications=state.notifications.slice(0,30)
}
function fmtWhen(ts){const d=new Date(ts);return d.toLocaleDateString('en-GB')+" • "+d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}
function renderMessages(){
 ensureV33State();
 const rows=state.notifications.length?state.notifications:[{icon:"✓",title:"OCC",text:"No new pilot notifications.",ts:Date.now()}]
 $("#messageList").innerHTML=rows.map(n=>`<article class="item"><div class="item-icon">${n.icon}</div><div><b>${n.title}</b><p>${n.text}</p><small>${fmtWhen(n.ts)}</small></div></article>`).join("")
 const badge=$("#msgBadge");if(badge)badge.textContent=Math.min(9,state.notifications.length)
}
function addProtectionHistory(text,type="info"){
 ensureV33State();const j=state.resident.job;if(!j)return;j.protectionHistory.unshift({text,type,ts:Date.now()});j.protectionHistory=j.protectionHistory.slice(0,30)
}
function residentRaiseIssue(i){
 ensureV33State();const j=state.resident.job;if(!j)return;const issue={id:"ISS-"+String(Date.now()).slice(-6),milestone:i,status:"open",text:"Customer issue raised before milestone approval",ts:Date.now()};j.issues.push(issue);recordAudit("issue","Resident",j.id,`${issue.id} raised against milestone ${i+1}`,"open");addProtectionHistory(`Issue ${issue.id} raised on milestone ${i+1}. Represented funds remain protected.`,"issue");addNotification("⚠️","Payment protection issue",`${j.id}: issue raised on milestone ${i+1}; release remains paused.`);save();renderPayment();renderMessages();renderAdminCentre();toast("Issue recorded — represented payment remains held")
}
function residentResolveIssue(id){
 ensureV33State();const j=state.resident.job;if(!j)return;const x=j.issues.find(q=>q.id===id);if(!x)return;x.status="resolved";x.resolvedAt=Date.now();recordAudit("issue","OCC admin",j.id,`${id} resolved and returned to evidence/sign-off flow`,"resolved");addProtectionHistory(`Issue ${id} marked resolved and returned to the normal evidence/sign-off process.`,"ok");addNotification("✓","Payment issue resolved",`${j.id}: ${id} was marked resolved.`);save();renderPayment();renderMessages();renderAdminCentre();toast("Issue resolved — milestone can continue")
}
function renderAdminCentre(){
 ensureV33State();ensureBusinessState();ensureEmployerState();const j=state.resident.job;const openIssues=j?.issues?.filter(x=>x.status==="open")||[];const pendingEvidence=(state.joined||[]).filter(id=>!state.evidence?.some(e=>e.id===id&&e.status==="verified")).length;const unchecked=Object.values(state.business.checks||{}).filter(x=>!x).length;
 $("#adminMetrics").innerHTML=[[`Verified activity evidence`,state.evidence?.filter(e=>e.status==="verified").length||0],[`Business checks outstanding`,unchecked],[`Open payment issues`,openIssues.length],[`Confirmed hires`,state.employer.hires?.length||0]].map(x=>`<div><i>${x[1]===0?"•":"✓"}</i><b>${x[0]}</b><span>${x[1]}</span></div>`).join("")
 const queue=[];if(pendingEvidence)queue.push(`<article class="item"><div class="item-icon">✓</div><div><b>${pendingEvidence} activity evidence item(s)</b><p>Joined activities still need completed evidence and sign-off.</p></div></article>`);if(unchecked)queue.push(`<article class="item"><div class="item-icon">🏪</div><div><b>${unchecked} business check(s) outstanding</b><p>Identity, business or insurance verification remains incomplete.</p></div></article>`);openIssues.forEach(x=>queue.push(`<article class="item"><div class="item-icon">⚠️</div><div><b>${x.id}</b><p>Resident payment issue on milestone ${x.milestone+1}.</p><button class="mini" onclick="residentResolveIssue('${x.id}')">Mark resolved</button></div></article>`));$("#adminQueue").innerHTML=queue.join("")||'<article class="item"><div class="item-icon">✓</div><div><b>No urgent pilot items</b><p>Nothing currently requires OCC admin attention.</p></div></article>'
 $("#adminPayment").innerHTML=j?`<article class="item"><div class="item-icon">🛡️</div><div><b>${j.id}</b><p>${j.business} • £${j.price}</p><small>${openIssues.length?openIssues.length+" open issue(s)":"No open payment issues"}</small></div></article>`:'<article class="item"><div class="item-icon">🛡️</div><div><b>No resident protected job yet</b><p>Create a resident request and choose a quote to populate oversight.</p></div></article>'
 ensureV34State();const snap=$("#adminAuditSnapshot");if(snap){const linked=new Set(state.auditEvents.map(e=>e.recordId).filter(Boolean));snap.innerHTML=`<div><strong>${state.auditEvents.length}</strong><span>Audit events</span></div><div><strong>${linked.size}</strong><span>Linked records</span></div><div><strong>${state.auditEvents.filter(e=>e.type==="issue"&&e.status==="open").length}</strong><span>Open audit issues</span></div>`}
}
window.residentRaiseIssue=residentRaiseIssue;window.residentResolveIssue=residentResolveIssue


function ensureV34State(){
 state.auditEvents=state.auditEvents||[]
 if(!state.auditEvents.length){
  state.auditEvents.push({id:"AUD-V34-0001",type:"verification",actor:"OCC system",recordId:"OCC-V34",action:"V34 Evidence & Audit record initialised",status:"verified",ts:Date.now(),integrity:"PASS"})
 }
}
function recordAudit(type,actor,recordId,action,status="recorded"){
 ensureV34State();const seq=String(state.auditEvents.length+1).padStart(4,"0")
 state.auditEvents.unshift({id:`AUD-V34-${seq}-${String(Date.now()).slice(-4)}`,type,actor,recordId:recordId||"OCC-GENERAL",action,status,ts:Date.now(),integrity:"PASS"})
 state.auditEvents=state.auditEvents.slice(0,120)
}
function auditIcon(type){return ({evidence:"📎",signoff:"✓",payment:"🛡️",issue:"⚠",verification:"🔎"})[type]||"•"}
function renderAuditCentre(){
 ensureV34State();ensureV33State();const filter=$("#auditFilter")?.value||"all";const rows=state.auditEvents.filter(e=>filter==="all"||e.type===filter)
 const linked=new Set(state.auditEvents.map(e=>e.recordId).filter(x=>x&&x.startsWith("OCC-R-")))
 $("#auditEventCount").textContent=state.auditEvents.length;$("#auditJobCount").textContent=linked.size;$("#auditIssueCount").textContent=state.auditEvents.filter(e=>e.type==="issue").length;$("#auditIntegrity").textContent=state.auditEvents.every(e=>e.integrity==="PASS")?"100%":"CHECK"
 $("#auditTimeline").innerHTML=rows.map(e=>`<article class="audit-event"><div class="audit-event-icon">${auditIcon(e.type)}</div><div><b>${e.action}</b><p>${e.actor} • ${e.recordId||"OCC general record"}</p><small>${fmtWhen(e.ts)}</small><div class="audit-event-meta"><span class="audit-pill">${e.type.toUpperCase()}</span><span class="audit-pill ${e.status==="open"?"warn":"ok"}">${String(e.status).toUpperCase()}</span><span class="audit-pill ok">INTEGRITY ${e.integrity}</span></div></div><div class="audit-event-id">${e.id}</div></article>`).join("")||'<article class="item"><div class="item-icon">•</div><div><b>No events match this filter</b><p>Choose another audit category.</p></div></article>'
 const j=state.resident.job;const checks=[["Audit event IDs generated",state.auditEvents.every(e=>!!e.id)],["Actors recorded",state.auditEvents.every(e=>!!e.actor)],["Timestamps recorded",state.auditEvents.every(e=>!!e.ts)],["OCC Job ID linked where applicable",!j||state.auditEvents.some(e=>e.recordId===j.id)],["Integrity check represented",state.auditEvents.every(e=>e.integrity==="PASS")]]
 $("#auditIntegrityList").innerHTML=checks.map(x=>`<div class="${x[1]?"done":""}"><i>${x[1]?"✓":"•"}</i><b>${x[0]}</b></div>`).join("")
 const f=$("#auditFilter");if(f&&!f.dataset.bound){f.dataset.bound="1";f.addEventListener("change",renderAuditCentre)}
 const ex=$("#exportAuditPack");if(ex&&!ex.dataset.bound){ex.dataset.bound="1";ex.onclick=exportAuditPack}
}
function exportAuditPack(){
 ensureV34State();const j=state.resident.job;const pack={version:"OCC V34 Evidence & Audit Upgrade",generatedAt:new Date().toISOString(),prototype:true,job:j?{id:j.id,title:j.title,business:j.business,price:j.price}:null,auditEvents:state.auditEvents,integrity:{events:state.auditEvents.length,allEventIds:state.auditEvents.every(e=>!!e.id),allTimestamps:state.auditEvents.every(e=>!!e.ts),integrityPass:state.auditEvents.every(e=>e.integrity==="PASS")}}
 const blob=new Blob([JSON.stringify(pack,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`OCC_V34_Evidence_Pack_${j?.id||"DEMO"}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);recordAudit("verification","OCC admin",j?.id||"OCC-V34","Evidence pack exported","verified");save();renderAuditCentre();renderAdminCentre();toast("V34 evidence pack exported")
}
window.exportAuditPack=exportAuditPack

function ensureEcosystemState(){state.ecosystem=state.ecosystem||{events:[],linkedBusinessReviews:0,linkedBusinessJobs:0,linkedHires:0}}
function addEcoEvent(type,text){
 ensureEcosystemState()
 const key=type+"|"+text
 if(!state.ecosystem.events.some(e=>e.key===key))state.ecosystem.events.unshift({key,type,text,ts:Date.now()})
 state.ecosystem.events=state.ecosystem.events.slice(0,20)
}
function syncEcosystem(){
 ensureEcosystemState();ensureBusinessState();ensureResidentState();ensureEmployerState()
 const signed=state.resident.job?.signed?1:0
 const review=state.resident.review?1:0
 state.ecosystem.linkedBusinessJobs=signed
 state.ecosystem.linkedBusinessReviews=review
 state.ecosystem.linkedHires=state.employer.hires.length+(state.pipeline?.employed?1:0)
 if(signed)addEcoEvent("job",`${state.resident.job.business} received a customer-signed OCC job record.`)
 if(review)addEcoEvent("review",`A verified resident review was linked to ${state.resident.job?.id||"an OCC Job ID"}.`)
 if(state.employer.hires.length)addEcoEvent("hire",`${state.employer.hires.length} employer-confirmed hire${state.employer.hires.length===1?"":"s"} recorded.`)
 if(state.pipeline?.employed)addEcoEvent("hire","A jobseeker employment outcome was recorded on the OCC pathway.")
 if(state.hours>0)addEcoEvent("hours",`${state.hours} verified participant hours are contributing to OCC impact evidence.`)
}
function renderEcosystem(){
 syncEcosystem()
 $("#ecoHours").textContent=state.hours||0
 $("#ecoHires").textContent=state.ecosystem.linkedHires
 $("#ecoJobs").textContent=state.ecosystem.linkedBusinessJobs+state.business.jobs.filter(j=>j.signed).length
 $("#ecoReviews").textContent=state.ecosystem.linkedBusinessReviews
 const icons={job:"🏠",review:"★",hire:"💼",hours:"✓"}
 $("#ecoFeed").innerHTML=state.ecosystem.events.length?state.ecosystem.events.map(e=>`<article><b>${icons[e.type]||"✓"} ${e.text}</b><span>Linked automatically by the V27 ecosystem prototype.</span></article>`).join(""):'<article><b>No linked activity yet</b><span>Complete actions in the Jobseeker, Employer, Business or Resident journeys and they will appear here.</span></article>'
 const impact=[
  ["Community participation evidenced",(state.hours||0)>0],
  ["Employment outcome evidenced",state.ecosystem.linkedHires>0],
  ["Resident job completed and signed off",state.ecosystem.linkedBusinessJobs>0],
  ["Verified customer review created",state.ecosystem.linkedBusinessReviews>0],
  ["Business Community Contribution evidenced",state.business.contributions.some(c=>c.verified)]
 ]
 $("#ecoImpact").innerHTML=impact.map(x=>`<div class="${x[1]?"done":""}"><i>${x[1]?"✓":"•"}</i><b>${x[0]}</b></div>`).join("")
}


function ensureCreditsState(){
 state.credits=state.credits||{balance:0,history:[],awardedKeys:[],partnerOffers:[]}
 state.credits.history=state.credits.history||[];state.credits.awardedKeys=state.credits.awardedKeys||[];state.credits.partnerOffers=state.credits.partnerOffers||[]
}
function awardCredits(key,amount,reason){
 ensureCreditsState()
 if(state.credits.awardedKeys.includes(key))return false
 state.credits.awardedKeys.push(key);state.credits.balance+=amount
 state.credits.history.unshift({type:"earn",amount,reason,ts:Date.now()})
 return true
}
function spendCredits(id,cost,label){
 ensureCreditsState()
 if(state.credits.balance<cost){toast("Not enough Community Credits yet");return}
 state.credits.balance-=cost;state.credits.history.unshift({type:"spend",amount:cost,reason:label,ts:Date.now()})
 save();renderCreditsHub();renderCreditHistory();renderRewardMarket();toast("Reward claimed with Community Credits")
}
function syncCredits(){
 ensureCreditsState()
 if((state.hours||0)>0)awardCredits("hours-"+state.hours,Math.min(state.hours*2,40),`${state.hours} verified community hours`)
 if(state.pipeline?.interview)awardCredits("jobseeker-interview",10,"Interview milestone reached")
 if(state.pipeline?.employed)awardCredits("jobseeker-employed",20,"Employment outcome achieved")
 if(state.business?.contributions?.some(c=>c.verified))awardCredits("business-contribution",20,"Verified business Community Contribution")
 if(state.resident?.review)awardCredits("resident-review",5,"Verified customer review linked to OCC Job ID")
 if(state.employer?.hires?.length)awardCredits("employer-hire-"+state.employer.hires.length,10,"Employer confirmed an OCC employment outcome")
}
function renderCreditsHub(){
 syncCredits();$("#creditBalance").textContent=state.credits.balance
}
function renderEarnRules(){
 ensureCreditsState()
 const rules=[
  ["Verified community activity","2 credits per verified hour","Jobseekers / participants"],
  ["Interview milestone","10 credits","Jobseekers"],
  ["Employment outcome","20 credits","Jobseekers"],
  ["Verified Community Contribution","20 credits","Businesses"],
  ["Verified customer review","5 credits","Residents"],
  ["Confirmed OCC hire","10 credits","Employers"]
 ]
 $("#earnRules").innerHTML=rules.map(r=>`<article class="item"><div class="item-icon">🪙</div><div><b>${r[0]}</b><p>${r[1]}</p><span class="credit-chip">${r[2]}</span></div></article>`).join("")
}
function renderRewardMarket(){
 ensureCreditsState()
 const offers=state.credits.partnerOffers
 $("#rewardMarketList").innerHTML=offers.map(o=>`<article class="item ${state.credits.balance<o.cost?"reward-locked":""}"><div class="item-icon">🎁</div><div><b>${o.offer}</b><p>${o.partner}</p><span class="credit-cost">${o.cost} credits</span><div class="actions"><button class="mini" onclick="spendCredits('${o.id}',${o.cost},'${o.offer.replace(/'/g,"")}')">${state.credits.balance>=o.cost?"Claim reward":"Need more credits"}</button></div></div></article>`).join("")
}
function renderCreditHistory(){
 ensureCreditsState()
 $("#creditHistoryList").innerHTML=state.credits.history.length?state.credits.history.map(h=>`<article><b class="${h.type==="earn"?"history-plus":"history-minus"}">${h.type==="earn"?"+":"-"}${h.amount} credits — ${h.reason}</b><span>${h.type==="earn"?"Verified OCC activity":"Reward redemption"} recorded in prototype.</span></article>`).join(""):'<article><b>No credit activity yet</b><span>Complete verified OCC actions to begin earning Community Credits.</span></article>'
}
function renderPartnerOffers(){
 ensureCreditsState()
 $("#partnerOfferList").innerHTML=state.credits.partnerOffers.map(o=>`<article class="item"><div class="item-icon">🤝</div><div><b>${o.partner}</b><p>${o.offer}</p><span class="credit-chip">${o.cost} credits</span><div><span class="status-chip hired">Verified partner offer ✓</span></div></div></article>`).join("")
}


function ensureFundingState(){
 state.funding=state.funding||{total:25000,votesLeft:3,projects:[],allocations:[]};state.funding.allocations=state.funding.allocations||[]
}
function money(n){return "£"+Number(n||0).toLocaleString("en-GB")}
function renderFundingHub(){
 ensureFundingState();const a=state.funding.allocations.reduce((n,x)=>n+x.amount,0)
 $("#fundTotal").textContent=money(state.funding.total);$("#fundAllocated").textContent=money(a);$("#fundRemaining").textContent=money(state.funding.total-a)
}
function renderVoting(){
 ensureFundingState();const max=Math.max(...state.funding.projects.map(p=>p.votes),1)
 $("#voteList").innerHTML=state.funding.projects.map(p=>`<article class="item"><div class="item-icon"><svg class="occ-ui-icon" viewBox="0 0 24 24"><path d="M5 10h14v10H5z"/><path d="m8 10 3-6h5l2 6"/><path d="m9 14 2 2 4-4"/></svg></div><div><b>${p.title}</b><p>${p.votes} community votes • indicative budget ${money(p.budget)}</p><div class="vote-bar"><i style="width:${p.votes/max*100}%"></i></div><div class="actions"><button class="mini" onclick="castVote('${p.id}')">${state.funding.votesLeft>0?"Vote for this":"Votes used"}</button></div></div></article>`).join("")+`<p class="muted">Votes remaining: ${state.funding.votesLeft}</p>`
}
function castVote(id){ensureFundingState();if(state.funding.votesLeft<=0){toast("All 3 prototype votes have been used");return}const p=state.funding.projects.find(x=>x.id===id);if(p){p.votes++;state.funding.votesLeft--}save();renderVoting();renderFundingHub();toast("Community vote recorded")}
function renderFundLedger(){
 ensureFundingState()
 const base=[{text:"Fund received • Demonstration Community Funder • Bolton",amount:state.funding.total,type:"in"}]
 const rows=base.concat(state.funding.allocations.map(a=>({text:`Allocated: ${a.project} → ${a.business}`,amount:a.amount,type:"out"})))
 $("#fundLedger").innerHTML=rows.map(x=>`<article><b>${x.text}</b><span class="ledger-amount">${x.type==="in"?"+":"-"}${money(x.amount)}</span></article>`).join("")
}
function renderFundedWork(){
 ensureFundingState()
 $("#fundedWorkList").innerHTML=state.funding.allocations.length?state.funding.allocations.map(a=>`<article class="item"><div class="item-icon"><svg class="occ-ui-icon" viewBox="0 0 24 24"><path d="M14.5 6.5a5 5 0 0 0-6.7 6.7L3 18l3 3 4.8-4.8a5 5 0 0 0 6.7-6.7l-3 3-3-3z"/></svg></div><div><b>${a.project}</b><p>${a.business} • ${money(a.amount)}</p><small>Decision source: community vote • OCC allocation ID ${a.id}</small><div class="allocation-chain"><span>Funding ✓</span><span>Vote ✓</span><span>Local business ✓</span><span>Evidence record ✓</span></div></div></article>`).join(""):'<article class="item"><div class="item-icon"><svg class="occ-ui-icon" viewBox="0 0 24 24"><path d="M14.5 6.5a5 5 0 0 0-6.7 6.7L3 18l3 3 4.8-4.8a5 5 0 0 0 6.7-6.7l-3 3-3-3z"/></svg></div><div><b>No project allocated yet</b><p>Vote on community priorities, then allocate the highest-voted demonstration project.</p></div></article>'
}
function allocateTopProject(){
 ensureFundingState()
 const available=state.funding.projects.filter(p=>!state.funding.allocations.some(a=>a.projectId===p.id)).sort((a,b)=>b.votes-a.votes)
 if(!available.length){toast("All demonstration projects are already allocated");return}
 const p=available[0],spent=state.funding.allocations.reduce((n,x)=>n+x.amount,0)
 if(spent+p.budget>state.funding.total){toast("Not enough demonstration funding remaining");return}
 const firms=["Bolton Fencing & Landscaping","Greenline Property Services","Local Community Works CIC","Northwest Home & Garden"]
 const business=firms[state.funding.allocations.length%firms.length]
 state.funding.allocations.push({id:"ALLOC-"+String(state.funding.allocations.length+1).padStart(3,"0"),projectId:p.id,project:p.title,business,requested:p.budget,amount:p.budget})
 addEcoEvent("job",`${money(p.budget)} allocated transparently to ${p.title}.`)
 save();renderFundingHub();renderFundLedger();renderFundedWork();renderFundingImpact();renderEcosystem();toast("Top-voted project allocated transparently")
}
function renderFundingImpact(){
 ensureFundingState()
 $("#impactProjects").textContent=state.funding.allocations.length
 $("#impactBusinesses").textContent=new Set(state.funding.allocations.map(a=>a.business)).size
 $("#impactValue").textContent=money(state.funding.allocations.reduce((n,a)=>n+Math.max(0,(a.requested||a.amount)-a.amount),0))
 const outcomes=[
 ["Community priorities recorded",state.funding.projects.some(p=>p.votes>21)],
 ["Funding allocations publicly traceable",state.funding.allocations.length>0],
 ["Local businesses receiving funded work",state.funding.allocations.length>0],
 ["Verified participant activity",(state.hours||0)>0],
 ["Employment outcomes",state.ecosystem?.linkedHires>0],
 ["Customer-signed work",state.ecosystem?.linkedBusinessJobs>0]
 ]
 $("#funderOutcomes").innerHTML=outcomes.map(x=>`<div class="${x[1]?"done":""}"><i>${x[1]?"✓":"•"}</i><b>${x[0]}</b></div>`).join("")
}


function serviceOptions(){
 const opts=[
  {role:"Jobseeker",label:"Find Work & Opportunities",text:"Free personal service • CV, jobs, apprenticeships & progress"},
  {role:"Resident",label:"Residents & Customers",text:"Free personal service • trades, jobs & community"}
 ];
 if(state.access?.business) opts.push({role:"Business",label:"Business & Employer",text:"Separate approved business profile"});
 if(state.access?.funder) opts.push({role:"Funder",label:"Partners & Funders",text:"Separate approved organisation profile"});
 if(state.access?.worker) opts.push({role:"Worker",label:"OCC Worker",text:"Internal OCC employee tools",internal:true});
 return opts;
}
function serviceLabel(role){return ({Jobseeker:"My Employment",Resident:"Find a Tradesperson",Business:"Business & Trades",Employer:"Business & Trades",Worker:"OCC Worker",Funder:"Funders"})[role]||"My OCC"}
function renderServiceSwitcher(){
 const label=$("#currentServiceLabel"); if(label) label.textContent=serviceLabel(state.role);
 const menu=$("#serviceSwitchMenu"); if(!menu)return;
 menu.innerHTML=serviceOptions().map(o=>`<button class="${state.role===o.role?"active ":""}${o.locked?"locked ":""}${o.internal?"internal":""}" onclick="switchOccService('${o.role}')"><b>${o.label}${o.locked?" · Set up":""}</b><small>${o.text}</small></button>`).join("");
}
function renderRoleSwitches(){
 const el=$("#roleSwitches");if(!el)return;
 el.innerHTML=serviceOptions().map(o=>`<button class="${state.role===o.role?"active":""}" onclick="switchOccService('${o.role}')">${o.label}${o.locked?" · Set up":""}</button>`).join("");
 renderServiceSwitcher();
}
function switchOccService(role){
 if(role==="Business"&&!state.access?.business){toast("Create a separate Business & Employer profile to use this service");return}
 if(role==="Funder"&&!state.access?.funder){toast("Create an approved Partner & Funder organisation profile to use this service");return}
 if(role==="Worker"&&!state.access?.worker){toast("OCC Worker access can only be activated by OCC admin");return}
 if(!["Resident","Jobseeker","Business","Funder","Worker"].includes(role))return;
 state.role=role;save();renderAll();const target=role==="Business"?"business-hub":role==="Funder"?"partners-funders":role==="Resident"?"resident-hub":role==="Worker"?"worker-hub":"work-home";nav(target);$("#serviceSwitchMenu")?.classList.add("hidden");
}
function demoSwitchRole(role){switchOccService(role)}
function startGuidedDemo(){
 nav("demo-guide")
}

function renderProfile(){
 const ini=initials(state.name);
 $("#avatar").textContent=ini;
 const p1=$("#profileAvatar"); if(p1)p1.textContent=ini;
 const p2=$("#profileAvatarCard"); if(p2)p2.textContent=ini;
 const p3=$("#pathwayAvatar"); if(p3)p3.textContent=ini;
 const pn=$("#profileName"); if(pn)pn.textContent=state.name||"OCC Member";
 const pr=$("#profileRole"); if(pr)pr.textContent=state.role==="Funder"?"Partner / Funder":state.role==="Business"?"Business & Trades":state.role==="Resident"?"Resident / Customer":state.role==="Jobseeker"?"Looking for Work":state.role||"Choose your OCC role";
 const cp=$("#myOccCurrentPathway");
 if(cp)cp.textContent=state.role==="Funder"?"Partners & Funders":state.role==="Business"?"Business & Trades":state.role==="Resident"?"Residents & Customers":state.role==="Jobseeker"?"Looking for Work":"Choose your OCC pathway";
 renderOccPathways();
 renderRoleSwitches()
}
function renderOccPathways(){
 const ini=initials(state.name);
 const av=$("#pathwayAvatar"); if(av)av.textContent=ini;
 $$(".occ-pathway-choice").forEach(btn=>{
   const isCurrent=btn.dataset.role===state.role;
   btn.classList.toggle("current",isCurrent);
   const stat=btn.querySelector(".occ-pathway-status");
   if(stat)stat.textContent=isCurrent?"Current":"Select →";
 });
}
function chooseRole(role){
 if(role==="Worker"&&!state.access?.worker)return toast("OCC Worker access is internal only");
 if(!["Jobseeker","Resident","Business","Funder","Worker"].includes(role))return;
 state.access=state.access||{};
 if(role==="Business"){
   state.access.business=true; state.access.employer=true; ensureBusinessState();
   if(!state.business.name||state.business.name==="Bolton Fencing & Landscaping")state.business.name="JCB Electricians";
   if(!state.business.trade||state.business.trade==="Fencing & Landscaping")state.business.trade="Electricians";
 }
 if(role==="Funder")state.access.funder=true;
 state.role=role; save(); renderAll();
 const target=role==="Business"?"business-hub":role==="Funder"?"partners-funders":role==="Resident"?"resident-hub":role==="Worker"?"worker-hub":"home";
 nav(target); toast(`${role==="Business"?"Business & Trades":role==="Funder"?"Funders & Partners":role} pathway selected`)
}
function saveOpp(id){if(!state.saved.includes(id))state.saved.push(id);save();renderOpportunities();toast("Opportunity saved")}
function joinActivity(id){if(!state.joined.includes(id))state.joined.push(id);save();renderCommunity();renderTrust();toast("Activity added to your OCC journey")}
function claimReward(id){if(!state.claimed.includes(id))state.claimed.push(id);save();renderRewards();toast("Prototype reward claimed")}
window.switchOccService=switchOccService;window.saveOpp=saveOpp;window.joinActivity=joinActivity;window.claimReward=claimReward;window.openEmployerCandidate=openEmployerCandidate;window.employerShortlist=employerShortlist;window.employerInvite=employerInvite;window.confirmEmployerHire=confirmEmployerHire;window.completeBizCheck=completeBizCheck;window.verifyContribution=verifyContribution;window.advanceBizJob=advanceBizJob;window.chooseResidentQuote=chooseResidentQuote;window.advanceResidentJob=advanceResidentJob;window.spendCredits=spendCredits;window.castVote=castVote;window.demoSwitchRole=demoSwitchRole
function ensureWorkerState(){if(!state.worker)state.worker={requests:[],logs:[]}}
function renderWorkerHub(){ensureWorkerState();const el=$("#workerLeadList");if(!el)return;el.innerHTML=state.worker.requests.length?state.worker.requests.slice().reverse().map(r=>`<article class="item"><div class="item-icon">⌂</div><div><b>${r.trade}</b><p>${r.details}</p><small>${r.area} • Resident request • Ready for Trades & Services</small></div></article>`).join(""):'<p class="muted">No resident trade requests recorded yet. Requests will build naturally as OCC works street by street.</p>'}
function bindV67Area(){const sel=$("#occAreaSelect"),note=$("#occAreaNote");if(!sel||sel.dataset.bound)return;sel.dataset.bound="1";sel.onchange=()=>{const area=sel.value.replace(" — Pilot Area","");if(note)note.textContent=area==="Bolton"?"Bolton is the first OCC pilot area. The wider Greater Manchester network is ready for people to join.":`OCC is growing in ${area}. You can still use the wider app and join your local network while community delivery expands.`;toast(area==="Bolton"?"Bolton • OCC Pilot Area":`OCC is growing in ${area}`)}}
function bindWorker(){const req=$("#saveWorkerRequest");if(req)req.onclick=()=>{ensureWorkerState();const trade=$("#workerTrade").value.trim(),area=$("#workerArea").value.trim(),details=$("#workerDetails").value.trim();if(!trade||!area||!details)return toast("Add the trade, area and job details");if(!$("#workerConsent").checked)return toast("Resident agreement is required");state.worker.requests.push({id:Date.now(),trade,area,details,status:"open"});save();renderWorkerHub();toast("Resident request added to OCC");nav("worker-hub")};const log=$("#saveWorkerLog");if(log)log.onclick=()=>{ensureWorkerState();const area=$("#workerLogArea").value.trim(),details=$("#workerLogDetails").value.trim();if(!area||!details)return toast("Add the area and work completed");state.worker.logs.push({id:Date.now(),area,details});save();toast("OCC work record saved");nav("worker-hub")}}
function bindNav(){
 $$("[data-go]").forEach(b=>{b.onclick=()=>{const s=b.dataset.go; if(s==="opportunities")renderOpportunities(); if(s==="community")renderPublicCommunity(); if(s==="community-activity")renderCommunity(); if(s==="matching")renderCandidates(); if(s==="businesses")renderBusinesses(); if(s==="rewards")renderRewards(); if(s==="trust")renderTrust(); if(s==="pathway")renderPathway(); if(s==="profile")renderProfile(); if(s==="pf-partnership"&&window.renderPartnerPosts)window.renderPartnerPosts(); if(s==="occ-pathways")renderOccPathways(); if(s==="job-profile")renderJobProfile(); if(s==="job-cv")renderJobCV(); if(s==="job-evidence")renderJobEvidence(); if(s==="job-employers")renderJobEmployers(); if(s==="job-pipeline")renderJobPipeline(); if(s==="employer-dashboard")renderEmployerDashboard(); if(s==="employer-search")renderEmployerSearch(); if(s==="employer-candidate")renderEmployerCandidate(); if(s==="employer-shortlist")renderEmployerShortlist(); if(s==="employer-interviews")renderEmployerInterviews(); if(s==="employer-outcomes")renderEmployerOutcomes(); if(s==="business-hub")renderBusinessHub(); if(s==="business-opportunities")renderBusinessOpportunities(); if(s==="business-quotes")renderBusinessQuotes(); if(s==="business-quote-profile")renderTradeQuoteProfile(); if(s==="business-trade-payment")renderBusinessPayment(); if(s==="business-profile")renderBusinessProfile(); if(s==="business-membership"){}; if(s==="business-checks")renderBusinessChecks(); if(s==="business-contribution")renderContribution(); if(s==="business-work")renderBusinessWork(); if(s==="business-public")renderBusinessPublic(); if(s==="resident-hub")renderResidentHub(); if(s==="resident-quotes")renderResidentQuotes(); if(s==="resident-job")renderResidentJob(); if(s==="resident-payment")renderPayment(); if(s==="resident-review")renderResidentReview(); if(s==="ecosystem")renderEcosystem(); if(s==="credits-hub")renderCreditsHub(); if(s==="credits-earn")renderEarnRules(); if(s==="credits-market")renderRewardMarket(); if(s==="credits-history")renderCreditHistory(); if(s==="partner-rewards")renderPartnerOffers(); if(s==="funding-hub")renderFundingHub(); if(s==="community-vote")renderVoting(); if(s==="funding-ledger")renderFundLedger(); if(s==="funded-work")renderFundedWork(); if(s==="funding-impact")renderFundingImpact(); if(s==="worker-hub")renderWorkerHub(); if(s==="messages")renderMessages(); if(s==="admin-centre")renderAdminCentre(); if(s==="audit-centre")renderAuditCentre(); nav(s)}})
 $$(".role-card[data-role]").forEach(b=>b.onclick=()=>chooseRole(b.dataset.role)); $$(".occ-pathway-choice[data-role]").forEach(b=>b.onclick=()=>chooseRole(b.dataset.role))
 const sw=$("#serviceSwitchBtn");if(sw)sw.onclick=(e)=>{e.stopPropagation();$("#serviceSwitchMenu").classList.toggle("hidden")};
 const ops=$("#openServiceSwitch");if(ops)ops.onclick=()=>{$("#serviceSwitchMenu").classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"})};
 const workPathway=$("#workChangePathway");if(workPathway)workPathway.onclick=()=>openWorkPathwaySwitcher();
}
function renderAll(){ensureJobState();ensureEmployerState();ensureBusinessState();ensureResidentState();ensureEcosystemState();ensureCreditsState();ensureFundingState();ensureV34State();renderHome();renderOpportunities();renderPublicCommunity();renderCommunity();renderCandidates();renderBusinesses();renderRewards();renderTrust();renderPathway();renderProfile();renderJobCV();renderJobPipeline();renderEmployerDashboard();renderEmployerShortlist();renderEmployerInterviews();renderEmployerOutcomes();renderBusinessHub();renderBusinessOpportunities();renderBusinessQuotes();renderTradeQuoteProfile();renderBusinessPayment();renderContribution();renderBusinessWork();renderBusinessPublic();renderResidentHub();renderResidentQuotes();renderResidentJob();renderPayment();renderEcosystem();renderCreditsHub();renderEarnRules();renderRewardMarket();renderCreditHistory();renderPartnerOffers();renderFundingHub();renderVoting();renderFundLedger();renderFundedWork();renderFundingImpact();renderWorkerHub();renderRoleSwitches();bindNav();bindWorker();bindV67Area()}

function openWorkPathwaySwitcher(){
  // Keep the member signed in and preserve all pathway data.
  // This only changes the active OCC pathway.
  document.body.classList.add("onboarding-open");
  const onboarding=document.querySelector("#onboarding");
  if(onboarding) onboarding.classList.add("active");
  onboardNav("role");
}
window.openWorkPathwaySwitcher=openWorkPathwaySwitcher;

function onboardNav(name){
  document.querySelectorAll(".onboard-screen").forEach(x=>x.classList.toggle("active",x.dataset.onboard===name))
  document.querySelector("#onboarding").scrollTo({top:0,behavior:"smooth"})
}
function showOnboarding(){
  document.body.classList.add("onboarding-open")
  document.querySelector("#onboarding").classList.add("active")
  onboardNav("signin")
}
function hideOnboarding(){
  document.body.classList.remove("onboarding-open")
  document.querySelector("#onboarding").classList.remove("active")
}
function bindOnboarding(){
  document.querySelectorAll("[data-on-next]").forEach(b=>b.onclick=()=>onboardNav(b.dataset.onNext))
  document.querySelectorAll("[data-on-back]").forEach(b=>b.onclick=()=>onboardNav(b.dataset.onBack))
  document.querySelector("#createAccount").onclick=()=>{
    const name=(document.querySelector("#accountName")||document.querySelector("#regName")).value.trim()
    const email=(document.querySelector("#accountEmail")||document.querySelector("#regEmail")).value.trim()
    const password=(document.querySelector("#accountPassword")||document.querySelector("#regPassword")).value
    const confirm=(document.querySelector("#accountConfirm")||document.querySelector("#regPasswordConfirm")).value
    if(!name || !email){toast("Add your name and email to continue"); return}
    if(!password || password!==confirm){toast("Make sure both passwords match"); return}

    state.name=name; state.email=email; state.role=""
    try{ save(); renderAll(); }catch(err){ console.warn("OCC review render warning",err) }
    onboardNav("role")
  }
  document.querySelector("#signInDemo").onclick=()=>{
    const email=document.querySelector("#loginEmail").value.trim()
    if(!email){toast("Enter an email to sign in"); return}
    state.email=email
    if(!state.name) state.name="Kristian Roberts"

    // Existing account: return directly to the saved pathway Home.
    // If no valid saved pathway exists, fall back to the four-route chooser.
    const validRoles=["Jobseeker","Resident","Business","Funder"]
    if(!validRoles.includes(state.role)){
      onboardNav("role")
      try{ save(); renderAll(); }catch(err){ console.warn("OCC review render warning",err) }
      return
    }

    try{ save(); renderAll(); }catch(err){ console.warn("OCC review render warning",err) }
    hideOnboarding()
    const target=state.role==="Business"?"business-hub":
                 state.role==="Resident"?"resident-hub":
                 state.role==="Funder"?"partners-funders":"work-home"
    nav(target)
  }
  document.querySelectorAll("[data-on-role]").forEach(b=>b.onclick=()=>{
    const role=b.dataset.onRole;
    if(!["Jobseeker","Resident","Business","Funder"].includes(role)) return;
    state.role=role;
    if(role==="Business") state.access.business=true;
    if(role==="Funder") state.access.funder=true;
    state.onboarded=true;
    save(); renderAll(); hideOnboarding();
    const target=role==="Business"?"business-hub":role==="Resident"?"resident-hub":role==="Funder"?"partners-funders":"work-home";
    nav(target);
    toast(role==="Business"?"Welcome back, Kristian":`Welcome to ${role}`);
  })
  document.querySelector('[data-on-next="consent"]').onclick=()=>{
    state.area=document.querySelector("#setupArea").value.trim()
    if(state.role==="Resident"){
      state.skills=""
      state.goal=document.querySelector("#setupTradeNeed").value || "Construction / property work"
    } else if(state.role==="Business"){
      ensureBusinessState();
      const name=document.querySelector("#setupBusinessName").value.trim(), services=document.querySelector("#setupBusinessServices").value.trim();
      if(!name||!services||!state.area){toast("Add your business name, trade or services, and working area");return}
      state.business.name=name; state.business.trade=services; state.business.services=services; state.business.area=state.area;
      // Purpose and availability are managed from My Business Profile, not onboarding.
      state.business.profileComplete=true; state.access=state.access||{}; state.access.business=true; state.access.employer=true;
      state.onboarded=true; save(); renderAll(); hideOnboarding(); nav("business-hub"); toast("Business profile created"); return;
    } else {
      state.skills=document.querySelector("#setupSkills").value.trim() || "Any work / Open to opportunities"
      state.employmentStatus=document.querySelector("#setupStatus")?.value || "Looking for work"
      state.goal=state.employmentStatus
    }
    save();
    if(state.role==="Resident"){
      state.onboarded=true;
      save(); renderAll(); hideOnboarding(); nav("resident-hub"); toast("Let’s find the right tradesperson"); return;
    }
    if(state.role==="Jobseeker"){
      state.onboarded=true;
      state.jobProfile=state.jobProfile||{};
      state.jobProfile.status=state.employmentStatus;
      state.jobProfile.interests=state.skills;
      save(); renderAll(); hideOnboarding(); nav("work-home"); toast("Welcome to Find Work & Opportunities"); return;
    }
    onboardNav("consent")
  }
  document.querySelector("#finishOnboarding").onclick=()=>{
    state.consents={
      evidence:document.querySelector("#consentEvidence").checked,
      matching:document.querySelector("#consentMatching").checked,
      contact:document.querySelector("#consentContact").checked
    }
    state.onboarded=true
    save(); renderAll(); hideOnboarding(); nav(state.role==="Business"?"business-hub":state.role==="Funder"?"partners-funders":state.role==="Worker"?"worker-hub":"work-home"); toast("Welcome to OCC")
  }
}

document.addEventListener("DOMContentLoaded",()=>{
 bindOnboarding()
 ensureV33State()
 renderAll()
 renderMessages()
 showOnboarding(); onboardNav("signin")
 $("#oppSearch").addEventListener("input",renderOpportunities);$("#oppType").addEventListener("change",renderOpportunities)
 $("#candidateSearch").addEventListener("input",renderCandidates);$("#candidateHours").addEventListener("change",renderCandidates)
 $("#saveJobProfile").onclick=()=>{ensureJobState();state.jobProfile.about=$("#jsAbout").value.trim();state.jobProfile.skills=$("#jsSkills").value.trim();state.jobProfile.interests=$("#jsInterests").value.trim();state.jobProfile.availability=$("#jsAvailability").value;state.jobProfile.travel=$("#jsTravel").value;state.jobProfile.status=$("#jsStatus")?.value||"Looking for work";save();renderAll();renderJobPipeline();toast("Work profile saved")}
 $("#employerVisible").onchange=e=>{ensureJobState();state.jobProfile.visible=e.target.checked;save();renderJobEmployers();renderJobPipeline();renderJobCV();toast(state.jobProfile.visible?"Profile visible to suitable employers":"Employer visibility switched off")}
 $("#simulateInterest").onclick=()=>{ensureJobState();if(!state.jobProfile.visible){toast("Make your profile visible to employers first");return}state.pipeline.interest=true;save();renderJobPipeline();renderJobCV();toast("Employer interest added")}
 $("#simulateInterview").onclick=()=>{ensureJobState();if(!state.pipeline.interest){toast("Simulate employer interest first");return}state.pipeline.interview=true;save();renderJobPipeline();renderJobCV();renderRewards();toast("Interview booked — support can activate")}
 $("#simulateEmployed").onclick=()=>{ensureJobState();if(!state.pipeline.interview){toast("Book an interview first");return}state.pipeline.employed=true;state.jobProfile.status="Now employed";syncEcosystem();syncCredits();save();renderJobPipeline();renderJobCV();renderJobProfile();renderEcosystem();renderCreditsHub();toast("Employment outcome recorded — your Find Work history stays saved")}
 const feedbackRequest=$("#requestEmployerFeedback"); if(feedbackRequest) feedbackRequest.onclick=requestEmployerFeedback;
 const residentTransition=$("#switchToResidentAfterEmployment"); if(residentTransition) residentTransition.onclick=()=>{switchOccService("Resident");toast("Your Find Work history is saved in My OCC")};
 $("#empSearch").addEventListener("input",renderEmployerSearch);$("#empHours").addEventListener("change",renderEmployerSearch)
 $("#empShortlistBtn").onclick=()=>{ensureEmployerState();const id=state.employer.selected||employerCandidates()[0].id;employerShortlist(id)}
 $("#empInterestBtn").onclick=()=>{ensureEmployerState();const id=state.employer.selected||employerCandidates()[0].id;employerInterest(id)}
 $("#empInviteBtn").onclick=()=>{ensureEmployerState();const id=state.employer.selected||employerCandidates()[0].id;employerInvite(id)}
 const postOpp=$("#postBusinessOpportunity"); if(postOpp) postOpp.onclick=()=>{ensureBusinessState();const title=$("#oppWorkTitle").value.trim();if(!title){toast("Add the work your business needs");return}state.business.opportunities.push({id:"OCC-OPP-"+Date.now(),title,trade:$("#oppTrade").value,budget:+$("#oppBudget").value||0,area:$("#oppArea").value.trim()||state.business.area||"Bolton",status:"open"});$("#oppWorkTitle").value="";save();renderBusinessOpportunities();toast("Paid OCC opportunity posted")};
 if($("#bizLogoUpload"))$("#bizLogoUpload").onchange=e=>{const f=e.target.files&&e.target.files[0];if(!f)return;if(f.size>1500000){toast("Please use a logo under 1.5 MB for the prototype");e.target.value="";return}const r=new FileReader();r.onload=()=>{ensureBusinessState();state.business.logo=r.result;save();renderBusinessProfile();toast("Company logo added")};r.readAsDataURL(f)};
 $("#saveBizProfile").onclick=()=>{ensureBusinessState();state.business.name=$("#bizName").value.trim();state.business.trade=$("#bizTrade").value.trim();state.business.area=$("#bizArea").value.trim();state.business.services=$("#bizServices").value.trim();state.business.about=$("#bizAbout").value.trim();if($("#bizPurpose"))state.business.purpose=$("#bizPurpose").value;if($("#bizProfileAvailability"))state.business.availability=$("#bizProfileAvailability").value;if($("#bizProfileNextAvailable"))state.business.nextAvailable=state.business.availability==="available"?"":$("#bizProfileNextAvailable").value;state.business.profileComplete=!!(state.business.name&&state.business.trade&&state.business.area);save();renderBusinessHub();renderBusinessPublic();toast("Business profile saved")}
 $("#addContribution").onclick=()=>{ensureBusinessState();const desc=$("#contribDesc").value.trim();if(!desc){toast("Add a short contribution description");return}state.business.contributions.push({id:"CC-"+Date.now(),type:$("#contribType").value,desc,hours:+$("#contribHours").value||1,verified:false});$("#contribDesc").value="";save();renderContribution();renderBusinessHub();toast("Contribution submitted for verification")}
 $("#createDemoJob").onclick=()=>{ensureBusinessState();const n=state.business.jobs.length+1;state.business.jobs.push({id:"OCC-JOB-"+String(n).padStart(3,"0"),title:"Community fencing repair",customer:"Community recipient",before:false,after:false,signed:false});save();renderBusinessWork();toast("Traceable OCC job created")}
 $("#submitResidentJob").onclick=()=>{ensureResidentState();const desc=$("#residentDesc").value.trim();if(!desc){toast("Describe the work you need");return}state.resident.request={category:$("#residentCategory").value,desc,area:($("#residentArea").value+(($("#residentPostcode")?.value||"").trim()?" • "+$("#residentPostcode").value.trim():"")),timing:$("#residentTiming").value,contactMode:(document.querySelector('input[name="residentContactMode"]:checked')?.value||"choose")};state.resident.quotes=[];state.resident.selectedQuote=null;state.resident.job=null;state.resident.review="";state.resident.rating=0;generateResidentQuotes();save();renderResidentHub();renderResidentQuotes();nav("resident-quotes");toast("Suitable tradespeople found — compare your matches")}
 document.querySelectorAll("[data-rating]").forEach(b=>b.onclick=()=>{state.resident.rating=+b.dataset.rating;save();renderResidentReview()})
 $("#submitVerifiedReview").onclick=()=>{ensureResidentState();if(!state.resident.job?.signed){toast("The job needs customer sign-off first");return}if(!state.resident.rating){toast("Choose a star rating");return}const txt=$("#reviewText").value.trim();if(!txt){toast("Add a short review");return}state.resident.review=txt;syncEcosystem();syncCredits();save();renderResidentHub();renderBusinessPublic();renderEcosystem();renderCreditsHub();toast("Verified review linked — credits and business record updated")}
 $("#addPartnerOffer").onclick=()=>{ensureCreditsState();const partner=$("#partnerName").value.trim(),offer=$("#partnerOfferType").value,cost=+$("#partnerCreditCost").value||0;if(!partner){toast("Add partner name");return}state.credits.partnerOffers.push({id:"po-"+Date.now(),partner,offer,cost});save();renderPartnerOffers();renderRewardMarket();toast("Verified partner offer added")}
 $("#submitCommunityIdea").onclick=()=>{const title=$("#communityIdeaTitle").value.trim(),desc=$("#communityIdeaDesc").value.trim(),area=$("#communityIdeaArea").value;if(!title||!desc){toast("Add the improvement and a short description");return}ensureFundingState();state.funding.projects.push({id:"fp"+Date.now(),title:title+" • "+area,votes:0,budget:0,status:"OCC review"});save();renderVoting();toast("Idea sent to OCC for evidence and feasibility review");nav("community-vote")}
 $("#allocateTopProject").onclick=allocateTopProject
 $("#startDemo").onclick=startGuidedDemo
 $("#openDemoGuide").onclick=startGuidedDemo
 $("#resetEcoDemo").onclick=()=>{ensureEcosystemState();state.ecosystem.events=[];save();renderEcosystem();toast("Ecosystem activity feed reset")}
 $("#resetApp").onclick=()=>{localStorage.removeItem("occV30State");location.reload()}
})

/* OCC V42 — Verified Evidence & Employment Journey */
let v42EvidenceId=null;
function v42VerifiedEvidence(){ensureJobState();return state.evidence.filter(e=>e.status==="verified")}
function v42SyncTotals(){
  ensureJobState(); const evs=v42VerifiedEvidence();
  state.hours=evs.reduce((n,e)=>n+(+e.hours||0),0);
  state.refs=evs.filter(e=>e.signer).length;
  const skills=[...new Set(evs.flatMap(e=>(e.skills||[])))]; state.skillsCount=skills.length;
  return {evs,skills,hours:state.hours,refs:state.refs};
}
function v42SetAvatar(el){if(!el)return; if(state.jobProfile?.avatar){el.style.backgroundImage=`url(${state.jobProfile.avatar})`;el.classList.add('has-photo');el.textContent=''}else{el.style.backgroundImage='';el.classList.remove('has-photo');el.textContent=initials(state.name)}}
function v42RenderProfileExtras(){
  ensureJobState(); const t=v42SyncTotals();
  v42SetAvatar(document.querySelector('#jobAvatarPreview'));v42SetAvatar(document.querySelector('#cvAvatar'));
  const vis=document.querySelector('#profileEmployerVisible'); if(vis)vis.checked=!!state.jobProfile.visible;
  const vt=document.querySelector('#profileVisibilityTitle');if(vt)vt.textContent=state.jobProfile.visible?'Visible to OCC Verified Employers':'Hidden from employers';
  const sum=document.querySelector('.v36-trust-summary');if(sum)sum.innerHTML=`<div><strong>${t.hours}</strong><span>Verified hours</span></div><div><strong>${t.skills.length}</strong><span>Skills evidenced</span></div><div><strong>${t.evs.length}</strong><span>Completed jobs</span></div><div><strong>${t.evs.length?'100%':'0%'}</strong><span>Evidence checked</span></div>`;
}
function v42OpenEvidence(id,view=false){
  ensureJobState();v42EvidenceId=id;const c=community.find(x=>x.id===id);const ev=state.evidence.find(x=>x.id===id);
  document.querySelector('#evidenceModalTitle').textContent=c?.title||'OCC activity';document.querySelector('#evidenceJobId').textContent=`OCC Activity ID: ${id.toUpperCase()}`;
  const form=document.querySelector('#evidenceForm'),record=document.querySelector('#evidenceRecord');
  if(view&&ev?.status==='verified'){
    form.classList.add('hidden');record.classList.remove('hidden');record.innerHTML=`<span class="evidence-status verified">Verified ✓</span><div class="v42-record-grid"><div><b>Verified hours</b><span>${ev.hours}</span></div><div><b>Skills demonstrated</b><span>${(ev.skills||[]).join(', ')||'—'}</span></div><div><b>Before / during / after proof</b><span>${ev.before} • ${ev.during} • ${ev.after}</span></div><div><b>Independent sign-off</b><span>${ev.signer}</span></div><div><b>OCC verification</b><span>${ev.verifiedAt||'Verified in prototype'} • Participant cannot self-verify</span></div></div>`;
  }else{
    form.classList.remove('hidden');record.classList.add('hidden');
    const max=+(c?.meta.match(/(\d+)/)?.[1]||3);document.querySelector('#evHours').value=max;document.querySelector('#evSkills').value=(c?.skill||'').replaceAll(' • ', ', ');
    ['evAttend','evSigned'].forEach(x=>document.querySelector('#'+x).checked=false);['evBefore','evDuring','evAfter','evSigner'].forEach(x=>document.querySelector('#'+x).value='');
  }
  const m=document.querySelector('#evidenceModal');m.classList.add('open');m.setAttribute('aria-hidden','false');
}
function v42CloseEvidence(){const m=document.querySelector('#evidenceModal');m.classList.remove('open');m.setAttribute('aria-hidden','true')}
function v42SubmitEvidence(){
  const id=v42EvidenceId,c=community.find(x=>x.id===id);if(!id)return;
  const attend=document.querySelector('#evAttend').checked,signed=document.querySelector('#evSigned').checked,hours=+document.querySelector('#evHours').value,before=document.querySelector('#evBefore').value.trim(),during=document.querySelector('#evDuring').value.trim(),after=document.querySelector('#evAfter').value.trim(),signer=document.querySelector('#evSigner').value.trim(),skills=document.querySelector('#evSkills').value.split(',').map(x=>x.trim()).filter(Boolean);
  if(!attend||!hours||!before||!during||!after||!signer||!signed){toast('Complete attendance, before/during/after proof and independent sign-off first');return}
  let ev=state.evidence.find(e=>e.id===id);if(!ev){ev={id};state.evidence.push(ev)}Object.assign(ev,{status:'verified',hours,before,during,after,signer,skills,verifiedAt:new Date().toLocaleDateString('en-GB')});
  const manual=(state.jobProfile.skills||state.skills||'').split(',').map(x=>x.trim()).filter(Boolean);state.jobProfile.skills=[...new Set([...manual,...skills])].join(', ');
  recordAudit('signoff',signer,id,`Independent sign-off recorded: ${c?.title||id}`,'verified');recordAudit('verification','OCC verifier',id,'Evidence checked and approved','verified');v42SyncTotals();syncEcosystem();syncCredits();save();v42CloseEvidence();
 const raf=$("#residentAvailabilityFilter");if(raf)raf.onchange=()=>{const v=raf.value;document.querySelectorAll(".enhanced-market-cards article[data-availability]").forEach(card=>{card.style.display=(v==="all"||v==="flexible"||card.dataset.availability===v||(v==="month"&&card.dataset.availability==="now"))?"":"none"});toast(v==="all"||v==="flexible"?"Showing all suitable businesses":"Availability filter applied")};
renderAll();renderJobEvidence();v42RenderProfileExtras();toast('OCC verification complete — Trust Record and CV updated');
}
const oldRenderJobEvidence=renderJobEvidence;renderJobEvidence=function(){
  ensureJobState();const joined=state.joined||[];if(!joined.length){oldRenderJobEvidence();return}
  document.querySelector('#evidenceList').innerHTML=joined.map(id=>{const c=community.find(x=>x.id===id),ev=state.evidence.find(e=>e.id===id),status=ev?.status||'pending';return `<article class="item"><div class="item-icon">✓</div><div><b>${c?.title||'OCC activity'}</b><p>${c?.meta||'Community activity'}</p><small>${c?.skill||'Skills evidence'}</small><div><span class="evidence-status ${status}">${status==='verified'?'Verified ✓':'Evidence pending'}</span></div><div class="actions">${status==='verified'?`<button class="mini alt" onclick="v42OpenEvidence('${id}',true)">View evidence</button>`:`<button class="mini" onclick="v42OpenEvidence('${id}')">Add evidence & sign-off</button>`}</div></div></article>`}).join('')
}
const oldRenderJobCV=renderJobCV;renderJobCV=function(){v42SyncTotals();oldRenderJobCV();v42SetAvatar(document.querySelector('#cvAvatar'));const t=v42SyncTotals();const manual=(state.jobProfile.skills||state.skills||'').split(',').map(x=>x.trim()).filter(Boolean),all=[...new Set([...manual,...t.skills])];document.querySelector('#cvSkills').innerHTML=all.length?all.map(s=>`<span class="${t.skills.includes(s)?'verified-skill':''}">${s}${t.skills.includes(s)?' ✓':''}</span>`).join(''):'<span>Skills not added yet</span>';}
const oldRenderJobProfile=renderJobProfile;renderJobProfile=function(){oldRenderJobProfile();v42RenderProfileExtras()}
const oldRenderJobPipeline=renderJobPipeline;renderJobPipeline=function(){v42SyncTotals();oldRenderJobPipeline();const events=document.querySelector('#pipelineEvents');if(events&&!state.jobProfile.visible&&state.hours>0)events.innerHTML=`<article><b>Evidence ready ✓</b><span>${state.hours} verified hours are ready. Make your profile visible to OCC Verified Employers to unlock Employer Discovery.</span></article>`;}

document.addEventListener('DOMContentLoaded',()=>{
  const av=document.querySelector('#jobAvatarInput');if(av)av.onchange=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{ensureJobState();state.jobProfile.avatar=r.result;save();v42RenderProfileExtras();toast('Profile photo added')};r.readAsDataURL(f)};
  const rm=document.querySelector('#removeJobAvatar');if(rm)rm.onclick=()=>{ensureJobState();delete state.jobProfile.avatar;save();v42RenderProfileExtras();toast('Initials restored')};
  const pv=document.querySelector('#profileEmployerVisible');if(pv)pv.onchange=e=>{ensureJobState();if(e.target.checked&&v42VerifiedEvidence().length<1){e.target.checked=false;toast('Verify at least one OCC activity before becoming visible');return}state.jobProfile.visible=e.target.checked;save();renderJobPipeline();renderJobCV();v42RenderProfileExtras();toast(state.jobProfile.visible?'Visible to OCC Verified Employers':'Employer visibility switched off')};
  document.querySelector('#closeEvidenceModal').onclick=v42CloseEvidence;document.querySelector('#submitEvidence').onclick=v42SubmitEvidence;document.querySelector('#evidenceModal').addEventListener('click',e=>{if(e.target.id==='evidenceModal')v42CloseEvidence()});v42RenderProfileExtras();
});

window.employerInterest=employerInterest;
window.employerShortlist=employerShortlist;
window.employerInvite=employerInvite;
window.confirmEmployerHire=confirmEmployerHire;


/* OCC V59 — Community Work Record / Verified Hours Upgrade */
function v59WorkRecord(){
  ensureJobState();
  const verified=(state.evidence||[]).filter(e=>e.status==='verified');
  const hours=verified.reduce((n,e)=>n+(+e.hours||0),0);
  const signoffs=verified.filter(e=>e.signer).length;
  const skills=[...new Set(verified.flatMap(e=>e.skills||[]).filter(Boolean))];
  const sessions=verified.length;
  return {verified,hours,sessions,signoffs,skills,attendance:sessions?'100%':'—'};
}
function v59RenderWorkRecord(){
  const r=v59WorkRecord();
  const put=(id,val)=>{const el=document.querySelector(id);if(el)el.textContent=val};
  put('#v59Hours',r.hours);put('#v59Sessions',r.sessions);put('#v59Attendance',r.attendance);put('#v59Signoffs',r.signoffs);
  put('#v59Sectors',r.skills.length?r.skills.join(' • '):'Build verified experience to show employers what you have done.');
  let signal='Your CV remains your main employment profile. Verified OCC evidence can strengthen it.';
  if(r.hours>=30&&r.signoffs>=3)signal='Strong verified participation record — repeated activity and independent sign-off.';
  else if(r.hours>=10)signal='Growing verified participation record — useful supporting evidence for employers.';
  else if(r.hours>0)signal='Verified OCC experience started — keep building evidence if you choose to.';
  put('#v59Signal',signal);
}
const v59OldRenderJobEvidence=renderJobEvidence;renderJobEvidence=function(){v59OldRenderJobEvidence();v59RenderWorkRecord()};
const v59OldEmployerSearch=renderEmployerSearch;renderEmployerSearch=function(){v59OldEmployerSearch();document.querySelectorAll('#employerResults .item, #candidateList .item').forEach(x=>{if(!x.querySelector('.v59-employer-proof')){const d=document.createElement('div');d.className='v59-employer-proof';d.textContent='OCC evidence supports the CV — hours alone do not determine suitability.';x.querySelector('div:nth-child(2)')?.appendChild(d)}})};
document.addEventListener('DOMContentLoaded',v59RenderWorkRecord);


// V71 community discussions stay lightweight: text, replies and reporting only.


// V84.12 HARD FALLBACK: four pathway cards must always be clickable.
document.addEventListener("click", function(e){
  const card = e.target.closest("[data-role]");
  if(!card) return;
  const role = card.getAttribute("data-role");
  if(!["Jobseeker","Resident","Business","Funder"].includes(role)) return;

  e.preventDefault();
  e.stopPropagation();

  state.role = role;
  try { save(); renderAll(); } catch(err) { console.warn("OCC pathway render warning", err); }
  hideOnboarding();

  const target =
    role === "Business" ? "business-hub" :
    role === "Resident" ? "resident-hub" :
    role === "Funder" ? "funding-hub" : "home";

  nav(target);
}, true);


// V84.13 HARD FIX: actual onboarding route cards use data-on-role.
document.addEventListener("click", function(e){
  const card = e.target.closest("[data-on-role]");
  if(!card) return;

  const role = card.getAttribute("data-on-role");
  if(!["Jobseeker","Resident","Business","Funder"].includes(role)) return;

  e.preventDefault();
  e.stopImmediatePropagation();

  state.role = role;
  state.onboarded = true;
  state.access = state.access || {};
  if(role === "Business"){
    state.access.business = true;
    state.access.employer = true;
  }
  if(role === "Funder"){
    state.access.funder = true;
  }

  try { save(); renderAll(); } catch(err) { console.warn("OCC route render warning", err); }

  hideOnboarding();

  const target =
    role === "Business" ? "business-hub" :
    role === "Resident" ? "resident-hub" :
    role === "Funder" ? "partners-funders" :
    "work-home";

  nav(target);
}, true);


// OCC V86 — complete approved 10-screen Find Work & Opportunities UI
window.addEventListener('DOMContentLoaded',()=>{
  const apply=document.getElementById('v86ApplyJob');
  if(apply) apply.addEventListener('click',()=>{toast('Application sent'); nav('work-applications');});
  const saveJob=document.getElementById('v86SaveJob');
  if(saveJob) saveJob.addEventListener('click',()=>{saveJob.textContent='Saved ✓'; toast('Job saved');});
  const upload=document.getElementById('v86UploadCv'), file=document.getElementById('v86CvUpload');
  if(upload&&file){upload.addEventListener('click',()=>file.click());file.addEventListener('change',()=>{if(file.files&&file.files[0]){upload.textContent='CV selected ✓';toast('CV ready to upload');}})}
  const logout=document.getElementById('v86Logout');
  if(logout) logout.addEventListener('click',()=>{document.body.classList.remove('work-ui-active');showOnboarding();onboardNav('signin');});
});
