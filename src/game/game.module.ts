import { Module } from '@nestjs/common'
import { PaginationModule } from 'src/pagination/pagination.module'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { GameController } from './game.controller'
import { GameService } from './game.service'

@Module({
	imports: [PaginationModule],
	controllers: [GameController],
	providers: [GameService, PrismaService, PaginationService]
})
export class GameModule {}
