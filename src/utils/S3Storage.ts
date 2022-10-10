import path from 'path'
import fs from 'fs'
import mime from 'mime'
import aws, { S3 } from 'aws-sdk'
import * as dotenv from 'dotenv'
import uploadConfig from '../config/upload'

dotenv.config()

const keyId = process.env.aws_access_key_id !== undefined ? process.env.aws_access_key_id : ''
const secretKey = process.env.aws_secret_access_key !== undefined ? process.env.aws_secret_access_key : ''
class S3Storage {
  private readonly client: S3
  constructor () {
    this.client = new aws.S3({
      region: 'us-east-1',
      credentials: {
        accessKeyId: keyId,
        secretAccessKey: secretKey,
        sessionToken: process.env.aws_session_token
      }
    })
  }

  async saveFile (filename: string, folder: string): Promise<void> {
    const originalPath = path.resolve(uploadConfig.directory, filename)

    const ContentType = mime.getType(originalPath)

    if (ContentType === null) {
      throw new Error('File not found')
    }

    const fileContent = await fs.promises.readFile(originalPath)

    await this.client
      .putObject({
        Bucket: 'patrimony-management-images',
        Key: `${folder}/${filename}`,
        ACL: 'public-read',
        Body: fileContent,
        ContentType
      })
      .promise()

    await fs.promises.unlink(originalPath)
  }

  async getImagesFromFolder (folder: string): Promise<S3.ObjectList | undefined> {
    const imagesList = this.client.listObjectsV2({
      Bucket: 'patrimony-management-images',
      Prefix: folder
    }).promise()

    const content = (await imagesList).Contents

    return content
  }

  async deleteFile (filename: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: 'patrimony-management-images',
        Key: filename
      })
      .promise()
  }

  async getFile (folder: string): Promise<string[]> {
    const content = await this.getImagesFromFolder(folder)
    if (content === undefined) return []
    const LinkArray: string[] = []
    content.forEach((item) => {
      const preSignedURL = this.client.getSignedUrl(
        'getObject', { Bucket: 'patrimony-management-images', Key: item.Key }
      )
      LinkArray.push(preSignedURL)
    })

    return LinkArray
  }
}
export default S3Storage
