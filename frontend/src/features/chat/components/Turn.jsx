import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CopyIcon, CheckIcon, SparkIcon, GlobeIcon, ArrowUpRightIcon } from './Icons.jsx';

const hostname = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

// Turn bare [n] citations into links the renderer can style as chips.
const linkCitations = (text, count) =>
  count ? text.replace(/\[(\d{1,2})\](?!\()/g, (m, n) => (n <= count ? `[${n}](#cite-${n})` : m)) : text;

const Sources = ({ sources }) => (
  <section className="turn__block">
    <h3 className="turn__label mono-label"><GlobeIcon /> Sources</h3>
    <div className="sources">
      {sources.map((s, i) => (
        <a
          key={s.url + i}
          className="source"
          href={s.url}
          target="_blank"
          rel="noreferrer"
          style={{ '--d': i * 70 }}
        >
          <span className="source__title">{s.title}</span>
          <span className="source__meta">
            <img
              src={`https://www.google.com/s2/favicons?domain=${hostname(s.url)}&sz=32`}
              alt=""
              width="14"
              height="14"
              loading="lazy"
            />
            <span>{hostname(s.url)}</span>
            <span className="source__n">{i + 1}</span>
          </span>
        </a>
      ))}
    </div>
  </section>
);

const Answer = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const sources = message.sources || [];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked (e.g. insecure context); nothing useful to show.
    }
  };

  const components = {
    a: ({ href, children }) => {
      if (href?.startsWith('#cite-')) {
        const n = Number(href.slice(6));
        const src = sources[n - 1];
        return (
          <a className="cite" href={src?.url} target="_blank" rel="noreferrer" title={src?.title}>
            {n}
          </a>
        );
      }
      return <a href={href} target="_blank" rel="noreferrer">{children}</a>;
    },
    table: ({ children }) => (
      <div className="prose__table"><table>{children}</table></div>
    ),
  };

  return (
    <>
      {sources.length > 0 && <Sources sources={sources} />}
      <section className="turn__block">
        <h3 className="turn__label mono-label"><SparkIcon /> Answer</h3>
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {linkCitations(message.content, sources.length)}
          </ReactMarkdown>
        </div>
        <div className="turn__actions">
          <button className="ghost-btn" onClick={copy}>
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          {sources[0] && (
            <a className="ghost-btn" href={sources[0].url} target="_blank" rel="noreferrer">
              <ArrowUpRightIcon /> Top source
            </a>
          )}
        </div>
      </section>
    </>
  );
};

const STEPS = ['Searching the web', 'Reading sources', 'Composing the answer'];

const Thinking = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="turn__block">
      <h3 className="turn__label mono-label"><SparkIcon /> Answer</h3>
      <ol className="thinking">
        {STEPS.map((label, i) => (
          <li key={label} className={i < step ? 'is-done' : i === step ? 'is-active' : ''}>
            <span className="thinking__dot" />
            <span className="thinking__text">{label}</span>
          </li>
        ))}
      </ol>
      <div className="skeleton" aria-hidden="true">
        <span style={{ width: '92%' }} />
        <span style={{ width: '78%' }} />
        <span style={{ width: '85%' }} />
        <span style={{ width: '40%' }} />
      </div>
    </section>
  );
};

const Turn = ({ question, answer, pending, index }) => (
  <article className="turn">
    <div className="turn__meta mono-label">
      <span>Q.{String(index + 1).padStart(2, '0')}</span>
      <span className="turn__rule" />
    </div>
    <h2 className="turn__question">{question}</h2>
    {pending ? <Thinking /> : answer && <Answer message={answer} />}
  </article>
);

export default Turn;
