import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { getCourses, createCourse } from '../api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';

export default function CoursesPage() {
  const { semId }  = useParams();
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const { role }   = useAuth();
  const batchName  = state?.batchName || '';
  const semLabel   = state?.semLabel  || 'Semester';

  const [courses, setCourses]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [modalOpen, setModal]   = useState(false);
  const [courseName, setName]   = useState('');
  const [courseCode, setCode]   = useState('');
  const [saving, setSaving]     = useState(false);
  const [saveErr, setSaveErr]   = useState('');

  async function load() {
    try {
      setCourses(await getCourses(semId) || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [semId]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!courseName.trim()) return;
    setSaving(true); setSaveErr('');
    try {
      await createCourse(semId, courseName.trim(), courseCode.trim() || undefined);
      setModal(false); setName(''); setCode('');
      await load();
    } catch (e) { setSaveErr(e.message); }
    finally { setSaving(false); }
  }

  const canCreate = role === 'admin' || role === 'lecturer';

  return (
    <>
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/batches">Batches</Link>
          <span className="sep">›</span>
          <Link to={`/batches/${state?.batchId}/semesters`} state={state}>{batchName || 'Batch'}</Link>
          <span className="sep">›</span>
          <span>{semLabel}</span>
        </div>
        <div className="page-header-row">
          <h2>COURSES</h2>
          {canCreate && (
            <button className="pill-btn" onClick={() => { setModal(true); setSaveErr(''); }}>+ New Course</button>
          )}
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}

      {loading ? <Spinner large center /> : courses.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">□</span>
          <span>No courses yet</span>
        </div>
      ) : (
        <div className="cards-grid">
          {courses.map(c => (
            <div
              key={c.course_id}
              className="brutal-card clickable"
              onClick={() => navigate(`/courses/${c.course_id}/projects`, {
                state: { courseName: c.course_name, courseCode: c.course_code, semLabel, batchName, batchId: state?.batchId },
              })}
            >
              {c.course_code && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent)', marginBottom: 4 }}>
                  {c.course_code}
                </div>
              )}
              <div className="card-title">{c.course_name}</div>
              <div className="card-chevron">→</div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModal(false)} title="New Course">
        <form onSubmit={handleCreate}>
          {saveErr && <div className="alert error">{saveErr}</div>}
          <label className="field-label">Course Code <span style={{ color: 'var(--text-muted)' }}>(optional)</span></label>
          <input className="text-input" value={courseCode} onChange={e => setCode(e.target.value)}
            placeholder="e.g. 21CS55" />
          <label className="field-label">Course Title</label>
          <input className="text-input" value={courseName} onChange={e => setName(e.target.value)}
            placeholder="e.g. Machine Learning" required />
          <div className="modal-actions">
            <button type="button" className="pill-btn outline" onClick={() => setModal(false)}>Cancel</button>
            <button type="submit" className="pill-btn" disabled={saving}>{saving ? 'Creating…' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </>
  );
}
