import { NextRequest } from "next/server";
import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { v4 as uuid } from "uuid";

const client = new S3Client({ region: process.env.AWS_REGION });

export async function POST(req: NextRequest) {
  try {
    const { folder, contentType, maxSize = 5_000_000 } = await req.json();
    if (!folder || !contentType) {
      return new Response(JSON.stringify({ error: "Missing folder or contentType" }), { status: 400 });
    }

    // Store under public/… so GET is allowed by bucket policy
    const keyBase = `${folder}/${uuid()}`;

    const { url, fields } = await createPresignedPost(client, {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: `${keyBase}.jpg`,
      Conditions: [["content-length-range", 0, maxSize]],
      Expires: 60,
    });

    return new Response(JSON.stringify({ url, fields, keyBase }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
