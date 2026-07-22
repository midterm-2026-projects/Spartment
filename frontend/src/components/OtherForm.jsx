import { useState } from "react";
import { Actions } from "./CustomerServiceWindow";

export default function OtherForm({ onSubmit = () => {}, onBack = () => {}, loading = false }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const submit = (event) => {
    event.preventDefault();
    onSubmit({ subject, message });
  };
  return <form className="support-form" onSubmit={submit}>
    <h2 className="support-visually-hidden">Spartment Assistant</h2>
    <label>Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} required /></label>
    <label>Message<textarea value={message} onChange={(event) => setMessage(event.target.value)} required /></label>
    <Actions onBack={onBack} loading={loading} />
  </form>;
}
