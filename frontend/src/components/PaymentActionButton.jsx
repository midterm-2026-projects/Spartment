export default function PaymentActionButton({
  label,
  onClick,
  type = "success",
}) {
  const style = {
    success: "bg-green-600 hover:bg-green-700",

    danger: "bg-red-600 hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={`
        text-white
        px-4
        py-2
        rounded-lg
        ${style[type]}
      `}
    >
      {label}
    </button>
  );
}
