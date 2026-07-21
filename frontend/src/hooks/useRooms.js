import { useCallback, useEffect, useState } from "react";

import { getRooms, getAvailableRooms } from "../api/roomApi";

export default function useRooms() {
  const [rooms, setRooms] = useState([]);

  const [availableRooms, setAvailableRooms] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);

      setError("");

      const response = await getRooms();

      const roomList = Array.isArray(response)
        ? response
        : response?.data || [];

      setRooms(roomList);

      const available = await getAvailableRooms();

      setAvailableRooms(available);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

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
