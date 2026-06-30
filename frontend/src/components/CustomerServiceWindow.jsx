import OptionButtons from "./OptionButtons";

export default function CustomerServiceWindow({ onClose }) {
  return (
    <div>
      <h2>Spartment Assistant</h2>

      <button onClick={onClose}>X</button>

      <OptionButtons />
    </div>
  );
}