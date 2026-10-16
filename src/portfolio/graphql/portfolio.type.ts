import {Field, Int, ObjectType} from "@nestjs/graphql";
import {ProjectType} from "../../projects/graphql/project.type";
import {SkillType} from "../../skills/graphql/skill.type";
import {ContactType} from "./contact.type";

@ObjectType({ description: 'Профиль портфолио' })
export class PortfolioType {
    @Field(() => Int, { description: 'Идентификатор профиля' })
    id: number;

    @Field({ nullable: true, description: 'Полное имя владельца портфолио' })
    fullName?: string | null;

    @Field({ nullable: true, description: 'Подзаголовок профиля' })
    subtitle?: string | null;

    @Field({ nullable: true, description: 'Краткое описание профиля' })
    shortBio?: string | null;

    @Field(() => [ProjectType], { description: 'Проекты профиля' })
    projects: ProjectType[];

    @Field(() => [SkillType], { description: 'Навыки профиля' })
    skills: SkillType[];

    @Field(() => [ContactType], { description: 'Контакты профиля' })
    contacts: ContactType[];
}
