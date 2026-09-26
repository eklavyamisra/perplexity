import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuth } from '../hook/UseAuth.jsx';
import { resendVerification } from '../services/auth.api.js';
import AuthLayout from '../components/AuthLayout.jsx';
import Field from '../components/Field.jsx';
import SubmitButton from '../components/SubmitButton.jsx';
import '../styles/auth.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');
  const [sentTo, setSentTo] = useState(null);
  const [resent, setResent] = useState('');
  const { user, loading, error } = useSelector((state) => state.auth);
  const { registerUser, clearError } = useAuth();

  useEffect(() => {
    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    const data = await registerUser(formData.username, formData.email, formData.password);
    setSubmitting(false);
    if (data) setSentTo({ email: formData.email, emailSent: data.emailSent !== false });
  };

  const handleResend = async () => {
    try {
      await resendVerification(sentTo.email);
      setResent('Sent. Check your inbox again.');
    } catch (err) {
      setResent(err.message);
    }
  };

  if (sentTo) {
    return (
      <AuthLayout index="03" eyebrow="Verify">
        <h2 className="auth-title fade-up" style={{ '--d': 200 }}>
          Check your <em>inbox.</em>
        </h2>
        <p className="auth-sub fade-up" style={{ '--d': 280 }}>
          {sentTo.emailSent
            ? <>We sent a verification link to <strong>{sentTo.email}</strong>. Open it, then come back to sign in.</>
            : <>Your account is ready, but the verification email to <strong>{sentTo.email}</strong> didn't go out. Try sending it again.</>}
        </p>
        {resent && <div className="auth-alert auth-alert--ok" role="status">{resent}</div>}
        <div className="auth-actions fade-up" style={{ '--d': 360 }}>
          <Link to="/login" className="cta">
            <span className="cta__label">Go to sign in</span>
            <span className="cta__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
          <button type="button" className="link-btn" onClick={handleResend}>
            Resend email
          </button>
        </div>
      </AuthLayout>
    );
  }

  const shownError = localError || error;

  return (
    <AuthLayout index="02" eyebrow="Create account">
      <h2 className="auth-title fade-up" style={{ '--d': 300 }}>
        Start <em>asking.</em>
      </h2>
      <p className="auth-sub fade-up" style={{ '--d': 380 }}>
        One account. Every answer, sourced.
      </p>

      {shownError && <div className="auth-alert" role="alert">{shownError}</div>}

      <form className="auth-form fade-up" style={{ '--d': 460 }} onSubmit={handleSubmit}>
        <Field
          id="username"
          n="01"
          label="Username"
          autoComplete="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <Field
          id="email"
          n="02"
          label="Email address"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <Field
          id="password"
          n="03"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Field
          id="confirmPassword"
          n="04"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <p className="auth-hint">6+ characters with an uppercase letter, a lowercase letter and a number.</p>
        <SubmitButton loading={submitting}>Create account</SubmitButton>
      </form>

      <p className="auth-switch fade-up" style={{ '--d': 540 }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
