import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SyncUserDto {
    @ApiProperty({ example: 'test123@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'ecba26c7-0c5f-4de3-9634-e21dd8a88a1e' })
    @IsString()
    externalAuthId: string;
}