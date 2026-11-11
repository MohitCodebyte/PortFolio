// High-performance mutable store for 60/120fps R3F frame loop + event-driven UI state
// Avoids React re-renders on continuous scroll/mouse updates.

export const sceneState = {
  scrollProgress: 0, // 0 to 1 across entire page
  scrollVelocity: 0, // current Lenis velocity
  activeSection: 'home', // 'home' | 'about' | 'skills' | 'experience' | 'projects' | 'education' | 'contact'
  pointer: { x: 0, y: 0 }, // normalized -1 to 1
  targetWaypoint: {
    position: [0, 0.2, 8.5],
    lookAt: [0, 0, 0],
    fov: 46,
  },
  burstQueue: [], // 3D or 2D click burst triggers
  preloaderDone: false,
};

const sectionListeners = new Set();
const toastListeners = new Set();

export function setActiveSection(sectionId) {
  if (sceneState.activeSection !== sectionId) {
    sceneState.activeSection = sectionId;
    sectionListeners.forEach((fn) => fn(sectionId));
  }
}

export function subscribeActiveSection(listener) {
  sectionListeners.add(listener);
  return () => sectionListeners.delete(listener);
}

let toastIdCounter = 1;
export function showToast({ title, message, type = 'info', duration = 4200 }) {
  const item = {
    id: `toast-${toastIdCounter++}-${Date.now()}`,
    title,
    message,
    type,
    duration,
  };
  toastListeners.forEach((fn) => fn(item));
}

export function subscribeToast(listener) {
  toastListeners.add(listener);
  return () => toastListeners.delete(listener);
}

export function triggerClickBurst(clientX, clientY, color = '#22d3ee') {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('portfolio:click-burst', {
      detail: { x: clientX, y: clientY, color },
    })
  );
}

