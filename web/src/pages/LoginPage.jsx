import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, requestOtp, verifyOtp } from '../auth';
import { getMe } from '../api';
import { useAuth } from '../context/AuthContext';

const STUDENT_EMAIL_RE = /^[a-zA-Z0-9]+@dsce\.edu\.in$/i;

// step: 'form' → 'otp' → 'done'
export default function LoginPage() {
  const navigate    = useNavigate();
  const { refresh } = useAuth();

  const [tab, setTab]       = useState('student'); // 'student' | 'staff'
  const [mode, setMode]     = useState('login');   // 'login'  | 'register'
  const [step, setStep]     = useState('form');    // 'form'   | 'otp' | 'done'

  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp]         = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [info, setInfo]       = useState('');

  function switchTab(t) {
    setTab(t); setMode('login'); setStep('form');
    setEmail(''); setPassword(''); setOtp('');
    setError(''); setInfo('');
  }

  function switchMode() {
    setMode(m => m === 'login' ? 'register' : 'login');
    setStep('form'); setOtp('');
    setError(''); setInfo('');
  }

  // ── Step 1: Sign in or send OTP ────────────────────────────────────────────
  async function handleForm(e) {
    e.preventDefault();
    setError(''); setInfo('');

    if (tab === 'student' && !STUDENT_EMAIL_RE.test(email)) {
      setError('Student email must be in the format: 1ds24ai023@dsce.edu.in');
      return;
    }
    if (tab === 'staff' && STUDENT_EMAIL_RE.test(email)) {
      setError('Use the Student tab to sign in with a college email.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        await refresh();
        const profile = await getMe();
        localStorage.setItem('user_role', profile.role);
        navigate(profile.role === 'admin' ? '/admin' : '/batches');
      } else {
        // Register: send OTP first
        await requestOtp(email, password);
        setStep('otp');
        setInfo(`OTP sent to ${email}. Check your inbox (and spam folder).`);
      }
    } catch (err) {
      const msg = err.message || '';
      if (msg.toLowerCase().includes('pending')) {
        setError('Your account is pending admin approval. You will be notified once approved.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: Verify OTP ─────────────────────────────────────────────────────
  async function handleOtp(e) {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await verifyOtp(email, otp);
      setStep('done');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function resendOtp() {
    setError(''); setInfo('');
    setLoading(true);
    try {
      await requestOtp(email, password);
      setInfo('New OTP sent. Check your inbox.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="login-page">
      <div className="login-box">
        <div className="eyebrow">Project Tracker</div>

        {/* ── Done screen ── */}
        {step === 'done' && (
          <>
            <h1>ACCOUNT CREATED</h1>
            <div className="alert success" style={{ marginBottom: 20 }}>
              ✓ Email verified. Your account is pending admin approval.
            </div>
            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: 20 }}>
              You will be able to sign in once an admin approves your account.
            </p>
            <button className="pill-btn w-full" style={{ justifyContent: 'center' }}
              onClick={() => { setStep('form'); setMode('login'); setOtp(''); setInfo(''); }}>
              Go to Sign In
            </button>
          </>
        )}

        {/* ── OTP screen ── */}
        {step === 'otp' && (
          <>
            <h1>VERIFY EMAIL</h1>
            {info  && <div className="alert success">{info}</div>}
            {error && <div className="alert error">{error}</div>}
            <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginBottom: 16 }}>
              Enter the 6-digit code sent to <strong style={{ color: 'var(--accent)' }}>{email}</strong>
            </p>
            <form onSubmit={handleOtp}>
              <label className="field-label">One-Time Password</label>
              <input
                className="text-input"
                type="text"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="6-digit code"
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
                required
                style={{ letterSpacing: '0.3em', fontSize: '1.4rem', textAlign: 'center', marginBottom: 20 }}
              />
              <button className="pill-btn w-full" type="submit" disabled={loading || otp.length < 6}
                style={{ justifyContent: 'center' }}>
                {loading ? 'Verifying…' : 'Verify & Create Account'}
              </button>
            </form>
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <button onClick={resendOtp} disabled={loading}
                style={{ background: 'none', border: 'none', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textDecoration: 'underline', cursor: 'pointer' }}>
                Resend OTP
              </button>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', margin: '0 8px' }}>·</span>
              <button onClick={() => { setStep('form'); setOtp(''); setError(''); setInfo(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', textDecoration: 'underline', cursor: 'pointer' }}>
                Back
              </button>
            </div>
          </>
        )}

        {/* ── Main form ── */}
        {step === 'form' && (
          <>
            <h1>{tab === 'student' ? 'STUDENT' : 'STAFF'} {mode === 'login' ? 'SIGN IN' : 'REGISTER'}</h1>

            {/* Tab switcher */}
            <div style={{ display: 'flex', marginBottom: 24, border: '2px solid var(--accent)', borderRadius: 6, overflow: 'hidden' }}>
              {['student', 'staff'].map(t => (
                <button key={t} onClick={() => switchTab(t)} style={{
                  flex: 1, padding: '9px 0',
                  background: tab === t ? 'var(--accent)' : 'transparent',
                  color: tab === t ? 'var(--bg)' : 'var(--accent)',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                  fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                  {t === 'student' ? '▣ Student' : '⚙ Staff / Admin'}
                </button>
              ))}
            </div>

            {tab === 'student' && (
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 16, padding: '8px 10px', border: '1px solid var(--border)', borderRadius: 4 }}>
                Use your college email: <span style={{ color: 'var(--accent)' }}>1ds24ai023@dsce.edu.in</span>
              </div>
            )}

            {error && <div className="alert error">{error}</div>}
            {info  && <div className="alert success">{info}</div>}

            <form onSubmit={handleForm}>
              <label className="field-label">Email</label>
              <input className="text-input" type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={tab === 'student' ? '1ds24ai023@dsce.edu.in' : 'lecturer@example.com'}
                autoComplete="email" required />

              <label className="field-label">Password</label>
              <input className="text-input" type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                minLength={mode === 'register' ? 6 : undefined}
                required style={{ marginBottom: 24 }} />

              <button className="pill-btn w-full" type="submit" disabled={loading}
                style={{ justifyContent: 'center' }}>
                {loading
                  ? (mode === 'login' ? 'Signing in…' : 'Sending OTP…')
                  : (mode === 'login' ? 'Sign In' : 'Send Verification Code')}
              </button>
            </form>

            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              </span>
              <button onClick={switchMode} style={{
                background: 'none', border: 'none', color: 'var(--accent)',
                fontFamily: 'var(--font-mono)', fontSize: '0.72rem',
                textDecoration: 'underline', cursor: 'pointer',
              }}>
                {mode === 'login' ? 'Register' : 'Sign In'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
