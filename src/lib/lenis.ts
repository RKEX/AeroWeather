import Lenis from "@studio-freight/lenis";

let lenis: Lenis | null = null;

/**
 * @deprecated Use LenisProvider for conditional initialization.
 * This is kept for backward compatibility and singleton access.
 */
export function initLenis() {
  return lenis;
}

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}
