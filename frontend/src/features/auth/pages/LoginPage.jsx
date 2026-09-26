import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../hook/UseAuth.jsx';
import { resendVerification } from '../services/auth.api.js';
import AuthLayout from '../components/AuthLayout.jsx';
import Field from '../components/Field.jsx';
import SubmitButton from '../components/SubmitButton.jsx';
import '../styles/auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');
  const { user, loading, error } = useSelector((state) => state.auth);
  const { loginUser, clearError } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    clearError();
    if (params.get('verified')) setNotice('Email verified. You can sign in now.');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotice('');
    setSubmitting(true);
    const ok = await loginUser(email, password);
    setSubmitting(false);
    if (ok) navigate('/dashboard');
  };

  const handleResend = async () => {
    try {
      await resendVerification(email);
      clearError();
      setNotice('A fresh verification link is on its way.');
    } catch (err) {
      setNotice(err.message);
    }
  };

  const unverified = error?.toLowerCase().includes('not verified');

  return (
    <AuthLayout index="01" eyebrow="Sign in">
      <h2 className="auth-title fade-up" style={{ '--d': 300 }}>
        Welcome <em>back.</em>
      </h2>
      <p className="auth-sub fade-up" style={{ '--d': 380 }}>
        Pick up every thread right where you left it.
      </p>

      {notice && <div className="auth-alert auth-alert--ok" role="status">{notice}</div>}
      {error && (
        <div className="auth-alert" role="alert">
          {error}
          {unverified && (
            <button type="button" className="auth-alert__action" onClick={handleResend}>
              Resend link
            </button>
          )}
        </div>
      )}

      <form className="auth-form fade-up" style={{ '--d': 460 }} onSubmit={handleSubmit}>
        <Field
          id="email"
          n="01"
          label="Email address"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Field
          id="password"
          n="02"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <SubmitButton loading={submitting}>Continue</SubmitButton>
      </form>

      <p className="auth-switch fade-up" style={{ '--d': 540 }}>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
