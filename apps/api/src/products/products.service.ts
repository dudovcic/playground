import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { likeTerm, type Page, type PageQuery } from "../pagination";

export interface ProductListQuery {
	search?: string;
	category?: string;
}

@Injectable()
export class ProductsService {
	constructor(private readonly db: DatabaseService) {}

	findAll() {
		return this.db.query("SELECT * FROM products ORDER BY id ASC");
	}

	findPage(
		query: PageQuery,
		filters: ProductListQuery = {},
	): Page<Record<string, unknown>> & { categories: string[] } {
		const clauses: string[] = [];
		const params: unknown[] = [];
		const search = filters.search?.trim();
		const category = filters.category?.trim();

		if (search) {
			clauses.push(
				"(name LIKE ? ESCAPE '\\' OR IFNULL(brand, '') LIKE ? ESCAPE '\\' OR sku LIKE ? ESCAPE '\\')",
			);
			const term = likeTerm(search);
			params.push(term, term, term);
		}
		if (category) {
			clauses.push("category = ?");
			params.push(category);
		}

		const where = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
		const totalRow = this.db.get<{ total: number }>(
			`SELECT COUNT(*) AS total FROM products ${where}`,
			params,
		);
		const data = this.db.query<Record<string, unknown>>(
			`SELECT * FROM products ${where} ORDER BY id ASC LIMIT ? OFFSET ?`,
			[...params, query.limit, query.offset],
		);
		const categories = this.db
			.query<{ category: string }>(
				"SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != '' ORDER BY category ASC",
			)
			.map((row) => row.category);

		return {
			data,
			page: query.page,
			limit: query.limit,
			total: totalRow?.total ?? 0,
			categories,
		};
	}

	findById(id: number) {
		return this.db.get("SELECT * FROM products WHERE id = ?", [id]);
	}

	create(data: {
		name: string;
		description?: string;
		price: number;
		sku: string;
		category: string;
		brand?: string;
	}) {
		const result = this.db.run(
			"INSERT INTO products (name, description, price, sku, category, brand) VALUES (?, ?, ?, ?, ?, ?)",
			[
				data.name,
				data.description || null,
				data.price,
				data.sku,
				data.category,
				data.brand || null,
			],
		);
		return this.db.get("SELECT * FROM products WHERE id = ?", [
			result.lastInsertRowid,
		]);
	}
}
