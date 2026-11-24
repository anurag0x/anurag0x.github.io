"use client";

import { useEffect, useState } from "react";
import { on } from "@/lib/bus";

export function Toast() {
  const [msg, setMsg] = useState("");
  const [shown, setShown] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const off = on("toast", (m) => {
      setMsg(m);
      setShown(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShown(false), 2200);
    });
    return () => { off(); clearTimeout(timer); };
  }, []);
  return <div className={`toast${shown ? " show" : ""}`} role="status" aria-live="polite">{msg}</div>;
}
