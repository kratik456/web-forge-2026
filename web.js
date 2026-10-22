const seedComplaints = [
 {id:"CS-1048",title:"Pothole near Main Gate",location:"Main Gate",category:"Pothole",priority:"High",status:"Pending",time:"2 hours ago",description:"Large pothole collects water after rain and creates a safety concern for two-wheelers."},
 {id:"CS-1047",title:"Garbage accumulation",location:"Hostel Block B",category:"Garbage",priority:"Medium",status:"In Progress",time:"3 hours ago",description:"Waste bins are overflowing near the hostel entrance."},
 {id:"CS-1046",title:"Water leakage near Science Block",location:"Science Block",category:"Water leakage",priority:"Medium",status:"Pending",time:"5 hours ago",description:"Water leaking from a pipe beside the walkway."},
 {id:"CS-1045",title:"Streetlight not working",location:"Academic Road",category:"Streetlight",priority:"Low",status:"Resolved",time:"6 hours ago",description:"Streetlight is not illuminating the footpath."},
 {id:"CS-1044",title:"Pothole on service road",location:"Service Road",category:"Pothole",priority:"High",status:"Pending",time:"8 hours ago",description:"Road surface is damaged near the bus turn."},
 {id:"CS-1043",title:"Waste near canteen",location:"Canteen",category:"Garbage",priority:"Medium",status:"Pending",time:"Yesterday",description:"Loose waste needs collection."}
];
let complaints = [...seedComplaints];
const categoryColors = {"Pothole":"#f15b55","Garbage":"#25b98c","Water leakage":"#2d83ec","Streetlight":"#8061e8","Other":"#f6ad2f"};
const categoryIcons = {"Pothole":"⚠","Garbage":"♻","Water leakage":"◉","Streetlight":"✦","Other":"•"};
const $ = id => document.getElementById(id);
function showToast(message){const toast=$("toast");toast.textContent=message;toast.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove("show"),3000)}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function counts(){return {total:48+complaints.length-seedComplaints.length,pending:complaints.filter(c=>c.status!=="Resolved").length+17,resolved:complaints.filter(c=>c.status==="Resolved").length+20,high:complaints.filter(c=>c.priority==="High").length+6}}
function renderStats(){const c=counts();$("totalStat").textContent=c.total;$("pendingStat").textContent=c.pending;$("resolvedStat").textContent=c.resolved;$("highStat").textContent=c.high;$("donutTotal").textContent=c.total;$("navCount").textContent=c.total;$("highBarLabel").textContent=c.high}
function renderLegend(){const cats=["Pothole","Garbage","Water leakage","Streetlight","Other"];const vals=[14,11,8,7,8];$("legend").innerHTML=cats.map((cat,i)=>`<div class="legend-row"><i class="dot" style="background:${categoryColors[cat]}"></i><span>${cat}</span><span class="amount">${vals[i]} <span style="color:#9aa6b8">(${Math.round(vals[i]/48*100)}%)</span></span></div>`).join("")}
function renderRecent(){const list=complaints.slice(0,5);$("recentList").innerHTML=list.map(c=>`<div class="complaint-item"><span class="issue-icon ${categoryClass(c.category)}">${categoryIcons[c.category]||"•"}</span><div class="issue-detail"><b>${esc(c.title)}</b><small>⌖ ${esc(c.location)}</small><small>◷ ${esc(c.time)}</small></div><span class="priority ${c.priority}">${c.priority}</span></div>`).join("")}
function categoryClass(cat){return cat==="Water leakage"?"water":cat==="Streetlight"?"streetlight":cat==="Garbage"?"garbage":"pothole"}
function renderTable(){const status=$("statusFilter").value,category=$("categoryFilter").value,query=$("globalSearch").value.toLowerCase().trim();const rows=complaints.filter(c=>(status==="All"||c.status===status)&&(category==="All"||c.category===category)&&(!query||[c.id,c.title,c.location,c.category,c.status].some(v=>v.toLowerCase().includes(query))));$("complaintTable").innerHTML=rows.length?rows.map(c=>`<tr><td><b>${esc(c.title)}</b><br><small style="color:#96a1b1">${c.id}</small>${duplicateHintHtml(c)}</td><td>${esc(c.location)}</td><td><span class="table-category"><i class="dot" style="background:${categoryColors[c.category]||"#888"}"></i>${esc(c.category)}</span></td><td><span class="priority ${c.priority}">${c.priority}</span></td><td><select class="status-select" data-status-id="${c.id}" aria-label="Update status for ${esc(c.title)}">${["Pending","In Progress","Resolved"].map(s=>`<option ${c.status===s?"selected":""}>${s}</option>`).join("")}</select></td><td><button class="action-link" data-detail-id="${c.id}">Analyze ↗</button></td></tr>`).join(""):`<tr><td colspan="6" class="empty-state">No complaints match these filters.</td></tr>`}
function categorySummary(cat,desc){const text=desc.toLowerCase();if(/pothole|road|crater|asphalt/.test(text))return "Pothole";if(/garbage|trash|waste|rubbish/.test(text))return "Garbage";if(/water|leak|pipe|flood/.test(text))return "Water leakage";if(/light|lamp|streetlight|bulb/.test(text))return "Streetlight";return cat||"Other"}
const DUP_STOPWORDS=new Set("a an the in on at of to for and or nor but near by from with is are was were be been being it its this that these those there here also very just so not no after".split(" "));
const DUP_GENERIC_PLACE=new Set(["road","street","block","area","campus","side","lane","place","location"]);
const DUP_WORD_SYNONYMS={hole:"pothole",holes:"pothole",crater:"pothole",pit:"pothole",pothole:"pothole",large:"big",huge:"big",big:"big",massive:"big",garbage:"garbage",waste:"garbage",trash:"garbage",rubbish:"garbage",leak:"leak",leaking:"leak",leakage:"leak",light:"light",lamp:"light",streetlight:"light",bulb:"light",lights:"light",lamps:"light",bulbs:"light",road:"road",street:"road",asphalt:"road",entrance:"gate",entry:"gate",damaged:"damage",damage:"damage",overflowing:"overflow",overflow:"overflow"};
function uniqueTokens(list){return [...new Set(list.filter(Boolean))]}
function foldText(s){return String(s||"").toLowerCase().replace(/[^a-z0-9\s]/g," ").replace(/\s+/g," ").trim()}
function applyPlaceAliases(s){
  return foldText(s)
    .replace(/\bmain\s+(gate|entrance|entry|door)\b/g,"main_gate")
    .replace(/\b(front|campus)\s+gate\b/g,"main_gate")
    .replace(/\bhostel\s*(block)?\s*b\b/g,"hostel_b")
    .replace(/\bscience\s+(block|building|faculty)\b/g,"science_block")
    .replace(/\bservice\s+(road|rd)\b/g,"service_road")
    .replace(/\bacademic\s+(road|rd)\b/g,"academic_road")
    .replace(/\bbus\s+(turn|stop|stand)\b/g,"bus_stop");
}
function prettyToken(t){return String(t||"").replace(/_/g," ")}
function placeTokens(c){
  const fromText=applyPlaceAliases([c.location,c.title,c.description].join(" ")).split(" ").filter(t=>t.includes("_")||t==="canteen");
  const fromLoc=applyPlaceAliases(c.location||"").split(" ").filter(t=>t&&!DUP_STOPWORDS.has(t)&&!DUP_GENERIC_PLACE.has(t));
  return uniqueTokens(fromText.concat(fromLoc));
}
function contentTokens(c){
  return uniqueTokens(applyPlaceAliases([c.title,c.description].join(" ")).split(" ").map(t=>DUP_WORD_SYNONYMS[t]||t).filter(t=>t&&t.length>2&&!DUP_STOPWORDS.has(t)));
}
function tokenOverlap(a,b){
  const shared=a.filter(t=>b.includes(t));
  const union=uniqueTokens(a.concat(b));
  return {shared,jaccard:union.length?shared.length/union.length:0};
}
function locationMatch(a,b){
  const overlap=tokenOverlap(placeTokens(a),placeTokens(b));
  const distinctive=overlap.shared.filter(t=>t.includes("_")||t==="canteen"||!DUP_GENERIC_PLACE.has(t));
  if(!distinctive.length)return {similar:false,reason:""};
  if(distinctive.some(t=>t.includes("_")||t==="canteen")||overlap.jaccard>=0.5){
    return {similar:true,reason:`similar location (${distinctive.map(prettyToken).join(", ")})`};
  }
  return {similar:false,reason:""};
}
function descriptionMatch(a,b){
  const overlap=tokenOverlap(contentTokens(a),contentTokens(b));
  const issue=new Set(["pothole","garbage","leak","light","damage","overflow","pipe","flood","water"]);
  const sharedIssue=overlap.shared.filter(t=>issue.has(t));
  if(overlap.shared.length>=2&&(overlap.jaccard>=0.18||sharedIssue.length>=1)){
    return {similar:true,reason:`similar description (${overlap.shared.slice(0,5).map(prettyToken).join(", ")})`};
  }
  return {similar:false,reason:""};
}
function findDuplicateMatches(c){
  return complaints.filter(other=>other.id!==c.id).reduce((matches,other)=>{
    if(other.category!==c.category)return matches;
    const loc=locationMatch(c,other);
    const desc=descriptionMatch(c,other);
    if(!loc.similar||!desc.similar)return matches;
    matches.push({id:other.id,reasons:[`same category (${c.category})`,loc.reason,desc.reason]});
    return matches;
  },[]);
}
function duplicateHintHtml(c){
  const matches=findDuplicateMatches(c);
  if(!matches.length)return "";
  const lines=matches.map(m=>`${m.id}: ${m.reasons.join("; ")}`).join(" · ");
  return `<small class="dup-hint">Possible duplicate of ${esc(lines)}. Both reports kept.</small>`;
}
/* Explainable priority scoring.
 * Labels: Critical 80–100, High 60–79, Medium 40–59, Low 0–39.
 * Each signal is applied at most once. Weights:
 *   user urgency High +62, Medium +42, Low +18
 *   safety risk +12
 *   flooding / water leakage +10
 *   dangerous location +8
 *   duration / delay +6
 *   recurring reports +5 (1 related) or +10 (2+); text-only recurrence +5 if none related
 */
function priorityLabel(score){
  if(score>=80)return "Critical";
  if(score>=60)return "High";
  if(score>=40)return "Medium";
  return "Low";
}
function relatedReports(c){
  return findDuplicateMatches(c);
}
function scoreComplaint(c){
  const reasons=[];
  let score=0;
  const title=(c.title||"").toLowerCase();
  const description=(c.description||"").toLowerCase();
  const location=(c.location||"").toLowerCase();
  const text=title+" "+description;
  const urgency=c.priority==="High"?62:c.priority==="Low"?18:42;
  const urgencyName=c.priority==="High"||c.priority==="Low"?c.priority:"Medium";
  score+=urgency;
  reasons.push(`Reporter marked urgency as ${urgencyName} (+${urgency})`);
  if(/accident|injur|danger|unsafe|hazard|traffic|two-wheeler|pedestrian/.test(text)){
    score+=12;
    reasons.push("Safety risk mentioned in the report (+12)");
  }
  if(c.category==="Water leakage"||/\b(flood|flooding|waterlog(?:ged|ging)?|leak(?:s|age|ing)?|burst pipe)\b/.test(text)){
    score+=10;
    reasons.push("Flooding or water-leakage risk (+10)");
  }
  if(/main gate|service road|academic road|hostel|bus (stop|turn|stand)|hospital|school/.test(location)){
    score+=8;
    reasons.push(`High-traffic or sensitive location: ${c.location} (+8)`);
  }
  const hoursAgo=Number((c.time||"").match(/(\d+)\s*hours?\s*ago/i)?.[1]||0);
  const delayed=hoursAgo>=6||/yesterday|days ago|week/i.test(c.time||"")||/\b(still|since|delayed|for days|for a week|not yet (fixed|repaired))\b/.test(text);
  if(delayed){
    score+=6;
    reasons.push("Issue appears delayed or ongoing (+6)");
  }
  const related=relatedReports(c).length;
  if(related>=2){
    score+=10;
    reasons.push(`${related} related reports at this location (+10)`);
  }else if(related===1){
    score+=5;
    reasons.push("1 related report at this location (+5)");
  }else if(/repeat|again|recurring|similar/.test(text)){
    score+=5;
    reasons.push("Description says this problem is recurring (+5)");
  }
  score=Math.max(0,Math.min(100,Math.round(score)));
  return {score,label:priorityLabel(score),reasons};
}
function analyze(c){
  const result=scoreComplaint(c);
  const action=c.category==="Pothole"?"Road maintenance team":c.category==="Garbage"?"Sanitation team":c.category==="Water leakage"?"Water works team":c.category==="Streetlight"?"Electrical maintenance team":"General civic team";
  const dups=findDuplicateMatches(c);
  const dupText=dups.length?` • Possible duplicates: ${dups.map(d=>`${d.id} — ${d.reasons.join(", ")}`).join(" | ")}`:"";
  showToast(`${c.id}: ${result.score}/100 ${result.label} • ${result.reasons.join("; ")} • Recommend ${action}${dupText}`);
}
function openModal(){$("modalBackdrop").classList.add("open");$("issueTitle").focus()}
function closeModal(){$("modalBackdrop").classList.remove("open")}
$("newComplaintBtn").addEventListener("click",openModal);$("closeModal").addEventListener("click",closeModal);$("cancelModal").addEventListener("click",closeModal);$("modalBackdrop").addEventListener("click",e=>{if(e.target===$("modalBackdrop"))closeModal()});
$("complaintForm").addEventListener("submit",e=>{e.preventDefault();const title=$("issueTitle").value.trim(),location=$("issueLocation").value.trim(),description=$("issueDescription").value.trim(),category=categorySummary($("issueCategory").value,title+" "+description),priority=$("issueUrgency").value;const item={id:"CS-"+(1049+complaints.length-seedComplaints.length),title,location,category,priority,status:"Pending",time:"Just now",description};const similar=findDuplicateMatches(item);complaints.unshift(item);closeModal();e.target.reset();renderAll();const scored=scoreComplaint(item);showToast(similar.length?`Report added. Possible duplicate of ${similar.map(s=>s.id).join(", ")} (${similar[0].reasons.join("; ")}). Score ${scored.score}/100 (${scored.label}). Both reports kept.`:`Complaint ${item.id} added and analyzed. Score ${scored.score}/100 (${scored.label}): ${scored.reasons.join("; ")}.`);});
$("statusFilter").addEventListener("change",renderTable);$("categoryFilter").addEventListener("change",renderTable);$("globalSearch").addEventListener("input",renderTable);
document.addEventListener("change",e=>{if(e.target.matches("[data-status-id]")){const item=complaints.find(c=>c.id===e.target.dataset.statusId);if(item){item.status=e.target.value;renderAll();showToast(`${item.id} status updated to ${item.status}.`)}}});
document.addEventListener("click",e=>{const detail=e.target.closest("[data-detail-id]");if(detail){const item=complaints.find(c=>c.id===detail.dataset.detailId);if(item)analyze(item)}const nav=e.target.closest("[data-page]");if(nav){const page=nav.dataset.page;document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===page));const titles={"Dashboard":["Good morning, Seetesh","Here’s what’s happening across your campus today."],"Complaints":["Complaint management","Review incoming reports and track progress."],"Map View":["Issue map","Explore the places where reports are clustering."],"Analytics":["Civic analytics","Understand issue trends and urgency at a glance."],"Resources":["Resource planning","Suggested teams and resources for recurring issues."],"Reports":["Reports & insights","A summary of current civic issue activity."]};$("pageTitle").textContent=titles[page]?.[0]||page;$("pageSubtitle").textContent=titles[page]?.[1]||"";if(page==="Complaints")$("allComplaints").scrollIntoView({behavior:"smooth",block:"start"});else if(page!=="Dashboard")showToast(`${page} preview selected — dashboard prototype data remains visible.`);if(window.innerWidth<=800)$("mobileMenu").nextElementSibling?.classList.remove("open");}});
$("mobileMenu").addEventListener("click",()=>$("mobileMenu").closest(".main").previousElementSibling.classList.toggle("open"));
$("notifyBtn").addEventListener("click",()=>showToast("You’re all caught up — no new admin alerts."));
$("aiReportBtn").addEventListener("click",()=>{const high=complaints.filter(c=>c.priority==="High"&&c.status!=="Resolved").length;const top=complaints.find(c=>c.priority==="High"&&c.status!=="Resolved");showToast(`Priority report: ${high} high-priority open issue(s). ${top?`First action: inspect ${top.location} and route to ${top.category} team.`:"No high-priority open issues."}`)});
function renderAll(){renderStats();renderRecent();renderTable();renderLegend()}
renderAll();
