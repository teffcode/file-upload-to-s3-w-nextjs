import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, Fields, Files } from "formidable";
import fs from "fs";
import { uploadFileToS3 } from "@/lib/s3";

export const config = { api: { bodyParser: false } }; // Desactivar el body parser de Next.js

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new IncomingForm({ multiples: false });

  form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing form data" });
    }

    const file = files.file?.[0]; // Obtener el archivo

    if (!file) {
      return res.status(400).json({ error: "File is required." });
    }

    const fileBuffer = fs.readFileSync(file.filepath);
    const fileName = await uploadFileToS3(fileBuffer, file.originalFilename!);

    return res.status(200).json({ success: true, fileName });
  });
}
