import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateProjectDto {
    @ApiProperty({ example: 'Сервис учета учебных задач' })
    @IsString()
    @MaxLength(255)
    title: string;

    @ApiProperty({ example: 'Backend-приложение для хранения задач, дедлайнов и статусов выполнения.' })
    @IsString()
    description: string;

    @ApiPropertyOptional({ example: 'https://github.com/pavel-yashishen/task-tracker' })
    @IsOptional()
    @IsString()
    repositoryUrl?: string;

    @ApiPropertyOptional({ example: '/img/image-for-projects-1.png' })
    @IsOptional()
    @IsString()
    imageUrl?: string;
}
