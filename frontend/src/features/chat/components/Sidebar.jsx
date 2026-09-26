import Logo from '../../../components/Logo.jsx';
import { PlusIcon, TrashIcon, CloseIcon, LogoutIcon } from './Icons.jsx';

const Sidebar = ({ open, onClose, chats, currentChatId, onSelect, onNew, onDelete, user, onLogout }) => {
  const list = Object.values(chats).sort(
    (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
  );
  const name = user?.username || 'Guest';

  return (
    <aside className={`rail ${open ? 'is-open' : ''}`} aria-label="Threads">
      <div className="rail__head">
        <Logo />
        <button className="icon-btn rail__close" onClick={onClose} aria-label="Close sidebar">
          <CloseIcon />
        </button>
      </div>

      <button className="new-thread" onClick={onNew}>
        <span className="new-thread__icon"><PlusIcon /></span>
        <span>New thread</span>
        <kbd>Ctrl K</kbd>
      </button>

      <div className="rail__label mono-label">
        <span>Library</span>
        <span>{String(list.length).padStart(2, '0')}</span>
      </div>

      <nav className="threads">
        {list.length === 0 && (
          <p className="threads__empty">Your questions will collect here.</p>
        )}
        {list.map((chat, i) => (
          <div
            key={chat._id}
            className={`thread ${currentChatId === chat._id ? 'is-active' : ''}`}
            style={{ '--d': Math.min(i, 12) * 40 }}
          >
            <button className="thread__main" onClick={() => onSelect(chat._id)}>
              <span className="thread__n">{String(i + 1).padStart(2, '0')}</span>
              <span className="thread__title">{chat.title}</span>
            </button>
            <button
              className="thread__delete"
              onClick={() => onDelete(chat._id)}
              aria-label={`Delete ${chat.title}`}
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </nav>

      <div className="rail__foot">
        <div className="avatar" aria-hidden="true">{name.charAt(0).toUpperCase()}</div>
        <div className="rail__user">
          <span className="rail__name">{name}</span>
          <span className="rail__email">{user?.email}</span>
        </div>
        <button className="icon-btn" onClick={onLogout} aria-label="Sign out" title="Sign out">
          <LogoutIcon />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
