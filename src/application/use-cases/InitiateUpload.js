import File from "../../domain/entities/File.js";

class InitiateUpload {
  /**
   * @param {Object} fileRepository - Interface for DB operations
   * @param {Object} storageService - Interface for S3 storage operations
   */
  constructor(fileRepository, storageService) {
    this.fileRepository = fileRepository;
    this.storageService = storageService;
  }

  /**
   * Executes the business workflow to start a large file upload
   * @param {Object} input - { userId, fileName, fileSize }
   */
  async execute({ userId, fileName, fileSize }) {
    const file = new File({ userId, fileName, fileSize });

    const uploadId = await this.storageService.initializeMultipartUpload(
      file.s3Key,
    );

    await this.fileRepository.save(file);

    return {
      fileId: file.fileId,
      uploadId,
      s3Key: file.s3Key,
    };
  }
}

export default InitiateUpload;
