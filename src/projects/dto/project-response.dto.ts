import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProjectResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Сервис учета учебных задач' })
    title: string;

    @ApiProperty({ example: 'Backend-приложение для хранения задач, дедлайнов и статусов выполнения.' })
    description: string;

    @ApiPropertyOptional({ example: 'https://github.com/pavel-yashishen/task-tracker' })
    repositoryUrl?: string | null;

    @ApiPropertyOptional({ example: '/img/image-for-projects-1.png' })
    imageUrl?: string | null;

    @ApiProperty({ example: '2026-04-15T13:51:21.000Z' })
    createdAt: Date;
    @ApiProperty({ example: 1 })
    profileId: number;
}
