import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { getProjects, createProject } from '../api';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';

export default function ProjectsPage() {
  const { courseId } = useParams();
  const { state }    = useLocation();
  const navigate     = useNavigate();
  const courseName   = state?.courseName || 'Course';
  const semLabel     = state?.semLabel   || '';
  const batchName    = state?.batchName  || '';

  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [modalOpen, setModal]   = useState(false);
  const [form, setForm]         = useState({ title: '', github: '', guide: '' });
  const [saving, setSaving]     = useState(false);
  const [saveErr, setSaveErr]   = useState('');

  async function load() {
    try { setProjects(await getProjects(courseId) || []); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [courseId]);

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true); setSaveErr('');
    try {
      const payload = Object.fromEntries(
        Object.entries(form).filter(([, v]) => v.trim())
      );
      await createProject(courseId, payload);
      setModal(false); setForm({ title: '', github: '', guide: '' });
      await load();
    } catch (e) { setSaveErr(e.message); }
    finally { setSaving(false); }
  }

  function field(key) {
    return e => setForm(f => ({ ...f, [key]: e.target.value }));
  }

  return (
    <>
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/batches">Batches</Link>
          {batchName && <><span className="sep">›</span><span>{batchName}</span></>}
          {semLabel  && <><span className="sep">›</span><span>{semLabel}</span></>}
          <span className="sep">›</span>
          <span>{courseName}</span>
        </div>
        <div className="page-header-row">
          <h2>PROJECTS</h2>
          <button className="pill-btn" onClick={() => { setModal(true); setSaveErr(''); }}>+ New Project</button>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}

      {loading ? <Spinner large center /> : projects.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">□</span>
          <span>No projects yet</span>
        </div>
      ) : (
        <div className="cards-grid">
          {projects.map(p => (
            <div
              key={p.project_id}
              className="brutal-card clickable"
              onClick={() => navigate(`/projects/${p.project_id}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="card-title" style={{ flex: 1 }}>{p.title || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Untitled</span>}</div>
                {p.students?.length > 0 && (
                  <span className="badge">{p.students.length} members</span>
                )}
              </div>
              {p.guide && <div className="card-meta" style={{ marginTop: 6 }}>Guide: {p.guide}</div>}
              {p.github && (
                <div className="card-meta" style={{ marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  ⎆ {p.github}
                </div>
              )}
              <div className="card-chevron">→</div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModal(false)} title="New Project">
        <form onSubmit={handleCreate}>
          {saveErr && <div className="alert error">{saveErr}</div>}
          <label className="field-label">Project Title (optional)</label>
          <input className="text-input" value={form.title} onChange={field('title')} placeholder="e.g. Image Classifier" />
          <label className="field-label">GitHub URL (optional)</label>
          <input className="text-input" value={form.github} onChange={field('github')} placeholder="https://github.com/..." />
          <label className="field-label">Guide / Mentor (optional)</label>
          <input className="text-input" value={form.guide} onChange={field('guide')} placeholder="Dr. Smith" />
          <div className="modal-actions">
            <button type="button" className="pill-btn outline" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="pill-btn" disabled={saving}>{saving ? 'Creating…' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
