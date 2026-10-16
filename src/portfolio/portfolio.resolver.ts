import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { PortfolioService } from './portfolio.service';
import { PortfolioType } from './graphql/portfolio.type';
import { ProjectType } from '../projects/graphql/project.type';
import { SkillType } from '../skills/graphql/skill.type';
import { ContactType } from './graphql/contact.type';

@Resolver(() => PortfolioType)
export class PortfolioResolver {
    constructor(private readonly portfolioService: PortfolioService) {}

    @Query(() => [PortfolioType], {
        name: 'portfolios',
        description: 'Получить список профилей',
    })
    async findAll() {
        return this.portfolioService.findAll();
    }

    @Query(() => PortfolioType, {
        name: 'portfolio',
        description: 'Получить профиль по id',
    })
    async findOne(
        @Args('id', { type: () => Int }) id: number,
    ) {
        return this.portfolioService.findOne(id);
    }

    @ResolveField(() => [ProjectType], { description: 'Проекты профиля' })
    async projects(@Parent() portfolio: PortfolioType) {
        return this.portfolioService.findProjectsByProfileId(portfolio.id);
    }

    @ResolveField(() => [SkillType], { description: 'Навыки профиля' })
    async skills(@Parent() portfolio: PortfolioType) {
        return this.portfolioService.findSkillsByProfileId(portfolio.id);
    }

    @ResolveField(() => [ContactType], { description: 'Контакты профиля' })
    async contacts(@Parent() portfolio: PortfolioType) {
        return this.portfolioService.findContactsByProfileId(portfolio.id);
    }

}
