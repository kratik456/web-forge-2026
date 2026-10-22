const seedComplaints = [
  {
    id: "CS-1048",
    title: "Pothole near Main Gate",
    location: "Main Gate",
    category: "Pothole",
    priority: "High",
    status: "Pending",
    time: "2 hours ago",
    description:
      "Large pothole collects water after rain and creates a safety concern for two-wheelers.",
  },
  {
    id: "CS-1047",
    title: "Garbage accumulation",
    location: "Hostel Block B",
    category: "Garbage",
    priority: "Medium",
    status: "In Progress",
    time: "3 hours ago",
    description: "Waste bins are overflowing near the hostel entrance.",
  },
  {
    id: "CS-1046",
    title: "Water leakage near Science Block",
    location: "Science Block",
    category: "Water leakage",
    priority: "Medium",
    status: "Pending",
    time: "5 hours ago",
    description: "Water leaking from a pipe beside the walkway.",
  },
  {
    id: "CS-1045",
    title: "Streetlight not working",
    location: "Academic Road",
    category: "Streetlight",
    priority: "Low",
    status: "Resolved",
    time: "6 hours ago",
    description: "Streetlight is not illuminating the footpath.",
  }, 
  {
    id: "CS-1044",
    title: "Pothole on service road",
    location: "Service Road",
    category: "Pothole",
    priority: "High",
    status: "Pending",
    time: "8 hours ago",
    description: "Road surface is damaged near the bus turn.",
  },
  {
    id: "CS-1043",
    title: "Waste near canteen",
    location: "Canteen",
    category: "Garbage",
    priority: "Medium",
    status: "Pending",
    time: "Yesterday",
    description: "Loose waste needs collection.",
  },
];
let complaints = [...seedComplaints];
const categoryColors = {
  Pothole: "#f15b55",
  Garbage: "#25b98c",
  "Water leakage": "#2d83ec",
  Streetlight: "#8061e8",
  Other: "#f6ad2f",
};
const categoryIcons = {
  Pothole: "⚠",
  Garbage: "♻",
  "Water leakage": "◉",
  Streetlight: "✦",
  Other: "•",
};
const $ = (id) => document.getElementById(id);
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3000);
}
function esc(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
function counts() {
  return {
    total: 48 + complaints.length - seedComplaints.length,
    pending: complaints.filter((c) => c.status !== "Resolved").length + 17,
    resolved: complaints.filter((c) => c.status === "Resolved").length + 20,
    high: complaints.filter((c) => c.priority === "High").length + 6,
  };
}
function renderStats() {
  const c = counts();
  $("totalStat").textContent = c.total;
  $("pendingStat").textContent = c.pending;
  $("resolvedStat").textContent = c.resolved;
  $("highStat").textContent = c.high;
  $("donutTotal").textContent = c.total;
  $("navCount").textContent = c.total;
  $("highBarLabel").textContent = c.high;
}
function renderLegend() {
  const cats = ["Pothole", "Garbage", "Water leakage", "Streetlight", "Other"];
  const vals = [14, 11, 8, 7, 8];
  $("legend").innerHTML = cats
    .map(
      (cat, i) =>
        `<div class="legend-row"><i class="dot" style="background:${categoryColors[cat]}"></i><span>${cat}</span><span class="amount">${vals[i]} <span style="color:#9aa6b8">(${Math.round((vals[i] / 48) * 100)}%)</span></span></div>`,
    )
    .join("");
}
function renderRecent() {
  const list = complaints.slice(0, 5);
  $("recentList").innerHTML = list
    .map(
      (c) =>
        `<div class="complaint-item"><span class="issue-icon ${categoryClass(c.category)}">${categoryIcons[c.category] || "•"}</span><div class="issue-detail"><b>${esc(c.title)}</b><small>⌖ ${esc(c.location)}</small><small>◷ ${esc(c.time)}</small></div><span class="priority ${c.priority}">${c.priority}</span></div>`,
    )
    .join("");
}
function categoryClass(cat) {
  return cat === "Water leakage"
    ? "water"
    : cat === "Streetlight"
      ? "streetlight"
      : cat === "Garbage"
        ? "garbage"
        : "pothole";
}
function renderTable() {
  const status = $("statusFilter").value,
    category = $("categoryFilter").value,
    query = $("globalSearch").value.toLowerCase().trim();
  const rows = complaints.filter(
    (c) =>
      (status === "All" || c.status === status) &&
      (category === "All" || c.category === category) &&
      (!query ||
        [c.id, c.title, c.location, c.category, c.status].some((v) =>
          v.toLowerCase().includes(query),
        )),
  );
  $("complaintTable").innerHTML = rows.length
    ? rows
        .map(
          (c) =>
            `<tr><td><b>${esc(c.title)}</b><br><small style="color:#96a1b1">${c.id}</small></td><td>${esc(c.location)}</td><td><span class="table-category"><i class="dot" style="background:${categoryColors[c.category] || "#888"}"></i>${esc(c.category)}</span></td><td><span class="priority ${c.priority}">${c.priority}</span></td><td><select class="status-select" data-status-id="${c.id}" aria-label="Update status for ${esc(c.title)}">${["Pending", "In Progress", "Resolved"].map((s) => `<option ${c.status === s ? "selected" : ""}>${s}</option>`).join("")}</select></td><td><button class="action-link" data-detail-id="${c.id}">Analyze ↗</button></td></tr>`,
        )
        .join("")
    : `<tr><td colspan="6" class="empty-state">No complaints match these filters.</td></tr>`;
}
function categorySummary(cat, desc) {
  const text = desc.toLowerCase();
  if (/pothole|road|crater|asphalt/.test(text)) return "Pothole";
  if (/garbage|trash|waste|rubbish/.test(text)) return "Garbage";
  if (/water|leak|pipe|flood/.test(text)) return "Water leakage";
  if (/light|lamp|streetlight|bulb/.test(text)) return "Streetlight";
  return cat || "Other";
}
function scoreComplaint(c) {
  let score = c.priority === "High" ? 82 : c.priority === "Medium" ? 58 : 32;
  const text = (c.title + " " + c.description).toLowerCase();
  if (/accident|danger|injury|traffic|school|hospital/.test(text)) score += 12;
  if (/leak|flood|overflow|main gate/.test(text)) score += 7;
  if (/repeat|again|recurring|similar/.test(text)) score += 5;
  return Math.min(score, 99);
}
function analyze(c) {
  const score = scoreComplaint(c);
  let action =
    c.category === "Pothole"
      ? "Road maintenance team"
      : c.category === "Garbage"
        ? "Sanitation team"
        : c.category === "Water leakage"
          ? "Water works team"
          : c.category === "Streetlight"
            ? "Electrical maintenance team"
            : "General civic team";
  let duplicate = complaints.filter(
    (other) =>
      other.id !== c.id &&
      other.category === c.category &&
      other.location.toLowerCase() === c.location.toLowerCase(),
  ).length;
  showToast(
    `${c.id}: priority ${score}/100 • Recommend ${action}${duplicate ? ` • ${duplicate} possible related report(s)` : ""}`,
  );
}
function openModal() {
  $("modalBackdrop").classList.add("open");
  $("issueTitle").focus();
}
function closeModal() {
  $("modalBackdrop").classList.remove("open");
}
$("newComplaintBtn").addEventListener("click", openModal);
$("closeModal").addEventListener("click", closeModal);
$("cancelModal").addEventListener("click", closeModal);
$("modalBackdrop").addEventListener("click", (e) => {
  if (e.target === $("modalBackdrop")) closeModal();
});
$("complaintForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = $("issueTitle").value.trim(),
    location = $("issueLocation").value.trim(),
    description = $("issueDescription").value.trim(),
    category = categorySummary(
      $("issueCategory").value,
      title + " " + description,
    ),
    priority = $("issueUrgency").value;
  const similar = complaints.find(
    (c) =>
      c.category === category &&
      c.location.toLowerCase() === location.toLowerCase(),
  );
  const item = {
    id: "CS-" + (1049 + complaints.length - seedComplaints.length),
    title,
    location,
    category,
    priority,
    status: "Pending",
    time: "Just now",
    description,
  };
  complaints.unshift(item);
  closeModal();
  e.target.reset();
  renderAll();
  showToast(
    similar
      ? `Report added. Possible duplicate of ${similar.id} at ${location}.`
      : `Complaint ${item.id} added and analyzed. Demo score: ${scoreComplaint(item)}/100.`,
  );
});
$("statusFilter").addEventListener("change", renderTable);
$("categoryFilter").addEventListener("change", renderTable);
$("globalSearch").addEventListener("input", renderTable);
document.addEventListener("change", (e) => {
  if (e.target.matches("[data-status-id]")) {
    const item = complaints.find((c) => c.id === e.target.dataset.statusId);
    if (item) {
      item.status = e.target.value;
      renderAll();
      showToast(`${item.id} status updated to ${item.status}.`);
    }
  }
});
document.addEventListener("click", (e) => {
  const detail = e.target.closest("[data-detail-id]");
  if (detail) {
    const item = complaints.find((c) => c.id === detail.dataset.detailId);
    if (item) analyze(item);
  }
  const nav = e.target.closest("[data-page]");
  if (nav) {
    const page = nav.dataset.page;
    document
      .querySelectorAll(".nav-link")
      .forEach((b) => b.classList.toggle("active", b.dataset.page === page));
    const titles = {
      Dashboard: [
        "Good morning, Seetesh",
        "Here’s what’s happening across your campus today.",
      ],
      Complaints: [
        "Complaint management",
        "Review incoming reports and track progress.",
      ],
      "Map View": [
        "Issue map",
        "Explore the places where reports are clustering.",
      ],
      Analytics: [
        "Civic analytics",
        "Understand issue trends and urgency at a glance.",
      ],
      Resources: [
        "Resource planning",
        "Suggested teams and resources for recurring issues.",
      ],
      Reports: [
        "Reports & insights",
        "A summary of current civic issue activity.",
      ],

        "Track Complaint": [
        "Track Complaint",
        "Enter your complaint ID to check its status.",
      ],
    };
    $("pageTitle").textContent = titles[page]?.[0] || page;
    $("pageSubtitle").textContent = titles[page]?.[1] || "";


 if (page === "Complaints") {
  $("allComplaints").scrollIntoView({ behavior: "smooth", block: "start" });
} else if (page === "Track Complaint") {
  $("track-complaint").scrollIntoView({ behavior: "smooth", block: "start" });
} else if (page !== "Dashboard") {
  showToast(`${page} preview selected — dashboard prototype data remains visible.`);
}


    if (window.innerWidth <= 800)
      $("mobileMenu").nextElementSibling?.classList.remove("open");
  }
});
$("mobileMenu").addEventListener("click", () =>
  $("mobileMenu")
    .closest(".main")
    .previousElementSibling.classList.toggle("open"),
);
$("notifyBtn").addEventListener("click", () =>
  showToast("You’re all caught up — no new admin alerts."),
);
$("aiReportBtn").addEventListener("click", () => {
  const high = complaints.filter(
    (c) => c.priority === "High" && c.status !== "Resolved",
  ).length;
  const top = complaints.find(
    (c) => c.priority === "High" && c.status !== "Resolved",
  );
  showToast(
    `Priority report: ${high} high-priority open issue(s). ${top ? `First action: inspect ${top.location} and route to ${top.category} team.` : "No high-priority open issues."}`,
  );
});
function renderAll() {
  renderStats();
  renderRecent();
  renderTable();
  renderLegend();
}
renderAll();

const trackForm = document.getElementById("trackForm");

if (trackForm) {
  trackForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const input = document.getElementById("complaintIdInput");
    const result = document.getElementById("trackResult");
    const complaintId = input.value.trim();

    result.replaceChildren();

    if (!complaintId) {
      result.textContent = "Please enter a complaint ID.";
      result.className = "track-error";
      return;
    }

    // Existing demo complaints ko localStorage se read karo.
    const complaintList = window.complaints || [];

    // ID ke format/capitalization ko safely compare karo.
    const complaint = complaintList.find((item) =>  {
      const id = item.id ?? item.complaintId;
      return String(id ?? "").toLowerCase() === complaintId.toLowerCase();
    });

    if (!complaint) {
      result.className = "track-error";
      result.textContent =
        "Complaint not found. Please check the ID and try again.";
      return;
    }

    result.className = "";

    const card = document.createElement("div");
    card.className = "track-result-card";

    const fields = [
      ["Complaint ID", complaint.id ?? complaint.complaintId],
      ["Title", complaint.title],
      ["Category", complaint.category],
      ["Location", complaint.location],
      ["Status", complaint.status ?? "Submitted"],
    ];

    fields.forEach(([label, value]) => {
      const p = document.createElement("p");
      const strong = document.createElement("strong");
      strong.textContent = label + ": ";
      p.append(
        strong,
        document.createTextNode(String(value ?? "Not provided")),
      );
      if (label === "Status") {
        p.classList.add("track-status");
      }
      card.appendChild(p);
    });

    result.appendChild(card);
  });
}
