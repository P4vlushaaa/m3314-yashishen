import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType({ description: 'Данные для обновления проекта' })
export class UpdateProjectInput {
    @Field(() => Int, { description: 'Идентификатор проекта' })
    @IsInt()
    id: number;

    @Field({ nullable: true, description: 'Название проекта' })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    title?: string;

    @Field({ nullable: true, description: 'Описание проекта' })
    @IsOptional()
    @IsString()
    description?: string;

    @Field({ nullable: true, description: 'Ссылка на репозиторий' })
    @IsOptional()
    @IsString()
    repositoryUrl?: string;

    @Field({ nullable: true, description: 'Ссылка на изображение' })
    @IsOptional()
    @IsString()
    imageUrl?: string;
}