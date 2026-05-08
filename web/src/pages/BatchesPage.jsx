import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBatches, createBatch } from '../api';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';

export default function BatchesPage() {
  const navigate = useNavigate();
  const [batches, setBatches]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName]           = useState('');
  const [year, setYear]           = useState('');
  const [saving, setSaving]       = useState(false);
  const [saveErr, setSaveErr]     = useState('');

  async function load() {
    try {
      const data = await getBatches();
      setBatches(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true); setSaveErr('');
    try {
      await createBatch(name.trim(), year.trim());
      setModalOpen(false); setName(''); setYear('');
      await load();
    } catch (e) {
      setSaveErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <div className="eyebrow">Project Tracker</div>
            <h2>BATCHES</h2>
          </div>
          <button className="pill-btn" onClick={() => { setModalOpen(true); setSaveErr(''); }}>
            + New Batch
          </button>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}

      {loading ? <Spinner large center /> : batches.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">□</span>
          <span>No batches yet — create the first one</span>
        </div>
      ) : (
        <div className="cards-grid">
          {batches.map(b => (
            <div
              key={b.batch_id}
              className="brutal-card clickable"
              onClick={() => navigate(`/batches/${b.batch_id}/semesters`, { state: { batchName: b.batch_name } })}
            >
              <div className="card-title">{b.batch_name}</div>
              {b.year && <div className="card-meta">Batch of {b.year}</div>}
              <div className="card-chevron">→</div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Batch">
        <form onSubmit={handleCreate}>
          {saveErr && <div className="alert error">{saveErr}</div>}
          <label className="field-label">Batch Name</label>
          <input className="text-input" value={name} onChange={e => setName(e.target.value)}
            placeholder="e.g. 2024-2028" required />
          <label className="field-label">Start Year (optional)</label>
          <input className="text-input" value={year} onChange={e => setYear(e.target.value)}
            placeholder="e.g. 2024" type="number" />
          <div className="modal-actions">
            <button type="button" className="pill-btn outline" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="pill-btn" disabled={saving}>
              {saving ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
