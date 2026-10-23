import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProductList } from "../src/components/product-list";

function productPage(
	data: unknown[],
	total = data.length,
	categories: string[] = [],
) {
	return { data, page: 1, limit: 12, total, categories };
}

const product = {
	id: 1,
	name: "Coffee",
	description: "Beans",
	price: 350,
	sku: "COF-1",
	category: "Drinks",
	brand: "Zapp",
	rating: 5,
	review_count: 1,
	in_stock: 1,
	stock_quantity: 4,
	discount_percent: 0,
};

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("ProductList", () => {
	it("shows an empty state when the API returns no products", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => productPage([]),
			}),
		);

		render(<ProductList />);

		expect(await screen.findByText("No products")).toBeDefined();
		expect(screen.getByText("There are no products to show.")).toBeDefined();
	});

	it("shows an error and retries when the API is unreachable", async () => {
		const fetchMock = vi
			.fn()
			.mockRejectedValueOnce(new Error("network"))
			.mockResolvedValueOnce({
				ok: true,
				json: async () => productPage([product], 1, ["Drinks"]),
			});
		vi.stubGlobal("fetch", fetchMock);

		render(<ProductList />);

		expect(await screen.findByText("Could not load products")).toBeDefined();
		screen.getByRole("button", { name: "Try again" }).click();
		expect(await screen.findByText("Coffee")).toBeDefined();
		expect(screen.getByRole("option", { name: "Drinks" })).toBeDefined();
		expect(
			screen.getByRole("link", { name: /Coffee/ }).getAttribute("href"),
		).toBe("/products/1");
	});

	it("does not crash when the API returns a non-array body", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({ message: "nope" }),
			}),
		);

		render(<ProductList />);

		expect(await screen.findByText("Could not load products")).toBeDefined();
	});
});
