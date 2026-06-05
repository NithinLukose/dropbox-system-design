class FileController {
  /**
   * @param {Object} initiateUploadUseCase - Instance of InitiateUpload Use Case
   * @param {Object} getChunkUploadUrlUseCase
   * @param {Object} completeUploadUseCase
   */
  constructor(
    initiateUploadUseCase,
    getChunkUploadUrlUseCase,
    completeUploadUseCase,
  ) {
    this.initiateUploadUseCase = initiateUploadUseCase;
    this.getChunkUploadUrlUseCase = getChunkUploadUrlUseCase;
    this.completeUploadUseCase = completeUploadUseCase;
  }

  async initiateUpload(req, res) {
    try {
      const { fileName, fileSize } = req.body;

      const userId = "user_test_123";

      if (!fileName || !fileSize) {
        return res
          .status(400)
          .json({ error: "fileName and fileSize are required" });
      }

      const result = await this.initiateUploadUseCase.execute({
        userId,
        fileName,
        fileSize,
      });

      return res.status(201).json({
        message: "Upload initiated successfully",
        data: result,
      });
    } catch (error) {
      console.error("Controller Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  async getChunkUploadUrl(req, res) {
    try {
      const { s3Key, uploadId, partNumber } = req.query;

      if (!s3Key || !uploadId || !partNumber) {
        return res
          .status(400)
          .json({ error: "s3Key, uploadId, and partNumber are required" });
      }

      const result = await this.getChunkUploadUrlUseCase.execute({
        s3Key,
        uploadId,
        partNumber,
      });
      return res.status(200).json({
        message: "Presigned URL generated successfully",
        data: result,
      });
    } catch (error) {
      console.error("Controller Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  async completeUpload(req, res) {
    try {
      const { fileId, uploadId, parts } = req.body;

      const userId = "user_test_123";

      if (!fileId || !uploadId || !parts || !Array.isArray(parts)) {
        return res.status(400).json({
          error:
            "Missing or invalid parameters. fileId, uploadId, and parts array are required.",
        });
      }

      const result = await this.completeUploadUseCase.execute({
        userId,
        fileId,
        uploadId,
        parts,
      });
      return res.status(200).json({
        message: "File upload completed and stitched successfully",
        data: result,
      });
    } catch (error) {
      console.error("Controller Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default FileController;
