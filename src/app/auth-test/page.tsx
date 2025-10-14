"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AuthTest() {
  const [phone, setPhone] = useState("+447700900000");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Keep a stable ref so we can clear the verifier on unmount
  const verifierRef = useRef<RecaptchaVerifier | null>(null);

  // Light sanity check for E.164 (e.g. +441234567890)
  const phoneLooksValid = useMemo(() => /^\+\d{8,15}$/.test(phone.trim()), [phone]);

  useEffect(() => {
    // Avoid SSR and re-init loops
    if (typeof window === "undefined" || verifierRef.current) return;

    const v = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {
        // reCAPTCHA solved automatically for invisible; we’ll proceed in send()
      },
      "expired-callback": () => {
        setMessage("reCAPTCHA expired. Please try again.");
      },
    });

    verifierRef.current = v;

    return () => {
      // Clean up reCAPTCHA instance when leaving the page
      try {
        v.clear();
      } catch {
        // ignore
      }
      verifierRef.current = null;
    };
  }, []);

  const send = async () => {
    if (!phoneLooksValid) {
      setMessage("Enter a valid phone number in E.164 format, e.g. +447700900000");
      return;
    }
    if (!verifierRef.current) {
      setMessage("reCAPTCHA not ready yet. Please wait a second and retry.");
      return;
    }
    setMessage(null);
    setSending(true);
    try {
      const conf = await signInWithPhoneNumber(auth, phone.trim(), verifierRef.current);
      setConfirmation(conf);
      setMessage("OTP sent. Please check your SMS.");
    } catch (err: any) {
      const code = err?.code || "";
      const friendly =
        code === "auth/invalid-phone-number" ? "Invalid phone number."
        : code === "auth/too-many-requests" ? "Too many attempts. Please wait and try again."
        : code === "auth/missing-recaptcha-token" ? "reCAPTCHA check failed. Refresh and try again."
        : code === "auth/network-request-failed" ? "Network error. Check your connection."
        : err?.message || "Failed to send OTP.";
      setMessage(friendly);
    } finally {
      setSending(false);
    }
  };

  const verify = async () => {
    if (!confirmation) return;
    if (!code.trim()) {
      setMessage("Enter the 6-digit code from SMS.");
      return;
    }
    setVerifying(true);
    setMessage(null);
    try {
      await confirmation.confirm(code.trim());
      setMessage("Phone verified ✅");
      setCode("");
    } catch (err: any) {
      const code = err?.code || "";
      const friendly =
        code === "auth/invalid-verification-code" ? "Incorrect code. Please try again."
        : code === "auth/code-expired" ? "Code expired. Request a new one."
        : err?.message || "Verification failed.";
      setMessage(friendly);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <main className="p-6 space-y-4 max-w-md">
      {/* Required for RecaptchaVerifier */}
      <div id="recaptcha-container" />

      <label className="form-control">
        <span className="label-text">Phone (E.164)</span>
        <input
          className="input input-bordered"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+447700900000"
          inputMode="tel"
        />
      </label>

      <div className="flex gap-2">
        <button className="btn" onClick={send} disabled={sending}>
          {sending ? "Sending…" : "Send OTP"}
        </button>
      </div>

      {confirmation && (
        <div className="space-y-3">
          <label className="form-control">
            <span className="label-text">Verification code</span>
            <input
              className="input input-bordered"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6-digit code"
              inputMode="numeric"
              maxLength={6}
            />
          </label>
          <button className="btn btn-primary" onClick={verify} disabled={verifying || !code}>
            {verifying ? "Verifying…" : "Verify"}
          </button>
        </div>
      )}

      {message && (
        <div className="alert shadow">
          <span>{message}</span>
        </div>
      )}
    </main>
  );
}
