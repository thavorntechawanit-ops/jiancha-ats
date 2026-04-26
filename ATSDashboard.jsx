import { useState, useEffect, useCallback } from "react";

const NOTION_MCP_URL = "https://mcp.notion.com/mcp";

// ── Jian Cha Design Tokens ─────────────────────────────────────
const JC = {
  green:       "#1B4332",
  greenMid:    "#2D6A4F",
  greenLight:  "#40916C",
  greenSoft:   "#52B788",
  greenPale:   "#D8F3DC",
  greenFaint:  "#F0FAF2",
  gold:        "#B7882C",
  goldMid:     "#D4A843",
  goldLight:   "#F0D080",
  goldPale:    "#FEF9EC",
  bg:          "#F4F7F5",
  bgCard:      "#FFFFFF",
  text:        "#1A2E22",
  textMid:     "#3D5C47",
  textLight:   "#7A9E87",
  border:      "#DDE8E1",
  borderMid:   "#C5D9CC",
  red:         "#B83232",
  redLight:    "#E05252",
  redPale:     "#FDF0F0",
  shadow:      "0 1px 4px rgba(27,67,50,0.07), 0 4px 16px rgba(27,67,50,0.06)",
  shadowHover: "0 4px 16px rgba(27,67,50,0.14), 0 8px 32px rgba(27,67,50,0.08)",
};

const DEPT_COLORS = {
  "SCM":        { bg:"#EBF5FB", color:"#1A5276", border:"#AED6F1" },
  "Marketing":  { bg:"#F5EEF8", color:"#6C3483", border:"#C39BD3" },
  "BD":         { bg:"#FEF9E7", color:"#7D6608", border:"#F9E79F" },
  "Finance":    { bg:"#EBF5FB", color:"#154360", border:"#85C1E9" },
  "CEO Office": { bg:"#FDF2F8", color:"#76448A", border:"#D7BDE2" },
  "Legal":      { bg:"#F2F3F4", color:"#1B2631", border:"#BFC9CA" },
  "Operations": { bg:"#EAFAF1", color:"#1E8449", border:"#A9DFBF" },
  "L&D":        { bg:"#FEF5E7", color:"#784212", border:"#FAD7A0" },
  "Jai Chan":   { bg:"#FFF0F0", color:"#922B21", border:"#F1948A" },
  "IT":         { bg:"#EAF2FF", color:"#1A5276", border:"#85C1E9" },
};

const JOB_DATABASES = [
  { id:"32587c05-38c8-81c3-890d-000bdf907c1d", name:"Head of SCM",             dept:"SCM",        status:"active" },
  { id:"30987c05-38c8-81af-b792-000b3c593386", name:"Marketing Manager",        dept:"Marketing",  status:"active" },
  { id:"29287c05-38c8-83a2-a80a-87ab3ad920a0", name:"Site Acquisition Manager", dept:"BD",         status:"active" },
  { id:"30c87c05-38c8-8197-ba3b-000b9d908740", name:"Accounting Manager",       dept:"Finance",    status:"active" },
  { id:"32487c05-38c8-81c2-8723-000be845cad2", name:"Personal Assistant",       dept:"CEO Office", status:"active" },
  { id:"30987c05-38c8-81a7-8eca-000b1b112608", name:"Lawyer",                   dept:"Legal",      status:"active" },
  { id:"30987c05-38c8-81e9-bbc0-000b068d4f9a", name:"Graphic Designer",         dept:"Marketing",  status:"active" },
  { id:"31a87c05-38c8-81cb-b695-000b75abfdb8", name:"QSC Officer",              dept:"Operations", status:"active" },
  { id:"30987c05-38c8-81b7-ac9c-000b392edee5", name:"Training Support",         dept:"L&D",        status:"active" },
  { id:"30687c05-38c8-8106-a23a-000b3ce85f33", name:"Receptionist",             dept:"Jai Chan",   status:"active" },
  { id:"33a87c05-38c8-81d5-823a-000b7b6ff6aa", name:"Accounting Officer",       dept:"Finance",    status:"active" },
  { id:"34b87c05-38c8-81ae-8f12-000be695d95c", name:"BD Location",              dept:"BD",         status:"active" },
  { id:"34b87c05-38c8-81de-8edc-000be35510ef", name:"BD Admin",                 dept:"BD",         status:"active" },
  { id:"18c87c05-38c8-82bc-bc20-870285760936", name:"Warehouse Admin",          dept:"SCM",        status:"hired"  },
  { id:"30a87c05-38c8-8189-90d8-000bd631c50e", name:"Operation Manager",        dept:"Operations", status:"hired"  },
  { id:"30987c05-38c8-81c3-83bb-000bdb22f9ad", name:"Content Creator",          dept:"Marketing",  status:"hired"  },
  { id:"32487c05-38c8-8156-915e-000b5411c7a5", name:"LSM Officer",              dept:"Marketing",  status:"hired"  },
  { id:"30c87c05-38c8-81a0-8289-000b0527cb00", name:"Head of BD",               dept:"BD",         status:"hired"  },
  { id:"30987c05-38c8-8141-abb8-000b4aacabdc", name:"CFO",                      dept:"Finance",    status:"hired"  },
  { id:"30987c05-38c8-811f-8d4e-000b4524305b", name:"QSC Manager",              dept:"Operations", status:"hired"  },
  { id:"30987c05-38c8-815f-90f7-000b399d7ea4", name:"Marketing Executive",      dept:"Marketing",  status:"hired"  },
  { id:"30687c05-38c8-814e-a734-000bc2b10787", name:"Site Project Manager",     dept:"BD",         status:"hired"  },
  { id:"30c87c05-38c8-8116-a86b-000b6652259f", name:"Franchise Manager",        dept:"BD",         status:"hired"  },
  { id:"30987c05-38c8-8158-aa44-000baadb8246", name:"IT Support",               dept:"IT",         status:"hired"  },
];

const PIPELINE_STAGES       = ["Applied/Sourced","Pree-Screen","Hiring Manager Review","Online Interview","Onsite Interview","Passed","Offered","Hired"];
const PIPELINE_STAGES_SHORT = ["Applied","Pre-Screen","HM Review","Online Int.","Onsite Int.","Passed","Offered","Hired"];
const STAGE_COLORS          = ["#94A3B8","#60A5FA","#A78BFA","#34D399","#22D3EE","#4ADE80","#FBBF24","#34D399"];

// ── Claude/Notion helpers ──────────────────────────────────────
async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: "You are a data extraction assistant. Respond ONLY with valid JSON. No markdown fences, no preamble.",
      messages: [{ role:"user", content: prompt }],
      mcp_servers: [{ type:"url", url: NOTION_MCP_URL, name:"notion" }],
    }),
  });
  return res.json();
}
function extractText(data) {
  return (data?.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
}
function parseJSON(text) {
  try { return JSON.parse(text.replace(/```json|```/g,"").trim()); }
  catch { return null; }
}

// ── Micro-components ───────────────────────────────────────────
function Spinner({ size=20, color=JC.greenLight }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", flexShrink:0,
      border:`${Math.max(2,size/8)}px solid ${color}25`,
      borderTopColor:color, animation:"spin .75s linear infinite" }} />
  );
}

function DeptTag({ dept }) {
  const s = DEPT_COLORS[dept] || { bg:JC.greenFaint, color:JC.greenMid, border:JC.greenPale };
  return (
    <span style={{ background:s.bg, color:s.color, border:`1px solid ${s.border}`,
      borderRadius:6, padding:"2px 9px", fontSize:11, fontWeight:700, letterSpacing:"0.02em",
      whiteSpace:"nowrap" }}>
      {dept}
    </span>
  );
}

function StatusPill({ status }) {
  const MAP = {
    "Applied/Sourced":       { bg:"#EEF2FF", color:"#3730A3", bd:"#C7D2FE" },
    "Pree-Screen":           { bg:"#F0F9FF", color:"#0369A1", bd:"#BAE6FD" },
    "Hiring Manager Review": { bg:"#FFF7ED", color:"#C2410C", bd:"#FED7AA" },
    "Online Interview":      { bg:"#F0FDF4", color:"#15803D", bd:"#BBF7D0" },
    "Onsite Interview":      { bg:"#ECFDF5", color:"#065F46", bd:"#A7F3D0" },
    "Passed":                { bg:JC.greenFaint, color:JC.green, bd:JC.greenPale },
    "Offered":               { bg:"#FFFBEB", color:"#92400E", bd:"#FDE68A" },
    "Hired":                 { bg:JC.greenPale, color:JC.green, bd:JC.greenSoft },
    "Not Passed":            { bg:JC.redPale, color:JC.red, bd:"#FCA5A5" },
  };
  const s = MAP[status] || { bg:"#F3F4F6", color:"#6B7280", bd:"#D1D5DB" };
  const label = { "Applied/Sourced":"Applied","Pree-Screen":"Pre-Screen","Hiring Manager Review":"HM Review" }[status] || status;
  return (
    <span style={{ background:s.bg, color:s.color, border:`1px solid ${s.bd}`,
      borderRadius:20, padding:"3px 11px", fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
      {label}
    </span>
  );
}

function KpiCard({ icon, label, value, sub, accent=JC.greenLight, loading }) {
  return (
    <div style={{ background:JC.bgCard, border:`1px solid ${JC.border}`, borderRadius:14,
      padding:"18px 20px", boxShadow:JC.shadow, borderTop:`3px solid ${accent}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <span style={{ fontSize:17 }}>{icon}</span>
        <span style={{ fontSize:10, color:JC.textLight, letterSpacing:"0.08em",
          textTransform:"uppercase", fontWeight:700 }}>{label}</span>
      </div>
      {loading
        ? <Spinner size={22} color={accent} />
        : <>
            <div style={{ fontSize:28, fontWeight:800, color:JC.text, lineHeight:1,
              fontFamily:"'Merriweather',Georgia,serif" }}>{value ?? "—"}</div>
            {sub && <div style={{ fontSize:11, color:JC.textLight, marginTop:5 }}>{sub}</div>}
          </>
      }
    </div>
  );
}

function FunnelBar({ counts }) {
  const max = Math.max(...Object.values(counts), 1);
  return (
    <div style={{ display:"flex", gap:6, alignItems:"flex-end", height:100 }}>
      {PIPELINE_STAGES.map((stage, i) => {
        const count = counts[stage] || 0;
        const h = Math.max(4, (count / max) * 88);
        return (
          <div key={stage} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <span style={{ fontSize:12, fontWeight:700, color:JC.text, minHeight:18 }}>{count || ""}</span>
            <div title={stage} style={{ width:"100%", height:h, borderRadius:"5px 5px 0 0",
              background: STAGE_COLORS[i], opacity:count ? 1 : 0.15, transition:"height .5s ease" }} />
            <span style={{ fontSize:9, color:JC.textLight, textAlign:"center", lineHeight:1.3 }}>
              {PIPELINE_STAGES_SHORT[i]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── JobCard — JobsDB-inspired ──────────────────────────────────
function JobCard({ db, onClick, isSelected }) {
  const [hov, setHov] = useState(false);
  const active = db.status === "active";
  const deptStyle = DEPT_COLORS[db.dept] || { bg:JC.greenFaint, color:JC.greenMid, border:JC.border };

  return (
    <div
      onClick={() => onClick(db)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: isSelected ? (active ? "#FFF5F5" : JC.greenFaint) : JC.bgCard,
        border: `1.5px solid ${isSelected ? (active ? "#F87171" : JC.greenSoft) : hov ? JC.borderMid : JC.border}`,
        borderRadius: 12,
        padding: "16px",
        cursor: "pointer",
        transition: "all 0.18s",
        boxShadow: hov || isSelected ? JC.shadowHover : JC.shadow,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        position: "relative",
        overflow: "hidden",
      }}>

      {/* Accent stripe top */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
        background: active
          ? `linear-gradient(90deg, ${JC.redLight}, transparent)`
          : `linear-gradient(90deg, ${JC.greenSoft}, transparent)`,
      }} />

      {/* Row 1: Title + status badge */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
        <div style={{ fontSize:14, fontWeight:700, color:JC.text, lineHeight:1.35, flex:1 }}>
          {db.name}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:5, flexShrink:0,
          background: active ? JC.redPale : JC.greenFaint,
          border: `1px solid ${active ? "#FCA5A5" : JC.greenPale}`,
          borderRadius:20, padding:"2px 9px" }}>
          <div style={{ width:6, height:6, borderRadius:"50%",
            background: active ? JC.redLight : JC.greenSoft,
            boxShadow:`0 0 4px ${active ? JC.redLight : JC.greenSoft}` }} />
          <span style={{ fontSize:10, color: active ? JC.red : JC.greenLight, fontWeight:700 }}>
            {active ? "Open" : "Filled"}
          </span>
        </div>
      </div>

      {/* Row 2: Dept + company */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <DeptTag dept={db.dept} />
        <div style={{ display:"flex", alignItems:"center", gap:5 }}>
          <span style={{ fontSize:10 }}>🍵</span>
          <span style={{ fontSize:10, color:JC.textLight, fontWeight:500 }}>Jian Cha Group</span>
        </div>
      </div>
    </div>
  );
}

// ── Candidate row ──────────────────────────────────────────────
function CandidateRow({ c }) {
  const init = (c.name || "?").charAt(0).toUpperCase();
  const hue  = ((c.name || "A").charCodeAt(0) * 17) % 360;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px",
      background:JC.bgCard, border:`1px solid ${JC.border}`, borderRadius:10,
      marginBottom:6, boxShadow:JC.shadow, transition:"box-shadow .15s" }}>
      <div style={{ width:38, height:38, borderRadius:"50%", flexShrink:0,
        background:`hsl(${hue},42%,82%)`, display:"flex", alignItems:"center",
        justifyContent:"center", fontSize:15, fontWeight:800, color:`hsl(${hue},52%,28%)` }}>
        {init}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontWeight:700, color:JC.text, fontSize:14 }}>{c.name || "—"}</div>
        <div style={{ fontSize:11, color:JC.textLight, marginTop:3, display:"flex",
          gap:12, flexWrap:"wrap" }}>
          {c.phone        && <span>📞 {c.phone}</span>}
          {c.interviewDate && <span>📅 {c.interviewDate}</span>}
          {c.source       && <span>🔗 {c.source}</span>}
          {c.applicationDate && <span>🗓 Applied: {c.applicationDate}</span>}
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5, flexShrink:0 }}>
        <StatusPill status={c.status} />
        {c.expectedSalary > 0 && (
          <span style={{ fontSize:12, color:JC.gold, fontWeight:700 }}>
            ฿{c.expectedSalary.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Section heading ────────────────────────────────────────────
function SectionHeading({ dot, dotColor, title, count }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
      <div style={{ width:10, height:10, borderRadius:"50%", background:dotColor,
        boxShadow:`0 0 8px ${dotColor}`, flexShrink:0 }} />
      <div style={{ fontSize:15, fontWeight:700, color:JC.text }}>
        {title}
        {count !== undefined && (
          <span style={{ marginLeft:8, fontSize:13, color:JC.textLight, fontWeight:500 }}>
            ({count} ตำแหน่ง)
          </span>
        )}
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────
export default function ATSDashboard() {
  const [tab,         setTab]         = useState("overview");
  const [loading,     setLoading]     = useState({ overview:false, calendar:false, tasks:false });
  const [loaded,      setLoaded]      = useState({ overview:false, calendar:false, tasks:false });
  const [stats,       setStats]       = useState(null);
  const [pipeline,    setPipeline]    = useState({});
  const [calEvents,   setCalEvents]   = useState([]);
  const [tasks,       setTasks]       = useState([]);
  const [selPos,      setSelPos]      = useState(null);
  const [candidates,  setCandidates]  = useState([]);
  const [loadingCand, setLoadingCand] = useState(false);
  const [calDate,     setCalDate]     = useState(new Date(2026, 3, 1));
  const [plFilter,    setPlFilter]    = useState("all");

  const setLoad  = (k,v) => setLoading(p => ({...p,[k]:v}));
  const setLoad_ = k     => setLoaded(p  => ({...p,[k]:true}));

  const fetchOverview = useCallback(async () => {
    if (loaded.overview) return;
    setLoad("overview", true);
    try {
      const data = await callClaude(`Use Notion MCP. Search these candidate databases:
${JOB_DATABASES.filter(d=>d.status==="active").slice(0,8).map(d=>`collection://${d.id} (${d.name})`).join("\n")}
Also fetch Tasks Tracker: collection://34587c05-38c8-80bd-b75c-000b0ea92032
Return JSON: {"totalApplicants":0,"interviewsScheduled":0,"offersMade":0,"hiredCount":0,"avgTimeToHire":"N/A","offerAcceptanceRate":"N/A","topSource":"N/A","pipelineByPosition":{},"tasksSummary":[]}`);
      const json = parseJSON(extractText(data));
      if (json) {
        setStats(json);
        if (json.pipelineByPosition) setPipeline(json.pipelineByPosition);
        if (json.tasksSummary)       setTasks(json.tasksSummary);
      } else setStats({});
    } catch { setStats({}); }
    setLoad("overview",false); setLoad_("overview");
  }, [loaded.overview]);

  const fetchCalendar = useCallback(async () => {
    if (loaded.calendar) return;
    setLoad("calendar", true);
    try {
      const data = await callClaude(`Use Notion MCP. Find candidates with Interview Date or Joined Date in:
${JOB_DATABASES.filter(d=>d.status==="active").slice(0,10).map(d=>`collection://${d.id}`).join(", ")}
Return JSON array: [{"candidateName":"","position":"","eventType":"Interview","date":"YYYY-MM-DD","status":""}]
Events Mar–Jun 2026 only. Max 30.`);
      const json = parseJSON(extractText(data));
      setCalEvents(Array.isArray(json) ? json : []);
    } catch { setCalEvents([]); }
    setLoad("calendar",false); setLoad_("calendar");
  }, [loaded.calendar]);

  const fetchTasks = useCallback(async () => {
    if (loaded.tasks) return;
    setLoad("tasks", true);
    try {
      const data = await callClaude(`Use Notion MCP. Get all entries from Tasks Tracker collection://34587c05-38c8-80bd-b75c-000b0ea92032.
Return JSON: [{"candidateName":"","position":"","department":"","status":"","startDate":"","hiringType":""}]`);
      const json = parseJSON(extractText(data));
      setTasks(Array.isArray(json) ? json : []);
    } catch { setTasks([]); }
    setLoad("tasks",false); setLoad_("tasks");
  }, [loaded.tasks]);

  const fetchCandidates = useCallback(async (db) => {
    setSelPos(db); setCandidates([]); setLoadingCand(true);
    try {
      const data = await callClaude(`Use Notion MCP. Get ALL candidates from collection://${db.id}.
Return JSON: [{"name":"","status":"","applicationDate":"","interviewDate":"","joinedDate":"","phone":"","email":"","source":"","expectedSalary":0}]
Max 50.`);
      const json = parseJSON(extractText(data));
      setCandidates(Array.isArray(json) ? json : []);
    } catch { setCandidates([]); }
    setLoadingCand(false);
  }, []);

  useEffect(() => {
    if (tab==="overview" && !loaded.overview) fetchOverview();
    if (tab==="calendar" && !loaded.calendar) fetchCalendar();
    if (tab==="tasks"    && !loaded.tasks)    fetchTasks();
  }, [tab]);

  // derived
  const totalFunnel = {};
  PIPELINE_STAGES.forEach(st => {
    totalFunnel[st] = Object.values(pipeline).reduce((a,p) => a+(p[st]||0), 0);
  });
  const displayJobs = plFilter==="active"
    ? JOB_DATABASES.filter(d=>d.status==="active")
    : plFilter==="hired"
    ? JOB_DATABASES.filter(d=>d.status==="hired")
    : JOB_DATABASES;

  // Calendar grid
  function CalGrid() {
    const y=calDate.getFullYear(), m=calDate.getMonth();
    const firstDay=new Date(y,m,1).getDay();
    const days=new Date(y,m+1,0).getDate();
    const label=calDate.toLocaleDateString("th-TH",{month:"long",year:"numeric"});
    const byDay={};
    calEvents.filter(e=>{ const d=new Date(e.date); return d.getFullYear()===y&&d.getMonth()===m; })
      .forEach(e=>{ const d=new Date(e.date).getDate(); (byDay[d]=byDay[d]||[]).push(e); });
    const cells=[...Array(firstDay).fill(null),...Array.from({length:days},(_,i)=>i+1)];
    const isToday=(d)=>y===2026&&m===3&&d===25;
    return (
      <div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
          <button onClick={()=>setCalDate(new Date(y,m-1,1))} style={navBtnStyle}>‹</button>
          <span style={{ fontWeight:700, fontSize:16, color:JC.text }}>{label}</span>
          <button onClick={()=>setCalDate(new Date(y,m+1,1))} style={navBtnStyle}>›</button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:1, marginBottom:6 }}>
          {["อา","จ","อ","พ","พฤ","ศ","ส"].map(d=>(
            <div key={d} style={{ textAlign:"center", fontSize:11, color:JC.textLight,
              padding:"5px 0", fontWeight:700 }}>{d}</div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
          {cells.map((day,i)=>{
            const evts=day?(byDay[day]||[]):[];
            return (
              <div key={i} style={{
                minHeight:64, borderRadius:8, padding:5,
                background: isToday(day) ? JC.goldPale : day ? JC.bgCard : "transparent",
                border:`1px solid ${isToday(day) ? JC.goldMid : day ? JC.border : "transparent"}`,
              }}>
                {day&&<div style={{ fontSize:12, fontWeight:isToday(day)?800:500,
                  color:isToday(day)?JC.gold:JC.textMid, marginBottom:3 }}>{day}</div>}
                {evts.slice(0,2).map((e,j)=>(
                  <div key={j} style={{ fontSize:9, borderRadius:4, padding:"2px 5px", marginBottom:2,
                    background:e.eventType==="Interview"?"#DBEAFE":JC.greenPale,
                    color:e.eventType==="Interview"?"#1D4ED8":JC.green,
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {e.candidateName}
                  </div>
                ))}
                {evts.length>2&&<div style={{ fontSize:9, color:JC.textLight }}>+{evts.length-2}</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const navBtnStyle = {
    background:JC.bgCard, border:`1px solid ${JC.border}`, color:JC.textMid,
    borderRadius:8, padding:"5px 16px", cursor:"pointer", fontSize:16,
    fontWeight:700, boxShadow:JC.shadow,
  };

  const card = {
    background:JC.bgCard, border:`1px solid ${JC.border}`,
    borderRadius:16, padding:24, boxShadow:JC.shadow,
  };

  const TABS = [
    { id:"overview", label:"Overview",      icon:"🏠" },
    { id:"pipeline", label:"Pipeline",      icon:"🔄" },
    { id:"calendar", label:"Calendar",      icon:"📅" },
    { id:"tasks",    label:"Tasks Tracker", icon:"📋" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:JC.bg,
      fontFamily:"'Inter','Sarabun',sans-serif", color:JC.text }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@700;900&family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0;transform:translateY(10px); } to { opacity:1;transform:translateY(0); } }
        * { box-sizing:border-box; }
        button:focus { outline:none; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-thumb { background:${JC.borderMid}; border-radius:4px; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ background:JC.green, position:"sticky", top:0, zIndex:100,
        boxShadow:"0 2px 16px rgba(0,0,0,0.22)" }}>
        <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 24px" }}>
          {/* Brand bar */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"14px 0 10px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:13 }}>
              {/* Logo mark */}
              <div style={{ width:42, height:42, borderRadius:12,
                background:`linear-gradient(135deg, ${JC.goldPale}, ${JC.goldLight})`,
                display:"flex", alignItems:"center", justifyContent:"center",
                border:`2px solid ${JC.goldMid}`, fontSize:22, boxShadow:"0 2px 8px rgba(0,0,0,0.15)" }}>
                🍵
              </div>
              <div>
                <div style={{ fontSize:19, fontWeight:900, color:"#fff", letterSpacing:"-0.01em",
                  fontFamily:"'Merriweather',Georgia,serif", lineHeight:1.1 }}>
                  Jian Cha ATS
                </div>
                <div style={{ fontSize:9, color:"rgba(255,255,255,0.55)", letterSpacing:"0.12em",
                  fontWeight:700, marginTop:2 }}>
                  RECRUITMENT DASHBOARD
                </div>
              </div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:7,
              background:"rgba(255,255,255,0.1)", borderRadius:20, padding:"5px 13px",
              border:"1px solid rgba(255,255,255,0.15)" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#4ADE80",
                boxShadow:"0 0 6px #4ADE80" }} />
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.85)", fontWeight:600 }}>
                Live · Notion
              </span>
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display:"flex", gap:2 }}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{
                background: tab===t.id ? "rgba(255,255,255,0.13)" : "transparent",
                border:"none",
                borderBottom: tab===t.id ? `2px solid ${JC.goldLight}` : "2px solid transparent",
                color: tab===t.id ? "#fff" : "rgba(255,255,255,0.5)",
                padding:"10px 18px", cursor:"pointer", fontSize:13, fontWeight:600,
                display:"flex", alignItems:"center", gap:6, transition:"all .15s",
                borderRadius:"6px 6px 0 0",
              }}>
                {t.icon} {t.label}
                {loading[t.id]&&<Spinner size={12} color="#fff" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Page content ── */}
      <div style={{ maxWidth:1160, margin:"0 auto", padding:"28px 24px",
        animation:"fadeUp .3s ease" }}>

        {/* ═══════════ OVERVIEW ═══════════ */}
        {tab==="overview" && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

            {/* KPIs */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))", gap:12 }}>
              <KpiCard icon="🔴" label="Open Positions"    value={JOB_DATABASES.filter(d=>d.status==="active").length} accent={JC.redLight} />
              <KpiCard icon="✅" label="Positions Filled"  value={JOB_DATABASES.filter(d=>d.status==="hired").length}  accent={JC.greenSoft} />
              <KpiCard icon="👥" label="Total Applicants"  value={stats?.totalApplicants}     loading={loading.overview} accent="#60A5FA" />
              <KpiCard icon="📅" label="Interviews"        value={stats?.interviewsScheduled} loading={loading.overview} accent="#A78BFA" />
              <KpiCard icon="💼" label="Offers Made"       value={stats?.offersMade}          loading={loading.overview} accent={JC.goldMid} />
              <KpiCard icon="⏱"  label="Avg. Time to Hire" value={stats?.avgTimeToHire}       loading={loading.overview} accent={JC.greenLight} sub="days" />
              <KpiCard icon="🤝" label="Offer Acceptance"  value={stats?.offerAcceptanceRate} loading={loading.overview} accent={JC.greenSoft} />
              <KpiCard icon="🏆" label="Top Source"        value={stats?.topSource}           loading={loading.overview} accent={JC.goldMid} />
            </div>

            {/* Funnel */}
            <div style={{ ...card }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:JC.text }}>Overall Recruitment Funnel</div>
                  <div style={{ fontSize:12, color:JC.textLight, marginTop:2 }}>All active positions combined</div>
                </div>
                {loading.overview && <Spinner color={JC.greenLight} />}
              </div>
              <FunnelBar counts={totalFunnel} />
            </div>

            {/* Open positions */}
            <div style={{ ...card }}>
              <SectionHeading dotColor={JC.redLight} title="Currently Hiring"
                count={JOB_DATABASES.filter(d=>d.status==="active").length} />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:10 }}>
                {JOB_DATABASES.filter(d=>d.status==="active").map(db=>(
                  <JobCard key={db.id} db={db}
                    isSelected={selPos?.id===db.id}
                    onClick={db=>{ setTab("pipeline"); fetchCandidates(db); }} />
                ))}
              </div>
            </div>

            {/* Filled positions */}
            <div style={{ ...card }}>
              <SectionHeading dotColor={JC.greenSoft} title="Positions Filled"
                count={JOB_DATABASES.filter(d=>d.status==="hired").length} />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:10 }}>
                {JOB_DATABASES.filter(d=>d.status==="hired").map(db=>(
                  <JobCard key={db.id} db={db}
                    isSelected={selPos?.id===db.id}
                    onClick={db=>{ setTab("pipeline"); fetchCandidates(db); }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ PIPELINE ═══════════ */}
        {tab==="pipeline" && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>

            {/* Position selector */}
            <div style={{ ...card }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                <div style={{ fontSize:15, fontWeight:700, color:JC.text }}>เลือกตำแหน่ง</div>
                <div style={{ display:"flex", gap:6 }}>
                  {[["all","ทั้งหมด"],["active","กำลังรับ"],["hired","ได้คนแล้ว"]].map(([v,l])=>(
                    <button key={v} onClick={()=>setPlFilter(v)} style={{
                      background: plFilter===v ? JC.green : JC.bg,
                      border:`1px solid ${plFilter===v ? JC.green : JC.border}`,
                      color: plFilter===v ? "#fff" : JC.textMid,
                      borderRadius:20, padding:"4px 14px", cursor:"pointer",
                      fontSize:12, fontWeight:600, transition:"all .15s",
                    }}>{l}</button>
                  ))}
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:8 }}>
                {displayJobs.map(db=>(
                  <JobCard key={db.id} db={db}
                    isSelected={selPos?.id===db.id}
                    onClick={fetchCandidates} />
                ))}
              </div>
            </div>

            {/* Candidate panel */}
            {selPos ? (
              <div style={{ ...card }}>
                {/* Header */}
                <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:20,
                  paddingBottom:18, borderBottom:`1px solid ${JC.border}` }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:21, fontWeight:900, color:JC.text,
                      fontFamily:"'Merriweather',Georgia,serif" }}>{selPos.name}</div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:8, flexWrap:"wrap" }}>
                      <DeptTag dept={selPos.dept} />
                      <span style={{ fontSize:12, color:JC.textLight }}>🍵 Jian Cha Group</span>
                      <span style={{ fontSize:12, fontWeight:700,
                        color: selPos.status==="active" ? JC.red : JC.greenLight }}>
                        {selPos.status==="active" ? "🔴 Actively Hiring" : "🟢 Position Filled"}
                      </span>
                    </div>
                  </div>
                  {/* Stage count pills */}
                  {!loadingCand && candidates.length > 0 && (
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"flex-end" }}>
                      {PIPELINE_STAGES.map((st,i)=>{
                        const n = candidates.filter(c=>c.status===st).length;
                        if (!n) return null;
                        return (
                          <div key={st} style={{ textAlign:"center", background:JC.bg,
                            border:`1px solid ${JC.border}`, borderRadius:10,
                            padding:"6px 12px", minWidth:48,
                            borderTop:`2px solid ${STAGE_COLORS[i]}` }}>
                            <div style={{ fontSize:18, fontWeight:800, color:JC.text }}>{n}</div>
                            <div style={{ fontSize:9, color:JC.textLight, marginTop:1 }}>
                              {PIPELINE_STAGES_SHORT[i]}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {loadingCand ? (
                  <div style={{ display:"flex", alignItems:"center", gap:12, justifyContent:"center",
                    padding:70 }}>
                    <Spinner size={34} color={JC.greenLight} />
                    <span style={{ color:JC.textLight, fontSize:13 }}>
                      กำลังโหลดข้อมูลจาก Notion...
                    </span>
                  </div>
                ) : candidates.length === 0 ? (
                  <div style={{ textAlign:"center", padding:70, color:JC.textLight }}>
                    <div style={{ fontSize:38, marginBottom:12 }}>📭</div>
                    <div style={{ fontWeight:700, fontSize:15 }}>ยังไม่มีผู้สมัคร</div>
                    <div style={{ fontSize:12, marginTop:6 }}>ข้อมูลจะปรากฏเมื่อมีผู้สมัครในตำแหน่งนี้</div>
                  </div>
                ) : (
                  <>
                    {/* Mini funnel */}
                    <div style={{ marginBottom:24 }}>
                      <FunnelBar counts={Object.fromEntries(
                        PIPELINE_STAGES.map(st=>[st, candidates.filter(c=>c.status===st).length])
                      )} />
                    </div>
                    {/* By stage (all except Applied) */}
                    {PIPELINE_STAGES.filter(st=>st!=="Applied/Sourced").map(stage=>{
                      const group = candidates.filter(c=>c.status===stage);
                      if (!group.length) return null;
                      return (
                        <div key={stage} style={{ marginBottom:20 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                            <StatusPill status={stage} />
                            <span style={{ fontSize:12, color:JC.textLight }}>{group.length} คน</span>
                          </div>
                          {group.map((c,i)=><CandidateRow key={i} c={c} />)}
                        </div>
                      );
                    })}
                    {/* Applied count only */}
                    {(()=>{
                      const n = candidates.filter(c=>c.status==="Applied/Sourced").length;
                      if (!n) return null;
                      return (
                        <div style={{ background:JC.bg, border:`1px solid ${JC.border}`,
                          borderRadius:10, padding:"12px 16px", display:"flex",
                          alignItems:"center", gap:10 }}>
                          <StatusPill status="Applied/Sourced" />
                          <span style={{ fontSize:13, color:JC.textMid, fontWeight:500 }}>
                            {n} ผู้สมัคร (ยังไม่ผ่านการคัดกรอง)
                          </span>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            ) : (
              <div style={{ ...card, textAlign:"center", padding:70 }}>
                <div style={{ fontSize:40, marginBottom:14 }}>👆</div>
                <div style={{ fontSize:15, color:JC.textLight, fontWeight:600 }}>
                  เลือกตำแหน่งด้านบนเพื่อดู Pipeline
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════ CALENDAR ═══════════ */}
        {tab==="calendar" && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div style={{ ...card }}>
              {loading.calendar
                ? <div style={{ display:"flex", alignItems:"center", gap:12, justifyContent:"center",
                    padding:70 }}>
                    <Spinner size={34} color={JC.greenLight} />
                    <span style={{ color:JC.textLight }}>กำลังโหลดตารางจาก Notion...</span>
                  </div>
                : <CalGrid />}
            </div>
            {/* Legend */}
            <div style={{ display:"flex", gap:16 }}>
              {[["#DBEAFE","#1D4ED8","Interview"],[JC.greenPale,JC.green,"Start Date"]].map(([bg,c,l])=>(
                <div key={l} style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <div style={{ width:14, height:10, borderRadius:3, background:bg, border:`1px solid ${c}40` }} />
                  <span style={{ fontSize:12, color:JC.textLight }}>{l}</span>
                </div>
              ))}
            </div>
            {/* Upcoming list */}
            {calEvents.length > 0 && (
              <div style={{ ...card }}>
                <div style={{ fontSize:15, fontWeight:700, color:JC.text, marginBottom:14 }}>
                  Upcoming Events
                </div>
                {calEvents
                  .sort((a,b)=>new Date(a.date)-new Date(b.date))
                  .slice(0,10)
                  .map((e,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:14,
                      padding:"10px 14px", background:JC.bg, border:`1px solid ${JC.border}`,
                      borderRadius:10, marginBottom:6 }}>
                      <div style={{ width:44, textAlign:"center", flexShrink:0 }}>
                        <div style={{ fontSize:20, fontWeight:800,
                          color:e.eventType==="Interview"?"#1D4ED8":JC.green }}>
                          {new Date(e.date).getDate()}
                        </div>
                        <div style={{ fontSize:10, color:JC.textLight }}>
                          {new Date(e.date).toLocaleDateString("en",{month:"short"})}
                        </div>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, color:JC.text }}>{e.candidateName}</div>
                        <div style={{ fontSize:11, color:JC.textLight }}>{e.position}</div>
                      </div>
                      <span style={{ fontSize:11, fontWeight:700, borderRadius:20, padding:"3px 11px",
                        background:e.eventType==="Interview"?"#DBEAFE":JC.greenPale,
                        color:e.eventType==="Interview"?"#1D4ED8":JC.green }}>
                        {e.eventType}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════ TASKS ═══════════ */}
        {tab==="tasks" && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div style={{ ...card }}>
              <div style={{ fontSize:16, fontWeight:700, color:JC.text, marginBottom:20 }}>
                📋 Hiring Tasks Tracker
              </div>

              {loading.tasks
                ? <div style={{ display:"flex", alignItems:"center", gap:12, justifyContent:"center", padding:70 }}>
                    <Spinner size={34} color={JC.greenLight} />
                    <span style={{ color:JC.textLight }}>กำลังโหลด Tasks Tracker...</span>
                  </div>
                : tasks.length===0
                ? <div style={{ textAlign:"center", padding:70, color:JC.textLight }}>ไม่มีข้อมูล</div>
                : (
                  <>
                    {/* Summary badges */}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:24 }}>
                      {[
                        { label:"In Progress", color:JC.goldMid,  bg:JC.goldPale,   icon:"🔄" },
                        { label:"Confirm",     color:JC.greenLight,bg:JC.greenFaint, icon:"✅" },
                        { label:"Onboarded",   color:"#1D4ED8",   bg:"#EFF6FF",     icon:"🎉" },
                        { label:"Cancel",      color:JC.red,      bg:JC.redPale,    icon:"❌" },
                      ].map(({ label, color, bg, icon })=>{
                        const n = tasks.filter(t=>t.status===label).length;
                        return (
                          <div key={label} style={{ display:"flex", alignItems:"center", gap:10,
                            background:bg, border:`1px solid ${color}25`, borderRadius:12,
                            padding:"12px 18px", boxShadow:JC.shadow }}>
                            <span style={{ fontSize:18 }}>{icon}</span>
                            <div>
                              <div style={{ fontSize:24, fontWeight:900, color,
                                fontFamily:"'Merriweather',serif", lineHeight:1 }}>{n}</div>
                              <div style={{ fontSize:11, color, fontWeight:700, marginTop:2 }}>{label}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Table */}
                    <div style={{ overflowX:"auto" }}>
                      <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:"0 4px" }}>
                        <thead>
                          <tr>
                            {["Candidate","Position","Dept","Status","Start Date","Type"].map(h=>(
                              <th key={h} style={{ padding:"6px 12px", textAlign:"left", fontSize:10,
                                color:JC.textLight, fontWeight:700, letterSpacing:"0.07em",
                                textTransform:"uppercase",
                                borderBottom:`2px solid ${JC.border}` }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tasks.map((t,i)=>{
                            const sc={
                              "In progress": JC.goldMid,
                              "Confirm":     JC.greenLight,
                              "Onboarded":   "#1D4ED8",
                              "Cancel":      JC.red,
                            };
                            const bc = {
                              background:JC.bgCard,
                              border:`1px solid ${JC.border}`,
                              padding:"10px 12px",
                            };
                            return (
                              <tr key={i}>
                                <td style={{ ...bc, fontWeight:700, color:JC.text,
                                  borderRadius:"8px 0 0 8px", borderRight:"none" }}>
                                  {t.candidateName||"—"}
                                </td>
                                <td style={{ ...bc, color:JC.textMid, fontSize:13,
                                  borderLeft:"none", borderRight:"none" }}>
                                  {t.position||"—"}
                                </td>
                                <td style={{ ...bc, borderLeft:"none", borderRight:"none" }}>
                                  <DeptTag dept={t.department} />
                                </td>
                                <td style={{ ...bc, borderLeft:"none", borderRight:"none" }}>
                                  <span style={{ background:`${sc[t.status]||"#aaa"}18`,
                                    color:sc[t.status]||"#aaa",
                                    border:`1px solid ${sc[t.status]||"#aaa"}30`,
                                    borderRadius:6, padding:"3px 10px",
                                    fontSize:11, fontWeight:700 }}>{t.status||"—"}</span>
                                </td>
                                <td style={{ ...bc, fontSize:12, color:JC.textLight,
                                  borderLeft:"none", borderRight:"none" }}>
                                  {t.startDate||"—"}
                                </td>
                                <td style={{ ...bc, borderRadius:"0 8px 8px 0",
                                  borderLeft:"none" }}>
                                  <span style={{ color:t.hiringType==="New"?JC.greenLight:JC.goldMid,
                                    fontWeight:700, fontSize:12 }}>
                                    {t.hiringType||"—"}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
