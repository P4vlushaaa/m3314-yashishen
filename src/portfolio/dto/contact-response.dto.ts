import { ApiProperty } from '@nestjs/swagger';

export class ContactResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'email' })
    type: string;

    @ApiProperty({ example: 'pavel.yashishen@example.com' })
    value: string;
}
