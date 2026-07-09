/**
 * Finds the DOMRect of a CSS-selector-targeted element.
 * Used by the Guide overlay to position the spotlight.
 */
export function getElementRect(selector: string): DOMRect | null {
  if (typeof document === "undefined") return null;
  const el = document.querySelector(selector);
  if (!el) return null;
  return el.getBoundingClientRect();
}

export function isElementVisible(selector: string): boolean {
  if (typeof document === "undefined") return false;
  const el = document.querySelector(selector);
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}
