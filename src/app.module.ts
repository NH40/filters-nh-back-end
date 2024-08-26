import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { path } from 'app-root-path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { GameModule } from './game/game.module';
import { PaginationModule } from './pagination/pagination.module';

@Module({
	imports: [
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: '/uploads'
		}),
		GameModule,
		PaginationModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
