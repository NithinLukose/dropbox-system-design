class CompleteUpload {
  constructor(fileRepository, storageService) {
    this.fileRepository = fileRepository;
    this.storageService = storageService;
  }

  async execute({ userId, fileId, uploadId, parts }) {
    const file = await this.fileRepository.findById(userId, fileId);
    if (!file) {
      throw new Error("File not found");
    }

    const sortedParts = parts.sort((a, b) => a.PartNumber - b.PartNumber);

    await this.storageService.completeMultipartUpload({
      s3Key: file.s3Key,
      uploadId,
      parts: sortedParts,
    });

    file.markAsActive();

    await this.fileRepository.save(file);

    return {
      fileId: file.fileId,
      status: file.status,
    };
  }
}

export default CompleteUpload;
