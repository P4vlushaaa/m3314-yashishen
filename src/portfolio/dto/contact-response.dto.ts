import { ApiProperty } from '@nestjs/swagger';

export class ContactResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'email' })
    type: string;

    @ApiProperty({ example: 'pavel.yashishen@example.com' })
    value: string;

    @ApiProperty({ example: '2026-04-15T13:51:21.000Z' })
    createdAt: Date;

    @ApiProperty({ example: 1 })
    profileId: number;
}