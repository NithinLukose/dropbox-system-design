class GetChunkUploadUrl {
  constructor(storageService) {
    this.storageService = storageService;
  }

  async execute({ s3Key, uploadId, partNumber }) {
    if (!s3Key || !uploadId || !partNumber) {
      throw new Error("s3Key, uploadId, and partNumber are required");
    }

    const url = await this.storageService.generatePresignedUrlForPart({
      s3Key,
      uploadId,
      partNumber,
    });
    return { presignedUrl: url };
  }
}

export default GetChunkUploadUrl;
