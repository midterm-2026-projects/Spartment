import { useState } from "react";
import { Actions } from "./CustomerServiceWindow";

export default function MaintenanceForm({ onSubmit = () => {}, onBack = () => {}, loading = false, user }) {
  const [roomNumber, setRoomNumber] = useState(user?.roomNumber || user?.room_number || "");
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const submit = (event) => {
    event.preventDefault();
    onSubmit({ roomNumber, issue, description });
  };
  return <form className="support-form" onSubmit={submit}>
    <h2 className="support-visually-hidden">Spartment Assistant</h2>
    <label>Room Number<input value={roomNumber} onChange={(event) => setRoomNumber(event.target.value)} required /></label>
    <label>Issue<input value={issue} onChange={(event) => setIssue(event.target.value)} placeholder="e.g. Leaking faucet" required /></label>
    <label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} required /></label>
    <Actions onBack={onBack} loading={loading} />
  </form>;
}
