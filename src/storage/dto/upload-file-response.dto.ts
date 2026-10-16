import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
    @ApiProperty({
        example: 'https://storage.yandexcloud.net/m3315-bovt/projects/example.png',
        description: 'Публичная ссылка на загруженный файл',
    })
    url: string;
}