# File Upload to S3 with Next.js 🚀

This project allows you to upload files to an **Amazon S3 bucket** using a **Next.js API route**. It uses `formidable` for handling file uploads and the AWS SDK v3 to upload files to S3.

<kbd>
<img width="1035" alt="Screenshot 2025-02-26 at 4 10 14 PM" src="https://github.com/user-attachments/assets/02bff5aa-5022-4957-b4a6-765969790cd3" />
</kbd>

> Remember: disable this access
<kbd>
   <img width="1728" alt="Screenshot 2025-02-26 at 4 34 33 PM" src="https://github.com/user-attachments/assets/48401e76-6fb2-4723-b2c1-6b514720e361" />
</kbd>

## 🚀 Features
- Upload files to AWS S3 using a Next.js API.
- Uses `formidable` to parse multipart form data.
- Secure file handling with buffer processing.
- Supports TypeScript for type safety.

## 🛠️ Installation
1. Clone this repository:
   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

## ⚙️ Configuration
### 1. Set up AWS credentials
Make sure you have an IAM user with `s3:PutObject` permissions for your bucket. Store the credentials in `.env.local`:

```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=your-region
AWS_S3_BUCKET=your-bucket-name
```

### 2. Create the API Route
Inside `pages/api/upload.ts`:

```ts
import { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files } from "formidable";
import fs from "fs";
import { uploadFileToS3 } from "../../lib/s3";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
    if (err) {
      return res.status(500).json({ error: "Error parsing form data" });
    }

    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ error: "File is required." });
    }

    const fileBuffer = fs.readFileSync(file.filepath);
    const fileName = await uploadFileToS3(fileBuffer, file.originalFilename!);

    return res.status(200).json({ success: true, fileName });
  });
}
```

### 3. S3 Upload Logic
Inside `lib/s3.ts`:

```ts
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFileToS3(fileBuffer: Buffer, fileName: string) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: fileName,
    Body: Readable.from(fileBuffer),
  };

  await s3Client.send(new PutObjectCommand(params));
  return fileName;
}
```

## 🔥 Usage
### API Endpoint
Make a `POST` request to `/api/upload` with `multipart/form-data` containing a file:

```sh
curl -X POST http://localhost:3000/api/upload \
     -F "file=@path/to/your/file.png"
```

### Response Example
```json
{
  "success": true,
  "fileName": "uploaded-file.png"
}
```

## 🏗️ Roadmap
- [ ] Add file size validation.
- [ ] Implement file type restrictions.
- [ ] Add support for signed URLs.

## 📜 License
This project is open-source under the **MIT License**.

---
Made with ❤️ by [teffcode](https://github.com/teffcode).
