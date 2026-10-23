import type { CreateProduct } from "@zapp/types";
import { Type } from "class-transformer";
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	Min,
} from "class-validator";

export class CreateProductDto implements CreateProduct {
	@IsString()
	@IsNotEmpty()
	name!: string;

	@IsOptional()
	@IsString()
	description?: string;

	@Type(() => Number)
	@IsInt()
	@Min(0)
	price!: number;

	@IsString()
	@IsNotEmpty()
	@Matches(/^[A-Za-z0-9-]+$/)
	sku!: string;

	@IsString()
	@IsNotEmpty()
	category!: string;

	@IsOptional()
	@IsString()
	brand?: string;
}
