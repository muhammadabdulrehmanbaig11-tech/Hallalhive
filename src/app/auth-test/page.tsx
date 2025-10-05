"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  registerUser,
  loginUser,
  sendOTP,
  confirmOTP,
  setupRecaptcha,
} from "@/lib/auth";
import { signOut, onAuthStateChanged, type User, type ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase";

/**
 * AuthTest page
 * - Uses email/password register & login
 * - Uses phone OTP (with Firebase test numbers)
 * - Tracks current user and shows status
 *
 * This version intentionally uses all imports + state to avoid ESLint unused warnings.
 */

export default function AuthTest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Phone OTP state (used below)
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

  const [message, setMessage] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const recaptchaRendered = useRef(false);

  // Subscribe to auth state to show signed-in user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // Ensure recaptcha singleton
  const ensureRecaptcha = () => {
    if (typeof window === "undefined") return;
    if (!recaptchaRendered.current) {
      try {
        setupRecaptcha("recaptcha-container");
        recaptchaRendered.current = true;
      } catch (e) {
        console.warn("recaptcha init error:", e);
      }
    }
  };

  // Email flows
  const handleRegister = async () => {
    try {
      const u = await registerUser(email.trim(), password);
      setMessage(`Registered: ${u.email ?? u.uid}`);
    } catch (e: unknown) {
      setMessage(e instanceof Error ? `Register error: ${e.message}` : String(e));
    }
  };

  const handleLogin = async () => {
    try {
      const u = await loginUser(email.trim(), password);
      setMessage(`Logged in: ${u.email ?? u.uid}`);
    } catch (e: unknown) {
      setMessage(e instanceof Error ? `Login error: ${e.message}` : String(e));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMessage("Signed out");
    } catch (e: unknown) {
      setMessage(e instanceof Error ? `Logout error: ${e.message}` : String(e));
    }
  };

  // Phone flows
  const handleSendOtp = async () => {
    try {
      ensureRecaptcha();
      const confirmationResult = await sendOTP(phone.trim());
      setConfirmation(confirmationResult);
      setMessage("OTP sent (check your test number code).");
    } catch (e: unknown) {
      setMessage(e instanceof Error ? `Send OTP error: ${e.message}` : String(e));
    }
  };

  const handleConfirmOtp = async () => {
    if (!confirmation) return setMessage("No OTP confirmation found. Send OTP first.");
    try {
      const u = await confirmOTP(confirmation, otp.trim());
      setMessage(`Phone login success: ${u.phoneNumber ?? u.uid}`);
      // clear otp state for cleanliness
      setOtp("");
      setConfirmation(null);
    } catch (e: unknown) {
      setMessage(e instanceof Error ? `Confirm OTP error: ${e.message}` : String(e));
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auth Test</h1>

      {/* Email / Password */}
      <section className="mb-8">
        <h2 className="font-semibold mb-2">Email / Password</h2>
        <input className="block w-full border p-2 my-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="block w-full border p-2 my-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="flex gap-2">
          <button onClick={handleRegister} className="bg-green-600 text-white px-4 py-2 rounded">Register</button>
          <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
          <button onClick={handleLogout} className="bg-gray-600 text-white px-4 py-2 rounded">Logout</button>
        </div>
      </section>

      <hr className="my-6" />

      {/* Phone / OTP */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2">Phone (OTP)</h2>
        <input className="block w-full border p-2 my-2" placeholder="+15555550123" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <div className="flex gap-2">
          <button onClick={handleSendOtp} className="bg-orange-600 text-white px-4 py-2 rounded">Send OTP</button>
        </div>

        <div id="recaptcha-container" className="mt-2" />

        {confirmation && (
          <div className="mt-4">
            <input className="block w-full border p-2 my-2" placeholder="Enter verification code" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <button onClick={handleConfirmOtp} className="bg-purple-600 text-white px-4 py-2 rounded">Confirm Code</button>
          </div>
        )}
      </section>

      {/* Status */}
      <div className="mt-6">
        <h3 className="font-medium">Status</h3>
        <p className="text-sm text-gray-700">{message}</p>
        <p className="text-sm text-gray-700">Current user: {user ? user.email ?? user.phoneNumber ?? user.uid : "Not signed in"}</p>
      </div>
    </div>
  );
}
