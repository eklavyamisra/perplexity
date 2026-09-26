// Underline input with a floating label; the placeholder=" " trick drives :placeholder-shown.
const Field = ({ id, label, n, ...inputProps }) => (
  <div className="field">
    <span className="field__n">{n}</span>
    <input id={id} name={id} placeholder=" " {...inputProps} />
    <label htmlFor={id}>{label}</label>
    <span className="field__line" aria-hidden="true" />
  </div>
);

export default Field;
