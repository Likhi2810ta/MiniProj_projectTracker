import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch

fig, ax = plt.subplots(figsize=(18, 13))
ax.set_xlim(0, 18)
ax.set_ylim(0, 13)
ax.axis('off')
fig.patch.set_facecolor('#0D1B2A')
ax.set_facecolor('#0D1B2A')

# ── Color palette ────────────────────────────────────────────────────────────
BG       = '#0D1B2A'
CARD     = '#162030'
CARD2    = '#1A2A40'
ACCENT   = '#F5A623'
GREEN    = '#2ECC71'
BLUE     = '#3498DB'
PURPLE   = '#9B59B6'
RED      = '#E74C3C'
TEAL     = '#1ABC9C'
TEXT     = '#FFFFFF'
MUTED    = '#8A99A8'
BORDER   = '#2A3F55'

def box(x, y, w, h, color=CARD, border=BORDER, radius=0.25, lw=1.5):
    rect = FancyBboxPatch((x, y), w, h,
        boxstyle=f"round,pad=0,rounding_size={radius}",
        facecolor=color, edgecolor=border, linewidth=lw, zorder=3)
    ax.add_patch(rect)

def label(x, y, text, size=9, color=TEXT, bold=False, ha='center', va='center'):
    weight = 'bold' if bold else 'normal'
    ax.text(x, y, text, ha=ha, va=va, fontsize=size, color=color,
            fontweight=weight, zorder=4, fontfamily='monospace')

def arrow(x1, y1, x2, y2, color=ACCENT, lw=1.8, style='->', bidirectional=False):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
        arrowprops=dict(arrowstyle='->', color=color, lw=lw,
                        connectionstyle='arc3,rad=0.0'), zorder=5)
    if bidirectional:
        ax.annotate('', xy=(x1, y1), xytext=(x2, y2),
            arrowprops=dict(arrowstyle='->', color=color, lw=lw,
                            connectionstyle='arc3,rad=0.0'), zorder=5)

def arrow_label(x, y, text, size=7, color=ACCENT):
    ax.text(x, y, text, ha='center', va='center', fontsize=size, color=color,
            fontfamily='monospace', zorder=6,
            bbox=dict(boxstyle='round,pad=0.2', facecolor=BG, edgecolor='none'))

# ═══════════════════════════════════════════════════════════════════════════
# TITLE
# ═══════════════════════════════════════════════════════════════════════════
ax.text(9, 12.5, 'COLLEGE PROJECT TRACKER — SYSTEM BLOCK DIAGRAM',
    ha='center', va='center', fontsize=13, color=ACCENT,
    fontweight='bold', fontfamily='monospace', zorder=4)

# ═══════════════════════════════════════════════════════════════════════════
# LAYER LABELS (left side)
# ═══════════════════════════════════════════════════════════════════════════
for ly, ltext in [(10.8, 'USER LAYER'), (8.2, 'FRONTEND LAYER'),
                  (5.3, 'BACKEND LAYER'), (1.8, 'DATA / AI LAYER')]:
    ax.text(0.25, ly, ltext, ha='left', va='center', fontsize=7,
            color=MUTED, fontfamily='monospace', rotation=0, zorder=4)
    ax.plot([0.22, 0.22], [ly - 1.1, ly + 0.4], color=BORDER, lw=1, zorder=3)

# ═══════════════════════════════════════════════════════════════════════════
# LAYER 1 — USERS
# ═══════════════════════════════════════════════════════════════════════════
user_configs = [
    (2.2,  9.9, 2.6, 1.4, RED,    '[ADMIN]',     'Approve accounts\nAssign coordinators'),
    (7.2,  9.9, 2.6, 1.4, BLUE,   '[LECTURER]',  'Manage courses\nTrack projects'),
    (12.2, 9.9, 2.6, 1.4, GREEN,  '[STUDENT]',   'View projects\nUse AI chatbot'),
]
for (x, y, w, h, c, title, sub) in user_configs:
    box(x, y, w, h, color=c + '33', border=c, lw=2)
    label(x + w/2, y + h - 0.35, title, size=9, color=c, bold=True)
    label(x + w/2, y + 0.5,  sub,   size=7, color=MUTED)

# ═══════════════════════════════════════════════════════════════════════════
# LAYER 2 — FRONTEND
# ═══════════════════════════════════════════════════════════════════════════
# Web App
box(3.0, 7.3, 4.5, 1.5, color=CARD2, border=BLUE, lw=1.8)
label(5.25, 8.3, 'REACT + VITE  (Web App)', size=9, color=BLUE, bold=True)
label(5.25, 7.8, 'Login · Admin Panel · Batch/Course/Project Views · Chatbot', size=7, color=MUTED)

# Mobile App
box(10.0, 7.3, 4.5, 1.5, color=CARD2, border=TEAL, lw=1.8)
label(12.25, 8.3, 'REACT NATIVE + EXPO  (Mobile)', size=9, color=TEAL, bold=True)
label(12.25, 7.8, 'Same features · Cross-platform iOS / Android', size=7, color=MUTED)

# ═══════════════════════════════════════════════════════════════════════════
# Arrows: Users → Frontend
# ═══════════════════════════════════════════════════════════════════════════
# Admin → Web
arrow(3.5, 9.9, 4.5, 8.8, color=RED)
# Lecturer → Web
arrow(8.5, 9.9, 6.5, 8.8, color=BLUE)
# Lecturer → Mobile
arrow(8.5, 9.9, 11.5, 8.8, color=BLUE)
# Student → Mobile
arrow(13.5, 9.9, 13.0, 8.8, color=GREEN)
# Student → Web
arrow(13.5, 9.9, 6.8, 8.8, color=GREEN)

# ═══════════════════════════════════════════════════════════════════════════
# REST API connector bar
# ═══════════════════════════════════════════════════════════════════════════
box(3.0, 6.65, 11.5, 0.45, color='#1E3A55', border=ACCENT, lw=1.5)
label(8.75, 6.875, 'REST API  ·  JWT Bearer Token  ·  HTTPS', size=8, color=ACCENT, bold=True)

arrow(5.25, 7.3, 5.25, 7.1,  color=ACCENT)
arrow(12.25, 7.3, 12.25, 7.1, color=ACCENT)

# ═══════════════════════════════════════════════════════════════════════════
# LAYER 3 — FASTAPI BACKEND
# ═══════════════════════════════════════════════════════════════════════════
box(1.5, 3.4, 15.0, 3.0, color=CARD, border=ACCENT, lw=2)
label(9.0, 6.15, 'FASTAPI  BACKEND  (Python)', size=10, color=ACCENT, bold=True)

# Backend modules
modules = [
    (1.7,  3.6, 2.3, 2.2, PURPLE, 'AUTH\nMODULE',     'OTP verify\nAdmin approve\nJWT issue'),
    (4.2,  3.6, 2.3, 2.2, BLUE,   'BATCH /\nCOURSE',  'CRUD batches\nsemesters\ncourses'),
    (6.7,  3.6, 2.3, 2.2, GREEN,  'PROJECT\nMGMT',    'Create/edit\nprojects &\nstudents'),
    (9.2,  3.6, 2.3, 2.2, TEAL,   'UPLOAD\nMODULE',   'Parse XLSX\nopenpyxl\nbulk insert'),
    (11.7, 3.6, 2.3, 2.2, RED,    'AI\nCHATBOT',      'Filter query\nExplain proj\nSuggest fix'),
    (14.2, 3.6, 2.0, 2.2, '#E67E22', 'ADMIN\nPANEL',  'Approve users\nAssign coords\nView stats'),
]
for (x, y, w, h, c, title, sub) in modules:
    box(x, y, w, h, color=c + '22', border=c, lw=1.5)
    label(x + w/2, y + h - 0.55, title, size=7.5, color=c, bold=True)
    label(x + w/2, y + 0.55,     sub,   size=6.5, color=MUTED)

# Arrow from REST bar to backend
arrow(8.75, 6.65, 8.75, 6.4, color=ACCENT)

# ═══════════════════════════════════════════════════════════════════════════
# LAYER 4 — DATA / AI
# ═══════════════════════════════════════════════════════════════════════════
# Supabase
box(1.5, 0.5, 6.5, 2.5, color=CARD2, border=GREEN, lw=2)
label(4.75, 2.65, 'SUPABASE  (PostgreSQL)', size=10, color=GREEN, bold=True)
schema_items = [
    (2.0, 1.9, 'profiles  (role, approved)'),
    (2.0, 1.5, 'batch → semester → course'),
    (2.0, 1.1, 'project → student'),
    (2.0, 0.75,'course_coordinator'),
]
for (x, y, t) in schema_items:
    ax.text(x, y, '▸ ' + t, ha='left', va='center', fontsize=7,
            color=MUTED, fontfamily='monospace', zorder=4)

# Groq AI
box(9.0, 0.5, 4.5, 2.5, color=CARD2, border=PURPLE, lw=2)
label(11.25, 2.65, 'GROQ  (LLaMA 3.1)', size=10, color=PURPLE, bold=True)
groq_items = [
    (9.3, 1.9, 'NL → JSON filter query'),
    (9.3, 1.5, 'Project explanation'),
    (9.3, 1.1, 'Improvement suggestions'),
    (9.3, 0.75,'Model: llama-3.1-8b-instant'),
]
for (x, y, t) in groq_items:
    ax.text(x, y, '▸ ' + t, ha='left', va='center', fontsize=7,
            color=MUTED, fontfamily='monospace', zorder=4)

# SMTP
box(14.0, 0.5, 2.8, 2.5, color=CARD2, border=RED, lw=2)
label(15.4, 2.65, 'SMTP', size=10, color=RED, bold=True)
smtp_items = [
    (14.2, 1.9, 'Gmail SMTP'),
    (14.2, 1.5, 'OTP emails'),
    (14.2, 1.1, 'Port 587 TLS'),
]
for (x, y, t) in smtp_items:
    ax.text(x, y, '▸ ' + t, ha='left', va='center', fontsize=7,
            color=MUTED, fontfamily='monospace', zorder=4)

# ═══════════════════════════════════════════════════════════════════════════
# Arrows: Backend modules → Data/AI
# ═══════════════════════════════════════════════════════════════════════════
# Auth module → SMTP
arrow(2.85, 3.6, 15.0, 3.0, color=RED)
arrow_label(9.0, 3.15, 'OTP email', color=RED)

# Auth module → Supabase
arrow(2.85, 3.6, 4.0, 3.0, color=GREEN)

# Batch/Course → Supabase
arrow(5.35, 3.6, 4.75, 3.0, color=GREEN)

# Project → Supabase
arrow(7.85, 3.6, 5.5, 3.0, color=GREEN)

# Upload → Supabase
arrow(10.35, 3.6, 6.2, 3.0, color=GREEN)

# AI Chatbot → Groq
arrow(12.85, 3.6, 11.25, 3.0, color=PURPLE)
arrow_label(12.2, 3.2, 'LLM API', color=PURPLE)

# Admin → Supabase
arrow(15.2, 3.6, 7.0, 3.0, color=GREEN)

# ═══════════════════════════════════════════════════════════════════════════
# Auth flow annotation
# ═══════════════════════════════════════════════════════════════════════════
box(1.5, 11.5, 15.0, 0.6, color='#0D2235', border=BORDER, lw=1)
flow_steps = [
    (2.5,  11.8, '[1] Register', MUTED),
    (3.9,  11.8, '->', ACCENT),
    (4.5,  11.8, '[2] OTP Email (SMTP)', RED),
    (6.8,  11.8, '->', ACCENT),
    (7.4,  11.8, '[3] Verify OTP', MUTED),
    (9.1,  11.8, '->', ACCENT),
    (9.7,  11.8, '[4] Pending Account', PURPLE),
    (12.0, 11.8, '->', ACCENT),
    (12.6, 11.8, '[5] Admin Approves', RED),
    (15.0, 11.8, '->', ACCENT),
    (15.6, 11.8, '[6] Login', GREEN),
]
for (x, y, t, c) in flow_steps:
    ax.text(x, y, t, ha='left', va='center', fontsize=7.5,
            color=c, fontfamily='monospace', fontweight='bold', zorder=4)
ax.text(1.6, 12.2, 'AUTH FLOW:', ha='left', va='center', fontsize=7,
        color=ACCENT, fontfamily='monospace', fontweight='bold', zorder=4)

# ═══════════════════════════════════════════════════════════════════════════
# Legend
# ═══════════════════════════════════════════════════════════════════════════
legend_items = [
    (ACCENT, 'REST / JWT flow'),
    (GREEN,  'DB queries (Supabase)'),
    (PURPLE, 'AI API (Groq)'),
    (RED,    'Email (SMTP)'),
]
for i, (c, t) in enumerate(legend_items):
    bx = 1.5 + i * 3.8
    ax.plot([bx, bx + 0.5], [0.22, 0.22], color=c, lw=2, zorder=4)
    ax.text(bx + 0.65, 0.22, t, ha='left', va='center', fontsize=7,
            color=MUTED, fontfamily='monospace', zorder=4)

plt.tight_layout(pad=0.3)
plt.savefig('D:/mini_project/block_diagram.png', dpi=150, bbox_inches='tight',
            facecolor=BG, edgecolor='none')
print('Saved: D:/mini_project/block_diagram.png')
