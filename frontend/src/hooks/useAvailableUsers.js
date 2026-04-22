import { useEffect, useState } from "react";
import { apiRequest } from "../lib/api";

export default function useAvailableUsers(enabled = true) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const loadUsers = async () => {
      setLoading(true);
      try {
        const response = await apiRequest("/auth/users");
        setUsers(response);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [enabled]);

  return { users, loading };
}
