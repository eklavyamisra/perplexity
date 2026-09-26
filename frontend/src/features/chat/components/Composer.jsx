import { forwardRef, useLayoutEffect, useRef, useImperativeHandle } from 'react';
import { ArrowUpIcon, GlobeIcon } from './Icons.jsx';

const Composer = forwardRef(({ value, onChange, onSubmit, busy, placeholder, large }, ref) => {
  const textareaRef = useRef(null);
  useImperativeHandle(ref, () => textareaRef.current);

  // Grow with the content up to a cap, then scroll.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [value]);

  const canSend = value.trim().length > 0 && !busy;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (canSend) onSubmit();
    }
  };

  return (
    <form
      className={`composer ${large ? 'composer--large' : ''}`}
      onSubmit={(e) => {
        e.preventDefault();
        if (canSend) onSubmit();
      }}
    >
      <textarea
        ref={textareaRef}
        className="composer__input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        aria-label="Ask a question"
      />
      <div className="composer__bar">
        <span className="composer__chip">
          <GlobeIcon />
          Web
        </span>
        <span className="composer__hint mono-label">Shift + Enter for a new line</span>
        <button type="submit" className="composer__send" disabled={!canSend} aria-label="Send">
          {busy ? <span className="spinner" /> : <ArrowUpIcon />}
        </button>
      </div>
    </form>
  );
});

Composer.displayName = 'Composer';

export default Composer;
