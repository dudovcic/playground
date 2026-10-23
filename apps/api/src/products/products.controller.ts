import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { parsePagination } from "../pagination";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Get()
	findAll(
		@Query("page") page?: string,
		@Query("limit") limit?: string,
		@Query("search") search?: string,
		@Query("category") category?: string,
	) {
		const hasFilter = Boolean(search?.trim() || category?.trim());
		if (page === undefined && limit === undefined && !hasFilter) {
			return this.productsService.findAll();
		}
		return this.productsService.findPage(parsePagination(page, limit), {
			search,
			category,
		});
	}

	@Get(":id")
	findById(@Param("id") id: string) {
		return this.productsService.findById(Number(id));
	}

	@Post()
	create(
		@Body()
		body: {
			name: string;
			description?: string;
			price: number;
			sku: string;
			category: string;
			brand?: string;
		},
	) {
		return this.productsService.create(body);
	}
}
