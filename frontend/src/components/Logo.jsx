import { Link } from 'react-router-dom';

export const LogoMark = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2v20M4 6.5l8 5.5 8-5.5M4 17.5l8-5.5 8 5.5M4 6.5v11M20 6.5v11" />
  </svg>
);

const Logo = ({ to = '/dashboard' }) => (
  <Link className="wordmark" to={to}>
    <LogoMark />
    <span>perplexity</span>
  </Link>
);

export default Logo;
