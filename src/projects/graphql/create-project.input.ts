import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength } from 'class-validator';

@InputType({ description: 'Данные для создания проекта' })
export class CreateProjectInput {
    @Field({ description: 'Название проекта' })
    @IsString()
    @MaxLength(255)
    title: string;

    @Field({ description: 'Описание проекта' })
    @IsString()
    description: string;

    @Field({ nullable: true, description: 'Ссылка на репозиторий' })
    @IsOptional()
    @IsString()
    repositoryUrl?: string;

    @Field({ nullable: true, description: 'Ссылка на изображение' })
    @IsOptional()
    @IsString()
    imageUrl?: string;
}