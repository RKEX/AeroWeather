import Lenis from "@studio-freight/lenis";

let lenis: Lenis | null = null;

export function initLenis() {
  // ✅ prevent multiple instances
  if (lenis) return lenis;

  lenis = new Lenis({
    smooth: true,
    lerp: 0.08,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  function raf(time: number) {
    lenis!.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return lenis;
}

// ✅ IMPORTANT for scrollbar
export function getLenis() {
  return lenis;
}
