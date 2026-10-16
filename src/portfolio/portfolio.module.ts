import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import {PortfolioApiController} from "./portfolio.api.controller";
import {PortfolioResolver} from "./portfolio.resolver";

@Module({
  controllers: [PortfolioController, PortfolioApiController],
  providers: [PortfolioService, PortfolioResolver],
  exports: [PortfolioService],
})
export class PortfolioModule {}