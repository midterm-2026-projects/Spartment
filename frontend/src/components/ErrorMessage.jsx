export default function ErrorMessage({
  message = "Something went wrong.",
}) {
  return (
    <div>
      <p>{message}</p>
    </div>
  );
}