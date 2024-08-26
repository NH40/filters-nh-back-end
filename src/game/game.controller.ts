import {
	Controller,
	Get,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { GetAllGameDto } from './dto/get-all.game.dto'
import { GameService } from './game.service'

@Controller('games')
export class GameController {
	constructor(private readonly gameService: GameService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: GetAllGameDto) {
		return this.gameService.getAll(queryDto)
	}
}
