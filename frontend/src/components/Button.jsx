export default function Button({ onSubmit, onGuest }) {
  return (
    <div className="auth-actions">
      <button className="button button--primary" type="button" onClick={onSubmit}>
        <span>Sign In</span>
        <span aria-hidden="true">→</span>
      </button>

      <div className="auth-divider" aria-hidden="true">
        <span />
        <small>OR</small>
        <span />
      </div>

      <button className="button button--secondary" type="button" onClick={onGuest}>
        Continue as guest
      </button>
    </div>
  );
}
