import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hook/UseAuth.jsx';
import '../styles/auth.css';
import { useSelector } from 'react-redux';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const user = useSelector((state) => state.auth.user); 
  const loading = useSelector((state) => state.auth.loading);

  const {loginUser } = useAuth();

  const navigate = useNavigate();

  if(!loading && user ) {
    navigate('/');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    await loginUser(email, password);

    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}
