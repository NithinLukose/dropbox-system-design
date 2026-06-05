import express from "express";
import DynamoDbFileRepository from "../../infrastructure/database/DynamoDbFileRepository.js";
import S3StorageService from "../../infrastructure/storage/S3StorageService.js";
import InitiateUpload from "../../application/use-cases/InitiateUpload.js";
import GetChunkUploadUrl from "../../application/use-cases/GetChunkUploadUrl.js";
import CompleteUpload from "../../application/use-cases/completeUpload.js";
import FileController from "./FileController.js";

const router = express.Router();

const fileRepository = new DynamoDbFileRepository();
const storageService = new S3StorageService();
const initiateUploadUseCase = new InitiateUpload(
  fileRepository,
  storageService,
);
const getChunkUploadUrlUseCase = new GetChunkUploadUrl(storageService);
const completeUploadUseCase = new CompleteUpload(
  fileRepository,
  storageService,
);
const fileController = new FileController(
  initiateUploadUseCase,
  getChunkUploadUrlUseCase,
  completeUploadUseCase,
);

router.post(
  "/files/upload/initiate",
  fileController.initiateUpload.bind(fileController),
);

router.get(
  "/files/upload/presign-part",
  fileController.getChunkUploadUrl.bind(fileController),
);

router.post(
  "/files/upload/complete",
  fileController.completeUpload.bind(fileController),
);
export default router;
