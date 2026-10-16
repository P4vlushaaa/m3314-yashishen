import { ApiProperty } from '@nestjs/swagger';

export class UploadSkillImageDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Файл изображения навыка',
    })
    file: any;
}
