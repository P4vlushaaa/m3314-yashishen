import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { ProjectType } from './graphql/project.type';
import { CreateProjectInput } from './graphql/create-project.input';
import { UpdateProjectInput } from './graphql/update-project.input';

@Resolver(() => ProjectType)
export class ProjectsResolver {
    constructor(private readonly projectsService: ProjectsService) {}

    @Query(() => [ProjectType], {
        name: 'projects',
        description: 'Получить список проектов',
    })
    async findAll(
        @Args('page', { type: () => Int, nullable: true }) page = 1,
        @Args('limit', { type: () => Int, nullable: true }) limit = 10,
    ) {
        const result = await this.projectsService.findAllPaginated(page, limit);
        return result.items;
    }

    @Query(() => ProjectType, { name: 'project', description: 'Получить проект по id' })
    async findOne(
        @Args('id', { type: () => Int }) id: number,
    ) {
        return this.projectsService.findOne(id);
    }

    @Mutation(() => ProjectType, { name: 'createProject', description: 'Создать проект' })
    async create(
        @Args('input') input: CreateProjectInput,
    ) {
        return this.projectsService.create(input);
    }

    @Mutation(() => ProjectType, { name: 'updateProject', description: 'Обновить проект' })
    async update(
        @Args('input') input: UpdateProjectInput,
    ) {
        return this.projectsService.update(input.id, input);
    }

    @Mutation(() => Boolean, { name: 'deleteProject', description: 'Удалить проект' })
    async remove(
        @Args('id', { type: () => Int }) id: number,
    ) {
        await this.projectsService.remove(id);
        return true;
    }
}