import { ApiProperty } from '@nestjs/swagger';
import { StorageFileResponseDto } from './storage-file-response.dto';

export class StorageFilesListResponseDto {
    @ApiProperty({
        type: [StorageFileResponseDto],
        description: 'Список файлов на текущей странице',
    })
    items: StorageFileResponseDto[];

    @ApiProperty({
        example: 15,
        description: 'Общее количество файлов',
    })
    total: number;

    @ApiProperty({
        example: 1,
        description: 'Текущая страница',
    })
    page: number;

    @ApiProperty({
        example: 10,
        description: 'Размер страницы',
    })
    limit: number;
}