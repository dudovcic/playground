import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import type { Page, PageQuery } from "../pagination";

@Injectable()
export class UsersService {
	constructor(private readonly db: DatabaseService) {}

	findAll() {
		return this.db.query("SELECT * FROM users ORDER BY id ASC");
	}

	findPage(query: PageQuery): Page<Record<string, unknown>> {
		const totalRow = this.db.get<{ total: number }>(
			"SELECT COUNT(*) AS total FROM users",
		);
		const data = this.db.query<Record<string, unknown>>(
			"SELECT * FROM users ORDER BY id ASC LIMIT ? OFFSET ?",
			[query.limit, query.offset],
		);
		return {
			data,
			page: query.page,
			limit: query.limit,
			total: totalRow?.total ?? 0,
		};
	}

	findById(id: number) {
		return this.db.get("SELECT * FROM users WHERE id = ?", [id]);
	}

	create(data: { name: string; email: string; phone?: string }) {
		const result = this.db.run(
			"INSERT INTO users (name, email, phone) VALUES (?, ?, ?)",
			[data.name, data.email, data.phone || null],
		);
		return this.db.get("SELECT * FROM users WHERE id = ?", [
			result.lastInsertRowid,
		]);
	}
}
