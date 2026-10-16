import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Навык профиля' })
export class SkillType {
    @Field(() => Int, { description: 'Идентификатор навыка' })
    id: number;

    @Field({ description: 'Название навыка' })
    title: string;

    @Field({ description: 'Описание навыка' })
    description: string;

    @Field({ nullable: true, description: 'Ссылка на изображение' })
    imageUrl?: string | null;
}