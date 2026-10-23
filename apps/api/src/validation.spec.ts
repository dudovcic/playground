import "reflect-metadata";
import { BadRequestException } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { CreateProductDto } from "./products/dto/create-product.dto";
import { CreateUserDto } from "./users/dto/create-user.dto";
import { createValidationPipe } from "./validation";

function validate<T>(metatype: new () => T, body: unknown) {
	return createValidationPipe().transform(body, {
		type: "body",
		metatype,
	});
}

describe("request body validation", () => {
	it("accepts a valid user body", async () => {
		await expect(
			validate(CreateUserDto, {
				name: "Ada Lovelace",
				email: "ada@example.com",
				phone: "+1-555-0101",
			}),
		).resolves.toMatchObject({
			name: "Ada Lovelace",
			email: "ada@example.com",
		});
	});

	it("rejects a user body with an invalid email and an unknown field", async () => {
		await expect(
			validate(CreateUserDto, {
				name: "Ada",
				email: "not-an-email",
				role: "admin",
			}),
		).rejects.toBeInstanceOf(BadRequestException);
	});

	it("accepts a valid product body and coerces price", async () => {
		await expect(
			validate(CreateProductDto, {
				name: "Coffee",
				price: "2499",
				sku: "FOOD-CF-001",
				category: "Food & Beverage",
			}),
		).resolves.toMatchObject({
			name: "Coffee",
			price: 2499,
			sku: "FOOD-CF-001",
		});
	});

	it("rejects a product body with a bad sku or negative price", async () => {
		await expect(
			validate(CreateProductDto, {
				name: "Coffee",
				price: -1,
				sku: "bad sku",
				category: "Food",
			}),
		).rejects.toBeInstanceOf(BadRequestException);
	});
});
