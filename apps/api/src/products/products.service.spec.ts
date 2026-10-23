import { describe, expect, it, vi } from "vitest";
import type { DatabaseService } from "../database/database.service";
import { ProductsService } from "./products.service";

describe("ProductsService.findPage", () => {
	it("filters by search and category and returns every category", () => {
		const get = vi.fn().mockReturnValue({ total: 2 });
		const query = vi
			.fn()
			.mockReturnValueOnce([{ id: 1, name: "Coffee" }])
			.mockReturnValueOnce([
				{ category: "Drinks" },
				{ category: "Electronics" },
			]);
		const db = { get, query } as unknown as DatabaseService;
		const service = new ProductsService(db);

		const page = service.findPage(
			{ page: 2, limit: 12, offset: 12 },
			{ search: "100%", category: "Drinks" },
		);

		expect(get).toHaveBeenCalledWith(
			expect.stringContaining("COUNT(*) AS total"),
			["%100\\%%", "%100\\%%", "%100\\%%", "Drinks"],
		);
		expect(query).toHaveBeenCalledWith(
			expect.stringContaining("LIMIT ? OFFSET ?"),
			["%100\\%%", "%100\\%%", "%100\\%%", "Drinks", 12, 12],
		);
		expect(page).toMatchObject({
			total: 2,
			page: 2,
			limit: 12,
			categories: ["Drinks", "Electronics"],
		});
		expect(page.data).toEqual([{ id: 1, name: "Coffee" }]);
	});
});
