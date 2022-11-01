import path from 'path'
import fs from 'fs'
import mime from 'mime'
import aws, { S3 } from 'aws-sdk'
import * as dotenv from 'dotenv'
import uploadConfig from '../config/upload'
import * as Minio from 'minio'

dotenv.config()

const keyId = process.env.aws_access_key_id !== undefined ? process.env.aws_access_key_id : ''
const secretKey = process.env.aws_secret_access_key !== undefined ? process.env.aws_secret_access_key : ''
class S3Storage {
  private readonly client: S3
  private readonly clientMinIO: Minio.Client
  constructor () {
    this.client = new aws.S3({
      region: 'us-east-1',
      credentials: {
        accessKeyId: keyId,
        secretAccessKey: secretKey,
        sessionToken: process.env.aws_session_token
      },
      endpoint: 'http://play.minio.io:9000'
    })

    this.clientMinIO = new Minio.Client({
      endPoint: 'play.min.io',
      port: 9000,
      useSSL: true,
      accessKey: 'Q3AM3UQ867SPQQA43P2F',
      secretKey: 'zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG'
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

  async saveFileMinIO (filename: string, folder: string): Promise<void> {
    const originalPath = path.resolve(uploadConfig.directory, filename)

    const ContentType = mime.getType(originalPath)

    if (ContentType === null) {
      throw new Error('File not found')
    }

    const fileContent = await fs.promises.readFile(originalPath)
    this.clientMinIO.putObject('patrimony-management-images', `${folder}/${filename}`, fileContent,
      function (err, etag) {
        if (err !== null) {
          throw new Error(`Erro: ${err.message}`)
        } else {
          console.log(etag)
        }
      })
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

  async getImagesFromFolderMinIO (folder: string): Promise<any> {
    const objectsList = await new Promise((resolve, reject) => {
      const objectsListTemp: string[] = []
      const stream = this.clientMinIO.listObjectsV2('patrimony-management-images', folder, true, '')

      stream.on('data', obj => objectsListTemp.push(obj.name))
      stream.on('error', reject)
      stream.on('end', () => {
        resolve(objectsListTemp)
      })
    })

    return objectsList
  }

  async getImagesUrlMinIO (folder: string): Promise<string[]> {
    const objectsListTemp: string[] = []
    const objects = await this.getImagesFromFolderMinIO(folder)
    objects.map((obj: string) =>
      this.clientMinIO.presignedGetObject('patrimony-management-images', obj, 24 * 60 * 60, function (err, presignedUrl) {
        if (err != null) return console.log(err)
        objectsListTemp.push(presignedUrl)
      })
    )

    return objectsListTemp
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
