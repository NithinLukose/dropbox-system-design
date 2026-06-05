import { ulid } from "ulid";

class File {
  constructor({
    userId,
    fileName,
    fileSize,
    fileId = null,
    s3Key = null,
    status = "PENDING",
    createdAt = null,
  }) {
    this.userId = userId;
    this.fileName = fileName;
    this.fileSize = fileSize;
    this.fileId = fileId || ulid();
    this.s3Key = s3Key || `uploads/${userId}/${this.fileId}-${fileName}`;
    this.status = status; // PENDING, ACTIVE, FAILED
    this.createdAt = createdAt || new Date().toISOString();
  }

  markAsActive() {
    this.status = "ACTIVE";
  }

  markAsFailed() {
    this.status = "FAILED";
  }
}

export default File;
