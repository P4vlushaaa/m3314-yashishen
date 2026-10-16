import { Module } from '@nestjs/common';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
import { PortfolioModule } from '../portfolio/portfolio.module';
import {SkillsApiController} from "./skills.api.controller";
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [PortfolioModule, StorageModule],
  controllers: [SkillsController, SkillsApiController],
  providers: [SkillsService],
  exports: [SkillsService],
})
export class SkillsModule {}
