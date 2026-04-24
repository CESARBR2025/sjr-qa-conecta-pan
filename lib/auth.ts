"use client";

import { useEffect, useState } from "react";

interface UserData {
  email: string;
  rolId: number;
  nombres: string;
  rolName: string;
}
// Traer datos de localStorage USER
export function userAuthLocalStorage() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user:", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  return { user };
}
