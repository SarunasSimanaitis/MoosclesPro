import { getAppPreferences } from "./preferences";

/*
 * Small, optional sensory feedback: haptics and a short chime.
 * Everything here fails silently: no vibration motor, no audio permission
 * or an old browser just means no feedback.
 */

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  const AudioContextClass =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextClass) return null;

  audioContext ??= new AudioContextClass();
  return audioContext;
}

/**
 * Browsers only allow sound after a user gesture. Call this from a tap
 * (e.g. completing a set) so the chime can play later when the rest ends.
 */
export function primeAudio() {
  const context = getAudioContext();
  if (context?.state === "suspended") void context.resume().catch(() => undefined);
}

export function vibrate(pattern: number | number[]) {
  try {
    if (getAppPreferences().restVibration) navigator.vibrate?.(pattern);
  } catch {
    // Not supported.
  }
}

/** A light tap for small confirmations, like ticking a set. */
export function tapFeedback() {
  try {
    navigator.vibrate?.(12);
  } catch {
    // Not supported.
  }
}

function playTone(context: AudioContext, frequency: number, startAt: number, duration: number) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(0.25, startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(gain).connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.02);
}

/** Two rising beeps plus a vibration when a rest timer finishes. */
export function restFinishedAlert() {
  const preferences = getAppPreferences();

  if (preferences.restVibration) vibrate([180, 90, 180]);

  if (!preferences.restSound) return;

  try {
    const context = getAudioContext();
    if (!context || context.state !== "running") return;

    const now = context.currentTime;
    playTone(context, 880, now, 0.16);
    playTone(context, 1320, now + 0.2, 0.22);
  } catch {
    // Audio unavailable.
  }
}
