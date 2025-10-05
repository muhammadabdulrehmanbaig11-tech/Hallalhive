// web/src/lib/auth.ts
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

/**
 * Email / password
 */
export async function registerUser(email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export async function loginUser(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

/**
 * ReCAPTCHA verifier — creates or returns a single global instance.
 * Must run in browser context only.
 */
export function setupRecaptcha(containerId = "recaptcha-container"): RecaptchaVerifier {
  if (typeof window === "undefined") {
    throw new Error("setupRecaptcha() can only be used in the browser.");
  }

  const globalWin = window as unknown as { __firebaseRecaptcha?: RecaptchaVerifier };

  // return existing verifier if present
  if (globalWin.__firebaseRecaptcha) {
    return globalWin.__firebaseRecaptcha;
  }

  // create new one and render immediately
  const verifier = new RecaptchaVerifier(auth, containerId, { size: "invisible" });
  globalWin.__firebaseRecaptcha = verifier;

  // render returns a widgetId promise; we can ignore it
  void verifier.render();
  return verifier;
}

/**
 * Send OTP — returns a ConfirmationResult.
 * Use Firebase Console test numbers for dev.
 */
export async function sendOTP(
  phone: string,
  containerId = "recaptcha-container"
): Promise<ConfirmationResult> {
  const verifier = setupRecaptcha(containerId);
  const confirmationResult = await signInWithPhoneNumber(auth, phone, verifier);
  return confirmationResult;
}

/**
 * Confirm OTP code from sendOTP()
 */
export async function confirmOTP(confirmation: ConfirmationResult, code: string) {
  const cred = await confirmation.confirm(code);
  return cred.user;
}

/**
 * Sign out
 */
export async function logout() {
  await firebaseSignOut(auth);
}

/**
 * Observe current user (auth state listener)
 */
export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
