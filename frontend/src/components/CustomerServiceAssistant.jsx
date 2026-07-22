import { useEffect, useMemo, useState } from "react";
import { submitInquiry } from "../api/inquiryApi";
import { getAvailableRooms } from "../api/roomApi";
import CustomerServiceButtonWidget from "./CustomerServiceButtonWidget";
import CustomerServiceWindow from "./CustomerServiceWindow";

export default function CustomerServiceAssistant() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("menu");
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsError, setRoomsError] = useState("");
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); } catch { return null; }
  }, [open]);

  useEffect(() => {
    if (!open || (view !== "menu" && view !== "inquiry")) return;
    let active = true;
    setRoomsLoading(true);
    setRoomsError("");
    getAvailableRooms()
      .then((result) => { if (active) setRooms(Array.isArray(result) ? result : result?.data || []); })
      .catch((error) => { if (active) { setRooms([]); setRoomsError(error.message || "Available rooms could not be loaded."); } })
      .finally(() => { if (active) setRoomsLoading(false); });
    return () => { active = false; };
  }, [open, view]);

  useEffect(() => {
    const openRoomInquiry = ({ detail }) => {
      const room = detail?.room;
      if (!room) return;
      setSelectedRoom(room);
      setRooms((current) => current.some((item) => (item.id || item.roomId) === (room.id || room.roomId)) ? current : [room, ...current]);
      setStatus({ loading: false, error: "", success: "" });
      setView("inquiry");
      setOpen(true);
    };
    window.addEventListener("spartment:room-inquiry", openRoomInquiry);
    return () => window.removeEventListener("spartment:room-inquiry", openRoomInquiry);
  }, []);

  const close = () => { setOpen(false); setView("menu"); setSelectedRoom(null); setStatus({ loading: false, error: "", success: "" }); };
  const select = (next) => { setSelectedRoom(null); setView(next.toLowerCase()); setStatus({ loading: false, error: "", success: "" }); };
  const back = () => { setSelectedRoom(null); setView("menu"); setStatus({ loading: false, error: "", success: "" }); };
  const send = async (payload) => {
    setStatus({ loading: true, error: "", success: "" });
    try {
      let request = payload;
      if (view === "maintenance") {
        const room = rooms.find((item) => String(item.roomNumber || item.room_number) === payload.roomNumber) || rooms.find((item) => (item.id || item.roomId) === (user?.roomId || user?.room_id));
        request = { name: user?.fullName || user?.full_name || user?.name || "Tenant", email: user?.email || "tenant@spartment.local", contact: user?.contact || "N/A", roomId: room?.id || room?.roomId || user?.roomId || user?.room_id, type: "Maintenance", message: `${payload.issue}: ${payload.description}` };
      } else if (view === "other") {
        const room = rooms.find((item) => (item.id || item.roomId) === (user?.roomId || user?.room_id)) || rooms[0];
        request = { name: user?.fullName || user?.full_name || user?.name || "Guest", email: user?.email || "guest@spartment.local", contact: user?.contact || "N/A", roomId: room?.id || room?.roomId, type: "Other", message: `${payload.subject}: ${payload.message}` };
      }
      await submitInquiry(request);
      setStatus({ loading: false, error: "", success: "Thanks! Your request was sent to the Spartment team." });
    } catch (error) {
      setStatus({ loading: false, error: error.message || "We couldn't send your request. Please try again.", success: "" });
    }
  };

  return <>
    <CustomerServiceButtonWidget open={open} onClick={() => open ? close() : setOpen(true)} />
    {open && <CustomerServiceWindow view={view} rooms={rooms} selectedRoom={selectedRoom} roomsLoading={roomsLoading} roomsError={roomsError} user={user} status={status} onClose={close} onSelect={select} onBack={back} onSubmit={send} />}
  </>;
}
