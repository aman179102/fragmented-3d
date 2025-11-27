/**
 * Linear interpolation between a and b.
 */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * Clamp value into [0, 1].
 */
export function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

/**
 * Classic ease-in-out cubic curve.
 */
export function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
