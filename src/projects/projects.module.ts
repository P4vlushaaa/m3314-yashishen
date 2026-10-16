import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsApiController } from './projects.api.controller';
import { ProjectsService } from './projects.service';
import { PortfolioModule } from '../portfolio/portfolio.module';
import {ProjectsResolver} from "./projects.resolver";
import {StorageModule} from "../storage/storage.module";

@Module({
  imports: [PortfolioModule, StorageModule],
  controllers: [ProjectsController, ProjectsApiController],
  providers: [ProjectsService, ProjectsResolver],
  exports: [ProjectsService],
})
export class ProjectsModule {}