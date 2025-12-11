// ===================================
// WARDATY - ANIMATION UTILITIES
// iOS-compliant animations and transitions
// ===================================

import {
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  SharedValue,
} from "react-native-reanimated";
import { Animations } from "../constants/theme";

// ===================================
// SPRING ANIMATIONS
// ===================================

/**
 * Default spring animation (iOS-like)
 */
export function spring(value: number, callback?: () => void) {
  "worklet";
  return withSpring(value, Animations.spring, callback);
}

/**
 * Gentle spring animation
 */
export function springGentle(value: number, callback?: () => void) {
  "worklet";
  return withSpring(value, Animations.springGentle, callback);
}

/**
 * Bouncy spring animation
 */
export function springBouncy(value: number, callback?: () => void) {
  "worklet";
  return withSpring(value, Animations.springBouncy, callback);
}

// ===================================
// TIMING ANIMATIONS
// ===================================

/**
 * Fast timing animation
 */
export function timingFast(value: number, callback?: () => void) {
  "worklet";
  return withTiming(
    value,
    {
      duration: Animations.timing.fast,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    },
    callback
  );
}

/**
 * Normal timing animation
 */
export function timingNormal(value: number, callback?: () => void) {
  "worklet";
  return withTiming(
    value,
    {
      duration: Animations.timing.normal,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    },
    callback
  );
}

/**
 * Slow timing animation
 */
export function timingSlow(value: number, callback?: () => void) {
  "worklet";
  return withTiming(
    value,
    {
      duration: Animations.timing.slow,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    },
    callback
  );
}

/**
 * Linear timing animation
 */
export function timingLinear(value: number, duration: number, callback?: () => void) {
  "worklet";
  return withTiming(
    value,
    {
      duration,
      easing: Easing.linear,
    },
    callback
  );
}

// ===================================
// COMMON ANIMATIONS
// ===================================

/**
 * Fade in animation
 */
export function fadeIn(delay = 0, callback?: () => void) {
  "worklet";
  return withDelay(delay, timingNormal(1, callback));
}

/**
 * Fade out animation
 */
export function fadeOut(delay = 0, callback?: () => void) {
  "worklet";
  return withDelay(delay, timingNormal(0, callback));
}

/**
 * Scale in animation
 */
export function scaleIn(delay = 0, callback?: () => void) {
  "worklet";
  return withDelay(delay, spring(1, callback));
}

/**
 * Scale out animation
 */
export function scaleOut(delay = 0, callback?: () => void) {
  "worklet";
  return withDelay(delay, spring(0, callback));
}

/**
 * Slide in from right
 */
export function slideInRight(distance: number, delay = 0, callback?: () => void) {
  "worklet";
  return withDelay(delay, spring(0, callback));
}

/**
 * Slide in from left
 */
export function slideInLeft(distance: number, delay = 0, callback?: () => void) {
  "worklet";
  return withDelay(delay, spring(0, callback));
}

/**
 * Slide out to right
 */
export function slideOutRight(distance: number, delay = 0, callback?: () => void) {
  "worklet";
  return withDelay(delay, spring(distance, callback));
}

/**
 * Slide out to left
 */
export function slideOutLeft(distance: number, delay = 0, callback?: () => void) {
  "worklet";
  return withDelay(delay, spring(-distance, callback));
}

/**
 * Bounce animation
 */
export function bounce(callback?: () => void) {
  "worklet";
  return withSequence(
    withSpring(0.9, Animations.springBouncy),
    withSpring(1.1, Animations.springBouncy),
    withSpring(1, Animations.spring, callback)
  );
}

/**
 * Shake animation
 */
export function shake(distance = 10, callback?: () => void) {
  "worklet";
  return withSequence(
    withTiming(distance, { duration: 50 }),
    withTiming(-distance, { duration: 50 }),
    withTiming(distance, { duration: 50 }),
    withTiming(-distance, { duration: 50 }),
    withTiming(0, { duration: 50 }, callback)
  );
}

/**
 * Pulse animation (repeating)
 */
export function pulse(minScale = 0.95, maxScale = 1.05) {
  "worklet";
  return withRepeat(
    withSequence(
      withTiming(minScale, { duration: 600, easing: Easing.inOut(Easing.ease) }),
      withTiming(maxScale, { duration: 600, easing: Easing.inOut(Easing.ease) })
    ),
    -1,
    true
  );
}

/**
 * Glow animation (repeating opacity)
 */
export function glow(minOpacity = 0.4, maxOpacity = 1) {
  "worklet";
  return withRepeat(
    withSequence(
      withTiming(minOpacity, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      withTiming(maxOpacity, { duration: 1200, easing: Easing.inOut(Easing.ease) })
    ),
    -1,
    true
  );
}

/**
 * Rotate animation (360 degrees)
 */
export function rotate360(duration = 1000, callback?: () => void) {
  "worklet";
  return withTiming(360, { duration, easing: Easing.linear }, callback);
}

/**
 * Rotate animation (repeating)
 */
export function rotateLoop(duration = 1000) {
  "worklet";
  return withRepeat(
    withTiming(360, { duration, easing: Easing.linear }),
    -1,
    false
  );
}

// ===================================
// BUTTON ANIMATIONS
// ===================================

/**
 * Button press animation
 */
export function buttonPress(callback?: () => void) {
  "worklet";
  return withSequence(
    withSpring(Animations.buttonScale, Animations.spring),
    withSpring(1, Animations.spring, callback)
  );
}

/**
 * Button success animation
 */
export function buttonSuccess(callback?: () => void) {
  "worklet";
  return withSequence(
    withSpring(0.9, Animations.springBouncy),
    withSpring(1.05, Animations.springBouncy),
    withSpring(1, Animations.spring, callback)
  );
}

/**
 * Button error animation (shake)
 */
export function buttonError(callback?: () => void) {
  "worklet";
  return shake(10, callback);
}

// ===================================
// CARD ANIMATIONS
// ===================================

/**
 * Card press animation
 */
export function cardPress(callback?: () => void) {
  "worklet";
  return withSequence(
    withSpring(Animations.cardScale, Animations.spring),
    withSpring(1, Animations.spring, callback)
  );
}

/**
 * Card appear animation
 */
export function cardAppear(delay = 0, callback?: () => void) {
  "worklet";
  return withDelay(
    delay,
    withSequence(
      withSpring(0.9, Animations.springGentle),
      withSpring(1, Animations.spring, callback)
    )
  );
}

// ===================================
// LIST ANIMATIONS
// ===================================

/**
 * Stagger animation for list items
 */
export function staggerItem(index: number, baseDelay = 0, itemDelay = 50) {
  "worklet";
  return withDelay(baseDelay + index * itemDelay, spring(1));
}

// ===================================
// EXPORT ALL
// ===================================

export const AnimationUtils = {
  // Spring
  spring,
  springGentle,
  springBouncy,
  
  // Timing
  timingFast,
  timingNormal,
  timingSlow,
  timingLinear,
  
  // Common
  fadeIn,
  fadeOut,
  scaleIn,
  scaleOut,
  slideInRight,
  slideInLeft,
  slideOutRight,
  slideOutLeft,
  bounce,
  shake,
  pulse,
  glow,
  rotate360,
  rotateLoop,
  
  // Button
  buttonPress,
  buttonSuccess,
  buttonError,
  
  // Card
  cardPress,
  cardAppear,
  
  // List
  staggerItem,
};

export default AnimationUtils;
