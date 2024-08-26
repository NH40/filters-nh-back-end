import { Platform } from '@prisma/client'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { PaginationDto } from 'src/pagination/pagination.dto'

export enum EnumGameSort {
	LOW_PRICE = 'LOW_PRICE',
	HIGH_PRICE = 'HIGH_PRICE',
	OLDEST = 'OLDEST',
	NEWEST = 'NEWEST'
}

export class GetAllGameDto extends PaginationDto {
	@IsOptional()
	@IsEnum(EnumGameSort)
	sort?: EnumGameSort

	@IsOptional()
	@IsString()
	searchTerm?: string

	@IsOptional()
	@IsString()
	genres?: string

	@IsOptional()
	@IsEnum(Platform)
	platform?: Platform

	@IsOptional()
	@IsString()
	rating?: string

	@IsOptional()
	@IsString()
	minPrice?: string

	@IsOptional()
	@IsString()
	maxPrice?: string

	@IsOptional()
	@IsString()
	isAdultOnly?: string
}

/* const queryParameters = {
  sort: 'HIGH_PRICE',          // EnumGameSort
  searchTerm: 'Witcher',       // Поиск по ключевому слову
  genres: ['RPG', 'Action'],   // Фильтрация по жанрам
  platforms: ['PC', 'PlayStation'],  // Фильтрация по платформам
  rating: '9',             // Фильтрация по рейтингу 9 или больше
  minPrice: '20',              // Минимальная цена
  maxPrice: '60',              // Максимальная цена
  isAdultOnly: true,           // Фильтрация по возрастному рейтингу 18+
  page: 1,                     // Пагинация: номер страницы
  perPage: 10                  // Пагинация: количество элементов на странице
}; */
