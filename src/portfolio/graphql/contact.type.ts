import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Контакт профиля' })
export class ContactType {
    @Field(() => Int, { description: 'Идентификатор контакта' })
    id: number;

    @Field({ description: 'Тип контакта' })
    type: string;

    @Field({ description: 'Значение контакта' })
    value: string;
}