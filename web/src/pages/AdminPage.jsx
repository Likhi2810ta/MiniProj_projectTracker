import { useEffect, useState } from 'react';
import {
  getAdminUsers, getAdminCourses, getAdminCoordinators, getAdminPending,
  assignCoordinator, removeCoordinator, approveUser, rejectUser,
} from '../api';
import Spinner from '../components/Spinner';

export default function AdminPage() {
  const [users, setUsers]         = useState([]);
  const [pending, setPending]     = useState([]);
  const [courses, setCourses]     = useState([]);
  const [coordinators, setCoords] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [actionUid, setActionUid] = useState(''); // which user is being approved/rejected

  // Assign form
  const [selUser, setSelUser]     = useState('');
  const [selCourse, setSelCourse] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [assignErr, setAssignErr] = useState('');

  async function load() {
    setLoading(true); setError('');
    try {
      const [u, p, c, co] = await Promise.all([
        getAdminUsers(),
        getAdminPending(),
        getAdminCourses(),
        getAdminCoordinators(),
      ]);
      setUsers(u || []);
      setPending(p || []);
      setCourses(c || []);
      setCoords(co || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleAssign(e) {
    e.preventDefault();
    if (!selUser || !selCourse) return;
    setAssigning(true); setAssignErr('');
    try {
      await assignCoordinator(selUser, selCourse);
      setSelUser(''); setSelCourse('');
      await load();
    } catch (e) { setAssignErr(e.message); }
    finally { setAssigning(false); }
  }

  async function handleRemove(course_id, user_id) {
    try {
      await removeCoordinator(course_id, user_id);
      await load();
    } catch (e) { setError(e.message); }
  }

  async function handleApprove(userId) {
    setActionUid(userId);
    try { await approveUser(userId); await load(); }
    catch (e) { setError(e.message); }
    finally { setActionUid(''); }
  }

  async function handleReject(userId) {
    if (!window.confirm('Reject and permanently delete this account?')) return;
    setActionUid(userId);
    try { await rejectUser(userId); await load(); }
    catch (e) { setError(e.message); }
    finally { setActionUid(''); }
  }

  if (loading) return <Spinner large center />;

  const lecturers = users.filter(u => u.role === 'lecturer');
  const students  = users.filter(u => u.role === 'student');

  return (
    <>
      <div className="page-header">
        <div className="eyebrow">Administration</div>
        <h2>ADMIN PANEL</h2>
      </div>

      {error && <div className="alert error">{error}</div>}

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
        {[
          { label: 'Pending approval', value: pending.length, highlight: pending.length > 0 },
          { label: 'Lecturers', value: lecturers.length },
          { label: 'Students', value: students.length },
          { label: 'Courses', value: courses.length },
          { label: 'Coordinator assignments', value: coordinators.length },
        ].map(s => (
          <div key={s.label} className="brutal-card" style={{ minWidth: 140, textAlign: 'center', ...(s.highlight ? { borderColor: 'var(--danger)' } : {}) }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: s.highlight ? 'var(--danger)' : 'var(--accent)', fontWeight: 800 }}>
              {s.value}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: 4 }}>
              {s.label.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Pending Approvals */}
      <section style={{ marginBottom: 40 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          Pending Approvals
          {pending.length > 0 && (
            <span style={{ background: 'var(--danger)', color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', padding: '2px 8px', borderRadius: 4 }}>
              {pending.length} waiting
            </span>
          )}
        </h3>
        {pending.length === 0 ? (
          <div className="empty-state"><span>No pending accounts.</span></div>
        ) : (
          <div className="brutal-card dark" style={{ padding: '4px 0' }}>
            <table className="students-table">
              <thead>
                <tr><th>Email</th><th>Role</th><th>Requested</th><th></th></tr>
              </thead>
              <tbody>
                {pending.map(u => (
                  <tr key={u.id}>
                    <td className="mono">{u.email}</td>
                    <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent)' }}>{u.role}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleApprove(u.id)}
                          disabled={actionUid === u.id}
                          style={{ background: 'var(--accent)', border: 'none', borderRadius: 4, color: 'var(--bg)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', padding: '4px 10px', cursor: 'pointer', fontWeight: 700 }}
                        >
                          {actionUid === u.id ? '…' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(u.id)}
                          disabled={actionUid === u.id}
                          style={{ background: 'none', border: '1px solid var(--danger)', borderRadius: 4, color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', padding: '4px 10px', cursor: 'pointer' }}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Assign coordinator */}
      <section style={{ marginBottom: 40 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: 16 }}>
          Assign Coordinator
        </h3>
        <div className="brutal-card">
          {assignErr && <div className="alert error">{assignErr}</div>}
          <form onSubmit={handleAssign} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label className="field-label">Lecturer</label>
              <select className="text-input" value={selUser} onChange={e => setSelUser(e.target.value)} required
                style={{ color: selUser ? 'var(--text)' : 'var(--text-muted)' }}>
                <option value="">Select lecturer…</option>
                {lecturers.map(u => (
                  <option key={u.id} value={u.id}>{u.email}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <label className="field-label">Course</label>
              <select className="text-input" value={selCourse} onChange={e => setSelCourse(e.target.value)} required
                style={{ color: selCourse ? 'var(--text)' : 'var(--text-muted)' }}>
                <option value="">Select course…</option>
                {courses.map(c => {
                  const sem = c.semester;
                  const batch = sem?.batch;
                  const label = [
                    c.course_code,
                    c.course_name,
                    batch?.batch_name && `(${batch.batch_name} Sem ${sem?.sem_number})`,
                  ].filter(Boolean).join(' — ');
                  return <option key={c.course_id} value={c.course_id}>{label}</option>;
                })}
              </select>
            </div>
            <button className="pill-btn" type="submit" disabled={assigning} style={{ marginBottom: 0 }}>
              {assigning ? 'Assigning…' : 'Assign'}
            </button>
          </form>
        </div>
      </section>

      {/* Current assignments */}
      <section style={{ marginBottom: 40 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: 16 }}>
          Current Coordinator Assignments
        </h3>
        {coordinators.length === 0 ? (
          <div className="empty-state"><span>No assignments yet.</span></div>
        ) : (
          <div className="brutal-card dark" style={{ padding: '4px 0' }}>
            <table className="students-table">
              <thead>
                <tr>
                  <th>Lecturer</th>
                  <th>Course</th>
                  <th>Code</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {coordinators.map((c, i) => (
                  <tr key={i}>
                    <td className="mono">{c.email || c.user_id.slice(0, 8) + '…'}</td>
                    <td>{c.course_name || c.course_id}</td>
                    <td className="mono">{c.course_code || '—'}</td>
                    <td>
                      <button
                        onClick={() => handleRemove(c.course_id, c.user_id)}
                        style={{
                          background: 'none', border: '1px solid var(--danger)', borderRadius: 4,
                          color: 'var(--danger)', fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                          padding: '3px 8px', cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Users list */}
      <section style={{ marginBottom: 40 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: 16 }}>
          Lecturers ({lecturers.length})
        </h3>
        {lecturers.length === 0 ? (
          <div className="empty-state"><span>No lecturers registered yet.</span></div>
        ) : (
          <div className="brutal-card dark" style={{ padding: '4px 0' }}>
            <table className="students-table">
              <thead><tr><th>Email</th><th>Role</th></tr></thead>
              <tbody>
                {lecturers.map(u => (
                  <tr key={u.id}>
                    <td className="mono">{u.email}</td>
                    <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent)' }}>{u.role}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text)', marginBottom: 16 }}>
          Students ({students.length})
        </h3>
        {students.length === 0 ? (
          <div className="empty-state"><span>No students registered yet.</span></div>
        ) : (
          <div className="brutal-card dark" style={{ padding: '4px 0' }}>
            <table className="students-table">
              <thead><tr><th>Email</th></tr></thead>
              <tbody>
                {students.map(u => (
                  <tr key={u.id}><td className="mono">{u.email}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
