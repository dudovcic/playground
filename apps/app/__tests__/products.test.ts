import { describe, expect, it } from "vitest";
import { isInStock, productPath } from "../src/lib/product";

describe("product helpers", () => {
	it("builds a product detail path", () => {
		expect(productPath(10)).toBe("/products/10");
	});

	it("treats a positive in_stock flag as available", () => {
		expect(isInStock(1)).toBe(true);
		expect(isInStock(0)).toBe(false);
	});
});
