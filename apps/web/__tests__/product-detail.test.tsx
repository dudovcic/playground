import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProductDetail } from "../src/components/product-detail";

const product = {
	id: 2,
	name: "Coffee",
	description: "Beans",
	price: 2499,
	sku: "FOOD-CF-001",
	category: "Food & Beverage",
	brand: "BeanCraft",
	rating: 4.2,
	review_count: 12,
	in_stock: 1,
	stock_quantity: 40,
	discount_percent: 10,
};

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("ProductDetail", () => {
	it("shows the product card", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				text: async () => JSON.stringify(product),
			}),
		);

		render(<ProductDetail id="2" />);

		expect(await screen.findByText("Coffee")).toBeDefined();
		expect(screen.getByText("BeanCraft · Food & Beverage")).toBeDefined();
		expect(screen.getByText("$24.99")).toBeDefined();
		expect(screen.getByText("-10%")).toBeDefined();
		expect(screen.getByText("4.2 rating")).toBeDefined();
		expect(screen.getByText("12 reviews")).toBeDefined();
		expect(screen.getByText("40 in stock")).toBeDefined();
		expect(
			screen.getByRole("link", { name: "Back to products" }).getAttribute("href"),
		).toBe("/products");
	});

	it("shows an empty state when the product does not exist", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				text: async () => "",
			}),
		);

		render(<ProductDetail id="99999" />);

		expect(await screen.findByText("No product")).toBeDefined();
		expect(screen.getByText("There is no product to show.")).toBeDefined();
	});

	it("shows an error and retries when the API is unreachable", async () => {
		const fetchMock = vi
			.fn()
			.mockRejectedValueOnce(new Error("network"))
			.mockResolvedValueOnce({
				ok: true,
				text: async () => JSON.stringify(product),
			});
		vi.stubGlobal("fetch", fetchMock);

		render(<ProductDetail id="2" />);

		expect(await screen.findByText("Could not load product")).toBeDefined();
		screen.getByRole("button", { name: "Try again" }).click();
		expect(await screen.findByText("Coffee")).toBeDefined();
	});
});
