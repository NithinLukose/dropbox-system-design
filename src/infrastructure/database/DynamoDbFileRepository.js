import { dynamoDocClient } from "../config/aws.js";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import File from "../../domain/entities/File.js";

class DynamoDbFileRepository {
  constructor() {
    this.tableName = process.env.DYNAMODB_TABLE_NAME || "Files";
  }

  /**
   * Persists or updates a File entity in DynamoDB
   * @param {File} file - Pure Domain Entity
   */
  async save(file) {
    const params = {
      TableName: this.tableName,
      Item: {
        user_id: file.userId,
        file_id: file.fileId,
        fileName: file.fileName,
        fileSize: file.fileSize,
        s3Key: file.s3Key,
        status: file.status,
        createdAt: file.createdAt,
      },
    };

    try {
      await dynamoDocClient.send(new PutCommand(params));
    } catch (error) {
      console.error("Error saving file to DynamoDB:", error);
      throw new Error("Database operation failed");
    }
  }
  /**
   * Optional: Helper to reconstruct a domain entity from raw DynamoDB data
   */
  _toDomain(item) {
    if (!item) return null;
    return new File({
      userId: item.user_id,
      fileId: item.file_id,
      fileName: item.fileName,
      fileSize: item.fileSize,
      s3Key: item.s3Key,
      status: item.status,
      createdAt: item.createdAt,
    });
  }

  async findById(userId, fileId) {
    const params = {
      TableName: this.tableName,
      Key: {
        user_id: userId,
        file_id: fileId,
      },
    };

    try {
      const response = await dynamoDocClient.send(new GetCommand(params));
      if (!response.Item) return null;
      return this._toDomain(response.Item);
    } catch (error) {
      console.error("Error fetching file from DynamoDB:", error);
      throw new Error("Database operation failed");
    }
  }
}

export default DynamoDbFileRepository;
