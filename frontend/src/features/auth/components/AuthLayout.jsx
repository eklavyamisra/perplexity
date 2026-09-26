import { useEffect, useRef } from 'react';
import Logo from '../../../components/Logo.jsx';

const QUESTIONS = [
  'Why is the sky blue at noon but red at dusk?',
  'What changed in the latest React release?',
  'How do black holes evaporate?',
  'Best way to learn system design in 2026',
  'Explain CRISPR like I am twelve',
  'Who actually invented the telephone?',
];

const AuthLayout = ({ index, eyebrow, children }) => {
  const heroRef = useRef(null);

  // The orb drifts toward the pointer; CSS reads the vars so React never re-renders.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      hero.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    hero.addEventListener('pointermove', onMove);
    return () => hero.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <div className="auth">
      <aside className="auth-hero" ref={heroRef}>
        <div className="auth-hero__orb" aria-hidden="true" />
        <div className="auth-hero__grid" aria-hidden="true" />

        <header className="auth-hero__top">
          <Logo />
          <span className="mono-label">Answer engine / Est. 2026</span>
        </header>

        <h1 className="auth-hero__title">
          <span className="reveal-line" style={{ '--i': 0 }}><span>Ask</span></span>
          <span className="reveal-line" style={{ '--i': 1 }}><span><em>anything.</em></span></span>
          <span className="reveal-line" style={{ '--i': 2 }}><span>Know what's</span></span>
          <span className="reveal-line" style={{ '--i': 3 }}><span><em>actually</em> true.</span></span>
        </h1>

        <div className="auth-hero__bottom">
          <p className="auth-hero__lede fade-up" style={{ '--d': 700 }}>
            Real-time answers, grounded in the open web and cited line by line.
            No ten blue links. Just the answer, and where it came from.
          </p>

          <div className="marquee" aria-hidden="true">
            <div className="marquee__track">
              {[...QUESTIONS, ...QUESTIONS].map((q, i) => (
                <span key={i} className="marquee__item">
                  <span className="marquee__dot" />
                  {q}
                </span>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <main className="auth-panel">
        <div className="auth-panel__inner">
          <div className="auth-panel__eyebrow fade-up" style={{ '--d': 200 }}>
            <span className="mono-label">({index})</span>
            <span className="mono-label">{eyebrow}</span>
          </div>
          {children}
        </div>
        <footer className="auth-panel__foot mono-label">
          <span>© {new Date().getFullYear()} Perplexity</span>
          <span>Privacy — Terms</span>
        </footer>
      </main>
    </div>
  );
};

export default AuthLayout;
