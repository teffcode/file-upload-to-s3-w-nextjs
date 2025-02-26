import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
	region: process.env.AWS_S3_REGION as string,
	credentials: {
		accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
	}
});

export async function uploadFileToS3(file: Buffer, fileName: string) {
	console.log("🚀");
  if (!process.env.AWS_S3_BUCKET_NAME) {
		throw new Error("El nombre del bucket S3 no está definido en las variables de entorno.");
	}

	const params = {
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key: `${fileName}`,
		Body: file,
		ContentType: "image/jpeg",
	}

	try {
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
    console.log(`✅ Imagen subida a S3: ${fileName}`);
    return fileName;
  } catch (error) {
    console.error("❌ Error subiendo a S3:", error);
    throw error;
  }
}
