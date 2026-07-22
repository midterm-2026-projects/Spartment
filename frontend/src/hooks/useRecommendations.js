import { useEffect, useState } from "react";

import {
  fetchRecommendations,
  generateRecommendations,
  refreshRecommendations,
} from "../api/recommendationApi";

/*
==========================================
RECOMMENDATION HOOK
==========================================

Handles:

- Smart recommendations
- Priority
- Category
- Status
- Related risk conditions
- Recommendation refresh

==========================================
*/

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  /*
  ==========================================
  LOAD RECOMMENDATIONS
  ==========================================
  */

  const loadRecommendations = async () => {
    try {
      setLoading(true);

      setError(null);

      const data = await fetchRecommendations();

      setRecommendations(data ?? []);
    } catch (error) {
      setError(error.message);

      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  /*
  ==========================================
  GENERATE RECOMMENDATIONS
  ==========================================
  */

  const generate = async () => {
    try {
      setLoading(true);

      setError(null);

      const data = await generateRecommendations();

      if (data) {
        await loadRecommendations();
      }

      return data;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /*
  ==========================================
  REFRESH RECOMMENDATIONS
  ==========================================
  */

  const refresh = async () => {
    try {
      setLoading(true);

      setError(null);

      const data = await refreshRecommendations();

      if (data) {
        setRecommendations(data);
      } else {
        await loadRecommendations();
      }

      return data;
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /*
  ==========================================
  INITIAL LOAD
  ==========================================
  */

  useEffect(() => {
    loadRecommendations();
  }, []);

  return {
    recommendations,

    loading,

    error,

    reload: loadRecommendations,

    refresh,

    generate,
  };
}
