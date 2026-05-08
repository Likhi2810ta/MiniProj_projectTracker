import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { getSemesters, createSemester } from '../api';
import Spinner from '../components/Spinner';

const ALL_SEMS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function SemestersPage() {
  const { batchId } = useParams();
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const batchName   = state?.batchName || 'Batch';

  const [existing, setExisting] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [creating, setCreating] = useState(null);

  async function load() {
    try {
      const data = await getSemesters(batchId);
      setExisting(data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [batchId]);

  async function handleSemClick(num) {
    const found = existing.find(s => s.sem_number === num);
    if (found) {
      navigate(`/semesters/${found.semester_id}/courses`, {
        state: { semLabel: `Sem ${num}`, batchName },
      });
      return;
    }
    setCreating(num);
    try {
      const created = await createSemester(batchId, num);
      navigate(`/semesters/${created.semester_id}/courses`, {
        state: { semLabel: `Sem ${num}`, batchName },
      });
    } catch (e) {
      setError(e.message);
      setCreating(null);
    }
  }

  return (
    <>
      <div className="page-header">
        <div className="breadcrumb">
          <Link to="/batches">Batches</Link>
          <span className="sep">›</span>
          <span>{batchName}</span>
        </div>
        <h2>SEMESTERS</h2>
      </div>

      {error && <div className="alert error">{error}</div>}

      {loading ? <Spinner large center /> : (
        <div className="sem-grid">
          {ALL_SEMS.map(num => {
            const exists = existing.find(s => s.sem_number === num);
            const busy   = creating === num;
            return (
              <button
                key={num}
                className={`sem-chip${exists ? ' exists' : ''}`}
                onClick={() => handleSemClick(num)}
                disabled={!!creating}
              >
                {busy
                  ? <span className="spinner" />
                  : <span className="sem-num">{num}</span>
                }
                <span className="sem-label">{exists ? 'open' : 'create'}</span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
