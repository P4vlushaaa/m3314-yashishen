import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Проект портфолио' })
export class ProjectType {
    @Field(() => Int, { description: 'Идентификатор проекта' })
    id: number;

    @Field({ description: 'Название проекта' })
    title: string;

    @Field({ description: 'Описание проекта' })
    description: string;

    @Field({ nullable: true, description: 'Ссылка на репозиторий' })
    repositoryUrl?: string | null;

    @Field({ nullable: true, description: 'Ссылка на изображение' })
    imageUrl?: string | null;
}