"use client";
import { useState } from "react";

async function presign(folder: string, contentType: string) {
  const res = await fetch("/api/s3/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder, contentType }),
  });
  if (!res.ok) throw new Error("Failed to presign");
  return res.json() as Promise<{ url: string; fields: Record<string, string>; keyBase: string }>;
}

async function uploadPresigned(url: string, fields: Record<string, string>, file: File) {
  const form = new FormData();
  Object.entries(fields).forEach(([k, v]) => form.append(k, v));
  form.append("file", file);
  const r = await fetch(url, { method: "POST", body: form });
  if (!r.ok) throw new Error("Upload failed");
}

async function resize(file: File, width: number): Promise<File> {
  const img = document.createElement("img");
  img.src = URL.createObjectURL(file);
  await new Promise((res) => (img.onload = res));
  const canvas = document.createElement("canvas");
  const scale = width / img.width;
  canvas.width = width;
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b as Blob), "image/jpeg", 0.9)
  );
  return new File([blob], file.name, { type: "image/jpeg" });
}

export default function ImageUploader({
  folder,
  onDone,
}: {
  folder: string;
  onDone?: (urls: {
    original: string;
    w1200: string;
    w600: string;
    w300: string;
    keyBase: string;
  }) => void;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setBusy(true);
          try {
            const sizes = [1200, 600, 300];
            const pres = await Promise.all([
              presign("public/" + folder, f.type),        // original
              ...sizes.map(() => presign("public/" + folder, "image/jpeg")), // thumbs
            ]);
            const [{ url, fields, keyBase }] = pres;

            await uploadPresigned(url, fields, f);

            const files = await Promise.all(sizes.map((w) => resize(f, w)));
            await Promise.all(
              files.map((rf, i) => uploadPresigned(pres[i + 1].url, pres[i + 1].fields, rf))
            );

            const host =
              process.env.NEXT_PUBLIC_S3_PUBLIC_HOST ||
              `${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`;

            onDone?.({
              original: `https://${host}/${keyBase}.jpg`,
              w1200: `https://${host}/${keyBase}_w1200.jpg`,
              w600: `https://${host}/${keyBase}_w600.jpg`,
              w300: `https://${host}/${keyBase}_w300.jpg`,
              keyBase,
            });
          } finally {
            setBusy(false);
          }
        }}
      />
      {busy && <span className="text-sm opacity-70">Uploading…</span>}
    </div>
  );
}
