import { Injectable } from "@nestjs/common";
import type { CreateProduct, Product } from "@zapp/types";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class ProductsService {
	constructor(private readonly db: DatabaseService) {}

	findAll() {
		return this.db.query<Product>("SELECT * FROM products ORDER BY id ASC");
	}

	findById(id: number) {
		return this.db.get<Product>("SELECT * FROM products WHERE id = ?", [id]);
	}

	create(data: CreateProduct) {
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
		return this.db.get<Product>("SELECT * FROM products WHERE id = ?", [
			result.lastInsertRowid,
		]);
	}
}
