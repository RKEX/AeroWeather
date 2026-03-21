type RafSubscriber = (time: number, deltaMs: number) => void;

const subscribers = new Set<RafSubscriber>();
let rafId = 0;
let lastTime = 0;

function frame(time: number) {
  const deltaMs = lastTime ? Math.min(64, time - lastTime) : 16.67;
  lastTime = time;

  subscribers.forEach((subscriber) => {
    subscriber(time, deltaMs);
  });

  if (subscribers.size > 0) {
    rafId = window.requestAnimationFrame(frame);
  } else {
    rafId = 0;
    lastTime = 0;
  }
}

export function subscribeSharedRaf(subscriber: RafSubscriber): () => void {
  subscribers.add(subscriber);

  if (!rafId) {
    rafId = window.requestAnimationFrame(frame);
  }

  return () => {
    subscribers.delete(subscriber);

    if (subscribers.size === 0 && rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
      lastTime = 0;
    }
  };
}
