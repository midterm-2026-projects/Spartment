import { useState } from "react";
import MaintenanceForm from "./MaintenanceForm";
import OptionButtons from "./OptionButtons";
import OtherForm from "./OtherForm";

function roomId(room) { return room?.id || room?.roomId || ""; }
function roomName(room) { return room?.roomNumber || room?.room_number || room?.name || ""; }

function InquirySupportForm({ rooms, selectedRoom, roomsLoading, roomsError, user, onBack, onSubmit, loading }) {
  const isTenant = String(user?.role || "").toLowerCase() === "tenant";
  const selectedRoomName = roomName(selectedRoom);
  const [form, setForm] = useState({
    name: isTenant ? user?.fullName || user?.full_name || user?.name || "" : "",
    email: isTenant ? user?.email || "" : "",
    contact: isTenant ? user?.contact || "" : "",
    roomId: roomId(selectedRoom),
    moveInDate: "",
    message: selectedRoomName ? `Room ${selectedRoomName}: ` : "",
  });
  const update = ({ target }) => setForm((value) => ({ ...value, [target.name]: target.value }));
  const available = rooms.filter((room) => ["available", "vacant"].includes(String(room.status).trim().toLowerCase()));
  const submit = (event) => { event.preventDefault(); onSubmit({ ...form, type: "Room Inquiry" }); };
  return <form className="support-form" onSubmit={submit}>
    <label>Full Name<input name="name" value={form.name} onChange={update} required /></label>
    <label>Email<input name="email" type="email" value={form.email} onChange={update} required /></label>
    <label>Contact<input name="contact" type="tel" value={form.contact} onChange={update} required /></label>
    <label>Preferred Room<select name="roomId" value={form.roomId} onChange={update} required disabled={roomsLoading}><option value="">{roomsLoading ? "Loading available rooms..." : available.length ? "Select a vacant room" : "No vacant rooms available"}</option>{available.map((room) => <option key={roomId(room)} value={roomId(room)}>{`Room ${roomName(room)}`}</option>)}</select></label>
    {roomsError && <p className="support-alert support-alert--error" role="alert">{roomsError}</p>}
    <label>Move-in Date<input name="moveInDate" type="date" value={form.moveInDate} onChange={update} required /></label>
    <label>Message<textarea name="message" value={form.message} onChange={update} required /></label>
    <Actions onBack={onBack} loading={loading} />
  </form>;
}

export function Actions({ onBack, loading }) { return <div className="support-actions"><button type="button" onClick={onBack}>Back</button><button type="submit" disabled={loading}><span>△</span>{loading ? "Sending..." : "Send"}</button></div>; }

export default function CustomerServiceWindow({ view = "menu", rooms = [], selectedRoom = null, roomsLoading = false, roomsError = "", user, status = {}, onClose = () => {}, onSelect = () => {}, onBack = () => {}, onSubmit = () => {} }) {
  return <section className="support-window" role="dialog" aria-modal="false" aria-labelledby="support-title">
    <header><div><h2 id="support-title">Spartment Assistant</h2><p>We typically reply in minutes</p></div><button type="button" onClick={onClose} aria-label="Close customer service">×</button></header>
    <div className="support-body">
      {status.error && <p className="support-alert support-alert--error" role="alert">{status.error}</p>}
      {status.success ? <div className="support-success" role="status"><strong>Request sent!</strong><p>{status.success}</p><button type="button" onClick={onBack}>Send another request</button></div> : <>
        {view === "menu" && <><p className="support-greeting">Hi 👋 How can we help today?</p><OptionButtons onSelect={onSelect} /></>}
        {view === "inquiry" && <InquirySupportForm key={roomId(selectedRoom) || "general-inquiry"} rooms={rooms} selectedRoom={selectedRoom} roomsLoading={roomsLoading} roomsError={roomsError} user={user} onBack={onBack} onSubmit={onSubmit} loading={status.loading} />}
        {view === "maintenance" && <MaintenanceForm onBack={onBack} onSubmit={onSubmit} loading={status.loading} user={user} rooms={rooms} />}
        {view === "other" && <OtherForm onBack={onBack} onSubmit={onSubmit} loading={status.loading} user={user} rooms={rooms} />}
      </>}
    </div>
  </section>;
}
