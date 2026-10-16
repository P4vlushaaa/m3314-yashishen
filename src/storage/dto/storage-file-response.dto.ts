import { ApiProperty } from '@nestjs/swagger';

export class StorageFileResponseDto {
    @ApiProperty({
        example: 'projects/example.png',
        description: 'Ключ объекта в хранилище',
    })
    key: string;

    @ApiProperty({
        example: 'https://storage.yandexcloud.net/m3315-bovt/projects/example.png',
        description: 'Публичная ссылка на файл',
    })
    url: string;

    @ApiProperty({
        example: 6185,
        description: 'Размер файла в байтах',
    })
    size: number;

    @ApiProperty({
        example: '2026-04-18T20:57:44.000Z',
        nullable: true,
        description: 'Дата последнего изменения файла',
    })
    lastModified: Date | null;
}