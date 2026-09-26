const SubmitButton = ({ loading, children }) => (
  <button type="submit" className="cta" disabled={loading}>
    <span className="cta__label">{loading ? 'One moment' : children}</span>
    <span className="cta__icon" aria-hidden="true">
      {loading ? (
        <span className="spinner" />
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      )}
    </span>
  </button>
);

export default SubmitButton;
