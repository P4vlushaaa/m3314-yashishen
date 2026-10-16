import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SkillResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Java' })
    title: string;

    @ApiProperty({ example: 'Владею языком Java и основными библиотеками и фреймворками.' })
    description: string;

    @ApiPropertyOptional({ example: '/img/java2-logo.png' })
    imageUrl?: string | null;

    @ApiProperty({ example: '2026-04-15T13:51:21.000Z' })
    createdAt: Date;
    @ApiProperty({ example: 1 })
    profileId: number;
}