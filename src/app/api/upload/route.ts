export const runtime = "nodejs";

import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Validate Cloudinary environment variables
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("Missing Cloudinary environment variables");
      return NextResponse.json(
        {
          error:
            "Server configuration error: Cloudinary credentials are missing. Please contact support.",
        },
        { status: 500 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 },
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; 
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Image size must be less than 5MB" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "medistore-users",
            resource_type: "image",
            transformation: [
              { width: 500, height: 500, crop: "limit" },
              { quality: "auto" },
            ],
          },
          (err, result) => {
            if (err) {
              console.error("Cloudinary upload error:", err);
              reject(err);
            } else {
              resolve(result);
            }
          },
        )
        .end(buffer);
    });

    if (!uploadResult?.secure_url) {
      throw new Error("Upload succeeded but no URL returned");
    }

    return NextResponse.json(
      {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Upload error:", error);

    // Provide more specific error messages
    let errorMessage = "Upload failed";
    let statusCode = 500;

    if (error.message) {
      errorMessage = error.message;
    } else if (error.http_code) {
      // Cloudinary specific errors
      errorMessage = `Cloudinary error: ${error.message || "Upload failed"}`;
      statusCode =
        error.http_code >= 400 && error.http_code < 600 ? error.http_code : 500;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: statusCode },
    );
  }
}
