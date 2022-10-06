import path from 'path'
import fs from 'fs'
import mime from 'mime'
import aws, { S3 } from 'aws-sdk'
import * as dotenv from 'dotenv'
import uploadConfig from '../config/upload'

dotenv.config()

class S3Storage {
  private readonly client: S3

  constructor () {
    this.client = new aws.S3({
      region: 'us-east-1'
    })
  }

  async saveFile (filename: string): Promise<void> {
    const originalPath = path.resolve(uploadConfig.directory, filename)

    const ContentType = mime.getType(originalPath)

    if (ContentType === null) {
      throw new Error('File not found')
    }

    const fileContent = await fs.promises.readFile(originalPath)

    await this.client
      .putObject({
        Bucket: 'patrimony-management-images',
        Key: filename,
        ACL: 'public-read',
        Body: fileContent,
        ContentType
      })
      .promise()

    await fs.promises.unlink(originalPath)
  }

  async deleteFile (filename: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: 'patrimony-management-images',
        Key: filename
      })
      .promise()
  }
}

export default S3Storage
