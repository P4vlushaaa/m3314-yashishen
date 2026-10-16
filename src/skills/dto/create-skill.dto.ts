import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSkillDto {
    @ApiProperty({ example: 'Java' })
    @IsString()
    @MaxLength(255)
    title: string;

    @ApiProperty({ example: 'Владею языком Java и основными библиотеками и фреймворками.' })
    @IsString()
    description: string;

    @ApiPropertyOptional({ example: '/img/java2-logo.png' })
    @IsOptional()
    @IsString()
    imageUrl?: string;
}