"use client";

import { useCharacterStore } from "@/lib/stores/character";
import { useEffect } from "react";

export default function ClientInit() {
  useEffect(() => {
    useCharacterStore.getState().hydrate();
  }, []);

  return null;
}
