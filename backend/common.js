import { S3 } from "@aws-sdk/client-s3";
import { createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import path from "path";
import { TryCatch } from "./middlewares/error.middleware.js";
import { Readable } from "stream";
import axios from "axios";

export const uploadS3 = TryCatch(async (req, res) => {
  const s3 = new S3({
    region: "eu-north-1",
    credentials: {
      accessKeyId: "AKIAU6GDYZDTXYNPI7KP",
      secretAccessKey: "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",
    },
  });

  const file = req.file;

  if (!file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }

  // Generate unique file key
  const fileKey = `uploads/${Date.now()}-${file.originalname.replace(
    / /g,
    "-"
  )}`;

  // Set up upload parameters
  const params = {
    Bucket: "loctest090224",
    Key: fileKey,
    Body: file.buffer, // Use file buffer from multer
    ContentType: file.mimetype,
  };

  // Upload to S3
  const hello = await s3.putObject(params);
  console.log(hello);
  // Construct public URL (if bucket is public)
  const publicUrl = `https://loctest090224.s3.eu-north-1.amazonaws.com/${fileKey}`;
  console.log(fileKey);
  console.log(publicUrl);

  const response = await axios.post(
    `https://southern-filme-attempts-peak.trycloudflare.com/route_request`,
    {
      FILELINK: publicUrl,
      bucketname: "loctest090224",
      aws_object_id: fileKey,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );

  console.log("success");
  console.log(response.data);

  return res.status(201).json({
    success: true,
    message: "File uploaded successfully",
    data: {
      file_key: fileKey,
      file_name: file.originalname,
      url: publicUrl,
    },
  });
});

export async function downloadFromS3(file_key) {
  return new Promise(async (resolve, reject) => {
    try {
      const s3 = new S3({
        region: "eu-north-1",
        endpoint: `https://s3.eu-north-1.amazonaws.com`,
        credentials: {
          accessKeyId: "AKIAU6GDYZDTXYNPI7KP",
          secretAccessKey: "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",
        },
      });

      const params = {
        Bucket: "loctest090224",
        Key: file_key,
      };

      const obj = await s3.getObject(params);

      const downloadsDir = path.join(
        "C:",
        "Users",
        "Krishna Thakkar",
        "Downloads"
      );
      const downloadPath = path.join(
        downloadsDir,
        `download-${Date.now()}.pdf`
      );

      if (obj.Body instanceof Readable) {
        const writeStream = createWriteStream(downloadPath);
        await pipeline(obj.Body, writeStream);
        return downloadPath;
      }

      throw new Error("Invalid response body type");
    } catch (error) {
      console.error(error);
      reject(error);
      return null;
    }
  });
}

export const downS3 = TryCatch(async (req, res) => {
  const file_key = req.params.file_key;

  if (!file_key) {
    return res.status(400).json({
      success: false,
      message: "File key is required",
    });
  }

  const downloadPath = await downloadFromS3(file_key);

  res.download(downloadPath, (err) => {
    if (err) {
      console.error("Download failed:", err);
      return res.status(500).json({
        success: false,
        message: "File download failed",
      });
    }

    // Clean up the downloaded file after sending
    fs.unlink(downloadPath, (unlinkErr) => {
      if (unlinkErr) console.error("Cleanup error:", unlinkErr);
    });
  });
});
