import { useCallback, useEffect, useState } from "react";

import { getRooms, getAvailableRooms } from "../api/roomApi";

export default function useRooms({ publicOnly = false } = {}) {
  const [rooms, setRooms] = useState([]);

  const [availableRooms, setAvailableRooms] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);

      setError("");

      const response = publicOnly ? await getAvailableRooms() : await getRooms();

      const roomList = Array.isArray(response)
        ? response
        : response?.data || [];

      setRooms(roomList);

      const available = publicOnly ? roomList : await getAvailableRooms();

      setAvailableRooms(available);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [publicOnly]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return {
    rooms,
    availableRooms,
    loading,
    error,
    refetch: fetchRooms,
  };
}
