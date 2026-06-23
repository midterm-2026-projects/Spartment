export default function Button({ onSubmit }) {
  return (
    <>
      <button onClick={onSubmit}>
        Sign In
      </button>

      <button onClick={onSubmit}>
        Continue as guest
      </button>
    </>
  );
}
