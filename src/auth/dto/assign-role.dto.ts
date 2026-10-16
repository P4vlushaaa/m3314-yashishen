import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class AssignRoleDto {
    @ApiProperty({ example: 'ecba26c7-0c5f-4de3-9634-e21dd8a88a1e' })
    @IsString()
    externalAuthId: string;

    @ApiProperty({ example: 'admin', enum: ['admin', 'user'] })
    @IsString()
    @IsIn(['admin', 'user'])
    role: string;
}