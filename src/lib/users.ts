import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { User } from "firebase/auth";
import type { UserProfile } from "@/types/user";

export async function ensureUserDoc(user: User): Promise<UserProfile> {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  const base: UserProfile = {
    uid: user.uid,
    phone: user.phoneNumber ?? null,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    role: "customer",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  if (!snap.exists()) {
    await setDoc(ref, { ...base, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
    return base;
  }

  const existing = snap.data() as UserProfile;
  // Light refresh of fields that may change
  const merged: Partial<UserProfile> = {
    phone: base.phone,
    email: base.email,
    displayName: base.displayName,
    updatedAt: Date.now(),
  };
  await setDoc(ref, { ...merged, updatedAt: serverTimestamp() }, { merge: true });

  const latest = (await getDoc(ref)).data() as UserProfile;
  return latest;
}
