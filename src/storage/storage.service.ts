import { Injectable } from '@nestjs/common';
import {ListObjectsV2Command, PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class StorageService {
    private readonly client: S3Client;
    private readonly bucket = process.env.S3_BUCKET!;
    private readonly publicBaseUrl = process.env.S3_PUBLIC_BASE_URL!;

    constructor() {
        this.client = new S3Client({
            region: process.env.S3_REGION,
            endpoint: process.env.S3_ENDPOINT,
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
            },
        });
    }

    async uploadFile(file: Express.Multer.File, folder = 'uploads'): Promise<string> {
        const extension = extname(file.originalname);
        const key = `${folder}/${randomUUID()}${extension}`;

        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }),
        );

        return `${this.publicBaseUrl}/${key}`;
    }

    async listFiles(folder = 'uploads', page = 1, limit = 10) {
        const command = new ListObjectsV2Command({
            Bucket: this.bucket,
            Prefix: `${folder}/`,
        });

        const response = await this.client.send(command);

        const allFiles =
            response.Contents?.filter((item) => item.Key && !item.Key.endsWith('/')).map((item) => ({
                key: item.Key!,
                url: `${this.publicBaseUrl}/${item.Key!}`,
                size: item.Size ?? 0,
                lastModified: item.LastModified ?? null,
            })) ?? [];

        const start = (page - 1) * limit;
        const end = start + limit;

        return {
            items: allFiles.slice(start, end),
            total: allFiles.length,
            page,
            limit,
        };
    }
}