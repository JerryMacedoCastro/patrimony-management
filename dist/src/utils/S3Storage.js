"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mime_1 = __importDefault(require("mime"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv = __importStar(require("dotenv"));
const upload_1 = __importDefault(require("../config/upload"));
dotenv.config();
const keyId = process.env.aws_access_key_id !== undefined ? process.env.aws_access_key_id : '';
const secretKey = process.env.aws_secret_access_key !== undefined ? process.env.aws_secret_access_key : '';
class S3Storage {
    constructor() {
        this.client = new aws_sdk_1.default.S3({
            region: 'us-east-1',
            credentials: {
                accessKeyId: keyId,
                secretAccessKey: secretKey,
                sessionToken: process.env.aws_session_token
            }
        });
    }
    saveFile(filename, folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalPath = path_1.default.resolve(upload_1.default.directory, filename);
            const ContentType = mime_1.default.getType(originalPath);
            if (ContentType === null) {
                throw new Error('File not found');
            }
            const fileContent = yield fs_1.default.promises.readFile(originalPath);
            yield this.client
                .putObject({
                Bucket: 'patrimony-management-images',
                Key: `${folder}/${filename}`,
                ACL: 'public-read',
                Body: fileContent,
                ContentType
            })
                .promise();
            yield fs_1.default.promises.unlink(originalPath);
        });
    }
    getImagesFromFolder(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const imagesList = this.client.listObjectsV2({
                Bucket: 'patrimony-management-images',
                Prefix: folder
            }).promise();
            const content = (yield imagesList).Contents;
            return content;
        });
    }
    deleteFile(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client
                .deleteObject({
                Bucket: 'patrimony-management-images',
                Key: filename
            })
                .promise();
        });
    }
    getFile(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield this.getImagesFromFolder(folder);
            if (content === undefined)
                return [];
            const LinkArray = [];
            content.forEach((item) => {
                const preSignedURL = this.client.getSignedUrl('getObject', { Bucket: 'patrimony-management-images', Key: item.Key });
                LinkArray.push(preSignedURL);
            });
            return LinkArray;
        });
    }
}
exports.default = S3Storage;
