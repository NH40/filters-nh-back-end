import { Injectable } from '@nestjs/common'
import { AgeRating, Genre, Platform, Prisma } from '@prisma/client'
import { PaginationService } from 'src/pagination/pagination.service'
import { PrismaService } from 'src/prisma.service'
import { convertToNumber } from 'src/utils/convert-to-number'
import { EnumGameSort, GetAllGameDto } from './dto/get-all.game.dto'

@Injectable()
export class GameService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService
	) {}

	async getAll(dto: GetAllGameDto = {}) {
		const { perPage, skip } = this.paginationService.getPagination(dto)

		const filters = this.createFilter(dto)

		const games = await this.prisma.game.findMany({
			where: filters,
			orderBy: this.getSortOption(dto.sort),
			skip,
			take: perPage
		})

		return {
			games,
			length: await this.prisma.game.count({
				where: filters
			})
		}
	}

	private createFilter(dto: GetAllGameDto): Prisma.GameWhereInput {
		const filters: Prisma.GameWhereInput[] = []

		if (dto.searchTerm) filters.push(this.getSearchTermFilter(dto.searchTerm))

		if (dto.rating) filters.push(this.getRatingFilter(+dto.rating))

		if (dto.minPrice || dto.maxPrice)
			filters.push(
				this.getPriceFilter(
					convertToNumber(dto.minPrice),
					convertToNumber(dto.maxPrice)
				)
			)

		if (dto.genres) filters.push(this.getGenreFilter(dto.genres))

		if (dto.platform) filters.push(this.getPlatformFilter(dto.platform))

		if (dto.isAdultOnly !== undefined)
			filters.push(this.getAdultOnlyFilter(dto.isAdultOnly))

		return filters.length ? { AND: filters } : {}
	}

	private getSortOption(
		sort: EnumGameSort
	): Prisma.GameOrderByWithRelationInput[] {
		switch (sort) {
			case EnumGameSort.LOW_PRICE:
				return [{ price: 'asc' }]
			case EnumGameSort.HIGH_PRICE:
				return [{ price: 'desc' }]
			case EnumGameSort.OLDEST:
				return [{ releaseDate: 'asc' }]
			default:
				return [{ releaseDate: 'desc' }]
		}
	}

	private getSearchTermFilter(searchTerm: string): Prisma.GameWhereInput {
		return {
			OR: [
				{
					title: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				},
				{
					publisher: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				},
				{
					developer: {
						contains: searchTerm,
						mode: 'insensitive'
					}
				}
			]
		}
	}

	private getRatingFilter(rating: number): Prisma.GameWhereInput {
		return {
			rating: {
				gte: rating
			}
		}
	}

	private getPriceFilter(
		minPrice?: number,
		maxPrice?: number
	): Prisma.GameWhereInput {
		let priceFilter: Prisma.NestedFloatFilter | undefined = undefined

		if (minPrice) {
			priceFilter = {
				...priceFilter,
				gte: minPrice
			}
		}

		if (maxPrice) {
			priceFilter = {
				...priceFilter,
				lte: maxPrice
			}
		}

		return {
			price: priceFilter
		}
	}

	private getGenreFilter(genres: string): Prisma.GameWhereInput {
		const genresArray = genres.split('|') as Genre[]

		return {
			genres: {
				hasEvery: genresArray
			}
		}
	}

	private getPlatformFilter(platform: Platform): Prisma.GameWhereInput {
		return {
			platforms: {
				hasSome: [platform]
			}
		}
	}

	private getAdultOnlyFilter(isAdultOnlyProps: string): Prisma.GameWhereInput {
		const isAdultOnly = isAdultOnlyProps === 'true'

		return {
			ageRating: {
				in: isAdultOnly
					? [
							AgeRating.M,
							AgeRating.AO,
							AgeRating.E,
							AgeRating.E10Plus,
							AgeRating.T
						]
					: [AgeRating.E, AgeRating.E10Plus, AgeRating.T]
			}
		}
	}
}
