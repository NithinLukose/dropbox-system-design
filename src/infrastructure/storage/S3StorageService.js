import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/aws.js";

class S3StorageService {
  constructor() {
    this.bucketName = process.env.S3_BUCKET_NAME;
    if (!this.bucketName) {
      throw new Error("S3_BUCKET_NAME environment variable is required");
    }
  }

  async initializeMultipartUpload(s3Key) {
    const command = new CreateMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: s3Key,
    });
    const response = await s3Client.send(command);
    return response.UploadId;
  }

  async generatePresignedUrlForPart({ s3Key, uploadId, partNumber }) {
    const command = new UploadPartCommand({
      Bucket: this.bucketName,
      Key: s3Key,
      UploadId: uploadId,
      PartNumber: partNumber,
    });

    try {
      return await getSignedUrl(s3Client, command, { expiresIn: 900 }); // URL valid for 15 minutes
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      throw new Error("Failed to generate presigned URL");
    }
  }

  async completeMultipartUpload({ s3Key, uploadId, parts }) {
    const command = new CompleteMultipartUploadCommand({
      Bucket: this.bucketName,
      Key: s3Key,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts,
      },
    });

    try {
      await s3Client.send(command);
    } catch (error) {
      console.error("Error completing multipart upload:", error);
      throw new Error("Failed to complete multipart upload");
    }
  }
}

export default S3StorageService;
