import { ApiProperty } from '@nestjs/swagger';

export class PortfolioResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Павел Ящищен' })
    fullName: string;

    @ApiProperty({ example: 'Backend-разработчик и студент ИТМО' })
    subtitle: string;

    @ApiProperty({
        example:
            'Разрабатываю серверные приложения, работаю с базами данных и проектирую API.',
    })
    bio: string;

    @ApiProperty({ example: '2026-04-15T13:51:21.000Z' })
    createdAt: Date;

    @ApiProperty({ example: 1 })
    userId: number;
}