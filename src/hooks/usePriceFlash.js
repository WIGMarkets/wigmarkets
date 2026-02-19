import { useRef, useEffect, useState } from "react";

/**
 * Returns a CSS class name ("price-flash-up" or "price-flash-down") for one
 * animation cycle whenever `price` changes, then resets to "".
 */
export function usePriceFlash(price) {
  const prev = useRef(price);
  const [cls, setCls] = useState("");

  useEffect(() => {
    if (price == null || prev.current == null) { prev.current = price; return; }
    if (price === prev.current) return;
    const next = price > prev.current ? "price-flash-up" : "price-flash-down";
    prev.current = price;
    setCls(next);
    const t = setTimeout(() => setCls(""), 850);
    return () => clearTimeout(t);
  }, [price]);

  return cls;
}
