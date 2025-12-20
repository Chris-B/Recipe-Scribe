/**
 * Deterministic unit conversion helpers.
 * Keep this tool-like: no LLM logic in here.
 */

export type UnitSystem = "US" | "METRIC";

const round = (n: number, decimals = 2) => {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
};

// Basic volume conversions (approx). For ingredient-specific weights, you'd need density tables.
export function tspToMl(tsp: number) {
  return tsp * 4.92892159375;
}
export function tbspToMl(tbsp: number) {
  return tbsp * 14.78676478125;
}
export function cupToMl(cup: number) {
  return cup * 236.5882365;
}

export function fToC(f: number) {
  return (f - 32) * (5 / 9);
}
export function cToF(c: number) {
  return c * (9 / 5) + 32;
}

/**
 * Scale ingredient quantities deterministically.
 */
export function scaleQuantity(qty: number, fromServings: number, toServings: number) {
  return round(qty * (toServings / fromServings), 3);
}
