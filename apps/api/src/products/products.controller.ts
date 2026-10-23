import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Get()
	findAll() {
		return this.productsService.findAll();
	}

	@Get(":id")
	findById(@Param("id") id: string) {
		return this.productsService.findById(Number(id));
	}

	@Post()
	create(@Body() body: CreateProductDto) {
		return this.productsService.create(body);
	}
}
