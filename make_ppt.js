const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title  = "College Project Tracker";

// ── Palette ─────────────────────────────────────────────────────────────────
const C = {
  bg:      "0D1B2A",
  card:    "162030",
  card2:   "1C2D3E",
  accent:  "F5A623",
  white:   "FFFFFF",
  muted:   "8A99A8",
  green:   "4CAF7D",
  danger:  "E05252",
  border:  "243650",
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function bg(slide) { slide.background = { color: C.bg }; }

function accentBar(slide, h = 5.625) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.06, h,
    fill: { color: C.accent }, line: { color: C.accent },
  });
}

function sectionHeader(slide, eyebrow, title) {
  slide.addText(eyebrow.toUpperCase(), {
    x: 0.45, y: 0.28, w: 9, h: 0.25,
    fontFace: "Calibri", fontSize: 9, bold: true,
    color: C.accent, charSpacing: 4, margin: 0,
  });
  slide.addText(title.toUpperCase(), {
    x: 0.45, y: 0.52, w: 9, h: 0.6,
    fontFace: "Arial Black", fontSize: 26, bold: true,
    color: C.white, margin: 0,
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 1.1, w: 9, h: 0.025,
    fill: { color: C.border }, line: { color: C.border },
  });
}

function card(slide, x, y, w, h, color) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: color || C.card },
    line: { color: C.border, width: 1 },
  });
}

function presenterTag(slide, name, color) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 5.25, w: 1.8, h: 0.24,
    fill: { color: color || C.accent }, line: { color: color || C.accent },
  });
  slide.addText(`PRESENTER: ${name}`, {
    x: 0.45, y: 5.25, w: 1.8, h: 0.24,
    fontFace: "Calibri", fontSize: 7.5, bold: true, color: C.bg,
    align: "center", valign: "middle", margin: 0,
  });
}

// ============================================================================
// SLIDE 1 — Title
// ============================================================================
{
  const s = pres.addSlide();
  bg(s);

  // Left accent bar (thicker for title)
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.12, h: 5.625,
    fill: { color: C.accent }, line: { color: C.accent },
  });

  // Top amber band
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: C.accent }, line: { color: C.accent },
  });

  // Eyebrow
  s.addText("MINI PROJECT PRESENTATION", {
    x: 0.5, y: 1.0, w: 9, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true, charSpacing: 5,
    color: C.accent, margin: 0,
  });

  // Main title
  s.addText("COLLEGE", {
    x: 0.5, y: 1.35, w: 9, h: 1.0,
    fontFace: "Arial Black", fontSize: 72, bold: true,
    color: C.white, margin: 0,
  });
  s.addText("PROJECT TRACKER", {
    x: 0.5, y: 2.25, w: 9, h: 0.9,
    fontFace: "Arial Black", fontSize: 52, bold: true,
    color: C.accent, margin: 0,
  });

  // Subtitle
  s.addText("Smart Project Management for Academic Institutions", {
    x: 0.5, y: 3.2, w: 9, h: 0.4,
    fontFace: "Calibri", fontSize: 16, italic: true,
    color: C.muted, margin: 0,
  });

  // Divider
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 3.7, w: 3.5, h: 0.03,
    fill: { color: C.accent }, line: { color: C.accent },
  });

  // Tech tags
  const tags = ["FastAPI", "React", "Supabase", "Groq AI", "React Native"];
  tags.forEach((t, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.5 + i * 1.82, y: 3.88, w: 1.7, h: 0.28,
      fill: { color: C.card2 }, line: { color: C.border, width: 1 },
    });
    s.addText(t, {
      x: 0.5 + i * 1.82, y: 3.88, w: 1.7, h: 0.28,
      fontFace: "Calibri", fontSize: 9, bold: true,
      color: C.accent, align: "center", valign: "middle", margin: 0,
    });
  });

  // College / dept
  s.addText("Dept. of Computer Science & Engineering  |  DSCE, Bengaluru", {
    x: 0.5, y: 5.0, w: 9, h: 0.25,
    fontFace: "Calibri", fontSize: 9, color: C.muted, margin: 0,
  });
}

// ============================================================================
// SLIDE 2 — Problem Statement
// ============================================================================
{
  const s = pres.addSlide();
  bg(s); accentBar(s);
  sectionHeader(s, "Presenter 1", "Problem Statement");

  const problems = [
    { icon: "📋", title: "Manual Tracking", desc: "100s of projects tracked in spreadsheets — error-prone, slow, and hard to share across departments." },
    { icon: "🔍", title: "No Central System", desc: "Each lecturer maintains separate records. No single source of truth for batches, semesters, or courses." },
    { icon: "🤖", title: "Zero AI Assistance", desc: "No intelligent search, no automated summaries, no improvement suggestions for student projects." },
    { icon: "🔐", title: "No Access Control", desc: "Students, lecturers, and coordinators have no differentiated access — everything is open or locked." },
  ];

  problems.forEach((p, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.45 + col * 4.8;
    const y = 1.3 + row * 2.0;

    card(s, x, y, 4.55, 1.75);

    // Accent left strip on card
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.07, h: 1.75,
      fill: { color: C.accent }, line: { color: C.accent },
    });

    s.addText(p.icon + "  " + p.title, {
      x: x + 0.2, y: y + 0.15, w: 4.1, h: 0.4,
      fontFace: "Arial Black", fontSize: 13, bold: true,
      color: C.white, margin: 0,
    });
    s.addText(p.desc, {
      x: x + 0.2, y: y + 0.6, w: 4.1, h: 1.0,
      fontFace: "Calibri", fontSize: 11, color: C.muted,
      wrap: true, margin: 0,
    });
  });

  presenterTag(s, "1 — Problem Statement");
}

// ============================================================================
// SLIDE 3 — Proposed Solution + Objectives
// ============================================================================
{
  const s = pres.addSlide();
  bg(s); accentBar(s);
  sectionHeader(s, "Presenter 1", "Proposed Solution & Objectives");

  // Solution banner
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 1.25, w: 9.1, h: 0.65,
    fill: { color: C.card2 }, line: { color: C.accent, width: 1 },
  });
  s.addText("A centralised full-stack web & mobile platform for colleges to manage student projects across batches, semesters, and courses — with role-based access and AI-powered insights.", {
    x: 0.6, y: 1.25, w: 8.8, h: 0.65,
    fontFace: "Calibri", fontSize: 12, color: C.white,
    valign: "middle", margin: 0,
  });

  const objectives = [
    { num: "01", title: "Structured Hierarchy", desc: "Batch → Semester → Course → Project → Students for full academic traceability." },
    { num: "02", title: "Role-Based Access", desc: "Admin, Coordinator, Lecturer, and Student roles with OTP email verification and admin approval." },
    { num: "03", title: "Automated Data Entry", desc: "Upload XLSX team sheets to auto-populate project metadata and student records in one step." },
    { num: "04", title: "AI-Powered Features", desc: "Natural language project search, README explanations, and improvement suggestions via Groq LLM." },
  ];

  objectives.forEach((o, i) => {
    const y = 2.05 + i * 0.79;
    // Number badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.45, y, w: 0.5, h: 0.6,
      fill: { color: C.accent }, line: { color: C.accent },
    });
    s.addText(o.num, {
      x: 0.45, y, w: 0.5, h: 0.6,
      fontFace: "Arial Black", fontSize: 14, bold: true,
      color: C.bg, align: "center", valign: "middle", margin: 0,
    });
    s.addText(o.title + " — ", {
      x: 1.1, y: y + 0.04, w: 1.6, h: 0.28,
      fontFace: "Calibri", fontSize: 12, bold: true, color: C.accent, margin: 0,
    });
    s.addText(o.desc, {
      x: 2.6, y: y + 0.04, w: 6.9, h: 0.28,
      fontFace: "Calibri", fontSize: 11, color: C.white, margin: 0,
    });
    s.addText(o.desc, {  // second line if needed — use divider instead
      x: 1.1, y: y + 0.3, w: 8.4, h: 0.26,
      fontFace: "Calibri", fontSize: 10, color: C.muted, margin: 0,
    });
  });

  presenterTag(s, "1 — Solution & Objectives");
}

// ============================================================================
// SLIDE 4 — System Architecture
// ============================================================================
{
  const s = pres.addSlide();
  bg(s); accentBar(s);
  sectionHeader(s, "Presenter 2", "System Architecture");

  // Three-tier blocks
  const tiers = [
    { label: "PRESENTATION TIER", sub: "Web (React + Vite)\nMobile (React Native + Expo)", color: C.card2 },
    { label: "APPLICATION TIER",  sub: "FastAPI (Python)\nJWT Auth + REST API\nGroq AI Integration", color: C.card },
    { label: "DATA TIER",         sub: "Supabase (PostgreSQL)\nRow Level Security\nReal-time DB", color: C.card2 },
  ];

  tiers.forEach((t, i) => {
    const x = 0.45 + i * 3.1;
    // Block
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.35, w: 2.9, h: 3.5,
      fill: { color: t.color }, line: { color: C.border, width: 1 },
    });
    // Top accent
    s.addShape(pres.shapes.RECTANGLE, {
      x, y: 1.35, w: 2.9, h: 0.07,
      fill: { color: C.accent }, line: { color: C.accent },
    });
    // Tier label
    s.addText(t.label, {
      x: x + 0.1, y: 1.5, w: 2.7, h: 0.45,
      fontFace: "Arial Black", fontSize: 10, bold: true,
      color: C.accent, align: "center", margin: 0,
    });
    // Sub details
    s.addText(t.sub, {
      x: x + 0.1, y: 2.1, w: 2.7, h: 1.5,
      fontFace: "Calibri", fontSize: 11, color: C.white,
      align: "center", valign: "top", margin: 0,
    });

    // Arrow (except last)
    if (i < 2) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: x + 3.0, y: 2.85, w: 0.08, h: 0.02,
        fill: { color: C.accent }, line: { color: C.accent },
      });
      s.addText("⟷", {
        x: x + 2.95, y: 2.7, w: 0.2, h: 0.3,
        fontFace: "Arial", fontSize: 18, color: C.accent, margin: 0,
      });
    }
  });

  // SMTP box below
  s.addShape(pres.shapes.RECTANGLE, {
    x: 3.55, y: 5.0, w: 2.9, h: 0.38,
    fill: { color: C.card }, line: { color: C.accent, width: 1 },
  });
  s.addText("📧  Gmail SMTP (OTP Email)", {
    x: 3.55, y: 5.0, w: 2.9, h: 0.38,
    fontFace: "Calibri", fontSize: 10, color: C.accent,
    align: "center", valign: "middle", margin: 0,
  });

  presenterTag(s, "2 — Architecture", C.green);
}

// ============================================================================
// SLIDE 5 — Module Overview
// ============================================================================
{
  const s = pres.addSlide();
  bg(s); accentBar(s);
  sectionHeader(s, "Presenter 2", "Module Overview");

  const modules = [
    { icon: "🔐", name: "Authentication",    desc: "OTP email verification, Supabase JWT, admin approval workflow" },
    { icon: "📁", name: "Batch Management",  desc: "Create batches, semesters, courses — full academic hierarchy" },
    { icon: "📝", name: "Project Management",desc: "CRUD for projects, team members, GitHub links, guide assignment" },
    { icon: "📊", name: "XLSX Upload",       desc: "Parse team sheets, auto-fill project fields & student records" },
    { icon: "🤖", name: "AI Chatbot",        desc: "NL filter, README explain, improvement suggestions (Groq LLM)" },
    { icon: "👥", name: "Role Management",   desc: "Admin, Lecturer, Coordinator, Student — fine-grained access" },
  ];

  modules.forEach((m, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.45 + col * 3.12;
    const y = 1.35 + row * 2.05;

    card(s, x, y, 2.95, 1.82);
    s.addText(m.icon + " " + m.name, {
      x: x + 0.15, y: y + 0.15, w: 2.65, h: 0.42,
      fontFace: "Calibri", fontSize: 12, bold: true, color: C.accent, margin: 0,
    });
    s.addText(m.desc, {
      x: x + 0.15, y: y + 0.6, w: 2.65, h: 1.05,
      fontFace: "Calibri", fontSize: 10, color: C.muted, wrap: true, margin: 0,
    });
  });

  presenterTag(s, "2 — Modules", C.green);
}

// ============================================================================
// SLIDE 6 — Database Schema
// ============================================================================
{
  const s = pres.addSlide();
  bg(s); accentBar(s);
  sectionHeader(s, "Presenter 2", "Database Schema");

  const entities = [
    { name: "BATCH",    fields: "batch_id (PK)\nbatch_name\nyear", x: 0.5,  y: 1.4 },
    { name: "SEMESTER", fields: "semester_id (PK)\nbatch_id (FK)\nsem_number", x: 2.6, y: 1.4 },
    { name: "COURSE",   fields: "course_id (PK)\nsemester_id (FK)\ncourse_name\ncourse_code", x: 4.7, y: 1.4 },
    { name: "PROJECT",  fields: "project_id (PK)\ncourse_id (FK)\ntitle\ngithub\nguide", x: 6.8, y: 1.4 },
    { name: "STUDENT",  fields: "student_id (PK)\nproject_id (FK)\nusn\nname", x: 6.8, y: 3.5 },
    { name: "PROFILES", fields: "id (FK→auth.users)\nemail\nrole\napproved", x: 0.5, y: 3.5 },
  ];

  entities.forEach(e => {
    // Header
    s.addShape(pres.shapes.RECTANGLE, {
      x: e.x, y: e.y, w: 2.1, h: 0.38,
      fill: { color: C.accent }, line: { color: C.accent },
    });
    s.addText(e.name, {
      x: e.x, y: e.y, w: 2.1, h: 0.38,
      fontFace: "Arial Black", fontSize: 11, bold: true,
      color: C.bg, align: "center", valign: "middle", margin: 0,
    });
    // Body
    const lines = e.fields.split("\n");
    s.addShape(pres.shapes.RECTANGLE, {
      x: e.x, y: e.y + 0.38, w: 2.1, h: lines.length * 0.32 + 0.1,
      fill: { color: C.card }, line: { color: C.border, width: 1 },
    });
    s.addText(e.fields, {
      x: e.x + 0.1, y: e.y + 0.42, w: 1.9, h: lines.length * 0.32,
      fontFace: "Calibri", fontSize: 9.5, color: C.white,
      margin: 0,
    });
  });

  // Connecting arrows (text arrows)
  const arrows = [
    { x: 2.6, y: 2.1, text: "1:N" },
    { x: 4.7, y: 2.1, text: "1:N" },
    { x: 6.8, y: 2.1, text: "1:N" },
  ];
  arrows.forEach(a => {
    s.addText("→", {
      x: a.x - 0.4, y: a.y - 0.1, w: 0.4, h: 0.3,
      fontFace: "Arial", fontSize: 14, color: C.accent, margin: 0,
    });
    s.addText(a.text, {
      x: a.x - 0.4, y: a.y + 0.2, w: 0.4, h: 0.2,
      fontFace: "Calibri", fontSize: 7, color: C.muted, margin: 0,
    });
  });

  presenterTag(s, "2 — DB Schema", C.green);
}

// ============================================================================
// SLIDE 7 — Tech Stack
// ============================================================================
{
  const s = pres.addSlide();
  bg(s); accentBar(s);
  sectionHeader(s, "Presenter 3", "Technology Stack");

  const stack = [
    { cat: "Frontend (Web)",    color: "1C4E6B", items: ["React 18 + Vite", "React Router v6", "CSS Variables (Brutalist UI)", "Axios / Fetch API"] },
    { cat: "Frontend (Mobile)", color: "1C4E6B", items: ["React Native", "Expo SDK 54", "React Navigation", "AsyncStorage (JWT)"] },
    { cat: "Backend",           color: "2E5C3E", items: ["FastAPI (Python)", "PyJWT + Supabase Auth", "openpyxl (XLSX)", "python-dotenv"] },
    { cat: "Database",          color: "4A2E6B", items: ["Supabase (PostgreSQL)", "PostgREST API", "Row Level Security", "supabase-py v2"] },
    { cat: "AI / Chatbot",      color: "6B4A1C", items: ["Groq Cloud API", "llama-3.1-8b-instant", "JSON-mode responses", "GitHub REST API"] },
    { cat: "Auth / Infra",      color: "6B1C1C", items: ["SMTP (Gmail App PW)", "OTP email verification", "Admin approval flow", "JWT (HS256)"] },
  ];

  stack.forEach((st, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.45 + col * 3.12;
    const y = 1.35 + row * 2.05;

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 2.95, h: 1.82,
      fill: { color: st.color }, line: { color: C.border, width: 1 },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 2.95, h: 0.07,
      fill: { color: C.accent }, line: { color: C.accent },
    });
    s.addText(st.cat, {
      x: x + 0.1, y: y + 0.12, w: 2.75, h: 0.3,
      fontFace: "Arial Black", fontSize: 10, bold: true,
      color: C.accent, margin: 0,
    });
    st.items.forEach((item, j) => {
      s.addText("▸ " + item, {
        x: x + 0.1, y: y + 0.47 + j * 0.29, w: 2.75, h: 0.27,
        fontFace: "Calibri", fontSize: 9.5, color: C.white, margin: 0,
      });
    });
  });

  presenterTag(s, "3 — Tech Stack", "E05252");
}

// ============================================================================
// SLIDE 8 — Key Algorithms
// ============================================================================
{
  const s = pres.addSlide();
  bg(s); accentBar(s);
  sectionHeader(s, "Presenter 3", "Key Algorithms & Flows");

  const algos = [
    {
      title: "OTP Verification Flow",
      steps: ["User enters email + password", "Backend generates 6-digit OTP", "OTP emailed via SMTP (5-min TTL)", "User enters OTP → Supabase user created", "Profile set to 'pending' → Admin approves"],
    },
    {
      title: "AI Natural Language Filter",
      steps: ["User types free-text query", "LLM converts to JSON filter spec", "PostgREST query with server-side filters", "Post-filter nested fields (batch, sem)", "Return matching project list"],
    },
    {
      title: "XLSX Parsing Pipeline",
      steps: ["Validate header row (exact column order)", "Read first non-empty data row", "Map cells → project fields & students", "Delete old team → insert new students", "Return summary: inserted / skipped"],
    },
    {
      title: "Role-Based Access Control",
      steps: ["JWT decoded → user sub extracted", "Query profiles table → get role", "Admin: all endpoints", "Coordinator: assigned courses only", "Student: read-only, chatbot only"],
    },
  ];

  algos.forEach((a, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.45 + col * 4.8;
    const y = 1.3 + row * 2.1;

    card(s, x, y, 4.55, 1.9);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.07, h: 1.9,
      fill: { color: C.accent }, line: { color: C.accent },
    });
    s.addText(a.title, {
      x: x + 0.2, y: y + 0.1, w: 4.2, h: 0.3,
      fontFace: "Arial Black", fontSize: 11, bold: true,
      color: C.accent, margin: 0,
    });
    a.steps.forEach((step, j) => {
      s.addText(`${j + 1}. ${step}`, {
        x: x + 0.2, y: y + 0.44 + j * 0.28, w: 4.25, h: 0.26,
        fontFace: "Calibri", fontSize: 9.5, color: C.white, margin: 0,
      });
    });
  });

  presenterTag(s, "3 — Algorithms", "E05252");
}

// ============================================================================
// SLIDE 9 — Methodology
// ============================================================================
{
  const s = pres.addSlide();
  bg(s); accentBar(s);
  sectionHeader(s, "Presenter 3", "Development Methodology");

  // Phases timeline
  const phases = [
    { num: "01", name: "Requirements\nAnalysis",   desc: "Identified stakeholders (Admin, Lecturer, Student), defined use cases, chose technology stack." },
    { num: "02", name: "Database\nDesign",         desc: "Designed normalised PostgreSQL schema with Supabase. Defined RLS policies and relationships." },
    { num: "03", name: "Backend\nDevelopment",     desc: "Built FastAPI REST APIs, JWT auth, XLSX parser, Groq integration, SMTP OTP system." },
    { num: "04", name: "Frontend\nDevelopment",    desc: "React/Vite web app + React Native mobile. Shared API layer, brutalist design system." },
    { num: "05", name: "Testing &\nIntegration",   desc: "End-to-end testing of auth flows, upload pipeline, role guards, and AI chatbot responses." },
  ];

  phases.forEach((p, i) => {
    const y = 1.35 + i * 0.8;
    // Number
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.45, y, w: 0.55, h: 0.65,
      fill: { color: C.accent }, line: { color: C.accent },
    });
    s.addText(p.num, {
      x: 0.45, y, w: 0.55, h: 0.65,
      fontFace: "Arial Black", fontSize: 16, bold: true,
      color: C.bg, align: "center", valign: "middle", margin: 0,
    });
    // Connector dot
    if (i < phases.length - 1) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.68, y: y + 0.65, w: 0.09, h: 0.15,
        fill: { color: C.border }, line: { color: C.border },
      });
    }
    // Name
    s.addText(p.name, {
      x: 1.15, y: y + 0.02, w: 1.7, h: 0.6,
      fontFace: "Arial Black", fontSize: 11, bold: true,
      color: C.white, valign: "middle", margin: 0,
    });
    // Desc
    s.addText(p.desc, {
      x: 3.0, y: y + 0.06, w: 6.5, h: 0.55,
      fontFace: "Calibri", fontSize: 10.5, color: C.muted,
      valign: "middle", margin: 0,
    });
  });

  presenterTag(s, "3 — Methodology", "E05252");
}

// ============================================================================
// SLIDE 10 — Features Demo Overview
// ============================================================================
{
  const s = pres.addSlide();
  bg(s); accentBar(s);
  sectionHeader(s, "Presenter 4", "Features — Live Demo");

  const features = [
    { icon: "🔐", name: "Login & Registration", desc: "Student / Staff tabs. OTP email verification. Admin approves accounts before access is granted." },
    { icon: "📁", name: "Batch → Project Hierarchy", desc: "Navigate Batch → Semester → Course → Projects. Create and manage each level." },
    { icon: "📊", name: "XLSX Team Upload", desc: "Upload team sheet → auto-fills project title, GitHub, guide, and up to 4 student records instantly." },
    { icon: "⚙️", name: "Admin Panel", desc: "View pending approvals, approve / reject users, assign lecturers as course coordinators." },
  ];

  features.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.45 + col * 4.8;
    const y = 1.3 + row * 2.05;

    card(s, x, y, 4.55, 1.82);
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.55, h: 0.07,
      fill: { color: C.accent }, line: { color: C.accent },
    });
    s.addText(f.icon + "  " + f.name, {
      x: x + 0.15, y: y + 0.15, w: 4.2, h: 0.38,
      fontFace: "Arial Black", fontSize: 12, bold: true, color: C.white, margin: 0,
    });
    s.addText(f.desc, {
      x: x + 0.15, y: y + 0.6, w: 4.2, h: 1.05,
      fontFace: "Calibri", fontSize: 11, color: C.muted, wrap: true, margin: 0,
    });
  });

  presenterTag(s, "4 — Demo", C.accent);
}

// ============================================================================
// SLIDE 11 — AI Features
// ============================================================================
{
  const s = pres.addSlide();
  bg(s); accentBar(s);
  sectionHeader(s, "Presenter 4", "AI-Powered Features");

  // Groq badge
  s.addShape(pres.shapes.RECTANGLE, {
    x: 7.5, y: 0.3, w: 2.0, h: 0.35,
    fill: { color: C.card2 }, line: { color: C.accent, width: 1 },
  });
  s.addText("⚡ Powered by Groq  |  llama-3.1", {
    x: 7.5, y: 0.3, w: 2.0, h: 0.35,
    fontFace: "Calibri", fontSize: 8, bold: true,
    color: C.accent, align: "center", valign: "middle", margin: 0,
  });

  const aiFeatures = [
    {
      num: "01", title: "Natural Language Project Filter",
      detail: "Type: 'Show Python projects from batch 2024-2028 in Sem 5'\nLLM converts to structured JSON → PostgREST query → results shown as cards.",
      example: "Query → JSON filter → DB → Results",
    },
    {
      num: "02", title: "README Explanation",
      detail: "Click 'Explain Project' on any project with a GitHub link.\nLLM reads the README and returns a 3-4 sentence plain-English summary.",
      example: "GitHub URL → README fetch → LLM → Summary",
    },
    {
      num: "03", title: "Improvement Suggestions",
      detail: "Click 'Suggest Improvements'.\nLLM searches GitHub for similar repos, reads their READMEs, and provides 4-6 actionable improvements.",
      example: "Keywords → GitHub search → LLM → Bullets",
    },
  ];

  aiFeatures.forEach((f, i) => {
    const y = 1.35 + i * 1.38;
    // Card
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.45, y, w: 9.1, h: 1.2,
      fill: { color: C.card }, line: { color: C.border, width: 1 },
    });
    // Accent left
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.45, y, w: 0.07, h: 1.2,
      fill: { color: C.accent }, line: { color: C.accent },
    });
    // Number
    s.addText(f.num, {
      x: 0.6, y: y + 0.1, w: 0.45, h: 0.45,
      fontFace: "Arial Black", fontSize: 20, bold: true, color: C.accent, margin: 0,
    });
    // Title
    s.addText(f.title, {
      x: 1.2, y: y + 0.1, w: 5.5, h: 0.35,
      fontFace: "Arial Black", fontSize: 13, bold: true, color: C.white, margin: 0,
    });
    // Detail
    s.addText(f.detail, {
      x: 1.2, y: y + 0.48, w: 5.5, h: 0.65,
      fontFace: "Calibri", fontSize: 10, color: C.muted, margin: 0,
    });
    // Flow pill
    s.addShape(pres.shapes.RECTANGLE, {
      x: 6.9, y: y + 0.35, w: 2.55, h: 0.4,
      fill: { color: C.card2 }, line: { color: C.accent, width: 1 },
    });
    s.addText(f.example, {
      x: 6.9, y: y + 0.35, w: 2.55, h: 0.4,
      fontFace: "Calibri", fontSize: 8.5, color: C.accent,
      align: "center", valign: "middle", margin: 0,
    });
  });

  presenterTag(s, "4 — AI Features", C.accent);
}

// ============================================================================
// SLIDE 12 — Conclusion + Future Scope
// ============================================================================
{
  const s = pres.addSlide();
  s.background = { color: C.bg };

  // Top amber band
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: C.accent }, line: { color: C.accent },
  });
  // Left accent bar (thick)
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.12, h: 5.625,
    fill: { color: C.accent }, line: { color: C.accent },
  });

  // Title
  s.addText("CONCLUSION", {
    x: 0.5, y: 0.3, w: 9, h: 0.55,
    fontFace: "Arial Black", fontSize: 32, bold: true,
    color: C.white, margin: 0,
  });

  // Summary card
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.45, y: 1.0, w: 9.1, h: 0.75,
    fill: { color: C.card2 }, line: { color: C.border, width: 1 },
  });
  s.addText("The College Project Tracker successfully addresses the need for a centralised, role-aware platform for managing academic projects. It combines a modern full-stack architecture with practical AI capabilities to save faculty time and improve project visibility.", {
    x: 0.6, y: 1.0, w: 8.8, h: 0.75,
    fontFace: "Calibri", fontSize: 11, color: C.white,
    valign: "middle", margin: 0,
  });

  // Future scope
  s.addText("FUTURE SCOPE", {
    x: 0.45, y: 1.9, w: 3, h: 0.32,
    fontFace: "Arial Black", fontSize: 12, bold: true,
    color: C.accent, margin: 0,
  });

  const future = [
    { icon: "📱", text: "Mobile App — Deploy to Play Store / App Store via EAS Build" },
    { icon: "📧", text: "Notifications — Email alerts for approval, project updates, deadlines" },
    { icon: "🔍", text: "Plagiarism Detection — AI-based similarity check across project repos" },
    { icon: "📊", text: "Analytics Dashboard — Project completion stats, batch comparison charts" },
    { icon: "🌐", text: "Public Portfolio — Shareable student project pages with QR codes" },
    { icon: "🎯", text: "Rubric-based Grading — Structured evaluation forms per project" },
  ];

  future.forEach((f, i) => {
    const col = i % 2;
    const row = Math.floor(i / 3);
    const x = 0.45 + col * 4.8;
    const y = 2.3 + Math.floor(i / 2) * 0.78;

    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.55, h: 0.6,
      fill: { color: C.card }, line: { color: C.border, width: 1 },
    });
    s.addText(f.icon + "  " + f.text, {
      x: x + 0.15, y, w: 4.3, h: 0.6,
      fontFace: "Calibri", fontSize: 10.5, color: C.white,
      valign: "middle", margin: 0,
    });
  });

  // Thank you
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.28, w: 10, h: 0.345,
    fill: { color: C.accent }, line: { color: C.accent },
  });
  s.addText("THANK YOU  —  Open for Questions", {
    x: 0, y: 5.28, w: 10, h: 0.345,
    fontFace: "Arial Black", fontSize: 14, bold: true,
    color: C.bg, align: "center", valign: "middle", margin: 0,
  });
}

// ── Write file ────────────────────────────────────────────────────────────────
pres.writeFile({ fileName: "D:/mini_project/College_Project_Tracker_Presentation.pptx" })
  .then(() => console.log("✓  Saved: College_Project_Tracker_Presentation.pptx"))
  .catch(e => { console.error("✗  Error:", e.message); process.exit(1); });
