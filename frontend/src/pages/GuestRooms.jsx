import { useState } from "react";

import useRooms from "../hooks/useRooms";
import useInquiry from "../hooks/useInquiry";

import GuestRoomList from "../components/GuestRoomList";
import InquiryForm from "../components/InquiryForm";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import UiIcon from "../components/UiIcon";

export default function GuestRooms() {
  const { rooms, loading: roomsLoading, error: roomsError, refetch } = useRooms({
    publicOnly: true,
  });

  const {
    createInquiry,
    loading: inquiryLoading,
    error: inquiryError,
    success,
    reset,
  } = useInquiry();

  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleInquiry = (room) => {
    reset();
    setSelectedRoom(room);
  };

  const handleBack = () => {
    if (inquiryLoading) {
      return;
    }

    reset();

    setSelectedRoom(null);
  };

  const handleSubmitInquiry = async (inquiryData) => {
    try {
      await createInquiry(inquiryData);

      setSelectedRoom(null);
    } catch {
      // Error is already stored inside useInquiry.
    }
  };

  return (
    <main className="guest-page">
      <header className="guest-nav">
        <a className="guest-brand" href="/" aria-label="Spartment home">
          <span className="guest-brand__mark"><UiIcon name="logo" size={24} /></span>
          <strong>Spartment</strong>
        </a>
        <a className="guest-exit" href="/">
          <span aria-hidden="true">↪</span> Exit
        </a>
      </header>

      <section className="guest-hero">
        <div>
          <p>Guest view</p>
          <h1>Find your next room.</h1>
          <span>
            Browse live apartment availability and send an inquiry in minutes.
          </span>
        </div>
      </section>

      {success ? (
        <div
          role="status"
          className="guest-message guest-message--success"
        >
          {success}
        </div>
      ) : null}

      {inquiryError && !selectedRoom ? (
        <div className="guest-message">
          <ErrorMessage message={inquiryError} />
        </div>
      ) : null}

      {roomsLoading ? (
        <section className="guest-content guest-state"><Loading /></section>
      ) : roomsError ? (
        <section className="guest-content guest-state">
          <div className="guest-error" role="alert">
            <strong>We couldn’t load the rooms</strong>
            <p>{roomsError}</p>
            <button type="button" onClick={refetch}>Try again</button>
          </div>
        </section>
      ) : selectedRoom ? (
        <section className="guest-content guest-content--form">
          <InquiryForm
            selectedRoom={selectedRoom}
            rooms={rooms}
            loading={inquiryLoading}
            error={inquiryError}
            onBack={handleBack}
            onSubmit={handleSubmitInquiry}
          />
        </section>
      ) : (
        <section className="guest-content">
          <GuestRoomList rooms={rooms} onInquiry={handleInquiry} />
        </section>
      )}
    </main>
  );
}
