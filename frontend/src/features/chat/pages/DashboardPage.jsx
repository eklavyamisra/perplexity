import { useState, useEffect, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../../auth/hook/UseAuth.jsx';
import { initializeSocket } from '../services/chat.socket.js';
import Sidebar from '../components/Sidebar.jsx';
import Composer from '../components/Composer.jsx';
import Turn from '../components/Turn.jsx';
import { MenuIcon, PlusIcon } from '../components/Icons.jsx';
import '../styles/dashboard.css'

const SUGGESTIONS = [
  { tag: 'Science', q: 'Why does time slow down near a black hole?' },
  { tag: 'Tech', q: 'What are the biggest AI breakthroughs this year?' },
  { tag: 'Money', q: 'Index funds vs. ETFs: what actually differs?' },
  { tag: 'Culture', q: 'Explain the lasting influence of Bauhaus design' },
];

// Pair each question with the answer that follows it.
const toTurns = (messages = []) => {
  const turns = [];
  messages.forEach(msg => {
    if (msg.sender === 'user') turns.push({ id: msg.id, question: msg.content, answer: null });
    else if (turns.length) turns[turns.length - 1].answer = msg;
    else turns.push({ id: msg.id, question: '', answer: msg });
  });
  return turns;
};

const greeting = () => {
  const h = new Date().getHours();
  if (h < 5) return 'Up late';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const DashboardPage = () => {
  const user = useSelector(state => state.auth.user);
  const { chats, currentChatId, pending, loadingMessages, error } = useSelector(state => state.chat);
  const { loadChats, openChat, newChat, ask, removeThread } = useChat();
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState('');
  const [railOpen, setRailOpen] = useState(false);
  const scrollRef = useRef(null);
  const composerRef = useRef(null);
  const heroRef = useRef(null);

  const current = currentChatId ? chats[currentChatId] : null;
  const turns = useMemo(() => toTurns(current?.messages), [current?.messages]);
  const showPending = pending && pending.chatId === currentChatId;
  const isEmpty = !currentChatId && !showPending;

  useEffect(() => {
    initializeSocket();
    loadChats();
  }, [loadChats]);

  // Bring the newest question to the top, so a long answer reads from its start.
  useEffect(() => {
    const el = scrollRef.current;
    const last = el?.querySelector('.turn:last-of-type');
    if (el && last) el.scrollTo({ top: last.offsetTop - 24, behavior: 'smooth' });
  }, [currentChatId, turns.length, showPending]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        newChat();
        setRailOpen(false);
        requestAnimationFrame(() => composerRef.current?.focus());
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [newChat]);

  // Spotlight that trails the pointer across the empty-state hero.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${e.clientX - r.left}px`);
      hero.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    hero.addEventListener('pointermove', onMove);
    return () => hero.removeEventListener('pointermove', onMove);
  }, [isEmpty]);

  const submit = async (text = inputValue) => {
    const message = text.trim();
    if (!message || pending) return;
    setInputValue('');
    const ok = await ask(message);
    if (!ok) setInputValue(message);
  };

  const handleSelect = (chatId) => {
    openChat(chatId);
    setRailOpen(false);
  };

  const handleNew = () => {
    newChat();
    setRailOpen(false);
    setInputValue('');
    requestAnimationFrame(() => composerRef.current?.focus());
  };

  const handleDelete = async (chatId) => {
    const title = chats[chatId]?.title || 'this thread';
    if (window.confirm(`Delete “${title}”? This can't be undone.`)) {
      await removeThread(chatId);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  const firstName = user?.username || 'there';

  return (
    <div className="app">
      <Sidebar
        open={railOpen}
        onClose={() => setRailOpen(false)}
        chats={chats}
        currentChatId={currentChatId}
        onSelect={handleSelect}
        onNew={handleNew}
        onDelete={handleDelete}
        user={user}
        onLogout={handleLogout}
      />
      <div
        className={`rail-backdrop ${railOpen ? 'is-open' : ''}`}
        onClick={() => setRailOpen(false)}
        aria-hidden="true"
      />

      <main className="stage">
        <header className="topbar">
          <button className="icon-btn topbar__menu" onClick={() => setRailOpen(true)} aria-label="Open sidebar">
            <MenuIcon />
          </button>
          <div className="topbar__crumb mono-label">
            <span>Threads</span>
            <span className="topbar__sep">/</span>
            <span className="topbar__title">{current?.title || (showPending ? 'New thread' : 'Home')}</span>
          </div>
          {!isEmpty && (
            <button className="icon-btn" onClick={handleNew} aria-label="New thread" title="New thread">
              <PlusIcon />
            </button>
          )}
        </header>

        {isEmpty ? (
          <section className="hero" ref={heroRef}>
            <div className="hero__spot" aria-hidden="true" />
            <div className="hero__inner">
              <p className="mono-label hero__eyebrow fade-up" style={{ '--d': 100 }}>
                {greeting()}, {firstName}
              </p>
              <h1 className="hero__title">
                <span className="reveal-line" style={{ '--i': 0 }}><span>Where knowledge</span></span>
                <span className="reveal-line" style={{ '--i': 1 }}><span><em>begins.</em></span></span>
              </h1>

              <div className="fade-up" style={{ '--d': 450 }}>
                <Composer
                  ref={composerRef}
                  large
                  value={inputValue}
                  onChange={setInputValue}
                  onSubmit={() => submit()}
                  busy={!!pending}
                  placeholder="Ask anything…"
                />
              </div>

              {error && <p className="stage__error" role="alert">{error}</p>}

              <div className="suggestions">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={s.q}
                    className="suggestion fade-up"
                    style={{ '--d': 600 + i * 80 }}
                    onClick={() => submit(s.q)}
                  >
                    <span className="suggestion__top mono-label">
                      <span>0{i + 1}</span>
                      <span>{s.tag}</span>
                    </span>
                    <span className="suggestion__q">{s.q}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="thread-view" ref={scrollRef}>
              <div className="thread-view__inner">
                {loadingMessages && !turns.length && (
                  <div className="thread-view__loading"><span className="spinner" /></div>
                )}
                {turns.map((t, i) => (
                  <Turn key={t.id} index={i} question={t.question} answer={t.answer} />
                ))}
                {showPending && (
                  <Turn index={turns.length} question={pending.content} pending />
                )}
                {error && <p className="stage__error" role="alert">{error}</p>}
              </div>
            </section>

            <div className="dock">
              <Composer
                ref={composerRef}
                value={inputValue}
                onChange={setInputValue}
                onSubmit={() => submit()}
                busy={!!pending}
                placeholder="Ask a follow-up…"
              />
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default DashboardPage
