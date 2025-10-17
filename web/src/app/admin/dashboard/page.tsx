/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  query,
  where
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

// Build Firebase config from env safely
function getFirebaseConfig(): any | undefined {
  const raw = process.env.NEXT_PUBLIC_FIREBASE_CONFIG as string | undefined;
  if (raw && raw.trim().startsWith('{')) {
    try { return JSON.parse(raw); } catch { /* fall back */ }
  }
  const cfg = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };
  if (!cfg.apiKey || !cfg.projectId) return undefined;
  return cfg;
}

// Initialize Firebase on client only
function useFirebase() {
  return useMemo(() => {
    const cfg = getFirebaseConfig();
    if (!cfg) return { error: 'Missing Firebase env (create web/.env.local)' } as const;

    const app = getApps().length ? getApp() : initializeApp(cfg as any);
    const db = getFirestore(app);
    const functions = getFunctions(app, 'europe-west2'); // keep in sync with backend region
    const upsertVendor = httpsCallable(functions, 'upsertVendor');
    return { db, upsertVendor } as const;
  }, []);
}

export default function Dashboard() {
  const [vendorsActive, setVendorsActive] = useState(0);
  const [featuredCount, setFeaturedCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fb = useFirebase();

  useEffect(() => {
    if ('error' in fb) return;

    const unsubStats = onSnapshot(doc(fb.db, 'stats', 'global'), (d) => {
      const n = (d.data()?.vendorsActive as number) ?? 0;
      setVendorsActive(n);
    });

    const q = query(
      collection(fb.db, 'public_vendors'),
      where('badges', 'array-contains', 'Featured'),
      where('status', '==', 'active')
    );
    const unsubFeatured = onSnapshot(q, (ss) => setFeaturedCount(ss.size));

    return () => { unsubStats(); unsubFeatured(); };
  }, [fb]);

  async function seedTestVendor() {
    if ('error' in fb) {
      setMsg('Missing Firebase env (create web/.env.local)');
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const resp = await fb.upsertVendor({
        vendorId: 'V123',
        vendor: {
          profile: { name: 'Al Noor Meats', slug: 'al-noor-meats', logoUrl: 'https://example.com/logo.png' },
          address: { city: 'Manchester', postcode: 'M1' },
          operational: { openingHours: { mon: [['09:00', '18:00']] }, deliveryRadiusKm: 8, minOrder: 15 },
          status: 'active',
          flags: { verified: true, featured: false }
        }
      } as any);
      setMsg(`Seeded vendor OK: ${JSON.stringify(resp.data)}`);
    } catch (err: any) {
      setMsg(`Seed failed: ${err?.message || String(err)}`);
    } finally { setBusy(false); }
  }

  if ('error' in fb) {
    return (
      <main className="min-h-screen bg-black text-white p-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-4 text-red-400">{fb.error}</p>
        <p className="mt-2 text-zinc-300">
          Create <code>web/.env.local</code> with NEXT_PUBLIC_FIREBASE_CONFIG (JSON) or individual NEXT_PUBLIC_FIREBASE_* keys.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 grid gap-6 md:grid-cols-2">
      <section className="rounded-2xl border border-zinc-800 p-6">
        <h2 className="text-xl font-semibold">Active Vendors</h2>
        <p className="text-5xl font-extrabold mt-2">{vendorsActive}</p>
        <button
          onClick={seedTestVendor}
          disabled={busy}
          className="mt-6 px-4 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-900 disabled:opacity-60"
        >
          {busy ? 'Seeding…' : 'Seed Test Vendor (V123)'}
        </button>
        {msg && <p className="mt-3 text-sm text-zinc-300">{msg}</p>}
      </section>

      <section className="rounded-2xl border border-zinc-800 p-6">
        <h2 className="text-xl font-semibold">Featured Vendors</h2>
        <p className="text-5xl font-extrabold mt-2">{featuredCount}</p>
      </section>
    </main>
  );
}
