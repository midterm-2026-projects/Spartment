import { useState } from "react";

import useRooms from "../hooks/useRooms";
import useInquiry from "../hooks/useInquiry";

import GuestRoomList from "../components/GuestRoomList";
import InquiryForm from "../components/InquiryForm";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function GuestRooms() {
  const { rooms, loading: roomsLoading, error: roomsError } = useRooms();

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

  if (roomsLoading) {
    return <Loading />;
  }

  if (roomsError) {
    return <ErrorMessage message={roomsError} />;
  }

  return (
    <main className="mx-auto max-w-7xl p-6">
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-gray-900">Guest Rooms</h1>

        <p className="mt-1 text-gray-500">
          Browse available rooms and submit an inquiry.
        </p>
      </div>

      {success ? (
        <div
          role="status"
          className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700"
        >
          {success}
        </div>
      ) : null}

      {inquiryError && !selectedRoom ? (
        <div className="mb-6">
          <ErrorMessage message={inquiryError} />
        </div>
      ) : null}

      {selectedRoom ? (
        <InquiryForm
          selectedRoom={selectedRoom}
          rooms={rooms}
          loading={inquiryLoading}
          error={inquiryError}
          onBack={handleBack}
          onSubmit={handleSubmitInquiry}
        />
      ) : (
        <GuestRoomList rooms={rooms} onInquiry={handleInquiry} />
      )}
    </main>
  );
}
